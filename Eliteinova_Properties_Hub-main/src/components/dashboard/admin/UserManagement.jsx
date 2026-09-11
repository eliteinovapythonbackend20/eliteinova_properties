// src/components/dashboard/admin/UserManagement.jsx

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
  FiPrinter, FiCopy, FiShare, FiSettings, FiAward, FiBriefcase, FiHome
} from 'react-icons/fi';
import {
  FaBuilding, FaUserTie, FaUserCog, FaUsers,
  FaCheck, FaTimes, FaStar as FaStarSolid,
  FaUserCircle, FaStore, FaHome as FaHomeSolid, FaBriefcase as FaBriefcaseSolid,
  FaCertificate, FaShieldAlt, FaRocket, FaCrown, FaMedal,
  FaUserGraduate, FaUserMd, FaUserSecret
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

const StatCard = ({ icon, title, value, color, delay = 0, roleId, selectedRole, statsAnimating, onClick }) => {
  const isRoleActive = selectedRole === roleId || (roleId === 'total' && selectedRole === 'all');

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isRoleActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick(roleId)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A7D78] uppercase tracking-wider">{title}</p>
          <p className={`text-xl font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isRoleActive ? 'text-[#00695C]' : ''}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      {isRoleActive && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
    </div>
  );
};

const DeleteConfirmModal = ({ show, user, actionLoading, onCancel, onConfirm }) => {
  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="text-3xl text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">Delete User</h3>
          <p className="text-sm text-[#5A7D78] mt-2">
            Are you sure you want to delete <span className="font-semibold text-[#1A2E2A]">{user.name}</span>?
            This action cannot be undone.
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
              disabled={actionLoading === user.id}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              {actionLoading === user.id ? <FiRefreshCw className="animate-spin mx-auto" /> : 'Delete User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkDeleteConfirmModal = ({ show, count, actionLoading, onCancel, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="text-3xl text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">Delete Selected Users</h3>
          <p className="text-sm text-[#5A7D78] mt-2">
            Are you sure you want to delete <span className="font-semibold text-[#1A2E2A]">{count}</span> selected users?
            This action cannot be undone.
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
              disabled={actionLoading === 'delete'}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              {actionLoading === 'delete' ? <FiRefreshCw className="animate-spin mx-auto" /> : 'Delete All'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewField = ({ label, value, span }) => (
  <div className={span ? 'col-span-2' : ''}>
    <label className="text-xs font-medium text-[#5A7D78] block mb-1">{label}</label>
    <div className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#1A2E2A] min-h-[42px] flex items-center">
      {value || <span className="text-[#B5C9C5]">—</span>}
    </div>
  </div>
);

const ViewUserModal = ({ user, show, actionLoading, onClose, onEdit, onToggleBlock, onDelete }) => {
  if (!user || !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8F0EE] animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-white/80 text-sm">User Details</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/20 text-white border border-white/20 flex items-center gap-1">
                  {user.role.icon}
                  {user.role.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border border-white/20 ${
                  user.status === 'active' ? 'bg-emerald-500/30 text-emerald-100' :
                  user.status === 'blocked' ? 'bg-red-500/30 text-red-100' :
                  user.status === 'pending' ? 'bg-amber-500/30 text-amber-100' :
                  'bg-gray-500/30 text-gray-100'
                }`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border border-white/20 ${
                  user.verification === 'verified' ? 'bg-emerald-500/30 text-emerald-100' :
                  user.verification === 'pending' ? 'bg-amber-500/30 text-amber-100' :
                  'bg-red-500/30 text-red-100'
                }`}>
                  {user.verification.charAt(0).toUpperCase() + user.verification.slice(1)}
                </span>
                {user.featured && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-yellow-400/30 text-yellow-200 border border-yellow-400/30">
                    <FaStarSolid className="inline mr-0.5 text-[8px]" /> Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <ViewField label="Full Name" value={user.name} />
            <ViewField label="Email" value={user.email} />
            <ViewField label="Phone" value={user.phone} />
            <ViewField label="Role" value={user.role.label} />
            <ViewField label="City" value={user.city} />
            <ViewField label="State" value={user.state} />
            <ViewField label="Company" value={user.company} />
            <ViewField label="Subscription Plan" value={user.subscriptionPlan} />
            <ViewField label="Status" value={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
            <ViewField label="Verification" value={user.verification.charAt(0).toUpperCase() + user.verification.slice(1)} />
            <ViewField label="Joined" value={new Date(user.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
            <ViewField label="Last Active" value={new Date(user.lastActive).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
            {user.bio && <ViewField label="Bio" value={user.bio} span />}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
              <FiShield className="text-[#00695C]" />
              KYC Verification Status
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'aadhaar', label: 'Aadhaar' },
                { key: 'pan', label: 'PAN' },
                { key: 'gst', label: 'GST' },
                { key: 'rera', label: 'RERA' }
              ].map(item => (
                <div key={item.key} className={`rounded-xl p-3 text-center ${user.kyc[item.key] ? 'bg-[#E8F8F5] border border-[#A8D5CD]' : 'bg-[#F5F9F8] border border-[#E8F0EE]'}`}>
                  <div className={`text-lg ${user.kyc[item.key] ? 'text-[#00695C]' : 'text-[#B5C9C5]'}`}>
                    {user.kyc[item.key] ? <FiCheckCircle /> : <FiXCircle />}
                  </div>
                  <p className="text-[10px] font-medium mt-1 text-[#1A2E2A]">{item.label}</p>
                  <p className={`text-[8px] ${user.kyc[item.key] ? 'text-[#00695C]' : 'text-[#B5C9C5]'}`}>
                    {user.kyc[item.key] ? 'Verified' : 'Pending'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4 text-center border border-[#E8F0EE]">
              <p className="text-2xl font-bold text-[#00695C]">{user.propertiesCount}</p>
              <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4 text-center border border-[#E8F0EE]">
              <p className="text-2xl font-bold text-[#00695C]">{user.leadsCount}</p>
              <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider">Leads</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4 text-center border border-[#E8F0EE]">
              <p className="text-2xl font-bold text-[#00695C] flex items-center justify-center gap-1">
                <FaStarSolid className="text-yellow-400 text-base" />
                {user.rating}
              </p>
              <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider">Rating</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 p-5 justify-center border-t border-white/10 bg-gradient-to-r from-[#00695C] to-[#26A69A] sticky bottom-0 rounded-b-3xl">
          <button
            onClick={onEdit}
            className="px-8 py-4 bg-white text-[#00695C] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-base font-semibold flex items-center gap-2 hover:-translate-y-0.5 shadow-lg"
          >
            <FiEdit className="text-lg" /> Edit Profile
          </button>
          <button
            onClick={onToggleBlock}
            disabled={actionLoading === user.id}
            className={`px-8 py-4 rounded-xl transition-all duration-300 text-base font-semibold flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 shadow-lg ${
              user.status === 'blocked'
                ? 'bg-white text-emerald-700 hover:bg-[#F5F9F8]'
                : 'bg-white text-red-700 hover:bg-[#F5F9F8]'
            }`}
          >
            {actionLoading === user.id ? (
              <FiRefreshCw className="animate-spin text-lg" />
            ) : user.status === 'blocked' ? (
              <FiUnlock className="text-lg" />
            ) : (
              <FiLock className="text-lg" />
            )}
            {user.status === 'blocked' ? 'Unblock User' : 'Block User'}
          </button>
          <button
            onClick={onDelete}
            className="px-8 py-4 bg-white text-red-700 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-base font-semibold flex items-center gap-2 hover:-translate-y-0.5 shadow-lg"
          >
            <FiTrash2 className="text-lg" /> Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, show, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        company: user.company,
        status: user.status,
        verification: user.verification,
        roleId: user.roleId,
        subscriptionPlan: user.subscriptionPlan,
        bio: user.bio || '',
      });
    }
  }, [user]);

  if (!user || !show || !formData) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit User</h2>
          <p className="text-white/80 text-sm">Update user information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
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
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Role *</label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
                <option value="property_manager">Property Manager</option>
                <option value="buyer">Buyer</option>
                <option value="tenant">Tenant</option>
              </select>
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
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Subscription Plan</label>
              <select
                name="subscriptionPlan"
                value={formData.subscriptionPlan}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                <option value="Free">Free</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Verification</label>
              <select
                name="verification"
                value={formData.verification}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
                placeholder="Brief description about the user"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#E8F0EE]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  const [stats, setStats] = useState({
    totalUsers: 8452,
    totalOwners: 523,
    totalAgents: 389,
    totalBuilders: 187,
    totalPropertyManagers: 148,
    totalBuyers: 4589,
    totalTenants: 2616,
  });

  // ============ ROLE CONFIGURATION ============
  const roleConfig = useMemo(() => ({
    owner: {
      id: 'owner',
      label: 'Owner',
      icon: <FaUserTie className="text-[#00695C]" />,
      color: 'bg-[#00695C]/10 text-[#00695C] border-[#00695C]/30',
      bg: 'bg-[#00695C]/5',
      route: '/admin/owners/overview',
      description: 'Property owners who list their properties',
      statColor: 'bg-gradient-to-br from-[#00695C] to-[#26A69A]'
    },
    agent: {
      id: 'agent',
      label: 'Agent',
      icon: <MdOutlineRealEstateAgent className="text-blue-600" />,
      color: 'bg-blue-600/10 text-blue-600 border-blue-600/30',
      bg: 'bg-blue-600/5',
      route: '/admin/agents/overview',
      description: 'Real estate agents helping buy/sell properties',
      statColor: 'bg-gradient-to-br from-blue-600 to-blue-400'
    },
    builder: {
      id: 'builder',
      label: 'Builder',
      icon: <FaBuilding className="text-purple-600" />,
      color: 'bg-purple-600/10 text-purple-600 border-purple-600/30',
      bg: 'bg-purple-600/5',
      route: '/admin/builders/overview',
      description: 'Builders and developers with projects',
      statColor: 'bg-gradient-to-br from-purple-600 to-purple-400'
    },
    property_manager: {
      id: 'property_manager',
      label: 'Property Manager',
      icon: <FaUserCog className="text-amber-600" />,
      color: 'bg-amber-600/10 text-amber-600 border-amber-600/30',
      bg: 'bg-amber-600/5',
      route: '/admin/property-managers/overview',
      description: 'Companies managing properties and tenants',
      statColor: 'bg-gradient-to-br from-amber-600 to-amber-400'
    },
    buyer: {
      id: 'buyer',
      label: 'Buyer',
      icon: <FaUsers className="text-emerald-600" />,
      color: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/30',
      bg: 'bg-emerald-600/5',
      route: '/admin/buyers-tenants',
      description: 'Buyers looking for properties',
      statColor: 'bg-gradient-to-br from-emerald-600 to-emerald-400'
    },
    tenant: {
      id: 'tenant',
      label: 'Tenant',
      icon: <HiOutlineUserGroup className="text-rose-600" />,
      color: 'bg-rose-600/10 text-rose-600 border-rose-600/30',
      bg: 'bg-rose-600/5',
      route: '/admin/buyers-tenants',
      description: 'Tenants renting properties',
      statColor: 'bg-gradient-to-br from-rose-600 to-rose-400'
    }
  }), []);

  // ============ GENERATE MOCK USERS ============
  const generateMockUsers = useCallback(() => {
    const roles = Object.values(roleConfig);
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran', 'Mohan', 'Ritu', 'Gautam', 'Nisha', 'Tarun', 'Aditi', 'Karan', 'Riya', 'Ankit', 'Shreya'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai', 'Bhatia', 'Kapoor', 'Sethi', 'Arora', 'Chaudhary'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Agra', 'Nashik', 'Faridabad'];
    const statuses = ['active', 'inactive', 'blocked', 'pending'];
    const verificationStatuses = ['verified', 'pending', 'rejected'];

    const users = [];
    const usedNames = new Set();

    for (let i = 1; i <= 150; i++) {
      let firstName, lastName, fullName;
      let attempts = 0;
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fullName = `${firstName} ${lastName}`;
        attempts++;
      } while (usedNames.has(fullName) && attempts < 50);
      usedNames.add(fullName);

      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const verification = verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));

      const propertiesCount = Math.floor(Math.random() * 25);
      const leadsCount = Math.floor(Math.random() * 50);
      const rating = (Math.random() * 4 + 1).toFixed(1);

      users.push({
        id: `user_${i}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@eliteinova.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        role: role,
        roleId: role.id,
        status: status,
        verification: verification,
        city: city,
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Bihar'][Math.floor(Math.random() * 10)],
        joinedDate: date.toISOString(),
        propertiesCount: propertiesCount,
        leadsCount: leadsCount,
        rating: rating,
        avatar: firstName[0] + lastName[0],
        company: ['ABC Realty', 'Dream Homes', 'Green Valley', 'Luxury Living', 'Urban Estate', 'Prime Properties', 'Elite Homes', 'Royal Estate', 'Golden Key', 'Smart Living'][Math.floor(Math.random() * 10)],
        kyc: {
          aadhaar: Math.random() > 0.2,
          pan: Math.random() > 0.25,
          gst: Math.random() > 0.7,
          rera: Math.random() > 0.6,
        },
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        totalSpent: Math.floor(Math.random() * 500000),
        subscriptionPlan: ['Free', 'Silver', 'Gold', 'Platinum', 'Basic', 'Professional', 'Enterprise'][Math.floor(Math.random() * 7)],
        featured: Math.random() > 0.85,
        verifiedBadge: Math.random() > 0.7,
        bio: `Experienced professional in the real estate industry with expertise in ${role.label.toLowerCase()} services.`,
      });
    }

    return users;
  }, [roleConfig]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockUsers = generateMockUsers();
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockUsers]);

  // ============ FILTER USERS ============
  const filterUsers = useCallback(() => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.city.toLowerCase().includes(query) ||
        user.company.toLowerCase().includes(query) ||
        user.role.label.toLowerCase().includes(query)
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.roleId === selectedRole);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    if (selectedVerification !== 'all') {
      filtered = filtered.filter(user => user.verification === selectedVerification);
    }

    let count = 0;
    if (selectedRole !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedVerification !== 'all') count++;
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

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery, selectedRole, selectedStatus, selectedVerification, sortField, sortDirection]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() =>
    filteredUsers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredUsers, currentPage, pageSize]);

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
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  }, [selectedUsers, paginatedUsers]);

  // ============ HANDLE SELECT USER ============
  const handleSelectUser = useCallback((userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  // ============ HANDLE BULK ACTION ============
  const handleBulkAction = useCallback((action) => {
    if (selectedUsers.length === 0) {
      showToast('Please select users first', 'warning');
      return;
    }

    if (action === 'delete') {
      setShowBulkDeleteConfirm(true);
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedUserIds = new Set(selectedUsers);
      let updatedUsers = [...users];
      let actionCount = 0;

      updatedUsers = updatedUsers.map(user => {
        if (selectedUserIds.has(user.id)) {
          actionCount++;
          switch (action) {
            case 'block':
              return { ...user, status: 'blocked' };
            case 'unblock':
              return { ...user, status: 'active' };
            case 'verify':
              return { ...user, verification: 'verified' };
            default:
              return user;
          }
        }
        return user;
      });

      setUsers(updatedUsers);
      setSelectedUsers([]);
      setActionLoading(null);

      const actionLabels = {
        block: 'blocked',
        unblock: 'unblocked',
        verify: 'verified',
      };
      showToast(`${actionCount} user(s) ${actionLabels[action] || action} successfully`, 'success');
    }, 800);
  }, [selectedUsers, users, showToast]);

  // ============ CONFIRM BULK DELETE ============
  const confirmBulkDelete = useCallback(() => {
    setActionLoading('delete');
    setShowBulkDeleteConfirm(false);

    setTimeout(() => {
      const selectedUserIds = new Set(selectedUsers);
      const updatedUsers = users.filter(user => !selectedUserIds.has(user.id));
      setUsers(updatedUsers);
      setSelectedUsers([]);
      setActionLoading(null);
      showToast(`${selectedUsers.length} user(s) deleted successfully`, 'success');
    }, 800);
  }, [selectedUsers, users, showToast]);

  // ============ HANDLE USER ACTION ============
  const handleUserAction = useCallback((userId, action) => {
    if (action === 'delete') {
      setShowDeleteConfirm(userId);
      return;
    }

    setActionLoading(userId);

    setTimeout(() => {
      let updatedUsers = [...users];
      let user = updatedUsers.find(u => u.id === userId);
      let actionMessage = '';

      switch (action) {
        case 'block':
          user = { ...user, status: 'blocked' };
          actionMessage = 'User blocked successfully';
          break;
        case 'unblock':
          user = { ...user, status: 'active' };
          actionMessage = 'User unblocked successfully';
          break;
        case 'verify':
          user = { ...user, verification: 'verified' };
          actionMessage = 'User verified successfully';
          break;
        case 'suspend':
          user = { ...user, status: 'inactive' };
          actionMessage = 'User suspended successfully';
          break;
        default:
          break;
      }

      updatedUsers = updatedUsers.map(u => u.id === userId ? user : u);
      setUsers(updatedUsers);
      setActionLoading(null);
      showToast(actionMessage, 'success');

      setViewingUser(prev => (prev && prev.id === userId ? user : prev));
    }, 600);
  }, [users, showToast]);

  // ============ CONFIRM DELETE ============
  const confirmDelete = useCallback(() => {
    const userId = showDeleteConfirm;
    setActionLoading(userId);
    setShowDeleteConfirm(null);

    setTimeout(() => {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      setActionLoading(null);
      showToast('User deleted successfully', 'success');
    }, 600);
  }, [showDeleteConfirm, users, showToast]);

  // ============ VIEW USER DETAIL ============
  const handleViewUser = useCallback((user) => {
    setViewingUser(user);
    setShowViewModal(true);
  }, []);

  // ============ EDIT USER ============
  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const saveEdit = useCallback((updatedData) => {
    setUsers(prev => prev.map(user =>
      user.id === editingUser.id ? { ...user, ...updatedData } : user
    ));
    setShowEditModal(false);
    setEditingUser(null);
    showToast('User updated successfully', 'success');
  }, [editingUser, showToast]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((roleId) => {
    if (roleId === 'total') {
      setSelectedRole('all');
      setSearchQuery('');
    } else {
      setSelectedRole(roleId);
      setSearchQuery('');
    }
    setSelectedStatus('all');
    setSelectedVerification('all');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedStatus('all');
    setSelectedVerification('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockUsers = generateMockUsers();
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockUsers, showToast]);

  // ============ EXPORT USERS ============
  const handleExportUsers = useCallback(() => {
    const data = filteredUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Role: user.role.label,
      Status: user.status,
      Verification: user.verification,
      City: user.city,
      State: user.state,
      Properties: user.propertiesCount,
      Leads: user.leadsCount,
      Rating: user.rating,
      'Joined Date': new Date(user.joinedDate).toLocaleDateString(),
      'Subscription Plan': user.subscriptionPlan,
      'Total Spent': `₹${user.totalSpent.toLocaleString()}`
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredUsers.length} users exported successfully`, 'success');
  }, [filteredUsers, showToast]);

  // ============ VIEW MODAL ACTION HANDLERS ============
  const handleViewModalEdit = useCallback(() => {
    if (!viewingUser) return;
    setShowViewModal(false);
    handleEditUser(viewingUser);
  }, [viewingUser, handleEditUser]);

  const handleViewModalToggleBlock = useCallback(() => {
    if (!viewingUser) return;
    handleUserAction(viewingUser.id, viewingUser.status === 'blocked' ? 'unblock' : 'block');
  }, [viewingUser, handleUserAction]);

  const handleViewModalDelete = useCallback(() => {
    if (!viewingUser) return;
    setShowViewModal(false);
    setShowDeleteConfirm(viewingUser.id);
  }, [viewingUser]);

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

      {/* Delete Confirm Modals */}
      <DeleteConfirmModal
        show={!!showDeleteConfirm}
        user={users.find(u => u.id === showDeleteConfirm)}
        actionLoading={actionLoading}
        onCancel={() => setShowDeleteConfirm(null)}
        onConfirm={confirmDelete}
      />
      <BulkDeleteConfirmModal
        show={showBulkDeleteConfirm}
        count={selectedUsers.length}
        actionLoading={actionLoading}
        onCancel={() => setShowBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
      />

      {/* Edit Modal */}
      <EditUserModal
        user={editingUser}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingUser(null); }}
        onSave={saveEdit}
      />

      {/* View Modal */}
      <ViewUserModal
        user={viewingUser}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingUser(null); }}
        onEdit={handleViewModalEdit}
        onToggleBlock={handleViewModalToggleBlock}
        onDelete={handleViewModalDelete}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                User Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredUsers.length} Users
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage all users across your real estate platform</span>
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportUsers}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section - Light Theme */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Users"
                value={stats.totalUsers}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                roleId="total"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
              <StatCard
                icon={<FaUserTie className="text-white text-sm" />}
                title="Owners"
                value={stats.totalOwners}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={100}
                roleId="owner"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
              <StatCard
                icon={<MdOutlineRealEstateAgent className="text-white text-sm" />}
                title="Agents"
                value={stats.totalAgents}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={200}
                roleId="agent"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
              <StatCard
                icon={<FaBuilding className="text-white text-sm" />}
                title="Builders"
                value={stats.totalBuilders}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={300}
                roleId="builder"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
              <StatCard
                icon={<FaUserCog className="text-white text-sm" />}
                title="Property Managers"
                value={stats.totalPropertyManagers}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={400}
                roleId="property_manager"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
              <StatCard
                icon={<FaUsers className="text-white text-sm" />}
                title="Buyers"
                value={stats.totalBuyers}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={500}
                roleId="buyer"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
              <StatCard
                icon={<HiOutlineUserGroup className="text-white text-sm" />}
                title="Tenants"
                value={stats.totalTenants}
                color="bg-gradient-to-br from-rose-600 to-rose-400"
                delay={600}
                roleId="tenant"
                selectedRole={selectedRole}
                statsAnimating={statsAnimating}
                onClick={handleStatClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters - Light Theme */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search users by name, email, phone, city, or company..."
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
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Roles</option>
                <option value="owner">Owners</option>
                <option value="agent">Agents</option>
                <option value="builder">Builders</option>
                <option value="property_manager">Property Managers</option>
                <option value="buyer">Buyers</option>
                <option value="tenant">Tenants</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
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
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
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
        {selectedUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedUsers.length}</span> user(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('verify')}
                disabled={actionLoading === 'verify'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'verify' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Verify
              </button>
              <button
                onClick={() => handleBulkAction('block')}
                disabled={actionLoading === 'block'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'block' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiLock className="text-[10px]" />}
                Block
              </button>
              <button
                onClick={() => handleBulkAction('unblock')}
                disabled={actionLoading === 'unblock'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'unblock' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiUnlock className="text-[10px]" />}
                Unblock
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedUsers.map((user, index) => {
              const statusColors = {
                active: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
                inactive: 'bg-[#F5F9F8] text-[#5A7D78] border-[#D5E0DD]',
                blocked: 'bg-red-50 text-red-700 border-red-200',
                pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200'
              };

              const verificationColors = {
                verified: 'bg-[#E8F8F5] text-[#00695C]',
                pending: 'bg-[#FEF3E2] text-amber-700',
                rejected: 'bg-red-50 text-red-700'
              };

              const isSelected = selectedUsers.includes(user.id);

              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] ${user.role.color} p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-base shadow-lg">
                          {user.avatar}
                        </div>
                        {user.verification === 'verified' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <FaCheck className="text-white text-[8px]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1A2E2A]">{user.name}</h3>
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${user.role.color}`}>
                            {user.role.icon}
                            <span>{user.role.label}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap mt-0.5">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[user.status]}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${verificationColors[user.verification]}`}>
                            {user.verification.charAt(0).toUpperCase() + user.verification.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {user.featured && (
                        <div className="w-6 h-6 bg-[#FEF3E2] rounded-full flex items-center justify-center">
                          <FaStarSolid className="text-amber-500 text-[10px]" />
                        </div>
                      )}
                      <button
                        type="button"
                        className="w-8 h-8 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewUser(user)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span>{user.city}, {user.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Joined {new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{user.propertiesCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{user.leadsCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A] flex items-center justify-center gap-0.5">
                        <FaStarSolid className="text-amber-400 text-[10px]" />
                        {user.rating}
                      </p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Rating</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewUser(user)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditUser(user)}
                      className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (user.status === 'blocked') {
                          handleUserAction(user.id, 'unblock');
                        } else {
                          handleUserAction(user.id, 'block');
                        }
                      }}
                      disabled={actionLoading === user.id}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.status === 'blocked'
                          ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]'
                          : 'text-red-600 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      {actionLoading === user.id ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : user.status === 'blocked' ? (
                        <FiUnlock className="text-[10px]" />
                      ) : (
                        <FiLock className="text-[10px]" />
                      )}
                      {user.status === 'blocked' ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(user.id)}
                      className="w-8 h-8 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-3 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>User</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Role</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Verification</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertiesCount')}>
                Properties {sortField === 'propertiesCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('rating')}>
                Rating {sortField === 'rating' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('joinedDate')}>
                Joined {sortField === 'joinedDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedUsers.map((user, index) => {
              const statusColors = {
                active: 'bg-[#E8F8F5] text-[#00695C]',
                inactive: 'bg-[#F5F9F8] text-[#5A7D78]',
                blocked: 'bg-red-50 text-red-700',
                pending: 'bg-[#FEF3E2] text-amber-700'
              };

              const verificationColors = {
                verified: 'bg-[#E8F8F5] text-[#00695C]',
                pending: 'bg-[#FEF3E2] text-amber-700',
                rejected: 'bg-red-50 text-red-700'
              };

              const isSelected = selectedUsers.includes(user.id);

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 gap-3 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {user.avatar}
                      </div>
                      {user.verification === 'verified' && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{user.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{user.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${user.role.color}`}>
                      {user.role.icon}
                      <span>{user.role.label}</span>
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[user.status]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${verificationColors[user.verification]}`}>
                      {user.verification.charAt(0).toUpperCase() + user.verification.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{user.city}</div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A]">{user.propertiesCount}</p>
                  </div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A] flex items-center justify-center gap-0.5">
                      <FaStarSolid className="text-amber-400 text-[10px]" />
                      {user.rating}
                    </p>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewUser(user)}
                      className="w-8 h-8 rounded-xl hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditUser(user)}
                      className="w-8 h-8 rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (user.status === 'blocked') {
                          handleUserAction(user.id, 'unblock');
                        } else {
                          handleUserAction(user.id, 'block');
                        }
                      }}
                      disabled={actionLoading === user.id}
                      className={`w-8 h-8 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.status === 'blocked'
                          ? 'text-[#00695C] hover:bg-[#E8F8F5]'
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                      title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                    >
                      {actionLoading === user.id ? (
                        <FiRefreshCw className="text-sm animate-spin" />
                      ) : user.status === 'blocked' ? (
                        <FiUnlock className="text-sm" />
                      ) : (
                        <FiLock className="text-sm" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(user.id)}
                      className="w-8 h-8 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedUsers.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUsers className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No users found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No users match your current view'}
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
              {Math.min(currentPage * pageSize, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
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

        /* Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #F8FAF9;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #B5C9C5;
          border-radius: 20px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #5A7D78;
        }
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #B5C9C5 #F8FAF9;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;