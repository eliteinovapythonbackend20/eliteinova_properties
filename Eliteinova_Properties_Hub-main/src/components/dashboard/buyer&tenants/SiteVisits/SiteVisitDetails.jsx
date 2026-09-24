// src/components/dashboard/admin/buyer&tenants/SiteVisits/SiteVisitDetails.jsx

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
  FiFileText, FiStar, FiShield, FiTool
} from 'react-icons/fi';
import {
  FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaCalendarAlt, FaClock, FaPhoneAlt, FaUserCircle,
  FaComments, FaClipboardList
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
        {/* Header */}
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

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-[#5A7D78] leading-relaxed">
            This action cannot be undone. Please confirm your decision.
          </p>
        </div>

        {/* Footer */}
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
// VIEW SITE VISIT DETAILS MODAL
// ============================================================
const ViewSiteVisitModal = ({ visit, show, onClose, onEdit, onDelete }) => {
  if (!visit || !show) return null;

  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    'in-progress': 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const visitImages = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
  ];

  const getRandomImage = () => {
    const index = Math.floor(Math.random() * visitImages.length);
    return visitImages[index];
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = visit.imageUrl || getRandomImage();

  const getStatusBadge = (status) => {
    const statusMap = {
      scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
      pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
      'in-progress': { label: 'In Progress', color: 'bg-purple-100 text-purple-700' }
    };
    return statusMap[status] || { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' };
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(visit.id);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(visit);
      onClose();
    }
  };

  const formattedDate = visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', {
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
          <h2 className="text-2xl font-bold text-white">Site Visit Details</h2>
          <p className="text-white/80 text-sm">{visit.buyerName} · {visit.propertyName}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(visit.visitStatus).color}`}>
                {getStatusBadge(visit.visitStatus).label}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F5F9F8] text-[#5A7D78]">
                {visit.visitType || 'Site Visit'}
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
                  alt={visit.propertyName || 'Property'}
                  className={`w-full h-64 object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              {imageLoaded && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-[10px] font-medium flex items-center gap-1">
                    <FaImage className="text-[10px]" /> {visit.propertyType || 'Property'}
                  </span>
                </div>
              )}
            </div>

            {/* All Details - 10 Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buyer / Tenant */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiUsers className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer / Tenant</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.buyerName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{visit.buyerEmail || ''}</p>
              </div>

              {/* Property */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.propertyName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{visit.propertyType || ''}</p>
              </div>

              {/* Owner / Agent */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaUserTie className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Owner / Agent</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.ownerName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{visit.ownerEmail || ''}</p>
              </div>

              {/* Visit Date */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Date</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{formattedDate}</p>
              </div>

              {/* Visit Time */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiClock className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Time</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.visitTime || 'N/A'}</p>
              </div>

              {/* Contact Number */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiPhone className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Contact Number</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.contactNumber || 'N/A'}</p>
              </div>

              {/* Assigned Agent */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiUserCheck className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned Agent</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.assignedAgent || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{visit.agentEmail || ''}</p>
              </div>

              {/* Visit Status */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiTag className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Status</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(visit.visitStatus).color}`}>
                  {getStatusBadge(visit.visitStatus).label}
                </span>
              </div>

              {/* Remarks */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiFileText className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Remarks</h4>
                </div>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{visit.remarks || 'No remarks available'}</p>
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
                  <span className="text-sm text-[#5A7D78]">Visit Type</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{visit.visitType || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Duration</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{visit.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Created By</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{visit.createdBy || 'Admin'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Created At</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">
                    {visit.createdAt ? new Date(visit.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
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
// EDIT SITE VISIT MODAL
// ============================================================
const EditSiteVisitModal = ({ visit, show, onClose, onSave }) => {
  if (!visit || !show) return null;

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    propertyName: '',
    propertyType: '',
    ownerName: '',
    ownerEmail: '',
    visitDate: '',
    visitTime: '',
    contactNumber: '',
    assignedAgent: '',
    agentEmail: '',
    visitStatus: '',
    visitType: '',
    duration: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);

  const statusOptions = ['scheduled', 'pending', 'in-progress', 'completed', 'cancelled'];
  const visitTypeOptions = ['Site Visit', 'Virtual Tour', 'Open House', 'Meeting'];
  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

  useEffect(() => {
    if (visit) {
      setFormData({
        buyerName: visit.buyerName || '',
        buyerEmail: visit.buyerEmail || '',
        propertyName: visit.propertyName || '',
        propertyType: visit.propertyType || '',
        ownerName: visit.ownerName || '',
        ownerEmail: visit.ownerEmail || '',
        visitDate: visit.visitDate || '',
        visitTime: visit.visitTime || '',
        contactNumber: visit.contactNumber || '',
        assignedAgent: visit.assignedAgent || '',
        agentEmail: visit.agentEmail || '',
        visitStatus: visit.visitStatus || '',
        visitType: visit.visitType || '',
        duration: visit.duration || '',
        remarks: visit.remarks || ''
      });
    }
  }, [visit]);

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
      const updatedVisit = {
        ...visit,
        ...formData
      };
      onSave(updatedVisit);
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
          <h2 className="text-2xl font-bold text-white">Edit Site Visit</h2>
          <p className="text-white/80 text-sm">Update site visit information</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Buyer / Tenant Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUsers className="text-[#00695C]" />
                Buyer / Tenant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer / Tenant Name *</label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
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
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="buyer@email.com"
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
              </div>
            </div>

            {/* Owner / Agent Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaUserTie className="text-[#00695C]" />
                Owner / Agent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Owner / Agent Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Owner Email</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="owner@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCalendar className="text-[#00695C]" />
                Visit Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Date *</label>
                  <input
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Time *</label>
                  <input
                    type="time"
                    name="visitTime"
                    value={formData.visitTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Type</label>
                  <select
                    name="visitType"
                    value={formData.visitType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Type</option>
                    {visitTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="e.g., 1 hour"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Assignment */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUserCheck className="text-[#00695C]" />
                Contact & Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Contact Number *</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
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
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Status *</label>
                  <select
                    name="visitStatus"
                    value={formData.visitStatus}
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
              </div>
            </div>

            {/* Remarks */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiFileText className="text-[#00695C]" />
                Remarks
              </h3>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                placeholder="Add remarks or notes about this site visit..."
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
const SiteVisitDetails = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVisitType, setSelectedVisitType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('visitDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVisits, setSelectedVisits] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingVisit, setViewingVisit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
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
    scheduled: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
    cancelled: 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0,
        scheduled: 0,
        pending: 0,
        'in-progress': 0,
        completed: 0,
        cancelled: 0
      });
      return;
    }

    const total = list.length;
    const scheduled = list.filter(v => v.visitStatus === 'scheduled').length;
    const pending = list.filter(v => v.visitStatus === 'pending').length;
    const inProgress = list.filter(v => v.visitStatus === 'in-progress').length;
    const completed = list.filter(v => v.visitStatus === 'completed').length;
    const cancelled = list.filter(v => v.visitStatus === 'cancelled').length;

    setStats({
      total,
      scheduled,
      pending,
      'in-progress': inProgress,
      completed,
      cancelled
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockVisits = useCallback(() => {
    const buyerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa'];
    const ownerNames = ['Mr. Sharma', 'Mrs. Patel', 'Dr. Reddy', 'Ms. Gupta', 'Mr. Singh', 'Mrs. Mehta', 'Mr. Kumar', 'Ms. Joshi', 'Mr. Nair', 'Mrs. Pillai'];
    const agentNames = ['Agent Raj', 'Agent Priya', 'Agent Amit', 'Agent Sneha', 'Agent Vikram', 'Agent Deepa'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['scheduled', 'pending', 'in-progress', 'completed', 'cancelled'];
    const visitTypes = ['Site Visit', 'Virtual Tour', 'Open House', 'Meeting'];
    const durations = ['30 mins', '45 mins', '1 hour', '1.5 hours', '2 hours'];
    const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    const contactPrefixes = ['+91 98', '+91 97', '+91 99', '+91 88'];

    const visitImages = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
    ];

    const visitsList = [];
    const usedNames = new Set();

    for (let i = 1; i <= 50; i++) {
      let propertyName, buyerName;
      let attempts = 0;
      do {
        propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
        buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
        attempts++;
      } while (usedNames.has(`${propertyName}_${buyerName}`) && attempts < 50);
      usedNames.add(`${propertyName}_${buyerName}`);

      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 30 - 15));

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomVisitType = visitTypes[Math.floor(Math.random() * visitTypes.length)];

      visitsList.push({
        id: `visit_${i}`,
        buyerName: buyerName,
        buyerEmail: `${buyerName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        propertyName: propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        ownerName: ownerNames[Math.floor(Math.random() * ownerNames.length)],
        ownerEmail: `owner${Math.floor(Math.random() * 50)}@email.com`,
        visitDate: visitDate.toISOString().split('T')[0],
        visitTime: times[Math.floor(Math.random() * times.length)],
        contactNumber: `${contactPrefixes[Math.floor(Math.random() * contactPrefixes.length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        assignedAgent: agentNames[Math.floor(Math.random() * agentNames.length)],
        agentEmail: `agent${Math.floor(Math.random() * 20)}@email.com`,
        visitStatus: randomStatus,
        visitType: randomVisitType,
        duration: durations[Math.floor(Math.random() * durations.length)],
        remarks: Math.random() > 0.6 ? 'Client requested additional information about the property' : 
                  Math.random() > 0.3 ? 'Property visit confirmed' : '',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: ['Admin', 'Manager', 'Agent'][Math.floor(Math.random() * 3)],
        imageUrl: visitImages[Math.floor(Math.random() * visitImages.length)]
      });
    }

    visitsList.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));

    computeStats(visitsList);
    return visitsList;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockVisits = generateMockVisits();
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
    } catch (error) {
      console.error('Error generating mock visits:', error);
    }
  }, [generateMockVisits]);

  // ============ FILTER VISITS ============
  const filterVisits = useCallback(() => {
    try {
      let filtered = [...visits];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(v =>
          (v.buyerName && v.buyerName.toLowerCase().includes(query)) ||
          (v.propertyName && v.propertyName.toLowerCase().includes(query)) ||
          (v.ownerName && v.ownerName.toLowerCase().includes(query)) ||
          (v.assignedAgent && v.assignedAgent.toLowerCase().includes(query)) ||
          (v.visitType && v.visitType.toLowerCase().includes(query)) ||
          (v.contactNumber && v.contactNumber.includes(query))
        );
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(v => v.visitStatus === selectedStatus);
      }

      if (selectedVisitType !== 'all') {
        filtered = filtered.filter(v => v.visitType === selectedVisitType);
      }

      let count = 0;
      if (selectedStatus !== 'all') count++;
      if (selectedVisitType !== 'all') count++;
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

      setFilteredVisits(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering visits:', error);
    }
  }, [visits, searchQuery, selectedStatus, selectedVisitType, sortField, sortDirection]);

  useEffect(() => {
    filterVisits();
  }, [filterVisits]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / pageSize));
  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredVisits.slice(start, end);
  }, [filteredVisits, currentPage, pageSize]);

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
    if (selectedVisits.length === paginatedVisits.length && paginatedVisits.length > 0) {
      setSelectedVisits([]);
    } else {
      setSelectedVisits(paginatedVisits.map(v => v.id));
    }
  }, [selectedVisits, paginatedVisits]);

  // ============ HANDLE SELECT VISIT ============
  const handleSelectVisit = useCallback((visitId) => {
    setSelectedVisits(prev =>
      prev.includes(visitId)
        ? prev.filter(id => id !== visitId)
        : [...prev, visitId]
    );
  }, []);

  // ============ VIEW VISIT ============
  const handleViewVisit = useCallback((visit) => {
    setViewingVisit(visit);
    setShowViewModal(true);
  }, []);

  // ============ EDIT VISIT ============
  const handleEditVisit = useCallback((visit) => {
    setEditingVisit(visit);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDITED VISIT ============
  const handleSaveVisit = useCallback((updatedVisit) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === updatedVisit.id ? updatedVisit : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Visit for "${updatedVisit.propertyName}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE VISIT WITH CONFIRMATION ============
  const handleDeleteVisit = useCallback((visitId) => {
    const visit = visits.find(v => v.id === visitId);
    if (!visit) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Site Visit',
      message: `Are you sure you want to delete the site visit for "${visit.propertyName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(visitId);
        setTimeout(() => {
          setVisits(prev => {
            const updated = prev.filter(v => v.id !== visitId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted visit for "${visit.propertyName}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [visits, computeStats]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedStatus('all');
    setSelectedVisitType('all');

    if (nextFilter === 'scheduled' || nextFilter === 'pending' || 
        nextFilter === 'in-progress' || nextFilter === 'completed' || 
        nextFilter === 'cancelled') {
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
    setSelectedVisitType('all');
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
        const mockVisits = generateMockVisits();
        setVisits(mockVisits);
        setFilteredVisits(mockVisits);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockVisits]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredVisits.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = filteredVisits.map(v => ({
        'Buyer Name': v.buyerName || '',
        'Buyer Email': v.buyerEmail || '',
        'Property': v.propertyName || '',
        'Property Type': v.propertyType || '',
        'Owner/Agent': v.ownerName || '',
        'Visit Date': v.visitDate || '',
        'Visit Time': v.visitTime || '',
        'Contact Number': v.contactNumber || '',
        'Assigned Agent': v.assignedAgent || '',
        'Visit Status': v.visitStatus ? v.visitStatus.charAt(0).toUpperCase() + v.visitStatus.slice(1).replace('-', ' ') : '',
        'Visit Type': v.visitType || '',
        'Duration': v.duration || '',
        'Remarks': v.remarks || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site_visits_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredVisits.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredVisits]);

  // ============ BULK ACTIONS WITH CONFIRMATION ============
  const handleBulkAction = useCallback((action) => {
    if (selectedVisits.length === 0) {
      setToast({ message: 'Please select visits first', type: 'warning' });
      return;
    }

    const actionConfig = {
      delete: {
        title: 'Delete Selected Visits',
        message: `Are you sure you want to delete ${selectedVisits.length} selected visit(s)?`,
        confirmText: 'Delete All',
        type: 'danger'
      },
      complete: {
        title: 'Complete Selected Visits',
        message: `Are you sure you want to mark ${selectedVisits.length} selected visit(s) as completed?`,
        confirmText: 'Complete All',
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
          const selectedIds = new Set(selectedVisits);
          let count = 0;

          setVisits(prev => {
            let updated;
            if (action === 'delete') {
              count = prev.filter(v => selectedIds.has(v.id)).length;
              updated = prev.filter(v => !selectedIds.has(v.id));
            } else {
              updated = prev.map(v => {
                if (!selectedIds.has(v.id)) return v;
                count++;
                if (action === 'complete') {
                  return { ...v, visitStatus: 'completed' };
                }
                return v;
              });
            }
            computeStats(updated);
            return updated;
          });

          setSelectedVisits([]);
          setActionLoading(null);

          if (action === 'delete') {
            setToast({ message: `${count} visit(s) deleted`, type: 'warning' });
          } else if (action === 'complete') {
            setToast({ message: `${count} visit(s) marked as completed`, type: 'success' });
          }
        }, 800);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [selectedVisits, computeStats]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      'in-progress': 'bg-purple-50 text-purple-700 border-purple-200',
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status] || colors.scheduled;
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: 'Scheduled',
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status] || 'Scheduled';
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
      {showViewModal && viewingVisit && (
        <ViewSiteVisitModal
          visit={viewingVisit}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingVisit(null); }}
          onEdit={handleEditVisit}
          onDelete={handleDeleteVisit}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingVisit && (
        <EditSiteVisitModal
          visit={editingVisit}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingVisit(null); }}
          onSave={handleSaveVisit}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Site Visit Details
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredVisits.length} Visits
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage Site Visits</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <StatCard
                icon={<FiCalendar className="text-white text-sm" />}
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Scheduled"
                value={stats.scheduled}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={50}
                isActive={activeFilter === 'scheduled'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('scheduled')}
              />
              <StatCard
                icon={<FiAlertTriangle className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiActivity className="text-white text-sm" />}
                title="In Progress"
                value={stats['in-progress']}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={150}
                isActive={activeFilter === 'in-progress'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('in-progress')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Completed"
                value={stats.completed}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={200}
                isActive={activeFilter === 'completed'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('completed')}
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
              placeholder="Search by buyer, property, owner, agent, or visit type..."
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
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedVisitType}
                onChange={(e) => setSelectedVisitType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Visit Types</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Virtual Tour">Virtual Tour</option>
                <option value="Open House">Open House</option>
                <option value="Meeting">Meeting</option>
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
        {selectedVisits.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedVisits.length}</span> visit(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('complete')}
                disabled={actionLoading === 'complete'}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'complete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Complete
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
                onClick={() => setSelectedVisits([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visits Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedVisits.map((visit, index) => {
              const isSelected = selectedVisits.includes(visit.id);

              return (
                <div
                  key={visit.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    visit.visitStatus === 'completed' ? 'border-l-4 border-l-emerald-500' :
                    visit.visitStatus === 'scheduled' ? 'border-l-4 border-l-blue-500' :
                    visit.visitStatus === 'pending' ? 'border-l-4 border-l-amber-500' :
                    visit.visitStatus === 'in-progress' ? 'border-l-4 border-l-purple-500' :
                    visit.visitStatus === 'cancelled' ? 'border-l-4 border-l-red-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectVisit(visit.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${visit.visitStatus === 'completed' ? 'from-emerald-600 to-emerald-400' : visit.visitStatus === 'cancelled' ? 'from-red-600 to-red-400' : 'from-[#00695C] to-[#26A69A]'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                          <FaCalendarAlt className="text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{visit.buyerName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(visit.visitStatus)}`}>
                            {getStatusLabel(visit.visitStatus)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                        onClick={() => handleEditVisit(visit)}
                        title="Edit Visit"
                      >
                        <FiEdit className="text-sm" />
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewVisit(visit)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium text-[#1A2E2A]">{visit.buyerName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{visit.propertyName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaUserTie className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{visit.ownerName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>{visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiClock className="text-[#00695C] flex-shrink-0" />
                      <span>{visit.visitTime || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{visit.assignedAgent || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(visit.visitStatus)}`}>
                        {getStatusLabel(visit.visitStatus)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewVisit(visit)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditVisit(visit)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVisit(visit.id)}
                      disabled={actionLoading === visit.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === visit.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                  checked={selectedVisits.length === paginatedVisits.length && paginatedVisits.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Buyer</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyName')}>
                Property {sortField === 'propertyName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('visitDate')}>
                Date {sortField === 'visitDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Time</div>
              <div className="col-span-1">Agent</div>
              <div className="col-span-1">Contact</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedVisits.map((visit, index) => {
              const isSelected = selectedVisits.includes(visit.id);

              return (
                <div
                  key={visit.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectVisit(visit.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {visit.buyerName ? visit.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{visit.buyerName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{visit.propertyName || 'N/A'}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(visit.visitStatus)}`}>
                      {getStatusLabel(visit.visitStatus)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {visit.visitType || 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {visit.visitTime || 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {visit.assignedAgent || 'N/A'}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">
                    {visit.contactNumber || 'N/A'}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditVisit(visit)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewVisit(visit)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVisit(visit.id)}
                      disabled={actionLoading === visit.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === visit.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedVisits.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiCalendar className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No site visits found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No site visits have been scheduled yet'}
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
              {Math.min(currentPage * pageSize, filteredVisits.length)} of{' '}
              {filteredVisits.length} visits
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

export default SiteVisitDetails;