# app/repositories/property_repository.py

from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update, and_, or_, desc, asc
from sqlalchemy.orm import selectinload, joinedload
from typing import Optional, List, Dict, Any, Tuple
from app.core.id_generator import IDGenerator
from app.models.property import BaseProperty, PropertyCategory, PostedBy
from app.models.property_agent import PropertyAgentDetails
from app.models.property_builder import PropertyBuilderDetails
from app.models.property_media import PropertyMedia
from app.models.property_document import PropertyDocument
from app.models.property_owner import OwnerProperty
from app.models.property_pm import PropertyManagementProperty
# from app.schemas.filter_schemas import PropertyFilter
from app.models.user import User
from app.schemas.property_filter import bhk_token_to_int

VENDOR_MODEL_MAP = {
    PostedBy.OWNER: OwnerProperty,
    PostedBy.AGENT: PropertyAgentDetails,
    PostedBy.BUILDER: PropertyBuilderDetails,
    PostedBy.PROPERTY_MANAGEMENT: PropertyManagementProperty,
}


class PropertyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def get_list_view_options():
        """Options for list view - only load what's needed for cards"""
        return [
            selectinload(BaseProperty.media),
            selectinload(BaseProperty.documents),
            joinedload(BaseProperty.user),
        ]

    @staticmethod
    def get_detail_view_options():
        """Options for detail view - load all relationships"""
        return [
            selectinload(BaseProperty.media),
            selectinload(BaseProperty.documents),
            joinedload(BaseProperty.user),
            joinedload(BaseProperty.owner_details),
            joinedload(BaseProperty.agent_details),
            joinedload(BaseProperty.builder_details),
            joinedload(BaseProperty.property_management_details),
        ]

    @staticmethod
    def get_full_relations_options():
        """Full options - load all relationships for complete response"""
        return [
            selectinload(BaseProperty.media),
            selectinload(BaseProperty.documents),
            joinedload(BaseProperty.user),
            joinedload(BaseProperty.owner_details),
            joinedload(BaseProperty.agent_details),
            joinedload(BaseProperty.builder_details),
            joinedload(BaseProperty.property_management_details),
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

        user = await self.db.get(User, user_id)
        if user and posted_by not in (user.vendor_types or []):
            user.vendor_types = [*(user.vendor_types or []), posted_by]
            await self.db.flush()

        print(f"vendor roles: {user.vendor_types[0]}")

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
        """Create role-specific details based on posted_by"""
        
        # Get profile image URLs from property_data if they exist
        profile_photo_url = property_data.get('profile_photo_url')
        agency_logo_url = property_data.get('agency_logo_url')
        company_logo_url = property_data.get('company_logo_url')

        if posted_by == 'OWNER':
            owner_detail = OwnerProperty(
                property_id=property_id,
                user_id=user_id,
                owner_name=property_data.get('owner_name'),
                date_of_birth=property_data.get('date_of_birth'),
                gender=property_data.get('gender'),
                aadhaar_number=property_data.get('aadhaar_number'),
                pan_number=property_data.get('pan_number'),
                mobile=property_data.get('mobile'),
                email_id=property_data.get('email_id'),
                address_line1=property_data.get('address_line1'),
                address_line2=property_data.get('address_line2'),
                owner_city=property_data.get('owner_city'),
                owner_district=property_data.get('owner_district'),
                owner_state=property_data.get('owner_state'),
                owner_pin_code=property_data.get('owner_pin_code'),
                preferred_contact_method=property_data.get('preferred_contact_method'),
                preferred_contact_time=property_data.get('preferred_contact_time'),
                profile_photo_url=profile_photo_url,
                bank_name=property_data.get('bank_name'),
                account_holder_name=property_data.get('account_holder_name'),
                account_number=property_data.get('account_number'),
                ifsc_code=property_data.get('ifsc_code'),
                upi_id=property_data.get('upi_id'),
                signature=property_data.get('signature'),
                signature_date=property_data.get('signature_date'),
                signature_place=property_data.get('signature_place'),
                declaration_accepted=property_data.get('declaration_accepted', False),
                additionalnote=property_data.get('additionalnote', '')
            )
            self.db.add(owner_detail)

        elif posted_by == 'AGENT':
            agent_detail = PropertyAgentDetails(
                property_id=property_id,
                user_id=user_id,
                agent_name=property_data.get('agent_name'),
                date_of_birth=property_data.get('date_of_birth'),
                gender=property_data.get('gender'),
                profile_photo_url=profile_photo_url,
                agency_logo_url=agency_logo_url,
                mobile=property_data.get('mobile'),
                email_id=property_data.get('email_id'),
                office_address=property_data.get('office_address'),
                address_line1=property_data.get('address_line1'),
                address_line2=property_data.get('address_line2'),
                agency_name=property_data.get('agency_name'),
                rera_registration_number=property_data.get('rera_registration_number'),
                gst_number=property_data.get('gst_number'),
                experience=property_data.get('experience'),
                active_listing=property_data.get('active_listing'),
                service_area=property_data.get('service_area'),
                aadhaar_number=property_data.get('aadhaar_number'),
                website=property_data.get('website'),
                facebook=property_data.get('facebook'),
                instagram=property_data.get('instagram'),
                linkedin=property_data.get('linkedin'),
                youtube=property_data.get('youtube'),
                bank_name=property_data.get('bank_name'),
                account_holder_name=property_data.get('account_holder_name'),
                account_number=property_data.get('account_number'),
                ifsc_code=property_data.get('ifsc_code'),
                upi_id=property_data.get('upi_id'),
                signature=property_data.get('signature'),
                signature_date=property_data.get('signature_date'),
                signature_place=property_data.get('signature_place'),
                declaration_accepted=property_data.get('declaration_accepted', False)
            )
            self.db.add(agent_detail)

        elif posted_by == 'BUILDER':
            builder_detail = PropertyBuilderDetails(
                property_id=property_id,
                user_id=user_id,
                name=property_data.get('name'),
                designation=property_data.get('designation'),
                mobile=property_data.get('mobile'),
                whatsapp_number=property_data.get('whatsapp_number'),
                email=property_data.get('email'),
                rera_registration_number=property_data.get('rera_registration_number'),
                gst_number=property_data.get('gst_number'),
                experience=property_data.get('experience'),
                aadhaar_number=property_data.get('aadhaar_number'),
                service_area=property_data.get('service_area'),
                pan_number=property_data.get('pan_number'),
                profile_photo_url=profile_photo_url,
                company_logo_url=company_logo_url,
                company_name=property_data.get('company_name'),
                company_reg_number=property_data.get('company_reg_number'),
                company_website=property_data.get('company_website'),
                company_description=property_data.get('company_description'),
                office_address=property_data.get('office_address'),
                city=property_data.get('city'),
                district=property_data.get('district'),
                state=property_data.get('state'),
                pincode=property_data.get('pincode'),
                landmark=property_data.get('landmark'),
                website=property_data.get('website'),
                facebook=property_data.get('facebook'),
                instagram=property_data.get('instagram'),
                linkedin=property_data.get('linkedin'),
                youtube=property_data.get('youtube'),
                bank_name=property_data.get('bank_name'),
                account_holder_name=property_data.get('account_holder_name'),
                account_number=property_data.get('account_number'),
                ifsc_code=property_data.get('ifsc_code'),
                upi_id=property_data.get('upi_id'),
                signature=property_data.get('signature'),
                signature_date=property_data.get('signature_date'),
                signature_place=property_data.get('signature_place'),
                declaration_accepted=property_data.get('declaration_accepted', False)
            )
            self.db.add(builder_detail)

        elif posted_by == 'PROPERTY_MANAGEMENT':
            pm_detail = PropertyManagementProperty(
                property_id=property_id,
                user_id=user_id,
                name=property_data.get('name'),
                designation=property_data.get('designation'),
                mobile=property_data.get('mobile'),
                whatsapp_number=property_data.get('whatsapp_number'),
                email=property_data.get('email'),
                rera_registration_number=property_data.get('rera_registration_number'),
                gst_number=property_data.get('gst_number'),
                experience=property_data.get('experience'),
                aadhaar_number=property_data.get('aadhaar_number'),
                service_area=property_data.get('service_area'),
                pan_number=property_data.get('pan_number'),
                profile_photo_url=profile_photo_url,
                company_logo_url=company_logo_url,
                company_name=property_data.get('company_name'),
                company_reg_number=property_data.get('company_reg_number'),
                company_website=property_data.get('company_website'),
                company_description=property_data.get('company_description'),
                office_address=property_data.get('office_address'),
                city=property_data.get('city'),
                district=property_data.get('district'),
                state=property_data.get('state'),
                pincode=property_data.get('pincode'),
                landmark=property_data.get('landmark'),
                website=property_data.get('website'),
                facebook=property_data.get('facebook'),
                instagram=property_data.get('instagram'),
                linkedin=property_data.get('linkedin'),
                youtube=property_data.get('youtube'),
                bank_name=property_data.get('bank_name'),
                account_holder_name=property_data.get('account_holder_name'),
                account_number=property_data.get('account_number'),
                ifsc_code=property_data.get('ifsc_code'),
                upi_id=property_data.get('upi_id'),
                signature=property_data.get('signature'),
                signature_date=property_data.get('signature_date'),
                signature_place=property_data.get('signature_place'),
                declaration_accepted=property_data.get('declaration_accepted', False)
            )
            self.db.add(pm_detail)

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
        print(f"no error till repo call to load data")
        result = await self.db.execute(
            select(BaseProperty)
            .options(*self.get_detail_view_options())
            .where(BaseProperty.id == property_id)
        )
        print(f"i'm causing")
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
        model = VENDOR_MODEL_MAP[posted_by]
        last_touched = func.coalesce(model.updated_at, model.created_at)
        query = (
            select(model)
            .where(model.user_id == user_id)
            .order_by(desc(last_touched))
            .limit(1)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_vendor_detail_for_property(self, property_id: str, posted_by: PostedBy, user_id: str):
        """This exact listing's vendor-detail row - distinct from
        get_latest_vendor_detail (user+role scoped, ignores which property)."""
        model = VENDOR_MODEL_MAP[posted_by]
        query = select(model).where(model.property_id == property_id, model.user_id == user_id)
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
            model = VENDOR_MODEL_MAP[posted_by]
            result = await self.db.execute(
                select(model).where(model.property_id == property_id, model.user_id == user_id)
            )
            detail_obj = result.scalar_one_or_none()
        else:
            detail_obj = await self.get_latest_vendor_detail(user_id, posted_by)

        if not detail_obj:
            return None

        protected = {"id", "property_id", "user_id", "created_at"}
        for key, value in update_data.items():
            if key in protected:
                continue
            if hasattr(detail_obj, key):
                setattr(detail_obj, key, value)

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
        model = VENDOR_MODEL_MAP[posted_by]
        result = await self.db.execute(select(model).where(model.property_id == property_id))
        detail_obj = result.scalar_one_or_none()
        if not detail_obj:
            return None

        protected = {"id", "property_id", "user_id", "created_at"}
        for key, value in update_data.items():
            if key in protected:
                continue
            if hasattr(detail_obj, key):
                setattr(detail_obj, key, value)

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
            delete(OwnerProperty).where(OwnerProperty.property_id == property_id)
        )
        await self.db.execute(
            delete(PropertyAgentDetails).where(PropertyAgentDetails.property_id == property_id)
        )
        await self.db.execute(
            delete(PropertyBuilderDetails).where(PropertyBuilderDetails.property_id == property_id)
        )
        await self.db.execute(
            delete(PropertyManagementProperty).where(PropertyManagementProperty.property_id == property_id)
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
        """Get the latest vendor detail for a user"""
        # Try each vendor type
        for model in VENDOR_MODEL_MAP.values():
            query = select(model).where(model.user_id == user_id).order_by(desc(model.created_at))
            result = await self.db.execute(query)
            vendor = result.scalar_one_or_none()
            if vendor:
                return vendor
        return None

    async def update_vendor_profile_image(
        self,
        user_id: str,
        db_column: str,
        image_url: Optional[str],
        property_id: str,
    ) -> None:
        """Update the poster-photo column on this one property's vendor-detail
        row. Scoped by property_id (not just user_id) - a vendor with
        multiple listings can have a different photo per listing."""
        for model in VENDOR_MODEL_MAP.values():
            if hasattr(model, db_column):
                await self.db.execute(
                    update(model)
                    .where(model.user_id == user_id, model.property_id == property_id)
                    .values({db_column: image_url})
                )
        await self.db.flush()

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















































































# from datetime import date, datetime

# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func, delete, update, and_, or_, desc, asc
# from sqlalchemy.orm import selectinload, joinedload
# from typing import Optional, List, Dict, Any, Tuple
# from app.core.id_generator import IDGenerator
# from app.models.property import BaseProperty, PropertyCategory, PostedBy
# from app.models.property_agent import PropertyAgentDetails
# from app.models.property_builder import PropertyBuilderDetails
# from app.models.property_media import PropertyMedia
# from app.models.property_document import PropertyDocument
# from app.models.property_owner import OwnerProperty
# from app.models.property_pm import PropertyManagementProperty
# from app.schemas.filter_schemas import PropertyFilter

# VENDOR_MODEL_MAP = {
#     PostedBy.OWNER: OwnerProperty,
#     PostedBy.AGENT: PropertyAgentDetails,
#     PostedBy.BUILDER: PropertyBuilderDetails,
#     PostedBy.PROPERTY_MANAGEMENT: PropertyManagementProperty,
# }


# class PropertyRepository:
#     def __init__(self, db: AsyncSession):
#         self.db = db

#     @staticmethod
#     def get_list_view_options():
#         """Options for list view - only load what's needed for cards"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),  # ✅ Load user for ownerName/contact
#         ]

#     @staticmethod
#     def get_detail_view_options():
#         """Options for detail view - load all relationships"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),  # ✅ Load user
#             joinedload(BaseProperty.owner_details),  # ✅ Load owner details
#             joinedload(BaseProperty.agent_details),  # ✅ Load agent details
#             joinedload(BaseProperty.builder_details),  # ✅ Load builder details
#             joinedload(BaseProperty.property_management_details),  # ✅ Load PM details
#         ]

#     @staticmethod
#     def get_full_relations_options():
#         """Full options - load all relationships for complete response"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),
#             joinedload(BaseProperty.owner_details),
#             joinedload(BaseProperty.agent_details),
#             joinedload(BaseProperty.builder_details),
#             joinedload(BaseProperty.property_management_details),
#         ]

#     def _sanitize_property_data(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
#         """Filter property payload down to columns supported by the base property model."""
#         if not property_data:
#             return {}

#         allowed_fields = {
#             "id",
#             "user_id",
#             "posted_by",
#             "listing_purpose",
#             "property_category",
#             "property_type",
#             "property_title",
#             "bedrooms",
#             "bathrooms",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "corner_unit",
#             "facing_direction",
#             "built_up_area",
#             "carpet_area",
#             "garden_space",
#             "address",
#             "area",
#             "city",
#             "district",
#             "state",
#             "pin_code",
#             "landmark",
#             "furnishing_status",
#             "terrace",
#             "balcony",
#             "interior_features",
#             "parking",
#             "parking_capacity",
#             "amenities",
#             "nearby_places",
#             "nearby_connectivity",
#             "tenant_type",
#             "smoking_allowed",
#             "dietary_preference",
#             "pet_friendly",
#             "available_from",
#             "immediate_move_in",
#             "minimum_duration",
#             "expected_price",
#             "price_min",
#             "price_max",
#             "price_negotiable",
#             "security_deposit",
#             "maintenance_included",
#             "maintenance_amount",
#             "ownership_type",
#             "loan_outstanding",
#             "property_condition",
#             "status",
#             "property_tax",
#             "title_deed_verify",
#             "underconstruction",
#             "immediate_possession",
#             "rera_approved",
#             "loan_eligible",
#             "renewable_option",
#             "furnishing_status",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "facing_direction",
#             "parking_capacity",
#             "maintenance_amount",
#             "security_deposit",
#             "price_negotiable",
#             "loan_eligible",
#             "loan_outstanding",
#             "property_condition",
#             "price_min",
#             "price_max",
#             "lease_terms",
#             "minimum_duration",
#             "tenant_type",
#             "pet_friendly",
#             "available_from",
#             "sub_category",
#             # NEW: hostel-specific
#             "hostel_type",
#             "room_type",
#             "sharing_type",
#             "total_capacity",
#             "hostel_category",
#             "gender_type",
#             "food_included",
#             "food_type",
#             "meals_per_day",
#             "kitchen_access",
#             "bathroom_type",
#             "utilities_included",
#             "alcohol_allowed",
#             # NEW: land/plot-specific
#             "land_area",
#             "land_area_min",
#             "land_area_max",
#             "area_unit",
#             "land_shape",
#             "road_width",
#             "water_source",
#             "soil_type",
#             "electricity_available",
#             "selected_feature",
#             "payment_mode",
#             "construction_status",
#             "possession_timeline",
#             "ready_to_buy",
#             # NEW: misc
#             "rental_term",
#             "rental_frequency",
#             "minimum_stay_duration",
#             "payment_frequency",
#         }

#         sanitized = {}
#         for key, value in property_data.items():
#             if key not in allowed_fields:
#                 continue

#             sanitized[key] = value

#         return sanitized

#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         user_id: str,
#     ) -> BaseProperty:

#         property_id = await IDGenerator.generate_property_id(
#             db=self.db,
#             category=posted_by,
#             user_id=user_id,
#         )
#         if property_id and "id" not in property_data:
#             property_data["id"] = property_id
#         sanitized_property_data = self._sanitize_property_data(property_data)
#         property_obj = BaseProperty(**sanitized_property_data)

#         self.db.add(property_obj)
#         await self.db.flush()
#         await self.db.refresh(property_obj)

#         # 2. Create role-specific details based on posted_by
#         await self._create_role_specific_details(
#             property_id=property_obj.id,
#             posted_by=posted_by,
#             property_data=property_data,
#             user_id=user_id,
#         )

#         # 3. Commit all changes
#         await self.db.commit()
#         await self.db.refresh(property_obj)

#         return property_obj

#     async def _create_role_specific_details(
#         self,
#         property_id: int,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         user_id: str,
#     ):
#         """Create role-specific details based on posted_by"""

#         if posted_by == 'OWNER':
#             owner_detail = OwnerProperty(
#                 property_id=property_id,
#                 user_id=user_id,
#                 owner_name=property_data.get('owner_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 aadhaar_number=property_data.get('aadhaar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 address_line1=property_data.get('address_line1'),
#                 address_line2=property_data.get('address_line2'),
#                 owner_city=property_data.get('city'),
#                 owner_state=property_data.get('state'),
#                 owner_pin_code=property_data.get('pin_code'),
#                 preferred_contact_method=property_data.get('preferred_contact_method'),
#                 preferred_contact_time=property_data.get('preferred_contact_time'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(owner_detail)

#         elif posted_by == 'AGENT':
#             agent_detail = PropertyAgentDetails(
#                 property_id=property_id,
#                 user_id=user_id,
#                 agent_name=property_data.get('agent_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 office_address=property_data.get('office_address'),
#                 agency_name=property_data.get('agency_name'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 active_listing=property_data.get('active_listing'),
#                 service_area=property_data.get('service_area'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(agent_detail)

#         elif posted_by == 'BUILDER':
#             builder_detail = PropertyBuilderDetails(
#                 property_id=property_id,
#                 user_id=user_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_description=property_data.get('company_description'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(builder_detail)

#         elif posted_by == 'PROPERTY_MANAGEMENT':
#             pm_detail = PropertyManagementProperty(
#                 property_id=property_id,
#                 user_id=user_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_description=property_data.get('company_description'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(pm_detail)

#     async def create_property_media(self, media_data: Dict[str, Any]) -> PropertyMedia:
#         """Save media file metadata to database"""
#         media_obj = PropertyMedia(**media_data)
#         self.db.add(media_obj)
#         await self.db.commit()
#         await self.db.refresh(media_obj)
#         return media_obj

#     async def create_property_document(self, doc_data: Dict[str, Any]) -> PropertyDocument:
#         """Save document metadata to database"""
#         doc_obj = PropertyDocument(**doc_data)
#         self.db.add(doc_obj)
#         await self.db.commit()
#         await self.db.refresh(doc_obj)
#         return doc_obj


#     async def get_property_by_id(self, property_id: int) -> Optional[BaseProperty]:
#         """Get a property by ID without relations"""
#         result = await self.db.execute(
#             select(BaseProperty).where(BaseProperty.id == property_id)
#         )
#         return result.scalar_one_or_none()

#     async def get_property_with_relations(self, property_id: int) -> Optional[BaseProperty]:
#         result = await self.db.execute(
#             select(BaseProperty)
#             .options(*self.get_detail_view_options())
#             .where(BaseProperty.id == property_id)
#         )
#         return result.unique().scalar_one_or_none()

#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get all properties with pagination - optimized loading"""
#         query = select(BaseProperty)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_list_view_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_total_property_count(self, status: Optional[str] = "Active") -> int:
#         """Get total count of properties"""
#         query = select(func.count()).select_from(BaseProperty)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0


#     async def filter_properties(
#         self,
#         filter_data: PropertyFilter
#     ) -> Tuple[List[BaseProperty], int]:
#         """Advanced filter with pagination - optimized loading"""

#         query = select(BaseProperty)
#         count_query = select(func.count()).select_from(BaseProperty)

#         filters = []

#         if filter_data.posted_by:
#             filters.append(BaseProperty.posted_by.in_(filter_data.posted_by))

#         if filter_data.listing_purpose:
#             filters.append(BaseProperty.listing_purpose == filter_data.listing_purpose)

#         if filter_data.property_category:
#             filters.append(BaseProperty.property_category == filter_data.property_category)

#         if filter_data.property_type:
#             filters.append(BaseProperty.property_type == filter_data.property_type)

#         if filter_data.preferred_location:
#             filters.append(
#                 or_(
#                     BaseProperty.area.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.city.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.district.ilike(f"%{filter_data.preferred_location}%")
#                 )
#             )

#         if filter_data.state:
#             filters.append(BaseProperty.state.ilike(f"%{filter_data.state}%"))

#         if filter_data.pincode:
#             filters.append(BaseProperty.pin_code == filter_data.pincode)

#         if filter_data.budget_range:
#             if filter_data.budget_range.min is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_min >= float(filter_data.budget_range.min),
#                         BaseProperty.expected_price >= float(filter_data.budget_range.min)
#                     )
#                 )
#             if filter_data.budget_range.max is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_max <= float(filter_data.budget_range.max),
#                         BaseProperty.expected_price <= float(filter_data.budget_range.max)
#                     )
#                 )

#         if filter_data.monthly_rent_budget:
#             if filter_data.monthly_rent_budget.min is not None:
#                 filters.append(BaseProperty.price_min >= float(filter_data.monthly_rent_budget.min))
#             if filter_data.monthly_rent_budget.max is not None:
#                 filters.append(BaseProperty.price_max <= float(filter_data.monthly_rent_budget.max))

#         if filter_data.lease_budget:
#             if filter_data.lease_budget.min is not None:
#                 filters.append(BaseProperty.expected_price >= float(filter_data.lease_budget.min))
#             if filter_data.lease_budget.max is not None:
#                 filters.append(BaseProperty.expected_price <= float(filter_data.lease_budget.max))

#         # bedrooms/bathrooms are now Integer columns.
#         if filter_data.bedrooms:
#             filters.append(BaseProperty.bedrooms.in_([int(b) for b in filter_data.bedrooms]))

#         if filter_data.bathrooms:
#             filters.append(BaseProperty.bathrooms.in_([int(b) for b in filter_data.bathrooms]))

#         if filter_data.furnishing_type:
#             filters.append(BaseProperty.furnishing_status.ilike(f"%{filter_data.furnishing_type}%"))

#         if filter_data.parking is not None:
#             filters.append(BaseProperty.parking == ("Yes" if filter_data.parking > 0 else "No"))

#         # built_up_area/carpet_area are now Integer columns.
#         if filter_data.builtup_area:
#             if filter_data.builtup_area.min is not None:
#                 filters.append(BaseProperty.built_up_area >= int(filter_data.builtup_area.min))
#             if filter_data.builtup_area.max is not None:
#                 filters.append(BaseProperty.built_up_area <= int(filter_data.builtup_area.max))

#         if filter_data.carpet_area:
#             if filter_data.carpet_area.min is not None:
#                 filters.append(BaseProperty.carpet_area >= int(filter_data.carpet_area.min))
#             if filter_data.carpet_area.max is not None:
#                 filters.append(BaseProperty.carpet_area <= int(filter_data.carpet_area.max))

#         if filter_data.plot_size:
#             if filter_data.plot_size.min is not None:
#                 filters.append(BaseProperty.land_area_min >= int(filter_data.plot_size.min))
#             if filter_data.plot_size.max is not None:
#                 filters.append(BaseProperty.land_area_max <= int(filter_data.plot_size.max))

#         if filter_data.garden_space:
#             filters.append(BaseProperty.garden_space.ilike(f"%{filter_data.garden_space}%"))

#         if filter_data.terrace:
#             filters.append(BaseProperty.terrace.ilike(f"%{filter_data.terrace}%"))

#         if filter_data.floor_preference:
#             # floor_number is now an Integer column - ilike doesn't apply to
#             # integers, so match on exact value instead of a substring.
#             filters.append(BaseProperty.floor_number == filter_data.floor_preference)

#         if filter_data.balcony:
#             filters.append(BaseProperty.balcony.ilike(f"%{filter_data.balcony}%"))

#         if filter_data.facing_preference:
#             filters.append(BaseProperty.facing_direction.ilike(f"%{filter_data.facing_preference}%"))

#         if filter_data.floor_number:
#             filters.append(BaseProperty.floor_number == filter_data.floor_number)

#         if filter_data.total_floors:
#             filters.append(BaseProperty.total_floors == filter_data.total_floors)

#         if filter_data.amenities:
#             for amenity in filter_data.amenities:
#                 filters.append(BaseProperty.amenities.contains([amenity]))

#         if filter_data.home_loan_required:
#             filters.append(BaseProperty.loan_eligible == filter_data.home_loan_required)

#         if filter_data.move_in_date:
#             filters.append(BaseProperty.available_from <= str(filter_data.move_in_date))

#         if filter_data.tenant_type:
#             filters.append(BaseProperty.tenant_type.contains([filter_data.tenant_type]))

#         if filter_data.rental_duration:
#             filters.append(BaseProperty.minimum_duration.ilike(f"%{filter_data.rental_duration}%"))

#         if filter_data.pet_friendly:
#             filters.append(BaseProperty.pet_friendly.ilike(f"%{filter_data.pet_friendly}%"))

#         if filter_data.security_deposit:
#             if filter_data.security_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.security_deposit.min)
#             if filter_data.security_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.security_deposit.max)

#         if filter_data.ownership_type:
#             filters.append(BaseProperty.ownership_type.ilike(f"%{filter_data.ownership_type}%"))

#         # property_age is now an Integer column.
#         if filter_data.property_age:
#             filters.append(BaseProperty.property_age == int(filter_data.property_age))

#         if filter_data.property_condition:
#             filters.append(BaseProperty.property_condition.ilike(f"%{filter_data.property_condition}%"))

#         if filter_data.floor_count:
#             filters.append(BaseProperty.total_floors == filter_data.floor_count)

#         if filter_data.is_negotiable:
#             filters.append(BaseProperty.price_negotiable.ilike(f"%{filter_data.is_negotiable}%"))

#         if filter_data.loan_outstanding:
#             filters.append(BaseProperty.loan_outstanding.ilike(f"%{filter_data.loan_outstanding}%"))

#         if filter_data.advance_deposit:
#             if filter_data.advance_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.advance_deposit.min)
#             if filter_data.advance_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.advance_deposit.max)

#         if filter_data.lease_duration:
#             filters.append(BaseProperty.minimum_duration.ilike(f"%{filter_data.lease_duration}%"))

#         if filters:
#             query = query.where(and_(*filters))
#             count_query = count_query.where(and_(*filters))

#         if filter_data.sort_by:
#             sort_field = getattr(BaseProperty, filter_data.sort_by, None)
#             if sort_field:
#                 if filter_data.sort_order == "desc":
#                     query = query.order_by(desc(sort_field))
#                 else:
#                     query = query.order_by(asc(sort_field))
#         else:
#             query = query.order_by(desc(BaseProperty.created_at))

#         skip = (filter_data.page - 1) * filter_data.limit
#         query = query.offset(skip).limit(filter_data.limit)

#         query = query.options(*self.get_full_relations_options())

#         result = await self.db.execute(query)
#         count_result = await self.db.execute(count_query)

#         properties = result.unique().scalars().all()
#         total_count = count_result.scalar() or 0

#         return properties, total_count


#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by posted_by with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.posted_by == posted_by)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_posted_by(
#         self,
#         posted_by: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get total count by posted_by"""
#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.posted_by == posted_by)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_posted_by_multiple(
#         self,
#         posted_by: List[str],
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by multiple posted_by values with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.posted_by.in_(posted_by))

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by category with all relations loaded"""
#         normalized_category = property_category.strip().upper()

#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )

#         query = select(BaseProperty).where(
#             BaseProperty.property_category == normalized_category
#         )

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_properties_by_sub_category(
#         self,
#         sub_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by sub category with all relations loaded"""
#         query = select(BaseProperty).where(
#             BaseProperty.sub_category == sub_category
#         )

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_sub_category(
#         self,
#         sub_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         normalized_sub_category = sub_category.strip()

#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.sub_category == normalized_sub_category)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_count_by_category(
#         self,
#         property_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count by category"""
#         normalized_category = property_category.strip().upper()

#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )

#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.property_category == normalized_category)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by property type with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.property_type == property_type)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_property_type(
#         self,
#         property_type: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by property type"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.property_type == property_type
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by listing purpose with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.listing_purpose == listing_purpose)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_purpose(
#         self,
#         listing_purpose: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by listing purpose"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.listing_purpose == listing_purpose
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_property_by_user_id(
#         self,
#         user_id: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by user id with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.user_id == user_id)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_user_id_property(
#         self,
#         user_id: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.user_id == user_id)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0


#     async def get_properties_by_user_and_role(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = None,
#     ) -> List[BaseProperty]:
#         """Get this user's properties, restricted to one vendor role."""
#         query = select(BaseProperty).where(
#             and_(
#                 BaseProperty.user_id == user_id,
#                 BaseProperty.posted_by == posted_by.value,
#             )
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_user_and_role(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         status: Optional[str] = None,
#     ) -> int:
#         query = select(func.count()).select_from(BaseProperty).where(
#             and_(
#                 BaseProperty.user_id == user_id,
#                 BaseProperty.posted_by == posted_by.value,
#             )
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def search_user_properties(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         keyword: Optional[str],
#         skip: int = 0,
#         limit: int = 20,
#     ) -> Tuple[List[BaseProperty], int]:
#         filters = [
#             BaseProperty.user_id == user_id,
#             BaseProperty.posted_by == posted_by.value,
#         ]
#         if keyword:
#             like = f"%{keyword}%"
#             filters.append(
#                 or_(
#                     BaseProperty.property_title.ilike(like),
#                     BaseProperty.city.ilike(like),
#                     BaseProperty.area.ilike(like),
#                     BaseProperty.address.ilike(like),
#                     BaseProperty.landmark.ilike(like),
#                 )
#             )

#         query = (
#             select(BaseProperty)
#             .where(and_(*filters))
#             .options(*self.get_full_relations_options())
#             .order_by(desc(BaseProperty.created_at))
#             .offset(skip)
#             .limit(limit)
#         )
#         count_query = select(func.count()).select_from(BaseProperty).where(and_(*filters))

#         result = await self.db.execute(query)
#         count_result = await self.db.execute(count_query)
#         return result.unique().scalars().all(), (count_result.scalar() or 0)


#     async def get_latest_vendor_detail(self, user_id: str, posted_by: PostedBy):
#         model = VENDOR_MODEL_MAP[posted_by]
#         last_touched = func.coalesce(model.updated_at, model.created_at)
#         query = (
#             select(model)
#             .where(model.user_id == user_id)
#             .order_by(desc(last_touched))
#             .limit(1)
#         )
#         result = await self.db.execute(query)
#         return result.scalar_one_or_none()

#     async def update_vendor_detail(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         update_data: Dict[str, Any],
#     ):
#         detail_obj = await self.get_latest_vendor_detail(user_id, posted_by)
#         if not detail_obj:
#             return None

#         protected = {"id", "property_id", "user_id", "created_at"}
#         for key, value in update_data.items():
#             if key in protected:
#                 continue
#             if hasattr(detail_obj, key):
#                 setattr(detail_obj, key, value)

#         await self.db.flush()
#         await self.db.refresh(detail_obj)
#         return detail_obj


#     async def get_vendor_document(self, user_id: str, document_type: str) -> Optional[PropertyDocument]:
#         query = select(PropertyDocument).where(
#             and_(
#                 PropertyDocument.user_id == user_id,
#                 PropertyDocument.property_id.is_(None),
#                 PropertyDocument.document_type == document_type,
#             )
#         )
#         result = await self.db.execute(query)
#         return result.scalar_one_or_none()

#     async def upsert_vendor_document(
#         self,
#         user_id: str,
#         document_type: str,
#         doc_data: Dict[str, Any],
#     ) -> PropertyDocument:
#         existing = await self.get_vendor_document(user_id, document_type)
#         if existing:
#             for key, value in doc_data.items():
#                 if hasattr(existing, key):
#                     setattr(existing, key, value)
#             await self.db.flush()
#             await self.db.refresh(existing)
#             return existing

#         doc_data = dict(doc_data)
#         doc_data["user_id"] = user_id
#         doc_data["document_type"] = document_type
#         doc_data["property_id"] = None
#         doc_obj = PropertyDocument(**doc_data)
#         self.db.add(doc_obj)
#         await self.db.flush()
#         await self.db.refresh(doc_obj)
#         return doc_obj

#     async def delete_vendor_document(self, user_id: str, document_type: str) -> bool:
#         existing = await self.get_vendor_document(user_id, document_type)
#         if not existing:
#             return False
#         await self.db.delete(existing)
#         await self.db.flush()
#         return True

#     async def get_media_by_id(self, media_id: int) -> Optional[PropertyMedia]:
#         result = await self.db.execute(select(PropertyMedia).where(PropertyMedia.id == media_id))
#         return result.scalar_one_or_none()

#     async def delete_property_image_by_order(self, property_id: int, order_index: int) -> bool:
#         """Delete the image at this display position (the `order` column),
#         matching the {imageIndex} path param."""
#         result = await self.db.execute(
#             delete(PropertyMedia).where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'image',
#                     PropertyMedia.order == order_index,
#                 )
#             )
#         )
#         await self.db.flush()
#         return result.rowcount > 0

#     async def set_cover_image(self, property_id: int, media_id: int) -> Optional[PropertyMedia]:
#         """Mark one image as primary/cover, unmarking any other image on
#         this property."""
#         media = await self.get_media_by_id(media_id)
#         if not media or media.property_id != property_id or media.media_type != 'image':
#             return None

#         await self.db.execute(
#             update(PropertyMedia)
#             .where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'image',
#                 )
#             )
#             .values(is_primary=False)
#         )
#         await self.db.execute(
#             update(PropertyMedia).where(PropertyMedia.id == media_id).values(is_primary=True)
#         )
#         await self.db.flush()
#         await self.db.refresh(media)
#         return media


#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any]
#     ) -> Optional[BaseProperty]:
#         """Update property data"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             for key, value in update_data.items():
#                 if hasattr(property_obj, key):
#                     setattr(property_obj, key, value)
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None

#     async def update_role_specific_details(
#         self,
#         property_id: int,
#         posted_by: PostedBy,
#         update_data: Dict[str, Any],
#     ):
#         model = VENDOR_MODEL_MAP[posted_by]
#         result = await self.db.execute(select(model).where(model.property_id == property_id))
#         detail_obj = result.scalar_one_or_none()
#         if not detail_obj:
#             return None

#         protected = {"id", "property_id", "user_id", "created_at"}
#         for key, value in update_data.items():
#             if key in protected:
#                 continue
#             if hasattr(detail_obj, key):
#                 setattr(detail_obj, key, value)

#         await self.db.flush()
#         await self.db.refresh(detail_obj)
#         return detail_obj

#     async def update_property_status(
#         self,
#         property_id: int,
#         status: str
#     ) -> Optional[BaseProperty]:
#         """Update property status"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             property_obj.status = status
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None

#     async def delete_property(self, property_id: int) -> bool:
#         """Delete property and all related records"""
#         property_obj = await self.get_property_by_id(property_id)
#         if not property_obj:
#             return False

#         await self.db.execute(
#             delete(OwnerProperty).where(OwnerProperty.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyAgentDetails).where(PropertyAgentDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyBuilderDetails).where(PropertyBuilderDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyManagementProperty).where(PropertyManagementProperty.property_id == property_id)
#         )

#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )

#         await self.db.delete(property_obj)
#         await self.db.flush()
#         return True

#     async def delete_property_media(self, property_id: int):
#         """Delete all media for a property"""
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.flush()

#     async def delete_property_video(self, property_id: int):
#         """Delete video for a property"""
#         await self.db.execute(
#             delete(PropertyMedia)
#             .where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'video'
#                 )
#             )
#         )
#         await self.db.flush()

#     async def delete_property_documents(self, property_id: int):
#         """Delete all documents for a property"""
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )
#         await self.db.flush()


#     async def commit(self):
#         """Commit current transaction"""
#         await self.db.commit()

#     async def rollback(self):
#         """Rollback current transaction"""
#         await self.db.rollback()

#     async def flush(self):
#         """Flush current transaction"""
#         await self.db.flush()






























# from datetime import date, datetime

# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func, delete, update, and_, or_, desc, asc
# from sqlalchemy.orm import selectinload, joinedload
# from typing import Optional, List, Dict, Any, Tuple
# from app.core.id_generator import IDGenerator
# from app.models.property import BaseProperty, PropertyCategory, PostedBy
# from app.models.property_agent import PropertyAgentDetails
# from app.models.property_builder import PropertyBuilderDetails
# from app.models.property_media import PropertyMedia
# from app.models.property_document import PropertyDocument
# from app.models.property_owner import OwnerProperty
# from app.models.property_pm import PropertyManagementProperty
# from app.models.user import User
# from app.schemas.filter_schemas import PropertyFilter


# VENDOR_MODEL_MAP = {
#     PostedBy.OWNER: OwnerProperty,
#     PostedBy.AGENT: PropertyAgentDetails,
#     PostedBy.BUILDER: PropertyBuilderDetails,
#     PostedBy.PROPERTY_MANAGEMENT: PropertyManagementProperty,
# }


# class PropertyRepository:
#     def __init__(self, db: AsyncSession):
#         self.db = db

#     # ============================================
#     # EAGER LOADING OPTIONS
#     # ============================================

#     @staticmethod
#     def get_list_view_options():
#         """Options for list view - only load what's needed for cards"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),  # ✅ Load user for ownerName/contact
#         ]

#     @staticmethod
#     def get_detail_view_options():
#         """Options for detail view - load all relationships"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),  # ✅ Load user
#             joinedload(BaseProperty.owner_details),  # ✅ Load owner details
#             joinedload(BaseProperty.agent_details),  # ✅ Load agent details
#             joinedload(BaseProperty.builder_details),  # ✅ Load builder details
#             joinedload(BaseProperty.property_management_details),  # ✅ Load PM details
#         ]

#     @staticmethod
#     def get_full_relations_options():
#         """Full options - load all relationships for complete response"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),
#             joinedload(BaseProperty.owner_details),
#             joinedload(BaseProperty.agent_details),
#             joinedload(BaseProperty.builder_details),
#             joinedload(BaseProperty.property_management_details),
#         ]

#     def _sanitize_property_data(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
#         """Filter property payload down to columns supported by the base property model."""
#         if not property_data:
#             return {}

#         allowed_fields = {
#             "id",
#             "user_id",
#             "posted_by",
#             "listing_purpose",
#             "property_category",
#             "property_type",
#             "property_title",
#             "bedrooms",
#             "bathrooms",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "corner_unit",
#             "facing_direction",
#             "built_up_area",
#             "carpet_area",
#             "garden_space",
#             "address",
#             "area",
#             "city",
#             "district",
#             "state",
#             "pin_code",
#             "landmark",
#             "furnishing_status",
#             "terrace_balcony",
#             "interior_features",
#             "parking",
#             "parking_capacity",
#             "amenities",
#             "nearby_access",
#             "nearby_connectivity",
#             "tenant_type",
#             "smoking_allowed",
#             "dietary_preference",
#             "pet_friendly",
#             "available_from",
#             "immediate_move_in",
#             "minimum_rental_duration",
#             "expected_price",
#             "price_min",
#             "price_max",
#             "price_negotiable",
#             "security_deposit",
#             "maintenance_included",
#             "maintenance_amount",
#             "ownership_type",
#             "loan_outstanding",
#             "property_condition",
#             "status",
#             "property_tax",
#             "title_deed_verify",
#             "underconstruction",
#             "immediate_possession",
#             "rera_approved",
#             "loan_eligible",
#             "lease_renewable",
#             "bedroom_filter",
#             "bathroom_filter",
#             "balcony",
#             "terrace",
#             "furnishing_status",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "facing_direction",
#             "parking_capacity",
#             "maintenance_amount",
#             "security_deposit",
#             "price_negotiable",
#             "loan_eligible",
#             "loan_outstanding",
#             "property_condition",
#             "price_min",
#             "price_max",
#             "lease_terms",
#             "minimum_rental_duration",
#             "tenant_type",
#             "pet_friendly",
#             "available_from",
#             "sub_category",
#         }

#         sanitized = {}
#         for key, value in property_data.items():
#             if key not in allowed_fields:
#                 continue

#             sanitized[key] = value

#         return sanitized

#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         user_id: str,
#     ) -> BaseProperty:

#         property_id = await IDGenerator.generate_property_id(
#             db=self.db,
#             category=posted_by,
#             user_id=user_id,
#         )
#         if property_id and "id" not in property_data:
#             property_data["id"] = property_id
#         sanitized_property_data = self._sanitize_property_data(property_data)
#         property_obj = BaseProperty(**sanitized_property_data)

#         self.db.add(property_obj)
#         await self.db.flush()
#         await self.db.refresh(property_obj)

        # user = await self.db.get(User, user_id)
        # if user and posted_by not in (user.vendor_types or []):
        #     user.vendor_types = [*(user.vendor_types or []), posted_by]
        #     await self.db.flush()

#         # 2. Create role-specific details based on posted_by
#         await self._create_role_specific_details(
#             property_id=property_obj.id,
#             posted_by=posted_by,
#             property_data=property_data,
#             user_id=user_id,
#         )

#         # 3. Commit all changes
#         await self.db.commit()
#         await self.db.refresh(property_obj)

#         return property_obj

#     async def _create_role_specific_details(
#         self,
#         property_id: int,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         user_id: str,
#     ):
#         """Create role-specific details based on posted_by"""

#         if posted_by == 'OWNER':
#             owner_detail = OwnerProperty(
#                 property_id=property_id,
#                 user_id=user_id,
#                 owner_name=property_data.get('owner_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 aadhaar_number=property_data.get('aadhaar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 address_line1=property_data.get('address_line1'),
#                 address_line2=property_data.get('address_line2'),
#                 owner_city=property_data.get('city'),
#                 owner_state=property_data.get('state'),
#                 owner_pin_code=property_data.get('pin_code'),
#                 preferred_contact_method=property_data.get('preferred_contact_method'),
#                 preferred_contact_time=property_data.get('preferred_contact_time'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(owner_detail)

#         elif posted_by == 'AGENT':
#             agent_detail = PropertyAgentDetails(
#                 property_id=property_id,
#                 user_id=user_id,
#                 agent_name=property_data.get('agent_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 office_address=property_data.get('office_address'),
#                 agency_name=property_data.get('agency_name'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 active_listing=property_data.get('active_listing'),
#                 service_area=property_data.get('service_area'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(agent_detail)

#         elif posted_by == 'BUILDER':
#             builder_detail = PropertyBuilderDetails(
#                 property_id=property_id,
#                 user_id=user_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_profile=property_data.get('company_profile'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(builder_detail)

#         elif posted_by == 'PROPERTY_MANAGEMENT':
#             pm_detail = PropertyManagementProperty(
#                 property_id=property_id,
#                 user_id=user_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_profile=property_data.get('company_profile'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(pm_detail)

#     async def create_property_media(self, media_data: Dict[str, Any]) -> PropertyMedia:
#         """Save media file metadata to database"""
#         media_obj = PropertyMedia(**media_data)
#         self.db.add(media_obj)
#         await self.db.commit()
#         await self.db.refresh(media_obj)
#         return media_obj

#     async def create_property_document(self, doc_data: Dict[str, Any]) -> PropertyDocument:
#         """Save document metadata to database"""
#         doc_obj = PropertyDocument(**doc_data)
#         self.db.add(doc_obj)
#         await self.db.commit()
#         await self.db.refresh(doc_obj)
#         return doc_obj

#     # ============================================
#     # READ OPERATIONS - WITH EAGER LOADING
#     # ============================================

#     async def get_property_by_id(self, property_id: int) -> Optional[BaseProperty]:
#         """Get a property by ID without relations"""
#         result = await self.db.execute(
#             select(BaseProperty).where(BaseProperty.id == property_id)
#         )
#         return result.scalar_one_or_none()

#     async def get_property_with_relations(self, property_id: int) -> Optional[BaseProperty]:
#         """
#         Get a property by ID with all relations loaded.
#         Uses selectinload for one-to-many (collections) and joinedload for one-to-one.
#         """
#         result = await self.db.execute(
#             select(BaseProperty)
#             .options(*self.get_detail_view_options())
#             .where(BaseProperty.id == property_id)
#         )
#         return result.unique().scalar_one_or_none()

#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get all properties with pagination - optimized loading"""
#         query = select(BaseProperty)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_list_view_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_total_property_count(self, status: Optional[str] = "Active") -> int:
#         """Get total count of properties"""
#         query = select(func.count()).select_from(BaseProperty)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     # ============================================
#     # FILTER OPERATIONS
#     # ============================================

#     async def filter_properties(
#         self,
#         filter_data: PropertyFilter
#     ) -> Tuple[List[BaseProperty], int]:
#         """Advanced filter with pagination - optimized loading"""

#         query = select(BaseProperty)
#         count_query = select(func.count()).select_from(BaseProperty)

#         filters = []

#         if filter_data.posted_by:
#             filters.append(BaseProperty.posted_by.in_(filter_data.posted_by))

#         if filter_data.listing_purpose:
#             filters.append(BaseProperty.listing_purpose == filter_data.listing_purpose)

#         if filter_data.property_category:
#             filters.append(BaseProperty.property_category == filter_data.property_category)

#         if filter_data.property_type:
#             filters.append(BaseProperty.property_type == filter_data.property_type)

#         if filter_data.preferred_location:
#             filters.append(
#                 or_(
#                     BaseProperty.area.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.city.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.district.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.state.ilike(f"%{filter_data.preferred_location}%"),
#                 )
#             )

#         if filter_data.state:
#             filters.append(BaseProperty.state.ilike(f"%{filter_data.state}%"))

#         if filter_data.pincode:
#             filters.append(BaseProperty.pin_code == filter_data.pincode)

#         if filter_data.budget_range:
#             if filter_data.budget_range.min is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_min >= str(filter_data.budget_range.min),
#                         BaseProperty.expected_price >= str(filter_data.budget_range.min)
#                     )
#                 )
#             if filter_data.budget_range.max is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_max <= str(filter_data.budget_range.max),
#                         BaseProperty.expected_price <= str(filter_data.budget_range.max)
#                     )
#                 )

#         if filter_data.monthly_rent_budget:
#             if filter_data.monthly_rent_budget.min is not None:
#                 filters.append(BaseProperty.price_min >= str(filter_data.monthly_rent_budget.min))
#             if filter_data.monthly_rent_budget.max is not None:
#                 filters.append(BaseProperty.price_max <= str(filter_data.monthly_rent_budget.max))

#         if filter_data.lease_budget:
#             if filter_data.lease_budget.min is not None:
#                 filters.append(BaseProperty.expected_price >= str(filter_data.lease_budget.min))
#             if filter_data.lease_budget.max is not None:
#                 filters.append(BaseProperty.expected_price <= str(filter_data.lease_budget.max))

#         if filter_data.bedrooms:
#             filters.append(BaseProperty.bedrooms.in_(filter_data.bedrooms))

#         if filter_data.bathrooms:
#             filters.append(BaseProperty.bathrooms.in_([str(b) for b in filter_data.bathrooms]))

#         if filter_data.furnishing_type:
#             filters.append(BaseProperty.furnishing_status.ilike(f"%{filter_data.furnishing_type}%"))

#         if filter_data.parking is not None:
#             filters.append(BaseProperty.parking == ("Yes" if filter_data.parking > 0 else "No"))

#         if filter_data.builtup_area:
#             if filter_data.builtup_area.min is not None:
#                 filters.append(BaseProperty.built_up_area >= str(filter_data.builtup_area.min))
#             if filter_data.builtup_area.max is not None:
#                 filters.append(BaseProperty.built_up_area <= str(filter_data.builtup_area.max))

#         if filter_data.carpet_area:
#             if filter_data.carpet_area.min is not None:
#                 filters.append(BaseProperty.carpet_area >= str(filter_data.carpet_area.min))
#             if filter_data.carpet_area.max is not None:
#                 filters.append(BaseProperty.carpet_area <= str(filter_data.carpet_area.max))

#         if filter_data.plot_size:
#             if filter_data.plot_size.min is not None:
#                 filters.append(BaseProperty.built_up_area >= str(filter_data.plot_size.min))
#             if filter_data.plot_size.max is not None:
#                 filters.append(BaseProperty.built_up_area <= str(filter_data.plot_size.max))

#         if filter_data.garden_space:
#             filters.append(BaseProperty.garden_space.ilike(f"%{filter_data.garden_space}%"))

#         if filter_data.terrace:
#             filters.append(BaseProperty.terrace_balcony.ilike(f"%{filter_data.terrace}%"))

#         if filter_data.floor_preference:
#             filters.append(BaseProperty.floor_number.ilike(f"%{filter_data.floor_preference}%"))

#         if filter_data.balcony:
#             filters.append(BaseProperty.terrace_balcony.ilike(f"%{filter_data.balcony}%"))

#         if filter_data.facing_preference:
#             filters.append(BaseProperty.facing_direction.ilike(f"%{filter_data.facing_preference}%"))

#         if filter_data.floor_number:
#             filters.append(BaseProperty.floor_number == filter_data.floor_number)

#         if filter_data.total_floors:
#             filters.append(BaseProperty.total_floors == filter_data.total_floors)

#         if filter_data.amenities:
#             for amenity in filter_data.amenities:
#                 filters.append(BaseProperty.amenities.contains([amenity]))

#         if filter_data.home_loan_required:
#             filters.append(BaseProperty.loan_eligible == filter_data.home_loan_required)

#         if filter_data.move_in_date:
#             filters.append(BaseProperty.available_from <= str(filter_data.move_in_date))

#         if filter_data.tenant_type:
#             filters.append(BaseProperty.tenant_type.contains([filter_data.tenant_type]))

#         if filter_data.rental_duration:
#             filters.append(BaseProperty.minimum_rental_duration.ilike(f"%{filter_data.rental_duration}%"))

#         if filter_data.pet_friendly:
#             filters.append(BaseProperty.pet_friendly.ilike(f"%{filter_data.pet_friendly}%"))

#         if filter_data.security_deposit:
#             if filter_data.security_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.security_deposit.min)
#             if filter_data.security_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.security_deposit.max)

#         if filter_data.ownership_type:
#             filters.append(BaseProperty.ownership_type.ilike(f"%{filter_data.ownership_type}%"))

#         if filter_data.property_age:
#             filters.append(BaseProperty.property_age == str(filter_data.property_age))

#         if filter_data.property_condition:
#             filters.append(BaseProperty.property_condition.ilike(f"%{filter_data.property_condition}%"))

#         if filter_data.floor_count:
#             filters.append(BaseProperty.total_floors == filter_data.floor_count)

#         if filter_data.is_negotiable:
#             filters.append(BaseProperty.price_negotiable.ilike(f"%{filter_data.is_negotiable}%"))

#         if filter_data.loan_outstanding:
#             filters.append(BaseProperty.loan_outstanding.ilike(f"%{filter_data.loan_outstanding}%"))

#         if filter_data.advance_deposit:
#             if filter_data.advance_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.advance_deposit.min)
#             if filter_data.advance_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.advance_deposit.max)

#         if filter_data.lease_duration:
#             filters.append(BaseProperty.minimum_rental_duration.ilike(f"%{filter_data.lease_duration}%"))

#         if filters:
#             query = query.where(and_(*filters))
#             count_query = count_query.where(and_(*filters))

#         if filter_data.sort_by:
#             sort_field = getattr(BaseProperty, filter_data.sort_by, None)
#             if sort_field:
#                 if filter_data.sort_order == "desc":
#                     query = query.order_by(desc(sort_field))
#                 else:
#                     query = query.order_by(asc(sort_field))
#         else:
#             query = query.order_by(desc(BaseProperty.created_at))

#         skip = (filter_data.page - 1) * filter_data.limit
#         query = query.offset(skip).limit(filter_data.limit)

#         query = query.options(*self.get_full_relations_options())

#         result = await self.db.execute(query)
#         count_result = await self.db.execute(count_query)

#         properties = result.unique().scalars().all()
#         total_count = count_result.scalar() or 0

#         return properties, total_count

#     # ============================================
#     # FILTER BY SPECIFIC FIELDS - WITH EAGER LOADING
#     # ============================================

#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by posted_by with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.posted_by == posted_by)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_posted_by(
#         self,
#         posted_by: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get total count by posted_by"""
#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.posted_by == posted_by)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_posted_by_multiple(
#         self,
#         posted_by: List[str],
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by multiple posted_by values with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.posted_by.in_(posted_by))

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by category with all relations loaded"""
#         normalized_category = property_category.strip().upper()

#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )

#         query = select(BaseProperty).where(
#             BaseProperty.property_category == normalized_category
#         )

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_properties_by_sub_category(
#         self,
#         sub_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by sub category with all relations loaded"""
#         query = select(BaseProperty).where(
#             BaseProperty.sub_category == sub_category
#         )

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_sub_category(
#         self,
#         sub_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         normalized_sub_category = sub_category.strip()

#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.sub_category == normalized_sub_category)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_count_by_category(
#         self,
#         property_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count by category"""
#         normalized_category = property_category.strip().upper()

#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )

#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.property_category == normalized_category)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by property type with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.property_type == property_type)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_property_type(
#         self,
#         property_type: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by property type"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.property_type == property_type
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by listing purpose with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.listing_purpose == listing_purpose)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_purpose(
#         self,
#         listing_purpose: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by listing purpose"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.listing_purpose == listing_purpose
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_property_by_user_id(
#         self,
#         user_id: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by user id with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.user_id == user_id)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_user_id_property(
#         self,
#         user_id: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.user_id == user_id)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0


#     async def get_properties_by_user_and_role(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = None,
#     ) -> List[BaseProperty]:
#         """Get this user's properties, restricted to one vendor role."""
#         query = select(BaseProperty).where(
#             and_(
#                 BaseProperty.user_id == user_id,
#                 BaseProperty.posted_by == posted_by.value,
#             )
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_user_and_role(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         status: Optional[str] = None,
#     ) -> int:
#         query = select(func.count()).select_from(BaseProperty).where(
#             and_(
#                 BaseProperty.user_id == user_id,
#                 BaseProperty.posted_by == posted_by.value,
#             )
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def search_user_properties(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         keyword: Optional[str],
#         skip: int = 0,
#         limit: int = 20,
#     ) -> Tuple[List[BaseProperty], int]:
#         """Keyword search across this user's properties for one role."""
#         filters = [
#             BaseProperty.user_id == user_id,
#             BaseProperty.posted_by == posted_by.value,
#         ]
#         if keyword:
#             like = f"%{keyword}%"
#             filters.append(
#                 or_(
#                     BaseProperty.property_title.ilike(like),
#                     BaseProperty.city.ilike(like),
#                     BaseProperty.area.ilike(like),
#                     BaseProperty.address.ilike(like),
#                     BaseProperty.landmark.ilike(like),
#                 )
#             )

#         query = (
#             select(BaseProperty)
#             .where(and_(*filters))
#             .options(*self.get_full_relations_options())
#             .order_by(desc(BaseProperty.created_at))
#             .offset(skip)
#             .limit(limit)
#         )
#         count_query = select(func.count()).select_from(BaseProperty).where(and_(*filters))

#         result = await self.db.execute(query)
#         count_result = await self.db.execute(count_query)
#         return result.unique().scalars().all(), (count_result.scalar() or 0)

  
#     async def get_latest_vendor_detail(self, user_id: str, posted_by: PostedBy):
       
#         model = VENDOR_MODEL_MAP[posted_by]
#         query = (
#             select(model)
#             .where(model.user_id == user_id)
#             .order_by(desc(model.updated_at), desc(model.created_at))
#             .limit(1)
#         )
#         result = await self.db.execute(query)
#         return result.scalar_one_or_none()

#     async def update_vendor_detail(
#         self,
#         user_id: str,
#         posted_by: PostedBy,
#         update_data: Dict[str, Any],
#     ):
#         detail_obj = await self.get_latest_vendor_detail(user_id, posted_by)
#         if not detail_obj:
#             return None

#         protected = {"id", "property_id", "user_id", "created_at"}
#         for key, value in update_data.items():
#             if key in protected:
#                 continue
#             if hasattr(detail_obj, key):
#                 setattr(detail_obj, key, value)

#         await self.db.flush()
#         await self.db.refresh(detail_obj)
#         return detail_obj


#     async def get_vendor_document(self, user_id: str, document_type: str) -> Optional[PropertyDocument]:
#         query = select(PropertyDocument).where(
#             and_(
#                 PropertyDocument.user_id == user_id,
#                 PropertyDocument.property_id.is_(None),
#                 PropertyDocument.document_type == document_type,
#             )
#         )
#         result = await self.db.execute(query)
#         return result.scalar_one_or_none()

#     async def upsert_vendor_document(
#         self,
#         user_id: str,
#         document_type: str,
#         doc_data: Dict[str, Any],
#     ) -> PropertyDocument:
#         existing = await self.get_vendor_document(user_id, document_type)
#         if existing:
#             for key, value in doc_data.items():
#                 if hasattr(existing, key):
#                     setattr(existing, key, value)
#             await self.db.flush()
#             await self.db.refresh(existing)
#             return existing

#         doc_data = dict(doc_data)
#         doc_data["user_id"] = user_id
#         doc_data["document_type"] = document_type
#         doc_data["property_id"] = None
#         doc_obj = PropertyDocument(**doc_data)
#         self.db.add(doc_obj)
#         await self.db.flush()
#         await self.db.refresh(doc_obj)
#         return doc_obj

#     async def delete_vendor_document(self, user_id: str, document_type: str) -> bool:
#         existing = await self.get_vendor_document(user_id, document_type)
#         if not existing:
#             return False
#         await self.db.delete(existing)
#         await self.db.flush()
#         return True

#     # ============================================
#     # NEW: PROPERTY MEDIA HELPERS (image delete by order, cover image)
#     # ============================================

#     async def get_media_by_id(self, media_id: int) -> Optional[PropertyMedia]:
#         result = await self.db.execute(select(PropertyMedia).where(PropertyMedia.id == media_id))
#         return result.scalar_one_or_none()

#     async def delete_property_image_by_order(self, property_id: int, order_index: int) -> bool:
#         """Delete the image at this display position (the `order` column),
#         matching the {imageIndex} path param."""
#         result = await self.db.execute(
#             delete(PropertyMedia).where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'image',
#                     PropertyMedia.order == order_index,
#                 )
#             )
#         )
#         await self.db.flush()
#         return result.rowcount > 0

#     async def set_cover_image(self, property_id: int, media_id: int) -> Optional[PropertyMedia]:
#         """Mark one image as primary/cover, unmarking any other image on
#         this property."""
#         media = await self.get_media_by_id(media_id)
#         if not media or media.property_id != property_id or media.media_type != 'image':
#             return None

#         await self.db.execute(
#             update(PropertyMedia)
#             .where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'image',
#                 )
#             )
#             .values(is_primary=False)
#         )
#         await self.db.execute(
#             update(PropertyMedia).where(PropertyMedia.id == media_id).values(is_primary=True)
#         )
#         await self.db.flush()
#         await self.db.refresh(media)
#         return media

#     # ============================================
#     # UPDATE OPERATIONS
#     # ============================================

#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any]
#     ) -> Optional[BaseProperty]:
#         """Update property data"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             for key, value in update_data.items():
#                 if hasattr(property_obj, key):
#                     setattr(property_obj, key, value)
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None

#     async def update_role_specific_details(
#         self,
#         property_id: int,
#         posted_by: PostedBy,
#         update_data: Dict[str, Any],
#     ):
#         model = VENDOR_MODEL_MAP[posted_by]
#         result = await self.db.execute(select(model).where(model.property_id == property_id))
#         detail_obj = result.scalar_one_or_none()
#         if not detail_obj:
#             return None

#         protected = {"id", "property_id", "user_id", "created_at"}
#         for key, value in update_data.items():
#             if key in protected:
#                 continue
#             if hasattr(detail_obj, key):
#                 setattr(detail_obj, key, value)

#         await self.db.flush()
#         await self.db.refresh(detail_obj)
#         return detail_obj

#     async def update_property_status(
#         self,
#         property_id: int,
#         status: str
#     ) -> Optional[BaseProperty]:
#         """Update property status"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             property_obj.status = status
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None

#     # ============================================
#     # DELETE OPERATIONS
#     # ============================================

#     async def delete_property(self, property_id: int) -> bool:
#         """Delete property and all related records"""
#         property_obj = await self.get_property_by_id(property_id)
#         if not property_obj:
#             return False

#         await self.db.execute(
#             delete(OwnerProperty).where(OwnerProperty.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyAgentDetails).where(PropertyAgentDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyBuilderDetails).where(PropertyBuilderDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyManagementProperty).where(PropertyManagementProperty.property_id == property_id)
#         )

#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )

#         await self.db.delete(property_obj)
#         await self.db.flush()
#         return True

#     async def delete_property_media(self, property_id: int):
#         """Delete all media for a property"""
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.flush()

#     async def delete_property_video(self, property_id: int):
#         """Delete video for a property"""
#         await self.db.execute(
#             delete(PropertyMedia)
#             .where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'video'
#                 )
#             )
#         )
#         await self.db.flush()

#     async def delete_property_documents(self, property_id: int):
#         """Delete all documents for a property"""
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )
#         await self.db.flush()

#     # ============================================
#     # TRANSACTION MANAGEMENT
#     # ============================================

#     async def commit(self):
#         """Commit current transaction"""
#         await self.db.commit()

#     async def rollback(self):
#         """Rollback current transaction"""
#         await self.db.rollback()

#     async def flush(self):
#         """Flush current transaction"""
#         await self.db.flush()





















































































































# from datetime import date, datetime

# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func, delete, update, and_, or_, desc, asc
# from sqlalchemy.orm import selectinload, joinedload
# from typing import Optional, List, Dict, Any, Tuple
# from app.core.id_generator import IDGenerator
# from app.models.property import BaseProperty, PropertyCategory
# from app.models.property_agent import PropertyAgentDetails
# from app.models.property_builder import PropertyBuilderDetails
# from app.models.property_media import PropertyMedia
# from app.models.property_document import PropertyDocument
# from app.models.property_owner import OwnerProperty
# from app.models.property_pm import PropertyManagementProperty
# from app.schemas.filter_schemas import PropertyFilter


# class PropertyRepository:
#     def __init__(self, db: AsyncSession):
#         self.db = db

#     # ============================================
#     # EAGER LOADING OPTIONS
#     # ============================================
    
#     @staticmethod
#     def get_list_view_options():
#         """Options for list view - only load what's needed for cards"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),  # ✅ Load user for ownerName/contact
#         ]
    
#     @staticmethod
#     def get_detail_view_options():
#         """Options for detail view - load all relationships"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),  # ✅ Load user
#             joinedload(BaseProperty.owner_details),  # ✅ Load owner details
#             joinedload(BaseProperty.agent_details),  # ✅ Load agent details
#             joinedload(BaseProperty.builder_details),  # ✅ Load builder details
#             joinedload(BaseProperty.property_management_details),  # ✅ Load PM details
#         ]
    
#     @staticmethod
#     def get_full_relations_options():
#         """Full options - load all relationships for complete response"""
#         return [
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.user),
#             joinedload(BaseProperty.owner_details),
#             joinedload(BaseProperty.agent_details),
#             joinedload(BaseProperty.builder_details),
#             joinedload(BaseProperty.property_management_details),
#         ]

#     def _sanitize_property_data(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
#         """Filter property payload down to columns supported by the base property model."""
#         if not property_data:
#             return {}

#         allowed_fields = {
#             "id",
#             "user_id",
#             "posted_by",
#             "listing_purpose",
#             "property_category",
#             "property_type",
#             "property_title",
#             "bedrooms",
#             "bathrooms",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "corner_unit",
#             "facing_direction",
#             "built_up_area",
#             "carpet_area",
#             "garden_space",
#             "address",
#             "area",
#             "city",
#             "district",
#             "state",
#             "pin_code",
#             "landmark",
#             "furnishing_status",
#             "terrace_balcony",
#             "interior_features",
#             "parking",
#             "parking_capacity",
#             "amenities",
#             "nearby_access",
#             "nearby_connectivity",
#             "tenant_type",
#             "smoking_allowed",
#             "dietary_preference",
#             "pet_friendly",
#             "available_from",
#             "immediate_move_in",
#             "minimum_rental_duration",
#             "expected_price",
#             "price_min",
#             "price_max",
#             "price_negotiable",
#             "security_deposit",
#             "maintenance_included",
#             "maintenance_amount",
#             "ownership_type",
#             "loan_outstanding",
#             "property_condition",
#             "status",
#             "property_tax",
#             "title_deed_verify",
#             "underconstruction",
#             "immediate_possession",
#             "rera_approved",
#             "loan_eligible",
#             "lease_renewable",
#             "bedroom_filter",
#             "bathroom_filter",
#             "balcony",
#             "terrace",
#             "furnishing_status",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "facing_direction",
#             "parking_capacity",
#             "maintenance_amount",
#             "security_deposit",
#             "price_negotiable",
#             "loan_eligible",
#             "loan_outstanding",
#             "property_condition",
#             "price_min",
#             "price_max",
#             "lease_terms",
#             "minimum_rental_duration",
#             "tenant_type",
#             "pet_friendly",
#             "available_from",
#             "sub_category",
#         }

#         sanitized = {}
#         for key, value in property_data.items():
#             if key not in allowed_fields:
#                 continue

#             sanitized[key] = value

#         return sanitized
    
    
#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         user_id:str,
#     ) -> BaseProperty:

#         property_id = await IDGenerator.generate_property_id(
#                         db=self.db,
#                         category=posted_by,
#                         user_id=user_id,
#             )
#         if property_id and "id" not in property_data:
#             property_data["id"] = property_id
#         sanitized_property_data = self._sanitize_property_data(property_data)
#         property_obj = BaseProperty(**sanitized_property_data)

#         self.db.add(property_obj)
#         await self.db.flush()
#         await self.db.refresh(property_obj)

#         # 2. Create role-specific details based on posted_by
#         await self._create_role_specific_details(
#             property_id=property_obj.id,
#             posted_by=posted_by,
#             property_data=property_data
#         )

#         # 3. Commit all changes
#         await self.db.commit()
#         await self.db.refresh(property_obj)

#         return property_obj
    
#     async def _create_role_specific_details(
#         self,
#         property_id: int,
#         posted_by: str,
#         property_data: Dict[str, Any]
#     ):
#         """Create role-specific details based on posted_by"""

#         if posted_by == 'OWNER':
#             owner_detail = OwnerProperty(
#                 property_id=property_id,
#                 owner_name=property_data.get('owner_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 aadhaar_number=property_data.get('aadhaar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 address_line1=property_data.get('address_line1'),
#                 address_line2=property_data.get('address_line2'),
#                 owner_city=property_data.get('city'),
#                 owner_state=property_data.get('state'),
#                 owner_pin_code=property_data.get('pin_code'),
#                 preferred_contact_method=property_data.get('preferred_contact_method'),
#                 preferred_contact_time=property_data.get('preferred_contact_time'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(owner_detail)

#         elif posted_by == 'AGENT':
#             agent_detail = PropertyAgentDetails(
#                 property_id=property_id,
#                 agent_name=property_data.get('agent_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 office_address=property_data.get('office_address'),
#                 agency_name=property_data.get('agency_name'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 active_listing=property_data.get('active_listing'),
#                 service_area=property_data.get('service_area'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(agent_detail)

#         elif posted_by == 'BUILDER':
#             builder_detail = PropertyBuilderDetails(
#                 property_id=property_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_profile=property_data.get('company_profile'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(builder_detail)

#         elif posted_by == 'PROPERTY_MANAGEMENT':
#             pm_detail = PropertyManagementProperty(
#                 property_id=property_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_profile=property_data.get('company_profile'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(pm_detail)

#     async def create_property_media(self, media_data: Dict[str, Any]) -> PropertyMedia:
#         """Save media file metadata to database"""
#         media_obj = PropertyMedia(**media_data)
#         self.db.add(media_obj)
#         await self.db.commit()
#         await self.db.refresh(media_obj)
#         return media_obj

#     async def create_property_document(self, doc_data: Dict[str, Any]) -> PropertyDocument:
#         """Save document metadata to database"""
#         doc_obj = PropertyDocument(**doc_data)
#         self.db.add(doc_obj)
#         await self.db.commit()
#         await self.db.refresh(doc_obj)
#         return doc_obj

#     # ============================================
#     # READ OPERATIONS - WITH EAGER LOADING
#     # ============================================

#     async def get_property_by_id(self, property_id: int) -> Optional[BaseProperty]:
#         """Get a property by ID without relations"""
#         result = await self.db.execute(
#             select(BaseProperty).where(BaseProperty.id == property_id)
#         )
#         return result.scalar_one_or_none()

#     async def get_property_with_relations(self, property_id: int) -> Optional[BaseProperty]:
#         """
#         Get a property by ID with all relations loaded.
#         Uses selectinload for one-to-many (collections) and joinedload for one-to-one.
#         """
#         result = await self.db.execute(
#             select(BaseProperty)
#             .options(*self.get_detail_view_options())
#             .where(BaseProperty.id == property_id)
#         )
#         return result.unique().scalar_one_or_none()

#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get all properties with pagination - optimized loading"""
#         query = select(BaseProperty)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_list_view_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_total_property_count(self, status: Optional[str] = "Active") -> int:
#         """Get total count of properties"""
#         query = select(func.count()).select_from(BaseProperty)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     # ============================================
#     # FILTER OPERATIONS
#     # ============================================

#     async def filter_properties(
#         self,
#         filter_data: PropertyFilter
#     ) -> Tuple[List[BaseProperty], int]:
#         """Advanced filter with pagination - optimized loading"""

#         # Build query
#         query = select(BaseProperty)
#         count_query = select(func.count()).select_from(BaseProperty)

#         filters = []

#         # ===== Basic Filters =====

#         # Posted By - Supports multiple values
#         if filter_data.posted_by:
#             filters.append(BaseProperty.posted_by.in_(filter_data.posted_by))

#         if filter_data.listing_purpose:
#             filters.append(BaseProperty.listing_purpose == filter_data.listing_purpose)

#         if filter_data.property_category:
#             filters.append(BaseProperty.property_category == filter_data.property_category)

#         if filter_data.property_type:
#             filters.append(BaseProperty.property_type == filter_data.property_type)

#         # ===== Location Filters =====
#         if filter_data.preferred_location:
#             filters.append(
#                 or_(
#                     BaseProperty.area.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.city.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.district.ilike(f"%{filter_data.preferred_location}%")
#                 )
#             )

#         if filter_data.state:
#             filters.append(BaseProperty.state.ilike(f"%{filter_data.state}%"))

#         if filter_data.pincode:
#             filters.append(BaseProperty.pin_code == filter_data.pincode)

#         # ===== Price Filters =====
#         if filter_data.budget_range:
#             if filter_data.budget_range.min is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_min >= str(filter_data.budget_range.min),
#                         BaseProperty.expected_price >= str(filter_data.budget_range.min)
#                     )
#                 )
#             if filter_data.budget_range.max is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_max <= str(filter_data.budget_range.max),
#                         BaseProperty.expected_price <= str(filter_data.budget_range.max)
#                     )
#                 )

#         if filter_data.monthly_rent_budget:
#             if filter_data.monthly_rent_budget.min is not None:
#                 filters.append(BaseProperty.price_min >= str(filter_data.monthly_rent_budget.min))
#             if filter_data.monthly_rent_budget.max is not None:
#                 filters.append(BaseProperty.price_max <= str(filter_data.monthly_rent_budget.max))

#         if filter_data.lease_budget:
#             if filter_data.lease_budget.min is not None:
#                 filters.append(BaseProperty.expected_price >= str(filter_data.lease_budget.min))
#             if filter_data.lease_budget.max is not None:
#                 filters.append(BaseProperty.expected_price <= str(filter_data.lease_budget.max))

#         # ===== Property Specs =====
#         if filter_data.bedrooms:
#             filters.append(BaseProperty.bedrooms.in_(filter_data.bedrooms))

#         if filter_data.bathrooms:
#             filters.append(BaseProperty.bathrooms.in_([str(b) for b in filter_data.bathrooms]))

#         if filter_data.furnishing_type:
#             filters.append(BaseProperty.furnishing_status.ilike(f"%{filter_data.furnishing_type}%"))

#         if filter_data.parking is not None:
#             filters.append(BaseProperty.parking == ("Yes" if filter_data.parking > 0 else "No"))

#         if filter_data.builtup_area:
#             if filter_data.builtup_area.min is not None:
#                 filters.append(BaseProperty.built_up_area >= str(filter_data.builtup_area.min))
#             if filter_data.builtup_area.max is not None:
#                 filters.append(BaseProperty.built_up_area <= str(filter_data.builtup_area.max))

#         if filter_data.carpet_area:
#             if filter_data.carpet_area.min is not None:
#                 filters.append(BaseProperty.carpet_area >= str(filter_data.carpet_area.min))
#             if filter_data.carpet_area.max is not None:
#                 filters.append(BaseProperty.carpet_area <= str(filter_data.carpet_area.max))

#         if filter_data.plot_size:
#             if filter_data.plot_size.min is not None:
#                 filters.append(BaseProperty.built_up_area >= str(filter_data.plot_size.min))
#             if filter_data.plot_size.max is not None:
#                 filters.append(BaseProperty.built_up_area <= str(filter_data.plot_size.max))

#         # ===== Features =====
#         if filter_data.garden_space:
#             filters.append(BaseProperty.garden_space.ilike(f"%{filter_data.garden_space}%"))

#         if filter_data.terrace:
#             filters.append(BaseProperty.terrace_balcony.ilike(f"%{filter_data.terrace}%"))

#         if filter_data.floor_preference:
#             filters.append(BaseProperty.floor_number.ilike(f"%{filter_data.floor_preference}%"))

#         if filter_data.balcony:
#             filters.append(BaseProperty.terrace_balcony.ilike(f"%{filter_data.balcony}%"))

#         if filter_data.facing_preference:
#             filters.append(BaseProperty.facing_direction.ilike(f"%{filter_data.facing_preference}%"))

#         if filter_data.floor_number:
#             filters.append(BaseProperty.floor_number == filter_data.floor_number)

#         if filter_data.total_floors:
#             filters.append(BaseProperty.total_floors == filter_data.total_floors)

#         # ===== Amenities (JSONB array contains) =====
#         if filter_data.amenities:
#             for amenity in filter_data.amenities:
#                 filters.append(BaseProperty.amenities.contains([amenity]))

#         # ===== Buy Filters =====
#         if filter_data.home_loan_required:
#             filters.append(BaseProperty.loan_eligible == filter_data.home_loan_required)

#         # ===== Rent Filters =====
#         if filter_data.move_in_date:
#             filters.append(BaseProperty.available_from <= str(filter_data.move_in_date))

#         if filter_data.tenant_type:
#             filters.append(BaseProperty.tenant_type.contains([filter_data.tenant_type]))

#         if filter_data.rental_duration:
#             filters.append(BaseProperty.minimum_rental_duration.ilike(f"%{filter_data.rental_duration}%"))

#         if filter_data.pet_friendly:
#             filters.append(BaseProperty.pet_friendly.ilike(f"%{filter_data.pet_friendly}%"))

#         if filter_data.security_deposit:
#             if filter_data.security_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.security_deposit.min)
#             if filter_data.security_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.security_deposit.max)

#         # ===== Sell Filters =====
#         if filter_data.ownership_type:
#             filters.append(BaseProperty.ownership_type.ilike(f"%{filter_data.ownership_type}%"))

#         if filter_data.property_age:
#             filters.append(BaseProperty.property_age == str(filter_data.property_age))

#         if filter_data.property_condition:
#             filters.append(BaseProperty.property_condition.ilike(f"%{filter_data.property_condition}%"))

#         if filter_data.floor_count:
#             filters.append(BaseProperty.total_floors == filter_data.floor_count)

#         if filter_data.is_negotiable:
#             filters.append(BaseProperty.price_negotiable.ilike(f"%{filter_data.is_negotiable}%"))

#         if filter_data.loan_outstanding:
#             filters.append(BaseProperty.loan_outstanding.ilike(f"%{filter_data.loan_outstanding}%"))

#         # ===== Lease Filters =====
#         if filter_data.advance_deposit:
#             if filter_data.advance_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.advance_deposit.min)
#             if filter_data.advance_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.advance_deposit.max)

#         if filter_data.lease_duration:
#             filters.append(BaseProperty.minimum_rental_duration.ilike(f"%{filter_data.lease_duration}%"))

#         # ===== Apply Filters =====
#         if filters:
#             query = query.where(and_(*filters))
#             count_query = count_query.where(and_(*filters))

#         # ===== Sorting =====
#         if filter_data.sort_by:
#             sort_field = getattr(BaseProperty, filter_data.sort_by, None)
#             if sort_field:
#                 if filter_data.sort_order == "desc":
#                     query = query.order_by(desc(sort_field))
#                 else:
#                     query = query.order_by(asc(sort_field))
#         else:
#             query = query.order_by(desc(BaseProperty.created_at))

#         # ===== Pagination =====
#         skip = (filter_data.page - 1) * filter_data.limit
#         query = query.offset(skip).limit(filter_data.limit)

#         # ===== Load Relations =====
#         query = query.options(*self.get_full_relations_options())

#         # ===== Execute Queries =====
#         result = await self.db.execute(query)
#         count_result = await self.db.execute(count_query)

#         properties = result.unique().scalars().all()
#         total_count = count_result.scalar() or 0

#         return properties, total_count

#     # ============================================
#     # FILTER BY SPECIFIC FIELDS - WITH EAGER LOADING
#     # ============================================

#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by posted_by with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.posted_by == posted_by)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_posted_by(
#         self,
#         posted_by: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get total count by posted_by"""
#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.posted_by == posted_by)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_posted_by_multiple(
#         self,
#         posted_by: List[str],
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by multiple posted_by values with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.posted_by.in_(posted_by))

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by category with all relations loaded"""
#         normalized_category = property_category.strip().upper()

#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )

#         query = select(BaseProperty).where(
#             BaseProperty.property_category == normalized_category
#         )

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_properties_by_sub_category(
#         self,
#         sub_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by sub category with all relations loaded"""
#         query = select(BaseProperty).where(
#             BaseProperty.sub_category == sub_category
#         )

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_sub_category(
#         self,
#         sub_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         normalized_sub_category = sub_category.strip()

#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.sub_category == normalized_sub_category)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_count_by_category(
#         self,
#         property_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count by category"""
#         normalized_category = property_category.strip().upper()

#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )

#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.property_category == normalized_category)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by property type with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.property_type == property_type)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_property_type(
#         self,
#         property_type: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by property type"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.property_type == property_type
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by listing purpose with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.listing_purpose == listing_purpose)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_purpose(
#         self,
#         listing_purpose: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by listing purpose"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.listing_purpose == listing_purpose
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     async def get_property_by_user_id(
#         self,
#         user_id: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by user id with all relations loaded"""
#         query = select(BaseProperty).where(BaseProperty.user_id == user_id)

#         if status:
#             query = query.where(BaseProperty.status == status)

#         query = query.options(*self.get_full_relations_options())
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)

#         result = await self.db.execute(query)
#         return result.unique().scalars().all()

#     async def get_count_by_user_id_property(
#         self,
#         user_id: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.user_id == user_id)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0

#     # ============================================
#     # UPDATE OPERATIONS
#     # ============================================

#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any]
#     ) -> Optional[BaseProperty]:
#         """Update property data"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             for key, value in update_data.items():
#                 if hasattr(property_obj, key):
#                     setattr(property_obj, key, value)
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None

#     async def update_property_status(
#         self,
#         property_id: int,
#         status: str
#     ) -> Optional[BaseProperty]:
#         """Update property status"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             property_obj.status = status
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None

#     # ============================================
#     # DELETE OPERATIONS
#     # ============================================

#     async def delete_property(self, property_id: int) -> bool:
#         """Delete property and all related records"""
#         property_obj = await self.get_property_by_id(property_id)
#         if not property_obj:
#             return False

#         # Delete role-specific details
#         await self.db.execute(
#             delete(OwnerProperty).where(OwnerProperty.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyAgentDetails).where(PropertyAgentDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyBuilderDetails).where(PropertyBuilderDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyManagementProperty).where(PropertyManagementProperty.property_id == property_id)
#         )

#         # Delete media and documents
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )

#         # Delete property
#         await self.db.delete(property_obj)
#         await self.db.flush()
#         return True

#     async def delete_property_media(self, property_id: int):
#         """Delete all media for a property"""
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.flush()

#     async def delete_property_video(self, property_id: int):
#         """Delete video for a property"""
#         await self.db.execute(
#             delete(PropertyMedia)
#             .where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'video'
#                 )
#             )
#         )
#         await self.db.flush()

#     async def delete_property_documents(self, property_id: int):
#         """Delete all documents for a property"""
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )
#         await self.db.flush()

#     # ============================================
#     # TRANSACTION MANAGEMENT
#     # ============================================

#     async def commit(self):
#         """Commit current transaction"""
#         await self.db.commit()

#     async def rollback(self):
#         """Rollback current transaction"""
#         await self.db.rollback()

#     async def flush(self):
#         """Flush current transaction"""
#         await self.db.flush()
































# from datetime import date, datetime

# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func, delete, update, and_, or_, desc, asc
# from sqlalchemy.orm import selectinload, joinedload
# from typing import Optional, List, Dict, Any, Tuple
# from app.models.property import BaseProperty, PropertyCategory
# from app.models.property_agent import PropertyAgentDetails
# from app.models.property_builder import PropertyBuilderDetails
# from app.models.property_media import PropertyMedia
# from app.models.property_document import PropertyDocument
# from app.models.property_owner import OwnerProperty
# from app.models.property_pm import PropertyManagementProperty
# from app.schemas.filter_schemas import PropertyFilter


# class PropertyRepository:
#     def __init__(self, db: AsyncSession):
#         self.db = db

#     def _sanitize_property_data(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
#         """Filter property payload down to columns supported by the base property model."""
#         if not property_data:
#             return {}

#         allowed_fields = {
#             "user_id",
#             "posted_by",
#             "listing_purpose",
#             "property_category",
#             "property_type",
#             "property_title",
#             "bedrooms",
#             "bathrooms",
#             "floor_number",
#             "total_floors",
#             "property_age",
#             "corner_unit",
#             "facing_direction",
#             "built_up_area",
#             "carpet_area",
#             "garden_space",
#             "address",
#             "area",
#             "city",
#             "district",
#             "state",
#             "pin_code",
#             "landmark",
#             "furnishing_status",
#             "terrace_balcony",
#             "interior_features",
#             "parking",
#             # "parking_count",
#             "amenities",
#             "nearby_access",
#             "nearby_connectivity",
#             "tenant_type",
#             "smoking_allowed",
#             "dietary_preference",
#             "pet_friendly",
#             "available_from",
#             "immediate_move_in",
#             "minimum_rental_duration",
#             "expected_price",
#             "price_min",
#             "price_max",
#             "price_negotiable",
#             "security_deposit",
#             "maintenance_included",
#             "maintenance_amount",
#             "ownership_type",
#             "loan_outstanding",
#             "property_condition",
#             "status",
#             "property_tax",
#             "title_deed_verify",
#             "underconstruction",
#             "immediate_possession",
#             "rera_approved",
#             "loan_eligible",
#             "lease_renewable",
#         }

#         sanitized = {}
#         for key, value in property_data.items():
#             if key not in allowed_fields:
#                 continue

#             # if isinstance(value, (date, datetime)):
#             #     value = value.isoformat()
#             elif key == "security_deposit" and isinstance(value, str):
#                 cleaned = ''.join(c for c in value if c.isdigit() or c in '.-')
#                 if cleaned:
#                     try:
#                         value = float(cleaned) if '.' in cleaned else int(cleaned)
#                     except ValueError:
#                         pass
#             # elif key == "parking_count" and isinstance(value, str):
#             #     cleaned = ''.join(c for c in value if c.isdigit() or c == '-')
#             #     if cleaned:
#             #         try:
#             #             value = int(cleaned)
#             #         except ValueError:
#             #             pass

#             sanitized[key] = value

#         # print(f"Sanitized property data: {sanitized}")  # Debugging line
#         return sanitized
    
    
#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any]
#     ) -> BaseProperty:
#         # print(f"Creating property for posted_by: {posted_by} with data: {property_data}")  # Debugging line
#         # print(f"property_data type: {property_data}")  # Debugging line
#         # print(f"repo layer called successfully")
#         # 1. Create BaseProperty using only supported base columns
#         sanitized_property_data = self._sanitize_property_data(property_data)
#         # print("Repo:",sanitized_property_data.get("security_deposit"),type(sanitized_property_data.get("security_deposit")))
#         property_obj = BaseProperty(**sanitized_property_data)

        
#         self.db.add(property_obj)
#         await self.db.flush()  # Get the ID
#         await self.db.refresh(property_obj)

#         # print(f"Created BaseProperty with ID: {property_obj.id} for posted_by: {posted_by}")  # Debugging line
        
#         # 2. Create role-specific details based on posted_by
#         await self._create_role_specific_details(
#             property_id=property_obj.id,
#             posted_by=posted_by,
#             property_data=property_data
#         )
        
#         # 3. Commit all changes
#         await self.db.commit()
#         await self.db.refresh(property_obj)

#         # print(f"Finalized personal data stored: {property_obj}")  # Debugging line

#         return property_obj
    
#     async def _create_role_specific_details(
#         self,
#         property_id: int,
#         posted_by: str,
#         property_data: Dict[str, Any]
#     ):
#         """Create role-specific details based on posted_by"""

        
        
#         if posted_by == 'OWNER':
#             owner_detail = OwnerProperty(
#                 property_id=property_id,
#                 owner_name=property_data.get('owner_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 aadhaar_number=property_data.get('aadhaar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 address_line1=property_data.get('address_line1'),
#                 address_line2=property_data.get('address_line2'),
#                 owner_city=property_data.get('owner_city'),
#                 owner_state=property_data.get('owner_state'),
#                 owner_pin_code=property_data.get('owner_pin_code'),
#                 preferred_contact_method=property_data.get('preferred_contact_method'),
#                 preferred_contact_time=property_data.get('preferred_contact_time'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(owner_detail)
            
#         elif posted_by == 'AGENT':
#             agent_detail = PropertyAgentDetails(
#                 property_id=property_id,
#                 agent_name=property_data.get('agent_name'),
#                 date_of_birth=property_data.get('date_of_birth'),
#                 gender=property_data.get('gender'),
#                 mobile=property_data.get('mobile'),
#                 email_id=property_data.get('email_id'),
#                 office_address=property_data.get('office_address'),
#                 agency_name=property_data.get('agency_name'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 active_listing=property_data.get('active_listing'),
#                 service_area=property_data.get('service_area'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(agent_detail)
            
#         elif posted_by == 'BUILDER':
#             builder_detail = PropertyBuilderDetails(
#                 property_id=property_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_profile=property_data.get('company_profile'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(builder_detail)
            
#         elif posted_by == 'PROPERTY_MANAGEMENT':
#             pm_detail = PropertyManagementProperty(
#                 property_id=property_id,
#                 name=property_data.get('name'),
#                 designation=property_data.get('designation'),
#                 mobile=property_data.get('mobile'),
#                 whatsapp_number=property_data.get('whatsapp_number'),
#                 email=property_data.get('email'),
#                 rera_registration_number=property_data.get('rera_registration_number'),
#                 gst_number=property_data.get('gst_number'),
#                 experience=property_data.get('experience'),
#                 aadhar_number=property_data.get('aadhar_number'),
#                 pan_number=property_data.get('pan_number'),
#                 company_name=property_data.get('company_name'),
#                 company_reg_number=property_data.get('company_reg_number'),
#                 company_website=property_data.get('company_website'),
#                 company_profile=property_data.get('company_profile'),
#                 office_address=property_data.get('office_address'),
#                 city=property_data.get('city'),
#                 district=property_data.get('district'),
#                 state=property_data.get('state'),
#                 pincode=property_data.get('pincode'),
#                 landmark=property_data.get('landmark'),
#                 website=property_data.get('website'),
#                 facebook=property_data.get('facebook'),
#                 instagram=property_data.get('instagram'),
#                 linkedin=property_data.get('linkedin'),
#                 youtube=property_data.get('youtube'),
#                 bank_name=property_data.get('bank_name'),
#                 account_holder_name=property_data.get('account_holder_name'),
#                 account_number=property_data.get('account_number'),
#                 ifsc_code=property_data.get('ifsc_code'),
#                 upi_id=property_data.get('upi_id'),
#                 signature=property_data.get('signature'),
#                 signature_date=property_data.get('signature_date'),
#                 signature_place=property_data.get('signature_place'),
#                 declaration_accepted=property_data.get('declaration_accepted', False)
#             )
#             self.db.add(pm_detail)
    
#     async def create_property_media(self, media_data: Dict[str, Any]) -> PropertyMedia:
#         """Save media file metadata to database"""
#         media_obj = PropertyMedia(**media_data)
#         self.db.add(media_obj)
#         await self.db.commit()
#         await self.db.refresh(media_obj)
#         return media_obj
    
#     async def create_property_document(self, doc_data: Dict[str, Any]) -> PropertyDocument:
#         """Save document metadata to database"""
#         doc_obj = PropertyDocument(**doc_data)
#         self.db.add(doc_obj)
#         await self.db.commit()
#         await self.db.refresh(doc_obj)
#         return doc_obj
    
#     # ============================================
#     # READ OPERATIONS - OPTIMIZED WITH MIXED LOADING
#     # ============================================
    
#     async def get_property_by_id(self, property_id: int) -> Optional[BaseProperty]:
#         """Get a property by ID without relations"""
#         result = await self.db.execute(
#             select(BaseProperty).where(BaseProperty.id == property_id)
#         )
#         return result.scalar_one_or_none()
    
#     async def get_property_with_relations(self, property_id: int) -> Optional[BaseProperty]:
#         """
#         Get a property by ID with all relations loaded.
#         Uses selectinload for one-to-many (collections) and joinedload for one-to-one.
#         """
#         result = await self.db.execute(
#             select(BaseProperty)
#             .options(
#                 # ✅ selectinload for one-to-many relationships (collections)
#                 selectinload(BaseProperty.media),
#                 selectinload(BaseProperty.documents),
#                 # ✅ joinedload for one-to-one relationships (single items)
#                 joinedload(BaseProperty.owner_details),
#                 joinedload(BaseProperty.agent_details),
#                 joinedload(BaseProperty.builder_details),
#                 joinedload(BaseProperty.property_management_details)
#             )
#             .where(BaseProperty.id == property_id)
#         )
#         return result.unique().scalar_one_or_none()
    
#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get all properties with pagination - optimized loading"""
#         query = select(BaseProperty)
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         query = query.options(
#             # ✅ Only load what's needed for list view
#             selectinload(BaseProperty.media),  # For thumbnails
#             selectinload(BaseProperty.documents)  # If needed
#         )
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)
        
#         result = await self.db.execute(query)
#         return result.unique().scalars().all()
    
#     async def get_total_property_count(self, status: Optional[str] = "Active") -> int:
#         """Get total count of properties"""
#         query = select(func.count()).select_from(BaseProperty)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0
    
#     # ============================================
#     # FILTER OPERATIONS
#     # ============================================
    
#     async def filter_properties(
#         self,
#         filter_data: PropertyFilter
#     ) -> Tuple[List[BaseProperty], int]:
#         """Advanced filter with pagination - optimized loading"""
        
#         # Build query
#         query = select(BaseProperty)
#         count_query = select(func.count()).select_from(BaseProperty)
        
#         filters = []
        
#         # ===== Basic Filters =====
        
#         # Posted By - Supports multiple values
#         if filter_data.posted_by:
#             filters.append(BaseProperty.posted_by.in_(filter_data.posted_by))
        
#         if filter_data.listing_purpose:
#             filters.append(BaseProperty.listing_purpose == filter_data.listing_purpose)
        
#         if filter_data.property_category:
#             filters.append(BaseProperty.property_category == filter_data.property_category)
        
#         if filter_data.property_type:
#             filters.append(BaseProperty.property_type == filter_data.property_type)
        
#         # ===== Location Filters =====
#         if filter_data.preferred_location:
#             filters.append(
#                 or_(
#                     BaseProperty.area.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.city.ilike(f"%{filter_data.preferred_location}%"),
#                     BaseProperty.district.ilike(f"%{filter_data.preferred_location}%")
#                 )
#             )
        
#         if filter_data.state:
#             filters.append(BaseProperty.state.ilike(f"%{filter_data.state}%"))
        
#         if filter_data.pincode:
#             filters.append(BaseProperty.pin_code == filter_data.pincode)
        
#         # ===== Price Filters =====
#         if filter_data.budget_range:
#             if filter_data.budget_range.min is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_min >= str(filter_data.budget_range.min),
#                         BaseProperty.expected_price >= str(filter_data.budget_range.min)
#                     )
#                 )
#             if filter_data.budget_range.max is not None:
#                 filters.append(
#                     or_(
#                         BaseProperty.price_max <= str(filter_data.budget_range.max),
#                         BaseProperty.expected_price <= str(filter_data.budget_range.max)
#                     )
#                 )
        
#         if filter_data.monthly_rent_budget:
#             if filter_data.monthly_rent_budget.min is not None:
#                 filters.append(BaseProperty.price_min >= str(filter_data.monthly_rent_budget.min))
#             if filter_data.monthly_rent_budget.max is not None:
#                 filters.append(BaseProperty.price_max <= str(filter_data.monthly_rent_budget.max))
        
#         if filter_data.lease_budget:
#             if filter_data.lease_budget.min is not None:
#                 filters.append(BaseProperty.expected_price >= str(filter_data.lease_budget.min))
#             if filter_data.lease_budget.max is not None:
#                 filters.append(BaseProperty.expected_price <= str(filter_data.lease_budget.max))
        
#         # ===== Property Specs =====
#         if filter_data.bedrooms:
#             filters.append(BaseProperty.bedrooms.in_(filter_data.bedrooms))
        
#         if filter_data.bathrooms:
#             filters.append(BaseProperty.bathrooms.in_([str(b) for b in filter_data.bathrooms]))
        
#         if filter_data.furnishing_type:
#             filters.append(BaseProperty.furnishing_status.ilike(f"%{filter_data.furnishing_type}%"))
        
#         if filter_data.parking is not None:
#             filters.append(BaseProperty.parking == ("Yes" if filter_data.parking > 0 else "No"))
        
#         if filter_data.builtup_area:
#             if filter_data.builtup_area.min is not None:
#                 filters.append(BaseProperty.built_up_area >= str(filter_data.builtup_area.min))
#             if filter_data.builtup_area.max is not None:
#                 filters.append(BaseProperty.built_up_area <= str(filter_data.builtup_area.max))
        
#         if filter_data.carpet_area:
#             if filter_data.carpet_area.min is not None:
#                 filters.append(BaseProperty.carpet_area >= str(filter_data.carpet_area.min))
#             if filter_data.carpet_area.max is not None:
#                 filters.append(BaseProperty.carpet_area <= str(filter_data.carpet_area.max))
        
#         if filter_data.plot_size:
#             if filter_data.plot_size.min is not None:
#                 filters.append(BaseProperty.built_up_area >= str(filter_data.plot_size.min))
#             if filter_data.plot_size.max is not None:
#                 filters.append(BaseProperty.built_up_area <= str(filter_data.plot_size.max))
        
#         # ===== Features =====
#         if filter_data.garden_space:
#             filters.append(BaseProperty.garden_space.ilike(f"%{filter_data.garden_space}%"))
        
#         if filter_data.terrace:
#             filters.append(BaseProperty.terrace_balcony.ilike(f"%{filter_data.terrace}%"))
        
#         if filter_data.floor_preference:
#             filters.append(BaseProperty.floor_number.ilike(f"%{filter_data.floor_preference}%"))
        
#         if filter_data.balcony:
#             filters.append(BaseProperty.terrace_balcony.ilike(f"%{filter_data.balcony}%"))
        
#         if filter_data.facing_preference:
#             filters.append(BaseProperty.facing_direction.ilike(f"%{filter_data.facing_preference}%"))
        
#         if filter_data.floor_number:
#             filters.append(BaseProperty.floor_number == filter_data.floor_number)
        
#         if filter_data.total_floors:
#             filters.append(BaseProperty.total_floors == filter_data.total_floors)
        
#         # ===== Amenities (JSONB array contains) =====
#         if filter_data.amenities:
#             for amenity in filter_data.amenities:
#                 filters.append(BaseProperty.amenities.contains([amenity]))
        
#         # ===== Buy Filters =====
#         if filter_data.home_loan_required:
#             filters.append(BaseProperty.loan_eligible == filter_data.home_loan_required)
        
#         # ===== Rent Filters =====
#         if filter_data.move_in_date:
#             filters.append(BaseProperty.available_from <= str(filter_data.move_in_date))
        
#         if filter_data.tenant_type:
#             filters.append(BaseProperty.tenant_type.contains([filter_data.tenant_type]))
        
#         if filter_data.rental_duration:
#             filters.append(BaseProperty.minimum_rental_duration.ilike(f"%{filter_data.rental_duration}%"))
        
#         if filter_data.pet_friendly:
#             filters.append(BaseProperty.pet_friendly.ilike(f"%{filter_data.pet_friendly}%"))
        
#         if filter_data.security_deposit:
#             if filter_data.security_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.security_deposit.min)
#             if filter_data.security_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.security_deposit.max)
        
#         # ===== Sell Filters =====
#         if filter_data.ownership_type:
#             filters.append(BaseProperty.ownership_type.ilike(f"%{filter_data.ownership_type}%"))
        
#         if filter_data.property_age:
#             filters.append(BaseProperty.property_age == str(filter_data.property_age))
        
#         if filter_data.property_condition:
#             filters.append(BaseProperty.property_condition.ilike(f"%{filter_data.property_condition}%"))
        
#         if filter_data.floor_count:
#             filters.append(BaseProperty.total_floors == filter_data.floor_count)
        
#         if filter_data.is_negotiable:
#             filters.append(BaseProperty.price_negotiable.ilike(f"%{filter_data.is_negotiable}%"))
        
#         if filter_data.loan_outstanding:
#             filters.append(BaseProperty.loan_outstanding.ilike(f"%{filter_data.loan_outstanding}%"))
        
#         # ===== Lease Filters =====
#         if filter_data.advance_deposit:
#             if filter_data.advance_deposit.min is not None:
#                 filters.append(BaseProperty.security_deposit >= filter_data.advance_deposit.min)
#             if filter_data.advance_deposit.max is not None:
#                 filters.append(BaseProperty.security_deposit <= filter_data.advance_deposit.max)
        
#         if filter_data.lease_duration:
#             filters.append(BaseProperty.minimum_rental_duration.ilike(f"%{filter_data.lease_duration}%"))
        
#         # ===== Apply Filters =====
#         if filters:
#             query = query.where(and_(*filters))
#             count_query = count_query.where(and_(*filters))
        
#         # ===== Sorting =====
#         if filter_data.sort_by:
#             sort_field = getattr(BaseProperty, filter_data.sort_by, None)
#             if sort_field:
#                 if filter_data.sort_order == "desc":
#                     query = query.order_by(desc(sort_field))
#                 else:
#                     query = query.order_by(asc(sort_field))
#         else:
#             query = query.order_by(desc(BaseProperty.created_at))
        
#         # ===== Pagination =====
#         skip = (filter_data.page - 1) * filter_data.limit
#         query = query.offset(skip).limit(filter_data.limit)
        
#         # ===== Load Relations =====
#         query = query.options(
#             # ✅ Only load what's needed for filter results
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents)
#         )
        
#         # ===== Execute Queries =====
#         result = await self.db.execute(query)
#         count_result = await self.db.execute(count_query)
        
#         properties = result.unique().scalars().all()
#         total_count = count_result.scalar() or 0
        
#         return properties, total_count
    
#     # ============================================
#     # FILTER BY SPECIFIC FIELDS - OPTIMIZED
#     # ============================================
    
#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by posted_by"""
        
#         query = select(BaseProperty).where(BaseProperty.posted_by == posted_by)
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         query = query.options(
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents)
#         )
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)
        
#         result = await self.db.execute(query)
#         return result.unique().scalars().all()
    
#     async def get_count_by_posted_by(
#         self,
#         posted_by: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get total count by posted_by"""
        
#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.posted_by == posted_by)
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         result = await self.db.execute(query)
#         return result.scalar() or 0
    
#     async def get_properties_by_posted_by_multiple(
#         self,
#         posted_by: List[str],
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by multiple posted_by values"""
        
#         query = select(BaseProperty).where(BaseProperty.posted_by.in_(posted_by))
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         query = query.options(
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents)
#         )
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)
        
#         result = await self.db.execute(query)
#         return result.unique().scalars().all()


#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by category (case-insensitive)"""
        
#         # ✅ Normalize the input
#         normalized_category = property_category.strip().upper()
        
#         # ✅ Validate against enum values
#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )
        
#         # ✅ Use the normalized value
#         query = select(BaseProperty).where(
#             BaseProperty.property_category == normalized_category
#         )
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         query = query.options(
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents)
#         )
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)
        
#         result = await self.db.execute(query)
#         return result.unique().scalars().all()



#     async def get_properties_by_sub_category(
#             self,
#             sub_category: str,
#             skip: int = 0,
#             limit: int = 20,
#             status: Optional[str] = "Active"
#         ) -> List[BaseProperty]:
#             """Get properties by category (case-insensitive)"""
             
#             # ✅ Use the normalized value
#             query = select(BaseProperty).where(
#                 BaseProperty.sub_category == sub_category
#             )
            
#             if status:
#                 query = query.where(BaseProperty.status == status)
            
#             query = query.options(
#                 selectinload(BaseProperty.media),
#                 selectinload(BaseProperty.documents)
#             )
#             query = query.order_by(desc(BaseProperty.created_at))
#             query = query.offset(skip).limit(limit)
            
#             result = await self.db.execute(query)
#             return result.unique().scalars().all()


#     async def get_count_by_sub_category(self,
#                                         sub_category:str,
#                                         status: Optional[str] = "Active"
#                                         ) -> int:
#         normalized_sub_category = sub_category.strip()
        
#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.sub_category == normalized_sub_category)

#         if status:
#             query = query.where(BaseProperty.status == status)
                
#         result = await self.db.execute(query)
#         return result.scalar() or 0
        
    
#     async def get_count_by_category(
#         self,
#         property_category: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count by category (case-insensitive)"""
        
#         # ✅ Normalize the input
#         normalized_category = property_category.strip().upper()
        
#         # ✅ Validate against enum values
#         valid_categories = [e.value for e in PropertyCategory]
#         if normalized_category not in valid_categories:
#             raise ValueError(
#                 f"Invalid property_category: '{property_category}'. "
#                 f"Must be one of: {', '.join(valid_categories)}"
#             )
        
#         query = select(func.count()).select_from(BaseProperty)
#         query = query.where(BaseProperty.property_category == normalized_category)
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         result = await self.db.execute(query)
#         return result.scalar() or 0
    
#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by property type"""
#         query = select(BaseProperty).where(BaseProperty.property_type == property_type)
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         query = query.options(
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents),
#             joinedload(BaseProperty.OwnerProperty),
#             joinedload(BaseProperty.agent_details)
#         )
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)
        
#         result = await self.db.execute(query)
#         return result.unique().scalars().all()
    
#     async def get_count_by_property_type(
#         self,
#         property_type: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by property type"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.property_type == property_type
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0
    
#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20,
#         status: Optional[str] = "Active"
#     ) -> List[BaseProperty]:
#         """Get properties by listing purpose"""
#         query = select(BaseProperty).where(BaseProperty.listing_purpose == listing_purpose)
        
#         if status:
#             query = query.where(BaseProperty.status == status)
        
#         query = query.options(
#             selectinload(BaseProperty.media),
#             selectinload(BaseProperty.documents)
#         )
#         query = query.order_by(desc(BaseProperty.created_at))
#         query = query.offset(skip).limit(limit)
        
#         result = await self.db.execute(query)
#         return result.unique().scalars().all()
    
#     async def get_count_by_purpose(
#         self,
#         listing_purpose: str,
#         status: Optional[str] = "Active"
#     ) -> int:
#         """Get count of properties by listing purpose"""
#         query = select(func.count()).select_from(BaseProperty).where(
#             BaseProperty.listing_purpose == listing_purpose
#         )
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0


#     async def get_property_by_user_id(
#             self,
#             user_id: str,
#             skip: int = 0,
#             limit: int = 20,
#             status: Optional[str] = "Active"
#         ) -> List[BaseProperty]:
#             """Get properties by user id """
#             query = select(BaseProperty).where(BaseProperty.user_id == user_id)
            
#             if status:
#                 query = query.where(BaseProperty.status == status)
            
#             query = query.options(
#                 selectinload(BaseProperty.media),
#                 selectinload(BaseProperty.documents)
#             )
#             query = query.order_by(desc(BaseProperty.created_at))
#             query = query.offset(skip).limit(limit)
            
#             result = await self.db.execute(query)
#             return result.unique().scalars().all()


#     async def get_count_by_user_id_property(
#             self,
#             user_id:str,
#             status: Optional[str] = "Active"
#     )-> int:
#         query = select(func.count()).select_from(BaseProperty).where(
#                     BaseProperty.user_id == user_id)
#         if status:
#             query = query.where(BaseProperty.status == status)
#         result = await self.db.execute(query)
#         return result.scalar() or 0
        
    
#     # ============================================
#     # UPDATE OPERATIONS
#     # ============================================
    
#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any]
#     ) -> Optional[BaseProperty]:
#         """Update property data"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             for key, value in update_data.items():
#                 if hasattr(property_obj, key):
#                     setattr(property_obj, key, value)
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None
    
#     async def update_property_status(
#         self,
#         property_id: int,
#         status: str
#     ) -> Optional[BaseProperty]:
#         """Update property status"""
#         property_obj = await self.get_property_by_id(property_id)
#         if property_obj:
#             property_obj.status = status
#             await self.db.flush()
#             await self.db.refresh(property_obj)
#             return property_obj
#         return None
    
#     # ============================================
#     # DELETE OPERATIONS
#     # ============================================
    
#     async def delete_property(self, property_id: int) -> bool:
#         """Delete property and all related records"""
#         property_obj = await self.get_property_by_id(property_id)
#         if not property_obj:
#             return False
        
#         # Delete role-specific details
#         await self.db.execute(
#             delete(OwnerProperty).where(OwnerProperty.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyAgentDetails).where(PropertyAgentDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyBuilderDetails).where(PropertyBuilderDetails.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyManagementProperty).where(PropertyManagementProperty.property_id == property_id)
#         )
        
#         # Delete media and documents
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )
        
#         # Delete property
#         await self.db.delete(property_obj)
#         await self.db.flush()
#         return True
    
#     async def delete_property_media(self, property_id: int):
#         """Delete all media for a property"""
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.flush()
    
#     async def delete_property_video(self, property_id: int):
#         """Delete video for a property"""
#         await self.db.execute(
#             delete(PropertyMedia)
#             .where(
#                 and_(
#                     PropertyMedia.property_id == property_id,
#                     PropertyMedia.media_type == 'video'
#                 )
#             )
#         )
#         await self.db.flush()
    
#     async def delete_property_documents(self, property_id: int):
#         """Delete all documents for a property"""
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )
#         await self.db.flush()
    
#     # ============================================
#     # TRANSACTION MANAGEMENT
#     # ============================================
    
#     async def commit(self):
#         """Commit current transaction"""
#         await self.db.commit()
    
#     async def rollback(self):
#         """Rollback current transaction"""
#         await self.db.rollback()
    
#     async def flush(self):
#         """Flush current transaction"""
#         await self.db.flush()

























































# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func, delete
# from typing import Optional, List, Dict, Any
# from app.models import Property, PropertyMedia, PropertyDocument
# from app.models.property_owner import PropertyOwnerDetails
# from app.models.property_agent import PropertyAgentDetails
# from app.models.property_builder import PropertyBuilderDetails
# from app.models.property_hostel import PropertyHostelDetails
# from app.models.property_pm import PropertyPMDetails

# class PropertyRepository:
#     def __init__(self, db: AsyncSession):
#         self.db = db
    
#     async def create(self, property_data: Dict[str, Any]) -> Property:
#         property = Property(**property_data)
#         self.db.add(property)
#         await self.db.flush()
#         return property
    
#     async def create_details(self, form_type: str, property_id: int, details_data: Dict[str, Any]):
#         detail_models = {
#             "owner": PropertyOwnerDetails,
#             "agent": PropertyAgentDetails,
#             "builder": PropertyBuilderDetails,
#             "hostel": PropertyHostelDetails,
#             "pm": PropertyPMDetails,
#         }
        
#         model = detail_models.get(form_type)
#         if model:
#             detail = model(property_id=property_id, **details_data)
#             self.db.add(detail)
#             await self.db.flush()
#             return detail
#         return None
    
#     async def add_media(self, property_id: int, media_data: List[Dict[str, Any]]):
#         for data in media_data:
#             media = PropertyMedia(property_id=property_id, **data)
#             self.db.add(media)
#         await self.db.flush()
    
#     async def add_documents(self, property_id: int, documents_data: List[Dict[str, Any]]):
#         for data in documents_data:
#             doc = PropertyDocument(property_id=property_id, **data)
#             self.db.add(doc)
#         await self.db.flush()
    
#     async def get_by_id(self, property_id: int) -> Optional[Property]:
#         result = await self.db.execute(
#             select(Property).where(Property.id == property_id)
#         )
#         return result.scalar_one_or_none()
    
#     async def increment_view_count(self, property_id: int):
#         property = await self.get_by_id(property_id)
#         if property:
#             property.view_count += 1
#             await self.db.flush()
#             return property
#         return None
    
#     async def get_all(self, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(Property.status == "Active")
        
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
        
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.scalars().all()
        
#         return properties, total
    
#     async def update(self, property_id: int, update_data: Dict[str, Any]) -> Optional[Property]:
#         property = await self.get_by_id(property_id)
#         if property:
#             for key, value in update_data.items():
#                 if hasattr(property, key):
#                     setattr(property, key, value)
#             await self.db.flush()
#             await self.db.refresh(property)
#             return property
#         return None
    
#     async def clear_media(self, property_id: int):
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.flush()
    
#     async def delete(self, property_id: int) -> bool:
#         property = await self.get_by_id(property_id)
#         if property:
#             await self.db.delete(property)
#             await self.db.flush()
#             return True
#         return False
    
#     async def commit(self):
#         await self.db.commit()


#     async def get_by_category(self, category: str, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(
#             Property.property_category == category,
#             Property.status == "Active"
#         )
    
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
    
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.scalars().all()
    
#         return properties, total
    

#     async def get_by_purpose(self, listing_purpose: str, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(
#             Property.listing_purpose == listing_purpose,
#             Property.status == "Active"
#         )
    
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
    
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.scalars().all()
    
#         return properties, total









# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, func, delete
# from sqlalchemy.orm import joinedload
# from typing import Optional, List, Dict, Any
# from app.models import Property, PropertyMedia, PropertyDocument
# from app.models.property_owner import OwnerProperty as PropertyOwnerDetails
# from app.models.property_agent import PropertyAgentDetails
# from app.models.property_builder import PropertyBuilderDetails
# from app.models.property_pm import PropertyManagementProperty as PropertyPMDetails

# class PropertyRepository:
#     def __init__(self, db: AsyncSession):
#         self.db = db
    
#     async def create(self, property_data: Dict[str, Any]) -> Property:
#         property = Property(**property_data)
#         self.db.add(property)
#         await self.db.flush()
#         return property
    
#     async def create_details(self, form_type: str, property_id: int, details_data: Dict[str, Any]):
#         detail_models = {
#             "owner": PropertyOwnerDetails,
#             "agent": PropertyAgentDetails,
#             "builder": PropertyBuilderDetails,
#             "pm": PropertyPMDetails,
#         }
        
#         model = detail_models.get(form_type)
#         if model:
#             detail = model(property_id=property_id, **details_data)
#             self.db.add(detail)
#             await self.db.flush()
#             return detail
#         return None
    
#     async def add_media(self, property_id: int, media_data: List[Dict[str, Any]]):
#         for data in media_data:
#             media = PropertyMedia(property_id=property_id, **data)
#             self.db.add(media)
#         await self.db.flush()
    
#     async def add_documents(self, property_id: int, documents_data: List[Dict[str, Any]]):
#         for data in documents_data:
#             doc = PropertyDocument(property_id=property_id, **data)
#             self.db.add(doc)
#         await self.db.flush()
    
#     async def get_by_id(self, property_id: int) -> Optional[Property]:
#         result = await self.db.execute(
#             select(Property)
#             .where(Property.id == property_id)
#             .options(
#                 joinedload(Property.media),
#                 joinedload(Property.documents)
#             )
#         )
#         return result.unique().scalar_one_or_none()
    
#     async def increment_view_count(self, property_id: int):
#         property = await self.get_by_id(property_id)
#         if property:
#             property.view_count += 1
#             await self.db.flush()
#             return property
#         return None
    
#     async def get_all(self, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(Property.status == "Active")
#         query = query.options(
#             joinedload(Property.media),
#             joinedload(Property.documents)
#         )
        
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
        
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.unique().scalars().all()
        
#         return properties, total
    
#     async def get_by_category(self, category: str, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(
#             Property.property_category == category,
#             Property.status == "Active"
#         )
#         query = query.options(
#             joinedload(Property.media),
#             joinedload(Property.documents)
#         )
    
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
    
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.unique().scalars().all()
    
#         return properties, total
    
#     async def get_by_purpose(self, listing_purpose: str, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(
#             Property.listing_purpose == listing_purpose,
#             Property.status == "Active"
#         )
#         query = query.options(
#             joinedload(Property.media),
#             joinedload(Property.documents)
#         )
    
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
    
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.unique().scalars().all()
    
#         return properties, total
    
#     async def get_by_property_type(self, property_type: str, skip: int = 0, limit: int = 20) -> tuple[List[Property], int]:
#         query = select(Property).where(
#             Property.property_type == property_type,
#             Property.status == "Active"
#         )
#         query = query.options(
#             joinedload(Property.media),
#             joinedload(Property.documents)
#         )
    
#         count_query = select(func.count()).select_from(query.subquery())
#         total = await self.db.scalar(count_query)
    
#         query = query.order_by(Property.created_at.desc())
#         query = query.offset(skip).limit(limit)
#         result = await self.db.execute(query)
#         properties = result.unique().scalars().all()
    
#         return properties, total
    
#     async def update(self, property_id: int, update_data: Dict[str, Any]) -> Optional[Property]:
#         property = await self.get_by_id(property_id)
#         if property:
#             for key, value in update_data.items():
#                 if hasattr(property, key):
#                     setattr(property, key, value)
#             await self.db.flush()
#             await self.db.refresh(property)
#             return property
#         return None
    
#     async def clear_media(self, property_id: int):
#         await self.db.execute(
#             delete(PropertyMedia).where(PropertyMedia.property_id == property_id)
#         )
#         await self.db.flush()
    
#     async def clear_documents(self, property_id: int):
#         await self.db.execute(
#             delete(PropertyDocument).where(PropertyDocument.property_id == property_id)
#         )
#         await self.db.flush()
    
#     async def delete(self, property_id: int) -> bool:
#         property = await self.get_by_id(property_id)
#         if property:
#             await self.db.delete(property)
#             await self.db.flush()
#             return True
#         return False
    
#     async def commit(self):
#         await self.db.commit()