// src/components/admin/Payments/PaymentsDashboard.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiFileText, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiMail, FiPhone, FiCreditCard, FiClock,
  FiRotateCcw, FiDollarSign, FiTrendingUp, FiCalendar, FiHome,
  FiClipboard, FiShoppingBag, FiKey, FiMap
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat } from 'react-icons/fa';

// ============================================================
// PAYMENT STATUS CONFIG
// ============================================================
const STATUS_TYPES = {
  'Success': {
    icon: FiCheckCircle,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Success'
  },
  'Pending': {
    icon: FiClock,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Pending'
  },
  'Failed': {
    icon: FiXCircle,
    color: 'from-red-600 to-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Failed'
  },
  'Refunded': {
    icon: FiRotateCcw,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Refunded'
  }
};

const ALL_STATUSES = Object.keys(STATUS_TYPES);

// ============================================================
// USER TYPE CONFIG
// ============================================================
const USER_TYPE_CONFIG = {
  'Owner': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Agent': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Builder': { icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Buyer': { icon: FiShoppingBag, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Tenant': { icon: FiKey, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' }
};

const ALL_USER_TYPES = Object.keys(USER_TYPE_CONFIG);

// ============================================================
// SUBSCRIPTION PLANS — vary by user type
// ============================================================
const PLANS_BY_USER_TYPE = {
  'Owner': ['Free', 'Silver', 'Gold', 'Platinum'],
  'Agent': ['Basic', 'Professional', 'Enterprise'],
  'Builder': ['Basic', 'Premium', 'Enterprise'],
  'Property Manager': ['Standard', 'Business', 'Enterprise'],
  'Buyer': ['Basic'],
  'Tenant': ['Basic']
};

const getPlansForUserType = (userType) => PLANS_BY_USER_TYPE[userType] || [];

// Amount charged per user type + plan combination (₹)
const PLAN_AMOUNTS = {
  'Owner': { 'Free': 0, 'Silver': 999, 'Gold': 2999, 'Platinum': 6999 },
  'Agent': { 'Basic': 499, 'Professional': 1999, 'Enterprise': 4999 },
  'Builder': { 'Basic': 999, 'Premium': 3999, 'Enterprise': 7999 },
  'Property Manager': { 'Standard': 799, 'Business': 2499, 'Enterprise': 5999 },
  'Buyer': { 'Basic': 299 },
  'Tenant': { 'Basic': 199 }
};

// ============================================================
// PROPERTY TYPE CONFIG
// ============================================================
const PROPERTY_TYPE_CONFIG = {
  'Individual': { icon: FiUser, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  'Apartment': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Commercial': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Land & Plots': { icon: FiMap, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Hostel': { icon: FaHotel, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
};

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

// ============================================================
// PAYMENT METHOD OPTIONS
// ============================================================
const ALL_PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'Bank Transfer', 'Cash', 'Payment Link', 'Other'];

// ============================================================
// CURRENCY FORMAT HELPER
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

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
    danger: { icon: 'text-red-600', bg: 'bg-red-50', button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500', border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', border: 'border-amber-200' },
    info: { icon: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', border: 'border-blue-200' }
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
// VIEW PAYMENT DETAIL MODAL
// ============================================================
const ViewPaymentDetailModal = ({ payment, show, onClose, onEdit, onDelete }) => {
  if (!payment || !show) return null;

  const statusConfig = STATUS_TYPES[payment.status] || STATUS_TYPES['Pending'];
  const StatusIcon = statusConfig.icon;
  const userTypeConfig = USER_TYPE_CONFIG[payment.userType] || USER_TYPE_CONFIG['Owner'];
  const UserTypeIcon = userTypeConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;

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
            <div className={`w-14 h-14 rounded-2xl ${statusConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${statusConfig.text} shadow-lg`}>
              <StatusIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{payment.payerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>ID: {payment.paymentId}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">{formatCurrency(payment.amount)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <UserTypeIcon className="text-xs" /> {payment.userType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiTag className="text-xs" /> {payment.plan} Plan
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiCreditCard className="text-xs" /> {payment.paymentMethod}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.paymentId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiDollarSign className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Amount</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatCurrency(payment.amount)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.payerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMail className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mail ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A] truncate">{payment.payerEmail}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Phone Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.payerPhone}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">User Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.userType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Subscription Plan</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.plan}</p>
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
                <FiCreditCard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Method</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.paymentMethod}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{statusConfig.label}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Transaction Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(payment.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Description</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.description || 'No description available'}</p>
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
// EDIT PAYMENT MODAL
// ============================================================
const EditPaymentModal = ({ payment, show, onClose, onSave }) => {
  if (!payment || !show) return null;

  const [formData, setFormData] = useState({
    paymentId: '', payerName: '', payerEmail: '', payerPhone: '',
    userType: '', plan: '', propertyType: '',
    amount: '', paymentMethod: '', status: '', transactionDate: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  const planOptions = getPlansForUserType(formData.userType);

  useEffect(() => {
    if (payment) {
      setFormData({
        paymentId: payment.paymentId || '',
        payerName: payment.payerName || '',
        payerEmail: payment.payerEmail || '',
        payerPhone: payment.payerPhone || '',
        userType: payment.userType || '',
        plan: payment.plan || '',
        propertyType: payment.propertyType || '',
        amount: payment.amount || '',
        paymentMethod: payment.paymentMethod || '',
        status: payment.status || 'Pending',
        transactionDate: payment.transactionDate ? payment.transactionDate.split('T')[0] : '',
        description: payment.description || ''
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userType') {
      const plans = getPlansForUserType(value);
      setFormData(prev => ({
        ...prev,
        userType: value,
        plan: plans.includes(prev.plan) ? prev.plan : (plans[0] || '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...payment, ...formData, amount: Number(formData.amount) || 0 });
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
          <h2 className="text-2xl font-bold text-white">Edit Payment</h2>
          <p className="text-white/80 text-sm">Update payment and transaction details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCreditCard className="text-[#00695C]" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment ID</label>
                  <input
                    type="text" name="paymentId" value={formData.paymentId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="PAY-0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Amount (₹) *</label>
                  <input
                    type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payer Name *</label>
                  <input
                    type="text" name="payerName" value={formData.payerName} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter payer name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Mail ID *</label>
                  <input
                    type="email" name="payerEmail" value={formData.payerEmail} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="payer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Phone Number *</label>
                  <input
                    type="text" name="payerPhone" value={formData.payerPhone} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">User Type *</label>
                  <select
                    name="userType" value={formData.userType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select User Type</option>
                    {ALL_USER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Subscription Plan *</label>
                  <select
                    name="plan" value={formData.plan} onChange={handleChange} required
                    disabled={!formData.userType}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none disabled:bg-[#F5F9F8] disabled:cursor-not-allowed"
                  >
                    <option value="">Select Plan</option>
                    {planOptions.map(plan => <option key={plan} value={plan}>{plan}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select
                    name="propertyType" value={formData.propertyType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Property Type</option>
                    {ALL_PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment Method *</label>
                  <select
                    name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Method</option>
                    {ALL_PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Status *</label>
                  <select
                    name="status" value={formData.status} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_STATUSES.map(status => <option key={status} value={status}>{STATUS_TYPES[status].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Transaction Date *</label>
                  <input
                    type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Add a note about this transaction..."
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
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
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
// MAIN COMPONENT
// ============================================================
const PaymentsDashboard = () => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('transactionDate');
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
  const [activeMethod, setActiveMethod] = useState('all');
  const [activeUserType, setActiveUserType] = useState('all');
  const [activePlan, setActivePlan] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0, Success: 0, Pending: 0, Failed: 0, Refunded: 0,
    totalRevenue: 0, monthRevenue: 0, todayRevenue: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, Success: 0, Pending: 0, Failed: 0, Refunded: 0, totalRevenue: 0, monthRevenue: 0, todayRevenue: 0 });
      return;
    }
    const now = new Date();
    const todayStr = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const counts = { total: list.length };
    ALL_STATUSES.forEach(status => {
      counts[status] = list.filter(p => p.status === status).length;
    });

    const successfulPayments = list.filter(p => p.status === 'Success');
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const monthRevenue = successfulPayments
      .filter(p => {
        const d = new Date(p.transactionDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const todayRevenue = successfulPayments
      .filter(p => new Date(p.transactionDate).toDateString() === todayStr)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    setStats({ ...counts, totalRevenue, monthRevenue, todayRevenue });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockPayments = useCallback(() => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma'];
    const methods = ALL_PAYMENT_METHODS;
    const statuses = ALL_STATUSES;
    const userTypes = ALL_USER_TYPES;
    const propertyTypes = ALL_PROPERTY_TYPES;

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 90; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const payerName = `${firstName} ${lastName}`;
      const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
      const plansForType = getPlansForUserType(userType);
      const plan = plansForType[Math.floor(Math.random() * plansForType.length)];
      const baseAmount = (PLAN_AMOUNTS[userType] && PLAN_AMOUNTS[userType][plan] !== undefined) ? PLAN_AMOUNTS[userType][plan] : 499;
      const amount = baseAmount === 0 ? 0 : baseAmount + Math.floor(Math.random() * 3) * 100;
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod = methods[Math.floor(Math.random() * methods.length)];

      // Spread dates over the last 75 days; force a handful onto today for demo revenue
      let txDate;
      if (i % 9 === 0) {
        txDate = new Date(now);
      } else {
        const daysAgo = Math.floor(Math.random() * 75);
        txDate = new Date(now);
        txDate.setDate(txDate.getDate() - daysAgo);
      }

      list.push({
        id: `pay_${i}`,
        paymentId: `PAY-${String(i).padStart(4, '0')}`,
        payerName,
        payerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        payerPhone: `+91 ${String(9000000000 + Math.floor(Math.random() * 999999999)).slice(0, 10)}`,
        userType,
        plan,
        propertyType,
        amount,
        paymentMethod,
        status,
        transactionDate: txDate.toISOString(),
        description: `${userType} - ${plan} plan subscription payment via ${paymentMethod}.`
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
      console.error('Error generating mock payments:', error);
    }
  }, [generateMockPayments]);

  // ============ FILTER PAYMENTS ============
  const filterPayments = useCallback(() => {
    try {
      let filtered = [...payments];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          (p.payerName && p.payerName.toLowerCase().includes(query)) ||
          (p.paymentId && p.paymentId.toLowerCase().includes(query)) ||
          (p.payerEmail && p.payerEmail.toLowerCase().includes(query)) ||
          (p.payerPhone && p.payerPhone.toLowerCase().includes(query)) ||
          (p.paymentMethod && p.paymentMethod.toLowerCase().includes(query)) ||
          (p.plan && p.plan.toLowerCase().includes(query)) ||
          (p.status && p.status.toLowerCase().includes(query)) ||
          (p.userType && p.userType.toLowerCase().includes(query)) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(query)) ||
          (String(p.amount).includes(query))
        );
      }

      if (activeStatus !== 'all') {
        filtered = filtered.filter(p => p.status === activeStatus);
      }

      if (activeMethod !== 'all') {
        filtered = filtered.filter(p => p.paymentMethod === activeMethod);
      }

      if (activeUserType !== 'all') {
        filtered = filtered.filter(p => p.userType === activeUserType);
      }

      if (activePlan !== 'all') {
        filtered = filtered.filter(p => p.plan === activePlan);
      }

      if (activePropertyType !== 'all') {
        filtered = filtered.filter(p => p.propertyType === activePropertyType);
      }

      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activeMethod !== 'all') count++;
      if (activeUserType !== 'all') count++;
      if (activePlan !== 'all') count++;
      if (activePropertyType !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'amount') {
          aVal = Number(aVal); bVal = Number(bVal);
        } else if (sortField === 'transactionDate') {
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
      console.error('Error filtering payments:', error);
    }
  }, [payments, searchQuery, activeStatus, activeMethod, activeUserType, activePlan, activePropertyType, sortField, sortDirection]);

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

  // ============ HANDLE SELECT PAYMENT ============
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
    setToast({ message: `Payment "${updatedPayment.paymentId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE PAYMENT WITH CONFIRMATION ============
  const handleDeletePayment = useCallback((paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Payment',
      message: `Are you sure you want to delete payment "${payment.paymentId}" (${formatCurrency(payment.amount)})?`,
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
          setToast({ message: `Deleted payment "${payment.paymentId}"`, type: 'warning' });
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
    setActiveMethod('all');
    setActiveUserType('all');
    setActivePlan('all');
    setActivePropertyType('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // When the User Type filter changes, reset the Plan filter (plans differ per user type)
  const handleUserTypeChange = useCallback((value) => {
    setActiveUserType(value);
    setActivePlan('all');
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveMethod('all');
    setActiveUserType('all');
    setActivePlan('all');
    setActivePropertyType('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
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

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredPayments.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredPayments.map(p => ({
        'Payment ID': p.paymentId || '',
        'Payer Name': p.payerName || '',
        'Mail ID': p.payerEmail || '',
        'Phone Number': p.payerPhone || '',
        'User Type': p.userType || '',
        'Plan': p.plan || '',
        'Property Type': p.propertyType || '',
        'Amount': p.amount || 0,
        'Payment Method': p.paymentMethod || '',
        'Status': p.status || '',
        'Transaction Date': p.transactionDate ? new Date(p.transactionDate).toLocaleDateString('en-IN') : '',
        'Description': p.description || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
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
  const statusOptions = ALL_STATUSES.map(status => ({ value: status, label: STATUS_TYPES[status].label }));
  const methodOptions = ALL_PAYMENT_METHODS.map(method => ({ value: method, label: method }));
  const userTypeOptions = ALL_USER_TYPES.map(type => ({ value: type, label: type }));
  const planOptions = useMemo(() => {
    if (activeUserType === 'all') return [];
    return getPlansForUserType(activeUserType).map(plan => ({ value: plan, label: plan }));
  }, [activeUserType]);
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(type => ({ value: type, label: type }));

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
        <ViewPaymentDetailModal
          payment={viewingPayment}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingPayment(null); }}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
        />
      )}

      {showEditModal && editingPayment && (
        <EditPaymentModal
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
                Payment Dashboard
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
              <span>Track subscription payments across owners, agents, builders, managers, buyers &amp; tenants</span>
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

      {/* Stats Section — 8 tiles: counts + revenue */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <StatCard
                icon={<FiCreditCard className="text-white text-sm" />}
                title="Total Payments"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={filterCount === 0}
                onClick={handleTotalClick}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Successful Payments"
                value={stats.Success}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={60}
                isActive={activeStatus === 'Success'}
                onClick={() => handleStatusClick('Success')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending Payments"
                value={stats.Pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={120}
                isActive={activeStatus === 'Pending'}
                onClick={() => handleStatusClick('Pending')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Failed Payments"
                value={stats.Failed}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={180}
                isActive={activeStatus === 'Failed'}
                onClick={() => handleStatusClick('Failed')}
              />
              <StatCard
                icon={<FiRotateCcw className="text-white text-sm" />}
                title="Refunded Payments"
                value={stats.Refunded}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={240}
                isActive={activeStatus === 'Refunded'}
                onClick={() => handleStatusClick('Refunded')}
              />
              <StatCard
                icon={<FiDollarSign className="text-white text-sm" />}
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={300}
                isActive={false}
              />
              <StatCard
                icon={<FiTrendingUp className="text-white text-sm" />}
                title="This Month Revenue"
                value={formatCurrency(stats.monthRevenue)}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={360}
                isActive={false}
              />
              <StatCard
                icon={<FiCalendar className="text-white text-sm" />}
                title="Today's Revenue"
                value={formatCurrency(stats.todayRevenue)}
                color="bg-gradient-to-br from-pink-600 to-pink-400"
                delay={420}
                isActive={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Dropdowns */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, payment ID, email, phone, plan, user type, property type..."
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
            <FilterDropdown
              label="User Type"
              options={userTypeOptions}
              value={activeUserType}
              onChange={handleUserTypeChange}
              icon={FiUser}
              allLabel="All User Types"
            />

            {/* Plan options depend on the currently selected User Type */}
            <FilterDropdown
              label="Plan"
              options={planOptions}
              value={activePlan}
              onChange={setActivePlan}
              icon={FiTag}
              allLabel={activeUserType === 'all' ? 'Select a User Type first' : 'All Plans'}
              disabled={activeUserType === 'all'}
            />

            <FilterDropdown
              label="Property"
              options={propertyTypeOptions}
              value={activePropertyType}
              onChange={setActivePropertyType}
              icon={FiHome}
              allLabel="All Property Types"
            />

            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={activeStatus}
              onChange={setActiveStatus}
              icon={FiActivity}
              allLabel="All Statuses"
            />

            <FilterDropdown
              label="Method"
              options={methodOptions}
              value={activeMethod}
              onChange={setActiveMethod}
              icon={FiCreditCard}
              allLabel="All Methods"
            />

            {filterCount > 0 && (
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
              const statusConfig = STATUS_TYPES[payment.status] || STATUS_TYPES['Pending'];
              const StatusIcon = statusConfig.icon;
              const userTypeConfig = USER_TYPE_CONFIG[payment.userType] || USER_TYPE_CONFIG['Owner'];
              const UserTypeIcon = userTypeConfig.icon;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
              const PropTypeIcon = propTypeConfig.icon;

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
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <StatusIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{payment.payerName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{payment.paymentId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ===== Payment fields ===== */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-bold text-[#1A2E2A]">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.payerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <UserTypeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>
                        {payment.userType}
                      </span>
                      <span className="truncate font-medium">{payment.plan} Plan</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCreditCard className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <PropTypeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                        {payment.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">
                        {new Date(payment.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {/* ===== End payment fields ===== */}

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
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('paymentId')}>
                  ID {sortField === 'paymentId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-2 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('payerName')}>
                Payer {sortField === 'payerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('userType')}>
                User Type {sortField === 'userType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('plan')}>
                Plan {sortField === 'plan' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyType')}>
                Property {sortField === 'propertyType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('amount')}>
                Amount {sortField === 'amount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('paymentMethod')}>
                Method {sortField === 'paymentMethod' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('status')}>
                Status {sortField === 'status' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('transactionDate')}>
                Date {sortField === 'transactionDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedPayments.map((payment, index) => {
              const isSelected = selectedPayments.includes(payment.id);
              const statusConfig = STATUS_TYPES[payment.status] || STATUS_TYPES['Pending'];
              const StatusIcon = statusConfig.icon;

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
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <StatusIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{payment.paymentId}</span>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{payment.payerName}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{payment.payerEmail}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.userType}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.plan}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.propertyType}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-bold text-[#1A2E2A] truncate">
                    {formatCurrency(payment.amount)}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.paymentMethod}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} truncate inline-block max-w-full`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {new Date(payment.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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
              <FiCreditCard className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No payments found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No payment records have been added yet'}
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

export default PaymentsDashboard;