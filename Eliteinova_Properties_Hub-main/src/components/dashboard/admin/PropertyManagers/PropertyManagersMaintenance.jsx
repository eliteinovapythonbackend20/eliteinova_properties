// src/components/dashboard/admin/PropertyManagers/PropertyManagersMaintenance.jsx

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
  FiVideo, FiCamera, FiUsers, FiBarChart2, FiTrendingUp,
  FiAward, FiBriefcase, FiTarget, FiPieChart, FiLayers,
  FiCheckSquare, FiPlayCircle, FiFlag, FiTool,
  FiClipboard, FiCreditCard, FiFile, FiCalendar as FiCalendarIcon,
  FiMessageSquare, FiThumbsUp, FiThumbsDown, FiAlertOctagon,
  FiPaperclip, FiClock as FiClockIcon, FiCheck, FiX as FiXIcon,
  FiSliders, FiPenTool, FiAnchor, FiBookOpen, FiFilePlus,
  FiFolder, FiBarChart, FiTrendingUp as FiTrendingUpIcon,
  FiDollarSign as FiDollarSignIcon, FiRotateCcw, FiSend,
  FiCheckCircle as FiCheckCircleIcon
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie, FaUserGraduate,
  FaCity, FaHammer, FaHardHat, FaClipboardList,
  FaTools, FaWrench, FaPaintRoller, FaPlug,
  FaWater, FaBolt, FaThermometerHalf, FaBug,
  FaKey, FaFileInvoice, FaHandshake, FaCalendarCheck,
  FaScrewdriver, FaTint, FaFan, FaMoneyBillWave,
  FaFileContract, FaHandsHelping, FaClipboardCheck,
  FaBell, FaEnvelope, FaPhoneAlt, FaRegCheckCircle
} from 'react-icons/fa';
import { 
  MdOutlineRealEstateAgent, 
  MdApartment, 
  MdOutlineBusiness, 
  MdOutlineLeaderboard, 
  MdOutlineConstruction, 
  MdOutlineApartment,
  MdOutlineReportProblem,
  MdOutlinePayment,
  MdOutlineFileCopy,
  MdOutlineAssignment,
  MdOutlineBuild,
  MdOutlineMiscellaneousServices,
  MdOutlineSettingsSuggest,
  MdOutlineHomeRepairService,
  MdOutlineReceipt,
  MdOutlineDescription,
  MdOutlineEventNote,
  MdOutlinePersonAdd
} from 'react-icons/md';

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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
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
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick, subtitle }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick && onClick()}
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
          {subtitle && <p className="text-[8px] text-[#B5C9C5]">{subtitle}</p>}
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

// ============ TAB COMPONENT ============
const TabButton = ({ icon, label, isActive, onClick, count, color }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium whitespace-nowrap ${
        isActive 
          ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' 
          : 'bg-white text-[#5A7D78] hover:bg-[#F5F9F8] hover:text-[#1A2E2A] border border-[#E8F0EE]'
      } hover:scale-105`}
    >
      <span className={`text-base ${isActive ? 'text-white' : color}`}>{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
          isActive ? 'bg-white/20 text-white' : 'bg-[#F5F9F8] text-[#5A7D78]'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

// ============ VIEW MODAL ============
const ViewItemModal = ({ item, show, onClose, type }) => {
  if (!item || !show) return null;

  const getTitle = () => {
    switch(type) {
      case 'complaint': return 'Complaint Details';
      case 'rent': return 'Rent Details';
      case 'lease': return 'Lease Details';
      case 'service': return 'Service Request Details';
      default: return 'Details';
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEye className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{getTitle()}</h2>
              <p className="text-white/70 text-[10px]">{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(item).map(([key, value]) => {
              if (key === 'id' || key === '__v') return null;
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={key} className="bg-[#F5F9F8] rounded-xl p-3">
                  <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">{label}</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{value || '-'}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ EDIT MODAL ============
const EditItemModal = ({ item, show, onClose, onSave, type, loading }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item && show) {
      setFormData({ ...item });
      setErrors({});
    }
  }, [item, show]);

  if (!item || !show || !formData) return null;

  const getTitle = () => {
    switch(type) {
      case 'complaint': return 'Edit Complaint';
      case 'rent': return 'Edit Rent Record';
      case 'lease': return 'Edit Lease';
      case 'service': return 'Edit Service Request';
      default: return 'Edit';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
    }, 600);
  };

  // ============ COMPLAINT FIELD CONFIG ============
  const renderComplaintFields = () => {
    const statusOptions = [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'closed', label: 'Closed' },
      { value: 'needs-review', label: 'Needs Review' },
      { value: 'rejected', label: 'Rejected' }
    ];
    const priorityOptions = [
      { value: 'urgent', label: 'Urgent' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ];
    const typeOptions = [
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'hvac', label: 'HVAC' },
      { value: 'pest', label: 'Pest Control' },
      { value: 'structural', label: 'Structural' },
      { value: 'painting', label: 'Painting' },
      { value: 'appliance', label: 'Appliance' },
      { value: 'other', label: 'Other' }
    ];

    const fields = [];
    const excludeKeys = ['id', '__v'];

    Object.entries(formData).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (key === 'status') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'pending'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'priority') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'medium'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {priorityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'type') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'other'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'description' || key === 'notes') {
        fields.push(
          <div key={key} className="md:col-span-2">
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label}</label>
            <textarea
              name={key}
              value={value || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none"
            />
          </div>
        );
      } else if (key === 'reportedDate' || key === 'assignedTo' || key === 'tenant' || key === 'unit' || key === 'title') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} {['title', 'tenant', 'unit'].includes(key) && <span className="text-red-500">*</span>}</label>
            <input
              type={key.includes('Date') ? 'date' : 'text'}
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      } else {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label}</label>
            <input
              type="text"
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      }
    });

    return fields;
  };

  // ============ RENT FIELD CONFIG ============
  const renderRentFields = () => {
    const statusOptions = [
      { value: 'paid', label: 'Paid' },
      { value: 'pending', label: 'Pending' },
      { value: 'overdue', label: 'Overdue' },
      { value: 'partial', label: 'Partial' }
    ];
    const monthOptions = [
      { value: 'Jan', label: 'January' },
      { value: 'Feb', label: 'February' },
      { value: 'Mar', label: 'March' },
      { value: 'Apr', label: 'April' },
      { value: 'May', label: 'May' },
      { value: 'Jun', label: 'June' },
      { value: 'Jul', label: 'July' },
      { value: 'Aug', label: 'August' },
      { value: 'Sep', label: 'September' },
      { value: 'Oct', label: 'October' },
      { value: 'Nov', label: 'November' },
      { value: 'Dec', label: 'December' }
    ];

    const fields = [];
    const excludeKeys = ['id', '__v'];

    Object.entries(formData).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (key === 'status') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'pending'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'month') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'Jan'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {monthOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'amount') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <input
              type="number"
              name={key}
              value={value || 0}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      } else if (key === 'tenant' || key === 'unit' || key === 'dueDate' || key === 'paidDate') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} {['tenant', 'unit'].includes(key) && <span className="text-red-500">*</span>}</label>
            <input
              type={key.includes('Date') ? 'date' : 'text'}
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      } else {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label}</label>
            <input
              type="text"
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      }
    });

    return fields;
  };

  // ============ LEASE FIELD CONFIG ============
  const renderLeaseFields = () => {
    const statusOptions = [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'expired', label: 'Expired' },
      { value: 'renewed', label: 'Renewed' },
      { value: 'not-renewed', label: 'Not Renewed' }
    ];

    const fields = [];
    const excludeKeys = ['id', '__v', 'daysLeft'];

    Object.entries(formData).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (key === 'status') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'active'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'rent') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <input
              type="number"
              name={key}
              value={value || 0}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      } else if (key === 'tenant' || key === 'unit' || key === 'leaseStart' || key === 'leaseEnd') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} {['tenant', 'unit'].includes(key) && <span className="text-red-500">*</span>}</label>
            <input
              type={key.includes('lease') ? 'date' : 'text'}
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      } else {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label}</label>
            <input
              type="text"
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      }
    });

    return fields;
  };

  // ============ SERVICE FIELD CONFIG ============
  const renderServiceFields = () => {
    const statusOptions = [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'scheduled', label: 'Scheduled' }
    ];
    const typeOptions = [
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'repair', label: 'Repair' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'landscaping', label: 'Landscaping' },
      { value: 'security', label: 'Security' },
      { value: 'pest', label: 'Pest Control' },
      { value: 'other', label: 'Other' }
    ];
    const priorityOptions = [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ];

    const fields = [];
    const excludeKeys = ['id', '__v'];

    Object.entries(formData).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      if (key === 'status') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'pending'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'type') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'other'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'priority') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} <span className="text-red-500">*</span></label>
            <select
              name={key}
              value={value || 'medium'}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            >
              {priorityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      } else if (key === 'description' || key === 'notes') {
        fields.push(
          <div key={key} className="md:col-span-2">
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label}</label>
            <textarea
              name={key}
              value={value || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none"
            />
          </div>
        );
      } else if (key === 'title' || key === 'tenant' || key === 'unit' || key === 'requestedDate' || key === 'scheduledDate') {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label} {['title', 'tenant', 'unit'].includes(key) && <span className="text-red-500">*</span>}</label>
            <input
              type={key.includes('Date') ? 'date' : 'text'}
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      } else {
        fields.push(
          <div key={key}>
            <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">{label}</label>
            <input
              type="text"
              name={key}
              value={value || ''}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
            />
          </div>
        );
      }
    });

    return fields;
  };

  const renderFields = () => {
    switch(type) {
      case 'complaint': return renderComplaintFields();
      case 'rent': return renderRentFields();
      case 'lease': return renderLeaseFields();
      case 'service': return renderServiceFields();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEdit className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{getTitle()}</h2>
              <p className="text-white/70 text-[10px]">{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderFields()}
          </div>

          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex items-center gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting || loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ COMPLAINT MANAGEMENT ============
const ComplaintManagement = ({ data, onView, onEdit, onResolve, onDelete, onStart, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');

  const priorityColors = {
    urgent: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-amber-500',
    low: 'border-l-blue-500',
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-gray-100 text-gray-700',
    'needs-review': 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const priorityLabels = {
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  const typeLabels = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    hvac: 'HVAC',
    pest: 'Pest Control',
    structural: 'Structural',
    painting: 'Painting',
    appliance: 'Appliance',
    other: 'Other'
  };

  const complaintIcons = {
    plumbing: <FaWater className="text-blue-500" />,
    electrical: <FaBolt className="text-yellow-500" />,
    hvac: <FaThermometerHalf className="text-orange-500" />,
    pest: <FaBug className="text-red-500" />,
    structural: <FaHammer className="text-gray-600" />,
    painting: <FaPaintRoller className="text-purple-500" />,
    appliance: <FaPlug className="text-green-500" />,
    other: <FaTools className="text-gray-500" />,
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.tenant.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === selectedPriority);
    }
    return filtered;
  }, [data, searchQuery, selectedStatus, selectedPriority]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (paginatedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
          <FiTool className="text-3xl text-[#B5C9C5]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A2E2A]">No complaints found</h3>
        <p className="text-sm text-[#5A7D78] mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="needs-review">Needs Review</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm outline-none"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiGrid className="text-sm" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiList className="text-sm" /></button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${priorityColors[item.priority] || 'border-l-[#00695C]'} p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.priority === 'urgent' ? 'from-red-600 to-red-400' : item.priority === 'high' ? 'from-orange-600 to-orange-400' : 'from-amber-600 to-amber-400'} flex items-center justify-center text-white`}>
                    {complaintIcons[item.type] || <FaTools className="text-sm" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A] truncate max-w-[150px]">{item.title}</h4>
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700`}>
                        {priorityLabels[item.priority]}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onView(item)} className="p-1 hover:bg-[#F5F9F8] rounded-lg transition-colors text-[#5A7D78] hover:text-[#00695C]">
                  <FiEye className="text-sm" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiUser className="text-[#00695C]" /> {item.tenant}</div>
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {item.reportedDate}</div>
                {item.assignedTo && <div className="flex items-center gap-2"><FiUserCheck className="text-[#00695C]" /> {item.assignedTo}</div>}
              </div>

              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                  <FiEye className="text-[10px]" /> View
                </button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-colors flex items-center justify-center gap-1">
                  <FiEdit className="text-[10px]" /> Edit
                </button>
                {item.status === 'pending' && (
                  <button onClick={() => onStart(item)} className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                    <FiPlayCircle className="text-[10px]" /> Start
                  </button>
                )}
                {item.status !== 'resolved' && item.status !== 'closed' && item.status !== 'rejected' && (
                  <button onClick={() => onResolve(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                    <FiCheckCircle className="text-[10px]" /> Resolve
                  </button>
                )}
                <button onClick={() => onDelete(item.id)} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                  <FiTrash2 className="text-[10px]" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-xs font-medium text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE]">
              <div className="col-span-3">Title</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Tenant</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-1">Reported</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {paginatedData.map((item) => (
              <div key={item.id} className={`grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] border-l-4 ${priorityColors[item.priority] || 'border-l-[#00695C]'} hover:bg-[#F5F9F8] transition-colors`}>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.priority === 'urgent' ? 'from-red-600 to-red-400' : 'from-amber-600 to-amber-400'} flex items-center justify-center text-white text-xs flex-shrink-0`}>
                      {complaintIcons[item.type] || <FaTools className="text-[8px]" />}
                    </div>
                    <span className="text-sm font-medium text-[#1A2E2A] truncate">{item.title}</span>
                  </div>
                </div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{typeLabels[item.type] || item.type}</div>
                <div className="col-span-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.priority === 'urgent' ? 'bg-red-100 text-red-700' : item.priority === 'high' ? 'bg-orange-100 text-orange-700' : item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{priorityLabels[item.priority]}</span></div>
                <div className="col-span-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></div>
                <div className="col-span-1 text-xs text-[#5A7D78] truncate">{item.tenant}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.unit}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.reportedDate}</div>
                <div className="col-span-3 flex items-center justify-end gap-1 flex-wrap">
                  <button onClick={() => onView(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                    <FiEye className="text-[10px]" /> View
                  </button>
                  <button onClick={() => onEdit(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] transition-colors flex items-center gap-1">
                    <FiEdit className="text-[10px]" /> Edit
                  </button>
                  {item.status === 'pending' && (
                    <button onClick={() => onStart(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1">
                      <FiPlayCircle className="text-[10px]" /> Start
                    </button>
                  )}
                  {item.status !== 'resolved' && item.status !== 'closed' && item.status !== 'rejected' && (
                    <button onClick={() => onResolve(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1">
                      <FiCheckCircle className="text-[10px]" /> Resolve
                    </button>
                  )}
                  <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1">
                    <FiTrash2 className="text-[10px]" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5A7D78]">Showing {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronLeft className="text-sm" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
              if (totalPages > 5 && currentPage > totalPages - 3) page = totalPages - 4 + i;
              if (page > totalPages) return null;
              return <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${currentPage === page ? 'bg-[#00695C] text-white' : 'hover:bg-[#F5F9F8]'}`}>{page}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronRight className="text-sm" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ RENT COLLECTION ============
const RentCollection = ({ data, onView, onEdit, onPay, onDelete, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');

  const statusColors = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    partial: 'bg-blue-100 text-blue-700',
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.tenant.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    return filtered;
  }, [data, searchQuery, selectedStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (paginatedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
          <FiDollarSign className="text-3xl text-[#B5C9C5]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A2E2A]">No rent records found</h3>
        <p className="text-sm text-[#5A7D78] mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input type="text" placeholder="Search rent records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
        </div>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="partial">Partial</option>
        </select>
        <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiGrid className="text-sm" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiList className="text-sm" /></button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-lg">
                    <FiDollarSign />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A]">{item.tenant}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button onClick={() => onView(item)} className="p-1 hover:bg-[#F5F9F8] rounded-lg text-[#5A7D78] hover:text-[#00695C]"><FiEye className="text-sm" /></button>
              </div>
              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit}</div>
                <div className="flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> ₹{item.amount.toLocaleString()}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {item.month} {item.dueDate}</div>
                {item.paidDate && <div className="flex items-center gap-2"><FiCheckCircle className="text-[#00695C]" /> Paid: {item.paidDate}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"><FiEye className="text-[10px]" /> View</button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-colors flex items-center justify-center gap-1"><FiEdit className="text-[10px]" /> Edit</button>
                {item.status !== 'paid' && (
                  <button onClick={() => onPay(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"><FiCheckCircle className="text-[10px]" /> Pay</button>
                )}
                <button onClick={() => onDelete(item.id)} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-xs font-medium text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE]">
              <div className="col-span-2">Tenant</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1">Month</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Due Date</div>
              <div className="col-span-1">Paid Date</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {paginatedData.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors">
                <div className="col-span-2 text-sm font-medium text-[#1A2E2A]">{item.tenant}</div>
                <div className="col-span-1 text-sm text-[#5A7D78]">{item.unit}</div>
                <div className="col-span-2 text-sm font-semibold text-[#1A2E2A]">₹{item.amount.toLocaleString()}</div>
                <div className="col-span-1 text-sm text-[#5A7D78]">{item.month}</div>
                <div className="col-span-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.dueDate}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.paidDate || '-'}</div>
                <div className="col-span-3 flex items-center justify-end gap-1 flex-wrap">
                  <button onClick={() => onView(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"><FiEye className="text-[10px]" /> View</button>
                  <button onClick={() => onEdit(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] transition-colors flex items-center gap-1"><FiEdit className="text-[10px]" /> Edit</button>
                  {item.status !== 'paid' && (
                    <button onClick={() => onPay(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"><FiCheckCircle className="text-[10px]" /> Pay</button>
                  )}
                  <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5A7D78]">Showing {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronLeft className="text-sm" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
              if (totalPages > 5 && currentPage > totalPages - 3) page = totalPages - 4 + i;
              if (page > totalPages) return null;
              return <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${currentPage === page ? 'bg-[#00695C] text-white' : 'hover:bg-[#F5F9F8]'}`}>{page}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronRight className="text-sm" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ LEASE RENEWAL ============
const LeaseRenewal = ({ data, onView, onEdit, onRenew, onDelete, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    expired: 'bg-red-100 text-red-700',
    renewed: 'bg-blue-100 text-blue-700',
    'not-renewed': 'bg-gray-100 text-gray-700',
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.tenant.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    return filtered;
  }, [data, searchQuery, selectedStatus]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (paginatedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
          <FiFile className="text-3xl text-[#B5C9C5]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A2E2A]">No lease records found</h3>
        <p className="text-sm text-[#5A7D78] mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input type="text" placeholder="Search lease records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
        </div>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="renewed">Renewed</option>
          <option value="not-renewed">Not Renewed</option>
        </select>
        <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiGrid className="text-sm" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiList className="text-sm" /></button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-lg"><FiFile /></div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A]">{item.tenant}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                  </div>
                </div>
                <button onClick={() => onView(item)} className="p-1 hover:bg-[#F5F9F8] rounded-lg text-[#5A7D78] hover:text-[#00695C]"><FiEye className="text-sm" /></button>
              </div>
              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {item.leaseStart} → {item.leaseEnd}</div>
                <div className="flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> ₹{item.rent.toLocaleString()}/month</div>
                <div className="flex items-center gap-2"><FiClock className="text-[#00695C]" /> {item.daysLeft}</div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"><FiEye className="text-[10px]" /> View</button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-colors flex items-center justify-center gap-1"><FiEdit className="text-[10px]" /> Edit</button>
                {(item.status === 'expired' || item.status === 'pending') && (
                  <button onClick={() => onRenew(item)} className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"><FiRotateCcw className="text-[10px]" /> Renew</button>
                )}
                <button onClick={() => onDelete(item.id)} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-xs font-medium text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE]">
              <div className="col-span-2">Tenant</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-1">Start</div>
              <div className="col-span-1">End</div>
              <div className="col-span-1">Rent</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Days Left</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>
            {paginatedData.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors">
                <div className="col-span-2 text-sm font-medium text-[#1A2E2A]">{item.tenant}</div>
                <div className="col-span-1 text-sm text-[#5A7D78]">{item.unit}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.leaseStart}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.leaseEnd}</div>
                <div className="col-span-1 text-sm font-semibold text-[#1A2E2A]">₹{item.rent.toLocaleString()}</div>
                <div className="col-span-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.daysLeft}</div>
                <div className="col-span-4 flex items-center justify-end gap-1 flex-wrap">
                  <button onClick={() => onView(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"><FiEye className="text-[10px]" /> View</button>
                  <button onClick={() => onEdit(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] transition-colors flex items-center gap-1"><FiEdit className="text-[10px]" /> Edit</button>
                  {(item.status === 'expired' || item.status === 'pending') && (
                    <button onClick={() => onRenew(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1"><FiRotateCcw className="text-[10px]" /> Renew</button>
                  )}
                  <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5A7D78]">Showing {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronLeft className="text-sm" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
              if (totalPages > 5 && currentPage > totalPages - 3) page = totalPages - 4 + i;
              if (page > totalPages) return null;
              return <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${currentPage === page ? 'bg-[#00695C] text-white' : 'hover:bg-[#F5F9F8]'}`}>{page}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronRight className="text-sm" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ SERVICE REQUESTS ============
const ServiceRequests = ({ data, onView, onEdit, onComplete, onDelete, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    scheduled: 'bg-purple-100 text-purple-700',
  };

  const typeLabels = {
    cleaning: 'Cleaning',
    repair: 'Repair',
    maintenance: 'Maintenance',
    landscaping: 'Landscaping',
    security: 'Security',
    pest: 'Pest Control',
    other: 'Other'
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.tenant.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') filtered = filtered.filter(item => item.status === selectedStatus);
    if (selectedType !== 'all') filtered = filtered.filter(item => item.type === selectedType);
    return filtered;
  }, [data, searchQuery, selectedStatus, selectedType]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  if (paginatedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
          <FiClipboard className="text-3xl text-[#B5C9C5]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1A2E2A]">No service requests found</h3>
        <p className="text-sm text-[#5A7D78] mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input type="text" placeholder="Search service requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
        </div>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm outline-none">
          <option value="all">All Types</option>
          <option value="cleaning">Cleaning</option>
          <option value="repair">Repair</option>
          <option value="maintenance">Maintenance</option>
          <option value="landscaping">Landscaping</option>
          <option value="security">Security</option>
          <option value="pest">Pest Control</option>
          <option value="other">Other</option>
        </select>
        <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiGrid className="text-sm" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}><FiList className="text-sm" /></button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-lg"><FiClipboard /></div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A] truncate max-w-[150px]">{item.title}</h4>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                  </div>
                </div>
                <button onClick={() => onView(item)} className="p-1 hover:bg-[#F5F9F8] rounded-lg text-[#5A7D78] hover:text-[#00695C]"><FiEye className="text-sm" /></button>
              </div>
              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiTag className="text-[#00695C]" /> {typeLabels[item.type] || item.type}</div>
                <div className="flex items-center gap-2"><FiUser className="text-[#00695C]" /> {item.tenant}</div>
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {item.requestedDate}</div>
                {item.scheduledDate && <div className="flex items-center gap-2"><FiClock className="text-[#00695C]" /> Scheduled: {item.scheduledDate}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"><FiEye className="text-[10px]" /> View</button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-colors flex items-center justify-center gap-1"><FiEdit className="text-[10px]" /> Edit</button>
                {item.status !== 'completed' && item.status !== 'cancelled' && (
                  <button onClick={() => onComplete(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"><FiCheckCircle className="text-[10px]" /> Complete</button>
                )}
                <button onClick={() => onDelete(item.id)} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-xs font-medium text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE]">
              <div className="col-span-2">Title</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Tenant</div>
              <div className="col-span-1">Unit</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Requested</div>
              <div className="col-span-1">Scheduled</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {paginatedData.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors">
                <div className="col-span-2 text-sm font-medium text-[#1A2E2A] truncate">{item.title}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{typeLabels[item.type] || item.type}</div>
                <div className="col-span-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></div>
                <div className="col-span-1 text-xs text-[#5A7D78] truncate">{item.tenant}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.unit}</div>
                <div className="col-span-1"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.priority === 'high' ? 'bg-red-100 text-red-700' : item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{item.priority}</span></div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.requestedDate}</div>
                <div className="col-span-1 text-xs text-[#5A7D78]">{item.scheduledDate || '-'}</div>
                <div className="col-span-3 flex items-center justify-end gap-1 flex-wrap">
                  <button onClick={() => onView(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"><FiEye className="text-[10px]" /> View</button>
                  <button onClick={() => onEdit(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] transition-colors flex items-center gap-1"><FiEdit className="text-[10px]" /> Edit</button>
                  {item.status !== 'completed' && item.status !== 'cancelled' && (
                    <button onClick={() => onComplete(item)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1"><FiCheckCircle className="text-[10px]" /> Complete</button>
                  )}
                  <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5A7D78]">Showing {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronLeft className="text-sm" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
              if (totalPages > 5 && currentPage > totalPages - 3) page = totalPages - 4 + i;
              if (page > totalPages) return null;
              return <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${currentPage === page ? 'bg-[#00695C] text-white' : 'hover:bg-[#F5F9F8]'}`}>{page}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"><FiChevronRight className="text-sm" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ MAIN COMPONENT ============
const PropertyManagersMaintenance = () => {
  const [activeTab, setActiveTab] = useState('complaints');
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewType, setViewType] = useState('complaint');
  const [editType, setEditType] = useState('complaint');

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockComplaints = useCallback(() => {
    const titles = [
      'Leaking bathroom faucet', 'AC not cooling', 'Electrical short in kitchen',
      'Pest control in unit 204', 'Broken window glass', 'Painting required in living room',
      'Refrigerator not working', 'Water heater issue', 'Clogged drainage',
      'Flickering lights in hallway', 'Heating system malfunction', 'Door lock broken'
    ];
    const types = ['plumbing', 'electrical', 'hvac', 'pest', 'structural', 'painting', 'appliance', 'other'];
    const priorities = ['urgent', 'high', 'medium', 'low'];
    const statuses = ['pending', 'in-progress', 'resolved', 'closed', 'needs-review', 'rejected'];
    const tenants = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Lee', 'Sarah Wilson'];
    const units = ['A101', 'B202', 'C303', 'D404', 'A205', 'B306'];

    return Array.from({ length: 15 }, (_, i) => ({
      id: `CMP-${String(i + 1).padStart(4, '0')}`,
      title: titles[i % titles.length],
      type: types[i % types.length],
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      description: `Detailed description for ${titles[i % titles.length].toLowerCase()}.`,
      tenant: tenants[i % tenants.length],
      unit: units[i % units.length],
      assignedTo: Math.random() > 0.4 ? 'Mike Wilson' : '',
      reportedDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      resolvedDate: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : '',
    }));
  }, []);

  const generateMockRent = useCallback(() => {
    const tenants = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Lee', 'Sarah Wilson'];
    const units = ['A101', 'B202', 'C303', 'D404', 'A205', 'B306'];
    const statuses = ['paid', 'pending', 'overdue', 'partial'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return Array.from({ length: 20 }, (_, i) => ({
      id: `RNT-${String(i + 1).padStart(4, '0')}`,
      tenant: tenants[i % tenants.length],
      unit: units[i % units.length],
      amount: Math.floor(Math.random() * 50000) + 15000,
      month: months[i % months.length],
      status: statuses[i % statuses.length],
      dueDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      paidDate: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : '',
    }));
  }, []);

  const generateMockLeases = useCallback(() => {
    const tenants = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Lee', 'Sarah Wilson'];
    const units = ['A101', 'B202', 'C303', 'D404', 'A205', 'B306'];
    const statuses = ['active', 'pending', 'expired', 'renewed', 'not-renewed'];

    return Array.from({ length: 12 }, (_, i) => {
      const start = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
      const end = new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
      const daysLeft = Math.ceil((end.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      return {
        id: `LSE-${String(i + 1).padStart(4, '0')}`,
        tenant: tenants[i % tenants.length],
        unit: units[i % units.length],
        leaseStart: start.toISOString().split('T')[0],
        leaseEnd: end.toISOString().split('T')[0],
        rent: Math.floor(Math.random() * 40000) + 10000,
        status: statuses[i % statuses.length],
        daysLeft: daysLeft > 0 ? `${daysLeft} days` : 'Expired',
      };
    });
  }, []);

  const generateMockServices = useCallback(() => {
    const titles = [
      'Deep cleaning required', 'AC repair', 'Plumbing inspection',
      'Garden maintenance', 'Security system check', 'Pest control',
      'Carpet cleaning', 'Window washing', 'Elevator maintenance'
    ];
    const types = ['cleaning', 'repair', 'maintenance', 'landscaping', 'security', 'pest', 'other'];
    const statuses = ['pending', 'in-progress', 'completed', 'cancelled', 'scheduled'];
    const priorities = ['high', 'medium', 'low'];
    const tenants = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Lee', 'Sarah Wilson'];
    const units = ['A101', 'B202', 'C303', 'D404', 'A205', 'B306'];

    return Array.from({ length: 10 }, (_, i) => ({
      id: `SRV-${String(i + 1).padStart(4, '0')}`,
      title: titles[i % titles.length],
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      tenant: tenants[i % tenants.length],
      unit: units[i % units.length],
      requestedDate: new Date(Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      scheduledDate: Math.random() > 0.3 ? new Date(Date.now() + Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : '',
      description: `Service request for ${titles[i % titles.length].toLowerCase()}.`,
    }));
  }, []);

  const [complaints, setComplaints] = useState([]);
  const [rentRecords, setRentRecords] = useState([]);
  const [leaseRecords, setLeaseRecords] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    setComplaints(generateMockComplaints());
    setRentRecords(generateMockRent());
    setLeaseRecords(generateMockLeases());
    setServiceRequests(generateMockServices());
  }, []);

  // ============ HANDLERS ============
  const handleView = (item, type) => {
    setViewingItem(item);
    setViewType(type);
    setShowViewModal(true);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedData) => {
    setActionLoading('edit');
    setTimeout(() => {
      const type = editType;
      if (type === 'complaint') {
        setComplaints(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
      } else if (type === 'rent') {
        setRentRecords(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
      } else if (type === 'lease') {
        setLeaseRecords(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
      } else if (type === 'service') {
        setServiceRequests(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
      }
      setShowEditModal(false);
      setEditingItem(null);
      setActionLoading(null);
      showToast('Item updated successfully!', 'success');
    }, 600);
  };

  const handleResolve = (item) => {
    setActionLoading('resolve');
    setTimeout(() => {
      setComplaints(prev => prev.map(c => 
        c.id === item.id ? { ...c, status: 'resolved', resolvedDate: new Date().toISOString().split('T')[0] } : c
      ));
      setActionLoading(null);
      showToast(`Complaint ${item.id} resolved successfully!`, 'success');
    }, 600);
  };

  const handleStart = (item) => {
    setActionLoading('start');
    setTimeout(() => {
      setComplaints(prev => prev.map(c => 
        c.id === item.id ? { ...c, status: 'in-progress' } : c
      ));
      setActionLoading(null);
      showToast(`Complaint ${item.id} started!`, 'info');
    }, 600);
  };

  const handlePay = (item) => {
    setActionLoading('pay');
    setTimeout(() => {
      setRentRecords(prev => prev.map(r => 
        r.id === item.id ? { ...r, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : r
      ));
      setActionLoading(null);
      showToast(`Rent payment for ${item.tenant} marked as paid!`, 'success');
    }, 600);
  };

  const handleRenew = (item) => {
    setActionLoading('renew');
    setTimeout(() => {
      const newEnd = new Date();
      newEnd.setFullYear(newEnd.getFullYear() + 1);
      setLeaseRecords(prev => prev.map(l => 
        l.id === item.id ? { 
          ...l, 
          status: 'renewed', 
          leaseStart: new Date().toISOString().split('T')[0],
          leaseEnd: newEnd.toISOString().split('T')[0],
          daysLeft: '365 days'
        } : l
      ));
      setActionLoading(null);
      showToast(`Lease for ${item.tenant} renewed successfully!`, 'success');
    }, 600);
  };

  const handleComplete = (item) => {
    setActionLoading('complete');
    setTimeout(() => {
      setServiceRequests(prev => prev.map(s => 
        s.id === item.id ? { ...s, status: 'completed' } : s
      ));
      setActionLoading(null);
      showToast(`Service request ${item.id} completed!`, 'success');
    }, 600);
  };

  const handleDelete = (id, type) => {
    setActionLoading('delete');
    setTimeout(() => {
      if (type === 'complaint') {
        setComplaints(prev => prev.filter(item => item.id !== id));
      } else if (type === 'rent') {
        setRentRecords(prev => prev.filter(item => item.id !== id));
      } else if (type === 'lease') {
        setLeaseRecords(prev => prev.filter(item => item.id !== id));
      } else if (type === 'service') {
        setServiceRequests(prev => prev.filter(item => item.id !== id));
      }
      setActionLoading(null);
      showToast(`Item ${id} deleted successfully!`, 'error');
    }, 600);
  };

  // ============ TABS DATA ============
  const tabs = [
    { id: 'complaints', label: 'Complaints', icon: <FiAlertTriangle className="text-red-500" />, count: complaints.length },
    { id: 'rent', label: 'Rent Collection', icon: <FiDollarSign className="text-emerald-500" />, count: rentRecords.length },
    { id: 'lease', label: 'Lease Renewal', icon: <FiFile className="text-blue-500" />, count: leaseRecords.length },
    { id: 'service', label: 'Service Requests', icon: <FiClipboard className="text-purple-500" />, count: serviceRequests.length },
  ];

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Toast */}
      <Toast toast={toast} />

      {/* View Modal */}
      <ViewItemModal
        item={viewingItem}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingItem(null); }}
        type={viewType}
      />

      {/* Edit Modal */}
      <EditItemModal
        item={editingItem}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingItem(null); }}
        onSave={handleSaveEdit}
        type={editType}
        loading={actionLoading === 'edit'}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Property Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {complaints.length + rentRecords.length + leaseRecords.length + serviceRequests.length} Total
              </span>
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage complaints, rent collection, lease renewals & service requests</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <button 
            onClick={() => showToast('Data refreshed!', 'success')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md hover:scale-105"
          >
            <FiRefreshCw className="text-sm" /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE]">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              count={tab.count}
            />
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] min-h-[400px]">
        {activeTab === 'complaints' && (
          <ComplaintManagement
            data={complaints}
            onView={(item) => handleView(item, 'complaint')}
            onEdit={(item) => handleEdit(item, 'complaint')}
            onResolve={handleResolve}
            onStart={handleStart}
            onDelete={(id) => handleDelete(id, 'complaint')}
            actionLoading={actionLoading}
          />
        )}
        {activeTab === 'rent' && (
          <RentCollection
            data={rentRecords}
            onView={(item) => handleView(item, 'rent')}
            onEdit={(item) => handleEdit(item, 'rent')}
            onPay={handlePay}
            onDelete={(id) => handleDelete(id, 'rent')}
            actionLoading={actionLoading}
          />
        )}
        {activeTab === 'lease' && (
          <LeaseRenewal
            data={leaseRecords}
            onView={(item) => handleView(item, 'lease')}
            onEdit={(item) => handleEdit(item, 'lease')}
            onRenew={handleRenew}
            onDelete={(id) => handleDelete(id, 'lease')}
            actionLoading={actionLoading}
          />
        )}
        {activeTab === 'service' && (
          <ServiceRequests
            data={serviceRequests}
            onView={(item) => handleView(item, 'service')}
            onEdit={(item) => handleEdit(item, 'service')}
            onComplete={handleComplete}
            onDelete={(id) => handleDelete(id, 'service')}
            actionLoading={actionLoading}
          />
        )}
      </div>

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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PropertyManagersMaintenance;