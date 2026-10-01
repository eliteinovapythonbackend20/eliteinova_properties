"""Data access for the customer-facing self-service surface ("my own"
profile, saved properties, wishlist, requirements, property requests) - the
self-service counterpart to app.repositories.admin_customer_repository.

Kept fully separate from AdminCustomerRepository on purpose, same reasoning
as that module's own docstring: self-service and admin-moderation are
different access levels of the same domain, so a query added here (always
scoped to one caller's own user_id) can never accidentally grow an
admin-wide capability, and vice versa. Every method on this class takes (or
implicitly is) scoped to a single user_id - there is no list-everyone /
search-across-customers method in this file; those stay admin-only.

Identity: a user with role=USER IS the customer - `user_id` (users.id, the
EP... string) is the handle used throughout. `Customer.id` and
`PropertyRequest.id` are only ever used as opaque row handles the caller
already owns (never as a lookup key reachable by another user's id).
"""

from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.customer import Customer
from app.models.customer_activity import CustomerSavedProperty, CustomerWishlistItem
from app.models.customer_requirement import CustomerRequirement
from app.models.property import BaseProperty
from app.models.property_request import PropertyRequest
from app.models.user import User
from app.repositories.property_repository import PropertyRepository


class CustomerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()

    # ------------------------------------------------------------------
    # Profile - "my own" Customer row
    # ------------------------------------------------------------------
    async def get_customer_by_user_id(self, user_id: str) -> Optional[Customer]:
        result = await self.db.execute(
            select(Customer).where(Customer.user_id == user_id).options(joinedload(Customer.user))
        )
        return result.unique().scalar_one_or_none()

    async def update_customer_fields(self, user_id: str, fields: Dict[str, Any]) -> Optional[Customer]:
        customer = await self.get_customer_by_user_id(user_id)
        if not customer:
            return None
        for key, value in fields.items():
            setattr(customer, key, value)
        await self.db.flush()
        await self.db.refresh(customer)
        return customer

    # ------------------------------------------------------------------
    # Requirements - scoped by user_id; update/delete additionally filter on
    # id to double as the ownership check (a mismatched id+user_id pair
    # simply returns None/False, same shape as "not found").
    # ------------------------------------------------------------------
    async def list_requirements(self, user_id: str) -> List[CustomerRequirement]:
        result = await self.db.execute(
            select(CustomerRequirement)
            .where(CustomerRequirement.user_id == user_id)
            .order_by(CustomerRequirement.created_at.desc())
        )
        return result.scalars().all()

    async def create_requirement(self, user_id: str, fields: Dict[str, Any]) -> CustomerRequirement:
        requirement = CustomerRequirement(user_id=user_id, **fields)
        self.db.add(requirement)
        await self.db.flush()
        await self.db.refresh(requirement)
        return requirement

    async def get_own_requirement(self, requirement_id: int, user_id: str) -> Optional[CustomerRequirement]:
        result = await self.db.execute(
            select(CustomerRequirement).where(
                and_(CustomerRequirement.id == requirement_id, CustomerRequirement.user_id == user_id)
            )
        )
        return result.scalar_one_or_none()

    async def update_requirement(self, requirement_id: int, user_id: str, fields: Dict[str, Any]) -> Optional[CustomerRequirement]:
        requirement = await self.get_own_requirement(requirement_id, user_id)
        if not requirement:
            return None
        for key, value in fields.items():
            setattr(requirement, key, value)
        await self.db.flush()
        await self.db.refresh(requirement)
        return requirement

    async def delete_requirement(self, requirement_id: int, user_id: str) -> bool:
        requirement = await self.get_own_requirement(requirement_id, user_id)
        if not requirement:
            return False
        await self.db.delete(requirement)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Saved properties - keyed by (user_id, property_id), not a row id, so
    # the "toggle saved" UI pattern (add/remove by property) never needs to
    # know the join row's own id.
    # ------------------------------------------------------------------
    async def list_saved_properties(self, user_id: str) -> List[CustomerSavedProperty]:
        result = await self.db.execute(
            select(CustomerSavedProperty)
            .where(CustomerSavedProperty.user_id == user_id)
            .options(*PropertyRepository.get_full_relations_options_nested(
                joinedload(CustomerSavedProperty.property)
            ))
            .order_by(CustomerSavedProperty.saved_at.desc())
        )
        return result.unique().scalars().all()

    async def get_saved_property(self, user_id: str, property_id: str) -> Optional[CustomerSavedProperty]:
        result = await self.db.execute(
            select(CustomerSavedProperty).where(
                and_(CustomerSavedProperty.user_id == user_id, CustomerSavedProperty.property_id == property_id)
            )
        )
        return result.scalar_one_or_none()

    async def add_saved_property(self, user_id: str, property_id: str, notes: Optional[str]) -> CustomerSavedProperty:
        row = CustomerSavedProperty(user_id=user_id, property_id=property_id, notes=notes)
        self.db.add(row)
        await self.db.flush()
        await self.db.refresh(row)
        return row

    async def remove_saved_property(self, user_id: str, property_id: str) -> bool:
        row = await self.get_saved_property(user_id, property_id)
        if not row:
            return False
        await self.db.delete(row)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Wishlist - same (user_id, property_id) keying as saved properties.
    # ------------------------------------------------------------------
    async def list_wishlist(self, user_id: str) -> List[CustomerWishlistItem]:
        result = await self.db.execute(
            select(CustomerWishlistItem)
            .where(CustomerWishlistItem.user_id == user_id)
            .options(*PropertyRepository.get_full_relations_options_nested(
                joinedload(CustomerWishlistItem.property)
            ))
            .order_by(CustomerWishlistItem.added_at.desc())
        )
        return result.unique().scalars().all()

    async def get_wishlist_item(self, user_id: str, property_id: str) -> Optional[CustomerWishlistItem]:
        result = await self.db.execute(
            select(CustomerWishlistItem).where(
                and_(CustomerWishlistItem.user_id == user_id, CustomerWishlistItem.property_id == property_id)
            )
        )
        return result.scalar_one_or_none()

    async def add_wishlist_item(self, user_id: str, property_id: str, price_at_add: Optional[float]) -> CustomerWishlistItem:
        row = CustomerWishlistItem(user_id=user_id, property_id=property_id, price_at_add=price_at_add)
        self.db.add(row)
        await self.db.flush()
        await self.db.refresh(row)
        return row

    async def remove_wishlist_item(self, user_id: str, property_id: str) -> bool:
        row = await self.get_wishlist_item(user_id, property_id)
        if not row:
            return False
        await self.db.delete(row)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Property requests (purchase / rental) - self-service: create + list/
    # view own only. Status changes are admin-only (see
    # AdminPropertyRequestRepository).
    # ------------------------------------------------------------------
    async def get_property_by_id(self, property_id: str) -> Optional[BaseProperty]:
        result = await self.db.execute(select(BaseProperty).where(BaseProperty.id == property_id))
        return result.scalar_one_or_none()

    async def list_own_property_requests(self, user_id: str, request_type: Optional[str] = None) -> List[PropertyRequest]:
        query = (
            select(PropertyRequest)
            .where(PropertyRequest.user_id == user_id)
            .options(*PropertyRepository.get_full_relations_options_nested(
                joinedload(PropertyRequest.property)
            ))
            .order_by(PropertyRequest.created_at.desc())
        )
        if request_type:
            query = query.where(PropertyRequest.request_type == request_type)
        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_own_property_request(self, request_id: int, user_id: str) -> Optional[PropertyRequest]:
        result = await self.db.execute(
            select(PropertyRequest)
            .where(and_(PropertyRequest.id == request_id, PropertyRequest.user_id == user_id))
            .options(*PropertyRepository.get_full_relations_options_nested(
                joinedload(PropertyRequest.property)
            ))
        )
        return result.unique().scalar_one_or_none()

    async def create_property_request(self, user_id: str, property_id: str, fields: Dict[str, Any]) -> PropertyRequest:
        request = PropertyRequest(user_id=user_id, property_id=property_id, **fields)
        self.db.add(request)
        await self.db.flush()
        await self.db.refresh(request)
        return request
