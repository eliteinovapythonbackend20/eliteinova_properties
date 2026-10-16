"""Response payloads for document_controller.py (user/admin document
version views and the migration-comparison report) - mirrors
_version_view / _property_version_view there, and
document_comparison_service.compare_vendor_documents's return shape.
"""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class DocumentVersionView(BaseModel):
    """Mirrors document_controller._version_view - a user_documents row.
    Never the stored URL or any signed URL."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    document_key: Optional[str] = Field(None, alias="documentKey")
    version: int
    status: str
    is_current: bool = Field(alias="isCurrent")
    rejection_reason: Optional[str] = Field(None, alias="rejectionReason")
    verified_at: Optional[str] = Field(None, alias="verifiedAt")
    verified_by: Optional[str] = Field(None, alias="verifiedBy")
    original_name: Optional[str] = Field(None, alias="originalName")
    mime_type: Optional[str] = Field(None, alias="mimeType")
    size_bytes: Optional[int] = Field(None, alias="sizeBytes")
    created_at: Optional[str] = Field(None, alias="createdAt")


class PropertyDocumentVersionView(BaseModel):
    """Mirrors document_controller._property_version_view - a
    property_documents row. Never the stored URL or any signed URL."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    property_id: Optional[str] = Field(None, alias="propertyId")
    user_id: Optional[str] = Field(None, alias="userId")
    document_key: Optional[str] = Field(None, alias="documentKey")
    version: int
    status: str
    is_current: bool = Field(alias="isCurrent")
    rejection_reason: Optional[str] = Field(None, alias="rejectionReason")
    verified_at: Optional[str] = Field(None, alias="verifiedAt")
    verified_by: Optional[str] = Field(None, alias="verifiedBy")
    file_name: Optional[str] = Field(None, alias="fileName")
    mime_type: Optional[str] = Field(None, alias="mimeType")
    created_at: Optional[str] = Field(None, alias="createdAt")


class MigrationMismatch(BaseModel):
    source: str
    user_id: str
    document_key: str
    reason: str
    stored_url: Optional[str] = None


class MigrationComparisonResult(BaseModel):
    checked: int
    matched: int
    mismatch_count: int
    mismatches: List[MigrationMismatch]
