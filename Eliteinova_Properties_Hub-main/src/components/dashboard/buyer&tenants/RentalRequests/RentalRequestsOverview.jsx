// src/components/dashboard/buyer&tenants/RentalRequests/RentalRequestsOverview.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiClock, FiHome, FiArrowRight, FiRefreshCw, FiCheckCircle,
  FiShield, FiTrendingUp, FiGrid, FiActivity, FiCalendar, FiBarChart2,
  FiPlus, FiPhone, FiBriefcase, FiHeart, FiClipboard, FiMessageCircle,
  FiCalendar as FiCalendarIcon, FiFileText, FiSend, FiThumbsUp,
  FiThumbsDown, FiArchive, FiClipboard as FiClipboardIcon, FiSearch,
} from 'react-icons/fi';
import {
  FaWallet, FaFileSignature, FaUserFriends, FaStar as FaStarSolid,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

// ============================================================
// STAT CARD - Enhanced with Glassmorphism & Elegant Design (compact)
// ============================================================
const StatCard = ({ icon, title, value, subtitle, color, gradient, borderColor, delay = 0, statsAnimating, onClick, trend, trendValue }) => (
  <div
    className={`relative bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg hover:shadow-2xl transition-all duration-500 border ${borderColor} group cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] ${statsAnimating ? 'animate-pulse-once' : ''} overflow-hidden`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#00695C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00695C]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{title}</p>
          {trend && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}%
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00695C] transition-colors duration-300">
          {typeof value === 'string' ? value : value.toLocaleString()}
        </h3>
        {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} ${gradient} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg group-hover:shadow-xl relative`}>
        <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-glow" />
        {icon}
      </div>
    </div>

    <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-1000 group-hover:opacity-80" style={{ width: `${Math.min(100, 60 + Math.random() * 30)}%` }} />
    </div>

    <div className="mt-2 flex items-center justify-between">
      <span className="text-[10px] text-gray-500 flex items-center gap-1">
        <FiArrowRight className="text-[9px]" />
        Click to view details
      </span>
      <FiArrowRight className="text-[#00695C] text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300" />
    </div>
  </div>
);

// ============================================================
// NAV CARD - Elegant Glassmorphism with Hover Effects (compact)
// Now supports up to 5 stats (wraps to 2 rows on a 3-col grid)
// ============================================================
const NavCard = ({ icon, title, description, stats, color, gradient, borderColor, delay = 0, onClick, badge, badgeColor, featured }) => (
  <button
    onClick={onClick}
    className={`relative text-left bg-white/90 backdrop-blur-xl rounded-2xl border ${borderColor} p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden w-full ${featured ? 'ring-2 ring-[#00695C]/30 ring-offset-2' : ''}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 via-transparent to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00695C]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#26A69A]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 delay-200" />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

    <div className="relative">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${color} ${gradient} flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}>
          <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-glow" />
          {icon}
          {featured && (
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <FaStarSolid className="text-white text-[6px]" />
              </div>
            </div>
          )}
        </div>
        {badge && (
          <span className={`px-3 py-1 ${badgeColor} text-white text-[11px] font-bold rounded-full shadow-lg animate-pulse-glow`}>
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#00695C] transition-colors duration-300 flex items-center gap-2">
        {title}
        {featured && <MdVerified className="text-[#00695C] text-sm" />}
      </h3>
      <p className="text-xs text-gray-600 mt-1 leading-snug line-clamp-2">{description}</p>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 mt-2 pt-2 border-t border-gray-100">
          {stats.map((s, i) => (
            <div key={i} className="text-center group/stat">
              <p className="text-sm font-bold text-gray-900 group-hover/stat:text-[#00695C] transition-colors">
                {typeof s.value === 'string' ? s.value : s.value.toLocaleString()}
              </p>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-[#00695C] group-hover:gap-3 transition-all duration-300">
        <span className="bg-[#00695C]/10 px-3 py-1 rounded-full group-hover:bg-[#00695C]/20 transition-colors group-hover:scale-105">
          Open Module →
        </span>
      </div>
    </div>
  </button>
);

// ============================================================
// ACTIVITY ITEM - Elegant with Timeline
// ============================================================
const ActivityItem = ({ icon, title, time, description, color, gradient, index, isLast }) => (
  <div className="relative">
    {!isLast && (
      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-[#00695C]/20 to-transparent" />
    )}
    <div
      className={`flex items-start gap-4 p-3 rounded-xl hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100/80 group cursor-pointer animate-slide-in hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent relative`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`w-10 h-10 rounded-xl ${color} ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative flex-shrink-0`}>
        <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-glow" />
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#00695C] transition-colors truncate">
            {title}
          </p>
          <span className="text-[11px] text-gray-500 group-hover:text-[#00695C] transition-colors whitespace-nowrap">
            {time}
          </span>
        </div>
        <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors line-clamp-1">
          {description}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0">
        <FiArrowRight className="text-[#00695C] text-sm" />
      </div>
    </div>
  </div>
);

// ============================================================
// TITLE BADGE - Elegant Section Header
// ============================================================
const SectionHeader = ({ icon, title, subtitle, action, actionLabel, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-xl shadow-md animate-pulse-glow">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
      </div>
    </div>
    {action && (
      <button
        onClick={onAction}
        className="text-xs text-[#00695C] font-semibold hover:text-[#004D40] transition-all duration-300 flex items-center gap-1 group"
      >
        <span className="bg-[#00695C]/10 px-3 py-1 rounded-full group-hover:bg-[#00695C]/20 transition-colors">
          {actionLabel || 'View All'}
        </span>
        <FiArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
      </button>
    )}
  </div>
);

// ============================================================
// QUICK STATS - Mini Stats Bar
// ============================================================
const QuickStat = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:border-[#00695C]/30">
    <span className={color}>{icon}</span>
    <span className="text-[11px] text-gray-600 group-hover:text-gray-800 transition-colors">{label}</span>
    <span className="text-[11px] font-bold text-gray-900 group-hover:text-[#00695C] transition-colors">{value}</span>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
const RentalRequestsOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [time, setTime] = useState(new Date());

  // ---- Stats ----
   const [stats, setStats] = useState({
    // Rental Request Management Stats
    totalRequests: 612,
    newRequests: 84,
    pendingRequests: 156,
    approvedRequests: 268,
    rejectedRequests: 62,
    closedRequests: 42,

    // Request Status Pipeline Counts
    statusCounts: {
      new: 84,
      contacted: 97,
      shortlisted: 73,
      siteVisit: 58,
      applicationSubmitted: 49,
      ownerReview: 41,
      approved: 268,
      rejected: 62,
      agreement: 38,
      rented: 176,
      closed: 42,
    },

    // Request Detail Aggregates
    totalTenants: 598,
    totalProperties: 431,
    avgMonthlyRent: 26500,
    avgSecurityDeposit: 79500,
    avgOccupants: 3,
    familyRequests: 402,
    bachelorRequests: 210,
    furnishedRequests: 310,       
    employmentVerified: 289,       

    // Growth & Metrics
    growthRate: 9.4,
    monthlyGrowth: 6.2,
    conversionRate: 43.8,
  });
  // ---- Recent Activities ----
  // const activities = useMemo(() => [
  //   {
  //     icon: <FiSend className="text-white text-sm" />,
  //     title: 'New Rental Request',
  //     time: '6 min ago',
  //     description: 'Priya Sharma submitted a request for a 2BHK in Indiranagar',
  //     color: 'bg-gradient-to-br',
  //     gradient: 'from-[#00695C] to-[#26A69A]'
  //   },
  //   {
  //     icon: <FiPhone className="text-white text-sm" />,
  //     title: 'Tenant Contacted',
  //     time: '19 min ago',
  //     description: 'Vikram Singh was contacted regarding a Koramangala apartment',
  //     color: 'bg-gradient-to-br',
  //     gradient: 'from-indigo-500 to-indigo-400'
  //   },
  //   {
  //     icon: <FiCalendarIcon className="text-white text-sm" />,
  //     title: 'Site Visit Scheduled',
  //     time: '34 min ago',
  //     description: 'Rohit Mehra booked a site visit for a Villa in Whitefield',
  //     color: 'bg-gradient-to-br',
  //     gradient: 'from-amber-500 to-amber-400'
  //   },
  //   {
  //     icon: <FiFileText className="text-white text-sm" />,
  //     title: 'Application Submitted',
  //     time: '52 min ago',
  //     description: 'Neha Patel submitted her rental application for HSR Layout',
  //     color: 'bg-gradient-to-br',
  //     gradient: 'from-blue-500 to-blue-400'
  //   },
  //   {
  //     icon: <FiThumbsUp className="text-white text-sm" />,
  //     title: 'Request Approved',
  //     time: '1 hour ago',
  //     description: 'Owner approved Neha Patel\'s rental request',
  //     color: 'bg-gradient-to-br',
  //     gradient: 'from-emerald-500 to-emerald-400'
  //   },
  //   {
  //     icon: <FaFileSignature className="text-white text-sm" />,
  //     title: 'Agreement Initiated',
  //     time: '2 hours ago',
  //     description: 'Rental agreement drafted for Anjali Nair\'s 3BHK request',
  //     color: 'bg-gradient-to-br',
  //     gradient: 'from-purple-500 to-purple-400'
  //   }
  // ], []);

  // ---- Quick Stats ----
  const quickStats = useMemo(() => [
    { icon: <FiSend className="text-[#00695C]" />, label: 'New Requests', value: stats.newRequests },
    { icon: <FiClock className="text-amber-500" />, label: 'Pending', value: stats.pendingRequests },
    { icon: <FiCheckCircle className="text-emerald-500" />, label: 'Conversion', value: `${stats.conversionRate}%` },
    { icon: <FiTrendingUp className="text-blue-500" />, label: 'Growth', value: `${stats.monthlyGrowth}%` },
  ], [stats]);

  useEffect(() => {
    setStatsAnimating(true);
    const t = setTimeout(() => setStatsAnimating(false), 1000);
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => {
      clearTimeout(t);
      clearInterval(timer);
    };
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setStatsAnimating(true);
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 4),
        newRequests: prev.newRequests + Math.floor(Math.random() * 3),
        pendingRequests: Math.max(0, prev.pendingRequests + Math.floor(Math.random() * 6) - 3),
        approvedRequests: prev.approvedRequests + Math.floor(Math.random() * 3),
        rejectedRequests: Math.max(0, prev.rejectedRequests + Math.floor(Math.random() * 3) - 1),
        closedRequests: prev.closedRequests + Math.floor(Math.random() * 2),

        statusCounts: {
          ...prev.statusCounts,
          new: prev.statusCounts.new + Math.floor(Math.random() * 3),
          contacted: prev.statusCounts.contacted + Math.floor(Math.random() * 3),
          shortlisted: prev.statusCounts.shortlisted + Math.floor(Math.random() * 2),
          siteVisit: prev.statusCounts.siteVisit + Math.floor(Math.random() * 2),
          applicationSubmitted: prev.statusCounts.applicationSubmitted + Math.floor(Math.random() * 2),
          ownerReview: prev.statusCounts.ownerReview + Math.floor(Math.random() * 2),
          approved: prev.statusCounts.approved + Math.floor(Math.random() * 3),
          rented: prev.statusCounts.rented + Math.floor(Math.random() * 2),
        },

        avgMonthlyRent: prev.avgMonthlyRent + Math.floor(Math.random() * 1000) - 500,
        avgSecurityDeposit: prev.avgSecurityDeposit + Math.floor(Math.random() * 2000) - 1000,
        monthlyGrowth: prev.monthlyGrowth + (Math.random() * 2 - 1),
        conversionRate: Math.min(100, Math.max(0, prev.conversionRate + (Math.random() * 2 - 1))),
      }));
      setLoading(false);
      setStatsAnimating(false);
    }, 900);
  }, []);

  const navigateTo = useCallback((route) => {
    navigate(route);
  }, [navigate]);

  // ---- Base route for this module (matches BuyerTenantsDashboard.jsx routes) ----
  const BASE = '/admin/buyers-tenants/rental';

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] min-h-screen relative">
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* ===== HEADER ===== */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2.5 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-2xl shadow-lg animate-pulse-glow relative">
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
              <FiFileText className="text-white text-xl relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Rental Requests
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                <span>Track and manage every rental request end-to-end</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block" />
                <span className="text-[#00695C] font-medium">
                  {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="flex-shrink-0">
                  <QuickStat {...stat} />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-[#00695C]/20 hover:border-[#00695C]/40 transition-all duration-300 whitespace-nowrap">
                <FiActivity className="text-[#00695C] animate-pulse text-sm" />
                <span className="font-medium text-[#00695C]">Live</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span className="text-gray-500">
                  {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 group relative overflow-hidden hover:scale-105 whitespace-nowrap"
              >
                <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
                <StatCard
          icon={<FiFileText className="text-lg text-white" />}
          title="Total Requests"
          value={stats.totalRequests}
          subtitle={`${stats.newRequests} new requests`}
          color="bg-gradient-to-br"
          gradient="from-[#00695C] to-[#26A69A]"
          borderColor="border-[#00695C]/30"
          delay={0}
          statsAnimating={statsAnimating}
          onClick={() => navigateTo(`${BASE}/management`)}
          trend="up"
          trendValue={stats.growthRate}
        />
        <StatCard
          icon={<FiHome className="text-lg text-white" />}
          title="Furnishing Requirement"
          value={stats.furnishedRequests}
          subtitle="Fully & semi furnished"
          color="bg-gradient-to-br"
          gradient="from-amber-600 to-amber-400"
          borderColor="border-amber-600/30"
          delay={100}
          statsAnimating={statsAnimating}
          onClick={() => navigateTo(`${BASE}/details`)}
          trend="up"
          trendValue={stats.monthlyGrowth.toFixed(1)}
        />
        <StatCard
          icon={<FiBriefcase className="text-lg text-white" />}
          title="Employment Details"
          value={stats.employmentVerified}
          subtitle="Verified employment records"
          color="bg-gradient-to-br"
          gradient="from-emerald-600 to-emerald-400"
          borderColor="border-emerald-600/30"
          delay={200}
          statsAnimating={statsAnimating}
          onClick={() => navigateTo(`${BASE}/details`)}
          trend="up"
          trendValue="8.3"
        />
        <StatCard
          icon={<FiHeart className="text-lg text-white" />}
          title="Property Shortlisted"
          value={stats.statusCounts.shortlisted}
          subtitle="Tenant-shortlisted properties"
          color="bg-gradient-to-br"
          gradient="from-red-600 to-red-400"
          borderColor="border-red-600/30"
          delay={300}
          statsAnimating={statsAnimating}
          onClick={() => navigateTo(`${BASE}/status`)}
          trend="down"
          trendValue="2.1"
        />
        <StatCard
          icon={<FiFileText className="text-lg text-white" />}
          title="Application Submitted"
          value={stats.statusCounts.applicationSubmitted}
          subtitle="Applications in progress"
          color="bg-gradient-to-br"
          gradient="from-purple-600 to-purple-400"
          borderColor="border-purple-600/30"
          delay={400}
          statsAnimating={statsAnimating}
          onClick={() => navigateTo(`${BASE}/status`)}
          trend="up"
          trendValue="5.9"
        />
      </div>

      {/* ===== NAVIGATION MODULES ===== */}
      <div>
        <SectionHeader
          icon={<FiShield className="text-white text-sm" />}
          title="Rental Request Modules"
          subtitle="Manage requests, details, and lifecycle status"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: Rental Request Management */}
          <NavCard
            icon={<FiFileText className="text-white text-xl" />}
            title="Rental Request Management"
            description="View all rental requests filtered by New, Pending, Approved, Rejected & Closed status."
            color="bg-gradient-to-br"
            gradient="from-[#00695C] to-[#26A69A]"
            borderColor="border-[#00695C]/30"
            delay={0}
            onClick={() => navigateTo(`${BASE}/management`)}
            badge={`${stats.newRequests} New`}
            badgeColor="bg-gradient-to-r from-blue-500 to-blue-400"
            featured={true}
            stats={[
              { label: 'All', value: stats.totalRequests },
              { label: 'New', value: stats.newRequests },
              { label: 'Pending', value: stats.pendingRequests },
              { label: 'Approved', value: stats.approvedRequests },
              { label: 'Rejected', value: stats.rejectedRequests },
            ]}
          />

          {/* Module 2: Rental Request Details */}
          <NavCard
            icon={<FiClipboard className="text-white text-xl" />}
            title="Rental Request Details"
            description="Tenant, property, rent, deposit, move-in date, duration, furnishing, occupants, employment & remarks."
            color="bg-gradient-to-br"
            gradient="from-orange-600 to-orange-400"
            borderColor="border-orange-600/30"
            delay={100}
            onClick={() => navigateTo(`${BASE}/details`)}
            badge="Full Profile"
            badgeColor="bg-gradient-to-r from-orange-500 to-orange-400"
            stats={[
              { label: 'Tenants', value: stats.totalTenants },
              { label: 'Properties', value: stats.totalProperties },
              { label: 'Monthly Rent', value: `₹${(stats.avgMonthlyRent / 1000).toFixed(0)}K` },
              { label: 'Deposit', value: `₹${(stats.avgSecurityDeposit / 1000).toFixed(0)}K` },
              { label: 'Occupants', value: stats.avgOccupants },
            ]}
          />

          {/* Module 3: Request Status */}
          <NavCard
            icon={<FiBarChart2 className="text-white text-xl" />}
            title="Request Status"
            description="Follow requests through New, Contacted, Shortlisted, Site Visit, Application, Review, Approval, Agreement & Rented."
            color="bg-gradient-to-br"
            gradient="from-purple-600 to-purple-400"
            borderColor="border-purple-600/30"
            delay={200}
            onClick={() => navigateTo(`${BASE}/status`)}
            badge={`${stats.statusCounts.rented} Rented`}
            badgeColor="bg-gradient-to-r from-purple-500 to-purple-400"
            stats={[
              { label: 'New', value: stats.statusCounts.new },
              { label: 'Site Visit', value: stats.statusCounts.siteVisit },
              { label: 'Applied', value: stats.statusCounts.applicationSubmitted },
              { label: 'Approved', value: stats.statusCounts.approved },
              { label: 'Rented', value: stats.statusCounts.rented },
            ]}
          />
        </div>
      </div>

      {/* ===== RECENT ACTIVITIES ===== */}
      {/* <div>
        <SectionHeader
          icon={<FiActivity className="text-white text-sm" />}
          title="Recent Activities"
          subtitle="Live updates from rental request engagement"
          action={true}
          actionLabel="View All"
          onAction={() => navigateTo(`${BASE}/status`)}
        />

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-4 hover:shadow-xl transition-all duration-300 hover:border-[#00695C]/20">
          {activities.map((activity, index) => (
            <ActivityItem
              key={index}
              icon={activity.icon}
              title={activity.title}
              time={activity.time}
              description={activity.description}
              color={activity.color}
              gradient={activity.gradient}
              index={index}
              isLast={index === activities.length - 1}
            />
          ))}
        </div>
      </div> */}

      {/* ===== FOOTER ===== */}
      <div className="text-center pt-4">
        <p className="text-[11px] text-gray-500 flex items-center justify-center gap-2">
          <span className="w-4 h-0.5 bg-gray-300 rounded-full" />
          <span>© 2026 Rental Requests • All rights reserved</span>
          <span className="w-4 h-0.5 bg-gray-300 rounded-full" />
        </p>
      </div>

      {/* ===== CSS ANIMATIONS ===== */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-25px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(15px) scale(1.02); }
        }
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-pulse-once { animation: pulse-once 0.8s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
        .animate-breathe { animation: breathe 3s ease-in-out infinite; }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #00695C, #26A69A); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #00695C; }

        ::selection { background: #00695C; color: white; }
      `}</style>
    </div>
  );
};

export default RentalRequestsOverview;