from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import false, func

from app.core.database import Base

# Lifecycle of one version of a document:
#   pending     uploaded, awaiting verification (Phase 2 API)
#   verified    accepted; with is_current, this is the live document
#   rejected    refused, with rejection_reason set
#   superseded  replaced by a newer version; kept for history
#   legacy      carried over from pre-refactor storage; never verified in the system
#   deleted     removed by the user or admin; the physical file is kept
DOCUMENT_STATUSES = ("pending", "verified", "rejected", "superseded", "legacy", "deleted")


class UserDocument(Base):
    """A reusable document owned by a user (identity, KYC, business papers).

    Reused by property and application records by reference, never by upload.
    Physical bytes live in file_assets. Versions are new rows; old objects are
    never overwritten.
    """

    __tablename__ = "user_documents"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    file_asset_id = Column(Integer, ForeignKey("file_assets.id", ondelete="RESTRICT"), nullable=False, index=True)

    document_key = Column(String(100), nullable=False)  # canonical key from app.core.document_catalog
    version = Column(Integer, nullable=False, default=1, server_default="1")
    status = Column(String(20), nullable=False, default="pending", server_default="pending")
    is_current = Column(Boolean, nullable=False, default=False, server_default=false())

    verified_at = Column(DateTime(timezone=True), nullable=True)
    verified_by = Column(String(20), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rejection_reason = Column(Text, nullable=True)

    # Where a migrated row came from, and the value it had there. Lets the
    # migration be audited and reversed without losing the original.
    legacy_source = Column(String(50), nullable=True)
    legacy_document_type = Column(String(100), nullable=True)
    legacy_ref = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    file_asset = relationship("FileAsset")

    __table_args__ = (
        # At most one live version per user and document key.
        Index(
            "uq_user_documents_current",
            "user_id", "document_key",
            unique=True,
            postgresql_where=text("is_current"),
        ),
        UniqueConstraint("user_id", "document_key", "version", name="uq_user_documents_version"),
        CheckConstraint(
            "status IN ('pending', 'verified', 'rejected', 'superseded', 'legacy', 'deleted')",
            name="ck_user_documents_status",
        ),
    )
