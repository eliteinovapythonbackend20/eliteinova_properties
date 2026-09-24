// src/components/dashboard/admin/buyer&tenants/PurchaseRequests/PurchaseRequestManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiDollarSign, FiMapPin, FiHome, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle,
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiEye, FiEdit, FiTrash2, FiRefreshCw, FiPlus, FiDownload,
  FiAlertTriangle, FiInfo, FiX, FiList, FiGrid as FiGridIcon,
  FiActivity, FiStar, FiShield, FiBriefcase, FiMail, FiPhone,
  FiExternalLink, FiLock, FiUnlock, FiMoreVertical, FiTag, FiFileText,
  FiShoppingCart, FiTrendingUp, FiPercent
} from 'react-icons/fi';
import {
  FaHome, FaBed, FaCalendarAlt, FaUsers, FaCar, FaPaw,
  FaCheck, FaTimes, FaStar as FaStarSolid, FaUserTie,
  FaBuilding, FaUserCircle, FaFileInvoice, FaHandshake,
  FaClock, FaRegClock, FaHourglassHalf, FaMoneyBillWave,
  FaFileContract, FaHandshake as FaHandshakeSolid
} from 'react-icons/fa';
import { MdOutlineVerified, MdOutlineFamilyRestroom, MdOutlineRequestPage, MdOutlineRealEstateAgent } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi2';

/* ============================================================
   STANDALONE COMPONENTS
============================================================ */

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

const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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

/* ============================================================
   CUSTOM CONFIRM DIALOG
============================================================ */

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, loading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="text-red-500 text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1A2E2A]">{title}</h3>
            <p className="text-sm text-[#5A7D78]">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <FiRefreshCw className="text-sm animate-spin" /> : <FiTrash2 className="text-sm" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VIEW REQUEST MODAL
============================================================ */

const ViewRequestModal = ({ request, show, onClose, onEdit, onDelete, onStatusChange }) => {
  if (!request || !show) return null;

  const statusColors = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
    approved: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    negotiation: 'bg-purple-50 text-purple-700 border-purple-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const propertyTypeColors = {
    Individual: 'bg-blue-50 text-blue-700',
    Apartment: 'bg-purple-50 text-purple-700',
    Commercial: 'bg-orange-50 text-orange-700',
    'Land & Plots': 'bg-green-50 text-green-700',
    Hostel: 'bg-pink-50 text-pink-700'
  };

  const furnishingColors = {
    'Fully Furnished': 'bg-emerald-50 text-emerald-700',
    'Semi Furnished': 'bg-amber-50 text-amber-700',
    'Unfurnished': 'bg-gray-50 text-gray-700'
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <FiShoppingCart className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Purchase Request</h2>
              <p className="text-white/80 text-sm">Request #{request.id?.slice(-6) || 'N/A'} · {request.buyerName}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[request.status] || statusColors.pending}`}>
                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${propertyTypeColors[request.propertyType]}`}>
                {request.propertyType}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${furnishingColors[request.furnishing]}`}>
                {request.furnishing}
              </span>
              {request.isUrgent && (
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                  🔥 Urgent
                </span>
              )}
            </div>

            {/* Buyer Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Buyer Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#5A7D78]">Name</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{request.buyerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Email</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{request.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Phone</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{request.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Requested On</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">
                    {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaHome className="text-[#00695C]" />
                Property Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-[#5A7D78]">Property Type</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{request.propertyType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Furnishing</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{request.furnishing}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Bedrooms</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{request.bedrooms} BHK</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Budget Range</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">₹{request.minBudget?.toLocaleString()} - ₹{request.maxBudget?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A7D78]">Offer Amount</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">₹{request.offerAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiMapPin className="text-[#00695C]" />
                Location
              </h3>
              <p className="text-sm font-medium text-[#1A2E2A]">{request.location}</p>
              <p className="text-xs text-[#5A7D78]">{request.city}, {request.state}</p>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaCalendarAlt className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Purchase Timeline</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{request.purchaseTimeline}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaMoneyBillWave className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Method</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{request.paymentMethod}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiUsers className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer Type</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{request.buyerType}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiClock className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4>
                </div>
                <p className={`text-sm font-medium ${request.status === 'approved' ? 'text-[#00695C]' : request.status === 'rejected' ? 'text-red-600' : request.status === 'negotiation' ? 'text-purple-600' : request.status === 'pending' ? 'text-amber-600' : 'text-[#5A7D78]'}`}>
                  {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || 'Pending'}
                </p>
              </div>
            </div>

            {/* Notes */}
            {request.notes && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Additional Notes</h4>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{request.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
            
            {/* Status Action Buttons */}
            {request.status === 'pending' || request.status === 'new' ? (
              <>
                <button
                  onClick={() => onStatusChange(request.id, 'approved')}
                  className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FiCheckCircle className="text-sm" /> Approve
                </button>
                <button
                  onClick={() => onStatusChange(request.id, 'negotiation')}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FiPercent className="text-sm" /> Negotiate
                </button>
                <button
                  onClick={() => onStatusChange(request.id, 'rejected')}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FiXCircle className="text-sm" /> Reject
                </button>
              </>
            ) : request.status === 'negotiation' ? (
              <>
                <button
                  onClick={() => onStatusChange(request.id, 'approved')}
                  className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FiCheckCircle className="text-sm" /> Accept
                </button>
                <button
                  onClick={() => onStatusChange(request.id, 'rejected')}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FiXCircle className="text-sm" /> Reject Offer
                </button>
              </>
            ) : request.status === 'approved' ? (
              <button
                onClick={() => onStatusChange(request.id, 'closed')}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="text-sm" /> Mark as Closed
              </button>
            ) : null}

            {/* Edit button - visible for ALL statuses */}
            <button
              onClick={() => onEdit(request)}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FiEdit className="text-sm" /> Edit
            </button>
            
            <button
              onClick={() => onDelete(request.id)}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <FiTrash2 className="text-sm" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ADD / EDIT REQUEST MODAL
============================================================ */

const AddEditRequestModal = ({ request, show, mode, onClose, onSave }) => {
  const emptyForm = {
    buyerName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    location: '',
    propertyType: 'Apartment',
    furnishing: 'Semi Furnished',
    bedrooms: 1,
    minBudget: 20000,
    maxBudget: 30000,
    offerAmount: 25000,
    purchaseTimeline: 'Within 1 month',
    paymentMethod: 'Home Loan',
    buyerType: 'Family',
    status: 'pending',
    isUrgent: false,
    notes: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (mode === 'edit' && request) {
      setFormData({
        buyerName: request.buyerName || '',
        email: request.email || '',
        phone: request.phone || '',
        city: request.city || '',
        state: request.state || '',
        location: request.location || '',
        propertyType: request.propertyType || 'Apartment',
        furnishing: request.furnishing || 'Semi Furnished',
        bedrooms: request.bedrooms || 1,
        minBudget: request.minBudget || 20000,
        maxBudget: request.maxBudget || 30000,
        offerAmount: request.offerAmount || 25000,
        purchaseTimeline: request.purchaseTimeline || 'Within 1 month',
        paymentMethod: request.paymentMethod || 'Home Loan',
        buyerType: request.buyerType || 'Family',
        status: request.status || 'pending',
        isUrgent: request.isUrgent || false,
        notes: request.notes || ''
      });
    } else if (mode === 'add') {
      setFormData(emptyForm);
    }
  }, [request, mode, show]);

  if (!show || !formData) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
  const purchaseTimelines = ['Within 1 month', 'Within 3 months', 'Within 6 months', 'Within 1 year', 'Flexible'];
  const paymentMethods = ['Home Loan', 'Cash', 'Down Payment', 'Rental Agreement', 'Lease Agreement'];
  const buyerTypes = ['Family', 'Bachelor', 'Couple', 'Students', 'Working Professionals', 'Investor'];
  const statusOptions = ['new', 'pending', 'approved', 'rejected', 'negotiation', 'closed'];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">{mode === 'add' ? 'New Purchase Request' : 'Edit Purchase Request'}</h2>
          <p className="text-white/80 text-sm">{mode === 'add' ? 'Create a new purchase request' : 'Update purchase request details'}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Buyer Info */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FiUser className="text-[#00695C]" />
                  Buyer Information
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Buyer Name *</label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="flex items-center gap-2 text-sm text-[#1A2E2A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isUrgent"
                    checked={formData.isUrgent}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                  />
                  <span>Mark as Urgent</span>
                  <span className="text-xs text-[#5A7D78]">(High priority request)</span>
                </label>
              </div>

              {/* Location */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FiMapPin className="text-[#00695C]" />
                  Location
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Preferred Location / Area</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  placeholder="e.g., Indiranagar, Koramangala, Whitefield"
                />
              </div>

              {/* Property Details */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FaHome className="text-[#00695C]" />
                  Property Details
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Furnishing Preference *</label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {furnishingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              {/* Budget & Offer */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-[#00695C]" />
                  Budget & Offer
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Min Budget (₹) *</label>
                <input
                  type="number"
                  name="minBudget"
                  value={formData.minBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Max Budget (₹) *</label>
                <input
                  type="number"
                  name="maxBudget"
                  value={formData.maxBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Offer Amount (₹) *</label>
                <input
                  type="number"
                  name="offerAmount"
                  value={formData.offerAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              {/* Purchase Timeline & Payment */}
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Purchase Timeline *</label>
                <select
                  name="purchaseTimeline"
                  value={formData.purchaseTimeline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {purchaseTimelines.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Buyer Type */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FiUsers className="text-[#00695C]" />
                  Buyer Details
                </h3>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Buyer Type *</label>
                <select
                  name="buyerType"
                  value={formData.buyerType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {buyerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
                  placeholder="Any special requirements or preferences..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="request-form"
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              {mode === 'add' ? 'Create Request' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const PurchaseRequestManagement = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedFurnishing, setSelectedFurnishing] = useState('all');
  const [selectedBuyerType, setSelectedBuyerType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formRequest, setFormRequest] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // ============ CONFIRM DIALOG STATE ============
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    deleteId: null
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    negotiation: 0,
    closed: 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    const total = list.length;
    const newCount = list.filter(r => r.status === 'new').length;
    const pending = list.filter(r => r.status === 'pending').length;
    const approved = list.filter(r => r.status === 'approved').length;
    const rejected = list.filter(r => r.status === 'rejected').length;
    const negotiation = list.filter(r => r.status === 'negotiation').length;
    const closed = list.filter(r => r.status === 'closed').length;

    setStats({
      total,
      new: newCount,
      pending,
      approved,
      rejected,
      negotiation,
      closed
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockRequests = useCallback(() => {
    const firstNames = ['Rahul', 'Anita', 'Sanjay', 'Divya', 'Karthik', 'Neha', 'Manoj', 'Swati', 'Rohit', 'Pallavi', 'Vivek', 'Shalini', 'Ajay', 'Bhavana', 'Naveen', 'Radhika', 'Sameer', 'Anjali', 'Harish', 'Preeti'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
    const statuses = ['new', 'pending', 'approved', 'rejected', 'negotiation', 'closed'];
    const purchaseTimelines = ['Within 1 month', 'Within 3 months', 'Within 6 months', 'Within 1 year', 'Flexible'];
    const paymentMethods = ['Home Loan', 'Cash', 'Down Payment', 'Rental Agreement', 'Lease Agreement'];
    const buyerTypes = ['Family', 'Bachelor', 'Couple', 'Students', 'Working Professionals', 'Investor'];
    const locations = ['MG Road', 'Banjara Hills', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jubilee Hills', 'Connaught Place', 'Salt Lake', 'Marine Drive', 'Andheri', 'Bandra', 'Powai'];

    const requests = [];
    const usedNames = new Set();

    for (let i = 1; i <= 80; i++) {
      let firstName, lastName, fullName;
      let attempts = 0;
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fullName = `${firstName} ${lastName}`;
        attempts++;
      } while (usedNames.has(fullName) && attempts < 50);
      usedNames.add(fullName);

      const minBudget = Math.floor(Math.random() * 30000 + 10000);
      const maxBudget = minBudget + Math.floor(Math.random() * 50000 + 10000);
      const offerAmount = Math.floor((minBudget + maxBudget) / 2) + Math.floor(Math.random() * 10000 - 5000);

      const city = cities[Math.floor(Math.random() * cities.length)];

      const status = statuses[Math.floor(Math.random() * statuses.length)];

      requests.push({
        id: `purchase_${i}`,
        buyerName: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        city: city,
        state: states[Math.floor(Math.random() * states.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        furnishing: furnishingOptions[Math.floor(Math.random() * furnishingOptions.length)],
        bedrooms: Math.floor(Math.random() * 4) + 1,
        minBudget: minBudget,
        maxBudget: maxBudget,
        offerAmount: offerAmount,
        purchaseTimeline: purchaseTimelines[Math.floor(Math.random() * purchaseTimelines.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        buyerType: buyerTypes[Math.floor(Math.random() * buyerTypes.length)],
        status: status,
        isUrgent: Math.random() > 0.8,
        notes: Math.random() > 0.7 ? 'Additional requirements or preferences' : '',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
      });
    }

    computeStats(requests);
    return requests;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockRequests = generateMockRequests();
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockRequests]);

  // ============ FILTER REQUESTS ============
  const filterRequests = useCallback(() => {
    let filtered = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.buyerName.toLowerCase().includes(query) ||
        req.email.toLowerCase().includes(query) ||
        req.phone.includes(query) ||
        req.city.toLowerCase().includes(query) ||
        req.location.toLowerCase().includes(query) ||
        req.propertyType.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }

    if (selectedPropertyType !== 'all') {
      filtered = filtered.filter(req => req.propertyType === selectedPropertyType);
    }

    if (selectedFurnishing !== 'all') {
      filtered = filtered.filter(req => req.furnishing === selectedFurnishing);
    }

    if (selectedBuyerType !== 'all') {
      filtered = filtered.filter(req => req.buyerType === selectedBuyerType);
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedPropertyType !== 'all') count++;
    if (selectedFurnishing !== 'all') count++;
    if (selectedBuyerType !== 'all') count++;
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

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [requests, searchQuery, selectedStatus, selectedPropertyType, selectedFurnishing, selectedBuyerType, sortField, sortDirection]);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = useMemo(() =>
    filteredRequests.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredRequests, currentPage, pageSize]);

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
    if (selectedRequests.length === paginatedRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(paginatedRequests.map(req => req.id));
    }
  }, [selectedRequests, paginatedRequests]);

  // ============ HANDLE SELECT REQUEST ============
  const handleSelectRequest = useCallback((reqId) => {
    setSelectedRequests(prev =>
      prev.includes(reqId)
        ? prev.filter(id => id !== reqId)
        : [...prev, reqId]
    );
  }, []);

  // ============ VIEW REQUEST ============
  const handleViewRequest = useCallback((req) => {
    setViewingRequest(req);
    setShowViewModal(true);
  }, []);

  // ============ ADD REQUEST ============
  const handleAddRequest = useCallback(() => {
    setFormRequest(null);
    setFormMode('add');
    setShowFormModal(true);
  }, []);

  // ============ EDIT REQUEST ============
  const handleEditRequest = useCallback((req) => {
    setFormRequest(req);
    setFormMode('edit');
    setShowFormModal(true);
  }, []);

// ============ SAVE FORM ============
const saveForm = useCallback((data) => {
  setRequests(prev => {
    let updated;
    let savedRequest = null;
    
    if (formMode === 'add') {
      const newRequest = {
        ...data,
        id: `purchase_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      savedRequest = newRequest;
      updated = [newRequest, ...prev];
    } else {
      updated = prev.map(r => {
        if (r.id === formRequest.id) {
          savedRequest = { ...r, ...data };
          return savedRequest;
        }
        return r;
      });
    }
    
    computeStats(updated);
    
    if (savedRequest && viewingRequest && savedRequest.id === viewingRequest.id) {
      setViewingRequest(savedRequest);
    }
    
    return updated;
  });

  setShowFormModal(false);
  setFormRequest(null);
  showToast(formMode === 'add' ? 'Purchase request created successfully' : 'Purchase request updated successfully', 'success');
}, [formMode, formRequest, computeStats, showToast, viewingRequest]);

  // ============ STATUS CHANGE ============
  const handleStatusChange = useCallback((reqId, newStatus) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    setActionLoading(reqId);
    setTimeout(() => {
      setRequests(prev => {
        const updated = prev.map(r => {
          if (r.id === reqId) {
            return { ...r, status: newStatus };
          }
          return r;
        });
        computeStats(updated);
        return updated;
      });
      setActionLoading(null);
      setShowViewModal(false);
      const statusMessages = {
        approved: 'approved',
        rejected: 'rejected',
        negotiation: 'moved to negotiation',
        closed: 'marked as closed'
      };
      showToast(`Request ${statusMessages[newStatus] || newStatus} successfully`, 
        newStatus === 'approved' ? 'success' : 
        newStatus === 'rejected' ? 'error' : 'info'
      );
    }, 700);
  }, [requests, computeStats, showToast]);

  // ============ DELETE REQUEST WITH CUSTOM CONFIRM ============
  const handleDeleteRequest = useCallback((reqId) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    setConfirmDialog({
      show: true,
      title: 'Delete Purchase Request',
      message: `Are you sure you want to delete ${req.buyerName}'s purchase request? This action cannot be undone.`,
      deleteId: reqId,
      onConfirm: () => {
        setActionLoading(reqId);
        setConfirmDialog(prev => ({ ...prev, loading: true }));

        setTimeout(() => {
          setRequests(prev => {
            const updated = prev.filter(r => r.id !== reqId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: null, deleteId: null, loading: false });
          showToast(`${req.buyerName}'s purchase request deleted`, 'error');
        }, 700);
      },
      loading: false
    });
  }, [requests, computeStats, showToast]);

  // ============ CLOSE CONFIRM DIALOG ============
  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ show: false, title: '', message: '', onConfirm: null, deleteId: null, loading: false });
  }, []);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedStatus('all');
    setSelectedPropertyType('all');
    setSelectedFurnishing('all');
    setSelectedBuyerType('all');

    if (nextFilter === 'new' || nextFilter === 'pending' || nextFilter === 'approved' || 
        nextFilter === 'rejected' || nextFilter === 'negotiation' || nextFilter === 'closed') {
      setSelectedStatus(nextFilter);
    }

    setSearchQuery('');
    searchInputRef.current?.focus();
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedPropertyType('all');
    setSelectedFurnishing('all');
    setSelectedBuyerType('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockRequests = generateMockRequests();
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockRequests, showToast]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredRequests.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const data = filteredRequests.map(req => ({
      'Request ID': req.id,
      'Buyer Name': req.buyerName,
      Email: req.email,
      Phone: req.phone,
      City: req.city,
      State: req.state,
      'Preferred Location': req.location,
      'Property Type': req.propertyType,
      'Furnishing Preference': req.furnishing,
      Bedrooms: req.bedrooms,
      'Min Budget (₹)': req.minBudget,
      'Max Budget (₹)': req.maxBudget,
      'Offer Amount (₹)': req.offerAmount,
      'Purchase Timeline': req.purchaseTimeline,
      'Payment Method': req.paymentMethod,
      'Buyer Type': req.buyerType,
      Status: req.status,
      'Urgent': req.isUrgent ? 'Yes' : 'No',
      'Created At': new Date(req.createdAt).toLocaleDateString(),
      Notes: req.notes || ''
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase_requests_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredRequests.length} records exported successfully`, 'success');
  }, [filteredRequests, showToast]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedRequests.length === 0) {
      showToast('Please select requests first', 'warning');
      return;
    }

    if (action === 'delete') {
      setConfirmDialog({
        show: true,
        title: 'Delete Selected Requests',
        message: `Are you sure you want to delete ${selectedRequests.length} selected request(s)? This action cannot be undone.`,
        deleteId: 'bulk',
        onConfirm: () => {
          setActionLoading('bulk-delete');
          setConfirmDialog(prev => ({ ...prev, loading: true }));

          setTimeout(() => {
            const selectedIds = new Set(selectedRequests);
            let count = 0;

            setRequests(prev => {
              count = prev.filter(r => selectedIds.has(r.id)).length;
              const updated = prev.filter(r => !selectedIds.has(r.id));
              computeStats(updated);
              return updated;
            });

            setSelectedRequests([]);
            setActionLoading(null);
            setConfirmDialog({ show: false, title: '', message: '', onConfirm: null, deleteId: null, loading: false });
            showToast(`${count} request(s) deleted`, 'error');
          }, 800);
        },
        loading: false
      });
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedRequests);
      let count = 0;

      setRequests(prev => {
        let updated = prev.map(r => {
          if (!selectedIds.has(r.id)) return r;
          count++;
          if (action === 'approve') return { ...r, status: 'approved' };
          if (action === 'reject') return { ...r, status: 'rejected' };
          if (action === 'negotiation') return { ...r, status: 'negotiation' };
          if (action === 'close') return { ...r, status: 'closed' };
          return r;
        });
        computeStats(updated);
        return updated;
      });

      setSelectedRequests([]);
      setActionLoading(null);

      if (action === 'approve') showToast(`${count} request(s) approved`, 'success');
      else if (action === 'reject') showToast(`${count} request(s) rejected`, 'error');
      else if (action === 'negotiation') showToast(`${count} request(s) moved to negotiation`, 'info');
      else if (action === 'close') showToast(`${count} request(s) closed`, 'info');
    }, 800);
  }, [selectedRequests, computeStats, showToast]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
      approved: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      negotiation: 'bg-purple-50 text-purple-700 border-purple-200',
      closed: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: <FaRegClock className="text-blue-500 text-xs" />,
      pending: <FaHourglassHalf className="text-amber-500 text-xs" />,
      approved: <FiCheckCircle className="text-[#00695C] text-xs" />,
      rejected: <FaTimes className="text-red-500 text-xs" />,
      negotiation: <FiPercent className="text-purple-500 text-xs" />,
      closed: <FaClock className="text-gray-500 text-xs" />
    };
    return icons[status] || icons.pending;
  };

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

      {/* Confirm Dialog */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
        loading={confirmDialog.loading}
      />

      {/* Add/Edit Modal */}
      <AddEditRequestModal
        request={formRequest}
        mode={formMode}
        show={showFormModal}
        onClose={() => { setShowFormModal(false); setFormRequest(null); }}
        onSave={saveForm}
      />

      {/* View Modal */}
      <ViewRequestModal
        request={viewingRequest}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingRequest(null); }}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        onStatusChange={handleStatusChange}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Purchase Request Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredRequests.length} Requests
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage all property purchase requests from buyers</span>
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
            <button
              onClick={handleAddRequest}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiPlus className="text-sm" />
              <span>New Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section - 7 Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiShoppingCart className="text-white text-sm" />}
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FaRegClock className="text-white text-sm" />}
                title="New"
                value={stats.new}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={100}
                isActive={activeFilter === 'new'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('new')}
              />
              <StatCard
                icon={<FaHourglassHalf className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={200}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Approved"
                value={stats.approved}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={300}
                isActive={activeFilter === 'approved'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('approved')}
              />
              <StatCard
                icon={<FaTimes className="text-white text-sm" />}
                title="Rejected"
                value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={400}
                isActive={activeFilter === 'rejected'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('rejected')}
              />
              <StatCard
                icon={<FiPercent className="text-white text-sm" />}
                title="Negotiation"
                value={stats.negotiation}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={500}
                isActive={activeFilter === 'negotiation'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('negotiation')}
              />
              <StatCard
                icon={<FaClock className="text-white text-sm" />}
                title="Closed"
                value={stats.closed}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={600}
                isActive={activeFilter === 'closed'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('closed')}
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
              placeholder="Search by buyer name, email, phone, city, location, or property type..."
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
                  setSelectedPropertyType('all');
                  setSelectedFurnishing('all');
                  setSelectedBuyerType('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed">Closed</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedPropertyType}
                onChange={(e) => {
                  setSelectedPropertyType(e.target.value);
                  setSelectedStatus('all');
                  setSelectedFurnishing('all');
                  setSelectedBuyerType('all');
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
                value={selectedFurnishing}
                onChange={(e) => {
                  setSelectedFurnishing(e.target.value);
                  setSelectedStatus('all');
                  setSelectedPropertyType('all');
                  setSelectedBuyerType('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Furnishing</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedBuyerType}
                onChange={(e) => {
                  setSelectedBuyerType(e.target.value);
                  setSelectedStatus('all');
                  setSelectedPropertyType('all');
                  setSelectedFurnishing('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Buyer Types</option>
                <option value="Family">Family</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Couple">Couple</option>
                <option value="Students">Students</option>
                <option value="Working Professionals">Working Professionals</option>
                <option value="Investor">Investor</option>
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
        {selectedRequests.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedRequests.length}</span> request(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={actionLoading === 'approve'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'approve' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={actionLoading === 'reject'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'reject' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Reject All
              </button>
              <button
                onClick={() => handleBulkAction('negotiation')}
                disabled={actionLoading === 'negotiation'}
                className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'negotiation' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiPercent className="text-[10px]" />}
                Negotiate All
              </button>
              <button
                onClick={() => handleBulkAction('close')}
                disabled={actionLoading === 'close'}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'close' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Close All
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button
                onClick={() => setSelectedRequests([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Requests Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedRequests.map((req, index) => {
              const isSelected = selectedRequests.includes(req.id);

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    req.status === 'new' ? 'border-l-4 border-l-blue-500' :
                    req.status === 'pending' ? 'border-l-4 border-l-amber-500' :
                    req.status === 'approved' ? 'border-l-4 border-l-emerald-500' :
                    req.status === 'rejected' ? 'border-l-4 border-l-red-500' :
                    req.status === 'negotiation' ? 'border-l-4 border-l-purple-500' :
                    req.status === 'closed' ? 'border-l-4 border-l-gray-500' : ''
                  } ${req.isUrgent ? 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRequest(req.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {req.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        {req.isUrgent && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{req.buyerName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                          {req.isUrgent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-red-100 text-red-700 border border-red-200">
                              🔥 Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      onClick={() => handleViewRequest(req)}
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaMoneyBillWave className="text-[#00695C] flex-shrink-0" />
                      <span>₹{req.minBudget.toLocaleString()} - ₹{req.maxBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span>Offer: ₹{req.offerAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{req.location}, {req.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{req.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{req.furnishing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaBed className="text-[#00695C] flex-shrink-0" />
                      <span>{req.bedrooms} BHK</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaCalendarAlt className="text-[#00695C] flex-shrink-0" />
                      <span>{req.purchaseTimeline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span>{req.buyerType}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewRequest(req)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRequest(req)}
                      className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      disabled={actionLoading === req.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === req.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                  checked={selectedRequests.length === paginatedRequests.length && paginatedRequests.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Buyer</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('buyerName')}>
                Name {sortField === 'buyerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Offer</div>
              <div className="col-span-1">Budget</div>
              <div className="col-span-1">Property</div>
              <div className="col-span-1">Furnishing</div>
              <div className="col-span-1 text-center">BHK</div>
              <div className="col-span-1 text-center">Buyer Type</div>
              <div className="col-span-1 text-center">Timeline</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedRequests.map((req, index) => {
              const isSelected = selectedRequests.includes(req.id);

              return (
                <div
                  key={req.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''} ${req.status === 'new' ? 'bg-blue-50/30' : req.status === 'pending' ? 'bg-amber-50/30' : req.status === 'negotiation' ? 'bg-purple-50/30' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRequest(req.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {req.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      {req.isUrgent && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] flex items-center gap-1">
                      {req.buyerName}
                      {req.isUrgent && <span className="text-red-500 text-[10px]">🔥</span>}
                    </p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{req.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    ₹{Math.floor(req.offerAmount / 1000)}K
                  </div>

                  <div className="col-span-1 text-[10px] text-[#5A7D78]">
                    ₹{Math.floor(req.minBudget / 1000)}K - ₹{Math.floor(req.maxBudget / 1000)}K
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{req.propertyType}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{req.furnishing}</div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{req.bedrooms} BHK</div>

                  <div className="col-span-1 text-center text-[10px] text-[#5A7D78] truncate">{req.buyerType}</div>

                  <div className="col-span-1 text-center text-[10px] text-[#5A7D78]">
                    {req.purchaseTimeline}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewRequest(req)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRequest(req)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      disabled={actionLoading === req.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === req.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedRequests.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiShoppingCart className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No purchase requests found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No requests match your current view'}
            </p>
            {filterCount > 0 ? (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={handleAddRequest}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105 flex items-center gap-2"
              >
                <FiPlus className="text-sm" /> New Purchase Request
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
              {Math.min(currentPage * pageSize, filteredRequests.length)} of{' '}
              {filteredRequests.length} requests
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

export default PurchaseRequestManagement;