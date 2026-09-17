from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class CustomerRequirement(Base):

    __tablename__ = "customer_requirements"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), nullable=False, index=True)

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

    customer = relationship("Customer", back_populates="requirements")
