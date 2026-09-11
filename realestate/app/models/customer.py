from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.core.database import Base

class Customer(Base):
    __tablename__ = "customer"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)

    profile_picture = Column(String(500), nullable=True)
    
    address = Column(Text,nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    country = Column(String, nullable=True)

    customer_requirement = Column(JSONB, default=[]) 

