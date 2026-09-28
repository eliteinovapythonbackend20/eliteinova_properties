"""Routes for the admin dashboard's customer-management surface - Customer
profile fields plus the requirements/saved-properties/wishlist/property-view
rows that hang directly off a user's own id.

Every route is gated by require_admin, matching admin_dashboard_controller's
convention. Request bodies here are camelCase (see admin_customer_schemas.py's
docstring for why); responses are camelCase everywhere in this codebase
already via strip_none_values.

Identity: a user with role=USER IS the customer - every route below is keyed
on `user_id` (the EP... string, `users.id`), never a separate customer id.

Route ORDER matters below: FastAPI/Starlette matches routes in registration
order and does not fall through to the next route if path-parameter type
conversion fails, so every static single-segment GET route (/stats,
/saved-properties, /wishlist, /property-views) is registered before
GET /{user_id} - otherwise a request for e.g. /stats would be captured by
/{user_id} first (the same ordering admin_dashboard_controller uses for
/properties/stats vs /properties/{property_id}). user_id is a plain string
path param here (not int-typed, unlike the old customer_id), so this isn't
strictly forced by a type-conversion failure anymore, but the ordering is
kept for consistency and because it's still the correct defensive default.
"""

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi import status as http_status
from pydantic import ValidationError

from app.api.dependencies import require_admin, get_admin_customer_service
from app.core.response_utils import strip_none_values
from app.schemas.admin_customer_schemas import (
    AdminCustomerCreate,
    AdminCustomerKycUpdate,
    AdminCustomerListParams,
    AdminCustomerStatusUpdate,
    AdminCustomerUpdate,
    AdminPropertyViewListParams,
    AdminRequirementCreate,
    AdminRequirementUpdate,
    AdminSavedPropertyListParams,
    AdminWishlistListParams,
)
from app.services.admin_customer_service import AdminCustomerService

router = APIRouter()


# ----------------------------------------------------------------------
# Customers - list / stats (static routes first, see module docstring)
# ----------------------------------------------------------------------
@router.get("")
async def admin_list_customers(
    page: int = 1,
    limit: int = 20,
    customerType: Optional[str] = Query(None, description="buyer, tenant, or both"),
    status: Optional[str] = Query(None, description="active, inactive, blocked, or pending - filters the joined User.status"),
    kycStatus: Optional[str] = Query(None, description="pending, verified, or rejected"),
    search: Optional[str] = Query(None, description="Matches full_name/phone_number/email case-insensitively"),
    city: Optional[str] = None,
    state: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    try:
        params = AdminCustomerListParams(
            page=page, limit=limit, customerType=customerType, status=status,
            kycStatus=kycStatus, search=search, city=city, state=state,
        )
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    result = await service.list_customers(
        page=params.page, limit=params.limit, customer_type=params.customerType,
        status=params.status, kyc_status=params.kycStatus, search=params.search,
        city=params.city, state=params.state,
    )
    return strip_none_values(result)


@router.get("/stats")
async def admin_customer_stats(
    customerType: Optional[str] = None,
    status: Optional[str] = None,
    kycStatus: Optional[str] = None,
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    try:
        params = AdminCustomerListParams(
            customerType=customerType, status=status, kycStatus=kycStatus,
            search=search, city=city, state=state,
        )
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    stats = await service.get_customer_stats(
        customer_type=params.customerType, status=params.status, kyc_status=params.kycStatus,
        search=params.search, city=params.city, state=params.state,
    )
    return strip_none_values({"data": stats})


# ----------------------------------------------------------------------
# Saved properties - admin-wide (static route before /{user_id})
# ----------------------------------------------------------------------
@router.get("/saved-properties")
async def admin_list_saved_properties(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    userId: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    try:
        params = AdminSavedPropertyListParams(page=page, limit=limit, search=search, userId=userId)
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    result = await service.list_saved_properties(
        page=params.page, limit=params.limit, search=params.search, user_id=params.userId,
    )
    return strip_none_values(result)


@router.delete("/saved-properties/{saved_id}")
async def admin_delete_saved_property(
    saved_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    return await service.delete_saved_property(saved_id)


# ----------------------------------------------------------------------
# Wishlist - admin-wide (static route before /{user_id})
# ----------------------------------------------------------------------
@router.get("/wishlist")
async def admin_list_wishlist(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    userId: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    try:
        params = AdminWishlistListParams(page=page, limit=limit, search=search, userId=userId)
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    result = await service.list_wishlist(
        page=params.page, limit=params.limit, search=params.search, user_id=params.userId,
    )
    return strip_none_values(result)


@router.delete("/wishlist/{wishlist_id}")
async def admin_delete_wishlist_item(
    wishlist_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    return await service.delete_wishlist_item(wishlist_id)


# ----------------------------------------------------------------------
# Property views - admin-wide, read-only (static route before /{user_id})
# ----------------------------------------------------------------------
@router.get("/property-views")
async def admin_list_property_views(
    page: int = 1,
    limit: int = 20,
    userId: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    try:
        params = AdminPropertyViewListParams(page=page, limit=limit, userId=userId)
    except ValidationError as e:
        raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail=e.errors()[0]["msg"])

    result = await service.list_property_views(page=params.page, limit=params.limit, user_id=params.userId)
    return strip_none_values(result)


# ----------------------------------------------------------------------
# Requirements - by requirement id (two-segment path, no shape collision
# with /{user_id}/... below regardless of order, but grouped here with the
# other requirement routes for readability)
# ----------------------------------------------------------------------
@router.patch("/requirements/{requirement_id}")
async def admin_update_requirement(
    requirement_id: int,
    body: AdminRequirementUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.update_requirement(requirement_id, fields)
    return strip_none_values({"data": data})


@router.delete("/requirements/{requirement_id}")
async def admin_delete_requirement(
    requirement_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    return await service.delete_requirement(requirement_id)


# ----------------------------------------------------------------------
# Customers - create / detail / update / delete
# ----------------------------------------------------------------------
@router.post("", status_code=http_status.HTTP_201_CREATED)
async def admin_create_customer(
    body: AdminCustomerCreate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    data = await service.create_customer(body.model_dump())
    return strip_none_values({"data": data})


@router.get("/{user_id}")
async def admin_get_customer(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    data = await service.get_customer(user_id)
    return strip_none_values({"data": data})


@router.patch("/{user_id}")
async def admin_update_customer(
    user_id: str,
    body: AdminCustomerUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.update_customer(user_id, fields)
    return strip_none_values({"data": data})


@router.patch("/{user_id}/status")
async def admin_update_customer_status(
    user_id: str,
    body: AdminCustomerStatusUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    data = await service.update_status(user_id, body.status)
    return strip_none_values({"data": data})


@router.patch("/{user_id}/kyc")
async def admin_update_customer_kyc(
    user_id: str,
    body: AdminCustomerKycUpdate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.update_kyc(user_id, fields)
    return strip_none_values({"data": data})


@router.delete("/{user_id}")
async def admin_delete_customer(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    return await service.delete_customer(user_id)


# ----------------------------------------------------------------------
# Requirements - scoped under a customer (user_id)
# ----------------------------------------------------------------------
@router.get("/{user_id}/requirements")
async def admin_list_customer_requirements(
    user_id: str,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    return strip_none_values(await service.list_requirements(user_id))


@router.post("/{user_id}/requirements", status_code=http_status.HTTP_201_CREATED)
async def admin_create_customer_requirement(
    user_id: str,
    body: AdminRequirementCreate,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: AdminCustomerService = Depends(get_admin_customer_service),
):
    fields = body.model_dump(exclude_unset=True)
    data = await service.create_requirement(user_id, fields)
    return strip_none_values({"data": data})
