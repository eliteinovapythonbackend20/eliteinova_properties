// src/components/dashboard/properties/AllProperties.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiMail, FiPhone, FiExternalLink, FiTag, FiGrid, FiSave,
  FiClock as FiClockIcon, FiUserCheck, FiBriefcase,
  FiFileText, FiStar, FiShield, FiTool, FiTrendingUp,
  FiUserPlus, FiPhoneCall, FiThumbsUp, FiThumbsDown, FiTarget,
  FiGlobe, FiSmartphone, FiRadio, FiShare2, FiHash, FiBookmark,
  FiFilter, FiCheck, FiMinus, FiPlus, FiEyeOff, FiEye as FiEyeIcon,
  FiHome as FiHomeIcon, FiAward, FiBarChart2, FiMap, FiChevronUp,
  FiCheckCircle as FiCheckCircleIcon, FiXCircle as FiXCircleIcon,
  FiCheckSquare, FiSquare, FiToggleLeft, FiToggleRight
} from 'react-icons/fi';
import {
  FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaCalendarAlt, FaClock, FaPhoneAlt, FaUserCircle,
  FaComments, FaClipboardList, FaHandshake, FaWhatsapp, FaGoogle,
  FaUser, FaEnvelope, FaPhone, FaTag as FaTagSolid, FaCity,
  FaBuilding as FaBuildingSolid, FaUserCog, FaCalendarDay,
  FaUserCheck as FaUserCheckSolid, FaMapMarkerAlt, FaUserFriends,
  FaRegUser, FaRegBuilding, FaUserGraduate, FaRegBuilding as FaBuildingReg,
  FaStore, FaHome, FaWarehouse, FaTree, FaHotel, FaBuilding as FaBuildingIcon,
  FaRegBuilding as FaBuildingOutline
} from 'react-icons/fa';
import adminDashboardService from '../../../services/adminDashboardService';
import { houseTypes, apartmentTypes, commercialTypes, landTypes, landSubMenuTypes, hostelType } from '../../../hooks/useNavigation';

// Real backend enum values <-> this page's display keys. The backend now
// supports Active/Inactive/Pending/Sold/Rented/Expired/Rejected and these
// four posted_by roles, plus real featured/verificationStatus columns.

const CATEGORY_FROM_BACKEND = {
  INDIVIDUAL: 'Individual',
  APARTMENT: 'Apartment',
  COMMERCIAL: 'Commercial',
  LAND_PLOT: 'Land & Plots',
  HOSTEL: 'Hostel',
};

const OWNER_TYPE_FROM_BACKEND = {
  OWNER: 'Owner',
  AGENT: 'Agent',
  BUILDER: 'Builder',
  PROPERTY_MANAGEMENT: 'Property Manager',
};

const LISTING_TYPE_FROM_BACKEND = {
  SELL: 'Buy',
  RENT: 'Rent',
  LEASE: 'Lease',
};

// Reverse of the two maps above - used to translate this page's active
// filter selections (Category / Listing dropdowns, stat cards) back into
// the query params the backend list/stats endpoints actually accept.
const CATEGORY_TO_BACKEND = Object.fromEntries(
  Object.entries(CATEGORY_FROM_BACKEND).map(([backend, ui]) => [ui, backend])
);
const LISTING_TYPE_TO_BACKEND = Object.fromEntries(
  Object.entries(LISTING_TYPE_FROM_BACKEND).map(([backend, ui]) => [ui, backend])
);

// "Featured" and "Verified" are stat-card/filter options in the UI, but
// they're NOT values of the status column - they're the separate
// featured/verification_status columns. Sending them as `status=Featured`
// matches nothing on the backend, which is why that filter used to always
// come back empty. This translates the single activeStatus selection into
// whichever real param(s) it actually corresponds to.
function statusFilterParams(activeStatus) {
  if (activeStatus === 'all') return {};
  if (activeStatus === 'Featured') return { featured: true };
  if (activeStatus === 'Verified') return { verificationStatus: 'Verified' };
  return { status: activeStatus };
}

function formatInr(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

// Vendors can optionally set a negotiation range (priceMin/priceMax) alongside
// the required expectedPrice - when they have, that range is more informative
// than the single figure, so it takes priority here.
function formatPriceRange(card) {
  const { priceMin, priceMax, expectedPrice } = card;
  if (priceMin != null && priceMax != null) return `${formatInr(priceMin)} - ${formatInr(priceMax)}`;
  if (priceMin != null) return `${formatInr(priceMin)}+`;
  if (priceMax != null) return `Up to ${formatInr(priceMax)}`;
  if (expectedPrice != null) return formatInr(expectedPrice);
  return '';
}

// Reverses formatPriceRange's output back into raw numbers, for the Edit
// modal's Save. Best-effort: the field is a free-text input, so anything
// that doesn't match one of the four formats formatPriceRange produces is
// left unparsed (returns {}) rather than guessing and risking bad data.
function parsePriceRangeInput(text) {
  if (!text || typeof text !== 'string') return {};
  const trimmed = text.trim();
  const toNumber = (s) => {
    const n = Number(s.replace(/[₹,\s]/g, ''));
    return Number.isFinite(n) ? n : null;
  };

  const upToMatch = trimmed.match(/^Up to\s*(.+)$/i);
  if (upToMatch) {
    const max = toNumber(upToMatch[1]);
    return max != null ? { priceMax: max } : {};
  }

  const plusMatch = trimmed.match(/^(.+?)\+$/);
  if (plusMatch) {
    const min = toNumber(plusMatch[1]);
    return min != null ? { priceMin: min } : {};
  }

  const rangeMatch = trimmed.match(/^(.+?)\s*-\s*(.+)$/);
  if (rangeMatch) {
    const min = toNumber(rangeMatch[1]);
    const max = toNumber(rangeMatch[2]);
    return min != null && max != null ? { priceMin: min, priceMax: max } : {};
  }

  const single = toNumber(trimmed);
  return single != null ? { expectedPrice: single } : {};
}

function mapAdminPropertyToUI(card) {
  return {
    id: card.id,
    propertyId: card.id,
    propertyName: card.propertyTitle || 'Untitled Property',
    category: CATEGORY_FROM_BACKEND[card.propertyCategory] || card.propertyCategory,
    propertyType: card.propertyType || '',
    // Only ever set for Land & Plots (e.g. "Residential Land") - every other
    // category leaves this blank and shows Property Type alone.
    subcategory: card.subCategory || '',
    listingType: LISTING_TYPE_FROM_BACKEND[card.listingPurpose] || card.listingPurpose,
    location: card.address || '',
    district: card.district || '',
    city: card.city || '',
    area: card.state || '',
    priceRange: formatPriceRange(card),
    ownerType: OWNER_TYPE_FROM_BACKEND[card.postedBy] || card.postedBy,
    // Owner/Agent -> the person's name; Builder/Property Management -> their
    // company name (postedByName already resolves which on the backend).
    // Falls back to the login email only if that role's detail row is missing.
    ownerAgent: card.postedByName || card.vendorEmail || '',
    status: card.status || 'Active',
    verificationStatus: card.verificationStatus || 'Not Verified',
    featured: !!card.featured,
    postedDate: card.createdAt ? card.createdAt.split('T')[0] : '',
    description: card.description || '',
    coverImage: card.coverImage || null,
    userId: card.userId,
  };
}

// ============================================================
// PROPERTY CATEGORY CONFIG
// ============================================================
const PROPERTY_CATEGORIES = {
  'Individual': {
    icon: FaHomeSolid,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Individual'
  },
  'Apartment': {
    icon: FaBuildingSolid,
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Apartment'
  },
  'Commercial': {
    icon: FaStore,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Commercial'
  },
  'Land & Plots': {
    icon: FaTree,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Land & Plots'
  },
  'Hostel': {
    icon: FaHotel,
    color: 'from-rose-600 to-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    label: 'Hostel'
  }
};

// ============================================================
// PROPERTY STATUS CONFIG
// ============================================================
const STATUS_CONFIG = {
  'Active': { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Active' },
  'Pending': { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' },
  'Sold': { color: 'bg-blue-600', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Sold' },
  'Rented': { color: 'bg-purple-600', text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Rented' },
  'Expired': { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Expired' },
  'Rejected': { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejected' },
  'Inactive': { color: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', label: 'Inactive' }
};

const VERIFICATION_STATUS = {
  'Verified': { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: FiCheckCircle },
  'Pending': { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: FiClock },
  'Rejected': { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: FiXCircle },
  'Not Verified': { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: FiEyeOff }
};

// ============================================================
// OWNER/AGENT/BUILDER/PROPERTY MANAGER CONFIG
// ============================================================
const OWNER_TYPES = {
  'Owner': {
    icon: FaUser,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Owner',
    placeholder: 'Enter owner name'
  },
  'Agent': {
    icon: FiUserCheck,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Agent',
    placeholder: 'Enter agent name'
  },
  'Builder': {
    icon: FaBuildingSolid,
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Builder',
    placeholder: 'Enter builder name'
  },
  'Property Manager': {
    icon: FiBriefcase,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Property Manager',
    placeholder: 'Enter property manager name'
  }
};

// ============================================================
// PROPERTY TYPES (per category) & LAND SUBCATEGORIES
// ============================================================
// Sourced directly from useNavigation.js's type lists - that's the same data
// the public browse/filter routes use, so these are the exact property_type
// strings the backend actually stores (not a hand-typed, drifting copy).
// Land & Plots is the one category with a real Subcategory tier - and per
// how the backend actually stores it (verified against live records), that
// tier is inverted from what the field names might suggest: subCategory
// holds the broad land classification (landTypes, e.g. "Residential Land /
// Plots") while propertyType holds the specific plot type underneath it
// (landSubMenuTypes, e.g. "Residential Plot") - so Property Type is scoped
// by the selected Subcategory, not the other way around.
const PROPERTY_TYPES_BY_CATEGORY = {
  'Individual': houseTypes.map(t => t.name),
  'Apartment': apartmentTypes.map(t => t.name),
  'Commercial': commercialTypes.map(t => t.name),
  'Hostel': hostelType.map(t => t.name)
};

const LAND_SUBCATEGORY_OPTIONS = landTypes.filter(t => t.name !== 'All').map(t => t.name);

const LAND_PROPERTY_TYPES_BY_SUBCATEGORY = landSubMenuTypes.reduce((acc, sub) => {
  (acc[sub.propertyName] = acc[sub.propertyName] || []).push(sub.name);
  return acc;
}, {});

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
// CONFIRMATION MODAL
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      border: 'border-red-200'
    },
    warning: {
      icon: 'text-amber-600',
      bg: 'bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      border: 'border-amber-200'
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      border: 'border-blue-200'
    },
    success: {
      icon: 'text-emerald-600',
      bg: 'bg-emerald-50',
      button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
      border: 'border-emerald-200'
    }
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
            onClick={() => {
              onConfirm();
              onClose();
            }}
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
// VIEW PROPERTY DETAIL MODAL
// ============================================================
const ViewPropertyDetailModal = ({ property, show, onClose, onEdit, onDelete }) => {
  if (!property || !show) return null;

  const categoryConfig = PROPERTY_CATEGORIES[property.category] || PROPERTY_CATEGORIES['Individual'];
  const CategoryIcon = categoryConfig.icon;
  const statusConfig = STATUS_CONFIG[property.status] || STATUS_CONFIG['Pending'];
  const verifyConfig = VERIFICATION_STATUS[property.verificationStatus] || VERIFICATION_STATUS['Not Verified'];
  const VerifyIcon = verifyConfig.icon;
  const ownerTypeConfig = OWNER_TYPES[property.ownerType] || OWNER_TYPES['Owner'];
  const OwnerIcon = ownerTypeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl ${categoryConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${categoryConfig.text} shadow-lg`}>
              <CategoryIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{property.propertyName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig.bg} ${categoryConfig.text} border ${categoryConfig.border}`}>
                  {categoryConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>ID: {property.propertyId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
              {property.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${verifyConfig.bg} ${verifyConfig.text} border ${verifyConfig.border}`}>
              <VerifyIcon className="text-xs" /> {property.verificationStatus}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200">
                <FiStar className="text-xs" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.propertyId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaHomeSolid className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.propertyName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaTagSolid className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Category</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.category}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTag className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.propertyType}</p>
            </div>

            {/* Land & Plots is the only category with a real subcategory
                value distinct from Property Type - shown alongside it only then. */}
            {property.category === 'Land & Plots' && property.subcategory && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiTag className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Subcategory</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A]">{property.subcategory}</p>
              </div>
            )}

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiBriefcase className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Listing Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.listingType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.location}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCity className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">District</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.district}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCity className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">City</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.city}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMap className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Area</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.area}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiDollarSign className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Price Range</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.priceRange}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUserTie className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Owner / Agent / Builder / PM</h4>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {property.ownerType && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    OWNER_TYPES[property.ownerType]?.bg || 'bg-gray-50'
                  } ${
                    OWNER_TYPES[property.ownerType]?.text || 'text-gray-700'
                  } border ${
                    OWNER_TYPES[property.ownerType]?.border || 'border-gray-200'
                  }`}>
                    <OwnerIcon className="text-[8px] inline mr-1" />
                    {property.ownerType}
                  </span>
                )}
                <p className="text-sm font-bold text-[#1A2E2A]">{property.ownerAgent || 'Not specified'}</p>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiShield className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Status</h4>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                {property.status}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCheckCircle className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Verification Status</h4>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${verifyConfig.bg} ${verifyConfig.text} border ${verifyConfig.border}`}>
                <VerifyIcon className="text-[10px] inline mr-1" />
                {property.verificationStatus}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiStar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Featured Status</h4>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                property.featured ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {property.featured ? 'Featured' : 'Not Featured'}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Posted Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.postedDate}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Description</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.description || 'No description available'}</p>
            </div>
          </div>
        </div>

        {/* Footer - Only Close, Edit, Delete */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={() => { if (onEdit) { onEdit(property); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(property.id); } }}
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

// ============================================================
// EDIT PROPERTY MODAL
// ============================================================
const EditPropertyModal = ({ property, show, onClose, onSave }) => {
  if (!property || !show) return null;

  const [formData, setFormData] = useState({
    propertyId: '',
    propertyName: '',
    category: '',
    propertyType: '',
    subcategory: '',
    listingType: '',
    location: '',
    district: '',
    city: '',
    area: '',
    priceRange: '',
    ownerType: '',
    ownerAgent: '',
    status: '',
    verificationStatus: '',
    featured: false,
    postedDate: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const categoryOptions = Object.keys(PROPERTY_CATEGORIES);
  // ---- 'sell' removed: only Buy, Rent, Lease ----
  const listingTypeOptions = ['Buy', 'Rent', 'Lease'];
  const statusOptions = ['Active', 'Inactive', 'Pending', 'Sold', 'Rented', 'Expired', 'Rejected'];
  const verificationOptions = ['Verified', 'Pending', 'Rejected', 'Not Verified'];

  useEffect(() => {
    if (property) {
      setFormData({
        propertyId: property.propertyId || '',
        propertyName: property.propertyName || '',
        category: property.category || '',
        propertyType: property.propertyType || '',
        subcategory: property.subcategory || '',
        // Normalize any legacy 'sell' value coming from an existing record
        listingType: property.listingType && property.listingType.toLowerCase() === 'sell'
          ? 'Buy'
          : (property.listingType || ''),
        location: property.location || '',
        district: property.district || '',
        city: property.city || '',
        area: property.area || '',
        priceRange: property.priceRange || '',
        ownerType: property.ownerType || '',
        ownerAgent: property.ownerAgent || '',
        status: property.status || '',
        verificationStatus: property.verificationStatus || '',
        featured: property.featured || false,
        postedDate: property.postedDate || '',
        description: property.description || ''
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const updatedProperty = {
        ...property,
        ...formData
      };
      onSave(updatedProperty);
      setLoading(false);
      onClose();
    }, 700);
  };

  // Property Type / Subcategory options for the selected category (real
  // values, from useNavigation.js). Only Land & Plots has a Subcategory tier,
  // and there Property Type is scoped by the selected Subcategory (see the
  // note above PROPERTY_TYPES_BY_CATEGORY).
  const isLandCategory = formData.category === 'Land & Plots';
  const availableSubcategories = isLandCategory ? LAND_SUBCATEGORY_OPTIONS : [];
  const availablePropertyTypes = isLandCategory
    ? LAND_PROPERTY_TYPES_BY_SUBCATEGORY[formData.subcategory] || []
    : (formData.category ? PROPERTY_TYPES_BY_CATEGORY[formData.category] || [] : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Property</h2>
          <p className="text-white/80 text-sm">Update property details</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaHomeSolid className="text-[#00695C]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property ID</label>
                  <input
                    type="text"
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="PROP-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Name *</label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {isLandCategory && (
                  <div>
                    <label className="block text-xs font-medium text-[#5A7D78] mb-1">Subcategory</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    >
                      <option value="">Select Subcategory</option>
                      {availableSubcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    disabled={isLandCategory && !formData.subcategory}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none disabled:bg-[#F5F9F8] disabled:cursor-not-allowed"
                  >
                    <option value="">{isLandCategory && !formData.subcategory ? 'Select Subcategory first' : 'Select Property Type'}</option>
                    {availablePropertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Listing Type *</label>
                  <select
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Listing Type</option>
                    {listingTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiMapPin className="text-[#00695C]" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Street, Area"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="District"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Area/Locality"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" />
                Pricing & Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Price Range *</label>
                  <input
                    type="text"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="₹50L - ₹75L"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaUserTie className="text-[#00695C]" />
                Owner / Agent / Builder / Property Manager
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Type *</label>
                  <select
                    name="ownerType"
                    value={formData.ownerType || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Type</option>
                    {Object.keys(OWNER_TYPES).map(type => {
                      const config = OWNER_TYPES[type];
                      return (
                        <option key={type} value={type}>{config.label}</option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Name *</label>
                  <input
                    type="text"
                    name="ownerAgent"
                    value={formData.ownerAgent}
                    onChange={handleChange}
                    required
                    placeholder={formData.ownerType ? OWNER_TYPES[formData.ownerType]?.placeholder || 'Enter name' : 'Select type first'}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiFileText className="text-[#00695C]" />
                Description & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Describe the property..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Verification Status</label>
                  <select
                    name="verificationStatus"
                    value={formData.verificationStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Verification</option>
                    {verificationOptions.map(ver => (
                      <option key={ver} value={ver}>{ver}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Posted Date</label>
                  <input
                    type="date"
                    name="postedDate"
                    value={formData.postedDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-[#1A2E2A] cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    Featured Property
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <FiSave className="inline" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 animate-slide-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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
          <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// FILTER DROPDOWN COMPONENT
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : allLabel;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md ${
          value !== 'all' 
            ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' 
            : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
          <button
            onClick={() => {
              onChange('all');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>{allLabel}</span>
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
                value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
              }`}
            >
              <span className="w-4">{value === option.value && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
              {option.icon && <span className="text-sm">{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const AllProperties = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Search box types into searchQuery immediately (for responsive UI), but
  // the actual backend search request only fires 1500ms after typing stops.
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('postedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeListingType, setActiveListingType] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: null,
    onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
    rented: 0,
    featured: 0,
    expired: 0,
    rejected: 0,
    inactive: 0,
    verified: 0
  });

  // ============ NORMALIZE LEGACY DATA ============
  // Converts any legacy 'sell' listingType (case-insensitive) into 'Buy'.
  // Only Buy, Rent, Lease are valid listing types going forward.
  const normalizeListingType = useCallback((property) => {
    if (property && property.listingType && property.listingType.toLowerCase() === 'sell') {
      return { ...property, listingType: 'Buy' };
    }
    return property;
  }, []);

  const normalizeProperties = useCallback((list) => {
    if (!list) return list;
    return list.map(normalizeListingType);
  }, [normalizeListingType]);

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, active: 0, pending: 0, sold: 0, rented: 0, featured: 0, expired: 0, rejected: 0, inactive: 0, verified: 0 });
      return;
    }

    const total = list.length;
    const active = list.filter(p => p.status === 'Active').length;
    const pending = list.filter(p => p.status === 'Pending').length;
    const sold = list.filter(p => p.status === 'Sold').length;
    const rented = list.filter(p => p.status === 'Rented').length;
    const featured = list.filter(p => p.featured).length;
    const expired = list.filter(p => p.status === 'Expired').length;
    const rejected = list.filter(p => p.status === 'Rejected').length;
    const inactive = list.filter(p => p.status === 'Inactive').length;
    const verified = list.filter(p => p.verificationStatus === 'Verified').length;

    setStats({ total, active, pending, sold, rented, featured, expired, rejected, inactive, verified });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockProperties = useCallback(() => {
    const propertyNames = [
      'Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate',
      'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes',
      'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa',
      'Emerald Greens', 'Pearl Residency', 'Ruby Enclave', 'Sapphire Heights'
    ];
    const locations = ['MG Road', 'Banjara Hills', 'Jubilee Hills', 'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Gachibowli'];
    const districts = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad'];
    const cities = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad'];
    const areas = ['Jubilee Hills', 'Koramangala', 'T Nagar', 'Bandra', 'Connaught Place', 'Koregaon Park', 'Salt Lake', 'Vastrapur'];
    const ownerAgents = ['Raj Properties', 'Priya Realty', 'Amit Homes', 'Sneha Estates', 'Vikram Realtors', 'Deepa Properties', 'Arjun Builders', 'Meera Developers'];
    const ownerTypeOptions = ['Owner', 'Agent', 'Builder', 'Property Manager'];
    const priceRanges = ['₹20L - ₹35L', '₹35L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1Cr', '₹1Cr - ₹1.5Cr', '₹1.5Cr - ₹2Cr', '₹2Cr+'];
    const statuses = ['Active', 'Inactive', 'Pending', 'Sold', 'Rented', 'Expired', 'Rejected'];
    const verificationStatuses = ['Verified', 'Pending', 'Rejected', 'Not Verified'];
    const categories = Object.keys(PROPERTY_CATEGORIES);
    // ---- 'sell' removed: only Buy, Rent, Lease ----
    const listingTypes = ['Buy', 'Rent', 'Lease'];

    const propertiesList = [];

    for (let i = 1; i <= 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const subcategories = PROPERTY_TYPES_BY_CATEGORY[category] || ['Standard'];
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];

      const daysAgo = Math.floor(Math.random() * 60);
      const postedDate = new Date();
      postedDate.setDate(postedDate.getDate() - daysAgo);

      const isFeatured = Math.random() > 0.7;

      propertiesList.push({
        id: `prop_${i}`,
        propertyId: `PROP-${String(i).padStart(4, '0')}`,
        propertyName: propertyNames[Math.floor(Math.random() * propertyNames.length)],
        category,
        subcategory,
        listingType: listingTypes[Math.floor(Math.random() * listingTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        district: districts[Math.floor(Math.random() * districts.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        area: areas[Math.floor(Math.random() * areas.length)],
        priceRange: priceRanges[Math.floor(Math.random() * priceRanges.length)],
        ownerType: ownerTypeOptions[Math.floor(Math.random() * ownerTypeOptions.length)],
        ownerAgent: ownerAgents[Math.floor(Math.random() * ownerAgents.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        verificationStatus: verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)],
        featured: isFeatured,
        postedDate: postedDate.toISOString().split('T')[0],
        description: `Beautiful ${category.toLowerCase()} property with excellent amenities and prime location.`
      });
    }

    propertiesList.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

    computeStats(propertiesList);
    return propertiesList;
  }, [computeStats]);

  // ============ FETCH GLOBAL STATS FROM BACKEND ============
  // Independent of the paginated list below - always reflects the complete
  // dataset (every property, every status), not just whatever page/limit is
  // currently on screen. Only re-run on mount and after an action that
  // actually changes a property's status (activate/deactivate/delete), never
  // as a side effect of paging, filtering, or searching the list below.
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminDashboardService.getPropertyStats();
      const data = response?.data || {};
      setStats({
        total: data.total || 0,
        active: data.active || 0,
        pending: data.pending || 0,
        sold: data.sold || 0,
        rented: data.rented || 0,
        featured: data.featured || 0,
        expired: data.expired || 0,
        rejected: data.rejected || 0,
        inactive: data.inactive || 0,
        verified: data.verified || 0,
      });
    } catch (error) {
      console.error('Error fetching property stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ============ DEBOUNCE SEARCH ============
  // The backend request only fires once typing has paused for 1500ms - and
  // resets back to page 1, since a new search scope makes the old page
  // number meaningless.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 1500);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    let count = 0;
    if (activeCategory !== 'all') count++;
    if (activeStatus !== 'all') count++;
    if (activeListingType !== 'all') count++;
    if (searchQuery) count++;
    setFilterCount(count);
  }, [activeCategory, activeStatus, activeListingType, searchQuery]);

  // ============ FETCH THE CURRENT PAGE FROM BACKEND ============
  // Category / Status / Listing / search filters are all sent as query
  // params - the backend returns only the matching rows for the requested
  // page, so none of that filtering happens client-side any more.
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminDashboardService.listProperties({
        page: currentPage,
        limit: pageSize,
        propertyCategory: activeCategory !== 'all' ? CATEGORY_TO_BACKEND[activeCategory] : undefined,
        listingPurpose: activeListingType !== 'all' ? LISTING_TYPE_TO_BACKEND[activeListingType] : undefined,
        search: debouncedSearchQuery || undefined,
        ...statusFilterParams(activeStatus),
      });
      const mapped = normalizeProperties((response?.data || []).map(mapAdminPropertyToUI));
      setProperties(mapped);
      setTotalCount(response?.pagination?.total ?? mapped.length);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setToast({ message: error?.response?.data?.detail || 'Failed to load properties', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, activeCategory, activeStatus, activeListingType, debouncedSearchQuery, normalizeProperties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ============ SORT (client-side, current page only) ============
  // The backend has no sort endpoint, so column-header sorting only
  // reorders whatever page is already loaded - it's a display convenience,
  // not a substitute for the real filtering/searching above (which the
  // backend fully owns).
  const filteredProperties = useMemo(() => {
    const sorted = [...properties];
    sorted.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [properties, sortField, sortDirection]);

  // ============ PAGINATION ============
  // The backend already returns exactly one page (limit = pageSize), so
  // paginatedProperties is just the (sorted) current page - no client-side
  // slicing needed. totalPages comes from the backend's total match count,
  // not the size of whatever's currently loaded.
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedProperties = filteredProperties;

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
    if (selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(paginatedProperties.map(p => p.id));
    }
  }, [selectedProperties, paginatedProperties]);

  // ============ HANDLE SELECT PROPERTY ============
  const handleSelectProperty = useCallback((propertyId) => {
    setSelectedProperties(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  }, []);

  // ============ VIEW PROPERTY ============
  const handleViewProperty = useCallback((property) => {
    setViewingProperty(property);
    setShowViewModal(true);
  }, []);

  // ============ EDIT PROPERTY ============
  const handleEditProperty = useCallback((property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDITED PROPERTY ============
  const handleSaveProperty = useCallback((updatedProperty) => {
    const normalized = normalizeListingType(updatedProperty);
    // Everything with a real, unambiguous BaseProperty column goes over the
    // wire. Left out on purpose: propertyId (primary key, never editable),
    // ownerType/ownerAgent (that's cross-table identity data in
    // OwnerProperty/PropertyAgentDetails/etc., not a column on the property
    // itself - flipping posted_by here without also moving that data would
    // break postedByName), and postedDate (created_at is an audit field,
    // not user data).
    adminDashboardService.updateProperty(normalized.id, {
      propertyTitle: normalized.propertyName,
      description: normalized.description,
      status: normalized.status,
      featured: normalized.featured,
      verificationStatus: normalized.verificationStatus,
      propertyCategory: CATEGORY_TO_BACKEND[normalized.category] || undefined,
      propertyType: normalized.propertyType || undefined,
      subCategory: normalized.subcategory || undefined,
      listingPurpose: LISTING_TYPE_TO_BACKEND[normalized.listingType] || undefined,
      address: normalized.location || undefined,
      district: normalized.district || undefined,
      city: normalized.city || undefined,
      state: normalized.area || undefined,
      ...parsePriceRangeInput(normalized.priceRange),
    })
      .then(async () => { await fetchProperties(); await fetchStats(); })
      .then(() => setToast({ message: `Property "${normalized.propertyName}" updated successfully`, type: 'success' }))
      .catch((error) => {
        console.error('Failed to update property:', error);
        setToast({ message: error?.response?.data?.detail || 'Failed to update property', type: 'error' });
      });
  }, [fetchProperties, fetchStats, normalizeListingType]);

  // ============ ACTION HANDLERS ============
  const handleApprove = useCallback((propertyId) => {
    setActionLoading(propertyId);
    adminDashboardService.updateProperty(propertyId, { verificationStatus: 'Verified' })
      .then(async () => { await fetchProperties(); await fetchStats(); })
      .then(() => setToast({ message: 'Property verified successfully', type: 'success' }))
      .catch((error) => {
        console.error('Failed to verify property:', error);
        setToast({ message: error?.response?.data?.detail || 'Failed to verify property', type: 'error' });
      })
      .finally(() => setActionLoading(null));
  }, [fetchProperties, fetchStats]);

  const handleReject = useCallback((propertyId) => {
    setActionLoading(propertyId);
    adminDashboardService.updateProperty(propertyId, { verificationStatus: 'Rejected' })
      .then(async () => { await fetchProperties(); await fetchStats(); })
      .then(() => setToast({ message: 'Property rejected', type: 'warning' }))
      .catch((error) => {
        console.error('Failed to reject property:', error);
        setToast({ message: error?.response?.data?.detail || 'Failed to reject property', type: 'error' });
      })
      .finally(() => setActionLoading(null));
  }, [fetchProperties, fetchStats]);

  const handleFeature = useCallback((propertyId) => {
    setActionLoading(propertyId);
    adminDashboardService.updateProperty(propertyId, { featured: true })
      .then(async () => { await fetchProperties(); await fetchStats(); })
      .then(() => setToast({ message: 'Property featured successfully', type: 'success' }))
      .catch((error) => {
        console.error('Failed to feature property:', error);
        setToast({ message: error?.response?.data?.detail || 'Failed to feature property', type: 'error' });
      })
      .finally(() => setActionLoading(null));
  }, [fetchProperties, fetchStats]);

  const handleUnfeature = useCallback((propertyId) => {
    setActionLoading(propertyId);
    adminDashboardService.updateProperty(propertyId, { featured: false })
      .then(async () => { await fetchProperties(); await fetchStats(); })
      .then(() => setToast({ message: 'Property unfeatured', type: 'info' }))
      .catch((error) => {
        console.error('Failed to unfeature property:', error);
        setToast({ message: error?.response?.data?.detail || 'Failed to unfeature property', type: 'error' });
      })
      .finally(() => setActionLoading(null));
  }, [fetchProperties, fetchStats]);

  const handleActivate = useCallback(async (propertyId) => {
    setActionLoading(propertyId);
    try {
      await adminDashboardService.updatePropertyStatus(propertyId, 'Active');
      // Re-pull the current page + global stats from the backend rather than
      // patching local state - the property may no longer belong on this
      // page once a Status filter is active (e.g. it was on the "Inactive"
      // filtered page and just left that status).
      await fetchProperties();
      await fetchStats();
      setToast({ message: 'Property activated successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to activate property:', error);
      setToast({ message: error?.response?.data?.detail || 'Failed to activate property', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  }, [fetchProperties, fetchStats]);

  const handleDeactivate = useCallback(async (propertyId) => {
    setActionLoading(propertyId);
    try {
      await adminDashboardService.updatePropertyStatus(propertyId, 'Inactive');
      await fetchProperties();
      await fetchStats();
      setToast({ message: 'Property deactivated', type: 'warning' });
    } catch (error) {
      console.error('Failed to deactivate property:', error);
      setToast({ message: error?.response?.data?.detail || 'Failed to deactivate property', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  }, [fetchProperties, fetchStats]);

  const handleMarkSold = useCallback((propertyId) => {
    setActionLoading(propertyId);
    setTimeout(() => {
      setProperties(prev => prev.map(p =>
        p.id === propertyId ? { ...p, status: 'Sold' } : p
      ));
      fetchStats();
      setActionLoading(null);
      setToast({ message: 'Property marked as sold', type: 'success' });
    }, 700);
  }, [fetchStats]);

  const handleMarkRented = useCallback((propertyId) => {
    setActionLoading(propertyId);
    setTimeout(() => {
      setProperties(prev => prev.map(p =>
        p.id === propertyId ? { ...p, status: 'Rented' } : p
      ));
      fetchStats();
      setActionLoading(null);
      setToast({ message: 'Property marked as rented', type: 'success' });
    }, 700);
  }, [fetchStats]);

  // ============ DELETE PROPERTY WITH CONFIRMATION ============
  const handleDeleteProperty = useCallback((propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Property',
      message: `Are you sure you want to delete property "${property.propertyName}" (${property.propertyId})?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        setActionLoading(propertyId);
        try {
          await adminDashboardService.deleteProperty(propertyId);
          await fetchProperties();
          await fetchStats();
          setShowViewModal(false);
          setToast({ message: `Deleted property "${property.propertyName}"`, type: 'warning' });
        } catch (error) {
          console.error('Failed to delete property:', error);
          setToast({ message: error?.response?.data?.detail || 'Failed to delete property', type: 'error' });
        } finally {
          setActionLoading(null);
        }
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [properties, fetchProperties, fetchStats]);

  // ============ STAT CLICK HANDLERS ============
  // Each of these changes what's sent to the backend list request (see
  // fetchProperties) - so a new page-1 fetch always follows, not just a
  // local re-filter.
  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(prev => (prev === category ? 'all' : category));
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveCategory('all');
    setActiveStatus('all');
    setActiveListingType('all');
    // A deliberate reset, not the user still typing - clear the debounced
    // value immediately instead of waiting out the 1500ms search debounce.
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setActiveCategory('all');
    setActiveStatus('all');
    setActiveListingType('all');
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchProperties(), fetchStats()]);
    setToast({ message: 'Data refreshed successfully', type: 'success' });
  }, [fetchProperties, fetchStats]);

  // ============ EXPORT DATA ============
  // Exports every record matching the current filters, not just the page
  // currently on screen - so it pages through the backend itself (up to its
  // 100-per-request max) rather than reading the already-paginated
  // `properties` state.
  const fetchAllFilteredProperties = useCallback(async () => {
    const baseParams = {
      propertyCategory: activeCategory !== 'all' ? CATEGORY_TO_BACKEND[activeCategory] : undefined,
      listingPurpose: activeListingType !== 'all' ? LISTING_TYPE_TO_BACKEND[activeListingType] : undefined,
      search: debouncedSearchQuery || undefined,
      ...statusFilterParams(activeStatus),
    };
    let all = [];
    let page = 1;
    let total = Infinity;
    while (all.length < total) {
      const response = await adminDashboardService.listProperties({ ...baseParams, page, limit: 100 });
      const mapped = normalizeProperties((response?.data || []).map(mapAdminPropertyToUI));
      if (mapped.length === 0) break;
      all = all.concat(mapped);
      total = response?.pagination?.total ?? all.length;
      page += 1;
    }
    return all;
  }, [activeCategory, activeStatus, activeListingType, debouncedSearchQuery, normalizeProperties]);

  const handleExport = useCallback(async () => {
    let allFiltered;
    try {
      allFiltered = await fetchAllFilteredProperties();
    } catch (error) {
      console.error('Error fetching data to export:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
      return;
    }

    if (allFiltered.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = allFiltered.map(p => ({
        'Property ID': p.propertyId || '',
        'Property Name': p.propertyName || '',
        'Category': p.category || '',
        'Property Type': p.propertyType || '',
        'Subcategory': p.subcategory || '',
        'Listing Type': p.listingType || '',
        'Location': p.location || '',
        'District': p.district || '',
        'City': p.city || '',
        'Area': p.area || '',
        'Price Range': p.priceRange || '',
        'Owner/Agent Type': p.ownerType || '',
        'Owner/Agent Name': p.ownerAgent || '',
        'Status': p.status || '',
        'Verification Status': p.verificationStatus || '',
        'Featured': p.featured ? 'Yes' : 'No',
        'Posted Date': p.postedDate || '',
        'Description': p.description || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_properties_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${allFiltered.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [fetchAllFilteredProperties]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedProperties.length === 0) {
      setToast({ message: 'Please select properties first', type: 'warning' });
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Properties',
      message: `Are you sure you want to delete ${selectedProperties.length} selected property(ies)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');

        setTimeout(() => {
          const selectedIds = new Set(selectedProperties);
          const count = properties.filter(p => selectedIds.has(p.id)).length;

          setProperties(prev => prev.filter(p => !selectedIds.has(p.id)));
          fetchStats();
          setSelectedProperties([]);
          setActionLoading(null);
          setToast({ message: `${count} property(ies) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }, [selectedProperties, properties, fetchStats]);

  // ============ FILTER OPTIONS ============
  const categoryOptions = Object.keys(PROPERTY_CATEGORIES).map(cat => ({
    value: cat,
    label: cat,
    icon: PROPERTY_CATEGORIES[cat].icon
  }));

  const statusOptions = [
    ...Object.keys(STATUS_CONFIG).map(status => ({
      value: status,
      label: status
    })),
    { value: 'Featured', label: 'Featured' },
    { value: 'Verified', label: 'Verified' }
  ];

  // ---- 'sell' removed: only Buy, Rent, Lease ----
  const listingTypeOptions = [
    { value: 'Buy', label: 'Buy' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Lease', label: 'Lease' }
  ];

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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => {
          if (confirmationModal.onCancel) {
            confirmationModal.onCancel();
          }
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }}
        onConfirm={() => {
          if (confirmationModal.onConfirm) {
            confirmationModal.onConfirm();
          }
        }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {/* View Modal */}
      {showViewModal && viewingProperty && (
        <ViewPropertyDetailModal
          property={viewingProperty}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingProperty(null); }}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingProperty(null); }}
          onSave={handleSaveProperty}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                All Properties
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {totalCount} Properties
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Complete property management</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              {showStats ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
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

      {/* Stats Section with Filter Clicks */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 ">
              <StatCard
                icon={<FiHome className="text-white text-sm" />}
                title="Total Properties"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeCategory === 'all' && activeStatus === 'all' && activeListingType === 'all' && !searchQuery}
                onClick={handleTotalClick}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Active"
                value={stats.active}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={100}
                isActive={activeStatus === 'Active'}
                onClick={() => handleStatusClick('Active')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={200}
                isActive={activeStatus === 'Pending'}
                onClick={() => handleStatusClick('Pending')}
              />
              <StatCard
                icon={<FiDollarSign className="text-white text-sm" />}
                title="Sold"
                value={stats.sold}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={300}
                isActive={activeStatus === 'Sold'}
                onClick={() => handleStatusClick('Sold')}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <StatCard
                icon={<FiUserCheck className="text-white text-sm" />}
                title="Rented"
                value={stats.rented}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={400}
                isActive={activeStatus === 'Rented'}
                onClick={() => handleStatusClick('Rented')}
              />
              <StatCard
                icon={<FiStar className="text-white text-sm" />}
                title="Featured"
                value={stats.featured}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={500}
                isActive={activeStatus === 'Featured'}
                onClick={() => handleStatusClick('Featured')}
              />
              <StatCard
                icon={<FiAlertTriangle className="text-white text-sm" />}
                title="Expired"
                value={stats.expired}
                color="bg-gradient-to-br from-gray-500 to-gray-400"
                delay={600}
                isActive={activeStatus === 'Expired'}
                onClick={() => handleStatusClick('Expired')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Rejected"
                value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={700}
                isActive={activeStatus === 'Rejected'}
                onClick={() => handleStatusClick('Rejected')}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <StatCard
                icon={<FiEyeOff className="text-white text-sm" />}
                title="Inactive"
                value={stats.inactive}
                color="bg-gradient-to-br from-gray-400 to-gray-300"
                delay={800}
                isActive={activeStatus === 'Inactive'}
                onClick={() => handleStatusClick('Inactive')}
              />
              <StatCard
                icon={<FiShield className="text-white text-sm" />}
                title="Verified"
                value={stats.verified}
                color="bg-gradient-to-br from-teal-600 to-teal-400"
                delay={900}
                isActive={activeStatus === 'Verified'}
                onClick={() => handleStatusClick('Verified')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Dropdowns */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, ID, category, location, city, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  // A deliberate clear, not the user still typing - skip the
                  // debounce wait so the backend request fires immediately.
                  setSearchQuery('');
                  setDebouncedSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={activeCategory}
              onChange={(val) => { setActiveCategory(val); setCurrentPage(1); }}
              icon={FiGrid}
              allLabel="All Categories"
            />

            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={activeStatus}
              onChange={(val) => { setActiveStatus(val); setCurrentPage(1); }}
              icon={FiActivity}
              allLabel="All Statuses"
            />

            <FilterDropdown
              label="Listing"
              options={listingTypeOptions}
              value={activeListingType}
              onChange={(val) => { setActiveListingType(val); setCurrentPage(1); }}
              icon={FiBriefcase}
              allLabel="All Types"
            />

            {(activeCategory !== 'all' || activeStatus !== 'all' || activeListingType !== 'all' || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
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
        {selectedProperties.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedProperties.length}</span> property(ies) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button
                onClick={() => setSelectedProperties([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);
              const categoryConfig = PROPERTY_CATEGORIES[property.category] || PROPERTY_CATEGORIES['Individual'];
              const CategoryIcon = categoryConfig.icon;
              const statusConfig = STATUS_CONFIG[property.status] || STATUS_CONFIG['Pending'];
              const verifyConfig = VERIFICATION_STATUS[property.verificationStatus] || VERIFICATION_STATUS['Not Verified'];
              const VerifyIcon = verifyConfig.icon;
              const ownerTypeConfig = OWNER_TYPES[property.ownerType] || OWNER_TYPES['Owner'];

              return (
                <div
                  key={property.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectProperty(property.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${categoryConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <CategoryIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{property.propertyName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{property.propertyId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110"
                        onClick={() => handleEditProperty(property)}
                        title="Edit Property"
                      >
                        <FiEdit className="text-sm" />
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewProperty(property)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-semibold text-[#1A2E2A]">{property.category}</span>
                      <span className="text-[#B5C9C5]">|</span>
                      <span className="truncate font-medium">{property.subcategory || property.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiBriefcase className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-semibold text-[#1A2E2A]">{property.listingType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{property.location}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-semibold text-[#1A2E2A]">{property.priceRange}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5 ${verifyConfig.bg} ${verifyConfig.text} border ${verifyConfig.border}`}>
                        <VerifyIcon className="text-[8px]" /> {property.verificationStatus}
                      </span>
                      {property.featured && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                          <FiStar className="text-[8px]" /> Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5A7D78]">
                      {property.ownerType && (
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                          OWNER_TYPES[property.ownerType]?.bg || 'bg-gray-50'
                        } ${
                          OWNER_TYPES[property.ownerType]?.text || 'text-gray-700'
                        } border ${
                          OWNER_TYPES[property.ownerType]?.border || 'border-gray-200'
                        }`}>
                          {property.ownerType}
                        </span>
                      )}
                      <span className="truncate font-medium">{property.ownerAgent}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{property.postedDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewProperty(property)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditProperty(property)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={actionLoading === property.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === property.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-1 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                />
                <span className="truncate">ID</span>
              </div>
              <div className="col-span-1 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('propertyName')}>
                Name {sortField === 'propertyName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('ownerType')}>
                Type {sortField === 'ownerType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('category')}>
                Category {sortField === 'category' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('listingType')}>
                Listing {sortField === 'listingType' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('priceRange')}>
                Price {sortField === 'priceRange' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('status')}>
                Status {sortField === 'status' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('verificationStatus')}>
                Verified {sortField === 'verificationStatus' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('featured')}>
                Featured {sortField === 'featured' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('postedDate')}>
                Posted {sortField === 'postedDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedProperties.map((property, index) => {
              const isSelected = selectedProperties.includes(property.id);
              const categoryConfig = PROPERTY_CATEGORIES[property.category] || PROPERTY_CATEGORIES['Individual'];
              const CategoryIcon = categoryConfig.icon;
              const statusConfig = STATUS_CONFIG[property.status] || STATUS_CONFIG['Pending'];
              const verifyConfig = VERIFICATION_STATUS[property.verificationStatus] || VERIFICATION_STATUS['Not Verified'];
              const VerifyIcon = verifyConfig.icon;
              const ownerTypeConfig = OWNER_TYPES[property.ownerType] || OWNER_TYPES['Owner'];

              return (
                <div
                  key={property.id}
                  className={`grid grid-cols-12 gap-1 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProperty(property.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                    />
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${categoryConfig.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <CategoryIcon className="text-[8px]" />
                    </div>
                    <span className="text-xs font-bold text-[#00695C] truncate">{property.propertyId}</span>
                  </div>

                  <div className="col-span-1 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{property.propertyName}</p>
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                      OWNER_TYPES[property.ownerType]?.bg || 'bg-gray-50'
                    } ${
                      OWNER_TYPES[property.ownerType]?.text || 'text-gray-700'
                    } border ${
                      OWNER_TYPES[property.ownerType]?.border || 'border-gray-200'
                    } truncate inline-block max-w-full`}>
                      {property.ownerType || 'Owner'}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.category}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#E8F4F2] text-[#00695C] border border-[#B5C9C5] truncate inline-block max-w-full`}>
                      {property.listingType}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.city}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.priceRange}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} truncate inline-block max-w-full`}>
                      {property.status}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-0.5 whitespace-nowrap max-w-full ${verifyConfig.bg} ${verifyConfig.text} border ${verifyConfig.border}`}>
                      <VerifyIcon className="text-[8px] shrink-0" />
                      <span className="truncate">{property.verificationStatus}</span>
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      property.featured ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-700 border border-gray-200'
                    } truncate inline-block max-w-full`}>
                      {property.featured ? '★' : '☆'}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {property.postedDate}
                  </div>

                  <div className="col-span-1 min-w-0 flex items-center justify-end gap-0.5 flex-nowrap">
                    <button
                      type="button"
                      onClick={() => handleViewProperty(property)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="View"
                    >
                      <FiEye className="text-[12px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditProperty(property)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0"
                      title="Edit"
                    >
                      <FiEdit className="text-[12px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProperty(property.id)}
                      disabled={actionLoading === property.id}
                      className="w-5 h-5 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                      title="Delete"
                    >
                      {actionLoading === property.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[12px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedProperties.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiHome className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No properties found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No properties have been added yet'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105"
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
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalCount)} of{' '}
              {totalCount} properties
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 font-medium"
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
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-110 ${
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
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
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
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AllProperties;