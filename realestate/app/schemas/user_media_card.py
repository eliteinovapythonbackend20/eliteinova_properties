"""Response payloads for media_controller.py (a vendor's own reusable
media, and the references a property makes to it) - mirrors _media_view
there plus the reference fields list_property_user_media/reuse_user_media
add on top.
"""

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class UserMediaView(BaseModel):
    """Mirrors media_controller._media_view. Metadata only - no storage
    key, bucket or URL."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    media_type: Optional[str] = Field(None, alias="mediaType")
    version: Optional[int] = None
    status: Optional[str] = None
    is_current: bool = Field(alias="isCurrent")
    file_name: Optional[str] = Field(None, alias="fileName")
    mime_type: Optional[str] = Field(None, alias="mimeType")
    size_bytes: Optional[int] = Field(None, alias="sizeBytes")
    created_at: Optional[str] = Field(None, alias="createdAt")


class PropertyUserMediaView(UserMediaView):
    """A property's reference to one of the vendor's own media items -
    _media_view's fields plus the reference itself."""

    reference_id: int = Field(alias="referenceId")
    purpose: str
    user_media_id: int = Field(alias="userMediaId")
    reused: bool = True


class ReuseMediaResult(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    reference_id: int = Field(alias="referenceId")
    purpose: str
    user_media_id: int = Field(alias="userMediaId")
    reused: bool = True
