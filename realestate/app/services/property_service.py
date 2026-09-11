from typing import Optional, List, Dict, Any
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.id_generator import IDGenerator
from app.core.response_utils import PropertyFormatter, strip_none_values
from app.repositories.property_repository import PropertyRepository
from app.services.file_service import FileService
from app.services.field_mapping_service import FieldMappingService
from app.services.file_extraction_service import FileExtractionService
from app.models.property import BaseProperty
from app.schemas.property_error import (
    PropertyError, PropertyNotFoundError, PropertyValidationError, 
    PropertyPermissionError, PropertyFileUploadError
)
from app.schemas.property_response import PropertyResponse
from app.schemas.property_enums import PostedBy
from app.repositories.profile_repository import VendorProfileRepository
from app.models.property_document import PropertyDocument
from app.models.property_media import PropertyMedia

class PropertyService:
    def __init__(
        self,
        repository: PropertyRepository,
        vendor_profile_repository: Optional[VendorProfileRepository] = None,
        file_service: Optional[FileService] = None,
        field_mapping_service: Optional[FieldMappingService] = None,
        file_extraction_service: Optional[FileExtractionService] = None
    ):
        self.repository = repository
        self.vendor_repository = vendor_profile_repository or VendorProfileRepository(repository.db)
        self.file_service = file_service or FileService()
        self.field_mapping_service = field_mapping_service or FieldMappingService()
        self.file_extraction_service = file_extraction_service or FileExtractionService()
        self.formatter = PropertyFormatter()
    
    async def create_property(
        self,
        posted_by: str,
        property_data: Dict[str, Any],
        separated_files: Dict[str, Any],
        file_metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new property with all associated data
        """
        try:
            # Validate posted_by
            if posted_by not in [e.value for e in PostedBy]:
                raise PropertyValidationError(
                    message=f"Invalid posted_by: {posted_by}",
                    errors={"posted_by": f"Must be one of: {', '.join([e.value for e in PostedBy])}"}
                )
            
            # Prepare property data
            property_payload = dict(property_data or {})
            if user_id and "user_id" not in property_payload:
                property_payload["user_id"] = user_id
            
            # Create property
            property_obj = await self.repository.create_property(
                posted_by=posted_by,
                property_data=property_payload,
                user_id=user_id,
            )
            
            upload_user_id = property_payload.get('user_id') or user_id
            
            # Process files
            await self._process_all_files(
                separated_files=separated_files,
                file_metadata=file_metadata,
                user_id=upload_user_id,
                property_id=property_obj.id,
                posted_by=posted_by
            )
            
            # Update vendor details
            await self._update_vendor_details_from_data(
                posted_by=posted_by,
                property_data=property_payload,
                user_id=upload_user_id,
                property_id=property_obj.id
            )

            # repository.create_property() already committed the base row, but the
            # media/document/vendor-detail writes above only flush() - commit them too,
            # otherwise they vanish when the request's session closes.
            await self.repository.commit()

            # Get and format response
            property_with_relations = await self.repository.get_property_with_relations(property_obj.id)
            return await self._to_response(property_with_relations)
            
        except PropertyError:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to create property: {str(e)}")
    
    async def update_property(
        self,
        property_id: str,
        update_data: Dict[str, Any],
        new_status: Optional[str] = None,
        separated_files: Optional[Dict[str, Any]] = None,
        file_metadata: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update an existing property
        """
        # Check if property exists
        existing_property = await self.repository.get_property_by_id(property_id)
        if not existing_property:
            raise PropertyNotFoundError(property_id)
        
        # Check permissions
        if user_id and existing_property.user_id != user_id:
            raise PropertyPermissionError()
        
        try:
            # Update property data
            if update_data:
                await self.repository.update_property(
                    property_id=property_id,
                    update_data=update_data
                )
            
            # Update status if provided
            if new_status:
                await self.repository.update_property_status(
                    property_id=property_id,
                    status=new_status
                )
            
            # Process files
            if separated_files:
                await self._process_all_files(
                    separated_files=separated_files,
                    file_metadata=file_metadata,
                    user_id=user_id or existing_property.user_id,
                    property_id=property_id,
                    posted_by=existing_property.posted_by,
                    is_update=True
                )
            
            # Update vendor details
            if update_data:
                await self._update_vendor_details_from_data(
                    posted_by=existing_property.posted_by,
                    property_data=update_data,
                    user_id=user_id or existing_property.user_id,
                    property_id=property_id
                )

            # Persist - the repository methods above only flush(); without an
            # explicit commit the async session discards everything on close().
            await self.repository.commit()

            # Get and format response
            updated_property = await self.repository.get_property_with_relations(property_id)
            return await self._to_response(updated_property)
            
        except PropertyError:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to update property: {str(e)}")
    
    async def delete_property(
        self, 
        property_id: str, 
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Delete a property and all associated files
        """
        property_obj = await self.repository.get_property_with_relations(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        
        if user_id and property_obj.user_id != user_id:
            raise PropertyPermissionError()
        
        try:
            # Collect file paths for deletion
            file_paths = []
            if property_obj.media:
                for media in property_obj.media:
                    if media.file_url:
                        file_paths.append(media.file_url)
                    if media.thumbnail_url:
                        file_paths.append(media.thumbnail_url)
            
            if property_obj.documents:
                for doc in property_obj.documents:
                    if doc.file_url:
                        file_paths.append(doc.file_url)
            
            # Delete files from storage
            if file_paths:
                await self.file_service.delete_files(file_paths)
            
            # Delete from database
            await self.repository.delete_property(property_id)
            await self.repository.commit()

            return {
                'success': True,
                'message': f'Property with ID {property_id} deleted successfully'
            }
            
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete property: {str(e)}")
    
    async def get_property_by_id(self, property_id: str) -> Dict[str, Any]:
        """Get a single property by ID with all relations"""
        property_obj = await self.repository.get_property_with_relations(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        
        return await self._to_response(property_obj)
    
    async def get_all_properties(
        self,
        skip: int = 0,
        limit: int = 20
    ) -> Dict[str, Any]:
        """Get all properties with pagination"""
        properties = await self.repository.get_all_properties(skip=skip, limit=limit)
        total_count = await self.repository.get_total_property_count()
        
        formatted_properties = []
        for prop in properties:
            formatted = await self._to_response(prop)
            if formatted:
                formatted_properties.append(formatted)
        
        return {
            'data': formatted_properties,
            'pagination': {
                'total': total_count,
                'page': (skip // limit) + 1 if limit > 0 else 1,
                'limit': limit,
                'total_pages': (total_count + limit - 1) // limit if limit > 0 else 0
            }
        }
    
    # ============================================
    # PRIVATE METHODS
    # ============================================
    
    async def _process_all_files(
        self,
        separated_files: Dict[str, Any],
        file_metadata: Optional[Dict[str, Any]],
        user_id: str,
        property_id: str,
        posted_by: str,
        is_update: bool = False
    ):
        """Process all files in the correct order"""
        
        # Process vendor profile images
        vendor_profile_images = separated_files.get('vendor_profile_images', {})
        if vendor_profile_images:
            await self._process_vendor_profile_images(
                vendor_profile_images, 
                user_id, 
                posted_by,
                property_id
            )
        
        # Process property images
        property_images = separated_files.get('property_images', [])
        if property_images:
            if is_update:
                await self.repository.delete_property_media(property_id)
            await self._process_property_images(
                property_images,
                user_id,
                property_id
            )
        
        # Process property video
        property_video = separated_files.get('property_video')
        if property_video:
            if is_update:
                await self.repository.delete_property_video(property_id)
            await self._process_property_video(
                property_video,
                user_id,
                property_id
            )
        
        # Process vendor documents
        vendor_documents = separated_files.get('vendor_documents', [])
        if vendor_documents:
            await self._process_vendor_documents(
                vendor_documents,
                user_id,
                file_metadata
            )
        
        # Process property documents
        property_documents = separated_files.get('property_documents', [])
        if property_documents:
            if is_update:
                await self.repository.delete_property_documents(property_id)
            await self._process_property_documents(
                property_documents,
                user_id,
                property_id,
                file_metadata
            )
    
    async def _process_vendor_profile_images(
        self,
        vendor_profile_images: Dict[str, UploadFile],
        user_id: str,
        posted_by: str,
        property_id: str
    ):
        """Process vendor profile images"""
        from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
        
        vendor_image_urls = {}
        for field_name, file_obj in vendor_profile_images.items():
            db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
            if not db_column:
                continue
            
            result = await self.file_service.upload_vendor_profile_image(
                file=file_obj,
                user_id=user_id,
                field_name=field_name
            )
            vendor_image_urls[db_column] = result['file_url']
        
        if vendor_image_urls:
            await self.repository.update_vendor_detail(
                user_id=user_id,
                posted_by=posted_by,
                property_id=property_id,
                update_data=vendor_image_urls
            )
    
    async def _process_property_images(
        self,
        property_images: List[UploadFile],
        user_id: str,
        property_id: str
    ):
        """Process property images"""
        for idx, image in enumerate(property_images):
            is_primary = (idx == 0)
            result = await self.file_service.upload_property_image(
                file=image,
                user_id=user_id,
                property_id=property_id,
                is_primary=is_primary,
                order=idx
            )
            
            await self.repository.create_property_media({
                'property_id': property_id,
                'media_type': 'image',
                'file_name': result['file_name'],
                'filename_mapper': result['filename_mapper'],
                'mime_type': result['mime_type'],
                'format': result['format'],
                'file_url': result['file_url'],
                'thumbnail_url': result.get('thumbnail_url'),
                'file_size_kb': result['file_size_kb'],
                'width': result.get('width'),
                'height': result.get('height'),
                'is_primary': is_primary,
                'order': idx
            })
    
    async def _process_property_video(
        self,
        property_video: UploadFile,
        user_id: str,
        property_id: str
    ):
        """Process property video"""
        result = await self.file_service.upload_video(
            file=property_video,
            user_id=user_id,
            property_id=property_id
        )
        
        await self.repository.create_property_media({
            'property_id': property_id,
            'media_type': 'video',
            'file_name': result['file_name'],
            'filename_mapper': result['filename_mapper'],
            'mime_type': result['mime_type'],
            'format': result['format'],
            'file_url': result['file_url'],
            'file_size_kb': result['file_size_kb'],
            'is_primary': False,
            'order': 0
        })
    
    async def _process_vendor_documents(
        self,
        vendor_documents: List[UploadFile],
        user_id: str,
        file_metadata: Optional[Dict[str, Any]] = None
    ):
        """Process vendor documents"""
        for idx, doc in enumerate(vendor_documents):
            doc_type = self._get_document_type_from_metadata(file_metadata, idx, 'vendor_document')
            if not doc_type:
                doc_type = 'other_supporting_document'
            
            result = await self.file_service.upload_vendor_document(
                file=doc,
                user_id=user_id,
                document_type=doc_type
            )
            
            doc_data = {
                'file_name': result.get('file_name'),
                'mime_type': result.get('mime_type'),
                'file_url': result.get('file_url'),
                'file_size_kb': result.get('file_size_kb'),
                'is_public': result.get('is_public', False)
            }
            
            await self.repository.upsert_vendor_document(
                user_id=user_id,
                document_type=doc_type,
                doc_data=doc_data
            )
    
    async def _process_property_documents(
        self,
        property_documents: List[UploadFile],
        user_id: str,
        property_id: str,
        file_metadata: Optional[Dict[str, Any]] = None
    ):
        """Process property documents"""
        for idx, doc in enumerate(property_documents):
            doc_type = self._get_document_type_from_metadata(file_metadata, idx, 'property_document')
            if not doc_type:
                doc_type = 'other_supporting_document'
            
            result = await self.file_service.upload_property_document(
                file=doc,
                user_id=user_id,
                property_id=property_id,
                document_type=doc_type
            )
            
            doc_data = {
                'property_id': property_id,
                'user_id': user_id,
                'document_type': doc_type,
                'file_name': result.get('file_name'),
                'mime_type': result.get('mime_type'),
                'file_url': result.get('file_url'),
                'file_size_kb': result.get('file_size_kb'),
                'is_public': result.get('is_public', False)
            }
            
            await self.repository.create_property_document(doc_data)
    
    def _get_document_type_from_metadata(
        self,
        file_metadata: Optional[Dict[str, Any]],
        index: int,
        category: str
    ) -> Optional[str]:
        """Extract document type from metadata"""
        if not file_metadata:
            return None
        
        for key, meta in file_metadata.items():
            if meta.get('category') == category and meta.get('index', 0) == index:
                return meta.get('doc_type')
        return None
    
    async def _update_vendor_details_from_data(
        self,
        posted_by: str,
        property_data: Dict[str, Any],
        user_id: str,
        property_id: str
    ):
        """Update vendor details based on posted_by"""
        vendor_data = {}
        
        # Define field mappings for each vendor type
        field_mappings = {
            'OWNER': [
                'owner_name', 'date_of_birth', 'gender', 'aadhaar_number', 
                'pan_number', 'mobile', 'email_id', 'address_line1', 
                'address_line2', 'owner_city', 'owner_district', 'owner_state', 
                'owner_pin_code', 'preferred_contact_method', 'preferred_contact_time',
                'bank_name', 'account_holder_name', 'account_number', 
                'ifsc_code', 'upi_id', 'signature', 'signature_date', 
                'signature_place', 'declaration_accepted', 'additionalnote'
            ],
            'AGENT': [
                'agent_name', 'date_of_birth', 'gender', 'mobile', 'email_id',
                'office_address', 'agency_name', 'rera_registration_number',
                'gst_number', 'experience', 'active_listing', 'service_area',
                'website', 'facebook', 'instagram', 'linkedin', 'youtube',
                'bank_name', 'account_holder_name', 'account_number',
                'ifsc_code', 'upi_id', 'signature', 'signature_date',
                'signature_place', 'declaration_accepted'
            ],
            'BUILDER': [
                'name', 'designation', 'mobile', 'whatsapp_number', 'email',
                'rera_registration_number', 'gst_number', 'experience',
                'aadhar_number', 'pan_number', 'company_name', 'company_reg_number',
                'company_website', 'company_description', 'office_address',
                'city', 'district', 'state', 'pincode', 'landmark',
                'website', 'facebook', 'instagram', 'linkedin', 'youtube',
                'bank_name', 'account_holder_name', 'account_number',
                'ifsc_code', 'upi_id', 'signature', 'signature_date',
                'signature_place', 'declaration_accepted'
            ],
            'PROPERTY_MANAGEMENT': [
                'name', 'designation', 'mobile', 'whatsapp_number', 'email',
                'rera_registration_number', 'gst_number', 'experience',
                'aadhar_number', 'pan_number', 'company_name', 'company_reg_number',
                'company_website', 'company_description', 'office_address',
                'city', 'district', 'state', 'pincode', 'landmark',
                'website', 'facebook', 'instagram', 'linkedin', 'youtube',
                'bank_name', 'account_holder_name', 'account_number',
                'ifsc_code', 'upi_id', 'signature', 'signature_date',
                'signature_place', 'declaration_accepted'
            ]
        }
        
        fields = field_mappings.get(posted_by, [])
        for field in fields:
            if field in property_data and property_data[field] is not None:
                vendor_data[field] = property_data[field]
        
        if vendor_data:
            await self.repository.update_vendor_detail(
                user_id=user_id,
                posted_by=posted_by,
                property_id=property_id,
                update_data=vendor_data
            )
    
    @staticmethod
    def _format_card_media(media_list) -> List[Dict[str, Any]]:
        out = []
        for m in media_list or []:
            out.append({
                'id': m.id,
                'fileUrl': m.file_url,
                'thumbnailUrl': m.thumbnail_url,
                'mediaType': m.media_type,
                'type': m.media_type,
                'isPrimary': bool(m.is_primary),
                'order': m.order or 0,
            })
        out.sort(key=lambda x: (not x['isPrimary'], x['order']))
        return out

    @staticmethod
    def _public_vendor_block(property_obj) -> Dict[str, Any]:
        """Listed-by info safe for anonymous listing/card responses - NO contact details."""
        role = (property_obj.posted_by or '').upper()
        detail = None
        display_name = None
        org_name = None
        photo = None
        if role == 'OWNER' and property_obj.owner_details:
            detail = property_obj.owner_details
            display_name = detail.owner_name
            photo = detail.profile_photo_url
        elif role == 'AGENT' and property_obj.agent_details:
            detail = property_obj.agent_details
            display_name = detail.agent_name
            org_name = detail.agency_name
            photo = detail.profile_photo_url
        elif role == 'BUILDER' and property_obj.builder_details:
            detail = property_obj.builder_details
            display_name = detail.name
            org_name = detail.company_name
            photo = detail.profile_photo_url
        elif role == 'PROPERTY_MANAGEMENT' and property_obj.property_management_details:
            detail = property_obj.property_management_details
            display_name = detail.name
            org_name = detail.company_name
            photo = detail.profile_photo_url

        return {
            'role': role or None,
            'displayName': display_name,
            'organisationName': org_name,
            'profilePhotoUrl': photo,
        }

    def _to_card(self, property_obj) -> Dict[str, Any]:
        """Serialize a property for public list / filter / browse responses.

        Contains every spec field the shared PropertyCard renders, but NO vendor
        contact info (email / phone / address / bank / KYC). Contact reveal is a
        separate authenticated leads flow (Phase 2).
        """
        if not property_obj:
            return None

        p = property_obj

        def f(val):
            return float(val) if val is not None else None

        card = {
            'id': p.id,
            'postedAs': p.posted_by,
            'postedBy': self._public_vendor_block(p),
            'propertyCategory': p.property_category,
            'listingPurpose': p.listing_purpose,
            'propertyType': p.property_type,
            'subCategory': p.sub_category,
            'propertyTitle': p.property_title,
            'propertyDescription': p.property_discription,
            'status': p.status or 'Active',

            # location
            'propertyAddress': p.address,
            'area': p.area,
            'city': p.city,
            'district': p.district,
            'state': p.state,
            'pincode': p.pin_code,
            'landmark': p.landmark,
            'nearbyConnectivity': p.nearby_connectivity,

            # pricing
            'expectedPrice': f(p.expected_price),
            'priceMin': f(p.price_min),
            'priceMax': f(p.price_max),
            'priceType': p.price_negotiable,
            'isNegotiable': p.price_negotiable,
            'securityDeposit': f(p.security_deposit),
            'securityDepositMin': f(p.security_deposit),
            'securityDepositMax': f(p.security_deposit),
            'maintenance': f(p.maintenance_amount),
            'maintenanceIncluded': p.maintenance_included,

            # specs
            'bedrooms': p.bedrooms,
            'bathrooms': p.bathrooms,
            'floorNumber': p.floor_number,
            'totalFloors': p.total_floors,
            'facing': p.facing_direction,
            'propertyAge': p.property_age,
            'propertyCondition': p.property_condition,
            'cornerUnit': p.corner_unit,
            'builtUpArea': f(p.built_up_area),
            'carpetArea': f(p.carpet_area),
            'furnishingStatus': p.furnishing_status,
            'parking': p.parking,
            'parkingSpaces': p.parking_capacity,
            'hasGarden': p.garden_space,
            'hasTerrace': p.terrace,
            'hasBalcony': p.balcony,

            # arrays
            'amenities': p.amenities or [],
            'interiorFeatures': p.interior_features or [],
            'applianceIncluded': p.appliance_included or [],
            'nearbyPlaces': p.nearby_places or [],
            'selectedFeature': p.selected_feature or [],

            # tenancy / rent
            'tenantType': p.tenant_type or [],
            'occupancyType': p.tenant_type[0] if p.tenant_type else None,
            'petFriendly': p.pet_friendly,
            'smokingAllowed': p.smoking_allowed,
            'dietaryPreference': p.dietary_preference,
            'availableFrom': p.available_from.isoformat() if p.available_from else None,
            'immediateMoveIn': p.immediate_move_in,
            'rentalDuration': p.minimum_duration,
            'rentalTerm': p.rental_term,
            'rentalFrequency': p.rental_frequency,
            'minimumStayDuration': p.minimum_stay_duration,

            # sell / lease
            'ownershipType': p.ownership_type,
            'loanOutstanding': p.loan_outstanding,
            'loanEligible': p.loan_eligible,
            'homeLoanRequired': p.loan_eligible,
            'reraApproved': p.rera_approved,
            'titleDeedVerify': p.title_deed_verify,
            'propertyTax': p.property_tax,
            'renewableOption': p.renewable_option,
            'constructionStatus': p.construction_status,
            'possessionTimeline': p.possession_timeline,
            'readyToBuy': p.ready_to_buy,

            # commercial
            'commercialType': p.commercial_type,
            'businessType': p.business_type,
            'estimatedFootfall': p.estimated_footfall,
            'operatingHours': p.operating_hours,
            'zoningType': p.zoning_type,
            'leaseType': p.lease_type,
            'leaseTerms': p.lease_terms,
            'fitOut': p.fit_out,
            'frontageWidth': p.frontage_width,
            'ceilingHeight': p.ceiling_height,
            'powerLoadCapacity': p.power_load_capacity,

            # hostel
            'hostelType': p.hostel_type,
            'hostelCategory': p.hostel_category,
            'genderType': p.gender_type,
            'roomType': p.room_type or [],
            'sharingType': p.sharing_type or [],
            'totalCapacity': p.total_capacity,
            'bathroomType': p.bathroom_type,
            'foodIncluded': p.food_included,
            'foodType': p.food_type,
            'mealsPerDay': p.meals_per_day,
            'kitchenAccess': p.kitchen_access,
            'utilitiesIncluded': p.utilities_included,
            'alcoholAllowed': p.alcohol_allowed,
            'paymentFrequency': p.payment_frequency,
            'paymentMode': p.payment_mode,

            # land & plot
            'landArea': f(p.land_area),
            'landAreaMin': f(p.land_area_min),
            'landAreaMax': f(p.land_area_max),
            'areaUnit': p.area_unit,
            'landShape': p.land_shape,
            'roadWidth': p.road_width,
            'waterSource': p.water_source,
            'soilType': p.soil_type,
            'electricityAvailable': p.electricity_available,

            # media + timestamps
            'images': self._format_card_media(getattr(p, 'media', None)),
            'createdAt': p.created_at.isoformat() if p.created_at else None,
            'updatedAt': p.updated_at.isoformat() if p.updated_at else None,
        }
        return strip_none_values(card)

    async def _to_response(self, property_obj) -> Dict[str, Any]:
        """Single-property response = public card + documents.

        Vendor contact / full KYC details are intentionally excluded here; they are
        served through the authenticated leads/contact flow (Phase 2).
        """
        if not property_obj:
            return None

        response = self._to_card(property_obj)
        response['documents'] = self._format_documents(property_obj.documents) if getattr(property_obj, 'documents', None) else []
        return strip_none_values(response)

    def _format_media(self, media_list):
        return self.formatter.format_media(media_list)
    
    def _format_documents(self, document_list):
        return self.formatter.format_documents(document_list)
    
    def _format_owner_details(self, property_obj):
        return self.formatter.format_owner_details(property_obj)
    
    def _format_agent_details(self, property_obj):
        return self.formatter.format_agent_details(property_obj)
    
    def _format_builder_details(self, property_obj):
        return self.formatter.format_builder_details(property_obj)
    
    def _format_property_management_details(self, property_obj):
        return self.formatter.format_property_management_details(property_obj)


    # ============================================
    # PROPERTY MEDIA MANAGEMENT METHODS
    # ============================================

    async def add_property_images(
        self,
        property_id: str,
        images: List[UploadFile],
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Add new images to a property"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            # Get current max order
            current_media = await self.repository.get_property_media(property_id)
            max_order = max([m.order for m in current_media if m.media_type == 'image'], default=-1)
        
            uploaded_images = []
            for idx, image in enumerate(images):
                order = max_order + idx + 1
                result = await self.file_service.upload_property_image(
                    file=image,
                    user_id=user_id,
                    property_id=property_id,
                    is_primary=False,
                    order=order
                )
            
                media = await self.repository.create_property_media({
                    'property_id': property_id,
                    'media_type': 'image',
                    'file_name': result['file_name'],
                    'filename_mapper': result['filename_mapper'],
                    'mime_type': result['mime_type'],
                    'format': result['format'],
                    'file_url': result['file_url'],
                    'thumbnail_url': result.get('thumbnail_url'),
                    'file_size_kb': result['file_size_kb'],
                    'width': result.get('width'),
                    'height': result.get('height'),
                    'is_primary': False,
                    'order': order
                })
                uploaded_images.append(media)
        
            return uploaded_images
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to add images: {str(e)}")

    async def delete_property_image_by_index(
        self,
        property_id: str,
        image_index: int,
        user_id: str
    ) -> None:
        """Delete a specific image by its order index"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            # Get the image by order
            media_list = await self.repository.get_property_media(property_id)
            image_to_delete = None
            for media in media_list:
                if media.media_type == 'image' and media.order == image_index:
                    image_to_delete = media
                    break
        
            if not image_to_delete:
                raise PropertyValidationError(
                    message=f"No image found at index {image_index}",
                    errors={"image_index": "Image not found"}
                )
        
            # Delete from storage
            if image_to_delete.file_url:
                await self.file_service.delete_files([image_to_delete.file_url])
                if image_to_delete.thumbnail_url:
                    await self.file_service.delete_files([image_to_delete.thumbnail_url])
        
            # Delete from database
            await self.repository.delete_property_media_by_id(image_to_delete.id)
        
            # If this was the cover image, make the next one cover
            if image_to_delete.is_primary:
                remaining_images = [m for m in media_list if m.id != image_to_delete.id and m.media_type == 'image']
                if remaining_images:
                    next_primary = min(remaining_images, key=lambda x: x.order)
                    await self.repository.set_cover_image(property_id, next_primary.id)
        
            await self.repository.commit()
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete image: {str(e)}")

    async def set_cover_image(
        self,
        property_id: str,
        media_id: int,
        user_id: str
    ) -> PropertyMedia:
        """Set a specific image as the cover/primary image"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            media = await self.repository.set_cover_image(property_id, media_id)
            if not media:
                raise PropertyValidationError(
                    message=f"Image with ID {media_id} not found or not an image",
                    errors={"media_id": "Invalid media ID"}
                )
            await self.repository.commit()
            return media
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to set cover image: {str(e)}")

    async def add_property_video(
        self,
        property_id: str,
        video: UploadFile,
        user_id: str
    ) -> PropertyMedia:
        """Add or replace property video"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            # Delete existing video if any
            existing_video = await self.repository.get_property_video(property_id)
            if existing_video:
                if existing_video.file_url:
                    await self.file_service.delete_files([existing_video.file_url])
                await self.repository.delete_property_media_by_id(existing_video.id)
        
            # Upload new video
            result = await self.file_service.upload_video(
                file=video,
                user_id=user_id,
                property_id=property_id
            )
        
            media = await self.repository.create_property_media({
                'property_id': property_id,
                'media_type': 'video',
                'file_name': result['file_name'],
                'filename_mapper': result['filename_mapper'],
                'mime_type': result['mime_type'],
                'format': result['format'],
                'file_url': result['file_url'],
                'file_size_kb': result['file_size_kb'],
                'is_primary': False,
                'order': 0
            })
        
            await self.repository.commit()
            return media
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to add video: {str(e)}")

    async def delete_property_video(
        self,
        property_id: str,
        user_id: str
    ) -> None:
        """Delete property video"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            video = await self.repository.get_property_video(property_id)
            if not video:
                raise PropertyValidationError(
                    message="No video found for this property",
                    errors={"video": "Video not found"}
                )
        
            if video.file_url:
                await self.file_service.delete_files([video.file_url])
        
            await self.repository.delete_property_media_by_id(video.id)
            await self.repository.commit()
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete video: {str(e)}")

    # ============================================
    # PROPERTY DOCUMENT MANAGEMENT METHODS
    # ============================================

    async def add_property_documents(
        self,
        property_id: str,
        documents: List[UploadFile],
        document_types: Optional[List[str]],
        user_id: str
    ) -> List[PropertyDocument]:
        """Add documents to a property"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            uploaded_docs = []
            for idx, doc in enumerate(documents):
                doc_type = document_types[idx] if document_types and idx < len(document_types) else None
                if not doc_type:
                    doc_type = self.file_service._get_document_type(doc.filename)
            
                result = await self.file_service.upload_property_document(
                    file=doc,
                    user_id=user_id,
                    property_id=property_id,
                    document_type=doc_type
                )
            
                doc_data = {
                    'property_id': property_id,
                    'user_id': user_id,
                    'document_type': doc_type,
                    'file_name': result.get('file_name'),
                    'mime_type': result.get('mime_type'),
                    'file_url': result.get('file_url'),
                    'file_size_kb': result.get('file_size_kb'),
                    'is_public': result.get('is_public', False)
                }
            
                doc_obj = await self.repository.create_property_document(doc_data)
                uploaded_docs.append(doc_obj)
        
            await self.repository.commit()
            return uploaded_docs
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to add documents: {str(e)}")

    async def delete_property_document(
        self,
        property_id: str,
        document_id: int,
        user_id: str
    ) -> None:
        """Delete a specific property document"""
        # Check property exists and user has permission
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
    
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
    
        try:
            document = await self.repository.get_property_document_by_id(document_id)
            if not document or document.property_id != property_id:
                raise PropertyValidationError(
                    message=f"Document with ID {document_id} not found",
                    errors={"document_id": "Document not found"}
                )
        
            if document.file_url:
                await self.file_service.delete_files([document.file_url])
        
            await self.repository.delete_property_document_by_id(document_id)
            await self.repository.commit()
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete document: {str(e)}")

    # ============================================
    # VENDOR PROFILE IMAGE MANAGEMENT
    # ============================================

    async def update_vendor_profile_image(
        self,
        user_id: str,
        image: UploadFile,
        field_name: str
    ) -> Dict[str, Any]:
        """Update vendor profile image"""
        try:
            # Upload image
            result = await self.file_service.upload_vendor_profile_image(
                file=image,
                user_id=user_id,
                field_name=field_name
            )
        
            # Update vendor profile
            from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
            db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
        
            if db_column:
                # Update all properties for this vendor
                await self.repository.update_vendor_profile_image(
                    user_id=user_id,
                    db_column=db_column,
                    image_url=result['file_url']
                )
            
                # Also update latest vendor details
                vendor_types = await self.repository.get_user_vendor_types(user_id)
                for vendor_type in vendor_types:
                    await self.repository.update_vendor_detail(
                        user_id=user_id,
                        posted_by=vendor_type,
                        property_id=None,  # Not property-specific
                        update_data={db_column: result['file_url']}
                    )
        
            await self.repository.commit()
            return result
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to update profile image: {str(e)}")

    async def delete_vendor_profile_image(
        self,
        user_id: str,
        field_name: str
    ) -> None:
        """Delete vendor profile image"""
        try:
            from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
            db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
        
            if db_column:
                # Get current image URL
                vendor_details = await self.repository.get_latest_vendor_detail_by_user(user_id)
                current_url = getattr(vendor_details, db_column, None) if vendor_details else None
            
                if current_url:
                    # Delete from storage
                    await self.file_service.delete_files([current_url])
                
                    # Clear from database
                    await self.repository.update_vendor_profile_image(
                        user_id=user_id,
                        db_column=db_column,
                        image_url=None
                    )
                
                    await self.repository.commit()
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete profile image: {str(e)}")

    # ============================================
    # VENDOR DOCUMENT MANAGEMENT
    # ============================================

    async def upload_vendor_document(
        self,
        user_id: str,
        document: UploadFile,
        document_type: str
    ) -> PropertyDocument:
        """Upload a vendor document"""
        try:
            result = await self.file_service.upload_vendor_document(
                file=document,
                user_id=user_id,
                document_type=document_type
            )
        
            doc_data = {
                'file_name': result.get('file_name'),
                'mime_type': result.get('mime_type'),
                'file_url': result.get('file_url'),
                'file_size_kb': result.get('file_size_kb'),
                'is_public': result.get('is_public', False)
            }
        
            doc_obj = await self.repository.upsert_vendor_document(
                user_id=user_id,
                document_type=document_type,
                doc_data=doc_data
            )
        
            await self.repository.commit()
            return doc_obj
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to upload vendor document: {str(e)}")

    async def delete_vendor_document(
        self,
        user_id: str,
        document_type: str
    ) -> None:
        """Delete a vendor document"""
        try:
            document = await self.repository.get_vendor_document(user_id, document_type)
            if not document:
                raise PropertyValidationError(
                    message=f"Document of type {document_type} not found",
                    errors={"document_type": "Document not found"}
                )
        
            if document.file_url:
                await self.file_service.delete_files([document.file_url])
        
            await self.repository.delete_vendor_document(user_id, document_type)
            await self.repository.commit()
        
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete vendor document: {str(e)}")

    async def get_vendor_documents(
        self,
        user_id: str
    ) -> List[PropertyDocument]:
        """Get all vendor documents"""
        return await self.repository.get_vendor_documents(user_id)











































































# # app/services/property_service.py

# from typing import Optional, List, Dict, Any
# from fastapi import HTTPException, UploadFile, status
# from app.core.id_generator import IDGenerator
# from app.core.response_utils import PropertyFormatter, strip_none_values
# from app.repositories.property_repository import PropertyRepository
# from app.services.file_service import FileService
# from app.models.property import BaseProperty
# from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
# from datetime import datetime

# from app.repositories.profile_repository import VendorProfileRepository

# class PropertyService:
#     def __init__(self, repository: PropertyRepository, vendor_profile_repository:VendorProfileRepository):
#         self.repository = repository
#         self.vendor_repository = vendor_profile_repository
#         self.file_service = FileService()
#         self.formatter = PropertyFormatter()
    
#     # ============================================
#     # CREATE PROPERTY
#     # ============================================
    
#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         separated_files: Dict[str, Any],
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> BaseProperty:
#         try:
#             property_payload = dict(property_data or {})
#             if user_id and "user_id" not in property_payload:
#                 property_payload["user_id"] = user_id

#             if property_payload.get("available_from") and isinstance(property_payload["available_from"], str):
#                 try:
#                     property_payload["available_from"] = datetime.strptime(
#                         property_payload["available_from"], "%m-%d-%Y"
#                     ).date()
#                 except ValueError:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Invalid date format for 'available_from'. Expected YYYY-MM-DD."
#                     )

#             property_obj = await self.repository.create_property(
#                 posted_by=posted_by,
#                 property_data=property_payload,
#                 user_id=user_id,
#             )
            
#             upload_user_id = property_payload.get('user_id') or user_id
            
#             vendor_profile_images = separated_files.get('vendor_profile_images', {})
#             if vendor_profile_images:
#                 await self._process_vendor_profile_images(
#                     vendor_profile_images, 
#                     upload_user_id, 
#                     posted_by,
#                     property_obj.id
#                 )
            
#             property_images = separated_files.get('property_images', [])
#             if property_images:
#                 await self._process_property_images(
#                     property_images,
#                     upload_user_id,
#                     property_obj.id
#                 )
#             property_video = separated_files.get('property_video')
#             if property_video:
#                 await self._process_property_video(
#                     property_video,
#                     upload_user_id,
#                     property_obj.id
#                 )
            
#             vendor_documents = separated_files.get('vendor_documents', [])
#             if vendor_documents:
#                 await self._process_vendor_documents(
#                     vendor_documents,
#                     upload_user_id,
#                     file_metadata
#                 )
            
#             property_documents = separated_files.get('property_documents', [])
#             if property_documents:
#                 await self._process_property_documents(
#                     property_documents,
#                     upload_user_id,
#                     property_obj.id,
#                     file_metadata
#                 )
            
#             await self._update_vendor_details_from_data(
#                 posted_by=posted_by,
#                 property_data=property_payload,
#                 user_id=upload_user_id,
#                 property_id=property_obj.id
#             )
            
#             property_with_relations = await self.repository.get_property_with_relations(property_obj.id)
#             return await self._to_response(property_with_relations)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to create property: {str(e)}")
    
    
#     async def _process_vendor_profile_images(
#         self,
#         vendor_profile_images: Dict[str, UploadFile],
#         user_id: str,
#         posted_by: str,
#         property_id: str
#     ):
        
#         vendor_image_urls = {}
        
#         for field_name, file_obj in vendor_profile_images.items():
#             db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
#             if not db_column:
#                 print(f"  ⚠️ No DB column mapping for {field_name}")
#                 continue
            
#             # Upload image to storage
#             result = await self.file_service.upload_vendor_profile_image(
#                 file=file_obj,
#                 user_id=user_id,
#                 field_name=field_name
#             )
            
#             vendor_image_urls[db_column] = result['file_url']
#             print(f"  ✅ Uploaded {field_name} → {db_column}: {result['file_url']}")
        
#         # Update vendor table with image URLs
#         if vendor_image_urls:
#             await self.repository.update_vendor_detail(
#                 user_id=user_id,
#                 posted_by=posted_by,
#                 property_id=property_id,
#                 update_data=vendor_image_urls
#             )
#             print(f"  ✅ Updated vendor profile with {len(vendor_image_urls)} image URLs")
    
#     async def _process_property_images(
#         self,
#         property_images: List[UploadFile],
#         user_id: str,
#         property_id: str
#     ):
#         """Process property images and store in PropertyMedia"""
        
#         for idx, image in enumerate(property_images):
#             # First image is cover/primary
#             is_primary = (idx == 0)
            
#             # Upload image
#             result = await self.file_service.upload_property_image(
#                 file=image,
#                 user_id=user_id,
#                 property_id=property_id,
#                 is_primary=is_primary,
#                 order=idx
#             )
            
#             # Save to PropertyMedia
#             await self.repository.create_property_media({
#                 'property_id': property_id,
#                 'media_type': 'image',
#                 'file_name': result['file_name'],
#                 'filename_mapper': result['filename_mapper'],
#                 'mime_type': result['mime_type'],
#                 'format': result['format'],
#                 'file_url': result['file_url'],
#                 'thumbnail_url': result.get('thumbnail_url'),
#                 'file_size_kb': result['file_size_kb'],
#                 'width': result.get('width'),
#                 'height': result.get('height'),
#                 'is_primary': is_primary,
#                 'order': idx
#             })
#             print(f"  ✅ Uploaded property image {idx}: {result['file_url']}")
    
#     async def _process_property_video(
#         self,
#         property_video: UploadFile,
#         user_id: str,
#         property_id: str
#     ):
#         """Process property video and store in PropertyMedia"""
        
#         result = await self.file_service.upload_video(
#             file=property_video,
#             user_id=user_id,
#             property_id=property_id
#         )
        
#         await self.repository.create_property_media({
#             'property_id': property_id,
#             'media_type': 'video',
#             'file_name': result['file_name'],
#             'mime_type': result['mime_type'],
#             'filename_mapper': result['filename_mapper'],
#             'format': result['format'],
#             'file_url': result['file_url'],
#             'file_size_kb': result['file_size_kb'],
#             'is_primary': False,
#             'order': 0
#         })
#         print(f"  ✅ Uploaded property video: {result['file_url']}")
    


#     async def _process_vendor_documents(
#         self,
#         vendor_documents: List[UploadFile],
#         user_id: str,
#         file_metadata: Optional[Dict[str, Any]] = None
#     ):
#         """Process vendor documents and store in PropertyDocument (property_id = NULL)."""
        
#         for idx, doc in enumerate(vendor_documents):
#             # Get document type from metadata
#             doc_type = getattr(doc, 'doc_type', None)
#             if not doc_type and file_metadata:
#                 for key, meta in file_metadata.items():
#                     if meta.get('category') == 'vendor_document' and meta.get('index', 0) == idx:
#                         doc_type = meta.get('doc_type')
#                         break
            
#             if not doc_type:
#                 doc_type = 'other_supporting_document'
            
#             # Upload document
#             upload_result = await self.file_service.upload_vendor_document(
#                 file=doc,
#                 user_id=user_id,
#                 document_type=doc_type
#             )
            
#             # Build doc_data for upsert_vendor_document
#             doc_data = {
#                 'file_name': upload_result.get('file_name'),
#                 'mime_type': upload_result.get('mime_type'),
#                 'file_url': upload_result.get('file_url'),
#                 'file_size_kb': upload_result.get('file_size_kb'),
#                 'is_public': upload_result.get('is_public', False)
#             }
            
#             # Use upsert_vendor_document (property_id = NULL)
#             await self.repository.upsert_vendor_document(
#                 user_id=user_id,
#                 document_type=doc_type,
#                 doc_data=doc_data
#             )
#             print(f"  ✅ Uploaded vendor document: {doc_type}")
            

#     async def _process_property_documents(
#         self,
#         property_documents: List[UploadFile],
#         user_id: str,
#         property_id: str,
#         file_metadata: Optional[Dict[str, Any]] = None
#     ):
#         """Process property documents and store in PropertyDocument (property_id = property_id)."""
        
#         for idx, doc in enumerate(property_documents):
#             # Get document type from metadata
#             doc_type = getattr(doc, 'doc_type', None)
#             if not doc_type and file_metadata:
#                 for key, meta in file_metadata.items():
#                     if meta.get('category') == 'property_document' and meta.get('index', 0) == idx:
#                         doc_type = meta.get('doc_type')
#                         break
            
#             if not doc_type:
#                 doc_type = 'other_supporting_document'
            
#             # Upload document
#             upload_result = await self.file_service.upload_property_document(
#                 file=doc,
#                 user_id=user_id,
#                 property_id=property_id,
#                 document_type=doc_type
#             )
            
#             # Build doc_data for create_property_document
#             doc_data = {
#                 'property_id': property_id,
#                 'user_id': user_id,
#                 'document_type': doc_type,
#                 'file_name': upload_result.get('file_name'),
#                 'mime_type': upload_result.get('mime_type'),
#                 'file_url': upload_result.get('file_url'),
#                 'file_size_kb': upload_result.get('file_size_kb'),
#                 'is_public': upload_result.get('is_public', False)
#             }
            
#             # Use the original create_property_document method with single dict
#             await self.repository.create_property_document(doc_data)
#             print(f"  ✅ Uploaded property document: {doc_type}")
    
#     async def _update_vendor_details_from_data(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         user_id: str,
#         property_id: str
#     ):
        
#         # Extract vendor-specific fields based on posted_by
#         vendor_data = {}
        
#         if posted_by == 'OWNER':
#             # Owner fields from property_data
#             owner_fields = [
#                 'owner_name', 'date_of_birth', 'gender', 'aadhaar_number', 
#                 'pan_number', 'mobile', 'email_id', 'address_line1', 
#                 'address_line2', 'owner_city', 'owner_district', 'owner_state', 
#                 'owner_pin_code', 'preferred_contact_method', 'preferred_contact_time',
#                 'bank_name', 'account_holder_name', 'account_number', 
#                 'ifsc_code', 'upi_id', 'signature', 'signature_date', 
#                 'signature_place', 'declaration_accepted', 'additionalnote'
#             ]
#             for field in owner_fields:
#                 if field in property_data and property_data[field] is not None:
#                     vendor_data[field] = property_data[field]
        
#         elif posted_by == 'AGENT':
#             # Agent fields from property_data
#             agent_fields = [
#                 'agent_name', 'date_of_birth', 'gender', 'mobile', 'email_id',
#                 'office_address', 'agency_name', 'rera_registration_number',
#                 'gst_number', 'experience', 'active_listing', 'service_area',
#                 'website', 'facebook', 'instagram', 'linkedin', 'youtube',
#                 'bank_name', 'account_holder_name', 'account_number',
#                 'ifsc_code', 'upi_id', 'signature', 'signature_date',
#                 'signature_place', 'declaration_accepted'
#             ]
#             for field in agent_fields:
#                 if field in property_data and property_data[field] is not None:
#                     vendor_data[field] = property_data[field]
        
#         elif posted_by == 'BUILDER':
#             # Builder fields from property_data
#             builder_fields = [
#                 'name', 'designation', 'mobile', 'whatsapp_number', 'email',
#                 'rera_registration_number', 'gst_number', 'experience',
#                 'aadhar_number', 'pan_number', 'company_name', 'company_reg_number',
#                 'company_website', 'company_description', 'office_address',
#                 'city', 'district', 'state', 'pincode', 'landmark',
#                 'website', 'facebook', 'instagram', 'linkedin', 'youtube',
#                 'bank_name', 'account_holder_name', 'account_number',
#                 'ifsc_code', 'upi_id', 'signature', 'signature_date',
#                 'signature_place', 'declaration_accepted'
#             ]
#             for field in builder_fields:
#                 if field in property_data and property_data[field] is not None:
#                     vendor_data[field] = property_data[field]
        
#         elif posted_by == 'PROPERTY_MANAGEMENT':
#             # PM fields from property_data
#             pm_fields = [
#                 'name', 'designation', 'mobile', 'whatsapp_number', 'email',
#                 'rera_registration_number', 'gst_number', 'experience',
#                 'aadhar_number', 'pan_number', 'company_name', 'company_reg_number',
#                 'company_website', 'company_description', 'office_address',
#                 'city', 'district', 'state', 'pincode', 'landmark',
#                 'website', 'facebook', 'instagram', 'linkedin', 'youtube',
#                 'bank_name', 'account_holder_name', 'account_number',
#                 'ifsc_code', 'upi_id', 'signature', 'signature_date',
#                 'signature_place', 'declaration_accepted'
#             ]
#             for field in pm_fields:
#                 if field in property_data and property_data[field] is not None:
#                     vendor_data[field] = property_data[field]
        
#         # Update vendor details if there's data
#         if vendor_data:
#             await self.repository.update_vendor_detail(
#                 user_id=user_id,
#                 posted_by=posted_by,
#                 property_id=property_id,
#                 update_data=vendor_data
#             )
#             print(f"  ✅ Updated vendor details with {len(vendor_data)} fields")
    
#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any],
#         new_status: Optional[str] = None,
#         separated_files: Optional[Dict[str, Any]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> Dict[str, Any]:
#         # 1. Check if property exists
#         existing_property = await self.repository.get_property_by_id(property_id)
#         if not existing_property:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and existing_property.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to update this property"
#             )
        
#         try:
#             # 2. Update property data
#             if update_data:
#                 await self.repository.update_property(
#                     property_id=property_id,
#                     update_data=update_data
#                 )
            
#             # 3. Update status if provided
#             if new_status:
#                 await self.repository.update_property_status(
#                     property_id=property_id,
#                     status=new_status
#                 )
            
#             if not separated_files:
#                 separated_files = {}
            
#             upload_user_id = user_id or existing_property.user_id
#             posted_by = existing_property.posted_by
            
#             vendor_profile_images = separated_files.get('vendor_profile_images', {})
#             if vendor_profile_images:
#                 await self._process_vendor_profile_images(
#                     vendor_profile_images,
#                     upload_user_id,
#                     posted_by,
#                     property_id
#                 )
            
#             property_images = separated_files.get('property_images', [])
#             if property_images:
#                 # Delete old images
#                 await self.repository.delete_property_media(property_id)
                
#                 await self._process_property_images(
#                     property_images,
#                     upload_user_id,
#                     property_id
#                 )
            
#             property_video = separated_files.get('property_video')
#             if property_video:
#                 # Delete old video
#                 await self.repository.delete_property_video(property_id)
                
#                 await self._process_property_video(
#                     property_video,
#                     upload_user_id,
#                     property_id
#                 )
            
#             vendor_documents = separated_files.get('vendor_documents', [])
#             if vendor_documents:
#                 await self._process_vendor_documents(
#                     vendor_documents,
#                     upload_user_id,
#                     file_metadata
#                 )
            
#             property_documents = separated_files.get('property_documents', [])
#             if property_documents:
#                 # Delete old documents
#                 await self.repository.delete_property_documents(property_id)
                
#                 await self._process_property_documents(
#                     property_documents,
#                     upload_user_id,
#                     property_id,
#                     file_metadata
#                 )
            
#             if update_data:
#                 await self._update_vendor_details_from_data(
#                     posted_by=posted_by,
#                     property_data=update_data,
#                     user_id=upload_user_id,
#                     property_id=property_id
#                 )
            
#             # 10. Return formatted updated property
#             updated_property = await self.repository.get_property_with_relations(property_id)
#             return await self._to_response(updated_property)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to update property: {str(e)}")
    
    
#     async def delete_property(self, property_id: int, user_id: Optional[str] = None) -> Dict[str, Any]:

#         # 1. Check if property exists
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and property_obj.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to delete this property"
#             )
        
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)
            
#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
            
#             # 3. Delete from database
#             await self.repository.delete_property(property_id)
            
#             return {
#                 'success': True,
#                 'message': f'Property with ID {property_id} deleted successfully'
#             }
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to delete property: {str(e)}")
    
    
#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """Get all properties with pagination"""
#         properties = await self.repository.get_all_properties(
#             skip=skip,
#             limit=limit
#         )
        
#         formatted_properties = []
#         for prop in properties:
#             formatted = await self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_total_property_count()
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_property_by_id(self, property_id: int) -> Optional[Dict[str, Any]]:
#         """Get a single property by ID with all relations"""
#         property_obj = await self.repository.get_property_with_relations(property_id)
        
#         if not property_obj:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Property with ID {property_id} not found"
#             )
        
#         return await self._to_response(property_obj)
    
#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """Get properties by posted_by"""
#         properties = await self.repository.get_properties_by_posted_by(
#             posted_by=posted_by,
#             skip=skip,
#             limit=limit
#         )
        
#         formatted_properties = []
#         for prop in properties:
#             formatted = await self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_posted_by(posted_by)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """Get properties by category"""
#         properties = await self.repository.get_properties_by_category(
#             property_category=property_category,
#             skip=skip,
#             limit=limit
#         )
        
#         formatted_properties = []
#         for prop in properties:
#             formatted = await self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_category(property_category)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """Get properties by property type"""
#         properties = await self.repository.get_properties_by_property_type(
#             property_type=property_type,
#             skip=skip,
#             limit=limit
#         )
        
#         formatted_properties = []
#         for prop in properties:
#             formatted = await self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_property_type(property_type)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """Get properties by listing purpose"""
#         properties = await self.repository.get_properties_by_purpose(
#             listing_purpose=listing_purpose,
#             skip=skip,
#             limit=limit
#         )
        
#         formatted_properties = []
#         for prop in properties:
#             formatted = await self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_purpose(listing_purpose)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_user_id(
#         self,
#         user_id: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """Get properties by user ID"""
#         properties = await self.repository.get_property_by_user_id(
#             user_id=user_id,
#             skip=skip,
#             limit=limit
#         )
        
#         formatted_properties = []
#         for prop in properties:
#             formatted = await self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_user_id_property(user_id)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def update_property_status(
#         self,
#         property_id: int,
#         status: str,
#         user_id: Optional[str] = None
#     ) -> Dict[str, Any]:
#         """Update property status"""
#         property_obj = await self.repository.get_property_by_id(property_id)
#         if not property_obj:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Property with ID {property_id} not found"
#             )
        
#         if user_id and property_obj.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to update this property"
#             )
        
#         updated = await self.repository.update_property_status(
#             property_id=property_id,
#             status=status
#         )
        
#         return {
#             'success': True,
#             'message': f'Property status updated to {status}',
#             'property': await self._to_response(updated)
#         }
    
    
#     async def _to_response(self, property_obj):
#         """Convert property object to camelCase response format"""
#         if not property_obj:
#             return None

#         user_id = property_obj.user_id

#         vendor = await self.vendor_repository.get_vendor_profile(user_id)
#         name = vendor.full_name
            
#         response = {
#             # Core
#             'id': property_obj.id,
#             'postedAs': property_obj.posted_by if property_obj.posted_by else None,
#             'propertyType': property_obj.property_type,
#             'propertyTitle': property_obj.property_title,
#             'propertyAddress': property_obj.address,
#             'city': property_obj.city,
#             'state': property_obj.state,
#             'district':property_obj.district,
#             'pincode': property_obj.pin_code,
#             'listingPurpose': property_obj.listing_purpose if property_obj.listing_purpose else None,
#             'expectedPrice': property_obj.expected_price,
#             'priceType': property_obj.price_negotiable,
#             'availableFrom': property_obj.available_from.isoformat() if property_obj.available_from else None,
            
#             # Specs
#             'bedrooms': property_obj.bedrooms,
#             'bathrooms': property_obj.bathrooms,
#             'carpetArea': float(property_obj.carpet_area) if property_obj.carpet_area is not None else None,
#             'builtUpArea': float(property_obj.built_up_area) if property_obj.built_up_area is not None else None,
#             'furnishingStatus': property_obj.furnishing_status,
#             'parking': property_obj.parking,
#             'parkingSpaces': property_obj.parking_capacity,
#             'maintenance': property_obj.maintenance_amount,
            
#             # Amenities
#             'amenities': property_obj.amenities if property_obj.amenities else [],
            
#             # Contact
#             'userName': name,
#             'emailId': property_obj.user.email if property_obj.user else None,
#             'contactNumber': vendor.phone_number if property_obj.user else None,
            
#             # Additional
#             'propertyCategory': property_obj.property_category if property_obj.property_category else None,
#             # 'configuration': property_obj.sub_category,
            
#             # Common Filters
#             'hasGarden': property_obj.garden_space,
#             'hasTerrace': property_obj.terrace,
#             'hasBalcony': property_obj.balcony,
#             'facing': property_obj.facing_direction,
#             'floorNumber': property_obj.floor_number,
#             'totalFloors': property_obj.total_floors,
            
#             # Buy Filters
#             'homeLoanRequired': property_obj.loan_eligible,
            
#             # Rent Filters
#             'occupancyType': property_obj.tenant_type[0] if property_obj.tenant_type and len(property_obj.tenant_type) > 0 else None,
#             'rentalDuration': property_obj.minimum_duration,
#             'rentalTerm': property_obj.rental_term,
#             'rentalFrequency': property_obj.rental_frequency,
#             'petFriendly': property_obj.pet_friendly,
#             'securityDepositMin': property_obj.security_deposit,
#             'securityDepositMax': property_obj.security_deposit,
            
#             # Sell Filters
#             'ownershipType': property_obj.ownership_type,
#             'propertyAge': property_obj.property_age,
#             'propertyCondition': property_obj.property_condition,
#             'isNegotiable': property_obj.price_negotiable,
#             'loanOutstanding': property_obj.loan_outstanding,
#             'renewableOption': property_obj.renewable_option,
            
#             # Lease Filters
#             'BudgetMin': property_obj.price_min,
#             'BudgetMax': property_obj.price_max,
#             'advanceDeposit': property_obj.security_deposit,
#             'leaseDuration': property_obj.lease_terms,
            
#             # Land/Plot
#             'sub_category': property_obj.sub_category,
#             'landArea': property_obj.land_area,
#             'landAreaMin': property_obj.land_area_min,
#             'landAreaMax': property_obj.land_area_max,
#             'areaUnit': property_obj.area_unit,
#             'landShape': property_obj.land_shape,
#             'roadWidth': property_obj.road_width,
#             'waterSource': property_obj.water_source,
#             'soilType': property_obj.soil_type,
#             'electricityAvailable': property_obj.electricity_available,
#             'selectedFeature': property_obj.selected_feature if property_obj.selected_feature else [],
#             'paymentMode': property_obj.payment_mode,
#             'constructionStatus': property_obj.construction_status,
#             'possessionTimeline': property_obj.possession_timeline,
#             'readyToBuy': property_obj.ready_to_buy,
#             'totalSqft': float(property_obj.built_up_area) if property_obj.built_up_area is not None else None,
#             'highlights': property_obj.interior_features if property_obj.interior_features else [],
#             'location': property_obj.area,
#             'nearbyPlaces': property_obj.nearby_places if property_obj.nearby_places else [],
#             'nearbyConnectivity': property_obj.nearby_connectivity,

#             # Hostel
#             'hostelType': property_obj.hostel_type,
#             'roomType': property_obj.room_type if property_obj.room_type else [],
#             'sharingType': property_obj.sharing_type if property_obj.sharing_type else [],
#             'totalCapacity': property_obj.total_capacity,
#             'hostelCategory': property_obj.hostel_category,
#             'genderType': property_obj.gender_type,
#             'foodIncluded': property_obj.food_included,
#             'foodType': property_obj.food_type,
#             'mealsPerDay': property_obj.meals_per_day,
#             'kitchenAccess': property_obj.kitchen_access,
#             'bathroomType': property_obj.bathroom_type,
#             'utilitiesIncluded': property_obj.utilities_included,
#             'alcoholAllowed': property_obj.alcohol_allowed,
#             'minimumStayDuration': property_obj.minimum_stay_duration,
#             'paymentFrequency': property_obj.payment_frequency,
            
#             # Status
#             'status': property_obj.status or 'Under-Review',
#             'createdAt': property_obj.created_at,
#             'updatedAt': property_obj.updated_at,
            
#             # Media
#             'images': self._format_media(property_obj.media) if property_obj.media else [],
#             'documents': self._format_documents(property_obj.documents) if property_obj.documents else [],

#             # Type-Specific Details
#             'ownerDetails': self._get_owner_details(property_obj),
#             'agentDetails': self._get_agent_details(property_obj),
#             'builderDetails': self._get_builder_details(property_obj),
#             'pmDetails': self._get_property_management_details(property_obj),
#         }

#         return strip_none_values(response)
    
#     def _format_media(self, media_list):
#         return self.formatter.format_media(media_list)
    
#     def _format_documents(self, document_list):
#         return self.formatter.format_documents(document_list)
    
#     def _get_owner_details(self, property_obj):
#         return self.formatter.format_owner_details(property_obj)
    
#     def _get_agent_details(self, property_obj):
#         return self.formatter.format_agent_details(property_obj)
    
#     def _get_builder_details(self, property_obj):
#         return self.formatter.format_builder_details(property_obj)
    
#     def _get_property_management_details(self, property_obj):
#         return self.formatter.format_property_management_details(property_obj)

































































# from typing import Optional, List, Dict, Any
# from fastapi import HTTPException, UploadFile, status
# from app.core.id_generator import IDGenerator
# from app.core.response_utils import PropertyFormatter, strip_none_values
# from app.repositories.property_repository import PropertyRepository
# from app.services.file_service import FileService
# from app.models.property import BaseProperty
# from datetime import datetime

# class PropertyService:
#     def __init__(self, repository: PropertyRepository):
#         self.repository = repository
#         self.file_service = FileService()
#         self.formatter = PropertyFormatter()
    

    
#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         images: Optional[List[UploadFile]] = None,
#         video: Optional[UploadFile] = None,
#         documents: Optional[List[UploadFile]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> BaseProperty:
#         """
#         Create a new property with all related files
#         """
#         try:
#             property_payload = dict(property_data or {})
#             if user_id and "user_id" not in property_payload:
#                 property_payload["user_id"] = user_id

            
            
#             if property_payload.get("available_from") and isinstance(property_payload["available_from"], str):
#                 try:
#                     property_payload["available_from"] = datetime.strptime(property_payload["available_from"], "%Y-%m-%d").date()
#                 except ValueError:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Invalid date format for 'available_from'. Expected YYYY-MM-DD."
#                     )

#             # REMOVED: bedroom_filter/bathroom_filter no longer exist as
#             # columns on BaseProperty - bedrooms/bathrooms are now Integer
#             # columns themselves and can be queried/indexed directly, so the
#             # separate filter columns (and the extra_number() calls that
#             # populated them) aren't needed anymore. The controller's
#             # convert_value_for_db already coerces bedrooms/bathrooms to int
#             # before this point.

#             # 1. Save property to database
#             property_obj = await self.repository.create_property(
#                 posted_by=posted_by,
#                 property_data=property_payload,
#                 user_id = user_id,
#             )
            
#             upload_user_id = property_payload.get('user_id') or user_id
#             print(f"="*80)
#             print(f"user id is ${upload_user_id}")
#             print(f"="*80)
#             if images:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 upload_results = await self.file_service.upload_images(
#                     images=images,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_media({
#                         'property_id': property_obj.id,
#                         'media_type': 'image',
#                         'file_name': result['file_name'],
#                         'filename_mapper': result['filename_mapper'],
#                         'mime_type': result['mime_type'],
#                         'format': result['format'],
#                         'file_url': result['file_url'],
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result['file_size_kb'],
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': result['is_primary'],
#                         'order': result['order']
#                     })
            
#             if video:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 result = await self.file_service.upload_video(
#                     file=video,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 await self.repository.create_property_media({
#                     'property_id': property_obj.id,
#                     'media_type': 'video',
#                     'file_name': result['file_name'],
#                     'mime_type': result['mime_type'],
#                     'filename_mapper': result['filename_mapper'],
#                     'format': result['format'],
#                     'file_url': result['file_url'],
#                     'file_size_kb': result['file_size_kb'],
#                     'is_primary': False,
#                     'order': 0
#                 })
            
#             if documents:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 upload_results = await self.file_service.upload_documents(
#                     documents=documents,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_document({
#                         'property_id': property_obj.id,
#                         'user_id': upload_user_id,
#                         'document_type': result.get('document_type', 'other_supporting_document'),
#                         'file_name': result['stored_filename'],
#                         'mime_type': result['mime_type'],
#                         'file_url': result['file_url'],
#                         'file_size_kb': result.get('file_size_kb'),
#                         'is_public': False
#                     })
            
#             # Return formatted response
#             property_with_relations = await self.repository.get_property_with_relations(property_obj.id)
#             return self._to_response(property_with_relations)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to create property: {str(e)}")
    
#     # ============================================
#     # READ OPERATIONS
#     # ============================================
    
#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get all properties with pagination
#         """
#         properties = await self.repository.get_all_properties(
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_total_property_count()
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_property_by_id(self, property_id: int) -> Optional[Dict[str, Any]]:
#         """
#         Get a single property by ID with all relations
#         """
#         property_obj = await self.repository.get_property_with_relations(property_id)
        
#         if not property_obj:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Property with ID {property_id} not found"
#                 )
        
#         # Generate signed URLs for private files if needed
#         if property_obj.documents:
#             for doc in property_obj.documents:
#                 if not doc.is_public:
#                     doc.signed_url = await self.file_service.get_signed_url(
#                         doc.file_url,
#                         expiration=3600
#                     )
        
#         return self._to_response(property_obj)
    
#     async def filter_properties(self, filter_data: Any) -> Dict[str, Any]:
#         """
#         Advanced filter with pagination
#         """
#         properties, total_count = await self.repository.filter_properties(filter_data)
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': filter_data.page or 1,
#                 'limit': filter_data.limit or 20,
#                 'totalPages': (total_count + filter_data.limit - 1) // filter_data.limit if filter_data.limit > 0 else 0
#             }
#         }
    
#     # ============================================
#     # FILTER BY SPECIFIC FIELDS
#     # ============================================
    
#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by posted_by (single or multiple values)
#         """
#         properties = await self.repository.get_properties_by_posted_by(
#             posted_by=posted_by,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_posted_by(posted_by)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by property category
#         """
#         properties = await self.repository.get_properties_by_category(
#             property_category=property_category,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_category(property_category)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by property type
#         """
#         properties = await self.repository.get_properties_by_property_type(
#             property_type=property_type,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_property_type(property_type)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by listing purpose (rent/sell/lease)
#         """
#         properties = await self.repository.get_properties_by_purpose(
#             listing_purpose=listing_purpose,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_purpose(listing_purpose)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }

    
    
#     # ============================================
#     # UPDATE OPERATIONS
#     # ============================================
    
#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any],
#         new_status: Optional[str] = None,
#         images: Optional[List[UploadFile]] = None,
#         video: Optional[UploadFile] = None,
#         documents: Optional[List[UploadFile]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> Dict[str, Any]:
#         """
#         Update an existing property and return formatted response

#         NOTE: this parameter used to be named `status`, which shadowed the
#         `fastapi.status` module imported at the top of this file. Every
#         `status.HTTP_xxx` reference inside this method's body was silently
#         resolving to the *local string parameter* instead - so any 403 raise
#         below would itself crash with `AttributeError: 'str'/'NoneType'
#         object has no attribute 'HTTP_403_FORBIDDEN'` rather than actually
#         returning a 403. Renamed to `new_status` to fix it.
#         """
#         # 1. Check if property exists
#         existing_property = await self.repository.get_property_by_id(property_id)
#         if not existing_property:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and existing_property.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to update this property"
#             )
        
#         try:
#             # 2. Update property data
#             if update_data:
#                 await self.repository.update_property(
#                     property_id=property_id,
#                     update_data=update_data
#                 )
            
#             # 3. Update status if provided
#             if new_status:
#                 await self.repository.update_property_status(
#                     property_id=property_id,
#                     status=new_status
#                 )
            
#             # 4. Process new images if provided (replace existing)
#             if images:
#                 # Delete old images
#                 await self.repository.delete_property_media(property_id)
                
#                 upload_results = await self.file_service.upload_images(
#                     images=images,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_media({
#                         'property_id': property_id,
#                         'media_type': 'image',
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'format': result['format'],
#                         'file_url': result['file_url'],
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result['file_size_kb'],
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': result['is_primary'],
#                         'order': result['order']
#                     })
            
#             # 5. Process new video if provided
#             if video:
#                 # Delete old video
#                 await self.repository.delete_property_video(property_id)
                
#                 result = await self.file_service.upload_video(
#                     file=video,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 await self.repository.create_property_media({
#                     'property_id': property_id,
#                     'media_type': 'video',
#                     'file_name': result['file_name'],
#                     'mime_type': result['mime_type'],
#                     'format': result['format'],
#                     'file_url': result['file_url'],
#                     'file_size_kb': result['file_size_kb'],
#                     'is_primary': False,
#                     'order': 0
#                 })
            
#             # 6. Process new documents if provided (append or replace)
#             if documents:
#                 # Option 1: Replace all documents
#                 await self.repository.delete_property_documents(property_id)
                
#                 upload_results = await self.file_service.upload_documents(
#                     documents=documents,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_document({
#                         'property_id': property_id,
#                         'document_type': result.get('document_type', 'other_supporting_document'),
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'file_url': result['file_url'],
#                         'file_size_kb': result.get('file_size_kb'),
#                         'is_public': False
#                     })
            
#             # 7. Return formatted updated property
#             updated_property = await self.repository.get_property_with_relations(property_id)
#             return self._to_response(updated_property)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to update property: {str(e)}")
    
#     # ============================================
#     # DELETE OPERATIONS
#     # ============================================
    
#     async def delete_property(self, property_id: int, user_id: Optional[str] = None) -> Dict[str, Any]:
#         """
#         Delete a property and all associated files
#         """
#         # 1. Check if property exists
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and property_obj.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to delete this property"
#             )
        
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)
            
#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
            
#             # 3. Delete from database
#             await self.repository.delete_property(property_id)
            
#             return {
#                 'success': True,
#                 'message': f'Property with ID {property_id} deleted successfully'
#             }
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to delete property: {str(e)}")

#     async def delete_property_admin(self, property_id: int) -> Dict[str, Any]:
#         """
#         Admin delete property
#         """
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)

#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
#             await self.repository.delete_property(property_id)
#             return {
#                 'success': True,
#                 'message': f'Property with ID {property_id} deleted successfully'
#             }
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to delete property: {str(e)}")

#     # ============================================
#     # RESPONSE FORMATTING METHODS
#     # ============================================

#     def _to_response(self, property_obj):
#         """
#         Convert property object to camelCase response format
#         """
#         if not property_obj:
#             return None
            
#         response = {
#             # ===== Core =====
#             'id': property_obj.id,
#             # CHANGED: posted_by/listing_purpose/property_category are now
#             # plain String columns (not SQLAlchemy Enum), so the fetched
#             # value from the DB is already a plain str - calling .value on
#             # it would raise AttributeError. Use the value directly.
#             'postedAs': property_obj.posted_by if property_obj.posted_by else None,
#             'propertyType': property_obj.property_type,
#             'propertyTitle': property_obj.property_title,
#             'propertyAddress': property_obj.address,
#             'city': property_obj.city,
#             'state': property_obj.state,
#             'pincode': property_obj.pin_code,
#             'listingPurpose': property_obj.listing_purpose if property_obj.listing_purpose else None,
#             'expectedPrice': property_obj.expected_price,
#             'priceType': None,
#             'availableFrom': property_obj.available_from.isoformat() if property_obj.available_from else None,
            
#             # ===== Specs =====
#             'bedrooms': property_obj.bedrooms,
#             'bathrooms': property_obj.bathrooms,
#             'carpetArea': float(property_obj.carpet_area) if property_obj.carpet_area is not None else None,
#             'builtUpArea': float(property_obj.built_up_area) if property_obj.built_up_area is not None else None,
#             'furnishingStatus': property_obj.furnishing_status,
#             'parking': property_obj.parking,
#             'parkingSpaces': property_obj.parking_capacity,
#             'maintenance': property_obj.maintenance_amount,
            
#             # ===== Amenities =====
#             'amenities': property_obj.amenities if property_obj.amenities else [],
#             'otherAmenities': None,
            
#             # ===== Contact =====
#             'userName': property_obj.user.full_name if property_obj.user else None,
#             'emailId': property_obj.user.email if property_obj.user else None,
#             'contactNumber': property_obj.user.phone_number if property_obj.user else None,
#             'contactPerson': property_obj.user.full_name if property_obj.user else None,
#             'officeAddress': property_obj.address,
            
#             # ===== Additional =====
#             'propertyCategory': property_obj.property_category if property_obj.property_category else None,
#             'configuration': property_obj.sub_category,
            
#             # ===== Common Filters =====
#             'hasGarden': property_obj.garden_space,
#             'hasTerrace': property_obj.terrace,
#             'hasSwimmingPool': None,
#             'hasBalcony': property_obj.balcony,
#             'facing': property_obj.facing_direction,
#             'floorNumber': property_obj.floor_number,
#             'totalFloors': property_obj.total_floors,
            
#             # ===== Buy Filters =====
#             'buyingPurpose': None,
#             'homeLoanRequired': property_obj.loan_eligible,
#             'purchaseTimeframe': None,
            
#             # ===== Rent Filters =====
#             'occupancyType': property_obj.tenant_type[0] if property_obj.tenant_type and len(property_obj.tenant_type) > 0 else None,
#             # CHANGED: column renamed minimum_rental_duration -> minimum_duration
#             'rentalDuration': property_obj.minimum_duration,
#             'rentalTerm': property_obj.rental_term,
#             'rentalFrequency': property_obj.rental_frequency,
#             'petFriendly': property_obj.pet_friendly,
#             'waterSupply': None,
#             'securityDepositMin': property_obj.security_deposit,
#             'securityDepositMax': property_obj.security_deposit,
            
#             # ===== Sell Filters =====
#             'ownershipType': property_obj.ownership_type,
#             # CHANGED: property_age is now an Integer column - it's already
#             # an int (or None), the old .isdigit() string check no longer
#             # applies and would raise AttributeError on an int.
#             'propertyAge': property_obj.property_age,
#             'propertyCondition': property_obj.property_condition,
#             'floorCount': property_obj.total_floors,
#             'isNegotiable': property_obj.price_negotiable,
#             'loanOutstanding': property_obj.loan_outstanding,
#             # CHANGED: renamed lease_renewable -> renewable_option
#             'renewableOption': property_obj.renewable_option,
            
#             # ===== Lease Filters =====
#             'leaseBudgetMin': property_obj.price_min,
#             'leaseBudgetMax': property_obj.price_max,
#             'advanceDepositMin': property_obj.security_deposit,
#             'advanceDepositMax': property_obj.security_deposit,
#             'leaseDuration': property_obj.lease_terms,
            
#             # ===== Land/Plot =====
#             'plotSize': property_obj.sub_category,
#             'landArea': property_obj.land_area,
#             'landAreaMin': property_obj.land_area_min,
#             'landAreaMax': property_obj.land_area_max,
#             'areaUnit': property_obj.area_unit,
#             'landShape': property_obj.land_shape,
#             'roadWidth': property_obj.road_width,
#             'waterSource': property_obj.water_source,
#             'soilType': property_obj.soil_type,
#             'electricityAvailable': property_obj.electricity_available,
#             'selectedFeature': property_obj.selected_feature if property_obj.selected_feature else [],
#             'paymentMode': property_obj.payment_mode,
#             'constructionStatus': property_obj.construction_status,
#             'possessionTimeline': property_obj.possession_timeline,
#             'readyToBuy': property_obj.ready_to_buy,
#             'totalSqft': float(property_obj.built_up_area) if property_obj.built_up_area is not None else None,
#             'sqftPrice': None,
#             'aboutPoster': None,
#             'highlights': property_obj.interior_features if property_obj.interior_features else [],
#             'location': property_obj.area,
#             'nearbyPlaces': property_obj.nearby_places if property_obj.nearby_places else [],
#             'nearbyConnectivity': property_obj.nearby_connectivity,

#             # ===== Hostel =====
#             'hostelType': property_obj.hostel_type,
#             'roomType': property_obj.room_type if property_obj.room_type else [],
#             'sharingType': property_obj.sharing_type if property_obj.sharing_type else [],
#             'totalCapacity': property_obj.total_capacity,
#             'hostelCategory': property_obj.hostel_category,
#             'genderType': property_obj.gender_type,
#             'foodIncluded': property_obj.food_included,
#             'foodType': property_obj.food_type,
#             'mealsPerDay': property_obj.meals_per_day,
#             'kitchenAccess': property_obj.kitchen_access,
#             'bathroomType': property_obj.bathroom_type,
#             'utilitiesIncluded': property_obj.utilities_included,
#             'alcoholAllowed': property_obj.alcohol_allowed,
#             'minimumStayDuration': property_obj.minimum_stay_duration,
#             'paymentFrequency': property_obj.payment_frequency,
            
#             # ===== Status =====
#             'status': property_obj.status or 'Under-Review',
#             'viewCount': 0,
#             'createdAt': property_obj.created_at,
#             'updatedAt': property_obj.updated_at,
            
#             # ===== Media =====
#             'images': self._format_media(property_obj.media) if property_obj.media else [],
#             'documents': self._format_documents(property_obj.documents) if property_obj.documents else [],

            
#             # ===== Type-Specific Details =====

#             'ownerDetails': self._get_owner_details(property_obj),
#             'agentDetails': self._get_agent_details(property_obj),
#             'builderDetails': self._get_builder_details(property_obj),
#             'pmDetails': self._get_property_management_details(property_obj),
#         }

        
#         # Use your existing strip_none_values utility
#         return strip_none_values(response)
    
#     def _format_media(self, media_list):
#        return self.formatter.format_media(media_list)
    
#     def _format_documents(self, document_list):
#        return self.formatter.format_documents(document_list)
    
#     def _get_owner_details(self, property_obj):
#         return self.formatter.format_owner_details(property_obj)
    
#     def _get_agent_details(self, property_obj):
#         return self.formatter.format_agent_details(property_obj)
    
#     def _get_builder_details(self, property_obj):
#         return self.formatter.format_builder_details(property_obj)
    
#     def _get_property_management_details(self, property_obj):
#         return self.formatter.format_property_management_details(property_obj)




























# from typing import Optional, List, Dict, Any
# from fastapi import HTTPException, UploadFile, status
# from app.core.response_utils import strip_none_values
# from app.repositories.property_repository import PropertyRepository
# from app.services.file_service import FileService
# from app.models.property import BaseProperty
# from datetime import datetime

# class PropertyService:
#     def __init__(self, repository: PropertyRepository):
#         self.repository = repository
#         self.file_service = FileService()
    

#     # ============================================
#     # CREATE OPERATIONS
#     # ============================================
    
#     #selected
#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         images: Optional[List[UploadFile]] = None,
#         video: Optional[UploadFile] = None,
#         documents: Optional[List[UploadFile]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> BaseProperty:
#         """
#         Create a new property with all related files
#         """
#         # print(f"Service layer Creating property with user_id: {user_id}")  # Debugging line
#         try:
#             property_payload = dict(property_data or {})
#             if user_id and "user_id" not in property_payload:
#                 property_payload["user_id"] = user_id
#             if property_payload.get("available_from") and isinstance(property_payload["available_from"], str):
#                 try:
#                     property_payload["available_from"] = datetime.strptime(property_payload["available_from"], "%Y-%m-%d").date()
#                 except ValueError:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Invalid date format for 'available_from'. Expected YYYY-MM-DD."
#                     )


#             property_payload["bedroom_filter"] = int(property_payload["bedrooms"])
#             property_payload["bathroom_filter"] = int(property_payload['bathrooms'])

#             print(f"")

#             # 1. Save property to database
#             property_obj = await self.repository.create_property(
#                 posted_by=posted_by,
#                 property_data=property_payload
#             )


#             # print(f"property_obj after creation: {property_obj}")  # Debugging line
            
#             # 2. Process and upload images with compression
#             upload_user_id = property_payload.get('user_id') or user_id
#             if images:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 upload_results = await self.file_service.upload_images(
#                     images=images,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_media({
#                         'property_id': property_obj.id,
#                         'media_type': 'image',
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'format': result['format'],
#                         'file_url': result['file_url'],
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result['file_size_kb'],
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': result['is_primary'],
#                         'order': result['order']
#                     })
            
#             # 3. Process and upload video (if present)
#             if video:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 result = await self.file_service.upload_video(
#                     file=video,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 await self.repository.create_property_media({
#                     'property_id': property_obj.id,
#                     'media_type': 'video',
#                     'file_name': result['file_name'],
#                     'mime_type': result['mime_type'],
#                     'format': result['format'],
#                     'file_url': result['file_url'],
#                     'file_size_kb': result['file_size_kb'],
#                     'is_primary': False,
#                     'order': 0
#                 })
            
#             # 4. Process and upload documents (if present)
#             if documents:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 upload_results = await self.file_service.upload_documents(
#                     documents=documents,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_document({
#                         'property_id': property_obj.id,
#                         'document_type': result.get('document_type', 'other_supporting_document'),
#                         'file_name': result['stored_filename'],
#                         'mime_type': result['mime_type'],
#                         'file_url': result['file_url'],
#                         'file_size_kb': result.get('file_size_kb'),
#                         'is_public': False
#                     })
            
#             # 5. Refresh and return property with all relations
#             return await self.repository.get_property_with_relations(property_obj.id)
            
#         except Exception as e:
#             # Rollback if any error occurs
#             await self.repository.rollback()
#             raise Exception(f"Failed to create property: {str(e)}")
    
#     # ============================================
#     # READ OPERATIONS
#     # ============================================
    
#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get all properties with pagination
#         """
#         properties = await self.repository.get_all_properties(
#             skip=skip,
#             limit=limit
#         )
        
#         total_count = await self.repository.get_total_property_count()
        
#         return {
#             'properties': properties,
#             'total': total_count,
#             'page': (skip // limit) + 1 if limit > 0 else 1,
#             'limit': limit,
#             'pages': (total_count + limit - 1) // limit if limit > 0 else 0
#         }
    
#     async def get_property_by_id(self, property_id: int) -> Optional[BaseProperty]:
#         """
#         Get a single property by ID with all relations
#         """
#         property_obj = await self.repository.get_property_with_relations(property_id)
        
#         if not property_obj:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Property with ID {property_id} not found"
#                 )
        
#         # Generate signed URLs for private files if needed
#         if property_obj.documents:
#             for doc in property_obj.documents:
#                 if not doc.is_public:
#                     doc.signed_url = await self.file_service.get_signed_url(
#                         doc.file_url,
#                         expiration=3600
#                     )
        
#         return property_obj
    
#     async def filter_properties(self, filter_data: Any) -> Dict[str, Any]:
#         """
#         Advanced filter with pagination
#         """
#         properties, total_count = await self.repository.filter_properties(filter_data)
        
#         return {
#             'properties': properties,
#             'total': total_count,
#             'page': filter_data.page or 1,
#             'limit': filter_data.limit or 20,
#             'pages': (total_count + filter_data.limit - 1) // filter_data.limit if filter_data.limit > 0 else 0
#         }
    
#     # ============================================
#     # FILTER BY SPECIFIC FIELDS
#     # ============================================
    
#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by posted_by (single or multiple values)
#         """
#         properties = await self.repository.get_properties_by_posted_by(
#             posted_by=posted_by,
#             skip=skip,
#             limit=limit
#         )
        
#         total_count = await self.repository.get_count_by_posted_by(posted_by)
        
#         return {
#             'properties': properties,
#             'total': total_count,
#             'page': (skip // limit) + 1 if limit > 0 else 1,
#             'limit': limit,
#             'pages': (total_count + limit - 1) // limit if limit > 0 else 0
#         }
    
#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by property category
#         """
#         properties = await self.repository.get_properties_by_category(
#             property_category=property_category,
#             skip=skip,
#             limit=limit
#         )
        
#         total_count = await self.repository.get_count_by_category(property_category)
        
#         return {
#             'properties': properties,
#             'total': total_count,
#             'page': (skip // limit) + 1 if limit > 0 else 1,
#             'limit': limit,
#             'pages': (total_count + limit - 1) // limit if limit > 0 else 0
#         }
    
#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by property type
#         """
#         properties = await self.repository.get_properties_by_property_type(
#             property_type=property_type,
#             skip=skip,
#             limit=limit
#         )
#         properties = self._to_response(properties)
        
#         total_count = await self.repository.get_count_by_property_type(property_type)
        
#         return {
#             'properties': properties,
#             'total': total_count,
#             'page': (skip // limit) + 1 if limit > 0 else 1,
#             'limit': limit,
#             'pages': (total_count + limit - 1) // limit if limit > 0 else 0
#         }
    
#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by listing purpose (rent/sell/lease)
#         """
#         properties = await self.repository.get_properties_by_purpose(
#             listing_purpose=listing_purpose,
#             skip=skip,
#             limit=limit
#         )
        
#         total_count = await self.repository.get_count_by_purpose(listing_purpose)
        
#         return {
#             'properties': properties,
#             'total': total_count,
#             'page': (skip // limit) + 1 if limit > 0 else 1,
#             'limit': limit,
#             'pages': (total_count + limit - 1) // limit if limit > 0 else 0
#         }


#     async def get_properties_by_user(self, user_id:str,skip:int = 0, limit:int = 20)-> Dict[str,Any]:

#         properties = await self.repository.get_property_by_user_id(
#             user_id=user_id,
#             skip=skip,
#             limit=limit
#         )
#         total_count = await self.repository.get_count_by_user_id_property(user_id)

#         return {
#             "data": properties,
#             "pagination": {
#                 "total": total_count,
#                 "page": (skip // limit) + 1 if limit > 0 else 1,
#                 "limit": limit,
#                 "total_pages": (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     # ============================================
#     # UPDATE OPERATIONS
#     # ============================================
    
#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any],
#         status: Optional[str] = None,
#         images: Optional[List[UploadFile]] = None,
#         video: Optional[UploadFile] = None,
#         documents: Optional[List[UploadFile]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> BaseProperty:
#         """
#         Update an existing property
#         """
#         # 1. Check if property exists
#         existing_property = await self.repository.get_property_by_id(property_id)
#         if not existing_property:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and existing_property.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to update this property"
#             )
        
#         try:
#             # 2. Update property data
#             if update_data:
#                 await self.repository.update_property(
#                     property_id=property_id,
#                     update_data=update_data
#                 )
            
#             # 3. Update status if provided
#             if status:
#                 await self.repository.update_property_status(
#                     property_id=property_id,
#                     status=status
#                 )
            
#             # 4. Process new images if provided (replace existing)
#             if images:
#                 # Delete old images
#                 await self.repository.delete_property_media(property_id)
                
#                 upload_results = await self.file_service.upload_images(
#                     images=images,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_media({
#                         'property_id': property_id,
#                         'media_type': 'image',
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'format': result['format'],
#                         'file_url': result['file_url'],
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result['file_size_kb'],
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': result['is_primary'],
#                         'order': result['order']
#                     })
            
#             # 5. Process new video if provided
#             if video:
#                 # Delete old video
#                 await self.repository.delete_property_video(property_id)
                
#                 result = await self.file_service.upload_video(
#                     file=video,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 await self.repository.create_property_media({
#                     'property_id': property_id,
#                     'media_type': 'video',
#                     'file_name': result['file_name'],
#                     'mime_type': result['mime_type'],
#                     'format': result['format'],
#                     'file_url': result['file_url'],
#                     'file_size_kb': result['file_size_kb'],
#                     'is_primary': False,
#                     'order': 0
#                 })
            
#             # 6. Process new documents if provided (append or replace)
#             if documents:
#                 # Option 1: Replace all documents
#                 await self.repository.delete_property_documents(property_id)
                
#                 upload_results = await self.file_service.upload_documents(
#                     documents=documents,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_document({
#                         'property_id': property_id,
#                         'document_type': result.get('document_type', 'other_supporting_document'),
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'file_url': result['file_url'],
#                         'file_size_kb': result.get('file_size_kb'),
#                         'is_public': False
#                     })
            
#             # 7. Return updated property
#             return await self.repository.get_property_with_relations(property_id)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to update property: {str(e)}")
    
#     # ============================================
#     # DELETE OPERATIONS
#     # ============================================
    
#     async def delete_property(self, property_id: int, user_id: Optional[str] = None) -> bool:
#         """
#         Delete a property and all associated files
#         """
#         # 1. Check if property exists
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and property_obj.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to delete this property"
#             )
        
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)
            
#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
            
#             # 3. Delete from database
#             await self.repository.delete_property(property_id)
            
#             return True
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to delete property: {str(e)}")


#     async def delete_property_admin(self, property_id:int)-> bool:
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)

#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
#             await self.repository.delete_property(property_id)
#             return True
#         except Exception as e:
#                     await self.repository.rollback()
#                     raise Exception(f"Failed to delete property: {str(e)}")


#     def _to_response(self, property_obj):
#         if not property_obj:
#             return None
#         response = {
#             # ===== Core =====
#             'id': property_obj.id,
#             'postedAs': property_obj.posted_by.value if property_obj.posted_by else None,
#             'propertyType': property_obj.property_type,
#             'propertyTitle': property_obj.property_title,
#             'propertyAddress': property_obj.address,
#             'city': property_obj.city,
#             'state': property_obj.state,
#             'pincode': property_obj.pin_code,
#             'listingPurpose': property_obj.listing_purpose.value if property_obj.listing_purpose else None,
#             'expectedPrice': property_obj.expected_price,
#             'priceType': None,
#             'availableFrom': property_obj.available_from.isoformat() if property_obj.available_from else None,
            
#             # ===== Specs =====
#             'bedrooms': property_obj.bedroom_filter,
#             'bathrooms': property_obj.bathroom_filter,
#             'carpetArea': float(property_obj.carpet_area) if property_obj.carpet_area else None,
#             'builtUpArea': float(property_obj.built_up_area) if property_obj.built_up_area else None,
#             'furnishingStatus': property_obj.furnishing_status,
#             'parking': property_obj.parking,
#             'parkingSpaces': property_obj.parking_capacity,
#             'maintenance': float(property_obj.maintenance_amount) if property_obj.maintenance_amount else None,
            
#             # ===== Amenities =====
#             'amenities': property_obj.amenities if property_obj.amenities else [],
#             'otherAmenities': None,
            
#             # ===== Contact =====
#             'ownerName': property_obj.user.full_name if property_obj.user else None,
#             'emailId': property_obj.user.email if property_obj.user else None,
#             'contactNumber': property_obj.user.phone_number if property_obj.user else None,
#             'contactPerson': property_obj.user.full_name if property_obj.user else None,
#             'officeAddress': property_obj.address,
            
#             # ===== Additional =====
#             'propertyCategory': property_obj.property_category.value if property_obj.property_category else None,
#             'configuration': property_obj.sub_category,
            
#             # ===== Common Filters =====
#             'hasGarden': property_obj.garden_space,
#             'hasTerrace': property_obj.terrace,
#             'hasSwimmingPool': None,
#             'hasBalcony': property_obj.balcony,
#             'facing': property_obj.facing_direction,
#             'floorNumber': property_obj.floor_number,
#             'totalFloors': property_obj.total_floors,
            
#             # ===== Buy Filters =====
#             'buyingPurpose': None,
#             'homeLoanRequired': property_obj.loan_eligible,
#             'purchaseTimeframe': None,
            
#             # ===== Rent Filters =====
#             'occupancyType': property_obj.tenant_type[0] if property_obj.tenant_type and len(property_obj.tenant_type) > 0 else None,
#             'rentalDuration': property_obj.minimum_rental_duration,
#             'petFriendly': property_obj.pet_friendly,
#             'waterSupply': None,
#             'securityDepositMin': property_obj.security_deposit,
#             'securityDepositMax': property_obj.security_deposit,
            
#             # ===== Sell Filters =====
#             'ownershipType': property_obj.ownership_type,
#             'propertyAge': int(property_obj.property_age) if property_obj.property_age and property_obj.property_age.isdigit() else None,
#             'propertyCondition': property_obj.property_condition,
#             'floorCount': property_obj.total_floors,
#             'isNegotiable': property_obj.price_negotiable,
#             'loanOutstanding': property_obj.loan_outstanding,
            
#             # ===== Lease Filters =====
#             'leaseBudgetMin': float(property_obj.price_min) if property_obj.price_min else None,
#             'leaseBudgetMax': float(property_obj.price_max) if property_obj.price_max else None,
#             'advanceDepositMin': property_obj.security_deposit,
#             'advanceDepositMax': property_obj.security_deposit,
#             'leaseDuration': property_obj.lease_terms,
            
#             # ===== Land/Plot =====
#             'plotSize': property_obj.sub_category,
#             'totalSqft': float(property_obj.built_up_area) if property_obj.built_up_area else None,
#             'sqftPrice': None,
#             'aboutPoster': None,
#             'highlights': property_obj.interior_features if property_obj.interior_features else [],
#             'location': property_obj.area,
            
#             # ===== Status =====
#             'status': property_obj.status or 'Under-Review',
#             'viewCount': 0,
#             'createdAt': property_obj.created_at,
#             'updatedAt': property_obj.updated_at,
            
#             # ===== Media =====
#             'images': self._format_media(property_obj.media) if property_obj.media else [],
#             'documents': self._format_documents(property_obj.documents) if property_obj.documents else [],
            
#             # ===== Type-Specific Details =====
#             'ownerDetails': self._get_owner_details(property_obj),
#             'agentDetails': self._get_agent_details(property_obj),
#             'builderDetails': self._get_builder_details(property_obj),
#             'hostelDetails': None,
#             'pmDetails': self._get_property_management_details(property_obj),
#         }
        
#         # Use your existing strip_none_values utility
#         return strip_none_values(response)
    
#     def _format_media(self, media_list):
#         if not media_list:
#             return []
            
#         formatted_media = []
#         for media in media_list:
#             formatted_media.append({
#                 'id': media.id,
#                 'fileUrl': media.file_url,
#                 'thumbnailUrl': media.thumbnail_url,
#                 'isPrimary': media.is_primary or False
#             })
#         return formatted_media
    
#     def _format_documents(self, document_list):
       
#         if not document_list:
#             return []
            
#         formatted_docs = []
#         for doc in document_list:
#             formatted_docs.append({
#                 'id': doc.id,
#                 'documentType': doc.document_type,
#                 'fileName': doc.file_name,
#                 'fileUrl': doc.file_url,
#                 'fileSizeKb': doc.file_size_kb
#             })
#         return formatted_docs
    
#     def _get_owner_details(self, property_obj):
       
#         if property_obj.posted_by.value == 'OWNER' and property_obj.owner_details:
#             owner = property_obj.owner_details
#             return {
#                 'ownerId': owner.id,
#                 'ownerName': owner.owner_name,
#                 'dateOfBirth': owner.date_of_birth.isoformat() if owner.date_of_birth else None,
#                 'gender': owner.gender,
#                 'aadhaarNumber': owner.aadhaar_number,
#                 'panNumber': owner.pan_number,
#                 'mobile': owner.mobile,
#                 'emailId': owner.email_id,
#                 'addressLine1': owner.address_line1,
#                 'addressLine2': owner.address_line2,
#                 'city': owner.owner_city,
#                 'state': owner.owner_state,
#                 'pincode': owner.owner_pin_code,
#                 'preferredContactMethod': owner.preferred_contact_method if owner.preferred_contact_method else [],
#                 'preferredContactTime': owner.preferred_contact_time,
#                 'bankName': owner.bank_name,
#                 'accountHolderName': owner.account_holder_name,
#                 'accountNumber': owner.account_number,
#                 'ifscCode': owner.ifsc_code,
#                 'upiId': owner.upi_id,
#                 'signature': owner.signature,
#                 'signatureDate': owner.signature_date.isoformat() if owner.signature_date else None,
#                 'signaturePlace': owner.signature_place,
#                 'declarationAccepted': owner.declaration_accepted
#             }
#         return None
    
#     def _get_agent_details(self, property_obj):
       
#         if property_obj.posted_by.value == 'AGENT' and property_obj.agent_details:
#             agent = property_obj.agent_details
#             return {
#                 'agentId': agent.id,
#                 'agentName': agent.agent_name,
#                 'dateOfBirth': agent.date_of_birth.isoformat() if agent.date_of_birth else None,
#                 'gender': agent.gender,
#                 'mobile': agent.mobile,
#                 'emailId': agent.email_id,
#                 'officeAddress': agent.office_address,
#                 'agencyName': agent.agency_name,
#                 'reraRegistrationNumber': agent.rera_registration_number,
#                 'gstNumber': agent.gst_number,
#                 'experience': agent.experience,
#                 'activeListing': agent.active_listing,
#                 'serviceArea': agent.service_area if agent.service_area else [],
#                 'bankName': agent.bank_name,
#                 'accountHolderName': agent.account_holder_name,
#                 'accountNumber': agent.account_number,
#                 'ifscCode': agent.ifsc_code,
#                 'upiId': agent.upi_id,
#                 'signature': agent.signature,
#                 'signatureDate': agent.signature_date.isoformat() if agent.signature_date else None,
#                 'signaturePlace': agent.signature_place,
#                 'declarationAccepted': agent.declaration_accepted
#             }
#         return None
    
#     def _get_builder_details(self, property_obj):
       
#         if property_obj.posted_by.value == 'BUILDER' and property_obj.builder_details:
#             builder = property_obj.builder_details
#             return {
#                 'builderId': builder.id,
#                 'name': builder.name,
#                 'designation': builder.designation,
#                 'mobile': builder.mobile,
#                 'whatsappNumber': builder.whatsapp_number,
#                 'email': builder.email,
#                 'reraRegistrationNumber': builder.rera_registration_number,
#                 'gstNumber': builder.gst_number,
#                 'experience': builder.experience,
#                 'aadharNumber': builder.aadhar_number,
#                 'panNumber': builder.pan_number,
#                 'companyName': builder.company_name,
#                 'companyRegNumber': builder.company_reg_number,
#                 'companyWebsite': builder.company_website,
#                 'companyProfile': builder.company_profile,
#                 'officeAddress': builder.office_address,
#                 'city': builder.city,
#                 'district': builder.district,
#                 'state': builder.state,
#                 'pincode': builder.pincode,
#                 'landmark': builder.landmark,
#                 'website': builder.website,
#                 'facebook': builder.facebook,
#                 'instagram': builder.instagram,
#                 'linkedin': builder.linkedin,
#                 'youtube': builder.youtube,
#                 'bankName': builder.bank_name,
#                 'accountHolderName': builder.account_holder_name,
#                 'accountNumber': builder.account_number,
#                 'ifscCode': builder.ifsc_code,
#                 'upiId': builder.upi_id,
#                 'signature': builder.signature,
#                 'signatureDate': builder.signature_date.isoformat() if builder.signature_date else None,
#                 'signaturePlace': builder.signature_place,
#                 'declarationAccepted': builder.declaration_accepted
#             }
#         return None
    
#     def _get_property_management_details(self, property_obj):
        
#         if property_obj.posted_by.value == 'PROPERTY_MANAGEMENT' and property_obj.property_management_details:
#             pm = property_obj.property_management_details
#             return {
#                 'pmId': pm.id,
#                 'name': pm.name,
#                 'designation': pm.designation,
#                 'mobile': pm.mobile,
#                 'whatsappNumber': pm.whatsapp_number,
#                 'email': pm.email,
#                 'companyName': pm.company_name,
#                 'companyRegNumber': pm.company_reg_number,
#                 'companyWebsite': pm.company_website,
#                 'companyProfile': pm.company_profile,
#                 'reraRegistrationNumber': pm.rera_registration_number,
#                 'gstNumber': pm.gst_number,
#                 'experience': pm.experience,
#                 'aadharNumber': pm.aadhar_number,
#                 'panNumber': pm.pan_number,
#                 'officeAddress': pm.office_address,
#                 'city': pm.city,
#                 'district': pm.district,
#                 'state': pm.state,
#                 'pincode': pm.pincode,
#                 'landmark': pm.landmark,
#                 'website': pm.website,
#                 'facebook': pm.facebook,
#                 'instagram': pm.instagram,
#                 'linkedin': pm.linkedin,
#                 'youtube': pm.youtube,
#                 'bankName': pm.bank_name,
#                 'accountHolderName': pm.account_holder_name,
#                 'accountNumber': pm.account_number,
#                 'ifscCode': pm.ifsc_code,
#                 'upiId': pm.upi_id,
#                 'signature': pm.signature,
#                 'signatureDate': pm.signature_date.isoformat() if pm.signature_date else None,
#                 'signaturePlace': pm.signature_place,
#                 'declarationAccepted': pm.declaration_accepted
#             }
#         return None



















































































# from typing import Optional, List, Dict, Any
# from fastapi import HTTPException, UploadFile, status
# from app.core.id_generator import IDGenerator
# from app.core.response_utils import PropertyFormatter, strip_none_values
# from app.repositories.property_repository import PropertyRepository
# from app.services.file_service import FileService
# from app.models.property import BaseProperty
# from datetime import datetime
# import re

# class PropertyService:
#     def __init__(self, repository: PropertyRepository):
#         self.repository = repository
#         self.file_service = FileService()
#         self.formatter = PropertyFormatter()
    

    
#     async def create_property(
#         self,
#         posted_by: str,
#         property_data: Dict[str, Any],
#         images: Optional[List[UploadFile]] = None,
#         video: Optional[UploadFile] = None,
#         documents: Optional[List[UploadFile]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> BaseProperty:
#         """
#         Create a new property with all related files
#         """
#         try:
#             property_payload = dict(property_data or {})
#             if user_id and "user_id" not in property_payload:
#                 property_payload["user_id"] = user_id

            
            
#             if property_payload.get("available_from") and isinstance(property_payload["available_from"], str):
#                 try:
#                     property_payload["available_from"] = datetime.strptime(property_payload["available_from"], "%Y-%m-%d").date()
#                 except ValueError:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Invalid date format for 'available_from'. Expected YYYY-MM-DD."
#                     )

#             property_payload["bedroom_filter"] = self.extract_number(property_payload.get("bedrooms","0"))
#             property_payload["bathroom_filter"] = self.extract_number(property_payload.get("bathrooms", "0"))

#             # 1. Save property to database
#             property_obj = await self.repository.create_property(
#                 posted_by=posted_by,
#                 property_data=property_payload,
#                 user_id = user_id,
#             )
            
#             upload_user_id = property_payload.get('user_id') or user_id
#             if images:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 upload_results = await self.file_service.upload_images(
#                     images=images,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_media({
#                         'property_id': property_obj.id,
#                         'media_type': 'image',
#                         'file_name': result['file_name'],
#                         'filename_mapper': result['filename_mapper'],
#                         'mime_type': result['mime_type'],
#                         'format': result['format'],
#                         'file_url': result['file_url'],
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result['file_size_kb'],
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': result['is_primary'],
#                         'order': result['order']
#                     })
            
#             if video:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 result = await self.file_service.upload_video(
#                     file=video,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 await self.repository.create_property_media({
#                     'property_id': property_obj.id,
#                     'media_type': 'video',
#                     'file_name': result['file_name'],
#                     'mime_type': result['mime_type'],
#                     'filename_mapper': result['filename_mapper'],
#                     'format': result['format'],
#                     'file_url': result['file_url'],
#                     'file_size_kb': result['file_size_kb'],
#                     'is_primary': False,
#                     'order': 0
#                 })
            
#             if documents:
#                 if not upload_user_id:
#                     raise HTTPException(
#                         status_code=status.HTTP_400_BAD_REQUEST,
#                         detail="Missing user_id for file uploads"
#                     )
#                 upload_results = await self.file_service.upload_documents(
#                     documents=documents,
#                     user_id=upload_user_id,
#                     property_id=property_obj.id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_document({
#                         'property_id': property_obj.id,
#                         'document_type': result.get('document_type', 'other_supporting_document'),
#                         'file_name': result['stored_filename'],
#                         'mime_type': result['mime_type'],
#                         'file_url': result['file_url'],
#                         'file_size_kb': result.get('file_size_kb'),
#                         'is_public': False
#                     })
            
#             # Return formatted response
#             property_with_relations = await self.repository.get_property_with_relations(property_obj.id)
#             return self._to_response(property_with_relations)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to create property: {str(e)}")
    
#     # ============================================
#     # READ OPERATIONS
#     # ============================================
    
#     async def get_all_properties(
#         self,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get all properties with pagination
#         """
#         properties = await self.repository.get_all_properties(
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_total_property_count()
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_property_by_id(self, property_id: int) -> Optional[Dict[str, Any]]:
#         """
#         Get a single property by ID with all relations
#         """
#         property_obj = await self.repository.get_property_with_relations(property_id)
        
#         if not property_obj:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Property with ID {property_id} not found"
#                 )
        
#         # Generate signed URLs for private files if needed
#         if property_obj.documents:
#             for doc in property_obj.documents:
#                 if not doc.is_public:
#                     doc.signed_url = await self.file_service.get_signed_url(
#                         doc.file_url,
#                         expiration=3600
#                     )
        
#         return self._to_response(property_obj)
    
#     async def filter_properties(self, filter_data: Any) -> Dict[str, Any]:
#         """
#         Advanced filter with pagination
#         """
#         properties, total_count = await self.repository.filter_properties(filter_data)
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': filter_data.page or 1,
#                 'limit': filter_data.limit or 20,
#                 'totalPages': (total_count + filter_data.limit - 1) // filter_data.limit if filter_data.limit > 0 else 0
#             }
#         }
    
#     # ============================================
#     # FILTER BY SPECIFIC FIELDS
#     # ============================================
    
#     async def get_properties_by_posted_by(
#         self,
#         posted_by: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by posted_by (single or multiple values)
#         """
#         properties = await self.repository.get_properties_by_posted_by(
#             posted_by=posted_by,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_posted_by(posted_by)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_category(
#         self,
#         property_category: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by property category
#         """
#         properties = await self.repository.get_properties_by_category(
#             property_category=property_category,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_category(property_category)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_property_type(
#         self,
#         property_type: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by property type
#         """
#         properties = await self.repository.get_properties_by_property_type(
#             property_type=property_type,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_property_type(property_type)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }
    
#     async def get_properties_by_purpose(
#         self,
#         listing_purpose: str,
#         skip: int = 0,
#         limit: int = 20
#     ) -> Dict[str, Any]:
#         """
#         Get properties by listing purpose (rent/sell/lease)
#         """
#         properties = await self.repository.get_properties_by_purpose(
#             listing_purpose=listing_purpose,
#             skip=skip,
#             limit=limit
#         )
        
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_purpose(listing_purpose)
        
#         return {
#             'data': formatted_properties,
#             'pagination': {
#                 'total': total_count,
#                 'page': (skip // limit) + 1 if limit > 0 else 1,
#                 'limit': limit,
#                 'totalPages': (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }

    
    
#     # ============================================
#     # UPDATE OPERATIONS
#     # ============================================
    
#     async def update_property(
#         self,
#         property_id: int,
#         update_data: Dict[str, Any],
#         status: Optional[str] = None,
#         images: Optional[List[UploadFile]] = None,
#         video: Optional[UploadFile] = None,
#         documents: Optional[List[UploadFile]] = None,
#         file_metadata: Optional[Dict[str, Any]] = None,
#         user_id: Optional[str] = None
#     ) -> Dict[str, Any]:
#         """
#         Update an existing property and return formatted response
#         """
#         # 1. Check if property exists
#         existing_property = await self.repository.get_property_by_id(property_id)
#         if not existing_property:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and existing_property.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to update this property"
#             )
        
#         try:
#             # 2. Update property data
#             if update_data:
#                 await self.repository.update_property(
#                     property_id=property_id,
#                     update_data=update_data
#                 )
            
#             # 3. Update status if provided
#             if status:
#                 await self.repository.update_property_status(
#                     property_id=property_id,
#                     status=status
#                 )
            
#             # 4. Process new images if provided (replace existing)
#             if images:
#                 # Delete old images
#                 await self.repository.delete_property_media(property_id)
                
#                 upload_results = await self.file_service.upload_images(
#                     images=images,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_media({
#                         'property_id': property_id,
#                         'media_type': 'image',
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'format': result['format'],
#                         'file_url': result['file_url'],
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result['file_size_kb'],
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': result['is_primary'],
#                         'order': result['order']
#                     })
            
#             # 5. Process new video if provided
#             if video:
#                 # Delete old video
#                 await self.repository.delete_property_video(property_id)
                
#                 result = await self.file_service.upload_video(
#                     file=video,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 await self.repository.create_property_media({
#                     'property_id': property_id,
#                     'media_type': 'video',
#                     'file_name': result['file_name'],
#                     'mime_type': result['mime_type'],
#                     'format': result['format'],
#                     'file_url': result['file_url'],
#                     'file_size_kb': result['file_size_kb'],
#                     'is_primary': False,
#                     'order': 0
#                 })
            
#             # 6. Process new documents if provided (append or replace)
#             if documents:
#                 # Option 1: Replace all documents
#                 await self.repository.delete_property_documents(property_id)
                
#                 upload_results = await self.file_service.upload_documents(
#                     documents=documents,
#                     user_id=existing_property.user_id,
#                     property_id=property_id
#                 )
#                 for result in upload_results:
#                     await self.repository.create_property_document({
#                         'property_id': property_id,
#                         'document_type': result.get('document_type', 'other_supporting_document'),
#                         'file_name': result['file_name'],
#                         'mime_type': result['mime_type'],
#                         'file_url': result['file_url'],
#                         'file_size_kb': result.get('file_size_kb'),
#                         'is_public': False
#                     })
            
#             # 7. Return formatted updated property
#             updated_property = await self.repository.get_property_with_relations(property_id)
#             return self._to_response(updated_property)
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to update property: {str(e)}")
    
#     # ============================================
#     # DELETE OPERATIONS
#     # ============================================
    
#     async def delete_property(self, property_id: int, user_id: Optional[str] = None) -> Dict[str, Any]:
#         """
#         Delete a property and all associated files
#         """
#         # 1. Check if property exists
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")

#         if user_id and property_obj.user_id != user_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="Not authorized to delete this property"
#             )
        
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)
            
#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
            
#             # 3. Delete from database
#             await self.repository.delete_property(property_id)
            
#             return {
#                 'success': True,
#                 'message': f'Property with ID {property_id} deleted successfully'
#             }
            
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to delete property: {str(e)}")

#     async def delete_property_admin(self, property_id: int) -> Dict[str, Any]:
#         """
#         Admin delete property
#         """
#         property_obj = await self.repository.get_property_with_relations(property_id)
#         if not property_obj:
#             raise Exception(f"Property with ID {property_id} not found")
#         try:
#             file_paths = []
#             # Delete media files
#             if property_obj.media:
#                 for media in property_obj.media:
#                     if media.file_url:
#                         file_paths.append(media.file_url)
#                     if media.thumbnail_url:
#                         file_paths.append(media.thumbnail_url)

#             # Delete documents
#             if property_obj.documents:
#                 for doc in property_obj.documents:
#                     if doc.file_url:
#                         file_paths.append(doc.file_url)

#             if file_paths:
#                 await self.file_service.delete_files(file_paths)
#             await self.repository.delete_property(property_id)
#             return {
#                 'success': True,
#                 'message': f'Property with ID {property_id} deleted successfully'
#             }
#         except Exception as e:
#             await self.repository.rollback()
#             raise Exception(f"Failed to delete property: {str(e)}")

#     # ============================================
#     # RESPONSE FORMATTING METHODS
#     # ============================================

#     def _to_response(self, property_obj):
#         """
#         Convert property object to camelCase response format
#         """
#         if not property_obj:
#             return None
            
#         response = {
#             # ===== Core =====
#             'id': property_obj.id,
#             'postedAs': property_obj.posted_by.value if property_obj.posted_by else None,
#             'propertyType': property_obj.property_type,
#             'propertyTitle': property_obj.property_title,
#             'propertyAddress': property_obj.address,
#             'city': property_obj.city,
#             'state': property_obj.state,
#             'pincode': property_obj.pin_code,
#             'listingPurpose': property_obj.listing_purpose.value if property_obj.listing_purpose else None,
#             'expectedPrice': property_obj.expected_price,
#             'priceType': None,
#             'availableFrom': property_obj.available_from.isoformat() if property_obj.available_from else None,
            
#             # ===== Specs =====
#             'bedrooms': property_obj.bedrooms,
#             'bathrooms': property_obj.bathrooms,
#             'carpetArea': float(property_obj.carpet_area) if property_obj.carpet_area else None,
#             'builtUpArea': float(property_obj.built_up_area) if property_obj.built_up_area else None,
#             'furnishingStatus': property_obj.furnishing_status,
#             'parking': property_obj.parking,
#             'parkingSpaces': property_obj.parking_capacity,
#             'maintenance': float(property_obj.maintenance_amount) if property_obj.maintenance_amount else None,
            
#             # ===== Amenities =====
#             'amenities': property_obj.amenities if property_obj.amenities else [],
#             'otherAmenities': None,
            
#             # ===== Contact =====
#             'userName': property_obj.user.full_name if property_obj.user else None,
#             'emailId': property_obj.user.email if property_obj.user else None,
#             'contactNumber': property_obj.user.phone_number if property_obj.user else None,
#             'contactPerson': property_obj.user.full_name if property_obj.user else None,
#             'officeAddress': property_obj.address,
            
#             # ===== Additional =====
#             'propertyCategory': property_obj.property_category.value if property_obj.property_category else None,
#             'configuration': property_obj.sub_category,
            
#             # ===== Common Filters =====
#             'hasGarden': property_obj.garden_space,
#             'hasTerrace': property_obj.terrace,
#             'hasSwimmingPool': None,
#             'hasBalcony': property_obj.balcony,
#             'facing': property_obj.facing_direction,
#             'floorNumber': property_obj.floor_number,
#             'totalFloors': property_obj.total_floors,
            
#             # ===== Buy Filters =====
#             'buyingPurpose': None,
#             'homeLoanRequired': property_obj.loan_eligible,
#             'purchaseTimeframe': None,
            
#             # ===== Rent Filters =====
#             'occupancyType': property_obj.tenant_type[0] if property_obj.tenant_type and len(property_obj.tenant_type) > 0 else None,
#             'rentalDuration': property_obj.minimum_rental_duration,
#             'petFriendly': property_obj.pet_friendly,
#             'waterSupply': None,
#             'securityDepositMin': property_obj.security_deposit,
#             'securityDepositMax': property_obj.security_deposit,
            
#             # ===== Sell Filters =====
#             'ownershipType': property_obj.ownership_type,
#             'propertyAge': int(property_obj.property_age) if property_obj.property_age and property_obj.property_age.isdigit() else None,
#             'propertyCondition': property_obj.property_condition,
#             'floorCount': property_obj.total_floors,
#             'isNegotiable': property_obj.price_negotiable,
#             'loanOutstanding': property_obj.loan_outstanding,
            
#             # ===== Lease Filters =====
#             'leaseBudgetMin': float(property_obj.price_min) if property_obj.price_min else None,
#             'leaseBudgetMax': float(property_obj.price_max) if property_obj.price_max else None,
#             'advanceDepositMin': property_obj.security_deposit,
#             'advanceDepositMax': property_obj.security_deposit,
#             'leaseDuration': property_obj.lease_terms,
            
#             # ===== Land/Plot =====
#             'plotSize': property_obj.sub_category,
#             'totalSqft': float(property_obj.built_up_area) if property_obj.built_up_area else None,
#             'sqftPrice': None,
#             'aboutPoster': None,
#             'highlights': property_obj.interior_features if property_obj.interior_features else [],
#             'location': property_obj.area,
            
#             # ===== Status =====
#             'status': property_obj.status or 'Under-Review',
#             'viewCount': 0,
#             'createdAt': property_obj.created_at,
#             'updatedAt': property_obj.updated_at,
            
#             # ===== Media =====
#             'images': self._format_media(property_obj.media) if property_obj.media else [],
#             'documents': self._format_documents(property_obj.documents) if property_obj.documents else [],

            
#             # ===== Type-Specific Details =====

#             'ownerDetails': self._get_owner_details(property_obj),
#             'agentDetails': self._get_agent_details(property_obj),
#             'builderDetails': self._get_builder_details(property_obj),
#             'pmDetails': self._get_property_management_details(property_obj),
#         }

        
#         # Use your existing strip_none_values utility
#         return strip_none_values(response)
    
#     def _format_media(self, media_list):
#        return self.formatter.format_media(media_list)
    
#     def _format_documents(self, document_list):
#        return self.formatter.format_documents(document_list)
    
#     def _get_owner_details(self, property_obj):
#         return self.formatter.format_owner_details(property_obj)
    
#     def _get_agent_details(self, property_obj):
#         return self.formatter.format_agent_details(property_obj)
    
#     def _get_builder_details(self, property_obj):
#         return self.formatter.format_builder_details(property_obj)
    
#     def _get_property_management_details(self, property_obj):
#         return self.formatter.format_property_management_details(property_obj)

#     def extract_number(self,value):
#         """Extract numeric value from string or return 0 if not found."""
#         if value is None or value == "":
#             return 0
#         if isinstance(value, (int, float)):
#             return int(value)
#         if isinstance(value, str):
#             numbers = re.findall(r'\d+', value)
#             return int(numbers[0]) if numbers else 0
#         return 0

    





            


