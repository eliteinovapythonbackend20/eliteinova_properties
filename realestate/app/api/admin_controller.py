from typing import Any, Dict, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select


from app.services.property_service import PropertyService
from app.services.auth_service import AuthService
from app.api.dependencies import require_admin, get_property_service, get_auth_service
from app.core.database import get_db
from app.models.property_payments import PaymentStatus, PaymentTransaction
from app.schemas.admin_payment_card import (
    AdminPaymentStatsResponse,
    AdminTransactionListResponse,
    PaymentStatusBreakdownItem,
)
from app.schemas.auth import (
    CreateOfficeUserRequest,
    LoginResponse,
    OfficeUserCreatedResponse,
    TwoFactorRequiredResponse,
    TwoFactorVerifyRequest,
    UserLogin,
    UserResponse,
)
from app.schemas.property_response import PropertyListResponse


router = APIRouter()

# The Admin Login page (and its 2FA follow-up) must never authenticate a
# vendor's or customer's correct credentials - see AuthService.login_restricted.
ADMIN_ONLY = ["admin"]


@router.post("/login", response_model=Union[TwoFactorRequiredResponse, LoginResponse])
async def admin_login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Admin: login. Same email/password check as /auth/login, but the account
    must actually have role=admin - anything else (even a correct password for
    a real vendor/customer account) is rejected here with 403."""
    result = await auth_service.login_restricted(login_data, ADMIN_ONLY)
    if result.get("requires_2fa"):
        return TwoFactorRequiredResponse(pending_token=result["pending_token"])
    return LoginResponse(
        message="Admin login successful",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )


@router.post("/2fa/verify", response_model=LoginResponse)
async def admin_two_factor_verify(
    verify_data: TwoFactorVerifyRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    """Admin: completes admin_login for an admin account that has 2FA enabled."""
    result = await auth_service.complete_two_factor_login_restricted(
        verify_data.pending_token, verify_data.code, ADMIN_ONLY
    )
    return LoginResponse(
        message="Admin login successful",
        user=UserResponse.model_validate(result["user"]),
        accessToken=result["accessToken"],
        refreshToken=result["refreshToken"],
    )


@router.post(
    "/office-users",
    status_code=status.HTTP_201_CREATED,
    response_model=OfficeUserCreatedResponse,
)
async def admin_create_office_user(
    office_data: CreateOfficeUserRequest,
    current_user: Dict[str, Any] = Depends(require_admin),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Admin: provision an office-role account. Office has no self-registration
    path (UserCreate rejects that role) - an authenticated admin is the only
    way one gets created."""
    user_dto = await auth_service.create_office_user(office_data)
    return OfficeUserCreatedResponse(
        message="Office account created successfully",
        user=UserResponse.model_validate(user_dto),
    )


@router.get("/transactions", response_model=AdminTransactionListResponse)
async def admin_get_transactions(
    status_filter: Optional[str] = Query(None, alias="status"),
    user_id: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin: get all transactions with filters."""
    try:
        query = select(PaymentTransaction)
        if status_filter:
            query = query.where(PaymentTransaction.status == status_filter)
        if user_id:
            query = query.where(PaymentTransaction.user_id == user_id)

        total = (
            await db.execute(select(func.count()).select_from(query.subquery()))
        ).scalar() or 0

        result = await db.execute(
            query.order_by(PaymentTransaction.created_at.desc()).offset(offset).limit(limit)
        )
        transactions = result.scalars().all()

        return AdminTransactionListResponse(
            total=total,
            limit=limit,
            offset=offset,
            transactions=[t.to_dict() for t in transactions],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=AdminPaymentStatsResponse)
async def admin_get_stats(
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin: get payment statistics."""
    try:
        total_count = (
            await db.execute(select(func.count()).select_from(PaymentTransaction))
        ).scalar() or 0

        total_revenue = (
            await db.execute(
                select(func.sum(PaymentTransaction.amount_inr)).where(
                    PaymentTransaction.status == PaymentStatus.CAPTURED.value
                )
            )
        ).scalar() or 0

        status_breakdown = []
        for payment_status in PaymentStatus:
            count = (
                await db.execute(
                    select(func.count())
                    .select_from(PaymentTransaction)
                    .where(PaymentTransaction.status == payment_status.value)
                )
            ).scalar() or 0
            status_breakdown.append(PaymentStatusBreakdownItem(status=payment_status.value, count=count))

        return AdminPaymentStatsResponse(
            total_transactions=total_count,
            total_revenue=total_revenue,
            status_breakdown=status_breakdown,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pricing/seed")
async def seed_pricing_rules(
    current_user: Dict[str, Any] = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin: seed default pricing rules.

    Not implemented yet - PricingService has no seeding method to call. Left
    as an explicit 501 (gated behind require_admin) instead of the previous
    unauthenticated no-op, so this doesn't silently look like it worked.
    """
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Pricing rule seeding is not implemented")


@router.get("/all", response_model=PropertyListResponse)
async def admin_get_all_properties(
    page: int = 1,
    limit: int = 20,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: PropertyService = Depends(get_property_service)
):
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page must be greater than 0"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )

    skip = (page - 1) * limit

    response = await service.get_all_properties(
        skip=skip,
        limit=limit
    )
    return PropertyListResponse.model_validate(response)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_property(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: PropertyService = Depends(get_property_service)
):
    # delete_property with no user_id skips the ownership check - the
    # correct admin-override call. The service method this previously
    # called (delete_property_admin) does not exist on PropertyService, so
    # every call to this route raised AttributeError.
    await service.delete_property(property_id)
