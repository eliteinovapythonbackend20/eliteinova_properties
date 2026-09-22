"""Property search / filtering.

``_build_query`` is the single place that turns a :class:`PropertyFilter` into a
SQLAlchemy ``Select`` against real ``BaseProperty`` columns. It is shared by
``POST /api/v1/filters/search`` and the ``GET /api/v1/properties/by-*`` browse
endpoints. Only ``status == "Active"`` rows are ever returned to the public.
"""

from datetime import datetime, date
from typing import Any, Dict, Optional

from sqlalchemy import Float, String, and_, cast, func, or_, select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import joinedload, selectinload

from app.models.property import BaseProperty as Property
from app.repositories.property_repository import PropertyRepository
from app.schemas.property_filter import PropertyFilter, RangeFilter

PUBLIC_STATUS = "Active"

_JSONB_CONTAINS_FIELDS = {
    "amenities": Property.amenities,
    "interior_features": Property.interior_features,
    "appliance_included": Property.appliance_included,
    "selected_feature": Property.selected_feature,
    "room_type": Property.room_type,
    "sharing_type": Property.sharing_type,
    "tenant_type": Property.tenant_type,
}

_YESNO_FIELDS = {
    "pet_friendly": Property.pet_friendly,
    "garden_space": Property.garden_space,
    "terrace": Property.terrace,
    "balcony": Property.balcony,
    "smoking_allowed": Property.smoking_allowed,
    "food_included": Property.food_included,
    "kitchen_access": Property.kitchen_access,
    "utilities_included": Property.utilities_included,
    "electricity_available": Property.electricity_available,
}

_EXACT_ISH_FIELDS = {
    "furnishing_status": Property.furnishing_status,
    "facing_direction": Property.facing_direction,
    "ownership_type": Property.ownership_type,
    "property_condition": Property.property_condition,
    "loan_outstanding": Property.loan_outstanding,
    "commercial_type": Property.commercial_type,
    "business_type": Property.business_type,
    "zoning_type": Property.zoning_type,
    "estimated_footfall": Property.estimated_footfall,
    "hostel_type": Property.hostel_type,
    "hostel_category": Property.hostel_category,
    "gender_type": Property.gender_type,
    "bathroom_type": Property.bathroom_type,
    "food_type": Property.food_type,
    "land_shape": Property.land_shape,
    "soil_type": Property.soil_type,
    "water_source": Property.water_source,
    "area_unit": Property.area_unit,
}


def _to_date(value: Any) -> Optional[date]:
    if isinstance(value, date):
        return value
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, str):
        for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d-%m-%Y", "%d/%m/%Y"):
            try:
                return datetime.strptime(value.strip(), fmt).date()
            except ValueError:
                continue
    return None


def _apply_range(query, column, rng: Optional[RangeFilter], caster=None):
    if not rng or rng.is_empty():
        return query
    col = cast(column, caster) if caster else column
    if rng.min is not None:
        query = query.where(col >= rng.min)
    if rng.max is not None:
        query = query.where(col <= rng.max)
    return query


class FilterService:
    def __init__(self, repository: PropertyRepository):
        self.repository = repository
        # PropertyService is imported lazily to avoid a circular import.
        from app.services.property_service import PropertyService
        self.property_service = PropertyService(repository)

    # ------------------------------------------------------------------
    def _build_query(self, filters: PropertyFilter):
        query = select(Property).where(func.upper(Property.status) == PUBLIC_STATUS.upper())
        query = query.options(
            selectinload(Property.media),
            joinedload(Property.user),
            joinedload(Property.owner_details),
            joinedload(Property.agent_details),
            joinedload(Property.builder_details),
            joinedload(Property.property_management_details),
        )

        # taxonomy
        if filters.property_category:
            query = query.where(func.upper(Property.property_category) == filters.property_category)
        if filters.listing_purpose:
            query = query.where(func.upper(Property.listing_purpose) == filters.listing_purpose)
        if filters.posted_by:
            query = query.where(func.upper(Property.posted_by).in_(filters.posted_by))
        if filters.property_type:
            query = query.where(Property.property_type.ilike(f"%{filters.property_type}%"))
        if filters.sub_category:
            query = query.where(Property.sub_category.ilike(f"%{filters.sub_category}%"))

        # location
        if filters.preferred_location:
            term = f"%{filters.preferred_location}%"
            query = query.where(or_(
                Property.city.ilike(term),
                Property.area.ilike(term),
                Property.address.ilike(term),
                Property.district.ilike(term),
                Property.state.ilike(term),
                Property.landmark.ilike(term),
                cast(Property.pin_code, String).ilike(term),
            ))
        if filters.city:
            query = query.where(Property.city.ilike(f"%{filters.city}%"))
        if filters.state:
            query = query.where(Property.state.ilike(f"%{filters.state}%"))
        if filters.pincode:
            query = query.where(cast(Property.pin_code, String) == str(filters.pincode))

        # rooms
        for field, column in (("bedrooms", Property.bedrooms), ("bathrooms", Property.bathrooms)):
            exact, min_plus = filters.bhk_ints(field)
            conds = []
            if exact:
                conds.append(column.in_(exact))
            if min_plus is not None:
                conds.append(column >= min_plus)
            if conds:
                query = query.where(or_(*conds))

        if filters.parking:
            digits = "".join(c for c in filters.parking if c.isdigit())
            if digits:
                query = query.where(Property.parking_capacity >= int(digits))
            else:
                query = query.where(func.lower(Property.parking) == filters.parking.lower())

        # money
        if filters.price and not filters.price.is_empty():
            rng = filters.price
            price = cast(Property.expected_price, Float)
            price_min = cast(Property.price_min, Float)
            price_max = cast(Property.price_max, Float)
            conds = []
            if rng.min is not None and rng.max is not None:
                conds.append(and_(price >= rng.min, price <= rng.max))
                conds.append(and_(price_max.isnot(None), price_max >= rng.min, price_min <= rng.max))
            elif rng.min is not None:
                conds.append(price >= rng.min)
                conds.append(and_(price_max.isnot(None), price_max >= rng.min))
            elif rng.max is not None:
                conds.append(price <= rng.max)
                conds.append(and_(price_min.isnot(None), price_min <= rng.max))
            query = query.where(or_(*conds))
        query = _apply_range(query, Property.security_deposit, filters.security_deposit, Float)
        query = _apply_range(query, Property.maintenance_amount, filters.maintenance, Float)

        # area
        query = _apply_range(query, Property.built_up_area, filters.built_up_area)
        query = _apply_range(query, Property.carpet_area, filters.carpet_area)
        if filters.land_area and not filters.land_area.is_empty():
            rng = filters.land_area
            if rng.min is not None:
                query = query.where(or_(Property.land_area >= rng.min, Property.land_area_max >= rng.min))
            if rng.max is not None:
                query = query.where(or_(Property.land_area <= rng.max, Property.land_area_min <= rng.max))

        # JSONB "contains all selected"
        for field, column in _JSONB_CONTAINS_FIELDS.items():
            values = getattr(filters, field)
            if values:
                for item in values:
                    query = query.where(column.op("@>")(cast([item], JSONB)))

        # yes/no flags
        for field, column in _YESNO_FIELDS.items():
            value = getattr(filters, field)
            if value:
                query = query.where(func.lower(column) == str(value).lower())

        # plain equality-ish (case-insensitive contains)
        for field, column in _EXACT_ISH_FIELDS.items():
            value = getattr(filters, field)
            if value:
                query = query.where(column.ilike(f"%{value}%"))

        if filters.property_age is not None:
            query = query.where(Property.property_age <= filters.property_age)
        if filters.minimum_duration:
            query = query.where(or_(
                Property.minimum_duration.ilike(f"%{filters.minimum_duration}%"),
                Property.minimum_stay_duration.ilike(f"%{filters.minimum_duration}%"),
            ))
        move_in = _to_date(filters.available_from)
        if move_in:
            query = query.where(or_(Property.available_from.is_(None), Property.available_from <= move_in))

        return query

    def _order_by(self, query, filters: PropertyFilter):
        col = cast(Property.expected_price, Float) if filters.sort_by == "price" else Property.created_at
        return query.order_by(col.asc() if filters.sort_order == "asc" else col.desc())

    # ------------------------------------------------------------------
    async def run(self, filters: PropertyFilter) -> Dict[str, Any]:
        db = self.repository.db
        query = self._build_query(filters)

        total = await db.scalar(select(func.count()).select_from(query.order_by(None).subquery()))
        total = total or 0

        query = self._order_by(query, filters)
        page = max(filters.page, 1)
        limit = min(max(filters.limit, 1), 100)
        query = query.offset((page - 1) * limit).limit(limit)

        rows = (await db.execute(query)).unique().scalars().all()
        data = [self.property_service._to_card(p) for p in rows]

        total_pages = (total + limit - 1) // limit if limit else 0
        return {
            "data": data,
            "pagination": {
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1,
            },
        }

    async def search(self, filters: PropertyFilter) -> Dict[str, Any]:
        return await self.run(filters)

    async def get_sub_category_data(self, sub_category: str, page: int = 1, limit: int = 20) -> Dict[str, Any]:
        filters = PropertyFilter.model_validate({"subCategory": sub_category, "page": page, "limit": limit})
        return await self.run(filters)
