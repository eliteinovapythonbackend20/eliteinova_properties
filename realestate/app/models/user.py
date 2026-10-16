from sqlalchemy import Column, String, Boolean, DateTime, Enum, CheckConstraint, BigInteger, Text, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func, false
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VENDOR = "vendor"
    OFFICE = "office"
    SERVICE_VENDOR = "service_vendor"

class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"
    PENDING = "pending"

class ProfileVerificationStatus(str, enum.Enum):
    VERIFIED = "verified"
    PENDING = "pending"
    REJECTED = "rejected"



class User(Base):
    __tablename__ = "users"
    
    id = Column(String(20), primary_key=True, index=True)
    
    role = Column(String(20), default=UserRole.USER.value, nullable=False)
    
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    
    
    status = Column(String(20), default=UserStatus.PENDING.value, nullable=False)
    verified = Column(String(20), default=ProfileVerificationStatus.PENDING.value, nullable=False)


    vendor_types = Column(JSONB,default=[])
    
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    password_changed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Reused for both steps of the forgot-password flow: first holds a hash of
    # the emailed OTP, then (once that OTP is verified) is overwritten with a
    # hash of a fresh short-lived ticket that authorizes the actual password
    # change - see AuthService.verify_password_reset_otp/reset_password.
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    # When the current OTP was sent (for the resend cooldown) and how many
    # wrong guesses it's had (to lock it out before someone can brute-force a
    # 6-digit code). Both reset whenever a fresh OTP is sent.
    reset_otp_sent_at = Column(DateTime(timezone=True), nullable=True)
    reset_otp_attempts = Column(Integer, default=0, server_default="0", nullable=False)

    verification_token = Column(String(255), nullable=True)
    verification_token_expires = Column(DateTime(timezone=True), nullable=True)

    # TOTP two-factor auth. totp_secret is Fernet-encrypted; recovery codes are
    # stored only as SHA-256 hashes. Never serialize these into user DTOs.
    totp_enabled = Column(Boolean, default=False, server_default=false(), nullable=False)
    totp_secret = Column(Text, nullable=True)
    totp_verified_at = Column(DateTime(timezone=True), nullable=True)
    totp_last_counter = Column(BigInteger, nullable=True)
    totp_recovery_code_hashes = Column(JSONB, nullable=True)


    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    properties = relationship("BaseProperty", back_populates="user", cascade="all, delete-orphan")
    # passive_deletes=True on all of the below: their FK columns already
    # carry ON DELETE CASCADE at the DB level (see app.models.customer /
    # customer_requirement / customer_activity) - without it, SQLAlchemy's
    # unit-of-work tries to UPDATE <child> SET user_id = NULL before deleting
    # the User row (the default behavior for a relationship with no
    # cascade), which fails outright since those FK columns are NOT NULL.
    customer = relationship("Customer", back_populates="user", uselist=False, passive_deletes=True)
    # A user IS the customer (role=USER) - these hang directly off users.id,
    # not off Customer.id, so the same person needs no separate id to act as
    # buyer or tenant. See app.models.customer's docstring for the full
    # rationale.
    requirements = relationship("CustomerRequirement", back_populates="user", passive_deletes=True)
    saved_properties = relationship("CustomerSavedProperty", back_populates="user", passive_deletes=True)
    wishlist_items = relationship("CustomerWishlistItem", back_populates="user", passive_deletes=True)
    property_views = relationship("CustomerPropertyView", back_populates="user", passive_deletes=True)
    
    __table_args__ = (
        # O = office (IDGenerator.get_role_prefix). Service-vendor ("S") accounts
        # aren't created anywhere yet, so that letter isn't allowed here either -
        # add it the same way (model + a migration against the live constraint)
        # once that role actually gets a creation path.
        CheckConstraint(
            "id ~ '^EP[0-9]{6}[CVAO][0-9]{5}$'",
            name="check_user_id_format"
        ),
    )
    
    def __repr__(self):
        return f"<User {self.id} - {self.email}>"