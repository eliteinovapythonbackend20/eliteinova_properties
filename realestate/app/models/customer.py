from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base
# Imported so their tables/mappers register with Base.metadata whenever
# Customer does - see the relationships below.
from app.models.customer_activity import CustomerPropertyView, CustomerSavedProperty, CustomerWishlistItem
from app.models.customer_requirement import CustomerRequirement


class Customer(Base):
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

    # What the customer is looking for - can have several active at once.
    requirements = relationship(
        "CustomerRequirement", back_populates="customer", cascade="all, delete-orphan"
    )
    # Bookmarked-for-later shortlist.
    saved_properties = relationship(
        "CustomerSavedProperty", back_populates="customer", cascade="all, delete-orphan"
    )
    # Properties they want alerts on (price drop, status change, ...).
    wishlist_items = relationship(
        "CustomerWishlistItem", back_populates="customer", cascade="all, delete-orphan"
    )
    # Browsing history, one row per property viewed.
    property_views = relationship(
        "CustomerPropertyView", back_populates="customer", cascade="all, delete-orphan"
    )
