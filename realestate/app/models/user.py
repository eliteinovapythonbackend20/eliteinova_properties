from sqlalchemy import Column, String, Boolean, DateTime, Enum, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VENDOR = "vendor"

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
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    
    
    status = Column(String(20), default=UserStatus.PENDING.value, nullable=False)
    verified = Column(String(20), default=ProfileVerificationStatus.PENDING.value, nullable=False)


    vendor_types = Column(JSONB,default=[])
    
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    password_changed_at = Column(DateTime(timezone=True), nullable=True)
    
    reset_token = Column(String(255), nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    
    verification_token = Column(String(255), nullable=True)
    verification_token_expires = Column(DateTime(timezone=True), nullable=True)
    

    oauth_provider = Column(String(50), nullable=True)  # google, facebook, etc.
    oauth_provider_id = Column(String(255), nullable=True)
    

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    properties = relationship("BaseProperty", back_populates="user", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint(
            "id ~ '^EP[0-9]{6}[CVA][0-9]{5}$'",
            name="check_user_id_format"
        ),
    )
    
    def __repr__(self):
        return f"<User {self.id} - {self.email}>"