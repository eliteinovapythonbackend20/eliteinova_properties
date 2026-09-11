import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronDown, Building, MapPin, IndianRupee, Ruler, Shield,
  Phone, FileText, RefreshCw, DollarSign, Calendar, Zap,
  Square, Home, Bus, CheckCircle, TrendingUp, Clock, Factory,
  Warehouse, Truck, Battery, Droplets, Wifi, HardDrive, ShieldCheck,
  Trees, Fence, Car, Sparkles, Sun, Award, Landmark, FileCheck,
  Box, Package, Globe, Anchor, Train, Plane, Ship, Cpu,
  Microchip, Globe2, Briefcase, Users, Building2, GraduationCap,
  Leaf, Droplet, Zap as ZapIcon, Activity, Database, Cloud,
  Store, Hotel, Utensils, Stethoscope, School, Fuel, Layers,
  Accessibility, Compass, Sprout, HardHat, Construction, Gauge,
  Grid, Maximize, Minimize, Move, RotateCw, Scissors, Sword,
  Target, Terminal, Thermometer, Umbrella, Waves, Wind,
  Circle, Hexagon, Octagon, Pentagon, Triangle, CheckSquare
} from 'lucide-react';

// Custom Square Icon
const SquareIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
  </svg>
);

// ShoppingBag icon component
const ShoppingBag = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" />
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" />
    <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" />
  </svg>
);

// Subway icon component
const Subway = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" />
    <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" />
    <line x1="8" y1="16" x2="12" y2="16" stroke="currentColor" />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
);

// Road icon component
const Road = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M4 6l8-4 8 4" stroke="currentColor" />
    <path d="M4 18l8 4 8-4" stroke="currentColor" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" />
  </svg>
);

// Custom Date Picker - Compact
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

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    const formattedDate = newDate.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const today = new Date();
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-6 w-6"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
      const isSelected = selectedDate === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      calendarDays.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={`h-6 w-6 rounded text-xs font-medium transition-all duration-200 ${
            isSelected ? 'bg-teal-500 text-white' :
            isToday ? 'bg-teal-100 text-teal-700 border border-teal-300' :
            'text-gray-700 hover:bg-teal-100 hover:text-teal-700'
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
      <label className="text-xs text-teal-800 font-semibold block mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={selectedDate}
          onFocus={() => setIsOpen(true)}
          readOnly
          placeholder="Select Date"
          className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 cursor-pointer"
        />
        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-teal-500 pointer-events-none" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-xl border border-teal-200 overflow-hidden" style={{ width: '240px' }}>
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-3 py-1.5 flex items-center justify-between">
            <button type="button" onClick={() => {
              if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
              else { setViewMonth(viewMonth - 1); }
            }} className="p-0.5 rounded hover:bg-white/20 text-white transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
            </button>
            <span className="text-white font-semibold text-xs">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
              else { setViewMonth(viewMonth + 1); }
            }} className="p-0.5 rounded hover:bg-white/20 text-white transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 18l6-6-6-6" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="p-2">
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {days.map(day => <div key={day} className="h-6 w-6 flex items-center justify-center text-[10px] font-semibold text-teal-600">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">{renderCalendar()}</div>
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
      if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <label className="text-xs text-teal-800 font-semibold block mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs text-left flex justify-between items-center focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-200"
      >
        <span className={selectedOption ? 'text-gray-700' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder || `Select ${label}`}
        </span>
        <ChevronDown className={`w-3 h-3 text-teal-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border border-teal-200 max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full px-2 py-1.5 text-xs text-left transition-all duration-150 ${
                value === opt.value
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 hover:bg-teal-500 hover:text-white'
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

// Land Area Unit Select
const LandAreaUnitSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const units = [
    { value: 'sqft', label: 'Sq.ft' },
    { value: 'sqyards', label: 'Sq.Yards' },
    { value: 'acres', label: 'Acres' },
    { value: 'hectares', label: 'Hectares' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
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
        className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs flex items-center justify-between gap-1 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 hover:bg-teal-50 transition-all duration-200"
      >
        <span className="text-gray-700">{selectedUnit ? selectedUnit.label : 'Unit'}</span>
        <ChevronDown className={`w-3 h-3 text-teal-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 right-0 bg-white rounded-lg shadow-xl border border-teal-200 overflow-hidden">
          {units.map((unit) => (
            <button
              key={unit.value}
              type="button"
              onClick={() => { onChange(unit.value); setIsOpen(false); }}
              className={`w-full px-2 py-1.5 text-xs text-left whitespace-nowrap transition-all duration-150 ${
                value === unit.value
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 hover:bg-teal-500 hover:text-white'
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

// Yes/No Radio Group Component
const YesNoRadioGroup = ({ label, name, value, onChange }) => (
  <div className="bg-white rounded-md p-2 border border-teal-200">
    <label className="text-xs text-teal-800 font-semibold block mb-1.5">
      {label}
    </label>
    <div className="flex gap-3">
      <label className="flex items-center gap-1.5 cursor-pointer group">
        <input
          type="radio"
          name={name}
          value="Yes"
          checked={value === 'Yes'}
          onChange={(e) => onChange(e.target.value)}
          className="w-3.5 h-3.5 border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
        />
        <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Yes</span>
      </label>
      <label className="flex items-center gap-1.5 cursor-pointer group">
        <input
          type="radio"
          name={name}
          value="No"
          checked={value === 'No'}
          onChange={(e) => onChange(e.target.value)}
          className="w-3.5 h-3.5 border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
        />
        <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">No</span>
      </label>
    </div>
  </div>
);

// Regular Radio Group
const RadioGroup = ({ label, name, options, value, onChange, className = "" }) => (
  <div className={className}>
    {label && <label className="text-xs text-teal-800 font-semibold block mb-1">{label}</label>}
    <div className="flex flex-wrap gap-3">
      {options.map(option => (
        <label key={option.value} className="flex items-center gap-1.5 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-3.5 h-3.5 border border-teal-300 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
          />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const MultiPurposeDevelopmentLandFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState('Buy');
  const [activeMainSection, setActiveMainSection] = useState('basic');

  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location Details
    city: '', locality: '', landmark: '', pincode: '',
    mainRoadFacing: '', cornerProperty: '', nearbyConnectivity: '',
    // Price/Rent/Lease/Buy Details
    minBudget: '', maxBudget: '', priceNegotiable: '', loanRequired: '',
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
    minLeaseAmount: '', maxLeaseAmount: '', leaseDuration: '', leaseNegotiable: '',
    maintenanceCharges: '', propertyTax: '',
    // Land Details
    totalLandArea: '', landAreaUnit: 'sqft', plotLength: '', plotWidth: '',
    frontageWidth: '', roadWidth: '', facing: '', boundaryWall: '',
    landLevel: '', soilType: '', ownershipType: '',
    // Development Suitability
    developmentSuitability: [],
    // Infrastructure
    infrastructure: [],
    // Amenities
    amenities: [],
    // Legal Details
    titleDeedVerified: '', loanEligible: '', reraApproved: '', dtcpApproved: '',
    cmdaApproved: '', panchayatApproved: '', landConversionApproved: '',
    encumbranceCertificate: '', commercialUsagePermitted: '',
    // Availability
    readyForRegistration: '', immediatePossession: '', underDevelopment: '',
    availableFrom: '', minimumRentalDuration: '', leaseRenewal: '',
    // Nearby Access
    nearbyAccess: [],
    // Contact
    contactOwner: false, contactAgent: false, contactBuilder: false, contactDeveloper: false,
    preferredContactTime: ''
  });

  // Options Arrays
  const facingOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
    { value: 'North-East', label: 'North-East' },
    { value: 'North-West', label: 'North-West' },
    { value: 'South-East', label: 'South-East' },
    { value: 'South-West', label: 'South-West' }
  ];

  const landLevelOptions = [
    { value: 'Flat', label: 'Flat / Leveled' },
    { value: 'Elevated', label: 'Elevated' },
    { value: 'LowLying', label: 'Low Lying' }
  ];

  const soilTypeOptions = [
    { value: 'Black', label: 'Black Soil' },
    { value: 'Red', label: 'Red Soil' },
    { value: 'Sandy', label: 'Sandy Soil' },
    { value: 'Clay', label: 'Clay Soil' },
    { value: 'Loamy', label: 'Loamy Soil' }
  ];

  const ownershipTypeOptions = [
    { value: 'Freehold', label: 'Freehold' },
    { value: 'Leasehold', label: 'Leasehold' }
  ];

  const leaseDurationOptions = [
    { value: '1', label: '1 Year' },
    { value: '2', label: '2 Years' },
    { value: '3', label: '3 Years' },
    { value: '5', label: '5 Years' },
    { value: '10', label: '10 Years' },
    { value: '10+', label: '10+ Years' }
  ];

  const minimumRentalDurationOptions = [
    { value: '1', label: '1 Month' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '1 Year' },
    { value: '24', label: '2 Years' },
    { value: '36', label: '3 Years' }
  ];

  const contactTimeOptions = [
    { value: 'Morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'Afternoon', label: 'Afternoon (12 PM - 4 PM)' },
    { value: 'Evening', label: 'Evening (4 PM - 7 PM)' },
    { value: 'Any', label: 'Any Time' }
  ];

  // Development Suitability Options
  const developmentSuitabilityOptions = [
    // Residential
    { id: 'residential-township', label: 'Residential Township', icon: <Home className="w-3 h-3" /> },
    { id: 'villas', label: 'Villas', icon: <Building className="w-3 h-3" /> },
    { id: 'apartments', label: 'Apartments', icon: <Building2 className="w-3 h-3" /> },
    { id: 'farmhouse', label: 'Farmhouse Development', icon: <Trees className="w-3 h-3" /> },
    // Commercial
    { id: 'commercial-complex', label: 'Commercial Complex', icon: <Store className="w-3 h-3" /> },
    { id: 'shopping-mall', label: 'Shopping Mall', icon: <ShoppingBag className="w-3 h-3" /> },
    { id: 'it-park', label: 'IT Park', icon: <Cpu className="w-3 h-3" /> },
    { id: 'industrial-park', label: 'Industrial Park', icon: <Factory className="w-3 h-3" /> },
    // Mixed Use
    { id: 'mixed-use', label: 'Mixed-Use Development', icon: <Layers className="w-3 h-3" /> },
    // Institutional
    { id: 'educational', label: 'Educational Institution', icon: <GraduationCap className="w-3 h-3" /> },
    { id: 'healthcare', label: 'Hospital / Healthcare', icon: <Stethoscope className="w-3 h-3" /> },
    // Industrial & Logistics
    { id: 'warehouse', label: 'Warehouse / Logistics Park', icon: <Warehouse className="w-3 h-3" /> },
    // Hospitality
    { id: 'hotel-resort', label: 'Hotel / Resort', icon: <Hotel className="w-3 h-3" /> },
    // Commercial Yard (Rent specific)
    { id: 'commercial-yard', label: 'Commercial Yard', icon: <Square className="w-3 h-3" /> },
    { id: 'vehicle-parking', label: 'Vehicle Parking', icon: <Car className="w-3 h-3" /> },
    { id: 'construction-site', label: 'Construction Site', icon: <Construction className="w-3 h-3" /> },
    { id: 'event-ground', label: 'Event Ground', icon: <Calendar className="w-3 h-3" /> },
    { id: 'storage-yard', label: 'Storage Yard', icon: <Package className="w-3 h-3" /> },
    { id: 'agriculture', label: 'Agriculture', icon: <Sprout className="w-3 h-3" /> },
    { id: 'temporary-warehouse', label: 'Temporary Warehouse', icon: <Box className="w-3 h-3" /> }
  ];

  // Infrastructure Options
  const infrastructureOptions = [
    { id: 'electricity', label: 'Electricity Connection', icon: <Zap className="w-3 h-3" /> },
    { id: 'water-supply', label: 'Water Supply', icon: <Droplets className="w-3 h-3" /> },
    { id: 'drainage', label: 'Drainage System', icon: <Activity className="w-3 h-3" /> },
    { id: 'sewage', label: 'Sewage Connection', icon: <Droplet className="w-3 h-3" /> },
    { id: 'street-lighting', label: 'Street Lighting', icon: <Sun className="w-3 h-3" /> },
    { id: 'internal-roads', label: 'Internal Roads', icon: <Road className="w-3 h-3" /> },
    { id: 'compound-wall', label: 'Compound Wall', icon: <Fence className="w-3 h-3" /> },
    { id: 'rainwater-drainage', label: 'Rainwater Drainage', icon: <Cloud className="w-3 h-3" /> },
    { id: 'truck-access', label: 'Truck Access', icon: <Truck className="w-3 h-3" /> },
    { id: 'security-cabin', label: 'Security Cabin', icon: <Shield className="w-3 h-3" /> }
  ];

  // Amenities Options
  const amenitiesOptions = [
    { id: 'gated-community', label: 'Gated Community', icon: <Fence className="w-3 h-3" /> },
    { id: '24-7-security', label: '24/7 Security', icon: <ShieldCheck className="w-3 h-3" /> },
    { id: 'cctv-surveillance', label: 'CCTV Surveillance', icon: <HardDrive className="w-3 h-3" /> },
    { id: 'power-backup', label: 'Power Backup Nearby', icon: <Battery className="w-3 h-3" /> },
    { id: 'green-zone', label: 'Green Zone', icon: <Leaf className="w-3 h-3" /> },
    { id: 'public-transport', label: 'Public Transport Access', icon: <Bus className="w-3 h-3" /> },
    { id: 'broadband', label: 'Broadband / Fiber Connectivity', icon: <Wifi className="w-3 h-3" /> },
    { id: 'street-lights', label: 'Street Lights', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'gated-entry', label: 'Gated Entry', icon: <Shield className="w-3 h-3" /> },
    { id: 'internet-connectivity', label: 'Internet Connectivity', icon: <Globe className="w-3 h-3" /> },
    { id: 'broadband-ready', label: 'Broadband Ready', icon: <Cloud className="w-3 h-3" /> }
  ];

  // Nearby Access Options
  const nearbyOptions = [
    { id: 'highway', label: 'Highway Access', icon: <Road className="w-3 h-3" /> },
    { id: 'bus-stop', label: 'Bus Stop', icon: <Bus className="w-3 h-3" /> },
    { id: 'railway', label: 'Railway Station', icon: <Train className="w-3 h-3" /> },
    { id: 'metro', label: 'Metro Station', icon: <Subway className="w-3 h-3" /> },
    { id: 'airport', label: 'Airport', icon: <Plane className="w-3 h-3" /> },
    { id: 'residential-hub', label: 'Residential Hub', icon: <Home className="w-3 h-3" /> },
    { id: 'commercial-hub', label: 'Commercial Hub', icon: <Store className="w-3 h-3" /> },
    { id: 'schools-colleges', label: 'Schools & Colleges', icon: <GraduationCap className="w-3 h-3" /> },
    { id: 'hospitals', label: 'Hospitals', icon: <Stethoscope className="w-3 h-3" /> },
    { id: 'bank-atm', label: 'Bank / ATM', icon: <Landmark className="w-3 h-3" /> },
    { id: 'market-area', label: 'Market Area', icon: <ShoppingBag className="w-3 h-3" /> },
    { id: 'logistics-hub', label: 'Logistics Hub', icon: <Truck className="w-3 h-3" /> }
  ];

  const mainSections = [
    { id: 'basic', label: '📍 Basic', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'price', label: currentTab === 'Buy' ? '💰 Budget' : currentTab === 'Rent' ? '💰 Rent' : '💰 Lease', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'land', label: '📐 Land', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'development', label: '🏗️ Development', icon: <Construction className="w-3.5 h-3.5" /> },
    { id: 'infrastructure', label: '⚡ Utilities', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'amenities', label: '🎯 Amenities', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'legal', label: '⚖️ Legal', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'availability', label: '📅 Available', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'nearby', label: '🚌 Nearby', icon: <Bus className="w-3.5 h-3.5" /> },
    { id: 'contact', label: '📞 Contact', icon: <Phone className="w-3.5 h-3.5" /> }
  ];

  const tabs = [
    { id: 'Buy', label: 'Buy', icon: <DollarSign className="w-3 h-3" /> },
    { id: 'Rent', label: 'Rent', icon: <IndianRupee className="w-3 h-3" /> },
    { id: 'Lease', label: 'Lease', icon: <FileText className="w-3 h-3" /> }
  ];

  // Animation styles
  const animationStyle = `
    @keyframes slowRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .slow-rotate {
      animation: slowRotate 4s linear infinite;
    }
  `;

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setActiveMainSection('basic');
    if (onTabChange) onTabChange(tabId);
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Multi-Purpose Development Land' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      city: '', locality: '', landmark: '', pincode: '',
      mainRoadFacing: '', cornerProperty: '', nearbyConnectivity: '',
      minBudget: '', maxBudget: '', priceNegotiable: '', loanRequired: '',
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
      minLeaseAmount: '', maxLeaseAmount: '', leaseDuration: '', leaseNegotiable: '',
      maintenanceCharges: '', propertyTax: '',
      totalLandArea: '', landAreaUnit: 'sqft', plotLength: '', plotWidth: '',
      frontageWidth: '', roadWidth: '', facing: '', boundaryWall: '',
      landLevel: '', soilType: '', ownershipType: '',
      developmentSuitability: [],
      infrastructure: [],
      amenities: [],
      titleDeedVerified: '', loanEligible: '', reraApproved: '', dtcpApproved: '',
      cmdaApproved: '', panchayatApproved: '', landConversionApproved: '',
      encumbranceCertificate: '', commercialUsagePermitted: '',
      readyForRegistration: '', immediatePossession: '', underDevelopment: '',
      availableFrom: '', minimumRentalDuration: '', leaseRenewal: '',
      nearbyAccess: [],
      contactOwner: false, contactAgent: false, contactBuilder: false, contactDeveloper: false,
      preferredContactTime: ''
    });
  };

  const SectionNav = () => (
    <div className="flex flex-wrap gap-1 p-1.5 bg-teal-50/80 rounded-lg sticky top-0 z-20 border border-teal-200">
      {mainSections.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveMainSection(section.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-200 whitespace-nowrap ${
            activeMainSection === section.id
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm'
              : 'bg-white text-teal-700 hover:bg-teal-100 border border-teal-200'
          }`}
        >
          {section.icon}
          <span>{section.label}</span>
        </button>
      ))}
    </div>
  );

  const renderBasicSection = () => (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Home className="w-3.5 h-3.5" /> Basic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Property Type</label>
            <input type="text" value="Multi-Purpose Development Land" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Purpose</label>
            <input type="text" value={currentTab} disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-teal-800 font-semibold block mb-1.5">Listing Type</label>
            <div className="flex flex-wrap gap-3">
              {['Owner', 'Agent', 'Builder', 'Developer'].map(type => (
                <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.listingType.includes(type)}
                    onChange={(e) => {
                      const newList = e.target.checked ? [...filters.listingType, type] : filters.listingType.filter(t => t !== type);
                      handleInputChange('listingType', newList);
                    }}
                    className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
                  />
                  <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><MapPin className="w-3.5 h-3.5" /> Location Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input type="text" placeholder="City / Town / Village" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
          <input type="text" placeholder="Area / Locality" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
          <input type="text" placeholder="Landmark" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
          <input type="text" placeholder="PIN Code" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
          <YesNoRadioGroup label="Main Road Facing" name="mainRoadFacing" value={filters.mainRoadFacing} onChange={(val) => handleRadioChange('mainRoadFacing', val)} />
          <YesNoRadioGroup label="Corner Property" name="cornerProperty" value={filters.cornerProperty} onChange={(val) => handleRadioChange('cornerProperty', val)} />
          <div className="md:col-span-2">
            <input type="text" placeholder="Nearby Connectivity" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.nearbyConnectivity} onChange={(e) => handleInputChange('nearbyConnectivity', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPriceSection = () => {
    if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><DollarSign className="w-3.5 h-3.5" /> Budget Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minBudget} onChange={(e) => handleInputChange('minBudget', e.target.value)} />
              <input type="number" placeholder="Max Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxBudget} onChange={(e) => handleInputChange('maxBudget', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Price Negotiable" name="priceNegotiable" value={filters.priceNegotiable} onChange={(val) => handleRadioChange('priceNegotiable', val)} />
              <YesNoRadioGroup label="Loan Required" name="loanRequired" value={filters.loanRequired} onChange={(val) => handleRadioChange('loanRequired', val)} />
            </div>
          </div>
        </div>
      );
    } else if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><IndianRupee className="w-3.5 h-3.5" /> Rent Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min Monthly Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minRent} onChange={(e) => handleInputChange('minRent', e.target.value)} />
              <input type="number" placeholder="Max Monthly Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxRent} onChange={(e) => handleInputChange('maxRent', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
              <YesNoRadioGroup label="Maintenance Charges Included" name="maintenanceIncluded" value={filters.maintenanceIncluded} onChange={(val) => handleRadioChange('maintenanceIncluded', val)} />
              <YesNoRadioGroup label="Rent Negotiable" name="rentNegotiable" value={filters.rentNegotiable} onChange={(val) => handleRadioChange('rentNegotiable', val)} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileText className="w-3.5 h-3.5" /> Lease Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min Lease Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
              <input type="number" placeholder="Max Lease Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="number" placeholder="Refundable Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
              <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Lease Negotiable" name="leaseNegotiable" value={filters.leaseNegotiable} onChange={(val) => handleRadioChange('leaseNegotiable', val)} />
              <YesNoRadioGroup label="Lease Renewal Option" name="leaseRenewal" value={filters.leaseRenewal} onChange={(val) => handleRadioChange('leaseRenewal', val)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
            </div>
          </div>
        </div>
      );
    }
  };

  const renderLandSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><SquareIcon className="w-3.5 h-3.5" /> Land Details</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2 items-end">
          <input type="text" placeholder="Total Land Area" className="col-span-1 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.totalLandArea} onChange={(e) => handleInputChange('totalLandArea', e.target.value)} />
          <LandAreaUnitSelect value={filters.landAreaUnit} onChange={(val) => handleInputChange('landAreaUnit', val)} />
          <input type="text" placeholder="Length (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotLength} onChange={(e) => handleInputChange('plotLength', e.target.value)} />
          <input type="text" placeholder="Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotWidth} onChange={(e) => handleInputChange('plotWidth', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input type="text" placeholder="Frontage Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.frontageWidth} onChange={(e) => handleInputChange('frontageWidth', e.target.value)} />
          <input type="text" placeholder="Road Width Facing Property (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          <CustomSelect label="Facing Direction" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <YesNoRadioGroup label="Boundary Wall" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          <CustomSelect label="Land Level" options={landLevelOptions} value={filters.landLevel} onChange={(val) => handleInputChange('landLevel', val)} placeholder="Select Level" />
          <CustomSelect label="Soil Type" options={soilTypeOptions} value={filters.soilType} onChange={(val) => handleInputChange('soilType', val)} placeholder="Select Soil Type" />
          <CustomSelect label="Ownership Type" options={ownershipTypeOptions} value={filters.ownershipType} onChange={(val) => handleInputChange('ownershipType', val)} placeholder="Select Ownership" />
        </div>
      </div>
    </div>
  );

  const renderDevelopmentSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Construction className="w-3.5 h-3.5" /> Development Suitability</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        {developmentSuitabilityOptions.map(option => (
          <label key={option.id} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.developmentSuitability.includes(option.id)}
              onChange={() => handleArrayToggle('developmentSuitability', option.id)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderInfrastructureSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Zap className="w-3.5 h-3.5" /> Infrastructure & Utilities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        {infrastructureOptions.map(option => (
          <label key={option.id} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.infrastructure.includes(option.id)}
              onChange={() => handleArrayToggle('infrastructure', option.id)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Sparkles className="w-3.5 h-3.5" /> Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        {amenitiesOptions.map(option => (
          <label key={option.id} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.amenities.includes(option.id)}
              onChange={() => handleArrayToggle('amenities', option.id)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderLegalSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Shield className="w-3.5 h-3.5" /> Legal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
        {currentTab === 'Buy' && (
          <YesNoRadioGroup label="Loan Eligible" name="loanEligible" value={filters.loanEligible} onChange={(val) => handleRadioChange('loanEligible', val)} />
        )}
        <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
        <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
        <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
        <YesNoRadioGroup label="Panchayat Approved" name="panchayatApproved" value={filters.panchayatApproved} onChange={(val) => handleRadioChange('panchayatApproved', val)} />
        <YesNoRadioGroup label="Land Conversion Approved" name="landConversionApproved" value={filters.landConversionApproved} onChange={(val) => handleRadioChange('landConversionApproved', val)} />
        <YesNoRadioGroup label="Encumbrance Certificate Available" name="encumbranceCertificate" value={filters.encumbranceCertificate} onChange={(val) => handleRadioChange('encumbranceCertificate', val)} />
        {currentTab === 'Lease' && (
          <YesNoRadioGroup label="Commercial Usage Permitted" name="commercialUsagePermitted" value={filters.commercialUsagePermitted} onChange={(val) => handleRadioChange('commercialUsagePermitted', val)} />
        )}
      </div>
    </div>
  );

  const renderAvailabilitySection = () => {
    if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Ready for Registration" name="readyForRegistration" value={filters.readyForRegistration} onChange={(val) => handleRadioChange('readyForRegistration', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Under Development" name="underDevelopment" value={filters.underDevelopment} onChange={(val) => handleRadioChange('underDevelopment', val)} />
          </div>
        </div>
      );
    } else if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Immediate Occupancy" name="immediateOccupancy" value={filters.immediateOccupancy} onChange={(val) => handleRadioChange('immediateOccupancy', val)} />
            <CustomDatePicker label="Available From Date" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            <CustomSelect label="Minimum Rental Duration" options={minimumRentalDurationOptions} value={filters.minimumRentalDuration} onChange={(val) => handleInputChange('minimumRentalDuration', val)} placeholder="Select Duration" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Immediate Occupancy" name="immediateOccupancy" value={filters.immediateOccupancy} onChange={(val) => handleRadioChange('immediateOccupancy', val)} />
            <CustomDatePicker label="Available From Date" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            <YesNoRadioGroup label="Lease Renewal Option" name="leaseRenewal" value={filters.leaseRenewal} onChange={(val) => handleRadioChange('leaseRenewal', val)} />
          </div>
        </div>
      );
    }
  };

  const renderNearbySection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Bus className="w-3.5 h-3.5" /> Nearby Access</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
        {nearbyOptions.map(option => (
          <label key={option.id} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.nearbyAccess.includes(option.id)}
              onChange={() => handleArrayToggle('nearbyAccess', option.id)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Phone className="w-3.5 h-3.5" /> Contact Preference</h3>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactOwner} onChange={(e) => handleCheckboxChange('contactOwner', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Contact Owner</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactAgent} onChange={(e) => handleCheckboxChange('contactAgent', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Contact Agent</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactBuilder} onChange={(e) => handleCheckboxChange('contactBuilder', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Contact Builder</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactDeveloper} onChange={(e) => handleCheckboxChange('contactDeveloper', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Contact Developer</span>
          </label>
        </div>
        <CustomSelect label="Preferred Contact Time" options={contactTimeOptions} value={filters.preferredContactTime} onChange={(val) => handleInputChange('preferredContactTime', val)} placeholder="Select Time" />
      </div>
    </div>
  );

  return (
    <>
      <style>{animationStyle}</style>
      <div className="bg-white rounded-xl shadow-xl border border-teal-100 overflow-hidden flex flex-col" style={{ maxHeight: '85vh', width: '100%', maxWidth: '900px' }}>
        <div className="sticky top-0 z-10 bg-white border-b border-teal-100">
          <div className="flex justify-between items-center px-3 py-2 bg-gradient-to-r from-teal-600 to-emerald-700">
            <div className="flex items-center gap-2">
              <div className="p-0.5 bg-white/20 rounded">
                <Building className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-sm">Filter Multi-Purpose Development Land</h3>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/80 hover:text-white transition-all p-0.5" type="button">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex border-b border-teal-100 bg-teal-50/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                type="button"
                className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentTab === tab.id ? 'text-teal-600 border-b-2 border-teal-500 bg-white shadow-sm' : 'text-teal-500 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SectionNav />
          <div className="p-3 space-y-3">
            {activeMainSection === 'basic' && renderBasicSection()}
            {activeMainSection === 'price' && renderPriceSection()}
            {activeMainSection === 'land' && renderLandSection()}
            {activeMainSection === 'development' && renderDevelopmentSection()}
            {activeMainSection === 'infrastructure' && renderInfrastructureSection()}
            {activeMainSection === 'amenities' && renderAmenitiesSection()}
            {activeMainSection === 'legal' && renderLegalSection()}
            {activeMainSection === 'availability' && renderAvailabilitySection()}
            {activeMainSection === 'nearby' && renderNearbySection()}
            {activeMainSection === 'contact' && renderContactSection()}
          </div>
        </div>

        <div className="sticky bottom-0 p-2 border-t border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex gap-2">
            <button onClick={clearAllFilters} className="flex-1 px-3 py-1.5 rounded-lg border border-teal-400 text-teal-600 font-semibold text-xs hover:bg-teal-200 transition-all flex items-center justify-center gap-1.5" type="button">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
            <button onClick={applyFilters} className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-semibold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5" type="button">
              <CheckCircle className="w-3 h-3" /> Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiPurposeDevelopmentLandFilter;