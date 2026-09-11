// src/components/dashboard/admin/Agents/AgentsPropertyControl.jsx

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
  FiVideo, FiCamera, FiUsers
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness } from 'react-icons/md';

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
      onClick={() => onClick()}
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

// ============ EDIT PROPERTY MODAL ============
const EditPropertyModal = ({ property, show, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property) {
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
        agentName: property.agentName || '',
        agentEmail: property.agentEmail || '',
        agentPhone: property.agentPhone || '',
        description: property.description || '',
        amenities: property.amenities ? property.amenities.join(', ') : '',
        parking: property.parking || 'None',
        views: property.views || 0,
        inquiries: property.inquiries || 0,
        listedDate: property.listedDate ? new Date(property.listedDate).toISOString().split('T')[0] : '',
      });
      setErrors({});
    }
  }, [property]);

  if (!property || !show || !formData) return null;

  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statusOptions = ['pending', 'approved', 'rejected', 'suspended'];
  const areaUnits = ['sq ft', 'sq m', 'acres', 'hectares'];

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
    if (!formData.agentName.trim()) newErrors.agentName = 'Agent name is required';
    if (!formData.agentEmail.trim()) newErrors.agentEmail = 'Agent email is required';
    if (formData.agentEmail && !/\S+@\S+\.\S+/.test(formData.agentEmail)) {
      newErrors.agentEmail = 'Valid email is required';
    }
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
      views: Number(formData.views) || 0,
      inquiries: Number(formData.inquiries) || 0,
    };

    setTimeout(() => {
      onSave(updatedData);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header - Compact */}
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

        {/* Form - Compact Design */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {/* Basic Information - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.title ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]`}
                placeholder="Enter property title"
              />
              {errors.title && <p className="text-[10px] text-red-500 mt-0.5">{errors.title}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.location ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]`}
                placeholder="City, State"
              />
              {errors.location && <p className="text-[10px] text-red-500 mt-0.5">{errors.location}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.price ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]`}
                placeholder="Enter price"
                min="0"
              />
              {errors.price && <p className="text-[10px] text-red-500 mt-0.5">{errors.price}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Listed Date</label>
              <input
                type="date"
                name="listedDate"
                value={formData.listedDate}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              />
            </div>
          </div>

          {/* Property Details - 4 Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Bedrooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                min="0"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Bathrooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                min="0"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.area ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]`}
                placeholder="Area"
                min="0"
              />
              {errors.area && <p className="text-[10px] text-red-500 mt-0.5">{errors.area}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Area Unit</label>
              <select
                name="areaUnit"
                value={formData.areaUnit}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                {areaUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Parking & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Parking</label>
              <input
                type="text"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                placeholder="e.g., 2 spots, Garage"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Amenities <span className="text-[#B5C9C5]">(comma separated)</span>
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                placeholder="WiFi, Pool, AC, Parking"
              />
            </div>
          </div>

          {/* Agent Information - 3 Column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Agent Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.agentName ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]`}
                placeholder="Full name"
              />
              {errors.agentName && <p className="text-[10px] text-red-500 mt-0.5">{errors.agentName}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Agent Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="agentEmail"
                value={formData.agentEmail}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.agentEmail ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]`}
                placeholder="agent@email.com"
              />
              {errors.agentEmail && <p className="text-[10px] text-red-500 mt-0.5">{errors.agentEmail}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Agent Phone</label>
              <input
                type="text"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
              placeholder="Describe the property..."
            />
          </div>

          {/* Additional Settings - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
              />
              <label className="text-xs font-medium text-[#1A2E2A]">Featured</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
              />
              <label className="text-xs font-medium text-[#1A2E2A]">Verified</label>
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Views</label>
              <input
                type="number"
                name="views"
                value={formData.views}
                onChange={handleChange}
                className="w-full px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                min="0"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Inquiries</label>
              <input
                type="number"
                name="inquiries"
                value={formData.inquiries}
                onChange={handleChange}
                className="w-full px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                min="0"
              />
            </div>
          </div>

          {/* Form Actions - Fixed at bottom */}
          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || loading ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="text-sm" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ VIEW PROPERTY MODAL ============
const ViewPropertyModal = ({ 
  property, 
  show, 
  onClose, 
  onEdit, 
  onToggleFeature, 
  onVerify, 
  onSuspend, 
  onDelete,
  onViewAgentProfile,
  onApprove,
  onReject
}) => {
  if (!property || !show) return null;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    suspended: 'bg-gray-100 text-gray-700',
    featured: 'bg-purple-100 text-purple-700',
    verified: 'bg-blue-100 text-blue-700'
  };

  const amenitiesList = property.amenities || ['WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym'];

  const handleViewProfile = () => {
    if (onViewAgentProfile) {
      onViewAgentProfile(property.agentId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl">
              <FaHome />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{property.title}</h2>
              <p className="text-white/80 text-sm">{property.type} · {property.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${statusColors[property.status] || 'bg-gray-100 text-gray-700'}`}>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">₹{property.price.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Price</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{property.views || 0}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Views</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{property.inquiries || 0}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Inquiries</p>
            </div>
          </div>

          {/* Agent Info with View Profile Button */}
          <div className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center text-white font-bold">
                {property.agentName?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2E2A]">{property.agentName || 'Unknown Agent'}</p>
                <p className="text-xs text-[#5A7D78]">Agent · {property.agentEmail || 'No email'}</p>
              </div>
            </div>
            <button
              onClick={handleViewProfile}
              className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-medium flex items-center gap-2 hover:scale-105"
            >
              <FiExternalLink className="text-xs" />
              My Profile
            </button>
          </div>

          {/* Details */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Property Details</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                <span className="text-[#00695C]"><FaBed className="text-sm" /></span>
                <span>Bedrooms: <span className="font-medium">{property.bedrooms}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                <span className="text-[#00695C]"><FaBath className="text-sm" /></span>
                <span>Bathrooms: <span className="font-medium">{property.bathrooms}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                <span className="text-[#00695C]"><FaRulerCombined className="text-sm" /></span>
                <span>Area: <span className="font-medium">{property.area} {property.areaUnit}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                <span className="text-[#00695C]"><FaParking className="text-sm" /></span>
                <span>Parking: <span className="font-medium">{property.parking || 'None'}</span></span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity, i) => (
                <span key={i} className="px-3 py-1 bg-[#F5F9F8] rounded-lg text-xs text-[#1A2E2A]">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-[#5A7D78] leading-relaxed">{property.description || 'No description available.'}</p>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-[#5A7D78] border-t border-[#E8F0EE] pt-3">
            <span>Listed: {new Date(property.listedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>Last Updated: {new Date(property.updatedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Footer Actions - Fixed at bottom */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-[#E8F0EE] flex flex-wrap items-center gap-2 bg-white">
          {property.status === 'pending' ? (
            <>
              <button
                onClick={() => onApprove && onApprove(property.id)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
              >
                <FiCheckCircle className="text-xs" /> Approve
              </button>
              <button
                onClick={() => onReject && onReject(property.id)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
              >
                <FiXCircle className="text-xs" /> Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#00695C] text-white hover:bg-[#004D40] transition-all duration-300"
              >
                <FiEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={onToggleFeature}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  property.isFeatured
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                <FaStarSolid className="text-xs" /> {property.isFeatured ? 'Unfeature' : 'Feature'}
              </button>
              <button
                onClick={onVerify}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  property.isVerified
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                <FiShield className="text-xs" /> {property.isVerified ? 'Unverify' : 'Verify'}
              </button>
              <button
                onClick={onSuspend}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                  property.status === 'suspended'
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <FiXCircle className="text-xs" /> {property.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
              </button>
              <button
                onClick={onDelete}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
              >
                <FiTrash2 className="text-xs" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const AgentsPropertyControl = () => {
  const navigate = useNavigate();

  // ============ STATE ============
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [editLoading, setEditLoading] = useState(false);
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
    propertyId: null,
    action: null,
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
    featured: 0,
    verified: 0,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK PROPERTIES ============
  const generateMockProperties = useCallback(() => {
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['pending', 'approved', 'rejected', 'suspended'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur'];
    const amenitiesList = ['WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym', 'Security', 'Balcony', 'Garden', 'Elevator', 'Furnished'];

    const agents = [
      { id: 'agent_1', name: 'Rahul Mehta', email: 'rahul.mehta@email.com', phone: '+91 9876543210' },
      { id: 'agent_2', name: 'Priya Desai', email: 'priya.desai@email.com', phone: '+91 9876543211' },
      { id: 'agent_3', name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '+91 9876543212' },
      { id: 'agent_4', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 9876543213' },
      { id: 'agent_5', name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '+91 9876543214' },
      { id: 'agent_6', name: 'Deepak Sharma', email: 'deepak.sharma@email.com', phone: '+91 9876543215' },
      { id: 'agent_7', name: 'Meera Iyer', email: 'meera.iyer@email.com', phone: '+91 9876543216' },
      { id: 'agent_8', name: 'Arjun Nair', email: 'arjun.nair@email.com', phone: '+91 9876543217' },
      { id: 'agent_9', name: 'Kavya Rao', email: 'kavya.rao@email.com', phone: '+91 9876543218' },
      { id: 'agent_10', name: 'Suresh Gupta', email: 'suresh.gupta@email.com', phone: '+91 9876543219' },
    ];

    const properties = [];
    const titles = [
      'Luxury Apartment with Sea View', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite',
      'Cozy Studio', 'Commercial Office Space', 'Garden House', 'Lake View Apartment',
      'City Center Condo', 'Suburban Family Home', 'Beachfront Villa', 'Sky Lounge Penthouse'
    ];

    for (let i = 1; i <= 60; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 120));

      const amenities = amenitiesList
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 5) + 3);

      properties.push({
        id: `prop_${i}`,
        title: titles[Math.floor(Math.random() * titles.length)] + ` ${i}`,
        type: type,
        location: `${city}, ${['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana'][Math.floor(Math.random() * 5)]}`,
        price: Math.floor(Math.random() * 50000000 + 5000000),
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 2000 + 500),
        areaUnit: 'sq ft',
        status: status,
        isFeatured: Math.random() > 0.8,
        isVerified: Math.random() > 0.7,
        agentName: agent.name,
        agentEmail: agent.email,
        agentPhone: agent.phone,
        agentId: agent.id,
        listedDate: date.toISOString(),
        updatedDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        views: Math.floor(Math.random() * 500),
        inquiries: Math.floor(Math.random() * 50),
        description: `Beautiful ${type.toLowerCase()} located in ${city}. Features ${Math.floor(Math.random() * 3) + 2} bedrooms and modern amenities. Perfect for families and professionals.`,
        amenities: amenities,
        parking: Math.random() > 0.5 ? `${Math.floor(Math.random() * 2) + 1} spots` : 'None',
        images: [`https://picsum.photos/seed/${i}/400/300`],
      });
    }

    return properties;
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockProperties = generateMockProperties();
    setProperties(mockProperties);
    setFilteredProperties(mockProperties);
    updateStats(mockProperties);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockProperties]);

  // ============ UPDATE STATS ============
  const updateStats = useCallback((props) => {
    setStats({
      total: props.length,
      pending: props.filter(p => p.status === 'pending').length,
      approved: props.filter(p => p.status === 'approved').length,
      rejected: props.filter(p => p.status === 'rejected').length,
      suspended: props.filter(p => p.status === 'suspended').length,
      featured: props.filter(p => p.isFeatured).length,
      verified: props.filter(p => p.isVerified).length,
    });
  }, []);

  // ============ FILTER PROPERTIES ============
  const filterProperties = useCallback(() => {
    let filtered = [...properties];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.agentName.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'verified') {
        filtered = filtered.filter(p => p.isVerified === true);
      } else if (selectedStatus === 'featured') {
        filtered = filtered.filter(p => p.isFeatured === true);
      } else {
        filtered = filtered.filter(p => p.status === selectedStatus);
      }
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type.toLowerCase() === selectedType.toLowerCase());
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (searchQuery) count++;
    setFilterCount(count);

    // Sorting
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
  }, [properties, searchQuery, selectedStatus, selectedType, sortField, sortDirection]);

  useEffect(() => {
    filterProperties();
  }, [filterProperties]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const paginatedProperties = useMemo(() =>
    filteredProperties.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredProperties, currentPage, pageSize]);

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
    if (selectedProperties.length === paginatedProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(paginatedProperties.map(p => p.id));
    }
  }, [selectedProperties, paginatedProperties]);

  // ============ HANDLE SELECT PROPERTY ============
  const handleSelectProperty = useCallback((propertyId) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setSelectedStatus('all');
      setSelectedType('all');
    } else if (filter === 'pending') {
      setSelectedStatus('pending');
      setSelectedType('all');
    } else if (filter === 'approved') {
      setSelectedStatus('approved');
      setSelectedType('all');
    } else if (filter === 'rejected') {
      setSelectedStatus('rejected');
      setSelectedType('all');
    } else if (filter === 'suspended') {
      setSelectedStatus('suspended');
      setSelectedType('all');
    } else if (filter === 'featured') {
      setSelectedStatus('featured');
      setSelectedType('all');
    } else if (filter === 'verified') {
      setSelectedStatus('verified');
      setSelectedType('all');
    }
    
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedType('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ VIEW PROPERTY ============
  const handleViewProperty = useCallback((property) => {
    setViewingProperty(property);
    setShowViewModal(true);
  }, []);

  // ============ VIEW AGENT PROFILE ============
  const handleViewAgentProfile = useCallback((agentId) => {
    navigate('/profile/agent');
    showToast('Opening Agent Profile...', 'info');
  }, [navigate, showToast]);

  // ============ EDIT PROPERTY ============
  const handleEditProperty = useCallback((property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const saveEdit = useCallback((updatedData) => {
    setEditLoading(true);
    setTimeout(() => {
      setProperties(prev => prev.map(property =>
        property.id === editingProperty.id 
          ? { 
              ...property, 
              ...updatedData,
              updatedDate: new Date().toISOString()
            } 
          : property
      ));
      setShowEditModal(false);
      setEditingProperty(null);
      setEditLoading(false);
      showToast('Property updated successfully!', 'success');
    }, 600);
  }, [editingProperty, showToast]);

  // ============ SHOW CONFIRMATION MODAL ============
  const showConfirmation = useCallback(({
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    confirmColor = 'bg-red-500',
    icon = <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm,
    propertyId,
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
      propertyId,
      action,
    });
  }, []);

  // ============ CLOSE CONFIRMATION MODAL ============
  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ============ HANDLE CONFIRM ACTION ============
  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, propertyId, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${propertyId}`);
      await onConfirm(propertyId);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ APPROVE PROPERTY ============
  const handleApproveProperty = useCallback((propertyId) => {
    showConfirmation({
      title: 'Approve Property',
      message: 'Are you sure you want to approve this property? It will be visible to all users.',
      confirmText: 'Yes, Approve',
      confirmColor: 'bg-emerald-500',
      icon: <FiCheckCircle className="text-4xl text-emerald-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProperties(prev => {
              const updated = prev.map(p => {
                if (p.id === id) {
                  showToast(`${p.title} approved successfully`, 'success');
                  return { ...p, status: 'approved' };
                }
                return p;
              });
              updateStats(updated);
              return updated;
            });
            if (viewingProperty && viewingProperty.id === id) {
              setViewingProperty(prev => ({ ...prev, status: 'approved' }));
            }
            resolve();
          }, 600);
        });
      },
      propertyId,
      action: 'approve',
    });
  }, [showConfirmation, showToast, updateStats, viewingProperty]);

  // ============ REJECT PROPERTY ============
  const handleRejectProperty = useCallback((propertyId) => {
    showConfirmation({
      title: 'Reject Property',
      message: 'Are you sure you want to reject this property? The agent will be notified.',
      confirmText: 'Yes, Reject',
      confirmColor: 'bg-red-500',
      icon: <FiXCircle className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProperties(prev => {
              const updated = prev.map(p => {
                if (p.id === id) {
                  showToast(`${p.title} rejected`, 'warning');
                  return { ...p, status: 'rejected' };
                }
                return p;
              });
              updateStats(updated);
              return updated;
            });
            if (viewingProperty && viewingProperty.id === id) {
              setViewingProperty(prev => ({ ...prev, status: 'rejected' }));
            }
            resolve();
          }, 600);
        });
      },
      propertyId,
      action: 'reject',
    });
  }, [showConfirmation, showToast, updateStats, viewingProperty]);

  // ============ TOGGLE FEATURE ============
  const handleToggleFeature = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    const isFeatured = property?.isFeatured;
    
    showConfirmation({
      title: isFeatured ? 'Remove Feature' : 'Feature Property',
      message: isFeatured 
        ? 'Are you sure you want to remove the featured status from this property?' 
        : 'Are you sure you want to feature this property? It will be highlighted in listings.',
      confirmText: isFeatured ? 'Yes, Unfeature' : 'Yes, Feature',
      confirmColor: isFeatured ? 'bg-purple-500' : 'bg-amber-500',
      icon: isFeatured ? <FiXCircle className="text-4xl text-purple-500" /> : <FaStarSolid className="text-4xl text-amber-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProperties(prev => {
              const updated = prev.map(p => {
                if (p.id === id) {
                  const newFeatured = !p.isFeatured;
                  showToast(`${p.title} ${newFeatured ? 'featured' : 'unfeatured'} successfully`, 'success');
                  return { ...p, isFeatured: newFeatured };
                }
                return p;
              });
              updateStats(updated);
              return updated;
            });
            if (viewingProperty && viewingProperty.id === id) {
              setViewingProperty(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
            }
            resolve();
          }, 600);
        });
      },
      propertyId,
      action: 'feature',
    });
  }, [properties, showConfirmation, showToast, updateStats, viewingProperty]);

  // ============ TOGGLE VERIFY ============
  const handleToggleVerify = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    const isVerified = property?.isVerified;
    
    showConfirmation({
      title: isVerified ? 'Unverify Property' : 'Verify Property',
      message: isVerified
        ? 'Are you sure you want to unverify this property? The verified badge will be removed.'
        : 'Are you sure you want to verify this property? It will get a verified badge.',
      confirmText: isVerified ? 'Yes, Unverify' : 'Yes, Verify',
      confirmColor: isVerified ? 'bg-blue-500' : 'bg-emerald-500',
      icon: isVerified ? <FiXCircle className="text-4xl text-blue-500" /> : <FiShield className="text-4xl text-emerald-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProperties(prev => {
              const updated = prev.map(p => {
                if (p.id === id) {
                  const newVerified = !p.isVerified;
                  showToast(`${p.title} ${newVerified ? 'verified' : 'unverified'} successfully`, 'success');
                  return { ...p, isVerified: newVerified };
                }
                return p;
              });
              updateStats(updated);
              return updated;
            });
            if (viewingProperty && viewingProperty.id === id) {
              setViewingProperty(prev => ({ ...prev, isVerified: !prev.isVerified }));
            }
            resolve();
          }, 600);
        });
      },
      propertyId,
      action: 'verify',
    });
  }, [properties, showConfirmation, showToast, updateStats, viewingProperty]);

  // ============ TOGGLE SUSPEND ============
  const handleToggleSuspend = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    const isSuspended = property?.status === 'suspended';
    
    showConfirmation({
      title: isSuspended ? 'Unsuspend Property' : 'Suspend Property',
      message: isSuspended
        ? 'Are you sure you want to unsuspend this property? It will become active again.'
        : 'Are you sure you want to suspend this property? It will be hidden from users.',
      confirmText: isSuspended ? 'Yes, Unsuspend' : 'Yes, Suspend',
      confirmColor: isSuspended ? 'bg-emerald-500' : 'bg-red-500',
      icon: isSuspended ? <FiCheckCircle className="text-4xl text-emerald-500" /> : <FiMinimize className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProperties(prev => {
              const updated = prev.map(p => {
                if (p.id === id) {
                  const newStatus = p.status === 'suspended' ? 'approved' : 'suspended';
                  showToast(`${p.title} ${newStatus === 'suspended' ? 'suspended' : 'unsuspended'} successfully`, 'warning');
                  return { ...p, status: newStatus };
                }
                return p;
              });
              updateStats(updated);
              return updated;
            });
            if (viewingProperty && viewingProperty.id === id) {
              setViewingProperty(prev => ({ ...prev, status: prev.status === 'suspended' ? 'approved' : 'suspended' }));
            }
            resolve();
          }, 600);
        });
      },
      propertyId,
      action: 'suspend',
    });
  }, [properties, showConfirmation, showToast, updateStats, viewingProperty]);

  // ============ DELETE PROPERTY ============
  const handleDeleteProperty = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    
    showConfirmation({
      title: 'Delete Property',
      message: `Are you sure you want to delete "${property?.title || 'this property'}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const deletedProperty = properties.find(p => p.id === id);
            setProperties(prev => {
              const updated = prev.filter(p => p.id !== id);
              updateStats(updated);
              return updated;
            });
            setShowViewModal(false);
            setViewingProperty(null);
            showToast(`${deletedProperty?.title || 'Property'} deleted successfully`, 'error');
            resolve();
          }, 800);
        });
      },
      propertyId,
      action: 'delete',
    });
  }, [properties, showConfirmation, showToast, updateStats]);

  // ============ BULK ACTION ============
  const handleBulkAction = useCallback((action) => {
    if (selectedProperties.length === 0) {
      showToast('Please select properties first', 'warning');
      return;
    }

    const actionConfigs = {
      approve: {
        title: 'Approve Properties',
        message: `Are you sure you want to approve ${selectedProperties.length} selected property(ies)?`,
        confirmText: 'Yes, Approve All',
        confirmColor: 'bg-emerald-500',
        icon: <FiCheckCircle className="text-4xl text-emerald-500" />,
      },
      reject: {
        title: 'Reject Properties',
        message: `Are you sure you want to reject ${selectedProperties.length} selected property(ies)?`,
        confirmText: 'Yes, Reject All',
        confirmColor: 'bg-red-500',
        icon: <FiXCircle className="text-4xl text-red-500" />,
      },
      suspend: {
        title: 'Suspend Properties',
        message: `Are you sure you want to suspend ${selectedProperties.length} selected property(ies)?`,
        confirmText: 'Yes, Suspend All',
        confirmColor: 'bg-red-500',
        icon: <FiMinimize className="text-4xl text-red-500" />,
      },
      feature: {
        title: 'Feature Properties',
        message: `Are you sure you want to feature ${selectedProperties.length} selected property(ies)?`,
        confirmText: 'Yes, Feature All',
        confirmColor: 'bg-amber-500',
        icon: <FaStarSolid className="text-4xl text-amber-500" />,
      },
      verify: {
        title: 'Verify Properties',
        message: `Are you sure you want to verify ${selectedProperties.length} selected property(ies)?`,
        confirmText: 'Yes, Verify All',
        confirmColor: 'bg-emerald-500',
        icon: <FiShield className="text-4xl text-emerald-500" />,
      },
      delete: {
        title: 'Delete Properties',
        message: `Are you sure you want to delete ${selectedProperties.length} selected property(ies)? This action cannot be undone.`,
        confirmText: 'Yes, Delete All',
        confirmColor: 'bg-red-500',
        icon: <FiTrash2 className="text-4xl text-red-500" />,
      },
    };

    const config = actionConfigs[action];
    if (!config) return;

    showConfirmation({
      ...config,
      onConfirm: () => {
        return new Promise((resolve) => {
          setActionLoading(action);
          setTimeout(() => {
            const selectedIds = new Set(selectedProperties);
            let updatedProperties = [...properties];
            let count = 0;

            updatedProperties = updatedProperties.map(p => {
              if (selectedIds.has(p.id)) {
                count++;
                if (action === 'approve') {
                  return { ...p, status: 'approved' };
                } else if (action === 'reject') {
                  return { ...p, status: 'rejected' };
                } else if (action === 'suspend') {
                  return { ...p, status: 'suspended' };
                } else if (action === 'feature') {
                  return { ...p, isFeatured: true };
                } else if (action === 'verify') {
                  return { ...p, isVerified: true };
                } else if (action === 'delete') {
                  return null;
                }
              }
              return p;
            }).filter(Boolean);

            setProperties(updatedProperties);
            updateStats(updatedProperties);
            setSelectedProperties([]);
            setActionLoading(null);

            const actionMessages = {
              approve: `${count} property(ies) approved`,
              reject: `${count} property(ies) rejected`,
              suspend: `${count} property(ies) suspended`,
              feature: `${count} property(ies) featured`,
              verify: `${count} property(ies) verified`,
              delete: `${count} property(ies) deleted`,
            };
            showToast(actionMessages[action] || `${count} property(ies) updated`, 'success');
            resolve();
          }, 800);
        });
      },
      propertyId: 'bulk',
      action: action,
    });
  }, [selectedProperties, properties, showConfirmation, showToast, updateStats]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockProperties = generateMockProperties();
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      updateStats(mockProperties);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockProperties, showToast, updateStats]);

  // ============ EXPORT PROPERTIES ============
  const handleExportProperties = useCallback(() => {
    const data = filteredProperties.map(p => ({
      Title: p.title,
      Type: p.type,
      Location: p.location,
      Price: p.price,
      Bedrooms: p.bedrooms,
      Bathrooms: p.bathrooms,
      Area: `${p.area} ${p.areaUnit}`,
      Status: p.status,
      Featured: p.isFeatured ? 'Yes' : 'No',
      Verified: p.isVerified ? 'Yes' : 'No',
      Agent: p.agentName,
      'Listed Date': new Date(p.listedDate).toLocaleDateString(),
      Views: p.views,
      Inquiries: p.inquiries,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredProperties.length} properties exported successfully`, 'success');
  }, [filteredProperties, showToast]);

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

      {/* View Modal */}
      <ViewPropertyModal
        property={viewingProperty}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingProperty(null); }}
        onEdit={() => handleEditProperty(viewingProperty)}
        onToggleFeature={() => handleToggleFeature(viewingProperty?.id)}
        onVerify={() => handleToggleVerify(viewingProperty?.id)}
        onSuspend={() => handleToggleSuspend(viewingProperty?.id)}
        onDelete={() => handleDeleteProperty(viewingProperty?.id)}
        onViewAgentProfile={handleViewAgentProfile}
        onApprove={handleApproveProperty}
        onReject={handleRejectProperty}
      />

      {/* Edit Modal */}
      <EditPropertyModal
        property={editingProperty}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingProperty(null); }}
        onSave={saveEdit}
        loading={editLoading}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Property Control
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
              <span>Manage and control all property listings from agents</span>
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
              onClick={handleExportProperties}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Approved"
                value={stats.approved}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={200}
                isActive={activeFilter === 'approved'}
                onClick={() => handleStatClick('approved')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Rejected"
                value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={300}
                isActive={activeFilter === 'rejected'}
                onClick={() => handleStatClick('rejected')}
              />
              <StatCard
                icon={<FiMinimize className="text-white text-sm" />}
                title="Suspended"
                value={stats.suspended}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={350}
                isActive={activeFilter === 'suspended'}
                onClick={() => handleStatClick('suspended')}
              />
              <StatCard
                icon={<FaStarSolid className="text-white text-sm" />}
                title="Featured"
                value={stats.featured}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={400}
                isActive={activeFilter === 'featured'}
                onClick={() => handleStatClick('featured')}
              />
              <StatCard
                icon={<FiShield className="text-white text-sm" />}
                title="Verified"
                value={stats.verified}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={450}
                isActive={activeFilter === 'verified'}
                onClick={() => handleStatClick('verified')}
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
              placeholder="Search properties by title, location, agent..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
                <option value="featured">Featured</option>
                <option value="verified">Verified</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
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
        {selectedProperties.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedProperties.length}</span> property(ies) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={actionLoading === 'approve'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'approve' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={actionLoading === 'reject'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'reject' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                disabled={actionLoading === 'suspend'}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'suspend' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiMinimize className="text-[10px]" />}
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction('feature')}
                disabled={actionLoading === 'feature'}
                className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'feature' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FaStarSolid className="text-[10px]" />}
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('verify')}
                disabled={actionLoading === 'verify'}
                className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'verify' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiShield className="text-[10px]" />}
                Verify
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
                onClick={() => setSelectedProperties([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);
              const statusColors = {
                pending: 'bg-amber-100 text-amber-700 border-amber-200',
                approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                rejected: 'bg-red-100 text-red-700 border-red-200',
                suspended: 'bg-gray-100 text-gray-700 border-gray-200'
              };

              return (
                <div
                  key={property.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    property.status === 'pending' ? 'border-l-4 border-l-amber-500' :
                    property.status === 'approved' ? 'border-l-4 border-l-emerald-500' :
                    property.status === 'rejected' ? 'border-l-4 border-l-red-500' :
                    property.status === 'suspended' ? 'border-l-4 border-l-gray-500' : ''
                  }`}
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
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-sm shadow-lg">
                        <FaHome />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{property.title}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[property.status] || 'bg-gray-100 text-gray-700'}`}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                          </span>
                          {property.isFeatured && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                              <FaStarSolid className="inline mr-0.5 text-[8px]" /> Featured
                            </span>
                          )}
                          {property.isVerified && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                              <FiShield className="inline mr-0.5 text-[8px]" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      onClick={() => handleViewProperty(property)}
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span>{property.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="font-semibold text-[#1A2E2A]">₹{property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaUserTie className="text-[#00695C] flex-shrink-0 text-xs" />
                      <span className="truncate">{property.agentName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{property.bedrooms}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Beds</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{property.bathrooms}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Baths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{property.area}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">{property.areaUnit}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {property.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveProperty(property.id)}
                          disabled={actionLoading === `approve_${property.id}`}
                          className="flex-1 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === `approve_${property.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : (
                            <FiCheckCircle className="text-[10px]" />
                          )}
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectProperty(property.id)}
                          disabled={actionLoading === `reject_${property.id}`}
                          className="flex-1 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === `reject_${property.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : (
                            <FiXCircle className="text-[10px]" />
                          )}
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewProperty(property)}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEye className="text-[10px]" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditProperty(property)}
                          className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEdit className="text-[10px]" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(property.id)}
                          disabled={actionLoading === `feature_${property.id}`}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                            property.isFeatured
                              ? 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                              : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                          }`}
                        >
                          {actionLoading === `feature_${property.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : (
                            <FaStarSolid className="text-[10px]" />
                          )}
                          {property.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVerify(property.id)}
                          disabled={actionLoading === `verify_${property.id}`}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                            property.isVerified
                              ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {actionLoading === `verify_${property.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : (
                            <FiShield className="text-[10px]" />
                          )}
                          {property.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspend(property.id)}
                          disabled={actionLoading === `suspend_${property.id}`}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                            property.status === 'suspended'
                              ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-red-700 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {actionLoading === `suspend_${property.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : property.status === 'suspended' ? (
                            <FiCheckCircle className="text-[10px]" />
                          ) : (
                            <FiMinimize className="text-[10px]" />
                          )}
                          {property.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={actionLoading === `delete_${property.id}`}
                          className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === `delete_${property.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : (
                            <FiTrash2 className="text-[10px]" />
                          )}
                          Delete
                        </button>
                      </>
                    )}
                  </div>

                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleViewAgentProfile(property.agentId)}
                      className="w-full py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                    >
                      <FiExternalLink className="text-[10px]" />
                      View Agent Profile
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
                  checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>#</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('title')}>
                Title {sortField === 'title' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('price')}>
                Price {sortField === 'price' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Bed</div>
              <div className="col-span-1">Bath</div>
              <div className="col-span-1">Agent</div>
              <div className="col-span-1 text-center">Featured</div>
              <div className="col-span-1 text-center">Verified</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);
              const statusColors = {
                pending: 'bg-amber-100 text-amber-700',
                approved: 'bg-emerald-100 text-emerald-700',
                rejected: 'bg-red-100 text-red-700',
                suspended: 'bg-gray-100 text-gray-700'
              };

              return (
                <div
                  key={property.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProperty(property.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-xs text-[#5A7D78]">{index + 1}</span>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{property.title}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{property.location}</p>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{property.type}</div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[property.status] || 'bg-gray-100 text-gray-700'}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-sm font-semibold text-[#1A2E2A]">₹{property.price.toLocaleString()}</div>

                  <div className="col-span-1 text-center text-sm text-[#1A2E2A]">{property.bedrooms}</div>

                  <div className="col-span-1 text-center text-sm text-[#1A2E2A]">{property.bathrooms}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{property.agentName}</div>

                  <div className="col-span-1 text-center">
                    {property.isFeatured ? (
                      <FaStarSolid className="text-amber-500 inline text-xs" />
                    ) : (
                      <span className="text-[#B5C9C5]">—</span>
                    )}
                  </div>

                  <div className="col-span-1 text-center">
                    {property.isVerified ? (
                      <FiShield className="text-blue-600 inline text-xs" />
                    ) : (
                      <span className="text-[#B5C9C5]">—</span>
                    )}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {property.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveProperty(property.id)}
                          disabled={actionLoading === `approve_${property.id}`}
                          className="w-7 h-7 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center text-emerald-600 hover:scale-110 disabled:opacity-50"
                          title="Approve"
                        >
                          {actionLoading === `approve_${property.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : (
                            <FiCheckCircle className="text-xs" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectProperty(property.id)}
                          disabled={actionLoading === `reject_${property.id}`}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50"
                          title="Reject"
                        >
                          {actionLoading === `reject_${property.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : (
                            <FiXCircle className="text-xs" />
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewProperty(property)}
                          className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                          title="View"
                        >
                          <FiEye className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditProperty(property)}
                          className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                          title="Edit"
                        >
                          <FiEdit className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFeature(property.id)}
                          disabled={actionLoading === `feature_${property.id}`}
                          className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                            property.isFeatured
                              ? 'text-purple-600 hover:bg-purple-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={property.isFeatured ? 'Unfeature' : 'Feature'}
                        >
                          {actionLoading === `feature_${property.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : (
                            <FaStarSolid className="text-xs" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVerify(property.id)}
                          disabled={actionLoading === `verify_${property.id}`}
                          className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                            property.isVerified
                              ? 'text-blue-600 hover:bg-blue-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={property.isVerified ? 'Unverify' : 'Verify'}
                        >
                          {actionLoading === `verify_${property.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : (
                            <FiShield className="text-xs" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspend(property.id)}
                          disabled={actionLoading === `suspend_${property.id}`}
                          className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                            property.status === 'suspended'
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={property.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        >
                          {actionLoading === `suspend_${property.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : property.status === 'suspended' ? (
                            <FiCheckCircle className="text-xs" />
                          ) : (
                            <FiMinimize className="text-xs" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(property.id)}
                          disabled={actionLoading === `delete_${property.id}`}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50"
                          title="Delete"
                        >
                          {actionLoading === `delete_${property.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : (
                            <FiTrash2 className="text-xs" />
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="col-span-12 mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleViewAgentProfile(property.agentId)}
                      className="px-3 py-1 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center gap-1 hover:scale-[1.02]"
                    >
                      <FiExternalLink className="text-[10px]" />
                      View Agent Profile
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
              <FiHome className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No properties found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No properties match your current view'}
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
              {Math.min(currentPage * pageSize, filteredProperties.length)} of{' '}
              {filteredProperties.length} properties
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
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AgentsPropertyControl;