# # app/services/profile_service.py
# from typing import Any, Dict, Optional, List
# from fastapi import Depends, HTTPException, UploadFile
# from sqlalchemy.ext.asyncio import AsyncSession
# from fastapi import status

# from app.core.database import get_db
# from app.repositories.property_repository import PropertyRepository
# from app.core.response_utils import PropertyFormatter
# from app.services.file_service import FileService
# from app.services.property_service import PropertyService


# class ProfileService:

#     def __init__(self, repository: PropertyRepository, file_service: Optional[FileService] = None):
#         self.repository = repository
#         self.formatter = PropertyFormatter()
#         self.file_service = file_service or FileService()  # Create FileService if not provided

#     async def get_properties_by_user(self, user_id: str, skip: int = 0, limit: int = 20) -> Dict[str, Any]:
#         properties = await self.repository.get_property_by_user_id(
#             user_id=user_id,
#             skip=skip,
#             limit=limit
#         )
#         print(f"properties from table ${properties}")
#         # Format each property
#         formatted_properties = []
#         for prop in properties:
#             formatted = self._to_response(prop)
#             if formatted:
#                 formatted_properties.append(formatted)
        
#         total_count = await self.repository.get_count_by_user_id_property(user_id)

#         return {
#             "data": formatted_properties,
#             "pagination": {
#                 "total": total_count,
#                 "page": (skip // limit) + 1 if limit > 0 else 1,
#                 "limit": limit,
#                 "totalPages": (total_count + limit - 1) // limit if limit > 0 else 0
#             }
#         }

#     def _to_response(self, property_obj) -> Optional[Dict[str, Any]]:
#         if not property_obj:
#             return None
#         property_data = {
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
#             # 'otherAmenities': property_obj.other_amenities if property_obj.other_amenities else [],
            
#             # ===== Additional =====
#             'propertyCategory': property_obj.property_category.value if property_obj.property_category else None,
#             'configuration': property_obj.sub_category,
            
#             # ===== Common Filters =====
#             'hasGarden': property_obj.garden_space,
#             'hasTerrace': property_obj.terrace,
#             'hasBalcony': property_obj.balcony,
#             'facing': property_obj.facing_direction,
#             'floorNumber': property_obj.floor_number,
#             'totalFloors': property_obj.total_floors,
            
#             # ===== Buy Filters =====
#             'homeLoanRequired': property_obj.loan_eligible,
            
#             # ===== Rent Filters =====
#             'occupancyType': property_obj.tenant_type[0] if property_obj.tenant_type and len(property_obj.tenant_type) > 0 else None,
#             'rentalDuration': property_obj.minimum_rental_duration,
#             'petFriendly': property_obj.pet_friendly,
#             'securityDeposit': property_obj.security_deposit,
            
#             # ===== Sell Filters =====
#             'ownershipType': property_obj.ownership_type,
#             'propertyAge': int(property_obj.property_age) if property_obj.property_age and property_obj.property_age.isdigit() else None,
#             'propertyCondition': property_obj.property_condition,
#             'isNegotiable': property_obj.price_negotiable,
#             'loanOutstanding': property_obj.loan_outstanding,
            
#             # ===== Lease Filters =====
#             'leaseBudgetMin': float(property_obj.price_min) if property_obj.price_min else None,
#             'leaseBudgetMax': float(property_obj.price_max) if property_obj.price_max else None,
#             'advanceDeposit': property_obj.security_deposit,
#             'leaseDuration': property_obj.lease_terms,
            
#             # ===== Land/Plot =====
#             'plotSize': property_obj.sub_category,
#             'totalSqft': float(property_obj.built_up_area) if property_obj.built_up_area else None,
#             'highlights': property_obj.interior_features if property_obj.interior_features else [],
#             'location': property_obj.area,
            
#             # ===== Status =====
#             'status': property_obj.status or 'Under-Review',
#             'createdAt': property_obj.created_at.isoformat() if property_obj.created_at else None,
#             'updatedAt': property_obj.updated_at.isoformat() if property_obj.updated_at else None,
            
#             # ===== Media =====
#             'images': self.formatter.format_media(property_obj.media) if property_obj.media else [],
#             'documents': self.formatter.format_documents(property_obj.documents) if property_obj.documents else [],
#         }
        
#         # ============ PROFILE DATA ============
#         profile_data = self._get_profile_data(property_obj)
        
#         # Clean both responses (remove None values)
#         property_data = self.formatter.strip_none_values(property_data)
#         profile_data = self.formatter.strip_none_values(profile_data) if profile_data else None
        
#         return {
#             'propertyData': property_data,
#             'profileData': profile_data
#         }

#     def _get_profile_data(self, property_obj) -> Optional[Dict[str, Any]]:
#         if not property_obj or not property_obj.posted_by:
#             return None
        
#         posted_by = property_obj.posted_by.value
        
#         # Base profile data (common fields for all user types)
#         base_profile = {
#             'postedAs': posted_by,
#             'propertyId': property_obj.id,
#             'propertyTitle': property_obj.property_title,
#             'propertyAddress': property_obj.address,
#             'city': property_obj.city,
#             'state': property_obj.state,
#             'pincode': property_obj.pin_code,
#         }
        
#         # Get type-specific details using the formatter
#         if posted_by == 'OWNER':
#             owner_details = self.formatter.format_owner_details(property_obj)
#             if owner_details:
#                 return {**base_profile, **owner_details}
        
#         elif posted_by == 'AGENT':
#             agent_details = self.formatter.format_agent_details(property_obj)
#             if agent_details:
#                 return {**base_profile, **agent_details}
        
#         elif posted_by == 'BUILDER':
#             builder_details = self.formatter.format_builder_details(property_obj)
#             if builder_details:
#                 return {**base_profile, **builder_details}
        
#         elif posted_by == 'PROPERTY_MANAGEMENT':
#             pm_details = self.formatter.format_property_management_details(property_obj)
#             if pm_details:
#                 return {**base_profile, **pm_details}
        
#         return base_profile

#     async def upload_single_file(
#         self,
#         file: UploadFile,
#         field: str,
#         category: str,  # 'images', 'video', 'documents'
#         is_document: bool,
#         is_primary: bool = False,
#         property_id: Optional[int] = None,
#         user_id: Optional[str] = None
#     ) -> Dict[str, Any]:
#         try:
#             result = {}
            
#             # Route to appropriate upload method based on category
#             if category == 'images':
#                 upload_results = await self.file_service.upload_images(
#                     images=[file],
#                     user_id=user_id,
#                     property_id=property_id,
#                     field_name=field
#                 )
#                 result = upload_results[0] if upload_results else {}
                
#             elif category == 'video':
#                 result = await self.file_service.upload_video(
#                     file=file,
#                     user_id=user_id,
#                     property_id=property_id
#                 )
                
#             elif category == 'documents':
#                 upload_results = await self.file_service.upload_documents(
#                     documents=[file],
#                     user_id=user_id,
#                     property_id=property_id
#                 )
#                 result = upload_results[0] if upload_results else {}
            
#             else:
#                 raise ValueError(f"Unsupported category: {category}")
            
#             # If property_id is provided, save metadata to database
#             if property_id and result:
                
#                 if category in ['images', 'video']:
#                     # Save to PropertyMedia table
#                     media_type = 'image' if category == 'images' else 'video'
                    
#                     media_data = {
#                         'property_id': property_id,
#                         'media_type': media_type,
#                         'file_name': result.get('stored_filename') or result.get('file_name') or file.filename,
#                         'mime_type': result.get('mime_type') or file.content_type,
#                         'filename_mapper':result.get("filename_mapper"),
#                         'format': result.get('format') or 'webp',
#                         'file_url': result.get('file_url'),
#                         'thumbnail_url': result.get('thumbnail_url'),
#                         'file_size_kb': result.get('file_size_kb') or 0,
#                         'width': result.get('width'),
#                         'height': result.get('height'),
#                         'is_primary': is_primary,
#                         'order': 0
#                     }
                    
#                     media_obj = await self.repository.create_property_media(media_data)
                    
#                     return {
#                         'id': media_obj.id,
#                         'file_url': media_obj.file_url,
#                         'thumbnail_url': media_obj.thumbnail_url,
#                         'file_name': media_obj.file_name,
#                         'file_size_kb': media_obj.file_size_kb,
#                         'is_primary': media_obj.is_primary,
#                         'media_type': media_obj.media_type,
#                         'field': field,
#                         'width': result.get('width'),
#                         'height': result.get('height')
#                     }
                    
#                 elif category == 'documents':
#                     # Save to PropertyDocument table
#                     doc_type = getattr(file, 'doc_type', 'other_supporting_document')
                    
#                     doc_data = {
#                         'property_id': property_id,
#                         'document_type': doc_type,
#                         'file_name': result.get('stored_filename') or result.get('file_name') or file.filename,
#                         'mime_type': result.get('mime_type') or file.content_type,
#                         'file_url': result.get('file_url'),
#                         'file_size_kb': result.get('file_size_kb') or 0,
#                         'is_public': False
#                     }
                    
#                     doc_obj = await self.repository.create_property_document(doc_data)
                    
#                     return {
#                         'id': doc_obj.id,
#                         'file_url': doc_obj.file_url,
#                         'file_name': doc_obj.file_name,
#                         'document_type': doc_obj.document_type,
#                         'file_size_kb': doc_obj.file_size_kb,
#                         'field': field,
#                         'is_public': doc_obj.is_public
#                     }
            
#             # If no property_id, just return the upload result
#             return result
            
#         except Exception as e:
#             print(f"❌ Error uploading file: {str(e)}")
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail=f"Failed to upload file: {str(e)}"
#             )




#     async def delete_profile_file(self, ):
#         pass


# # ============ DEPENDENCY INJECTION FUNCTIONS ============

# async def get_profile_service(
#     db: AsyncSession = Depends(get_db)
# ) -> ProfileService:
#     repository = PropertyRepository(db)
#     return ProfileService(repository=repository)  # file_service will be created automatically


# async def get_property_service(
#     db: AsyncSession = Depends(get_db)
# ) -> PropertyService:
#     repository = PropertyRepository(db)
#     return PropertyService(repository)
































# app/services/profile_service.py
from datetime import date, datetime
from typing import Any, Dict, Optional, List
from fastapi import Depends, HTTPException, UploadFile
from sqlalchemy import inspect as sa_inspect
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status

from app.core.database import get_db
from app.models.property import PostedBy, PropertyStatus
from app.repositories.property_repository import PropertyRepository
from app.core.response_utils import PropertyFormatter
from app.services.file_service import FileService
from app.services.property_service import PropertyService
from app.repositories.profile_repository import VendorProfileRepository


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

    def __init__(self, repository: PropertyRepository, profile_repository:VendorProfileRepository, file_service: Optional[FileService] = None):
        self.repository = repository
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
    def _model_to_dict(obj) -> Dict[str, Any]:
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

    async def _get_owned_property_or_404(self, property_id: str, user_id: str, posted_by: PostedBy):
        prop = await self.repository.get_property_by_id(property_id)
        if (
            not prop
            or prop.user_id != user_id
            or (prop.posted_by and prop.posted_by != posted_by.value)
        ):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
        return prop
    

    async def get_properties_by_user(self, user_id: str, skip: int = 0, limit: int = 20) -> Dict[str, Any]:
        properties = await self.repository.get_property_by_user_id(
            user_id=user_id,
            skip=skip,
            limit=limit
        )
        formatted_properties = []
        for prop in properties:
            formatted = self._to_response(prop)
            if formatted:
                formatted_properties.append(formatted)

        total_count = await self.repository.get_count_by_user_id_property(user_id)

        return {
            "data": formatted_properties,
            "pagination": {
                "total": total_count,
                "page": (skip // limit) + 1 if limit > 0 else 1,
                "limit": limit,
                "totalPages": (total_count + limit - 1) // limit if limit > 0 else 0
            }
        }

    def _to_response(self, property_obj) -> Optional[Dict[str, Any]]:
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
        }
        
        property_data = self.formatter.strip_none_values(property_data)
        
        return property_data
        

    def _to_profile_response(self, vendorprofile):
        profile = {
            "id":vendorprofile.id,
            "userId":vendorprofile.user_id,
            "fullName":vendorprofile.full_name,
            "phoneNumber":vendorprofile.phone_number,
            "whatsappNumber":vendorprofile.whatsapp_number,
            "gender":vendorprofile.gender,
            "profilePhotoUrl":vendorprofile.profile_picture,
            "companyLogoUrl":vendorprofile.company_logo_url,
            "address":vendorprofile.address,
            "city":vendorprofile.city,
            "district":vendorprofile.district,
            "state":vendorprofile.state,
            "country":vendorprofile.country,
            "pincode":vendorprofile.pincode,
            "aadharNumber":vendorprofile.aadhar_number,
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
            "agencyDetails":vendorprofile.agency_details,
            "companyDetails":vendorprofile.company_details,
        }
        return profile

    def _get_profile_data(self, property_obj) -> Optional[Dict[str, Any]]:
        if not property_obj or not property_obj.posted_by:
            return None

        posted_by = property_obj.posted_by

        base_profile = {
            'postedAs': posted_by,
            'propertyId': property_obj.id,
            'propertyTitle': property_obj.property_title,
            'propertyAddress': property_obj.address,
            'city': property_obj.city,
            'state': property_obj.state,
            'pincode': property_obj.pin_code,
        }

        if posted_by == 'OWNER':
            owner_details = self.formatter.format_owner_details(property_obj)
            if owner_details:
                return {**base_profile, **owner_details}

        elif posted_by == 'AGENT':
            agent_details = self.formatter.format_agent_details(property_obj)
            if agent_details:
                return {**base_profile, **agent_details}

        elif posted_by == 'BUILDER':
            builder_details = self.formatter.format_builder_details(property_obj)
            if builder_details:
                return {**base_profile, **builder_details}

        elif posted_by == 'PROPERTY_MANAGEMENT':
            pm_details = self.formatter.format_property_management_details(property_obj)
            if pm_details:
                return {**base_profile, **pm_details}

        return base_profile


    async def get_vendor_profile(self, user_id: str) -> Dict[str, Any]:
        profile = await self.vendor_profile_repository.get_vendor_profile(user_id)
        profile = self._to_profile_response(profile)
        return self.formatter.strip_none_values(profile)

    async def update_vendor_profile(
        self, user_id: str, vendor_type: str, update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        detail_obj = await self.repository.update_vendor_detail(user_id, posted_by, update_data)
        if not detail_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} to create one.",
            )
        await self.repository.commit()
        return self.formatter.strip_none_values(self._model_to_dict(detail_obj))

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

        detail_obj = await self.repository.update_vendor_detail(
            user_id, posted_by, {"profile_photo_url": upload_result["file_url"]}
        )
        if not detail_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} before uploading a photo.",
            )
        await self.repository.commit()
        return {"profile_photo_url": detail_obj.profile_photo_url}

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

        detail_obj = await self.repository.update_vendor_detail(
            user_id, posted_by, {logo_field: upload_result["file_url"]}
        )
        if not detail_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No {vendor_type} profile found. Post a property as {vendor_type} before uploading a logo.",
            )
        await self.repository.commit()
        return {logo_field: getattr(detail_obj, logo_field)}

    async def delete_vendor_profile_photo(self, user_id: str, vendor_type: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        detail_obj = await self.repository.get_latest_vendor_detail(user_id, posted_by)
        if not detail_obj or not detail_obj.profile_photo_url:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No profile photo to delete")

        old_url = detail_obj.profile_photo_url
        await self.repository.update_vendor_detail(user_id, posted_by, {"profile_photo_url": None})
        await self.repository.commit()

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

        detail_obj = await self.repository.get_latest_vendor_detail(user_id, posted_by)
        old_url = getattr(detail_obj, logo_field, None) if detail_obj else None
        if not old_url:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No logo to delete")

        await self.repository.update_vendor_detail(user_id, posted_by, {logo_field: None})
        await self.repository.commit()

        try:
            await self.file_service.delete_files([old_url])
        except Exception as e:
            print(f"⚠️ Failed to delete old logo from storage: {e}")

        return {"deleted": True}


    async def upload_vendor_document(
        self, user_id: str, vendor_type: str, doc_type: str, file: UploadFile
    ) -> Dict[str, Any]:
        self.resolve_vendor_type(vendor_type)  # validates vendor_type; role itself not needed below

        upload_result = await self.file_service.upload_document(
            file=file,
            user_id=user_id,
            property_id="profile",
            idx=0,
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
        return self._model_to_dict(doc_obj)

    async def get_vendor_document(self, user_id: str, vendor_type: str, doc_type: str) -> Dict[str, Any]:
        self.resolve_vendor_type(vendor_type)
        doc_obj = await self.repository.get_vendor_document(user_id, doc_type)
        if not doc_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{doc_type}' document found")
        return self._model_to_dict(doc_obj)

    async def delete_vendor_document(self, user_id: str, vendor_type: str, doc_type: str) -> Dict[str, Any]:
        self.resolve_vendor_type(vendor_type)
        doc_obj = await self.repository.get_vendor_document(user_id, doc_type)
        if not doc_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No '{doc_type}' document found")

        old_url = doc_obj.file_url
        deleted = await self.repository.delete_vendor_document(user_id, doc_type)
        await self.repository.commit()

        if deleted and old_url:
            try:
                await self.file_service.delete_files([old_url])
            except Exception as e:
                print(f"⚠️ Failed to delete vendor document from storage: {e}")

        return {"deleted": deleted}


    async def get_vendor_properties(
        self, user_id: str, vendor_type: str, skip: int = 0, limit: int = 20, status: Optional[str] = None
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        properties = await self.repository.get_properties_by_user_and_role(
            user_id=user_id, posted_by=posted_by, skip=skip, limit=limit, status=status
        )
        print(f"="*100)
        print(f"result {properties}")
        print(f"="*100)
        formatted_properties = [self._to_response(p) for p in properties if p]
        total_count = await self.repository.get_count_by_user_and_role(user_id, posted_by, status=status)

        return {
            "data": formatted_properties,
            "pagination": {
                "total": total_count,
                "page": (skip // limit) + 1 if limit > 0 else 1,
                "limit": limit,
                "totalPages": (total_count + limit - 1) // limit if limit > 0 else 0,
            },
        }

    async def get_vendor_property_detail(self, user_id: str, vendor_type: str, property_id: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        prop = await self.repository.get_property_with_relations(property_id)
        return self._to_response(prop)

    async def update_vendor_property(
        self, user_id: str, vendor_type: str, property_id: str, update_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)

        base_fields = self.repository._sanitize_property_data(update_data)
        if base_fields:
            await self.repository.update_property(property_id, base_fields)

        role_fields = {k: v for k, v in update_data.items() if k not in base_fields}
        if role_fields:
            await self.repository.update_role_specific_details(property_id, posted_by, role_fields)

        await self.repository.commit()
        prop = await self.repository.get_property_with_relations(property_id)
        return self._to_response(prop)




    async def update_vendor_property_with_files(
        self,
        user_id: str,
        vendor_type: str,
        property_id: str,
        update_data: Dict[str, Any],
        separated_files: Optional[Dict[str, Any]] = None,
        file_metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:

        posted_by = self.resolve_vendor_type(vendor_type)
        
        # Get the property to verify ownership
        property_obj = await self.repository.get_property_by_id(property_id)
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Property with ID {property_id} not found"
            )
        
        if property_obj.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this property"
            )
        
        try:
            if update_data:
                # Separate base fields from role-specific fields
                base_fields = self.repository._sanitize_property_data(update_data)
                if base_fields:
                    await self.repository.update_property(property_id, base_fields)
                
                role_fields = {k: v for k, v in update_data.items() if k not in base_fields}
                if role_fields:
                    await self.repository.update_role_specific_details(property_id, posted_by, role_fields)
            
            if not separated_files:
                separated_files = {}
            
            # ============================================
            # 2. PROCESS VENDOR PROFILE IMAGES
            # ============================================
            vendor_profile_images = separated_files.get('vendor_profile_images', {})
            if vendor_profile_images:
                # ✅ CALL THE HELPER
                await self._process_vendor_profile_images_update(
                    vendor_profile_images,
                    user_id,
                    posted_by,
                    property_id
                )
            
            # ============================================
            # 3. PROCESS PROPERTY IMAGES
            # ============================================
            property_images = separated_files.get('property_images', [])
            if property_images:
                # Delete existing property images (both cover and property images)
                await self.repository.delete_property_media(property_id)
                
                # ✅ CALL THE HELPER
                await self._process_property_images_update(
                    property_images,
                    user_id,
                    property_id,
                    file_metadata
                )
            
            # ============================================
            # 4. PROCESS PROPERTY VIDEO
            # ============================================
            property_video = separated_files.get('property_video')
            if property_video:
                # Delete existing video
                await self.repository.delete_property_video(property_id)
                
                # ✅ CALL THE HELPER
                await self._process_property_video_update(
                    property_video,
                    user_id,
                    property_id
                )
            
            # ============================================
            # 5. PROCESS VENDOR DOCUMENTS
            # ============================================
            vendor_documents = separated_files.get('vendor_documents', [])
            if vendor_documents:
                # ✅ CALL THE HELPER
                await self._process_vendor_documents_update(
                    vendor_documents,
                    user_id,
                    file_metadata
                )
            
            # ============================================
            # 6. PROCESS PROPERTY DOCUMENTS
            # ============================================
            property_documents = separated_files.get('property_documents', [])
            if property_documents:
                # Delete existing property documents
                await self.repository.delete_property_documents(property_id)
                
                # ✅ CALL THE HELPER
                await self._process_property_documents_update(
                    property_documents,
                    user_id,
                    property_id,
                    file_metadata
                )
            
            # ============================================
            # 7. UPDATE VENDOR DETAILS FROM DATA
            # ============================================
            if update_data:
                await self._update_vendor_details_from_data(
                    posted_by=posted_by,
                    property_data=update_data,
                    user_id=user_id,
                    property_id=property_id
                )
            
            # ============================================
            # 8. COMMIT CHANGES
            # ============================================
            await self.repository.commit()
            
            # ============================================
            # 9. RETURN UPDATED PROPERTY
            # ============================================
            updated_property = await self.repository.get_property_with_relations(property_id)
            return self._to_response(updated_property)
            
        except Exception as e:
            await self.repository.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update property: {str(e)}"
            )

    async def delete_vendor_property(self, user_id: str, vendor_type: str, property_id: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        deleted = await self.repository.delete_property(property_id)
        await self.repository.commit()
        return {"deleted": deleted}

    async def update_vendor_property_status(
        self, user_id: str, vendor_type: str, property_id: str, new_status: str
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        prop = await self.repository.update_property_status(property_id, new_status)
        await self.repository.commit()
        return {"id": prop.id, "propertyStatus": prop.status}

    async def search_vendor_properties(
        self, user_id: str, vendor_type: str, keyword: Optional[str], skip: int = 0, limit: int = 20
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        properties, total_count = await self.repository.search_user_properties(
            user_id=user_id, posted_by=posted_by, keyword=keyword, skip=skip, limit=limit
        )
        formatted = [self._to_response(p) for p in properties if p]
        return {
            "data": formatted,
            "pagination": {
                "total": total_count,
                "page": (skip // limit) + 1 if limit > 0 else 1,
                "limit": limit,
                "totalPages": (total_count + limit - 1) // limit if limit > 0 else 0,
            },
        }


    async def upload_vendor_property_image(
        self, user_id: str, vendor_type: str, property_id: str, file: UploadFile, order: int = 0
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        return await self.upload_single_file(
            file=file,
            field="propertyImages",
            category="images",
            is_document=False,
            is_primary=(order == 0),
            property_id=property_id,
            user_id=user_id,
        )

    async def delete_vendor_property_image(
        self, user_id: str, vendor_type: str, property_id: str, image_index: int
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        deleted = await self.repository.delete_property_image_by_order(property_id, image_index)
        await self.repository.commit()
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found at that index")
        return {"deleted": True}

    async def set_vendor_property_cover(
        self, user_id: str, vendor_type: str, property_id: str, media_id: int
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        media = await self.repository.set_cover_image(property_id, media_id)
        await self.repository.commit()
        if not media:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found on this property")
        return {"id": media.id, "file_url": media.file_url, "is_primary": media.is_primary}

    async def upload_vendor_property_video(
        self, user_id: str, vendor_type: str, property_id: str, file: UploadFile
    ) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        return await self.upload_single_file(
            file=file,
            field="video",
            category="video",
            is_document=False,
            is_primary=False,
            property_id=property_id,
            user_id=user_id,
        )

    async def delete_vendor_property_video(self, user_id: str, vendor_type: str, property_id: str) -> Dict[str, Any]:
        posted_by = self.resolve_vendor_type(vendor_type)
        await self._get_owned_property_or_404(property_id, user_id, posted_by)
        await self.repository.delete_property_video(property_id)
        await self.repository.commit()
        return {"deleted": True}


    async def upload_single_file(
        self,
        file: UploadFile,
        field: str,
        category: str,  # 'images', 'video', 'documents'
        is_document: bool,
        is_primary: bool = False,
        property_id: Optional[int] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        try:
            result = {}

            if category == 'images':
                upload_results = await self.file_service.upload_images(
                    images=[file],
                    user_id=user_id,
                    property_id=property_id,
                    field_name=field
                )
                result = upload_results[0] if upload_results else {}

            elif category == 'video':
                result = await self.file_service.upload_video(
                    file=file,
                    user_id=user_id,
                    property_id=property_id
                )

            elif category == 'documents':
                upload_results = await self.file_service.upload_documents(
                    documents=[file],
                    user_id=user_id,
                    property_id=property_id
                )
                result = upload_results[0] if upload_results else {}

            else:
                raise ValueError(f"Unsupported category: {category}")

            if property_id and result:

                if category in ['images', 'video']:
                    media_type = 'image' if category == 'images' else 'video'

                    media_data = {
                        'property_id': property_id,
                        'media_type': media_type,
                        'file_name': result.get('stored_filename') or result.get('file_name') or file.filename,
                        'mime_type': result.get('mime_type') or file.content_type,
                        'filename_mapper': result.get("filename_mapper"),
                        'format': result.get('format') or 'webp',
                        'file_url': result.get('file_url'),
                        'thumbnail_url': result.get('thumbnail_url'),
                        'file_size_kb': result.get('file_size_kb') or 0,
                        'width': result.get('width'),
                        'height': result.get('height'),
                        'is_primary': is_primary,
                        'order': 0
                    }

                    media_obj = await self.repository.create_property_media(media_data)

                    return {
                        'id': media_obj.id,
                        'file_url': media_obj.file_url,
                        'thumbnail_url': media_obj.thumbnail_url,
                        'file_name': media_obj.file_name,
                        'file_size_kb': media_obj.file_size_kb,
                        'is_primary': media_obj.is_primary,
                        'media_type': media_obj.media_type,
                        'field': field,
                        'width': result.get('width'),
                        'height': result.get('height')
                    }

                elif category == 'documents':
                    doc_type = getattr(file, 'doc_type', 'other_supporting_document')

                    doc_data = {
                        'property_id': property_id,
                        'user_id': user_id,
                        'document_type': doc_type,
                        'file_name': result.get('stored_filename') or result.get('file_name') or file.filename,
                        'mime_type': result.get('mime_type') or file.content_type,
                        'file_url': result.get('file_url'),
                        'file_size_kb': result.get('file_size_kb') or 0,
                        'is_public': False
                    }

                    doc_obj = await self.repository.create_property_document(doc_data)

                    return {
                        'id': doc_obj.id,
                        'file_url': doc_obj.file_url,
                        'file_name': doc_obj.file_name,
                        'document_type': doc_obj.document_type,
                        'file_size_kb': doc_obj.file_size_kb,
                        'field': field,
                        'is_public': doc_obj.is_public
                    }

            return result

        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Error uploading file: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file: {str(e)}"
            )

    async def delete_profile_file(self, file_path: str, user_id: str) -> Dict[str, Any]:
        await self.file_service.delete_files([file_path])
        return {"deleted": True}

    async def get_user_profile_files(self, user_id: str) -> Dict[str, Any]:
        files: Dict[str, Any] = {}
        for role_key, posted_by in VENDOR_TYPE_MAP.items():
            detail_obj = await self.repository.get_latest_vendor_detail(user_id, posted_by)
            if not detail_obj:
                continue
            role_files = {"profile_photo_url": getattr(detail_obj, "profile_photo_url", None)}
            logo_field = LOGO_FIELD_BY_ROLE.get(posted_by)
            if logo_field:
                role_files[logo_field] = getattr(detail_obj, logo_field, None)
            files[role_key] = self.formatter.strip_none_values(role_files)
        return files


# ============ DEPENDENCY INJECTION FUNCTIONS ============

async def get_profile_service(
    db: AsyncSession = Depends(get_db)
) -> ProfileService:
    repository = PropertyRepository(db)
    profile_repository = VendorProfileRepository(db)
    return ProfileService(repository=repository, profile_repository=profile_repository)  # file_service will be created automatically


async def get_property_service(
    db: AsyncSession = Depends(get_db)
) -> PropertyService:
    repository = PropertyRepository(db)
    
    return PropertyService(repository)

# app/services/profile_service.py

async def _process_vendor_profile_images_update(
    self,
    vendor_profile_images: Dict[str, UploadFile],
    user_id: str,
    posted_by: str,
    property_id: str
):
    """Process vendor profile images update"""
    
    from app.core.file_mappings import VENDOR_PROFILE_IMAGE_TO_DB_COLUMN
    
    vendor_image_urls = {}
    
    for field_name, file_obj in vendor_profile_images.items():
        db_column = VENDOR_PROFILE_IMAGE_TO_DB_COLUMN.get(field_name)
        if not db_column:
            print(f"  ⚠️ No DB column mapping for {field_name}")
            continue
        
        # Upload image to storage
        result = await self.file_service.upload_vendor_profile_image(
            file=file_obj,
            user_id=user_id,
            field_name=field_name
        )
        
        vendor_image_urls[db_column] = result['file_url']
        print(f"  ✅ Uploaded {field_name} → {db_column}: {result['file_url']}")
    
    # Update vendor table with image URLs
    if vendor_image_urls:
        await self.repository.update_vendor_detail(
            user_id=user_id,
            posted_by=posted_by,
            property_id=property_id,
            update_data=vendor_image_urls
        )
        print(f"  ✅ Updated vendor profile with {len(vendor_image_urls)} image URLs")


async def _process_property_images_update(
    self,
    property_images: List[UploadFile],
    user_id: str,
    property_id: str,
    file_metadata: Optional[Dict[str, Any]] = None
):
    """Process property images with filename_mapper mapping"""
    
    for idx, image in enumerate(property_images):
        # Get field_name from metadata or filename_mapper
        field_name = None
        is_primary = False
        
        if file_metadata:
            for key, meta in file_metadata.items():
                if meta.get('category') == 'property_image' and meta.get('index', 0) == idx:
                    field_name = meta.get('field', 'propertyImages')
                    is_primary = meta.get('is_primary', (idx == 0))
                    break
        
        if not field_name:
            # Default: first image is cover, rest are property images
            field_name = 'coverImage' if idx == 0 else 'propertyImages'
            is_primary = (idx == 0)
        
        print(f"📸 Processing property image {idx}: field_name={field_name}, is_primary={is_primary}")
        
        # Upload image using file_service
        result = await self.file_service.upload_property_image(
            file=image,
            user_id=user_id,
            property_id=property_id,
            is_primary=is_primary,
            order=idx
        )
        
        # Save to PropertyMedia with filename_mapper
        await self.repository.create_property_media({
            'property_id': property_id,
            'media_type': 'image',
            'file_name': result['file_name'],
            'filename_mapper': field_name,  # Important: Maps to coverImage/propertyImages
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
        print(f"  ✅ Uploaded property image {idx}: {result['file_url']} (mapper: {field_name})")


async def _process_property_video_update(
    self,
    property_video: UploadFile,
    user_id: str,
    property_id: str
):
    """Process property video update"""
    
    result = await self.file_service.upload_video(
        file=property_video,
        user_id=user_id,
        property_id=property_id
    )
    
    await self.repository.create_property_media({
        'property_id': property_id,
        'media_type': 'video',
        'file_name': result['file_name'],
        'filename_mapper': 'propertyVideo',  # Maps to propertyVideo
        'mime_type': result['mime_type'],
        'format': result['format'],
        'file_url': result['file_url'],
        'file_size_kb': result['file_size_kb'],
        'is_primary': False,
        'order': 0
    })
    print(f"  ✅ Uploaded property video: {result['file_url']}")


async def _process_vendor_documents_update(
    self,
    vendor_documents: List[UploadFile],
    user_id: str,
    file_metadata: Optional[Dict[str, Any]] = None
):
    """Process vendor documents (profile documents)"""
    
    for idx, doc in enumerate(vendor_documents):
        # Get document type from metadata
        doc_type = getattr(doc, 'doc_type', None)
        if not doc_type and file_metadata:
            for key, meta in file_metadata.items():
                if meta.get('category') == 'vendor_document' and meta.get('index', 0) == idx:
                    doc_type = meta.get('doc_type')
                    break
        
        if not doc_type:
            doc_type = 'other_supporting_document'
        
        # Upload document
        upload_result = await self.file_service.upload_vendor_document(
            file=doc,
            user_id=user_id,
            document_type=doc_type
        )
        
        # Build doc_data for upsert
        doc_data = {
            'file_name': upload_result.get('file_name'),
            'mime_type': upload_result.get('mime_type'),
            'file_url': upload_result.get('file_url'),
            'file_size_kb': upload_result.get('file_size_kb'),
            'is_public': upload_result.get('is_public', False)
        }
        
        # Upsert vendor document
        await self.repository.upsert_vendor_document(
            user_id=user_id,
            document_type=doc_type,
            doc_data=doc_data
        )
        print(f"  ✅ Uploaded vendor document: {doc_type}")


async def _process_property_documents_update(
    self,
    property_documents: List[UploadFile],
    user_id: str,
    property_id: str,
    file_metadata: Optional[Dict[str, Any]] = None
):
    """Process property documents with doc_type mapping"""
    
    for idx, doc in enumerate(property_documents):
        # Get document type from metadata
        doc_type = getattr(doc, 'doc_type', None)
        if not doc_type and file_metadata:
            for key, meta in file_metadata.items():
                if meta.get('category') == 'property_document' and meta.get('index', 0) == idx:
                    doc_type = meta.get('doc_type')
                    break
        
        if not doc_type:
            doc_type = 'other_supporting_document'
        
        # Upload document
        upload_result = await self.file_service.upload_property_document(
            file=doc,
            user_id=user_id,
            property_id=property_id,
            document_type=doc_type
        )
        
        # Build doc_data
        doc_data = {
            'property_id': property_id,
            'user_id': user_id,
            'document_type': doc_type,
            'file_name': upload_result.get('file_name'),
            'mime_type': upload_result.get('mime_type'),
            'file_url': upload_result.get('file_url'),
            'file_size_kb': upload_result.get('file_size_kb'),
            'is_public': upload_result.get('is_public', False)
        }
        
        await self.repository.create_property_document(doc_data)
        print(f"  ✅ Uploaded property document: {doc_type}")