from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class CustomerRequirement(Base):
    """Backs a future requirement-matching/filter page only - the actual
    requirements form hasn't been designed yet, so this field set is
    deliberately minimal and NOT final. Do not add buyer/tenant-specific
    columns here speculatively; wait for the real form. Buyer and tenant
    requirements are NOT split - a tenant's requirement is just a subset of
    the same shape. A user may submit this multiple times; every submission
    is kept (nothing is overwritten), and callers needing "the" requirement
    for filtering should take the latest by created_at/id."""

    __tablename__ = "customer_requirements"

    id = Column(Integer, primary_key=True, index=True)
    # Customers ARE users with role=USER - there is no separate customer id
    # for this FK. See app.models.customer's docstring/comment for why.
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    property_category = Column(String(50), nullable=True)   # app.schemas.property_enums.PropertyCategory
    listing_purpose = Column(String(50), nullable=True)      # app.schemas.property_enums.ListingPurpose
    property_type = Column(String(100), nullable=True)
    bedrooms = Column(Integer, nullable=True)

    preferred_location = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)

    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    furnishing_status = Column(String(20), nullable=True)

    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="requirements")
