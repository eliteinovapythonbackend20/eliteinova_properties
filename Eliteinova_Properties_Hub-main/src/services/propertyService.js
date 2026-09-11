// src/services/propertyService.js
import axiosInstance from '../api/axiosInstance';

// The backend expects genuine multipart/form-data: a `property_data` part holding
// the JSON-encoded scalar fields, plus separate `images` / `video` / `documents`
// file parts. Forms build a single plain object (scalars + File objects mixed) -
// this splits that object into the shape the API actually accepts.
// NOTE: file field NAMES (coverImage, aadhaarCard, saleDeed, ...) are not yet
// preserved per-type on the backend - see FileExtractionService/file_mappings.py.
// They currently all collapse into the generic images/video/documents buckets.
const buildPropertyFormData = (formData) => {
  const payload = {};
  const images = [];
  const documents = [];
  let video = null;

  Object.entries(formData || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof File !== 'undefined' && value instanceof File) {
      if (key.toLowerCase().includes('video')) {
        video = value;
      } else if (value.type?.startsWith('image/') && !key.toLowerCase().includes('card') && !key.toLowerCase().includes('deed') && !key.toLowerCase().includes('certificate') && !key.toLowerCase().includes('doc')) {
        images.push(value);
      } else {
        documents.push(value);
      }
      return;
    }

    if (Array.isArray(value) && value.length && typeof File !== 'undefined' && value[0] instanceof File) {
      if (key.toLowerCase().includes('image')) {
        images.push(...value);
      } else {
        documents.push(...value);
      }
      return;
    }

    payload[key] = value;
  });

  const body = new FormData();
  body.append('property_data', JSON.stringify(payload));
  images.forEach((file) => body.append('images', file));
  documents.forEach((file) => body.append('documents', file));
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