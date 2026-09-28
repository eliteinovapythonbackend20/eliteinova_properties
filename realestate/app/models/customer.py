from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Customer(Base):
    """Profile fields only (name/contact/KYC/preferences) for a user with
    role=USER. This is NOT the identity other tables hang off of - requirements,
    saved properties, wishlist, and property views all FK to `users.id`
    directly (a user IS the customer; the same person can act as buyer or
    tenant without a separate id per role). `id` below is this table's own
    internal PK - it must never be used as an FK target for other tables and
    must never be exposed in the API; every external identifier for "which
    customer" is `user_id` (the EP... string)."""

    __tablename__ = "customer"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)

    profile_picture = Column(String(500), nullable=True)

    bio = Column(Text, nullable=True)

    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    country = Column(String, nullable=True)
    pincode = Column(String(10), nullable=True)

    # buyer | tenant | both - explicit, not derived from requirements.
    customer_type = Column(String(20), nullable=True)

    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    marital_status = Column(String(20), nullable=True)
    alternate_phone = Column(String(20), nullable=True)

    occupation = Column(String(100), nullable=True)
    employment_type = Column(String(50), nullable=True)
    company_name = Column(String(255), nullable=True)
    designation = Column(String(100), nullable=True)
    annual_income = Column(Float, nullable=True)

    email_verified = Column(Boolean, default=False, nullable=False)
    phone_verified = Column(Boolean, default=False, nullable=False)

    kyc_status = Column(String(20), default="pending", nullable=False)
    kyc_aadhaar_verified = Column(Boolean, default=False, nullable=False)
    kyc_pan_verified = Column(Boolean, default=False, nullable=False)
    kyc_gst_verified = Column(Boolean, default=False, nullable=False)
    kyc_rera_verified = Column(Boolean, default=False, nullable=False)

    # URL of the doc a customer has already uploaded (upload flow itself is
    # customer-side, a later phase) - admin KYC review just reads these.
    aadhaar_doc_url = Column(String(500), nullable=True)
    pan_doc_url = Column(String(500), nullable=True)
    gst_doc_url = Column(String(500), nullable=True)
    rera_doc_url = Column(String(500), nullable=True)

    preferred_contact_channel = Column(String(20), nullable=True)
    preferred_contact_time = Column(String(20), nullable=True)
    preferred_language = Column(String(50), nullable=True)
    newsletter_opt_in = Column(Boolean, default=False, nullable=False)

    # Joined for status/email/createdAt/updatedAt - those live on User, not
    # here (see app.services.admin_customer_service._to_card).
    user = relationship("User", back_populates="customer")

    # requirements/saved_properties/wishlist_items/property_views are NOT
    # relationships on Customer - they FK to users.id, not customer.id (see
    # this class's docstring). Look them up via User.requirements etc., or
    # query those tables directly filtered by user_id.
