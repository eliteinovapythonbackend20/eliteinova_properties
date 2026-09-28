"""Request/response schemas for the admin dashboard's customer-management
surface (Customer profile fields + the requirements/saved-properties/
wishlist/property-view rows that hang directly off a user's own id).

Kept fully separate from app.schemas.admin_dashboard_schemas on purpose -
same reasoning as that module's own docstring: a distinct admin domain
(customer moderation vs. property moderation) gets its own schema/repository/
service/controller stack so a change here can never ripple into the
Properties admin surface.

Request bodies here are camelCase (fullName, phoneNumber, ...) - matching the
exact contract a frontend agent is building against in parallel, rather than
the snake_case bodies admin_dashboard_schemas uses. Responses are camelCase
everywhere in this codebase already; this module just extends that to
requests too, for this one surface.

Identity: a user with role=USER IS the customer - there is no separate
customer id anywhere in this API surface. Every route/query-param/response
field that identifies "which customer" uses `userId` (the EP... string,
`users.id`), never the internal integer `customer.id` PK.
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models.user import UserStatus

CUSTOMER_TYPES = {"buyer", "tenant", "both"}
KYC_STATUSES = {"pending", "verified", "rejected"}


def _canonicalize(v: Optional[str], allowed: set, field_name: str) -> Optional[str]:
    if v is None:
        return v
    canonical = {a.upper(): a for a in allowed}
    resolved = canonical.get(v.strip().upper())
    if not resolved:
        raise ValueError(f"Invalid {field_name} '{v}'. Allowed: {', '.join(sorted(allowed))}")
    return resolved


class AdminCustomerFilterParams(BaseModel):
    """Filter fields shared between GET / (list) and GET /stats - kept as one
    base so a filter added to one can't silently drift out of sync with the
    other."""

    customerType: Optional[str] = None
    status: Optional[str] = None
    kycStatus: Optional[str] = None
    search: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

    @field_validator("customerType")
    @classmethod
    def _validate_customer_type(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, CUSTOMER_TYPES, "customerType")

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: Optional[str]) -> Optional[str]:
        allowed = {s.value for s in UserStatus}
        return _canonicalize(v, allowed, "status")

    @field_validator("kycStatus")
    @classmethod
    def _validate_kyc_status(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, KYC_STATUSES, "kycStatus")


class AdminCustomerListParams(AdminCustomerFilterParams):
    page: int = 1
    limit: int = 20

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


class AdminCustomerCreate(BaseModel):
    """POST / body - creates the User+Customer pair atomically. Only
    fullName/email/phoneNumber are mandatory; password is optional (a random
    one is generated when omitted, same hashing as normal registration)."""

    fullName: str
    email: str
    phoneNumber: str
    password: Optional[str] = None

    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    customerType: Optional[str] = None
    dateOfBirth: Optional[date] = None
    gender: Optional[str] = None
    maritalStatus: Optional[str] = None
    alternatePhone: Optional[str] = None
    occupation: Optional[str] = None
    employmentType: Optional[str] = None
    companyName: Optional[str] = None
    designation: Optional[str] = None
    annualIncome: Optional[float] = None
    preferredContactChannel: Optional[str] = None
    preferredContactTime: Optional[str] = None
    preferredLanguage: Optional[str] = None
    newsletterOptIn: Optional[bool] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    profilePicture: Optional[str] = None
    status: Optional[str] = None  # defaults to "pending" if omitted

    @field_validator("customerType")
    @classmethod
    def _validate_customer_type(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, CUSTOMER_TYPES, "customerType")

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: Optional[str]) -> Optional[str]:
        allowed = {s.value for s in UserStatus}
        return _canonicalize(v, allowed, "status")


class AdminCustomerUpdate(BaseModel):
    """PATCH /{user_id} body - partial update of any CustomerCard field
    except userId/email/createdAt/updatedAt. `status` lives on the joined
    User row (the repository routes it there); everything else is a Customer
    column. Dedicated /status and /kyc routes exist as convenience wrappers
    around the same underlying update - this route is the full superset."""

    fullName: Optional[str] = None
    phoneNumber: Optional[str] = None
    alternatePhone: Optional[str] = None
    profilePicture: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    customerType: Optional[str] = None
    dateOfBirth: Optional[date] = None
    gender: Optional[str] = None
    maritalStatus: Optional[str] = None
    occupation: Optional[str] = None
    employmentType: Optional[str] = None
    companyName: Optional[str] = None
    designation: Optional[str] = None
    annualIncome: Optional[float] = None
    preferredContactChannel: Optional[str] = None
    preferredContactTime: Optional[str] = None
    preferredLanguage: Optional[str] = None
    newsletterOptIn: Optional[bool] = None
    emailVerified: Optional[bool] = None
    phoneVerified: Optional[bool] = None

    status: Optional[str] = None
    kycStatus: Optional[str] = None
    kycAadhaarVerified: Optional[bool] = None
    kycPanVerified: Optional[bool] = None
    kycGstVerified: Optional[bool] = None
    kycReraVerified: Optional[bool] = None
    aadhaarDocUrl: Optional[str] = None
    panDocUrl: Optional[str] = None
    gstDocUrl: Optional[str] = None
    reraDocUrl: Optional[str] = None

    @field_validator("customerType")
    @classmethod
    def _validate_customer_type(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, CUSTOMER_TYPES, "customerType")

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: Optional[str]) -> Optional[str]:
        allowed = {s.value for s in UserStatus}
        return _canonicalize(v, allowed, "status")

    @field_validator("kycStatus")
    @classmethod
    def _validate_kyc_status(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, KYC_STATUSES, "kycStatus")


class AdminCustomerStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v: str) -> str:
        allowed = {s.value for s in UserStatus}
        resolved = _canonicalize(v, allowed, "status")
        if not resolved:
            raise ValueError("status is required")
        return resolved


class AdminCustomerKycUpdate(BaseModel):
    kycStatus: Optional[str] = None
    aadhaarVerified: Optional[bool] = None
    panVerified: Optional[bool] = None
    gstVerified: Optional[bool] = None
    reraVerified: Optional[bool] = None

    @field_validator("kycStatus")
    @classmethod
    def _validate_kyc_status(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, KYC_STATUSES, "kycStatus")


# ----------------------------------------------------------------------
# Customer requirements - backs a future requirement-filter page only. The
# actual requirements form hasn't been designed yet, so this field set is
# deliberately minimal and NOT final - do not add buyer/tenant-specific
# fields here speculatively. A user may submit this multiple times; every
# submission is kept, not overwritten.
# ----------------------------------------------------------------------
class AdminRequirementInput(BaseModel):
    """Shared shape for both POST /{user_id}/requirements and
    PATCH /requirements/{requirement_id} - both bodies are "any subset of
    RequirementCard fields", so one class covers both."""

    propertyCategory: Optional[str] = None
    listingPurpose: Optional[str] = None
    propertyType: Optional[str] = None
    bedrooms: Optional[int] = None
    preferredLocation: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    furnishingStatus: Optional[str] = None
    notes: Optional[str] = None
    isActive: Optional[bool] = None


class AdminRequirementCreate(AdminRequirementInput):
    pass


class AdminRequirementUpdate(AdminRequirementInput):
    pass


# ----------------------------------------------------------------------
# Saved properties / wishlist / property views (admin-wide lists)
# ----------------------------------------------------------------------
class AdminSavedPropertyListParams(BaseModel):
    page: int = 1
    limit: int = 20
    search: Optional[str] = None
    userId: Optional[str] = None

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


class AdminWishlistListParams(AdminSavedPropertyListParams):
    pass


class AdminPropertyViewListParams(BaseModel):
    page: int = 1
    limit: int = 20
    userId: Optional[str] = None

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
