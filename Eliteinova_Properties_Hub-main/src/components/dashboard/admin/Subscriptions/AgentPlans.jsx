// src/components/admin/Subscriptions/AgentPlans.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiMapPin, FiTag, FiSave, FiFileText, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiHome, FiBriefcase, FiGlobe,
  FiMap, FiActivity, FiUser, FiMail, FiPhone, FiGift, FiAward, FiLayers,
  FiDollarSign, FiCalendar, FiPlus, FiMinus, FiStar, FiPackage, FiCheck,
  FiUsers, FiSettings, FiTrendingUp, FiPercent, FiBox, FiZap
} from 'react-icons/fi';
import { FaCity, FaCrown, FaHome, FaHotel, FaRupeeSign, FaBuilding } from 'react-icons/fa';

// ============================================================
// COLOR THEME HELPERS
// A plan's visual identity is fully driven by a single "colorHex"
// value. Everything else (gradient, tints, borders, text) is
// derived from it, so editing the color theme in the Edit Plan
// modal actually changes how the plan looks everywhere.
// ============================================================
const hexToRgb = (hex) => {
  if (!hex) return { r: 0, g: 105, b: 92 };
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
  const bigint = parseInt(clean, 16);
  if (Number.isNaN(bigint)) return { r: 0, g: 105, b: 92 };
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

const rgba = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const shade = (hex, percent) => {
  const { r, g, b } = hexToRgb(hex);
  const amt = Math.round(2.55 * percent);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const nr = clamp(r + amt), ng = clamp(g + amt), nb = clamp(b + amt);
  return `rgb(${nr}, ${ng}, ${nb})`;
};

const deriveTheme = (hex) => {
  const safeHex = hex && /^#?[0-9A-Fa-f]{3,6}$/.test(hex) ? (hex.startsWith('#') ? hex : `#${hex}`) : '#00695C';
  return {
    hex: safeHex,
    gradient: `linear-gradient(135deg, ${safeHex} 0%, ${shade(safeHex, 28)} 100%)`,
    bgTint: rgba(safeHex, 0.08),
    borderTint: rgba(safeHex, 0.28),
    iconTint: rgba(safeHex, 0.14),
    textColor: shade(safeHex, -18)
  };
};

const FALLBACK_THEME = deriveTheme('#94A3B8');

// ============================================================
// DEFAULT AGENT PLAN TYPES - Clean version (no limits/capabilities)
// ============================================================
const DEFAULT_PLAN_TYPES = {
  'Basic': {
    id: 'plan_basic',
    name: 'Basic',
    icon: FiGift,
    colorHex: '#64748B',
    theme: deriveTheme('#64748B'),
    label: 'Basic',
    price: 0,
    billingCycle: 'monthly',
    description: 'Basic starter plan for individual agents to get started with property listings',
    features: [
      'List up to 5 properties',
      'Basic search visibility',
      'Email support',
      '30-day listing duration',
      'Basic analytics dashboard'
    ],
    isActive: true,
    createdAt: '2024-01-01'
  },
  'Professional': {
    id: 'plan_professional',
    name: 'Professional',
    icon: FiAward,
    colorHex: '#2563EB',
    theme: deriveTheme('#2563EB'),
    label: 'Professional',
    price: 999,
    billingCycle: 'monthly',
    description: 'Best for professional agents and growing real estate businesses',
    features: [
      'List up to 25 properties',
      'High search visibility',
      'Phone & email support',
      '90-day listing duration',
      '10 featured listings per month',
      'Advanced analytics dashboard',
      'Verified badge',
      'Priority customer support',
      'Lead management tools'
    ],
    isActive: true,
    createdAt: '2024-01-01'
  },
  'Enterprise': {
    id: 'plan_enterprise',
    name: 'Enterprise',
    icon: FaCrown,
    colorHex: '#9333EA',
    theme: deriveTheme('#9333EA'),
    label: 'Enterprise',
    price: 2999,
    billingCycle: 'monthly',
    description: 'Premium plan for large agencies and enterprise clients with unlimited access',
    features: [
      'Unlimited property listings',
      'Top search visibility & ranking',
      '24/7 dedicated support',
      '365-day listing duration',
      'Unlimited featured listings',
      'Premium analytics & reports',
      'Verified business badge',
      'Dedicated account manager',
      'API access',
      'Custom branding options',
      'Team collaboration tools',
      'White-label solutions'
    ],
    isActive: true,
    createdAt: '2024-01-01'
  }
};

// ============================================================
// PROPERTY TYPE CONFIG (owner's listed property category)
// Each property type gets its own distinct color identity so it
// reads at a glance in grid cards, list rows, and the detail modal.
// ============================================================
const PROPERTY_TYPE_CONFIG = {
  'Individual': {
    icon: FiUser,
    color: 'from-sky-600 to-sky-400',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200'
  },
  'Apartment': {
    icon: FaHome,
    color: 'from-teal-600 to-teal-400',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200'
  },
  'Commercial': {
    icon: FiBriefcase,
    color: 'from-indigo-600 to-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200'
  },
  'Land & Plots': {
    icon: FiMap,
    color: 'from-amber-700 to-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  'Hostel': {
    icon: FaHotel,
    color: 'from-rose-600 to-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200'
  }
};

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

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
    danger: { icon: 'text-red-600', bg: 'bg-red-50', button: 'bg-red-600 hover:bg-red-700', border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700', border: 'border-amber-200' },
    info: { icon: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-blue-600 hover:bg-blue-700', border: 'border-blue-200' }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
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
// VIEW AGENT DETAIL MODAL
// ============================================================
const ViewAgentDetailModal = ({ agent, show, onClose, onEdit, onDelete, planTypes }) => {
  if (!agent || !show) return null;

  const planConfig = planTypes[agent.subscriptionPlan] || planTypes['Basic'] || { theme: FALLBACK_THEME, label: agent.subscriptionPlan, icon: FiPackage };
  const theme = planConfig.theme || FALLBACK_THEME;
  const PlanIcon = planConfig.icon || FiPackage;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[agent.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 p-6 rounded-t-3xl z-10 shrink-0" style={{ background: theme.gradient }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg" style={{ background: 'rgba(255,255,255,0.22)' }}>
              <PlanIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/25 text-white border border-white/30">
                  {planConfig.label} Plan
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>ID: {agent.ownerId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
              <PropTypeIcon className="text-xs" /> {agent.propertyType}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Agent ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.ownerId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.name}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMail className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mail ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A] truncate">{agent.email}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Phone Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.phone}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PropTypeIcon className={`text-sm ${propTypeConfig.text}`} />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className={`text-sm font-bold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${propTypeConfig.bg} ${propTypeConfig.text} ${propTypeConfig.border}`}>
                {agent.propertyType}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PlanIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Subscription Plan</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{planConfig.label}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Street</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.street}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Area / Locality</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.area}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCity className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">City</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.city}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCity className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">District</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.district}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMap className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">State</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.state}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiGlobe className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Country</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.country}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Pincode</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{agent.pincode}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Close
            </button>
            <button onClick={() => { if (onEdit) { onEdit(agent); onClose(); } }} className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]">
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button onClick={() => { if (onDelete) { onDelete(agent.id); } }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]">
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT AGENT MODAL
// ============================================================
const EditAgentModal = ({ agent, show, onClose, onSave, planTypes }) => {
  if (!agent || !show) return null;

  const [formData, setFormData] = useState({
    ownerId: '', name: '', email: '', phone: '', propertyType: '', subscriptionPlan: '',
    street: '', area: '', city: '', district: '', state: '', country: '', pincode: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({
        ownerId: agent.ownerId || '',
        name: agent.name || '',
        email: agent.email || '',
        phone: agent.phone || '',
        propertyType: agent.propertyType || '',
        subscriptionPlan: agent.subscriptionPlan || 'Basic',
        street: agent.street || '',
        area: agent.area || '',
        city: agent.city || '',
        district: agent.district || '',
        state: agent.state || '',
        country: agent.country || '',
        pincode: agent.pincode || ''
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...agent, ...formData });
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Agent</h2>
          <p className="text-white/80 text-sm">Update agent and subscription details</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Agent Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Agent ID</label>
                  <input type="text" name="ownerId" value={formData.ownerId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="AGT-0001" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter agent name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Mail ID *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="agent@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Phone Number *</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none">
                    <option value="">Select Property Type</option>
                    {ALL_PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Subscription Plan *</label>
                  <select name="subscriptionPlan" value={formData.subscriptionPlan} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none">
                    {Object.keys(planTypes).map(plan => <option key={plan} value={plan}>{planTypes[plan].label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiMapPin className="text-[#00695C]" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Street</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Street" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Area / Locality</label>
                  <input type="text" name="area" value={formData.area} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Area/Locality" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="City" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">District *</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="District" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="State" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Country *</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Country" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Pincode" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
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
// VIEW PLAN MODAL - Enhanced with clear visibility
// ============================================================
const ViewPlanModal = ({ plan, show, onClose, onEdit, onDelete, ownerCount, ownersOnPlan }) => {
  if (!plan || !show) return null;

  const PlanIcon = plan.icon;
  const theme = plan.theme || FALLBACK_THEME;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 p-6 rounded-t-3xl z-10 shrink-0" style={{ background: theme.gradient }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/25 border-2 border-white/40 flex items-center justify-center text-3xl text-white shadow-xl backdrop-blur-sm">
              <PlanIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">{plan.label} Plan</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white text-lg font-bold flex items-center gap-1 drop-shadow-md">
                  <FaRupeeSign className="text-sm" />
                  {plan.price === 0 ? 'Free' : plan.price.toLocaleString('en-IN')}
                  {plan.price > 0 && <span className="text-sm font-normal">/{plan.billingCycle}</span>}
                </span>
                {plan.isActive ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                    <FiCheck className="text-[10px]" /> Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-600 text-white flex items-center gap-1 shadow-md">
                    <FiX className="text-[10px]" /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Description */}
          <div className="bg-gradient-to-br from-[#F5F9F8] to-[#E8F4F2] rounded-2xl p-4 mb-4 border border-[#E8F0EE]">
            <div className="flex items-center gap-2 mb-2">
              <FiFileText className="text-[#00695C] text-sm" />
              <h4 className="text-xs font-bold text-[#00695C] uppercase tracking-wider">Description</h4>
            </div>
            <p className="text-sm text-[#1A2E2A] font-medium leading-relaxed">{plan.description}</p>
          </div>

          {/* Pricing & Owners Used */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="text-emerald-600 text-sm" />
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Price</h4>
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
              </p>
              {plan.price > 0 && <p className="text-xs text-emerald-600 mt-0.5">per {plan.billingCycle.replace('-', ' ')}</p>}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="text-blue-600 text-sm" />
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Billing Cycle</h4>
              </div>
              <p className="text-xl font-bold text-blue-700 capitalize">{plan.billingCycle.replace('-', ' ')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FiUsers className="text-purple-600 text-sm" />
                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Agents Using</h4>
              </div>
              <p className="text-2xl font-bold text-purple-700">{ownerCount || 0}</p>
              <p className="text-xs text-purple-600 mt-0.5">active subscribers</p>
            </div>
          </div>

          {/* Features - FULLY VISIBLE */}
          <div className="bg-gradient-to-br from-[#F5F9F8] to-[#E8F4F2] rounded-2xl p-5 mb-4 border border-[#E8F0EE]">
            <div className="flex items-center gap-2 mb-4">
              <FiLayers className="text-[#00695C] text-base" />
              <h4 className="text-sm font-bold text-[#00695C] uppercase tracking-wider">
                Features Included ({plan.features.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-[#E8F0EE] shadow-sm min-w-0">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="text-emerald-600 text-xs" />
                  </div>
                  <span className="text-sm text-[#1A2E2A] font-semibold leading-relaxed break-words min-w-0 [overflow-wrap:anywhere]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agents on this plan */}
          {ownersOnPlan && ownersOnPlan.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <FiUsers className="text-amber-700 text-base" />
                <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wider">
                  Agents on this Plan ({ownersOnPlan.length})
                </h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {ownersOnPlan.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-amber-200 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#1A2E2A] truncate">{agent.name}</p>
                      <p className="text-xs text-[#5A7D78] truncate">{agent.ownerId} • {agent.email}</p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full flex-shrink-0">
                      {agent.city}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Created date */}
          <div className="mt-4 flex items-center gap-2 text-xs text-[#5A7D78]">
            <FiCalendar className="text-[#00695C]" />
            <span>Created on: <span className="font-bold text-[#1A2E2A]">{plan.createdAt}</span></span>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Close
            </button>
            <button onClick={() => { if (onEdit) { onEdit(plan); onClose(); } }} className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]">
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button onClick={() => { if (onDelete) { onDelete(plan.name); } }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]">
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT/ADD PLAN MODAL - Simplified (no limits/capabilities)
// ============================================================
const EditPlanModal = ({ plan, show, onClose, onSave, isNew = false }) => {
  if (!show) return null;

  const [formData, setFormData] = useState({
    name: '',
    label: '',
    price: 0,
    billingCycle: 'monthly',
    description: '',
    isActive: true,
    features: [''],
    colorHex: '#00695C'
  });
  const [loading, setLoading] = useState(false);
  const [deleteFeatureIndex, setDeleteFeatureIndex] = useState(null);

  useEffect(() => {
    if (plan && !isNew) {
      setFormData({
        name: plan.name || '',
        label: plan.label || '',
        price: plan.price || 0,
        billingCycle: plan.billingCycle || 'monthly',
        description: plan.description || '',
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        features: plan.features || [''],
        colorHex: plan.colorHex || '#00695C'
      });
    } else if (isNew) {
      setFormData({
        name: '', label: '', price: 0, billingCycle: 'monthly', description: '',
        isActive: true, features: [''], colorHex: '#00695C'
      });
    }
  }, [plan, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData(prev => ({ ...prev, features: updated }));
  };

  const addFeature = () => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));

  const requestRemoveFeature = (index) => {
    if (formData.features.length <= 1) return;
    setDeleteFeatureIndex(index);
  };

  const confirmRemoveFeature = () => {
    if (deleteFeatureIndex === null) return;
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== deleteFeatureIndex) }));
    setDeleteFeatureIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...plan, ...formData, features: formData.features.filter(f => f.trim() !== '') });
      setLoading(false);
      onClose();
    }, 700);
  };

  const previewTheme = deriveTheme(formData.colorHex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <ConfirmationModal
        isOpen={deleteFeatureIndex !== null}
        onClose={() => setDeleteFeatureIndex(null)}
        onConfirm={confirmRemoveFeature}
        title="Remove Feature"
        message={deleteFeatureIndex !== null ? `Remove "${formData.features[deleteFeatureIndex] || 'this feature'}" from the plan?` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 p-6 rounded-t-3xl z-10 shrink-0" style={{ background: previewTheme.gradient }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {isNew ? 'Add New Agent Plan' : `Edit ${plan?.label || ''} Plan`}
          </h2>
          <p className="text-white/80 text-sm">
            {isNew ? 'Create a new subscription plan for agents' : 'Update plan details, pricing, and features'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiInfo className="text-[#00695C]" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Plan Name (Internal) *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="e.g., Diamond" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Display Label *</label>
                  <input type="text" name="label" value={formData.label} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="e.g., Diamond" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Describe what this plan offers..." />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" /> Pricing Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Price (₹) *</label>
                  <div className="relative">
                    <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
                      className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                      placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Billing Cycle *</label>
                  <select name="billingCycle" value={formData.billingCycle} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none">
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half Yearly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Color Theme</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="colorHex" value={formData.colorHex} onChange={handleChange}
                      className="w-10 h-10 rounded-xl border border-[#E8F0EE] cursor-pointer" />
                    <input type="text" name="colorHex" value={formData.colorHex} onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                      placeholder="#00695C" />
                  </div>
                  <p className="text-[10px] text-[#5A7D78] mt-1">Drives the plan's badge, icon, and header color everywhere</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8F0EE] cursor-pointer hover:border-[#00695C]/30 transition-all">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                    className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2" />
                  <span className="text-sm font-medium text-[#1A2E2A]">Active Plan</span>
                </label>
              </div>
            </div>

            {/* Features - Dynamic Add/Remove */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider flex items-center gap-2">
                  <FiLayers className="text-[#00695C]" /> Features
                </h3>
                <button type="button" onClick={addFeature}
                  className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-semibold flex items-center gap-1 hover:scale-105">
                  <FiPlus className="text-[10px]" /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E8F4F2] flex items-center justify-center text-[#00695C] text-[10px] font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                      placeholder="Enter feature description..." />
                    <button type="button" onClick={() => requestRemoveFeature(index)} disabled={formData.features.length <= 1}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave className="inline" />}
              {loading ? 'Saving...' : isNew ? 'Create Plan' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PLAN CARD COMPONENT - Clean (no limits/capabilities)
// ============================================================
const PlanExplanationCard = ({ plan, ownerCount, onView, onEdit, onDelete }) => {
  const PlanIcon = plan.icon;
  const theme = plan.theme || FALLBACK_THEME;

  return (
    <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col">
      {/* Header */}
      <div className="p-5 relative" style={{ background: theme.gradient }}>
        <div className="flex items-center justify-between mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/25 border-2 border-white/40 flex items-center justify-center text-white text-2xl shadow-xl backdrop-blur-sm">
            <PlanIcon />
          </div>
          {plan.isActive ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-md">
              <FiCheck className="text-[9px]" /> ACTIVE
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-600 text-white flex items-center gap-1 shadow-md">
              <FiX className="text-[9px]" /> INACTIVE
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-white drop-shadow-md">{plan.label}</h3>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white drop-shadow-md">
            {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
          </span>
          {plan.price > 0 && (
            <span className="text-white/80 text-xs font-medium">/{plan.billingCycle.replace('-', ' ')}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-xs text-[#5A7D78] mb-3 leading-relaxed line-clamp-2">{plan.description}</p>

        {/* Agent Count - PROMINENT */}
        <div className="bg-gradient-to-r from-[#E8F4F2] to-[#F5F9F8] rounded-xl p-3 mb-3 border border-[#E8F0EE]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00695C] flex items-center justify-center text-white shadow-md">
                <FiUsers className="text-sm" />
              </div>
              <span className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Agents Using</span>
            </div>
            <span className="text-xl font-bold text-[#00695C]">{ownerCount || 0}</span>
          </div>
        </div>

        {/* Features preview */}
        <div className="flex-1 space-y-1.5 mb-3">
          {plan.features.slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] text-[#1A2E2A] min-w-0">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <FiCheck className="text-emerald-600 text-[8px]" />
              </div>
              <span className="truncate font-medium flex-1 min-w-0">{feature}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-[10px] text-[#00695C] font-bold pl-6">
              +{plan.features.length - 4} more features
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 border-t border-[#E8F0EE]">
          <button type="button" onClick={onView}
            className="flex-1 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
            <FiEye className="text-[11px]" /> View
          </button>
          <button type="button" onClick={onEdit}
            className="flex-1 py-2 text-xs font-bold text-white bg-[#26A69A] rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 shadow-md shadow-[#26A69A]/30">
            <FiEdit className="text-[11px]" /> Edit
          </button>
          <button type="button" onClick={onDelete}
            className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
            <FiTrash2 className="text-[11px]" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, style, delay = 0, isActive, onClick }) => (
  <div
    className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 animate-slide-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={() => onClick && onClick()}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${color || ''} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`} style={style}>
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
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All' }) => {
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
      <button onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}>
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
          <button onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}>
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>{allLabel}</span>
          </button>
          {options.map((option) => (
            <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
                value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
              }`}>
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
const AgentPlans = () => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [planTypes, setPlanTypes] = useState(DEFAULT_PLAN_TYPES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [viewingAgent, setViewingAgent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activePlan, setActivePlan] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [showStats, setShowStats] = useState(true);
  const [showPlans, setShowPlans] = useState(true);
  const [planViewMode, setPlanViewMode] = useState('grid');

  const [viewingPlan, setViewingPlan] = useState(null);
  const [showViewPlanModal, setShowViewPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [isNewPlan, setIsNewPlan] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  const [stats, setStats] = useState({ total: 0 });
  const [planStats, setPlanStats] = useState({});

  const computeStats = useCallback((list, planTypesData) => {
    const counts = { total: list ? list.length : 0 };
    Object.keys(planTypesData).forEach(plan => {
      counts[plan] = list ? list.filter(a => a.subscriptionPlan === plan).length : 0;
    });
    setStats(counts);
    setPlanStats(counts);
  }, []);

  const generateMockAgents = useCallback((planNames) => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa', 'Arjun', 'Nisha'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma'];
    const states = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Delhi', 'West Bengal', 'Gujarat', 'Kerala'];
    const districts = ['Chennai', 'Bengaluru Urban', 'Hyderabad', 'Mumbai Suburban', 'New Delhi', 'Kolkata', 'Ahmedabad', 'Ernakulam'];
    const cities = ['Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata', 'Ahmedabad', 'Kochi'];
    const areas = ['Adyar', 'Koramangala', 'Jubilee Hills', 'Bandra', 'Connaught Place', 'Salt Lake', 'Vastrapur', 'Kakkanad'];
    const streets = ['1st Cross Street', 'MG Road', 'Lake View Lane', 'Garden Street', 'Park Avenue', 'Hill Road', 'Church Street', 'Palm Grove Road'];
    const country = 'India';
    const plans = planNames;
    const propertyTypes = ALL_PROPERTY_TYPES;

    const list = [];
    for (let i = 1; i <= 60; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const subscriptionPlan = plans[Math.floor(Math.random() * plans.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const pincode = String(600000 + Math.floor(Math.random() * 99999));

      list.push({
        id: `agt_${i}`, ownerId: `AGT-${String(i).padStart(4, '0')}`, name,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+91 ${String(9000000000 + Math.floor(Math.random() * 999999999)).slice(0, 10)}`,
        propertyType, subscriptionPlan,
        street: streets[Math.floor(Math.random() * streets.length)],
        area: areas[Math.floor(Math.random() * areas.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        district: districts[Math.floor(Math.random() * districts.length)],
        state: states[Math.floor(Math.random() * states.length)],
        country, pincode
      });
    }
    return list;
  }, []);

  useEffect(() => {
    try {
      const planNames = Object.keys(DEFAULT_PLAN_TYPES);
      const mockAgents = generateMockAgents(planNames);
      setAgents(mockAgents);
      setFilteredAgents(mockAgents);
      computeStats(mockAgents, DEFAULT_PLAN_TYPES);
    } catch (error) {
      console.error('Error generating mock agents:', error);
    }
  }, [generateMockAgents, computeStats]);

  const filterAgents = useCallback(() => {
    try {
      let filtered = [...agents];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(a =>
          (a.name && a.name.toLowerCase().includes(query)) ||
          (a.ownerId && a.ownerId.toLowerCase().includes(query)) ||
          (a.email && a.email.toLowerCase().includes(query)) ||
          (a.phone && a.phone.toLowerCase().includes(query)) ||
          (a.propertyType && a.propertyType.toLowerCase().includes(query)) ||
          (a.subscriptionPlan && a.subscriptionPlan.toLowerCase().includes(query)) ||
          (a.state && a.state.toLowerCase().includes(query)) ||
          (a.city && a.city.toLowerCase().includes(query))
        );
      }
      if (activePlan !== 'all') filtered = filtered.filter(a => a.subscriptionPlan === activePlan);
      if (activePropertyType !== 'all') filtered = filtered.filter(a => a.propertyType === activePropertyType);

      let count = 0;
      if (activePlan !== 'all') count++;
      if (activePropertyType !== 'all') count++;
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

      setFilteredAgents(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering agents:', error);
    }
  }, [agents, searchQuery, activePlan, activePropertyType, sortField, sortDirection]);

  useEffect(() => { filterAgents(); }, [filterAgents]);

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / pageSize));
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAgents.slice(start, start + pageSize);
  }, [filteredAgents, currentPage, pageSize]);

  const handleSort = useCallback((field) => {
    if (sortField === field) setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedAgents.length === paginatedAgents.length && paginatedAgents.length > 0) setSelectedAgents([]);
    else setSelectedAgents(paginatedAgents.map(a => a.id));
  }, [selectedAgents, paginatedAgents]);

  const handleSelectAgent = useCallback((agentId) => {
    setSelectedAgents(prev => prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]);
  }, []);

  const handleViewAgent = useCallback((agent) => { setViewingAgent(agent); setShowViewModal(true); }, []);
  const handleEditAgent = useCallback((agent) => { setEditingAgent(agent); setShowEditModal(true); }, []);

  const handleSaveAgent = useCallback((updatedAgent) => {
    setAgents(prev => {
      const updated = prev.map(a => a.id === updatedAgent.id ? updatedAgent : a);
      computeStats(updated, planTypes);
      return updated;
    });
    setToast({ message: `Agent "${updatedAgent.name}" updated successfully`, type: 'success' });
  }, [computeStats, planTypes]);

  // PLAN CRUD
  const handleViewPlan = useCallback((planKey) => {
    setViewingPlan({ ...planTypes[planKey], name: planKey });
    setShowViewPlanModal(true);
  }, [planTypes]);

  const handleEditPlan = useCallback((planKey) => {
    setEditingPlan({ ...planTypes[planKey], name: planKey });
    setIsNewPlan(false);
    setShowEditPlanModal(true);
  }, [planTypes]);

  const handleAddPlan = useCallback(() => {
    setEditingPlan(null);
    setIsNewPlan(true);
    setShowEditPlanModal(true);
  }, []);

  const handleSavePlan = useCallback((updatedPlan) => {
    const key = updatedPlan.name;
    const colorHex = updatedPlan.colorHex || '#00695C';
    const theme = deriveTheme(colorHex);
    let newPlanTypes;

    setPlanTypes(prev => {
      const updated = { ...prev };
      if (isNewPlan) {
        updated[key] = {
          ...updatedPlan,
          id: `plan_${key.toLowerCase().replace(/\s+/g, '_')}`,
          icon: FiPackage,
          colorHex,
          theme,
          createdAt: new Date().toISOString().split('T')[0]
        };
      } else {
        const existing = prev[key];
        if (existing) {
          updated[key] = {
            ...existing,
            ...updatedPlan,
            icon: existing.icon,
            colorHex,
            theme
          };
        }
      }
      newPlanTypes = updated;
      return updated;
    });

    setTimeout(() => {
      setAgents(prev => {
        computeStats(prev, newPlanTypes || planTypes);
        return prev;
      });
    }, 0);

    setToast({ message: isNewPlan ? `Plan "${updatedPlan.label}" created successfully` : `Plan "${updatedPlan.label}" updated successfully`, type: 'success' });
    setShowEditPlanModal(false);
    setEditingPlan(null);
  }, [isNewPlan, computeStats, planTypes]);

  const handleDeletePlan = useCallback((planKey) => {
    const plan = planTypes[planKey];
    if (!plan) return;
    const agentCount = agents.filter(a => a.subscriptionPlan === planKey).length;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Subscription Plan',
      message: `Are you sure you want to delete the "${plan.label}" plan?${agentCount > 0 ? ` ${agentCount} agent(s) are currently on this plan and will be moved to Basic plan.` : ''}`,
      confirmText: 'Delete Plan',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(`delete-plan-${planKey}`);
        setTimeout(() => {
          setPlanTypes(prev => {
            const updated = { ...prev };
            delete updated[planKey];
            return updated;
          });

          setAgents(prev => {
            const remainingPlans = Object.keys(planTypes).filter(k => k !== planKey);
            const fallbackPlan = remainingPlans.includes('Basic') ? 'Basic' : remainingPlans[0] || 'Basic';
            const updated = prev.map(a => a.subscriptionPlan === planKey ? { ...a, subscriptionPlan: fallbackPlan } : a);
            computeStats(updated, { ...planTypes, [planKey]: undefined });
            return updated;
          });

          setActionLoading(null);
          setShowViewPlanModal(false);
          setToast({ message: `Plan "${plan.label}" deleted successfully`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [planTypes, agents, computeStats]);

  const handleDeleteAgent = useCallback((agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Agent',
      message: `Are you sure you want to delete agent "${agent.name}" (${agent.ownerId})?`,
      confirmText: 'Delete', cancelText: 'Cancel', type: 'danger',
      onConfirm: () => {
        setActionLoading(agentId);
        setTimeout(() => {
          setAgents(prev => {
            const updated = prev.filter(a => a.id !== agentId);
            computeStats(updated, planTypes);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted agent "${agent.name}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [agents, computeStats, planTypes]);

  const handlePlanClick = useCallback((plan) => {
    setActivePlan(prev => (prev === plan ? 'all' : plan));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActivePlan('all'); setActivePropertyType('all'); setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery(''); setActivePlan('all'); setActivePropertyType('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const planNames = Object.keys(planTypes);
        const mockAgents = generateMockAgents(planNames);
        setAgents(mockAgents);
        setFilteredAgents(mockAgents);
        computeStats(mockAgents, planTypes);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockAgents, planTypes, computeStats]);

  const handleExport = useCallback(() => {
    if (filteredAgents.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredAgents.map(a => ({
        'Agent ID': a.ownerId || '', 'Name': a.name || '', 'Mail ID': a.email || '',
        'Phone Number': a.phone || '', 'Property Type': a.propertyType || '',
        'Subscription Plan': planTypes[a.subscriptionPlan]?.label || a.subscriptionPlan || '',
        'Street': a.street || '', 'Area / Locality': a.area || '', 'City': a.city || '',
        'District': a.district || '', 'State': a.state || '', 'Country': a.country || '', 'Pincode': a.pincode || ''
      }));
      const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent_plans_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredAgents.length} records exported successfully`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredAgents, planTypes]);

  const handleBulkDelete = useCallback(() => {
    if (selectedAgents.length === 0) {
      setToast({ message: 'Please select agents first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Agents',
      message: `Are you sure you want to delete ${selectedAgents.length} selected agent(s)?`,
      confirmText: 'Delete All', cancelText: 'Cancel', type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedAgents);
          const count = agents.filter(a => selectedIds.has(a.id)).length;
          const updated = agents.filter(a => !selectedIds.has(a.id));
          setAgents(updated);
          computeStats(updated, planTypes);
          setSelectedAgents([]);
          setActionLoading(null);
          setToast({ message: `${count} agent(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedAgents, agents, computeStats, planTypes]);

  const planOptions = Object.keys(planTypes).map(plan => ({ value: plan, label: planTypes[plan].label }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(type => ({ value: type, label: type }));

  // Get agents for the viewing plan
  const agentsOnViewingPlan = viewingPlan
    ? agents.filter(a => a.subscriptionPlan === viewingPlan.name)
    : [];

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

      {showViewModal && viewingAgent && (
        <ViewAgentDetailModal agent={viewingAgent} show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingAgent(null); }}
          onEdit={handleEditAgent} onDelete={handleDeleteAgent} planTypes={planTypes} />
      )}

      {showEditModal && editingAgent && (
        <EditAgentModal agent={editingAgent} show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingAgent(null); }}
          onSave={handleSaveAgent} planTypes={planTypes} />
      )}

      {showViewPlanModal && viewingPlan && (
        <ViewPlanModal plan={viewingPlan} show={showViewPlanModal}
          onClose={() => { setShowViewPlanModal(false); setViewingPlan(null); }}
          onEdit={(plan) => { handleEditPlan(plan.name); setShowViewPlanModal(false); }}
          onDelete={(planName) => { handleDeletePlan(planName); }}
          ownerCount={agentsOnViewingPlan.length}
          ownersOnPlan={agentsOnViewingPlan} />
      )}

      {showEditPlanModal && (
        <EditPlanModal plan={editingPlan} show={showEditPlanModal}
          onClose={() => { setShowEditPlanModal(false); setEditingPlan(null); setIsNewPlan(false); }}
          onSave={handleSavePlan} isNew={isNewPlan} />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Agent Plans
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredAgents.length} Agents
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage subscription plans and property agents</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105">
              {showStats ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button onClick={handleRefresh} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105">
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5  lg:grid-cols-4 gap-3">
              <StatCard icon={<FiUsers className="text-white text-sm" />} title="Total Agents" value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0}
                isActive={activePlan === 'all' && activePropertyType === 'all' && !searchQuery}
                onClick={handleTotalClick} />
              {Object.keys(planTypes).map((plan, idx) => {
                const config = planTypes[plan];
                const PlanIcon = config.icon;
                const theme = config.theme || FALLBACK_THEME;
                return (
                  <StatCard key={plan} icon={<PlanIcon className="text-white text-sm" />} title={config.label}
                    value={stats[plan] || 0} style={{ background: theme.gradient }}
                    delay={(idx + 1) * 80} isActive={activePlan === plan} onClick={() => handlePlanClick(plan)} />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION PLANS SECTION */}
      <div className="relative animate-slide-in">
        <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white text-lg shadow-lg">
                  <FiPackage />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Subscription Plans</h2>
                  <p className="text-white/70 text-xs">
                    {Object.keys(planTypes).length} plans configured • Click any plan to view, edit or delete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleAddPlan}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#00695C] rounded-xl hover:bg-white/90 transition-all duration-300 text-sm font-bold shadow-lg hover:scale-105">
                  <FiPlus className="text-sm" /> Add New Plan
                </button>
                <button onClick={() => setShowPlans(!showPlans)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 text-sm font-medium hover:scale-105">
                  {showPlans ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
                </button>
                <div className="flex items-center bg-white/20 rounded-xl p-1">
                  <button onClick={() => setPlanViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all duration-300 ${planViewMode === 'grid' ? 'bg-white text-[#00695C] shadow-sm' : 'text-white/70 hover:text-white'}`}>
                    <FiGridIcon className="text-sm" />
                  </button>
                  <button onClick={() => setPlanViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all duration-300 ${planViewMode === 'list' ? 'bg-white text-[#00695C] shadow-sm' : 'text-white/70 hover:text-white'}`}>
                    <FiList className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showPlans && (
            <div className="p-4">
              {planViewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(planTypes).map((planKey) => (
                    <PlanExplanationCard key={planKey} plan={planTypes[planKey]}
                      ownerCount={planStats[planKey] || 0}
                      onView={() => handleViewPlan(planKey)}
                      onEdit={() => handleEditPlan(planKey)}
                      onDelete={() => handleDeletePlan(planKey)} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.keys(planTypes).map((planKey) => {
                    const plan = planTypes[planKey];
                    const PlanIcon = plan.icon;
                    const theme = plan.theme || FALLBACK_THEME;
                    return (
                      <div key={planKey}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#F8FAF9] to-white rounded-2xl border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0" style={{ background: theme.gradient }}>
                            <PlanIcon className="text-base" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-[#1A2E2A]">{plan.label}</h3>
                            <p className="text-xs text-[#5A7D78] truncate">{plan.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-bold text-[#00695C]">
                            {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                            <span className="text-[10px] font-normal text-[#5A7D78]">/{plan.billingCycle}</span>
                          </span>
                          <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full flex items-center gap-1">
                            <FiUsers className="text-[10px]" /> {planStats[planKey] || 0} agents
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleViewPlan(planKey)}
                              className="w-7 h-7 rounded-lg bg-[#E8F4F2] text-[#00695C] hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center hover:scale-110">
                              <FiEye className="text-xs" />
                            </button>
                            <button onClick={() => handleEditPlan(planKey)}
                              className="w-7 h-7 rounded-lg bg-[#26A69A] text-white hover:bg-[#1A8A7A] transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-md">
                              <FiEdit className="text-xs" />
                            </button>
                            <button onClick={() => handleDeletePlan(planKey)}
                              disabled={actionLoading === `delete-plan-${planKey}`}
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50">
                              {actionLoading === `delete-plan-${planKey}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                            </button>
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
      </div>

      {/* Search & Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input ref={searchInputRef} type="text" placeholder="Search agents by name, ID, email, phone, city..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                <FiX className="text-sm" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <FilterDropdown label="Plan" options={planOptions} value={activePlan} onChange={setActivePlan} icon={FiAward} allLabel="All Plans" />
            <FilterDropdown label="Property" options={propertyTypeOptions} value={activePropertyType} onChange={setActivePropertyType} icon={FiTag} allLabel="All Types" />
            {(activePlan !== 'all' || activePropertyType !== 'all' || searchQuery) && (
              <button onClick={clearAllFilters}
                className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105">
                <FiX className="text-sm" /> Clear
              </button>
            )}
            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}>
                <FiGridIcon className="text-sm" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}>
                <FiList className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {selectedAgents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedAgents.length}</span> agent(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleBulkDelete} disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50">
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button onClick={() => setSelectedAgents([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agents Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedAgents.map((agent, index) => {
              const isSelected = selectedAgents.includes(agent.id);
              const planConfig = planTypes[agent.subscriptionPlan] || { theme: FALLBACK_THEME, label: agent.subscriptionPlan, icon: FiPackage };
              const theme = planConfig.theme || FALLBACK_THEME;
              const PlanIcon = planConfig.icon || FiPackage;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[agent.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
              const PropTypeIcon = propTypeConfig.icon;

              return (
                <div key={agent.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input type="checkbox" checked={isSelected} onChange={() => handleSelectAgent(agent.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300" />
                      <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0" style={{ background: theme.gradient }}>
                        <PlanIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{agent.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{agent.ownerId}</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none border" style={{ background: theme.bgTint, color: theme.textColor, borderColor: theme.borderTint }}>
                            {planConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <PropTypeIcon className={`flex-shrink-0 ${propTypeConfig.text}`} />
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full font-semibold leading-none border truncate ${propTypeConfig.bg} ${propTypeConfig.text} ${propTypeConfig.border}`}>
                        {agent.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{agent.area}, {agent.city}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button type="button" onClick={() => handleViewAgent(agent)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button type="button" onClick={() => handleEditAgent(agent)}
                      className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#26A69A] rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 shadow-md">
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteAgent(agent.id)} disabled={actionLoading === agent.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50">
                      {actionLoading === agent.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                <input type="checkbox" checked={selectedAgents.length === paginatedAgents.length && paginatedAgents.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0" />
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('ownerId')}>
                  ID {sortField === 'ownerId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-2 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('email')}>
                Mail ID {sortField === 'email' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('phone')}>
                Phone {sortField === 'phone' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyType')}>
                Property {sortField === 'propertyType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('subscriptionPlan')}>
                Plan {sortField === 'subscriptionPlan' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('state')}>
                State {sortField === 'state' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedAgents.map((agent, index) => {
              const isSelected = selectedAgents.includes(agent.id);
              const planConfig = planTypes[agent.subscriptionPlan] || { theme: FALLBACK_THEME, label: agent.subscriptionPlan, icon: FiPackage };
              const theme = planConfig.theme || FALLBACK_THEME;
              const PlanIcon = planConfig.icon || FiPackage;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[agent.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

              return (
                <div key={agent.id}
                  className={`grid grid-cols-12 gap-1 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}>
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <input type="checkbox" checked={isSelected} onChange={() => handleSelectAgent(agent.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0" />
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0" style={{ background: theme.gradient }}>
                      <PlanIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{agent.ownerId}</span>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{agent.name}</p>
                  </div>
                  <div className="col-span-2 min-w-0 text-xs font-medium text-[#5A7D78] truncate">{agent.email}</div>
                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">{agent.phone}</div>
                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border} truncate inline-block max-w-full`}>
                      {agent.propertyType}
                    </span>
                  </div>
                  <div className="col-span-1 min-w-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border truncate inline-block max-w-full" style={{ background: theme.bgTint, color: theme.textColor, borderColor: theme.borderTint }}>
                      {planConfig.label}
                    </span>
                  </div>
                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">{agent.city}</div>
                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">{agent.state}</div>
                  <div className="col-span-1 min-w-0 flex items-center justify-end gap-1 flex-nowrap">
                    <button type="button" onClick={() => handleViewAgent(agent)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0">
                      <FiEye className="text-[15px]" />
                    </button>
                    <button type="button" onClick={() => handleEditAgent(agent)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0">
                      <FiEdit className="text-[15px]" />
                    </button>
                    <button type="button" onClick={() => handleDeleteAgent(agent.id)} disabled={actionLoading === agent.id}
                      className="w-5 h-5 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0">
                      {actionLoading === agent.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[15px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedAgents.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUser className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No agents found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No agents have been added yet'}
            </p>
            {filterCount > 0 && (
              <button onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105">
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredAgents.length)} of {filteredAgents.length} agents
            </span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 font-medium">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-110 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
                      : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'
                  }`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

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
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default AgentPlans; 