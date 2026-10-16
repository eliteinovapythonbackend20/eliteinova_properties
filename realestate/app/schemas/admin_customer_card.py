"""Response payloads for the admin dashboard's customer-management surface
(AdminCustomerService._to_card / _to_requirement_card / _to_saved_property_card
/ _to_wishlist_card / _to_property_view_card in
app/services/admin_customer_service.py).
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common_response import PaginationMeta
from app.schemas.customer_profile_card import KycDocumentStatus


class AdminCustomerCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    user_id: Optional[str] = Field(None, alias="userId")
    full_name: Optional[str] = Field(None, alias="fullName")
    email: Optional[str] = None
    phone_number: Optional[str] = Field(None, alias="phoneNumber")
    alternate_phone: Optional[str] = Field(None, alias="alternatePhone")
    profile_picture: Optional[str] = Field(None, alias="profilePicture")
    bio: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    customer_type: Optional[str] = Field(None, alias="customerType")
    status: Optional[str] = None
    kyc_status: Optional[str] = Field(None, alias="kycStatus")
    kyc_aadhaar_verified: Optional[bool] = Field(None, alias="kycAadhaarVerified")
    kyc_pan_verified: Optional[bool] = Field(None, alias="kycPanVerified")
    kyc_gst_verified: Optional[bool] = Field(None, alias="kycGstVerified")
    documents: Optional[Dict[str, KycDocumentStatus]] = None
    email_verified: Optional[bool] = Field(None, alias="emailVerified")
    phone_verified: Optional[bool] = Field(None, alias="phoneVerified")
    occupation: Optional[str] = None
    employment_type: Optional[str] = Field(None, alias="employmentType")
    company_name: Optional[str] = Field(None, alias="companyName")
    designation: Optional[str] = None
    annual_income: Optional[float] = Field(None, alias="annualIncome")
    date_of_birth: Optional[str] = Field(None, alias="dateOfBirth")
    gender: Optional[str] = None
    marital_status: Optional[str] = Field(None, alias="maritalStatus")
    preferred_contact_channel: Optional[str] = Field(None, alias="preferredContactChannel")
    preferred_contact_time: Optional[str] = Field(None, alias="preferredContactTime")
    preferred_language: Optional[str] = Field(None, alias="preferredLanguage")
    newsletter_opt_in: Optional[bool] = Field(None, alias="newsletterOptIn")
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")


class AdminCustomerListResponse(BaseModel):
    data: List[AdminCustomerCard]
    pagination: PaginationMeta


class AdminCustomerStats(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    total: int
    buyer: int
    tenant: int
    both: int
    active: int
    pending: int
    blocked: int
    kyc_verified: int = Field(alias="kycVerified")
    kyc_pending: int = Field(alias="kycPending")
    kyc_rejected: int = Field(alias="kycRejected")
    email_verified: int = Field(alias="emailVerified")
    phone_verified: int = Field(alias="phoneVerified")


class AdminRequirementCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    user_id: Optional[str] = Field(None, alias="userId")
    property_category: Optional[str] = Field(None, alias="propertyCategory")
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    property_type: Optional[str] = Field(None, alias="propertyType")
    bedrooms: Optional[int] = None
    preferred_location: Optional[str] = Field(None, alias="preferredLocation")
    city: Optional[str] = None
    state: Optional[str] = None
    budget_min: Optional[float] = Field(None, alias="budgetMin")
    budget_max: Optional[float] = Field(None, alias="budgetMax")
    furnishing_status: Optional[str] = Field(None, alias="furnishingStatus")
    notes: Optional[str] = None
    is_active: Optional[bool] = Field(None, alias="isActive")
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")


class AdminRequirementListResponse(BaseModel):
    data: List[AdminRequirementCard]


class AdminActivityCardBase(BaseModel):
    """Shared join-through fields common to saved-property/wishlist cards -
    mirrors AdminCustomerService._base_activity_fields exactly."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    user_id: Optional[str] = Field(None, alias="userId")
    customer_name: Optional[str] = Field(None, alias="customerName")
    customer_email: Optional[str] = Field(None, alias="customerEmail")
    customer_phone: Optional[str] = Field(None, alias="customerPhone")
    property_id: Optional[int] = Field(None, alias="propertyId")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    property_type: Optional[str] = Field(None, alias="propertyType")
    property_category: Optional[str] = Field(None, alias="propertyCategory")
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    price: Optional[float] = None
    property_status: Optional[str] = Field(None, alias="propertyStatus")
    cover_image: Optional[str] = Field(None, alias="coverImage")


class AdminSavedPropertyCard(AdminActivityCardBase):
    notes: Optional[str] = None
    saved_at: Optional[str] = Field(None, alias="savedAt")


class AdminSavedPropertyListResponse(BaseModel):
    data: List[AdminSavedPropertyCard]
    pagination: PaginationMeta


class AdminWishlistCard(AdminActivityCardBase):
    price_at_add: Optional[float] = Field(None, alias="priceAtAdd")
    current_price: Optional[float] = Field(None, alias="currentPrice")
    price_changed: Optional[bool] = Field(None, alias="priceChanged")
    is_new: Optional[bool] = Field(None, alias="isNew")
    added_at: Optional[str] = Field(None, alias="addedAt")


class AdminWishlistListResponse(BaseModel):
    data: List[AdminWishlistCard]
    pagination: PaginationMeta


class AdminPropertyViewCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    user_id: Optional[str] = Field(None, alias="userId")
    customer_name: Optional[str] = Field(None, alias="customerName")
    property_id: Optional[int] = Field(None, alias="propertyId")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    view_count: Optional[int] = Field(None, alias="viewCount")
    first_viewed_at: Optional[str] = Field(None, alias="firstViewedAt")
    last_viewed_at: Optional[str] = Field(None, alias="lastViewedAt")


class AdminPropertyViewListResponse(BaseModel):
    data: List[AdminPropertyViewCard]
    pagination: PaginationMeta
