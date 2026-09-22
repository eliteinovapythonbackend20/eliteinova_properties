from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base

class PropertyAgentDetails(Base):
    __tablename__ = "agent_properties"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, unique=True)

    # NEW
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Agent specific fields
    agent_name = Column(String(255), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(50), nullable=True)

    # NEW: profile photo + agency logo
    profile_photo_url = Column(String(500), nullable=True)
    agency_logo_url = Column(String(500), nullable=True)

    # Contact
    mobile = Column(String(20), nullable=True)
    email_id = Column(String(255), nullable=True)

    office_address = Column(Text, nullable=True)
    address_line1 = Column(Text, nullable=True)
    address_line2 = Column(Text, nullable=True)
    agency_name = Column(String(255), nullable=True)
    rera_registration_number = Column(String(255), nullable=True)
    gst_number = Column(String(50), nullable=True)
    experience = Column(Integer, nullable=True)
    active_listing = Column(Integer, nullable=True)
    service_area = Column(JSONB, default=[])
    aadhaar_number = Column(String(20), nullable=True)

    website = Column(Text, nullable=True)
    facebook = Column(Text, nullable=True)
    instagram = Column(Text, nullable=True)
    linkedin = Column(Text, nullable=True)
    youtube = Column(Text, nullable=True)

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

    property = relationship("BaseProperty", back_populates="agent_details")