// src/components/dashboard/admin/Payments/PaymentReports.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  FiSearch, FiChevronDown, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX,
  FiTag, FiCheckCircle, FiXCircle, FiBriefcase, FiActivity, FiUser, FiCreditCard,
  FiClock, FiRotateCcw, FiDollarSign, FiTrendingUp, FiCalendar, FiHome, FiClipboard,
  FiKey, FiMap, FiPieChart, FiBarChart2, FiFilter, FiSliders, FiGlobe, FiShield,
  FiZap, FiStar, FiAward, FiBox, FiTarget, FiArrowUp, FiArrowDown, FiPercent,
  FiLayers, FiMapPin, FiEdit3, FiFileText, FiDatabase, FiMoreHorizontal,
  FiChevronRight, FiTrendingDown, FiMinus, FiPlus, FiMaximize, FiMinimize,
  FiCpu, FiPackage, FiInbox, FiSend, FiWifi, FiBluetooth, FiBattery, FiVolume2
} from 'react-icons/fi';
import {
  FaHome, FaHotel, FaHardHat, FaBuilding, FaStore
} from 'react-icons/fa';

// ============================================================
// UNIQUE COLOR PALETTE 
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E',
  '#22C55E', '#0EA5E9', '#D946EF', '#FB923C', '#4ADE80'
];

// ============================================================
// USER TYPE CONFIG
// ============================================================
const USER_TYPE_CONFIG = {
  'Owner': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 via-emerald-500 to-teal-400', color: '#10B981' },
  'Agent': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-600 via-blue-500 to-indigo-400', color: '#3B82F6' },
  'Builder': { icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-600 via-orange-500 to-amber-400', color: '#F97316' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-600 via-purple-500 to-violet-400', color: '#8B5CF6' }
};
const ALL_USER_TYPES = Object.keys(USER_TYPE_CONFIG);

// ============================================================
// PLANS
// ============================================================
const PLANS_BY_USER_TYPE = {
  'Owner': ['Free', 'Silver', 'Gold', 'Platinum'],
  'Agent': ['Basic', 'Professional', 'Enterprise'],
  'Builder': ['Basic', 'Premium', 'Enterprise'],
  'Property Manager': ['Standard', 'Business', 'Enterprise']
};

// ============================================================
// PROPERTY TYPES
// ============================================================
const PROPERTY_TYPES = [
  { id: 'individual', label: 'Individual', icon: FaHome, color: '#10B981', gradient: 'from-emerald-500 to-teal-400' },
  { id: 'apartment', label: 'Apartment', icon: FaBuilding, color: '#3B82F6', gradient: 'from-blue-500 to-indigo-400' },
  { id: 'commercial', label: 'Commercial', icon: FaStore, color: '#F59E0B', gradient: 'from-amber-500 to-orange-400' },
  { id: 'land', label: 'Land & Plots', icon: FiMap, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400' },
  { id: 'hostel', label: 'Hostel', icon: FaHotel, color: '#EC4899', gradient: 'from-pink-500 to-rose-400' }
];

// ============================================================
// PAYMENT METHODS
// ============================================================
const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: FiZap, color: '#F59E0B', gradient: 'from-amber-500 to-yellow-400' },
  { id: 'credit_card', label: 'Credit Card', icon: FiCreditCard, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-400' },
  { id: 'debit_card', label: 'Debit Card', icon: FiCreditCard, color: '#10B981', gradient: 'from-emerald-500 to-green-400' },
  { id: 'net_banking', label: 'Net Banking', icon: FiGlobe, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400' },
  { id: 'wallet', label: 'Wallet', icon: FiBox, color: '#EC4899', gradient: 'from-pink-500 to-fuchsia-400' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: FiBriefcase, color: '#06B6D4', gradient: 'from-cyan-500 to-sky-400' },
  { id: 'cash', label: 'Cash', icon: FiDollarSign, color: '#EF4444', gradient: 'from-red-500 to-rose-400' },
  { id: 'payment_link', label: 'Payment Link', icon: FiTag, color: '#84CC16', gradient: 'from-lime-500 to-green-400' },
  { id: 'other', label: 'Other', icon: FiMoreHorizontal, color: '#6366F1', gradient: 'from-indigo-500 to-violet-400' }
];

// ============================================================
// PAYMENT GATEWAYS
// ============================================================
const PAYMENT_GATEWAYS = [
  { id: 'razorpay', label: 'Razorpay', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-400' },
  { id: 'stripe', label: 'Stripe', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400' },
  { id: 'cashfree', label: 'Cashfree', color: '#EC4899', gradient: 'from-pink-500 to-rose-400' },
  { id: 'bank_transfer', label: 'Bank Transfer', color: '#06B6D4', gradient: 'from-cyan-500 to-teal-400' },
  { id: 'manual', label: 'Manual Payment', color: '#F59E0B', gradient: 'from-amber-500 to-orange-400' }
];


// ============================================================
// LISTING TYPES
// ============================================================
const LISTING_TYPES = [
  { id: 'rent', label: 'Rent', icon: FiKey, color: '#10B981', gradient: 'from-emerald-500 to-teal-400' },
  { id: 'sell', label: 'Sell', icon: FiTag, color: '#3B82F6', gradient: 'from-blue-500 to-indigo-400' },
  { id: 'lease', label: 'Lease', icon: FiClipboard, color: '#F59E0B', gradient: 'from-amber-500 to-orange-400' }
];

// ============================================================
// VERIFICATION STATUS
// ============================================================
const VERIFICATION_STATUS = [
  { id: 'verified', label: 'Verified', icon: FiCheckCircle, color: '#10B981', gradient: 'from-emerald-500 to-green-400' },
  { id: 'pending', label: 'Pending', icon: FiClock, color: '#F59E0B', gradient: 'from-amber-500 to-yellow-400' },
  { id: 'failed', label: 'Failed', icon: FiXCircle, color: '#EF4444', gradient: 'from-red-500 to-rose-400' },
  { id: 'refunded', label: 'Refunded', icon: FiRotateCcw, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400' }
];

// ============================================================
// DATE RANGE PRESETS
// ============================================================
const DATE_RANGE_PRESETS = [
  { id: 'today', label: 'Today', icon: FiCalendar, range: 1 },
  { id: 'yesterday', label: 'Yesterday', icon: FiClock, range: 1 },
  { id: 'week', label: 'This Week', icon: FiCalendar, range: 7 },
  { id: 'month', label: 'This Month', icon: FiCalendar, range: 30 },
  { id: 'quarter', label: 'This Quarter', icon: FiBarChart2, range: 90 },
  { id: 'year', label: 'This Year', icon: FiTrendingUp, range: 365 },
  { id: 'all', label: 'All Time', icon: FiDatabase, range: 0 }
];

// ============================================================
// ALL REPORT IDS
// ============================================================
const ALL_REPORT_IDS = ['revenue', 'failed', 'refund', 'commission', 'gateway', 'property', 'owner', 'agent', 'builder', 'pm'];
const REPORT_TITLES = {
  revenue: 'Revenue', failed: 'Failed Payment', refund: 'Refund', commission: 'Commission',
  gateway: 'Gateway Settlement', property: 'Property-wise', owner: 'Owner-wise',
  agent: 'Agent-wise', builder: 'Builder-wise', pm: 'Property Management-wise'
};

// ============================================================
// HELPERS
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
const formatCompact = (amount) => {
  const num = Number(amount || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};
const formatDate = (date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const getDateRangeLabel = (preset, customStart, customEnd) => {
  if (preset === 'custom') return `${formatDate(customStart)} - ${formatDate(customEnd)}`;
  return DATE_RANGE_PRESETS.find(p => p.id === preset)?.label || 'Select Range';
};

// ============================================================
// STATS GENERATOR
// ============================================================
const generateStatsFor = () => {
  const base = Math.floor(Math.random() * 50000000) + 10000000;
  return {
    totalRevenue: base,
    totalTransactions: Math.floor(Math.random() * 5000) + 500,
    successRate: (Math.random() * 15 + 85).toFixed(1),
    failedAmount: Math.floor(base * 0.08),
    failedCount: Math.floor(Math.random() * 400) + 50,
    refundAmount: Math.floor(base * 0.04),
    refundCount: Math.floor(Math.random() * 200) + 30,
    commissionEarned: Math.floor(base * 0.12),
    avgTransaction: Math.floor(base / 2000),
    pendingSettlement: Math.floor(base * 0.15),
    settledAmount: Math.floor(base * 0.85),
    recoveryRate: (Math.random() * 20 + 60).toFixed(1),
    refundRate: (Math.random() * 3 + 2).toFixed(1),
    avgRefundTime: (Math.random() * 3 + 1).toFixed(1),
    totalProperties: Math.floor(Math.random() * 500) + 100,
    totalOwners: Math.floor(Math.random() * 800) + 200,
    totalAgents: Math.floor(Math.random() * 200) + 50,
    totalBuilders: Math.floor(Math.random() * 100) + 20,
    totalPMs: Math.floor(Math.random() * 150) + 30,
    avgRating: (Math.random() * 1 + 4).toFixed(1)
  };
};

const GATEWAY_WEIGHTS = [0.30, 0.25, 0.20, 0.15, 0.10];
const PROPERTY_WEIGHTS = [0.32, 0.28, 0.20, 0.12, 0.08];

// ============================================================
// EXPORT DATA BUILDER
// ============================================================
const buildExportData = (activeReport, stats, timeSeriesData, methodData, gatewayData, propertyData, userTypeData) => {
  const rows = [];
  switch (activeReport) {
    case 'revenue':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Total Revenue', formatCurrency(stats.totalRevenue), '+12.5%', 'vs previous period']);
      rows.push(['Transactions', stats.totalTransactions, '+8.3%', 'Total count']);
      rows.push(['Avg Transaction', formatCurrency(stats.avgTransaction), '+3.2%', 'Per transaction']);
      rows.push(['Success Rate', `${stats.successRate}%`, '+2.1%', 'Completion rate']);
      rows.push([]);
      rows.push(['Period', 'Revenue']);
      timeSeriesData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      rows.push([]);
      rows.push(['Payment Method', 'Amount']);
      methodData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      rows.push([]);
      rows.push(['User Type', 'Revenue']);
      userTypeData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      rows.push([]);
      rows.push(['Gateway', 'Amount']);
      gatewayData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      break;

    case 'failed':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Failed Amount', formatCurrency(stats.failedAmount), '-5.2%', 'Total failed']);
      rows.push(['Failed Count', stats.failedCount, '-2.1%', 'Transactions']);
      rows.push(['Recovery Rate', `${stats.recoveryRate}%`, '+4.5%', 'Recovered']);
      rows.push(['Failure Rate', `${(100 - stats.successRate).toFixed(1)}%`, '-1.2%', 'Of total']);
      rows.push([]);
      rows.push(['Period', 'Failed Amount']);
      timeSeriesData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      rows.push([]);
      rows.push(['Failure Reason', 'Count']);
      const failTotal = stats.failedCount || 500;
      const failShare = [0.40, 0.26, 0.18, 0.11, 0.05];
      ['Insufficient Funds', 'Network Error', 'Card Declined', 'Timeout', 'Invalid Details'].forEach((r, i) => {
        rows.push([r, Math.floor(failTotal * failShare[i])]);
      });
      break;

    case 'refund':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Refund Amount', formatCurrency(stats.refundAmount), '-3.1%', 'Total refunded']);
      rows.push(['Refund Count', stats.refundCount, '-1.8%', 'Transactions']);
      rows.push(['Avg Refund Time', `${stats.avgRefundTime} days`, '-0.5%', 'Processing time']);
      rows.push(['Refund Rate', `${stats.refundRate}%`, '-0.8%', 'Of revenue']);
      rows.push([]);
      rows.push(['Period', 'Refund Amount']);
      timeSeriesData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      rows.push([]);
      rows.push(['Refund Reason', 'Percentage']);
      rows.push(['Property Issue', '45%']);
      rows.push(['Payment Error', '32%']);
      rows.push(['User Request', '28%']);
      rows.push(['Other', '15%']);
      break;

    case 'commission':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Commission Earned', formatCurrency(stats.commissionEarned), '+15.2%', 'Total earned']);
      rows.push(['Avg Commission', formatCurrency(stats.commissionEarned / 100), '+5.4%', 'Per transaction']);
      rows.push(['Commission Rate', '12.5%', '+1.2%', 'Of revenue']);
      rows.push(['Top Earner', 'Premium', '+8.9%', 'Plan type']);
      rows.push([]);
      rows.push(['Period', 'Commission']);
      timeSeriesData.forEach(d => rows.push([d.label, formatCurrency(d.value)]));
      rows.push([]);
      rows.push(['Rank', 'Name', 'Role', 'Amount']);
      const commBase = stats.commissionEarned || 0;
      const commShare = [0.32, 0.25, 0.22, 0.21];
      [
        { name: 'Rajesh Kumar', role: 'Agent' },
        { name: 'Suresh Builders', role: 'Builder' },
        { name: 'Priya Properties', role: 'Owner' },
        { name: 'Anitha Estates', role: 'Agent' }
      ].forEach((e, i) => {
        rows.push([i + 1, e.name, e.role, formatCurrency(Math.floor(commBase * commShare[i]))]);
      });
      break;

    case 'gateway':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Settled Amount', formatCurrency(stats.settledAmount), '+10.1%', 'Successfully settled']);
      rows.push(['Pending Settlement', formatCurrency(stats.pendingSettlement), '-4.3%', 'In transit']);
      rows.push(['Active Gateways', PAYMENT_GATEWAYS.length, '0%', 'Connected']);
      rows.push(['Settlement Rate', '94.2%', '+1.8%', 'Success rate']);
      rows.push([]);
      rows.push(['Gateway', 'Settled', 'Pending', 'Fees', 'Net', 'Rate']);
      const totalSettled = stats.settledAmount || 0;
      const totalPending = stats.pendingSettlement || 0;
      PAYMENT_GATEWAYS.forEach((g, i) => {
        const w = GATEWAY_WEIGHTS[i % GATEWAY_WEIGHTS.length];
        const settled = Math.floor(totalSettled * w);
        const pending = Math.floor(totalPending * w);
        const fees = Math.floor(settled * 0.02);
        const rate = (90 + i * 1.5).toFixed(1);
        rows.push([g.label, formatCurrency(settled), formatCurrency(pending), formatCurrency(fees), formatCurrency(settled - fees), `${rate}%`]);
      });
      break;

    case 'property':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Total Properties', stats.totalProperties, '+6.7%', 'Listed']);
      rows.push(['Top Type', 'Apartment', '+12.3%', 'Most popular']);
      rows.push(['Top Location', 'Mumbai', '+4.5%', 'Highest revenue']);
      rows.push(['Avg Property Value', formatCompact(stats.totalRevenue / 200), '+2.8%', 'Per property']);
      rows.push([]);
      rows.push(['Property Type', 'Revenue', 'Count', 'Growth']);
      PROPERTY_TYPES.forEach((p, i) => {
        const w = PROPERTY_WEIGHTS[i % PROPERTY_WEIGHTS.length];
        const revenue = Math.floor(stats.totalRevenue * w);
        const count = Math.floor(stats.totalProperties * w);
        const growth = (5 + i * 1.4).toFixed(1);
        rows.push([p.label, formatCurrency(revenue), count, `+${growth}%`]);
      });
      break;

    case 'owner':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Total Owners', stats.totalOwners, '+6.3%', 'Active owners']);
      rows.push(['Properties Listed', Math.floor(stats.totalProperties * 4), '+9.7%', 'Total listings']);
      rows.push(['Total Earnings', formatCompact(stats.totalRevenue * 0.5), '+13.2%', 'Owner revenue']);
      rows.push(['Avg Rating', stats.avgRating, '+0.2%', 'Out of 5']);
      rows.push([]);
      rows.push(['Rank', 'Name', 'Plan', 'Deals', 'Revenue', 'Growth']);
      const ownerBase = stats.totalRevenue * 0.5;
      const ownerShare = [0.30, 0.24, 0.18, 0.16, 0.12];
      ['Priya Properties', 'Suresh Estates', 'Anitha Homes', 'Vijay Realty', 'Meena Properties'].forEach((n, i) => {
        rows.push([i + 1, n, PLANS_BY_USER_TYPE['Owner'][i % 4], Math.floor(40 - i * 5), formatCurrency(Math.floor(ownerBase * ownerShare[i])), `+${(18 - i * 2).toFixed(1)}%`]);
      });
      break;

    case 'agent':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Total Agents', stats.totalAgents, '+8.4%', 'Active agents']);
      rows.push(['Top Agent', 'Rajesh K.', '+15.2%', 'Highest revenue']);
      rows.push(['Total Commission', formatCompact(stats.commissionEarned * 0.4), '+9.1%', 'Agent commission']);
      rows.push(['Avg Deal Size', formatCompact(stats.avgTransaction * 2), '+3.7%', 'Per deal']);
      rows.push([]);
      rows.push(['Rank', 'Name', 'Plan', 'Deals', 'Revenue', 'Growth']);
      const agentBase = stats.commissionEarned * 0.4;
      const agentShare = [0.32, 0.26, 0.18, 0.14, 0.10];
      ['Rajesh Kumar', 'Priya Sharma', 'Suresh Reddy', 'Anitha Nair', 'Vijay Menon'].forEach((n, i) => {
        rows.push([i + 1, n, PLANS_BY_USER_TYPE['Agent'][i % 3], Math.floor(45 - i * 6), formatCurrency(Math.floor(agentBase * agentShare[i])), `+${(20 - i * 2.5).toFixed(1)}%`]);
      });
      break;

    case 'builder':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Total Builders', stats.totalBuilders, '+5.2%', 'Active builders']);
      rows.push(['Projects', Math.floor(stats.totalProperties * 0.6), '+7.8%', 'Ongoing projects']);
      rows.push(['Total Revenue', formatCompact(stats.totalRevenue * 0.35), '+11.4%', 'Builder revenue']);
      rows.push(['Avg Project Value', formatCompact(stats.totalRevenue / 100), '+4.1%', 'Per project']);
      rows.push([]);
      rows.push(['Rank', 'Name', 'Plan', 'Deals', 'Revenue', 'Growth']);
      const builderBase = stats.totalRevenue * 0.35;
      const builderShare = [0.30, 0.24, 0.20, 0.15, 0.11];
      ['Suresh Builders', 'Prestige Group', 'DLF Ltd', 'Godrej Properties', 'Lodha Group'].forEach((n, i) => {
        rows.push([i + 1, n, PLANS_BY_USER_TYPE['Builder'][i % 3], Math.floor(30 - i * 4), formatCurrency(Math.floor(builderBase * builderShare[i])), `+${(22 - i * 3).toFixed(1)}%`]);
      });
      break;

    case 'pm':
      rows.push(['Metric', 'Value', 'Trend', 'Subtitle']);
      rows.push(['Total PMs', stats.totalPMs, '+7.1%', 'Active managers']);
      rows.push(['Properties Managed', Math.floor(stats.totalProperties * 3), '+10.5%', 'Under management']);
      rows.push(['Management Fees', formatCompact(stats.totalRevenue * 0.08), '+6.8%', 'Total fees']);
      rows.push(['Avg Properties', Math.floor(15 + stats.totalPMs / 100), '+3.2%', 'Per manager']);
      rows.push([]);
      rows.push(['Rank', 'Name', 'Plan', 'Deals', 'Revenue', 'Growth']);
      const pmBase = stats.totalRevenue * 0.08;
      const pmShare = [0.28, 0.24, 0.20, 0.16, 0.12];
      ['ABC Property Mgmt', 'Prime Estates', 'Urban Homes', 'Metro PM', 'City Managers'].forEach((n, i) => {
        rows.push([i + 1, n, PLANS_BY_USER_TYPE['Property Manager'][i % 3], Math.floor(25 - i * 3), formatCurrency(Math.floor(pmBase * pmShare[i])), `+${(15 - i * 1.8).toFixed(1)}%`]);
      });
      break;

    default: break;
  }
  return rows;
};

// ============================================================
// DOWNLOAD HELPERS
// ============================================================
const escapeCSV = (val) => {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const downloadCSV = (rows, filename) => {
  const csv = rows.map(row => row.map(escapeCSV).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadExcel = (rows, filename, sheetName = 'Report') => {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>`;
  html += `<x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>`;
  html += `</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;
  html += `<style>table{border-collapse:collapse;} td,th{border:1px solid #ccc;padding:6px 10px;font-family:Arial,sans-serif;font-size:12px;} th{background:#00695C;color:#fff;font-weight:bold;}</style>`;
  html += `</head><body><table>`;
  rows.forEach((row, rIdx) => {
    if (row.length === 0) { html += `<tr><td colspan="6" style="border:none;height:8px;"></td></tr>`; return; }
    html += '<tr>';
    row.forEach(cell => {
      const tag = rIdx === 0 ? 'th' : 'td';
      html += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
    });
    html += '</tr>';
  });
  html += `</table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadMultiSheetExcel = (reports, filename) => {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>`;
  reports.forEach((report) => {
    html += `<x:ExcelWorksheet><x:Name>${report.title}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`;
  });
  html += `</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;
  html += `<style>table{border-collapse:collapse;margin-bottom:20px;} td,th{border:1px solid #ccc;padding:6px 10px;font-family:Arial,sans-serif;font-size:12px;} th{background:#00695C;color:#fff;font-weight:bold;}</style>`;
  html += `</head><body>`;
  reports.forEach((report) => {
    html += `<table>`;
    report.rows.forEach((row, rIdx) => {
      if (row.length === 0) { html += `<tr><td colspan="6" style="border:none;height:8px;"></td></tr>`; return; }
      html += '<tr>';
      row.forEach(cell => {
        const tag = rIdx === 0 ? 'th' : 'td';
        html += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
      });
      html += '</tr>';
    });
    html += `</table>`;
  });
  html += `</body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ============================================================
// PDF — DIRECT DOWNLOAD
// ============================================================
const downloadPDF = (rows, title, subtitle) => {
  let tableHTML = '';
  rows.forEach((row, rIdx) => {
    if (row.length === 0) { tableHTML += `<tr><td colspan="6" style="border:none;height:10px;"></td></tr>`; return; }
    tableHTML += '<tr>';
    row.forEach(cell => {
      const tag = rIdx === 0 ? 'th' : 'td';
      tableHTML += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
    });
    tableHTML += '</tr>';
  });

  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
  container.style.color = '#1A2E2A';
  container.style.background = '#fff';
  container.innerHTML = `
    <div style="border-bottom: 3px solid #00695C; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="color: #00695C; margin: 0; font-size: 22px;">${title}</h1>
        <p style="color: #5A7D78; margin: 4px 0 0; font-size: 12px;">${subtitle || ''}</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #5A7D78;">
        <div>Generated: ${new Date().toLocaleString('en-IN')}</div>
        <div>Payment Reports & Analytics</div>
      </div>
    </div>
    <table style="width: 100%; border-collapse: collapse;">${tableHTML}</table>
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E8F0EE; font-size: 10px; color: #5A7D78; text-align: center;">
      © ${new Date().getFullYear()} Payment Reports · Confidential
    </div>
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    table th { background: #00695C; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; }
    table td { padding: 8px 12px; border-bottom: 1px solid #E8F0EE; font-size: 12px; }
    table tr:nth-child(even) td { background: #F8FAF9; }
  `;
  container.appendChild(styleEl);

  const filename = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  html2pdf().set({
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }).from(container).save();
};

const downloadAllPDF = (reports, dateLabel) => {
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
  container.style.color = '#1A2E2A';
  container.style.background = '#fff';

  let bodyHTML = `
    <div style="border-bottom: 3px solid #00695C; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="color: #00695C; margin: 0; font-size: 24px;">All Payment Reports</h1>
        <p style="color: #5A7D78; margin: 4px 0 0; font-size: 12px;">Period: ${dateLabel} · ${reports.length} reports</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #5A7D78;">
        <div>Generated: ${new Date().toLocaleString('en-IN')}</div>
        <div>Payment Reports & Analytics</div>
      </div>
    </div>
  `;

  reports.forEach((report) => {
    let tableHTML = '';
    report.rows.forEach((row, rIdx) => {
      if (row.length === 0) { tableHTML += `<tr><td colspan="6" style="border:none;height:10px;"></td></tr>`; return; }
      tableHTML += '<tr>';
      row.forEach(cell => {
        const tag = rIdx === 0 ? 'th' : 'td';
        tableHTML += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
      });
      tableHTML += '</tr>';
    });

    bodyHTML += `
      <div style="margin-bottom: 30px; page-break-after: always;">
        <div style="background: linear-gradient(90deg, #00695C, #26A69A); color: #fff; padding: 10px 14px; border-radius: 8px 8px 0 0; font-size: 15px; font-weight: bold;">
          ${report.title} Report
        </div>
        <table style="width: 100%; border-collapse: collapse;">${tableHTML}</table>
      </div>
    `;
  });

  bodyHTML += `
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E8F0EE; font-size: 10px; color: #5A7D78; text-align: center;">
      © ${new Date().getFullYear()} Payment Reports · Confidential
    </div>
  `;

  container.innerHTML = bodyHTML;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    table th { background: #E8F4F2; color: #00695C; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; border: 1px solid #C5EDE5; }
    table td { padding: 7px 12px; border: 1px solid #E8F0EE; font-size: 11px; }
    table tr:nth-child(even) td { background: #F8FAF9; }
  `;
  container.appendChild(styleEl);

  const filename = `all_payment_reports_${new Date().toISOString().split('T')[0]}.pdf`;
  html2pdf().set({
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  }).from(container).save();
};

// ============================================================
// ANIMATED TOAST
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);
  
  if (!toast) return null;
  
  const colors = { 
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400', 
    error: 'bg-gradient-to-r from-red-500 to-rose-400', 
    warning: 'bg-gradient-to-r from-amber-500 to-orange-400', 
    info: 'bg-gradient-to-r from-blue-500 to-cyan-400' 
  };
  
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-toast-in ${colors[toast.type] || colors.success}`}>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-bounce-subtle">
        {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
        {toast.type === 'error' && <FiXCircle className="text-lg" />}
        {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
        {toast.type === 'info' && <FiInfo className="text-lg" />}
      </div>
      <span className="text-sm font-bold">{toast.message}</span>
      <button onClick={() => setToast(null)} className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
        <FiX className="text-xs" />
      </button>
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ icon, title, value, trend, subtitle, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8F0EE] group cursor-pointer relative overflow-hidden animate-card-in"
      style={{ 
        animationDelay: `${delay}ms`,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
      
      <div className="relative flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
          <div className="animate-icon-float">{icon}</div>
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all duration-300 ${trend >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {trend >= 0 ? <FiArrowUp className="text-[9px] animate-bounce-subtle" /> : <FiArrowDown className="text-[9px] animate-bounce-subtle" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <p className="text-[11px] font-bold text-[#3D5A55] uppercase tracking-wider truncate mb-1">{title}</p>
      <p className="text-2xl font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors duration-300 truncate">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="text-[10px] text-[#5A7D78] mt-1.5 truncate font-medium">{subtitle}</p>}
      
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`} />
    </div>
  );
};

// ============================================================
// DATE RANGE PICKER
// ============================================================
const DateRangePicker = ({ selected, onSelect, customStart, customEnd, onCustomChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { 
        setIsOpen(false); 
        setShowCustom(false); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const currentLabel = getDateRangeLabel(selected, customStart, customEnd);
  const CurrentIcon = selected === 'custom' ? FiEdit3 : (DATE_RANGE_PRESETS.find(p => p.id === selected)?.icon || FiCalendar);
  
  return (
    <div className="relative z-[80]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-105 ${
          isOpen 
            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' 
            : 'bg-white border border-[#E8F0EE] text-[#0F1A18] hover:border-[#00695C]/30 hover:shadow-md'
        }`}
      >
        <CurrentIcon className={`text-sm ${isOpen ? 'text-white' : 'text-[#00695C]'}`} />
        <span className="hidden sm:inline whitespace-nowrap">{currentLabel}</span>
        <FiChevronDown className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[90] animate-dropdown-in">
          <div className="px-3 py-2 border-b border-[#E8F0EE]">
            <p className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wider">Quick Ranges</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {DATE_RANGE_PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button 
                  key={preset.id} 
                  onClick={() => { onSelect(preset.id); setIsOpen(false); }} 
                  className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] hover:pl-5 ${selected === preset.id ? 'bg-[#E8F4F2] text-[#00695C] font-bold' : 'text-[#0F1A18] font-medium'}`}
                >
                  <Icon className={`text-sm ${selected === preset.id ? 'text-[#00695C]' : 'text-[#5A7D78]'}`} />
                  <span>{preset.label}</span>
                  {selected === preset.id && <FiCheckCircle className="ml-auto text-[#00695C] text-sm animate-scale-in" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#E8F0EE] px-3 py-2">
            <button 
              onClick={() => setShowCustom(!showCustom)} 
              className="w-full flex items-center justify-between text-xs font-bold text-[#00695C] px-2 py-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300"
            >
              <span className="flex items-center gap-2"><FiEdit3 className="text-sm" /> Custom Range</span>
              <FiChevronDown className={`transition-transform duration-300 ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            {showCustom && (
              <div className="mt-2 space-y-2 p-2 bg-[#F5F9F8] rounded-xl animate-slide-down">
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">From</label>
                  <input 
                    type="date" 
                    value={customStart ? customStart.toISOString().split('T')[0] : ''} 
                    onChange={(e) => onCustomChange(new Date(e.target.value), customEnd)} 
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/10 text-xs text-[#0F1A18] font-medium outline-none transition-all duration-300" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">To</label>
                  <input 
                    type="date" 
                    value={customEnd ? customEnd.toISOString().split('T')[0] : ''} 
                    onChange={(e) => onCustomChange(customStart, new Date(e.target.value))} 
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/10 text-xs text-[#0F1A18] font-medium outline-none transition-all duration-300" 
                  />
                </div>
                <button 
                  onClick={() => { onSelect('custom'); setIsOpen(false); setShowCustom(false); }} 
                  disabled={!customStart || !customEnd} 
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 hover:scale-105"
                >
                  Apply Custom Range
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// HEADER EXPORT DROPDOWN
// ============================================================
const ExportDropdown = ({ onExportAll, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const allOptions = [
    { id: 'excel', label: 'All Reports → Excel', desc: '1 file · 10 sheets', icon: FiFileText, bg: 'bg-emerald-100', text: 'text-emerald-800' },
    { id: 'csv', label: 'All Reports → CSV', desc: '10 separate files', icon: FiFileText, bg: 'bg-blue-100', text: 'text-blue-800' },
    { id: 'pdf', label: 'All Reports → PDF', desc: '1 PDF · 10 pages', icon: FiFileText, bg: 'bg-red-100', text: 'text-red-800' }
  ];
  
  return (
    <div className="relative z-[80]" ref={dropdownRef}>
      <button 
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen 
            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' 
            : 'bg-white border border-[#E8F0EE] text-[#0F1A18] hover:border-[#00695C]/30 hover:shadow-md'
        }`}
      >
        <FiDownload className={`text-sm ${isOpen ? 'animate-bounce-subtle' : ''}`} />
        <span className="hidden sm:inline">Export All</span>
        <FiChevronDown className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[90] animate-dropdown-in">
          <div className="px-4 py-3 border-b border-[#E8F0EE] bg-gradient-to-r from-[#F5F9F8] to-white">
            <p className="text-[10px] font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2">
              <FiLayers className="text-sm animate-pulse" /> Download All Reports
            </p>
            <p className="text-[10px] text-[#3D5A55] font-medium mt-1">10 comprehensive reports included</p>
          </div>
          {allOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button 
                key={opt.id} 
                onClick={() => { onExportAll(opt.id); setIsOpen(false); }} 
                className="w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center gap-3 hover:bg-[#E8F4F2] text-[#0F1A18] group hover:pl-5"
              >
                <div className={`w-10 h-10 rounded-xl ${opt.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`}>
                  <Icon className={`text-base ${opt.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{opt.label}</p>
                  <p className="text-[10px] text-[#5A7D78] font-medium truncate">{opt.desc}</p>
                </div>
                <FiChevronRight className="ml-auto text-[#5A7D78] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// PER-REPORT EXPORT BAR
// ============================================================
const ReportExportBar = ({ reportTitle, onExport }) => {
  const buttons = [
    { id: 'excel', label: 'Excel', icon: FiFileText, text: 'text-emerald-800', gradient: 'from-emerald-500 to-teal-400' },
    { id: 'csv', label: 'CSV', icon: FiFileText, text: 'text-blue-800', gradient: 'from-blue-500 to-cyan-400' },
    { id: 'pdf', label: 'PDF', icon: FiFileText, text: 'text-red-800', gradient: 'from-red-500 to-rose-400' }
  ];
  
  return (
    <div className="bg-[#b0d2cc] rounded-2xl p-5 border border-[#044a42] shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg flex-shrink-0 animate-icon-float">
            <FiFileText className="text-white text-lg" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#0F1A18] truncate">{reportTitle}</h2>
            <p className="text-[11px] text-[#3D5A55] font-medium truncate">Download in your preferred format</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {buttons.map((b) => {
            const Icon = b.icon;
            return (
              <button 
                key={b.id} 
                onClick={() => onExport(b.id)} 
                className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl transition-all duration-300 text-xs font-bold hover:scale-105 hover:shadow-lg hover:border-transparent relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <Icon className={`text-sm relative z-10 ${b.text} group-hover:text-white transition-colors duration-300`} />
                <span className={`relative z-10 ${b.text} group-hover:text-white transition-colors duration-300`}>{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REPORT TYPE CARD
// ============================================================
const ReportTypeCard = ({ report, isActive, onClick, index }) => {
  const Icon = report.icon;
  
  
  const lightBg = report.bg || 'bg-gray-50'; 

  return (
    <div 
      onClick={onClick} 
      className={`rounded-2xl p-4 cursor-pointer transition-all duration-500 border-2 hover:shadow-xl group relative overflow-hidden animate-card-in ${
        isActive 
          ? 'bg-gradient-to-br from-[#00695C] to-[#26A69A] border-transparent shadow-xl shadow-[#00695C]/30 scale-105' 
          : `${lightBg} border-[#d2ece6] hover:-translate-y-2 hover:border-[#00695C]/40 hover:shadow-lg`
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {isActive && (
        <>
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full animate-pulse-slow" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full animate-pulse-slow" />
        </>
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700`} />
      
      <div className="relative flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
          isActive ? 'bg-white/20' : 'bg-white/60 shadow-sm'
        }`}>
          <Icon className={`text-base ${isActive ? 'text-white' : report.text}`} />
        </div>
        {isActive && (
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-scale-in">
            <FiCheckCircle className="text-white text-xs" />
          </div>
        )}
      </div>
      
      <h4 className={`text-xs font-bold mb-0.5 ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{report.title}</h4>
      <p className={`text-[9px] font-medium ${isActive ? 'text-white/90' : 'text-[#5A7D78]'}`}>{report.desc}</p>
      
      <div className={`absolute bottom-0 left-0 h-1 bg-white/40 transition-all duration-500 ${isActive ? 'w-full' : 'w-0'}`} />
    </div>
  );
};
// ============================================================
// 🍩 ULTRA DONUT CHART — Bold text, unique colors, animated
// ============================================================
const DonutChart = ({ data, size = 220, thickness = 48, centerLabel = 'TOTAL', centerValue }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // Ensure unique colors
  const uniqueData = useMemo(() => {
    const usedColors = new Set();
    let paletteIdx = 0;
    return data.map((d) => {
      let color = d.color;
      if (!color || usedColors.has(color)) {
        while (usedColors.has(UNIQUE_COLORS[paletteIdx % UNIQUE_COLORS.length])) paletteIdx++;
        color = UNIQUE_COLORS[paletteIdx % UNIQUE_COLORS.length];
        paletteIdx++;
      }
      usedColors.add(color);
      return { ...d, color };
    });
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            fill="none" 
            stroke="#EEF4F2" 
            strokeWidth={thickness} 
          />
          
          {/* Segments */}
          {uniqueData.map((d, i) => {
            const segmentLength = (d.value / total) * circumference;
            const offset = cumulative;
            cumulative += segmentLength;
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && !isHovered;
            
            return (
              <circle
                key={i}
                cx={size / 2} 
                cy={size / 2} 
                r={radius}
                fill="none" 
                stroke={d.color} 
                strokeWidth={isHovered ? thickness + 10 : thickness}
                strokeDasharray={`${segmentLength * animationProgress} ${circumference - segmentLength * animationProgress}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="transition-all duration-500 cursor-pointer"
                style={{ 
                  filter: isHovered ? `drop-shadow(0 0 12px ${d.color})` : 'none',
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'stroke-width 0.3s, opacity 0.3s, filter 0.3s'
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Center */}
        {centerValue !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-[0.15em] mb-1">
              {centerLabel}
            </p>
            <p className="text-[26px] font-black text-[#0F1A18] leading-none animate-count-up">
              {centerValue}
            </p>
            {hoveredIndex !== null ? (
              <div className="mt-2 flex flex-col items-center animate-scale-in">
                <span 
                  className="text-[13px] font-black px-2 py-0.5 rounded-md"
                  style={{ color: '#fff', backgroundColor: uniqueData[hoveredIndex].color }}
                >
                  {((uniqueData[hoveredIndex].value / total) * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-[#3D5A55] mt-1 truncate max-w-[120px]">
                  {uniqueData[hoveredIndex].label}
                </span>
              </div>
            ) : (
              <p className="text-[10px] font-bold text-[#3D5A55] mt-1">
                {uniqueData.length} categories
              </p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-5 space-y-2 w-full max-h-[280px] overflow-y-auto pr-1">
        {uniqueData.map((d, i) => {
          const pct = ((d.value / total) * 100).toFixed(1);
          const isHovered = hoveredIndex === i;
          return (
            <div 
              key={i} 
              className={`flex items-center justify-between text-xs p-2.5 rounded-xl transition-all duration-300 cursor-pointer border ${
                isHovered 
                  ? 'bg-white shadow-md scale-[1.02] border-transparent' 
                  : 'border-transparent hover:bg-[#F5F9F8]'
              }`}
              style={{ 
                borderLeftWidth: '4px',
                borderLeftColor: d.color
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span 
                  className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 ${isHovered ? 'scale-150' : ''}`} 
                  style={{ 
                    backgroundColor: d.color,
                    boxShadow: isHovered ? `0 0 12px ${d.color}` : `0 0 4px ${d.color}80`
                  }} 
                />
                <span className={`font-bold truncate ${isHovered ? 'text-[#0F1A18]' : 'text-[#1A2E2A]'}`}>
                  {d.label}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span 
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ color: '#fff', backgroundColor: d.color }}
                >
                  {pct}%
                </span>
                <span className="text-xs font-black text-[#0F1A18] min-w-[60px] text-right">
                  {formatCompact(d.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// 📊 ULTRA BAR CHART — Bold labels, gradient bars, animated
// ============================================================
const BarChart = ({ data, height = 260 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const max = Math.max(...data.map(d => d.value), 1);
  const barAreaHeight = height - 55;

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 w-full" style={{ height: barAreaHeight }}>
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / max) * barAreaHeight * animationProgress, 8);
          const isHovered = hoveredIndex === i;
          const isDimmed = hoveredIndex !== null && !isHovered;
          
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end group relative cursor-pointer"
              style={{ height: '100%' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              <div className={`absolute -top-12 transition-all duration-300 z-20 pointer-events-none ${
                isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-2 scale-95'
              }`}>
                <div className="bg-[#0F1A18] text-white text-[11px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                  <div className="text-[9px] font-bold text-white/70 mb-0.5">{d.label}</div>
                  {formatCompact(d.value)}
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0F1A18]" />
              </div>
              
              {/* Value badge above bar */}
              <div 
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-md mb-1 transition-all duration-300 whitespace-nowrap ${
                  isHovered ? 'opacity-100' : 'opacity-60'
                }`}
                style={{ color: d.color, backgroundColor: `${d.color}15` }}
              >
                {formatCompact(d.value)}
              </div>
              
              {/* Bar */}
              <div
                className="w-full rounded-t-lg transition-all duration-300 relative overflow-hidden"
                style={{
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${d.color} 0%, ${d.color}CC 60%, ${d.color}80 100%)`,
                  boxShadow: isHovered ? `0 8px 24px ${d.color}70` : `0 2px 8px ${d.color}30`,
                  transform: isHovered ? 'scaleX(1.08)' : 'scaleX(1)',
                  opacity: isDimmed ? 0.4 : 1,
                }}
              >
                {/* Shine */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full transition-transform duration-700 ${
                  isHovered ? 'translate-x-full' : ''
                }`} />
                
                {/* Top glow dot */}
                <div 
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-3 gap-2 pt-2 border-t border-[#F1F5F4]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center min-w-0">
            <span 
              className={`text-[10px] font-black truncate block transition-colors duration-300 ${
                hoveredIndex === i ? 'text-[#00695C]' : 'text-[#3D5A55]'
              }`}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 📈 ULTRA AREA CHART — Bold tooltips, dual glow, animated
// ============================================================
const AreaChart = ({ data, height = 260, color = '#00695C' }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const chartHeight = height - 40;
  const chartWidth = 1000;
  const stepX = chartWidth / Math.max(data.length - 1, 1);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const points = data.map((d, i) => ({ 
    x: i * stepX, 
    y: 20 + (1 - (d.value - min) / range) * chartHeight * animationProgress 
  }));
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartWidth} ${height} L 0 ${height} Z`;
  const gradId = `area-${color.replace('#', '')}`;
  const glowId = `glow-${color.replace('#', '')}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartWidth} ${height}`} style={{ width: '100%', height }} className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="50%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Y-axis grid lines ONLY (no text labels) */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = 20 + (1 - r) * chartHeight;
          return (
            <line 
              key={i}
              x1="0" 
              y1={y} 
              x2={chartWidth} 
              y2={y} 
              stroke="#EEF4F2" 
              strokeWidth="1" 
              strokeDasharray="4 6" 
            />
          );
        })}
        
        {/* Area */}
        <path d={areaPath} fill={`url(#${gradId})`} className="transition-all duration-1000" />
        
        {/* Line with glow */}
        <path 
          d={linePath} 
          fill="none" 
          stroke={color} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
          className="transition-all duration-1000"
        />
        
        {/* Points */}
        {points.map((p, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g 
              key={i}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <circle cx={p.x} cy={p.y} r="16" fill={color} opacity={isHovered ? 0.15 : 0} className="transition-all duration-300" />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={isHovered ? 9 : 6} 
                fill="white" 
                stroke={color} 
                strokeWidth="3"
                className="transition-all duration-300"
                style={{ filter: isHovered ? `drop-shadow(0 0 8px ${color})` : 'none' }}
              />
              <circle cx={p.x} cy={p.y} r="3" fill={color} />
              
              {isHovered && (
                <g className="animate-scale-in">
                  <rect 
                    x={p.x - 55} 
                    y={p.y - 55} 
                    width="110" 
                    height="42" 
                    rx="8" 
                    fill="#0F1A18"
                    filter="drop-shadow(0 6px 12px rgba(0,0,0,0.25))"
                  />
                  <text x={p.x} y={p.y - 38} textAnchor="middle" fill="#B5C9C5" fontSize="9" fontWeight="700">
                    {data[i].label}
                  </text>
                  <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">
                    {formatCompact(data[i].value)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-3">
        {data.map((d, i) => (
          <span 
            key={i} 
            className={`text-[10px] font-black flex-1 text-center truncate transition-colors duration-300 ${
              hoveredPoint === i ? 'text-[#00695C]' : 'text-[#3D5A55]'
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 🎚 ULTRA PROGRESS BAR — Bold values, marker dot, shimmer
// ============================================================
const ProgressBar = ({ label, value, max, color, icon: Icon, delay = 0 }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const pct = max > 0 ? (value / max) * 100 : 0;
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const animatedPct = Math.min(pct * animationProgress, 100);

  return (
    <div 
      className={`space-y-2 p-3 rounded-xl transition-all duration-300 border ${
        isHovered ? 'bg-[#F5F9F8] border-transparent shadow-sm' : 'border-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {Icon && (
            <div 
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                isHovered ? 'scale-110 rotate-6' : ''
              }`}
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="text-sm" style={{ color }} />
            </div>
          )}
          <span className={`text-xs font-bold truncate transition-colors duration-300 ${
            isHovered ? 'text-[#0F1A18]' : 'text-[#1A2E2A]'
          }`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-black text-[#0F1A18]">{formatCompact(value)}</span>
          <span 
            className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`} 
            style={{ backgroundColor: color }}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="h-3.5 bg-[#EEF4F2] rounded-full overflow-hidden relative">
        {/* Progress fill */}
        <div 
          className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
          style={{ 
            width: `${animatedPct}%`, 
            background: `linear-gradient(90deg, ${color}, ${color}DD)`,
            boxShadow: isHovered ? `0 0 16px ${color}90` : `0 0 8px ${color}40`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
        
        {/* Marker */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md transition-all duration-1000 ${
            isHovered ? 'scale-125' : ''
          }`}
          style={{ 
            left: `calc(${animatedPct}% - 8px)`,
            backgroundColor: color,
            opacity: animationProgress,
            boxShadow: `0 0 12px ${color}`
          }}
        />
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const PaymentReports = () => {
  const [activeReport, setActiveReport] = useState('revenue');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const REPORT_TYPES = [
    { id: 'revenue', title: 'Revenue', desc: 'Total revenue analytics', icon: FiTrendingUp, bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { id: 'failed', title: 'Failed Payment', desc: 'Failed transactions', icon: FiXCircle, bg: 'bg-red-50', text: 'text-red-700' },
    { id: 'refund', title: 'Refund', desc: 'Refund analytics', icon: FiRotateCcw, bg: 'bg-purple-50', text: 'text-purple-700' },
    { id: 'commission', title: 'Commission', desc: 'Commission earnings', icon: FiDollarSign, bg: 'bg-amber-50', text: 'text-amber-700' },
    { id: 'gateway', title: 'Gateway Settlement', desc: 'Gateway settlements', icon: FiCreditCard, bg: 'bg-blue-50', text: 'text-blue-700' },
    { id: 'property', title: 'Property-wise', desc: 'Property stats', icon: FaBuilding, bg: 'bg-cyan-50', text: 'text-cyan-700' },
    { id: 'owner', title: 'Owner-wise', desc: 'Owner stats', icon: FaHome, bg: 'bg-teal-50', text: 'text-teal-700' },
    { id: 'agent', title: 'Agent-wise', desc: 'Agent stats', icon: FiBriefcase, bg: 'bg-indigo-50', text: 'text-indigo-700' },
    { id: 'builder', title: 'Builder-wise', desc: 'Builder stats', icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700' },
    { id: 'pm', title: 'Property Mgmt', desc: 'PM stats', icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700' }
  ];

  const generateTimeSeriesData = useCallback(() => {
    let labels = [];
    if (datePreset === 'today' || datePreset === 'yesterday') labels = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
    else if (datePreset === 'week') labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    else if (datePreset === 'month') labels = ['W1', 'W2', 'W3', 'W4'];
    else if (datePreset === 'quarter') labels = ['Jan', 'Feb', 'Mar'];
    else if (datePreset === 'year') labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    else if (datePreset === 'custom') labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
    else labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
    return labels.map(label => ({ label, value: Math.floor(Math.random() * 4000000) + 500000 }));
  }, [datePreset]);

  const generateDistribution = useCallback((items) => {
    return items.map((item, idx) => ({ 
      label: item.label, 
      value: Math.floor(Math.random() * 2000000) + 200000, 
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    }));
  }, []);

  const [stats, setStats] = useState({});
  const computeStats = useCallback(() => { setStats(generateStatsFor()); }, []);
  useEffect(() => { computeStats(); }, [activeReport, datePreset, computeStats]);

  const timeSeriesData = useMemo(() => generateTimeSeriesData(), [generateTimeSeriesData]);
  const methodData = useMemo(() => generateDistribution(PAYMENT_METHODS), [generateDistribution]);
  const propertyData = useMemo(() => generateDistribution(PROPERTY_TYPES), [generateDistribution]);
  const userTypeData = useMemo(() => ALL_USER_TYPES.map((t, i) => ({ 
    label: t, 
    value: Math.floor(Math.random() * 1000000) + 50000, 
    color: UNIQUE_COLORS[i % UNIQUE_COLORS.length]
  })), []);
  const gatewayData = useMemo(() => generateDistribution(PAYMENT_GATEWAYS), [generateDistribution]);
  const listingData = useMemo(() => generateDistribution(LISTING_TYPES), [generateDistribution]);

  const handleExport = useCallback((format) => {
    try {
      setLoading(true);
      const reportTitle = REPORT_TITLES[activeReport] || 'Report';
      const dateLabel = getDateRangeLabel(datePreset, customStart, customEnd);
      const timestamp = new Date().toISOString().split('T')[0];
      const baseFilename = `payment_${activeReport}_report_${timestamp}`;
      const rows = buildExportData(activeReport, stats, timeSeriesData, methodData, gatewayData, propertyData, userTypeData);

      if (!rows || rows.length === 0) {
        setToast({ message: 'No data to export for this report', type: 'warning' });
        setLoading(false);
        return;
      }
      if (format === 'csv') {
        downloadCSV(rows, `${baseFilename}.csv`);
        setToast({ message: `CSV downloaded — ${reportTitle}`, type: 'success' });
      } else if (format === 'excel') {
        downloadExcel(rows, `${baseFilename}.xls`, reportTitle);
        setToast({ message: `Excel downloaded — ${reportTitle}`, type: 'success' });
      } else if (format === 'pdf') {
        setToast({ message: `Generating PDF — ${reportTitle}...`, type: 'info' });
        downloadPDF(rows, `${reportTitle} Report`, `Period: ${dateLabel}`);
        setTimeout(() => setToast({ message: `PDF downloaded ✅`, type: 'success' }), 1500);
      }
    } catch (error) {
      console.error('Export error:', error);
      setToast({ message: `Export failed: ${error.message}`, type: 'error' });
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, [activeReport, stats, timeSeriesData, methodData, gatewayData, propertyData, userTypeData, datePreset, customStart, customEnd]);

  const handleExportAll = useCallback((format) => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString().split('T')[0];
      const dateLabel = getDateRangeLabel(datePreset, customStart, customEnd);

      const genTimeSeries = () => {
        let labels = [];
        if (datePreset === 'today' || datePreset === 'yesterday') labels = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
        else if (datePreset === 'week') labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        else if (datePreset === 'month') labels = ['W1', 'W2', 'W3', 'W4'];
        else if (datePreset === 'quarter') labels = ['Jan', 'Feb', 'Mar'];
        else if (datePreset === 'year') labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        else if (datePreset === 'custom') labels = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
        else labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
        return labels.map(label => ({ label, value: Math.floor(Math.random() * 4000000) + 500000 }));
      };

      const allReports = ALL_REPORT_IDS.map((reportId) => {
        const reportStats = generateStatsFor();
        const tsData = genTimeSeries();
        const mData = PAYMENT_METHODS.map((m, i) => ({ label: m.label, value: Math.floor(Math.random() * 2000000) + 200000, color: UNIQUE_COLORS[i % UNIQUE_COLORS.length] }));
        const gData = PAYMENT_GATEWAYS.map((g, i) => ({ label: g.label, value: Math.floor(Math.random() * 2000000) + 200000, color: UNIQUE_COLORS[i % UNIQUE_COLORS.length] }));
        const pData = PROPERTY_TYPES.map((p, i) => ({ label: p.label, value: Math.floor(Math.random() * 2000000) + 200000, color: UNIQUE_COLORS[i % UNIQUE_COLORS.length] }));
        const uData = ALL_USER_TYPES.map((t, i) => ({ label: t, value: Math.floor(Math.random() * 1000000) + 50000, color: UNIQUE_COLORS[i % UNIQUE_COLORS.length] }));
        return {
          id: reportId,
          title: REPORT_TITLES[reportId] || reportId,
          rows: buildExportData(reportId, reportStats, tsData, mData, gData, pData, uData)
        };
      });

      if (format === 'csv') {
        allReports.forEach((report, i) => {
          setTimeout(() => {
            downloadCSV(report.rows, `payment_${report.id}_report_${timestamp}.csv`);
          }, i * 250);
        });
        setToast({ message: `Downloading all ${allReports.length} reports...`, type: 'success' });
      } else if (format === 'excel') {
        downloadMultiSheetExcel(allReports, `payment_all_reports_${timestamp}.xls`);
        setToast({ message: `Excel downloaded — ${allReports.length} sheets`, type: 'success' });
      } else if (format === 'pdf') {
        setToast({ message: `Generating full PDF...`, type: 'info' });
        downloadAllPDF(allReports, dateLabel);
        setTimeout(() => setToast({ message: `Full PDF downloaded ✅`, type: 'success' }), 2000);
      }
    } catch (error) {
      console.error('Export all error:', error);
      setToast({ message: `Export all failed: ${error.message}`, type: 'error' });
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  }, [datePreset, customStart, customEnd]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => { 
      computeStats(); 
      setLoading(false); 
      setToast({ message: 'Report data refreshed', type: 'success' }); 
    }, 1000);
  }, [computeStats]);

  const renderStatsCards = () => {
    const cards = [];
    switch (activeReport) {
      case 'revenue':
        cards.push(
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Total Revenue', value: formatCurrency(stats.totalRevenue), trend: 12.5, subtitle: 'vs previous period', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiActivity className="text-white text-base" />, title: 'Transactions', value: stats.totalTransactions, trend: 8.3, subtitle: 'Total count', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiTrendingUp className="text-white text-base" />, title: 'Avg Transaction', value: formatCurrency(stats.avgTransaction), trend: 3.2, subtitle: 'Per transaction', color: 'bg-gradient-to-br from-purple-600 to-violet-400' },
          { icon: <FiCheckCircle className="text-white text-base" />, title: 'Success Rate', value: `${stats.successRate}%`, trend: 2.1, subtitle: 'Completion rate', color: 'bg-gradient-to-br from-teal-600 to-emerald-400' }
        );
        break;
      case 'failed':
        cards.push(
          { icon: <FiXCircle className="text-white text-base" />, title: 'Failed Amount', value: formatCurrency(stats.failedAmount), trend: -5.2, subtitle: 'Total failed', color: 'bg-gradient-to-br from-red-600 to-rose-400' },
          { icon: <FiActivity className="text-white text-base" />, title: 'Failed Count', value: stats.failedCount, trend: -2.1, subtitle: 'Transactions', color: 'bg-gradient-to-br from-orange-600 to-amber-400' },
          { icon: <FiShield className="text-white text-base" />, title: 'Recovery Rate', value: `${stats.recoveryRate}%`, trend: 4.5, subtitle: 'Recovered', color: 'bg-gradient-to-br from-amber-600 to-yellow-400' },
          { icon: <FiTarget className="text-white text-base" />, title: 'Failure Rate', value: `${(100 - stats.successRate).toFixed(1)}%`, trend: -1.2, subtitle: 'Of total', color: 'bg-gradient-to-br from-rose-600 to-pink-400' }
        );
        break;
      case 'refund':
        cards.push(
          { icon: <FiRotateCcw className="text-white text-base" />, title: 'Refund Amount', value: formatCurrency(stats.refundAmount), trend: -3.1, subtitle: 'Total refunded', color: 'bg-gradient-to-br from-purple-600 to-violet-400' },
          { icon: <FiActivity className="text-white text-base" />, title: 'Refund Count', value: stats.refundCount, trend: -1.8, subtitle: 'Transactions', color: 'bg-gradient-to-br from-pink-600 to-rose-400' },
          { icon: <FiClock className="text-white text-base" />, title: 'Avg Refund Time', value: `${stats.avgRefundTime} days`, trend: -0.5, subtitle: 'Processing time', color: 'bg-gradient-to-br from-indigo-600 to-blue-400' },
          { icon: <FiPercent className="text-white text-base" />, title: 'Refund Rate', value: `${stats.refundRate}%`, trend: -0.8, subtitle: 'Of revenue', color: 'bg-gradient-to-br from-rose-600 to-pink-400' }
        );
        break;
      case 'commission':
        cards.push(
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Commission Earned', value: formatCurrency(stats.commissionEarned), trend: 15.2, subtitle: 'Total earned', color: 'bg-gradient-to-br from-amber-600 to-yellow-400' },
          { icon: <FiTrendingUp className="text-white text-base" />, title: 'Avg Commission', value: formatCurrency(stats.commissionEarned / 100), trend: 5.4, subtitle: 'Per transaction', color: 'bg-gradient-to-br from-orange-600 to-amber-400' },
          { icon: <FiAward className="text-white text-base" />, title: 'Commission Rate', value: '12.5%', trend: 1.2, subtitle: 'Of revenue', color: 'bg-gradient-to-br from-yellow-600 to-lime-400' },
          { icon: <FiStar className="text-white text-base" />, title: 'Top Earner', value: 'Premium', trend: 8.9, subtitle: 'Plan type', color: 'bg-gradient-to-br from-lime-600 to-green-400' }
        );
        break;
      case 'gateway':
        cards.push(
          { icon: <FiCreditCard className="text-white text-base" />, title: 'Settled Amount', value: formatCurrency(stats.settledAmount), trend: 10.1, subtitle: 'Successfully settled', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiClock className="text-white text-base" />, title: 'Pending Settlement', value: formatCurrency(stats.pendingSettlement), trend: -4.3, subtitle: 'In transit', color: 'bg-gradient-to-br from-orange-600 to-amber-400' },
          { icon: <FiGlobe className="text-white text-base" />, title: 'Active Gateways', value: PAYMENT_GATEWAYS.length, trend: 0, subtitle: 'Connected', color: 'bg-gradient-to-br from-indigo-600 to-violet-400' },
          { icon: <FiCheckCircle className="text-white text-base" />, title: 'Settlement Rate', value: '94.2%', trend: 1.8, subtitle: 'Success rate', color: 'bg-gradient-to-br from-teal-600 to-emerald-400' }
        );
        break;
      case 'property':
        cards.push(
          { icon: <FaBuilding className="text-white text-base" />, title: 'Total Properties', value: stats.totalProperties, trend: 6.7, subtitle: 'Listed', color: 'bg-gradient-to-br from-cyan-600 to-sky-400' },
          { icon: <FaHome className="text-white text-base" />, title: 'Top Type', value: 'Apartment', trend: 12.3, subtitle: 'Most popular', color: 'bg-gradient-to-br from-blue-600 to-indigo-400' },
          { icon: <FiMapPin className="text-white text-base" />, title: 'Top Location', value: 'Mumbai', trend: 4.5, subtitle: 'Highest revenue', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Avg Property Value', value: formatCompact(stats.totalRevenue / 200), trend: 2.8, subtitle: 'Per property', color: 'bg-gradient-to-br from-purple-600 to-violet-400' }
        );
        break;
      case 'owner':
        cards.push(
          { icon: <FaHome className="text-white text-base" />, title: 'Total Owners', value: stats.totalOwners, trend: 6.3, subtitle: 'Active owners', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiLayers className="text-white text-base" />, title: 'Properties Listed', value: Math.floor(Math.random() * 2000) + 500, trend: 9.7, subtitle: 'Total listings', color: 'bg-gradient-to-br from-teal-600 to-cyan-400' },
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Total Earnings', value: formatCompact(stats.totalRevenue * 0.5), trend: 13.2, subtitle: 'Owner revenue', color: 'bg-gradient-to-br from-green-600 to-emerald-400' },
          { icon: <FiStar className="text-white text-base" />, title: 'Avg Rating', value: stats.avgRating, trend: 0.2, subtitle: 'Out of 5', color: 'bg-gradient-to-br from-lime-600 to-green-400' }
        );
        break;
      case 'agent':
        cards.push(
          { icon: <FiBriefcase className="text-white text-base" />, title: 'Total Agents', value: stats.totalAgents, trend: 8.4, subtitle: 'Active agents', color: 'bg-gradient-to-br from-indigo-600 to-blue-400' },
          { icon: <FiAward className="text-white text-base" />, title: 'Top Agent', value: 'Rajesh K.', trend: 15.2, subtitle: 'Highest revenue', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Total Commission', value: formatCompact(stats.commissionEarned * 0.4), trend: 9.1, subtitle: 'Agent commission', color: 'bg-gradient-to-br from-purple-600 to-violet-400' },
          { icon: <FiTrendingUp className="text-white text-base" />, title: 'Avg Deal Size', value: formatCompact(stats.avgTransaction * 2), trend: 3.7, subtitle: 'Per deal', color: 'bg-gradient-to-br from-cyan-600 to-teal-400' }
        );
        break;
      case 'builder':
        cards.push(
          { icon: <FaHardHat className="text-white text-base" />, title: 'Total Builders', value: stats.totalBuilders, trend: 5.2, subtitle: 'Active builders', color: 'bg-gradient-to-br from-orange-600 to-amber-400' },
          { icon: <FiLayers className="text-white text-base" />, title: 'Projects', value: Math.floor(Math.random() * 300) + 50, trend: 7.8, subtitle: 'Ongoing projects', color: 'bg-gradient-to-br from-amber-600 to-yellow-400' },
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Total Revenue', value: formatCompact(stats.totalRevenue * 0.35), trend: 11.4, subtitle: 'Builder revenue', color: 'bg-gradient-to-br from-red-600 to-rose-400' },
          { icon: <FiTrendingUp className="text-white text-base" />, title: 'Avg Project Value', value: formatCompact(stats.totalRevenue / 100), trend: 4.1, subtitle: 'Per project', color: 'bg-gradient-to-br from-yellow-600 to-lime-400' }
        );
        break;
      case 'pm':
        cards.push(
          { icon: <FiClipboard className="text-white text-base" />, title: 'Total PMs', value: stats.totalPMs, trend: 7.1, subtitle: 'Active managers', color: 'bg-gradient-to-br from-purple-600 to-violet-400' },
          { icon: <FiHome className="text-white text-base" />, title: 'Properties Managed', value: Math.floor(Math.random() * 1500) + 300, trend: 10.5, subtitle: 'Under management', color: 'bg-gradient-to-br from-violet-600 to-purple-400' },
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Management Fees', value: formatCompact(stats.totalRevenue * 0.08), trend: 6.8, subtitle: 'Total fees', color: 'bg-gradient-to-br from-fuchsia-600 to-pink-400' },
          { icon: <FiUser className="text-white text-base" />, title: 'Avg Properties', value: Math.floor(Math.random() * 20) + 5, trend: 3.2, subtitle: 'Per manager', color: 'bg-gradient-to-br from-pink-600 to-rose-400' }
        );
        break;
      default: break;
    }
    return cards.map((card, i) => <StatCard key={i} {...card} delay={i * 100} />);
  };

  const renderChartSection = () => {
    switch (activeReport) {
      case 'revenue':
        return (
          <div className="space-y-6 animate-slide-in ">
            <ReportExportBar reportTitle="Revenue Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                      <FiTrendingUp className="text-[#00695C] animate-icon-float" /> Revenue Trend
                    </h3>
                    <p className="text-xs text-[#3D5A55] font-semibold">Revenue performance over time</p>
                  </div>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1">
                    <FiArrowUp className="text-[10px]" />+12.5%
                  </span>
                </div>
                <AreaChart data={timeSeriesData} height={280} color="#00695C" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-[#00695C]" /> Payment Methods
                </h3>
                <DonutChart 
                  data={methodData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.totalRevenue)} 
                />
              </div>
              
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiActivity className="text-[#00695C]" /> Revenue by User Type
                </h3>
                <div className="space-y-3">
                  {userTypeData.map((d, i) => (
                    <ProgressBar 
                      key={i} 
                      label={d.label} 
                      value={d.value} 
                      max={Math.max(...userTypeData.map(x => x.value))} 
                      color={d.color} 
                      icon={USER_TYPE_CONFIG[d.label]?.icon}
                      delay={i * 100}
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '300ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiGlobe className="text-[#00695C]" /> Gateway Distribution
                </h3>
                <DonutChart 
                  data={gatewayData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.totalRevenue)} 
                />
              </div>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Failed Payment Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiXCircle className="text-red-600 animate-icon-float" /> Failed Transactions Trend
                </h3>
                <AreaChart data={timeSeriesData} height={280} color="#EF4444" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-red-600" /> By Gateway
                </h3>
                <DonutChart 
                  data={gatewayData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.failedAmount)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiAlertTriangle className="text-red-600" /> Failure Reasons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Insufficient Funds', value: 342, color: '#EF4444', gradient: 'from-red-500 to-rose-400', icon: FiDollarSign },
                    { label: 'Network Error', value: 218, color: '#F59E0B', gradient: 'from-amber-500 to-orange-400', icon: FiGlobe },
                    { label: 'Card Declined', value: 156, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-400', icon: FiCreditCard },
                    { label: 'Timeout', value: 98, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400', icon: FiClock },
                    { label: 'Invalid Details', value: 67, color: '#EC4899', gradient: 'from-pink-500 to-rose-400', icon: FiXCircle }
                  ].map((d, i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-card-in border border-[#E8F0EE]"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <d.icon className="text-white text-base" />
                      </div>
                      <p className="text-3xl font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors">{d.value}</p>
                      <p className="text-xs text-[#3D5A55] font-bold mt-1">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'refund':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Refund Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiRotateCcw className="text-purple-600 animate-icon-float" /> Refund Trend
                </h3>
                <AreaChart data={timeSeriesData} height={280} color="#8B5CF6" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-purple-600" /> By User Type
                </h3>
                <DonutChart 
                  data={userTypeData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.refundAmount)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiFileText className="text-purple-600" /> Refund Reasons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Property Issue', value: 45, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400', icon: FiHome },
                    { label: 'Payment Error', value: 32, color: '#EC4899', gradient: 'from-pink-500 to-rose-400', icon: FiCreditCard },
                    { label: 'User Request', value: 28, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-400', icon: FiUser },
                    { label: 'Other', value: 15, color: '#F59E0B', gradient: 'from-amber-500 to-orange-400', icon: FiInfo }
                  ].map((d, i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-card-in border border-[#E8F0EE]"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${d.gradient} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <d.icon className="text-white text-xl" />
                      </div>
                      <p className="text-4xl font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors">{d.value}%</p>
                      <p className="text-xs text-[#3D5A55] font-bold mt-2">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'commission':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Commission Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-amber-600 animate-icon-float" /> Commission Trend
                </h3>
                <BarChart data={timeSeriesData} height={280} />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-amber-600" /> By User Type
                </h3>
                <DonutChart 
                  data={userTypeData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.commissionEarned)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiAward className="text-amber-600" /> Top Commission Earners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Rajesh Kumar', role: 'Agent', amount: 245000, color: '#3B82F6', gradient: 'from-blue-500 to-cyan-400', icon: FiBriefcase },
                    { name: 'Suresh Builders', role: 'Builder', amount: 189000, color: '#F97316', gradient: 'from-orange-500 to-amber-400', icon: FaHardHat },
                    { name: 'Priya Properties', role: 'Owner', amount: 156000, color: '#10B981', gradient: 'from-emerald-500 to-teal-400', icon: FaHome },
                    { name: 'Anitha Estates', role: 'Agent', amount: 134000, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400', icon: FiBriefcase }
                  ].map((d, i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-[#E8F0EE] group animate-card-in"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${d.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <d.icon className="text-base" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#0F1A18] truncate">{d.name}</p>
                          <p className="text-[10px] text-[#3D5A55] font-bold">{d.role}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black" style={{ color: d.color }}>{formatCurrency(d.amount)}</p>
                      <div className="mt-3 flex items-center gap-1">
                        <FiAward className="text-xs text-amber-500 animate-bounce-subtle" />
                        <span className="text-[10px] font-black text-amber-700">Rank #{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'gateway':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Gateway Settlement Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiCreditCard className="text-blue-600 animate-icon-float" /> Gateway Settlement Trend
                </h3>
                <AreaChart data={timeSeriesData} height={280} color="#3B82F6" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-blue-600" /> Gateway Share
                </h3>
                <DonutChart 
                  data={gatewayData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.settledAmount)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiGlobe className="text-blue-600" /> Settlement Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E8F0EE] bg-gradient-to-r from-[#F5F9F8] to-white">
                        <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Gateway</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Settled</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Pending</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Fees</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Net</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYMENT_GATEWAYS.map((g, i) => {
                        const w = GATEWAY_WEIGHTS[i % GATEWAY_WEIGHTS.length];
                        const settled = Math.floor((stats.settledAmount || 0) * w);
                        const pending = Math.floor((stats.pendingSettlement || 0) * w);
                        const fees = Math.floor(settled * 0.02);
                        const rate = (90 + i * 1.5).toFixed(1);
                        return (
                          <tr key={i} className="border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors cursor-pointer group">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <span 
                                  className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125" 
                                  style={{ backgroundColor: g.color, boxShadow: `0 0 8px ${g.color}60` }} 
                                />
                                <span className="font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors">{g.label}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4 font-black text-emerald-700">{formatCompact(settled)}</td>
                            <td className="text-right py-3 px-4 font-black text-amber-700">{formatCompact(pending)}</td>
                            <td className="text-right py-3 px-4 font-black text-red-600">{formatCompact(fees)}</td>
                            <td className="text-right py-3 px-4 font-black text-[#00695C]">{formatCompact(settled - fees)}</td>
                            <td className="text-right py-3 px-4">
                              <span className="text-xs font-black text-white bg-emerald-600 px-2.5 py-1 rounded-full">
                                {rate}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'property':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Property-wise Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FaBuilding className="text-cyan-600 animate-icon-float" /> Property Type Revenue
                </h3>
                <BarChart data={propertyData} height={280} />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-cyan-600" /> Distribution
                </h3>
                <DonutChart 
                  data={propertyData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(stats.totalRevenue)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiLayers className="text-cyan-600" /> Property Type Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {PROPERTY_TYPES.map((p, i) => {
                    const Icon = p.icon;
                    const w = PROPERTY_WEIGHTS[i % PROPERTY_WEIGHTS.length];
                    const value = Math.floor((stats.totalRevenue || 0) * w);
                    const count = Math.floor((stats.totalProperties || 0) * w);
                    return (
                      <div 
                        key={i} 
                        className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-[#E8F0EE] group animate-card-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                            <Icon className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-[#0F1A18] truncate">{p.label}</p>
                            <p className="text-[10px] text-[#3D5A55] font-bold">{count} properties</p>
                          </div>
                        </div>
                        <p className="text-xl font-black" style={{ color: p.color }}>{formatCompact(value)}</p>
                        <div className="mt-2 flex items-center gap-1">
                          <FiTrendingUp className="text-xs text-emerald-600" />
                          <span className="text-[10px] font-black text-emerald-700">+{(5 + i * 1.4).toFixed(1)}% growth</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'owner':
      case 'agent':
      case 'builder':
      case 'pm': {
        const roleKey = { owner: 'Owner', agent: 'Agent', builder: 'Builder', pm: 'Property Manager' }[activeReport];
        const roleConfig = USER_TYPE_CONFIG[roleKey];
        const RoleIcon = roleConfig.icon;
        const rolePlans = PLANS_BY_USER_TYPE[roleKey] || [];
        const reportTitleForRole = `${roleKey}-wise Report Export`;
        const roleNames = {
          'Owner': ['Priya Properties', 'Suresh Estates', 'Anitha Homes', 'Vijay Realty', 'Meena Properties'],
          'Agent': ['Rajesh Kumar', 'Priya Sharma', 'Suresh Reddy', 'Anitha Nair', 'Vijay Menon'],
          'Builder': ['Suresh Builders', 'Prestige Group', 'DLF Ltd', 'Godrej Properties', 'Lodha Group'],
          'Property Manager': ['ABC Property Mgmt', 'Prime Estates', 'Urban Homes', 'Metro PM', 'City Managers']
        }[roleKey] || [];
        const shareArr = [0.30, 0.24, 0.18, 0.16, 0.12];
        const roleBase = activeReport === 'agent' ? stats.commissionEarned * 0.4
                       : activeReport === 'builder' ? stats.totalRevenue * 0.35
                       : activeReport === 'pm' ? stats.totalRevenue * 0.08
                       : stats.totalRevenue * 0.5;
        
        const planData = rolePlans.map((p, i) => ({
          label: p,
          value: Math.floor((roleBase || 1000000) * [0.35, 0.30, 0.20, 0.15][i % 4]),
          color: UNIQUE_COLORS[i % UNIQUE_COLORS.length]
        }));
        
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle={reportTitleForRole} onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <RoleIcon style={{ color: roleConfig.color }} className="animate-icon-float" /> {roleKey} Revenue Trend
                </h3>
                <AreaChart data={timeSeriesData} height={280} color={roleConfig.color} />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart style={{ color: roleConfig.color }} /> By Plan
                </h3>
                <DonutChart 
                  data={planData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(roleBase || 1000000)} 
                />
              </div>
              
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiActivity style={{ color: roleConfig.color }} /> Plan-wise Distribution
                </h3>
                <div className="space-y-3">
                  {rolePlans.map((plan, i) => (
                    <ProgressBar 
                      key={i} 
                      label={plan} 
                      value={Math.floor((roleBase || 1000000) * [0.35, 0.30, 0.20, 0.15][i % 4])} 
                      max={roleBase || 1000000} 
                      color={UNIQUE_COLORS[i % UNIQUE_COLORS.length]} 
                      icon={FiAward}
                      delay={i * 100}
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '300ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiBarChart2 style={{ color: roleConfig.color }} /> Listing Types
                </h3>
                <DonutChart 
                  data={listingData} 
                  size={220} 
                  thickness={48} 
                  centerLabel="Total" 
                  centerValue={formatCompact(roleBase || 1000000)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-in" style={{ animationDelay: '400ms' }}>
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiAward style={{ color: roleConfig.color }} /> Top {roleKey}s
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E8F0EE] bg-gradient-to-r from-[#F5F9F8] to-white">
                        <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">#</th>
                        <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Name</th>
                        <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Plan</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Deals</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Revenue</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roleNames.map((n, i) => (
                        <tr 
                          key={i} 
                          className="border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors cursor-pointer group animate-slide-in"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <td className="py-3 px-4">
                            <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-black transition-all duration-300 group-hover:scale-110 ${
                              i === 0 ? 'bg-amber-200 text-amber-900 shadow-sm shadow-amber-300' : 
                              i === 1 ? 'bg-gray-200 text-gray-800' : 
                              i === 2 ? 'bg-orange-200 text-orange-900' : 
                              'bg-[#D5F0EA] text-[#00695C]'
                            }`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors">{n}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-[#00695C] text-white">
                              {rolePlans[i % rolePlans.length] || 'Basic'}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 font-black text-[#0F1A18]">{Math.floor(40 - i * 5)}</td>
                          <td className="text-right py-3 px-4 font-black text-[#00695C]">{formatCompact((roleBase || 1000000) * shareArr[i])}</td>
                          <td className="text-right py-3 px-4">
                            <span className="text-xs font-black text-white bg-emerald-600 px-2.5 py-1 rounded-full inline-flex items-center gap-0.5">
                              <FiArrowUp className="text-[9px]" />+{(20 - i * 2.5).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen bg-[#F8FAF9]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float bg-[#00695C]/5" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float-delayed bg-[#26A69A]/5" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full blur-3xl animate-pulse-slow bg-[#8B5CF6]/3" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <div className="relative z-50 animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Payment Reports
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full animate-pulse-slow flex items-center gap-1.5">
                <FiActivity className="text-[10px]" />
                Analytics Dashboard
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Comprehensive payment analytics and reports</span>
              <span className="w-1.5 h-1.5 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-black flex items-center gap-1">
                <FiCalendar className="text-xs" />
                {getDateRangeLabel(datePreset, customStart, customEnd)}
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <DateRangePicker 
              selected={datePreset} 
              onSelect={setDatePreset} 
              customStart={customStart} 
              customEnd={customEnd} 
              onCustomChange={(start, end) => { setCustomStart(start); setCustomEnd(end); }} 
            />
            
            <ExportDropdown onExportAll={handleExportAll} disabled={loading} />
            
            <button 
              onClick={handleRefresh} 
              disabled={loading} 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-black text-[#0F1A18] disabled:opacity-50 hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-0 animate-slide-in ">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 ">
          {REPORT_TYPES.map((report, idx) => (
            <ReportTypeCard 
              key={report.id} 
              report={report} 
              isActive={activeReport === report.id} 
              onClick={() => setActiveReport(report.id)} 
              index={idx}
              
            />
          ))}
        </div>
      </div>

      <div className="relative z-0 animate-slide-in">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderStatsCards()}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#26A69A] rounded-full animate-spin-reverse" />
            </div>
            <p className="text-sm text-[#3D5A55] font-bold animate-pulse">Loading report data...</p>
          </div>
        </div>
      ) : renderChartSection()}

      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slide-in { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slide-down { 
          from { opacity: 0; transform: translateY(-10px) scale(0.95); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-15px); } 
        }
        @keyframes float-delayed { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(15px); } 
        }
        @keyframes icon-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; opacity: 0; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-dropdown-in { animation: dropdown-in 0.3s ease-out forwards; }
        .animate-toast-in { animation: toast-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-card-in { animation: card-in 0.5s ease-out forwards; opacity: 0; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-count-up { animation: count-up 0.6s ease-out forwards; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F5F4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #8FA8A4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00695C; }
        
        button, select, input, [role="button"] {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default PaymentReports;