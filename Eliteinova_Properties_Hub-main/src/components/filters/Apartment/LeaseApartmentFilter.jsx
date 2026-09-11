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

const ThemedDatePicker = ({ label }) => {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
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
                <button key={day} type="button" onClick={() => { setSelected(new Date(viewYear, viewMonth, day)); setOpen(false); }}
                  className={`w-full rounded text-[9px] font-semibold py-0.5 transition-all duration-150 ${sel ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-sm' : tod ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-400' : 'text-teal-800 hover:bg-teal-100'}`}>
                  {day}
                </button>
              );
            })}
          </div>
          <div className="bg-teal-50 border-t border-teal-100 flex justify-between px-2 py-0.5">
            <button type="button" onClick={() => { setSelected(today); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); setOpen(false); }} className="text-[8px] font-bold text-teal-600 hover:text-teal-800 transition-colors">Today</button>
            <button type="button" onClick={() => { setSelected(null); if(inputRef.current) inputRef.current.value=''; setOpen(false); }} className="text-[8px] font-bold text-teal-400 hover:text-teal-600 transition-colors">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
const LeaseApartmentFilter = ({ activeTab = 'Lease', onFilterChange, onClose }) => {
  const [currentActiveTab, setCurrentActiveTab] = useState(activeTab);

  const tabs = [
    { id: 'Lease', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: 'Lease' }
  ];

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

  const InputField = ({ label, placeholder, type = "text" }) => (
    <div className="mb-1.5 sm:mb-2">
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
    </div>
  );

  const InputRange = ({ label, minPlaceholder, maxPlaceholder }) => (
    <div className="mb-1.5 sm:mb-2">
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
      <div className="flex gap-2 sm:gap-3">
        <input type="number" placeholder={minPlaceholder} className="w-1/2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
        <input type="number" placeholder={maxPlaceholder} className="w-1/2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
      </div>
    </div>
  );

  const NumberInputField = ({ label, placeholder }) => (
    <div className="mb-1.5 sm:mb-2">
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
      <input type="number" placeholder={placeholder} className="w-full px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl border-2 border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all duration-300 bg-white text-xs sm:text-sm" />
    </div>
  );

  const SelectInput = ({ label, options }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
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
          <span className={selected ? 'text-teal-800 font-medium' : 'text-gray-400'}>{selected || `Select ${label}`}</span>
          <svg className={`w-3.5 h-3.5 text-teal-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="relative z-[9999] bg-white rounded-xl shadow-xl border border-teal-200" style={{ maxHeight: '260px', overflowY: 'auto', width: '100%', left: '0', top: 'calc(100% + 4px)' }}>
            {options.map((opt) => (
              <div key={opt} onClick={() => { setSelected(opt); setOpen(false); }} className={`px-2 py-1 text-xs sm:text-sm cursor-pointer font-medium transition-all duration-150 ${selected === opt ? 'bg-teal-600 text-white' : 'text-teal-800 hover:bg-teal-500 hover:text-white'}`}>{opt}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const RadioGroup = ({ label, options }) => (
    <div className="mb-1.5 sm:mb-2">
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
            <input type="radio" name={label} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
            <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const CheckboxGroup = ({ label, options }) => (
    <div className="mb-1.5 sm:mb-2">
      <label className="block text-xs sm:text-sm font-bold text-teal-800 mb-0.5">{label}</label>
      <div className="space-y-0.5 sm:space-y-1">
        {options.map(option => (
          <label key={option} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
            <input type="checkbox" className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
            <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // Location Details Section
  const LocationDetailsSection = () => (
    <>
      <InputField label="City" placeholder="Enter city name" />
      <InputField label="Area / Locality" placeholder="Enter area or locality" />
      <InputField label="Landmark" placeholder="Nearby landmark" />
      <InputField label="PIN Code" placeholder="Enter PIN code" />
      <InputField label="Nearby Connectivity" placeholder="Metro, Bus, Highway" />
    </>
  );

  // Property Details Section
  const PropertyDetailsSection = () => (
    <>
      <InputRange label="Built-up Area" minPlaceholder="Min sq.ft" maxPlaceholder="Max sq.ft" />
      <InputRange label="Carpet Area" minPlaceholder="Min sq.ft" maxPlaceholder="Max sq.ft" />
      <SelectInput label="Number of Bedrooms" options={['Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK+']} />
      <SelectInput label="Number of Bathrooms" options={['1', '2', '3', '4+']} />
      <NumberInputField label="Floor Number" placeholder="Enter floor number" />
      <NumberInputField label="Total Floors" placeholder="Enter total floors" />
      <SelectInput label="Facing Direction" options={['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']} />
      <NumberInputField label="Balcony Count" placeholder="Enter number of balconies" />
      <NumberInputField label="Property Age" placeholder="Enter property age in years" />
    </>
  );

  // Interior Details Section
  const InteriorDetailsSection = () => (
    <>
      <SelectInput label="Furnishing" options={['Fully Furnished', 'Semi-Furnished', 'Unfurnished']} />
      <div className="space-y-0.5 sm:space-y-1">
        {['Modular Kitchen', 'Air Conditioning', 'Wardrobes', 'Utility Area'].map(item => (
          <label key={item} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
            <input type="checkbox" className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
            <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{item}</span>
          </label>
        ))}
      </div>
      <InputField label="Appliances Included" placeholder="e.g., Refrigerator, AC, Washing Machine, Microwave" />
    </>
  );

  // Amenities Section
  const AmenitiesSection = () => (
    <div className="space-y-0.5 sm:space-y-1">
      {['Parking', 'Lift', '24/7 Security', 'Power Backup', 'Swimming Pool', 'Gym', 'Clubhouse', "Children's Play Area", 'Wi-Fi / Broadband Ready'].map(amenity => (
        <label key={amenity} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
          <input type="checkbox" className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
          <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{amenity}</span>
        </label>
      ))}
    </div>
  );

  // Nearby Access Section
  const NearbyAccessSection = () => (
    <div className="space-y-0.5 sm:space-y-1">
      {['School', 'Hospital', 'Metro / Bus Stop', 'Shopping Mall / Market', 'IT Park / Office Hub'].map(place => (
        <label key={place} className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
          <input type="checkbox" className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded border-2 border-teal-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 accent-teal-600" />
          <span className="text-xs sm:text-sm text-teal-700 group-hover:text-teal-600 transition-colors font-medium">{place}</span>
        </label>
      ))}
    </div>
  );

  // Contact Preference Section
  const ContactPreferenceSection = () => (
    <>
      <SelectInput label="Contact via" options={['Owner', 'Agent', 'Builder']} />
      <SelectInput label="Preferred Contact Time" options={['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)', 'Anytime']} />
    </>
  );

  // LEASE Tab Filters
  const renderLeaseFilters = () => (
    <>
      <FilterSection title="📋 Basic Details">
        <InputField label="Property Type" placeholder="Lease Apartment" type="text" />
        <InputField label="Purpose" placeholder="Lease" type="text" />
        <SelectInput label="Listing Type" options={['Owner', 'Agent', 'Builder']} />
      </FilterSection>
      <FilterSection title="📍 Location Details"><LocationDetailsSection /></FilterSection>
      <FilterSection title="📄 Lease Details">
        <InputRange label="Lease Amount" minPlaceholder="Min ₹" maxPlaceholder="Max ₹" />
        <SelectInput label="Lease Duration" options={['1 Year', '2 Years', '3+ Years']} />
        <InputRange label="Refundable Deposit" minPlaceholder="Min ₹" maxPlaceholder="Max ₹" />
        <NumberInputField label="Maintenance Charges" placeholder="Enter amount" />
        <RadioGroup label="Lease Negotiable" options={['Yes', 'No']} />
      </FilterSection>
      <FilterSection title="🏠 Property Details"><PropertyDetailsSection /></FilterSection>
      <FilterSection title="🪑 Interior Details"><InteriorDetailsSection /></FilterSection>
      <FilterSection title="👥 Tenant Preferences">
        <CheckboxGroup label="Tenant Type" options={['Family', 'Bachelor', 'Working Professionals', 'Students']} />
        <RadioGroup label="Pet Friendly" options={['Yes', 'No']} />
        <RadioGroup label="Dietary Preference" options={['Veg Only', 'No Restriction']} />
        <RadioGroup label="Smoking Allowed" options={['Yes', 'No']} />
      </FilterSection>
      <FilterSection title="✨ Amenities"><AmenitiesSection /></FilterSection>
      <FilterSection title="📅 Availability">
        <RadioGroup label="Immediate Occupancy" options={['Yes', 'No']} />
        <ThemedDatePicker label="Available From" />
        <RadioGroup label="Lease Renewal Option" options={['Yes', 'No']} />
      </FilterSection>
      <FilterSection title="📍 Nearby Access"><NearbyAccessSection /></FilterSection>
      <FilterSection title="📞 Contact Preference"><ContactPreferenceSection /></FilterSection>
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
              if (onFilterChange) onFilterChange({});
            }}
            className="flex-1 px-2 py-1.5 rounded-xl border-2 border-teal-300 text-teal-700 font-semibold text-xs hover:bg-teal-100 transition-all flex items-center justify-center gap-1.5" 
            type="button"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset All
          </button>
          <button 
            onClick={() => {
              if (onFilterChange) onFilterChange({ activeTab: currentActiveTab });
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
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #E6FFFA; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #00695C, #26A69A); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #004D40, #00796B); box-shadow: 0 0 10px rgba(0,105,92,0.5); }
      `}</style>
    </div>
  );
};

export default LeaseApartmentFilter;