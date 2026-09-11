from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, Index
from datetime import datetime

from app.core.database import Base



class PricingRule(Base):
    __tablename__ = "property_pricing"
    
    id = Column(Integer, primary_key=True, index=True)
    property_category = Column(String(50), nullable=False, index=True)
    listing_purpose = Column(String(50), nullable=False, index=True)
    rule_type = Column(String(20), nullable=False)  # fixed, range
    min_value = Column(Float, nullable=True)
    max_value = Column(Float, nullable=True)
    amount = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_category_purpose', 'property_category', 'listing_purpose'),
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "property_category": self.property_category,
            "listing_purpose": self.listing_purpose,
            "rule_type": self.rule_type,
            "min_value": self.min_value,
            "max_value": self.max_value,
            "amount": self.amount,
            "is_active": self.is_active,
            "description": self.description
        }