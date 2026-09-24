// src/components/dashboard/admin/Agents/AgentsRegistration.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX, FiUserMinus,
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiEye, FiEdit, FiTrash2, FiLock, FiUnlock, FiCheckCircle,
  FiXCircle, FiClock, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiStar, FiShield, FiActivity, FiRefreshCw,
  FiArrowRight, FiMoreVertical, FiDownload, FiUpload,
  FiInfo, FiAlertTriangle, FiPlus, FiExternalLink, FiGrid, FiList, FiX,
  FiPrinter, FiCopy, FiShare, FiSettings, FiAward, FiBriefcase, FiHome, FiDollarSign,
  FiMaximize, FiMinimize, FiTag, FiSquare
} from 'react-icons/fi';
import {
  FaBuilding, FaUserTie, FaUserCog, FaUsers,
  FaCheck, FaTimes, FaStar as FaStarSolid,
  FaUserCircle, FaStore, FaHome as FaHomeSolid, FaBriefcase as FaBriefcaseSolid,
  FaCertificate, FaShieldAlt, FaRocket, FaCrown, FaMedal,
  FaUserGraduate, FaUserMd, FaUserSecret, FaIdCard, FaFileAlt,
  FaRegBuilding
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlinePerson } from 'react-icons/md';
import { HiOutlineBuildingOffice, HiOutlineUserGroup } from 'react-icons/hi2';

/* ============================================================
   STANDALONE COMPONENTS
============================================================ */

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

const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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

const ApprovalConfirmModal = ({ show, action, actionLoading, agentName, onCancel, onConfirm }) => {
  if (!show) return null;

  const isApprove = action === 'approve';
  const color = isApprove ? 'emerald' : 'red';
  const Icon = isApprove ? FiCheckCircle : FiXCircle;
  const title = isApprove ? 'Approve Agent Registration' : 'Reject Agent Registration';
  const message = isApprove 
    ? `Are you sure you want to approve ${agentName}'s registration? They will gain full access to the platform as an agent.`
    : `Are you sure you want to reject ${agentName}'s registration? This action cannot be undone.`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full bg-${color}-50 flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`text-3xl text-${color}-600`} />
          </div>
          <h3 className="text-xl font-bold text-[#1A2E2A]">{title}</h3>
          <p className="text-sm text-[#5A7D78] mt-2">{message}</p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={actionLoading === action}
              className={`flex-1 px-4 py-2.5 bg-${color}-600 text-white rounded-xl hover:bg-${color}-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-${color}-600/30 disabled:opacity-50`}
            >
              {actionLoading === action ? <FiRefreshCw className="animate-spin mx-auto" /> : isApprove ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ AGENT PROPERTIES MODAL ============
const AgentPropertiesModal = ({ agent, show, onClose, onViewProperty, onViewOwnerProfile }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && agent) {
      setLoading(true);
      setTimeout(() => {
        const mockProperties = generateAgentProperties(agent);
        setProperties(mockProperties);
        setLoading(false);
      }, 500);
    }
  }, [show, agent]);

  if (!show || !agent) return null;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    suspended: 'bg-gray-100 text-gray-700'
  };

  const typeIcons = {
    'Individual': <FiUser className="text-[#00695C]" />,
    'Apartment': <MdApartment className="text-[#00695C]" />,
    'Commercial': <MdOutlineBusiness className="text-[#00695C]" />,
    'Land & Plots': <FiSquare className="text-[#00695C]" />,
    'Hostel': <FaBuilding className="text-[#00695C]" />
  };

  const handleViewProperty = (property) => {
    if (onViewProperty) {
      onViewProperty(property);
    }
  };

  const handleViewOwnerProfile = (property) => {
    if (onViewOwnerProfile) {
      onViewOwnerProfile(agent, property);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 rounded-t-3xl z-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FiHome className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{agent.name}'s Listed Properties</h2>
              <p className="text-white/70 text-xs">{properties.length} properties listed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiHome className="text-3xl text-[#B5C9C5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A2E2A]">No Properties Found</h3>
              <p className="text-sm text-[#5A7D78] mt-1">This agent hasn't listed any properties yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#1A2E2A] text-sm truncate">{property.title}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F9F8] text-[#5A7D78] flex items-center gap-1">
                          {typeIcons[property.type] || <FiTag className="text-[#00695C]" />}
                          {property.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[property.status] || 'bg-gray-100 text-gray-700'}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                        {property.isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            <FaStarSolid className="inline mr-0.5 text-[8px]" /> Featured
                          </span>
                        )}
                        {property.isVerified && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            <FiShield className="inline mr-0.5 text-[8px]" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm">
                        ₹{Math.floor(property.price / 100000)}L
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] shrink-0" />
                      <span className="font-semibold text-[#1A2E2A]">₹{property.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiUser className="text-[#00695C] shrink-0" />
                      <span className="truncate">{property.agentName || agent.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{property.bedrooms}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Beds</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{property.bathrooms}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Baths</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{property.area}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">{property.areaUnit}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E8F0EE] flex items-center justify-between text-xs text-[#5A7D78]">
                    <span>Listed: {new Date(property.listedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <div className="flex items-center gap-3">
                      <span><FiEye className="inline mr-0.5 text-[#00695C]" /> {property.views}</span>
                      <span><FiMail className="inline mr-0.5 text-[#00695C]" /> {property.inquiries}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="w-full py-2 rounded-xl text-xs font-medium bg-[#00695C] text-white hover:bg-[#004D40] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md"
                    >
                      <FiEye className="text-xs" />
                      View Property Details
                    </button>
                  </div>

                  {/* NEW: View Owner Profile button, below View Property Details */}
                  <div className="mt-2">
                    <button
                      onClick={() => handleViewOwnerProfile(property)}
                      className="w-full py-2 rounded-xl text-xs font-medium bg-[#E7F6EF] text-[#167A54] border border-[#BEE4D2] hover:bg-[#D5EFE0] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                      <FiExternalLink className="text-xs" />
                      View Owner Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-3 border-t border-[#E8F0EE] bg-white rounded-b-3xl flex items-center justify-between shrink-0">
          <span className="text-xs text-[#5A7D78]">
            Total: <span className="font-semibold text-[#1A2E2A]">{properties.length}</span> properties
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-md hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock properties for an agent
const generateAgentProperties = (agent) => {
  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statuses = ['pending', 'approved', 'rejected', 'suspended'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur'];
  const titles = [
    'Luxury Apartment', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite',
    'Cozy Studio', 'Commercial Office Space', 'Garden House', 'Lake View Apartment',
    'City Center Condo', 'Suburban Family Home', 'Beachfront Villa', 'Sky Lounge Penthouse',
    'Premium Individual House', 'Luxury Individual Villa', 'Corporate Commercial Space',
    'Retail Commercial Space', 'Residential Land Plot', 'Commercial Land Plot',
    'Premium Hostel', 'Student Hostel', 'Working Professional Hostel'
  ];

  const count = agent.propertiesCount || Math.floor(Math.random() * 8) + 1;
  
  const properties = [];
  const agentNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Reddy',
    'Deepak Verma', 'Meera Joshi', 'Arjun Nair', 'Kavya Rao', 'Suresh Gupta'
  ];

  for (let i = 1; i <= count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 120));

    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];

    let amenities = [];
    if (type === 'Individual') {
      amenities = ['WiFi', 'Parking', 'Garden', 'Security', 'Balcony'];
    } else if (type === 'Apartment') {
      amenities = ['WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym', 'Elevator'];
    } else if (type === 'Commercial') {
      amenities = ['WiFi', 'Parking', 'Security', 'AC', 'Elevator'];
    } else if (type === 'Land & Plots') {
      amenities = ['Water Connection', 'Electricity', 'Road Access', 'Fencing'];
    } else if (type === 'Hostel') {
      amenities = ['WiFi', 'AC', 'Security', 'Mess', 'Laundry'];
    }

    properties.push({
      id: `prop_${agent.id}_${i}`,
      title: titles[Math.floor(Math.random() * titles.length)] + ` ${i}`,
      type: type,
      location: `${city}, ${['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan'][Math.floor(Math.random() * 7)]}`,
      price: Math.floor(Math.random() * 50000000 + 5000000),
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area: Math.floor(Math.random() * 2000 + 500),
      areaUnit: 'sq ft',
      status: status,
      isFeatured: Math.random() > 0.8,
      isVerified: Math.random() > 0.7,
      listedDate: date.toISOString(),
      views: Math.floor(Math.random() * 500),
      inquiries: Math.floor(Math.random() * 50),
      description: `Beautiful ${type.toLowerCase()} located in ${city}. Features ${Math.floor(Math.random() * 3) + 2} bedrooms and modern amenities.`,
      amenities: amenities,
      parking: Math.random() > 0.5 ? `${Math.floor(Math.random() * 2) + 1} spots` : 'None',
      agentName: agent.name || agentName,
      agentEmail: agent.email || `${agentName.toLowerCase().replace(' ', '.')}@email.com`,
      agentPhone: agent.phone || `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    });
  }

  return properties;
};

/* ============================================================
   VIEW AGENT MODAL — redesigned, theme-token based
   Signature element: a completion ring around the avatar that
   visualizes how many of the 4 verification documents are verified.
============================================================ */

const ViewAgentModal = ({ agent, show, actionLoading, onClose, onApprove, onReject, onEdit, onToggleBlock, onViewProperties, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setActiveTab('overview');
  }, [agent?.id]);

  if (!agent || !show) return null;

  const verificationItems = [
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'aadhaar', label: 'Aadhaar' },
    { key: 'pan', label: 'PAN' },
  ];
  const verifiedCount = verificationItems.filter(item => agent.verification[item.key]).length;
  const verifiedPercent = Math.round((verifiedCount / verificationItems.length) * 100);
  const ringCircumference = 2 * Math.PI * 34;
  const ringOffset = ringCircumference - (verifiedPercent / 100) * ringCircumference;

  const isBlockedLike = agent.status === 'blocked' || agent.status === 'rejected';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contact', label: 'Contact' },
    { id: 'verification', label: 'Verification' },
  ];

  // Specialization icon mapping
  const getSpecializationIcon = (spec) => {
    switch(spec) {
      case 'Individual': return <FiUser className="text-[#00695C]" />;
      case 'Apartment': return <MdApartment className="text-[#00695C]" />;
      case 'Commercial': return <MdOutlineBusiness className="text-[#00695C]" />;
      case 'Land & Plots': return <FiSquare className="text-[#00695C]" />;
      case 'Hostel': return <FaBuilding className="text-[#00695C]" />;
      default: return <FiBriefcase className="text-[#00695C]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="agent-view-modal w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[28px] shadow-2xl animate-slide-up flex flex-col"
        style={{ background: 'var(--avm-bg)', color: 'var(--avm-text)', border: '1px solid var(--avm-border)' }}
      >
        {/* Hero */}
        <div
          className="relative px-6 pt-6 pb-14 shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--avm-accent), var(--avm-accent-2))' }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">Agent Registration</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white"
            >
              <FiX className="text-base" />
            </button>
          </div>

          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{agent.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{agent.agency} · {agent.city}, {agent.state}</p>
          </div>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              agent.status === 'approved' ? 'bg-white text-emerald-700' :
              agent.status === 'rejected' ? 'bg-white text-red-700' :
              agent.status === 'blocked' ? 'bg-white/20 text-white' :
              'bg-white text-amber-700'
            }`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white">
              {agent.subscriptionPlan} plan
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
              <FiAward className="text-[10px]" /> {agent.experience} years exp.
            </span>
          </div>
        </div>

        {/* Avatar with verification completion ring, overlapping the hero */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
              <circle cx="38" cy="38" r="34" fill="none" stroke="var(--avm-ring-track)" strokeWidth="5" />
              <circle
                cx="38" cy="38" r="34" fill="none"
                stroke="var(--avm-ring-active)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-lg"
              style={{ inset: '10px', background: 'var(--avm-surface)', color: 'var(--avm-accent)', border: '3px solid var(--avm-bg)' }}
            >
              {agent.avatar}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] font-medium mt-1 shrink-0" style={{ color: 'var(--avm-muted)' }}>
          {verifiedCount}/{verificationItems.length} verified · {verifiedPercent}%
        </p>

        {/* View Properties Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewProperties && onViewProperties(agent)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              background: 'var(--avm-accent)', 
              color: 'var(--avm-on-accent)',
              boxShadow: '0 4px 12px rgba(15, 107, 92, 0.3)'
            }}
          >
            <FiHome className="text-sm" />
            View All Properties ({agent.propertiesCount})
          </button>
        </div>

        {/* View Agent Profile Button */}
        <div className="px-6 mt-2 shrink-0">
          <button
            onClick={() => onViewProfile && onViewProfile(agent.id)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'var(--avm-success-bg)',
              color: 'var(--avm-success)',
              border: '1px solid var(--avm-success-border)'
            }}
          >
            <FiExternalLink className="text-sm" />
            View Agent Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 px-6 mt-4 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'var(--avm-accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--avm-on-accent)' : 'var(--avm-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {agent.status === 'pending' && (
            <div
              className="rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-5"
              style={{ background: 'var(--avm-warning-bg)', border: '1px solid var(--avm-warning-border)' }}
            >
              <span className="text-xs font-medium flex items-center gap-2" style={{ color: 'var(--avm-warning-text)' }}>
                <FiClock /> Awaiting approval
              </span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Properties', value: agent.propertiesCount },
                  { label: 'Clients', value: agent.clientsCount },
                  { label: 'Rating', value: agent.rating },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-3 text-center"
                    style={{ background: 'var(--avm-surface)', border: '1px solid var(--avm-border)' }}
                  >
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--avm-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--avm-border)' }}>
                <span style={{ color: 'var(--avm-muted)' }}>Registered</span>
                <span className="font-medium">
                  {new Date(agent.registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--avm-border)' }}>
                <span style={{ color: 'var(--avm-muted)' }}>Experience</span>
                <span className="font-medium">{agent.experience} years</span>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-b" style={{ borderColor: 'var(--avm-border)' }}>
                <span style={{ color: 'var(--avm-muted)' }}>Specialization</span>
                <span className="font-medium flex items-center gap-1">
                  {getSpecializationIcon(agent.specialization)}
                  {agent.specialization}
                </span>
              </div>

              {agent.bio && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--avm-muted)' }}>Bio</p>
                  <p
                    className="text-sm leading-relaxed pl-3"
                    style={{ borderLeft: '2px solid var(--avm-accent-2)', color: 'var(--avm-text-soft)' }}
                  >
                    {agent.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              {[
                { icon: <FiMail />, label: 'Email', value: agent.email, verified: agent.verification.email },
                { icon: <FiPhone />, label: 'Phone', value: agent.phone, verified: agent.verification.phone },
                { icon: <FiMapPin />, label: 'Location', value: `${agent.city}, ${agent.state}` },
                { icon: <FiBriefcase />, label: 'Agency', value: agent.agency },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--avm-border)' }}>
                  <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--avm-muted)' }}>
                    <span style={{ color: 'var(--avm-accent)' }}>{row.icon}</span>{row.label}
                  </span>
                  <span className="text-sm font-medium text-right flex items-center gap-1.5">
                    {row.value}
                    {row.verified !== undefined && (
                      row.verified
                        ? <FiCheckCircle style={{ color: 'var(--avm-success)' }} className="text-xs" />
                        : <FiXCircle style={{ color: 'var(--avm-muted)' }} className="text-xs" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--avm-muted)' }}>Verification Status</p>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: agent.verificationStatus === 'verified' ? 'var(--avm-success-bg)' : agent.verificationStatus === 'rejected' ? 'var(--avm-danger-bg)' : 'var(--avm-warning-bg)',
                    color: agent.verificationStatus === 'verified' ? 'var(--avm-success)' : agent.verificationStatus === 'rejected' ? 'var(--avm-danger)' : 'var(--avm-warning-text)'
                  }}
                >
                  {agent.verificationStatus.charAt(0).toUpperCase() + agent.verificationStatus.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {verificationItems.map(item => (
                  <div
                    key={item.key}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                    style={{
                      background: agent.verification[item.key] ? 'var(--avm-success-bg)' : 'var(--avm-surface)',
                      border: `1px solid ${agent.verification[item.key] ? 'var(--avm-success-border)' : 'var(--avm-border)'}`
                    }}
                  >
                    {agent.verification[item.key]
                      ? <FiCheckCircle style={{ color: 'var(--avm-success)' }} />
                      : <FiXCircle style={{ color: 'var(--avm-muted)' }} />}
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-xl" style={{ background: 'var(--avm-surface)', border: '1px solid var(--avm-border)' }}>
                <p className="text-[10px] font-medium" style={{ color: 'var(--avm-muted)' }}>Aadhaar & PAN verified agents get priority listing benefits.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="px-6 py-4 border-t flex items-center gap-2 shrink-0"
          style={{ borderColor: 'var(--avm-border)', background: 'var(--avm-surface)' }}
        >
          {agent.status === 'pending' ? (
            <>
              <button
                onClick={() => onApprove(agent.id)}
                disabled={actionLoading === agent.id}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: 'var(--avm-success)', color: 'var(--avm-on-accent)' }}
              >
                {actionLoading === agent.id ? <FiRefreshCw className="animate-spin text-xs" /> : <FiCheckCircle className="text-xs" />}
                Approve
              </button>
              <button
                onClick={() => onReject(agent.id)}
                disabled={actionLoading === agent.id}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{ background: 'transparent', color: 'var(--avm-danger)', border: '1px solid var(--avm-danger)' }}
              >
                {actionLoading === agent.id ? <FiRefreshCw className="animate-spin text-xs" /> : <FiXCircle className="text-xs" />}
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                style={{ background: 'var(--avm-accent)', color: 'var(--avm-on-accent)' }}
              >
                <FiEdit className="text-xs" /> Edit
              </button>
              <button
                onClick={onToggleBlock}
                disabled={actionLoading === `block_${agent.id}`}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                style={{
                  background: isBlockedLike ? 'var(--avm-success-bg)' : 'var(--avm-danger-bg)',
                  color: isBlockedLike ? 'var(--avm-success)' : 'var(--avm-danger)'
                }}
              >
                {actionLoading === `block_${agent.id}` ? (
                  <FiRefreshCw className="animate-spin text-xs" />
                ) : isBlockedLike ? (
                  <FiUnlock className="text-xs" />
                ) : (
                  <FiLock className="text-xs" />
                )}
                {isBlockedLike ? 'Unblock' : 'Block'}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .agent-view-modal {
          --avm-bg: #FFFFFF;
          --avm-surface: #F5F9F8;
          --avm-border: #E5EEEB;
          --avm-text: #12211D;
          --avm-text-soft: #3E5C56;
          --avm-muted: #6B8983;
          --avm-accent: #0F6B5C;
          --avm-accent-2: #2FAE9A;
          --avm-on-accent: #FFFFFF;
          --avm-ring-track: #E5EEEB;
          --avm-ring-active: #0F6B5C;
          --avm-success: #167A54;
          --avm-success-bg: #E7F6EF;
          --avm-success-border: #BEE4D2;
          --avm-danger: #C0392B;
          --avm-danger-bg: #FCEBE9;
          --avm-warning-text: #92620C;
          --avm-warning-bg: #FDF3DE;
          --avm-warning-border: #F2DBA3;
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   EDIT AGENT MODAL — now includes editable Verification Status
   and per-document (Email / Phone / Aadhaar / PAN) toggles.
   FIXED: Bottom buttons are now sticky/fixed at bottom
============================================================ */

const EditAgentModal = ({ agent, show, onClose, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        city: agent.city,
        state: agent.state,
        agency: agent.agency,
        status: agent.status,
        subscriptionPlan: agent.subscriptionPlan,
        experience: agent.experience,
        specialization: agent.specialization,
        bio: agent.bio || '',
        verificationStatus: agent.verificationStatus || 'pending',
        verification: {
          email: !!agent.verification?.email,
          phone: !!agent.verification?.phone,
          aadhaar: !!agent.verification?.aadhaar,
          pan: !!agent.verification?.pan,
        },
      });
    }
  }, [agent]);

  if (!agent || !show || !formData) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerificationToggle = (key) => {
    setFormData(prev => {
      const updatedVerification = { ...prev.verification, [key]: !prev.verification[key] };
      const allVerified = Object.values(updatedVerification).every(Boolean);

      let nextStatus = prev.verificationStatus;
      if (allVerified) {
        nextStatus = 'verified';
      } else if (prev.verificationStatus === 'verified') {
        nextStatus = 'pending';
      }

      return { ...prev, verification: updatedVerification, verificationStatus: nextStatus };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const verificationDocs = [
    { key: 'email', label: 'Email', icon: <FiMail className="text-sm" /> },
    { key: 'phone', label: 'Phone', icon: <FiPhone className="text-sm" /> },
    { key: 'aadhaar', label: 'Aadhaar', icon: <FaIdCard className="text-sm" /> },
    { key: 'pan', label: 'PAN', icon: <FaFileAlt className="text-sm" /> },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#1A2E2A]/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Agent</h2>
          <p className="text-white/80 text-sm">Update agent information</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="edit-agent-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Agency</label>
                <input
                  type="text"
                  name="agency"
                  value={formData.agency}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Subscription Plan</label>
                <select
                  name="subscriptionPlan"
                  value={formData.subscriptionPlan}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="Free">Free</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="Individual">Individual</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land & Plots">Land & Plots</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>

              {/* Verification Status (overall) */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Verification Status</label>
                <select
                  name="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Verification Documents (individual toggles) */}
              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-2">Verification Documents</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {verificationDocs.map(item => {
                    const isVerified = formData.verification[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleVerificationToggle(item.key)}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-[1.02] ${
                          isVerified
                            ? 'bg-[#E8F8F5] border-[#A8D5CD] text-[#00695C]'
                            : 'bg-[#F5F9F8] border-[#E8F0EE] text-[#5A7D78]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {item.icon}
                          {item.label}
                        </span>
                        {isVerified ? (
                          <FiCheckCircle className="text-sm shrink-0" />
                        ) : (
                          <FiXCircle className="text-sm shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#5A7D78] mt-1.5">Tap a document to mark it verified / not verified.</p>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[#5A7D78] block mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none text-[#1A2E2A]"
                  placeholder="Brief description about the agent"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky at bottom with proper shadow and background */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-agent-form"
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

const AgentsRegistration = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingAgent, setViewingAgent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(null);
  const [approvalAction, setApprovalAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // ============ PROPERTIES MODAL STATE ============
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [selectedAgentForProperties, setSelectedAgentForProperties] = useState(null);

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ STATS ============
  const [stats, setStats] = useState({
    totalAgents: 0,
    pendingApprovals: 0,
    approved: 0,
    rejected: 0,
    blocked: 0,
    verified: 0,
    approvedAndVerified: 0, // NEW: Combined Approved & Verified
  });

  // ============ GENERATE MOCK AGENTS ============
  const generateMockAgents = useCallback(() => {
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran', 'Mohan', 'Ritu', 'Gautam', 'Nisha', 'Tarun'];
    const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
    const statuses = ['pending', 'approved', 'rejected'];
    const verificationStatuses = ['pending', 'verified', 'rejected'];
    const subscriptionPlans = ['Free', 'Silver', 'Gold', 'Platinum'];
    const specializations = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const agencies = ['ABC Realty', 'Dream Homes', 'Green Valley', 'Luxury Living', 'Urban Estate', 'Prime Properties', 'Elite Homes', 'Royal Estate', 'Golden Key', 'Smart Living'];

    const agents = [];
    const usedNames = new Set();

    for (let i = 1; i <= 80; i++) {
      let firstName, lastName, fullName;
      let attempts = 0;
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fullName = `${firstName} ${lastName}`;
        attempts++;
      } while (usedNames.has(fullName) && attempts < 50);
      usedNames.add(fullName);

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const verificationStatus = verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      const propertiesCount = Math.floor(Math.random() * 30);
      const clientsCount = Math.floor(Math.random() * 40);
      const rating = (Math.random() * 4 + 1).toFixed(1);
      const experience = Math.floor(Math.random() * 15) + 1;

      // Generate verification details
      const verification = {
        email: Math.random() > 0.15,
        phone: Math.random() > 0.2,
        aadhaar: Math.random() > 0.3,
        pan: Math.random() > 0.35,
      };

      agents.push({
        id: `agent_${i}`,
        name: fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        city: city,
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'][Math.floor(Math.random() * 8)],
        agency: agencies[Math.floor(Math.random() * agencies.length)],
        status: status,
        verificationStatus: verificationStatus,
        verification: verification,
        registrationDate: date.toISOString(),
        propertiesCount: propertiesCount,
        clientsCount: clientsCount,
        rating: rating,
        experience: experience,
        specialization: specializations[Math.floor(Math.random() * specializations.length)],
        avatar: firstName[0] + lastName[0],
        subscriptionPlan: subscriptionPlans[Math.floor(Math.random() * subscriptionPlans.length)],
        bio: `Experienced real estate agent with ${experience} years in the industry. Specializing in ${specializations[Math.floor(Math.random() * specializations.length)]} properties.`,
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
        totalEarnings: Math.floor(Math.random() * 5000000),
        featured: Math.random() > 0.85,
        verifiedBadge: Math.random() > 0.7,
        reraRegistered: Math.random() > 0.6,
      });
    }

    // Update stats
    const total = agents.length;
    const pending = agents.filter(a => a.status === 'pending').length;
    const approved = agents.filter(a => a.status === 'approved').length;
    const rejected = agents.filter(a => a.status === 'rejected').length;
    const blocked = agents.filter(a => a.status === 'blocked').length;
    const verified = agents.filter(a => a.verificationStatus === 'verified').length;
    const approvedAndVerified = agents.filter(a => a.status === 'approved' && a.verificationStatus === 'verified').length;

    setStats({
      totalAgents: total,
      pendingApprovals: pending,
      approved: approved,
      rejected: rejected,
      blocked: blocked,
      verified: verified,
      approvedAndVerified: approvedAndVerified,
    });

    return agents;
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockAgents = generateMockAgents();
    setAgents(mockAgents);
    setFilteredAgents(mockAgents);
    setStatsAnimating(true);
    setTimeout(() => setStatsAnimating(false), 1000);
  }, [generateMockAgents]);

  // ============ FILTER AGENTS ============
  const filterAgents = useCallback(() => {
    let filtered = [...agents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.phone.includes(query) ||
        agent.city.toLowerCase().includes(query) ||
        agent.agency.toLowerCase().includes(query) ||
        agent.specialization.toLowerCase().includes(query)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === selectedStatus);
    }

    if (selectedVerification !== 'all') {
      filtered = filtered.filter(agent => agent.verificationStatus === selectedVerification);
    }

    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedVerification !== 'all') count++;
    if (searchQuery) count++;
    setFilterCount(count);

    filtered.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAgents(filtered);
    setCurrentPage(1);
  }, [agents, searchQuery, selectedStatus, selectedVerification, sortField, sortDirection]);

  useEffect(() => {
    filterAgents();
  }, [filterAgents]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const paginatedAgents = useMemo(() =>
    filteredAgents.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredAgents, currentPage, pageSize]);

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
    if (selectedAgents.length === paginatedAgents.length) {
      setSelectedAgents([]);
    } else {
      setSelectedAgents(paginatedAgents.map(agent => agent.id));
    }
  }, [selectedAgents, paginatedAgents]);

  // ============ HANDLE SELECT AGENT ============
  const handleSelectAgent = useCallback((agentId) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  }, []);

  // ============ HANDLE APPROVAL ============
  const handleApproval = useCallback((agentId, action) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    setShowApprovalConfirm(agentId);
    setApprovalAction(action);
  }, [agents]);

  // ============ CONFIRM APPROVAL ============
  const confirmApproval = useCallback(() => {
    const agentId = showApprovalConfirm;
    const action = approvalAction;
    setActionLoading(action);
    setShowApprovalConfirm(null);

    setTimeout(() => {
      let updatedAgents = [...agents];
      let agent = updatedAgents.find(a => a.id === agentId);
      
      if (action === 'approve') {
        agent = { ...agent, status: 'approved' };
        // Check if the agent is also verified for the combined stat
        const isAlsoVerified = agent.verificationStatus === 'verified';
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
          approved: prev.approved + 1,
          approvedAndVerified: isAlsoVerified ? prev.approvedAndVerified + 1 : prev.approvedAndVerified,
        }));
        showToast(`${agent.name} has been approved successfully`, 'success');
      } else if (action === 'reject') {
        agent = { ...agent, status: 'rejected' };
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
          rejected: prev.rejected + 1,
        }));
        showToast(`${agent.name} has been rejected`, 'warning');
      }

      updatedAgents = updatedAgents.map(a => a.id === agentId ? agent : a);
      setAgents(updatedAgents);
      setActionLoading(null);
      setApprovalAction(null);

      setViewingAgent(prev => (prev && prev.id === agentId ? agent : prev));
    }, 800);
  }, [showApprovalConfirm, approvalAction, agents, showToast]);

  // ============ HANDLE TOGGLE BLOCK ============
  const handleToggleBlock = useCallback((agentId) => {
    setActionLoading(`block_${agentId}`);

    setTimeout(() => {
      let updatedAgents = [...agents];
      let agent = updatedAgents.find(a => a.id === agentId);
      const wasBlocked = agent.status === 'blocked';

      if (wasBlocked) {
        agent = { ...agent, status: 'approved' };
        const isAlsoVerified = agent.verificationStatus === 'verified';
        setStats(prev => ({
          ...prev,
          blocked: Math.max(0, prev.blocked - 1),
          approved: prev.approved + 1,
          approvedAndVerified: isAlsoVerified ? prev.approvedAndVerified + 1 : prev.approvedAndVerified,
        }));
        showToast(`${agent.name} has been unblocked`, 'success');
      } else {
        agent = { ...agent, status: 'blocked' };
        const wasAlsoVerified = agent.verificationStatus === 'verified' && agent.status === 'approved';
        setStats(prev => ({
          ...prev,
          blocked: prev.blocked + 1,
          approved: Math.max(0, prev.approved - 1),
          approvedAndVerified: wasAlsoVerified ? Math.max(0, prev.approvedAndVerified - 1) : prev.approvedAndVerified,
        }));
        showToast(`${agent.name} has been blocked`, 'warning');
      }

      updatedAgents = updatedAgents.map(a => a.id === agentId ? agent : a);
      setAgents(updatedAgents);
      setActionLoading(null);

      setViewingAgent(prev => (prev && prev.id === agentId ? agent : prev));
    }, 600);
  }, [agents, showToast]);

  // ============ VIEW AGENT DETAIL ============
  const handleViewAgent = useCallback((agent) => {
    setViewingAgent(agent);
    setShowViewModal(true);
  }, []);

  // ============ VIEW AGENT PROPERTIES ============
  const handleViewAgentProperties = useCallback((agent) => {
    setSelectedAgentForProperties(agent);
    setShowPropertiesModal(true);
  }, []);

  // ============ VIEW INDIVIDUAL PROPERTY DETAIL ============
  const handleViewPropertyDetail = useCallback((property) => {
    navigate(`/properties/${property.id}`);
    showToast(`Opening ${property.title}...`, 'info');
  }, [navigate, showToast]);

  // ============ VIEW AGENT PROFILE ============
  const handleViewAgentProfile = useCallback((agentId) => {
    navigate('/profile/agent');
    showToast('Opening Agent Profile...', 'info');
  }, [navigate, showToast]);

  // ============ VIEW PROPERTY OWNER PROFILE (from Properties modal) ============
  const handleViewOwnerProfile = useCallback((ownerAgent, property) => {
    // Reuses the same agent-profile navigation; falls back to the agent
    // shown in the Properties modal since that agent is the property owner.
    handleViewAgentProfile(ownerAgent?.id);
  }, [handleViewAgentProfile]);

  // ============ EDIT AGENT ============
  const handleEditAgent = useCallback((agent) => {
    setEditingAgent(agent);
    setShowEditModal(true);
  }, []);

  // ============ SAVE EDIT ============
  const saveEdit = useCallback((updatedData) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== editingAgent.id) return agent;
      return { ...agent, ...updatedData };
    }));

    // Recompute stats fully to keep counts accurate after verification/status edits
    setAgents(prev => {
      const total = prev.length;
      const pending = prev.filter(a => a.status === 'pending').length;
      const approved = prev.filter(a => a.status === 'approved').length;
      const rejected = prev.filter(a => a.status === 'rejected').length;
      const blocked = prev.filter(a => a.status === 'blocked').length;
      const verified = prev.filter(a => a.verificationStatus === 'verified').length;
      const approvedAndVerified = prev.filter(a => a.status === 'approved' && a.verificationStatus === 'verified').length;

      setStats({
        totalAgents: total,
        pendingApprovals: pending,
        approved: approved,
        rejected: rejected,
        blocked: blocked,
        verified: verified,
        approvedAndVerified: approvedAndVerified,
      });

      return prev;
    });

    setShowEditModal(false);
    setEditingAgent(null);
    showToast('Agent updated successfully', 'success');
  }, [editingAgent, showToast]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setSelectedStatus('all');
      setSelectedVerification('all');
    } else if (filter === 'pending') {
      setSelectedStatus('pending');
      setSelectedVerification('all');
    } else if (filter === 'approved') {
      setSelectedStatus('approved');
      setSelectedVerification('all');
    } else if (filter === 'rejected') {
      setSelectedStatus('rejected');
      setSelectedVerification('all');
    } else if (filter === 'blocked') {
      setSelectedStatus('blocked');
      setSelectedVerification('all');
    } else if (filter === 'verified') {
      setSelectedVerification('verified');
      setSelectedStatus('all');
    } else if (filter === 'approved_verified') {
      setSelectedStatus('approved');
      setSelectedVerification('verified');
    }
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedVerification('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockAgents = generateMockAgents();
      setAgents(mockAgents);
      setFilteredAgents(mockAgents);
      setLoading(false);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockAgents, showToast]);

  // ============ EXPORT AGENTS ============
  const handleExportAgents = useCallback(() => {
    const data = filteredAgents.map(agent => ({
      Name: agent.name,
      Email: agent.email,
      Phone: agent.phone,
      City: agent.city,
      State: agent.state,
      Agency: agent.agency,
      Status: agent.status,
      'Verification Status': agent.verificationStatus,
      'Email Verified': agent.verification.email ? 'Yes' : 'No',
      'Phone Verified': agent.verification.phone ? 'Yes' : 'No',
      'Aadhaar Verified': agent.verification.aadhaar ? 'Yes' : 'No',
      'PAN Verified': agent.verification.pan ? 'Yes' : 'No',
      Properties: agent.propertiesCount,
      Clients: agent.clientsCount,
      Rating: agent.rating,
      Experience: agent.experience,
      Specialization: agent.specialization,
      'Registration Date': new Date(agent.registrationDate).toLocaleDateString(),
      'Subscription Plan': agent.subscriptionPlan,
      'RERA Registered': agent.reraRegistered ? 'Yes' : 'No',
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents_registration_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredAgents.length} agents exported successfully`, 'success');
  }, [filteredAgents, showToast]);

  // ============ VIEW MODAL ACTION HANDLERS ============
  const handleViewModalApprove = useCallback((id) => {
    handleApproval(id, 'approve');
  }, [handleApproval]);

  const handleViewModalReject = useCallback((id) => {
    handleApproval(id, 'reject');
  }, [handleApproval]);

  const handleViewModalEdit = useCallback(() => {
    if (!viewingAgent) return;
    setShowViewModal(false);
    handleEditAgent(viewingAgent);
  }, [viewingAgent, handleEditAgent]);

  const handleViewModalToggleBlock = useCallback(() => {
    if (!viewingAgent) return;
    handleToggleBlock(viewingAgent.id);
  }, [viewingAgent, handleToggleBlock]);

  const handleViewModalViewProperties = useCallback((agent) => {
    setShowViewModal(false);
    handleViewAgentProperties(agent);
  }, [handleViewAgentProperties]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedAgents.length === 0) {
      showToast('Please select agents first', 'warning');
      return;
    }

    setActionLoading(action);

    setTimeout(() => {
      const selectedIds = new Set(selectedAgents);
      let updatedAgents = [...agents];
      let count = 0;
      let verifiedCount = 0;

      updatedAgents = updatedAgents.map(agent => {
        if (selectedIds.has(agent.id)) {
          count++;
          if (action === 'approve') {
            const isVerified = agent.verificationStatus === 'verified';
            if (isVerified) verifiedCount++;
            return { ...agent, status: 'approved' };
          } else if (action === 'reject') {
            return { ...agent, status: 'rejected' };
          }
        }
        return agent;
      });

      setAgents(updatedAgents);
      setSelectedAgents([]);
      setActionLoading(null);

      if (action === 'approve') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - count),
          approved: prev.approved + count,
          approvedAndVerified: prev.approvedAndVerified + verifiedCount,
        }));
        showToast(`${count} agent(s) approved successfully`, 'success');
      } else if (action === 'reject') {
        setStats(prev => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - count),
          rejected: prev.rejected + count,
        }));
        showToast(`${count} agent(s) rejected successfully`, 'warning');
      }
    }, 800);
  }, [selectedAgents, agents, showToast]);

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Toast */}
      <Toast toast={toast} />

      {/* Approval Confirm Modal */}
      <ApprovalConfirmModal
        show={!!showApprovalConfirm}
        action={approvalAction}
        actionLoading={actionLoading}
        agentName={agents.find(a => a.id === showApprovalConfirm)?.name || ''}
        onCancel={() => { setShowApprovalConfirm(null); setApprovalAction(null); }}
        onConfirm={confirmApproval}
      />

      {/* Agent Properties Modal */}
      <AgentPropertiesModal
        agent={selectedAgentForProperties}
        show={showPropertiesModal}
        onClose={() => { setShowPropertiesModal(false); setSelectedAgentForProperties(null); }}
        onViewProperty={handleViewPropertyDetail}
        onViewOwnerProfile={handleViewOwnerProfile}
      />

      {/* Edit Modal */}
      <EditAgentModal
        agent={editingAgent}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingAgent(null); }}
        onSave={saveEdit}
      />

      {/* View Modal */}
      <ViewAgentModal
        agent={viewingAgent}
        show={showViewModal}
        actionLoading={actionLoading}
        onClose={() => { setShowViewModal(false); setViewingAgent(null); }}
        onApprove={handleViewModalApprove}
        onReject={handleViewModalReject}
        onEdit={handleViewModalEdit}
        onToggleBlock={handleViewModalToggleBlock}
        onViewProperties={handleViewModalViewProperties}
        onViewProfile={handleViewAgentProfile}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Agent Registrations
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredAgents.length} Agents
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Review and manage agent registration requests</span>
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
            <button
              onClick={handleExportAgents}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section - Updated with Approved & Verified */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Agents"
                value={stats.totalAgents}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending Approvals"
                value={stats.pendingApprovals}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={100}
                isActive={activeFilter === 'pending'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('pending')}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Approved"
                value={stats.approved}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={200}
                isActive={activeFilter === 'approved'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('approved')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Rejected"
                value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={300}
                isActive={activeFilter === 'rejected'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('rejected')}
              />
              <StatCard
                icon={<FiLock className="text-white text-sm" />}
                title="Blocked"
                value={stats.blocked}
                color="bg-gradient-to-br from-gray-600 to-gray-400"
                delay={350}
                isActive={activeFilter === 'blocked'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('blocked')}
              />
              <StatCard
                icon={<FiShield className="text-white text-sm" />}
                title="Verified"
                value={stats.verified}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={400}
                isActive={activeFilter === 'verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('verified')}
              />
              {/* NEW: Approved & Verified Stat Card */}
              <StatCard
                icon={<FaCheck className="text-white text-sm" />}
                title="Approved & Verified"
                value={stats.approvedAndVerified}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={450}
                isActive={activeFilter === 'approved_verified'}
                statsAnimating={statsAnimating}
                onClick={() => handleStatClick('approved_verified')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search agents by name, email, phone, city, agency, or specialization..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {filterCount > 0 && (
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

        {/* Bulk Actions */}
        {selectedAgents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedAgents.length}</span> agent(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={actionLoading === 'approve'}
                className="px-4 py-1.5 bg-[#E8F8F5] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'approve' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                disabled={actionLoading === 'reject'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'reject' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                Reject All
              </button>
              <button
                onClick={() => setSelectedAgents([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agents Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedAgents.map((agent, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700 border-amber-200',
                approved: 'bg-[#E8F8F5] text-[#00695C] border-[#A8D5CD]',
                rejected: 'bg-red-50 text-red-700 border-red-200',
                blocked: 'bg-gray-100 text-gray-600 border-gray-200'
              };

              const isSelected = selectedAgents.includes(agent.id);
              const isPending = agent.status === 'pending';
              const isApproved = agent.status === 'approved';
              const showVerifiedBadge = agent.verificationStatus === 'verified' && agent.status === 'approved';

              return (
                <div
                  key={agent.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''} ${
                    isPending ? 'border-l-4 border-l-amber-500' : 
                    isApproved ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectAgent(agent.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {agent.avatar}
                        </div>
                        {showVerifiedBadge && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <FaCheck className="text-white text-[7px]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{agent.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap inline-flex items-center gap-1 ${statusColors[agent.status]}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                          {agent.verificationStatus === 'verified' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap bg-[#E8F8F5] text-[#00695C]">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {agent.featured && (
                        <div className="w-5 h-5 bg-[#FEF3E2] rounded-full flex items-center justify-center">
                          <FaStarSolid className="text-amber-500 text-[9px]" />
                        </div>
                      )}
                      <button
                        type="button"
                        className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                        onClick={() => handleViewAgent(agent)}
                        title="View Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{agent.city}, {agent.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiBriefcase className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{agent.agency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{agent.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Registered {new Date(agent.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Verification Quick Status */}
                  <div className="grid grid-cols-4 gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {[
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'aadhaar', label: 'Aadhaar' },
                      { key: 'pan', label: 'PAN' }
                    ].map(item => (
                      <div key={item.key} className="text-center">
                        <div className={`text-xs ${agent.verification[item.key] ? 'text-[#00695C]' : 'text-[#B5C9C5]'}`}>
                          {agent.verification[item.key] ? <FiCheckCircle /> : <FiXCircle />}
                        </div>
                        <p className="text-[7px] text-[#5A7D78] uppercase">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{agent.propertiesCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">{agent.clientsCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A] flex items-center justify-center gap-0.5">
                        <FaStarSolid className="text-amber-400 text-[10px]" />
                        {agent.rating}
                      </p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Rating</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproval(agent.id, 'approve')}
                          disabled={actionLoading === 'approve'}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F8F5] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === 'approve' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproval(agent.id, 'reject')}
                          disabled={actionLoading === 'reject'}
                          className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                        >
                          {actionLoading === 'reject' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiXCircle className="text-[10px]" />}
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewAgent(agent)}
                          className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEye className="text-[10px]" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditAgent(agent)}
                          className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiEdit className="text-[10px]" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewAgentProperties(agent)}
                          className="flex-1 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                        >
                          <FiHome className="text-[10px]" /> Properties
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(agent.id)}
                          disabled={actionLoading === `block_${agent.id}`}
                          className={`flex-1 py-1.5 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${
                            agent.status === 'blocked'
                              ? 'text-[#00695C] bg-[#E8F8F5] hover:bg-[#C5EDE5]'
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                          }`}
                        >
                          {actionLoading === `block_${agent.id}` ? (
                            <FiRefreshCw className="text-[10px] animate-spin" />
                          ) : agent.status === 'blocked' ? (
                            <FiUnlock className="text-[10px]" />
                          ) : (
                            <FiLock className="text-[10px]" />
                          )}
                          {agent.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                      </>
                    )}
                  </div>

                  {/* NEW: View Profile button, its own row below View/Edit/Properties/Block */}
                  {!isPending && (
                    <div className="mt-1.5">
                      <button
                        type="button"
                        onClick={() => handleViewAgentProfile(agent.id)}
                        className="w-full py-1.5 text-xs font-medium text-[#167A54] bg-[#E7F6EF] border border-[#BEE4D2] rounded-xl hover:bg-[#D5EFE0] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
                      >
                        <FiExternalLink className="text-[10px]" /> View Agent Profile
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAgents.length === paginatedAgents.length && paginatedAgents.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                />
                <span>Agent</span>
              </div>
              <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Name {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Verification</div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('city')}>
                City {sortField === 'city' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1">Agency</div>
              <div className="col-span-1 text-center">Phone</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertiesCount')}>
                Props {sortField === 'propertiesCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('rating')}>
                Rating {sortField === 'rating' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('registrationDate')}>
                Registered {sortField === 'registrationDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {paginatedAgents.map((agent, index) => {
              const statusColors = {
                pending: 'bg-[#FEF3E2] text-amber-700',
                approved: 'bg-[#E8F8F5] text-[#00695C]',
                rejected: 'bg-red-50 text-red-700',
                blocked: 'bg-gray-100 text-gray-600'
              };

              const isSelected = selectedAgents.includes(agent.id);
              const isPending = agent.status === 'pending';
              const showVerifiedBadge = agent.verificationStatus === 'verified' && agent.status === 'approved';

              return (
                <div
                  key={agent.id}
                  className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''} ${isPending ? 'bg-amber-50/30' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectAgent(agent.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {agent.avatar}
                      </div>
                      {showVerifiedBadge && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#00695C] rounded-full flex items-center justify-center shadow-lg">
                          <FaCheck className="text-white text-[6px]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-semibold text-sm text-[#1A2E2A]">{agent.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{agent.email}</p>
                  </div>

                  <div className="col-span-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[agent.status]}`}>
                      {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                    </span>
                  </div>

                  <div className="col-span-1">
                    {agent.verificationStatus === 'verified' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E8F8F5] text-[#00695C]">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#B5C9C5]">—</span>
                    )}
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">{agent.city}</div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate">{agent.agency}</div>

                  <div className="col-span-1 text-center text-xs text-[#5A7D78]">{agent.phone}</div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A]">{agent.propertiesCount}</p>
                  </div>

                  <div className="col-span-1 text-center">
                    <p className="text-sm font-bold text-[#1A2E2A] flex items-center justify-center gap-0.5">
                      <FaStarSolid className="text-amber-400 text-[10px]" />
                      {agent.rating}
                    </p>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78]">
                    {new Date(agent.registrationDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproval(agent.id, 'approve')}
                          disabled={actionLoading === 'approve'}
                          className="w-7 h-7 rounded-lg hover:bg-[#E8F8F5] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 disabled:opacity-50"
                          title="Approve"
                        >
                          {actionLoading === 'approve' ? <FiRefreshCw className="text-xs animate-spin" /> : <FiCheckCircle className="text-xs" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproval(agent.id, 'reject')}
                          disabled={actionLoading === 'reject'}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-500 hover:scale-110 disabled:opacity-50"
                          title="Reject"
                        >
                          {actionLoading === 'reject' ? <FiRefreshCw className="text-xs animate-spin" /> : <FiXCircle className="text-xs" />}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleViewAgent(agent)}
                          className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110"
                          title="View"
                        >
                          <FiEye className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditAgent(agent)}
                          className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110"
                          title="Edit"
                        >
                          <FiEdit className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewAgentProperties(agent)}
                          className="w-7 h-7 rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-purple-600 hover:scale-110"
                          title="View Properties"
                        >
                          <FiHome className="text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(agent.id)}
                          disabled={actionLoading === `block_${agent.id}`}
                          className={`w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-110 disabled:opacity-50 ${
                            agent.status === 'blocked'
                              ? 'text-[#00695C] hover:bg-[#E8F8F5]'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                          title={agent.status === 'blocked' ? 'Unblock' : 'Block'}
                        >
                          {actionLoading === `block_${agent.id}` ? (
                            <FiRefreshCw className="text-xs animate-spin" />
                          ) : agent.status === 'blocked' ? (
                            <FiUnlock className="text-xs" />
                          ) : (
                            <FiLock className="text-xs" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedAgents.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUserPlus className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No agents found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No agents match your current view'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105"
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
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredAgents.length)} of{' '}
              {filteredAgents.length} agents
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300"
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
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
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
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-once { animation: pulse-once 1s ease-out; }
      `}</style>
    </div>
  );
};

export default AgentsRegistration;