from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class PropertyUserMedia(Base):
    """A property's reference to one of its uploader's reusable user media.

    Only a reference: no file is copied and no object is created. The media itself stays
    the user's, and property-specific media never appears here.
    """

    __tablename__ = "property_user_media"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)
    user_media_id = Column(Integer, ForeignKey("user_media.id", ondelete="RESTRICT"), nullable=False, index=True)
    purpose = Column(String(30), nullable=False)
    created_by = Column(String(20), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("uq_property_user_media_purpose", "property_id", "purpose", unique=True),
        CheckConstraint(
            "purpose IN ('profile_photo', 'company_logo', 'agency_logo', 'business_logo')",
            name="ck_property_user_media_purpose",
        ),
    )
