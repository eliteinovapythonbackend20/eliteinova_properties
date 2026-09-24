// src/components/dashboard/admin/BuyerManagement/BuyerRegistration.jsx

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
  FiPrinter, FiCopy, FiShare, FiSettings, FiAward, FiBriefcase, FiHome, FiDollarSign,
  FiMaximize, FiMinimize, FiTag, FiSquare
} from 'react-icons/fi';
import {
  FaBuilding, FaUserTie, FaUserCog, FaUsers,
  FaCheck, FaTimes, FaStar as FaStarSolid,
  FaUserCircle, FaStore, FaHome as FaHomeSolid, FaBriefcase as FaBriefcaseSolid,
  FaCertificate, FaShieldAlt, FaRocket, FaCrown, FaMedal,
  FaUserGraduate, FaUserMd, FaUserSecret, FaIdCard, FaFileAlt,
  FaRegBuilding
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlinePerson } from 'react-icons/md';
import { HiOutlineBuildingOffice, HiOutlineUserGroup } from 'react-icons/hi2';

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
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
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

// ============ VIEW BUYER MODAL ============
const ViewBuyerModal = ({ buyer, show, actionLoading, onClose, onActivate, onBlock, onEdit, onDelete, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [buyer?.id]);

  if (!buyer || !show) return null;

  const isBlocked = buyer.status === 'blocked';
  const isActive = buyer.status === 'active';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contact', label: 'Contact' },
    { id: 'kyc', label: 'KYC' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="buyer-view-modal w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[28px] shadow-2xl animate-slide-up flex flex-col"
        style={{ background: 'var(--bvm-bg)', color: 'var(--bvm-text)', border: '1px solid var(--bvm-border)' }}
      >
        {/* Hero */}
        <div
          className="relative px-6 pt-6 pb-14 shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--bvm-accent), var(--bvm-accent-2))' }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Buyer Profile</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
            >
              <FiX className="text-base" />
            </button>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{buyer.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{buyer.city}, {buyer.state}</p>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              buyer.status === 'active' ? 'bg-white text-emerald-700' :
              buyer.status === 'blocked' ? 'bg-white/20 text-white' :
              'bg-white text-amber-700'
            }`}>
              {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
            </span>
            {buyer.kycStatus === 'verified' && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
                <FaCheck className="text-[10px]" /> KYC Verified
              </span>
            )}
            {buyer.verification?.email && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
                <FiMail className="text-[10px]" /> Email Verified
              </span>
            )}
            {buyer.verification?.phone && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
                <FiPhone className="text-[10px]" /> Phone Verified
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-2xl"
              style={{ inset: '4px', background: 'var(--bvm-surface)', color: 'var(--bvm-accent)', border: '3px solid var(--bvm-bg)' }}
            >
              {buyer.avatar}
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewProfile && onViewProfile(buyer)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              background: 'var(--bvm-accent)', 
              color: 'var(--bvm-on-accent)',
              boxShadow: '0 4px 12px rgba(15, 107, 92, 0.3)'
            }}
          >
            <FiExternalLink className="text-sm" />
            View Full Profile
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
                background: activeTab === tab.id ? 'var(--bvm-accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--bvm-on-accent)' : 'var(--bvm-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {buyer.status === 'pending' && (
            <div
              className="rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-5"
              style={{ background: 'var(--bvm-warning-bg)', border: '1px solid var(--bvm-warning-border)' }}
            >
              <span className="text-xs font-medium flex items-center gap-2" style={{ color: 'var(--bvm-warning-text)' }}>
                <FiClock /> Awaiting activation
              </span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Interested In', value: buyer.interestedIn || 'N/A' },
                  { label: 'Budget', value: buyer.budget || 'N/A' },
                  { label: 'Joined', value: new Date(buyer.registrationDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3 text-center"
                    style={{ background: 'var(--bvm-surface)', border: '1px solid var(--bvm-border)' }}
                  >
                    <p className="text-xs font-bold truncate">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--bvm-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--bvm-border)' }}>
                <span style={{ color: 'var(--bvm-muted)' }}>Registered</span>
                <span className="font-medium">
                  {new Date(buyer.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {buyer.bio && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--bvm-muted)' }}>Bio</p>
                  <p
                    className="text-sm leading-relaxed pl-3"
                    style={{ borderLeft: '2px solid var(--bvm-accent-2)', color: 'var(--bvm-text-soft)' }}
                  >
                    {buyer.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              {[
                { icon: <FiMail />, label: 'Email', value: buyer.email, verified: buyer.verification?.email },
                { icon: <FiPhone />, label: 'Phone', value: buyer.phone, verified: buyer.verification?.phone },
                { icon: <FiMapPin />, label: 'Location', value: `${buyer.city}, ${buyer.state}` },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--bvm-border)' }}>
                  <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--bvm-muted)' }}>
                    <span style={{ color: 'var(--bvm-accent)' }}>{row.icon}</span>{row.label}
                  </span>
                  <span className="text-sm font-medium text-right flex items-center gap-1.5">
                    {row.value}
                    {row.verified !== undefined && (
                      row.verified
                        ? <FiCheckCircle style={{ color: 'var(--bvm-success)' }} className="text-xs" />
                        : <FiXCircle style={{ color: 'var(--bvm-muted)' }} className="text-xs" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--bvm-muted)' }}>KYC Status</p>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: buyer.kycStatus === 'verified' ? 'var(--bvm-success-bg)' : buyer.kycStatus === 'rejected' ? 'var(--bvm-danger-bg)' : 'var(--bvm-warning-bg)',
                    color: buyer.kycStatus === 'verified' ? 'var(--bvm-success)' : buyer.kycStatus === 'rejected' ? 'var(--bvm-danger)' : 'var(--bvm-warning-text)'
                  }}
                >
                  {buyer.kycStatus.charAt(0).toUpperCase() + buyer.kycStatus.slice(1)}
                </span>
              </div>
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
                      background: buyer.kyc?.[item.key] ? 'var(--bvm-success-bg)' : 'var(--bvm-surface)',
                      border: `1px solid ${buyer.kyc?.[item.key] ? 'var(--bvm-success-border)' : 'var(--bvm-border)'}`
                    }}
                  >
                    {buyer.kyc?.[item.key]
                      ? <FiCheckCircle style={{ color: 'var(--bvm-success)' }} />
                      : <FiXCircle style={{ color: 'var(--bvm-muted)' }} />}
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="px-6 py-4 border-t flex items-center gap-2 shrink-0"
          style={{ borderColor: 'var(--bvm-border)', background: 'var(--bvm-surface)' }}
        >
          {buyer.status === 'pending' ? (
            <button
              onClick={() => onActivate(buyer.id)}
              disabled={actionLoading === buyer.id}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
              style={{ background: 'var(--bvm-success)', color: 'var(--bvm-on-accent)' }}
            >
              {actionLoading === buyer.id ? <FiRefreshCw className="animate-spin text-xs" /> : <FiCheckCircle className="text-xs" />}
              Activate
            </button>
          ) : (
            <>
              <button
                onClick={() => onEdit(buyer)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'var(--bvm-accent)', color: 'var(--bvm-on-accent)' }}
              >
                <FiEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={() => onDelete(buyer.id)}
                disabled={actionLoading === `delete_${buyer.id}`}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: 'var(--bvm-danger-bg)', color: 'var(--bvm-danger)' }}
              >
                {actionLoading === `delete_${buyer.id}` ? (
                  <FiRefreshCw className="animate-spin text-xs" />
                ) : (
                  <FiTrash2 className="text-xs" />
                )}
                Delete
              </button>
              <button
                onClick={() => onBlock(buyer.id)}
                disabled={actionLoading === `block_${buyer.id}`}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{
                  background: isBlocked ? 'var(--bvm-success-bg)' : 'var(--bvm-danger-bg)',
                  color: isBlocked ? 'var(--bvm-success)' : 'var(--bvm-danger)'
                }}
              >
                {actionLoading === `block_${buyer.id}` ? (
                  <FiRefreshCw className="animate-spin text-xs" />
                ) : isBlocked ? (
                  <FiUnlock className="text-xs" />
                ) : (
                  <FiLock className="text-xs" />
                )}
                {isBlocked ? 'Unblock' : 'Block'}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .buyer-view-modal {
          --bvm-bg: #FFFFFF;
          --bvm-surface: #F5F9F8;
          --bvm-border: #E5EEEB;
          --bvm-text: #12211D;
          --bvm-text-soft: #3E5C56;
          --bvm-muted: #6B8983;
          --bvm-accent: #0F6B5C;
          --bvm-accent-2: #2FAE9A;
          --bvm-on-accent: #FFFFFF;
          --bvm-success: #167A54;
          --bvm-success-bg: #E7F6EF;
          --bvm-success-border: #BEE4D2;
          --bvm-danger: #C0392B;
          --bvm-danger-bg: #FCEBE9;
          --bvm-warning-text: #92620C;
          --bvm-warning-bg: #FDF3DE;
          --bvm-warning-border: #F2DBA3;
        }
      `}</style>
    </div>
  );
};

// ============ ADD/EDIT BUYER MODAL ============
const BuyerFormModal = ({ buyer, show, onClose, onSave, mode = 'add' }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (show) {
      if (buyer && mode === 'edit') {
        setFormData({
          name: buyer.name,
          email: buyer.email,
          phone: buyer.phone,
          city: buyer.city,
          state: buyer.state,
          interestedIn: buyer.interestedIn || '',
          budget: buyer.budget || '',
          bio: buyer.bio || '',
          status: buyer.status || 'pending',
          kycStatus: buyer.kycStatus || 'pending',
          verification: {
            email: buyer.verification?.email || false,
            phone: buyer.verification?.phone || false,
          },
          kyc: {
            aadhaar: buyer.kyc?.aadhaar || false,
            pan: buyer.kyc?.pan || false,
            gst: buyer.kyc?.gst || false,
            rera: buyer.kyc?.rera || false,
          },
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          interestedIn: '',
          budget: '',
          bio: '',
          status: 'pending',
          kycStatus: 'pending',
          verification: { email: false, phone: false },
          kyc: { aadhaar: false, pan: false, gst: false, rera: false },
        });
      }
    }
  }, [buyer, show, mode]);

  if (!show || !formData) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerificationToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      verification: { ...prev.verification, [key]: !prev.verification[key] },
    }));
  };

  const handleKycToggle = (key) => {
    setFormData(prev => {
      const updatedKyc = { ...prev.kyc, [key]: !prev.kyc[key] };
      const allVerified = Object.values(updatedKyc).every(Boolean);
      let nextStatus = prev.kycStatus;
      if (allVerified) {
        nextStatus = 'verified';
      } else if (prev.kycStatus === 'verified') {
        nextStatus = 'pending';
      }
      return { ...prev, kyc: updatedKyc, kycStatus: nextStatus };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const verificationItems = [
    { key: 'email', label: 'Email', icon: <FiMail className="text-sm" /> },
    { key: 'phone', label: 'Phone', icon: <FiPhone className="text-sm" /> },
  ];

  const kycDocs = [
    { key: 'aadhaar', label: 'Aadhaar', icon: <FaIdCard className="text-sm" /> },
    { key: 'pan', label: 'PAN', icon: <FaFileAlt className="text-sm" /> },
    { key: 'gst', label: 'GST', icon: <FaCertificate className="text-sm" /> },
    { key: 'rera', label: 'RERA', icon: <FaShieldAlt className="text-sm" /> },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">{mode === 'add' ? 'Add New Buyer' : 'Edit Buyer'}</h2>
          <p className="text-white/80 text-sm">{mode === 'add' ? 'Register a new buyer' : 'Update buyer information'}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="buyer-form" onSubmit={handleSubmit} className="space-y-4">
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
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Interested In</label>
                <select
                  name="interestedIn"
                  value={formData.interestedIn}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="">Select</option>
                  <option value="Buying">Buying</option>
                  <option value="Renting">Renting</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Budget (₹)</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  placeholder="e.g. 50L - 1Cr"
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

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">KYC Status</label>
                <select
                  name="kycStatus"
                  value={formData.kycStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Verification Toggles */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-2">Email &amp; Phone Verification</label>
                <div className="grid grid-cols-2 gap-2">
                  {verificationItems.map(item => {
                    const isVerified = formData.verification[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleVerificationToggle(item.key)}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
                          isVerified
                            ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]'
                            : 'bg-[#F5F9F8] border-[#E8F0EE] text-[#5A7D78]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">{item.icon}{item.label}</span>
                        {isVerified ? <FiCheckCircle className="text-sm shrink-0" /> : <FiXCircle className="text-sm shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* KYC Documents */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-2">KYC Documents</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {kycDocs.map(item => {
                    const isVerified = formData.kyc[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleKycToggle(item.key)}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
                          isVerified
                            ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]'
                            : 'bg-[#F5F9F8] border-[#E8F0EE] text-[#5A7D78]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">{item.icon}{item.label}</span>
                        {isVerified ? <FiCheckCircle className="text-sm shrink-0" /> : <FiXCircle className="text-sm shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#5A7D78] mt-1.5">Tap a document to mark it verified / not verified.</p>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
                  placeholder="Brief description about the buyer"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
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
              form="buyer-form"
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              {mode === 'add' ? 'Add Buyer' : 'Save Changes'}
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
          <h3 className="text-xl font-bold text-[#1A2E2A]">Delete Buyer</h3>
          <p className="text-sm text-[#5A7D78] mt-2">
            Are you sure you want to delete <span className="font-semibold text-[#1A2E2A]">{buyerName}</span>? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
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

/* ============================================================
   MAIN COMPONENT
============================================================ */

const BuyerRegistration = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [selectedEmailVerification, setSelectedEmailVerification] = useState('all');
  const [selectedPhoneVerification, setSelectedPhoneVerification] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBuyers, setSelectedBuyers] = useState([]);
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

  // ============ STATS ============
  const [stats, setStats] = useState({
    totalBuyers: 0,
    active: 0,
    pending: 0,
    blocked: 0,
    verifiedKyc: 0,
    pendingKyc: 0,
    emailVerified: 0,
    phoneVerified: 0,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK BUYERS ============
  const generateMockBuyers = useCallback(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran', 'Mohan', 'Ritu', 'Gautam', 'Nisha', 'Tarun'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
    const statuses = ['pending', 'active', 'blocked'];
    const kycStatuses = ['pending', 'verified', 'rejected'];
    const interestedIn = ['Buying', 'Renting', 'Both'];
    const budgets = ['20L - 50L', '50L - 1Cr', '1Cr - 2Cr', '2Cr - 5Cr', '5Cr+'];

    const buyers = [];
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
      const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      const kyc = {
        aadhaar: Math.random() > 0.3,
        pan: Math.random() > 0.35,
        gst: Math.random() > 0.7,
        rera: Math.random() > 0.6,
      };

      const verification = {
        email: Math.random() > 0.25,
        phone: Math.random() > 0.3,
      };

      buyers.push({
        id: `buyer_${i}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        city: city,
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'][Math.floor(Math.random() * 8)],
        status: status,
        kycStatus: kycStatus,
        kyc: kyc,
        verification: verification,
        registrationDate: date.toISOString(),
        interestedIn: interestedIn[Math.floor(Math.random() * interestedIn.length)],
        budget: budgets[Math.floor(Math.random() * budgets.length)],
        avatar: firstName[0] + lastName[0],
        bio: `Interested in ${interestedIn[Math.floor(Math.random() * interestedIn.length)]} properties in ${city}.`,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
        savedProperties: Math.floor(Math.random() * 15),
        viewedProperties: Math.floor(Math.random() * 30),
        inquiries: Math.floor(Math.random() * 10),
      });
    }

    // Update stats
    const total = buyers.length;
    const active = buyers.filter(b => b.status === 'active').length;
    const pending = buyers.filter(b => b.status === 'pending').length;
    const blocked = buyers.filter(b => b.status === 'blocked').length;
    const verifiedKyc = buyers.filter(b => b.kycStatus === 'verified').length;
    const pendingKyc = buyers.filter(b => b.kycStatus === 'pending').length;
    const emailVerified = buyers.filter(b => b.verification.email).length;
    const phoneVerified = buyers.filter(b => b.verification.phone).length;

    setStats({
      totalBuyers: total,
      active,
      pending,
      blocked,
      verifiedKyc,
      pendingKyc,
      emailVerified,
      phoneVerified,
    });

    return buyers;
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockBuyers = generateMockBuyers();
    setBuyers(mockBuyers);
    setFilteredBuyers(mockBuyers);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockBuyers]);

  // ============ FILTER BUYERS ============
  const filterBuyers = useCallback(() => {
    let filtered = [...buyers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(buyer =>
        buyer.name.toLowerCase().includes(query) ||
        buyer.email.toLowerCase().includes(query) ||
        buyer.phone.includes(query) ||
        buyer.city.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(buyer => buyer.status === selectedStatus);
    }

    if (selectedVerification !== 'all') {
      filtered = filtered.filter(buyer => buyer.kycStatus === selectedVerification);
    }

    if (selectedEmailVerification !== 'all') {
      filtered = filtered.filter(buyer => buyer.verification.email === (selectedEmailVerification === 'verified'));
    }

    if (selectedPhoneVerification !== 'all') {
      filtered = filtered.filter(buyer => buyer.verification.phone === (selectedPhoneVerification === 'verified'));
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedVerification !== 'all') count++;
    if (selectedEmailVerification !== 'all') count++;
    if (selectedPhoneVerification !== 'all') count++;
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

    setFilteredBuyers(filtered);
    setCurrentPage(1);
  }, [buyers, searchQuery, selectedStatus, selectedVerification, selectedEmailVerification, selectedPhoneVerification, sortField, sortDirection]);

  useEffect(() => {
    filterBuyers();
  }, [filterBuyers]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredBuyers.length / pageSize);
  const paginatedBuyers = useMemo(() =>
    filteredBuyers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredBuyers, currentPage, pageSize]);

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
    if (selectedBuyers.length === paginatedBuyers.length) {
      setSelectedBuyers([]);
    } else {
      setSelectedBuyers(paginatedBuyers.map(buyer => buyer.id));
    }
  }, [selectedBuyers, paginatedBuyers]);

  // ============ HANDLE SELECT BUYER ============
  const handleSelectBuyer = useCallback((buyerId) => {
    setSelectedBuyers(prev =>
      prev.includes(buyerId)
        ? prev.filter(id => id !== buyerId)
        : [...prev, buyerId]
    );
  }, []);

  // ============ HANDLE ACTIVATE ============
  const handleActivate = useCallback((buyerId) => {
    setActionLoading(buyerId);
    setTimeout(() => {
      let updatedBuyers = [...buyers];
      let buyer = updatedBuyers.find(b => b.id === buyerId);
      if (buyer) {
        buyer = { ...buyer, status: 'active' };
        updatedBuyers = updatedBuyers.map(b => b.id === buyerId ? buyer : b);
        setBuyers(updatedBuyers);
        setStats(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          active: prev.active + 1,
        }));
        showToast(`${buyer.name} has been activated`, 'success');
        setViewingBuyer(prev => (prev && prev.id === buyerId ? buyer : prev));
      }
      setActionLoading(null);
    }, 600);
  }, [buyers, showToast]);

  // ============ HANDLE BLOCK/UNBLOCK WITH CONFIRM ============
  const handleBlockClick = useCallback((buyerId, isBlocking) => {
    const buyer = buyers.find(b => b.id === buyerId);
    if (!buyer) return;
    setShowBlockConfirm(buyerId);
    setIsBlockingAction(isBlocking);
  }, [buyers]);

  const confirmBlock = useCallback(() => {
    const buyerId = showBlockConfirm;
    const isBlocking = isBlockingAction;
    setActionLoading(`block_${buyerId}`);
    
    setTimeout(() => {
      let updatedBuyers = [...buyers];
      let buyer = updatedBuyers.find(b => b.id === buyerId);
      if (buyer) {
        if (isBlocking) {
          buyer = { ...buyer, status: 'blocked' };
          setStats(prev => ({
            ...prev,
            active: Math.max(0, prev.active - 1),
            blocked: prev.blocked + 1,
          }));
          showToast(`${buyer.name} has been blocked`, 'warning');
        } else {
          buyer = { ...buyer, status: 'active' };
          setStats(prev => ({
            ...prev,
            blocked: Math.max(0, prev.blocked - 1),
            active: prev.active + 1,
          }));
          showToast(`${buyer.name} has been unblocked`, 'success');
        }
        updatedBuyers = updatedBuyers.map(b => b.id === buyerId ? buyer : b);
        setBuyers(updatedBuyers);
        setViewingBuyer(prev => (prev && prev.id === buyerId ? buyer : prev));
      }
      setShowBlockConfirm(null);
      setIsBlockingAction(false);
      setActionLoading(null);
    }, 600);
  }, [showBlockConfirm, isBlockingAction, buyers, showToast]);

  // ============ HANDLE DELETE ============
  const handleDelete = useCallback((buyerId) => {
    setShowDeleteConfirm(buyerId);
  }, []);

  const confirmDelete = useCallback(() => {
    const buyerId = showDeleteConfirm;
    setActionLoading(`delete_${buyerId}`);
    const buyer = buyers.find(b => b.id === buyerId);
    
    setTimeout(() => {
      let updatedBuyers = buyers.filter(b => b.id !== buyerId);
      setBuyers(updatedBuyers);
      
      setStats(prev => ({
        totalBuyers: Math.max(0, prev.totalBuyers - 1),
        active: buyer?.status === 'active' ? Math.max(0, prev.active - 1) : prev.active,
        pending: buyer?.status === 'pending' ? Math.max(0, prev.pending - 1) : prev.pending,
        blocked: buyer?.status === 'blocked' ? Math.max(0, prev.blocked - 1) : prev.blocked,
        verifiedKyc: buyer?.kycStatus === 'verified' ? Math.max(0, prev.verifiedKyc - 1) : prev.verifiedKyc,
        pendingKyc: buyer?.kycStatus === 'pending' ? Math.max(0, prev.pendingKyc - 1) : prev.pendingKyc,
        emailVerified: buyer?.verification?.email ? Math.max(0, prev.emailVerified - 1) : prev.emailVerified,
        phoneVerified: buyer?.verification?.phone ? Math.max(0, prev.phoneVerified - 1) : prev.phoneVerified,
      }));
      
      setShowDeleteConfirm(null);
      setActionLoading(null);
      setSelectedBuyers(prev => prev.filter(id => id !== buyerId));
      showToast(`${buyer?.name || 'Buyer'} has been deleted`, 'error');
    }, 600);
  }, [showDeleteConfirm, buyers, showToast]);

  // ============ VIEW BUYER DETAIL ============
  const handleViewBuyer = useCallback((buyer) => {
    setViewingBuyer(buyer);
    setShowViewModal(true);
  }, []);

  // ============ VIEW BUYER PROFILE (Navigate to Customer) ============
  const handleViewProfile = useCallback((buyer) => {
    navigate('/profile/customer');
    showToast(`Opening ${buyer.name}'s profile...`, 'info');
  }, [navigate, showToast]);

  // ============ EDIT BUYER ============
  const handleEditBuyer = useCallback((buyer) => {
    setEditingBuyer(buyer);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const saveEdit = useCallback((updatedData) => {
    setBuyers(prev => {
      const updated = prev.map(buyer => {
        if (buyer.id !== editingBuyer.id) return buyer;
        return { ...buyer, ...updatedData };
      });

      // Recompute stats
      const total = updated.length;
      const active = updated.filter(b => b.status === 'active').length;
      const pending = updated.filter(b => b.status === 'pending').length;
      const blocked = updated.filter(b => b.status === 'blocked').length;
      const verifiedKyc = updated.filter(b => b.kycStatus === 'verified').length;
      const pendingKyc = updated.filter(b => b.kycStatus === 'pending').length;
      const emailVerified = updated.filter(b => b.verification.email).length;
      const phoneVerified = updated.filter(b => b.verification.phone).length;

      setStats({ totalBuyers: total, active, pending, blocked, verifiedKyc, pendingKyc, emailVerified, phoneVerified });
      return updated;
    });

    setShowEditModal(false);
    setEditingBuyer(null);
    showToast('Buyer updated successfully', 'success');
  }, [editingBuyer, showToast]);

  // ============ ADD BUYER ============
  const handleAddBuyer = useCallback((formData) => {
    const newBuyer = {
      id: `buyer_${Date.now()}`,
      ...formData,
      registrationDate: new Date().toISOString(),
      avatar: formData.name.split(' ').map(n => n[0]).join(''),
      savedProperties: 0,
      viewedProperties: 0,
      inquiries: 0,
      lastActive: new Date().toISOString(),
    };

    setBuyers(prev => {
      const updated = [newBuyer, ...prev];
      const total = updated.length;
      const active = updated.filter(b => b.status === 'active').length;
      const pending = updated.filter(b => b.status === 'pending').length;
      const blocked = updated.filter(b => b.status === 'blocked').length;
      const verifiedKyc = updated.filter(b => b.kycStatus === 'verified').length;
      const pendingKyc = updated.filter(b => b.kycStatus === 'pending').length;
      const emailVerified = updated.filter(b => b.verification.email).length;
      const phoneVerified = updated.filter(b => b.verification.phone).length;

      setStats({ totalBuyers: total, active, pending, blocked, verifiedKyc, pendingKyc, emailVerified, phoneVerified });
      return updated;
    });

    setShowAddModal(false);
    showToast('Buyer added successfully', 'success');
  }, [showToast]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSelectedStatus('all');
      setSelectedVerification('all');
      setSelectedEmailVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'active') {
      setSelectedStatus('active');
      setSelectedVerification('all');
      setSelectedEmailVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'pending') {
      setSelectedStatus('pending');
      setSelectedVerification('all');
      setSelectedEmailVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'blocked') {
      setSelectedStatus('blocked');
      setSelectedVerification('all');
      setSelectedEmailVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'kyc_verified') {
      setSelectedVerification('verified');
      setSelectedStatus('all');
      setSelectedEmailVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'kyc_pending') {
      setSelectedVerification('pending');
      setSelectedStatus('all');
      setSelectedEmailVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'email_verified') {
      setSelectedEmailVerification('verified');
      setSelectedStatus('all');
      setSelectedVerification('all');
      setSelectedPhoneVerification('all');
    } else if (filter === 'phone_verified') {
      setSelectedPhoneVerification('verified');
      setSelectedStatus('all');
      setSelectedVerification('all');
      setSelectedEmailVerification('all');
    }
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedVerification('all');
    setSelectedEmailVerification('all');
    setSelectedPhoneVerification('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockBuyers = generateMockBuyers();
      setBuyers(mockBuyers);
      setFilteredBuyers(mockBuyers);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockBuyers, showToast]);

  // ============ EXPORT BUYERS ============
  const handleExportBuyers = useCallback(() => {
    const data = filteredBuyers.map(buyer => ({
      Name: buyer.name,
      Email: buyer.email,
      Phone: buyer.phone,
      City: buyer.city,
      State: buyer.state,
      Status: buyer.status,
      'KYC Status': buyer.kycStatus,
      'Interested In': buyer.interestedIn,
      Budget: buyer.budget,
      'Email Verified': buyer.verification.email ? 'Yes' : 'No',
      'Phone Verified': buyer.verification.phone ? 'Yes' : 'No',
      'Saved Properties': buyer.savedProperties,
      'Viewed Properties': buyer.viewedProperties,
      Inquiries: buyer.inquiries,
      'Registration Date': new Date(buyer.registrationDate).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buyers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredBuyers.length} buyers exported successfully`, 'success');
  }, [filteredBuyers, showToast]);

  // ============ VIEW MODAL ACTION HANDLERS ============
  const handleViewModalActivate = useCallback((id) => {
    handleActivate(id);
  }, [handleActivate]);

  const handleViewModalBlock = useCallback((id) => {
    const buyer = buyers.find(b => b.id === id);
    if (!buyer) return;
    const isBlocking = buyer.status !== 'blocked';
    handleBlockClick(id, isBlocking);
  }, [buyers, handleBlockClick]);

  const handleViewModalEdit = useCallback(() => {
    if (!viewingBuyer) return;
    setShowViewModal(false);
    handleEditBuyer(viewingBuyer);
  }, [viewingBuyer, handleEditBuyer]);

  const handleViewModalDelete = useCallback((id) => {
    setShowViewModal(false);
    handleDelete(id);
  }, [handleDelete]);

  const handleViewModalViewProfile = useCallback((buyer) => {
    setShowViewModal(false);
    handleViewProfile(buyer);
  }, [handleViewProfile]);

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

      {/* View Modal */}
      <ViewBuyerModal
        buyer={viewingBuyer}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingBuyer(null); }}
        onActivate={handleViewModalActivate}
        onBlock={handleViewModalBlock}
        onEdit={handleViewModalEdit}
        onDelete={handleViewModalDelete}
        onViewProfile={handleViewModalViewProfile}
      />

      {/* Add Modal */}
      <BuyerFormModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddBuyer}
        mode="add"
      />

      {/* Edit Modal */}
      <BuyerFormModal
        buyer={editingBuyer}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingBuyer(null); }}
        onSave={saveEdit}
        mode="edit"
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        show={!!showDeleteConfirm}
        buyerName={buyers.find(b => b.id === showDeleteConfirm)?.name || ''}
        onCancel={() => { setShowDeleteConfirm(null); }}
        onConfirm={confirmDelete}
        actionLoading={actionLoading === `delete_${showDeleteConfirm}`}
      />

      {/* Block/Unblock Confirm Modal */}
      <BlockConfirmModal
        show={!!showBlockConfirm}
        buyerName={buyers.find(b => b.id === showBlockConfirm)?.name || ''}
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
                Buyer Registration
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredBuyers.length} Buyers
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage buyer registrations and profiles</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md hover:scale-105"
            >
              <FiUserPlus className="text-sm" />
              <span>Add Buyer</span>
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportBuyers}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Buyers"
                value={stats.totalBuyers}
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
              <StatCard
                icon={<FiShield className="text-white text-sm" />}
                title="KYC Verified"
                value={stats.verifiedKyc}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={400}
                isActive={activeFilter === 'kyc_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('kyc_verified')}
              />
              <StatCard
                icon={<FiAlertTriangle className="text-white text-sm" />}
                title="KYC Pending"
                value={stats.pendingKyc}
                color="bg-gradient-to-br from-rose-600 to-rose-400"
                delay={500}
                isActive={activeFilter === 'kyc_pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('kyc_pending')}
              />
              <StatCard
                icon={<FiMail className="text-white text-sm" />}
                title="Email Verified"
                value={stats.emailVerified}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={600}
                isActive={activeFilter === 'email_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('email_verified')}
              />
              <StatCard
                icon={<FiPhone className="text-white text-sm" />}
                title="Phone Verified"
                value={stats.phoneVerified}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={700}
                isActive={activeFilter === 'phone_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('phone_verified')}
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
              placeholder="Search buyers by name, email, phone, or city..."
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
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All KYC</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedEmailVerification}
                onChange={(e) => setSelectedEmailVerification(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Email</option>
                <option value="verified">Email Verified</option>
                <option value="pending">Email Not Verified</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedPhoneVerification}
                onChange={(e) => setSelectedPhoneVerification(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Phone</option>
                <option value="verified">Phone Verified</option>
                <option value="pending">Phone Not Verified</option>
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
      </div>

      {/* Buyers Grid/List */}
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

              const verificationColors = {
                verified: 'bg-[#E8F8F5] text-[#00695C]',
                pending: 'bg-[#FEF3E2] text-amber-700',
                rejected: 'bg-red-50 text-red-700'
              };

              const isSelected = selectedBuyers.includes(buyer.id);
              const isPending = buyer.status === 'pending';
              const isActive = buyer.status === 'active';
              const showVerifiedBadge = buyer.kycStatus === 'verified' && buyer.status !== 'blocked';

              return (
                <div
                  key={buyer.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    isPending ? 'border-l-4 border-l-amber-500' : 
                    isActive ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectBuyer(buyer.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
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
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{buyer.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap inline-flex items-center gap-1 ${statusColors[buyer.status]}`}>
                            {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${verificationColors[buyer.kycStatus]}`}>
                            KYC: {buyer.kycStatus.charAt(0).toUpperCase() + buyer.kycStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewBuyer(buyer)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{buyer.email}</span>
                      {buyer.verification.email && (
                        <FiCheckCircle className="text-[#00695C] text-[10px] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{buyer.phone}</span>
                      {buyer.verification.phone && (
                        <FiCheckCircle className="text-[#00695C] text-[10px] shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{buyer.city}, {buyer.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Joined {new Date(buyer.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{buyer.savedProperties}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Saved</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{buyer.viewedProperties}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Viewed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{buyer.inquiries}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Inquiries</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewBuyer(buyer)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditBuyer(buyer)}
                      className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    {buyer.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => handleActivate(buyer.id)}
                        disabled={actionLoading === buyer.id}
                        className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F8F5] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                      >
                        {actionLoading === buyer.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                        Activate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBlockClick(buyer.id, buyer.status !== 'blocked')}
                        disabled={actionLoading === `block_${buyer.id}`}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                          buyer.status === 'blocked'
                            ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]'
                            : 'text-red-600 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {actionLoading === `block_${buyer.id}` ? (
                          <FiRefreshCw className="text-[10px] animate-spin" />
                        ) : buyer.status === 'blocked' ? (
                          <FiUnlock className="text-[10px]" />
                        ) : (
                          <FiLock className="text-[10px]" />
                        )}
                        {buyer.status === 'blocked' ? 'Unblock' : 'Block'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(buyer.id)}
                      disabled={actionLoading === `delete_${buyer.id}`}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${buyer.id}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : (
                        <FiTrash2 className="text-[10px]" />
                      )}
                      Delete
                    </button>
                  </div>

                  {/* View Profile Button - Navigate to Customer */}
                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleViewProfile(buyer)}
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
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBuyers.length === paginatedBuyers.length && paginatedBuyers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Buyer</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">KYC</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Email</div>
              <div className="col-span-1 text-center">Phone</div>
              <div className="col-span-1 text-center">Interested</div>
              <div className="col-span-1 text-center">Budget</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('registrationDate')}>
                Joined {sortField === 'registrationDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedBuyers.map((buyer, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700',
                active: 'bg-[#E8F8F5] text-[#00695C]',
                blocked: 'bg-gray-100 text-gray-600'
              };

              const verificationColors = {
                verified: 'bg-[#E8F8F5] text-[#00695C]',
                pending: 'bg-[#FEF3E2] text-amber-700',
                rejected: 'bg-red-50 text-red-700'
              };

              const isSelected = selectedBuyers.includes(buyer.id);

              return (
                <div
                  key={buyer.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''} ${buyer.status === 'pending' ? 'bg-amber-50/30' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectBuyer(buyer.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {buyer.avatar}
                      </div>
                      {buyer.kycStatus === 'verified' && buyer.status !== 'blocked' && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{buyer.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{buyer.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[buyer.status]}`}>
                      {buyer.status.charAt(0).toUpperCase() + buyer.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${verificationColors[buyer.kycStatus]}`}>
                      {buyer.kycStatus.charAt(0).toUpperCase() + buyer.kycStatus.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{buyer.city}</div>

                  <div className="col-span-1 flex items-center gap-1">
                    {buyer.verification.email ? (
                      <FiCheckCircle className="text-[#00695C] text-xs" title="Email Verified" />
                    ) : (
                      <FiXCircle className="text-[#B5C9C5] text-xs" title="Email Not Verified" />
                    )}
                    {buyer.verification.phone ? (
                      <FiCheckCircle className="text-[#00695C] text-xs" title="Phone Verified" />
                    ) : (
                      <FiXCircle className="text-[#B5C9C5] text-xs" title="Phone Not Verified" />
                    )}
                  </div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{buyer.phone}</div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{buyer.interestedIn}</div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{buyer.budget}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(buyer.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewBuyer(buyer)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditBuyer(buyer)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    {buyer.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => handleActivate(buyer.id)}
                        disabled={actionLoading === buyer.id}
                        className="w-7 h-7 rounded-lg hover:bg-[#E8F8F5] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 disabled:opacity-50"
                        title="Activate"
                      >
                        {actionLoading === buyer.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiCheckCircle className="text-xs" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBlockClick(buyer.id, buyer.status !== 'blocked')}
                        disabled={actionLoading === `block_${buyer.id}`}
                        className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                          buyer.status === 'blocked'
                            ? 'text-[#00695C] hover:bg-[#E8F8F5]'
                            : 'text-red-500 hover:bg-red-50'
                        }`}
                        title={buyer.status === 'blocked' ? 'Unblock' : 'Block'}
                      >
                        {actionLoading === `block_${buyer.id}` ? (
                          <FiRefreshCw className="text-xs animate-spin" />
                        ) : buyer.status === 'blocked' ? (
                          <FiUnlock className="text-xs" />
                        ) : (
                          <FiLock className="text-xs" />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(buyer.id)}
                      disabled={actionLoading === `delete_${buyer.id}`}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === `delete_${buyer.id}` ? (
                        <FiRefreshCw className="text-xs animate-spin" />
                      ) : (
                        <FiTrash2 className="text-xs" />
                      )}
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
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No buyers found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No buyers match your current view'}
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
              {Math.min(currentPage * pageSize, filteredBuyers.length)} of{' '}
              {filteredBuyers.length} buyers
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

export default BuyerRegistration;