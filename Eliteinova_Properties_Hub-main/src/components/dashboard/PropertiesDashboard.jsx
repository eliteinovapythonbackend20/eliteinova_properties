// src/components/dashboard/PropertiesDashboard.jsx

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
  FiHeart, FiBookmark, FiMap, FiCheckSquare, FiSquare,
  FiClipboard, FiLayers, FiList
} from 'react-icons/fi';

import {
  FaBuilding, FaShoppingBag,
  FaDollarSign, FaFileAlt, FaUserTie, FaUserCheck, FaUserCog,
  FaProjectDiagram, FaTools, FaShieldAlt, FaImage, FaBell,
  FaChartLine, FaWallet, FaBars, FaSun, FaMoon, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube,
  FaWhatsapp, FaCopy as FaCopyIcon, FaShareAlt, FaQrcode,
  FaCloudUploadAlt, FaCloudDownloadAlt, FaEye, FaEyeSlash,
  FaUserCircle, FaUsers, FaUserFriends, FaHandshake, FaHome,
  FaCalendarCheck, FaClipboardList, FaClipboardCheck,
  FaUserPlus, FaUserMinus, FaCrown, FaWarehouse, FaHotel,
  FaSchool, FaIndustry, FaStore, FaHospital, FaFilm,
  FaGasPump, FaSnowflake, FaTractor, FaBed, FaCity,
  FaTree, FaMapMarkedAlt, FaLayerGroup, FaBriefcase,
  FaCoffee, FaChild, FaDoorOpen, FaFemale, FaMale
} from 'react-icons/fa';

import {
  MdOutlineDashboard, MdOutlineRealEstateAgent, MdOutlineApartment,
  MdOutlineBusiness, MdOutlinePeople, MdOutlinePersonSearch,
  MdOutlineFavorite, MdOutlineBookmark, MdOutlineLocationOn,
  MdOutlineDateRange, MdOutlineAssignment, MdOutlinePending,
  MdOutlineVilla, MdOutlineHolidayVillage
} from 'react-icons/md';

import {
  BsBuilding, BsTools, BsPeople, BsPersonPlus,
  BsPersonCheck, BsPersonX, BsClock, BsCalendar3, BsGrid1X2
} from 'react-icons/bs';

import {
  HiOutlineBuildingOffice, HiOutlineUserGroup, HiOutlineBuildingOffice2
} from 'react-icons/hi2';

// ============ IMPORT ALL COMPONENTS ============
// Overview
import PropertiesOverview from './properties/PropertiesOverview';
import AllProperties from './properties/AllProperties';

// Individual
import IndividualOverview from './properties/Individual/IndividualOverview';
import IndependentHouse from './properties/Individual/IndependentHouse';
import IndependentVilla from './properties/Individual/IndependentVilla';
import DuplexResidentialUnit from './properties/Individual/DuplexResidentialUnit';

// Apartment
import ApartmentOverview from './properties/Apartment/ApartmentOverview';
import RentalApartment from './properties/Apartment/RentalApartment';
import ServicedApartment from './properties/Apartment/ServicedApartment';
import LeaseApartment from './properties/Apartment/LeaseApartment';
import ResidentialApartment from './properties/Apartment/ResidentialApartment';
import GatedCommunityApartment from './properties/Apartment/GatedCommunityApartment';
import StudioApartment from './properties/Apartment/StudioApartment';
import DuplexApartment from './properties/Apartment/DuplexApartment';
import LuxuryApartment from './properties/Apartment/LuxuryApartment';
import CondominiumApartment from './properties/Apartment/CondominiumApartment';
import PenthouseApartment from './properties/Apartment/PenthouseApartment';

// Commercial
import CommercialOverview from './properties/Commercial/CommercialOverview';
import OfficeSpace from './properties/Commercial/OfficeSpace';
import RetailShop from './properties/Commercial/RetailShop';
import Showroom from './properties/Commercial/Showroom';
import CommercialLandPlot from './properties/Commercial/CommercialLandPlot';
import Warehouse from './properties/Commercial/Warehouse';
import IndustrialProperty from './properties/Commercial/IndustrialProperty';
import CoWorkingSpace from './properties/Commercial/CoWorkingSpace';
import BusinessCenter from './properties/Commercial/BusinessCenter';
import ShoppingMallSpace from './properties/Commercial/ShoppingMallSpace';
import CommercialComplex from './properties/Commercial/CommercialComplex';
import Restaurant from './properties/Commercial/Restaurant';
import HotelProperty from './properties/Commercial/HotelProperty';
import ClinicSpace from './properties/Commercial/ClinicSpace';
import EducationalInstitution from './properties/Commercial/EducationalInstitution';
import ITPark from './properties/Commercial/ITPark';
import Multiplex from './properties/Commercial/Multiplex';
import PetrolBunk from './properties/Commercial/PetrolBunk';
import ColdStorage from './properties/Commercial/ColdStorage';
import MixedUse from './properties/Commercial/MixedUse';
import AgriculturalProperty from './properties/Commercial/AgriculturalProperty';

// Land & Plots
import LandPlotsOverview from './properties/LandPlots/LandPlotsOverview';
import ResidentialLandPlots from './properties/LandPlots/ResidentialLandPlots';
import CommercialLandPlots from './properties/LandPlots/CommercialLandPlots';
import AgriculturalLandPlots from './properties/LandPlots/AgriculturalLandPlots';
import IndustrialLand from './properties/LandPlots/IndustrialLand';
import MixedUseLand from './properties/LandPlots/MixedUseLand';
import InstitutionalLand from './properties/LandPlots/InstitutionalLand';
import InvestmentSpecialPurposeLand from './properties/LandPlots/InvestmentSpecialPurposeLand';

// Hostel
import HostelOverview from './properties/Hostel/HostelOverview';
import GirlsHostel from './properties/Hostel/GirlsHostel';
import BoysHostel from './properties/Hostel/BoysHostel';
import CoLivingSpace from './properties/Hostel/CoLivingSpace';
import WorkingProfessionalHostel from './properties/Hostel/WorkingProfessionalHostel';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const PropertiesDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState(['individual']);
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
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
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
    { key: '/admin/properties/overview', icon: <FiGrid />, label: 'Dashboard Overview' },
    { key: '/admin/properties/all', icon: <FiList />, label: 'All Properties' },
    {
      key: 'individual',
      icon: <FaHome />,
      label: 'Individual',
      children: [
        { key: '/admin/properties/individual/overview', icon: <FiGrid />, label: 'Individual Overview' },
        { key: '/admin/properties/individual/independent-house', icon: <FaHome />, label: 'Independent House' },
        { key: '/admin/properties/individual/independent-villa', icon: <MdOutlineVilla />, label: 'Independent Villa' },
        { key: '/admin/properties/individual/duplex-residential-unit', icon: <FaLayerGroup />, label: 'Duplex Residential Unit' },
      ],
    },
    {
      key: 'apartment',
      icon: <MdOutlineApartment />,
      label: 'Apartment',
      children: [
        { key: '/admin/properties/apartment/overview', icon: <FiGrid />, label: 'Apartment Overview' },
        { key: '/admin/properties/apartment/rental', icon: <FiHome />, label: 'Rental Apartment' },
        { key: '/admin/properties/apartment/serviced', icon: <FaBed />, label: 'Serviced Apartment' },
        { key: '/admin/properties/apartment/lease', icon: <FaFileAlt />, label: 'Lease Apartment' },
        { key: '/admin/properties/apartment/residential', icon: <FiHome />, label: 'Residential Apartment' },
        { key: '/admin/properties/apartment/gated-community', icon: <BsBuilding />, label: 'Gated Community Apartment' },
        { key: '/admin/properties/apartment/studio', icon: <FiSquare />, label: 'Studio Apartment' },
        { key: '/admin/properties/apartment/duplex', icon: <FaLayerGroup />, label: 'Duplex Apartment' },
        { key: '/admin/properties/apartment/luxury', icon: <FaCrown />, label: 'Luxury Apartment' },
        { key: '/admin/properties/apartment/condominium', icon: <HiOutlineBuildingOffice2 />, label: 'Condominium Apartment' },
        { key: '/admin/properties/apartment/penthouse', icon: <FiStar />, label: 'Penthouse Apartment' },
      ],
    },
    {
      key: 'commercial',
      icon: <MdOutlineBusiness />,
      label: 'Commercial',
      children: [
        { key: '/admin/properties/commercial/overview', icon: <FiGrid />, label: 'Commercial Overview' },
        { key: '/admin/properties/commercial/office-space', icon: <FaBriefcase />, label: 'Office Space' },
        { key: '/admin/properties/commercial/retail-shop', icon: <FaStore />, label: 'Retail Shop' },
        { key: '/admin/properties/commercial/showroom', icon: <FiHome />, label: 'Showroom' },
        { key: '/admin/properties/commercial/land-plot', icon: <FaMapMarkedAlt />, label: 'Commercial Land & Plot' },
        { key: '/admin/properties/commercial/warehouse-godown', icon: <FaWarehouse />, label: 'Warehouse / Godown' },
        { key: '/admin/properties/commercial/industrial-factory', icon: <FaIndustry />, label: 'Industrial Property / Factory' },
        { key: '/admin/properties/commercial/co-working-space', icon: <FaUserFriends />, label: 'Co-working Space' },
        { key: '/admin/properties/commercial/business-center', icon: <HiOutlineBuildingOffice />, label: 'Business Center' },
        { key: '/admin/properties/commercial/shopping-mall-space', icon: <FaShoppingBag />, label: 'Shopping Mall Space' },
        { key: '/admin/properties/commercial/commercial-complex', icon: <FaCity />, label: 'Commercial Complex' },
        { key: '/admin/properties/commercial/restaurant-cafe', icon: <FaCoffee />, label: 'Restaurant / Cafe Space' },
        { key: '/admin/properties/commercial/hotel-lodge-resort', icon: <FaHotel />, label: 'Hotel / Lodge / Resort' },
        { key: '/admin/properties/commercial/clinic-hospital', icon: <FaHospital />, label: 'Clinic / Hospital Space' },
        { key: '/admin/properties/commercial/educational-institution', icon: <FaSchool />, label: 'Educational Institution' },
        { key: '/admin/properties/commercial/it-tech-park', icon: <HiOutlineBuildingOffice2 />, label: 'IT Park / Tech Park' },
        { key: '/admin/properties/commercial/multiplex-entertainment', icon: <FaFilm />, label: 'Multiplex / Entertainment' },
        { key: '/admin/properties/commercial/petrol-fuel-station', icon: <FaGasPump />, label: 'Petrol Bunk / Fuel Station' },
        { key: '/admin/properties/commercial/cold-storage-logistics', icon: <FaSnowflake />, label: 'Cold Storage / Logistics Hub' },
        { key: '/admin/properties/commercial/mixed-use', icon: <FaLayerGroup />, label: 'Mixed-use Commercial' },
        { key: '/admin/properties/commercial/agricultural-commercial', icon: <FaTractor />, label: 'Agricultural Commercial' },
      ],
    },
    {
      key: 'land-plots',
      icon: <FaMapMarkedAlt />,
      label: 'Land & Plots',
      children: [
        { key: '/admin/properties/land-plots/overview', icon: <FiGrid />, label: 'Land & Plots Overview' },
        { key: '/admin/properties/land-plots/residential', icon: <FiHome />, label: 'Residential Land & Plots' },
        { key: '/admin/properties/land-plots/commercial', icon: <MdOutlineBusiness />, label: 'Commercial Land & Plots' },
        { key: '/admin/properties/land-plots/agricultural', icon: <FaTractor />, label: 'Agricultural Land & Plots' },
        { key: '/admin/properties/land-plots/industrial', icon: <FaIndustry />, label: 'Industrial Land' },
        { key: '/admin/properties/land-plots/mixed-use', icon: <FaLayerGroup />, label: 'Mixed-use Land' },
        { key: '/admin/properties/land-plots/institutional', icon: <FaSchool />, label: 'Institutional Land' },
        { key: '/admin/properties/land-plots/investment-special-purpose', icon: <FaTree />, label: 'Investment & Special Purpose Land' },
      ],
    },
    {
      key: 'hostel',
      icon: <FaBed />,
      label: 'Hostel',
      children: [
        { key: '/admin/properties/hostel/overview', icon: <FiGrid />, label: 'Hostel Overview' },
        { key: '/admin/properties/hostel/girls', icon: <FaFemale />, label: 'Girls Hostel' },
        { key: '/admin/properties/hostel/boys', icon: <FaMale />, label: 'Boys Hostel' },
        { key: '/admin/properties/hostel/co-living', icon: <FaUserFriends />, label: 'Co-living Space' },
        { key: '/admin/properties/hostel/working-professional', icon: <FaUserTie />, label: 'Working Professional Hostel' },
      ],
    },
  ];

  const isSubActive = (children) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.key);
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

  // Helper function to check if current path is Super Admin
  const isSuperAdmin = () => {
    return location.pathname.includes('super-admin');
  };

  // Helper function to check if current path is Buyers & Tenants Dashboard
  const isBuyersTenantsDashboard = () => {
    return location.pathname.includes('buyers-tenants');
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
              <div className="text-[8px] text-white/60 tracking-widest uppercase -mt-0.5">Properties</div>
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
                  <FiHome className="mr-1 inline" /> Properties
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

              {/* Properties Dashboard - Active */}
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

              {/* Super Admin Dashboard */}
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

            <Routes location={{ ...location, pathname: location.pathname.replace(/^\/admin\/properties/, '/admin') || '/admin' }}>
              {/* Overview */}
              <Route index element={<PropertiesOverview />} />
              <Route path="overview" element={<PropertiesOverview />} />
              <Route path="all" element={<AllProperties />} />

              {/* Individual */}
              <Route path="individual/overview" element={<IndividualOverview />} />
              <Route path="individual/independent-house" element={<IndependentHouse />} />
              <Route path="individual/independent-villa" element={<IndependentVilla />} />
              <Route path="individual/duplex-residential-unit" element={<DuplexResidentialUnit />} />

              {/* Apartment */}
              <Route path="apartment/overview" element={<ApartmentOverview />} />
              <Route path="apartment/rental" element={<RentalApartment />} />
              <Route path="apartment/serviced" element={<ServicedApartment />} />
              <Route path="apartment/lease" element={<LeaseApartment />} />
              <Route path="apartment/residential" element={<ResidentialApartment />} />
              <Route path="apartment/gated-community" element={<GatedCommunityApartment />} />
              <Route path="apartment/studio" element={<StudioApartment />} />
              <Route path="apartment/duplex" element={<DuplexApartment />} />
              <Route path="apartment/luxury" element={<LuxuryApartment />} />
              <Route path="apartment/condominium" element={<CondominiumApartment />} />
              <Route path="apartment/penthouse" element={<PenthouseApartment />} />

              {/* Commercial */}
              <Route path="commercial/overview" element={<CommercialOverview />} />
              <Route path="commercial/office-space" element={<OfficeSpace />} />
              <Route path="commercial/retail-shop" element={<RetailShop />} />
              <Route path="commercial/showroom" element={<Showroom />} />
              <Route path="commercial/land-plot" element={<CommercialLandPlot />} />
              <Route path="commercial/warehouse-godown" element={<Warehouse />} />
              <Route path="commercial/industrial-factory" element={<IndustrialProperty />} />
              <Route path="commercial/co-working-space" element={<CoWorkingSpace />} />
              <Route path="commercial/business-center" element={<BusinessCenter />} />
              <Route path="commercial/shopping-mall-space" element={<ShoppingMallSpace />} />
              <Route path="commercial/commercial-complex" element={<CommercialComplex />} />
              <Route path="commercial/restaurant-cafe" element={<Restaurant />} />
              <Route path="commercial/hotel-lodge-resort" element={<HotelProperty />} />
              <Route path="commercial/clinic-hospital" element={<ClinicSpace />} />
              <Route path="commercial/educational-institution" element={<EducationalInstitution />} />
              <Route path="commercial/it-tech-park" element={<ITPark />} />
              <Route path="commercial/multiplex-entertainment" element={<Multiplex />} />
              <Route path="commercial/petrol-fuel-station" element={<PetrolBunk />} />
              <Route path="commercial/cold-storage-logistics" element={<ColdStorage />} />
              <Route path="commercial/mixed-use" element={<MixedUse />} />
              <Route path="commercial/agricultural-commercial" element={<AgriculturalProperty />} />

              {/* Land & Plots */}
              <Route path="land-plots/overview" element={<LandPlotsOverview />} />
              <Route path="land-plots/residential" element={<ResidentialLandPlots />} />
              <Route path="land-plots/commercial" element={<CommercialLandPlots />} />
              <Route path="land-plots/agricultural" element={<AgriculturalLandPlots />} />
              <Route path="land-plots/industrial" element={<IndustrialLand />} />
              <Route path="land-plots/mixed-use" element={<MixedUseLand />} />
              <Route path="land-plots/institutional" element={<InstitutionalLand />} />
              <Route path="land-plots/investment-special-purpose" element={<InvestmentSpecialPurposeLand />} />

              {/* Hostel */}
              <Route path="hostel/overview" element={<HostelOverview />} />
              <Route path="hostel/girls" element={<GirlsHostel />} />
              <Route path="hostel/boys" element={<BoysHostel />} />
              <Route path="hostel/co-living" element={<CoLivingSpace />} />
              <Route path="hostel/working-professional" element={<WorkingProfessionalHostel />} />
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

export default PropertiesDashboard;