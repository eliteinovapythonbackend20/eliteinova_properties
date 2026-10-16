"""DTOs for property_contact_persons - the unified replacement for
owner_properties/agent_properties/builder_properties/property_management_properties.

This is the schema-based validation layer the ad-hoc `.get()` calls in
PropertyRepository._create_role_specific_details were missing: each role's
required fields are declared once, here, instead of scattered as implicit
"this will be None if absent" behaviour in a service method. Not yet wired
into any request/response path - see property_repository.py for the current
(still-live) per-table construction this will eventually replace.
"""
from __future__ import annotations

from datetime import date
from typing import List, Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field


class BankDetails(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    bank_name: Optional[str] = Field(None, alias="bankName")
    account_holder_name: Optional[str] = Field(None, alias="accountHolderName")
    account_number: Optional[str] = Field(None, alias="accountNumber")
    ifsc_code: Optional[str] = Field(None, alias="ifscCode")
    upi_id: Optional[str] = Field(None, alias="upiId")


class SocialLinks(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    website: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    youtube: Optional[str] = None


class OwnerRoleDetails(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    preferred_contact_method: List[str] = Field(default_factory=list, alias="preferredContactMethod")
    preferred_contact_time: List[str] = Field(default_factory=list, alias="preferredContactTime")
    additional_note: Optional[str] = Field(None, alias="additionalNote")


class AgentRoleDetails(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    company_name: Optional[str] = Field(None, alias="companyName")
    rera_registration_number: Optional[str] = Field(None, alias="reraRegistrationNumber")
    gst_number: Optional[str] = Field(None, alias="gstNumber")
    experience: Optional[int] = None
    active_listing: Optional[int] = Field(None, alias="activeListing")
    service_area: List[str] = Field(default_factory=list, alias="serviceArea")


class BuilderRoleDetails(BaseModel):
    """Also used as-is for PROPERTY_MANAGEMENT - identical shape on both
    legacy tables (builder_properties/property_management_properties)."""
    model_config = ConfigDict(populate_by_name=True)
    company_name: str = Field(..., alias="companyName")
    company_reg_number: str = Field(..., alias="companyRegNumber")
    company_website: Optional[str] = Field(None, alias="companyWebsite")
    company_description: Optional[str] = Field(None, alias="companyDescription")
    rera_registration_number: str = Field(..., alias="reraRegistrationNumber")
    gst_number: Optional[str] = Field(None, alias="gstNumber")
    experience: Optional[int] = None
    service_area: List[str] = Field(default_factory=list, alias="serviceArea")


class PropertyContactBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    property_id: str
    user_id: str

    name: Optional[str] = None
    date_of_birth: Optional[date] = Field(None, alias="dateOfBirth")
    gender: Optional[str] = None
    aadhaar_number: Optional[str] = Field(None, alias="aadhaarNumber")
    pan_number: Optional[str] = Field(None, alias="panNumber")
    mobile: Optional[str] = None
    whatsapp_number: Optional[str] = Field(None, alias="whatsappNumber")
    email: Optional[str] = None

    address_line1: Optional[str] = Field(None, alias="addressLine1")
    address_line2: Optional[str] = Field(None, alias="addressLine2")
    office_address: Optional[str] = Field(None, alias="officeAddress")
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    landmark: Optional[str] = None

    signature: Optional[str] = None
    signature_date: Optional[date] = Field(None, alias="signatureDate")
    signature_place: Optional[str] = Field(None, alias="signaturePlace")
    declaration_accepted: bool = Field(False, alias="declarationAccepted")

    bank_details: BankDetails = Field(default_factory=BankDetails, alias="bankDetails")


class OwnerContactCreate(PropertyContactBase):
    vendor_type: Literal["OWNER"] = "OWNER"
    mobile: str
    email: str
    role_details: OwnerRoleDetails = Field(default_factory=OwnerRoleDetails, alias="roleDetails")


class AgentContactCreate(PropertyContactBase):
    vendor_type: Literal["AGENT"] = "AGENT"
    mobile: str
    email: str
    social_links: SocialLinks = Field(default_factory=SocialLinks, alias="socialLinks")
    role_details: AgentRoleDetails = Field(default_factory=AgentRoleDetails, alias="roleDetails")


class BuilderContactCreate(PropertyContactBase):
    vendor_type: Literal["BUILDER"] = "BUILDER"
    name: str
    designation: str
    mobile: str
    email: str
    aadhaar_number: str = Field(..., alias="aadhaarNumber")
    pan_number: str = Field(..., alias="panNumber")
    office_address: str = Field(..., alias="officeAddress")
    city: str
    district: str
    state: str
    pincode: str
    landmark: str
    social_links: SocialLinks = Field(default_factory=SocialLinks, alias="socialLinks")
    role_details: BuilderRoleDetails = Field(..., alias="roleDetails")


class PropertyManagementContactCreate(BuilderContactCreate):
    vendor_type: Literal["PROPERTY_MANAGEMENT"] = "PROPERTY_MANAGEMENT"


# Discriminated on vendor_type - pick the right DTO for a given posted_by
# before validating a request, instead of one schema with every field optional.
PropertyContactCreate = Union[
    OwnerContactCreate, AgentContactCreate, BuilderContactCreate, PropertyManagementContactCreate,
]

CONTACT_DTO_BY_VENDOR_TYPE = {
    "OWNER": OwnerContactCreate,
    "AGENT": AgentContactCreate,
    "BUILDER": BuilderContactCreate,
    "PROPERTY_MANAGEMENT": PropertyManagementContactCreate,
}
