from datetime import date, datetime
from typing import Any, Dict, Optional, List
from fastapi import HTTPException, UploadFile
from sqlalchemy import inspect as sa_inspect
from fastapi import status

from app.models.property import PostedBy, PropertyStatus
from app.core.response_utils import PropertyFormatter
from app.services.file_service import FileService
from app.repositories.profile_repository import VendorProfileRepository
from app.schemas.vendor_profile_details import ROLE_EXTRA_COLUMN, ROLE_EXTRA_SCHEMA


VENDOR_TYPE_MAP: Dict[str, PostedBy] = {
    "owner": PostedBy.OWNER,
    "agent": PostedBy.AGENT,
    "builder": PostedBy.BUILDER,
    "property-management": PostedBy.PROPERTY_MANAGEMENT,
}

LOGO_FIELD_BY_ROLE: Dict[PostedBy, str] = {
    PostedBy.AGENT: "agency_logo_url",
    PostedBy.BUILDER: "company_logo_url",
    PostedBy.PROPERTY_MANAGEMENT: "company_logo_url",
}


class ProfileService:

    def __init__(self, profile_repository: VendorProfileRepository, file_service: Optional[FileService] = None):
        self.vendor_profile_repository = profile_repository
        self.formatter = PropertyFormatter()
        self.file_service = file_service or FileService()  # Create FileService if not provided


    @staticmethod
    def resolve_vendor_type(vendor_type: str) -> PostedBy:
        posted_by = VENDOR_TYPE_MAP.get(vendor_type)
        if not posted_by:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid vendor type '{vendor_type}'. Must be one of: {', '.join(VENDOR_TYPE_MAP.keys())}",
            )
        return posted_by

    @staticmethod
    def model_to_dict(obj) -> Dict[str, Any]:
        if obj is None:
            return {}
        mapper = sa_inspect(obj).mapper
        result: Dict[str, Any] = {}
        for column in mapper.columns:
            value = getattr(obj, column.key)
            if isinstance(value, (datetime, date)):
                value = value.isoformat()
            result[column.key] = value
        return result

    def assert_owns_property(self, prop, user_id: str, posted_by: PostedBy):
        """Ownership check on an already-fetched property row (fetched via
        PropertyService by a caller that composes both services)."""
        if (
            not prop
            or prop.user_id != user_id
            or (prop.posted_by and prop.posted_by != posted_by.value)
        ):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        return prop

    def format_property_list(self, properties, total_count: int, skip: int, limit: int) -> Dict[str, Any]:
        """Formats a raw (properties, total_count) pair - fetched via
        PropertyService by a caller that composes both services - into the
        existing vendor property-list response shape."""
        formatted = [self.to_response(p) for p in properties if p]
        return {
            "data": formatted,
            "pagination": {
                "total": total_count,
                "page": (skip // limit) + 1 if limit > 0 else 1,
                "limit": limit,
                "totalPages": (total_count + limit - 1) // limit if limit > 0 else 0,
            },
        }


    def to_response(self, property_obj) -> Optional[Dict[str, Any]]:
        if not property_obj:
            return None
        
        property_data = {
            # Basic identifiers
            'id': property_obj.id,
            'user_id': property_obj.user_id,
            
            # Listing and property categorization
            'postedBy': property_obj.posted_by if property_obj.posted_by else None,
            'propertyType': property_obj.property_type,
            'propertyTitle': property_obj.property_title,
            'listingPurpose': property_obj.listing_purpose if property_obj.listing_purpose else None,
            'propertyCategory': property_obj.property_category if property_obj.property_category else None,
            
            # Location details
            'propertyAddress': property_obj.address,
            'area': property_obj.area,
            'city': property_obj.city,
            'district': property_obj.district,
            'state': property_obj.state,
            'pincode': property_obj.pin_code,
            'landmark': property_obj.landmark,
            
            # Property details
            'bedrooms': property_obj.bedrooms,
            'bathrooms': property_obj.bathrooms,
            'floorNumber': property_obj.floor_number,
            'totalFloors': property_obj.total_floors,
            'propertyAge': int(property_obj.property_age) if property_obj.property_age and property_obj.property_age else None,
            'cornerUnit': property_obj.corner_unit,
            'facing': property_obj.facing_direction,
            
            # Area details
            'carpetArea': float(property_obj.carpet_area) if property_obj.carpet_area else None,
            'builtUpArea': float(property_obj.built_up_area) if property_obj.built_up_area else None,
            'hasGarden': property_obj.garden_space,
            
            # Furnishing & Features
            'furnishingStatus': property_obj.furnishing_status,
            'hasTerrace': property_obj.terrace,
            'hasBalcony': property_obj.balcony,
            'highlights': property_obj.interior_features if property_obj.interior_features else [],
            
            # Parking
            'parking': property_obj.parking,
            'parkingSpaces': property_obj.parking_capacity,
            
            # Amenities and nearby places
            'amenities': property_obj.amenities if property_obj.amenities else [],
            'nearbyPlaces': property_obj.nearby_places if property_obj.nearby_places else [],
            
            # Tenant preferences
            'occupancyType': property_obj.tenant_type[0] if property_obj.tenant_type and len(property_obj.tenant_type) > 0 else None,
            'smokingAllowed': property_obj.smoking_allowed,
            'dietaryPreference': property_obj.dietary_preference,
            'petFriendly': property_obj.pet_friendly,
            
            # Availability
            'availableFrom': property_obj.available_from.isoformat() if property_obj.available_from else None,
            'immediateMoveIn': property_obj.immediate_move_in,
            'rentalDuration': property_obj.minimum_duration,
            
            # Pricing
            'expectedPrice': property_obj.expected_price,
            'budgetMin': float(property_obj.price_min) if property_obj.price_min else None,
            'budgetMax': float(property_obj.price_max) if property_obj.price_max else None,
            'isNegotiable': property_obj.price_negotiable,
            'securityDeposit': property_obj.security_deposit,
            'maintenanceIncluded': property_obj.maintenance_included,
            'maintenance': float(property_obj.maintenance_amount) if property_obj.maintenance_amount else None,
            
            # Ownership and property details
            'ownershipType': property_obj.ownership_type,
            'loanOutstanding': property_obj.loan_outstanding,
            'propertyCondition': property_obj.property_condition,
            'propertyStatus': property_obj.status,
            
            # Sell specific fields
            'propertyTax': property_obj.property_tax,
            'titleDeedVerified': property_obj.title_deed_verify,
            'underConstruction': property_obj.underconstruction,
            'immediatePossession': property_obj.immediate_possession,
            'reraApproved': property_obj.rera_approved,
            'homeLoanRequired': property_obj.loan_eligible,
            
            # Lease specific fields
            'renewableOption': property_obj.renewable_option,
            'leaseDuration': property_obj.lease_terms,
            'advanceDeposit': property_obj.security_deposit,  # duplicate but kept for compatibility
            
            # Commercial specific fields
            'commercialType': property_obj.commercial_type,
            'businessType': property_obj.business_type,
            'estimatedFootfall': property_obj.estimated_footfall,
            'operatingHours': property_obj.operating_hours,
            'zoningType': property_obj.zoning_type,
            'leaseType': property_obj.lease_type,
            'fitOut': property_obj.fit_out,
            'frontageWidth': property_obj.frontage_width,
            'ceilingHeight': property_obj.ceiling_height,
            'powerLoadCapacity': property_obj.power_load_capacity,
            'appliancesIncluded': property_obj.appliance_included if property_obj.appliance_included else [],
            
            # Additional fields
            'nearbyConnectivity': property_obj.nearby_connectivity,
            'rentalTerm': property_obj.rental_term,
            
            # Hostel specific fields
            'hostelType': property_obj.hostel_type,
            'roomType': property_obj.room_type if property_obj.room_type else [],
            'sharingType': property_obj.sharing_type if property_obj.sharing_type else [],
            'totalCapacity': property_obj.total_capacity,
            'hostelCategory': property_obj.hostel_category,
            'genderType': property_obj.gender_type,
            
            # Land specific fields
            'landSubCategory': property_obj.sub_category,  # duplicate but kept for compatibility
            'totalSqft': float(property_obj.built_up_area) if property_obj.built_up_area else None,  # duplicate
            'landArea': property_obj.land_area,
            'landAreaMin': property_obj.land_area_min,
            'landAreaMax': property_obj.land_area_max,
            'areaUnit': property_obj.area_unit,
            'landShape': property_obj.land_shape,
            'roadWidth': property_obj.road_width,
            'waterSource': property_obj.water_source,
            'soilType': property_obj.soil_type,
            'electricityAvailable': property_obj.electricity_available,
            'selectedFeatures': property_obj.selected_feature if property_obj.selected_feature else [],
            
            # Payment and stay details
            'paymentMode': property_obj.payment_mode,
            'alcoholAllowed': property_obj.alcohol_allowed,
            'minimumStayDuration': property_obj.minimum_stay_duration,
            'constructionStatus': property_obj.construction_status,
            'possessionTimeline': property_obj.possession_timeline,
            'readyToBuy': property_obj.ready_to_buy,
            'paymentFrequency': property_obj.payment_frequency,
            'foodIncluded': property_obj.food_included,
            'foodType': property_obj.food_type,
            'mealsPerDay': property_obj.meals_per_day,
            'kitchenAccess': property_obj.kitchen_access,
            'bathroomType': property_obj.bathroom_type,
            'utilitiesIncluded': property_obj.utilities_included,
            'rentalFrequency': property_obj.rental_frequency,
            
            # Status and timestamps
            'status': property_obj.status or 'Active',
            'createdAt': property_obj.created_at.isoformat() if property_obj.created_at else None,
            'updatedAt': property_obj.updated_at.isoformat() if property_obj.updated_at else None,
            
            # Media and documents
            'images': self.formatter.format_media(property_obj.media) if property_obj.media else [],
            'documents': self.formatter.format_documents(property_obj.documents) if property_obj.documents else [],

            # Per-property contact person (owner_properties/agent_properties/
            # builder_properties/property_management_properties) - profile-page
            # views only, never the public card/list.
            'contactPersonDetails': self._get_profile_data(property_obj),
        }

        property_data = self.formatter.strip_none_values(property_data)
        
        return property_data
        

    def _to_profile_response(self, vendorprofile, posted_by: Optional[str] = None):
        profile = {
            "id":vendorprofile.id,
            "userId":vendorprofile.user_id,
            "fullName":vendorprofile.full_name,
            "phoneNumber":vendorprofile.phone_number,
            "whatsappNumber":vendorprofile.whatsapp_number,
            "gender":vendorprofile.gender,
            "profilePhotoUrl":vendorprofile.profile_picture,
            "companyLogoUrl":vendorprofile.company_logo_url,
            "companyName":vendorprofile.company_name,
            "address":vendorprofile.address,
            "city":vendorprofile.city,
            "district":vendorprofile.district,
            "state":vendorprofile.state,
            "country":vendorprofile.country,
            "pincode":vendorprofile.pincode,
            "aadharNumber":vendorprofile.aadhar_number,
            "aadhaarNumber":vendorprofile.aadhar_number,
            "panNumber":vendorprofile.pan_number,
            "bankName":vendorprofile.bank_name,
            "accountHolderName":vendorprofile.account_holder_name,
            "accountNumber":vendorprofile.account_number,
            "ifscCode":vendorprofile.ifsc_code,
            "upiId":vendorprofile.upi_id,
            "website":vendorprofile.website,
            "facebook":vendorprofile.facebook,
            "instagram":vendorprofile.instagram,
            "linkedIn":vendorprofile.linkedin,
            "youtube":vendorprofile.youtube,
            "preferredContactMethod":vendorprofile.preferred_contact_method,
            "preferredContactTime":vendorprofile.preferred_contact_time,
            "agencyDetails":vendorprofile.agency_details,
            "builderDetails":vendorprofile.builder_details,
            "pmDetails":vendorprofile.pm_details,
            "ownerDetails":getattr(vendorprofile, "owner_details", None),
        }

        # Flatten the role-specific JSONB blob into the same top-level
        # camelCase keys the profile-edit forms read (they don't know about
        # agencyDetails/builderDetails/pmDetails/ownerDetails nesting) - the
        # inverse of VendorProfileRepository.update_vendor_profile's split.
        extra_schema = ROLE_EXTRA_SCHEMA.get(posted_by)
        extra_column = ROLE_EXTRA_COLUMN.get(posted_by)
        if extra_schema and extra_column:
            raw_extra = getattr(vendorprofile, extra_column, None) or {}
            for field_name, field in extra_schema.model_fields.items():
                if field.alias:
                    profile[field.alias] = raw_extra.get(field_name)

        return profile

    def _get_profile_data(self, property_obj) -> Optional[Dict[str, Any]]:
        """Build 'contactPersonDetails' for a vendor's OWN property view (profile
        pages only - never the public card/list, which stays contact-free).

        This is per-PROPERTY data (owner_properties/agent_properties/
        builder_properties/property_management_properties - whatever was filled
        in on that property's own posting form), NOT the vendor's persistent
        vendor_profile row. The two are intentionally different: vendor_profile
        drives the profile page's own header/"easy navigation" summary and is
        editable independently; this drives the per-property contact block, which
        can legitimately differ per listing (e.g. a property management company
        naming a different on-site contact for one specific property).

        Normalizes the four role-specific formatters into one shape carrying the
        union of their fields, so the frontend can render one block without
        per-role branching, while still keeping every role-specific field
        (agency/company name, RERA, GST, experience, service area, socials, ...)
        that format_owner_details/format_agent_details/format_builder_details/
        format_property_management_details (app/core/response_utils.py) already
        produce - nothing from those is dropped, only renamed onto shared keys
        where the concept overlaps (fullName -> name, mobileNumber -> mobile,
        emailAddress -> emailId, agencyName -> companyName).
        """
        if not property_obj or not property_obj.posted_by:
            return None

        posted_by = property_obj.posted_by

        if posted_by == 'OWNER':
            raw = self.formatter.format_owner_details(property_obj)
            if not raw:
                return None
            return {
                'name': raw.get('fullName'),
                'mobile': raw.get('mobileNumber'),
                'emailId': raw.get('emailAddress'),
                'profilePhotoUrl': raw.get('profilePhotoUrl'),
                'dateOfBirth': raw.get('dateOfBirth'),
                'gender': raw.get('gender'),
                'aadhaarNumber': raw.get('aadhaarNumber'),
                'panNumber': raw.get('panNumber'),
                'addressLine1': raw.get('addressLine1'),
                'addressLine2': raw.get('addressLine2'),
                'city': raw.get('city'),
                'state': raw.get('state'),
                'pincode': raw.get('pincode'),
                'preferredContactMethod': raw.get('preferredContactMethod'),
                'preferredContactTime': raw.get('preferredContactTime'),
                'additionalNote': raw.get('additionalNote'),
                'bankName': raw.get('bankName'),
                'accountHolderName': raw.get('accountHolderName'),
                'accountNumber': raw.get('accountNumber'),
                'ifscCode': raw.get('ifscCode'),
                'upiId': raw.get('upiId'),
            }

        elif posted_by == 'AGENT':
            raw = self.formatter.format_agent_details(property_obj)
            if not raw:
                return None
            return {
                'name': raw.get('fullName'),
                'mobile': raw.get('mobileNumber'),
                'emailId': raw.get('emailId'),
                'profilePhotoUrl': raw.get('profilePhotoUrl'),
                'dateOfBirth': raw.get('dateOfBirth'),
                'gender': raw.get('gender'),
                'companyLogo': raw.get('companyLogo'),
                'companyName': raw.get('agencyName'),
                'officeAddress': raw.get('officeAddress'),
                'reraRegistrationNumber': raw.get('reraRegistrationNumber'),
                'gstNumber': raw.get('gstNumber'),
                'experience': raw.get('experience'),
                'activeListing': raw.get('activeListing'),
                'serviceArea': raw.get('serviceArea'),
                'bankName': raw.get('bankName'),
                'accountHolderName': raw.get('accountHolderName'),
                'accountNumber': raw.get('accountNumber'),
                'ifscCode': raw.get('ifscCode'),
                'upiId': raw.get('upiId'),
            }

        elif posted_by == 'BUILDER':
            raw = self.formatter.format_builder_details(property_obj)
            if not raw:
                return None
            return {
                'name': raw.get('fullName'),
                'designation': raw.get('designation'),
                'mobile': raw.get('mobileNumber'),
                'whatsappNumber': raw.get('whatsappNumber'),
                'emailId': raw.get('emailId'),
                'profilePhotoUrl': raw.get('profilePhotoUrl'),
                'companyLogo': raw.get('companyLogo'),
                'companyName': raw.get('companyName'),
                'companyRegNumber': raw.get('companyRegNumber'),
                'companyWebsite': raw.get('companyWebsite'),
                'companyProfile': raw.get('companyProfile'),
                'officeAddress': raw.get('officeAddress'),
                'city': raw.get('city'),
                'district': raw.get('district'),
                'state': raw.get('state'),
                'pincode': raw.get('pincode'),
                'landmark': raw.get('landmark'),
                'website': raw.get('website'),
                'facebook': raw.get('facebook'),
                'instagram': raw.get('instagram'),
                'linkedin': raw.get('linkedin'),
                'youtube': raw.get('youtube'),
                'reraRegistrationNumber': raw.get('reraRegistrationNumber'),
                'gstNumber': raw.get('gstNumber'),
                'experience': raw.get('experience'),
                'aadhaarNumber': raw.get('aadhaarNumber'),
                'panNumber': raw.get('panNumber'),
                'bankName': raw.get('bankName'),
                'accountHolderName': raw.get('accountHolderName'),
                'accountNumber': raw.get('accountNumber'),
                'ifscCode': raw.get('ifscCode'),
                'upiId': raw.get('upiId'),
            }

        elif posted_by == 'PROPERTY_MANAGEMENT':
            raw = self.formatter.format_property_management_details(property_obj)
            if not raw:
                return None
            return {
                'name': raw.get('fullName'),
                'designation': raw.get('designation'),
                'mobile': raw.get('mobileNumber'),
                'whatsappNumber': raw.get('whatsappNumber'),
                'emailId': raw.get('emailId'),
                'profilePhotoUrl': raw.get('profilePhotoUrl'),
                'companyLogo': raw.get('companyLogo'),
                'companyName': raw.get('companyName'),
                'companyRegNumber': raw.get('companyRegNumber'),
                'companyWebsite': raw.get('companyWebsite'),
                'companyProfile': raw.get('companyDescription'),
                'officeAddress': raw.get('officeAddress'),
                'city': raw.get('city'),
                'district': raw.get('district'),
                'state': raw.get('state'),
                'pincode': raw.get('pincode'),
                'landmark': raw.get('landmark'),
                'website': raw.get('website'),
                'facebook': raw.get('facebook'),
                'instagram': raw.get('instagram'),
                'linkedin': raw.get('linkedin'),
                'youtube': raw.get('youtube'),
                'reraRegistrationNumber': raw.get('reraRegistrationNumber'),
                'gstNumber': raw.get('gstNumber'),
                'experience': raw.get('experience'),
                'aadhaarNumber': raw.get('aadhaarNumber'),
                'panNumber': raw.get('panNumber'),
                'bankName': raw.get('bankName'),
                'accountHolderName': raw.get('accountHolderName'),
                'accountNumber': raw.get('accountNumber'),
                'ifscCode': raw.get('ifscCode'),
                'upiId': raw.get('upiId'),
            }

        return None


    async def get_vendor_profile(self, user_id: str, vendor_type: Optional[str] = None) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type).value if vendor_type else None
        profile = await self.vendor_profile_repository.get_vendor_profile(user_id)
        profile = self._to_profile_response(profile, posted_by)
        return self.formatter.strip_none_values(profile)

    async def update_vendor_profile(
        self, user_id: str, vendor_type: str, update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        # VendorProfile itself is keyed only by user_id (one profile row per
        # user) but which JSONB "extra fields" blob a field belongs in (see
        # app.schemas.vendor_profile_details) depends on the role.
        posted_by = self.resolve_vendor_type(vendor_type)
        profile_obj = await self.vendor_profile_repository.update_vendor_profile(
            user_id, posted_by.value, update_data
        )
        if not profile_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} to create one.",
            )
        await self.vendor_profile_repository.commit()
        return self.formatter.strip_none_values(self._to_profile_response(profile_obj, posted_by.value))

    async def upload_vendor_profile_photo(
        self, user_id: str, vendor_type: str, file: UploadFile
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)

        upload_result = await self.file_service.upload_image(
            file=file,
            user_id=user_id,
            property_id="profile",  # not a real property - just a storage path segment
            field_name="profilePhoto",
            is_primary=True,
        )

        profile_obj = await self.vendor_profile_repository.update_vendor_profile(
            user_id, posted_by.value, {"profile_photo_url": upload_result["file_url"]}
        )
        if not profile_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} before uploading a photo.",
            )
        await self.vendor_profile_repository.commit()
        return {"profile_photo_url": profile_obj.profile_picture}

    async def upload_vendor_logo(
        self, user_id: str, vendor_type: str, file: UploadFile
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        logo_field = LOGO_FIELD_BY_ROLE.get(posted_by)
        if not logo_field:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{vendor_type}' profiles don't have a logo (owners aren't a company).",
            )

        field_name = "agencyLogo" if posted_by == PostedBy.AGENT else "companyLogo"
        upload_result = await self.file_service.upload_image(
            file=file,
            user_id=user_id,
            property_id="profile",
            field_name=field_name,
            is_primary=True,
        )

        profile_obj = await self.vendor_profile_repository.update_vendor_profile(
            user_id, posted_by.value, {logo_field: upload_result["file_url"]}
        )
        if not profile_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} before uploading a logo.",
            )
        await self.vendor_profile_repository.commit()
        return {logo_field: profile_obj.company_logo_url}

    async def delete_vendor_profile_photo(self, user_id: str, vendor_type: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        profile_obj = await self.vendor_profile_repository.get_vendor_profile(user_id)
        if not profile_obj or not profile_obj.profile_picture:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No profile photo to delete")

        old_url = profile_obj.profile_picture
        await self.vendor_profile_repository.update_vendor_profile(user_id, posted_by.value, {"profile_photo_url": None})
        await self.vendor_profile_repository.commit()

        # Best-effort storage cleanup - a failure here shouldn't block the
        # DB update from sticking.
        try:
            await self.file_service.delete_files([old_url])
        except Exception as e:
            print(f"⚠️ Failed to delete old profile photo from storage: {e}")

        return {"deleted": True}

    async def delete_vendor_logo(self, user_id: str, vendor_type: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        logo_field = LOGO_FIELD_BY_ROLE.get(posted_by)
        if not logo_field:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{vendor_type}' profiles don't have a logo.",
            )

        profile_obj = await self.vendor_profile_repository.get_vendor_profile(user_id)
        old_url = profile_obj.company_logo_url if profile_obj else None
        if not old_url:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No logo to delete")

        await self.vendor_profile_repository.update_vendor_profile(user_id, posted_by.value, {logo_field: None})
        await self.vendor_profile_repository.commit()

        try:
            await self.file_service.delete_files([old_url])
        except Exception as e:
            print(f"⚠️ Failed to delete old logo from storage: {e}")

        return {"deleted": True}

    # profile_picture/company_logo_url are single columns on VendorProfile -
    # one row per user, not per vendor_type/role - so the field_name (which
    # image slot) is all that's needed here; there's no role to resolve.
    # "OWNER" below is a required-but-inert argument: update_vendor_profile
    # only consults posted_by to route role-specific JSONB "extra" fields,
    # and these are plain columns, never role-extra fields.
    _IMAGE_DB_COLUMN_TO_REAL_COLUMN = {
        "profile_photo_url": "profile_picture",
        "agency_logo_url": "company_logo_url",
        "company_logo_url": "company_logo_url",
    }

    async def update_vendor_profile_image_by_field(
        self, user_id: str, field_name: str, file: UploadFile
    ) -> Dict[str, Any]:
        from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
        db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
        if not db_column:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unknown field_name '{field_name}'")

        upload_result = await self.file_service.upload_vendor_profile_image(
            file=file, user_id=user_id, field_name=field_name
        )
        profile_obj = await self.vendor_profile_repository.update_vendor_profile(
            user_id, "OWNER", {db_column: upload_result["file_url"]}
        )
        if not profile_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No vendor profile found for this user.")
        await self.vendor_profile_repository.commit()
        return upload_result

    async def delete_vendor_profile_image_by_field(self, user_id: str, field_name: str) -> None:
        from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
        db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
        if not db_column:
            return

        real_column = self._IMAGE_DB_COLUMN_TO_REAL_COLUMN.get(db_column, db_column)
        profile = await self.vendor_profile_repository.get_vendor_profile(user_id)
        current_url = getattr(profile, real_column, None) if profile else None
        if not current_url:
            return

        await self.file_service.delete_files([current_url])
        await self.vendor_profile_repository.update_vendor_profile(user_id, "OWNER", {db_column: None})
        await self.vendor_profile_repository.commit()


    async def delete_profile_file(self, file_path: str, user_id: str, vendor_documents: List[Any]) -> Dict[str, Any]:
        if not await self._user_owns_profile_file(user_id, file_path, vendor_documents):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this file.",
            )
        await self.file_service.delete_files([file_path])
        return {"deleted": True}

    async def _user_owns_profile_file(self, user_id: str, file_path: str, vendor_documents: List[Any]) -> bool:
        """Every URL this user is actually allowed to delete: their own
        persistent profile photo/logo, or one of their profile-level
        (property_id is null) documents - never an arbitrary path a client
        happens to pass in. vendor_documents is fetched by the caller via
        PropertyService (PropertyDocument is Property-domain data)."""
        profile = await self.vendor_profile_repository.get_vendor_profile(user_id)
        if profile and file_path in {profile.profile_picture, profile.company_logo_url}:
            return True
        return any(doc.file_url == file_path for doc in vendor_documents)

    def format_profile_files_for_role(self, posted_by, detail_obj) -> Optional[Dict[str, Any]]:
        """Pure formatting - detail_obj is fetched by the caller via
        PropertyService (the four per-property vendor-detail tables are
        Property-domain data)."""
        if not detail_obj:
            return None
        role_files = {"profile_photo_url": getattr(detail_obj, "profile_photo_url", None)}
        logo_field = LOGO_FIELD_BY_ROLE.get(posted_by)
        if logo_field:
            role_files[logo_field] = getattr(detail_obj, logo_field, None)
        return self.formatter.strip_none_values(role_files)

    async def upload_and_get_file_metadata(
        self, file: UploadFile, field: str, category: str, user_id: str
    ) -> Dict[str, Any]:
        """Faithful move of the upload-only half of the deleted
        upload_single_file (the property_id-less branch - no DB row, just
        the storage upload; matches the original's `if property_id:` gate
        exactly)."""
        if category == 'images':
            upload_results = await self.file_service.upload_images(
                images=[file], user_id=user_id, property_id=None, field_name=field
            )
            return upload_results[0] if upload_results else {}
        if category == 'video':
            return await self.file_service.upload_video(file=file, user_id=user_id, property_id=None)
        if category == 'documents':
            upload_results = await self.file_service.upload_documents(
                documents=[file], user_id=user_id, property_id=None
            )
            return upload_results[0] if upload_results else {}
        raise ValueError(f"Unsupported category: {category}")