// src/services/customerService.js
//
// Self-service customer surface - "my own" profile, saved properties,
// wishlist, requirements, and property requests (purchase/rental). The
// self-service counterpart to adminCustomerService.js: same camelCase
// wire contract, but every route here is implicitly scoped to the logged-in
// user's own data (no customerId param anywhere - the backend reads it off
// the auth token), backed by app/api/customer_controller.py.
//
// Unlike adminCustomerService.js there is no _assertAdmin() guard - these
// routes are gated server-side for role "user" (or "admin", for parity with
// the backend's require_vendor convention), and any logged-in customer may
// call them for their own data.

import axiosInstance from '../api/axiosInstance';

class CustomerService {
  // ============ PROFILE ============

  async getMyProfile() {
    const response = await axiosInstance.get('/customer/profile');
    return response.data;
  }

  async updateMyProfile({
    fullName, phoneNumber, alternatePhone, bio, address, city, state,
    district, country, pincode, customerType, dateOfBirth, gender,
    maritalStatus, occupation, employmentType, companyName, designation,
    annualIncome, preferredContactChannel, preferredContactTime,
    preferredLanguage, newsletterOptIn,
  } = {}) {
    const body = {};
    if (fullName !== undefined) body.fullName = fullName;
    if (phoneNumber !== undefined) body.phoneNumber = phoneNumber;
    if (alternatePhone !== undefined) body.alternatePhone = alternatePhone;
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

    const response = await axiosInstance.patch('/customer/profile', body);
    return response.data;
  }

  async uploadMyProfilePhoto(file) {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    const response = await axiosInstance.post('/customer/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  async deleteMyProfilePhoto() {
    const response = await axiosInstance.delete('/customer/profile/photo');
    return response.data;
  }

  // doc_type: 'aadhaar' | 'pan' | 'gst' | 'rera'
  async uploadMyKycDocument(docType, file) {
    const formData = new FormData();
    formData.append('document', file);
    const response = await axiosInstance.post(`/customer/profile/documents/${docType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // ============ REQUIREMENTS ============

  async listMyRequirements() {
    const response = await axiosInstance.get('/customer/requirements');
    return response.data;
  }

  async createMyRequirement({
    propertyCategory, listingPurpose, propertyType, bedrooms, preferredLocation,
    city, state, budgetMin, budgetMax, furnishingStatus, notes, isActive,
  } = {}) {
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

    const response = await axiosInstance.post('/customer/requirements', body);
    return response.data;
  }

  async updateMyRequirement(requirementId, fields = {}) {
    const response = await axiosInstance.patch(`/customer/requirements/${requirementId}`, fields);
    return response.data;
  }

  async deleteMyRequirement(requirementId) {
    const response = await axiosInstance.delete(`/customer/requirements/${requirementId}`);
    return response.data;
  }

  // ============ SAVED PROPERTIES ============

  async listMySavedProperties() {
    const response = await axiosInstance.get('/customer/saved-properties');
    return response.data;
  }

  async saveProperty(propertyId, notes) {
    const body = {};
    if (notes !== undefined) body.notes = notes;
    const response = await axiosInstance.post(`/customer/saved-properties/${propertyId}`, body);
    return response.data;
  }

  async unsaveProperty(propertyId) {
    const response = await axiosInstance.delete(`/customer/saved-properties/${propertyId}`);
    return response.data;
  }

  // ============ WISHLIST ============

  async listMyWishlist() {
    const response = await axiosInstance.get('/customer/wishlist');
    return response.data;
  }

  async addToWishlist(propertyId) {
    const response = await axiosInstance.post(`/customer/wishlist/${propertyId}`);
    return response.data;
  }

  async removeFromWishlist(propertyId) {
    const response = await axiosInstance.delete(`/customer/wishlist/${propertyId}`);
    return response.data;
  }

  // ============ PROPERTY REQUESTS (purchase / rental - "Requested Properties") ============
  // requestedAmount is the one amount field this backs today (buyer's offer
  // / proposed rent) - the actual request button/modal that collects it on
  // the property card is a separate, later task; this method already
  // accepts it for whenever that UI is wired up.

  async listMyPropertyRequests(requestType) {
    const params = {};
    if (requestType) params.requestType = requestType;
    const response = await axiosInstance.get('/customer/property-requests', { params });
    return response.data;
  }

  async createMyPropertyRequest(propertyId, {
    requestType, requestedAmount, budgetMin, budgetMax, preferredDate, timeline,
    occupantType, occupantsCount, employmentType, companyName, monthlyIncome,
    financingRequired, siteVisitRequested, siteVisitDate, isUrgent, notes,
  } = {}) {
    const body = { requestType };
    if (requestedAmount !== undefined) body.requestedAmount = requestedAmount;
    if (budgetMin !== undefined) body.budgetMin = budgetMin;
    if (budgetMax !== undefined) body.budgetMax = budgetMax;
    if (preferredDate !== undefined) body.preferredDate = preferredDate;
    if (timeline !== undefined) body.timeline = timeline;
    if (occupantType !== undefined) body.occupantType = occupantType;
    if (occupantsCount !== undefined) body.occupantsCount = occupantsCount;
    if (employmentType !== undefined) body.employmentType = employmentType;
    if (companyName !== undefined) body.companyName = companyName;
    if (monthlyIncome !== undefined) body.monthlyIncome = monthlyIncome;
    if (financingRequired !== undefined) body.financingRequired = financingRequired;
    if (siteVisitRequested !== undefined) body.siteVisitRequested = siteVisitRequested;
    if (siteVisitDate !== undefined) body.siteVisitDate = siteVisitDate;
    if (isUrgent !== undefined) body.isUrgent = isUrgent;
    if (notes !== undefined) body.notes = notes;

    const response = await axiosInstance.post(`/customer/property-requests/${propertyId}`, body);
    return response.data;
  }
}

// Singleton, matching adminCustomerService.js's convention.
const customerService = new CustomerService();
export default customerService;
