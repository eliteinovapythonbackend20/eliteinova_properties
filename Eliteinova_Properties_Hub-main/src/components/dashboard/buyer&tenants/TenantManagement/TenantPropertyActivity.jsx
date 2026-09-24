// src/components/dashboard/admin/buyer&tenants/TenantManagement/TenantPropertyActivity.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiEye, FiHeart, FiBookmark, FiMessageSquare, FiMapPin,
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiRefreshCw, FiDownload, FiGrid, FiList, FiX, FiClock,
  FiCheckCircle, FiXCircle, FiHome, FiDollarSign, FiUser,
  FiTag, FiInfo, FiAlertTriangle, FiExternalLink, FiUserPlus,
  FiEdit, FiTrash2, FiLock, FiUnlock, FiUsers, FiActivity,
  FiCalendar, FiMail, FiPhone, FiBriefcase, FiShield,
  FiMoreVertical, FiFilter, FiUserCheck, FiUserX,
  FiGlobe, FiSave, FiSliders, FiFileText, FiClipboard
} from 'react-icons/fi';
import { FaCheck, FaStar, FaRegStar, FaBuilding, FaRegCalendarAlt, FaIdCard, FaFileAlt, FaCertificate, FaShieldAlt } from 'react-icons/fa';

// ============================================================
// STANDALONE COMPONENTS
// ============================================================

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

// ============ STAT CARD ============
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

// ============ BLOCK CONFIRM MODAL ============
const BlockConfirmModal = ({ show, tenantName, isBlocking, onCancel, onConfirm, actionLoading }) => {
  if (!show) return null;
  const Icon = isBlocking ? FiLock : FiUnlock;
  const color = isBlocking ? 'red' : 'emerald';
  const title = isBlocking ? 'Block Tenant' : 'Unblock Tenant';
  const message = isBlocking
    ? `Are you sure you want to block ${tenantName}? They will lose access to the platform.`
    : `Are you sure you want to unblock ${tenantName}? They will regain access to the platform.`;

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
const DeleteConfirmModal = ({ show, tenantName, onCancel, onConfirm, actionLoading }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="text-3xl text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">Delete Tenant Profile</h3>
          <p className="text-sm text-[#5A7D78] mt-2">
            Are you sure you want to delete <span className="font-semibold text-[#1A2E2A]">{tenantName}</span>'s profile? This action cannot be undone.
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

// ==========================================================
// CUSTOM EDIT ACTIVITY MODAL (Simple version for this page)
// ==========================================================
const EditActivityModal = ({ tenant, show, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!show || !tenant) {
      setFormData(null);
      return;
    }
    // Initialize form with tenant activity data
    setFormData({
      viewedProperties: tenant.activity?.viewedProperties || 0,
      savedProperties: tenant.activity?.savedProperties || 0,
      wishlist: tenant.activity?.wishlist || 0,
      rentalEnquiries: tenant.activity?.rentalEnquiries || 0,
      rentalRequests: tenant.activity?.rentalRequests || 0,
      siteVisits: tenant.activity?.siteVisits || 0,
      applications: tenant.activity?.applications || 0,
      leaseRequests: tenant.activity?.leaseRequests || 0,
      leadHistory: tenant.activity?.leadHistory || 0,
    });
  }, [tenant, show]);

  if (!show || !formData || !tenant) return null;

  const handleChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [key]: numValue < 0 ? 0 : numValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;
    onSave(formData);
  };

  const activityFields = [
    { key: 'viewedProperties', label: 'Viewed Properties', icon: <FiEye className="text-sm" />, color: 'bg-blue-50 text-blue-600' },
    { key: 'savedProperties', label: 'Saved Properties', icon: <FiBookmark className="text-sm" />, color: 'bg-purple-50 text-purple-600' },
    { key: 'wishlist', label: 'Wishlist', icon: <FiHeart className="text-sm" />, color: 'bg-red-50 text-red-600' },
    { key: 'rentalEnquiries', label: 'Rental Enquiries', icon: <FiMessageSquare className="text-sm" />, color: 'bg-indigo-50 text-indigo-600' },
    { key: 'rentalRequests', label: 'Rental Requests', icon: <FiHome className="text-sm" />, color: 'bg-amber-50 text-amber-600' },
    { key: 'siteVisits', label: 'Site Visits', icon: <FiMapPin className="text-sm" />, color: 'bg-emerald-50 text-emerald-600' },
    { key: 'applications', label: 'Applications', icon: <FiFileText className="text-sm" />, color: 'bg-cyan-50 text-cyan-600' },
    { key: 'leaseRequests', label: 'Lease Requests', icon: <FiClipboard className="text-sm" />, color: 'bg-rose-50 text-rose-600' },
    { key: 'leadHistory', label: 'Lead History', icon: <FiClock className="text-sm" />, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiSliders className="text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Edit Activity</h2>
              <p className="text-white/80 text-sm">{tenant.personal.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="edit-activity-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {activityFields.map(field => (
                <div key={field.key} className="flex items-center gap-3 p-3 bg-[#F8FAF9] rounded-xl border border-[#E8F0EE] hover:border-[#00695C]/30 transition-all duration-300">
                  <div className={`w-9 h-9 rounded-xl ${field.color} flex items-center justify-center shrink-0`}>
                    {field.icon}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-[#5A7D78] block">{field.label}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-transparent border-0 outline-none text-sm font-semibold text-[#1A2E2A] focus:ring-0 p-0"
                    />
                  </div>
                  <div className="text-[10px] text-[#B5C9C5] font-medium">count</div>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" form="edit-activity-form" className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] flex items-center justify-center gap-2">
              <FiSave className="text-sm" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW PROFILE MODAL (READ-ONLY)
// ============================================================
const ViewProfileModal = ({ tenant, show, onClose, onEdit, onDelete, onBlock, onViewFullProfile, actionLoading }) => {
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => { setActiveTab('personal'); }, [tenant?.id]);

  if (!tenant || !show) return null;

  const isBlocked = tenant.status === 'blocked';

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'contact', label: 'Contact' },
    { id: 'activity', label: 'Activity' },
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

  const ActivityRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: 'var(--bpm-border)' }}>
      <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--bpm-muted)' }}>
        <span style={{ color: 'var(--bpm-accent)' }}>{icon}</span>{label}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--bpm-accent)' }}>{value}</span>
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
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Tenant Profile</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white">
              <FiX className="text-base" />
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{tenant.personal.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{tenant.location.city}, {tenant.location.state}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              tenant.status === 'active' ? 'bg-white text-emerald-700' :
              tenant.status === 'blocked' ? 'bg-white/20 text-white' : 'bg-white text-amber-700'
            }`}>
              {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
            </span>
            {tenant.kycStatus === 'verified' && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
                <FaCheck className="text-[10px]" /> KYC Verified
              </span>
            )}
           
          </div>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-2xl"
              style={{ inset: '4px', background: 'var(--bpm-surface)', color: 'var(--bpm-accent)', border: '3px solid var(--bpm-bg)' }}
            >
              {tenant.avatar}
            </div>
          </div>
        </div>

        {/* View Full Profile Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewFullProfile && onViewFullProfile(tenant)}
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
              <Row icon={<FiUser />} label="Full Name" value={tenant.personal.name} />
              <Row icon={<FiCalendar />} label="Date of Birth" value={tenant.personal.dob} />
              <Row icon={<FiUsers />} label="Gender" value={tenant.personal.gender} />
              <Row icon={<FiUser />} label="Marital Status" value={tenant.personal.maritalStatus} />
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--bpm-muted)' }}>Location</p>
                <Row icon={<FiMapPin />} label="City" value={tenant.location.city} />
                <Row icon={<FiMapPin />} label="State" value={tenant.location.state} />
                <Row icon={<FiHome />} label="Address" value={tenant.location.address} />
                <Row icon={<FiTag />} label="Pincode" value={tenant.location.pincode} />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              <Row icon={<FiMail />} label="Email" value={tenant.contact.email} verified={tenant.contact.verification.email} />
              <Row icon={<FiPhone />} label="Phone" value={tenant.contact.phone} verified={tenant.contact.verification.phone} />
              <Row icon={<FiPhone />} label="Alternate Phone" value={tenant.contact.altPhone} />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-1">
              <ActivityRow icon={<FiEye />} label="Viewed Properties" value={tenant.activity?.viewedProperties || 0} />
              <ActivityRow icon={<FiBookmark />} label="Saved Properties" value={tenant.activity?.savedProperties || 0} />
              <ActivityRow icon={<FiHeart />} label="Wishlist" value={tenant.activity?.wishlist || 0} />
              <ActivityRow icon={<FiMessageSquare />} label="Rental Enquiries" value={tenant.activity?.rentalEnquiries || 0} />
              <ActivityRow icon={<FiHome />} label="Rental Requests" value={tenant.activity?.rentalRequests || 0} />
              <ActivityRow icon={<FiMapPin />} label="Site Visits" value={tenant.activity?.siteVisits || 0} />
              <ActivityRow icon={<FiFileText />} label="Applications" value={tenant.activity?.applications || 0} />
              <ActivityRow icon={<FiClipboard />} label="Lease Requests" value={tenant.activity?.leaseRequests || 0} />
              <ActivityRow icon={<FiClock />} label="Lead History" value={tenant.activity?.leadHistory || 0} />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t flex items-center gap-2 shrink-0" style={{ borderColor: 'var(--bpm-border)', background: 'var(--bpm-surface)' }}>
          <button
            onClick={() => onDelete && onDelete(tenant.id)}
            disabled={actionLoading === `delete_${tenant.id}`}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{ background: 'var(--bpm-danger-bg)', color: 'var(--bpm-danger)' }}
          >
            {actionLoading === `delete_${tenant.id}` ? <FiRefreshCw className="animate-spin text-xs" /> : <FiTrash2 className="text-xs" />}
            Delete
          </button>
          <button
            onClick={() => onBlock && onBlock(tenant.id)}
            disabled={actionLoading === `block_${tenant.id}`}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            style={{
              background: isBlocked ? 'var(--bpm-success-bg)' : 'var(--bpm-danger-bg)',
              color: isBlocked ? 'var(--bpm-success)' : 'var(--bpm-danger)'
            }}
          >
            {actionLoading === `block_${tenant.id}` ? <FiRefreshCw className="animate-spin text-xs" /> : isBlocked ? <FiUnlock className="text-xs" /> : <FiLock className="text-xs" />}
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
// MAIN COMPONENT
// ============================================================

const TenantPropertyActivity = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(null);
  const [isBlockingAction, setIsBlockingAction] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    blocked: 0
  });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ MOCK DATA WITH ACTIVITY ============
  const generateMockTenants = useCallback(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Rao', 'Shetty', 'Agarwal', 'Desai'];
    const cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Coimbatore', 'Madurai'];
    const stateByCity = { Chennai: 'Tamil Nadu', Coimbatore: 'Tamil Nadu', Madurai: 'Tamil Nadu', Mumbai: 'Maharashtra', Pune: 'Maharashtra', Delhi: 'Delhi', Bangalore: 'Karnataka', Hyderabad: 'Telangana' };
    const statuses = ['pending', 'active', 'blocked'];
    const kycStatuses = ['pending', 'verified', 'rejected'];
    const requirements = ['Rent', 'Lease', 'Both'];
    const occupations = ['Software Engineer', 'Doctor', 'Business Owner', 'Bank Manager', 'Architect', 'Government Employee', 'Consultant'];
    const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Retired'];
    const budgetPairs = [['20L', '50L'], ['50L', '1Cr'], ['1Cr', '2Cr'], ['2Cr', '5Cr']];
    const localities = ['Anna Nagar', 'T Nagar', 'Velachery', 'Adyar', 'Whitefield', 'Koramangala', 'Bandra', 'Andheri', 'Gachibowli', 'Banjara Hills'];

    const tenants = [];
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
      const shuffledTypes = ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial', 'Farmhouse'].sort(() => Math.random() - 0.5).slice(0, propertyTypeCount);
      const localityCount = 1 + Math.floor(Math.random() * 2);
      const shuffledLocalities = [...localities].sort(() => Math.random() - 0.5).slice(0, localityCount);

      // Generate activity data for tenants
      const activity = {
        viewedProperties: Math.floor(Math.random() * 50) + 5,
        savedProperties: Math.floor(Math.random() * 25) + 2,
        wishlist: Math.floor(Math.random() * 20) + 1,
        rentalEnquiries: Math.floor(Math.random() * 15) + 1,
        rentalRequests: Math.floor(Math.random() * 10) + 1,
        siteVisits: Math.floor(Math.random() * 10) + 1,
        applications: Math.floor(Math.random() * 12) + 1,
        leaseRequests: Math.floor(Math.random() * 8) + 1,
        leadHistory: Math.floor(Math.random() * 30) + 1,
      };

      tenants.push({
        id: `tenant_${i}`,
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
          preferredChannel: ['Email', 'Phone Call', 'WhatsApp', 'SMS'][Math.floor(Math.random() * 4)],
          preferredTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
          language: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'][Math.floor(Math.random() * 6)],
          newsletter: Math.random() > 0.5,
        },
        activity,
        savedProperties: activity.savedProperties,
        viewedProperties: activity.viewedProperties,
        inquiries: activity.rentalEnquiries,
      });
    }

    const total = tenants.length;
    const active = tenants.filter(b => b.status === 'active').length;
    const pending = tenants.filter(b => b.status === 'pending').length;
    const blocked = tenants.filter(b => b.status === 'blocked').length;

    setStats({ total, active, pending, blocked });
    return tenants;
  }, []);

  useEffect(() => {
    const mockTenants = generateMockTenants();
    setTenants(mockTenants);
    setFilteredTenants(mockTenants);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockTenants]);

  // ============ FILTER ============
  const filterTenants = useCallback(() => {
    let filtered = [...tenants];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.personal.name.toLowerCase().includes(query) ||
        b.contact.email.toLowerCase().includes(query) ||
        b.contact.phone.includes(query) ||
        b.location.city.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(b => b.status === selectedStatus);
    }

    // Default sort by name
    filtered.sort((a, b) => a.personal.name.localeCompare(b.personal.name));

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (searchQuery) count++;
    setFilterCount(count);

    setFilteredTenants(filtered);
    setCurrentPage(1);
  }, [tenants, searchQuery, selectedStatus]);

  useEffect(() => { filterTenants(); }, [filterTenants]);

  const totalPages = Math.ceil(filteredTenants.length / pageSize);
  const paginatedTenants = useMemo(() =>
    filteredTenants.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  , [filteredTenants, currentPage, pageSize]);

  // ============ RECOMPUTE STATS HELPER ============
  const recomputeStats = (list) => {
    const total = list.length;
    const active = list.filter(b => b.status === 'active').length;
    const pending = list.filter(b => b.status === 'pending').length;
    const blocked = list.filter(b => b.status === 'blocked').length;
    setStats({ total, active, pending, blocked });
  };

  // ============ HANDLERS ============
  const handleBlockClick = useCallback((tenantId, isBlocking) => {
    setShowBlockConfirm(tenantId);
    setIsBlockingAction(isBlocking);
  }, []);

  const confirmBlock = useCallback(() => {
    const tenantId = showBlockConfirm;
    const isBlocking = isBlockingAction;
    setActionLoading(`block_${tenantId}`);
    setTimeout(() => {
      setTenants(prev => {
        const updated = prev.map(b => b.id === tenantId ? { ...b, status: isBlocking ? 'blocked' : 'active' } : b);
        recomputeStats(updated);
        const changed = updated.find(b => b.id === tenantId);
        showToast(`${changed?.personal.name} has been ${isBlocking ? 'blocked' : 'unblocked'}`, isBlocking ? 'warning' : 'success');
        setViewingTenant(prevView => (prevView && prevView.id === tenantId ? changed : prevView));
        return updated;
      });
      setShowBlockConfirm(null);
      setIsBlockingAction(false);
      setActionLoading(null);
    }, 600);
  }, [showBlockConfirm, isBlockingAction, showToast]);

  const handleDelete = useCallback((tenantId) => setShowDeleteConfirm(tenantId), []);

  const confirmDelete = useCallback(() => {
    const tenantId = showDeleteConfirm;
    setActionLoading(`delete_${tenantId}`);
    setTimeout(() => {
      setTenants(prev => {
        const target = prev.find(b => b.id === tenantId);
        const updated = prev.filter(b => b.id !== tenantId);
        recomputeStats(updated);
        showToast(`${target?.personal.name || 'Tenant'} profile has been deleted`, 'error');
        return updated;
      });
      setShowDeleteConfirm(null);
      setActionLoading(null);
    }, 600);
  }, [showDeleteConfirm, showToast]);

  const handleViewTenant = useCallback((tenant) => {
    setViewingTenant(tenant);
    setShowViewModal(true);
  }, []);

  const handleViewFullProfile = useCallback((tenant) => {
    navigate('/profile/customer');
    showToast(`Opening ${tenant.personal.name}'s full profile...`, 'info');
  }, [navigate, showToast]);

  // ============ EDIT HANDLERS ============
  const handleEditTenant = useCallback((tenant) => {
    setEditingTenant(tenant);
    setShowEditModal(true);
    if (showViewModal) {
      setShowViewModal(false);
    }
  }, [showViewModal]);

  const saveEdit = useCallback((updatedActivity) => {
    if (!editingTenant) return;

    setTenants(prev => {
      const updated = prev.map(b => b.id === editingTenant.id ? {
        ...b,
        activity: {
          ...b.activity,
          ...updatedActivity
        },
        savedProperties: updatedActivity.savedProperties || 0,
        viewedProperties: updatedActivity.viewedProperties || 0,
        inquiries: updatedActivity.rentalEnquiries || 0,
      } : b);
      recomputeStats(updated);
      return updated;
    });
    setShowEditModal(false);
    setEditingTenant(null);
    showToast('Activity updated successfully', 'success');
  }, [editingTenant, showToast]);

  const handleViewModalEdit = useCallback((tenant) => {
    handleEditTenant(tenant);
  }, [handleEditTenant]);

  const handleViewModalBlock = useCallback((id) => {
    const tenant = tenants.find(b => b.id === id);
    if (!tenant) return;
    handleBlockClick(id, tenant.status !== 'blocked');
  }, [tenants, handleBlockClick]);

  const handleViewModalDelete = useCallback((id) => {
    setShowViewModal(false);
    handleDelete(id);
  }, [handleDelete]);

  const handleViewModalFullProfile = useCallback((tenant) => {
    setShowViewModal(false);
    handleViewFullProfile(tenant);
  }, [handleViewFullProfile]);

  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSelectedStatus('all');
    } else if (['active', 'pending', 'blocked'].includes(filter)) {
      setSelectedStatus(filter);
    }
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockTenants = generateMockTenants();
      setTenants(mockTenants);
      setFilteredTenants(mockTenants);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Activity data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockTenants, showToast]);

  const handleExportTenants = useCallback(() => {
    if (filteredTenants.length === 0) {
      showToast('No profiles to export', 'warning');
      return;
    }
    const data = filteredTenants.map(b => ({
      Name: b.personal.name,
      Email: b.contact.email,
      Phone: b.contact.phone,
      City: b.location.city,
      Status: b.status,
      'Viewed Properties': b.activity.viewedProperties,
      'Saved Properties': b.activity.savedProperties,
      Wishlist: b.activity.wishlist,
      'Rental Enquiries': b.activity.rentalEnquiries,
      'Rental Requests': b.activity.rentalRequests,
      'Site Visits': b.activity.siteVisits,
      Applications: b.activity.applications,
      'Lease Requests': b.activity.leaseRequests,
      'Lead History': b.activity.leadHistory,
    }));
    const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tenant_activity_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredTenants.length} activity records exported successfully`, 'success');
  }, [filteredTenants, showToast]);

  // ============ GET ACTIVITY SUMMARY ============
  const getActivitySummary = (tenant) => {
    const { activity } = tenant;
    const items = [
      { key: 'viewedProperties', label: 'Viewed', icon: <FiEye className="text-[10px]" />, value: activity.viewedProperties },
      { key: 'savedProperties', label: 'Saved', icon: <FiBookmark className="text-[10px]" />, value: activity.savedProperties },
      { key: 'wishlist', label: 'Wishlist', icon: <FiHeart className="text-[10px]" />, value: activity.wishlist },
      { key: 'rentalEnquiries', label: 'Enquiries', icon: <FiMessageSquare className="text-[10px]" />, value: activity.rentalEnquiries },
      { key: 'rentalRequests', label: 'Requests', icon: <FiHome className="text-[10px]" />, value: activity.rentalRequests },
      { key: 'siteVisits', label: 'Visits', icon: <FiMapPin className="text-[10px]" />, value: activity.siteVisits },
      { key: 'applications', label: 'Applications', icon: <FiFileText className="text-[10px]" />, value: activity.applications },
      { key: 'leaseRequests', label: 'Leases', icon: <FiClipboard className="text-[10px]" />, value: activity.leaseRequests },
      { key: 'leadHistory', label: 'Leads', icon: <FiClock className="text-[10px]" />, value: activity.leadHistory },
    ];
    return items;
  };

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} />

      {/* VIEW MODAL */}
      <ViewProfileModal
        tenant={viewingTenant}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingTenant(null); }}
        onBlock={handleViewModalBlock}
        onEdit={handleViewModalEdit}
        onDelete={handleViewModalDelete}
        onViewFullProfile={handleViewModalFullProfile}
      />

      {/* EDIT ACTIVITY MODAL - Custom for this page */}
      <EditActivityModal
        tenant={editingTenant}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingTenant(null); }}
        onSave={saveEdit}
      />

      <DeleteConfirmModal
        show={!!showDeleteConfirm}
        tenantName={tenants.find(b => b.id === showDeleteConfirm)?.personal.name || ''}
        onCancel={() => setShowDeleteConfirm(null)}
        onConfirm={confirmDelete}
        actionLoading={actionLoading === `delete_${showDeleteConfirm}`}
      />

      <BlockConfirmModal
        show={!!showBlockConfirm}
        tenantName={tenants.find(b => b.id === showBlockConfirm)?.personal.name || ''}
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
                Tenant Property Activity
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredTenants.length} Tenants
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">{filterCount} filters</span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track tenant engagement: viewed properties, saved, wishlist, rental enquiries &amp; more</span>
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportTenants}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" /><span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats - Only Total, Active, Pending, Blocked */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-green/400 rounded-3xl p-4 border border-[#d8f4ec] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard 
                icon={<FiUsers className="text-white text-sm" />} 
                title="Total Tenants" 
                value={stats.total} 
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" 
                delay={0} 
                isActive={activeFilter === 'all'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('all')} 
              />
              <StatCard 
                icon={<FiUserCheck className="text-white text-sm" />} 
                title="Active" 
                value={stats.active} 
                color="bg-gradient-to-br from-emerald-600 to-emerald-400" 
                delay={100} 
                isActive={activeFilter === 'active'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('active')} 
              />
              <StatCard 
                icon={<FiClock className="text-white text-sm" />} 
                title="Pending" 
                value={stats.pending} 
                color="bg-gradient-to-br from-amber-600 to-amber-400" 
                delay={200} 
                isActive={activeFilter === 'pending'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('pending')} 
              />
              <StatCard 
                icon={<FiLock className="text-white text-sm" />} 
                title="Blocked" 
                value={stats.blocked} 
                color="bg-gradient-to-br from-red-600 to-red-400" 
                delay={300} 
                isActive={activeFilter === 'blocked'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('blocked')} 
              />
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
              placeholder="Search tenants by name, email, phone, or city..."
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
            {paginatedTenants.map((tenant, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
                active: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
                blocked: 'bg-gray-100 text-gray-600 border-gray-200'
              };
              const isPending = tenant.status === 'pending';
              const isActive = tenant.status === 'active';
              const showVerifiedBadge = tenant.kycStatus === 'verified' && tenant.status !== 'blocked';
              const activityItems = getActivitySummary(tenant);
              const topActivities = [...activityItems]
                .sort((a, b) => b.value - a.value)
                .slice(0, 4);

              return (
                <div
                  key={tenant.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${
                    isPending ? 'border-l-4 border-l-amber-500' : isActive ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {tenant.avatar}
                        </div>
                        {showVerifiedBadge && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <FaCheck className="text-white text-[7px]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{tenant.personal.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[tenant.status]}`}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </span>
                         
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

                  {/* Activity Summary */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {topActivities.map(item => (
                      <div key={item.key} className="flex items-center gap-1.5 bg-[#F5F9F8] rounded-lg px-2 py-1.5">
                        <span className="text-[#00695C]">{item.icon}</span>
                        <div>
                          <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">{item.label}</p>
                          <p className="text-xs font-bold text-[#1A2E2A]">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button type="button" onClick={() => handleViewTenant(tenant)} className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBlockClick(tenant.id, tenant.status !== 'blocked')}
                      disabled={actionLoading === `block_${tenant.id}`}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                        tenant.status === 'blocked' ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]' : 'text-red-600 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      {actionLoading === `block_${tenant.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : tenant.status === 'blocked' ? <FiUnlock className="text-[10px]" /> : <FiLock className="text-[10px]" />}
                      {tenant.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tenant.id)}
                      disabled={actionLoading === `delete_${tenant.id}`}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${tenant.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>

                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleViewFullProfile(tenant)}
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
              <div className="col-span-2">Tenant</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Viewed</div>
              <div className="col-span-1">Saved</div>
              <div className="col-span-1">Wishlist</div>
              <div className="col-span-1">Enquiries</div>
              <div className="col-span-1">Requests</div>
              <div className="col-span-1">Visits</div>
              <div className="col-span-1">Applications</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedTenants.map((tenant, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700',
                active: 'bg-[#E8F8F5] text-[#00695C]',
                blocked: 'bg-gray-100 text-gray-600'
              };
              return (
                <div key={tenant.id} className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${tenant.status === 'pending' ? 'bg-amber-50/30' : ''}`} style={{ animationDelay: `${index * 30}ms` }}>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {tenant.avatar}
                      </div>
                      {tenant.kycStatus === 'verified' && tenant.status !== 'blocked' && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1A2E2A] truncate">{tenant.personal.name}</p>
                      <p className="text-[10px] text-[#5A7D78] truncate">{tenant.contact.email}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[tenant.status]}`}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.viewedProperties}</div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.savedProperties}</div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.wishlist}</div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.rentalEnquiries}</div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.rentalRequests}</div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.siteVisits}</div>
                  <div className="col-span-1 text-sm font-medium text-[#1A2E2A]">{tenant.activity.applications}</div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button type="button" onClick={() => handleViewTenant(tenant)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110" title="View">
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBlockClick(tenant.id, tenant.status !== 'blocked')}
                      disabled={actionLoading === `block_${tenant.id}`}
                      className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${tenant.status === 'blocked' ? 'text-[#00695C] hover:bg-[#E8F8F5]' : 'text-red-500 hover:bg-red-50'}`}
                      title={tenant.status === 'blocked' ? 'Unblock' : 'Block'}
                    >
                      {actionLoading === `block_${tenant.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : tenant.status === 'blocked' ? <FiUnlock className="text-xs" /> : <FiLock className="text-xs" />}
                    </button>
                    <button type="button" onClick={() => handleDelete(tenant.id)} disabled={actionLoading === `delete_${tenant.id}`} className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50" title="Delete">
                      {actionLoading === `delete_${tenant.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
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
              <FiActivity className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No activity data found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No tenant activity matches your current view'}
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTenants.length)} of {filteredTenants.length} tenants
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

export default TenantPropertyActivity;