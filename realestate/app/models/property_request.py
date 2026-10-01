from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class PropertyRequest(Base):
    """A customer's request to purchase or rent a specific property - backs
    both the customer-facing "Requested Properties" tab and the admin
    dashboard's Purchase Requests / Rental Requests modules.

    One shared table for both request_type values ("purchase" | "rental"),
    matching this codebase's existing CustomerRequirement precedent (buyer
    and tenant are not split into separate tables - same shape, different
    field subset in use). `status` is a free string validated against a
    request_type-specific pipeline at the schema layer (app.schemas.
    property_request_schemas), not a DB-level enum, since the two types have
    different pipelines and a shared Postgres enum would have to carry every
    value for both.

    Creation is customer self-service (a user requests a property they're
    browsing); status/status_history are admin-only writes (the request's
    lifecycle is managed from the admin dashboard, same split as
    Customer.kyc_status / User.status in the customer-admin domain).
    """

    __tablename__ = "property_requests"

    id = Column(Integer, primary_key=True, index=True)
    # Customers ARE users with role=USER - see app.models.customer's docstring.
    user_id = Column(String(20), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    property_id = Column(String(20), ForeignKey("properties.id", ondelete="CASCADE"), nullable=False, index=True)

    request_type = Column(String(20), nullable=False)  # purchase | rental
    status = Column(String(30), default="new", nullable=False)
    # Appended server-side on every admin status change - [{"status": ..., "date": ..., "note": ...}, ...]
    status_history = Column(JSONB, default=list, nullable=False)

    # The buyer's offer (purchase) or the tenant's proposed monthly rent
    # (rental) - the one amount a request button/modal will capture later.
    requested_amount = Column(Float, nullable=True)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)

    preferred_date = Column(Date, nullable=True)  # possession date (purchase) / move-in date (rental)
    timeline = Column(String(50), nullable=True)  # purchase timeline / rental duration, free text

    occupant_type = Column(String(50), nullable=True)  # Family | Bachelor | Couple | Students | Working Professionals | Investor
    occupants_count = Column(Integer, nullable=True)
    employment_type = Column(String(50), nullable=True)
    company_name = Column(String(255), nullable=True)
    monthly_income = Column(Float, nullable=True)

    financing_required = Column(Boolean, nullable=True)  # purchase only
    site_visit_requested = Column(Boolean, default=False, nullable=False)
    site_visit_date = Column(Date, nullable=True)
    is_urgent = Column(Boolean, default=False, nullable=False)

    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    property = relationship("BaseProperty")
