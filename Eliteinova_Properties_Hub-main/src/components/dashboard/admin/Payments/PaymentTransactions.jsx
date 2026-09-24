// src/components/admin/Payments/PaymentTransactions.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiFileText, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiMail, FiPhone, FiCreditCard, FiClock,
  FiRotateCcw, FiDollarSign, FiTrendingUp, FiCalendar, FiHome,
  FiClipboard, FiShoppingBag, FiKey, FiMap, FiLayers, FiPackage,
  FiPercent, FiServer, FiGlobe, FiShield, FiAward, FiTarget,
  FiUsers, FiHome as FiHomeIcon, FiCheck, FiMoreVertical, FiPlus,
  FiThumbsUp, FiSend, FiLock, FiUnlock, FiExternalLink, FiArrowLeft
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaCheckDouble } from 'react-icons/fa';

// ============================================================
// PAYMENT STATUS CONFIG
// ============================================================
const STATUS_TYPES = {
  'Successful': {
    icon: FiCheckCircle,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Successful'
  },
  'Pending': {
    icon: FiClock,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Pending'
  },
  'Failed': {
    icon: FiXCircle,
    color: 'from-red-600 to-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Failed'
  },
  'Cancelled': {
    icon: FiXCircle,
    color: 'from-slate-600 to-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: 'Cancelled'
  },
  'Refunded': {
    icon: FiRotateCcw,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Refunded'
  },
  'Partially Refunded': {
    icon: FiRotateCcw,
    color: 'from-indigo-600 to-indigo-400',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    label: 'Partially Refunded'
  },
  'Payment Initiated': {
    icon: FiClock,
    color: 'from-cyan-600 to-cyan-400',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    label: 'Payment Initiated'
  },
  'Under Verification': {
    icon: FiShield,
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Under Verification'
  }
};

const ALL_STATUSES = Object.keys(STATUS_TYPES);

// ============================================================
// REFUND STATUS CONFIG
// ============================================================
const REFUND_STATUS_TYPES = {
  'Not Applicable': {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    label: 'Not Applicable'
  },
  'Requested': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Requested'
  },
  'Processing': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Processing'
  },
  'Completed': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Completed'
  },
  'Rejected': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Rejected'
  },
  'Partially Completed': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    label: 'Partially Completed'
  }
};

const ALL_REFUND_STATUSES = Object.keys(REFUND_STATUS_TYPES);

// ============================================================
// USER TYPE CONFIG
// ============================================================
const USER_TYPE_CONFIG = {
  'Owner': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Agent': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Builder': { icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Buyer': { icon: FiShoppingBag, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Tenant': { icon: FiKey, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' }
};

const ALL_USER_TYPES = Object.keys(USER_TYPE_CONFIG);

// ============================================================
// PROPERTY TYPE CONFIG
// ============================================================
const PROPERTY_TYPE_CONFIG = {
  'Individual': { icon: FiUser, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  'Apartment': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Commercial': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Land & Plots': { icon: FiMap, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Hostel': { icon: FaHotel, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
};

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

// ============================================================
// PAYMENT PURPOSE CONFIG
// ============================================================
const PAYMENT_PURPOSE_CONFIG = {
  'Property Listing Fee': { icon: FiHomeIcon, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Property Promotion': { icon: FiTrendingUp, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Featured Listing': { icon: FiAward, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Subscription': { icon: FiTag, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Lead Purchase': { icon: FiTarget, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Contact Access': { icon: FiPhone, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Agent Subscription': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Builder Subscription': { icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Owner Subscription': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Property Management Service': { icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Loan Service': { icon: FiDollarSign, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }
};

const ALL_PAYMENT_PURPOSES = Object.keys(PAYMENT_PURPOSE_CONFIG);

// ============================================================
// PAYMENT METHOD OPTIONS
// ============================================================
const ALL_PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'Bank Transfer', 'Cash', 'Payment Link', 'Other'];

// ============================================================
// PAYMENT GATEWAY OPTIONS
// ============================================================
const ALL_PAYMENT_GATEWAYS = ['Razorpay', 'Stripe', 'Cashfree', 'Bank Transfer', 'Manual Payment'];

// ============================================================
// VERIFICATION STATUS CONFIG
// ============================================================
const VERIFICATION_STATUS = {
  'Unverified': {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: FiShield,
    label: 'Unverified',
    description: 'Payment not yet verified'
  },
  'Verified': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: FiCheckCircle,
    label: 'Verified',
    description: 'Payment has been verified'
  },
  'Approved': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: FiThumbsUp,
    label: 'Approved',
    description: 'Payment has been approved'
  }
};

// ============================================================
// CURRENCY FORMAT HELPER
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

// ============================================================
// DOWNLOAD FILE HELPER (Actual File Download)
// ============================================================
const downloadFile = (content, filename, mimeType = 'application/pdf') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================================
// GENERATE RECEIPT PDF CONTENT (HTML formatted for print/PDF)
// ============================================================
const generateReceiptHTML = (transaction) => {
  const rows = [
    ['Transaction ID', transaction.transactionId],
    ['Payment ID', transaction.paymentId],
    ['Customer Name', transaction.userName],
    ['Customer Email', transaction.userEmail || 'N/A'],
    ['Customer Phone', transaction.userPhone || 'N/A'],
    ['Property Name', transaction.propertyName],
    ['Property ID', transaction.propertyId],
    ['Payment Purpose', transaction.paymentPurpose],
    ['Amount', formatCurrency(transaction.amount)],
    ['Tax/GST', formatCurrency(transaction.tax)],
    ['Total Amount', formatCurrency(transaction.totalAmount)],
    ['Payment Method', transaction.paymentMethod],
    ['Payment Gateway', transaction.paymentGateway],
    ['Payment Date', new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Payment Status', transaction.paymentStatus],
    ['Verification Status', transaction.verificationStatus || 'Unverified']
  ];

  const tableRows = rows.map(([key, value]) => `
    <tr>
      <td style="padding: 10px 14px; border: 1px solid #ddd; font-weight: 600; background: #f5f9f8; width: 40%; color: #1A2E2A;">${key}</td>
      <td style="padding: 10px 14px; border: 1px solid #ddd; color: #1A2E2A;">${value}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payment Receipt - ${transaction.transactionId}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1A2E2A; background: #fff; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #00695C; }
        .header h1 { color: #00695C; font-size: 28px; margin-bottom: 8px; }
        .header p { color: #5A7D78; font-size: 13px; }
        .header .badge { display: inline-block; padding: 4px 12px; background: #E8F4F2; color: #00695C; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; }
        .info-box { background: #F5F9F8; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00695C; }
        .info-box p { font-size: 13px; color: #5A7D78; margin-bottom: 4px; }
        .info-box strong { color: #1A2E2A; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 8px; overflow: hidden; }
        .total-row { background: #00695C !important; color: #fff !important; }
        .total-row td { color: #fff !important; font-size: 16px; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #5A7D78; border-top: 2px solid #E8F0EE; padding-top: 20px; }
        .footer p { margin-bottom: 4px; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(0, 105, 92, 0.05); font-weight: bold; z-index: -1; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="watermark">RECEIPT</div>
      <div class="header">
        <h1>Payment Receipt</h1>
        <p>Official Receipt for Payment Transaction</p>
        <div class="badge">Receipt No: RCPT-${transaction.transactionId.replace('TXN-', '')}</div>
      </div>

      <div class="info-box">
        <p><strong>Issued To:</strong> ${transaction.userName}</p>
        <p><strong>Issued On:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p><strong>Transaction Date:</strong> ${new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <table>
        ${tableRows}
        <tr class="total-row">
          <td style="padding: 14px; border: 1px solid #00695C; font-weight: 600;">Total Amount Paid</td>
          <td style="padding: 14px; border: 1px solid #00695C; font-weight: bold;">${formatCurrency(transaction.totalAmount)}</td>
        </tr>
      </table>

      <div class="footer">
        <p><strong>Thank you for your payment!</strong></p>
        <p>This is a computer-generated receipt. No signature is required.</p>
        <p>© ${new Date().getFullYear()} Real Estate Admin. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// ============================================================
// GENERATE INVOICE PDF CONTENT (HTML formatted for print/PDF)
// ============================================================
const generateInvoiceHTML = (transaction) => {
  const rows = [
    ['Invoice No', `INV-${transaction.transactionId.replace('TXN-', '')}`],
    ['Transaction ID', transaction.transactionId],
    ['Payment ID', transaction.paymentId],
    ['Customer Name', transaction.userName],
    ['Customer Email', transaction.userEmail || 'N/A'],
    ['Customer Phone', transaction.userPhone || 'N/A'],
    ['Property Name', transaction.propertyName],
    ['Property ID', transaction.propertyId],
    ['Property Type', transaction.propertyType],
    ['Payment Purpose', transaction.paymentPurpose],
    ['Amount', formatCurrency(transaction.amount)],
    ['Tax/GST (18%)', formatCurrency(transaction.tax)],
    ['Payment Method', transaction.paymentMethod],
    ['Payment Gateway', transaction.paymentGateway],
    ['Payment Date', new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Payment Status', transaction.paymentStatus],
    ['Verification Status', transaction.verificationStatus || 'Unverified']
  ];

  const tableRows = rows.map(([key, value]) => `
    <tr>
      <td style="padding: 10px 14px; border: 1px solid #ddd; font-weight: 600; background: #f5f9f8; width: 40%; color: #1A2E2A;">${key}</td>
      <td style="padding: 10px 14px; border: 1px solid #ddd; color: #1A2E2A;">${value}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Tax Invoice - ${transaction.transactionId}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1A2E2A; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #26A69A; }
        .header-left h1 { color: #00695C; font-size: 32px; margin-bottom: 5px; }
        .header-left p { color: #5A7D78; font-size: 13px; }
        .header-right { text-align: right; }
        .header-right h2 { color: #26A69A; font-size: 20px; margin-bottom: 5px; }
        .header-right p { color: #5A7D78; font-size: 13px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 25px; }
        .invoice-box { background: #F5F9F8; padding: 16px; border-radius: 8px; flex: 1; margin-right: 15px; border-left: 4px solid #00695C; }
        .invoice-box:last-child { margin-right: 0; }
        .invoice-box h3 { font-size: 12px; color: #5A7D78; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
        .invoice-box p { font-size: 13px; color: #1A2E2A; margin-bottom: 4px; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 8px; overflow: hidden; }
        .total-row { background: #00695C !important; }
        .total-row td { color: #fff !important; font-size: 16px; font-weight: bold; padding: 14px; border: 1px solid #00695C; }
        .subtotal-row { background: #E8F4F2 !important; }
        .subtotal-row td { color: #00695C !important; font-weight: 600; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #5A7D78; border-top: 2px solid #E8F0EE; padding-top: 20px; }
        .footer p { margin-bottom: 4px; }
        .terms { background: #F8FAF9; padding: 15px; border-radius: 8px; margin-top: 25px; }
        .terms h4 { font-size: 12px; color: #00695C; margin-bottom: 8px; text-transform: uppercase; }
        .terms ul { list-style: none; padding-left: 0; }
        .terms li { font-size: 11px; color: #5A7D78; margin-bottom: 4px; padding-left: 15px; position: relative; }
        .terms li:before { content: "•"; color: #26A69A; position: absolute; left: 0; font-weight: bold; }
        .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(38, 166, 154, 0.05); font-weight: bold; z-index: -1; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="watermark">INVOICE</div>
      <div class="header">
        <div class="header-left">
          <h1>TAX INVOICE</h1>
          <p>Real Estate Payment Services</p>
        </div>
        <div class="header-right">
          <h2>INV-${transaction.transactionId.replace('TXN-', '')}</h2>
          <p>Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>Transaction: ${transaction.transactionId}</p>
        </div>
      </div>

      <div class="invoice-details">
        <div class="invoice-box">
          <h3>Billed To</h3>
          <p><strong>${transaction.userName}</strong></p>
          <p>${transaction.userEmail || 'N/A'}</p>
          <p>${transaction.userPhone || 'N/A'}</p>
        </div>
        <div class="invoice-box">
          <h3>Property Details</h3>
          <p><strong>${transaction.propertyName}</strong></p>
          <p>ID: ${transaction.propertyId}</p>
          <p>Type: ${transaction.propertyType}</p>
        </div>
      </div>

      <table>
        <tr style="background: #00695C;">
          <td style="padding: 12px 14px; border: 1px solid #00695C; color: #fff; font-weight: 600; font-size: 13px;">Description</td>
          <td style="padding: 12px 14px; border: 1px solid #00695C; color: #fff; font-weight: 600; font-size: 13px; text-align: right;">Amount</td>
        </tr>
        <tr>
          <td style="padding: 12px 14px; border: 1px solid #ddd; color: #1A2E2A; font-size: 13px;">
            <strong>${transaction.paymentPurpose}</strong><br/>
            <span style="font-size: 11px; color: #5A7D78;">${transaction.description || 'Payment for services rendered'}</span>
          </td>
          <td style="padding: 12px 14px; border: 1px solid #ddd; color: #1A2E2A; font-size: 13px; text-align: right; font-weight: 600;">${formatCurrency(transaction.amount)}</td>
        </tr>
        <tr class="subtotal-row">
          <td style="padding: 10px 14px; border: 1px solid #ddd; color: #00695C; font-weight: 600; font-size: 13px;">Subtotal</td>
          <td style="padding: 10px 14px; border: 1px solid #ddd; color: #00695C; font-weight: 600; font-size: 13px; text-align: right;">${formatCurrency(transaction.amount)}</td>
        </tr>
        <tr class="subtotal-row">
          <td style="padding: 10px 14px; border: 1px solid #ddd; color: #00695C; font-weight: 600; font-size: 13px;">Tax / GST (18%)</td>
          <td style="padding: 10px 14px; border: 1px solid #ddd; color: #00695C; font-weight: 600; font-size: 13px; text-align: right;">${formatCurrency(transaction.tax)}</td>
        </tr>
        <tr class="total-row">
          <td style="padding: 14px; border: 1px solid #00695C; color: #fff; font-weight: bold; font-size: 16px;">Total Amount</td>
          <td style="padding: 14px; border: 1px solid #00695C; color: #fff; font-weight: bold; font-size: 16px; text-align: right;">${formatCurrency(transaction.totalAmount)}</td>
        </tr>
      </table>

      <div class="terms">
        <h4>Payment Information</h4>
        <ul>
          <li>Payment Method: ${transaction.paymentMethod}</li>
          <li>Payment Gateway: ${transaction.paymentGateway}</li>
          <li>Payment Date: ${new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
          <li>Payment Status: ${transaction.paymentStatus}</li>
          <li>Verification Status: ${transaction.verificationStatus || 'Unverified'}</li>
        </ul>
      </div>

      <div class="footer">
        <p><strong>Thank you for your business!</strong></p>
        <p>This is a computer-generated invoice. No signature is required.</p>
        <p>For any queries, please contact support@realestateadmin.com</p>
        <p>© ${new Date().getFullYear()} Real Estate Admin. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// ============================================================
// ACTUAL DOWNLOAD FUNCTION - Opens print dialog to save as PDF
// ============================================================
const downloadAsPDF = (htmlContent, filename) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  if (!printWindow) {
    // If popup blocked, download as HTML file instead
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return 'html-fallback';
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Don't close automatically - let user save
    }, 500);
  };

  return 'print';
};

// ============================================================
// TOAST COMPONENT
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

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

// ============================================================
// CONFIRMATION MODAL
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: { icon: 'text-red-600', bg: 'bg-red-50', button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500', border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', border: 'border-amber-200' },
    info: { icon: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', border: 'border-blue-200' },
    success: { icon: 'text-emerald-600', bg: 'bg-emerald-50', button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500', border: 'border-emerald-200' }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className={`p-6 ${style.bg} border-b ${style.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border}`}>
              <FiAlertTriangle className={`text-2xl ${style.icon}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{title || 'Confirm Action'}</h3>
              <p className="text-sm text-[#5A7D78]">{message || 'Are you sure you want to proceed?'}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#5A7D78] leading-relaxed">This action cannot be undone. Please confirm your decision.</p>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] ${style.button}`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TRANSACTION ACTIONS MODAL
// ============================================================
const TransactionActionsModal = ({ transaction, show, onClose, onAction, onToast }) => {
  if (!transaction || !show) return null;

  const statusConfig = STATUS_TYPES[transaction.paymentStatus] || STATUS_TYPES['Pending'];
  const StatusIcon = statusConfig.icon;
  const verificationConfig = VERIFICATION_STATUS[transaction.verificationStatus || 'Unverified'];
  const VerificationIcon = verificationConfig.icon;

  const getAvailableActions = () => {
    const actions = [];
    const status = transaction.paymentStatus;

    actions.push({
      id: 'view-payment',
      label: 'View Payment',
      icon: FiEye,
      color: 'text-[#00695C]',
      bg: 'bg-[#E8F4F2]',
      hoverBg: 'hover:bg-[#C5EDE5]',
      description: 'View full payment details'
    });

    if (!transaction.verificationStatus || transaction.verificationStatus === 'Unverified') {
      actions.push({
        id: 'verify-payment',
        label: 'Verify Payment',
        icon: FiShield,
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        hoverBg: 'hover:bg-purple-100',
        description: 'Verify this payment'
      });
    }

    if (status === 'Pending' || status === 'Payment Initiated' || status === 'Under Verification') {
      actions.push({
        id: 'approve-payment',
        label: 'Approve Payment',
        icon: FiThumbsUp,
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        hoverBg: 'hover:bg-blue-100',
        description: 'Approve this payment'
      });
    }

    if (status === 'Pending' || status === 'Payment Initiated' || status === 'Under Verification') {
      actions.push({
        id: 'mark-paid',
        label: 'Mark as Paid',
        icon: FiCheckCircle,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        hoverBg: 'hover:bg-emerald-100',
        description: 'Mark this payment as paid'
      });
    }

    if (status === 'Successful' || status === 'Partially Refunded') {
      actions.push({
        id: 'process-refund',
        label: 'Process Refund',
        icon: FiRotateCcw,
        color: 'text-indigo-700',
        bg: 'bg-indigo-50',
        hoverBg: 'hover:bg-indigo-100',
        description: 'Initiate a refund for this payment'
      });
    }

    actions.push({
      id: 'download-receipt',
      label: 'Download Receipt',
      icon: FiDownload,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      hoverBg: 'hover:bg-amber-100',
      description: 'Download payment receipt as PDF'
    });

    actions.push({
      id: 'download-invoice',
      label: 'Download Invoice',
      icon: FiFileText,
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      hoverBg: 'hover:bg-orange-100',
      description: 'Download payment invoice as PDF'
    });

    actions.push({
      id: 'add-note',
      label: 'Add Payment Note',
      icon: FiPlus,
      color: 'text-cyan-700',
      bg: 'bg-cyan-50',
      hoverBg: 'hover:bg-cyan-100',
      description: 'Add a note to this payment'
    });

    actions.push({
      id: 'view-customer',
      label: 'View Customer',
      icon: FiUser,
      color: 'text-pink-700',
      bg: 'bg-pink-50',
      hoverBg: 'hover:bg-pink-100',
      description: 'View customer details'
    });

    actions.push({
      id: 'view-property',
      label: 'View Property',
      icon: FiHomeIcon,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      hoverBg: 'hover:bg-teal-100',
      description: 'View property details'
    });

    actions.push({
      id: 'view-history',
      label: 'View Transaction History',
      icon: FiClock,
      color: 'text-slate-700',
      bg: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100',
      description: 'View all transactions for this customer'
    });

    return actions;
  };

  const actions = getAvailableActions();

  const handleAction = (actionId) => {
    onAction(actionId, transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-lg`}>
              <StatusIcon className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Transaction Actions</h2>
              <p className="text-white/80 text-sm">
                {transaction.transactionId} • {transaction.userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
              <StatusIcon className="text-xs" /> {statusConfig.label}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
              <VerificationIcon className="text-xs" /> {verificationConfig.label}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
              {formatCurrency(transaction.totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border border-[#E8F0EE] ${action.bg} ${action.hoverBg} transition-all duration-300 hover:scale-[1.02] hover:shadow-md text-left group animate-slide-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300 border border-[#E8F0EE]`}>
                    <ActionIcon className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold ${action.color}`}>{action.label}</p>
                    <p className="text-[11px] text-[#5A7D78] truncate">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW TRANSACTION DETAIL MODAL - WITH ALL ACTIONS INSIDE
// ============================================================
const ViewTransactionDetailModal = ({ transaction, show, onClose, onEdit, onDelete, onAction }) => {
  if (!transaction || !show) return null;

  const statusConfig = STATUS_TYPES[transaction.paymentStatus] || STATUS_TYPES['Pending'];
  const StatusIcon = statusConfig.icon;
  const refundConfig = REFUND_STATUS_TYPES[transaction.refundStatus] || REFUND_STATUS_TYPES['Not Applicable'];
  const userTypeConfig = USER_TYPE_CONFIG[transaction.userType] || USER_TYPE_CONFIG['Owner'];
  const UserTypeIcon = userTypeConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[transaction.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;
  const purposeConfig = PAYMENT_PURPOSE_CONFIG[transaction.paymentPurpose] || PAYMENT_PURPOSE_CONFIG['Property Listing Fee'];
  const PurposeIcon = purposeConfig.icon;
  const verificationConfig = VERIFICATION_STATUS[transaction.verificationStatus || 'Unverified'];
  const VerificationIcon = verificationConfig.icon;

  const getAvailableActions = () => {
    const actions = [];
    const status = transaction.paymentStatus;

    if (!transaction.verificationStatus || transaction.verificationStatus === 'Unverified') {
      actions.push({
        id: 'verify-payment',
        label: 'Verify Payment',
        icon: FiShield,
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        hoverBg: 'hover:bg-purple-100',
        border: 'border-purple-200'
      });
    }

    if (status === 'Pending' || status === 'Payment Initiated' || status === 'Under Verification') {
      actions.push({
        id: 'approve-payment',
        label: 'Approve Payment',
        icon: FiThumbsUp,
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        hoverBg: 'hover:bg-blue-100',
        border: 'border-blue-200'
      });
    }

    if (status === 'Pending' || status === 'Payment Initiated' || status === 'Under Verification') {
      actions.push({
        id: 'mark-paid',
        label: 'Mark as Paid',
        icon: FiCheckCircle,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        hoverBg: 'hover:bg-emerald-100',
        border: 'border-emerald-200'
      });
    }

    if (status === 'Successful' || status === 'Partially Refunded') {
      actions.push({
        id: 'process-refund',
        label: 'Process Refund',
        icon: FiRotateCcw,
        color: 'text-indigo-700',
        bg: 'bg-indigo-50',
        hoverBg: 'hover:bg-indigo-100',
        border: 'border-indigo-200'
      });
    }

    actions.push({
      id: 'download-receipt',
      label: 'Download Receipt',
      icon: FiDownload,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      hoverBg: 'hover:bg-amber-100',
      border: 'border-amber-200'
    });

    actions.push({
      id: 'download-invoice',
      label: 'Download Invoice',
      icon: FiFileText,
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      hoverBg: 'hover:bg-orange-100',
      border: 'border-orange-200'
    });

    actions.push({
      id: 'add-note',
      label: 'Add Payment Note',
      icon: FiPlus,
      color: 'text-cyan-700',
      bg: 'bg-cyan-50',
      hoverBg: 'hover:bg-cyan-100',
      border: 'border-cyan-200'
    });

    actions.push({
      id: 'view-customer',
      label: 'View Customer',
      icon: FiUser,
      color: 'text-pink-700',
      bg: 'bg-pink-50',
      hoverBg: 'hover:bg-pink-100',
      border: 'border-pink-200'
    });

    actions.push({
      id: 'view-property',
      label: 'View Properties',
      icon: FiHomeIcon,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
      hoverBg: 'hover:bg-teal-100',
      border: 'border-teal-200'
    });

    actions.push({
      id: 'view-history',
      label: 'View Transaction History',
      icon: FiClock,
      color: 'text-slate-700',
      bg: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100',
      border: 'border-slate-200'
    });

    return actions;
  };

  const availableActions = getAvailableActions();

  const handleActionClick = (actionId) => {
    if (onAction) {
      onAction(actionId, transaction);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl ${statusConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${statusConfig.text} shadow-lg`}>
              <StatusIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{transaction.userName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
                  <VerificationIcon className="inline text-xs mr-1" />{verificationConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Transaction ID: {transaction.transactionId}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">{formatCurrency(transaction.totalAmount)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <UserTypeIcon className="text-xs" /> {transaction.userType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <PurposeIcon className="text-xs" /> {transaction.paymentPurpose}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiCreditCard className="text-xs" /> {transaction.paymentMethod}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiServer className="text-xs" /> {transaction.paymentGateway}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Transaction ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.transactionId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCreditCard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.paymentId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">User Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.userName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">User Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.userType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.propertyId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHomeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.propertyName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PropTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.propertyType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PurposeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Purpose</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.paymentPurpose}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiDollarSign className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Amount</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatCurrency(transaction.amount)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPercent className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Tax / GST</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatCurrency(transaction.tax)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTrendingUp className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Total Amount</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatCurrency(transaction.totalAmount)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCreditCard className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Method</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.paymentMethod}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiServer className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Gateway</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.paymentGateway}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Status</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                {statusConfig.label}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <VerificationIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Verification Status</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
                {verificationConfig.label}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiRotateCcw className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Refund Status</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${refundConfig.bg} ${refundConfig.text} border ${refundConfig.border}`}>
                {refundConfig.label}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Description</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{transaction.description || 'No description available'}</p>
            </div>

            {transaction.notes && transaction.notes.length > 0 && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiClipboard className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Payment Notes</h4>
                </div>
                <div className="space-y-2">
                  {transaction.notes.map((note, idx) => (
                    <div key={idx} className="text-sm text-[#1A2E2A] bg-white rounded-lg p-2 border border-[#E8F0EE]">
                      <p>{note.text}</p>
                      <p className="text-[10px] text-[#5A7D78] mt-1">{note.addedBy} • {new Date(note.addedAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8F0EE] pt-5">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-[#00695C] text-lg" />
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Available Actions</h3>
              <span className="px-2 py-0.5 bg-[#E8F4F2] text-[#00695C] text-[10px] font-semibold rounded-full">
                {availableActions.length} actions
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${action.border} ${action.bg} ${action.hoverBg} transition-all duration-300 hover:scale-[1.03] hover:shadow-md group animate-slide-in`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300 border ${action.border}`}>
                      <ActionIcon className="text-lg" />
                    </div>
                    <span className={`text-[11px] font-bold ${action.color} text-center leading-tight`}>
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium min-w-[100px]"
            >
              Close
            </button>
            <button
              onClick={() => { if (onEdit) { onEdit(transaction); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02] min-w-[100px]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(transaction.id); } }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] min-w-[100px]"
            >
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD NOTE MODAL
// ============================================================
const AddNoteModal = ({ transaction, show, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) setNote('');
  }, [show]);

  if (!transaction || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSave(transaction.id, note.trim());
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-xl font-bold text-white">Add Payment Note</h2>
          <p className="text-white/80 text-sm">{transaction.transactionId} • {transaction.userName}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
            placeholder="Enter your note about this payment..."
            className="w-full px-4 py-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
            autoFocus
          />
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!note.trim() || loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// VIEW CUSTOMER MODAL
// ============================================================
const ViewCustomerModal = ({ transaction, show, onClose, onNavigateToProfile }) => {
  if (!transaction || !show) return null;

  const userTypeConfig = USER_TYPE_CONFIG[transaction.userType] || USER_TYPE_CONFIG['Owner'];
  const UserTypeIcon = userTypeConfig.icon;

  const handleViewProfile = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile(transaction.userId || transaction.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-xl font-bold text-white">Customer Details</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${userTypeConfig.bg} flex items-center justify-center ${userTypeConfig.text} border ${userTypeConfig.border} text-2xl`}>
              <UserTypeIcon />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{transaction.userName}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>
                {transaction.userType}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMail className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Email</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{transaction.userEmail || 'N/A'}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Phone</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{transaction.userPhone || 'N/A'}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer ID</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{transaction.userId || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE]"
          >
            Close
          </button>
          <button
            onClick={handleViewProfile}
            className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 flex items-center justify-center gap-2"
          >
            <FiExternalLink className="text-sm" /> View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW USER PROPERTIES MODAL
// ============================================================
const UserPropertiesModal = ({ userName, userId, show, onClose, allTransactions, onNavigateToProperty }) => {
  if (!show) return null;

  const userProperties = useMemo(() => {
    const props = allTransactions
      .filter(t => t.userName === userName)
      .reduce((acc, t) => {
        if (!acc.find(p => p.propertyId === t.propertyId)) {
          acc.push({
            propertyId: t.propertyId,
            propertyName: t.propertyName,
            propertyType: t.propertyType,
            propertyLocation: t.propertyLocation || 'Mumbai, Maharashtra',
            amount: t.totalAmount,
            paymentStatus: t.paymentStatus,
            verificationStatus: t.verificationStatus || 'Unverified',
            paymentDate: t.paymentDate
          });
        }
        return acc;
      }, []);
    return props;
  }, [allTransactions, userName]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiHomeIcon className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{userName}'s Properties</h2>
              <p className="text-white/80 text-sm">{userProperties.length} properties listed</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          {userProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiHomeIcon className="text-4xl text-[#B5C9C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E2A]">No properties found</h3>
              <p className="text-sm text-[#5A7D78] mt-1">This user has no properties listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProperties.map((prop, index) => {
                const propTypeConfig = PROPERTY_TYPE_CONFIG[prop.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
                const PropTypeIcon = propTypeConfig.icon;
                const statusConfig = STATUS_TYPES[prop.paymentStatus] || STATUS_TYPES['Pending'];
                const StatusIcon = statusConfig.icon;
                const verificationConfig = VERIFICATION_STATUS[prop.verificationStatus || 'Unverified'];
                const VerificationIcon = verificationConfig.icon;

                return (
                  <div
                    key={prop.propertyId}
                    className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-slide-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl ${propTypeConfig.bg} flex items-center justify-center ${propTypeConfig.text} border ${propTypeConfig.border} flex-shrink-0`}>
                          <PropTypeIcon className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{prop.propertyName}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                            {prop.propertyType}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-xl ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border} text-sm font-bold`}>
                        {formatCurrency(prop.amount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] mb-2">
                      <FiMap className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{prop.propertyLocation}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 bg-[#F5F9F8] rounded-xl p-2">
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#1A2E2A]">3</p>
                        <p className="text-[9px] text-[#5A7D78] uppercase">Beds</p>
                      </div>
                      <div className="text-center border-x border-[#E8F0EE]">
                        <p className="text-xs font-bold text-[#1A2E2A]">2</p>
                        <p className="text-[9px] text-[#5A7D78] uppercase">Baths</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#1A2E2A]">1200</p>
                        <p className="text-[9px] text-[#5A7D78] uppercase">Sq Ft</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        <StatusIcon className="text-[8px]" /> {statusConfig.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
                        <VerificationIcon className="text-[8px]" /> {verificationConfig.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigateToProperty && onNavigateToProperty(prop.propertyId)}
                      className="w-full py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-[#00695C]/20"
                    >
                      <FiEye className="text-xs" /> View Property Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#E8F0EE] shrink-0 flex items-center justify-between">
          <span className="text-xs text-[#5A7D78]">
            Total: <span className="font-bold text-[#00695C]">{userProperties.length}</span> properties
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TRANSACTION HISTORY MODAL
// ============================================================
const TransactionHistoryModal = ({ transaction, show, onClose, allTransactions }) => {
  if (!transaction || !show) return null;

  const history = useMemo(() => {
    return allTransactions
      .filter(t => t.userName === transaction.userName)
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
  }, [allTransactions, transaction.userName]);

  const totalSpent = history.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);
  const successfulCount = history.filter(t => t.paymentStatus === 'Successful').length;
  const pendingCount = history.filter(t => t.paymentStatus === 'Pending').length;
  const failedCount = history.filter(t => t.paymentStatus === 'Failed').length;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiClock className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Transaction History</h2>
              <p className="text-white/80 text-sm">{transaction.userName} • {history.length} transactions</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#F8FAF9] border-b border-[#E8F0EE]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Total Spent</p>
              <p className="text-lg font-bold text-[#00695C]">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Successful</p>
              <p className="text-lg font-bold text-emerald-600">{successfulCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Pending</p>
              <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Failed</p>
              <p className="text-lg font-bold text-red-600">{failedCount}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiClock className="text-4xl text-[#B5C9C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E2A]">No transactions found</h3>
              <p className="text-sm text-[#5A7D78] mt-1">This user has no transaction history yet.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-[#E8F0EE] hidden sm:block" />

              <div className="space-y-4">
                {history.map((txn, index) => {
                  const statusConfig = STATUS_TYPES[txn.paymentStatus] || STATUS_TYPES['Pending'];
                  const StatusIcon = statusConfig.icon;
                  const verificationConfig = VERIFICATION_STATUS[txn.verificationStatus || 'Unverified'];
                  const VerificationIcon = verificationConfig.icon;
                  const purposeConfig = PAYMENT_PURPOSE_CONFIG[txn.paymentPurpose] || PAYMENT_PURPOSE_CONFIG['Property Listing Fee'];
                  const PurposeIcon = purposeConfig.icon;

                  return (
                    <div
                      key={txn.id}
                      className="relative flex gap-4 animate-slide-in"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="hidden sm:flex flex-col items-center">
                        <div className={`w-11 h-11 rounded-full ${statusConfig.bg} border-2 ${statusConfig.border} flex items-center justify-center ${statusConfig.text} z-10 bg-white`}>
                          <StatusIcon className="text-sm" />
                        </div>
                      </div>

                      <div className="flex-1 bg-white rounded-2xl border border-[#E8F0EE] p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#00695C]/30">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`sm:hidden w-8 h-8 rounded-full ${statusConfig.bg} border ${statusConfig.border} flex items-center justify-center ${statusConfig.text} flex-shrink-0`}>
                              <StatusIcon className="text-xs" />
                            </span>
                            <div>
                              <p className="text-sm font-bold text-[#1A2E2A]">{txn.transactionId}</p>
                              <p className="text-[10px] text-[#5A7D78]">{txn.paymentId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#00695C]">{formatCurrency(txn.totalAmount)}</p>
                            <p className="text-[10px] text-[#5A7D78]">
                              {new Date(txn.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            <StatusIcon className="text-[8px]" /> {statusConfig.label}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
                            <VerificationIcon className="text-[8px]" /> {verificationConfig.label}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${purposeConfig.bg} ${purposeConfig.text} border ${purposeConfig.border}`}>
                            <PurposeIcon className="text-[8px]" /> {txn.paymentPurpose}
                          </span>
                        </div>

                        <div className="text-xs text-[#5A7D78] space-y-1">
                          <p className="flex items-center gap-1">
                            <FiHomeIcon className="text-[#00695C] text-[10px]" />
                            <span className="font-medium">{txn.propertyName}</span>
                            <span className="text-[10px] text-[#B5C9C5]">({txn.propertyId})</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <FiCreditCard className="text-[#00695C] text-[10px]" />
                            <span className="font-medium">{txn.paymentMethod}</span>
                            <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                            <span className="font-medium">{txn.paymentGateway}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#E8F0EE] shrink-0 flex items-center justify-between">
          <span className="text-xs text-[#5A7D78]">
            Showing <span className="font-bold text-[#00695C]">{history.length}</span> transactions
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REFUND MODAL
// ============================================================
const RefundModal = ({ transaction, show, onClose, onConfirm }) => {
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setRefundAmount(transaction.totalAmount || '');
      setRefundReason('');
    }
  }, [transaction]);

  if (!transaction || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!refundAmount || Number(refundAmount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      onConfirm(transaction.id, Number(refundAmount), refundReason);
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-xl font-bold text-white">Process Refund</h2>
          <p className="text-white/80 text-sm">{transaction.transactionId} • {formatCurrency(transaction.totalAmount)}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Refund Amount (₹) *</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              max={transaction.totalAmount}
              min="1"
              required
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
            />
            <p className="text-[10px] text-[#5A7D78] mt-1">Maximum refundable: {formatCurrency(transaction.totalAmount)}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A7D78] mb-1">Reason for Refund</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows="3"
              placeholder="Enter reason for refund..."
              className="w-full px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!refundAmount || Number(refundAmount) <= 0 || loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-indigo-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiRotateCcw />}
              {loading ? 'Processing...' : 'Process Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// EDIT TRANSACTION MODAL
// ============================================================
const EditTransactionModal = ({ transaction, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    transactionId: '', paymentId: '', userName: '', userType: '',
    propertyId: '', propertyName: '', propertyType: '',
    paymentPurpose: '', amount: '', tax: '', totalAmount: '',
    paymentMethod: '', paymentGateway: '', paymentDate: '',
    paymentStatus: '', refundStatus: '', verificationStatus: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        transactionId: transaction.transactionId || '',
        paymentId: transaction.paymentId || '',
        userName: transaction.userName || '',
        userType: transaction.userType || '',
        propertyId: transaction.propertyId || '',
        propertyName: transaction.propertyName || '',
        propertyType: transaction.propertyType || '',
        paymentPurpose: transaction.paymentPurpose || '',
        amount: transaction.amount || '',
        tax: transaction.tax || '',
        totalAmount: transaction.totalAmount || '',
        paymentMethod: transaction.paymentMethod || '',
        paymentGateway: transaction.paymentGateway || '',
        paymentDate: transaction.paymentDate ? transaction.paymentDate.split('T')[0] : '',
        paymentStatus: transaction.paymentStatus || 'Pending',
        refundStatus: transaction.refundStatus || 'Not Applicable',
        verificationStatus: transaction.verificationStatus || 'Unverified',
        description: transaction.description || ''
      });
    }
  }, [transaction]);

  if (!transaction || !show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'amount' || name === 'tax') {
        const amt = Number(name === 'amount' ? value : updated.amount) || 0;
        const tx = Number(name === 'tax' ? value : updated.tax) || 0;
        updated.totalAmount = amt + tx;
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...transaction,
        ...formData,
        amount: Number(formData.amount) || 0,
        tax: Number(formData.tax) || 0,
        totalAmount: Number(formData.totalAmount) || 0
      });
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Transaction</h2>
          <p className="text-white/80 text-sm">Update transaction and payment details</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHash className="text-[#00695C]" />
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Transaction ID</label>
                  <input
                    type="text" name="transactionId" value={formData.transactionId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="TXN-0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment ID</label>
                  <input
                    type="text" name="paymentId" value={formData.paymentId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="PAY-0001"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                User Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">User Name *</label>
                  <input
                    type="text" name="userName" value={formData.userName} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter user name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">User Type *</label>
                  <select
                    name="userType" value={formData.userType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select User Type</option>
                    {ALL_USER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHomeIcon className="text-[#00695C]" />
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property ID</label>
                  <input
                    type="text" name="propertyId" value={formData.propertyId} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="PROP-0001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Name</label>
                  <input
                    type="text" name="propertyName" value={formData.propertyName} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter property name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select
                    name="propertyType" value={formData.propertyType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Property Type</option>
                    {ALL_PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCreditCard className="text-[#00695C]" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment Purpose *</label>
                  <select
                    name="paymentPurpose" value={formData.paymentPurpose} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Purpose</option>
                    {ALL_PAYMENT_PURPOSES.map(purpose => <option key={purpose} value={purpose}>{purpose}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Amount (₹) *</label>
                  <input
                    type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Tax / GST (₹) *</label>
                  <input
                    type="number" name="tax" value={formData.tax} onChange={handleChange} required min="0"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                    placeholder="Enter tax amount"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Total Amount (₹) *</label>
                  <input
                    type="number" name="totalAmount" value={formData.totalAmount} readOnly
                    className="w-full px-3 py-2 bg-[#F0F5F4] rounded-xl border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment Method *</label>
                  <select
                    name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Method</option>
                    {ALL_PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment Gateway *</label>
                  <select
                    name="paymentGateway" value={formData.paymentGateway} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Gateway</option>
                    {ALL_PAYMENT_GATEWAYS.map(gateway => <option key={gateway} value={gateway}>{gateway}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment Date *</label>
                  <input
                    type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Payment Status *</label>
                  <select
                    name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_STATUSES.map(status => <option key={status} value={status}>{STATUS_TYPES[status].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Verification Status *</label>
                  <select
                    name="verificationStatus" value={formData.verificationStatus} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {Object.keys(VERIFICATION_STATUS).map(status => (
                      <option key={status} value={status}>{VERIFICATION_STATUS[status].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Refund Status *</label>
                  <select
                    name="refundStatus" value={formData.refundStatus} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_REFUND_STATUSES.map(status => <option key={status} value={status}>{REFUND_STATUS_TYPES[status].label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                    placeholder="Add a note about this transaction..."
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave className="inline" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => (
  <div
    className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 animate-slide-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={() => onClick && onClick()}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider truncate">{title}</p>
        <p className={`text-lg font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
    {isActive && (
      <div className="mt-1 flex items-center gap-1">
        <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
      </div>
    )}
  </div>
);

// ============================================================
// FILTER DROPDOWN COMPONENT
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : allLabel;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
          <button
            onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>{allLabel}</span>
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
                value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
              }`}
            >
              <span className="w-4">{value === option.value && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const PaymentTransactions = ({ onNavigate }) => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('paymentDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeMethod, setActiveMethod] = useState('all');
  const [activeGateway, setActiveGateway] = useState('all');
  const [activeUserType, setActiveUserType] = useState('all');
  const [activePurpose, setActivePurpose] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [activeRefundStatus, setActiveRefundStatus] = useState('all');
  const [activeVerificationStatus, setActiveVerificationStatus] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ MODAL STATES ============
  const [actionsModal, setActionsModal] = useState({ show: false, transaction: null });
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteTransaction, setNoteTransaction] = useState(null);
  const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);
  const [customerTransaction, setCustomerTransaction] = useState(null);
  const [showUserPropertiesModal, setShowUserPropertiesModal] = useState(false);
  const [userPropertiesData, setUserPropertiesData] = useState({ userName: '', userId: '' });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyTransaction, setHistoryTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTransaction, setRefundTransaction] = useState(null);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0, Successful: 0, Pending: 0, Failed: 0, Cancelled: 0,
    Refunded: 0, 'Partially Refunded': 0, 'Payment Initiated': 0, 'Under Verification': 0,
    totalRevenue: 0, totalTax: 0, netRevenue: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0, Successful: 0, Pending: 0, Failed: 0, Cancelled: 0,
        Refunded: 0, 'Partially Refunded': 0, 'Payment Initiated': 0, 'Under Verification': 0,
        totalRevenue: 0, totalTax: 0, netRevenue: 0
      });
      return;
    }

    const counts = { total: list.length };
    ALL_STATUSES.forEach(status => {
      counts[status] = list.filter(t => t.paymentStatus === status).length;
    });

    const successfulTransactions = list.filter(t => t.paymentStatus === 'Successful');
    const totalRevenue = successfulTransactions.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);
    const totalTax = successfulTransactions.reduce((sum, t) => sum + (Number(t.tax) || 0), 0);
    const netRevenue = totalRevenue - totalTax;

    setStats({ ...counts, totalRevenue, totalTax, netRevenue });
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockTransactions = useCallback(() => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma'];
    const propertyNames = [
      'Green Valley Apartments', 'Sunrise Villas', 'Lake View Residency', 'Palm Grove',
      'Royal Heights', 'Golden Meadows', 'Silver Springs', 'Emerald Enclave',
      'Paradise Homes', 'Harmony Towers', 'Serenity Gardens', 'Crystal Palace',
      'Blue Bells', 'Rose Wood', 'Lavender Fields', 'Orchid Park'
    ];

    const statuses = ALL_STATUSES;
    const userTypes = ALL_USER_TYPES;
    const propertyTypes = ALL_PROPERTY_TYPES;
    const purposes = ALL_PAYMENT_PURPOSES;
    const methods = ALL_PAYMENT_METHODS;
    const gateways = ALL_PAYMENT_GATEWAYS;

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 120; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const userName = `${firstName} ${lastName}`;
      const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const paymentPurpose = purposes[Math.floor(Math.random() * purposes.length)];
      const paymentStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod = methods[Math.floor(Math.random() * methods.length)];
      const paymentGateway = gateways[Math.floor(Math.random() * gateways.length)];

      let verificationStatus = 'Unverified';
      if (paymentStatus === 'Successful') {
        verificationStatus = Math.random() > 0.3 ? 'Verified' : 'Unverified';
      } else if (paymentStatus === 'Pending' || paymentStatus === 'Under Verification') {
        verificationStatus = 'Unverified';
      } else if (paymentStatus === 'Payment Initiated') {
        verificationStatus = 'Unverified';
      }

      let refundStatus = 'Not Applicable';
      if (paymentStatus === 'Refunded') {
        refundStatus = 'Completed';
      } else if (paymentStatus === 'Partially Refunded') {
        refundStatus = 'Partially Completed';
      } else if (paymentStatus === 'Cancelled') {
        refundStatus = Math.random() > 0.5 ? 'Requested' : 'Processing';
      } else if (paymentStatus === 'Failed') {
        refundStatus = Math.random() > 0.7 ? 'Requested' : 'Not Applicable';
      }

      let baseAmount = 499;
      switch (paymentPurpose) {
        case 'Property Listing Fee': baseAmount = 999; break;
        case 'Property Promotion': baseAmount = 1499; break;
        case 'Featured Listing': baseAmount = 2999; break;
        case 'Subscription': baseAmount = 1999; break;
        case 'Lead Purchase': baseAmount = 299; break;
        case 'Contact Access': baseAmount = 99; break;
        case 'Agent Subscription': baseAmount = 1999; break;
        case 'Builder Subscription': baseAmount = 3999; break;
        case 'Owner Subscription': baseAmount = 2999; break;
        case 'Property Management Service': baseAmount = 2499; break;
        case 'Loan Service': baseAmount = 999; break;
        default: baseAmount = 499;
      }

      const amount = baseAmount + Math.floor(Math.random() * 5) * 100;
      const tax = Math.round(amount * 0.18);
      const totalAmount = amount + tax;

      let payDate;
      if (i % 12 === 0) {
        payDate = new Date(now);
      } else {
        const daysAgo = Math.floor(Math.random() * 90);
        payDate = new Date(now);
        payDate.setDate(payDate.getDate() - daysAgo);
      }

      list.push({
        id: `txn_${i}`,
        transactionId: `TXN-${String(i).padStart(5, '0')}`,
        paymentId: `PAY-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        userName,
        userType,
        userEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        userPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        userId: `USR-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        propertyId: `PROP-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        propertyName,
        propertyType,
        propertyLocation: 'Mumbai, Maharashtra',
        paymentPurpose,
        amount,
        tax,
        totalAmount,
        paymentMethod,
        paymentGateway,
        paymentDate: payDate.toISOString(),
        paymentStatus,
        refundStatus,
        verificationStatus,
        description: `${paymentPurpose} for ${propertyName} via ${paymentGateway}.`,
        notes: Math.random() > 0.7 ? [
          {
            text: 'Payment confirmed by customer support.',
            addedBy: 'Admin',
            addedAt: new Date(now.getTime() - Math.random() * 86400000).toISOString()
          }
        ] : []
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } catch (error) {
      console.error('Error generating mock transactions:', error);
    }
  }, [generateMockTransactions]);

  // ============ FILTER TRANSACTIONS ============
  const filterTransactions = useCallback(() => {
    try {
      let filtered = [...transactions];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t =>
          (t.transactionId && t.transactionId.toLowerCase().includes(query)) ||
          (t.paymentId && t.paymentId.toLowerCase().includes(query)) ||
          (t.userName && t.userName.toLowerCase().includes(query)) ||
          (t.propertyId && t.propertyId.toLowerCase().includes(query)) ||
          (t.propertyName && t.propertyName.toLowerCase().includes(query)) ||
          (t.paymentPurpose && t.paymentPurpose.toLowerCase().includes(query)) ||
          (t.paymentMethod && t.paymentMethod.toLowerCase().includes(query)) ||
          (t.paymentGateway && t.paymentGateway.toLowerCase().includes(query)) ||
          (t.paymentStatus && t.paymentStatus.toLowerCase().includes(query)) ||
          (t.userType && t.userType.toLowerCase().includes(query)) ||
          (t.propertyType && t.propertyType.toLowerCase().includes(query)) ||
          (String(t.totalAmount).includes(query))
        );
      }

      if (activeStatus !== 'all') {
        filtered = filtered.filter(t => t.paymentStatus === activeStatus);
      }
      if (activeMethod !== 'all') {
        filtered = filtered.filter(t => t.paymentMethod === activeMethod);
      }
      if (activeGateway !== 'all') {
        filtered = filtered.filter(t => t.paymentGateway === activeGateway);
      }
      if (activeUserType !== 'all') {
        filtered = filtered.filter(t => t.userType === activeUserType);
      }
      if (activePurpose !== 'all') {
        filtered = filtered.filter(t => t.paymentPurpose === activePurpose);
      }
      if (activePropertyType !== 'all') {
        filtered = filtered.filter(t => t.propertyType === activePropertyType);
      }
      if (activeRefundStatus !== 'all') {
        filtered = filtered.filter(t => t.refundStatus === activeRefundStatus);
      }
      if (activeVerificationStatus !== 'all') {
        filtered = filtered.filter(t => (t.verificationStatus || 'Unverified') === activeVerificationStatus);
      }

      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activeMethod !== 'all') count++;
      if (activeGateway !== 'all') count++;
      if (activeUserType !== 'all') count++;
      if (activePurpose !== 'all') count++;
      if (activePropertyType !== 'all') count++;
      if (activeRefundStatus !== 'all') count++;
      if (activeVerificationStatus !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'amount' || sortField === 'tax' || sortField === 'totalAmount') {
          aVal = Number(aVal); bVal = Number(bVal);
        } else if (sortField === 'paymentDate') {
          aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime();
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredTransactions(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  }, [transactions, searchQuery, activeStatus, activeMethod, activeGateway, activeUserType, activePurpose, activePropertyType, activeRefundStatus, activeVerificationStatus, sortField, sortDirection]);

  useEffect(() => { filterTransactions(); }, [filterTransactions]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage, pageSize]);

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
    if (selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map(t => t.id));
    }
  }, [selectedTransactions, paginatedTransactions]);

  // ============ HANDLE SELECT TRANSACTION ============
  const handleSelectTransaction = useCallback((transactionId) => {
    setSelectedTransactions(prev => prev.includes(transactionId) ? prev.filter(id => id !== transactionId) : [...prev, transactionId]);
  }, []);

  // ============ VIEW / EDIT ============
  const handleViewTransaction = useCallback((transaction) => {
    setViewingTransaction(transaction);
    setShowViewModal(true);
  }, []);

  const handleEditTransaction = useCallback((transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  }, []);

  const handleSaveTransaction = useCallback((updatedTransaction) => {
    setTransactions(prev => {
      const updated = prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Transaction "${updatedTransaction.transactionId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ DELETE TRANSACTION WITH CONFIRMATION ============
  const handleDeleteTransaction = useCallback((transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Transaction',
      message: `Are you sure you want to delete transaction "${transaction.transactionId}" (${formatCurrency(transaction.totalAmount)})?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(transactionId);
        setTimeout(() => {
          setTransactions(prev => {
            const updated = prev.filter(t => t.id !== transactionId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted transaction "${transaction.transactionId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [transactions, computeStats]);

  // ============ TRANSACTION ACTION HANDLER ============
  const handleTransactionAction = useCallback((actionId, transaction) => {
    switch (actionId) {
      case 'actions':
        setActionsModal({ show: true, transaction });
        break;

      case 'view-payment':
        handleViewTransaction(transaction);
        break;

      case 'verify-payment':
        setConfirmationModal({
          isOpen: true,
          title: 'Verify Payment',
          message: `Are you sure you want to verify payment "${transaction.transactionId}"? This will mark the payment as verified.`,
          confirmText: 'Verify',
          cancelText: 'Cancel',
          type: 'info',
          onConfirm: () => {
            setTransactions(prev => {
              const updated = prev.map(t =>
                t.id === transaction.id
                  ? { ...t, verificationStatus: 'Verified' }
                  : t
              );
              computeStats(updated);
              return updated;
            });
            setToast({ message: `Payment "${transaction.transactionId}" verified successfully`, type: 'success' });
          }
        });
        break;

      case 'approve-payment':
        setConfirmationModal({
          isOpen: true,
          title: 'Approve Payment',
          message: `Are you sure you want to approve payment "${transaction.transactionId}"? This will mark the payment as approved and successful.`,
          confirmText: 'Approve',
          cancelText: 'Cancel',
          type: 'success',
          onConfirm: () => {
            setTransactions(prev => {
              const updated = prev.map(t =>
                t.id === transaction.id
                  ? { ...t, paymentStatus: 'Successful', verificationStatus: 'Approved' }
                  : t
              );
              computeStats(updated);
              return updated;
            });
            setToast({ message: `Payment "${transaction.transactionId}" approved successfully`, type: 'success' });
          }
        });
        break;

      case 'mark-paid':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Paid',
          message: `Are you sure you want to mark payment "${transaction.transactionId}" as paid?`,
          confirmText: 'Mark Paid',
          cancelText: 'Cancel',
          type: 'success',
          onConfirm: () => {
            setTransactions(prev => {
              const updated = prev.map(t =>
                t.id === transaction.id
                  ? { ...t, paymentStatus: 'Successful', verificationStatus: 'Verified' }
                  : t
              );
              computeStats(updated);
              return updated;
            });
            setToast({ message: `Payment "${transaction.transactionId}" marked as paid`, type: 'success' });
          }
        });
        break;

      case 'process-refund':
        setRefundTransaction(transaction);
        setShowRefundModal(true);
        break;

      // ============ DOWNLOAD RECEIPT - ACTUAL FILE DOWNLOAD ============
      case 'download-receipt':
        try {
          const receiptHTML = generateReceiptHTML(transaction);
          const result = downloadAsPDF(receiptHTML, `receipt_${transaction.transactionId}.pdf`);
          
          if (result === 'html-fallback') {
            setToast({ message: `Receipt downloaded as HTML for "${transaction.transactionId}"`, type: 'info' });
          } else {
            setToast({ message: `Receipt ready! Use "Save as PDF" in the print dialog.`, type: 'success' });
          }
        } catch (error) {
          console.error('Error generating receipt:', error);
          setToast({ message: 'Error generating receipt', type: 'error' });
        }
        break;

      // ============ DOWNLOAD INVOICE - ACTUAL FILE DOWNLOAD ============
      case 'download-invoice':
        try {
          const invoiceHTML = generateInvoiceHTML(transaction);
          const result = downloadAsPDF(invoiceHTML, `invoice_${transaction.transactionId}.pdf`);
          
          if (result === 'html-fallback') {
            setToast({ message: `Invoice downloaded as HTML for "${transaction.transactionId}"`, type: 'info' });
          } else {
            setToast({ message: `Invoice ready! Use "Save as PDF" in the print dialog.`, type: 'success' });
          }
        } catch (error) {
          console.error('Error generating invoice:', error);
          setToast({ message: 'Error generating invoice', type: 'error' });
        }
        break;

      case 'add-note':
        setNoteTransaction(transaction);
        setShowAddNoteModal(true);
        break;

      case 'view-customer':
        setCustomerTransaction(transaction);
        setShowViewCustomerModal(true);
        break;

      case 'view-property':
        setUserPropertiesData({ userName: transaction.userName, userId: transaction.userId || transaction.id });
        setShowUserPropertiesModal(true);
        break;

      case 'view-history':
        setHistoryTransaction(transaction);
        setShowHistoryModal(true);
        break;

      default:
        break;
    }
  }, [handleViewTransaction]);

  // ============ HANDLE ADD NOTE ============
  const handleAddNote = useCallback((transactionId, noteText) => {
    setTransactions(prev => {
      const updated = prev.map(t =>
        t.id === transactionId
          ? {
              ...t,
              notes: [
                ...(t.notes || []),
                {
                  text: noteText,
                  addedBy: 'Admin',
                  addedAt: new Date().toISOString()
                }
              ]
            }
          : t
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Note added successfully', type: 'success' });
  }, [computeStats]);

  // ============ HANDLE REFUND CONFIRM ============
  const handleRefundConfirm = useCallback((transactionId, amount, reason) => {
    setTransactions(prev => {
      const updated = prev.map(t =>
        t.id === transactionId
          ? {
              ...t,
              refundStatus: amount >= t.totalAmount ? 'Completed' : 'Partially Completed',
              paymentStatus: amount >= t.totalAmount ? 'Refunded' : 'Partially Refunded',
              notes: [
                ...(t.notes || []),
                {
                  text: `Refund processed: ${formatCurrency(amount)}${reason ? ` - Reason: ${reason}` : ''}`,
                  addedBy: 'Admin',
                  addedAt: new Date().toISOString()
                }
              ]
            }
          : t
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Refund of ${formatCurrency(amount)} processed successfully`, type: 'success' });
  }, [computeStats]);

  // ============ NAVIGATION HANDLERS ============
  const handleNavigateToProfile = useCallback((userId) => {
    if (onNavigate) {
      onNavigate('profile', userId);
    } else {
      setToast({ message: `Navigating to profile: ${userId}`, type: 'info' });
    }
    setShowViewCustomerModal(false);
    setCustomerTransaction(null);
  }, [onNavigate]);

  const handleNavigateToProperty = useCallback((propertyId) => {
    if (onNavigate) {
      onNavigate('property', propertyId);
    } else {
      setToast({ message: `Navigating to property: ${propertyId}`, type: 'info' });
    }
    setShowUserPropertiesModal(false);
    setUserPropertiesData({ userName: '', userId: '' });
  }, [onNavigate]);

  // ============ STAT CLICK HANDLERS ============
  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActiveMethod('all');
    setActiveGateway('all');
    setActiveUserType('all');
    setActivePurpose('all');
    setActivePropertyType('all');
    setActiveRefundStatus('all');
    setActiveVerificationStatus('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveMethod('all');
    setActiveGateway('all');
    setActiveUserType('all');
    setActivePurpose('all');
    setActivePropertyType('all');
    setActiveRefundStatus('all');
    setActiveVerificationStatus('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockTransactions = generateMockTransactions();
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockTransactions]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredTransactions.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredTransactions.map(t => ({
        'Transaction ID': t.transactionId || '',
        'Payment ID': t.paymentId || '',
        'User Name': t.userName || '',
        'User Type': t.userType || '',
        'Property ID': t.propertyId || '',
        'Property Name': t.propertyName || '',
        'Property Type': t.propertyType || '',
        'Payment Purpose': t.paymentPurpose || '',
        'Amount': t.amount || 0,
        'Tax/GST': t.tax || 0,
        'Total Amount': t.totalAmount || 0,
        'Payment Method': t.paymentMethod || '',
        'Payment Gateway': t.paymentGateway || '',
        'Payment Date': t.paymentDate ? new Date(t.paymentDate).toLocaleDateString('en-IN') : '',
        'Payment Status': t.paymentStatus || '',
        'Verification Status': t.verificationStatus || 'Unverified',
        'Refund Status': t.refundStatus || '',
        'Description': t.description || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredTransactions.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredTransactions]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedTransactions.length === 0) {
      setToast({ message: 'Please select transactions first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Transactions',
      message: `Are you sure you want to delete ${selectedTransactions.length} selected transaction(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedTransactions);
          const count = transactions.filter(t => selectedIds.has(t.id)).length;
          const updated = transactions.filter(t => !selectedIds.has(t.id));
          setTransactions(updated);
          computeStats(updated);
          setSelectedTransactions([]);
          setActionLoading(null);
          setToast({ message: `${count} transaction(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedTransactions, transactions, computeStats]);

  // ============ FILTER OPTIONS ============
  const statusOptions = ALL_STATUSES.map(status => ({ value: status, label: STATUS_TYPES[status].label }));
  const methodOptions = ALL_PAYMENT_METHODS.map(method => ({ value: method, label: method }));
  const gatewayOptions = ALL_PAYMENT_GATEWAYS.map(gateway => ({ value: gateway, label: gateway }));
  const userTypeOptions = ALL_USER_TYPES.map(type => ({ value: type, label: type }));
  const purposeOptions = ALL_PAYMENT_PURPOSES.map(purpose => ({ value: purpose, label: purpose }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(type => ({ value: type, label: type }));
  const refundStatusOptions = ALL_REFUND_STATUSES.map(status => ({ value: status, label: REFUND_STATUS_TYPES[status].label }));
  const verificationStatusOptions = Object.keys(VERIFICATION_STATUS).map(status => ({ value: status, label: VERIFICATION_STATUS[status].label }));

  // ============ LIST VIEW COLUMN CONFIG ============
  const LIST_COLUMNS = [
    { key: 'transactionId', label: 'Txn ID', sortable: true },
    { key: 'paymentId', label: 'Pay ID', sortable: true },
    { key: 'userName', label: 'User', sortable: true },
    { key: 'userType', label: 'Type', sortable: true },
    { key: 'propertyType', label: 'Prop Type', sortable: true },
    { key: 'amount', label: 'Amount + Tax/GST', sortable: true },
    { key: 'totalAmount', label: 'Total Amount', sortable: true },
    { key: 'paymentMethod', label: 'Method', sortable: true },
    { key: 'paymentGateway', label: 'Gateway', sortable: true },
    { key: 'paymentDate', label: 'Date', sortable: true },
    { key: 'paymentStatus', label: 'Status', sortable: true },
    { key: 'verificationStatus', label: 'Verified', sortable: true },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => {
          if (confirmationModal.onCancel) confirmationModal.onCancel();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }}
        onConfirm={() => { if (confirmationModal.onConfirm) confirmationModal.onConfirm(); }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      <TransactionActionsModal
        transaction={actionsModal.transaction}
        show={actionsModal.show}
        onClose={() => setActionsModal({ show: false, transaction: null })}
        onAction={handleTransactionAction}
        onToast={setToast}
      />

      <AddNoteModal
        transaction={noteTransaction}
        show={showAddNoteModal}
        onClose={() => { setShowAddNoteModal(false); setNoteTransaction(null); }}
        onSave={handleAddNote}
      />

      <ViewCustomerModal
        transaction={customerTransaction}
        show={showViewCustomerModal}
        onClose={() => { setShowViewCustomerModal(false); setCustomerTransaction(null); }}
        onNavigateToProfile={handleNavigateToProfile}
      />

      <UserPropertiesModal
        userName={userPropertiesData.userName}
        userId={userPropertiesData.userId}
        show={showUserPropertiesModal}
        onClose={() => { setShowUserPropertiesModal(false); setUserPropertiesData({ userName: '', userId: '' }); }}
        allTransactions={transactions}
        onNavigateToProperty={handleNavigateToProperty}
      />

      <TransactionHistoryModal
        transaction={historyTransaction}
        show={showHistoryModal}
        onClose={() => { setShowHistoryModal(false); setHistoryTransaction(null); }}
        allTransactions={transactions}
      />

      <RefundModal
        transaction={refundTransaction}
        show={showRefundModal}
        onClose={() => { setShowRefundModal(false); setRefundTransaction(null); }}
        onConfirm={handleRefundConfirm}
      />

      {showViewModal && viewingTransaction && (
        <ViewTransactionDetailModal
          transaction={viewingTransaction}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingTransaction(null); }}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAction={handleTransactionAction}
        />
      )}

      {showEditModal && editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingTransaction(null); }}
          onSave={handleSaveTransaction}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Payment Transactions
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredTransactions.length} Transactions
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track all payment transactions across users, properties, and payment gateways</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              {showStats ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExport}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
              <StatCard
                icon={<FiCreditCard className="text-white text-sm" />}
                title="Total Transactions"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={filterCount === 0}
                onClick={handleTotalClick}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Successful"
                value={stats.Successful}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={60}
                isActive={activeStatus === 'Successful'}
                onClick={() => handleStatusClick('Successful')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.Pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={120}
                isActive={activeStatus === 'Pending'}
                onClick={() => handleStatusClick('Pending')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Failed"
                value={stats.Failed}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={180}
                isActive={activeStatus === 'Failed'}
                onClick={() => handleStatusClick('Failed')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Cancelled"
                value={stats.Cancelled}
                color="bg-gradient-to-br from-slate-600 to-slate-400"
                delay={240}
                isActive={activeStatus === 'Cancelled'}
                onClick={() => handleStatusClick('Cancelled')}
              />
              <StatCard
                icon={<FiRotateCcw className="text-white text-sm" />}
                title="Refunded"
                value={stats.Refunded}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={300}
                isActive={activeStatus === 'Refunded'}
                onClick={() => handleStatusClick('Refunded')}
              />
              <StatCard
                icon={<FiRotateCcw className="text-white text-sm" />}
                title="Partially Refunded"
                value={stats['Partially Refunded']}
                color="bg-gradient-to-br from-indigo-600 to-indigo-400"
                delay={360}
                isActive={activeStatus === 'Partially Refunded'}
                onClick={() => handleStatusClick('Partially Refunded')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Payment Initiated"
                value={stats['Payment Initiated']}
                color="bg-gradient-to-br from-cyan-600 to-cyan-400"
                delay={420}
                isActive={activeStatus === 'Payment Initiated'}
                onClick={() => handleStatusClick('Payment Initiated')}
              />
              <StatCard
                icon={<FiShield className="text-white text-sm" />}
                title="Under Verification"
                value={stats['Under Verification']}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={480}
                isActive={activeStatus === 'Under Verification'}
                onClick={() => handleStatusClick('Under Verification')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Dropdowns */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by transaction ID, payment ID, user name, property, purpose, gateway..."
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
            <FilterDropdown
              label="User Type"
              options={userTypeOptions}
              value={activeUserType}
              onChange={setActiveUserType}
              icon={FiUser}
              allLabel="All User Types"
            />

            <FilterDropdown
              label="Purpose"
              options={purposeOptions}
              value={activePurpose}
              onChange={setActivePurpose}
              icon={FiTag}
              allLabel="All Purposes"
            />

            <FilterDropdown
              label="Property"
              options={propertyTypeOptions}
              value={activePropertyType}
              onChange={setActivePropertyType}
              icon={FiHomeIcon}
              allLabel="All Property Types"
            />

            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={activeStatus}
              onChange={setActiveStatus}
              icon={FiActivity}
              allLabel="All Statuses"
            />

            <FilterDropdown
              label="Verified"
              options={verificationStatusOptions}
              value={activeVerificationStatus}
              onChange={setActiveVerificationStatus}
              icon={FiShield}
              allLabel="All Verification"
            />

            <FilterDropdown
              label="Method"
              options={methodOptions}
              value={activeMethod}
              onChange={setActiveMethod}
              icon={FiCreditCard}
              allLabel="All Methods"
            />

            <FilterDropdown
              label="Gateway"
              options={gatewayOptions}
              value={activeGateway}
              onChange={setActiveGateway}
              icon={FiServer}
              allLabel="All Gateways"
            />

            <FilterDropdown
              label="Refund"
              options={refundStatusOptions}
              value={activeRefundStatus}
              onChange={setActiveRefundStatus}
              icon={FiRotateCcw}
              allLabel="All Refund Statuses"
            />

            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
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
                <FiGridIcon className="text-sm" />
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

        {selectedTransactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedTransactions.length}</span> transaction(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button
                onClick={() => setSelectedTransactions([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedTransactions.map((transaction, index) => {
              const isSelected = selectedTransactions.includes(transaction.id);
              const statusConfig = STATUS_TYPES[transaction.paymentStatus] || STATUS_TYPES['Pending'];
              const StatusIcon = statusConfig.icon;
              const userTypeConfig = USER_TYPE_CONFIG[transaction.userType] || USER_TYPE_CONFIG['Owner'];
              const UserTypeIcon = userTypeConfig.icon;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[transaction.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
              const PropTypeIcon = propTypeConfig.icon;
              const verificationConfig = VERIFICATION_STATUS[transaction.verificationStatus || 'Unverified'];
              const VerificationIcon = verificationConfig.icon;

              return (
                <div
                  key={transaction.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTransaction(transaction.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <StatusIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{transaction.userName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{transaction.transactionId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none flex items-center gap-0.5 ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
                            <VerificationIcon className="text-[8px]" />
                            {verificationConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiCreditCard className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{transaction.paymentId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{transaction.userName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>
                        {transaction.userType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiHomeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{transaction.propertyName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                        {transaction.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                      <span className="font-bold text-[#1A2E2A]">{formatCurrency(transaction.totalAmount)}</span>
                      <span className="text-[10px] text-[#5A7D78]">(₹{transaction.amount} + ₹{transaction.tax} GST)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiServer className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{transaction.paymentMethod}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="font-medium">{transaction.paymentGateway}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">
                        {new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewTransaction(transaction)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionsModal({ show: true, transaction })}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiActivity className="text-[10px]" /> Actions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditTransaction(transaction)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      disabled={actionLoading === transaction.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === transaction.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: '3%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr className="bg-[#F5F9F8] border-b border-[#E8F0EE]">
                  <th className="px-2 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                  </th>
                  {LIST_COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className="px-2 py-3 text-left text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider cursor-pointer hover:text-[#00695C] transition-colors select-none truncate"
                      title={col.label}
                    >
                      {col.label} {sortField === col.key && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-right text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => {
                  const isSelected = selectedTransactions.includes(transaction.id);
                  const statusConfig = STATUS_TYPES[transaction.paymentStatus] || STATUS_TYPES['Pending'];
                  const StatusIcon = statusConfig.icon;
                  const verificationConfig = VERIFICATION_STATUS[transaction.verificationStatus || 'Unverified'];
                  const VerificationIcon = verificationConfig.icon;

                  return (
                    <tr
                      key={transaction.id}
                      className={`border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors duration-200 ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                    >
                      <td className="px-2 py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectTransaction(transaction.id)}
                          className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                        />
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden" title={transaction.transactionId}>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#00695C]">
                          <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white flex-shrink-0`}>
                            <StatusIcon className="text-[8px]" />
                          </span>
                          <span className="truncate">{transaction.transactionId}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={transaction.paymentId}>{transaction.paymentId}</td>
                      <td className="px-2 py-2.5 text-sm font-bold text-[#1A2E2A] truncate" title={transaction.userName}>{transaction.userName}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={transaction.userType}>{transaction.userType}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={transaction.propertyType}>{transaction.propertyType}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">
                        <span className="font-bold text-[#1A2E2A]">{formatCurrency(transaction.amount)}</span> + <span>{formatCurrency(transaction.tax)}</span>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-bold text-[#00695C] truncate">{formatCurrency(transaction.totalAmount)}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={transaction.paymentMethod}>{transaction.paymentMethod}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={transaction.paymentGateway}>{transaction.paymentGateway}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">
                        {new Date(transaction.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex items-center gap-0.5 ${verificationConfig.bg} ${verificationConfig.text} border ${verificationConfig.border}`}>
                          <VerificationIcon className="text-[8px]" />
                          {verificationConfig.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewTransaction(transaction)}
                            className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110"
                            title="View"
                          >
                            <FiEye className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActionsModal({ show: true, transaction })}
                            className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110"
                            title="Actions"
                          >
                            <FiActivity className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditTransaction(transaction)}
                            className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110"
                            title="Edit"
                          >
                            <FiEdit className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            disabled={actionLoading === transaction.id}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50"
                            title="Delete"
                          >
                            {actionLoading === transaction.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-sm" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {paginatedTransactions.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiFileText className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No transactions found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No transaction records have been added yet'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105"
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
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 font-medium"
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
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-110 ${
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
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
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
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PaymentTransactions;