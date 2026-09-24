// src/components/dashboard/admin/PropertyManagers/PropertyManagersCompanyManagement.jsx

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
  FiCheckSquare, FiPlayCircle, FiFlag, FiUserPlus,
  FiUserMinus, FiBookOpen, FiClipboard, FiServer, FiDatabase, FiLink
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie, FaUserGraduate,
  FaCity, FaHammer, FaHardHat, FaClipboardList,
  FaUsers, FaUserFriends, FaUserPlus as FaUserPlusSolid
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlineLeaderboard, MdOutlineConstruction, MdOutlineApartment, MdOutlineManageAccounts, MdOutlinePeople } from 'react-icons/md';

// ========== TOAST COMPONENT ==========
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

// ============ VIEW COMPANY DETAILS MODAL ============
const ViewCompanyModal = ({ company, show, onClose }) => {
  if (!company || !show) return null;

  const statusBadge = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEye className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Company Details</h2>
              <p className="text-white/70 text-[10px]">View company information</p>
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
              <h3 className="text-lg font-bold text-[#1A2E2A]">{company.name}</h3>
              <p className="text-sm text-[#5A7D78]">{company.type} · {company.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${statusBadge[company.status] || statusBadge.active}`}>
                {(company.status || 'active').charAt(0).toUpperCase() + (company.status || 'active').slice(1)}
              </span>
              {company.isVerified && (
                <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
                  <FiShield className="inline mr-1 text-xs" /> Verified
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{company.staffCount}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Staff</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#1A2E2A]">{company.ownerCount}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Owners</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl">
              <p className="text-lg font-bold text-[#00695C]">{company.tenantCount}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Tenants</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm bg-[#F5F9F8] rounded-xl p-3">
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiMapPin className="text-[#00695C]" /> {company.location}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiMail className="text-[#00695C]" /> {company.email}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiPhone className="text-[#00695C]" /> {company.phone}
              </div>
              <div className="flex items-center gap-2 text-[#5A7D78]">
                <FiGlobe className="text-[#00695C]" /> {company.website || 'N/A'}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">About</h4>
            <p className="text-sm text-[#5A7D78] leading-relaxed bg-[#F5F9F8] rounded-xl p-3">
              {company.description || 'No description available.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Assigned Properties</h4>
            <div className="flex flex-wrap gap-2">
              {company.properties && company.properties.length > 0 ? (
                company.properties.map((prop, i) => (
                  <span key={i} className="px-3 py-1 bg-[#F5F9F8] rounded-lg text-xs text-[#1A2E2A]">{prop}</span>
                ))
              ) : (
                <p className="text-sm text-[#5A7D78]">No properties assigned</p>
              )}
            </div>
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

// ============ EDIT/REGISTER COMPANY MODAL ============
const CompanyFormModal = ({ company, show, onClose, onSave, loading, mode = 'edit' }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      if (company && mode === 'edit') {
        setFormData({
          name: company.name || '',
          type: company.type || 'Property Management',
          location: company.location || '',
          email: company.email || '',
          phone: company.phone || '',
          website: company.website || '',
          description: company.description || '',
          isVerified: company.isVerified || false,
          status: company.status || 'active',
          staffCount: company.staffCount || 0,
          ownerCount: company.ownerCount || 0,
          tenantCount: company.tenantCount || 0,
          properties: company.properties ? company.properties.join(', ') : '',
        });
      } else {
        setFormData({
          name: '',
          type: 'Property Management',
          location: '',
          email: '',
          phone: '',
          website: '',
          description: '',
          isVerified: false,
          status: 'active',
          staffCount: 0,
          ownerCount: 0,
          tenantCount: 0,
          properties: '',
        });
      }
      setErrors({});
    }
  }, [company, show, mode]);

  if (!show || !formData) return null;

  const companyTypes = ['Property Management', 'Real Estate Agency', 'Facility Management', 'Housing Association', 'Developer'];

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
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const propertiesArray = formData.properties
      ? formData.properties.split(',').map(p => p.trim()).filter(p => p)
      : [];

    const updatedData = {
      ...formData,
      properties: propertiesArray,
      staffCount: Number(formData.staffCount),
      ownerCount: Number(formData.ownerCount),
      tenantCount: Number(formData.tenantCount),
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
              {mode === 'edit' ? <FiEdit className="text-sm" /> : <FiPlus className="text-sm" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{mode === 'edit' ? 'Edit Company' : 'Register Company'}</h2>
              <p className="text-white/70 text-[10px]">{mode === 'edit' ? 'Update company details' : 'Add a new property management company'}</p>
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
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Company Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Company Type</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                {companyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Location <span className="text-red-500">*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.location ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.location && <p className="text-[10px] text-red-500 mt-0.5">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.phone ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
              {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Staff Count</label>
              <input type="number" name="staffCount" value={formData.staffCount} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Owner Count</label>
              <input type="number" name="ownerCount" value={formData.ownerCount} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Tenant Count</label>
              <input type="number" name="tenantCount" value={formData.tenantCount} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" placeholder="https://example.com" />
          </div>

          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assigned Properties <span className="text-[#B5C9C5]">(comma separated)</span></label>
            <input type="text" name="properties" value={formData.properties} onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" placeholder="Green Valley, Lake View, Royal Palm" />
          </div>

          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              rows="2" className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none" />
          </div>

          {mode === 'edit' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Company Status</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-[#1A2E2A] pb-2">
                <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C]" />
                Verified Company
              </label>
            </div>
          )}

          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex items-center gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting || loading ? <><FiRefreshCw className="animate-spin text-sm" /> {mode === 'edit' ? 'Saving...' : 'Registering...'}</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Save Changes' : 'Register Company'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ STAFF MANAGEMENT MODAL ============
const StaffManagementModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', role: 'Property Manager', email: 'john@example.com', phone: '+91 98765 43210', status: 'active' },
    { id: 2, name: 'Jane Smith', role: 'Assistant Manager', email: 'jane@example.com', phone: '+91 98765 43211', status: 'active' },
    { id: 3, name: 'Robert Johnson', role: 'Leasing Agent', email: 'robert@example.com', phone: '+91 98765 43212', status: 'inactive' },
    { id: 4, name: 'Mary Williams', role: 'Property Manager', email: 'mary@example.com', phone: '+91 98765 43213', status: 'active' },
    { id: 5, name: 'David Brown', role: 'Maintenance Coordinator', email: 'david@example.com', phone: '+91 98765 43214', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaff, setFilteredStaff] = useState(staff);
  const [toast, setToast] = useState(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No', confirmColor: 'bg-red-500', icon: null, onConfirm: null });

  useEffect(() => {
    const filtered = staff.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staff]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const askToggleStatus = (member) => {
    const willActivate = member.status !== 'active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Staff Member' : 'Deactivate Staff Member',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} "${member.name}"?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setStaff(prev => prev.map(s => s.id === member.id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
        showToastMessage('Staff status updated', 'success');
        closeConfirm();
      },
    });
  };

  const askDeleteStaff = (member) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Staff Member',
      message: `Are you sure you want to remove "${member.name}" from staff? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setStaff(prev => prev.filter(s => s.id !== member.id));
        showToastMessage('Staff removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  const handleAddStaff = (newStaff) => {
    setStaff(prev => [...prev, { ...newStaff, id: Date.now() }]);
    setShowAddStaff(false);
    showToastMessage('Staff added successfully', 'success');
  };

  const handleEditStaff = (updatedStaff) => {
    setStaff(prev => prev.map(s =>
      s.id === updatedStaff.id ? updatedStaff : s
    ));
    setEditingStaff(null);
    showToastMessage('Staff updated successfully', 'success');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Staff Management</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {staff.length} staff members</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddStaff(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 flex items-center gap-2 hover:scale-105"
            >
              <FiPlus className="text-sm" /> Add Staff
            </button>
          </div>

          <div className="space-y-2">
            {filteredStaff.map((staffMember) => (
              <div key={staffMember.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C] hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {staffMember.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{staffMember.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A7D78]">
                      <span>{staffMember.role}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{staffMember.email}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{staffMember.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${staffMember.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {staffMember.status.charAt(0).toUpperCase() + staffMember.status.slice(1)}
                  </span>
                  <button
                    onClick={() => askToggleStatus(staffMember)}
                    className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${staffMember.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={staffMember.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {staffMember.status === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                  </button>
                  <button
                    onClick={() => setEditingStaff(staffMember)}
                    className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                    title="Edit Staff"
                  >
                    <FiEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => askDeleteStaff(staffMember)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110"
                    title="Remove Staff"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {filteredStaff.length === 0 && (
              <div className="text-center py-8 text-[#5A7D78]">No staff members found</div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>

        {/* Add Staff Modal */}
        <StaffFormModal
          show={showAddStaff}
          onClose={() => setShowAddStaff(false)}
          onSave={handleAddStaff}
          mode="add"
        />

        {/* Edit Staff Modal */}
        <StaffFormModal
          show={!!editingStaff}
          onClose={() => setEditingStaff(null)}
          onSave={handleEditStaff}
          staff={editingStaff}
          mode="edit"
        />
      </div>
    </div>
  );
};

// ============ STAFF FORM MODAL ============
const StaffFormModal = ({ show, onClose, onSave, staff, mode = 'add' }) => {
  const [formData, setFormData] = useState({ name: '', role: '', email: '', phone: '', status: 'active' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && staff && mode === 'edit') {
      setFormData({
        name: staff.name || '',
        role: staff.role || '',
        email: staff.email || '',
        phone: staff.phone || '',
        status: staff.status || 'active',
      });
    } else if (show) {
      setFormData({ name: '', role: '', email: '', phone: '', status: 'active' });
    }
    setErrors({});
  }, [show, staff, mode]);

  if (!show) return null;

  const roles = ['Property Manager', 'Assistant Manager', 'Leasing Agent', 'Maintenance Coordinator', 'Administrator'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = mode === 'edit' && staff ? { ...formData, id: staff.id } : formData;
    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Staff' : 'Add Staff'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Role <span className="text-red-500">*</span></label>
            <select name="role" value={formData.role} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.role ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`}>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.role && <p className="text-[10px] text-red-500 mt-0.5">{errors.role}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.phone ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
          </div>
          {mode === 'edit' && (
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ OWNER MANAGEMENT MODAL ============
const OwnerManagementModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const [owners, setOwners] = useState([
    { id: 1, name: 'Michael Chen', email: 'michael@example.com', phone: '+91 98765 43215', properties: ['Green Valley', 'Lake View'], status: 'active' },
    { id: 2, name: 'Sarah Patel', email: 'sarah@example.com', phone: '+91 98765 43216', properties: ['Royal Palm'], status: 'active' },
    { id: 3, name: 'James Wilson', email: 'james@example.com', phone: '+91 98765 43217', properties: ['City Heights'], status: 'inactive' },
    { id: 4, name: 'Lisa Johnson', email: 'lisa@example.com', phone: '+91 98765 43218', properties: ['Garden Villa', 'Sunset Bay'], status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOwners, setFilteredOwners] = useState(owners);
  const [toast, setToast] = useState(null);
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No', confirmColor: 'bg-red-500', icon: null, onConfirm: null });

  useEffect(() => {
    const filtered = owners.filter(o =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const askToggleStatus = (o) => {
    const willActivate = o.status !== 'active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Owner' : 'Deactivate Owner',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} "${o.name}"?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setOwners(prev => prev.map(x => x.id === o.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
        showToastMessage('Owner status updated', 'success');
        closeConfirm();
      },
    });
  };

  const askDeleteOwner = (o) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Owner',
      message: `Are you sure you want to remove "${o.name}"? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setOwners(prev => prev.filter(x => x.id !== o.id));
        showToastMessage('Owner removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  const handleAddOwner = (newOwner) => {
    setOwners(prev => [...prev, { ...newOwner, id: Date.now() }]);
    setShowAddOwner(false);
    showToastMessage('Owner added successfully', 'success');
  };

  const handleEditOwner = (updatedOwner) => {
    setOwners(prev => prev.map(o =>
      o.id === updatedOwner.id ? updatedOwner : o
    ));
    setEditingOwner(null);
    showToastMessage('Owner updated successfully', 'success');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUser className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Owner Management</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {owners.length} owners</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddOwner(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 flex items-center gap-2 hover:scale-105"
            >
              <FiPlus className="text-sm" /> Add Owner
            </button>
          </div>

          <div className="space-y-2">
            {filteredOwners.map((owner) => (
              <div key={owner.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {owner.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{owner.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A7D78]">
                      <span>{owner.email}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{owner.phone}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{owner.properties.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${owner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {owner.status.charAt(0).toUpperCase() + owner.status.slice(1)}
                  </span>
                  <button
                    onClick={() => askToggleStatus(owner)}
                    className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${owner.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={owner.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {owner.status === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                  </button>
                  <button
                    onClick={() => setEditingOwner(owner)}
                    className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                    title="Edit Owner"
                  >
                    <FiEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => askDeleteOwner(owner)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110"
                    title="Remove Owner"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {filteredOwners.length === 0 && (
              <div className="text-center py-8 text-[#5A7D78]">No owners found</div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>

        <OwnerFormModal
          show={showAddOwner}
          onClose={() => setShowAddOwner(false)}
          onSave={handleAddOwner}
          mode="add"
        />

        <OwnerFormModal
          show={!!editingOwner}
          onClose={() => setEditingOwner(null)}
          onSave={handleEditOwner}
          owner={editingOwner}
          mode="edit"
        />
      </div>
    </div>
  );
};

// ============ OWNER FORM MODAL ============
const OwnerFormModal = ({ show, onClose, onSave, owner, mode = 'add' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', properties: '', status: 'active' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && owner && mode === 'edit') {
      setFormData({
        name: owner.name || '',
        email: owner.email || '',
        phone: owner.phone || '',
        properties: owner.properties ? owner.properties.join(', ') : '',
        status: owner.status || 'active',
      });
    } else if (show) {
      setFormData({ name: '', email: '', phone: '', properties: '', status: 'active' });
    }
    setErrors({});
  }, [show, owner, mode]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const propertiesArray = formData.properties
      ? formData.properties.split(',').map(p => p.trim()).filter(p => p)
      : [];
    const payload = {
      ...formData,
      properties: propertiesArray,
      ...(mode === 'edit' && owner ? { id: owner.id } : {}),
    };
    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Owner' : 'Add Owner'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.phone ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Properties <span className="text-[#B5C9C5]">(comma separated)</span></label>
            <input type="text" name="properties" value={formData.properties} onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" placeholder="Green Valley, Lake View" />
          </div>
          {mode === 'edit' && (
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ TENANT MANAGEMENT MODAL ============
const TenantManagementModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const [tenants, setTenants] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+91 98765 43219', property: 'Green Valley', unit: 'A-101', status: 'active' },
    { id: 2, name: 'Bob Williams', email: 'bob@example.com', phone: '+91 98765 43220', property: 'Lake View', unit: 'B-202', status: 'active' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', phone: '+91 98765 43221', property: 'Royal Palm', unit: 'C-303', status: 'inactive' },
    { id: 4, name: 'David Lee', email: 'david@example.com', phone: '+91 98765 43222', property: 'City Heights', unit: 'D-404', status: 'active' },
    { id: 5, name: 'Emma Wilson', email: 'emma@example.com', phone: '+91 98765 43223', property: 'Green Valley', unit: 'A-102', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTenants, setFilteredTenants] = useState(tenants);
  const [toast, setToast] = useState(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No', confirmColor: 'bg-red-500', icon: null, onConfirm: null });

  useEffect(() => {
    const filtered = tenants.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTenants(filtered);
  }, [searchTerm, tenants]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const askToggleStatus = (t) => {
    const willActivate = t.status !== 'active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Tenant' : 'Deactivate Tenant',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} "${t.name}"?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setTenants(prev => prev.map(x => x.id === t.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
        showToastMessage('Tenant status updated', 'success');
        closeConfirm();
      },
    });
  };

  const askDeleteTenant = (t) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Tenant',
      message: `Are you sure you want to remove "${t.name}"? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setTenants(prev => prev.filter(x => x.id !== t.id));
        showToastMessage('Tenant removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  const handleAddTenant = (newTenant) => {
    setTenants(prev => [...prev, { ...newTenant, id: Date.now() }]);
    setShowAddTenant(false);
    showToastMessage('Tenant added successfully', 'success');
  };

  const handleEditTenant = (updatedTenant) => {
    setTenants(prev => prev.map(t =>
      t.id === updatedTenant.id ? updatedTenant : t
    ));
    setEditingTenant(null);
    showToastMessage('Tenant updated successfully', 'success');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tenant Management</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {tenants.length} tenants</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search tenants by name, property, or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddTenant(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 flex items-center gap-2 hover:scale-105"
            >
              <FiPlus className="text-sm" /> Add Tenant
            </button>
          </div>

          <div className="space-y-2">
            {filteredTenants.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-purple-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {tenant.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{tenant.name}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A7D78]">
                      <span>{tenant.email}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{tenant.phone}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="font-medium text-[#00695C]">{tenant.property}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>Unit {tenant.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${tenant.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </span>
                  <button
                    onClick={() => askToggleStatus(tenant)}
                    className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${tenant.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={tenant.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {tenant.status === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                  </button>
                  <button
                    onClick={() => setEditingTenant(tenant)}
                    className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                    title="Edit Tenant"
                  >
                    <FiEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => askDeleteTenant(tenant)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110"
                    title="Remove Tenant"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {filteredTenants.length === 0 && (
              <div className="text-center py-8 text-[#5A7D78]">No tenants found</div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>

        <TenantFormModal
          show={showAddTenant}
          onClose={() => setShowAddTenant(false)}
          onSave={handleAddTenant}
          mode="add"
        />

        <TenantFormModal
          show={!!editingTenant}
          onClose={() => setEditingTenant(null)}
          onSave={handleEditTenant}
          tenant={editingTenant}
          mode="edit"
        />
      </div>
    </div>
  );
};

// ============ TENANT FORM MODAL ============
const TenantFormModal = ({ show, onClose, onSave, tenant, mode = 'add' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', property: '', unit: '', status: 'active' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && tenant && mode === 'edit') {
      setFormData({
        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        property: tenant.property || '',
        unit: tenant.unit || '',
        status: tenant.status || 'active',
      });
    } else if (show) {
      setFormData({ name: '', email: '', phone: '', property: '', unit: '', status: 'active' });
    }
    setErrors({});
  }, [show, tenant, mode]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.property.trim()) newErrors.property = 'Property is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = mode === 'edit' && tenant ? { ...formData, id: tenant.id } : formData;
    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Tenant' : 'Add Tenant'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.phone ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
            {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Property <span className="text-red-500">*</span></label>
            <input type="text" name="property" value={formData.property} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.property ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} placeholder="Property name" />
            {errors.property && <p className="text-[10px] text-red-500 mt-0.5">{errors.property}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Unit <span className="text-red-500">*</span></label>
            <input type="text" name="unit" value={formData.unit} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.unit ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} placeholder="A-101" />
            {errors.unit && <p className="text-[10px] text-red-500 mt-0.5">{errors.unit}</p>}
          </div>
          {mode === 'edit' && (
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ PROPERTY ASSIGNMENT MODAL ============
const PropertyAssignmentModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const [assignments, setAssignments] = useState([
    { id: 1, property: 'Green Valley', assignedTo: 'John Doe (Manager)', status: 'active', units: 120, occupancy: 85 },
    { id: 2, property: 'Lake View', assignedTo: 'Jane Smith (Assistant)', status: 'active', units: 80, occupancy: 75 },
    { id: 3, property: 'Royal Palm', assignedTo: 'Robert Johnson (Agent)', status: 'pending', units: 60, occupancy: 45 },
    { id: 4, property: 'City Heights', assignedTo: 'Mary Williams (Manager)', status: 'active', units: 100, occupancy: 90 },
    { id: 5, property: 'Garden Villa', assignedTo: 'David Brown (Coordinator)', status: 'active', units: 40, occupancy: 70 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState(assignments);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No', confirmColor: 'bg-red-500', icon: null, onConfirm: null });
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    const filtered = assignments.filter(a =>
      a.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [searchTerm, assignments]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddAssignment = (newAssignment) => {
    setAssignments(prev => [...prev, { ...newAssignment, id: Date.now() }]);
    setShowAddAssignment(false);
    showToastMessage('Assignment added successfully', 'success');
  };

  const handleEditAssignment = (updatedAssignment) => {
    setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
    setEditingAssignment(null);
    showToastMessage('Assignment updated successfully', 'success');
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const askToggleStatus = (a) => {
    const willActivate = a.status !== 'active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Assignment' : 'Deactivate Assignment',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} the assignment for "${a.property}"?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setAssignments(prev => prev.map(x => x.id === a.id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
        showToastMessage('Assignment status updated', 'success');
        closeConfirm();
      },
    });
  };

  const askDeleteAssignment = (a) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Assignment',
      message: `Are you sure you want to remove the assignment for "${a.property}"? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setAssignments(prev => prev.filter(x => x.id !== a.id));
        showToastMessage('Assignment removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiLink className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Property Assignments</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {assignments.length} assignments</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
            </div>
            <button
              onClick={() => setShowAddAssignment(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 flex items-center gap-2 hover:scale-105"
            >
              <FiPlus className="text-sm" /> Add Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-[#F5F9F8] rounded-xl p-4 border-l-4 border-l-[#00695C] hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-[#1A2E2A]">{assignment.property}</h4>
                    <p className="text-xs text-[#5A7D78] mt-0.5">Assigned to: {assignment.assignedTo}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${assignment.status === 'active' ? 'bg-emerald-100 text-emerald-700' : assignment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-[#5A7D78]">Units:</span>
                    <span className="font-semibold text-[#1A2E2A] ml-1">{assignment.units}</span>
                  </div>
                  <div>
                    <span className="text-[#5A7D78]">Occupancy:</span>
                    <span className="font-semibold text-[#00695C] ml-1">{assignment.occupancy}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                  <button
                    onClick={() => setEditingAssignment(assignment)}
                    className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-lg hover:bg-[#C5EDE5] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1"
                  >
                    <FiEdit className="text-[10px]" /> Edit
                  </button>
                  <button
                    onClick={() => askToggleStatus(assignment)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 ${assignment.status === 'active' ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                  >
                    {assignment.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => askDeleteAssignment(assignment)}
                    className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300 hover:scale-105"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {filteredAssignments.length === 0 && (
              <div className="col-span-2 text-center py-8 text-[#5A7D78]">No assignments found</div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>

        <AssignmentFormModal
          show={showAddAssignment}
          onClose={() => setShowAddAssignment(false)}
          onSave={handleAddAssignment}
          mode="add"
        />

        <AssignmentFormModal
          show={!!editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onSave={handleEditAssignment}
          assignment={editingAssignment}
          mode="edit"
        />
      </div>
    </div>
  );
};

// ============ ASSIGNMENT FORM MODAL ============
const AssignmentFormModal = ({ show, onClose, onSave, assignment, mode = 'add' }) => {
  const [formData, setFormData] = useState({ property: '', assignedTo: '', status: 'active', units: 0, occupancy: 0 });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && assignment && mode === 'edit') {
      setFormData({
        property: assignment.property || '',
        assignedTo: assignment.assignedTo || '',
        status: assignment.status || 'active',
        units: assignment.units || 0,
        occupancy: assignment.occupancy || 0,
      });
    } else if (show) {
      setFormData({ property: '', assignedTo: '', status: 'active', units: 0, occupancy: 0 });
    }
    setErrors({});
  }, [show, assignment, mode]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.property.trim()) newErrors.property = 'Property name is required';
    if (!formData.assignedTo.trim()) newErrors.assignedTo = 'Assignee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = {
      ...formData,
      units: Number(formData.units) || 0,
      occupancy: Math.min(100, Math.max(0, Number(formData.occupancy) || 0)),
      ...(mode === 'edit' && assignment ? { id: assignment.id } : {}),
    };
    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Assignment' : 'Add Assignment'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Property <span className="text-red-500">*</span></label>
            <input type="text" name="property" value={formData.property} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.property ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} placeholder="Green Valley" />
            {errors.property && <p className="text-[10px] text-red-500 mt-0.5">{errors.property}</p>}
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assigned To <span className="text-red-500">*</span></label>
            <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange}
              className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.assignedTo ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} placeholder="John Doe (Manager)" />
            {errors.assignedTo && <p className="text-[10px] text-red-500 mt-0.5">{errors.assignedTo}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Units</label>
              <input type="number" name="units" value={formData.units} onChange={handleChange} min="0"
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Occupancy %</label>
              <input type="number" name="occupancy" value={formData.occupancy} onChange={handleChange} min="0" max="100"
                className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ COMPANY SELECT MODAL (for Quick Actions) ============
const CompanySelectModal = ({ show, onClose, companies, onSelect, title, icon }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (show) setSearch('');
  }, [show]);

  if (!show) return null;

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[75vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              {icon}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{title}</h2>
              <p className="text-white/70 text-[10px]">Choose a company to continue</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="p-4 border-b border-[#E8F0EE]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              autoFocus
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="w-full flex items-center gap-3 p-3 bg-[#F5F9F8] rounded-xl hover:bg-[#E8F4F2] transition-all duration-300 text-left hover:scale-[1.01]"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white flex-shrink-0">
                <MdOutlineBusiness className="text-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-[#1A2E2A] truncate">{c.name}</p>
                <p className="text-[11px] text-[#5A7D78] truncate">{c.type} · {c.location}</p>
              </div>
              <FiChevronRight className="text-[#B5C9C5] text-sm flex-shrink-0" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-[#5A7D78] text-sm">No companies found</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const PropertyManagersCompanyManagement = () => {
  const navigate = useNavigate();

  // ============ STATE ============
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterCount, setFilterCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal states
  const [viewingCompany, setViewingCompany] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [staffCompany, setStaffCompany] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [ownerCompany, setOwnerCompany] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [tenantCompany, setTenantCompany] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [assignmentCompany, setAssignmentCompany] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Quick Actions company picker (for Staff/Owner/Tenant/Assignment management)
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [pickerAction, setPickerAction] = useState(null); // 'staff' | 'owner' | 'tenant' | 'assignment'

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
    companyId: null,
    action: null,
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    active: 0,
    inactive: 0,
    rejected: 0,
    totalStaff: 0,
    totalOwners: 0,
    totalTenants: 0,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK COMPANIES ============
  const generateMockCompanies = useCallback(() => {
    const companyNames = [
      'Prestige Property Management', 'Golden Gate Realty', 'Urban Nest Solutions',
      'Elite Estate Managers', 'Cityscape Properties', 'Royal Oak Management',
      'Silverline Real Estate', 'Heritage Property Services', 'Crestview Management',
      'Park Avenue Realty', 'Harbor Property Group', 'Skyline Management',
    ];

    const types = ['Property Management', 'Real Estate Agency', 'Facility Management', 'Housing Association', 'Developer'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.in'];
    const statuses = ['active', 'active', 'active', 'inactive', 'rejected'];

    return companyNames.map((name, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const staffCount = Math.floor(Math.random() * 50) + 5;
      const ownerCount = Math.floor(Math.random() * 100) + 10;
      const tenantCount = Math.floor(Math.random() * 200) + 20;

      return {
        id: `company_${i + 1}`,
        name: name,
        type: type,
        location: `${city}, India`,
        email: `${name.toLowerCase().replace(/\s/g, '')}@${domains[Math.floor(Math.random() * domains.length)]}`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        website: `https://${name.toLowerCase().replace(/\s/g, '')}.com`,
        description: `${type} company based in ${city} managing residential and commercial properties with a focus on customer satisfaction.`,
        isVerified: Math.random() > 0.6,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        staffCount: staffCount,
        ownerCount: ownerCount,
        tenantCount: tenantCount,
        properties: ['Green Valley', 'Lake View', 'Royal Palm', 'City Heights', 'Garden Villa', 'Sunset Bay'].slice(0, Math.floor(Math.random() * 4) + 2),
        registeredDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      };
    });
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockCompanies = generateMockCompanies();
    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
    updateStats(mockCompanies);
  }, [generateMockCompanies]);

  // ============ UPDATE STATS ============
  const updateStats = useCallback((companiesList) => {
    setStats({
      total: companiesList.length,
      verified: companiesList.filter(c => c.isVerified).length,
      active: companiesList.filter(c => (c.status || 'active') === 'active').length,
      inactive: companiesList.filter(c => c.status === 'inactive').length,
      rejected: companiesList.filter(c => c.status === 'rejected').length,
      totalStaff: companiesList.reduce((sum, c) => sum + (c.staffCount || 0), 0),
      totalOwners: companiesList.reduce((sum, c) => sum + (c.ownerCount || 0), 0),
      totalTenants: companiesList.reduce((sum, c) => sum + (c.tenantCount || 0), 0),
    });
  }, []);

  // Recompute stats whenever the companies list changes (add/edit/delete/verify)
  useEffect(() => {
    updateStats(companies);
  }, [companies, updateStats]);

  // ============ FILTER COMPANIES ============
  const filterCompanies = useCallback(() => {
    let filtered = [...companies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(c => c.type.toLowerCase() === selectedType.toLowerCase());
    }

    if (activeFilter === 'verified') {
      filtered = filtered.filter(c => c.isVerified);
    } else if (activeFilter === 'active' || activeFilter === 'inactive' || activeFilter === 'rejected') {
      filtered = filtered.filter(c => (c.status || 'active') === activeFilter);
    }

    let count = 0;
    if (selectedType !== 'all') count++;
    if (searchQuery) count++;
    if (activeFilter !== 'all') count++;
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

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [companies, searchQuery, selectedType, sortField, sortDirection, activeFilter]);

  useEffect(() => {
    filterCompanies();
  }, [filterCompanies]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = useMemo(() =>
    filteredCompanies.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredCompanies, currentPage, pageSize]);

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
    if (selectedCompanies.length === paginatedCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(paginatedCompanies.map(c => c.id));
    }
  }, [selectedCompanies, paginatedCompanies]);

  // ============ HANDLE SELECT COMPANY ============
  const handleSelectCompany = useCallback((companyId) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId) ? prev.filter(id => id !== companyId) : [...prev, companyId]
    );
  }, []);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    setSelectedType('all');
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
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
    companyId,
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
      companyId,
      action,
    });
  }, []);

  // ============ CLOSE CONFIRMATION MODAL ============
  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ============ HANDLE CONFIRM ACTION ============
  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, companyId, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${companyId}`);
      await onConfirm(companyId);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ VIEW COMPANY ============
  const handleViewCompany = useCallback((company) => {
    setViewingCompany(company);
    setShowViewModal(true);
  }, []);

  // ============ EDIT COMPANY ============
  const handleEditCompany = useCallback((company) => {
    setEditingCompany(company);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const handleSaveEdit = useCallback((updatedData) => {
    setActionLoading('edit');
    setTimeout(() => {
      setCompanies(prev => prev.map(c =>
        c.id === editingCompany.id ? { ...c, ...updatedData } : c
      ));
      setShowEditModal(false);
      setEditingCompany(null);
      setActionLoading(null);
      showToast('Company updated successfully!', 'success');
    }, 600);
  }, [editingCompany, showToast]);

  // ============ REGISTER COMPANY ============
  const handleRegisterCompany = useCallback((newData) => {
    setActionLoading('register');
    setTimeout(() => {
      const newCompany = {
        ...newData,
        status: newData.status || 'active',
        id: `company_${Date.now()}`,
        registeredDate: new Date().toISOString().split('T')[0],
      };
      setCompanies(prev => [...prev, newCompany]);
      setShowRegisterModal(false);
      setActionLoading(null);
      showToast('Company registered successfully!', 'success');
    }, 600);
  }, [showToast]);

  // ============ DELETE COMPANY ============
  const handleDeleteCompany = useCallback((companyId) => {
    const company = companies.find(c => c.id === companyId);
    showConfirmation({
      title: 'Delete Company',
      message: `Are you sure you want to delete "${company?.name || 'this company'}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setActionLoading(`delete_${id}`);
          setTimeout(() => {
            setCompanies(prev => {
              const updated = prev.filter(c => c.id !== id);
              showToast('Company deleted successfully!', 'error');
              return updated;
            });
            setActionLoading(null);
            resolve();
          }, 600);
        });
      },
      companyId,
      action: 'delete',
    });
  }, [companies, showConfirmation, showToast]);

  // ============ TOGGLE VERIFY ============
  const handleToggleVerify = useCallback((companyId) => {
    const company = companies.find(c => c.id === companyId);
    const isVerified = company?.isVerified;
    showConfirmation({
      title: isVerified ? 'Unverify Company' : 'Verify Company',
      message: isVerified
        ? `Are you sure you want to unverify "${company?.name}"? The verified badge will be removed.`
        : `Are you sure you want to verify "${company?.name}"? It will get a verified badge.`,
      confirmText: isVerified ? 'Yes, Unverify' : 'Yes, Verify',
      cancelText: 'No',
      confirmColor: isVerified ? 'bg-blue-500' : 'bg-emerald-500',
      icon: isVerified ? <FiXCircle className="text-4xl text-blue-500" /> : <FiShield className="text-4xl text-emerald-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setActionLoading(`verify_${id}`);
          setTimeout(() => {
            setCompanies(prev => prev.map(c =>
              c.id === id ? { ...c, isVerified: !c.isVerified } : c
            ));
            setActionLoading(null);
            showToast(`Company ${isVerified ? 'unverified' : 'verified'} successfully!`, 'success');
            resolve();
          }, 400);
        });
      },
      companyId,
      action: 'verify',
    });
  }, [companies, showConfirmation, showToast]);

  // ============ TOGGLE COMPANY ACTIVE STATUS ============
  const handleToggleActive = useCallback((companyId) => {
    const company = companies.find(c => c.id === companyId);
    const isActive = (company?.status || 'active') === 'active';
    showConfirmation({
      title: isActive ? 'Deactivate Company' : 'Activate Company',
      message: isActive
        ? `Are you sure you want to deactivate "${company?.name}"? They will be marked inactive.`
        : `Are you sure you want to activate "${company?.name}"? They will be marked active.`,
      confirmText: isActive ? 'Yes, Deactivate' : 'Yes, Activate',
      cancelText: 'No',
      confirmColor: isActive ? 'bg-amber-500' : 'bg-emerald-500',
      icon: isActive ? <FiUserX className="text-4xl text-amber-500" /> : <FiUserCheck className="text-4xl text-emerald-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setActionLoading(`active_${id}`);
          setTimeout(() => {
            setCompanies(prev => prev.map(c =>
              c.id === id ? { ...c, status: isActive ? 'inactive' : 'active' } : c
            ));
            setActionLoading(null);
            showToast(`Company ${isActive ? 'deactivated' : 'activated'} successfully!`, isActive ? 'warning' : 'success');
            resolve();
          }, 400);
        });
      },
      companyId,
      action: 'active',
    });
  }, [companies, showConfirmation, showToast]);

  // ============ VIEW STAFF ============
  const handleViewStaff = useCallback((company) => {
    setStaffCompany(company);
    setShowStaffModal(true);
  }, []);

  // ============ VIEW OWNERS ============
  const handleViewOwners = useCallback((company) => {
    setOwnerCompany(company);
    setShowOwnerModal(true);
  }, []);

  // ============ VIEW TENANTS ============
  const handleViewTenants = useCallback((company) => {
    setTenantCompany(company);
    setShowTenantModal(true);
  }, []);

  // ============ VIEW ASSIGNMENTS ============
  const handleViewAssignments = useCallback((company) => {
    setAssignmentCompany(company);
    setShowAssignmentModal(true);
  }, []);

  // ============ QUICK ACTIONS ============
  // Opens the right entry point for each of the 5 core features.
  // Company Registration needs no company context; the other four
  // (Staff / Owner / Tenant / Assignment Management) need one, so we
  // show a company picker first when there's more than one candidate.
  const handleQuickAction = useCallback((action) => {
    if (action === 'register') {
      setShowRegisterModal(true);
      return;
    }
    if (companies.length === 0) {
      showToast('Register a company first to manage its staff, owners, tenants or assignments.', 'warning');
      return;
    }
    if (companies.length === 1) {
      const only = companies[0];
      if (action === 'staff') { setStaffCompany(only); setShowStaffModal(true); }
      if (action === 'owner') { setOwnerCompany(only); setShowOwnerModal(true); }
      if (action === 'tenant') { setTenantCompany(only); setShowTenantModal(true); }
      if (action === 'assignment') { setAssignmentCompany(only); setShowAssignmentModal(true); }
      return;
    }
    setPickerAction(action);
    setShowCompanyPicker(true);
  }, [companies, showToast]);

  const handlePickCompany = useCallback((company) => {
    setShowCompanyPicker(false);
    if (pickerAction === 'staff') { setStaffCompany(company); setShowStaffModal(true); }
    if (pickerAction === 'owner') { setOwnerCompany(company); setShowOwnerModal(true); }
    if (pickerAction === 'tenant') { setTenantCompany(company); setShowTenantModal(true); }
    if (pickerAction === 'assignment') { setAssignmentCompany(company); setShowAssignmentModal(true); }
    setPickerAction(null);
  }, [pickerAction]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockCompanies = generateMockCompanies();
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockCompanies, showToast]);

  // ============ EXPORT COMPANIES ============
  const handleExportCompanies = useCallback(() => {
    const data = filteredCompanies.map(c => ({
      Name: c.name,
      Type: c.type,
      Location: c.location,
      Email: c.email,
      Phone: c.phone,
      Website: c.website || 'N/A',
      Status: c.status || 'active',
      Staff: c.staffCount,
      Owners: c.ownerCount,
      Tenants: c.tenantCount,
      Properties: c.properties?.join('; ') || 'None',
      Verified: c.isVerified ? 'Yes' : 'No',
      'Registered Date': c.registeredDate,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredCompanies.length} companies exported successfully`, 'success');
  }, [filteredCompanies, showToast]);

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

      {/* View Company Modal */}
      <ViewCompanyModal
        company={viewingCompany}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingCompany(null); }}
      />

      {/* Edit Company Modal */}
      <CompanyFormModal
        company={editingCompany}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingCompany(null); }}
        onSave={handleSaveEdit}
        loading={actionLoading === 'edit'}
        mode="edit"
      />

      {/* Register Company Modal */}
      <CompanyFormModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSave={handleRegisterCompany}
        loading={actionLoading === 'register'}
        mode="register"
      />

      {/* Staff Management Modal */}
      <StaffManagementModal
        company={staffCompany}
        show={showStaffModal}
        onClose={() => { setShowStaffModal(false); setStaffCompany(null); }}
      />

      {/* Owner Management Modal */}
      <OwnerManagementModal
        company={ownerCompany}
        show={showOwnerModal}
        onClose={() => { setShowOwnerModal(false); setOwnerCompany(null); }}
      />

      {/* Tenant Management Modal */}
      <TenantManagementModal
        company={tenantCompany}
        show={showTenantModal}
        onClose={() => { setShowTenantModal(false); setTenantCompany(null); }}
      />

      {/* Property Assignment Modal */}
      <PropertyAssignmentModal
        company={assignmentCompany}
        show={showAssignmentModal}
        onClose={() => { setShowAssignmentModal(false); setAssignmentCompany(null); }}
      />

      {/* Company Picker for Quick Actions */}
      <CompanySelectModal
        show={showCompanyPicker}
        onClose={() => { setShowCompanyPicker(false); setPickerAction(null); }}
        companies={companies}
        onSelect={handlePickCompany}
        title={
          pickerAction === 'staff' ? 'Select Company · Staff Management' :
          pickerAction === 'owner' ? 'Select Company · Owner Management' :
          pickerAction === 'tenant' ? 'Select Company · Tenant Management' :
          'Select Company · Property Assignment'
        }
        icon={
          pickerAction === 'staff' ? <FiUsers className="text-sm" /> :
          pickerAction === 'owner' ? <FiUser className="text-sm" /> :
          pickerAction === 'tenant' ? <FiUsers className="text-sm" /> :
          <FiLink className="text-sm" />
        }
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Company Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredCompanies.length} Companies
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage property management companies, staff, owners, tenants & property assignments</span>
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
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiPlus className="text-sm" />
              <span className="hidden sm:inline">Register Company</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105 disabled:opacity-50"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportCompanies}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions — the 5 core features, always available */}
      <div className="relative bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm animate-fade-in">
        <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={() => handleQuickAction('register')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8F0EE] hover:border-[#00695C]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <FiPlus className="text-sm" />
            </div>
            <span className="text-[11px] font-semibold text-[#1A2E2A] text-center">Company Registration</span>
          </button>
          <button
            onClick={() => handleQuickAction('staff')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8F0EE] hover:border-blue-400/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <FiUsers className="text-sm" />
            </div>
            <span className="text-[11px] font-semibold text-[#1A2E2A] text-center">Staff Management</span>
          </button>
          <button
            onClick={() => handleQuickAction('owner')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8F0EE] hover:border-indigo-400/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <FiUser className="text-sm" />
            </div>
            <span className="text-[11px] font-semibold text-[#1A2E2A] text-center">Owner Management</span>
          </button>
          <button
            onClick={() => handleQuickAction('tenant')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8F0EE] hover:border-purple-400/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <FiUsers className="text-sm" />
            </div>
            <span className="text-[11px] font-semibold text-[#1A2E2A] text-center">Tenant Management</span>
          </button>
          <button
            onClick={() => handleQuickAction('assignment')}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8F0EE] hover:border-amber-400/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <FiLink className="text-sm" />
            </div>
            <span className="text-[11px] font-semibold text-[#1A2E2A] text-center">Property Assignment</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<MdOutlineBusiness className="text-white text-sm" />}
                title="Total Companies"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiShield className="text-white text-sm" />}
                title="Verified"
                value={stats.verified}
                color="bg-gradient-to-br from-cyan-600 to-cyan-400"
                delay={50}
                isActive={activeFilter === 'verified'}
                onClick={() => handleStatClick('verified')}
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
                color="bg-gradient-to-br from-gray-500 to-gray-400"
                delay={150}
                isActive={activeFilter === 'inactive'}
                onClick={() => handleStatClick('inactive')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Rejected"
                value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={200}
                isActive={activeFilter === 'rejected'}
                onClick={() => handleStatClick('rejected')}
              />
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Staff"
                value={stats.totalStaff}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={250}
                isActive={false}
                onClick={() => {}}
              />
              <StatCard
                icon={<FiUser className="text-white text-sm" />}
                title="Total Owners"
                value={stats.totalOwners}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={300}
                isActive={false}
                onClick={() => {}}
              />
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Tenants"
                value={stats.totalTenants}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={350}
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
              placeholder="Search companies by name, location, type, or email..."
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
                <option value="property management">Property Management</option>
                <option value="real estate agency">Real Estate Agency</option>
                <option value="facility management">Facility Management</option>
                <option value="housing association">Housing Association</option>
                <option value="developer">Developer</option>
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
        {selectedCompanies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedCompanies.length}</span> company(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCompanies(prev => prev.map(c =>
                    selectedCompanies.includes(c.id) ? { ...c, isVerified: true } : c
                  ));
                  setSelectedCompanies([]);
                  showToast('Companies verified successfully', 'success');
                }}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiShield className="text-[10px]" /> Verify
              </button>
              <button
                onClick={() => {
                  setCompanies(prev => prev.map(c =>
                    selectedCompanies.includes(c.id) ? { ...c, isVerified: false } : c
                  ));
                  setSelectedCompanies([]);
                  showToast('Companies unverified successfully', 'warning');
                }}
                className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiXCircle className="text-[10px]" /> Unverify
              </button>
              <button
                onClick={() => {
                  showConfirmation({
                    title: 'Delete Companies',
                    message: `Are you sure you want to delete ${selectedCompanies.length} selected company(s)? This action cannot be undone.`,
                    confirmText: 'Yes, Delete All',
                    cancelText: 'No',
                    confirmColor: 'bg-red-500',
                    icon: <FiTrash2 className="text-4xl text-red-500" />,
                    onConfirm: () => {
                      return new Promise((resolve) => {
                        setActionLoading('bulk_delete');
                        setTimeout(() => {
                          setCompanies(prev => prev.filter(c => !selectedCompanies.includes(c.id)));
                          setSelectedCompanies([]);
                          setActionLoading(null);
                          showToast('Companies deleted successfully', 'error');
                          resolve();
                        }, 600);
                      });
                    },
                    companyId: 'bulk',
                    action: 'bulk_delete',
                  });
                }}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiTrash2 className="text-[10px]" /> Delete
              </button>
              <button
                onClick={() => setSelectedCompanies([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Companies Grid */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedCompanies.map((company, index) => {
              const isSelected = selectedCompanies.includes(company.id);
              const status = company.status || 'active';
              const statusBadge = {
                active: 'bg-emerald-100 text-emerald-700',
                inactive: 'bg-gray-100 text-gray-700',
                rejected: 'bg-red-100 text-red-700',
              }[status];

              return (
                <div
                  key={company.id}
                  className={`relative bg-white rounded-2xl border border-[#E8F0EE] border-l-4 border-l-[#00695C] p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectCompany(company.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          <MdOutlineBusiness className="text-2xl" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate max-w-[120px]">{company.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-[#E8F4F2] text-[#00695C]">
                            {company.type}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          {company.isVerified && (
                            <FiShield className="text-emerald-600 text-[10px]" />
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewCompany(company)}
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Registered: {company.registeredDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{company.staffCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Staff</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{company.ownerCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Owners</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#00695C]">{company.tenantCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Tenants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{company.properties?.length || 0}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      onClick={() => handleViewStaff(company)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiUsers className="text-[10px]" /> Staff
                    </button>
                    <button
                      onClick={() => handleViewOwners(company)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiUser className="text-[10px]" /> Owners
                    </button>
                    <button
                      onClick={() => handleViewTenants(company)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiUsers className="text-[10px]" /> Tenants
                    </button>
                    <button
                      onClick={() => handleViewAssignments(company)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiLink className="text-[10px]" /> Assignments
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <button
                      onClick={() => handleViewCompany(company)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#5A7D78] bg-[#F5F9F8] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      onClick={() => handleEditCompany(company)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(company.id)}
                      disabled={actionLoading === `active_${company.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        status === 'active'
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {actionLoading === `active_${company.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : status === 'active' ? (
                        <FiUserX className="text-[10px]" />
                      ) : (
                        <FiUserCheck className="text-[10px]" />
                      )}
                      {status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      onClick={() => handleToggleVerify(company.id)}
                      disabled={actionLoading === `verify_${company.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        company.isVerified
                          ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                          : 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100'
                      }`}
                    >
                      {actionLoading === `verify_${company.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : (
                        <FiShield className="text-[10px]" />
                      )}
                      {company.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      disabled={actionLoading === `delete_${company.id}`}
                      className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${company.id}` ? (
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
                  checked={selectedCompanies.length === paginatedCompanies.length && paginatedCompanies.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>#</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Company {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Location</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('staffCount')}>
                Staff {sortField === 'staffCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('tenantCount')}>
                Tenants {sortField === 'tenantCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center">Verified</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {paginatedCompanies.map((company, index) => {
              const isSelected = selectedCompanies.includes(company.id);
              const status = company.status || 'active';
              const statusBadge = {
                active: 'bg-emerald-100 text-emerald-700',
                inactive: 'bg-gray-100 text-gray-700',
                rejected: 'bg-red-100 text-red-700',
              }[status];

              return (
                <div
                  key={company.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] border-l-4 border-l-[#00695C] hover:bg-[#F5F9F8] transition-all duration-300 group relative ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectCompany(company.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-xs text-[#5A7D78]">{index + 1}</span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xs font-bold">
                        <MdOutlineBusiness className="text-sm" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1A2E2A] truncate">{company.name}</p>
                        <p className="text-[10px] text-[#5A7D78] truncate">{company.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E8F4F2] text-[#00695C]">
                      {company.type}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{company.location}</div>

                  <div className="col-span-1 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{company.staffCount}</div>

                  <div className="col-span-1 text-center text-sm font-medium text-[#00695C]">{company.tenantCount}</div>

                  <div className="col-span-1 text-center">
                    {company.isVerified ? (
                      <FiShield className="text-emerald-500 text-sm mx-auto" />
                    ) : (
                      <span className="text-[#B5C9C5] text-xs">-</span>
                    )}
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-1 flex-wrap">
                    <button
                      onClick={() => handleViewStaff(company)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300 text-blue-600 hover:scale-110"
                      title="Staff"
                    >
                      <FiUsers className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewOwners(company)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 text-indigo-600 hover:scale-110"
                      title="Owners"
                    >
                      <FiUser className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewTenants(company)}
                      className="p-1.5 rounded-lg hover:bg-purple-50 transition-all duration-300 text-purple-600 hover:scale-110"
                      title="Tenants"
                    >
                      <FiUsers className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewAssignments(company)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 transition-all duration-300 text-amber-600 hover:scale-110"
                      title="Assignments"
                    >
                      <FiLink className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleViewCompany(company)}
                      className="px-2 py-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-105 text-[10px] font-medium flex items-center gap-1"
                      title="View"
                    >
                      <FiEye className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleEditCompany(company)}
                      className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(company.id)}
                      disabled={actionLoading === `active_${company.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                        status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {actionLoading === `active_${company.id}` ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : status === 'active' ? (
                        <FiUserX className="text-sm" />
                      ) : (
                        <FiUserCheck className="text-sm" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleVerify(company.id)}
                      disabled={actionLoading === `verify_${company.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${
                        company.isVerified ? 'text-blue-600 hover:bg-blue-50' : 'text-cyan-600 hover:bg-cyan-50'
                      }`}
                      title={company.isVerified ? 'Unverify' : 'Verify'}
                    >
                      {actionLoading === `verify_${company.id}` ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : (
                        <FiShield className="text-sm" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      disabled={actionLoading === `delete_${company.id}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === `delete_${company.id}` ? (
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

        {paginatedCompanies.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <MdOutlineBusiness className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No companies found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No companies match your current view'}
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
              {Math.min(currentPage * pageSize, filteredCompanies.length)} of{' '}
              {filteredCompanies.length} companies
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

export default PropertyManagersCompanyManagement;