from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base

class PropertyBuilderDetails(Base):
    __tablename__ = "builder_properties"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, unique=True)

    # NEW
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Builder specific fields
    name = Column(String(255), nullable=False)
    designation = Column(String(200), nullable=False)
    mobile = Column(String(30), nullable=False)
    whatsapp_number = Column(String(30), nullable=True)
    email = Column(String(255), nullable=False)
    rera_registration_number = Column(String(50), nullable=False)
    gst_number = Column(String(50), nullable=True)
    experience = Column(Integer, nullable=True)
    aadhaar_number = Column(String(20), nullable=False)
    pan_number = Column(String(20), nullable=False)

    # NEW: profile photo + company logo
    profile_photo_url = Column(String(500), nullable=True)
    company_logo_url = Column(String(500), nullable=True)

    # company details
    company_name = Column(String(255), nullable=False)
    company_reg_number = Column(String(100), nullable=False)
    company_website = Column(Text, nullable=True)
    company_description = Column(Text, nullable=True)

    service_area = Column(JSONB, default=[], nullable=True)  # List of service areas (e.g., cities or regions)

    # address
    office_address = Column(Text, nullable=False)
    city = Column(String(200), nullable=False)
    district = Column(String(200), nullable=False)
    state = Column(String(200), nullable=False)
    pincode = Column(String(20), nullable=False)
    landmark = Column(String(200), nullable=False)

    # social link
    website = Column(Text, nullable=True)
    facebook = Column(Text, nullable=True)
    instagram = Column(Text, nullable=True)
    linkedin = Column(Text, nullable=True)
    youtube = Column(Text, nullable=True)

    # Bank Details
    bank_name = Column(String(255), nullable=True)
    account_holder_name = Column(String(255), nullable=True)
    account_number = Column(String(50), nullable=True)
    ifsc_code = Column(String(50), nullable=True)
    upi_id = Column(String(255), nullable=True)

    signature = Column(Text, nullable=True)
    signature_date = Column(Date, nullable=True)
    signature_place = Column(String(255), nullable=True)
    declaration_accepted = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    property = relationship("BaseProperty", back_populates="builder_details")