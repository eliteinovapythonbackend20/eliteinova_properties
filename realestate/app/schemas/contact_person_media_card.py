"""Response payloads for contact_person_media_controller.py's list route."""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ContactPersonMediaItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    media_type: Optional[str] = Field(None, alias="mediaType")
    version: Optional[int] = None
    status: Optional[str] = None
    file_name: Optional[str] = Field(None, alias="fileName")
    mime_type: Optional[str] = Field(None, alias="mimeType")
    created_at: Optional[str] = Field(None, alias="createdAt")


class ContactPersonMediaListResponse(BaseModel):
    success: bool = True
    data: List[ContactPersonMediaItem]
