from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.schemas.property_vendor_schemas import OwnerDetailsSchema, AgentDetailsSchema, BuilderDetailsSchema, PMDetailsSchema

class PropertyMediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    media_type: str
    file_url: str
    thumbnail_url: Optional[str] = None
    is_primary: bool = False
    order: int = 0

class PropertyDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    document_type: str
    file_name: str
    file_url: str
    mime_type: Optional[str] = None
    file_size_kb: Optional[int] = None

class PropertyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    # Core
    id: str
    posted_as: Optional[str] = Field(None, alias="postedAs")
    property_type: Optional[str] = Field(None, alias="propertyType")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    property_address: Optional[str] = Field(None, alias="propertyAddress")
    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    expected_price: Optional[float] = Field(None, alias="expectedPrice")
    price_type: Optional[str] = Field(None, alias="priceType")
    available_from: Optional[str] = Field(None, alias="availableFrom")
    
    # Specs
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    carpet_area: Optional[float] = Field(None, alias="carpetArea")
    built_up_area: Optional[float] = Field(None, alias="builtUpArea")
    furnishing_status: Optional[str] = Field(None, alias="furnishingStatus")
    parking: Optional[str] = None
    parking_spaces: Optional[int] = Field(None, alias="parkingSpaces")
    maintenance: Optional[float] = None
    
    # Amenities
    amenities: Optional[List[str]] = None
    
    # Contact
    user_name: Optional[str] = Field(None, alias="userName")
    email_id: Optional[str] = Field(None, alias="emailId")
    contact_number: Optional[str] = Field(None, alias="contactNumber")
    
    # Additional
    property_category: Optional[str] = Field(None, alias="propertyCategory")
    has_garden: Optional[str] = Field(None, alias="hasGarden")
    has_terrace: Optional[str] = Field(None, alias="hasTerrace")
    has_balcony: Optional[str] = Field(None, alias="hasBalcony")
    facing: Optional[str] = None
    floor_number: Optional[int] = Field(None, alias="floorNumber")
    total_floors: Optional[int] = Field(None, alias="totalFloors")
    
    # Buy Filters
    home_loan_required: Optional[str] = Field(None, alias="homeLoanRequired")
    
    # Rent Filters
    occupancy_type: Optional[str] = Field(None, alias="occupancyType")
    rental_duration: Optional[str] = Field(None, alias="rentalDuration")
    rental_term: Optional[str] = Field(None, alias="rentalTerm")
    rental_frequency: Optional[str] = Field(None, alias="rentalFrequency")
    pet_friendly: Optional[str] = Field(None, alias="petFriendly")
    security_deposit_min: Optional[float] = Field(None, alias="securityDepositMin")
    security_deposit_max: Optional[float] = Field(None, alias="securityDepositMax")
    
    # Sell Filters
    ownership_type: Optional[str] = Field(None, alias="ownershipType")
    property_age: Optional[int] = Field(None, alias="propertyAge")
    property_condition: Optional[str] = Field(None, alias="propertyCondition")
    is_negotiable: Optional[str] = Field(None, alias="isNegotiable")
    loan_outstanding: Optional[str] = Field(None, alias="loanOutstanding")
    renewable_option: Optional[str] = Field(None, alias="renewableOption")
    
    # Status
    status: Optional[str] = "Active"
    created_at: Optional[datetime] = Field(None, alias="createdAt")
    updated_at: Optional[datetime] = Field(None, alias="updatedAt")
    
    # Media
    images: Optional[List[PropertyMediaResponse]] = None
    documents: Optional[List[PropertyDocumentResponse]] = None
    
    # Type-Specific Details
    owner_details: Optional[OwnerDetailsSchema] = Field(None, alias="ownerDetails")
    agent_details: Optional[AgentDetailsSchema] = Field(None, alias="agentDetails")
    builder_details: Optional[BuilderDetailsSchema] = Field(None, alias="builderDetails")
    pm_details: Optional[PMDetailsSchema] = Field(None, alias="pmDetails")
    
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
    selected_feature: Optional[List[str]] = Field(None, alias="selectedFeature")
    payment_mode: Optional[str] = Field(None, alias="paymentMode")
    construction_status: Optional[str] = Field(None, alias="constructionStatus")
    possession_timeline: Optional[str] = Field(None, alias="possessionTimeline")
    ready_to_buy: Optional[str] = Field(None, alias="readyToBuy")
    
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
    minimum_stay_duration: Optional[str] = Field(None, alias="minimumStayDuration")
    payment_frequency: Optional[str] = Field(None, alias="paymentFrequency")

class PropertyListResponse(BaseModel):
    data: List[PropertyResponse]
    pagination: Dict[str, Any]