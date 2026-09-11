import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronDown, Building, MapPin, IndianRupee, Ruler, Shield,
  Phone, FileText, RefreshCw, DollarSign, Calendar, Zap,
  Square, Home, Bus, CheckCircle, Clock, Wifi, Camera,
  Trees as TreesIcon, Users, ShieldCheck, FileCheck, Truck, Store,
  Factory, Hotel, Briefcase, ShoppingBag, Fuel, Warehouse, Building2,
  Server, Network, Database, Globe, Cpu, Sun, Mountain, Waves, Eye,
  Leaf, Coffee, Tent, Compass, TreePine, Flower2,
  Sprout, Wind, Droplets, Binoculars, Layout, Grid,
  Layers, School, Hospital, ShoppingCart, Lamp,
  Landmark, Droplet, Wind as WindIcon, Tractor, Egg, ShieldAlert,
  Power, Fan, Fence, Car, Building as BuildingIcon
} from 'lucide-react';

// Custom Icons for missing exports
const FarmIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12h16" stroke="currentColor" strokeLinecap="round"/>
    <path d="M12 4v16" stroke="currentColor" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="8" stroke="currentColor"/>
    <path d="M8 8l4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChickenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 20v-4c0-2 2-4 4-4h8c2 0 4 2 4 4v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12v3" stroke="currentColor" strokeLinecap="round"/>
    <path d="M10 15h4" stroke="currentColor" strokeLinecap="round"/>
    <path d="M8 8l-2-2" stroke="currentColor" strokeLinecap="round"/>
    <path d="M16 8l2-2" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

const EggIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="12" rx="6" ry="9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3v2" stroke="currentColor" strokeLinecap="round"/>
    <path d="M12 7v2" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

const FeedIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 10h16" stroke="currentColor" strokeLinecap="round"/>
    <path d="M6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6h8" stroke="currentColor" strokeLinecap="round"/>
    <path d="M8 6l2-3h4l2 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Custom Square Icon
const SquareIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
  </svg>
);

// Custom Date Picker
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

// Area Unit Select
const AreaUnitSelect = ({ value, onChange }) => {
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

// Yes/No Radio Group
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

// Radio Group
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

// Checkbox Group
const CheckboxGroup = ({ label, options, values, onChange, columns = 2 }) => (
  <div>
    {label && <label className="text-xs text-teal-800 font-semibold block mb-1.5">{label}</label>}
    <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-1.5`}>
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

const PoultryFarmLandFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [activeMainSection, setActiveMainSection] = useState('basic');

  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location
    state: '', city: '', area: '', village: '', landmark: '', pincode: '',
    mainRoadFacing: '', cornerLand: '', highwayAccess: '', nearbyConnectivity: '',
    // Rent
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncludedRent: '', rentNegotiable: '',
    // Buy
    minBudget: '', maxBudget: '', priceNegotiable: '', loanRequired: '',
    maintenanceCharges: '', propertyTax: '',
    // Lease
    minLeaseRent: '', maxLeaseRent: '', annualLeaseRent: '', securityDepositLease: '',
    leaseDuration: '', leaseNegotiable: '', propertyTaxResponsibility: '',
    leaseMaintenanceCharges: '', availableFromLease: '',
    // Land Details
    totalArea: '', areaUnit: 'sqft', farmArea: '', landLength: '', landWidth: '',
    frontageWidth: '', roadWidth: '', facing: '', boundaryWall: '',
    landLevel: '', soilType: '', ownershipType: '',
    // Preferred Farm Type
    preferredFarmType: [],
    // Infrastructure
    electricityConnection: false, threePhasePower: false, waterSupply: false,
    borewell: false, irrigationFacility: false, internalRoads: false,
    workerAccommodation: false, storageArea: false,
    // Lease specific infrastructure
    drainage: false, sewageConnection: false, internetConnectivity: false,
    // Amenities
    security247: false, cctvSurveillance: false, compoundWall: false,
    parkingArea: false, staffQuarters: false, solarPower: false,
    // Lease specific amenities
    gatedProperty: '', rainwaterHarvesting: false,
    // Legal Requirements
    titleDeedVerified: '', loanEligible: '', agriculturalLandCertificate: '',
    poultryFarmLicense: '', pollutionControlClearance: '',
    encumbranceCertificate: '',
    // Legal for Rent
    rentalAgreementReady: '',
    // Legal for Lease
    commercialLeaseAllowed: '', agriculturalLeaseAllowed: '',
    livestockFarmingApproved: '', renewableLease: '', subleaseAllowed: '',
    panchayatApproved: '', environmentalClearance: '',
    // Availability
    readyForRegistration: '', immediatePossession: '',
    operationalFarm: '', vacantLand: '',
    immediateOccupancy: '', availableFrom: '', minRentalDuration: '',
    availableImmediately: '', readyForLease: '', shortTermLease: '',
    longTermLease: '', operationalFarmLease: '', vacantAgriculturalLand: '',
    // Poultry Farm Features (Lease)
    poultryFarmFeatures: [],
    // Suitable For (Rent)
    suitableFor: [],
    // Nearby Access
    nearbyAccess: [],
    // Contact
    contactOwner: false, contactAgent: false, contactBuilder: false, contactDeveloper: false,
    preferredContactTime: ''
  });

  // Options arrays
  const facingOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' }
  ];

  const landLevelOptions = [
    { value: 'Flat', label: 'Flat' },
    { value: 'Elevated', label: 'Elevated' },
    { value: 'Low Lying', label: 'Low Lying' }
  ];

  const soilTypeOptions = [
    { value: 'Clay', label: 'Clay' },
    { value: 'Sandy', label: 'Sandy' },
    { value: 'Loamy', label: 'Loamy' },
    { value: 'Mixed', label: 'Mixed' },
    { value: 'Rocky', label: 'Rocky' }
  ];

  const ownershipTypeOptions = [
    { value: 'Freehold', label: 'Freehold' },
    { value: 'Leasehold', label: 'Leasehold' }
  ];

  const preferredFarmTypeOptions = [
    'Broiler Farm', 'Layer Farm', 'Hatchery', 'Country Chicken Farm',
    'Organic Poultry Farm', 'Turkey Farm', 'Duck Farm', 'Feed Production Unit',
    'Integrated Farm'
  ];

  const suitableForOptions = [
    'Broiler Farming', 'Layer Farming', 'Country Chicken Farming',
    'Hatchery', 'Feed Storage', 'Poultry Feed Production',
    'Integrated Farming', 'Livestock Farming'
  ];

  const poultryFarmFeaturesOptions = [
    'Existing Poultry Shed', 'Broiler Farm Setup', 'Layer Farm Setup',
    'Hatchery Facility', 'Chick Brooding Area', 'Feed Storage Godown',
    'Egg Collection Room', 'Processing Unit', 'Waste Disposal System',
    'Biosecurity Zone', 'Ventilation System', 'Water Storage Tank',
    'Borewell Available', 'Generator Backup', 'Fencing Available'
  ];

  const nearbyOptions = {
    buy: [
      'Highway Access', 'Main Road', 'Veterinary Hospital', 'Feed Suppliers',
      'Livestock Market', 'Bus Stop', 'Railway Station', 'Market Area',
      'Bank / ATM', 'Cold Storage Facility'
    ],
    rent: [
      'Highway Access', 'Main Road', 'Veterinary Hospital', 'Feed Suppliers',
      'Livestock Market', 'Bus Stop', 'Railway Station', 'Market Area',
      'Bank / ATM', 'Cold Storage Facility'
    ],
    lease: [
      'Highway Access', 'Main Road', 'Feed Suppliers', 'Veterinary Hospital',
      'Poultry Medicine Store', 'Poultry Market', 'Bus Stop', 'Railway Station',
      'Airport', 'Agricultural Market', 'Bank / ATM'
    ]
  };

  const leaseDurationOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '1 Year' },
    { value: '24', label: '2 Years' },
    { value: '36', label: '3 Years' },
    { value: '60', label: '5 Years' }
  ];

  const rentalDurationOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '11', label: '11 Months' },
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' },
    { value: '36', label: '36 Months' }
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

  const mainSections = [
    { id: 'basic', label: '📍 Basic', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'price', label: currentTab === 'Rent' ? '💰 Rent' : currentTab === 'Buy' ? '💰 Budget' : '💰 Lease', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'land', label: '📐 Land', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'farmtype', label: '🐔 Farm Type', icon: <ChickenIcon className="w-3.5 h-3.5" /> },
    { id: 'infrastructure', label: '⚡ Infrastructure', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'amenities', label: '🏘️ Amenities', icon: <TreesIcon className="w-3.5 h-3.5" /> },
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

  const applyFilters = () => {
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Poultry Farm Land' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      state: '', city: '', area: '', village: '', landmark: '', pincode: '',
      mainRoadFacing: '', cornerLand: '', highwayAccess: '', nearbyConnectivity: '',
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncludedRent: '', rentNegotiable: '',
      minBudget: '', maxBudget: '', priceNegotiable: '', loanRequired: '',
      maintenanceCharges: '', propertyTax: '',
      minLeaseRent: '', maxLeaseRent: '', annualLeaseRent: '', securityDepositLease: '',
      leaseDuration: '', leaseNegotiable: '', propertyTaxResponsibility: '',
      leaseMaintenanceCharges: '', availableFromLease: '',
      totalArea: '', areaUnit: 'sqft', farmArea: '', landLength: '', landWidth: '',
      frontageWidth: '', roadWidth: '', facing: '', boundaryWall: '',
      landLevel: '', soilType: '', ownershipType: '',
      preferredFarmType: [],
      electricityConnection: false, threePhasePower: false, waterSupply: false,
      borewell: false, irrigationFacility: false, internalRoads: false,
      workerAccommodation: false, storageArea: false,
      drainage: false, sewageConnection: false, internetConnectivity: false,
      security247: false, cctvSurveillance: false, compoundWall: false,
      parkingArea: false, staffQuarters: false, solarPower: false,
      gatedProperty: '', rainwaterHarvesting: false,
      titleDeedVerified: '', loanEligible: '', agriculturalLandCertificate: '',
      poultryFarmLicense: '', pollutionControlClearance: '',
      encumbranceCertificate: '',
      rentalAgreementReady: '',
      commercialLeaseAllowed: '', agriculturalLeaseAllowed: '',
      livestockFarmingApproved: '', renewableLease: '', subleaseAllowed: '',
      panchayatApproved: '', environmentalClearance: '',
      readyForRegistration: '', immediatePossession: '',
      operationalFarm: '', vacantLand: '',
      immediateOccupancy: '', availableFrom: '', minRentalDuration: '',
      availableImmediately: '', readyForLease: '', shortTermLease: '',
      longTermLease: '', operationalFarmLease: '', vacantAgriculturalLand: '',
      poultryFarmFeatures: [],
      suitableFor: [],
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Property Type</label>
            <input type="text" value="Poultry Farm Land" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Purpose</label>
            <input type="text" value={currentTab} disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-teal-800 font-semibold block mb-1.5">Listing Type</label>
            <div className="flex flex-wrap gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <input type="text" placeholder="State" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.state} onChange={(e) => handleInputChange('state', e.target.value)} />
          <input type="text" placeholder="City" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
          <input type="text" placeholder="Area / Locality" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.area} onChange={(e) => handleInputChange('area', e.target.value)} />
          <input type="text" placeholder="Village / Town" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.village} onChange={(e) => handleInputChange('village', e.target.value)} />
          <input type="text" placeholder="Landmark" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
          <input type="text" placeholder="PIN Code" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
          <YesNoRadioGroup label="Main Road Facing" name="mainRoadFacing" value={filters.mainRoadFacing} onChange={(val) => handleRadioChange('mainRoadFacing', val)} />
          <YesNoRadioGroup label="Corner Land" name="cornerLand" value={filters.cornerLand} onChange={(val) => handleRadioChange('cornerLand', val)} />
          <YesNoRadioGroup label="Highway Access" name="highwayAccess" value={filters.highwayAccess} onChange={(val) => handleRadioChange('highwayAccess', val)} />
          <input type="text" placeholder="Nearby Connectivity" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.nearbyConnectivity} onChange={(e) => handleInputChange('nearbyConnectivity', e.target.value)} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minRent} onChange={(e) => handleInputChange('minRent', e.target.value)} />
                <input type="number" placeholder="Max Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxRent} onChange={(e) => handleInputChange('maxRent', e.target.value)} />
              </div>
              <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <YesNoRadioGroup label="Maintenance Charges Included" name="maintenanceIncludedRent" value={filters.maintenanceIncludedRent} onChange={(val) => handleRadioChange('maintenanceIncludedRent', val)} />
              <YesNoRadioGroup label="Rent Negotiable" name="rentNegotiable" value={filters.rentNegotiable} onChange={(val) => handleRadioChange('rentNegotiable', val)} />
            </div>
          </div>
        </div>
      );
    } else if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><DollarSign className="w-3.5 h-3.5" /> Budget Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minBudget} onChange={(e) => handleInputChange('minBudget', e.target.value)} />
                <input type="number" placeholder="Max Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxBudget} onChange={(e) => handleInputChange('maxBudget', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <YesNoRadioGroup label="Price Negotiable" name="priceNegotiable" value={filters.priceNegotiable} onChange={(val) => handleRadioChange('priceNegotiable', val)} />
              <YesNoRadioGroup label="Loan Required" name="loanRequired" value={filters.loanRequired} onChange={(val) => handleRadioChange('loanRequired', val)} />
              <input type="text" placeholder="Property Tax (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.propertyTax} onChange={(e) => handleInputChange('propertyTax', e.target.value)} />
              <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileText className="w-3.5 h-3.5" /> Lease Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Lease Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minLeaseRent} onChange={(e) => handleInputChange('minLeaseRent', e.target.value)} />
                <input type="number" placeholder="Max Lease Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxLeaseRent} onChange={(e) => handleInputChange('maxLeaseRent', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <input type="number" placeholder="Annual Lease Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.annualLeaseRent} onChange={(e) => handleInputChange('annualLeaseRent', e.target.value)} />
              <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDepositLease} onChange={(e) => handleInputChange('securityDepositLease', e.target.value)} />
              <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
              <CustomSelect label="Property Tax Responsibility" options={propertyTaxResponsibilityOptions} value={filters.propertyTaxResponsibility} onChange={(val) => handleInputChange('propertyTaxResponsibility', val)} placeholder="Select" />
              <YesNoRadioGroup label="Lease Negotiable" name="leaseNegotiable" value={filters.leaseNegotiable} onChange={(val) => handleRadioChange('leaseNegotiable', val)} />
              <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.leaseMaintenanceCharges} onChange={(e) => handleInputChange('leaseMaintenanceCharges', e.target.value)} />
              <CustomDatePicker label="Available From" value={filters.availableFromLease} onChange={(val) => handleInputChange('availableFromLease', val)} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex gap-2 items-center min-w-0 overflow-hidden">
            <input type="text" placeholder="Total Land Area" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.totalArea} onChange={(e) => handleInputChange('totalArea', e.target.value)} />
            <AreaUnitSelect value={filters.areaUnit} onChange={(val) => handleInputChange('areaUnit', val)} />
          </div>
          <input type="text" placeholder="Farm Area" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.farmArea} onChange={(e) => handleInputChange('farmArea', e.target.value)} />
          <div className="flex gap-2 min-w-0 overflow-hidden">
            <input type="text" placeholder="Length (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landLength} onChange={(e) => handleInputChange('landLength', e.target.value)} />
            <input type="text" placeholder="Width (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landWidth} onChange={(e) => handleInputChange('landWidth', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <input type="text" placeholder="Frontage Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.frontageWidth} onChange={(e) => handleInputChange('frontageWidth', e.target.value)} />
          <input type="text" placeholder="Road Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          <CustomSelect label="Facing Direction" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <YesNoRadioGroup label="Boundary Wall / Fencing" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          <CustomSelect label="Land Level" options={landLevelOptions} value={filters.landLevel} onChange={(val) => handleInputChange('landLevel', val)} placeholder="Select Level" />
          <CustomSelect label="Soil Type" options={soilTypeOptions} value={filters.soilType} onChange={(val) => handleInputChange('soilType', val)} placeholder="Select Soil Type" />
          <CustomSelect label="Ownership Type" options={ownershipTypeOptions} value={filters.ownershipType} onChange={(val) => handleInputChange('ownershipType', val)} placeholder="Select Ownership" />
        </div>
      </div>
    </div>
  );

  const renderFarmTypeSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><ChickenIcon className="w-3.5 h-3.5" /> Preferred Farm Type</h3>
      {currentTab === 'Rent' ? (
        <CheckboxGroup 
          options={suitableForOptions} 
          values={filters.suitableFor} 
          onChange={(val) => handleInputChange('suitableFor', val)} 
          columns={2} 
        />
      ) : (
        <CheckboxGroup 
          options={preferredFarmTypeOptions} 
          values={filters.preferredFarmType} 
          onChange={(val) => handleInputChange('preferredFarmType', val)} 
          columns={2} 
        />
      )}
      {currentTab === 'Lease' && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-teal-800 mb-1.5">Poultry Farm Features</h4>
          <CheckboxGroup 
            options={poultryFarmFeaturesOptions} 
            values={filters.poultryFarmFeatures} 
            onChange={(val) => handleInputChange('poultryFarmFeatures', val)} 
            columns={2} 
          />
        </div>
      )}
    </div>
  );

  const renderInfrastructureSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Zap className="w-3.5 h-3.5" /> Infrastructure</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.electricityConnection} onChange={(e) => handleCheckboxChange('electricityConnection', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Electricity Connection</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.threePhasePower} onChange={(e) => handleCheckboxChange('threePhasePower', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Three-Phase Power</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.waterSupply} onChange={(e) => handleCheckboxChange('waterSupply', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Water Supply</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.borewell} onChange={(e) => handleCheckboxChange('borewell', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Borewell Available</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.irrigationFacility} onChange={(e) => handleCheckboxChange('irrigationFacility', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Irrigation Facility</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.internalRoads} onChange={(e) => handleCheckboxChange('internalRoads', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Internal Roads</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.workerAccommodation} onChange={(e) => handleCheckboxChange('workerAccommodation', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Worker Accommodation</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.storageArea} onChange={(e) => handleCheckboxChange('storageArea', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Storage Area</span>
          </label>
          {currentTab !== 'Buy' && (
            <>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="checkbox" checked={filters.drainage} onChange={(e) => handleCheckboxChange('drainage', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
                <span className="text-xs text-gray-700 group-hover:text-teal-500">Drainage Facility</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="checkbox" checked={filters.internetConnectivity} onChange={(e) => handleCheckboxChange('internetConnectivity', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
                <span className="text-xs text-gray-700 group-hover:text-teal-500">Internet / Fiber Connectivity</span>
              </label>
            </>
          )}
          {currentTab === 'Lease' && (
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.sewageConnection} onChange={(e) => handleCheckboxChange('sewageConnection', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
              <span className="text-xs text-gray-700 group-hover:text-teal-500">Sewage System</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TreesIcon className="w-3.5 h-3.5" /> Amenities</h3>
      <div className="space-y-2">
        {currentTab === 'Lease' && (
          <YesNoRadioGroup label="Gated Property" name="gatedProperty" value={filters.gatedProperty} onChange={(val) => handleRadioChange('gatedProperty', val)} />
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.security247} onChange={(e) => handleCheckboxChange('security247', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">24/7 Security</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.cctvSurveillance} onChange={(e) => handleCheckboxChange('cctvSurveillance', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">CCTV Surveillance</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.compoundWall} onChange={(e) => handleCheckboxChange('compoundWall', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">{currentTab === 'Rent' ? 'Compound Wall / Fencing' : 'Compound Wall'}</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.parkingArea} onChange={(e) => handleCheckboxChange('parkingArea', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Parking Area</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.staffQuarters} onChange={(e) => handleCheckboxChange('staffQuarters', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Staff Quarters</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.solarPower} onChange={(e) => handleCheckboxChange('solarPower', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Solar Power Option</span>
          </label>
          {currentTab === 'Lease' && (
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.rainwaterHarvesting} onChange={(e) => handleCheckboxChange('rainwaterHarvesting', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
              <span className="text-xs text-gray-700 group-hover:text-teal-500">Rainwater Harvesting</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );

  const renderLegalSection = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Shield className="w-3.5 h-3.5" /> Legal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
            <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
            <YesNoRadioGroup label="Agricultural Land Certificate" name="agriculturalLandCertificate" value={filters.agriculturalLandCertificate} onChange={(val) => handleRadioChange('agriculturalLandCertificate', val)} />
            <YesNoRadioGroup label="Poultry Farm License" name="poultryFarmLicense" value={filters.poultryFarmLicense} onChange={(val) => handleRadioChange('poultryFarmLicense', val)} />
            <YesNoRadioGroup label="Pollution Control Clearance" name="pollutionControlClearance" value={filters.pollutionControlClearance} onChange={(val) => handleRadioChange('pollutionControlClearance', val)} />
            <YesNoRadioGroup label="Encumbrance Certificate Available" name="encumbranceCertificate" value={filters.encumbranceCertificate} onChange={(val) => handleRadioChange('encumbranceCertificate', val)} />
            <YesNoRadioGroup label="Rental Agreement Ready" name="rentalAgreementReady" value={filters.rentalAgreementReady} onChange={(val) => handleRadioChange('rentalAgreementReady', val)} />
          </div>
        </div>
      );
    } else if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><ShieldCheck className="w-3.5 h-3.5" /> Legal Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
            <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
            <YesNoRadioGroup label="Loan Eligible" name="loanEligible" value={filters.loanEligible} onChange={(val) => handleRadioChange('loanEligible', val)} />
            <YesNoRadioGroup label="Agricultural Land Certificate" name="agriculturalLandCertificate" value={filters.agriculturalLandCertificate} onChange={(val) => handleRadioChange('agriculturalLandCertificate', val)} />
            <YesNoRadioGroup label="Poultry Farm License" name="poultryFarmLicense" value={filters.poultryFarmLicense} onChange={(val) => handleRadioChange('poultryFarmLicense', val)} />
            <YesNoRadioGroup label="Pollution Control Clearance" name="pollutionControlClearance" value={filters.pollutionControlClearance} onChange={(val) => handleRadioChange('pollutionControlClearance', val)} />
            <YesNoRadioGroup label="Encumbrance Certificate Available" name="encumbranceCertificate" value={filters.encumbranceCertificate} onChange={(val) => handleRadioChange('encumbranceCertificate', val)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileText className="w-3.5 h-3.5" /> Legal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
            <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
            <YesNoRadioGroup label="Commercial Lease Allowed" name="commercialLeaseAllowed" value={filters.commercialLeaseAllowed} onChange={(val) => handleRadioChange('commercialLeaseAllowed', val)} />
            <YesNoRadioGroup label="Agricultural Lease Allowed" name="agriculturalLeaseAllowed" value={filters.agriculturalLeaseAllowed} onChange={(val) => handleRadioChange('agriculturalLeaseAllowed', val)} />
            <YesNoRadioGroup label="Livestock Farming Approved" name="livestockFarmingApproved" value={filters.livestockFarmingApproved} onChange={(val) => handleRadioChange('livestockFarmingApproved', val)} />
            <YesNoRadioGroup label="Renewable Lease" name="renewableLease" value={filters.renewableLease} onChange={(val) => handleRadioChange('renewableLease', val)} />
            <YesNoRadioGroup label="Sublease Allowed" name="subleaseAllowed" value={filters.subleaseAllowed} onChange={(val) => handleRadioChange('subleaseAllowed', val)} />
            <YesNoRadioGroup label="Pollution Control Clearance" name="pollutionControlClearance" value={filters.pollutionControlClearance} onChange={(val) => handleRadioChange('pollutionControlClearance', val)} />
            <YesNoRadioGroup label="Panchayat Approved" name="panchayatApproved" value={filters.panchayatApproved} onChange={(val) => handleRadioChange('panchayatApproved', val)} />
            <YesNoRadioGroup label="Environmental Clearance" name="environmentalClearance" value={filters.environmentalClearance} onChange={(val) => handleRadioChange('environmentalClearance', val)} />
            <YesNoRadioGroup label="Encumbrance Certificate Available" name="encumbranceCertificate" value={filters.encumbranceCertificate} onChange={(val) => handleRadioChange('encumbranceCertificate', val)} />
          </div>
        </div>
      );
    }
  };

  const renderAvailabilitySection = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Immediate Occupancy" name="immediateOccupancy" value={filters.immediateOccupancy} onChange={(val) => handleRadioChange('immediateOccupancy', val)} />
            {filters.immediateOccupancy === 'No' && (
              <CustomDatePicker label="Available From" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            )}
            <CustomSelect label="Minimum Rental Duration" options={rentalDurationOptions} value={filters.minRentalDuration} onChange={(val) => handleInputChange('minRentalDuration', val)} placeholder="Select Duration" />
          </div>
        </div>
      );
    } else if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Ready for Registration" name="readyForRegistration" value={filters.readyForRegistration} onChange={(val) => handleRadioChange('readyForRegistration', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Operational Farm" name="operationalFarm" value={filters.operationalFarm} onChange={(val) => handleRadioChange('operationalFarm', val)} />
            <YesNoRadioGroup label="Vacant Land" name="vacantLand" value={filters.vacantLand} onChange={(val) => handleRadioChange('vacantLand', val)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Available Immediately" name="availableImmediately" value={filters.availableImmediately} onChange={(val) => handleRadioChange('availableImmediately', val)} />
            <YesNoRadioGroup label="Ready for Lease" name="readyForLease" value={filters.readyForLease} onChange={(val) => handleRadioChange('readyForLease', val)} />
            <YesNoRadioGroup label="Short-Term Lease Available" name="shortTermLease" value={filters.shortTermLease} onChange={(val) => handleRadioChange('shortTermLease', val)} />
            <YesNoRadioGroup label="Long-Term Lease Available" name="longTermLease" value={filters.longTermLease} onChange={(val) => handleRadioChange('longTermLease', val)} />
            <YesNoRadioGroup label="Operational Poultry Farm" name="operationalFarmLease" value={filters.operationalFarmLease} onChange={(val) => handleRadioChange('operationalFarmLease', val)} />
            <YesNoRadioGroup label="Vacant Agricultural Land" name="vacantAgriculturalLand" value={filters.vacantAgriculturalLand} onChange={(val) => handleRadioChange('vacantAgriculturalLand', val)} />
          </div>
        </div>
      );
    }
  };

  const renderNearbySection = () => {
    const options = nearbyOptions[currentTab.toLowerCase()] || nearbyOptions.buy;
    return (
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Bus className="w-3.5 h-3.5" /> Nearby Access</h3>
        <CheckboxGroup options={options} values={filters.nearbyAccess} onChange={(val) => handleInputChange('nearbyAccess', val)} columns={2} />
      </div>
    );
  };

  const renderContactSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Phone className="w-3.5 h-3.5" /> Contact Preference</h3>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactOwner} onChange={(e) => handleCheckboxChange('contactOwner', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Owner</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactAgent} onChange={(e) => handleCheckboxChange('contactAgent', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Agent</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactBuilder} onChange={(e) => handleCheckboxChange('contactBuilder', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Builder</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.contactDeveloper} onChange={(e) => handleCheckboxChange('contactDeveloper', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 font-medium group-hover:text-teal-500">Developer</span>
          </label>
        </div>
        <CustomSelect label="Preferred Contact Time" options={contactTimeOptions} value={filters.preferredContactTime} onChange={(val) => handleInputChange('preferredContactTime', val)} placeholder="Select Time" />
      </div>
    </div>
  );

  const animationStyle = `
    @keyframes slowRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .slow-rotate {
      animation: slowRotate 4s linear infinite;
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div className="bg-white rounded-xl shadow-xl border border-teal-100 overflow-hidden flex flex-col" style={{ maxHeight: '85vh', width: '100%', maxWidth: '900px' }}>
        <div className="sticky top-0 z-10 bg-white border-b border-teal-100">
          <div className="flex justify-between items-center px-3 py-2 bg-gradient-to-r from-teal-600 to-emerald-700">
            <div className="flex items-center gap-2">
              <div className="p-0.5 bg-white/20 rounded">
                <ChickenIcon className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-lg">Filter Poultry Farm Land</h3>
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
            {activeMainSection === 'farmtype' && renderFarmTypeSection()}
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

export default PoultryFarmLandFilter;