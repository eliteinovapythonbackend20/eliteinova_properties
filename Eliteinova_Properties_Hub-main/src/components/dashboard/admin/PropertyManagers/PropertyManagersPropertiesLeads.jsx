// src/components/dashboard/admin/PropertyManagers/PropertyManagersPropertiesLeads.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiXCircle,
  FiClock, FiSearch, FiFilter, FiChevronDown, FiChevronLeft,
  FiChevronRight, FiEye, FiStar, FiShield, FiRefreshCw,
  FiGrid, FiList, FiX, FiDownload, FiUpload, FiMoreVertical,
  FiAlertTriangle, FiInfo, FiMapPin, FiCalendar, FiUser,
  FiTag, FiDollarSign, FiSquare, FiMaximize, FiMinimize,
  FiActivity, FiExternalLink, FiUserCheck, FiUserX, FiSave,
  FiImage, FiFileText, FiPhone, FiMail, FiGlobe, FiSettings,
  FiVideo, FiCamera, FiUsers, FiBarChart2, FiTrendingUp,
  FiAward, FiBriefcase, FiTarget, FiPieChart
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie, FaUserGraduate
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlineLeaderboard } from 'react-icons/md';

// ============ TOAST COMPONENT ============
const Toast = ({ toast }) => {
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

// ============ CONFIRMATION MODAL ============
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmColor = 'bg-red-500',
  icon = <FiAlertTriangle className="text-3xl text-red-500" />,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-[#1A2E2A] mb-1.5">{title}</h3>
          <p className="text-sm text-[#5A7D78] mb-4 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ STAT CARD COMPONENT ============
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick && onClick()}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A7D78] uppercase tracking-wider">{title}</p>
          <p className={`text-xl font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
    </div>
  );
};

// Status -> left border color
const STATUS_BORDER = {
  pending: 'border-l-amber-500',
  approved: 'border-l-emerald-500',
  rejected: 'border-l-red-500',
  suspended: 'border-l-gray-500',
};
const STATUS_BADGE = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  suspended: 'bg-gray-100 text-gray-700',
};

// Tiny deterministic PRNG
const seededRandom = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
const seedFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 2147483647;
  }
  return hash || 1;
};

// ============ VIEW PROPERTY MODAL ============
const ViewPropertyModal = ({ property, show, onClose }) => {
  if (!property || !show) return null;

  const amenities = property.amenities || ['WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym'];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEye className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Property Details</h2>
              <p className="text-white/70 text-[10px]">View property information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{property.title}</h3>
              <p className="text-sm text-[#5A7D78]">{property.type} · {property.location}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${STATUS_BADGE[property.status] || 'bg-gray-100 text-gray-700'}`}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </span>
              {property.isVerified && (
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
                  <FiShield className="inline mr-1 text-xs" /> Verified
                </span>
              )}
              {property.isFeatured && (
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-700">
                  <FaStarSolid className="inline mr-1 text-xs" /> Featured
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">₹{property.price.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Price</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{property.bedrooms}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Beds</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{property.bathrooms}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Baths</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm bg-[#F5F9F8] rounded-xl p-3">
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiMapPin className="text-[#00695C]" /> {property.location}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiSquare className="text-[#00695C]" /> {property.area} {property.areaUnit}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiTag className="text-[#00695C]" /> {property.type}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiUser className="text-[#00695C]" /> {property.managerName}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenities.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-[#F5F9F8] rounded-lg text-xs text-[#1A2E2A]">{item}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-[#5A7D78] leading-relaxed bg-[#F5F9F8] rounded-xl p-3">
              {property.description || 'No description available.'}
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ EDIT PROPERTY MODAL ============
const EditPropertyModal = ({ property, show, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property && show) {
      setFormData({
        title: property.title || '',
        type: property.type || 'Apartment',
        location: property.location || '',
        price: property.price || '',
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area || '',
        areaUnit: property.areaUnit || 'sq ft',
        status: property.status || 'pending',
        isFeatured: property.isFeatured || false,
        isVerified: property.isVerified || false,
        managerName: property.managerName || '',
        description: property.description || '',
        amenities: property.amenities ? property.amenities.join(', ') : '',
      });
      setErrors({});
    }
  }, [property, show]);

  if (!property || !show || !formData) return null;

  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statusOptions = ['pending', 'approved', 'rejected', 'suspended'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.area || formData.area <= 0) newErrors.area = 'Valid area is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const amenitiesArray = formData.amenities
      ? formData.amenities.split(',').map(a => a.trim()).filter(a => a)
      : [];

    const updatedData = {
      ...formData,
      amenities: amenitiesArray,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
    };

    setTimeout(() => {
      onSave(updatedData);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEdit className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Property</h2>
              <p className="text-white/70 text-[10px]">Update property details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.title ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.title && <p className="text-[10px] text-red-500 mt-0.5">{errors.title}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Type</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Location <span className="text-red-500">*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.location ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.location && <p className="text-[10px] text-red-500 mt-0.5">{errors.location}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.price ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} min="0" />
              {errors.price && <p className="text-[10px] text-red-500 mt-0.5">{errors.price}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Area <span className="text-red-500">*</span></label>
              <input type="number" name="area" value={formData.area} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.area ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} min="0" />
              {errors.area && <p className="text-[10px] text-red-500 mt-0.5">{errors.area}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Area Unit</label>
              <select name="areaUnit" value={formData.areaUnit} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                <option value="sq ft">sq ft</option>
                <option value="sq m">sq m</option>
                <option value="acres">acres</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Property Manager</label>
              <input type="text" name="managerName" value={formData.managerName} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Amenities <span className="text-[#B5C9C5]">(comma separated)</span></label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" placeholder="WiFi, Pool, AC" />
          </div>

          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              rows="2" className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none" />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-[#1A2E2A]">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C]" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-[#1A2E2A]">
              <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange}
                className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C]" />
              Verified
            </label>
          </div>

          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex items-center gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting || loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ ASSIGN LEADS MODAL - UPDATED ============
const AssignLeadsModal = ({
  manager,
  show,
  onClose,
  onAssign,
  onViewLeadProfile,
  loading
}) => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && manager) {
      const mockLeads = [];
      const leadNames = ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sneha Reddy', 'Vikram Kumar', 'Meera Iyer', 'Deepak Jain', 'Kavya Nair', 'Arjun Menon', 'Neha Kapoor'];
      const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
      const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
      const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Studio', 'Penthouse', 'Duplex'];

      for (let i = 1; i <= 12; i++) {
        const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const bhk = propertyType === 'Land & Plots' ? 'Plot' : bhkOptions[Math.floor(Math.random() * bhkOptions.length)];
        const location = cities[Math.floor(Math.random() * cities.length)];
        
        mockLeads.push({
          id: `lead_${i}`,
          name: leadNames[i % leadNames.length] + (i > 8 ? ` ${i}` : ''),
          phone: `+91 98765${String(43210 + i).padStart(5, '0')}`,
          city: location,
          propertyType: propertyType,
          bhk: bhk,
          location: location,
        });
      }
      setAvailableLeads(mockLeads);
      setSelectedLeads([]);
      setSearchQuery('');
    }
  }, [show, manager]);

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return availableLeads;
    const query = searchQuery.toLowerCase();
    return availableLeads.filter(lead =>
      lead.name.toLowerCase().includes(query) ||
      lead.city.toLowerCase().includes(query) ||
      lead.propertyType.toLowerCase().includes(query) ||
      lead.bhk.toLowerCase().includes(query)
    );
  }, [availableLeads, searchQuery]);

  const handleToggleLead = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleDownloadLeads = () => {
    if (availableLeads.length === 0) return;

    const data = availableLeads.map(lead => ({
      'Name': lead.name,
      'Phone': lead.phone,
      'Property Type': lead.propertyType,
      'BHK': lead.bhk,
      'Location': lead.location,
      'ID': lead.id,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_${(manager?.name || 'manager').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (selectedLeads.length === 0) return;
    setIsSubmitting(true);
    const leadObjects = availableLeads.filter(l => selectedLeads.includes(l.id));
    setTimeout(() => {
      onAssign(manager.id, leadObjects);
      setIsSubmitting(false);
    }, 500);
  };

  if (!show || !manager) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assign Leads</h2>
              <p className="text-white/70 text-[10px]">Assign leads to {manager.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input type="text" placeholder="Search leads by name, property type, BHK, or location..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
            <button
              onClick={handleDownloadLeads}
              className="px-3 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 shadow-md shadow-[#00695C]/30"
              title="Download all leads as CSV"
            >
              <FiDownload className="text-sm" />
              Download
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5A7D78]">{filteredLeads.length} available lead(s)</span>
            <div className="flex items-center gap-2">
              <button onClick={handleSelectAll} className="text-xs text-[#00695C] font-medium hover:underline">
                {selectedLeads.length === filteredLeads.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-2xl text-[#B5C9C5]" />
              </div>
              <p className="text-sm text-[#5A7D78]">No leads to assign</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLeads.map((lead) => (
                <div key={lead.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${selectedLeads.includes(lead.id) ? 'border-[#00695C] bg-[#E8F4F2]' : 'border-[#E8F0EE] hover:border-[#B5C9C5]'}`}>
                  <input type="checkbox" checked={selectedLeads.includes(lead.id)}
                    onChange={() => handleToggleLead(lead.id)}
                    className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 shrink-0" />
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="font-semibold text-sm text-[#1A2E2A] whitespace-nowrap">{lead.name}</span>
                    <div className="flex items-center gap-3 text-sm text-[#5A7D78]">
                      <span className="font-medium text-[#00695C] whitespace-nowrap">{lead.propertyType}</span>
                      <span className="text-[#B5C9C5]">·</span>
                      <span className="whitespace-nowrap">{lead.bhk}</span>
                      <span className="text-[#B5C9C5]">·</span>
                      <span className="whitespace-nowrap">{lead.location}</span>
                      <span className="text-[#B5C9C5]">·</span>
                      <span className="whitespace-nowrap">{lead.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
          <button onClick={handleSubmit} disabled={selectedLeads.length === 0 || isSubmitting || loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isSubmitting || loading ? <><FiRefreshCw className="animate-spin text-sm" /> Assigning...</> : <><FiUserCheck className="text-sm" /> Assign {selectedLeads.length} Lead(s)</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ VIEW ASSIGNED LEADS MODAL - UPDATED ============
const ViewAssignedLeadsModal = ({ manager, leads, show, onClose, onViewLeadProfile }) => {
  if (!show || !manager) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assigned Leads</h2>
              <p className="text-white/70 text-[10px]">Leads assigned to {manager.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#5A7D78]">{leads?.length || 0} lead(s) assigned so far</span>
          </div>

          {(!leads || leads.length === 0) ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-2xl text-[#B5C9C5]" />
              </div>
              <p className="text-sm text-[#5A7D78]">No leads assigned yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leads.map((lead, idx) => (
                <div key={`${lead.id}_${idx}`} className="p-3 rounded-xl border border-[#E8F0EE] bg-[#F5F9F8]">
                  {/* Name - First Line */}
                  <p className="font-semibold text-sm text-[#1A2E2A]">{lead.name}</p>
                  
                  {/* Property Details - Second Line */}
                  <div className="flex items-center gap-1.5 text-sm text-[#5A7D78] mt-0.5">
                    <span className="font-medium text-[#00695C]">{lead.propertyType || 'Apartment'}</span>
                    <span className="text-[#B5C9C5]">·</span>
                    <span>{lead.bhk || '2 BHK'}</span>
                    <span className="text-[#B5C9C5]">·</span>
                    <span>{lead.city || lead.location || 'Mumbai'}</span>
                    <span className="text-[#B5C9C5]">·</span>
                    <span>{lead.phone || '+91 98765 43210'}</span>
                    {lead.assignedDate && (
                      <>
                        <span className="text-[#3b3e3d]">·</span>
                        <span className="text-[12px] text-[#7d8583]">
                          {new Date(lead.assignedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
};

// ============ COMMISSION TRACKING MODAL ============
const CommissionTrackingModal = ({ manager, show, onClose }) => {
  const [commissionData, setCommissionData] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });

  useEffect(() => {
    if (show && manager) {
      const mockCommissions = [
        { id: 1, property: 'Luxury Villa in Mumbai', price: 45000000, commission: 450000, date: '2026-01-15', status: 'paid' },
        { id: 2, property: 'Modern Apartment in Delhi', price: 12000000, commission: 120000, date: '2026-01-10', status: 'pending' },
        { id: 3, property: 'Commercial Space in Bangalore', price: 25000000, commission: 250000, date: '2026-01-05', status: 'paid' },
        { id: 4, property: 'Family Home in Chennai', price: 18000000, commission: 180000, date: '2025-12-28', status: 'pending' },
        { id: 5, property: 'Beachfront Villa in Goa', price: 55000000, commission: 550000, date: '2025-12-20', status: 'paid' },
        { id: 6, property: 'Penthouse in Hyderabad', price: 32000000, commission: 320000, date: '2025-12-15', status: 'pending' },
        { id: 7, property: 'Garden House in Pune', price: 8500000, commission: 85000, date: '2025-12-10', status: 'paid' },
        { id: 8, property: 'Office Space in Noida', price: 22000000, commission: 220000, date: '2025-12-05', status: 'pending' },
      ];
      setCommissionData(mockCommissions);
      setStats({
        total: mockCommissions.reduce((sum, c) => sum + c.commission, 0),
        paid: mockCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission, 0),
        pending: mockCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission, 0),
      });
    }
  }, [show, manager]);

  const handleExportCommission = useCallback(() => {
    if (!commissionData.length) return;
    const data = commissionData.map(item => ({
      Property: item.property,
      Price: item.price,
      Commission: item.commission,
      Date: item.date,
      Status: item.status,
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commission_${(manager?.name || 'manager').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }, [commissionData, manager]);

  if (!show || !manager) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiDollarSign className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Commission Tracking</h2>
              <p className="text-white/70 text-[10px]">Commission details for {manager.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
              <p className="text-lg font-bold text-[#1A2E2A]">₹{stats.total.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-xl border-l-4 border-l-emerald-500">
              <p className="text-lg font-bold text-emerald-600">₹{stats.paid.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-emerald-600">Paid</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl border-l-4 border-l-amber-500">
              <p className="text-lg font-bold text-amber-600">₹{stats.pending.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-amber-600">Pending</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Transaction History</h4>
            <div className="space-y-2">
              {commissionData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A2E2A] truncate">{item.property}</p>
                    <div className="flex items-center gap-3 text-xs text-[#5A7D78]">
                      <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-[#00695C]">₹{item.commission.toLocaleString()}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={handleExportCommission} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]">
            <FiDownload className="inline mr-2 text-sm" /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ PERFORMANCE REPORT MODAL ============
const PerformanceReportModal = ({ manager, show, onClose }) => {
  if (!show || !manager) return null;

  const performanceData = {
    totalProperties: manager.propertiesCount || 12,
    totalLeads: manager.leadsCount || 45,
    conversionRate: 68,
    avgResponseTime: '2.4 hrs',
    totalCommission: 1875000,
    monthlyPerformance: [
      { month: 'Aug', properties: 3, leads: 8 },
      { month: 'Sep', properties: 2, leads: 7 },
      { month: 'Oct', properties: 4, leads: 10 },
      { month: 'Nov', properties: 2, leads: 6 },
      { month: 'Dec', properties: 5, leads: 12 },
      { month: 'Jan', properties: 3, leads: 9 },
    ]
  };

  const maxValue = Math.max(...performanceData.monthlyPerformance.map(m => m.properties));

  const handleExportPerformance = () => {
    const data = performanceData.monthlyPerformance.map(item => ({
      Month: item.month,
      Properties: item.properties,
      Leads: item.leads,
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance_${(manager?.name || 'manager').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiBarChart2 className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Performance Report</h2>
              <p className="text-white/70 text-[10px]">Performance metrics for {manager.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
              <p className="text-lg font-bold text-[#1A2E2A]">{performanceData.totalProperties}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Properties</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-blue-500">
              <p className="text-lg font-bold text-[#1A2E2A]">{performanceData.totalLeads}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Leads</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-emerald-500">
              <p className="text-lg font-bold text-[#00695C]">{performanceData.conversionRate}%</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Conversion</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-purple-500">
              <p className="text-lg font-bold text-[#00695C]">{performanceData.avgResponseTime}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Avg Response</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Monthly Performance</h4>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {performanceData.monthlyPerformance.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00695C] to-[#26A69A] transition-all duration-500 hover:opacity-80"
                        style={{ height: `${(item.properties / maxValue) * 80}px`, minHeight: '8px' }} />
                      <span className="text-[9px] font-medium text-[#1A2E2A]">{item.properties}</span>
                    </div>
                    <span className="text-[8px] text-[#5A7D78]">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Monthly Breakdown</h4>
            <div className="space-y-1.5">
              {performanceData.monthlyPerformance.map((item) => (
                <div key={item.month} className="flex items-center justify-between p-2 bg-[#F5F9F8] rounded-lg text-sm border-l-4 border-l-[#00695C]">
                  <span className="font-medium text-[#1A2E2A] w-12">{item.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[#5A7D78]">{item.properties} props</span>
                    <span className="text-[#5A7D78]">{item.leads} leads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={handleExportPerformance} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]">
            <FiDownload className="inline mr-2 text-sm" /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ VIEW PROPERTY MANAGER PROPERTIES MODAL ============
const ViewPropertyManagerPropertiesModal = ({
  manager,
  show,
  onClose,
  showToast,
  onViewProfile,
}) => {
  const [properties, setProperties] = useState([]);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    confirmColor: 'bg-red-500',
    icon: <FiAlertTriangle className="text-3xl text-red-500" />,
    onConfirm: null,
  });

  useEffect(() => {
    if (show && manager) {
      const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
      const statuses = ['pending', 'approved', 'rejected', 'suspended'];
      const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
      const titles = [
        'Luxury Apartment with Sea View', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite',
        'Cozy Studio Apartment', 'Commercial Office Space', 'Garden House', 'Lake View Apartment',
        'City Center Condo', 'Hostel Building', 'Land for Development', 'Beachfront Villa'
      ];
      const amenityList = ['WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym', 'Security', 'CCTV', 'Garden'];

      const rand = seededRandom(seedFromString(manager.id));
      const count = Math.min(Math.max(manager.propertiesCount || 4, 1), 12);

      const generated = Array.from({ length: count }, (_, idx) => {
        const type = propertyTypes[Math.floor(rand() * propertyTypes.length)];
        const status = statuses[Math.floor(rand() * statuses.length)];
        const city = cities[Math.floor(rand() * cities.length)];
        const bedrooms = type === 'Land & Plots' ? 0 : Math.floor(rand() * 4) + 1;
        const bathrooms = type === 'Land & Plots' ? 0 : Math.floor(rand() * 3) + 1;
        const amenities = amenityList.filter(() => rand() > 0.5).slice(0, 5);

        return {
          id: `${manager.id}_p${idx + 1}`,
          title: `${titles[Math.floor(rand() * titles.length)]} ${idx + 1}`,
          type,
          location: `${city}, India`,
          price: Math.floor(rand() * 45000000) + 5000000,
          status,
          bedrooms,
          bathrooms,
          area: Math.floor(rand() * 3000) + 400,
          areaUnit: 'sq ft',
          isFeatured: rand() > 0.75,
          isVerified: rand() > 0.6,
          views: Math.floor(rand() * 400),
          inquiries: Math.floor(rand() * 30),
          managerName: manager.name,
          description: `${type} managed by ${manager.name} in ${city}. Well-maintained with modern amenities.`,
          amenities,
        };
      });

      setProperties(generated);
    }
  }, [show, manager]);

  const showConfirmation = useCallback(({ title, message, confirmText, confirmColor, icon, onConfirm }) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmColor,
      icon,
      onConfirm,
    });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm();
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  const handleViewProperty = (property) => {
    setViewingProperty(property);
    setShowViewModal(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedData) => {
    setActionLoading('edit');
    setTimeout(() => {
      setProperties(prev => prev.map(p =>
        p.id === editingProperty.id ? { ...p, ...updatedData } : p
      ));
      setShowEditModal(false);
      setEditingProperty(null);
      setActionLoading(null);
      if (showToast) showToast('Property updated successfully!', 'success');
    }, 600);
  };

  const handleDeleteProperty = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    showConfirmation({
      title: 'Delete Property',
      message: `Are you sure you want to delete "${property?.title || 'this property'}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setActionLoading(`delete_${propertyId}`);
        setTimeout(() => {
          setProperties(prev => prev.filter(p => p.id !== propertyId));
          setActionLoading(null);
          if (showToast) showToast('Property deleted successfully!', 'error');
        }, 600);
      }
    });
  };

  const handleToggleFeature = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    const isFeatured = property?.isFeatured;
    showConfirmation({
      title: isFeatured ? 'Remove Feature' : 'Feature Property',
      message: isFeatured
        ? `Are you sure you want to remove featured status from "${property?.title}"?`
        : `Are you sure you want to feature "${property?.title}"? It will be highlighted in listings.`,
      confirmText: isFeatured ? 'Yes, Unfeature' : 'Yes, Feature',
      confirmColor: isFeatured ? 'bg-purple-500' : 'bg-amber-500',
      icon: isFeatured ? <FiXCircle className="text-3xl text-purple-500" /> : <FaStarSolid className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setActionLoading(`feature_${propertyId}`);
        setTimeout(() => {
          setProperties(prev => prev.map(p =>
            p.id === propertyId ? { ...p, isFeatured: !p.isFeatured } : p
          ));
          setActionLoading(null);
          if (showToast) showToast(`Property ${isFeatured ? 'unfeatured' : 'featured'} successfully!`, 'success');
        }, 400);
      }
    });
  };

  const handleToggleVerify = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    const isVerified = property?.isVerified;
    showConfirmation({
      title: isVerified ? 'Unverify Property' : 'Verify Property',
      message: isVerified
        ? `Are you sure you want to unverify "${property?.title}"? The verified badge will be removed.`
        : `Are you sure you want to verify "${property?.title}"? It will get a verified badge.`,
      confirmText: isVerified ? 'Yes, Unverify' : 'Yes, Verify',
      confirmColor: isVerified ? 'bg-blue-500' : 'bg-emerald-500',
      icon: isVerified ? <FiXCircle className="text-3xl text-blue-500" /> : <FiShield className="text-3xl text-emerald-500" />,
      onConfirm: () => {
        setActionLoading(`verify_${propertyId}`);
        setTimeout(() => {
          setProperties(prev => prev.map(p =>
            p.id === propertyId ? { ...p, isVerified: !p.isVerified } : p
          ));
          setActionLoading(null);
          if (showToast) showToast(`Property ${isVerified ? 'unverified' : 'verified'} successfully!`, 'success');
        }, 400);
      }
    });
  };

  if (!show || !manager) return null;

  return (
    <>
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
        loading={actionLoading !== null}
      />

      <ViewPropertyModal
        property={viewingProperty}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingProperty(null); }}
      />

      <EditPropertyModal
        property={editingProperty}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingProperty(null); }}
        onSave={handleSaveEdit}
        loading={actionLoading === 'edit'}
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
          <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <FiHome className="text-sm" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Property Manager Properties</h2>
                <p className="text-white/70 text-[10px]">Properties managed by {manager.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
              <FiX className="text-sm" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C] mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-[#00695C] flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {manager.name?.charAt(0) || 'P'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#1A2E2A] truncate">{manager.name}</p>
                  <p className="text-xs text-[#5A7D78] truncate">{manager.email} · {manager.phone}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] px-2 py-0.5 rounded-full">
                      {properties.length} Properties
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {properties.filter(p => p.status === 'approved').length} Active
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onViewProfile && onViewProfile(manager.id)}
                className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-medium flex items-center gap-2 hover:scale-105 shrink-0"
              >
                <FiExternalLink className="text-xs" />
                View Profile
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                  <FiHome className="text-2xl text-[#B5C9C5]" />
                </div>
                <p className="text-sm text-[#5A7D78]">No properties managed by this property manager</p>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className={`flex items-center p-3 bg-[#F5F9F8] rounded-xl hover:shadow-md transition-all duration-300 border-l-4 ${STATUS_BORDER[property.status] || 'border-l-gray-400'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-[#1A2E2A] truncate">{property.title}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[property.status] || 'bg-gray-100 text-gray-700'}`}>
                          {property.status}
                        </span>
                        {property.isFeatured && <FaStarSolid className="text-amber-500 text-xs" />}
                        {property.isVerified && <FiShield className="text-blue-600 text-xs" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A7D78] mt-0.5">
                        <span>{property.location}</span>
                        <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                        <span>{property.type}</span>
                        <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                        <span>{property.bedrooms} Beds · {property.bathrooms} Baths</span>
                        <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                        <span>{property.area} {property.areaUnit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-[#00695C]">₹{property.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <button onClick={() => handleViewProperty(property)}
                          className="p-1.5 rounded-lg hover:bg-white transition-all duration-300 text-[#5A7D78] hover:text-[#00695C] hover:scale-110" title="View">
                          <FiEye className="text-sm" />
                        </button>
                        <button onClick={() => handleEditProperty(property)}
                          className="p-1.5 rounded-lg hover:bg-white transition-all duration-300 text-[#5A7D78] hover:text-blue-600 hover:scale-110" title="Edit">
                          <FiEdit className="text-sm" />
                        </button>
                        <button onClick={() => handleToggleFeature(property.id)} disabled={actionLoading === `feature_${property.id}`}
                          className={`p-1.5 rounded-lg hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50 ${property.isFeatured ? 'text-purple-600' : 'text-[#5A7D78]'}`} title={property.isFeatured ? 'Unfeature' : 'Feature'}>
                          {actionLoading === `feature_${property.id}` ? <FiRefreshCw className="text-sm animate-spin" /> : <FaStarSolid className="text-sm" />}
                        </button>
                        <button onClick={() => handleToggleVerify(property.id)} disabled={actionLoading === `verify_${property.id}`}
                          className={`p-1.5 rounded-lg hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50 ${property.isVerified ? 'text-blue-600' : 'text-[#5A7D78]'}`} title={property.isVerified ? 'Unverify' : 'Verify'}>
                          {actionLoading === `verify_${property.id}` ? <FiRefreshCw className="text-sm animate-spin" /> : <FiShield className="text-sm" />}
                        </button>
                        <button onClick={() => handleDeleteProperty(property.id)} disabled={actionLoading === `delete_${property.id}`}
                          className="p-1.5 rounded-lg hover:bg-white transition-all duration-300 text-[#5A7D78] hover:text-red-500 hover:scale-110 disabled:opacity-50" title="Delete">
                          {actionLoading === `delete_${property.id}` ? <FiRefreshCw className="text-sm animate-spin" /> : <FiTrash2 className="text-sm" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============ MAIN COMPONENT ============
const PropertyManagersPropertiesLeads = () => {
  const navigate = useNavigate();

  // ============ STATE ============
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterCount, setFilterCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal states
  const [assignLeadManager, setAssignLeadManager] = useState(null);
  const [showAssignLeadModal, setShowAssignLeadModal] = useState(false);
  const [commissionManager, setCommissionManager] = useState(null);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [performanceManager, setPerformanceManager] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [viewPropertiesManager, setViewPropertiesManager] = useState(null);
  const [showViewPropertiesModal, setShowViewPropertiesModal] = useState(false);

  // Assigned leads tracking
  const [assignedLeadsMap, setAssignedLeadsMap] = useState({});
  const [assignedLeadsManager, setAssignedLeadsManager] = useState(null);
  const [showAssignedLeadsModal, setShowAssignedLeadsModal] = useState(false);

  const searchInputRef = useRef(null);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmColor: 'bg-red-500',
    icon: <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm: null,
    managerId: null,
    action: null,
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    topPerformers: 0,
    totalProperties: 0,
    totalLeads: 0,
    totalCommission: 0,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK MANAGERS ============
  const generateMockManagers = useCallback(() => {
    const managerNames = [
      'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel',
      'Vikram Reddy', 'Deepak Verma', 'Meera Joshi', 'Arjun Nair',
      'Kavya Rao', 'Suresh Gupta', 'Ananya Menon', 'Ravi Desai',
      'Pooja Iyer', 'Sanjay Chopra', 'Neha Kapoor'
    ];

    const specialties = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const statuses = ['active', 'inactive', 'pending'];

    return managerNames.map((name, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      return {
        id: `manager_${i + 1}`,
        name: name,
        email: `${name.toLowerCase().replace(' ', '.')}@realestate.com`,
        phone: `+91 98765${String(43210 + i).padStart(5, '0')}`,
        specialty: specialty,
        city: city,
        status: status,
        rating: Math.floor(Math.random() * 20 + 80) / 10,
        experience: Math.floor(Math.random() * 10) + 1,
        propertiesCount: Math.floor(Math.random() * 12) + 1,
        leadsCount: Math.floor(Math.random() * 30) + 5,
        commission: Math.floor(Math.random() * 5000000 + 500000),
        joinedDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
      };
    });
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockManagers = generateMockManagers();
    setManagers(mockManagers);
    setFilteredManagers(mockManagers);
    updateStats(mockManagers);
  }, [generateMockManagers]);

  // ============ UPDATE STATS ============
  const updateStats = useCallback((managersList) => {
    const totalProperties = managersList.reduce((sum, a) => sum + (a.propertiesCount || 0), 0);
    const totalLeads = managersList.reduce((sum, a) => sum + (a.leadsCount || 0), 0);
    const totalCommission = managersList.reduce((sum, a) => sum + (a.commission || 0), 0);

    setStats({
      total: managersList.length,
      active: managersList.filter(a => a.status === 'active').length,
      inactive: managersList.filter(a => a.status === 'inactive').length,
      pending: managersList.filter(a => a.status === 'pending').length,
      topPerformers: managersList.filter(a => (a.rating || 0) >= 4.5).length,
      totalProperties,
      totalLeads,
      totalCommission,
    });
  }, []);

  // ============ FILTER MANAGERS ============
  const filterManagers = useCallback(() => {
    let filtered = [...managers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.city.toLowerCase().includes(query) ||
        a.specialty.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(a => a.specialty.toLowerCase() === selectedSpecialty.toLowerCase());
    }

    if (activeFilter === 'top') {
      filtered = filtered.filter(a => (a.rating || 0) >= 4.5);
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedSpecialty !== 'all') count++;
    if (searchQuery) count++;
    if (activeFilter === 'top') count++;
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

    setFilteredManagers(filtered);
    setCurrentPage(1);
  }, [managers, searchQuery, selectedStatus, selectedSpecialty, sortField, sortDirection, activeFilter]);

  useEffect(() => {
    filterManagers();
  }, [filterManagers]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredManagers.length / pageSize);
  const paginatedManagers = useMemo(() =>
    filteredManagers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredManagers, currentPage, pageSize]);

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
    if (selectedManagers.length === paginatedManagers.length) {
      setSelectedManagers([]);
    } else {
      setSelectedManagers(paginatedManagers.map(a => a.id));
    }
  }, [selectedManagers, paginatedManagers]);

  // ============ HANDLE SELECT MANAGER ============
  const handleSelectManager = useCallback((managerId) => {
    setSelectedManagers(prev =>
      prev.includes(managerId) ? prev.filter(id => id !== managerId) : [...prev, managerId]
    );
  }, []);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);

    if (filter === 'all') {
      setSelectedStatus('all');
      setSelectedSpecialty('all');
    } else if (filter === 'active') {
      setSelectedStatus('active');
      setSelectedSpecialty('all');
    } else if (filter === 'inactive') {
      setSelectedStatus('inactive');
      setSelectedSpecialty('all');
    } else if (filter === 'pending') {
      setSelectedStatus('pending');
      setSelectedSpecialty('all');
    } else if (filter === 'top') {
      setSelectedStatus('all');
      setSelectedSpecialty('all');
    }

    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedSpecialty('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ SHOW CONFIRMATION MODAL ============
  const showConfirmation = useCallback(({
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    confirmColor = 'bg-red-500',
    icon = <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm,
    managerId,
    action,
  }) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmColor,
      icon,
      onConfirm,
      managerId,
      action,
    });
  }, []);

  // ============ CLOSE CONFIRMATION MODAL ============
  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ============ HANDLE CONFIRM ACTION ============
  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, managerId, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${managerId}`);
      await onConfirm(managerId);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ VIEW MANAGER PROPERTIES ============
  const handleViewManagerProperties = useCallback((manager) => {
    setViewPropertiesManager(manager);
    setShowViewPropertiesModal(true);
  }, []);

  // ============ VIEW MANAGER PROFILE ============
  const handleViewManagerProfile = useCallback((managerId) => {
    navigate('/profile/property-management');
    showToast('Opening Property Manager Profile...', 'info');
  }, [navigate, showToast]);

  // ============ VIEW LEAD PROFILE ============
  const handleViewLeadProfile = useCallback((lead) => {
    navigate('/profile/property-management', { state: { lead } });
    showToast(`Opening ${lead.name}'s Profile...`, 'info');
  }, [navigate, showToast]);

  // ============ ASSIGN LEADS ============
  const handleAssignLeads = useCallback((manager) => {
    setAssignLeadManager(manager);
    setShowAssignLeadModal(true);
  }, []);

  const handleAssignLeadsSubmit = useCallback((managerId, leadObjects) => {
    setActionLoading(`assign_${managerId}`);
    setTimeout(() => {
      setManagers(prev => {
        const updated = prev.map(manager => {
          if (manager.id === managerId) {
            const newLeadsCount = (manager.leadsCount || 0) + leadObjects.length;
            showToast(`${leadObjects.length} lead(s) assigned to ${manager.name} successfully`, 'success');
            return { ...manager, leadsCount: newLeadsCount };
          }
          return manager;
        });
        updateStats(updated);
        return updated;
      });

      setAssignedLeadsMap(prev => {
        const existing = prev[managerId] || [];
        const withDate = leadObjects.map(l => ({ ...l, assignedDate: new Date().toISOString() }));
        return { ...prev, [managerId]: [...existing, ...withDate] };
      });

      setActionLoading(null);
      setShowAssignLeadModal(false);
      setAssignLeadManager(null);
    }, 800);
  }, [showToast, updateStats]);

  // ============ VIEW ASSIGNED LEADS ============
  const handleViewAssignedLeads = useCallback((manager) => {
    setAssignedLeadsManager(manager);
    setShowAssignedLeadsModal(true);
  }, []);

  // ============ VIEW COMMISSION ============
  const handleViewCommission = useCallback((manager) => {
    setCommissionManager(manager);
    setShowCommissionModal(true);
  }, []);

  // ============ VIEW PERFORMANCE ============
  const handleViewPerformance = useCallback((manager) => {
    setPerformanceManager(manager);
    setShowPerformanceModal(true);
  }, []);

  // ============ TOGGLE MANAGER STATUS ============
  const handleToggleStatus = useCallback((managerId) => {
    const manager = managers.find(a => a.id === managerId);
    if (!manager) return;

    const isActive = manager.status === 'active';

    showConfirmation({
      title: isActive ? 'Deactivate Property Manager' : 'Activate Property Manager',
      message: isActive
        ? `Are you sure you want to deactivate ${manager.name}? They will no longer be able to manage properties.`
        : `Are you sure you want to activate ${manager.name}? They will be able to manage properties again.`,
      confirmText: isActive ? 'Yes, Deactivate' : 'Yes, Activate',
      confirmColor: isActive ? 'bg-red-500' : 'bg-emerald-500',
      icon: isActive ? <FiUserX className="text-4xl text-red-500" /> : <FiUserCheck className="text-4xl text-emerald-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setManagers(prev => {
              const updated = prev.map(a => {
                if (a.id === id) {
                  const newStatus = a.status === 'active' ? 'inactive' : 'active';
                  showToast(`${a.name} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
                  return { ...a, status: newStatus };
                }
                return a;
              });
              updateStats(updated);
              return updated;
            });
            resolve();
          }, 600);
        });
      },
      managerId,
      action: 'toggle_status',
    });
  }, [managers, showConfirmation, showToast, updateStats]);

  // ============ DELETE MANAGER ============
  const handleDeleteManager = useCallback((managerId) => {
    const manager = managers.find(a => a.id === managerId);
    if (!manager) return;

    showConfirmation({
      title: 'Delete Property Manager',
      message: `Are you sure you want to delete ${manager.name}? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setManagers(prev => {
              const updated = prev.filter(a => a.id !== id);
              updateStats(updated);
              showToast(`Property Manager deleted successfully`, 'error');
              return updated;
            });
            resolve();
          }, 600);
        });
      },
      managerId,
      action: 'delete',
    });
  }, [managers, showConfirmation, showToast, updateStats]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedManagers.length === 0) {
      showToast('Please select property managers first', 'warning');
      return;
    }

    const actionMap = {
      activate: {
        title: 'Activate Property Managers',
        message: `Are you sure you want to activate ${selectedManagers.length} selected property manager(s)?`,
        confirmText: 'Yes, Activate All',
        confirmColor: 'bg-emerald-500',
        icon: <FiUserCheck className="text-4xl text-emerald-500" />,
      },
      deactivate: {
        title: 'Deactivate Property Managers',
        message: `Are you sure you want to deactivate ${selectedManagers.length} selected property manager(s)?`,
        confirmText: 'Yes, Deactivate All',
        confirmColor: 'bg-red-500',
        icon: <FiUserX className="text-4xl text-red-500" />,
      },
      delete: {
        title: 'Delete Property Managers',
        message: `Are you sure you want to delete ${selectedManagers.length} selected property manager(s)? This action cannot be undone.`,
        confirmText: 'Yes, Delete All',
        confirmColor: 'bg-red-500',
        icon: <FiTrash2 className="text-4xl text-red-500" />,
      }
    };

    const config = actionMap[action];
    if (!config) return;

    showConfirmation({
      ...config,
      onConfirm: () => {
        return new Promise((resolve) => {
          setActionLoading(action);
          setTimeout(() => {
            const selectedIds = new Set(selectedManagers);
            let updatedManagers = [...managers];

            updatedManagers = updatedManagers.map(a => {
              if (selectedIds.has(a.id)) {
                if (action === 'activate') {
                  return { ...a, status: 'active' };
                } else if (action === 'deactivate') {
                  return { ...a, status: 'inactive' };
                } else if (action === 'delete') {
                  return null;
                }
              }
              return a;
            }).filter(Boolean);

            setManagers(updatedManagers);
            updateStats(updatedManagers);
            setSelectedManagers([]);
            setActionLoading(null);
            showToast(`${selectedManagers.length} property manager(s) ${action === 'activate' ? 'activated' : action === 'deactivate' ? 'deactivated' : 'deleted'}`, 'success');
            resolve();
          }, 800);
        });
      },
      managerId: 'bulk',
      action: action,
    });
  }, [selectedManagers, managers, showConfirmation, showToast, updateStats]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockManagers = generateMockManagers();
      setManagers(mockManagers);
      setFilteredManagers(mockManagers);
      updateStats(mockManagers);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockManagers, showToast, updateStats]);

  // ============ EXPORT MANAGERS ============
  const handleExportManagers = useCallback(() => {
    const data = filteredManagers.map(a => ({
      Name: a.name,
      Email: a.email,
      Phone: a.phone,
      Specialty: a.specialty,
      City: a.city,
      Status: a.status,
      Rating: a.rating,
      Experience: `${a.experience} years`,
      Properties: a.propertiesCount,
      Leads: a.leadsCount,
      Commission: a.commission,
      'Joined Date': new Date(a.joinedDate).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `property_managers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredManagers.length} property managers exported successfully`, 'success');
  }, [filteredManagers, showToast]);

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Toast */}
      <Toast toast={toast} />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
        loading={actionLoading !== null}
      />

      {/* Assign Leads Modal */}
      <AssignLeadsModal
        manager={assignLeadManager}
        show={showAssignLeadModal}
        onClose={() => { setShowAssignLeadModal(false); setAssignLeadManager(null); }}
        onAssign={handleAssignLeadsSubmit}
        onViewLeadProfile={handleViewLeadProfile}
        loading={actionLoading !== null}
      />

      {/* View Assigned Leads Modal */}
      <ViewAssignedLeadsModal
        manager={assignedLeadsManager}
        leads={assignedLeadsManager ? (assignedLeadsMap[assignedLeadsManager.id] || []) : []}
        show={showAssignedLeadsModal}
        onClose={() => { setShowAssignedLeadsModal(false); setAssignedLeadsManager(null); }}
        onViewLeadProfile={handleViewLeadProfile}
      />

      {/* Commission Tracking Modal */}
      <CommissionTrackingModal
        manager={commissionManager}
        show={showCommissionModal}
        onClose={() => { setShowCommissionModal(false); setCommissionManager(null); }}
      />

      {/* Performance Report Modal */}
      <PerformanceReportModal
        manager={performanceManager}
        show={showPerformanceModal}
        onClose={() => { setShowPerformanceModal(false); setPerformanceManager(null); }}
      />

      {/* View Property Manager Properties Modal */}
      <ViewPropertyManagerPropertiesModal
        manager={viewPropertiesManager}
        show={showViewPropertiesModal}
        onClose={() => { setShowViewPropertiesModal(false); setViewPropertiesManager(null); }}
        showToast={showToast}
        onViewProfile={handleViewManagerProfile}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Properties & Leads
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredManagers.length} Property Managers
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage property manager listings, assign leads, track performance & commissions</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiActivity className={`text-sm transition-transform duration-300 ${showStats ? 'rotate-0' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportManagers}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<MdOutlineRealEstateAgent className="text-white text-sm" />}
                title="Total Managers"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiUserCheck className="text-white text-sm" />}
                title="Active"
                value={stats.active}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={100}
                isActive={activeFilter === 'active'}
                onClick={() => handleStatClick('active')}
              />
              <StatCard
                icon={<FiUserX className="text-white text-sm" />}
                title="Inactive"
                value={stats.inactive}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={200}
                isActive={activeFilter === 'inactive'}
                onClick={() => handleStatClick('inactive')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={300}
                isActive={activeFilter === 'pending'}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FaCrown className="text-white text-sm" />}
                title="Top Performers"
                value={stats.topPerformers}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={350}
                isActive={activeFilter === 'top'}
                onClick={() => handleStatClick('top')}
              />
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Total Properties"
                value={stats.totalProperties}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={400}
                isActive={false}
                onClick={() => {}}
              />
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Leads"
                value={stats.totalLeads}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={450}
                isActive={false}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search property managers by name, email, city, or specialty..."
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
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Specialties</option>
                <option value="individual">Individual</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="land & plots">Land & Plots</option>
                <option value="hostel">Hostel</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
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
                <FiGrid className="text-sm" />
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

        {/* Bulk Actions */}
        {selectedManagers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedManagers.length}</span> property manager(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={actionLoading === 'activate'}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'activate' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiUserCheck className="text-[10px]" />}
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                disabled={actionLoading === 'deactivate'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'deactivate' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiUserX className="text-[10px]" />}
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete
              </button>
              <button
                onClick={() => setSelectedManagers([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Managers Grid */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedManagers.map((manager, index) => {
              const isSelected = selectedManagers.includes(manager.id);
              const statusColors = {
                active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                inactive: 'bg-gray-100 text-gray-700 border-gray-200',
                pending: 'bg-amber-100 text-amber-700 border-amber-200'
              };
              const managerBorder = {
                active: 'border-l-emerald-500',
                inactive: 'border-l-gray-400',
                pending: 'border-l-amber-500',
              };
              const assignedCount = (assignedLeadsMap[manager.id] || []).length;

              return (
                <div
                  key={manager.id}
                  className={`relative bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${managerBorder[manager.status] || 'border-l-[#00695C]'} p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectManager(manager.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {manager.name.charAt(0)}
                        </div>
                        {manager.status === 'active' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A2E2A] text-sm">{manager.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[manager.status] || 'bg-gray-100 text-gray-700'}`}>
                            {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <FaStarSolid className="text-amber-400 text-[10px]" />
                            <span className="text-xs font-medium text-[#1A2E2A]">{manager.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewManagerProperties(manager)}
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View Properties"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{manager.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{manager.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span>{manager.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span>{manager.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Joined: {new Date(manager.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{manager.propertiesCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{manager.leadsCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#00695C]">₹{(manager.commission / 100000).toFixed(1)}L</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Commission</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      onClick={() => handleAssignLeads(manager)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiUserCheck className="text-[10px]" /> Assign Leads
                    </button>
                    <button
                      onClick={() => handleViewAssignedLeads(manager)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 relative"
                    >
                      <FiEye className="text-[10px]" /> Assigned
                      {assignedCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-semibold">
                          {assignedCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleViewCommission(manager)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiDollarSign className="text-[10px]" /> Commission
                    </button>
                    <button
                      onClick={() => handleViewPerformance(manager)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiBarChart2 className="text-[10px]" /> Performance
                    </button>
                    <button
                      onClick={() => handleViewManagerProperties(manager)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiHome className="text-[10px]" /> Properties
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <button
                      onClick={() => handleViewManagerProfile(manager.id)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiExternalLink className="text-[10px]" /> View Profile
                    </button>
                    <button
                      onClick={() => handleToggleStatus(manager.id)}
                      disabled={actionLoading === `toggle_status_${manager.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        manager.status === 'active'
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : manager.status === 'inactive'
                          ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      }`}
                    >
                      {actionLoading === `toggle_status_${manager.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : manager.status === 'active' ? (
                        <FiUserX className="text-[10px]" />
                      ) : (
                        <FiUserCheck className="text-[10px]" />
                      )}
                      {manager.status === 'active' ? 'Deactivate' : manager.status === 'inactive' ? 'Activate' : 'Review'}
                    </button>
                    <button
                      onClick={() => handleDeleteManager(manager.id)}
                      disabled={actionLoading === `delete_${manager.id}`}
                      className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${manager.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : (
                        <FiTrash2 className="text-[10px]" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedManagers.length === paginatedManagers.length && paginatedManagers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>#</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('specialty')}>
                Specialty {sortField === 'specialty' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">City</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertiesCount')}>
                Props {sortField === 'propertiesCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('leadsCount')}>
                Leads {sortField === 'leadsCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('commission')}>
                Commission {sortField === 'commission' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('rating')}>
                Rating {sortField === 'rating' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedManagers.map((manager, index) => {
              const isSelected = selectedManagers.includes(manager.id);
              const statusColors = {
                active: 'bg-emerald-100 text-emerald-700',
                inactive: 'bg-gray-100 text-gray-700',
                pending: 'bg-amber-100 text-amber-700'
              };
              const managerBorder = {
                active: 'border-l-emerald-500',
                inactive: 'border-l-gray-400',
                pending: 'border-l-amber-500',
              };

              return (
                <div
                  key={manager.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] border-l-4 ${managerBorder[manager.status] || 'border-l-[#00695C]'} hover:bg-[#F5F9F8] transition-all duration-300 group relative ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectManager(manager.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-xs text-[#5A7D78]">{index + 1}</span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xs font-bold">
                        {manager.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1A2E2A] truncate">{manager.name}</p>
                        <p className="text-[10px] text-[#5A7D78] truncate">{manager.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[manager.status] || 'bg-gray-100 text-gray-700'}`}>
                      {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{manager.specialty}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{manager.city}</div>

                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{manager.propertiesCount}</div>

                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{manager.leadsCount}</div>

                  <div className="col-span-1 text-center text-sm font-semibold text-[#00695C]">₹{(manager.commission / 100000).toFixed(1)}L</div>

                  <div className="col-span-1 text-center flex items-center justify-center gap-0.5">
                    <FaStarSolid className="text-amber-400 text-xs" />
                    <span className="text-sm font-medium text-[#1A2E2A]">{manager.rating}</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1 flex-wrap">
                    <button
                      onClick={() => handleAssignLeads(manager)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300 text-blue-600 hover:scale-110"
                      title="Assign Leads"
                    >
                      <FiUserCheck className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewAssignedLeads(manager)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 text-indigo-600 hover:scale-110 relative"
                      title="View Assigned Leads"
                    >
                      <FiEye className="text-sm" />
                      {(assignedLeadsMap[manager.id] || []).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[7px] flex items-center justify-center font-semibold">
                          {(assignedLeadsMap[manager.id] || []).length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleViewCommission(manager)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 transition-all duration-300 text-amber-600 hover:scale-110"
                      title="Commission"
                    >
                      <FiDollarSign className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewPerformance(manager)}
                      className="p-1.5 rounded-lg hover:bg-purple-50 transition-all duration-300 text-purple-600 hover:scale-110"
                      title="Performance"
                    >
                      <FiBarChart2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewManagerProperties(manager)}
                      className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                      title="Properties"
                    >
                      <FiHome className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewManagerProfile(manager.id)}
                      className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                      title="View Profile"
                    >
                      <FiExternalLink className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(manager.id)}
                      disabled={actionLoading === `toggle_status_${manager.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                        manager.status === 'active'
                          ? 'text-red-600 hover:bg-red-50'
                          : manager.status === 'inactive'
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                      title={manager.status === 'active' ? 'Deactivate' : manager.status === 'inactive' ? 'Activate' : 'Review'}
                    >
                      {actionLoading === `toggle_status_${manager.id}` ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : manager.status === 'active' ? (
                        <FiUserX className="text-sm" />
                      ) : (
                        <FiUserCheck className="text-sm" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteManager(manager.id)}
                      disabled={actionLoading === `delete_${manager.id}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === `delete_${manager.id}` ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : (
                        <FiTrash2 className="text-sm" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedManagers.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <MdOutlineRealEstateAgent className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No property managers found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No property managers match your current view'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105"
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
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredManagers.length)} of{' '}
              {filteredManagers.length} property managers
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300"
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
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PropertyManagersPropertiesLeads;