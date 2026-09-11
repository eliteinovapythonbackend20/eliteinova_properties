import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronDown, Building, MapPin, IndianRupee, Ruler, Shield,
  Phone, FileText, RefreshCw, DollarSign, Calendar, Zap,
  Square, Home, Bus, CheckCircle, TrendingUp, Clock, Wifi, Camera,
  Trees as TreesIcon, Users, ShieldCheck, FileCheck, Truck, Store,
  Factory, Hotel, Briefcase, ShoppingBag, Fuel, Warehouse, Building2,
  Server, Network, Database, Globe, Cpu, Sun, Mountain, Waves, Eye,
  Leaf, Coffee, Tent
} from 'lucide-react';

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

const RiversideLandFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [activeMainSection, setActiveMainSection] = useState('basic');

  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location
    state: '', city: '', area: '', village: '', landmark: '', pincode: '', 
    riverName: '', distanceToRiver: '', riverFacing: '', mainRoadFacing: '', 
    cornerPlot: '', gatedCommunity: '', nearbyConnectivity: '',
    // Rent
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncludedRent: '', rentNegotiable: '',
    // Buy
    minBudget: '', maxBudget: '', priceNegotiable: '', loanRequired: '', 
    maintenanceCharges: '', propertyTax: '',
    // Lease
    minLeaseRent: '', maxLeaseRent: '', annualLeaseRent: '', securityDepositLease: '', 
    leaseDuration: '', leaseNegotiable: '', propertyTaxResponsibility: '', 
    leaseMaintenanceCharges: '', availableFromLease: '',
    // Plot Details - Common
    totalArea: '', areaUnit: 'sqft', plotLength: '', plotWidth: '', 
    frontageWidth: '', roadWidth: '', facing: '', boundaryWall: '', 
    landLevel: '', soilType: '', ownershipType: '',
    // View & Location Features
    riverView: '', viewType: [],
    // Preferred Usage / Suitable For
    preferredUsage: [],
    // Infrastructure
    electricityConnection: false, waterSupply: false, borewell: false, 
    drainage: false, sewageConnection: false, internalRoads: false, 
    streetLights: false, internetConnectivity: false,
    // Amenities
    gatedCommunityAmenity: '', security247: false, cctvSurveillance: false, 
    clubHouse: false, childrensPark: false, walkingTrack: false, 
    landscapedGarden: false, visitorParking: false, rainwaterHarvesting: false,
    // Legal Requirements (Buy & Sell)
    titleDeedVerified: '', loanEligible: '', reraApproved: '', 
    dtcpApproved: '', cmdaApproved: '', panchayatApproved: '', 
    encumbranceCertificate: '',
    // Legal for Rent
    rentalAgreementReady: '',
    // Legal for Lease
    commercialLeaseAllowed: '', resortDevelopmentAllowed: '', 
    subleaseAllowed: '', renewableLease: '',
    // Availability
    readyForRegistration: '', immediatePossession: '', vacantPlot: '',
    immediateOccupancy: '', availableFrom: '', minRentalDuration: '',
    availableImmediately: '', readyForLease: '', shortTermLease: '', 
    longTermLease: '', vacantPlotLease: '',
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
    { value: 'Mixed', label: 'Mixed' }
  ];

  const ownershipTypeOptions = [
    { value: 'Freehold', label: 'Freehold' },
    { value: 'Leasehold', label: 'Leasehold' }
  ];

  const riverViewOptions = [
    { value: 'Direct', label: 'Direct River View' },
    { value: 'Partial', label: 'Partial River View' },
    { value: 'Waterfront', label: 'Waterfront Plot' }
  ];

  const viewTypeOptions = [
    'Direct River View', 'Partial River View', 'River Access', 
    'Waterfront Property', 'Garden View', 'Green Belt View',
    'Mountain View', 'Sunrise View', 'Sunset View'
  ];

  const preferredUsageOptions = {
    buy: [
      'Residential House', 'Luxury Villa', 'Farm House', 'Holiday Home',
      'Weekend Home', 'Riverside Resort', 'Eco Tourism', 'Hotel',
      'Commercial Development', 'Mixed-Use Development', 'Camping Site',
      'Organic Farming'
    ],
    rent: [
      'Farm House', 'Holiday Home', 'Weekend Home', 'Resort',
      'Camping Site', 'Eco Tourism', 'Event Venue', 'Restaurant / Café',
      'Commercial Yard', 'Temporary Office', 'Organic Farming'
    ],
    lease: [
      'Residential House', 'Luxury Villa', 'Farm House', 'Holiday Home',
      'Weekend Home', 'Riverside Resort', 'Eco Tourism', 'Hotel',
      'Commercial Development', 'Mixed-Use Development', 'Camping Site',
      'Organic Farming', 'Nursery', 'Adventure Park', 'Event Venue',
      'Restaurant / Café', 'Wellness Retreat', 'Logistics Hub', 'Warehouse'
    ]
  };

  const nearbyOptions = {
    buy: [
      'River', 'Highway Access', 'Bus Stop', 'Railway Station', 'Metro Station',
      'Airport', 'Schools & Colleges', 'Hospitals', 'Shopping Mall',
      'Market Area', 'Bank / ATM', 'Tourist Attractions'
    ],
    rent: [
      'River', 'Highway Access', 'Bus Stop', 'Railway Station', 'Metro Station',
      'Airport', 'Schools & Colleges', 'Hospitals', 'Market Area',
      'Shopping Mall', 'Bank / ATM', 'Tourist Attractions'
    ],
    lease: [
      'River', 'Highway Access', 'Bus Stop', 'Railway Station', 'Metro Station',
      'Airport', 'Schools & Colleges', 'Hospitals', 'Market Area',
      'Shopping Mall', 'Bank / ATM', 'Tourist Attractions'
    ]
  };

  const leaseDurationOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '1 Year' },
    { value: '24', label: '2 Years' },
    { value: '36', label: '3 Years' },
    { value: '60', label: '5 Years' },
    { value: '120', label: '10 Years' }
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
    { id: 'plot', label: '📐 Plot', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'view', label: '👁️ View', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'usage', label: '🏠 Usage', icon: <Building className="w-3.5 h-3.5" /> },
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Riverside Land' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      state: '', city: '', area: '', village: '', landmark: '', pincode: '', 
      riverName: '', distanceToRiver: '', riverFacing: '', mainRoadFacing: '', 
      cornerPlot: '', gatedCommunity: '', nearbyConnectivity: '',
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncludedRent: '', rentNegotiable: '',
      minBudget: '', maxBudget: '', priceNegotiable: '', loanRequired: '', 
      maintenanceCharges: '', propertyTax: '',
      minLeaseRent: '', maxLeaseRent: '', annualLeaseRent: '', securityDepositLease: '', 
      leaseDuration: '', leaseNegotiable: '', propertyTaxResponsibility: '', 
      leaseMaintenanceCharges: '', availableFromLease: '',
      totalArea: '', areaUnit: 'sqft', plotLength: '', plotWidth: '', 
      frontageWidth: '', roadWidth: '', facing: '', boundaryWall: '', 
      landLevel: '', soilType: '', ownershipType: '',
      riverView: '', viewType: [],
      preferredUsage: [],
      electricityConnection: false, waterSupply: false, borewell: false, 
      drainage: false, sewageConnection: false, internalRoads: false, 
      streetLights: false, internetConnectivity: false,
      gatedCommunityAmenity: '', security247: false, cctvSurveillance: false, 
      clubHouse: false, childrensPark: false, walkingTrack: false, 
      landscapedGarden: false, visitorParking: false, rainwaterHarvesting: false,
      titleDeedVerified: '', loanEligible: '', reraApproved: '', 
      dtcpApproved: '', cmdaApproved: '', panchayatApproved: '', 
      encumbranceCertificate: '',
      rentalAgreementReady: '',
      commercialLeaseAllowed: '', resortDevelopmentAllowed: '', 
      subleaseAllowed: '', renewableLease: '',
      readyForRegistration: '', immediatePossession: '', vacantPlot: '',
      immediateOccupancy: '', availableFrom: '', minRentalDuration: '',
      availableImmediately: '', readyForLease: '', shortTermLease: '', 
      longTermLease: '', vacantPlotLease: '',
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
            <input type="text" value="Riverside Land" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
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
          <input type="text" placeholder="River Name" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.riverName} onChange={(e) => handleInputChange('riverName', e.target.value)} />
          <input type="text" placeholder="Distance to River (km)" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.distanceToRiver} onChange={(e) => handleInputChange('distanceToRiver', e.target.value)} />
          <YesNoRadioGroup label="River Facing" name="riverFacing" value={filters.riverFacing} onChange={(val) => handleRadioChange('riverFacing', val)} />
          <YesNoRadioGroup label="Main Road Facing" name="mainRoadFacing" value={filters.mainRoadFacing} onChange={(val) => handleRadioChange('mainRoadFacing', val)} />
          <YesNoRadioGroup label="Corner Plot" name="cornerPlot" value={filters.cornerPlot} onChange={(val) => handleRadioChange('cornerPlot', val)} />
          <YesNoRadioGroup label="Gated Community" name="gatedCommunity" value={filters.gatedCommunity} onChange={(val) => handleRadioChange('gatedCommunity', val)} />
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
              <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
              <input type="text" placeholder="Property Tax (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.propertyTax} onChange={(e) => handleInputChange('propertyTax', e.target.value)} />
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

  const renderPlotSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><SquareIcon className="w-3.5 h-3.5" /> Plot Details</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex gap-2 items-center min-w-0 overflow-hidden">
            <input type="text" placeholder="Total Plot Area" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.totalArea} onChange={(e) => handleInputChange('totalArea', e.target.value)} />
            <AreaUnitSelect value={filters.areaUnit} onChange={(val) => handleInputChange('areaUnit', val)} />
          </div>
          <div className="flex gap-2 min-w-0 overflow-hidden">
            <input type="text" placeholder="Length (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotLength} onChange={(e) => handleInputChange('plotLength', e.target.value)} />
            <input type="text" placeholder="Width (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotWidth} onChange={(e) => handleInputChange('plotWidth', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <input type="text" placeholder="Frontage Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.frontageWidth} onChange={(e) => handleInputChange('frontageWidth', e.target.value)} />
          <input type="text" placeholder="Road Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          <CustomSelect label="Facing Direction" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <YesNoRadioGroup label="Boundary Wall" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          <CustomSelect label="Land Level" options={landLevelOptions} value={filters.landLevel} onChange={(val) => handleInputChange('landLevel', val)} placeholder="Select Level" />
          <CustomSelect label="Soil Type" options={soilTypeOptions} value={filters.soilType} onChange={(val) => handleInputChange('soilType', val)} placeholder="Select Soil Type" />
          <CustomSelect label="Ownership Type" options={ownershipTypeOptions} value={filters.ownershipType} onChange={(val) => handleInputChange('ownershipType', val)} placeholder="Select Ownership" />
        </div>
      </div>
    </div>
  );

  const renderViewSection = () => {
    // Get view options based on current tab
    const getViewOptions = () => {
      if (currentTab === 'Buy') {
        return [
          'Direct River View', 'Partial River View', 'River Access', 
          'Waterfront Property', 'Garden View', 'Green Belt View',
          'Mountain View', 'Sunrise View', 'Sunset View'
        ];
      } else if (currentTab === 'Rent') {
        return [
          'Direct River View', 'Partial River View', 'River Access',
          'Waterfront Property', 'Garden View', 'Green Belt View',
          'Mountain View', 'Sunrise View', 'Sunset View'
        ];
      } else {
        // Lease options
        return [
          'Direct River View', 'Partial River View', 'River Access',
          'Waterfront Property', 'Garden View', 'Green Belt View',
          'Mountain View', 'Sunrise View', 'Sunset View'
        ];
      }
    };

    return (
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm">
          <Eye className="w-3.5 h-3.5" /> View & Location Features
        </h3>
        <div className="space-y-2">
          <RadioGroup 
            name="riverView" 
            options={riverViewOptions} 
            value={filters.riverView} 
            onChange={(val) => handleRadioChange('riverView', val)} 
          />
          <CheckboxGroup 
            label="View Type" 
            options={getViewOptions()} 
            values={filters.viewType} 
            onChange={(val) => handleInputChange('viewType', val)} 
            columns={3} 
          />
        </div>
      </div>
    );
  };

  const renderUsageSection = () => {
    const options = preferredUsageOptions[currentTab.toLowerCase()] || preferredUsageOptions.buy;
    return (
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm">
          {currentTab === 'Buy' ? <Building className="w-3.5 h-3.5" /> : currentTab === 'Rent' ? <Building className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
          {currentTab === 'Buy' ? 'Preferred Usage' : currentTab === 'Rent' ? 'Suitable For' : 'Suitable For'}
        </h3>
        <CheckboxGroup options={options} values={filters.preferredUsage} onChange={(val) => handleInputChange('preferredUsage', val)} columns={2} />
      </div>
    );
  };

  const renderInfrastructureSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Zap className="w-3.5 h-3.5" /> Infrastructure</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.electricityConnection} onChange={(e) => handleCheckboxChange('electricityConnection', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Electricity Connection</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.waterSupply} onChange={(e) => handleCheckboxChange('waterSupply', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Water Supply</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.borewell} onChange={(e) => handleCheckboxChange('borewell', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Borewell</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.drainage} onChange={(e) => handleCheckboxChange('drainage', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Drainage Facility</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.sewageConnection} onChange={(e) => handleCheckboxChange('sewageConnection', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Sewage Connection</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.internalRoads} onChange={(e) => handleCheckboxChange('internalRoads', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Internal Roads</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.streetLights} onChange={(e) => handleCheckboxChange('streetLights', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Street Lights</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.internetConnectivity} onChange={(e) => handleCheckboxChange('internetConnectivity', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Internet / Fiber Connectivity</span>
        </label>
      </div>
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TreesIcon className="w-3.5 h-3.5" /> Amenities</h3>
      <div className="space-y-2">
        <YesNoRadioGroup label="Gated Community" name="gatedCommunityAmenity" value={filters.gatedCommunityAmenity} onChange={(val) => handleRadioChange('gatedCommunityAmenity', val)} />
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
            <input type="checkbox" checked={filters.clubHouse} onChange={(e) => handleCheckboxChange('clubHouse', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Club House</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.childrensPark} onChange={(e) => handleCheckboxChange('childrensPark', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Children's Park</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.walkingTrack} onChange={(e) => handleCheckboxChange('walkingTrack', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Walking Track</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.landscapedGarden} onChange={(e) => handleCheckboxChange('landscapedGarden', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Landscaped Garden</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.visitorParking} onChange={(e) => handleCheckboxChange('visitorParking', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Visitor Parking</span>
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
            <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
            <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
            <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
            <YesNoRadioGroup label="Panchayat Approved" name="panchayatApproved" value={filters.panchayatApproved} onChange={(val) => handleRadioChange('panchayatApproved', val)} />
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
            <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
            <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
            <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
            <YesNoRadioGroup label="Panchayat Approved" name="panchayatApproved" value={filters.panchayatApproved} onChange={(val) => handleRadioChange('panchayatApproved', val)} />
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
            <YesNoRadioGroup label="Resort Development Allowed" name="resortDevelopmentAllowed" value={filters.resortDevelopmentAllowed} onChange={(val) => handleRadioChange('resortDevelopmentAllowed', val)} />
            <YesNoRadioGroup label="Sublease Allowed" name="subleaseAllowed" value={filters.subleaseAllowed} onChange={(val) => handleRadioChange('subleaseAllowed', val)} />
            <YesNoRadioGroup label="Renewable Lease" name="renewableLease" value={filters.renewableLease} onChange={(val) => handleRadioChange('renewableLease', val)} />
            <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
            <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
            <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
            <YesNoRadioGroup label="Panchayat Approved" name="panchayatApproved" value={filters.panchayatApproved} onChange={(val) => handleRadioChange('panchayatApproved', val)} />
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
            <YesNoRadioGroup label="Vacant Plot" name="vacantPlot" value={filters.vacantPlot} onChange={(val) => handleRadioChange('vacantPlot', val)} />
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
            <YesNoRadioGroup label="Vacant Plot" name="vacantPlotLease" value={filters.vacantPlotLease} onChange={(val) => handleRadioChange('vacantPlotLease', val)} />
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
                <Waves className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-lg">Filter Riverside Land</h3>
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
            {activeMainSection === 'view' && renderViewSection()}
            {activeMainSection === 'usage' && renderUsageSection()}
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

export default RiversideLandFilter;