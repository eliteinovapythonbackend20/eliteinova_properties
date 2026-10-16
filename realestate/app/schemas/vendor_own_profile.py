"""Response shape for ProfileService._to_profile_response (the vendor's own
persistent VendorProfile row - distinct from VendorPropertyCard, which is a
per-listing BaseProperty row). Role-specific fields (RERA/GST/experience/...)
are declared on app.schemas.vendor_profile_details.ROLE_EXTRA_SCHEMA and
vary per vendor_type, and _to_profile_response flattens them onto this same
top-level dict (alongside the one role-matching *Details blob) - rather than
redeclare each role's field set here too, extra="allow" lets them pass
through validated already (by ROLE_EXTRA_SCHEMA, before they ever reach this
model) without this model needing to know their names.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.vendor_property_card import VendorPropertyListResponse


class VendorOwnProfile(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")

    id: Optional[int] = None
    user_id: Optional[str] = Field(None, alias="userId")
    full_name: Optional[str] = Field(None, alias="fullName")
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    whatsapp_number: Optional[str] = Field(None, alias="whatsappNumber")
    gender: Optional[str] = None
    company_name: Optional[str] = Field(None, alias="companyName")
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pin_code: Optional[str] = Field(None, alias="pinCode")
    aadhaar_number: Optional[str] = Field(None, alias="aadhaarNumber")
    pan_number: Optional[str] = Field(None, alias="panNumber")
    bank_name: Optional[str] = Field(None, alias="bankName")
    account_holder_name: Optional[str] = Field(None, alias="accountHolderName")
    account_number: Optional[str] = Field(None, alias="accountNumber")
    ifsc_code: Optional[str] = Field(None, alias="ifscCode")
    upi_id: Optional[str] = Field(None, alias="upiId")
    website: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    linked_in: Optional[str] = Field(None, alias="linkedIn")
    youtube: Optional[str] = None
    preferred_contact_method: Optional[List[str]] = Field(None, alias="preferredContactMethod")
    preferred_contact_time: Optional[List[str]] = Field(None, alias="preferredContactTime")

    # Exactly one of these four is present, matching the role being asked
    # about (ROLE_DETAILS_KEY) - metadata only, never a file location.
    owner_details: Optional[Dict[str, Any]] = Field(None, alias="ownerDetails")
    agency_details: Optional[Dict[str, Any]] = Field(None, alias="agencyDetails")
    builder_details: Optional[Dict[str, Any]] = Field(None, alias="builderDetails")
    pm_details: Optional[Dict[str, Any]] = Field(None, alias="pmDetails")

    # Added only by GET /{vendor_type} (from the authenticated session's own
    # User.email), never by PUT's update response.
    email_address: Optional[str] = Field(None, alias="emailAddress")

    # Current profile photo/logo URL, resolved from USER_MEDIA - see
    # ProfileService._vendor_media_urls.
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    company_logo_url: Optional[str] = Field(None, alias="companyLogoUrl")


class VendorDocumentMeta(BaseModel):
    """ProfileService._document_public_view's shape - metadata only, never a
    raw file URL (the file lives in the private bucket; a fresh signed URL
    is minted on demand by GET .../documents/{doc_type}/view-url). Resolved
    live from UserDocument/FileAsset, so status is always the real
    verification state, never a stale cached copy."""

    model_config = ConfigDict(populate_by_name=True)

    doc_type: str = Field(alias="docType")
    status: Optional[str] = None
    file_name: Optional[str] = Field(None, alias="fileName")
    mime_type: Optional[str] = Field(None, alias="mimeType")
    file_size_kb: Optional[int] = Field(None, alias="fileSizeKb")
    uploaded_at: Optional[str] = Field(None, alias="uploadedAt")


class ProfileFilesForRole(BaseModel):
    """GET /profile-files's per-role entry - ProfileService.get_profile_files_for_role's shape."""

    model_config = ConfigDict(populate_by_name=True)
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    company_logo_url: Optional[str] = Field(None, alias="companyLogoUrl")


class VendorProfileWithProperties(BaseModel):
    """GET /{vendor_type} - the one route that returns {success, profile,
    properties} instead of the usual {success, data[, message]} envelope."""

    success: bool = True
    profile: VendorOwnProfile
    properties: VendorPropertyListResponse
