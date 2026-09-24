// src/components/admin/Payments/RefundManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiCreditCard, FiClock,
  FiRotateCcw, FiDollarSign, FiCalendar, FiHome,
  FiClipboard, FiLayers, FiMapPin, FiFileText, FiCheck,
  FiSend, FiThumbsDown, FiUserCheck, FiMessageSquare, FiSettings,
  FiPlus, FiPercent, FiSmartphone, FiLink, FiMoreHorizontal
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaUndo } from 'react-icons/fa';

// ============================================================
// REFUND STATUS CONFIG
// ============================================================
const REFUND_STATUS_CONFIG = {
  'Refund Requested': { icon: FiSend,        color: 'from-slate-600 to-slate-400',   bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200',   label: 'Refund Requested' },
  'Under Review':     { icon: FiActivity,    color: 'from-amber-600 to-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Under Review' },
  'Approved':         { icon: FiCheckCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Approved' },
  'Processing':       { icon: FiRefreshCw,   color: 'from-blue-600 to-blue-400',     bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Processing' },
  'Completed':        { icon: FiCheck,       color: 'from-teal-600 to-teal-400',     bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',    label: 'Completed' },
  'Rejected':         { icon: FiXCircle,     color: 'from-red-600 to-red-400',       bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Rejected' }
};

const ALL_REFUND_STATUSES = Object.keys(REFUND_STATUS_CONFIG);

// ============================================================
// REFUND METHOD CONFIG
// ============================================================
const REFUND_METHOD_CONFIG = {
  'UPI':           { icon: FiSmartphone,     bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Credit Card':   { icon: FiCreditCard,     bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200' },
  'Debit Card':    { icon: FiCreditCard,     bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  'Net Banking':   { icon: FiHome,           bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200' },
  'Wallet':        { icon: FiDollarSign,     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  'Bank Transfer': { icon: FiBriefcase,      bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
  'Cash':          { icon: FiDollarSign,     bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200' },
  'Payment Link':  { icon: FiLink,           bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' },
  'Other':         { icon: FiMoreHorizontal, bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' }
};

const ALL_REFUND_METHODS = Object.keys(REFUND_METHOD_CONFIG);

// ============================================================
// REFUND REASON OPTIONS
// ============================================================
const ALL_REFUND_REASONS = [
  'Duplicate Payment',
  'Service Not Rendered',
  'Property Not As Described',
  'Booking Cancelled',
  'Subscription Cancelled',
  'Accidental Purchase',
  'Payment Error',
  'Fraudulent Transaction',
  'Customer Request',
  'Other'
];

// ============================================================
// APPROVED BY OPTIONS
// ============================================================
const ALL_APPROVERS = [
  'Admin - Rajesh Kumar',
  'Admin - Priya Nair',
  'Manager - Suresh Menon',
  'Finance - Anita Desai',
  'Super Admin - Vikram Rao',
  'Pending Approval'
];

// ============================================================
// GLOBAL REFUND POLICY (day-based, 90 days)
// ============================================================
const DEFAULT_REFUND_POLICY = {
  gstRatePercent: 18,
  windowDays: 90,
  tiers: [
    { id: 'tier-1', dayFrom: 0,  dayTo: 7,    baseRefundPercent: 100, label: 'GST-Only Deduction',      note: 'Base refunded, GST retained (0–7 days)',        color: 'emerald' },
    { id: 'tier-2', dayFrom: 7,  dayTo: 15,   baseRefundPercent: 90,  label: 'Early Refund Window',     note: '10% cut on base + GST retained (7–15 days)',     color: 'teal' },
    { id: 'tier-3', dayFrom: 15, dayTo: 30,   baseRefundPercent: 75,  label: 'Standard Refund Window',  note: '25% cut on base + GST retained (15–30 days)',    color: 'amber' },
    { id: 'tier-4', dayFrom: 30, dayTo: 45,   baseRefundPercent: 50,  label: 'Late Refund Window',      note: '50% cut on base + GST retained (30–45 days)',    color: 'orange' },
    { id: 'tier-5', dayFrom: 45, dayTo: 60,   baseRefundPercent: 35,  label: 'Extended Refund Window',  note: '65% cut on base + GST retained (45–60 days)',    color: 'rose' },
    { id: 'tier-6', dayFrom: 60, dayTo: 90,   baseRefundPercent: 15,  label: 'Final Refund Window',     note: '85% cut on base + GST retained (60–90 days)',    color: 'red' },
    { id: 'tier-7', dayFrom: 90, dayTo: null, baseRefundPercent: 0,   label: 'Refund Window Closed',    note: 'No refund allowed after 90 days',                color: 'red' }
  ]
};

// ============================================================
// SAFE DAY HELPERS — never return undefined
// ============================================================
const isTierOpenEnded = (t) => {
  const v = t?.dayTo;
  return v === null || v === undefined || v === '' || Number.isNaN(Number(v));
};

const safeDayFrom = (t) => {
  const v = Number(t?.dayFrom);
  return Number.isFinite(v) ? v : 0;
};

const safeDayTo = (t) => {
  const v = Number(t?.dayTo);
  return Number.isFinite(v) ? v : safeDayFrom(t);
};

// Short: "0–7d", "7–15d", … "90d+"
const fmtDayRangeShort = (t) => {
  const from = safeDayFrom(t);
  if (isTierOpenEnded(t)) return `${from}d+`;
  return `${from}–${safeDayTo(t)}d`;
};

// Long: "Day 0–7", "Day 7–15", … "Day 90+"
const fmtDayRangeLong = (t) => {
  const from = safeDayFrom(t);
  if (isTierOpenEnded(t)) return `Day ${from}+`;
  return `Day ${from}–${safeDayTo(t)}`;
};

// Word: "0–7 days", "7–15 days", … "From day 90 onwards"
const fmtDayRangeWord = (t) => {
  const from = safeDayFrom(t);
  if (isTierOpenEnded(t)) return `From day ${from} onwards`;
  return `${from}–${safeDayTo(t)} days`;
};

// Note fallback
const fmtNoteFallback = (t) => {
  const pct = Number(t?.baseRefundPercent) || 0;
  const cut = 100 - pct;
  return `${pct}% of base refunded · ${cut}% day-cut + GST retained (${fmtDayRangeWord(t)})`;
};

// Resolve which tier applies for a given number of DAYS elapsed.
const resolvePolicyTier = (policy, days) => {
  const tiers = (policy && policy.tiers && policy.tiers.length) ? policy.tiers : DEFAULT_REFUND_POLICY.tiers;
  for (const t of tiers) {
    const to = isTierOpenEnded(t) ? Infinity : Number(t.dayTo);
    if (days <= to) return t;
  }
  return tiers[tiers.length - 1];
};

// ============================================================
// CURRENCY FORMAT HELPER
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

// ============================================================
// DAYS/HOURS ELAPSED FORMATTER (e.g. "45d 6h" or "0d 3h")
// ============================================================
const formatElapsed = (totalDays, extraHours = 0) => {
  if (totalDays >= 1) return `${totalDays}d ${extraHours}h`;
  return `${extraHours}h`;
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
// VIEW REFUND DETAIL MODAL (day-based)
// ============================================================
const ViewRefundDetailModal = ({ refund, show, onClose, onEdit, onDelete, policy, onOpenPolicy }) => {
  if (!refund || !show) return null;

  const activePolicy = policy || DEFAULT_REFUND_POLICY;
  const policyTiers = (activePolicy.tiers && activePolicy.tiers.length) ? activePolicy.tiers : DEFAULT_REFUND_POLICY.tiers;
  const policyWindowDays = Number(activePolicy.windowDays || DEFAULT_REFUND_POLICY.windowDays);

  const statusConfig = REFUND_STATUS_CONFIG[refund.refundStatus] || REFUND_STATUS_CONFIG['Refund Requested'];
  const StatusIcon = statusConfig.icon;
  const methodConfig = REFUND_METHOD_CONFIG[refund.refundMethod] || REFUND_METHOD_CONFIG['UPI'];
  const MethodIcon = methodConfig.icon;

  const refundDateObj = new Date(refund.refundDate);
  const originalDateObj = refund.originalDate
    ? new Date(refund.originalDate)
    : new Date(refundDateObj.getTime() - (refund.daysSinceOriginal ? refund.daysSinceOriginal * 86400000 : 3 * 86400000));

  const msElapsed = Math.max(0, refundDateObj - originalDateObj);
  const daysElapsed = Math.floor(msElapsed / 86400000);
  const extraHoursElapsed = Math.floor((msElapsed % 86400000) / 3600000);
  const daysLeftInWindow = Math.max(0, policyWindowDays - daysElapsed);

  const elapsedLabel = formatElapsed(daysElapsed, extraHoursElapsed);

  const GST_RATE = Number(activePolicy.gstRatePercent || 0) / 100;
  const originalAmount = Number(refund.originalAmount || 0);
  const gstBase = Math.round(originalAmount / (1 + GST_RATE));
  const gstComponent = originalAmount - gstBase;

  const matchedTier = resolvePolicyTier(activePolicy, daysElapsed);
  const tier = {
    tier: fmtDayRangeLong(matchedTier),
    window: fmtDayRangeWord(matchedTier),
    baseRefundPercent: Number(matchedTier.baseRefundPercent),
    timeCutPercent: 100 - Number(matchedTier.baseRefundPercent),
    label: matchedTier.label,
    color: matchedTier.color || 'slate',
    note: matchedTier.note
  };

  const calculatedRefund = Math.round((gstBase * tier.baseRefundPercent) / 100);
  const refundAmount = Number(refund.refundAmount || calculatedRefund);
  const deductionAmount = Math.max(0, originalAmount - refundAmount);
  const deductionPercent = originalAmount > 0 ? ((deductionAmount / originalAmount) * 100).toFixed(1) : '0.0';
  const refundPercent = originalAmount > 0 ? ((refundAmount / originalAmount) * 100).toFixed(1) : '0.0';

  const timeCutAmount = Math.round((gstBase * tier.timeCutPercent) / 100);
  const totalDeduction = gstComponent + timeCutAmount;

  const isRejected = refund.refundStatus === 'Rejected';
  const isExpired = daysElapsed > policyWindowDays;
  const isGstOnlyTier = policyTiers.length > 0 && matchedTier.id === policyTiers[0].id;

  const timelineSteps = [
    { key: 'Refund Requested', label: 'Requested',  icon: FiSend },
    { key: 'Under Review',     label: 'Review',     icon: FiActivity },
    { key: 'Approved',         label: 'Approved',   icon: FiCheckCircle },
    { key: 'Processing',       label: 'Processing', icon: FiRefreshCw },
    { key: 'Completed',        label: 'Completed',  icon: FiCheck }
  ];
  const currentStatusIndex = ALL_REFUND_STATUSES.indexOf(refund.refundStatus);
  const isRejectedStatus = refund.refundStatus === 'Rejected';
  const isOverdue = daysElapsed > policyWindowDays && !['Completed', 'Rejected'].includes(refund.refundStatus);

  const bannerColor = isRejected || isExpired
    ? { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', subtext: 'text-red-700', iconBg: 'bg-red-100 text-red-600', icon: FiXCircle }
    : isGstOnlyTier
      ? { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', subtext: 'text-emerald-700', iconBg: 'bg-emerald-100 text-emerald-600', icon: FiCheckCircle }
      : { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', subtext: 'text-amber-700', iconBg: 'bg-amber-100 text-amber-600', icon: FiInfo };

  const BannerIcon = bannerColor.icon;
  const dayProgressPct = Math.min(100, (daysElapsed / policyWindowDays) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statusConfig.color} border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg`}>
              <FaUndo />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{refund.customerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Refund ID: {refund.refundRequestId}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">{formatCurrency(refundAmount)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiHash className="text-xs" /> {refund.transactionId}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <MethodIcon className="text-xs" /> {refund.refundMethod}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiClock className="text-xs" /> {elapsedLabel} after payment
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">

          <div className={`rounded-2xl p-5 mb-5 border-2 ${bannerColor.bg} ${bannerColor.border}`}>
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bannerColor.iconBg}`}>
                <BannerIcon className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-bold mb-1 ${bannerColor.text}`}>
                  {isRejected
                    ? 'Refund Rejected — No Amount Returned'
                    : isExpired
                      ? `Refund Window Closed — ${elapsedLabel} elapsed`
                      : isGstOnlyTier
                        ? `GST-Only Deduction — Base refunded, GST retained`
                        : `Partial Refund — ${refundPercent}% returned (${tier.label})`}
                </h3>
                <p className={`text-xs leading-relaxed ${bannerColor.subtext}`}>
                  {`Customer paid on ${originalDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. `}
                  {`Refund requested on ${refundDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — `}
                  {`${elapsedLabel} elapsed. `}
                  {isRejected
                    ? `Request was rejected, so no amount was returned.`
                    : isExpired
                      ? `The ${policyWindowDays}-day refund window has passed. No refund is provided.`
                      : isGstOnlyTier
                        ? `Since the refund was within the first 7 days, only the GST component (${formatCurrency(gstComponent)}) is retained. The base amount (${formatCurrency(gstBase)}) is fully refunded — total ${formatCurrency(refundAmount)}. Note: 100% of the paid amount is never returned as GST is always retained.`
                        : `Applicable window "${tier.window}" refunds ${tier.baseRefundPercent}% of the base amount. GST (${formatCurrency(gstComponent)}) is retained + ${tier.timeCutPercent}% day-based cut (${formatCurrency(timeCutAmount)}). Total refund ${formatCurrency(refundAmount)}.`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#E8F0EE]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FiClock className="text-[#00695C]" />
                <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">{policyWindowDays}-Day Refund Window</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                isExpired ? 'bg-red-100 text-red-700' : 'bg-[#E8F4F2] text-[#00695C]'
              }`}>
                {isExpired ? 'Window Closed' : `${daysLeftInWindow}d left`}
              </span>
            </div>

            <div className="relative pt-6 pb-2">
              <div className="w-full h-3 bg-[#E8F0EE] rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isExpired
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : dayProgressPct <= 8
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                        : dayProgressPct <= 17
                          ? 'bg-gradient-to-r from-teal-500 to-teal-400'
                          : dayProgressPct <= 33
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                            : dayProgressPct <= 50
                              ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                              : dayProgressPct <= 67
                                ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                                : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${dayProgressPct}%` }}
                />
              </div>

              {Array.from(new Set([0, ...policyTiers.map(t => safeDayFrom(t)), policyWindowDays])).sort((a, b) => a - b).map((d) => (
                <div
                  key={d}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${Math.min(100, (d / policyWindowDays) * 100)}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={`w-1 h-3 rounded-full ${daysElapsed >= d ? 'bg-[#00695C]' : 'bg-[#B5C9C5]'}`} />
                  <span className={`text-[9px] font-semibold mt-0.5 ${daysElapsed >= d ? 'text-[#00695C]' : 'text-[#5A7D78]'}`}>
                    {d}d
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] mt-3 pt-3 border-t border-dashed border-[#D5E3E0]">
              <div>
                <p className="text-[#5A7D78] uppercase tracking-wider font-semibold">Elapsed</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{elapsedLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-[#5A7D78] uppercase tracking-wider font-semibold">Remaining</p>
                <p className={`text-sm font-bold ${isExpired ? 'text-red-600' : 'text-[#00695C]'}`}>
                  {isExpired ? '0d 0h' : `${daysLeftInWindow}d ${extraHoursElapsed > 0 ? 24 - extraHoursElapsed : 0}h`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#E8F0EE]">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FiActivity className="text-[#00695C]" />
                <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Refund Policy Timeline ({policyWindowDays} days)</h3>
              </div>
              {onOpenPolicy && (
                <button
                  onClick={onOpenPolicy}
                  className="text-[10px] font-semibold text-[#00695C] bg-[#E8F4F2] px-2.5 py-1 rounded-full hover:bg-[#C5EDE5] transition-all duration-300 flex items-center gap-1"
                >
                  <FiSettings className="text-[10px]" /> Edit Policy
                </button>
              )}
            </div>
            <p className="text-[10px] text-[#5A7D78] mb-4">
              GST ({activePolicy.gstRatePercent}%) is always retained. The % below shows how much of the <span className="font-semibold text-[#00695C]">base amount</span> is refunded based on elapsed days.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
              {policyTiers.map((t, i) => {
                const isActive = matchedTier.id === t.id;
                const isOpenEnded = isTierOpenEnded(t);
                const rangeLabel = fmtDayRangeShort(t);
                const isGstOnly = i === 0;
                const basePercent = Number(t.baseRefundPercent);
                const percentColorCls = basePercent >= 100 ? 'text-emerald-600'
                  : basePercent >= 75 ? 'text-teal-600'
                  : basePercent >= 50 ? 'text-amber-600'
                  : basePercent > 0 ? 'text-rose-600'
                  : 'text-red-600';
                return (
                  <div
                    key={t.id}
                    className={`rounded-xl p-2.5 border-2 text-center transition-all ${
                      isActive
                        ? 'border-[#00695C] bg-white shadow-md scale-105'
                        : 'border-[#E8F0EE] bg-white/50 opacity-60'
                    }`}
                  >
                    <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-0.5">{rangeLabel}</p>
                    <p className={`text-base font-extrabold ${percentColorCls}`}>{basePercent}%</p>
                    <p className="text-[8px] text-[#5A7D78]">{isGstOnly && basePercent === 100 ? 'GST only retained' : 'of base'}</p>
                    {isActive && (
                      <span className="inline-block mt-1 text-[8px] font-bold text-white bg-[#00695C] px-1.5 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-[#D5E3E0] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#00695C] text-sm" />
                <div>
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Date</p>
                  <p className="text-xs font-bold text-[#1A2E2A]">
                    {originalDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiSend className="text-[#00695C] text-sm" />
                <div>
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Requested</p>
                  <p className="text-xs font-bold text-[#1A2E2A]">
                    {refundDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className={`text-sm ${isOverdue ? 'text-red-600' : 'text-[#00695C]'}`} />
                <div>
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Elapsed</p>
                  <p className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-[#1A2E2A]'}`}>
                    {elapsedLabel} {isOverdue && '· Overdue'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isRejectedStatus && (
            <div className="bg-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#E8F0EE]">
              <div className="flex items-center gap-2 mb-4">
                <FiActivity className="text-[#00695C]" />
                <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Processing Timeline</h3>
              </div>

              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#E8F0EE] z-0"></div>
                <div
                  className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] z-0 transition-all duration-700"
                  style={{
                    width: currentStatusIndex >= 0
                      ? `calc(${(currentStatusIndex / (timelineSteps.length - 1)) * 100}% - 20px)`
                      : '0%'
                  }}
                ></div>

                {timelineSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isDone = i <= currentStatusIndex;
                  const isCurrent = i === currentStatusIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 relative z-10 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isDone
                          ? 'bg-gradient-to-br from-[#00695C] to-[#26A69A] border-white text-white shadow-lg'
                          : 'bg-white border-[#E8F0EE] text-[#B5C9C5]'
                      } ${isCurrent ? 'ring-4 ring-[#00695C]/20 scale-110' : ''}`}>
                        <StepIcon className="text-sm" />
                      </div>
                      <span className={`text-[10px] font-semibold text-center ${isDone ? 'text-[#00695C]' : 'text-[#5A7D78]'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#E8F0EE]">
            <div className="flex items-center gap-2 mb-4">
              <FiDollarSign className="text-[#00695C]" />
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Refund Amount Breakdown</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-dashed border-[#D5E3E0]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8F4F2] flex items-center justify-center">
                    <FiCreditCard className="text-[#00695C] text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A2E2A]">Original Transaction Amount</p>
                    <p className="text-[10px] text-[#5A7D78]">
                      Paid on {originalDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#1A2E2A]">{formatCurrency(originalAmount)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-dashed border-[#D5E3E0]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E8F4F2] flex items-center justify-center">
                    <FiDollarSign className="text-[#00695C] text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A2E2A]">Base Amount (excl. GST)</p>
                    <p className="text-[10px] text-[#5A7D78]">
                      {tier.baseRefundPercent}% refundable = {formatCurrency(Math.round((gstBase * tier.baseRefundPercent) / 100))}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-700">{formatCurrency(gstBase)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-dashed border-[#D5E3E0]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FiFileText className="text-amber-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A2E2A]">GST Component ({activePolicy.gstRatePercent}%)</p>
                    <p className="text-[10px] text-[#5A7D78]">
                      ⚠ Always retained — never refunded
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-700">- {formatCurrency(gstComponent)}</span>
              </div>

              {!isGstOnlyTier && !isExpired && tier.timeCutPercent > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-dashed border-[#D5E3E0]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <FiThumbsDown className="text-amber-600 text-xs" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A2E2A]">Days-Based Time Cut</p>
                      <p className="text-[10px] text-[#5A7D78]">
                        {tier.timeCutPercent}% of base — {tier.label} ({tier.window})
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-amber-700">- {formatCurrency(timeCutAmount)}</span>
                </div>
              )}

              <div className={`flex items-center justify-between py-3 rounded-xl px-3 mt-2 ${
                isRejected || isExpired ? 'bg-red-50' : 'bg-emerald-50'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isRejected || isExpired ? 'bg-red-100' : 'bg-emerald-100'
                  }`}>
                    <FiRotateCcw className={`text-xs ${isRejected || isExpired ? 'text-red-600' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A2E2A]">Final Refund Amount</p>
                    <p className="text-[10px] text-[#5A7D78]">
                      {isRejected ? 'Not refunded — request rejected' : isExpired ? 'Window expired — no refund' : `Returned via ${refund.refundMethod}`}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-extrabold ${isRejected || isExpired ? 'text-red-700' : 'text-emerald-700'}`}>
                  {formatCurrency(refundAmount)}
                </span>
              </div>

              {!isRejected && !isExpired && (
                <div className="rounded-xl bg-white border border-[#E8F0EE] px-3 py-2 mt-1">
                  <p className="text-[10px] text-[#5A7D78] leading-relaxed">
                    <span className="font-bold text-[#00695C]">Total deducted:</span>{' '}
                    {formatCurrency(totalDeduction)} ({deductionPercent}% of paid amount) —
                    GST {formatCurrency(gstComponent)} + day-based cut {formatCurrency(timeCutAmount)}.
                    <span className="block mt-0.5 italic">
                      100% of the paid amount is never refunded; GST is always retained.
                    </span>
                  </p>
                </div>
              )}

              {!isRejected && originalAmount > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#5A7D78] mb-1">
                    <span>Refund Coverage (of original amount)</span>
                    <span className="text-[#00695C]">{refundPercent}% refunded</span>
                  </div>
                  <div className="w-full h-2 bg-[#E8F0EE] rounded-full overflow-hidden relative">
                    <div
                      className="absolute top-0 h-full bg-[#B5C9C5]/40"
                      style={{ width: `${(gstBase / originalAmount) * 100}%` }}
                    />
                    <div
                      className="relative h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-700"
                      style={{ width: `${refundPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-[#5A7D78] mt-1">
                    <span>0%</span>
                    <span className="font-semibold text-[#00695C]">
                      Max possible = base only ({((gstBase / originalAmount) * 100).toFixed(0)}%)
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Request ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{refund.refundRequestId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCreditCard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Transaction ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{refund.transactionId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{refund.customerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMessageSquare className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Reason</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{refund.refundReason}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {refundDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Status</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{statusConfig.label}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <MethodIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Method</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{refund.refundMethod}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Approved By</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{refund.approvedBy}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiClipboard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Notes</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A] leading-relaxed">{refund.refundNotes || '—'}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={() => { if (onEdit) { onEdit(refund); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(refund.id); } }}
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
// EDIT REFUND MODAL
// ============================================================
const EditRefundModal = ({ refund, show, onClose, onSave }) => {
  if (!refund || !show) return null;

  const [formData, setFormData] = useState({
    refundRequestId: '', transactionId: '', customerName: '', refundReason: '',
    originalAmount: '', refundAmount: '', refundDate: '', refundStatus: '',
    refundMethod: '', approvedBy: '', refundNotes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (refund) {
      setFormData({
        refundRequestId: refund.refundRequestId || '',
        transactionId: refund.transactionId || '',
        customerName: refund.customerName || '',
        refundReason: refund.refundReason || '',
        originalAmount: refund.originalAmount || '',
        refundAmount: refund.refundAmount || '',
        refundDate: refund.refundDate ? refund.refundDate.split('T')[0] : '',
        refundStatus: refund.refundStatus || 'Refund Requested',
        refundMethod: refund.refundMethod || '',
        approvedBy: refund.approvedBy || '',
        refundNotes: refund.refundNotes || ''
      });
    }
  }, [refund]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...refund, ...formData });
      setLoading(false);
      onClose();
    }, 700);
  };

  const inputCls = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none";
  const labelCls = "block text-xs font-medium text-[#5A7D78] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Refund</h2>
          <p className="text-white/80 text-sm">Update refund request details</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiFileText className="text-[#00695C]" /> Refund Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Refund Request ID *</label>
                  <input type="text" name="refundRequestId" value={formData.refundRequestId} onChange={handleChange} required className={inputCls} placeholder="REF-0001" />
                </div>
                <div>
                  <label className={labelCls}>Transaction ID *</label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} required className={inputCls} placeholder="TXN-0001" />
                </div>
                <div>
                  <label className={labelCls}>Customer Name *</label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className={inputCls} placeholder="Enter customer name" />
                </div>
                <div>
                  <label className={labelCls}>Refund Reason *</label>
                  <select name="refundReason" value={formData.refundReason} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Reason</option>
                    {ALL_REFUND_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" /> Amount Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Original Amount (₹) *</label>
                  <input type="number" name="originalAmount" value={formData.originalAmount} onChange={handleChange} required min="0" className={inputCls} placeholder="Enter original amount" />
                </div>
                <div>
                  <label className={labelCls}>Refund Amount (₹) *</label>
                  <input type="number" name="refundAmount" value={formData.refundAmount} onChange={handleChange} required min="0" className={inputCls} placeholder="Enter refund amount" />
                </div>
                <div>
                  <label className={labelCls}>Refund Date *</label>
                  <input type="date" name="refundDate" value={formData.refundDate} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Refund Method *</label>
                  <select name="refundMethod" value={formData.refundMethod} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Method</option>
                    {ALL_REFUND_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiActivity className="text-[#00695C]" /> Status & Approval
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Refund Status *</label>
                  <select name="refundStatus" value={formData.refundStatus} onChange={handleChange} required className={inputCls}>
                    {ALL_REFUND_STATUSES.map(s => <option key={s} value={s}>{REFUND_STATUS_CONFIG[s].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Approved By *</label>
                  <select name="approvedBy" value={formData.approvedBy} onChange={handleChange} required className={inputCls}>
                    <option value="">Select Approver</option>
                    {ALL_APPROVERS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Refund Notes</label>
                  <textarea name="refundNotes" value={formData.refundNotes} onChange={handleChange} rows={3} className={inputCls} placeholder="Add any additional notes..." />
                </div>
              </div>
            </div>
          </form>
        </div>

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
// REFUND POLICY MODAL — Day-Based 
// ============================================================
const RefundPolicyModal = ({ show, policy, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(policy || DEFAULT_REFUND_POLICY);
  const [saving, setSaving] = useState(false);
  const [sampleAmount, setSampleAmount] = useState(10000);

  useEffect(() => {
    if (show) {
      setDraft(JSON.parse(JSON.stringify(policy || DEFAULT_REFUND_POLICY)));
      setIsEditing(false);
    }
  }, [show, policy]);

  if (!show) return null;

  const inputCls = "w-full px-2.5 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-xs text-[#1A2E2A] outline-none";
  const labelCls = "block text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1";

  const updateTierField = (id, field, value) => {
    setDraft(prev => ({
      ...prev,
      tiers: prev.tiers.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const addTier = () => {
    setDraft(prev => {
      const tiers = [...prev.tiers];
      const lastFinite = [...tiers].reverse().find(t => !isTierOpenEnded(t));
      const newFrom = lastFinite ? safeDayTo(lastFinite) : 0;
      const newTier = {
        id: `tier-${Date.now()}`,
        dayFrom: newFrom,
        dayTo: newFrom + 15,
        baseRefundPercent: 50,
        label: 'New Refund Window',
        note: `50% of base refunded · 50% day-cut + GST retained (${newFrom}–${newFrom + 15} days)`,
        color: 'slate'
      };
      const openEndedIdx = tiers.findIndex(t => isTierOpenEnded(t));
      if (openEndedIdx >= 0) {
        tiers.splice(openEndedIdx, 0, newTier);
      } else {
        tiers.push(newTier);
      }
      return { ...prev, tiers };
    });
  };

  const removeTier = (id) => {
    setDraft(prev => ({ ...prev, tiers: prev.tiers.filter(t => t.id !== id) }));
  };

  const handleSave = () => {
    setSaving(true);
    const cleaned = {
      gstRatePercent: Number(draft.gstRatePercent) || 0,
      windowDays: Number(draft.windowDays) || 90,
      tiers: draft.tiers.map(t => ({
        ...t,
        dayFrom: safeDayFrom(t),
        dayTo: isTierOpenEnded(t) ? null : safeDayTo(t),
        baseRefundPercent: Math.max(0, Math.min(100, Number(t.baseRefundPercent) || 0))
      }))
    };
    setTimeout(() => {
      onSave(cleaned);
      setSaving(false);
      setIsEditing(false);
    }, 400);
  };

  const handleCancelEdit = () => {
    setDraft(JSON.parse(JSON.stringify(policy || DEFAULT_REFUND_POLICY)));
    setIsEditing(false);
  };

  const previewPolicy = isEditing ? draft : (policy || DEFAULT_REFUND_POLICY);
  const gstRate = Number(previewPolicy.gstRatePercent || 0) / 100;
  const amt = Number(sampleAmount) || 0;
  const base = Math.round(amt / (1 + gstRate));
  const gstAmt = amt - base;
  const previewWindowDays = Number(previewPolicy.windowDays || 90);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg">
              <FiFileText />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Refund Details &amp; Policy</h2>
              <p className="text-white/80 text-sm">
                Day-based refund calculation — GST, {previewWindowDays}-day windows &amp; amounts
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">

          <div className="bg-gradient-to-br from-[#E8F4F2] to-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#C5EDE5]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00695C] flex items-center justify-center flex-shrink-0">
                <FiInfo className="text-white text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider mb-2">
                  How Day-Based Refunds Work
                </h3>
                <ul className="space-y-1.5 text-xs text-[#1A2E2A] leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00695C] mt-1.5 flex-shrink-0"></span>
                    <span><strong>GST ({previewPolicy.gstRatePercent}%)</strong> is <strong>always retained</strong> — never refunded.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00695C] mt-1.5 flex-shrink-0"></span>
                    <span>Refund eligibility is decided by <strong>elapsed days</strong> since payment, up to <strong>{previewWindowDays} days</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00695C] mt-1.5 flex-shrink-0"></span>
                    <span>Each tier below shows <strong>% of the base amount</strong> refunded — the rest is deducted as a day-based time cut.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00695C] mt-1.5 flex-shrink-0"></span>
                    <span><strong>100% of the paid amount is never refunded</strong> — GST is always retained on top of any time cut.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#E8F0EE]">
            <div className="flex items-center gap-2 mb-4">
              <FiPercent className="text-[#00695C]" />
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Core Settings</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-[#E8F0EE]">
                <p className={labelCls}>GST Rate (always retained)</p>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min="0" max="100" step="0.5"
                      value={draft.gstRatePercent}
                      onChange={(e) => setDraft(prev => ({ ...prev, gstRatePercent: e.target.value }))}
                      className={inputCls}
                    />
                    <span className="text-sm font-bold text-[#5A7D78]">%</span>
                  </div>
                ) : (
                  <p className="text-xl font-extrabold text-[#00695C]">{previewPolicy.gstRatePercent}%</p>
                )}
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#E8F0EE]">
                <p className={labelCls}>Refund Window (total days)</p>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number" min="1" step="1"
                      value={draft.windowDays}
                      onChange={(e) => setDraft(prev => ({ ...prev, windowDays: e.target.value }))}
                      className={inputCls}
                    />
                    <span className="text-sm font-bold text-[#5A7D78]">days</span>
                  </div>
                ) : (
                  <p className="text-xl font-extrabold text-[#00695C]">{previewWindowDays} days</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-5 mb-5 border border-[#E8F0EE]">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FiActivity className="text-[#00695C]" />
                <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">
                  Day-Based Refund Tiers
                </h3>
              </div>
              {isEditing && (
                <button
                  onClick={addTier}
                  className="text-xs font-semibold text-[#00695C] bg-[#E8F4F2] px-3 py-1.5 rounded-full hover:bg-[#C5EDE5] transition-all duration-300 flex items-center gap-1"
                >
                  <FiPlus className="text-xs" /> Add Tier
                </button>
              )}
            </div>
            <p className="text-[10px] text-[#5A7D78] mb-4">
              Each tier is defined by an <strong>elapsed-day range</strong> since payment. The % is how much of the base amount is refunded — the remainder is deducted as a day-based cut.
            </p>

            <div className="space-y-3">
              {(isEditing ? draft.tiers : (previewPolicy.tiers || [])).map((t) => {
                const openEnded = isTierOpenEnded(t);
                const basePercent = Number(t.baseRefundPercent) || 0;
                const percentColor = basePercent >= 100 ? 'text-emerald-600'
                  : basePercent >= 75 ? 'text-teal-600'
                  : basePercent >= 50 ? 'text-amber-600'
                  : basePercent > 0 ? 'text-rose-600'
                  : 'text-red-600';
                return (
                  <div key={t.id} className="bg-white rounded-xl p-4 border border-[#E8F0EE]">
                    {isEditing ? (
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
                        <div>
                          <label className={labelCls}>From (day)</label>
                          <input
                            type="number" min="0"
                            value={t.dayFrom === '' || t.dayFrom === null || t.dayFrom === undefined ? '' : t.dayFrom}
                            onChange={(e) => updateTierField(t.id, 'dayFrom', e.target.value)}
                            className={inputCls}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>To (day) — blank = open-ended</label>
                          <input
                            type="number" min="0"
                            value={openEnded ? '' : t.dayTo}
                            onChange={(e) => updateTierField(t.id, 'dayTo', e.target.value)}
                            placeholder="∞"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Base Refund %</label>
                          <input
                            type="number" min="0" max="100"
                            value={t.baseRefundPercent}
                            onChange={(e) => updateTierField(t.id, 'baseRefundPercent', e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Label</label>
                          <input
                            type="text"
                            value={t.label || ''}
                            onChange={(e) => updateTierField(t.id, 'label', e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div className="flex items-center justify-end">
                          {draft.tiers.length > 1 && (
                            <button
                              onClick={() => removeTier(t.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 flex items-center justify-center"
                              title="Remove tier"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          )}
                        </div>
                        <div className="col-span-2 sm:col-span-6">
                          <label className={labelCls}>Note</label>
                          <input
                            type="text"
                            value={t.note || ''}
                            onChange={(e) => updateTierField(t.id, 'note', e.target.value)}
                            className={inputCls}
                            placeholder={fmtNoteFallback(t)}
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-6">
                          <div className="flex items-center gap-2 flex-wrap text-[10px]">
                            <span className="font-bold text-[#5A7D78] uppercase tracking-wider">Preview:</span>
                            <span className="font-bold text-[#00695C] bg-[#E8F4F2] px-2 py-0.5 rounded-full">
                              {fmtDayRangeLong(t)}
                            </span>
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              {basePercent}% base refund
                            </span>
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              {100 - basePercent}% day-cut
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className={`w-12 h-12 rounded-xl bg-[#E8F4F2] flex items-center justify-center text-sm font-extrabold ${percentColor} flex-shrink-0`}>
                            {basePercent}%
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#1A2E2A]">
                              {t.label || 'Refund Window'}
                              <span className="text-[#5A7D78] font-medium ml-1.5">
                                ({fmtDayRangeLong(t)})
                              </span>
                            </p>
                            <p className="text-[11px] text-[#5A7D78]">
                              {t.note || fmtNoteFallback(t)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            basePercent >= 100 ? 'bg-emerald-50 text-emerald-700'
                              : basePercent >= 75 ? 'bg-teal-50 text-teal-700'
                              : basePercent >= 50 ? 'bg-amber-50 text-amber-700'
                              : basePercent > 0 ? 'bg-rose-50 text-rose-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {basePercent}% base refund
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            {100 - basePercent}% day-cut
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-dashed border-[#D5E3E0]">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">
                Refund Flow Across {previewWindowDays} Days
              </p>
              <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
                {(previewPolicy.tiers || []).map((t) => {
                  const basePercent = Number(t.baseRefundPercent) || 0;
                  const tone = basePercent >= 100 ? 'from-emerald-500 to-emerald-400'
                    : basePercent >= 75 ? 'from-teal-500 to-teal-400'
                    : basePercent >= 50 ? 'from-amber-500 to-amber-400'
                    : basePercent > 0 ? 'from-rose-500 to-rose-400'
                    : 'from-red-500 to-red-400';
                  return (
                    <div key={t.id} className="flex-1 min-w-[90px]">
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${tone}`} />
                      <p className="text-[9px] font-bold text-[#1A2E2A] mt-1.5 text-center truncate">
                        {fmtDayRangeShort(t)}
                      </p>
                      <p className="text-[9px] font-semibold text-[#5A7D78] text-center">{basePercent}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-5 border border-[#E8F0EE]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" />
                <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Try a Sample Amount</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#5A7D78]">₹</span>
                <input
                  type="number" min="0"
                  value={sampleAmount}
                  onChange={(e) => setSampleAmount(e.target.value)}
                  className="w-32 px-2.5 py-1.5 bg-white rounded-lg border border-[#E8F0EE] text-xs text-[#1A2E2A] outline-none focus:border-[#00695C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-0.5">Original Paid</p>
                <p className="text-sm font-extrabold text-[#1A2E2A]">{formatCurrency(amt)}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-0.5">Base (excl. GST)</p>
                <p className="text-sm font-extrabold text-emerald-700">{formatCurrency(base)}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-0.5">GST Retained</p>
                <p className="text-sm font-extrabold text-amber-700">{formatCurrency(gstAmt)}</p>
              </div>
            </div>

            <p className="text-[11px] text-[#5A7D78] mb-3">
              Refund by elapsed days (each tile shows the refund for a request made within that day window):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
              {(previewPolicy.tiers || []).map((t) => {
                const basePercent = Number(t.baseRefundPercent) || 0;
                const refundAmt = Math.round((base * basePercent) / 100);
                const dayCutAmt = base - refundAmt;
                const percentColor = basePercent >= 100 ? 'text-emerald-600'
                  : basePercent >= 75 ? 'text-teal-600'
                  : basePercent >= 50 ? 'text-amber-600'
                  : basePercent > 0 ? 'text-rose-600'
                  : 'text-red-600';
                return (
                  <div key={t.id} className="rounded-xl p-2.5 border-2 border-[#E8F0EE] bg-white text-center">
                    <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-0.5">
                      {fmtDayRangeLong(t)}
                    </p>
                    <p className={`text-sm font-extrabold ${percentColor}`}>{formatCurrency(refundAmt)}</p>
                    <p className="text-[8px] text-[#5A7D78]">{basePercent}% of base</p>
                    {basePercent < 100 && (
                      <p className="text-[8px] text-amber-700 mt-0.5">− {formatCurrency(dayCutAmt)} cut</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-[#D5E3E0]">
              <p className="text-[10px] text-[#5A7D78] leading-relaxed">
                <span className="font-bold text-[#00695C]">Note:</span> GST ({previewPolicy.gstRatePercent}%) is always retained regardless of when the refund is requested.
                On top of that, a day-based cut is applied as shown above. After <strong>{previewWindowDays} days</strong>, no refund is allowed.
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {isEditing ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                {saving ? 'Saving...' : 'Save Policy'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <FiEdit /> Edit Policy
              </button>
            </div>
          )}
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
// MAIN COMPONENT — Refund Management
// ============================================================
const RefundManagement = () => {
  const searchInputRef = useRef(null);

  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('refundDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRefunds, setSelectedRefunds] = useState([]);
  const [viewingRefund, setViewingRefund] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRefund, setEditingRefund] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeReason, setActiveReason] = useState('all');
  const [activeMethod, setActiveMethod] = useState('all');
  const [showStats, setShowStats] = useState(true);
  const [refundPolicy, setRefundPolicy] = useState(DEFAULT_REFUND_POLICY);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  const [stats, setStats] = useState({
    total: 0, 'Refund Requested': 0, 'Under Review': 0, 'Approved': 0, 'Processing': 0, 'Completed': 0, 'Rejected': 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, 'Refund Requested': 0, 'Under Review': 0, 'Approved': 0, 'Processing': 0, 'Completed': 0, 'Rejected': 0 });
      return;
    }
    const counts = { total: list.length };
    ALL_REFUND_STATUSES.forEach(status => {
      counts[status] = list.filter(r => r.refundStatus === status).length;
    });
    setStats(counts);
  }, []);

  const generateMockRefunds = useCallback(() => {
    const customerNames = [
      'Arun Kumar', 'Priya Sharma', 'Karthik Reddy', 'Divya Iyer', 'Suresh Nair',
      'Meena Menon', 'Ravi Rao', 'Anitha Pillai', 'Vijay Singh', 'Deepa Joshi',
      'Manoj Verma', 'Kavya Krishnan', 'Rahul Mehta', 'Sneha Patel', 'Arjun Das'
    ];
    const list = [];
    const now = new Date();

    for (let i = 1; i <= 60; i++) {
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const refundReason = ALL_REFUND_REASONS[Math.floor(Math.random() * ALL_REFUND_REASONS.length)];
      const refundStatus = ALL_REFUND_STATUSES[Math.floor(Math.random() * ALL_REFUND_STATUSES.length)];
      const refundMethod = ALL_REFUND_METHODS[Math.floor(Math.random() * ALL_REFUND_METHODS.length)];
      const approvedBy = ALL_APPROVERS[Math.floor(Math.random() * ALL_APPROVERS.length)];

      const originalAmount = Math.floor(Math.random() * 8 + 1) * 500 + Math.floor(Math.random() * 500);
      const refundAmount = refundStatus === 'Rejected' ? 0 : originalAmount - Math.floor(Math.random() * 200);

      let refundDate;
      if (i % 7 === 0) {
        refundDate = new Date(now);
      } else {
        const daysAgo = Math.floor(Math.random() * 120);
        refundDate = new Date(now);
        refundDate.setDate(refundDate.getDate() - daysAgo);
      }

      const refundRequestId = `REF-${String(i).padStart(4, '0')}`;
      const transactionId = `TXN-${String(1000 + i).padStart(4, '0')}`;

      list.push({
        id: `refund_${i}`,
        refundRequestId,
        transactionId,
        customerName,
        refundReason,
        originalAmount,
        refundAmount: refundStatus === 'Rejected' ? 0 : refundAmount,
        refundDate: refundDate.toISOString(),
        refundStatus,
        refundMethod,
        approvedBy,
        refundNotes: refundStatus === 'Rejected' ? 'Refund rejected due to policy violation.' : refundStatus === 'Completed' ? 'Refund processed successfully.' : 'Refund under process.'
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  useEffect(() => {
    try {
      const mockRefunds = generateMockRefunds();
      setRefunds(mockRefunds);
      setFilteredRefunds(mockRefunds);
    } catch (error) {
      console.error('Error generating mock refunds:', error);
    }
  }, [generateMockRefunds]);

  const filterRefunds = useCallback(() => {
    try {
      let filtered = [...refunds];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          (r.refundRequestId && r.refundRequestId.toLowerCase().includes(query)) ||
          (r.transactionId && r.transactionId.toLowerCase().includes(query)) ||
          (r.customerName && r.customerName.toLowerCase().includes(query)) ||
          (r.refundReason && r.refundReason.toLowerCase().includes(query)) ||
          (r.refundStatus && r.refundStatus.toLowerCase().includes(query)) ||
          (r.refundMethod && r.refundMethod.toLowerCase().includes(query)) ||
          (r.approvedBy && r.approvedBy.toLowerCase().includes(query)) ||
          (r.refundNotes && r.refundNotes.toLowerCase().includes(query)) ||
          (String(r.refundAmount).includes(query))
        );
      }

      if (activeStatus !== 'all')   filtered = filtered.filter(r => r.refundStatus === activeStatus);
      if (activeReason !== 'all')   filtered = filtered.filter(r => r.refundReason === activeReason);
      if (activeMethod !== 'all')   filtered = filtered.filter(r => r.refundMethod === activeMethod);

      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activeReason !== 'all') count++;
      if (activeMethod !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'refundAmount' || sortField === 'originalAmount') {
          aVal = Number(aVal); bVal = Number(bVal);
        } else if (sortField === 'refundDate') {
          aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime();
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredRefunds(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering refunds:', error);
    }
  }, [refunds, searchQuery, activeStatus, activeReason, activeMethod, sortField, sortDirection]);

  useEffect(() => { filterRefunds(); }, [filterRefunds]);

  const totalPages = Math.max(1, Math.ceil(filteredRefunds.length / pageSize));
  const paginatedRefunds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredRefunds.slice(start, end);
  }, [filteredRefunds, currentPage, pageSize]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedRefunds.length === paginatedRefunds.length && paginatedRefunds.length > 0) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(paginatedRefunds.map(r => r.id));
    }
  }, [selectedRefunds, paginatedRefunds]);

  const handleSelectRefund = useCallback((refundId) => {
    setSelectedRefunds(prev => prev.includes(refundId) ? prev.filter(id => id !== refundId) : [...prev, refundId]);
  }, []);

  const handleViewRefund = useCallback((refund) => {
    setViewingRefund(refund);
    setShowViewModal(true);
  }, []);

  const handleEditRefund = useCallback((refund) => {
    setEditingRefund(refund);
    setShowEditModal(true);
  }, []);

  const handleSaveRefund = useCallback((updatedRefund) => {
    setRefunds(prev => {
      const updated = prev.map(r => r.id === updatedRefund.id ? updatedRefund : r);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Refund "${updatedRefund.refundRequestId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  const handleDeleteRefund = useCallback((refundId) => {
    const refund = refunds.find(r => r.id === refundId);
    if (!refund) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Refund Request',
      message: `Are you sure you want to delete refund request "${refund.refundRequestId}" for ${refund.customerName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(refundId);
        setTimeout(() => {
          setRefunds(prev => {
            const updated = prev.filter(r => r.id !== refundId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted refund request "${refund.refundRequestId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [refunds, computeStats]);

  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActiveReason('all');
    setActiveMethod('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveReason('all');
    setActiveMethod('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockRefunds = generateMockRefunds();
        setRefunds(mockRefunds);
        setFilteredRefunds(mockRefunds);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockRefunds]);

  const handleExport = useCallback(() => {
    if (filteredRefunds.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredRefunds.map(r => ({
        'Refund Request ID': r.refundRequestId || '',
        'Transaction ID': r.transactionId || '',
        'Customer Name': r.customerName || '',
        'Refund Reason': r.refundReason || '',
        'Original Amount': r.originalAmount || 0,
        'Refund Amount': r.refundAmount || 0,
        'Refund Date': r.refundDate ? new Date(r.refundDate).toLocaleDateString('en-IN') : '',
        'Refund Status': r.refundStatus || '',
        'Refund Method': r.refundMethod || '',
        'Approved By': r.approvedBy || '',
        'Refund Notes': r.refundNotes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `refund_management_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredRefunds.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredRefunds]);

  const handleBulkDelete = useCallback(() => {
    if (selectedRefunds.length === 0) {
      setToast({ message: 'Please select refunds first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Refunds',
      message: `Are you sure you want to delete ${selectedRefunds.length} selected refund request(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedRefunds);
          const count = refunds.filter(r => selectedIds.has(r.id)).length;
          const updated = refunds.filter(r => !selectedIds.has(r.id));
          setRefunds(updated);
          computeStats(updated);
          setSelectedRefunds([]);
          setActionLoading(null);
          setToast({ message: `${count} refund request(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedRefunds, refunds, computeStats]);

  const handleSavePolicy = useCallback((updatedPolicy) => {
    setRefundPolicy(updatedPolicy);
    setToast({ message: 'Refund policy updated — all refund views now reflect the new day-based rules', type: 'success' });
  }, []);

  const statusOptions = ALL_REFUND_STATUSES.map(s => ({ value: s, label: REFUND_STATUS_CONFIG[s].label }));
  const reasonOptions = ALL_REFUND_REASONS.map(r => ({ value: r, label: r }));
  const methodOptions = ALL_REFUND_METHODS.map(m => ({ value: m, label: m }));

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
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

      {showViewModal && viewingRefund && (
        <ViewRefundDetailModal
          refund={viewingRefund}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingRefund(null); }}
          onEdit={handleEditRefund}
          onDelete={handleDeleteRefund}
          policy={refundPolicy}
          onOpenPolicy={() => setShowPolicyModal(true)}
        />
      )}

      {showEditModal && editingRefund && (
        <EditRefundModal
          refund={editingRefund}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingRefund(null); }}
          onSave={handleSaveRefund}
        />
      )}

      <RefundPolicyModal
        show={showPolicyModal}
        policy={refundPolicy}
        onClose={() => setShowPolicyModal(false)}
        onSave={handleSavePolicy}
      />

      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Refund Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredRefunds.length} Refunds
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track and manage all refund requests across transactions</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowPolicyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium text-white hover:scale-105 shadow-md shadow-[#00695C]/20"
            >
              <FiFileText className="text-sm" />
              <span>Refund Details</span>
            </button>
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

      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiLayers className="text-white text-sm" />}
                title="Total Refunds"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={filterCount === 0}
                onClick={handleTotalClick}
              />
              {ALL_REFUND_STATUSES.map((status, index) => {
                const cfg = REFUND_STATUS_CONFIG[status];
                const Icon = cfg.icon;
                return (
                  <StatCard
                    key={status}
                    icon={<Icon className="text-white text-sm" />}
                    title={cfg.label}
                    value={stats[status] || 0}
                    color={`bg-gradient-to-br ${cfg.color}`}
                    delay={60 * (index + 1)}
                    isActive={activeStatus === status}
                    onClick={() => handleStatusClick(status)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by refund ID, transaction ID, customer name, reason, method, approver..."
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
            label="Status"
            options={statusOptions}
            value={activeStatus}
            onChange={setActiveStatus}
            icon={FiActivity}
            allLabel="All Statuses"
          />
          <FilterDropdown
            label="Reason"
            options={reasonOptions}
            value={activeReason}
            onChange={setActiveReason}
            icon={FiMessageSquare}
            allLabel="All Reasons"
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

        {selectedRefunds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedRefunds.length}</span> refund(s) selected
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
                onClick={() => setSelectedRefunds([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedRefunds.map((refund, index) => {
              const isSelected = selectedRefunds.includes(refund.id);
              const statusConfig = REFUND_STATUS_CONFIG[refund.refundStatus] || REFUND_STATUS_CONFIG['Refund Requested'];
              const StatusIcon = statusConfig.icon;
              const methodConfig = REFUND_METHOD_CONFIG[refund.refundMethod] || REFUND_METHOD_CONFIG['UPI'];
              const MethodIcon = methodConfig.icon;

              return (
                <div
                  key={refund.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRefund(refund.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <StatusIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{refund.customerName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[11px] font-medium text-[#5A7D78]">{refund.refundRequestId}</p>
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
                      <span className="truncate font-bold text-[#1A2E2A]">{refund.refundRequestId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCreditCard className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{refund.transactionId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMessageSquare className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{refund.refundReason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                        <span className="truncate font-bold text-[#1A2E2A] text-xs">{formatCurrency(refund.refundAmount)}</span>
                        <span className="text-[9px] text-[#5A7D78] truncate">of {formatCurrency(refund.originalAmount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <MethodIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${methodConfig.bg} ${methodConfig.text} border ${methodConfig.border}`}>
                        {refund.refundMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{refund.approvedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">
                        {new Date(refund.refundDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewRefund(refund)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRefund(refund)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRefund(refund.id)}
                      disabled={actionLoading === refund.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === refund.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                  checked={selectedRefunds.length === paginatedRefunds.length && paginatedRefunds.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                />
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('refundRequestId')}>
                  Refund ID {sortField === 'refundRequestId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('transactionId')}>
                Txn ID {sortField === 'transactionId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('customerName')}>
                Customer {sortField === 'customerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('refundReason')}>
                Reason {sortField === 'refundReason' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('originalAmount')}>
                Orig Amt {sortField === 'originalAmount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('refundAmount')}>
                Refund Amt {sortField === 'refundAmount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('refundMethod')}>
                Method {sortField === 'refundMethod' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('refundStatus')}>
                Status {sortField === 'refundStatus' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('approvedBy')}>
                Approved By {sortField === 'approvedBy' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('refundDate')}>
                Date {sortField === 'refundDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedRefunds.map((refund, index) => {
              const isSelected = selectedRefunds.includes(refund.id);
              const statusConfig = REFUND_STATUS_CONFIG[refund.refundStatus] || REFUND_STATUS_CONFIG['Refund Requested'];
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={refund.id}
                  className={`grid grid-cols-12 gap-1 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRefund(refund.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                    />
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <StatusIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{refund.refundRequestId}</span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {refund.transactionId}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{refund.customerName}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {refund.refundReason}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {formatCurrency(refund.originalAmount)}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-bold text-[#1A2E2A] truncate">
                    {formatCurrency(refund.refundAmount)}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {refund.refundMethod}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} truncate inline-block max-w-full`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {refund.approvedBy}
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {new Date(refund.refundDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>

                  <div className="col-span-1 min-w-0 flex items-center justify-end gap-1 flex-nowrap">
                    <button
                      type="button"
                      onClick={() => handleViewRefund(refund)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="View"
                    >
                      <FiEye className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRefund(refund)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0"
                      title="Edit"
                    >
                      <FiEdit className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRefund(refund.id)}
                      disabled={actionLoading === refund.id}
                      className="w-5 h-5 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                      title="Delete"
                    >
                      {actionLoading === refund.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[15px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedRefunds.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FaUndo className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No refund requests found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No refund records have been added yet'}
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

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredRefunds.length)} of{' '}
              {filteredRefunds.length} refunds
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

export default RefundManagement;