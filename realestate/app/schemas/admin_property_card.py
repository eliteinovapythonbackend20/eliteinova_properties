"""Response payloads for the admin dashboard's property-moderation surface
(AdminDashboardService._to_card / get_property_stats /
AdminDashboardRepository.get_property_stats in
app/services/admin_dashboard_service.py and
app/repositories/admin_dashboard_repository.py).
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class AdminPropertyCard(BaseModel):
    """Mirrors AdminDashboardService._to_card field-for-field."""

    model_config = ConfigDict(populate_by_name=True)

    id: str
    user_id: Optional[str] = Field(None, alias="userId")
    vendor_email: Optional[str] = Field(None, alias="vendorEmail")
    posted_by: Optional[str] = Field(None, alias="postedBy")
    posted_by_name: Optional[str] = Field(None, alias="postedByName")
    property_category: Optional[str] = Field(None, alias="propertyCategory")
    listing_purpose: Optional[str] = Field(None, alias="listingPurpose")
    property_type: Optional[str] = Field(None, alias="propertyType")
    sub_category: Optional[str] = Field(None, alias="subCategory")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    status: Optional[str] = None
    featured: Optional[bool] = None
    verification_status: Optional[str] = Field(None, alias="verificationStatus")
    address: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    area: Optional[str] = None
    pin_code: Optional[str] = Field(None, alias="pinCode")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    expected_price: Optional[float] = Field(None, alias="expectedPrice")
    price_min: Optional[float] = Field(None, alias="priceMin")
    price_max: Optional[float] = Field(None, alias="priceMax")
    description: Optional[str] = None
    cover_image: Optional[str] = Field(None, alias="coverImage")
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")


class AdminPropertyListPagination(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    total: int
    page: int
    limit: int
    total_pages: int = Field(alias="totalPages")


class AdminPropertyListResponse(BaseModel):
    success: bool = True
    data: List[AdminPropertyCard]
    pagination: AdminPropertyListPagination


class LocalityCount(BaseModel):
    area: Optional[str] = None
    city: Optional[str] = None
    count: int


class AdminPropertyStats(BaseModel):
    """Mirrors AdminDashboardRepository.get_property_stats - the by*/top*
    breakdown keys are only present once the caller has narrowed the query
    enough for them to mean something (see that method's own comments), so
    every one of them is genuinely optional here, not just defensively so."""

    model_config = ConfigDict(populate_by_name=True)

    total: int
    active: int
    inactive: int
    pending: int
    sold: int
    rented: int
    expired: int
    rejected: int
    featured: int
    verified: int
    by_type: Optional[Dict[str, int]] = Field(None, alias="byType")
    by_sub_category: Optional[Dict[str, int]] = Field(None, alias="bySubCategory")
    by_listing_purpose: Optional[Dict[str, int]] = Field(None, alias="byListingPurpose")
    by_category: Optional[Dict[str, int]] = Field(None, alias="byCategory")
    top_localities: Optional[List[LocalityCount]] = Field(None, alias="topLocalities")


class AdminPropertyStatsResponse(BaseModel):
    success: bool = True
    data: AdminPropertyStats


class AdminPropertyStatusResult(BaseModel):
    id: str
    status: str


class AdminPropertyDeleteResult(BaseModel):
    deleted: bool = True
    id: str
