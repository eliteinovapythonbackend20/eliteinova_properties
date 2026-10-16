# app/services/auth_service.py
from fastapi import HTTPException, status, BackgroundTasks
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
import secrets
import hashlib
import logging
from app.models import user
from app.repositories.user_repository import UserRepository
from app.core import totp
from app.core.security import Security
from app.schemas.auth import CreateOfficeUserRequest, UserCreate, UserLogin, UserResponse
from app.core.config import settings
from app.services.email_service import EmailService
from app.services.two_factor_service import TwoFactorService
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.display_name import resolve_avatar_url, resolve_display_name, resolve_phone_number

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(
        self, 
        user_repository: UserRepository,
        vendor_profile_repository,
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
            "role": user.role
        })
        refresh_token = Security.create_refresh_token(data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role
        })

        # Send verification email in background if email service is available
        if self.email_service:
            try:
                name = await resolve_display_name(self.user_repository, self.vendor_repository, user.id)
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
        # exist = await self.user_repository.get_user_by_email("eliteinovaproperty@gmail.com")
        # if not exist:
        #     admin_cred = await self.user_repository.create_admin({
        #                 "email": "eliteinovaproperty@gmail.com",
        #                 "password": "Eliteinova@123",
        #             })
        #     print(f"Admin credentials: {admin_cred.email}, {admin_cred.password_hash}")  
        user = await self.user_repository.get_user_by_email(login_data.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

        if not Security.verify_password(login_data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        if user.totp_enabled:
            return {
                "requires_2fa": True,
                "pending_token": totp.create_pending_2fa_token(user.id, user.email),
            }

        await self.user_repository.update_last_login(user.id)

        # `name`/`phoneNumber` aren't real columns on User - attach them as plain
        # attributes (same pattern as UserRepository.create_user) so _user_to_dict
        # can read a display name/phone without crashing on a missing attribute.
        await self._attach_profile_fields(user)
        userDto = self._user_to_dict(user)
        access_token = Security.create_access_token(data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role
        })
        refresh_token = Security.create_refresh_token(data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role
        })

        return {"user": userDto, "accessToken": access_token, "refreshToken": refresh_token}

    async def login_restricted(self, login_data: UserLogin, allowed_roles: list) -> Dict[str, Any]:
        """Like login_user, but only for a login form that must not authenticate
        any other account type (e.g. /admin/login must never hand out a session
        for a vendor's correct credentials). A 2FA-pending result can't be role
        -checked yet - TwoFactorService's pending token only carries user_id/email,
        not role - so the check happens again once that completes, same as the
        2FA-aware login_user/complete_two_factor_login pair above.
        """
        result = await self.login_user(login_data)
        if result.get("requires_2fa"):
            return result
        if result["user"]["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This login is not valid for this account type.",
            )
        return result

    async def complete_two_factor_login_restricted(
        self, pending_token: str, code: str, allowed_roles: list
    ) -> Dict[str, Any]:
        result = await self.complete_two_factor_login(pending_token, code)
        if result["user"]["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This login is not valid for this account type.",
            )
        return result

    async def create_office_user(self, data: CreateOfficeUserRequest) -> Dict[str, Any]:
        """Office accounts have no self-registration path (UserCreate rejects that
        role) - an admin is the only route to creating one, via admin_controller.
        """
        existing = await self.user_repository.get_user_by_email(data.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = await self.user_repository.create_office(data.dict())
        return self._user_to_dict(user)

    async def complete_two_factor_login(self, pending_token: str, code: str) -> Dict[str, Any]:
        user = await TwoFactorService(self.user_repository).complete_login(pending_token, code)

        await self.user_repository.update_last_login(user.id)
        await self._attach_profile_fields(user)
        userDto = self._user_to_dict(user)
        access_token = Security.create_access_token(data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role
        })
        refresh_token = Security.create_refresh_token(data={
            "sub": user.email,
            "user_id": user.id,
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

    async def _attach_profile_fields(self, user: user) -> None:
        user.name = await resolve_display_name(self.user_repository, self.vendor_repository, user.id)
        user.phoneNumber = await resolve_phone_number(self.user_repository, self.vendor_repository, user.id)
        user.avatarUrl = await resolve_avatar_url(
            self.user_repository, self.vendor_repository, user.id, user.vendor_types
        )

    def _user_to_dict(self, user: user) -> Dict[str, Any]:
        return {
            "id": user.id,
            "email": user.email,
            "name" : user.name,
            "phoneNumber": user.phoneNumber,
            "avatarUrl": getattr(user, "avatarUrl", None),
            "totpEnabled": bool(user.totp_enabled),
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

        # Security.refresh_access_token expects a plain dict (it calls
        # .get(...) on it) - passing the ORM User object directly raised
        # AttributeError on every refresh call.
        result = Security.refresh_access_token({
            "email": user.email,
            "user_id": user.id,
            "role": user.role,
        })
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

    async def request_password_reset_otp(self, email: str) -> Optional[str]:
        """Generate and store a fresh 6-digit OTP for the forgot-password flow.

        Returns the plaintext OTP (for the caller to email in the background),
        or None for an unknown email - the controller sends the same generic
        "check your inbox" response either way, so this never reveals whether
        an account exists.
        """
        user = await self.user_repository.get_user_by_email(email)
        if not user:
            return None

        # reset_otp_sent_at/reset_token_expires come back from Postgres as
        # timezone-aware (DateTime(timezone=True)) - utcnow() is naive and
        # can't be compared against them, so use an aware "now" throughout.
        now = datetime.now(timezone.utc)
        if user.reset_otp_sent_at:
            elapsed = (now - user.reset_otp_sent_at).total_seconds()
            remaining = settings.PASSWORD_RESET_OTP_RESEND_SECONDS - elapsed
            if remaining > 0:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Please wait {int(remaining) + 1} seconds before requesting another code.",
                )

        otp = f"{secrets.randbelow(1_000_000):06d}"
        otp_hash = hashlib.sha256(otp.encode()).hexdigest()
        expires_at = now + timedelta(minutes=settings.PASSWORD_RESET_OTP_EXPIRE_MINUTES)

        await self.user_repository.save_reset_otp(user.id, otp_hash, expires_at, now)
        return otp

    async def verify_password_reset_otp(self, email: str, otp: str) -> str:
        """Check the emailed OTP and, if it matches, exchange it for a
        short-lived reset ticket - the same reset_token/reset_token_expires
        columns, just overwritten with a fresh random value instead of the
        OTP hash, so reset_password() needs no changes at all for this flow.
        """
        user = await self.user_repository.get_user_by_email(email)
        invalid = HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired code")
        if not user or not user.reset_token or not user.reset_token_expires:
            raise invalid
        if user.reset_token_expires < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This code has expired. Request a new one.")
        if (user.reset_otp_attempts or 0) >= settings.PASSWORD_RESET_OTP_MAX_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many incorrect attempts. Request a new code.",
            )

        otp_hash = hashlib.sha256(otp.encode()).hexdigest()
        if otp_hash != user.reset_token:
            await self.user_repository.increment_reset_otp_attempts(user.id)
            raise invalid

        reset_ticket = secrets.token_urlsafe(32)
        ticket_hash = hashlib.sha256(reset_ticket.encode()).hexdigest()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=self.reset_token_expire_minutes)
        await self.user_repository.save_reset_token(user.id, ticket_hash, expires_at)
        return reset_ticket

    async def reset_password(self, token: str, new_password: str) -> None:
        """Reset password using the ticket issued by verify_password_reset_otp."""
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        # get_by_reset_token's own query already filters on reset_token_expires
        # > now, so a row coming back here is guaranteed not expired.
        user = await self.user_repository.get_by_reset_token(token_hash)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset code. Please start again."
            )

        hashed_password = Security.hash_password(new_password)
        await self.user_repository.update_password(user.id, hashed_password)
        await self.user_repository.clear_reset_token(user.id)

    async def send_password_reset_otp_email(self, email: str, otp: str) -> None:
        """Send the forgot-password OTP using the email service."""
        if not self.email_service:
            logger.warning("Email service not configured - skipping email send")
            return

        user = await self.user_repository.get_user_by_email(email)
        if not user:
            logger.warning(f"Attempt to send reset OTP to non-existent user: {email}")
            return

        try:
            name = await resolve_display_name(self.user_repository, self.vendor_repository, user.id)
            success = await self.email_service.send_password_reset_otp_email(
                email=email,
                otp=otp,
                user_name=name or user.email,
                expire_minutes=settings.PASSWORD_RESET_OTP_EXPIRE_MINUTES,
            )

            if success:
                logger.info(f"Password reset OTP sent to {email}")
            else:
                logger.error(f"Failed to send password reset OTP to {email}")

        except Exception as e:
            logger.error(f"Exception while sending password reset OTP to {email}: {e}", exc_info=True)

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
            name = await resolve_display_name(self.user_repository, self.vendor_repository, user.id)
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

            await self._attach_profile_fields(user)
            logger.info(f"Token validated for user: {user.id}")
            return {
                "valid": True,
                "user": self._user_to_dict(user)
            }
            
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return {"valid": False, "error": str(e)}


    async def seed_admin_user(self) -> None:
        existing = await self.user_repository.get_user_by_email("eliteinovaproperty@gmail.com")
        if not existing:
            admin_cred = await self.user_repository.create_admin({
                "email": "eliteinovaproperty@gmail.com",
                "password": "Eliteinova@123"
            })
            logger.info(f"Admin user created: {admin_cred.email}")
    