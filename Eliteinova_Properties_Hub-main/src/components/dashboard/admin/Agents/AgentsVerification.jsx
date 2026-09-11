// src/components/dashboard/admin/Agents/AgentsVerification.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiXCircle,
  FiClock, FiSearch, FiFilter, FiChevronDown, FiChevronLeft,
  FiChevronRight, FiEye, FiStar, FiShield, FiRefreshCw,
  FiGrid, FiList, FiX, FiDownload, FiUpload, FiMoreVertical,
  FiAlertTriangle, FiInfo, FiMapPin, FiCalendar, FiUser,
  FiTag, FiDollarSign, FiSquare, FiMaximize, FiMinimize,
  FiActivity, FiExternalLink, FiUserCheck, FiUserX, FiSave,
  FiImage, FiFileText, FiPhone, FiMail, FiGlobe, FiSettings,
  FiZoomIn, FiZoomOut, FiRotateCw, FiPaperclip, FiAward,
  FiBriefcase, FiCreditCard,
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaIdCard, FaFileContract,
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdVerified } from 'react-icons/md';

// ============ TOAST COMPONENT ============
const Toast = ({ toast }) => {
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

// ============ CONFIRMATION MODAL ============
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmColor = 'bg-red-500',
  icon = <FiAlertTriangle className="text-3xl text-red-500" />,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-[#1A2E2A] mb-1.5">{title}</h3>
          <p className="text-sm text-[#5A7D78] mb-4 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ STAT CARD COMPONENT ============
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick()}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A7D78] uppercase tracking-wider">{title}</p>
          <p className={`text-xl font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
    </div>
  );
};

// ============ STATUS BADGE ============
const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    not_submitted: 'bg-gray-100 text-gray-500',
  };
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
  };
  const iconSize = size === 'sm' ? 'text-[9px]' : 'text-xs';
  const icons = {
    pending: <FiClock className={iconSize} />,
    approved: <FiCheckCircle className={iconSize} />,
    rejected: <FiXCircle className={iconSize} />,
    not_submitted: <FiInfo className={iconSize} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${size === 'sm' ? 'text-[9px]' : 'text-[10px] px-2.5 py-1'} ${styles[status] || styles.not_submitted}`}>
      {icons[status]} {labels[status] || 'Unknown'}
    </span>
  );
};

// ============ DOCUMENT VIEWER MODAL ============
const DocumentViewerModal = ({ doc, show, onClose, onApprove, onReject, onSetPending, onDownload, loading }) => {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    if (show) {
      setZoom(1);
      setRotate(0);
    }
  }, [show, doc]);

  if (!doc || !show) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiFileText className="text-sm" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">{doc.label}</h2>
              <p className="text-white/70 text-[10px] truncate">{doc.number ? `No: ${doc.number}` : 'Document Preview'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={doc.status} size="md" />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        </div>

        {/* Image viewer */}
        <div className="flex-1 overflow-auto bg-[#0F1B19] flex items-center justify-center p-6 min-h-[320px]">
          <img
            src={doc.url}
            alt={doc.label}
            draggable={false}
            className="max-w-full rounded-lg shadow-2xl select-none transition-transform duration-300"
            style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
          />
        </div>

        {/* Zoom / rotate controls */}
        <div className="flex items-center justify-center gap-2 py-2.5 border-t border-[#E8F0EE] bg-[#F5F9F8] shrink-0">
          <button
            onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
            className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:border-[#00695C]/30 hover:scale-110 transition-all duration-300"
            title="Zoom out"
          >
            <FiZoomOut className="text-xs" />
          </button>
          <span className="text-xs text-[#5A7D78] font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)))}
            className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:border-[#00695C]/30 hover:scale-110 transition-all duration-300"
            title="Zoom in"
          >
            <FiZoomIn className="text-xs" />
          </button>
          <button
            onClick={() => setRotate(r => (r + 90) % 360)}
            className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:border-[#00695C]/30 hover:scale-110 transition-all duration-300 ml-1"
            title="Rotate"
          >
            <FiRotateCw className="text-xs" />
          </button>
          <button
            onClick={() => onDownload(doc)}
            disabled={loading === `download_${doc.id}`}
            className="ml-1 h-8 px-3 rounded-lg bg-white border border-[#E8F0EE] flex items-center gap-1.5 text-[#1A2E2A] text-xs font-medium hover:border-[#00695C]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            title="Download this document"
          >
            {loading === `download_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiDownload className="text-xs" />}
            Download
          </button>
        </div>

        {/* Status-aware action row: only the actions that make sense for
            the document's current status are shown, plus Close */}
        <div className="px-5 py-4 border-t border-[#E8F0EE] flex items-center gap-2.5 bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#F5F9F8] text-[#1A2E2A] hover:bg-[#E8F0EE] transition-all duration-300"
          >
            <FiX className="text-xs" /> Close
          </button>

          {doc.status !== 'rejected' && (
            <button
              onClick={() => onReject(doc)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
            >
              {loading === `reject_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiXCircle className="text-xs" />}
              Reject Document
            </button>
          )}

          {doc.status !== 'pending' && (
            <button
              onClick={() => onSetPending(doc)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 disabled:opacity-50"
            >
              {loading === `pending_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiClock className="text-xs" />}
              Mark as Pending
            </button>
          )}

          {doc.status !== 'approved' && (
            <button
              onClick={() => onApprove(doc)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading === `approve_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiCheckCircle className="text-xs" />}
              Approve Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ VIEW AGENT / VERIFICATION MODAL ============
const AgentVerificationModal = ({
  agent,
  show,
  onClose,
  onOpenDocument,
  onApproveDoc,
  onRejectDoc,
  onSetPendingDoc,
  onDownloadDocument,
  onViewAgentProfile,
  actionLoading,
}) => {
  if (!agent || !show) return null;

  const sections = [
    {
      key: 'rera',
      title: 'RERA Verification',
      subtitle: agent.reraDoc.number ? `RERA No: ${agent.reraDoc.number}` : 'Not provided',
      icon: <FiAward className="text-sm" />,
      doc: agent.reraDoc,
    },
    {
      key: 'agency',
      title: 'Agency Verification',
      subtitle: agent.agencyDoc.number ? `License No: ${agent.agencyDoc.number}` : 'Not provided',
      icon: <FiBriefcase className="text-sm" />,
      doc: agent.agencyDoc,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {agent.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{agent.name}</h2>
              <p className="text-white/80 text-sm truncate">{agent.agencyName} · {agent.city}, {agent.state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              agent.overallStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              agent.overallStatus === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {agent.overallStatus === 'approved' ? 'Fully Verified' : agent.overallStatus === 'rejected' ? 'Has Rejections' : 'Verification Pending'}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/20 text-white">
              Submitted {new Date(agent.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Contact info + View Profile */}
          <div className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center text-white font-bold shrink-0">
                {agent.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1A2E2A] truncate">{agent.name}</p>
                <p className="text-xs text-[#5A7D78] truncate">Agent · {agent.email}</p>
              </div>
            </div>
            <button
              onClick={() => onViewAgentProfile(agent.id)}
              className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-medium flex items-center gap-2 hover:scale-105 shrink-0"
            >
              <FiExternalLink className="text-xs" />
              View Profile
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-[#1A2E2A] p-3 bg-[#F5F9F8] rounded-xl">
              <FiMail className="text-[#00695C] shrink-0" />
              <span className="truncate">{agent.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1A2E2A] p-3 bg-[#F5F9F8] rounded-xl">
              <FiPhone className="text-[#00695C] shrink-0" />
              <span className="truncate">{agent.phone}</span>
            </div>
          </div>

          {/* RERA + Agency sections */}
          {sections.map(sec => (
            <div key={sec.key} className="border border-[#E8F0EE] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F4F2] flex items-center justify-center text-[#00695C]">
                    {sec.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A2E2A]">{sec.title}</h4>
                    <p className="text-[11px] text-[#5A7D78]">{sec.subtitle}</p>
                  </div>
                </div>
                <StatusBadge status={sec.doc.status} size="md" />
              </div>

              <div className="w-full flex items-center gap-3 p-2.5 bg-[#F5F9F8] rounded-xl mb-3">
                <button
                  onClick={() => onOpenDocument(sec.doc)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E8F0EE]">
                    <img src={sec.doc.url} alt={sec.doc.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-medium text-[#1A2E2A] truncate">{sec.doc.label}</p>
                    <p className="text-[10px] text-[#5A7D78]">Click to view full document</p>
                  </div>
                </button>
                <button
                  onClick={() => onOpenDocument(sec.doc)}
                  className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0"
                  title="View document"
                >
                  <FiEye className="text-sm" />
                </button>
                <button
                  onClick={() => onDownloadDocument(sec.doc)}
                  disabled={actionLoading}
                  className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0 disabled:opacity-50"
                  title="Download this document"
                >
                  <FiDownload className="text-sm" />
                </button>
              </div>

              {/* Status-aware actions: current status's action is hidden */}
              <div className="flex items-center gap-2">
                {sec.doc.status !== 'rejected' && (
                  <button
                    onClick={() => onRejectDoc(sec.doc)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
                  >
                    <FiXCircle className="text-xs" /> Reject
                  </button>
                )}
                {sec.doc.status !== 'pending' && (
                  <button
                    onClick={() => onSetPendingDoc(sec.doc)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 disabled:opacity-50"
                  >
                    <FiClock className="text-xs" /> Pending
                  </button>
                )}
                {sec.doc.status !== 'approved' && (
                  <button
                    onClick={() => onApproveDoc(sec.doc)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50"
                  >
                    <FiCheckCircle className="text-xs" /> Approve
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Document Approval section */}
          <div className="border border-[#E8F0EE] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F4F2] flex items-center justify-center text-[#00695C]">
                <FaIdCard className="text-sm" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1A2E2A]">Document Approval</h4>
                <p className="text-[11px] text-[#5A7D78]">ID proof & supporting documents</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {agent.idDocs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-2.5 bg-[#F5F9F8] rounded-xl">
                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E8F0EE]">
                      <img src={doc.url} alt={doc.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#1A2E2A] truncate">{doc.label}</p>
                      <p className="text-[10px] text-[#5A7D78] truncate">{doc.number}</p>
                    </div>
                  </button>
                  <StatusBadge status={doc.status} />
                  <button
                    onClick={() => onOpenDocument(doc)}
                    className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0"
                    title="View document"
                  >
                    <FiEye className="text-sm" />
                  </button>
                  <button
                    onClick={() => onDownloadDocument(doc)}
                    disabled={actionLoading}
                    className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0 disabled:opacity-50"
                    title="Download this document"
                  >
                    <FiDownload className="text-sm" />
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    {doc.status !== 'rejected' && (
                      <button
                        onClick={() => onRejectDoc(doc)}
                        disabled={actionLoading}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50"
                        title="Reject"
                      >
                        <FiXCircle className="text-sm" />
                      </button>
                    )}
                    {doc.status !== 'pending' && (
                      <button
                        onClick={() => onSetPendingDoc(doc)}
                        disabled={actionLoading}
                        className="w-8 h-8 rounded-lg hover:bg-amber-50 transition-all duration-300 flex items-center justify-center text-amber-600 hover:scale-110 disabled:opacity-50"
                        title="Mark as Pending"
                      >
                        <FiClock className="text-sm" />
                      </button>
                    )}
                    {doc.status !== 'approved' && (
                      <button
                        onClick={() => onApproveDoc(doc)}
                        disabled={actionLoading}
                        className="w-8 h-8 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center text-emerald-600 hover:scale-110 disabled:opacity-50"
                        title="Approve"
                      >
                        <FiCheckCircle className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const AgentsVerification = () => {
  const navigate = useNavigate();

  // ============ STATE ============
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all | rera | agency | documents
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | approved | rejected
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [viewMode, setViewMode] = useState('grid');
  const [showStats, setShowStats] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchInputRef = useRef(null);

  const [viewingAgent, setViewingAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const [viewingDoc, setViewingDoc] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmColor: 'bg-red-500',
    icon: <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm: null,
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    pendingRera: 0,
    pendingAgency: 0,
    pendingDocs: 0,
    fullyVerified: 0,
    rejected: 0,
  });

  // ============ TOAST ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ MOCK DATA ============
  const generateMockAgents = useCallback(() => {
    const statuses = ['pending', 'approved', 'rejected'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Nagpur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala'];
    const names = [
      'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Reddy',
      'Deepak Verma', 'Meera Joshi', 'Arjun Nair', 'Kavya Rao', 'Suresh Gupta',
      'Anita Menon', 'Rohit Malhotra', 'Divya Krishnan', 'Karan Chopra', 'Pooja Desai',
      'Sanjay Iyer', 'Ritu Bhatia', 'Manoj Pillai', 'Nisha Agarwal', 'Vivek Nambiar'
    ];
    const agencies = [
      'GreenNest Realty', 'Urban Homes Group', 'Skyline Properties', 'Trust Estates',
      'Prime Living Realtors', 'Metro Housing Co.', 'Coastal Properties', 'Elite Homes',
      'NextGen Realty', 'Golden Key Estates'
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const list = [];

    for (let i = 1; i <= 42; i++) {
      const name = pick(names);
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      const reraStatus = pick(statuses);
      const agencyStatus = pick(statuses);
      const idStatus1 = pick(statuses);
      const idStatus2 = pick(statuses);

      const allStatuses = [reraStatus, agencyStatus, idStatus1, idStatus2];
      let overallStatus = 'pending';
      if (allStatuses.every(s => s === 'approved')) overallStatus = 'approved';
      else if (allStatuses.some(s => s === 'rejected')) overallStatus = 'rejected';

      list.push({
        id: `agent_${i}`,
        name: `${name}`,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        phone: `+91 98${String(10000000 + i).slice(0, 8)}`,
        agencyName: pick(agencies),
        city: pick(cities),
        state: pick(states),
        submittedDate: date.toISOString(),
        overallStatus,
        reraDoc: {
          id: `rera_${i}`,
          label: 'RERA Certificate',
          category: 'rera',
          number: `RERA/${pick(states).slice(0, 2).toUpperCase()}/${2020 + (i % 5)}/${10000 + i}`,
          url: `https://picsum.photos/seed/rera${i}/700/500`,
          status: reraStatus,
          agentName: name,
        },
        agencyDoc: {
          id: `agency_${i}`,
          label: 'Agency License',
          category: 'agency',
          number: `LIC-${100000 + i}`,
          url: `https://picsum.photos/seed/agency${i}/700/500`,
          status: agencyStatus,
          agentName: name,
        },
        idDocs: [
          {
            id: `id1_${i}`,
            label: 'Aadhaar Card',
            category: 'documents',
            number: `XXXX XXXX ${1000 + i}`,
            url: `https://picsum.photos/seed/aadhaar${i}/700/500`,
            status: idStatus1,
            agentName: name,
          },
          {
            id: `id2_${i}`,
            label: 'PAN Card',
            category: 'documents',
            number: `ABCDE${1000 + i}F`,
            url: `https://picsum.photos/seed/pan${i}/700/500`,
            status: idStatus2,
            agentName: name,
          },
        ],
      });
    }
    return list;
  }, []);

  // ============ INIT ============
  useEffect(() => {
    const mock = generateMockAgents();
    setAgents(mock);
    setFilteredAgents(mock);
    updateStats(mock);
  }, [generateMockAgents]);

  // ============ STATS ============
  const updateStats = useCallback((list) => {
    setStats({
      total: list.length,
      pending: list.filter(a => a.overallStatus === 'pending').length,
      pendingRera: list.filter(a => a.reraDoc.status === 'pending').length,
      pendingAgency: list.filter(a => a.agencyDoc.status === 'pending').length,
      pendingDocs: list.filter(a => a.idDocs.some(d => d.status === 'pending')).length,
      fullyVerified: list.filter(a => a.overallStatus === 'approved').length,
      rejected: list.filter(a => a.overallStatus === 'rejected').length,
    });
  }, []);

  // ============ FILTER ============
  const filterAgents = useCallback(() => {
    let filtered = [...agents];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.agencyName.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'rera' && statusFilter !== 'all') {
      filtered = filtered.filter(a => a.reraDoc.status === statusFilter);
    } else if (activeTab === 'agency' && statusFilter !== 'all') {
      filtered = filtered.filter(a => a.agencyDoc.status === statusFilter);
    } else if (activeTab === 'documents' && statusFilter !== 'all') {
      filtered = filtered.filter(a => a.idDocs.some(d => d.status === statusFilter));
    } else if (activeTab === 'all' && statusFilter !== 'all') {
      filtered = filtered.filter(a => a.overallStatus === statusFilter);
    }

    setFilteredAgents(filtered);
    setCurrentPage(1);
  }, [agents, searchQuery, activeTab, statusFilter]);

  useEffect(() => { filterAgents(); }, [filterAgents]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const paginatedAgents = useMemo(() =>
    filteredAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  , [filteredAgents, currentPage, pageSize]);

  // ============ TAB CLICK ============
  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setStatusFilter('all');
    setActiveFilter('all');
  }, []);

  // ============ STAT CLICK ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setActiveTab('all'); setStatusFilter('all');
    } else if (filter === 'pending') {
      setActiveTab('all'); setStatusFilter('pending');
    } else if (filter === 'pendingRera') {
      setActiveTab('rera'); setStatusFilter('pending');
    } else if (filter === 'pendingAgency') {
      setActiveTab('agency'); setStatusFilter('pending');
    } else if (filter === 'pendingDocs') {
      setActiveTab('documents'); setStatusFilter('pending');
    } else if (filter === 'fullyVerified') {
      setActiveTab('all'); setStatusFilter('approved');
    } else if (filter === 'rejected') {
      setActiveTab('all'); setStatusFilter('rejected');
    }
    setSearchQuery('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveTab('all');
    setStatusFilter('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ VIEW AGENT ============
  const handleViewAgent = useCallback((agent) => {
    setViewingAgent(agent);
    setShowAgentModal(true);
  }, []);

  // ============ VIEW AGENT PROFILE ============
  const handleViewAgentProfile = useCallback((agentId) => {
    navigate('/profile/agent');
    showToast('Opening Agent Profile...', 'info');
  }, [navigate, showToast]);

  // ============ OPEN DOCUMENT ============
  const handleOpenDocument = useCallback((doc) => {
    setViewingDoc(doc);
    setShowDocModal(true);
  }, []);

  // ============ DOWNLOAD DOCUMENT (per-document, real file download) ============
  const handleDownloadDocument = useCallback(async (doc) => {
    const safeName = `${doc.agentName || 'agent'}_${doc.label}`
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_+|_+$/g, '');
    setActionLoading(`download_${doc.id}`);
    try {
      const response = await fetch(doc.url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${safeName}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
      showToast(`${doc.label} downloaded`, 'success');
    } catch (err) {
      // Fallback: open the document in a new tab if it can't be fetched as a blob
      // (e.g. CORS-restricted host) so the person can still save it manually.
      window.open(doc.url, '_blank', 'noopener,noreferrer');
      showToast(`Couldn't auto-download, opened "${doc.label}" in a new tab instead`, 'warning');
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  // ============ APPLY DOC STATUS (core updater) ============
  const applyDocStatus = useCallback((doc, newStatus) => {
    return new Promise((resolve) => {
      const loadKey = `${newStatus === 'approved' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'pending'}_${doc.id}`;
      setActionLoading(loadKey);
      setTimeout(() => {
        setAgents(prev => {
          const updated = prev.map(agent => {
            if (agent.reraDoc.id === doc.id) {
              const reraDoc = { ...agent.reraDoc, status: newStatus };
              return recomputeOverall({ ...agent, reraDoc });
            }
            if (agent.agencyDoc.id === doc.id) {
              const agencyDoc = { ...agent.agencyDoc, status: newStatus };
              return recomputeOverall({ ...agent, agencyDoc });
            }
            if (agent.idDocs.some(d => d.id === doc.id)) {
              const idDocs = agent.idDocs.map(d => d.id === doc.id ? { ...d, status: newStatus } : d);
              return recomputeOverall({ ...agent, idDocs });
            }
            return agent;
          });
          updateStats(updated);
          return updated;
        });

        // keep modals in sync
        setViewingDoc(prev => (prev && prev.id === doc.id) ? { ...prev, status: newStatus } : prev);
        setViewingAgent(prev => {
          if (!prev) return prev;
          if (prev.reraDoc.id === doc.id) return recomputeOverall({ ...prev, reraDoc: { ...prev.reraDoc, status: newStatus } });
          if (prev.agencyDoc.id === doc.id) return recomputeOverall({ ...prev, agencyDoc: { ...prev.agencyDoc, status: newStatus } });
          if (prev.idDocs.some(d => d.id === doc.id)) {
            const idDocs = prev.idDocs.map(d => d.id === doc.id ? { ...d, status: newStatus } : d);
            return recomputeOverall({ ...prev, idDocs });
          }
          return prev;
        });

        const statusLabel = newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'marked as pending';
        showToast(
          `${doc.label} ${statusLabel} successfully`,
          newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'warning' : 'info'
        );
        setActionLoading(null);
        resolve();
      }, 600);
    });
  }, [showToast, updateStats]);

  const recomputeOverall = (agent) => {
    const allStatuses = [agent.reraDoc.status, agent.agencyDoc.status, ...agent.idDocs.map(d => d.status)];
    let overallStatus = 'pending';
    if (allStatuses.every(s => s === 'approved')) overallStatus = 'approved';
    else if (allStatuses.some(s => s === 'rejected')) overallStatus = 'rejected';
    return { ...agent, overallStatus };
  };

  // ============ APPROVE / REJECT / PENDING DOC (with confirmation) ============
  const handleApproveDoc = useCallback((doc) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Approve Document',
      message: `Are you sure you want to approve "${doc.label}"? This will mark it as verified.`,
      confirmText: 'Yes, Approve',
      confirmColor: 'bg-emerald-500',
      icon: <FiCheckCircle className="text-4xl text-emerald-500" />,
      onConfirm: () => applyDocStatus(doc, 'approved'),
    });
  }, [applyDocStatus]);

  const handleRejectDoc = useCallback((doc) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Reject Document',
      message: `Are you sure you want to reject "${doc.label}"? The agent will need to resubmit it.`,
      confirmText: 'Yes, Reject',
      confirmColor: 'bg-red-500',
      icon: <FiXCircle className="text-4xl text-red-500" />,
      onConfirm: () => applyDocStatus(doc, 'rejected'),
    });
  }, [applyDocStatus]);

  const handleSetPendingDoc = useCallback((doc) => {
    setConfirmationModal({
      isOpen: true,
      title: 'Mark as Pending',
      message: `Are you sure you want to move "${doc.label}" back to pending review?`,
      confirmText: 'Yes, Mark Pending',
      confirmColor: 'bg-amber-500',
      icon: <FiClock className="text-4xl text-amber-500" />,
      onConfirm: () => applyDocStatus(doc, 'pending'),
    });
  }, [applyDocStatus]);

  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (confirmationModal.onConfirm) {
      await confirmationModal.onConfirm();
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ REFRESH ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mock = generateMockAgents();
      setAgents(mock);
      setFilteredAgents(mock);
      updateStats(mock);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 800);
  }, [generateMockAgents, showToast, updateStats]);

  // ============ TAB CONFIG ============
  const tabs = [
    { key: 'all', label: 'All Agents', icon: <FiUser className="text-xs" /> },
    { key: 'rera', label: 'RERA Verification', icon: <FiAward className="text-xs" /> },
    { key: 'agency', label: 'Agency Verification', icon: <FiBriefcase className="text-xs" /> },
    { key: 'documents', label: 'Document Approval', icon: <FaIdCard className="text-xs" /> },
  ];

  const statusOf = (agent) => {
    if (activeTab === 'rera') return agent.reraDoc.status;
    if (activeTab === 'agency') return agent.agencyDoc.status;
    if (activeTab === 'documents') {
      if (agent.idDocs.some(d => d.status === 'rejected')) return 'rejected';
      if (agent.idDocs.every(d => d.status === 'approved')) return 'approved';
      return 'pending';
    }
    return agent.overallStatus;
  };

  // Returns the single document relevant to a specific tab, for quick
  // inline Approve/Reject action directly on the card (when pending).
  const getQuickDoc = (agent) => {
    if (activeTab === 'rera') return agent.reraDoc;
    if (activeTab === 'agency') return agent.agencyDoc;
    if (activeTab === 'documents') return agent.idDocs.find(d => d.status === 'pending') || agent.idDocs[0];
    return null;
  };

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
        loading={!!actionLoading}
      />

      <DocumentViewerModal
        doc={viewingDoc}
        show={showDocModal}
        onClose={() => { setShowDocModal(false); setViewingDoc(null); }}
        onApprove={handleApproveDoc}
        onReject={handleRejectDoc}
        onSetPending={handleSetPendingDoc}
        onDownload={handleDownloadDocument}
        loading={actionLoading}
      />

      <AgentVerificationModal
        agent={viewingAgent}
        show={showAgentModal}
        onClose={() => { setShowAgentModal(false); setViewingAgent(null); }}
        onOpenDocument={handleOpenDocument}
        onApproveDoc={handleApproveDoc}
        onRejectDoc={handleRejectDoc}
        onSetPendingDoc={handleSetPendingDoc}
        onDownloadDocument={handleDownloadDocument}
        onViewAgentProfile={handleViewAgentProfile}
        actionLoading={!!actionLoading}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Agent Verification
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredAgents.length} Agents
              </span>
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>RERA · Agency · Document approval in one place</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiActivity className={`text-sm transition-transform duration-300 ${showStats ? 'rotate-0' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUser className="text-white text-sm" />}
                title="Total Agents" value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0} isActive={activeFilter === 'all'} onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending" value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={50} isActive={activeFilter === 'pending'} onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiAward className="text-white text-sm" />}
                title="Pending RERA" value={stats.pendingRera}
                color="bg-gradient-to-br from-yellow-600 to-yellow-400"
                delay={100} isActive={activeFilter === 'pendingRera'} onClick={() => handleStatClick('pendingRera')}
              />
              <StatCard
                icon={<FiBriefcase className="text-white text-sm" />}
                title="Pending Agency" value={stats.pendingAgency}
                color="bg-gradient-to-br from-orange-600 to-orange-400"
                delay={150} isActive={activeFilter === 'pendingAgency'} onClick={() => handleStatClick('pendingAgency')}
              />
              <StatCard
                icon={<FaIdCard className="text-white text-sm" />}
                title="Pending Docs" value={stats.pendingDocs}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={200} isActive={activeFilter === 'pendingDocs'} onClick={() => handleStatClick('pendingDocs')}
              />
              <StatCard
                icon={<MdVerified className="text-white text-sm" />}
                title="Fully Verified" value={stats.fullyVerified}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={250} isActive={activeFilter === 'fullyVerified'} onClick={() => handleStatClick('fullyVerified')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Rejected" value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={300} isActive={activeFilter === 'rejected'} onClick={() => handleStatClick('rejected')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#E8F0EE] shadow-sm flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md shadow-[#00695C]/30'
                : 'text-[#5A7D78] hover:bg-[#F5F9F8] hover:text-[#1A2E2A]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search agents by name, agency, city..."
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
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {(statusFilter !== 'all' || searchQuery || activeTab !== 'all') && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
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
                <FiGrid className="text-sm" />
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
      </div>

      {/* Agents Grid / List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedAgents.map((agent, index) => {
              const badgeStatus = statusOf(agent);
              const quickDoc = getQuickDoc(agent);
              const isQuickPending = quickDoc && quickDoc.status === 'pending';
              return (
                <div
                  key={agent.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${
                    badgeStatus === 'pending' ? 'border-l-4 border-l-amber-500' :
                    badgeStatus === 'approved' ? 'border-l-4 border-l-emerald-500' :
                    'border-l-4 border-l-red-500'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{agent.name}</h3>
                        <p className="text-[10px] text-[#5A7D78] truncate flex items-center gap-1">
                          <FaBuilding className="text-[9px]" /> {agent.agencyName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewAgent(agent)}
                      className="w-8 h-8 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      title="View Verification"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] mb-3">
                    <FiMapPin className="text-[#00695C] shrink-0" />
                    <span className="truncate">{agent.city}, {agent.state}</span>
                  </div>

                  {/* Verification badges */}
                  <div className="space-y-1.5 mb-3">
                    <button
                      onClick={() => handleOpenDocument(agent.reraDoc)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#F5F9F8] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300"
                    >
                      <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#1A2E2A]">
                        <FiAward className="text-[#00695C] text-xs" /> RERA
                      </span>
                      <StatusBadge status={agent.reraDoc.status} />
                    </button>
                    <button
                      onClick={() => handleOpenDocument(agent.agencyDoc)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#F5F9F8] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300"
                    >
                      <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#1A2E2A]">
                        <FiBriefcase className="text-[#00695C] text-xs" /> Agency
                      </span>
                      <StatusBadge status={agent.agencyDoc.status} />
                    </button>
                    <div className="flex items-center gap-1.5">
                      {agent.idDocs.map(doc => (
                        <button
                          key={doc.id}
                          onClick={() => handleOpenDocument(doc)}
                          className="flex-1 flex items-center justify-between px-2.5 py-1.5 bg-[#F5F9F8] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 min-w-0"
                          title={doc.label}
                        >
                          <span className="flex items-center gap-1 text-[9px] font-medium text-[#1A2E2A] truncate">
                            <FaIdCard className="text-[#00695C] text-[10px] shrink-0" /> {doc.label.split(' ')[0]}
                          </span>
                          <StatusBadge status={doc.status} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2.5 border-t border-[#E8F0EE]">
                    {isQuickPending ? (
                      <>
                        <button
                          onClick={() => handleRejectDoc(quickDoc)}
                          disabled={!!actionLoading}
                          className="flex-1 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105 disabled:opacity-50"
                        >
                          <FiXCircle className="text-[11px]" /> Reject
                        </button>
                        <button
                          onClick={() => handleApproveDoc(quickDoc)}
                          disabled={!!actionLoading}
                          className="flex-1 py-2 text-xs font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105 disabled:opacity-50"
                        >
                          <FiCheckCircle className="text-[11px]" /> Approve
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleViewAgent(agent)}
                        className="flex-1 py-2 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105"
                      >
                        <FiShield className="text-[11px]" /> Review Verification
                      </button>
                    )}
                  </div>
                  {isQuickPending && (
                    <button
                      onClick={() => handleViewAgent(agent)}
                      className="w-full mt-1.5 py-1.5 text-[10px] font-medium text-[#5A7D78] hover:text-[#00695C] transition-all duration-300 flex items-center justify-center gap-1"
                    >
                      <FiEye className="text-[10px]" /> View full verification
                    </button>
                  )}

                  <div className="mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleViewAgentProfile(agent.id)}
                      className="w-full py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                    >
                      <FiExternalLink className="text-[10px]" />
                      View Agent Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-3">Agent</div>
              <div className="col-span-2">Agency</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1 text-center">RERA</div>
              <div className="col-span-1 text-center">Agency</div>
              <div className="col-span-1 text-center">Docs</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedAgents.map((agent) => {
              const quickDoc = getQuickDoc(agent);
              const isQuickPending = quickDoc && quickDoc.status === 'pending';
              return (
              <div
                key={agent.id}
                className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300"
              >
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {agent.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{agent.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{agent.email}</p>
                  </div>
                </div>
                <div className="col-span-2 text-xs text-[#5A7D78] truncate">{agent.agencyName}</div>
                <div className="col-span-2 text-xs text-[#5A7D78] truncate">{agent.city}, {agent.state}</div>
                <div className="col-span-1 flex justify-center">
                  <button onClick={() => handleOpenDocument(agent.reraDoc)}><StatusBadge status={agent.reraDoc.status} /></button>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button onClick={() => handleOpenDocument(agent.agencyDoc)}><StatusBadge status={agent.agencyDoc.status} /></button>
                </div>
                <div className="col-span-1 flex justify-center gap-1">
                  {agent.idDocs.map(doc => (
                    <button key={doc.id} onClick={() => handleOpenDocument(doc)} title={doc.label}>
                      <StatusBadge status={doc.status} />
                    </button>
                  ))}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {isQuickPending && (
                    <>
                      <button
                        onClick={() => handleRejectDoc(quickDoc)}
                        disabled={!!actionLoading}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50"
                        title="Reject"
                      >
                        <FiXCircle className="text-xs" />
                      </button>
                      <button
                        onClick={() => handleApproveDoc(quickDoc)}
                        disabled={!!actionLoading}
                        className="w-7 h-7 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center text-emerald-600 hover:scale-110 disabled:opacity-50"
                        title="Approve"
                      >
                        <FiCheckCircle className="text-xs" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewAgent(agent)}
                    className="px-3 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center gap-1 hover:scale-105"
                  >
                    <FiEye className="text-[10px]" /> Review
                  </button>
                </div>

                <div className="col-span-12 mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleViewAgentProfile(agent.id)}
                    className="px-3 py-1 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center gap-1 hover:scale-[1.02]"
                  >
                    <FiExternalLink className="text-[10px]" />
                    View Agent Profile
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {paginatedAgents.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUser className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No agents found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredAgents.length)} of{' '}
              {filteredAgents.length} agents
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={18}>18</option>
              <option value={30}>30</option>
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
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${
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

      {/* CSS Animations */}
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
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AgentsVerification;