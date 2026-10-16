"""Routes for the admin dashboard's Purchase Requests / Rental Requests
surface - backs the previously-mock PurchaseRequestsOverview/Management/
Details/Status and RentalRequestsOverview/Management/Details/Status
components (src/components/dashboard/buyer&tenants/{Purchase,Rental}Requests/).

Every route is gated by require_admin, matching admin_customer_controller's
and admin_dashboard_controller's convention. `requestType` (purchase|rental)
is a query filter on the shared list/stats routes rather than two separate
routers, since both admin modules read from the one property_requests table
(see app.models.property_request's docstring) - the frontend's two separate
screens simply always pass their own fixed requestType.
"""

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi import status as http_status
from pydantic import ValidationError

from app.api.dependencies import require_admin, get_admin_property_request_service
from app.schemas.admin_property_request_card import (
    AdminPropertyRequestCard,
    AdminPropertyRequestDetail,
    AdminPropertyRequestListResponse,
    AdminPropertyRequestStats,
)
from app.schemas.admin_property_request_schemas import (
    AdminPropertyRequestListParams,
    AdminPropertyRequestStatusUpdate,
)
from app.schemas.common_response import DataResponse, SimpleSuccessResponse
from app.services.admin_property_request_service import AdminPropertyRequestService

router = APIRouter()


@router.get("", response_model=AdminPropertyRequestListResponse, response_model_exclude_none=True)
async def admin_list_property_requests(
    page: int = 1,
    limit: int = 20,
    requestType: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    userId: Optional[str] = None,
    propertyId: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminPropertyRequestService = Depends(get_admin_property_request_service),
):
    try:
        params = AdminPropertyRequestListParams(
            page=page, limit=limit, requestType=requestType, status=status,
            search=search, userId=userId, propertyId=propertyId,
        )
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    result = await service.list_requests(
        page=params.page, limit=params.limit, request_type=params.requestType,
        status_filter=params.status, search=params.search, user_id=params.userId,
        property_id=params.propertyId,
    )
    return AdminPropertyRequestListResponse.model_validate(result)


@router.get("/stats", response_model=DataResponse[AdminPropertyRequestStats], response_model_exclude_none=True)
async def admin_property_request_stats(
    requestType: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminPropertyRequestService = Depends(get_admin_property_request_service),
):
    stats = await service.get_stats(request_type=requestType)
    return DataResponse[AdminPropertyRequestStats](data=AdminPropertyRequestStats.model_validate(stats))


@router.get("/{request_id}", response_model=DataResponse[AdminPropertyRequestDetail], response_model_exclude_none=True)
async def admin_get_property_request(
    request_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminPropertyRequestService = Depends(get_admin_property_request_service),
):
    data = await service.get_request(request_id)
    return DataResponse[AdminPropertyRequestDetail](data=AdminPropertyRequestDetail.model_validate(data))


@router.patch("/{request_id}/status", response_model=DataResponse[AdminPropertyRequestCard], response_model_exclude_none=True)
async def admin_update_property_request_status(
    request_id: int,
    body: AdminPropertyRequestStatusUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminPropertyRequestService = Depends(get_admin_property_request_service),
):
    data = await service.update_status(request_id, body.status, body.note)
    return DataResponse[AdminPropertyRequestCard](data=AdminPropertyRequestCard.model_validate(data))


@router.delete("/{request_id}", response_model=SimpleSuccessResponse, response_model_exclude_none=True)
async def admin_delete_property_request(
    request_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminPropertyRequestService = Depends(get_admin_property_request_service),
):
    result = await service.delete_request(request_id)
    return SimpleSuccessResponse.model_validate(result)
