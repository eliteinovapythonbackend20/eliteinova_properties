// src/services/adminDashboardService.js
//
// Class-based, on purpose (unlike the other services in this folder): every
// method guards itself with _assertAdmin() before firing, so a stray call
// from a non-admin surface fails fast client-side instead of just relying on
// the component around it to have checked first. This is a client-side
// convenience only, not the real security boundary - the backend's
// require_admin dependency (app/api/dependencies.py) is what actually
// enforces it on every request; a forged/edited localStorage role still gets
// a 401/403 from the server, this just avoids firing a request that we
// already know will fail.

import axiosInstance from '../api/axiosInstance';
import { storage } from '../utils/storage';
import { USER_ROLES } from '../models/authModel';

export class AdminAccessError extends Error {
  constructor(message = 'Admin access required') {
    super(message);
    this.name = 'AdminAccessError';
    this.code = 'ADMIN_ACCESS_REQUIRED';
  }
}

function getStoredUser() {
  try {
    const raw = storage.get('user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to read stored user:', error);
    return null;
  }
}

class AdminDashboardService {
  _assertAdmin() {
    const user = getStoredUser();
    if (!user || user.role !== USER_ROLES.ADMIN) {
      throw new AdminAccessError();
    }
  }

  async listProperties({
    page = 1,
    limit = 20,
    postedBy,
    propertyCategory,
    propertyType,
    subCategory,
    status,
    listingPurpose,
    featured,
    verificationStatus,
    search,
    createdFrom,
    createdTo,
  } = {}) {
    this._assertAdmin();
    const params = { page, limit };
    if (postedBy) params.posted_by = postedBy;
    if (propertyCategory) params.property_category = propertyCategory;
    if (propertyType) params.property_type = propertyType;
    if (subCategory) params.sub_category = subCategory;
    if (status) params.status = status;
    if (listingPurpose) params.listing_purpose = listingPurpose;
    if (featured !== undefined) params.featured = featured;
    if (verificationStatus) params.verification_status = verificationStatus;
    if (search) params.search = search;
    if (createdFrom) params.created_from = createdFrom;
    if (createdTo) params.created_to = createdTo;

    try {
      const response = await axiosInstance.get('/admin/dashboard/properties', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin properties:', error);
      throw error;
    }
  }

  async getPropertyStats({ postedBy, propertyCategory, propertyType, subCategory, createdFrom, createdTo } = {}) {
    this._assertAdmin();
    const params = {};
    if (postedBy) params.posted_by = postedBy;
    if (propertyCategory) params.property_category = propertyCategory;
    if (propertyType) params.property_type = propertyType;
    if (subCategory) params.sub_category = subCategory;
    if (createdFrom) params.created_from = createdFrom;
    if (createdTo) params.created_to = createdTo;

    try {
      const response = await axiosInstance.get('/admin/dashboard/properties/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin property stats:', error);
      throw error;
    }
  }

  async updatePropertyStatus(propertyId, status) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.patch(
        `/admin/dashboard/properties/${propertyId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update property status:', error);
      throw error;
    }
  }

  async updateProperty(propertyId, {
    propertyTitle, description, status, featured, verificationStatus,
    propertyCategory, propertyType, subCategory, listingPurpose,
    address, district, city, state, area, pinCode, latitude, longitude, priceMin, priceMax, expectedPrice,
  } = {}) {
    this._assertAdmin();
    const body = {};
    if (propertyTitle !== undefined) body.property_title = propertyTitle;
    if (description !== undefined) body.description = description;
    if (status !== undefined) body.status = status;
    if (featured !== undefined) body.featured = featured;
    if (verificationStatus !== undefined) body.verification_status = verificationStatus;
    if (propertyCategory !== undefined) body.property_category = propertyCategory;
    if (propertyType !== undefined) body.property_type = propertyType;
    if (subCategory !== undefined) body.sub_category = subCategory;
    if (listingPurpose !== undefined) body.listing_purpose = listingPurpose;
    if (address !== undefined) body.address = address;
    if (district !== undefined) body.district = district;
    if (city !== undefined) body.city = city;
    if (state !== undefined) body.state = state;
    if (area !== undefined) body.area = area;
    if (pinCode !== undefined) body.pin_code = pinCode;
    if (latitude !== undefined) body.latitude = latitude;
    if (longitude !== undefined) body.longitude = longitude;
    if (priceMin !== undefined) body.price_min = priceMin;
    if (priceMax !== undefined) body.price_max = priceMax;
    if (expectedPrice !== undefined) body.expected_price = expectedPrice;
    try {
      const response = await axiosInstance.patch(`/admin/dashboard/properties/${propertyId}`, body);
      return response.data;
    } catch (error) {
      console.error('Failed to update property:', error);
      throw error;
    }
  }

  async deleteProperty(propertyId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.delete(`/admin/dashboard/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete property:', error);
      throw error;
    }
  }
}

// Singleton, like the axios instance it wraps - every admin page shares one
// instance rather than constructing its own.
const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;
