// src/services/propertyService.js
import axiosInstance from '../api/axiosInstance';

// The backend expects genuine multipart/form-data: a `property_data` part holding
// the JSON-encoded scalar fields, plus `images` / `video` / `documents` file parts
// and a `document_types` part. Forms build a single plain object (scalars + File
// objects mixed) - this splits that object into the shape the API accepts.
//
// - `images`: cover image first (position 0 = primary on the backend), then the
//   rest, in whatever order the form supplied them.
// - `documents`: vendor KYC docs (aadhaar, pan, ...) and property docs (sale deed,
//   floor plan, ownership doc, ...) mixed together - `document_types` carries the
//   original field key per file, same order, so the backend can tell them apart
//   and tag each row's real document type (see file_mappings.py DOC_TYPE_MAPPING).
const buildPropertyFormData = (formData) => {
  const payload = {};
  const images = [];
  const documents = [];
  const documentTypes = [];
  const vendorImageParts = {};
  let coverImage = null;
  let video = null;

  const isDocumentKey = (key) => {
    const k = key.toLowerCase();
    return ['card', 'deed', 'certificate', 'doc', 'license', 'proof', 'brochure', 'agreement', 'receipt', 'plan', 'chitta']
      .some((needle) => k.includes(needle));
  };

  // The lister's own photo / logos sit in the same form state as the property
  // media, but they are neither property images (sent as `images` they would show
  // up in the public property gallery) nor documents. Each one has its own column
  // on the role's detail table (profile_photo_url, company_logo_url,
  // agency_logo_url), so each goes in its own named part and the backend stores
  // its public URL straight into that column. Checked first: some of these keys
  // (companyLogoDoc, ...) also contain "doc".
  const VENDOR_IMAGE_PART = {
    passportPhoto: 'profile_photo', profilePhoto: 'profile_photo', profilePhotoDoc: 'profile_photo', authPhoto: 'profile_photo',
    agencyLogo: 'agency_logo',
    companyLogo: 'company_logo', companyLogoDoc: 'company_logo', pmCompanyLogo: 'company_logo', pmCompanyLogoDoc: 'company_logo',
  };

  Object.entries(formData || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof File !== 'undefined' && value instanceof File) {
      if (VENDOR_IMAGE_PART[key]) {
        vendorImageParts[VENDOR_IMAGE_PART[key]] = value;
      } else if (key.toLowerCase().includes('video')) {
        video = value;
      } else if (key.toLowerCase() === 'coverimage') {
        coverImage = value;
      } else if (value.type?.startsWith('image/') && !isDocumentKey(key)) {
        images.push(value);
      } else {
        documents.push(value);
        documentTypes.push(key);
      }
      return;
    }

    if (Array.isArray(value) && value.length && typeof File !== 'undefined' && value[0] instanceof File) {
      if (key.toLowerCase().includes('image')) {
        images.push(...value);
      } else {
        value.forEach((file) => {
          documents.push(file);
          documentTypes.push(key);
        });
      }
      return;
    }

    payload[key] = value;
  });

  const body = new FormData();
  body.append('property_data', JSON.stringify(payload));
  const orderedImages = coverImage ? [coverImage, ...images] : images;
  orderedImages.forEach((file) => body.append('images', file));
  documents.forEach((file) => body.append('documents', file));
  if (documentTypes.length) body.append('document_types', documentTypes.join(','));
  if (video) body.append('video', video);
  Object.entries(vendorImageParts).forEach(([part, file]) => body.append(part, file));
  return body;
};

export const createProperty = async (formData) => {
  try {
    const body = buildPropertyFormData(formData);
    const response = await axiosInstance.post('/properties/', body);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProperties = async (params = {}) => {
  try {
    const { page = 1, limit = 20, ...filters } = params;
    const response = await axiosInstance.get('/properties/', {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getPropertyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/properties/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProperty = async (id, formData) => {
  try {
    const body = buildPropertyFormData(formData);
    const response = await axiosInstance.put(`/properties/${id}/`, body);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProperty = async (id) => {
  try {
    const response = await axiosInstance.delete(`/properties/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};