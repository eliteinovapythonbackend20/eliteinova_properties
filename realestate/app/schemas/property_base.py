from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal

from app.schemas.property_enums import (
    ListingPurpose, PropertyCategory, PostedBy, 
    PropertyStatus, PropertyCondition, OwnershipType,
    FurnishingStatus, PriceNegotiable
)

class PropertyBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    # Core Fields
    property_category: PropertyCategory = Field(..., alias="propertyCategory")
    listing_purpose: ListingPurpose = Field(..., alias="listingPurpose")
    posted_by: PostedBy = Field(..., alias="postedBy")
    property_type: Optional[str] = Field(None, alias="propertyType")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    property_discription: Optional[str] = Field(None, alias="propertyDescription")
    
    # Property Details
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floor_number: Optional[int] = Field(None, alias="floorNumber")
    total_floors: Optional[int] = Field(None, alias="totalFloors")
    property_age: Optional[int] = Field(None, alias="propertyAge")
    corner_unit: Optional[str] = Field(None, alias="cornerUnit")
    facing_direction: Optional[str] = Field(None, alias="facingDirection")
    
    # Area Details
    built_up_area: Optional[Decimal] = Field(None, alias="builtUpArea")
    carpet_area: Optional[Decimal] = Field(None, alias="carpetArea")
    garden_space: Optional[str] = Field(None, alias="gardenSpace")
    
    # Location
    address: Optional[str] = Field(None, alias="propertyAddress")
    area: Optional[str] = None
    city: Optional[str] = Field(None, alias="propertyCity")
    district: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = Field(None, alias="pinCode")
    landmark: Optional[str] = None
    
    # Furnishing & Features
    furnishing_status: Optional[FurnishingStatus] = Field(None, alias="furnishingStatus")
    terrace: Optional[str] = None
    balcony: Optional[str] = None
    sub_category: Optional[str] = Field(None, alias="subCategory")
    interior_features: Optional[List[str]] = Field(default=[], alias="interiorFeatures")
    
    # Parking
    parking: Optional[str] = None
    parking_capacity: Optional[int] = Field(None, alias="parkingCapacity")
    
    # Amenities
    amenities: Optional[List[str]] = Field(default=[], alias="selectedAmenities")
    nearby_places: Optional[List[str]] = Field(default=[], alias="nearbyPlaces")
    nearby_connectivity: Optional[str] = Field(None, alias="nearbyConnectivity")
    
    # Tenant Preferences
    tenant_type: Optional[List[str]] = Field(default=[], alias="tenantType")
    smoking_allowed: Optional[str] = Field(None, alias="smokingAllowed")
    dietary_preference: Optional[str] = Field(None, alias="dietaryPreference")
    pet_friendly: Optional[str] = Field(None, alias="petFriendly")
    
    # Availability
    available_from: Optional[date] = Field(None, alias="availableFrom")
    immediate_move_in: Optional[str] = Field(None, alias="immediateMoveIn")
    minimum_duration: Optional[str] = Field(None, alias="minimumDuration")
    
    # Pricing
    expected_price: Optional[Decimal] = Field(None, alias="expectedPrice")
    price_min: Optional[Decimal] = Field(None, alias="priceMin")
    price_max: Optional[Decimal] = Field(None, alias="priceMax")
    price_negotiable: Optional[PriceNegotiable] = Field(None, alias="priceType")
    security_deposit: Optional[Decimal] = Field(None, alias="securityDeposit")
    maintenance_included: Optional[str] = Field(None, alias="maintenanceIncluded")
    maintenance_amount: Optional[Decimal] = Field(None, alias="maintenance")
    
    # Additional
    ownership_type: Optional[OwnershipType] = Field(None, alias="ownershipType")
    loan_outstanding: Optional[str] = Field(None, alias="loanOutstanding")
    property_condition: Optional[PropertyCondition] = Field(None, alias="propertyCondition")
    
    # Sell Specific
    property_tax: Optional[str] = Field(None, alias="propertyTax")
    title_deed_verify: Optional[str] = Field(None, alias="titleDeedVerify")
    underconstruction: Optional[str] = None
    immediate_possession: Optional[str] = Field(None, alias="immediatePossession")
    rera_approved: Optional[str] = Field(None, alias="reraApproved")
    loan_eligible: Optional[str] = Field(None, alias="loanEligible")
    
    # Commercial
    commercial_type: Optional[str] = Field(None, alias="commercialType")
    business_type: Optional[str] = Field(None, alias="businessType")
    estimated_footfall: Optional[str] = Field(None, alias="estimatedFootfall")
    operating_hours: Optional[str] = Field(None, alias="operatingHours")
    zoning_type: Optional[str] = Field(None, alias="zoningType")
    lease_type: Optional[str] = Field(None, alias="leaseType")
    lease_terms: Optional[str] = Field(None, alias="leaseTerm")
    fit_out: Optional[str] = Field(None, alias="fitOut")
    ceiling_height: Optional[str] = Field(None, alias="ceilingHeight")
    frontage_width: Optional[str] = Field(None, alias="frontageWidth")
    power_load_capacity: Optional[str] = Field(None, alias="powerLoadCapacity")
    
    # Lease
    renewable_option: Optional[str] = Field(None, alias="renewableOption")
    
    # Hostel/PG
    hostel_type: Optional[str] = Field(None, alias="hostelType")
    room_type: Optional[List[str]] = Field(default=[], alias="roomType")
    sharing_type: Optional[List[str]] = Field(default=[], alias="sharingType")
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
    minimum_stay_duration: Optional[str] = Field(None, alias="minimumStayDuration")
    payment_frequency: Optional[str] = Field(None, alias="paymentFrequency")
    
    # Land
    land_area: Optional[Decimal] = Field(None, alias="landArea")
    land_area_min: Optional[Decimal] = Field(None, alias="landAreaMin")
    land_area_max: Optional[Decimal] = Field(None, alias="landAreaMax")
    area_unit: Optional[str] = Field(None, alias="areaUnit")
    land_shape: Optional[str] = Field(None, alias="landShape")
    road_width: Optional[int] = Field(None, alias="roadWidth")
    water_source: Optional[str] = Field(None, alias="waterSource")
    soil_type: Optional[str] = Field(None, alias="soilType")
    electricity_available: Optional[str] = Field(None, alias="electricityAvailable")
    selected_feature: Optional[List[str]] = Field(default=[], alias="selectedFeature")
    payment_mode: Optional[str] = Field(None, alias="paymentMode")
    construction_status: Optional[str] = Field(None, alias="constructionStatus")
    possession_timeline: Optional[str] = Field(None, alias="possessionTimeline")
    ready_to_buy: Optional[str] = Field(None, alias="readyToBuy")
    
    # Rental
    rental_term: Optional[str] = Field(None, alias="rentalTerm")
    rental_frequency: Optional[str] = Field(None, alias="rentalFrequency")
    appliance_included: Optional[List[str]] = Field(default=[], alias="applianceIncluded")
    
    # Status
    status: Optional[PropertyStatus] = Field(default=PropertyStatus.ACTIVE)
    
    @field_validator('available_from', mode='before')
    @classmethod
    def validate_available_from(cls, v):
        if isinstance(v, str):
            try:
                return datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                try:
                    return datetime.strptime(v, '%m/%d/%Y').date()
                except ValueError:
                    raise ValueError(f"Invalid date format: {v}. Expected YYYY-MM-DD")
        return v
    
    @field_validator('expected_price', 'price_min', 'price_max', mode='before')
    @classmethod
    def validate_decimal_fields(cls, v):
        if v is not None:
            return Decimal(str(v))
        return v