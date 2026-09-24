"""Typed schemas for the per-role JSONB blobs on VendorProfile
(agency_details / builder_details / pm_details).

These fields don't map to real VendorProfile columns because only one role
ever fills them in (e.g. "RERA registration number" only makes sense for an
Agent/Builder/PM, never an Owner). Rather than store the raw request body
verbatim, ProfileService validates incoming data through these models first
- extra/unknown keys are dropped and types are coerced - and merges the
result into the existing blob (a partial update, not a full replace).

Wire format is camelCase (matches the profile edit forms); storage is
snake_case (matches every other column on this table).
"""

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class _RoleProfileExtra(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")


class AgentProfileExtra(_RoleProfileExtra):
    # Profile photo/logo are role-specific: an Agent's "easy navigation" photo
    # and agency logo live in this blob, not a column shared with the other
    # three roles, so switching roles never shows another role's image.
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    company_logo_url: Optional[str] = Field(None, alias="companyLogoUrl")
    rera_registration_number: Optional[str] = Field(None, alias="reraRegistrationNumber")
    gst_number: Optional[str] = Field(None, alias="gstNumber")
    years_of_experience: Optional[int] = Field(None, alias="yearsOfExperience")
    number_of_active_listings: Optional[int] = Field(None, alias="numberOfActiveListings")
    # Free-text input ("e.g. Mumbai, Pune, Navi Mumbai"), not a multi-select -
    # stored as typed by the vendor, not split into a list.
    service_areas: Optional[str] = Field(None, alias="serviceAreas")
    # Agency office address - role-specific, not the shared personal
    # address columns (those stay free for an owner's home address).
    office_address: Optional[str] = Field(None, alias="officeAddress")

    @field_validator("years_of_experience", "number_of_active_listings", mode="before")
    @classmethod
    def _blank_to_none(cls, v):
        if v in ("", None):
            return None
        try:
            return int(v)
        except (TypeError, ValueError):
            return None


class BuilderProfileExtra(_RoleProfileExtra):
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    company_logo_url: Optional[str] = Field(None, alias="companyLogoUrl")
    company_reg_number: Optional[str] = Field(None, alias="companyRegNumber")
    rera_number: Optional[str] = Field(None, alias="reraNumber")
    gst_number: Optional[str] = Field(None, alias="gstNumber")
    years_of_experience: Optional[int] = Field(None, alias="yearsOfExperience")
    company_profile: Optional[str] = Field(None, alias="companyProfile")
    designation: Optional[str] = Field(None, alias="authDesignation")
    # Office address - role-specific, not the shared personal address
    # columns (those stay free for an owner's home address).
    office_address: Optional[str] = Field(None, alias="officeAddress")
    office_city: Optional[str] = Field(None, alias="officeCity")
    office_district: Optional[str] = Field(None, alias="officeDistrict")
    office_state: Optional[str] = Field(None, alias="officeState")
    office_pincode: Optional[str] = Field(None, alias="officePinCode")
    office_landmark: Optional[str] = Field(None, alias="officeLandmark")
    ongoing_projects: Optional[int] = Field(None, alias="ongoingProjects")
    completed_projects: Optional[int] = Field(None, alias="completedProjects")
    upcoming_projects: Optional[int] = Field(None, alias="upcomingProjects")
    total_units_delivered: Optional[int] = Field(None, alias="totalUnitsDelivered")
    # Free-text inputs ("e.g. Mumbai, Pune, Nashik"), not multi-selects.
    cities_of_operation: Optional[str] = Field(None, alias="citiesOfOperation")
    service_locations: Optional[str] = Field(None, alias="serviceLocations")

    @field_validator(
        "years_of_experience", "ongoing_projects", "completed_projects",
        "upcoming_projects", "total_units_delivered", mode="before",
    )
    @classmethod
    def _blank_to_none(cls, v):
        if v in ("", None):
            return None
        try:
            return int(v)
        except (TypeError, ValueError):
            return None


class PropertyManagementProfileExtra(_RoleProfileExtra):
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    company_logo_url: Optional[str] = Field(None, alias="companyLogoUrl")
    business_reg_number: Optional[str] = Field(None, alias="businessRegNumber")
    rera_number: Optional[str] = Field(None, alias="reraNumber")
    gst_number: Optional[str] = Field(None, alias="gstNumber")
    years_of_experience: Optional[int] = Field(None, alias="yearsOfExperience")
    company_description: Optional[str] = Field(None, alias="companyDescription")
    designation: Optional[str] = Field(None, alias="authDesignation")
    # Office address - role-specific, not the shared personal address
    # columns (those stay free for an owner's home address).
    office_address: Optional[str] = Field(None, alias="officeAddress")
    office_city: Optional[str] = Field(None, alias="officeCity")
    office_district: Optional[str] = Field(None, alias="officeDistrict")
    office_state: Optional[str] = Field(None, alias="officeState")
    office_pincode: Optional[str] = Field(None, alias="officePinCode")
    office_landmark: Optional[str] = Field(None, alias="officeLandmark")

    @field_validator("years_of_experience", mode="before")
    @classmethod
    def _blank_to_none(cls, v):
        if v in ("", None):
            return None
        try:
            return int(v)
        except (TypeError, ValueError):
            return None


class OwnerProfileExtra(_RoleProfileExtra):
    # Owner-only fields with no shared VendorProfile column of their own
    # (unlike gender/address/bank details, which every role shares). Owners
    # aren't a company, so there's no logo counterpart here.
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    date_of_birth: Optional[str] = Field(None, alias="dateOfBirth")
    additional_note: Optional[str] = Field(None, alias="additionalNotes")


ROLE_EXTRA_SCHEMA = {
    "OWNER": OwnerProfileExtra,
    "AGENT": AgentProfileExtra,
    "BUILDER": BuilderProfileExtra,
    "PROPERTY_MANAGEMENT": PropertyManagementProfileExtra,
}

ROLE_EXTRA_COLUMN = {
    "OWNER": "owner_details",
    "AGENT": "agency_details",
    "BUILDER": "builder_details",
    "PROPERTY_MANAGEMENT": "pm_details",
}

# The wire-format (camelCase) keys each role's schema accepts - used to split
# an incoming update payload into "flat column" vs "role-specific JSONB" data
# before it's applied.
ROLE_EXTRA_ALIASES = {
    role: {field.alias for field in schema.model_fields.values() if field.alias}
    for role, schema in ROLE_EXTRA_SCHEMA.items()
}
