from sqlalchemy import BigInteger, CheckConstraint, Column, DateTime, Integer, String, UniqueConstraint
from sqlalchemy.sql import func

from app.core.database import Base


class FileAsset(Base):
    """One physical stored object. Business ownership lives in user_documents
    and property_documents, which point here. The object itself is never moved
    or deleted by a database change."""

    __tablename__ = "file_assets"

    id = Column(Integer, primary_key=True, index=True)

    storage_provider = Column(String(20), nullable=False)  # gcs | local | unknown
    bucket = Column(String(255), nullable=True)
    storage_key = Column(String(1000), nullable=False)

    original_name = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=True)
    size_bytes = Column(BigInteger, nullable=True)
    checksum = Column(String(64), nullable=True)  # SHA-256 hex, when known

    visibility = Column(String(10), nullable=False, default="private", server_default="private")
    status = Column(String(20), nullable=False, default="active", server_default="active")

    # The URL exactly as the app already stores it, so existing links keep working.
    file_url = Column(String(1000), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("storage_provider", "bucket", "storage_key", name="uq_file_assets_locator"),
        CheckConstraint("visibility IN ('public', 'private')", name="ck_file_assets_visibility"),
        CheckConstraint("status IN ('active', 'deleted', 'orphaned')", name="ck_file_assets_status"),
    )
