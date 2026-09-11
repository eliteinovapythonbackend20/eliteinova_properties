# from fastapi import HTTPException, status, BackgroundTasks
# from typing import Dict, Any, Optional
# from datetime import datetime, timedelta
# import secrets
# import hashlib
# from app.models import user
# from app.repositories.user_repository import UserRepository
# from app.core.security import Security
# from app.schemas.auth import UserCreate, UserLogin, UserResponse
# from app.core.config import settings
# from sqlalchemy.ext.asyncio import AsyncSession

# class AuthService:
#     def __init__(self, user_repository: UserRepository):
#         self.user_repository = user_repository
#         self.reset_token_expire_hours = 24
#         self.verification_token_expire_hours = 48


#     async def register_user(self, user_data: UserCreate) -> Dict[str, Any]:
#         existing = await self.user_repository.get_user_by_email(user_data.email)
#         if existing:
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
#         # user_data = user_data.role.lower()
#         # print(f"user data role: {user_data}")
#         user = await self.user_repository.create_user(user_data.dict())

#         user_dto = self._user_to_dict(user);
        
#         access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "email": user.email,
#             "role": user.role
#         })
#         refresh_token = Security.create_refresh_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "role": user.role
#         })
        
#         return {"user": user_dto, "access_token": access_token, "refresh_token": refresh_token}
    
#     async def login_user(self, login_data: UserLogin) -> Dict[str, Any]:
#         user = await self.user_repository.get_user_by_email(login_data.email)
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
#         if not user.is_active:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
#         if not Security.verify_password(login_data.password, user.password_hash):
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
#         await self.user_repository.update_last_login(user.id)
#         # await self.db.refresh(user)
#         userDto = self._user_to_dict(user)
#         access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "email": user.email,
#             "role": user.role
#         })
#         refresh_token = Security.create_refresh_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "role": user.role
#         })
        
#         return {"user": userDto, "access_token": access_token, "refresh_token": refresh_token}
    
#     async def get_current_user(self, token: str) -> Dict[str, Any]:
#         payload = Security.decode_token(token)
#         user_id = payload.get("user_id")
#         if not user_id:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

#         if not user.is_active:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
#         return {"user": user, "user_id": user.id, "email": user.email, "role": user.role}

#     def _user_to_dict(self, user: user) -> Dict[str, Any]:
#         return {
#             "id": user.id,
#             "email": user.email,
#             "full_name": user.full_name,
#             "phone_number": user.phone_number,
#             "role": user.role,
#             "status": user.status,
#             "is_verified": user.is_verified,
#             "is_active": user.is_active,
#             "created_at": user.created_at,
#             # "updated_at": getattr(user, 'updated_at', None),
#         }

#     async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
#         payload = Security.decode_token(refresh_token)
#         user_id = payload.get("user_id")
#         print(f"Decoded payload: {payload}")
#         if not user_id:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
#         if not user.is_active:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
#         new_access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "email": user.email,
#             "role": user.role
#         })
        
#         return {"access_token": new_access_token, "token_type": "bearer"}

#     # ============================================
#     # NEW METHODS FOR PASSWORD MANAGEMENT
#     # ============================================

#     async def change_password(
#         self, 
#         user_id: int, 
#         current_password: str, 
#         new_password: str
#     ) -> None:
#         """Change user password"""
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User not found"
#             )
        
#         # Verify current password
#         if not Security.verify_password(current_password, user.password_hash):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Current password is incorrect"
#             )
        
#         # Hash new password
#         hashed_password = Security.hash_password(new_password)
#         await self.user_repository.update_password(user_id, hashed_password)

#     async def create_password_reset_token(self, email: str) -> str:
#         """Create password reset token"""
#         user = await self.user_repository.get_user_by_email(email)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User not found"
#             )
        
#         # Generate reset token
#         reset_token = secrets.token_urlsafe(32)
        
#         # Store token hash in database
#         token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
#         expires_at = datetime.utcnow() + timedelta(hours=self.reset_token_expire_hours)
        
#         await self.user_repository.save_reset_token(user.id, token_hash, expires_at)
        
#         return reset_token

#     async def reset_password(self, token: str, new_password: str) -> None:
#         """Reset password using token"""
#         token_hash = hashlib.sha256(token.encode()).hexdigest()
        
#         # Find user by reset token
#         user = await self.user_repository.get_by_reset_token(token_hash)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid or expired reset token"
#             )
        
#         # Hash new password
#         hashed_password = Security.hash_password(new_password)
#         await self.user_repository.update_password(user.id, hashed_password)
        
#         # Clear reset token
#         await self.user_repository.clear_reset_token(user.id)

#     async def send_password_reset_email(self, email: str, token: str) -> None:
#         """Send password reset email"""
#         user = await self.user_repository.get_user_by_email(email)
#         if not user:
#             return
        
#         reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        
#         # TODO: Implement email sending with your email service
#         # await email_service.send_email(
#         #     to=email,
#         #     subject="Password Reset Request",
#         #     template="password_reset.html",
#         #     context={"reset_link": reset_link, "name": user.full_name or user.email}
#         # )
#         print(f"Password reset link for {email}: {reset_link}")
#         return None

#     # ============================================
#     # NEW METHODS FOR EMAIL VERIFICATION
#     # ============================================

#     async def create_verification_token(self, email: str) -> str:
#         """Create email verification token"""
#         user = await self.user_repository.get_user_by_email(email)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User not found"
#             )
        
#         # Generate verification token
#         verification_token = secrets.token_urlsafe(32)
        
#         # Store token hash in database
#         token_hash = hashlib.sha256(verification_token.encode()).hexdigest()
#         expires_at = datetime.utcnow() + timedelta(hours=self.verification_token_expire_hours)
        
#         await self.user_repository.save_verification_token(user.id, token_hash, expires_at)
        
#         return verification_token

#     async def verify_email(self, token: str) -> None:
#         """Verify user email using token"""
#         token_hash = hashlib.sha256(token.encode()).hexdigest()
        
#         # Find user by verification token
#         user = await self.user_repository.get_by_verification_token(token_hash)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid or expired verification token"
#             )
        
#         # Mark email as verified
#         await self.user_repository.verify_email(user.id)

#     async def send_verification_email(self, email: str, user_id: int) -> None:
#         """Send verification email"""
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             return
        
#         # Create verification token
#         verification_token = await self.create_verification_token(email)
#         verify_link = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        
#         # TODO: Implement email sending with your email service
#         # await email_service.send_email(
#         #     to=email,
#         #     subject="Verify Your Email",
#         #     template="verify_email.html",
#         #     context={"verify_link": verify_link, "name": user.full_name or user.email}
#         # )
#         print(f"Verification link for {email}: {verify_link}")
#         return None

#     # ============================================
#     # TOKEN VALIDATION
#     # ============================================

#     async def validate_token(self, token: str) -> Dict[str, Any]:
#         """Validate JWT token"""
#         try:
#             payload = Security.decode_token(token)
#             user_id = payload.get("user_id")
#             print(f"payload ${payload}")
#             if not user_id:
#                 return {"valid": False, "error": "Invalid token payload"}
            
#             user = await self.user_repository.get_user_by_id(user_id)
            
#             if not user:
#                 return {"valid": False, "error": "User not found"}
            
#             if not user.is_active:
#                 return {"valid": False, "error": "User account is inactive"}

#             print(f"user info ${user}")
#             return {
#                 "valid": True,
#                 "user": user
#             }
            
#         except Exception as e:
#             return {"valid": False, "error": str(e)}

#     # ============================================
#     # OAuth LOGIN
#     # ============================================

#     async def oauth_login(self, provider: str, code: str) -> Dict[str, Any]:
#         """Handle OAuth login"""
#         # TODO: Implement OAuth logic for different providers
#         # 1. Exchange code for access token
#         # 2. Get user info from provider
#         # 3. Create or retrieve user
#         # 4. Generate JWT tokens
        
#         # Placeholder implementation
#         email = f"{provider}_user_{code[:8]}@example.com"
#         user = await self.user_repository.get_user_by_email(email)
        
#         if not user:
#             user = await self.user_repository.create_oauth_user(
#                 email=email,
#                 full_name=f"{provider.capitalize()} User",
#                 provider=provider,
#                 provider_id=code[:20]
#             )
        
#         # Generate tokens
#         access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "email": user.email,
#             "role": user.role
#         })
#         refresh_token = Security.create_refresh_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "role": user.role
#         })
        
#         return {
#             "user": user,
#             "access_token": access_token,
#             "refresh_token": refresh_token
#         }





# # app/services/auth_service.py
# from fastapi import HTTPException, status, BackgroundTasks
# from typing import Dict, Any, Optional
# from datetime import datetime, timedelta
# import secrets
# import hashlib  # Keep this for token hashing (different from password hashing)
# import logging
# from app.models import user
# from app.repositories.user_repository import UserRepository
# from app.core.security import Security
# from app.schemas.auth import UserCreate, UserLogin, UserResponse
# from app.core.config import settings
# from app.services.email_service import EmailService
# from sqlalchemy.ext.asyncio import AsyncSession

# logger = logging.getLogger(__name__)


# class AuthService:
#     def __init__(
#         self, 
#         user_repository: UserRepository,
#         email_service: Optional[EmailService] = None
#     ):
#         self.user_repository = user_repository
#         self.email_service = email_service
#         # Changed to minutes for better security (15 minutes)
#         self.reset_token_expire_minutes = 15
#         self.verification_token_expire_hours = 24


#     async def register_user(self, user_data: UserCreate) -> Dict[str, Any]:
#         existing = await self.user_repository.get_user_by_email(user_data.email)
#         if existing:
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
#         user = await self.user_repository.create_user(user_data.dict())
#         user_dto = self._user_to_dict(user)
        
#         access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "vendor_types":user.vendor_types or [],
#             "role": user.role
#         })
#         refresh_token = Security.create_refresh_token(data={
#             "sub": user.email,
#             "vendor_types":user.vendor_types,
#             "user_id": user.id,
#             "role": user.role
#         })
        
#         return {"user": user_dto, "accessToken": access_token, "refreshToken": refresh_token}
    
#     async def login_user(self, login_data: UserLogin) -> Dict[str, Any]:
#         user = await self.user_repository.get_user_by_email(login_data.email)
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
#         if not user.is_active:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
#         if not Security.verify_password(login_data.password, user.password_hash):
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
#         await self.user_repository.update_last_login(user.id)
#         userDto = self._user_to_dict(user)
#         access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "vendor_types":user.vendor_types or [],
#             "role": user.role
#         })
#         refresh_token = Security.create_refresh_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "vendor_types":user.vendor_types,
#             "role": user.role
#         })
        
#         return {"user": userDto, "accessToken": access_token, "refreshToken": refresh_token}
    
#     async def get_current_user(self, token: str) -> Dict[str, Any]:
#         payload = Security.decode_token(token)
#         user_id = payload.get("user_id")
#         if not user_id:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

#         if not user.is_active:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
#         return {"user": user, "user_id": user.id, "vendor_types":user.vendor_types, "role": user.role}

#     def _user_to_dict(self, user: user) -> Dict[str, Any]:
#         return {
#             "id": user.id,
#             "email": user.email,
#             "full_name": user.full_name,
#             "phone_number": user.phone_number,
#             "role": user.role,
#             "vendor_types":user.vendor_types,
#             "status": user.status,
#             "is_verified": user.is_verified,
#             "is_active": user.is_active,
#             "created_at": user.created_at,
#         }

#     async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
#         payload = Security.decode_token(refresh_token)
#         if payload.get("type") != "refresh":
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

#         user = self.user_repository.get_user_by_email(payload.get('sub'))

#         result = Security.refresh_access_token(user)
#         return result

#     # ============================================
#     # PASSWORD MANAGEMENT
#     # ============================================

#     async def change_password(
#         self, 
#         user_id: int, 
#         current_password: str, 
#         new_password: str
#     ) -> None:
#         """Change user password"""
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User not found"
#             )
        
#         # Verify current password using Security class
#         if not Security.verify_password(current_password, user.password_hash):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Current password is incorrect"
#             )
        
#         # Hash new password using Security class
#         hashed_password = Security.hash_password(new_password)
#         await self.user_repository.update_password(user_id, hashed_password)

#     async def create_password_reset_token(self, email: str) -> str:
#         """Create password reset token (valid 15 minutes)"""
#         user = await self.user_repository.get_user_by_email(email)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User not found"
#             )
        
#         # Generate reset token
#         reset_token = secrets.token_urlsafe(32)
        
#         # Store token hash in database (using hashlib for token verification)
#         token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
#         expires_at = datetime.utcnow() + timedelta(minutes=self.reset_token_expire_minutes)
        
#         await self.user_repository.save_reset_token(user.id, token_hash, expires_at)
        
#         return reset_token

#     async def reset_password(self, token: str, new_password: str) -> None:
#         """Reset password using token"""
#         token_hash = hashlib.sha256(token.encode()).hexdigest()
        
#         # Find user by reset token
#         user = await self.user_repository.get_by_reset_token(token_hash)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid or expired reset token"
#             )
        
#         # Check if token is expired
#         if user.reset_token_expires_at and user.reset_token_expires_at < datetime.utcnow():
#             # Clear expired token
#             await self.user_repository.clear_reset_token(user.id)
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Reset token has expired"
#             )
        
#         # Hash new password using Security class
#         hashed_password = Security.hash_password(new_password)
#         await self.user_repository.update_password(user.id, hashed_password)
        
#         # Clear reset token
#         await self.user_repository.clear_reset_token(user.id)

#     async def send_password_reset_email(self, email: str, token: str) -> None:
#         """Send password reset email using email service"""
#         if not self.email_service:
#             logger.warning("Email service not configured - skipping email send")
#             return
        
#         user = await self.user_repository.get_user_by_email(email)
#         if not user:
#             logger.warning(f"Attempt to send reset email to non-existent user: {email}")
#             return
        
#         # Send email using email service
#         success = await self.email_service.send_password_reset_email(
#             email=email,
#             reset_token=token,
#             user_name=user.full_name or user.email
#         )
        
#         if success:
#             logger.info(f"Password reset email sent to {email}")
#         else:
#             logger.error(f"Failed to send password reset email to {email}")

#     # ============================================
#     # EMAIL VERIFICATION
#     # ============================================

#     async def create_verification_token(self, email: str) -> str:
#         """Create email verification token"""
#         user = await self.user_repository.get_user_by_email(email)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="User not found"
#             )
        
#         # Generate verification token
#         verification_token = secrets.token_urlsafe(32)
        
#         # Store token hash in database
#         token_hash = hashlib.sha256(verification_token.encode()).hexdigest()
#         expires_at = datetime.utcnow() + timedelta(hours=self.verification_token_expire_hours)
        
#         await self.user_repository.save_verification_token(user.id, token_hash, expires_at)
        
#         return verification_token

#     async def verify_email(self, token: str) -> None:
#         """Verify user email using token"""
#         token_hash = hashlib.sha256(token.encode()).hexdigest()
        
#         # Find user by verification token
#         user = await self.user_repository.get_by_verification_token(token_hash)
#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid or expired verification token"
#             )
        
#         # Check if token is expired
#         if user.verification_token_expires_at and user.verification_token_expires_at < datetime.utcnow():
#             # Clear expired token
#             await self.user_repository.clear_verification_token(user.id)
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Verification token has expired"
#             )
        
#         # Mark email as verified
#         await self.user_repository.verify_email(user.id)
        
#         # Clear verification token
#         await self.user_repository.clear_verification_token(user.id)

#     async def send_verification_email(self, email: str, user_id: int) -> None:
#         """Send verification email using email service"""
#         if not self.email_service:
#             logger.warning("Email service not configured - skipping email send")
#             return
        
#         user = await self.user_repository.get_user_by_id(user_id)
#         if not user:
#             logger.warning(f"Attempt to send verification email to non-existent user: {user_id}")
#             return
        
#         # Create verification token
#         verification_token = await self.create_verification_token(email)
        
#         # Send email using email service
#         success = await self.email_service.send_verification_email(
#             email=email,
#             verification_token=verification_token,
#             user_name=user.full_name or user.email
#         )
        
#         if success:
#             logger.info(f"Verification email sent to {email}")
#         else:
#             logger.error(f"Failed to send verification email to {email}")

#     # ============================================
#     # TOKEN VALIDATION
#     # ============================================

#     async def validate_token(self, token: str) -> Dict[str, Any]:
#         """Validate JWT token"""
#         try:
#             # Using Security class decode_token method
#             payload = Security.decode_token(token)
#             user_id = payload.get("user_id")
#             logger.info(f"Validating token payload: {payload}")
            
#             if not user_id:
#                 return {"valid": False, "error": "Invalid token payload"}
            
#             user = await self.user_repository.get_user_by_id(user_id)
            
#             if not user:
#                 return {"valid": False, "error": "User not found"}
            
#             if not user.is_active:
#                 return {"valid": False, "error": "User account is inactive"}

#             logger.info(f"Token validated for user: {user.id}")
#             return {
#                 "valid": True,
#                 "user": user
#             }
            
#         except Exception as e:
#             logger.error(f"Token validation error: {str(e)}")
#             return {"valid": False, "error": str(e)}

#     # ============================================
#     # OAuth LOGIN
#     # ============================================

#     async def oauth_login(self, provider: str, code: str) -> Dict[str, Any]:
#         """Handle OAuth login"""
#         # TODO: Implement OAuth logic for different providers
#         # 1. Exchange code for access token
#         # 2. Get user info from provider
#         # 3. Create or retrieve user
#         # 4. Generate JWT tokens
        
#         # Placeholder implementation
#         email = f"{provider}_user_{code[:8]}@example.com"
#         user = await self.user_repository.get_user_by_email(email)
        
#         if not user:
#             user = await self.user_repository.create_oauth_user(
#                 email=email,
#                 full_name=f"{provider.capitalize()} User",
#                 provider=provider,
#                 provider_id=code[:20]
#             )
        
#         # Generate tokens using Security class
#         access_token = Security.create_access_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "vendor_types":user.vendor_types,
#             "role": user.role
#         })
#         refresh_token = Security.create_refresh_token(data={
#             "sub": user.email,
#             "user_id": user.id,
#             "role": user.role
#         })
        
#         return {
#             "user": user,
#             "accessToken": access_token,
#             "refreshToken": refresh_token
#         }
















































# app/services/auth_service.py
from fastapi import HTTPException, status, BackgroundTasks
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import secrets
import hashlib
import logging
from app.models import user
from app.repositories.user_repository import UserRepository
from app.core.security import Security
from app.schemas.auth import UserCreate, UserLogin, UserResponse
from app.core.config import settings
from app.services.email_service import EmailService
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.profile_repository import VendorProfileRepository

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(
        self, 
        user_repository: UserRepository,
        vendor_profile_repository: VendorProfileRepository,
        email_service: Optional[EmailService] = None
    ):
        self.user_repository = user_repository
        self.vendor_repository = vendor_profile_repository
        self.email_service = email_service
        # Changed to minutes for better security (15 minutes)
        self.reset_token_expire_minutes = 15
        self.verification_token_expire_hours = 24

    async def register_user(self, user_data: UserCreate) -> Dict[str, Any]:
        
        existing = await self.user_repository.get_user_by_email(user_data.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
        user = await self.user_repository.create_user(user_data.dict())
        user_dto = self._user_to_dict(user)
        
        access_token = Security.create_access_token(data={
            "sub": user.email,
            "user_id": user.id,
            "vendor_types": user.vendor_types or [],
            "role": user.role
        })
        refresh_token = Security.create_refresh_token(data={
            "sub": user.email,
            "vendor_types": user.vendor_types,
            "user_id": user.id,
            "role": user.role
        })
        
        # Send verification email in background if email service is available
        if self.email_service:
            try:
                if user.role == "user":
                    customer = await self.user_repository.get_customer_by_user_id(user.id)
                elif user.role == "vendor":
                    vendor = await self.vendor_repository.get_vendor_profile(user.id)

                name = customer.full_name or vendor.full_name
                # Create verification token
                verification_token = await self.create_verification_token(user.email)
                # Send verification email
                await self.email_service.send_verification_email(
                    email=user.email,
                    verification_token=verification_token,
                    user_name=name or user.email
                )
                logger.info(f"Verification email sent to {user.email}")
            except Exception as e:
                logger.error(f"Failed to send verification email to {user.email}: {e}")
        
        return {"user": user_dto, "accessToken": access_token, "refreshToken": refresh_token}
    
    async def login_user(self, login_data: UserLogin) -> Dict[str, Any]:
        user = await self.user_repository.get_user_by_email(login_data.email)
        role = user.role
        if role == "user":
            customer = await self.user_repository.get_customer_by_user_id(user.user_id)
        elif role == "vendor":
            vendor = await self.vendor_repository.get_vendor_profile(user.user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
        if not Security.verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
        await self.user_repository.update_last_login(user.id)
        user_obj = {"name":customer.full_name or vendor.full_name,
                    "phoneNumber":customer.phone_number or vendor.phone_number
                    }
        user = user.update(user_obj)
        userDto = self._user_to_dict(user)
        access_token = Security.create_access_token(data={
            "sub": user.email,
            "user_id": user.id,
            "vendor_types": user.vendor_types or [],
            "role": user.role
        })
        refresh_token = Security.create_refresh_token(data={
            "sub": user.email,
            "user_id": user.id,
            "vendor_types": user.vendor_types,
            "role": user.role
        })
        
        return {"user": userDto, "accessToken": access_token, "refreshToken": refresh_token}
    
    async def get_current_user(self, token: str) -> Dict[str, Any]:
        payload = Security.decode_token(token)
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        user = await self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
        
        return {"user": user, "user_id": user.id, "vendor_types": user.vendor_types, "role": user.role}

    def _user_to_dict(self, user: user) -> Dict[str, Any]:
        return {
            "id": user.id,
            "email": user.email,
            "name" : user.name,
            "phoneNumber": user.phoneNumber,
            "role": user.role,
            "vendor_types": user.vendor_types,
            "status": user.status,
            "is_verified": user.is_verified,
            "is_active": user.is_active,
            "created_at": user.created_at,
        }

    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        payload = Security.decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

        user = await self.user_repository.get_user_by_email(payload.get('sub'))
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        result = Security.refresh_access_token(user)
        return result

    # ============================================
    # PASSWORD MANAGEMENT
    # ============================================

    async def change_password(
        self, 
        user_id: int, 
        current_password: str, 
        new_password: str
    ) -> None:
        """Change user password"""
        user = await self.user_repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password using Security class
        if not Security.verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Hash new password using Security class
        hashed_password = Security.hash_password(new_password)
        await self.user_repository.update_password(user_id, hashed_password)

    async def create_password_reset_token(self, email: str) -> str:
        """Create password reset token (valid 15 minutes)"""
        user = await self.user_repository.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        
        # Store token hash in database
        token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(minutes=self.reset_token_expire_minutes)
        
        await self.user_repository.save_reset_token(user.id, token_hash, expires_at)
        
        return reset_token

    async def reset_password(self, token: str, new_password: str) -> None:
        """Reset password using token"""
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        # Find user by reset token
        user = await self.user_repository.get_by_reset_token(token_hash)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Check if token is expired
        if user.reset_token_expires_at and user.reset_token_expires_at < datetime.utcnow():
            # Clear expired token
            await self.user_repository.clear_reset_token(user.id)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired"
            )
        
        # Hash new password using Security class
        hashed_password = Security.hash_password(new_password)
        await self.user_repository.update_password(user.id, hashed_password)
        
        # Clear reset token
        await self.user_repository.clear_reset_token(user.id)

    async def send_password_reset_email(self, email: str, token: str) -> None:
        """Send password reset email using email service"""
        if not self.email_service:
            logger.warning("Email service not configured - skipping email send")
            return
        
        user = await self.user_repository.get_user_by_email(email)
        if not user:
            logger.warning(f"Attempt to send reset email to non-existent user: {email}")
            return
        
        try:
            if user.role == "user":
                customer = await self.user_repository.get_customer_by_user_id(user.id)
            elif user.role == "vendor":
                vendor = await self.vendor_repository.get_vendor_profile(user.id)

            name = customer.full_name or vendor.full_name
            # Send email using email service
            success = await self.email_service.send_password_reset_email(
                email=email,
                reset_token=token,
                user_name=name or user.email
            )
            
            if success:
                logger.info(f"Password reset email sent to {email}")
            else:
                logger.error(f"Failed to send password reset email to {email}")
                
        except Exception as e:
            logger.error(f"Exception while sending password reset email to {email}: {e}", exc_info=True)

    # ============================================
    # EMAIL VERIFICATION
    # ============================================

    async def create_verification_token(self, email: str) -> str:
        """Create email verification token"""
        user = await self.user_repository.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Store token hash in database
        token_hash = hashlib.sha256(verification_token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(hours=self.verification_token_expire_hours)
        
        await self.user_repository.save_verification_token(user.id, token_hash, expires_at)
        
        return verification_token

    async def verify_email(self, token: str) -> None:
        """Verify user email using token"""
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        # Find user by verification token
        user = await self.user_repository.get_by_verification_token(token_hash)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token"
            )
        
        # Check if token is expired
        if user.verification_token_expires_at and user.verification_token_expires_at < datetime.utcnow():
            # Clear expired token
            await self.user_repository.clear_verification_token(user.id)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification token has expired"
            )
        
        # Mark email as verified
        await self.user_repository.verify_email(user.id)
        
        # Clear verification token
        await self.user_repository.clear_verification_token(user.id)

    async def send_verification_email(self, email: str, user_id: int) -> None:
        """Send verification email using email service"""
        if not self.email_service:
            logger.warning("Email service not configured - skipping email send")
            return
        
        user = await self.user_repository.get_user_by_id(user_id)
        if not user:
            logger.warning(f"Attempt to send verification email to non-existent user: {user_id}")
            return
        
        try:
            # Create verification token
            verification_token = await self.create_verification_token(email)
            if user.role == "user":
                customer = await self.user_repository.get_customer_by_user_id(user.id)
            elif user.role == "vendor":
                vendor = await self.vendor_repository.get_vendor_profile(user.id)

            name = customer.full_name or vendor.full_name
            # Send email using email service
            success = await self.email_service.send_verification_email(
                email=email,
                verification_token=verification_token,
                user_name=name or user.email
            )
            
            if success:
                logger.info(f"Verification email sent to {email}")
            else:
                logger.error(f"Failed to send verification email to {email}")
                
        except Exception as e:
            logger.error(f"Exception while sending verification email to {email}: {e}", exc_info=True)

    # ============================================
    # TOKEN VALIDATION
    # ============================================

    async def validate_token(self, token: str) -> Dict[str, Any]:
        """Validate JWT token"""
        try:
            # Using Security class decode_token method
            payload = Security.decode_token(token)
            user_id = payload.get("user_id")
            logger.info(f"Validating token payload: {payload}")
            
            if not user_id:
                return {"valid": False, "error": "Invalid token payload"}
            
            user = await self.user_repository.get_user_by_id(user_id)
            
            if not user:
                return {"valid": False, "error": "User not found"}
            
            if not user.is_active:
                return {"valid": False, "error": "User account is inactive"}

            logger.info(f"Token validated for user: {user.id}")
            return {
                "valid": True,
                "user": user
            }
            
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return {"valid": False, "error": str(e)}

    # ============================================
    # OAuth LOGIN
    # ============================================

    async def oauth_login(self, provider: str, code: str) -> Dict[str, Any]:
        """Handle OAuth login"""
        # TODO: Implement OAuth logic for different providers
        # 1. Exchange code for access token
        # 2. Get user info from provider
        # 3. Create or retrieve user
        # 4. Generate JWT tokens
        
        # Placeholder implementation
        email = f"{provider}_user_{code[:8]}@example.com"
        user = await self.user_repository.get_user_by_email(email)
        
        if not user:
            user = await self.user_repository.create_oauth_user(
                email=email,
                full_name=f"{provider.capitalize()} User",
                provider=provider,
                provider_id=code[:20]
            )
        
        # Generate tokens using Security class
        access_token = Security.create_access_token(data={
            "sub": user.email,
            "user_id": user.id,
            "vendor_types": user.vendor_types,
            "role": user.role
        })
        refresh_token = Security.create_refresh_token(data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role
        })
        
        return {
            "user": user,
            "accessToken": access_token,
            "refreshToken": refresh_token
        }