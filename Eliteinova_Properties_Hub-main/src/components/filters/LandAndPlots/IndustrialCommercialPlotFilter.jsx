import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronDown, Building, MapPin, IndianRupee, Ruler, Shield, 
  Phone, FileText, RefreshCw, DollarSign, Calendar, Zap, 
  Square, Home, Bus, CheckCircle, TrendingUp, Clock, Factory,
  Warehouse, Truck, Battery, Droplets, Wifi, HardDrive, ShieldCheck,
  Trees, Fence, Car, Sparkles, Sun, Award, Landmark, FileCheck,
  Box, Package, Store, ShoppingBag, Cpu, Settings
} from 'lucide-react';

// Custom Square Icon
const SquareIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
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

// Plot Area Unit Select
const PlotAreaUnitSelect = ({ value, onChange }) => {
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

// Checkbox Group Component - Two Column Grid
const CheckboxGroup = ({ label, options, values, onChange }) => (
  <div>
    {label && <label className="text-xs text-teal-800 font-semibold block mb-1.5">{label}</label>}
    <div className="grid grid-cols-2 gap-1.5">
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

const IndustrialCommercialPlotFilter = ({ activeTab = 'Rent', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [activeMainSection, setActiveMainSection] = useState('basic');
  
  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location Details
    city: '', industrialArea: '', landmark: '', pincode: '', nearbyConnectivity: '',
    highwayAccess: '', mainRoadFacing: '',
    // Price/Rent/Lease/Sell Details
    minPrice: '', maxPrice: '', priceNegotiable: '', loanRequired: '',
    minRent: '', maxRent: '', securityDeposit: '', advanceAmount: '', maintenanceIncluded: '', rentNegotiable: '',
    minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseDuration: '', leaseNegotiable: '',
    minSellPrice: '', maxSellPrice: '', sellPriceNegotiable: '', maintenanceCharges: '', propertyTax: '',
    pricePerUnit: '', preferredPricePerUnit: '',
    // Plot Details
    plotArea: '', plotAreaUnit: 'sqft', plotLength: '', plotWidth: '', facing: '', 
    cornerPlot: '', roadWidth: '', frontageWidth: '', boundaryWall: '', plotShape: '',
    minRoadWidthRequired: '', plotShapePreference: '',
    // Industrial & Commercial Suitability
    industrialCommercialSuitability: [],
    // Infrastructure & Utilities
    infrastructureUtilities: [],
    // Amenities
    amenities: [],
    // Approval & Legal Details
    dtcpApproved: '', cmdaApproved: '', industrialApproval: '', commercialApproval: '',
    pollutionClearance: '', fireNOC: '',
    pattaAvailable: '', encumbranceFree: '', loanEligible: '', titleDeedVerified: '',
    rentalAgreementReady: '', leaseAgreementReady: '',
    // Availability
    immediateAvailability: '', availableFrom: '', minRentalDuration: '',
    readyToRegister: '', immediatePossession: '', underDevelopmentLayout: '', leaseRenewalOption: '',
    // Nearby Access
    nearbyAccess: [],
    // Contact
    contactOwner: false, contactAgent: false, contactBuilder: false, preferredContactTime: ''
  });

  // Options Arrays
  const facingOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' }
  ];

  const plotShapeOptions = [
    { value: 'Regular', label: 'Regular' },
    { value: 'Irregular', label: 'Irregular' }
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

  const industrialCommercialSuitabilityOptions = [
    'Factory Setup', 'Warehouse / Logistics Hub', 'Manufacturing Unit', 'Automobile Industry',
    'Food Processing Unit', 'Commercial Complex', 'Showroom Development', 'Office / IT Park',
    'Retail & Distribution Center'
  ];

  const infrastructureUtilitiesOptions = [
    'Water Connection Available', 'Borewell Facility', 'Electricity Connection Available',
    '3-Phase / High Voltage Power Supply', 'Drainage Facility', 'Internet / Fiber Connectivity',
    'Generator / Power Backup Provision', 'Heavy Vehicle Access'
  ];

  const amenitiesOptions = [
    'Gated Industrial Layout', '24/7 Security', 'CCTV Surveillance', 'Parking Space Available',
    'Wide Internal Roads', 'Fire Safety Provision', 'Staff Facilities / Office Space'
  ];

  const nearbyOptions = [
    'Highway Access', 'Port / Harbour Access', 'Railway Cargo Access',
    'Airport Access', 'Industrial Hub', 'Commercial Zone'
  ];

  const mainSections = [
    { id: 'basic', label: '📍 Basic', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'price', label: currentTab === 'Rent' ? '💰 Rent' : currentTab === 'Buy' ? '💰 Budget' : currentTab === 'Sell' ? '💰 Price' : '💰 Lease', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'plot', label: '📐 Plot', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'suitability', label: '🏭 Industrial', icon: <Factory className="w-3.5 h-3.5" /> },
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
    // { id: 'Sell', label: 'Sell', icon: <TrendingUp className="w-3 h-3" /> }, // Commented out
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Industrial Commercial Plot' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      city: '', industrialArea: '', landmark: '', pincode: '', nearbyConnectivity: '',
      highwayAccess: '', mainRoadFacing: '',
      minPrice: '', maxPrice: '', priceNegotiable: '', loanRequired: '',
      minRent: '', maxRent: '', securityDeposit: '', advanceAmount: '', maintenanceIncluded: '', rentNegotiable: '',
      minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseDuration: '', leaseNegotiable: '',
      minSellPrice: '', maxSellPrice: '', sellPriceNegotiable: '', maintenanceCharges: '', propertyTax: '',
      pricePerUnit: '', preferredPricePerUnit: '',
      plotArea: '', plotAreaUnit: 'sqft', plotLength: '', plotWidth: '', facing: '', 
      cornerPlot: '', roadWidth: '', frontageWidth: '', boundaryWall: '', plotShape: '',
      minRoadWidthRequired: '', plotShapePreference: '',
      industrialCommercialSuitability: [],
      infrastructureUtilities: [],
      amenities: [],
      dtcpApproved: '', cmdaApproved: '', industrialApproval: '', commercialApproval: '',
      pollutionClearance: '', fireNOC: '',
      pattaAvailable: '', encumbranceFree: '', loanEligible: '', titleDeedVerified: '',
      rentalAgreementReady: '', leaseAgreementReady: '',
      immediateAvailability: '', availableFrom: '', minRentalDuration: '',
      readyToRegister: '', immediatePossession: '', underDevelopmentLayout: '', leaseRenewalOption: '',
      nearbyAccess: [],
      contactOwner: false, contactAgent: false, contactBuilder: false, preferredContactTime: ''
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
            <input type="text" value="Industrial Commercial Plot" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Purpose</label>
            <input type="text" value={currentTab} disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-teal-800 font-semibold block mb-1.5">Listing Type</label>
            <div className="flex gap-4">
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
          <input type="text" placeholder="City" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
          <input type="text" placeholder="Industrial Area / SIPCOT / SEZ / Locality" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.industrialArea} onChange={(e) => handleInputChange('industrialArea', e.target.value)} />
          <input type="text" placeholder="Landmark" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
          <input type="text" placeholder="PIN Code" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
          <input type="text" placeholder="Nearby Connectivity" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.nearbyConnectivity} onChange={(e) => handleInputChange('nearbyConnectivity', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <YesNoRadioGroup label="Highway Access" name="highwayAccess" value={filters.highwayAccess} onChange={(val) => handleRadioChange('highwayAccess', val)} />
            <YesNoRadioGroup label="Main Road Facing" name="mainRoadFacing" value={filters.mainRoadFacing} onChange={(val) => handleRadioChange('mainRoadFacing', val)} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minRent} onChange={(e) => handleInputChange('minRent', e.target.value)} />
                <input type="number" placeholder="Max Rent (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxRent} onChange={(e) => handleInputChange('maxRent', e.target.value)} />
              </div>
              <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="number" placeholder="Advance Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.advanceAmount} onChange={(e) => handleInputChange('advanceAmount', e.target.value)} />
              <CustomSelect label="Minimum Rental Duration" options={rentalDurationOptions} value={filters.minRentalDuration} onChange={(val) => handleInputChange('minRentalDuration', val)} placeholder="Select Duration" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Maintenance Charges Included" name="maintenanceIncluded" value={filters.maintenanceIncluded} onChange={(val) => handleRadioChange('maintenanceIncluded', val)} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minPrice} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
                <input type="number" placeholder="Max Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxPrice} onChange={(e) => handleInputChange('maxPrice', e.target.value)} />
              </div>
              <input type="number" placeholder="Preferred Price Per Sq.ft / Acre (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.preferredPricePerUnit} onChange={(e) => handleInputChange('preferredPricePerUnit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Loan Required" name="loanRequired" value={filters.loanRequired} onChange={(val) => handleRadioChange('loanRequired', val)} />
              <YesNoRadioGroup label="Price Negotiable" name="priceNegotiable" value={filters.priceNegotiable} onChange={(val) => handleRadioChange('priceNegotiable', val)} />
            </div>
          </div>
        </div>
      );
    } else if (currentTab === 'Sell') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TrendingUp className="w-3.5 h-3.5" /> Price Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Price (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minSellPrice} onChange={(e) => handleInputChange('minSellPrice', e.target.value)} />
                <input type="number" placeholder="Max Price (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxSellPrice} onChange={(e) => handleInputChange('maxSellPrice', e.target.value)} />
              </div>
              <input type="number" placeholder="Price Per Sq.ft / Acre (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pricePerUnit} onChange={(e) => handleInputChange('pricePerUnit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Price Negotiable" name="sellPriceNegotiable" value={filters.sellPriceNegotiable} onChange={(val) => handleRadioChange('sellPriceNegotiable', val)} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Lease (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
                <input type="number" placeholder="Max Lease (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
              </div>
              <input type="number" placeholder="Refundable Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.refundableDeposit} onChange={(e) => handleInputChange('refundableDeposit', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input type="number" placeholder="Advance Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.advanceAmount} onChange={(e) => handleInputChange('advanceAmount', e.target.value)} />
              <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <YesNoRadioGroup label="Maintenance Charges Included" name="maintenanceIncluded" value={filters.maintenanceIncluded} onChange={(val) => handleRadioChange('maintenanceIncluded', val)} />
              <YesNoRadioGroup label="Lease Negotiable" name="leaseNegotiable" value={filters.leaseNegotiable} onChange={(val) => handleRadioChange('leaseNegotiable', val)} />
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
          <input type="text" placeholder="Plot Area" className="col-span-1 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotArea} onChange={(e) => handleInputChange('plotArea', e.target.value)} />
          <PlotAreaUnitSelect value={filters.plotAreaUnit} onChange={(val) => handleInputChange('plotAreaUnit', val)} />
          <input type="text" placeholder="Length (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotLength} onChange={(e) => handleInputChange('plotLength', e.target.value)} />
          <input type="text" placeholder="Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotWidth} onChange={(e) => handleInputChange('plotWidth', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CustomSelect label="Facing" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <YesNoRadioGroup label="Corner Plot" name="cornerPlot" value={filters.cornerPlot} onChange={(val) => handleRadioChange('cornerPlot', val)} />
          <input type="text" placeholder="Road Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          <input type="text" placeholder="Frontage Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.frontageWidth} onChange={(e) => handleInputChange('frontageWidth', e.target.value)} />
          <YesNoRadioGroup label="Boundary Wall Available" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          <CustomSelect label="Plot Shape" options={plotShapeOptions} value={filters.plotShape} onChange={(val) => handleInputChange('plotShape', val)} placeholder="Select Shape" />
          {currentTab === 'Buy' && (
            <>
              <input type="text" placeholder="Minimum Road Width Required (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minRoadWidthRequired} onChange={(e) => handleInputChange('minRoadWidthRequired', e.target.value)} />
              <CustomSelect label="Plot Shape Preference" options={plotShapeOptions} value={filters.plotShapePreference} onChange={(val) => handleInputChange('plotShapePreference', val)} placeholder="Select" />
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderSuitabilitySection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Factory className="w-3.5 h-3.5" /> Industrial & Commercial Suitability</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {industrialCommercialSuitabilityOptions.map(option => (
          <label key={option} className="flex items-center gap-1.5 cursor-pointer group p-1 rounded hover:bg-teal-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.industrialCommercialSuitability.includes(option)}
              onChange={() => handleArrayToggle('industrialCommercialSuitability', option)}
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
        <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
        <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
        <YesNoRadioGroup label="Industrial Approval Available" name="industrialApproval" value={filters.industrialApproval} onChange={(val) => handleRadioChange('industrialApproval', val)} />
        <YesNoRadioGroup label="Commercial Approval Available" name="commercialApproval" value={filters.commercialApproval} onChange={(val) => handleRadioChange('commercialApproval', val)} />
        <YesNoRadioGroup label="Pollution Clearance Available" name="pollutionClearance" value={filters.pollutionClearance} onChange={(val) => handleRadioChange('pollutionClearance', val)} />
        <YesNoRadioGroup label="Fire NOC Available" name="fireNOC" value={filters.fireNOC} onChange={(val) => handleRadioChange('fireNOC', val)} />
        <YesNoRadioGroup label="Patta Available" name="pattaAvailable" value={filters.pattaAvailable} onChange={(val) => handleRadioChange('pattaAvailable', val)} />
        <YesNoRadioGroup label="Encumbrance Free" name="encumbranceFree" value={filters.encumbranceFree} onChange={(val) => handleRadioChange('encumbranceFree', val)} />
        <YesNoRadioGroup label="Loan Eligible" name="loanEligible" value={filters.loanEligible} onChange={(val) => handleRadioChange('loanEligible', val)} />
        <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
        {currentTab === 'Rent' && (
          <YesNoRadioGroup label="Rental Agreement Ready" name="rentalAgreementReady" value={filters.rentalAgreementReady} onChange={(val) => handleRadioChange('rentalAgreementReady', val)} />
        )}
        {currentTab === 'Lease' && (
          <YesNoRadioGroup label="Lease Agreement Ready" name="leaseAgreementReady" value={filters.leaseAgreementReady} onChange={(val) => handleRadioChange('leaseAgreementReady', val)} />
        )}
      </div>
    </div>
  );

  const renderAvailabilitySection = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <RadioGroup name="immediateAvailability" options={[{ value: 'Yes', label: 'Immediate Availability' }, { value: 'No', label: 'Available From' }]} value={filters.immediateAvailability} onChange={(val) => handleRadioChange('immediateAvailability', val)} />
            {filters.immediateAvailability === 'No' && (
              <CustomDatePicker label="Available From Date" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            )}
            <CustomSelect label="Minimum Rental Duration" options={rentalDurationOptions} value={filters.minRentalDuration} onChange={(val) => handleInputChange('minRentalDuration', val)} placeholder="Select Duration" />
          </div>
        </div>
      );
    } else if (currentTab === 'Lease') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <RadioGroup name="immediateAvailability" options={[{ value: 'Yes', label: 'Immediate Availability' }, { value: 'No', label: 'Available From' }]} value={filters.immediateAvailability} onChange={(val) => handleRadioChange('immediateAvailability', val)} />
            {filters.immediateAvailability === 'No' && (
              <CustomDatePicker label="Available From Date" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            )}
            <YesNoRadioGroup label="Lease Renewal Option" name="leaseRenewalOption" value={filters.leaseRenewalOption} onChange={(val) => handleRadioChange('leaseRenewalOption', val)} />
          </div>
        </div>
      );
    } else if (currentTab === 'Sell') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Ready to Register" name="readyToRegister" value={filters.readyToRegister} onChange={(val) => handleRadioChange('readyToRegister', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Under Development Industrial Layout" name="underDevelopmentLayout" value={filters.underDevelopmentLayout} onChange={(val) => handleRadioChange('underDevelopmentLayout', val)} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Calendar className="w-3.5 h-3.5" /> Availability Preference</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Ready to Register" name="readyToRegister" value={filters.readyToRegister} onChange={(val) => handleRadioChange('readyToRegister', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Under Development Industrial Layout Acceptable" name="underDevelopmentLayout" value={filters.underDevelopmentLayout} onChange={(val) => handleRadioChange('underDevelopmentLayout', val)} />
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
                <Store className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-sm">Filter Industrial Commercial Plot</h3>
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
            {activeMainSection === 'suitability' && renderSuitabilitySection()}
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
export default IndustrialCommercialPlotFilter;