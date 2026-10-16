# app/api/v1/endpoints/auth.py
from typing import Union

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Header, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.core.database import get_db
from app.services.auth_service import AuthService
from app.services.email_service import EmailService, get_email_service
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    AccessTokenResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginResponse,
    MessageResponse,
    ResendVerificationRequest,
    ResetOtpVerifiedResponse,
    ResetPasswordRequest,
    TwoFactorRequiredResponse,
    UserCreate,
    UserLogin,
    RefreshTokenRequest,
    UserResponse,
    ValidateTokenResponse,
    VerifyEmailRequest,
    VerifyPasswordResetOtpRequest
)
from app.api.dependencies import get_current_user, require_authenticated, require_admin
from app.repositories.profile_repository import VendorProfileRepository
from app.services.two_factor_service import TwoFactorService
from app.schemas.auth import (
    TwoFactorConfirmRequest,
    TwoFactorConfirmResponse,
    TwoFactorDisableRequest,
    TwoFactorSetupResponse,
    TwoFactorVerifyRequest,
)

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

async def get_two_factor_service(db: AsyncSession = Depends(get_db)) -> TwoFactorService:
    return TwoFactorService(UserRepository(db))

@router.post("/register", response_model=LoginResponse)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    print(f"role: {user_data.role}")
    result = await auth_service.register_user(user_data)
    return LoginResponse(
        message="User registered successfully",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )

@router.post("/login", response_model=Union[TwoFactorRequiredResponse, LoginResponse])
async def login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = await auth_service.login_user(login_data)
    if result.get("requires_2fa"):
        return TwoFactorRequiredResponse(pending_token=result["pending_token"])
    return LoginResponse(
        message="Login successful",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )

@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = await auth_service.refresh_access_token(refresh_data.refresh_token)
    return AccessTokenResponse.model_validate(result)

# @router.get("/me", response_model=UserResponse)
# async def get_current_user_info(
#     current_user: Dict[str, Any] = Depends(require_authenticated)
# ):
#     return UserResponse.model_validate(current_user["user"])

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: Dict[str, Any] = Depends(require_authenticated)):
    return MessageResponse(message="Logged out successfully")

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
    return MessageResponse(message="Password changed successfully")

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    forgot_data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    auth_service: AuthService = Depends(get_auth_service)
):
    # Same message whether or not the email exists, and whether or not it's
    # within the resend cooldown - an account probe shouldn't learn more than
    # "something may have happened". Only an actually-too-soon resend surfaces
    # as its own error, since the frontend needs that to run its countdown.
    otp = await auth_service.request_password_reset_otp(forgot_data.email)
    if otp:
        background_tasks.add_task(
            auth_service.send_password_reset_otp_email,
            forgot_data.email,
            otp
        )

    return MessageResponse(message="If that email is registered, a verification code has been sent.")

@router.post("/verify-reset-otp", response_model=ResetOtpVerifiedResponse)
async def verify_reset_otp(
    verify_data: VerifyPasswordResetOtpRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    reset_token = await auth_service.verify_password_reset_otp(verify_data.email, verify_data.otp)
    return ResetOtpVerifiedResponse(message="Code verified", resetToken=reset_token)

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
    return MessageResponse(message="Password reset successfully")

# ============================================
# EMAIL VERIFICATION ENDPOINTS
# ============================================
@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    token: str = Query(..., description="Verification token"),  # ✅ Correct format
    auth_service: AuthService = Depends(get_auth_service)
):
    await auth_service.verify_email(token)
    return MessageResponse(message="Email verified successfully")

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
    
    return MessageResponse(message="Verification email sent. Please check your inbox.")

# ============================================
# TWO-FACTOR (TOTP) ENDPOINTS
# ============================================

@router.post("/2fa/setup", response_model=TwoFactorSetupResponse)
async def two_factor_setup(
    current_user: Dict[str, Any] = Depends(require_authenticated),
    two_factor_service: TwoFactorService = Depends(get_two_factor_service)
):
    result = await two_factor_service.begin_setup(current_user["user_id"])
    return TwoFactorSetupResponse.model_validate(result)

@router.post("/2fa/verify-setup", response_model=TwoFactorConfirmResponse)
async def two_factor_verify_setup(
    confirm_data: TwoFactorConfirmRequest,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    two_factor_service: TwoFactorService = Depends(get_two_factor_service)
):
    recovery_codes = await two_factor_service.confirm_setup(current_user["user_id"], confirm_data.code)
    return TwoFactorConfirmResponse(
        message="Two-factor authentication enabled. Store these recovery codes safely; they are shown only once.",
        recovery_codes=recovery_codes,
    )

@router.post("/2fa/verify", response_model=LoginResponse)
async def two_factor_verify(
    verify_data: TwoFactorVerifyRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    result = await auth_service.complete_two_factor_login(verify_data.pending_token, verify_data.code)
    return LoginResponse(
        message="Login successful",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )

@router.post("/2fa/disable", response_model=MessageResponse)
async def two_factor_disable(
    disable_data: TwoFactorDisableRequest,
    current_user: Dict[str, Any] = Depends(require_authenticated),
    two_factor_service: TwoFactorService = Depends(get_two_factor_service)
):
    await two_factor_service.disable(current_user["user_id"], disable_data.password, disable_data.code)
    return MessageResponse(message="Two-factor authentication disabled")

# ============================================
# TOKEN VALIDATION ENDPOINT
# ============================================

@router.get("/validate", response_model=ValidateTokenResponse)
async def validate_token(
    authorization: str = Header(...),
    auth_service: AuthService = Depends(get_auth_service)
):
    # Extract token from "Bearer <token>"
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )

    token = authorization.split(" ")[1]

    result = await auth_service.validate_token(token)
    return ValidateTokenResponse.model_validate(result)

@router.get("/seed-admin", response_model=MessageResponse)
async def seed_admin(
    auth_service: AuthService = Depends(get_auth_service)
):
    await auth_service.seed_admin_user()
    return MessageResponse(message="Admin user created successfully")

