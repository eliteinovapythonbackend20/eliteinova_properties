// src/components/dashboard/admin/buyer&tenants/SiteVisits/SiteVisitActions.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHome, FiCalendar, FiClock, FiUser, FiCheckCircle,
  FiXCircle, FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiActivity, FiPhone, FiTag, FiSave,
  FiUserCheck, FiFileText, FiMail, FiMessageSquare, FiEdit3,
  FiUserPlus, FiRotateCw, FiSlash, FiFlag, FiPlusCircle, FiSend,
  FiExternalLink, FiChevronRight as FiArrow, FiTrash2, FiEye
} from 'react-icons/fi';
import { FaUserTie, FaWhatsapp } from 'react-icons/fa';

// ============================================================
// ADMIN ACTIONS CONFIG — single source of truth
// ============================================================
const ADMIN_ACTIONS = {
  approve: {
    label: 'Approve Visit',
    icon: FiCheckCircle,
    gradient: 'from-emerald-600 to-emerald-400',
    tint: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Confirm this visit request and lock in the slot.'
  },
  assignAgent: {
    label: 'Assign Agent',
    icon: FiUserPlus,
    gradient: 'from-blue-600 to-blue-400',
    tint: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Pick who will handle this visit on the ground.'
  },
  reschedule: {
    label: 'Reschedule',
    icon: FiRotateCw,
    gradient: 'from-purple-600 to-purple-400',
    tint: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Move this visit to a new date and time.'
  },
  cancel: {
    label: 'Cancel',
    icon: FiSlash,
    gradient: 'from-red-600 to-red-400',
    tint: 'bg-red-50 text-red-700 border-red-200',
    description: 'Call off the visit and notify both parties.'
  },
  markCompleted: {
    label: 'Mark Completed',
    icon: FiFlag,
    gradient: 'from-teal-600 to-teal-400',
    tint: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Record that the visit took place.'
  },
  addRemarks: {
    label: 'Add Remarks',
    icon: FiEdit3,
    gradient: 'from-amber-600 to-amber-400',
    tint: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Note down anything useful for the record.'
  },
  contactBuyer: {
    label: 'Contact Buyer',
    icon: FiPhone,
    gradient: 'from-cyan-600 to-cyan-400',
    tint: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Reach the buyer / tenant directly.'
  },
  contactOwner: {
    label: 'Contact Owner / Agent',
    icon: FiPhone,
    gradient: 'from-indigo-600 to-indigo-400',
    tint: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Reach the property owner or agent directly.'
  }
};

const STATUS_BADGE = {
  requested: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  pending_confirmation: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  no_show: 'bg-rose-50 text-rose-700 border-rose-200'
};

const STATUS_LABEL = {
  requested: 'Requested',
  pending_confirmation: 'Pending Confirmation',
  confirmed: 'Confirmed',
  rescheduled: 'Rescheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show'
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
    className={`bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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
        <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active</span>
      </div>
    )}
  </div>
);

// ============================================================
// ASSIGN AGENT MODAL
// ============================================================
const AssignAgentModal = ({ visit, show, onClose, onConfirm, agentNames }) => {
  if (!visit || !show) return null;
  const [selectedAgent, setSelectedAgent] = useState(visit.assignedAgent || '');
  const [note, setNote] = useState('');

  // Reset state when modal opens with new visit
  useEffect(() => {
    if (show && visit) {
      setSelectedAgent(visit.assignedAgent || '');
      setNote('');
    }
  }, [show, visit]);

  const handleConfirm = () => {
    if (selectedAgent) {
      onConfirm(selectedAgent, note);
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
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiUserPlus /> Assign Agent</h3>
          <p className="text-white/80 text-sm mt-1">{visit.buyerName} · {visit.propertyName}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-2">Select Agent</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {agentNames.map(agent => (
                <button
                  key={agent}
                  type="button"
                  onClick={() => setSelectedAgent(agent)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-[1.01] text-left ${
                    selectedAgent === agent
                      ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white border-transparent shadow-md'
                      : 'bg-[#F5F9F8] text-[#1A2E2A] border-[#E8F0EE] hover:border-blue-300'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedAgent === agent ? 'bg-white/20 text-white' : 'bg-white text-[#00695C]'}`}>
                    {agent.replace('Agent ', '').slice(0, 2).toUpperCase()}
                  </div>
                  {agent}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
              placeholder="e.g., Prioritize this visit, buyer is flying in"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAgent}
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
// RESCHEDULE MODAL
// ============================================================
const RescheduleModal = ({ visit, show, onClose, onConfirm }) => {
  if (!visit || !show) return null;
  const [date, setDate] = useState(visit.visitDate || '');
  const [time, setTime] = useState(visit.visitTime || '');
  const [reason, setReason] = useState('');

  // Reset state when modal opens with new visit
  useEffect(() => {
    if (show && visit) {
      setDate(visit.visitDate || '');
      setTime(visit.visitTime || '');
      setReason('');
    }
  }, [show, visit]);

  const handleConfirm = () => {
    if (date && time) {
      onConfirm(date, time, reason);
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
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiRotateCw /> Reschedule Visit</h3>
          <p className="text-white/80 text-sm mt-1">{visit.buyerName} · {visit.propertyName}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">New Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A7D78] mb-1">New Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="2"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
              placeholder="e.g., Buyer requested a later slot"
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
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD REMARKS MODAL
// ============================================================
const AddRemarksModal = ({ visit, show, onClose, onConfirm }) => {
  if (!visit || !show) return null;
  const [remark, setRemark] = useState('');

  // Reset state when modal opens with new visit
  useEffect(() => {
    if (show && visit) {
      setRemark('');
    }
  }, [show, visit]);

  const handleConfirm = () => {
    if (remark.trim()) {
      onConfirm(remark.trim());
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
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiEdit3 /> Add Remarks</h3>
          <p className="text-white/80 text-sm mt-1">{visit.buyerName} · {visit.propertyName}</p>
        </div>
        <div className="p-6 space-y-4">
          {visit.remarks && (
            <div className="bg-[#F5F9F8] rounded-xl p-3 text-xs text-[#5A7D78]">
              <span className="font-semibold text-[#1A2E2A]">Existing: </span>{visit.remarks}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">New Remark</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
              placeholder="Add a note about this visit..."
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!remark.trim()}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="inline mr-2" /> Save Remark
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CONTACT MODAL — Fixed with proper contact actions
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
    },
    { 
      key: 'sms', 
      label: 'SMS / Message', 
      icon: FiMessageSquare, 
      detail: person.phone, 
      tint: 'bg-purple-50 text-purple-700 border-purple-200', 
      hover: 'hover:bg-purple-100',
      action: () => {
        if (person.phone && person.phone !== 'N/A') {
          const phone = person.phone.replace(/\s/g, '');
          window.location.href = `sms:${phone}`;
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
          
          {channels.map((ch, index) => {
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
// VIEW VISIT MODAL
// ============================================================
const ViewVisitModal = ({ visit, show, onClose, onOpenActions, onDelete }) => {
  if (!visit || !show) return null;

  const formattedDate = visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }) : 'N/A';

  const handleOpenActions = (e) => {
    e.stopPropagation();
    if (onOpenActions) onOpenActions(visit);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(visit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Visit Details</h2>
          <p className="text-white/80 text-sm">{visit.buyerName} · {visit.propertyName}</p>
          <span className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20`}>
            {STATUS_LABEL[visit.visitStatus] || visit.visitStatus}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiUsers className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer / Tenant</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{visit.buyerName || 'N/A'}</p>
              <p className="text-xs text-[#5A7D78]">{visit.buyerEmail || ''}</p>
              <p className="text-xs text-[#5A7D78]">{visit.buyerPhone || ''}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHome className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{visit.propertyName || 'N/A'}</p>
              <p className="text-xs text-[#5A7D78]">{visit.propertyType || ''}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUserTie className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Owner / Agent</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{visit.ownerName || 'N/A'}</p>
              <p className="text-xs text-[#5A7D78]">{visit.ownerEmail || ''}</p>
              <p className="text-xs text-[#5A7D78]">{visit.ownerPhone || ''}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Date</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{formattedDate}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiClock className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Time</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{visit.visitTime || 'N/A'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned Agent</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{visit.assignedAgent || 'Unassigned'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_BADGE[visit.visitStatus]}`}>
                {STATUS_LABEL[visit.visitStatus]}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Remarks</h4>
              </div>
              <p className="text-sm text-[#1A2E2A] leading-relaxed">{visit.remarks || 'No remarks available'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Close
            </button>
            <button
              onClick={handleOpenActions}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium hover:scale-[1.02]"
            >
              <FiPlusCircle className="inline mr-2" /> Admin Actions
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
// ADMIN ACTIONS PANEL — the signature element
// ============================================================
const ActionsPanel = ({ visit, show, onClose, onAction }) => {
  if (!visit || !show) return null;

  const actionKeys = Object.keys(ADMIN_ACTIONS);

  const handleActionClick = (key) => {
    onAction(key, visit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Admin Actions</h2>
          <p className="text-white/80 text-sm">{visit.buyerName} · {visit.propertyName}</p>
          <span className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20`}>
            Currently: {STATUS_LABEL[visit.visitStatus] || visit.visitStatus}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actionKeys.map((key, idx) => {
              const cfg = ADMIN_ACTIONS[key];
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

        {/* Footer */}
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
const SiteVisitActions = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const agentNames = ['Agent Raj', 'Agent Priya', 'Agent Amit', 'Agent Sneha', 'Agent Vikram', 'Agent Deepa'];

  // ============ STATE ============
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
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
  const [panelVisit, setPanelVisit] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'assignAgent' | 'reschedule' | 'addRemarks' | 'contactBuyer' | 'contactOwner'

  // View modal state
  const [viewingVisit, setViewingVisit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({ total: 0, needsAction: 0, confirmed: 0, completed: 0, cancelled: 0 });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, needsAction: 0, confirmed: 0, completed: 0, cancelled: 0 });
      return;
    }
    setStats({
      total: list.length,
      needsAction: list.filter(v => v.visitStatus === 'requested' || v.visitStatus === 'pending_confirmation').length,
      confirmed: list.filter(v => v.visitStatus === 'confirmed').length,
      completed: list.filter(v => v.visitStatus === 'completed').length,
      cancelled: list.filter(v => v.visitStatus === 'cancelled' || v.visitStatus === 'no_show').length
    });
  }, []);

  // ============ MOCK DATA ============
  const generateMockVisits = useCallback(() => {
    const buyerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa'];
    const ownerNames = ['Mr. Sharma', 'Mrs. Patel', 'Dr. Reddy', 'Ms. Gupta', 'Mr. Singh', 'Mrs. Mehta', 'Mr. Kumar', 'Ms. Joshi', 'Mr. Nair', 'Mrs. Pillai'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['requested', 'pending_confirmation', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show'];
    const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    const contactPrefixes = ['+91 98', '+91 97', '+91 99', '+91 88'];

    const visitsList = [];
    const usedNames = new Set();

    for (let i = 1; i <= 50; i++) {
      let propertyName, buyerName;
      let attempts = 0;
      do {
        propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
        buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
        attempts++;
      } while (usedNames.has(`${propertyName}_${buyerName}`) && attempts < 50);
      usedNames.add(`${propertyName}_${buyerName}`);

      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 30 - 15));
      const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];
      const hasAgent = Math.random() > 0.35;

      visitsList.push({
        id: `action_${i}`,
        buyerName,
        buyerEmail: `${buyerName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        buyerPhone: `${contactPrefixes[Math.floor(Math.random() * contactPrefixes.length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        ownerName,
        ownerEmail: `owner${Math.floor(Math.random() * 50)}@email.com`,
        ownerPhone: `${contactPrefixes[Math.floor(Math.random() * contactPrefixes.length)]}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
        visitDate: visitDate.toISOString().split('T')[0],
        visitTime: times[Math.floor(Math.random() * times.length)],
        assignedAgent: hasAgent ? agentNames[Math.floor(Math.random() * agentNames.length)] : '',
        visitStatus: statuses[Math.floor(Math.random() * statuses.length)],
        remarks: Math.random() > 0.6 ? 'Client requested additional information about the property' : ''
      });
    }

    visitsList.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    computeStats(visitsList);
    return visitsList;
  }, [computeStats]);

  // ============ INITIALIZE ============
  useEffect(() => {
    try {
      const mockVisits = generateMockVisits();
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
    } catch (error) {
      console.error('Error generating mock visits:', error);
    }
  }, [generateMockVisits]);

  // ============ FILTER ============
  const filterVisits = useCallback(() => {
    try {
      let filtered = [...visits];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(v =>
          (v.buyerName && v.buyerName.toLowerCase().includes(query)) ||
          (v.propertyName && v.propertyName.toLowerCase().includes(query)) ||
          (v.ownerName && v.ownerName.toLowerCase().includes(query)) ||
          (v.assignedAgent && v.assignedAgent.toLowerCase().includes(query))
        );
      }

      if (selectedStatus !== 'all') {
        if (selectedStatus === 'needsAction') {
          filtered = filtered.filter(v => v.visitStatus === 'requested' || v.visitStatus === 'pending_confirmation');
        } else if (selectedStatus === 'cancelled') {
          filtered = filtered.filter(v => v.visitStatus === 'cancelled' || v.visitStatus === 'no_show');
        } else {
          filtered = filtered.filter(v => v.visitStatus === selectedStatus);
        }
      }

      let count = 0;
      if (selectedStatus !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
      setFilteredVisits(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering visits:', error);
    }
  }, [visits, searchQuery, selectedStatus]);

  useEffect(() => { filterVisits(); }, [filterVisits]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / pageSize));
  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVisits.slice(start, start + pageSize);
  }, [filteredVisits, currentPage, pageSize]);

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
        const mockVisits = generateMockVisits();
        setVisits(mockVisits);
        setFilteredVisits(mockVisits);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockVisits]);

  const handleExport = useCallback(() => {
    if (filteredVisits.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredVisits.map(v => ({
        'Buyer Name': v.buyerName || '', 'Property': v.propertyName || '',
        'Owner/Agent': v.ownerName || '', 'Assigned Agent': v.assignedAgent || '',
        'Visit Date': v.visitDate || '', 'Visit Time': v.visitTime || '',
        'Status': STATUS_LABEL[v.visitStatus] || v.visitStatus || '', 'Remarks': v.remarks || ''
      }));
      const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site_visit_actions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredVisits.length} records exported successfully`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredVisits]);

  // ============ OPEN PANEL ============
  const openPanel = useCallback((visit) => {
    setPanelVisit(visit);
    setShowPanel(true);
  }, []);

  // ============ OPEN VIEW ============
  const openView = useCallback((visit) => {
    setViewingVisit(visit);
    setShowViewModal(true);
  }, []);

  // ============ REMOVE / DELETE VISIT ============
  const handleDeleteVisit = useCallback((visit) => {
    if (!visit) return;
    // Close all modals first
    setShowViewModal(false);
    setShowPanel(false);
    setActiveModal(null);
    // Then show confirmation
    setConfirmationModal({
      isOpen: true,
      title: 'Remove Site Visit',
      message: `Are you sure you want to remove the visit for "${visit.propertyName}" with ${visit.buyerName}?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setVisits(prev => {
          const updated = prev.filter(v => v.id !== visit.id);
          computeStats(updated);
          return updated;
        });
        setViewingVisit(null);
        setPanelVisit(null);
        setToast({ message: `Removed visit for "${visit.propertyName}"`, type: 'warning' });
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [computeStats]);

  // ============ UPDATE VISIT HELPER ============
  const updateVisit = useCallback((visitId, patch) => {
    setVisits(prev => {
      const updated = prev.map(v => v.id === visitId ? { ...v, ...patch } : v);
      computeStats(updated);
      return updated;
    });
    // Update panelVisit if it's the same one
    setPanelVisit(prev => {
      if (prev && prev.id === visitId) {
        return { ...prev, ...patch };
      }
      return prev;
    });
    // Update viewingVisit if it's the same one
    setViewingVisit(prev => {
      if (prev && prev.id === visitId) {
        return { ...prev, ...patch };
      }
      return prev;
    });
  }, [computeStats]);

  // ============ HANDLE ACTION SELECTION FROM PANEL ============
  const handleAction = useCallback((actionKey, visit) => {
    // Close the panel first
    setShowPanel(false);

    switch (actionKey) {
      case 'approve':
        setConfirmationModal({
          isOpen: true,
          title: 'Approve Visit',
          message: `Confirm the visit for "${visit.propertyName}" with ${visit.buyerName}?`,
          confirmText: 'Approve',
          cancelText: 'Cancel',
          type: 'info',
          onConfirm: () => {
            updateVisit(visit.id, { visitStatus: 'confirmed' });
            setToast({ message: `Visit approved for "${visit.propertyName}"`, type: 'success' });
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        });
        break;

      case 'markCompleted':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Completed',
          message: `Mark the visit for "${visit.propertyName}" as completed?`,
          confirmText: 'Mark Completed',
          cancelText: 'Cancel',
          type: 'info',
          onConfirm: () => {
            updateVisit(visit.id, { visitStatus: 'completed' });
            setToast({ message: `Visit marked completed for "${visit.propertyName}"`, type: 'success' });
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        });
        break;

      case 'cancel':
        setConfirmationModal({
          isOpen: true,
          title: 'Cancel Visit',
          message: `Cancel the visit for "${visit.propertyName}" with ${visit.buyerName}?`,
          confirmText: 'Cancel Visit',
          cancelText: 'Keep It',
          type: 'danger',
          onConfirm: () => {
            updateVisit(visit.id, { visitStatus: 'cancelled' });
            setToast({ message: `Visit cancelled for "${visit.propertyName}"`, type: 'warning' });
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
        });
        break;

      case 'contactBuyer':
        // Open contact modal for buyer
        setActiveModal('contactBuyer');
        break;

      case 'contactOwner':
        // Open contact modal for owner
        setActiveModal('contactOwner');
        break;

      default:
        // Modal-based actions: assignAgent, reschedule, addRemarks
        setActiveModal(actionKey);
        break;
    }
  }, [updateVisit]);

  const closeSubModal = () => {
    setActiveModal(null);
    // Re-open the panel if we still have a visit
    if (panelVisit) {
      setShowPanel(true);
    }
  };

  // ============ HANDLE VIEW MODAL ACTIONS ============
  const handleViewOpenActions = useCallback((visit) => {
    setViewingVisit(null);
    setShowViewModal(false);
    // Open the panel
    setPanelVisit(visit);
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
      <ViewVisitModal
        visit={viewingVisit}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingVisit(null); }}
        onOpenActions={handleViewOpenActions}
        onDelete={handleDeleteVisit}
      />

      {/* Actions Panel */}
      <ActionsPanel
        visit={panelVisit}
        show={showPanel}
        onClose={() => { setShowPanel(false); setPanelVisit(null); }}
        onAction={handleAction}
      />

      {/* Sub-modals */}
      <AssignAgentModal
        visit={panelVisit}
        show={activeModal === 'assignAgent'}
        onClose={closeSubModal}
        agentNames={agentNames}
        onConfirm={(agent) => {
          updateVisit(panelVisit.id, { assignedAgent: agent });
          setToast({ message: `${agent} assigned to "${panelVisit.propertyName}"`, type: 'success' });
        }}
      />
      <RescheduleModal
        visit={panelVisit}
        show={activeModal === 'reschedule'}
        onClose={closeSubModal}
        onConfirm={(date, time) => {
          updateVisit(panelVisit.id, { visitDate: date, visitTime: time, visitStatus: 'rescheduled' });
          setToast({ message: `Visit rescheduled for "${panelVisit.propertyName}"`, type: 'success' });
        }}
      />
      <AddRemarksModal
        visit={panelVisit}
        show={activeModal === 'addRemarks'}
        onClose={closeSubModal}
        onConfirm={(remark) => {
          updateVisit(panelVisit.id, { remarks: remark });
          setToast({ message: 'Remark saved', type: 'success' });
        }}
      />
      <ContactModal
        show={activeModal === 'contactBuyer'}
        onClose={closeSubModal}
        person={panelVisit ? { 
          name: panelVisit.buyerName || 'Unknown Buyer', 
          phone: panelVisit.buyerPhone || 'N/A', 
          email: panelVisit.buyerEmail || 'N/A' 
        } : null}
        role="Buyer / Tenant"
        roleColor="from-cyan-600 to-cyan-400"
      />
      <ContactModal
        show={activeModal === 'contactOwner'}
        onClose={closeSubModal}
        person={panelVisit ? { 
          name: panelVisit.ownerName || 'Unknown Owner', 
          phone: panelVisit.ownerPhone || 'N/A', 
          email: panelVisit.ownerEmail || 'N/A' 
        } : null}
        role="Owner / Agent"
        roleColor="from-indigo-600 to-indigo-400"
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Admin Actions
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredVisits.length} Visits
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Approve, assign, reschedule and manage site visits</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <StatCard icon={<FiActivity className="text-white text-sm" />} title="Total" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={activeFilter === 'all'} statsAnimating={statsAnimating} onClick={() => handleStatClick('all')} />
              <StatCard icon={<FiAlertTriangle className="text-white text-sm" />} title="Needs Action" value={stats.needsAction} color="bg-gradient-to-br from-amber-600 to-amber-400" delay={50} isActive={activeFilter === 'needsAction'} statsAnimating={statsAnimating} onClick={() => handleStatClick('needsAction')} />
              <StatCard icon={<FiCheckCircle className="text-white text-sm" />} title="Confirmed" value={stats.confirmed} color="bg-gradient-to-br from-blue-600 to-blue-400" delay={100} isActive={activeFilter === 'confirmed'} statsAnimating={statsAnimating} onClick={() => handleStatClick('confirmed')} />
              <StatCard icon={<FiFlag className="text-white text-sm" />} title="Completed" value={stats.completed} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={150} isActive={activeFilter === 'completed'} statsAnimating={statsAnimating} onClick={() => handleStatClick('completed')} />
              <StatCard icon={<FiSlash className="text-white text-sm" />} title="Cancelled / No Show" value={stats.cancelled} color="bg-gradient-to-br from-red-600 to-red-400" delay={200} isActive={activeFilter === 'cancelled'} statsAnimating={statsAnimating} onClick={() => handleStatClick('cancelled')} />
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
              placeholder="Search by buyer, property, owner, or agent..."
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
                <option value="requested">Requested</option>
                <option value="pending_confirmation">Pending Confirmation</option>
                <option value="confirmed">Confirmed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
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

      {/* Visits Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedVisits.map((visit, index) => (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-2 gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-lg shrink-0">
                      {visit.buyerName ? visit.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{visit.buyerName}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap border ${STATUS_BADGE[visit.visitStatus]}`}>
                        {STATUS_LABEL[visit.visitStatus]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiHome className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{visit.propertyName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FaUserTie className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{visit.ownerName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiCalendar className="text-[#00695C] flex-shrink-0" />
                    <span>{visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'} · {visit.visitTime || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{visit.assignedAgent || 'Unassigned'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                  <button
                    type="button"
                    onClick={() => openView(visit)}
                    className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiEye className="text-[10px]" /> View
                  </button>
                  <button
                    type="button"
                    onClick={() => openPanel(visit)}
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiPlusCircle className="text-[10px]" /> Actions
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVisit(visit);
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
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-2">Buyer</div>
              <div className="col-span-2">Property</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date / Time</div>
              <div className="col-span-2">Agent</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedVisits.map((visit, index) => (
              <div key={visit.id} className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group" style={{ animationDelay: `${index * 30}ms` }}>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {visit.buyerName ? visit.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                  </div>
                  <p className="font-semibold text-sm text-[#1A2E2A] truncate">{visit.buyerName || 'N/A'}</p>
                </div>
                <div className="col-span-2 text-xs text-[#5A7D78] truncate">{visit.propertyName || 'N/A'}</div>
                <div className="col-span-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${STATUS_BADGE[visit.visitStatus]}`}>
                    {STATUS_LABEL[visit.visitStatus]}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-[#5A7D78]">
                  {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'} · {visit.visitTime || 'N/A'}
                </div>
                <div className="col-span-2 text-xs text-[#5A7D78] truncate">{visit.assignedAgent || 'Unassigned'}</div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openView(visit)}
                    className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                    title="View"
                  >
                    <FiEye className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openPanel(visit)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-lg hover:shadow-md transition-all duration-300 flex items-center gap-1 hover:scale-105"
                  >
                    <FiPlusCircle className="text-xs" /> Actions
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVisit(visit);
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

        {paginatedVisits.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiActivity className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No site visits found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No site visits have been scheduled yet'}
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredVisits.length)} of {filteredVisits.length} visits
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

export default SiteVisitActions;