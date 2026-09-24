from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func


from app.core.response_utils import strip_none_values
from app.services.property_service import PropertyService
from app.api.dependencies import require_admin, get_property_service
from app.core.database import get_db
from app.models.property_payments import PaymentStatus, PaymentTransaction
from app.services.pricing_service import PricingService


router = APIRouter()

@router.post("/login")
async def admin_login():
    """Admin: Login endpoint"""
    return {"status": "success", "message": "Admin login successful"}
@router.get("/transactions")
async def admin_get_transactions(
    status: Optional[str] = None,
    user_id: Optional[str] = None,
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Admin: Get all transactions with filters"""
    try:
        query = db.query(PaymentTransaction)
        if status:
            query = query.filter(PaymentTransaction.status == status)
        if user_id:
            query = query.filter(PaymentTransaction.user_id == user_id)
        
        total = query.count()
        transactions = query.order_by(
            PaymentTransaction.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return {
            "status": "success",
            "total": total,
            "limit": limit,
            "offset": offset,
            "transactions": [t.to_dict() for t in transactions]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def admin_get_stats(db: AsyncSession = Depends(get_db)):
    """Admin: Get payment statistics"""
    try:
        total_count = db.query(PaymentTransaction).count()
        total_revenue = db.query(PaymentTransaction).filter(
            PaymentTransaction.status == PaymentStatus.CAPTURED.value
        ).with_entities(func.sum(PaymentTransaction.amount_inr)).scalar() or 0
        
        status_breakdown = []
        for status in PaymentStatus:
            count = db.query(PaymentTransaction).filter(
                PaymentTransaction.status == status.value
            ).count()
            status_breakdown.append({"status": status.value, "count": count})
        
        return {
            "status": "success",
            "total_transactions": total_count,
            "total_revenue": total_revenue,
            "status_breakdown": status_breakdown
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pricing/seed")
async def seed_pricing_rules(db: AsyncSession = Depends(get_db)):
    # """Admin: Seed default pricing rules"""
    # try:
    #     pricing_service = PricingService(db)
    #     count = pricing_service.seed_default_pricing_rules()
    #     return {"status": "success", "message": f"Seeded {count} rules", "count": count}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    pass

@router.get("/all")
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
    return strip_none_values(response)


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_property(
    property_id: int,
    current_user: Dict[str, Any] = Depends(require_admin),
    service: PropertyService = Depends(get_property_service)
):
    
    response = await service.delete_property_admin(property_id)
    return strip_none_values(response)