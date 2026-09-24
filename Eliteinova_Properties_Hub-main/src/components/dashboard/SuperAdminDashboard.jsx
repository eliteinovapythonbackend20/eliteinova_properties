// src/components/dashboard/SuperAdminDashboard.jsx

import React, { useState } from 'react';

// ===== REACT ICONS IMPORTS =====
import {
  FiGrid, FiUser, FiHome, FiUsers, FiCreditCard,
  FiLayers, FiVolume2, FiUserCheck, FiMapPin, FiTarget, FiDollarSign,
  FiBarChart2, FiBell, FiLock, FiActivity, FiSettings, FiFileText,
} from 'react-icons/fi';

import { FaBars, FaCrown } from 'react-icons/fa';
import { HiOutlineUserGroup } from 'react-icons/hi2';

// ============ IMPORT ALL COMPONENTS ============
// Overview
import SuperAdminOverview from './superadmin/SuperAdminOverview';


import UserManagement from './superadmin/UserManagement';
// import CustomerManagement from './superadmin/CustomerManagement';
// import RolePermissions from './superadmin/Role&Permissions';
// import PropertyManagement from './superadmin/PropertyManagement';
// import ProjectManagement from './superadmin/ProjectManagement';
// import LeadManagement from './superadmin/LeadManagement';
// import SubscriptionManagement from './superadmin/SubscriptionManagement';
// import PaymentsManagement from './superadmin/PaymentsManagement';
// import AdvertisementsManagement from './superadmin/AdvertisementsManagement';
// import KYCVerificationManagement from './superadmin/KYC&VerificationManagement';
// import LocationManagement from './superadmin/LocationManagement';
// import ReportsAnalyticsManagement from './superadmin/Reports&AnalyticsManagement';
// import Notifications from './superadmin/Notifications';
// import ActivityLogs from './superadmin/ActivityLogs';
// import ContentManagement from './superadmin/ContentManagement';
// import Settings from './superadmin/Settings';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// ============ MENU (flat - all pages listed directly) ============
const menuItems = [
  { key: '/admin/super-admin/overview', icon: <FiGrid />, label: 'Dashboard Overview' },
  { key: '/admin/super-admin/users', icon: <FiUsers />, label: 'User Management' },
  { key: '/admin/super-admin/customers', icon: <FiUser />, label: 'Customer Management' },
  { key: '/admin/super-admin/properties', icon: <FiHome />, label: 'Property Management' },
  { key: '/admin/super-admin/subscriptions', icon: <FiCreditCard />, label: 'Subscription Management' },
  { key: '/admin/super-admin/projects', icon: <FiLayers />, label: 'Project Management' },
  { key: '/admin/super-admin/advertisements', icon: <FiVolume2 />, label: 'Advertisements' },
  { key: '/admin/super-admin/kyc', icon: <FiUserCheck />, label: 'KYC & Verification' },
  { key: '/admin/super-admin/locations', icon: <FiMapPin />, label: 'Location Management' },
  { key: '/admin/super-admin/leads', icon: <FiTarget />, label: 'Lead Management' },
  { key: '/admin/super-admin/payments', icon: <FiDollarSign />, label: 'Payments' },
  { key: '/admin/super-admin/reports', icon: <FiBarChart2 />, label: 'Reports & Analytics' },
  { key: '/admin/super-admin/notifications', icon: <FiBell />, label: 'Notifications' },
  { key: '/admin/super-admin/roles', icon: <FiLock />, label: 'Roles & Permissions' },
  { key: '/admin/super-admin/activity-logs', icon: <FiActivity />, label: 'Activity Logs' },
  { key: '/admin/super-admin/settings', icon: <FiSettings />, label: 'Settings' },
  { key: '/admin/super-admin/content', icon: <FiFileText />, label: 'Content Management' },
];

const SuperAdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const page = menuItems.find((p) => p.key === location.pathname);
    return page ? page.label : 'Overview';
  };

  // Helper function to check if current path is Admin Dashboard
  const isAdminDashboard = () => {
    const path = location.pathname;
    if (path.includes('buyers-tenants') || path.includes('properties') || path.includes('super-admin')) {
      return false;
    }
    return path === '/admin' || path === '/admin/' || path === '/admin/overview' ||
      (path.startsWith('/admin/') && !path.includes('buyers-tenants') && !path.includes('properties') && !path.includes('super-admin'));
  };

  // Helper function to check if current path is Buyers & Tenants Dashboard
  const isBuyersTenantsDashboard = () => location.pathname.includes('buyers-tenants');

  // Only the Properties *dashboard*, not /admin/super-admin/properties
  const isPropertiesDashboard = () => location.pathname.startsWith('/admin/properties');

  // Helper function to check if current path is Super Admin
  const isSuperAdmin = () => location.pathname.includes('super-admin');

  const renderMenuItem = (item) => {
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
            <FaCrown className="text-white text-lg" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-base tracking-wide">Eliteinova</div>
              <div className="text-[8px] text-white/60 tracking-widest uppercase -mt-0.5">Super Admin</div>
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
                  <FaCrown className="mr-1 inline" /> Super Admin
                </span>
                <span className="text-gray-300">/</span>
                <span className="font-medium text-gray-700">{getPageTitle()}</span>
              </div>
            </div>

            {/* Right - Dashboard Navigation Links */}
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

              {/* Buyers & Tenants Dashboard */}
              <button
                onClick={() => navigate('/admin/buyers-tenants/overview')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isBuyersTenantsDashboard()
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
                  isPropertiesDashboard()
                    ? 'bg-[#00695C] text-white shadow-md shadow-[#00695C]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#00695C]/10 hover:text-[#00695C]'
                }`}
              >
                <FiHome className="text-base" />
                Properties
              </button>

              {/* Super Admin Dashboard - Active */}
              <button
                onClick={() => navigate('/admin/super-admin/overview')}
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

            <div className="relative">
              <Routes location={{ ...location, pathname: location.pathname.replace(/^\/admin\/super-admin/, '/admin') || '/admin' }}>
                {/* Overview */}
                <Route index element={<SuperAdminOverview />} />
                <Route path="overview" element={<SuperAdminOverview />} />

                <Route path="users" element={<UserManagement />} />
                {/* <Route path="customers" element={<CustomerManagement />} /> */}
                {/* <Route path="roles" element={<RolePermissions />} /> */}
                {/* <Route path="properties" element={<PropertyManagement />} /> */}
                {/* <Route path="projects" element={<ProjectManagement />} /> */}
                {/* <Route path="leads" element={<LeadManagement />} /> */}
                {/* <Route path="subscriptions" element={<SubscriptionManagement />} /> */}
                {/* <Route path="payments" element={<PaymentsManagement />} /> */}
                {/* <Route path="advertisements" element={<AdvertisementsManagement />} /> */}
                {/* <Route path="kyc" element={<KYCVerificationManagement />} /> */}
                {/* <Route path="locations" element={<LocationManagement />} /> */}
                {/* <Route path="reports" element={<ReportsAnalyticsManagement />} /> */}
                {/* <Route path="notifications" element={<Notifications />} /> */}
                {/* <Route path="activity-logs" element={<ActivityLogs />} /> */}
                {/* <Route path="content" element={<ContentManagement />} /> */}
                {/* <Route path="settings" element={<Settings />} /> */}
              </Routes>
            </div>
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
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 20px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }

        /* Content Scrollbar Styles */
        .content-scroll::-webkit-scrollbar { width: 6px; }
        .content-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .content-scroll::-webkit-scrollbar-thumb { background: #c1c7cd; border-radius: 10px; }
        .content-scroll::-webkit-scrollbar-thumb:hover { background: #a0a7ae; }
        .content-scroll { scrollbar-width: thin; scrollbar-color: #c1c7cd #f1f1f1; }

        @media (max-width: 768px) {
          aside { transform: translateX(${collapsed ? '-100%' : '0'}); }
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;