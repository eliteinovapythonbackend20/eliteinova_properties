from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String, text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

CONTACT_PERSON_MEDIA_TYPES = ("profile_photo", "agency_logo", "company_logo")


class ContactPersonMedia(Base):
    """A contact person's media (poster photo, agency/company logo) submitted with
    one property's form - never the uploader's own reusable USER_MEDIA.

    Public, like any other media (never admin-gated the way a contact-person
    DOCUMENT is). Linked to property_id through this table, never inferred from
    the GCS path. One current row per property and media type; a new upload
    supersedes the previous one, which is kept, never deleted.
    """

    __tablename__ = "contact_person_media"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    media_type = Column(String(30), nullable=False)
    file_asset_id = Column(Integer, ForeignKey("file_assets.id", ondelete="RESTRICT"), nullable=False, index=True)
    version = Column(Integer, nullable=False, default=1, server_default="1")
    status = Column(String(20), nullable=False, default="verified", server_default="verified")
    is_current = Column(Boolean, nullable=False, default=True, server_default=text("true"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    property = relationship("BaseProperty", back_populates="contact_person_media")
    file_asset = relationship("FileAsset")

    __table_args__ = (
        Index(
            "uq_contact_person_media_current",
            "property_id", "media_type",
            unique=True,
            postgresql_where=text("is_current"),
        ),
        CheckConstraint(
            "media_type IN ('profile_photo', 'agency_logo', 'company_logo')",
            name="ck_contact_person_media_type",
        ),
        CheckConstraint(
            "status IN ('verified', 'superseded', 'legacy', 'deleted')",
            name="ck_contact_person_media_status",
        ),
    )
