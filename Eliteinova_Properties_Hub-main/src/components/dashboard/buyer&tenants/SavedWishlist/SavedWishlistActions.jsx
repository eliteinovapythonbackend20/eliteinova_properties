// src/components/dashboard/admin/buyer&tenants/SavedWishlist/SavedWishlistActions.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHeart, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch, FiFilter,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiPlus, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiStar, FiShield, FiBriefcase, FiMail, FiPhone, FiExternalLink,
  FiTag, FiGrid, FiHeart as FiHeartSolid, FiTrendingUp, FiTrendingDown,
  FiMinus, FiSend, FiUserCheck, FiUserX, FiBell, FiEye as FiEyeIcon,
  FiUser as FiUserIcon, FiTrash
} from 'react-icons/fi';
import {
  FaHeart, FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaUser, FaUserCircle, FaEnvelope, FaBell, FaEye,
  FaTrashAlt, FaUserFriends
} from 'react-icons/fa';

// ============================================================
// SHARED PROPERTY IMAGES
// (Fix: moved to module scope so the mock-data generator and the
// modal both use real, working Unsplash images instead of a
// randomly-generated, almost-always-broken photo id.)
// ============================================================
const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
];

const getRandomPropertyImage = () =>
  PROPERTY_IMAGES[Math.floor(Math.random() * PROPERTY_IMAGES.length)];

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
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
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
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => {
  return (
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
};

// ============================================================
// NOTIFY USER MODAL
// ============================================================
const NotifyUserModal = ({ show, onClose, onSend, userName, userEmail }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setSubject(`Property Wishlist Update - ${new Date().toLocaleDateString()}`);
      setMessage(`Dear ${userName || 'User'},\n\nWe wanted to inform you about updates to properties in your wishlist. New properties matching your preferences have been added.\n\nPlease log in to your account to view the latest updates.\n\nBest regards,\nTeam`);
    }
  }, [show, userName]);

  if (!show) return null;

  const handleSend = () => {
    if (!subject || !message) return;
    setLoading(true);
    setTimeout(() => {
      onSend(subject, message);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Notify User</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
            >
              <FiX className="text-lg" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-1">Send notification to {userName || 'User'}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#5A7D78] block mb-2">Recipient</label>
            <div className="bg-[#F5F9F8] rounded-xl p-3 flex items-center gap-3">
              <FaUserCircle className="text-[#00695C] text-xl" />
              <div>
                <p className="text-sm font-medium text-[#1A2E2A]">{userName || 'User'}</p>
                <p className="text-xs text-[#5A7D78]">{userEmail || 'user@email.com'}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#5A7D78] block mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
              placeholder="Enter subject..."
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#5A7D78] block mb-2">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
              placeholder="Write your message..."
            />
          </div>

          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <FiInfo className="text-sm" />
              The notification will be sent via email and in-app notification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F9F8] rounded-b-3xl border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium border border-[#E8F0EE]"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !subject || !message}
            className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FiRefreshCw className="animate-spin mx-auto" /> : <FiSend className="inline mr-2" />}
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CONFIRM ACTION MODAL
// ============================================================
const ConfirmActionModal = ({ show, action, itemName, onConfirm, onCancel }) => {
  if (!show) return null;

  const config = {
    remove: {
      icon: <FiTrash className="text-red-600 text-3xl" />,
      title: 'Remove Invalid Property',
      message: `Are you sure you want to remove "${itemName}" from the wishlist? This action cannot be undone.`,
      confirmLabel: 'Remove',
      color: 'red'
    }
  };

  const { icon, title, message, confirmLabel, color } = config[action] || config.remove;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-${color}-50 flex items-center justify-center mx-auto mb-4`}>
            {icon}
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
              className={`flex-1 px-4 py-2.5 bg-${color}-600 text-white rounded-xl hover:bg-${color}-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-${color}-600/30`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW WISHLIST ACTIONS MODAL
// ============================================================
const ViewWishlistActionsModal = ({ item, show, onClose, onRemove, onNotify, onViewProperty, onViewUser }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image state whenever the item changes so a new item
  // doesn't briefly show the previous item's loaded/error state.
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [item?.id]);

  if (!item || !show) return null;

  const statusColors = {
    available: 'bg-[#E8F8F5] text-[#00695C]',
    pending: 'bg-[#FEF3E2] text-amber-700',
    sold: 'bg-gray-100 text-gray-600',
    rented: 'bg-blue-50 text-blue-700'
  };

  // Fix: item.imageUrl is now always a valid, working Unsplash URL
  // (assigned from PROPERTY_IMAGES in generateMockWishlist), so we
  // no longer need a separate random-id fallback here. Kept a safe
  // fallback to PROPERTY_IMAGES in case imageUrl is ever missing.
  const imageUrl = item.imageUrl || getRandomPropertyImage();

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
          <h2 className="text-2xl font-bold text-white">Admin Actions</h2>
          <p className="text-white/80 text-sm">{item.buyerName} · {item.propertyName}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Property Image */}
            <div className="bg-[#F5F9F8] rounded-2xl overflow-hidden relative">
              {!imageLoaded && !imageError && (
                <div className="w-full h-48 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center animate-pulse">
                  <FaImage className="text-4xl text-[#00695C]/20" />
                </div>
              )}
              {imageError ? (
                <div className="w-full h-48 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex flex-col items-center justify-center">
                  <FaHomeSolid className="text-5xl text-[#00695C]/30 mb-2" />
                  <p className="text-sm text-[#5A7D78]">Image not available</p>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={item.propertyName || 'Property'}
                  className={`w-full h-48 object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Item Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">User</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{item.buyerName}</p>
                <p className="text-xs text-[#5A7D78]">{item.buyerEmail}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{item.propertyName}</p>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiTag className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.availabilityStatus] || statusColors.available}`}>
                  {item.availabilityStatus ? item.availabilityStatus.charAt(0).toUpperCase() + item.availabilityStatus.slice(1) : 'Available'}
                </span>
              </div>

              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiHeart className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Wishlist Info</h4>
                </div>
                <p className="text-sm text-[#1A2E2A]">Added on {new Date(item.addedDate).toLocaleDateString()}</p>
                <p className="text-xs text-[#5A7D78]">{item.wishlistCount || 0} people have this in wishlist</p>
              </div>
            </div>

            {/* Admin Actions Section */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiShield className="text-[#00695C]" />
                Admin Actions
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onViewUser && onViewUser(item.buyerId)}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl hover:bg-blue-50 transition-all duration-300 border border-[#E8F0EE] hover:border-blue-200 group"
                >
                  <FaUserCircle className="text-blue-600 text-lg" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-[#1A2E2A]">View User</p>
                    <p className="text-[8px] text-[#5A7D78]">Profile</p>
                  </div>
                </button>
                <button
                  onClick={() => onViewProperty && onViewProperty(item.propertyId)}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl hover:bg-emerald-50 transition-all duration-300 border border-[#E8F0EE] hover:border-emerald-200 group"
                >
                  <FiExternalLink className="text-emerald-600 text-lg" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-[#1A2E2A]">View Property</p>
                    <p className="text-[8px] text-[#5A7D78]">Details</p>
                  </div>
                </button>
                <button
                  onClick={() => onNotify && onNotify(item)}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl hover:bg-purple-50 transition-all duration-300 border border-[#E8F0EE] hover:border-purple-200 group"
                >
                  <FiBell className="text-purple-600 text-lg" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-[#1A2E2A]">Notify User</p>
                    <p className="text-[8px] text-[#5A7D78]">Send alert</p>
                  </div>
                </button>
                <button
                  onClick={() => onRemove && onRemove(item)}
                  className="flex items-center gap-2 p-3 bg-white rounded-xl hover:bg-red-50 transition-all duration-300 border border-[#E8F0EE] hover:border-red-200 group"
                >
                  <FiTrash className="text-red-600 text-lg" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-[#1A2E2A]">Remove Invalid</p>
                    <p className="text-[8px] text-[#5A7D78]">Property</p>
                  </div>
                </button>
              </div>
            </div>
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
              onClick={() => onNotify && onNotify(item)}
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-600/30 hover:scale-[1.02]"
            >
              <FiBell className="inline mr-2" /> Notify
            </button>
            <button
              onClick={() => onRemove && onRemove(item)}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"
            >
              <FiTrash className="inline mr-2" /> Remove
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
const SavedWishlistActions = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('buyerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState('remove');
  const [confirmItem, setConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    sold: 0,
    rented: 0,
    notified: 0,
    removed: 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0,
        available: 0,
        pending: 0,
        sold: 0,
        rented: 0,
        notified: 0,
        removed: 0
      });
      return;
    }

    const total = list.length;
    const available = list.filter(item => item.availabilityStatus === 'available').length;
    const pending = list.filter(item => item.availabilityStatus === 'pending').length;
    const sold = list.filter(item => item.availabilityStatus === 'sold').length;
    const rented = list.filter(item => item.availabilityStatus === 'rented').length;
    const notified = list.filter(item => item.notified).length;
    const removed = list.filter(item => item.removed).length;

    setStats({
      total,
      available,
      pending,
      sold,
      rented,
      notified,
      removed
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockWishlist = useCallback(() => {
    const buyerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta'];
    const buyerEmails = ['rahul@email.com', 'anita@email.com', 'sanjay@email.com', 'divya@email.com', 'karthik@email.com', 'neha@email.com', 'manoj@email.com', 'swati@email.com', 'rohit@email.com', 'pallavi@email.com'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const locations = ['MG Road', 'Banjara Hills', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jubilee Hills', 'Connaught Place', 'Salt Lake'];
    const statuses = ['available', 'pending', 'sold', 'rented'];

    const wishlist = [];
    const usedNames = new Set();

    for (let i = 1; i <= 60; i++) {
      let propertyName, buyerName;
      let attempts = 0;
      do {
        propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
        buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
        attempts++;
      } while (usedNames.has(`${propertyName}_${buyerName}`) && attempts < 50);
      usedNames.add(`${propertyName}_${buyerName}`);

      const price = Math.floor(Math.random() * 8000000 + 2000000);
      const wishlistCount = Math.floor(Math.random() * 15) + 1;

      const addedDate = new Date();
      addedDate.setDate(addedDate.getDate() - Math.floor(Math.random() * 30));

      wishlist.push({
        id: `wish_${i}`,
        buyerId: `buyer_${Math.floor(Math.random() * 10) + 1}`,
        buyerName: buyerName,
        buyerEmail: buyerEmails[Math.floor(Math.random() * buyerEmails.length)],
        propertyId: `prop_${Math.floor(Math.random() * 10) + 1}`,
        propertyName: propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        price: price,
        wishlistCount: wishlistCount,
        availabilityStatus: statuses[Math.floor(Math.random() * statuses.length)],
        addedDate: addedDate.toISOString(),
        notified: Math.random() > 0.7,
        removed: Math.random() > 0.9,
        notes: Math.random() > 0.7 ? 'Interested in this property' : '',
        // Fix: use a real, working image from the shared PROPERTY_IMAGES
        // list instead of a randomly-generated (almost always broken)
        // Unsplash photo id. This is what was causing "Image not available".
        imageUrl: getRandomPropertyImage()
      });
    }

    computeStats(wishlist);
    return wishlist;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockWishlist = generateMockWishlist();
      setWishlistItems(mockWishlist);
      setFilteredItems(mockWishlist);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
    } catch (error) {
      console.error('Error generating mock wishlist:', error);
    }
  }, [generateMockWishlist]);

  // ============ FILTER ITEMS ============
  const filterItems = useCallback(() => {
    try {
      let filtered = [...wishlistItems];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          (item.propertyName && item.propertyName.toLowerCase().includes(query)) ||
          (item.buyerName && item.buyerName.toLowerCase().includes(query)) ||
          (item.buyerEmail && item.buyerEmail.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          (item.propertyType && item.propertyType.toLowerCase().includes(query))
        );
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(item => item.availabilityStatus === selectedStatus);
      }

      let count = 0;
      if (selectedStatus !== 'all') count++;
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

      setFilteredItems(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering wishlist:', error);
    }
  }, [wishlistItems, searchQuery, selectedStatus, sortField, sortDirection]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, pageSize]);

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
    if (selectedItems.length === paginatedItems.length && paginatedItems.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedItems.map(item => item.id));
    }
  }, [selectedItems, paginatedItems]);

  // ============ HANDLE SELECT ITEM ============
  const handleSelectItem = useCallback((itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // ============ VIEW ITEM ============
  const handleViewItem = useCallback((item) => {
    setViewingItem(item);
    setShowViewModal(true);
  }, []);

  // ============ NOTIFY USER ============
  const handleNotifyUser = useCallback((item) => {
    setViewingItem(item);
    setShowNotifyModal(true);
    if (showViewModal) {
      setShowViewModal(false);
    }
  }, [showViewModal]);

  // ============ SEND NOTIFICATION ============
  const handleSendNotification = useCallback((subject, message) => {
    if (!viewingItem) return;

    setWishlistItems(prev => {
      const updated = prev.map(item =>
        item.id === viewingItem.id ? { ...item, notified: true } : item
      );
      computeStats(updated);
      return updated;
    });

    setShowNotifyModal(false);
    setToast({
      message: `Notification sent to ${viewingItem.buyerName}`,
      type: 'success'
    });
  }, [viewingItem, computeStats]);

  // ============ REMOVE INVALID PROPERTY ============
  const handleRemoveProperty = useCallback((item) => {
    setConfirmItem(item);
    setConfirmAction('remove');
    setShowConfirmModal(true);
    if (showViewModal) {
      setShowViewModal(false);
    }
  }, [showViewModal]);

  // ============ CONFIRM REMOVE ============
  const confirmRemove = useCallback(() => {
    if (!confirmItem) return;

    setActionLoading(confirmItem.id);
    setTimeout(() => {
      setWishlistItems(prev => {
        const updated = prev.filter(item => item.id !== confirmItem.id);
        computeStats(updated);
        return updated;
      });
      setActionLoading(null);
      setShowConfirmModal(false);
      setConfirmItem(null);
      setToast({
        message: `Removed "${confirmItem.propertyName}" from wishlist`,
        type: 'warning'
      });
    }, 700);
  }, [confirmItem, computeStats]);

  // ============ VIEW PROPERTY ============
  const handleViewProperty = useCallback((propertyId) => {
    navigate('/properties/details');
    setToast({ message: 'Opening property details...', type: 'info' });
  }, [navigate]);

  // ============ VIEW USER PROFILE ============
  const handleViewUser = useCallback((userId) => {
    navigate('/profile/customer');
    setToast({ message: 'Opening user profile...', type: 'info' });
  }, [navigate]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedStatus('all');

    if (nextFilter === 'available' || nextFilter === 'pending' || nextFilter === 'sold' || nextFilter === 'rented') {
      setSelectedStatus(nextFilter);
    }

    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setActiveFilter('all');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockWishlist = generateMockWishlist();
        setWishlistItems(mockWishlist);
        setFilteredItems(mockWishlist);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockWishlist]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredItems.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = filteredItems.map(item => ({
        'Buyer Name': item.buyerName || '',
        'Buyer Email': item.buyerEmail || '',
        'Property Name': item.propertyName || '',
        'Property Type': item.propertyType || '',
        Location: item.location || '',
        Price: `₹${item.price ? item.price.toLocaleString() : '0'}`,
        'Wishlist Count': item.wishlistCount || 0,
        'Availability Status': item.availabilityStatus ? item.availabilityStatus.charAt(0).toUpperCase() + item.availabilityStatus.slice(1) : '',
        'Added Date': item.addedDate ? new Date(item.addedDate).toLocaleDateString() : '',
        'Notified': item.notified ? 'Yes' : 'No',
        'Removed': item.removed ? 'Yes' : 'No',
        Notes: item.notes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishlist_actions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredItems.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredItems]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedItems.length === 0) {
      setToast({ message: 'Please select items first', type: 'warning' });
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedItems);
      let count = 0;

      setWishlistItems(prev => {
        let updated;
        if (action === 'remove') {
          count = prev.filter(item => selectedIds.has(item.id)).length;
          updated = prev.filter(item => !selectedIds.has(item.id));
        } else if (action === 'notify') {
          updated = prev.map(item => {
            if (!selectedIds.has(item.id)) return item;
            count++;
            return { ...item, notified: true };
          });
        } else {
          updated = prev;
        }
        computeStats(updated);
        return updated;
      });

      setSelectedItems([]);
      setActionLoading(null);

      if (action === 'remove') {
        setToast({ message: `${count} item(s) removed from wishlist`, type: 'warning' });
      } else if (action === 'notify') {
        setToast({ message: `${count} user(s) notified`, type: 'success' });
      }
    }, 800);
  }, [selectedItems, computeStats]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
      pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
      sold: 'bg-gray-100 text-gray-600 border-gray-200',
      rented: 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return colors[status] || colors.available;
  };

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

      {/* Toast */}
      <Toast toast={toast} setToast={setToast} />

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        show={showConfirmModal}
        action={confirmAction}
        itemName={confirmItem?.propertyName || ''}
        onCancel={() => { setShowConfirmModal(false); setConfirmItem(null); }}
        onConfirm={confirmRemove}
      />

      {/* Notify User Modal */}
      {viewingItem && (
        <NotifyUserModal
          show={showNotifyModal}
          onClose={() => { setShowNotifyModal(false); setViewingItem(null); }}
          onSend={handleSendNotification}
          userName={viewingItem.buyerName}
          userEmail={viewingItem.buyerEmail}
        />
      )}

      {/* View Wishlist Actions Modal */}
      {showViewModal && viewingItem && (
        <ViewWishlistActionsModal
          item={viewingItem}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingItem(null); }}
          onRemove={handleRemoveProperty}
          onNotify={handleNotifyUser}
          onViewProperty={handleViewProperty}
          onViewUser={handleViewUser}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Admin Actions
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredItems.length} Items
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>View User Wishlist</span>
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

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-3">
              <StatCard
                icon={<FiHeart className="text-white text-sm" />}
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Available"
                value={stats.available}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={50}
                isActive={activeFilter === 'available'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('available')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Sold"
                value={stats.sold}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={150}
                isActive={activeFilter === 'sold'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('sold')}
              />
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Rented"
                value={stats.rented}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={200}
                isActive={activeFilter === 'rented'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('rented')}
              />
              <StatCard
                icon={<FiBell className="text-white text-sm" />}
                title="Notified"
                value={stats.notified}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={250}
                isActive={activeFilter === 'notified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('notified')}
              />
              <StatCard
                icon={<FiTrash className="text-white text-sm" />}
                title="Removed"
                value={stats.removed}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={300}
                isActive={activeFilter === 'removed'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('removed')}
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
              placeholder="Search by buyer name, property name, location, or property type..."
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
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
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
        {selectedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedItems.length}</span> item(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('notify')}
                disabled={actionLoading === 'notify'}
                className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'notify' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiBell className="text-[10px]" />}
                Notify All
              </button>
              <button
                onClick={() => handleBulkAction('remove')}
                disabled={actionLoading === 'remove'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'remove' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash className="text-[10px]" />}
                Remove All
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedItems.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    item.availabilityStatus === 'available' ? 'border-l-4 border-l-emerald-500' :
                    item.availabilityStatus === 'pending' ? 'border-l-4 border-l-amber-500' :
                    item.availabilityStatus === 'sold' ? 'border-l-4 border-l-gray-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          <FaHeart className="text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{item.buyerName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(item.availabilityStatus)}`}>
                            {item.availabilityStatus ? item.availabilityStatus.charAt(0).toUpperCase() + item.availabilityStatus.slice(1) : 'N/A'}
                          </span>
                          {item.notified && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700">
                              Notified
                            </span>
                          )}
                          {item.removed && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-red-50 text-red-700">
                              Removed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewItem(item)}
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      title="View Actions"
                    >
                      <FiShield className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium text-[#1A2E2A]">{item.buyerName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{item.propertyName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaBuilding className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{item.propertyType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{item.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span>₹{item.price ? item.price.toLocaleString() : '0'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewItem(item)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiShield className="text-[10px]" /> Actions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNotifyUser(item)}
                      className="flex-1 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiBell className="text-[10px]" /> Notify
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveProperty(item)}
                      disabled={actionLoading === item.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === item.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash className="text-[10px]" />}
                      Remove
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
                  checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>#</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('buyerName')}>
                User {sortField === 'buyerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyName')}>
                Property {sortField === 'propertyName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Notified</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            {paginatedItems.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      <FaHeart className="text-white text-xs" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{item.buyerName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{item.buyerEmail || 'N/A'}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm font-medium text-[#1A2E2A] truncate">{item.propertyName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{item.location || 'N/A'}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(item.availabilityStatus)}`}>
                      {item.availabilityStatus ? item.availabilityStatus.charAt(0).toUpperCase() + item.availabilityStatus.slice(1) : 'N/A'}
                    </span>
                  </div>

                  <div className="col-span-1 text-center">
                    {item.notified ? (
                      <FiCheckCircle className="text-emerald-500 mx-auto text-sm" />
                    ) : (
                      <FiXCircle className="text-gray-300 mx-auto text-sm" />
                    )}
                  </div>

                  <div className="col-span-1 text-center text-sm font-semibold text-[#1A2E2A]">
                    ₹{item.price ? Math.floor(item.price / 100000) : 0}L
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewItem(item)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View Actions"
                    >
                      <FiShield className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNotifyUser(item)}
                      className="w-7 h-7 rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-purple-600 hover:scale-110"
                      title="Notify User"
                    >
                      <FiBell className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewUser(item.buyerId)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="View User Profile"
                    >
                      <FiUserIcon className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewProperty(item.propertyId)}
                      className="w-7 h-7 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-emerald-600 hover:scale-110"
                      title="View Property"
                    >
                      <FiExternalLink className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveProperty(item)}
                      disabled={actionLoading === item.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
                      title="Remove Invalid Property"
                    >
                      {actionLoading === item.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedItems.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiShield className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No wishlist items</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No items found in wishlist'}
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
              {Math.min(currentPage * pageSize, filteredItems.length)} of{' '}
              {filteredItems.length} items
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

export default SavedWishlistActions;