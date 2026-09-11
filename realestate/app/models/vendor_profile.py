
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.core.database import Base


class VendorProfile(Base):
    __tablename__ = "vendor_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    whatsapp_number = Column(String(20),nullable=True)
    gender = Column(String(20), nullable=True)

    profile_picture = Column(Text, nullable=True)
    company_logo_url = Column(Text,nullable=True)

    address = Column(Text,nullable=True)
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

    agency_details = Column(JSONB,default={})

    company_details = Column(JSONB, default={})


