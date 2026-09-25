from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class CustomerSavedProperty(Base):

    __tablename__ = "customer_saved_properties"
    __table_args__ = (
        UniqueConstraint("customer_id", "property_id", name="uq_customer_saved_property"),
    )

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), nullable=False, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)

    customer = relationship("Customer", back_populates="saved_properties")
    property = relationship("BaseProperty")


class CustomerWishlistItem(Base):
    

    __tablename__ = "customer_wishlist"
    __table_args__ = (
        UniqueConstraint("customer_id", "property_id", name="uq_customer_wishlist_property"),
    )

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), nullable=False, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    price_at_add = Column(Float, nullable=True)

    customer = relationship("Customer", back_populates="wishlist_items")
    property = relationship("BaseProperty")


class CustomerPropertyView(Base):
    __tablename__ = "customer_property_views"
    __table_args__ = (
        UniqueConstraint("customer_id", "property_id", name="uq_customer_property_view"),
    )

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), nullable=False, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    view_count = Column(Integer, default=1, nullable=False)
    first_viewed_at = Column(DateTime(timezone=True), server_default=func.now())
    last_viewed_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    customer = relationship("Customer", back_populates="property_views")
    property = relationship("BaseProperty")
