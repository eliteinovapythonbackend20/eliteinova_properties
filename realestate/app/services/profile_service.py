from datetime import date, datetime
from typing import Any, Dict, Optional, List
from fastapi import HTTPException, UploadFile
from sqlalchemy import inspect as sa_inspect
from fastapi import status

from app.models.property import PostedBy, PropertyStatus
from app.core.response_utils import PropertyFormatter
from app.services.file_service import FileService
from app.repositories.profile_repository import VendorProfileRepository
from app.core.document_catalog import DocumentLevel, level_for, resolve_document_key
from app.repositories.document_repository import (
    FileAssetRepository,
    UserDocumentRepository,
    has_verified_vendor_document,
    record_vendor_document,
    record_vendor_document_verified,
    release_vendor_document,
)
from app.schemas.vendor_profile_details import ROLE_EXTRA_COLUMN, ROLE_EXTRA_SCHEMA


VENDOR_TYPE_MAP: Dict[str, PostedBy] = {
    "owner": PostedBy.OWNER,
    "agent": PostedBy.AGENT,
    "builder": PostedBy.BUILDER,
    "property-management": PostedBy.PROPERTY_MANAGEMENT,
}

ROLE_DETAILS_KEY: Dict[str, str] = {
    "OWNER": "ownerDetails",
    "AGENT": "agencyDetails",
    "BUILDER": "builderDetails",
    "PROPERTY_MANAGEMENT": "pmDetails",
}

# The reusable USER_MEDIA type for each role's logo. Matches file_service.
# upload_image's reusable_media_type mapping (agencyLogo -> agency_logo,
# companyLogo -> company_logo). Owners aren't a company - their "logo" slot
# is their own profile_photo, so it maps there instead of a separate type.
LOGO_MEDIA_TYPE_BY_ROLE: Dict[PostedBy, str] = {
    PostedBy.OWNER: "profile_photo",
    PostedBy.AGENT: "agency_logo",
    PostedBy.BUILDER: "company_logo",
    PostedBy.PROPERTY_MANAGEMENT: "company_logo",
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

        cover_image, gallery_images = self.formatter.format_media_split(property_obj.media)

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
            
            # Media and documents - coverImage and images (gallery) are kept
            # as separate concepts: the cover only ever comes from the row
            # actually flagged is_primary, never inferred from position, so
            # deleting it leaves the cover empty instead of promoting a
            # gallery photo into it.
            'coverImage': cover_image,
            'images': gallery_images,
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
            "companyName":vendorprofile.company_name,
            "address":vendorprofile.address,
            "city":vendorprofile.city,
            "district":vendorprofile.district,
            "state":vendorprofile.state,
            "country":vendorprofile.country,
            # Every other key here is camelCase (matching the edit forms) -
            # this one was the odd one out, so the saved value never came back
            # on reload (editForm.pinCode stayed '' even though the DB column
            # was updated correctly - looked exactly like "save doesn't work").
            "pinCode":vendorprofile.pincode,
            # Every reader in this app (OwnerProfile.jsx's own edit form
            # included) uses the two-a spelling - aadharNumber was a dead
            # duplicate of the same column under its old misspelling.
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
        }

        # Only the JSONB blob for the role actually being asked about goes in
        # the response - an Owner profile response never carries the Agent/
        # Builder/PM blobs (and vice versa), even though all four live on the
        # one shared vendor_profile row. Also flatten that one blob onto the
        # same top-level camelCase keys the profile-edit forms read (they
        # don't know about the agencyDetails/builderDetails/pmDetails/
        # ownerDetails nesting) - the inverse of
        # VendorProfileRepository.update_vendor_profile's split.
        extra_schema = ROLE_EXTRA_SCHEMA.get(posted_by)
        extra_column = ROLE_EXTRA_COLUMN.get(posted_by)
        if extra_schema and extra_column:
            raw_extra = getattr(vendorprofile, extra_column, None) or {}
            profile[ROLE_DETAILS_KEY[posted_by]] = raw_extra
            for field_name, field in extra_schema.model_fields.items():
                if field.alias:
                    profile[field.alias] = raw_extra.get(field_name)

        return profile

    def _get_profile_data(self, property_obj) -> Optional[Dict[str, Any]]:
        """Build 'contactPersonDetails' for a vendor's OWN property view (profile
        pages only - never the public card/list, which stays contact-free).

        This is per-PROPERTY data (property_contact_persons - whatever was
        filled in on that property's own posting form), NOT the vendor's
        persistent vendor_profile row. The two are intentionally different:
        vendor_profile drives the profile page's own header/"easy navigation"
        summary and is editable independently; this drives the per-property
        contact block, which can legitimately differ per listing (e.g. a
        property management company naming a different on-site contact for
        one specific property).

        Used to branch into 4 near-identical per-role blocks here, on top of
        4 near-identical formatters in response_utils.py (one table meant one
        formatter was enough - see PropertyFormatter.format_contact_person).
        """
        if not property_obj or not property_obj.posted_by:
            return None
        return self.formatter.format_contact_person(property_obj)


    async def get_vendor_profile(self, user_id: str, vendor_type: Optional[str] = None) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type) if vendor_type else None
        profile = await self.vendor_profile_repository.get_vendor_profile(user_id)
        response = self._to_profile_response(profile, posted_by.value if posted_by else None)
        if posted_by:
            response.update(await self._vendor_media_urls(user_id, posted_by))
        return self.formatter.strip_none_values(response)

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
        response = self._to_profile_response(profile_obj, posted_by.value)
        response.update(await self._vendor_media_urls(user_id, posted_by))
        return self.formatter.strip_none_values(response)

    @staticmethod
    def _role_extra(profile_obj, posted_by: PostedBy) -> Dict[str, Any]:
        """The one JSONB blob (agency_details/builder_details/pm_details/
        owner_details) that belongs to this role. Metadata only - it never
        carries a file location; see _vendor_media_urls for the vendor's
        profile photo/logo."""
        if not profile_obj:
            return {}
        extra_column = ROLE_EXTRA_COLUMN.get(posted_by.value)
        return getattr(profile_obj, extra_column, None) or {} if extra_column else {}

    async def _vendor_media_urls(self, user_id: str, posted_by: PostedBy) -> Dict[str, Optional[str]]:
        """The vendor's current profile photo/logo, resolved from USER_MEDIA.
        The vendor-profile JSONB blobs hold metadata only and never a file
        location, so this is the only source for these two URLs."""
        from app.models.file_asset import FileAsset
        from app.services.user_media_service import current_user_media

        db = self.vendor_profile_repository.db

        async def _url(media_type: Optional[str]) -> Optional[str]:
            if not media_type:
                return None
            media = await current_user_media(db, user_id, media_type)
            if media is None:
                return None
            asset = await db.get(FileAsset, media.file_asset_id)
            return asset.file_url if asset else None

        return {
            "profilePhotoUrl": await _url("profile_photo"),
            "companyLogoUrl": await _url(LOGO_MEDIA_TYPE_BY_ROLE.get(posted_by)),
        }

    async def get_profile_files_for_role(self, user_id: str, posted_by: PostedBy) -> Optional[Dict[str, Any]]:
        """GET /profile-files's per-role entry - the vendor's own reusable
        photo/logo for this role, or None if they have neither.

        Replaces the old lookup through the latest property_contact_persons
        row's profile_photo_url/*_logo_url: those were real columns on the
        now-removed per-role property_owner/property_agent/property_builder/
        property_management tables, but PropertyContactPerson (their
        replacement) never carries a file location - media moved to
        USER_MEDIA/ContactPersonMedia by design (see property_contact.py) -
        so that getattr() always silently returned None after the table
        consolidation. _vendor_media_urls is the one real source for these
        URLs; this just reuses it instead of reading a column that no
        longer exists.
        """
        urls = await self._vendor_media_urls(user_id, posted_by)
        return self.formatter.strip_none_values(urls) or None

    async def upload_vendor_profile_photo(
        self, user_id: str, vendor_type: str, file: UploadFile
    ) -> Dict[str, Any]:
        self.resolve_vendor_type(vendor_type)  # validates vendor_type
        if not await self.vendor_profile_repository.get_vendor_profile(user_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} before uploading a photo.",
            )

        upload_result = await self.file_service.upload_image(
            file=file,
            user_id=user_id,
            property_id="profile",  # not a real property - just a storage path segment
            field_name="profilePhoto",
            is_primary=True,
        )

        from app.services import user_media_service
        await user_media_service.record_upload(
            self.vendor_profile_repository.db, user_id=user_id,
            media_type=upload_result["media_type"], upload_result=upload_result,
        )
        await self.vendor_profile_repository.commit()

        # The previous photo is superseded, never deleted - its history and
        # object stay, the same way every other versioned file here works.
        return {"fileUrl": upload_result["file_url"]}

    async def upload_vendor_logo(
        self, user_id: str, vendor_type: str, file: UploadFile
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        if posted_by == PostedBy.OWNER:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{vendor_type}' profiles don't have a logo (owners aren't a company).",
            )
        if not await self.vendor_profile_repository.get_vendor_profile(user_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} before uploading a logo.",
            )

        field_name = "agencyLogo" if posted_by == PostedBy.AGENT else "companyLogo"
        upload_result = await self.file_service.upload_image(
            file=file,
            user_id=user_id,
            property_id="profile",
            field_name=field_name,
            is_primary=True,
        )

        from app.services import user_media_service
        await user_media_service.record_upload(
            self.vendor_profile_repository.db, user_id=user_id,
            media_type=upload_result["media_type"], upload_result=upload_result,
        )
        await self.vendor_profile_repository.commit()

        return {"fileUrl": upload_result["file_url"]}

    async def delete_vendor_profile_photo(self, user_id: str, vendor_type: str) -> Dict[str, Any]:
        self.resolve_vendor_type(vendor_type)  # validates vendor_type
        from app.services import user_media_service
        deleted = await user_media_service.release(
            self.vendor_profile_repository.db, user_id=user_id, media_type="profile_photo"
        )
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No profile photo to delete")
        await self.vendor_profile_repository.commit()
        # The version and its object stay in history; nothing is deleted from storage.
        return {"deleted": True}

    async def delete_vendor_logo(self, user_id: str, vendor_type: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        if posted_by == PostedBy.OWNER:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{vendor_type}' profiles don't have a logo.",
            )

        from app.services import user_media_service
        deleted = await user_media_service.release(
            self.vendor_profile_repository.db, user_id=user_id, media_type=LOGO_MEDIA_TYPE_BY_ROLE[posted_by]
        )
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No logo to delete")
        await self.vendor_profile_repository.commit()
        return {"deleted": True}

    # ============================================
    # VENDOR-LEVEL DOCUMENTS (sale deed, Aadhaar, GST certificate, ...) -
    # metadata lives in the role-specific JSONB blob (see
    # VendorProfileRepository's *_vendor_document_meta methods); the file
    # itself sits in the private bucket and is never exposed as a permanent
    # URL - a fresh signed URL is minted only when the vendor clicks "view".
    # ============================================

    @staticmethod
    def _document_public_view(doc_type: str, row: Optional[Any], asset: Optional[Any]) -> Dict[str, Any]:
        """Mirrors document_controller._version_view's shape - resolved live
        from UserDocument/FileAsset (the source of truth), never a cached
        copy, so this always reflects the real verification status too."""
        if row is None:
            return {}
        return {
            "docType": doc_type,
            "status": row.status,
            "fileName": asset.original_name if asset else None,
            "mimeType": asset.mime_type if asset else None,
            "fileSizeKb": (asset.size_bytes // 1024) if asset and asset.size_bytes is not None else None,
            "uploadedAt": row.created_at.isoformat() if row.created_at else None,
        }

    async def upload_vendor_document(
        self, user_id: str, vendor_type: str, doc_type: str, file: UploadFile
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)

        # This bridge is for the vendor's OWN reusable documents (identity, GST,
        # RERA, ...) - never one tied to a specific property (sale deed, patta/
        # chitta, encumbrance certificate, ...). Those stay scoped to the
        # property that collected them (PropertyDocument, via the posting
        # form's own upload). Letting a PROPERTY_DOCUMENT key through here would
        # put it in user_documents, where link_all_verified_user_resources()
        # would later offer it up as "reusable" on an unrelated property.
        resolved_key = resolve_document_key(doc_type, property_scoped=False)
        if level_for(resolved_key) == DocumentLevel.PROPERTY_DOCUMENT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{doc_type}' belongs to a specific property, not your profile. Upload it from that property's own documents instead.",
            )

        upload_result = await self.file_service.upload_document(
            file=file, user_id=user_id, property_id="profile", idx=0, doc_type=resolved_key
        )
        file_url = upload_result.get("file_url")
        file_name = upload_result.get("stored_filename") or file.filename
        mime_type = upload_result.get("mime_type") or file.content_type
        file_size_kb = upload_result.get("file_size_kb") or 0

        # A replacement of an already-verified/legacy document is auto-verified
        # immediately, mirroring user_media_service.record_upload() - the vendor
        # already proved this document type once, so re-uploading it doesn't go
        # back through admin review. This is a true replace: the old file's
        # storage is freed right after, unless some property still reused it.
        if await has_verified_vendor_document(
            self.vendor_profile_repository.db, user_id=user_id, legacy_document_type=doc_type
        ):
            _, previous = await record_vendor_document_verified(
                self.vendor_profile_repository.db,
                user_id=user_id,
                legacy_document_type=doc_type,
                file_url=file_url,
                file_name=file_name,
                mime_type=mime_type,
                file_size_kb=file_size_kb or None,
                legacy_source=f"vendor_profile.{posted_by.value}",
                legacy_ref=f"{posted_by.value}:{doc_type}",
            )
            await self.vendor_profile_repository.commit()

            if previous is not None:
                from app.models.file_asset import FileAsset

                file_assets = FileAssetRepository(self.vendor_profile_repository.db)
                old_asset = await self.vendor_profile_repository.db.get(FileAsset, previous.file_asset_id)
                if old_asset is not None and old_asset.file_url and not await file_assets.is_referenced(old_asset.file_url):
                    await self.file_service.delete_files([old_asset.file_url])
                    await file_assets.mark_deleted(old_asset.file_url)
                    await self.vendor_profile_repository.commit()

            return await self.get_vendor_document(user_id, vendor_type, doc_type) or {}

        # Either a brand-new document (no live version yet - add_version()
        # makes it live immediately, still pending) or a pending version is
        # already live awaiting review (this replacement becomes another
        # pending version; the vendor's displayed document stays whatever was
        # last verified until an admin verifies one of these - see
        # UserDocumentRepository.add_version()/DocumentVerificationService).
        await record_vendor_document(
            self.vendor_profile_repository.db,
            user_id=user_id,
            legacy_document_type=doc_type,
            file_url=file_url,
            file_name=file_name,
            mime_type=mime_type,
            file_size_kb=file_size_kb or None,
            legacy_source=f"vendor_profile.{posted_by.value}",
            legacy_ref=f"{posted_by.value}:{doc_type}",
        )
        await self.vendor_profile_repository.commit()
        return await self.get_vendor_document(user_id, vendor_type, doc_type) or {}

    async def get_vendor_document(self, user_id: str, vendor_type: str, doc_type: str) -> Optional[Dict[str, Any]]:
        self.resolve_vendor_type(vendor_type)
        from app.models.file_asset import FileAsset

        db = self.vendor_profile_repository.db
        key = resolve_document_key(doc_type, property_scoped=False)
        row = await UserDocumentRepository(db).current(user_id, key)
        if row is None:
            return None
        asset = await db.get(FileAsset, row.file_asset_id)
        return self._document_public_view(doc_type, row, asset)

    async def get_vendor_documents(self, user_id: str, vendor_type: str) -> Dict[str, Any]:
        """Every current user-level document (identity, GST, RERA, company
        docs, ...). Not role-scoped: UserDocument is keyed by user_id +
        document_key only, so a vendor with more than one role sees the same
        identity documents everywhere - one real GST certificate, not a
        separate copy per role."""
        self.resolve_vendor_type(vendor_type)
        from app.models.file_asset import FileAsset

        db = self.vendor_profile_repository.db
        rows = await UserDocumentRepository(db).list_current(user_id)
        result: Dict[str, Any] = {}
        for row in rows:
            if level_for(row.document_key) != DocumentLevel.USER_DOCUMENT:
                continue
            asset = await db.get(FileAsset, row.file_asset_id)
            doc_type = row.legacy_document_type or row.document_key
            result[doc_type] = self._document_public_view(doc_type, row, asset)
        return result

    async def delete_vendor_document(self, user_id: str, vendor_type: str, doc_type: str) -> bool:
        self.resolve_vendor_type(vendor_type)
        released = await release_vendor_document(
            self.vendor_profile_repository.db, user_id=user_id, legacy_document_type=doc_type
        )
        if not released:
            return False
        await self.vendor_profile_repository.commit()
        # Now that the DB rows are committed as 'deleted', free each object's
        # storage - but only if nothing else (another version's history, or a
        # property that reused it) still needs it.
        from app.models.file_asset import FileAsset

        file_assets = FileAssetRepository(self.vendor_profile_repository.db)
        for row in released:
            asset = await self.vendor_profile_repository.db.get(FileAsset, row.file_asset_id)
            if asset is None or not asset.file_url:
                continue
            if await file_assets.is_referenced(asset.file_url):
                continue
            await self.file_service.delete_files([asset.file_url])
            await file_assets.mark_deleted(asset.file_url)
        await self.vendor_profile_repository.commit()
        return True

    async def get_vendor_document_view_url(self, user_id: str, vendor_type: str, doc_type: str) -> str:
        """Mint a fresh, short-lived signed GET URL - called only when the
        vendor clicks "view", never cached/persisted. Always scoped to the
        caller's own profile (user_id comes from the JWT, not the request),
        so no separate ownership check is needed here."""
        from app.services.document_access_service import DocumentAccessService

        key = resolve_document_key(doc_type, property_scoped=False)
        row = await UserDocumentRepository(self.vendor_profile_repository.db).current(user_id, key)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{doc_type}' document found")
        # The signed URL and the view record (DOCUMENT_ACCESSED) both come from DocumentAccessService.
        return await DocumentAccessService(self.vendor_profile_repository.db).issue_user_document_url(
            requester={"user_id": user_id, "role": "vendor"}, row=row
        )

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
        PropertyService (PropertyDocument is Property-domain data).

        The vendor-profile JSON blobs no longer carry a file location (manual
        review of the legacy data is complete - see
        scripts/register_legacy_user_media.py), so USER_MEDIA is the only
        other source checked here."""
        if any(doc.file_url == file_path for doc in vendor_documents):
            return True

        from app.models.file_asset import FileAsset
        from app.services.user_media_service import current_user_media

        db = self.vendor_profile_repository.db
        for media_type in ("profile_photo", "company_logo", "agency_logo", "business_logo"):
            media = await current_user_media(db, user_id, media_type)
            if media is not None:
                asset = await db.get(FileAsset, media.file_asset_id)
                if asset is not None and asset.file_url == file_path:
                    return True

        return False

