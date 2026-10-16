"""Response payloads for admin_controller.py's payment-transaction routes
(PaymentTransaction.to_dict() in app/models/property_payments.py, and the
hand-built stats dict in admin_get_stats).
"""

from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class PaymentTransactionCard(BaseModel):
    """Mirrors PaymentTransaction.to_dict() field-for-field."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: str
    payment_id: Optional[str] = None
    refund_id: Optional[str] = None
    amount: int
    amount_inr: float
    currency: str
    status: str
    property_category: str
    listing_purpose: str
    user_id: str
    property_id: Optional[str] = None
    created_at: Optional[str] = None
    captured_at: Optional[str] = None
    error_description: Optional[str] = None


class AdminTransactionListResponse(BaseModel):
    status: str = "success"
    total: int
    limit: int
    offset: int
    transactions: List[PaymentTransactionCard]


class PaymentStatusBreakdownItem(BaseModel):
    status: str
    count: int


class AdminPaymentStatsResponse(BaseModel):
    status: str = "success"
    total_transactions: int
    total_revenue: float
    status_breakdown: List[PaymentStatusBreakdownItem]
