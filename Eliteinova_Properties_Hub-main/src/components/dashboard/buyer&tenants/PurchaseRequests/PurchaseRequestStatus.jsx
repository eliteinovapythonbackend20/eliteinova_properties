// src/components/dashboard/admin/buyer&tenants/PurchaseRequests/PurchaseRequestStatus.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiDollarSign, FiMapPin, FiHome, FiGrid, FiCalendar,
  FiClock, FiUser, FiUsers as FiFamily, FiCheckCircle, FiXCircle,
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiEye, FiEdit, FiTrash2, FiRefreshCw, FiPlus, FiDownload,
  FiAlertTriangle, FiInfo, FiX, FiList, FiGrid as FiGridIcon,
  FiActivity, FiStar, FiShield, FiBriefcase, FiMail, FiPhone,
  FiExternalLink, FiLock, FiUnlock, FiMoreVertical, FiTag,
  FiFileText, FiUserCheck, FiArrowRight, FiArrowUp, FiArrowDown,
  FiCheck, FiClock as FiClockIcon, FiEye as FiEyeIcon,
  FiHome as FiHomeIcon, FiFile, FiUsers as FiUsersIcon,
  FiCheckCircle as FiCheckCircleIcon, FiXCircle as FiXCircleIcon,
  FiBook, FiHome as FiHomeSolid, FiFlag, FiTrendingUp, FiAward
} from 'react-icons/fi';
import {
  FaHome, FaBed, FaCalendarAlt, FaUsers, FaCar, FaPaw,
  FaCheck, FaTimes, FaStar as FaStarSolid, FaUserTie,
  FaBuilding, FaUserCircle, FaMoneyBillWave, FaShieldAlt,
  FaBriefcase as FaBriefcaseSolid, FaComments, FaArrowRight as FaArrowRightSolid,
  FaClipboardList, FaEye, FaCheckDouble, FaTimesCircle,
  FaFileSignature, FaHandshake, FaHome as FaHomeSolidIcon
} from 'react-icons/fa';
import { MdOutlineVerified, MdOutlineFamilyRestroom, MdOutlineSecurity, MdOutlineTimeline } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi2';

/* ============================================================
   STATUS CONFIG (shared across component)
============================================================ */

const ALL_STATUSES = ['New', 'Contacted', 'Interested', 'Site Visit', 'Offer Submitted', 'Negotiation', 'Offer Accepted', 'Agreement', 'Sale Completed', 'Closed Lost'];

const STATUS_COLORS = {
  'New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Contacted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Interested': 'bg-violet-50 text-violet-700 border-violet-200',
  'Site Visit': 'bg-pink-50 text-pink-700 border-pink-200',
  'Offer Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
  'Negotiation': 'bg-orange-50 text-orange-700 border-orange-200',
  'Offer Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Agreement': 'bg-teal-50 text-teal-700 border-teal-200',
  'Sale Completed': 'bg-[#E8F4F2] text-[#00695C] border-[#A8D5CD]',
  'Closed Lost': 'bg-red-50 text-red-700 border-red-200'
};

const STATUS_ICON_MAP = {
  'New': FiUser,
  'Contacted': FiPhone,
  'Interested': FiStar,
  'Site Visit': FiEyeIcon,
  'Offer Submitted': FiFile,
  'Negotiation': FaHandshake,
  'Offer Accepted': FiCheckCircleIcon,
  'Agreement': FiBook,
  'Sale Completed': FiAward,
  'Closed Lost': FiXCircleIcon
};

const getStatusIconEl = (status, sizeClass = 'text-xs') => {
  const Icon = STATUS_ICON_MAP[status] || FiUser;
  return <Icon className={sizeClass} />;
};

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
      className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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

// Status Timeline Component
const StatusTimeline = ({ statuses, currentStatus, onStatusClick }) => {
  const statusColors = {
    'New': 'bg-blue-500',
    'Contacted': 'bg-indigo-500',
    'Interested': 'bg-violet-500',
    'Site Visit': 'bg-pink-500',
    'Offer Submitted': 'bg-amber-500',
    'Negotiation': 'bg-orange-500',
    'Offer Accepted': 'bg-emerald-500',
    'Agreement': 'bg-teal-500',
    'Sale Completed': 'bg-[#00695C]',
    'Closed Lost': 'bg-red-500'
  };

  const currentIndex = statuses.findIndex(s => s === currentStatus);

  return (
    <div className="relative py-6 px-4">
      {/* Timeline Line */}
      <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-[#E8F0EE]">
        <div 
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#00695C] to-[#26A69A] transition-all duration-1000"
          style={{ height: `${Math.max(0, (currentIndex / (statuses.length - 1)) * 100)}%` }}
        />
      </div>

      {/* Status Items */}
      <div className="space-y-6 relative">
        {statuses.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLost = status === 'Closed Lost';

          return (
            <div 
              key={status}
              className="flex items-start gap-4 group cursor-pointer"
              onClick={() => onStatusClick(status)}
            >
              {/* Status Circle */}
              <div className="relative z-10">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${isCompleted && !isLost ? 'bg-gradient-to-br from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' : ''}
                  ${isLost ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : ''}
                  ${!isCompleted && !isLost ? 'bg-[#F5F9F8] text-[#B5C9C5] border-2 border-[#E8F0EE]' : ''}
                  ${isCurrent && !isLost ? 'ring-4 ring-[#00695C]/20 scale-110' : ''}
                  ${isCurrent && isLost ? 'ring-4 ring-red-500/20 scale-110' : ''}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {getStatusIconEl(status, 'text-sm')}
                </div>
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-[#00695C] rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              {/* Status Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className={`
                      font-semibold text-sm transition-colors duration-300
                      ${isCompleted && !isLost ? 'text-[#1A2E2A]' : ''}
                      ${isLost ? 'text-red-600' : ''}
                      ${!isCompleted && !isLost ? 'text-[#B5C9C5]' : ''}
                      group-hover:text-[#00695C]
                    `}>
                      {status}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">
                        Current Status
                      </span>
                    )}
                    {isLost && (
                      <span className="text-[10px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                        Closed Lost
                      </span>
                    )}
                  </div>
                  {isCompleted && !isLost && !isCurrent && (
                    <span className="text-[#00695C]">
                      <FiCheckCircle className="text-sm" />
                    </span>
                  )}
                </div>
                {isCompleted && !isLost && (
                  <p className="text-[10px] text-[#5A7D78] mt-0.5">
                    {isCurrent ? 'In progress...' : 'Completed'}
                  </p>
                )}
                {!isCompleted && !isLost && (
                  <p className="text-[10px] text-[#B5C9C5] mt-0.5">
                    Pending
                  </p>
                )}
              </div>

              {/* Arrow connector for non-current items */}
              {index < statuses.length - 1 && (
                <div className="hidden sm:block">
                  <FiArrowRight className="text-[#B5C9C5] text-xs" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   STATUS CHANGE CONFIRMATION MODAL
============================================================ */

const StatusChangeConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  request, 
  currentStatus, 
  newStatus,
  loading 
}) => {
  if (!show || !request) return null;

  const isLost = newStatus === 'Closed Lost';
  const isWon = newStatus === 'Offer Accepted' || newStatus === 'Sale Completed';

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        {/* Header */}
        <div className={`p-6 ${isLost ? 'bg-gradient-to-r from-red-600 to-red-400' : isWon ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-[#00695C] to-[#26A69A]'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              {isLost ? <FiAlertTriangle className="text-2xl" /> : isWon ? <FiCheckCircle className="text-2xl" /> : <FiInfo className="text-2xl" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Change Status</h3>
              <p className="text-white/80 text-sm">Confirm status update</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5A7D78] uppercase tracking-wider">Buyer</p>
                <p className="font-semibold text-[#1A2E2A]">{request.buyerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#5A7D78] uppercase tracking-wider">Property</p>
                <p className="font-semibold text-[#1A2E2A] text-sm">{request.propertyName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            {/* Current Status */}
            <div className="text-center">
              <div className="text-xs text-[#5A7D78] uppercase tracking-wider mb-1">Current</div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${STATUS_COLORS[currentStatus] || STATUS_COLORS['New']}`}>
                {getStatusIconEl(currentStatus, 'text-xl')}
                {currentStatus}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-[#B5C9C5]">
              <FiArrowRight className="text-2xl" />
            </div>

            {/* New Status */}
            <div className="text-center">
              <div className="text-xs text-[#5A7D78] uppercase tracking-wider mb-1">New</div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${STATUS_COLORS[newStatus] || STATUS_COLORS['New']}`}>
                {getStatusIconEl(newStatus, 'text-xl')}
                {newStatus}
              </div>
            </div>
          </div>

          {isLost && (
            <div className="bg-red-50 rounded-xl p-3 flex items-start gap-2 border border-red-200">
              <FiAlertTriangle className="text-red-500 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">This will mark the purchase request as Closed Lost. This action can be reversed later.</p>
            </div>
          )}

          {isWon && (
            <div className="bg-emerald-50 rounded-xl p-3 flex items-start gap-2 border border-emerald-200">
              <FiCheckCircle className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-xs text-emerald-700">This will mark the request as {newStatus}. The buyer will be notified.</p>
            </div>
          )}

          <p className="text-sm text-[#5A7D78] text-center">
            Are you sure you want to change the status from <span className="font-semibold text-[#1A2E2A]">{currentStatus}</span> to <span className="font-semibold text-[#1A2E2A]">{newStatus}</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F9F8] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 ${
              isLost 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' 
                : isWon 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' 
                  : 'bg-[#00695C] hover:bg-[#004D40] shadow-[#00695C]/30'
            }`}
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin text-sm" />
                Updating...
              </>
            ) : (
              <>
                <FiCheck className="text-sm" />
                Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   DELETE CONFIRMATION MODAL
============================================================ */

const DeleteConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  request,
  loading 
}) => {
  if (!show || !request) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-600 to-red-400">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Delete Request</h3>
              <p className="text-white/80 text-sm">Confirm deletion</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5A7D78] uppercase tracking-wider">Buyer</p>
                <p className="font-semibold text-[#1A2E2A]">{request.buyerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#5A7D78] uppercase tracking-wider">Property</p>
                <p className="font-semibold text-[#1A2E2A] text-sm">{request.propertyName}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-3 flex items-start gap-2 border border-red-200">
            <FiAlertTriangle className="text-red-500 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">
              This action <span className="font-semibold">cannot be undone</span>. All data related to this purchase request will be permanently deleted.
            </p>
          </div>

          <p className="text-sm text-[#5A7D78] text-center">
            Are you sure you want to delete <span className="font-semibold text-[#1A2E2A]">{request.buyerName}</span>'s purchase request?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F9F8] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiRefreshCw className="animate-spin text-sm" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="text-sm" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   VIEW PURCHASE REQUEST STATUS MODAL
============================================================ */

const ViewPurchaseStatusModal = ({ request, show, onClose, onEdit, onDelete, onStatusChange }) => {
  if (!request || !show) return null;

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
          <h2 className="text-2xl font-bold text-white">Request Status</h2>
          <p className="text-white/80 text-sm">{request.buyerName} · {request.propertyName}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Current Status Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[request.status] || STATUS_COLORS['New']}`}>
                {request.status}
              </span>
              <span className="text-xs text-[#5A7D78]">Last updated: {new Date(request.updatedAt || request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Buyer & Property Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider">Buyer</p>
                  <p className="font-semibold text-[#1A2E2A]">{request.buyerName}</p>
                  <p className="text-xs text-[#5A7D78]">{request.buyerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider">Property</p>
                  <p className="font-semibold text-[#1A2E2A]">{request.propertyName}</p>
                  <p className="text-xs text-[#5A7D78]">{request.location}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-hidden">
              <div className="px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] flex items-center gap-2">
                <MdOutlineTimeline className="text-[#00695C] text-lg" />
                <h3 className="text-xs font-semibold text-[#1A2E2A] uppercase tracking-wider">Status Timeline</h3>
              </div>
              <StatusTimeline 
                statuses={ALL_STATUSES} 
                currentStatus={request.status} 
                onStatusClick={(status) => onStatusChange(request.id, status)}
              />
            </div>

            {/* Status History */}
            {request.statusHistory && request.statusHistory.length > 0 && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiClock className="text-[#00695C]" />
                  Status History
                </h4>
                <div className="space-y-2">
                  {request.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-center justify-between text-sm border-b border-[#E8F0EE] pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-[#1A2E2A]">{history.status}</span>
                      <span className="text-[#5A7D78] text-xs">{new Date(history.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(request)}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => onDelete(request)}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"
            >
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ADD / EDIT PURCHASE REQUEST STATUS MODAL
============================================================ */

const AddEditPurchaseStatusModal = ({ request, show, mode, onClose, onSave }) => {
  const emptyForm = {
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    propertyName: '',
    location: '',
    propertyType: 'Apartment',
    bedrooms: '2',
    askingPrice: 5000000,
    offerAmount: 4800000,
    bookingAmount: 200000,
    preferredPossessionDate: new Date().toISOString().slice(0, 10),
    paymentMode: 'Home Loan',
    furnishing: 'Semi Furnished',
    familySize: 3,
    employmentType: '',
    companyName: '',
    monthlyIncome: 80000,
    status: 'New',
    remarks: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (mode === 'edit' && request) {
      setFormData({
        buyerName: request.buyerName || '',
        buyerEmail: request.buyerEmail || '',
        buyerPhone: request.buyerPhone || '',
        propertyName: request.propertyName || '',
        location: request.location || '',
        propertyType: request.propertyType || 'Apartment',
        bedrooms: request.bedrooms?.toString() || '2',
        askingPrice: request.askingPrice || 5000000,
        offerAmount: request.offerAmount || 4800000,
        bookingAmount: request.bookingAmount || 200000,
        preferredPossessionDate: request.preferredPossessionDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        paymentMode: request.paymentMode || 'Home Loan',
        furnishing: request.furnishing || 'Semi Furnished',
        familySize: request.familySize || 3,
        employmentType: request.employmentType || '',
        companyName: request.companyName || '',
        monthlyIncome: request.monthlyIncome || 80000,
        status: request.status || 'New',
        remarks: request.remarks || ''
      });
    } else if (mode === 'add') {
      setFormData(emptyForm);
    }
  }, [request, mode, show]);

  if (!show || !formData) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const propertyTypes = ['Individual House', 'Apartment', 'Villa', 'Commercial', 'Land & Plots'];
  const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
  const paymentModes = ['Home Loan', 'Cash', 'Loan + Cash', 'Bank Transfer'];
  const statusOptions = ALL_STATUSES;

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
          <h2 className="text-2xl font-bold text-white">{mode === 'add' ? 'Add Purchase Request' : 'Edit Purchase Request'}</h2>
          <p className="text-white/80 text-sm">{mode === 'add' ? 'Create new purchase request' : 'Update purchase request'}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="purchase-status-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Buyer Information */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FiUser className="text-[#00695C]" />
                  Buyer Information
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Buyer Name *</label>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Email *</label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Phone *</label>
                <input
                  type="text"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
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
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Property Information */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FaHome className="text-[#00695C]" />
                  Property Information
                </h3>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Property Name *</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  placeholder="e.g., Indiranagar, Bangalore"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Bedrooms *</label>
                <input
                  type="text"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  placeholder="e.g., 1, 2, 3, 4, 5"
                  required
                />
              </div>

              {/* Financial Details */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-[#00695C]" />
                  Financial Details
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Asking Price (₹) *</label>
                <input
                  type="number"
                  name="askingPrice"
                  value={formData.askingPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Offer Amount (₹) *</label>
                <input
                  type="number"
                  name="offerAmount"
                  value={formData.offerAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Booking / Token Amount (₹) *</label>
                <input
                  type="number"
                  name="bookingAmount"
                  value={formData.bookingAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Payment Mode *</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {paymentModes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              {/* Purchase Details */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#00695C]" />
                  Purchase Details
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Preferred Possession Date *</label>
                <input
                  type="date"
                  name="preferredPossessionDate"
                  value={formData.preferredPossessionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Furnishing *</label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  {furnishingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Family Size *</label>
                <input
                  type="number"
                  name="familySize"
                  value={formData.familySize}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="1"
                  max="20"
                  required
                />
              </div>

              {/* Employment Details */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#1A2E2A] mb-3 flex items-center gap-2">
                  <FaBriefcaseSolid className="text-[#00695C]" />
                  Employment Details
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Employment Type *</label>
                <input
                  type="text"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  placeholder="e.g., Salaried, Self-Employed, Business Owner, Freelancer, Retired, Student"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Company / Organization</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Monthly Income (₹) *</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  step="1"
                  required
                />
              </div>

              {/* Remarks */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
                  placeholder="Any additional remarks or special conditions..."
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
              form="purchase-status-form"
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              {mode === 'add' ? 'Add Purchase Request' : 'Save Changes'}
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

const PurchaseRequestStatus = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedFurnishing, setSelectedFurnishing] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('buyerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formRequest, setFormRequest] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [showFormModal, setShowFormModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Status change modal state
  const [statusChangeModal, setStatusChangeModal] = useState({
    show: false,
    request: null,
    newStatus: '',
    currentStatus: '',
    loading: false
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    request: null,
    loading: false
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    New: 0,
    Contacted: 0,
    Interested: 0,
    'Site Visit': 0,
    'Offer Submitted': 0,
    Negotiation: 0,
    'Offer Accepted': 0,
    Agreement: 0,
    'Sale Completed': 0,
    'Closed Lost': 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    const total = list.length;
    const counts = {};
    ALL_STATUSES.forEach(status => {
      counts[status] = list.filter(r => r.status === status).length;
    });

    setStats({ total, ...counts });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockRequests = useCallback(() => {
    const firstNames = ['Rahul', 'Anita', 'Sanjay', 'Divya', 'Karthik', 'Neha', 'Manoj', 'Swati', 'Rohit', 'Pallavi', 'Vivek', 'Shalini', 'Ajay', 'Bhavana', 'Naveen', 'Radhika', 'Sameer', 'Anjali', 'Harish', 'Preeti'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
    const propertyNames = ['Green Valley', 'Lake View', 'Sunset Tower', 'Garden Heights', 'Royal Orchid', 'Palm Grove', 'Silver Oaks', 'Golden Estate', 'Maple Wood', 'Cedar Creek'];
    const locations = ['MG Road, Bangalore', 'Banjara Hills, Hyderabad', 'Indiranagar, Bangalore', 'Koramangala, Bangalore', 'Whitefield, Bangalore', 'Jubilee Hills, Hyderabad', 'Connaught Place, Delhi', 'Salt Lake, Kolkata', 'Andheri, Mumbai', 'Bandra, Mumbai'];
    const propertyTypes = ['Individual House', 'Apartment', 'Villa', 'Commercial', 'Land & Plots'];
    const furnishingOptions = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
    const statusOptions = ALL_STATUSES;
    const paymentModes = ['Home Loan', 'Cash', 'Loan + Cash', 'Bank Transfer'];
    const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired', 'Student'];

    const requests = [];
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

      const askingPrice = Math.floor(Math.random() * 18000000 + 2000000);
      const offerAmount = Math.floor(askingPrice * (0.88 + Math.random() * 0.1));
      const bookingAmount = Math.floor(Math.random() * 400000 + 100000);

      const possession = new Date();
      possession.setDate(possession.getDate() + Math.floor(Math.random() * 180));

      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const statusHistory = [];
      const statusIndex = statusOptions.indexOf(status);
      for (let j = 0; j <= statusIndex; j++) {
        const date = new Date();
        date.setDate(date.getDate() - (statusIndex - j) * Math.floor(Math.random() * 3 + 1));
        statusHistory.push({
          status: statusOptions[j],
          date: date.toISOString()
        });
      }

      requests.push({
        id: `purchase_status_${i}`,
        buyerName: fullName,
        buyerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        buyerPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        propertyName: propertyNames[Math.floor(Math.random() * propertyNames.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        bedrooms: Math.floor(Math.random() * 4) + 1,
        askingPrice: askingPrice,
        offerAmount: offerAmount,
        bookingAmount: bookingAmount,
        preferredPossessionDate: possession.toISOString(),
        paymentMode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
        furnishing: furnishingOptions[Math.floor(Math.random() * furnishingOptions.length)],
        familySize: Math.floor(Math.random() * 4) + 1,
        employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
        companyName: `${firstName}'s ${['Tech', 'Solutions', 'Enterprises', 'Associates', 'Group'][Math.floor(Math.random() * 5)]}`,
        monthlyIncome: Math.floor(askingPrice / 60) + Math.floor(Math.random() * 30000),
        status: status,
        statusHistory: statusHistory,
        remarks: Math.random() > 0.7 ? `Buyer prefers early possession. Loan pre-approved.` : '',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    computeStats(requests);
    return requests;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockRequests = generateMockRequests();
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockRequests]);

  // ============ FILTER REQUESTS ============
  const filterRequests = useCallback(() => {
    let filtered = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req =>
        req.buyerName.toLowerCase().includes(query) ||
        req.buyerEmail.toLowerCase().includes(query) ||
        req.buyerPhone.includes(query) ||
        req.propertyName.toLowerCase().includes(query) ||
        req.location.toLowerCase().includes(query) ||
        req.propertyType.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }

    if (selectedPropertyType !== 'all') {
      filtered = filtered.filter(req => req.propertyType === selectedPropertyType);
    }

    if (selectedFurnishing !== 'all') {
      filtered = filtered.filter(req => req.furnishing === selectedFurnishing);
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedPropertyType !== 'all') count++;
    if (selectedFurnishing !== 'all') count++;
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

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [requests, searchQuery, selectedStatus, selectedPropertyType, selectedFurnishing, sortField, sortDirection]);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = useMemo(() =>
    filteredRequests.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredRequests, currentPage, pageSize]);

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
    if (selectedRequests.length === paginatedRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(paginatedRequests.map(req => req.id));
    }
  }, [selectedRequests, paginatedRequests]);

  // ============ HANDLE SELECT REQUEST ============
  const handleSelectRequest = useCallback((reqId) => {
    setSelectedRequests(prev =>
      prev.includes(reqId)
        ? prev.filter(id => id !== reqId)
        : [...prev, reqId]
    );
  }, []);

  // ============ VIEW REQUEST ============
  const handleViewRequest = useCallback((req) => {
    setViewingRequest(req);
    setShowViewModal(true);
  }, []);

  // ============ ADD REQUEST ============
  const handleAddRequest = useCallback(() => {
    setFormRequest(null);
    setFormMode('add');
    setShowFormModal(true);
  }, []);

  // ============ EDIT REQUEST ============
  const handleEditRequest = useCallback((req) => {
    setFormRequest(req);
    setFormMode('edit');
    setShowFormModal(true);
  }, []);

  // ============ SAVE FORM ============
  const saveForm = useCallback((data) => {
    let savedRecord = null;

    setRequests(prev => {
      let updated;
      if (formMode === 'add') {
        const newRequest = {
          ...data,
          bedrooms: parseInt(data.bedrooms) || 1,
          id: `purchase_status_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [{ status: data.status || 'New', date: new Date().toISOString() }]
        };
        updated = [newRequest, ...prev];
        savedRecord = newRequest;
      } else {
        updated = prev.map(r => {
          if (r.id === formRequest.id) {
            const updatedStatusHistory = [...(r.statusHistory || [])];
            if (data.status !== r.status) {
              updatedStatusHistory.push({ status: data.status, date: new Date().toISOString() });
            }
            const updatedRecord = { 
              ...r, 
              ...data, 
              bedrooms: parseInt(data.bedrooms) || 1,
              statusHistory: updatedStatusHistory,
              updatedAt: new Date().toISOString()
            };
            savedRecord = updatedRecord;
            return updatedRecord;
          }
          return r;
        });
      }
      computeStats(updated);
      return updated;
    });

    // Keep the View modal (if open behind the form) in sync with the saved data
    setViewingRequest(prev => (prev && savedRecord && prev.id === savedRecord.id) ? savedRecord : prev);

    setShowFormModal(false);
    setFormRequest(null);
    showToast(formMode === 'add' ? 'Purchase request added successfully' : 'Purchase request updated successfully', 'success');
  }, [formMode, formRequest, computeStats, showToast]);

  // ============ STATUS CHANGE ============
  const handleStatusChange = useCallback((reqId, newStatus) => {
    const request = requests.find(r => r.id === reqId);
    if (!request) return;

    setStatusChangeModal({
      show: true,
      request: request,
      newStatus: newStatus,
      currentStatus: request.status,
      loading: false
    });
  }, [requests]);

  // ============ CONFIRM STATUS CHANGE ============
  const confirmStatusChange = useCallback(() => {
    const { request, newStatus, currentStatus } = statusChangeModal;
    
    setStatusChangeModal(prev => ({ ...prev, loading: true }));

    setTimeout(() => {
      setRequests(prev => {
        const updated = prev.map(r => {
          if (r.id === request.id) {
            const updatedStatusHistory = [...(r.statusHistory || [])];
            updatedStatusHistory.push({ 
              status: newStatus, 
              date: new Date().toISOString() 
            });
            return { 
              ...r, 
              status: newStatus,
              statusHistory: updatedStatusHistory,
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        });
        computeStats(updated);
        return updated;
      });
      
      // Close both modals
      setStatusChangeModal({ 
        show: false, 
        request: null, 
        newStatus: '', 
        currentStatus: '',
        loading: false 
      });
      setShowViewModal(false);
      setViewingRequest(null);
      
      showToast(`Status updated from "${currentStatus}" to "${newStatus}"`, 'success');
    }, 700);
  }, [statusChangeModal, computeStats, showToast]);

  // ============ DELETE REQUEST ============
  const handleDeleteRequest = useCallback((request) => {
    if (!request) return;
    
    setDeleteModal({
      show: true,
      request: request,
      loading: false
    });
  }, []);

  // ============ CONFIRM DELETE ============
  const confirmDelete = useCallback(() => {
    const { request } = deleteModal;
    if (!request) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));

    setTimeout(() => {
      setRequests(prev => {
        const updated = prev.filter(r => r.id !== request.id);
        computeStats(updated);
        return updated;
      });
      
      setDeleteModal({ 
        show: false, 
        request: null, 
        loading: false 
      });
      setShowViewModal(false);
      setViewingRequest(null);
      
      showToast(`${request.buyerName}'s purchase request deleted`, 'error');
    }, 700);
  }, [deleteModal, computeStats, showToast]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedStatus('all');
    setSelectedPropertyType('all');
    setSelectedFurnishing('all');

    if (nextFilter !== 'all') {
      setSelectedStatus(nextFilter);
    }

    setSearchQuery('');
    searchInputRef.current?.focus();
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedPropertyType('all');
    setSelectedFurnishing('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockRequests = generateMockRequests();
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockRequests, showToast]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredRequests.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }

    const data = filteredRequests.map(req => ({
      'Buyer Name': req.buyerName,
      'Email': req.buyerEmail,
      'Phone': req.buyerPhone,
      'Property Name': req.propertyName,
      'Location': req.location,
      'Property Type': req.propertyType,
      'Bedrooms': req.bedrooms,
      'Asking Price (₹)': req.askingPrice,
      'Offer Amount (₹)': req.offerAmount,
      'Booking Amount (₹)': req.bookingAmount,
      'Preferred Possession': new Date(req.preferredPossessionDate).toLocaleDateString(),
      'Payment Mode': req.paymentMode,
      'Furnishing': req.furnishing,
      'Family Size': req.familySize,
      'Employment Type': req.employmentType,
      'Company': req.companyName,
      'Monthly Income (₹)': req.monthlyIncome,
      'Status': req.status,
      'Created At': new Date(req.createdAt).toLocaleDateString(),
      'Updated At': new Date(req.updatedAt || req.createdAt).toLocaleDateString(),
      'Remarks': req.remarks || ''
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase_status_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredRequests.length} records exported successfully`, 'success');
  }, [filteredRequests, showToast]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedRequests.length === 0) {
      showToast('Please select requests first', 'warning');
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedRequests);
      let count = 0;

      setRequests(prev => {
        let updated;
        if (action === 'delete') {
          count = prev.filter(r => selectedIds.has(r.id)).length;
          updated = prev.filter(r => !selectedIds.has(r.id));
        } else {
          updated = prev.map(r => {
            if (!selectedIds.has(r.id)) return r;
            count++;
            const updatedStatusHistory = [...(r.statusHistory || [])];
            updatedStatusHistory.push({ status: action, date: new Date().toISOString() });
            return { 
              ...r, 
              status: action,
              statusHistory: updatedStatusHistory,
              updatedAt: new Date().toISOString()
            };
          });
        }
        computeStats(updated);
        return updated;
      });

      setSelectedRequests([]);
      setActionLoading(null);

      if (action === 'delete') {
        showToast(`${count} request(s) deleted`, 'error');
      } else {
        showToast(`${count} request(s) moved to "${action}"`, 'success');
      }
    }, 800);
  }, [selectedRequests, computeStats, showToast]);

  // ============ STATUS COLOR / ICON HELPERS ============
  const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS['New'];
  const getStatusIcon = (status) => getStatusIconEl(status, 'text-xs');

  // ============ PRICE FORMAT HELPER ============
  const formatPrice = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString()}`;
  };

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

      {/* Add/Edit Modal */}
      <AddEditPurchaseStatusModal
        request={formRequest}
        mode={formMode}
        show={showFormModal}
        onClose={() => { setShowFormModal(false); setFormRequest(null); }}
        onSave={saveForm}
      />

      {/* View Modal */}
      <ViewPurchaseStatusModal
        request={viewingRequest}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingRequest(null); }}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        onStatusChange={handleStatusChange}
      />

      {/* Status Change Confirmation Modal */}
      <StatusChangeConfirmModal
        show={statusChangeModal.show}
        onClose={() => setStatusChangeModal({ 
          show: false, 
          request: null, 
          newStatus: '', 
          currentStatus: '',
          loading: false 
        })}
        onConfirm={confirmStatusChange}
        request={statusChangeModal.request}
        currentStatus={statusChangeModal.currentStatus}
        newStatus={statusChangeModal.newStatus}
        loading={statusChangeModal.loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, request: null, loading: false })}
        onConfirm={confirmDelete}
        request={deleteModal.request}
        loading={deleteModal.loading}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Purchase Request Status
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredRequests.length} Requests
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track purchase request status and progress</span>
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
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={handleAddRequest}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiPlus className="text-sm" />
              <span>Add Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
              <StatCard
                icon={<FiUser className="text-white text-sm" />}
                title="New"
                value={stats.New}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={100}
                isActive={activeFilter === 'New'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('New')}
              />
              <StatCard
                icon={<FiPhone className="text-white text-sm" />}
                title="Contacted"
                value={stats.Contacted}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={200}
                isActive={activeFilter === 'Contacted'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Contacted')}
              />
              <StatCard
                icon={<FiStar className="text-white text-sm" />}
                title="Interested"
                value={stats.Interested}
                color="bg-gradient-to-br from-violet-600 to-violet-400"
                delay={300}
                isActive={activeFilter === 'Interested'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Interested')}
              />
              <StatCard
                icon={<FiEyeIcon className="text-white text-sm" />}
                title="Site Visit"
                value={stats['Site Visit']}
                color="bg-gradient-to-br from-pink-600 to-pink-400"
                delay={400}
                isActive={activeFilter === 'Site Visit'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Site Visit')}
              />
              <StatCard
                icon={<FiFile className="text-white text-sm" />}
                title="Offer Submitted"
                value={stats['Offer Submitted']}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={500}
                isActive={activeFilter === 'Offer Submitted'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Offer Submitted')}
              />
              <StatCard
                icon={<FaHandshake className="text-white text-sm" />}
                title="Negotiation"
                value={stats.Negotiation}
                color="bg-gradient-to-br from-orange-600 to-orange-400"
                delay={600}
                isActive={activeFilter === 'Negotiation'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Negotiation')}
              />
              <StatCard
                icon={<FiCheckCircleIcon className="text-white text-sm" />}
                title="Offer Accepted"
                value={stats['Offer Accepted']}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={700}
                isActive={activeFilter === 'Offer Accepted'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Offer Accepted')}
              />
              <StatCard
                icon={<FiBook className="text-white text-sm" />}
                title="Agreement"
                value={stats.Agreement}
                color="bg-gradient-to-br from-teal-600 to-teal-400"
                delay={800}
                isActive={activeFilter === 'Agreement'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Agreement')}
              />
              <StatCard
                icon={<FiAward className="text-white text-sm" />}
                title="Sale Completed"
                value={stats['Sale Completed']}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={900}
                isActive={activeFilter === 'Sale Completed'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Sale Completed')}
              />
              <StatCard
                icon={<FiXCircleIcon className="text-white text-sm" />}
                title="Closed Lost"
                value={stats['Closed Lost']}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={1000}
                isActive={activeFilter === 'Closed Lost'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('Closed Lost')}
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
              placeholder="Search by buyer name, email, phone, property, location..."
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
                  setSelectedPropertyType('all');
                  setSelectedFurnishing('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                {ALL_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedPropertyType}
                onChange={(e) => {
                  setSelectedPropertyType(e.target.value);
                  setSelectedStatus('all');
                  setSelectedFurnishing('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
                <option value="Individual House">Individual House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
                <option value="Land & Plots">Land & Plots</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedFurnishing}
                onChange={(e) => {
                  setSelectedFurnishing(e.target.value);
                  setSelectedStatus('all');
                  setSelectedPropertyType('all');
                  setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Furnishing</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
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
        {selectedRequests.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedRequests.length}</span> request(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('Offer Accepted')}
                disabled={actionLoading === 'Offer Accepted'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'Offer Accepted' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Accept Offer
              </button>
              <button
                onClick={() => handleBulkAction('Closed Lost')}
                disabled={actionLoading === 'Closed Lost'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'Closed Lost' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Close Lost
              </button>
              <button
                onClick={() => handleBulkAction('Site Visit')}
                disabled={actionLoading === 'Site Visit'}
                className="px-4 py-1.5 bg-pink-50 text-pink-700 rounded-xl hover:bg-pink-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'Site Visit' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiEye className="text-[10px]" />}
                Site Visit
              </button>
              <button
                onClick={() => handleBulkAction('Agreement')}
                disabled={actionLoading === 'Agreement'}
                className="px-4 py-1.5 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'Agreement' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiBook className="text-[10px]" />}
                Agreement
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
                onClick={() => setSelectedRequests([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Requests Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedRequests.map((req, index) => {
              const isSelected = selectedRequests.includes(req.id);

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    req.status === 'Closed Lost' ? 'border-l-4 border-l-red-500' :
                    req.status === 'Offer Accepted' || req.status === 'Sale Completed' ? 'border-l-4 border-l-emerald-500' :
                    req.status === 'Agreement' ? 'border-l-4 border-l-teal-500' :
                    req.status === 'New' ? 'border-l-4 border-l-blue-500' :
                    req.status === 'Site Visit' ? 'border-l-4 border-l-pink-500' :
                    req.status === 'Negotiation' ? 'border-l-4 border-l-orange-500' :
                    req.status === 'Offer Submitted' ? 'border-l-4 border-l-amber-500' :
                    req.status === 'Contacted' ? 'border-l-4 border-l-indigo-500' :
                    req.status === 'Interested' ? 'border-l-4 border-l-violet-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRequest(req.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {req.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{req.buyerName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-0.5 ${getStatusColor(req.status)}`}>
                            {getStatusIcon(req.status)}
                            {req.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      onClick={() => handleViewRequest(req)}
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{req.propertyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{req.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaMoneyBillWave className="text-[#00695C] flex-shrink-0" />
                      <span>Asking {formatPrice(req.askingPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTrendingUp className="text-[#00695C] flex-shrink-0" />
                      <span>Offer {formatPrice(req.offerAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaCalendarAlt className="text-[#00695C] flex-shrink-0" />
                      <span>Possession: {new Date(req.preferredPossessionDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <div className="flex items-center justify-between text-[9px] text-[#5A7D78]">
                      <span>Progress</span>
                      <span className="font-medium text-[#00695C]">
                        {Math.round((ALL_STATUSES.indexOf(req.status) + 1) / ALL_STATUSES.length * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F5F9F8] rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          req.status === 'Closed Lost' ? 'bg-red-500' :
                          req.status === 'Offer Accepted' || req.status === 'Sale Completed' ? 'bg-emerald-500' :
                          req.status === 'Agreement' ? 'bg-teal-500' :
                          'bg-[#00695C]'
                        }`}
                        style={{ width: `${Math.round((ALL_STATUSES.indexOf(req.status) + 1) / ALL_STATUSES.length * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewRequest(req)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRequest(req)}
                      className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req)}
                      disabled={actionLoading === req.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === req.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                  checked={selectedRequests.length === paginatedRequests.length && paginatedRequests.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Buyer</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('buyerName')}>
                Name {sortField === 'buyerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Asking</div>
              <div className="col-span-1">Property</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1 text-center">BHK</div>
              <div className="col-span-1 text-center">Possession</div>
              <div className="col-span-1 text-center">Progress</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedRequests.map((req, index) => {
              const isSelected = selectedRequests.includes(req.id);

              return (
                <div
                  key={req.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRequest(req.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {req.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{req.buyerName}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{req.buyerEmail}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {formatPrice(req.askingPrice)}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{req.propertyName}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{req.propertyType}</div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{req.bedrooms} BHK</div>

                  <div className="col-span-1 text-center text-[10px] text-[#5A7D78]">
                    {new Date(req.preferredPossessionDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#F5F9F8] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            req.status === 'Closed Lost' ? 'bg-red-500' :
                            req.status === 'Offer Accepted' || req.status === 'Sale Completed' ? 'bg-emerald-500' :
                            req.status === 'Agreement' ? 'bg-teal-500' :
                            'bg-[#00695C]'
                          }`}
                          style={{ width: `${Math.round((ALL_STATUSES.indexOf(req.status) + 1) / ALL_STATUSES.length * 100)}%` }}
                        />
                      </div>
                      <span className="text-[8px] text-[#5A7D78] font-medium">
                        {Math.round((ALL_STATUSES.indexOf(req.status) + 1) / ALL_STATUSES.length * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewRequest(req)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRequest(req)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req)}
                      disabled={actionLoading === req.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === req.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedRequests.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiHome className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No purchase requests found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No purchase requests match your current view'}
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
                onClick={handleAddRequest}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105 flex items-center gap-2"
              >
                <FiPlus className="text-sm" /> Add Request
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
              {Math.min(currentPage * pageSize, filteredRequests.length)} of{' '}
              {filteredRequests.length} requests
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

export default PurchaseRequestStatus;