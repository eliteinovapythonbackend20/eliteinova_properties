import React, { useState } from 'react';
import {
  X, ChevronDown, ChevronUp, Building, RefreshCw, CheckCircle,
  DollarSign, IndianRupee, FileText, Plus
} from 'lucide-react';

// Amenities free-text tag input — same pattern as the subtype filters (e.g. OfficeSpaceFilter)
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
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedAmenities.map((amenity, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs">
            {amenity}
            <button type="button" onClick={() => onRemove(amenity)} className="hover:text-teal-900 focus:outline-none">
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
          <button type="button" onClick={handleAdd} className="px-2 py-1 rounded-lg bg-teal-600 text-white text-xs hover:bg-teal-700 transition-colors">
            Add
          </button>
          <button
            type="button"
            onClick={() => { setShowInput(false); setInputValue(''); }}
            className="px-2 py-1 rounded-lg border-2 border-teal-300 text-teal-600 text-xs hover:bg-teal-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Generic "All Commercial" filter — same fields the page always had (price/rent
// range, area range, property type, amenities), rebuilt with the collapsible
// SectionHeader + tabbed-header + sticky-footer template every subtype filter
// (OfficeSpaceFilter, RetailShopFilter, ...) already uses, so this page's
// filter looks consistent with the rest of the Commercial module.
const CommercialFilter = ({ activeTab = 'Rent', onFilterChange, onClose, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    area: true,
    propertyType: true,
    amenities: true
  });

  const [filters, setFilters] = useState({
    minPrice: '', maxPrice: '',
    minRent: '', maxRent: '',
    minLeaseAmount: '', maxLeaseAmount: '',
    minArea: '', maxArea: '',
    propertyTypes: [],
    amenities: [],
    selectedAmenities: []
  });

  const tabs = [
    { id: 'Buy', label: 'Buy', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'Rent', label: 'Rent', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'Lease', label: 'Lease', icon: <FileText className="w-3.5 h-3.5" /> }
  ];

  const propertyTypeOptions = ['Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Mixed-use'];
  const amenityOptions = ['Parking', '24/7 Security', 'Power Backup', 'Elevator', 'Wifi', 'CCTV'];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleListValue = (field, value) => {
    setFilters((prev) => {
      const list = prev[field];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [field]: next };
    });
  };

  const handleAddAmenity = (amenity) => {
    setFilters((prev) => ({ ...prev, selectedAmenities: [...prev.selectedAmenities, amenity] }));
  };

  const handleRemoveAmenity = (amenity) => {
    setFilters((prev) => ({ ...prev, selectedAmenities: prev.selectedAmenities.filter((a) => a !== amenity) }));
  };

  const applyFilters = () => {
    const filtersToSend = { ...filters, purpose: currentTab };
    if (onFilterChange) onFilterChange(filtersToSend);
    if (onClose) onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: '', maxPrice: '',
      minRent: '', maxRent: '',
      minLeaseAmount: '', maxLeaseAmount: '',
      minArea: '', maxArea: '',
      propertyTypes: [],
      amenities: [],
      selectedAmenities: []
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
          {expandedSections[section] ? (
            <ChevronUp className="w-4 h-4 text-teal-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-teal-600" />
          )}
        </div>
      </div>
    </button>
  );

  const renderPriceSection = () => {
    const config = {
      Buy: { title: 'Budget Details', min: 'minPrice', max: 'maxPrice', label: 'Budget Range (Min – Max)' },
      Rent: { title: 'Rent Details', min: 'minRent', max: 'maxRent', label: 'Monthly Rent Range (Min – Max)' },
      Lease: { title: 'Lease Details', min: 'minLeaseAmount', max: 'maxLeaseAmount', label: 'Lease Amount (Min – Max)' }
    }[currentTab];

    return (
      <div className="mb-3">
        <SectionHeader emoji="💰" title={config.title} section="price" />
        {expandedSections.price && (
          <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
            <div>
              <label className="text-sm text-teal-800 font-medium block mb-1">{config.label}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  value={filters[config.min]}
                  onChange={(e) => handleInputChange(config.min, e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  value={filters[config.max]}
                  onChange={(e) => handleInputChange(config.max, e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAreaSection = () => (
    <div className="mb-3">
      <SectionHeader emoji="📐" title="Area (sq. ft.)" section="area" />
      {expandedSections.area && (
        <div className="mt-2 space-y-2 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Area"
              className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
              value={filters.minArea}
              onChange={(e) => handleInputChange('minArea', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Area"
              className="w-full px-2 py-1.5 rounded-lg border-2 border-teal-300 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
              value={filters.maxArea}
              onChange={(e) => handleInputChange('maxArea', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderPropertyTypeSection = () => (
    <div className="mb-3">
      <SectionHeader emoji="🏢" title="Property Type" section="propertyType" />
      {expandedSections.propertyType && (
        <div className="mt-2 grid grid-cols-2 gap-1.5 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          {propertyTypeOptions.map((type) => (
            <label key={type} className="flex items-center gap-1.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type)}
                onChange={() => toggleListValue('propertyTypes', type)}
                className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600"
              />
              <span className="text-xs text-teal-700 group-hover:text-teal-600">{type}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  const renderAmenitiesSection = () => (
    <div className="mb-3">
      <SectionHeader emoji="✨" title="Amenities" section="amenities" />
      {expandedSections.amenities && (
        <div className="mt-2 space-y-3 bg-teal-50 rounded-lg border-2 border-teal-200 p-3">
          <div className="grid grid-cols-2 gap-1.5">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="flex items-center gap-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => toggleListValue('amenities', amenity)}
                  className="w-3.5 h-3.5 rounded border-2 border-teal-300 bg-white checked:bg-teal-600 checked:border-teal-600 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-teal-600"
                />
                <span className="text-xs text-teal-700 group-hover:text-teal-600">{amenity}</span>
              </label>
            ))}
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

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-100 overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
      <div className="sticky top-0 z-10 bg-white border-b-2 border-teal-100">
        <div className="flex justify-between items-center px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white/20 rounded-lg">
              <style>{`
                @keyframes slowRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .slow-rotate { animation: slowRotate 4s linear infinite; }
              `}</style>
              <Building className="w-4 h-4 text-white slow-rotate" />
            </div>
            <h3 className="text-white font-semibold text-sm md:text-base">Filter Commercial Properties</h3>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-all" type="button">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex border-b-2 border-teal-100 bg-teal-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              type="button"
              className={`flex-1 py-2 text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                currentTab === tab.id
                  ? 'text-teal-700 border-b-2 border-teal-600 bg-white shadow-sm'
                  : 'text-teal-500 hover:text-teal-700 hover:bg-teal-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-3 custom-scroll" style={{ maxHeight: 'calc(90vh - 100px)' }}>
        {renderPriceSection()}
        {renderAreaSection()}
        {renderPropertyTypeSection()}
        {renderAmenitiesSection()}
      </div>

      <div className="sticky bottom-0 p-2 border-t-2 border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50">
        <div className="flex gap-2">
          <button onClick={clearAllFilters} className="flex-1 px-2 py-1.5 rounded-xl border-2 border-teal-300 text-teal-700 font-semibold text-xs hover:bg-teal-100 transition-all flex items-center justify-center gap-1.5" type="button">
            <RefreshCw className="w-3.5 h-3.5" />
            Reset All
          </button>
          <button onClick={applyFilters} className="flex-1 px-2 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-xs hover:shadow-lg transition-all flex items-center justify-center gap-1.5" type="button">
            <CheckCircle className="w-3.5 h-3.5" />
            Apply Filters
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

export default CommercialFilter;
