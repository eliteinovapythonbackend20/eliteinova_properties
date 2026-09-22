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
    def format_owner_details(property_obj) -> Optional[Dict[str, Any]]:
        """Get owner details with camelCase keys"""
        if property_obj.posted_by == 'OWNER' and property_obj.owner_details:
            owner = property_obj.owner_details
            return {
                'ownerId': owner.property_id,
                'fullName': owner.owner_name,
                'dateOfBirth': owner.date_of_birth.isoformat() if owner.date_of_birth else None,
                'gender': owner.gender,
                'aadhaarNumber': owner.aadhaar_number,
                'panNumber': owner.pan_number,
                'profilePhotoUrl':owner.profile_photo_url,
                'mobileNumber': owner.mobile,
                'emailAddress': owner.email_id,
                'addressLine1': owner.address_line1,
                'addressLine2': owner.address_line2,
                'city': owner.owner_city,
                'state': owner.owner_state,
                'pincode': owner.owner_pin_code,
                'preferredContactMethod': owner.preferred_contact_method if owner.preferred_contact_method else [],
                'preferredContactTime': owner.preferred_contact_time,
                'bankName': owner.bank_name,
                'accountHolderName': owner.account_holder_name,
                'accountNumber': owner.account_number,
                'ifscCode': owner.ifsc_code,
                'upiId': owner.upi_id,
                'additionalNote':owner.additionalnote,
            }
        return None
    
    @staticmethod
    def format_agent_details(property_obj) -> Optional[Dict[str, Any]]:
        """Get agent details with camelCase keys"""
        if property_obj.posted_by == 'AGENT' and property_obj.agent_details:
            agent = property_obj.agent_details
            return {
                'agentId': agent.id,
                'fullName': agent.agent_name,
                'dateOfBirth': agent.date_of_birth.isoformat() if agent.date_of_birth else None,
                'gender': agent.gender,
                'mobileNumber': agent.mobile,
                'emailId': agent.email_id,
                'profilePhotoUrl':agent.profile_photo_url,
                'companyLogo':agent.company_logo_url,
                'officeAddress': agent.office_address,
                'addressLine1': agent.address_line1,
                'addressLine2': agent.address_line2,
                'aadhaarNumber': agent.aadhaar_number,
                'agencyName': agent.agency_name,
                'reraRegistrationNumber': agent.rera_registration_number,
                'gstNumber': agent.gst_number,
                'experience': agent.experience,
                'activeListing': agent.active_listing,
                'serviceArea': agent.service_area if agent.service_area else [],
                'bankName': agent.bank_name,
                'accountHolderName': agent.account_holder_name,
                'accountNumber': agent.account_number,
                'ifscCode': agent.ifsc_code,
                'upiId': agent.upi_id,
            }
        return None
    
    @staticmethod
    def format_builder_details(property_obj) -> Optional[Dict[str, Any]]:
        """Get builder details with camelCase keys"""
        if property_obj.posted_by == 'BUILDER' and property_obj.builder_details:
            builder = property_obj.builder_details
            return {
                'builderId': builder.id,
                'fullName': builder.name,
                'designation': builder.designation,
                'mobileNumber': builder.mobile,
                'whatsappNumber': builder.whatsapp_number,
                'emailId': builder.email,
                'profilePhotoUrl':builder.profile_photo_url,
                'companyLogo':builder.company_logo_url,
                'reraRegistrationNumber': builder.rera_registration_number,
                'gstNumber': builder.gst_number,
                'experience': builder.experience,
                'serviceArea': builder.service_area if builder.service_area else [],
                'aadhaarNumber': builder.aadhaar_number,
                'panNumber': builder.pan_number,
                'companyName': builder.company_name,
                'companyRegNumber': builder.company_reg_number,
                'companyWebsite': builder.company_website,
                'companyProfile': builder.company_description,
                'officeAddress': builder.office_address,
                'city': builder.city,
                'district': builder.district,
                'state': builder.state,
                'pincode': builder.pincode,
                'landmark': builder.landmark,
                'website': builder.website,
                'facebook': builder.facebook,
                'instagram': builder.instagram,
                'linkedin': builder.linkedin,
                'youtube': builder.youtube,
                'bankName': builder.bank_name,
                'accountHolderName': builder.account_holder_name,
                'accountNumber': builder.account_number,
                'ifscCode': builder.ifsc_code,
                'upiId': builder.upi_id,
            }
        return None
    
    @staticmethod
    def format_property_management_details(property_obj) -> Optional[Dict[str, Any]]:
        """Get property management details with camelCase keys"""
        if property_obj.posted_by == 'PROPERTY_MANAGEMENT' and property_obj.property_management_details:
            pm = property_obj.property_management_details
            return {
                'pmId': pm.id,
                'fullName': pm.name,
                'designation': pm.designation,
                'mobileNumber': pm.mobile,
                'whatsappNumber': pm.whatsapp_number,
                'emailId': pm.email,
                'profilePhotoUrl':pm.profile_photo_url,
                'companyLogo':pm.company_logo_url,
                'companyName': pm.company_name,
                'companyRegNumber': pm.company_reg_number,
                'companyWebsite': pm.company_website,
                'companyDescription': pm.company_description,
                'reraRegistrationNumber': pm.rera_registration_number,
                'gstNumber': pm.gst_number,
                'experience': pm.experience,
                'serviceArea': pm.service_area if pm.service_area else [],
                'aadhaarNumber': pm.aadhaar_number,
                'panNumber': pm.pan_number,
                'officeAddress': pm.office_address,
                'city': pm.city,
                'district': pm.district,
                'state': pm.state,
                'pincode': pm.pincode,
                'landmark': pm.landmark,
                'website': pm.website,
                'facebook': pm.facebook,
                'instagram': pm.instagram,
                'linkedin': pm.linkedin,
                'youtube': pm.youtube,
                'bankName': pm.bank_name,
                'accountHolderName': pm.account_holder_name,
                'accountNumber': pm.account_number,
                'ifscCode': pm.ifsc_code,
                'upiId': pm.upi_id,
            }
        return None
    
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
