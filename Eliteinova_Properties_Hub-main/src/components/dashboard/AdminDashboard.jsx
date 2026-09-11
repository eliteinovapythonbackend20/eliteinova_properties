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
  FiCheckCircle, FiXCircle, FiTrendingUp, FiArrowUp, FiArrowDown
} from 'react-icons/fi';

import { 
  FaBuilding, FaShoppingBag, 
  FaDollarSign, FaFileAlt, FaUserTie, FaUserCheck, FaUserCog,
  FaProjectDiagram, FaTools, FaShieldAlt, FaImage, FaBell,
  FaChartLine, FaWallet, FaBars, FaSun, FaMoon, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaWhatsapp, FaCopy as FaCopyIcon, FaShareAlt, FaQrcode,
  FaCloudUploadAlt, FaCloudDownloadAlt, FaShieldAlt as FaSafety,
  FaEye, FaEyeSlash
} from 'react-icons/fa';

import { MdOutlineDashboard, MdOutlineRealEstateAgent, MdOutlineApartment, MdOutlineBusiness } from 'react-icons/md';
import { BsBuilding, BsTools } from 'react-icons/bs';
import { HiOutlineBuildingOffice, HiOutlineUserGroup } from 'react-icons/hi2';

// ============ IMPORT ALL COMPONENTS ============
import AdminOverview from './admin/AdminOverview';
import UserManagement from './admin/UserManagement'; 

// Owners
// import Owners from './admin/Owners/Owners';
import OwnersOverview from './admin/Owners/OwnersOverview';
import OwnersRegistration from './admin/Owners/OwnersRegistration';
import OwnersPropertyControl from './admin/Owners/OwnersPropertyControl';
import OwnersSubscription from './admin/Owners/OwnersSubscription';
import OwnersPropertiesLeads from './admin/Owners/OwnersPropertiesLeads';

// Agents
import AgentsOverview from './admin/Agents/AgentsOverview';
import AgentsRegistration from './admin/Agents/AgentsRegistration';
import AgentsVerification from './admin/Agents/AgentsVerification';
import AgentsPropertiesLeads from './admin/Agents/AgentsPropertiesLeads';
import AgentsPropertyControl from './admin/Agents/AgentsPropertyControl';

// Builders
import BuildersOverview from './admin/Builders/BuildersOverview';
// import BuildersRegistration from './admin/Builders/BuildersRegistration';
// import BuildersVerification from './admin/Builders/BuildersVerification';
// import BuildersProjects from './admin/Builders/BuildersProjects';
// import BuildersPropertyControl from './admin/Builders/BuildersPropertyControl';

// Property Managers
// import PropertyManagersOverview from './admin/PropertyManagers/PropertyManagersOverview';
// import PropertyManagersRegistration from './admin/PropertyManagers/PropertyManagersRegistration';
// import PropertyManagersCompanyManagement from './admin/PropertyManagers/PropertyManagersCompanyManagement';
// import PropertyManagersMaintenance from './admin/PropertyManagers/PropertyManagersMaintenance';
// import PropertyManagersPropertyControl from './admin/PropertyManagers/PropertyManagersPropertyControl';

// Buyers & Tenants
// import BuyersTenants from './admin/BuyersTenants';

// Properties - All property types
// import Properties from './admin/Properties/Properties';
// import PropertiesOverview from './admin/Properties/PropertiesOverview';
// import Individual from './admin/Properties/Individual';
// import Commercial from './admin/Properties/Commercial';
// import Apartment from './admin/Properties/Apartment';
// import LandAndPlots from './admin/Properties/LandAndPlots';
// import HostelAndPg from './admin/Properties/HostelAndPg';

// Other modules
// import LeadManagement from './admin/LeadManagement';
// import Subscriptions from './admin/Subscriptions';
// import Payments from './admin/Payments';
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

  const menuItems = [
    { key: '/admin/overview', icon: <FiGrid />, label: 'Dashboard Overview' },
    { key: '/admin/user-management', icon: <FiUser />, label: 'User Management' },
    {
      key: 'owners',
      icon: <FiUser />,
      label: 'Owners',
      children: [
        { key: '/admin/owners/overview', icon: <FiGrid />, label: 'Owners Dashboard' },
        { key: '/admin/owners/registration', icon: <FiCheckCircle />, label: 'Registration & KYC' },
        { key: '/admin/owners/property-control', icon: <FiSettings />, label: 'Property Control' },
        { key: '/admin/owners/subscription', icon: <FaDollarSign />, label: 'Subscription' },
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
      ],
    },
    { key: '/admin/buyers-tenants', icon: <HiOutlineUserGroup />, label: 'Buyers & Tenants' },
    {
      key: 'properties',
      icon: <FiHome />,
      label: 'Properties',
      children: [
        { key: '/admin/properties/overview', icon: <FiGrid />, label: 'Properties Overview' },
        { key: '/admin/properties/individual', icon: <FiHome />, label: 'Individual' },
        { key: '/admin/properties/commercial', icon: <FaShoppingBag />, label: 'Commercial' },
        { key: '/admin/properties/apartment', icon: <MdOutlineApartment />, label: 'Apartment' },
        { key: '/admin/properties/land-plots', icon: <FiMapPin />, label: 'Land & Plots' },
        { key: '/admin/properties/hostel-pg', icon: <MdOutlineApartment />, label: 'Hostel & PG' },
      ],
    },
    { key: '/admin/leads', icon: <FiMessageCircle />, label: 'Lead Management' },
    { key: '/admin/subscriptions', icon: <FaDollarSign />, label: 'Subscriptions' },
    { key: '/admin/payments', icon: <FaWallet />, label: 'Payments' },
    { key: '/admin/reports', icon: <FaChartLine />, label: 'Reports & Analytics' },
    { key: '/admin/content', icon: <FaImage />, label: 'Content Management' },
    { key: '/admin/notifications', icon: <FaBell />, label: 'Notifications' },
    { key: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const isSubActive = (children) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.key);
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
          <div className="flex items-center justify-between px-4 h-12">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-8 h-8 rounded-xl bg-[#00695C]/5 text-[#00695C] hover:bg-[#00695C]/10 hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <FaBars className="text-sm" />
              </button>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#00695C] font-medium">
                  <FiGrid className="mr-1 inline" /> Admin
                </span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-700">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              {/* Time */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00695C]/5 text-[#00695C] text-xs font-medium">
                <FaClock className="text-xs" />
                <span>{formatTime(currentTime)}</span>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-2.5 py-1 border border-gray-200 focus-within:border-[#00695C] focus-within:ring-2 focus-within:ring-[#00695C]/20 transition-all duration-300">
                <FiSearch className="text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-32 px-2 text-gray-700"
                />
              </div>

              {/* Dark Mode */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-8 h-8 rounded-xl hover:bg-[#00695C]/5 hover:scale-105 transition-all duration-300 flex items-center justify-center text-[#00695C]"
              >
                {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="w-8 h-8 rounded-xl hover:bg-[#00695C]/5 hover:scale-105 transition-all duration-300 flex items-center justify-center text-gray-600">
                  <FiBell className="text-sm" />
                </button>
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00695C] text-white text-[8px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-[#00695C]/30">
                  5
                </span>
              </div>

              {/* User */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-[#00695C]/5 transition-all duration-300 border-2 border-transparent hover:border-[#26A69A]/30">
                  <div className="w-7 h-7 rounded-full bg-[#00695C] flex items-center justify-center text-white font-bold border-2 border-[#26A69A] shadow-lg shadow-[#00695C]/20">
                    <FiUser className="text-xs" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-gray-700">Super Admin</div>
                    <div className="text-[8px] text-gray-400">Online</div>
                  </div>
                  <FiChevronDown className="text-[10px] text-gray-400 hidden sm:block" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:scale-100 scale-95">
                  <div className="p-3 border-b border-gray-100">
                    <div className="font-semibold text-gray-700">Super Admin</div>
                    <div className="text-xs text-gray-400">admin@eliteinova.com</div>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00695C]/5 transition-all duration-300 text-sm text-gray-600">
                      <FiUser /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00695C]/5 transition-all duration-300 text-sm text-gray-600">
                      <FiSettings /> Settings
                    </button>
                  </div>
                  <div className="border-t border-gray-100 p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 text-sm text-red-500">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              </div>
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

              {/* User Management */}
              <Route path="user-management" element={<UserManagement />} />

              {/* Owners */}
              {/* <Route path="owners" element={<Owners />} /> */}
              <Route path="owners/overview" element={<OwnersOverview />} />
              <Route path="owners/registration" element={<OwnersRegistration />} />
              <Route path="owners/property-control" element={<OwnersPropertyControl />} />
              <Route path="owners/subscription" element={<OwnersSubscription />} />
              <Route path="owners/leads" element={<OwnersPropertiesLeads />} />

              {/* Agents */}
              <Route path="agents/overview" element={<AgentsOverview />} />
              <Route path="agents/registration" element={<AgentsRegistration />} />
              <Route path="agents/verification" element={<AgentsVerification />} />
              <Route path="agents/leads" element={<AgentsPropertiesLeads />} />
              <Route path="agents/property-control" element={<AgentsPropertyControl />} />

              {/* Builders */}
              <Route path="builders/overview" element={<BuildersOverview />} />
              {/* <Route path="builders/registration" element={<BuildersRegistration />} /> */}
              {/* <Route path="builders/verification" element={<BuildersVerification />} /> */}
              {/* <Route path="builders/projects" element={<BuildersProjects />} /> */}
              {/* <Route path="builders/property-control" element={<BuildersPropertyControl />} /> */}

              {/* Property Managers */}
              {/* <Route path="property-managers/overview" element={<PropertyManagersOverview />} />
              <Route path="property-managers/registration" element={<PropertyManagersRegistration />} />
              <Route path="property-managers/companies" element={<PropertyManagersCompanyManagement />} />
              <Route path="property-managers/maintenance" element={<PropertyManagersMaintenance />} />
              <Route path="property-managers/property-control" element={<PropertyManagersPropertyControl />} /> */}

              {/* Buyers & Tenants */}
              {/* <Route path="buyers-tenants" element={<BuyersTenants />} /> */}

              {/* Properties - All property types */}
              {/* <Route path="properties" element={<Properties />} />
              <Route path="properties/overview" element={<PropertiesOverview />} />
              <Route path="properties/individual" element={<Individual />} />
              <Route path="properties/commercial" element={<Commercial />} />
              <Route path="properties/apartment" element={<Apartment />} />
              <Route path="properties/land-plots" element={<LandAndPlots />} />
              <Route path="properties/hostel-pg" element={<HostelAndPg />} /> */}

              {/* Other routes */}
              {/* <Route path="leads" element={<LeadManagement />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="payments" element={<Payments />} />
              <Route path="reports" element={<ReportsAnalytics />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} /> */}
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