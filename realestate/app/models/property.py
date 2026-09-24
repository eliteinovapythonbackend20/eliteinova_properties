from sqlalchemy import Column, Date, ForeignKey, Index, Integer, String, Text, Enum, DateTime, Float, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.user import User
from app.schemas.property_enums import ListingPurpose, PropertyCategory, PostedBy, PropertyStatus, VerificationStatus



class BaseProperty(Base):
    __tablename__ = "properties"

    __table_args__ = (
        # Primary search indexes
        Index('idx_properties_property_type', 'property_type'),
        Index('idx_properties_property_category', 'property_category'),
        Index('idx_properties_city', 'city'),
        
        # Composite indexes for common filter combinations
        Index('idx_properties_type_purpose', 'property_type', 'listing_purpose'),
        Index('idx_properties_category_sub', 'property_category', 'sub_category'),
        Index('idx_properties_purpose_city', 'listing_purpose', 'city'),
        
        # Filter-specific indexes
        Index('idx_properties_bedrooms', 'bedrooms'),
        Index('idx_properties_bathrooms', 'bathrooms'),
        Index('idx_properties_furnishing_status', 'furnishing_status'),
    )
    
    id = Column(String(20), primary_key=True, index=True)

    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    posted_by = Column(String(50), default=PostedBy.OWNER.value, nullable=False) # Owner, Agent, Builder, Property Management
    listing_purpose = Column(String(50), default =ListingPurpose.SELL.value ,nullable=False) # rent, sell, lease
    property_category = Column(String(50), default=PropertyCategory.INDIVIDUAL.value, nullable=False) # Individual, Apartment, Commercial, Land & Plot , Hostel
    
    # Basic Property Info
    property_type = Column(String(100), nullable=True) # Gated Apartment, Independent Villa,
    property_title = Column(String(255), nullable=True) # Property Name Customized 

    property_discription = Column(Text,nullable=True)
    
    # Property Details
    bedrooms = Column(Integer, nullable=True) # 2 BHK, 3 BHK
    bathrooms = Column(Integer, nullable=True) # 2, 3, 4 
    floor_number = Column(Integer, nullable=True) # 2, 3, 4
    total_floors = Column(Integer, nullable=True) # 2, 3, 4
    property_age = Column(Integer, nullable=True) # 2, 3, 4+
    property_age_range = Column(String(50), nullable=True)  # "New Construction", "1-3 Years", "10+ Years" ...
    corner_unit = Column(String(5), nullable=True)  # Yes/No
    facing_direction = Column(String(20), nullable=True) # East, West
    
    # Area Details
    built_up_area = Column(Integer, nullable=True) # 2034, 3065
    carpet_area = Column(Integer, nullable=True) # with in built up area
    garden_space = Column(String(5), nullable=True)  # Yes/No
    
    # Location
    address = Column(Text, nullable=True)
    area = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pin_code = Column(String(15), nullable=True)
    landmark = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Furnishing & Features
    furnishing_status = Column(String(20), nullable=True) # fully furnished, semi furnished, no furnished
    terrace = Column(String(5), nullable=True)  # Yes/No - Combined Terrace/Balcony
    balcony = Column(String(5), nullable=True)

    sub_category = Column(String(100), nullable=True) # specific for land & plot 
    # Interior Features (JSONB array)
    interior_features = Column(JSONB, default=[]) # Modular Kitchen, Wardrope
    
    # Parking
    parking = Column(String(5), nullable=True)  # Yes/No
    parking_capacity = Column(Integer, nullable=True) # 2
    
    # Amenities (JSONB array)
    amenities = Column(JSONB, default=[]) #CCTV, WIFI
    

    nearby_places = Column(JSONB, default=[]) # Hospital, Police Station, Fire Station
    
    # Tenant Preferences
    tenant_type = Column(JSONB, default=[]) # Family, Bachelor
    smoking_allowed = Column(String(5), nullable=True)  # Yes/No
    dietary_preference = Column(String(50), nullable=True) # Veg, No Restirction
    pet_friendly = Column(String(5), nullable=True)  # Yes/No
    
    # Availability
    available_from = Column(Date, nullable=True) # Date
    immediate_move_in = Column(String(5), nullable=True)  # Yes/No
    minimum_duration = Column(String(50), nullable=True) # 3 Month
    
    # Pricing
    expected_price = Column(Float, nullable=True)
    price_min = Column(Float, nullable=True)
    price_max = Column(Float, nullable=True)
    price_negotiable = Column(String(20), nullable=True)  # Fixed Price , Negotiable
    security_deposit = Column(Float, nullable=True) #Advance
    maintenance_included = Column(String(5), nullable=True)  # Yes/No
    maintenance_amount = Column(Float, nullable=True)


    ownership_type = Column(String(100),nullable=True) # Freehold, Leasehold
    loan_outstanding = Column(String(5),nullable=True)
    property_condition = Column(String(50),nullable=True) # Renovated, New, etc.

    property_status = Column(String(100),default=PropertyStatus.ACTIVE.value)

    


    #sell specific 
    property_tax = Column(String(20),nullable=True)
    title_deed_verify = Column(String(5),nullable=True)
    underconstruction = Column(String(5),nullable=True)
    immediate_possession = Column(String(5),nullable=True)
    rera_approved = Column(String(5),nullable=True)
    loan_eligible = Column(String(5), nullable=True)

    #lease specific
    # Yes/No on some forms, but others offer named options ("Automatic", "Fixed Term", ...) -
    # sized for the longest option in use, not just Yes/No.
    renewable_option = Column(String(20),nullable=True)



    commercial_type = Column(String(255),nullable=True) # Office, Retail, Industrial, Warehouse, Co-working Space, Showroom, Restaurant, Hotel, Other
    business_type = Column(String(255),nullable=True) # Retail, Office, Industrial, Warehouse, Co-working Space, Showroom, Restaurant, Hotel, Other
    estimated_footfall = Column(String(255),nullable=True) # Low, Medium, High
    operating_hours = Column(String(255),nullable=True) # 9 AM - 5 PM, 24/7, Custom
    zoning_type = Column(String(255),nullable=True) # Commercial, Mixed-Use, Industrial, Residential, Agricultural, Other
    lease_type = Column(String(255),nullable=True)
    lease_terms = Column(String(255),nullable=True)
    fit_out = Column(String(255),nullable=True)

    frontage_width = Column(String(255),nullable=True)
    ceiling_height = Column(String(255),nullable=True)
    power_load_capacity = Column(String(255),nullable=True)


    appliance_included = Column(JSONB, default=[])


    nearby_connectivity = Column(String, nullable=True)
    rental_term = Column(String,nullable=True)
    hostel_type = Column(String, nullable=True)
    room_type = Column(JSONB, default=[],nullable=True)
    sharing_type = Column(JSONB, default=[], nullable=True)
    total_capacity = Column(Integer, nullable=True)
    hostel_category = Column(String, nullable=True)
    gender_type = Column(String, nullable=True)
    land_area  = Column(Integer, nullable=True)
    land_area_min = Column(Integer, nullable=True)
    land_area_max = Column(Integer, nullable=True)
    area_unit = Column(String(20),nullable=True)

    land_shape = Column(String(100), nullable=True)
    road_width = Column(Integer, nullable=True)
    water_source = Column(String(200), nullable=True)
    soil_type = Column(String(200), nullable=True)
    electricity_available = Column(String(20), nullable=True)
    selected_feature = Column(JSONB, default=[])
    payment_mode = Column(String(30), nullable=True)
    alcohol_allowed = Column(String(20), nullable=True)

    minimum_stay_duration = Column(String(100), nullable=True)
    construction_status = Column(String(100), nullable=True)
    possession_timeline = Column(String, nullable=True)
    ready_to_buy = Column(String(20), nullable=True)

    payment_frequency = Column(String(100), nullable=True)
    food_included = Column(String(50), nullable=True)
    food_type = Column(String(50), nullable=True)
    meals_per_day  = Column(String(100), nullable=True)
    kitchen_access = Column(String(50), nullable=True)
    bathroom_type = Column(String(100), nullable=True)
    utilities_included = Column(String(20), nullable=True)

    rental_frequency = Column(String(150), nullable=True)

    status = Column(String(20), nullable=False, server_default="Active", default="Active")  # public visibility: Active / Inactive
    featured = Column(Boolean, nullable=False, server_default="false", default=False)  # admin-curated highlight flag
    verification_status = Column(String(20), nullable=False, server_default=VerificationStatus.NOT_VERIFIED.value, default=VerificationStatus.NOT_VERIFIED.value)  # admin KYC/listing review

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="properties")
    media = relationship("PropertyMedia", back_populates="property", cascade="all, delete-orphan")
    documents = relationship("PropertyDocument", back_populates="property", cascade="all, delete-orphan")
    owner_details = relationship("OwnerProperty", back_populates="property", uselist=False)
    agent_details = relationship("PropertyAgentDetails", back_populates="property", uselist=False)
    builder_details = relationship("PropertyBuilderDetails", back_populates="property", uselist=False)
    property_management_details = relationship("PropertyManagementProperty", back_populates="property", uselist=False)

