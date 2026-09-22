# app/api/v1/endpoints/auth.py
import aiosmtplib
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Header, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.core.database import get_db
from app.services.auth_service import AuthService
from app.services.email_service import EmailService, get_email_service
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    ChangePasswordRequest, 
    ForgotPasswordRequest, 
    MessageResponse, 
    OAuthLoginRequest, 
    ResendVerificationRequest, 
    ResetPasswordRequest, 
    TokenResponse, 
    UserCreate, 
    UserLogin, 
    RefreshTokenRequest, 
    UserResponse, 
    VerifyEmailRequest
)
from app.api.dependencies import get_current_user, require_authenticated, require_admin
from app.core.response_utils import strip_none_values
from app.core.config import settings
from app.repositories.profile_repository import VendorProfileRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Updated dependency to include email service
async def get_auth_service(
    db: AsyncSession = Depends(get_db),
    email_service: EmailService = Depends(get_email_service)
    
) -> AuthService:
    return AuthService(
        user_repository=UserRepository(db),
        vendor_profile_repository=VendorProfileRepository(db),
        email_service=email_service
    )

@router.post("/register")
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    print(f"role: {user_data.role}")
    result = await auth_service.register_user(user_data)
    return strip_none_values({
        "message": "User registered successfully",
        "user": UserResponse.model_validate(result["user"]),
        "accessToken": result["accessToken"],
        "refreshToken": result["refreshToken"],
        "token_type": "bearer"
    })

@router.post("/login")
async def login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = await auth_service.login_user(login_data)
    return strip_none_values({
        "message": "Login successful",
        "user": UserResponse.model_validate(result["user"]),
        "accessToken": result["accessToken"],
        "refreshToken": result["refreshToken"],
        "token_type": "bearer"
    })

@router.post("/refresh")
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.refresh_access_token(refresh_data.refresh_token)

# @router.get("/me", response_model=UserResponse)
# async def get_current_user_info(
#     current_user: Dict[str, Any] = Depends(require_authenticated)
# ):
#     return UserResponse.model_validate(current_user["user"])

@router.post("/logout")
async def logout(current_user: Dict[str, Any] = Depends(require_authenticated)):
    return strip_none_values({"message": "Logged out successfully"})

# @router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_account(
#     current_user: Dict[str, Any] = Depends(require_admin),
#     auth_service: AuthService = Depends(get_auth_service)
# ):
#     await auth_service.user_repository.delete_user(current_user["user_id"])
#     return None

@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    auth_service: AuthService = Depends(get_auth_service)
):
    await auth_service.change_password(
        user_id=current_user["user_id"],
        current_password=password_data.current_password,
        new_password=password_data.new_password
    )
    return strip_none_values({"message": "Password changed successfully"})

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    forgot_data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Create reset token (valid 15 minutes)
    reset_token = await auth_service.create_password_reset_token(forgot_data.email)
    print(f"generated reset token ${reset_token}")
    # Send reset email in background (non-blocking)
    background_tasks.add_task(
        auth_service.send_password_reset_email,
        forgot_data.email,
        reset_token
    )
    
    return strip_none_values({
        "message": "Password reset email sent. Please check your inbox."
    })

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    reset_data: ResetPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Reset password with token validation
    await auth_service.reset_password(
        token=reset_data.token,
        new_password=reset_data.new_password
    )
    return strip_none_values({"message": "Password reset successfully"})

# ============================================
# EMAIL VERIFICATION ENDPOINTS
# ============================================
@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    token: str = Query(..., description="Verification token"),  # ✅ Correct format
    auth_service: AuthService = Depends(get_auth_service)
):
    await auth_service.verify_email(token)
    return strip_none_values({"message": "Email verified successfully"})

@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    resend_data: ResendVerificationRequest,
    background_tasks: BackgroundTasks,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Create verification token
    verification_token = await auth_service.create_verification_token(resend_data.email)
    
    # Get user to get user_id
    user = await auth_service.user_repository.get_user_by_email(resend_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Send verification email in background
    background_tasks.add_task(
        auth_service.send_verification_email,
        resend_data.email,
        user.id  # Pass user_id instead of token
    )
    
    return strip_none_values({
        "message": "Verification email sent. Please check your inbox."
    })

# ============================================
# OAuth ENDPOINT
# ============================================

@router.post("/oauth/{provider}", response_model=TokenResponse)
async def oauth_login(
    provider: str,
    oauth_data: OAuthLoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = await auth_service.oauth_login(provider, oauth_data.code)
    return strip_none_values({
        "message": f"{provider.capitalize()} login successful",
        "user": UserResponse.model_validate(result["user"]),
        "accessToken": result["accessToken"],
        "refreshToken": result["refreshToken"],
        "token_type": "bearer"
    })

# ============================================
# TOKEN VALIDATION ENDPOINT
# ============================================

@router.get("/validate", response_model=Dict[str, Any])
async def validate_token(
    authorization: str = Header(...),
    auth_service: AuthService = Depends(get_auth_service)
):
    print(f"I am Entered to the auth validation")
    
    # Extract token from "Bearer <token>"
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    token = authorization.split(" ")[1]
    
    result = await auth_service.validate_token(token)
    return strip_none_values({
        "valid": result["valid"],
        "user": result.get("user")
    })

@router.get("/test-email-config")
async def test_email_config():
   
    try:
        print(f"entering.......")
        is_port_465 = int(settings.SMTP_PORT) == 465
        
        smtp = aiosmtplib.SMTP(
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            use_tls=is_port_465,  # Only True for 465
            timeout=10
        )
        print(f"config....")
        
        await smtp.connect()

        print(f"establised the connection")

        
        # 2. Upgrade to STARTTLS if using Port 587
        if not is_port_465 and settings.SMTP_USE_TLS:
            await smtp.starttls()
        
        # 3. Authenticate with your Gmail and App Password
        print(f"username: {settings.SMTP_USERNAME} , password: {settings.SMTP_PASSWORD}")
        await smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        print(f"login successfull")
        await smtp.quit()

        print(f"quit the connection..")
        return {
            "status": "success",
            "message": "SMTP connection successful!",
            "config": {
                "host": settings.SMTP_HOST,
                "port": settings.SMTP_PORT,
                "username": settings.SMTP_USERNAME,
                "use_tls": settings.SMTP_USE_TLS
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "hint": "Check port configuration, ensure App Password lacks spaces, and 2FA is active."
        }



@router.get("/test-email")
async def test_email_endpoint(
    email_service: EmailService = Depends(get_email_service)
):
    """Test endpoint with detailed error reporting"""
    
    try:
        print("Testing email configuration...")
        
        # Attempt to send a test email
        result = await email_service.send_email(
            to_email="eliteinovapythonbackend20@gmail.com",  # Send to yourself
            subject="✅ Test Email from FastAPI Backend",
            html_content="""
                <html>
                    <body>
                        <h1>✅ Test Email</h1>
                        <p>Your email service is working correctly!</p>
                        <p><strong>Time:</strong> {current_time}</p>
                    </body>
                </html>
            """,
            text_content="Your email service is working correctly!"
        )
        
        if result:
            return {
                "status": "success",
                "message": "Test email sent successfully! Check your inbox.",
                "details": {
                    "from": email_service.from_email,
                    "to": "eliteinovapythonbackend20@gmail.com",
                    "smtp_host": email_service.smtp_config["hostname"],
                    "smtp_port": email_service.smtp_config["port"]
                }
            }
        else:
            return {
                "status": "error",
                "message": "Failed to send test email. Check server logs for details."
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "error_type": type(e).__name__
        }

