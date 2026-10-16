"""Response payloads for the customer self-service surface
(CustomerService._to_profile_card / _to_requirement_card /
_to_property_request_card in app/services/customer_service.py).
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.vendor_property_card import VendorPropertyCard


class KycDocumentStatus(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: Optional[str] = None
    uploaded_at: Optional[str] = Field(None, alias="uploadedAt")
    verified_at: Optional[str] = Field(None, alias="verifiedAt")


class CustomerProfileCard(BaseModel):
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
    preferred_contact_time: Optional[List[str]] = Field(None, alias="preferredContactTime")
    preferred_language: Optional[str] = Field(None, alias="preferredLanguage")
    newsletter_opt_in: Optional[bool] = Field(None, alias="newsletterOptIn")
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")


class RequirementCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
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


class PropertyRequestCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    request_type: Optional[str] = Field(None, alias="requestType")
    status: Optional[str] = None
    status_history: Optional[List[Dict[str, Any]]] = Field(None, alias="statusHistory")
    requested_amount: Optional[float] = Field(None, alias="requestedAmount")
    budget_min: Optional[float] = Field(None, alias="budgetMin")
    budget_max: Optional[float] = Field(None, alias="budgetMax")
    preferred_date: Optional[str] = Field(None, alias="preferredDate")
    timeline: Optional[str] = None
    occupant_type: Optional[str] = Field(None, alias="occupantType")
    occupants_count: Optional[int] = Field(None, alias="occupantsCount")
    employment_type: Optional[str] = Field(None, alias="employmentType")
    company_name: Optional[str] = Field(None, alias="companyName")
    monthly_income: Optional[float] = Field(None, alias="monthlyIncome")
    financing_required: Optional[str] = Field(None, alias="financingRequired")
    site_visit_requested: Optional[bool] = Field(None, alias="siteVisitRequested")
    site_visit_date: Optional[str] = Field(None, alias="siteVisitDate")
    is_urgent: Optional[bool] = Field(None, alias="isUrgent")
    notes: Optional[str] = None
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")
    property: Optional[VendorPropertyCard] = None
