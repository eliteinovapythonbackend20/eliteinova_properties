"""Request/response schemas for the customer-facing self-service surface
("my own" profile, saved properties, wishlist, requirements, and property
requests) - the self-service counterpart to app.schemas.admin_customer_schemas.

Kept as its own module rather than reusing the admin schemas directly: the
editable field set is a strict subset (a customer can't self-verify their own
KYC or flip emailVerified/phoneVerified - those stay admin-only, same split
as Customer.kyc_status / User.status in the admin domain), and request
bodies here never carry userId - identity always comes from the authenticated
session (current_user), never a request field.

camelCase request/response, matching admin_customer_schemas.py's convention
and this codebase's established contract.
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel, field_validator

CUSTOMER_TYPES = {"buyer", "tenant", "both"}

# Canonical, most-granular pipeline per request_type - lifted from this
# codebase's own admin dashboard "Status" screens (PurchaseRequestStatus.jsx /
# RentalRequestStatus.jsx), the superset of the 3 inconsistent pipelines each
# admin module used before this table existed. Stored lowercase/underscored.
PURCHASE_REQUEST_STATUSES = [
    "new", "contacted", "interested", "site_visit", "offer_submitted",
    "negotiation", "offer_accepted", "agreement", "sale_completed", "closed_lost",
]
RENTAL_REQUEST_STATUSES = [
    "new", "contacted", "shortlisted", "site_visit", "application_submitted",
    "owner_review", "approved", "rejected", "agreement", "rented", "closed",
]
REQUEST_TYPES = {"purchase", "rental"}


def _canonicalize(v: Optional[str], allowed: set, field_name: str) -> Optional[str]:
    if v is None:
        return v
    canonical = {a.upper(): a for a in allowed}
    resolved = canonical.get(v.strip().upper())
    if not resolved:
        raise ValueError(f"Invalid {field_name} '{v}'. Allowed: {', '.join(sorted(allowed))}")
    return resolved


# ----------------------------------------------------------------------
# Profile - "my own" Customer row
# ----------------------------------------------------------------------
class CustomerProfileUpdate(BaseModel):
    """PATCH /customer/profile body - a strict subset of AdminCustomerUpdate.
    Deliberately excludes: status, kycStatus, kycAadhaarVerified/
    panVerified/gstVerified/reraVerified, emailVerified, phoneVerified,
    aadhaarDocUrl/panDocUrl/gstDocUrl/reraDocUrl - all of those are
    admin/verification-controlled and never customer-writable directly
    (doc URLs are set via the dedicated upload route, which does not flip
    the verified flag itself)."""

    fullName: Optional[str] = None
    phoneNumber: Optional[str] = None
    alternatePhone: Optional[str] = None
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

    @field_validator("customerType")
    @classmethod
    def _validate_customer_type(cls, v: Optional[str]) -> Optional[str]:
        return _canonicalize(v, CUSTOMER_TYPES, "customerType")


# ----------------------------------------------------------------------
# Requirements - identical editable shape to AdminRequirementInput, kept as
# its own class so the customer surface never imports the admin schema module.
# ----------------------------------------------------------------------
class CustomerRequirementInput(BaseModel):
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


class CustomerRequirementCreate(CustomerRequirementInput):
    pass


class CustomerRequirementUpdate(CustomerRequirementInput):
    pass


# ----------------------------------------------------------------------
# Saved properties / wishlist - add bodies are tiny (property_id is a path
# param, not a body field)
# ----------------------------------------------------------------------
class SavedPropertyCreate(BaseModel):
    notes: Optional[str] = None


class WishlistItemCreate(BaseModel):
    pass


# ----------------------------------------------------------------------
# Property requests (purchase / rental) - customer self-service create only;
# status/statusHistory are admin-only writes (see admin_property_request_schemas).
# ----------------------------------------------------------------------
class PropertyRequestCreate(BaseModel):
    requestType: str
    requestedAmount: Optional[float] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    preferredDate: Optional[date] = None
    timeline: Optional[str] = None
    occupantType: Optional[str] = None
    occupantsCount: Optional[int] = None
    employmentType: Optional[str] = None
    companyName: Optional[str] = None
    monthlyIncome: Optional[float] = None
    financingRequired: Optional[bool] = None
    siteVisitRequested: Optional[bool] = None
    siteVisitDate: Optional[date] = None
    isUrgent: Optional[bool] = None
    notes: Optional[str] = None

    @field_validator("requestType")
    @classmethod
    def _validate_request_type(cls, v: str) -> str:
        resolved = _canonicalize(v, REQUEST_TYPES, "requestType")
        if not resolved:
            raise ValueError("requestType is required")
        return resolved
