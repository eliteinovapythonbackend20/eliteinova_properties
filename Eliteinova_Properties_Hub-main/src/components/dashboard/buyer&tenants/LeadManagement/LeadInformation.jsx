// src/components/dashboard/admin/buyer&tenants/LeadManagement/LeadInformation.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiMail, FiPhone, FiExternalLink, FiTag, FiGrid, FiSave,
  FiClock as FiClockIcon, FiUserCheck, FiBriefcase,
  FiFileText, FiStar, FiShield, FiTool, FiTrendingUp,
  FiUserPlus, FiPhoneCall, FiThumbsUp, FiThumbsDown, FiTarget,
  FiGlobe, FiSmartphone, FiRadio, FiShare2, FiHash, FiBookmark,
  FiFilter
} from 'react-icons/fi';
import {
  FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaCalendarAlt, FaClock, FaPhoneAlt, FaUserCircle,
  FaComments, FaClipboardList, FaHandshake, FaWhatsapp, FaGoogle,
  FaUser, FaEnvelope, FaPhone, FaTag as FaTagSolid, FaCity,
  FaBuilding as FaBuildingSolid, FaUserCog, FaCalendarDay,
  FaUserCheck as FaUserCheckSolid, FaMapMarkerAlt, FaUserFriends,
  FaRegUser, FaRegBuilding, FaUserGraduate
} from 'react-icons/fa';

// ============================================================
// PERSON TYPE LOGOS
// ============================================================
const PersonLogos = {
  'Buyer': {
    icon: FaUserCheckSolid,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Buyer'
  },
  'Tenant': {
    icon: FaUser,
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Tenant'
  },
  'Both': {
    icon: FaUserFriends,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Both'
  },
  'Property Owner': {
    icon: FaUserTie,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Owner'
  },
  'Agent': {
    icon: FaUserCog,
    color: 'from-rose-600 to-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    label: 'Agent'
  },
  'Builder': {
    icon: FaBuildingSolid,
    color: 'from-indigo-600 to-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    label: 'Builder'
  },
  'Customer': {
    icon: FaRegUser,
    color: 'from-cyan-600 to-cyan-400',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    label: 'Customer'
  }
};

// ============================================================
// LEAD SOURCE CONFIG
// ============================================================
const SOURCE_CONFIG = {
  'Website': { icon: FiGlobe, color: 'from-blue-600 to-blue-400', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Mobile App': { icon: FiSmartphone, color: 'from-indigo-600 to-indigo-400', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'Property Enquiry': { icon: FiHome, color: 'from-teal-600 to-teal-400', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  'Phone': { icon: FiPhoneCall, color: 'from-cyan-600 to-cyan-400', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  'WhatsApp': { icon: FaWhatsapp, color: 'from-green-600 to-green-400', badge: 'bg-green-50 text-green-700 border-green-200' },
  'Advertisement': { icon: FiRadio, color: 'from-amber-600 to-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Google': { icon: FaGoogle, color: 'from-red-600 to-red-400', badge: 'bg-red-50 text-red-700 border-red-200' },
  'Social Media': { icon: FiShare2, color: 'from-purple-600 to-purple-400', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Referral': { icon: FiUserPlus, color: 'from-pink-600 to-pink-400', badge: 'bg-pink-50 text-pink-700 border-pink-200' },
  'Direct Registration': { icon: FiUserCheck, color: 'from-emerald-600 to-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
};

const SOURCES = Object.keys(SOURCE_CONFIG);

const getSourceMeta = (source) => SOURCE_CONFIG[source] || {
  icon: FiTag, color: 'from-[#00695C] to-[#26A69A]', badge: 'bg-[#F5F9F8] text-[#5A7D78] border-[#E8F0EE]'
};

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
// CONFIRMATION MODAL
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      border: 'border-red-200'
    },
    warning: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      border: 'border-amber-200'
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      border: 'border-blue-200'
    }
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
          <p className="text-sm text-[#5A7D78] leading-relaxed">
            This action cannot be undone. Please confirm your decision.
          </p>
        </div>

        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
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
// VIEW LEAD DETAIL MODAL
// ============================================================
const ViewLeadDetailModal = ({ lead, show, onClose, onEdit, onDelete }) => {
  if (!lead || !show) return null;

  const sourceMeta = getSourceMeta(lead.leadSource);
  const SourceIcon = sourceMeta.icon;
  
  const personType = lead.buyerTenant || 'Customer';
  const personLogo = PersonLogos[personType] || PersonLogos['Customer'];
  const PersonIcon = personLogo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl ${personLogo.bg}  border-2 border-white/30 flex items-center justify-center text-2xl ${personLogo.text} shadow-lg`}>
              <PersonIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{lead.customerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${personLogo.bg} ${personLogo.text} border ${personLogo.border}`}>
                  {personLogo.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>ID: {lead.leadId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30`}>
              <SourceIcon className="text-xs" /> {lead.leadSource || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.leadId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.customerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mobile</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.mobile}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaEnvelope className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Email</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A] truncate">{lead.email}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUserCheckSolid className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer / Tenant</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.buyerTenant}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaHomeSolid className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.property}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUserTie className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Owner</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyOwner}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUserCog className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Agent</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.agent}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaBuildingSolid className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Builder</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.builder}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Requirement</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.requirement}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiDollarSign className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Budget</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.budget}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaMapMarkerAlt className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.location}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaTagSolid className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Source</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.leadSource}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCalendarDay className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Created Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.createdDate}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned To</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.assignedTo}</p>
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
              onClick={() => { if (onEdit) { onEdit(lead); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(lead.id); } }}
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
// EDIT LEAD MODAL
// ============================================================
const EditLeadModal = ({ lead, show, onClose, onSave }) => {
  if (!lead || !show) return null;

  const [formData, setFormData] = useState({
    leadId: '',
    customerName: '',
    mobile: '',
    email: '',
    buyerTenant: '',
    property: '',
    propertyOwner: '',
    agent: '',
    builder: '',
    requirement: '',
    budget: '',
    location: '',
    leadSource: '',
    createdDate: '',
    assignedTo: ''
  });

  const [loading, setLoading] = useState(false);

  const buyerTenantOptions = ['Buyer', 'Tenant', 'Both'];

  useEffect(() => {
    if (lead) {
      setFormData({
        leadId: lead.leadId || '',
        customerName: lead.customerName || '',
        mobile: lead.mobile || '',
        email: lead.email || '',
        buyerTenant: lead.buyerTenant || '',
        property: lead.property || '',
        propertyOwner: lead.propertyOwner || '',
        agent: lead.agent || '',
        builder: lead.builder || '',
        requirement: lead.requirement || '',
        budget: lead.budget || '',
        location: lead.location || '',
        leadSource: lead.leadSource || '',
        createdDate: lead.createdDate || '',
        assignedTo: lead.assignedTo || ''
      });
    }
  }, [lead]);

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

    setTimeout(() => {
      const updatedLead = {
        ...lead,
        ...formData
      };
      onSave(updatedLead);
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
          <h2 className="text-2xl font-bold text-white">Edit Lead Information</h2>
          <p className="text-white/80 text-sm">Update lead details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaUser className="text-[#00695C]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead ID</label>
                  <input
                    type="text"
                    name="leadId"
                    value={formData.leadId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="LEAD-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Mobile *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="customer@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer / Tenant</label>
                  <select
                    name="buyerTenant"
                    value={formData.buyerTenant}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Type</option>
                    {buyerTenantOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaHomeSolid className="text-[#00695C]" />
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property *</label>
                  <input
                    type="text"
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Owner</label>
                  <input
                    type="text"
                    name="propertyOwner"
                    value={formData.propertyOwner}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property owner name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Agent</label>
                  <input
                    type="text"
                    name="agent"
                    value={formData.agent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Builder</label>
                  <input
                    type="text"
                    name="builder"
                    value={formData.builder}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter builder name"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiFileText className="text-[#00695C]" />
                Requirements & Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Requirement</label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Describe the customer's requirement..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="₹50L - ₹75L"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="City, Area"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiBookmark className="text-[#00695C]" />
                Lead Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Source</label>
                  <select
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Source</option>
                    {SOURCES.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Created Date</label>
                  <input
                    type="date"
                    name="createdDate"
                    value={formData.createdDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter assignee name"
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
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 animate-slide-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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
};

// ============================================================
// FILTER DROPDOWN COMPONENT
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
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
          value !== 'all' 
            ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' 
            : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-64 overflow-y-auto animate-slide-down">
          <button
            onClick={() => {
              onChange('all');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>All {label}s</span>
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
                value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
              }`}
            >
              <span className="w-4">{value === option.value && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
              {option.icon && <span className="text-sm">{option.icon}</span>}
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
const LeadInformation = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [viewingLead, setViewingLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeSource, setActiveSource] = useState('all');
  const [activeType, setActiveType] = useState('all');

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: null,
    onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    buyers: 0,
    tenants: 0,
    both: 0,
    sources: {}
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, buyers: 0, tenants: 0, both: 0, sources: {} });
      return;
    }

    const total = list.length;
    const buyers = list.filter(l => l.buyerTenant === 'Buyer').length;
    const tenants = list.filter(l => l.buyerTenant === 'Tenant').length;
    const both = list.filter(l => l.buyerTenant === 'Both').length;

    const sources = {};
    list.forEach(l => {
      if (l.leadSource) {
        sources[l.leadSource] = (sources[l.leadSource] || 0) + 1;
      }
    });

    setStats({ total, buyers, tenants, both, sources });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockLeads = useCallback(() => {
    const customerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai', 'Arjun Rao', 'Meera Iyer'];
    const properties = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa'];
    const propertyOwners = ['Mr. Sharma', 'Mrs. Patel', 'Mr. Reddy', 'Ms. Joshi', 'Mr. Singh', 'Mrs. Gupta'];
    const agentOptions = ['Agent Raj', 'Agent Priya', 'Agent Amit', 'Agent Sneha', 'Agent Vikram', 'Agent Deepa'];
    const builderOptions = ['BuildWell Constructions', 'GreenHome Developers', 'UrbanSpace Builders', 'EcoLiving Projects', 'SkyHigh Infrastructure', 'PrimeLand Developers'];
    const buyerTenantOptions = ['Buyer', 'Tenant', 'Both'];
    const budgets = ['₹20L - ₹35L', '₹35L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1Cr', '₹1Cr - ₹1.5Cr', '₹1.5Cr+'];
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];
    const requirements = ['3BHK apartment with garden', 'Independent villa with pool', 'Commercial space for office', '2BHK near school', 'Luxury penthouse', 'Budget-friendly 1BHK', 'Plots for investment'];

    const leadsList = [];

    for (let i = 1; i <= 50; i++) {
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const randomSource = SOURCES[Math.floor(Math.random() * SOURCES.length)];

      const daysAgo = Math.floor(Math.random() * 30);
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - daysAgo);

      leadsList.push({
        id: `lead_${i}`,
        leadId: `LEAD-${String(i).padStart(4, '0')}`,
        customerName,
        mobile: `+91 98${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        email: `${customerName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        buyerTenant: buyerTenantOptions[Math.floor(Math.random() * buyerTenantOptions.length)],
        property: properties[Math.floor(Math.random() * properties.length)],
        propertyOwner: propertyOwners[Math.floor(Math.random() * propertyOwners.length)],
        agent: agentOptions[Math.floor(Math.random() * agentOptions.length)],
        builder: builderOptions[Math.floor(Math.random() * builderOptions.length)],
        requirement: requirements[Math.floor(Math.random() * requirements.length)],
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        leadSource: randomSource,
        createdDate: createdDate.toISOString().split('T')[0],
        assignedTo: agentOptions[Math.floor(Math.random() * agentOptions.length)]
      });
    }

    leadsList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    computeStats(leadsList);
    return leadsList;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockLeads = generateMockLeads();
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
    } catch (error) {
      console.error('Error generating mock leads:', error);
    }
  }, [generateMockLeads]);

  // ============ FILTER LEADS ============
  const filterLeads = useCallback(() => {
    try {
      let filtered = [...leads];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(l =>
          (l.customerName && l.customerName.toLowerCase().includes(query)) ||
          (l.leadId && l.leadId.toLowerCase().includes(query)) ||
          (l.property && l.property.toLowerCase().includes(query)) ||
          (l.leadSource && l.leadSource.toLowerCase().includes(query)) ||
          (l.email && l.email.toLowerCase().includes(query)) ||
          (l.mobile && l.mobile.includes(query)) ||
          (l.location && l.location.toLowerCase().includes(query)) ||
          (l.assignedTo && l.assignedTo.toLowerCase().includes(query)) ||
          (l.agent && l.agent.toLowerCase().includes(query)) ||
          (l.builder && l.builder.toLowerCase().includes(query)) ||
          (l.propertyOwner && l.propertyOwner.toLowerCase().includes(query))
        );
      }

      if (activeSource !== 'all') {
        filtered = filtered.filter(l => l.leadSource === activeSource);
      }

      if (activeType !== 'all') {
        filtered = filtered.filter(l => l.buyerTenant === activeType);
      }

      let count = 0;
      if (activeSource !== 'all') count++;
      if (activeType !== 'all') count++;
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

      setFilteredLeads(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering leads:', error);
    }
  }, [leads, searchQuery, activeSource, activeType, sortField, sortDirection]);

  useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredLeads.slice(start, end);
  }, [filteredLeads, currentPage, pageSize]);

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
    if (selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(l => l.id));
    }
  }, [selectedLeads, paginatedLeads]);

  // ============ HANDLE SELECT LEAD ============
  const handleSelectLead = useCallback((leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  }, []);

  // ============ VIEW LEAD ============
  const handleViewLead = useCallback((lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  }, []);

  // ============ EDIT LEAD ============
  const handleEditLead = useCallback((lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDITED LEAD ============
  const handleSaveLead = useCallback((updatedLead) => {
    setLeads(prev => {
      const updated = prev.map(l =>
        l.id === updatedLead.id ? updatedLead : l
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Lead "${updatedLead.customerName}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE LEAD WITH CONFIRMATION ============
  const handleDeleteLead = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Lead',
      message: `Are you sure you want to delete lead "${lead.customerName}" (${lead.leadId})?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(leadId);
        setTimeout(() => {
          setLeads(prev => {
            const updated = prev.filter(l => l.id !== leadId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted lead "${lead.customerName}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [leads, computeStats]);

  // ============ STAT CLICK HANDLERS ============
  const handleSourceClick = useCallback((source) => {
    setActiveSource(prev => (prev === source ? 'all' : source));
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleTypeClick = useCallback((type) => {
    setActiveType(prev => (prev === type ? 'all' : type));
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveSource('all');
    setActiveType('all');
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveSource('all');
    setActiveType('all');
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
        const mockLeads = generateMockLeads();
        setLeads(mockLeads);
        setFilteredLeads(mockLeads);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockLeads]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredLeads.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = filteredLeads.map(l => ({
        'Lead ID': l.leadId || '',
        'Customer Name': l.customerName || '',
        'Mobile': l.mobile || '',
        'Email': l.email || '',
        'Buyer/Tenant': l.buyerTenant || '',
        'Property': l.property || '',
        'Property Owner': l.propertyOwner || '',
        'Agent': l.agent || '',
        'Builder': l.builder || '',
        'Requirement': l.requirement || '',
        'Budget': l.budget || '',
        'Location': l.location || '',
        'Lead Source': l.leadSource || '',
        'Created Date': l.createdDate || '',
        'Assigned To': l.assignedTo || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lead_information_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredLeads.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredLeads]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedLeads.length === 0) {
      setToast({ message: 'Please select leads first', type: 'warning' });
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Leads',
      message: `Are you sure you want to delete ${selectedLeads.length} selected lead(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');

        setTimeout(() => {
          const selectedIds = new Set(selectedLeads);
          const count = leads.filter(l => selectedIds.has(l.id)).length;

          const updated = leads.filter(l => !selectedIds.has(l.id));
          setLeads(updated);
          computeStats(updated);
          setSelectedLeads([]);
          setActionLoading(null);
          setToast({ message: `${count} lead(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [selectedLeads, leads, computeStats]);

  // ============ FILTER OPTIONS ============
  const sourceOptions = SOURCES.map(src => ({
    value: src,
    label: src,
    icon: getSourceMeta(src).icon
  }));

  const typeOptions = [
    { value: 'Buyer', label: 'Buyers', icon: <FaUserCheckSolid className="text-blue-600" /> },
    { value: 'Tenant', label: 'Tenants', icon: <FaUser className="text-purple-600" /> },
    { value: 'Both', label: 'Both', icon: <FaUserFriends className="text-emerald-600" /> }
  ];

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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => {
          if (confirmationModal.onCancel) {
            confirmationModal.onCancel();
          }
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }}
        onConfirm={() => {
          if (confirmationModal.onConfirm) {
            confirmationModal.onConfirm();
          }
        }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {/* View Modal */}
      {showViewModal && viewingLead && (
        <ViewLeadDetailModal
          lead={viewingLead}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingLead(null); }}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingLead && (
        <EditLeadModal
          lead={editingLead}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingLead(null); }}
          onSave={handleSaveLead}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Lead Information
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredLeads.length} Leads
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Complete lead details and management</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
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

      {/* Stats Section with Filter Clicks */}
      <div className="relative animate-slide-in">
        <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<FiUsers className="text-white text-sm" />}
              title="Total Leads"
              value={stats.total}
              color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
              delay={0}
              isActive={activeSource === 'all' && activeType === 'all' && !searchQuery}
              onClick={handleTotalClick}
            />
            <StatCard
              icon={<FaUserCheckSolid className="text-white text-sm" />}
              title="Buyers"
              value={stats.buyers}
              color="bg-gradient-to-br from-blue-600 to-blue-400"
              delay={100}
              isActive={activeType === 'Buyer'}
              onClick={() => handleTypeClick('Buyer')}
            />
            <StatCard
              icon={<FaUser className="text-white text-sm" />}
              title="Tenants"
              value={stats.tenants}
              color="bg-gradient-to-br from-purple-600 to-purple-400"
              delay={200}
              isActive={activeType === 'Tenant'}
              onClick={() => handleTypeClick('Tenant')}
            />
            <StatCard
              icon={<FaUserFriends className="text-white text-sm" />}
              title="Both"
              value={stats.both}
              color="bg-gradient-to-br from-emerald-600 to-emerald-400"
              delay={300}
              isActive={activeType === 'Both'}
              onClick={() => handleTypeClick('Both')}
            />
          </div>
        </div>
      </div>

      {/* Search and Filter Dropdowns */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, ID, property, location, agent..."
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

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <FilterDropdown
              label="Source"
              options={sourceOptions}
              value={activeSource}
              onChange={setActiveSource}
              icon={FiFilter}
              allLabel="All Sources"
            />

            <FilterDropdown
              label="Type"
              options={typeOptions}
              value={activeType}
              onChange={setActiveType}
              icon={FaUser}
              allLabel="All Types"
            />

            {(activeSource !== 'all' || activeType !== 'all' || searchQuery) && (
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

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedLeads.length}</span> lead(s) selected
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
                onClick={() => setSelectedLeads([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leads Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedLeads.includes(lead.id);
              const sourceMeta = getSourceMeta(lead.leadSource);
              const SourceIcon = sourceMeta.icon;
              const personType = lead.buyerTenant || 'Customer';
              const personLogo = PersonLogos[personType] || PersonLogos['Customer'];
              const PersonIcon = personLogo.icon;

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${personLogo.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <PersonIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{lead.customerName}</h3>
                        <p className="text-[10px] font-medium text-[#5A7D78]">{lead.leadId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                        onClick={() => handleEditLead(lead)}
                        title="Edit Lead"
                      >
                        <FiEdit className="text-sm" />
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewLead(lead)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-semibold text-[#1A2E2A]">{lead.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaHomeSolid className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{lead.property}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${personLogo.bg} ${personLogo.text} border ${personLogo.border}`}>
                        {personLogo.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${sourceMeta.badge}`}>
                        {lead.leadSource}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{lead.assignedTo}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewLead(lead)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditLead(lead)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === lead.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                />
                <span className="truncate">ID</span>
              </div>
              <div className="col-span-2 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('customerName')}>
                Customer {sortField === 'customerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate">Mobile</div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('buyerTenant')}>
                Type {sortField === 'buyerTenant' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('property')}>
                Property {sortField === 'property' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('leadSource')}>
                Source {sortField === 'leadSource' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('createdDate')}>
                Created {sortField === 'createdDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate">Assigned To</div>
              <div className="col-span-2 min-w-0 text-right">Actions</div>
            </div>

            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedLeads.includes(lead.id);
              const sourceMeta = getSourceMeta(lead.leadSource);
              const SourceIcon = sourceMeta.icon;
              const personType = lead.buyerTenant || 'Customer';
              const personLogo = PersonLogos[personType] || PersonLogos['Customer'];
              const PersonIcon = personLogo.icon;

              return (
                <div
                  key={lead.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectLead(lead.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                    />
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${personLogo.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <PersonIcon className="text-[10px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{lead.leadId}</span>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{lead.customerName}</p>
                    <p className="text-[10px] font-medium text-[#5A7D78] truncate">{lead.email}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {lead.mobile}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${personLogo.bg} ${personLogo.text} border ${personLogo.border} truncate inline-block max-w-full`}>
                      {personLogo.label}
                    </span>
                  </div>

                  <div className="col-span-2 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {lead.property}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${sourceMeta.badge} truncate inline-block max-w-full`}>
                      {lead.leadSource}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {lead.createdDate}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {lead.assignedTo}
                  </div>

                  <div className="col-span-2 min-w-0 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditLead(lead)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110 flex-shrink-0"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewLead(lead)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                      title="Delete"
                    >
                      {actionLoading === lead.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedLeads.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUsers className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No leads found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No leads have been added yet'}
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
              {Math.min(currentPage * pageSize, filteredLeads.length)} of{' '}
              {filteredLeads.length} leads
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
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

export default LeadInformation;
