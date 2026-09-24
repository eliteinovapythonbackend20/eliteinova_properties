// src/components/dashboard/admin/buyer&tenants/LeadManagement/LeadActions.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiCalendar, FiClock, FiCheckCircle,
  FiXCircle, FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiActivity, FiPhone, FiTag, FiSave,
  FiUserCheck, FiFileText, FiMail, FiMessageSquare, FiEdit3,
  FiUserPlus, FiRotateCw, FiSlash, FiFlag, FiPlusCircle, FiSend,
  FiExternalLink, FiChevronRight as FiArrow, FiTrash2, FiEye,
  FiRepeat, FiUserX, FiClipboard, FiCalendar as FiCalendarIcon,
  FiCheck, FiStar, FiUsers as FiUsersIcon,
  FiHome
} from 'react-icons/fi';
import { FaUserTie, FaWhatsapp } from 'react-icons/fa';

// ============================================================
// ADMIN LEAD ACTIONS CONFIG — single source of truth
// ============================================================
const LEAD_ACTIONS = {
  assignLead: {
    label: 'Assign Lead',
    icon: FiUserPlus,
    gradient: 'from-blue-600 to-blue-400',
    tint: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Assign this lead to a sales agent for follow-up.'
  },
  reassignLead: {
    label: 'Reassign Lead',
    icon: FiRepeat,
    gradient: 'from-indigo-600 to-indigo-400',
    tint: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Move this lead to a different agent.'
  },
  transferLead: {
    label: 'Transfer Lead',
    icon: FiUserX,
    gradient: 'from-purple-600 to-purple-400',
    tint: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Transfer lead to another team or branch.'
  },
  addFollowUp: {
    label: 'Add Follow-up',
    icon: FiCalendarIcon,
    gradient: 'from-teal-600 to-teal-400',
    tint: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Schedule a follow-up activity for this lead.'
  },
  addNote: {
    label: 'Add Note',
    icon: FiEdit3,
    gradient: 'from-amber-600 to-amber-400',
    tint: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Add a quick note or remark about this lead.'
  },
  call: {
    label: 'Call',
    icon: FiPhone,
    gradient: 'from-emerald-600 to-emerald-400',
    tint: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Call the lead directly.'
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: FaWhatsapp,
    gradient: 'from-green-600 to-green-400',
    tint: 'bg-green-50 text-green-700 border-green-200',
    description: 'Send a WhatsApp message to the lead.'
  },
  email: {
    label: 'Email',
    icon: FiMail,
    gradient: 'from-cyan-600 to-cyan-400',
    tint: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Send an email to the lead.'
  },
  scheduleSiteVisit: {
    label: 'Schedule Site Visit',
    icon: FiHome,
    gradient: 'from-rose-600 to-rose-400',
    tint: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Schedule an on-site property visit for this lead.'
  },
  closeLead: {
    label: 'Close Lead',
    icon: FiCheck,
    gradient: 'from-[#00695C] to-[#26A69A]',
    tint: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Mark this lead as closed (won or lost).'
  }
};

const STATUS_BADGE = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  follow_up: 'bg-purple-50 text-purple-700 border-purple-200',
  site_visit: 'bg-rose-50 text-rose-700 border-rose-200',
  negotiation: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  closed_won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed_lost: 'bg-red-50 text-red-700 border-red-200'
};

const STATUS_LABEL = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow-up',
  site_visit: 'Site Visit',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost'
};

// ============================================================
// TOAST COMPONENT
// ============================================================
const Toast = ({ toast, setToast }) => {
  if (!toast) return null;
  const colors = { success: 'bg-emerald-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-blue-500' };

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

  const handleConfirm = (e) => {
    e.stopPropagation();
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
          <button onClick={handleConfirm} className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] ${style.button}`}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => (
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

// ============================================================
// ASSIGN LEAD MODAL - TEXT INPUT FORMAT
// ============================================================
const AssignLeadModal = ({ lead, show, onClose, onConfirm, agentNames }) => {
  if (!lead || !show) return null;
  const [agentName, setAgentName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (show && lead) {
      setAgentName('');
      setNote('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (agentName.trim()) {
      onConfirm(agentName.trim(), note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiUserPlus /> Assign Lead</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · {lead.propertyInterest}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-2">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g., Agent Raj, Agent Priya"
              className="w-full px-4 py-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            <p className="text-[10px] text-[#B5C9C5] mt-1">Enter the full name of the agent to assign</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder="e.g., This lead is interested in premium properties"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!agentName.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REASSIGN LEAD MODAL - TEXT INPUT FORMAT
// ============================================================
const ReassignLeadModal = ({ lead, show, onClose, onConfirm, agentNames }) => {
  if (!lead || !show) return null;
  const [agentName, setAgentName] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (show && lead) {
      setAgentName('');
      setReason('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (agentName.trim()) {
      onConfirm(agentName.trim(), reason);
      onClose();
    }
  };

  const currentAgent = lead.assignedAgent || 'Unassigned';

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiRepeat /> Reassign Lead</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · Current: {currentAgent}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-2">New Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="e.g., Agent Amit, Agent Sneha"
              className="w-full px-4 py-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            <p className="text-[10px] text-[#B5C9C5] mt-1">Enter the full name of the new agent</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Reason for Reassignment</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder="e.g., Agent overloaded, better fit with new agent"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!agentName.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TRANSFER LEAD MODAL
// ============================================================
const TransferLeadModal = ({ lead, show, onClose, onConfirm }) => {
  if (!lead || !show) return null;
  const [team, setTeam] = useState('');
  const [reason, setReason] = useState('');
  const teams = ['Premium Team', 'Commercial Team', 'Residential Team', 'Luxury Team', 'NRI Team', 'North Branch', 'South Branch'];

  useEffect(() => {
    if (show && lead) {
      setTeam('');
      setReason('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (team) {
      onConfirm(team, reason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiUserX /> Transfer Lead</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · {lead.propertyInterest}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-2">Select Team / Branch</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {teams.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTeam(t)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-[1.01] text-left ${
                    team === t
                      ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white border-transparent shadow-md'
                      : 'bg-[#F5F9F8] text-[#1A2E2A] border-[#E8F0EE] hover:border-purple-300'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${team === t ? 'bg-white/20 text-white' : 'bg-white text-[#00695C]'}`}>
                    {t.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Reason for Transfer</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder="e.g., Better suited for premium team"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!team}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD FOLLOW-UP MODAL
// ============================================================
const AddFollowUpModal = ({ lead, show, onClose, onConfirm }) => {
  if (!lead || !show) return null;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('call');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (show && lead) {
      setDate('');
      setTime('');
      setType('call');
      setNote('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (date && time) {
      onConfirm(date, time, type, note);
      onClose();
    }
  };

  const followUpTypes = [
    { value: 'call', label: '📞 Call' },
    { value: 'whatsapp', label: '💬 WhatsApp' },
    { value: 'email', label: '✉️ Email' },
    { value: 'meeting', label: '🤝 Meeting' },
    { value: 'site_visit', label: '🏠 Site Visit' }
  ];

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiCalendarIcon /> Add Follow-up</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · {lead.propertyInterest}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Follow-up Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
            >
              {followUpTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder="e.g., Discuss pricing and availability"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!date || !time}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD NOTE MODAL
// ============================================================
const AddNoteModal = ({ lead, show, onClose, onConfirm }) => {
  if (!lead || !show) return null;
  const [note, setNote] = useState('');

  useEffect(() => {
    if (show && lead) {
      setNote('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (note.trim()) {
      onConfirm(note.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiEdit3 /> Add Note</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · {lead.propertyInterest}</p>
        </div>
        <div className="p-6 space-y-4">
          {lead.notes && (
            <div className="bg-[#F5F9F8] rounded-xl p-3 text-xs text-[#5A7D78]">
              <span className="font-semibold text-[#1A2E2A]">Existing: </span>{lead.notes}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">New Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder="Add a note about this lead..."
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!note.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="inline mr-2" /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CONTACT MODAL — For Call, WhatsApp, Email
// ============================================================
const ContactModal = ({ show, onClose, person, role, roleColor }) => {
  if (!show || !person) return null;

  const channels = [
    { 
      key: 'call', 
      label: 'Call', 
      icon: FiPhone, 
      detail: person.phone, 
      tint: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      hover: 'hover:bg-emerald-100',
      action: () => {
        if (person.phone && person.phone !== 'N/A') {
          const phone = person.phone.replace(/\s/g, '');
          window.location.href = `tel:${phone}`;
        }
      }
    },
    { 
      key: 'whatsapp', 
      label: 'WhatsApp', 
      icon: FaWhatsapp, 
      detail: person.phone, 
      tint: 'bg-green-50 text-green-700 border-green-200', 
      hover: 'hover:bg-green-100',
      action: () => {
        if (person.phone && person.phone !== 'N/A') {
          const phone = person.phone.replace(/\s/g, '');
          window.open(`https://wa.me/${phone}`, '_blank');
        }
      }
    },
    { 
      key: 'email', 
      label: 'Email', 
      icon: FiMail, 
      detail: person.email, 
      tint: 'bg-blue-50 text-blue-700 border-blue-200', 
      hover: 'hover:bg-blue-100',
      action: () => {
        if (person.email && person.email !== 'N/A') {
          window.location.href = `mailto:${person.email}`;
        }
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className={`p-6 bg-gradient-to-r ${roleColor} relative`}>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {person.name ? person.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{person.name || 'Unknown'}</h3>
              <p className="text-white/80 text-xs">{role}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-3">
          <p className="text-xs font-medium text-[#5A7D78] uppercase tracking-wider mb-2">Contact Options</p>
          
          {channels.map((ch) => {
            const Icon = ch.icon;
            const hasDetail = ch.detail && ch.detail !== 'undefined' && ch.detail !== 'null' && ch.detail !== 'N/A';
            
            return (
              <button
                key={ch.key}
                onClick={hasDetail ? ch.action : undefined}
                disabled={!hasDetail}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                  hasDetail 
                    ? `${ch.tint} ${ch.hover} hover:scale-[1.02] cursor-pointer` 
                    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`text-lg ${hasDetail ? '' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${hasDetail ? '' : 'text-gray-400'}`}>
                      {ch.label}
                    </p>
                    <p className={`text-xs ${hasDetail ? 'opacity-80' : 'text-gray-400'}`}>
                      {hasDetail ? ch.detail : 'Not available'}
                    </p>
                  </div>
                </div>
                {hasDetail && (
                  <FiExternalLink className="text-sm opacity-60" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE]">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SCHEDULE SITE VISIT MODAL
// ============================================================
const ScheduleSiteVisitModal = ({ lead, show, onClose, onConfirm }) => {
  if (!lead || !show) return null;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [property, setProperty] = useState(lead.propertyInterest || '');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (show && lead) {
      setDate('');
      setTime('');
      setProperty(lead.propertyInterest || '');
      setNote('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (date && time && property) {
      onConfirm(date, time, property, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-rose-600 to-rose-400 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiHome /> Schedule Site Visit</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · {lead.propertyInterest}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property</label>
            <input
              type="text"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
              placeholder="Enter property name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder="Any special instructions for the visit"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!date || !time || !property}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Visit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CLOSE LEAD MODAL
// ============================================================
const CloseLeadModal = ({ lead, show, onClose, onConfirm }) => {
  if (!lead || !show) return null;
  const [status, setStatus] = useState('closed_won');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (show && lead) {
      setStatus('closed_won');
      setReason('');
      setFeedback('');
    }
  }, [show, lead]);

  const handleConfirm = () => {
    if (status) {
      onConfirm(status, reason, feedback);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 bg-gradient-to-r from-[#00695C] to-[#26A69A] relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiCheck /> Close Lead</h3>
          <p className="text-white/80 text-sm mt-1">{lead.leadName} · {lead.propertyInterest}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-2">Closing Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('closed_won')}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                  status === 'closed_won'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-white border-transparent shadow-md'
                    : 'bg-[#F5F9F8] text-[#1A2E2A] border-[#E8F0EE] hover:border-emerald-300'
                }`}
              >
                🏆 Won
              </button>
              <button
                type="button"
                onClick={() => setStatus('closed_lost')}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                  status === 'closed_lost'
                    ? 'bg-gradient-to-r from-red-600 to-red-400 text-white border-transparent shadow-md'
                    : 'bg-[#F5F9F8] text-[#1A2E2A] border-[#E8F0EE] hover:border-red-300'
                }`}
              >
                ❌ Lost
              </button>
            </div>
          </div>
          {status === 'closed_lost' && (
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lost Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
              >
                <option value="">Select reason...</option>
                <option value="price">Price too high</option>
                <option value="location">Location not suitable</option>
                <option value="competitor">Chose competitor</option>
                <option value="property">Property not matching</option>
                <option value="budget">Budget constraints</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none placeholder:text-[#B5C9C5]"
              placeholder={status === 'closed_won' ? 'What worked well?' : 'What went wrong?'}
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={status === 'closed_lost' && !reason}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close Lead
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW LEAD MODAL
// ============================================================
const ViewLeadModal = ({ lead, show, onClose, onOpenActions, onDelete }) => {
  if (!lead || !show) return null;

  const handleOpenActions = (e) => {
    e.stopPropagation();
    if (onOpenActions) onOpenActions(lead);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(lead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Lead Details</h2>
          <p className="text-white/80 text-sm">{lead.leadName} · {lead.propertyInterest}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20`}>
              {STATUS_LABEL[lead.status] || lead.status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiUsersIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Information</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{lead.leadName || 'N/A'}</p>
              <p className="text-xs text-[#5A7D78]">{lead.email || ''}</p>
              <p className="text-xs text-[#5A7D78]">{lead.phone || ''}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHome className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Interest</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{lead.propertyInterest || 'N/A'}</p>
              <p className="text-xs text-[#5A7D78]">{lead.budget || ''}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned Agent</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{lead.assignedAgent || 'Unassigned'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_BADGE[lead.status] || STATUS_BADGE.new}`}>
                {STATUS_LABEL[lead.status] || lead.status}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUsers className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Source</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{lead.source || 'N/A'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Created</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{lead.createdDate || 'N/A'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Notes</h4>
              </div>
              <p className="text-sm text-[#1A2E2A] leading-relaxed">{lead.notes || 'No notes available'}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Close
            </button>
            <button
              onClick={handleOpenActions}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium hover:scale-[1.02]"
            >
              <FiPlusCircle className="inline mr-2" /> Lead Actions
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"
            >
              <FiTrash2 className="inline mr-2" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LEAD ACTIONS PANEL
// ============================================================
const LeadActionsPanel = ({ lead, show, onClose, onAction }) => {
  if (!lead || !show) return null;

  const actionKeys = Object.keys(LEAD_ACTIONS);

  const handleActionClick = (key) => {
    onAction(key, lead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Lead Actions</h2>
          <p className="text-white/80 text-sm">{lead.leadName} · {lead.propertyInterest}</p>
          <span className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20`}>
            Status: {STATUS_LABEL[lead.status] || lead.status}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actionKeys.map((key, idx) => {
              const cfg = LEAD_ACTIONS[key];
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleActionClick(key)}
                  className="flex items-start gap-3 p-4 bg-[#F5F9F8] rounded-2xl border border-[#E8F0EE] hover:border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-left group animate-slide-in"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1A2E2A] flex items-center gap-1">
                      {cfg.label}
                      <FiArrow className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                    </p>
                    <p className="text-[11px] text-[#5A7D78] mt-0.5 leading-snug">{cfg.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button onClick={onClose} className="w-full px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const LeadActions = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const agentNames = ['Agent Raj', 'Agent Priya', 'Agent Amit', 'Agent Sneha', 'Agent Vikram', 'Agent Deepa'];

  // ============ STATE ============
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // Panel + sub-modal state
  const [panelLead, setPanelLead] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // View modal state
  const [viewingLead, setViewingLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({ total: 0, new: 0, followUp: 0, siteVisit: 0, closedWon: 0 });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, new: 0, followUp: 0, siteVisit: 0, closedWon: 0 });
      return;
    }
    setStats({
      total: list.length,
      new: list.filter(l => l.status === 'new' ).length,
      followUp: list.filter(l => l.status === 'follow_up').length,
      siteVisit: list.filter(l => l.status === 'site_visit' || l.status === 'negotiation').length,
      closedWon: list.filter(l => l.status === 'closed_won').length
    });
  }, []);

  // ============ MOCK DATA ============
  const generateMockLeads = useCallback(() => {
    const leadNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai'];
    const properties = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower'];
    const statuses = ['new', 'contacted', 'follow_up', 'site_visit', 'negotiation', 'closed_won', 'closed_lost'];
    const sources = ['Website', 'Referral', 'Social Media', 'Walk-in', 'Call-in', 'Email', 'Partner'];
    const contactPrefixes = ['+91 98', '+91 97', '+91 99', '+91 88'];
    const budgets = ['₹50L-₹1Cr', '₹1Cr-₹2Cr', '₹2Cr-₹5Cr', '₹5Cr-₹10Cr', '₹10Cr+'];

    const leadsList = [];
    const usedNames = new Set();

    for (let i = 1; i <= 50; i++) {
      let property, leadName;
      let attempts = 0;
      do {
        property = properties[Math.floor(Math.random() * properties.length)];
        leadName = leadNames[Math.floor(Math.random() * leadNames.length)];
        attempts++;
      } while (usedNames.has(`${property}_${leadName}`) && attempts < 50);
      usedNames.add(`${property}_${leadName}`);

      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

      const hasAgent = Math.random() > 0.35;

      leadsList.push({
        id: `lead_${i}`,
        leadName,
        email: `${leadName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `${contactPrefixes[Math.floor(Math.random() * contactPrefixes.length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        propertyInterest: property,
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        assignedAgent: hasAgent ? agentNames[Math.floor(Math.random() * agentNames.length)] : '',
        createdDate: createdDate.toISOString().split('T')[0],
        notes: Math.random() > 0.6 ? 'Client is very interested and looking for a quick deal' : ''
      });
    }

    leadsList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    computeStats(leadsList);
    return leadsList;
  }, [computeStats]);

  // ============ INITIALIZE ============
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

  // ============ FILTER ============
  const filterLeads = useCallback(() => {
    try {
      let filtered = [...leads];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(l =>
          (l.leadName && l.leadName.toLowerCase().includes(query)) ||
          (l.propertyInterest && l.propertyInterest.toLowerCase().includes(query)) ||
          (l.assignedAgent && l.assignedAgent.toLowerCase().includes(query)) ||
          (l.email && l.email.toLowerCase().includes(query))
        );
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(l => l.status === selectedStatus);
      }

      let count = 0;
      if (selectedStatus !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setFilteredLeads(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering leads:', error);
    }
  }, [leads, searchQuery, selectedStatus]);

  useEffect(() => { filterLeads(); }, [filterLeads]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // ============ STAT CLICK ============
  const handleStatClick = useCallback((filter) => {
    const nextFilter = activeFilter === filter ? 'all' : filter;
    setActiveFilter(nextFilter);
    setSelectedStatus(nextFilter);
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [activeFilter]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setActiveFilter('all');
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

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
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockLeads]);

  const handleExport = useCallback(() => {
    if (filteredLeads.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredLeads.map(l => ({
        'Lead Name': l.leadName || '',
        'Property Interest': l.propertyInterest || '',
        'Assigned Agent': l.assignedAgent || '',
        'Status': STATUS_LABEL[l.status] || l.status || '',
        'Source': l.source || '',
        'Created Date': l.createdDate || '',
        'Notes': l.notes || ''
      }));
      const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lead_actions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredLeads.length} records exported successfully`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredLeads]);

  // ============ OPEN PANEL ============
  const openPanel = useCallback((lead) => {
    setPanelLead(lead);
    setShowPanel(true);
  }, []);

  // ============ OPEN VIEW ============
  const openView = useCallback((lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  }, []);

  // ============ DELETE LEAD ============
  const handleDeleteLead = useCallback((lead) => {
    if (!lead) return;
    setShowViewModal(false);
    setShowPanel(false);
    setActiveModal(null);
    setConfirmationModal({
      isOpen: true,
      title: 'Remove Lead',
      message: `Are you sure you want to remove the lead "${lead.leadName}" interested in "${lead.propertyInterest}"?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setLeads(prev => {
          const updated = prev.filter(l => l.id !== lead.id);
          computeStats(updated);
          return updated;
        });
        setViewingLead(null);
        setPanelLead(null);
        setToast({ message: `Removed lead "${lead.leadName}"`, type: 'warning' });
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [computeStats]);

  // ============ UPDATE LEAD HELPER ============
  const updateLead = useCallback((leadId, patch) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, ...patch } : l);
      computeStats(updated);
      return updated;
    });
    setPanelLead(prev => {
      if (prev && prev.id === leadId) {
        return { ...prev, ...patch };
      }
      return prev;
    });
    setViewingLead(prev => {
      if (prev && prev.id === leadId) {
        return { ...prev, ...patch };
      }
      return prev;
    });
  }, [computeStats]);

  // ============ HANDLE ACTION FROM PANEL ============
  const handleAction = useCallback((actionKey, lead) => {
    setShowPanel(false);

    switch (actionKey) {
      case 'assignLead':
        setActiveModal('assignLead');
        break;
      case 'reassignLead':
        setActiveModal('reassignLead');
        break;
      case 'transferLead':
        setActiveModal('transferLead');
        break;
      case 'addFollowUp':
        setActiveModal('addFollowUp');
        break;
      case 'addNote':
        setActiveModal('addNote');
        break;
      case 'call':
        setActiveModal('call');
        break;
      case 'whatsapp':
        setActiveModal('whatsapp');
        break;
      case 'email':
        setActiveModal('email');
        break;
      case 'scheduleSiteVisit':
        setActiveModal('scheduleSiteVisit');
        break;
      case 'closeLead':
        setActiveModal('closeLead');
        break;
      default:
        break;
    }
  }, []);

  const closeSubModal = () => {
    setActiveModal(null);
    if (panelLead) {
      setShowPanel(true);
    }
  };

  const handleViewOpenActions = useCallback((lead) => {
    setViewingLead(null);
    setShowViewModal(false);
    setPanelLead(lead);
    setShowPanel(true);
  }, []);

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
        onConfirm={() => {
          if (confirmationModal.onConfirm) confirmationModal.onConfirm();
        }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {/* View Modal */}
      <ViewLeadModal
        lead={viewingLead}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingLead(null); }}
        onOpenActions={handleViewOpenActions}
        onDelete={handleDeleteLead}
      />

      {/* Lead Actions Panel */}
      <LeadActionsPanel
        lead={panelLead}
        show={showPanel}
        onClose={() => { setShowPanel(false); setPanelLead(null); }}
        onAction={handleAction}
      />

      {/* Sub-modals */}
      <AssignLeadModal
        lead={panelLead}
        show={activeModal === 'assignLead'}
        onClose={closeSubModal}
        agentNames={agentNames}
        onConfirm={(agent, note) => {
          updateLead(panelLead.id, { assignedAgent: agent, notes: note || panelLead.notes });
          setToast({ message: `${agent} assigned to "${panelLead.leadName}"`, type: 'success' });
        }}
      />
      <ReassignLeadModal
        lead={panelLead}
        show={activeModal === 'reassignLead'}
        onClose={closeSubModal}
        agentNames={agentNames}
        onConfirm={(agent, reason) => {
          updateLead(panelLead.id, { assignedAgent: agent, notes: `${panelLead.notes || ''} ${reason ? `Reassigned: ${reason}` : ''}` });
          setToast({ message: `Lead reassigned to ${agent}`, type: 'success' });
        }}
      />
      <TransferLeadModal
        lead={panelLead}
        show={activeModal === 'transferLead'}
        onClose={closeSubModal}
        onConfirm={(team, reason) => {
          updateLead(panelLead.id, { notes: `${panelLead.notes || ''} Transferred to ${team}. ${reason ? `Reason: ${reason}` : ''}` });
          setToast({ message: `Lead transferred to ${team}`, type: 'success' });
        }}
      />
      <AddFollowUpModal
        lead={panelLead}
        show={activeModal === 'addFollowUp'}
        onClose={closeSubModal}
        onConfirm={(date, time, type, note) => {
          updateLead(panelLead.id, { 
            status: 'follow_up',
            notes: `${panelLead.notes || ''} Follow-up (${type}) scheduled for ${date} at ${time}. ${note || ''}`
          });
          setToast({ message: `Follow-up scheduled for ${panelLead.leadName}`, type: 'success' });
        }}
      />
      <AddNoteModal
        lead={panelLead}
        show={activeModal === 'addNote'}
        onClose={closeSubModal}
        onConfirm={(note) => {
          updateLead(panelLead.id, { notes: `${panelLead.notes || ''} ${note}` });
          setToast({ message: 'Note saved', type: 'success' });
        }}
      />
      <ContactModal
        show={activeModal === 'call' || activeModal === 'whatsapp' || activeModal === 'email'}
        onClose={closeSubModal}
        person={panelLead ? { 
          name: panelLead.leadName || 'Unknown Lead', 
          phone: panelLead.phone || 'N/A', 
          email: panelLead.email || 'N/A' 
        } : null}
        role="Lead"
        roleColor="from-emerald-600 to-emerald-400"
      />
      <ScheduleSiteVisitModal
        lead={panelLead}
        show={activeModal === 'scheduleSiteVisit'}
        onClose={closeSubModal}
        onConfirm={(date, time, property, note) => {
          updateLead(panelLead.id, { 
            status: 'site_visit',
            propertyInterest: property || panelLead.propertyInterest,
            notes: `${panelLead.notes || ''} Site visit scheduled for ${date} at ${time}. ${note || ''}`
          });
          setToast({ message: `Site visit scheduled for ${panelLead.leadName}`, type: 'success' });
        }}
      />
      <CloseLeadModal
        lead={panelLead}
        show={activeModal === 'closeLead'}
        onClose={closeSubModal}
        onConfirm={(status, reason, feedback) => {
          updateLead(panelLead.id, { 
            status: status,
            notes: `${panelLead.notes || ''} Closed as ${status === 'closed_won' ? 'WON' : 'LOST'}. ${reason ? `Reason: ${reason}` : ''} ${feedback ? `Feedback: ${feedback}` : ''}`
          });
          setToast({ message: `Lead closed as ${status === 'closed_won' ? 'WON 🏆' : 'LOST'}`, type: 'success' });
        }}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Lead Actions
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
              <span>Manage, assign and track leads</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button onClick={() => setShowStats(!showStats)} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105">
              <FiActivity className={`text-sm transition-transform duration-300 ${showStats ? 'rotate-0' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button onClick={handleRefresh} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              <StatCard icon={<FiUsersIcon className="text-white text-sm" />} title="Total" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={activeFilter === 'all'} statsAnimating={statsAnimating} onClick={() => handleStatClick('all')} />
              <StatCard icon={<FiUserPlus className="text-white text-sm" />} title="New" value={stats.new} color="bg-gradient-to-br from-blue-600 to-blue-400" delay={50} isActive={activeFilter === 'new' || activeFilter === 'contacted'} statsAnimating={statsAnimating} onClick={() => handleStatClick('new')} />
              <StatCard icon={<FiClock className="text-white text-sm" />} title="Follow-up" value={stats.followUp} color="bg-gradient-to-br from-purple-600 to-purple-400" delay={100} isActive={activeFilter === 'follow_up'} statsAnimating={statsAnimating} onClick={() => handleStatClick('follow_up')} />
              <StatCard icon={<FiHome className="text-white text-sm" />} title="Site Visit" value={stats.siteVisit} color="bg-gradient-to-br from-rose-600 to-rose-400" delay={150} isActive={activeFilter === 'site_visit' || activeFilter === 'negotiation'} statsAnimating={statsAnimating} onClick={() => handleStatClick('site_visit')} />
              <StatCard icon={<FiCheckCircle className="text-white text-sm" />} title="Closed Won" value={stats.closedWon} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={200} isActive={activeFilter === 'closed_won'} statsAnimating={statsAnimating} onClick={() => handleStatClick('closed_won')} />
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
              placeholder="Search by lead name, property, agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setActiveFilter(e.target.value); }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up">Follow-up</option>
                <option value="site_visit">Site Visit</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed_won">Closed Won</option>
                <option value="closed_lost">Closed Lost</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {filterCount > 0 && (
              <button onClick={clearAllFilters} className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105">
                <FiX className="text-sm" /> Clear
              </button>
            )}

            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="Grid View">
                <FiGridIcon className="text-sm" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="List View">
                <FiList className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedLeads.map((lead, index) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-2 gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-lg shrink-0">
                      {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{lead.leadName}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap border ${STATUS_BADGE[lead.status]}`}>
                        {STATUS_LABEL[lead.status]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiHome className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{lead.propertyInterest || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{lead.assignedAgent || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiCalendar className="text-[#00695C] flex-shrink-0" />
                    <span>{lead.createdDate ? new Date(lead.createdDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiUsers className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{lead.source || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                  <button
                    type="button"
                    onClick={() => openView(lead)}
                    className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiEye className="text-[10px]" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => openPanel(lead)}
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiPlusCircle className="text-[10px]" /> Actions
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLead(lead);
                    }}
                    className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiTrash2 className="text-[10px]" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden ">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-2">Lead</div>
              <div className="col-span-3">Property</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Agent</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedLeads.map((lead, index) => (
              <div key={lead.id} className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group" style={{ animationDelay: `${index * 30}ms` }}>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {lead.leadName ? lead.leadName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                  </div>
                  <p className="font-semibold text-sm text-[#1A2E2A] truncate">{lead.leadName || 'N/A'}</p>
                </div>
                <div className="col-span-3 text-xs text-[#5A7D78] truncate">{lead.propertyInterest || 'N/A'}</div>
                <div className="col-span-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${STATUS_BADGE[lead.status]}`}>
                    {STATUS_LABEL[lead.status]}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-[#5A7D78] truncate">{lead.assignedAgent || 'Unassigned'}</div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openView(lead)}
                    className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                    title="View"
                  >
                    <FiEye className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openPanel(lead)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-lg hover:shadow-md transition-all duration-300 flex items-center gap-1 hover:scale-105"
                  >
                    <FiPlusCircle className="text-xs" /> Actions
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLead(lead);
                    }}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110"
                    title="Remove"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedLeads.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUsersIcon className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No leads found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No leads have been added yet'}
            </p>
            {filterCount > 0 && (
              <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105">
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredLeads.length)} of {filteredLeads.length} leads
            </span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${currentPage === pageNum ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
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

export default LeadActions;