import uuid
from typing import Optional, List, Dict, Any
from fastapi import UploadFile, HTTPException, status
from app.core.storage_factory import StorageFactory
from app.core.file_processor import FileProcessor
from app.core.config import settings


class FileService:

    # Mirrors the limits already enforced client-side in the posting/profile
    # forms (e.g. OwnerProfile.jsx, SellPMLPForm.jsx: 2MB images, 10MB video,
    # 5MB PDFs) - re-checked here so a direct API call can't bypass them.
    _MAX_SIZE_BYTES = {
        'image': 2 * 1024 * 1024,
        'video': 10 * 1024 * 1024,
        'document': 5 * 1024 * 1024,
    }
    _ALLOWED_CONTENT_TYPES = {
        'image': {'image/jpeg', 'image/jpg', 'image/png', 'image/webp'},
        'video': {'video/mp4', 'video/quicktime', 'video/mov', 'video/webm', 'video/x-matroska'},
    }

    def __init__(self):
        self.storage = StorageFactory.get_storage()
        self.file_processor = FileProcessor()

    async def _validate_upload(self, file: UploadFile, category: str) -> None:
        """Server-side type/size check. Must run before any compression/
        storage call - callers place it before their try/except so a
        rejection here is never mistaken for a processing failure and
        silently re-uploaded as a fallback (see upload_video)."""
        content = await file.read()
        file.file.seek(0)

        max_size = self._MAX_SIZE_BYTES[category]
        if len(content) > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{file.filename}: file exceeds the {max_size // (1024 * 1024)}MB limit for {category}s.",
            )

        content_type = (file.content_type or '').lower()
        if category == 'document':
            is_pdf = content_type == 'application/pdf' or (file.filename or '').lower().endswith('.pdf')
            if not is_pdf:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{file.filename}: only PDF files are accepted for documents.",
                )
        else:
            allowed = self._ALLOWED_CONTENT_TYPES.get(category)
            if allowed and content_type not in allowed:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{file.filename}: unsupported {category} type '{content_type}'.",
                )


    def _get_document_type(self, filename: str) -> str:
        """Fallback: Detect document type from filename"""
        doc_mapping = {
            # Property documents
            'aadhaar': 'aadhaar_card',
            'pan': 'pan_card',
            'passport': 'passport_photo',
            'patta': 'patta_chitta',
            'sale': 'sale_deed',
            'rental': 'rental_agreement',
            'tax': 'property_tax_receipt',
            'encumbrance': 'encumbrance_certificate',
            'occupancy': 'occupancy_certificate',
            'completion': 'completion_certificate',
            'building': 'building_approval_plan',
            'floor': 'floor_plan',
            'supporting': 'other_supporting_document',
            
            # Agency/Company documents
            'agency': 'agency_logo',
            'gst': 'gst_certificate',
            'business': 'business_registration_certificate',
            'rera': 'rera_certificate',
            'lease': 'lease_agreement',
            'trade': 'trade_license',
            'fire': 'fire_safety_certificate',
            'company': 'company_logo',
            'brochure': 'company_profile_brochure',
            'profile_brochure': 'company_profile_brochure',
            'company_pan': 'company_pan_card',
            'registration': 'company_registration_certificate',
            'address_proof': 'company_address_proof',
            'project': 'project_brochure',
            'authorized': 'authorized_signatory_id_proof',
            'signatory': 'authorized_signatory_id_proof',
        }
        
        filename_lower = filename.lower()
        for key, doc_type in doc_mapping.items():
            if key in filename_lower:
                return doc_type
        return 'other_supporting_document'
    
    def _get_storage_path(
        self,
        user_id: str,
        property_id: str,
        file_type: str,
        filename: str
    ) -> str:
        return f"{user_id}/{property_id}/{file_type}/{filename}"
    
    def _get_vendor_storage_path(
        self,
        user_id: str,
        file_type: str,
        filename: str
    ) -> str:
        return f"vendor/{user_id}/{file_type}/{filename}"
    
    def _generate_image_filename(
        self,
        field_name: str,
        is_primary: bool = False,
        order: int = 0
    ) -> str:
        unique_id = str(uuid.uuid4())[:8]
        
        type_mapping = {
            'coverImage': 'cover',
            'propertyImages': 'property',
            'passportPhoto': 'profile',
            'profilePhoto': 'profile',
            'agencyLogo': 'agency',
            'companyLogo': 'company',
        }
        
        image_type = type_mapping.get(field_name, 'image')
        
        single_image_types = ['coverImage', 'passportPhoto', 'agencyLogo', 'companyLogo', 'profilePhoto']
        if is_primary or field_name in single_image_types:
            suffix = "primary"
        else:
            suffix = f"{order:02d}"
        
        return f"{image_type}_{suffix}_{unique_id}.webp"
    
    def _generate_video_filename(self, original_filename: str) -> str:
        """Generate video filename with UUID"""
        unique_id = str(uuid.uuid4())[:8]
        return f"video_{unique_id}.mp4"
    
    def _generate_document_filename(
        self,
        doc_type: str,
        idx: int = 0
    ) -> str:
        """Generate document filename with type and index"""
        unique_id = str(uuid.uuid4())[:8]
        return f"{doc_type}_{idx:02d}_{unique_id}.pdf"
    
    
    async def upload_vendor_profile_image(
        self,
        file: UploadFile,
        user_id: str,
        field_name: str
    ) -> Dict[str, Any]:
        image_type_mapping = {
            'profilePhoto': 'profile',
            'passportPhoto': 'profile',
            'agencyLogo': 'agency',
            'companyLogo': 'company',
        }
        
        image_type = image_type_mapping.get(field_name, 'profile')

        unique_id = str(uuid.uuid4())[:8]
        filename = f"{image_type}_{unique_id}.webp"

        file_path = self._get_vendor_storage_path(
            user_id=user_id,
            file_type='profile_images',
            filename=filename
        )

        await self._validate_upload(file, 'image')

        try:
            compressed_file, compression_metadata = await self.file_processor.compress_image(
                file,
                quality=85
            )
            
            stored_path = await self.storage.upload_file(
                file=compressed_file,
                destination_path=file_path,
                cache_control='public, max-age=31536000, immutable',
                storage_class='STANDARD',
                content_type='image/webp'
            )
            
            return {
                'file_url': stored_path,
                'file_name': file.filename,
                'stored_filename': filename,
                'filename_mapper': field_name,
                'mime_type': 'image/webp',
                'format': 'webp',
                'file_size_kb': compression_metadata.get('compressed_size_kb', 0),
                'width': compression_metadata.get('width'),
                'height': compression_metadata.get('height'),
                'image_type': image_type,
                'field_name': field_name,
                'is_compressed': True
            }
            
        except Exception as e:
            print(f"Vendor profile image upload failed for {file.filename}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload vendor profile image: {str(e)}"
            )
    
    async def upload_vendor_document(
        self,
        file: UploadFile,
        user_id: str,
        document_type: str
    ) -> Dict[str, Any]:
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{document_type}_{unique_id}.pdf"
        
        file_path = self._get_vendor_storage_path(
            user_id=user_id,
            file_type='documents',
            filename=filename
        )

        await self._validate_upload(file, 'document')

        try:
            file_extension = file.filename.split('.')[-1].lower()

            if file_extension == 'pdf':
                compressed_file, compression_metadata = await self.file_processor.compress_pdf(
                    file=file,
                    quality='medium'
                )

                stored_path = await self.storage.upload_file(
                    file=compressed_file,
                    destination_path=file_path,
                    cache_control='public, max-age=86400, stale-while-revalidate=3600',
                    storage_class='NEARLINE',
                    content_type='application/pdf'
                )

                return {
                    'file_url': stored_path,
                    'file_name': file.filename,
                    'stored_filename': filename,
                    'mime_type': 'application/pdf',
                    'file_size_kb': compression_metadata.get('compressed_size_kb', 0),
                    'document_type': document_type,
                }
            else:
                stored_path = await self.storage.upload_file(
                    file=file,
                    destination_path=file_path,
                    cache_control='public, max-age=86400, stale-while-revalidate=3600',
                    storage_class='NEARLINE'
                )
                
                content = await file.read()
                file_size_kb = len(content) // 1024
                file.file.seek(0)
                
                return {
                    'file_url': stored_path,
                    'file_name': file.filename,
                    'stored_filename': filename,
                    'mime_type': file.content_type,
                    'file_size_kb': file_size_kb,
                    'document_type': document_type,
                }
            
        except Exception as e:
            print(f"Vendor document upload failed for {file.filename}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload vendor document: {str(e)}"
            )
    
    
    async def upload_property_image(
        self,
        file: UploadFile,
        user_id: str,
        property_id: str,
        is_primary: bool = False,
        order: int = 0
    ) -> Dict[str, Any]:
        field_name = 'coverImage' if is_primary else 'propertyImages'
        # property_id_int = int(property_id) if isinstance(property_id, str) else property_id
        
        return await self.upload_image(
            file=file,
            user_id=user_id,
            property_id=property_id,
            field_name=field_name,
            is_primary=is_primary,
            order=order
        )
    
    async def upload_property_document(
        self,
        file: UploadFile,
        user_id: str,
        property_id: str,
        document_type: str
    ) -> Dict[str, Any]:
        # property_id_int = int(property_id) if isinstance(property_id, str) else property_id
        
        if not hasattr(file, 'doc_type'):
            setattr(file, 'doc_type', document_type)
        
        result = await self.upload_document(
            file=file,
            user_id=user_id,
            property_id=property_id,
            idx=0
        )
        
        result['document_type'] = document_type
        return result
    
    
    async def upload_image(
        self,
        file: UploadFile,
        user_id: str,
        property_id: str,
        field_name: str,
        is_primary: bool = False,
        order: int = 0
    ) -> Dict[str, Any]:
        quality_map = {
            'coverImage': 85,
            'propertyImages': 80,
            'passportPhoto': 85,
            'profilePhoto': 85,
            'agencyLogo': 85,
            'companyLogo': 85,
        }
        quality = quality_map.get(field_name, 80)

        await self._validate_upload(file, 'image')

        try:
            compressed_file, compression_metadata = await self.file_processor.compress_image(
                file,
                quality=quality
            )

            filename = self._generate_image_filename(
                field_name=field_name,
                is_primary=is_primary,
                order=order
            )
            
            file_path = self._get_storage_path(
                user_id=user_id,
                property_id=property_id,
                file_type='images',
                filename=filename
            )
            
            stored_path = await self.storage.upload_file(
                file=compressed_file,
                destination_path=file_path,
                cache_control='public, max-age=31536000, immutable',
                storage_class='STANDARD',
                content_type='image/webp'
            )
            
            image_type = field_name.lower().replace('images', '').replace('image', '') or 'image'
            
            return {
                'file_url': stored_path,
                'file_name': file.filename,
                'stored_filename': filename,
                'filename_mapper': field_name,
                'mime_type': 'image/webp',
                'format': 'webp',
                'file_size_kb': compression_metadata.get('compressed_size_kb', 0),
                'original_size_kb': compression_metadata.get('original_size_kb', 0),
                'compression_ratio': compression_metadata.get('compression_ratio', 0),
                'width': compression_metadata.get('width'),
                'height': compression_metadata.get('height'),
                'field_name': field_name,
                'image_type': image_type,
                'is_primary': is_primary,
                'order': order,
                'is_compressed': True
            }
            
        except Exception as e:
            print(f"Image upload failed for {file.filename}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload image: {str(e)}"
            )
    
    async def upload_images(
        self,
        images: List[UploadFile],
        user_id: str,
        property_id: str,
        field_name: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        results = []
        
        if field_name is None and images:
            field_name = getattr(images[0], 'field_name', None)
        
        if field_name is None:
            field_name = 'propertyImages'
        
        print(f"📸 Uploading {len(images)} images with field_name: {field_name}")
        
        # Single image types (passportPhoto, agencyLogo, companyLogo)
        if field_name in ['passportPhoto', 'agencyLogo', 'companyLogo']:
            for idx, image in enumerate(images):
                actual_field = getattr(image, 'field_name', field_name)
                result = await self.upload_image(
                    file=image,
                    user_id=user_id,
                    property_id=property_id,
                    field_name=actual_field,
                    is_primary=True,
                    order=idx
                )
                results.append(result)
            return results
        
        # Property images - first is cover, rest are property images
        if field_name == 'propertyImages':
            for idx, image in enumerate(images):
                is_primary = (idx == 0)
                current_field = 'coverImage' if is_primary else 'propertyImages'
                result = await self.upload_image(
                    file=image,
                    user_id=user_id,
                    property_id=property_id,
                    field_name=current_field,
                    is_primary=is_primary,
                    order=idx
                )
                results.append(result)
            return results
        
        # Default: Treat all as the same type
        for idx, image in enumerate(images):
            actual_field = getattr(image, 'field_name', field_name)
            result = await self.upload_image(
                file=image,
                user_id=user_id,
                property_id=property_id,
                field_name=actual_field,
                is_primary=(idx == 0),
                order=idx
            )
            results.append(result)
        
        return results
    
    async def upload_video(
        self,
        file: UploadFile,
        user_id: str,
        property_id: str
    ) -> Dict[str, Any]:
        # Outside the try/except below on purpose - that block has a
        # silent "upload the original file anyway" fallback on ANY
        # exception, which would otherwise swallow this rejection too.
        await self._validate_upload(file, 'video')

        try:
            compressed_file, compression_metadata = await self.file_processor.compress_video(
                file=file,
                target_height=720,
                bitrate='1M'
            )
            
            filename = self._generate_video_filename(file.filename)
            
            file_path = self._get_storage_path(
                user_id=user_id,
                property_id=property_id,
                file_type='videos',
                filename=filename
            )
            
            stored_path = await self.storage.upload_file(
                file=compressed_file,
                destination_path=file_path,
                cache_control='public, max-age=604800, stale-while-revalidate=86400',
                storage_class='STANDARD',
                content_type='video/mp4'
            )
            
            return {
                'file_url': stored_path,
                'file_name': file.filename,
                'stored_filename': filename,
                'filename_mapper': 'video',
                'mime_type': 'video/mp4',
                'format': 'mp4',
                'file_size_kb': compression_metadata.get('compressed_size_kb', 0),
                'original_size_kb': compression_metadata.get('original_size_kb', 0),
                'compression_ratio': compression_metadata.get('compression_ratio', 0),
                'duration': compression_metadata.get('duration', 0),
                'resolution': compression_metadata.get('resolution', ''),
                'is_compressed': True
            }
            
        except Exception as e:
            print(f"Video upload failed for {file.filename}: {str(e)}")
            # Fallback: Upload without compression
            try:
                content = await file.read()
                file_size_kb = len(content) // 1024
                
                filename = self._generate_video_filename(file.filename)
                file_path = self._get_storage_path(
                    user_id=user_id,
                    property_id=property_id,
                    file_type='videos',
                    filename=filename
                )
                
                file.file.seek(0)
                
                stored_path = await self.storage.upload_file(
                    file=file,
                    destination_path=file_path,
                    cache_control='public, max-age=604800, stale-while-revalidate=86400',
                    storage_class='STANDARD'
                )
                
                return {
                    'file_url': stored_path,
                    'file_name': file.filename,
                    'stored_filename': filename,
                    'mime_type': file.content_type,
                    'format': filename.split('.')[-1],
                    'file_size_kb': file_size_kb,
                    'is_compressed': False,
                    'error': str(e)
                }
            except Exception as fallback_error:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to upload video: {str(fallback_error)}"
                )
    
    async def upload_document(
        self,
        file: UploadFile,
        user_id: str,
        property_id: str,
        idx: int = 0
    ) -> Dict[str, Any]:
        await self._validate_upload(file, 'document')

        try:
            doc_type = getattr(file, 'doc_type', None)
            
            if not doc_type:
                doc_type = self._get_document_type(file.filename)
            
            file_extension = file.filename.split('.')[-1].lower()
            
            if file_extension == 'pdf':
                compressed_file, compression_metadata = await self.file_processor.compress_pdf(
                    file=file,
                    quality='medium'
                )
                
                filename = self._generate_document_filename(
                    doc_type=doc_type,
                    idx=idx
                )
                
                file_path = self._get_storage_path(
                    user_id=user_id,
                    property_id=property_id,
                    file_type='documents',
                    filename=filename
                )
                
                stored_path = await self.storage.upload_file(
                    file=compressed_file,
                    destination_path=file_path,
                    cache_control='public, max-age=86400, stale-while-revalidate=3600',
                    storage_class='NEARLINE',
                    content_type='application/pdf'
                )
                
                return {
                    'file_url': stored_path,
                    'file_name': file.filename,
                    'stored_filename': filename,
                    'mime_type': 'application/pdf',
                    'file_size_kb': compression_metadata.get('compressed_size_kb', 0),
                    'document_type': doc_type,
                }
            
            else:
                content = await file.read()
                file_size_kb = len(content) // 1024
                
                file.file.seek(0)
                
                filename = self._generate_document_filename(
                    doc_type=doc_type,
                    idx=idx
                )
                
                file_path = self._get_storage_path(
                    user_id=user_id,
                    property_id=property_id,
                    file_type='documents',
                    filename=filename
                )
                
                stored_path = await self.storage.upload_file(
                    file=file,
                    destination_path=file_path,
                    cache_control='public, max-age=86400, stale-while-revalidate=3600',
                    storage_class='NEARLINE'
                )
                
                return {
                    'file_url': stored_path,
                    'file_name': file.filename,
                    'stored_filename': filename,
                    'mime_type': file.content_type,
                    'file_size_kb': file_size_kb,
                    'document_type': doc_type,
                }
            
        except Exception as e:
            print(f"Document upload failed for {file.filename}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload document: {str(e)}"
            )
    
    async def upload_documents(
        self,
        documents: List[UploadFile],
        user_id: str,
        property_id: str,
    ) -> List[Dict[str, Any]]:
        results = []
        for idx, doc in enumerate(documents):
            result = await self.upload_document(
                file=doc,
                user_id=user_id,
                property_id=property_id,
                idx=idx
            )
            results.append(result)
        return results
    
    
    async def delete_files(self, file_paths: List[str]) -> None:
        for file_path in file_paths:
            try:
                await self.storage.delete_file(file_path)
                print(f"Deleted file: {file_path}")
            except Exception as e:
                print(f"Failed to delete file {file_path}: {str(e)}")