"""Request schema for PUT /profile/{vendor_type} - validates/types the
shared VendorProfile columns (replacing a raw Dict[str, Any] body) while
passing role-specific fields (RERA/GST/experience/...) through untouched,
exactly as before - those are validated separately, once vendor_type is
known, by app.schemas.vendor_profile_details.ROLE_EXTRA_SCHEMA inside
VendorProfileRepository.update_vendor_profile.

Several shared fields have more than one accepted wire name depending on
which role's edit form sent it (see profile_repository._FIELD_ALIASES, the
long-standing source of truth this mirrors) - AliasChoices accepts any of
them, and a fixed serialization_alias normalizes the output back to one
spelling, so the repository's own alias resolution always sees a name it
already recognizes no matter which spelling the client used.
"""

from typing import List, Optional

from pydantic import AliasChoices, BaseModel, ConfigDict, Field


class VendorProfileUpdate(BaseModel):
    # extra="allow": a role-specific field (e.g. reraRegistrationNumber,
    # dateOfBirth) is not declared here at all - it passes through as-is for
    # the repository's existing ROLE_EXTRA_SCHEMA routing to pick up.
    model_config = ConfigDict(populate_by_name=True, extra="allow")

    full_name: Optional[str] = Field(
        None, validation_alias=AliasChoices("fullName", "authFullName"), serialization_alias="fullName"
    )
    phone_number: Optional[str] = Field(
        None, validation_alias=AliasChoices("phoneNumber", "mobileNumber", "authMobile"), serialization_alias="phoneNumber"
    )
    whatsapp_number: Optional[str] = Field(
        None, validation_alias=AliasChoices("whatsappNumber", "authWhatsapp"), serialization_alias="whatsappNumber"
    )
    gender: Optional[str] = None
    company_name: Optional[str] = Field(
        None, validation_alias=AliasChoices("companyName", "agencyName"), serialization_alias="companyName"
    )
    address: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = Field(
        None, validation_alias=AliasChoices("pincode", "pinCode"), serialization_alias="pincode"
    )
    aadhar_number: Optional[str] = Field(
        None, validation_alias=AliasChoices("aadhaarNumber", "aadharNumber"), serialization_alias="aadhaarNumber"
    )
    pan_number: Optional[str] = Field(None, alias="panNumber")
    bank_name: Optional[str] = Field(None, alias="bankName")
    account_holder_name: Optional[str] = Field(None, alias="accountHolderName")
    account_number: Optional[str] = Field(None, alias="accountNumber")
    ifsc_code: Optional[str] = Field(None, alias="ifscCode")
    upi_id: Optional[str] = Field(None, alias="upiId")
    # Not "companyWebsite" too - that's the Builder/PM company site, stored
    # separately in builder_details/pm_details.company_website (see
    # app.schemas.vendor_profile_details). Accepting it here under this same
    # field used to make saving either website silently overwrite the other.
    website: Optional[str] = None
    facebook: Optional[str] = Field(
        None, validation_alias=AliasChoices("facebook", "facebookPage"), serialization_alias="facebook"
    )
    instagram: Optional[str] = None
    linkedin: Optional[str] = Field(
        None, validation_alias=AliasChoices("linkedin", "linkedIn"), serialization_alias="linkedin"
    )
    youtube: Optional[str] = Field(
        None, validation_alias=AliasChoices("youtube", "youtubeChannel"), serialization_alias="youtube"
    )
    preferred_contact_method: Optional[List[str]] = Field(
        None,
        validation_alias=AliasChoices("preferredContactMethod", "preferredMethods"),
        serialization_alias="preferredContactMethod",
    )
    preferred_contact_time: Optional[List[str]] = Field(
        None,
        validation_alias=AliasChoices("preferredContactTime", "preferredTimes"),
        serialization_alias="preferredContactTime",
    )
