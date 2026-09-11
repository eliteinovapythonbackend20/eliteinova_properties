from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class PropertyMedia(Base):
    __tablename__ = "property_media"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    
    # Media Details
    media_type = Column(String(50), nullable=False)  # image, video
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=True)
    format = Column(String(20), nullable=True)  # webp, jpeg, mp4
    
    # ✅ GCS URLs
    file_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    filename_mapper = Column(String(100),nullable=True)
    
    # Metadata
    file_size_kb = Column(Integer, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    
    is_primary = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    property = relationship("BaseProperty", back_populates="media")