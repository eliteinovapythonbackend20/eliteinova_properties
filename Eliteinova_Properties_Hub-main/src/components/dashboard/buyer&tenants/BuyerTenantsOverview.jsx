// src/components/dashboard/buyer&tenants/BuyerTenantsOverview.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiUsers, FiUser, FiHome, FiHeart, FiMapPin, FiCalendar, 
  FiClock, FiTrendingUp, FiArrowUp, FiArrowDown, FiCheckCircle,
  FiXCircle, FiEye, FiMessageCircle, FiStar, 
  FiRefreshCw, FiDownload, FiFilter, FiSearch,
  FiMoreVertical, FiEdit, FiTrash2, FiMail, FiPhone,
  FiClock as FiClockIcon, FiDollarSign, FiMap, FiBookmark,
  FiGrid, FiBell, FiPlus, FiUserPlus, FiChevronRight,
  FiInfo, FiAlertCircle, FiFile, FiSettings
} from 'react-icons/fi';
import { 
  FaUsers, FaUserCheck, FaUserTimes, FaBuilding,
  FaChartLine, FaWallet, FaUserCircle, FaCalendarCheck,
  FaClipboardList, FaHandshake, FaPhoneAlt, FaEnvelope,
  FaWhatsapp, FaFacebook, FaTwitter, FaInstagram,
  FaLinkedin, FaYoutube
} from 'react-icons/fa';
import { MdOutlinePeople, MdOutlineDashboard } from 'react-icons/md';
import { BsPeople, BsBuilding } from 'react-icons/bs';

// Export utility functions
const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportToJSON = (data, filename = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const BuyerTenantsOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Theme colors
  const themeColors = {
    primary: '#00695C',
    primaryLight: '#26A69A',
    primaryDark: '#004D40',
    secondary: '#00897B',
    accent: '#4DB6AC',
    gradient: 'from-[#00695C] to-[#26A69A]',
    gradientDark: 'from-[#004D40] to-[#00897B]',
    lightBg: 'bg-teal-50',
    lightBorder: 'border-teal-200',
    textPrimary: 'text-[#00695C]',
    textLight: 'text-[#26A69A]',
    hoverBg: 'hover:bg-teal-50',
    shadow: 'shadow-[#00695C]/20',
  };

  // ============ NAVIGATION HANDLERS ============
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleQuickAction = (path, actionName) => {
    showToast(`Navigating to ${actionName}...`, 'info');
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  // ============ TOAST NOTIFICATION ============
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // ============ PERIOD HANDLER ============
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setShowCustomDatePicker(false);
      setStartDate('');
      setEndDate('');
      // Correct notification based on period selected
      const periodLabel = getPeriodLabel(period);
      showToast(`📊 Showing data for ${periodLabel}`, 'info');
      // Refresh data with new period
      refreshDataForPeriod(period);
    } else {
      setShowCustomDatePicker(true);
    }
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-year': 'This Year',
      'custom': 'Custom Range'
    };
    return labels[period] || period;
  };

  // Refresh data for specific period without showing "Data refreshed" message
  const refreshDataForPeriod = (period) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // No toast message here - handled by handlePeriodChange
    }, 500);
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      setShowCustomDatePicker(false);
      const start = new Date(startDate);
      const end = new Date(endDate);
      showToast(`📅 Showing data from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, 'info');
      // Refresh data with custom range
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      showToast('⚠️ Please select both start and end dates', 'error');
    }
  };

  // ============ STATISTICS DATA ============
  const statsData = [
    {
      id: 1,
      title: 'Total Buyers',
      value: '1,284',
      change: '+12.5%',
      trend: 'up',
      icon: <FaUserCircle className="text-[#00695C]" />,
      color: 'from-[#E0F2F1] to-[#B2DFDB]',
      borderColor: 'border-[#00695C]',
      accentColor: '#00695C',
      path: '/admin/buyers-tenants/buyer/overview',
      notification: 'Navigating to Total Buyers overview...'
    },
    {
      id: 2,
      title: 'Total Tenants',
      value: '856',
      change: '+8.2%',
      trend: 'up',
      icon: <BsPeople className="text-[#26A69A]" />,
      color: 'from-[#E8F5E9] to-[#C8E6C9]',
      borderColor: 'border-[#26A69A]',
      accentColor: '#26A69A',
      path: '/admin/buyers-tenants/tenant/overview',
      notification: 'Navigating to Total Tenants overview...'
    },
    {
      id: 3,
      title: 'Total Leads',
      value: '2,156',
      change: '+18.7%',
      trend: 'up',
      icon: <MdOutlinePeople className="text-[#9C27B0]" />,
      color: 'from-[#F3E5F5] to-[#E1BEE7]',
      borderColor: 'border-[#9C27B0]',
      accentColor: '#9C27B0',
      path: '/admin/buyers-tenants/lead/overview',
      notification: 'Navigating to Total Leads overview...'
    },
    {
      id: 4,
      title: 'New Registrations',
      value: '47',
      change: '-3.1%',
      trend: 'down',
      icon: <FiUserPlus className="text-[#FF6B6B]" />,
      color: 'from-[#FFEBEE] to-[#FFCDD2]',
      borderColor: 'border-[#FF6B6B]',
      accentColor: '#FF6B6B',
      path: '/admin/buyers-tenants/buyer/registration',
      notification: 'Navigating to New Registrations...'
    },
    {
      id: 5,
      title: 'Wishlist Properties',
      value: '3,429',
      change: '+24.7%',
      trend: 'up',
      icon: <FiHeart className="text-[#E91E63]" />,
      color: 'from-[#FCE4EC] to-[#F8BBD0]',
      borderColor: 'border-[#E91E63]',
      accentColor: '#E91E63',
      path: '/admin/buyers-tenants/saved/wishlist',
      notification: 'Navigating to Wishlist Properties...'
    },
    {
      id: 6,
      title: 'Site Visits',
      value: '892',
      change: '+18.9%',
      trend: 'up',
      icon: <FiMapPin className="text-[#FF9800]" />,
      color: 'from-[#FFF3E0] to-[#FFE0B2]',
      borderColor: 'border-[#FF9800]',
      accentColor: '#FF9800',
      path: '/admin/buyers-tenants/site-visits/dashboard',
      notification: 'Navigating to Site Visits dashboard...'
    },
    {
      id: 7,
      title: 'Purchase Requests',
      value: '156',
      change: '+22.3%',
      trend: 'up',
      icon: <FaHandshake className="text-[#4CAF50]" />,
      color: 'from-[#E8F5E9] to-[#C8E6C9]',
      borderColor: 'border-[#4CAF50]',
      accentColor: '#4CAF50',
      path: '/admin/buyers-tenants/purchase/overview',
      notification: 'Navigating to Purchase Requests...'
    },
    {
      id: 8,
      title: 'Rental Requests',
      value: '234',
      change: '+14.8%',
      trend: 'up',
      icon: <FaClipboardList className="text-[#2196F3]" />,
      color: 'from-[#E3F2FD] to-[#BBDEFB]',
      borderColor: 'border-[#2196F3]',
      accentColor: '#2196F3',
      path: '/admin/buyers-tenants/rental/overview',
      notification: 'Navigating to Rental Requests...'
    }
  ];

  // ============ RECENT ACTIVITY DATA ============
  const recentActivities = [
    {
      id: 1,
      user: 'Rahul Sharma',
      type: 'buyer',
      action: 'Saved Property',
      property: 'Luxury Villa in Whitefield',
      time: '2 minutes ago',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=00695C&color=fff&size=32',
      path: '/admin/buyers-tenants/buyer/profile',
      notification: 'Viewing Rahul Sharma\'s profile...'
    },
    {
      id: 2,
      user: 'Priya Patel',
      type: 'tenant',
      action: 'Rental Request',
      property: '3BHK Apartment in Indiranagar',
      time: '15 minutes ago',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=26A69A&color=fff&size=32',
      path: '/admin/buyers-tenants/tenant/profile',
      notification: 'Viewing Priya Patel\'s profile...'
    },
    {
      id: 3,
      user: 'Amit Kumar',
      type: 'buyer',
      action: 'Site Visit Scheduled',
      property: 'Penthouse in Koramangala',
      time: '45 minutes ago',
      avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=00897B&color=fff&size=32',
      path: '/admin/buyers-tenants/site-visits/details',
      notification: 'Viewing Site Visit details...'
    },
    {
      id: 4,
      user: 'Sneha Reddy',
      type: 'tenant',
      action: 'Wishlist Added',
      property: '2BHK in Electronic City',
      time: '1 hour ago',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=E91E63&color=fff&size=32',
      path: '/admin/buyers-tenants/saved/wishlist',
      notification: 'Viewing Wishlist...'
    },
    {
      id: 5,
      user: 'Vikram Singh',
      type: 'buyer',
      action: 'Purchase Request',
      property: '4BHK Villa in Sarjapur',
      time: '2 hours ago',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=4CAF50&color=fff&size=32',
      path: '/admin/buyers-tenants/purchase/details',
      notification: 'Viewing Purchase Request details...'
    }
  ];

  // ============ TOP PERFORMERS DATA ============
  const topPerformers = [
    {
      id: 1,
      name: 'Sanjay Mehta',
      role: 'Real Estate Agent',
      totalDeals: 28,
      revenue: '₹2.4 Cr',
      rating: 4.9,
      avatar: 'https://ui-avatars.com/api/?name=Sanjay+Mehta&background=00695C&color=fff&size=40',
      path: '/profile/agent',
      notification: 'Viewing Sanjay Mehta\'s profile...'
    },
    {
      id: 2,
      name: 'Ananya Iyer',
      role: 'Property Manager',
      totalDeals: 22,
      revenue: '₹1.8 Cr',
      rating: 4.8,
      avatar: 'https://ui-avatars.com/api/?name=Ananya+Iyer&background=26A69A&color=fff&size=40',
      path: '/profile/property-management',
      notification: 'Viewing Ananya Iyer\'s profile...'
    },
    {
      id: 3,
      name: 'Ravi Desai',
      role: 'Real Estate Agent',
      totalDeals: 19,
      revenue: '₹1.5 Cr',
      rating: 4.7,
      avatar: 'https://ui-avatars.com/api/?name=Ravi+Desai&background=00897B&color=fff&size=40',
      path: '/profile/agent',
      notification: 'Viewing Ravi Desai\'s profile...'
    },
    {
      id: 4,
      name: 'Neha Gupta',
      role: 'Property Manager',
      totalDeals: 16,
      revenue: '₹1.2 Cr',
      rating: 4.6,
      avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=FF9800&color=fff&size=40',
      path: '/profile/property-management',
      notification: 'Viewing Neha Gupta\'s profile...'
    }
  ];

  // ============ CHART DATA ============
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const buyersData = [45, 52, 38, 65, 58, 72, 68, 84, 79, 92, 88, 98];
  const tenantsData = [28, 35, 42, 38, 45, 52, 48, 56, 62, 58, 68, 72];

  const maxValue = Math.max(...buyersData, ...tenantsData);
  const chartHeight = 100;

  const getBarHeight = (value) => {
    return (value / maxValue) * chartHeight;
  };

  

  // ============ LEAD STATUS DATA ============
  const leadStatusData = [
    { label: 'New Leads', value: 45, color: 'bg-blue-500', lightBg: 'bg-blue-100', lightText: 'text-blue-700', path: '/admin/buyers-tenants/lead/status', notification: '📊 Viewing New Leads status...' },
    { label: 'In Progress', value: 82, color: 'bg-yellow-500', lightBg: 'bg-yellow-100', lightText: 'text-yellow-700', path: '/admin/buyers-tenants/lead/dashboard', notification: '🔄 Viewing In Progress leads...' },
    { label: 'Site Visits', value: 38, color: 'bg-purple-500', lightBg: 'bg-purple-100', lightText: 'text-purple-700', path: '/admin/buyers-tenants/site-visits/dashboard', notification: '📍 Viewing Site Visits status...' },
    { label: 'Negotiation', value: 27, color: 'bg-orange-500', lightBg: 'bg-orange-100', lightText: 'text-orange-700', path: '/admin/buyers-tenants/lead/dashboard', notification: '🤝 Viewing Negotiation status...' },
    { label: 'Closed Won', value: 64, color: 'bg-green-500', lightBg: 'bg-green-100', lightText: 'text-green-700', path: '/admin/buyers-tenants/lead/status', notification: '✅ Viewing Closed Won leads...' },
    { label: 'Closed Lost', value: 23, color: 'bg-red-500', lightBg: 'bg-red-100', lightText: 'text-red-700', path: '/admin/buyers-tenants/lead/status', notification: '❌ Viewing Closed Lost leads...' }
  ];

  const maxLeadValue = Math.max(...leadStatusData.map(item => item.value));

  // ============ EXPORT HANDLER ============
  const handleExport = (format = 'csv') => {
    setExportLoading(true);
    showToast('📤 Preparing export data...', 'info');

    setTimeout(() => {
      try {
        const exportData = {
          summary: {
            'Total Buyers': '1,284',
            'Total Tenants': '856',
            'Total Leads': '2,156',
            'New Registrations': '47',
            'Wishlist Properties': '3,429',
            'Site Visits': '892',
            'Purchase Requests': '156',
            'Rental Requests': '234'
          },
          recentActivity: recentActivities.map(activity => ({
            'User': activity.user,
            'Type': activity.type,
            'Action': activity.action,
            'Property': activity.property,
            'Time': activity.time
          })),
          topPerformers: topPerformers.map(performer => ({
            'Name': performer.name,
            'Role': performer.role,
            'Deals': performer.totalDeals,
            'Revenue': performer.revenue,
            'Rating': performer.rating
          })),
          leadStatus: leadStatusData.map(lead => ({
            'Status': lead.label,
            'Count': lead.value
          })),
          monthlyData: months.map((month, index) => ({
            'Month': month,
            'Buyers': buyersData[index],
            'Tenants': tenantsData[index]
          }))
        };

        const filename = `buyer-tenant-overview-${new Date().toISOString().split('T')[0]}`;

        if (format === 'json') {
          exportToJSON(exportData, `${filename}.json`);
        } else {
          const flatData = [
            ...exportData.monthlyData,
            { 'Month': '--- Summary ---', 'Buyers': '', 'Tenants': '' },
            { 'Month': 'Total Buyers', 'Buyers': exportData.summary['Total Buyers'], 'Tenants': '' },
            { 'Month': 'Total Tenants', 'Buyers': exportData.summary['Total Tenants'], 'Tenants': '' },
            { 'Month': 'Total Leads', 'Buyers': exportData.summary['Total Leads'], 'Tenants': '' },
            { 'Month': 'New Registrations', 'Buyers': exportData.summary['New Registrations'], 'Tenants': '' },
          ];
          exportToCSV(flatData, `${filename}.csv`);
        }

        showToast(`✅ Data exported successfully as ${format.toUpperCase()}!`, 'success');
        setShowExportMenu(false);
      } catch (error) {
        showToast('❌ Failed to export data. Please try again.', 'error');
      } finally {
        setExportLoading(false);
      }
    }, 500);
  };

  // ============ REFRESH HANDLER ============
  const handleRefresh = () => {
    setLoading(true);
    showToast('🔄 Refreshing dashboard data...', 'info');
    setTimeout(() => {
      setLoading(false);
      showToast('✅ Dashboard data refreshed successfully!', 'success');
    }, 1000);
  };

  // ============ STAT CARD CLICK ============
  const handleStatClick = (stat) => {
    if (stat.path) {
      navigate(stat.path);
      showToast(stat.notification || `Navigating to ${stat.title}...`, 'info');
    }
  };

  // Get date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (selectedPeriod) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-week':
        const day = now.getDay();
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        }
        break;
      default:
        break;
    }

    return { start, end };
  };

  const dateRange = getDateRange();

  // Handle click on lead status
  const handleLeadStatusClick = (item) => {
    if (item.path) {
      navigate(item.path);
      showToast(item.notification || `Viewing ${item.label}...`, 'info');
    }
  };

  // Handle click on recent activity
  const handleActivityClick = (activity) => {
    if (activity.path) {
      navigate(activity.path);
      showToast(activity.notification || `Viewing ${activity.user}'s activity...`, 'info');
    }
  };

  // Handle click on top performer
  const handlePerformerClick = (performer) => {
    if (performer.path) {
      navigate(performer.path);
      showToast(performer.notification || `Viewing ${performer.name}'s profile...`, 'info');
    }
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
      {/* ============ TOAST NOTIFICATION ============ */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl animate-slide-in-right flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-white border-l-4 border-green-500 shadow-green-100 text-green-700' :
          toast.type === 'error' ? 'bg-white border-l-4 border-red-500 shadow-red-100 text-red-700' :
          'bg-white border-l-4 border-[#00695C] shadow-[#00695C]/20 text-[#00695C]'
        }`}>
          {toast.type === 'success' && <FiCheckCircle className="text-green-500 text-lg" />}
          {toast.type === 'error' && <FiXCircle className="text-red-500 text-lg" />}
          {toast.type === 'info' && <FiInfo className="text-[#00695C] text-lg" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiXCircle className="text-sm" />
          </button>
        </div>
      )}

      {/* ============ PAGE HEADER ============ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#00695C] to-[#26A69A] p-2.5 rounded-2xl shadow-lg shadow-[#00695C]/20 animate-pulse-soft">
              <FiUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent animate-gradient">
                Buyer & Tenant Overview
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] animate-pulse" />
                Real-time overview of buyers and tenants activity
              </p>
            </div>
          </div>
        </div>

        {/* ============ HEADER RIGHT SIDE ============ */}
        <div className="flex items-center gap-2 flex-wrap relative">
          {/* Period Selector - Theme Color */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-xl px-3 py-2 shadow-lg shadow-[#00695C]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#00695C]/40">
            <FiCalendar className="text-white text-sm" />
            <select 
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer pr-6 [&>option]:text-gray-700 [&>option]:bg-white [&>option:hover]:bg-[#00695C] [&>option:hover]:text-white"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            {selectedPeriod === 'custom' && startDate && endDate && (
              <span className="text-xs text-white bg-white/20 px-2 py-0.5 rounded-full font-medium animate-fade-in">
                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Custom Date Picker - Theme Color */}
          {showCustomDatePicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#00695C]/20 p-5 z-50 w-80 animate-slide-down">
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-[#00695C] text-lg" />
                <h4 className="font-semibold text-gray-800">Select Custom Range</h4>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#00695C] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00695C]"></span>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[#00695C]/20 rounded-lg text-sm text-gray-700 bg-gray-50 focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#00695C] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#26A69A]"></span>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-3 py-2.5 border-2 border-[#00695C]/20 rounded-lg text-sm text-gray-700 bg-gray-50 focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCustomDateApply}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    Apply Range
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomDatePicker(false);
                      setStartDate('');
                      setEndDate('');
                      setSelectedPeriod('this-month');
                    }}
                    className="px-4 py-2.5 border-2 border-[#00695C]/20 rounded-lg text-sm text-[#00695C] font-medium hover:bg-[#00695C]/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button - Theme Color */}
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 hover:scale-[1.02] transition-all duration-300"
          >
            <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Button - Theme Color */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exportLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
            >
              {exportLoading ? (
                <FiRefreshCw className="text-sm animate-spin" />
              ) : (
                <FiDownload className="text-sm" />
              )}
              {exportLoading ? 'Exporting...' : <span className="hidden sm:inline">Export</span>}
              <FiChevronRight className={`text-xs transition-transform duration-200 ${showExportMenu ? 'rotate-90' : ''}`} />
            </button>

            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#00695C]/20 py-1 z-50 min-w-[160px] animate-slide-down">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#00695C]/10 transition-colors flex items-center gap-2"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-[#00695C]">
                    <FiDownload className="text-xs" />
                  </span>
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#00695C]/10 transition-colors flex items-center gap-2"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-[#00695C]">
                    <FiFile className="text-xs" />
                  </span>
                  Export as JSON
                </button>
                <div className="border-t border-[#00695C]/10 my-1"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ DATE RANGE DISPLAY ============ */}
      <div className="mb-4 flex items-center gap-2 animate-fade-in">
        <div className="bg-white px-3 py-1.5 rounded-lg border border-[#00695C]/20 shadow-sm">
          <span className="text-sm text-gray-500">
            Showing data for: <span className="font-medium text-[#00695C]">
              {selectedPeriod === 'custom' && startDate && endDate 
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                : getPeriodLabel(selectedPeriod)
              }
            </span>
          </span>
        </div>
        {selectedPeriod === 'custom' && startDate && endDate && (
          <span className="text-xs text-white bg-gradient-to-r from-[#00695C] to-[#26A69A] px-2 py-0.5 rounded-full font-medium animate-pulse-soft">
            {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
          </span>
        )}
      </div>

      {/* ============ STATISTICS CARDS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statsData.map((stat, index) => (
          <div
            key={stat.id}
            onClick={() => handleStatClick(stat)}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-3 border border-gray-200/60 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden cursor-pointer animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <div className={`w-7 h-7 rounded-lg bg-white/70 backdrop-blur-sm flex items-center justify-center text-base shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse-soft ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend === 'up' ? <FiArrowUp className="text-xs" /> : <FiArrowDown className="text-xs" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-700">{stat.title}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ MAIN CONTENT GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FaChartLine className="text-[#00695C] animate-pulse-soft" />
                  User Growth Overview
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#26A69A] animate-pulse" />
                  Monthly user registrations trend
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-70 transition-opacity group"
                  onClick={() => showToast('📊 Showing buyers data', 'info')}
                >
                  <span className="w-3 h-3 rounded-full bg-[#00695C] shadow-sm shadow-[#00695C]/20 animate-pulse-soft"></span>
                  <span className="text-gray-600 group-hover:text-[#00695C] transition-colors">Buyers</span>
                  <span className="text-gray-400 text-[10px]">(1,284)</span>
                </div>
                <div 
                  className="flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-70 transition-opacity group"
                  onClick={() => showToast('📊 Showing tenants data', 'info')}
                >
                  <span className="w-3 h-3 rounded-full bg-[#26A69A] shadow-sm shadow-[#26A69A]/20 animate-pulse-soft"></span>
                  <span className="text-gray-600 group-hover:text-[#26A69A] transition-colors">Tenants</span>
                  <span className="text-gray-400 text-[10px]">(856)</span>
                </div>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="relative h-[120px] mt-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between px-2">
                {[0, 25, 50, 75, 100].map((val) => (
                  <div key={val} className="w-full border-t border-gray-100 relative">
                    <span className="absolute -left-12 -top-2 text-[10px] text-gray-400 font-medium">
                      {val}%
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Bars Container */}
              <div className="absolute inset-0 flex items-end justify-between pl-4 pr-2 pb-4">
                {months.map((month, index) => {
                  const buyerHeight = getBarHeight(buyersData[index]);
                  const tenantHeight = getBarHeight(tenantsData[index]);
                  
                  return (
                    <div 
                      key={month} 
                      className="flex flex-col items-center gap-0.5 group relative h-full justify-end"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{month}</span>
                          <div className="flex gap-2 mt-0.5">
                            <span>👤 {buyersData[index]}</span>
                            <span>🏠 {tenantsData[index]}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bars Stack */}
                      <div className="flex items-end gap-0.5">
                        <div 
                          className="w-3 bg-gradient-to-t from-[#00695C] to-[#26A69A] rounded-t-sm transition-all duration-500 cursor-pointer hover:opacity-80 hover:scale-y-105 origin-bottom"
                          style={{ 
                            height: `${buyerHeight}px`,
                            minHeight: buyerHeight > 0 ? '2px' : '0px'
                          }}
                          onClick={() => showToast(`📊 Buyers: ${buyersData[index]} registrations in ${month}`, 'info')}
                        />
                        <div 
                          className="w-3 bg-gradient-to-t from-[#26A69A] to-[#80CBC4] rounded-t-sm transition-all duration-500 cursor-pointer hover:opacity-80 hover:scale-y-105 origin-bottom"
                          style={{ 
                            height: `${tenantHeight}px`,
                            minHeight: tenantHeight > 0 ? '2px' : '0px'
                          }}
                          onClick={() => showToast(`📊 Tenants: ${tenantsData[index]} registrations in ${month}`, 'info')}
                        />
                      </div>
                      
                      {/* Month Label */}
                      <span className="absolute -bottom-5 text-[9px] text-gray-500 font-medium group-hover:text-[#00695C] transition-colors">
                        {month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Stats Footer */}
            <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00695C] animate-pulse-soft"></span>
                    <span className="text-xs text-gray-500">Buyers</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">1,284</span>
                  <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">+12.5%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#26A69A] animate-pulse-soft"></span>
                    <span className="text-xs text-gray-500">Tenants</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">856</span>
                  <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">+8.2%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FiTrendingUp className="text-[#00695C] text-xs animate-pulse-soft" />
                  <span className="text-xs font-semibold text-[#00695C]">+22.8%</span>
                </div>
                <span className="text-[10px] text-gray-400">vs last year</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiClock className="text-[#00695C] animate-pulse-soft" />
                  Recent Activity
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Latest actions by buyers and tenants</p>
              </div>
              <button 
                onClick={() => {
                  navigate('/admin/buyers-tenants/buyer/overview');
                  showToast('📋 Viewing all recent activities...', 'info');
                }}
                className="text-xs text-[#00695C] font-medium hover:underline flex items-center gap-1 hover:gap-2 transition-all duration-300"
              >
                View All <FiArrowUp className="rotate-90 text-xs transition-transform duration-300" />
              </button>
            </div>
            
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-200 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img 
                    src={activity.avatar} 
                    alt={activity.user}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-gray-800">{activity.user}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                        activity.type === 'buyer' ? 'bg-teal-100 text-[#00695C]' : 'bg-green-100 text-[#26A69A]'
                      }`}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{activity.action}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{activity.property}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                    <FiClockIcon className="text-xs" />
                    {activity.time}
                  </div>
                  <FiChevronRight className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-4">
          {/* Top Performers */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiStar className="text-yellow-500 animate-pulse-soft" />
                  Top Performers
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Best performing agents & managers</p>
              </div>
              <button 
                onClick={() => {
                  navigate('/admin/agents/overview');
                  showToast('⭐ Viewing all top performers...', 'info');
                }}
                className="text-xs text-[#00695C] font-medium hover:underline hover:gap-2 transition-all duration-300 flex items-center gap-1"
              >
                View All <FiArrowUp className="rotate-90 text-xs transition-transform duration-300" />
              </button>
            </div>
            
            <div className="space-y-2">
              {topPerformers.map((performer, index) => (
                <div 
                  key={performer.id}
                  onClick={() => handlePerformerClick(performer)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img 
                    src={performer.avatar} 
                    alt={performer.name}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-gray-800">{performer.name}</span>
                      <span className="text-[10px] px-1 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium animate-pulse-soft">
                        ★ {performer.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{performer.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-700">{performer.totalDeals} deals</div>
                    <div className="text-xs text-[#00695C] font-medium">{performer.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Status */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                <FiTrendingUp className="text-[#00695C] animate-pulse-soft" />
                Lead Status
              </h3>
              <button 
                onClick={() => {
                  navigate('/admin/buyers-tenants/lead/dashboard');
                  showToast('📊 Viewing all lead status...', 'info');
                }}
                className="text-xs text-[#00695C] font-medium hover:underline hover:gap-2 transition-all duration-300 flex items-center gap-1"
              >
                View All <FiArrowUp className="rotate-90 text-xs transition-transform duration-300" />
              </button>
            </div>
            
            <div className="space-y-2">
              {leadStatusData.map((item, index) => (
                <div 
                  key={index} 
                  className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.03}s` }}
                  onClick={() => handleLeadStatusClick(item)}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 hover:scale-y-110 origin-center`}
                      style={{ width: `${(item.value / maxLeadValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

         

          {/* Quick Stats - Theme Color */}
          <div className="grid grid-cols-2 gap-2 ">
            <div 
              className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
              onClick={() => {
                navigate('/admin/buyers-tenants/buyer/registration');
                showToast('📝 Viewing new registrations...', 'info');
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00695C]/10 text-[#00695C] mx-auto mb-1 group-hover:scale-110 transition-transform duration-300">
                <FiUsers className="text-base" />
              </div>
              <div className="text-xl font-bold text-gray-800">47</div>
              <div className="text-xs text-gray-500">New Registrations</div>
            </div>
            <div 
              className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
              onClick={() => {
                navigate('/admin/buyers-tenants/saved/wishlist');
                showToast('❤️ Viewing wishlist items...', 'info');
              }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 text-[#E91E63] mx-auto mb-1 group-hover:scale-110 transition-transform duration-300">
                <FiHeart className="text-base" />
              </div>
              <div className="text-xl font-bold text-gray-800">3.4K</div>
              <div className="text-xs text-gray-500">Wishlist Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FOOTER NOTE ============ */}
      <div className="mt-6 text-center animate-fade-in">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#26A69A] animate-pulse" />
          Live Data Updated Every 30 Seconds
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          Last Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          <button 
            onClick={handleRefresh}
            className="text-[#00695C] hover:underline ml-1 font-medium hover:text-[#004D40] transition-colors duration-300"
          >
            Refresh
          </button>
        </p>
      </div>

      {/* ============ ANIMATION STYLES ============ */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulseSoft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-pulse-soft {
          animation: pulseSoft 2s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default BuyerTenantsOverview;