"""Request/response schemas for the admin dashboard's property surface.

Deliberately separate from app.schemas.property_* - the admin dashboard is a
read/moderate view over the same `properties` table the vendor-posting flow
writes to, but it's a distinct domain (admin moderation vs. vendor
authoring) and is kept on its own schema/repository/service stack so a
change here can never ripple into the posting forms or public listing path.
"""

from typing import Optional

from pydantic import BaseModel, field_validator

from app.schemas.property_enums import ListingPurpose, PropertyCategory, PropertyStatus, VerificationStatus


class AdminPropertyStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: str) -> str:
        canonical = {s.value.upper(): s.value for s in PropertyStatus}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid status '{v}'. Allowed: {allowed}")
        return resolved


class AdminPropertyUpdate(BaseModel):
    """Fields the admin dashboard's Edit Property form can actually change -
    deliberately narrower than the full vendor-authoring schema
    (property_type/category/pricing/location stay vendor-owned; this only
    covers what's genuinely an admin-side property record edit)."""

    property_title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    featured: Optional[bool] = None
    verification_status: Optional[str] = None
    property_category: Optional[str] = None
    property_type: Optional[str] = None
    sub_category: Optional[str] = None
    listing_purpose: Optional[str] = None
    address: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    area: Optional[str] = None
    pin_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    expected_price: Optional[float] = None

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        canonical = {s.value.upper(): s.value for s in PropertyStatus}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid status '{v}'. Allowed: {allowed}")
        return resolved

    @field_validator("verification_status")
    @classmethod
    def _validate_verification_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        canonical = {s.value.upper(): s.value for s in VerificationStatus}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid verification_status '{v}'. Allowed: {allowed}")
        return resolved

    @field_validator("property_category")
    @classmethod
    def _validate_property_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        canonical = {c.value.upper(): c.value for c in PropertyCategory}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid property_category '{v}'. Allowed: {allowed}")
        return resolved

    @field_validator("listing_purpose")
    @classmethod
    def _validate_listing_purpose(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        canonical = {p.value.upper(): p.value for p in ListingPurpose}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid listing_purpose '{v}'. Allowed: {allowed}")
        return resolved

    @field_validator("price_min", "price_max", "expected_price")
    @classmethod
    def _validate_non_negative(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("Price fields must be zero or greater")
        return v


class AdminPropertyListParams(BaseModel):
    """Query-param bundle for GET /properties - validated once here instead
    of scattering ad-hoc checks across the route function."""

    page: int = 1
    limit: int = 20
    posted_by: Optional[str] = None
    property_category: Optional[str] = None
    property_type: Optional[str] = None
    sub_category: Optional[str] = None
    status: Optional[str] = None
    listing_purpose: Optional[str] = None
    featured: Optional[bool] = None
    verification_status: Optional[str] = None
    search: Optional[str] = None

    @field_validator("page")
    @classmethod
    def _validate_page(cls, v: int) -> int:
        if v < 1:
            raise ValueError("page must be greater than 0")
        return v

    @field_validator("limit")
    @classmethod
    def _validate_limit(cls, v: int) -> int:
        if v < 1 or v > 100:
            raise ValueError("limit must be between 1 and 100")
        return v

    @field_validator("listing_purpose")
    @classmethod
    def _validate_listing_purpose(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        canonical = {p.value.upper(): p.value for p in ListingPurpose}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid listing_purpose '{v}'. Allowed: {allowed}")
        return resolved

    @field_validator("verification_status")
    @classmethod
    def _validate_verification_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        canonical = {s.value.upper(): s.value for s in VerificationStatus}
        resolved = canonical.get(v.strip().upper())
        if not resolved:
            allowed = ", ".join(canonical.values())
            raise ValueError(f"Invalid verification_status '{v}'. Allowed: {allowed}")
        return resolved
