from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class PropertyMediaResponse(BaseModel):
    # PropertyService._format_card_media builds these dicts in camelCase
    # (fileUrl/mediaType/isPrimary) - populate_by_name+alias lets this model
    # accept that shape directly instead of requiring snake_case keys.
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    media_type: str = Field(alias="mediaType")
    file_url: str = Field(alias="fileUrl")
    thumbnail_url: Optional[str] = Field(None, alias="thumbnailUrl")
    is_primary: bool = Field(False, alias="isPrimary")
    order: int = 0

class PropertyDocumentResponse(BaseModel):
    # PropertyFormatter.format_documents builds these dicts in camelCase and
    # deliberately omits fileUrl - documents live in the private GCS bucket
    # and never get a permanent URL in a response body (see
    # GET /properties/documents/{id}/view-url for on-demand access).
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    document_type: str = Field(alias="documentType")
    file_name: str = Field(alias="fileName")
    file_url: Optional[str] = Field(None, alias="fileUrl")
    mime_type: Optional[str] = None
    file_size_kb: Optional[int] = Field(None, alias="fileSizeKb")

class PostedByBlock(BaseModel):
    # PropertyService._public_vendor_block's exact shape - listed-by info safe
    # for anonymous card/detail responses. NO contact details (email/phone/
    # address/bank/KYC) - those are served through the authenticated leads
    # flow, never here.
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    role: Optional[str] = None
    display_name: Optional[str] = Field(None, alias="displayName")
    organisation_name: Optional[str] = Field(None, alias="organisationName")
    profile_photo_url: Optional[str] = Field(None, alias="profilePhotoUrl")

class PropertyResponse(BaseModel):
    """Mirrors PropertyService._to_card/_to_response field-for-field. Every
    key listed there must have a matching field here - response_model
    silently drops any key the service returns that isn't declared on this
    model, so a mismatch here is not a typing nicety, it's data loss on the
    wire (confirmed: postedBy/propertyDescription/priceMin/priceMax/every
    commercial-specific field were all being silently stripped before this
    was written)."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    # Core
    id: str
    posted_as: Optional[str] = Field(None, alias="postedAs")
    posted_by: Optional[PostedByBlock] = Field(None, alias="postedBy")
    property_category: Optional[str] = Field(None, alias="propertyCategory")
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    property_type: Optional[str] = Field(None, alias="propertyType")
    sub_category: Optional[str] = Field(None, alias="subCategory")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    property_description: Optional[str] = Field(None, alias="propertyDescription")
    status: Optional[str] = "Active"

    # Location
    property_address: Optional[str] = Field(None, alias="propertyAddress")
    area: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    landmark: Optional[str] = None
    nearby_connectivity: Optional[str] = Field(None, alias="nearbyConnectivity")

    # Pricing
    expected_price: Optional[float] = Field(None, alias="expectedPrice")
    price_min: Optional[float] = Field(None, alias="priceMin")
    price_max: Optional[float] = Field(None, alias="priceMax")
    price_type: Optional[str] = Field(None, alias="priceType")
    is_negotiable: Optional[str] = Field(None, alias="isNegotiable")
    security_deposit: Optional[float] = Field(None, alias="securityDeposit")
    security_deposit_min: Optional[float] = Field(None, alias="securityDepositMin")
    security_deposit_max: Optional[float] = Field(None, alias="securityDepositMax")
    maintenance: Optional[float] = None
    maintenance_included: Optional[str] = Field(None, alias="maintenanceIncluded")

    # Specs
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floor_number: Optional[int] = Field(None, alias="floorNumber")
    total_floors: Optional[int] = Field(None, alias="totalFloors")
    facing: Optional[str] = None
    property_age: Optional[int] = Field(None, alias="propertyAge")
    property_age_range: Optional[str] = Field(None, alias="propertyAgeRange")
    property_condition: Optional[str] = Field(None, alias="propertyCondition")
    corner_unit: Optional[str] = Field(None, alias="cornerUnit")
    built_up_area: Optional[float] = Field(None, alias="builtUpArea")
    carpet_area: Optional[float] = Field(None, alias="carpetArea")
    furnishing_status: Optional[str] = Field(None, alias="furnishingStatus")
    parking: Optional[str] = None
    parking_spaces: Optional[int] = Field(None, alias="parkingSpaces")
    has_garden: Optional[str] = Field(None, alias="hasGarden")
    has_terrace: Optional[str] = Field(None, alias="hasTerrace")
    has_balcony: Optional[str] = Field(None, alias="hasBalcony")

    # Arrays
    amenities: Optional[List[str]] = None
    interior_features: Optional[List[str]] = Field(None, alias="interiorFeatures")
    appliance_included: Optional[List[str]] = Field(None, alias="applianceIncluded")
    nearby_places: Optional[List[str]] = Field(None, alias="nearbyPlaces")
    selected_feature: Optional[List[str]] = Field(None, alias="selectedFeature")

    # Tenancy / rent
    tenant_type: Optional[List[str]] = Field(None, alias="tenantType")
    occupancy_type: Optional[str] = Field(None, alias="occupancyType")
    pet_friendly: Optional[str] = Field(None, alias="petFriendly")
    smoking_allowed: Optional[str] = Field(None, alias="smokingAllowed")
    dietary_preference: Optional[str] = Field(None, alias="dietaryPreference")
    available_from: Optional[str] = Field(None, alias="availableFrom")
    immediate_move_in: Optional[str] = Field(None, alias="immediateMoveIn")
    rental_duration: Optional[str] = Field(None, alias="rentalDuration")
    rental_term: Optional[str] = Field(None, alias="rentalTerm")
    rental_frequency: Optional[str] = Field(None, alias="rentalFrequency")
    minimum_stay_duration: Optional[str] = Field(None, alias="minimumStayDuration")

    # Sell / lease
    ownership_type: Optional[str] = Field(None, alias="ownershipType")
    loan_outstanding: Optional[str] = Field(None, alias="loanOutstanding")
    loan_eligible: Optional[str] = Field(None, alias="loanEligible")
    home_loan_required: Optional[str] = Field(None, alias="homeLoanRequired")
    rera_approved: Optional[str] = Field(None, alias="reraApproved")
    title_deed_verify: Optional[str] = Field(None, alias="titleDeedVerify")
    property_tax: Optional[str] = Field(None, alias="propertyTax")
    renewable_option: Optional[str] = Field(None, alias="renewableOption")
    construction_status: Optional[str] = Field(None, alias="constructionStatus")
    possession_timeline: Optional[str] = Field(None, alias="possessionTimeline")
    ready_to_buy: Optional[str] = Field(None, alias="readyToBuy")
    under_construction: Optional[str] = Field(None, alias="underConstruction")
    immediate_possession: Optional[str] = Field(None, alias="immediatePossession")

    # Commercial
    commercial_type: Optional[str] = Field(None, alias="commercialType")
    business_type: Optional[str] = Field(None, alias="businessType")
    estimated_footfall: Optional[str] = Field(None, alias="estimatedFootfall")
    operating_hours: Optional[str] = Field(None, alias="operatingHours")
    zoning_type: Optional[str] = Field(None, alias="zoningType")
    lease_type: Optional[str] = Field(None, alias="leaseType")
    lease_terms: Optional[str] = Field(None, alias="leaseTerms")
    fit_out: Optional[str] = Field(None, alias="fitOut")
    frontage_width: Optional[str] = Field(None, alias="frontageWidth")
    ceiling_height: Optional[str] = Field(None, alias="ceilingHeight")
    power_load_capacity: Optional[str] = Field(None, alias="powerLoadCapacity")

    # Status
    created_at: Optional[datetime] = Field(None, alias="createdAt")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")

    # Media / documents
    images: Optional[List[PropertyMediaResponse]] = None
    documents: Optional[List[PropertyDocumentResponse]] = None

    # Land/Plot
    land_area: Optional[float] = Field(None, alias="landArea")
    land_area_min: Optional[float] = Field(None, alias="landAreaMin")
    land_area_max: Optional[float] = Field(None, alias="landAreaMax")
    area_unit: Optional[str] = Field(None, alias="areaUnit")
    land_shape: Optional[str] = Field(None, alias="landShape")
    road_width: Optional[int] = Field(None, alias="roadWidth")
    water_source: Optional[str] = Field(None, alias="waterSource")
    soil_type: Optional[str] = Field(None, alias="soilType")
    electricity_available: Optional[str] = Field(None, alias="electricityAvailable")

    # Hostel
    hostel_type: Optional[str] = Field(None, alias="hostelType")
    room_type: Optional[List[str]] = Field(None, alias="roomType")
    sharing_type: Optional[List[str]] = Field(None, alias="sharingType")
    total_capacity: Optional[int] = Field(None, alias="totalCapacity")
    hostel_category: Optional[str] = Field(None, alias="hostelCategory")
    gender_type: Optional[str] = Field(None, alias="genderType")
    food_included: Optional[str] = Field(None, alias="foodIncluded")
    food_type: Optional[str] = Field(None, alias="foodType")
    meals_per_day: Optional[str] = Field(None, alias="mealsPerDay")
    kitchen_access: Optional[str] = Field(None, alias="kitchenAccess")
    bathroom_type: Optional[str] = Field(None, alias="bathroomType")
    utilities_included: Optional[str] = Field(None, alias="utilitiesIncluded")
    alcohol_allowed: Optional[str] = Field(None, alias="alcoholAllowed")
    payment_frequency: Optional[str] = Field(None, alias="paymentFrequency")
    payment_mode: Optional[str] = Field(None, alias="paymentMode")

class PropertyListResponse(BaseModel):
    data: List[PropertyResponse]
    pagination: Dict[str, Any]
