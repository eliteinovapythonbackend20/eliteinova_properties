// src/components/dashboard/admin/Builders/BuildersProjects.jsx

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
  FiAward, FiBriefcase, FiTarget, FiPieChart, FiLayers,
  FiCheckSquare, FiPlayCircle, FiFlag
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie, FaUserGraduate,
  FaCity, FaHammer, FaHardHat, FaClipboardList
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlineLeaderboard, MdOutlineConstruction, MdOutlineApartment } from 'react-icons/md';

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
  ongoing: 'border-l-blue-500',
  completed: 'border-l-emerald-500',
  upcoming: 'border-l-amber-500',
  'new-launch': 'border-l-purple-500',
  onHold: 'border-l-gray-500',
  cancelled: 'border-l-red-500',
};

const STATUS_BADGE = {
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  upcoming: 'bg-amber-100 text-amber-700',
  'new-launch': 'bg-purple-100 text-purple-700',
  onHold: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Unit availability status
const UNIT_STATUS = {
  available: 'bg-emerald-100 text-emerald-700',
  booked: 'bg-red-100 text-red-700',
  reserved: 'bg-amber-100 text-amber-700',
  sold: 'bg-gray-100 text-gray-700',
};

// ============ VIEW PROJECT DETAILS MODAL ============
const ViewProjectModal = ({ project, show, onClose }) => {
  if (!project || !show) return null;

  const amenities = project.amenities || ['Club House', 'Swimming Pool', 'Gymnasium', 'Children\'s Play Area'];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEye className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Project Details</h2>
              <p className="text-white/70 text-[10px]">View project information</p>
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
          {/* Title and Status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{project.name}</h3>
              <p className="text-sm text-[#5A7D78]">{project.type} · {project.location}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${STATUS_BADGE[project.status] || 'bg-gray-100 text-gray-700'}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              {project.isVerified && (
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
                  <FiShield className="inline mr-1 text-xs" /> Verified
                </span>
              )}
              {project.isFeatured && (
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-700">
                  <FaStarSolid className="inline mr-1 text-xs" /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">₹{project.price.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Starting Price</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{project.totalUnits}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total Units</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#00695C]">{project.availableUnits}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Available</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm bg-[#F5F9F8] rounded-xl p-3">
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiMapPin className="text-[#00695C]" /> {project.location}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiSquare className="text-[#00695C]" /> {project.area} {project.areaUnit}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiTag className="text-[#00695C]" /> {project.type}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiCalendar className="text-[#00695C]" /> Expected: {project.expectedCompletion}
              </div>
            </div>
          </div>

          {/* Builder */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Builder</h4>
            <div className="bg-[#F5F9F8] rounded-xl p-3">
              <p className="text-sm text-[#1A2E2A] font-medium">{project.builderName}</p>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenities.map((item, i) => (
                <span key={i} className="px-3 py-1 bg-[#F5F9F8] rounded-lg text-xs text-[#1A2E2A]">{item}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-[#5A7D78] leading-relaxed bg-[#F5F9F8] rounded-xl p-3">
              {project.description || 'No description available.'}
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

// ============ EDIT PROJECT MODAL ============
const EditProjectModal = ({ project, show, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project && show) {
      setFormData({
        name: project.name || '',
        type: project.type || 'Residential',
        location: project.location || '',
        price: project.price || '',
        totalUnits: project.totalUnits || 1,
        availableUnits: project.availableUnits || 0,
        area: project.area || '',
        areaUnit: project.areaUnit || 'sq ft',
        status: project.status || 'upcoming',
        isFeatured: project.isFeatured || false,
        isVerified: project.isVerified || false,
        builderName: project.builderName || '',
        description: project.description || '',
        amenities: project.amenities ? project.amenities.join(', ') : '',
        expectedCompletion: project.expectedCompletion || '',
        launchDate: project.launchDate || '',
      });
      setErrors({});
    }
  }, [project, show]);

  if (!project || !show || !formData) return null;

  const projectTypes = ['Residential', 'Commercial', 'Mixed-Use', 'Luxury', 'Affordable', 'Township'];
  const statusOptions = ['ongoing', 'completed', 'upcoming', 'new-launch', 'onHold', 'cancelled'];

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
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
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
      totalUnits: Number(formData.totalUnits),
      availableUnits: Number(formData.availableUnits),
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
              <h2 className="text-base font-bold text-white">Edit Project</h2>
              <p className="text-white/70 text-[10px]">Update project details</p>
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
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Project Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Type</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
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
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Starting Price (₹) <span className="text-red-500">*</span></label>
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
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Total Units</label>
              <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Available Units</label>
              <input type="number" name="availableUnits" value={formData.availableUnits} onChange={handleChange}
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
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Builder</label>
              <input type="text" name="builderName" value={formData.builderName} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Expected Completion</label>
              <input type="date" name="expectedCompletion" value={formData.expectedCompletion} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Launch Date</label>
              <input type="date" name="launchDate" value={formData.launchDate} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Amenities <span className="text-[#B5C9C5]">(comma separated)</span></label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" placeholder="Club House, Swimming Pool, Gym" />
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

// ============ UNIT AVAILABILITY MODAL ============
const UnitAvailabilityModal = ({ project, show, onClose }) => {
  if (!show || !project) return null;

  const units = [
    { id: 1, number: '101', type: '2 BHK', area: '850 sq ft', price: '₹45,00,000', status: 'available' },
    { id: 2, number: '102', type: '2 BHK', area: '850 sq ft', price: '₹46,00,000', status: 'booked' },
    { id: 3, number: '103', type: '3 BHK', area: '1200 sq ft', price: '₹65,00,000', status: 'available' },
    { id: 4, number: '104', type: '3 BHK', area: '1200 sq ft', price: '₹66,00,000', status: 'reserved' },
    { id: 5, number: '105', type: '4 BHK', area: '1800 sq ft', price: '₹95,00,000', status: 'sold' },
    { id: 6, number: '201', type: '2 BHK', area: '850 sq ft', price: '₹47,00,000', status: 'available' },
    { id: 7, number: '202', type: '3 BHK', area: '1200 sq ft', price: '₹67,00,000', status: 'available' },
    { id: 8, number: '203', type: '3 BHK', area: '1200 sq ft', price: '₹68,00,000', status: 'reserved' },
    { id: 9, number: '301', type: '4 BHK', area: '1800 sq ft', price: '₹97,00,000', status: 'available' },
    { id: 10, number: '302', type: '2 BHK', area: '850 sq ft', price: '₹48,00,000', status: 'booked' },
  ];

  const stats = {
    total: units.length,
    available: units.filter(u => u.status === 'available').length,
    booked: units.filter(u => u.status === 'booked').length,
    reserved: units.filter(u => u.status === 'reserved').length,
    sold: units.filter(u => u.status === 'sold').length,
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiLayers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Unit Availability</h2>
              <p className="text-white/70 text-[10px]">{project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center p-2 bg-[#F5F9F8] rounded-xl">
              <p className="text-sm font-bold text-[#1A2E2A]">{stats.total}</p>
              <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-xl border-l-4 border-l-emerald-500">
              <p className="text-sm font-bold text-emerald-600">{stats.available}</p>
              <p className="text-[8px] text-emerald-600 uppercase tracking-wider">Available</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-xl border-l-4 border-l-red-500">
              <p className="text-sm font-bold text-red-600">{stats.booked}</p>
              <p className="text-[8px] text-red-600 uppercase tracking-wider">Booked</p>
            </div>
            <div className="text-center p-2 bg-amber-50 rounded-xl border-l-4 border-l-amber-500">
              <p className="text-sm font-bold text-amber-600">{stats.reserved}</p>
              <p className="text-[8px] text-amber-600 uppercase tracking-wider">Reserved</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-xl border-l-4 border-l-gray-500">
              <p className="text-sm font-bold text-gray-600">{stats.sold}</p>
              <p className="text-[8px] text-gray-600 uppercase tracking-wider">Sold</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Unit List</h4>
            <div className="space-y-2">
              {units.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-[#1A2E2A]">Unit {unit.number}</span>
                      <span className="text-xs text-[#5A7D78]">{unit.type}</span>
                      <span className="text-xs text-[#5A7D78]">{unit.area}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-[#00695C]">{unit.price}</span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${UNIT_STATUS[unit.status] || 'bg-gray-100 text-gray-700'}`}>
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
};

// ============ FLOOR PLANS MODAL ============
const FloorPlansModal = ({ project, show, onClose }) => {
  if (!show || !project) return null;

  const floorPlans = [
    { id: 1, name: '2 BHK - Type A', area: '850 sq ft', bedrooms: 2, bathrooms: 2, price: '₹45,00,000', image: null },
    { id: 2, name: '2 BHK - Type B', area: '920 sq ft', bedrooms: 2, bathrooms: 2, price: '₹48,00,000', image: null },
    { id: 3, name: '3 BHK - Type A', area: '1200 sq ft', bedrooms: 3, bathrooms: 2, price: '₹65,00,000', image: null },
    { id: 4, name: '3 BHK - Type B', area: '1350 sq ft', bedrooms: 3, bathrooms: 3, price: '₹70,00,000', image: null },
    { id: 5, name: '4 BHK - Type A', area: '1800 sq ft', bedrooms: 4, bathrooms: 3, price: '₹95,00,000', image: null },
    { id: 6, name: '4 BHK - Type B', area: '2000 sq ft', bedrooms: 4, bathrooms: 4, price: '₹1,05,00,000', image: null },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiSquare className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Floor Plans</h2>
              <p className="text-white/70 text-[10px]">{project.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {floorPlans.map((plan) => (
              <div key={plan.id} className="bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[#1A2E2A]">{plan.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#5A7D78]">
                      <span>{plan.area}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{plan.bedrooms} Beds</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{plan.bathrooms} Baths</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#00695C]">{plan.price}</span>
                </div>
                {plan.image ? (
                  <div className="mt-2 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-[#B5C9C5]">
                    <FiImage className="text-2xl" />
                    <span className="text-xs ml-2">Floor Plan Image</span>
                  </div>
                ) : (
                  <div className="mt-2 h-20 bg-white rounded-lg border border-dashed border-[#B5C9C5] flex items-center justify-center text-[#B5C9C5]">
                    <FiImage className="text-xl" />
                    <span className="text-xs ml-2">No image uploaded</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const BuildersProjects = () => {
  const navigate = useNavigate();

  // ============ STATE ============
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterCount, setFilterCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal states
  const [viewingProject, setViewingProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [unitProject, setUnitProject] = useState(null);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [floorPlanProject, setFloorPlanProject] = useState(null);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);

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
    projectId: null,
    action: null,
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    upcoming: 0,
    newLaunches: 0,
    totalUnits: 0,
    availableUnits: 0,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK PROJECTS ============
  const generateMockProjects = useCallback(() => {
    const projectNames = [
      'Green Valley Residences', 'Lake View Apartments', 'Royal Palm Estate',
      'City Heights Tower', 'Garden Villa', 'The Platinum Residences',
      'Sunset Bay Project', 'Cedar Woods', 'Riverside Homes',
      'Golden Sands Township', 'Emerald City', 'Palm Grove Estate'
    ];

    const types = ['Residential', 'Commercial', 'Mixed-Use', 'Luxury', 'Affordable', 'Township'];
    const statuses = ['ongoing', 'completed', 'upcoming', 'new-launch'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const builders = ['Shriram Properties', 'Prestige Group', 'Sobha Ltd', 'Godrej Properties', 'DLF Ltd', 'Brigade Group'];

    return projectNames.map((name, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const totalUnits = Math.floor(Math.random() * 200) + 50;
      const availableUnits = Math.floor(totalUnits * (Math.random() * 0.6 + 0.1));

      return {
        id: `project_${i + 1}`,
        name: name,
        type: type,
        location: `${city}, India`,
        price: Math.floor(Math.random() * 45000000) + 5000000,
        totalUnits: totalUnits,
        availableUnits: availableUnits,
        area: Math.floor(Math.random() * 3000) + 400,
        areaUnit: 'sq ft',
        status: status,
        isFeatured: Math.random() > 0.75,
        isVerified: Math.random() > 0.6,
        builderName: builders[Math.floor(Math.random() * builders.length)],
        description: `${type} project by ${builders[Math.floor(Math.random() * builders.length)]} in ${city}. Premium amenities and prime location.`,
        amenities: ['Club House', 'Swimming Pool', 'Gymnasium', 'Children\'s Play Area', 'Landscaped Gardens', 'Security Systems'],
        expectedCompletion: new Date(Date.now() + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        launchDate: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        completionDate: status === 'completed' ? new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : null,
      };
    });
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockProjects = generateMockProjects();
    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
    updateStats(mockProjects);
  }, [generateMockProjects]);

  // ============ UPDATE STATS ============
  const updateStats = useCallback((projectsList) => {
    const totalUnits = projectsList.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
    const availableUnits = projectsList.reduce((sum, p) => sum + (p.availableUnits || 0), 0);

    setStats({
      total: projectsList.length,
      ongoing: projectsList.filter(p => p.status === 'ongoing').length,
      completed: projectsList.filter(p => p.status === 'completed').length,
      upcoming: projectsList.filter(p => p.status === 'upcoming').length,
      newLaunches: projectsList.filter(p => p.status === 'new-launch').length,
      totalUnits,
      availableUnits,
    });
  }, []);

  // ============ FILTER PROJECTS ============
  const filterProjects = useCallback(() => {
    let filtered = [...projects];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.builderName.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.type.toLowerCase() === selectedType.toLowerCase());
    }

    if (activeFilter === 'featured') {
      filtered = filtered.filter(p => p.isFeatured);
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (searchQuery) count++;
    if (activeFilter === 'featured') count++;
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

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, searchQuery, selectedStatus, selectedType, sortField, sortDirection, activeFilter]);

  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = useMemo(() =>
    filteredProjects.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredProjects, currentPage, pageSize]);

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
    if (selectedProjects.length === paginatedProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(paginatedProjects.map(p => p.id));
    }
  }, [selectedProjects, paginatedProjects]);

  // ============ HANDLE SELECT PROJECT ============
  const handleSelectProject = useCallback((projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  }, []);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);

    if (filter === 'all') {
      setSelectedStatus('all');
      setSelectedType('all');
    } else if (filter === 'ongoing') {
      setSelectedStatus('ongoing');
      setSelectedType('all');
    } else if (filter === 'completed') {
      setSelectedStatus('completed');
      setSelectedType('all');
    } else if (filter === 'upcoming') {
      setSelectedStatus('upcoming');
      setSelectedType('all');
    } else if (filter === 'new-launch') {
      setSelectedStatus('new-launch');
      setSelectedType('all');
    } else if (filter === 'featured') {
      setSelectedStatus('all');
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

  // ============ SHOW CONFIRMATION MODAL ============
  const showConfirmation = useCallback(({
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    confirmColor = 'bg-red-500',
    icon = <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm,
    projectId,
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
      projectId,
      action,
    });
  }, []);

  // ============ CLOSE CONFIRMATION MODAL ============
  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ============ HANDLE CONFIRM ACTION ============
  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, projectId, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${projectId}`);
      await onConfirm(projectId);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ VIEW PROJECT ============
  const handleViewProject = useCallback((project) => {
    setViewingProject(project);
    setShowViewModal(true);
  }, []);

  // ============ EDIT PROJECT ============
  const handleEditProject = useCallback((project) => {
    setEditingProject(project);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const handleSaveEdit = useCallback((updatedData) => {
    setActionLoading('edit');
    setTimeout(() => {
      setProjects(prev => prev.map(p =>
        p.id === editingProject.id ? { ...p, ...updatedData } : p
      ));
      setShowEditModal(false);
      setEditingProject(null);
      setActionLoading(null);
      showToast('Project updated successfully!', 'success');
    }, 600);
  }, [editingProject, showToast]);

  // ============ DELETE PROJECT ============
  const handleDeleteProject = useCallback((projectId) => {
    const project = projects.find(p => p.id === projectId);
    showConfirmation({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project?.name || 'this project'}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setActionLoading(`delete_${id}`);
          setTimeout(() => {
            setProjects(prev => {
              const updated = prev.filter(p => p.id !== id);
              updateStats(updated);
              showToast('Project deleted successfully!', 'error');
              return updated;
            });
            setActionLoading(null);
            resolve();
          }, 600);
        });
      },
      projectId,
      action: 'delete',
    });
  }, [projects, showConfirmation, showToast, updateStats]);

  // ============ VIEW UNIT AVAILABILITY ============
  const handleViewUnits = useCallback((project) => {
    setUnitProject(project);
    setShowUnitModal(true);
  }, []);

  // ============ VIEW FLOOR PLANS ============
  const handleViewFloorPlans = useCallback((project) => {
    setFloorPlanProject(project);
    setShowFloorPlanModal(true);
  }, []);

  // ============ TOGGLE FEATURE ============
  const handleToggleFeature = useCallback((projectId) => {
    const project = projects.find(p => p.id === projectId);
    const isFeatured = project?.isFeatured;
    showConfirmation({
      title: isFeatured ? 'Remove Feature' : 'Feature Project',
      message: isFeatured
        ? `Are you sure you want to remove featured status from "${project?.name}"?`
        : `Are you sure you want to feature "${project?.name}"? It will be highlighted in listings.`,
      confirmText: isFeatured ? 'Yes, Unfeature' : 'Yes, Feature',
      confirmColor: isFeatured ? 'bg-purple-500' : 'bg-amber-500',
      icon: isFeatured ? <FiXCircle className="text-4xl text-purple-500" /> : <FaStarSolid className="text-4xl text-amber-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setActionLoading(`feature_${id}`);
          setTimeout(() => {
            setProjects(prev => prev.map(p =>
              p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
            ));
            setActionLoading(null);
            showToast(`Project ${isFeatured ? 'unfeatured' : 'featured'} successfully!`, 'success');
            resolve();
          }, 400);
        });
      },
      projectId,
      action: 'feature',
    });
  }, [projects, showConfirmation, showToast]);

  // ============ TOGGLE VERIFY ============
  const handleToggleVerify = useCallback((projectId) => {
    const project = projects.find(p => p.id === projectId);
    const isVerified = project?.isVerified;
    showConfirmation({
      title: isVerified ? 'Unverify Project' : 'Verify Project',
      message: isVerified
        ? `Are you sure you want to unverify "${project?.name}"? The verified badge will be removed.`
        : `Are you sure you want to verify "${project?.name}"? It will get a verified badge.`,
      confirmText: isVerified ? 'Yes, Unverify' : 'Yes, Verify',
      confirmColor: isVerified ? 'bg-blue-500' : 'bg-emerald-500',
      icon: isVerified ? <FiXCircle className="text-4xl text-blue-500" /> : <FiShield className="text-4xl text-emerald-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setActionLoading(`verify_${id}`);
          setTimeout(() => {
            setProjects(prev => prev.map(p =>
              p.id === id ? { ...p, isVerified: !p.isVerified } : p
            ));
            setActionLoading(null);
            showToast(`Project ${isVerified ? 'unverified' : 'verified'} successfully!`, 'success');
            resolve();
          }, 400);
        });
      },
      projectId,
      action: 'verify',
    });
  }, [projects, showConfirmation, showToast]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedProjects.length === 0) {
      showToast('Please select projects first', 'warning');
      return;
    }

    const actionMap = {
      feature: {
        title: 'Feature Projects',
        message: `Are you sure you want to feature ${selectedProjects.length} selected project(s)?`,
        confirmText: 'Yes, Feature All',
        confirmColor: 'bg-amber-500',
        icon: <FaStarSolid className="text-4xl text-amber-500" />,
      },
      unfeature: {
        title: 'Unfeature Projects',
        message: `Are you sure you want to unfeature ${selectedProjects.length} selected project(s)?`,
        confirmText: 'Yes, Unfeature All',
        confirmColor: 'bg-purple-500',
        icon: <FiXCircle className="text-4xl text-purple-500" />,
      },
      delete: {
        title: 'Delete Projects',
        message: `Are you sure you want to delete ${selectedProjects.length} selected project(s)? This action cannot be undone.`,
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
            const selectedIds = new Set(selectedProjects);
            let updatedProjects = [...projects];

            updatedProjects = updatedProjects.map(p => {
              if (selectedIds.has(p.id)) {
                if (action === 'feature') {
                  return { ...p, isFeatured: true };
                } else if (action === 'unfeature') {
                  return { ...p, isFeatured: false };
                } else if (action === 'delete') {
                  return null;
                }
              }
              return p;
            }).filter(Boolean);

            setProjects(updatedProjects);
            updateStats(updatedProjects);
            setSelectedProjects([]);
            setActionLoading(null);
            showToast(`${selectedProjects.length} project(s) ${action === 'feature' ? 'featured' : action === 'unfeature' ? 'unfeatured' : 'deleted'}`, 'success');
            resolve();
          }, 800);
        });
      },
      projectId: 'bulk',
      action: action,
    });
  }, [selectedProjects, projects, showConfirmation, showToast, updateStats]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockProjects = generateMockProjects();
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      updateStats(mockProjects);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockProjects, showToast, updateStats]);

  // ============ EXPORT PROJECTS ============
  const handleExportProjects = useCallback(() => {
    const data = filteredProjects.map(p => ({
      Name: p.name,
      Type: p.type,
      Location: p.location,
      'Starting Price': p.price,
      'Total Units': p.totalUnits,
      'Available Units': p.availableUnits,
      Status: p.status,
      Builder: p.builderName,
      'Expected Completion': p.expectedCompletion,
      'Launch Date': p.launchDate,
      Featured: p.isFeatured ? 'Yes' : 'No',
      Verified: p.isVerified ? 'Yes' : 'No',
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredProjects.length} projects exported successfully`, 'success');
  }, [filteredProjects, showToast]);

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

      {/* View Project Modal */}
      <ViewProjectModal
        project={viewingProject}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingProject(null); }}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={editingProject}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingProject(null); }}
        onSave={handleSaveEdit}
        loading={actionLoading === 'edit'}
      />

      {/* Unit Availability Modal */}
      <UnitAvailabilityModal
        project={unitProject}
        show={showUnitModal}
        onClose={() => { setShowUnitModal(false); setUnitProject(null); }}
      />

      {/* Floor Plans Modal */}
      <FloorPlansModal
        project={floorPlanProject}
        show={showFloorPlanModal}
        onClose={() => { setShowFloorPlanModal(false); setFloorPlanProject(null); }}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Project Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredProjects.length} Projects
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage builders, track projects, monitor unit availability & floor plans</span>
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
              onClick={handleExportProjects}
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
                icon={<MdOutlineConstruction className="text-white text-sm" />}
                title="Total Projects"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiPlayCircle className="text-white text-sm" />}
                title="Ongoing"
                value={stats.ongoing}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={100}
                isActive={activeFilter === 'ongoing'}
                onClick={() => handleStatClick('ongoing')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Completed"
                value={stats.completed}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={200}
                isActive={activeFilter === 'completed'}
                onClick={() => handleStatClick('completed')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Upcoming"
                value={stats.upcoming}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={300}
                isActive={activeFilter === 'upcoming'}
                onClick={() => handleStatClick('upcoming')}
              />
              <StatCard
                icon={<FiFlag className="text-white text-sm" />}
                title="New Launches"
                value={stats.newLaunches}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={350}
                isActive={activeFilter === 'new-launch'}
                onClick={() => handleStatClick('new-launch')}
              />
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Total Units"
                value={stats.totalUnits}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={400}
                isActive={false}
                onClick={() => {}}
              />
              <StatCard
                icon={<FiCheckSquare className="text-white text-sm" />}
                title="Available Units"
                value={stats.availableUnits}
                color="bg-gradient-to-br from-teal-600 to-teal-400"
                delay={450}
                isActive={false}
                onClick={() => {}}
              />
              <StatCard
                icon={<FaStarSolid className="text-white text-sm" />}
                title="Featured"
                value={projects.filter(p => p.isFeatured).length}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={500}
                isActive={activeFilter === 'featured'}
                onClick={() => handleStatClick('featured')}
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
              placeholder="Search projects by name, location, builder, or type..."
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
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
                <option value="new-launch">New Launch</option>
                <option value="onHold">On Hold</option>
                <option value="cancelled">Cancelled</option>
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
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="mixed-use">Mixed-Use</option>
                <option value="luxury">Luxury</option>
                <option value="affordable">Affordable</option>
                <option value="township">Township</option>
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
        {selectedProjects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedProjects.length}</span> project(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('feature')}
                disabled={actionLoading === 'feature'}
                className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'feature' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FaStarSolid className="text-[10px]" />}
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('unfeature')}
                disabled={actionLoading === 'unfeature'}
                className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'unfeature' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Unfeature
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
                onClick={() => setSelectedProjects([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedProjects.map((project, index) => {
              const isSelected = selectedProjects.includes(project.id);
              const statusColors = {
                ongoing: 'bg-blue-100 text-blue-700 border-blue-200',
                completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                upcoming: 'bg-amber-100 text-amber-700 border-amber-200',
                'new-launch': 'bg-purple-100 text-purple-700 border-purple-200',
                onHold: 'bg-gray-100 text-gray-700 border-gray-200',
                cancelled: 'bg-red-100 text-red-700 border-red-200',
              };
              const projectBorder = {
                ongoing: 'border-l-blue-500',
                completed: 'border-l-emerald-500',
                upcoming: 'border-l-amber-500',
                'new-launch': 'border-l-purple-500',
                onHold: 'border-l-gray-400',
                cancelled: 'border-l-red-500',
              };

              return (
                <div
                  key={project.id}
                  className={`relative bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${projectBorder[project.status] || 'border-l-[#00695C]'} p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectProject(project.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          <MdOutlineConstruction className="text-2xl" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate max-w-[120px]">{project.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-700'}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                          {project.isVerified && (
                            <FiShield className="text-blue-600 text-[10px]" />
                          )}
                          {project.isFeatured && (
                            <FaStarSolid className="text-amber-500 text-[10px]" />
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewProject(project)}
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{project.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{project.builderName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Completion: {project.expectedCompletion}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{project.totalUnits}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Total Units</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#00695C]">{project.availableUnits}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">₹{(project.price / 100000).toFixed(1)}L</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Starting Price</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      onClick={() => handleViewUnits(project)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiLayers className="text-[10px]" /> Units
                    </button>
                    <button
                      onClick={() => handleViewFloorPlans(project)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiSquare className="text-[10px]" /> Floor Plans
                    </button>
                      <button
                        onClick={() => handleViewProject(project)}
                        className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                      >
                        <FiEye className="text-[10px]" /> View
                      </button>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <button
                      onClick={() => handleToggleFeature(project.id)}
                      disabled={actionLoading === `feature_${project.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        project.isFeatured
                          ? 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                          : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      }`}
                    >
                      {actionLoading === `feature_${project.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : (
                        <FaStarSolid className="text-[10px]" />
                      )}
                      {project.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => handleToggleVerify(project.id)}
                      disabled={actionLoading === `verify_${project.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        project.isVerified
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {actionLoading === `verify_${project.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : (
                        <FiShield className="text-[10px]" />
                      )}
                      {project.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={actionLoading === `delete_${project.id}`}
                      className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${project.id}` ? (
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
                  checked={selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>#</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Project Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('type')}>
                Type {sortField === 'type' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Location</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('totalUnits')}>
                Units {sortField === 'totalUnits' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('availableUnits')}>
                Available {sortField === 'availableUnits' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('price')}>
                Price {sortField === 'price' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center">Featured</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedProjects.map((project, index) => {
              const isSelected = selectedProjects.includes(project.id);
              const statusColors = {
                ongoing: 'bg-blue-100 text-blue-700',
                completed: 'bg-emerald-100 text-emerald-700',
                upcoming: 'bg-amber-100 text-amber-700',
                'new-launch': 'bg-purple-100 text-purple-700',
                onHold: 'bg-gray-100 text-gray-700',
                cancelled: 'bg-red-100 text-red-700',
              };
              const projectBorder = {
                ongoing: 'border-l-blue-500',
                completed: 'border-l-emerald-500',
                upcoming: 'border-l-amber-500',
                'new-launch': 'border-l-purple-500',
                onHold: 'border-l-gray-400',
                cancelled: 'border-l-red-500',
              };

              return (
                <div
                  key={project.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] border-l-4 ${projectBorder[project.status] || 'border-l-[#00695C]'} hover:bg-[#F5F9F8] transition-all duration-300 group relative ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProject(project.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-xs text-[#5A7D78]">{index + 1}</span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xs font-bold">
                        <MdOutlineConstruction className="text-sm" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1A2E2A] truncate">{project.name}</p>
                        <p className="text-[10px] text-[#5A7D78] truncate">{project.builderName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] || 'bg-gray-100 text-gray-700'}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{project.type}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{project.location}</div>

                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{project.totalUnits}</div>

                  <div className="col-span-1 text-center text-sm font-medium text-[#00695C]">{project.availableUnits}</div>

                  <div className="col-span-1 text-center text-sm font-semibold text-[#1A2E2A]">₹{(project.price / 100000).toFixed(1)}L</div>

                  <div className="col-span-1 text-center">
                    {project.isFeatured ? (
                      <FaStarSolid className="text-amber-500 text-sm mx-auto" />
                    ) : (
                      <span className="text-[#B5C9C5] text-xs">-</span>
                    )}
                  </div>


                   {/* In the List View */}

                  <div className="col-span-2 flex items-center justify-end gap-1 flex-wrap">
                    <button
                      onClick={() => handleViewUnits(project)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300 text-blue-600 hover:scale-110"
                      title="View Units"
                    >
                      <FiLayers className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewFloorPlans(project)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 text-indigo-600 hover:scale-110"
                      title="Floor Plans"
                    >
                      <FiSquare className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewProject(project)}
                      className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleToggleFeature(project.id)}
                      disabled={actionLoading === `feature_${project.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                        project.isFeatured
                          ? 'text-purple-600 hover:bg-purple-50'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                      title={project.isFeatured ? 'Unfeature' : 'Feature'}
                    >
                      {actionLoading === `feature_${project.id}` ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : (
                        <FaStarSolid className="text-sm" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleVerify(project.id)}
                      disabled={actionLoading === `verify_${project.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                        project.isVerified
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={project.isVerified ? 'Unverify' : 'Verify'}
                    >
                      {actionLoading === `verify_${project.id}` ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : (
                        <FiShield className="text-sm" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={actionLoading === `delete_${project.id}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === `delete_${project.id}` ? (
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

        {paginatedProjects.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <MdOutlineConstruction className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No projects found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No projects match your current view'}
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
              {Math.min(currentPage * pageSize, filteredProjects.length)} of{' '}
              {filteredProjects.length} projects
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

export default BuildersProjects;