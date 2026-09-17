from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict

from app.core.database import Base


class VendorProfile(Base):
    """The vendor's persistent 'easy navigation' profile - one row per vendor
    user, editable independently of any property they've posted. Fields
    shared by all four vendor roles (Owner/Agent/Builder/Property Management)
    are real columns; each role's few extra fields (RERA/GST numbers,
    experience, ongoing projects, ...) live in that role's typed JSONB blob
    (see app.schemas.vendor_profile_details) rather than a wide table of
    columns only one role ever fills in.
    """

    __tablename__ = "vendor_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    whatsapp_number = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)

    profile_picture = Column(Text, nullable=True)
    company_logo_url = Column(Text, nullable=True)

    company_name = Column(String(255), nullable=True)

    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    district = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    pincode = Column(String(20), nullable=True)

    aadhar_number = Column(String, nullable=True)
    pan_number = Column(String, nullable=True)

    bank_name = Column(String(255), nullable=True)
    account_holder_name = Column(String(255), nullable=True)
    account_number = Column(String(50), nullable=True)
    ifsc_code = Column(String(50), nullable=True)
    upi_id = Column(String(255), nullable=True)

    website = Column(Text, nullable=True)
    facebook = Column(Text, nullable=True)
    instagram = Column(Text, nullable=True)
    linkedin = Column(Text, nullable=True)
    youtube = Column(Text, nullable=True)

    preferred_contact_method = Column(JSONB, default=[])  # "phone", "whatsapp", "email"
    preferred_contact_time = Column(JSONB, default=[])    # "morning", "afternoon", "evening"

    # Role-specific extras, validated against app.schemas.vendor_profile_details
    # before being written (see ProfileService.update_vendor_profile) - never
    # written to raw from the request body.
    agency_details = Column(MutableDict.as_mutable(JSONB), default=dict, nullable=False)      # AGENT
    builder_details = Column(MutableDict.as_mutable(JSONB), default=dict, nullable=False)      # BUILDER
    pm_details = Column(MutableDict.as_mutable(JSONB), default=dict, nullable=False)           # PROPERTY_MANAGEMENT

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
