import re
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, validator, model_validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, UserStatus
from app.schemas.property_enums import PostedBy
from pydantic import EmailStr


class VendorTypeChoice(str, Enum):
    OWNER = "owner"
    AGENT = "agent"
    BUILDER = "builder"
    PROPERTY_MANAGEMENT = "property_management"


# Registration value -> the PostedBy string stored in users.vendor_types
# (the same strings property creation appends to that column).
REGISTRATION_VENDOR_TYPE_TO_POSTED_BY = {
    VendorTypeChoice.OWNER: PostedBy.OWNER.value,
    VendorTypeChoice.AGENT: PostedBy.AGENT.value,
    VendorTypeChoice.BUILDER: PostedBy.BUILDER.value,
    VendorTypeChoice.PROPERTY_MANAGEMENT: PostedBy.PROPERTY_MANAGEMENT.value,
}


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = Field(None, alias="fullName")
    phone_number : Optional[str] = Field(None, alias="phoneNumber")
    company_name: Optional[str] = Field(None, alias="companyName")
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    role: UserRole = UserRole.USER
    # Invalid values are rejected by Pydantic enum validation (422).
    vendor_type: Optional[VendorTypeChoice] = None

    @validator("role")
    def restrict_self_registration_roles(cls, v):
        # This is the public /auth/register endpoint - anyone can call it. Only
        # customer and vendor accounts are self-service; admin and office
        # accounts are created by an existing admin (see admin_controller).
        if v not in (UserRole.USER, UserRole.VENDOR):
            raise ValueError("role must be 'user' or 'vendor'")
        return v

    @model_validator(mode="after")
    def require_vendor_type_for_vendors(self):
        # Without this, a new vendor could register with no type and get
        # unrestricted profile access.
        if self.role == UserRole.VENDOR and self.vendor_type is None:
            raise ValueError("vendor_type is required when registering as a vendor")
        return self


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class CreateOfficeUserRequest(BaseModel):
    """Body for POST /admin/office-users - an admin provisioning an office account.

    There's no self-registration path for this role (see
    UserCreate.restrict_self_registration_roles) - an admin is the only way an
    office account comes into existence, so this intentionally carries just
    enough to create the login, not a full profile.
    """
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = Field(None, alias="fullName")
    phone_number: Optional[str] = Field(None, alias="phoneNumber")

class TokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    phoneNumber: Optional[str] = None
    avatarUrl: Optional[str] = None
    totpEnabled: bool = False
    role: UserRole
    status: UserStatus
    vendor_types: Optional[list[str]]
    is_verified: bool
    is_active: bool

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

    @validator('new_password')
    def validate_new_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyPasswordResetOtpRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

    @validator('new_password')
    def validate_new_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class MessageResponse(BaseModel):
    message: str

class TwoFactorSetupResponse(BaseModel):
    secret: str
    otpauth_uri: str
    qr_code: str

class TwoFactorConfirmRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")

class TwoFactorConfirmResponse(BaseModel):
    message: str
    recovery_codes: list[str]

class TwoFactorVerifyRequest(BaseModel):
    pending_token: str
    code: str = Field(..., min_length=6, max_length=9)

class TwoFactorDisableRequest(BaseModel):
    password: str
    code: str = Field(..., min_length=6, max_length=9)

class ValidateTokenResponse(BaseModel):
    valid: bool
    user: Optional[UserResponse] = None
    error: Optional[str] = None

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """The {message, user, accessToken, refreshToken, token_type} shape
    shared by register/login/2fa-verify (and office_controller's mirrors of
    the same three) once 2FA either isn't enabled or has just been
    completed."""

    message: str
    user: UserResponse
    accessToken: str
    refreshToken: str
    token_type: str = "bearer"


class TwoFactorRequiredResponse(BaseModel):
    """What login returns instead of LoginResponse when the account has TOTP
    enabled - no tokens yet, just the pending_token /2fa/verify needs."""

    requires_2fa: bool = True
    pending_token: str
    message: str = "Two-factor authentication required"


class ResetOtpVerifiedResponse(BaseModel):
    message: str
    resetToken: str


class AccessTokenResponse(BaseModel):
    """POST /auth/refresh's body - a new access token only, unlike
    LoginResponse/TokenResponse which both carry a refreshToken too."""

    accessToken: str
    token_type: str = "bearer"


class OfficeUserCreatedResponse(BaseModel):
    """POST /admin/office-users' body - no tokens, since an admin is
    provisioning someone else's account, not logging in."""

    message: str
    user: UserResponse