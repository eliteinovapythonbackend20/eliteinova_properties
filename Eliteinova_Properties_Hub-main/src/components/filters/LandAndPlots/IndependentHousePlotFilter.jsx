import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronDown, Building, MapPin, IndianRupee, Ruler, Shield, 
  Phone, FileText, RefreshCw, DollarSign, Calendar, Zap, 
  Square, Home, Bus, CheckCircle, TrendingUp, Clock, Wifi, Camera,
  Trees as TreesIcon, Users, ShieldCheck, FileCheck
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

// Plot Area Unit Select
const PlotAreaUnitSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const units = [
    { value: 'sqft', label: 'Sq.ft' },
    { value: 'cents', label: 'Cents' },
    { value: 'acres', label: 'Acres' },
    { value: 'grounds', label: 'Grounds' }
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

const IndependentHousePlotFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [activeMainSection, setActiveMainSection] = useState('basic');
  
  const [filters, setFilters] = useState({
    // Basic Details
    listingType: [],
    // Location
    city: '', locality: '', layoutName: '', landmark: '', pincode: '', nearbyConnectivity: '',
    // Rent
    minRent: '', maxRent: '', securityDeposit: '', advanceAmount: '', maintenanceIncluded: '', rentNegotiable: '',
    // Buy
    minBudget: '', maxBudget: '', preferredPricePerSqft: '', loanRequired: '', priceNegotiable: '',
    // Sell
    minSellPrice: '', maxSellPrice: '', pricePerSqft: '', sellPriceNegotiable: '', maintenanceCharges: '', propertyTax: '',
    // Lease
    minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseAdvanceAmount: '', leaseDuration: '', leaseMaintenanceIncluded: '', leaseNegotiable: '',
    // Plot Details
    plotArea: '', plotAreaUnit: 'sqft', plotLength: '', plotWidth: '', facing: '', commercialPlot: '', roadWidth: '', boundaryWall: '', plotShape: '',
    // For Buy specific
    preferredPlotLength: '', preferredPlotWidth: '', minRoadWidthRequired: '', boundaryWallPreferred: '', plotShapePreference: '',
    // Infrastructure & Utilities
    waterConnection: false, borewellFacility: false, electricityConnection: false, drainageFacility: false, streetLights: false, internetBroadband: false,
    // Amenities
    gatedLayout: '', security247: false, cctvSurveillance: false, parkNearby: false, visitorParking: false, wideInternalRoads: false,
    // Legal & Approval
    dtcpApproved: '', cmdaApproved: '', reraApproved: '', pattaAvailable: '', encumbranceFree: '',
    // Buy specific legal
    encumbranceFreePreferred: '', loanEligiblePlotRequired: '', titleDeedVerified: '',
    // Sell specific legal
    loanEligible: '',
    // Rent/Lease specific
    rentalAgreementReady: '', leaseAgreementReady: '',
    // Suitable For
    suitableForTypes: [],
    // Availability
    immediateAvailability: '', availableFrom: '', minRentalDuration: '',
    // Sell specific availability
    readyToRegister: '', immediatePossession: '', underDevelopmentLayout: '',
    // Buy specific availability
    underDevelopmentAcceptable: '',
    // Lease specific
    leaseRenewalOption: '',
    // Nearby Access
    nearbyAccess: [],
    // Contact
    contactOwner: false, contactAgent: false, contactBuilder: false, preferredContactTime: ''
  });

  // Options arrays
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

  // SELL OPTION REMOVED FROM SUITABLE FOR
  const suitableForOptions = {
    rent: [
      'Independent House Construction',
      'Duplex House',
      'Rental House Development',
      'Temporary Residential Setup',
      'Investment Holding',
      'Small Residential Project'
    ],
    buy: [
      'Independent House Construction',
      'Duplex House Construction',
      'Rental House Development',
      'Investment Purpose',
      'Small Residential Project',
      'Future Home Construction'
    ],
    // sell: [
    //   'Independent House Construction',
    //   'Duplex House Construction',
    //   'Rental House Development',
    //   'Investment Purpose',
    //   'Small Residential Project',
    //   'Future Home Construction'
    // ],
    lease: [
      'Independent House Construction',
      'Duplex House Construction',
      'Rental House Development',
      'Temporary Residential Setup',
      'Investment Holding',
      'Small Residential Project'
    ]
  };

  const nearbyOptions = [
    'Bus Stop / Metro',
    'School / College',
    'Hospital',
    'Shopping Area',
    'Highway Access',
    'Residential Neighborhood'
  ];

  const mainSections = [
    { id: 'basic', label: '📍 Basic', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'price', label: currentTab === 'Rent' ? '💰 Rent' : currentTab === 'Buy' ? '💰 Budget' : currentTab === 'Sell' ? '💰 Price' : '💰 Lease', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'plot', label: '📐 Plot', icon: <SquareIcon className="w-3.5 h-3.5" /> },
    { id: 'utilities', label: '⚡ Utilities', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'amenities', label: '🏘️ Amenities', icon: <TreesIcon className="w-3.5 h-3.5" /> },
    { id: 'legal', label: '⚖️ Legal', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'suitable', label: '🏗️ Suitable', icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'availability', label: '📅 Available', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'nearby', label: '🚌 Nearby', icon: <Bus className="w-3.5 h-3.5" /> },
    { id: 'contact', label: '📞 Contact', icon: <Phone className="w-3.5 h-3.5" /> }
  ];

  // SELL TAB COMMENTED OUT - Only Buy, Rent, Lease available
  const tabs = [
    { id: 'Buy', label: 'Buy', icon: <DollarSign className="w-3 h-3" /> },
    { id: 'Rent', label: 'Rent', icon: <IndianRupee className="w-3 h-3" /> },
    // { id: 'Sell', label: 'Sell', icon: <TrendingUp className="w-3 h-3" /> },
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Independent House Plot' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      city: '', locality: '', layoutName: '', landmark: '', pincode: '', nearbyConnectivity: '',
      minRent: '', maxRent: '', securityDeposit: '', advanceAmount: '', maintenanceIncluded: '', rentNegotiable: '',
      minBudget: '', maxBudget: '', preferredPricePerSqft: '', loanRequired: '', priceNegotiable: '',
      minSellPrice: '', maxSellPrice: '', pricePerSqft: '', sellPriceNegotiable: '', maintenanceCharges: '', propertyTax: '',
      minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseAdvanceAmount: '', leaseDuration: '', leaseMaintenanceIncluded: '', leaseNegotiable: '',
      plotArea: '', plotAreaUnit: 'sqft', plotLength: '', plotWidth: '', facing: '', commercialPlot: '', roadWidth: '', boundaryWall: '', plotShape: '',
      preferredPlotLength: '', preferredPlotWidth: '', minRoadWidthRequired: '', boundaryWallPreferred: '', plotShapePreference: '',
      waterConnection: false, borewellFacility: false, electricityConnection: false, drainageFacility: false, streetLights: false, internetBroadband: false,
      gatedLayout: '', security247: false, cctvSurveillance: false, parkNearby: false, visitorParking: false, wideInternalRoads: false,
      dtcpApproved: '', cmdaApproved: '', reraApproved: '', pattaAvailable: '', encumbranceFree: '',
      encumbranceFreePreferred: '', loanEligiblePlotRequired: '', titleDeedVerified: '',
      loanEligible: '',
      rentalAgreementReady: '', leaseAgreementReady: '',
      suitableForTypes: [],
      immediateAvailability: '', availableFrom: '', minRentalDuration: '',
      readyToRegister: '', immediatePossession: '', underDevelopmentLayout: '',
      underDevelopmentAcceptable: '',
      leaseRenewalOption: '',
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Property Type</label>
            <input type="text" value="Independent House Plot" disabled className="w-full px-2 py-1.5 rounded border border-teal-300 bg-gray-50 text-xs text-gray-600" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <input type="text" placeholder="City" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
          <input type="text" placeholder="Area / Locality" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
          <input type="text" placeholder="Layout Name" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.layoutName} onChange={(e) => handleInputChange('layoutName', e.target.value)} />
          <input type="text" placeholder="Landmark" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
          <input type="text" placeholder="PIN Code" className="w-full px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pincode} onChange={(e) => handleInputChange('pincode', e.target.value)} />
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
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Security Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
                <input type="number" placeholder="Advance Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.advanceAmount} onChange={(e) => handleInputChange('advanceAmount', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minBudget} onChange={(e) => handleInputChange('minBudget', e.target.value)} />
                <input type="number" placeholder="Max Budget (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxBudget} onChange={(e) => handleInputChange('maxBudget', e.target.value)} />
              </div>
              <input type="number" placeholder="Preferred Price Per Sq.ft (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.preferredPricePerSqft} onChange={(e) => handleInputChange('preferredPricePerSqft', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <YesNoRadioGroup label="Loan Required" name="loanRequired" value={filters.loanRequired} onChange={(val) => handleRadioChange('loanRequired', val)} />
              <YesNoRadioGroup label="Price Negotiable" name="priceNegotiable" value={filters.priceNegotiable} onChange={(val) => handleRadioChange('priceNegotiable', val)} />
            </div>
          </div>
        </div>
      );
    } 
    // SELL TAB PRICE SECTION COMMENTED OUT
    // else if (currentTab === 'Sell') {
    //   return (
    //     <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
    //       <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TrendingUp className="w-3.5 h-3.5" /> Price Details</h3>
    //       <div className="space-y-2">
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
    //           <div className="grid grid-cols-2 gap-2">
    //             <input type="number" placeholder="Min Price (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minSellPrice} onChange={(e) => handleInputChange('minSellPrice', e.target.value)} />
    //             <input type="number" placeholder="Max Price (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxSellPrice} onChange={(e) => handleInputChange('maxSellPrice', e.target.value)} />
    //           </div>
    //           <input type="number" placeholder="Price Per Sq.ft (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.pricePerSqft} onChange={(e) => handleInputChange('pricePerSqft', e.target.value)} />
    //         </div>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
    //           <YesNoRadioGroup label="Price Negotiable" name="sellPriceNegotiable" value={filters.sellPriceNegotiable} onChange={(val) => handleRadioChange('sellPriceNegotiable', val)} />
    //           <input type="text" placeholder="Maintenance Charges (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
    //           <input type="text" placeholder="Property Tax (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.propertyTax} onChange={(e) => handleInputChange('propertyTax', e.target.value)} />
    //         </div>
    //       </div>
    //     </div>
    //   );
    // } 
    else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileText className="w-3.5 h-3.5" /> Lease Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Lease Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
                <input type="number" placeholder="Max Lease Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Refundable Deposit (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.refundableDeposit} onChange={(e) => handleInputChange('refundableDeposit', e.target.value)} />
                <input type="number" placeholder="Advance Amount (₹)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.leaseAdvanceAmount} onChange={(e) => handleInputChange('leaseAdvanceAmount', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
              <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
              <YesNoRadioGroup label="Maintenance Charges Included" name="leaseMaintenanceIncluded" value={filters.leaseMaintenanceIncluded} onChange={(val) => handleRadioChange('leaseMaintenanceIncluded', val)} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex gap-2 items-center min-w-0 overflow-hidden">
            <input type="text" placeholder="Plot Area" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotArea} onChange={(e) => handleInputChange('plotArea', e.target.value)} />
            <PlotAreaUnitSelect value={filters.plotAreaUnit} onChange={(val) => handleInputChange('plotAreaUnit', val)} />
          </div>
          {currentTab === 'Buy' ? (
            <div className="flex gap-2 min-w-0 overflow-hidden">
              <input type="text" placeholder="Preferred Length (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.preferredPlotLength} onChange={(e) => handleInputChange('preferredPlotLength', e.target.value)} />
              <input type="text" placeholder="Width (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.preferredPlotWidth} onChange={(e) => handleInputChange('preferredPlotWidth', e.target.value)} />
            </div>
          ) : (
            <div className="flex gap-2 min-w-0 overflow-hidden">
              <input type="text" placeholder="Length (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotLength} onChange={(e) => handleInputChange('plotLength', e.target.value)} />
              <input type="text" placeholder="Width (ft)" className="flex-1 min-w-0 px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.plotWidth} onChange={(e) => handleInputChange('plotWidth', e.target.value)} />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
          <CustomSelect label="Facing" options={facingOptions} value={filters.facing} onChange={(val) => handleInputChange('facing', val)} placeholder="Select Facing" />
          <YesNoRadioGroup label="commercial Plot" name="commercialPlot" value={filters.commercialPlot} onChange={(val) => handleRadioChange('commercialPlot', val)} />
          <input type="text" placeholder="Road Width (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.roadWidth} onChange={(e) => handleInputChange('roadWidth', e.target.value)} />
          {currentTab === 'Buy' ? (
            <YesNoRadioGroup label="Boundary Wall Preferred" name="boundaryWallPreferred" value={filters.boundaryWallPreferred} onChange={(val) => handleRadioChange('boundaryWallPreferred', val)} />
          ) : (
            <YesNoRadioGroup label="Boundary Wall Available" name="boundaryWall" value={filters.boundaryWall} onChange={(val) => handleRadioChange('boundaryWall', val)} />
          )}
          {currentTab === 'Buy' ? (
            <>
              <CustomSelect label="Plot Shape Preference" options={plotShapeOptions} value={filters.plotShapePreference} onChange={(val) => handleInputChange('plotShapePreference', val)} placeholder="Select Shape" />
              <input type="text" placeholder="Min Road Width Required (ft)" className="px-2 py-1.5 rounded border border-teal-300 bg-white text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" value={filters.minRoadWidthRequired} onChange={(e) => handleInputChange('minRoadWidthRequired', e.target.value)} />
            </>
          ) : (
            <>
              <CustomSelect label="Plot Shape" options={plotShapeOptions} value={filters.plotShape} onChange={(val) => handleInputChange('plotShape', val)} placeholder="Select Shape" />
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderUtilitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Zap className="w-3.5 h-3.5" /> Infrastructure & Utilities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.waterConnection} onChange={(e) => handleCheckboxChange('waterConnection', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Water Connection</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.borewellFacility} onChange={(e) => handleCheckboxChange('borewellFacility', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Borewell Facility</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.electricityConnection} onChange={(e) => handleCheckboxChange('electricityConnection', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Electricity Connection</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.drainageFacility} onChange={(e) => handleCheckboxChange('drainageFacility', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Drainage Facility</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.streetLights} onChange={(e) => handleCheckboxChange('streetLights', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Street Lights</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={filters.internetBroadband} onChange={(e) => handleCheckboxChange('internetBroadband', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
          <span className="text-xs text-gray-700 group-hover:text-teal-500">Internet / Broadband Ready</span>
        </label>
      </div>
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
      <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><TreesIcon className="w-3.5 h-3.5" /> Amenities</h3>
      <div className="space-y-2">
        <YesNoRadioGroup label="Gated Layout" name="gatedLayout" value={filters.gatedLayout} onChange={(val) => handleRadioChange('gatedLayout', val)} />
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
            <input type="checkbox" checked={filters.parkNearby} onChange={(e) => handleCheckboxChange('parkNearby', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Park / Garden Nearby</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.visitorParking} onChange={(e) => handleCheckboxChange('visitorParking', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Visitor Parking</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={filters.wideInternalRoads} onChange={(e) => handleCheckboxChange('wideInternalRoads', e.target.checked)} className="w-3.5 h-3.5 rounded border border-teal-400 checked:bg-teal-500 checked:border-teal-500 accent-teal-500" />
            <span className="text-xs text-gray-700 group-hover:text-teal-500">Wide Internal Roads</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderLegalSection = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Shield className="w-3.5 h-3.5" /> Approval & Legal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
            <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
            <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
            <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
            <YesNoRadioGroup label="Patta Available" name="pattaAvailable" value={filters.pattaAvailable} onChange={(val) => handleRadioChange('pattaAvailable', val)} />
            <YesNoRadioGroup label="Encumbrance Free" name="encumbranceFree" value={filters.encumbranceFree} onChange={(val) => handleRadioChange('encumbranceFree', val)} />
            <YesNoRadioGroup label="Rental Agreement Ready" name="rentalAgreementReady" value={filters.rentalAgreementReady} onChange={(val) => handleRadioChange('rentalAgreementReady', val)} />
          </div>
        </div>
      );
    } else if (currentTab === 'Buy') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><ShieldCheck className="w-3.5 h-3.5" /> Approval & Legal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
            <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
            <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
            <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
            <YesNoRadioGroup label="Patta Available" name="pattaAvailable" value={filters.pattaAvailable} onChange={(val) => handleRadioChange('pattaAvailable', val)} />
            <YesNoRadioGroup label="Encumbrance Free Preferred" name="encumbranceFreePreferred" value={filters.encumbranceFreePreferred} onChange={(val) => handleRadioChange('encumbranceFreePreferred', val)} />
            <YesNoRadioGroup label="Loan Eligible Plot Required" name="loanEligiblePlotRequired" value={filters.loanEligiblePlotRequired} onChange={(val) => handleRadioChange('loanEligiblePlotRequired', val)} />
            <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
          </div>
        </div>
      );
    } 
    // SELL TAB LEGAL SECTION COMMENTED OUT
    // else if (currentTab === 'Sell') {
    //   return (
    //     <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
    //       <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileCheck className="w-3.5 h-3.5" /> Approval & Legal Details</h3>
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
    //         <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
    //         <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
    //         <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
    //         <YesNoRadioGroup label="Patta Available" name="pattaAvailable" value={filters.pattaAvailable} onChange={(val) => handleRadioChange('pattaAvailable', val)} />
    //         <YesNoRadioGroup label="Encumbrance Free" name="encumbranceFree" value={filters.encumbranceFree} onChange={(val) => handleRadioChange('encumbranceFree', val)} />
    //         <YesNoRadioGroup label="Loan Eligible" name="loanEligible" value={filters.loanEligible} onChange={(val) => handleRadioChange('loanEligible', val)} />
    //         <YesNoRadioGroup label="Title Deed Verified" name="titleDeedVerified" value={filters.titleDeedVerified} onChange={(val) => handleRadioChange('titleDeedVerified', val)} />
    //       </div>
    //     </div>
    //   );
    // } 
    else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><FileText className="w-3.5 h-3.5" /> Approval & Legal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-w-0">
            <YesNoRadioGroup label="DTCP Approved" name="dtcpApproved" value={filters.dtcpApproved} onChange={(val) => handleRadioChange('dtcpApproved', val)} />
            <YesNoRadioGroup label="CMDA Approved" name="cmdaApproved" value={filters.cmdaApproved} onChange={(val) => handleRadioChange('cmdaApproved', val)} />
            <YesNoRadioGroup label="RERA Approved" name="reraApproved" value={filters.reraApproved} onChange={(val) => handleRadioChange('reraApproved', val)} />
            <YesNoRadioGroup label="Patta Available" name="pattaAvailable" value={filters.pattaAvailable} onChange={(val) => handleRadioChange('pattaAvailable', val)} />
            <YesNoRadioGroup label="Encumbrance Free" name="encumbranceFree" value={filters.encumbranceFree} onChange={(val) => handleRadioChange('encumbranceFree', val)} />
            <YesNoRadioGroup label="Lease Agreement Ready" name="leaseAgreementReady" value={filters.leaseAgreementReady} onChange={(val) => handleRadioChange('leaseAgreementReady', val)} />
          </div>
        </div>
      );
    }
  };

  const renderSuitableSection = () => {
    // SELL OPTION REMOVED
    let options = [];
    if (currentTab === 'Rent') options = suitableForOptions.rent;
    else if (currentTab === 'Buy') options = suitableForOptions.buy;
    // else if (currentTab === 'Sell') options = suitableForOptions.sell;
    else options = suitableForOptions.lease;
    
    return (
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
        <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Building className="w-3.5 h-3.5" /> Suitable For</h3>
        <CheckboxGroup options={options} values={filters.suitableForTypes} onChange={(val) => handleInputChange('suitableForTypes', val)} columns={2} />
      </div>
    );
  };

  const renderAvailabilitySection = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <RadioGroup name="immediateAvailability" options={[{ value: 'Yes', label: 'Immediate' }, { value: 'No', label: 'Available From' }]} value={filters.immediateAvailability} onChange={(val) => handleRadioChange('immediateAvailability', val)} />
            {filters.immediateAvailability === 'No' && (
              <CustomDatePicker label="Available From" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            )}
            <CustomSelect label="Minimum Rental Duration" options={rentalDurationOptions} value={filters.minRentalDuration} onChange={(val) => handleInputChange('minRentalDuration', val)} placeholder="Select Duration" />
          </div>
        </div>
      );
    } else if (currentTab === 'Lease') {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability</h3>
          <div className="space-y-2">
            <RadioGroup name="immediateAvailability" options={[{ value: 'Yes', label: 'Immediate' }, { value: 'No', label: 'Available From' }]} value={filters.immediateAvailability} onChange={(val) => handleRadioChange('immediateAvailability', val)} />
            {filters.immediateAvailability === 'No' && (
              <CustomDatePicker label="Available From" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
            )}
            <YesNoRadioGroup label="Lease Renewal Option" name="leaseRenewalOption" value={filters.leaseRenewalOption} onChange={(val) => handleRadioChange('leaseRenewalOption', val)} />
          </div>
        </div>
      );
    } 
    // SELL TAB AVAILABILITY SECTION COMMENTED OUT
    // } else if (currentTab === 'Sell') {
    //   return (
    //     <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
    //       <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability</h3>
    //       <div className="space-y-2">
    //         <YesNoRadioGroup label="Ready to Register" name="readyToRegister" value={filters.readyToRegister} onChange={(val) => handleRadioChange('readyToRegister', val)} />
    //         <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
    //         <YesNoRadioGroup label="Under Development Layout" name="underDevelopmentLayout" value={filters.underDevelopmentLayout} onChange={(val) => handleRadioChange('underDevelopmentLayout', val)} />
    //       </div>
    //     </div>
    //   );
    // } 
    else {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg p-3 border border-teal-200">
          <h3 className="font-semibold text-teal-800 mb-2 flex items-center gap-1.5 text-sm"><Clock className="w-3.5 h-3.5" /> Availability Preference</h3>
          <div className="space-y-2">
            <YesNoRadioGroup label="Ready to Register" name="readyToRegister" value={filters.readyToRegister} onChange={(val) => handleRadioChange('readyToRegister', val)} />
            <YesNoRadioGroup label="Immediate Possession" name="immediatePossession" value={filters.immediatePossession} onChange={(val) => handleRadioChange('immediatePossession', val)} />
            <YesNoRadioGroup label="Under Development Layout Acceptable" name="underDevelopmentAcceptable" value={filters.underDevelopmentAcceptable} onChange={(val) => handleRadioChange('underDevelopmentAcceptable', val)} />
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
                <SquareIcon className="w-4 h-4 text-white slow-rotate" />
              </div>
              <h3 className="text-white font-semibold text-lg">Filter Independent House Plot</h3>
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
            {activeMainSection === 'utilities' && renderUtilitiesSection()}
            {activeMainSection === 'amenities' && renderAmenitiesSection()}
            {activeMainSection === 'legal' && renderLegalSection()}
            {activeMainSection === 'suitable' && renderSuitableSection()}
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

export default IndependentHousePlotFilter;