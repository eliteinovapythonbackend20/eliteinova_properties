import razorpay
import hmac
import hashlib
import json
from typing import Optional, Dict, Any
from datetime import datetime
import logging
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.property_payments import (
    CreateOrderRequest, VerifyPaymentRequest, RefundRequest,
    PaymentTransaction, PaymentStatus
)
from app.services.pricing_service import PricingService

logger = logging.getLogger(__name__)

class RazorpayService:
    def __init__(self, db_session: AsyncSession):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        self.key_id = settings.RAZORPAY_KEY_ID
        self.webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET
        self.pricing_service = PricingService(db_session)
        self.db = db_session
    
    # ========== CORE PAYMENT METHODS ==========
    
    async def create_order(self, order_data: CreateOrderRequest, user_id: str) -> Dict[str, Any]:
        """Step 1: Create order and log transaction"""
        try:
            # 1. Calculate price (async)
            pricing = await self.pricing_service.calculate_price(  # Added await
                category=order_data.property_category,
                purpose=order_data.listing_purpose,
                expected_price=order_data.expected_price,
                ground_size=order_data.ground_size
            )

            print(f"pricing for order data {pricing.amount_inr}: {pricing.amount_paise}")
            
            if pricing.amount_inr == 0:
                raise ValueError(f"Pricing not configured for {order_data.property_category.value}")
            if not order_data.property_id:
                order_data.property_id = None
            # 2. Create order in Razorpay (sync - no change)
            data = {
                "amount": pricing.amount_paise,
                "currency": order_data.currency,
                "receipt": order_data.receipt or f"receipt_{datetime.now().timestamp()}",
                "notes": {
                    "property_category": order_data.property_category.value,
                    "listing_purpose": order_data.listing_purpose.value,
                    "user_id": user_id or order_data.user_id,
                    "property_id": order_data.property_id or None
                },
                "payment_capture": 1
            }
            
            if order_data.expected_price:
                data["notes"]["expected_price"] = str(order_data.expected_price)
            if order_data.ground_size:
                data["notes"]["ground_size"] = str(order_data.ground_size)
            if order_data.notes:
                data["notes"].update(order_data.notes)
            
            data["notes"] = {k: v for k, v in data["notes"].items() if v}
            print(f"order is failed because of key_id is not given {data.get('amount')}")
            
            # Razorpay call is SYNC - no await
            order = self.client.order.create(data=data)
            logger.info(f"Order created: {order['id']} - ₹{pricing.amount_inr}")
            
            # 3. Log transaction to database (async)
            transaction = PaymentTransaction(
                order_id=order["id"],
                amount=order["amount"],
                amount_inr=pricing.amount_inr,
                currency=order["currency"],
                status=PaymentStatus.CREATED.value,
                property_category=order_data.property_category.value,
                listing_purpose=order_data.listing_purpose.value,
                expected_price=order_data.expected_price,
                ground_size=order_data.ground_size,
                user_id=user_id,
                property_id=order_data.property_id,
                receipt=order.get("receipt"),
                notes=order_data.notes,
                razorpay_response=order
            )
            
            self.db.add(transaction)
            await self.db.commit()  # Added await
            await self.db.refresh(transaction)  # Added await
            logger.info(f"Transaction logged: ID={transaction.id}, Status={transaction.status}")
            
            return order
            
        except Exception as e:
            logger.error(f"Order creation failed: {str(e)}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    async def verify_payment(self, verification_data: VerifyPaymentRequest) -> bool:
        """Step 2: Verify payment signature"""
        try:
            # 1. Verify signature (sync - no change)
            generated_signature = hmac.new(
                key=settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
                msg=f"{verification_data.order_id}|{verification_data.payment_id}".encode('utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()
            
            is_valid = generated_signature == verification_data.razorpay_signature
            
            # 2. Update transaction status (async)
            if is_valid:
                # Changed: Async query
                stmt = select(PaymentTransaction).where(
                    PaymentTransaction.order_id == verification_data.order_id
                )
                result = await self.db.execute(stmt)  # Added await
                transaction = result.scalar_one_or_none()  # Changed from .first()
                
                if transaction:
                    transaction.payment_id = verification_data.payment_id
                    transaction.status = PaymentStatus.AUTHORIZED.value
                    transaction.updated_at = datetime.utcnow()
                    await self.db.commit()  # Added await
                    logger.info(f"Transaction updated: {transaction.id} → AUTHORIZED")
            
            return is_valid
            
        except Exception as e:
            logger.error(f"Verification failed: {str(e)}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    async def capture_payment(self, payment_id: str, amount: Optional[int] = None) -> Dict[str, Any]:
        """Step 3: Capture payment (deduct money)"""
        try:
            
            if amount is None:
                payment_details = self.client.payment.fetch(payment_id)
                amount = payment_details.get('amount', 0)
            
            captured = self.client.payment.capture(payment_id, amount)
            logger.info(f"Payment captured: {payment_id}")
            
           
            stmt = select(PaymentTransaction).where(
                PaymentTransaction.payment_id == payment_id
            )
            result = await self.db.execute(stmt)
            transaction = result.scalar_one_or_none()
            
            if transaction:
                transaction.status = PaymentStatus.CAPTURED.value
                transaction.captured_at = datetime.utcnow()
                transaction.razorpay_response = captured
                transaction.updated_at = datetime.utcnow()
                await self.db.commit()
                logger.info(f"Transaction updated: {transaction.id} → CAPTURED")
            return captured
            
        except Exception as e:
            logger.error(f"Capture failed: {str(e)}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    async def refund_payment(self, refund_data: RefundRequest) -> Dict[str, Any]:
        """Step 4: Process refund"""
        try:
            # 1. Process refund in Razorpay (sync - no change)
            data = {"payment_id": refund_data.payment_id, "notes": refund_data.notes or {}}
            if refund_data.amount:
                data["amount"] = refund_data.amount
            
            refund = self.client.refund.create(data=data)
            logger.info(f"Refund processed: {refund['id']}")
            
            # 2. Update transaction (async)
            # Changed: Async query
            stmt = select(PaymentTransaction).where(
                PaymentTransaction.payment_id == refund_data.payment_id
            )
            result = await self.db.execute(stmt)  # Added await
            transaction = result.scalar_one_or_none()  # Changed from .first()
            
            if transaction:
                transaction.status = PaymentStatus.REFUNDED.value
                transaction.refund_id = refund.get('id')
                transaction.refunded_at = datetime.utcnow()
                transaction.razorpay_response = refund
                transaction.updated_at = datetime.utcnow()
                await self.db.commit()  # Added await
                logger.info(f"Transaction updated: {transaction.id} → REFUNDED")
            
            return refund
            
        except Exception as e:
            logger.error(f"Refund failed: {str(e)}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # ========== WEBHOOK HANDLING ==========
    
    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify webhook authenticity (sync - no change)"""
        try:
            expected = hmac.new(
                key=self.webhook_secret.encode('utf-8'),
                msg=payload.encode('utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(expected, signature)
        except:
            return False
    
    async def update_transaction_from_webhook(self, webhook_data: dict):
        """Update transaction based on webhook event (async)"""
        try:
            event = webhook_data.get('event')
            payload = webhook_data.get('payload', {})
            
            if event == 'payment.captured':
                entity = payload.get('payment', {}).get('entity', {})
                payment_id = entity.get('id')
                order_id = entity.get('order_id')
                
                # Changed: Async query
                stmt = select(PaymentTransaction).where(
                    PaymentTransaction.payment_id == payment_id
                )
                result = await self.db.execute(stmt)
                transaction = result.scalar_one_or_none()
                
                if not transaction and order_id:
                    stmt = select(PaymentTransaction).where(
                        PaymentTransaction.order_id == order_id
                    )
                    result = await self.db.execute(stmt)
                    transaction = result.scalar_one_or_none()
                
                if transaction:
                    transaction.status = PaymentStatus.CAPTURED.value
                    transaction.payment_id = payment_id
                    transaction.captured_at = datetime.utcnow()
                    transaction.razorpay_response = entity
                    transaction.webhook_data = webhook_data
                    transaction.webhook_processed_at = datetime.utcnow()
                    await self.db.commit()  # Added await
                    logger.info(f"Webhook: {transaction.id} → CAPTURED")
            
            elif event == 'payment.failed':
                entity = payload.get('payment', {}).get('entity', {})
                payment_id = entity.get('id')
                order_id = entity.get('order_id')
                
                # Changed: Async query
                stmt = select(PaymentTransaction).where(
                    PaymentTransaction.payment_id == payment_id
                )
                result = await self.db.execute(stmt)
                transaction = result.scalar_one_or_none()
                
                if not transaction and order_id:
                    stmt = select(PaymentTransaction).where(
                        PaymentTransaction.order_id == order_id
                    )
                    result = await self.db.execute(stmt)
                    transaction = result.scalar_one_or_none()
                
                if transaction:
                    transaction.status = PaymentStatus.FAILED.value
                    transaction.payment_id = payment_id
                    transaction.failed_at = datetime.utcnow()
                    transaction.error_code = entity.get('error_code')
                    transaction.error_description = entity.get('error_description')
                    transaction.razorpay_response = entity
                    transaction.webhook_data = webhook_data
                    transaction.webhook_processed_at = datetime.utcnow()
                    await self.db.commit()  # Added await
                    logger.info(f"Webhook: {transaction.id} → FAILED")
            
            elif event == 'refund.processed':
                entity = payload.get('refund', {}).get('entity', {})
                payment_id = entity.get('payment_id')
                refund_id = entity.get('id')
                
                # Changed: Async query
                stmt = select(PaymentTransaction).where(
                    PaymentTransaction.payment_id == payment_id
                )
                result = await self.db.execute(stmt)
                transaction = result.scalar_one_or_none()
                
                if transaction:
                    transaction.status = PaymentStatus.REFUNDED.value
                    transaction.refund_id = refund_id
                    transaction.refunded_at = datetime.utcnow()
                    transaction.razorpay_response = entity
                    transaction.webhook_data = webhook_data
                    transaction.webhook_processed_at = datetime.utcnow()
                    await self.db.commit()  # Added await
                    logger.info(f"Webhook: {transaction.id} → REFUNDED")
                    
        except Exception as e:
            logger.error(f"Webhook update error: {str(e)}")
    
    # ========== QUERY METHODS ==========
    
    async def get_transaction_by_order_id(self, order_id: str):
        """Get transaction by order ID (async)"""
        # Changed: Async query
        stmt = select(PaymentTransaction).where(
            PaymentTransaction.order_id == order_id
        )
        result = await self.db.execute(stmt)  # Added await
        return result.scalar_one_or_none()  # Changed from .first()
    
    async def get_transaction_by_payment_id(self, payment_id: str):
        """Get transaction by payment ID (async)"""
        # Changed: Async query
        stmt = select(PaymentTransaction).where(
            PaymentTransaction.payment_id == payment_id
        )
        result = await self.db.execute(stmt)  # Added await
        return result.scalar_one_or_none()  # Changed from .first()
    
    async def get_user_transactions(self, user_id: str, limit: int = 20):
        """Get user transactions (async)"""
        # Changed: Async query
        stmt = select(PaymentTransaction).where(
            PaymentTransaction.user_id == user_id
        ).order_by(PaymentTransaction.created_at.desc()).limit(limit)
        result = await self.db.execute(stmt)  # Added await
        return result.scalars().all()  # Changed from .all()
    
    async def get_property_transactions(self, property_id: str):
        """Get property transactions (async)"""
        # Changed: Async query
        stmt = select(PaymentTransaction).where(
            PaymentTransaction.property_id == property_id
        ).order_by(PaymentTransaction.created_at.desc())
        result = await self.db.execute(stmt)  # Added await
        return result.scalars().all()  # Changed from .all()
    
    async def get_all_transactions(self, status: Optional[str] = None, limit: int = 100, offset: int = 0):
        """Get all transactions with filters (async)"""
        # Changed: Async query
        stmt = select(PaymentTransaction)
        if status:
            stmt = stmt.where(PaymentTransaction.status == status)
        stmt = stmt.order_by(PaymentTransaction.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(stmt)  # Added await
        return result.scalars().all()  # Changed from .all()