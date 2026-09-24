// src/components/admin/Payments/ManualPayment.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiCreditCard, FiClock,
  FiRotateCcw, FiDollarSign, FiCalendar, FiHome,
  FiClipboard, FiLayers, FiMapPin, FiSmartphone, FiFileText, FiImage,
  FiUploadCloud
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaUniversity, FaMobileAlt, FaMoneyBillWave, FaWallet, FaLink } from 'react-icons/fa';

// ============================================================
// ROLES CONFIG
// ============================================================
const ROLE_CONFIG = {
  'Owner':            { icon: FaHome,      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400' },
  'Agent':            { icon: FiBriefcase, bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-600 to-blue-400' },
  'Builder':          { icon: FaHardHat,   bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  gradient: 'from-orange-600 to-orange-400' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  gradient: 'from-purple-600 to-purple-400' }
};

const ALL_ROLES = Object.keys(ROLE_CONFIG);

// ============================================================
// PROPERTY TYPES CONFIG
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
// PAYMENT METHOD CONFIG
// ============================================================
const PAYMENT_METHOD_CONFIG = {
  'UPI':           { icon: FaMobileAlt,     bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  gradient: 'from-violet-600 to-violet-400' },
  'Credit Card':   { icon: FiCreditCard,    bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  gradient: 'from-indigo-600 to-indigo-400' },
  'Debit Card':    { icon: FiCreditCard,    bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200',    gradient: 'from-cyan-600 to-cyan-400' },
  'Net Banking':   { icon: FaUniversity,    bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-600 to-blue-400' },
  'Wallet':        { icon: FaWallet,        bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    gradient: 'from-teal-600 to-teal-400' },
  'Bank Transfer': { icon: FaUniversity,    bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     gradient: 'from-sky-600 to-sky-400' },
  'Cash':          { icon: FaMoneyBillWave, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400' },
  'Payment Link':  { icon: FaLink,          bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  gradient: 'from-purple-600 to-purple-400' },
  'Other':         { icon: FiCreditCard,    bg: 'bg-gray-50',    text: 'text-gray-700',    border: 'border-gray-200',    gradient: 'from-gray-600 to-gray-400' }
};

const ALL_PAYMENT_METHODS = Object.keys(PAYMENT_METHOD_CONFIG);

// ============================================================
// PAYMENT PURPOSES
// ============================================================
const ALL_PAYMENT_PURPOSES = [
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
// VERIFICATION STATUS CONFIG
// ============================================================
const STATUS_TYPES = {
  'Verified':     { icon: FiCheckCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Verified' },
  'Pending':      { icon: FiClock,       color: 'from-amber-600 to-amber-400',     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Pending' },
  'Rejected':     { icon: FiXCircle,     color: 'from-red-600 to-red-400',         bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Rejected' },
  'Under Review': { icon: FiActivity,    color: 'from-blue-600 to-blue-400',       bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Under Review' }
};

const ALL_STATUSES = Object.keys(STATUS_TYPES);

// ============================================================
// HELPERS
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const formatDate = (dateStr, opts) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' });
};

// Robust detector that handles:
//  • data URLs (data:image/png;base64,...) — even without extension
//  • blob URLs
//  • plain http(s) URLs with extension
//  • plain http(s) URLs without extension (defaults to 'image' if it
//    looks like an image host, otherwise 'other')
const getProofKind = (url) => {
  if (!url) return null;
  const lower = String(url).toLowerCase();

  // Data URLs — check the declared MIME type first
  if (lower.startsWith('data:')) {
    if (lower.startsWith('data:image/')) return 'image';
    if (lower.startsWith('data:application/pdf')) return 'pdf';
    return 'other';
  }

  // Blob URLs — we can't detect from URL, default to image
  if (lower.startsWith('blob:')) return 'image';

  // Extract the pathname (ignore query / hash) and test the extension
  const path = lower.split('?')[0].split('#')[0];
  if (path.endsWith('.pdf')) return 'pdf';
  if (/\.(jpe?g|png|gif|webp|bmp|svg|avif)$/i.test(path)) return 'image';

  // Fallback: if it *looks* like an image hosting URL, treat as image
  if (/(images|img|photo|image)/.test(path)) return 'image';

  return 'other';
};

// Detects the file extension for the download filename
const getExtension = (url, fallback = 'file') => {
  if (!url) return fallback;
  const lower = String(url).toLowerCase();
  if (lower.startsWith('data:')) {
    if (lower.startsWith('data:application/pdf')) return 'pdf';
    if (lower.startsWith('data:image/png')) return 'png';
    if (lower.startsWith('data:image/jpeg') || lower.startsWith('data:image/jpg')) return 'jpg';
    if (lower.startsWith('data:image/gif')) return 'gif';
    if (lower.startsWith('data:image/webp')) return 'webp';
    if (lower.startsWith('data:image/svg')) return 'svg';
    return fallback;
  }
  const path = lower.split('?')[0].split('#')[0];
  const match = path.match(/\.([a-z0-9]+)$/);
  return match ? match[1] : fallback;
};

// Triggers a download for both data URLs and http(s) URLs.
// Cross-origin http(s) URLs need a fetch → blob → object URL dance
// because the download attribute is ignored on cross-origin links.
const triggerDownload = async (url, filename) => {
  if (!url) return;
  try {
    // Data URLs: simple anchor with download attribute works
    if (url.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // http(s) / blob: fetch and convert to blob
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Cleanup after a short delay so the browser can start the download
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1500);
  } catch (err) {
    // Fallback — open in new tab if fetch fails (CORS)
    console.warn('Download failed, opening in new tab:', err);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// ============================================================
// TOAST
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
// PROOF PREVIEW MODAL  — shows image / pdf inline + working download
// ============================================================
const ProofPreviewModal = ({ proofUrl, onClose, onDownloaded }) => {
  const [downloading, setDownloading] = useState(false);

  if (!proofUrl) return null;

  const kind = getProofKind(proofUrl);
  const ext = getExtension(proofUrl, kind === 'pdf' ? 'pdf' : 'jpg');
  const filename = `payment_proof.${ext}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await triggerDownload(proofUrl, filename);
      if (onDownloaded) onDownloaded();
    } finally {
      // Small delay so the spinner is visible on fast downloads
      setTimeout(() => setDownloading(false), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            {kind === 'pdf' ? <FiFileText className="text-white text-lg" /> : <FiImage className="text-white text-lg" />}
            <h3 className="text-lg font-bold text-white">Payment Proof Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 bg-[#F5F9F8] flex items-center justify-center min-h-[320px]">
          {kind === 'image' && (
            <img
              src={proofUrl}
              alt="Payment Proof"
              className="max-w-full max-h-[65vh] rounded-2xl shadow-lg border border-[#E8F0EE] bg-white object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML =
                  '<div class="text-center text-sm text-[#5A7D78]">Unable to load image. Use Download below.</div>';
              }}
            />
          )}

          {kind === 'pdf' && (
            <object
              data={proofUrl}
              type="application/pdf"
              className="w-full h-[65vh] rounded-2xl border border-[#E8F0EE] bg-white"
            >
              <iframe
                src={proofUrl}
                title="Payment Proof PDF"
                className="w-full h-[65vh] rounded-2xl border border-[#E8F0EE] bg-white"
              />
            </object>
          )}

          {kind === 'other' && (
            <div className="text-center py-10">
              <FiFileText className="text-5xl text-[#B5C9C5] mx-auto mb-3" />
              <p className="text-sm text-[#5A7D78]">Preview not available for this file type.</p>
              <p className="text-xs text-[#B5C9C5] mt-1">Use the Download button below to save it.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white border-t border-[#E8F0EE] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed border border-[#E8F0EE]"
          >
            {downloading ? <FiRefreshCw className="animate-spin" /> : <FiDownload />}
            {downloading ? 'Downloading...' : 'Download'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW MANUAL PAYMENT DETAIL MODAL
// ============================================================
const ViewManualPaymentDetailModal = ({ payment, show, onClose, onEdit, onDelete, onViewProof }) => {
  if (!payment || !show) return null;

  const methodConfig = PAYMENT_METHOD_CONFIG[payment.paymentMethod] || PAYMENT_METHOD_CONFIG['UPI'];
  const MethodIcon = methodConfig.icon;
  const roleConfig = ROLE_CONFIG[payment.role] || ROLE_CONFIG['Owner'];
  const RoleIcon = roleConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;
  const statusConfig = STATUS_TYPES[payment.verificationStatus] || STATUS_TYPES['Pending'];
  const StatusIcon = statusConfig.icon;

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
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${methodConfig.gradient} border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg`}>
              <MethodIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{payment.customerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Ref: {payment.referenceNumber}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">{formatCurrency(payment.paymentAmount)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiSmartphone className="text-xs" /> {payment.mobileNumber}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiHash className="text-xs" /> {payment.propertyId}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <RoleIcon className="text-xs" /> {payment.role}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.customerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiSmartphone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mobile Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.mobileNumber}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.propertyId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PropTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className={`text-sm font-bold inline-block px-2 py-0.5 rounded-full ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                {payment.propertyType}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <RoleIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Role</h4>
              </div>
              <p className={`text-sm font-bold inline-block px-2 py-0.5 rounded-full ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                {payment.role}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Purpose</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.paymentPurpose}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiDollarSign className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Amount</h4>
              </div>
              <p className="text-sm font-bold text-[#00695C]">{formatCurrency(payment.paymentAmount)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <MethodIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Method</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.paymentMethod}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatDate(payment.paymentDate)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiClipboard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Reference Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.referenceNumber}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Collected By</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.collectedBy || '—'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Verification Status</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{statusConfig.label}</p>
            </div>

            {/* Payment Proof — clickable link */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiImage className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Proof</h4>
              </div>
              {payment.paymentProof ? (
                <button
                  type="button"
                  onClick={() => onViewProof && onViewProof(payment.paymentProof)}
                  className="text-sm font-bold text-[#00695C] underline hover:text-[#004D40] transition-colors flex items-center gap-2"
                >
                  <FiEye className="text-xs" /> View Proof
                </button>
              ) : (
                <p className="text-sm text-[#B5C9C5] italic">No proof uploaded</p>
              )}
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Admin Notes</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{payment.adminNotes || '—'}</p>
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
// EDIT MANUAL PAYMENT MODAL
// ============================================================
const EditManualPaymentModal = ({ payment, show, onClose, onSave }) => {
  if (!payment || !show) return null;

  const [formData, setFormData] = useState({
    customerName: '', mobileNumber: '', propertyId: '', propertyType: '',
    role: '', paymentPurpose: '', paymentAmount: '', paymentMethod: '',
    paymentDate: '', referenceNumber: '', paymentProof: '',
    paymentProofName: '', collectedBy: '', verificationStatus: '', adminNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (payment) {
      setFormData({
        customerName: payment.customerName || '',
        mobileNumber: payment.mobileNumber || '',
        propertyId: payment.propertyId || '',
        propertyType: payment.propertyType || '',
        role: payment.role || '',
        paymentPurpose: payment.paymentPurpose || '',
        paymentAmount: payment.paymentAmount || '',
        paymentMethod: payment.paymentMethod || '',
        paymentDate: payment.paymentDate ? payment.paymentDate.split('T')[0] : '',
        referenceNumber: payment.referenceNumber || '',
        paymentProof: payment.paymentProof || '',
        paymentProofName: payment.paymentProofName || '',
        collectedBy: payment.collectedBy || '',
        verificationStatus: payment.verificationStatus || 'Pending',
        adminNotes: payment.adminNotes || ''
      });
    }
  }, [payment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Upload PDF or image → data URL (works with no backend)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    if (!isPdf && !isImage) {
      alert('Please upload a PDF or image file (JPG, PNG, etc.)');
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      alert('File too large. Max 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        paymentProof: reader.result,
        paymentProofName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...payment,
        ...formData,
        paymentAmount: Number(formData.paymentAmount) || 0
      });
      setLoading(false);
      onClose();
    }, 700);
  };

  const inputCls = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none";
  const labelCls = "block text-xs font-medium text-[#5A7D78] mb-1";

  const proofKind = getProofKind(formData.paymentProof);

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
          <h2 className="text-2xl font-bold text-white">Edit Manual Payment</h2>
          <p className="text-white/80 text-sm">Update manual payment details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" /> Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Customer Name *</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className={inputCls} placeholder="Enter customer name" />
                </div>
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={inputCls} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className={labelCls}>Property ID *</label>
                  <input type="text" name="propertyId" value={formData.propertyId} onChange={handleChange} required className={inputCls} placeholder="PROP-0001" />
                </div>
                <div>
                  <label className={labelCls}>Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Property Type</option>
                    {ALL_PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Role *</label>
                  <select name="role" value={formData.role} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Role</option>
                    {ALL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
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
                  <select name="paymentPurpose" value={formData.paymentPurpose} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Purpose</option>
                    {ALL_PAYMENT_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Amount (₹) *</label>
                  <input type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleChange} required min="0" className={inputCls} placeholder="Enter amount" />
                </div>
                <div>
                  <label className={labelCls}>Payment Method *</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Method</option>
                    {ALL_PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Date *</label>
                  <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required className={inputCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Reference Number *</label>
                  <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} required className={inputCls} placeholder="TXN123456789" />
                </div>

                {/* Payment Proof — Upload (PDF / JPG / PNG) */}
                <div className="md:col-span-2">
                  <label className={labelCls}>Payment Proof (PDF or Image)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-4 py-2.5 bg-white border-2 border-dashed border-[#B5C9C5] rounded-xl hover:border-[#00695C] hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium text-[#5A7D78] hover:text-[#00695C] flex items-center justify-center gap-2"
                    >
                      <FiUploadCloud className="text-lg" />
                      {formData.paymentProof ? 'Change File' : 'Upload PDF / Image'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {formData.paymentProof && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setProofPreviewUrl(formData.paymentProof)}
                          className="px-3 py-2.5 bg-[#E8F4F2] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-sm font-medium flex items-center gap-2"
                        >
                          {proofKind === 'pdf' ? <FiFileText /> : <FiImage />} Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, paymentProof: '', paymentProofName: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="px-3 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
                        >
                          <FiX /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                  {formData.paymentProof && (
                    <p className="text-[11px] text-[#5A7D78] mt-1.5 truncate">
                      Attached:{' '}
                      <span className="font-semibold text-[#00695C]">
                        {formData.paymentProofName || (proofKind === 'pdf' ? 'PDF Document' : 'Image')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiClipboard className="text-[#00695C]" /> Verification & Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Collected By *</label>
                  <input
                    type="text"
                    name="collectedBy"
                    value={formData.collectedBy}
                    onChange={handleChange}
                    required
                    className={inputCls}
                    placeholder="Enter collector name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Verification Status *</label>
                  <select name="verificationStatus" value={formData.verificationStatus} onChange={handleChange} required className={inputCls}>
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_TYPES[s].label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Admin Notes</label>
                  <textarea name="adminNotes" value={formData.adminNotes} onChange={handleChange} rows="3" className={inputCls} placeholder="Enter admin notes..." />
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

      {/* Proof preview modal (from edit modal) */}
      {proofPreviewUrl && (
        <ProofPreviewModal
          proofUrl={proofPreviewUrl}
          onClose={() => setProofPreviewUrl(null)}
        />
      )}
    </div>
  );
};

// ============================================================
// STAT CARD
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
// FILTER DROPDOWN
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
// MAIN COMPONENT — Manual Payment
// ============================================================
const ManualPayment = () => {
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
  const [activeMethod, setActiveMethod] = useState('all');
  const [activePurpose, setActivePurpose] = useState('all');
  const [activeRole, setActiveRole] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // Proof preview (from grid/view)
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0, Verified: 0, Pending: 0, Rejected: 0, 'Under Review': 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, Verified: 0, Pending: 0, Rejected: 0, 'Under Review': 0 });
      return;
    }
    const counts = { total: list.length };
    ALL_STATUSES.forEach(status => {
      counts[status] = list.filter(p => p.verificationStatus === status).length;
    });
    setStats(counts);
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockPayments = useCallback(() => {
    const customerNames = [
      'Arun Kumar', 'Priya Sharma', 'Karthik Reddy', 'Divya Iyer', 'Suresh Nair',
      'Meena Menon', 'Ravi Rao', 'Anitha Pillai', 'Vikram Singh', 'Neha Gupta',
      'Amit Patel', 'Sneha Joshi', 'Rahul Verma', 'Pooja Desai', 'Sanjay Bhat',
      'Lakshmi Narayan', 'Manoj Kumar', 'Deepa Reddy', 'Arjun Das', 'Kavya Nair'
    ];
    const mobileNumbers = [
      '+91 98765 43210', '+91 87654 32109', '+91 76543 21098', '+91 65432 10987',
      '+91 54321 09876', '+91 43210 98765', '+91 32109 87654', '+91 21098 76543',
      '+91 10987 65432', '+91 99887 76655', '+91 88776 65544', '+91 77665 54433',
      '+91 66554 43322', '+91 55443 32211', '+91 44332 21100', '+91 33221 10099',
      '+91 22110 09988', '+91 11009 98877', '+91 90098 87766', '+91 80987 76655'
    ];
    const collectedByNames = [
      'Arun Kumar', 'Priya Sharma', 'Karthik Reddy', 'Divya Iyer',
      'Suresh Nair', 'Meena Menon', 'Ravi Rao', 'Anitha Pillai'
    ];
    const notesOptions = [
      'Payment verified against bank statement.',
      'Customer confirmed receipt.',
      'Awaiting bank confirmation.',
      'Documents pending from customer.',
      'Follow-up required.',
      ''
    ];

    // Reliable image proofs (Unsplash returns direct jpg URLs)
    const sampleImageProofs = [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=800&auto=format&fit=crop'
    ];
    // A reliable PDF that CORS-allows embedding
    const samplePdfProof = 'https://pdfobject.com/pdf/sample.pdf';

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 80; i++) {
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const mobileNumber = mobileNumbers[Math.floor(Math.random() * mobileNumbers.length)];
      const propertyId = `PROP-${String(Math.floor(Math.random() * 80) + 1).padStart(4, '0')}`;
      const propertyType = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
      const role = ALL_ROLES[Math.floor(Math.random() * ALL_ROLES.length)];
      const paymentPurpose = ALL_PAYMENT_PURPOSES[Math.floor(Math.random() * ALL_PAYMENT_PURPOSES.length)];
      const paymentMethod = ALL_PAYMENT_METHODS[Math.floor(Math.random() * ALL_PAYMENT_METHODS.length)];
      const collectedBy = collectedByNames[Math.floor(Math.random() * collectedByNames.length)];
      const verificationStatus = ALL_STATUSES[Math.floor(Math.random() * ALL_STATUSES.length)];

      let baseAmount = 999;
      if (paymentPurpose === 'Property Listing Fee') baseAmount = 799;
      else if (paymentPurpose === 'Property Promotion') baseAmount = 1499;
      else if (paymentPurpose === 'Featured Listing') baseAmount = 1999;
      else if (paymentPurpose === 'Subscription') baseAmount = 2999;
      else if (paymentPurpose === 'Lead Purchase') baseAmount = 499;
      else if (paymentPurpose === 'Contact Access') baseAmount = 299;
      else if (paymentPurpose === 'Agent Subscription') baseAmount = 1999;
      else if (paymentPurpose === 'Builder Subscription') baseAmount = 3999;
      else if (paymentPurpose === 'Owner Subscription') baseAmount = 999;
      else if (paymentPurpose === 'Property Management Service') baseAmount = 4999;
      else if (paymentPurpose === 'Loan Service') baseAmount = 2499;
      const paymentAmount = baseAmount + Math.floor(Math.random() * 5) * 200;

      let payDate;
      if (i % 9 === 0) {
        payDate = new Date(now);
      } else {
        const daysAgo = Math.floor(Math.random() * 75);
        payDate = new Date(now);
        payDate.setDate(payDate.getDate() - daysAgo);
      }

      const referenceNumber = `TXN${String(Math.floor(Math.random() * 900000000) + 100000000)}`;

      // ~70% have proof (mix of image / pdf), the rest empty
      let paymentProof = '';
      let paymentProofName = '';
      const r = Math.random();
      if (r > 0.3) {
        if (Math.random() > 0.7) {
          paymentProof = samplePdfProof;
          paymentProofName = 'bank_statement.pdf';
        } else {
          paymentProof = sampleImageProofs[Math.floor(Math.random() * sampleImageProofs.length)];
          paymentProofName = 'payment_screenshot.jpg';
        }
      }

      const adminNotes = notesOptions[Math.floor(Math.random() * notesOptions.length)];

      list.push({
        id: `mpay_${i}`,
        customerName,
        mobileNumber,
        propertyId,
        propertyType,
        role,
        paymentPurpose,
        paymentAmount,
        paymentMethod,
        paymentDate: payDate.toISOString(),
        referenceNumber,
        paymentProof,
        paymentProofName,
        collectedBy,
        verificationStatus,
        adminNotes
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
      console.error('Error generating mock manual payments:', error);
    }
  }, [generateMockPayments]);

  // ============ FILTER PAYMENTS ============
  const filterPayments = useCallback(() => {
    try {
      let filtered = [...payments];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          (p.customerName && p.customerName.toLowerCase().includes(query)) ||
          (p.mobileNumber && p.mobileNumber.toLowerCase().includes(query)) ||
          (p.propertyId && p.propertyId.toLowerCase().includes(query)) ||
          (p.propertyType && p.propertyType.toLowerCase().includes(query)) ||
          (p.role && p.role.toLowerCase().includes(query)) ||
          (p.paymentPurpose && p.paymentPurpose.toLowerCase().includes(query)) ||
          (p.paymentMethod && p.paymentMethod.toLowerCase().includes(query)) ||
          (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
          (p.collectedBy && p.collectedBy.toLowerCase().includes(query)) ||
          (p.verificationStatus && p.verificationStatus.toLowerCase().includes(query)) ||
          (String(p.paymentAmount).includes(query))
        );
      }

      if (activeStatus !== 'all')       filtered = filtered.filter(p => p.verificationStatus === activeStatus);
      if (activeMethod !== 'all')       filtered = filtered.filter(p => p.paymentMethod === activeMethod);
      if (activePurpose !== 'all')      filtered = filtered.filter(p => p.paymentPurpose === activePurpose);
      if (activeRole !== 'all')         filtered = filtered.filter(p => p.role === activeRole);
      if (activePropertyType !== 'all') filtered = filtered.filter(p => p.propertyType === activePropertyType);

      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activeMethod !== 'all') count++;
      if (activePurpose !== 'all') count++;
      if (activeRole !== 'all') count++;
      if (activePropertyType !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'paymentAmount') {
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
      console.error('Error filtering manual payments:', error);
    }
  }, [payments, searchQuery, activeStatus, activeMethod, activePurpose, activeRole, activePropertyType, sortField, sortDirection]);

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
    setToast({ message: `Manual payment for "${updatedPayment.customerName}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE ============
  const handleDeletePayment = useCallback((paymentId) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Manual Payment',
      message: `Are you sure you want to delete payment for "${payment.customerName}" (${formatCurrency(payment.paymentAmount)})?`,
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
          setToast({ message: `Deleted manual payment for "${payment.customerName}"`, type: 'warning' });
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
    setActivePurpose('all');
    setActiveRole('all');
    setActivePropertyType('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveMethod('all');
    setActivePurpose('all');
    setActiveRole('all');
    setActivePropertyType('all');
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
      const data = filteredPayments.map(p => ({
        'Customer Name': p.customerName || '',
        'Mobile Number': p.mobileNumber || '',
        'Property ID': p.propertyId || '',
        'Property Type': p.propertyType || '',
        'Role': p.role || '',
        'Payment Purpose': p.paymentPurpose || '',
        'Payment Amount': p.paymentAmount || 0,
        'Payment Method': p.paymentMethod || '',
        'Payment Date': p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN') : '',
        'Reference Number': p.referenceNumber || '',
        'Payment Proof': p.paymentProof ? 'Yes' : 'No',
        'Collected By': p.collectedBy || '',
        'Verification Status': p.verificationStatus || '',
        'Admin Notes': p.adminNotes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manual_payments_${new Date().toISOString().split('T')[0]}.csv`;
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
  const methodOptions = ALL_PAYMENT_METHODS.map(m => ({ value: m, label: m }));
  const purposeOptions = ALL_PAYMENT_PURPOSES.map(p => ({ value: p, label: p }));
  const roleOptions = ALL_ROLES.map(r => ({ value: r, label: r }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(t => ({ value: t, label: t }));

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
        <ViewManualPaymentDetailModal
          payment={viewingPayment}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingPayment(null); }}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
          onViewProof={(url) => setProofPreviewUrl(url)}
        />
      )}

      {showEditModal && editingPayment && (
        <EditManualPaymentModal
          payment={editingPayment}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingPayment(null); }}
          onSave={handleSavePayment}
        />
      )}

      {/* Proof Preview Modal (from view / grid) */}
      {proofPreviewUrl && (
        <ProofPreviewModal
          proofUrl={proofPreviewUrl}
          onClose={() => setProofPreviewUrl(null)}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Manual Payment
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
              <span>Track all manually collected payments with verification status</span>
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

      {/* Stats Section */}
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
                title="Verified"
                value={stats.Verified}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={60}
                isActive={activeStatus === 'Verified'}
                onClick={() => handleStatusClick('Verified')}
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
                title="Rejected"
                value={stats.Rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={180}
                isActive={activeStatus === 'Rejected'}
                onClick={() => handleStatusClick('Rejected')}
              />
              <StatCard
                icon={<FiActivity className="text-white text-sm" />}
                title="Under Review"
                value={stats['Under Review']}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={240}
                isActive={activeStatus === 'Under Review'}
                onClick={() => handleStatusClick('Under Review')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by customer name, mobile, property ID, role, reference, method, status..."
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

        <div className="flex items-center gap-2 flex-wrap mt-5">
          <FilterDropdown
            label="Property Type"
            options={propertyTypeOptions}
            value={activePropertyType}
            onChange={setActivePropertyType}
            icon={FiHome}
            allLabel="All Types"
          />
          <FilterDropdown
            label="Role"
            options={roleOptions}
            value={activeRole}
            onChange={setActiveRole}
            icon={FiUser}
            allLabel="All Roles"
          />
          <FilterDropdown
            label="Method"
            options={methodOptions}
            value={activeMethod}
            onChange={setActiveMethod}
            icon={FiCreditCard}
            allLabel="All Methods"
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
              const methodConfig = PAYMENT_METHOD_CONFIG[payment.paymentMethod] || PAYMENT_METHOD_CONFIG['UPI'];
              const MethodIcon = methodConfig.icon;
              const roleConfig = ROLE_CONFIG[payment.role] || ROLE_CONFIG['Owner'];
              const RoleIcon = roleConfig.icon;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[payment.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
              const PropTypeIcon = propTypeConfig.icon;
              const statusConfig = STATUS_TYPES[payment.verificationStatus] || STATUS_TYPES['Pending'];

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
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${methodConfig.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <MethodIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{payment.customerName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[11px] font-medium text-[#5A7D78]">{payment.mobileNumber}</p>
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
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <RoleIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                        {payment.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.paymentPurpose}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0 mt-[1px]" />
                      <span className="truncate font-bold text-[#1A2E2A] text-xs">{formatCurrency(payment.paymentAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <MethodIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${methodConfig.bg} ${methodConfig.text} border ${methodConfig.border}`}>
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{formatDate(payment.paymentDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiClipboard className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.referenceNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{payment.collectedBy}</span>
                    </div>

                    {/* Payment Proof — clickable link in card */}
                    {payment.paymentProof && (
                      <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                        <FiImage className="text-[#00695C] flex-shrink-0" />
                        <button
                          type="button"
                          onClick={() => setProofPreviewUrl(payment.paymentProof)}
                          className="text-[#00695C] underline hover:text-[#004D40] font-semibold truncate"
                        >
                          View Proof
                        </button>
                      </div>
                    )}
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
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('customerName')}>
                  Customer {sortField === 'customerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('mobileNumber')}>
                Mobile {sortField === 'mobileNumber' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('propertyId')}>
                Property ID {sortField === 'propertyId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('role')}>
                Role {sortField === 'role' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('paymentPurpose')}>
                Purpose {sortField === 'paymentPurpose' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('paymentAmount')}>
                Amount {sortField === 'paymentAmount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('paymentMethod')}>
                Method {sortField === 'paymentMethod' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('referenceNumber')}>
                Reference {sortField === 'referenceNumber' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('collectedBy')}>
                Collected By {sortField === 'collectedBy' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('verificationStatus')}>
                Status {sortField === 'verificationStatus' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedPayments.map((payment, index) => {
              const isSelected = selectedPayments.includes(payment.id);
              const methodConfig = PAYMENT_METHOD_CONFIG[payment.paymentMethod] || PAYMENT_METHOD_CONFIG['UPI'];
              const MethodIcon = methodConfig.icon;
              const roleConfig = ROLE_CONFIG[payment.role] || ROLE_CONFIG['Owner'];
              const statusConfig = STATUS_TYPES[payment.verificationStatus] || STATUS_TYPES['Pending'];

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
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${methodConfig.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <MethodIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#1A2E2A] truncate">{payment.customerName}</span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.mobileNumber}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-bold text-[#00695C] truncate">
                    {payment.propertyId}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border} truncate inline-block max-w-full`}>
                      {payment.role}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.paymentPurpose}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-bold text-[#1A2E2A] truncate">
                    {formatCurrency(payment.paymentAmount)}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.paymentMethod}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.referenceNumber}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {payment.collectedBy}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} truncate inline-block max-w-full`}>
                      {statusConfig.label}
                    </span>
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
            <h3 className="text-xl font-bold text-[#1A2E2A]">No manual payments found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No manual payment records have been added yet'}
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

export default ManualPayment;