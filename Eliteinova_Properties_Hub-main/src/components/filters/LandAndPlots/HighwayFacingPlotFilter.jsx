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
  Circle, Hexagon, Octagon, Pentagon, Triangle, CheckSquare,
  Navigation, Compass as CompassIcon
} from 'lucide-react';

// Custom Square Icon
const SquareIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
  </svg>
);

// Custom Road Icon
const RoadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M4 6l8-4 8 4" stroke="currentColor" />
    <path d="M4 18l8 4 8-4" stroke="currentColor" />
    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" />
  </svg>
);

// Custom Highway Icon
const HighwayIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6l16 0M4 12l16 0M4 18l16 0" stroke="currentColor" strokeLinecap="round"/>
    <path d="M8 4v16M12 4v16M16 4v16" stroke="currentColor" strokeLinecap="round"/>
    <path d="M6 4l-2 2 2 2M18 4l2 2-2 2M6 20l-2-2 2-2M18 20l2-2-2-2" stroke="currentColor" strokeLinecap="round"/>
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

// Checkbox Group Component
const CheckboxGroup = ({ label, options, values, onChange, columns = 2 }) => (
  <div>
    {label && <label className="text-xs text-teal-800 font-semibold block mb-1.5">{label}</label>}
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-1.5`}>
      {options.map(option => (
        <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
          <input
            type="checkbox"
            checked={values.includes(option)}
            onChange={(e) => {
              if (e.target.checked) onChange([...values, option]);
              else onChange(values.filter(v => v !== option));
            }}
            className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
          />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const HighwayFacingPlotFilter = ({ activeTab = 'Rent', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [activeMainSection, setActiveMainSection] = useState('basic');

  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location Details
    state: '', city: '', locality: '', villageTown: '', landmark: '', pincode: '',
    highwayType: '', highwayNameNumber: '',
    mainRoadFacing: '', cornerPlot: '', nearbyConnectivity: '',
    // Price/Rent Details
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
    minSellPrice: '', maxSellPrice: '', sellPriceNegotiable: '', propertyTax: '', maintenanceCharges: '',
    // Plot Details
    totalPlotArea: '', landAreaUnit: 'sqft', plotLength: '', plotWidth: '',
    frontageWidth: '', highwayFrontageLength: '', roadWidth: '',
    facing: '', boundaryWall: '', landLevel: '', soilType: '', ownershipType: '',
    // Suitable For (Rent)
    suitableFor: [],
    // Land Usage (Sell)
    landUsage: [],
    // Investment Highlights (Sell)
    investmentHighlights: [],
    // Infrastructure
    infrastructure: [],
    // Amenities
    amenities: [],
    // Legal Details (Sell)
    titleDeedVerified: '', loanEligible: '', reraApproved: '', dtcpApproved: '',
    cmdaApproved: '', panchayatApproved: '', landConversionApproved: '',
    encumbranceCertificate: '',
    // Availability
    immediateOccupancy: '', readyForRegistration: '', immediatePossession: '', vacantLand: '',
    availableFrom: '', minimumRentalDuration: '',
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

  const highwayTypeOptions = [
    { value: 'National Highway (NH)', label: 'National Highway (NH)' },
    { value: 'State Highway (SH)', label: 'State Highway (SH)' },
    { value: 'National Highway + State Highway', label: 'National Highway + State Highway' }
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

  // Suitable For Options (Rent)
  const suitableForOptions = [
    'Vehicle Parking', 'Truck Parking', 'Warehouse Yard', 'Logistics Yard',
    'Construction Material Storage', 'Petrol Pump', 'Temporary Commercial Use',
    'Restaurant / Dhaba', 'Event Ground', 'Industrial Use'
  ];

  // Land Usage Options (Sell)
  const landUsageOptions = [
    'Residential', 'Commercial', 'Industrial', 'Agricultural',
    'Mixed Use', 'Warehouse Development', 'Logistics Park',
    'Petrol Pump', 'Hotel / Motel', 'Restaurant / Food Court',
    'Retail Showroom', 'Truck Parking', 'Resort Development'
  ];

  // Investment Highlights (Sell)
  const investmentHighlightsOptions = [
    'High Appreciation Potential',
    'Suitable for Commercial Development',
    'Suitable for Residential Development',
    'Suitable for Industrial Development',
    'Suitable for Warehouse',
    'High Traffic Visibility',
    'Future Infrastructure Growth',
    'Corner Investment Opportunity'
  ];

  // Infrastructure Options
  const infrastructureOptions = [
    'Electricity Available', 'Water Connection', 'Borewell Available',
    'Drainage Facility', 'Sewage Connection', 'Street Lighting',
    'Internal Road', 'Internet / Fiber Connectivity', 'Truck Access'
  ];

  // Amenities Options
  const amenitiesOptions = [
    'Gated Property', '24/7 Security', 'CCTV Surveillance',
    'Compound Wall', 'Green Zone', 'Public Transport Access',
    'Gated Entry'
  ];

  // Nearby Access Options
  const nearbyOptions = [
    'National Highway', 'State Highway', 'Toll Plaza', 'Bus Stop',
    'Railway Station', 'Metro Station', 'Airport', 'Industrial Area',
    'Commercial Hub', 'Residential Area', 'Schools & Colleges',
    'Hospitals', 'Bank / ATM', 'Fuel Station', 'Hotels / Restaurants',
    'Logistics Hub'
  ];

  const mainSections = [
    { id: 'basic', label: '📍 Basic', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'price', label: currentTab === 'Rent' ? '💰 Rent' : '💰 Price', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'plot', label: '📐 Plot', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'usage', label: '🏗️ Usage', icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'infrastructure', label: '⚡ Utilities', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'amenities', label: '🎯 Amenities', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ...(currentTab === 'Sell' ? [{ id: 'legal', label: '⚖️ Legal', icon: <Shield className="w-3.5 h-3.5" /> }] : []),
    { id: 'availability', label: '📅 Available', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'nearby', label: '🚌 Nearby', icon: <Bus className="w-3.5 h-3.5" /> },
    ...(currentTab === 'Sell' ? [{ id: 'investment', label: '📈 Investment', icon: <TrendingUp className="w-3.5 h-3.5" /> }] : []),
    { id: 'contact', label: '📞 Contact', icon: <Phone className="w-3.5 h-3.5" /> }
  ];

  const tabs = [
    { id: 'Rent', label: 'Rent', icon: <IndianRupee className="w-3 h-3" /> },
    { id: 'Sell', label: 'Sell', icon: <TrendingUp className="w-3 h-3" /> }
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Highway Facing Plot' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      state: '', city: '', locality: '', villageTown: '', landmark: '', pincode: '',
      highwayType: '', highwayNameNumber: '',
      mainRoadFacing: '', cornerPlot: '', nearbyConnectivity: '',
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
      minSellPrice: '', maxSellPrice: '', sellPriceNegotiable: '', propertyTax: '', maintenanceCharges: '',
      totalPlotArea: '', landAreaUnit: 'sqft', plotLength: '', plotWidth: '',
      frontageWidth: '', highwayFrontageLength: '', roadWidth: '',
      facing: '', boundaryWall: '', landLevel: '', soilType: '', ownershipType: '',
      suitableFor: [],
      landUsage: [],
      investmentHighlights: [],
      infrastructure: [],
      amenities: [],
      titleDeedVerified: '', loanEligible: '', reraApproved: '', dtcpApproved: '',
      cmdaApproved: '', panchayatApproved: '', landConversionApproved: '',
      encumbranceCertificate: '',
      immediateOccupancy: '', readyForRegistration: '', immediatePossession: '', vacantLand: '',
      availableFrom: '', minimumRentalDuration: '',
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
            <input type="text" value="Highway Facing Plot" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
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
          <input type="text" placeholder="State" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.state} onChange={(e) => handleInputChange('state', e.target.value)} />
          <input type="text" placeholder="City / Town" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
          <input type="text" placeholder="Area / Locality" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
          <input type="text" placeholder="Village / Town" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.villageTown} onChange={(e) => handleInputChange('villageTown', e.target.value)} />
          <input type="text" placeholder="Landmark" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
          <input type="text" placeholder="PIN Code" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
          <CustomSelect label="Highway Type" options={highwayTypeOptions} value={filters.highwayType} onChange={(val) => handleInputChange('highwayType', val)} placeholder="Select Highway Type" />
          <input type="text" placeholder="Highway Name / Number" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.highwayNameNumber} onChange={(e) => handleInputChange('highwayNameNumber', e.target.value)} />
          <YesNoRadioGroup label="Main Road Facing" name="mainRoadFacing" value={filters.mainRoadFacing} onChange={(val) => handleRadioChange('mainRoadFacing', val)} />
          <YesNoRadioGroup label="Corner Plot" name="cornerPlot" value={filters.cornerPlot} onChange={(val) => handleRadioChange('cornerPlot', val)} />
          <div className="md:col-span-2">
            <input type="text" placeholder="Nearby Connectivity" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.nearbyConnectivity} onChange={(e) => handleInputChange('nearbyConnectivity', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPriceSection = () => {
    if (currentTab === 'Rent') {
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
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TrendingUp className="w-3.5 h-3.5" /> Price Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min Price (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minSellPrice} onChange={(e) => handleInputChange('minSellPrice', e.target.value)} />
              <input type="number" placeholder="Max Price (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxSellPrice} onChange={(e) => handleInputChange('maxSellPrice', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Price Negotiable" name="sellPriceNegotiable" value={filters.sellPriceNegotiable} onChange={(val) => handleRadioChange('sellPriceNegotiable', val)} />
              <input type="text" placeholder="Property Tax (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.propertyTax} onChange={(e) => handleInputChange('propertyTax', e.target.value)} />
              <input type="text" placeholder="Maintenance Charges (if applicable) (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
            </div>
          </div>
        </div>
      );
    }
  };

  const renderPlotSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><SquareIcon className="w-3.5 h-3.5" /> Plot Details</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2 items-end">
          <input type="text" placeholder="Total Plot Area" className="col-span-1 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.totalPlotArea} onChange={(e) => handleInputChange('totalPlotArea', e.target.value)} />
          <LandAreaUnitSelect value={filters.landAreaUnit} onChange={(val) => handleInputChange('landAreaUnit', val)} />
          <input type="text" placeholder="Length (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotLength} onChange={(e) => handleInputChange('plotLength', e.target.value)} />
          <input type="text" placeholder="Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotWidth} onChange={(e) => handleInputChange('plotWidth', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input type="text" placeholder="Frontage Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.frontageWidth} onChange={(e) => handleInputChange('frontageWidth', e.target.value)} />
          <input type="text" placeholder="Highway Frontage Length (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.highwayFrontageLength} onChange={(e) => handleInputChange('highwayFrontageLength', e.target.value)} />
          <input type="text" placeholder="Road Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          <CustomSelect label="Facing Direction" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <YesNoRadioGroup label="Boundary Wall" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          <CustomSelect label="Land Level" options={landLevelOptions} value={filters.landLevel} onChange={(val) => handleInputChange('landLevel', val)} placeholder="Select Level" />
          <CustomSelect label="Soil Type" options={soilTypeOptions} value={filters.soilType} onChange={(val) => handleInputChange('soilType', val)} placeholder="Select Soil Type" />
          {currentTab === 'Sell' && (
            <CustomSelect label="Ownership Type" options={ownershipTypeOptions} value={filters.ownershipType} onChange={(val) => handleInputChange('ownershipType', val)} placeholder="Select Ownership" />
          )}
        </div>
      </div>
    </div>
  );

  const renderUsageSection = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Building className="w-3.5 h-3.5" /> Suitable For</h3>
          <CheckboxGroup options={suitableForOptions} values={filters.suitableFor} onChange={(val) => handleInputChange('suitableFor', val)} columns={2} />
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Building className="w-3.5 h-3.5" /> Land Usage</h3>
          <CheckboxGroup options={landUsageOptions} values={filters.landUsage} onChange={(val) => handleInputChange('landUsage', val)} columns={2} />
        </div>
      );
    }
  };

  const renderInfrastructureSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Zap className="w-3.5 h-3.5" /> Infrastructure</h3>
      <CheckboxGroup options={infrastructureOptions} values={filters.infrastructure} onChange={(val) => handleInputChange('infrastructure', val)} columns={2} />
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Sparkles className="w-3.5 h-3.5" /> Amenities</h3>
      <CheckboxGroup options={amenitiesOptions} values={filters.amenities} onChange={(val) => handleInputChange('amenities', val)} columns={2} />
    </div>
  );

  const renderLegalSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Shield className="w-3.5 h-3.5" /> Legal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
        <YesNoRadioGroup label="Loan Eligible" name="loanEligible" value={filters.loanEligible} onChange={(val) => handleRadioChange('loanEligible', val)} />
        <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
        <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
        <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
        <YesNoRadioGroup label="Panchayat Approved" name="panchayatApproved" value={filters.panchayatApproved} onChange={(val) => handleRadioChange('panchayatApproved', val)} />
        <YesNoRadioGroup label="Land Conversion Approved" name="landConversionApproved" value={filters.landConversionApproved} onChange={(val) => handleRadioChange('landConversionApproved', val)} />
        <YesNoRadioGroup label="Encumbrance Certificate Available" name="encumbranceCertificate" value={filters.encumbranceCertificate} onChange={(val) => handleRadioChange('encumbranceCertificate', val)} />
      </div>
    </div>
  );

  const renderAvailabilitySection = () => {
    if (currentTab === 'Rent') {
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
            <YesNoRadioGroup label="Ready for Registration" name="readyForRegistration" value={filters.readyForRegistration} onChange={(val) => handleRadioChange('readyForRegistration', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Vacant Land" name="vacantLand" value={filters.vacantLand} onChange={(val) => handleRadioChange('vacantLand', val)} />
          </div>
        </div>
      );
    }
  };

  const renderNearbySection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Bus className="w-3.5 h-3.5" /> Nearby Access</h3>
      <CheckboxGroup options={nearbyOptions} values={filters.nearbyAccess} onChange={(val) => handleInputChange('nearbyAccess', val)} columns={2} />
    </div>
  );

  const renderInvestmentSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TrendingUp className="w-3.5 h-3.5" /> Investment Highlights</h3>
      <CheckboxGroup options={investmentHighlightsOptions} values={filters.investmentHighlights} onChange={(val) => handleInputChange('investmentHighlights', val)} columns={2} />
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
                <HighwayIcon className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-sm">Filter Highway Facing Plot</h3>
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
            {activeMainSection === 'plot' && renderPlotSection()}
            {activeMainSection === 'usage' && renderUsageSection()}
            {activeMainSection === 'infrastructure' && renderInfrastructureSection()}
            {activeMainSection === 'amenities' && renderAmenitiesSection()}
            {activeMainSection === 'legal' && renderLegalSection()}
            {activeMainSection === 'availability' && renderAvailabilitySection()}
            {activeMainSection === 'nearby' && renderNearbySection()}
            {activeMainSection === 'investment' && renderInvestmentSection()}
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

export default HighwayFacingPlotFilter;