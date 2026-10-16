from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String, Text, text
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

    # Phase 1 foundation. Existing rows get file_asset_id/document_key from the
    # migration; new rows are written through the document repositories.
    file_asset_id = Column(Integer, ForeignKey("file_assets.id", ondelete="RESTRICT"), nullable=True, index=True)
    document_key = Column(String(100), nullable=True)  # canonical key from app.core.document_catalog
    # One logical file slot. Versions chain within a slot, never across slots, so
    # several files under one key (e.g. property_supporting_documents) stay independent.
    slot_key = Column(String(64), nullable=True, index=True)
    # Whose document this is. PROPERTY: the property's own document. CONTACT_PERSON: an
    # identity/supporting document of a contact person submitted with the property.
    # user_id is always the uploader; for CONTACT_PERSON it is NOT the person in the document.
    subject_type = Column(String(20), nullable=False, default="PROPERTY", server_default="PROPERTY", index=True)
    version = Column(Integer, nullable=False, default=1, server_default="1")
    status = Column(String(20), nullable=False, default="pending", server_default="pending")
    is_current = Column(Boolean, nullable=False, default=True, server_default=text("true"))
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verified_by = Column(String(20), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rejection_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    property = relationship("BaseProperty", back_populates="documents")

    __table_args__ = (
        Index(
            'uq_vendor_document_per_type',
            'user_id', 'document_type',
            unique=True,
            postgresql_where=text('property_id IS NULL'),
        ),
        CheckConstraint(
            "subject_type IN ('PROPERTY', 'CONTACT_PERSON')",
            name='ck_property_documents_subject_type',
        ),
    )