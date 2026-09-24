// src/components/dashboard/superadmin/SuperAdminOverview.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiHome, FiCreditCard, FiLayers, FiVolume2,
  FiUserCheck, FiMapPin, FiTarget, FiDollarSign, FiBarChart2, FiBell,
  FiLock, FiActivity, FiSettings, FiFileText,
  FiArrowUpRight, FiTrendingUp, FiTrendingDown, FiRefreshCw,
} from 'react-icons/fi';

const BASE = '/admin/super-admin';

/* ============ STATS DATA ============ */
const initialStats = [
  { id: 'users', label: 'Total Users', value: 1248, sub: '38 new this week', trend: 6.2, path: `${BASE}/users`, icon: FiUsers, color: '#00695C', gradient: 'from-[#00695C] to-[#26A69A]' },
  { id: 'customers', label: 'Customers', value: 8420, sub: '214 active today', trend: 4.8, path: `${BASE}/customers`, icon: FiUser, color: '#0288D1', gradient: 'from-[#0288D1] to-[#4FC3F7]' },
  { id: 'properties', label: 'Properties', value: 3562, sub: '86 awaiting approval', trend: 3.1, path: `${BASE}/properties`, icon: FiHome, color: '#00796B', gradient: 'from-[#00796B] to-[#80CBC4]' },
  { id: 'projects', label: 'Projects', value: 142, sub: '18 ongoing launches', trend: 2.4, path: `${BASE}/projects`, icon: FiLayers, color: '#5E35B1', gradient: 'from-[#5E35B1] to-[#9575CD]' },
  { id: 'leads', label: 'Leads', value: 2915, sub: '312 unassigned', trend: 9.7, path: `${BASE}/leads`, icon: FiTarget, color: '#E65100', gradient: 'from-[#E65100] to-[#FFB74D]' },
  { id: 'subscriptions', label: 'Active Subscriptions', value: 684, sub: '27 expiring in 7 days', trend: 1.9, path: `${BASE}/subscriptions`, icon: FiCreditCard, color: '#00695C', gradient: 'from-[#00695C] to-[#4DB6AC]' },
  { id: 'payments', label: 'Revenue (This Month)', value: 4285000, sub: '12 payments pending', trend: 11.3, path: `${BASE}/payments`, icon: FiDollarSign, color: '#1B5E20', gradient: 'from-[#1B5E20] to-[#66BB6A]', currency: true },
  { id: 'advertisements', label: 'Advertisements', value: 96, sub: '14 pending review', trend: -2.1, path: `${BASE}/advertisements`, icon: FiVolume2, color: '#C2185B', gradient: 'from-[#C2185B] to-[#F06292]' },
  { id: 'kyc', label: 'KYC & Verification', value: 73, sub: 'pending verifications', trend: -5.4, path: `${BASE}/kyc`, icon: FiUserCheck, color: '#B71C1C', gradient: 'from-[#B71C1C] to-[#EF5350]', attention: true },
  { id: 'locations', label: 'Locations', value: 264, sub: '32 cities covered', trend: null, path: `${BASE}/locations`, icon: FiMapPin, color: '#006064', gradient: 'from-[#006064] to-[#4DD0E1]' },
  { id: 'reports', label: 'Reports & Analytics', value: 48, sub: '6 scheduled reports', trend: null, path: `${BASE}/reports`, icon: FiBarChart2, color: '#283593', gradient: 'from-[#283593] to-[#7986CB]' },
  { id: 'notifications', label: 'Notifications', value: 19, sub: 'unread alerts', trend: null, path: `${BASE}/notifications`, icon: FiBell, color: '#E65100', gradient: 'from-[#E65100] to-[#FFB74D]', attention: true },
  { id: 'roles', label: 'Roles & Permissions', value: 12, sub: '5 custom roles', trend: null, path: `${BASE}/roles`, icon: FiLock, color: '#4E342E', gradient: 'from-[#4E342E] to-[#A1887F]' },
  { id: 'activity-logs', label: 'Activity Logs', value: 1876, sub: 'events in last 24 hrs', trend: 7.5, path: `${BASE}/activity-logs`, icon: FiActivity, color: '#37474F', gradient: 'from-[#37474F] to-[#90A4AE]' },
  { id: 'content', label: 'Content Pages', value: 34, sub: '3 drafts', trend: null, path: `${BASE}/content`, icon: FiFileText, color: '#6A1B9A', gradient: 'from-[#6A1B9A] to-[#BA68C8]' },
  { id: 'settings', label: 'System Settings', value: 8, sub: 'configuration groups', trend: null, path: `${BASE}/settings`, icon: FiSettings, color: '#37474F', gradient: 'from-[#37474F] to-[#90A4AE]' },
];

const formatValue = (stat) => {
  if (stat.currency) {
    const v = stat.value;
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
    return `₹${v.toLocaleString('en-IN')}`;
  }
  return stat.value.toLocaleString('en-IN');
};

/* Convert hex to rgba with alpha */
const hexToRgba = (hex, alpha) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* ============ STAT CARD COMPONENT ============ */
const StatCard = ({ stat, onClick }) => {
  const Icon = stat.icon;
  const hasTrend = stat.trend !== null && stat.trend !== undefined;
  const trendUp = hasTrend && stat.trend >= 0;

  const themeVars = {
    '--card-color': stat.color,
    '--card-color-soft': hexToRgba(stat.color, 0.05),
    '--card-color-mid': hexToRgba(stat.color, 0.12),
    '--card-color-glow': hexToRgba(stat.color, 0.28),
    '--card-border': hexToRgba(stat.color, 0.22),
    '--card-border-hover': hexToRgba(stat.color, 0.55),
  };

  return (
    <button
      onClick={onClick}
      aria-label={`${stat.label}: ${formatValue(stat)}. Open ${stat.label}`}
      className="stat-card group relative text-left rounded-2xl border p-4 overflow-hidden"
      style={themeVars}
    >
      {/* Light tinted background */}
      <div className="stat-card-tint absolute inset-0" />

      {/* Radial glow corner */}
      <div className="stat-card-glow absolute inset-0" />

      {/* Conic ring burst */}
      <div className="stat-card-rings absolute -top-16 -right-16 w-40 h-40 opacity-0">
        <span className="stat-card-ring stat-card-ring-1" />
        <span className="stat-card-ring stat-card-ring-2" />
        <span className="stat-card-ring stat-card-ring-3" />
      </div>

      {/* Shimmer sweep */}
      <div className="stat-card-shimmer absolute inset-0" />

      {/* Top gradient accent line */}
      <div className={`stat-card-topline absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.gradient}`} />

      {/* Left accent bar */}
      <span className="stat-card-accent absolute left-0 top-6 bottom-6 w-1 rounded-r-full" />

      {/* Dot grid pattern */}
      <div className="stat-card-pattern absolute inset-0" />

      {/* ---- Content ---- */}
      <div className="relative flex items-start justify-between">
        <div className="relative">
          <div className="stat-card-icon w-10 h-10 rounded-xl flex items-center justify-center text-lg">
            <Icon />
          </div>
          <span className="stat-card-ping absolute inset-0 rounded-xl opacity-0" />
          <span className="stat-card-orbit absolute -inset-1.5 opacity-0">
            <span className="stat-card-orbit-dot" />
          </span>
        </div>

        <div className="stat-card-arrow-wrap">
          <FiArrowUpRight className="stat-card-arrow text-lg" />
        </div>
      </div>

      <div className="relative mt-3">
        <div className="stat-card-value text-2xl font-extrabold leading-none">
          {formatValue(stat)}
        </div>
        <div className="stat-card-label text-sm font-semibold mt-1.5">
          {stat.label}
        </div>
      </div>

      <div className="relative mt-2.5 flex items-center justify-between gap-2">
        <span className={`stat-card-sub text-xs font-medium ${stat.attention ? 'stat-card-sub-alert' : ''}`}>
          {stat.sub}
        </span>
        {hasTrend && (
          <span
            className={`stat-card-trend flex items-center gap-1 text-xs font-bold whitespace-nowrap
                        px-2 py-0.5 rounded-full
                        ${trendUp ? 'text-emerald-800 bg-emerald-100' : 'text-red-700 bg-red-100'}`}
          >
            {trendUp ? <FiTrendingUp /> : <FiTrendingDown />}
            {Math.abs(stat.trend)}%
          </span>
        )}
      </div>

      {/* Bottom animated dots */}
      <div className="stat-card-dots absolute bottom-2 right-3 flex gap-0.5 opacity-0">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="stat-card-dot w-1 h-1 rounded-full" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>

      {/* Corner notch */}
      <div className="stat-card-notch absolute bottom-0 left-0 w-8 h-8 opacity-0" />
    </button>
  );
};

/* ============ MAIN COMPONENT ============ */
const SuperAdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadStats = async () => {
    setLoading(true);
    try {
      // const res = await fetch('/api/super-admin/stats');
      // const data = await res.json();
      // setStats(initialStats.map((s) => ({ ...s, ...data[s.id] })));
      setStats(initialStats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div>
      {/* ============ HEADER ============ */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="animate-gradient-text text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C] bg-clip-text text-transparent">
            Super Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Here is what is happening across the platform. Select any card to open its page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Updated{' '}
            {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-[#00695C]/10 text-[#00695C] hover:bg-[#00695C]/20 transition-all duration-300 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ============ STATS GRID ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} onClick={() => navigate(stat.path)} />
        ))}
      </div>

      {/* ============ ALL ANIMATIONS (KEYFRAMES) ============ */}
      <style>{`
        /* =========================================================
           STAT CARD — theme color bound to --card-color CSS var
           ========================================================= */

        .stat-card {
          background-color: #ffffff;
          border-color: var(--card-border);
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease;
          will-change: transform, box-shadow;
          isolation: isolate;
        }
        .stat-card:hover {
          transform: translateY(-5px) scale(1.012);
          border-color: var(--card-border-hover);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.6) inset,
            0 12px 28px -10px var(--card-color-glow),
            0 6px 14px -6px rgba(0,0,0,0.06);
        }

        /* Very light tint that never hurts contrast */
        .stat-card-tint {
          background:
            linear-gradient(180deg, var(--card-color-soft) 0%, transparent 55%),
            linear-gradient(0deg, var(--card-color-soft) 0%, transparent 55%);
          pointer-events: none;
          z-index: 0;
        }

        /* Radial glow corner — kept subtle so text stays readable */
        .stat-card-glow {
          background: radial-gradient(
            circle at 100% 0%,
            var(--card-color-mid) 0%,
            transparent 45%
          );
          opacity: 0.4;
          transition: opacity 0.55s ease, transform 0.55s ease;
          transform: scale(1);
          pointer-events: none;
          z-index: 0;
        }
        .stat-card:hover .stat-card-glow {
          opacity: 0.7;
          transform: scale(1.1);
        }

        /* Ring burst — sits behind content */
        .stat-card-rings {
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        .stat-card:hover .stat-card-rings { opacity: 1; }
        .stat-card-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid var(--card-color);
          opacity: 0;
        }
        .stat-card:hover .stat-card-ring-1 { animation: ring-burst 1.6s ease-out infinite; }
        .stat-card:hover .stat-card-ring-2 { animation: ring-burst 1.6s ease-out 0.4s infinite; }
        .stat-card:hover .stat-card-ring-3 { animation: ring-burst 1.6s ease-out 0.8s infinite; }

        /* Shimmer — softened to avoid washing out text */
        .stat-card-shimmer {
          background: linear-gradient(
            100deg,
            transparent 20%,
            rgba(255,255,255,0.35) 45%,
            rgba(255,255,255,0.55) 50%,
            rgba(255,255,255,0.35) 55%,
            transparent 80%
          );
          transform: translateX(-120%);
          pointer-events: none;
          z-index: 1;
        }
        .stat-card:hover .stat-card-shimmer {
          animation: shimmer-sweep 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Top gradient accent line */
        .stat-card-topline {
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 3;
        }
        .stat-card:hover .stat-card-topline { transform: scaleX(1); }

        /* Left accent bar */
        .stat-card-accent {
          background-color: var(--card-color);
          transition:
            top 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            bottom 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 3;
        }
        .stat-card:hover .stat-card-accent {
          top: 12px;
          bottom: 12px;
          width: 5px;
        }

        /* Dot pattern — very subtle, only in top-right */
        .stat-card-pattern {
          background-image: radial-gradient(var(--card-color) 1px, transparent 1px);
          background-size: 12px 12px;
          background-position: 100% 0%;
          opacity: 0.08;
          mask-image: radial-gradient(circle at 100% 0%, #000 0%, transparent 60%);
          -webkit-mask-image: radial-gradient(circle at 100% 0%, #000 0%, transparent 60%);
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        .stat-card:hover .stat-card-pattern { opacity: 0.15; }

        /* ---- Icon ---- */
        .stat-card-icon {
          background-color: var(--card-color-soft);
          color: var(--card-color);
          border: 1px solid var(--card-color-mid);
          transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background-color 0.4s ease,
                      box-shadow 0.4s ease;
          z-index: 4;
        }
        .stat-card:hover .stat-card-icon {
          transform: scale(1.12) rotate(-6deg);
          background-color: var(--card-color-mid);
          box-shadow: 0 6px 18px -6px var(--card-color-glow);
        }

        .stat-card-ping {
          background-color: var(--card-color-mid);
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 3;
        }
        .stat-card:hover .stat-card-ping {
          opacity: 1;
          animation: ping-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .stat-card-orbit {
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 5;
        }
        .stat-card:hover .stat-card-orbit {
          opacity: 1;
          animation: orbit-spin 3s linear infinite;
        }
        .stat-card-orbit-dot {
          position: absolute;
          top: -2px;
          left: 50%;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--card-color);
          transform: translateX(-50%);
          box-shadow: 0 0 8px var(--card-color);
        }

        /* ---- Arrow ---- */
        .stat-card-arrow-wrap {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          transition: background-color 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
          z-index: 4;
        }
        .stat-card:hover .stat-card-arrow-wrap {
          background-color: var(--card-color-soft);
          transform: translate(3px, -3px);
        }
        .stat-card-arrow {
          color: #94a3b8;
          transition: color 0.4s ease;
        }
        .stat-card:hover .stat-card-arrow { color: var(--card-color); }

        /* =========================================================
           TEXT — HIGH CONTRAST
           ========================================================= */
        .stat-card-value {
          color: #0f172a;
          text-shadow: 0 1px 0 rgba(255,255,255,0.6);
          transition: color 0.4s ease;
          z-index: 4;
        }
        .stat-card:hover .stat-card-value { color: var(--card-color); }

        .stat-card-label {
          color: #1e293b;
          transition: color 0.4s ease;
          z-index: 4;
        }

        .stat-card-sub {
          color: #475569;
          transition: color 0.4s ease;
          z-index: 4;
        }
        .stat-card-sub-alert {
          color: #b91c1c !important;
          font-weight: 700;
        }

        /* Trend badge — stronger text on stronger pill */
        .stat-card-trend {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 4;
          border: 1px solid transparent;
        }
        .stat-card:hover .stat-card-trend { transform: scale(1.1); }

        /* Dots */
        .stat-card-dots {
          transition: opacity 0.5s ease;
          z-index: 4;
        }
        .stat-card:hover .stat-card-dots { opacity: 1; }
        .stat-card-dot {
          background-color: var(--card-color);
          animation: dot-bounce 1s ease-in-out infinite;
        }

        /* Corner notch */
        .stat-card-notch {
          background: linear-gradient(135deg, var(--card-color-mid), transparent);
          border-top-right-radius: 9999px;
          transition: opacity 0.5s ease, transform 0.5s ease;
          transform: translate(-10px, 10px);
          z-index: 1;
        }
        .stat-card:hover .stat-card-notch {
          opacity: 1;
          transform: translate(0, 0);
        }

        /* Header gradient text */
        .animate-gradient-text {
          background-size: 250% 250%;
          animation: gradient-shift 6s ease infinite;
        }

        /* =========================================================
           KEYFRAMES
           ========================================================= */
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes ping-ring {
          0%   { transform: scale(1);   opacity: 0.85; }
          70%  { transform: scale(1.7); opacity: 0;    }
          100% { transform: scale(1.7); opacity: 0;    }
        }
        @keyframes ring-burst {
          0%   { transform: scale(0.35); opacity: 0.9; }
          80%  { transform: scale(1.15); opacity: 0;   }
          100% { transform: scale(1.15); opacity: 0;   }
        }
        @keyframes orbit-spin {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0);    opacity: 0.4; }
          50%      { transform: translateY(-4px); opacity: 1;   }
        }
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%;   }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminOverview;