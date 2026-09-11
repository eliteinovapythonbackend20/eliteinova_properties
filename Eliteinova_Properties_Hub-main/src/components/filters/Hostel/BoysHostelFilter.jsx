// BoysHostelFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  X, ChevronDown, ChevronUp, Users, MapPin, IndianRupee, Shield, CheckCircle,
  RefreshCw, Calendar, Wifi, Droplet, Zap, Car, Dumbbell, Tv,
  Utensils, BedDouble, Bath, Video, Key, BookOpen, Sparkles,
  Home, Phone, Clock, ChevronDown as ChevronDownIcon, UserCheck, Sofa, Wind,
  ArrowUpDown, DollarSign, FileText, Filter, Star, Heart, 
  Award, GraduationCap, Bus, Coffee, Moon, Sun, ShowerHead,
  CookingPot, Lock, Bell, BellRing, DoorOpen, Flame, Snowflake
} from 'lucide-react';

// Custom Select Component with enhanced styling
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
      <label className="text-xs text-teal-800 font-semibold block mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm text-left flex justify-between items-center focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 hover:bg-teal-50 transition-all duration-200"
      >
        <span className={selectedOption ? 'text-teal-800 text-xs font-medium' : 'text-gray-400 text-xs'}>
          {selectedOption ? selectedOption.label : placeholder || `Select ${label}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-teal-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border-2 border-teal-200 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs text-left transition-all duration-150 ${
                value === opt.value ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white' : 'text-teal-700 hover:bg-teal-500 hover:text-white'
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

// Enhanced Date Picker with Hostel theme
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
      calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === todayDate && viewMonth === todayMonth && viewYear === todayYear;
      const isSelected = selectedDate === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      calendarDays.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={`h-10 w-10 rounded-xl text-sm font-medium transition-all duration-200 ${
            isSelected 
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg scale-95' 
              : isToday 
                ? 'bg-teal-100 text-teal-700 border-2 border-teal-300' 
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
      <label className="text-xs text-teal-800 font-semibold block mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={selectedDate}
          onFocus={() => setIsOpen(true)}
          readOnly
          placeholder="Select Date"
          className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 pointer-events-none" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-2xl shadow-2xl border-2 border-teal-200 overflow-hidden" style={{ width: '300px' }}>
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 flex items-center justify-between">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors">
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="text-white font-semibold text-sm">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors">
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map(day => (
                <div key={day} className="h-10 w-10 flex items-center justify-center text-xs font-semibold text-teal-600">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            <div className="mt-3 pt-2 border-t-2 border-teal-100 flex justify-between">
              <button type="button" onClick={() => {
                const today = new Date();
                const formattedToday = today.toISOString().split('T')[0];
                setSelectedDate(formattedToday);
                onChange(formattedToday);
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                setIsOpen(false);
              }} className="text-xs text-teal-600 hover:text-teal-700 font-medium px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors">Today</button>
              <button type="button" onClick={() => {
                setSelectedDate('');
                onChange('');
                setIsOpen(false);
              }} className="text-xs text-teal-400 hover:text-teal-600 font-medium px-3 py-1 rounded-lg hover:bg-teal-50 transition-colors">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const BoysHostelFilter = ({ activeTab = 'Buy', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState('Buy');
  const [activeSection, setActiveSection] = useState('basic');
  const [filters, setFilters] = useState({
    listingType: [],
    city: '', locality: '', landmark: '', distanceFrom: '',
    minPrice: '', maxPrice: '', priceNegotiable: '',
    minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
    minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseDuration: '', leaseNegotiable: '',
    sharingType: [], roomType: '', bathroomType: '', furnishing: '',
    amenities: [],
    foodIncluded: '', foodType: '', mealsPerDay: '', kitchenAccess: '',
    security24x7: '', cctv: '', wardenOnPremises: '', curfewTime: '', visitorPolicy: '', idProofRequired: '',
    immediateOccupancy: '', availableFrom: '', minStayDuration: '',
    immediatePossession: '', readyToBuy: '', underConstruction: '',
    contactOwner: false, contactAgent: false, contactWarden: false, preferredContactTime: ''
  });

  // Options Arrays
  const sharingOptions = [
    { value: 'Single', label: 'Single', icon: '👤' },
    { value: 'Double', label: 'Double', icon: '👥' },
    { value: 'Triple', label: 'Triple', icon: '👤👤👤' },
    { value: '4-Sharing', label: '4-Sharing', icon: '👥👥' },
    { value: 'Dormitory', label: 'Dormitory', icon: '🏛️' }
  ];

  const roomTypeOptions = [
    { value: 'AC', label: '❄️ AC Room' },
    { value: 'NonAC', label: '🌬️ Non-AC Room' }
  ];

  const bathroomOptions = [
    { value: 'Attached', label: '🚿 Attached Bathroom' },
    { value: 'Common', label: '🚻 Common Bathroom' }
  ];

  const furnishingOptions = [
    { value: 'Fully', label: '🪑 Fully Furnished' },
    { value: 'Semi', label: '🛋️ Semi Furnished' },
    { value: 'Unfurnished', label: '📦 Unfurnished' }
  ];

  const foodTypeOptions = [
    { value: 'Veg', label: '🥬 Vegetarian Only' },
    { value: 'NonVeg', label: '🍗 Non-Vegetarian Available' },
    { value: 'Both', label: '🍽️ Both Available' }
  ];

  const mealsOptions = [
    { value: '2', label: '2 Meals / Day' },
    { value: '3', label: '3 Meals / Day' },
    { value: 'Custom', label: 'Custom / Optional' }
  ];

  const curfewOptions = [
    { value: '8pm', label: '🌙 Before 8:00 PM' },
    { value: '9pm', label: '🌙 Before 9:00 PM' },
    { value: '10pm', label: '🌙 Before 10:00 PM' },
    { value: 'None', label: '✨ No Curfew' }
  ];

  const visitorOptions = [
    { value: 'NotAllowed', label: '🚫 Visitors Not Allowed' },
    { value: 'CommonArea', label: '🏠 Allowed in Common Area' },
    { value: 'Flexible', label: '🤝 Flexible Policy' }
  ];

  const stayDurationOptions = [
    { value: '1', label: '1 Month' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '11', label: '11 Months' },
    { value: '12', label: '12 Months' }
  ];

  const leaseDurationOptions = [
    { value: '1', label: '1 Year' },
    { value: '3', label: '3 Years' },
    { value: '5', label: '5 Years' },
    { value: '5+', label: '5+ Years' }
  ];

  const contactTimeOptions = [
    { value: 'Morning', label: '🌅 Morning (9 AM – 12 PM)' },
    { value: 'Afternoon', label: '☀️ Afternoon (12 PM – 4 PM)' },
    { value: 'Evening', label: '🌆 Evening (4 PM – 7 PM)' },
    { value: 'Any', label: '🕐 Any Time' }
  ];

  const amenityOptions = [
    { value: 'WiFi', label: 'WiFi', icon: <Wifi className="w-4 h-4" />, color: 'from-blue-400 to-blue-600' },
    { value: 'Laundry', label: 'Laundry', icon: <Sofa className="w-4 h-4" />, color: 'from-purple-400 to-purple-600' },
    { value: 'Power Backup', label: 'Power Backup', icon: <Zap className="w-4 h-4" />, color: 'from-yellow-400 to-yellow-600' },
    { value: 'Hot Water', label: 'Hot Water', icon: <Droplet className="w-4 h-4" />, color: 'from-red-400 to-red-600' },
    { value: 'Parking', label: 'Parking', icon: <Car className="w-4 h-4" />, color: 'from-gray-400 to-gray-600' },
    { value: 'Gym', label: 'Gym', icon: <Dumbbell className="w-4 h-4" />, color: 'from-orange-400 to-orange-600' },
    { value: 'Study Room', label: 'Study Room', icon: <BookOpen className="w-4 h-4" />, color: 'from-indigo-400 to-indigo-600' },
    { value: 'Common TV Room', label: 'Common TV Room', icon: <Tv className="w-4 h-4" />, color: 'from-pink-400 to-pink-600' },
    { value: 'Lift', label: 'Lift', icon: <ArrowUpDown className="w-4 h-4" />, color: 'from-cyan-400 to-cyan-600' },
    { value: 'AC', label: 'AC', icon: <Wind className="w-4 h-4" />, color: 'from-green-400 to-green-600' }
  ];

  const tabs = [
    { id: 'Buy', label: 'Buy', icon: <DollarSign className="w-4 h-4" />, emoji: '💰' },
    { id: 'Rent', label: 'Rent', icon: <IndianRupee className="w-4 h-4" />, emoji: '🏠' },
    { id: 'Lease', label: 'Lease', icon: <FileText className="w-4 h-4" />, emoji: '📄' }
  ];

  const sections = [
    { id: 'basic', label: 'Basic Details', icon: '📋' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'price', label: 'Pricing', icon: '💰' },
    { id: 'room', label: 'Room & Sharing', icon: '🛏️' },
    { id: 'amenities', label: 'Amenities', icon: '✨' },
    { id: 'food', label: 'Food & Mess', icon: '🍽️' },
    { id: 'safety', label: 'Safety & Rules', icon: '🛡️' },
    { id: 'availability', label: 'Availability', icon: '📅' },
    { id: 'contact', label: 'Contact', icon: '📞' }
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? '' : sectionId);
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
    const filtersToSend = { ...filters, purpose: currentTab, propertyType: 'Boys Hostel' };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      listingType: [],
      city: '', locality: '', landmark: '', distanceFrom: '',
      minPrice: '', maxPrice: '', priceNegotiable: '',
      minRent: '', maxRent: '', securityDeposit: '', maintenanceIncluded: '', rentNegotiable: '',
      minLeaseAmount: '', maxLeaseAmount: '', refundableDeposit: '', leaseDuration: '', leaseNegotiable: '',
      sharingType: [], roomType: '', bathroomType: '', furnishing: '',
      amenities: [],
      foodIncluded: '', foodType: '', mealsPerDay: '', kitchenAccess: '',
      security24x7: '', cctv: '', wardenOnPremises: '', curfewTime: '', visitorPolicy: '', idProofRequired: '',
      immediateOccupancy: '', availableFrom: '', minStayDuration: '',
      immediatePossession: '', readyToBuy: '', underConstruction: '',
      contactOwner: false, contactAgent: false, contactWarden: false, preferredContactTime: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (Array.isArray(value) && value.length > 0) count++;
      else if (typeof value === 'string' && value !== '' && value !== 'undefined') count++;
      else if (typeof value === 'boolean' && value === true) count++;
    });
    return count;
  };

  // Section Components
  const Section = ({ id, label, icon, children }) => (
    <div className="mb-3">
      <button
        onClick={() => handleSectionClick(id)}
        className="w-full group"
        type="button"
      >
        <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
          activeSection === id 
            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-200' 
            : 'bg-white hover:bg-teal-50 border-2 border-teal-200 text-teal-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`text-xl ${activeSection === id ? 'animate-bounce' : ''}`}>{icon}</span>
            <span className={`font-semibold text-sm ${activeSection === id ? 'text-white' : 'text-teal-800'}`}>{label}</span>
            {activeSection !== id && (
              <span className="text-xs text-teal-400 opacity-50">{getSectionFilterCount(id)} filters</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeSection === id ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {activeSection === id && (
        <div className="mt-2 p-4 bg-white rounded-2xl border-2 border-teal-200 shadow-inner animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );

  const getSectionFilterCount = (sectionId) => {
    // Simplified - returns count of active filters in section
    return 0;
  };

  // Render Functions
  const renderBasicDetails = () => (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-1">Property Type</label>
        <input type="text" value="Boys Hostel" disabled className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-gray-50/80 text-sm text-gray-600" />
      </div>
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-1">Purpose</label>
        <input type="text" value={currentTab} disabled className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-gray-50/80 text-sm text-gray-600" />
      </div>
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-2">Listed By</label>
        <div className="flex gap-3 flex-wrap">
          {['Owner', 'Agent', 'Warden'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={filters.listingType.includes(type)} onChange={(e) => {
                const newList = e.target.checked ? [...filters.listingType, type] : filters.listingType.filter(t => t !== type);
                handleInputChange('listingType', newList);
              }} className="w-4 h-4 rounded-lg border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLocationDetails = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-teal-800 font-semibold block mb-1">City</label>
          <input type="text" placeholder="Enter city" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.city} onChange={(e) => handleInputChange('city', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-teal-800 font-semibold block mb-1">Locality</label>
          <input type="text" placeholder="Enter locality" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.locality} onChange={(e) => handleInputChange('locality', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-1">Landmark</label>
        <input type="text" placeholder="Nearby landmark" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-1">Distance From</label>
        <input type="text" placeholder="e.g. within 2 km of college" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.distanceFrom} onChange={(e) => handleInputChange('distanceFrom', e.target.value)} />
      </div>
    </div>
  );

  const renderPricing = () => {
    if (currentTab === 'Buy') {
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Price Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Min ₹" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.minPrice} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.maxPrice} onChange={(e) => handleInputChange('maxPrice', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-2">Price Negotiable</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="priceNegotiable" value={option} checked={filters.priceNegotiable === option} onChange={(e) => handleRadioChange('priceNegotiable', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (currentTab === 'Rent') {
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Monthly Rent</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Min ₹" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.minRent} onChange={(e) => handleInputChange('minRent', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.maxRent} onChange={(e) => handleInputChange('maxRent', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Security Deposit</label>
            <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.securityDeposit} onChange={(e) => handleInputChange('securityDeposit', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-teal-800 font-semibold block mb-2">Maintenance Included</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="maintenanceIncluded" value={option} checked={filters.maintenanceIncluded === option} onChange={(e) => handleRadioChange('maintenanceIncluded', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-teal-800 font-semibold block mb-2">Rent Negotiable</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="rentNegotiable" value={option} checked={filters.rentNegotiable === option} onChange={(e) => handleRadioChange('rentNegotiable', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Lease Amount</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Min ₹" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.minLeaseAmount} onChange={(e) => handleInputChange('minLeaseAmount', e.target.value)} />
              <input type="number" placeholder="Max ₹" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.maxLeaseAmount} onChange={(e) => handleInputChange('maxLeaseAmount', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-1">Refundable Deposit</label>
            <input type="number" placeholder="Enter amount" className="w-full px-3 py-2 rounded-xl border-2 border-teal-200 bg-white/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30" value={filters.refundableDeposit} onChange={(e) => handleInputChange('refundableDeposit', e.target.value)} />
          </div>
          <CustomSelect label="Lease Duration" options={leaseDurationOptions} value={filters.leaseDuration} onChange={(val) => handleInputChange('leaseDuration', val)} placeholder="Select Duration" />
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-2">Lease Negotiable</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="leaseNegotiable" value={option} checked={filters.leaseNegotiable === option} onChange={(e) => handleRadioChange('leaseNegotiable', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderRoomSharing = () => (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-2">Sharing Type</label>
        <div className="grid grid-cols-2 gap-2">
          {sharingOptions.map((s) => (
            <label key={s.value} className="flex items-center gap-2 p-2 rounded-xl border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 hover:shadow-md">
              <input type="checkbox" checked={filters.sharingType.includes(s.value)} onChange={() => handleArrayToggle('sharingType', s.value)} className="w-4 h-4 rounded-lg border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-sm text-teal-700 font-medium">{s.icon} {s.label}</span>
            </label>
          ))}
        </div>
      </div>
      <CustomSelect label="Room Type" options={roomTypeOptions} value={filters.roomType} onChange={(val) => handleInputChange('roomType', val)} placeholder="Select room type" />
      <CustomSelect label="Bathroom Type" options={bathroomOptions} value={filters.bathroomType} onChange={(val) => handleInputChange('bathroomType', val)} placeholder="Select bathroom type" />
      <CustomSelect label="Furnishing" options={furnishingOptions} value={filters.furnishing} onChange={(val) => handleInputChange('furnishing', val)} placeholder="Select furnishing" />
    </div>
  );

  const renderAmenities = () => (
    <div className="grid grid-cols-2 gap-2">
      {amenityOptions.map((a) => (
        <label key={a.value} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border-2 border-teal-200 hover:border-teal-500 cursor-pointer transition-all duration-300 hover:shadow-md">
          <input type="checkbox" checked={filters.amenities.includes(a.value)} onChange={() => handleArrayToggle('amenities', a.value)} className="w-4 h-4 rounded-lg border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
          <span className={`text-teal-600 bg-gradient-to-r ${a.color} bg-clip-text text-transparent`}>{a.icon}</span>
          <span className="text-xs text-teal-700 font-medium">{a.label}</span>
        </label>
      ))}
    </div>
  );

  const renderFoodMess = () => (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-2">Food Included in Rent</label>
        <div className="flex gap-4">
          {['Yes', 'No'].map(option => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="foodIncluded" value={option} checked={filters.foodIncluded === option} onChange={(e) => handleRadioChange('foodIncluded', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>
      <CustomSelect label="Food Type" options={foodTypeOptions} value={filters.foodType} onChange={(val) => handleInputChange('foodType', val)} placeholder="Select food type" />
      <CustomSelect label="Meals Provided" options={mealsOptions} value={filters.mealsPerDay} onChange={(val) => handleInputChange('mealsPerDay', val)} placeholder="Select meals" />
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-2">Kitchen Access</label>
        <div className="flex gap-4">
          {['Yes', 'No'].map(option => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="kitchenAccess" value={option} checked={filters.kitchenAccess === option} onChange={(e) => handleRadioChange('kitchenAccess', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
              <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSafetyRules = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'security24x7', label: '24/7 Security', icon: <Shield className="w-4 h-4" /> },
          { key: 'cctv', label: 'CCTV', icon: <Video className="w-4 h-4" /> },
          { key: 'wardenOnPremises', label: 'Warden', icon: <UserCheck className="w-4 h-4" /> },
          { key: 'idProofRequired', label: 'ID Proof', icon: <Key className="w-4 h-4" /> }
        ].map(({ key, label, icon }) => (
          <div key={key} className="p-2 rounded-xl bg-teal-50 border-2 border-teal-200">
            <label className="text-xs text-teal-800 font-semibold block mb-2 flex items-center gap-1">{icon} {label}</label>
            <div className="flex gap-3">
              {['Yes', 'No'].map(option => (
                <label key={option} className="flex items-center gap-1.5 cursor-pointer group">
                  <input type="radio" name={key} value={option} checked={filters[key] === option} onChange={(e) => handleRadioChange(key, e.target.value)} className="w-3.5 h-3.5 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-xs text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CustomSelect label="Curfew Timing" options={curfewOptions} value={filters.curfewTime} onChange={(val) => handleInputChange('curfewTime', val)} placeholder="Select curfew" />
      <CustomSelect label="Visitor Policy" options={visitorOptions} value={filters.visitorPolicy} onChange={(val) => handleInputChange('visitorPolicy', val)} placeholder="Select policy" />
    </div>
  );

  const renderAvailability = () => {
    if (currentTab === 'Rent') {
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-2">Immediate Occupancy</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="immediateOccupancy" value={option} checked={filters.immediateOccupancy === option} onChange={(e) => handleRadioChange('immediateOccupancy', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <CustomDatePicker label="Available From" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
          <CustomSelect label="Minimum Stay" options={stayDurationOptions} value={filters.minStayDuration} onChange={(val) => handleInputChange('minStayDuration', val)} placeholder="Select duration" />
        </div>
      );
    } else if (currentTab === 'Lease') {
      return (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-teal-800 font-semibold block mb-2">Immediate Occupancy</label>
            <div className="flex gap-4">
              {['Yes', 'No'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="immediateOccupancy" value={option} checked={filters.immediateOccupancy === option} onChange={(e) => handleRadioChange('immediateOccupancy', e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                  <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <CustomDatePicker label="Available From" value={filters.availableFrom} onChange={(val) => handleInputChange('availableFrom', val)} />
          <CustomSelect label="Minimum Lease" options={stayDurationOptions} value={filters.minStayDuration} onChange={(val) => handleInputChange('minStayDuration', val)} placeholder="Select duration" />
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          {[
            { key: 'readyToBuy', label: 'Ready to Buy' },
            { key: 'underConstruction', label: 'Under Construction' },
            { key: 'immediatePossession', label: 'Immediate Possession' }
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs text-teal-800 font-semibold block mb-2">{label}</label>
              <div className="flex gap-4">
                {['Yes', 'No'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name={key} value={option} checked={filters[key] === option} onChange={(e) => handleRadioChange(key, e.target.value)} className="w-4 h-4 border-2 border-teal-300 text-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                    <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderContactPreference = () => (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-teal-800 font-semibold block mb-2">Contact</label>
        <div className="flex gap-3 flex-wrap">
          {['Owner', 'Agent', 'Warden'].map(type => {
            const field = `contact${type}`;
            return (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={filters[field]} onChange={(e) => handleCheckboxChange(field, e.target.checked)} className="w-4 h-4 rounded-lg border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0 focus:outline-none accent-teal-600" />
                <span className="text-sm text-teal-700 group-hover:text-teal-600 font-medium">{type}</span>
              </label>
            );
          })}
        </div>
      </div>
      <CustomSelect label="Preferred Contact Time" options={contactTimeOptions} value={filters.preferredContactTime} onChange={(val) => handleInputChange('preferredContactTime', val)} placeholder="Select Time" />
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-2xl border-2 border-teal-100 overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-teal-100">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm md:text-base">Find Your Perfect Hostel</h3>
              <p className="text-white/70 text-xs">{getActiveFilterCount()} filters active</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition-all text-white/80 hover:text-white" type="button">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex border-b-2 border-teal-100 bg-teal-50/30 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              type="button"
              className={`flex-1 py-3 text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative ${
                currentTab === tab.id 
                  ? 'text-teal-700 bg-white shadow-sm' 
                  : 'text-teal-500 hover:text-teal-700 hover:bg-teal-50/50'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
              {currentTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 to-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-4 custom-scroll" style={{ maxHeight: 'calc(90vh - 120px)' }}>
        <div className="space-y-1">
          <Section id="basic" label="Basic Details" icon="📋">
            {renderBasicDetails()}
          </Section>
          <Section id="location" label="Location" icon="📍">
            {renderLocationDetails()}
          </Section>
          <Section id="price" label="Pricing" icon="💰">
            {renderPricing()}
          </Section>
          <Section id="room" label="Room & Sharing" icon="🛏️">
            {renderRoomSharing()}
          </Section>
          <Section id="amenities" label="Amenities" icon="✨">
            {renderAmenities()}
          </Section>
          <Section id="food" label="Food & Mess" icon="🍽️">
            {renderFoodMess()}
          </Section>
          <Section id="safety" label="Safety & Rules" icon="🛡️">
            {renderSafetyRules()}
          </Section>
          <Section id="availability" label="Availability" icon="📅">
            {renderAvailability()}
          </Section>
          <Section id="contact" label="Contact" icon="📞">
            {renderContactPreference()}
          </Section>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t-2 border-teal-100">
        <div className="flex gap-3">
          <button
            onClick={clearAllFilters}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-teal-300 text-teal-700 font-semibold text-sm hover:bg-teal-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            type="button"
          >
            <RefreshCw className="w-4 h-4" /> Reset All
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            type="button"
          >
            <CheckCircle className="w-4 h-4" /> Apply Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #F0FDF4;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BoysHostelFilter;