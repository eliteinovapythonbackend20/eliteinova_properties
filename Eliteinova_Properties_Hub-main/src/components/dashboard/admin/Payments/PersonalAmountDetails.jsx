// src/components/admin/Payments/PersonalAmountDetails.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiFileText, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiMail, FiPhone, FiCreditCard, FiClock,
  FiRotateCcw, FiDollarSign, FiTrendingUp, FiCalendar, FiHome,
  FiClipboard, FiShoppingBag, FiKey, FiMap, FiLayers, FiPackage,
  FiPercent, FiServer, FiGlobe, FiShield, FiAward, FiTarget,
  FiUsers, FiHome as FiHomeIcon, FiMinusCircle, FiPlusCircle,
  FiBarChart2, FiPieChart, FiSliders, FiCpu, FiBox, FiInbox
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat } from 'react-icons/fa';

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
// AMOUNT FIELD CONFIG
// ============================================================
const AMOUNT_FIELDS = [
  { key: 'baseAmount', label: 'Base Amount', icon: FiDollarSign, color: 'from-[#00695C] to-[#26A69A]', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { key: 'discount', label: 'Discount', icon: FiMinusCircle, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { key: 'tax', label: 'Tax / GST', icon: FiPercent, color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { key: 'gatewayCharges', label: 'Gateway Charges', icon: FiServer, color: 'from-purple-600 to-purple-400', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { key: 'platformFee', label: 'Platform Fee', icon: FiLayers, color: 'from-cyan-600 to-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  { key: 'commission', label: 'Commission', icon: FiTrendingUp, color: 'from-indigo-600 to-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { key: 'refundAmount', label: 'Refund Amount', icon: FiRotateCcw, color: 'from-rose-600 to-rose-400', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { key: 'totalPaidAmount', label: 'Total Paid Amount', icon: FiCreditCard, color: 'from-teal-600 to-teal-400', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  { key: 'netAmount', label: 'Net Amount', icon: FiAward, color: 'from-[#00695C] to-[#26A69A]', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
];

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
// VIEW PERSONAL AMOUNT DETAIL MODAL
// ============================================================
const ViewPersonalAmountDetailModal = ({ record, show, onClose, onEdit, onDelete }) => {
  if (!record || !show) return null;

  const userTypeConfig = USER_TYPE_CONFIG[record.userType] || USER_TYPE_CONFIG['Owner'];
  const UserTypeIcon = userTypeConfig.icon;

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
            <div className={`w-14 h-14 rounded-2xl ${userTypeConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${userTypeConfig.text} shadow-lg`}>
              <UserTypeIcon />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-white">{record.userName}</h2>
            <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>
                {record.userType}
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span>Record ID: {record.id}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full"></span>
              <span className="font-semibold">{formatCurrency(record.netAmount)}</span>
            </p>
          </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiUser className="text-xs" /> {record.userName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiHash className="text-xs" /> {record.transactionId}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiCalendar className="text-xs" /> {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* User Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">User Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{record.userName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">User Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{record.userType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Transaction ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{record.transactionId}</p>
            </div>

            {/* Amount Fields */}
            {AMOUNT_FIELDS.map(field => {
              const Icon = field.icon;
              const value = record[field.key];
              const isNegative = field.key === 'discount' || field.key === 'refundAmount';
              return (
                <div key={field.key} className={`rounded-2xl p-4 ${field.bg} border ${field.border}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`text-sm ${field.text}`} />
                    <h4 className={`text-xs font-semibold uppercase tracking-wider ${field.text}`}>{field.label}</h4>
                  </div>
                  <p className={`text-sm font-bold ${isNegative ? 'text-rose-700' : 'text-[#1A2E2A]'}`}>
                    {isNegative && value > 0 ? '-' : ''}{formatCurrency(value)}
                  </p>
                </div>
              );
            })}
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
              onClick={() => { if (onEdit) { onEdit(record); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(record.id); } }}
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
// EDIT PERSONAL AMOUNT DETAIL MODAL
// ============================================================
const EditPersonalAmountDetailModal = ({ record, show, onClose, onSave }) => {
  if (!record || !show) return null;

  const [formData, setFormData] = useState({
    id: '', transactionId: '', userName: '', userType: '', date: '',
    baseAmount: '', discount: '', tax: '', gatewayCharges: '',
    platformFee: '', commission: '', refundAmount: '',
    totalPaidAmount: '', netAmount: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        id: record.id || '',
        transactionId: record.transactionId || '',
        userName: record.userName || '',
        userType: record.userType || '',
        date: record.date ? record.date.split('T')[0] : '',
        baseAmount: record.baseAmount || '',
        discount: record.discount || '',
        tax: record.tax || '',
        gatewayCharges: record.gatewayCharges || '',
        platformFee: record.platformFee || '',
        commission: record.commission || '',
        refundAmount: record.refundAmount || '',
        totalPaidAmount: record.totalPaidAmount || '',
        netAmount: record.netAmount || ''
      });
    }
  }, [record]);

  // Auto-calculate derived fields
  const recalc = (updated) => {
    const base = Number(updated.baseAmount) || 0;
    const disc = Number(updated.discount) || 0;
    const tx = Number(updated.tax) || 0;
    const gateway = Number(updated.gatewayCharges) || 0;
    const platform = Number(updated.platformFee) || 0;
    const comm = Number(updated.commission) || 0;
    const refund = Number(updated.refundAmount) || 0;

    // Total Paid = Base - Discount + Tax + Gateway Charges
    const totalPaid = base - disc + tx + gateway;

    // Net Amount = Total Paid - Platform Fee - Commission - Refund Amount
    const net = totalPaid - platform - comm - refund;

    return {
      ...updated,
      totalPaidAmount: totalPaid,
      netAmount: net
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => recalc({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...record,
        ...formData,
        baseAmount: Number(formData.baseAmount) || 0,
        discount: Number(formData.discount) || 0,
        tax: Number(formData.tax) || 0,
        gatewayCharges: Number(formData.gatewayCharges) || 0,
        platformFee: Number(formData.platformFee) || 0,
        commission: Number(formData.commission) || 0,
        refundAmount: Number(formData.refundAmount) || 0,
        totalPaidAmount: Number(formData.totalPaidAmount) || 0,
        netAmount: Number(formData.netAmount) || 0
      });
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
          <h2 className="text-2xl font-bold text-white">Edit Personal Amount Detail</h2>
          <p className="text-white/80 text-sm">Update the breakdown of amounts for this record</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Transaction ID</label>
                  <input
                    type="text" name="transactionId" value={formData.transactionId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Date</label>
                  <input
                    type="date" name="date" value={formData.date} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">User Name</label>
                  <input
                    type="text" name="userName" value={formData.userName} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">User Type</label>
                  <select
                    name="userType" value={formData.userType} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select User Type</option>
                    {ALL_USER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" />
                Amount Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {AMOUNT_FIELDS.map(field => {
                  const Icon = field.icon;
                  const isCalculated = field.key === 'totalPaidAmount' || field.key === 'netAmount';
                  return (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-[#5A7D78] mb-1 flex items-center gap-1">
                        <Icon className="text-[#00695C] text-xs" /> {field.label}
                      </label>
                      <input
                        type="number"
                        name={field.key}
                        value={formData[field.key]}
                        onChange={handleChange}
                        readOnly={isCalculated}
                        min="0"
                        className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all duration-300 ${
                          isCalculated
                            ? 'bg-[#F0F5F4] border-[#E8F0EE] text-[#1A2E2A] font-semibold cursor-not-allowed'
                            : 'bg-white border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 text-[#1A2E2A]'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 bg-white rounded-xl border border-[#E8F0EE]">
                <p className="text-xs text-[#5A7D78] flex items-center gap-2">
                  <FiInfo className="text-[#00695C] text-xs" />
                  <span>
                    <strong className="text-[#1A2E2A]">Total Paid</strong> = Base − Discount + Tax + Gateway Charges.
                    {' '}
                    <strong className="text-[#1A2E2A]">Net Amount</strong> = Total Paid − Platform Fee − Commission − Refund Amount.
                  </span>
                </p>
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
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
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
const PersonalAmountDetails = () => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeUserType, setActiveUserType] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    totalBaseAmount: 0,
    totalDiscount: 0,
    totalTax: 0,
    totalGatewayCharges: 0,
    totalPlatformFee: 0,
    totalCommission: 0,
    totalRefundAmount: 0,
    totalPaidAmount: 0,
    totalNetAmount: 0,
    byUserType: {}
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      const empty = {
        total: 0,
        totalBaseAmount: 0, totalDiscount: 0, totalTax: 0,
        totalGatewayCharges: 0, totalPlatformFee: 0, totalCommission: 0,
        totalRefundAmount: 0, totalPaidAmount: 0, totalNetAmount: 0,
        byUserType: {}
      };
      setStats(empty);
      return;
    }

    const byUserType = {};
    ALL_USER_TYPES.forEach(type => {
      byUserType[type] = {
        count: 0,
        baseAmount: 0,
        discount: 0,
        tax: 0,
        gatewayCharges: 0,
        platformFee: 0,
        commission: 0,
        refundAmount: 0,
        totalPaidAmount: 0,
        netAmount: 0
      };
    });

    let totalBaseAmount = 0, totalDiscount = 0, totalTax = 0;
    let totalGatewayCharges = 0, totalPlatformFee = 0, totalCommission = 0;
    let totalRefundAmount = 0, totalPaidAmount = 0, totalNetAmount = 0;

    list.forEach(r => {
      const base = Number(r.baseAmount) || 0;
      const disc = Number(r.discount) || 0;
      const tx = Number(r.tax) || 0;
      const gc = Number(r.gatewayCharges) || 0;
      const pf = Number(r.platformFee) || 0;
      const comm = Number(r.commission) || 0;
      const ref = Number(r.refundAmount) || 0;
      const paid = Number(r.totalPaidAmount) || 0;
      const net = Number(r.netAmount) || 0;

      totalBaseAmount += base;
      totalDiscount += disc;
      totalTax += tx;
      totalGatewayCharges += gc;
      totalPlatformFee += pf;
      totalCommission += comm;
      totalRefundAmount += ref;
      totalPaidAmount += paid;
      totalNetAmount += net;

      if (byUserType[r.userType]) {
        const u = byUserType[r.userType];
        u.count += 1;
        u.baseAmount += base;
        u.discount += disc;
        u.tax += tx;
        u.gatewayCharges += gc;
        u.platformFee += pf;
        u.commission += comm;
        u.refundAmount += ref;
        u.totalPaidAmount += paid;
        u.netAmount += net;
      }
    });

    setStats({
      total: list.length,
      totalBaseAmount, totalDiscount, totalTax,
      totalGatewayCharges, totalPlatformFee, totalCommission,
      totalRefundAmount, totalPaidAmount, totalNetAmount,
      byUserType
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockRecords = useCallback(() => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma'];

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 120; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const userName = `${firstName} ${lastName}`;
      const userType = ALL_USER_TYPES[Math.floor(Math.random() * ALL_USER_TYPES.length)];

      // Generate date over last 90 days
      let date;
      if (i % 12 === 0) {
        date = new Date(now);
      } else {
        const daysAgo = Math.floor(Math.random() * 90);
        date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
      }

      // Generate amounts
      const baseAmount = Math.floor(Math.random() * 9000) + 1000; // 1000-10000
      const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 500) + 50 : 0; // 0 or 50-550
      const tax = Math.round((baseAmount - discount) * 0.18); // 18% GST
      const gatewayCharges = Math.round((baseAmount - discount) * 0.02); // 2% gateway
      const platformFee = Math.round((baseAmount - discount) * 0.05); // 5% platform
      const commission = Math.round((baseAmount - discount) * 0.03); // 3% commission
      const refundAmount = Math.random() > 0.85 ? Math.floor(Math.random() * 2000) + 100 : 0; // 0 or 100-2100

      // Derived
      const totalPaidAmount = baseAmount - discount + tax + gatewayCharges;
      const netAmount = totalPaidAmount - platformFee - commission - refundAmount;

      list.push({
        id: `pad_${i}`,
        transactionId: `TXN-${String(i).padStart(5, '0')}`,
        userName,
        userType,
        date: date.toISOString(),
        baseAmount,
        discount,
        tax,
        gatewayCharges,
        platformFee,
        commission,
        refundAmount,
        totalPaidAmount,
        netAmount
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockRecords = generateMockRecords();
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
    } catch (error) {
      console.error('Error generating mock records:', error);
    }
  }, [generateMockRecords]);

  // ============ FILTER RECORDS ============
  const filterRecords = useCallback(() => {
    try {
      let filtered = [...records];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          (r.transactionId && r.transactionId.toLowerCase().includes(query)) ||
          (r.userName && r.userName.toLowerCase().includes(query)) ||
          (r.userType && r.userType.toLowerCase().includes(query)) ||
          (String(r.baseAmount).includes(query)) ||
          (String(r.totalPaidAmount).includes(query)) ||
          (String(r.netAmount).includes(query))
        );
      }

      if (activeUserType !== 'all') {
        filtered = filtered.filter(r => r.userType === activeUserType);
      }

      let count = 0;
      if (activeUserType !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';

        const numericFields = ['baseAmount', 'discount', 'tax', 'gatewayCharges', 'platformFee', 'commission', 'refundAmount', 'totalPaidAmount', 'netAmount'];
        if (numericFields.includes(sortField)) {
          aVal = Number(aVal); bVal = Number(bVal);
        } else if (sortField === 'date') {
          aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime();
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredRecords(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering records:', error);
    }
  }, [records, searchQuery, activeUserType, sortField, sortDirection]);

  useEffect(() => { filterRecords(); }, [filterRecords]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredRecords.slice(start, end);
  }, [filteredRecords, currentPage, pageSize]);

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
    if (selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(paginatedRecords.map(r => r.id));
    }
  }, [selectedRecords, paginatedRecords]);

  // ============ HANDLE SELECT RECORD ============
  const handleSelectRecord = useCallback((recordId) => {
    setSelectedRecords(prev => prev.includes(recordId) ? prev.filter(id => id !== recordId) : [...prev, recordId]);
  }, []);

  // ============ VIEW / EDIT ============
  const handleViewRecord = useCallback((record) => {
    setViewingRecord(record);
    setShowViewModal(true);
  }, []);

  const handleEditRecord = useCallback((record) => {
    setEditingRecord(record);
    setShowEditModal(true);
  }, []);

  const handleSaveRecord = useCallback((updatedRecord) => {
    setRecords(prev => {
      const updated = prev.map(r => r.id === updatedRecord.id ? updatedRecord : r);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Record "${updatedRecord.transactionId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE RECORD WITH CONFIRMATION ============
  const handleDeleteRecord = useCallback((recordId) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Amount Record',
      message: `Are you sure you want to delete record "${record.transactionId}" for ${record.userName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(recordId);
        setTimeout(() => {
          setRecords(prev => {
            const updated = prev.filter(r => r.id !== recordId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted record "${record.transactionId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [records, computeStats]);

  // ============ STAT CLICK HANDLERS ============
  const handleUserTypeClick = useCallback((userType) => {
    setActiveUserType(prev => (prev === userType ? 'all' : userType));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveUserType('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveUserType('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockRecords = generateMockRecords();
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockRecords]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredRecords.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredRecords.map(r => ({
        'Transaction ID': r.transactionId || '',
        'User Name': r.userName || '',
        'User Type': r.userType || '',
        'Date': r.date ? new Date(r.date).toLocaleDateString('en-IN') : '',
        'Base Amount': r.baseAmount || 0,
        'Discount': r.discount || 0,
        'Tax/GST': r.tax || 0,
        'Gateway Charges': r.gatewayCharges || 0,
        'Platform Fee': r.platformFee || 0,
        'Commission': r.commission || 0,
        'Refund Amount': r.refundAmount || 0,
        'Total Paid Amount': r.totalPaidAmount || 0,
        'Net Amount': r.netAmount || 0
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal_amount_details_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredRecords.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredRecords]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedRecords.length === 0) {
      setToast({ message: 'Please select records first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Records',
      message: `Are you sure you want to delete ${selectedRecords.length} selected record(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedRecords);
          const count = records.filter(r => selectedIds.has(r.id)).length;
          const updated = records.filter(r => !selectedIds.has(r.id));
          setRecords(updated);
          computeStats(updated);
          setSelectedRecords([]);
          setActionLoading(null);
          setToast({ message: `${count} record(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedRecords, records, computeStats]);

  // ============ FILTER OPTIONS ============
  const userTypeOptions = ALL_USER_TYPES.map(type => ({ value: type, label: type }));

  // ============ LIST VIEW COLUMN CONFIG ============
  const LIST_COLUMNS = [
    { key: 'transactionId', label: 'Txn ID', sortable: true },
    { key: 'userName', label: 'User', sortable: true },
    { key: 'userType', label: 'User Type', sortable: true },
    { key: 'baseAmount', label: 'Base Amount', sortable: true },
    { key: 'discount', label: 'Discount', sortable: true },
    { key: 'tax', label: 'Tax/GST', sortable: true },
    { key: 'gatewayCharges', label: 'Gateway Charges', sortable: true },
    { key: 'platformFee', label: 'Platform Fee', sortable: true },
    { key: 'commission', label: 'Commission', sortable: true },
    { key: 'refundAmount', label: 'Refund Amount', sortable: true },
    { key: 'totalPaidAmount', label: 'Total Paid', sortable: true },
    { key: 'netAmount', label: 'Net Amount', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
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

      {showViewModal && viewingRecord && (
        <ViewPersonalAmountDetailModal
          record={viewingRecord}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingRecord(null); }}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
        />
      )}

      {showEditModal && editingRecord && (
        <EditPersonalAmountDetailModal
          record={editingRecord}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingRecord(null); }}
          onSave={handleSaveRecord}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Personal Amount Details
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredRecords.length} Records
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track base amount, discounts, taxes, platform fees, and net amounts per user</span>
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

      {/* Stats Section — User Type Breakdown */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            

            {/* User-type summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Records"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeUserType === 'all'}
                onClick={handleTotalClick}
              />
              {ALL_USER_TYPES.map((userType, index) => {
                const config = USER_TYPE_CONFIG[userType];
                const Icon = config.icon;
                const data = stats.byUserType[userType] || { count: 0 };
                return (
                  <StatCard
                    key={userType}
                    icon={<Icon className="text-white text-sm" />}
                    title={userType}
                    value={data.count}
                    color={`bg-gradient-to-br ${config.bg.replace('bg-', 'from-').replace('50', '600')} to-${config.bg.replace('bg-', '').replace('50', '400')}`}
                    delay={60 + index * 60}
                    isActive={activeUserType === userType}
                    onClick={() => handleUserTypeClick(userType)}
                  />
                );
              })}
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
              placeholder="Search by transaction ID, user name, user type, amount..."
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
              onChange={setActiveUserType}
              icon={FiUser}
              allLabel="All User Types"
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

        {selectedRecords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedRecords.length}</span> record(s) selected
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
                onClick={() => setSelectedRecords([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Records Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedRecords.map((record, index) => {
              const isSelected = selectedRecords.includes(record.id);
              const userTypeConfig = USER_TYPE_CONFIG[record.userType] || USER_TYPE_CONFIG['Owner'];
              const UserTypeIcon = userTypeConfig.icon;

              return (
                <div
                  key={record.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRecord(record.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <UserTypeIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{record.userName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{record.transactionId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>
                            {record.userType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">Base: <strong className="text-[#1A2E2A]">{formatCurrency(record.baseAmount)}</strong></span>
                      {record.discount > 0 && (
                        <span className="text-[10px] text-rose-600">-{formatCurrency(record.discount)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiPercent className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">Tax: {formatCurrency(record.tax)}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="font-medium">Gateway: {formatCurrency(record.gatewayCharges)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiLayers className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">Platform: {formatCurrency(record.platformFee)}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="font-medium">Commission: {formatCurrency(record.commission)}</span>
                    </div>
                    {record.refundAmount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-rose-600 flex-wrap">
                        <FiRotateCcw className="flex-shrink-0" />
                        <span className="font-medium">Refund: -{formatCurrency(record.refundAmount)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiCreditCard className="text-[#00695C] flex-shrink-0" />
                      <span className="font-bold text-[#1A2E2A]">Total Paid: {formatCurrency(record.totalPaidAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiAward className="text-[#00695C] flex-shrink-0" />
                      <span className="font-bold text-[#00695C]">Net Amount: {formatCurrency(record.netAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewRecord(record)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRecord(record)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      disabled={actionLoading === record.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === record.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-[#F5F9F8] border-b border-[#E8F0EE]">
                    <th className="px-2 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                    </th>
                    {LIST_COLUMNS.map(col => (
                      <th
                        key={col.key}
                        onClick={() => col.sortable && handleSort(col.key)}
                        className="px-2 py-3 text-left text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider cursor-pointer hover:text-[#00695C] transition-colors select-none whitespace-nowrap"
                        title={col.label}
                      >
                        {col.label} {sortField === col.key && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                    ))}
                    <th className="px-2 py-3 text-right text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record) => {
                    const isSelected = selectedRecords.includes(record.id);
                    const userTypeConfig = USER_TYPE_CONFIG[record.userType] || USER_TYPE_CONFIG['Owner'];
                    const UserTypeIcon = userTypeConfig.icon;

                    return (
                      <tr
                        key={record.id}
                        className={`border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors duration-200 ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                      >
                        <td className="px-2 py-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRecord(record.id)}
                            className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                          />
                        </td>
                        <td className="px-2 py-2.5">
                          <span className="text-xs font-bold text-[#00695C] whitespace-nowrap">{record.transactionId}</span>
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <UserTypeIcon className={`text-xs ${userTypeConfig.text}`} />
                            <span className="text-sm font-bold text-[#1A2E2A] whitespace-nowrap">{record.userName}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>
                            {record.userType}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-xs font-medium text-[#1A2E2A] whitespace-nowrap">{formatCurrency(record.baseAmount)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-rose-600 whitespace-nowrap">{record.discount > 0 ? `-${formatCurrency(record.discount)}` : formatCurrency(0)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-[#1A2E2A] whitespace-nowrap">{formatCurrency(record.tax)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-[#1A2E2A] whitespace-nowrap">{formatCurrency(record.gatewayCharges)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-[#1A2E2A] whitespace-nowrap">{formatCurrency(record.platformFee)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-[#1A2E2A] whitespace-nowrap">{formatCurrency(record.commission)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-rose-600 whitespace-nowrap">{record.refundAmount > 0 ? `-${formatCurrency(record.refundAmount)}` : formatCurrency(0)}</td>
                        <td className="px-2 py-2.5 text-xs font-bold text-[#1A2E2A] whitespace-nowrap">{formatCurrency(record.totalPaidAmount)}</td>
                        <td className="px-2 py-2.5 text-xs font-bold text-[#00695C] whitespace-nowrap">{formatCurrency(record.netAmount)}</td>
                        <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewRecord(record)}
                              className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110"
                              title="View"
                            >
                              <FiEye className="text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditRecord(record)}
                              className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110"
                              title="Edit"
                            >
                              <FiEdit className="text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(record.id)}
                              disabled={actionLoading === record.id}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50"
                              title="Delete"
                            >
                              {actionLoading === record.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-sm" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {paginatedRecords.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiFileText className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No records found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No personal amount records have been added yet'}
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
              {Math.min(currentPage * pageSize, filteredRecords.length)} of{' '}
              {filteredRecords.length} records
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

export default PersonalAmountDetails;