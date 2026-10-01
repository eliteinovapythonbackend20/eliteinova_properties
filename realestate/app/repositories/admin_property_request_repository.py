"""Data access for the admin dashboard's Purchase Requests / Rental Requests
surface - backs the previously-mock PurchaseRequests/RentalRequests admin
modules.

Kept fully separate from CustomerRepository/AdminCustomerRepository on
purpose, same reasoning as admin_customer_repository.py's own docstring:
request moderation is a distinct admin domain from customer moderation (a
customer can exist with zero requests, and a request's lifecycle - status,
status_history - is managed entirely from here, never from the self-service
side). Admin-wide: every list method here can span every customer, unlike
CustomerRepository's property-request methods which are always scoped to
one caller's own user_id.
"""

from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.customer import Customer
from app.models.property import BaseProperty
from app.models.property_request import PropertyRequest
from app.models.user import User
from app.repositories.property_repository import PropertyRepository


class AdminPropertyRequestRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()

    @staticmethod
    def _filters(
        request_type: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        user_id: Optional[str] = None,
        property_id: Optional[str] = None,
    ) -> list:
        filters = []
        if request_type:
            filters.append(PropertyRequest.request_type == request_type)
        if status:
            filters.append(PropertyRequest.status == status)
        if user_id:
            filters.append(PropertyRequest.user_id == user_id)
        if property_id:
            filters.append(PropertyRequest.property_id == property_id)
        if search:
            term = f"%{search}%"
            filters.append(or_(
                Customer.full_name.ilike(term),
                User.email.ilike(term),
                BaseProperty.property_title.ilike(term),
            ))
        return filters

    def _base_query(self):
        return (
            select(PropertyRequest)
            .join(User, PropertyRequest.user_id == User.id)
            .outerjoin(Customer, Customer.user_id == User.id)
            .join(BaseProperty, PropertyRequest.property_id == BaseProperty.id)
            .options(
                joinedload(PropertyRequest.user).joinedload(User.customer),
                joinedload(PropertyRequest.property).selectinload(BaseProperty.media),
            )
        )

    def _count_query(self):
        return (
            select(func.count()).select_from(PropertyRequest)
            .join(User, PropertyRequest.user_id == User.id)
            .outerjoin(Customer, Customer.user_id == User.id)
            .join(BaseProperty, PropertyRequest.property_id == BaseProperty.id)
        )

    async def list_requests(
        self,
        skip: int = 0,
        limit: int = 20,
        request_type: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        user_id: Optional[str] = None,
        property_id: Optional[str] = None,
    ) -> Tuple[List[PropertyRequest], int]:
        filters = self._filters(request_type, status, search, user_id, property_id)

        query = self._base_query()
        count_query = self._count_query()
        if filters:
            query = query.where(and_(*filters))
            count_query = count_query.where(and_(*filters))

        query = query.order_by(PropertyRequest.created_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.unique().scalars().all(), count_result.scalar() or 0

    async def get_stats(self, request_type: Optional[str] = None) -> Dict[str, Any]:
        def base_query():
            q = select(func.count()).select_from(PropertyRequest)
            if request_type:
                q = q.where(PropertyRequest.request_type == request_type)
            return q

        async def count_with(extra) -> int:
            result = await self.db.execute(base_query().where(extra))
            return result.scalar() or 0

        total = (await self.db.execute(base_query())).scalar() or 0

        if request_type:
            status_result = await self.db.execute(
                select(PropertyRequest.status, func.count())
                .where(PropertyRequest.request_type == request_type)
                .group_by(PropertyRequest.status)
            )
        else:
            status_result = await self.db.execute(
                select(PropertyRequest.status, func.count()).group_by(PropertyRequest.status)
            )
        status_counts = {row[0]: row[1] for row in status_result.all()}

        return {
            "total": total,
            "urgent": await count_with(PropertyRequest.is_urgent.is_(True)),
            "siteVisitRequested": await count_with(PropertyRequest.site_visit_requested.is_(True)),
            "statusCounts": status_counts,
        }

    async def get_request_by_id(self, request_id: int) -> Optional[PropertyRequest]:
        """Used by get_request (Details screen - needs every relation
        ProfileService.to_response touches) as well as update_status/
        delete_request (which only need the row itself) - the fuller eager
        load costs nothing extra for those two since they don't touch
        .property at all."""
        result = await self.db.execute(
            select(PropertyRequest)
            .where(PropertyRequest.id == request_id)
            .options(
                joinedload(PropertyRequest.user).joinedload(User.customer),
                *PropertyRepository.get_full_relations_options_nested(
                    joinedload(PropertyRequest.property)
                ),
            )
        )
        return result.unique().scalar_one_or_none()

    async def update_status(self, request_id: int, new_status: str, status_history: list) -> Optional[PropertyRequest]:
        request = await self.get_request_by_id(request_id)
        if not request:
            return None
        request.status = new_status
        request.status_history = status_history
        await self.db.flush()
        await self.db.refresh(request)
        return request

    async def delete_request(self, request_id: int) -> bool:
        request = await self.get_request_by_id(request_id)
        if not request:
            return False
        await self.db.delete(request)
        await self.db.flush()
        return True
