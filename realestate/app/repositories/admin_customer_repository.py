"""Data access for the admin dashboard's customer-management surface.

Kept fully separate from AdminDashboardRepository/PropertyRepository on
purpose (see admin_customer_schemas.py's docstring) - this is a distinct
admin domain (customer moderation) from property moderation, so a query
added or changed here can never regress the Properties admin surface. It
shares only the SQLAlchemy models, never the other repository's methods.

Identity: a user with role=USER IS the customer - `user_id` (users.id, the
EP... string) is the handle used throughout this file, for both the lookup
key and every FK on CustomerRequirement/CustomerSavedProperty/
CustomerWishlistItem/CustomerPropertyView. `Customer` is queried purely for
its profile columns (name/phone/KYC/...), joined by user_id when needed -
its own integer `id` PK is never used as a lookup key or FK target here.
"""

from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.core.id_generator import IDGenerator
from app.core.security import Security
from app.models.customer import Customer
from app.models.customer_activity import CustomerPropertyView, CustomerSavedProperty, CustomerWishlistItem
from app.models.customer_requirement import CustomerRequirement
from app.models.property import BaseProperty
from app.models.user import User, UserRole, UserStatus


class AdminCustomerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()

    # ------------------------------------------------------------------
    # Shared filter-building - identical narrowing for the list and its
    # /stats sibling, mirroring AdminDashboardRepository's common_filters.
    # ------------------------------------------------------------------
    @staticmethod
    def _customer_filters(
        customer_type: Optional[str] = None,
        status: Optional[str] = None,
        kyc_status: Optional[str] = None,
        search: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
    ) -> list:
        filters = []
        if customer_type:
            filters.append(Customer.customer_type == customer_type)
        if status:
            # Joined column - status lives on User, not Customer.
            filters.append(User.status == status)
        if kyc_status:
            filters.append(Customer.kyc_status == kyc_status)
        if city:
            filters.append(Customer.city.ilike(city))
        if state:
            filters.append(Customer.state.ilike(state))
        if search:
            term = f"%{search}%"
            filters.append(or_(
                Customer.full_name.ilike(term),
                Customer.phone_number.ilike(term),
                User.email.ilike(term),
            ))
        return filters

    # ------------------------------------------------------------------
    # Listing / stats
    # ------------------------------------------------------------------
    async def list_customers(
        self,
        skip: int = 0,
        limit: int = 20,
        customer_type: Optional[str] = None,
        status: Optional[str] = None,
        kyc_status: Optional[str] = None,
        search: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
    ) -> Tuple[List[Customer], int]:
        filters = self._customer_filters(customer_type, status, kyc_status, search, city, state)

        query = (
            select(Customer)
            .join(User, Customer.user_id == User.id)
            .options(joinedload(Customer.user))
        )
        count_query = select(func.count()).select_from(Customer).join(User, Customer.user_id == User.id)

        if filters:
            query = query.where(and_(*filters))
            count_query = count_query.where(and_(*filters))

        query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.unique().scalars().all(), count_result.scalar() or 0

    async def get_customer_stats(
        self,
        customer_type: Optional[str] = None,
        status: Optional[str] = None,
        kyc_status: Optional[str] = None,
        search: Optional[str] = None,
        city: Optional[str] = None,
        state: Optional[str] = None,
    ) -> Dict[str, Any]:
        common_filters = self._customer_filters(customer_type, status, kyc_status, search, city, state)

        def base_query():
            q = select(func.count()).select_from(Customer).join(User, Customer.user_id == User.id)
            if common_filters:
                q = q.where(and_(*common_filters))
            return q

        async def count_with(extra) -> int:
            result = await self.db.execute(base_query().where(extra))
            return result.scalar() or 0

        total = (await self.db.execute(base_query())).scalar() or 0

        return {
            "total": total,
            "buyer": await count_with(Customer.customer_type == "buyer"),
            "tenant": await count_with(Customer.customer_type == "tenant"),
            "both": await count_with(Customer.customer_type == "both"),
            "active": await count_with(User.status == UserStatus.ACTIVE.value),
            "pending": await count_with(User.status == UserStatus.PENDING.value),
            "blocked": await count_with(User.status == UserStatus.BLOCKED.value),
            "kycVerified": await count_with(Customer.kyc_status == "verified"),
            "kycPending": await count_with(Customer.kyc_status == "pending"),
            "kycRejected": await count_with(Customer.kyc_status == "rejected"),
            "emailVerified": await count_with(Customer.email_verified.is_(True)),
            "phoneVerified": await count_with(Customer.phone_verified.is_(True)),
        }

    # ------------------------------------------------------------------
    # Single-customer actions - keyed on user_id (users.id, the EP... string)
    # ------------------------------------------------------------------
    async def get_customer_by_user_id(self, user_id: str) -> Optional[Customer]:
        result = await self.db.execute(
            select(Customer).where(Customer.user_id == user_id).options(joinedload(Customer.user))
        )
        return result.unique().scalar_one_or_none()

    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create_customer(self, email: str, password: str, status: Optional[str], customer_fields: Dict[str, Any]) -> Customer:
        """Creates the User+Customer pair atomically - mirrors
        UserRepository.create_user's flush-then-create-child pattern (flush
        the User first to get its generated id, then create the Customer row
        referencing it, all in the one transaction the caller commits)."""
        user_id = await IDGenerator.generate_user_id(self.db, UserRole.USER)
        user = User(
            id=user_id,
            email=email,
            password_hash=Security.hash_password(password),
            role=UserRole.USER.value,
            status=status or UserStatus.PENDING.value,
        )
        self.db.add(user)
        await self.db.flush()  # user.id now exists in the DB

        customer = Customer(user_id=user.id, **customer_fields)
        self.db.add(customer)
        await self.db.flush()
        await self.db.refresh(customer)
        await self.db.refresh(user)
        # Already-loaded, not lazy - avoids a refetch just to populate
        # Customer.user for _to_card right after creation.
        customer.user = user
        return customer

    async def update_customer_fields(self, user_id: str, fields: Dict[str, Any]) -> Optional[Customer]:
        """Generic Customer-column update - only ever called with keys
        AdminCustomerUpdate/AdminCustomerKycUpdate have already validated."""
        customer = await self.get_customer_by_user_id(user_id)
        if not customer:
            return None
        for key, value in fields.items():
            setattr(customer, key, value)
        await self.db.flush()
        await self.db.refresh(customer)
        return customer

    async def update_user_status(self, user_id: str, new_status: str) -> Optional[Customer]:
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        user.status = new_status
        await self.db.flush()
        return await self.get_customer_by_user_id(user_id)

    async def delete_customer(self, user_id: str) -> bool:
        """Deletes the User row - every FK below it (customer.user_id, and
        every user_id FK on requirements/saved-properties/wishlist/
        property-views) already carries ON DELETE CASCADE, so this alone
        takes all of it with it."""
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        await self.db.delete(user)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Customer requirements - keyed on user_id, not customer_id.
    # ------------------------------------------------------------------
    async def list_requirements(self, user_id: str) -> List[CustomerRequirement]:
        result = await self.db.execute(
            select(CustomerRequirement)
            .where(CustomerRequirement.user_id == user_id)
            .order_by(CustomerRequirement.created_at.desc())
        )
        return result.scalars().all()

    async def get_requirement_by_id(self, requirement_id: int) -> Optional[CustomerRequirement]:
        result = await self.db.execute(
            select(CustomerRequirement).where(CustomerRequirement.id == requirement_id)
        )
        return result.scalar_one_or_none()

    async def create_requirement(self, user_id: str, fields: Dict[str, Any]) -> CustomerRequirement:
        requirement = CustomerRequirement(user_id=user_id, **fields)
        self.db.add(requirement)
        await self.db.flush()
        await self.db.refresh(requirement)
        return requirement

    async def update_requirement(self, requirement_id: int, fields: Dict[str, Any]) -> Optional[CustomerRequirement]:
        requirement = await self.get_requirement_by_id(requirement_id)
        if not requirement:
            return None
        for key, value in fields.items():
            setattr(requirement, key, value)
        await self.db.flush()
        await self.db.refresh(requirement)
        return requirement

    async def delete_requirement(self, requirement_id: int) -> bool:
        requirement = await self.get_requirement_by_id(requirement_id)
        if not requirement:
            return False
        await self.db.delete(requirement)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Saved properties - admin-wide, across every customer.
    # ------------------------------------------------------------------
    async def list_saved_properties(
        self, skip: int = 0, limit: int = 20, search: Optional[str] = None, user_id: Optional[str] = None,
    ) -> Tuple[List[CustomerSavedProperty], int]:
        query = (
            select(CustomerSavedProperty)
            .join(User, CustomerSavedProperty.user_id == User.id)
            .outerjoin(Customer, Customer.user_id == User.id)
            .join(BaseProperty, CustomerSavedProperty.property_id == BaseProperty.id)
            .options(
                joinedload(CustomerSavedProperty.user).joinedload(User.customer),
                joinedload(CustomerSavedProperty.property).selectinload(BaseProperty.media),
            )
        )
        count_query = (
            select(func.count()).select_from(CustomerSavedProperty)
            .join(User, CustomerSavedProperty.user_id == User.id)
            .outerjoin(Customer, Customer.user_id == User.id)
            .join(BaseProperty, CustomerSavedProperty.property_id == BaseProperty.id)
        )

        filters = []
        if user_id:
            filters.append(CustomerSavedProperty.user_id == user_id)
        if search:
            term = f"%{search}%"
            filters.append(or_(
                Customer.full_name.ilike(term),
                User.email.ilike(term),
                BaseProperty.property_title.ilike(term),
            ))
        if filters:
            query = query.where(and_(*filters))
            count_query = count_query.where(and_(*filters))

        query = query.order_by(CustomerSavedProperty.saved_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.unique().scalars().all(), count_result.scalar() or 0

    async def get_saved_property_by_id(self, saved_id: int) -> Optional[CustomerSavedProperty]:
        result = await self.db.execute(
            select(CustomerSavedProperty).where(CustomerSavedProperty.id == saved_id)
        )
        return result.scalar_one_or_none()

    async def delete_saved_property(self, saved_id: int) -> bool:
        row = await self.get_saved_property_by_id(saved_id)
        if not row:
            return False
        await self.db.delete(row)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Wishlist - admin-wide, across every customer.
    # ------------------------------------------------------------------
    async def list_wishlist(
        self, skip: int = 0, limit: int = 20, search: Optional[str] = None, user_id: Optional[str] = None,
    ) -> Tuple[List[CustomerWishlistItem], int]:
        query = (
            select(CustomerWishlistItem)
            .join(User, CustomerWishlistItem.user_id == User.id)
            .outerjoin(Customer, Customer.user_id == User.id)
            .join(BaseProperty, CustomerWishlistItem.property_id == BaseProperty.id)
            .options(
                joinedload(CustomerWishlistItem.user).joinedload(User.customer),
                joinedload(CustomerWishlistItem.property).selectinload(BaseProperty.media),
            )
        )
        count_query = (
            select(func.count()).select_from(CustomerWishlistItem)
            .join(User, CustomerWishlistItem.user_id == User.id)
            .outerjoin(Customer, Customer.user_id == User.id)
            .join(BaseProperty, CustomerWishlistItem.property_id == BaseProperty.id)
        )

        filters = []
        if user_id:
            filters.append(CustomerWishlistItem.user_id == user_id)
        if search:
            term = f"%{search}%"
            filters.append(or_(
                Customer.full_name.ilike(term),
                User.email.ilike(term),
                BaseProperty.property_title.ilike(term),
            ))
        if filters:
            query = query.where(and_(*filters))
            count_query = count_query.where(and_(*filters))

        query = query.order_by(CustomerWishlistItem.added_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.unique().scalars().all(), count_result.scalar() or 0

    async def get_wishlist_item_by_id(self, wishlist_id: int) -> Optional[CustomerWishlistItem]:
        result = await self.db.execute(
            select(CustomerWishlistItem).where(CustomerWishlistItem.id == wishlist_id)
        )
        return result.scalar_one_or_none()

    async def delete_wishlist_item(self, wishlist_id: int) -> bool:
        row = await self.get_wishlist_item_by_id(wishlist_id)
        if not row:
            return False
        await self.db.delete(row)
        await self.db.flush()
        return True

    # ------------------------------------------------------------------
    # Property views - admin-wide, across every customer. Read-only: rows
    # are written by the customer-facing browse flow, not by admin action.
    # ------------------------------------------------------------------
    async def list_property_views(
        self, skip: int = 0, limit: int = 20, user_id: Optional[str] = None,
    ) -> Tuple[List[CustomerPropertyView], int]:
        query = (
            select(CustomerPropertyView)
            .options(
                joinedload(CustomerPropertyView.user).joinedload(User.customer),
                joinedload(CustomerPropertyView.property),
            )
        )
        count_query = select(func.count()).select_from(CustomerPropertyView)

        if user_id:
            query = query.where(CustomerPropertyView.user_id == user_id)
            count_query = count_query.where(CustomerPropertyView.user_id == user_id)

        query = query.order_by(CustomerPropertyView.last_viewed_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.unique().scalars().all(), count_result.scalar() or 0
