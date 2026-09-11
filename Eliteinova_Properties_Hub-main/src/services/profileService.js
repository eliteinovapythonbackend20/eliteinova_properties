










































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
  },
  
  property: {
    'saleDeed': {
      docType: 'sale_deed',
      isPropertyDocument: true,
      description: 'Property Sale Deed'
    },
    'floorPlanOptional': {
      docType: 'floor_plan',
      isPropertyDocument: true,
      description: 'Property Floor Plan'
    },
    'pattaChitta': {
      docType: 'patta_chitta',
      isPropertyDocument: true,
      description: 'Property Patta/Chitta'
    },
    'encumbranceCertificate': {
      docType: 'encumbrance_certificate',
      isPropertyDocument: true,
      description: 'Property Encumbrance Certificate'
    },
    'propertyTaxReceipt': {
      docType: 'property_tax_receipt',
      isPropertyDocument: true,
      description: 'Property Tax Receipt'
    },
    'buildingApprovalPlan': {
      docType: 'building_approval_plan',
      isPropertyDocument: true,
      description: 'Building Approval Plan'
    },
    'completionCertificate': {
      docType: 'completion_certificate',
      isPropertyDocument: true,
      description: 'Completion Certificate'
    },
    'occupancyCertificate': {
      docType: 'occupancy_certificate',
      isPropertyDocument: true,
      description: 'Occupancy Certificate'
    },
    'rentalAgreement': {
      docType: 'rental_agreement',
      isPropertyDocument: true,
      description: 'Rental Agreement'
    },
    'otherDocuments': {
      docType: 'other_supporting_document',
      isPropertyDocument: true,
      description: 'Other Supporting Document'
    },
  }
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


export const uploadPropertyImage = async (role, propertyId, file, order = 0) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post(
      `/profile/${role}/properties/${propertyId}/images?order=${order}`,
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
  
  // Get images from the property
  const images = backendProperty.images || [];
  const imageUrls = images
    .map(img => img.fileUrl || img)
    .filter(Boolean);
  
  // Get contactPerson details from owner_properties
  const contactPerson = backendProperty.contactPersonDetails || {};
  
  // Get documents
  const documents = backendProperty.documents || [];
  
  return {
    // Core property data
    id: backendProperty.id || `PROP-${Math.random().toString(36).substr(2, 9)}`,
    name: backendProperty.propertyTitle || backendProperty.name || 'Unnamed Property',
    type: backendProperty.propertyType || 'Apartment',
    propertyStatus: backendProperty.propertyStatus,
    price: backendProperty.expectedPrice ? `₹${Number(backendProperty.expectedPrice).toLocaleString()}` : '₹0',
    area: backendProperty.builtUpArea ? `${backendProperty.builtUpArea} sq ft` : 'N/A',
    location: `${backendProperty.city || ''}, ${backendProperty.state || ''}`.trim() || 'Location not specified',
    postedDate: backendProperty.createdAt ? new Date(backendProperty.createdAt).toLocaleDateString('en-IN') : 'N/A',
    description: backendProperty.description || '',
    
    // Images
    images: imageUrls,
    coverImage: backendProperty.coverImage || (imageUrls.length > 0 ? imageUrls[0] : null),
    
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
    
    // contactPerson/Contact details for this specific property
    contactPersonDetails: {
      ownerName: contactPerson.ownerName || '',
      mobile: contactPerson.mobile || '',
      emailId: contactPerson.emailId || '',
      profilePhotoUrl: contactPerson.profilePhotoUrl || '',
      addressLine1: contactPerson.addressLine1 || '',
      addressLine2: contactPerson.addressLine2 || '',
      ownerCity: contactPerson.ownerCity || '',
      ownerDistrict: contactPerson.ownerDistrict || '',
      ownerState: contactPerson.ownerState || '',
      ownerPinCode: contactPerson.ownerPinCode || '',
      dateOfBirth: contactPerson.dateOfBirth || '',
      gender: contactPerson.gender || '',
      aadhaarNumber: contactPerson.aadhaarNumber || '',
      panNumber: contactPerson.panNumber || '',
      bankName: contactPerson.bankName || '',
      accountHolderName: contactPerson.accountHolderName || '',
      accountNumber: contactPerson.accountNumber || '',
      ifscCode: contactPerson.ifscCode || '',
      upiId: contactPerson.upiId || '',
      preferredContactMethod: contactPerson.preferredContactMethod || [],
      preferredContactTime: contactPerson.preferredContactTime || '',
      additionalNote: contactPerson.additionalNote || '',
    },
    
    // Documents for this property
    documents: documents.map(doc => ({
      id: doc.id,
      name: doc.fileName || doc.name || 'Document',
      url: doc.fileUrl || doc.url,
      type: doc.documentType || 'other',
      isPropertyDocument: doc.is_propertydocument || false,
      propertyId: doc.property_id || null,
      size: doc.fileSize || 0,
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