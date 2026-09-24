// src/components/admin/Payments/CommissionRevenue.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave,
  FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiClock,
  FiDollarSign, FiCalendar, FiLayers, FiMapPin,
  FiPieChart, FiGlobe, FiTarget,
  FiArrowUpRight
} from 'react-icons/fi';
import { FaHome, FaHardHat } from 'react-icons/fa';

// ============================================================
// COMMISSION TYPE CONFIG
// ============================================================
const COMMISSION_TYPE_CONFIG = {
  'Owner Commission':            { short: 'Owner',    icon: FaHome,      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400' },
  'Agent Commission':            { short: 'Agent',    icon: FiBriefcase, bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-600 to-blue-400' },
  'Builder Commission':          { short: 'Builder',  icon: FaHardHat,   bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  gradient: 'from-orange-600 to-orange-400' },
  'Property Manager Commission': { short: 'Property', icon: FiLayers,    bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  gradient: 'from-purple-600 to-purple-400' },
  'Platform Commission':         { short: 'Platform', icon: FiGlobe,     bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  gradient: 'from-indigo-600 to-indigo-400' },
  'Lead Commission':             { short: 'Lead',     icon: FiTarget,    bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    gradient: 'from-pink-600 to-pink-400' }
};
const ALL_COMMISSION_TYPES = Object.keys(COMMISSION_TYPE_CONFIG);

// ============================================================
// COMMISSION STATUS CONFIG
// ============================================================
const COMMISSION_STATUS_CONFIG = {
  'Earned':   { icon: FiCheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Earned' },
  'Pending':  { icon: FiClock,       bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Pending' },
  'Paid':     { icon: FiDollarSign,  bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Paid' },
  'Failed':   { icon: FiXCircle,     bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Failed' }
};
const ALL_COMMISSION_STATUSES = Object.keys(COMMISSION_STATUS_CONFIG);

// ============================================================
// DATE PRESETS
// ============================================================
const DATE_PRESETS = [
  { key: 'all',        label: 'All Time' },
  { key: 'today',      label: 'Today' },
  { key: 'yesterday',  label: 'Yesterday' },
  { key: 'thisWeek',   label: 'This Week' },
  { key: 'thisMonth',  label: 'This Month' },
  { key: 'lastMonth',  label: 'Last Month' },
  { key: 'thisYear',   label: 'This Year' },
  { key: 'custom',     label: 'Custom Range' }
];

const getPresetRange = (preset) => {
  const now = new Date();
  const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const endOfDay = (d) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };
  switch (preset) {
    case 'today': return { start: startOfDay(now), end: endOfDay(now), label: 'Today' };
    case 'yesterday': { const y = new Date(now); y.setDate(y.getDate() - 1); return { start: startOfDay(y), end: endOfDay(y), label: 'Yesterday' }; }
    case 'thisWeek': {
      const d = new Date(now); const day = d.getDay();
      const start = startOfDay(new Date(d.setDate(d.getDate() - day)));
      const end = endOfDay(new Date());
      return { start, end, label: 'This Week' };
    }
    case 'thisMonth': return { start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), end: endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)), label: 'This Month' };
    case 'lastMonth': return { start: startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)), end: endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)), label: 'Last Month' };
    case 'thisYear': return { start: startOfDay(new Date(now.getFullYear(), 0, 1)), end: endOfDay(new Date(now.getFullYear(), 11, 31)), label: 'This Year' };
    default: return { start: null, end: null, label: 'All Time' };
  }
};

// ============================================================
// FORMATTERS
// ============================================================
const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString('en-IN')}`;
};
const formatCurrencyFull = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
const formatDateShort = (d) => !d ? '' : new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDateCompact = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-IN', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  return `${day} ${month} ${year}`;
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
  const colors = { success: 'bg-emerald-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500' };
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
    danger:  { icon: 'text-red-600',   bg: 'bg-red-50',   button: 'bg-red-600 hover:bg-red-700',     border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700', border: 'border-amber-200' },
    info:    { icon: 'text-blue-600',  bg: 'bg-blue-50',  button: 'bg-blue-600 hover:bg-blue-700',   border: 'border-blue-200' }
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
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            {cancelText || 'Cancel'}
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] ${style.button}`}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// FILTER DROPDOWN
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : allLabel;
  return (
    <div className="relative z-[60]" ref={dropdownRef}>
      <button onClick={() => { if (!disabled) setIsOpen(!isOpen); }} disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md disabled:opacity-50 whitespace-nowrap ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}>
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-[999] max-h-80 overflow-y-auto animate-slide-down">
          <button onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-[#F5F9F8] ${value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'}`}>
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>{allLabel}</span>
          </button>
          {options.map((option) => (
            <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-[#F5F9F8] ${value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'}`}>
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
// CALENDAR MENU
// ============================================================
const CalendarMenu = ({
  preset, customStart, customEnd,
  onPresetChange, onCustomChange, onClear,
  viewMode, onToggleCalendarView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [localStart, setLocalStart] = useState(customStart || '');
  const [localEnd, setLocalEnd] = useState(customEnd || '');
  const ref = useRef(null);

  useEffect(() => {
    setLocalStart(customStart || '');
    setLocalEnd(customEnd || '');
  }, [customStart, customEnd]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setIsOpen(false); setShowCustom(false); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let displayLabel = 'All Time';
  if (preset === 'custom' && customStart && customEnd) {
    displayLabel = `${formatDateShort(customStart)} → ${formatDateShort(customEnd)}`;
  } else if (preset && preset !== 'all' && preset !== 'custom') {
    const p = DATE_PRESETS.find(x => x.key === preset);
    displayLabel = p ? p.label : 'All Time';
  }

  const isDateActive = preset && preset !== 'all';
  const isCalendarView = viewMode === 'calendar';

  const handlePresetClick = (key) => {
    if (key === 'custom') { setShowCustom(true); return; }
    onPresetChange(key);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (!localStart || !localEnd) return;
    onCustomChange(localStart, localEnd);
    setIsOpen(false);
    setShowCustom(false);
  };

  return (
    <div className="relative z-[999]" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)} title="Calendar & Date Filter"
        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-105 overflow-hidden border ${
          isCalendarView
            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white border-[#00695C] shadow-lg shadow-[#00695C]/30'
            : isDateActive
            ? 'bg-[#F5F9F8] text-[#1A2E2A] border-[#00695C] ring-2 ring-[#00695C]/20'
            : 'bg-white text-[#1A2E2A] border-[#E8F0EE] hover:border-[#00695C]/30 hover:shadow-md'
        }`}>
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <FiCalendar className={`text-sm relative z-10 ${isCalendarView ? 'animate-pulse' : ''}`} />
        <span className="hidden sm:inline relative z-10 truncate max-w-[140px]">
          {isCalendarView ? 'Calendar View' : displayLabel}
        </span>
        <FiChevronDown className={`text-sm relative z-10 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        {isDateActive && !isCalendarView && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#26A69A] border-2 border-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[999] animate-slide-down">
          <div className="px-4 pb-2 border-b border-[#E8F0EE] flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Date Range</p>
            {isDateActive && (
              <button onClick={() => { onClear(); setIsOpen(false); setShowCustom(false); }}
                className="text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors">
                Clear
              </button>
            )}
          </div>

          {!showCustom && (
            <div className="py-1 max-h-72 overflow-y-auto">
              {DATE_PRESETS.map(p => (
                <button key={p.key} onClick={() => handlePresetClick(p.key)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-2 hover:bg-[#F5F9F8] transition-colors ${
                    preset === p.key ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
                  }`}>
                  <span className="flex items-center gap-2">
                    <span className="w-4">{preset === p.key && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
                    <span>{p.label}</span>
                  </span>
                  {p.key === 'custom' && <FiChevronRight className="text-xs" />}
                </button>
              ))}
            </div>
          )}

          {showCustom && (
            <div className="p-3 space-y-3 animate-slide-down">
              <button onClick={() => setShowCustom(false)} className="flex items-center gap-1 text-[10px] font-bold text-[#5A7D78] hover:text-[#00695C] transition-colors">
                <FiChevronLeft className="text-xs" /> Back
              </button>
              <div>
                <label className="block text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider mb-1">Start Date</label>
                <input type="date" value={localStart} onChange={(e) => setLocalStart(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 text-sm text-[#1A2E2A] outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider mb-1">End Date</label>
                <input type="date" value={localEnd} onChange={(e) => setLocalEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 text-sm text-[#1A2E2A] outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleApplyCustom} disabled={!localStart || !localEnd}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-xs font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Apply Range
                </button>
                <button onClick={() => { setLocalStart(''); setLocalEnd(''); }}
                  className="px-3 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-xs font-medium hover:bg-[#E8F0EE] transition-all">
                  Reset
                </button>
              </div>
            </div>
          )}

          
        </div>
      )}
    </div>
  );
};

// ============================================================
// VIEW MODAL
// ============================================================
const ViewCommissionModal = ({ record, show, onClose, onEdit, onDelete }) => {
  if (!record || !show) return null;
  const typeConfig = COMMISSION_TYPE_CONFIG[record.commissionType] || COMMISSION_TYPE_CONFIG['Owner Commission'];
  const TypeIcon = typeConfig.icon;
  const statusConfig = COMMISSION_STATUS_CONFIG[record.status] || COMMISSION_STATUS_CONFIG['Pending'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white hover:scale-110"><FiX className="text-lg" /></button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${typeConfig.gradient} border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg`}><TypeIcon /></div>
            <div>
              <h2 className="text-2xl font-bold text-white">{record.recipientName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap mt-1">
                <span className="font-semibold">{record.commissionId}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>{statusConfig.label}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">Amount: {formatCurrencyFull(record.amount)}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9] space-y-5">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-5 border border-blue-100 shadow-sm">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-4"><FiTag className="text-blue-600" /> Commission Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Commission ID</p><p className="text-sm font-bold text-[#1A2E2A]">{record.commissionId}</p></div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Commission Type</p><span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-bold ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>{record.commissionType}</span></div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Amount</p><p className="text-lg font-bold text-[#1A2E2A]">{formatCurrencyFull(record.amount)}</p></div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Status</p><span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>{statusConfig.label}</span></div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Reference ID</p><p className="text-sm font-bold text-[#1A2E2A]">{record.referenceId}</p></div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Source</p><p className="text-sm font-bold text-[#1A2E2A]">{record.source}</p></div>
              <div className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm md:col-span-2"><p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">Date</p><p className="text-sm font-bold text-[#1A2E2A]">{formatDateShort(record.date)}</p></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2 mb-4"><FiUser className="text-emerald-600" /> Recipient Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-sm"><p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">Recipient Name</p><p className="text-sm font-bold text-[#1A2E2A]">{record.recipientName}</p></div>
              <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-sm"><p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">Recipient Role</p><p className="text-sm font-bold text-[#1A2E2A]">{record.recipientRole}</p></div>
              <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-sm"><p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">Email</p><p className="text-sm font-bold text-[#1A2E2A] truncate">{record.recipientEmail}</p></div>
              <div className="bg-white rounded-xl p-3 border border-emerald-100 shadow-sm"><p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">Phone</p><p className="text-sm font-bold text-[#1A2E2A]">{record.recipientPhone}</p></div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all text-sm font-medium">Close</button>
            <button onClick={() => { if (onEdit) { onEdit(record); onClose(); } }} className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"><FiEdit className="inline mr-2" /> Edit</button>
            <button onClick={() => { if (onDelete) { onDelete(record.id); } }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"><FiTrash2 className="inline mr-2" /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT MODAL
// ============================================================
const EditCommissionModal = ({ record, show, onClose, onSave }) => {
  if (!record || !show) return null;
  const [formData, setFormData] = useState({
    commissionType: '', amount: '', status: '', recipientName: '', recipientRole: '',
    recipientEmail: '', recipientPhone: '', referenceId: '', date: '', source: ''
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (record) {
      setFormData({
        commissionType: record.commissionType || '', amount: record.amount ?? '', status: record.status || 'Pending',
        recipientName: record.recipientName || '', recipientRole: record.recipientRole || '',
        recipientEmail: record.recipientEmail || '', recipientPhone: record.recipientPhone || '',
        referenceId: record.referenceId || '', date: record.date ? record.date.split('T')[0] : '', source: record.source || ''
      });
    }
  }, [record]);
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => {
      onSave({
        ...record, commissionType: formData.commissionType, amount: Number(formData.amount) || 0, status: formData.status,
        recipientName: formData.recipientName, recipientRole: formData.recipientRole,
        recipientEmail: formData.recipientEmail, recipientPhone: formData.recipientPhone,
        referenceId: formData.referenceId, date: formData.date ? new Date(formData.date).toISOString() : record.date,
        source: formData.source
      });
      setLoading(false); onClose();
    }, 600);
  };
  const inputCls = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all text-sm text-[#1A2E2A] outline-none";
  const labelCls = "block text-xs font-medium text-[#5A7D78] mb-1";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white hover:scale-110"><FiX className="text-lg" /></button>
          <h2 className="text-2xl font-bold text-white">Edit Commission</h2>
          <p className="text-white/80 text-sm">{record.commissionId} — {record.recipientName}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2"><FiTag className="text-[#00695C]" /> Commission Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>Commission Type *</label>
                  <select name="commissionType" value={formData.commissionType} onChange={handleChange} required className={inputCls}>
                    {ALL_COMMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Amount (₹) *</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" className={inputCls} />
                </div>
                <div><label className={labelCls}>Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required className={inputCls}>
                    {ALL_COMMISSION_STATUSES.map(s => <option key={s} value={s}>{COMMISSION_STATUS_CONFIG[s].label}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Source *</label>
                  <input type="text" name="source" value={formData.source} onChange={handleChange} required className={inputCls} placeholder="e.g. Villa, Project, Sale, Lead" />
                </div>
                <div><label className={labelCls}>Reference ID *</label>
                  <input type="text" name="referenceId" value={formData.referenceId} onChange={handleChange} required className={inputCls} />
                </div>
                <div><label className={labelCls}>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required className={inputCls} />
                </div>
              </div>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2"><FiUser className="text-[#00695C]" /> Recipient Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className={labelCls}>Recipient Name *</label>
                  <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} required className={inputCls} />
                </div>
                <div><label className={labelCls}>Recipient Role *</label>
                  <input type="text" name="recipientRole" value={formData.recipientRole} onChange={handleChange} required className={inputCls} />
                </div>
                <div><label className={labelCls}>Email *</label>
                  <input type="email" name="recipientEmail" value={formData.recipientEmail} onChange={handleChange} required className={inputCls} />
                </div>
                <div><label className={labelCls}>Phone *</label>
                  <input type="text" name="recipientPhone" value={formData.recipientPhone} onChange={handleChange} required className={inputCls} />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all text-sm font-medium">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">
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
// MAIN COMPONENT
// ============================================================
const CommissionRevenue = () => {
  const searchInputRef = useRef(null);

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField] = useState('date');
  const [sortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);

  const [datePreset, setDatePreset] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS (derived from filteredRecords) ============
  const stats = useMemo(() => {
    const list = filteredRecords || [];
    if (list.length === 0) {
      return { totalEarned: 0, growthPercentage: 0, pendingAmount: 0, pendingCount: 0, paidAmount: 0, paidCount: 0, sourceBreakdown: [] };
    }
    let totalEarned = 0, pendingAmount = 0, pendingCount = 0, paidAmount = 0, paidCount = 0;
    const sourceMap = {};
    ALL_COMMISSION_TYPES.forEach(type => { sourceMap[type] = { amount: 0, count: 0 }; });
    list.forEach(r => {
      const amount = Number(r.amount) || 0;
      totalEarned += amount;
      if (r.status === 'Pending') { pendingAmount += amount; pendingCount++; }
      else if (r.status === 'Paid') { paidAmount += amount; paidCount++; }
      if (sourceMap[r.commissionType]) { sourceMap[r.commissionType].amount += amount; sourceMap[r.commissionType].count++; }
    });
    const sourceBreakdown = Object.entries(sourceMap)
      .map(([type, data]) => ({ type, ...data }))
      .filter(s => s.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    return { totalEarned, growthPercentage: 12.8, pendingAmount, pendingCount, paidAmount, paidCount, sourceBreakdown };
  }, [filteredRecords]);

  // ============ MOCK DATA ============
  const generateMockData = useCallback(() => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vikram', 'Lakshmi', 'Naveen', 'Deepa'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Krishnan', 'Varma'];
    const sources = ['Villa', 'Project', 'Sale', 'Lead', 'Apartment', 'Plot', 'Commercial', 'Rental'];
    const now = new Date();
    const list = [];
    for (let i = 1; i <= 45; i++) {
      const type = ALL_COMMISSION_TYPES[Math.floor(Math.random() * ALL_COMMISSION_TYPES.length)];
      const status = ALL_COMMISSION_STATUSES[Math.floor(Math.random() * ALL_COMMISSION_STATUSES.length)];
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const source = sources[Math.floor(Math.random() * sources.length)];
      let role = 'Owner';
      if (type.startsWith('Agent')) role = 'Agent';
      else if (type.startsWith('Builder')) role = 'Builder';
      else if (type.startsWith('Property')) role = 'Property Manager';
      else if (type.startsWith('Platform')) role = 'Platform';
      else if (type.startsWith('Lead')) role = 'Lead';
      const daysAgo = Math.floor(Math.random() * 400);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      let baseAmount = 50000;
      if (type.includes('Agent')) baseAmount = 25000;
      else if (type.includes('Builder')) baseAmount = 75000;
      else if (type.includes('Property Manager')) baseAmount = 60000;
      else if (type.includes('Platform')) baseAmount = 15000;
      else if (type.includes('Lead')) baseAmount = 5000;
      const amount = baseAmount + Math.floor(Math.random() * 20000);
      let prefix = 'COM';
      if (type.startsWith('Owner')) prefix = 'OWN';
      else if (type.startsWith('Agent')) prefix = 'AGT';
      else if (type.startsWith('Builder')) prefix = 'BLD';
      else if (type.startsWith('Property')) prefix = 'PRP';
      else if (type.startsWith('Platform')) prefix = 'PLT';
      else if (type.startsWith('Lead')) prefix = 'LED';
      list.push({
        id: `COMM-${String(i).padStart(4, '0')}`,
        commissionId: `${prefix}-${String(i).padStart(3, '0')}`,
        commissionType: type, amount, status,
        recipientName: name, recipientRole: role,
        recipientEmail: `${name.toLowerCase().replace(' ', '.')}${i}@mail.com`,
        recipientPhone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
        referenceId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        source, date: date.toISOString()
      });
    }
    return list;
  }, []);

  useEffect(() => {
    try {
      const mockRecords = generateMockData();
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
    } catch (error) { console.error('Error generating mock commission data:', error); }
  }, [generateMockData]);

  // ============ ACTIVE DATE RANGE ============
  const activeDateRange = useMemo(() => {
    if (datePreset === 'custom' && customStart && customEnd) {
      return {
        start: new Date(new Date(customStart).setHours(0, 0, 0, 0)),
        end: new Date(new Date(customEnd).setHours(23, 59, 59, 999))
      };
    }
    if (datePreset && datePreset !== 'all' && datePreset !== 'custom') {
      const range = getPresetRange(datePreset);
      return { start: range.start, end: range.end };
    }
    return { start: null, end: null };
  }, [datePreset, customStart, customEnd]);

  // ============ FILTER RECORDS ============
  const filterRecords = useCallback(() => {
    try {
      let filtered = [...records];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          (r.commissionId && r.commissionId.toLowerCase().includes(query)) ||
          (r.id && r.id.toLowerCase().includes(query)) ||
          (r.commissionType && r.commissionType.toLowerCase().includes(query)) ||
          (r.recipientName && r.recipientName.toLowerCase().includes(query)) ||
          (r.recipientRole && r.recipientRole.toLowerCase().includes(query)) ||
          (r.recipientEmail && r.recipientEmail.toLowerCase().includes(query)) ||
          (r.referenceId && r.referenceId.toLowerCase().includes(query)) ||
          (r.source && r.source.toLowerCase().includes(query)) ||
          (r.status && r.status.toLowerCase().includes(query)) ||
          (String(r.amount).includes(query))
        );
      }
      if (activeStatus !== 'all') filtered = filtered.filter(r => r.status === activeStatus);
      if (activeType !== 'all') filtered = filtered.filter(r => r.commissionType === activeType);
      if (activeDateRange.start && activeDateRange.end) {
        filtered = filtered.filter(r => {
          const rd = new Date(r.date).getTime();
          return rd >= activeDateRange.start.getTime() && rd <= activeDateRange.end.getTime();
        });
      }
      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activeType !== 'all') count++;
      if (searchQuery) count++;
      if (datePreset && datePreset !== 'all') count++;
      setFilterCount(count);
      filtered.sort((a, b) => {
        let aVal, bVal;
        if (sortField === 'amount') { aVal = Number(a.amount); bVal = Number(b.amount); }
        else if (sortField === 'date') { aVal = new Date(a.date).getTime(); bVal = new Date(b.date).getTime(); }
        else { aVal = a[sortField] || ''; bVal = b[sortField] || ''; if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); } }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setFilteredRecords(filtered);
      setCurrentPage(1);
    } catch (error) { console.error('Error filtering commission records:', error); }
  }, [records, searchQuery, activeStatus, activeType, sortField, sortDirection, activeDateRange, datePreset]);

  useEffect(() => { filterRecords(); }, [filterRecords]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // ============ SELECTION ============
  const handleSelectAll = useCallback(() => {
    if (selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0) setSelectedRecords([]);
    else setSelectedRecords(paginatedRecords.map(r => r.id));
  }, [selectedRecords, paginatedRecords]);

  const handleSelectRecord = useCallback((recordId) => {
    setSelectedRecords(prev => prev.includes(recordId) ? prev.filter(id => id !== recordId) : [...prev, recordId]);
  }, []);

  // ============ VIEW / EDIT / SAVE ============
  const handleViewRecord = useCallback((record) => { setViewingRecord(record); setShowViewModal(true); }, []);
  const handleEditRecord = useCallback((record) => { setEditingRecord(record); setShowEditModal(true); }, []);

  const handleSaveRecord = useCallback((updatedRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setToast({ message: `Commission "${updatedRecord.commissionId}" updated successfully`, type: 'success' });
  }, []);

  // ============ DELETE ============
  const handleDeleteRecord = useCallback((recordId) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;
    setConfirmationModal({
      isOpen: true, title: 'Delete Commission Record',
      message: `Are you sure you want to delete commission "${record.commissionId}" for ${record.recipientName}?`,
      confirmText: 'Delete', cancelText: 'Cancel', type: 'danger',
      onConfirm: () => {
        setActionLoading(recordId);
        setTimeout(() => {
          setRecords(prev => prev.filter(r => r.id !== recordId));
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted commission "${record.commissionId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [records]);

  // ============ STATUS CARD CLICK ============
  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActiveType('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveType('all');
    setDatePreset('all');
    setCustomStart('');
    setCustomEnd('');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ DATE HANDLERS ============
  const handlePresetChange = useCallback((preset) => {
    setDatePreset(preset);
    setCustomStart('');
    setCustomEnd('');
    const r = getPresetRange(preset);
    if (preset !== 'all') setToast({ message: `Showing: ${r.label}`, type: 'success' });
    else setToast({ message: 'Showing: All Time', type: 'info' });
  }, []);

  const handleCustomChange = useCallback((start, end) => {
    setDatePreset('custom');
    setCustomStart(start);
    setCustomEnd(end);
    setToast({ message: `Showing: ${formatDateShort(start)} → ${formatDateShort(end)}`, type: 'success' });
  }, []);

  const handleClearDate = useCallback(() => {
    setDatePreset('all');
    setCustomStart('');
    setCustomEnd('');
    setToast({ message: 'Date filter cleared', type: 'info' });
  }, []);

  const toggleCalendarView = useCallback(() => {
    setViewMode(prev => prev === 'calendar' ? 'grid' : 'calendar');
  }, []);

  // ============ REFRESH / EXPORT / BULK DELETE ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockRecords = generateMockData();
        setRecords(mockRecords);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockData]);

  const handleExport = useCallback(() => {
    if (filteredRecords.length === 0) { setToast({ message: 'No data to export', type: 'warning' }); return; }
    try {
      const data = filteredRecords.map(r => ({
        'Commission ID': r.commissionId, 'Commission Type': r.commissionType,
        'Amount': r.amount, 'Status': r.status,
        'Recipient Name': r.recipientName, 'Recipient Role': r.recipientRole,
        'Recipient Email': r.recipientEmail, 'Recipient Phone': r.recipientPhone,
        'Reference ID': r.referenceId, 'Source': r.source,
        'Date': r.date ? new Date(r.date).toLocaleDateString('en-IN') : ''
      }));
      const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commission_revenue_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredRecords.length} records exported successfully`, type: 'success' });
    } catch (error) { setToast({ message: 'Error exporting data', type: 'error' }); }
  }, [filteredRecords]);

  const handleBulkDelete = useCallback(() => {
    if (selectedRecords.length === 0) { setToast({ message: 'Please select commissions first', type: 'warning' }); return; }
    setConfirmationModal({
      isOpen: true, title: 'Delete Selected Commissions',
      message: `Are you sure you want to delete ${selectedRecords.length} selected commission(s)?`,
      confirmText: 'Delete All', cancelText: 'Cancel', type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedRecords);
          const count = records.filter(r => selectedIds.has(r.id)).length;
          setRecords(prev => prev.filter(r => !selectedIds.has(r.id)));
          setSelectedRecords([]);
          setActionLoading(null);
          setToast({ message: `${count} commission(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedRecords, records]);

  const statusOptions = ALL_COMMISSION_STATUSES.map(s => ({ value: s, label: COMMISSION_STATUS_CONFIG[s].label }));
  const typeOptions = ALL_COMMISSION_TYPES.map(t => ({ value: t, label: t }));

  const maxSourceAmount = useMemo(() => {
    if (stats.sourceBreakdown.length === 0) return 1;
    return Math.max(...stats.sourceBreakdown.map(s => s.amount));
  }, [stats.sourceBreakdown]);

  // ============ CALENDAR VIEW HELPERS ============
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear(), month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dayRecords = filteredRecords.filter(r => {
        const rd = new Date(r.date);
        return rd.getFullYear() === year && rd.getMonth() === month && rd.getDate() === d;
      });
      days.push({
        day: d, date: new Date(year, month, d), records: dayRecords,
        totalAmount: dayRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0),
        count: dayRecords.length
      });
    }
    return days;
  }, [calendarDate, filteredRecords]);

  const calendarMonthStats = useMemo(() => {
    const year = calendarDate.getFullYear(), month = calendarDate.getMonth();
    const monthRecords = filteredRecords.filter(r => {
      const rd = new Date(r.date);
      return rd.getFullYear() === year && rd.getMonth() === month;
    });
    return { count: monthRecords.length, total: monthRecords.reduce((s, r) => s + Number(r.amount || 0), 0) };
  }, [calendarDate, filteredRecords]);

  const goToPrevMonth = () => { setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)); setSelectedCalendarDay(null); };
  const goToNextMonth = () => { setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)); setSelectedCalendarDay(null); };
  const goToToday = () => { setCalendarDate(new Date()); setSelectedCalendarDay(new Date().getDate()); };

  const selectedDayRecords = useMemo(() => {
    if (!selectedCalendarDay) return [];
    const year = calendarDate.getFullYear(), month = calendarDate.getMonth();
    return filteredRecords.filter(r => {
      const rd = new Date(r.date);
      return rd.getFullYear() === year && rd.getMonth() === month && rd.getDate() === selectedCalendarDay;
    });
  }, [selectedCalendarDay, calendarDate, filteredRecords]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => { if (confirmationModal.onCancel) confirmationModal.onCancel(); setConfirmationModal(prev => ({ ...prev, isOpen: false })); }}
        onConfirm={() => { if (confirmationModal.onConfirm) confirmationModal.onConfirm(); }}
        title={confirmationModal.title} message={confirmationModal.message}
        confirmText={confirmationModal.confirmText} cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {showViewModal && viewingRecord && (
        <ViewCommissionModal record={viewingRecord} show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingRecord(null); }}
          onEdit={handleEditRecord} onDelete={handleDeleteRecord} />
      )}

      {showEditModal && editingRecord && (
        <EditCommissionModal record={editingRecord} show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingRecord(null); }}
          onSave={handleSaveRecord} />
      )}

      {/* ============ HEADER ============ */}
      <div className="relative z-50 animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Commission & Revenue
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredRecords.length} Records
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filter{filterCount > 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track and manage commissions across Owners, Agents, Builders, Property Managers, Platform and Leads</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <CalendarMenu
              preset={datePreset} customStart={customStart} customEnd={customEnd}
              onPresetChange={handlePresetChange} onCustomChange={handleCustomChange}
              onClear={handleClearDate}
              viewMode={viewMode} onToggleCalendarView={toggleCalendarView}
            />
            <button onClick={handleRefresh} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all text-sm font-medium text-[#1A2E2A] hover:scale-105">
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============ SUMMARY ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-slide-in">
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <FiDollarSign className="text-white text-sm" />
                </div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Total Commission Earned</p>
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-white mb-3">{formatCurrency(stats.totalEarned)}</p>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-emerald-400/20 text-emerald-100 text-xs font-bold px-2 py-1 rounded-full border border-emerald-300/30">
                  <FiArrowUpRight className="text-xs" /> {stats.growthPercentage}%
                </span>
                <span className="text-white/60 text-xs">vs last period</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><FiClock className="text-amber-600 text-sm" /></div>
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending</p>
              </div>
              <p className="text-xl font-bold text-[#1A2E2A]">{formatCurrency(stats.pendingAmount)}</p>
              <p className="text-[11px] text-amber-600 mt-1 font-medium">{stats.pendingCount} Transactions</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center"><FiCheckCircle className="text-blue-600 text-sm" /></div>
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Paid</p>
              </div>
              <p className="text-xl font-bold text-[#1A2E2A]">{formatCurrency(stats.paidAmount)}</p>
              <p className="text-[11px] text-blue-600 mt-1 font-medium">{stats.paidCount} Payments</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider flex items-center gap-2">
              <FiPieChart className="text-[#00695C]" /> Commission Overview
            </h3>
            <span className="text-[10px] text-[#5A7D78] bg-[#F5F9F8] px-2 py-1 rounded-full font-semibold">Distribution</span>
          </div>
          <div className="space-y-3">
            {stats.sourceBreakdown.length === 0 ? (
              <p className="text-xs text-[#5A7D78] text-center py-6">No data for this range</p>
            ) : stats.sourceBreakdown.map((source) => {
              const config = COMMISSION_TYPE_CONFIG[source.type] || COMMISSION_TYPE_CONFIG['Owner Commission'];
              const percentage = (source.amount / maxSourceAmount) * 100;
              const Icon = config.icon;
              return (
                <div key={source.type} className="flex items-center gap-3">
                  <div className="w-36 flex-shrink-0 flex items-center gap-2">
                    <Icon className={`text-sm ${config.text}`} />
                    <span className="text-xs font-medium text-[#1A2E2A] truncate">{config.short}</span>
                  </div>
                  <div className="flex-1 bg-[#F5F9F8] rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-20 text-right flex-shrink-0"><span className="text-xs font-bold text-[#1A2E2A]">{formatCurrency(source.amount)}</span></div>
                  <div className="w-12 text-right flex-shrink-0"><span className="text-[10px] text-[#5A7D78] font-medium">{source.count} txns</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ STATUS CARDS ============ */}
      <div className="relative animate-slide-in">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex items-center justify-center">
              <FiActivity className="text-[#00695C] relative z-10" />
              <span className="absolute inset-0 rounded-full bg-[#26A69A]/30 animate-ping" />
            </span>
            Commission Status
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { key: 'all', label: 'Total', icon: FiLayers, count: filteredRecords.length,
              theme: { grad: 'from-teal-500 via-emerald-500 to-teal-600', ring: 'ring-teal-500/25', activeBorder: 'border-teal-500', glow: 'shadow-teal-500/40', bar: 'bg-gradient-to-r from-teal-500 to-emerald-500', blob1: 'bg-teal-300/40', blob2: 'bg-emerald-300/30' },
              onClick: handleTotalClick, isActive: activeStatus === 'all' && activeType === 'all' && !searchQuery },
            { key: 'Earned', label: 'Earned', icon: FiCheckCircle, count: filteredRecords.filter(r => r.status === 'Earned').length,
              theme: { grad: 'from-emerald-500 via-teal-500 to-emerald-600', ring: 'ring-emerald-500/25', activeBorder: 'border-emerald-500', glow: 'shadow-emerald-500/40', bar: 'bg-gradient-to-r from-emerald-500 to-teal-500', blob1: 'bg-emerald-300/40', blob2: 'bg-teal-300/30' },
              onClick: () => handleStatusClick('Earned'), isActive: activeStatus === 'Earned' },
            { key: 'Pending', label: 'Pending', icon: FiClock, count: filteredRecords.filter(r => r.status === 'Pending').length,
              theme: { grad: 'from-amber-500 via-orange-500 to-amber-600', ring: 'ring-amber-500/25', activeBorder: 'border-amber-500', glow: 'shadow-amber-500/40', bar: 'bg-gradient-to-r from-amber-500 to-orange-500', blob1: 'bg-amber-300/40', blob2: 'bg-orange-300/30' },
              onClick: () => handleStatusClick('Pending'), isActive: activeStatus === 'Pending' },
            { key: 'Paid', label: 'Paid', icon: FiDollarSign, count: filteredRecords.filter(r => r.status === 'Paid').length,
              theme: { grad: 'from-blue-500 via-indigo-500 to-blue-600', ring: 'ring-blue-500/25', activeBorder: 'border-blue-500', glow: 'shadow-blue-500/40', bar: 'bg-gradient-to-r from-blue-500 to-indigo-500', blob1: 'bg-blue-300/40', blob2: 'bg-indigo-300/30' },
              onClick: () => handleStatusClick('Paid'), isActive: activeStatus === 'Paid' },
            { key: 'Failed', label: 'Failed', icon: FiXCircle, count: filteredRecords.filter(r => r.status === 'Failed').length,
              theme: { grad: 'from-red-500 via-rose-500 to-red-600', ring: 'ring-red-500/25', activeBorder: 'border-red-500', glow: 'shadow-red-500/40', bar: 'bg-gradient-to-r from-red-500 to-rose-500', blob1: 'bg-red-300/40', blob2: 'bg-rose-300/30' },
              onClick: () => handleStatusClick('Failed'), isActive: activeStatus === 'Failed' },
          ].map((card, idx) => {
            const Icon = card.icon;
            const t = card.theme;
            return (
              <button key={card.key} type="button" onClick={card.onClick}
                style={{ animationDelay: `${idx * 70}ms` }}
                className={`group relative overflow-hidden text-left bg-white rounded-2xl px-3 py-3 sm:px-4 sm:py-3.5 border transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 animate-slide-in ${
                  card.isActive ? `${t.activeBorder} ring-2 ${t.ring} shadow-lg` : 'border-[#E8F0EE]'
                }`}>
                <span className={`absolute top-0 left-0 right-0 h-[3px] ${t.bar} origin-left transition-transform duration-500 ${card.isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                <span className={`pointer-events-none absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl ${t.blob1} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <span className={`pointer-events-none absolute -bottom-8 -left-4 w-24 h-24 rounded-full blur-3xl ${t.blob2} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1100ms] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br ${t.grad} text-white shadow-lg ${t.glow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]`}>
                      <Icon className="text-base sm:text-lg" />
                    </div>
                    {card.isActive && <span className={`absolute inset-0 rounded-2xl ring-2 ${t.activeBorder} opacity-60 animate-ping`} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider leading-tight">{card.label}</p>
                    <p className="text-lg sm:text-xl font-extrabold text-[#1A2E2A] leading-tight tabular-nums">{card.count}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ SEARCH & FILTERS ============ */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input ref={searchInputRef} type="text"
            placeholder="Search by commission ID, recipient name, type, reference ID..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
              <FiX className="text-sm" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-5">
          <FilterDropdown label="Type" options={typeOptions} value={activeType} onChange={setActiveType} icon={FiTag} allLabel="All Types" />
          <FilterDropdown label="Status" options={statusOptions} value={activeStatus} onChange={setActiveStatus} icon={FiActivity} allLabel="All Statuses" />
          {filterCount > 0 && (
            <button onClick={clearAllFilters} className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all text-sm font-medium flex items-center gap-1 hover:scale-105 whitespace-nowrap">
              <FiX className="text-sm" /> Clear All
            </button>
          )}

          <div className="ml-auto flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE] flex-shrink-0">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="Grid View">
              <FiGridIcon className="text-sm" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="List View">
              <FiList className="text-sm" />
            </button>
          </div>
        </div>

        {selectedRecords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedRecords.length}</span> commission(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleBulkDelete} disabled={actionLoading === 'bulk-delete'} className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50">
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />} Delete All
              </button>
              <button onClick={() => setSelectedRecords([])} className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all text-xs font-medium hover:scale-105">Clear</button>
            </div>
          </div>
        )}
      </div>

      {/* ============ TRANSACTIONS ============ */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider flex items-center gap-2">
            <FiLayers className="text-[#00695C]" /> Commission Transactions
          </h3>
          <span className="text-[10px] text-[#5A7D78] bg-[#F5F9F8] px-2 py-1 rounded-full font-semibold">{filteredRecords.length} Total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'calendar' ? (
          /* CALENDAR VIEW */
          <div className="space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-2xl p-4 flex items-center justify-between shadow-lg flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button onClick={goToPrevMonth} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white hover:scale-110"><FiChevronLeft className="text-lg" /></button>
                <div className="min-w-[180px] text-center">
                  <h2 className="text-xl font-bold text-white leading-tight">{calendarDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2>
                  <p className="text-white/70 text-[11px] font-medium">{calendarMonthStats.count} commissions · {formatCurrency(calendarMonthStats.total)}</p>
                </div>
                <button onClick={goToNextMonth} className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white hover:scale-110"><FiChevronRight className="text-lg" /></button>
              </div>
              <button onClick={goToToday} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 flex items-center gap-2">
                <FiCalendar className="text-sm" /> Today
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
              <div className="grid grid-cols-7 bg-[#F5F9F8] border-b border-[#E8F0EE]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="py-2.5 text-center text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((cell, idx) => {
                  if (!cell) return <div key={`empty-${idx}`} className="min-h-[100px] border-r border-b border-[#E8F0EE] bg-[#FAFCFB]" />;
                  const today = new Date();
                  const isToday = cell.date.getDate() === today.getDate() && cell.date.getMonth() === today.getMonth() && cell.date.getFullYear() === today.getFullYear();
                  const isSelected = selectedCalendarDay === cell.day;
                  const hasRecords = cell.count > 0;
                  return (
                    <button key={`day-${cell.day}`} type="button"
                      onClick={() => setSelectedCalendarDay(isSelected ? null : cell.day)}
                      className={`group relative min-h-[100px] border-r border-b border-[#E8F0EE] p-2 text-left transition-all hover:bg-[#F5F9F8] ${isSelected ? 'bg-[#E8F4F2] ring-2 ring-inset ring-[#00695C]' : ''}`}>
                      <div className="flex items-start justify-between mb-1">
                        <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isToday ? 'bg-gradient-to-br from-[#00695C] to-[#26A69A] text-white shadow-md' :
                          isSelected ? 'bg-[#00695C] text-white' : 'text-[#1A2E2A] group-hover:bg-[#E8F0EE]'
                        }`}>{cell.day}</span>
                        {hasRecords && <span className="text-[9px] font-bold text-[#00695C] bg-[#E8F4F2] px-1.5 py-0.5 rounded-full">{cell.count}</span>}
                      </div>
                      {hasRecords && (
                        <>
                          <p className="text-[10px] font-bold text-[#1A2E2A] mb-1 truncate">{formatCurrency(cell.totalAmount)}</p>
                          <div className="flex flex-wrap gap-1">
                            {ALL_COMMISSION_STATUSES.map(s => {
                              const cnt = cell.records.filter(r => r.status === s).length;
                              if (cnt === 0) return null;
                              const sc = COMMISSION_STATUS_CONFIG[s];
                              return <span key={s} title={`${cnt} ${sc.label}`} className={`w-4 h-4 rounded-full ${sc.bg} ${sc.text} border ${sc.border} text-[8px] font-bold flex items-center justify-center`}>{cnt}</span>;
                            })}
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedCalendarDay && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden animate-slide-up">
                <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><FiCalendar className="text-white" /></div>
                    <div>
                      <h3 className="text-white font-bold">
                        {new Date(calendarDate.getFullYear(), calendarDate.getMonth(), selectedCalendarDay).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                      <p className="text-white/70 text-[11px] font-medium">
                        {selectedDayRecords.length} commission{selectedDayRecords.length !== 1 ? 's' : ''} · {formatCurrency(selectedDayRecords.reduce((s, r) => s + Number(r.amount || 0), 0))}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCalendarDay(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110"><FiX /></button>
                </div>
                {selectedDayRecords.length === 0 ? (
                  <div className="p-8 text-center"><p className="text-sm text-[#5A7D78] font-medium">No commissions on this day</p></div>
                ) : (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedDayRecords.map(r => {
                      const tc = COMMISSION_TYPE_CONFIG[r.commissionType] || COMMISSION_TYPE_CONFIG['Owner Commission'];
                      const TypeIcon = tc.icon;
                      const sc = COMMISSION_STATUS_CONFIG[r.status] || COMMISSION_STATUS_CONFIG['Pending'];
                      return (
                        <div key={r.id} onClick={() => handleViewRecord(r)} className="flex items-start gap-2.5 bg-[#F8FAF9] rounded-xl p-3 border border-[#E8F0EE] hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer">
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${tc.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            {r.recipientName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-[#1A2E2A] truncate">{r.recipientName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <p className="text-[10px] font-semibold text-[#5A7D78]">{r.commissionId}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${sc.bg} ${sc.text} border ${sc.border}`}>{sc.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <span className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${tc.bg} ${tc.text} border ${tc.border}`}>
                                <TypeIcon className="text-[9px]" />{tc.short}
                              </span>
                              <span className="text-[11px] font-bold text-[#00695C]">{formatCurrencyFull(r.amount)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedRecords.map((record, index) => {
              const isSelected = selectedRecords.includes(record.id);
              const typeConfig = COMMISSION_TYPE_CONFIG[record.commissionType] || COMMISSION_TYPE_CONFIG['Owner Commission'];
              const TypeIcon = typeConfig.icon;
              const statusConfig = COMMISSION_STATUS_CONFIG[record.status] || COMMISSION_STATUS_CONFIG['Pending'];
              return (
                <div key={record.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-start gap-2 mb-2">
                    <input type="checkbox" checked={isSelected} onChange={() => handleSelectRecord(record.id)} className="w-4 h-4 mt-1 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2" />
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {record.recipientName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[15px] text-[#1A2E2A] truncate leading-tight">{record.recipientName}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <p className="text-[11px] font-semibold text-[#5A7D78]">{record.commissionId}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>{statusConfig.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2.5 pl-6">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                      <TypeIcon className="text-[10px]" />{typeConfig.short}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">Source: {record.source}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-bold text-[#1A2E2A] text-xs">Amount: {formatCurrencyFull(record.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{formatDateShort(record.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button type="button" onClick={() => handleViewRecord(record)} className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all flex items-center justify-center gap-1 hover:scale-105"><FiEye className="text-[10px]" /> View</button>
                    <button type="button" onClick={() => handleEditRecord(record)} className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all flex items-center justify-center gap-1 hover:scale-105"><FiEdit className="text-[10px]" /> Edit</button>
                    <button type="button" onClick={() => handleDeleteRecord(record.id)} disabled={actionLoading === record.id} className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50">
                      {actionLoading === record.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />} Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

               ) : (
          /* LIST VIEW — No overflow, natural fit */
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-3 sm:px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-[10px] sm:text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 flex-shrink-0" />
                <span>ID</span>
              </div>
              <div className="col-span-3 min-w-0 truncate">Recipient</div>
              <div className="col-span-1 min-w-0 truncate">Type</div>
              <div className="col-span-1 min-w-0 truncate">Source</div>
              <div className="col-span-1 min-w-0 text-right">Amount</div>
              <div className="col-span-1 min-w-0 text-center">Status</div>
              <div className="col-span-1 min-w-0 text-center">Date</div>
              <div className="col-span-2 min-w-0 text-right">Actions</div>
            </div>

            {paginatedRecords.map((record, index) => {
              const isSelected = selectedRecords.includes(record.id);
              const typeConfig = COMMISSION_TYPE_CONFIG[record.commissionType] || COMMISSION_TYPE_CONFIG['Owner Commission'];
              const TypeIcon = typeConfig.icon;
              const statusConfig = COMMISSION_STATUS_CONFIG[record.status] || COMMISSION_STATUS_CONFIG['Pending'];
              return (
                <div key={record.id}
                  className={`grid grid-cols-12 gap-2 items-center py-2.5 px-3 sm:px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}>
                  <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                    <input type="checkbox" checked={isSelected} onChange={() => handleSelectRecord(record.id)} className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 flex-shrink-0" />
                    <p className="text-[11px] font-bold text-[#00695C] truncate">{record.commissionId}</p>
                  </div>
                  <div className="col-span-3 min-w-0 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                      {record.recipientName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[13px] text-[#1A2E2A] truncate leading-tight">{record.recipientName}</p>
                      <p className="text-[10px] text-[#5A7D78] truncate leading-tight">{record.recipientRole}</p>
                    </div>
                  </div>
                  <div className="col-span-1 min-w-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border} truncate max-w-full`}>
                      <TypeIcon className="text-[9px] flex-shrink-0" />
                      <span className="truncate">{typeConfig.short}</span>
                    </span>
                  </div>
                  <div className="col-span-1 min-w-0 text-[11px] font-medium text-[#5A7D78] truncate">{record.source}</div>
                  <div className="col-span-1 min-w-0 text-[11px] font-bold text-[#1A2E2A] text-right whitespace-nowrap">{formatCurrencyFull(record.amount)}</div>
                  <div className="col-span-1 min-w-0 text-center">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} inline-block whitespace-nowrap`}>{statusConfig.label}</span>
                  </div>
                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] text-center whitespace-nowrap">{formatDateCompact(record.date)}</div>
                  <div className="col-span-2 min-w-0 flex items-center justify-end gap-0.5 flex-nowrap">
                    <button type="button" onClick={() => handleViewRecord(record)} className="w-6 h-6 rounded-lg hover:bg-[#E8F4F2] transition-all flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0" title="View"><FiEye className="text-[13px]" /></button>
                    <button type="button" onClick={() => handleEditRecord(record)} className="w-6 h-6 rounded-lg hover:bg-[#E8F4F2] transition-all flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0" title="Edit"><FiEdit className="text-[13px]" /></button>
                    <button type="button" onClick={() => handleDeleteRecord(record.id)} disabled={actionLoading === record.id} className="w-6 h-6 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0" title="Delete">
                      {actionLoading === record.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[13px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedRecords.length === 0 && !loading && viewMode !== 'calendar' && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiPieChart className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No commission records found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No commission records have been generated yet'}
            </p>
            {filterCount > 0 && (
              <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105">
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ============ PAGINATION ============ */}
      {totalPages > 1 && viewMode !== 'calendar' && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} commissions
            </span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 font-medium">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 hover:scale-110"><FiChevronLeft className="text-sm" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 rounded-xl transition-all text-sm font-bold hover:scale-110 ${currentPage === pageNum ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 hover:scale-110"><FiChevronRight className="text-sm" /></button>
          </div>
        </div>
      )}

      {/* ============ ANIMATIONS ============ */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
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

export default CommissionRevenue;