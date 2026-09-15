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
  let coverImage = null;
  let video = null;

  const isDocumentKey = (key) => {
    const k = key.toLowerCase();
    return ['card', 'deed', 'certificate', 'doc', 'license', 'proof', 'brochure', 'agreement', 'receipt', 'plan', 'chitta']
      .some((needle) => k.includes(needle));
  };

  Object.entries(formData || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof File !== 'undefined' && value instanceof File) {
      if (key.toLowerCase().includes('video')) {
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