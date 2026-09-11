from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Index, text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class PropertyDocument(Base):
    __tablename__ = "property_documents"

    id = Column(Integer, primary_key=True, index=True)

    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=True)

    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Document Details
    document_type = Column(String(100), nullable=False)  # id_proof, ownership_proof, gst_certificate, etc.
    file_name = Column(String(255), nullable=False)
    stored_filename = Column(String(400),nullable=True)
    mime_type = Column(String(100), nullable=True)

    file_url = Column(String(500), nullable=True)

    # Metadata
    file_size_kb = Column(Integer, nullable=True)
    is_public = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    property = relationship("BaseProperty", back_populates="documents")

    __table_args__ = (
        Index(
            'uq_vendor_document_per_type',
            'user_id', 'document_type',
            unique=True,
            postgresql_where=text('property_id IS NULL'),
        ),
    )