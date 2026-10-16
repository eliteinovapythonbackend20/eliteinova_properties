"""Response payloads for property_controller.py's document-listing/reuse
routes - metadata only, matching each route's existing hand-built dict
exactly (never a raw fileUrl; see PropertyDocumentResponse's own docstring
for why - documents live in a private bucket and only ever get a signed URL
on demand via GET /properties/documents/{id}/view-url).
"""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class PropertyDocumentMeta(BaseModel):
    """GET /{property_id}/documents and /{property_id}/contact-documents."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    document_type: str = Field(alias="documentType")
    document_key: Optional[str] = Field(None, alias="documentKey")
    file_name: str = Field(alias="fileName")
    mime_type: Optional[str] = Field(None, alias="mimeType")
    status: str
    version: int
    is_current: bool = Field(alias="isCurrent")
    # Only present on /contact-documents (who uploaded this contact person's document).
    uploaded_by: Optional[str] = Field(None, alias="uploadedBy")


class ReusedDocumentResult(BaseModel):
    """POST /{property_id}/documents/reuse."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    document_key: Optional[str] = Field(None, alias="documentKey")
    subject_type: str = Field(alias="subjectType")
    status: str
    is_current: bool = Field(alias="isCurrent")
    version: int
    file_name: str = Field(alias="fileName")
    reused: bool = True


class LinkedDocumentItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: int
    document_key: Optional[str] = Field(None, alias="documentKey")


class SkippedDocumentItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    document_key: Optional[str] = Field(None, alias="documentKey")
    reason: str


class LinkedMediaItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    reference_id: int = Field(alias="referenceId")
    media_type: str = Field(alias="mediaType")


class SkippedMediaItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    media_type: str = Field(alias="mediaType")
    reason: str


class LinkVerifiedResourcesResult(BaseModel):
    """POST /{property_id}/reuse-verified."""

    model_config = ConfigDict(populate_by_name=True)

    linked_documents: List[LinkedDocumentItem] = Field(default_factory=list, alias="linkedDocuments")
    skipped_documents: List[SkippedDocumentItem] = Field(default_factory=list, alias="skippedDocuments")
    linked_media: List[LinkedMediaItem] = Field(default_factory=list, alias="linkedMedia")
    skipped_media: List[SkippedMediaItem] = Field(default_factory=list, alias="skippedMedia")
