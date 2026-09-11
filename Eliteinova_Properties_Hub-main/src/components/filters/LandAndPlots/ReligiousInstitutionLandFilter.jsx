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
  Store, Hotel, Utensils, Stethoscope, School, Fuel,
  ParkingCircle, Heart, Building as BuildingIcon,
  GraduationCap as GradCap, Library, Microscope, Shield as ShieldIcon,
  Church, Cross, HandHeart,
  Heart as HeartIcon, Users as UsersIcon, Coffee, Utensils as UtensilsIcon
} from 'lucide-react';

// Custom Square Icon
const SquareIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
  </svg>
);

// Custom City Icon
const CityIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1" stroke="currentColor"/>
    <path d="M8 6h8M8 10h8M8 14h5M8 18h5" stroke="currentColor"/>
    <path d="M12 6v4" stroke="currentColor"/>
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
    { value: 'cents', label: 'Cents' },
    { value: 'acres', label: 'Acres' }
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

const ReligiousInstitutionLandFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState('Buy');
  const [activeMainSection, setActiveMainSection] = useState('basic');
  
  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    areaType: [],
    // Location Details
    city: '', taluk: '', locality: '', landmark: '', pincode: '',
    mainRoadAccess: '', cornerProperty: '', highwayAccess: '', nearbyConnectivity: '',
    // Price/Rent/Lease/Buy Details
    minBudget: '', maxBudget: '', budgetPerUnit: '', loanRequired: '', priceNegotiable: '',
    minRent: '', maxRent: '', minAnnualRent: '', maxAnnualRent: '', rentPerUnit: '',
    securityDeposit: '', advanceAmount: '', rentNegotiable: '',
    minLeaseAmount: '', maxLeaseAmount: '', leaseRentPerUnit: '', leaseDuration: '', leaseRenewable: '', leaseNegotiable: '',
    maintenanceCharges: '', camCharges: '', propertyTax: '', propertyTaxResponsibility: '',
    // Land Details
    totalLandArea: '', landAreaUnit: 'sqft', developableLandArea: '', usableLandArea: '',
    landShape: '', landLevel: '', facing: '', roadWidth: '', boundaryWall: '', openGatheringSpace: '',
    // Religious Institution Suitability
    religiousSuitability: [],
    // Infrastructure & Utilities
    infrastructureUtilities: [],
    // Facilities & Development Potential
    facilitiesPotential: [],
    // Amenities
    amenities: [],
    // Approval & Legal Details
    pattaAvailable: '', dtcpApproved: '', cmdaApproved: '', religiousApproval: '',
    landConversionApproved: '',
    encumbranceFree: '', loanEligible: '', landSurveyCompleted: '', titleDeedVerified: '',
    rentalAgreementAvailable: '', leaseAgreementAvailable: '',
    // Availability
    immediateOccupancy: '', availableFrom: '', longTermAvailable: '', shortTermAvailable: '',
    vacantLandAvailable: '', institutionReadyLand: '',
    readyToRegister: '', immediatePossession: '', approvedReligiousUse: '',
    immediateLeaseAvailable: '',
    // Nearby Access
    nearbyAccess: [],
    // Development Potential
    developmentPotential: [],
    // Tenant/Buyer Preferences
    tenantPreferences: [],
    buyerPreferences: [],
    // Contact
    contactOwner: false, contactAgent: false, contactTrust: false, contactInstitution: false, preferredContactTime: ''
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

  const areaTypeOptions = [
    { value: 'Urban', label: 'Urban' },
    { value: 'Semi-Urban', label: 'Semi-Urban' },
    { value: 'Rural', label: 'Rural' }
  ];

  const landShapeOptions = [
    { value: 'Rectangular', label: 'Rectangular' },
    { value: 'Square', label: 'Square' },
    { value: 'Irregular', label: 'Irregular' }
  ];

  const landLevelOptions = [
    { value: 'Flat', label: 'Flat' },
    { value: 'Elevated', label: 'Elevated' },
    { value: 'Filled Land', label: 'Filled Land' }
  ];

  const leaseDurationOptions = [
    { value: '1-3', label: '1–3 Years' },
    { value: '3-5', label: '3–5 Years' },
    { value: '5-10', label: '5–10 Years' },
    { value: '10+', label: '10+ Years' }
  ];

  const propertyTaxResponsibilityOptions = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Tenant', label: 'Tenant' },
    { value: 'Shared', label: 'Shared' }
  ];

  const contactTimeOptions = [
    { value: 'Morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'Afternoon', label: 'Afternoon (12 PM - 4 PM)' },
    { value: 'Evening', label: 'Evening (4 PM - 7 PM)' },
    { value: 'Any', label: 'Any Time' }
  ];

  const religiousSuitabilityOptions = [
    'Temple', 'Church', 'Mosque', 'Gurudwara',
    'Jain Temple', 'Buddhist Monastery', 'Ashram',
    'Prayer Hall', 'Spiritual Retreat Center',
    'Meditation Center', 'Religious Training Center',
    'Community Worship Center'
  ];

  const infrastructureUtilitiesOptions = [
    'Water Connection Available', 'Borewell Facility', 'Electricity Connection Available',
    '3-Phase Power Supply', 'Generator Backup Provision', 'Drainage Connection Available',
    'Sewage System Available', 'Internet / Fiber Connectivity',
    'Internal Roads Available', 'Street Lighting Available'
  ];

  const facilitiesPotentialOptions = [
    'Prayer Hall Space', 'Congregation Area', 'Community Hall Space',
    'Dining Hall / Annadhanam Area', 'Guest Accommodation Space',
    'Administrative Office Space', 'Parking Area', 'Open Ground Area',
    'Garden / Landscaped Area', 'Cultural Activity Space'
  ];

  const amenitiesOptions = [
    'Gated Property', 'Security Available', 'CCTV Surveillance',
    'Visitor Parking', 'Drinking Water Facility', 'Restroom Facilities',
    'Wheelchair Accessibility', 'Public Gathering Area'
  ];

  const nearbyOptions = [
    'Residential Area', 'Main Road', 'Bus Stand', 'Railway Station',
    'Metro Station', 'National Highway', 'State Highway', 'Airport',
    'Market Area', 'Community Center'
  ];

  const developmentPotentialOptions = [
    'Religious Hub', 'Pilgrimage Route', 'Spiritual Tourism Area',
    'Residential Growth Area', 'Community Development Zone',
    'Cultural Heritage Zone'
  ];

  const tenantPreferencesOptions = [
    'Religious Trust', 'Temple Administration', 'Church Management',
    'Mosque Committee', 'Gurudwara Management', 'Ashram Management',
    'Spiritual Organization', 'Non-Profit Religious Institution',
    'Religious Service Organization'
  ];

  const buyerPreferencesOptions = [
    'Religious Trust', 'Temple Administration', 'Church Management',
    'Mosque Committee', 'Gurudwara Management', 'Ashram Management',
    'Spiritual Organization', 'Non-Profit Religious Institution',
    'Religious Institution Investor'
  ];

  const mainSections = [
    { id: 'basic', label: '📍 Basic', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'price', label: currentTab === 'Buy' ? '💰 Budget' : currentTab === 'Rent' ? '💰 Rent' : '💰 Lease', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'land', label: '📐 Land', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'religious', label: '🕊️ Religious', icon: <HeartIcon className="w-3.5 h-3.5" /> },
    { id: 'infrastructure', label: '⚡ Utilities', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'facilities', label: '🏛️ Facilities', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'amenities', label: '🎯 Amenities', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'legal', label: '⚖️ Legal', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'availability', label: '📅 Available', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'nearby', label: '🚌 Nearby', icon: <Bus className="w-3.5 h-3.5" /> },
    { id: 'potential', label: '📈 Potential', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'preferences', label: '👥 Preferences', icon: <Users className="w-3.5 h-3.5" /> },
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Religious Institution Land' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      areaType: [],
      city: '', taluk: '', locality: '', landmark: '', pincode: '',
      mainRoadAccess: '', cornerProperty: '', highwayAccess: '', nearbyConnectivity: '',
      minBudget: '', maxBudget: '', budgetPerUnit: '', loanRequired: '', priceNegotiable: '',
      minRent: '', maxRent: '', minAnnualRent: '', maxAnnualRent: '', rentPerUnit: '',
      securityDeposit: '', advanceAmount: '', rentNegotiable: '',
      minLeaseAmount: '', maxLeaseAmount: '', leaseRentPerUnit: '', leaseDuration: '', leaseRenewable: '', leaseNegotiable: '',
      maintenanceCharges: '', camCharges: '', propertyTax: '', propertyTaxResponsibility: '',
      totalLandArea: '', landAreaUnit: 'sqft', developableLandArea: '', usableLandArea: '',
      landShape: '', landLevel: '', facing: '', roadWidth: '', boundaryWall: '', openGatheringSpace: '',
      religiousSuitability: [],
      infrastructureUtilities: [],
      facilitiesPotential: [],
      amenities: [],
      pattaAvailable: '', dtcpApproved: '', cmdaApproved: '', religiousApproval: '',
      landConversionApproved: '',
      encumbranceFree: '', loanEligible: '', landSurveyCompleted: '', titleDeedVerified: '',
      rentalAgreementAvailable: '', leaseAgreementAvailable: '',
      immediateOccupancy: '', availableFrom: '', longTermAvailable: '', shortTermAvailable: '',
      vacantLandAvailable: '', institutionReadyLand: '',
      readyToRegister: '', immediatePossession: '', approvedReligiousUse: '',
      immediateLeaseAvailable: '',
      nearbyAccess: [],
      developmentPotential: [],
      tenantPreferences: [],
      buyerPreferences: [],
      contactOwner: false, contactAgent: false, contactTrust: false, contactInstitution: false, preferredContactTime: ''
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
            <input type="text" value="Religious Institution Land" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Purpose</label>
            <input type="text" value={currentTab} disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-teal-800 font-semibold block mb-1.5">Listing Type</label>
            <div className="flex flex-wrap gap-3">
              {['Owner', 'Agent', 'Trust', 'Institution'].map(type => (
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
          <div className="md:col-span-2">
            <label className="text-xs text-teal-800 font-semibold block mb-1.5">Area Type</label>
            <div className="flex flex-wrap gap-3">
              {areaTypeOptions.map(option => (
                <label key={option.value} className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.areaType.includes(option.value)}
                    onChange={() => handleArrayToggle('areaType', option.value)}
                    className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
                  />
                  <span className="text-xs text-gray-700 group-hover:text-teal-500">{option.label}</span>
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
          <input type="text" placeholder="Taluk / District" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.taluk} onChange={(e) => handleInputChange('taluk', e.target.value)} />
          <input type="text" placeholder="Area / Locality" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
          <input type="text" placeholder="Landmark" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
          <input type="text" placeholder="PIN Code" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
          <input type="text" placeholder="Nearby Connectivity" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.nearbyConnectivity} onChange={(e) => handleInputChange('nearbyConnectivity', e.target.value)} />
          <YesNoRadioGroup label="Main Road Access" name="mainRoadAccess" value={filters.mainRoadAccess} onChange={(val) => handleRadioChange('mainRoadAccess', val)} />
          <YesNoRadioGroup label="Corner Property" name="cornerProperty" value={filters.cornerProperty} onChange={(val) => handleRadioChange('cornerProperty', val)} />
          <YesNoRadioGroup label="Highway Access" name="highwayAccess" value={filters.highwayAccess} onChange={(val) => handleRadioChange('highwayAccess', val)} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minBudget} onChange={(e) => handleInputChange('minBudget', e.target.value)} />
                <input type="number" placeholder="Max Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxBudget} onChange={(e) => handleInputChange('maxBudget', e.target.value)} />
              </div>
              <input type="number" placeholder="Preferred Price Per Sq.ft / Cent / Acre (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.budgetPerUnit} onChange={(e) => handleInputChange('budgetPerUnit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Loan Required" name="loanRequired" value={filters.loanRequired} onChange={(val) => handleRadioChange('loanRequired', val)} />
              <YesNoRadioGroup label="Price Negotiable" name="priceNegotiable" value={filters.priceNegotiable} onChange={(val) => handleRadioChange('priceNegotiable', val)} />
            </div>
          </div>
        </div>
      );
    } else if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><IndianRupee className="w-3.5 h-3.5" /> Rent Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Monthly Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minRent} onChange={(e) => handleInputChange('minRent', e.target.value)} />
                <input type="number" placeholder="Max Monthly Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxRent} onChange={(e) => handleInputChange('maxRent', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Annual Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minAnnualRent} onChange={(e) => handleInputChange('minAnnualRent', e.target.value)} />
                <input type="number" placeholder="Max Annual Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxAnnualRent} onChange={(e) => handleInputChange('maxAnnualRent', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="number" placeholder="Rent Per Sq.ft / Cent / Acre (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.rentPerUnit} onChange={(e) => handleInputChange('rentPerUnit', e.target.value)} />
              <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
              <input type="number" placeholder="Advance Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.advanceAmount} onChange={(e) => handleInputChange('advanceAmount', e.target.value)} />
              <YesNoRadioGroup label="Rent Negotiable" name="rentNegotiable" value={filters.rentNegotiable} onChange={(val) => handleRadioChange('rentNegotiable', val)} />
              <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
              <input type="text" placeholder="Common Area Maintenance (CAM) Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.camCharges} onChange={(e) => handleInputChange('camCharges', e.target.value)} />
              <CustomSelect label="Property Tax Responsibility" options={propertyTaxResponsibilityOptions} value={filters.propertyTaxResponsibility} onChange={(val) => handleInputChange('propertyTaxResponsibility', val)} placeholder="Select" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileText className="w-3.5 h-3.5" /> Lease Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Lease Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
                <input type="number" placeholder="Max Lease Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
              </div>
              <input type="number" placeholder="Lease Rent Per Sq.ft / Cent / Acre (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.leaseRentPerUnit} onChange={(e) => handleInputChange('leaseRentPerUnit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
              <input type="number" placeholder="Advance Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.advanceAmount} onChange={(e) => handleInputChange('advanceAmount', e.target.value)} />
              <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
              <YesNoRadioGroup label="Lease Renewable" name="leaseRenewable" value={filters.leaseRenewable} onChange={(val) => handleRadioChange('leaseRenewable', val)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Lease Negotiable" name="leaseNegotiable" value={filters.leaseNegotiable} onChange={(val) => handleRadioChange('leaseNegotiable', val)} />
              <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
              <input type="text" placeholder="Common Area Maintenance (CAM) Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.camCharges} onChange={(e) => handleInputChange('camCharges', e.target.value)} />
              <CustomSelect label="Property Tax Responsibility" options={propertyTaxResponsibilityOptions} value={filters.propertyTaxResponsibility} onChange={(val) => handleInputChange('propertyTaxResponsibility', val)} placeholder="Select" />
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
          <input type="text" placeholder="Developable Land Area" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.developableLandArea} onChange={(e) => handleInputChange('developableLandArea', e.target.value)} />
          <input type="text" placeholder="Usable Land Area" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.usableLandArea} onChange={(e) => handleInputChange('usableLandArea', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CustomSelect label="Land Shape" options={landShapeOptions} value={filters.landShape} onChange={(val) => handleInputChange('landShape', val)} placeholder="Select Shape" />
          <CustomSelect label="Land Level" options={landLevelOptions} value={filters.landLevel} onChange={(val) => handleInputChange('landLevel', val)} placeholder="Select Level" />
          <CustomSelect label="Facing" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <input type="text" placeholder="Road Width Facing the Property (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          <YesNoRadioGroup label="Boundary Wall Available" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          <YesNoRadioGroup label="Open Gathering Space Available" name="openGatheringSpace" value={filters.openGatheringSpace} onChange={(val) => handleRadioChange('openGatheringSpace', val)} />
        </div>
      </div>
    </div>
  );

  const renderReligiousSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><HeartIcon className="w-3.5 h-3.5" /> Religious Institution Suitability</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {religiousSuitabilityOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.religiousSuitability.includes(option)}
              onChange={() => handleArrayToggle('religiousSuitability', option)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderInfrastructureSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Zap className="w-3.5 h-3.5" /> Infrastructure & Utilities</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {infrastructureUtilitiesOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.infrastructureUtilities.includes(option)}
              onChange={() => handleArrayToggle('infrastructureUtilities', option)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderFacilitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Building2 className="w-3.5 h-3.5" /> Facilities & Development Potential</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {facilitiesPotentialOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.facilitiesPotential.includes(option)}
              onChange={() => handleArrayToggle('facilitiesPotential', option)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Sparkles className="w-3.5 h-3.5" /> Amenities</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {amenitiesOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.amenities.includes(option)}
              onChange={() => handleArrayToggle('amenities', option)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderLegalSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Shield className="w-3.5 h-3.5" /> Approval & Legal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <YesNoRadioGroup label="Patta Available" name="pattaAvailable" value={filters.pattaAvailable} onChange={(val) => handleRadioChange('pattaAvailable', val)} />
        <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
        <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
        <YesNoRadioGroup label="Religious Institution Approval Available" name="religiousApproval" value={filters.religiousApproval} onChange={(val) => handleRadioChange('religiousApproval', val)} />
        <YesNoRadioGroup label="Land Conversion Approved" name="landConversionApproved" value={filters.landConversionApproved} onChange={(val) => handleRadioChange('landConversionApproved', val)} />
        <YesNoRadioGroup label="Encumbrance Free" name="encumbranceFree" value={filters.encumbranceFree} onChange={(val) => handleRadioChange('encumbranceFree', val)} />
        {currentTab === 'Buy' && (
          <YesNoRadioGroup label="Loan Eligible Property Required" name="loanEligible" value={filters.loanEligible} onChange={(val) => handleRadioChange('loanEligible', val)} />
        )}
        <YesNoRadioGroup label="Land Survey Completed" name="landSurveyCompleted" value={filters.landSurveyCompleted} onChange={(val) => handleRadioChange('landSurveyCompleted', val)} />
        <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
        {currentTab === 'Rent' && (
          <YesNoRadioGroup label="Rental Agreement Available" name="rentalAgreementAvailable" value={filters.rentalAgreementAvailable} onChange={(val) => handleRadioChange('rentalAgreementAvailable', val)} />
        )}
        {currentTab === 'Lease' && (
          <YesNoRadioGroup label="Lease Agreement Available" name="leaseAgreementAvailable" value={filters.leaseAgreementAvailable} onChange={(val) => handleRadioChange('leaseAgreementAvailable', val)} />
        )}
      </div>
    </div>
  );

  const renderAvailabilitySection = () => {
    if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability Preference</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Ready to Register" name="readyToRegister" value={filters.readyToRegister} onChange={(val) => handleRadioChange('readyToRegister', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Vacant Land Preferred" name="vacantLandAvailable" value={filters.vacantLandAvailable} onChange={(val) => handleRadioChange('vacantLandAvailable', val)} />
            <YesNoRadioGroup label="Institution-Ready Land Preferred" name="institutionReadyLand" value={filters.institutionReadyLand} onChange={(val) => handleRadioChange('institutionReadyLand', val)} />
            <YesNoRadioGroup label="Approved Religious Use Land Preferred" name="approvedReligiousUse" value={filters.approvedReligiousUse} onChange={(val) => handleRadioChange('approvedReligiousUse', val)} />
          </div>
        </div>
      );
    } else if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Immediate Occupancy" name="immediateOccupancy" value={filters.immediateOccupancy} onChange={(val) => handleRadioChange('immediateOccupancy', val)} />
            <YesNoRadioGroup label="Vacant Land Available" name="vacantLandAvailable" value={filters.vacantLandAvailable} onChange={(val) => handleRadioChange('vacantLandAvailable', val)} />
            <YesNoRadioGroup label="Institution-Ready Land Available" name="institutionReadyLand" value={filters.institutionReadyLand} onChange={(val) => handleRadioChange('institutionReadyLand', val)} />
            <YesNoRadioGroup label="Long-Term Rental Available" name="longTermAvailable" value={filters.longTermAvailable} onChange={(val) => handleRadioChange('longTermAvailable', val)} />
            <YesNoRadioGroup label="Short-Term Rental Available" name="shortTermAvailable" value={filters.shortTermAvailable} onChange={(val) => handleRadioChange('shortTermAvailable', val)} />
            <CustomDatePicker label="Available From Date" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Immediate Lease Available" name="immediateLeaseAvailable" value={filters.immediateLeaseAvailable} onChange={(val) => handleRadioChange('immediateLeaseAvailable', val)} />
            <YesNoRadioGroup label="Vacant Land Available" name="vacantLandAvailable" value={filters.vacantLandAvailable} onChange={(val) => handleRadioChange('vacantLandAvailable', val)} />
            <YesNoRadioGroup label="Institution-Ready Land Available" name="institutionReadyLand" value={filters.institutionReadyLand} onChange={(val) => handleRadioChange('institutionReadyLand', val)} />
            <YesNoRadioGroup label="Approved Religious Use Land Available" name="approvedReligiousUse" value={filters.approvedReligiousUse} onChange={(val) => handleRadioChange('approvedReligiousUse', val)} />
            <YesNoRadioGroup label="Long-Term Lease Available" name="longTermAvailable" value={filters.longTermAvailable} onChange={(val) => handleRadioChange('longTermAvailable', val)} />
            <YesNoRadioGroup label="Short-Term Lease Available" name="shortTermAvailable" value={filters.shortTermAvailable} onChange={(val) => handleRadioChange('shortTermAvailable', val)} />
            <CustomDatePicker label="Available From Date" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
          </div>
        </div>
      );
    }
  };

  const renderNearbySection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Bus className="w-3.5 h-3.5" /> Nearby Access</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {nearbyOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.nearbyAccess.includes(option)}
              onChange={() => handleArrayToggle('nearbyAccess', option)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderPotentialSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TrendingUp className="w-3.5 h-3.5" /> Development Potential</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {developmentPotentialOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.developmentPotential.includes(option)}
              onChange={() => handleArrayToggle('developmentPotential', option)}
              className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
            />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderPreferencesSection = () => {
    if (currentTab === 'Rent' || currentTab === 'Lease') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Users className="w-3.5 h-3.5" /> Tenant Preferences</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {tenantPreferencesOptions.map(option => (
              <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.tenantPreferences.includes(option)}
                  onChange={() => handleArrayToggle('tenantPreferences', option)}
                  className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
                />
                <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Users className="w-3.5 h-3.5" /> Buyer Preferences</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {buyerPreferencesOptions.map(option => (
              <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.buyerPreferences.includes(option)}
                  onChange={() => handleArrayToggle('buyerPreferences', option)}
                  className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500"
                />
                <span className="text-xs text-gray-700 group-hover:text-teal-500">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }
  };

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
            <input type="checkbox" checked={filters.contactTrust} onChange={(e) => handleCheckboxChange('contactTrust', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Contact Trust</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactInstitution} onChange={(e) => handleCheckboxChange('contactInstitution', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Contact Institution</span>
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
                <HeartIcon className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-sm">Filter Religious Institution Land</h3>
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
            {activeMainSection === 'religious' && renderReligiousSection()}
            {activeMainSection === 'infrastructure' && renderInfrastructureSection()}
            {activeMainSection === 'facilities' && renderFacilitiesSection()}
            {activeMainSection === 'amenities' && renderAmenitiesSection()}
            {activeMainSection === 'legal' && renderLegalSection()}
            {activeMainSection === 'availability' && renderAvailabilitySection()}
            {activeMainSection === 'nearby' && renderNearbySection()}
            {activeMainSection === 'potential' && renderPotentialSection()}
            {activeMainSection === 'preferences' && renderPreferencesSection()}
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

export default ReligiousInstitutionLandFilter;