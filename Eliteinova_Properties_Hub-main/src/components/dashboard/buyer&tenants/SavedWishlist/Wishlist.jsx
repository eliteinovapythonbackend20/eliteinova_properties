// src/components/dashboard/admin/buyer&tenants/SavedWishlist/Wishlist.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHeart, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye,
  FiEdit, FiRefreshCw, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiMail, FiPhone, FiExternalLink, FiTag, FiGrid,
  FiPlus, FiMinus, FiTrendingUp, FiTrendingDown, FiStar,
  FiUsers, FiShoppingBag, FiBell, FiSettings, FiSave
} from 'react-icons/fi';
import {
  FaHeart, FaBuilding, FaBed, FaBath, FaCar, FaCheck,
  FaTimes, FaStar as FaStarSolid, FaUserTie, FaHome as FaHomeSolid,
  FaImage, FaHeart as FaHeartSolid
} from 'react-icons/fa';

// ============================================================
// TOAST COMPONENT
// ============================================================
const Toast = ({ toast, setToast }) => {
  if (!toast) return null;
  
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-slide-up ${colors[toast.type] || colors.success}`}>
      {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
      {toast.type === 'error' && <FiXCircle className="text-lg" />}
      {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
      {toast.type === 'info' && <FiInfo className="text-lg" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, statsAnimating, onClick, subtitle }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${statsAnimating ? 'animate-pulse-once' : ''} ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick && onClick()}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider truncate">{title}</p>
          <p className={`text-lg font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-[9px] text-[#5A7D78] truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {isActive && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// PRICE CHANGE INDICATOR COMPONENT
// ============================================================
const PriceChangeIndicator = ({ item }) => {
  if (!item.originalPrice || item.price === item.originalPrice) return null;
  const change = item.price - item.originalPrice;
  const percent = ((change / item.originalPrice) * 100).toFixed(1);
  const isUp = change > 0;

  return (
    <div className={`flex items-center gap-0.5 text-[9px] font-semibold ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
      {isUp ? <FiTrendingUp className="text-[8px]" /> : <FiTrendingDown className="text-[8px]" />}
      <span>{isUp ? '+' : ''}{percent}%</span>
    </div>
  );
};

// ============================================================
// ADD TO WISHLIST MODAL
// ============================================================
const AddToWishlistModal = ({ show, onClose, onAdd, properties, existingWishlist }) => {
  if (!show) return null;

  const [selectedProperty, setSelectedProperty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter(p => {
      const search = searchTerm.toLowerCase();
      const isInWishlist = existingWishlist.some(w => w.propertyId === p.id);
      return !isInWishlist && (
        p.propertyName?.toLowerCase().includes(search) ||
        p.buyerName?.toLowerCase().includes(search) ||
        p.location?.toLowerCase().includes(search)
      );
    });
  }, [properties, searchTerm, existingWishlist]);

  const handleSubmit = () => {
    if (!selectedProperty) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const property = properties.find(p => p.id === selectedProperty);
      onAdd(property);
      setLoading(false);
      setSelectedProperty('');
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Add to Wishlist</h2>
          <p className="text-white/80 text-sm">Select a property to add to the wishlist</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProperties.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                    <FiHeart className="text-2xl text-[#B5C9C5]" />
                  </div>
                  <p className="text-sm text-[#5A7D78]">No properties available to add</p>
                  <p className="text-xs text-[#B5C9C5]">All properties are already in the wishlist</p>
                </div>
              ) : (
                filteredProperties.map(property => (
                  <label
                    key={property.id}
                    className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedProperty === property.id
                        ? 'border-[#00695C] bg-[#E8F4F2] ring-2 ring-[#00695C]/20'
                        : 'border-[#E8F0EE] hover:border-[#00695C]/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="property"
                      value={property.id}
                      checked={selectedProperty === property.id}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-4 h-4 text-[#00695C] focus:ring-[#00695C]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#1A2E2A] truncate">{property.propertyName}</p>
                      <div className="flex items-center gap-3 text-xs text-[#5A7D78]">
                        <span>{property.buyerName}</span>
                        <span>•</span>
                        <span>{property.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#00695C]">₹{property.price?.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
                      property.propertyStatus === 'available' ? 'bg-emerald-100 text-emerald-700' :
                      property.propertyStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {property.propertyStatus?.charAt(0).toUpperCase() + property.propertyStatus?.slice(1)}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!selectedProperty || loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiPlus className="inline" />}
              {loading ? 'Adding...' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW WISHLIST ITEM MODAL
// ============================================================
const ViewWishlistItemModal = ({ item, show, onClose, onRemove, onViewProperty, onEdit }) => {
  if (!item || !show) return null;

  const statusColors = {
    available: 'bg-[#E8F8F5] text-[#00695C]',
    pending: 'bg-[#FEF3E2] text-amber-700',
    sold: 'bg-gray-100 text-gray-600',
    rented: 'bg-blue-50 text-blue-700'
  };

  const propertyTypeColors = {
    Individual: 'bg-blue-50 text-blue-700',
    Apartment: 'bg-purple-50 text-purple-700',
    Commercial: 'bg-orange-50 text-orange-700',
    'Land & Plots': 'bg-green-50 text-green-700',
    Hostel: 'bg-pink-50 text-pink-700'
  };

  const propertyImages = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
  ];

  const getRandomImage = () => {
    const index = Math.floor(Math.random() * propertyImages.length);
    return propertyImages[index];
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = item.imageUrl || getRandomImage();

  const priceChange = item.originalPrice && item.price ? item.price - item.originalPrice : 0;
  const priceChangePercent = item.originalPrice && item.price ? ((priceChange / item.originalPrice) * 100).toFixed(1) : 0;
  const isPriceUp = priceChange > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Wishlist Item</h2>
          <p className="text-white/80 text-sm">{item.buyerName} · {item.propertyName}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="space-y-6">
            {/* Availability Status & Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[item.status] || statusColors.available}`}>
                {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Available'}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${propertyTypeColors[item.propertyType] || 'bg-gray-100 text-gray-700'}`}>
                {item.propertyType || 'N/A'}
              </span>
              {item.isNew && (
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 animate-pulse">New</span>
              )}
              {item.originalPrice && item.originalPrice !== item.price && (
                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${isPriceUp ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isPriceUp ? <FiTrendingUp className="inline mr-1" /> : <FiTrendingDown className="inline mr-1" />}
                  {isPriceUp ? '+' : ''}{priceChangePercent}% Changed
                </span>
              )}
            </div>

            {/* Property Image */}
            <div className="bg-[#F5F9F8] rounded-2xl overflow-hidden relative">
              {!imageLoaded && !imageError && (
                <div className="w-full h-64 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center animate-pulse">
                  <FaImage className="text-4xl text-[#00695C]/20" />
                </div>
              )}
              {imageError ? (
                <div className="w-full h-64 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex flex-col items-center justify-center">
                  <FaHomeSolid className="text-5xl text-[#00695C]/30 mb-2" />
                  <p className="text-sm text-[#5A7D78]">Image not available</p>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={item.propertyName || 'Property'}
                  className={`w-full h-64 object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Buyer / Tenant Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Buyer / Tenant</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{item.buyerName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{item.buyerEmail || ''}</p>
                <p className="text-xs text-[#5A7D78]">{item.buyerPhone || ''}</p>
              </div>

              {/* Property Details */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Details</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{item.propertyName || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{item.propertyType || ''}</p>
              </div>

              {/* Location */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiMapPin className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">{item.location || 'N/A'}</p>
                <p className="text-xs text-[#5A7D78]">{item.city || ''}, {item.state || ''}</p>
              </div>

              {/* Price with Change */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FiDollarSign className="text-[#00695C] text-sm" />
                      <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Price</h4>
                    </div>
                    <p className="text-lg font-bold text-[#1A2E2A]">₹{item.price?.toLocaleString() || '0'}</p>
                    {item.originalPrice && item.originalPrice !== item.price && (
                      <p className="text-xs text-[#5A7D78] line-through">Original: ₹{item.originalPrice?.toLocaleString()}</p>
                    )}
                  </div>
                  {item.originalPrice && item.originalPrice !== item.price && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isPriceUp ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isPriceUp ? <FiTrendingUp className="text-sm" /> : <FiTrendingDown className="text-sm" />}
                      <span className="text-sm font-semibold">{isPriceUp ? '+' : ''}{priceChangePercent}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Added Date */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Added to Wishlist</h4>
                </div>
                <p className="text-sm font-medium text-[#1A2E2A]">
                  {item.addedDate ? new Date(item.addedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              {/* Property Specifications */}
              <div className="bg-[#F5F9F8] rounded-2xl p-4 col-span-2">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FaBuilding className="text-[#00695C]" />
                  Property Specifications
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div><span className="text-[#5A7D78]">Bedrooms</span><p className="font-medium text-[#1A2E2A]">{item.bedrooms || 'N/A'}</p></div>
                  <div><span className="text-[#5A7D78]">Bathrooms</span><p className="font-medium text-[#1A2E2A]">{item.bathrooms || 'N/A'}</p></div>
                  <div><span className="text-[#5A7D78]">Area</span><p className="font-medium text-[#1A2E2A]">{item.area ? `${item.area} sq.ft` : 'N/A'}</p></div>
                </div>
              </div>
            </div>

            {item.notes && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Notes</h4>
                <p className="text-sm text-[#1A2E2A] leading-relaxed">{item.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
            <button onClick={() => onEdit && onEdit(item)} className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]">
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button onClick={() => onViewProperty && onViewProperty(item.propertyId)} className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02]">
              <FiExternalLink className="inline mr-2" /> View Property
            </button>
            <button onClick={() => onRemove && onRemove(item.id)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]">
              <FiHeart className="inline mr-2" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT WISHLIST ITEM MODAL
// ============================================================
const EditWishlistItemModal = ({ item, show, onClose, onSave }) => {
  if (!item || !show) return null;

  const [formData, setFormData] = useState({
    buyerName: '', buyerEmail: '', buyerPhone: '',
    propertyName: '', propertyType: '', location: '', city: '', state: '',
    price: '', status: '', notes: ''
  });

  const [loading, setLoading] = useState(false);
  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
  const statuses = ['available', 'pending', 'sold', 'rented'];

  useEffect(() => {
    if (item) {
      setFormData({
        buyerName: item.buyerName || '',
        buyerEmail: item.buyerEmail || '',
        buyerPhone: item.buyerPhone || '',
        propertyName: item.propertyName || '',
        propertyType: item.propertyType || '',
        location: item.location || '',
        city: item.city || '',
        state: item.state || '',
        price: item.price ? String(item.price) : '',
        status: item.status || '',
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const updatedItem = {
        ...item,
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: item.originalPrice || parseFloat(formData.price) || 0
      };
      onSave(updatedItem);
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Wishlist Item</h2>
          <p className="text-white/80 text-sm">Update wishlist item information</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Buyer / Tenant Information */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" /> Buyer / Tenant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer Name *</label>
                  <input type="text" name="buyerName" value={formData.buyerName} onChange={handleChange} required className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="Enter buyer name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer Email</label>
                  <input type="email" name="buyerEmail" value={formData.buyerEmail} onChange={handleChange} className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="buyer@email.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Buyer Phone</label>
                  <input type="text" name="buyerPhone" value={formData.buyerPhone} onChange={handleChange} className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="+91 9876543210" />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHome className="text-[#00695C]" /> Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Name *</label>
                  <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} required className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="Enter property name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} required className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none">
                    <option value="">Select Type</option>
                    {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Availability Status *</label>
                  <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none">
                    <option value="">Select Status</option>
                    {statuses.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="1000" className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="Enter price" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="Enter location" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="Enter city" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none" placeholder="Enter state" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none" placeholder="Add notes about this property..." />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave className="inline" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN WISHLIST COMPONENT
// ============================================================
const Wishlist = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // ============ STATE ============
  const [wishlistItems, setWishlistItems] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('grid');
  const [showStats, setShowStats] = useState(true);
  const [statsAnimating, setStatsAnimating] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // ============ STATS - WISHLIST COUNT ============
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    pending: 0,
    sold: 0,
    rented: 0,
    withPriceChanges: 0,
    newThisWeek: 0,
    uniqueBuyers: 0
  });

  // ============ GENERATE MOCK DATA ============
  const generateMockData = useCallback(() => {
    const buyerNames = ['Rahul Kumar', 'Anita Sharma', 'Sanjay Singh', 'Divya Patel', 'Karthik Reddy', 'Neha Gupta', 'Manoj Verma', 'Swati Joshi', 'Rohit Malhotra', 'Pallavi Mehta'];
    const propertyNames = ['Green Valley Villa', 'Lake View Apartments', 'Sunrise Heights', 'Royal Palm Estate', 'Silver Oak Residency', 'Golden Meadows', 'Cedar Woods', 'Maple Leaf Homes', 'Orchid Garden', 'Tulip Tower'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan'];
    const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const statuses = ['available', 'pending', 'sold', 'rented'];
    const locations = ['MG Road', 'Banjara Hills', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jubilee Hills', 'Connaught Place', 'Salt Lake'];

    const propertyImages = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
    ];

    const allProperties = [];
    const usedNames = new Set();

    for (let i = 1; i <= 30; i++) {
      let propertyName, buyerName;
      let attempts = 0;
      do {
        propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
        buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
        attempts++;
      } while (usedNames.has(`${propertyName}_${buyerName}`) && attempts < 50);
      usedNames.add(`${propertyName}_${buyerName}`);

      const price = Math.floor(Math.random() * 8000000 + 2000000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      allProperties.push({
        id: `prop_${i}`,
        buyerName: buyerName,
        buyerEmail: `${buyerName.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 100)}@email.com`,
        buyerPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        propertyName: propertyName,
        propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        price: price,
        propertyStatus: status,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 1500 + 500),
        imageUrl: propertyImages[Math.floor(Math.random() * propertyImages.length)]
      });
    }

    // Generate wishlist items
    const wishlist = [];
    const usedProperties = new Set();

    for (let i = 1; i <= 15; i++) {
      let prop;
      let attempts = 0;
      do {
        prop = allProperties[Math.floor(Math.random() * allProperties.length)];
        attempts++;
      } while (usedProperties.has(prop.id) && attempts < 50);
      usedProperties.add(prop.id);

      const originalPrice = prop.price + Math.floor(Math.random() * 1000000 - 500000);
      const addedDate = new Date();
      addedDate.setDate(addedDate.getDate() - Math.floor(Math.random() * 60));

      wishlist.push({
        id: `wish_${i}`,
        propertyId: prop.id,
        buyerName: prop.buyerName,
        buyerEmail: prop.buyerEmail,
        buyerPhone: prop.buyerPhone,
        propertyName: prop.propertyName,
        propertyType: prop.propertyType,
        location: prop.location,
        city: prop.city,
        state: prop.state,
        price: prop.price,
        originalPrice: Math.random() > 0.4 ? originalPrice : prop.price,
        status: prop.propertyStatus,
        addedDate: addedDate.toISOString(),
        notes: Math.random() > 0.7 ? 'Interested in this property' : '',
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        area: prop.area,
        imageUrl: prop.imageUrl,
        isNew: addedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      });
    }

    const available = allProperties.filter(p => !usedProperties.has(p.id));
    return { wishlist, available };
  }, []);

  // ============ COMPUTE STATS ============
  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, available: 0, pending: 0, sold: 0, rented: 0, withPriceChanges: 0, newThisWeek: 0, uniqueBuyers: 0 });
      return;
    }

    const uniqueBuyers = new Set(list.map(p => p.buyerName)).size;
    const total = list.length;
    const available = list.filter(p => p.status === 'available').length;
    const pending = list.filter(p => p.status === 'pending').length;
    const sold = list.filter(p => p.status === 'sold').length;
    const rented = list.filter(p => p.status === 'rented').length;
    const withPriceChanges = list.filter(p => p.price !== p.originalPrice).length;
    const newThisWeek = list.filter(p => {
      if (!p.addedDate) return false;
      const added = new Date(p.addedDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return added > weekAgo;
    }).length;

    setStats({ total, available, pending, sold, rented, withPriceChanges, newThisWeek, uniqueBuyers });
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const { wishlist, available } = generateMockData();
      setWishlistItems(wishlist);
      setAvailableProperties(available);
      setFilteredItems(wishlist);
      computeStats(wishlist);
      setStatsAnimating(true);
      setTimeout(() => setStatsAnimating(false), 1000);
    } catch (error) {
      console.error('Error generating mock data:', error);
    }
  }, [generateMockData, computeStats]);

  // ============ FILTER ITEMS ============
  const filterItems = useCallback(() => {
    try {
      let filtered = [...wishlistItems];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          (item.propertyName && item.propertyName.toLowerCase().includes(query)) ||
          (item.buyerName && item.buyerName.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          (item.city && item.city.toLowerCase().includes(query))
        );
      }

      if (selectedFilter !== 'all') {
        filtered = filtered.filter(item => {
          if (selectedFilter === 'price-changed') return item.price !== item.originalPrice;
          if (selectedFilter === 'new') {
            if (!item.addedDate) return false;
            const added = new Date(item.addedDate);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return added > weekAgo;
          }
          return item.status === selectedFilter;
        });
      }

      let count = 0;
      if (selectedFilter !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      setFilteredItems(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering items:', error);
    }
  }, [wishlistItems, searchQuery, selectedFilter]);

  useEffect(() => { filterItems(); }, [filterItems]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, pageSize]);

  // ============ HANDLE ADD TO WISHLIST ============
  const handleAddToWishlist = useCallback((property) => {
    if (!property) return;

    const newItem = {
      id: `wish_${Date.now()}`,
      propertyId: property.id,
      buyerName: property.buyerName,
      buyerEmail: property.buyerEmail,
      buyerPhone: property.buyerPhone,
      propertyName: property.propertyName,
      propertyType: property.propertyType,
      location: property.location,
      city: property.city,
      state: property.state,
      price: property.price,
      originalPrice: property.price,
      status: property.propertyStatus,
      addedDate: new Date().toISOString(),
      notes: '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      imageUrl: property.imageUrl,
      isNew: true
    };

    setWishlistItems(prev => { const updated = [newItem, ...prev]; computeStats(updated); return updated; });
    setAvailableProperties(prev => prev.filter(p => p.id !== property.id));
    setToast({ message: `"${property.propertyName}" added to wishlist`, type: 'success' });
  }, [computeStats]);

  // ============ HANDLE REMOVE FROM WISHLIST ============
  const handleRemoveFromWishlist = useCallback((itemId) => {
    const item = wishlistItems.find(w => w.id === itemId);
    if (!item) return;
    if (!window.confirm(`Remove "${item.propertyName}" from wishlist?`)) return;

    setActionLoading(itemId);
    setTimeout(() => {
      setWishlistItems(prev => { const updated = prev.filter(w => w.id !== itemId); computeStats(updated); return updated; });

      const property = {
        id: item.propertyId, buyerName: item.buyerName, buyerEmail: item.buyerEmail,
        buyerPhone: item.buyerPhone, propertyName: item.propertyName, propertyType: item.propertyType,
        location: item.location, city: item.city, state: item.state, price: item.price,
        propertyStatus: item.status, bedrooms: item.bedrooms, bathrooms: item.bathrooms,
        area: item.area, imageUrl: item.imageUrl
      };
      setAvailableProperties(prev => [property, ...prev]);

      setActionLoading(null);
      setShowViewModal(false);
      setToast({ message: `"${item.propertyName}" removed from wishlist`, type: 'warning' });
    }, 700);
  }, [wishlistItems, computeStats]);

  // ============ HANDLE EDIT WISHLIST ITEM ============
  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
    setShowEditModal(true);
  }, []);

  // ============ HANDLE SAVE EDITED ITEM ============
  const handleSaveItem = useCallback((updatedItem) => {
    setWishlistItems(prev => { const updated = prev.map(item => item.id === updatedItem.id ? updatedItem : item); computeStats(updated); return updated; });
    setToast({ message: `"${updatedItem.propertyName}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ VIEW ITEM ============
  const handleViewItem = useCallback((item) => {
    setViewingItem(item);
    setShowViewModal(true);
  }, []);

  // ============ VIEW PROPERTY DETAILS ============
  const handleViewPropertyDetails = useCallback((propertyId) => {
    navigate('/properties/details');
    setToast({ message: 'Opening property details...', type: 'info' });
  }, [navigate]);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
    const nextFilter = activeFilter === filter ? 'all' : filter;
    setSelectedFilter(nextFilter);
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [activeFilter]);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedFilter('all');
    setActiveFilter('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const { wishlist, available } = generateMockData();
        setWishlistItems(wishlist);
        setAvailableProperties(available);
        setFilteredItems(wishlist);
        computeStats(wishlist);
        setStatsAnimating(true);
        setTimeout(() => setStatsAnimating(false), 1000);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockData, computeStats]);

  // ============ EXPORT DATA ============
  const handleExport = useCallback(() => {
    if (filteredItems.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }

    try {
      const data = filteredItems.map(item => ({
        'Buyer Name': item.buyerName || '',
        'Buyer Email': item.buyerEmail || '',
        'Buyer Phone': item.buyerPhone || '',
        'Property Name': item.propertyName || '',
        'Property Type': item.propertyType || '',
        Location: `${item.location || ''}, ${item.city || ''}, ${item.state || ''}`,
        'Current Price': `₹${item.price ? item.price.toLocaleString() : '0'}`,
        'Original Price': `₹${item.originalPrice ? item.originalPrice.toLocaleString() : '0'}`,
        'Price Change': `${item.price !== item.originalPrice ? 'Yes' : 'No'}`,
        Status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '',
        'Added Date': item.addedDate ? new Date(item.addedDate).toLocaleDateString() : '',
        Notes: item.notes || ''
      }));

      const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishlist_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredItems.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredItems]);

  // ============ STATUS COLOR HELPER ============
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-[#E8F8F5] text-[#00695C]',
      pending: 'bg-[#FEF3E2] text-amber-700',
      sold: 'bg-gray-100 text-gray-600',
      rented: 'bg-blue-50 text-blue-700'
    };
    return colors[status] || colors.available;
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Toast */}
      <Toast toast={toast} setToast={setToast} />

      {/* View Modal */}
      {showViewModal && viewingItem && (
        <ViewWishlistItemModal
          item={viewingItem}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingItem(null); }}
          onRemove={handleRemoveFromWishlist}
          onViewProperty={handleViewPropertyDetails}
          onEdit={handleEditItem}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <EditWishlistItemModal
          item={editingItem}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingItem(null); }}
          onSave={handleSaveItem}
        />
      )}

      {/* Add Modal */}
      <AddToWishlistModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddToWishlist}
        properties={availableProperties}
        existingWishlist={wishlistItems}
      />

      {/* ====== HEADER - View Wishlist ====== */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Wishlist
              </h1>
              {/* Wishlist Count */}
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredItems.length} Items
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>View and manage your wishlist</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button onClick={() => setShowStats(!showStats)} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105">
              <FiActivity className={`text-sm transition-transform duration-300 ${showStats ? 'rotate-0' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            {/* Add Property Button */}
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105">
              <FiPlus className="text-sm" />
              <span className="hidden sm:inline">Add Property</span>
            </button>
            <button onClick={handleRefresh} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105">
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====== STATS SECTION - Wishlist Count ====== */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              <StatCard 
                icon={<FaHeartSolid className="text-white text-sm" />} 
                title="Total Items" 
                value={stats.total} 
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" 
                delay={0} 
                isActive={activeFilter === 'all'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('all')} 
              />
              <StatCard 
                icon={<FiCheckCircle className="text-white text-sm" />} 
                title="Available" 
                value={stats.available} 
                color="bg-gradient-to-br from-emerald-600 to-emerald-400" 
                delay={50} 
                isActive={activeFilter === 'available'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('available')} 
              />
              <StatCard 
                icon={<FiClock className="text-white text-sm" />} 
                title="Pending" 
                value={stats.pending} 
                color="bg-gradient-to-br from-amber-600 to-amber-400" 
                delay={100} 
                isActive={activeFilter === 'pending'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('pending')} 
              />
              <StatCard 
                icon={<FiTrendingUp className="text-white text-sm" />} 
                title="Price Changed" 
                value={stats.withPriceChanges} 
                color="bg-gradient-to-br from-red-600 to-red-400" 
                delay={150} 
                isActive={activeFilter === 'price-changed'} 
                statsAnimating={statsAnimating} 
                onClick={() => handleStatClick('price-changed')} 
              />
             
            </div>
          </div>
        </div>
      )}

      {/* ====== SEARCH AND FILTERS ====== */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input ref={searchInputRef} type="text" placeholder="Search by buyer name, property name, or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110"><FiX className="text-sm" /></button>}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <div className="relative">
              <select value={selectedFilter} onChange={(e) => { setSelectedFilter(e.target.value); setActiveFilter(e.target.value === 'all' ? 'all' : e.target.value); }} className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]">
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="price-changed">Price Changed</option>
                <option value="new">New This Week</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {filterCount > 0 && <button onClick={clearAllFilters} className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"><FiX className="text-sm" /> Clear</button>}

            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="Grid View"><FiGridIcon className="text-sm" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="List View"><FiList className="text-sm" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ====== WISHLIST GRID/LIST ====== */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" /></div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedItems.map((item, index) => (
              <div key={item.id} className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${item.status === 'available' ? 'border-l-4 border-l-emerald-500' : item.status === 'pending' ? 'border-l-4 border-l-amber-500' : item.status === 'sold' ? 'border-l-4 border-l-gray-500' : ''} ${item.isNew ? 'ring-1 ring-blue-300' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        <FaHeartSolid className="text-white" />
                      </div>
                      {item.isNew && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[6px] text-white font-bold animate-pulse">NEW</div>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{item.buyerName}</h3>
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        {/* Availability Status */}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(item.status)}`}>
                          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                        </span>
                        {/* Price Change */}
                        <PriceChangeIndicator item={item} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Edit Button */}
                    <button onClick={() => handleEditItem(item)} className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110" title="Edit"><FiEdit className="text-sm" /></button>
                    <button onClick={() => handleViewItem(item)} className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110" title="View Details"><FiEye className="text-sm" /></button>
                  </div>
                </div>

                <div className="space-y-1">
                  {/* Buyer / Tenant */}
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiUser className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate font-medium text-[#1A2E2A]">{item.buyerName || 'N/A'}</span>
                  </div>
                  {/* Property Details */}
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiHome className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{item.propertyName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiMapPin className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate">{item.location || ''}, {item.city || ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                    <span>₹{item.price ? item.price.toLocaleString() : '0'}</span>
                    {item.originalPrice && item.originalPrice !== item.price && (
                      <span className="text-[9px] text-[#5A7D78] line-through">₹{item.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                    <FiCalendar className="text-[#00695C] flex-shrink-0" />
                    <span>Added: {item.addedDate ? new Date(item.addedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                  <button onClick={() => handleViewItem(item)} className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"><FiEye className="text-[10px]" /> View</button>
                  <button onClick={() => handleEditItem(item)} className="flex-1 py-1.5 text-xs font-medium text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"><FiEdit className="text-[10px]" /> Edit</button>
                  <button onClick={() => handleViewPropertyDetails(item.propertyId)} className="flex-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"><FiExternalLink className="text-[10px]" /> Details</button>
                  {/* Remove Property */}
                  <button onClick={() => handleRemoveFromWishlist(item.id)} disabled={actionLoading === item.id} className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50">
                    {actionLoading === item.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiHeart className="text-[10px]" />} Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-2 flex items-center gap-2"><span>Buyer / Tenant</span></div>
              <div className="col-span-2">Property</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-1 text-center">Change</div>
              <div className="col-span-1 text-center">Added</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {paginatedItems.map((item, index) => (
              <div key={item.id} className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${item.isNew ? 'bg-blue-50/30' : ''}`} style={{ animationDelay: `${index * 30}ms` }}>
                {/* Buyer / Tenant */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {item.buyerName ? item.buyerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{item.buyerName || 'N/A'}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{item.buyerEmail || 'N/A'}</p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="col-span-2">
                  <p className="text-xs font-medium text-[#1A2E2A] truncate">{item.propertyName || 'N/A'}</p>
                  <p className="text-[9px] text-[#5A7D78]">{item.propertyType || ''}</p>
                </div>

                {/* Availability Status */}
                <div className="col-span-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(item.status)}`}>
                    {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                  </span>
                </div>

                <div className="col-span-2 text-xs text-[#5A7D78] truncate">{item.location || ''}, {item.city || ''}</div>

                <div className="col-span-1 text-center text-sm font-semibold text-[#1A2E2A]">₹{item.price ? Math.floor(item.price / 100000) : 0}L</div>

                {/* Price Change */}
                <div className="col-span-1 text-center"><PriceChangeIndicator item={item} /></div>

                <div className="col-span-1 text-center text-[10px] text-[#5A7D78]">
                  {item.addedDate ? new Date(item.addedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => handleEditItem(item)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#26A69A] hover:scale-110" title="Edit"><FiEdit className="text-xs" /></button>
                  <button onClick={() => handleViewItem(item)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110" title="View"><FiEye className="text-xs" /></button>
                  <button onClick={() => handleViewPropertyDetails(item.propertyId)} className="w-7 h-7 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-blue-600 hover:scale-110" title="Property Details"><FiExternalLink className="text-xs" /></button>
                  <button onClick={() => handleRemoveFromWishlist(item.id)} disabled={actionLoading === item.id} className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-red-600 hover:scale-110 disabled:opacity-50" title="Remove">
                    {actionLoading === item.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiHeart className="text-xs" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {paginatedItems.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float"><FaHeartSolid className="text-4xl text-[#B5C9C5]" /></div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">Wishlist is empty</h3>
            <p className="text-sm text-[#5A7D78] mt-1">{filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'Start adding properties to your wishlist'}</p>
            {filterCount > 0 ? (
              <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105">Clear All Filters</button>
            ) : (
              <button onClick={() => setShowAddModal(true)} className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105 flex items-center gap-2"><FiPlus className="text-sm" /> Add Property</button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length} items</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300">
              <option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"><FiChevronLeft className="text-sm" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${currentPage === pageNum ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'}`}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"><FiChevronRight className="text-sm" /></button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes pulse-once { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-once { animation: pulse-once 1s ease-out; }
      `}</style>
    </div>
  );
};

export default Wishlist;