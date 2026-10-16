"""Response payloads for the admin dashboard's Purchase/Rental Requests
surface (AdminPropertyRequestService._to_card / _to_detail / get_stats in
app/services/admin_property_request_service.py).
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common_response import PaginationMeta
from app.schemas.vendor_property_card import VendorPropertyCard


class AdminPropertyRequestCard(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int
    user_id: Optional[str] = Field(None, alias="userId")
    customer_name: Optional[str] = Field(None, alias="customerName")
    customer_email: Optional[str] = Field(None, alias="customerEmail")
    customer_phone: Optional[str] = Field(None, alias="customerPhone")
    property_id: Optional[str] = Field(None, alias="propertyId")
    property_title: Optional[str] = Field(None, alias="propertyTitle")
    property_type: Optional[str] = Field(None, alias="propertyType")
    city: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    cover_image: Optional[str] = Field(None, alias="coverImage")
    request_type: Optional[str] = Field(None, alias="requestType")
    status: Optional[str] = None
    status_history: Optional[List[Dict[str, Any]]] = Field(None, alias="statusHistory")
    requested_amount: Optional[float] = Field(None, alias="requestedAmount")
    budget_min: Optional[float] = Field(None, alias="budgetMin")
    budget_max: Optional[float] = Field(None, alias="budgetMax")
    preferred_date: Optional[str] = Field(None, alias="preferredDate")
    timeline: Optional[str] = None
    occupant_type: Optional[str] = Field(None, alias="occupantType")
    occupants_count: Optional[int] = Field(None, alias="occupantsCount")
    employment_type: Optional[str] = Field(None, alias="employmentType")
    company_name: Optional[str] = Field(None, alias="companyName")
    monthly_income: Optional[float] = Field(None, alias="monthlyIncome")
    financing_required: Optional[str] = Field(None, alias="financingRequired")
    site_visit_requested: Optional[bool] = Field(None, alias="siteVisitRequested")
    site_visit_date: Optional[str] = Field(None, alias="siteVisitDate")
    is_urgent: Optional[bool] = Field(None, alias="isUrgent")
    notes: Optional[str] = None
    created_at: Optional[str] = Field(None, alias="createdAt")
    updated_at: Optional[str] = Field(None, alias="updatedAt")


class AdminPropertyRequestDetail(AdminPropertyRequestCard):
    """_to_card plus the full formatted property - only the single-request
    GET (Details screen) returns this; the list (Management screen) stays
    on the lighter AdminPropertyRequestCard."""

    property: Optional[VendorPropertyCard] = None


class AdminPropertyRequestListResponse(BaseModel):
    data: List[AdminPropertyRequestCard]
    pagination: PaginationMeta


class AdminPropertyRequestStats(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    total: int
    urgent: int
    site_visit_requested: int = Field(alias="siteVisitRequested")
    status_counts: Dict[str, int] = Field(alias="statusCounts")
