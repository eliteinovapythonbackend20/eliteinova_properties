// src/components/dashboard/admin/AdminOverview.jsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiHome, FiMessageCircle, FiDollarSign,
  FiUser, FiUserCheck, FiUserPlus, FiBriefcase,
  FiGrid, FiMapPin, FiShoppingBag, FiHome as FiHomeIcon,
  FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle,
  FiAlertCircle, FiEye, FiThumbsUp, FiActivity,
  FiRefreshCw, FiArrowRight, FiUserX, FiCalendar,
  FiChevronLeft, FiChevronRight, FiAward, FiBarChart2,
  FiX
} from 'react-icons/fi';
import {
  FaBuilding, FaUserTie, FaUserCog, FaChartLine,
  FaRegBuilding, FaRegCircle, FaCheck, FaTimes,
  FaArrowUp, FaArrowDown, FaUsers, FaShieldAlt,
  FaStar, FaRocket
} from 'react-icons/fa';
import { MdApartment, MdOutlineRealEstateAgent } from 'react-icons/md';
import { BsBuilding, BsPeople, BsGraphUp } from 'react-icons/bs';

const AdminOverview = () => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateFilter, setDateFilter] = useState('today');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [statsAnimating, setStatsAnimating] = useState(false);
  
  const [stats, setStats] = useState({
    totalVendors: 1247,
    totalUsers: 8452,
    totalProperties: 3689,
    totalLeads: 421,
    totalRevenue: 2847500,
    totalOwners: 523,
    totalAgents: 389,
    totalBuilders: 187,
    totalPropertyManagers: 148,
    totalIndividuals: 1245,
    totalApartments: 983,
    totalCommercial: 567,
    totalPlots: 456,
    totalHostel: 438,
    vendorPendingApprovals: 23,
    vendorActiveListings: 1847,
    revenueGrowth: 12.5,
    propertyGrowth: 8.3,
    userGrowth: 15.7,
    leadGrowth: -3.2,
  });

  // Close dropdown when clicking outside - optimized with useCallback
  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const getActivityDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Memoize recent activities to prevent recreation
  const recentActivities = useMemo(() => [
    {
      id: 1,
      user: 'Rajesh Kumar',
      action: 'registered as',
      target: 'Property Owner',
      time: '2 minutes ago',
      date: getActivityDate(0),
      type: 'user',
      status: 'success',
      icon: <FiUserPlus />,
      route: '/admin/owners/registration',
      avatar: 'RK'
    },
    {
      id: 2,
      user: 'Sunita Properties',
      action: 'listed new',
      target: 'Luxury Apartment',
      time: '15 minutes ago',
      date: getActivityDate(0),
      type: 'property',
      status: 'success',
      icon: <FiHomeIcon />,
      route: '/admin/properties/apartment',
      avatar: 'SP'
    },
    {
      id: 3,
      user: 'Amit Singh',
      action: 'submitted KYC for',
      target: 'Builder Verification',
      time: '32 minutes ago',
      date: getActivityDate(0),
      type: 'verification',
      status: 'pending',
      icon: <FiCheckCircle />,
      route: '/admin/builders/verification',
      avatar: 'AS'
    },
    {
      id: 4,
      user: 'Priya Sharma',
      action: 'made payment of',
      target: '₹45,000',
      time: '1 hour ago',
      date: getActivityDate(0),
      type: 'payment',
      status: 'success',
      icon: <FiDollarSign />,
      route: '/admin/payments',
      avatar: 'PS'
    },
    {
      id: 5,
      user: 'Green Valley Estate',
      action: 'updated',
      target: '5 property listings',
      time: '1.5 hours ago',
      date: getActivityDate(0),
      type: 'update',
      status: 'info',
      icon: <FiActivity />,
      route: '/admin/properties/overview',
      avatar: 'GV'
    },
    {
      id: 6,
      user: 'Vikram Patel',
      action: 'raised a',
      target: 'Maintenance Request',
      time: '2 hours ago',
      date: getActivityDate(0),
      type: 'maintenance',
      status: 'pending',
      icon: <FiAlertCircle />,
      route: '/admin/property-managers/maintenance',
      avatar: 'VP'
    },
    {
      id: 7,
      user: 'Dream Home Builders',
      action: 'completed',
      target: 'Project - Green Residency',
      time: '3 hours ago',
      date: getActivityDate(1),
      type: 'project',
      status: 'success',
      icon: <FaBuilding />,
      route: '/admin/builders/projects',
      avatar: 'DH'
    },
    {
      id: 8,
      user: 'Ananya Realty',
      action: 'received',
      target: '5 new leads',
      time: '4 hours ago',
      date: getActivityDate(1),
      type: 'lead',
      status: 'success',
      icon: <FiMessageCircle />,
      route: '/admin/leads',
      avatar: 'AR'
    },
    {
      id: 9,
      user: 'Suresh Reddy',
      action: 'subscribed to',
      target: 'Premium Plan',
      time: '5 hours ago',
      date: getActivityDate(2),
      type: 'subscription',
      status: 'success',
      icon: <FiThumbsUp />,
      route: '/admin/subscriptions',
      avatar: 'SR'
    },
    {
      id: 10,
      user: 'Luxury Homes Inc.',
      action: 'verified',
      target: '3 properties',
      time: '6 hours ago',
      date: getActivityDate(2),
      type: 'verification',
      status: 'success',
      icon: <FiCheckCircle />,
      route: '/admin/agents/verification',
      avatar: 'LH'
    },
    {
      id: 11,
      user: 'Ravi Shankar',
      action: 'registered as',
      target: 'Real Estate Agent',
      time: '1 day ago',
      date: getActivityDate(1),
      type: 'user',
      status: 'success',
      icon: <FiUserPlus />,
      route: '/admin/agents/verification',
      avatar: 'RS'
    },
    {
      id: 12,
      user: 'Pristine Properties',
      action: 'listed',
      target: '5 new properties',
      time: '2 days ago',
      date: getActivityDate(2),
      type: 'property',
      status: 'success',
      icon: <FiHomeIcon />,
      route: '/admin/properties/overview',
      avatar: 'PP'
    },
    {
      id: 13,
      user: 'Urban Developers',
      action: 'completed project',
      target: 'Skyline Tower',
      time: '3 days ago',
      date: getActivityDate(3),
      type: 'project',
      status: 'success',
      icon: <FaBuilding />,
      route: '/admin/builders/projects',
      avatar: 'UD'
    },
    {
      id: 14,
      user: 'Meera Reddy',
      action: 'made payment of',
      target: '₹25,000',
      time: '4 days ago',
      date: getActivityDate(4),
      type: 'payment',
      status: 'success',
      icon: <FiDollarSign />,
      route: '/admin/payments',
      avatar: 'MR'
    },
    {
      id: 15,
      user: 'Green Homes',
      action: 'submitted',
      target: 'KYC Documents',
      time: '5 days ago',
      date: getActivityDate(5),
      type: 'verification',
      status: 'pending',
      icon: <FiCheckCircle />,
      route: '/admin/builders/verification',
      avatar: 'GH'
    },
    {
      id: 16,
      user: 'Luxury Living',
      action: 'listed',
      target: 'Premium Villa',
      time: '6 days ago',
      date: getActivityDate(6),
      type: 'property',
      status: 'success',
      icon: <FiHomeIcon />,
      route: '/admin/properties/individual',
      avatar: 'LL'
    },
    {
      id: 17,
      user: 'Tech Hub Properties',
      action: 'leased',
      target: 'Commercial Space',
      time: '1 week ago',
      date: getActivityDate(7),
      type: 'property',
      status: 'success',
      icon: <FiShoppingBag />,
      route: '/admin/properties/commercial',
      avatar: 'TH'
    },
    {
      id: 18,
      user: 'Sunrise Estates',
      action: 'updated',
      target: 'Property Listings',
      time: '2 weeks ago',
      date: getActivityDate(14),
      type: 'update',
      status: 'info',
      icon: <FiActivity />,
      route: '/admin/properties/overview',
      avatar: 'SE'
    }
  ], []);

  // Memoize generateMockActivities
  const generateMockActivities = useCallback(() => {
    const activities = [...recentActivities];
    const types = ['user', 'property', 'payment', 'verification', 'lead', 'project'];
    const users = ['Deepak Verma', 'Neha Gupta', 'Ravi Shankar', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy'];
    const actions = ['registered as', 'listed', 'updated', 'verified', 'made payment of', 'submitted', 'completed'];
    const targets = ['Property Owner', 'Real Estate Agent', 'Builder', 'Property Listing', 'KYC Documents', 'Project', 'Payment'];

    for (let i = 1; i <= 30; i++) {
      const numActivities = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numActivities; j++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const userInitials = users[Math.floor(Math.random() * users.length)].split(' ').map(n => n[0]).join('');
        activities.push({
          id: activities.length + 1,
          user: users[Math.floor(Math.random() * users.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
          target: targets[Math.floor(Math.random() * targets.length)],
          time: `${i} days ago`,
          date: getActivityDate(i),
          type: type,
          status: Math.random() > 0.7 ? 'pending' : 'success',
          icon: type === 'user' ? <FiUserPlus /> :
                type === 'property' ? <FiHomeIcon /> :
                type === 'payment' ? <FiDollarSign /> :
                type === 'verification' ? <FiCheckCircle /> :
                type === 'lead' ? <FiMessageCircle /> :
                <FiActivity />,
          route: '/admin/properties/overview',
          avatar: userInitials
        });
      }
    }

    return activities;
  }, [recentActivities]);

  // Memoize filterActivitiesByDate
  const filterActivitiesByDate = useCallback((activities, filter, selectedDate = null) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    let filtered = [];

    switch(filter) {
      case 'today':
        filtered = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate.getDate() === today.getDate() &&
                 activityDate.getMonth() === today.getMonth() &&
                 activityDate.getFullYear() === today.getFullYear();
        });
        break;
      case 'yesterday':
        filtered = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate.getDate() === yesterday.getDate() &&
                 activityDate.getMonth() === yesterday.getMonth() &&
                 activityDate.getFullYear() === yesterday.getFullYear();
        });
        break;
      case 'week':
        filtered = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate >= startOfWeek && activityDate <= today;
        });
        break;
      case 'month':
        filtered = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate >= startOfMonth && activityDate <= today;
        });
        break;
      case 'year':
        filtered = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return activityDate >= startOfYear && activityDate <= today;
        });
        break;
      case 'custom':
        if (selectedDate) {
          const customDate = new Date(selectedDate);
          filtered = activities.filter(activity => {
            const activityDate = new Date(activity.date);
            return activityDate.getDate() === customDate.getDate() &&
                   activityDate.getMonth() === customDate.getMonth() &&
                   activityDate.getFullYear() === customDate.getFullYear();
          });
        } else {
          filtered = activities;
        }
        break;
      default:
        filtered = activities;
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Initialize data
  useEffect(() => {
    const allActivities = generateMockActivities();
    setActivities(allActivities);
    const filtered = filterActivitiesByDate(allActivities, dateFilter, selectedDate);
    setFilteredActivities(filtered);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockActivities, filterActivitiesByDate, dateFilter, selectedDate]);

  // Memoize filtered activities update
  useEffect(() => {
    const filtered = filterActivitiesByDate(activities, dateFilter, selectedDate);
    setFilteredActivities(filtered);
  }, [dateFilter, selectedDate, activities, filterActivitiesByDate]);

  // Live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        user: ['Deepak Verma', 'Neha Gupta', 'Ravi Shankar'][Math.floor(Math.random() * 3)],
        action: ['posted a new', 'updated', 'verified'][Math.floor(Math.random() * 3)],
        target: ['Property Listing', 'Vendor Profile', 'Payment'][Math.floor(Math.random() * 3)],
        time: 'Just now',
        date: new Date(),
        type: ['property', 'user', 'payment'][Math.floor(Math.random() * 3)],
        status: 'success',
        icon: <FiActivity />,
        route: '/admin/properties/overview',
        avatar: ['DV', 'NG', 'RS'][Math.floor(Math.random() * 3)]
      };
      
      setActivities(prev => [newActivity, ...prev]);
      
      // Only update filtered if it matches current filter
      if (dateFilter === 'today' || dateFilter === 'custom') {
        setFilteredActivities(prev => [newActivity, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dateFilter]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setStatsAnimating(true);
    setTimeout(() => {
      setLoading(false);
      setStatsAnimating(false);
      setStats(prev => ({
        ...prev,
        totalVendors: prev.totalVendors + Math.floor(Math.random() * 10),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 50),
        totalProperties: prev.totalProperties + Math.floor(Math.random() * 20),
        totalLeads: prev.totalLeads + Math.floor(Math.random() * 5),
        vendorPendingApprovals: Math.floor(Math.random() * 30) + 5,
        vendorActiveListings: prev.vendorActiveListings + Math.floor(Math.random() * 15),
      }));
      
      const allActivities = generateMockActivities();
      setActivities(allActivities);
      const filtered = filterActivitiesByDate(allActivities, dateFilter, selectedDate);
      setFilteredActivities(filtered);
    }, 1500);
  }, [dateFilter, selectedDate, generateMockActivities, filterActivitiesByDate]);

  const navigateTo = useCallback((route) => {
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleViewAllActivities = useCallback(() => {
    navigate('/admin/notifications');
  }, [navigate]);

  const handleViewAllPending = useCallback(() => {
    navigate('/admin/user-management');
  }, [navigate]);

  const handleViewAllListings = useCallback(() => {
    navigate('/admin/properties/overview');
  }, [navigate]);

  const handleStatClick = useCallback((type) => {
    const routes = {
      'Total Vendors': '/admin/user-management',
      'Total Users': '/admin/user-management',
      'Total Properties': '/admin/properties/overview',
      'Total Leads': '/admin/leads',
      'Total Revenue': '/admin/payments',
      'Owners': '/admin/owners/overview',
      'Agents': '/admin/agents/overview',
      'Builders': '/admin/builders/overview',
      'Property Managers': '/admin/property-managers/overview',
      'Individuals': '/admin/properties/individual',
      'Apartments': '/admin/properties/apartment',
      'Commercial': '/admin/properties/commercial',
      'Plots & Land': '/admin/properties/land-plots',
      'Hostel & PG': '/admin/properties/hostel-pg'
    };
    
    if (routes[type]) {
      navigate(routes[type]);
    }
  }, [navigate]);

  const getDaysInMonth = useCallback((month, year) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((month, year) => {
    return new Date(year, month, 1).getDay();
  }, []);

  const handleDateSelect = useCallback((day) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    setDateFilter('custom');
    setShowCalendar(false);
  }, [currentMonth, currentYear]);

  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }, [currentMonth, currentYear]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }, [currentMonth, currentYear]);

  const handleFilterChange = useCallback((filter) => {
    setDateFilter(filter);
    if (filter !== 'custom') {
      setSelectedDate(null);
      setShowCalendar(false);
    }
  }, []);

  const toggleCustomDropdown = useCallback(() => {
    setShowCalendar(prev => !prev);
  }, []);

  const getFilterLabel = useCallback(() => {
    switch(dateFilter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'custom': return selectedDate ? formatDate(selectedDate) : 'Custom';
      default: return 'All';
    }
  }, [dateFilter, selectedDate, formatDate]);

  // Stat Card Component - memoized to prevent re-renders
  const StatCard = useCallback(({ icon, title, value, trend, trendValue, subtitle, color, clickable = true, delay = 0 }) => (
    <div 
      className={`bg-white rounded-2xl p-2 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group hover:border-[#00695C]/30 cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => clickable && handleStatClick(title)}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
            {title}
            {trend !== undefined && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {trend > 0 ? <FaArrowUp className="text-[8px]" /> : trend < 0 ? <FaArrowDown className="text-[8px]" /> : null}
                {Math.abs(trend)}%
              </span>
            )}
          </p>
          <h3 className={`text-2xl font-bold text-gray-800 mt-1 transition-all duration-300 ${hoveredCard === title ? 'scale-105 text-[#00695C]' : ''}`}>
            {value.toLocaleString()}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`
          w-12 h-12 rounded-2xl flex items-center justify-center
          ${color} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
          shadow-lg
        `}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400">vs last month</span>
        </div>
        <FiArrowRight className={`text-[#00695C] text-sm transition-all duration-300 ${hoveredCard === title ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  ), [statsAnimating, hoveredCard, handleStatClick]);

  // Activity Item Component - memoized
  const ActivityItem = useCallback(({ activity, index }) => {
    const statusColors = {
      success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      pending: 'bg-amber-50 text-amber-600 border-amber-200',
      error: 'bg-red-50 text-red-600 border-red-200',
      info: 'bg-blue-50 text-blue-600 border-blue-200'
    };

    const statusBadgeColors = {
      success: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700'
    };

    return (
      <div 
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 border border-transparent hover:border-gray-200/80 group cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => navigateTo(activity.route)}
      >
        <div className="relative flex-shrink-0">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${statusColors[activity.status] || 'bg-gray-100 text-gray-600'}
            border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md
          `}>
            {activity.icon}
          </div>
          {activity.status === 'pending' && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{activity.user}</span>
            <span className="text-xs text-gray-500">{activity.action}</span>
            <span className="text-sm font-medium text-[#00695C]">{activity.target}</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <FiClock className="text-[10px] text-gray-400" />
            <span className="text-[10px] text-gray-400">{activity.time}</span>
            <span className="text-[10px] text-gray-300">•</span>
            <span className="text-[10px] text-gray-400">{formatDate(activity.date)}</span>
            {activity.status === 'pending' && (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${statusBadgeColors[activity.status]}`}>
                Pending Review
              </span>
            )}
            {activity.status === 'success' && (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-600">
                Completed
              </span>
            )}
          </div>
        </div>
        <button 
          className="text-gray-300 hover:text-[#00695C] transition-all duration-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo(activity.route);
          }}
        >
          <FiArrowRight className="text-sm" />
        </button>
      </div>
    );
  }, [navigateTo, formatDate]);

  // Custom Date Dropdown Component - with fixed sizing
  const CustomDateDropdown = useCallback(() => {
    if (!showCalendar) return null;

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    // Check if a date has activities
    const hasActivitiesOnDate = useCallback((day) => {
      return activities.some(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getDate() === day &&
               activityDate.getMonth() === currentMonth &&
               activityDate.getFullYear() === currentYear;
      });
    }, [activities, currentMonth, currentYear]);

    return (
      <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 w-[280px] animate-fade-in">
        {/* Quick Filters */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-thin flex-wrap">
          {['Today', 'Yesterday', 'Week', 'Month', 'Year'].map((label) => {
            const filterValue = label.toLowerCase();
            return (
              <button
                key={label}
                onClick={() => {
                  setDateFilter(filterValue);
                  setSelectedDate(null);
                  setShowCalendar(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-medium whitespace-nowrap transition-all duration-300 ${
                  dateFilter === filterValue && !selectedDate
                    ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
          >
            <FiChevronLeft className="text-gray-600 text-xs" />
          </button>
          <span className="font-semibold text-gray-700 text-xs">
            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'short' })} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
          >
            <FiChevronRight className="text-gray-600 text-xs" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 mb-1.5">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-[8px] font-medium text-gray-400 py-0.5">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentMonth && 
                           new Date().getFullYear() === currentYear;
            const isSelected = selectedDate && 
                              selectedDate.getDate() === day &&
                              selectedDate.getMonth() === currentMonth &&
                              selectedDate.getFullYear() === currentYear;
            
            const hasActivities = hasActivitiesOnDate(day);

            return (
              <button
                key={day}
                onClick={() => hasActivities && handleDateSelect(day)}
                className={`
                  h-7 w-7 rounded-lg text-[10px] font-medium transition-all duration-300 relative mx-auto
                  ${isSelected ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30 transform scale-110' : ''}
                  ${isToday && !isSelected ? 'border-2 border-[#00695C] text-[#00695C]' : ''}
                  ${!isSelected && !isToday && hasActivities ? 'hover:bg-gray-100 hover:scale-110' : ''}
                  ${!isSelected && !isToday && !hasActivities ? 'text-gray-300 cursor-not-allowed' : ''}
                `}
                disabled={!hasActivities}
              >
                {day}
                {hasActivities && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-[#00695C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Info */}
        {selectedDate && dateFilter === 'custom' && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[9px] text-gray-500">
              Selected: <span className="font-medium text-gray-700">{formatDate(selectedDate)}</span>
            </span>
            <span className="text-[9px] font-medium text-[#00695C]">
              {filteredActivities.length} activities
            </span>
          </div>
        )}

        <button
          onClick={() => {
            setSelectedDate(null);
            setDateFilter('today');
            setShowCalendar(false);
          }}
          className="mt-2 w-full text-[9px] text-gray-500 hover:text-[#00695C] transition-colors font-medium"
        >
          Clear Selection
        </button>
      </div>
    );
  }, [
    showCalendar, 
    currentMonth, 
    currentYear, 
    dateFilter, 
    selectedDate, 
    activities, 
    filteredActivities, 
    getDaysInMonth, 
    getFirstDayOfMonth, 
    handlePrevMonth, 
    handleNextMonth, 
    handleDateSelect, 
    formatDate,
    setDateFilter,
    setSelectedDate,
    setShowCalendar
  ]);

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-gradient-to-br from-gray-50/50 to-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>Welcome back! Here's what's happening with your platform today.</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
              <FiClock className="text-[#00695C]" />
              <span>Last updated: {new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 relative">
        <StatCard
          icon={<BsPeople className="text-lg text-white" />}
          title="Total Vendors"
          value={stats.totalVendors}
          trend={5.2}
          trendValue={5.2}
          color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
          delay={0}
        />
        <StatCard
          icon={<FiUsers className="text-lg text-white" />}
          title="Total Users"
          value={stats.totalUsers}
          trend={15.7}
          trendValue={15.7}
          color="bg-gradient-to-br from-blue-600 to-blue-400"
          delay={100}
        />
        <StatCard
          icon={<FiHome className="text-lg text-white" />}
          title="Total Properties"
          value={stats.totalProperties}
          trend={8.3}
          trendValue={8.3}
          color="bg-gradient-to-br from-purple-600 to-purple-400"
          delay={200}
        />
        <StatCard
          icon={<FiMessageCircle className="text-lg text-white" />}
          title="Total Leads"
          value={stats.totalLeads}
          trend={-3.2}
          trendValue={3.2}
          color="bg-gradient-to-br from-amber-600 to-amber-400"
          delay={300}
        />
        <StatCard
          icon={<FiDollarSign className="text-lg text-white" />}
          title="Total Revenue"
          value={stats.totalRevenue}
          trend={12.5}
          trendValue={12.5}
          color="bg-gradient-to-br from-emerald-600 to-emerald-400"
          delay={400}
        />
      </div>

      {/* Vendor Breakdown */}
      <div className="relative">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
            <FiUser className="text-[#00695C]" />
          </div>
          Vendor Breakdown
          <span className="text-xs text-gray-400 font-normal ml-2">• Click to view details</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[

            { key: 'Owners', count: stats.totalOwners, icon: <FiUser className="text-[#00695C] text-lg" />, color: 'from-[#00695C]/10 to-[#26A69A]/10', border: 'border-[#00695C]/10', textColor: 'text-[#00695C]' },
            { key: 'Agents', count: stats.totalAgents, icon: <MdOutlineRealEstateAgent className="text-blue-600 text-lg" />, color: 'from-blue-600/10 to-blue-400/10', border: 'border-blue-600/10', textColor: 'text-blue-600' },
            { key: 'Builders', count: stats.totalBuilders, icon: <FaBuilding className="text-purple-600 text-lg" />, color: 'from-purple-600/10 to-purple-400/10', border: 'border-purple-600/10', textColor: 'text-purple-600' },
            { key: 'Property Managers', count: stats.totalPropertyManagers, icon: <FaUserCog className="text-amber-600 text-lg" />, color: 'from-amber-600/10 to-amber-400/10', border: 'border-amber-600/10', textColor: 'text-amber-600' }
          ].map((item, index) => (
            <div 
              key={item.key}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 border ${item.border} cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] animate-slide-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleStatClick(item.key)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm ${item.textColor}`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-semibold ${item.textColor} bg-white/80 px-2 py-1 rounded-lg`}>
                  {item.key}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{item.count}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {Math.round((item.count / stats.totalVendors) * 100)}% of vendors
                </p>
                <div className="flex-1 mx-2 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.textColor.replace('text', 'bg')}`}
                    style={{ width: `${(item.count / stats.totalVendors) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property Types */}
      <div className="relative">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
            <FiHome className="text-[#00695C]" />
          </div>
          Property Types Distribution
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { key: 'Individuals', count: stats.totalIndividuals, icon: <FaRegBuilding className="text-sm" />, color: 'from-indigo-100 to-indigo-50', iconColor: 'text-indigo-600' },
            { key: 'Apartments', count: stats.totalApartments, icon: <MdApartment className="text-sm" />, color: 'from-blue-100 to-blue-50', iconColor: 'text-blue-600' },
            { key: 'Commercial', count: stats.totalCommercial, icon: <FiShoppingBag className="text-sm" />, color: 'from-emerald-100 to-emerald-50', iconColor: 'text-emerald-600' },
            { key: 'Plots & Land', count: stats.totalPlots, icon: <FiMapPin className="text-sm" />, color: 'from-amber-100 to-amber-50', iconColor: 'text-amber-600' },
            { key: 'Hostel & PG', count: stats.totalHostel, icon: <FiHomeIcon className="text-sm" />, color: 'from-rose-100 to-rose-50', iconColor: 'text-rose-600' }
          ].map((item, index) => (
            <div 
              key={item.key}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 border border-gray-100/80 cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] animate-slide-in group`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleStatClick(item.key)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white/80 ${item.iconColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{item.key}</p>
                  <p className="text-lg font-bold text-gray-800">{item.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Status & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vendor Status Cards */}
        <div className="lg:col-span-1 space-y-4">
          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden animate-slide-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiClock className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Pending Approvals</p>
                    <p className="text-[10px] text-gray-400">Requires immediate attention</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-amber-600 group-hover:scale-110 transition-transform duration-300">
                  {stats.vendorPendingApprovals}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.vendorPendingApprovals / 50) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
                  {Math.round((stats.vendorPendingApprovals / 50) * 100)}%
                </span>
              </div>
              <button 
                onClick={handleViewAllPending}
                className="mt-4 w-full text-xs font-semibold text-[#00695C] hover:text-[#004D40] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                <span className="w-5 h-5 rounded-full bg-[#00695C]/10 flex items-center justify-center group-hover/btn:bg-[#00695C]/20 transition-colors">
                  <FiEye className="text-[10px]" />
                </span>
                View All Pending
                <FiArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden animate-slide-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiCheckCircle className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Active Listings</p>
                    <p className="text-[10px] text-gray-400">Live properties on platform</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  {stats.vendorActiveListings}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.vendorActiveListings / 2500) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap font-medium">
                  {Math.round((stats.vendorActiveListings / stats.totalProperties) * 100)}% of total
                </span>
              </div>
              <button 
                onClick={handleViewAllListings}
                className="mt-4 w-full text-xs font-semibold text-[#00695C] hover:text-[#004D40] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                <span className="w-5 h-5 rounded-full bg-[#00695C]/10 flex items-center justify-center group-hover/btn:bg-[#00695C]/20 transition-colors">
                  <FiEye className="text-[10px]" />
                </span>
                View All Listings
                <FiArrowRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-slide-in">
            <div className="px-6 py-5 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00695C]/10 rounded-xl">
                    <FiActivity className="text-[#00695C] text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Recent Activities</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        {filteredActivities.length} activities
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Live
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleViewAllActivities}
                  className="text-xs text-[#00695C] hover:text-[#004D40] font-semibold flex items-center gap-1 group transition-colors"
                >
                  View All
                  <FiArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {['today', 'yesterday', 'week', 'month', 'year'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                        dateFilter === filter
                          ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30 transform scale-105'
                          : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="relative flex-shrink-0" ref={dropdownRef}>
                  <button
                    onClick={toggleCustomDropdown}
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                      dateFilter === 'custom'
                        ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30 transform scale-105'
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:scale-105'
                    }`}
                  >
                    <FiCalendar className="text-[10px]" />
                    {dateFilter === 'custom' && selectedDate ? formatDate(selectedDate) : 'Custom'}
                  </button>
                  <CustomDateDropdown />
                </div>
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto activity-scroll">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <ActivityItem key={activity.id} activity={activity} index={index} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 animate-float">
                    <FiCalendar className="text-3xl text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">No activities found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {dateFilter === 'custom' && selectedDate 
                      ? `No activities on ${formatDate(selectedDate)}` 
                      : `No activities for ${getFilterLabel().toLowerCase()}`}
                  </p>
                  <button 
                    onClick={() => handleFilterChange('today')}
                    className="mt-4 text-sm text-[#00695C] font-medium hover:text-[#004D40] transition-colors"
                  >
                    View today's activities →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar and Animations */}
      <style>{`
        /* Scrollbar Styles */
        .activity-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .activity-scroll::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 20px;
        }
        .activity-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 20px;
          transition: background 0.3s;
        }
        .activity-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .activity-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f8fafc;
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 20px;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.1s ease-in forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite;
        }
        
        .animate-pulse-once {
          animation: pulseOnce 1s ease-out;
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminOverview;