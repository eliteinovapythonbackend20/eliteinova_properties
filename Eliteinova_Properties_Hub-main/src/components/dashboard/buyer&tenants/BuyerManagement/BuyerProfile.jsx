// src/components/dashboard/admin/buyer&tenants/BuyerManagement/BuyerProfile.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX,
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiEye, FiEdit, FiTrash2, FiLock, FiUnlock, FiCheckCircle,
  FiXCircle, FiClock, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiShield, FiActivity, FiRefreshCw, FiMoreVertical, FiDownload,
  FiInfo, FiAlertTriangle, FiExternalLink, FiGrid, FiList, FiX,
  FiBriefcase, FiHome, FiDollarSign, FiTag, FiMessageSquare,
  FiGlobe, FiClock as FiClockOutline
} from 'react-icons/fi';
import { FaCheck, FaIdCard, FaFileAlt, FaCertificate, FaShieldAlt } from 'react-icons/fa';

/* ============================================================
   STANDALONE COMPONENTS
============================================================ */

const Toast = ({ toast }) => {
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

const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => (
  <div
    className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-medium text-[#5A7D78] uppercase tracking-wider">{title}</p>
        <p className={`text-xl font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

// ============ BLOCK/UNBLOCK CONFIRM MODAL ============
const BlockConfirmModal = ({ show, buyerName, isBlocking, onCancel, onConfirm, actionLoading }) => {
  if (!show) return null;
  const Icon = isBlocking ? FiLock : FiUnlock;
  const color = isBlocking ? 'red' : 'emerald';
  const title = isBlocking ? 'Block Buyer' : 'Unblock Buyer';
  const message = isBlocking
    ? `Are you sure you want to block ${buyerName}? They will lose access to the platform.`
    : `Are you sure you want to unblock ${buyerName}? They will regain access to the platform.`;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-${color}-50 flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`text-3xl text-${color}-600`} />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">{title}</h3>
          <p className="text-sm text-[#5A7D78] mt-2">{message}</p>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={actionLoading}
              className={`flex-1 px-4 py-2.5 bg-${color}-600 text-white rounded-xl hover:bg-${color}-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-${color}-600/30 disabled:opacity-50`}
            >
              {actionLoading ? <FiRefreshCw className="animate-spin mx-auto" /> : isBlocking ? 'Block' : 'Unblock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ DELETE CONFIRM MODAL ============
const DeleteConfirmModal = ({ show, buyerName, onCancel, onConfirm, actionLoading }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="text-3xl text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">Delete Buyer Profile</h3>
          <p className="text-sm text-[#5A7D78] mt-2">
            Are you sure you want to delete <span className="font-semibold text-[#1A2E2A]">{buyerName}</span>'s profile? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={actionLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              {actionLoading ? <FiRefreshCw className="animate-spin mx-auto" /> : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SEPARATE VIEW PROFILE MODAL (READ-ONLY)
// ============================================================
const ViewProfileModal = ({ buyer, show, onClose, onEdit, onDelete, onBlock, onViewFullProfile, actionLoading }) => {
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => { setActiveTab('personal'); }, [buyer?.id]);

  if (!buyer || !show) return null;

  const isBlocked = buyer.status === 'blocked';

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'contact', label: 'Contact' },
    { id: 'requirement', label: 'Requirement' },
    { id: 'employment', label: 'Employment' },
    { id: 'preferences', label: 'Preferences' },
  ];

  const Row = ({ icon, label, value, verified }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--bpm-border)' }}>
      <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--bpm-muted)' }}>
        <span style={{ color: 'var(--bpm-accent)' }}>{icon}</span>{label}
      </span>
      <span className="text-sm font-medium text-right flex items-center gap-1.5">
        {value || 'N/A'}
        {verified !== undefined && (
          verified
            ? <FiCheckCircle style={{ color: 'var(--bpm-success)' }} className="text-xs" />
            : <FiXCircle style={{ color: 'var(--bpm-muted)' }} className="text-xs" />
        )}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="buyer-profile-modal w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[28px] shadow-2xl animate-slide-up flex flex-col"
        style={{ background: 'var(--bpm-bg)', color: 'var(--bpm-text)', border: '1px solid var(--bpm-border)' }}
      >
        {/* Hero */}
        <div className="relative px-6 pt-6 pb-14 shrink-0" style={{ background: 'linear-gradient(135deg, var(--bpm-accent), var(--bpm-accent-2))' }}>
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Buyer Profile</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white">
              <FiX className="text-base" />
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{buyer.personal.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{buyer.location.city}, {buyer.location.state}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              buyer.status === 'active' ? 'bg-white text-emerald-700' :
              buyer.status === 'blocked' ? 'bg-white/20 text-white' : 'bg-white text-amber-700'
            }`}>
              {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
            </span>
            {buyer.kycStatus === 'verified' && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
                <FaCheck className="text-[10px]" /> KYC Verified
              </span>
            )}
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white">
              {buyer.requirement}
            </span>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-2xl"
              style={{ inset: '4px', background: 'var(--bpm-surface)', color: 'var(--bpm-accent)', border: '3px solid var(--bpm-bg)' }}
            >
              {buyer.avatar}
            </div>
          </div>
        </div>

        {/* View Full Profile Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewFullProfile && onViewFullProfile(buyer)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'var(--bpm-accent)', color: 'var(--bpm-on-accent)', boxShadow: '0 4px 12px rgba(15, 107, 92, 0.3)' }}
          >
            <FiExternalLink className="text-sm" /> View Full Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 px-6 mt-4 shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap px-2"
              style={{
                background: activeTab === tab.id ? 'var(--bpm-accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--bpm-on-accent)' : 'var(--bpm-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'personal' && (
            <div className="space-y-1">
              <Row icon={<FiUser />} label="Full Name" value={buyer.personal.name} />
              <Row icon={<FiCalendar />} label="Date of Birth" value={buyer.personal.dob} />
              <Row icon={<FiUsers />} label="Gender" value={buyer.personal.gender} />
              <Row icon={<FiUser />} label="Marital Status" value={buyer.personal.maritalStatus} />
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--bpm-muted)' }}>Location</p>
                <Row icon={<FiMapPin />} label="City" value={buyer.location.city} />
                <Row icon={<FiMapPin />} label="State" value={buyer.location.state} />
                <Row icon={<FiHome />} label="Address" value={buyer.location.address} />
                <Row icon={<FiTag />} label="Pincode" value={buyer.location.pincode} />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              <Row icon={<FiMail />} label="Email" value={buyer.contact.email} verified={buyer.contact.verification.email} />
              <Row icon={<FiPhone />} label="Phone" value={buyer.contact.phone} verified={buyer.contact.verification.phone} />
              <Row icon={<FiPhone />} label="Alternate Phone" value={buyer.contact.altPhone} />
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--bpm-muted)' }}>KYC Documents</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: 'aadhaar', label: 'Aadhaar' },
                    { key: 'pan', label: 'PAN' },
                    { key: 'gst', label: 'GST' },
                    { key: 'rera', label: 'RERA' },
                  ].map(item => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                      style={{
                        background: buyer.kyc?.[item.key] ? 'var(--bpm-success-bg)' : 'var(--bpm-surface)',
                        border: `1px solid ${buyer.kyc?.[item.key] ? 'var(--bpm-success-border)' : 'var(--bpm-border)'}`
                      }}
                    >
                      {buyer.kyc?.[item.key]
                        ? <FiCheckCircle style={{ color: 'var(--bpm-success)' }} />
                        : <FiXCircle style={{ color: 'var(--bpm-muted)' }} />}
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirement' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-3 text-center" style={{ background: 'var(--bpm-surface)', border: '1px solid var(--bpm-border)' }}>
                  <p className="text-xs font-bold truncate">{buyer.requirement}</p>
                  <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--bpm-muted)' }}>Requirement</p>
                </div>
                <div className="rounded-2xl p-3 text-center" style={{ background: 'var(--bpm-surface)', border: '1px solid var(--bpm-border)' }}>
                  <p className="text-xs font-bold truncate">{buyer.budget.label}</p>
                  <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--bpm-muted)' }}>Budget</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--bpm-muted)' }}>Preferred Property Type</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.preferredPropertyType.map(type => (
                    <span key={type} className="text-[11px] px-3 py-1.5 rounded-full font-medium" style={{ background: 'var(--bpm-success-bg)', color: 'var(--bpm-success)' }}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--bpm-muted)' }}>Preferred Locations</p>
                <div className="flex flex-wrap gap-2">
                  {buyer.preferredLocation.map(loc => (
                    <span key={loc} className="text-[11px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1" style={{ background: 'var(--bpm-surface)', border: '1px solid var(--bpm-border)' }}>
                      <FiMapPin className="text-[10px]" style={{ color: 'var(--bpm-accent)' }} /> {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="space-y-1">
              <Row icon={<FiBriefcase />} label="Occupation" value={buyer.employment.occupation} />
              <Row icon={<FiBriefcase />} label="Employment Type" value={buyer.employment.employmentType} />
              <Row icon={<FiHome />} label="Company" value={buyer.employment.companyName} />
              <Row icon={<FiUser />} label="Designation" value={buyer.employment.designation} />
              <Row icon={<FiDollarSign />} label="Annual Income" value={buyer.employment.annualIncome} />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-1">
              <Row icon={<FiMessageSquare />} label="Preferred Channel" value={buyer.communicationPreferences.preferredChannel} />
              <Row icon={<FiClockOutline />} label="Preferred Time" value={buyer.communicationPreferences.preferredTime} />
              <Row icon={<FiGlobe />} label="Language" value={buyer.communicationPreferences.language} />
              <Row icon={buyer.communicationPreferences.newsletter ? <FiCheckCircle /> : <FiXCircle />} label="Newsletter Opt-in" value={buyer.communicationPreferences.newsletter ? 'Subscribed' : 'Not Subscribed'} />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t flex items-center gap-2 shrink-0" style={{ borderColor: 'var(--bpm-border)', background: 'var(--bpm-surface)' }}>
          <button
            onClick={() => onEdit(buyer)}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            style={{ background: 'var(--bpm-accent)', color: 'var(--bpm-on-accent)' }}
          >
            <FiEdit className="text-xs" /> Edit
          </button>
          <button
            onClick={() => onDelete(buyer.id)}
            disabled={actionLoading === `delete_${buyer.id}`}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{ background: 'var(--bpm-danger-bg)', color: 'var(--bpm-danger)' }}
          >
            {actionLoading === `delete_${buyer.id}` ? <FiRefreshCw className="animate-spin text-xs" /> : <FiTrash2 className="text-xs" />}
            Delete
          </button>
          <button
            onClick={() => onBlock(buyer.id)}
            disabled={actionLoading === `block_${buyer.id}`}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{
              background: isBlocked ? 'var(--bpm-success-bg)' : 'var(--bpm-danger-bg)',
              color: isBlocked ? 'var(--bpm-success)' : 'var(--bpm-danger)'
            }}
          >
            {actionLoading === `block_${buyer.id}` ? <FiRefreshCw className="animate-spin text-xs" /> : isBlocked ? <FiUnlock className="text-xs" /> : <FiLock className="text-xs" />}
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </div>

      <style>{`
        .buyer-profile-modal {
          --bpm-bg: #FFFFFF;
          --bpm-surface: #F5F9F8;
          --bpm-border: #E5EEEB;
          --bpm-text: #12211D;
          --bpm-text-soft: #3E5C56;
          --bpm-muted: #6B8983;
          --bpm-accent: #0F6B5C;
          --bpm-accent-2: #2FAE9A;
          --bpm-on-accent: #FFFFFF;
          --bpm-success: #167A54;
          --bpm-success-bg: #E7F6EF;
          --bpm-success-border: #BEE4D2;
          --bpm-danger: #C0392B;
          --bpm-danger-bg: #FCEBE9;
          --bpm-warning-text: #92620C;
          --bpm-warning-bg: #FDF3DE;
          --bpm-warning-border: #F2DBA3;
        }
      `}</style>
    </div>
  );
};

// ============================================================
// CONSTANTS
// ============================================================
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial', 'Farmhouse'];
const CHANNELS = ['Email', 'Phone Call', 'WhatsApp', 'SMS'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];

const FORM_INPUT_CLASS = "w-full px-4 py-2.5 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]";
const FORM_LABEL_CLASS = "text-[11px] font-semibold text-[#5A7D78] uppercase tracking-wide flex items-center gap-1.5 mb-1.5";

// ============================================================
// SHARED FORM SECTION WRAPPER
// NOTE: This MUST live outside AddProfileModal / EditProfileModal.
// Defining it inside those components meant a brand-new SectionBox
// function was created on every keystroke (because typing triggers
// a re-render via setFormData). React then treated it as a totally
// different component type each time and unmounted/remounted every
// input, select, and date field inside it - which is why nothing
// could hold focus long enough to type, pick a dropdown option, or
// choose a date. Hoisting it here fixes that.
// ============================================================
const SectionBox = ({ icon, title, children, cols = 2 }) => (
  <div className="bg-[#F3F9F7] rounded-2xl p-5 border border-[#DCEEE8]">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-full bg-[#00695C] flex items-center justify-center text-white shadow-sm shrink-0">
        {icon}
      </div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#00695C]">{title}</h3>
    </div>
    <div className={`grid grid-cols-1 ${cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-3' : ''} gap-4`}>
      {children}
    </div>
  </div>
);

// ============================================================
// SHARED FORM BODY (used by both Add and Edit modals)
// Also hoisted outside for the same reason as SectionBox above.
// ============================================================
const BuyerFormFields = ({ formData, setFormData, setField, locationInput, setLocationInput, togglePropertyType, addPreferredLocation, removePreferredLocation, toggleKyc }) => (
  <>
    {/* Personal Details */}
    <SectionBox icon={<FiUser className="text-sm" />} title="Personal Details">
      <div>
        <label className={FORM_LABEL_CLASS}><FiUser className="text-[11px]" /> Full Name *</label>
        <input className={FORM_INPUT_CLASS} value={formData.personal.name} onChange={e => setField('personal', 'name', e.target.value)} required />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiPhone className="text-[11px]" /> Mobile Number *</label>
        <input className={FORM_INPUT_CLASS} value={formData.contact.phone} onChange={e => setField('contact', 'phone', e.target.value)} required />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiMail className="text-[11px]" /> Email Address *</label>
        <input type="email" className={FORM_INPUT_CLASS} value={formData.contact.email} onChange={e => setField('contact', 'email', e.target.value)} required />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiCalendar className="text-[11px]" /> Date of Birth</label>
        <input type="date" className={FORM_INPUT_CLASS} value={formData.personal.dob} onChange={e => setField('personal', 'dob', e.target.value)} />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiUsers className="text-[11px]" /> Gender</label>
        <select className={FORM_INPUT_CLASS} value={formData.personal.gender} onChange={e => setField('personal', 'gender', e.target.value)}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiUser className="text-[11px]" /> Marital Status</label>
        <select className={FORM_INPUT_CLASS} value={formData.personal.maritalStatus} onChange={e => setField('personal', 'maritalStatus', e.target.value)}>
          <option value="">Select</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>
      </div>
    </SectionBox>

    {/* Contact Details */}
    <SectionBox icon={<FiPhone className="text-sm" />} title="Contact Details">
      <div>
        <label className={FORM_LABEL_CLASS}><FiPhone className="text-[11px]" /> Alternate Phone</label>
        <input className={FORM_INPUT_CLASS} value={formData.contact.altPhone} onChange={e => setField('contact', 'altPhone', e.target.value)} />
      </div>
      <div className="flex items-end gap-2">
        {['email', 'phone'].map(key => {
          const verified = formData.contact.verification[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                contact: {
                  ...prev.contact,
                  verification: { ...prev.contact.verification, [key]: !verified }
                }
              }))}
              className={`flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
                verified ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]' : 'bg-white border-[#E8F0EE] text-[#5A7D78]'
              }`}
            >
              <span className="capitalize">{key} Verified</span>
              {verified ? <FiCheckCircle className="text-sm shrink-0" /> : <FiXCircle className="text-sm shrink-0" />}
            </button>
          );
        })}
      </div>
    </SectionBox>

    {/* Location */}
    <SectionBox icon={<FiMapPin className="text-sm" />} title="Location">
      <div>
        <label className={FORM_LABEL_CLASS}><FiMapPin className="text-[11px]" /> City</label>
        <input className={FORM_INPUT_CLASS} value={formData.location.city} onChange={e => setField('location', 'city', e.target.value)} />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiMapPin className="text-[11px]" /> State</label>
        <input className={FORM_INPUT_CLASS} value={formData.location.state} onChange={e => setField('location', 'state', e.target.value)} />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiHome className="text-[11px]" /> Address</label>
        <input className={FORM_INPUT_CLASS} value={formData.location.address} onChange={e => setField('location', 'address', e.target.value)} />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiTag className="text-[11px]" /> Pincode</label>
        <input className={FORM_INPUT_CLASS} value={formData.location.pincode} onChange={e => setField('location', 'pincode', e.target.value)} />
      </div>
    </SectionBox>

    {/* Budget */}
    <SectionBox icon={<FiDollarSign className="text-sm" />} title="Budget &amp; Requirement" cols={3}>
      <div>
        <label className={FORM_LABEL_CLASS}><FiDollarSign className="text-[11px]" /> Min Budget (₹)</label>
        <input className={FORM_INPUT_CLASS} value={formData.budget.min} onChange={e => setField('budget', 'min', e.target.value)} placeholder="e.g. 50L" />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiDollarSign className="text-[11px]" /> Max Budget (₹)</label>
        <input className={FORM_INPUT_CLASS} value={formData.budget.max} onChange={e => setField('budget', 'max', e.target.value)} placeholder="e.g. 1Cr" />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiHome className="text-[11px]" /> Purchase / Rent</label>
        <select className={FORM_INPUT_CLASS} value={formData.requirement} onChange={e => setFormData(prev => ({ ...prev, requirement: e.target.value }))}>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
          <option value="Both">Both</option>
        </select>
      </div>
    </SectionBox>

    {/* Preferred Property Type */}
    <SectionBox icon={<FiHome className="text-sm" />} title="Preferred Property Type" cols={3}>
      {PROPERTY_TYPES.map(type => {
        const active = (formData.preferredPropertyType || []).includes(type);
        return (
          <button
            key={type}
            type="button"
            onClick={() => togglePropertyType(type)}
            className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
              active ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]' : 'bg-white border-[#E8F0EE] text-[#5A7D78]'
            }`}
          >
            {type}
            {active ? <FiCheckCircle className="text-sm shrink-0" /> : <FiXCircle className="text-sm shrink-0" />}
          </button>
        );
      })}
    </SectionBox>

    {/* Preferred Location */}
    <SectionBox icon={<FiTag className="text-sm" />} title="Preferred Location" cols={1}>
      <div>
        <div className="flex items-center gap-2">
          <input
            className={FORM_INPUT_CLASS}
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPreferredLocation(); } }}
            placeholder="Type a locality and press Add"
          />
          <button type="button" onClick={addPreferredLocation} className="px-4 py-2.5 bg-[#00695C] text-white rounded-xl text-xs font-semibold shrink-0 hover:bg-[#004D40] transition-all duration-300">
            Add
          </button>
        </div>
        {(formData.preferredLocation || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(formData.preferredLocation || []).map(loc => (
              <span key={loc} className="text-[11px] px-3 py-1.5 rounded-full font-medium bg-white border border-[#E8F0EE] flex items-center gap-1.5 text-[#1A2E2A]">
                {loc}
                <button type="button" onClick={() => removePreferredLocation(loc)} className="text-[#5A7D78] hover:text-red-600">
                  <FiX className="text-[10px]" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </SectionBox>

    {/* Employment Details */}
    <SectionBox icon={<FiBriefcase className="text-sm" />} title="Employment Details">
      <div>
        <label className={FORM_LABEL_CLASS}><FiBriefcase className="text-[11px]" /> Occupation</label>
        <input className={FORM_INPUT_CLASS} value={formData.employment.occupation} onChange={e => setField('employment', 'occupation', e.target.value)} />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiBriefcase className="text-[11px]" /> Employment Type</label>
        <select className={FORM_INPUT_CLASS} value={formData.employment.employmentType} onChange={e => setField('employment', 'employmentType', e.target.value)}>
          <option value="Salaried">Salaried</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Business Owner">Business Owner</option>
          <option value="Retired">Retired</option>
        </select>
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiHome className="text-[11px]" /> Company Name</label>
        <input className={FORM_INPUT_CLASS} value={formData.employment.companyName} onChange={e => setField('employment', 'companyName', e.target.value)} />
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiUser className="text-[11px]" /> Designation</label>
        <input className={FORM_INPUT_CLASS} value={formData.employment.designation} onChange={e => setField('employment', 'designation', e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className={FORM_LABEL_CLASS}><FiDollarSign className="text-[11px]" /> Annual Income (₹)</label>
        <input className={FORM_INPUT_CLASS} value={formData.employment.annualIncome} onChange={e => setField('employment', 'annualIncome', e.target.value)} placeholder="e.g. 12,00,000" />
      </div>
    </SectionBox>

    {/* Communication Preferences */}
    <SectionBox icon={<FiMessageSquare className="text-sm" />} title="Communication Preferences">
      <div>
        <label className={FORM_LABEL_CLASS}><FiMessageSquare className="text-[11px]" /> Preferred Channel</label>
        <select className={FORM_INPUT_CLASS} value={formData.communicationPreferences.preferredChannel} onChange={e => setField('communicationPreferences', 'preferredChannel', e.target.value)}>
          {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiClockOutline className="text-[11px]" /> Preferred Time</label>
        <select className={FORM_INPUT_CLASS} value={formData.communicationPreferences.preferredTime} onChange={e => setField('communicationPreferences', 'preferredTime', e.target.value)}>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiGlobe className="text-[11px]" /> Language</label>
        <select className={FORM_INPUT_CLASS} value={formData.communicationPreferences.language} onChange={e => setField('communicationPreferences', 'language', e.target.value)}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="button"
          onClick={() => setFormData(prev => ({
            ...prev,
            communicationPreferences: {
              ...prev.communicationPreferences,
              newsletter: !prev.communicationPreferences.newsletter
            }
          }))}
          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
            formData.communicationPreferences.newsletter ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]' : 'bg-white border-[#E8F0EE] text-[#5A7D78]'
          }`}
        >
          Newsletter Opt-in
          {formData.communicationPreferences.newsletter ? <FiCheckCircle className="text-sm shrink-0" /> : <FiXCircle className="text-sm shrink-0" />}
        </button>
      </div>
    </SectionBox>

    {/* Status & KYC */}
    <SectionBox icon={<FiShield className="text-sm" />} title="Status &amp; KYC">
      <div>
        <label className={FORM_LABEL_CLASS}><FiActivity className="text-[11px]" /> Status</label>
        <select className={FORM_INPUT_CLASS} value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <div>
        <label className={FORM_LABEL_CLASS}><FiShield className="text-[11px]" /> KYC Status</label>
        <select className={FORM_INPUT_CLASS} value={formData.kycStatus} onChange={e => setFormData(prev => ({ ...prev, kycStatus: e.target.value }))}>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { key: 'aadhaar', label: 'Aadhaar', icon: <FaIdCard className="text-sm" /> },
          { key: 'pan', label: 'PAN', icon: <FaFileAlt className="text-sm" /> },
          { key: 'gst', label: 'GST', icon: <FaCertificate className="text-sm" /> },
          { key: 'rera', label: 'RERA', icon: <FaShieldAlt className="text-sm" /> },
        ].map(item => {
          const verified = formData.kyc[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleKyc(item.key)}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
                verified ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]' : 'bg-white border-[#E8F0EE] text-[#5A7D78]'
              }`}
            >
              <span className="flex items-center gap-1.5">{item.icon}{item.label}</span>
              {verified ? <FiCheckCircle className="text-sm shrink-0" /> : <FiXCircle className="text-sm shrink-0" />}
            </button>
          );
        })}
      </div>
    </SectionBox>
  </>
);

// ============================================================
// SEPARATE ADD PROFILE MODAL
// ============================================================
const AddProfileModal = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    if (!show) {
      setFormData(null);
      return;
    }
    // Initialize empty form for add
    setFormData({
      personal: { name: '', dob: '', gender: '', maritalStatus: '' },
      contact: { email: '', phone: '', altPhone: '', verification: { email: false, phone: false } },
      location: { city: '', state: '', address: '', pincode: '' },
      budget: { min: '', max: '', label: '' },
      preferredPropertyType: [],
      preferredLocation: [],
      requirement: 'Buy',
      employment: { occupation: '', employmentType: 'Salaried', companyName: '', designation: '', annualIncome: '' },
      communicationPreferences: { preferredChannel: 'Email', preferredTime: 'Morning', language: 'English', newsletter: false },
      status: 'pending',
      kycStatus: 'pending',
      kyc: { aadhaar: false, pan: false, gst: false, rera: false },
    });
    setLocationInput('');
  }, [show]);

  if (!show || !formData) return null;

  const setField = (group, key, value) => {
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: value }
    }));
  };

  const togglePropertyType = (type) => {
    setFormData(prev => {
      const current = prev.preferredPropertyType || [];
      const index = current.indexOf(type);
      let newTypes;
      if (index > -1) {
        newTypes = [...current.slice(0, index), ...current.slice(index + 1)];
      } else {
        newTypes = [...current, type];
      }
      return { ...prev, preferredPropertyType: newTypes };
    });
  };

  const addPreferredLocation = () => {
    const value = locationInput.trim();
    if (!value) return;
    setFormData(prev => {
      const current = prev.preferredLocation || [];
      if (current.includes(value)) return prev;
      return { ...prev, preferredLocation: [...current, value] };
    });
    setLocationInput('');
  };

  const removePreferredLocation = (loc) => {
    setFormData(prev => ({
      ...prev,
      preferredLocation: (prev.preferredLocation || []).filter(l => l !== loc)
    }));
  };

  const toggleKyc = (key) => {
    setFormData(prev => {
      const newKyc = { ...prev.kyc, [key]: !prev.kyc[key] };
      const allVerified = Object.values(newKyc).every(Boolean);
      let newKycStatus = prev.kycStatus;
      if (allVerified) newKycStatus = 'verified';
      else if (prev.kycStatus === 'verified') newKycStatus = 'pending';
      return { ...prev, kyc: newKyc, kycStatus: newKycStatus };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const dataToSave = {
      ...formData,
      budget: {
        ...formData.budget,
        label: formData.budget.min && formData.budget.max
          ? `₹${formData.budget.min} - ₹${formData.budget.max}`
          : formData.budget.label || 'N/A'
      }
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiUserPlus className="text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Add Buyer Profile</h2>
              <p className="text-white/80 text-sm">Register a new buyer profile</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="add-buyer-form" onSubmit={handleSubmit} className="space-y-5">
            <BuyerFormFields
              formData={formData}
              setFormData={setFormData}
              setField={setField}
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              togglePropertyType={togglePropertyType}
              addPreferredLocation={addPreferredLocation}
              removePreferredLocation={removePreferredLocation}
              toggleKyc={toggleKyc}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" form="add-buyer-form" className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] flex items-center justify-center gap-2">
              <FiUserPlus className="text-sm" /> Add Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SEPARATE EDIT PROFILE MODAL
// ============================================================
const EditProfileModal = ({ buyer, show, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    if (!show || !buyer) {
      setFormData(null);
      return;
    }
    // Initialize form with buyer data for edit
    setFormData({
      personal: {
        name: buyer.personal?.name || '',
        dob: buyer.personal?.dob || '',
        gender: buyer.personal?.gender || '',
        maritalStatus: buyer.personal?.maritalStatus || ''
      },
      contact: {
        email: buyer.contact?.email || '',
        phone: buyer.contact?.phone || '',
        altPhone: buyer.contact?.altPhone || '',
        verification: {
          email: buyer.contact?.verification?.email || false,
          phone: buyer.contact?.verification?.phone || false
        }
      },
      location: {
        city: buyer.location?.city || '',
        state: buyer.location?.state || '',
        address: buyer.location?.address || '',
        pincode: buyer.location?.pincode || ''
      },
      budget: {
        min: buyer.budget?.min || '',
        max: buyer.budget?.max || '',
        label: buyer.budget?.label || ''
      },
      preferredPropertyType: Array.isArray(buyer.preferredPropertyType) ? [...buyer.preferredPropertyType] : [],
      preferredLocation: Array.isArray(buyer.preferredLocation) ? [...buyer.preferredLocation] : [],
      requirement: buyer.requirement || 'Buy',
      employment: {
        occupation: buyer.employment?.occupation || '',
        employmentType: buyer.employment?.employmentType || 'Salaried',
        companyName: buyer.employment?.companyName || '',
        designation: buyer.employment?.designation || '',
        annualIncome: buyer.employment?.annualIncome || ''
      },
      communicationPreferences: {
        preferredChannel: buyer.communicationPreferences?.preferredChannel || 'Email',
        preferredTime: buyer.communicationPreferences?.preferredTime || 'Morning',
        language: buyer.communicationPreferences?.language || 'English',
        newsletter: buyer.communicationPreferences?.newsletter || false
      },
      status: buyer.status || 'pending',
      kycStatus: buyer.kycStatus || 'pending',
      kyc: {
        aadhaar: buyer.kyc?.aadhaar || false,
        pan: buyer.kyc?.pan || false,
        gst: buyer.kyc?.gst || false,
        rera: buyer.kyc?.rera || false
      }
    });
    setLocationInput('');
  }, [buyer, show]);

  if (!show || !formData || !buyer) return null;

  const setField = (group, key, value) => {
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: value }
    }));
  };

  const togglePropertyType = (type) => {
    setFormData(prev => {
      const current = prev.preferredPropertyType || [];
      const index = current.indexOf(type);
      let newTypes;
      if (index > -1) {
        newTypes = [...current.slice(0, index), ...current.slice(index + 1)];
      } else {
        newTypes = [...current, type];
      }
      return { ...prev, preferredPropertyType: newTypes };
    });
  };

  const addPreferredLocation = () => {
    const value = locationInput.trim();
    if (!value) return;
    setFormData(prev => {
      const current = prev.preferredLocation || [];
      if (current.includes(value)) return prev;
      return { ...prev, preferredLocation: [...current, value] };
    });
    setLocationInput('');
  };

  const removePreferredLocation = (loc) => {
    setFormData(prev => ({
      ...prev,
      preferredLocation: (prev.preferredLocation || []).filter(l => l !== loc)
    }));
  };

  const toggleKyc = (key) => {
    setFormData(prev => {
      const newKyc = { ...prev.kyc, [key]: !prev.kyc[key] };
      const allVerified = Object.values(newKyc).every(Boolean);
      let newKycStatus = prev.kycStatus;
      if (allVerified) newKycStatus = 'verified';
      else if (prev.kycStatus === 'verified') newKycStatus = 'pending';
      return { ...prev, kyc: newKyc, kycStatus: newKycStatus };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    const dataToSave = {
      ...formData,
      budget: {
        ...formData.budget,
        label: formData.budget.min && formData.budget.max
          ? `₹${formData.budget.min} - ₹${formData.budget.max}`
          : formData.budget.label || 'N/A'
      }
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiEdit className="text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Buyer Profile</h2>
              <p className="text-white/80 text-sm">Update buyer profile details</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="edit-buyer-form" onSubmit={handleSubmit} className="space-y-5">
            <BuyerFormFields
              formData={formData}
              setFormData={setFormData}
              setField={setField}
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              togglePropertyType={togglePropertyType}
              addPreferredLocation={addPreferredLocation}
              removePreferredLocation={removePreferredLocation}
              toggleKyc={toggleKyc}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" form="edit-buyer-form" className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] flex items-center justify-center gap-2">
              <FiCheckCircle className="text-sm" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const BuyerProfile = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRequirement, setSelectedRequirement] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingBuyer, setViewingBuyer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(null);
  const [isBlockingAction, setIsBlockingAction] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, blocked: 0, buy: 0, rent: 0, both: 0 });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ MOCK DATA ============
  const generateMockBuyers = useCallback(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Rao', 'Shetty', 'Agarwal', 'Desai'];
    const cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Coimbatore', 'Madurai'];
    const stateByCity = { Chennai: 'Tamil Nadu', Coimbatore: 'Tamil Nadu', Madurai: 'Tamil Nadu', Mumbai: 'Maharashtra', Pune: 'Maharashtra', Delhi: 'Delhi', Bangalore: 'Karnataka', Hyderabad: 'Telangana' };
    const statuses = ['pending', 'active', 'blocked'];
    const kycStatuses = ['pending', 'verified', 'rejected'];
    const requirements = ['Buy', 'Rent', 'Both'];
    const occupations = ['Software Engineer', 'Doctor', 'Business Owner', 'Bank Manager', 'Architect', 'Government Employee', 'Consultant'];
    const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Retired'];
    const budgetPairs = [['20L', '50L'], ['50L', '1Cr'], ['1Cr', '2Cr'], ['2Cr', '5Cr']];
    const localities = ['Anna Nagar', 'T Nagar', 'Velachery', 'Adyar', 'Whitefield', 'Koramangala', 'Bandra', 'Andheri', 'Gachibowli', 'Banjara Hills'];

    const buyers = [];
    const usedNames = new Set();

    for (let i = 1; i <= 60; i++) {
      let firstName, lastName, fullName;
      let attempts = 0;
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fullName = `${firstName} ${lastName}`;
        attempts++;
      } while (usedNames.has(fullName) && attempts < 50);
      usedNames.add(fullName);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const requirement = requirements[Math.floor(Math.random() * requirements.length)];
      const budgetPair = budgetPairs[Math.floor(Math.random() * budgetPairs.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      const dob = new Date(1975 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

      const propertyTypeCount = 1 + Math.floor(Math.random() * 3);
      const shuffledTypes = [...PROPERTY_TYPES].sort(() => Math.random() - 0.5).slice(0, propertyTypeCount);
      const localityCount = 1 + Math.floor(Math.random() * 2);
      const shuffledLocalities = [...localities].sort(() => Math.random() - 0.5).slice(0, localityCount);

      buyers.push({
        id: `buyer_${i}`,
        avatar: firstName[0] + lastName[0],
        status,
        kycStatus,
        kyc: {
          aadhaar: Math.random() > 0.3,
          pan: Math.random() > 0.35,
          gst: Math.random() > 0.7,
          rera: Math.random() > 0.6,
        },
        registrationDate: date.toISOString(),
        requirement,
        personal: {
          name: fullName,
          dob: dob.toISOString().split('T')[0],
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          maritalStatus: Math.random() > 0.5 ? 'Married' : 'Single',
        },
        contact: {
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          altPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          verification: { email: Math.random() > 0.25, phone: Math.random() > 0.3 },
        },
        location: {
          city,
          state: stateByCity[city],
          address: `${Math.floor(Math.random() * 200) + 1}, ${shuffledLocalities[0]} Main Road`,
          pincode: `${600000 + Math.floor(Math.random() * 99999)}`,
        },
        budget: { min: budgetPair[0], max: budgetPair[1], label: `₹${budgetPair[0]} - ₹${budgetPair[1]}` },
        preferredPropertyType: shuffledTypes,
        preferredLocation: shuffledLocalities,
        employment: {
          occupation: occupations[Math.floor(Math.random() * occupations.length)],
          employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
          companyName: `${lastName} ${['Technologies', 'Enterprises', 'Solutions', 'Industries'][Math.floor(Math.random() * 4)]}`,
          designation: ['Manager', 'Senior Executive', 'Director', 'Team Lead', 'Consultant'][Math.floor(Math.random() * 5)],
          annualIncome: `${(Math.floor(Math.random() * 30) + 5)},00,000`,
        },
        communicationPreferences: {
          preferredChannel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
          preferredTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
          language: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],
          newsletter: Math.random() > 0.5,
        },
        savedProperties: Math.floor(Math.random() * 15),
        viewedProperties: Math.floor(Math.random() * 30),
        inquiries: Math.floor(Math.random() * 10),
      });
    }

    const total = buyers.length;
    const active = buyers.filter(b => b.status === 'active').length;
    const pending = buyers.filter(b => b.status === 'pending').length;
    const blocked = buyers.filter(b => b.status === 'blocked').length;
    const buy = buyers.filter(b => b.requirement === 'Buy').length;
    const rent = buyers.filter(b => b.requirement === 'Rent').length;
    const both = buyers.filter(b => b.requirement === 'Both').length;

    setStats({ total, active, pending, blocked, buy, rent, both });
    return buyers;
  }, []);

  useEffect(() => {
    const mockBuyers = generateMockBuyers();
    setBuyers(mockBuyers);
    setFilteredBuyers(mockBuyers);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockBuyers]);

  // ============ FILTER ============
  const filterBuyers = useCallback(() => {
    let filtered = [...buyers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.personal.name.toLowerCase().includes(query) ||
        b.contact.email.toLowerCase().includes(query) ||
        b.contact.phone.includes(query) ||
        b.location.city.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') filtered = filtered.filter(b => b.status === selectedStatus);
    if (selectedRequirement !== 'all') filtered = filtered.filter(b => b.requirement === selectedRequirement);

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedRequirement !== 'all') count++;
    if (searchQuery) count++;
    setFilterCount(count);

    filtered.sort((a, b) => a.personal.name.localeCompare(b.personal.name));

    setFilteredBuyers(filtered);
    setCurrentPage(1);
  }, [buyers, searchQuery, selectedStatus, selectedRequirement]);

  useEffect(() => { filterBuyers(); }, [filterBuyers]);

  const totalPages = Math.ceil(filteredBuyers.length / pageSize);
  const paginatedBuyers = useMemo(() =>
    filteredBuyers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  , [filteredBuyers, currentPage, pageSize]);

  // ========== RECOMPUTE STATS HELPER ==========
  const recomputeStats = (list) => {
    const total = list.length;
    const active = list.filter(b => b.status === 'active').length;
    const pending = list.filter(b => b.status === 'pending').length;
    const blocked = list.filter(b => b.status === 'blocked').length;
    const buy = list.filter(b => b.requirement === 'Buy').length;
    const rent = list.filter(b => b.requirement === 'Rent').length;
    const both = list.filter(b => b.requirement === 'Both').length;
    setStats({ total, active, pending, blocked, buy, rent, both });
  };

  // ============ HANDLERS ============
  const handleBlockClick = useCallback((buyerId, isBlocking) => {
    setShowBlockConfirm(buyerId);
    setIsBlockingAction(isBlocking);
  }, []);

  const confirmBlock = useCallback(() => {
    const buyerId = showBlockConfirm;
    const isBlocking = isBlockingAction;
    setActionLoading(`block_${buyerId}`);
    setTimeout(() => {
      setBuyers(prev => {
        const updated = prev.map(b => b.id === buyerId ? { ...b, status: isBlocking ? 'blocked' : 'active' } : b);
        recomputeStats(updated);
        const changed = updated.find(b => b.id === buyerId);
        showToast(`${changed?.personal.name} has been ${isBlocking ? 'blocked' : 'unblocked'}`, isBlocking ? 'warning' : 'success');
        setViewingBuyer(prevView => (prevView && prevView.id === buyerId ? changed : prevView));
        return updated;
      });
      setShowBlockConfirm(null);
      setIsBlockingAction(false);
      setActionLoading(null);
    }, 600);
  }, [showBlockConfirm, isBlockingAction, showToast]);

  const handleDelete = useCallback((buyerId) => setShowDeleteConfirm(buyerId), []);

  const confirmDelete = useCallback(() => {
    const buyerId = showDeleteConfirm;
    setActionLoading(`delete_${buyerId}`);
    setTimeout(() => {
      setBuyers(prev => {
        const target = prev.find(b => b.id === buyerId);
        const updated = prev.filter(b => b.id !== buyerId);
        recomputeStats(updated);
        showToast(`${target?.personal.name || 'Buyer'} profile has been deleted`, 'error');
        return updated;
      });
      setShowDeleteConfirm(null);
      setActionLoading(null);
    }, 600);
  }, [showDeleteConfirm, showToast]);

  const handleViewBuyer = useCallback((buyer) => { setViewingBuyer(buyer); setShowViewModal(true); }, []);

  const handleViewFullProfile = useCallback((buyer) => {
    navigate('/profile/customer');
    showToast(`Opening ${buyer.personal.name}'s full profile...`, 'info');
  }, [navigate, showToast]);

  const handleEditBuyer = useCallback((buyer) => {
    setEditingBuyer(buyer);
    setShowEditModal(true);
  }, []);

  const saveEdit = useCallback((updatedData) => {
    if (!editingBuyer) return;

    setBuyers(prev => {
      const updated = prev.map(b => b.id === editingBuyer.id ? {
        ...b,
        ...updatedData,
        id: b.id,
        avatar: b.avatar,
        registrationDate: b.registrationDate,
        savedProperties: b.savedProperties,
        viewedProperties: b.viewedProperties,
        inquiries: b.inquiries
      } : b);
      recomputeStats(updated);
      return updated;
    });
    setShowEditModal(false);
    setEditingBuyer(null);
    showToast('Buyer profile updated successfully', 'success');
  }, [editingBuyer, showToast]);

  const handleAddBuyer = useCallback((formData) => {
    const newBuyer = {
      id: `buyer_${Date.now()}`,
      avatar: (formData.personal.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NA',
      registrationDate: new Date().toISOString(),
      savedProperties: 0,
      viewedProperties: 0,
      inquiries: 0,
      ...formData,
    };
    setBuyers(prev => {
      const updated = [newBuyer, ...prev];
      recomputeStats(updated);
      return updated;
    });
    setShowAddModal(false);
    showToast('Buyer profile added successfully', 'success');
  }, [showToast]);

  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') { setSelectedStatus('all'); setSelectedRequirement('all'); }
    else if (['active', 'pending', 'blocked'].includes(filter)) { setSelectedStatus(filter); setSelectedRequirement('all'); }
    else if (['Buy', 'Rent', 'Both'].includes(filter)) { setSelectedRequirement(filter); setSelectedStatus('all'); }
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedRequirement('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockBuyers = generateMockBuyers();
      setBuyers(mockBuyers);
      setFilteredBuyers(mockBuyers);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Profiles refreshed successfully', 'success');
    }, 1000);
  }, [generateMockBuyers, showToast]);

  const handleExportBuyers = useCallback(() => {
    if (filteredBuyers.length === 0) { showToast('No profiles to export', 'warning'); return; }
    const data = filteredBuyers.map(b => ({
      Name: b.personal.name,
      Email: b.contact.email,
      Phone: b.contact.phone,
      City: b.location.city,
      State: b.location.state,
      Status: b.status,
      Requirement: b.requirement,
      Budget: b.budget.label,
      'Property Types': b.preferredPropertyType.join(' | '),
      'Preferred Locations': b.preferredLocation.join(' | '),
      Occupation: b.employment.occupation,
      'Annual Income': b.employment.annualIncome,
    }));
    const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buyer_profiles_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredBuyers.length} profiles exported successfully`, 'success');
  }, [filteredBuyers, showToast]);

  const handleViewModalBlock = useCallback((id) => {
    const buyer = buyers.find(b => b.id === id);
    if (!buyer) return;
    handleBlockClick(id, buyer.status !== 'blocked');
  }, [buyers, handleBlockClick]);

  const handleViewModalEdit = useCallback(() => {
    if (!viewingBuyer) return;
    setShowViewModal(false);
    handleEditBuyer(viewingBuyer);
  }, [viewingBuyer, handleEditBuyer]);

  const handleViewModalDelete = useCallback((id) => { setShowViewModal(false); handleDelete(id); }, [handleDelete]);

  const handleViewModalFullProfile = useCallback((buyer) => { setShowViewModal(false); handleViewFullProfile(buyer); }, [handleViewFullProfile]);

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} />

      {/* VIEW MODAL - Read Only */}
      <ViewProfileModal
        buyer={viewingBuyer}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingBuyer(null); }}
        onBlock={handleViewModalBlock}
        onEdit={handleViewModalEdit}
        onDelete={handleViewModalDelete}
        onViewFullProfile={handleViewModalFullProfile}
      />

      {/* ADD MODAL - Separate Form */}
      <AddProfileModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddBuyer}
      />

      {/* EDIT MODAL - Separate Form */}
      <EditProfileModal
        buyer={editingBuyer}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingBuyer(null); }}
        onSave={saveEdit}
      />

      <DeleteConfirmModal
        show={!!showDeleteConfirm}
        buyerName={buyers.find(b => b.id === showDeleteConfirm)?.personal.name || ''}
        onCancel={() => setShowDeleteConfirm(null)}
        onConfirm={confirmDelete}
        actionLoading={actionLoading === `delete_${showDeleteConfirm}`}
      />

      <BlockConfirmModal
        show={!!showBlockConfirm}
        buyerName={buyers.find(b => b.id === showBlockConfirm)?.personal.name || ''}
        isBlocking={isBlockingAction}
        onCancel={() => { setShowBlockConfirm(null); setIsBlockingAction(false); }}
        onConfirm={confirmBlock}
        actionLoading={actionLoading === `block_${showBlockConfirm}`}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Buyer Profiles
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredBuyers.length} Profiles
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">{filterCount} filters</span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage full buyer profiles: personal, contact, budget, requirements &amp; more</span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md hover:scale-105"
            >
              <FiUserPlus className="text-sm" /><span>Add Profile</span>
            </button>
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportBuyers}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" /><span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-green/400 rounded-3xl p-4 border border-[#d8f4ec] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard icon={<FiUsers className="text-white text-sm" />} title="Total" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={activeFilter === 'all'} statsAnimating={statsAnimating} onClick={() => handleStatClick('all')} />
              <StatCard icon={<FiUserCheck className="text-white text-sm" />} title="Active" value={stats.active} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={100} isActive={activeFilter === 'active'} statsAnimating={statsAnimating} onClick={() => handleStatClick('active')} />
              <StatCard icon={<FiClock className="text-white text-sm" />} title="Pending" value={stats.pending} color="bg-gradient-to-br from-amber-600 to-amber-400" delay={200} isActive={activeFilter === 'pending'} statsAnimating={statsAnimating} onClick={() => handleStatClick('pending')} />
              <StatCard icon={<FiLock className="text-white text-sm" />} title="Blocked" value={stats.blocked} color="bg-gradient-to-br from-red-600 to-red-400" delay={300} isActive={activeFilter === 'blocked'} statsAnimating={statsAnimating} onClick={() => handleStatClick('blocked')} />
              <StatCard icon={<FiHome className="text-white text-sm" />} title="Buy" value={stats.buy} color="bg-gradient-to-br from-blue-600 to-blue-400" delay={400} isActive={activeFilter === 'Buy'} statsAnimating={statsAnimating} onClick={() => handleStatClick('Buy')} />
              <StatCard icon={<FiTag className="text-white text-sm" />} title="Rent" value={stats.rent} color="bg-gradient-to-br from-purple-600 to-purple-400" delay={500} isActive={activeFilter === 'Rent'} statsAnimating={statsAnimating} onClick={() => handleStatClick('Rent')} />
              <StatCard icon={<FiShield className="text-white text-sm" />} title="Both" value={stats.both} color="bg-gradient-to-br from-indigo-600 to-indigo-400" delay={600} isActive={activeFilter === 'Both'} statsAnimating={statsAnimating} onClick={() => handleStatClick('Both')} />
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search profiles by name, email, phone, or city..."
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
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select value={selectedRequirement} onChange={(e) => setSelectedRequirement(e.target.value)} className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]">
                <option value="all">All Requirement</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="Both">Both</option>
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
                <FiGrid className="text-sm" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="List View">
                <FiList className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedBuyers.map((buyer, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
                active: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
                blocked: 'bg-gray-100 text-gray-600 border-gray-200'
              };
              const isPending = buyer.status === 'pending';
              const isActive = buyer.status === 'active';
              const showVerifiedBadge = buyer.kycStatus === 'verified' && buyer.status !== 'blocked';

              return (
                <div
                  key={buyer.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${
                    isPending ? 'border-l-4 border-l-amber-500' : isActive ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {buyer.avatar}
                        </div>
                        {showVerifiedBadge && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <FaCheck className="text-white text-[7px]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{buyer.personal.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[buyer.status]}`}>
                            {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap bg-[#F0EEFB] text-indigo-700">
                            {buyer.requirement}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      onClick={() => handleViewBuyer(buyer)}
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{buyer.contact.email}</span>
                      {buyer.contact.verification.email && <FiCheckCircle className="text-[#00695C] text-[10px] shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{buyer.contact.phone}</span>
                      {buyer.contact.verification.phone && <FiCheckCircle className="text-[#00695C] text-[10px] shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{buyer.location.city}, {buyer.location.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{buyer.budget.label}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {buyer.preferredPropertyType.slice(0, 3).map(type => (
                      <span key={type} className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F5F9F8] text-[#5A7D78] border border-[#E8F0EE]">{type}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button type="button" onClick={() => handleViewBuyer(buyer)} className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button type="button" onClick={() => handleEditBuyer(buyer)} className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBlockClick(buyer.id, buyer.status !== 'blocked')}
                      disabled={actionLoading === `block_${buyer.id}`}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        buyer.status === 'blocked' ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]' : 'text-red-600 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      {actionLoading === `block_${buyer.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : buyer.status === 'blocked' ? <FiUnlock className="text-[10px]" /> : <FiLock className="text-[10px]" />}
                      {buyer.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(buyer.id)}
                      disabled={actionLoading === `delete_${buyer.id}`}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${buyer.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>

                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleViewFullProfile(buyer)}
                      className="w-full py-1.5 text-xs font-medium text-[#167A54] bg-[#E7F6EF] border border-[#BEE4D2] rounded-xl hover:bg-[#D5EFE0] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                    >
                      <FiExternalLink className="text-[10px]" /> View Full Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-3">Buyer</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Req.</div>
              <div className="col-span-2">City</div>
              <div className="col-span-2">Budget</div>
              <div className="col-span-2">Occupation</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedBuyers.map((buyer, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700',
                active: 'bg-[#E8F8F5] text-[#00695C]',
                blocked: 'bg-gray-100 text-gray-600'
              };
              return (
                <div key={buyer.id} className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${buyer.status === 'pending' ? 'bg-amber-50/30' : ''}`} style={{ animationDelay: `${index * 30}ms` }}>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {buyer.avatar}
                      </div>
                      {buyer.kycStatus === 'verified' && buyer.status !== 'blocked' && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1A2E2A] truncate">{buyer.personal.name}</p>
                      <p className="text-[10px] text-[#5A7D78] truncate">{buyer.contact.email}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[buyer.status]}`}>
                      {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-1 text-xs text-[#5A7D78]">{buyer.requirement}</div>
                  <div className="col-span-2 text-xs text-[#5A7D78] truncate">{buyer.location.city}</div>
                  <div className="col-span-2 text-xs text-[#5A7D78] truncate">{buyer.budget.label}</div>
                  <div className="col-span-2 text-xs text-[#5A7D78] truncate">{buyer.employment.occupation}</div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button type="button" onClick={() => handleViewBuyer(buyer)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110" title="View">
                      <FiEye className="text-xs" />
                    </button>
                    <button type="button" onClick={() => handleEditBuyer(buyer)} className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110" title="Edit">
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBlockClick(buyer.id, buyer.status !== 'blocked')}
                      disabled={actionLoading === `block_${buyer.id}`}
                      className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${buyer.status === 'blocked' ? 'text-[#00695C] hover:bg-[#E8F8F5]' : 'text-red-500 hover:bg-red-50'}`}
                      title={buyer.status === 'blocked' ? 'Unblock' : 'Block'}
                    >
                      {actionLoading === `block_${buyer.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : buyer.status === 'blocked' ? <FiUnlock className="text-xs" /> : <FiLock className="text-xs" />}
                    </button>
                    <button type="button" onClick={() => handleDelete(buyer.id)} disabled={actionLoading === `delete_${buyer.id}`} className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50" title="Delete">
                      {actionLoading === `delete_${buyer.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedBuyers.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUserPlus className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No profiles found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No buyer profiles match your current view'}
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredBuyers.length)} of {filteredBuyers.length} profiles
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

export default BuyerProfile;