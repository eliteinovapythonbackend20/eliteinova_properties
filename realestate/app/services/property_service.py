from typing import Optional, List, Dict, Any
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.id_generator import IDGenerator
from app.core.config import settings
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
from app.repositories.document_repository import (
    FileAssetRepository,
    UserDocumentRepository,
    has_live_vendor_document,
    record_vendor_document,
    release_vendor_document,
)
from app.services.property_document_service import PropertyDocumentService
from app.services import user_media_service
from app.services.user_media_service import current_user_media
from app.models.user_media import USER_MEDIA_TYPES

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
        except HTTPException:
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
        except HTTPException:
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
            
        except HTTPException:
            raise
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
            formatted = self._to_card(prop)
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

    MAX_PROPERTY_IMAGES = 3

    async def add_property_image_raw(
        self, property_id: str, file: UploadFile, user_id: str, is_primary: bool, order: int = 0
    ) -> Dict[str, Any]:
        """Faithful move of the single-image-with-caller-controlled-order path
        (distinct from add_property_images, which always appends and never
        sets is_primary)."""
        # The 3-image cap applies to gallery photos only - the cover image
        # has its own dedicated slot and is never counted against it, so a
        # cover upload/replace must never be blocked by a full gallery.
        if not is_primary:
            existing_count = await self.repository.count_property_images(property_id, exclude_primary=True)
            if existing_count >= self.MAX_PROPERTY_IMAGES:
                raise PropertyValidationError(
                    message=f"A property can have at most {self.MAX_PROPERTY_IMAGES} images",
                    errors={"images": f"Maximum {self.MAX_PROPERTY_IMAGES} images allowed per property"},
                )

        # upload_image directly, not upload_images([file]) - the latter always
        # treats a single-item list as idx==0 and forces field_name/quality/
        # filename to "coverImage" regardless of the real is_primary/order
        # passed in here, mislabeling gallery-only uploads as the cover.
        result = await self.file_service.upload_image(
            file=file, user_id=user_id, property_id=property_id,
            field_name='coverImage' if is_primary else 'propertyImages',
            is_primary=is_primary, order=order,
        )

        # Only one image is ever the cover - unset any existing primary
        # before this one claims the slot (mirrors set_cover_image).
        if is_primary:
            await self.repository.unset_primary_images(property_id)

        media_obj = await self._create_property_media({
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
            'order': order
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
        media_obj = await self._create_property_media({
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

    async def _create_property_media(self, media_data: Dict[str, Any]) -> PropertyMedia:
        """Single entry point for every PropertyMedia insert. Gives the row its
        own file_asset (phase 2 foundation), the same way documents already get
        one - but property media is never reused across properties, so this
        always creates/dedupes a fresh asset for this row's own file_url, never
        a reference to another property's or the user's media."""
        file_url = media_data.get('file_url')
        file_asset_id = None
        if file_url:
            asset = await FileAssetRepository(self.repository.db).get_or_create(
                file_url=file_url,
                original_name=media_data.get('file_name'),
                mime_type=media_data.get('mime_type'),
                size_bytes=(media_data.get('file_size_kb') or 0) * 1024 or None,
                visibility="public",
            )
            file_asset_id = asset.id
        return await self.repository.create_property_media({**media_data, 'file_asset_id': file_asset_id})

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
                property_id,
                file_metadata
            )
        
        # Process property documents
        property_documents = separated_files.get('property_documents', [])
        if property_documents:
            # Versioned: an update adds pending versions. Live documents are never deleted here.
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
        """The listing's contact person's photo/logo - a fresh upload for this
        property, never the uploader's own reusable USER_MEDIA (that only
        happens through profile_service, never through a property form).
        Public media, linked to property_id through contact_person_media - a
        second upload for the same field supersedes the first, never deletes it."""
        from app.services import contact_person_media_service

        for field_name, file_obj in vendor_profile_images.items():
            media_type = self.file_service.CONTACT_PERSON_MEDIA_TYPE_BY_FIELD.get(field_name)
            if not media_type:
                continue

            result = await self.file_service.upload_contact_person_media(
                file=file_obj,
                property_id=property_id,
                field_name=field_name,
            )
            await contact_person_media_service.record_upload(
                self.repository.db,
                property_id=property_id,
                media_type=media_type,
                upload_result=result,
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
            
            await self._create_property_media({
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
        
        await self._create_property_media({
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
        property_id: str,
        file_metadata: Optional[Dict[str, Any]] = None
    ):
        """Process documents submitted with a property.

        Identity documents (Aadhaar, PAN, ID, address proof) on a property form belong to
        the contact person for this property, not to the uploader. They are stored as
        PROPERTY_DOCUMENT with subject_type CONTACT_PERSON, under the property's contact
        path, and never touch the uploader's user_documents or profile.
        """
        for idx, doc in enumerate(vendor_documents):
            doc_type = self._get_document_type_from_metadata(file_metadata, idx, 'vendor_document')
            if not doc_type:
                doc_type = 'other_supporting_document'

            # Every user-level document submitted with a property is stored for this
            # property, per submission. None is written to the uploader's user_documents.
            result = await self.file_service.upload_vendor_document(
                file=doc,
                user_id=user_id,
                document_type=doc_type,
                property_id=property_id,
            )
            await PropertyDocumentService(self.repository.db).record_upload(
                property_id=property_id,
                uploader_id=user_id,
                legacy_document_type=doc_type,
                upload_result=result,
                subject_type="CONTACT_PERSON",
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

            await PropertyDocumentService(self.repository.db).record_upload(
                property_id=property_id,
                uploader_id=user_id,
                legacy_document_type=doc_type,
                upload_result=result,
            )
    
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
                'office_address', 'address_line1', 'address_line2', 'agency_name', 'rera_registration_number',
                'gst_number', 'experience', 'active_listing', 'service_area',
                'aadhaar_number',
                'website', 'facebook', 'instagram', 'linkedin', 'youtube',
                'bank_name', 'account_holder_name', 'account_number',
                'ifsc_code', 'upi_id', 'signature', 'signature_date',
                'signature_place', 'declaration_accepted'
            ],
            'BUILDER': [
                'name', 'designation', 'mobile', 'whatsapp_number', 'email',
                'rera_registration_number', 'gst_number', 'experience',
                'aadhaar_number', 'service_area', 'pan_number', 'company_name', 'company_reg_number',
                'company_website', 'company_description', 'office_address',
                'vendor_city', 'vendor_district', 'vendor_state', 'vendor_pincode', 'vendor_landmark',
                'website', 'facebook', 'instagram', 'linkedin', 'youtube',
                'bank_name', 'account_holder_name', 'account_number',
                'ifsc_code', 'upi_id', 'signature', 'signature_date',
                'signature_place', 'declaration_accepted'
            ],
            'PROPERTY_MANAGEMENT': [
                'name', 'designation', 'mobile', 'whatsapp_number', 'email',
                'rera_registration_number', 'gst_number', 'experience',
                'aadhaar_number', 'service_area', 'pan_number', 'company_name', 'company_reg_number',
                'company_website', 'company_description', 'office_address',
                'vendor_city', 'vendor_district', 'vendor_state', 'vendor_pincode', 'vendor_landmark',
                'website', 'facebook', 'instagram', 'linkedin', 'youtube',
                'bank_name', 'account_holder_name', 'account_number',
                'ifsc_code', 'upi_id', 'signature', 'signature_date',
                'signature_place', 'declaration_accepted'
            ]
        }

        # vendor_city/district/state/pincode/landmark are field_mapping_service's
        # collision-safe stand-ins for the office/company address (see
        # FieldMappingService.VENDOR_ADDRESS_TARGET_MAP) - translate back to
        # the real column name here, since update_vendor_detail() setattr's
        # vendor_data's keys directly onto the ORM row.
        fields = field_mappings.get(posted_by, [])
        for field in fields:
            if field in property_data and property_data[field] is not None:
                target_field = FieldMappingService.VENDOR_ADDRESS_TARGET_MAP.get(field, field)
                vendor_data[target_field] = property_data[field]
        
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
        cp = property_obj.contact_person
        display_name = cp.name if cp else None
        org_name = (cp.role_details or {}).get('companyName') if cp and role in ('AGENT', 'BUILDER', 'PROPERTY_MANAGEMENT') else None
        photo = PropertyFormatter._contact_person_media_url(property_obj, 'profile_photo')

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
            'propertyAgeRange': p.property_age_range,
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
            'underConstruction': p.underconstruction,
            'immediatePossession': p.immediate_possession,

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

    async def get_document_view_url(self, document_id: int, current_user: Dict[str, Any]) -> str:
        """Mint a fresh, short-lived signed GET URL for a private property document.

        Authorized for: admin, the document's uploader, or the user who owns the
        property. is_public never grants access. Every issue is audited.
        """
        from app.services.document_access_service import DocumentAccessService

        doc = await self.repository.get_document_by_id(document_id)
        if not doc:
            raise PropertyError(f"Document {document_id} not found", status_code=404)

        property_owner_id = None
        if doc.property_id:
            prop = await self.repository.get_property_by_id(doc.property_id)
            property_owner_id = prop.user_id if prop else None

        access = DocumentAccessService(self.repository.db)
        if not doc.file_url:
            raise PropertyError(f"Document {document_id} has no stored file", status_code=404)
        try:
            return await access.issue_property_document_url(
                requester=current_user, document=doc, property_owner_id=property_owner_id
            )
        except HTTPException as exc:
            if exc.status_code == status.HTTP_403_FORBIDDEN:
                raise PropertyPermissionError("Not authorized to view this document")
            raise

    async def list_property_documents(self, property_id: str, current_user: Dict[str, Any]) -> List[PropertyDocument]:
        """Documents attached to one property. Admin or the property's owner only."""
        prop = await self.repository.get_property_by_id(property_id)
        if not prop:
            raise PropertyError(f"Property {property_id} not found", status_code=404)
        if current_user.get("role") != "admin" and prop.user_id != current_user.get("user_id"):
            raise PropertyPermissionError("Not authorized to view this property's documents")
        return await self._list_property_rows(property_id, subject_type="PROPERTY")

    async def list_contact_documents(self, property_id: str, current_user: Dict[str, Any]) -> List[PropertyDocument]:
        """Contact-person documents submitted with a property. Same access rule as the property's documents."""
        prop = await self.repository.get_property_by_id(property_id)
        if not prop:
            raise PropertyError(f"Property {property_id} not found", status_code=404)
        if current_user.get("role") != "admin" and prop.user_id != current_user.get("user_id"):
            raise PropertyPermissionError("Not authorized to view this property's documents")
        return await self._list_property_rows(property_id, subject_type="CONTACT_PERSON")

    async def _list_property_rows(self, property_id: str, subject_type: str) -> List[PropertyDocument]:
        from sqlalchemy import select
        # Superseded, rejected and removed versions are history, not the listing.
        result = await self.repository.db.execute(
            select(PropertyDocument).where(
                PropertyDocument.property_id == property_id,
                PropertyDocument.subject_type == subject_type,
                PropertyDocument.status.notin_(["superseded", "rejected", "deleted"]),
            ).order_by(PropertyDocument.id)
        )
        return list(result.scalars().all())

    def _format_media(self, media_list):
        return self.formatter.format_media(media_list)
    
    def _format_documents(self, document_list):
        return self.formatter.format_documents(document_list)

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
            
                media = await self._create_property_media({
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

        except HTTPException:
            raise
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

        except HTTPException:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete image: {str(e)}")

        urls_to_delete = [image_to_delete.file_url, image_to_delete.thumbnail_url]
        try:
            await self.file_service.delete_files([u for u in urls_to_delete if u])
        except HTTPException:
            raise
        except Exception as e:
            print(f"Failed to delete old property image from storage: {e}")

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
        
        except HTTPException:
            raise
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
        
            media = await self._create_property_media({
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
        
        except HTTPException:
            raise
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

        except HTTPException:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete video: {str(e)}")

        if video.file_url:
            try:
                await self.file_service.delete_files([video.file_url])
            except HTTPException:
                raise
            except Exception as e:
                print(f"Failed to delete old property video from storage: {e}")

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

                doc_obj = await PropertyDocumentService(self.repository.db).record_upload(
                    property_id=property_id,
                    uploader_id=user_id,
                    legacy_document_type=doc_type,
                    upload_result=result,
                )
                uploaded_docs.append(doc_obj)
        
            await self.repository.commit()
            return uploaded_docs
        
        except HTTPException:
            raise
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

            # Versioned removal: the row and its object are kept for history.
            await PropertyDocumentService(self.repository.db).remove(
                actor={"user_id": user_id, "role": "user"}, row=document
            )
            await self.repository.commit()

        except HTTPException:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete document: {str(e)}")

    async def replace_property_document(
        self,
        property_id: str,
        document_id: int,
        user_id: str,
        file: UploadFile,
    ) -> PropertyDocument:
        """Upload a new version into one document's slot. The live version stays live until verified."""
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()

        document = await self.repository.get_property_document_by_id(document_id)
        if not document or document.property_id != property_id or document.status == "deleted":
            raise PropertyValidationError(
                message=f"Document with ID {document_id} not found",
                errors={"document_id": "Document not found"}
            )

        is_contact = document.subject_type == "CONTACT_PERSON"
        try:
            if is_contact:
                result = await self.file_service.upload_vendor_document(
                    file=file,
                    user_id=user_id,
                    document_type=document.document_type,
                    property_id=property_id,
                )
            else:
                result = await self.file_service.upload_property_document(
                    file=file,
                    user_id=user_id,
                    property_id=property_id,
                    document_type=document.document_type
                )
            row = await PropertyDocumentService(self.repository.db).record_upload(
                property_id=property_id,
                uploader_id=user_id,
                legacy_document_type=document.document_type,
                upload_result=result,
                slot_key=document.slot_key or document.document_key,
                subject_type=document.subject_type,
            )
            await self.repository.commit()
            return row
        except HTTPException:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to replace document: {str(e)}")

    async def reuse_user_document(
        self,
        property_id: str,
        user_id: str,
        user_document_id: int,
        subject_type: str,
    ) -> PropertyDocument:
        """The user chose to attach their own verified document to this property. No new upload."""
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()
        try:
            row = await PropertyDocumentService(self.repository.db).link_existing_user_document(
                property_id=property_id,
                uploader_id=user_id,
                user_document_id=user_document_id,
                subject_type=subject_type,
            )
            await self.repository.commit()
            return row
        except HTTPException:
            await self.repository.rollback()
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to reuse document: {str(e)}")

    async def link_all_verified_user_resources(self, property_id: str, user_id: str) -> Dict[str, Any]:
        """The "this listing is mine" shortcut: link every one of the caller's
        own current verified (or legacy) USER_DOCUMENT and USER_MEDIA items to
        this property in one call, instead of one reuse call per item.

        Still a reference only for each item - nothing is uploaded, nothing is
        copied, and the original USER_DOCUMENT/USER_MEDIA is never touched.
        One item failing (e.g. still pending) does not block the others; it is
        reported back instead."""
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise PropertyNotFoundError(property_id)
        if property_obj.user_id != user_id:
            raise PropertyPermissionError()

        linked_documents, skipped_documents = [], []
        documents = await UserDocumentRepository(self.repository.db).list_current(user_id)
        for doc in documents:
            if doc.status not in ("verified", "legacy"):
                skipped_documents.append({"documentKey": doc.document_key, "reason": f"status is {doc.status}"})
                continue
            try:
                row = await PropertyDocumentService(self.repository.db).link_existing_user_document(
                    property_id=property_id, uploader_id=user_id,
                    user_document_id=doc.id, subject_type="CONTACT_PERSON",
                )
                linked_documents.append({"id": row.id, "documentKey": row.document_key})
            except HTTPException as e:
                skipped_documents.append({"documentKey": doc.document_key, "reason": e.detail})

        linked_media, skipped_media = [], []
        for media_type in USER_MEDIA_TYPES:
            media = await current_user_media(self.repository.db, user_id, media_type)
            if media is None:
                continue
            if media.status not in ("verified", "legacy"):
                skipped_media.append({"mediaType": media_type, "reason": f"status is {media.status}"})
                continue
            try:
                ref = await user_media_service.reference_for_property(
                    self.repository.db, property_id=property_id, actor_id=user_id,
                    user_media_id=media.id, purpose=media_type,
                )
                linked_media.append({"referenceId": ref.id, "mediaType": media_type})
            except HTTPException as e:
                skipped_media.append({"mediaType": media_type, "reason": e.detail})

        try:
            await self.repository.commit()
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to link verified resources: {str(e)}")

        return {
            "linkedDocuments": linked_documents, "skippedDocuments": skipped_documents,
            "linkedMedia": linked_media, "skippedMedia": skipped_media,
        }

    # Vendor poster-photo/logo has no standalone edit/delete service method - it
    # is only created through the property-posting form
    # (_process_vendor_profile_images / contact_person_media_service), which is
    # also how it is replaced (a new upload supersedes the current one, kept,
    # never deleted).

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

            # A live (verified) version is never overwritten here. The new file is
            # recorded as a pending version; the profile row is updated only when
            # an admin verifies it (see sync_legacy_vendor_row).
            live = await has_live_vendor_document(
                self.repository.db, user_id=user_id, legacy_document_type=document_type
            )
            if live:
                doc_obj = await self.repository.get_vendor_document(user_id, document_type)
                if doc_obj is None:
                    doc_obj = await self.repository.upsert_vendor_document(
                        user_id=user_id, document_type=document_type, doc_data=doc_data
                    )
            else:
                doc_obj = await self.repository.upsert_vendor_document(
                    user_id=user_id,
                    document_type=document_type,
                    doc_data=doc_data
                )

            # Phase 1: also record the version in user_documents, and link the
            # legacy row to its file asset and canonical key.
            record = await record_vendor_document(
                self.repository.db,
                user_id=user_id,
                legacy_document_type=document_type,
                file_url=result.get('file_url'),
                file_name=result.get('file_name'),
                mime_type=result.get('mime_type'),
                file_size_kb=result.get('file_size_kb'),
                legacy_source='property_documents',
                legacy_ref=str(doc_obj.id),
            )
            if record and not live:
                doc_obj.file_asset_id = record.file_asset_id
                doc_obj.document_key = record.document_key
                doc_obj.version = record.version
                doc_obj.status = 'pending'
                doc_obj.is_current = True

            await self.repository.commit()
            return doc_obj
        
        except HTTPException:
            raise
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
        
            file_url = document.file_url
            await release_vendor_document(self.repository.db, user_id=user_id, legacy_document_type=document_type)
            await self.repository.delete_vendor_document(user_id, document_type)
            await self.repository.commit()

            # The object stays while any user_documents version still points at it.
            if file_url and not await FileAssetRepository(self.repository.db).is_referenced(file_url):
                await self.file_service.delete_files([file_url])
                await FileAssetRepository(self.repository.db).mark_deleted(file_url)
                await self.repository.commit()
        
        except HTTPException:
            raise
        except Exception as e:
            await self.repository.rollback()
            raise PropertyFileUploadError(f"Failed to delete vendor document: {str(e)}")

    async def get_vendor_documents(
        self,
        user_id: str
    ) -> List[PropertyDocument]:
        """Get all vendor documents"""
        return await self.repository.get_vendor_documents(user_id)

        raise ValueError(f"Unsupported category: {category}")