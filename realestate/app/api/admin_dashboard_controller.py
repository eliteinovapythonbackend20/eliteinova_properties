from datetime import date
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status
from pydantic import ValidationError

from app.api.dependencies import require_admin, get_admin_dashboard_service
from app.core.response_utils import strip_none_values
from app.schemas.admin_dashboard_schemas import AdminPropertyListParams, AdminPropertyStatusUpdate, AdminPropertyUpdate
from app.services.admin_dashboard_service import AdminDashboardService

router = APIRouter()


@router.get("/properties")
async def admin_list_properties(
    page: int = 1,
    limit: int = 20,
    posted_by: Optional[str] = Query(None, description="OWNER, AGENT, BUILDER, or PROPERTY_MANAGEMENT"),
    property_category: Optional[str] = Query(None, description="INDIVIDUAL, APARTMENT, COMMERCIAL, LAND_PLOT, or HOSTEL"),
    property_type: Optional[str] = Query(None, description="Exact property_type value, e.g. 'Condominium Apartment' - powers the per-subtype list pages"),
    sub_category: Optional[str] = Query(None, description="Exact sub_category value, e.g. 'Residential Land / Plots' - powers the Land & Plots per-subtype list pages"),
    status: Optional[str] = Query(None, description="Active, Inactive, Pending, Sold, Rented, Expired, or Rejected"),
    listing_purpose: Optional[str] = Query(None, description="SELL, RENT, or LEASE"),
    featured: Optional[bool] = None,
    verification_status: Optional[str] = Query(None, description="Verified, Pending, Rejected, or Not Verified"),
    search: Optional[str] = None,
    created_from: Optional[date] = Query(None, description="Only properties created on/after this calendar date - powers PropertiesOverview's period selector"),
    created_to: Optional[date] = Query(None, description="Only properties created on/before this calendar date - powers PropertiesOverview's period selector"),
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminDashboardService = Depends(get_admin_dashboard_service),
):
    try:
        params = AdminPropertyListParams(
            page=page, limit=limit, posted_by=posted_by, property_category=property_category,
            property_type=property_type, sub_category=sub_category, status=status, listing_purpose=listing_purpose,
            featured=featured, verification_status=verification_status, search=search,
            created_from=created_from, created_to=created_to,
        )
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    result = await service.list_properties(
        page=params.page,
        limit=params.limit,
        posted_by=params.posted_by.upper() if params.posted_by else None,
        property_category=params.property_category.upper() if params.property_category else None,
        property_type=params.property_type,
        sub_category=params.sub_category,
        status=params.status,
        listing_purpose=params.listing_purpose,
        featured=params.featured,
        verification_status=params.verification_status,
        search=params.search,
        created_from=params.created_from,
        created_to=params.created_to,
    )
    return strip_none_values({"success": True, **result})


@router.get("/properties/stats")
async def admin_property_stats(
    posted_by: Optional[str] = Query(None, description="OWNER, AGENT, BUILDER, or PROPERTY_MANAGEMENT"),
    property_category: Optional[str] = Query(None, description="INDIVIDUAL, APARTMENT, COMMERCIAL, LAND_PLOT, or HOSTEL - when set, also returns a byType breakdown for that category's Overview page"),
    property_type: Optional[str] = Query(None, description="Exact property_type value - when set, also returns a byListingPurpose (Buy/Rent/Lease) breakdown for that subtype's list page"),
    sub_category: Optional[str] = Query(None, description="Exact sub_category value, e.g. 'Residential Land / Plots' - when set, scopes byType/byListingPurpose to that Land & Plots subtype; when property_category is set and this isn't, also returns a bySubCategory breakdown for the Land & Plots Overview page"),
    created_from: Optional[date] = Query(None, description="Only properties created on/after this calendar date - powers PropertiesOverview's period selector"),
    created_to: Optional[date] = Query(None, description="Only properties created on/before this calendar date - powers PropertiesOverview's period selector"),
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminDashboardService = Depends(get_admin_dashboard_service),
):
    stats = await service.get_property_stats(
        posted_by=posted_by.upper() if posted_by else None,
        property_category=property_category.upper() if property_category else None,
        property_type=property_type,
        sub_category=sub_category,
        created_from=created_from,
        created_to=created_to,
    )
    return strip_none_values({"success": True, "data": stats})


@router.patch("/properties/{property_id}/status")
async def admin_update_property_status(
    property_id: str,
    body: AdminPropertyStatusUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminDashboardService = Depends(get_admin_dashboard_service),
):
    data = await service.update_property_status(property_id, body.status)
    return strip_none_values({"success": True, "data": data, "message": "Status updated successfully"})


@router.patch("/properties/{property_id}")
async def admin_update_property(
    property_id: str,
    body: AdminPropertyUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminDashboardService = Depends(get_admin_dashboard_service),
):
    fields = body.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    data = await service.update_property(property_id, fields)
    return strip_none_values({"success": True, "data": data, "message": "Property updated successfully"})


@router.delete("/properties/{property_id}")
async def admin_delete_property(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminDashboardService = Depends(get_admin_dashboard_service),
):
    data = await service.delete_property(property_id)
    return strip_none_values({"success": True, "data": data, "message": "Property deleted successfully"})
