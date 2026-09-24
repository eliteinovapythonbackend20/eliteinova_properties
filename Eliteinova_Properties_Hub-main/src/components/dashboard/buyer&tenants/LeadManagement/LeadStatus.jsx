// src/components/dashboard/admin/buyer&tenants/LeadManagement/LeadStatus.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiMail, FiPhone, FiCalendar,
  FiClock, FiUserCheck, FiCheckCircle, FiXCircle, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiAlertCircle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiTag, FiSave, FiUserPlus, FiMessageCircle, FiStar,
  FiTrendingUp, FiDollarSign, FiBriefcase, FiFlag, FiTarget,
  FiArrowRight,FiSend  
} from 'react-icons/fi';
import {
  FaUserTie, FaCalendarAlt, FaHome, FaBuilding,
  FaClipboardList, FaHandshake, FaChartLine, FaUserCheck as FaUserCheckSolid
} from 'react-icons/fa';

// ============================================================
// STATUS CONFIG — single source of truth for the workflow
// ============================================================
const STATUS_FLOW = ['new', 'contacted', 'interested', 'follow_up', 'site_visit', 'negotiation', 'closed_won', 'closed_lost'];

const STATUS_CONFIG = {
  new: {
    label: 'New',
    short: 'New',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    gradient: 'from-blue-600 to-blue-400',
    icon: FiUserPlus,
    description: 'New lead has been captured. Initial contact pending.',
    stage: 0
  },
  contacted: {
    label: 'Contacted',
    short: 'Contacted',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    gradient: 'from-indigo-600 to-indigo-400',
    icon: FiMessageCircle,
    description: 'Initial outreach made. Awaiting response.',
    stage: 1
  },
  interested: {
    label: 'Interested',
    short: 'Interested',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    gradient: 'from-amber-600 to-amber-400',
    icon: FiStar,
    description: 'Lead has shown interest. Qualifying further.',
    stage: 2
  },
  follow_up: {
    label: 'Follow-up',
    short: 'Follow-up',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    gradient: 'from-purple-600 to-purple-400',
    icon: FiRefreshCw,
    description: 'Scheduled follow-up. Keeping engagement active.',
    stage: 3
  },
  site_visit: {
    label: 'Site Visit',
    short: 'Site Visit',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
    gradient: 'from-teal-600 to-teal-400',
    icon: FaHome,
    description: 'Site visit scheduled or completed.',
    stage: 4
  },
  negotiation: {
    label: 'Negotiation',
    short: 'Negotiation',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    gradient: 'from-orange-600 to-orange-400',
    icon: FiTrendingUp,
    description: 'In price/value negotiation phase.',
    stage: 5
  },
  closed_won: {
    label: 'Closed Won',
    short: 'Won',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-600 to-emerald-400',
    icon: FiCheckCircle,
    description: 'Deal successfully closed. Lead converted.',
    stage: 6
  },
  closed_lost: {
    label: 'Closed Lost',
    short: 'Lost',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    gradient: 'from-red-600 to-red-400',
    icon: FiXCircle,
    description: 'Deal closed but lost to competition or other reasons.',
    stage: 7
  }
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG);

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
      const timer = setTimeout(() => setToast(null), 3000);
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
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick && onClick()}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-[#5A7D79] uppercase tracking-wider truncate">{title}</p>
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
// STATUS TIMELINE — horizontal stepper
// ============================================================
const StatusTimeline = ({ currentStatus, history }) => {
  const isTerminal = currentStatus === 'closed_won' || currentStatus === 'closed_lost';
  const activeIndex = STATUS_FLOW.indexOf(currentStatus);
  const terminalIndex = STATUS_FLOW.indexOf('closed_won');

  return (
    <div className="bg-[#F5F9F8] rounded-2xl p-4">
      <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-4 flex items-center gap-2">
        <FiActivity className="text-[#00695C]" />
        Lead Journey
      </h4>

      {/* Main flow */}
      <div className="flex items-center overflow-x-auto pb-2">
        {STATUS_FLOW.map((key, idx) => {
          const cfg = STATUS_CONFIG[key];
          const Icon = cfg.icon;
          const isTerminalStatus = key === 'closed_won' || key === 'closed_lost';
          const reached = !isTerminal ? activeIndex >= idx : (activeIndex >= terminalIndex && idx <= terminalIndex);
          const isCurrent = activeIndex === idx;
          const active = reached || isCurrent;

          // For terminal states, we show both but only one is active
          const isActiveTerminal = key === currentStatus && isTerminal;
          const isOtherTerminal = isTerminal && key !== currentStatus && key !== 'closed_won' && key !== 'closed_lost';

          return (
            <React.Fragment key={key}>
              <div className="flex flex-col items-center gap-1.5 min-w-[56px] flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                    active || isActiveTerminal
                      ? `bg-gradient-to-br ${cfg.gradient} text-white scale-100`
                      : 'bg-white border-2 border-[#E8F0EE] text-[#B5C9C5]'
                  } ${isCurrent ? 'ring-4 ring-[#00695C]/20' : ''}`}
                >
                  <Icon className="text-xs" />
                </div>
                <span className={`text-[8px] font-medium text-center leading-tight ${active || isActiveTerminal ? 'text-[#1A2E2A]' : 'text-[#B5C9C5]'}`}>
                  {cfg.short}
                </span>
              </div>
              {idx < STATUS_FLOW.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 rounded-full transition-all duration-500 min-w-[12px] ${
                  (active && idx < activeIndex) || (isTerminal && idx < terminalIndex)
                    ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A]'
                    : 'bg-[#E8F0EE]'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Branch outcome badge */}
      {isTerminal && (
        <div className="mt-4 pt-4 border-t border-dashed border-[#E8F0EE] flex items-center gap-2">
          <FiFlag className="text-[#5A7D78] text-sm" />
          <span className="text-xs text-[#5A7D78]">Deal</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[currentStatus].badge}`}>
            {STATUS_CONFIG[currentStatus].label}
          </span>
        </div>
      )}

      {/* History trail */}
      {history && history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#E8F0EE] space-y-2">
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[h.status]?.dot || 'bg-slate-400'}`} />
              <span className="text-[#1A2E2A] font-medium">{STATUS_CONFIG[h.status]?.label || h.status}</span>
              <span className="text-[#B5C9C5]">·</span>
              <span className="text-[#5A7D78]">{h.date}</span>
              {h.note && <span className="text-[#5A7D78] italic truncate">— {h.note}</span>}
            </div>
          ))}
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

  const cfg = STATUS_CONFIG[lead.leadStatus] || STATUS_CONFIG.new;

  const handleDeleteClick = () => onDelete && onDelete(lead.id);
  const handleEditClick = () => { onEdit && onEdit(lead); onClose(); };

  const formattedDate = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
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
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                {cfg.label}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F5F9F8] text-[#5A7D78]">
                {lead.leadSource || 'Direct'}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F5F9F8] text-[#5A7D78]">
                {lead.leadType || 'Buyer'}
              </span>
            </div>

            <p className="text-sm text-[#5A7D78] bg-[#F5F9F8] rounded-2xl p-4 leading-relaxed">
              {cfg.description}
            </p>

            {/* Status Timeline */}
            <StatusTimeline currentStatus={lead.leadStatus} history={lead.statusHistory} />

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Name</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.leadName || 'N/A'}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiMail className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Email</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A] break-all">{lead.leadEmail || 'N/A'}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiPhone className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Phone</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.contactNumber || 'N/A'}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Interest</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.propertyInterest || 'N/A'}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiDollarSign className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Budget</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.budget || 'N/A'}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaUserTie className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned To</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{lead.assignedAgent || 'Unassigned'}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Created</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{formattedDate}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FaClipboardList className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Notes</h4>
                </div>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{lead.notes || 'No notes available'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Close
            </button>
            <button onClick={handleEditClick} className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]">
              <FiEdit className="inline mr-2" /> Update Status
            </button>
            <button onClick={handleDeleteClick} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]">
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT / UPDATE STATUS MODAL
// ============================================================
const EditLeadModal = ({ lead, show, onClose, onSave }) => {
  if (!lead || !show) return null;

  const [formData, setFormData] = useState({
    leadStatus: '',
    leadName: '',
    leadEmail: '',
    contactNumber: '',
    propertyInterest: '',
    budget: '',
    leadSource: '',
    leadType: '',
    assignedAgent: '',
    notes: '',
    statusNote: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        leadStatus: lead.leadStatus || 'new',
        leadName: lead.leadName || '',
        leadEmail: lead.leadEmail || '',
        contactNumber: lead.contactNumber || '',
        propertyInterest: lead.propertyInterest || '',
        budget: lead.budget || '',
        leadSource: lead.leadSource || 'Direct',
        leadType: lead.leadType || 'Buyer',
        assignedAgent: lead.assignedAgent || '',
        notes: lead.notes || '',
        statusNote: ''
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const statusChanged = formData.leadStatus !== lead.leadStatus;
      const updatedLead = {
        ...lead,
        leadStatus: formData.leadStatus,
        leadName: formData.leadName,
        leadEmail: formData.leadEmail,
        contactNumber: formData.contactNumber,
        propertyInterest: formData.propertyInterest,
        budget: formData.budget,
        leadSource: formData.leadSource,
        leadType: formData.leadType,
        assignedAgent: formData.assignedAgent,
        notes: formData.notes,
        statusHistory: statusChanged
          ? [
              {
                status: formData.leadStatus,
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                note: formData.statusNote || undefined
              },
              ...(lead.statusHistory || [])
            ]
          : lead.statusHistory
      };
      onSave(updatedLead);
      setLoading(false);
      onClose();
    }, 700);
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
          <h2 className="text-2xl font-bold text-white">Update Lead</h2>
          <p className="text-white/80 text-sm">{lead.leadName || 'New Lead'}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status picker */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiTag className="text-[#00695C]" />
                Lead Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_KEYS.map(key => {
                  const cfg = STATUS_CONFIG[key];
                  const Icon = cfg.icon;
                  const selected = formData.leadStatus === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setFormData(prev => ({ ...prev, leadStatus: key }))}
                      className={`flex items-center gap-1.5 px-2 py-2 rounded-xl border text-[12px] font-medium transition-all duration-300 hover:scale-[1.02] ${
                        selected
                          ? `bg-gradient-to-br ${cfg.gradient} text-white border-transparent shadow-md`
                          : 'bg-white text-[#5A7D78] border-[#E8F0EE] hover:border-[#00695C]/30'
                      }`}
                    >
                      <Icon className="text-sm shrink-0" />
                      <span className="truncate">{cfg.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lead Info */}
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
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Email</label>
                  <input
                    type="email"
                    name="leadEmail"
                    value={formData.leadEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Phone</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Interest</label>
                  <input
                    type="text"
                    name="propertyInterest"
                    value={formData.propertyInterest}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
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
                    <option value="Direct">Direct</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Type</label>
                  <select
                    name="leadType"
                    value={formData.leadType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="Buyer">Buyer</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Investor">Investor</option>
                    <option value="Seller">Seller</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Assigned Agent</label>
                  <input
                    type="text"
                    name="assignedAgent"
                    value={formData.assignedAgent}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Agent name"
                  />
                </div>
              </div>
            </div>

            {/* Status Note */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiSend className="text-[#00695C]" />
                Status Update Note
              </h3>
              <textarea
                name="statusNote"
                value={formData.statusNote}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                placeholder="e.g., Lead responded with interest in 3BHK units"
              />
            </div>

            {/* Notes */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaClipboardList className="text-[#00695C]" />
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
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave className="inline" />}
              {loading ? 'Saving...' : 'Save Lead'}
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
const LeadStatus = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLeadType, setSelectedLeadType] = useState('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');
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

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const emptyStats = useMemo(() => {
    const base = { total: 0 };
    STATUS_KEYS.forEach(k => { base[k] = 0; });
    return base;
  }, []);
  const [stats, setStats] = useState(emptyStats);

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats(emptyStats);
      return;
    }
    const next = { total: list.length };
    STATUS_KEYS.forEach(k => {
      next[k] = list.filter(v => v.leadStatus === k).length;
    });
    setStats(next);
  }, [emptyStats]);

  // ============ GENERATE MOCK DATA ============
  const generateMockLeads = useCallback(() => {
    const leadNames = ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Reddy', 'Ananya Gupta', 'Manoj Verma', 'Divya Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai', 'Karthik Iyer', 'Meera Nair', 'Suresh Babu', 'Lakshmi Narayan', 'Ganesh Rao', 'Sita Menon', 'Ravi Desai', 'Kavya Krishnan'];
    const properties = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa', 'Palm Grove', 'Coconut Bay', 'Saffron Square'];
    const agents = ['Agent Raj', 'Agent Priya', 'Agent Amit', 'Agent Sneha', 'Agent Vikram', 'Agent Deepa', 'Agent Kumar', 'Agent Nisha'];
    const sources = ['Direct', 'Referral', 'Website', 'Social Media', 'Email', 'Phone', 'Other'];
    const leadTypes = ['Buyer', 'Tenant', 'Investor', 'Seller'];
    const budgets = ['₹50L - ₹1Cr', '₹1Cr - ₹2Cr', '₹2Cr - ₹5Cr', '₹5Cr+', '₹30L - ₹50L', 'Flexible'];
    const contactPrefixes = ['+91 98', '+91 97', '+91 99', '+91 88', '+91 96'];
    const statusNotes = {
      new: 'Fresh lead captured from inquiry.',
      contacted: 'Initial call made, waiting for callback.',
      interested: 'Lead showed strong interest in property.',
      follow_up: 'Follow-up scheduled for next week.',
      site_visit: 'Site visit booked or completed.',
      negotiation: 'Negotiating on price and terms.',
      closed_won: 'Deal closed successfully.',
      closed_lost: 'Lead closed - moved to other property.'
    };

    const leadsList = [];
    const usedNames = new Set();

    for (let i = 1; i <= 50; i++) {
      let leadName, propertyInterest;
      let attempts = 0;
      do {
        leadName = leadNames[Math.floor(Math.random() * leadNames.length)];
        propertyInterest = properties[Math.floor(Math.random() * properties.length)];
        attempts++;
      } while (usedNames.has(`${leadName}_${propertyInterest}`) && attempts < 50);
      usedNames.add(`${leadName}_${propertyInterest}`);

      const randomStatus = STATUS_KEYS[Math.floor(Math.random() * STATUS_KEYS.length)];
      const randomLeadType = leadTypes[Math.floor(Math.random() * leadTypes.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];

      const historyLength = Math.floor(Math.random() * 3) + 1;
      const statusHistory = [];
      const historyPool = [randomStatus, 'contacted', 'new'].filter((v, idx, arr) => arr.indexOf(v) === idx);
      for (let h = 0; h < Math.min(historyLength, historyPool.length); h++) {
        const d = new Date(Date.now() - h * 3 * 24 * 60 * 60 * 1000);
        statusHistory.push({
          status: historyPool[h],
          date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          note: statusNotes[historyPool[h]]
        });
      }

      const createdAt = new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000);

      leadsList.push({
        id: `lead_${i}`,
        leadName,
        leadEmail: `${leadName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        contactNumber: `${contactPrefixes[Math.floor(Math.random() * contactPrefixes.length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        propertyInterest,
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        leadSource: randomSource,
        leadType: randomLeadType,
        assignedAgent: agents[Math.floor(Math.random() * agents.length)],
        leadStatus: randomStatus,
        notes: Math.random() > 0.5 ? 'Lead is actively looking for properties in this area.' :
                Math.random() > 0.3 ? 'Following up on previous conversation.' : '',
        statusHistory,
        createdAt: createdAt.toISOString(),
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
        filtered = filtered.filter(v =>
          (v.leadName && v.leadName.toLowerCase().includes(query)) ||
          (v.propertyInterest && v.propertyInterest.toLowerCase().includes(query)) ||
          (v.assignedAgent && v.assignedAgent.toLowerCase().includes(query)) ||
          (v.leadType && v.leadType.toLowerCase().includes(query)) ||
          (v.leadSource && v.leadSource.toLowerCase().includes(query)) ||
          (v.contactNumber && v.contactNumber.includes(query)) ||
          (v.leadEmail && v.leadEmail.toLowerCase().includes(query))
        );
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(v => v.leadStatus === selectedStatus);
      }

      if (selectedLeadType !== 'all') {
        filtered = filtered.filter(v => v.leadType === selectedLeadType);
      }

      if (selectedLeadSource !== 'all') {
        filtered = filtered.filter(v => v.leadSource === selectedLeadSource);
      }

      let count = 0;
      if (selectedStatus !== 'all') count++;
      if (selectedLeadType !== 'all') count++;
      if (selectedLeadSource !== 'all') count++;
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
  }, [leads, searchQuery, selectedStatus, selectedLeadType, selectedLeadSource, sortField, sortDirection]);

  useEffect(() => { filterLeads(); }, [filterLeads]);

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
      setSelectedLeads(paginatedLeads.map(v => v.id));
    }
  }, [selectedLeads, paginatedLeads]);

  // ============ HANDLE SELECT LEAD ============
  const handleSelectLead = useCallback((leadId) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  }, []);

  // ============ VIEW / EDIT ============
  const handleViewLead = useCallback((lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  }, []);

  const handleEditLead = useCallback((lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  }, []);

  const handleSaveLead = useCallback((updatedLead) => {
    setLeads(prev => {
      const updated = prev.map(v => v.id === updatedLead.id ? updatedLead : v);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Lead "${updatedLead.leadName}" updated to ${STATUS_CONFIG[updatedLead.leadStatus]?.label}`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE ============
  const handleDeleteLead = useCallback((leadId) => {
    const lead = leads.find(v => v.id === leadId);
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
            const updated = prev.filter(v => v.id !== leadId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted lead "${lead.leadName}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [leads, computeStats]);

  // ============ STAT CLICK ============
  const handleStatClick = useCallback((filter) => {
    const nextFilter = activeFilter === filter ? 'all' : filter;
    setActiveFilter(nextFilter);
    setSelectedStatus(STATUS_KEYS.includes(nextFilter) ? nextFilter : 'all');
    setSelectedLeadType('all');
    setSelectedLeadSource('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [activeFilter]);

  // ============ CLEAR FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedLeadType('all');
    setSelectedLeadSource('all');
    setActiveFilter('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH ============
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

  // ============ EXPORT ============
  const handleExport = useCallback(() => {
    if (filteredLeads.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredLeads.map(v => ({
        'Lead Name': v.leadName || '',
        'Email': v.leadEmail || '',
        'Phone': v.contactNumber || '',
        'Property Interest': v.propertyInterest || '',
        'Budget': v.budget || '',
        'Lead Type': v.leadType || '',
        'Lead Source': v.leadSource || '',
        'Assigned Agent': v.assignedAgent || '',
        'Status': STATUS_CONFIG[v.leadStatus]?.label || v.leadStatus || '',
        'Created': new Date(v.createdAt).toLocaleDateString('en-IN') || '',
        'Notes': v.notes || ''
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
      setToast({ message: `${filteredLeads.length} leads exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredLeads]);

  // ============ BULK ACTIONS ============
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
      interested: {
        title: 'Mark as Interested',
        message: `Mark ${selectedLeads.length} selected lead(s) as Interested?`,
        confirmText: 'Confirm',
        type: 'info'
      },
      site_visit: {
        title: 'Mark for Site Visit',
        message: `Mark ${selectedLeads.length} selected lead(s) for Site Visit?`,
        confirmText: 'Confirm',
        type: 'info'
      },
      closed_won: {
        title: 'Mark as Closed Won',
        message: `Mark ${selectedLeads.length} selected lead(s) as Closed Won?`,
        confirmText: 'Confirm',
        type: 'info'
      },
      closed_lost: {
        title: 'Mark as Closed Lost',
        message: `Mark ${selectedLeads.length} selected lead(s) as Closed Lost?`,
        confirmText: 'Confirm',
        type: 'warning'
      }
    };

    const config = actionConfig[action];
    if (!config) return;

    const statusMap = { interested: 'interested', site_visit: 'site_visit', closed_won: 'closed_won', closed_lost: 'closed_lost' };

    setConfirmationModal({
      isOpen: true,
      ...config,
      onConfirm: () => {
        setActionLoading(action);
        setTimeout(() => {
          const selectedIds = new Set(selectedLeads);
          let count = 0;

          setLeads(prev => {
            let updated;
            if (action === 'delete') {
              count = prev.filter(v => selectedIds.has(v.id)).length;
              updated = prev.filter(v => !selectedIds.has(v.id));
            } else {
              updated = prev.map(v => {
                if (!selectedIds.has(v.id)) return v;
                count++;
                return { ...v, leadStatus: statusMap[action] };
              });
            }
            computeStats(updated);
            return updated;
          });

          setSelectedLeads([]);
          setActionLoading(null);

          if (action === 'delete') {
            setToast({ message: `${count} lead(s) deleted`, type: 'warning' });
          } else {
            setToast({ message: `${count} lead(s) marked as ${STATUS_CONFIG[statusMap[action]].label}`, type: 'success' });
          }
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedLeads, computeStats]);

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

      {showViewModal && viewingLead && (
        <ViewLeadModal
          lead={viewingLead}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingLead(null); }}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
        />
      )}

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
                Lead Management
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
              <span>Track leads through the full sales pipeline</span>
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

      {/* Stats Section — one card per status */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              {STATUS_KEYS.map((key, idx) => {
                const cfg = STATUS_CONFIG[key];
                const Icon = cfg.icon;
                return (
                  <StatCard
                    key={key}
                    icon={<Icon className="text-white text-sm" />}
                    title={cfg.short}
                    value={stats[key]}
                    color={`bg-gradient-to-br ${cfg.gradient}`}
                    delay={(idx + 1) * 50}
                    isActive={activeFilter === key}
                    statsAnimating={statsAnimating}
                    onClick={() => handleStatClick(key)}
                  />
                );
              })}
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
              placeholder="Search by name, property, agent, type, source..."
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
                {STATUS_KEYS.map(key => (
                  <option key={key} value={key}>{STATUS_CONFIG[key].label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedLeadType}
                onChange={(e) => setSelectedLeadType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
                <option value="Buyer">Buyer</option>
                <option value="Tenant">Tenant</option>
                <option value="Investor">Investor</option>
                <option value="Seller">Seller</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedLeadSource}
                onChange={(e) => setSelectedLeadSource(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Sources</option>
                <option value="Direct">Direct</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Other">Other</option>
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
                onClick={() => handleBulkAction('interested')}
                disabled={actionLoading === 'interested'}
                className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'interested' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiStar className="text-[10px]" />}
                Interested
              </button>
              <button
                onClick={() => handleBulkAction('site_visit')}
                disabled={actionLoading === 'site_visit'}
                className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'site_visit' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FaHome className="text-[10px]" />}
                Site Visit
              </button>
              <button
                onClick={() => handleBulkAction('closed_won')}
                disabled={actionLoading === 'closed_won'}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'closed_won' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Won
              </button>
              <button
                onClick={() => handleBulkAction('closed_lost')}
                disabled={actionLoading === 'closed_lost'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'closed_lost' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Lost
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
              const cfg = STATUS_CONFIG[lead.leadStatus] || STATUS_CONFIG.new;
              const StatusIcon = cfg.icon;
              const borderLeftClass = {
                new: 'border-l-blue-500',
                contacted: 'border-l-indigo-500',
                interested: 'border-l-amber-500',
                follow_up: 'border-l-purple-500',
                site_visit: 'border-l-teal-500',
                negotiation: 'border-l-orange-500',
                closed_won: 'border-l-emerald-500',
                closed_lost: 'border-l-red-500'
              }[lead.leadStatus] || 'border-l-slate-500';

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 border-l-4 ${borderLeftClass} ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
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
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                          {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{lead.leadName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap border ${cfg.badge}`}>
                            {cfg.short}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                        onClick={() => handleEditLead(lead)}
                        title="Update Lead"
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
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.leadEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.contactNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.propertyInterest || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.budget || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border bg-[#F5F9F8] text-[#5A7D78]">
                        {lead.leadType || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.assignedAgent || 'Unassigned'}</span>
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
                      <FiArrowRight className="text-[10px]" /> Update
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
                <span>Name</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyInterest')}>
                Property {sortField === 'propertyInterest' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Source</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('createdAt')}>
                Created {sortField === 'createdAt' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Agent</div>
              <div className="col-span-1">Budget</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedLeads.includes(lead.id);
              const cfg = STATUS_CONFIG[lead.leadStatus] || STATUS_CONFIG.new;

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
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                      {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{lead.leadName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{lead.leadEmail || ''}</p>
                  </div>

                  <div className="col-span-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{lead.leadType || 'N/A'}</div>
                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{lead.leadSource || 'N/A'}</div>
                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>
                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{lead.assignedAgent || 'N/A'}</div>
                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{lead.budget || 'N/A'}</div>

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
                      title="Update"
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
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No leads have been captured yet'}
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
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
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
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
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
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes pulse-once { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
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

export default LeadStatus;