from typing import Dict, Any, Tuple, List, Optional
from fastapi import UploadFile
from app.core.file_mappings import (
    get_file_mapping,
    get_field_category,
    is_vendor_profile_image,
    is_property_image,
    is_property_video,
    is_vendor_document,
    is_property_document,
    get_document_type,
    VENDOR_PROFILE_IMAGE_TO_DB_COLUMN,
    DOC_TYPE_MAPPING,
    VENDOR_DOCUMENT_TYPES,
)

class FileExtractionService:
    """Service for extracting and separating files from request data"""
    
    def extract_and_separate_files(
        self, 
        data: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
        """
        Extract files from data and separate them by category
        
        Returns:
            Tuple of (separated_files, cleaned_data, file_metadata)
        """
        separated_files = {
            'vendor_profile_images': {},
            'property_images': [],
            'property_video': None,
            'vendor_documents': [],
            'property_documents': [],
        }
        file_metadata = {}
        cleaned_data = {}
        
        # Clean keys first
        cleaned_data = self._clean_keys(data)
        
        for key, value in list(cleaned_data.items()):
            if value is None:
                continue

            # The generic 'documents' bucket (create/update property) mixes vendor
            # KYC docs (aadhaar, pan, ...) and property docs (sale deed, floor plan,
            # ...) in one list, disambiguated per-item via the parallel
            # `document_types` list rather than by field name - handle it before
            # the field-name-keyed dispatch below.
            if key == 'documents':
                self._handle_mixed_documents(key, value, separated_files, file_metadata, cleaned_data)
                continue

            # Check if this field has a mapping
            mapping = get_file_mapping(key)
            if not mapping:
                continue
            
            # Process based on category
            if is_vendor_profile_image(key):
                self._handle_vendor_profile_image(
                    key, value, separated_files, file_metadata, cleaned_data
                )
            elif is_property_image(key):
                self._handle_property_image(
                    key, value, separated_files, file_metadata, cleaned_data
                )
            elif is_property_video(key):
                self._handle_property_video(
                    key, value, separated_files, file_metadata, cleaned_data
                )
            elif is_vendor_document(key):
                self._handle_vendor_document(
                    key, value, separated_files, file_metadata, cleaned_data
                )
            elif is_property_document(key):
                self._handle_property_document(
                    key, value, separated_files, file_metadata, cleaned_data
                )
        
        return separated_files, cleaned_data, file_metadata
    
    def _clean_keys(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove [] from keys"""
        cleaned = {}
        for key, value in data.items():
            clean_key = key.replace('[]', '')
            cleaned[clean_key] = value
        return cleaned
    
    def _is_upload_file(self, value: Any) -> bool:
        """Check if value is an UploadFile"""
        return hasattr(value, 'file') or isinstance(value, UploadFile)
    
    def _handle_vendor_profile_image(
        self, 
        key: str, 
        value: Any, 
        separated_files: Dict,
        file_metadata: Dict,
        cleaned_data: Dict
    ):
        """Handle vendor profile image"""
        if self._is_upload_file(value):
            separated_files['vendor_profile_images'][key] = value
            file_metadata[key] = {
                'field': key,
                'category': 'vendor_profile_image',
                'db_column': VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(key),
                'doc_type': get_document_type(key)
            }
            del cleaned_data[key]
    
    def _handle_property_image(
        self, 
        key: str, 
        value: Any, 
        separated_files: Dict,
        file_metadata: Dict,
        cleaned_data: Dict
    ):
        """Handle property image"""
        if isinstance(value, list):
            for idx, file_obj in enumerate(value):
                if self._is_upload_file(file_obj):
                    separated_files['property_images'].append(file_obj)
                    # For the generic 'images' bucket the frontend puts the cover
                    # image first, so position 0 is primary just like the legacy
                    # dedicated 'coverImage' field.
                    is_primary = (idx == 0 and key in ('coverImage', 'images'))
                    file_metadata[f"{key}_{idx}"] = {
                        'field': key,
                        'category': 'property_image',
                        'index': idx,
                        'is_primary': is_primary
                    }
        elif self._is_upload_file(value):
            separated_files['property_images'].append(value)
            file_metadata[key] = {
                'field': key,
                'category': 'property_image',
                'is_primary': True
            }
        del cleaned_data[key]
    
    def _handle_property_video(
        self, 
        key: str, 
        value: Any, 
        separated_files: Dict,
        file_metadata: Dict,
        cleaned_data: Dict
    ):
        """Handle property video"""
        if self._is_upload_file(value):
            separated_files['property_video'] = value
            file_metadata[key] = {
                'field': key,
                'category': 'property_video'
            }
            del cleaned_data[key]
    
    def _handle_vendor_document(
        self, 
        key: str, 
        value: Any, 
        separated_files: Dict,
        file_metadata: Dict,
        cleaned_data: Dict
    ):
        """Handle vendor document"""
        doc_type = get_document_type(key)
        
        if isinstance(value, list):
            for idx, file_obj in enumerate(value):
                if self._is_upload_file(file_obj):
                    separated_files['vendor_documents'].append(file_obj)
                    file_metadata[f"{key}_{idx}"] = {
                        'field': key,
                        'category': 'vendor_document',
                        'doc_type': doc_type,
                        'index': idx
                    }
        elif self._is_upload_file(value):
            separated_files['vendor_documents'].append(value)
            file_metadata[key] = {
                'field': key,
                'category': 'vendor_document',
                'doc_type': doc_type
            }
        del cleaned_data[key]
    
    def _handle_property_document(
        self, 
        key: str, 
        value: Any, 
        separated_files: Dict,
        file_metadata: Dict,
        cleaned_data: Dict
    ):
        """Handle property document"""
        doc_type = get_document_type(key)
        
        if isinstance(value, list):
            for idx, file_obj in enumerate(value):
                if self._is_upload_file(file_obj):
                    separated_files['property_documents'].append(file_obj)
                    file_metadata[f"{key}_{idx}"] = {
                        'field': key,
                        'category': 'property_document',
                        'doc_type': doc_type,
                        'index': idx
                    }
        elif self._is_upload_file(value):
            separated_files['property_documents'].append(value)
            file_metadata[key] = {
                'field': key,
                'category': 'property_document',
                'doc_type': doc_type
            }
        del cleaned_data[key]

    def _normalize_doc_type(self, raw_type: Optional[str]) -> str:
        """Resolve a document-type hint to the canonical snake_case doc_type.

        Accepts either the frontend camelCase field key (e.g. 'aadhaarCard',
        resolved via DOC_TYPE_MAPPING) or an already-canonical snake_case value
        (e.g. 'aadhaar_card', passed through as-is).
        """
        if not raw_type:
            return 'other_supporting_document'
        raw_type = raw_type.strip()
        if not raw_type:
            return 'other_supporting_document'
        return DOC_TYPE_MAPPING.get(raw_type, raw_type)

    def _handle_mixed_documents(
        self,
        key: str,
        value: Any,
        separated_files: Dict,
        file_metadata: Dict,
        cleaned_data: Dict
    ):
        """Handle the generic 'documents' bucket sent by create/update property.

        It mixes vendor KYC docs (aadhaar, pan, ...) and property docs (sale deed,
        floor plan, ownership doc, ...) in one file list. Each item's real type -
        and therefore whether it's a vendor or property document - comes from the
        parallel `document_types` list (same order, sent as a Form field alongside
        `documents`), falling back to 'other_supporting_document' when missing.
        """
        doc_types_list = cleaned_data.get('document_types') or []
        if isinstance(doc_types_list, str):
            doc_types_list = [t.strip() for t in doc_types_list.split(',')]

        items = value if isinstance(value, list) else [value]
        vendor_idx = 0
        property_idx = 0
        for idx, file_obj in enumerate(items):
            if not self._is_upload_file(file_obj):
                continue
            raw_type = doc_types_list[idx] if idx < len(doc_types_list) else None
            doc_type = self._normalize_doc_type(raw_type)

            if doc_type in VENDOR_DOCUMENT_TYPES:
                separated_files['vendor_documents'].append(file_obj)
                file_metadata[f"{key}_vendor_{vendor_idx}"] = {
                    'field': key,
                    'category': 'vendor_document',
                    'doc_type': doc_type,
                    'index': vendor_idx
                }
                vendor_idx += 1
            else:
                separated_files['property_documents'].append(file_obj)
                file_metadata[f"{key}_property_{property_idx}"] = {
                    'field': key,
                    'category': 'property_document',
                    'doc_type': doc_type,
                    'index': property_idx
                }
                property_idx += 1

        del cleaned_data[key]
        cleaned_data.pop('document_types', None)