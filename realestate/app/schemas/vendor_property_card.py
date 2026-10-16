"""The vendor-dashboard property card - ProfileService.to_response's exact
shape. This is a SEPARATE formatter from PropertyService._to_card (see
app.schemas.property_response.PropertyResponse) - same underlying
BaseProperty row, different presentation: this one is for a vendor's own
"my properties" list/detail and a customer's saved/wishlist/requested-property
cards (all authenticated, owner-or-requester-only views), the other is for
the public, contact-free browse/filter surface. They are not interchangeable;
several fields exist under different names in each (e.g. postedBy is a plain
role string here, a {role, displayName, ...} object there), and this one
alone carries contactPersonDetails.

Every field ProfileService.to_response actually returns must have a match
here - response_model silently drops anything undeclared (see
PropertyResponse's own docstring for why this is a correctness rule, not a
style preference).
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.property_response import PropertyDocumentResponse


class VendorMediaUploadResult(BaseModel):
    """PropertyService.add_property_image_raw/add_property_video_raw/
    set_property_cover_raw's response - trimmed to file_url only. Every
    OwnerProfile.jsx/AgentProfile.jsx/BuilderProfile.jsx/
    PropertyManagementProfile.jsx call site reads nothing but
    result.data.file_url (confirmed by grep across all four) - the service
    methods return several other real PropertyMedia columns (id,
    thumbnail_url, width, height, is_primary, media_type), but there is no
    reader for them, so they don't belong on the wire."""

    model_config = ConfigDict(populate_by_name=True)

    file_url: str


class VendorGalleryImage(BaseModel):
    """PropertyFormatter.format_media_split's gallery item shape - distinct
    from PropertyMediaResponse (uses 'type' not 'mediaType', carries
    filename_mapper, isPrimary always False here since the cover image is
    split out separately as coverImage)."""

    model_config = ConfigDict(populate_by_name=True)

    id: int
    file_url: str = Field(alias="fileUrl")
    type: str
    filename_mapper: Optional[str] = None
    is_primary: bool = Field(False, alias="isPrimary")


class ContactPersonDetails(BaseModel):
    """PropertyFormatter.format_contact_person's shape - the per-property
    contact person (owner/agent/builder/PM) filled in on that property's own
    posting form. Vendor-profile-page and saved/wishlist/request card views
    only, never the public card/list."""

    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    mobile: Optional[str] = None
    email_id: Optional[str] = Field(None, alias="emailId")
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")
    company_logo: Optional[str] = Field(None, alias="companyLogo")
    designation: Optional[str] = None
    whatsapp_number: Optional[str] = Field(None, alias="whatsappNumber")
    date_of_birth: Optional[str] = Field(None, alias="dateOfBirth")
    gender: Optional[str] = None
    aadhaar_number: Optional[str] = Field(None, alias="aadhaarNumber")
    pan_number: Optional[str] = Field(None, alias="panNumber")
    address_line1: Optional[str] = Field(None, alias="addressLine1")
    address_line2: Optional[str] = Field(None, alias="addressLine2")
    office_address: Optional[str] = Field(None, alias="officeAddress")
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    landmark: Optional[str] = None
    company_name: Optional[str] = Field(None, alias="companyName")
    company_reg_number: Optional[str] = Field(None, alias="companyRegNumber")
    company_website: Optional[str] = Field(None, alias="companyWebsite")
    company_profile: Optional[str] = Field(None, alias="companyProfile")
    rera_registration_number: Optional[str] = Field(None, alias="reraRegistrationNumber")
    gst_number: Optional[str] = Field(None, alias="gstNumber")
    experience: Optional[Any] = None
    active_listing: Optional[Any] = Field(None, alias="activeListing")
    service_area: Optional[List[str]] = Field(None, alias="serviceArea")
    website: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    youtube: Optional[str] = None
    bank_name: Optional[str] = Field(None, alias="bankName")
    account_holder_name: Optional[str] = Field(None, alias="accountHolderName")
    account_number: Optional[str] = Field(None, alias="accountNumber")
    ifsc_code: Optional[str] = Field(None, alias="ifscCode")
    upi_id: Optional[str] = Field(None, alias="upiId")
    preferred_contact_method: Optional[List[str]] = Field(None, alias="preferredContactMethod")
    preferred_contact_time: Optional[List[str]] = Field(None, alias="preferredContactTime")
    additional_note: Optional[str] = Field(None, alias="additionalNote")


class VendorPropertyCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    # Basic identifiers
    id: str
    # Genuinely snake_case on the wire here (the one inconsistency in this
    # formatter - see ProfileService._to_profile_response's own note about
    # pinCode for the same kind of drift elsewhere), not a typo.
    user_id: Optional[str] = None

    # Listing and property categorization
    posted_by: Optional[str] = Field(None, alias="postedBy")
    property_type: Optional[str] = Field(None, alias="propertyType")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    property_category: Optional[str] = Field(None, alias="propertyCategory")

    # Location
    property_address: Optional[str] = Field(None, alias="propertyAddress")
    area: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    landmark: Optional[str] = None

    # Property details
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floor_number: Optional[int] = Field(None, alias="floorNumber")
    total_floors: Optional[int] = Field(None, alias="totalFloors")
    property_age: Optional[int] = Field(None, alias="propertyAge")
    corner_unit: Optional[str] = Field(None, alias="cornerUnit")
    facing: Optional[str] = None

    # Area details
    carpet_area: Optional[float] = Field(None, alias="carpetArea")
    built_up_area: Optional[float] = Field(None, alias="builtUpArea")
    has_garden: Optional[str] = Field(None, alias="hasGarden")

    # Furnishing & features
    furnishing_status: Optional[str] = Field(None, alias="furnishingStatus")
    has_terrace: Optional[str] = Field(None, alias="hasTerrace")
    has_balcony: Optional[str] = Field(None, alias="hasBalcony")
    highlights: Optional[List[str]] = None

    # Parking
    parking: Optional[str] = None
    parking_spaces: Optional[int] = Field(None, alias="parkingSpaces")

    # Amenities / nearby
    amenities: Optional[List[str]] = None
    nearby_places: Optional[List[str]] = Field(None, alias="nearbyPlaces")

    # Tenant preferences
    occupancy_type: Optional[str] = Field(None, alias="occupancyType")
    smoking_allowed: Optional[str] = Field(None, alias="smokingAllowed")
    dietary_preference: Optional[str] = Field(None, alias="dietaryPreference")
    pet_friendly: Optional[str] = Field(None, alias="petFriendly")

    # Availability
    available_from: Optional[str] = Field(None, alias="availableFrom")
    immediate_move_in: Optional[str] = Field(None, alias="immediateMoveIn")
    rental_duration: Optional[str] = Field(None, alias="rentalDuration")

    # Pricing
    expected_price: Optional[float] = Field(None, alias="expectedPrice")
    budget_min: Optional[float] = Field(None, alias="budgetMin")
    budget_max: Optional[float] = Field(None, alias="budgetMax")
    is_negotiable: Optional[str] = Field(None, alias="isNegotiable")
    security_deposit: Optional[float] = Field(None, alias="securityDeposit")
    maintenance_included: Optional[str] = Field(None, alias="maintenanceIncluded")
    maintenance: Optional[float] = None

    # Ownership
    ownership_type: Optional[str] = Field(None, alias="ownershipType")
    loan_outstanding: Optional[str] = Field(None, alias="loanOutstanding")
    property_condition: Optional[str] = Field(None, alias="propertyCondition")
    property_status: Optional[str] = Field(None, alias="propertyStatus")

    # Sell specific
    property_tax: Optional[str] = Field(None, alias="propertyTax")
    title_deed_verified: Optional[str] = Field(None, alias="titleDeedVerified")
    under_construction: Optional[str] = Field(None, alias="underConstruction")
    immediate_possession: Optional[str] = Field(None, alias="immediatePossession")
    rera_approved: Optional[str] = Field(None, alias="reraApproved")
    home_loan_required: Optional[str] = Field(None, alias="homeLoanRequired")

    # Lease specific
    renewable_option: Optional[str] = Field(None, alias="renewableOption")
    lease_duration: Optional[str] = Field(None, alias="leaseDuration")
    advance_deposit: Optional[float] = Field(None, alias="advanceDeposit")

    # Commercial specific
    commercial_type: Optional[str] = Field(None, alias="commercialType")
    business_type: Optional[str] = Field(None, alias="businessType")
    estimated_footfall: Optional[str] = Field(None, alias="estimatedFootfall")
    operating_hours: Optional[str] = Field(None, alias="operatingHours")
    zoning_type: Optional[str] = Field(None, alias="zoningType")
    lease_type: Optional[str] = Field(None, alias="leaseType")
    fit_out: Optional[str] = Field(None, alias="fitOut")
    frontage_width: Optional[str] = Field(None, alias="frontageWidth")
    ceiling_height: Optional[str] = Field(None, alias="ceilingHeight")
    power_load_capacity: Optional[str] = Field(None, alias="powerLoadCapacity")
    appliances_included: Optional[List[str]] = Field(None, alias="appliancesIncluded")

    # Additional
    nearby_connectivity: Optional[str] = Field(None, alias="nearbyConnectivity")
    rental_term: Optional[str] = Field(None, alias="rentalTerm")

    # Hostel specific
    hostel_type: Optional[str] = Field(None, alias="hostelType")
    room_type: Optional[List[str]] = Field(None, alias="roomType")
    sharing_type: Optional[List[str]] = Field(None, alias="sharingType")
    total_capacity: Optional[int] = Field(None, alias="totalCapacity")
    hostel_category: Optional[str] = Field(None, alias="hostelCategory")
    gender_type: Optional[str] = Field(None, alias="genderType")

    # Land specific
    land_sub_category: Optional[str] = Field(None, alias="landSubCategory")
    total_sqft: Optional[float] = Field(None, alias="totalSqft")
    land_area: Optional[float] = Field(None, alias="landArea")
    land_area_min: Optional[float] = Field(None, alias="landAreaMin")
    land_area_max: Optional[float] = Field(None, alias="landAreaMax")
    area_unit: Optional[str] = Field(None, alias="areaUnit")
    land_shape: Optional[str] = Field(None, alias="landShape")
    road_width: Optional[int] = Field(None, alias="roadWidth")
    water_source: Optional[str] = Field(None, alias="waterSource")
    soil_type: Optional[str] = Field(None, alias="soilType")
    electricity_available: Optional[str] = Field(None, alias="electricityAvailable")
    selected_features: Optional[List[str]] = Field(None, alias="selectedFeatures")

    # Payment / stay details
    payment_mode: Optional[str] = Field(None, alias="paymentMode")
    alcohol_allowed: Optional[str] = Field(None, alias="alcoholAllowed")
    minimum_stay_duration: Optional[str] = Field(None, alias="minimumStayDuration")
    construction_status: Optional[str] = Field(None, alias="constructionStatus")
    possession_timeline: Optional[str] = Field(None, alias="possessionTimeline")
    ready_to_buy: Optional[str] = Field(None, alias="readyToBuy")
    payment_frequency: Optional[str] = Field(None, alias="paymentFrequency")
    food_included: Optional[str] = Field(None, alias="foodIncluded")
    food_type: Optional[str] = Field(None, alias="foodType")
    meals_per_day: Optional[str] = Field(None, alias="mealsPerDay")
    kitchen_access: Optional[str] = Field(None, alias="kitchenAccess")
    bathroom_type: Optional[str] = Field(None, alias="bathroomType")
    utilities_included: Optional[str] = Field(None, alias="utilitiesIncluded")
    rental_frequency: Optional[str] = Field(None, alias="rentalFrequency")

    # Status / timestamps
    status: Optional[str] = "Active"
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")

    # Media / documents
    cover_image: Optional[str] = Field(None, alias="coverImage")
    images: Optional[List[VendorGalleryImage]] = None
    documents: Optional[List[PropertyDocumentResponse]] = None

    # Per-property contact person
    contact_person_details: Optional[ContactPersonDetails] = Field(None, alias="contactPersonDetails")


class VendorPropertyListResponse(BaseModel):
    data: List[VendorPropertyCard]
    pagination: Dict[str, Any]
