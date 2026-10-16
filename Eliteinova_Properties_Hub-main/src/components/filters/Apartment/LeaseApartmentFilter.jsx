import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Filter, MapPin, Bed, Bath, Maximize, 
  Calendar, Users, Wifi, Dog, Clock, Building, 
  DollarSign, Home, ChevronDown, ChevronUp, TrendingUp, 
  FileText, CheckCircle, AlertCircle, Car, Shield, 
  Wind, Coffee, Droplet, Layers, Layout,
  Smartphone, Mail, Phone, MessageCircle, Globe,
  Sun, Sunset, Compass, Hash, Box, Scissors,
  ChevronLeft, ChevronRight,X, RefreshCw
} from 'lucide-react';

// ── Small Teal Calendar Popup ────────
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const ThemedDatePicker = ({ label, value, onChange }) => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(value ? new Date(value) : null);
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (inputRef.current && selected) {
      const y = selected.getFullYear();
      const m = String(selected.getMonth()+1).padStart(2,'0');
      const d = String(selected.getDate()).padStart(2,'0');
      inputRef.current.value = `${y}-${m}-${d}`;
    }
  }, [selected]);

  const prevMonth = () => { if (viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const nextMonth = () => { if (viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();

  const isToday = (d) => d===today.getDate() && viewMonth===today.getMonth() && viewYear===today.getFullYear();
  const isSelected = (d) => selected && d===selected.getDate() && viewMonth===selected.getMonth() && viewYear===selected.getFullYear();

  const cells = [];
  for (let i=0; i<firstDay; i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(d);

  return (
    <div className="mb-1.5 sm:mb-2 relative" ref={ref}>
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5 sm:mb-1">{label}</label>
      <input
        ref={inputRef}
        type="date"
        onFocus={() => setOpen(true)}
        onClick={(e) => { e.preventDefault(); setOpen(true); }}
        onKeyDown={(e) => e.preventDefault()}
        className="w-full px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm cursor-pointer"
        readOnly
      />
      {open && (
        <div className="relative left-0 z-[9999] rounded-xl overflow-hidden" style={{ top: 'calc(100% + 4px)', width: '220px', boxShadow: '0 8px 24px -4px rgba(13,148,136,0.4), 0 0 0 2px rgba(13,148,136,0.25)' }}>
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-between px-2 py-1">
            <button type="button" onClick={prevMonth} className="p-0.5 rounded hover:bg-white/20 text-white transition-colors"><ChevronLeft className="w-3 h-3" /></button>
            <span className="text-white font-bold text-[10px] tracking-wide">{MONTHS[viewMonth].slice(0,3)} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="p-0.5 rounded hover:bg-white/20 text-white transition-colors"><ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="bg-teal-50 grid grid-cols-7 border-b border-teal-100">
            {DAYS.map(d => <div key={d} className="text-center text-[8px] font-bold text-teal-600 py-0.5">{d}</div>)}
          </div>
          <div className="bg-white grid grid-cols-7 p-1 gap-0.5">
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} />;
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button key={day} type="button" onClick={() => { const d = new Date(viewYear, viewMonth, day); setSelected(d); onChange?.(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`); setOpen(false); }}
                  className={`w-full rounded text-[9px] font-semibold py-0.5 transition-all duration-150 ${sel ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm' : tod ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-400' : 'text-teal-800 hover:bg-teal-100'}`}>
                  {day}
                </button>
              );
            })}
          </div>
          <div className="bg-teal-50 border-t border-teal-100 flex justify-between px-2 py-0.5">
            <button type="button" onClick={() => { setSelected(today); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); onChange?.(`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`); setOpen(false); }} className="text-[8px] font-bold text-teal-600 hover:text-teal-800 transition-colors">Today</button>
            <button type="button" onClick={() => { setSelected(null); if(inputRef.current) inputRef.current.value=''; onChange?.(''); setOpen(false); }} className="text-[8px] font-bold text-teal-400 hover:text-teal-600 transition-colors">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Every one of these used to be defined INSIDE the main component below. A
// component defined inside another component's body is recreated (new
// function identity) on every render, so React unmounts and remounts the
// <input> it renders every time - which is why, once these fields became
// controlled, typing a single character lost focus: the setState from that
// keystroke re-rendered the parent, which redefined InputField etc. as a new
// type, and React threw away the old DOM node. Hoisting them out here, as
// plain module-level components with no closure over the parent, keeps their
// identity stable across renders so the underlying <input> is never remounted.
const FilterSection = ({ title, children }) => {
  const emoji = title.match(/^\S+/)?.[0] || '';
  const rest = title.slice(emoji.length);
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border-2 border-teal-100 mb-2 sm:mb-3 transition-all duration-300 hover:shadow-xl hover:shadow-teal-200 hover:-translate-y-1 hover:border-teal-300 overflow-visible relative">
      <style>{`
        @keyframes wiggle { 0% { transform: rotate(0deg) scale(1); } 15% { transform: rotate(-15deg) scale(1.2); } 30% { transform: rotate(12deg) scale(1.25); } 45% { transform: rotate(-10deg) scale(1.2); } 60% { transform: rotate(8deg) scale(1.15); } 75% { transform: rotate(-5deg) scale(1.1); } 100% { transform: rotate(0deg) scale(1); } }
        @keyframes continuousBounce { 0%, 100% { transform: translateY(0px) scale(1); } 25% { transform: translateY(-4px) scale(1.1); } 50% { transform: translateY(0px) scale(1); } 75% { transform: translateY(-2px) scale(1.05); } }
        .emoji-wrap { display: inline-block; animation: continuousBounce 2s ease-in-out infinite; }
        .emoji-wrap:hover { animation: wiggle 0.6s ease forwards; }
      `}</style>
      <div className="px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r from-teal-100 to-emerald-100 border-b-2 border-teal-200 rounded-t-xl sm:rounded-t-2xl">
        <h3 className="font-bold text-teal-800 text-xs sm:text-sm md:text-base">
          <span className="emoji-wrap">{emoji}</span>
          {rest}
        </h3>
      </div>
      <div className="p-1.5 sm:p-2 overflow-visible">{children}</div>
    </div>
  );
};

const InputField = ({ label, placeholder, type = "text", value, onChange }) => (
  <div className="mb-1.5 sm:mb-2">
    <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
    <input type={type} placeholder={placeholder} value={value ?? ''} onChange={onChange ? (e) => onChange(e.target.value) : undefined} readOnly={!onChange} className="w-full px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
  </div>
);

const InputRange = ({ label, minPlaceholder, maxPlaceholder, minValue, maxValue, onMinChange, onMaxChange }) => (
  <div className="mb-1.5 sm:mb-2">
    <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
    <div className="flex gap-2 sm:gap-3">
      <input type="number" placeholder={minPlaceholder} value={minValue ?? ''} onChange={(e) => onMinChange?.(e.target.value)} className="w-1/2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
      <input type="number" placeholder={maxPlaceholder} value={maxValue ?? ''} onChange={(e) => onMaxChange?.(e.target.value)} className="w-1/2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
    </div>
  </div>
);

const NumberInputField = ({ label, placeholder, value, onChange }) => (
  <div className="mb-1.5 sm:mb-2">
    <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
    <input type="number" placeholder={placeholder} value={value ?? ''} onChange={onChange ? (e) => onChange(e.target.value) : undefined} readOnly={!onChange} className="w-full px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
  </div>
);

const SelectInput = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="mb-1.5 sm:mb-2 relative select-wrapper" ref={ref} style={{ overflow: 'visible' }}>
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-left flex justify-between items-center text-xs sm:text-sm">
        <span className={value ? 'text-teal-800 font-medium' : 'text-gray-400'}>{value || `Select ${label}`}</span>
        <svg className={`w-3.5 h-3.5 text-teal-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="relative z-[9999] bg-white rounded-xl shadow-xl border border-teal-200" style={{ maxHeight: '260px', overflowY: 'auto', width: '100%', left: '0', top: 'calc(100% + 4px)' }}>
          {options.map((opt) => (
            <div key={opt} onClick={() => { onChange?.(opt); setOpen(false); }} className={`px-2 py-1 text-xs sm:text-sm cursor-pointer font-medium transition-all duration-150 ${value === opt ? 'bg-teal-600 text-white' : 'text-teal-800 hover:bg-teal-500 hover:text-white'}`}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const RadioGroup = ({ label, options, value, onChange }) => (
  <div className="mb-1.5 sm:mb-2">
    <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
          <input type="radio" name={label} checked={value === opt} onChange={() => onChange?.(opt)} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
          <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({ label, options, value = [], onChange }) => (
  <div className="mb-1.5 sm:mb-2">
    <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
    <div className="space-y-0.5 sm:space-y-1">
      {options.map(option => (
        <label key={option} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={value.includes(option)} onChange={() => onChange?.(option)} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
          <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const LeaseApartmentFilter = ({ activeTab = 'Lease', onFilterChange, onClose }) => {
  const [currentActiveTab, setCurrentActiveTab] = useState(activeTab);
  const [filters, setFilters] = useState({});
  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleFilterOption = (key, option) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      return { ...prev, [key]: current.includes(option) ? current.filter((v) => v !== option) : [...current, option] };
    });
  };

  const tabs = [
    { id: 'Lease', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Lease' }
  ];

  // Location Details Section
  const LocationDetailsSection = () => (
    <>
      <InputField label="City" placeholder="Enter city name" value={filters.city} onChange={(v) => updateFilter('city', v)} />
      <InputField label="Area / Locality" placeholder="Enter area or locality" value={filters.area} onChange={(v) => updateFilter('area', v)} />
      <InputField label="Landmark" placeholder="Nearby landmark" value={filters.landmark} onChange={(v) => updateFilter('landmark', v)} />
      <InputField label="PIN Code" placeholder="Enter PIN code" value={filters.pincode} onChange={(v) => updateFilter('pincode', v)} />
      <InputField label="Nearby Connectivity" placeholder="Metro, Bus, Highway" value={filters.nearbyConnectivity} onChange={(v) => updateFilter('nearbyConnectivity', v)} />
    </>
  );

  // Property Details Section
  const PropertyDetailsSection = () => (
    <>
      <InputRange label="Built-up Area" minPlaceholder="Min sq.ft" maxPlaceholder="Max sq.ft" minValue={filters.builtUpAreaMin} maxValue={filters.builtUpAreaMax} onMinChange={(v) => updateFilter('builtUpAreaMin', v)} onMaxChange={(v) => updateFilter('builtUpAreaMax', v)} />
      <InputRange label="Carpet Area" minPlaceholder="Min sq.ft" maxPlaceholder="Max sq.ft" minValue={filters.carpetAreaMin} maxValue={filters.carpetAreaMax} onMinChange={(v) => updateFilter('carpetAreaMin', v)} onMaxChange={(v) => updateFilter('carpetAreaMax', v)} />
      <SelectInput label="Number of Bedrooms" options={['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK+']} value={filters.bedrooms} onChange={(v) => updateFilter('bedrooms', v)} />
      <SelectInput label="Number of Bathrooms" options={['1', '2', '3', '4+']} value={filters.bathrooms} onChange={(v) => updateFilter('bathrooms', v)} />
      <NumberInputField label="Floor Number" placeholder="Enter floor number" value={filters.floorNumber} onChange={(v) => updateFilter('floorNumber', v)} />
      <NumberInputField label="Total Floors" placeholder="Enter total floors" value={filters.totalFloors} onChange={(v) => updateFilter('totalFloors', v)} />
      <SelectInput label="Facing Direction" options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']} value={filters.facingDirection} onChange={(v) => updateFilter('facingDirection', v)} />
      <NumberInputField label="Balcony Count" placeholder="Enter number of balconies" value={filters.balconyCount} onChange={(v) => updateFilter('balconyCount', v)} />
      <NumberInputField label="Property Age" placeholder="Enter property age in years" value={filters.propertyAge} onChange={(v) => updateFilter('propertyAge', v)} />
    </>
  );

  // Interior Details Section
  // Both lists below use the exact vocabulary the posting forms store
  // (interiorFeatures / appliancesIncluded JSONB arrays) - not invented
  // filter-only text, since the backend's JSONB "contains" check needs an
  // exact string match.
  const InteriorDetailsSection = () => (
    <>
      <SelectInput label="Furnishing" options={['Fully Furnished', 'Semi-Furnished', 'Unfurnished']} value={filters.furnishing} onChange={(v) => updateFilter('furnishing', v)} />
      <div className="mb-1.5 sm:mb-2">
        <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">Interior Features</label>
        <div className="space-y-0.5 sm:space-y-1">
          {['Modular Kitchen', 'Wardrobes', 'Air Conditioning', 'Utility Area', 'Smart Home Features'].map(item => (
            <label key={item} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={(filters.interiorFeatures || []).includes(item)} onChange={() => toggleFilterOption('interiorFeatures', item)} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
              <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{item}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-1.5 sm:mb-2">
        <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">Appliances Included</label>
        <div className="space-y-0.5 sm:space-y-1">
          {['Refrigerator', 'AC', 'Washing Machine', 'Microwave', 'Dishwasher', 'Water Purifier', 'TV', 'Oven'].map(item => (
            <label key={item} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
              <input type="checkbox" checked={(filters.appliancesIncluded || []).includes(item)} onChange={() => toggleFilterOption('appliancesIncluded', item)} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
              <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  // Amenities Section
  // Posting forms store the amenity's `id` (e.g. "gym", "swimmingPool"), not
  // its display label - checking the label would never match via the
  // backend's JSONB "contains" check.
  const APARTMENT_AMENITIES = [
    { id: 'coveredParking', label: 'Covered Parking' },
    { id: 'lift', label: 'Lift / Elevator' },
    { id: 'security247', label: '24/7 Security' },
    { id: 'cctv', label: 'CCTV Surveillance' },
    { id: 'powerBackup', label: 'Power Backup' },
    { id: 'gym', label: 'Gym / Fitness Center' },
    { id: 'swimmingPool', label: 'Swimming Pool' },
    { id: 'clubhouse', label: 'Clubhouse' },
    { id: 'playArea', label: "Children's Play Area" },
    { id: 'garden', label: 'Garden / Park' },
    { id: 'joggingTrack', label: 'Jogging Track' },
    { id: 'visitorParking', label: 'Visitor Parking' },
    { id: 'wifi', label: 'Wi-Fi / Broadband Ready' },
    { id: 'smartHome', label: 'Smart Home Features' },
    { id: 'petFriendly', label: 'Pet Friendly' },
  ];
  const AmenitiesSection = () => (
    <div className="space-y-0.5 sm:space-y-1">
      {APARTMENT_AMENITIES.map(({ id, label }) => (
        <label key={id} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={(filters.selectedAmenities || []).includes(id)} onChange={() => toggleFilterOption('selectedAmenities', id)} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
          <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{label}</span>
        </label>
      ))}
    </div>
  );

  // Nearby Access Section
  const NearbyAccessSection = () => (
    <div className="space-y-0.5 sm:space-y-1">
      {['School', 'Hospital', 'Metro / Bus Stop', 'Shopping Mall / Market', 'IT Park / Office Hub'].map(place => (
        <label key={place} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
          <input type="checkbox" checked={(filters.nearbyAccess || []).includes(place)} onChange={() => toggleFilterOption('nearbyAccess', place)} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
          <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{place}</span>
        </label>
      ))}
    </div>
  );

  // Contact Preference Section
  const ContactPreferenceSection = () => (
    <>
      <SelectInput label="Contact via" options={['Owner', 'Agent', 'Builder']} value={filters.contactVia} onChange={(v) => updateFilter('contactVia', v)} />
      <SelectInput label="Preferred Contact Time" options={['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)', 'Anytime']} value={filters.preferredContactTime} onChange={(v) => updateFilter('preferredContactTime', v)} />
    </>
  );

  // LEASE Tab Filters
  const renderLeaseFilters = () => (
    <>
      <FilterSection title="📋 Basic Details">
        <InputField label="Property Type" placeholder="Lease Apartment" type="text" value="Lease Apartment" />
        <InputField label="Purpose" placeholder="Lease" type="text" value="Lease" />
        <SelectInput label="Listing Type" options={['Owner', 'Agent', 'Builder']} value={filters.listingType} onChange={(v) => updateFilter('listingType', v)} />
      </FilterSection>
      <FilterSection title="📍 Location Details">{LocationDetailsSection()}</FilterSection>
      <FilterSection title="📄 Lease Details">
        <InputRange label="Lease Amount" minPlaceholder="Min ₹" maxPlaceholder="Max ₹" minValue={filters.minLeaseAmount} maxValue={filters.maxLeaseAmount} onMinChange={(v) => updateFilter('minLeaseAmount', v)} onMaxChange={(v) => updateFilter('maxLeaseAmount', v)} />
        <SelectInput label="Lease Duration" options={['1 Year', '2 Years', '3+ Years']} value={filters.leaseDuration} onChange={(v) => updateFilter('leaseDuration', v)} />
        <InputRange label="Refundable Deposit" minPlaceholder="Min ₹" maxPlaceholder="Max ₹" minValue={filters.securityDepositMin} maxValue={filters.securityDepositMax} onMinChange={(v) => { updateFilter('securityDepositMin', v); updateFilter('securityDeposit', v); }} onMaxChange={(v) => updateFilter('securityDepositMax', v)} />
        <NumberInputField label="Maintenance Charges" placeholder="Enter amount" value={filters.maintenanceCharges} onChange={(v) => updateFilter('maintenanceCharges', v)} />
        <RadioGroup label="Lease Negotiable" options={['Yes', 'No']} value={filters.leaseNegotiable} onChange={(v) => updateFilter('leaseNegotiable', v)} />
      </FilterSection>
      <FilterSection title="🏠 Property Details">{PropertyDetailsSection()}</FilterSection>
      <FilterSection title="🪑 Interior Details">{InteriorDetailsSection()}</FilterSection>
      <FilterSection title="👥 Tenant Preferences">
        <CheckboxGroup label="Tenant Type" options={['Family', 'Bachelor', 'Working Professionals', 'Students']} value={filters.tenantType || []} onChange={(opt) => toggleFilterOption('tenantType', opt)} />
        <RadioGroup label="Pet Friendly" options={['Yes', 'No']} value={filters.petFriendly} onChange={(v) => updateFilter('petFriendly', v)} />
        <RadioGroup label="Dietary Preference" options={['Veg Only', 'No Restriction']} value={filters.dietaryPreference} onChange={(v) => updateFilter('dietaryPreference', v)} />
        <RadioGroup label="Smoking Allowed" options={['Yes', 'No']} value={filters.smokingAllowed} onChange={(v) => updateFilter('smokingAllowed', v)} />
      </FilterSection>
      <FilterSection title="✨ Amenities">{AmenitiesSection()}</FilterSection>
      <FilterSection title="📅 Availability">
        <RadioGroup label="Immediate Occupancy" options={['Yes', 'No']} value={filters.immediateOccupancy} onChange={(v) => updateFilter('immediateOccupancy', v)} />
        <ThemedDatePicker label="Available From" value={filters.availableFrom} onChange={(v) => updateFilter('availableFrom', v)} />
        <RadioGroup label="Lease Renewal Option" options={['Yes', 'No']} value={filters.leaseRenewalOption} onChange={(v) => updateFilter('leaseRenewalOption', v)} />
      </FilterSection>
      <FilterSection title="📍 Nearby Access">{NearbyAccessSection()}</FilterSection>
      {/* <FilterSection title="📞 Contact Preference">{ContactPreferenceSection()}</FilterSection> */}
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-emerald-50 rounded-3xl" style={{ overflow: 'hidden' }}>
            {/* Sticky Header with Close Button */}
      <div className="flex-shrink-0 bg-gradient-to-r from-teal-600 to-emerald-600 shadow-sm sticky top-0 z-50">
        <div className="px-3 py-1.5 sm:px-6 sm:py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg sm:rounded-xl shadow-lg">
                <style>{`
                  @keyframes slowSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                  .slow-spin { animation: slowSpin 4s linear infinite; }
                `}</style>
                <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white slow-spin" />
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-white">lease Apartment Filters</h1>
            </div>
            {onClose && (
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110" 
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scroll" style={{ position: 'relative', zIndex: 1 }}>
        

        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-1.5 sm:py-3 overflow-visible">
          {/* Tabs - Single tab for Lease */}
          <div className="sticky top-0 z-40 bg-emerald-50 pt-1 pb-1.5 -mt-2 mb-2 sm:mb-3 overflow-x-auto">
            <div className="flex flex-nowrap justify-center gap-0.5 sm:gap-1 md:gap-1 min-w-max">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setCurrentActiveTab(tab.id)} className={`flex items-center gap-1 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-bold transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md text-xs sm:text-sm`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Filter Content */}
          <div className="overflow-visible">
            {renderLeaseFilters()}
          </div>
        </div>
      </div>

          {/* Sticky Bottom Buttons */}
      <div className="sticky bottom-0 p-2 border-t-2 border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFilters({});
              if (onFilterChange) onFilterChange({});
            }}
            className="flex-1 px-2 py-1.5 rounded-xl border-2 border-teal-300 text-teal-700 font-semibold text-xs hover:bg-teal-100 transition-all flex items-center justify-center gap-1.5"
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All
          </button>
          <button
            onClick={() => {
              // "Lease Apartment" is now a real selectable Property Type option on the
              // posting forms (not just "any apartment, for lease"), so it has its own
              // exact-match propertyType like the other 9 Apartment filter pages.
              if (onFilterChange) onFilterChange({ ...filters, activeTab: currentActiveTab, propertyType: 'Lease Apartment' });
              if (onClose) onClose();
            }}
            className="flex-1 px-2 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-xs hover:shadow-lg transition-all flex items-center justify-center gap-1.5" 
            type="button"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </div>
      </div>

            {/* Theme Scrollbar Styles */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #E6FFFA; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #00695C, #26A69A); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #004D40, #00796B); box-shadow: 0 0 10px rgba(0,105,92,0.5); }
      `}</style>
    </div>
  );
};

export default LeaseApartmentFilter;