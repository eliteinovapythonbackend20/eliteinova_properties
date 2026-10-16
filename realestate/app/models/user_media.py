from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String, text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

USER_MEDIA_TYPES = ("profile_photo", "company_logo", "agency_logo", "business_logo")


class UserMedia(Base):
    """A user's reusable media (profile photo, company or agency logo).

    One current version per user and media type. A new upload becomes current and the
    previous current version is superseded and kept. A property may reference a current
    user media by id (property_user_media); it never copies the file.
    """

    __tablename__ = "user_media"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    media_type = Column(String(30), nullable=False)
    file_asset_id = Column(Integer, ForeignKey("file_assets.id", ondelete="RESTRICT"), nullable=False, index=True)
    version = Column(Integer, nullable=False, default=1)
    status = Column(String(20), nullable=False, default="verified", server_default="verified")
    is_current = Column(Boolean, nullable=False, default=True, server_default=text("true"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    file_asset = relationship("FileAsset")

    __table_args__ = (
        Index(
            "uq_user_media_current",
            "user_id", "media_type",
            unique=True,
            postgresql_where=text("is_current"),
        ),
        CheckConstraint(
            "media_type IN ('profile_photo', 'company_logo', 'agency_logo', 'business_logo')",
            name="ck_user_media_type",
        ),
        CheckConstraint(
            "status IN ('verified', 'superseded', 'legacy', 'deleted')",
            name="ck_user_media_status",
        ),
    )
