from sqlalchemy import Column, Integer, String, Text, Date, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class OwnerProperty(Base):
    __tablename__ = "owner_properties"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, unique=True)

    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Owner Personal Info
    owner_name = Column(String(255), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(50), nullable=True)
    aadhaar_number = Column(String(50), nullable=True)
    pan_number = Column(String(50), nullable=True)

    # NEW: profile photo, set via POST /api/owner/profile/photo
    profile_photo_url = Column(String(500), nullable=True)

    # Contact
    mobile = Column(String(20), nullable=True)
    email_id = Column(String(255), nullable=True)

    # Owner Address
    address_line1 = Column(Text, nullable=True)
    address_line2 = Column(Text, nullable=True)
    owner_city = Column(String(100), nullable=True)
    owner_district = Column(String(100),nullable=True)
    owner_state = Column(String(100), nullable=True)
    owner_pin_code = Column(String(20), nullable=True)

    # Preferences
    preferred_contact_method = Column(JSONB, default=[])
    preferred_contact_time = Column(String(100), nullable=True)

    # Bank Details
    bank_name = Column(String(255), nullable=True)
    account_holder_name = Column(String(255), nullable=True)
    account_number = Column(String(50), nullable=True)
    ifsc_code = Column(String(50), nullable=True)
    upi_id = Column(String(255), nullable=True)

    # Declaration
    signature = Column(Text, nullable=True)
    signature_date = Column(Date, nullable=True)
    signature_place = Column(String(255), nullable=True)
    declaration_accepted = Column(Boolean, default=False)

    additionalnote = Column(Text, default="")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    property = relationship("BaseProperty", back_populates="owner_details")