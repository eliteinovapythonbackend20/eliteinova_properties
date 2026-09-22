










































// src/services/profileService.js

import axiosInstance from '../api/axiosInstance';

const DOCUMENT_MAPPINGS = {
  vendor: {
    'aadhaarCard': {
      docType: 'aadhaar_card',
      isPropertyDocument: false,
      description: 'User Aadhaar Card for verification'
    },
    'panCard': {
      docType: 'pan_card',
      isPropertyDocument: false,
      description: 'User PAN Card for verification'
    },
    'passportPhoto': {
      docType: 'passport_photo',
      isPropertyDocument: false,
      description: 'User Profile Photo'
    },
    'profilePhoto': {
      docType: 'profile_photo',
      isPropertyDocument: false,
      description: 'User Profile Photo'
    },
    'agencyLogo': {
      docType: 'agency_logo',
      isPropertyDocument: false,
      description: 'Agency/Company Logo'
    },
    'companyLogo': {
      docType: 'company_logo',
      isPropertyDocument: false,
      description: 'Company Logo'
    },
    // The "Legal Documents" grid on every profile page always calls
    // uploadDocument/deleteDocument with propertyId: null ("Vendor
    // documents have no property ID" per those call sites) - these belong
    // here, not in a property-scoped bucket, or getDocumentContext would
    // throw "Property ID required" before any request is even made.
    'saleDeed': {
      docType: 'sale_deed',
      isPropertyDocument: false,
      description: 'Property Sale Deed'
    },
    'floorPlanOptional': {
      docType: 'floor_plan',
      isPropertyDocument: false,
      description: 'Property Floor Plan'
    },
    'pattaChitta': {
      docType: 'patta_chitta',
      isPropertyDocument: false,
      description: 'Property Patta/Chitta'
    },
    'encumbranceCertificate': {
      docType: 'encumbrance_certificate',
      isPropertyDocument: false,
      description: 'Property Encumbrance Certificate'
    },
    'propertyTaxReceipt': {
      docType: 'property_tax_receipt',
      isPropertyDocument: false,
      description: 'Property Tax Receipt'
    },
    'buildingApprovalPlan': {
      docType: 'building_approval_plan',
      isPropertyDocument: false,
      description: 'Building Approval Plan'
    },
    'completionCertificate': {
      docType: 'completion_certificate',
      isPropertyDocument: false,
      description: 'Completion Certificate'
    },
    'occupancyCertificate': {
      docType: 'occupancy_certificate',
      isPropertyDocument: false,
      description: 'Occupancy Certificate'
    },
    'rentalAgreement': {
      docType: 'rental_agreement',
      isPropertyDocument: false,
      description: 'Rental Agreement'
    },
    'otherDocuments': {
      docType: 'other_supporting_document',
      isPropertyDocument: false,
      description: 'Other Supporting Document'
    },
  },

  property: {}
};


export const getMyProfile = async (role) => {
  try {
    const response = await axiosInstance.get(`/profile/${role}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${role} profile:`, error);
    throw error;
  }
};


export const updateMyProfile = async (role, updateData) => {
  try {
    const response = await axiosInstance.put(`/profile/${role}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ${role} profile:`, error);
    throw error;
  }
};

export const uploadProfilePhoto = async (role, file) => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await axiosInstance.post(`/profile/${role}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload profile photo:', error);
    throw error;
  }
};


export const deleteProfilePhoto = async (role) => {
  try {
    const response = await axiosInstance.delete(`/profile/${role}/photo`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete profile photo:', error);
    throw error;
  }
};


export const uploadVendorLogo = async (role, file) => {
  try {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await axiosInstance.post(`/profile/${role}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload vendor logo:', error);
    throw error;
  }
};


export const deleteVendorLogo = async (role) => {
  try {
    const response = await axiosInstance.delete(`/profile/${role}/logo`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete vendor logo:', error);
    throw error;
  }
};


export const uploadVendorDocument = async (role, docType, file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    const response = await axiosInstance.post(
      `/profile/${role}/documents/${docType}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to upload vendor document ${docType}:`, error);
    throw error;
  }
};


export const getVendorDocument = async (role, docType) => {
  try {
    const response = await axiosInstance.get(`/profile/${role}/documents/${docType}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get vendor document ${docType}:`, error);
    throw error;
  }
};


export const deleteVendorDocument = async (role, docType) => {
  try {
    const response = await axiosInstance.delete(`/profile/${role}/documents/${docType}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete vendor document ${docType}:`, error);
    throw error;
  }
};


export const getVendorDocuments = async (role) => {
  try {
    const response = await axiosInstance.get(`/profile/${role}/documents`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vendor documents:', error);
    throw error;
  }
};


const VENDOR_DOC_TYPE_TO_FIELD = Object.fromEntries(
  Object.entries(DOCUMENT_MAPPINGS.vendor).map(([field, cfg]) => [cfg.docType, field])
);

// Same data as getVendorDocuments, keyed by the form field name
// (saleDeed, pattaChitta, ...) instead of the backend's doc_type string, so
// profile pages can drop the result straight into their `documents` state.
// Fields with no DOCUMENT_MAPPINGS.vendor entry (e.g. Builder/PM's reraCert,
// companyRegCert, ...) fall through getDocumentContext's own "unknown
// field" default, which uploads using the field name itself as docType -
// so on the way back, an unrecognized docType IS the field name.
export const getVendorDocumentsByField = async (role) => {
  const response = await getVendorDocuments(role);
  const byDocType = response?.data || {};
  const byField = {};
  Object.entries(byDocType).forEach(([docType, meta]) => {
    const field = VENDOR_DOC_TYPE_TO_FIELD[docType] || docType;
    byField[field] = meta;
  });
  return byField;
};

// Vendor documents are private - there's never a permanent URL to display.
// Call this only when the user clicks "view", and use the URL immediately.
export const getVendorDocumentViewUrl = async (role, field) => {
  try {
    const docType = DOCUMENT_MAPPINGS.vendor[field]?.docType || field;
    const response = await axiosInstance.get(`/profile/${role}/documents/${docType}/view-url`);
    return response.data?.data?.viewUrl;
  } catch (error) {
    console.error(`Failed to get view URL for document ${field}:`, error);
    throw error;
  }
};


export const uploadPropertyDocument = async (role, propertyId, docType, file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    const response = await axiosInstance.post(
      `/profile/${role}/properties/${propertyId}/documents/${docType}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to upload property document ${docType}:`, error);
    throw error;
  }
};

export const getPropertyDocument = async (role, propertyId, docType) => {
  try {
    const response = await axiosInstance.get(
      `/profile/${role}/properties/${propertyId}/documents/${docType}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to get property document ${docType}:`, error);
    throw error;
  }
};


export const deletePropertyDocument = async (role, propertyId, docType) => {
  try {
    const response = await axiosInstance.delete(
      `/profile/${role}/properties/${propertyId}/documents/${docType}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to delete property document ${docType}:`, error);
    throw error;
  }
};


export const getPropertyDocuments = async (role, propertyId) => {
  try {
    const response = await axiosInstance.get(
      `/profile/${role}/properties/${propertyId}/documents`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch property documents:', error);
    throw error;
  }
};

// The property-document endpoints above target /profile/{role}/... which
// doesn't exist on the backend - property documents (floor plan, sale deed,
// etc. picked in the property Edit form) actually live under the properties
// router, not the profile router: POST/DELETE /properties/{property_id}/documents.
export const addPropertyDocuments = async (propertyId, files, documentTypes = []) => {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    if (documentTypes.length > 0) {
      formData.append('document_types', documentTypes.join(','));
    }
    const response = await axiosInstance.post(
      `/properties/${propertyId}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add property documents:', error);
    throw error;
  }
};

export const deletePropertyDocumentById = async (propertyId, documentId) => {
  try {
    const response = await axiosInstance.delete(`/properties/${propertyId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete property document:', error);
    throw error;
  }
};


export const getDocumentContext = (field, propertyId = null) => {
  // Check vendor documents first
  if (DOCUMENT_MAPPINGS.vendor[field]) {
    return {
      type: 'vendor',
      docType: DOCUMENT_MAPPINGS.vendor[field].docType,
      isPropertyDocument: false,
      propertyId: null,
      description: DOCUMENT_MAPPINGS.vendor[field].description
    };
  }
  
  // Check property documents
  if (DOCUMENT_MAPPINGS.property[field]) {
    if (!propertyId) {
      console.warn(`⚠️ Property document '${field}' requires a propertyId`);
    }
    return {
      type: 'property',
      docType: DOCUMENT_MAPPINGS.property[field].docType,
      isPropertyDocument: true,
      propertyId: propertyId || null,
      description: DOCUMENT_MAPPINGS.property[field].description
    };
  }
  
  // Default to vendor if not recognized
  console.warn(`⚠️ Unknown document field '${field}', defaulting to vendor document`);
  return {
    type: 'vendor',
    docType: field,
    isPropertyDocument: false,
    propertyId: null,
    description: 'Unknown Document'
  };
};

export const uploadDocument = async ({ role, field, file, propertyId = null }) => {
  const context = getDocumentContext(field, propertyId);
  
  console.log(`📄 Uploading document:`, {
    field,
    type: context.type,
    isPropertyDocument: context.isPropertyDocument,
    propertyId: context.propertyId,
    docType: context.docType
  });
  
  if (context.type === 'vendor') {
    // Upload as vendor document (is_propertydocument = false)
    return await uploadVendorDocument(role, context.docType, file);
  } else {
    // Upload as property document (is_propertydocument = true)
    if (!context.propertyId) {
      throw new Error(`❌ Property ID required for document: ${field}`);
    }
    return await uploadPropertyDocument(role, context.propertyId, context.docType, file);
  }
};


export const deleteDocument = async ({ role, field, propertyId = null }) => {
  const context = getDocumentContext(field, propertyId);
  
  console.log(`🗑️ Deleting document:`, {
    field,
    type: context.type,
    isPropertyDocument: context.isPropertyDocument,
    propertyId: context.propertyId
  });
  
  if (context.type === 'vendor') {
    return await deleteVendorDocument(role, context.docType);
  } else {
    if (!context.propertyId) {
      throw new Error(`❌ Property ID required for document: ${field}`);
    }
    return await deletePropertyDocument(role, context.propertyId, context.docType);
  }
};


export const getVendorProperties = async (role, { page = 1, limit = 20, status = null } = {}) => {
  try {
    let url = `/profile/${role}/properties?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    throw error;
  }
};

export const searchVendorProperties = async (role, query, { page = 1, limit = 20 } = {}) => {
  try {
    const response = await axiosInstance.get(`/profile/${role}/properties/search`, {
      params: { q: query, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to search properties:', error);
    throw error;
  }
};


export const getVendorPropertyDetail = async (role, propertyId) => {
  try {
    const response = await axiosInstance.get(`/profile/${role}/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch property detail:', error);
    throw error;
  }
};

export const updateVendorProperty = async (role, propertyId, updateData) => {
  try {
    const response = await axiosInstance.put(`/profile/${role}/properties/${propertyId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update property:', error);
    throw error;
  }
};

export const deleteVendorProperty = async (role, propertyId) => {
  try {
    const response = await axiosInstance.delete(`/profile/${role}/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete property:', error);
    throw error;
  }
};

export const updateVendorPropertyStatus = async (role, propertyId, status) => {
  try {
    const response = await axiosInstance.patch(
      `/profile/${role}/properties/${propertyId}/status`,
      { "status":status }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update property status:', error);
    throw error;
  }
};


export const uploadPropertyImage = async (role, propertyId, file, order = 0, isCover = false) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post(
      `/profile/${role}/properties/${propertyId}/images?order=${order}&is_cover=${isCover}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload property image:', error);
    throw error;
  }
};

export const deletePropertyImage = async (role, propertyId, imageIndex) => {
  try {
    const response = await axiosInstance.delete(
      `/profile/${role}/properties/${propertyId}/images/${imageIndex}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete property image:', error);
    throw error;
  }
};


export const setPropertyCover = async (role, propertyId, mediaId) => {
  try {
    const response = await axiosInstance.post(
      `/profile/${role}/properties/${propertyId}/cover`,
      { media_id: mediaId }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to set property cover:', error);
    throw error;
  }
};


export const uploadPropertyVideo = async (role, propertyId, file) => {
  try {
    const formData = new FormData();
    formData.append('video', file);
    const response = await axiosInstance.post(
      `/profile/${role}/properties/${propertyId}/video`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload property video:', error);
    throw error;
  }
};

export const deletePropertyVideo = async (role, propertyId) => {
  try {
    const response = await axiosInstance.delete(
      `/profile/${role}/properties/${propertyId}/video`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete property video:', error);
    throw error;
  }
};

export const mapPropertyToFrontend = (backendProperty) => {
  if (!backendProperty) return null;
  
  // Get images from the property (excluding any video entry mixed into the
  // same media array - it has no img-renderable frame and was showing up as
  // an extra empty thumbnail in property card galleries).
  const images = backendProperty.images || [];
  const imageUrls = images
    .filter(img => {
      if (typeof img === 'string') return !img.includes('video');
      return img?.mediaType !== 'video' && !img?.fileUrl?.includes('video');
    })
    .map(img => img.fileUrl || img)
    .filter(Boolean);

  // Video URL, if the property has one, kept separate so it can be surfaced
  // via a dedicated "watch video" control instead of the image gallery.
  const videoMedia = images.find(img => typeof img !== 'string' && (img?.mediaType === 'video' || img?.fileUrl?.includes('video')));
  const videoUrl = videoMedia ? videoMedia.fileUrl : null;
  
  // Get contactPerson details for THIS property - from whichever role-specific
  // table it was posted through (owner_properties/agent_properties/
  // builder_properties/property_management_properties). Backend normalizes all
  // four into one shape (ProfileService._get_profile_data) - profile pages only,
  // never the public card/list.
  const contactPerson = backendProperty.contactPersonDetails || {};

  // Get documents linked to this property (property_document table)
  const documents = backendProperty.documents || [];
  
  return {
    // Core property data
    id: backendProperty.id || `PROP-${Math.random().toString(36).substr(2, 9)}`,
    name: backendProperty.propertyTitle || backendProperty.name || 'Unnamed Property',
    type: backendProperty.propertyType || 'Apartment',
    // Backend sends the active/inactive flag as `status` ("Active"/"Inactive"),
    // not `propertyStatus` - populate both spellings/cases since the 4 profile
    // pages read this value under different names (Owner/Agent compare
    // propertyStatus === 'ACTIVE'; Builder/PM compare status === 'Active').
    status: backendProperty.status || 'Active',
    propertyStatus: (backendProperty.status || 'Active').toUpperCase(),
    price: backendProperty.expectedPrice ? `₹${Number(backendProperty.expectedPrice).toLocaleString()}` : '₹0',
    area: backendProperty.builtUpArea ? `${backendProperty.builtUpArea} sq ft` : 'N/A',
    location: `${backendProperty.city || ''}, ${backendProperty.state || ''}`.trim() || 'Location not specified',
    postedDate: backendProperty.createdAt ? new Date(backendProperty.createdAt).toLocaleDateString('en-IN') : 'N/A',
    description: backendProperty.description || '',
    
    // Images - coverImage and images (gallery) are separate concepts on the
    // backend now: the cover is only ever whatever is actually flagged as
    // primary. No fallback to the first gallery photo - if the cover was
    // deleted and never replaced, it stays empty rather than a gallery
    // photo getting silently promoted into the cover slot.
    images: imageUrls,
    coverImage: backendProperty.coverImage || null,
    videoUrl,
    
    // Features & Amenities
    features: backendProperty.features || backendProperty.amenities || [],
    selectedAmenities: backendProperty.amenities || [],
    
    // Property details
    bedrooms: backendProperty.bedrooms ? `${backendProperty.bedrooms} BHK` : 'N/A',
    bathrooms: backendProperty.bathrooms ? `${backendProperty.bathrooms}` : 'N/A',
    furnishing: backendProperty.furnishingStatus || 'Unfurnished',
    parking: backendProperty.parking || 'N/A',
    propertyCategory: backendProperty.propertyCategory || 'residential',
    listedBy: backendProperty.postedBy?.toLowerCase() || 'owner',
    listingPurpose: backendProperty.listingPurpose || 'For Sale',
    expectedPrice: backendProperty.expectedPrice || '',
    maintenance: backendProperty.maintenanceAmount || '',
    availableFrom: backendProperty.availableFrom || '',
    
    // Address
    propertyAddress: backendProperty.address || backendProperty.propertyAddress || '',
    propertyCity: backendProperty.city || '',
    builtUpArea: backendProperty.builtUpArea || '',
    carpetArea: backendProperty.carpetArea || '',
    propertyTitle: backendProperty.propertyTitle || backendProperty.name || '',
    propertyType: backendProperty.propertyType || 'Apartment',
    
    // Media
    propertyVideo: backendProperty.videoUrl || null,
    floorPlan: backendProperty.floorPlan || null,
    
    // Stats
    views: backendProperty.views || 0,
    inquiries: backendProperty.inquiries || 0,
    
    // Contact person for THIS property - name/mobile/email/etc always present
    // (whichever role posted it); companyName/rera/gst/experience/serviceArea/
    // socials only present for AGENT/BUILDER/PROPERTY_MANAGEMENT; dateOfBirth/
    // gender/preferredContactMethod/preferredContactTime/additionalNote only
    // for OWNER. See ProfileService._get_profile_data on the backend.
    contactPersonDetails: {
      name: contactPerson.name || '',
      mobile: contactPerson.mobile || '',
      emailId: contactPerson.emailId || '',
      profilePhotoUrl: contactPerson.profilePhotoUrl || '',
      designation: contactPerson.designation || '',
      whatsappNumber: contactPerson.whatsappNumber || '',
      dateOfBirth: contactPerson.dateOfBirth || '',
      gender: contactPerson.gender || '',
      aadhaarNumber: contactPerson.aadhaarNumber || '',
      panNumber: contactPerson.panNumber || '',
      addressLine1: contactPerson.addressLine1 || '',
      addressLine2: contactPerson.addressLine2 || '',
      officeAddress: contactPerson.officeAddress || '',
      city: contactPerson.city || '',
      district: contactPerson.district || '',
      state: contactPerson.state || '',
      pincode: contactPerson.pincode || '',
      landmark: contactPerson.landmark || '',
      companyName: contactPerson.companyName || '',
      companyLogo: contactPerson.companyLogo || '',
      companyRegNumber: contactPerson.companyRegNumber || '',
      companyWebsite: contactPerson.companyWebsite || '',
      companyProfile: contactPerson.companyProfile || '',
      reraRegistrationNumber: contactPerson.reraRegistrationNumber || '',
      gstNumber: contactPerson.gstNumber || '',
      experience: contactPerson.experience || '',
      activeListing: contactPerson.activeListing || '',
      serviceArea: contactPerson.serviceArea || [],
      website: contactPerson.website || '',
      facebook: contactPerson.facebook || '',
      instagram: contactPerson.instagram || '',
      linkedin: contactPerson.linkedin || '',
      youtube: contactPerson.youtube || '',
      bankName: contactPerson.bankName || '',
      accountHolderName: contactPerson.accountHolderName || '',
      accountNumber: contactPerson.accountNumber || '',
      ifscCode: contactPerson.ifscCode || '',
      upiId: contactPerson.upiId || '',
      preferredContactMethod: contactPerson.preferredContactMethod || [],
      preferredContactTime: contactPerson.preferredContactTime || '',
      additionalNote: contactPerson.additionalNote || '',
    },

    // Documents linked to this property (sale deed, floor plan, aadhaar, PAN, etc.)
    documents: documents.map(doc => ({
      id: doc.id,
      name: doc.fileName || doc.name || 'Document',
      url: doc.fileUrl || doc.url,
      type: doc.documentType || 'other',
      sizeKb: doc.fileSizeKb || 0,
    }))
  };
};


export const mapPropertyToBackend = (frontendProperty) => {
  if (!frontendProperty) return null;
  
  return {
    propertyTitle: frontendProperty.propertyTitle || frontendProperty.name,
    propertyType: frontendProperty.propertyType || frontendProperty.type,
    propertyCategory: frontendProperty.propertyCategory || 'INDIVIDUAL',
    status: frontendProperty.status,
    propertyStatus: frontendProperty.status,
    expectedPrice: frontendProperty.expectedPrice || frontendProperty.price?.replace(/[^0-9]/g, ''),
    builtUpArea: frontendProperty.builtUpArea,
    carpetArea: frontendProperty.carpetArea,
    city: frontendProperty.propertyCity || frontendProperty.city,
    state: frontendProperty.state,
    address: frontendProperty.propertyAddress || frontendProperty.location,
    description: frontendProperty.description,
    bedrooms: frontendProperty.bedrooms ? parseInt(frontendProperty.bedrooms) : null,
    bathrooms: frontendProperty.bathrooms ? parseInt(frontendProperty.bathrooms) : null,
    furnishingStatus: frontendProperty.furnishing,
    parking: frontendProperty.parking,
    listingPurpose: frontendProperty.listingPurpose?.toUpperCase() || 'SELL',
    maintenanceAmount: frontendProperty.maintenance,
    availableFrom: frontendProperty.availableFrom,
    amenities: frontendProperty.selectedAmenities || [],
    features: frontendProperty.features || [],
    postedBy: frontendProperty.listedBy?.toUpperCase() || 'OWNER',
  };
};


export const mapDocumentToFrontend = (doc) => {
  if (!doc) return null;
  
  return {
    id: doc.id,
    name: doc.fileName || doc.name || 'Document',
    url: doc.fileUrl || doc.url,
    type: doc.docType || doc.documentType || 'other',
    isPropertyDocument: doc.is_propertydocument || false,
    propertyId: doc.property_id || null,
    size: doc.fileSize || 0,
    createdAt: doc.createdAt || doc.created_at,
  };
};


export const getDocumentTypeInfo = (field) => {
  if (DOCUMENT_MAPPINGS.vendor[field]) {
    return {
      docType: DOCUMENT_MAPPINGS.vendor[field].docType,
      isPropertyDocument: false
    };
  }
  if (DOCUMENT_MAPPINGS.property[field]) {
    return {
      docType: DOCUMENT_MAPPINGS.property[field].docType,
      isPropertyDocument: true
    };
  }
  return {
    docType: field,
    isPropertyDocument: false
  };
};



export default {
  // Profile
  getMyProfile,
  updateMyProfile,
  
  // Profile Photo
  uploadProfilePhoto,
  deleteProfilePhoto,
  
  // Vendor Documents (is_propertydocument = false)
  uploadVendorDocument,
  getVendorDocument,
  deleteVendorDocument,
  getVendorDocuments,
  
  // Property Documents (is_propertydocument = true)
  uploadPropertyDocument,
  getPropertyDocument,
  deletePropertyDocument,
  getPropertyDocuments,
  addPropertyDocuments,
  deletePropertyDocumentById,

  // Smart Document Handler
  getDocumentContext,
  uploadDocument,
  deleteDocument,
  
  // Property CRUD
  getVendorProperties,
  searchVendorProperties,
  getVendorPropertyDetail,
  updateVendorProperty,
  deleteVendorProperty,
  updateVendorPropertyStatus,
  
  // Property Media
  uploadPropertyImage,
  deletePropertyImage,
  setPropertyCover,
  uploadPropertyVideo,
  deletePropertyVideo,
  
  // Data Mapping
  mapPropertyToFrontend,
  mapPropertyToBackend,
  mapDocumentToFrontend,
  getDocumentTypeInfo,
};