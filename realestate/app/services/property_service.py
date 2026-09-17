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
from app.models.property_document import PropertyDocument
from app.models.property_media import PropertyMedia

class PropertyService:
    def __init__(
        self,
        repository: PropertyRepository,
        file_service: Optional[FileService] = None,
        field_mapping_service: Optional[FieldMappingService] = None,
        file_extraction_service: Optional[FileExtractionService] = None
    ):
        self.repository = repository
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

    async def get_property_raw(self, property_id: str) -> Optional[BaseProperty]:
        """Light fetch, no relations, no formatting - for ownership checks."""
        return await self.repository.get_property_by_id(property_id)

    async def get_property_with_relations_raw(self, property_id: str) -> Optional[BaseProperty]:
        """Full fetch, no formatting - the caller owns formatting via its own service."""
        return await self.repository.get_property_with_relations(property_id)

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

    async def get_properties_by_user_and_role(
        self,
        user_id: str,
        posted_by: PostedBy,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None
    ) -> tuple:
        """Raw fetch of one user's properties for one vendor role. No response
        formatting - the caller (a controller composing this with another
        service's formatter) owns that."""
        properties = await self.repository.get_properties_by_user_and_role(
            user_id=user_id, posted_by=posted_by, skip=skip, limit=limit, status=status
        )
        total_count = await self.repository.get_count_by_user_and_role(user_id, posted_by, status=status)
        return properties, total_count

    async def search_user_properties(
        self,
        user_id: str,
        posted_by: PostedBy,
        keyword: Optional[str],
        skip: int = 0,
        limit: int = 20
    ) -> tuple:
        """Raw fetch, same no-formatting contract as get_properties_by_user_and_role."""
        return await self.repository.search_user_properties(
            user_id=user_id, posted_by=posted_by, keyword=keyword, skip=skip, limit=limit
        )

    async def update_property_status(self, property_id: str, new_status: str) -> BaseProperty:
        prop = await self.repository.update_property_status(property_id, new_status)
        if not prop:
            raise PropertyNotFoundError(property_id)
        await self.repository.commit()
        return prop

    async def add_property_image_raw(
        self, property_id: str, file: UploadFile, user_id: str, is_primary: bool
    ) -> Dict[str, Any]:
        """Faithful move of the single-image-with-caller-controlled-order path
        (distinct from add_property_images, which always appends and never
        sets is_primary)."""
        upload_results = await self.file_service.upload_images(
            images=[file], user_id=user_id, property_id=property_id, field_name="propertyImages"
        )
        result = upload_results[0] if upload_results else {}
        media_obj = await self.repository.create_property_media({
            'property_id': property_id,
            'media_type': 'image',
            'file_name': result.get('stored_filename') or result.get('file_name') or file.filename,
            'mime_type': result.get('mime_type') or file.content_type,
            'filename_mapper': result.get('filename_mapper'),
            'format': result.get('format') or 'webp',
            'file_url': result.get('file_url'),
            'thumbnail_url': result.get('thumbnail_url'),
            'file_size_kb': result.get('file_size_kb') or 0,
            'width': result.get('width'),
            'height': result.get('height'),
            'is_primary': is_primary,
            'order': 0
        })
        await self.repository.commit()
        return {
            'id': media_obj.id,
            'file_url': media_obj.file_url,
            'thumbnail_url': media_obj.thumbnail_url,
            'file_name': media_obj.file_name,
            'file_size_kb': media_obj.file_size_kb,
            'is_primary': media_obj.is_primary,
            'media_type': media_obj.media_type,
            'field': 'propertyImages',
            'width': result.get('width'),
            'height': result.get('height'),
        }

    async def add_property_video_raw(self, property_id: str, file: UploadFile, user_id: str) -> Dict[str, Any]:
        """Faithful move - unlike add_property_video, does not delete an
        existing video first (matches the vendor upload route's prior
        behavior exactly; not fixing that gap as part of this refactor)."""
        result = await self.file_service.upload_video(file=file, user_id=user_id, property_id=property_id)
        media_obj = await self.repository.create_property_media({
            'property_id': property_id,
            'media_type': 'video',
            'file_name': result.get('stored_filename') or result.get('file_name') or file.filename,
            'mime_type': result.get('mime_type') or file.content_type,
            'filename_mapper': result.get('filename_mapper'),
            'format': result.get('format') or 'webp',
            'file_url': result.get('file_url'),
            'thumbnail_url': result.get('thumbnail_url'),
            'file_size_kb': result.get('file_size_kb') or 0,
            'width': result.get('width'),
            'height': result.get('height'),
            'is_primary': False,
            'order': 0
        })
        await self.repository.commit()
        return {
            'id': media_obj.id,
            'file_url': media_obj.file_url,
            'thumbnail_url': media_obj.thumbnail_url,
            'file_name': media_obj.file_name,
            'file_size_kb': media_obj.file_size_kb,
            'is_primary': media_obj.is_primary,
            'media_type': media_obj.media_type,
            'field': 'video',
            'width': result.get('width'),
            'height': result.get('height'),
        }

    async def delete_property_image_by_order(self, property_id: str, image_index: int) -> bool:
        """Faithful move of repository.delete_property_image_by_order's contract."""
        deleted = await self.repository.delete_property_image_by_order(property_id, image_index)
        await self.repository.commit()
        return deleted

    async def set_property_cover_raw(self, property_id: str, media_id: int) -> Optional[PropertyMedia]:
        """Faithful move - returns the raw PropertyMedia or None; the caller
        decides whether None means 404 (distinct from set_cover_image, which
        raises PropertyValidationError and does its own ownership check)."""
        media = await self.repository.set_cover_image(property_id, media_id)
        await self.repository.commit()
        return media

    async def delete_property_video_raw(self, property_id: str) -> None:
        await self.repository.delete_property_video(property_id)
        await self.repository.commit()

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

            await self.repository.commit()
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
        
            # Delete from database first, then best-effort clean up storage -
            # the reverse order left a DB row pointing at an already-deleted
            # file if the DB delete/commit raised after storage succeeded.
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

        urls_to_delete = [image_to_delete.file_url, image_to_delete.thumbnail_url]
        try:
            await self.file_service.delete_files([u for u in urls_to_delete if u])
        except Exception as e:
            print(f"⚠️ Failed to delete old property image from storage: {e}")

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
        
            await self.repository.delete_property_media_by_id(video.id)
            await self.repository.commit()

        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete video: {str(e)}")

        if video.file_url:
            try:
                await self.file_service.delete_files([video.file_url])
            except Exception as e:
                print(f"⚠️ Failed to delete old property video from storage: {e}")

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
        
            await self.repository.delete_property_document_by_id(document_id)
            await self.repository.commit()

        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete document: {str(e)}")

        if document.file_url:
            try:
                await self.file_service.delete_files([document.file_url])
            except Exception as e:
                print(f"⚠️ Failed to delete old property document from storage: {e}")

    # ============================================
    # VENDOR PROFILE IMAGE MANAGEMENT
    # ============================================

    async def update_vendor_profile_image(
        self,
        user_id: str,
        property_id: str,
        image: UploadFile,
        field_name: str
    ) -> Dict[str, Any]:
        """Update the poster-photo for one specific listing. Scoped by
        property_id - a vendor with multiple listings can have a different
        photo per listing (e.g. a PM company's different on-site managers)."""
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()

        try:
            result = await self.file_service.upload_vendor_profile_image(
                file=image,
                user_id=user_id,
                field_name=field_name
            )

            from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
            db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)

            if db_column:
                await self.repository.update_vendor_profile_image(
                    user_id=user_id,
                    db_column=db_column,
                    image_url=result['file_url'],
                    property_id=property_id,
                )
                await self.repository.update_vendor_detail(
                    user_id=user_id,
                    posted_by=property_obj.posted_by,
                    property_id=property_id,
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
        property_id: str,
        field_name: str
    ) -> None:
        """Delete this one listing's poster-photo - see update_vendor_profile_image."""
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()

        try:
            from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
            db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)

            if db_column:
                vendor_detail = await self.repository.get_vendor_detail_for_property(
                    property_id, property_obj.posted_by, user_id
                )
                current_url = getattr(vendor_detail, db_column, None) if vendor_detail else None

                if current_url:
                    await self.file_service.delete_files([current_url])

                    await self.repository.update_vendor_profile_image(
                        user_id=user_id,
                        db_column=db_column,
                        image_url=None,
                        property_id=property_id,
                    )
                    await self.repository.update_vendor_detail(
                        user_id=user_id,
                        posted_by=property_obj.posted_by,
                        property_id=property_id,
                        update_data={db_column: None}
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

    # ============================================
    # VENDOR DOCUMENT MANAGEMENT - faithful moves of the vendor_type-scoped
    # single-document routes (profile_controller.py's /{vendor_type}/documents/{doc_type}).
    # Distinct from upload_vendor_document/delete_vendor_document/get_vendor_documents
    # above (which use a different file_service method, different status
    # codes, and no singular get-by-type) - kept separate rather than reused
    # to avoid a silent behavior change.
    # ============================================

    async def upload_vendor_document_raw(self, user_id: str, doc_type: str, file: UploadFile) -> PropertyDocument:
        upload_result = await self.file_service.upload_document(
            file=file, user_id=user_id, property_id="profile", idx=0,
        )
        doc_data = {
            "file_name": upload_result.get("stored_filename") or file.filename,
            "mime_type": upload_result.get("mime_type") or file.content_type,
            "file_url": upload_result.get("file_url"),
            "file_size_kb": upload_result.get("file_size_kb") or 0,
            "is_public": False,
        }
        doc_obj = await self.repository.upsert_vendor_document(user_id, doc_type, doc_data)
        await self.repository.commit()
        return doc_obj

    async def get_vendor_document_raw(self, user_id: str, doc_type: str) -> Optional[PropertyDocument]:
        return await self.repository.get_vendor_document(user_id, doc_type)

    async def delete_vendor_document_raw(self, user_id: str, doc_type: str) -> bool:
        doc_obj = await self.repository.get_vendor_document(user_id, doc_type)
        if not doc_obj:
            return False

        old_url = doc_obj.file_url
        deleted = await self.repository.delete_vendor_document(user_id, doc_type)
        await self.repository.commit()

        if deleted and old_url:
            try:
                await self.file_service.delete_files([old_url])
            except Exception as e:
                print(f"⚠️ Failed to delete vendor document from storage: {e}")

        return deleted

    async def get_latest_vendor_detail_raw(self, user_id: str, posted_by: PostedBy):
        return await self.repository.get_latest_vendor_detail(user_id, posted_by)

    async def attach_uploaded_file_raw(
        self,
        property_id: str,
        user_id: str,
        field: str,
        category: str,
        is_primary: bool,
        upload_result: Dict[str, Any],
        file: UploadFile,
    ) -> Dict[str, Any]:
        """Faithful move of the DB-write half of the deleted
        ProfileService.upload_single_file (the property_id-present branch) -
        creates PropertyMedia for images/video or PropertyDocument for
        documents from an already-uploaded file's metadata."""
        if category in ('images', 'video'):
            media_type = 'image' if category == 'images' else 'video'
            media_obj = await self.repository.create_property_media({
                'property_id': property_id,
                'media_type': media_type,
                'file_name': upload_result.get('stored_filename') or upload_result.get('file_name') or file.filename,
                'mime_type': upload_result.get('mime_type') or file.content_type,
                'filename_mapper': upload_result.get('filename_mapper'),
                'format': upload_result.get('format') or 'webp',
                'file_url': upload_result.get('file_url'),
                'thumbnail_url': upload_result.get('thumbnail_url'),
                'file_size_kb': upload_result.get('file_size_kb') or 0,
                'width': upload_result.get('width'),
                'height': upload_result.get('height'),
                'is_primary': is_primary,
                'order': 0
            })
            await self.repository.commit()
            return {
                'id': media_obj.id,
                'file_url': media_obj.file_url,
                'thumbnail_url': media_obj.thumbnail_url,
                'file_name': media_obj.file_name,
                'file_size_kb': media_obj.file_size_kb,
                'is_primary': media_obj.is_primary,
                'media_type': media_obj.media_type,
                'field': field,
                'width': upload_result.get('width'),
                'height': upload_result.get('height'),
            }

        if category == 'documents':
            doc_type = getattr(file, 'doc_type', 'other_supporting_document')
            doc_obj = await self.repository.create_property_document({
                'property_id': property_id,
                'user_id': user_id,
                'document_type': doc_type,
                'file_name': upload_result.get('stored_filename') or upload_result.get('file_name') or file.filename,
                'mime_type': upload_result.get('mime_type') or file.content_type,
                'file_url': upload_result.get('file_url'),
                'file_size_kb': upload_result.get('file_size_kb') or 0,
                'is_public': False
            })
            await self.repository.commit()
            return {
                'id': doc_obj.id,
                'file_url': doc_obj.file_url,
                'file_name': doc_obj.file_name,
                'document_type': doc_obj.document_type,
                'file_size_kb': doc_obj.file_size_kb,
                'field': field,
                'is_public': doc_obj.is_public
            }

        raise ValueError(f"Unsupported category: {category}")