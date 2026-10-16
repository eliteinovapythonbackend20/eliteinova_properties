from typing import Any


def strip_none_values(value: Any) -> Any:
    """Recursively remove None values from dicts, lists, and simple objects."""
    if isinstance(value, dict):
        return {
            key: strip_none_values(item)
            for key, item in value.items()
            if item is not None
        }

    if isinstance(value, list):
        return [strip_none_values(item) for item in value if item is not None]

    if hasattr(value, "__dict__") and not isinstance(value, (str, bytes, int, float, bool)):
        return {
            key: strip_none_values(item)
            for key, item in vars(value).items()
            if not key.startswith("_") and item is not None
        }

    return value


# app/utils/formatters.py
from typing import Any, Dict, List, Optional


class PropertyFormatter:
    """Shared utility for formatting property and profile data"""

    @staticmethod
    def _contact_person_media_url(property_obj, media_type: str) -> Optional[str]:
        """This property's contact person photo/logo - public media, never the
        uploader's own reusable USER_MEDIA. Looked up from
        property_obj.contact_person_media, which the read queries already
        eager-load with its file_asset."""
        for media in (property_obj.contact_person_media or []):
            if media.is_current and media.media_type == media_type:
                return media.file_asset.file_url if media.file_asset else None
        return None

    @staticmethod
    def format_media(media_list) -> List[Dict[str, Any]]:
        """Format media objects with camelCase keys.

        Sorted by the `order` column - display position must match `order`
        exactly, since delete-by-index (delete_property_image_by_order)
        deletes whichever row has order == the index the frontend clicked.
        The cover image is always order 0 (see add_property_image_raw /
        set_cover_image), so this also keeps the cover at images[0] for
        frontend callers that fall back to it when no coverImage field
        is present.
        """
        if not media_list:
            return []

        sorted_media = sorted(media_list, key=lambda m: m.order if m.order is not None else 0)
        formatted_media = []
        for media in sorted_media:
            formatted_media.append({
                'id': media.id,
                'fileUrl': media.file_url,
                'type':media.media_type,
                'filename_mapper':media.filename_mapper,
                'isPrimary': media.is_primary or False
            })
        return formatted_media

    @staticmethod
    def format_media_split(media_list):
        """Split media into (coverUrl, gallery) instead of one combined,
        order-sorted list.

        The cover is whichever image row is actually flagged is_primary -
        never inferred from position. If the cover row is deleted and no
        replacement has been set, coverUrl comes back None: the cover slot
        stays empty rather than a gallery photo being silently promoted into
        it. `gallery` holds everything else (including any video entry, kept
        for frontend callers that still separate it out), sorted by `order`.
        """
        if not media_list:
            return None, []

        cover = next((m for m in media_list if m.media_type == 'image' and m.is_primary), None)
        rest = [m for m in media_list if m is not cover]
        rest.sort(key=lambda m: m.order if m.order is not None else 0)

        cover_url = cover.file_url if cover else None
        gallery = [{
            'id': media.id,
            'fileUrl': media.file_url,
            'type': media.media_type,
            'filename_mapper': media.filename_mapper,
            'isPrimary': False,
        } for media in rest]
        return cover_url, gallery

    @staticmethod
    def format_documents(document_list) -> List[Dict[str, Any]]:
        """Format document objects with camelCase keys.

        Deliberately excludes the raw fileUrl - documents live in the private
        GCS bucket and must never get a permanent URL baked into a list/detail
        response. Call GET /properties/documents/{id}/view-url to view one.
        """
        if not document_list:
            return []

        formatted_docs = []
        for doc in document_list:
            formatted_docs.append({
                'id': doc.id,
                'documentType': doc.document_type,
                'fileName': doc.file_name,
                'fileSizeKb': doc.file_size_kb
            })
        return formatted_docs
    
    @staticmethod
    def format_contact_person(property_obj) -> Optional[Dict[str, Any]]:
        """Reads property_contact_persons (flat columns + bank_details/
        social_links/role_details JSONB) - one method instead of branching on
        posted_by to pick one of four now-removed per-role tables. Produces
        the same key set the frontend's
        contactPersonDetails contract already expects (see profileService.js's
        mapPropertyToFrontend) - API contract unchanged, only the
        implementation collapses. Irrelevant-for-this-role keys come back
        None, same as before (and get dropped by strip_none_values downstream,
        same as before)."""
        cp = getattr(property_obj, "contact_person", None)
        if not cp:
            return None
        bank = cp.bank_details or {}
        social = cp.social_links or {}
        role = cp.role_details or {}
        is_company_role = cp.vendor_type in ("AGENT", "BUILDER", "PROPERTY_MANAGEMENT")
        logo_media_type = "agency_logo" if cp.vendor_type == "AGENT" else "company_logo"
        return {
            'name': cp.name,
            'mobile': cp.mobile,
            'emailId': cp.email,
            'profilePhotoUrl': PropertyFormatter._contact_person_media_url(property_obj, 'profile_photo'),
            'companyLogo': PropertyFormatter._contact_person_media_url(property_obj, logo_media_type) if is_company_role else None,
            'designation': cp.designation,
            'whatsappNumber': cp.whatsapp_number,
            'dateOfBirth': cp.date_of_birth.isoformat() if cp.date_of_birth else None,
            'gender': cp.gender,
            'aadhaarNumber': cp.aadhaar_number,
            'panNumber': cp.pan_number,
            'addressLine1': cp.address_line1,
            'addressLine2': cp.address_line2,
            'officeAddress': cp.office_address,
            'city': cp.city,
            'district': cp.district,
            'state': cp.state,
            'pincode': cp.pincode,
            'landmark': cp.landmark,
            'companyName': role.get('companyName'),
            'companyRegNumber': role.get('companyRegNumber'),
            'companyWebsite': role.get('companyWebsite'),
            'companyProfile': role.get('companyDescription'),
            'reraRegistrationNumber': role.get('reraRegistrationNumber'),
            'gstNumber': role.get('gstNumber'),
            'experience': role.get('experience'),
            'activeListing': role.get('activeListing'),
            'serviceArea': role.get('serviceArea') or [],
            'website': social.get('website'),
            'facebook': social.get('facebook'),
            'instagram': social.get('instagram'),
            'linkedin': social.get('linkedin'),
            'youtube': social.get('youtube'),
            'bankName': bank.get('bankName'),
            'accountHolderName': bank.get('accountHolderName'),
            'accountNumber': bank.get('accountNumber'),
            'ifscCode': bank.get('ifscCode'),
            'upiId': bank.get('upiId'),
            'preferredContactMethod': role.get('preferredContactMethod') or [],
            'preferredContactTime': role.get('preferredContactTime') or [],
            'additionalNote': role.get('additionalNote'),
        }

    @staticmethod
    def strip_none_values(data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove None values from dictionary recursively"""
        if not isinstance(data, dict):
            return data
        
        cleaned = {}
        for key, value in data.items():
            if value is None:
                continue
            if isinstance(value, dict):
                nested = PropertyFormatter.strip_none_values(value)
                if nested:
                    cleaned[key] = nested
            elif isinstance(value, list):
                cleaned_list = []
                for item in value:
                    if isinstance(item, dict):
                        nested = PropertyFormatter.strip_none_values(item)
                        if nested:
                            cleaned_list.append(nested)
                    elif item is not None:
                        cleaned_list.append(item)
                if cleaned_list:
                    cleaned[key] = cleaned_list
            else:
                cleaned[key] = value
        
        return cleaned
