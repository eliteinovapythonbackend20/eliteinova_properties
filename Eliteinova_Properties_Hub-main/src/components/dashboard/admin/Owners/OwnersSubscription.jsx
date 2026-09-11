// src/components/dashboard/admin/Owners/OwnersSubscription.jsx

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
  FiPrinter, FiCopy, FiShare, FiSettings, FiAward, FiBriefcase, FiHome,
  FiDollarSign, FiCreditCard, FiPieChart, FiTrendingUp, FiTrendingDown,
  FiBarChart2, FiTarget, FiGlobe, FiZap, FiGift, FiHeart,
  FiMonitor, FiSmartphone, FiHeadphones, FiThumbsUp,
  FiCheck, FiMinus, FiMaximize, FiMinimize
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCrown, FaGem, FaMedal, FaRocket,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaUserCircle, FaStore,
  FaDollarSign, FaCreditCard, FaChartLine, FaTrophy,
  FaGift, FaHeart, FaThumbsUp, FaStarHalfAlt
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness } from 'react-icons/md';

// ============ TOAST COMPONENT ============
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

// ============ STAT CARD COMPONENT ============
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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

// ============ SUBSCRIPTION PLAN CARD - MODERN PREMIUM DESIGN ============
const SubscriptionPlanCard = ({ 
  plan, 
  isPopular, 
  isCurrent, 
  onSelect, 
  onCancel,
  loading 
}) => {
  const planConfig = {
    Free: {
      gradient: 'from-slate-100 to-slate-200',
      border: 'border-slate-200',
      accent: 'bg-slate-50',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      button: 'bg-slate-600 hover:bg-slate-700',
      priceColor: 'text-slate-700',
      shadow: 'shadow-slate-200/50',
    },
    Silver: {
      gradient: 'from-gray-200 to-gray-300',
      border: 'border-gray-300',
      accent: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      badgeBg: 'bg-gray-200',
      badgeText: 'text-gray-700',
      button: 'bg-gray-600 hover:bg-gray-700',
      priceColor: 'text-gray-700',
      shadow: 'shadow-gray-300/50',
    },
    Gold: {
      gradient: 'from-amber-100 to-amber-300',
      border: 'border-amber-300',
      accent: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-700',
      button: 'bg-amber-500 hover:bg-amber-600',
      priceColor: 'text-amber-700',
      shadow: 'shadow-amber-300/50',
    },
    Platinum: {
      gradient: 'from-purple-100 to-purple-300',
      border: 'border-purple-300',
      accent: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
      button: 'bg-purple-500 hover:bg-purple-600',
      priceColor: 'text-purple-700',
      shadow: 'shadow-purple-300/50',
    }
  };

  const config = planConfig[plan.name] || planConfig.Free;

  // Get the plan icon
  const getPlanIcon = (name) => {
    const icons = {
      Free: <FiUser className="text-2xl" />,
      Silver: <FiStar className="text-2xl" />,
      Gold: <FaCrown className="text-2xl" />,
      Platinum: <FaGem className="text-2xl" />
    };
    return icons[name] || <FiUser className="text-2xl" />;
  };

  return (
    <div 
      className={`relative bg-white rounded-2xl border-2 ${config.border} p-5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group ${
        isPopular ? 'border-[#00695C] shadow-xl' : ''
      } ${isCurrent ? 'border-emerald-400 shadow-lg' : ''}`}
    >
      {/* Background gradient accent */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Popular Badge - Center Top */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1 bg-[#00695C] text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
            <FiZap className="text-[10px]" />
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Current Plan Badge - Left Side */}
      {isCurrent && (
        <div className="absolute -top-1 -left-1 z-10">
          <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <FiCheck className="text-[10px]" /> ACTIVE
          </span>
        </div>
      )}

      <div className="relative z-10">
        {/* Plan Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1A2E2A] tracking-tight">{plan.name}</h3>
            <p className="text-xs text-[#5A7D78] mt-0.5">{plan.description}</p>
          </div>
          <div className={`w-12 h-12 rounded-2xl ${config.iconBg} flex items-center justify-center ${config.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {getPlanIcon(plan.name)}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-end gap-1">
          <span className={`text-4xl font-extrabold ${config.priceColor}`}>${plan.price}</span>
          <span className="text-sm text-[#5A7D78] font-medium mb-1">/{plan.period}</span>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-5">
          {plan.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-[#1A2E2A] group-hover:text-[#1A2E2A] transition-colors">
              <div className="w-4 h-4 rounded-full bg-[#00695C]/10 flex items-center justify-center shrink-0">
                <FiCheck className="text-[10px] text-[#00695C]" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <div className="text-xs text-[#5A7D78] pl-6">+{plan.features.length - 4} more features</div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-2">
          {isCurrent ? (
            <button
              onClick={onCancel}
              disabled={loading === plan.name}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md disabled:opacity-50"
            >
              {loading === plan.name ? (
                <FiRefreshCw className="animate-spin" />
              ) : (
                <>
                  <FiXCircle className="text-sm" />
                  Cancel Plan
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onSelect(plan)}
              disabled={loading === plan.name}
              className={`w-full py-3 rounded-xl text-sm font-semibold text-white ${config.button} transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-xl group-hover:scale-[1.02] disabled:opacity-50`}
            >
              {loading === plan.name ? (
                <FiRefreshCw className="animate-spin" />
              ) : isPopular ? (
                <>
                  <FaRocket className="text-sm" />
                  Get Started
                </>
              ) : (
                'Choose Plan'
              )}
            </button>
          )}
        </div>

        {/* Bottom indicator */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-[#B5C9C5] uppercase tracking-wider">
            {isCurrent ? '✅ Currently Active' : isPopular ? '⭐ Best Value' : '↗️ Start Today'}
          </span>
        </div>
      </div>
    </div>
  );
};
// ============ CONFIRMATION MODAL ============
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmColor = 'bg-red-500',
  icon = <FiAlertTriangle className="text-4xl text-red-500" />,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-[#1A2E2A] mb-1.5">{title}</h3>
          <p className="text-sm text-[#5A7D78] mb-4 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const OwnersSubscription = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('ownerName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmColor: 'bg-red-500',
    icon: <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm: null,
    planName: null,
    action: null,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    active: 0,
    expired: 0,
    cancelled: 0,
    revenue: 0,
  });

  // ============ SUBSCRIPTION PLANS ============
  const planDetails = {
    Free: {
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Basic plan for getting started',
      icon: <FiUser className="text-white text-2xl" />,
      color: 'from-gray-400 to-gray-500',
      features: [
        '3 Property Listings',
        'Basic Support',
        '1 Month Validity',
        'Standard Visibility',
        'Basic Analytics'
      ],
      limitations: [
        'No Featured Listings',
        'No Priority Support',
        'Limited Properties'
      ]
    },
    Silver: {
      name: 'Silver',
      price: 299,
      period: 'month',
      description: 'Great for growing businesses',
      icon: <FiStar className="text-white text-2xl" />,
      color: 'from-gray-500 to-gray-600',
      features: [
        '10 Property Listings',
        'Priority Support',
        '6 Months Validity',
        'Enhanced Visibility',
        'Advanced Analytics',
        '1 Featured Listing',
        'Basic Marketing Tools'
      ],
      limitations: [
        'Limited Featured Listings',
        'No Premium Support'
      ]
    },
    Gold: {
      name: 'Gold',
      price: 599,
      period: 'month',
      description: 'Perfect for established agencies',
      icon: <FaCrown className="text-white text-2xl" />,
      color: 'from-amber-400 to-amber-600',
      features: [
        '25 Property Listings',
        'Premium Support 24/7',
        '1 Year Validity',
        'Premium Visibility',
        'Advanced Analytics Dashboard',
        '5 Featured Listings',
        'Full Marketing Suite',
        'Lead Management Tools',
        'Property Promotion'
      ],
      limitations: []
    },
    Platinum: {
      name: 'Platinum',
      price: 999,
      period: 'month',
      description: 'The ultimate premium experience',
      icon: <FaGem className="text-white text-2xl" />,
      color: 'from-purple-400 to-purple-600',
      features: [
        'Unlimited Property Listings',
        'VIP Support 24/7',
        '2 Years Validity',
        'Top Visibility',
        'Enterprise Analytics',
        'Unlimited Featured Listings',
        'Complete Marketing Suite',
        'Advanced Lead Management',
        'Exclusive Promotions',
        'Priority Placement',
        'Dedicated Account Manager'
      ],
      limitations: []
    }
  };

  // ============ GENERATE MOCK SUBSCRIPTIONS ============
  const generateMockSubscriptions = useCallback(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta'];
    const planNames = ['Free', 'Silver', 'Gold', 'Platinum'];
    const statuses = ['active', 'expired', 'cancelled'];

    const subscriptions = [];

    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const planName = planNames[Math.floor(Math.random() * planNames.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 12));
      
      const endDate = new Date(startDate);
      const duration = planName === 'Free' ? 1 : planName === 'Silver' ? 6 : planName === 'Gold' ? 12 : 24;
      endDate.setMonth(endDate.getMonth() + duration);

      const plan = planDetails[planName];
      
      subscriptions.push({
        id: `sub_${i}`,
        ownerName: fullName,
        ownerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        ownerPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        planName: planName,
        planPrice: plan.price,
        status: status,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        features: plan.features,
        limitations: plan.limitations || [],
        propertiesCount: Math.floor(Math.random() * (planName === 'Free' ? 3 : planName === 'Silver' ? 10 : planName === 'Gold' ? 25 : 50)) + 1,
        autoRenew: Math.random() > 0.3,
        paymentMethod: ['Credit Card', 'UPI', 'Net Banking', 'Wallet'][Math.floor(Math.random() * 4)],
        lastPayment: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        totalSpent: Math.floor(Math.random() * (planName === 'Platinum' ? 50000 : planName === 'Gold' ? 25000 : planName === 'Silver' ? 10000 : 0)),
      });
    }

    return subscriptions;
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockSubscriptions = generateMockSubscriptions();
    setSubscriptions(mockSubscriptions);
    setFilteredSubscriptions(mockSubscriptions);
    updateStats(mockSubscriptions);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockSubscriptions]);

  // ============ UPDATE STATS ============
  const updateStats = useCallback((data) => {
    const total = data.length;
    const free = data.filter(s => s.planName === 'Free').length;
    const silver = data.filter(s => s.planName === 'Silver').length;
    const gold = data.filter(s => s.planName === 'Gold').length;
    const platinum = data.filter(s => s.planName === 'Platinum').length;
    const active = data.filter(s => s.status === 'active').length;
    const expired = data.filter(s => s.status === 'expired').length;
    const cancelled = data.filter(s => s.status === 'cancelled').length;
    const revenue = data.reduce((sum, s) => sum + (s.status === 'active' ? s.planPrice : 0), 0);

    setStats({
      total,
      free,
      silver,
      gold,
      platinum,
      active,
      expired,
      cancelled,
      revenue,
    });
  }, []);

  // ============ FILTER SUBSCRIPTIONS ============
  const filterSubscriptions = useCallback(() => {
    let filtered = [...subscriptions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.ownerName.toLowerCase().includes(query) ||
        sub.ownerEmail.toLowerCase().includes(query) ||
        sub.planName.toLowerCase().includes(query)
      );
    }

    if (selectedPlan !== 'all') {
      filtered = filtered.filter(sub => sub.planName === selectedPlan);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(sub => sub.status === selectedStatus);
    }

    let count = 0;
    if (selectedPlan !== 'all') count++;
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

    setFilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [subscriptions, searchQuery, selectedPlan, selectedStatus, sortField, sortDirection]);

  useEffect(() => {
    filterSubscriptions();
  }, [filterSubscriptions]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredSubscriptions.length / pageSize);
  const paginatedSubscriptions = useMemo(() =>
    filteredSubscriptions.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredSubscriptions, currentPage, pageSize]);

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
    if (selectedSubscriptions.length === paginatedSubscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(paginatedSubscriptions.map(sub => sub.id));
    }
  }, [selectedSubscriptions, paginatedSubscriptions]);

  // ============ HANDLE SELECT SUBSCRIPTION ============
  const handleSelectSubscription = useCallback((subscriptionId) => {
    setSelectedSubscriptions(prev =>
      prev.includes(subscriptionId)
        ? prev.filter(id => id !== subscriptionId)
        : [...prev, subscriptionId]
    );
  }, []);

  // ============ SHOW CONFIRMATION MODAL ============
  const showConfirmation = useCallback(({
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    confirmColor = 'bg-red-500',
    icon = <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm,
    planName,
    action,
  }) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmColor,
      icon,
      onConfirm,
      planName,
      action,
    });
  }, []);

  // ============ CLOSE CONFIRMATION MODAL ============
  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ============ HANDLE CONFIRM ACTION ============
  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, planName, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${planName}`);
      await onConfirm(planName);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ HANDLE SELECT PLAN ============
  const handleSelectPlan = useCallback((plan) => {
    showConfirmation({
      title: `Upgrade to ${plan.name} Plan`,
      message: `Are you sure you want to upgrade to the ${plan.name} plan? You will be charged $${plan.price}/month.`,
      confirmText: `Yes, Upgrade to ${plan.name}`,
      confirmColor: plan.name === 'Gold' ? 'bg-amber-500' : plan.name === 'Platinum' ? 'bg-purple-500' : plan.name === 'Silver' ? 'bg-gray-500' : 'bg-[#00695C]',
      icon: plan.name === 'Gold' ? <FaCrown className="text-4xl text-amber-500" /> : 
            plan.name === 'Platinum' ? <FaGem className="text-4xl text-purple-500" /> :
            plan.name === 'Silver' ? <FiStar className="text-4xl text-gray-500" /> :
            <FiUser className="text-4xl text-[#00695C]" />,
      onConfirm: (planName) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setSubscriptions(prev => {
              // Find a subscription to upgrade (first active one or create new)
              const existingIndex = prev.findIndex(s => s.status === 'active');
              let updated;
              if (existingIndex >= 0) {
                updated = [...prev];
                const sub = updated[existingIndex];
                updated[existingIndex] = {
                  ...sub,
                  planName: planName,
                  planPrice: planDetails[planName].price,
                  status: 'active',
                  features: planDetails[planName].features,
                  limitations: planDetails[planName].limitations || [],
                };
              } else {
                // Create new subscription
                const firstName = ['Rajesh', 'Priya', 'Amit', 'Sneha'][Math.floor(Math.random() * 4)];
                const lastName = ['Kumar', 'Sharma', 'Singh', 'Patel'][Math.floor(Math.random() * 4)];
                updated = [...prev, {
                  id: `sub_${Date.now()}`,
                  ownerName: `${firstName} ${lastName}`,
                  ownerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
                  ownerPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
                  planName: planName,
                  planPrice: planDetails[planName].price,
                  status: 'active',
                  startDate: new Date().toISOString(),
                  endDate: new Date(Date.now() + (planName === 'Free' ? 30 : planName === 'Silver' ? 180 : planName === 'Gold' ? 365 : 730) * 24 * 60 * 60 * 1000).toISOString(),
                  features: planDetails[planName].features,
                  limitations: planDetails[planName].limitations || [],
                  propertiesCount: Math.floor(Math.random() * 10) + 1,
                  autoRenew: true,
                  paymentMethod: 'Credit Card',
                  lastPayment: new Date().toISOString(),
                  totalSpent: 0,
                }];
              }
              updateStats(updated);
              showToast(`Successfully upgraded to ${planName} plan!`, 'success');
              return updated;
            });
            resolve();
          }, 1000);
        });
      },
      planName: plan.name,
      action: 'upgrade',
    });
  }, [showConfirmation, showToast, updateStats]);

  // ============ HANDLE CANCEL PLAN ============
  const handleCancelPlan = useCallback((planName) => {
    showConfirmation({
      title: `Cancel ${planName} Plan`,
      message: `Are you sure you want to cancel your ${planName} plan? You will lose access to premium features at the end of your billing cycle.`,
      confirmText: 'Yes, Cancel',
      confirmColor: 'bg-red-500',
      icon: <FiXCircle className="text-4xl text-red-500" />,
      onConfirm: (planName) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setSubscriptions(prev => {
              const updated = prev.map(sub => {
                if (sub.planName === planName && sub.status === 'active') {
                  showToast(`${planName} plan cancelled successfully`, 'warning');
                  return { ...sub, status: 'cancelled' };
                }
                return sub;
              });
              updateStats(updated);
              return updated;
            });
            resolve();
          }, 800);
        });
      },
      planName: planName,
      action: 'cancel',
    });
  }, [showConfirmation, showToast, updateStats]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSelectedPlan('all');
      setSelectedStatus('all');
    } else if (filter === 'free') {
      setSelectedPlan('Free');
      setSelectedStatus('all');
    } else if (filter === 'silver') {
      setSelectedPlan('Silver');
      setSelectedStatus('all');
    } else if (filter === 'gold') {
      setSelectedPlan('Gold');
      setSelectedStatus('all');
    } else if (filter === 'platinum') {
      setSelectedPlan('Platinum');
      setSelectedStatus('all');
    } else if (filter === 'active') {
      setSelectedPlan('all');
      setSelectedStatus('active');
    } else if (filter === 'expired') {
      setSelectedPlan('all');
      setSelectedStatus('expired');
    } else if (filter === 'cancelled') {
      setSelectedPlan('all');
      setSelectedStatus('cancelled');
    }
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedPlan('all');
    setSelectedStatus('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockSubscriptions = generateMockSubscriptions();
      setSubscriptions(mockSubscriptions);
      setFilteredSubscriptions(mockSubscriptions);
      updateStats(mockSubscriptions);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockSubscriptions, showToast, updateStats]);

  // ============ EXPORT SUBSCRIPTIONS ============
  const handleExportSubscriptions = useCallback(() => {
    const data = filteredSubscriptions.map(sub => ({
      'Owner Name': sub.ownerName,
      'Email': sub.ownerEmail,
      'Phone': sub.ownerPhone,
      'Plan': sub.planName,
      'Price': `$${sub.planPrice}`,
      'Status': sub.status,
      'Start Date': new Date(sub.startDate).toLocaleDateString(),
      'End Date': new Date(sub.endDate).toLocaleDateString(),
      'Auto Renew': sub.autoRenew ? 'Yes' : 'No',
      'Payment Method': sub.paymentMethod,
      'Last Payment': new Date(sub.lastPayment).toLocaleDateString(),
      'Properties': sub.propertiesCount,
      'Total Spent': `$${sub.totalSpent || 0}`,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredSubscriptions.length} subscriptions exported successfully`, 'success');
  }, [filteredSubscriptions, showToast]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedSubscriptions.length === 0) {
      showToast('Please select subscriptions first', 'warning');
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedSubscriptions);
      let updated = [...subscriptions];
      let count = 0;

      updated = updated.map(sub => {
        if (selectedIds.has(sub.id)) {
          count++;
          if (action === 'activate') {
            return { ...sub, status: 'active' };
          } else if (action === 'expire') {
            return { ...sub, status: 'expired' };
          } else if (action === 'cancel') {
            return { ...sub, status: 'cancelled' };
          }
        }
        return sub;
      });

      setSubscriptions(updated);
      updateStats(updated);
      setSelectedSubscriptions([]);
      setActionLoading(null);

      const messages = {
        activate: `${count} subscription(s) activated`,
        expire: `${count} subscription(s) expired`,
        cancel: `${count} subscription(s) cancelled`,
      };
      showToast(messages[action] || `${count} subscription(s) updated`, 'success');
    }, 800);
  }, [selectedSubscriptions, subscriptions, showToast, updateStats]);

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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
        loading={actionLoading !== null}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Subscriptions
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredSubscriptions.length} Subscriptions
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage all owner subscriptions and plans</span>
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
              onClick={handleExportSubscriptions}
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
                title="Total"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiUser className="text-white text-sm" />}
                title="Free"
                value={stats.free}
                color="bg-gradient-to-br from-gray-500 to-gray-400"
                delay={100}
                isActive={activeFilter === 'free'}
                onClick={() => handleStatClick('free')}
              />
              <StatCard
                icon={<FiStar className="text-white text-sm" />}
                title="Silver"
                value={stats.silver}
                color="bg-gradient-to-br from-gray-600 to-gray-500"
                delay={200}
                isActive={activeFilter === 'silver'}
                onClick={() => handleStatClick('silver')}
              />
              <StatCard
                icon={<FaCrown className="text-white text-sm" />}
                title="Gold"
                value={stats.gold}
                color="bg-gradient-to-br from-amber-500 to-amber-400"
                delay={300}
                isActive={activeFilter === 'gold'}
                onClick={() => handleStatClick('gold')}
              />
              <StatCard
                icon={<FaGem className="text-white text-sm" />}
                title="Platinum"
                value={stats.platinum}
                color="bg-gradient-to-br from-purple-500 to-purple-400"
                delay={400}
                isActive={activeFilter === 'platinum'}
                onClick={() => handleStatClick('platinum')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Active"
                value={stats.active}
                color="bg-gradient-to-br from-emerald-500 to-emerald-400"
                delay={500}
                isActive={activeFilter === 'active'}
                onClick={() => handleStatClick('active')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Expired"
                value={stats.expired}
                color="bg-gradient-to-br from-amber-500 to-amber-400"
                delay={600}
                isActive={activeFilter === 'expired'}
                onClick={() => handleStatClick('expired')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Cancelled"
                value={stats.cancelled}
                color="bg-gradient-to-br from-red-500 to-red-400"
                delay={700}
                isActive={activeFilter === 'cancelled'}
                onClick={() => handleStatClick('cancelled')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Plan Cards Section */}
      <div className="relative">
        <h2 className="text-xl font-bold text-[#1A2E2A] mb-4 flex items-center gap-2">
          <FiCreditCard className="text-[#00695C]" />
          Subscription Plans
          <span className="text-sm font-normal text-[#5A7D78] ml-2">Choose the perfect plan for your business</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(planDetails).map((plan, index) => (
            <SubscriptionPlanCard
              key={plan.name}
              plan={plan}
              isPopular={plan.name === 'Gold'}
              isCurrent={subscriptions.some(s => s.planName === plan.name && s.status === 'active')}
              onSelect={handleSelectPlan}
              onCancel={handleCancelPlan}
              loading={actionLoading}
            />
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by owner name, email, or plan..."
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
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Plans</option>
                <option value="Free">Free</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
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
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
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
        {selectedSubscriptions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedSubscriptions.length}</span> subscription(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                disabled={actionLoading === 'activate'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'activate' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('expire')}
                disabled={actionLoading === 'expire'}
                className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'expire' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiClock className="text-[10px]" />}
                Expire
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                disabled={actionLoading === 'cancel'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'cancel' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Cancel
              </button>
              <button
                onClick={() => setSelectedSubscriptions([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscriptions Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedSubscriptions.map((subscription, index) => {
              const planColor = {
                Free: 'border-gray-200 bg-gray-50',
                Silver: 'border-gray-300 bg-gray-100',
                Gold: 'border-amber-200 bg-amber-50',
                Platinum: 'border-purple-200 bg-purple-50'
              }[subscription.planName] || 'border-gray-200';

              const statusColor = {
                active: 'bg-emerald-100 text-emerald-700',
                expired: 'bg-amber-100 text-amber-700',
                cancelled: 'bg-red-100 text-red-700'
              }[subscription.status] || 'bg-gray-100 text-gray-700';

              const statusIcon = {
                active: <FiCheckCircle className="text-xs" />,
                expired: <FiClock className="text-xs" />,
                cancelled: <FiXCircle className="text-xs" />
              }[subscription.status] || <FiInfo className="text-xs" />;

              const isSelected = selectedSubscriptions.includes(subscription.id);

              return (
                <div
                  key={subscription.id}
                  className={`bg-white rounded-2xl border ${planColor} p-4 hover:shadow-lg hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectSubscription(subscription.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{subscription.ownerName}</h3>
                        <p className="text-xs text-[#5A7D78] truncate">{subscription.ownerEmail}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap ${statusColor}`}>
                      {statusIcon}
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${
                      subscription.planName === 'Free' ? 'from-gray-400 to-gray-500' :
                      subscription.planName === 'Silver' ? 'from-gray-500 to-gray-600' :
                      subscription.planName === 'Gold' ? 'from-amber-400 to-amber-600' :
                      'from-purple-400 to-purple-600'
                    }`}>
                      {subscription.planName}
                    </div>
                    <span className="text-sm font-bold text-[#1A2E2A]">${subscription.planPrice}</span>
                    <span className="text-xs text-[#5A7D78]">/mo</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{subscription.propertiesCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{subscription.autoRenew ? 'Yes' : 'No'}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Auto Renew</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">${subscription.totalSpent || 0}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Spent</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E8F0EE] text-xs text-[#5A7D78] space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Start: {new Date(subscription.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      <span>End: {new Date(subscription.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment: {subscription.paymentMethod}</span>
                      <span>Last: {new Date(subscription.lastPayment).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {subscription.status === 'active' && (
                    <button
                      onClick={() => handleCancelPlan(subscription.planName)}
                      disabled={actionLoading === `cancel_${subscription.planName}`}
                      className="mt-3 w-full py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02] disabled:opacity-50"
                    >
                      {actionLoading === `cancel_${subscription.planName}` ? (
                        <FiRefreshCw className="text-[10px] animate-spin" />
                      ) : (
                        <>
                          <FiXCircle className="text-[10px]" />
                          Cancel Plan
                        </>
                      )}
                    </button>
                  )}
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
                  checked={selectedSubscriptions.length === paginatedSubscriptions.length && paginatedSubscriptions.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>#</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('ownerName')}>
                Owner {sortField === 'ownerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Plan</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Properties</div>
              <div className="col-span-1">Start</div>
              <div className="col-span-1">End</div>
              <div className="col-span-1">Auto Renew</div>
              <div className="col-span-1">Payment</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedSubscriptions.map((subscription, index) => {
              const statusColor = {
                active: 'bg-emerald-100 text-emerald-700',
                expired: 'bg-amber-100 text-amber-700',
                cancelled: 'bg-red-100 text-red-700'
              }[subscription.status] || 'bg-gray-100 text-gray-700';

              const isSelected = selectedSubscriptions.includes(subscription.id);

              return (
                <div
                  key={subscription.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectSubscription(subscription.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <span className="text-xs text-[#5A7D78]">{index + 1}</span>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{subscription.ownerName}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{subscription.ownerEmail}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      subscription.planName === 'Free' ? 'bg-gray-100 text-gray-700' :
                      subscription.planName === 'Silver' ? 'bg-gray-200 text-gray-700' :
                      subscription.planName === 'Gold' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {subscription.planName}
                    </span>
                  </div>

                  <div className="col-span-1 text-sm font-semibold text-[#1A2E2A]">${subscription.planPrice}</div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1 text-center text-sm text-[#1A2E2A]">{subscription.propertiesCount}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(subscription.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(subscription.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1 text-center text-xs">
                    {subscription.autoRenew ? (
                      <FiCheckCircle className="text-[#00695C] inline" />
                    ) : (
                      <FiXCircle className="text-[#B5C9C5] inline" />
                    )}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{subscription.paymentMethod}</div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {subscription.status === 'active' && (
                      <button
                        onClick={() => handleCancelPlan(subscription.planName)}
                        disabled={actionLoading === `cancel_${subscription.planName}`}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50"
                        title="Cancel"
                      >
                        {actionLoading === `cancel_${subscription.planName}` ? (
                          <FiRefreshCw className="text-xs animate-spin" />
                        ) : (
                          <FiXCircle className="text-xs" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedSubscriptions.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiCreditCard className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No subscriptions found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No subscriptions match your current view'}
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
              {Math.min(currentPage * pageSize, filteredSubscriptions.length)} of{' '}
              {filteredSubscriptions.length} subscriptions
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
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default OwnersSubscription;