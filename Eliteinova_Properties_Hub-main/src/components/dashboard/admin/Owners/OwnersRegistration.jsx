// src/components/dashboard/admin/Owners/OwnersRegistration.jsx

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

const ApprovalConfirmModal = ({ show, action, actionLoading, ownerName, onCancel, onConfirm }) => {
  if (!show) return null;

  const isApprove = action === 'approve';
  const color = isApprove ? 'emerald' : 'red';
  const Icon = isApprove ? FiCheckCircle : FiXCircle;
  const title = isApprove ? 'Approve Owner Registration' : 'Reject Owner Registration';
  const message = isApprove 
    ? `Are you sure you want to approve ${ownerName}'s registration? They will gain full access to the platform.`
    : `Are you sure you want to reject ${ownerName}'s registration? This action cannot be undone.`;

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
              {actionLoading === action ? <FiRefreshCw className="animate-spin mx-auto" /> : isApprove ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ OWNER PROPERTIES MODAL ============
const OwnerPropertiesModal = ({ owner, show, onClose, onViewProperty }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && owner) {
      setLoading(true);
      // Generate mock properties for this owner
      setTimeout(() => {
        const mockProperties = generateOwnerProperties(owner);
        setProperties(mockProperties);
        setLoading(false);
      }, 500);
    }
  }, [show, owner]);

  if (!show || !owner) return null;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    suspended: 'bg-gray-100 text-gray-700'
  };

  const typeIcons = {
    'Individual': <FiUser className="text-[#00695C]" />,
    'Apartment': <MdApartment className="text-[#00695C]" />,
    'Commercial': <MdOutlineBusiness className="text-[#00695C]" />,
    'Land & Plots': <FiSquare className="text-[#00695C]" />,
    'Hostel': <FaBuilding className="text-[#00695C]" />
  };

  const handleViewProperty = (property) => {
    if (onViewProperty) {
      onViewProperty(property);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 rounded-t-3xl z-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FiHome className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{owner.name}'s Properties</h2>
              <p className="text-white/70 text-xs">{properties.length} properties listed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiHome className="text-3xl text-[#B5C9C5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A2E2A]">No Properties Found</h3>
              <p className="text-sm text-[#5A7D78] mt-1">This owner hasn't listed any properties yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#1A2E2A] text-sm truncate">{property.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F9F8] text-[#5A7D78] flex items-center gap-1">
                          {typeIcons[property.type] || <FiTag className="text-[#00695C]" />}
                          {property.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[property.status] || 'bg-gray-100 text-gray-700'}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                        {property.isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            <FaStarSolid className="inline mr-0.5 text-[8px]" /> Featured
                          </span>
                        )}
                        {property.isVerified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            <FiShield className="inline mr-0.5 text-[8px]" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm">
                        ₹{Math.floor(property.price / 100000)}L
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] shrink-0" />
                      <span className="font-semibold text-[#1A2E2A]">₹{property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiUser className="text-[#00695C] shrink-0" />
                      <span className="truncate">{property.ownerName || owner.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{property.bedrooms}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Beds</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{property.bathrooms}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Baths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{property.area}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">{property.areaUnit}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E8F0EE] flex items-center justify-between text-xs text-[#5A7D78]">
                    <span>Listed: {new Date(property.listedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <div className="flex items-center gap-3">
                      <span><FiEye className="inline mr-0.5 text-[#00695C]" /> {property.views}</span>
                      <span><FiMail className="inline mr-0.5 text-[#00695C]" /> {property.inquiries}</span>
                    </div>
                  </div>

                  {/* View Property Button */}
                  <div className="mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="w-full py-2 rounded-xl text-xs font-medium bg-[#00695C] text-white hover:bg-[#004D40] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md"
                    >
                      <FiEye className="text-xs" />
                      View Property Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-3 border-t border-[#E8F0EE] bg-white rounded-b-3xl flex items-center justify-between shrink-0">
          <span className="text-xs text-[#5A7D78]">
            Total: <span className="font-semibold text-[#1A2E2A]">{properties.length}</span> properties
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-md hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock properties for an owner
const generateOwnerProperties = (owner) => {
  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statuses = ['pending', 'approved', 'rejected', 'suspended'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur'];
  const titles = [
    'Luxury Apartment', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite',
    'Cozy Studio', 'Commercial Office Space', 'Garden House', 'Lake View Apartment',
    'City Center Condo', 'Suburban Family Home', 'Beachfront Villa', 'Sky Lounge Penthouse',
    'Premium Individual House', 'Luxury Individual Villa', 'Corporate Commercial Space',
    'Retail Commercial Space', 'Residential Land Plot', 'Commercial Land Plot',
    'Premium Hostel', 'Student Hostel', 'Working Professional Hostel'
  ];

  // Use the actual propertiesCount from the owner, or a random number if not available
  const count = owner.propertiesCount || Math.floor(Math.random() * 8) + 1;
  
  const properties = [];

  // Owner names for properties
  const ownerNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Reddy',
    'Deepak Verma', 'Meera Joshi', 'Arjun Nair', 'Kavya Rao', 'Suresh Gupta'
  ];

  for (let i = 1; i <= count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 120));

    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];

    // Generate amenities based on property type
    let amenities = [];
    if (type === 'Individual') {
      amenities = ['WiFi', 'Parking', 'Garden', 'Security', 'Balcony'];
    } else if (type === 'Apartment') {
      amenities = ['WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym', 'Elevator'];
    } else if (type === 'Commercial') {
      amenities = ['WiFi', 'Parking', 'Security', 'AC', 'Elevator'];
    } else if (type === 'Land & Plots') {
      amenities = ['Water Connection', 'Electricity', 'Road Access', 'Fencing'];
    } else if (type === 'Hostel') {
      amenities = ['WiFi', 'AC', 'Security', 'Mess', 'Laundry'];
    }

    properties.push({
      id: `prop_${owner.id}_${i}`,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i}`,
      type: type,
      location: `${city}, ${['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan'][Math.floor(Math.random() * 7)]}`,
      price: Math.floor(Math.random() * 50000000 + 5000000),
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: Math.floor(Math.random() * 2000 + 500),
      areaUnit: 'sq ft',
      status: status,
      isFeatured: Math.random() > 0.8,
      isVerified: Math.random() > 0.7,
      listedDate: date.toISOString(),
      views: Math.floor(Math.random() * 500),
      inquiries: Math.floor(Math.random() * 50),
      description: `Beautiful ${type.toLowerCase()} located in ${city}. Features ${Math.floor(Math.random() * 3) + 2} bedrooms and modern amenities. Perfect for families and professionals.`,
      amenities: amenities,
      parking: Math.random() > 0.5 ? `${Math.floor(Math.random() * 2) + 1} spots` : 'None',
      ownerName: owner.name || ownerName,
      ownerEmail: owner.email || `${ownerName.toLowerCase().replace(' ', '.')}@email.com`,
      ownerPhone: owner.phone || `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    });
  }

  return properties;
};

/* ============================================================
   VIEW OWNER MODAL — redesigned, theme-token based
   Signature element: a completion ring around the avatar that
   visualizes how many of the 4 KYC documents are verified.
============================================================ */

const ViewOwnerModal = ({ owner, show, actionLoading, onClose, onApprove, onReject, onEdit, onToggleBlock, onViewProperties }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [owner?.id]);

  if (!owner || !show) return null;

  const kycItems = [
    { key: 'aadhaar', label: 'Aadhaar' },
    { key: 'pan', label: 'PAN' },
    { key: 'gst', label: 'GST' },
    { key: 'rera', label: 'RERA' },
  ];
  const kycVerifiedCount = kycItems.filter(item => owner.kyc[item.key]).length;
  const kycPercent = Math.round((kycVerifiedCount / kycItems.length) * 100);
  const ringCircumference = 2 * Math.PI * 34;
  const ringOffset = ringCircumference - (kycPercent / 100) * ringCircumference;

  const isBlockedLike = owner.status === 'blocked' || owner.status === 'rejected';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contact', label: 'Contact' },
    { id: 'kyc', label: 'Documents' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="owner-view-modal w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[28px] shadow-2xl animate-slide-up flex flex-col"
        style={{ background: 'var(--ovm-bg)', color: 'var(--ovm-text)', border: '1px solid var(--ovm-border)' }}
      >
        {/* Hero */}
        <div
          className="relative px-6 pt-6 pb-14 shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--ovm-accent), var(--ovm-accent-2))' }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Registration</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
            >
              <FiX className="text-base" />
            </button>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{owner.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{owner.company} · {owner.city}, {owner.state}</p>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              owner.status === 'approved' ? 'bg-white text-emerald-700' :
              owner.status === 'rejected' ? 'bg-white text-red-700' :
              owner.status === 'blocked' ? 'bg-white/20 text-white' :
              'bg-white text-amber-700'
            }`}>
              {owner.status.charAt(0).toUpperCase() + owner.status.slice(1)}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white">
              {owner.subscriptionPlan} plan
            </span>
          </div>
        </div>

        {/* Avatar with KYC completion ring, overlapping the hero */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
              <circle cx="38" cy="38" r="34" fill="none" stroke="var(--ovm-ring-track)" strokeWidth="5" />
              <circle
                cx="38" cy="38" r="34" fill="none"
                stroke="var(--ovm-ring-active)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-lg"
              style={{ inset: '10px', background: 'var(--ovm-surface)', color: 'var(--ovm-accent)', border: '3px solid var(--ovm-bg)' }}
            >
              {owner.avatar}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] font-medium mt-1 shrink-0" style={{ color: 'var(--ovm-muted)' }}>
          {kycVerifiedCount}/{kycItems.length} documents verified · {kycPercent}%
        </p>

        {/* View Properties Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewProperties && onViewProperties(owner)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              background: 'var(--ovm-accent)', 
              color: 'var(--ovm-on-accent)',
              boxShadow: '0 4px 12px rgba(15, 107, 92, 0.3)'
            }}
          >
            <FiHome className="text-sm" />
            View All Properties ({owner.propertiesCount})
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
                background: activeTab === tab.id ? 'var(--ovm-accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--ovm-on-accent)' : 'var(--ovm-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {owner.status === 'pending' && (
            <div
              className="rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-5"
              style={{ background: 'var(--ovm-warning-bg)', border: '1px solid var(--ovm-warning-border)' }}
            >
              <span className="text-xs font-medium flex items-center gap-2" style={{ color: 'var(--ovm-warning-text)' }}>
                <FiClock /> Awaiting a decision
              </span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Properties', value: owner.propertiesCount },
                  { label: 'Leads', value: owner.leadsCount },
                  { label: 'Rating', value: owner.rating },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3 text-center"
                    style={{ background: 'var(--ovm-surface)', border: '1px solid var(--ovm-border)' }}
                  >
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--ovm-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--ovm-border)' }}>
                <span style={{ color: 'var(--ovm-muted)' }}>Registered</span>
                <span className="font-medium">
                  {new Date(owner.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {owner.bio && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--ovm-muted)' }}>Bio</p>
                  <p
                    className="text-sm leading-relaxed pl-3"
                    style={{ borderLeft: '2px solid var(--ovm-accent-2)', color: 'var(--ovm-text-soft)' }}
                  >
                    {owner.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              {[
                { icon: <FiMail />, label: 'Email', value: owner.email, verified: owner.verification.email },
                { icon: <FiPhone />, label: 'Phone', value: owner.phone, verified: owner.verification.phone },
                { icon: <FiMapPin />, label: 'Location', value: `${owner.city}, ${owner.state}` },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--ovm-border)' }}>
                  <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--ovm-muted)' }}>
                    <span style={{ color: 'var(--ovm-accent)' }}>{row.icon}</span>{row.label}
                  </span>
                  <span className="text-sm font-medium text-right flex items-center gap-1.5">
                    {row.value}
                    {row.verified !== undefined && (
                      row.verified
                        ? <FiCheckCircle style={{ color: 'var(--ovm-success)' }} className="text-xs" />
                        : <FiXCircle style={{ color: 'var(--ovm-muted)' }} className="text-xs" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--ovm-muted)' }}>KYC Status</p>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: owner.kycStatus === 'verified' ? 'var(--ovm-success-bg)' : owner.kycStatus === 'rejected' ? 'var(--ovm-danger-bg)' : 'var(--ovm-warning-bg)',
                    color: owner.kycStatus === 'verified' ? 'var(--ovm-success)' : owner.kycStatus === 'rejected' ? 'var(--ovm-danger)' : 'var(--ovm-warning-text)'
                  }}
                >
                  {owner.kycStatus.charAt(0).toUpperCase() + owner.kycStatus.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {kycItems.map(item => (
                  <div
                    key={item.key}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{
                      background: owner.kyc[item.key] ? 'var(--ovm-success-bg)' : 'var(--ovm-surface)',
                      border: `1px solid ${owner.kyc[item.key] ? 'var(--ovm-success-border)' : 'var(--ovm-border)'}`
                    }}
                  >
                    {owner.kyc[item.key]
                      ? <FiCheckCircle style={{ color: 'var(--ovm-success)' }} />
                      : <FiXCircle style={{ color: 'var(--ovm-muted)' }} />}
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
          style={{ borderColor: 'var(--ovm-border)', background: 'var(--ovm-surface)' }}
        >
          {owner.status === 'pending' ? (
            <>
              <button
                onClick={() => onApprove(owner.id)}
                disabled={actionLoading === owner.id}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: 'var(--ovm-success)', color: 'var(--ovm-on-accent)' }}
              >
                {actionLoading === owner.id ? <FiRefreshCw className="animate-spin text-xs" /> : <FiCheckCircle className="text-xs" />}
                Approve
              </button>
              <button
                onClick={() => onReject(owner.id)}
                disabled={actionLoading === owner.id}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: 'transparent', color: 'var(--ovm-danger)', border: '1px solid var(--ovm-danger)' }}
              >
                {actionLoading === owner.id ? <FiRefreshCw className="animate-spin text-xs" /> : <FiXCircle className="text-xs" />}
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'var(--ovm-accent)', color: 'var(--ovm-on-accent)' }}
              >
                <FiEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={onToggleBlock}
                disabled={actionLoading === `block_${owner.id}`}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{
                  background: isBlockedLike ? 'var(--ovm-success-bg)' : 'var(--ovm-danger-bg)',
                  color: isBlockedLike ? 'var(--ovm-success)' : 'var(--ovm-danger)'
                }}
              >
                {actionLoading === `block_${owner.id}` ? (
                  <FiRefreshCw className="animate-spin text-xs" />
                ) : isBlockedLike ? (
                  <FiUnlock className="text-xs" />
                ) : (
                  <FiLock className="text-xs" />
                )}
                {isBlockedLike ? 'Unblock' : 'Block'}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .owner-view-modal {
          --ovm-bg: #FFFFFF;
          --ovm-surface: #F5F9F8;
          --ovm-border: #E5EEEB;
          --ovm-text: #12211D;
          --ovm-text-soft: #3E5C56;
          --ovm-muted: #6B8983;
          --ovm-accent: #0F6B5C;
          --ovm-accent-2: #2FAE9A;
          --ovm-on-accent: #FFFFFF;
          --ovm-ring-track: #E5EEEB;
          --ovm-ring-active: #0F6B5C;
          --ovm-success: #167A54;
          --ovm-success-bg: #E7F6EF;
          --ovm-success-border: #BEE4D2;
          --ovm-danger: #C0392B;
          --ovm-danger-bg: #FCEBE9;
          --ovm-warning-text: #92620C;
          --ovm-warning-bg: #FDF3DE;
          --ovm-warning-border: #F2DBA3;
        }
      `}</style>
    </div>
  );
};

const EditOwnerModal = ({ owner, show, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        city: owner.city,
        state: owner.state,
        company: owner.company,
        status: owner.status,
        subscriptionPlan: owner.subscriptionPlan,
        bio: owner.bio || '',
      });
    }
  }, [owner]);

  if (!owner || !show || !formData) return null;

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
          <h2 className="text-2xl font-bold text-white">Edit Owner</h2>
          <p className="text-white/80 text-sm">Update owner information</p>
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
              <label className="text-xs font-medium text-[#5A7D78] block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
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
                placeholder="Brief description about the owner"
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

/* ============================================================
   MAIN COMPONENT
============================================================ */

const OwnersRegistration = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingOwner, setViewingOwner] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(null);
  const [approvalAction, setApprovalAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // ============ PROPERTIES MODAL STATE ============
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [selectedOwnerForProperties, setSelectedOwnerForProperties] = useState(null);

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  const [stats, setStats] = useState({
    totalOwners: 523,
    pendingApprovals: 18,
    approved: 478,
    rejected: 27,
    blocked: 0,
    verifiedKyc: 412,
    pendingKyc: 111,
  });

  // ============ GENERATE MOCK OWNERS ============
  const generateMockOwners = useCallback(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran', 'Mohan', 'Ritu', 'Gautam', 'Nisha', 'Tarun'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
    const statuses = ['pending', 'approved', 'rejected'];
    const kycStatuses = ['pending', 'verified', 'rejected'];
    const subscriptionPlans = ['Free', 'Silver', 'Gold', 'Platinum'];

    const owners = [];
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

      const propertiesCount = Math.floor(Math.random() * 30);
      const leadsCount = Math.floor(Math.random() * 40);
      const rating = (Math.random() * 4 + 1).toFixed(1);

      // Generate KYC verification details
      const kyc = {
        aadhaar: Math.random() > 0.3,
        pan: Math.random() > 0.35,
        gst: Math.random() > 0.7,
        rera: Math.random() > 0.6,
      };

      // Email and phone verification
      const verification = {
        email: Math.random() > 0.15,
        phone: Math.random() > 0.2,
      };

      owners.push({
        id: `owner_${i}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        city: city,
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'][Math.floor(Math.random() * 8)],
        company: ['ABC Realty', 'Dream Homes', 'Green Valley', 'Luxury Living', 'Urban Estate', 'Prime Properties', 'Elite Homes', 'Royal Estate', 'Golden Key', 'Smart Living'][Math.floor(Math.random() * 10)],
        status: status,
        kycStatus: kycStatus,
        kyc: kyc,
        verification: verification,
        registrationDate: date.toISOString(),
        propertiesCount: propertiesCount,
        leadsCount: leadsCount,
        rating: rating,
        avatar: firstName[0] + lastName[0],
        subscriptionPlan: subscriptionPlans[Math.floor(Math.random() * subscriptionPlans.length)],
        bio: `Property owner with ${propertiesCount} properties listed. Focused on ${city} real estate market.`,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
        totalSpent: Math.floor(Math.random() * 300000),
        featured: Math.random() > 0.85,
        verifiedBadge: Math.random() > 0.7,
      });
    }

    return owners;
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockOwners = generateMockOwners();
    setOwners(mockOwners);
    setFilteredOwners(mockOwners);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockOwners]);

  // ============ FILTER OWNERS ============
  const filterOwners = useCallback(() => {
    let filtered = [...owners];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(owner =>
        owner.name.toLowerCase().includes(query) ||
        owner.email.toLowerCase().includes(query) ||
        owner.phone.includes(query) ||
        owner.city.toLowerCase().includes(query) ||
        owner.company.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(owner => owner.status === selectedStatus);
    }

    if (selectedVerification !== 'all') {
      filtered = filtered.filter(owner => owner.kycStatus === selectedVerification);
    }

    let count = 0;
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

    setFilteredOwners(filtered);
    setCurrentPage(1);
  }, [owners, searchQuery, selectedStatus, selectedVerification, sortField, sortDirection]);

  useEffect(() => {
    filterOwners();
  }, [filterOwners]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredOwners.length / pageSize);
  const paginatedOwners = useMemo(() =>
    filteredOwners.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredOwners, currentPage, pageSize]);

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
    if (selectedOwners.length === paginatedOwners.length) {
      setSelectedOwners([]);
    } else {
      setSelectedOwners(paginatedOwners.map(owner => owner.id));
    }
  }, [selectedOwners, paginatedOwners]);

  // ============ HANDLE SELECT OWNER ============
  const handleSelectOwner = useCallback((ownerId) => {
    setSelectedOwners(prev =>
      prev.includes(ownerId)
        ? prev.filter(id => id !== ownerId)
        : [...prev, ownerId]
    );
  }, []);

  // ============ HANDLE APPROVAL ============
  const handleApproval = useCallback((ownerId, action) => {
    const owner = owners.find(o => o.id === ownerId);
    if (!owner) return;
    setShowApprovalConfirm(ownerId);
    setApprovalAction(action);
  }, [owners]);

  // ============ CONFIRM APPROVAL ============
  const confirmApproval = useCallback(() => {
    const ownerId = showApprovalConfirm;
    const action = approvalAction;
    setActionLoading(action);
    setShowApprovalConfirm(null);

    setTimeout(() => {
      let updatedOwners = [...owners];
      let owner = updatedOwners.find(o => o.id === ownerId);
      
      if (action === 'approve') {
        owner = { ...owner, status: 'approved' };
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
          approved: prev.approved + 1,
        }));
        showToast(`${owner.name} has been approved successfully`, 'success');
      } else if (action === 'reject') {
        owner = { ...owner, status: 'rejected' };
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
          rejected: prev.rejected + 1,
        }));
        showToast(`${owner.name} has been rejected`, 'warning');
      }

      updatedOwners = updatedOwners.map(o => o.id === ownerId ? owner : o);
      setOwners(updatedOwners);
      setActionLoading(null);
      setApprovalAction(null);

      setViewingOwner(prev => (prev && prev.id === ownerId ? owner : prev));
    }, 800);
  }, [showApprovalConfirm, approvalAction, owners, showToast]);

  // ============ HANDLE TOGGLE BLOCK ============
  const handleToggleBlock = useCallback((ownerId) => {
    setActionLoading(`block_${ownerId}`);

    setTimeout(() => {
      let updatedOwners = [...owners];
      let owner = updatedOwners.find(o => o.id === ownerId);
      const wasBlocked = owner.status === 'blocked';

      if (wasBlocked) {
        owner = { ...owner, status: 'approved' };
        setStats(prev => ({
          ...prev,
          blocked: Math.max(0, prev.blocked - 1),
          approved: prev.approved + 1,
        }));
        showToast(`${owner.name} has been unblocked`, 'success');
      } else {
        owner = { ...owner, status: 'blocked' };
        setStats(prev => ({
          ...prev,
          blocked: prev.blocked + 1,
          approved: Math.max(0, prev.approved - 1),
        }));
        showToast(`${owner.name} has been blocked`, 'warning');
      }

      updatedOwners = updatedOwners.map(o => o.id === ownerId ? owner : o);
      setOwners(updatedOwners);
      setActionLoading(null);

      setViewingOwner(prev => (prev && prev.id === ownerId ? owner : prev));
    }, 600);
  }, [owners, showToast]);

  // ============ VIEW OWNER DETAIL ============
  const handleViewOwner = useCallback((owner) => {
    setViewingOwner(owner);
    setShowViewModal(true);
  }, []);

  // ============ VIEW OWNER PROPERTIES ============
  const handleViewOwnerProperties = useCallback((owner) => {
    setSelectedOwnerForProperties(owner);
    setShowPropertiesModal(true);
  }, []);

  // ============ VIEW INDIVIDUAL PROPERTY DETAIL ============
  const handleViewPropertyDetail = useCallback((property) => {
    // Navigate to property detail page
    navigate(`/properties/${property.id}`);
    showToast(`Opening ${property.title}...`, 'info');
  }, [navigate, showToast]);

  // ============ EDIT OWNER ============
  const handleEditOwner = useCallback((owner) => {
    setEditingOwner(owner);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const saveEdit = useCallback((updatedData) => {
    setOwners(prev => prev.map(owner =>
      owner.id === editingOwner.id ? { ...owner, ...updatedData } : owner
    ));
    setShowEditModal(false);
    setEditingOwner(null);
    showToast('Owner updated successfully', 'success');
  }, [editingOwner, showToast]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSelectedStatus('all');
      setSelectedVerification('all');
    } else if (filter === 'pending') {
      setSelectedStatus('pending');
      setSelectedVerification('all');
    } else if (filter === 'approved') {
      setSelectedStatus('approved');
      setSelectedVerification('all');
    } else if (filter === 'rejected') {
      setSelectedStatus('rejected');
      setSelectedVerification('all');
    } else if (filter === 'blocked') {
      setSelectedStatus('blocked');
      setSelectedVerification('all');
    } else if (filter === 'kyc_verified') {
      setSelectedVerification('verified');
      setSelectedStatus('all');
    } else if (filter === 'kyc_pending') {
      setSelectedVerification('pending');
      setSelectedStatus('all');
    }
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedVerification('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockOwners = generateMockOwners();
      setOwners(mockOwners);
      setFilteredOwners(mockOwners);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockOwners, showToast]);

  // ============ EXPORT OWNERS ============
  const handleExportOwners = useCallback(() => {
    const data = filteredOwners.map(owner => ({
      Name: owner.name,
      Email: owner.email,
      Phone: owner.phone,
      City: owner.city,
      State: owner.state,
      Company: owner.company,
      Status: owner.status,
      'KYC Status': owner.kycStatus,
      'Aadhaar': owner.kyc.aadhaar ? 'Verified' : 'Pending',
      'PAN': owner.kyc.pan ? 'Verified' : 'Pending',
      'GST': owner.kyc.gst ? 'Verified' : 'Pending',
      'RERA': owner.kyc.rera ? 'Verified' : 'Pending',
      'Email Verified': owner.verification.email ? 'Yes' : 'No',
      'Phone Verified': owner.verification.phone ? 'Yes' : 'No',
      Properties: owner.propertiesCount,
      Leads: owner.leadsCount,
      Rating: owner.rating,
      'Registration Date': new Date(owner.registrationDate).toLocaleDateString(),
      'Subscription Plan': owner.subscriptionPlan,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owners_registration_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredOwners.length} owners exported successfully`, 'success');
  }, [filteredOwners, showToast]);

  // ============ VIEW MODAL ACTION HANDLERS ============
  const handleViewModalApprove = useCallback((id) => {
    handleApproval(id, 'approve');
  }, [handleApproval]);

  const handleViewModalReject = useCallback((id) => {
    handleApproval(id, 'reject');
  }, [handleApproval]);

  const handleViewModalEdit = useCallback(() => {
    if (!viewingOwner) return;
    setShowViewModal(false);
    handleEditOwner(viewingOwner);
  }, [viewingOwner, handleEditOwner]);

  const handleViewModalToggleBlock = useCallback(() => {
    if (!viewingOwner) return;
    handleToggleBlock(viewingOwner.id);
  }, [viewingOwner, handleToggleBlock]);

  const handleViewModalViewProperties = useCallback((owner) => {
    setShowViewModal(false);
    handleViewOwnerProperties(owner);
  }, [handleViewOwnerProperties]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedOwners.length === 0) {
      showToast('Please select owners first', 'warning');
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedOwners);
      let updatedOwners = [...owners];
      let count = 0;

      updatedOwners = updatedOwners.map(owner => {
        if (selectedIds.has(owner.id)) {
          count++;
          if (action === 'approve') {
            return { ...owner, status: 'approved' };
          } else if (action === 'reject') {
            return { ...owner, status: 'rejected' };
          }
        }
        return owner;
      });

      setOwners(updatedOwners);
      setSelectedOwners([]);
      setActionLoading(null);

      // Update stats
      if (action === 'approve') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - count),
          approved: prev.approved + count,
        }));
        showToast(`${count} owner(s) approved successfully`, 'success');
      } else if (action === 'reject') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - count),
          rejected: prev.rejected + count,
        }));
        showToast(`${count} owner(s) rejected successfully`, 'warning');
      }
    }, 800);
  }, [selectedOwners, owners, showToast]);

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

      {/* Approval Confirm Modal */}
      <ApprovalConfirmModal
        show={!!showApprovalConfirm}
        action={approvalAction}
        actionLoading={actionLoading}
        ownerName={owners.find(o => o.id === showApprovalConfirm)?.name || ''}
        onCancel={() => { setShowApprovalConfirm(null); setApprovalAction(null); }}
        onConfirm={confirmApproval}
      />

      {/* Owner Properties Modal */}
      <OwnerPropertiesModal
        owner={selectedOwnerForProperties}
        show={showPropertiesModal}
        onClose={() => { setShowPropertiesModal(false); setSelectedOwnerForProperties(null); }}
        onViewProperty={handleViewPropertyDetail}
      />

      {/* Edit Modal */}
      <EditOwnerModal
        owner={editingOwner}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingOwner(null); }}
        onSave={saveEdit}
      />

      {/* View Modal */}
      <ViewOwnerModal
        owner={viewingOwner}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingOwner(null); }}
        onApprove={handleViewModalApprove}
        onReject={handleViewModalReject}
        onEdit={handleViewModalEdit}
        onToggleBlock={handleViewModalToggleBlock}
        onViewProperties={handleViewModalViewProperties}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Owner Registrations
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredOwners.length} Owners
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Review and manage owner registration requests</span>
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
              onClick={handleExportOwners}
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
                title="Total Owners"
                value={stats.totalOwners}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending Approvals"
                value={stats.pendingApprovals}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Approved"
                value={stats.approved}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={200}
                isActive={activeFilter === 'approved'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('approved')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Rejected"
                value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={300}
                isActive={activeFilter === 'rejected'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('rejected')}
              />
              <StatCard
                icon={<FiLock className="text-white text-sm" />}
                title="Blocked"
                value={stats.blocked}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={350}
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
              placeholder="Search owners by name, email, phone, city, or company..."
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
        {selectedOwners.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedOwners.length}</span> owner(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={actionLoading === 'approve'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'approve' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={actionLoading === 'reject'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'reject' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Reject All
              </button>
              <button
                onClick={() => setSelectedOwners([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Owners Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedOwners.map((owner, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
                approved: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
                rejected: 'bg-red-50 text-red-700 border-red-200',
                blocked: 'bg-gray-100 text-gray-600 border-gray-200'
              };

              const verificationColors = {
                verified: 'bg-[#E8F8F5] text-[#00695C]',
                pending: 'bg-[#FEF3E2] text-amber-700',
                rejected: 'bg-red-50 text-red-700'
              };

              const isSelected = selectedOwners.includes(owner.id);
              const isPending = owner.status === 'pending';
              const isApproved = owner.status === 'approved';
              const showVerifiedBadge = owner.kycStatus === 'verified' && owner.status !== 'rejected' && owner.status !== 'blocked';

              return (
                <div
                  key={owner.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    isPending ? 'border-l-4 border-l-amber-500' : 
                    isApproved ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOwner(owner.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {owner.avatar}
                        </div>
                        {showVerifiedBadge && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <FaCheck className="text-white text-[7px]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{owner.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap inline-flex items-center gap-1 ${statusColors[owner.status]}`}>
                            {owner.status.charAt(0).toUpperCase() + owner.status.slice(1)}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${verificationColors[owner.kycStatus]}`}>
                            KYC: {owner.kycStatus.charAt(0).toUpperCase() + owner.kycStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {owner.featured && (
                        <div className="w-5 h-5 bg-[#FEF3E2] rounded-full flex items-center justify-center">
                          <FaStarSolid className="text-amber-500 text-[9px]" />
                        </div>
                      )}
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewOwner(owner)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{owner.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{owner.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{owner.city}, {owner.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Registered {new Date(owner.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* KYC Quick Status */}
                  <div className="grid grid-cols-4 gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {[
                      { key: 'aadhaar', label: 'Aadhaar' },
                      { key: 'pan', label: 'PAN' },
                      { key: 'gst', label: 'GST' },
                      { key: 'rera', label: 'RERA' }
                    ].map(item => (
                      <div key={item.key} className="text-center">
                        <div className={`text-xs ${owner.kyc[item.key] ? 'text-[#00695C]' : 'text-[#B5C9C5]'}`}>
                          {owner.kyc[item.key] ? <FiCheckCircle /> : <FiXCircle />}
                        </div>
                        <p className="text-[7px] text-[#5A7D78] uppercase">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{owner.propertiesCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{owner.leadsCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A] flex items-center justify-center gap-0.5">
                        <FaStarSolid className="text-amber-400 text-[10px]" />
                        {owner.rating}
                      </p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Rating</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproval(owner.id, 'approve')}
                          disabled={actionLoading === 'approve'}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F8F5] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === 'approve' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproval(owner.id, 'reject')}
                          disabled={actionLoading === 'reject'}
                          className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === 'reject' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewOwner(owner)}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEye className="text-[10px]" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditOwner(owner)}
                          className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEdit className="text-[10px]" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewOwnerProperties(owner)}
                          className="flex-1 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiHome className="text-[10px]" /> Properties
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(owner.id)}
                          disabled={actionLoading === `block_${owner.id}`}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                            owner.status === 'blocked'
                              ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]'
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {actionLoading === `block_${owner.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : owner.status === 'blocked' ? (
                            <FiUnlock className="text-[10px]" />
                          ) : (
                            <FiLock className="text-[10px]" />
                          )}
                          {owner.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                      </>
                    )}
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
                  checked={selectedOwners.length === paginatedOwners.length && paginatedOwners.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Owner</span>
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
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertiesCount')}>
                Props {sortField === 'propertiesCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('rating')}>
                Rating {sortField === 'rating' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('registrationDate')}>
                Registered {sortField === 'registrationDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedOwners.map((owner, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700',
                approved: 'bg-[#E8F8F5] text-[#00695C]',
                rejected: 'bg-red-50 text-red-700',
                blocked: 'bg-gray-100 text-gray-600'
              };

              const verificationColors = {
                verified: 'bg-[#E8F8F5] text-[#00695C]',
                pending: 'bg-[#FEF3E2] text-amber-700',
                rejected: 'bg-red-50 text-red-700'
              };

              const isSelected = selectedOwners.includes(owner.id);
              const isPending = owner.status === 'pending';
              const showVerifiedBadge = owner.kycStatus === 'verified' && owner.status !== 'rejected' && owner.status !== 'blocked';

              return (
                <div
                  key={owner.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''} ${isPending ? 'bg-amber-50/30' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOwner(owner.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {owner.avatar}
                      </div>
                      {showVerifiedBadge && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{owner.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{owner.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[owner.status]}`}>
                      {owner.status.charAt(0).toUpperCase() + owner.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${verificationColors[owner.kycStatus]}`}>
                      {owner.kycStatus.charAt(0).toUpperCase() + owner.kycStatus.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{owner.city}</div>

                  <div className="col-span-1 flex items-center gap-1">
                    {owner.verification.email ? (
                      <FiCheckCircle className="text-[#00695C] text-xs" title="Email Verified" />
                    ) : (
                      <FiXCircle className="text-[#B5C9C5] text-xs" title="Email Not Verified" />
                    )}
                    {owner.verification.phone ? (
                      <FiCheckCircle className="text-[#00695C] text-xs" title="Phone Verified" />
                    ) : (
                      <FiXCircle className="text-[#B5C9C5] text-xs" title="Phone Not Verified" />
                    )}
                  </div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{owner.phone}</div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A]">{owner.propertiesCount}</p>
                  </div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A] flex items-center justify-center gap-0.5">
                      <FaStarSolid className="text-amber-400 text-[10px]" />
                      {owner.rating}
                    </p>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(owner.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproval(owner.id, 'approve')}
                          disabled={actionLoading === 'approve'}
                          className="w-7 h-7 rounded-lg hover:bg-[#E8F8F5] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 disabled:opacity-50"
                          title="Approve"
                        >
                          {actionLoading === 'approve' ? <FiRefreshCw className="text-xs animate-spin" /> : <FiCheckCircle className="text-xs" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproval(owner.id, 'reject')}
                          disabled={actionLoading === 'reject'}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50"
                          title="Reject"
                        >
                          {actionLoading === 'reject' ? <FiRefreshCw className="text-xs animate-spin" /> : <FiXCircle className="text-xs" />}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewOwner(owner)}
                          className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                          title="View"
                        >
                          <FiEye className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditOwner(owner)}
                          className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                          title="Edit"
                        >
                          <FiEdit className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewOwnerProperties(owner)}
                          className="w-7 h-7 rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-purple-600 hover:scale-110"
                          title="View Properties"
                        >
                          <FiHome className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(owner.id)}
                          disabled={actionLoading === `block_${owner.id}`}
                          className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                            owner.status === 'blocked'
                              ? 'text-[#00695C] hover:bg-[#E8F8F5]'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title={owner.status === 'blocked' ? 'Unblock' : 'Block'}
                        >
                          {actionLoading === `block_${owner.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : owner.status === 'blocked' ? (
                            <FiUnlock className="text-xs" />
                          ) : (
                            <FiLock className="text-xs" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedOwners.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUserPlus className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No owners found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No owners match your current view'}
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
              {Math.min(currentPage * pageSize, filteredOwners.length)} of{' '}
              {filteredOwners.length} owners
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

export default OwnersRegistration;