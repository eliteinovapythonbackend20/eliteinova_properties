// src/components/dashboard/admin/buyer&tenants/SavedWishlist/SavedProperties.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHeart, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch, FiFilter,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiPlus, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiStar, FiShield, FiBriefcase, FiMail, FiPhone, FiExternalLink,
  FiTag, FiGrid, FiSave
} from 'react-icons/fi';
import {
  FaHeart, FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage
} from 'react-icons/fa';

// ============================================================
// TOAST COMPONENT
// ============================================================
const Toast = ({ toast, setToast }) => {
  if (!toast) return null;
  
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

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
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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
          <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// VIEW SAVED PROPERTY MODAL
// ============================================================
const ViewSavedPropertyModal = ({ property, show, onClose, onRemove, onViewProperty, onEdit }) => {
  if (!property || !show) return null;

  const statusColors = {
    available: 'bg-[#E8F8F5] text-[#00695C]',
    pending: 'bg-[#FEF3E2] text-amber-700',
    sold: 'bg-gray-100 text-gray-600',
    rented: 'bg-blue-50 text-blue-700'
  };

  const propertyTypeColors = {
    Individual: 'bg-blue-50 text-blue-700',
    Apartment: 'bg-purple-50 text-purple-700',
    Commercial: 'bg-orange-50 text-orange-700',
    'Land & Plots': 'bg-green-50 text-green-700',
    Hostel: 'bg-pink-50 text-pink-700'
  };

  const propertyImages = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'
  ];

  const getRandomImage = () => {
    const index = Math.floor(Math.random() * propertyImages.length);
    return propertyImages[index];
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = property.imageUrl || getRandomImage();

  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove(property.id);
    }
  };

  const handleViewClick = () => {
    if (onViewProperty) {
      onViewProperty(property.id);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(property);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Saved Property</h2>
          <p className="text-white/80 text-sm">{property.buyerName} · {property.propertyName}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Status Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[property.propertyStatus] || statusColors.available}`}>
                {property.propertyStatus ? property.propertyStatus.charAt(0).toUpperCase() + property.propertyStatus.slice(1) : 'Available'}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${propertyTypeColors[property.propertyType]}`}>
                {property.propertyType || 'N/A'}
              </span>
            </div>

            {/* Property Image */}
            <div className="bg-[#F5F9F8] rounded-2xl overflow-hidden relative">
              {!imageLoaded && !imageError && (
                <div className="w-full h-64 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center animate-pulse">
                  <FaImage className="text-4xl text-[#00695C]/20" />
                </div>
              )}
              {imageError ? (
                <div className="w-full h-64 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex flex-col items-center justify-center">
                  <FaHomeSolid className="text-5xl text-[#00695C]/30 mb-2" />
                  <p className="text-sm text-[#5A7D78]">Image not available</p>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={property.propertyName || 'Property'}
                  className={`w-full h-64 object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              {imageLoaded && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-[10px] font-medium flex items-center gap-1">
                    <FaImage className="text-[10px]" /> {property.propertyType || 'Property'}
                  </span>
                </div>
              )}
            </div>

            {/* Property Details - All 8 Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Buyer Name */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer Name</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{property.buyerName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{property.buyerEmail || ''}</p>
              </div>

              {/* Property Name */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{property.propertyName || 'N/A'}</p>
              </div>

              {/* Property Type */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaBuilding className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{property.propertyType || 'N/A'}</p>
              </div>

              {/* Location */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{property.location || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{property.city || ''}, {property.state || ''}</p>
              </div>

              {/* Price */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiDollarSign className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Price</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">₹{property.price ? property.price.toLocaleString() : '0'}</p>
              </div>

              {/* Saved Date */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Saved Date</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">
                  {property.savedDate ? new Date(property.savedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Property Status */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiTag className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Status</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[property.propertyStatus] || statusColors.available}`}>
                  {property.propertyStatus ? property.propertyStatus.charAt(0).toUpperCase() + property.propertyStatus.slice(1) : 'Available'}
                </span>
              </div>
            </div>

            {/* Buyer Contact Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Email</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{property.buyerEmail || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Phone</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{property.buyerPhone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {property.notes && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Notes</h4>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{property.notes}</p>
              </div>
            )}
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
              onClick={handleEditClick}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={handleViewClick}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              <FiExternalLink className="inline mr-2" /> View Property
            </button>
            <button
              onClick={handleRemoveClick}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"
            >
              <FiHeart className="inline mr-2" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT SAVED PROPERTY MODAL - Updated with free-text inputs
// ============================================================
const EditSavedPropertyModal = ({ property, show, onClose, onSave }) => {
  if (!property || !show) return null;

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    propertyName: '',
    propertyType: '',
    location: '',
    city: '',
    state: '',
    price: '',
    propertyStatus: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statuses = ['available', 'pending', 'sold', 'rented'];

  useEffect(() => {
    if (property) {
      setFormData({
        buyerName: property.buyerName || '',
        buyerEmail: property.buyerEmail || '',
        buyerPhone: property.buyerPhone || '',
        propertyName: property.propertyName || '',
        propertyType: property.propertyType || '',
        location: property.location || '',
        city: property.city || '',
        state: property.state || '',
        price: property.price ? String(property.price) : '',
        propertyStatus: property.propertyStatus || '',
        notes: property.notes || ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedProperty = {
        ...property,
        ...formData,
        price: parseFloat(formData.price) || 0
      };
      onSave(updatedProperty);
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Saved Property</h2>
          <p className="text-white/80 text-sm">Update property information</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Buyer Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Buyer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter buyer name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer Email</label>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="buyer@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer Phone</label>
                  <input
                    type="text"
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHome className="text-[#00695C]" />
                Property Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Name *</label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Status *</label>
                  <select
                    name="propertyStatus"
                    value={formData.propertyStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter price"
                  />
                </div>
                
                {/* Location - Free Text Input */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter location (e.g., MG Road, Banjara Hills)"
                  />
                </div>

                {/* City - Free Text Input */}
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter city name"
                  />
                </div>

                {/* State - Free Text Input */}
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter state name"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Add notes about this property..."
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
              {loading ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <FiSave className="inline" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const SavedProperties = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('propertyName');
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

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    sold: 0,
    rented: 0,
    individual: 0,
    apartment: 0,
    commercial: 0,
    land: 0,
    hostel: 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0,
        available: 0,
        pending: 0,
        sold: 0,
        rented: 0,
        individual: 0,
        apartment: 0,
        commercial: 0,
        land: 0,
        hostel: 0
      });
      return;
    }

    const total = list.length;
    const available = list.filter(p => p.propertyStatus === 'available').length;
    const pending = list.filter(p => p.propertyStatus === 'pending').length;
    const sold = list.filter(p => p.propertyStatus === 'sold').length;
    const rented = list.filter(p => p.propertyStatus === 'rented').length;
    const individual = list.filter(p => p.propertyType === 'Individual').length;
    const apartment = list.filter(p => p.propertyType === 'Apartment').length;
    const commercial = list.filter(p => p.propertyType === 'Commercial').length;
    const land = list.filter(p => p.propertyType === 'Land & Plots').length;
    const hostel = list.filter(p => p.propertyType === 'Hostel').length;

    setStats({
      total,
      available,
      pending,
      sold,
      rented,
      individual,
      apartment,
      commercial,
      land,
      hostel
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockProperties = useCallback(() => {
    const buyerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['available', 'pending', 'sold', 'rented'];
    const locations = ['MG Road', 'Banjara Hills', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jubilee Hills', 'Connaught Place', 'Salt Lake', 'Marine Drive', 'Andheri'];

    const propertyImages = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'
    ];

    const propertiesList = [];
    const usedNames = new Set();

    for (let i = 1; i <= 60; i++) {
      let propertyName, buyerName;
      let attempts = 0;
      do {
        propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
        buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
        attempts++;
      } while (usedNames.has(`${propertyName}_${buyerName}`) && attempts < 50);
      usedNames.add(`${propertyName}_${buyerName}`);

      const city = cities[Math.floor(Math.random() * cities.length)];
      const price = Math.floor(Math.random() * 8000000 + 2000000);

      const savedDate = new Date();
      savedDate.setDate(savedDate.getDate() - Math.floor(Math.random() * 90));

      propertiesList.push({
        id: `saved_${i}`,
        buyerName: buyerName,
        buyerEmail: `${buyerName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        buyerPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        propertyName: propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        city: city,
        state: states[Math.floor(Math.random() * states.length)],
        price: price,
        savedDate: savedDate.toISOString(),
        propertyStatus: statuses[Math.floor(Math.random() * statuses.length)],
        notes: Math.random() > 0.7 ? 'Interested in this property' : '',
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 1500 + 500),
        imageUrl: propertyImages[Math.floor(Math.random() * propertyImages.length)]
      });
    }

    computeStats(propertiesList);
    return propertiesList;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockProperties = generateMockProperties();
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
    } catch (error) {
      console.error('Error generating mock properties:', error);
    }
  }, [generateMockProperties]);

  // ============ FILTER PROPERTIES ============
  const filterProperties = useCallback(() => {
    try {
      let filtered = [...properties];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          (p.propertyName && p.propertyName.toLowerCase().includes(query)) ||
          (p.buyerName && p.buyerName.toLowerCase().includes(query)) ||
          (p.buyerEmail && p.buyerEmail.toLowerCase().includes(query)) ||
          (p.buyerPhone && p.buyerPhone.includes(query)) ||
          (p.city && p.city.toLowerCase().includes(query)) ||
          (p.location && p.location.toLowerCase().includes(query)) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(query))
        );
      }

      if (selectedPropertyType !== 'all') {
        filtered = filtered.filter(p => p.propertyType === selectedPropertyType);
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(p => p.propertyStatus === selectedStatus);
      }

      let count = 0;
      if (selectedPropertyType !== 'all') count++;
      if (selectedStatus !== 'all') count++;
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
  }, [properties, searchQuery, selectedPropertyType, selectedStatus, sortField, sortDirection]);

  useEffect(() => {
    filterProperties();
  }, [filterProperties]);

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
  const handleSelectProperty = useCallback((propId) => {
    setSelectedProperties(prev =>
      prev.includes(propId)
        ? prev.filter(id => id !== propId)
        : [...prev, propId]
    );
  }, []);

  // ============ VIEW PROPERTY ============
  const handleViewProperty = useCallback((prop) => {
    setViewingProperty(prop);
    setShowViewModal(true);
  }, []);

  // ============ VIEW PROPERTY DETAILS ============
  const handleViewPropertyDetails = useCallback((propId) => {
    navigate('/properties/details');
    setToast({ message: 'Opening property details...', type: 'info' });
  }, [navigate]);

  // ============ EDIT PROPERTY ============
  const handleEditProperty = useCallback((prop) => {
    setEditingProperty(prop);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDITED PROPERTY ============
  const handleSaveProperty = useCallback((updatedProperty) => {
    setProperties(prev => {
      const updated = prev.map(p =>
        p.id === updatedProperty.id ? updatedProperty : p
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `"${updatedProperty.propertyName}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ REMOVE FROM SAVED ============
  const handleRemoveSaved = useCallback((propId) => {
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;

    if (!window.confirm(`Remove "${prop.propertyName}" from saved properties?`)) return;

    setActionLoading(propId);
    setTimeout(() => {
      setProperties(prev => {
        const updated = prev.filter(p => p.id !== propId);
        computeStats(updated);
        return updated;
      });
      setActionLoading(null);
      setShowViewModal(false);
      setToast({ message: `Removed "${prop.propertyName}" from saved properties`, type: 'warning' });
    }, 700);
  }, [properties, computeStats]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedPropertyType('all');
    setSelectedStatus('all');

    if (nextFilter === 'available' || nextFilter === 'pending' || nextFilter === 'sold' || nextFilter === 'rented') {
      setSelectedStatus(nextFilter);
    } else if (nextFilter === 'individual') {
      setSelectedPropertyType('Individual');
    } else if (nextFilter === 'apartment') {
      setSelectedPropertyType('Apartment');
    } else if (nextFilter === 'commercial') {
      setSelectedPropertyType('Commercial');
    } else if (nextFilter === 'land') {
      setSelectedPropertyType('Land & Plots');
    } else if (nextFilter === 'hostel') {
      setSelectedPropertyType('Hostel');
    }

    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedPropertyType('all');
    setSelectedStatus('all');
    setActiveFilter('all');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockProperties = generateMockProperties();
        setProperties(mockProperties);
        setFilteredProperties(mockProperties);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockProperties]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredProperties.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = filteredProperties.map(p => ({
        'Buyer Name': p.buyerName || '',
        'Buyer Email': p.buyerEmail || '',
        'Buyer Phone': p.buyerPhone || '',
        'Property Name': p.propertyName || '',
        'Property Type': p.propertyType || '',
        Location: `${p.location || ''}, ${p.city || ''}, ${p.state || ''}`,
        Price: `₹${p.price ? p.price.toLocaleString() : '0'}`,
        'Saved Date': p.savedDate ? new Date(p.savedDate).toLocaleDateString() : '',
        'Property Status': p.propertyStatus ? p.propertyStatus.charAt(0).toUpperCase() + p.propertyStatus.slice(1) : '',
        Notes: p.notes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saved_properties_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredProperties.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredProperties]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedProperties.length === 0) {
      setToast({ message: 'Please select properties first', type: 'warning' });
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedProperties);
      let count = 0;

      setProperties(prev => {
        let updated;
        if (action === 'remove') {
          count = prev.filter(p => selectedIds.has(p.id)).length;
          updated = prev.filter(p => !selectedIds.has(p.id));
        } else {
          updated = prev.map(p => {
            if (!selectedIds.has(p.id)) return p;
            count++;
            return p;
          });
        }
        computeStats(updated);
        return updated;
      });

      setSelectedProperties([]);
      setActionLoading(null);

      if (action === 'remove') {
        setToast({ message: `${count} property(s) removed from saved`, type: 'warning' });
      }
    }, 800);
  }, [selectedProperties, computeStats]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
      pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
      sold: 'bg-gray-100 text-gray-600 border-gray-200',
      rented: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return colors[status] || colors.available;
  };

  // ============ PROPERTY TYPE COLOR HELPER ============
  const getPropertyTypeColor = (type) => {
    const colors = {
      Individual: 'bg-blue-50 text-blue-700',
      Apartment: 'bg-purple-50 text-purple-700',
      Commercial: 'bg-orange-50 text-orange-700',
      'Land & Plots': 'bg-green-50 text-green-700',
      Hostel: 'bg-pink-50 text-pink-700'
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

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

      {/* Toast */}
      <Toast toast={toast} setToast={setToast} />

      {/* View Modal */}
      {showViewModal && viewingProperty && (
        <ViewSavedPropertyModal
          property={viewingProperty}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingProperty(null); }}
          onRemove={handleRemoveSaved}
          onViewProperty={handleViewPropertyDetails}
          onEdit={handleEditProperty}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingProperty && (
        <EditSavedPropertyModal
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
                Saved Properties
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
              <span>View Saved Properties</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
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

      {/* Stats Section - All 10 Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
              <StatCard
                icon={<FiHeart className="text-white text-sm" />}
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Available"
                value={stats.available}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={50}
                isActive={activeFilter === 'available'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('available')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Sold"
                value={stats.sold}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={150}
                isActive={activeFilter === 'sold'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('sold')}
              />
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Rented"
                value={stats.rented}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={200}
                isActive={activeFilter === 'rented'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('rented')}
              />
              <StatCard
                icon={<FaHomeSolid className="text-white text-sm" />}
                title="Individual"
                value={stats.individual}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={250}
                isActive={activeFilter === 'individual'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('individual')}
              />
              <StatCard
                icon={<FiGrid className="text-white text-sm" />}
                title="Apartment"
                value={stats.apartment}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={300}
                isActive={activeFilter === 'apartment'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('apartment')}
              />
              <StatCard
                icon={<FiBriefcase className="text-white text-sm" />}
                title="Commercial"
                value={stats.commercial}
                color="bg-gradient-to-br from-orange-600 to-orange-400"
                delay={350}
                isActive={activeFilter === 'commercial'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('commercial')}
              />
              <StatCard
                icon={<FiMapPin className="text-white text-sm" />}
                title="Land"
                value={stats.land}
                color="bg-gradient-to-br from-green-600 to-green-400"
                delay={400}
                isActive={activeFilter === 'land'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('land')}
              />
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Hostel"
                value={stats.hostel}
                color="bg-gradient-to-br from-pink-600 to-pink-400"
                delay={450}
                isActive={activeFilter === 'hostel'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('hostel')}
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
              placeholder="Search by buyer name, property name, location, or property type..."
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
                value={selectedPropertyType}
                onChange={(e) => {
                  setSelectedPropertyType(e.target.value);
                  setSelectedStatus('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
                <option value="Land & Plots">Land & Plots</option>
                <option value="Hostel">Hostel</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setSelectedPropertyType('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
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

        {/* Bulk Actions */}
        {selectedProperties.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedProperties.length}</span> property(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('remove')}
                disabled={actionLoading === 'remove'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'remove' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiHeart className="text-[10px]" />}
                Remove All
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

              return (
                <div
                  key={property.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    property.propertyStatus === 'available' ? 'border-l-4 border-l-emerald-500' :
                    property.propertyStatus === 'pending' ? 'border-l-4 border-l-amber-500' :
                    property.propertyStatus === 'sold' ? 'border-l-4 border-l-gray-500' : ''
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
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          <FaHeart className="text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{property.buyerName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(property.propertyStatus)}`}>
                            {property.propertyStatus ? property.propertyStatus.charAt(0).toUpperCase() + property.propertyStatus.slice(1) : 'N/A'}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getPropertyTypeColor(property.propertyType)}`}>
                            {property.propertyType || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                        onClick={() => handleEditProperty(property)}
                        title="Edit Property"
                      >
                        <FiEdit className="text-sm" />
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewProperty(property)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium text-[#1A2E2A]">{property.buyerName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{property.propertyName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaBuilding className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{property.propertyType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{property.location || ''}, {property.city || ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span>₹{property.price ? property.price.toLocaleString() : '0'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Saved: {property.savedDate ? new Date(property.savedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(property.propertyStatus)}`}>
                        {property.propertyStatus ? property.propertyStatus.charAt(0).toUpperCase() + property.propertyStatus.slice(1) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
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
                      className="flex-1 py-1.5 text-xs font-medium text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewPropertyDetails(property.id)}
                      className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiExternalLink className="text-[10px]" /> Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(property.id)}
                      disabled={actionLoading === property.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === property.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiHeart className="text-[10px]" />}
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Buyer</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyName')}>
                Property Name {sortField === 'propertyName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('price')}>
                Price {sortField === 'price' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('savedDate')}>
                Saved Date {sortField === 'savedDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);

              return (
                <div
                  key={property.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProperty(property.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {property.buyerName ? property.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                  </div>

                  {/* Buyer Name */}
                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{property.buyerName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{property.buyerEmail || 'N/A'}</p>
                  </div>

                  {/* Property Name */}
                  <div className="col-span-1">
                    <p className="text-xs font-medium text-[#1A2E2A] truncate">{property.propertyName || 'N/A'}</p>
                  </div>

                  {/* Property Type */}
                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPropertyTypeColor(property.propertyType)}`}>
                      {property.propertyType || 'N/A'}
                    </span>
                  </div>

                  {/* Property Status */}
                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(property.propertyStatus)}`}>
                      {property.propertyStatus ? property.propertyStatus.charAt(0).toUpperCase() + property.propertyStatus.slice(1) : 'N/A'}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 text-xs text-[#5A7D78] truncate">
                    {property.location || ''}, {property.city || ''}
                  </div>

                  {/* Price */}
                  <div className="col-span-1 text-center text-sm font-semibold text-[#1A2E2A]">
                    ₹{property.price ? Math.floor(property.price / 100000) : 0}L
                  </div>

                  {/* Saved Date */}
                  <div className="col-span-1 text-center text-[10px] text-[#5A7D78]">
                    {property.savedDate ? new Date(property.savedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditProperty(property)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
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
                      onClick={() => handleViewPropertyDetails(property.id)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Property Details"
                    >
                      <FiExternalLink className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(property.id)}
                      disabled={actionLoading === property.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
                      title="Remove"
                    >
                      {actionLoading === property.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiHeart className="text-xs" />}
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
              <FiHeart className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No saved properties</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No properties have been saved yet'}
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
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-once { animation: pulse-once 1s ease-out; }
      `}</style>
    </div>
  );
};

export default SavedProperties;