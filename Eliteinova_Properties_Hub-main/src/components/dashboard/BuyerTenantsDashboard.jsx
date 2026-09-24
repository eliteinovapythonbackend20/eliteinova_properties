// src/components/dashboard/BuyerTenantsDashboard.jsx

import React, { useState, useEffect } from 'react';

// ===== REACT ICONS IMPORTS =====
import { 
  FiGrid, FiUser, FiHome, FiUsers, FiPhone, FiMail, FiMapPin, 
  FiSettings, FiBell, FiSearch, FiChevronDown, FiLogOut, 
  FiStar, FiEye, FiMessageCircle, FiGlobe, FiCalendar, 
  FiClock, FiPlus, FiEdit, FiTrash2, FiDownload, FiPrinter,
  FiRefreshCw, FiFilter, FiShare, FiCopy, FiUpload, FiDownloadCloud,
  FiLock, FiUnlock, FiInfo, FiAlertTriangle, FiHelpCircle,
  FiCheckCircle, FiXCircle, FiTrendingUp, FiArrowUp, FiArrowDown,
  FiHeart, FiBookmark, FiMap, FiCheckSquare, FiSquare,
  FiClipboard, FiLayers
} from 'react-icons/fi';

import { 
  FaBuilding, FaShoppingBag, 
  FaDollarSign, FaFileAlt, FaUserTie, FaUserCheck, FaUserCog,
  FaProjectDiagram, FaTools, FaShieldAlt, FaImage, FaBell,
  FaChartLine, FaWallet, FaBars, FaSun, FaMoon, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaWhatsapp, FaCopy as FaCopyIcon, FaShareAlt, FaQrcode,
  FaCloudUploadAlt, FaCloudDownloadAlt, FaEye, FaEyeSlash,
  FaUserCircle, FaUsers, FaUserFriends, FaHandshake, FaHome,
  FaCalendarCheck, FaClipboardList, FaClipboardCheck,
  FaUserPlus, FaUserMinus, FaCrown
} from 'react-icons/fa';

import { 
  MdOutlineDashboard, MdOutlineRealEstateAgent, MdOutlineApartment, 
  MdOutlineBusiness, MdOutlinePeople, MdOutlinePersonSearch,
  MdOutlineFavorite, MdOutlineBookmark, MdOutlineLocationOn,
  MdOutlineDateRange, MdOutlineAssignment, MdOutlinePending
} from 'react-icons/md';

import { 
  BsBuilding, BsTools, BsPeople, BsPersonPlus, 
  BsPersonCheck, BsPersonX, BsClock, BsCalendar3
} from 'react-icons/bs';

import { 
  HiOutlineBuildingOffice, HiOutlineUserGroup
} from 'react-icons/hi2';

// ============ IMPORT ALL COMPONENTS ============
// Overview
import BuyerTenantsOverview from './buyer&tenants/BuyerTenantsOverview';

// Buyer Management
import BuyerManagementOverview from './buyer&tenants/BuyerManagement/BuyerManagementOverview';
import BuyerRegistration from './buyer&tenants/BuyerManagement/BuyerRegistration';
import BuyerProfile from './buyer&tenants/BuyerManagement/BuyerProfile';
import BuyerPropertyActivity from './buyer&tenants/BuyerManagement/BuyerPropertyActivity';

// Tenant Management
import TenantManagementOverview from './buyer&tenants/TenantManagement/TenantManagementOverview';
import TenantRegistration from './buyer&tenants/TenantManagement/TenantRegistration';
import TenantRequirements from './buyer&tenants/TenantManagement/TenantRequirements';
import TenantPropertyActivity from './buyer&tenants/TenantManagement/TenantPropertyActivity';

// Saved & Wishlist
import SavedWishlistOverview from './buyer&tenants/SavedWishlist/SavedWishlistOverview';
import SavedProperties from './buyer&tenants/SavedWishlist/SavedProperties';
import Wishlist from './buyer&tenants/SavedWishlist/Wishlist';
import SavedWishlistActions from './buyer&tenants/SavedWishlist/SavedWishlistActions';

// Site Visits
import SiteVisitsOverview from './buyer&tenants/SiteVisits/SiteVisitsOverview';
import SiteVisitDashboard from './buyer&tenants/SiteVisits/SiteVisitDashboard';
import SiteVisitDetails from './buyer&tenants/SiteVisits/SiteVisitDetails';
import SiteVisitStatus from './buyer&tenants/SiteVisits/SiteVisitStatus';
import SiteVisitActions from './buyer&tenants/SiteVisits/SiteVisitActions';

// Rental Requests
import RentalRequestsOverview from './buyer&tenants/RentalRequests/RentalRequestsOverview';
import RentalRequestManagement from './buyer&tenants/RentalRequests/RentalRequestManagement';
import RentalRequestDetails from './buyer&tenants/RentalRequests/RentalRequestDetails';
import RentalRequestStatus from './buyer&tenants/RentalRequests/RentalRequestStatus';

// Purchase Requests
import PurchaseRequestsOverview from './buyer&tenants/PurchaseRequests/PurchaseRequestsOverview';
import PurchaseRequestManagement from './buyer&tenants/PurchaseRequests/PurchaseRequestManagement';
import PurchaseRequestDetails from './buyer&tenants/PurchaseRequests/PurchaseRequestDetails';
import PurchaseRequestStatus from './buyer&tenants/PurchaseRequests/PurchaseRequestStatus';

// Lead Management
import LeadManagementOverview from './buyer&tenants/LeadManagement/LeadManagementOverview';
import LeadDashboard from './buyer&tenants/LeadManagement/LeadDashboard';
import LeadSources from './buyer&tenants/LeadManagement/LeadSources';
import LeadInformation from './buyer&tenants/LeadManagement/LeadInformation';
import LeadStatus from './buyer&tenants/LeadManagement/LeadStatus';
import LeadActions from './buyer&tenants/LeadManagement/LeadActions';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const BuyerTenantsDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState(['buyer-management']);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-expand menu if a child is active
  useEffect(() => {
    const path = location.pathname;
    menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => path === child.key);
        if (hasActiveChild && !openMenus.includes(item.key)) {
          setOpenMenus([...openMenus, item.key]);
        }
      }
    });
  }, [location.pathname]);

  const getPageTitle = () => {
    const path = location.pathname;
    const cleanPath = path.replace('/admin/buyers-tenants', '');
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 1) return 'Overview';
    const last = segments[segments.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace('-', ' ');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const menuItems = [
    { key: '/admin/buyers-tenants/overview', icon: <FiGrid />, label: 'Dashboard Overview' },
    {
      key: 'buyer-management',
      icon: <FaUserCircle />,
      label: 'Buyer Management',
      children: [
        { key: '/admin/buyers-tenants/buyer/overview', icon: <FiGrid />, label: 'Buyer Overview' },
        { key: '/admin/buyers-tenants/buyer/registration', icon: <FaUserPlus />, label: 'Buyer Registration' },
        { key: '/admin/buyers-tenants/buyer/profile', icon: <FiUser />, label: 'Buyer Profile' },
        { key: '/admin/buyers-tenants/buyer/activity', icon: <FiEye />, label: 'Property Activity' },
      ],
    },
    {
      key: 'tenant-management',
      icon: <BsPeople />,
      label: 'Tenant Management',
      children: [
        { key: '/admin/buyers-tenants/tenant/overview', icon: <FiGrid />, label: 'Tenant Overview' },
        { key: '/admin/buyers-tenants/tenant/registration', icon: <FaUserPlus />, label: 'Tenant Registration' },
        { key: '/admin/buyers-tenants/tenant/requirements', icon: <FiClipboard />, label: 'Tenant Requirements' },
        { key: '/admin/buyers-tenants/tenant/activity', icon: <FiEye />, label: 'Property Activity' },
      ],
    },
    {
      key: 'saved-wishlist',
      icon: <MdOutlineFavorite />,
      label: 'Saved & Wishlist',
      children: [
        { key: '/admin/buyers-tenants/saved/overview', icon: <FiGrid />, label: 'Saved Overview' },
        { key: '/admin/buyers-tenants/saved/properties', icon: <FiHome />, label: 'Saved Properties' },
        { key: '/admin/buyers-tenants/saved/wishlist', icon: <FiHeart />, label: 'Wishlist' },
        { key: '/admin/buyers-tenants/saved/actions', icon: <FiSettings />, label: 'Actions' },
      ],
    },
    {
      key: 'site-visits',
      icon: <MdOutlineLocationOn />,
      label: 'Site Visits',
      children: [
        { key: '/admin/buyers-tenants/site-visits/overview', icon: <FiGrid />, label: 'Site Visits Overview' },
        { key: '/admin/buyers-tenants/site-visits/dashboard', icon: <FiGrid />, label: 'Visit Dashboard' },
        { key: '/admin/buyers-tenants/site-visits/details', icon: <FiInfo />, label: 'Visit Details' },
        { key: '/admin/buyers-tenants/site-visits/status', icon: <FiCheckCircle />, label: 'Visit Status' },
        { key: '/admin/buyers-tenants/site-visits/actions', icon: <FiSettings />, label: 'Visit Actions' },
      ],
    },
    {
      key: 'rental-requests',
      icon: <FaClipboardList />,
      label: 'Rental Requests',
      children: [
        { key: '/admin/buyers-tenants/rental/overview', icon: <FiGrid />, label: 'Rental Overview' },
        { key: '/admin/buyers-tenants/rental/management', icon: <FiSettings />, label: 'Rental Management' },
        { key: '/admin/buyers-tenants/rental/details', icon: <FiInfo />, label: 'Request Details' },
        { key: '/admin/buyers-tenants/rental/status', icon: <FiCheckCircle />, label: 'Request Status' },
      ],
    },
    {
      key: 'purchase-requests',
      icon: <FaHandshake />,
      label: 'Purchase Requests',
      children: [
        { key: '/admin/buyers-tenants/purchase/overview', icon: <FiGrid />, label: 'Purchase Overview' },
        { key: '/admin/buyers-tenants/purchase/management', icon: <FiSettings />, label: 'Purchase Management' },
        { key: '/admin/buyers-tenants/purchase/details', icon: <FiInfo />, label: 'Request Details' },
        { key: '/admin/buyers-tenants/purchase/status', icon: <FiCheckCircle />, label: 'Request Status' },
      ],
    },
    {
      key: 'lead-management',
      icon: <MdOutlinePersonSearch />,
      label: 'Lead Management',
      children: [
        { key: '/admin/buyers-tenants/lead/overview', icon: <FiGrid />, label: 'Lead Overview' },
        { key: '/admin/buyers-tenants/lead/dashboard', icon: <FiGrid />, label: 'Lead Dashboard' },
        { key: '/admin/buyers-tenants/lead/sources', icon: <FiShare />, label: 'Lead Sources' },
        { key: '/admin/buyers-tenants/lead/information', icon: <FiInfo />, label: 'Lead Information' },
        { key: '/admin/buyers-tenants/lead/status', icon: <FiCheckCircle />, label: 'Lead Status' },
        { key: '/admin/buyers-tenants/lead/actions', icon: <FiSettings />, label: 'Lead Actions' },
      ],
    },
  ];

  const isSubActive = (children) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.key);
  };

  // Helper function to check if current path is Admin Dashboard
  const isAdminDashboard = () => {
    const path = location.pathname;
    // Exclude buyers-tenants, properties, super-admin paths
    if (path.includes('buyers-tenants') || path.includes('properties') || path.includes('super-admin')) {
      return false;
    }
    // Check if path is exactly /admin or /admin/overview or starts with /admin/ but not other dashboards
    return path === '/admin' || path === '/admin/' || path === '/admin/overview' || 
           (path.startsWith('/admin/') && !path.includes('buyers-tenants') && !path.includes('properties') && !path.includes('super-admin'));
  };

  // Helper function to check if current path is Super Admin
  const isSuperAdmin = () => {
    return location.pathname.includes('super-admin');
  };

  // Helper function to check if current path is Properties Dashboard
  // FIXED: Only check for '/admin/properties' path, not any path containing 'properties'
  const isPropertiesDashboard = () => {
    const path = location.pathname;
    // Only match if the path starts with /admin/properties (not /admin/buyers-tenants/saved/properties)
    return path.startsWith('/admin/properties') || path === '/admin/properties';
  };

  const renderMenuItem = (item) => {
    if (item.children) {
      const isOpen = openMenus.includes(item.key);
      const isItemActive = isSubActive(item.children);
      
      return (
        <div key={item.key} className="mb-0.5">
          <button
            onClick={() => {
              if (isOpen) {
                setOpenMenus(openMenus.filter(k => k !== item.key));
              } else {
                setOpenMenus([...openMenus, item.key]);
              }
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium
              ${isItemActive 
                ? 'text-[#00695C] bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-l-4 border-[#00695C]' 
                : 'text-gray-600 hover:text-[#00695C] hover:bg-[#00695C]/5'
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <FiChevronDown className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
          {!collapsed && isOpen && (
            <div className="ml-3 pl-3 border-l-2 border-[#00695C]/20 space-y-0.5 mt-0.5">
              {item.children.map(child => {
                const isChildActive = location.pathname === child.key;
                return (
                  <button
                    key={child.key}
                    onClick={() => navigate(child.key)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 text-sm
                      ${isChildActive 
                        ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30 font-medium' 
                        : 'text-gray-600 hover:text-[#00695C] hover:bg-[#00695C]/5'
                      }
                    `}
                  >
                    <span className={`text-base ${isChildActive ? 'text-white' : ''}`}>{child.icon}</span>
                    <span>{child.label}</span>
                    {isChildActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActiveItem = location.pathname === item.key;
    return (
      <button
        key={item.key}
        onClick={() => navigate(item.key)}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium
          ${isActiveItem 
            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' 
            : 'text-gray-600 hover:text-[#00695C] hover:bg-[#00695C]/5'
          }
        `}
      >
        <span className={`text-lg ${isActiveItem ? 'text-white' : ''}`}>{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
        {isActiveItem && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
      </button>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f0f2f5] flex">
      {/* ============ SIDEBAR ============ */}
      <aside className={`
        fixed left-0 h-full transition-all duration-300 z-50
        ${collapsed ? 'w-20' : 'w-64'}
        flex flex-col
        bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]
        border-r border-gray-200 shadow-xl
        mt-1
        overflow-hidden
      `}>
        {/* Logo - Fixed at top */}
        <div className={`
          flex-shrink-0 h-14 flex items-center gap-3 px-4 border-b border-gray-200
          bg-gradient-to-r from-[#00695C] to-[#26A69A] relative overflow-hidden
          ${collapsed ? 'justify-center' : ''}
        `}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className={`
            w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm
            ${collapsed ? '' : 'animate-pulse-glow'}
          `}>
            <FiUsers className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-base tracking-wide">Eliteinova</div>
              <div className="text-[8px] text-white/60 tracking-widest uppercase -mt-0.5">Buyers & Tenants</div>
            </div>
          )}
        </div>

        {/* Menu - Scrollable area with proper bottom padding */}
        <div 
          className="flex-1 overflow-y-auto sidebar-scroll" 
          style={{ minHeight: 0 }}
        >
          <div className="py-3 px-2 pb-20">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Bottom - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gradient-to-b from-transparent to-[#eef2f7]">
          {!collapsed ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] animate-pulse" />
                System Online
              </div>
              <div className="text-[10px] text-gray-400 mt-1">v2.0.0</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] animate-pulse" />
            </div>
          )}
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className={`
        relative flex-1 transition-all duration-300 h-full overflow-hidden
        ${collapsed ? 'ml-20' : 'ml-64'}
        flex flex-col
      `}>
        {/* ============ HEADER ============ */}
        <header className="relative z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-9 h-9 rounded-xl bg-[#00695C]/5 text-[#00695C] hover:bg-[#00695C]/10 hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <FaBars className="text-base" />
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#00695C] font-medium">
                  <FiUsers className="mr-1 inline" /> Buyers & Tenants
                </span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-700">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right - Dashboard Navigation Links  */}
            <div className="flex items-center gap-2">
              {/* Admin Dashboard */}
              <button
                onClick={() => navigate('/admin/overview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isAdminDashboard()
                    ? 'bg-[#00695C] text-white shadow-md shadow-[#00695C]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#00695C]/10 hover:text-[#00695C]'
                }`}
              >
                <FiGrid className="text-base" />
                Admin
              </button>

              {/* Buyers & Tenants Dashboard - Active */}
              <button
                onClick={() => navigate('/admin/buyers-tenants/overview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  location.pathname.includes('buyers-tenants')
                    ? 'bg-[#00695C] text-white shadow-md shadow-[#00695C]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#00695C]/10 hover:text-[#00695C]'
                }`}
              >
                <HiOutlineUserGroup className="text-base" />
                Buyers & Tenants
              </button>

              {/* Properties Dashboard  */}
              <button
                onClick={() => navigate('/admin/properties/overview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isPropertiesDashboard()
                    ? 'bg-[#00695C] text-white shadow-md shadow-[#00695C]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#00695C]/10 hover:text-[#00695C]'
                }`}
              >
                <FiHome className="text-base" />
                Properties
              </button>

              {/* Super Admin Dashboard */}
              <button
                onClick={() => navigate('/admin/super-admin')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isSuperAdmin()
                    ? 'bg-[#00695C] text-white shadow-md shadow-[#00695C]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#00695C]/10 hover:text-[#00695C]'
                }`}
              >
                <FaCrown className="text-base" />
                Super Admin
              </button>

              <div className="w-px h-8 bg-gray-200 mx-1.5" />

             
            </div>
          </div>
        </header>

        {/* ============ CONTENT - Scrollable area ============ */}
        <div className="flex-1 overflow-y-auto p-4 content-scroll" style={{ minHeight: 0 }}>
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full relative overflow-hidden">
            {/* Animated Background Decor */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
            
            <Routes location={{ ...location, pathname: location.pathname.replace(/^\/admin\/buyers-tenants/, '/admin') || '/admin' }}>
              {/* Overview */}
              <Route index element={<BuyerTenantsOverview />} />
              <Route path="overview" element={<BuyerTenantsOverview />} />

              {/* Buyer Management */}
              <Route path="buyer/overview" element={<BuyerManagementOverview />} />
              <Route path="buyer/registration" element={<BuyerRegistration />} />
              <Route path="buyer/profile" element={<BuyerProfile />} />
              <Route path="buyer/activity" element={<BuyerPropertyActivity />} />

              {/* Tenant Management */}
              <Route path="tenant/overview" element={<TenantManagementOverview />} />
              <Route path="tenant/registration" element={<TenantRegistration />} />
              <Route path="tenant/requirements" element={<TenantRequirements />} />
              <Route path="tenant/activity" element={<TenantPropertyActivity />} />

              {/* Saved & Wishlist */}
              <Route path="saved/overview" element={<SavedWishlistOverview />} />
              <Route path="saved/properties" element={<SavedProperties />} />
              <Route path="saved/wishlist" element={<Wishlist />} />
              <Route path="saved/actions" element={<SavedWishlistActions />} />

              {/* Site Visits */}
              <Route path="site-visits/overview" element={<SiteVisitsOverview />} />
              <Route path="site-visits/dashboard" element={<SiteVisitDashboard />} />
              <Route path="site-visits/details" element={<SiteVisitDetails />} />
              <Route path="site-visits/status" element={<SiteVisitStatus />} />
              <Route path="site-visits/actions" element={<SiteVisitActions />} />

              {/* Rental Requests */}
              <Route path="rental/overview" element={<RentalRequestsOverview />} />
              <Route path="rental/management" element={<RentalRequestManagement />} />
              <Route path="rental/details" element={<RentalRequestDetails />} />
              <Route path="rental/status" element={<RentalRequestStatus />} />

              {/* Purchase Requests */}
              <Route path="purchase/overview" element={<PurchaseRequestsOverview />} />
              <Route path="purchase/management" element={<PurchaseRequestManagement />} />
              <Route path="purchase/details" element={<PurchaseRequestDetails />} />
              <Route path="purchase/status" element={<PurchaseRequestStatus />} />

              {/* Lead Management */}
              <Route path="lead/overview" element={<LeadManagementOverview />} />
              <Route path="lead/dashboard" element={<LeadDashboard />} />
              <Route path="lead/sources" element={<LeadSources />} />
              <Route path="lead/information" element={<LeadInformation />} />
              <Route path="lead/status" element={<LeadStatus />} />
              <Route path="lead/actions" element={<LeadActions />} />
            </Routes>
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <footer className="flex-shrink-0 py-2 px-4 border-t border-gray-100 bg-white/50">
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
            <span>© 2026</span>
            <span className="text-[#00695C] font-semibold">EliteInova</span>
            <span>Real Estate Platform</span>
            <span className="w-1 h-1 rounded-full bg-[#26A69A] animate-pulse" />
            <span className="text-[#26A69A]">v2.0.0</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Made with ❤️</span>
          </div>
        </footer>
      </main>

      {/* ============ TAILWIND CSS ANIMATIONS & SCROLLBAR STYLES ============ */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.1); }
          66% { transform: translate(-10px, 10px) scale(0.9); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20px, 20px) scale(1.1); }
          66% { transform: translate(10px, -10px) scale(0.9); }
        }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-float { animation: float 15s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 18s ease-in-out infinite; }
        
        /* Sidebar Scrollbar Styles */
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 20px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        
        /* Content Scrollbar Styles */
        .content-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .content-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .content-scroll::-webkit-scrollbar-thumb {
          background: #c1c7cd;
          border-radius: 10px;
        }
        .content-scroll::-webkit-scrollbar-thumb:hover {
          background: #a0a7ae;
        }
        .content-scroll {
          scrollbar-width: thin;
          scrollbar-color: #c1c7cd #f1f1f1;
        }
        
        @media (max-width: 768px) {
          aside { transform: translateX(${collapsed ? '-100%' : '0'}); }
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default BuyerTenantsDashboard;