from enum import Enum

class ListingPurpose(str, Enum):
    RENT = "RENT"
    SELL = "SELL"
    LEASE = "LEASE"

class PropertyCategory(str, Enum):
    INDIVIDUAL = "INDIVIDUAL"
    APARTMENT = "APARTMENT"
    COMMERCIAL = "COMMERCIAL"
    LAND_PLOT = "LAND_PLOT"
    HOSTEL = "HOSTEL"

class PostedBy(str, Enum):
    OWNER = "OWNER"
    AGENT = "AGENT"
    BUILDER = "BUILDER"
    PROPERTY_MANAGEMENT = "PROPERTY_MANAGEMENT"

class PropertyStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"

class PropertyCondition(str, Enum):
    NEW = "New"
    GOOD = "Good"
    RENOVATED = "Renovated"
    NEEDS_RENOVATION = "Needs Renovation"

class OwnershipType(str, Enum):
    FREEHOLD = "Freehold"
    LEASEHOLD = "Leasehold"

class FurnishingStatus(str, Enum):
    FULLY_FURNISHED = "Fully Furnished"
    SEMI_FURNISHED = "Semi Furnished"
    UNFURNISHED = "Unfurnished"

class PriceNegotiable(str, Enum):
    FIXED = "Fixed Price"
    NEGOTIABLE = "Negotiable"