# app/repositories/property_repository.py

from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update, and_, or_, desc, asc
from sqlalchemy.orm import selectinload, joinedload
from typing import Optional, List, Dict, Any, Tuple
from app.core.id_generator import IDGenerator
from app.models.property import BaseProperty, PropertyCategory, PostedBy
from app.models.property_media import PropertyMedia
from app.models.property_document import PropertyDocument
from app.models.property_contact import PropertyContactPerson, apply_contact_fields
from app.models.contact_person_media import ContactPersonMedia
# from app.schemas.filter_schemas import PropertyFilter
from app.models.user import User
from app.schemas.property_filter import bhk_token_to_int

# Valid vendor_type/posted_by values - property_contact_persons is one table
# discriminated by this column now (owner_properties/agent_properties/
# builder_properties/property_management_properties are dropped; see
# app.models.property_contact and tools/backfill_property_contact_persons.py).
VALID_VENDOR_TYPES = {PostedBy.OWNER, PostedBy.AGENT, PostedBy.BUILDER, PostedBy.PROPERTY_MANAGEMENT}


class PropertyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def get_list_view_options():
        """Options for list view - only load what's needed for cards.

        Must include contact_person: _public_vendor_block() reads
        property_obj.contact_person on every card, and a lazy load on an
        unloaded relationship crashes under async SQLAlchemy.
        """
        return [
            selectinload(BaseProperty.media),
            selectinload(BaseProperty.documents),
            selectinload(BaseProperty.contact_person_media).joinedload(ContactPersonMedia.file_asset),
            joinedload(BaseProperty.user),
            joinedload(BaseProperty.contact_person),
        ]

    @staticmethod
    def get_detail_view_options():
        """Options for detail view - load all relationships"""
        return [
            selectinload(BaseProperty.media),
            selectinload(BaseProperty.documents),
            selectinload(BaseProperty.contact_person_media).joinedload(ContactPersonMedia.file_asset),
            joinedload(BaseProperty.user),
            joinedload(BaseProperty.contact_person),
        ]

    @staticmethod
    def get_full_relations_options():
        """Full options - load all relationships for complete response"""
        return [
            selectinload(BaseProperty.media),
            selectinload(BaseProperty.documents),
            selectinload(BaseProperty.contact_person_media).joinedload(ContactPersonMedia.file_asset),
            joinedload(BaseProperty.user),
            joinedload(BaseProperty.contact_person),
        ]

    @staticmethod
    def get_full_relations_options_nested(relationship_attr):
        """Same relation set as get_full_relations_options(), anchored under
        a parent relationship instead of BaseProperty directly - for callers
        that reach a property through a join table (e.g.
        CustomerSavedProperty.property, PropertyRequest.property) and still
        need every relation ProfileService.to_response touches eagerly
        loaded, to avoid a MissingGreenlet lazy-load error outside the
        request's async context."""
        return [
            relationship_attr.selectinload(BaseProperty.media),
            relationship_attr.selectinload(BaseProperty.documents),
            relationship_attr.selectinload(BaseProperty.contact_person_media).joinedload(ContactPersonMedia.file_asset),
            relationship_attr.joinedload(BaseProperty.contact_person),
        ]

    def _sanitize_property_data(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Filter property payload down to columns supported by the base property model."""
        if not property_data:
            return {}

        allowed_fields = {
            "id",
            "user_id",
            "posted_by",
            "listing_purpose",
            "property_category",
            "property_type",
            "property_title",
            "bedrooms",
            "bathrooms",
            "floor_number",
            "total_floors",
            "property_age",
            "property_age_range",
            "corner_unit",
            "facing_direction",
            "built_up_area",
            "carpet_area",
            "garden_space",
            "address",
            "area",
            "city",
            "district",
            "state",
            "pin_code",
            "landmark",
            "furnishing_status",
            "terrace",
            "balcony",
            "interior_features",
            "parking",
            "parking_capacity",
            "amenities",
            "nearby_places",
            "nearby_connectivity",
            "tenant_type",
            "smoking_allowed",
            "dietary_preference",
            "pet_friendly",
            "available_from",
            "immediate_move_in",
            "minimum_duration",
            "expected_price",
            "price_min",
            "price_max",
            "price_negotiable",
            "security_deposit",
            "maintenance_included",
            "maintenance_amount",
            "ownership_type",
            "loan_outstanding",
            "property_condition",
            "status",
            "property_tax",
            "title_deed_verify",
            "underconstruction",
            "immediate_possession",
            "rera_approved",
            "loan_eligible",
            "renewable_option",
            "furnishing_status",
            "floor_number",
            "total_floors",
            "property_age",
            "property_age_range",
            "facing_direction",
            "parking_capacity",
            "maintenance_amount",
            "security_deposit",
            "price_negotiable",
            "loan_eligible",
            "loan_outstanding",
            "property_condition",
            "price_min",
            "price_max",
            "lease_terms",
            "minimum_duration",
            "tenant_type",
            "pet_friendly",
            "available_from",
            "sub_category",
            "hostel_type",
            "room_type",
            "sharing_type",
            "total_capacity",
            "hostel_category",
            "gender_type",
            "food_included",
            "food_type",
            "meals_per_day",
            "kitchen_access",
            "bathroom_type",
            "utilities_included",
            "alcohol_allowed",
            "land_area",
            "land_area_min",
            "land_area_max",
            "area_unit",
            "land_shape",
            "road_width",
            "water_source",
            "soil_type",
            "electricity_available",
            "selected_feature",
            "payment_mode",
            "construction_status",
            "possession_timeline",
            "ready_to_buy",
            "rental_term",
            "rental_frequency",
            "minimum_stay_duration",
            "payment_frequency",
            "commercial_type",
            "business_type",
            "estimated_footfall",
            "operating_hours",
            "lease_type",
            "lease_terms",
            "fit_out",
            "ceiling_height",
            "frontage_width",
            "power_load_capacity",
            "appliance_included",
            "property_status",
            "status",
        }

        sanitized = {}
        for key, value in property_data.items():
            if key not in allowed_fields:
                continue
            # bedrooms/bathrooms is an Integer column, but the vendor-facing
            # BHK pills send strings like "studio"/"2bhk"/"4 BHK+" - convert
            # here rather than letting a non-numeric string reach the insert.
            if key in ("bedrooms", "bathrooms") and not isinstance(value, int):
                value = bhk_token_to_int(value)
            sanitized[key] = value

        return sanitized

    # ============================================
    # CREATE OPERATIONS
    # ============================================

    async def create_property(
        self,
        posted_by: str,
        property_data: Dict[str, Any],
        user_id: str,
    ) -> BaseProperty:

        property_id = await IDGenerator.generate_property_id(
            db=self.db,
            category=posted_by,
            user_id=user_id,
        )
        if property_id and "id" not in property_data:
            property_data["id"] = property_id
        sanitized_property_data = self._sanitize_property_data(property_data)
        property_obj = BaseProperty(**sanitized_property_data)

        self.db.add(property_obj)
        await self.db.flush()
        await self.db.refresh(property_obj)

        """
        # 1. At Initial Stage of this project on frontend they were listing all the vendor type profile without any condition
            so i design my backend when vendor list their property using form with using of posted_by field and 
            i will check if user has this vendor type in their profile or not 
            if not then i will add this vendor type in their profile so that they can access that vendor profile with specific property listing
            now they included the vendor type at registeration stage so i will comment this code. promote one user_id, one profile as logic """

        # user = await self.db.get(User, user_id)
        # if user and posted_by not in (user.vendor_types or []):
        #     user.vendor_types = [*(user.vendor_types or []), posted_by]
        #     await self.db.flush()

        # print(f"vendor roles: {user.vendor_types[0]}")

        # 2. Create role-specific details based on posted_by
        await self._create_role_specific_details(
            property_id=property_obj.id,
            posted_by=posted_by,
            property_data=property_data,
            user_id=user_id,
        )

        # 3. Commit all changes
        await self.db.commit()
        await self.db.refresh(property_obj)

        return property_obj

    async def _create_role_specific_details(
        self,
        property_id: int,
        posted_by: str,
        property_data: Dict[str, Any],
        user_id: str,
    ):
        """Create this property's contact-person row (property_contact_persons -
        replaces the old per-role owner_properties/agent_properties/
        builder_properties/property_management_properties tables). The contact
        person's photo/logo is never set here - it is created afterward,
        through contact_person_media_service (see PropertyService._process_vendor_profile_images).

        property_data still uses each role's old field-name vocabulary
        (owner_name/agent_name/name, vendor_city, owner_pin_code, ...) - see
        app.models.property_contact.CONTACT_FIELD_ROUTES for where each one
        lands on the unified row, so callers upstream of this method don't
        all need rewriting at once.
        """
        if posted_by not in VALID_VENDOR_TYPES:
            return
        contact = PropertyContactPerson(
            property_id=property_id, user_id=user_id, vendor_type=posted_by,
            bank_details={}, social_links={}, role_details={},
        )
        apply_contact_fields(contact, property_data)
        contact.declaration_accepted = bool(property_data.get('declaration_accepted', False))
        self.db.add(contact)

    async def create_property_media(self, media_data: Dict[str, Any]) -> PropertyMedia:
        """Save media file metadata to database.

        Flush-only, not commit - callers (e.g. PropertyService.create_property)
        create several of these in a loop and rely on ONE trailing commit for
        atomicity. Committing per-row here meant image 1-of-5 was already
        permanently saved even if image 3-of-5 then failed and the whole
        create_property call raised - a partial property/media set survived
        an operation the API reported as a total failure.
        """
        media_obj = PropertyMedia(**media_data)
        self.db.add(media_obj)
        await self.db.flush()
        await self.db.refresh(media_obj)
        return media_obj

    async def create_property_document(self, doc_data: Dict[str, Any]) -> PropertyDocument:
        """Save document metadata to database. Flush-only - see create_property_media."""
        doc_obj = PropertyDocument(**doc_data)
        self.db.add(doc_obj)
        await self.db.flush()
        await self.db.refresh(doc_obj)
        return doc_obj

    # ============================================
    # READ OPERATIONS
    # ============================================

    async def get_property_by_id(self, property_id: int) -> Optional[BaseProperty]:
        """Get a property by ID without relations"""
        result = await self.db.execute(
            select(BaseProperty).where(BaseProperty.id == property_id)
        )
        return result.scalar_one_or_none()

    async def get_property_with_relations(self, property_id: int) -> Optional[BaseProperty]:
        result = await self.db.execute(
            select(BaseProperty)
            .options(*self.get_detail_view_options())
            .where(BaseProperty.id == property_id)
        )
        return result.unique().scalar_one_or_none()

    async def get_all_properties(
        self,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = "Active"
    ) -> List[BaseProperty]:
        """Get all properties with pagination - optimized loading"""
        query = select(BaseProperty)

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_list_view_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_total_property_count(self, status: Optional[str] = "Active") -> int:
        """Get total count of properties"""
        query = select(func.count()).select_from(BaseProperty)
        if status:
            query = query.where(BaseProperty.status == status)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def filter_properties(self, filter_data) -> Tuple[List[BaseProperty], int]:
        """DEPRECATED - superseded by FilterService._build_query. Not wired to any route."""
        raise NotImplementedError("Use FilterService._build_query / .run instead")

        query = select(BaseProperty)
        count_query = select(func.count()).select_from(BaseProperty)

        filters = []

        if filter_data.posted_by:
            filters.append(BaseProperty.posted_by.in_(filter_data.posted_by))

        if filter_data.listing_purpose:
            filters.append(BaseProperty.listing_purpose == filter_data.listing_purpose)

        if filter_data.property_category:
            filters.append(BaseProperty.property_category == filter_data.property_category)

        if filter_data.property_type:
            filters.append(BaseProperty.property_type == filter_data.property_type)

        if filter_data.preferred_location:
            filters.append(
                or_(
                    BaseProperty.area.ilike(f"%{filter_data.preferred_location}%"),
                    BaseProperty.city.ilike(f"%{filter_data.preferred_location}%"),
                    BaseProperty.district.ilike(f"%{filter_data.preferred_location}%")
                )
            )

        if filter_data.state:
            filters.append(BaseProperty.state.ilike(f"%{filter_data.state}%"))

        if filter_data.pincode:
            filters.append(BaseProperty.pin_code == filter_data.pincode)

        if filter_data.budget_range:
            if filter_data.budget_range.min is not None:
                filters.append(
                    or_(
                        BaseProperty.price_min >= float(filter_data.budget_range.min),
                        BaseProperty.expected_price >= float(filter_data.budget_range.min)
                    )
                )
            if filter_data.budget_range.max is not None:
                filters.append(
                    or_(
                        BaseProperty.price_max <= float(filter_data.budget_range.max),
                        BaseProperty.expected_price <= float(filter_data.budget_range.max)
                    )
                )

        if filter_data.monthly_rent_budget:
            if filter_data.monthly_rent_budget.min is not None:
                filters.append(BaseProperty.price_min >= float(filter_data.monthly_rent_budget.min))
            if filter_data.monthly_rent_budget.max is not None:
                filters.append(BaseProperty.price_max <= float(filter_data.monthly_rent_budget.max))

        if filter_data.lease_budget:
            if filter_data.lease_budget.min is not None:
                filters.append(BaseProperty.expected_price >= float(filter_data.lease_budget.min))
            if filter_data.lease_budget.max is not None:
                filters.append(BaseProperty.expected_price <= float(filter_data.lease_budget.max))

        if filter_data.bedrooms:
            filters.append(BaseProperty.bedrooms.in_([int(b) for b in filter_data.bedrooms]))

        if filter_data.bathrooms:
            filters.append(BaseProperty.bathrooms.in_([int(b) for b in filter_data.bathrooms]))

        if filter_data.furnishing_type:
            filters.append(BaseProperty.furnishing_status.ilike(f"%{filter_data.furnishing_type}%"))

        if filter_data.parking is not None:
            filters.append(BaseProperty.parking == ("Yes" if filter_data.parking > 0 else "No"))

        if filter_data.builtup_area:
            if filter_data.builtup_area.min is not None:
                filters.append(BaseProperty.built_up_area >= int(filter_data.builtup_area.min))
            if filter_data.builtup_area.max is not None:
                filters.append(BaseProperty.built_up_area <= int(filter_data.builtup_area.max))

        if filter_data.carpet_area:
            if filter_data.carpet_area.min is not None:
                filters.append(BaseProperty.carpet_area >= int(filter_data.carpet_area.min))
            if filter_data.carpet_area.max is not None:
                filters.append(BaseProperty.carpet_area <= int(filter_data.carpet_area.max))

        if filter_data.plot_size:
            if filter_data.plot_size.min is not None:
                filters.append(BaseProperty.land_area_min >= int(filter_data.plot_size.min))
            if filter_data.plot_size.max is not None:
                filters.append(BaseProperty.land_area_max <= int(filter_data.plot_size.max))

        if filter_data.garden_space:
            filters.append(BaseProperty.garden_space.ilike(f"%{filter_data.garden_space}%"))

        if filter_data.terrace:
            filters.append(BaseProperty.terrace.ilike(f"%{filter_data.terrace}%"))

        if filter_data.floor_preference:
            filters.append(BaseProperty.floor_number == filter_data.floor_preference)

        if filter_data.balcony:
            filters.append(BaseProperty.balcony.ilike(f"%{filter_data.balcony}%"))

        if filter_data.facing_preference:
            filters.append(BaseProperty.facing_direction.ilike(f"%{filter_data.facing_preference}%"))

        if filter_data.floor_number:
            filters.append(BaseProperty.floor_number == filter_data.floor_number)

        if filter_data.total_floors:
            filters.append(BaseProperty.total_floors == filter_data.total_floors)

        if filter_data.amenities:
            for amenity in filter_data.amenities:
                filters.append(BaseProperty.amenities.contains([amenity]))

        if filter_data.home_loan_required:
            filters.append(BaseProperty.loan_eligible == filter_data.home_loan_required)

        if filter_data.move_in_date:
            filters.append(BaseProperty.available_from <= str(filter_data.move_in_date))

        if filter_data.tenant_type:
            filters.append(BaseProperty.tenant_type.contains([filter_data.tenant_type]))

        if filter_data.rental_duration:
            filters.append(BaseProperty.minimum_duration.ilike(f"%{filter_data.rental_duration}%"))

        if filter_data.pet_friendly:
            filters.append(BaseProperty.pet_friendly.ilike(f"%{filter_data.pet_friendly}%"))

        if filter_data.security_deposit:
            if filter_data.security_deposit.min is not None:
                filters.append(BaseProperty.security_deposit >= filter_data.security_deposit.min)
            if filter_data.security_deposit.max is not None:
                filters.append(BaseProperty.security_deposit <= filter_data.security_deposit.max)

        if filter_data.ownership_type:
            filters.append(BaseProperty.ownership_type.ilike(f"%{filter_data.ownership_type}%"))

        if filter_data.property_age:
            filters.append(BaseProperty.property_age == int(filter_data.property_age))

        if filter_data.property_condition:
            filters.append(BaseProperty.property_condition.ilike(f"%{filter_data.property_condition}%"))

        if filter_data.floor_count:
            filters.append(BaseProperty.total_floors == filter_data.floor_count)

        if filter_data.is_negotiable:
            filters.append(BaseProperty.price_negotiable.ilike(f"%{filter_data.is_negotiable}%"))

        if filter_data.loan_outstanding:
            filters.append(BaseProperty.loan_outstanding.ilike(f"%{filter_data.loan_outstanding}%"))

        if filter_data.advance_deposit:
            if filter_data.advance_deposit.min is not None:
                filters.append(BaseProperty.security_deposit >= filter_data.advance_deposit.min)
            if filter_data.advance_deposit.max is not None:
                filters.append(BaseProperty.security_deposit <= filter_data.advance_deposit.max)

        if filter_data.lease_duration:
            filters.append(BaseProperty.minimum_duration.ilike(f"%{filter_data.lease_duration}%"))

        if filters:
            query = query.where(and_(*filters))
            count_query = count_query.where(and_(*filters))

        if filter_data.sort_by:
            sort_field = getattr(BaseProperty, filter_data.sort_by, None)
            if sort_field:
                if filter_data.sort_order == "desc":
                    query = query.order_by(desc(sort_field))
                else:
                    query = query.order_by(asc(sort_field))
        else:
            query = query.order_by(desc(BaseProperty.created_at))

        skip = (filter_data.page - 1) * filter_data.limit
        query = query.offset(skip).limit(filter_data.limit)

        query = query.options(*self.get_full_relations_options())

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)

        properties = result.unique().scalars().all()
        total_count = count_result.scalar() or 0

        return properties, total_count

    async def get_properties_by_posted_by(
        self,
        posted_by: str,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = "Active"
    ) -> List[BaseProperty]:
        """Get properties by posted_by with all relations loaded"""
        query = select(BaseProperty).where(BaseProperty.posted_by == posted_by)

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_count_by_posted_by(
        self,
        posted_by: str,
        status: Optional[str] = "Active"
    ) -> int:
        """Get total count by posted_by"""
        query = select(func.count()).select_from(BaseProperty)
        query = query.where(BaseProperty.posted_by == posted_by)

        if status:
            query = query.where(BaseProperty.status == status)

        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_properties_by_posted_by_multiple(
        self,
        posted_by: List[str],
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = "Active"
    ) -> List[BaseProperty]:
        """Get properties by multiple posted_by values with all relations loaded"""
        query = select(BaseProperty).where(BaseProperty.posted_by.in_(posted_by))

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_properties_by_category(
        self,
        property_category: str,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = "Active"
    ) -> List[BaseProperty]:
        """Get properties by category with all relations loaded"""
        normalized_category = property_category.strip().upper()

        valid_categories = [e.value for e in PropertyCategory]
        if normalized_category not in valid_categories:
            raise ValueError(
                f"Invalid property_category: '{property_category}'. "
                f"Must be one of: {', '.join(valid_categories)}"
            )

        query = select(BaseProperty).where(
            BaseProperty.property_category == normalized_category
        )

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_properties_by_sub_category(
        self,
        sub_category: str,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = "Active"
    ) -> List[BaseProperty]:
        """Get properties by sub category with all relations loaded"""
        query = select(BaseProperty).where(
            BaseProperty.sub_category == sub_category
        )

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_count_by_sub_category(
        self,
        sub_category: str,
        status: Optional[str] = "Active"
    ) -> int:
        normalized_sub_category = sub_category.strip()

        query = select(func.count()).select_from(BaseProperty)
        query = query.where(BaseProperty.sub_category == normalized_sub_category)

        if status:
            query = query.where(BaseProperty.status == status)

        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_count_by_category(
        self,
        property_category: str,
        status: Optional[str] = "Active"
    ) -> int:
        """Get count by category"""
        normalized_category = property_category.strip().upper()

        valid_categories = [e.value for e in PropertyCategory]
        if normalized_category not in valid_categories:
            raise ValueError(
                f"Invalid property_category: '{property_category}'. "
                f"Must be one of: {', '.join(valid_categories)}"
            )

        query = select(func.count()).select_from(BaseProperty)
        query = query.where(BaseProperty.property_category == normalized_category)

        if status:
            query = query.where(BaseProperty.status == status)

        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_properties_by_property_type(
        self,
        property_type: str,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None
    ) -> List[BaseProperty]:
        """Get properties by property type with all relations loaded"""
        query = select(BaseProperty).where(BaseProperty.property_type == property_type)

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_count_by_property_type(
        self,
        property_type: str,
        status: Optional[str] = "Active"
    ) -> int:
        """Get count of properties by property type"""
        query = select(func.count()).select_from(BaseProperty).where(
            BaseProperty.property_type == property_type
        )
        if status:
            query = query.where(BaseProperty.status == status)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_properties_by_purpose(
        self,
        listing_purpose: str,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = "Active"
    ) -> List[BaseProperty]:
        """Get properties by listing purpose with all relations loaded"""
        query = select(BaseProperty).where(BaseProperty.listing_purpose == listing_purpose)

        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_count_by_purpose(
        self,
        listing_purpose: str,
        status: Optional[str] = "Active"
    ) -> int:
        """Get count of properties by listing purpose"""
        query = select(func.count()).select_from(BaseProperty).where(
            BaseProperty.listing_purpose == listing_purpose
        )
        if status:
            query = query.where(BaseProperty.status == status)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_property_by_user_id(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
    ) -> List[BaseProperty]:
        """Get properties by user id with all relations loaded"""
        query = select(BaseProperty).where(BaseProperty.user_id == user_id)


        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_count_by_user_id_property(
        self,
        user_id: str,
        status: Optional[str] = "Active"
    ) -> int:
        query = select(func.count()).select_from(BaseProperty).where(
            BaseProperty.user_id == user_id)
        if status:
            query = query.where(BaseProperty.status == status)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def get_properties_by_user_and_role(
        self,
        user_id: str,
        posted_by: PostedBy,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None,
    ) -> List[BaseProperty]:
        """Get this user's properties, restricted to one vendor role."""
        query = select(BaseProperty).where(
            and_(
                BaseProperty.user_id == user_id,
                BaseProperty.posted_by == posted_by.value,
            )
        )
        if status:
            query = query.where(BaseProperty.status == status)

        query = query.options(*self.get_full_relations_options())
        query = query.order_by(desc(BaseProperty.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        return result.unique().scalars().all()

    async def get_count_by_user_and_role(
        self,
        user_id: str,
        posted_by: PostedBy,
        status: Optional[str] = None,
    ) -> int:
        query = select(func.count()).select_from(BaseProperty).where(
            and_(
                BaseProperty.user_id == user_id,
                BaseProperty.posted_by == posted_by.value,
            )
        )
        if status:
            query = query.where(BaseProperty.status == status)
        result = await self.db.execute(query)
        return result.scalar() or 0

    async def search_user_properties(
        self,
        user_id: str,
        posted_by: PostedBy,
        keyword: Optional[str],
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[BaseProperty], int]:
        filters = [
            BaseProperty.user_id == user_id,
            BaseProperty.posted_by == posted_by.value,
        ]
        if keyword:
            like = f"%{keyword}%"
            filters.append(
                or_(
                    BaseProperty.property_title.ilike(like),
                    BaseProperty.city.ilike(like),
                    BaseProperty.area.ilike(like),
                    BaseProperty.address.ilike(like),
                    BaseProperty.landmark.ilike(like),
                )
            )

        query = (
            select(BaseProperty)
            .where(and_(*filters))
            .options(*self.get_full_relations_options())
            .order_by(desc(BaseProperty.created_at))
            .offset(skip)
            .limit(limit)
        )
        count_query = select(func.count()).select_from(BaseProperty).where(and_(*filters))

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)
        return result.unique().scalars().all(), (count_result.scalar() or 0)

    # ============================================
    # VENDOR DETAIL OPERATIONS
    # ============================================

    async def get_latest_vendor_detail(self, user_id: str, posted_by: PostedBy):
        last_touched = func.coalesce(PropertyContactPerson.updated_at, PropertyContactPerson.created_at)
        query = (
            select(PropertyContactPerson)
            .where(PropertyContactPerson.user_id == user_id, PropertyContactPerson.vendor_type == posted_by)
            .order_by(desc(last_touched))
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update_vendor_detail(
        self,
        user_id: str,
        posted_by: str,
        update_data: Dict[str, Any],
        property_id: Optional[str] = None,
    ):
        if property_id is not None:
            result = await self.db.execute(
                select(PropertyContactPerson).where(
                    PropertyContactPerson.property_id == property_id,
                    PropertyContactPerson.user_id == user_id,
                    PropertyContactPerson.vendor_type == posted_by,
                )
            )
            detail_obj = result.scalar_one_or_none()
        else:
            detail_obj = await self.get_latest_vendor_detail(user_id, posted_by)

        if not detail_obj:
            return None

        apply_contact_fields(detail_obj, update_data)

        await self.db.flush()
        await self.db.refresh(detail_obj)
        return detail_obj

    # ============================================
    # DOCUMENT ACCESS
    # ============================================

    async def get_document_by_id(self, document_id: int) -> Optional[PropertyDocument]:
        result = await self.db.execute(
            select(PropertyDocument).where(PropertyDocument.id == document_id)
        )
        return result.scalar_one_or_none()

    # ============================================
    # VENDOR DOCUMENT OPERATIONS
    # ============================================

    async def get_vendor_document(self, user_id: str, document_type: str) -> Optional[PropertyDocument]:
        query = select(PropertyDocument).where(
            and_(
                PropertyDocument.user_id == user_id,
                PropertyDocument.property_id.is_(None),
                PropertyDocument.document_type == document_type,
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_vendor_documents(self, user_id: str) -> List[PropertyDocument]:
        """All of this user's profile-level documents (not tied to any one
        property) - used to verify ownership before a delete-by-path call."""
        query = select(PropertyDocument).where(
            and_(
                PropertyDocument.user_id == user_id,
                PropertyDocument.property_id.is_(None),
            )
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def upsert_vendor_document(
        self,
        user_id: str,
        document_type: str,
        doc_data: Dict[str, Any],
    ) -> PropertyDocument:
        existing = await self.get_vendor_document(user_id, document_type)
        if existing:
            for key, value in doc_data.items():
                if hasattr(existing, key):
                    setattr(existing, key, value)
            await self.db.flush()
            await self.db.refresh(existing)
            return existing

        doc_data = dict(doc_data)
        doc_data["user_id"] = user_id
        doc_data["document_type"] = document_type
        doc_data["property_id"] = None
        doc_obj = PropertyDocument(**doc_data)
        self.db.add(doc_obj)
        await self.db.flush()
        await self.db.refresh(doc_obj)
        return doc_obj

    async def delete_vendor_document(self, user_id: str, document_type: str) -> bool:
        existing = await self.get_vendor_document(user_id, document_type)
        if not existing:
            return False
        await self.db.delete(existing)
        await self.db.flush()
        return True

    # ============================================
    # PROPERTY MEDIA OPERATIONS
    # ============================================

    async def get_media_by_id(self, media_id: int) -> Optional[PropertyMedia]:
        result = await self.db.execute(select(PropertyMedia).where(PropertyMedia.id == media_id))
        return result.scalar_one_or_none()

    async def delete_property_image_by_order(self, property_id: int, order_index: int) -> bool:
        """Delete the image at this display position (the `order` column),
        matching the {imageIndex} path param."""
        result = await self.db.execute(
            delete(PropertyMedia).where(
                and_(
                    PropertyMedia.property_id == property_id,
                    PropertyMedia.media_type == 'image',
                    PropertyMedia.order == order_index,
                )
            )
        )
        await self.db.flush()
        return result.rowcount > 0

    async def set_cover_image(self, property_id: int, media_id: int) -> Optional[PropertyMedia]:
        """Mark one image as primary/cover, unmarking any other image on
        this property."""
        media = await self.get_media_by_id(media_id)
        if not media or media.property_id != property_id or media.media_type != 'image':
            return None

        await self.db.execute(
            update(PropertyMedia)
            .where(
                and_(
                    PropertyMedia.property_id == property_id,
                    PropertyMedia.media_type == 'image',
                )
            )
            .values(is_primary=False)
        )
        await self.db.execute(
            update(PropertyMedia).where(PropertyMedia.id == media_id).values(is_primary=True)
        )
        await self.db.flush()
        await self.db.refresh(media)
        return media

    async def count_property_images(self, property_id: str, exclude_primary: bool = False) -> int:
        conditions = [
            PropertyMedia.property_id == property_id,
            PropertyMedia.media_type == 'image',
        ]
        if exclude_primary:
            # The cover image has its own dedicated slot and must never count
            # against the gallery's image cap.
            conditions.append(func.coalesce(PropertyMedia.is_primary, False) == False)
        result = await self.db.execute(select(func.count()).where(and_(*conditions)))
        return result.scalar() or 0

    async def unset_primary_images(self, property_id: str) -> None:
        """Clear is_primary on every existing image for this property - call
        before inserting a new image that should become the sole cover."""
        await self.db.execute(
            update(PropertyMedia)
            .where(
                and_(
                    PropertyMedia.property_id == property_id,
                    PropertyMedia.media_type == 'image',
                )
            )
            .values(is_primary=False)
        )
        await self.db.flush()

    async def delete_property_media(self, property_id: int):
        """Delete all media for a property"""
        await self.db.execute(
            delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
        )
        await self.db.flush()

    async def delete_property_video(self, property_id: int):
        """Delete video for a property"""
        await self.db.execute(
            delete(PropertyMedia)
            .where(
                and_(
                    PropertyMedia.property_id == property_id,
                    PropertyMedia.media_type == 'video'
                )
            )
        )
        await self.db.flush()

    # ============================================
    # UPDATE OPERATIONS
    # ============================================

    async def update_property(
        self,
        property_id: int,
        update_data: Dict[str, Any]
    ) -> Optional[BaseProperty]:
        """Update property data"""
        property_obj = await self.get_property_by_id(property_id)
        if property_obj:
            for key, value in update_data.items():
                if not hasattr(property_obj, key):
                    continue
                # bedrooms/bathrooms is an Integer column, but the vendor-facing
                # BHK pills send strings like "studio"/"2bhk"/"4 BHK+" - convert
                # here rather than letting a non-numeric string reach the update.
                if key in ("bedrooms", "bathrooms") and not isinstance(value, int):
                    value = bhk_token_to_int(value)
                setattr(property_obj, key, value)
            await self.db.flush()
            await self.db.refresh(property_obj)
            return property_obj
        return None

    async def update_role_specific_details(
        self,
        property_id: int,
        posted_by: PostedBy,
        update_data: Dict[str, Any],
    ):
        result = await self.db.execute(
            select(PropertyContactPerson).where(PropertyContactPerson.property_id == property_id)
        )
        detail_obj = result.scalar_one_or_none()
        if not detail_obj:
            return None

        apply_contact_fields(detail_obj, update_data)

        await self.db.flush()
        await self.db.refresh(detail_obj)
        return detail_obj

    async def update_property_status(
        self,
        property_id: int,
        status: str
    ) -> Optional[BaseProperty]:
        """Update property status (Active / Inactive)"""
        property_obj = await self.get_property_by_id(property_id)
        if property_obj:
            property_obj.status = status
            await self.db.flush()
            await self.db.refresh(property_obj)
            return property_obj
        return None

    # ============================================
    # DELETE OPERATIONS
    # ============================================

    async def delete_property(self, property_id: int) -> bool:
        """Delete property and all related records"""
        property_obj = await self.get_property_by_id(property_id)
        if not property_obj:
            return False

        await self.db.execute(
            delete(PropertyContactPerson).where(PropertyContactPerson.property_id == property_id)
        )

        await self.db.execute(
            delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
        )
        await self.db.execute(
            delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
        )

        await self.db.delete(property_obj)
        await self.db.flush()
        return True

    async def delete_property_documents(self, property_id: int):
        """Delete all documents for a property"""
        await self.db.execute(
            delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
        )
        await self.db.flush()




    # ============================================
    # PROPERTY MEDIA QUERY METHODS
    # ============================================

    async def get_property_media(self, property_id: str) -> List[PropertyMedia]:
        """Get all media for a property"""
        result = await self.db.execute(
            select(PropertyMedia)
            .where(PropertyMedia.property_id == property_id)
            .order_by(PropertyMedia.order)
        )
        return result.scalars().all()

    async def get_property_video(self, property_id: str) -> Optional[PropertyMedia]:
        """Get video for a property"""
        result = await self.db.execute(
            select(PropertyMedia)
            .where(
                and_(
                    PropertyMedia.property_id == property_id,
                    PropertyMedia.media_type == 'video'
                )
            )
        )
        return result.scalar_one_or_none()

    async def get_property_document_by_id(self, document_id: int) -> Optional[PropertyDocument]:
        """Get a property document by ID"""
        result = await self.db.execute(
            select(PropertyDocument).where(PropertyDocument.id == document_id)
        )
        return result.scalar_one_or_none()

    # ============================================
    # PROPERTY MEDIA DELETE METHODS
    # ============================================

    async def delete_property_media_by_id(self, media_id: int) -> bool:
        """Delete a specific media item by ID"""
        result = await self.db.execute(
            delete(PropertyMedia).where(PropertyMedia.id == media_id)
        )
        await self.db.flush()
        return result.rowcount > 0

    async def delete_property_document_by_id(self, document_id: int) -> bool:
        """Delete a specific document by ID"""
        result = await self.db.execute(
            delete(PropertyDocument).where(PropertyDocument.id == document_id)
        )
        await self.db.flush()
        return result.rowcount > 0

    # ============================================
    # VENDOR METHODS
    # ============================================

    async def get_user_vendor_types(self, user_id: str) -> List[str]:
        """Get vendor types for a user"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        return user.vendor_types if user else []

    async def get_latest_vendor_detail_by_user(self, user_id: str) -> Optional[Any]:
        """Get the latest vendor detail for a user, across any vendor_type."""
        query = (
            select(PropertyContactPerson)
            .where(PropertyContactPerson.user_id == user_id)
            .order_by(desc(PropertyContactPerson.created_at))
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_vendor_documents(self, user_id: str) -> List[PropertyDocument]:
        """Get all vendor documents"""
        result = await self.db.execute(
            select(PropertyDocument)
            .where(
                and_(
                    PropertyDocument.user_id == user_id,
                    PropertyDocument.property_id.is_(None)
                )
            )
            .order_by(PropertyDocument.created_at)
        )
        return result.scalars().all()

    async def commit(self):
        """Commit current transaction"""
        await self.db.commit()

    async def rollback(self):
        """Rollback current transaction"""
        await self.db.rollback()

    async def flush(self):
        """Flush current transaction"""
        await self.db.flush()
