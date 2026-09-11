import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ChevronDown, ChevronUp, Building, MapPin, 
  IndianRupee, Ruler, Shield, Clock, CheckCircle, 
  Phone, Users, FileText, RefreshCw, DollarSign, 
  Navigation, Layout, Sliders, Calendar, Plus, Store
} from 'lucide-react';

// TrendUp Icon Component
const TrendUpIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6H23V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
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

// Amenities Tags Component
const AmenitiesTags = ({ selectedAmenities, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim() && !selectedAmenities.includes(inputValue.trim())) {
      onAdd(inputValue.trim());
      setInputValue('');
      setShowInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedAmenities.map((amenity, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs"
          >
            {amenity}
            <button
              type="button"
              onClick={() => onRemove(amenity)}
              className="hover:text-teal-900 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      {!showInput ? (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-dashed border-teal-300 text-teal-600 text-xs hover:bg-teal-50 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Amenities
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter amenity name"
            className="flex-1 px-2 py-1 rounded-lg border-2 border-teal-300 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-2 py-1 rounded-lg bg-teal-600 text-white text-xs hover:bg-teal-700 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowInput(false);
              setInputValue('');
            }}
            className="px-2 py-1 rounded-lg border-2 border-teal-300 text-teal-600 text-xs hover:bg-teal-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Appliances Included Component
const AppliancesIncluded = ({ appliances, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim() && !appliances.includes(inputValue.trim())) {
      onAdd(inputValue.trim());
      setInputValue('');
      setShowInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {appliances.map((appliance, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs"
          >
            {appliance}
            <button
              type="button"
              onClick={() => onRemove(appliance)}
              className="hover:text-emerald-900 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      {!showInput ? (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-dashed border-teal-300 text-teal-600 text-xs hover:bg-teal-50 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Appliances
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter appliance name"
            className="flex-1 px-2 py-1 rounded-lg border-2 border-teal-300 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-2 py-1 rounded-lg bg-teal-600 text-white text-xs hover:bg-teal-700 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowInput(false);
              setInputValue('');
            }}
            className="px-2 py-1 rounded-lg border-2 border-teal-300 text-teal-600 text-xs hover:bg-teal-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const RetailShopFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState('Buy'); // Already set to 'Buy' as default
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    location: true,
    price: true,
    property: true,
    shopFeatures: true,
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
    city: '', locality: '', landmark: '', pincode: '', mainRoadFacing: '', cornerShop: '',
    nearbyConnectivity: '',
    // Property Details
    builtUpAreaMin: '', builtUpAreaMax: '',
    carpetAreaMin: '', carpetAreaMax: '',
    floorNumber: '', frontageWidth: '', ceilingHeight: '',
    parkingAvailability: '', propertyAge: '', ownershipType: '',
    furnishingType: '',
    // Shop Features
    displayWindow: false, storageRoom: false, washroom: false, pantry: false,
    airConditioning: false, signageSpace: false, billingCounter: false, loadingUnloading: false,
    // Amenities
    security24x7: false, cctv: false, powerBackup: false, liftEscalator: false,
    fireSafety: false, visitorParking: false, internetBroadband: false, generatorBackup: false,
    selectedAmenities: [],
    appliancesIncluded: [],
    // Business Suitability
    businessTypes: [],
    // Availability
    readyToOccupy: false, underConstruction: false, immediatePossession: false,
    availableFrom: '', immediateOccupancy: false, minRentalDuration: '',
    leaseRenewalOption: false,
    // Legal
    titleDeedVerified: false, loanEligible: false, reraApproved: false, commercialLicense: false,
    // Nearby
    nearbyAccess: [],
    // Contact
    contactOwner: false, contactAgent: false, contactBuilder: false, preferredContactTime: '',
    // Buy & Sell
    minPrice: '', maxPrice: '', priceNegotiable: false, maintenanceCharges: '',
    propertyTax: '', loanRequired: false,
    // Rent
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: false,
    rentNegotiable: false,
    // Lease
    minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '',
    leaseDuration: '', leaseNegotiable: false
  });

  const floorOptions = [
    { value: 'Ground', label: 'Ground Floor' },
    { value: 'Upper', label: 'Upper Floor' }
  ];
  const leaseDurationOptions = [
    { value: '1', label: '1 Year' },
    { value: '2', label: '2 Years' },
    { value: '3', label: '3 Years' },
    { value: '5', label: '5 Years' },
    { value: '9', label: '9 Years' }
  ];
  const contactTimeOptions = [
    { value: 'Morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'Afternoon', label: 'Afternoon (12 PM - 4 PM)' },
    { value: 'Evening', label: 'Evening (4 PM - 7 PM)' },
    { value: 'Any', label: 'Any Time' }
  ];
  const businessTypeOptions = [
    'Clothing Store', 'Grocery / Supermarket', 'Pharmacy', 'Electronics Store',
    'Jewelry Shop', 'Salon / Spa', 'Restaurant / Café', 'Franchise Outlet'
  ];
  const nearbyOptions = [
    'Market Area', 'Bus Stop / Metro', 'Residential Hub', 'Commercial Hub', 'Bank / ATM Nearby', 'Parking Zone'
  ];
  const durationOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '11', label: '11 Months' },
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' },
    { value: '36', label: '36 Months' }
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

  const handleArrayToggle = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleAddAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      selectedAmenities: [...prev.selectedAmenities, amenity]
    }));
  };

  const handleRemoveAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
    }));
  };

  const handleAddAppliance = (appliance) => {
    setFilters(prev => ({
      ...prev,
      appliancesIncluded: [...prev.appliancesIncluded, appliance]
    }));
  };

  const handleRemoveAppliance = (appliance) => {
    setFilters(prev => ({
      ...prev,
      appliancesIncluded: prev.appliancesIncluded.filter(a => a !== appliance)
    }));
  };

  const applyFilters = () => {
    const filtersToSend = { ...filters, purpose: currentTab };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      city: '', locality: '', landmark: '', pincode: '', mainRoadFacing: '', cornerShop: '',
      nearbyConnectivity: '',
      builtUpAreaMin: '', builtUpAreaMax: '', carpetAreaMin: '', carpetAreaMax: '',
      floorNumber: '', frontageWidth: '', ceilingHeight: '',
      parkingAvailability: '', propertyAge: '', ownershipType: '', furnishingType: '',
      displayWindow: false, storageRoom: false, washroom: false, pantry: false,
      airConditioning: false, signageSpace: false, billingCounter: false, loadingUnloading: false,
      security24x7: false, cctv: false, powerBackup: false, liftEscalator: false,
      fireSafety: false, visitorParking: false, internetBroadband: false, generatorBackup: false,
      selectedAmenities: [],
      appliancesIncluded: [],
      businessTypes: [],
      readyToOccupy: false, underConstruction: false, immediatePossession: false,
      availableFrom: '', immediateOccupancy: false, minRentalDuration: '',
      leaseRenewalOption: false,
      titleDeedVerified: false, loanEligible: false, reraApproved: false, commercialLicense: false,
      nearbyAccess: [],
      contactOwner: false, contactAgent: false, contactBuilder: false, preferredContactTime: '',
      minPrice: '', maxPrice: '', priceNegotiable: false, maintenanceCharges: '',
      propertyTax: '', loanRequired: false,
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: false,
      rentNegotiable: false,
      minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '',
      leaseDuration: '', leaseNegotiable: false
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
      <SectionHeader emoji="🏢" title="Basic Details" section="basic" />
      {expandedSections.basic && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Property Type</label>
            <input type="text" value="Retail Shop" disabled className="w-full px-2 py-1 rounded-lg border-2 border-teal-300 bg-gray-50 text-sm text-gray-600" />
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
              <label className="text-sm text-teal-800 font-medium block mb-2">Main Road Facing</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="mainRoadFacing" value="Yes" checked={filters.mainRoadFacing === 'Yes'} onChange={(e) => handleInputChange('mainRoadFacing', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="mainRoadFacing" value="No" checked={filters.mainRoadFacing === 'No'} onChange={(e) => handleInputChange('mainRoadFacing', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-2">Corner Shop</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="cornerShop" value="Yes" checked={filters.cornerShop === 'Yes'} onChange={(e) => handleInputChange('cornerShop', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="cornerShop" value="No" checked={filters.cornerShop === 'No'} onChange={(e) => handleInputChange('cornerShop', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
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
              <label className="text-sm text-teal-800 font-medium block mb-1">Carpet Area (sq.ft)</label>
              <div className="space-y-1.5">
                <input type="number" placeholder="Min" className="w-full px-1 py-1 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.carpetAreaMin} onChange={(e) => handleInputChange('carpetAreaMin', e.target.value)} />
                <input type="number" placeholder="Max" className="w-full px-1 py-1 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.carpetAreaMax} onChange={(e) => handleInputChange('carpetAreaMax', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CustomSelect label="Floor Number" options={floorOptions} value={filters.floorNumber} onChange={(val) => handleInputChange('floorNumber', val)} placeholder="Select Floor" />
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Frontage Width (ft)</label>
              <input type="number" placeholder="Enter frontage width" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.frontageWidth} onChange={(e) => handleInputChange('frontageWidth', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Ceiling Height (ft)</label>
              <input type="number" placeholder="Enter ceiling height" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.ceilingHeight} onChange={(e) => handleInputChange('ceilingHeight', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Parking Availability</label>
              <CustomSelect 
                
                options={[
                  { value: '', label: 'Select' },
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' },
                  { value: 'Limited', label: 'Limited' }
                ]} 
                value={filters.parkingAvailability} 
                onChange={(val) => handleInputChange('parkingAvailability', val)} 
                placeholder="Select Parking" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">Property Age</label>
              <CustomSelect 
               
                options={[
                  { value: '', label: 'Select Age' },
                  { value: '0-1', label: '0-1 Year' },
                  { value: '1-3', label: '1-3 Years' },
                  { value: '3-5', label: '3-5 Years' },
                  { value: '5-10', label: '5-10 Years' },
                  { value: '10+', label: '10+ Years' }
                ]} 
                value={filters.propertyAge} 
                onChange={(val) => handleInputChange('propertyAge', val)} 
                placeholder="Select Age" 
              />
            </div>
            {(currentTab === 'Buy' || currentTab === 'Sell' || currentTab === 'Lease') && (
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-1">Ownership Type</label>
                <div className="flex gap-3 mt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="ownershipType" value="Freehold" checked={filters.ownershipType === 'Freehold'} onChange={(e) => handleInputChange('ownershipType', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Freehold</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="ownershipType" value="Leasehold" checked={filters.ownershipType === 'Leasehold'} onChange={(e) => handleInputChange('ownershipType', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Leasehold</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Furnishing Type</label>
            <div className="flex gap-3">
              {['Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map(type => (
                <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name="furnishingType" value={type} checked={filters.furnishingType === type} onChange={(e) => handleInputChange('furnishingType', e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderShopFeatures = () => (
    <div className="mb-3">
      <SectionHeader emoji="🛍️" title="Shop Features" section="shopFeatures" />
      {expandedSections.shopFeatures && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-1.5">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.displayWindow} onChange={(e) => handleCheckboxChange('displayWindow', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Display Window / Showcase Area</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.storageRoom} onChange={(e) => handleCheckboxChange('storageRoom', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Storage Room</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.washroom} onChange={(e) => handleCheckboxChange('washroom', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Washroom</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.pantry} onChange={(e) => handleCheckboxChange('pantry', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Pantry</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.airConditioning} onChange={(e) => handleCheckboxChange('airConditioning', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Air Conditioning</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.signageSpace} onChange={(e) => handleCheckboxChange('signageSpace', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Signage Space</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.billingCounter} onChange={(e) => handleCheckboxChange('billingCounter', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Billing Counter Area</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.loadingUnloading} onChange={(e) => handleCheckboxChange('loadingUnloading', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Loading / Unloading Access</span>
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
        <div className="mt-2 space-y-3 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-1.5">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.security24x7} onChange={(e) => handleCheckboxChange('security24x7', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">24/7 Security</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.cctv} onChange={(e) => handleCheckboxChange('cctv', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">CCTV Surveillance</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.powerBackup} onChange={(e) => handleCheckboxChange('powerBackup', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Power Backup</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.liftEscalator} onChange={(e) => handleCheckboxChange('liftEscalator', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Lift / Escalator Access</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.fireSafety} onChange={(e) => handleCheckboxChange('fireSafety', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Fire Safety Compliance</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.visitorParking} onChange={(e) => handleCheckboxChange('visitorParking', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Visitor Parking</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.internetBroadband} onChange={(e) => handleCheckboxChange('internetBroadband', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Internet / Broadband Ready</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.generatorBackup} onChange={(e) => handleCheckboxChange('generatorBackup', e.target.checked)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">Generator Backup</span>
            </label>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Other Amenities</label>
            <AmenitiesTags 
              selectedAmenities={filters.selectedAmenities}
              onAdd={handleAddAmenity}
              onRemove={handleRemoveAmenity}
            />
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
            <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={filters.businessTypes.includes(type)} onChange={() => handleArrayToggle('businessTypes', type)} className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">{type}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const renderNearbyAccess = () => (
    <div className="mb-3">
      <SectionHeader emoji="🚗" title="Nearby Access" section="nearby" />
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
              {(currentTab === 'Rent' ? ['Owner', 'Agent'] : ['Owner', 'Agent', 'Builder']).map(type => {
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
                <input type="radio" name="priceNegotiableBuy" checked={filters.priceNegotiable === true} onChange={() => handleCheckboxChange('priceNegotiable', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="priceNegotiableBuy" checked={filters.priceNegotiable === false} onChange={() => handleCheckboxChange('priceNegotiable', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Maintenance Charges</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maintenanceCharges} onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Loan Required</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="loanRequiredBuy" checked={filters.loanRequired === true} onChange={() => handleCheckboxChange('loanRequired', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="loanRequiredBuy" checked={filters.loanRequired === false} onChange={() => handleCheckboxChange('loanRequired', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
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
            <label className="text-sm text-teal-800 font-medium block mb-1">Selling Price (Min – Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.minPrice} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maxPrice} onChange={(e) => handleInputChange('maxPrice', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Price Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="priceNegotiableSell" checked={filters.priceNegotiable === true} onChange={() => handleCheckboxChange('priceNegotiable', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="priceNegotiableSell" checked={filters.priceNegotiable === false} onChange={() => handleCheckboxChange('priceNegotiable', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
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
                <input type="radio" name="maintenanceIncludedRent" checked={filters.maintenanceIncluded === true} onChange={() => handleCheckboxChange('maintenanceIncluded', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedRent" checked={filters.maintenanceIncluded === false} onChange={() => handleCheckboxChange('maintenanceIncluded', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Rent Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="rentNegotiable" checked={filters.rentNegotiable === true} onChange={() => handleCheckboxChange('rentNegotiable', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="rentNegotiable" checked={filters.rentNegotiable === false} onChange={() => handleCheckboxChange('rentNegotiable', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
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
            <label className="text-sm text-teal-800 font-medium block mb-1">Lease Amount (Min – Max)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-1">Refundable Deposit</label>
            <input type="number" placeholder="Enter amount" className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500" value={filters.refundableDeposit} onChange={(e) => handleInputChange('refundableDeposit', e.target.value)} />
          </div>
          <div>
            <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Maintenance Charges Included</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedLease" checked={filters.maintenanceIncluded === true} onChange={() => handleCheckboxChange('maintenanceIncluded', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="maintenanceIncludedLease" checked={filters.maintenanceIncluded === false} onChange={() => handleCheckboxChange('maintenanceIncluded', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Lease Negotiable</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="leaseNegotiable" checked={filters.leaseNegotiable === true} onChange={() => handleCheckboxChange('leaseNegotiable', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="leaseNegotiable" checked={filters.leaseNegotiable === false} onChange={() => handleCheckboxChange('leaseNegotiable', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
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
                    <input type="radio" name="immediateOccupancyRent" checked={filters.immediateOccupancy === true} onChange={() => handleCheckboxChange('immediateOccupancy', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediateOccupancyRent" checked={filters.immediateOccupancy === false} onChange={() => handleCheckboxChange('immediateOccupancy', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <CustomDatePicker label="Available From (Date)" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
              <CustomSelect label="Minimum Rental Duration" options={durationOptions} value={filters.minRentalDuration} onChange={(val) => handleInputChange('minRentalDuration', val)} placeholder="Select Duration" />
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
                    <input type="radio" name="immediateOccupancyLease" checked={filters.immediateOccupancy === true} onChange={() => handleCheckboxChange('immediateOccupancy', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediateOccupancyLease" checked={filters.immediateOccupancy === false} onChange={() => handleCheckboxChange('immediateOccupancy', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <CustomDatePicker label="Available From (Date)" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Lease Renewal Option</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="leaseRenewalOption" checked={filters.leaseRenewalOption === true} onChange={() => handleCheckboxChange('leaseRenewalOption', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="leaseRenewalOption" checked={filters.leaseRenewalOption === false} onChange={() => handleCheckboxChange('leaseRenewalOption', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
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
                    <input type="radio" name="readyToOccupy" checked={filters.readyToOccupy === true} onChange={() => handleCheckboxChange('readyToOccupy', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="readyToOccupy" checked={filters.readyToOccupy === false} onChange={() => handleCheckboxChange('readyToOccupy', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Under Construction</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="underConstruction" checked={filters.underConstruction === true} onChange={() => handleCheckboxChange('underConstruction', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="underConstruction" checked={filters.underConstruction === false} onChange={() => handleCheckboxChange('underConstruction', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-teal-800 font-medium block mb-2">Immediate Possession</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediatePossession" checked={filters.immediatePossession === true} onChange={() => handleCheckboxChange('immediatePossession', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input type="radio" name="immediatePossession" checked={filters.immediatePossession === false} onChange={() => handleCheckboxChange('immediatePossession', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
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

  const renderLegal = () => (
    <div className="mb-3">
      <SectionHeader emoji="⚖️" title="Legal Details" section="legal" />
      {expandedSections.legal && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Title Deed Verified</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="titleDeedVerified" checked={filters.titleDeedVerified === true} onChange={() => handleCheckboxChange('titleDeedVerified', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="titleDeedVerified" checked={filters.titleDeedVerified === false} onChange={() => handleCheckboxChange('titleDeedVerified', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Loan Eligible</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="loanEligible" checked={filters.loanEligible === true} onChange={() => handleCheckboxChange('loanEligible', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="loanEligible" checked={filters.loanEligible === false} onChange={() => handleCheckboxChange('loanEligible', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">RERA Approved</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="reraApproved" checked={filters.reraApproved === true} onChange={() => handleCheckboxChange('reraApproved', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="reraApproved" checked={filters.reraApproved === false} onChange={() => handleCheckboxChange('reraApproved', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-teal-800 font-medium block mb-2">Commercial License Available</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="commercialLicense" checked={filters.commercialLicense === true} onChange={() => handleCheckboxChange('commercialLicense', true)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">Yes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <input type="radio" name="commercialLicense" checked={filters.commercialLicense === false} onChange={() => handleCheckboxChange('commercialLicense', false)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">No</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
              <Store className="w-5 h-5 text-white slow-rotate" />
            </div>
            <h3 className="text-white font-semibold text-sm md:text-base">Filter Retail Shop</h3>
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
        {renderShopFeatures()}
        {renderAmenities()}
        {renderBusinessSuitability()}
        {renderAvailability()}
        {(currentTab === 'Buy' || currentTab === 'Sell') && renderLegal()}
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

export default RetailShopFilter;