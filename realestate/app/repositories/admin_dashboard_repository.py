"""Data access for the admin dashboard's property surface.

Kept fully separate from PropertyRepository (app.repositories.property_repository)
on purpose: the admin dashboard is a distinct domain (cross-vendor moderation,
every status visible) from the vendor-posting / public-browse paths that
PropertyRepository serves, and this isolation means a query added or changed
here can never regress the posting forms, profile pages, or public listing.
It shares only the SQLAlchemy models (the DB schema itself), never the other
repository's methods.
"""

from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import and_, delete, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.property import BaseProperty
from app.models.property_agent import PropertyAgentDetails
from app.models.property_builder import PropertyBuilderDetails
from app.models.property_document import PropertyDocument
from app.models.property_media import PropertyMedia
from app.models.property_owner import OwnerProperty
from app.models.property_pm import PropertyManagementProperty


class AdminDashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def commit(self):
        await self.db.commit()

    async def rollback(self):
        await self.db.rollback()

    # ------------------------------------------------------------------
    # Listing - every status visible (no PUBLIC_STATUS-only restriction),
    # optionally narrowed by role/category/status/keyword.
    # ------------------------------------------------------------------
    async def list_properties(
        self,
        skip: int = 0,
        limit: int = 20,
        posted_by: Optional[str] = None,
        property_category: Optional[str] = None,
        property_type: Optional[str] = None,
        sub_category: Optional[str] = None,
        status: Optional[str] = None,
        listing_purpose: Optional[str] = None,
        featured: Optional[bool] = None,
        verification_status: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[BaseProperty], int]:
        query = select(BaseProperty)
        count_query = select(func.count()).select_from(BaseProperty)

        filters = []
        if posted_by:
            filters.append(BaseProperty.posted_by == posted_by)
        if property_category:
            filters.append(BaseProperty.property_category == property_category)
        if property_type:
            filters.append(BaseProperty.property_type == property_type)
        if sub_category:
            filters.append(BaseProperty.sub_category == sub_category)
        if status:
            filters.append(BaseProperty.status == status)
        if listing_purpose:
            filters.append(BaseProperty.listing_purpose == listing_purpose)
        if featured is not None:
            filters.append(BaseProperty.featured.is_(featured))
        if verification_status:
            filters.append(BaseProperty.verification_status == verification_status)
        if search:
            term = f"%{search}%"
            filters.append(or_(
                BaseProperty.property_title.ilike(term),
                BaseProperty.city.ilike(term),
                BaseProperty.area.ilike(term),
                BaseProperty.id.ilike(term),
            ))

        if filters:
            query = query.where(and_(*filters))
            count_query = count_query.where(and_(*filters))

        query = query.options(
            selectinload(BaseProperty.media),
            joinedload(BaseProperty.user),
            # Needed to resolve the "who posted this" display name: owner/agent
            # show the person's name, builder/PM show their company name (see
            # AdminDashboardService._posted_by_name).
            joinedload(BaseProperty.owner_details),
            joinedload(BaseProperty.agent_details),
            joinedload(BaseProperty.builder_details),
            joinedload(BaseProperty.property_management_details),
        )
        query = query.order_by(BaseProperty.created_at.desc()).offset(skip).limit(limit)

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)

        return result.unique().scalars().all(), count_result.scalar() or 0

    async def get_property_stats(
        self,
        posted_by: Optional[str] = None,
        property_category: Optional[str] = None,
        property_type: Optional[str] = None,
        sub_category: Optional[str] = None,
    ) -> Dict[str, Any]:
        base = select(BaseProperty.status, func.count()).group_by(BaseProperty.status)
        if posted_by:
            base = base.where(BaseProperty.posted_by == posted_by)
        if property_category:
            base = base.where(BaseProperty.property_category == property_category)
        if property_type:
            base = base.where(BaseProperty.property_type == property_type)
        if sub_category:
            base = base.where(BaseProperty.sub_category == sub_category)

        result = await self.db.execute(base)
        counts = {status: count for status, count in result.all()}
        total = sum(counts.values())
        stats: Dict[str, Any] = {
            "total": total,
            "active": counts.get("Active", 0),
            "inactive": counts.get("Inactive", 0),
            "pending": counts.get("Pending", 0),
            "sold": counts.get("Sold", 0),
            "rented": counts.get("Rented", 0),
            "expired": counts.get("Expired", 0),
            "rejected": counts.get("Rejected", 0),
        }

        # featured/verification_status aren't part of the status GROUP BY
        # above (they're independent flags, not mutually exclusive with it),
        # so they're counted separately.
        featured_query = select(func.count()).select_from(BaseProperty).where(BaseProperty.featured.is_(True))
        verified_query = select(func.count()).select_from(BaseProperty).where(BaseProperty.verification_status == "Verified")
        if posted_by:
            featured_query = featured_query.where(BaseProperty.posted_by == posted_by)
            verified_query = verified_query.where(BaseProperty.posted_by == posted_by)
        if property_category:
            featured_query = featured_query.where(BaseProperty.property_category == property_category)
            verified_query = verified_query.where(BaseProperty.property_category == property_category)
        if property_type:
            featured_query = featured_query.where(BaseProperty.property_type == property_type)
            verified_query = verified_query.where(BaseProperty.property_type == property_type)
        if sub_category:
            featured_query = featured_query.where(BaseProperty.sub_category == sub_category)
            verified_query = verified_query.where(BaseProperty.sub_category == sub_category)
        stats["featured"] = (await self.db.execute(featured_query)).scalar() or 0
        stats["verified"] = (await self.db.execute(verified_query)).scalar() or 0

        # Per-type breakdown within the category - only meaningful once
        # narrowed to one category (e.g. AGENT + APARTMENT -> counts per
        # "Rental Apartment"/"Studio Apartment"/...), so it's only computed
        # when the caller has actually scoped to one. Also narrowed by
        # sub_category when given (Land & Plots subtype pages, e.g.
        # "Residential Land / Plots" -> counts per "Villa Plot"/"Farm House
        # Plot"/...).
        if property_category:
            by_type_query = (
                select(BaseProperty.property_type, func.count())
                .where(BaseProperty.property_category == property_category)
                .group_by(BaseProperty.property_type)
            )
            if posted_by:
                by_type_query = by_type_query.where(BaseProperty.posted_by == posted_by)
            if sub_category:
                by_type_query = by_type_query.where(BaseProperty.sub_category == sub_category)
            by_type_result = await self.db.execute(by_type_query)
            stats["byType"] = {ptype: count for ptype, count in by_type_result.all() if ptype}

        # Per-sub_category breakdown within the category - only meaningful
        # once narrowed to one category and not yet to one sub_category
        # (the Land & Plots Overview page -> counts per "Residential Land /
        # Plots"/"Commercial Land / Plots"/...).
        if property_category and not sub_category:
            by_sub_category_query = (
                select(BaseProperty.sub_category, func.count())
                .where(BaseProperty.property_category == property_category)
                .group_by(BaseProperty.sub_category)
            )
            if posted_by:
                by_sub_category_query = by_sub_category_query.where(BaseProperty.posted_by == posted_by)
            by_sub_category_result = await self.db.execute(by_sub_category_query)
            stats["bySubCategory"] = {sc: count for sc, count in by_sub_category_result.all() if sc}

        # Buy/Rent/Lease breakdown - only meaningful once narrowed to one
        # property_type (the per-subtype admin pages, e.g. "Independent
        # House") or one sub_category (the Land & Plots subtype pages, e.g.
        # "Residential Land / Plots"), mirroring how byType above only fires
        # once narrowed to one category.
        if property_type or sub_category:
            by_purpose_query = select(BaseProperty.listing_purpose, func.count()).group_by(BaseProperty.listing_purpose)
            if property_type:
                by_purpose_query = by_purpose_query.where(BaseProperty.property_type == property_type)
            if sub_category:
                by_purpose_query = by_purpose_query.where(BaseProperty.sub_category == sub_category)
            if property_category:
                by_purpose_query = by_purpose_query.where(BaseProperty.property_category == property_category)
            if posted_by:
                by_purpose_query = by_purpose_query.where(BaseProperty.posted_by == posted_by)
            by_purpose_result = await self.db.execute(by_purpose_query)
            stats["byListingPurpose"] = {purpose: count for purpose, count in by_purpose_result.all() if purpose}

        return stats

    # ------------------------------------------------------------------
    # Single-property admin actions
    # ------------------------------------------------------------------
    async def get_property_by_id(self, property_id: str) -> Optional[BaseProperty]:
        result = await self.db.execute(
            select(BaseProperty).where(BaseProperty.id == property_id)
        )
        return result.scalar_one_or_none()

    async def get_property_with_relations(self, property_id: str) -> Optional[BaseProperty]:
        """Same eager-loads as list_properties - needed whenever the caller
        will hand the row to AdminDashboardService._to_card, which touches
        user/owner_details/agent_details/builder_details/
        property_management_details/media. Without this, accessing those on
        a bare get_property_by_id() row lazy-loads outside an async
        greenlet and raises (which the auth middleware's catch-all then
        mislabels as an auth error)."""
        result = await self.db.execute(
            select(BaseProperty)
            .where(BaseProperty.id == property_id)
            .options(
                selectinload(BaseProperty.media),
                joinedload(BaseProperty.user),
                joinedload(BaseProperty.owner_details),
                joinedload(BaseProperty.agent_details),
                joinedload(BaseProperty.builder_details),
                joinedload(BaseProperty.property_management_details),
            )
        )
        return result.unique().scalar_one_or_none()

    async def get_property_with_media(self, property_id: str) -> Optional[BaseProperty]:
        """Media/documents eager-loaded - used before delete, to collect the
        storage file paths that need cleaning up alongside the DB rows."""
        result = await self.db.execute(
            select(BaseProperty)
            .where(BaseProperty.id == property_id)
            .options(selectinload(BaseProperty.media), selectinload(BaseProperty.documents))
        )
        return result.unique().scalar_one_or_none()

    async def update_property_status(self, property_id: str, new_status: str) -> Optional[BaseProperty]:
        prop = await self.get_property_by_id(property_id)
        if not prop:
            return None
        prop.status = new_status
        await self.db.flush()
        await self.db.refresh(prop)
        return prop

    async def update_property(self, property_id: str, fields: Dict[str, Any]) -> Optional[BaseProperty]:
        """Generic column update for the admin Edit Property form - only ever
        called with keys AdminPropertyUpdate has already validated."""
        prop = await self.get_property_by_id(property_id)
        if not prop:
            return None
        for key, value in fields.items():
            setattr(prop, key, value)
        await self.db.flush()
        await self.db.refresh(prop)
        return prop

    async def delete_property(self, property_id: str) -> bool:
        """Delete a property and every row that references it - mirrors
        PropertyRepository.delete_property's cascade list (the FKs already
        carry ON DELETE CASCADE, but this keeps behavior explicit and
        independent of that other repository)."""
        prop = await self.get_property_by_id(property_id)
        if not prop:
            return False

        for model in (
            OwnerProperty, PropertyAgentDetails, PropertyBuilderDetails,
            PropertyManagementProperty, PropertyMedia, PropertyDocument,
        ):
            await self.db.execute(delete(model).where(model.property_id == property_id))

        await self.db.delete(prop)
        await self.db.flush()
        return True
