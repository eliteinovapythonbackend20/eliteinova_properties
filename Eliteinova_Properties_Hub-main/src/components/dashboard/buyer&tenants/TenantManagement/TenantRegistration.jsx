// src/components/dashboard/admin/buyer&tenants/TenantManagement/TenantRegistration.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX, FiUserMinus,
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiEye, FiEdit, FiTrash2, FiLock, FiUnlock, FiCheckCircle,
  FiXCircle, FiClock, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiStar, FiShield, FiActivity, FiRefreshCw,
  FiArrowRight, FiMoreVertical, FiDownload, FiUpload,
  FiInfo, FiAlertTriangle, FiPlus, FiExternalLink, FiGrid, FiList, FiX,
  FiBriefcase, FiHome, FiDollarSign, FiUserCheck as FiUserCheckAlt,
  FiFileText, FiUsers as FiFamily, FiTag, FiSmartphone
} from 'react-icons/fi';
import {
  FaBuilding, FaUserTie, FaCheck, FaTimes, FaStar as FaStarSolid,
  FaUserCircle, FaIdCard, FaFileAlt, FaHome as FaHomeSolid
} from 'react-icons/fa';
import { MdOutlineVerifiedUser, MdOutlineFamilyRestroom } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi2';

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

const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick()}
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
      {isActive && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   CONFIRM ACTION MODAL — shared for Activate / Block / Delete
============================================================ */

const ConfirmActionModal = ({ show, action, actionLoading, tenantName, onCancel, onConfirm }) => {
  if (!show) return null;

  const config = {
    activate: {
      color: 'emerald',
      Icon: FiCheckCircle,
      title: 'Activate Tenant',
      message: `Are you sure you want to activate ${tenantName}? They will gain full access to the tenant portal.`,
      confirmLabel: 'Activate'
    },
    block: {
      color: 'red',
      Icon: FiLock,
      title: 'Block Tenant',
      message: `Are you sure you want to block ${tenantName}? They will lose access until unblocked.`,
      confirmLabel: 'Block'
    },
    unblock: {
      color: 'emerald',
      Icon: FiUnlock,
      title: 'Unblock Tenant',
      message: `Are you sure you want to unblock ${tenantName}? Their access will be restored.`,
      confirmLabel: 'Unblock'
    },
    delete: {
      color: 'red',
      Icon: FiTrash2,
      title: 'Delete Tenant',
      message: `Are you sure you want to permanently delete ${tenantName}? This action cannot be undone and all records will be removed.`,
      confirmLabel: 'Delete'
    }
  };

  const { color, Icon, title, message, confirmLabel } = config[action] || config.activate;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-${color}-50 flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`text-3xl text-${color}-600`} />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">{title}</h3>
          <p className="text-sm text-[#5A7D78] mt-2">{message}</p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={actionLoading === action}
              className={`flex-1 px-4 py-2.5 bg-${color}-600 text-white rounded-xl hover:bg-${color}-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-${color}-600/30 disabled:opacity-50`}
            >
              {actionLoading === action ? <FiRefreshCw className="animate-spin mx-auto" /> : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VIEW TENANT MODAL — theme-token based
   Signature element: completion ring around the avatar showing
   how many of the 3 verification checks (Mobile / Email / KYC)
   are complete. KYC is optional, shown distinctly when skipped.
============================================================ */

const ViewTenantModal = ({ tenant, show, actionLoading, onClose, onActivate, onBlock, onEdit, onDelete, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [tenant?.id]);

  if (!tenant || !show) return null;

  const verificationItems = [
    { key: 'mobile', label: 'Mobile', optional: false },
    { key: 'email', label: 'Email', optional: false },
    { key: 'kyc', label: 'KYC', optional: true },
  ];
  const requiredItems = verificationItems.filter(i => !i.optional);
  const verifiedCount = verificationItems.filter(item => tenant.verification[item.key] === 'verified').length;
  const trackTotal = verificationItems.length;
  const verifiedPercent = Math.round((verifiedCount / trackTotal) * 100);
  const ringCircumference = 2 * Math.PI * 34;
  const ringOffset = ringCircumference - (verifiedPercent / 100) * ringCircumference;

  const isBlocked = tenant.status === 'blocked';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contact', label: 'Contact' },
    { id: 'verification', label: 'Verification' },
  ];

  const statusPill = (value) => {
    if (value === 'verified') return { bg: 'var(--tvm-success-bg)', color: 'var(--tvm-success)', label: 'Verified', Icon: FiCheckCircle };
    if (value === 'pending') return { bg: 'var(--tvm-warning-bg)', color: 'var(--tvm-warning-text)', label: 'Pending', Icon: FiClock };
    if (value === 'rejected') return { bg: 'var(--tvm-danger-bg)', color: 'var(--tvm-danger)', label: 'Rejected', Icon: FiXCircle };
    return { bg: 'var(--tvm-surface)', color: 'var(--tvm-muted)', label: 'Not Submitted', Icon: FiXCircle };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="tenant-view-modal w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[28px] shadow-2xl animate-slide-up flex flex-col"
        style={{ background: 'var(--tvm-bg)', color: 'var(--tvm-text)', border: '1px solid var(--tvm-border)' }}
      >
        {/* Hero */}
        <div
          className="relative px-6 pt-6 pb-14 shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--tvm-accent), var(--tvm-accent-2))' }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Tenant Registration</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
            >
              <FiX className="text-base" />
            </button>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{tenant.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{tenant.occupation} · {tenant.city}, {tenant.state}</p>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              tenant.status === 'active' ? 'bg-white text-emerald-700' :
              tenant.status === 'blocked' ? 'bg-white/20 text-white' :
              'bg-white text-amber-700'
            }`}>
              {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
              <FiHome className="text-[10px]" /> {tenant.propertyPreference}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
              <FiFamily className="text-[10px]" /> {tenant.familySize} member{tenant.familySize > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Avatar with verification completion ring, overlapping the hero */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
              <circle cx="38" cy="38" r="34" fill="none" stroke="var(--tvm-ring-track)" strokeWidth="5" />
              <circle
                cx="38" cy="38" r="34" fill="none"
                stroke="var(--tvm-ring-active)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-lg"
              style={{ inset: '10px', background: 'var(--tvm-surface)', color: 'var(--tvm-accent)', border: '3px solid var(--tvm-bg)' }}
            >
              {tenant.avatar}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] font-medium mt-1 shrink-0" style={{ color: 'var(--tvm-muted)' }}>
          {verifiedCount}/{trackTotal} verified · {verifiedPercent}%
        </p>

        {/* View Tenant Profile Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewProfile && onViewProfile(tenant.id)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'var(--tvm-success-bg)',
              color: 'var(--tvm-success)',
              border: '1px solid var(--tvm-success-border)'
            }}
          >
            <FiExternalLink className="text-sm" />
            View Tenant Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 px-6 mt-4 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'var(--tvm-accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--tvm-on-accent)' : 'var(--tvm-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tenant.status === 'pending' && (
            <div
              className="rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-5"
              style={{ background: 'var(--tvm-warning-bg)', border: '1px solid var(--tvm-warning-border)' }}
            >
              <span className="text-xs font-medium flex items-center gap-2" style={{ color: 'var(--tvm-warning-text)' }}>
                <FiClock /> Awaiting activation
              </span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Leases', value: tenant.activeLeases },
                  { label: 'Documents', value: tenant.documentsCount },
                  { label: 'Budget', value: `₹${Math.floor(tenant.monthlyBudget / 1000)}K` },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3 text-center"
                    style={{ background: 'var(--tvm-surface)', border: '1px solid var(--tvm-border)' }}
                  >
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--tvm-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--tvm-border)' }}>
                <span style={{ color: 'var(--tvm-muted)' }}>Registered</span>
                <span className="font-medium">
                  {new Date(tenant.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--tvm-border)' }}>
                <span style={{ color: 'var(--tvm-muted)' }}>Occupation</span>
                <span className="font-medium">{tenant.occupation}</span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--tvm-border)' }}>
                <span style={{ color: 'var(--tvm-muted)' }}>Preferred Move-in</span>
                <span className="font-medium">
                  {new Date(tenant.moveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {tenant.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--tvm-muted)' }}>Notes</p>
                  <p
                    className="text-sm leading-relaxed pl-3"
                    style={{ borderLeft: '2px solid var(--tvm-accent-2)', color: 'var(--tvm-text-soft)' }}
                  >
                    {tenant.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              {[
                { icon: <FiMail />, label: 'Email', value: tenant.email, verified: tenant.verification.email === 'verified' },
                { icon: <FiPhone />, label: 'Phone', value: tenant.phone, verified: tenant.verification.mobile === 'verified' },
                { icon: <FiMapPin />, label: 'Current Address', value: `${tenant.city}, ${tenant.state}` },
                { icon: <FiHome />, label: 'Preference', value: tenant.propertyPreference },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--tvm-border)' }}>
                  <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--tvm-muted)' }}>
                    <span style={{ color: 'var(--tvm-accent)' }}>{row.icon}</span>{row.label}
                  </span>
                  <span className="text-sm font-medium text-right flex items-center gap-1.5">
                    {row.value}
                    {row.verified !== undefined && (
                      row.verified
                        ? <FiCheckCircle style={{ color: 'var(--tvm-success)' }} className="text-xs" />
                        : <FiXCircle style={{ color: 'var(--tvm-muted)' }} className="text-xs" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--tvm-muted)' }}>Verification Status</p>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {verificationItems.map(item => {
                  const pill = statusPill(tenant.verification[item.key]);
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5"
                      style={{ background: 'var(--tvm-surface)', border: '1px solid var(--tvm-border)' }}
                    >
                      <span className="text-xs font-medium flex items-center gap-2">
                        {item.key === 'mobile' && <FiSmartphone style={{ color: 'var(--tvm-accent)' }} />}
                        {item.key === 'email' && <FiMail style={{ color: 'var(--tvm-accent)' }} />}
                        {item.key === 'kyc' && <FaIdCard style={{ color: 'var(--tvm-accent)' }} />}
                        {item.label}
                        {item.optional && (
                          <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'var(--tvm-surface)', color: 'var(--tvm-muted)', border: '1px solid var(--tvm-border)' }}>
                            Optional
                          </span>
                        )}
                      </span>
                      <span
                        className="text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1"
                        style={{ background: pill.bg, color: pill.color }}
                      >
                        <pill.Icon className="text-[10px]" /> {pill.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-3 rounded-xl" style={{ background: 'var(--tvm-surface)', border: '1px solid var(--tvm-border)' }}>
                <p className="text-[10px] font-medium" style={{ color: 'var(--tvm-muted)' }}>Mobile and Email verification are required to activate a tenant. KYC is optional but recommended before lease signing.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="px-6 py-4 border-t flex items-center gap-2 shrink-0"
          style={{ borderColor: 'var(--tvm-border)', background: 'var(--tvm-surface)' }}
        >
          {tenant.status === 'pending' ? (
            <>
              <button
                onClick={() => onActivate(tenant.id)}
                disabled={actionLoading === tenant.id}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: 'var(--tvm-success)', color: 'var(--tvm-on-accent)' }}
              >
                {actionLoading === tenant.id ? <FiRefreshCw className="animate-spin text-xs" /> : <FiCheckCircle className="text-xs" />}
                Activate
              </button>
              <button
                onClick={onEdit}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'var(--tvm-accent)', color: 'var(--tvm-on-accent)' }}
              >
                <FiEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'transparent', color: 'var(--tvm-danger)', border: '1px solid var(--tvm-danger)' }}
              >
                <FiTrash2 className="text-xs" /> Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'var(--tvm-accent)', color: 'var(--tvm-on-accent)' }}
              >
                <FiEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={onBlock}
                disabled={actionLoading === `block_${tenant.id}`}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{
                  background: isBlocked ? 'var(--tvm-success-bg)' : 'var(--tvm-danger-bg)',
                  color: isBlocked ? 'var(--tvm-success)' : 'var(--tvm-danger)'
                }}
              >
                {actionLoading === `block_${tenant.id}` ? (
                  <FiRefreshCw className="animate-spin text-xs" />
                ) : isBlocked ? (
                  <FiUnlock className="text-xs" />
                ) : (
                  <FiLock className="text-xs" />
                )}
                {isBlocked ? 'Unblock' : 'Block'}
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'transparent', color: 'var(--tvm-danger)', border: '1px solid var(--tvm-danger)' }}
              >
                <FiTrash2 className="text-xs" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .tenant-view-modal {
          --tvm-bg: #FFFFFF;
          --tvm-surface: #F5F9F8;
          --tvm-border: #E5EEEB;
          --tvm-text: #12211D;
          --tvm-text-soft: #3E5C56;
          --tvm-muted: #6B8983;
          --tvm-accent: #0F6B5C;
          --tvm-accent-2: #2FAE9A;
          --tvm-on-accent: #FFFFFF;
          --tvm-ring-track: #E5EEEB;
          --tvm-ring-active: #0F6B5C;
          --tvm-success: #167A54;
          --tvm-success-bg: #E7F6EF;
          --tvm-success-border: #BEE4D2;
          --tvm-danger: #C0392B;
          --tvm-danger-bg: #FCEBE9;
          --tvm-warning-text: #92620C;
          --tvm-warning-bg: #FDF3DE;
          --tvm-warning-border: #F2DBA3;
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   ADD / EDIT TENANT MODAL
   Single modal handles both create and update. Includes toggle
   controls for Mobile / Email / KYC verification status.
   FIXED: Bottom buttons are sticky/fixed at bottom
============================================================ */

const AddEditTenantModal = ({ tenant, show, mode, onClose, onSave }) => {
  const emptyForm = {
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    occupation: '',
    propertyPreference: 'Individual',
    familySize: 1,
    monthlyBudget: 15000,
    moveInDate: new Date().toISOString().slice(0, 10),
    status: 'pending',
    notes: '',
    verification: { mobile: 'not_submitted', email: 'not_submitted', kyc: 'not_submitted' },
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (mode === 'edit' && tenant) {
      setFormData({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        city: tenant.city,
        state: tenant.state,
        occupation: tenant.occupation,
        propertyPreference: tenant.propertyPreference,
        familySize: tenant.familySize,
        monthlyBudget: tenant.monthlyBudget,
        moveInDate: tenant.moveInDate.slice(0, 10),
        status: tenant.status,
        notes: tenant.notes || '',
        verification: { ...tenant.verification },
      });
    } else if (mode === 'add') {
      setFormData(emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant, mode, show]);

  if (!show || !formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const cycleVerification = (key, optional) => {
    const order = optional
      ? ['not_submitted', 'pending', 'verified', 'rejected']
      : ['pending', 'verified', 'rejected'];
    setFormData(prev => {
      const current = prev.verification[key];
      const idx = order.indexOf(current);
      const next = order[(idx + 1) % order.length];
      return { ...prev, verification: { ...prev.verification, [key]: next } };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const verificationDocs = [
    { key: 'mobile', label: 'Mobile', icon: <FiSmartphone className="text-sm" />, optional: false },
    { key: 'email', label: 'Email', icon: <FiMail className="text-sm" />, optional: false },
    { key: 'kyc', label: 'KYC', icon: <FaIdCard className="text-sm" />, optional: true },
  ];

  const statusStyle = (value) => {
    if (value === 'verified') return 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]';
    if (value === 'pending') return 'bg-[#FEF3E2] border-amber-200 text-amber-700';
    if (value === 'rejected') return 'bg-red-50 border-red-200 text-red-700';
    return 'bg-[#F5F9F8] border-[#E8F0EE] text-[#5A7D78]';
  };

  const statusLabel = (value) => {
    if (value === 'verified') return 'Verified';
    if (value === 'pending') return 'Pending';
    if (value === 'rejected') return 'Rejected';
    return 'Not Submitted';
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">{mode === 'add' ? 'Add Tenant' : 'Edit Tenant'}</h2>
          <p className="text-white/80 text-sm">{mode === 'add' ? 'Register a new tenant' : 'Update tenant information'}</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="tenant-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Property Preference</label>
                <select
                  name="propertyPreference"
                  value={formData.propertyPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="Individual">Individual</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land & Plots">Land & Plots</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Family Size</label>
                <input
                  type="number"
                  name="familySize"
                  value={formData.familySize}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Monthly Budget (₹)</label>
                <input
                  type="number"
                  name="monthlyBudget"
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Preferred Move-in Date</label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>

              {/* Verification Documents (cycled status toggles) */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-2">Verification</label>
                <div className="grid grid-cols-3 gap-2">
                  {verificationDocs.map(item => {
                    const value = formData.verification[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => cycleVerification(item.key, item.optional)}
                        className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${statusStyle(value)}`}
                      >
                        <span className="flex items-center gap-1.5 w-full justify-between">
                          <span className="flex items-center gap-1.5">
                            {item.icon}
                            {item.label}
                          </span>
                          {item.optional && (
                            <span className="text-[8px] uppercase tracking-wider opacity-70">Optional</span>
                          )}
                        </span>
                        <span className="text-[10px]">{statusLabel(value)}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#5A7D78] mt-1.5">Tap a document to cycle its verification status.</p>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
                  placeholder="Any additional notes about the tenant"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky at bottom */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="tenant-form"
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              {mode === 'add' ? 'Add Tenant' : 'Save Changes'}
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

const TenantRegistration = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all' | 'mobile' | 'email' | 'fully'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formTenant, setFormTenant] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [showFormModal, setShowFormModal] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  // Note: KYC is optional for tenants, so it is intentionally excluded from
  // the top-level stat counts and from the "Fully Verified" definition below —
  // only Mobile and Email are required for a tenant to be considered verified.
  const [stats, setStats] = useState({
    totalTenants: 0,
    pendingActivation: 0,
    active: 0,
    blocked: 0,
    mobileVerified: 0,
    emailVerified: 0,
    fullyVerified: 0,
  });

  // ============ COMPUTE STATS FROM LIVE DATA ============
  const computeStats = useCallback((list) => {
    const total = list.length;
    const pending = list.filter(t => t.status === 'pending').length;
    const active = list.filter(t => t.status === 'active').length;
    const blocked = list.filter(t => t.status === 'blocked').length;
    const mobileVerified = list.filter(t => t.verification.mobile === 'verified').length;
    const emailVerified = list.filter(t => t.verification.email === 'verified').length;
    const fullyVerified = list.filter(t =>
      t.verification.mobile === 'verified' &&
      t.verification.email === 'verified'
    ).length;

    setStats({
      totalTenants: total,
      pendingActivation: pending,
      active,
      blocked,
      mobileVerified,
      emailVerified,
      fullyVerified,
    });
  }, []);

  // ============ GENERATE MOCK TENANTS ============
  const generateMockTenants = useCallback(() => {
    const firstNames = ['Rahul', 'Anita', 'Sanjay', 'Divya', 'Karthik', 'Neha', 'Manoj', 'Swati', 'Rohit', 'Pallavi', 'Vivek', 'Shalini', 'Ajay', 'Bhavana', 'Naveen', 'Radhika', 'Sameer', 'Anjali', 'Harish', 'Preeti'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];
    const statuses = ['pending', 'active', 'blocked'];
    const verificationStates = ['not_submitted', 'pending', 'verified', 'rejected'];
    const requiredVerificationStates = ['pending', 'verified', 'rejected'];
    const occupations = ['Software Engineer', 'Teacher', 'Doctor', 'Accountant', 'Business Owner', 'Student', 'Marketing Executive', 'Government Employee', 'Freelancer', 'Consultant'];
    const propertyPreferences = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

    const tenants = [];
    const usedNames = new Set();

    for (let i = 1; i <= 80; i++) {
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
      const city = cities[Math.floor(Math.random() * cities.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      const moveIn = new Date();
      moveIn.setDate(moveIn.getDate() + Math.floor(Math.random() * 60));

      const verification = {
        mobile: requiredVerificationStates[Math.floor(Math.random() * requiredVerificationStates.length)],
        email: requiredVerificationStates[Math.floor(Math.random() * requiredVerificationStates.length)],
        kyc: verificationStates[Math.floor(Math.random() * verificationStates.length)],
      };

      tenants.push({
        id: `tenant_${i}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        city: city,
        state: states[Math.floor(Math.random() * states.length)],
        status: status,
        verification: verification,
        registrationDate: date.toISOString(),
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        propertyPreference: propertyPreferences[Math.floor(Math.random() * propertyPreferences.length)],
        familySize: Math.floor(Math.random() * 5) + 1,
        monthlyBudget: Math.floor(Math.random() * 40000 + 8000),
        moveInDate: moveIn.toISOString(),
        activeLeases: Math.floor(Math.random() * 2),
        documentsCount: Math.floor(Math.random() * 5),
        avatar: firstName[0] + lastName[0],
        notes: '',
      });
    }

    computeStats(tenants);
    return tenants;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockTenants = generateMockTenants();
    setTenants(mockTenants);
    setFilteredTenants(mockTenants);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ FILTER TENANTS ============
  const filterTenants = useCallback(() => {
    let filtered = [...tenants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tenant =>
        tenant.name.toLowerCase().includes(query) ||
        tenant.email.toLowerCase().includes(query) ||
        tenant.phone.includes(query) ||
        tenant.city.toLowerCase().includes(query) ||
        tenant.occupation.toLowerCase().includes(query) ||
        tenant.propertyPreference.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === selectedStatus);
    }

    if (verificationFilter === 'mobile') {
      filtered = filtered.filter(tenant => tenant.verification.mobile === 'verified');
    } else if (verificationFilter === 'email') {
      filtered = filtered.filter(tenant => tenant.verification.email === 'verified');
    } else if (verificationFilter === 'fully') {
      filtered = filtered.filter(tenant => tenant.verification.mobile === 'verified' && tenant.verification.email === 'verified');
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (verificationFilter !== 'all') count++;
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

    setFilteredTenants(filtered);
    setCurrentPage(1);
  }, [tenants, searchQuery, selectedStatus, verificationFilter, sortField, sortDirection]);

  useEffect(() => {
    filterTenants();
  }, [filterTenants]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredTenants.length / pageSize);
  const paginatedTenants = useMemo(() =>
    filteredTenants.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredTenants, currentPage, pageSize]);

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
    if (selectedTenants.length === paginatedTenants.length) {
      setSelectedTenants([]);
    } else {
      setSelectedTenants(paginatedTenants.map(tenant => tenant.id));
    }
  }, [selectedTenants, paginatedTenants]);

  // ============ HANDLE SELECT TENANT ============
  const handleSelectTenant = useCallback((tenantId) => {
    setSelectedTenants(prev =>
      prev.includes(tenantId)
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    );
  }, []);

  // ============ OPEN CONFIRM MODAL ============
  const requestConfirm = useCallback((tenantId, action) => {
    setConfirmTarget(tenantId);
    setConfirmAction(action);
  }, []);

  // ============ CONFIRM ACTION (activate / block / unblock / delete) ============
  const confirmActionHandler = useCallback(() => {
    const tenantId = confirmTarget;
    const action = confirmAction;
    setActionLoading(action === 'block' || action === 'unblock' ? `block_${tenantId}` : action);
    setConfirmTarget(null);

    setTimeout(() => {
      setTenants(prev => {
        let updated;
        const tenant = prev.find(t => t.id === tenantId);
        if (!tenant) return prev;

        if (action === 'activate') {
          updated = prev.map(t => t.id === tenantId ? { ...t, status: 'active' } : t);
          showToast(`${tenant.name} has been activated`, 'success');
        } else if (action === 'block') {
          updated = prev.map(t => t.id === tenantId ? { ...t, status: 'blocked' } : t);
          showToast(`${tenant.name} has been blocked`, 'warning');
        } else if (action === 'unblock') {
          updated = prev.map(t => t.id === tenantId ? { ...t, status: 'active' } : t);
          showToast(`${tenant.name} has been unblocked`, 'success');
        } else if (action === 'delete') {
          updated = prev.filter(t => t.id !== tenantId);
          showToast(`${tenant.name} has been deleted`, 'error');
        } else {
          updated = prev;
        }

        computeStats(updated);
        return updated;
      });

      setActionLoading(null);
      setConfirmAction(null);

      if (action === 'delete') {
        setShowViewModal(false);
        setViewingTenant(null);
      } else {
        setViewingTenant(prev => {
          if (!prev || prev.id !== tenantId) return prev;
          if (action === 'activate') return { ...prev, status: 'active' };
          if (action === 'block') return { ...prev, status: 'blocked' };
          if (action === 'unblock') return { ...prev, status: 'active' };
          return prev;
        });
      }
    }, 700);
  }, [confirmTarget, confirmAction, computeStats, showToast]);

  // ============ VIEW TENANT DETAIL ============
  const handleViewTenant = useCallback((tenant) => {
    setViewingTenant(tenant);
    setShowViewModal(true);
  }, []);

  // ============ VIEW TENANT PROFILE ============
  const handleViewTenantProfile = useCallback((tenantId) => {
    navigate('/profile/customer');
    showToast('Opening Tenant Profile...', 'info');
  }, [navigate, showToast]);

  // ============ ADD TENANT ============
  const handleAddTenant = useCallback(() => {
    setFormTenant(null);
    setFormMode('add');
    setShowFormModal(true);
  }, []);

  // ============ EDIT TENANT ============
  const handleEditTenant = useCallback((tenant) => {
    setFormTenant(tenant);
    setFormMode('edit');
    setShowFormModal(true);
  }, []);

  // ============ SAVE FORM (ADD OR EDIT) ============
  const saveForm = useCallback((data) => {
    setTenants(prev => {
      let updated;
      if (formMode === 'add') {
        const newTenant = {
          ...data,
          id: `tenant_${Date.now()}`,
          registrationDate: new Date().toISOString(),
          activeLeases: 0,
          documentsCount: 0,
          avatar: (data.name || 'T N').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        };
        updated = [newTenant, ...prev];
      } else {
        updated = prev.map(t => t.id === formTenant.id ? { ...t, ...data } : t);
      }
      computeStats(updated);
      return updated;
    });

    setShowFormModal(false);
    setFormTenant(null);
    showToast(formMode === 'add' ? 'Tenant added successfully' : 'Tenant updated successfully', 'success');
  }, [formMode, formTenant, computeStats, showToast]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    // Reset every quick-filter dimension first, then apply the one the
    // clicked stat represents — keeps status / verification quick-filter
    // from stacking into a confusing combined state.
    setSelectedStatus('all');
    setVerificationFilter('all');

    if (nextFilter === 'pending' || nextFilter === 'active' || nextFilter === 'blocked') {
      setSelectedStatus(nextFilter);
    } else if (nextFilter === 'mobile_verified') {
      setVerificationFilter('mobile');
    } else if (nextFilter === 'email_verified') {
      setVerificationFilter('email');
    } else if (nextFilter === 'fully_verified') {
      setVerificationFilter('fully');
    }
    // 'all' leaves every filter reset

    setSearchQuery('');
    searchInputRef.current?.focus();
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setVerificationFilter('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockTenants = generateMockTenants();
      setTenants(mockTenants);
      setFilteredTenants(mockTenants);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockTenants, showToast]);

  // ============ EXPORT TENANTS ============
  const handleExportTenants = useCallback(() => {
    if (filteredTenants.length === 0) {
      showToast('No tenants to export', 'warning');
      return;
    }

    const data = filteredTenants.map(tenant => ({
      Name: tenant.name,
      Email: tenant.email,
      Phone: tenant.phone,
      City: tenant.city,
      State: tenant.state,
      Status: tenant.status,
      'Mobile Verified': tenant.verification.mobile === 'verified' ? 'Yes' : 'No',
      'Email Verified': tenant.verification.email === 'verified' ? 'Yes' : 'No',
      'KYC Status': tenant.verification.kyc,
      Occupation: tenant.occupation,
      'Property Preference': tenant.propertyPreference,
      'Family Size': tenant.familySize,
      'Monthly Budget': tenant.monthlyBudget,
      'Registration Date': new Date(tenant.registrationDate).toLocaleDateString(),
      'Move-in Date': new Date(tenant.moveInDate).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenant_registration_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredTenants.length} tenants exported successfully`, 'success');
  }, [filteredTenants, showToast]);

  // ============ VIEW MODAL ACTION HANDLERS ============
  const handleViewModalActivate = useCallback((id) => {
    requestConfirm(id, 'activate');
  }, [requestConfirm]);

  const handleViewModalBlock = useCallback(() => {
    if (!viewingTenant) return;
    requestConfirm(viewingTenant.id, viewingTenant.status === 'blocked' ? 'unblock' : 'block');
  }, [viewingTenant, requestConfirm]);

  const handleViewModalDelete = useCallback(() => {
    if (!viewingTenant) return;
    requestConfirm(viewingTenant.id, 'delete');
  }, [viewingTenant, requestConfirm]);

  const handleViewModalEdit = useCallback(() => {
    if (!viewingTenant) return;
    setShowViewModal(false);
    handleEditTenant(viewingTenant);
  }, [viewingTenant, handleEditTenant]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedTenants.length === 0) {
      showToast('Please select tenants first', 'warning');
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedTenants);
      let count = 0;

      setTenants(prev => {
        let updated;
        if (action === 'delete') {
          count = prev.filter(t => selectedIds.has(t.id)).length;
          updated = prev.filter(t => !selectedIds.has(t.id));
        } else {
          updated = prev.map(t => {
            if (!selectedIds.has(t.id)) return t;
            count++;
            if (action === 'activate') return { ...t, status: 'active' };
            if (action === 'block') return { ...t, status: 'blocked' };
            return t;
          });
        }
        computeStats(updated);
        return updated;
      });

      setSelectedTenants([]);
      setActionLoading(null);

      if (action === 'activate') showToast(`${count} tenant(s) activated successfully`, 'success');
      else if (action === 'block') showToast(`${count} tenant(s) blocked successfully`, 'warning');
      else if (action === 'delete') showToast(`${count} tenant(s) deleted successfully`, 'error');
    }, 800);
  }, [selectedTenants, computeStats, showToast]);

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Toast */}
      <Toast toast={toast} />

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        show={!!confirmTarget}
        action={confirmAction}
        actionLoading={actionLoading}
        tenantName={tenants.find(t => t.id === confirmTarget)?.name || ''}
        onCancel={() => { setConfirmTarget(null); setConfirmAction(null); }}
        onConfirm={confirmActionHandler}
      />

      {/* Add / Edit Modal */}
      <AddEditTenantModal
        tenant={formTenant}
        mode={formMode}
        show={showFormModal}
        onClose={() => { setShowFormModal(false); setFormTenant(null); }}
        onSave={saveForm}
      />

      {/* View Modal */}
      <ViewTenantModal
        tenant={viewingTenant}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingTenant(null); }}
        onActivate={handleViewModalActivate}
        onBlock={handleViewModalBlock}
        onDelete={handleViewModalDelete}
        onEdit={handleViewModalEdit}
        onViewProfile={handleViewTenantProfile}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Tenant Registration
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredTenants.length} Tenants
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Review and manage tenant registrations</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
              onClick={handleExportTenants}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleAddTenant}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiPlus className="text-sm" />
              <span>Add Tenant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Tenants"
                value={stats.totalTenants}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending Activation"
                value={stats.pendingActivation}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiUserCheck className="text-white text-sm" />}
                title="Active"
                value={stats.active}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={200}
                isActive={activeFilter === 'active'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('active')}
              />
              <StatCard
                icon={<FiLock className="text-white text-sm" />}
                title="Blocked"
                value={stats.blocked}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={300}
                isActive={activeFilter === 'blocked'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('blocked')}
              />
              <StatCard
                icon={<FiSmartphone className="text-white text-sm" />}
                title="Mobile Verified"
                value={stats.mobileVerified}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={350}
                isActive={activeFilter === 'mobile_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('mobile_verified')}
              />
              <StatCard
                icon={<FiMail className="text-white text-sm" />}
                title="Email Verified"
                value={stats.emailVerified}
                color="bg-gradient-to-br from-cyan-600 to-cyan-400"
                delay={400}
                isActive={activeFilter === 'email_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('email_verified')}
              />
              <StatCard
                icon={<FaCheck className="text-white text-sm" />}
                title="Fully Verified"
                value={stats.fullyVerified}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={450}
                isActive={activeFilter === 'fully_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('fully_verified')}
              />
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
              placeholder="Search tenants by name, email, phone, city, or occupation..."
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
                  setVerificationFilter('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
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
                <FiGrid className="text-sm" />
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
        {selectedTenants.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedTenants.length}</span> tenant(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={actionLoading === 'activate'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'activate' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Activate All
              </button>
              <button
                onClick={() => handleBulkAction('block')}
                disabled={actionLoading === 'block'}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'block' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiLock className="text-[10px]" />}
                Block All
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button
                onClick={() => setSelectedTenants([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tenants Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedTenants.map((tenant, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
                active: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
                blocked: 'bg-gray-100 text-gray-600 border-gray-200'
              };

              const isSelected = selectedTenants.includes(tenant.id);
              const isPending = tenant.status === 'pending';
              const fullyVerified = tenant.verification.mobile === 'verified' && tenant.verification.email === 'verified';

              return (
                <div
                  key={tenant.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    isPending ? 'border-l-4 border-l-amber-500' :
                    tenant.status === 'active' ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTenant(tenant.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {tenant.avatar}
                        </div>
                        {fullyVerified && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <FaCheck className="text-white text-[7px]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{tenant.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap inline-flex items-center gap-1 ${statusColors[tenant.status]}`}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                          {tenant.verification.kyc === 'verified' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap bg-[#E8F8F5] text-[#00695C]">
                              KYC OK
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      onClick={() => handleViewTenant(tenant)}
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{tenant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{tenant.city}, {tenant.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiBriefcase className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{tenant.occupation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{tenant.propertyPreference}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Registered {new Date(tenant.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Verification Quick Status */}
                  <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {[
                      { key: 'mobile', label: 'Mobile' },
                      { key: 'email', label: 'Email' },
                      { key: 'kyc', label: 'KYC' },
                    ].map(item => (
                      <div key={item.key} className="text-center">
                        <div className={`text-xs ${tenant.verification[item.key] === 'verified' ? 'text-[#00695C]' : 'text-[#B5C9C5]'}`}>
                          {tenant.verification[item.key] === 'verified' ? <FiCheckCircle /> : <FiXCircle />}
                        </div>
                        <p className="text-[7px] text-[#5A7D78] uppercase">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{tenant.familySize}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Family</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{tenant.activeLeases}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Leases</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">₹{Math.floor(tenant.monthlyBudget / 1000)}K</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Budget</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => requestConfirm(tenant.id, 'activate')}
                          disabled={actionLoading === 'activate'}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F8F5] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === 'activate' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                          Activate
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditTenant(tenant)}
                          className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEdit className="text-[10px]" /> Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewTenant(tenant)}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEye className="text-[10px]" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditTenant(tenant)}
                          className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEdit className="text-[10px]" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => requestConfirm(tenant.id, tenant.status === 'blocked' ? 'unblock' : 'block')}
                          disabled={actionLoading === `block_${tenant.id}`}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                            tenant.status === 'blocked'
                              ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]'
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {actionLoading === `block_${tenant.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : tenant.status === 'blocked' ? (
                            <FiUnlock className="text-[10px]" />
                          ) : (
                            <FiLock className="text-[10px]" />
                          )}
                          {tenant.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="mt-1.5 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleViewTenantProfile(tenant.id)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#167A54] bg-[#E7F6EF] border border-[#BEE4D2] rounded-xl hover:bg-[#D5EFE0] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                    >
                      <FiExternalLink className="text-[10px]" /> Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => requestConfirm(tenant.id, 'delete')}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                    >
                      <FiTrash2 className="text-[10px]" /> Delete
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
                  checked={selectedTenants.length === paginatedTenants.length && paginatedTenants.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Tenant</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">KYC</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Occupation</div>
              <div className="col-span-1 text-center">Phone</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('familySize')}>
                Family {sortField === 'familySize' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('monthlyBudget')}>
                Budget {sortField === 'monthlyBudget' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('registrationDate')}>
                Registered {sortField === 'registrationDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedTenants.map((tenant, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700',
                active: 'bg-[#E8F8F5] text-[#00695C]',
                blocked: 'bg-gray-100 text-gray-600'
              };

              const isSelected = selectedTenants.includes(tenant.id);
              const isPending = tenant.status === 'pending';
              const fullyVerified = tenant.verification.mobile === 'verified' && tenant.verification.email === 'verified';

              return (
                <div
                  key={tenant.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''} ${isPending ? 'bg-amber-50/30' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectTenant(tenant.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {tenant.avatar}
                      </div>
                      {fullyVerified && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{tenant.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{tenant.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[tenant.status]}`}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1">
                    {tenant.verification.kyc === 'verified' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E8F8F5] text-[#00695C]">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#B5C9C5]">—</span>
                    )}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{tenant.city}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{tenant.occupation}</div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{tenant.phone}</div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A]">{tenant.familySize}</p>
                  </div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A]">₹{Math.floor(tenant.monthlyBudget / 1000)}K</p>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(tenant.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {isPending ? (
                      <button
                        type="button"
                        onClick={() => requestConfirm(tenant.id, 'activate')}
                        disabled={actionLoading === 'activate'}
                        className="w-7 h-7 rounded-lg hover:bg-[#E8F8F5] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 disabled:opacity-50"
                        title="Activate"
                      >
                        {actionLoading === 'activate' ? <FiRefreshCw className="text-xs animate-spin" /> : <FiCheckCircle className="text-xs" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => requestConfirm(tenant.id, tenant.status === 'blocked' ? 'unblock' : 'block')}
                        disabled={actionLoading === `block_${tenant.id}`}
                        className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                          tenant.status === 'blocked' ? 'text-[#00695C] hover:bg-[#E8F8F5]' : 'text-red-500 hover:bg-red-50'
                        }`}
                        title={tenant.status === 'blocked' ? 'Unblock' : 'Block'}
                      >
                        {actionLoading === `block_${tenant.id}` ? (
                          <FiRefreshCw className="text-xs animate-spin" />
                        ) : tenant.status === 'blocked' ? (
                          <FiUnlock className="text-xs" />
                        ) : (
                          <FiLock className="text-xs" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleViewTenant(tenant)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditTenant(tenant)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestConfirm(tenant.id, 'delete')}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110"
                      title="Delete"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedTenants.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUserPlus className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No tenants found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No tenants match your current view'}
            </p>
            {filterCount > 0 ? (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105"
              >
                Clear All Filters
              </button>
            ) : (
              <button
                onClick={handleAddTenant}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105 flex items-center gap-2"
              >
                <FiPlus className="text-sm" /> Add Tenant
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
              {Math.min(currentPage * pageSize, filteredTenants.length)} of{' '}
              {filteredTenants.length} tenants
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
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
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
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

export default TenantRegistration;