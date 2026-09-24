// src/components/dashboard/properties/Hostel/HostelOverview.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiMapPin, FiTag, FiSave, FiFileText, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiHome, FiBriefcase, FiGlobe,
  FiMap, FiActivity, FiUsers
} from 'react-icons/fi';
import { FaCity, FaFemale, FaMale, FaUserFriends } from 'react-icons/fa';

// ============================================================
// PROPERTY TYPE (SUBCATEGORY) CONFIG
// ============================================================
const PROPERTY_TYPES = {
  'GirlsHostel': {
    icon: FaFemale,
    color: 'from-pink-600 to-pink-400',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-200',
    label: 'Girls Hostel'
  },
  'BoysHostel': {
    icon: FaMale,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Boys Hostel'
  },
  'CoLivingSpace': {
    icon: FaUserFriends,
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Co-Living Space'
  },
  'WorkingProfessionalHostel': {
    icon: FiBriefcase,
    color: 'from-teal-600 to-teal-400',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    label: 'Working Professional Hostel'
  }
};

// ---- All listing types available globally: Buy, Rent, Lease ----
const LISTING_TYPE_CONFIG = {
  'Buy': { bg: 'bg-[#E8F4F2]', text: 'text-[#00695C]', border: 'border-[#B5C9C5]' },
  'Rent': { bg: 'bg-[#E8F4F2]', text: 'text-[#00695C]', border: 'border-[#B5C9C5]' },
  'Lease': { bg: 'bg-[#E8F4F2]', text: 'text-[#00695C]', border: 'border-[#B5C9C5]' }
};

const ALL_LISTING_TYPES = ['Buy', 'Rent', 'Lease'];

// ---- Subcategory-specific listing type restrictions ----
// Every hostel subcategory allows Buy, Rent or Lease.
const RESTRICTED_LISTING_TYPES = {};

const getAllowedListingTypes = (propertyType) => RESTRICTED_LISTING_TYPES[propertyType] || ALL_LISTING_TYPES;

// ============================================================
// TOAST COMPONENT
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-slide-up ${colors[toast.type] || colors.success}`}>
      {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
      {toast.type === 'error' && <FiXCircle className="text-lg" />}
      {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
      {toast.type === 'info' && <FiInfo className="text-lg" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

// ============================================================
// CONFIRMATION MODAL
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: { icon: 'text-red-600', bg: 'bg-red-50', button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500', border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', border: 'border-amber-200' },
    info: { icon: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', border: 'border-blue-200' }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className={`p-6 ${style.bg} border-b ${style.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border}`}>
              <FiAlertTriangle className={`text-2xl ${style.icon}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{title || 'Confirm Action'}</h3>
              <p className="text-sm text-[#5A7D78]">{message || 'Are you sure you want to proceed?'}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#5A7D78] leading-relaxed">This action cannot be undone. Please confirm your decision.</p>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] ${style.button}`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW PROPERTY DETAIL MODAL
// ============================================================
const ViewPropertyDetailModal = ({ property, show, onClose, onEdit, onDelete }) => {
  if (!property || !show) return null;

  const typeConfig = PROPERTY_TYPES[property.propertyType] || PROPERTY_TYPES['GirlsHostel'];
  const TypeIcon = typeConfig.icon;
  const listingConfig = LISTING_TYPE_CONFIG[property.listingType] || LISTING_TYPE_CONFIG['Rent'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl ${typeConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${typeConfig.text} shadow-lg`}>
              <TypeIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{property.propertyTitle}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                  {typeConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>ID: {property.propertyId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${listingConfig.bg} ${listingConfig.text} border ${listingConfig.border}`}>
              <FiBriefcase className="text-xs" /> {property.listingType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.propertyId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHome className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Title</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.propertyTitle}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{typeConfig.label}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiBriefcase className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Listing Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.listingType}</p>
            </div>

            {/* ===== Location fields: Street → Area/Locality → City → District → State → Pincode ===== */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Street</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.street}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Area / Locality</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.area}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCity className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">City</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.city}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCity className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">District</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.district}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMap className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">State</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.state}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Pincode</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.pincode}</p>
            </div>
            {/* ===== End reordered location fields ===== */}

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiGlobe className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Latitude</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.latitude || '—'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiGlobe className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Longitude</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.longitude || '—'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Description</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.description || 'No description available'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={() => { if (onEdit) { onEdit(property); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(property.id); } }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"
            >
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT PROPERTY MODAL
// ============================================================
const EditPropertyModal = ({ property, show, onClose, onSave }) => {
  if (!property || !show) return null;

  const [formData, setFormData] = useState({
    propertyId: '', propertyTitle: '', propertyType: '', listingType: '',
    description: '', state: '', district: '', city: '', area: '',
    street: '', pincode: '', latitude: '', longitude: ''
  });
  const [loading, setLoading] = useState(false);

  const propertyTypeOptions = Object.keys(PROPERTY_TYPES);
  // Listing type options depend on the currently selected subcategory
  const listingTypeOptions = getAllowedListingTypes(formData.propertyType);
  const isListingTypeLocked = listingTypeOptions.length === 1;

  useEffect(() => {
    if (property) {
      const allowed = getAllowedListingTypes(property.propertyType);
      setFormData({
        propertyId: property.propertyId || '',
        propertyTitle: property.propertyTitle || '',
        propertyType: property.propertyType || '',
        listingType: allowed.includes(property.listingType) ? property.listingType : allowed[0],
        description: property.description || '',
        state: property.state || '',
        district: property.district || '',
        city: property.city || '',
        area: property.area || '',
        street: property.street || '',
        pincode: property.pincode || '',
        latitude: property.latitude || '',
        longitude: property.longitude || ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'propertyType') {
      const allowed = getAllowedListingTypes(value);
      setFormData(prev => ({
        ...prev,
        propertyType: value,
        listingType: allowed.includes(prev.listingType) ? prev.listingType : allowed[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...property, ...formData });
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Hostel</h2>
          <p className="text-white/80 text-sm">Update hostel property details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUsers className="text-[#00695C]" />
                Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property ID</label>
                  <input
                    type="text" name="propertyId" value={formData.propertyId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="HST-0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Title *</label>
                  <input
                    type="text" name="propertyTitle" value={formData.propertyTitle} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select
                    name="propertyType" value={formData.propertyType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypeOptions.map(type => (
                      <option key={type} value={type}>{PROPERTY_TYPES[type].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Listing Type *</label>
                  <select
                    name="listingType" value={formData.listingType} onChange={handleChange} required
                    disabled={isListingTypeLocked}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none disabled:bg-[#F5F9F8] disabled:cursor-not-allowed"
                  >
                    {listingTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {isListingTypeLocked && (
                    <p className="text-[11px] text-[#5A7D78] mt-1">
                      {PROPERTY_TYPES[formData.propertyType]?.label} listings are {listingTypeOptions[0]} only.
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Describe the property..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiMapPin className="text-[#00695C]" />
                Location Details
              </h3>
              {/* ===== Location fields: Street → Area/Locality → City → District → State → Pincode ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Street</label>
                  <input
                    type="text" name="street" value={formData.street} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Street"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Area / Locality</label>
                  <input
                    type="text" name="area" value={formData.area} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Area/Locality"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">City *</label>
                  <input
                    type="text" name="city" value={formData.city} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">District *</label>
                  <input
                    type="text" name="district" value={formData.district} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="District"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">State *</label>
                  <input
                    type="text" name="state" value={formData.state} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Pincode</label>
                  <input
                    type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Pincode"
                  />
                </div>
              </div>
              {/* ===== End reordered location fields ===== */}
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiGlobe className="text-[#00695C]" />
                Coordinates (optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Latitude</label>
                  <input
                    type="text" name="latitude" value={formData.latitude} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="e.g. 17.4239"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Longitude</label>
                  <input
                    type="text" name="longitude" value={formData.longitude} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="e.g. 78.4738"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave className="inline" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => (
  <div
    className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 animate-slide-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={() => onClick && onClick()}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider truncate">{title}</p>
        <p className={`text-lg font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
    {isActive && (
      <div className="mt-1 flex items-center gap-1">
        <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
      </div>
    )}
  </div>
);

// ============================================================
// FILTER DROPDOWN COMPONENT
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : allLabel;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
          <button
            onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>{allLabel}</span>
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
                value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
              }`}
            >
              <span className="w-4">{value === option.value && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const HostelOverview = () => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('propertyTitle');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [activeListingType, setActiveListingType] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS (total + one count per subcategory) ============
  const [stats, setStats] = useState(() => {
    const initial = { total: 0 };
    Object.keys(PROPERTY_TYPES).forEach(type => { initial[type] = 0; });
    return initial;
  });

  // ============ ENFORCE LISTING TYPE RULES ============
  const enforceListingTypeRules = useCallback((property) => {
    if (!property) return property;
    const allowed = getAllowedListingTypes(property.propertyType);
    if (!allowed.includes(property.listingType)) {
      return { ...property, listingType: allowed[0] };
    }
    return property;
  }, []);

  const normalizeProperties = useCallback((list) => {
    if (!list) return list;
    return list.map(enforceListingTypeRules);
  }, [enforceListingTypeRules]);

  const computeStats = useCallback((list) => {
    const counts = { total: list ? list.length : 0 };
    Object.keys(PROPERTY_TYPES).forEach(type => {
      counts[type] = list ? list.filter(p => p.propertyType === type).length : 0;
    });
    setStats(counts);
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockProperties = useCallback(() => {
    const propertyTitles = [
      'Sunrise Girls Hostel', 'Blue Nest Boys Hostel', 'Harmony Co-Living Space',
      'Metro Working Professional Hostel', 'Silver Oak Girls Hostel', 'Green Meadows Boys Hostel',
      'Urban Nest Co-Living Space', 'Corporate Stay Professional Hostel', 'Rose Garden Girls Hostel',
      'Maple Leaf Boys Hostel', 'Cozy Cube Co-Living Space', 'Workhive Professional Hostel',
      'Lotus Girls Hostel', 'Sapphire Boys Hostel', 'Nestway Co-Living Space',
      'Prime Stay Professional Hostel', 'Orchid Girls Hostel', 'Falcon Boys Hostel'
    ];
    const states = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Delhi', 'West Bengal', 'Gujarat', 'Kerala'];
    const districts = ['Chennai', 'Bengaluru Urban', 'Hyderabad', 'Mumbai Suburban', 'New Delhi', 'Kolkata', 'Ahmedabad', 'Ernakulam'];
    const cities = ['Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata', 'Ahmedabad', 'Kochi'];
    const areas = ['Adyar', 'Koramangala', 'Jubilee Hills', 'Bandra', 'Connaught Place', 'Salt Lake', 'Vastrapur', 'Kakkanad'];
    const streets = ['1st Cross Street', 'MG Road', 'Lake View Lane', 'Garden Street', 'Park Avenue', 'Hill Road', 'Church Street', 'Palm Grove Road'];
    const propertyTypes = Object.keys(PROPERTY_TYPES);

    const propertiesList = [];

    for (let i = 1; i <= 60; i++) {
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const allowedListingTypes = getAllowedListingTypes(propertyType);
      const listingType = allowedListingTypes[Math.floor(Math.random() * allowedListingTypes.length)];
      const pincode = String(600000 + Math.floor(Math.random() * 99999));
      const hasCoords = Math.random() > 0.4;

      propertiesList.push({
        id: `hst_${i}`,
        propertyId: `HST-${String(i).padStart(4, '0')}`,
        propertyTitle: propertyTitles[Math.floor(Math.random() * propertyTitles.length)],
        propertyType,
        listingType,
        description: `A well-maintained ${PROPERTY_TYPES[propertyType].label.toLowerCase()} with good amenities and prime connectivity.`,
        state: states[Math.floor(Math.random() * states.length)],
        district: districts[Math.floor(Math.random() * districts.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        area: areas[Math.floor(Math.random() * areas.length)],
        street: streets[Math.floor(Math.random() * streets.length)],
        pincode,
        latitude: hasCoords ? (11 + Math.random() * 15).toFixed(4) : '',
        longitude: hasCoords ? (72 + Math.random() * 15).toFixed(4) : ''
      });
    }

    computeStats(propertiesList);
    return propertiesList;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockProperties = normalizeProperties(generateMockProperties());
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
    } catch (error) {
      console.error('Error generating mock properties:', error);
    }
  }, [generateMockProperties, normalizeProperties]);

  // ============ FILTER PROPERTIES ============
  const filterProperties = useCallback(() => {
    try {
      let filtered = [...properties];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          (p.propertyTitle && p.propertyTitle.toLowerCase().includes(query)) ||
          (p.propertyId && p.propertyId.toLowerCase().includes(query)) ||
          (p.propertyType && (PROPERTY_TYPES[p.propertyType]?.label || p.propertyType).toLowerCase().includes(query)) ||
          (p.listingType && p.listingType.toLowerCase().includes(query)) ||
          (p.state && p.state.toLowerCase().includes(query)) ||
          (p.district && p.district.toLowerCase().includes(query)) ||
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.area && p.area.toLowerCase().includes(query)) ||
          (p.street && p.street.toLowerCase().includes(query)) ||
          (p.pincode && p.pincode.toLowerCase().includes(query))
        );
      }

      if (activePropertyType !== 'all') {
        filtered = filtered.filter(p => p.propertyType === activePropertyType);
      }

      if (activeListingType !== 'all') {
        filtered = filtered.filter(p => p.listingType === activeListingType);
      }

      let count = 0;
      if (activePropertyType !== 'all') count++;
      if (activeListingType !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredProperties(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering properties:', error);
    }
  }, [properties, searchQuery, activePropertyType, activeListingType, sortField, sortDirection]);

  useEffect(() => { filterProperties(); }, [filterProperties]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, currentPage, pageSize]);

  // ============ HANDLE SORT ============
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  // ============ HANDLE SELECT ALL ============
  const handleSelectAll = useCallback(() => {
    if (selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(paginatedProperties.map(p => p.id));
    }
  }, [selectedProperties, paginatedProperties]);

  // ============ HANDLE SELECT PROPERTY ============
  const handleSelectProperty = useCallback((propertyId) => {
    setSelectedProperties(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
  }, []);

  // ============ VIEW / EDIT ============
  const handleViewProperty = useCallback((property) => {
    setViewingProperty(property);
    setShowViewModal(true);
  }, []);

  const handleEditProperty = useCallback((property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  }, []);

  const handleSaveProperty = useCallback((updatedProperty) => {
    const normalized = enforceListingTypeRules(updatedProperty);
    setProperties(prev => {
      const updated = prev.map(p => p.id === normalized.id ? normalized : p);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Property "${normalized.propertyTitle}" updated successfully`, type: 'success' });
  }, [computeStats, enforceListingTypeRules]);

  // ============ DELETE PROPERTY WITH CONFIRMATION ============
  const handleDeleteProperty = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Property',
      message: `Are you sure you want to delete property "${property.propertyTitle}" (${property.propertyId})?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(propertyId);
        setTimeout(() => {
          setProperties(prev => {
            const updated = prev.filter(p => p.id !== propertyId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted property "${property.propertyTitle}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [properties, computeStats]);

  // ============ STAT CLICK HANDLERS ============
  const handleTypeClick = useCallback((type) => {
    setActivePropertyType(prev => (prev === type ? 'all' : type));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActivePropertyType('all');
    setActiveListingType('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActivePropertyType('all');
    setActiveListingType('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockProperties = normalizeProperties(generateMockProperties());
        setProperties(mockProperties);
        setFilteredProperties(mockProperties);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockProperties, normalizeProperties]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredProperties.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredProperties.map(p => ({
        'Property ID': p.propertyId || '',
        'Property Title': p.propertyTitle || '',
        'Property Type': (PROPERTY_TYPES[p.propertyType]?.label) || p.propertyType || '',
        'Listing Type': p.listingType || '',
        'Description': p.description || '',
        'Street': p.street || '',
        'Area / Locality': p.area || '',
        'City': p.city || '',
        'District': p.district || '',
        'State': p.state || '',
        'Pincode': p.pincode || '',
        'Latitude': p.latitude || '',
        'Longitude': p.longitude || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hostel_properties_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredProperties.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredProperties]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedProperties.length === 0) {
      setToast({ message: 'Please select properties first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Properties',
      message: `Are you sure you want to delete ${selectedProperties.length} selected property(ies)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedProperties);
          const count = properties.filter(p => selectedIds.has(p.id)).length;
          const updated = properties.filter(p => !selectedIds.has(p.id));
          setProperties(updated);
          computeStats(updated);
          setSelectedProperties([]);
          setActionLoading(null);
          setToast({ message: `${count} property(ies) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedProperties, properties, computeStats]);

  // ============ FILTER OPTIONS ============
  const propertyTypeOptions = Object.keys(PROPERTY_TYPES).map(type => ({ value: type, label: PROPERTY_TYPES[type].label }));
  const listingTypeOptions = ALL_LISTING_TYPES.map(type => ({ value: type, label: type }));

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => {
          if (confirmationModal.onCancel) confirmationModal.onCancel();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }}
        onConfirm={() => { if (confirmationModal.onConfirm) confirmationModal.onConfirm(); }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {showViewModal && viewingProperty && (
        <ViewPropertyDetailModal
          property={viewingProperty}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingProperty(null); }}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {showEditModal && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingProperty(null); }}
          onSave={handleSaveProperty}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Hostel Properties
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredProperties.length} Properties
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Girls, Boys, Co-Living &amp; Working Professional hostel listings</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              {showStats ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section — Total + Subcategories */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Properties"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activePropertyType === 'all' && activeListingType === 'all' && !searchQuery}
                onClick={handleTotalClick}
              />
              {Object.keys(PROPERTY_TYPES).map((type, idx) => {
                const config = PROPERTY_TYPES[type];
                const TypeIcon = config.icon;
                return (
                  <StatCard
                    key={type}
                    icon={<TypeIcon className="text-white text-sm" />}
                    title={config.label}
                    value={stats[type] || 0}
                    color={`bg-gradient-to-br ${config.color}`}
                    delay={(idx + 1) * 60}
                    isActive={activePropertyType === type}
                    onClick={() => handleTypeClick(type)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Dropdowns */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, ID, type, state, city, pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <FilterDropdown
              label="Type"
              options={propertyTypeOptions}
              value={activePropertyType}
              onChange={setActivePropertyType}
              icon={FiTag}
              allLabel="All Types"
            />

            <FilterDropdown
              label="Listing"
              options={listingTypeOptions}
              value={activeListingType}
              onChange={setActiveListingType}
              icon={FiActivity}
              allLabel="All Listings"
            />

            {(activePropertyType !== 'all' || activeListingType !== 'all' || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiX className="text-sm" /> Clear
              </button>
            )}

            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}
                title="Grid View"
              >
                <FiGridIcon className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}
                title="List View"
              >
                <FiList className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {selectedProperties.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedProperties.length}</span> property(ies) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button
                onClick={() => setSelectedProperties([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);
              const typeConfig = PROPERTY_TYPES[property.propertyType] || PROPERTY_TYPES['GirlsHostel'];
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={property.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectProperty(property.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <TypeIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{property.propertyTitle}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{property.propertyId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ===== Location fields ===== */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiBriefcase className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-semibold text-[#1A2E2A]">{property.listingType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{property.street}</span>
                    </div>
                     <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                        <span className="truncate font-medium">{property.area}, {property.city}</span>
                     </div>
                     <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                       <FaCity className="text-[#00695C] flex-shrink-0" />
                          <span className="truncate font-medium">{property.district}, {property.state}</span>
                     </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHash className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-semibold text-[#1A2E2A]">{property.pincode}</span>
                    </div>
                    {property.latitude && (
                      <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                        <FiGlobe className="text-[#00695C] flex-shrink-0" />
                        <span className="truncate font-medium">Latitude: {property.latitude}</span>
                      </div>
                    )}
                    {property.longitude && (
                      <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                        <FiGlobe className="text-[#00695C] flex-shrink-0" />
                        <span className="truncate font-medium">Longitude: {property.longitude}</span>
                      </div>
                    )}
                  </div>
                  {/* ===== End reordered location fields ===== */}

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewProperty(property)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditProperty(property)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={actionLoading === property.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === property.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-1 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-2 flex items-center gap-2 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                />
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyId')}>
                  ID {sortField === 'propertyId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-2 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('propertyTitle')}>
                Title {sortField === 'propertyTitle' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyType')}>
                Type {sortField === 'propertyType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('listingType')}>
                Listing {sortField === 'listingType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              {/* ===== Reordered: City before State to follow Street→Area→City→District→State→Pincode hierarchy ===== */}
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('state')}>
                State {sortField === 'state' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('pincode')}>
                Pincode {sortField === 'pincode' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate">Latitude</div>
              <div className="col-span-1 min-w-0 truncate">Longitude</div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);
              const typeConfig = PROPERTY_TYPES[property.propertyType] || PROPERTY_TYPES['GirlsHostel'];
              const TypeIcon = typeConfig.icon;
              const listingConfig = LISTING_TYPE_CONFIG[property.listingType] || LISTING_TYPE_CONFIG['Rent'];

              return (
                <div
                  key={property.id}
                  className={`grid grid-cols-12 gap-1 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProperty(property.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                    />
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <TypeIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{property.propertyId}</span>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{property.propertyTitle}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {typeConfig.label}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${listingConfig.bg} ${listingConfig.text} border ${listingConfig.border} truncate inline-block max-w-full`}>
                      {property.listingType}
                    </span>
                  </div>

                  {/* ===== Reordered: City before State ===== */}
                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.city}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.state}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.pincode}
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {property.latitude || '—'}
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {property.longitude || '—'}
                  </div>

                  <div className="col-span-1 min-w-0 flex items-center justify-end gap-1 flex-nowrap">
                    <button
                      type="button"
                      onClick={() => handleViewProperty(property)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="View"
                    >
                      <FiEye className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditProperty(property)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0"
                      title="Edit"
                    >
                      <FiEdit className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={actionLoading === property.id}
                      className="w-5 h-5 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                      title="Delete"
                    >
                      {actionLoading === property.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[15px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedProperties.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUsers className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No properties found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No hostel properties have been added yet'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredProperties.length)} of{' '}
              {filteredProperties.length} properties
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-110 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
                      : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HostelOverview;