// src/services/adminPropertyRequestService.js
//
// Same shape as adminCustomerService.js (class-based, _assertAdmin() guard
// on every method). Wraps the admin Purchase Requests / Rental Requests
// surface: GET /admin/dashboard/property-requests and its sub-resources,
// backed by app/api/admin_property_request_controller.py.
//
// Purchase and rental requests are NOT separate tables or separate routes -
// both are rows in the one property_requests table distinguished by
// requestType ('purchase' | 'rental'), each with its own status pipeline
// (see app/schemas/customer_schemas.py's PURCHASE_REQUEST_STATUSES /
// RENTAL_REQUEST_STATUSES). listRequests/getStats both just take
// requestType as one of several filters - the PurchaseRequests* and
// RentalRequests* admin components each always pass their own fixed value.
//
// Response bodies are camelCase, straight from the backend's own
// AdminPropertyRequestService._to_card/_to_detail builders.

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

class AdminPropertyRequestService {
  _assertAdmin() {
    const user = getStoredUser();
    if (!user || user.role !== USER_ROLES.ADMIN) {
      throw new AdminAccessError();
    }
  }

  async listRequests({
    page = 1, limit = 20, requestType, status, search, userId, propertyId,
  } = {}) {
    this._assertAdmin();
    const params = { page, limit };
    if (requestType) params.requestType = requestType;
    if (status) params.status = status;
    if (search) params.search = search;
    if (userId) params.userId = userId;
    if (propertyId) params.propertyId = propertyId;

    try {
      const response = await axiosInstance.get('/admin/dashboard/property-requests', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin property requests:', error);
      throw error;
    }
  }

  // Real response shape: { total, urgent, siteVisitRequested, statusCounts:
  // { <status>: count, ... } } (see AdminPropertyRequestRepository.get_stats).
  async getStats(requestType) {
    this._assertAdmin();
    const params = {};
    if (requestType) params.requestType = requestType;

    try {
      const response = await axiosInstance.get('/admin/dashboard/property-requests/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin property request stats:', error);
      throw error;
    }
  }

  async getRequest(requestId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.get(`/admin/dashboard/property-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin property request:', error);
      throw error;
    }
  }

  // newStatus must belong to the request's own pipeline (purchase vs
  // rental) - the backend rejects a mismatched status with a 400 naming the
  // allowed set for that request's requestType.
  async updateStatus(requestId, newStatus, note) {
    this._assertAdmin();
    const body = { status: newStatus };
    if (note !== undefined) body.note = note;

    try {
      const response = await axiosInstance.patch(`/admin/dashboard/property-requests/${requestId}/status`, body);
      return response.data;
    } catch (error) {
      console.error('Failed to update property request status:', error);
      throw error;
    }
  }

  async deleteRequest(requestId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.delete(`/admin/dashboard/property-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete property request:', error);
      throw error;
    }
  }
}

// Singleton, matching adminCustomerService.js's convention.
const adminPropertyRequestService = new AdminPropertyRequestService();
export default adminPropertyRequestService;
