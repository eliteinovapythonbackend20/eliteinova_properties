// src/components/dashboard/admin/buyer&tenants/LeadManagement/LeadDashboard.jsx

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
  FiUserPlus, FiPhoneCall, FiThumbsUp, FiThumbsDown, FiTarget
} from 'react-icons/fi';
import {
  FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaCalendarAlt, FaClock, FaPhoneAlt, FaUserCircle,
  FaComments, FaClipboardList, FaHandshake
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
// VIEW LEAD DETAILS MODAL
// ============================================================
const ViewLeadModal = ({ lead, show, onClose, onEdit, onDelete }) => {
  if (!lead || !show) return null;

  const getStatusBadge = (status) => {
    const statusMap = {
      new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
      'follow-up': { label: 'Follow-up', color: 'bg-amber-100 text-amber-700' },
      'site-visit': { label: 'Site Visit', color: 'bg-purple-100 text-purple-700' },
      negotiation: { label: 'Negotiation', color: 'bg-orange-100 text-orange-700' },
      won: { label: 'Won', color: 'bg-emerald-100 text-emerald-700' },
      lost: { label: 'Lost', color: 'bg-red-100 text-red-700' }
    };
    return statusMap[status] || { label: 'New', color: 'bg-blue-100 text-blue-700' };
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(lead.id);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(lead);
      onClose();
    }
  };

  const formattedDate = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'N/A';

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
          <h2 className="text-2xl font-bold text-white">Lead Details</h2>
          <p className="text-white/80 text-sm">{lead.leadName} · {lead.propertyInterest}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Status Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(lead.leadStatus).color}`}>
                {getStatusBadge(lead.leadStatus).label}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F5F9F8] text-[#5A7D78]">
                {lead.leadSource || 'Direct'}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FEF3E2] text-amber-700">
                {lead.priority || 'Medium'} Priority
              </span>
            </div>

            {/* Avatar Banner */}
            <div className="bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#1A2E2A] truncate">{lead.leadName}</h3>
                <p className="text-sm text-[#5A7D78] truncate">{lead.email}</p>
              </div>
            </div>

            {/* All Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiPhone className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Contact Number</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.phone || 'N/A'}</p>
              </div>

              {/* Email */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiMail className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Email</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A] truncate">{lead.email || 'N/A'}</p>
              </div>

              {/* Property Interest */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Interest</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.propertyInterest || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{lead.propertyType || ''}</p>
              </div>

              {/* Budget */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiDollarSign className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Budget</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.budget || 'N/A'}</p>
              </div>

              {/* Lead Source */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiTarget className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Source</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.leadSource || 'N/A'}</p>
              </div>

              {/* Assigned Agent */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiUserCheck className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned Agent</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.assignedAgent || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{lead.agentEmail || ''}</p>
              </div>

              {/* Lead Status */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiTag className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Status</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.leadStatus).color}`}>
                  {getStatusBadge(lead.leadStatus).label}
                </span>
              </div>

              {/* Next Follow-up */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Next Follow-up</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">
                  {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Notes */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiFileText className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Notes</h4>
                </div>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{lead.notes || 'No notes available'}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiInfo className="text-[#00695C]" />
                Additional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Priority</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{lead.priority || 'Medium'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Last Contacted</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">
                    {lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Created By</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{lead.createdBy || 'Admin'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Created At</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{formattedDate}</span>
                </div>
              </div>
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
              onClick={handleEditClick}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={handleDeleteClick}
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
    leadName: '',
    email: '',
    phone: '',
    propertyInterest: '',
    propertyType: '',
    budget: '',
    leadSource: '',
    assignedAgent: '',
    agentEmail: '',
    leadStatus: '',
    priority: '',
    nextFollowUp: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const statusOptions = ['new', 'follow-up', 'site-visit', 'negotiation', 'won', 'lost'];
  const sourceOptions = ['Website', 'Referral', 'Walk-in', 'Social Media', 'Advertisement', 'Cold Call'];
  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const priorityOptions = ['Low', 'Medium', 'High'];

  useEffect(() => {
    if (lead) {
      setFormData({
        leadName: lead.leadName || '',
        email: lead.email || '',
        phone: lead.phone || '',
        propertyInterest: lead.propertyInterest || '',
        propertyType: lead.propertyType || '',
        budget: lead.budget || '',
        leadSource: lead.leadSource || '',
        assignedAgent: lead.assignedAgent || '',
        agentEmail: lead.agentEmail || '',
        leadStatus: lead.leadStatus || '',
        priority: lead.priority || '',
        nextFollowUp: lead.nextFollowUp || '',
        notes: lead.notes || ''
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
          <h2 className="text-2xl font-bold text-white">Edit Lead</h2>
          <p className="text-white/80 text-sm">Update lead information</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Lead Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Lead Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Name *</label>
                  <input
                    type="text"
                    name="leadName"
                    value={formData.leadName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter name"
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
                    placeholder="lead@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Contact Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Source</label>
                  <select
                    name="leadSource"
                    value={formData.leadSource}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Source</option>
                    {sourceOptions.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Property Interest */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHome className="text-[#00695C]" />
                Property Interest
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Interest *</label>
                  <input
                    type="text"
                    name="propertyInterest"
                    value={formData.propertyInterest}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="e.g., ₹50L - ₹75L"
                  />
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUserCheck className="text-[#00695C]" />
                Assignment & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Assigned Agent</label>
                  <input
                    type="text"
                    name="assignedAgent"
                    value={formData.assignedAgent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter agent name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Agent Email</label>
                  <input
                    type="email"
                    name="agentEmail"
                    value={formData.agentEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="agent@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Status *</label>
                  <select
                    name="leadStatus"
                    value={formData.leadStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Priority</option>
                    {priorityOptions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Next Follow-up</label>
                  <input
                    type="date"
                    name="nextFollowUp"
                    value={formData.nextFollowUp}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiFileText className="text-[#00695C]" />
                Notes
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                placeholder="Add notes about this lead..."
              />
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
const LeadDashboard = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingLead, setViewingLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

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
    new: 0,
    today: 0,
    'follow-up': 0,
    'site-visit': 0,
    negotiation: 0,
    won: 0,
    lost: 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0, new: 0, today: 0, 'follow-up': 0,
        'site-visit': 0, negotiation: 0, won: 0, lost: 0
      });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const total = list.length;
    const newLeads = list.filter(l => l.leadStatus === 'new').length;
    const todayLeads = list.filter(l => (l.createdAt || '').split('T')[0] === todayStr).length;
    const followUp = list.filter(l => l.leadStatus === 'follow-up').length;
    const siteVisit = list.filter(l => l.leadStatus === 'site-visit').length;
    const negotiation = list.filter(l => l.leadStatus === 'negotiation').length;
    const won = list.filter(l => l.leadStatus === 'won').length;
    const lost = list.filter(l => l.leadStatus === 'lost').length;

    setStats({
      total,
      new: newLeads,
      today: todayLeads,
      'follow-up': followUp,
      'site-visit': siteVisit,
      negotiation,
      won,
      lost
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockLeads = useCallback(() => {
    const leadNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai', 'Arjun Rao', 'Meera Iyer'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa'];
    const agentNames = ['Agent Raj', 'Agent Priya', 'Agent Amit', 'Agent Sneha', 'Agent Vikram', 'Agent Deepa'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['new', 'follow-up', 'site-visit', 'negotiation', 'won', 'lost'];
    const sources = ['Website', 'Referral', 'Walk-in', 'Social Media', 'Advertisement', 'Cold Call'];
    const priorities = ['Low', 'Medium', 'High'];
    const budgets = ['₹20L - ₹35L', '₹35L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1Cr', '₹1Cr - ₹1.5Cr', '₹1.5Cr+'];
    const contactPrefixes = ['+91 98', '+91 97', '+91 99', '+91 88'];

    const leadsList = [];

    for (let i = 1; i <= 60; i++) {
      const leadName = leadNames[Math.floor(Math.random() * leadNames.length)];
      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const daysAgo = Math.floor(Math.random() * 20);
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - daysAgo);
      if (i <= 4) {
        createdDate.setTime(Date.now() - Math.floor(Math.random() * 6) * 60 * 60 * 1000);
      }

      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + Math.floor(Math.random() * 10 - 2));

      leadsList.push({
        id: `lead_${i}`,
        leadName,
        email: `${leadName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `${contactPrefixes[Math.floor(Math.random() * contactPrefixes.length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        propertyInterest: propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        leadSource: sources[Math.floor(Math.random() * sources.length)],
        assignedAgent: agentNames[Math.floor(Math.random() * agentNames.length)],
        agentEmail: `agent${Math.floor(Math.random() * 20)}@email.com`,
        leadStatus: randomStatus,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        nextFollowUp: followUpDate.toISOString().split('T')[0],
        lastContacted: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        notes: Math.random() > 0.6 ? 'Client is actively comparing multiple properties' :
                Math.random() > 0.3 ? 'Interested, awaiting budget confirmation' : '',
        createdAt: createdDate.toISOString(),
        createdBy: ['Admin', 'Manager', 'Agent'][Math.floor(Math.random() * 3)]
      });
    }

    leadsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    computeStats(leadsList);
    return leadsList;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockLeads = generateMockLeads();
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
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
          (l.leadName && l.leadName.toLowerCase().includes(query)) ||
          (l.propertyInterest && l.propertyInterest.toLowerCase().includes(query)) ||
          (l.assignedAgent && l.assignedAgent.toLowerCase().includes(query)) ||
          (l.leadSource && l.leadSource.toLowerCase().includes(query)) ||
          (l.email && l.email.toLowerCase().includes(query)) ||
          (l.phone && l.phone.includes(query))
        );
      }

      if (selectedStatus !== 'all') {
        if (selectedStatus === 'today') {
          const todayStr = new Date().toISOString().split('T')[0];
          filtered = filtered.filter(l => (l.createdAt || '').split('T')[0] === todayStr);
        } else {
          filtered = filtered.filter(l => l.leadStatus === selectedStatus);
        }
      }

      if (selectedSource !== 'all') {
        filtered = filtered.filter(l => l.leadSource === selectedSource);
      }

      let count = 0;
      if (selectedStatus !== 'all') count++;
      if (selectedSource !== 'all') count++;
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
  }, [leads, searchQuery, selectedStatus, selectedSource, sortField, sortDirection]);

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
    setToast({ message: `Lead "${updatedLead.leadName}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE LEAD WITH CONFIRMATION ============
  const handleDeleteLead = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Lead',
      message: `Are you sure you want to delete the lead "${lead.leadName}"?`,
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
          setToast({ message: `Deleted lead "${lead.leadName}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [leads, computeStats]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedStatus('all');
    setSelectedSource('all');

    if (nextFilter !== 'all') {
      setSelectedStatus(nextFilter);
    }

    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedSource('all');
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
        const mockLeads = generateMockLeads();
        setLeads(mockLeads);
        setFilteredLeads(mockLeads);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
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
        'Lead Name': l.leadName || '',
        'Email': l.email || '',
        'Phone': l.phone || '',
        'Property Interest': l.propertyInterest || '',
        'Property Type': l.propertyType || '',
        'Budget': l.budget || '',
        'Lead Source': l.leadSource || '',
        'Assigned Agent': l.assignedAgent || '',
        'Lead Status': l.leadStatus ? l.leadStatus.charAt(0).toUpperCase() + l.leadStatus.slice(1).replace('-', ' ') : '',
        'Priority': l.priority || '',
        'Next Follow-up': l.nextFollowUp || '',
        'Notes': l.notes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredLeads.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredLeads]);

  // ============ BULK ACTIONS WITH CONFIRMATION ============
  const handleBulkAction = useCallback((action) => {
    if (selectedLeads.length === 0) {
      setToast({ message: 'Please select leads first', type: 'warning' });
      return;
    }

    const actionConfig = {
      delete: {
        title: 'Delete Selected Leads',
        message: `Are you sure you want to delete ${selectedLeads.length} selected lead(s)?`,
        confirmText: 'Delete All',
        type: 'danger'
      },
      won: {
        title: 'Mark Selected as Won',
        message: `Are you sure you want to mark ${selectedLeads.length} selected lead(s) as won?`,
        confirmText: 'Mark Won',
        type: 'info'
      }
    };

    const config = actionConfig[action];
    if (!config) return;

    setConfirmationModal({
      isOpen: true,
      ...config,
      onConfirm: () => {
        setActionLoading(action);

        setTimeout(() => {
          // Compute the affected leads and the count synchronously from the
          // current `leads` state BEFORE calling setLeads. React 18 batches
          // state updates (even inside setTimeout), so a functional updater
          // passed to setLeads is not guaranteed to run before the next line
          // of this callback executes. Mutating a local `count` variable
          // inside that updater and then reading it immediately after was
          // the source of the wrong/stale count in the toast.
          const selectedIds = new Set(selectedLeads);
          const affectedLeads = leads.filter(l => selectedIds.has(l.id));
          const count = affectedLeads.length;

          let updated;
          if (action === 'delete') {
            updated = leads.filter(l => !selectedIds.has(l.id));
          } else {
            updated = leads.map(l => {
              if (!selectedIds.has(l.id)) return l;
              if (action === 'won') {
                return { ...l, leadStatus: 'won' };
              }
              return l;
            });
          }

          setLeads(updated);
          computeStats(updated);
          setSelectedLeads([]);
          setActionLoading(null);

          if (count === 0) {
            setToast({ message: 'No matching leads were found to update', type: 'warning' });
          } else if (action === 'delete') {
            setToast({ message: `${count} lead(s) deleted`, type: 'warning' });
          } else if (action === 'won') {
            setToast({ message: `${count} lead(s) marked as won`, type: 'success' });
          }
        }, 800);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [selectedLeads, leads, computeStats]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      'follow-up': 'bg-amber-50 text-amber-700 border-amber-200',
      'site-visit': 'bg-purple-50 text-purple-700 border-purple-200',
      negotiation: 'bg-orange-50 text-orange-700 border-orange-200',
      won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      lost: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status] || colors.new;
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'New',
      'follow-up': 'Follow-up',
      'site-visit': 'Site Visit',
      negotiation: 'Negotiation',
      won: 'Won',
      lost: 'Lost'
    };
    return labels[status] || 'New';
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
        <ViewLeadModal
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
                Lead Dashboard
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
              <span>Manage Leads</span>
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

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Leads"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiUserPlus className="text-white text-sm" />}
                title="New Leads"
                value={stats.new}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={50}
                isActive={activeFilter === 'new'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('new')}
              />
              <StatCard
                icon={<FiCalendar className="text-white text-sm" />}
                title="Today's Leads"
                value={stats.today}
                color="bg-gradient-to-br from-teal-600 to-teal-400"
                delay={100}
                isActive={activeFilter === 'today'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('today')}
              />
              <StatCard
                icon={<FiPhoneCall className="text-white text-sm" />}
                title="Follow-ups"
                value={stats['follow-up']}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={150}
                isActive={activeFilter === 'follow-up'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('follow-up')}
              />
              <StatCard
                icon={<FiMapPin className="text-white text-sm" />}
                title="Site Visits"
                value={stats['site-visit']}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={200}
                isActive={activeFilter === 'site-visit'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('site-visit')}
              />
              <StatCard
                icon={<FaHandshake className="text-white text-sm" />}
                title="Negotiations"
                value={stats.negotiation}
                color="bg-gradient-to-br from-orange-600 to-orange-400"
                delay={250}
                isActive={activeFilter === 'negotiation'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('negotiation')}
              />
              <StatCard
                icon={<FiThumbsUp className="text-white text-sm" />}
                title="Won"
                value={stats.won}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={300}
                isActive={activeFilter === 'won'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('won')}
              />
              <StatCard
                icon={<FiThumbsDown className="text-white text-sm" />}
                title="Lost"
                value={stats.lost}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={350}
                isActive={activeFilter === 'lost'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('lost')}
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
              placeholder="Search by name, property, agent, source, email or phone..."
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
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="follow-up">Follow-up</option>
                <option value="site-visit">Site Visit</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Sources</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Social Media">Social Media</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Cold Call">Cold Call</option>
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
        {selectedLeads.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedLeads.length}</span> lead(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('won')}
                disabled={actionLoading === 'won'}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'won' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiThumbsUp className="text-[10px]" />}
                Mark Won
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    lead.leadStatus === 'won' ? 'border-l-4 border-l-emerald-500' :
                    lead.leadStatus === 'new' ? 'border-l-4 border-l-blue-500' :
                    lead.leadStatus === 'follow-up' ? 'border-l-4 border-l-amber-500' :
                    lead.leadStatus === 'site-visit' ? 'border-l-4 border-l-purple-500' :
                    lead.leadStatus === 'negotiation' ? 'border-l-4 border-l-orange-500' :
                    lead.leadStatus === 'lost' ? 'border-l-4 border-l-red-500' : ''
                  }`}
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
                      <div className="relative shrink-0">
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${lead.leadStatus === 'won' ? 'from-emerald-600 to-emerald-400' : lead.leadStatus === 'lost' ? 'from-red-600 to-red-400' : 'from-[#00695C] to-[#26A69A]'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                          {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{lead.leadName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(lead.leadStatus)}`}>
                            {getStatusLabel(lead.leadStatus)}
                          </span>
                        </div>
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
                      <span className="truncate font-medium text-[#1A2E2A]">{lead.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.propertyInterest || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.budget || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTarget className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.leadSource || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.assignedAgent || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(lead.leadStatus)}`}>
                        {getStatusLabel(lead.leadStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewLead(lead)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditLead(lead)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
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
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Lead</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyInterest')}>
                Property {sortField === 'propertyInterest' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Source</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('createdAt')}>
                Created {sortField === 'createdAt' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Budget</div>
              <div className="col-span-1">Agent</div>
              <div className="col-span-1">Contact</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedLeads.includes(lead.id);

              return (
                <div
                  key={lead.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectLead(lead.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{lead.leadName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{lead.propertyInterest || 'N/A'}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(lead.leadStatus)}`}>
                      {getStatusLabel(lead.leadStatus)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {lead.leadSource || 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {lead.budget || 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {lead.assignedAgent || 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {lead.phone || 'N/A'}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">

                     <button
                      type="button"
                      onClick={() => handleViewLead(lead)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditLead(lead)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                   
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
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
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No leads found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No leads have been added yet'}
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
              {Math.min(currentPage * pageSize, filteredLeads.length)} of{' '}
              {filteredLeads.length} leads
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

export default LeadDashboard;