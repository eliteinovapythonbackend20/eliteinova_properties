// src/components/admin/Payments/PropertyPaymentDetails.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiCreditCard, FiClock,
  FiRotateCcw, FiDollarSign, FiCalendar, FiHome,
  FiClipboard, FiLayers, FiMapPin
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat } from 'react-icons/fa';

// ============================================================
// PROPERTY TYPE CONFIG  (shared PROP prefix for all types)
// ============================================================
const PROPERTY_TYPE_CONFIG = {
  'Individual':   { icon: FiUser,      bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200',   gradient: 'from-slate-600 to-slate-400' },
  'Apartment':    { icon: FaHome,      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400' },
  'Commercial':   { icon: FiBriefcase, bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-600 to-blue-400' },
  'Land & Plots': { icon: FiClipboard, bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   gradient: 'from-amber-600 to-amber-400' },
  'Hostel':       { icon: FaHotel,     bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    gradient: 'from-pink-600 to-pink-400' }
};

const ALL_PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_CONFIG);

// ============================================================
// PROPERTY PURPOSE OPTIONS
// ============================================================
const ALL_PROPERTY_PURPOSES = ['Rent', 'Sell', 'Lease'];

// ============================================================
// LISTING ROLE CONFIG
// ============================================================
const LISTING_ROLE_CONFIG = {
  'Owner':            { icon: FaHome,      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400' },
  'Agent':            { icon: FiBriefcase, bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-600 to-blue-400' },
  'Builder':          { icon: FaHardHat,   bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  gradient: 'from-orange-600 to-orange-400' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  gradient: 'from-purple-600 to-purple-400' }
};

const ALL_LISTING_ROLES = Object.keys(LISTING_ROLE_CONFIG);

// ============================================================
// PAYMENT RELATED TO OPTIONS
// ============================================================
const ALL_PAYMENT_RELATED_TO = [
  'Property Listing Fee',
  'Property Promotion',
  'Featured Listing',
  'Subscription',
  'Lead Purchase',
  'Contact Access',
  'Agent Subscription',
  'Builder Subscription',
  'Owner Subscription',
  'Property Management Service',
  'Loan Service'
];

// ============================================================
// PAYMENT STATUS CONFIG
// ============================================================
const STATUS_TYPES = {
  'Success':  { icon: FiCheckCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Success' },
  'Pending':  { icon: FiClock,       color: 'from-amber-600 to-amber-400',     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Pending' },
  'Failed':   { icon: FiXCircle,     color: 'from-red-600 to-red-400',         bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Failed' },
  'Refunded': { icon: FiRotateCcw,   color: 'from-blue-600 to-blue-400',       bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Refunded' }
};

const ALL_STATUSES = Object.keys(STATUS_TYPES);

// ============================================================
// CURRENCY FORMAT HELPER
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

// ============================================================
// GST BREAKDOWN HELPERS (18%)
// ------------------------------------------------------------
// getAmountBreakdown: amount is treated as the final/total amount
// paid; base + GST are derived from it so base + gst === total,
// e.g. ₹1,297 => ₹1,099 (base) + ₹198 (GST). Used everywhere the
// STORED total needs to be split for display (grid, list, view).
//
// ============================================================
const GST_RATE = 0.18;

const getAmountBreakdown = (amount) => {
  const total = Number(amount || 0);
  const base = Math.round(total / (1 + GST_RATE));
  const gst = total - base;
  return { total, base, gst };
};

// getDisplayBreakdown: the source of truth for showing base/GST/total
// anywhere in the UI (grid cards, list rows, view modal, export).
// If the payment carries its own explicit baseAmount/gstAmount (set
// whenever it's edited via the Payment Details form), those exact
// values are used so what the admin typed is exactly what's shown.
// Otherwise (e.g. freshly generated mock data) it falls back to
// deriving an 18%-inclusive split from the stored total.
const getDisplayBreakdown = (payment) => {
  if (!payment) return { total: 0, base: 0, gst: 0 };
  if (payment.baseAmount != null && payment.gstAmount != null) {
    const base = Number(payment.baseAmount || 0);
    const gst = Number(payment.gstAmount || 0);
    return { base, gst, total: base + gst };
  }
  return getAmountBreakdown(payment.amount);
};

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
    danger:  { icon: 'text-red-600',   bg: 'bg-red-50',   button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',     border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', border: 'border-amber-200' },
    info:    { icon: 'text-blue-600',  bg: 'bg-blue-50',  button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',   border: 'border-blue-200' }
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
// VIEW PROPERTY PAYMENT DETAIL MODAL
// ============================================================
const ViewPropertyPaymentDetailModal = ({ payment, show, onClose, onEdit, onDelete }) => {
  if (!payment || !show) return null;

  const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;
  const roleConfig = LISTING_ROLE_CONFIG[payment.listingRole] || LISTING_ROLE_CONFIG['Owner'];
  const RoleIcon = roleConfig.icon;
  const statusConfig = STATUS_TYPES[payment.status] || STATUS_TYPES['Pending'];
  const StatusIcon = statusConfig.icon;
  const amountBreakdown = getDisplayBreakdown(payment);

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
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${propTypeConfig.gradient} border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg`}>
              <PropTypeIcon />
            </div>
            <div>
              {/* Header now leads with the property name instead of the amount */}
              <h2 className="text-2xl font-bold text-white">{payment.propertyName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>ID: {payment.propertyId}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">{formatCurrency(payment.amount)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <PropTypeIcon className="text-xs" /> {payment.propertyType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiTag className="text-xs" /> {payment.propertyPurpose}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <RoleIcon className="text-xs" /> {payment.listingRole}: {payment.listingName}
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
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.propertyId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHome className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.propertyName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PropTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.propertyType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Purpose</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.propertyPurpose}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Location</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.propertyLocation}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <RoleIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Listing {payment.listingRole} Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.listingName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCreditCard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Related To</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.paymentRelatedTo}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiDollarSign className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Amount</h4>
              </div>
              <p className="text-sm font-bold text-[#00695C]">{formatCurrency(payment.amount)}</p>
              <p className="text-[11px] text-[#5A7D78] mt-0.5">
                ({formatCurrency(amountBreakdown.base)} + {formatCurrency(amountBreakdown.gst)} GST)
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{statusConfig.label}</p>
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
              onClick={() => { if (onEdit) { onEdit(payment); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(payment.id); } }}
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
// EDIT PROPERTY PAYMENT MODAL
// ============================================================
const EditPropertyPaymentModal = ({ payment, show, onClose, onSave }) => {
  if (!payment || !show) return null;

  const [formData, setFormData] = useState({
    propertyId: '', propertyName: '', propertyType: '', propertyPurpose: '',
    propertyLocation: '', listingRole: '', listingName: '',
    paymentRelatedTo: '', paymentDate: '', amount: '', gst: '', status: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (payment) {
      // Amount and GST are independently editable fields, so seed them
      // from whatever the payment currently has (explicit base/GST if
      // it was edited before, otherwise an 18%-derived split of the total).
      const seed = getDisplayBreakdown(payment);
      setFormData({
        propertyId: payment.propertyId || '',
        propertyName: payment.propertyName || '',
        propertyType: payment.propertyType || '',
        propertyPurpose: payment.propertyPurpose || '',
        propertyLocation: payment.propertyLocation || '',
        listingRole: payment.listingRole || '',
        listingName: payment.listingName || '',
        paymentRelatedTo: payment.paymentRelatedTo || '',
        paymentDate: payment.paymentDate ? payment.paymentDate.split('T')[0] : '',
        amount: seed.base || '',
        gst: seed.gst || '',
        status: payment.status || 'Pending'
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Amount and GST are both typed independently by the admin;
      // the total is simply their sum, and everything is stored so
      // later views show exactly these two numbers, not a re-derived split.
      const base = Number(formData.amount) || 0;
      const gst = Number(formData.gst) || 0;
      const total = base + gst;
      onSave({ ...payment, ...formData, amount: total, baseAmount: base, gstAmount: gst });
      setLoading(false);
      onClose();
    }, 700);
  };

  const inputCls = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none";
  const readOnlyInputCls = "w-full px-3 py-2 bg-[#EDF3F1] rounded-xl border border-[#E8F0EE] text-sm font-bold text-[#1A2E2A] outline-none cursor-not-allowed";
  const labelCls = "block text-xs font-medium text-[#5A7D78] mb-1";

  // Total Amount is always just Amount + Tax/GST, live-computed, read-only
  const liveTotal = (Number(formData.amount) || 0) + (Number(formData.gst) || 0);

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
          <h2 className="text-2xl font-bold text-white">Edit Property Payment</h2>
          <p className="text-white/80 text-sm">Update property payment details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHome className="text-[#00695C]" /> Property Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Property ID</label>
                  <input type="text" name="propertyId" value={formData.propertyId} onChange={handleChange} className={inputCls} placeholder="PROP-0001" />
                </div>
                <div>
                  <label className={labelCls}>Property Name *</label>
                  <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} required className={inputCls} placeholder="Enter property name" />
                </div>
                <div>
                  <label className={labelCls}>Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Property Type</option>
                    {ALL_PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Property Purpose *</label>
                  <select name="propertyPurpose" value={formData.propertyPurpose} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Purpose</option>
                    {ALL_PROPERTY_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Property Location *</label>
                  <input type="text" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange} required className={inputCls} placeholder="City, State" />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" /> Listing Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Listing Role *</label>
                  <select name="listingRole" value={formData.listingRole} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Role</option>
                    {ALL_LISTING_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Listing Name *</label>
                  <input type="text" name="listingName" value={formData.listingName} onChange={handleChange} required className={inputCls} placeholder="Enter listing name" />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCreditCard className="text-[#00695C]" /> Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Payment Purpose *</label>
                  <select name="paymentRelatedTo" value={formData.paymentRelatedTo} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Payment Type</option>
                    {ALL_PAYMENT_RELATED_TO.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Amount (₹) *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" className={inputCls} placeholder="Enter amount" />
                </div>
                <div>
                  <label className={labelCls}>Tax / GST (₹) *</label>
                  <input type="number" name="gst" value={formData.gst} onChange={handleChange} required min="0" className={inputCls} placeholder="Enter tax / GST" />
                </div>
                <div>
                  <label className={labelCls}>Total Amount (₹) *</label>
                  <input type="text" value={formatCurrency(liveTotal).replace('₹', '')} readOnly disabled className={readOnlyInputCls} />
                </div>
                <div>
                  <label className={labelCls}>Payment Date *</label>
                  <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required className={inputCls}>
                    {ALL_STATUSES.map(status => <option key={status} value={status}>{STATUS_TYPES[status].label}</option>)}
                  </select>
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
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All', disabled = false }) => {
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
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
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
// MAIN COMPONENT — Property Payment Details
// ============================================================
const PropertyPaymentDetails = () => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('paymentDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [activePurpose, setActivePurpose] = useState('all');
  const [activeRelatedTo, setActiveRelatedTo] = useState('all');
  const [activeListingRole, setActiveListingRole] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0, Success: 0, Pending: 0, Failed: 0, Refunded: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, Success: 0, Pending: 0, Failed: 0, Refunded: 0 });
      return;
    }
    const counts = { total: list.length };
    ALL_STATUSES.forEach(status => {
      counts[status] = list.filter(p => p.status === status).length;
    });
    setStats(counts);
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockPayments = useCallback(() => {
    const propertyNames = [
      'Sunrise Apartments', 'Green Valley Villa', 'Lake View Residency', 'Palm Grove Complex',
      'Silver Oak Towers', 'Royal Heights', 'Emerald Enclave', 'Maple Street Duplex',
      'Skyline Business Park', 'Golden Gate Plaza', 'Harmony Homes', 'Orchid Residency',
      'Blue Bell Hostel', 'City Center Mall', 'Hilltop Bungalow', 'Riverside Plots'
    ];
    const locations = [
      'Mumbai, Maharashtra', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Hyderabad, Telangana',
      'Pune, Maharashtra', 'Delhi, NCR', 'Kochi, Kerala', 'Coimbatore, Tamil Nadu',
      'Ahmedabad, Gujarat', 'Jaipur, Rajasthan'
    ];
    const listingNames = ['Arun Kumar', 'Priya Sharma', 'Karthik Reddy', 'Divya Iyer', 'Suresh Nair', 'Meena Menon', 'Ravi Rao', 'Anitha Pillai'];
    const propertyTypes = ALL_PROPERTY_TYPES;

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 80; i++) {
      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const propertyPurpose = ALL_PROPERTY_PURPOSES[Math.floor(Math.random() * ALL_PROPERTY_PURPOSES.length)];
      const propertyLocation = locations[Math.floor(Math.random() * locations.length)];
      const listingRole = ALL_LISTING_ROLES[Math.floor(Math.random() * ALL_LISTING_ROLES.length)];
      const listingName = listingNames[Math.floor(Math.random() * listingNames.length)];
      const paymentRelatedTo = ALL_PAYMENT_RELATED_TO[Math.floor(Math.random() * ALL_PAYMENT_RELATED_TO.length)];
      const status = ALL_STATUSES[Math.floor(Math.random() * ALL_STATUSES.length)];

      // amounts vary by payment type
      let baseAmount = 999;
      if (paymentRelatedTo === 'Property Listing Fee') baseAmount = 799;
      else if (paymentRelatedTo === 'Property Promotion') baseAmount = 1499;
      else if (paymentRelatedTo === 'Featured Listing') baseAmount = 1999;
      else if (paymentRelatedTo === 'Subscription') baseAmount = 2999;
      else if (paymentRelatedTo === 'Lead Purchase') baseAmount = 499;
      else if (paymentRelatedTo === 'Contact Access') baseAmount = 299;
      else if (paymentRelatedTo === 'Agent Subscription') baseAmount = 1999;
      else if (paymentRelatedTo === 'Builder Subscription') baseAmount = 3999;
      else if (paymentRelatedTo === 'Owner Subscription') baseAmount = 999;
      else if (paymentRelatedTo === 'Property Management Service') baseAmount = 4999;
      else if (paymentRelatedTo === 'Loan Service') baseAmount = 2499;
      const amount = baseAmount + Math.floor(Math.random() * 5) * 200;

      // uniform PROP-#### ID
      const propertyId = `PROP-${String(i).padStart(4, '0')}`;

      // dates spread over last 75 days
      let payDate;
      if (i % 9 === 0) {
        payDate = new Date(now);
      } else {
        const daysAgo = Math.floor(Math.random() * 75);
        payDate = new Date(now);
        payDate.setDate(payDate.getDate() - daysAgo);
      }

      const { base: genBase, gst: genGst } = getAmountBreakdown(amount);

      list.push({
        id: `ppay_${i}`,
        propertyId,
        propertyName,
        propertyType,
        propertyPurpose,
        propertyLocation,
        listingRole,
        listingName,
        paymentRelatedTo,
        paymentDate: payDate.toISOString(),
        amount,
        baseAmount: genBase,
        gstAmount: genGst,
        status
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockPayments = generateMockPayments();
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
    } catch (error) {
      console.error('Error generating mock property payments:', error);
    }
  }, [generateMockPayments]);

  // ============ FILTER PAYMENTS ============
  const filterPayments = useCallback(() => {
    try {
      let filtered = [...payments];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          (p.propertyId && p.propertyId.toLowerCase().includes(query)) ||
          (p.propertyName && p.propertyName.toLowerCase().includes(query)) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(query)) ||
          (p.propertyPurpose && p.propertyPurpose.toLowerCase().includes(query)) ||
          (p.propertyLocation && p.propertyLocation.toLowerCase().includes(query)) ||
          (p.listingName && p.listingName.toLowerCase().includes(query)) ||
          (p.listingRole && p.listingRole.toLowerCase().includes(query)) ||
          (p.paymentRelatedTo && p.paymentRelatedTo.toLowerCase().includes(query)) ||
          (p.status && p.status.toLowerCase().includes(query)) ||
          (String(p.amount).includes(query))
        );
      }

      if (activeStatus !== 'all')       filtered = filtered.filter(p => p.status === activeStatus);
      if (activePropertyType !== 'all') filtered = filtered.filter(p => p.propertyType === activePropertyType);
      if (activePurpose !== 'all')      filtered = filtered.filter(p => p.propertyPurpose === activePurpose);
      if (activeRelatedTo !== 'all')    filtered = filtered.filter(p => p.paymentRelatedTo === activeRelatedTo);
      if (activeListingRole !== 'all')  filtered = filtered.filter(p => p.listingRole === activeListingRole);

      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activePropertyType !== 'all') count++;
      if (activePurpose !== 'all') count++;
      if (activeRelatedTo !== 'all') count++;
      if (activeListingRole !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'amount') {
          aVal = Number(aVal); bVal = Number(bVal);
        } else if (sortField === 'paymentDate') {
          aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime();
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredPayments(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering property payments:', error);
    }
  }, [payments, searchQuery, activeStatus, activePropertyType, activePurpose, activeRelatedTo, activeListingRole, sortField, sortDirection]);

  useEffect(() => { filterPayments(); }, [filterPayments]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredPayments.slice(start, end);
  }, [filteredPayments, currentPage, pageSize]);

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
    if (selectedPayments.length === paginatedPayments.length && paginatedPayments.length > 0) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(paginatedPayments.map(p => p.id));
    }
  }, [selectedPayments, paginatedPayments]);

  const handleSelectPayment = useCallback((paymentId) => {
    setSelectedPayments(prev => prev.includes(paymentId) ? prev.filter(id => id !== paymentId) : [...prev, paymentId]);
  }, []);

  // ============ VIEW / EDIT ============
  const handleViewPayment = useCallback((payment) => {
    setViewingPayment(payment);
    setShowViewModal(true);
  }, []);

  const handleEditPayment = useCallback((payment) => {
    setEditingPayment(payment);
    setShowEditModal(true);
  }, []);

  const handleSavePayment = useCallback((updatedPayment) => {
    setPayments(prev => {
      const updated = prev.map(p => p.id === updatedPayment.id ? updatedPayment : p);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Property payment "${updatedPayment.propertyId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE ============
  const handleDeletePayment = useCallback((paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Property Payment',
      message: `Are you sure you want to delete payment for "${payment.propertyName}" (${formatCurrency(payment.amount)})?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(paymentId);
        setTimeout(() => {
          setPayments(prev => {
            const updated = prev.filter(p => p.id !== paymentId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted property payment "${payment.propertyId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [payments, computeStats]);

  // ============ STAT CLICK HANDLERS ============
  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActivePropertyType('all');
    setActivePurpose('all');
    setActiveRelatedTo('all');
    setActiveListingRole('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActivePropertyType('all');
    setActivePurpose('all');
    setActiveRelatedTo('all');
    setActiveListingRole('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockPayments = generateMockPayments();
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockPayments]);

  // ============ EXPORT ============
  const handleExport = useCallback(() => {
    if (filteredPayments.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredPayments.map(p => {
        const breakdown = getDisplayBreakdown(p);
        return {
          'Property ID': p.propertyId || '',
          'Property Name': p.propertyName || '',
          'Property Type': p.propertyType || '',
          'Property Purpose': p.propertyPurpose || '',
          'Property Location': p.propertyLocation || '',
          'Listing Role': p.listingRole || '',
          'Listing Name': p.listingName || '',
          'Payment Related To': p.paymentRelatedTo || '',
          'Payment Date': p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '',
          'Base Amount': breakdown.base,
          'GST': breakdown.gst,
          'Total Amount': breakdown.total,
          'Status': p.status || ''
        };
      });

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property_payments_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredPayments.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredPayments]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedPayments.length === 0) {
      setToast({ message: 'Please select payments first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Payments',
      message: `Are you sure you want to delete ${selectedPayments.length} selected payment(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedPayments);
          const count = payments.filter(p => selectedIds.has(p.id)).length;
          const updated = payments.filter(p => !selectedIds.has(p.id));
          setPayments(updated);
          computeStats(updated);
          setSelectedPayments([]);
          setActionLoading(null);
          setToast({ message: `${count} payment(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedPayments, payments, computeStats]);

  // ============ FILTER OPTIONS ============
  const statusOptions = ALL_STATUSES.map(s => ({ value: s, label: STATUS_TYPES[s].label }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(t => ({ value: t, label: t }));
  const purposeOptions = ALL_PROPERTY_PURPOSES.map(p => ({ value: p, label: p }));
  const relatedToOptions = ALL_PAYMENT_RELATED_TO.map(r => ({ value: r, label: r }));
  const listingRoleOptions = ALL_LISTING_ROLES.map(r => ({ value: r, label: r }));

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

      {showViewModal && viewingPayment && (
        <ViewPropertyPaymentDetailModal
          payment={viewingPayment}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingPayment(null); }}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
        />
      )}

      {showEditModal && editingPayment && (
        <EditPropertyPaymentModal
          payment={editingPayment}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingPayment(null); }}
          onSave={handleSavePayment}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Property Payment Details
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredPayments.length} Payments
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track all property-linked payments across listings, bookings, rent and more</span>
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

      {/* Stats Section — Total, Success, Pending, Failed, Refunded */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <StatCard
                icon={<FiLayers className="text-white text-sm" />}
                title="Total Payments"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={filterCount === 0}
                onClick={handleTotalClick}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Successful"
                value={stats.Success}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={60}
                isActive={activeStatus === 'Success'}
                onClick={() => handleStatusClick('Success')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.Pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={120}
                isActive={activeStatus === 'Pending'}
                onClick={() => handleStatusClick('Pending')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Failed"
                value={stats.Failed}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={180}
                isActive={activeStatus === 'Failed'}
                onClick={() => handleStatusClick('Failed')}
              />
              <StatCard
                icon={<FiRotateCcw className="text-white text-sm" />}
                title="Refunded"
                value={stats.Refunded}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={240}
                isActive={activeStatus === 'Refunded'}
                onClick={() => handleStatusClick('Refunded')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search bar — one line */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="relative w-full ">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by property ID, name, type, location, listing name, payment type..."
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

        {/* Filters — next line */}
        <div className="flex items-center gap-2 flex-wrap mt-5">
          <FilterDropdown
            label="Type"
            options={propertyTypeOptions}
            value={activePropertyType}
            onChange={setActivePropertyType}
            icon={FiHome}
            allLabel="All Types"
          />
          <FilterDropdown
            label="Purpose"
            options={purposeOptions}
            value={activePurpose}
            onChange={setActivePurpose}
            icon={FiTag}
            allLabel="All Purposes"
          />
          <FilterDropdown
            label="Related To"
            options={relatedToOptions}
            value={activeRelatedTo}
            onChange={setActiveRelatedTo}
            icon={FiCreditCard}
            allLabel="All Payment Types"
          />
          <FilterDropdown
            label="Listing"
            options={listingRoleOptions}
            value={activeListingRole}
            onChange={setActiveListingRole}
            icon={FiUser}
            allLabel="All Roles"
          />
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={activeStatus}
            onChange={setActiveStatus}
            icon={FiActivity}
            allLabel="All Statuses"
          />

          {filterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105 whitespace-nowrap"
            >
              <FiX className="text-sm" /> Clear
            </button>
          )}

          <div className="ml-auto flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE] flex-shrink-0">
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

      

        {selectedPayments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedPayments.length}</span> payment(s) selected
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
                onClick={() => setSelectedPayments([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payments Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedPayments.map((payment, index) => {
              const isSelected = selectedPayments.includes(payment.id);
              const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
              const PropTypeIcon = propTypeConfig.icon;
              const roleConfig = LISTING_ROLE_CONFIG[payment.listingRole] || LISTING_ROLE_CONFIG['Owner'];
              const RoleIcon = roleConfig.icon;
              const statusConfig = STATUS_TYPES[payment.status] || STATUS_TYPES['Pending'];
              const StatusIcon = statusConfig.icon;
              const amountBreakdown = getDisplayBreakdown(payment);

              return (
                <div
                  key={payment.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${propTypeConfig.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <PropTypeIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{payment.propertyName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[11px] font-medium text-[#5A7D78]">{payment.propertyId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHash className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-bold text-[#1A2E2A]">{payment.propertyId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <PropTypeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                        {payment.propertyType}
                      </span>
                      <span className="truncate font-medium">{payment.propertyPurpose}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.propertyLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <RoleIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                        {payment.listingRole}
                      </span>
                      <span className="truncate font-medium">{payment.listingName}</span>
                    </div>

                     <div className="flex items-start gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0 mt-[1px]" />
                      <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                        <span className="truncate font-bold text-[#1A2E2A] text-xs">{formatCurrency(payment.amount)}</span>
                        <span className="text-[9px] text-[#5A7D78] truncate">
                          ({formatCurrency(amountBreakdown.base)} + {formatCurrency(amountBreakdown.gst)} GST)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCreditCard className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.paymentRelatedTo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">
                        {new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                   
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewPayment(payment)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditPayment(payment)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(payment.id)}
                      disabled={actionLoading === payment.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === payment.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                  checked={selectedPayments.length === paginatedPayments.length && paginatedPayments.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                />
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyId')}>
                  Property ID {sortField === 'propertyId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-2 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('propertyName')}>
                Name {sortField === 'propertyName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyType')}>
                Type {sortField === 'propertyType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyPurpose')}>
                Purpose {sortField === 'propertyPurpose' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('listingName')}>
                Listing {sortField === 'listingName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('paymentRelatedTo')}>
                Related To {sortField === 'paymentRelatedTo' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('amount')}>
                Amount {sortField === 'amount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('status')}>
                Status {sortField === 'status' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('paymentDate')}>
                Date {sortField === 'paymentDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedPayments.map((payment, index) => {
              const isSelected = selectedPayments.includes(payment.id);
              const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
              const PropTypeIcon = propTypeConfig.icon;
              const statusConfig = STATUS_TYPES[payment.status] || STATUS_TYPES['Pending'];
              const amountBreakdown = getDisplayBreakdown(payment);

              return (
                <div
                  key={payment.id}
                  className={`grid grid-cols-12 gap-1 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectPayment(payment.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                    />
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${propTypeConfig.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <PropTypeIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{payment.propertyId}</span>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{payment.propertyName}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{payment.propertyLocation}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.propertyType}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.propertyPurpose}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <p className="text-[10px] text-[#5A7D78] truncate">{payment.listingRole}</p>
                    <p className="text-[11px] font-medium text-[#1A2E2A] truncate">{payment.listingName}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.paymentRelatedTo}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A2E2A] truncate">{formatCurrency(payment.amount)}</p>
                    <p className="text-[9px] text-[#5A7D78] truncate">
                      ({formatCurrency(amountBreakdown.base)}+{formatCurrency(amountBreakdown.gst)})
                    </p>
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} truncate inline-block max-w-full`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>

                  <div className="col-span-1 min-w-0 flex items-center justify-end gap-1 flex-nowrap">
                    <button
                      type="button"
                      onClick={() => handleViewPayment(payment)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="View"
                    >
                      <FiEye className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditPayment(payment)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0"
                      title="Edit"
                    >
                      <FiEdit className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(payment.id)}
                      disabled={actionLoading === payment.id}
                      className="w-5 h-5 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                      title="Delete"
                    >
                      {actionLoading === payment.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[15px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedPayments.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiHome className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No property payments found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No property payment records have been added yet'}
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
              {Math.min(currentPage * pageSize, filteredPayments.length)} of{' '}
              {filteredPayments.length} payments
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

export default PropertyPaymentDetails;