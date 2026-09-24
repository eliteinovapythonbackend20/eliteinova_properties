// src/components/dashboard/AdminDashboard.jsx

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
  FiLayers
} from 'react-icons/fi';

import { 
  FaBuilding, FaShoppingBag, 
  FaDollarSign, FaFileAlt, FaUserTie, FaUserCheck, FaUserCog,
  FaProjectDiagram, FaTools, FaShieldAlt, FaImage, FaBell,
  FaChartLine, FaWallet, FaBars, FaSun, FaMoon, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaWhatsapp, FaCopy as FaCopyIcon, FaShareAlt, FaQrcode,
  FaCloudUploadAlt, FaCloudDownloadAlt, FaEye, FaEyeSlash,
  FaUserCircle, FaUsers, FaCrown, FaHome
} from 'react-icons/fa';

import { MdOutlineDashboard, MdOutlineRealEstateAgent, MdOutlineApartment, MdOutlineBusiness } from 'react-icons/md';
import { BsBuilding, BsTools } from 'react-icons/bs';
import { HiOutlineBuildingOffice, HiOutlineUserGroup } from 'react-icons/hi2';

// ============ IMPORT ALL COMPONENTS ============
import AdminOverview from './admin/AdminOverview';
import UserManagement from './admin/UserManagement';

// Super Admin
import SuperAdminDashboard from './SuperAdminDashboard';

// Owners
import OwnersOverview from './admin/Owners/OwnersOverview';
import OwnersRegistration from './admin/Owners/OwnersRegistration';
import OwnersPropertyControl from './admin/Owners/OwnersPropertyControl';
import OwnersPropertiesLeads from './admin/Owners/OwnersPropertiesLeads';

// Agents
import AgentsOverview from './admin/Agents/AgentsOverview';
import AgentsRegistration from './admin/Agents/AgentsRegistration';
import AgentsVerification from './admin/Agents/AgentsVerification';
import AgentsPropertiesLeads from './admin/Agents/AgentsPropertiesLeads';
import AgentsPropertyControl from './admin/Agents/AgentsPropertyControl';

// Builders
import BuildersOverview from './admin/Builders/BuildersOverview';
import BuildersRegistration from './admin/Builders/BuildersRegistration';
import BuildersVerification from './admin/Builders/BuildersVerification';
import BuildersProjects from './admin/Builders/BuildersProjects';
import BuildersPropertyControl from './admin/Builders/BuildersPropertyControl';
import BuildersPropertiesLeads from './admin/Builders/BuildersPropertiesLeads';

// Property Managers
import PropertyManagersOverview from './admin/PropertyManagers/PropertyManagersOverview';
import PropertyManagersRegistration from './admin/PropertyManagers/PropertyManagersRegistration';
import PropertyManagersCompanyManagement from './admin/PropertyManagers/PropertyManagersCompanyManagement';
import PropertyManagersMaintenance from './admin/PropertyManagers/PropertyManagersMaintenance';
import PropertyManagersPropertyControl from './admin/PropertyManagers/PropertyManagersPropertyControl';
import PropertyManagersPropertiesLeads from './admin/PropertyManagers/PropertyManagersPropertiesLeads';

// Subscriptions
import SubscriptionsOverview from './admin/Subscriptions/SubscriptionsOverview';
import OwnerPlans from './admin/Subscriptions/OwnerPlans';
import AgentPlans from './admin/Subscriptions/AgentPlans';
import BuilderPlans from './admin/Subscriptions/BuilderPlans';
import PropertyManagerPlans from './admin/Subscriptions/PropertyManagerPlans';

// Buyers & Tenants
import BuyerTenantsDashboard from './BuyerTenantsDashboard';

// Properties
import PropertiesDashboard from './PropertiesDashboard';

// Payments
import PaymentsOverview from './admin/Payments/PaymentsDashboard';
import PaymentTransactions from './admin/Payments/PaymentTransactions';
import CustomerDetails from './admin/Payments/CustomerDetails';
import PropertyPaymentDetails from './admin/Payments/PropertyPaymentDetails';
import PersonalAmountDetails from './admin/Payments/PersonalAmountDetails';
import RefundManagement from './admin/Payments/RefundManagement';
import PaymentReconciliation from './admin/Payments/PaymentReconciliation';
import CommissionRevenue from './admin/Payments/CommissionRevenue';
import ManualPayment from './admin/Payments/ManualPayment';
import PaymentReports from './admin/Payments/PaymentReports';


// Other modules
// import LeadManagement from './admin/LeadManagement';
// import ReportsAnalytics from './admin/ReportsAnalytics';
// import ContentManagement from './admin/ContentManagement';
// import Notifications from './admin/Notifications';
// import Settings from './admin/Settings';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState(['owners']);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/admin/overview', icon: <FiGrid />, label: 'Dashboard Overview' },
    { key: '/admin/super-admin', icon: <FaUserCog />, label: 'Super Admin' },
    { key: '/admin/user-management', icon: <FiUser />, label: 'User Management' },
    {
      key: 'owners',
      icon: <FiUser />,
      label: 'Owners',
      children: [
        { key: '/admin/owners/overview', icon: <FiGrid />, label: 'Owners Dashboard' },
        { key: '/admin/owners/registration', icon: <FiCheckCircle />, label: 'Registration & KYC' },
        { key: '/admin/owners/property-control', icon: <FiSettings />, label: 'Property Control' },
        { key: '/admin/owners/leads', icon: <FiMessageCircle />, label: 'Properties Leads' },
      ],
    },
    {
      key: 'agents',
      icon: <FiUsers />,
      label: 'Agents',
      children: [
        { key: '/admin/agents/overview', icon: <FiGrid />, label: 'Agents Dashboard' },
        { key: '/admin/agents/registration', icon: <FiCheckCircle />, label: 'Registration Approval' },
        { key: '/admin/agents/verification', icon: <FaShieldAlt />, label: 'Agent Verification' },
        { key: '/admin/agents/leads', icon: <FiHome />, label: 'Properties Leads' },
        { key: '/admin/agents/property-control', icon: <FiSettings />, label: 'Property Control' },
      ],
    },
    {
      key: 'builders',
      icon: <FaBuilding />,
      label: 'Builders',
      children: [
        { key: '/admin/builders/overview', icon: <FiGrid />, label: 'Builders Dashboard' },
        { key: '/admin/builders/registration', icon: <FiCheckCircle />, label: 'Registration Approval' },
        { key: '/admin/builders/verification', icon: <FaShieldAlt />, label: 'Builder Verification' },
        { key: '/admin/builders/projects', icon: <FaProjectDiagram />, label: 'Project Management' },
        { key: '/admin/builders/property-control', icon: <FiSettings />, label: 'Property Control' },
        { key: '/admin/builders/leads', icon: <FiMessageCircle />, label: 'Properties Leads' },
      ],
    },
    {
      key: 'property-managers',
      icon: <HiOutlineBuildingOffice />,
      label: 'Property Managers',
      children: [
        { key: '/admin/property-managers/overview', icon: <FiGrid />, label: 'PM Dashboard' },
        { key: '/admin/property-managers/registration', icon: <FiCheckCircle />, label: 'Registration Approval' },
        { key: '/admin/property-managers/companies', icon: <FaBuilding />, label: 'Company Management' },
        { key: '/admin/property-managers/maintenance', icon: <BsTools />, label: 'Maintenance' },
        { key: '/admin/property-managers/property-control', icon: <FiSettings />, label: 'Property Control' },
        { key: '/admin/property-managers/leads', icon: <FiMessageCircle />, label: 'Properties Leads' },
      ],
    },
    { key: '/admin/buyers-tenants', icon: <HiOutlineUserGroup />, label: 'Buyers & Tenants' },
    { key: '/admin/properties', icon: <FiHome />, label: 'Properties' },
    { key: '/admin/leads', icon: <FiMessageCircle />, label: 'Lead Management' },
    {
      key: 'subscriptions',
      icon: <FaDollarSign />,
      label: 'Subscriptions',
      children: [
        { key: '/admin/subscriptions/overview', icon: <FiGrid />, label: 'Subscriptions Dashboard' },
        { key: '/admin/subscriptions/owners', icon: <FiUser />, label: 'Owner Plans' },
        { key: '/admin/subscriptions/agents', icon: <FiUsers />, label: 'Agent Plans' },
        { key: '/admin/subscriptions/builders', icon: <FaBuilding />, label: 'Builder Plans' },
        { key: '/admin/subscriptions/property-managers', icon: <HiOutlineBuildingOffice />, label: 'Property Manager Plans' },
      ],
    },
    {
  key: 'payments',
  icon: <FaWallet />,
  label: 'Payments',
  children: [
    { key: '/admin/payments/overview', icon: <FiGrid />, label: 'Payments Dashboard' },
    { key: '/admin/payments/transactions', icon: <FiRefreshCw />, label: 'Transactions' },
    { key: '/admin/payments/customers', icon: <FiUser />, label: 'User / Customer Details' },
    { key: '/admin/payments/property-details', icon: <FiHome />, label: 'Property Payment Details' },
    { key: '/admin/payments/personal-amount', icon: <FaDollarSign />, label: 'Personal Amount Details' },
    { key: '/admin/payments/refunds', icon: <FiDownloadCloud />, label: 'Refund Management' },
    { key: '/admin/payments/reconciliation', icon: <FiCheckCircle />, label: 'Payment Reconciliation' },
    { key: '/admin/payments/commission-revenue', icon: <FiTrendingUp />, label: 'Commission & Revenue' },
    { key: '/admin/payments/manual-payment', icon: <FiEdit />, label: 'Manual Payment' },
    { key: '/admin/payments/reports', icon: <FaChartLine />, label: 'Payment Reports' },
  ],
},
    { key: '/admin/reports', icon: <FaChartLine />, label: 'Reports & Analytics' },
    { key: '/admin/content', icon: <FaImage />, label: 'Content Management' },
    { key: '/admin/notifications', icon: <FaBell />, label: 'Notifications' },
    { key: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

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

  if (location.pathname.startsWith('/admin/super-admin')) {
  return <SuperAdminDashboard />;
}

   if (location.pathname.startsWith('/admin/buyers-tenants')) {
    return <BuyerTenantsDashboard />;
  }

  if (location.pathname.startsWith('/admin/properties')) {
    return <PropertiesDashboard />;
  }

  

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
            <FiHome className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-base tracking-wide">Eliteinova</div>
              <div className="text-[8px] text-white/60 tracking-widest uppercase -mt-0.5">Admin Panel</div>
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
                  <FiGrid className="mr-1 inline" /> Admin
                </span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-700">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right - Dashboard Navigation Links - CORRECTED ACTIVE STATES */}
            <div className="flex items-center gap-2">
              {/* Admin Dashboard - Active only when NOT in super-admin, properties, buyers-tenants */}
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

              {/* Buyers & Tenants Dashboard */}
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

              {/* Properties Dashboard */}
              <button
                onClick={() => navigate('/admin/properties/overview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  location.pathname.includes('properties')
                    ? 'bg-[#00695C] text-white shadow-md shadow-[#00695C]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#00695C]/10 hover:text-[#00695C]'
                }`}
              >
                <FiHome className="text-base" />
                Properties
              </button>

              {/* Super Admin Dashboard - Active only when in super-admin */}
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
            
            <Routes>
              {/* Main overview routes */}
              <Route index element={<AdminOverview />} />
              <Route path="overview" element={<AdminOverview />} />
              {/* <Route path="super-admin" element={<SuperAdmin />} /> */}

              {/* User Management */}
              <Route path="user-management" element={<UserManagement />} />

              {/* Owners */}
              <Route path="owners/overview" element={<OwnersOverview />} />
              <Route path="owners/registration" element={<OwnersRegistration />} />
              <Route path="owners/property-control" element={<OwnersPropertyControl />} />
              <Route path="owners/leads" element={<OwnersPropertiesLeads />} />

              {/* Agents */}
              <Route path="agents/overview" element={<AgentsOverview />} />
              <Route path="agents/registration" element={<AgentsRegistration />} />
              <Route path="agents/verification" element={<AgentsVerification />} />
              <Route path="agents/leads" element={<AgentsPropertiesLeads />} />
              <Route path="agents/property-control" element={<AgentsPropertyControl />} />

              {/* Builders */}
              <Route path="builders/overview" element={<BuildersOverview />} />
              <Route path="builders/registration" element={<BuildersRegistration />} />
              <Route path="builders/verification" element={<BuildersVerification />} />
              <Route path="builders/projects" element={<BuildersProjects />} />
              <Route path="builders/property-control" element={<BuildersPropertyControl />} />
              <Route path="builders/leads" element={<BuildersPropertiesLeads />} />

              {/* Property Managers */}
              <Route path="property-managers/overview" element={<PropertyManagersOverview />} />
              <Route path="property-managers/registration" element={<PropertyManagersRegistration />} />
              <Route path="property-managers/companies" element={<PropertyManagersCompanyManagement />} />
              <Route path="property-managers/maintenance" element={<PropertyManagersMaintenance />} />
              <Route path="property-managers/property-control" element={<PropertyManagersPropertyControl />} />
              <Route path="property-managers/leads" element={<PropertyManagersPropertiesLeads />} />

              {/* Subscriptions */}
              <Route path="subscriptions/overview" element={<SubscriptionsOverview />} />
              <Route path="subscriptions/owners" element={<OwnerPlans />} />
              <Route path="subscriptions/agents" element={<AgentPlans />} />
              <Route path="subscriptions/builders" element={<BuilderPlans />} />
              <Route path="subscriptions/property-managers" element={<PropertyManagerPlans />} />

              {/* Payments */}
                <Route path="payments/overview" element={<PaymentsOverview />} />
                <Route path="payments/transactions" element={<PaymentTransactions />} />
                <Route path="payments/customers" element={<CustomerDetails />} />
                <Route path="payments/property-details" element={<PropertyPaymentDetails />} />
                <Route path="payments/personal-amount" element={<PersonalAmountDetails />} />
                <Route path="payments/refunds" element={<RefundManagement />} />
                <Route path="payments/reconciliation" element={<PaymentReconciliation />} />
                <Route path="payments/commission-revenue" element={<CommissionRevenue />} />
                <Route path="payments/manual-payment" element={<ManualPayment />} />
                <Route path="payments/reports" element={<PaymentReports />} />

               {/* Buyers & Tenants — handled by the early return above, no Route needed here */}

              {/* Properties — handled by the early return above, no Route needed here */}

              {/* Other routes */}
              {/* <Route path="leads" element={<LeadManagement />} /> */}
              {/* <Route path="reports" element={<ReportsAnalytics />} /> */}
              {/* <Route path="content" element={<ContentManagement />} /> */}
              {/* <Route path="notifications" element={<Notifications />} /> */}
              {/* <Route path="settings" element={<Settings />} /> */}
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

export default AdminDashboard;