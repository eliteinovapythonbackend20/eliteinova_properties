import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronDown, ChevronUp, Building, MapPin, 
  IndianRupee, Ruler, Shield, Clock, CheckCircle, 
  Phone, Users, FileText, RefreshCw, DollarSign, 
  Navigation, Layout, Sliders, Calendar, Plus, 
  Compass, Zap, Droplet, Wifi, Lamp, Fence, Truck,
  Factory, Hotel, ShoppingBag, Car, Building2, Trees,
  Users as UsersIcon, Coffee, Printer, Lock, Video,
  Wifi as WifiIcon, Thermometer, Speaker, AlertCircle,
  Briefcase, Laptop, Star, Clock as ClockIcon, Key,
  ParkingCircle, Accessibility, FolderOpen, Award,
  Globe, Headphones, BarChart, Target, Mail, Settings,
  Wrench, HardDrive, Wind, Battery, Droplets, Boxes,
  Package, Scissors, Shirt, Gem, Smartphone, Utensils,
  Gamepad, Tv, Store, UtensilsCrossed, Stethoscope, GraduationCap,
  Radio, Building as BuildingIcon, ShoppingCart, Music, Volume2,
  Waves, Mountain, Sun, Bed, Bath, Dumbbell, Scissors as ScissorsIcon,
  Sparkles, Home, Heart, Syringe, Ambulance, Eye,
  BookOpen, Microscope, Bus, School, GraduationCap as Graduation,
  Server, Database, Wifi as WifiSignal, Cpu, Cloud,
  Film, Clapperboard, Theater, Ticket, Fuel, Car as CarIcon, BatteryCharging,
  Snowflake, Thermometer as ThermometerIcon, Box, Warehouse
} from 'lucide-react';

// TrendUp Icon Component
const TrendUpIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6H23V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Road Icon Component
const Road = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M8 2v20M16 2v20" stroke="currentColor" strokeLinecap="round"/>
    <path d="M4 6h4M4 12h4M4 18h4M16 6h4M16 12h4M16 18h4" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

// Rocket Icon Component
const Rocket = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 15l-3-3M9 18l-3-3M12 15l3 3M15 12l3-3" stroke="currentColor" strokeLinecap="round"/>
    <path d="M5 10l4-4M19 10l-4-4M10 5l4 4" stroke="currentColor" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

// Custom Date Picker Component
const CustomDatePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || '');
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const pickerRef = useRef(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    const formattedDate = newDate.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === todayDate && viewMonth === todayMonth && viewYear === todayYear;
      const isSelected = selectedDate === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      calendarDays.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSelected 
              ? 'bg-teal-600 text-white' 
              : isToday 
                ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                : 'text-gray-700 hover:bg-teal-100 hover:text-teal-700'
          }`}
        >
          {d}
        </button>
      );
    }
    return calendarDays;
  };

  return (
    <div className="relative" ref={pickerRef}>
      <label className="text-sm text-teal-800 font-medium block mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={selectedDate}
          onFocus={() => setIsOpen(true)}
          readOnly
          placeholder="Select Date"
          className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 cursor-pointer"
        />
        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-500 pointer-events-none" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-2xl border-2 border-teal-200 overflow-hidden" style={{ width: '280px' }}>
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-white font-semibold text-sm">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map(day => (
                <div key={day} className="h-8 w-8 flex items-center justify-center text-xs font-semibold text-teal-600">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            <div className="mt-3 pt-2 border-t border-teal-100 flex justify-between">
              <button type="button" onClick={() => {
                const today = new Date();
                const formattedToday = today.toISOString().split('T')[0];
                setSelectedDate(formattedToday);
                onChange(formattedToday);
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                setIsOpen(false);
              }} className="text-xs text-teal-600 hover:text-teal-700 font-medium">Today</button>
              <button type="button" onClick={() => {
                setSelectedDate('');
                onChange('');
                setIsOpen(false);
              }} className="text-xs text-teal-400 hover:text-teal-600 font-medium">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Select Component
const CustomSelect = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <label className="text-sm text-teal-800 font-medium block mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm text-left flex justify-between items-center focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-200"
      >
        <span className={selectedOption ? 'text-teal-800 text-xs font-medium' : 'text-gray-400 text-xs'}>
          {selectedOption ? selectedOption.label : placeholder || `Select ${label}`}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-teal-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border-2 border-teal-200 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-2 py-1.5 text-xs text-left transition-colors duration-150 ${
                value === opt.value ? 'bg-teal-600 text-white' : 'text-teal-700 hover:bg-teal-500 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Area Unit Select Component
const AreaUnitSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  
  const units = [
    { value: 'sqft', label: 'Sq.ft' },
    { value: 'acres', label: 'Acres' },
    { value: 'grounds', label: 'Grounds' },
    { value: 'cents', label: 'Cents' },
    { value: 'hectares', label: 'Hectares' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedUnit = units.find(unit => unit.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm flex items-center justify-between gap-2 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-200"
      >
        <span className="text-teal-800 text-xs font-medium">
          {selectedUnit ? selectedUnit.label : 'Select Unit'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-teal-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 right-0 bg-white rounded-lg shadow-xl border-2 border-teal-200 overflow-hidden">
          {units.map((unit) => (
            <button
              key={unit.value}
              type="button"
              onClick={() => {
                onChange(unit.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-xs text-left whitespace-nowrap transition-colors duration-150 ${
                value === unit.value ? 'bg-teal-600 text-white' : 'text-teal-700 hover:bg-teal-500 hover:text-white'
              }`}
            >
              {unit.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ColdStorageFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState('Buy');
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    location: true,
    price: true,
    property: true,
    coldStorageFeatures: true,
    logisticsFeatures: true,
    amenities: true,
    businessSuitability: true,
    availability: true,
    legal: true,
    nearby: true,
    contact: true
  });
  
  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location Details
    city: '', locality: '', landmark: '', pincode: '',
    highwayFacing: '', industrialZone: '',
    nearbyConnectivity: '',
    // Budget/Price Details
    minPrice: '', maxPrice: '', priceNegotiable: '', loanRequired: '', maintenanceCharges: '',
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
    minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseDuration: '', leaseNegotiable: '',
    minSellPrice: '', maxSellPrice: '', sellPriceNegotiable: '', propertyTax: '',
    // Property Details
    builtUpAreaMin: '', builtUpAreaMax: '',
    landAreaMin: '', landAreaMax: '', landAreaUnit: 'sqft',
    warehouseCapacity: '', coldRoomCapacity: '',
    numberOfLoadingBays: '', dockLevelersAvailable: '', floorHeightCeilingHeight: '',
    parkingTruckMovementSpace: '', propertyAge: '', ownershipType: '',
    // Cold Storage Features
    temperatureRangeControlled: '', multiTemperatureZones: '', refrigerationSystemType: '',
    deepFreezerFacility: false, chillerRooms: false, backupCoolingSystem: false,
    insulatedStorageWalls: false, inventoryManagementSystem: false, cctvMonitoringInside: false,
    // Logistics Features
    loadingUnloadingDocks: false, forkliftFacility: false, containerAccess: false,
    sortingPackingArea: false, officeCabinSpace: false, dispatchArea: false,
    vehicleParking: false, twentyFourSevenOperations: false,
    // Amenities
    twentyFourSevenSecurity: false, cctvSurveillance: false, powerBackup: false,
    generatorBackup: false, fireSafetySystem: false, waterSupply: false,
    internetBroadband: false, labourRestArea: false, canteenFacility: false,
    // Business Suitability
    businessTypes: [],
    // Availability
    readyToOccupy: '', underConstruction: '', immediatePossession: '',
    readyToOperate: '', immediateOccupancy: '', availableFrom: '', minRentalDuration: '',
    leaseRenewalOption: '',
    // Legal Details
    industrialLicense: '', foodSafetyCompliance: '', fireSafetyApproved: '',
    pollutionControlApproval: '', titleDeedVerified: '', commercialLicense: '',
    loanEligible: '', leaseAgreementReady: '',
    // Nearby Access
    nearbyAccess: [],
    // Contact Preference
    contactOwner: false, contactAgent: false, contactBuilder: false,
    preferredContactTime: ''
  });

  // Options Arrays
  const ownershipOptions = [
    { value: 'Freehold', label: 'Freehold' },
    { value: 'Leasehold', label: 'Leasehold' }
  ];

  const propertyAgeOptions = [
    { value: '0-1', label: '0-1 Year' },
    { value: '1-3', label: '1-3 Years' },
    { value: '3-5', label: '3-5 Years' },
    { value: '5-10', label: '5-10 Years' },
    { value: '10+', label: '10+ Years' }
  ];

  const leaseDurationOptions = [
    { value: '1', label: '1 Year' },
    { value: '3', label: '3 Years' },
    { value: '5', label: '5 Years' },
    { value: '5+', label: '5+ Years' }
  ];

  const rentalDurationOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '11', label: '11 Months' },
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' },
    { value: '36', label: '36 Months' }
  ];

  const contactTimeOptions = [
    { value: 'Morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'Afternoon', label: 'Afternoon (12 PM - 4 PM)' },
    { value: 'Evening', label: 'Evening (4 PM - 7 PM)' },
    { value: 'Any', label: 'Any Time' }
  ];

  const businessTypeOptions = [
    { icon: <Snowflake className="w-3 h-3" />, label: 'Cold Storage' },
    { icon: <Package className="w-3 h-3" />, label: 'Food Storage (Dairy, Meat, Vegetables)' },
    { icon: <Syringe className="w-3 h-3" />, label: 'Pharmaceutical Storage' },
    { icon: <Truck className="w-3 h-3" />, label: 'Logistics Hub' },
    { icon: <Box className="w-3 h-3" />, label: 'E-commerce Fulfillment Center' },
    { icon: <Warehouse className="w-3 h-3" />, label: 'Distribution Center' },
    { icon: <Warehouse className="w-3 h-3" />, label: 'Warehousing' }
  ];

  const nearbyOptions = [
    'Highway Access', 'Industrial Area', 'Port / Airport Access',
    'Transport Hub', 'Major Market Area'
  ];

  const tabs = [
    
    { id: 'Buy', label: 'Buy', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'Rent', label: 'Rent', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    // { id: 'Sell', label: 'Sell', icon: <TrendUpIcon className="w-3.5 h-3.5" /> }, // Commented out
    { id: 'Lease', label: 'Lease', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFilters(prev => ({ ...prev, [field]: checked }));
  };

  const handleRadioChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const applyFilters = () => {
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Cold Storage / Logistics Hub' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      city: '', locality: '', landmark: '', pincode: '',
      highwayFacing: '', industrialZone: '',
      nearbyConnectivity: '',
      minPrice: '', maxPrice: '', priceNegotiable: '', loanRequired: '', maintenanceCharges: '',
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
      minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseDuration: '', leaseNegotiable: '',
      minSellPrice: '', maxSellPrice: '', sellPriceNegotiable: '', propertyTax: '',
      builtUpAreaMin: '', builtUpAreaMax: '',
      landAreaMin: '', landAreaMax: '', landAreaUnit: 'sqft',
      warehouseCapacity: '', coldRoomCapacity: '',
      numberOfLoadingBays: '', dockLevelersAvailable: '', floorHeightCeilingHeight: '',
      parkingTruckMovementSpace: '', propertyAge: '', ownershipType: '',
      temperatureRangeControlled: '', multiTemperatureZones: '', refrigerationSystemType: '',
      deepFreezerFacility: false, chillerRooms: false, backupCoolingSystem: false,
      insulatedStorageWalls: false, inventoryManagementSystem: false, cctvMonitoringInside: false,
      loadingUnloadingDocks: false, forkliftFacility: false, containerAccess: false,
      sortingPackingArea: false, officeCabinSpace: false, dispatchArea: false,
      vehicleParking: false, twentyFourSevenOperations: false,
      twentyFourSevenSecurity: false, cctvSurveillance: false, powerBackup: false,
      generatorBackup: false, fireSafetySystem: false, waterSupply: false,
      internetBroadband: false, labourRestArea: false, canteenFacility: false,
      businessTypes: [],
      readyToOccupy: '', underConstruction: '', immediatePossession: '',
      readyToOperate: '', immediateOccupancy: '', availableFrom: '', minRentalDuration: '',
      leaseRenewalOption: '',
      industrialLicense: '', foodSafetyCompliance: '', fireSafetyApproved: '',
      pollutionControlApproval: '', titleDeedVerified: '', commercialLicense: '',
      loanEligible: '', leaseAgreementReady: '',
      nearbyAccess: [],
      contactOwner: false, contactAgent: false, contactBuilder: false,
      preferredContactTime: ''
    });
  };

  const SectionHeader = ({ emoji, title, section }) => (
    <button onClick={() => toggleSection(section)} className="w-full group" type="button">
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-teal-100 to-emerald-100 hover:from-teal-200 hover:to-emerald-200 transition-all duration-300 border-2 border-teal-300 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-base animate-bounce inline-block">{emoji}</span>
          <span className="font-semibold text-teal-800 text-sm md:text-base group-hover:text-teal-900">{title}</span>
        </div>
        <div className="transition-transform duration-300 group-hover:scale-110">
          {expandedSections[section] ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-teal-600" />}
        </div>
      </div>
    </button>
  );

  const renderBasicDetails = () => (
    <div className="mb-3">
      <SectionHeader emoji="❄️" title="Basic Details" section="basic" />
      {expandedSections.basic && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Property Type</label>
            <input type="text" value="Cold Storage / Logistics Hub" disabled className="w-full px-2 py-1 rounded-lg border-2 border-teal-300 bg-gray-50 text-sm text-gray-600" />
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Purpose</label>
            <input type="text" value={currentTab} disabled className="w-full px-2 py-1 rounded-lg border-2 border-teal-300 bg-gray-50 text-sm text-gray-600" />
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Listing Type</label>
            <div className="flex gap-3 mt-1">
              {['Owner', 'Agent', 'Builder'].map(type => (
                <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="checkbox" checked={filters.listingType.includes(type)} onChange={(e) => {
                    const newList = e.target.checked ? [...filters.listingType, type] : filters.listingType.filter(t => t !== type);
                    handleInputChange('listingType', newList);
                  }} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLocationDetails = () => (
    <div className="mb-3">
      <SectionHeader emoji="📍" title="Location Details" section="location" />
      {expandedSections.location && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">City</label>
              <input type="text" placeholder="Enter city name" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Area / Locality</label>
              <input type="text" placeholder="Enter area or locality" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Landmark</label>
              <input type="text" placeholder="Nearby landmark" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">PIN Code</label>
              <input type="text" placeholder="Enter PIN code" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-2">Highway Facing</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="highwayFacing" value="Yes" checked={filters.highwayFacing === 'Yes'} onChange={(e) => handleRadioChange('highwayFacing', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="highwayFacing" value="No" checked={filters.highwayFacing === 'No'} onChange={(e) => handleRadioChange('highwayFacing', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-2">Industrial Zone</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="industrialZone" value="Yes" checked={filters.industrialZone === 'Yes'} onChange={(e) => handleRadioChange('industrialZone', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="industrialZone" value="No" checked={filters.industrialZone === 'No'} onChange={(e) => handleRadioChange('industrialZone', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Nearby Connectivity</label>
            <input type="text" placeholder="Metro, Bus, Highway" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.nearbyConnectivity} onChange={(e) => handleInputChange('nearbyConnectivity', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="mb-3">
      <SectionHeader emoji="📏" title="Property Details" section="property" />
      {expandedSections.property && (
        <div className="mt-2 space-y-3 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Built-up Area (sq.ft)</label>
              <div className="space-y-1.5">
                <input type="number" placeholder="Min" className="w-full px-1 py-1 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.builtUpAreaMin} onChange={(e) => handleInputChange('builtUpAreaMin', e.target.value)} />
                <input type="number" placeholder="Max" className="w-full px-1 py-1 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.builtUpAreaMax} onChange={(e) => handleInputChange('builtUpAreaMax', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Land Area</label>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1.5">
                  <input type="text" placeholder="Min" className="w-full px-1 py-1 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.landAreaMin} onChange={(e) => handleInputChange('landAreaMin', e.target.value)} />
                  <input type="text" placeholder="Max" className="w-full px-1 py-1 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.landAreaMax} onChange={(e) => handleInputChange('landAreaMax', e.target.value)} />
                </div>
                <AreaUnitSelect value={filters.landAreaUnit} onChange={(val) => handleInputChange('landAreaUnit', val)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Warehouse Capacity (Tons)</label>
              <input type="number" placeholder="Enter capacity" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.warehouseCapacity} onChange={(e) => handleInputChange('warehouseCapacity', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Cold Room Capacity (Tons)</label>
              <input type="number" placeholder="Enter capacity" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.coldRoomCapacity} onChange={(e) => handleInputChange('coldRoomCapacity', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Number of Loading Bays</label>
              <input type="number" placeholder="Enter number" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.numberOfLoadingBays} onChange={(e) => handleInputChange('numberOfLoadingBays', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-2">Dock Levelers Available</label>
              <div className="flex gap-3 mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="dockLevelersAvailable" value="Yes" checked={filters.dockLevelersAvailable === 'Yes'} onChange={(e) => handleRadioChange('dockLevelersAvailable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="dockLevelersAvailable" value="No" checked={filters.dockLevelersAvailable === 'No'} onChange={(e) => handleRadioChange('dockLevelersAvailable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Floor Height / Ceiling Height (ft)</label>
              <input type="number" placeholder="Enter height" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.floorHeightCeilingHeight} onChange={(e) => handleInputChange('floorHeightCeilingHeight', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Parking & Truck Movement Space</label>
              <input type="text" placeholder="Area for trucks" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.parkingTruckMovementSpace} onChange={(e) => handleInputChange('parkingTruckMovementSpace', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CustomSelect label="Property Age" options={propertyAgeOptions} value={filters.propertyAge} onChange={(val) => handleInputChange('propertyAge', val)} placeholder="Select Age" />
            {(currentTab === 'Buy' || currentTab === 'Sell' || currentTab === 'Lease') && (
              <CustomSelect label="Ownership Type" options={ownershipOptions} value={filters.ownershipType} onChange={(val) => handleInputChange('ownershipType', val)} placeholder="Select Ownership" />
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderColdStorageFeatures = () => (
    <div className="mb-3">
      <SectionHeader emoji="❄️" title="Cold Storage Features" section="coldStorageFeatures" />
      {expandedSections.coldStorageFeatures && (
        <div className="mt-2 space-y-3 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-2">Temperature Range Controlled</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="temperatureRangeControlled" value="Yes" checked={filters.temperatureRangeControlled === 'Yes'} onChange={(e) => handleRadioChange('temperatureRangeControlled', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="temperatureRangeControlled" value="No" checked={filters.temperatureRangeControlled === 'No'} onChange={(e) => handleRadioChange('temperatureRangeControlled', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-2">Multi-Temperature Zones</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="multiTemperatureZones" value="Yes" checked={filters.multiTemperatureZones === 'Yes'} onChange={(e) => handleRadioChange('multiTemperatureZones', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="multiTemperatureZones" value="No" checked={filters.multiTemperatureZones === 'No'} onChange={(e) => handleRadioChange('multiTemperatureZones', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Refrigeration System Type</label>
            <input type="text" placeholder="e.g., Ammonia, Freon, CO2" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.refrigerationSystemType} onChange={(e) => handleInputChange('refrigerationSystemType', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.deepFreezerFacility} onChange={(e) => handleCheckboxChange('deepFreezerFacility', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Snowflake className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Deep Freezer Facility</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.chillerRooms} onChange={(e) => handleCheckboxChange('chillerRooms', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <ThermometerIcon className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Chiller Rooms</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.backupCoolingSystem} onChange={(e) => handleCheckboxChange('backupCoolingSystem', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Battery className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Backup Cooling System</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.insulatedStorageWalls} onChange={(e) => handleCheckboxChange('insulatedStorageWalls', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Building className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Insulated Storage Walls</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.inventoryManagementSystem} onChange={(e) => handleCheckboxChange('inventoryManagementSystem', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Server className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Inventory Management System Ready</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.cctvMonitoringInside} onChange={(e) => handleCheckboxChange('cctvMonitoringInside', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Video className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">CCTV Monitoring Inside Storage</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderLogisticsFeatures = () => (
    <div className="mb-3">
      <SectionHeader emoji="🚚" title="Logistics Features" section="logisticsFeatures" />
      {expandedSections.logisticsFeatures && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-1.5">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.loadingUnloadingDocks} onChange={(e) => handleCheckboxChange('loadingUnloadingDocks', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Truck className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Loading / Unloading Docks</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.forkliftFacility} onChange={(e) => handleCheckboxChange('forkliftFacility', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Truck className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Forklift Facility</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.containerAccess} onChange={(e) => handleCheckboxChange('containerAccess', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Box className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Container Access</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.sortingPackingArea} onChange={(e) => handleCheckboxChange('sortingPackingArea', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Package className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Sorting / Packing Area</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.officeCabinSpace} onChange={(e) => handleCheckboxChange('officeCabinSpace', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Building className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Office Cabin Space</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.dispatchArea} onChange={(e) => handleCheckboxChange('dispatchArea', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Truck className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Dispatch Area</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.vehicleParking} onChange={(e) => handleCheckboxChange('vehicleParking', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <ParkingCircle className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Vehicle Parking (Truck / Lorry)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.twentyFourSevenOperations} onChange={(e) => handleCheckboxChange('twentyFourSevenOperations', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Clock className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">24/7 Operations Allowed</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderAmenities = () => (
    <div className="mb-3">
      <SectionHeader emoji="✨" title="Amenities" section="amenities" />
      {expandedSections.amenities && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-1.5">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.twentyFourSevenSecurity} onChange={(e) => handleCheckboxChange('twentyFourSevenSecurity', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Shield className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">24/7 Security</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.cctvSurveillance} onChange={(e) => handleCheckboxChange('cctvSurveillance', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Video className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">CCTV Surveillance</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.powerBackup} onChange={(e) => handleCheckboxChange('powerBackup', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Zap className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Power Backup</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.generatorBackup} onChange={(e) => handleCheckboxChange('generatorBackup', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Battery className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Generator Backup</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.fireSafetySystem} onChange={(e) => handleCheckboxChange('fireSafetySystem', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <AlertCircle className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Fire Safety System</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.waterSupply} onChange={(e) => handleCheckboxChange('waterSupply', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Droplet className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Water Supply</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.internetBroadband} onChange={(e) => handleCheckboxChange('internetBroadband', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Wifi className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Internet / Broadband Ready</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.labourRestArea} onChange={(e) => handleCheckboxChange('labourRestArea', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Users className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Labour Rest Area</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group col-span-2">
              <input type="checkbox" checked={filters.canteenFacility} onChange={(e) => handleCheckboxChange('canteenFacility', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <Utensils className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Canteen Facility</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderBusinessSuitability = () => (
    <div className="mb-3">
      <SectionHeader emoji="💼" title="Business Suitability" section="businessSuitability" />
      {expandedSections.businessSuitability && (
        <div className="mt-2 grid grid-cols-2 gap-1.5 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          {businessTypeOptions.map(type => (
            <label key={type.label} className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.businessTypes.includes(type.label)} onChange={() => handleArrayToggle('businessTypes', type.label)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              {type.icon}
              <span className="text-xs text-teal-700 group-hover:text-teal-600">{type.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const renderNearbyAccess = () => (
    <div className="mb-3">
      <SectionHeader emoji="🚚" title="Nearby Access" section="nearby" />
      {expandedSections.nearby && (
        <div className="mt-2 grid grid-cols-2 gap-1.5 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          {nearbyOptions.map(access => (
            <label key={access} className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.nearbyAccess.includes(access)} onChange={() => handleArrayToggle('nearbyAccess', access)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">{access}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const renderContactPreference = () => (
    <div className="mb-3">
      <SectionHeader emoji="📞" title="Contact Preference" section="contact" />
      {expandedSections.contact && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Contact Owner / Agent / Builder</label>
            <div className="flex gap-3">
              {['Owner', 'Agent', 'Builder'].map(type => {
                const field = `contact${type}`;
                return (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="checkbox" checked={filters[field]} onChange={(e) => handleCheckboxChange(field, e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">{type}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <CustomSelect label="Preferred Contact Time" options={contactTimeOptions} value={filters.preferredContactTime} onChange={(val) => handleInputChange('preferredContactTime', val)} placeholder="Select Time" />
          </div>
        </div>
      )}
    </div>
  );

  const renderLegal = () => {
    if (currentTab === 'Buy' || currentTab === 'Sell') {
      return (
        <div className="mb-3">
          <SectionHeader emoji="⚖️" title="Legal Details" section="legal" />
          {expandedSections.legal && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Industrial License Available</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="industrialLicense" value="Yes" checked={filters.industrialLicense === 'Yes'} onChange={(e) => handleRadioChange('industrialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="industrialLicense" value="No" checked={filters.industrialLicense === 'No'} onChange={(e) => handleRadioChange('industrialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Food Safety Compliance</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="foodSafetyCompliance" value="Yes" checked={filters.foodSafetyCompliance === 'Yes'} onChange={(e) => handleRadioChange('foodSafetyCompliance', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="foodSafetyCompliance" value="No" checked={filters.foodSafetyCompliance === 'No'} onChange={(e) => handleRadioChange('foodSafetyCompliance', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Fire Safety Approved</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="fireSafetyApproved" value="Yes" checked={filters.fireSafetyApproved === 'Yes'} onChange={(e) => handleRadioChange('fireSafetyApproved', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="fireSafetyApproved" value="No" checked={filters.fireSafetyApproved === 'No'} onChange={(e) => handleRadioChange('fireSafetyApproved', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Pollution Control Approval</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="pollutionControlApproval" value="Yes" checked={filters.pollutionControlApproval === 'Yes'} onChange={(e) => handleRadioChange('pollutionControlApproval', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="pollutionControlApproval" value="No" checked={filters.pollutionControlApproval === 'No'} onChange={(e) => handleRadioChange('pollutionControlApproval', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Title Deed Verified</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="titleDeedVerified" value="Yes" checked={filters.titleDeedVerified === 'Yes'} onChange={(e) => handleRadioChange('titleDeedVerified', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="titleDeedVerified" value="No" checked={filters.titleDeedVerified === 'No'} onChange={(e) => handleRadioChange('titleDeedVerified', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Loan Eligible</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="loanEligible" value="Yes" checked={filters.loanEligible === 'Yes'} onChange={(e) => handleRadioChange('loanEligible', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="loanEligible" value="No" checked={filters.loanEligible === 'No'} onChange={(e) => handleRadioChange('loanEligible', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Commercial License Available</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="commercialLicense" value="Yes" checked={filters.commercialLicense === 'Yes'} onChange={(e) => handleRadioChange('commercialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="commercialLicense" value="No" checked={filters.commercialLicense === 'No'} onChange={(e) => handleRadioChange('commercialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (currentTab === 'Lease') {
      return (
        <div className="mb-3">
          <SectionHeader emoji="⚖️" title="Legal Details" section="legal" />
          {expandedSections.legal && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Industrial License Available</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="industrialLicenseLease" value="Yes" checked={filters.industrialLicense === 'Yes'} onChange={(e) => handleRadioChange('industrialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="industrialLicenseLease" value="No" checked={filters.industrialLicense === 'No'} onChange={(e) => handleRadioChange('industrialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Food Safety Compliance</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="foodSafetyComplianceLease" value="Yes" checked={filters.foodSafetyCompliance === 'Yes'} onChange={(e) => handleRadioChange('foodSafetyCompliance', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="foodSafetyComplianceLease" value="No" checked={filters.foodSafetyCompliance === 'No'} onChange={(e) => handleRadioChange('foodSafetyCompliance', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Fire Safety Approved</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="fireSafetyApprovedLease" value="Yes" checked={filters.fireSafetyApproved === 'Yes'} onChange={(e) => handleRadioChange('fireSafetyApproved', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="fireSafetyApprovedLease" value="No" checked={filters.fireSafetyApproved === 'No'} onChange={(e) => handleRadioChange('fireSafetyApproved', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Pollution Control Approval</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="pollutionControlApprovalLease" value="Yes" checked={filters.pollutionControlApproval === 'Yes'} onChange={(e) => handleRadioChange('pollutionControlApproval', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="pollutionControlApprovalLease" value="No" checked={filters.pollutionControlApproval === 'No'} onChange={(e) => handleRadioChange('pollutionControlApproval', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Commercial License Available</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="commercialLicenseLease" value="Yes" checked={filters.commercialLicense === 'Yes'} onChange={(e) => handleRadioChange('commercialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="commercialLicenseLease" value="No" checked={filters.commercialLicense === 'No'} onChange={(e) => handleRadioChange('commercialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Lease Agreement Ready</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="leaseAgreementReady" value="Yes" checked={filters.leaseAgreementReady === 'Yes'} onChange={(e) => handleRadioChange('leaseAgreementReady', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="leaseAgreementReady" value="No" checked={filters.leaseAgreementReady === 'No'} onChange={(e) => handleRadioChange('leaseAgreementReady', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="mb-3">
          <SectionHeader emoji="⚖️" title="Legal Details" section="legal" />
          {expandedSections.legal && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Industrial License Available</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="industrialLicenseRent" value="Yes" checked={filters.industrialLicense === 'Yes'} onChange={(e) => handleRadioChange('industrialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="industrialLicenseRent" value="No" checked={filters.industrialLicense === 'No'} onChange={(e) => handleRadioChange('industrialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Food Safety Compliance</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="foodSafetyComplianceRent" value="Yes" checked={filters.foodSafetyCompliance === 'Yes'} onChange={(e) => handleRadioChange('foodSafetyCompliance', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="foodSafetyComplianceRent" value="No" checked={filters.foodSafetyCompliance === 'No'} onChange={(e) => handleRadioChange('foodSafetyCompliance', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Fire Safety Approved</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="fireSafetyApprovedRent" value="Yes" checked={filters.fireSafetyApproved === 'Yes'} onChange={(e) => handleRadioChange('fireSafetyApproved', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="fireSafetyApprovedRent" value="No" checked={filters.fireSafetyApproved === 'No'} onChange={(e) => handleRadioChange('fireSafetyApproved', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Pollution Control Approval</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="pollutionControlApprovalRent" value="Yes" checked={filters.pollutionControlApproval === 'Yes'} onChange={(e) => handleRadioChange('pollutionControlApproval', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="pollutionControlApprovalRent" value="No" checked={filters.pollutionControlApproval === 'No'} onChange={(e) => handleRadioChange('pollutionControlApproval', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Commercial License Available</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="commercialLicenseRent" value="Yes" checked={filters.commercialLicense === 'Yes'} onChange={(e) => handleRadioChange('commercialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="commercialLicenseRent" value="No" checked={filters.commercialLicense === 'No'} onChange={(e) => handleRadioChange('commercialLicense', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const renderBuyFilters = () => (
    <div className="mb-3">
      <SectionHeader emoji="💰" title="Budget Details" section="price" />
      {expandedSections.price && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Budget Range (Min – Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.minPrice} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maxPrice} onChange={(e) => handleInputChange('maxPrice', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Price Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="priceNegotiableBuy" value="Yes" checked={filters.priceNegotiable === 'Yes'} onChange={(e) => handleRadioChange('priceNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="priceNegotiableBuy" value="No" checked={filters.priceNegotiable === 'No'} onChange={(e) => handleRadioChange('priceNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Loan Required</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="loanRequiredBuy" value="Yes" checked={filters.loanRequired === 'Yes'} onChange={(e) => handleRadioChange('loanRequired', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="loanRequiredBuy" value="No" checked={filters.loanRequired === 'No'} onChange={(e) => handleRadioChange('loanRequired', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Maintenance Charges</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );

  const renderSellFilters = () => (
    <div className="mb-3">
      <SectionHeader emoji="💰" title="Price Details" section="price" />
      {expandedSections.price && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Selling Price Range (Min – Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.minSellPrice} onChange={(e) => handleInputChange('minSellPrice', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maxSellPrice} onChange={(e) => handleInputChange('maxSellPrice', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Price Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="sellPriceNegotiable" value="Yes" checked={filters.sellPriceNegotiable === 'Yes'} onChange={(e) => handleRadioChange('sellPriceNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="sellPriceNegotiable" value="No" checked={filters.sellPriceNegotiable === 'No'} onChange={(e) => handleRadioChange('sellPriceNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Maintenance Charges</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Property Tax</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.propertyTax} onChange={(e) => handleInputChange('propertyTax', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );

  const renderRentFilters = () => (
    <div className="mb-3">
      <SectionHeader emoji="💰" title="Rent Details" section="price" />
      {expandedSections.price && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Monthly Rent Range (Min – Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.minRent} onChange={(e) => handleInputChange('minRent', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maxRent} onChange={(e) => handleInputChange('maxRent', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Security Deposit</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Maintenance Charges Included</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedRent" value="Yes" checked={filters.maintenanceIncluded === 'Yes'} onChange={(e) => handleRadioChange('maintenanceIncluded', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedRent" value="No" checked={filters.maintenanceIncluded === 'No'} onChange={(e) => handleRadioChange('maintenanceIncluded', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Rent Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="rentNegotiable" value="Yes" checked={filters.rentNegotiable === 'Yes'} onChange={(e) => handleRadioChange('rentNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="rentNegotiable" value="No" checked={filters.rentNegotiable === 'No'} onChange={(e) => handleRadioChange('rentNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeaseFilters = () => (
    <div className="mb-3">
      <SectionHeader emoji="📄" title="Lease Details" section="price" />
      {expandedSections.price && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Lease Amount Range (Min – Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Refundable Deposit</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.refundableDeposit} onChange={(e) => handleInputChange('refundableDeposit', e.target.value)} />
          </div>
          <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Maintenance Charges Included</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedLease" value="Yes" checked={filters.maintenanceIncluded === 'Yes'} onChange={(e) => handleRadioChange('maintenanceIncluded', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedLease" value="No" checked={filters.maintenanceIncluded === 'No'} onChange={(e) => handleRadioChange('maintenanceIncluded', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Lease Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="leaseNegotiable" value="Yes" checked={filters.leaseNegotiable === 'Yes'} onChange={(e) => handleRadioChange('leaseNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="leaseNegotiable" value="No" checked={filters.leaseNegotiable === 'No'} onChange={(e) => handleRadioChange('leaseNegotiable', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAvailability = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="mb-3">
          <SectionHeader emoji="📅" title="Availability" section="availability" />
          {expandedSections.availability && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Immediate Occupancy</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediateOccupancy" value="Yes" checked={filters.immediateOccupancy === 'Yes'} onChange={(e) => handleRadioChange('immediateOccupancy', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediateOccupancy" value="No" checked={filters.immediateOccupancy === 'No'} onChange={(e) => handleRadioChange('immediateOccupancy', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <CustomDatePicker label="Available From (Date)" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
              <CustomSelect label="Minimum Rental Duration" options={rentalDurationOptions} value={filters.minRentalDuration} onChange={(val) => handleInputChange('minRentalDuration', val)} placeholder="Select Duration" />
            </div>
          )}
        </div>
      );
    } else if (currentTab === 'Lease') {
      return (
        <div className="mb-3">
          <SectionHeader emoji="📅" title="Availability" section="availability" />
          {expandedSections.availability && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Immediate Occupancy</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediateOccupancyLease" value="Yes" checked={filters.immediateOccupancy === 'Yes'} onChange={(e) => handleRadioChange('immediateOccupancy', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediateOccupancyLease" value="No" checked={filters.immediateOccupancy === 'No'} onChange={(e) => handleRadioChange('immediateOccupancy', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <CustomDatePicker label="Available From (Date)" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Lease Renewal Option</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="leaseRenewalOption" value="Yes" checked={filters.leaseRenewalOption === 'Yes'} onChange={(e) => handleRadioChange('leaseRenewalOption', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="leaseRenewalOption" value="No" checked={filters.leaseRenewalOption === 'No'} onChange={(e) => handleRadioChange('leaseRenewalOption', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (currentTab === 'Sell') {
      return (
        <div className="mb-3">
          <SectionHeader emoji="📅" title="Availability" section="availability" />
          {expandedSections.availability && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Ready to Operate</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="readyToOperate" value="Yes" checked={filters.readyToOperate === 'Yes'} onChange={(e) => handleRadioChange('readyToOperate', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="readyToOperate" value="No" checked={filters.readyToOperate === 'No'} onChange={(e) => handleRadioChange('readyToOperate', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Under Construction</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="underConstruction" value="Yes" checked={filters.underConstruction === 'Yes'} onChange={(e) => handleRadioChange('underConstruction', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="underConstruction" value="No" checked={filters.underConstruction === 'No'} onChange={(e) => handleRadioChange('underConstruction', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Immediate Possession</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediatePossession" value="Yes" checked={filters.immediatePossession === 'Yes'} onChange={(e) => handleRadioChange('immediatePossession', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediatePossession" value="No" checked={filters.immediatePossession === 'No'} onChange={(e) => handleRadioChange('immediatePossession', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="mb-3">
          <SectionHeader emoji="📅" title="Availability" section="availability" />
          {expandedSections.availability && (
            <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Ready to Occupy</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="readyToOccupy" value="Yes" checked={filters.readyToOccupy === 'Yes'} onChange={(e) => handleRadioChange('readyToOccupy', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="readyToOccupy" value="No" checked={filters.readyToOccupy === 'No'} onChange={(e) => handleRadioChange('readyToOccupy', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Under Construction</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="underConstruction" value="Yes" checked={filters.underConstruction === 'Yes'} onChange={(e) => handleRadioChange('underConstruction', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="underConstruction" value="No" checked={filters.underConstruction === 'No'} onChange={(e) => handleRadioChange('underConstruction', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Immediate Possession</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediatePossession" value="Yes" checked={filters.immediatePossession === 'Yes'} onChange={(e) => handleRadioChange('immediatePossession', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediatePossession" value="No" checked={filters.immediatePossession === 'No'} onChange={(e) => handleRadioChange('immediatePossession', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-100 overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
      <div className="sticky top-0 z-10 bg-white border-b-2 border-teal-100">
        <div className="flex justify-between items-center px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded-lg">
              <style>{`
                @keyframes slowRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .slow-rotate { animation: slowRotate 4s linear infinite; }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                .animate-bounce { animation: bounce 0.6s ease-in-out infinite; }
              `}</style>
              <Snowflake className="w-5 h-5 text-white slow-rotate" />
            </div>
            <h3 className="text-white font-semibold text-sm md:text-base">Filter Cold Storage / Logistics Hub</h3>
          </div>
          {onClose && <button onClick={onClose} className="text-white/80 hover:text-white transition-all" type="button"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex border-b-2 border-teal-100 bg-teal-50/50">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => handleTabClick(tab.id)} type="button" className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${currentTab === tab.id ? 'text-teal-700 border-b-2 border-teal-600 bg-white shadow-sm' : 'text-teal-500 hover:text-teal-700 hover:bg-teal-50'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-y-auto flex-1 p-3 custom-scroll" style={{ maxHeight: 'calc(90vh - 100px)' }}>
        {renderBasicDetails()}
        {renderLocationDetails()}
        {currentTab === 'Buy' && renderBuyFilters()}
        {currentTab === 'Sell' && renderSellFilters()}
        {currentTab === 'Rent' && renderRentFilters()}
        {currentTab === 'Lease' && renderLeaseFilters()}
        {renderPropertyDetails()}
        {renderColdStorageFeatures()}
        {renderLogisticsFeatures()}
        {renderAmenities()}
        {renderBusinessSuitability()}
        {renderAvailability()}
        {renderLegal()}
        {renderNearbyAccess()}
        {renderContactPreference()}
      </div>
      <div className="sticky bottom-0 p-2 border-t-2 border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50">
        <div className="flex gap-2">
          <button onClick={clearAllFilters} className="flex-1 px-2 py-1.5 rounded-xl border-2 border-teal-300 text-teal-700 font-semibold text-xs hover:bg-teal-100 transition-all flex items-center justify-center gap-1.5" type="button">
            <RefreshCw className="w-3.5 h-3.5" /> Reset All
          </button>
          <button onClick={applyFilters} className="flex-1 px-2 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-xs hover:shadow-lg transition-all flex items-center justify-center gap-1.5" type="button">
            <CheckCircle className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </div>
      </div>
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: #E6FFFA; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #00695C, #26A69A); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ColdStorageFilter;