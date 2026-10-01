// src/services/adminCustomerService.js
//
// Same shape as adminDashboardService.js (class-based, _assertAdmin() guard
// on every method) - see that file for the rationale. This wraps the
// customer/buyer/tenant admin surface: GET /admin/dashboard/customers and
// its sub-resources (requirements, saved-properties, wishlist,
// property-views). "Buyer" and "Tenant" are not separate tables - they're
// both rows in the Customer table distinguished by customerType
// ('buyer' | 'tenant' | 'both'), so listCustomers/getCustomerStats just take
// customerType as one of several filters.
//
// Unlike adminDashboardService.js, this surface's real backend
// (app/api/admin_customer_controller.py + admin_customer_schemas.py) takes
// camelCase on the wire for BOTH query params and POST/PATCH bodies
// (fullName, phoneNumber, customerType, ...) - it does its own
// camelCase<->snake_case translation server-side before touching the
// database. So every method here passes its camelCase JS arguments straight
// through as-is, with no snake_case conversion layer - confirmed against
// the actual backend source once it landed mid-task (this deviates from the
// original snake_case instruction, which was written before that backend
// existed; see the final report for why).
//
// Response bodies are camelCase too, straight from the backend's own
// _to_card/_to_requirement_card/_to_saved_property_card/_to_wishlist_card/
// _to_property_view_card builders.

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

class AdminCustomerService {
  _assertAdmin() {
    const user = getStoredUser();
    if (!user || user.role !== USER_ROLES.ADMIN) {
      throw new AdminAccessError();
    }
  }

  // ============ CUSTOMERS (Buyer/Tenant, distinguished by customerType) ============

  async listCustomers({
    page = 1,
    limit = 20,
    customerType,
    status,
    kycStatus,
    search,
    city,
    state,
  } = {}) {
    this._assertAdmin();
    const params = { page, limit };
    if (customerType) params.customerType = customerType;
    if (status) params.status = status;
    if (kycStatus) params.kycStatus = kycStatus;
    if (search) params.search = search;
    if (city) params.city = city;
    if (state) params.state = state;

    try {
      const response = await axiosInstance.get('/admin/dashboard/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin customers:', error);
      throw error;
    }
  }

  // Real response shape: { total, buyer, tenant, both, active, pending,
  // blocked, kycVerified, kycPending, kycRejected, emailVerified,
  // phoneVerified } (see AdminCustomerRepository.get_customer_stats).
  async getCustomerStats({ customerType, status, kycStatus, search, city, state } = {}) {
    this._assertAdmin();
    const params = {};
    if (customerType) params.customerType = customerType;
    if (status) params.status = status;
    if (kycStatus) params.kycStatus = kycStatus;
    if (search) params.search = search;
    if (city) params.city = city;
    if (state) params.state = state;

    try {
      const response = await axiosInstance.get('/admin/dashboard/customers/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin customer stats:', error);
      throw error;
    }
  }

  async getCustomer(customerId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.get(`/admin/dashboard/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin customer:', error);
      throw error;
    }
  }

  async createCustomer({
    fullName, email, phoneNumber, password, city, state, district, country, pincode,
    customerType, dateOfBirth, gender, maritalStatus, alternatePhone, occupation,
    employmentType, companyName, designation, annualIncome, preferredContactChannel,
    preferredContactTime, preferredLanguage, newsletterOptIn, bio, address,
    profilePicture, status,
  } = {}) {
    this._assertAdmin();
    const body = { fullName, email, phoneNumber };
    if (password !== undefined) body.password = password;
    if (city !== undefined) body.city = city;
    if (state !== undefined) body.state = state;
    if (district !== undefined) body.district = district;
    if (country !== undefined) body.country = country;
    if (pincode !== undefined) body.pincode = pincode;
    if (customerType !== undefined) body.customerType = customerType;
    if (dateOfBirth !== undefined) body.dateOfBirth = dateOfBirth;
    if (gender !== undefined) body.gender = gender;
    if (maritalStatus !== undefined) body.maritalStatus = maritalStatus;
    if (alternatePhone !== undefined) body.alternatePhone = alternatePhone;
    if (occupation !== undefined) body.occupation = occupation;
    if (employmentType !== undefined) body.employmentType = employmentType;
    if (companyName !== undefined) body.companyName = companyName;
    if (designation !== undefined) body.designation = designation;
    if (annualIncome !== undefined) body.annualIncome = annualIncome;
    if (preferredContactChannel !== undefined) body.preferredContactChannel = preferredContactChannel;
    if (preferredContactTime !== undefined) body.preferredContactTime = preferredContactTime;
    if (preferredLanguage !== undefined) body.preferredLanguage = preferredLanguage;
    if (newsletterOptIn !== undefined) body.newsletterOptIn = newsletterOptIn;
    if (bio !== undefined) body.bio = bio;
    if (address !== undefined) body.address = address;
    if (profilePicture !== undefined) body.profilePicture = profilePicture;
    if (status !== undefined) body.status = status;

    try {
      const response = await axiosInstance.post('/admin/dashboard/customers', body);
      return response.data;
    } catch (error) {
      console.error('Failed to create admin customer:', error);
      throw error;
    }
  }

  // emailVerified/phoneVerified ARE real, writable fields on this endpoint
  // (AdminCustomerUpdate) - not decorative.
  async updateCustomer(customerId, {
    fullName, phoneNumber, alternatePhone, profilePicture, bio, address,
    city, state, district, country, pincode, customerType, dateOfBirth,
    gender, maritalStatus, occupation, employmentType, companyName,
    designation, annualIncome, preferredContactChannel, preferredContactTime,
    preferredLanguage, newsletterOptIn, emailVerified, phoneVerified,
    status, kycStatus, kycAadhaarVerified, kycPanVerified, kycGstVerified,
    kycReraVerified, aadhaarDocUrl, panDocUrl, gstDocUrl, reraDocUrl,
  } = {}) {
    this._assertAdmin();
    const body = {};
    if (fullName !== undefined) body.fullName = fullName;
    if (phoneNumber !== undefined) body.phoneNumber = phoneNumber;
    if (alternatePhone !== undefined) body.alternatePhone = alternatePhone;
    if (profilePicture !== undefined) body.profilePicture = profilePicture;
    if (bio !== undefined) body.bio = bio;
    if (address !== undefined) body.address = address;
    if (city !== undefined) body.city = city;
    if (state !== undefined) body.state = state;
    if (district !== undefined) body.district = district;
    if (country !== undefined) body.country = country;
    if (pincode !== undefined) body.pincode = pincode;
    if (customerType !== undefined) body.customerType = customerType;
    if (dateOfBirth !== undefined) body.dateOfBirth = dateOfBirth;
    if (gender !== undefined) body.gender = gender;
    if (maritalStatus !== undefined) body.maritalStatus = maritalStatus;
    if (occupation !== undefined) body.occupation = occupation;
    if (employmentType !== undefined) body.employmentType = employmentType;
    if (companyName !== undefined) body.companyName = companyName;
    if (designation !== undefined) body.designation = designation;
    if (annualIncome !== undefined) body.annualIncome = annualIncome;
    if (preferredContactChannel !== undefined) body.preferredContactChannel = preferredContactChannel;
    if (preferredContactTime !== undefined) body.preferredContactTime = preferredContactTime;
    if (preferredLanguage !== undefined) body.preferredLanguage = preferredLanguage;
    if (newsletterOptIn !== undefined) body.newsletterOptIn = newsletterOptIn;
    if (emailVerified !== undefined) body.emailVerified = emailVerified;
    if (phoneVerified !== undefined) body.phoneVerified = phoneVerified;
    if (status !== undefined) body.status = status;
    if (kycStatus !== undefined) body.kycStatus = kycStatus;
    if (kycAadhaarVerified !== undefined) body.kycAadhaarVerified = kycAadhaarVerified;
    if (kycPanVerified !== undefined) body.kycPanVerified = kycPanVerified;
    if (kycGstVerified !== undefined) body.kycGstVerified = kycGstVerified;
    if (kycReraVerified !== undefined) body.kycReraVerified = kycReraVerified;
    if (aadhaarDocUrl !== undefined) body.aadhaarDocUrl = aadhaarDocUrl;
    if (panDocUrl !== undefined) body.panDocUrl = panDocUrl;
    if (gstDocUrl !== undefined) body.gstDocUrl = gstDocUrl;
    if (reraDocUrl !== undefined) body.reraDocUrl = reraDocUrl;

    try {
      const response = await axiosInstance.patch(`/admin/dashboard/customers/${customerId}`, body);
      return response.data;
    } catch (error) {
      console.error('Failed to update admin customer:', error);
      throw error;
    }
  }

  async updateCustomerStatus(customerId, status) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.patch(`/admin/dashboard/customers/${customerId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update customer status:', error);
      throw error;
    }
  }

  async updateCustomerKyc(customerId, { kycStatus, aadhaarVerified, panVerified, gstVerified, reraVerified } = {}) {
    this._assertAdmin();
    const body = {};
    if (kycStatus !== undefined) body.kycStatus = kycStatus;
    if (aadhaarVerified !== undefined) body.aadhaarVerified = aadhaarVerified;
    if (panVerified !== undefined) body.panVerified = panVerified;
    if (gstVerified !== undefined) body.gstVerified = gstVerified;
    if (reraVerified !== undefined) body.reraVerified = reraVerified;

    try {
      const response = await axiosInstance.patch(`/admin/dashboard/customers/${customerId}/kyc`, body);
      return response.data;
    } catch (error) {
      console.error('Failed to update customer KYC:', error);
      throw error;
    }
  }

  async deleteCustomer(customerId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.delete(`/admin/dashboard/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete admin customer:', error);
      throw error;
    }
  }

  // ============ REQUIREMENTS (CustomerRequirement - many rows per Customer) ============
  // Real fields (AdminRequirementInput) - deliberately minimal, NOT final:
  // propertyCategory, listingPurpose, propertyType, bedrooms,
  // preferredLocation, city, state, budgetMin, budgetMax, furnishingStatus,
  // notes, isActive. This backs a future requirement-matching page whose
  // form doesn't exist yet - do not add tenant-specific fields here.

  async listRequirements(customerId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.get(`/admin/dashboard/customers/${customerId}/requirements`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer requirements:', error);
      throw error;
    }
  }

  async createRequirement(customerId, {
    propertyCategory, listingPurpose, propertyType, bedrooms, preferredLocation,
    city, state, budgetMin, budgetMax, furnishingStatus, notes, isActive,
  } = {}) {
    this._assertAdmin();
    const body = {};
    if (propertyCategory !== undefined) body.propertyCategory = propertyCategory;
    if (listingPurpose !== undefined) body.listingPurpose = listingPurpose;
    if (propertyType !== undefined) body.propertyType = propertyType;
    if (bedrooms !== undefined) body.bedrooms = bedrooms;
    if (preferredLocation !== undefined) body.preferredLocation = preferredLocation;
    if (city !== undefined) body.city = city;
    if (state !== undefined) body.state = state;
    if (budgetMin !== undefined) body.budgetMin = budgetMin;
    if (budgetMax !== undefined) body.budgetMax = budgetMax;
    if (furnishingStatus !== undefined) body.furnishingStatus = furnishingStatus;
    if (notes !== undefined) body.notes = notes;
    if (isActive !== undefined) body.isActive = isActive;

    try {
      const response = await axiosInstance.post(`/admin/dashboard/customers/${customerId}/requirements`, body);
      return response.data;
    } catch (error) {
      console.error('Failed to create customer requirement:', error);
      throw error;
    }
  }

  async updateRequirement(requirementId, {
    propertyCategory, listingPurpose, propertyType, bedrooms, preferredLocation,
    city, state, budgetMin, budgetMax, furnishingStatus, notes, isActive,
  } = {}) {
    this._assertAdmin();
    const body = {};
    if (propertyCategory !== undefined) body.propertyCategory = propertyCategory;
    if (listingPurpose !== undefined) body.listingPurpose = listingPurpose;
    if (propertyType !== undefined) body.propertyType = propertyType;
    if (bedrooms !== undefined) body.bedrooms = bedrooms;
    if (preferredLocation !== undefined) body.preferredLocation = preferredLocation;
    if (city !== undefined) body.city = city;
    if (state !== undefined) body.state = state;
    if (budgetMin !== undefined) body.budgetMin = budgetMin;
    if (budgetMax !== undefined) body.budgetMax = budgetMax;
    if (furnishingStatus !== undefined) body.furnishingStatus = furnishingStatus;
    if (notes !== undefined) body.notes = notes;
    if (isActive !== undefined) body.isActive = isActive;

    try {
      const response = await axiosInstance.patch(`/admin/dashboard/customers/requirements/${requirementId}`, body);
      return response.data;
    } catch (error) {
      console.error('Failed to update customer requirement:', error);
      throw error;
    }
  }

  async deleteRequirement(requirementId) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.delete(`/admin/dashboard/customers/requirements/${requirementId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete customer requirement:', error);
      throw error;
    }
  }

  // ============ SAVED PROPERTIES (CustomerSavedProperty) ============

  async listSavedProperties({ page = 1, limit = 20, search, customerId } = {}) {
    this._assertAdmin();
    const params = { page, limit };
    if (search) params.search = search;
    if (customerId) params.userId = customerId;

    try {
      const response = await axiosInstance.get('/admin/dashboard/customers/saved-properties', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch saved properties:', error);
      throw error;
    }
  }

  async deleteSavedProperty(id) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.delete(`/admin/dashboard/customers/saved-properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete saved property:', error);
      throw error;
    }
  }

  // ============ WISHLIST (CustomerWishlistItem) ============

  async listWishlist({ page = 1, limit = 20, search, customerId } = {}) {
    this._assertAdmin();
    const params = { page, limit };
    if (search) params.search = search;
    if (customerId) params.userId = customerId;

    try {
      const response = await axiosInstance.get('/admin/dashboard/customers/wishlist', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      throw error;
    }
  }

  async deleteWishlistItem(id) {
    this._assertAdmin();
    try {
      const response = await axiosInstance.delete(`/admin/dashboard/customers/wishlist/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete wishlist item:', error);
      throw error;
    }
  }

  // ============ PROPERTY VIEWS (CustomerPropertyView) ============

  async listPropertyViews({ page = 1, limit = 20, customerId } = {}) {
    this._assertAdmin();
    const params = { page, limit };
    if (customerId) params.userId = customerId;

    try {
      const response = await axiosInstance.get('/admin/dashboard/customers/property-views', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property views:', error);
      throw error;
    }
  }
}

// Singleton, matching adminDashboardService.js's convention.
const adminCustomerService = new AdminCustomerService();
export default adminCustomerService;
