from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Request, status, Depends
import json, logging
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.models.property_payments import (
    CreateOrderRequest, VerifyPaymentRequest, RefundRequest, PaymentStatus
)
from app.services.razorpay_service import RazorpayService
from app.core.database import get_db
from app.api.dependencies import require_vendor

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/create-order")
async def create_order(
    order_data: CreateOrderRequest,
    current_user: Dict[str, Any] = Depends(require_vendor), 
    db: AsyncSession = Depends(get_db)
):
    """Create payment order with dynamic pricing"""
    try:
        razorpay = RazorpayService(db)
        # Added await here
        order = await razorpay.create_order(order_data, current_user.get("user_id"))
        # Added await here
        transaction = await razorpay.get_transaction_by_order_id(order["id"])
        
        return {
            "status": "success",
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key_id": razorpay.key_id,
            "transaction_id": transaction.id if transaction else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-payment")
async def verify_payment(
    data: VerifyPaymentRequest, 
    db: AsyncSession = Depends(get_db)
):
    """Verify payment signature"""
    try:
        razorpay = RazorpayService(db)
        # Added await here
        is_valid = await razorpay.verify_payment(data)
        # Added await here
        transaction = await razorpay.get_transaction_by_order_id(data.order_id)
        
        return {
            "status": "success" if is_valid else "failed",
            "is_valid": is_valid,
            "transaction": transaction.to_dict() if transaction else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/capture-payment/{payment_id}")
async def capture_payment(
    payment_id: str, 
    amount: int = None, 
    db: AsyncSession = Depends(get_db)
):
    """Capture a pre-authorized payment"""
    try:
        razorpay = RazorpayService(db)
        # Added await here
        captured = await razorpay.capture_payment(payment_id, amount)
        return {"status": "success", "payment": captured}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refund-payment")
async def refund_payment(
    data: RefundRequest, 
    db: AsyncSession = Depends(get_db)
):
    """Process refund"""
    try:
        razorpay = RazorpayService(db)
        # Added await here
        refund = await razorpay.refund_payment(data)
        return {"status": "success", "refund": refund}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transaction/{order_id}")
async def get_transaction(
    order_id: str, 
    db: AsyncSession = Depends(get_db)
):
    """Get transaction by order ID"""
    try:
        razorpay = RazorpayService(db)
        # Added await here
        transaction = await razorpay.get_transaction_by_order_id(order_id)
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return {"status": "success", "transaction": transaction.to_dict()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions/user/{user_id}")
async def get_user_transactions(
    user_id: str, 
    limit: int = 20, 
    db: AsyncSession = Depends(get_db)
):
    """Get all transactions for a user"""
    try:
        razorpay = RazorpayService(db)
        # Added await here
        transactions = await razorpay.get_user_transactions(user_id, limit)
        return {
            "status": "success",
            "count": len(transactions),
            "transactions": [t.to_dict() for t in transactions]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def razorpay_webhook(
    request: Request, 
    db: AsyncSession = Depends(get_db)
):
    """Handle Razorpay webhook events"""
    try:
        payload = await request.body()
        payload_str = payload.decode('utf-8')
        signature = request.headers.get('X-Razorpay-Signature')
        
        if not signature:
            raise HTTPException(status_code=400, detail="Missing signature")
        
        razorpay = RazorpayService(db)
        if not razorpay.verify_webhook_signature(payload_str, signature):
            raise HTTPException(status_code=401, detail="Invalid signature")
        
        webhook_data = json.loads(payload_str)
        logger.info(f"Webhook received: {webhook_data.get('event')}")
        
        # Update transaction based on webhook (added await)
        await razorpay.update_transaction_from_webhook(webhook_data)
        
        return {"status": "success", "message": "Webhook processed"}
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))