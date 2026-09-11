from typing import Dict, Any, Optional, List
from datetime import datetime, date
from decimal import Decimal

class FieldMappingService:
    """Service for mapping frontend fields to database fields"""
    
    # Frontend to DB field mapping
    FIELD_MAPPING = {
        # Owner fields
        'ownerName': 'owner_name',
        'contactNumber': 'mobile',
        'emailId': 'email_id',
        'addressLine1': 'address_line1',
        'addressLine2': 'address_line2',
        'ownerCity': 'owner_city',
        'ownerDistrict': 'owner_district',
        'ownerState': 'owner_state',
        'ownerPinCode': 'owner_pin_code',
        'dateOfBirth': 'date_of_birth',
        'gender': 'gender',
        'aadhaarNumber': 'aadhaar_number',
        'panNumber': 'pan_number',
        'preferredContactMethod': 'preferred_contact_method',
        'preferredContactTime': 'preferred_contact_time',
        'additionalNote': 'additionalnote',
        
        # Agent fields
        'agentName': 'agent_name',
        'agencyName': 'agency_name',
        'mobileNumber': 'mobile',
        'officeAddress': 'office_address',
        'reraNumber': 'rera_registration_number',
        'gstNumber': 'gst_number',
        'activeListings': 'active_listing',
        'serviceAreas': 'service_area',
        'yearsExperience': 'experience',
        'agentDateOfBirth': 'date_of_birth',
        'agentGender': 'gender',
        'agentEmail': 'email_id',
        
        # Social media
        'website': 'website',
        'facebook': 'facebook',
        'instagram': 'instagram',
        'linkedin': 'linkedin',
        'youtube': 'youtube',
        
        # Builder fields
        'builderName': 'name',
        'designation': 'designation',
        'builderMobile': 'mobile',
        'whatsappNumber': 'whatsapp_number',
        'builderEmail': 'email',
        'builderReraNumber': 'rera_registration_number',
        'builderGstNumber': 'gst_number',
        'builderExperience': 'experience',
        'builderAadhaar': 'aadhar_number',
        'builderPan': 'pan_number',
        'companyName': 'company_name',
        'companyRegNumber': 'company_reg_number',
        'companyWebsite': 'company_website',
        'companyDescription': 'company_description',
        'builderOfficeAddress': 'office_address',
        'builderCity': 'city',
        'builderDistrict': 'district',
        'builderState': 'state',
        'builderPincode': 'pincode',
        'builderLandmark': 'landmark',
        'builderWebsite': 'website',
        'builderFacebook': 'facebook',
        'builderInstagram': 'instagram',
        'builderLinkedin': 'linkedin',
        'builderYoutube': 'youtube',
        
        # PM fields
        'pmName': 'name',
        'pmDesignation': 'designation',
        'pmMobile': 'mobile',
        'pmWhatsapp': 'whatsapp_number',
        'pmEmail': 'email',
        'pmReraNumber': 'rera_registration_number',
        'pmGstNumber': 'gst_number',
        'pmExperience': 'experience',
        'pmAadhaar': 'aadhar_number',
        'pmPan': 'pan_number',
        'pmCompanyName': 'company_name',
        'pmCompanyRegNumber': 'company_reg_number',
        'pmCompanyWebsite': 'company_website',
        'pmCompanyDescription': 'company_description',
        'pmOfficeAddress': 'office_address',
        'pmCity': 'city',
        'pmDistrict': 'district',
        'pmState': 'state',
        'pmPincode': 'pincode',
        'pmLandmark': 'landmark',
        'pmWebsite': 'website',
        'pmFacebook': 'facebook',
        'pmInstagram': 'instagram',
        'pmLinkedin': 'linkedin',
        'pmYoutube': 'youtube',
        
        # Bank fields
        'accountHolderName': 'account_holder_name',
        'accountNumber': 'account_number',
        'bankName': 'bank_name',
        'ifscCode': 'ifsc_code',
        'upiId': 'upi_id',
        
        # Declaration fields
        'signatureDate': 'signature_date',
        'signaturePlace': 'signature_place',
        'declarationAccepted': 'declaration_accepted',
        
        # Property fields
        'propertyCategory': 'property_category',
        'listingPurpose': 'listing_purpose',
        'postedBy': 'posted_by',
        'propertyTitle': 'property_title',
        'propertyType': 'property_type',
        'bedrooms': 'bedrooms',
        'bathrooms': 'bathrooms',
        'builtUpArea': 'built_up_area',
        'carpetArea': 'carpet_area',
        'furnishingStatus': 'furnishing_status',
        'gardenSpace': 'garden_space',
        'terrace': 'terrace',
        'balcony': 'balcony',
        'propertyAddress': 'address',
        'area': 'area',
        'propertyCity': 'city',
        'district': 'district',
        'state': 'state',
        'pinCode': 'pin_code',
        'landmark': 'landmark',
        'parking': 'parking',
        'parkingCapacity': 'parking_capacity',
        'petFriendly': 'pet_friendly',
        'selectedAmenities': 'amenities',
        'availableFrom': 'available_from',
        'rentalDuration': 'minimum_duration',
        'immediateMoveIn': 'immediate_move_in',
        'expectedPrice': 'expected_price',
        'priceType': 'price_negotiable',
        'securityDeposit': 'security_deposit',
        'maintenance': 'maintenance_amount',
        'tenantType': 'tenant_type',
        'smokingAllowed': 'smoking_allowed',
        'dietaryPreference': 'dietary_preference',
        'propertyCondition': 'property_condition',
        'ownershipType': 'ownership_type',
        'loanOutstanding': 'loan_outstanding',
        'propertyTax': 'property_tax',
        'titleDeedVerify': 'title_deed_verify',
        'underconstruction': 'underconstruction',
        'immediatePossession': 'immediate_possession',
        'reraApproved': 'rera_approved',
        'loanEligible': 'loan_eligible',
        'floorNumber': 'floor_number',
        'totalFloors': 'total_floors',
        'propertyAge': 'property_age',
        'cornerUnit': 'corner_unit',
        'facingDirection': 'facing_direction',
        'maintenanceIncluded': 'maintenance_included',
        'commercialType': 'commercial_type',
        'businessType': 'business_type',
        'estimatedFootfall': 'estimated_footfall',
        'operatingHours': 'operating_hours',
        'leaseType': 'lease_type',
        'leaseTerm': 'lease_terms',
        'leaseTerms': 'lease_terms',
        'renewableOption': 'renewable_option',
        'zoningType': 'zoning_type',
        'fitOut': 'fit_out',
        'ceilingHeight': 'ceiling_height',
        'frontageWidth': 'frontage_width',
        'powerLoadCapacity': 'power_load_capacity',
        'nearbyPlaces': 'nearby_places',
        'nearbyConnectivity': 'nearby_connectivity',
        'interiorFeatures': 'interior_features',
        'applianceIncluded': 'appliance_included',
        'rentalTerm': 'rental_term',
        'rentalFrequency': 'rental_frequency',
        'minimumStayDuration': 'minimum_stay_duration',
        'paymentFrequency': 'payment_frequency',
        'hostelType': 'hostel_type',
        'roomType': 'room_type',
        'sharingType': 'sharing_type',
        'totalCapacity': 'total_capacity',
        'hostelCategory': 'hostel_category',
        'genderType': 'gender_type',
        'foodIncluded': 'food_included',
        'foodType': 'food_type',
        'mealsPerDay': 'meals_per_day',
        'kitchenAccess': 'kitchen_access',
        'bathroomType': 'bathroom_type',
        'utilitiesIncluded': 'utilities_included',
        'alcoholAllowed': 'alcohol_allowed',
        'landArea': 'land_area',
        'landAreaMin': 'land_area_min',
        'landAreaMax': 'land_area_max',
        'areaUnit': 'area_unit',
        'landShape': 'land_shape',
        'roadWidth': 'road_width',
        'waterSource': 'water_source',
        'soilType': 'soil_type',
        'electricityAvailable': 'electricity_available',
        'selectedFeature': 'selected_feature',
        'paymentMode': 'payment_mode',
        'constructionStatus': 'construction_status',
        'possessionTimeline': 'possession_timeline',
        'readyToBuy': 'ready_to_buy',
        'subCategory': 'sub_category',

        # ---- alias variants the posting-form wizards actually emit ----
        # (see src/components/Forms/**/*.jsx - each family names things slightly
        # differently; all of them must land on the same DB column as the filters).
        'purpose': 'listing_purpose',
        'rentPrice': 'expected_price',
        'sellPrice': 'expected_price',
        'furnishing': 'furnishing_status',
        'furnishingType': 'furnishing_status',
        'propertyArea': 'area',
        'propertyLandmark': 'landmark',
        'landCity': 'city',
        'landAddress': 'address',
        'landTitle': 'property_title',
        'landType': 'property_type',
        'landCategory': 'sub_category',
        'landFacing': 'facing_direction',
        'officeCity': 'city',
        'officeDistrict': 'district',
        'officeState': 'state',
        'officePinCode': 'pin_code',
        'officeLandmark': 'landmark',
        'rentNegotiable': 'price_negotiable',
        'priceNegotiable': 'price_negotiable',
        'sellPriceNegotiable': 'price_negotiable',
        'leaseNegotiable': 'price_negotiable',
        'maintenanceCharges': 'maintenance_amount',
        'numberOfRooms': 'bedrooms',
        'numberOfBathrooms': 'bathrooms',
        'minStayDuration': 'minimum_stay_duration',
        'minimumRentalDuration': 'minimum_duration',
        'rentalDuration': 'minimum_duration',
        'selectedFeatures': 'selected_feature',
        'appliancesIncluded': 'appliance_included',
        'footfall': 'estimated_footfall',
        'readyToMove': 'ready_to_buy',
        'occupancyDetails': 'tenant_type',
        'ageGroup': 'property_age',
        'yearsOfExperience': 'experience',
        'companyProfile': 'company_description',
        'authFullName': 'name',
        'authDesignation': 'designation',
        'authMobile': 'mobile',
        'authEmail': 'email',
        'authWhatsapp': 'whatsapp_number',
    }
    
    # Default values for missing fields
    DEFAULTS = {
        'property_condition': 'Good',
        'ownership_type': 'Freehold',
        'price_negotiable': 'Negotiable'
    }
    
    # Fields that should be arrays
    ARRAY_FIELDS = [
        'preferred_contact_method', 'amenities', 'tenant_type',
        'service_area', 'interior_features', 'appliance_included',
        'room_type', 'sharing_type', 'selected_feature'
    ]
    
    # Date fields
    DATE_FIELDS = [
        'available_from', 'date_of_birth', 'signature_date'
    ]
    
    # Boolean fields
    BOOLEAN_FIELDS = ['declaration_accepted']
    
    # Integer fields
    INTEGER_FIELDS = [
        'bedrooms', 'bathrooms', 'floor_number', 'total_floors',
        'property_age', 'total_capacity', 'land_area', 'land_area_min',
        'land_area_max', 'road_width', 'parking_capacity', 'experience',
        'active_listing'
    ]
    
    # Float fields
    FLOAT_FIELDS = [
        'expected_price', 'price_min', 'price_max', 'maintenance_amount',
        'security_deposit', 'built_up_area', 'carpet_area'
    ]
    
    # Frontend keys that carry a {min, max} range object which needs to be split
    # into two DB columns instead of mapped 1:1.
    RANGE_FIELD_TARGETS = {
        'budgetRange': ('price_min', 'price_max'),
        'monthlyRentBudget': ('price_min', 'price_max'),
        'leaseBudget': ('price_min', 'price_max'),
        'plotSize': ('land_area_min', 'land_area_max'),
        'landAreaRange': ('land_area_min', 'land_area_max'),
    }

    def map_frontend_to_db_fields(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Map frontend field names to database field names
        """
        mapped_data = {}

        for key, value in data.items():
            if key in self.RANGE_FIELD_TARGETS and isinstance(value, dict):
                min_field, max_field = self.RANGE_FIELD_TARGETS[key]
                if value.get('min') not in (None, ''):
                    mapped_data[min_field] = self._convert_float(value.get('min'))
                if value.get('max') not in (None, ''):
                    mapped_data[max_field] = self._convert_float(value.get('max'))
                continue
            if key in self.FIELD_MAPPING:
                db_field = self.FIELD_MAPPING[key]
                mapped_data[db_field] = self._convert_value(db_field, value)
            else:
                # Pass through unmapped fields
                mapped_data[key] = value

        self._set_defaults(mapped_data)
        return mapped_data
    
    def _convert_value(self, field: str, value: Any) -> Any:
        """Convert value to appropriate database type"""
        if value is None:
            return None
        
        # Handle date fields
        if field in self.DATE_FIELDS:
            return self._convert_date(value)
        
        # Handle boolean fields
        if field in self.BOOLEAN_FIELDS:
            return self._convert_boolean(value)
        
        # Handle array fields
        if field in self.ARRAY_FIELDS:
            return self._convert_array(value)
        
        # Handle integer fields
        if field in self.INTEGER_FIELDS:
            return self._convert_integer(value)
        
        # Handle float fields
        if field in self.FLOAT_FIELDS:
            return self._convert_float(value)
        
        # Special handling for enum-like fields
        if field in ['posted_by', 'listing_purpose', 'property_category']:
            return value.upper() if isinstance(value, str) else value
        
        # Special handling for yes/no string fields
        if field in ['parking', 'pet_friendly', 'terrace', 'balcony', 'garden_space',
                     'immediate_move_in', 'maintenance_included', 'title_deed_verify',
                     'underconstruction', 'immediate_possession', 'rera_approved',
                     'loan_eligible', 'loan_outstanding', 'corner_unit', 'smoking_allowed',
                     'renewable_option', 'ready_to_buy', 'electricity_available',
                     'utilities_included', 'alcohol_allowed', 'food_included']:
            return value if isinstance(value, str) else str(value)
        
        return value
    
    def _convert_date(self, value: Any) -> Optional[date]:
        """Convert to date object"""
        if value is None:
            return None
        if isinstance(value, date):
            return value
        if isinstance(value, datetime):
            return value.date()
        if isinstance(value, str) and value.strip():
            try:
                return datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                try:
                    return datetime.strptime(value, '%m/%d/%Y').date()
                except ValueError:
                    try:
                        return datetime.strptime(value, '%d-%m-%Y').date()
                    except ValueError:
                        return None
        return None
    
    def _convert_boolean(self, value: Any) -> bool:
        """Convert to boolean"""
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.lower() in ['true', 'yes', '1', 'y']
        return bool(value)
    
    def _convert_array(self, value: Any) -> List[Any]:
        """Convert to list"""
        if value is None:
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return [item.strip() for item in value.split(',') if item.strip()]
        return [value]
    
    def _convert_integer(self, value: Any) -> Optional[int]:
        """Convert to integer"""
        if value is None:
            return None
        if isinstance(value, bool):
            return None
        if isinstance(value, int):
            return value
        if isinstance(value, float):
            return int(value)
        if isinstance(value, str):
            try:
                digits = ''.join(filter(str.isdigit, value))
                return int(digits) if digits else None
            except (ValueError, TypeError):
                return None
        return None
    
    def _convert_float(self, value: Any) -> Optional[float]:
        """Convert to float"""
        if value is None:
            return None
        if isinstance(value, bool):
            return None
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            try:
                cleaned = ''.join(c for c in value if c.isdigit() or c == '.')
                return float(cleaned) if cleaned else None
            except (ValueError, TypeError):
                return None
        return None
    
    def _set_defaults(self, data: Dict[str, Any]) -> None:
        """Set default values for missing fields"""
        for field, default in self.DEFAULTS.items():
            if field not in data or data[field] is None or data[field] == '':
                data[field] = default
        
        # Ensure array fields are lists
        for field in self.ARRAY_FIELDS:
            if field not in data or data[field] is None:
                data[field] = []
            elif isinstance(data[field], str):
                data[field] = [data[field]]