// src/components/dashboard/properties/PropertiesOverview.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiGrid, FiCalendar, FiRefreshCw, FiDownload, FiFile,
  FiChevronRight, FiCheckCircle, FiXCircle, FiInfo, FiArrowUp,
  FiArrowDown, FiTrendingUp, FiMapPin, FiClock, FiStar, FiEye,
  FiLayers
} from 'react-icons/fi';
import {
  FaHome, FaWarehouse, FaBed, FaMapMarkedAlt, FaCity,
  FaCrown, FaCheckCircle as FaCheckCircleIcon
} from 'react-icons/fa';
import { MdOutlineApartment, MdOutlineBusiness } from 'react-icons/md';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';

// ============ EXPORT UTILITIES ============
const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header] || '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportToJSON = (data, filename = 'export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============ DATE UTILITIES ============
const getDateRange = (period, customStart = null, customEnd = null) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start = new Date(today);
  let end = new Date(today);

  switch (period) {
    case 'today':
      start = new Date(today);
      end = new Date(today);
      break;
    case 'yesterday':
      start = new Date(today);
      start.setDate(start.getDate() - 1);
      end = new Date(today);
      end.setDate(end.getDate() - 1);
      break;
    case 'this-week': {
      const day = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - day);
      end = new Date(today);
      end.setDate(today.getDate() + (6 - day));
      break;
    }
    case 'this-month':
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case 'this-year':
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
      break;
    case 'custom':
      if (customStart && customEnd) {
        start = new Date(customStart);
        end = new Date(customEnd);
      }
      break;
    default:
      start = new Date(today);
      end = new Date(today);
  }

  return { start, end };
};

// ============ TIME AGO UTILITY ============
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

// ============ MOCK DATA GENERATOR ============
const generateMockData = () => {
  const categories = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statuses = ['Active', 'Under Review', 'Sold', 'Rented', 'Draft'];
  const locations = [
    'Adyar, Chennai', 'Velachery, Chennai', 'OMR, Chennai', 'Porur, Chennai',
    'Guindy, Chennai', 'T. Nagar, Chennai', 'Mylapore, Chennai', 'Anna Nagar, Chennai',
    'Nungambakkam, Chennai', 'Egmore, Chennai'
  ];
  const propertyTitles = [
    'Luxury Villa with Private Pool', 'Premium 3BHK Gated Community',
    'Grade-A Office Space', 'Corner Residential Plot, DTCP Approved',
    'Co-living Space for Professionals', 'Modern 2BHK Apartment',
    'Beachfront Villa', 'Commercial Showroom',
    'Independent House with Garden', 'Student Hostel Near College'
  ];

  const properties = [];
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2026-09-04');

  for (let i = 1; i <= 4872; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const title = propertyTitles[Math.floor(Math.random() * propertyTitles.length)] + ` #${i}`;
    const price = Math.floor(Math.random() * 50000000) + 500000;
    
    properties.push({
      id: i,
      title,
      type: category,
      location,
      price: `₹${(price / 100000).toFixed(1)}${price > 10000000 ? ' Cr' : ' L'}`,
      status,
      addedDate: randomDate,
      category,
      thumbnail: `https://ui-avatars.com/api/?name=${category.substring(0, 3)}&background=00695C&color=fff&size=64`
    });
  }

  return properties;
};

// ============ MAIN COMPONENT ============
const PropertiesOverview = () => {
  const navigate = useNavigate();

  // State
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [properties] = useState(generateMockData());
  const [filteredProperties, setFilteredProperties] = useState([]);

  // ============ TOAST ============
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // ============ FILTER PROPERTIES BY DATE RANGE ============
  const filterPropertiesByDate = (period, customStart = null, customEnd = null) => {
    const { start, end } = getDateRange(period, customStart, customEnd);
    
    // Set time to start of day for start and end of day for end
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = properties.filter(prop => {
      const propDate = new Date(prop.addedDate);
      return propDate >= startOfDay && propDate <= endOfDay;
    });

    return filtered;
  };

  // ============ UPDATE FILTERED DATA ============
  const updateFilteredData = (period, customStart = null, customEnd = null) => {
    setLoading(true);
    setTimeout(() => {
      let filtered;
      if (period === 'custom' && customStart && customEnd) {
        filtered = filterPropertiesByDate('custom', customStart, customEnd);
      } else {
        filtered = filterPropertiesByDate(period);
      }
      setFilteredProperties(filtered);
      
      const label = getPeriodLabel(period);
      const count = filtered.length;
      showToast(`📊 Showing ${count} properties for ${label}`, 'info');
      setLoading(false);
    }, 300);
  };

  // ============ PERIOD HANDLERS ============
  const getPeriodLabel = (period) => {
    const labels = {
      today: 'Today',
      yesterday: 'Yesterday',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-year': 'This Year',
      custom: 'Custom Range',
    };
    return labels[period] || period;
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setShowCustomDatePicker(false);
      setStartDate('');
      setEndDate('');
      updateFilteredData(period);
    } else {
      setShowCustomDatePicker(true);
      // If custom dates already set, apply them
      if (startDate && endDate) {
        updateFilteredData('custom', startDate, endDate);
      }
    }
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      setShowCustomDatePicker(false);
      const start = new Date(startDate);
      const end = new Date(endDate);
      updateFilteredData('custom', startDate, endDate);
      showToast(`📅 Showing data from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, 'info');
    } else {
      showToast('⚠️ Please select both start and end dates', 'error');
    }
  };

  const handleRefresh = () => {
    updateFilteredData(selectedPeriod, startDate, endDate);
    showToast('🔄 Properties data refreshed successfully!', 'success');
  };

  // ============ INITIAL LOAD ============
  useEffect(() => {
    updateFilteredData('this-month');
  }, []);

  // ============ COMPUTED STATISTICS ============
  const statsData = useMemo(() => {
    const total = filteredProperties.length;
    const individual = filteredProperties.filter(p => p.category === 'Individual').length;
    const apartments = filteredProperties.filter(p => p.category === 'Apartment').length;
    const commercial = filteredProperties.filter(p => p.category === 'Commercial').length;
    const landPlots = filteredProperties.filter(p => p.category === 'Land & Plots').length;
    const hostels = filteredProperties.filter(p => p.category === 'Hostel').length;
    const active = filteredProperties.filter(p => p.status === 'Active').length;
    const soldRented = filteredProperties.filter(p => p.status === 'Sold' || p.status === 'Rented').length;

    // Calculate changes (mock - using percentage of total)
    const getChange = (count) => {
      const pct = (count / Math.max(total, 1)) * 100;
      return `${(pct / 10).toFixed(1)}%`;
    };

    return [
      {
        id: 1,
        title: 'Total Properties',
        value: total.toLocaleString(),
        change: getChange(total),
        trend: 'up',
        icon: <FiHome className="text-[#00695C]" />,
        color: 'from-[#E0F2F1] to-[#B2DFDB]',
        path: '/admin/properties/all',
        notification: 'Navigating to All Properties...',
      },
      {
        id: 2,
        title: 'Individual',
        value: individual.toLocaleString(),
        change: getChange(individual),
        trend: 'up',
        icon: <FaHome className="text-[#26A69A]" />,
        color: 'from-[#E8F5E9] to-[#C8E6C9]',
        path: '/admin/properties/individual/overview',
        notification: 'Navigating to Individual Properties...',
      },
      {
        id: 3,
        title: 'Apartments',
        value: apartments.toLocaleString(),
        change: getChange(apartments),
        trend: 'up',
        icon: <MdOutlineApartment className="text-[#9C27B0]" />,
        color: 'from-[#F3E5F5] to-[#E1BEE7]',
        path: '/admin/properties/apartment/overview',
        notification: 'Navigating to Apartments...',
      },
      {
        id: 4,
        title: 'Commercial',
        value: commercial.toLocaleString(),
        change: getChange(commercial),
        trend: 'up',
        icon: <MdOutlineBusiness className="text-[#2196F3]" />,
        color: 'from-[#E3F2FD] to-[#BBDEFB]',
        path: '/admin/properties/commercial/overview',
        notification: 'Navigating to Commercial Properties...',
      },
      {
        id: 5,
        title: 'Land & Plots',
        value: landPlots.toLocaleString(),
        change: getChange(landPlots),
        trend: 'up',
        icon: <FaMapMarkedAlt className="text-[#FF9800]" />,
        color: 'from-[#FFF3E0] to-[#FFE0B2]',
        path: '/admin/properties/land-plots/overview',
        notification: 'Navigating to Land & Plots...',
      },
      {
        id: 6,
        title: 'Hostels',
        value: hostels.toLocaleString(),
        change: getChange(hostels),
        trend: 'up',
        icon: <FaBed className="text-[#E91E63]" />,
        color: 'from-[#FCE4EC] to-[#F8BBD0]',
        path: '/admin/properties/hostel/overview',
        notification: 'Navigating to Hostels...',
      },
      {
        id: 7,
        title: 'Active Listings',
        value: active.toLocaleString(),
        change: getChange(active),
        trend: 'up',
        icon: <FaCheckCircleIcon className="text-[#4CAF50]" />,
        color: 'from-[#E8F5E9] to-[#C8E6C9]',
        path: '/admin/properties/all',
        notification: 'Navigating to Active Listings...',
      },
      {
        id: 8,
        title: 'Sold / Rented',
        value: soldRented.toLocaleString(),
        change: getChange(soldRented),
        trend: 'down',
        icon: <FiTrendingUp className="text-[#FF6B6B]" />,
        color: 'from-[#FFEBEE] to-[#FFCDD2]',
        path: '/admin/properties/all',
        notification: 'Navigating to Sold / Rented Properties...',
      },
    ];
  }, [filteredProperties]);

  // ============ CATEGORY BREAKDOWN ============
  const categoryBreakdown = useMemo(() => {
    const categories = ['Apartment', 'Individual', 'Commercial', 'Land & Plots', 'Hostel'];
    const colors = {
      'Apartment': 'bg-purple-500',
      'Individual': 'bg-teal-600',
      'Commercial': 'bg-blue-500',
      'Land & Plots': 'bg-orange-500',
      'Hostel': 'bg-pink-500'
    };
    const paths = {
      'Apartment': '/admin/properties/apartment/overview',
      'Individual': '/admin/properties/individual/overview',
      'Commercial': '/admin/properties/commercial/overview',
      'Land & Plots': '/admin/properties/land-plots/overview',
      'Hostel': '/admin/properties/hostel/overview'
    };
    const icons = {
      'Apartment': <MdOutlineApartment />,
      'Individual': <FaHome />,
      'Commercial': <MdOutlineBusiness />,
      'Land & Plots': <FaMapMarkedAlt />,
      'Hostel': <FaBed />
    };

    return categories.map(label => {
      const value = filteredProperties.filter(p => p.category === label).length;
      return { label, value, icon: icons[label], color: colors[label], path: paths[label] };
    });
  }, [filteredProperties]);

  const totalCategoryValue = categoryBreakdown.reduce((sum, c) => sum + c.value, 0);

  // ============ RECENTLY ADDED PROPERTIES ============
  const recentProperties = useMemo(() => {
    return filteredProperties
      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
      .slice(0, 5)
      .map(p => ({
        ...p,
        addedDate: getTimeAgo(new Date(p.addedDate)),
        path: `/admin/properties/${p.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`
      }));
  }, [filteredProperties]);

  // ============ TOP LOCALITIES ============
  const topLocalities = useMemo(() => {
    const localityMap = {};
    filteredProperties.forEach(p => {
      const locality = p.location.split(',')[0].trim();
      if (!localityMap[locality]) {
        localityMap[locality] = { name: locality, city: 'Chennai', count: 0 };
      }
      localityMap[locality].count++;
    });
    return Object.values(localityMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((l, index) => ({ ...l, id: index + 1 }));
  }, [filteredProperties]);

  const maxLocalityCount = useMemo(() => {
    return Math.max(...topLocalities.map(l => l.count), 1);
  }, [topLocalities]);

  // ============ EXPORT HANDLER ============
  const handleExport = (format = 'csv') => {
    setExportLoading(true);
    showToast('📤 Preparing export data...', 'info');

    setTimeout(() => {
      try {
        const exportData = {
          summary: statsData.reduce((acc, s) => ({ ...acc, [s.title]: s.value }), {}),
          categoryBreakdown: categoryBreakdown.map(c => ({ Category: c.label, Count: c.value })),
          recentProperties: recentProperties.map(p => ({
            Title: p.title,
            Type: p.type,
            Location: p.location,
            Price: p.price,
            Status: p.status,
            Added: p.addedDate,
          })),
          topLocalities: topLocalities.map(l => ({ Locality: l.name, City: l.city, Count: l.count })),
        };

        const filename = `properties-overview-${new Date().toISOString().split('T')[0]}`;

        if (format === 'json') {
          exportToJSON(exportData, `${filename}.json`);
        } else {
          // For CSV, use recent properties
          const csvData = recentProperties.map(p => ({
            Title: p.title,
            Type: p.type,
            Location: p.location,
            Price: p.price,
            Status: p.status,
            Added: p.addedDate,
          }));
          exportToCSV(csvData, `${filename}.csv`);
        }

        showToast(`✅ Data exported successfully as ${format.toUpperCase()}!`, 'success');
        setShowExportMenu(false);
      } catch (error) {
        showToast('❌ Failed to export data. Please try again.', 'error');
      } finally {
        setExportLoading(false);
      }
    }, 500);
  };

  // ============ CLICK HANDLERS ============
  const handleStatClick = (stat) => {
    if (stat.path) {
      navigate(stat.path);
      showToast(stat.notification || `Navigating to ${stat.title}...`, 'info');
    }
  };

  const handleCategoryClick = (item) => {
    if (item.path) {
      navigate(item.path);
      showToast(`Viewing ${item.label} properties...`, 'info');
    }
  };

  const handlePropertyClick = (property) => {
    if (property.path) {
      navigate(property.path);
      showToast(`Viewing ${property.title}...`, 'info');
    }
  };

  const handleLocalityClick = (locality) => {
    navigate('/admin/properties/all');
    showToast(`Viewing properties in ${locality.name}...`, 'info');
  };

  const statusStyles = {
    Active: 'bg-green-100 text-green-700',
    'Under Review': 'bg-yellow-100 text-yellow-700',
    Sold: 'bg-blue-100 text-blue-700',
    Rented: 'bg-purple-100 text-purple-700',
    Draft: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
      {/* ============ TOAST NOTIFICATION ============ */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl animate-slide-in-right flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-white border-l-4 border-green-500 shadow-green-100 text-green-700'
              : toast.type === 'error'
              ? 'bg-white border-l-4 border-red-500 shadow-red-100 text-red-700'
              : 'bg-white border-l-4 border-[#00695C] shadow-[#00695C]/20 text-[#00695C]'
          }`}
        >
          {toast.type === 'success' && <FiCheckCircle className="text-green-500 text-lg" />}
          {toast.type === 'error' && <FiXCircle className="text-red-500 text-lg" />}
          {toast.type === 'info' && <FiInfo className="text-[#00695C] text-lg" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiXCircle className="text-sm" />
          </button>
        </div>
      )}

      {/* ============ PAGE HEADER ============ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#00695C] to-[#26A69A] p-2.5 rounded-2xl shadow-lg shadow-[#00695C]/20 animate-pulse-soft">
              <FiHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent animate-gradient">
                Properties Overview
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] animate-pulse" />
                {filteredProperties.length} properties in this view
              </p>
            </div>
          </div>
        </div>

        {/* ============ HEADER RIGHT SIDE ============ */}
        <div className="flex items-center gap-2 flex-wrap relative">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-xl px-3 py-2 shadow-lg shadow-[#00695C]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#00695C]/40">
            <FiCalendar className="text-white text-sm" />
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer pr-6 [&>option]:text-gray-700 [&>option]:bg-white"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            {selectedPeriod === 'custom' && startDate && endDate && (
              <span className="text-xs text-white bg-white/20 px-2 py-0.5 rounded-full font-medium animate-fade-in">
                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {showCustomDatePicker && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#00695C]/20 p-5 z-50 w-80 animate-slide-down">
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-[#00695C] text-lg" />
                <h4 className="font-semibold text-gray-800">Select Custom Range</h4>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#00695C] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00695C]"></span>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[#00695C]/20 rounded-lg text-sm text-gray-700 bg-gray-50 focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#00695C] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#26A69A]"></span>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-3 py-2.5 border-2 border-[#00695C]/20 rounded-lg text-sm text-gray-700 bg-gray-50 focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCustomDateApply}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 hover:scale-[1.02] transition-all duration-300"
                  >
                    Apply Range
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomDatePicker(false);
                      setStartDate('');
                      setEndDate('');
                      setSelectedPeriod('this-month');
                      updateFilteredData('this-month');
                    }}
                    className="px-4 py-2.5 border-2 border-[#00695C]/20 rounded-lg text-sm text-[#00695C] font-medium hover:bg-[#00695C]/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 hover:scale-[1.02] transition-all duration-300"
          >
            <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exportLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
            >
              {exportLoading ? <FiRefreshCw className="text-sm animate-spin" /> : <FiDownload className="text-sm" />}
              {exportLoading ? 'Exporting...' : <span className="hidden sm:inline">Export</span>}
              <FiChevronRight className={`text-xs transition-transform duration-200 ${showExportMenu ? 'rotate-90' : ''}`} />
            </button>

            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-[#00695C]/20 py-1 z-50 min-w-[160px] animate-slide-down">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#00695C]/10 transition-colors flex items-center gap-2"
                >
                  <FiDownload className="text-xs text-[#00695C]" /> Export as CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#00695C]/10 transition-colors flex items-center gap-2"
                >
                  <FiFile className="text-xs text-[#00695C]" /> Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ DATE RANGE DISPLAY ============ */}
      <div className="mb-4 flex items-center gap-2 animate-fade-in">
        <div className="bg-white px-3 py-1.5 rounded-lg border border-[#00695C]/20 shadow-sm">
          <span className="text-sm text-gray-500">
            Showing data for:{' '}
            <span className="font-medium text-[#00695C]">
              {selectedPeriod === 'custom' && startDate && endDate
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                : getPeriodLabel(selectedPeriod)}
            </span>
            <span className="ml-2 text-gray-400">
              ({filteredProperties.length} properties)
            </span>
          </span>
        </div>
      </div>

      {/* ============ STATISTICS CARDS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statsData.map((stat, index) => (
          <div
            key={stat.id}
            onClick={() => handleStatClick(stat)}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-3 border border-gray-200/60 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden cursor-pointer animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 rounded-lg bg-white/70 backdrop-blur-sm flex items-center justify-center text-base shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {stat.icon}
                </div>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse-soft ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stat.trend === 'up' ? <FiArrowUp className="text-xs" /> : <FiArrowDown className="text-xs" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-700">{stat.title}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ MAIN CONTENT GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiLayers className="text-[#00695C] animate-pulse-soft" />
                  Portfolio by Category
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Share of listed inventory across property types</p>
              </div>
              <button
                onClick={() => {
                  navigate('/admin/properties/all');
                  showToast('📋 Viewing all properties...', 'info');
                }}
                className="text-xs text-[#00695C] font-medium hover:underline flex items-center gap-1 hover:gap-2 transition-all duration-300"
              >
                View All <FiChevronRight className="text-xs" />
              </button>
            </div>

            {totalCategoryValue === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No properties found for this period</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryBreakdown.map((item, index) => {
                  const percent = totalCategoryValue > 0 ? Math.round((item.value / totalCategoryValue) * 100) : 0;
                  return (
                    <div
                      key={item.label}
                      onClick={() => handleCategoryClick(item)}
                      className="flex items-center gap-3 cursor-pointer group animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:scale-110 group-hover:text-[#00695C] group-hover:border-[#00695C]/30 transition-all duration-300 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-[#00695C] transition-colors">{item.label}</span>
                          <span className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-800">{item.value.toLocaleString()}</span> · {percent}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      <FiChevronRight className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently Added Properties */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiClock className="text-[#00695C] animate-pulse-soft" />
                  Recently Added Properties
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Newest listings in this period</p>
              </div>
              <button
                onClick={() => {
                  navigate('/admin/properties/all');
                  showToast('📋 Viewing all properties...', 'info');
                }}
                className="text-xs text-[#00695C] font-medium hover:underline flex items-center gap-1 hover:gap-2 transition-all duration-300"
              >
                View All <FiChevronRight className="text-xs" />
              </button>
            </div>

            {recentProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No properties added in this period</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentProperties.map((property, index) => (
                  <div
                    key={property.id}
                    onClick={() => handlePropertyClick(property)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-200 cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <img
                      src={property.thumbnail}
                      alt={property.title}
                      className="w-11 h-11 rounded-lg border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-gray-800 truncate">{property.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusStyles[property.status]}`}>
                          {property.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                        <FiMapPin className="text-[10px] flex-shrink-0" /> {property.location} · {property.type}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-gray-800">{property.price}</div>
                      <div className="text-[10px] text-gray-400">{property.addedDate}</div>
                    </div>
                    <FiChevronRight className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3) */}
<div className="space-y-4">
  {/* Top Localities - Enhanced E-commerce Style */}
  <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 animate-fade-in-up group">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
          <div className="relative">
            <FiStar className="text-yellow-400 text-lg animate-pulse-soft" />
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-sm animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          Top Localities
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse" />
          Highest listing density by area
        </p>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
          {topLocalities.length} areas
        </span>
        <button
          onClick={() => {
            navigate('/admin/properties/all');
            showToast('📍 Viewing all localities...', 'info');
          }}
          className="text-[10px] text-[#00695C] font-medium hover:underline flex items-center gap-0.5 hover:gap-1 transition-all duration-300 bg-[#00695C]/5 px-2 py-0.5 rounded-full border border-[#00695C]/10 hover:bg-[#00695C]/10"
        >
          Explore <FiChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>

    {topLocalities.length === 0 ? (
      <div className="text-center py-8 text-gray-400">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <FiMapPin className="text-2xl text-gray-300" />
        </div>
        <p className="text-sm">No data available</p>
        <p className="text-xs mt-1">Try selecting a different period</p>
      </div>
    ) : (
      <div className="space-y-3">
        {topLocalities.map((locality, index) => {
          const percentage = (locality.count / maxLocalityCount) * 100;
          const colors = [
            'from-emerald-400 to-teal-500',
            'from-blue-400 to-indigo-500',
            'from-purple-400 to-pink-500',
            'from-orange-400 to-red-400',
            'from-cyan-400 to-blue-500',
            'from-rose-400 to-pink-500',
            'from-amber-400 to-orange-500',
            'from-violet-400 to-purple-500',
            'from-lime-400 to-green-500',
            'from-fuchsia-400 to-rose-500'
          ];
          const colorIndex = index % colors.length;
          
          return (
            <div
              key={locality.id}
              onClick={() => handleLocalityClick(locality)}
              className="group/item relative flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white border border-gray-100 hover:border-[#00695C]/20 hover:shadow-md hover:shadow-[#00695C]/5 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${colors[colorIndex]} opacity-0 group-hover/item:opacity-5 transition-opacity duration-500`} />
              
              {/* Rank Badge with glow */}
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[colorIndex]} text-white flex items-center justify-center text-sm font-bold shadow-md group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300`}>
                  {index + 1}
                </div>
                {index === 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="relative">
                      <FaCrown className="text-yellow-400 text-xs drop-shadow-lg animate-pulse-soft" />
                      <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-sm animate-ping" style={{ animationDuration: '2s' }} />
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border border-white shadow-md flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold">2</span>
                    </div>
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 border border-white shadow-md flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold">3</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Locality Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800 group-hover/item:text-[#00695C] transition-colors duration-300">
                    {locality.name}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {locality.city}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1">
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[colorIndex]} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="h-full w-full bg-gradient-to-r from-transparent to-white/30 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 tabular-nums">
                    {locality.count}
                  </span>
                </div>
              </div>

              {/* Right Arrow with hover effect */}
              <div className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transform -translate-x-2 group-hover/item:translate-x-0 transition-all duration-300">
                <div className="w-7 h-7 rounded-full bg-[#00695C]/10 flex items-center justify-center group-hover/item:bg-[#00695C] transition-colors duration-300">
                  <FiChevronRight className="text-[#00695C] text-sm group-hover/item:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Decorative dots pattern */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 opacity-5">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-600" />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* Footer with total count */}
    {topLocalities.length > 0 && (
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {topLocalities.slice(0, 3).map((loc, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 border-2 border-white flex items-center justify-center text-[8px] font-bold text-[#00695C]"
              >
                {loc.name.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            <span className="font-semibold text-gray-600">{topLocalities.length}</span> localities
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <FiMapPin className="text-[#00695C]" />
          <span>{filteredProperties.length} listings</span>
        </div>
      </div>
    )}
  </div>

  {/* Quick Stats - Enhanced */}
  <div className="grid grid-cols-2 gap-3">
    <div
      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up cursor-pointer group relative overflow-hidden"
      onClick={() => {
        navigate('/admin/properties/all');
        showToast('⭐ Viewing featured properties...', 'info');
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-400/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <FaCrown className="text-base" />
          </div>
          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
            Active
          </span>
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {filteredProperties.filter(p => p.status === 'Active').length}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          Active Listings
        </div>
      </div>
    </div>

    <div
      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up cursor-pointer group relative overflow-hidden"
      onClick={() => {
        navigate('/admin/properties/all');
        showToast('👁️ Viewing most-viewed properties...', 'info');
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-400/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <FiEye className="text-base" />
          </div>
          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
            Views
          </span>
        </div>
        <div className="text-2xl font-bold text-gray-800 flex items-end gap-1">
          {(filteredProperties.length * 3.8).toFixed(0)}
          <span className="text-sm font-normal text-gray-400">K</span>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
          <FiTrendingUp className="text-green-500 text-xs" />
          Total Views
        </div>
      </div>
    </div>
  </div>
</div>
      </div>

      {/* ============ FOOTER NOTE ============ */}
      <div className="mt-6 text-center animate-fade-in">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#26A69A] animate-pulse" />
          Showing {filteredProperties.length} properties for {getPeriodLabel(selectedPeriod)}
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          Last Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          <button
            onClick={handleRefresh}
            className="text-[#00695C] hover:underline ml-1 font-medium hover:text-[#004D40] transition-colors duration-300"
          >
            Refresh
          </button>
        </p>
      </div>

      {/* ============ ANIMATION STYLES ============ */}
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-soft { animation: pulseSoft 2s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }

        @keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
      `}</style>
    </div>
  );
};

export default PropertiesOverview;