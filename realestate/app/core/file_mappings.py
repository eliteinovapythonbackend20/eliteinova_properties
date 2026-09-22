# app/core/file_mappings.py

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

    # Hostel-specific property documents (new - previously unmapped, fell through
    # as the raw camelCase key instead of a clean snake_case doc_type)
    'healthCertificate': 'health_certificate',
    'hostelLicense': 'hostel_license',

    # Other new property documents
    'ownershipDoc': 'ownership_document',
    'saleAgreement': 'sale_agreement',

    # New vendor document (generic ID proof, distinct from aadhaar/PAN)
    'idProofDoc': 'id_proof',

    # ---- alias variants the posting-form wizards actually emit for document
    # fields that already have a canonical type above (see
    # src/components/Forms/**/*.jsx - each family/step names the same document
    # slightly differently) ----
    'authIdProof': 'authorized_signatory_id_proof',
    'aadhaarCardDoc': 'aadhaar_card',
    'panCardDoc': 'pan_card',
    'profilePhotoDoc': 'passport_photo',
    'gstCert': 'gst_certificate',
    'gstCertDoc': 'gst_certificate',
    'gstCertificateDoc': 'gst_certificate',
    'pmGstCert': 'gst_certificate',
    'pmGstCertDoc': 'gst_certificate',
    'reraCert': 'rera_certificate',
    'reraCertDoc': 'rera_certificate',
    'reraCertificateDoc': 'rera_certificate',
    'pmReraCert': 'rera_certificate',
    'pmReraCertDoc': 'rera_certificate',
    'businessRegistrationDoc': 'business_registration_certificate',
    'pmBusinessRegCert': 'business_registration_certificate',
    'pmBusinessRegCertDoc': 'business_registration_certificate',
    'companyRegCert': 'company_registration_certificate',
    'companyRegCertDoc': 'company_registration_certificate',
    'officeAddressProof': 'company_address_proof',
    'officeAddressProofDoc': 'company_address_proof',
    'companyLogoDoc': 'company_logo',
    'pmCompanyLogoDoc': 'company_logo',
    'companyBrochure': 'company_profile_brochure',
    'pmCompanyBrochure': 'company_profile_brochure',
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
    'idProofDoc': {
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