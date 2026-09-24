// src/components/dashboard/admin/buyer&tenants/SiteVisits/SiteVisitDashboard.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHeart, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch, FiFilter,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye,
  FiTrash2, FiRefreshCw, FiPlus, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiStar, FiShield, FiBriefcase, FiMail, FiPhone, FiExternalLink,
  FiTag, FiGrid, FiRepeat, FiNavigation, FiCornerUpRight
} from 'react-icons/fi';
import {
  FaHeart, FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaClipboardCheck
} from 'react-icons/fa';

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
// CONFIRMATION MODAL COMPONENT
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Yes', cancelText = 'No' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <FiAlertTriangle className="text-4xl text-red-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A] text-center mb-2">{title}</h3>
          <p className="text-sm text-[#5A7D78] text-center">{message}</p>
        </div>
        <div className="flex border-t border-[#E8F0EE]">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-medium text-[#5A7D78] hover:bg-[#F5F9F8] transition-colors duration-300 border-r border-[#E8F0EE]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
          >
            {confirmText}
          </button>
        </div>
      </div>
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
// VIEW SITE VISIT MODAL
// ============================================================
const ViewSiteVisitModal = ({ visit, show, onClose, onRemove, onViewProperty }) => {
  if (!visit || !show) return null;

  const statusColors = {
    pending: 'bg-[#FEF3E2] text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-[#E8F8F5] text-[#00695C]',
    cancelled: 'bg-red-50 text-red-700',
    rescheduled: 'bg-purple-50 text-purple-700'
  };

  const propertyTypeColors = {
    Individual: 'bg-blue-50 text-blue-700',
    Apartment: 'bg-purple-50 text-purple-700',
    Commercial: 'bg-orange-50 text-orange-700',
    'Land & Plots': 'bg-green-50 text-green-700',
    Hostel: 'bg-pink-50 text-pink-700'
  };

  const propertyImages = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'
  ];

  const getRandomImage = () => {
    const index = Math.floor(Math.random() * propertyImages.length);
    return propertyImages[index];
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = visit.imageUrl || getRandomImage();

  const handleViewClick = () => {
    if (onViewProperty) {
      onViewProperty(visit.id);
    }
  };

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
          <h2 className="text-2xl font-bold text-white">Site Visit Details</h2>
          <p className="text-white/80 text-sm">{visit.buyerName} · {visit.propertyName}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Status Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[visit.status] || statusColors.pending}`}>
                {visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : 'Pending'}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${propertyTypeColors[visit.propertyType]}`}>
                {visit.propertyType || 'N/A'}
              </span>
            </div>

            {/* Property Image */}
            <div className="bg-[#F5F9F8] rounded-2xl overflow-hidden relative">
              {!imageLoaded && !imageError && (
                <div className="w-full h-64 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center animate-pulse">
                  <FaImage className="text-4xl text-[#00695C]/20" />
                </div>
              )}
              {imageError ? (
                <div className="w-full h-64 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex flex-col items-center justify-center">
                  <FaHomeSolid className="text-5xl text-[#00695C]/30 mb-2" />
                  <p className="text-sm text-[#5A7D78]">Image not available</p>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={visit.propertyName || 'Property'}
                  className={`w-full h-64 object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              {imageLoaded && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-[10px] font-medium flex items-center gap-1">
                    <FaImage className="text-[10px]" /> {visit.propertyType || 'Property'}
                  </span>
                </div>
              )}
            </div>

            {/* Visit Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Buyer Name */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer / Tenant</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.buyerName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{visit.buyerEmail || ''}</p>
              </div>

              {/* Property Name */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.propertyName || 'N/A'}</p>
              </div>

              {/* Agent */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FaUserTie className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned Agent</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.agentName || 'N/A'}</p>
              </div>

              {/* Location */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.location || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{visit.city || ''}, {visit.state || ''}</p>
              </div>

              {/* Visit Date */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Date</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">
                  {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Visit Time */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiClock className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Time</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{visit.visitTime || 'N/A'}</p>
              </div>

              {/* Status */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiTag className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit Status</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[visit.status] || statusColors.pending}`}>
                  {visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : 'Pending'}
                </span>
              </div>
            </div>

            {/* Buyer Contact Info */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Email</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{visit.buyerEmail || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5A7D78]">Phone</span>
                  <span className="text-sm font-medium text-[#1A2E2A]">{visit.buyerPhone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {visit.notes && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Notes</h4>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{visit.notes}</p>
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
              onClick={handleViewClick}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              <FiExternalLink className="inline mr-2" /> View Property
            </button>
            <button
              onClick={() => onRemove && onRemove(visit.id)}
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
// MAIN COMPONENT
// ============================================================
const SiteVisitDashboard = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('visitDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVisits, setSelectedVisits] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingVisit, setViewingVisit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    itemId: null,
    isBulk: false
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    rescheduled: 0
  });

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        rescheduled: 0
      });
      return;
    }

    const total = list.length;
    const pending = list.filter(v => v.status === 'pending').length;
    const confirmed = list.filter(v => v.status === 'confirmed').length;
    const completed = list.filter(v => v.status === 'completed').length;
    const cancelled = list.filter(v => v.status === 'cancelled').length;
    const rescheduled = list.filter(v => v.status === 'rescheduled').length;

    setStats({
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      rescheduled
    });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockVisits = useCallback(() => {
    const buyerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta', 'Vivek Nair', 'Shalini Pillai'];
    const agentNames = ['Arjun Menon', 'Priya Iyer', 'Suresh Rao', 'Kavya Nambiar', 'Deepak Chandran', 'Meera Krishnan'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower', 'Lotus Heights', 'Jasmine Villa'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'];
    const locations = ['MG Road', 'Banjara Hills', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jubilee Hills', 'Connaught Place', 'Salt Lake', 'Marine Drive', 'Andheri'];
    const visitTimes = ['09:00 AM', '10:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '04:00 PM', '05:30 PM'];

    const propertyImages = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'
    ];

    const visitsList = [];
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

      const city = cities[Math.floor(Math.random() * cities.length)];

      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 60) - 20);

      visitsList.push({
        id: `visit_${i}`,
        buyerName: buyerName,
        buyerEmail: `${buyerName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        buyerPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        propertyName: propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        city: city,
        state: states[Math.floor(Math.random() * states.length)],
        visitDate: visitDate.toISOString(),
        visitTime: visitTimes[Math.floor(Math.random() * visitTimes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: Math.random() > 0.7 ? 'Buyer requested a second viewing' : '',
        imageUrl: propertyImages[Math.floor(Math.random() * propertyImages.length)]
      });
    }

    computeStats(visitsList);
    return visitsList;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
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

  // ============ FILTER VISITS ============
  const filterVisits = useCallback(() => {
    try {
      let filtered = [...visits];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(v =>
          (v.propertyName && v.propertyName.toLowerCase().includes(query)) ||
          (v.buyerName && v.buyerName.toLowerCase().includes(query)) ||
          (v.buyerEmail && v.buyerEmail.toLowerCase().includes(query)) ||
          (v.buyerPhone && v.buyerPhone.includes(query)) ||
          (v.agentName && v.agentName.toLowerCase().includes(query)) ||
          (v.city && v.city.toLowerCase().includes(query)) ||
          (v.location && v.location.toLowerCase().includes(query)) ||
          (v.propertyType && v.propertyType.toLowerCase().includes(query))
        );
      }

      if (selectedPropertyType !== 'all') {
        filtered = filtered.filter(v => v.propertyType === selectedPropertyType);
      }

      if (selectedStatus !== 'all') {
        filtered = filtered.filter(v => v.status === selectedStatus);
      }

      let count = 0;
      if (selectedPropertyType !== 'all') count++;
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

      setFilteredVisits(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering visits:', error);
    }
  }, [visits, searchQuery, selectedPropertyType, selectedStatus, sortField, sortDirection]);

  useEffect(() => {
    filterVisits();
  }, [filterVisits]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / pageSize));
  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredVisits.slice(start, end);
  }, [filteredVisits, currentPage, pageSize]);

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
    if (selectedVisits.length === paginatedVisits.length && paginatedVisits.length > 0) {
      setSelectedVisits([]);
    } else {
      setSelectedVisits(paginatedVisits.map(v => v.id));
    }
  }, [selectedVisits, paginatedVisits]);

  // ============ HANDLE SELECT VISIT ============
  const handleSelectVisit = useCallback((visitId) => {
    setSelectedVisits(prev =>
      prev.includes(visitId)
        ? prev.filter(id => id !== visitId)
        : [...prev, visitId]
    );
  }, []);

  // ============ VIEW VISIT ============
  const handleViewVisit = useCallback((visit) => {
    setViewingVisit(visit);
    setShowViewModal(true);
  }, []);

  // ============ VIEW PROPERTY DETAILS ============
  const handleViewPropertyDetails = useCallback((visitId) => {
    navigate('/properties/details');
    setToast({ message: 'Opening property details...', type: 'info' });
  }, [navigate]);

  // ============ SHOW CONFIRMATION MODAL ============
  const showConfirmation = useCallback((title, message, onConfirm, itemId = null, isBulk = false) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        onConfirm(itemId);
      },
      itemId,
      isBulk
    });
  }, []);

  // ============ REMOVE VISIT ============
  const handleRemoveVisit = useCallback((visitId) => {
    const visit = visits.find(v => v.id === visitId);
    if (!visit) return;

    showConfirmation(
      'Remove Site Visit',
      `Are you sure you want to remove "${visit.propertyName}" visit? This action cannot be undone.`,
      (id) => {
        setActionLoading(id);
        setTimeout(() => {
          setVisits(prev => {
            const updated = prev.filter(v => v.id !== id);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Visit for "${visit.propertyName}" removed`, type: 'warning' });
        }, 700);
      },
      visitId
    );
  }, [visits, computeStats, showConfirmation]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;

    setSelectedStatus('all');

    if (nextFilter === 'pending' || nextFilter === 'confirmed' || nextFilter === 'completed' || nextFilter === 'cancelled' || nextFilter === 'rescheduled') {
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
    setSelectedPropertyType('all');
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
        const mockVisits = generateMockVisits();
        setVisits(mockVisits);
        setFilteredVisits(mockVisits);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockVisits]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredVisits.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = filteredVisits.map(v => ({
        'Buyer Name': v.buyerName || '',
        'Buyer Email': v.buyerEmail || '',
        'Buyer Phone': v.buyerPhone || '',
        'Property Name': v.propertyName || '',
        'Property Type': v.propertyType || '',
        'Agent': v.agentName || '',
        Location: `${v.location || ''}, ${v.city || ''}, ${v.state || ''}`,
        'Visit Date': v.visitDate ? new Date(v.visitDate).toLocaleDateString() : '',
        'Visit Time': v.visitTime || '',
        Status: v.status ? v.status.charAt(0).toUpperCase() + v.status.slice(1) : '',
        Notes: v.notes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site_visits_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredVisits.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredVisits]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedVisits.length === 0) {
      setToast({ message: 'Please select visits first', type: 'warning' });
      return;
    }

    if (action === 'remove') {
      showConfirmation(
        'Remove Selected Visits',
        `Are you sure you want to remove ${selectedVisits.length} selected visit(s)? This action cannot be undone.`,
        () => {
          setActionLoading('remove');
          setTimeout(() => {
            const selectedIds = new Set(selectedVisits);
            let count = 0;

            setVisits(prev => {
              const updated = prev.filter(v => {
                if (!selectedIds.has(v.id)) return true;
                count++;
                return false;
              });
              computeStats(updated);
              return updated;
            });

            setSelectedVisits([]);
            setActionLoading(null);
            setToast({ message: `${count} visit(s) removed`, type: 'warning' });
          }, 800);
        },
        null,
        true
      );
      return;
    }

    // For confirm action (no confirmation needed)
    setActionLoading(action);
    setTimeout(() => {
      const selectedIds = new Set(selectedVisits);
      let count = 0;

      setVisits(prev => {
        const updated = prev.map(v => {
          if (!selectedIds.has(v.id)) return v;
          count++;
          return { ...v, status: 'confirmed' };
        });
        computeStats(updated);
        return updated;
      });

      setSelectedVisits([]);
      setActionLoading(null);
      setToast({ message: `${count} visit(s) confirmed`, type: 'success' });
    }, 800);
  }, [selectedVisits, computeStats, showConfirmation]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
      confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
      completed: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      rescheduled: 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[status] || colors.pending;
  };

  // ============ PROPERTY TYPE COLOR HELPER ============
  const getPropertyTypeColor = (type) => {
    const colors = {
      Individual: 'bg-blue-50 text-blue-700',
      Apartment: 'bg-purple-50 text-purple-700',
      Commercial: 'bg-orange-50 text-orange-700',
      'Land & Plots': 'bg-green-50 text-green-700',
      Hostel: 'bg-pink-50 text-pink-700'
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmationModal.onConfirm) {
            confirmationModal.onConfirm();
          }
        }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Yes"
        cancelText="No"
      />

      {/* View Modal */}
      {showViewModal && viewingVisit && (
        <ViewSiteVisitModal
          visit={viewingVisit}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingVisit(null); }}
          onRemove={handleRemoveVisit}
          onViewProperty={handleViewPropertyDetails}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Site Visit Dashboard
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
              <span>Manage &amp; Track Site Visits</span>
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

      {/* Stats Section - All 6 Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4  gap-3">
              <StatCard
                icon={<FiNavigation className="text-white text-sm" />}
                title="Total Site Visits"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={50}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Confirmed"
                value={stats.confirmed}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={100}
                isActive={activeFilter === 'confirmed'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('confirmed')}
              />
              <StatCard
                icon={<FaClipboardCheck className="text-white text-sm" />}
                title="Completed"
                value={stats.completed}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={150}
                isActive={activeFilter === 'completed'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('completed')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Cancelled"
                value={stats.cancelled}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={200}
                isActive={activeFilter === 'cancelled'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('cancelled')}
              />
              <StatCard
                icon={<FiRepeat className="text-white text-sm" />}
                title="Rescheduled"
                value={stats.rescheduled}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={250}
                isActive={activeFilter === 'rescheduled'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('rescheduled')}
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
              placeholder="Search by buyer name, property name, agent, or location..."
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
                value={selectedPropertyType}
                onChange={(e) => {
                  setSelectedPropertyType(e.target.value);
                }}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
                <option value="Land & Plots">Land & Plots</option>
                <option value="Hostel">Hostel</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
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
        {selectedVisits.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedVisits.length}</span> visit(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('confirm')}
                disabled={actionLoading === 'confirm'}
                className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'confirm' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Confirm All
              </button>
              <button
                onClick={() => handleBulkAction('remove')}
                disabled={actionLoading === 'remove'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'remove' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Remove All
              </button>
              <button
                onClick={() => setSelectedVisits([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Visits Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedVisits.map((visit, index) => {
              const isSelected = selectedVisits.includes(visit.id);

              return (
                <div
                  key={visit.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    visit.status === 'confirmed' ? 'border-l-4 border-l-blue-500' :
                    visit.status === 'pending' ? 'border-l-4 border-l-amber-500' :
                    visit.status === 'completed' ? 'border-l-4 border-l-emerald-500' :
                    visit.status === 'cancelled' ? 'border-l-4 border-l-red-500' :
                    visit.status === 'rescheduled' ? 'border-l-4 border-l-purple-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectVisit(visit.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          <FiNavigation className="text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{visit.buyerName}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(visit.status)}`}>
                            {visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : 'N/A'}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getPropertyTypeColor(visit.propertyType)}`}>
                            {visit.propertyType || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewVisit(visit)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium text-[#1A2E2A]">{visit.buyerName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHome className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{visit.propertyName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FaUserTie className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{visit.agentName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{visit.location || ''}, {visit.city || ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>{visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiClock className="text-[#00695C] flex-shrink-0" />
                      <span>{visit.visitTime || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(visit.status)}`}>
                        {visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewVisit(visit)}
                      className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewPropertyDetails(visit.id)}
                      className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiExternalLink className="text-[10px]" /> Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVisit(visit.id)}
                      disabled={actionLoading === visit.id}
                      className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === visit.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                  checked={selectedVisits.length === paginatedVisits.length && paginatedVisits.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Buyer</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertyName')}>
                Property Name {sortField === 'propertyName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('agentName')}>
                Agent {sortField === 'agentName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('visitDate')}>
                Visit Date {sortField === 'visitDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center">Time</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedVisits.map((visit, index) => {
              const isSelected = selectedVisits.includes(visit.id);

              return (
                <div
                  key={visit.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectVisit(visit.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {visit.buyerName ? visit.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                    </div>
                  </div>

                  {/* Buyer Name */}
                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{visit.buyerName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{visit.buyerEmail || 'N/A'}</p>
                  </div>

                  {/* Property Name */}
                  <div className="col-span-1">
                    <p className="text-xs font-medium text-[#1A2E2A] truncate">{visit.propertyName || 'N/A'}</p>
                  </div>

                  {/* Property Type */}
                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPropertyTypeColor(visit.propertyType)}`}>
                      {visit.propertyType || 'N/A'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(visit.status)}`}>
                      {visit.status ? visit.status.charAt(0).toUpperCase() + visit.status.slice(1) : 'N/A'}
                    </span>
                  </div>

                  {/* Agent */}
                  <div className="col-span-2 text-xs text-[#5A7D78] truncate">
                    {visit.agentName || 'N/A'}
                  </div>

                  {/* Visit Date */}
                  <div className="col-span-1 text-center text-[10px] text-[#5A7D78]">
                    {visit.visitDate ? new Date(visit.visitDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>

                  {/* Visit Time */}
                  <div className="col-span-1 text-center text-[10px] text-[#5A7D78]">
                    {visit.visitTime || 'N/A'}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewVisit(visit)}
                      className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                      title="View"
                    >
                      <FiEye className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewPropertyDetails(visit.id)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                      title="Property Details"
                    >
                      <FiExternalLink className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVisit(visit.id)}
                      disabled={actionLoading === visit.id}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50"
                      title="Remove"
                    >
                      {actionLoading === visit.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-xs" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedVisits.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiNavigation className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No site visits found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No site visits have been scheduled yet'}
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
              {Math.min(currentPage * pageSize, filteredVisits.length)} of{' '}
              {filteredVisits.length} visits
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

export default SiteVisitDashboard;