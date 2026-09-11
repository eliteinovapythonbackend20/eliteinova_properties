from pydantic import BaseModel, Field, validator
from typing import Optional
from enum import Enum
from datetime import datetime
from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, JSON, Text

from app.core.database import Base

class PaymentStatus(str, Enum):
    CREATED = "created"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    REFUNDED = "refunded"
    FAILED = "failed"
    PENDING = "pending"
    EXPIRED = "expired"

class PropertyCategory(str, Enum):
    INDIVIDUAL = "individual"
    COMMERCIAL = "commercial"
    APARTMENT = "apartment"
    LAND_PLOT = "land_and_plot"
    HOSTEL = "hostel"

class ListingPurpose(str, Enum):
    RENT = "rent"
    SELL = "sell"
    LEASE = "lease"

# Database Model
class PaymentTransaction(Base):
    __tablename__ = "property_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(100), nullable=False, index=True, unique=True)
    payment_id = Column(String(100), nullable=True, index=True)
    refund_id = Column(String(100), nullable=True)
    
    amount = Column(Integer, nullable=False)
    amount_inr = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(20), nullable=False, index=True)
    
    property_category = Column(String(50), nullable=False)
    listing_purpose = Column(String(50), nullable=False)
    expected_price = Column(Float, nullable=True)
    ground_size = Column(Float, nullable=True)
    
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=True, unique=True)
    
    
    razorpay_response = Column(JSON, nullable=True)
    notes = Column(JSON, nullable=True)
    receipt = Column(String(200), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    captured_at = Column(DateTime, nullable=True)
    refunded_at = Column(DateTime, nullable=True)
    failed_at = Column(DateTime, nullable=True)
    
    error_code = Column(String(50), nullable=True)
    error_description = Column(Text, nullable=True)
    error_reason = Column(String(200), nullable=True)
    
    webhook_data = Column(JSON, nullable=True)
    webhook_processed_at = Column(DateTime, nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "payment_id": self.payment_id,
            "refund_id": self.refund_id,
            "amount": self.amount,
            "amount_inr": self.amount_inr,
            "currency": self.currency,
            "status": self.status,
            "property_category": self.property_category,
            "listing_purpose": self.listing_purpose,
            "user_id": self.user_id,
            "property_id": self.property_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "captured_at": self.captured_at.isoformat() if self.captured_at else None,
            "error_description": self.error_description,
        }

# Pydantic Models for API
class CreateOrderRequest(BaseModel):
    property_category: PropertyCategory
    listing_purpose: ListingPurpose
    expected_price: Optional[float] = None
    ground_size: Optional[float] = None
    currency: str = Field(default="INR")
    receipt: Optional[str] = None
    notes: Optional[dict] = None
    user_id: Optional[str] = None
    property_id: Optional[str] = None

    @validator('expected_price')
    def validate_expected_price(cls, v, values):
        category = values.get('property_category')
        purpose = values.get('listing_purpose')
        
        if category != PropertyCategory.HOSTEL and v is None:
            raise ValueError("Expected price is required")
        if purpose in [ListingPurpose.SELL, ListingPurpose.RENT] and v is None:
            raise ValueError(f"Expected price required for {purpose.value}")
        return v

    @validator('ground_size')
    def validate_ground_size(cls, v, values):
        category = values.get('property_category')
        purpose = values.get('listing_purpose')
        
        if category == PropertyCategory.LAND_PLOT and purpose == ListingPurpose.SELL:
            if v is None or v <= 0:
                raise ValueError("Ground size required for land sell")
        return v

class VerifyPaymentRequest(BaseModel):
    order_id: str
    payment_id: str
    razorpay_signature: str

class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[int] = None
    notes: Optional[dict] = None

class PricingDetails(BaseModel):
    amount_inr: float
    amount_paise: int
    rule_applied: str
    description: str