# # app/core/file_mappings.py

# # ============================================
# # FILE MAPPINGS - Shared between controllers
# # ============================================

# DOC_TYPE_MAPPING = {
#     # Identity Documents
#     'aadhaarCard': 'aadhaar_card',
#     'panCard': 'pan_card',
#     'passportPhoto': 'passport_photo',
    
#     # Property Documents
#     'pattaChitta': 'patta_chitta',
#     'saleDeed': 'sale_deed',
#     'rentalAgreement': 'rental_agreement',
#     'propertyTaxReceipt': 'property_tax_receipt',
#     'encumbranceCertificate': 'encumbrance_certificate',
#     'occupancyCertificate': 'occupancy_certificate',
#     'completionCertificate': 'completion_certificate',
#     'buildingApprovalPlan': 'building_approval_plan',
#     'floorPlan': 'floor_plan',
#     'otherSupportingDocs': 'other_supporting_document',
    
#     # Agency/Company Documents
#     'agencyLogo': 'agency_logo',
#     'gstCertificate': 'gst_certificate',
#     'businessRegistrationCertificate': 'business_registration_certificate',
#     'reraCertificate': 'rera_certificate',
#     'leaseAgreement': 'lease_agreement',
#     'tradeLicense': 'trade_license',
#     'fireSafetyCertificate': 'fire_safety_certificate',
#     'companyLogo': 'company_logo',
#     'companyProfileBrochure': 'company_profile_brochure',
#     'companyPanCard': 'company_pan_card',
#     'companyRegistrationCertificate': 'company_registration_certificate',
#     'companyAddressProof': 'company_address_proof',
#     'projectBrochure': 'project_brochure',
#     'authorizedSignatoryIdProof': 'authorized_signatory_id_proof',
# }

# FILE_MAPPINGS = {
#     # Profile Images
#     'profilePhoto': {'category': 'images', 'is_document': False, 'is_profile': True},
#     'agencyLogo': {'category': 'images', 'is_document': False, 'is_profile': True},
#     'companyLogo': {'category': 'images', 'is_document': False, 'is_profile': True},
    
#     # Property Images
#     'coverImage': {'category': 'images', 'is_document': False, 'is_profile': False},
#     'propertyImages': {'category': 'images', 'is_document': False, 'is_profile': False},
#     'passportPhoto': {'category': 'images', 'is_document': False, 'is_profile': True},
    
#     # Videos
#     'propertyVideo': {'category': 'video', 'is_document': False, 'is_profile': False},
    
#     # Identity Documents (Profile)
#     'aadhaarCard': {'category': 'documents', 'is_document': True, 'is_profile': True},
#     'panCard': {'category': 'documents', 'is_document': True, 'is_profile': True},
#     'businessRegistrationCertificate': {'category': 'documents', 'is_document': True, 'is_profile': True},
#     'reraCertificate': {'category': 'documents', 'is_document': True, 'is_profile': True},
#     'gstCertificate': {'category': 'documents', 'is_document': True, 'is_profile': True},
    
#     # Property Documents
#     'pattaChitta': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'saleDeed': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'rentalAgreement': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'propertyTaxReceipt': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'encumbranceCertificate': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'occupancyCertificate': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'completionCertificate': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'buildingApprovalPlan': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'floorPlan': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'otherSupportingDocs': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'companyProfileBrochure': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'companyPanCard': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'companyRegistrationCertificate': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'companyAddressProof': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'projectBrochure': {'category': 'documents', 'is_document': True, 'is_profile': False},
#     'authorizedSignatoryIdProof': {'category': 'documents', 'is_document': True, 'is_profile': False},
# }

# # Fields that are always primary images
# PRIMARY_IMAGE_FIELDS = ['coverImage', 'passportPhoto', 'agencyLogo', 'companyLogo', 'profilePhoto']





# app/core/file_mappings.py

# ============================================
# DOCUMENT TYPE MAPPING (Frontend → DB)
# ============================================

DOC_TYPE_MAPPING = {
    # Identity Documents
    'aadhaarCard': 'aadhaar_card',
    'panCard': 'pan_card',
    'passportPhoto': 'passport_photo',
    
    # Property Documents
    'pattaChitta': 'patta_chitta',
    'saleDeed': 'sale_deed',
    'rentalAgreement': 'rental_agreement',
    'propertyTaxReceipt': 'property_tax_receipt',
    'encumbranceCertificate': 'encumbrance_certificate',
    'occupancyCertificate': 'occupancy_certificate',
    'completionCertificate': 'completion_certificate',
    'buildingApprovalPlan': 'building_approval_plan',
    'floorPlan': 'floor_plan',
    'otherSupportingDocs': 'other_supporting_document',
    
    # Agency/Company Documents
    'agencyLogo': 'agency_logo',
    'gstCertificate': 'gst_certificate',
    'businessRegistrationCertificate': 'business_registration_certificate',
    'reraCertificate': 'rera_certificate',
    'leaseAgreement': 'lease_agreement',
    'tradeLicense': 'trade_license',
    'fireSafetyCertificate': 'fire_safety_certificate',
    'companyLogo': 'company_logo',
    'companyProfileBrochure': 'company_profile_brochure',
    'companyPanCard': 'company_pan_card',
    'companyRegistrationCertificate': 'company_registration_certificate',
    'companyAddressProof': 'company_address_proof',
    'projectBrochure': 'project_brochure',
    'authorizedSignatoryIdProof': 'authorized_signatory_id_proof',
}

# ============================================
# FILE MAPPINGS (Your Existing Structure - Keep As-Is)
# ============================================

FILE_MAPPINGS = {
    # ============================================
    # VENDOR PROFILE IMAGES (category: images, is_profile: True)
    # → Stored in vendor-specific tables
    # ============================================
    'profilePhoto': {
        'category': 'images',
        'is_document': False,
        'is_profile': True
    },
    'passportPhoto': {
        'category': 'images',
        'is_document': False,
        'is_profile': True
    },
    'agencyLogo': {
        'category': 'images',
        'is_document': False,
        'is_profile': True
    },
    'companyLogo': {
        'category': 'images',
        'is_document': False,
        'is_profile': True
    },
    
    # ============================================
    # PROPERTY IMAGES (category: images, is_profile: False)
    # → Stored in PropertyMedia table
    # ============================================
    'coverImage': {
        'category': 'images',
        'is_document': False,
        'is_profile': False
    },
    'propertyImages': {
        'category': 'images',
        'is_document': False,
        'is_profile': False
    },
    
    # ============================================
    # PROPERTY VIDEO (category: video, is_profile: False)
    # → Stored in PropertyMedia table
    # ============================================
    'propertyVideo': {
        'category': 'video',
        'is_document': False,
        'is_profile': False
    },
    
    # ============================================
    # VENDOR DOCUMENTS (category: documents, is_profile: True)
    # → Stored in PropertyDocument with property_id = NULL
    # ============================================
    'aadhaarCard': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'panCard': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'gstCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'businessRegistrationCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'reraCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'tradeLicense': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'fireSafetyCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'companyPanCard': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'companyRegistrationCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'companyAddressProof': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    'authorizedSignatoryIdProof': {
        'category': 'documents',
        'is_document': True,
        'is_profile': True
    },
    
    # ============================================
    # PROPERTY DOCUMENTS (category: documents, is_profile: False)
    # → Stored in PropertyDocument with property_id = property_id
    # ============================================
    'pattaChitta': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'saleDeed': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'rentalAgreement': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'propertyTaxReceipt': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'encumbranceCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'occupancyCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'completionCertificate': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'buildingApprovalPlan': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'floorPlan': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'otherSupportingDocs': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'companyProfileBrochure': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'projectBrochure': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
    'leaseAgreement': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },

    # ============================================
    # GENERIC BUCKETS (category matches, no is_profile split)
    # → What the live create/update property endpoint actually sends:
    #   images / video / documents. Per-item vendor-vs-property and doc-type
    #   routing for 'documents' is resolved in FileExtractionService using the
    #   parallel `document_types` list, not this static mapping.
    # ============================================
    'images': {
        'category': 'images',
        'is_document': False,
        'is_profile': False
    },
    'video': {
        'category': 'video',
        'is_document': False,
        'is_profile': False
    },
    'documents': {
        'category': 'documents',
        'is_document': True,
        'is_profile': False
    },
}

# ============================================
# FIELDS THAT ARE ALWAYS PRIMARY IMAGES
# ============================================

PRIMARY_IMAGE_FIELDS = ['coverImage', 'passportPhoto', 'agencyLogo', 'companyLogo', 'profilePhoto']

# ============================================
# HELPER FUNCTIONS (For Controller & Service)
# ============================================

def get_file_mapping(field_name: str) -> dict:
    """Get the file mapping for a field"""
    return FILE_MAPPINGS.get(field_name, {})


def get_field_category(field_name: str) -> str:
    """Get the category of a field: 'images', 'documents', 'video'"""
    return FILE_MAPPINGS.get(field_name, {}).get('category', 'unknown')


def is_vendor_profile_image(field_name: str) -> bool:
    """Check if field is a vendor profile image"""
    mapping = FILE_MAPPINGS.get(field_name, {})
    return mapping.get('category') == 'images' and mapping.get('is_profile') is True


def is_property_image(field_name: str) -> bool:
    """Check if field is a property image"""
    mapping = FILE_MAPPINGS.get(field_name, {})
    return mapping.get('category') == 'images' and mapping.get('is_profile') is False


def is_property_video(field_name: str) -> bool:
    """Check if field is a property video"""
    return FILE_MAPPINGS.get(field_name, {}).get('category') == 'video'


def is_vendor_document(field_name: str) -> bool:
    """Check if field is a vendor document"""
    mapping = FILE_MAPPINGS.get(field_name, {})
    return mapping.get('category') == 'documents' and mapping.get('is_profile') is True


def is_property_document(field_name: str) -> bool:
    """Check if field is a property document"""
    mapping = FILE_MAPPINGS.get(field_name, {})
    return mapping.get('category') == 'documents' and mapping.get('is_profile') is False


def is_document_file(field_name: str) -> bool:
    """Check if field is any type of document"""
    return FILE_MAPPINGS.get(field_name, {}).get('is_document', False)


def is_image_file(field_name: str) -> bool:
    """Check if field is any type of image"""
    return FILE_MAPPINGS.get(field_name, {}).get('category') == 'images'


def get_document_type(field_name: str) -> str:
    """Get document type from frontend field name"""
    return DOC_TYPE_MAPPING.get(field_name, 'other_supporting_document')


def get_file_category_label(field_name: str) -> str:
    """Get human-readable category label"""
    if is_vendor_profile_image(field_name):
        return 'Vendor Profile Image'
    elif is_vendor_document(field_name):
        return 'Vendor Document'
    elif is_property_document(field_name):
        return 'Property Document'
    elif is_property_image(field_name):
        return 'Property Image'
    elif is_property_video(field_name):
        return 'Property Video'
    else:
        return 'Unknown'


# ============================================
# CATEGORY LISTS (For iteration)
# ============================================

VENDOR_PROFILE_IMAGE_FIELDS = [
    field for field, mapping in FILE_MAPPINGS.items()
    if mapping.get('category') == 'images' and mapping.get('is_profile') is True
]

PROPERTY_IMAGE_FIELDS = [
    field for field, mapping in FILE_MAPPINGS.items()
    if mapping.get('category') == 'images' and mapping.get('is_profile') is False
]

VENDOR_DOCUMENT_FIELDS = [
    field for field, mapping in FILE_MAPPINGS.items()
    if mapping.get('category') == 'documents' and mapping.get('is_profile') is True
]

PROPERTY_DOCUMENT_FIELDS = [
    field for field, mapping in FILE_MAPPINGS.items()
    if mapping.get('category') == 'documents' and mapping.get('is_profile') is False
]

PROPERTY_VIDEO_FIELDS = [
    field for field, mapping in FILE_MAPPINGS.items()
    if mapping.get('category') == 'video'
]

# Vendor profile image to DB column mapping (for vendor tables)
VENDOR_PROFILE_IMAGE_TO_DB_COLUMN = {
    'profilePhoto': 'profile_photo_url',
    'passportPhoto': 'profile_photo_url',
    'agencyLogo': 'agency_logo_url',
    'companyLogo': 'company_logo_url',
}

# Snake_case doc-type values that belong to the vendor (KYC/company docs), derived
# from FILE_MAPPINGS itself so there's one source of truth. Used to split the
# generic 'documents' bucket per-item into vendor_documents vs property_documents.
VENDOR_DOCUMENT_TYPES = {
    DOC_TYPE_MAPPING[field] for field, mapping in FILE_MAPPINGS.items()
    if mapping.get('category') == 'documents'
    and mapping.get('is_profile') is True
    and field in DOC_TYPE_MAPPING
}