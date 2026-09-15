// src/components/AgentProfile.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, Calendar, MapPin, Building,
  CreditCard, Banknote, Upload, Camera, FileText,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Save, X, Shield, Clock, Globe, MessageCircle,
  Image, Video, Home, Briefcase, Landmark,
  FileCheck, Users, BookOpen, Printer, Download,
  Edit2, Trash2, Plus, Minus, Check, AlertTriangle,
  Info, ArrowLeft, Smartphone, Eye, EyeOff, Heart,
  Award, Star, Trophy, Target, Zap, Sparkles,
  Layers, Grid, Layout, Palette, Circle, Square,
  Menu, MoreHorizontal, Copy, ExternalLink, Link,
  Bookmark, Flag, Bell, Settings, Power,
  Zap as ZapIcon, Rocket, Crown, Diamond,
  Search, Filter, Grid as GridIcon, List,
  Eye as ViewIcon, Bed, Bath, Trees, Wifi, Shield as ShieldIcon,
  Dumbbell, Waves, ParkingCircle, Sprout, Leaf, ChevronLeft, ChevronRight,
  File, FolderOpen, FileImage, FileSpreadsheet, FileArchive, ImagePlus,
  BriefcaseBusiness, Store, Globe2, Hash, IdCard, BadgeCheck,
  Link as LinkIcon, Share2, UsersRound, TrendingUp, PieChart,
  BarChart3, Activity, Building2, PenTool, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

// ============ BACKEND SERVICES ============
import { 
  getMyProfile, 
  updateMyProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadDocument,
  deleteDocument,
  updateVendorProperty,
  deleteVendorProperty,
  updateVendorPropertyStatus,
  uploadPropertyImage,
  deletePropertyImage,
  uploadPropertyVideo,
  deletePropertyVideo,
  mapPropertyToFrontend,
  mapPropertyToBackend,
  getDocumentContext
} from '../../services/profileService';

// ============ TOGGLE SWITCH COMPONENT ============
const ToggleSwitch = ({ isOn, onToggle, size = 'sm' }) => {
  const sizes = {
    sm: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      container: 'w-10 h-5',
      circle: 'w-4 h-4',
      translate: 'translate-x-5',
    },
    lg: {
      container: 'w-12 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-6',
    },
  };

  const selectedSize = sizes[size] || sizes.sm;

  return (
    <button
      type="button"
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 ${
        isOn ? 'bg-[#00695C]' : 'bg-gray-300'
      } ${selectedSize.container}`}
      onClick={onToggle}
      role="switch"
      aria-checked={isOn}
    >
      <span
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${
          isOn ? selectedSize.translate : 'translate-x-0'
        } ${selectedSize.circle}`}
      />
    </button>
  );
};

// ============ PDF VIEWER MODAL ============
const PdfViewerModal = ({ file, onClose }) => {
  if (!file) return null;

  const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
  const fileName = typeof file === 'string' ? file.split('/').pop() || 'document.pdf' : file.name || 'document.pdf';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 min-w-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white flex-shrink-0" />
            <h3 className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl truncate max-w-[100px] sm:max-w-[200px] md:max-w-md lg:max-w-lg">
              {fileName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-3 md:p-4 lg:p-6">
          <embed src={fileUrl} type="application/pdf" className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]" />
        </div>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 flex-shrink-0">
          <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-full">{fileName}</span>
          <button
            onClick={() => window.open(fileUrl, '_blank')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 bg-[#00695C] text-white rounded-xl text-[10px] sm:text-xs md:text-sm lg:text-base font-bold hover:bg-[#005A4F] transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Open in New Tab</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MEDIA LIGHTBOX MODAL ============
const MediaLightboxModal = ({ items, index, onClose, onNavigate, onDelete }) => {
  if (!items || items.length === 0) return null;
  const current = items[index];

  const goPrev = () => onNavigate((index - 1 + items.length) % items.length);
  const goNext = () => onNavigate((index + 1) % items.length);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-8 sm:-top-10 right-0 text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
        >
          <X className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>

        {items.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-1 sm:-left-14 md:-left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        <div className="w-full flex flex-col items-center gap-2 sm:gap-3 md:gap-4 animate-scaleIn">
          {current.type === 'video' ? (
            <video src={current.url} controls autoPlay className="max-w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] rounded-2xl shadow-2xl bg-black" />
          ) : (
            <img src={current.url} alt={current.name || 'Preview'} className="max-w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] rounded-2xl shadow-2xl object-contain bg-black/20" />
          )}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-[10px] sm:text-xs md:text-sm font-medium">
              <span className="truncate max-w-[100px] sm:max-w-[200px] md:max-w-full">{current.name}</span>
              {items.length > 1 && <span>· {index + 1} / {items.length}</span>}
            </div>
            {onDelete && (
              <button
                onClick={onDelete}
                title="Delete this file"
                className="flex items-center gap-0.5 sm:gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] md:text-[11px] font-bold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                Delete
              </button>
            )}
          </div>
        </div>

        {items.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-1 sm:-right-14 md:-right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============ PDF FILE CARD COMPONENT ============
const PdfFileCard = ({ file, onDelete, onView }) => {
  const fileName = file.name || 'document.pdf';
  const fileSize = file.size ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : 'Unknown size';
  
  const getPdfIcon = () => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp': return <FileImage className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv': return <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />;
      case 'zip':
      case 'rar':
      case '7z': return <FileArchive className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />;
      default: return <File className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500" />;
    }
  };

  return (
    <div className="group flex items-center gap-2 sm:gap-2.5 md:gap-3 bg-white rounded-xl p-2 sm:p-2.5 md:p-3 border border-gray-200 hover:border-[#00695C]/40 hover:shadow-md transition-all duration-300">
      <div className="flex-shrink-0 p-1 sm:p-1.5 md:p-2 bg-gray-50 rounded-lg group-hover:bg-[#00695C]/5 transition-colors duration-300">
        {getPdfIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <button
          onClick={onView}
          className="text-xs sm:text-sm font-medium text-gray-800 hover:text-[#00695C] transition-colors duration-300 truncate block w-full text-left hover:underline"
        >
          {fileName}
        </button>
        <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">{fileSize}</span>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
        <button
          onClick={onView}
          className="p-1 sm:p-1.5 text-[#00695C] hover:bg-[#00695C]/10 rounded-lg transition-colors duration-300"
          title="View PDF"
        >
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 sm:p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
          title="Delete file"
        >
          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
};

// ============ PROPERTY DETAILS MODAL ============
const PropertyDetailsModal = ({ property, onClose, onAddImages, onRemoveImage, onToggleStatus, onEdit, onDelete }) => {
  if (!property) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailImageInputRef = useRef(null);
  const rawImages = property.images || [];
  const hasImages = rawImages.length > 0;
  const images = hasImages ? rawImages : ['https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'];

  useEffect(() => {
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(Math.max(0, images.length - 1));
    }
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddImagesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddImages(property.id, files);
    }
    e.target.value = '';
  };

  const handleDeleteImage = (idx) => {
    onRemoveImage(property.id, idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-2xl h-[80vh] flex flex-col animate-scaleIn">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <h2 className="text-white text-base sm:text-lg md:text-xl font-bold truncate">
              {property.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64">
            <img 
              src={images[currentImageIndex]} 
              alt={property.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image';
              }}
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-black/60 text-white text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {hasImages && (
              <button
                onClick={() => handleDeleteImage(currentImageIndex)}
                title="Delete this image"
                className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Delete
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
              {hasImages ? `${images.length} image${images.length > 1 ? 's' : ''}` : 'No images uploaded yet'}
            </p>
            <button
              onClick={() => detailImageInputRef.current?.click()}
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Add Image
            </button>
            <input
              ref={detailImageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImagesChange}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-1.5">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-12 sm:w-14 md:w-16 h-9 sm:h-10 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
              <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Property ID</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
              <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
              <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bedrooms</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.bedrooms || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
              <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                <Bath className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bathrooms</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.bathrooms || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
              <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate">{property.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
              <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Posted</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.postedDate}</p>
              </div>
            </div>
          </div>

          {property.description && (
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-0.5 sm:mb-1">Description</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Features</h3>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {property.features.map((feature, index) => (
                  <span key={index} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#00695C]/10 text-[#00695C] rounded-lg text-[9px] sm:text-[10px] font-bold">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.selectedAmenities && property.selectedAmenities.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Amenities</h3>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {property.selectedAmenities.map((amenity, index) => (
                  <span key={index} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] sm:text-[10px] font-bold">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.contactPersonDetails && (property.contactPersonDetails.name || property.contactPersonDetails.mobile) && (
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Contact Person</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {property.contactPersonDetails.name && (
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg"><User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /></div>
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Name</p><p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.contactPersonDetails.name}</p></div>
                  </div>
                )}
                {property.contactPersonDetails.mobile && (
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg"><Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /></div>
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Mobile</p><p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.contactPersonDetails.mobile}</p></div>
                  </div>
                )}
                {property.contactPersonDetails.emailId && (
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg"><Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /></div>
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</p><p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate">{property.contactPersonDetails.emailId}</p></div>
                  </div>
                )}
                {property.contactPersonDetails.companyName && (
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg"><Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /></div>
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Agency</p><p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.contactPersonDetails.companyName}</p></div>
                  </div>
                )}
                {property.contactPersonDetails.reraRegistrationNumber && (
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg"><FileCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /></div>
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">RERA No.</p><p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.contactPersonDetails.reraRegistrationNumber}</p></div>
                  </div>
                )}
                {property.contactPersonDetails.experience && (
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                    <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg"><Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /></div>
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Experience</p><p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.contactPersonDetails.experience} yrs</p></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {property.documents && property.documents.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Documents</h3>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {property.documents.map((doc, index) => (
                  <a
                    key={doc.id || index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#00695C]/10 text-[#00695C] rounded-lg text-[9px] sm:text-[10px] font-bold hover:bg-[#00695C]/20 transition-colors"
                  >
                    <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {doc.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-wrap gap-2 sm:gap-2.5 flex-shrink-0">
          <button 
            onClick={() => {
              onClose();
              onEdit(property);
            }}
            className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
          >
            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Edit Property
          </button>
          <button 
            onClick={() => {
              onClose();
              onDelete(property);
            }}
            className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ DELETE PROPERTY CONFIRM MODAL ============
const DeletePropertyConfirmModal = ({ property, onConfirm, onCancel }) => {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Delete Property</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-2">
          Are you sure you want to delete <span className="font-bold text-[#00695C]">{property.name}</span>?
        </p>
        <p className="text-xs sm:text-sm text-red-500 mb-4 sm:mb-6">This action cannot be undone.</p>
        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ EDIT PROPERTY MODAL ============
const EditPropertyModal = ({ property, onSave, onCancel }) => {
  if (!property) return null;

  const editSteps = ['Property Details', 'Pricing & Amenities', 'Media Upload'];

  const [localStep, setLocalStep] = useState(0);
  const [localProperty, setLocalProperty] = useState({ ...property });
  const [localCustomAmenities, setLocalCustomAmenities] = useState([]);
  const [localImagePreviews, setLocalImagePreviews] = useState([]);
  const [localCoverPreview, setLocalCoverPreview] = useState(null);
  const [localVideoPreview, setLocalVideoPreview] = useState(null);
  const [localCoverImage, setLocalCoverImage] = useState(null);
  const [localVideoFile, setLocalVideoFile] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const availableAmenities = [
    "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance",
    "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center",
    "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
    "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
  ];

  useEffect(() => {
    setLocalProperty({ ...property });
    if (property.selectedAmenities) {
      const custom = property.selectedAmenities.filter(a => !availableAmenities.includes(a));
      setLocalCustomAmenities(custom);
    }
    if (property.images && property.images.length > 0) {
      setLocalImagePreviews(property.images.map(img => img));
    }
    if (property.coverImage) {
      setLocalCoverPreview(property.coverImage);
    }
    if (property.propertyVideo) {
      setLocalVideoPreview(property.propertyVideo);
    }
  }, [property]);

  const handleLocalChange = (field, value) => {
    setLocalProperty(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalAmenityToggle = (amenity) => {
    const current = localProperty.selectedAmenities || [];
    if (current.includes(amenity)) {
      setLocalProperty(prev => ({
        ...prev,
        selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
      }));
    } else {
      setLocalProperty(prev => ({
        ...prev,
        selectedAmenities: [...(prev.selectedAmenities || []), amenity]
      }));
    }
  };

  const handleLocalAddCustomAmenity = () => {
    if (localProperty.otherAmenities) {
      const newAmenity = localProperty.otherAmenities.trim();
      if (newAmenity && !localProperty.selectedAmenities.includes(newAmenity) && !localCustomAmenities.includes(newAmenity)) {
        setLocalCustomAmenities(prev => [...prev, newAmenity]);
        setLocalProperty(prev => ({
          ...prev,
          selectedAmenities: [...(prev.selectedAmenities || []), newAmenity],
          otherAmenities: ''
        }));
      }
    }
  };

  const handleLocalRemoveCustomAmenity = (amenity) => {
    setLocalCustomAmenities(prev => prev.filter(a => a !== amenity));
    setLocalProperty(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
    }));
  };

  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = Math.max(0, 3 - localImagePreviews.length);
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum 3 images allowed.`);
    }
    const limitedFiles = files.slice(0, remainingSlots);
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setLocalImagePreviews([...localImagePreviews, ...newPreviews]);
    setNewImageFiles([...newImageFiles, ...limitedFiles]);
  };

  const removeLocalImage = (index) => {
    const newPreviews = localImagePreviews.filter((_, i) => i !== index);
    setLocalImagePreviews(newPreviews);
    const newFiles = newImageFiles.filter((_, i) => i !== index);
    setNewImageFiles(newFiles);
  };

  const handleLocalCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Cover image must be less than 2MB');
        return;
      }
      setLocalCoverPreview(URL.createObjectURL(file));
      setLocalCoverImage(file);
    }
  };

  const removeLocalCoverImage = () => {
    if (localCoverPreview) URL.revokeObjectURL(localCoverPreview);
    setLocalCoverPreview(null);
    setLocalCoverImage(null);
  };

  const handleLocalVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Video must be less than 10MB');
        return;
      }
      setLocalVideoPreview(URL.createObjectURL(file));
      setLocalVideoFile(file);
    }
  };

  const removeLocalVideo = () => {
    if (localVideoPreview) URL.revokeObjectURL(localVideoPreview);
    setLocalVideoPreview(null);
    setLocalVideoFile(null);
  };

  const handleLocalNext = () => {
    setLocalStep(prev => prev + 1);
  };

  const handleLocalBack = () => {
    setLocalStep(prev => prev - 1);
  };

  const handleLocalSave = () => {
    const updatedProperty = {
      ...localProperty,
    };
    
    let finalImages = [...localImagePreviews];
    
    if (newImageFiles.length > 0) {
      const newUrls = newImageFiles.map(f => URL.createObjectURL(f));
      finalImages = [...finalImages, ...newUrls];
    }
    
    if (localCoverImage) {
      const coverUrl = URL.createObjectURL(localCoverImage);
      finalImages = [coverUrl, ...finalImages.filter((_, i) => i !== 0)];
      updatedProperty.coverImage = localCoverImage;
    }
    
    updatedProperty.images = finalImages;
    
    if (localVideoFile) {
      updatedProperty.propertyVideo = localVideoFile;
    }
    
    onSave(updatedProperty);
  };

  const renderStepContent = () => {
    if (localStep === 0) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title / Name</label>
              <input
                type="text"
                value={localProperty.name || ''}
                onChange={(e) => handleLocalChange('name', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. Green Valley 3BHK Apartment"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property ID</label>
              <input
                type="text"
                value={localProperty.id}
                disabled
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
            <div className="space-y-1.5">
              {['Independent House', 'Independent Villa', 'Duplex Residential Unit', 'Apartment', 'Commercial', 'Land'].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="propertyType"
                    className="accent-[#00695C] w-4 h-4 cursor-pointer"
                    checked={localProperty.type === type}
                    onChange={() => handleLocalChange('type', type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
            <textarea
              value={localProperty.location || ''}
              onChange={(e) => handleLocalChange('location', e.target.value)}
              rows="2"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
              placeholder="Enter complete property address"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">City</label>
            <input
              type="text"
              value={localProperty.propertyCity || ''}
              onChange={(e) => handleLocalChange('propertyCity', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="Enter city name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Details</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={localProperty.builtUpArea || ''}
                onChange={(e) => handleLocalChange('builtUpArea', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Build-up Area (sq ft)"
              />
              <input
                type="number"
                value={localProperty.carpetArea || ''}
                onChange={(e) => handleLocalChange('carpetArea', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Carpet Area (sq ft)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
              <input
                type="number"
                value={localProperty.bedrooms || ''}
                onChange={(e) => handleLocalChange('bedrooms', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Number of bedrooms"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
              <input
                type="number"
                value={localProperty.bathrooms || ''}
                onChange={(e) => handleLocalChange('bathrooms', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Number of bathrooms"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
            <div className="space-y-1.5">
              {['Full Furnish', 'Semi Furnish', 'Unfurnished'].map(f => (
                <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="furnishing"
                    className="accent-[#00695C] w-4 h-4 cursor-pointer"
                    checked={localProperty.furnishing === f}
                    onChange={() => handleLocalChange('furnishing', f)}
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking Facility</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="parking"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.parking === 'yes' || localProperty.parking === 'Yes'}
                  onChange={() => handleLocalChange('parking', 'yes')}
                />
                Yes, available
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="parking"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.parking === 'no' || localProperty.parking === 'No'}
                  onChange={() => handleLocalChange('parking', 'no')}
                />
                No parking
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
            <select
              value={localProperty.status || 'Active'}
              onChange={(e) => handleLocalChange('status', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
            <textarea
              value={localProperty.description || ''}
              onChange={(e) => handleLocalChange('description', e.target.value)}
              rows="3"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
              placeholder="Enter property description..."
            />
          </div>
        </div>
      );
    } else if (localStep === 1) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="listingPurpose"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.listingPurpose === 'sale' || localProperty.listingPurpose === 'For Sale'}
                  onChange={() => handleLocalChange('listingPurpose', 'sale')}
                />
                For Sale
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="listingPurpose"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.listingPurpose === 'rent' || localProperty.listingPurpose === 'For Rent'}
                  onChange={() => handleLocalChange('listingPurpose', 'rent')}
                />
                For Rent
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="listingPurpose"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.listingPurpose === 'lease' || localProperty.listingPurpose === 'For Lease'}
                  onChange={() => handleLocalChange('listingPurpose', 'lease')}
                />
                For Lease
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">
              {localProperty.listingPurpose === 'sale' || localProperty.listingPurpose === 'For Sale'
                ? 'Expected Price (₹)'
                : localProperty.listingPurpose === 'lease' || localProperty.listingPurpose === 'For Lease'
                ? 'Expected Lease Amount (₹/month)'
                : 'Expected Rent (₹/month)'}
            </label>
            <input
              type="text"
              value={localProperty.expectedPrice || localProperty.price?.replace(/[^0-9]/g, '') || ''}
              onChange={(e) => handleLocalChange('expectedPrice', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="e.g. 15,000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">
              {localProperty.listingPurpose === 'sale' || localProperty.listingPurpose === 'For Sale'
                ? 'Budget Range (₹)'
                : 'Budget Range (₹/month)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localProperty.budgetRange?.min || ''}
                onChange={(e) => handleLocalChange('budgetRange', { ...localProperty.budgetRange, min: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Max"
                value={localProperty.budgetRange?.max || ''}
                onChange={(e) => handleLocalChange('budgetRange', { ...localProperty.budgetRange, max: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.priceType === 'fixed'}
                  onChange={() => handleLocalChange('priceType', 'fixed')}
                />
                Fixed Price
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.priceType === 'negotiable'}
                  onChange={() => handleLocalChange('priceType', 'negotiable')}
                />
                Negotiable
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance Charges (₹/month)</label>
            <input
              type="text"
              value={localProperty.maintenance || ''}
              onChange={(e) => handleLocalChange('maintenance', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="Enter monthly maintenance"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
            <input
              type="date"
              value={localProperty.availableFrom || ''}
              onChange={(e) => handleLocalChange('availableFrom', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Select Amenities</label>
            <div className="flex flex-wrap gap-1.5">
              {availableAmenities.map(a => (
                <span
                  key={a}
                  onClick={() => handleLocalAmenityToggle(a)}
                  className={`px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${
                    localProperty.selectedAmenities?.includes(a)
                      ? 'bg-[#00695C] text-white border-[#00695C]'
                      : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  {a}
                </span>
              ))}
              {localCustomAmenities.map(a => (
                <span key={a} className="px-2.5 py-1 text-xs bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
                  {a}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={() => handleLocalRemoveCustomAmenity(a)} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Other Amenities</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localProperty.otherAmenities || ''}
                onChange={(e) => handleLocalChange('otherAmenities', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. Clubhouse, CCTV, Solar Panel..."
                onKeyPress={(e) => e.key === 'Enter' && handleLocalAddCustomAmenity()}
              />
              <button
                onClick={handleLocalAddCustomAmenity}
                className="px-4 py-2 text-sm bg-[#00695C] text-white rounded-xl hover:bg-[#005A4F] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
            <input
              type="text"
              value={localProperty.features?.join(', ') || ''}
              onChange={(e) => {
                const features = e.target.value.split(',').map(f => f.trim());
                handleLocalChange('features', features);
              }}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="2 BHK, Sea View, Parking, etc."
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-50">
            <div className="w-1 h-4 bg-[#00695C] rounded" />
            <h3 className="text-sm font-bold text-[#00695C]">Media Upload</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">📸 Upload property images and media</p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Cover Image</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" className="hidden" id="edit-cover" onChange={handleLocalCoverImageUpload} />
              <label htmlFor="edit-cover" className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Cover Image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
              </label>
            </div>
            {localCoverPreview && (
              <div className="mt-2 relative">
                <img src={localCoverPreview} alt="Cover" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                <button onClick={removeLocalCoverImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Photos (Max 3)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" id="edit-photos" onChange={handleLocalImageUpload} disabled={localImagePreviews.length >= 3} />
              <label htmlFor="edit-photos" className={`cursor-pointer flex flex-col items-center ${localImagePreviews.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Property Photos</span>
                <span className="text-xs text-gray-400 mt-1">Max 3 photos</span>
              </label>
            </div>
            {localImagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {localImagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                    <button onClick={() => removeLocalImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">{localImagePreviews.length}/3 images uploaded</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Video (Optional)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="video/mp4,video/mov" className="hidden" id="edit-video" onChange={handleLocalVideoUpload} />
              <label htmlFor="edit-video" className="cursor-pointer flex flex-col items-center">
                <Video className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Property Video Tour</span>
                <span className="text-xs text-gray-400 mt-1">MP4/MOV (Max 10MB)</span>
              </label>
            </div>
            {localVideoPreview && (
              <div className="mt-2 relative">
                <video src={localVideoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                <button onClick={removeLocalVideo} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-3xl max-h-[80vh] flex flex-col animate-scaleIn">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <h2 className="text-white text-lg sm:text-xl font-bold">Edit Property</h2>
          </div>
          <button 
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0 px-3 sm:px-4 pt-2 overflow-x-auto">
          {editSteps.map((stepName, idx) => (
            <button
              key={idx}
              onClick={() => setLocalStep(idx)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                localStep === idx
                  ? 'border-[#00695C] text-[#00695C]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {stepName}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {renderStepContent()}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
          <div className="flex gap-2">
            {localStep > 0 && (
              <button
                onClick={handleLocalBack}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#00695C] bg-teal-50 rounded-xl hover:bg-teal-100 transition-all"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onCancel}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300"
            >
              Cancel
            </button>
            {localStep < editSteps.length - 1 ? (
              <button
                onClick={handleLocalNext}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleLocalSave}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ AGENT PROFILE COMPONENT ============
const AgentProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfToView, setPdfToView] = useState(null);
  const [showMediaLightbox, setShowMediaLightbox] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeletePropertyConfirm, setShowDeletePropertyConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  
  const profilePhotoInputRef = useRef(null);
  const agencyLogoInputRef = useRef(null);
  const fileInputRefs = useRef({});

  // ============ STATE - PROPERTIES (Initialized as empty array) ============
  const [properties, setProperties] = useState([]);

  // ============ STATE - EDIT FORM ============
  const [editForm, setEditForm] = useState({
    // Personal Details
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    gender: '',

    // Business Information
    agencyName: '',
    reraRegistrationNumber: '',
    gstNumber: '',
    yearsOfExperience: '',
    numberOfActiveListings: '',
    serviceAreas: '',
    officeAddress: '',

    // Identity Verification
    aadhaarNumber: '',
    panNumber: '',

    // Contact Information
    city: '',
    district: '',
    state: '',
    pinCode: '',
    website: '',
    whatsappNumber: '',

    // Bank Details
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',

    // Social Media
    facebookPage: '',
    instagram: '',
    linkedIn: '',
    youtubeChannel: '',
  });

  // ============ STATE - DOCUMENTS ============
  const [documents, setDocuments] = useState({
    // Profile Images
    profilePhoto: null,
    agencyLogo: null,
    
    // Identity Documents
    aadhaarCard: null,
    panCard: null,
    
    // Business Documents
    reraCertificate: null,
    gstCertificate: null,
    businessRegistrationCertificate: null,
    
    // Property Images (for display)
    coverImage: null,
    propertyPhotos: [],
    propertyVideo: null,
    
    // Property Documents
    floorPlan: null,
    saleDeed: null,
    pattaChitta: null,
    encumbranceCertificate: null,
    propertyTaxReceipt: null,
    buildingApprovalPlan: null,
    completionCertificate: null,
    occupancyCertificate: null,
    rentalAgreement: null,
    
    // Other documents
    otherDocuments: [],
  });

  // ============ FETCH AGENT PROFILE DATA ============
  const fetchAgentProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getMyProfile("agent");
      console.log("✅ Profile data loaded:", response);
      
      // Extract data from response
      const profileData = response?.profile || {};
      const propertiesData = response?.properties || [];
      
      // ============ 1. SET EDIT FORM (Agent Profile Data) ============
      setEditForm({
        // Personal Details
        fullName: profileData.fullName || profileData.agentName || '',
        mobileNumber: profileData.mobileNumber || profileData.mobile || '',
        emailAddress: profileData.emailAddress || profileData.emailId || '',
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        
        // Business Information
        agencyName: profileData.agencyName || profileData.companyName || '',
        reraRegistrationNumber: profileData.reraRegistrationNumber || '',
        gstNumber: profileData.gstNumber || '',
        yearsOfExperience: profileData.yearsOfExperience || profileData.experience || '',
        numberOfActiveListings: profileData.numberOfActiveListings || profileData.activeListings || '0',
        serviceAreas: profileData.serviceAreas || profileData.serviceArea || '',
        officeAddress: profileData.officeAddress || profileData.address || '',
        
        // Identity Verification
        aadhaarNumber: profileData.aadhaarNumber || '',
        panNumber: profileData.panNumber || '',
        
        // Contact Information
        city: profileData.city || '',
        district: profileData.district || '',
        state: profileData.state || '',
        pinCode: profileData.pinCode || '',
        website: profileData.website || '',
        whatsappNumber: profileData.whatsappNumber || '',
        
        // Bank Details
        accountHolderName: profileData.accountHolderName || '',
        bankName: profileData.bankName || '',
        accountNumber: profileData.accountNumber || '',
        ifscCode: profileData.ifscCode || '',
        upiId: profileData.upiId || '',
        
        // Social Media
        facebookPage: profileData.facebookPage || profileData.facebook || '',
        instagram: profileData.instagram || '',
        linkedIn: profileData.linkedIn || profileData.linkedin || '',
        youtubeChannel: profileData.youtubeChannel || profileData.youtube || '',
      });
      
      // ============ 2. SET PROPERTIES ============
      const formattedProperties = propertiesData.map(mapPropertyToFrontend);
      setProperties(formattedProperties);
      
      // ============ 3. SET DOCUMENTS ============
      // Get profile photo from profile data
      const profilePhotoUrl = profileData.profilePhoto || profileData.profilePhotoUrl || null;
      const agencyLogoUrl = profileData.companyLogo || profileData.agencyLogo || profileData.companyLogoUrl || null;
      
      // Extract images from all properties
      let allImages = [];
      let allDocuments = [];
      let videoUrl = null;
      let floorPlanUrl = null;
      
      propertiesData.forEach((prop) => {
        // Format images
        const images = prop.images || [];
        images.forEach(img => {
          if (img.fileUrl) {
            allImages.push(img.fileUrl);
          }
        });
        
        // Extract video if exists
        if (prop.videoUrl) {
          videoUrl = prop.videoUrl;
        }
        
        // Extract floor plan if exists
        if (prop.floorPlan) {
          floorPlanUrl = prop.floorPlan;
        }
        
        // Extract documents (property documents have is_propertydocument = true)
        const documents = prop.documents || [];
        documents.forEach(doc => {
          allDocuments.push({
            id: doc.id,
            name: doc.fileName || doc.name || 'Document',
            url: doc.fileUrl || doc.url,
            type: doc.documentType || 'other',
            isPropertyDocument: doc.is_propertydocument || true,
            propertyId: prop.id,
            size: doc.fileSize || 0,
          });
        });
      });
      
      // Set documents state
      setDocuments({
        // Profile Images
        profilePhoto: profilePhotoUrl,
        agencyLogo: agencyLogoUrl,
        
        // Identity Documents
        aadhaarCard: null,
        panCard: null,
        
        // Business Documents
        reraCertificate: null,
        gstCertificate: null,
        businessRegistrationCertificate: null,
        
        // Property Images
        coverImage: allImages.length > 0 ? allImages[0] : null,
        propertyPhotos: allImages.slice(0, 3),
        propertyVideo: videoUrl,
        
        // Property Documents
        floorPlan: floorPlanUrl,
        saleDeed: null,
        pattaChitta: null,
        encumbranceCertificate: null,
        propertyTaxReceipt: null,
        buildingApprovalPlan: null,
        completionCertificate: null,
        occupancyCertificate: null,
        rentalAgreement: null,
        
        // Other documents
        otherDocuments: allDocuments,
      });
      
      console.log('✅ Agent profile data loaded successfully');
      
    } catch (error) {
      console.error('❌ Error fetching agent profile data:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ USE EFFECT ============
  useEffect(() => {
    fetchAgentProfileData();
  }, []);

  // ============ NAVIGATION ============
  const handleNavigateBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  // ============ TOAST HANDLER ============
  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ============ FORM CHANGE HANDLER ============
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split('-');
      setEditForm(prev => ({ ...prev, dateOfBirth: `${day}-${month}-${year}` }));
    } else {
      setEditForm(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  // ============ HANDLE SAVE ============
  const handleSave = async () => {
    const requiredFields = ['fullName', 'mobileNumber', 'emailAddress', 'agencyName', 'aadhaarNumber', 'panNumber'];
    const missingFields = requiredFields.filter(field => !editForm[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const profileData = {
        fullName: editForm.fullName,
        mobileNumber: editForm.mobileNumber,
        emailAddress: editForm.emailAddress,
        dateOfBirth: editForm.dateOfBirth,
        gender: editForm.gender,
        agencyName: editForm.agencyName,
        reraRegistrationNumber: editForm.reraRegistrationNumber,
        gstNumber: editForm.gstNumber,
        yearsOfExperience: editForm.yearsOfExperience,
        numberOfActiveListings: editForm.numberOfActiveListings,
        serviceAreas: editForm.serviceAreas,
        officeAddress: editForm.officeAddress,
        aadhaarNumber: editForm.aadhaarNumber,
        panNumber: editForm.panNumber,
        city: editForm.city,
        district: editForm.district,
        state: editForm.state,
        pinCode: editForm.pinCode,
        website: editForm.website,
        whatsappNumber: editForm.whatsappNumber,
        accountHolderName: editForm.accountHolderName,
        bankName: editForm.bankName,
        accountNumber: editForm.accountNumber,
        ifscCode: editForm.ifscCode,
        upiId: editForm.upiId,
        facebookPage: editForm.facebookPage,
        instagram: editForm.instagram,
        linkedIn: editForm.linkedIn,
        youtubeChannel: editForm.youtubeChannel,
      };
      
      await updateMyProfile('agent', profileData);
      setShowEditModal(false);
      showSuccessToast();
      await fetchAgentProfileData();
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ FILE UPLOAD HANDLERS ============
  const handleFileUpload = async (field, file) => {
    if (file) {
      setIsLoading(true);
      try {
        // Use the smart document upload
        const response = await uploadDocument({
          role: 'agent',
          field: field,
          file: file,
          propertyId: null  // Vendor documents have no property ID
        });
        
        console.log('✅ Document uploaded:', response);
        
        setDocuments(prev => ({
          ...prev,
          [field]: file
        }));
        showSuccessToast();
      } catch (error) {
        console.error('❌ Error uploading document:', error);
        alert('Failed to upload document. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadProfilePhoto('agent', file);
        console.log('✅ Photo uploaded:', response);
        
        if (response.data?.fileUrl) {
          setDocuments(prev => ({
            ...prev,
            profilePhoto: response.data.fileUrl
          }));
          showSuccessToast();
          await fetchAgentProfileData();
        }
      } catch (error) {
        console.error('❌ Error uploading profile photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAgencyLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadDocument({
          role: 'agent',
          field: 'agencyLogo',
          file: file,
          propertyId: null
        });
        console.log('✅ Agency logo uploaded:', response);
        showSuccessToast();
        await fetchAgentProfileData();
      } catch (error) {
        console.error('❌ Error uploading agency logo:', error);
        alert('Failed to upload logo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePdfUpload = async (field, file) => {
    if (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setIsLoading(true);
        try {
          const response = await uploadDocument({
            role: 'agent',
            field: field,
            file: file,
            propertyId: null
          });
          console.log('✅ Document uploaded:', response);
          setDocuments(prev => ({
            ...prev,
            [field]: file
          }));
          showSuccessToast();
        } catch (error) {
          console.error('❌ Error uploading document:', error);
          alert('Failed to upload document. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  const handlePdfView = (field) => {
    const file = documents[field];
    if (file) {
      setPdfToView(file);
      setShowPdfViewer(true);
    }
  };

  const handlePdfDelete = (field) => {
    setDeleteItem({ field });
    setShowDeleteConfirm(true);
  };

  const removeFile = (field) => {
    setDeleteItem({ field });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteItem) {
      const { field } = deleteItem;
      setIsLoading(true);
      try {
        await deleteDocument({
          role: 'agent',
          field: field,
          propertyId: null
        });
        setDocuments(prev => ({
          ...prev,
          [field]: null
        }));
        if (fileInputRefs.current[field]) {
          fileInputRefs.current[field].value = '';
        }
        setShowDeleteConfirm(false);
        setDeleteItem(null);
        showSuccessToast();
      } catch (error) {
        console.error('❌ Error deleting document:', error);
        alert('Failed to delete document. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfilePhotoDelete = () => {
    setShowProfilePhotoDeleteConfirm(true);
  };

  const confirmProfilePhotoDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProfilePhoto('agent');
      setDocuments(prev => ({
        ...prev,
        profilePhoto: null
      }));
      if (profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = '';
      }
      setShowProfilePhotoDeleteConfirm(false);
      showSuccessToast();
      await fetchAgentProfileData();
    } catch (error) {
      console.error('❌ Error deleting profile photo:', error);
      alert('Failed to delete photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ INVOICE PDF HANDLER ============
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const teal = [0, 105, 92];

    doc.setFillColor(...teal);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Agent Profile Invoice', 14, 17);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 196, 17, { align: 'right' });

    doc.setTextColor(30, 30, 30);
    let y = 40;

    const section = (title) => {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...teal);
      doc.text(title, 14, y);
      doc.setDrawColor(...teal);
      doc.line(14, y + 1.5, 196, y + 1.5);
      y += 8;
      doc.setFont(undefined, 'normal');
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10.5);
    };

    const row = (label, value) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 14, y);
      doc.setFont(undefined, 'normal');
      doc.text(String(value || 'Not specified'), 65, y);
      y += 7;
    };

    section('Personal Details');
    row('Full Name', editForm.fullName);
    row('Mobile Number', editForm.mobileNumber);
    row('Email Address', editForm.emailAddress);
    row('Date of Birth', editForm.dateOfBirth);
    row('Gender', editForm.gender);
    y += 4;

    section('Business Information');
    row('Agency Name', editForm.agencyName);
    row('RERA Number', editForm.reraRegistrationNumber);
    row('GST Number', editForm.gstNumber);
    row('Years of Experience', editForm.yearsOfExperience);
    row('Active Listings', editForm.numberOfActiveListings);
    row('Service Areas', editForm.serviceAreas);
    y += 4;

    section('Identity & Contact');
    row('Aadhaar Number', editForm.aadhaarNumber);
    row('PAN Number', editForm.panNumber);
    row('Office Address', editForm.officeAddress);
    row('City', editForm.city);
    row('State', editForm.state);
    row('PIN Code', editForm.pinCode);
    row('Website', editForm.website);
    row('WhatsApp', editForm.whatsappNumber);
    y += 4;

    section('Bank Details');
    row('Account Holder', editForm.accountHolderName);
    row('Bank Name', editForm.bankName);
    row('Account Number', editForm.accountNumber);
    row('IFSC Code', editForm.ifscCode);
    row('UPI ID', editForm.upiId);

    section('Properties Summary');
    row('Total Properties', properties.length);
    row('Active Listings', properties.filter(p => p.status === 'Active').length);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system-generated document.', 14, 287);

    doc.save(`Invoice_${editForm.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  // ============ SECTION DEFINITIONS ============
  const sections = [
    { id: 'personal', title: 'Personal Details', icon: User },
    { id: 'business', title: 'Business Information', icon: Briefcase },
    { id: 'identity', title: 'Identity Verification', icon: Shield },
    { id: 'documents', title: 'Upload Documents', icon: FileText },
    { id: 'bank', title: 'Bank Details', icon: Banknote },
    { id: 'social', title: 'Social Media', icon: Share2 },
    { id: 'contact', title: 'Contact Information', icon: MapPin },
  ];

  // ============ FORMAT HELPERS ============
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return 'Not specified';
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) return dateStr;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateStr.split('-');
      return `${day}-${month}-${year}`;
    }
    return dateStr;
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const getFileStatusLabel = (field) => {
    const file = documents[field];
    return file !== null && file !== undefined ? 'Uploaded' : null;
  };

  const getListingPurposeLabel = (purpose) => {
    if (!purpose) return 'Not specified';
    const normalized = purpose.toLowerCase();
    if (normalized === 'sale' || normalized === 'for sale') return 'For Sale';
    if (normalized === 'rent' || normalized === 'for rent') return 'For Rent';
    if (normalized === 'lease' || normalized === 'for lease') return 'For Lease';
    return purpose;
  };

  // ============ PROPERTY HANDLERS ============
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty({ ...property });
    setShowEditPropertyModal(true);
  };

  const handleToggleStatus = async (property) => {
    const newStatus = property.status === 'Active' ? 'Inactive' : 'Active';
    setIsLoading(true);
    try {
      await updateVendorPropertyStatus('agent', property.id, newStatus);
      setProperties(prev => 
        prev.map(p => p.id === property.id ? { ...p, status: newStatus } : p)
      );
      showSuccessToast();
    } catch (error) {
      console.error('❌ Error updating property status:', error);
      alert('Failed to update property status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPropertyImages = async (propertyId, files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    setIsLoading(true);
    try {
      for (const file of fileArray) {
        await uploadPropertyImage('agent', propertyId, file);
      }
      
      setProperties(prev =>
        prev.map(p => p.id === propertyId 
          ? { ...p, images: [...(p.images || []), ...fileArray.map(f => URL.createObjectURL(f))] }
          : p
        )
      );
      setSelectedProperty(prev =>
        prev && prev.id === propertyId 
          ? { ...prev, images: [...(prev.images || []), ...fileArray.map(f => URL.createObjectURL(f))] }
          : prev
      );
      showSuccessToast();
    } catch (error) {
      console.error('❌ Error uploading property images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePropertyImage = async (propertyId, imageIndex) => {
    setIsLoading(true);
    try {
      await deletePropertyImage('agent', propertyId, imageIndex);
      
      setProperties(prev =>
        prev.map(p => p.id === propertyId 
          ? { ...p, images: (p.images || []).filter((_, i) => i !== imageIndex) }
          : p
        )
      );
      setSelectedProperty(prev =>
        prev && prev.id === propertyId 
          ? { ...prev, images: (prev.images || []).filter((_, i) => i !== imageIndex) }
          : prev
      );
      showSuccessToast();
    } catch (error) {
      console.error('❌ Error deleting property image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePropertyEdit = async (updatedProperty) => {
    if (!updatedProperty) return;
    setIsLoading(true);
    try {
      const backendData = mapPropertyToBackend(updatedProperty);
      await updateVendorProperty('agent', updatedProperty.id, backendData);
      
      setProperties(prev => 
        prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
      );
      setShowEditPropertyModal(false);
      setEditingProperty(null);
      showSuccessToast();
    } catch (error) {
      console.error('❌ Error updating property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = (property) => {
    setPropertyToDelete(property);
    setShowDeletePropertyConfirm(true);
  };

  const confirmDeleteProperty = async () => {
    setIsLoading(true);
    try {
      await deleteVendorProperty('agent', propertyToDelete.id);
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      setShowDeletePropertyConfirm(false);
      setPropertyToDelete(null);
      showSuccessToast();
    } catch (error) {
      console.error('❌ Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ FILTER PROPERTIES ============
  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(prop => {
        return (
          prop.name.toLowerCase().includes(searchLower) ||
          prop.id.toLowerCase().includes(searchLower) ||
          prop.location.toLowerCase().includes(searchLower) ||
          prop.type.toLowerCase().includes(searchLower) ||
          prop.price.toLowerCase().includes(searchLower) ||
          prop.area.toLowerCase().includes(searchLower)
        );
      });
    }
    
    if (filterStatus && filterStatus !== 'all') {
      const statusLower = filterStatus.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.status.toLowerCase() === statusLower
      );
    }
    
    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  const clearSearch = () => {
    setSearchTerm('');
  };

  // ============ RENDER HELPERS ============
  const RingBadge = ({ pct }) => {
    const circumference = 2 * Math.PI * 15.5;
    const dashOffset = circumference - (pct / 100) * circumference;
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 border border-[#00695C]/15 rounded-2xl pl-2 pr-4 py-1.5 shadow-sm">
        <div className="relative w-9 h-9 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00695C1A" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke="url(#ringGradShared)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            <defs>
              <linearGradient id="ringGradShared" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00695C" />
                <stop offset="100%" stopColor="#26A69A" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#00695C]">
            {pct}%
          </span>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, subtitle, filled, total }) => {
    const pct = total ? Math.round((filled / total) * 100) : null;
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2 sm:gap-3">
        <div className="flex items-center">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-2 sm:mr-3 rounded-full animate-pulse-slow"></div>
          <div>
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {pct !== null && (
          <div className="flex items-center gap-2">
            <RingBadge pct={pct} />
            <div className="leading-tight hidden sm:block">
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Completion</p>
              <p className="text-[10px] text-gray-400">{filled} of {total} complete</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AnimatedCard = ({ label, value, icon, delay = 0, children }) => (
    <div
      className="group/acard relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] border border-[#00695C]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/40 to-[#00695C]/0 opacity-0 group-hover/acard:opacity-100 blur-sm transition-opacity duration-500 -z-10" />
      <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/60 to-transparent group-hover/acard:left-full transition-all duration-[1100ms] ease-out" />
      <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl opacity-0 group-hover/acard:opacity-100 group-hover/acard:scale-125 transition-all duration-500" />
      <div className="relative p-2.5 sm:p-3.5 flex items-start gap-2 sm:gap-3">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] blur-md opacity-0 group-hover/acard:opacity-60 transition-opacity duration-500" />
          <div className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover/acard:scale-110 group-hover/acard:rotate-6 transition-all duration-300">
            <div className="text-white">{icon}</div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-wider group-hover/acard:text-[#00695C] transition-colors duration-300">
            {label}
          </label>
          {children ? (
            children
          ) : (
            <div className="text-xs sm:text-[13px] text-gray-800 font-semibold break-words">
              {value || <span className="text-gray-400 font-medium italic">Not specified</span>}
            </div>
          )}
        </div>
        {value && !children && (
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C]/30 group-hover/acard:text-[#00695C] flex-shrink-0 transition-colors duration-300" />
        )}
      </div>
      <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover/acard:w-full transition-all duration-700 ease-out" />
      </div>
    </div>
  );

  // ============ SECTION CONTENT RENDER ============
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal': {
        const personalFields = [
          editForm.fullName,
          editForm.mobileNumber,
          editForm.emailAddress,
          editForm.dateOfBirth,
          editForm.gender,
          documents.profilePhoto
        ];
        const filledCount = personalFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Personal Details"
              subtitle="Manage your personal information"
              filled={filledCount}
              total={personalFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Full Name" value={editForm.fullName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Mobile Number" value={editForm.mobileNumber} icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="Email Address" value={editForm.emailAddress} icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Date of Birth" value={formatDateForDisplay(editForm.dateOfBirth)} icon={<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
                <AnimatedCard label="Gender" value={editForm.gender} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Profile Photo" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4}>
                  <div className="flex items-center gap-2">
                    {documents.profilePhoto ? (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No photo uploaded</span>
                    )}
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'business': {
        const businessFields = [
          editForm.agencyName,
          editForm.reraRegistrationNumber,
          editForm.gstNumber,
          editForm.yearsOfExperience,
          editForm.numberOfActiveListings,
          editForm.serviceAreas,
          editForm.officeAddress,
          documents.agencyLogo
        ];
        const filledCount = businessFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Business Information"
              subtitle="Manage your agency and business details"
              filled={filledCount}
              total={businessFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Agency Name" value={editForm.agencyName} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="RERA Registration Number" value={editForm.reraRegistrationNumber} icon={<BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="GST Number" value={editForm.gstNumber || 'Not provided'} icon={<Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
                <AnimatedCard label="Years of Experience" value={editForm.yearsOfExperience} icon={<Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Number of Active Listings" value={editForm.numberOfActiveListings} icon={<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Service Areas" value={editForm.serviceAreas} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47} />
                <AnimatedCard label="Agency Logo" icon={<Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.54}>
                  <div className="flex items-center gap-2">
                    {documents.agencyLogo ? (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No logo uploaded</span>
                    )}
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'identity': {
        const identityFields = [
          editForm.aadhaarNumber,
          editForm.panNumber,
          documents.aadhaarCard,
          documents.panCard,
          documents.businessRegistrationCertificate,
          documents.reraCertificate
        ];
        const filledCount = identityFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Identity Verification"
              subtitle="Your identity and verification documents"
              filled={filledCount}
              total={identityFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Upload Aadhaar Card" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19}>
                  {documents.aadhaarCard ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('aadhaarCard')}
                        className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('aadhaarCard')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
                <AnimatedCard label="Upload PAN Card" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26}>
                  {documents.panCard ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('panCard')}
                        className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('panCard')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
                <AnimatedCard label="Business Registration Certificate" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33}>
                  {documents.businessRegistrationCertificate ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('businessRegistrationCertificate')}
                        className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('businessRegistrationCertificate')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
                <AnimatedCard label="RERA Certificate" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4}>
                  {documents.reraCertificate ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('reraCertificate')}
                        className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('reraCertificate')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'documents': {
        const docFields = [
          'profilePhoto',
          'agencyLogo',
          'aadhaarCard',
          'panCard',
          'reraCertificate',
          'gstCertificate',
          'businessRegistrationCertificate'
        ];
        const filledCount = docFields.filter(f => {
          const v = documents[f];
          return v !== null && v !== undefined;
        }).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Upload Documents"
              subtitle="All your important documents in one place"
              filled={filledCount}
              total={docFields.length}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 w-full">
              {[
                { field: 'profilePhoto', label: 'Profile Photo', icon: <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'agencyLogo', label: 'Agency Logo', icon: <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'aadhaarCard', label: 'Aadhaar Card', icon: <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'panCard', label: 'PAN Card', icon: <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'reraCertificate', label: 'RERA Certificate', icon: <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'gstCertificate', label: 'GST Certificate', icon: <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'businessRegistrationCertificate', label: 'Business Registration', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
              ].map((doc) => {
                const file = documents[doc.field];
                const hasFile = file !== null && file !== undefined;

                return (
                  <div
                    key={doc.field}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10 hover:border-[#00695C]/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-2.5 sm:p-3">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300">
                            <div className="text-white">
                              {doc.icon}
                            </div>
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-gray-700">{doc.label}</span>
                        </div>
                        {hasFile && (
                          <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">
                            ✓
                          </span>
                        )}
                      </div>

                      {hasFile ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg p-1 sm:p-1.5 border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
                          {doc.field === 'profilePhoto' || doc.field === 'agencyLogo' ? (
                            <button
                              onClick={() => {
                                const items = [{
                                  type: 'image',
                                  url: URL.createObjectURL(file),
                                  name: file.name || `${doc.label}`
                                }];
                                setLightboxItems(items);
                                setLightboxIndex(0);
                                setShowMediaLightbox(true);
                              }}
                              className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1"
                            >
                              <Image className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span className="truncate">{file.name || 'Image'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePdfView(doc.field)}
                              className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1"
                            >
                              <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span className="truncate">{file.name || 'Document'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(doc.field)}
                            className="p-0.5 sm:p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300 flex-shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-1.5 sm:p-2 text-center hover:border-[#00695C] hover:bg-[#00695C]/5 transition-all duration-300 group/upload">
                          <label className="block cursor-pointer">
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                              <div className="p-0.5 sm:p-1 bg-gray-100 rounded-lg group-hover/upload:bg-[#00695C]/10 transition-colors duration-300">
                                <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover/upload:text-[#00695C] transition-colors duration-300" />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 group-hover/upload:text-[#00695C] transition-colors duration-300">
                                Upload
                              </span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept={doc.field === 'profilePhoto' || doc.field === 'agencyLogo' ? 'image/*' : '.pdf'}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (doc.field === 'profilePhoto' || doc.field === 'agencyLogo') {
                                    handleFileUpload(doc.field, file);
                                  } else {
                                    handlePdfUpload(doc.field, file);
                                  }
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'bank': {
        const bankFields = [
          editForm.accountHolderName,
          editForm.bankName,
          editForm.accountNumber,
          editForm.ifscCode,
          editForm.upiId
        ];
        const filledCount = bankFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Bank Details"
              subtitle="Your banking and financial information"
              filled={filledCount}
              total={bankFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Account Holder Name" value={editForm.accountHolderName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Bank Name" value={editForm.bankName} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="Account Number" value={editForm.accountNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="IFSC Code" value={editForm.ifscCode} icon={<Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
                <AnimatedCard label="UPI ID" value={editForm.upiId || 'Not provided'} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
              </div>
            </div>
          </div>
        );
      }

      case 'social': {
        const socialFields = [
          editForm.website,
          editForm.facebookPage,
          editForm.instagram,
          editForm.linkedIn,
          editForm.youtubeChannel
        ];
        const filledCount = socialFields.filter(Boolean).length;

        const getSocialUrl = (platform, value) => {
          if (!value) return '#';
          if (value.startsWith('http://') || value.startsWith('https://')) {
            return value;
          }
          const cleanValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
          switch(platform) {
            case 'website': return `https://${cleanValue}`;
            case 'facebook': return `https://www.facebook.com/${cleanValue}`;
            case 'instagram': return `https://www.instagram.com/${cleanValue}`;
            case 'linkedin': return `https://www.linkedin.com/${cleanValue}`;
            case 'youtube': return `https://www.youtube.com/${cleanValue}`;
            default: return `https://${cleanValue}`;
          }
        };

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Social Media & Website"
              subtitle="Your online presence and social media links"
              filled={filledCount}
              total={socialFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Website" icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05}>
                  {editForm.website ? (
                    <a 
                      href={getSocialUrl('website', editForm.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
                    >
                      {editForm.website}
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                    </a>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
                  )}
                </AnimatedCard>

                <AnimatedCard label="Facebook Page" icon={<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12}>
                  {editForm.facebookPage ? (
                    <a 
                      href={getSocialUrl('facebook', editForm.facebookPage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
                    >
                      {editForm.facebookPage}
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                    </a>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
                  )}
                </AnimatedCard>

                <AnimatedCard label="Instagram" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19}>
                  {editForm.instagram ? (
                    <a 
                      href={getSocialUrl('instagram', editForm.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
                    >
                      {editForm.instagram}
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                    </a>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
                  )}
                </AnimatedCard>
              </div>

              <div className="space-y-3 w-full">
                <AnimatedCard label="LinkedIn" icon={<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26}>
                  {editForm.linkedIn ? (
                    <a 
                      href={getSocialUrl('linkedin', editForm.linkedIn)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
                    >
                      {editForm.linkedIn}
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                    </a>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
                  )}
                </AnimatedCard>

                <AnimatedCard label="YouTube Channel" icon={<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33}>
                  {editForm.youtubeChannel ? (
                    <a 
                      href={getSocialUrl('youtube', editForm.youtubeChannel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
                    >
                      {editForm.youtubeChannel}
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
                    </a>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'contact': {
        const contactFields = [
          editForm.officeAddress,
          editForm.city,
          editForm.district,
          editForm.state,
          editForm.pinCode,
          editForm.website,
          editForm.whatsappNumber
        ];
        const filledCount = contactFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Contact Information"
              subtitle="Your complete contact details"
              filled={filledCount}
              total={contactFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="City" value={editForm.city} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="District" value={editForm.district} icon={<Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
                <AnimatedCard label="State" value={editForm.state} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="PIN Code" value={editForm.pinCode} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Website" value={editForm.website || 'Not provided'} icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
                <AnimatedCard label="WhatsApp Number" value={editForm.whatsappNumber || 'Not provided'} icon={<Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47} />
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ============ RENDER PROPERTIES SECTION ============
  const renderPropertiesSection = () => {
    return (
      <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-800">My Properties</h2>
              <p className="text-[9px] sm:text-[11px] text-gray-500">Manage your property listings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 sm:flex-initial min-w-[100px] sm:min-w-[120px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 sm:px-3 py-1 sm:py-1.5 pl-6 sm:pl-8 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs"
              />
              <Search className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs bg-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 sm:p-1.5 transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-[#00695C] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="Grid view"
              >
                <GridIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 sm:p-1.5 transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-[#00695C] text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="group relative bg-teal-100/30 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#00695C]/10 overflow-hidden hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="relative w-full h-40 sm:h-46 bg-gray-100 overflow-hidden">
                      <img 
                        src={property.images?.[0] || 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'} 
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image';
                        }}
                      />
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-[#00695C] text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
                          {getListingPurposeLabel(property.listingPurpose)}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 sm:p-3">
                        <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">
                          {property.price}
                        </p>
                      </div>
                      {property.images && property.images.length > 1 && (
                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5">
                          <Image className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {property.images.length}
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between gap-1 sm:gap-2">
                        <h3 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#00695C] transition-colors duration-300 line-clamp-1 flex-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                          <span className={`text-[9px] sm:text-[10px] font-bold ${
                            property.status === 'Active' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {property.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                          <ToggleSwitch 
                            isOn={property.status === 'Active'} 
                            onToggle={() => handleToggleStatus(property)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <p className="text-[9px] sm:text-xs text-gray-500 font-medium flex items-center gap-1 sm:gap-2">
                        <span className="bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">{property.id}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{property.postedDate}</span>
                      </p>

                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C] flex-shrink-0" />
                        <span className="font-medium truncate">{property.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {[
                          { icon: Building, label: property.type },
                          { icon: Layers, label: property.area },
                          { icon: Bed, label: property.bedrooms || 'N/A' }
                        ].map((item, idx) => (
                          <span 
                            key={idx}
                            className="flex items-center gap-0.5 sm:gap-1 bg-[#00695C]/5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-medium text-[#00695C] border border-[#00695C]/10"
                          >
                            <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {item.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleViewDetails(property)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <ViewIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-100">
                <table className="w-full text-[10px] sm:text-sm table-fixed">
                  <colgroup>
                    <col className="w-[38%] lg:w-[24%]" />
                    <col className="w-[18%] lg:w-[11%]" />
                    <col className="hidden lg:table-column lg:w-[11%]" />
                    <col className="w-[20%] lg:w-[14%]" />
                    <col className="hidden lg:table-column lg:w-[9%]" />
                    <col className="hidden lg:table-column lg:w-[13%]" />
                    <col className="w-[24%] lg:w-[18%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Purpose</th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                      <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
                      <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-[#00695C]/3 transition-colors duration-200 group">
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={property.images?.[0] || 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'}
                                alt={property.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'; }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[10px] sm:text-sm text-gray-800 group-hover:text-[#00695C] transition-colors truncate">
                                {property.name}
                              </p>
                              <p className="text-[9px] sm:text-xs text-gray-500 truncate">{property.id}</p>
                              <p className="text-[9px] sm:text-xs text-gray-400 truncate lg:hidden">
                                {property.type} · {property.location}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-1">
                            <ToggleSwitch
                              isOn={property.status === 'Active'}
                              onToggle={() => handleToggleStatus(property)}
                              size="sm"
                            />
                            <span className={`hidden sm:inline text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${
                              property.status === 'Active' ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {property.status}
                            </span>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4">
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold bg-[#00695C]/10 text-[#00695C] whitespace-nowrap">
                            {getListingPurposeLabel(property.listingPurpose)}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-bold text-gray-800 truncate">
                          {property.price}
                        </td>
                        <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
                          {property.area}
                        </td>
                        <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
                          {property.location}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 lg:gap-2">
                            <button
                              onClick={() => handleViewDetails(property)}
                              className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                              title="View"
                            >
                              <ViewIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span className="hidden lg:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span className="hidden lg:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property)}
                              className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                              <span className="hidden lg:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <div className="bg-gray-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Home className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm">No properties found</p>
            <p className="text-[10px] sm:text-xs text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'You haven\'t added any properties yet'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t-2 border-gray-100 flex justify-between text-[8px] sm:text-[10px] text-gray-500">
          <span>Showing {filteredProperties.length} of {properties.length} properties</span>
          <span>Total: {properties.length}</span>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-16 sm:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && pdfToView && (
        <PdfViewerModal
          file={pdfToView}
          onClose={() => {
            setShowPdfViewer(false);
            setPdfToView(null);
          }}
        />
      )}

      {/* Media Lightbox */}
      {showMediaLightbox && lightboxItems.length > 0 && (
        <MediaLightboxModal
          items={lightboxItems}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onDelete={() => {
            const item = lightboxItems[lightboxIndex];
            if (item) {
              const field = item.field;
              setDocuments(prev => ({ ...prev, [field]: null }));
              setLightboxItems([]);
              setShowMediaLightbox(false);
              showSuccessToast();
            }
          }}
          onClose={() => {
            setShowMediaLightbox(false);
            setLightboxItems([]);
            setLightboxIndex(0);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 p-5 sm:p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Are you sure you want to delete this file? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteItem(null);
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Photo Delete Confirmation */}
      {showProfilePhotoDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 p-5 sm:p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Delete Profile Photo</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Are you sure you want to delete your profile photo? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowProfilePhotoDeleteConfirm(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmProfilePhotoDelete}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl  mx-auto overflow-hidden max-h-[80vh] flex flex-col animate-scaleIn">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Edit Agent Profile
              </h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 w-full bg-gray-50">
              {/* Personal Details */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'fullName', label: 'Full Name *', emoji: '👤' },
                    { name: 'mobileNumber', label: 'Mobile Number *', emoji: '📱' },
                    { name: 'emailAddress', label: 'Email Address *', emoji: '✉️' },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', emoji: '🎂' },
                    { name: 'gender', label: 'Gender', emoji: '⚥' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      {field.name === 'dateOfBirth' ? (
                        <input
                          type="date"
                          name={field.name}
                          value={formatDateForInput(editForm.dateOfBirth)}
                          onChange={handleDateChange}
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                        />
                      ) : field.name === 'gender' ? (
                        <select
                          name={field.name}
                          value={editForm.gender}
                          onChange={handleEditChange}
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={editForm[field.name]}
                          onChange={handleEditChange}
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                        />
                      )}
                    </div>
                  ))}
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">📸</span> Profile Photo *
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => profilePhotoInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                      >
                        Upload
                      </button>
                      {documents.profilePhoto && (
                        <button
                          onClick={handleProfilePhotoDelete}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                      <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Business Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'agencyName', label: 'Agency Name *', emoji: '🏢' },
                    { name: 'reraRegistrationNumber', label: 'RERA Registration Number', emoji: '📋' },
                    { name: 'gstNumber', label: 'GST Number', emoji: '#️⃣' },
                    { name: 'yearsOfExperience', label: 'Years of Experience *', emoji: '⭐' },
                    { name: 'numberOfActiveListings', label: 'Number of Active Listings', emoji: '📊' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type={field.name === 'yearsOfExperience' || field.name === 'numberOfActiveListings' ? 'number' : 'text'}
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                      />
                    </div>
                  ))}
                  <div className="space-y-1 sm:space-y-1.5 w-full sm:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">🌍</span> Service Areas (City/Locality)
                    </label>
                    <input
                      type="text"
                      name="serviceAreas"
                      value={editForm.serviceAreas}
                      onChange={handleEditChange}
                      className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                      placeholder="e.g. Mumbai, Pune, Navi Mumbai"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full sm:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">📍</span> Office Address *
                    </label>
                    <textarea
                      name="officeAddress"
                      value={editForm.officeAddress}
                      onChange={handleEditChange}
                      rows="2"
                      className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
                      placeholder="Enter complete office address"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">🏢</span> Agency Logo
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => agencyLogoInputRef.current?.click()}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                      >
                        Upload
                      </button>
                      {documents.agencyLogo && (
                        <button
                          onClick={() => removeFile('agencyLogo')}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                      <input ref={agencyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleAgencyLogoUpload} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Identity Verification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'aadhaarNumber', label: 'Aadhaar Number *', emoji: '🆔' },
                    { name: 'panNumber', label: 'PAN Number *', emoji: '📄' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                      />
                    </div>
                  ))}
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">📎</span> Upload Aadhaar Card *
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => fileInputRefs.current['aadhaarCard']?.click()}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                      >
                        Upload
                      </button>
                      {documents.aadhaarCard && (
                        <button
                          onClick={() => handlePdfDelete('aadhaarCard')}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                      <input
                        ref={el => fileInputRefs.current['aadhaarCard'] = el}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handlePdfUpload('aadhaarCard', file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">📎</span> Upload PAN Card *
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => fileInputRefs.current['panCard']?.click()}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                      >
                        Upload
                      </button>
                      {documents.panCard && (
                        <button
                          onClick={() => handlePdfDelete('panCard')}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                      <input
                        ref={el => fileInputRefs.current['panCard'] = el}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handlePdfUpload('panCard', file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">📎</span> Upload Business Registration Certificate
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => fileInputRefs.current['businessRegistrationCertificate']?.click()}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                      >
                        Upload
                      </button>
                      {documents.businessRegistrationCertificate && (
                        <button
                          onClick={() => handlePdfDelete('businessRegistrationCertificate')}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                      <input
                        ref={el => fileInputRefs.current['businessRegistrationCertificate'] = el}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handlePdfUpload('businessRegistrationCertificate', file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base">📎</span> Upload RERA Certificate
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => fileInputRefs.current['reraCertificate']?.click()}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                      >
                        Upload
                      </button>
                      {documents.reraCertificate && (
                        <button
                          onClick={() => handlePdfDelete('reraCertificate')}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                      <input
                        ref={el => fileInputRefs.current['reraCertificate'] = el}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handlePdfUpload('reraCertificate', file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'accountHolderName', label: 'Account Holder Name', emoji: '👤' },
                    { name: 'bankName', label: 'Bank Name', emoji: '🏦' },
                    { name: 'accountNumber', label: 'Account Number', emoji: '💳' },
                    { name: 'ifscCode', label: 'IFSC Code', emoji: '🔢' },
                    { name: 'upiId', label: 'UPI ID', emoji: '📱' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Social Media & Website
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'website', label: 'Website', emoji: '🌐' },
                    { name: 'facebookPage', label: 'Facebook Page', emoji: '📘' },
                    { name: 'instagram', label: 'Instagram', emoji: '📸' },
                    { name: 'linkedIn', label: 'LinkedIn', emoji: '💼' },
                    { name: 'youtubeChannel', label: 'YouTube Channel', emoji: '▶️' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                        placeholder={field.name === 'website' ? 'www.example.com' : `${field.name}.com/yourhandle`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'officeAddress', label: 'Office Address *', emoji: '📍', textarea: true },
                    { name: 'city', label: 'City *', emoji: '🏙️' },
                    { name: 'district', label: 'District *', emoji: '🗺️' },
                    { name: 'state', label: 'State *', emoji: '🌍' },
                    { name: 'pinCode', label: 'PIN Code *', emoji: '📍' },
                    { name: 'whatsappNumber', label: 'WhatsApp Number', emoji: '📱' },
                  ].map((field) => (
                    <div key={field.name} className={`space-y-1 sm:space-y-1.5 w-full ${field.textarea ? 'sm:col-span-2' : ''}`}>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      {field.textarea ? (
                        <textarea
                          name={field.name}
                          value={editForm[field.name]}
                          onChange={handleEditChange}
                          rows="2"
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
                          placeholder="Enter complete office address"
                        />
                      ) : (
                        <input
                          type="text"
                          name={field.name}
                          value={editForm[field.name]}
                          onChange={handleEditChange}
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Login Credentials */}
              {/* <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Login Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'username', label: 'Username *', emoji: '👤' },
                    { name: 'emailAddressLogin', label: 'Email Address *', emoji: '✉️' },
                    { name: 'mobileNumberLogin', label: 'Mobile Number *', emoji: '📱' },
                    { name: 'password', label: 'Password *', emoji: '🔒', type: 'password' },
                    { name: 'confirmPassword', label: 'Confirm Password *', emoji: '🔒', type: 'password' },
                  ].map((field) => (
                    <div key={field.name} className={`space-y-1 sm:space-y-1.5 w-full ${field.name === 'confirmPassword' ? 'sm:col-span-2' : ''}`}>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
            <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button 
                onClick={() => setShowEditModal(false)} 
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isLoading}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 sm:top-24 md:top-28 right-2 sm:right-4 z-50 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-2 border-[#00695C]/30 rounded-2xl p-2 sm:p-3 flex items-center gap-3 sm:gap-4 shadow-xl animate-slideDown max-w-xs sm:max-w-md backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 sm:p-3 rounded-2xl animate-bounce-in">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <p className="text-[#00695C] font-bold text-base sm:text-lg">Success!</p>
            <p className="text-[#00695C]/80 text-[10px] sm:text-sm">Operation completed successfully!</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-[#00695C] hover:text-[#004D40] ml-auto hover:rotate-90 transition-transform duration-300 hover:scale-110">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => {
            setShowPropertyDetails(false);
            setSelectedProperty(null);
          }}
          onAddImages={handleAddPropertyImages}
          onRemoveImage={handleRemovePropertyImage}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Edit Property Modal */}
      {showEditPropertyModal && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onSave={handleSavePropertyEdit}
          onCancel={() => {
            setShowEditPropertyModal(false);
            setEditingProperty(null);
          }}
        />
      )}

      {/* Delete Property Confirmation Modal */}
      {showDeletePropertyConfirm && propertyToDelete && (
        <DeletePropertyConfirmModal
          property={propertyToDelete}
          onConfirm={confirmDeleteProperty}
          onCancel={() => {
            setShowDeletePropertyConfirm(false);
            setPropertyToDelete(null);
          }}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-full w-full relative z-10 -mt-12 sm:-mt-15">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 w-full animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00695C]/[0.04] via-[#26A69A]/[0.06] to-[#00695C]/[0.04] rounded-2xl sm:rounded-3xl" />
          <div className="absolute -top-16 -left-10 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/50 to-transparent animate-shimmer pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full p-3 sm:p-4 md:p-5">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <button
                onClick={handleNavigateBack}
                className="relative p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group border border-[#00695C]/10 overflow-hidden"
                aria-label="Go back"
              >
                <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00695C]/0 to-[#26A69A]/0 group-hover:from-[#00695C]/10 group-hover:to-[#26A69A]/10 transition-all duration-300" />
                <ArrowLeft className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#00695C] group-hover:-translate-x-0.5 transition-all duration-300" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-2 sm:gap-3 relative">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] blur-lg opacity-40 animate-pulse-slow" />
                    <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl border-2 border-[#26A69A]/30 animate-spin-slow" />
                    <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <span className="relative text-base sm:text-xl md:text-2xl lg:text-3xl">
                    Agent Profile
                    <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1.5 ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#26A69A] animate-pulse" />
                  <span className="hidden lg:inline">Manage your agent profile and property listings</span>
                  <span className="inline lg:hidden">Manage your profile</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group text-xs sm:text-sm overflow-hidden"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:left-full transition-all duration-700 ease-out" />
              <Edit2 className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative bg-[#00695C]/5 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 w-full hover:shadow-2xl transition-all duration-500 border border-[#00695C]/20 overflow-hidden group">
          <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#26A69A] to-transparent group-hover:left-full transition-all duration-[900ms] ease-out" />

          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl sm:rounded-2xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="absolute bottom-[-40px] rounded-full border border-white/50 animate-bubble"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${4 + Math.random() * 10}px`,
                  height: `${4 + Math.random() * 10}px`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(38,166,154,0.35) 60%, rgba(0,105,92,0.15) 100%)',
                  animationDuration: `${6 + Math.random() * 6}s`,
                  animationDelay: `${Math.random() * 8}s`,
                }}
              />
            ))}
          </div>

          <button
            onClick={handleDownloadInvoice}
            title="Download Invoice PDF"
            className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-md hover:shadow-lg hover:from-[#005A4F] hover:to-[#1B9E8E] hover:scale-105 transition-all duration-300"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden lg:inline">Download Invoice</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-6 w-full relative z-10">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-0.5 sm:-inset-1 rounded-[20px] sm:rounded-[24px] animate-spin-slow"
                style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }} />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-3 sm:ring-4 ring-white/60">
                {documents.profilePhoto ? (
                  <img src={URL.createObjectURL(documents.profilePhoto)} alt={editForm.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                    {editForm.fullName.charAt(0)}
                  </span>
                )}
              </div>

              {documents.profilePhoto && (
                <button onClick={handleProfilePhotoDelete}
                  className="absolute top-0 right-0 p-1 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                  aria-label="Delete profile photo" title="Delete Profile Photo">
                  <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              )}

              <button onClick={() => profilePhotoInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                aria-label="Upload profile photo" title="Upload Profile Photo">
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editForm.fullName}</h2>
                <span className="text-[10px] sm:text-xs text-[#00695C] font-medium bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200">
                  Agent ID: #AGT-{editForm.mobileNumber?.slice(-4) || '0000'}
                </span>
                <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold">
                  Verified Agent
                  <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
                  <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.agencyName}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.city}, {editForm.state}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.mobileNumber}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.35s' }}>
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.yearsOfExperience} Years Exp.
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.45s' }}>
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span>{editForm.numberOfActiveListings} Active Listings</span>
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.55s' }}>
                  <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">{editForm.serviceAreas}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-1.5 sm:p-2 mb-4 sm:mb-6 border border-[#00695C]/20 w-full overflow-x-auto">
          <div className="flex gap-1 sm:gap-1.5 min-w-max">
            {sections.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs transition-all duration-500 whitespace-nowrap relative group ${
                    isActive
                      ? 'text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-[#00695C]'
                  }`}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, #00695C, #26A69A)`
                      : 'transparent'
                  }}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg animate-pulse-slow" />
                  )}
                  <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
                    <span className="hidden lg:inline">{tab.title}</span>
                    <span className="inline lg:hidden">{tab.title.split(' ')[0]}</span>
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-ping" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-[#00695C]/20 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* Properties Section */}
        {renderPropertiesSection()}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes bubbleRise {
          0%   { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; }
          8%   { opacity: .55; }
          85%  { opacity: .35; }
          100% { transform: translateY(-380px) translateX(var(--drift, 18px)) scale(1); opacity: 0; }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes shimmerSweep { 0% { left: -60%; } 50%, 100% { left: 130%; } }
        @keyframes underlineGrow { 0% { transform: scaleX(0); } 60% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
        .animate-bubble { animation-name: bubbleRise; animation-timing-function: linear; animation-iteration-count: infinite; }
        .animate-spin-slow { animation: spinSlow 6s linear infinite; }
        .animate-shimmer { animation: shimmerSweep 3.2s ease-in-out infinite; }
        .animate-underline-grow { animation: underlineGrow 1.2s ease-out 0.6s forwards; }
        .animate-rise { opacity: 0; animation: riseIn 0.5s ease forwards; }
        .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; opacity: 0; }

        .border-3 {
          border-width: 3px;
        }
        .focus\\:ring-3 {
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        }

        @media (min-width: 480px) {
          .xs\\:inline { display: inline; }
        }
        @media (max-width: 479px) {
          .xs\\:inline { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AgentProfile;








































// import React, { useState, useRef, useEffect } from 'react';
// import {
//   User, Mail, Phone, Calendar, MapPin, Building,
//   CreditCard, Banknote, Upload, Camera, FileText,
//   CheckCircle, AlertCircle, ChevronDown, ChevronUp,
//   Save, X, Shield, Clock, Globe, MessageCircle,
//   Image, Video, Home, Briefcase, Landmark,
//   FileCheck, Users, BookOpen, Printer, Download,
//   Edit2, Trash2, Plus, Minus, Check, AlertTriangle,
//   Info, ArrowLeft, Smartphone, Eye, EyeOff, Heart,
//   Award, Star, Trophy, Target, Zap, Sparkles,
//   Layers, Grid, Layout, Palette, Circle, Square,
//   Menu, MoreHorizontal, Copy, ExternalLink, Link,
//   Bookmark, Flag, Bell, Settings, Power,
//   Zap as ZapIcon, Rocket, Crown, Diamond,
//   Search, Filter, Grid as GridIcon, List,
//   Eye as ViewIcon, Bed, Bath, Trees, Wifi, Shield as ShieldIcon,
//   Dumbbell, Waves, ParkingCircle, Sprout, Leaf, ChevronLeft, ChevronRight,
//   File, FolderOpen, FileImage, FileSpreadsheet, FileArchive, ImagePlus,
//   BriefcaseBusiness, Store, Globe2, Hash, IdCard, BadgeCheck,
//   Link as LinkIcon, Share2, UsersRound, TrendingUp, PieChart,
//   BarChart3, Activity, Building2, PenTool, Lock
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import { getMyProfile } from '../../services/profileService';

// // ============ TOGGLE SWITCH COMPONENT ============
// const ToggleSwitch = ({ isOn, onToggle, size = 'sm' }) => {
//   const sizes = {
//     sm: {
//       container: 'w-8 h-4',
//       circle: 'w-3 h-3',
//       translate: 'translate-x-4',
//     },
//     md: {
//       container: 'w-10 h-5',
//       circle: 'w-4 h-4',
//       translate: 'translate-x-5',
//     },
//     lg: {
//       container: 'w-12 h-6',
//       circle: 'w-5 h-5',
//       translate: 'translate-x-6',
//     },
//   };

//   const selectedSize = sizes[size] || sizes.sm;

//   return (
//     <button
//       type="button"
//       className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 ${
//         isOn ? 'bg-[#00695C]' : 'bg-gray-300'
//       } ${selectedSize.container}`}
//       onClick={onToggle}
//       role="switch"
//       aria-checked={isOn}
//     >
//       <span
//         className={`pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${
//           isOn ? selectedSize.translate : 'translate-x-0'
//         } ${selectedSize.circle}`}
//       />
//     </button>
//   );
// };

// // ============ PDF VIEWER MODAL ============
// const PdfViewerModal = ({ file, onClose }) => {
//   if (!file) return null;

//   const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
//   const fileName = typeof file === 'string' ? file.split('/').pop() || 'document.pdf' : file.name || 'document.pdf';

//   return (
//     <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6 lg:p-8">
//       <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
//         <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 flex items-center justify-between flex-shrink-0">
//           <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 min-w-0">
//             <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white flex-shrink-0" />
//             <h3 className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl truncate max-w-[100px] sm:max-w-[200px] md:max-w-md lg:max-w-lg">
//               {fileName}
//             </h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>
//         <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-3 md:p-4 lg:p-6">
//           <embed src={fileUrl} type="application/pdf" className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]" />
//         </div>
//         <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 flex-shrink-0">
//           <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-full">{fileName}</span>
//           <button
//             onClick={() => window.open(fileUrl, '_blank')}
//             className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 bg-[#00695C] text-white rounded-xl text-[10px] sm:text-xs md:text-sm lg:text-base font-bold hover:bg-[#005A4F] transition-all duration-300 w-full sm:w-auto justify-center"
//           >
//             <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
//             <span>Open in New Tab</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ MEDIA LIGHTBOX MODAL ============
// const MediaLightboxModal = ({ items, index, onClose, onNavigate, onDelete }) => {
//   if (!items || items.length === 0) return null;
//   const current = items[index];

//   const goPrev = () => onNavigate((index - 1 + items.length) % items.length);
//   const goNext = () => onNavigate((index + 1) % items.length);

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6" onClick={onClose}>
//       <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
//         <button
//           onClick={onClose}
//           className="absolute -top-8 sm:-top-10 right-0 text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
//         >
//           <X className="w-5 h-5 sm:w-7 sm:h-7" />
//         </button>

//         {items.length > 1 && (
//           <button
//             onClick={goPrev}
//             className="absolute left-1 sm:-left-14 md:-left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10"
//           >
//             <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
//           </button>
//         )}

//         <div className="w-full flex flex-col items-center gap-2 sm:gap-3 md:gap-4 animate-scaleIn">
//           {current.type === 'video' ? (
//             <video src={current.url} controls autoPlay className="max-w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] rounded-2xl shadow-2xl bg-black" />
//           ) : (
//             <img src={current.url} alt={current.name || 'Preview'} className="max-w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] rounded-2xl shadow-2xl object-contain bg-black/20" />
//           )}
//           <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
//             <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-[10px] sm:text-xs md:text-sm font-medium">
//               <span className="truncate max-w-[100px] sm:max-w-[200px] md:max-w-full">{current.name}</span>
//               {items.length > 1 && <span>· {index + 1} / {items.length}</span>}
//             </div>
//             {onDelete && (
//               <button
//                 onClick={onDelete}
//                 title="Delete this file"
//                 className="flex items-center gap-0.5 sm:gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] md:text-[11px] font-bold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
//               >
//                 <Trash2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
//                 Delete
//               </button>
//             )}
//           </div>
//         </div>

//         {items.length > 1 && (
//           <button
//             onClick={goNext}
//             className="absolute right-1 sm:-right-14 md:-right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10"
//           >
//             <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============ PDF FILE CARD COMPONENT ============
// const PdfFileCard = ({ file, onDelete, onView }) => {
//   const fileName = file.name || 'document.pdf';
//   const fileSize = file.size ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : 'Unknown size';
  
//   const getPdfIcon = () => {
//     const ext = fileName.split('.').pop().toLowerCase();
//     switch(ext) {
//       case 'pdf': return <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />;
//       case 'jpg':
//       case 'jpeg':
//       case 'png':
//       case 'gif':
//       case 'webp': return <FileImage className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" />;
//       case 'xls':
//       case 'xlsx':
//       case 'csv': return <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />;
//       case 'zip':
//       case 'rar':
//       case '7z': return <FileArchive className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />;
//       default: return <File className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500" />;
//     }
//   };

//   return (
//     <div className="group flex items-center gap-2 sm:gap-2.5 md:gap-3 bg-white rounded-xl p-2 sm:p-2.5 md:p-3 border border-gray-200 hover:border-[#00695C]/40 hover:shadow-md transition-all duration-300">
//       <div className="flex-shrink-0 p-1 sm:p-1.5 md:p-2 bg-gray-50 rounded-lg group-hover:bg-[#00695C]/5 transition-colors duration-300">
//         {getPdfIcon()}
//       </div>
      
//       <div className="flex-1 min-w-0">
//         <button
//           onClick={onView}
//           className="text-xs sm:text-sm font-medium text-gray-800 hover:text-[#00695C] transition-colors duration-300 truncate block w-full text-left hover:underline"
//         >
//           {fileName}
//         </button>
//         <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">{fileSize}</span>
//       </div>

//       <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
//         <button
//           onClick={onView}
//           className="p-1 sm:p-1.5 text-[#00695C] hover:bg-[#00695C]/10 rounded-lg transition-colors duration-300"
//           title="View PDF"
//         >
//           <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
//         </button>
//         <button
//           onClick={onDelete}
//           className="p-1 sm:p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
//           title="Delete file"
//         >
//           <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ============ PROPERTY DETAILS MODAL ============
// const PropertyDetailsModal = ({ property, onClose, onAddImages, onRemoveImage, onToggleStatus, onEdit, onDelete }) => {
//   if (!property) return null;

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const detailImageInputRef = useRef(null);
//   const rawImages = property.images || [];
//   const hasImages = rawImages.length > 0;
//   const images = hasImages ? rawImages : ['https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'];

//   useEffect(() => {
//     if (currentImageIndex >= images.length) {
//       setCurrentImageIndex(Math.max(0, images.length - 1));
//     }
//   }, [images.length]);

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const handleAddImagesChange = (e) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       onAddImages(property.id, files);
//     }
//     e.target.value = '';
//   };

//   const handleDeleteImage = (idx) => {
//     onRemoveImage(property.id, idx);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-2xl h-[80vh] flex flex-col animate-scaleIn">
//         <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
//           <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
//             <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg">
//               <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//             </div>
//             <h2 className="text-white text-base sm:text-lg md:text-xl font-bold truncate">
//               {property.name}
//             </h2>
//           </div>
//           <button 
//             onClick={onClose}
//             className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0"
//           >
//             <X className="w-4 h-4 sm:w-5 sm:h-5" />
//           </button>
//         </div>

//         <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
//           <div className="relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64">
//             <img 
//               src={images[currentImageIndex]} 
//               alt={property.name}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image';
//               }}
//             />
            
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300"
//                 >
//                   <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300"
//                 >
//                   <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </button>
//                 <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-black/60 text-white text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full">
//                   {currentImageIndex + 1} / {images.length}
//                 </div>
//               </>
//             )}

//             {hasImages && (
//               <button
//                 onClick={() => handleDeleteImage(currentImageIndex)}
//                 title="Delete this image"
//                 className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
//               >
//                 <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                 Delete
//               </button>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
//               {hasImages ? `${images.length} image${images.length > 1 ? 's' : ''}` : 'No images uploaded yet'}
//             </p>
//             <button
//               onClick={() => detailImageInputRef.current?.click()}
//               className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
//             >
//               <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//               Add Image
//             </button>
//             <input
//               ref={detailImageInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleAddImagesChange}
//             />
//           </div>

//           {images.length > 1 && (
//             <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-1.5">
//               {images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setCurrentImageIndex(idx)}
//                   className={`flex-shrink-0 w-12 sm:w-14 md:w-16 h-9 sm:h-10 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
//                     currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'
//                   }`}
//                 >
//                   <img 
//                     src={img} 
//                     alt={`Thumbnail ${idx + 1}`}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image';
//                     }}
//                   />
//                 </button>
//               ))}
//             </div>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
//             <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//               <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                 <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Property ID</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.id}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//               <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                 <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.price}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//               <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                 <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bedrooms</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.bedrooms || 'N/A'}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//               <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                 <Bath className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bathrooms</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.bathrooms || 'N/A'}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//               <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                 <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate">{property.location}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//               <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                 <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//               </div>
//               <div>
//                 <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Posted</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.postedDate}</p>
//               </div>
//             </div>
//           </div>

//           {property.description && (
//             <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
//               <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-0.5 sm:mb-1">Description</h3>
//               <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{property.description}</p>
//             </div>
//           )}

//           {property.features && property.features.length > 0 && (
//             <div>
//               <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Features</h3>
//               <div className="flex flex-wrap gap-1 sm:gap-1.5">
//                 {property.features.map((feature, index) => (
//                   <span key={index} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#00695C]/10 text-[#00695C] rounded-lg text-[9px] sm:text-[10px] font-bold">
//                     {feature}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {property.selectedAmenities && property.selectedAmenities.length > 0 && (
//             <div>
//               <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Amenities</h3>
//               <div className="flex flex-wrap gap-1 sm:gap-1.5">
//                 {property.selectedAmenities.map((amenity, index) => (
//                   <span key={index} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] sm:text-[10px] font-bold">
//                     {amenity}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-wrap gap-2 sm:gap-2.5 flex-shrink-0">
//           <button 
//             onClick={() => {
//               onClose();
//               onEdit(property);
//             }}
//             className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
//           >
//             <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
//             Edit Property
//           </button>
//           <button 
//             onClick={() => {
//               onClose();
//               onDelete(property);
//             }}
//             className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
//           >
//             <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ DELETE PROPERTY CONFIRM MODAL ============
// const DeletePropertyConfirmModal = ({ property, onConfirm, onCancel }) => {
//   if (!property) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4 md:p-6">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn p-4 sm:p-6 md:p-8">
//         <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
//           <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
//             <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
//           </div>
//           <h3 className="text-lg sm:text-xl font-bold text-gray-800">Delete Property</h3>
//         </div>
//         <p className="text-sm sm:text-base text-gray-600 mb-2">
//           Are you sure you want to delete <span className="font-bold text-[#00695C]">{property.name}</span>?
//         </p>
//         <p className="text-xs sm:text-sm text-red-500 mb-4 sm:mb-6">This action cannot be undone.</p>
//         <div className="flex justify-end gap-2 sm:gap-3">
//           <button
//             onClick={onCancel}
//             className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ EDIT PROPERTY MODAL ============
// const EditPropertyModal = ({ property, onSave, onCancel }) => {
//   if (!property) return null;

//   const editSteps = ['Property Details', 'Pricing & Amenities', 'Media Upload'];

//   const [localStep, setLocalStep] = useState(0);
//   const [localProperty, setLocalProperty] = useState({ ...property });
//   const [localCustomAmenities, setLocalCustomAmenities] = useState([]);
//   const [localImagePreviews, setLocalImagePreviews] = useState([]);
//   const [localCoverPreview, setLocalCoverPreview] = useState(null);
//   const [localVideoPreview, setLocalVideoPreview] = useState(null);
//   const [localCoverImage, setLocalCoverImage] = useState(null);
//   const [localVideoFile, setLocalVideoFile] = useState(null);
//   const [newImageFiles, setNewImageFiles] = useState([]);

//   const availableAmenities = [
//     "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance",
//     "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center",
//     "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
//     "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
//   ];

//   useEffect(() => {
//     setLocalProperty({ ...property });
//     if (property.selectedAmenities) {
//       const custom = property.selectedAmenities.filter(a => !availableAmenities.includes(a));
//       setLocalCustomAmenities(custom);
//     }
//     if (property.images && property.images.length > 0) {
//       setLocalImagePreviews(property.images.map(img => img));
//     }
//     if (property.coverImage) {
//       setLocalCoverPreview(property.coverImage);
//     }
//     if (property.propertyVideo) {
//       setLocalVideoPreview(property.propertyVideo);
//     }
//   }, [property]);

//   const handleLocalChange = (field, value) => {
//     setLocalProperty(prev => ({ ...prev, [field]: value }));
//   };

//   const handleLocalAmenityToggle = (amenity) => {
//     const current = localProperty.selectedAmenities || [];
//     if (current.includes(amenity)) {
//       setLocalProperty(prev => ({
//         ...prev,
//         selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
//       }));
//     } else {
//       setLocalProperty(prev => ({
//         ...prev,
//         selectedAmenities: [...(prev.selectedAmenities || []), amenity]
//       }));
//     }
//   };

//   const handleLocalAddCustomAmenity = () => {
//     if (localProperty.otherAmenities) {
//       const newAmenity = localProperty.otherAmenities.trim();
//       if (newAmenity && !localProperty.selectedAmenities.includes(newAmenity) && !localCustomAmenities.includes(newAmenity)) {
//         setLocalCustomAmenities(prev => [...prev, newAmenity]);
//         setLocalProperty(prev => ({
//           ...prev,
//           selectedAmenities: [...(prev.selectedAmenities || []), newAmenity],
//           otherAmenities: ''
//         }));
//       }
//     }
//   };

//   const handleLocalRemoveCustomAmenity = (amenity) => {
//     setLocalCustomAmenities(prev => prev.filter(a => a !== amenity));
//     setLocalProperty(prev => ({
//       ...prev,
//       selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
//     }));
//   };

//   const handleLocalImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const remainingSlots = Math.max(0, 3 - localImagePreviews.length);
//     if (files.length > remainingSlots) {
//       alert(`You can only upload ${remainingSlots} more image(s). Maximum 3 images allowed.`);
//     }
//     const limitedFiles = files.slice(0, remainingSlots);
//     const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
//     setLocalImagePreviews([...localImagePreviews, ...newPreviews]);
//     setNewImageFiles([...newImageFiles, ...limitedFiles]);
//   };

//   const removeLocalImage = (index) => {
//     const newPreviews = localImagePreviews.filter((_, i) => i !== index);
//     setLocalImagePreviews(newPreviews);
//     const newFiles = newImageFiles.filter((_, i) => i !== index);
//     setNewImageFiles(newFiles);
//   };

//   const handleLocalCoverImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         alert('Cover image must be less than 2MB');
//         return;
//       }
//       setLocalCoverPreview(URL.createObjectURL(file));
//       setLocalCoverImage(file);
//     }
//   };

//   const removeLocalCoverImage = () => {
//     if (localCoverPreview) URL.revokeObjectURL(localCoverPreview);
//     setLocalCoverPreview(null);
//     setLocalCoverImage(null);
//   };

//   const handleLocalVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         alert('Video must be less than 10MB');
//         return;
//       }
//       setLocalVideoPreview(URL.createObjectURL(file));
//       setLocalVideoFile(file);
//     }
//   };

//   const removeLocalVideo = () => {
//     if (localVideoPreview) URL.revokeObjectURL(localVideoPreview);
//     setLocalVideoPreview(null);
//     setLocalVideoFile(null);
//   };

//   const handleLocalNext = () => {
//     setLocalStep(prev => prev + 1);
//   };

//   const handleLocalBack = () => {
//     setLocalStep(prev => prev - 1);
//   };

//   const handleLocalSave = () => {
//     const updatedProperty = {
//       ...localProperty,
//     };
    
//     let finalImages = [...localImagePreviews];
    
//     if (newImageFiles.length > 0) {
//       const newUrls = newImageFiles.map(f => URL.createObjectURL(f));
//       finalImages = [...finalImages, ...newUrls];
//     }
    
//     if (localCoverImage) {
//       const coverUrl = URL.createObjectURL(localCoverImage);
//       finalImages = [coverUrl, ...finalImages.filter((_, i) => i !== 0)];
//       updatedProperty.coverImage = localCoverImage;
//     }
    
//     updatedProperty.images = finalImages;
    
//     if (localVideoFile) {
//       updatedProperty.propertyVideo = localVideoFile;
//     }
    
//     onSave(updatedProperty);
//   };

//   const renderStepContent = () => {
//     if (localStep === 0) {
//       return (
//         <div className="space-y-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title / Name</label>
//               <input
//                 type="text"
//                 value={localProperty.name || ''}
//                 onChange={(e) => handleLocalChange('name', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="e.g. Green Valley 3BHK Apartment"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Property ID</label>
//               <input
//                 type="text"
//                 value={localProperty.id}
//                 disabled
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
//             <div className="space-y-1.5">
//               {['Independent House', 'Independent Villa', 'Duplex Residential Unit', 'Apartment', 'Commercial', 'Land'].map(type => (
//                 <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input
//                     type="radio"
//                     name="propertyType"
//                     className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                     checked={localProperty.type === type}
//                     onChange={() => handleLocalChange('type', type)}
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
//             <textarea
//               value={localProperty.location || ''}
//               onChange={(e) => handleLocalChange('location', e.target.value)}
//               rows="2"
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
//               placeholder="Enter complete property address"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">City</label>
//             <input
//               type="text"
//               value={localProperty.propertyCity || ''}
//               onChange={(e) => handleLocalChange('propertyCity', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               placeholder="Enter city name"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Details</label>
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="number"
//                 value={localProperty.builtUpArea || ''}
//                 onChange={(e) => handleLocalChange('builtUpArea', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="Build-up Area (sq ft)"
//               />
//               <input
//                 type="number"
//                 value={localProperty.carpetArea || ''}
//                 onChange={(e) => handleLocalChange('carpetArea', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="Carpet Area (sq ft)"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
//               <input
//                 type="number"
//                 value={localProperty.bedrooms || ''}
//                 onChange={(e) => handleLocalChange('bedrooms', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="Number of bedrooms"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
//               <input
//                 type="number"
//                 value={localProperty.bathrooms || ''}
//                 onChange={(e) => handleLocalChange('bathrooms', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="Number of bathrooms"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
//             <div className="space-y-1.5">
//               {['Full Furnish', 'Semi Furnish', 'Unfurnished'].map(f => (
//                 <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input
//                     type="radio"
//                     name="furnishing"
//                     className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                     checked={localProperty.furnishing === f}
//                     onChange={() => handleLocalChange('furnishing', f)}
//                   />
//                   {f}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking Facility</label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="parking"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.parking === 'yes' || localProperty.parking === 'Yes'}
//                   onChange={() => handleLocalChange('parking', 'yes')}
//                 />
//                 Yes, available
//               </label>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="parking"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.parking === 'no' || localProperty.parking === 'No'}
//                   onChange={() => handleLocalChange('parking', 'no')}
//                 />
//                 No parking
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
//             <select
//               value={localProperty.status || 'Active'}
//               onChange={(e) => handleLocalChange('status', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
//             <textarea
//               value={localProperty.description || ''}
//               onChange={(e) => handleLocalChange('description', e.target.value)}
//               rows="3"
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
//               placeholder="Enter property description..."
//             />
//           </div>
//         </div>
//       );
//     } else if (localStep === 1) {
//       return (
//         <div className="space-y-3">
//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
//             <div className="flex gap-4 flex-wrap">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="listingPurpose"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.listingPurpose === 'sale' || localProperty.listingPurpose === 'For Sale'}
//                   onChange={() => handleLocalChange('listingPurpose', 'sale')}
//                 />
//                 For Sale
//               </label>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="listingPurpose"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.listingPurpose === 'rent' || localProperty.listingPurpose === 'For Rent'}
//                   onChange={() => handleLocalChange('listingPurpose', 'rent')}
//                 />
//                 For Rent
//               </label>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="listingPurpose"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.listingPurpose === 'lease' || localProperty.listingPurpose === 'For Lease'}
//                   onChange={() => handleLocalChange('listingPurpose', 'lease')}
//                 />
//                 For Lease
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">
//               {localProperty.listingPurpose === 'sale' || localProperty.listingPurpose === 'For Sale'
//                 ? 'Expected Price (₹)'
//                 : localProperty.listingPurpose === 'lease' || localProperty.listingPurpose === 'For Lease'
//                 ? 'Expected Lease Amount (₹/month)'
//                 : 'Expected Rent (₹/month)'}
//             </label>
//             <input
//               type="text"
//               value={localProperty.expectedPrice || localProperty.price?.replace(/[^0-9]/g, '') || ''}
//               onChange={(e) => handleLocalChange('expectedPrice', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               placeholder="e.g. 15,000"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">
//               {localProperty.listingPurpose === 'sale' || localProperty.listingPurpose === 'For Sale'
//                 ? 'Budget Range (₹)'
//                 : 'Budget Range (₹/month)'}
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 value={localProperty.budgetRange?.min || ''}
//                 onChange={(e) => handleLocalChange('budgetRange', { ...localProperty.budgetRange, min: e.target.value })}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 value={localProperty.budgetRange?.max || ''}
//                 onChange={(e) => handleLocalChange('budgetRange', { ...localProperty.budgetRange, max: e.target.value })}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Type</label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="priceType"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.priceType === 'fixed'}
//                   onChange={() => handleLocalChange('priceType', 'fixed')}
//                 />
//                 Fixed Price
//               </label>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="radio"
//                   name="priceType"
//                   className="accent-[#00695C] w-4 h-4 cursor-pointer"
//                   checked={localProperty.priceType === 'negotiable'}
//                   onChange={() => handleLocalChange('priceType', 'negotiable')}
//                 />
//                 Negotiable
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance Charges (₹/month)</label>
//             <input
//               type="text"
//               value={localProperty.maintenance || ''}
//               onChange={(e) => handleLocalChange('maintenance', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               placeholder="Enter monthly maintenance"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
//             <input
//               type="date"
//               value={localProperty.availableFrom || ''}
//               onChange={(e) => handleLocalChange('availableFrom', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Select Amenities</label>
//             <div className="flex flex-wrap gap-1.5">
//               {availableAmenities.map(a => (
//                 <span
//                   key={a}
//                   onClick={() => handleLocalAmenityToggle(a)}
//                   className={`px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${
//                     localProperty.selectedAmenities?.includes(a)
//                       ? 'bg-[#00695C] text-white border-[#00695C]'
//                       : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'
//                   }`}
//                 >
//                   {a}
//                 </span>
//               ))}
//               {localCustomAmenities.map(a => (
//                 <span key={a} className="px-2.5 py-1 text-xs bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
//                   {a}
//                   <X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={() => handleLocalRemoveCustomAmenity(a)} />
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Other Amenities</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={localProperty.otherAmenities || ''}
//                 onChange={(e) => handleLocalChange('otherAmenities', e.target.value)}
//                 className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="e.g. Clubhouse, CCTV, Solar Panel..."
//                 onKeyPress={(e) => e.key === 'Enter' && handleLocalAddCustomAmenity()}
//               />
//               <button
//                 onClick={handleLocalAddCustomAmenity}
//                 className="px-4 py-2 text-sm bg-[#00695C] text-white rounded-xl hover:bg-[#005A4F] transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
//             <input
//               type="text"
//               value={localProperty.features?.join(', ') || ''}
//               onChange={(e) => {
//                 const features = e.target.value.split(',').map(f => f.trim());
//                 handleLocalChange('features', features);
//               }}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               placeholder="2 BHK, Sea View, Parking, etc."
//             />
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-50">
//             <div className="w-1 h-4 bg-[#00695C] rounded" />
//             <h3 className="text-sm font-bold text-[#00695C]">Media Upload</h3>
//           </div>
//           <p className="text-xs text-gray-400 mb-3">📸 Upload property images and media</p>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Cover Image</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept="image/*" className="hidden" id="edit-cover" onChange={handleLocalCoverImageUpload} />
//               <label htmlFor="edit-cover" className="cursor-pointer flex flex-col items-center">
//                 <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Cover Image</span>
//                 <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
//               </label>
//             </div>
//             {localCoverPreview && (
//               <div className="mt-2 relative">
//                 <img src={localCoverPreview} alt="Cover" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
//                 <button onClick={removeLocalCoverImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Photos (Max 3)</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept="image/*" multiple className="hidden" id="edit-photos" onChange={handleLocalImageUpload} disabled={localImagePreviews.length >= 3} />
//               <label htmlFor="edit-photos" className={`cursor-pointer flex flex-col items-center ${localImagePreviews.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                 <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Property Photos</span>
//                 <span className="text-xs text-gray-400 mt-1">Max 3 photos</span>
//               </label>
//             </div>
//             {localImagePreviews.length > 0 && (
//               <div className="mt-3 grid grid-cols-3 gap-2">
//                 {localImagePreviews.map((preview, idx) => (
//                   <div key={idx} className="relative">
//                     <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
//                     <button onClick={() => removeLocalImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <p className="text-xs text-gray-400 mt-2">{localImagePreviews.length}/3 images uploaded</p>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Video (Optional)</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept="video/mp4,video/mov" className="hidden" id="edit-video" onChange={handleLocalVideoUpload} />
//               <label htmlFor="edit-video" className="cursor-pointer flex flex-col items-center">
//                 <Video className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Property Video Tour</span>
//                 <span className="text-xs text-gray-400 mt-1">MP4/MOV (Max 10MB)</span>
//               </label>
//             </div>
//             {localVideoPreview && (
//               <div className="mt-2 relative">
//                 <video src={localVideoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200" />
//                 <button onClick={removeLocalVideo} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">✕</button>
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-3xl max-h-[80vh] flex flex-col animate-scaleIn">
//         <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between rounded-t-3xl flex-shrink-0">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//             <h2 className="text-white text-lg sm:text-xl font-bold">Edit Property</h2>
//           </div>
//           <button 
//             onClick={onCancel}
//             className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <div className="flex border-b border-gray-100 flex-shrink-0 px-3 sm:px-4 pt-2 overflow-x-auto">
//           {editSteps.map((stepName, idx) => (
//             <button
//               key={idx}
//               onClick={() => setLocalStep(idx)}
//               className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
//                 localStep === idx
//                   ? 'border-[#00695C] text-[#00695C]'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {stepName}
//             </button>
//           ))}
//         </div>

//         <div className="p-4 sm:p-6 overflow-y-auto flex-1">
//           {renderStepContent()}
//         </div>

//         <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
//           <div className="flex gap-2">
//             {localStep > 0 && (
//               <button
//                 onClick={handleLocalBack}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#00695C] bg-teal-50 rounded-xl hover:bg-teal-100 transition-all"
//               >
//                 ← Back
//               </button>
//             )}
//           </div>
//           <div className="flex gap-2 sm:gap-3">
//             <button
//               onClick={onCancel}
//               className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300"
//             >
//               Cancel
//             </button>
//             {localStep < editSteps.length - 1 ? (
//               <button
//                 onClick={handleLocalNext}
//                 className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2"
//               >
//                 Next →
//               </button>
//             ) : (
//               <button
//                 onClick={handleLocalSave}
//                 className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2"
//               >
//                 <Save className="w-3 h-3 sm:w-4 sm:h-4" />
//                 Save Changes
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ AGENT PROFILE COMPONENT ============
// const AgentProfile = () => {
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState('personal');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteItem, setDeleteItem] = useState(null);
//   const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPdfViewer, setShowPdfViewer] = useState(false);
//   const [pdfToView, setPdfToView] = useState(null);
//   const [showMediaLightbox, setShowMediaLightbox] = useState(false);
//   const [lightboxItems, setLightboxItems] = useState([]);
//   const [lightboxIndex, setLightboxIndex] = useState(0);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [showPropertyDetails, setShowPropertyDetails] = useState(false);
//   const [viewMode, setViewMode] = useState('grid');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
//   const [editingProperty, setEditingProperty] = useState(null);
//   const [showDeletePropertyConfirm, setShowDeletePropertyConfirm] = useState(false);
//   const [propertyToDelete, setPropertyToDelete] = useState(null);
  
//   const profilePhotoInputRef = useRef(null);
//   const agencyLogoInputRef = useRef(null);
//   const fileInputRefs = useRef({});

//   // ============ PROPERTIES STATE ============
//   const [properties, setProperties] = useState([
//     {
//       id: 'PROP-001',
//       name: 'Sunset Villa',
//       type: 'Villa',
//       status: 'Active',
//       price: '₹1,20,00,000',
//       area: '2500 sq ft',
//       location: 'Pune, Maharashtra',
//       postedDate: '15-06-2025',
//       description: 'Luxury villa with garden, pool, and premium interiors.',
//       images: [
//         '/villa1_1.png',
//         '/villa1_2.png',
//         '/villa1_3.png',
//         '/villa1_4.png'
//       ],
//       features: ['4 BHK', 'Swimming Pool', 'Garden', 'Smart Home', 'Premium Interiors'],
//       views: 245,
//       inquiries: 12,
//       bedrooms: '4 BHK',
//       bathrooms: '4',
//       furnishing: 'Fully Furnished',
//       parking: '3+ Cars',
//       propertyCategory: 'residential',
//       listedBy: 'agent',
//       listingPurpose: 'sale',
//       expectedPrice: '12000000',
//       maintenance: '5000',
//       availableFrom: '2025-07-01',
//       selectedAmenities: ['Gated Community', '24/7 Security', 'Swimming Pool', 'Garden', 'Smart Home'],
//       propertyAddress: '45, Sunset Villa, Pune, Maharashtra',
//       propertyCity: 'Pune',
//       builtUpArea: '2500',
//       carpetArea: '2200',
//       propertyTitle: 'Sunset Villa',
//       propertyType: 'Villa'
//     },
//     {
//       id: 'PROP-002',
//       name: 'Green Valley Apartment',
//       type: 'Apartment',
//       status: 'Active',
//       price: '₹45,00,000',
//       area: '1200 sq ft',
//       location: 'Mumbai, Maharashtra',
//       postedDate: '20-05-2025',
//       description: 'Beautiful 2 BHK apartment with modern amenities and sea view.',
//       images: ['https://via.placeholder.com/400x300/00695C/ffffff?text=Green+Valley'],
//       features: ['2 BHK', 'Sea View', 'Modern Kitchen', 'Parking'],
//       views: 189,
//       inquiries: 8,
//       bedrooms: '2 BHK',
//       bathrooms: '2',
//       furnishing: 'Fully Furnished',
//       parking: '2 Cars',
//       propertyCategory: 'residential',
//       listedBy: 'agent',
//       listingPurpose: 'sale',
//       expectedPrice: '4500000',
//       maintenance: '2000',
//       availableFrom: '2025-08-15',
//       selectedAmenities: ['Gated Community', '24/7 Security', 'Parking'],
//       propertyAddress: '123, Green Valley Apartments, Near City Center, Mumbai',
//       propertyCity: 'Mumbai',
//       builtUpArea: '1200',
//       carpetArea: '1000',
//       propertyTitle: 'Green Valley Apartment',
//       propertyType: 'Apartment'
//     },
//     {
//       id: 'PROP-003',
//       name: 'City Center Office',
//       type: 'Commercial',
//       status: 'Inactive',
//       price: '₹2,00,000/month',
//       area: '800 sq ft',
//       location: 'Bangalore, Karnataka',
//       postedDate: '10-04-2025',
//       description: 'Prime location office space in the city center.',
//       images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=City+Office'],
//       features: ['Prime Location', 'Fully Furnished', '24/7 Security'],
//       views: 134,
//       inquiries: 5,
//       bedrooms: '0',
//       bathrooms: '2',
//       furnishing: 'Fully Furnished',
//       parking: '2 Cars',
//       propertyCategory: 'commercial',
//       listedBy: 'agent',
//       listingPurpose: 'rent',
//       expectedPrice: '200000',
//       maintenance: '10000',
//       availableFrom: '2025-05-01',
//       selectedAmenities: ['24/7 Security', 'Power Backup', 'CCTV Surveillance'],
//       propertyAddress: 'City Center, MG Road, Bangalore',
//       propertyCity: 'Bangalore',
//       builtUpArea: '800',
//       carpetArea: '700',
//       propertyTitle: 'City Center Office',
//       propertyType: 'Commercial'
//     },
//     {
//       id: 'PROP-004',
//       name: 'Lake View Paradise',
//       type: 'Apartment',
//       status: 'Active',
//       price: '₹75,00,000',
//       area: '1800 sq ft',
//       location: 'Hyderabad, Telangana',
//       postedDate: '01-07-2025',
//       description: 'Stunning lake view apartment with premium amenities.',
//       images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Lake+View'],
//       features: ['3 BHK', 'Lake View', 'Gym', 'Swimming Pool'],
//       views: 312,
//       inquiries: 18,
//       bedrooms: '3 BHK',
//       bathrooms: '3',
//       furnishing: 'Semi Furnished',
//       parking: '2 Cars',
//       propertyCategory: 'residential',
//       listedBy: 'agent',
//       listingPurpose: 'sale',
//       expectedPrice: '7500000',
//       maintenance: '3000',
//       availableFrom: '2025-07-15',
//       selectedAmenities: ['Swimming Pool', 'Gym / Fitness Center', 'Gated Community', 'Balcony / Terrace', 'Lake View'],
//       propertyAddress: 'Lake View Paradise, Hyderabad',
//       propertyCity: 'Hyderabad',
//       builtUpArea: '1800',
//       carpetArea: '1500',
//       propertyTitle: 'Lake View Paradise',
//       propertyType: 'Apartment'
//     },
//     {
//       id: 'PROP-005',
//       name: 'Downtown Studio',
//       type: 'Apartment',
//       status: 'Active',
//       price: '₹30,00,000',
//       area: '650 sq ft',
//       location: 'Delhi, NCR',
//       postedDate: '10-07-2025',
//       description: 'Compact studio apartment in the heart of the city.',
//       images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Downtown+Studio'],
//       features: ['1 BHK', 'City View', 'Fully Furnished'],
//       views: 98,
//       inquiries: 4,
//       bedrooms: 'Studio',
//       bathrooms: '1',
//       furnishing: 'Fully Furnished',
//       parking: '1 Car',
//       propertyCategory: 'residential',
//       listedBy: 'agent',
//       listingPurpose: 'rent',
//       expectedPrice: '30000',
//       maintenance: '1500',
//       availableFrom: '2025-08-01',
//       selectedAmenities: ['24/7 Security', 'Wi-Fi Ready', 'City View'],
//       propertyAddress: 'Downtown, Delhi NCR',
//       propertyCity: 'Delhi',
//       builtUpArea: '650',
//       carpetArea: '550',
//       propertyTitle: 'Downtown Studio',
//       propertyType: 'Apartment'
//     },
//   ]);

//   // ============ FORM STATE ============
//   const [editForm, setEditForm] = useState({
//     // Personal Details
//     fullName: 'Amit Sharma',
//     mobileNumber: '+91 98765 43210',
//     emailAddress: 'amit.sharma@realestate.com',
//     dateOfBirth: '15-03-1990',
//     gender: 'Male',

//     // Business Information
//     agencyName: 'Sharma Realty & Associates',
//     reraRegistrationNumber: 'RERA/2025/MH/12345',
//     gstNumber: '22ABCDE1234F1Z5',
//     yearsOfExperience: '8',
//     numberOfActiveListings: '45',
//     serviceAreas: 'Mumbai, Pune, Navi Mumbai, Thane',
//     officeAddress: 'Office No. 201, Crystal Tower, Andheri East, Mumbai - 400093',

//     // Identity Verification
//     aadhaarNumber: '1234 5678 9012',
//     panNumber: 'ABCDE1234F',

//     // Contact Information
//     city: 'Mumbai',
//     district: 'Mumbai City',
//     state: 'Maharashtra',
//     pinCode: '400093',
//     website: 'www.sharmarealty.com',
//     whatsappNumber: '+91 98765 43211',

//     // Bank Details
//     accountHolderName: 'Amit Sharma',
//     bankName: 'State Bank of India',
//     accountNumber: '123456789012',
//     ifscCode: 'SBIN0001234',
//     upiId: 'amit.sharma@upi',

//     // Social Media
//     facebookPage: 'facebook.com/sharmarealty',
//     instagram: 'instagram.com/sharmarealty',
//     linkedIn: 'linkedin.com/in/amitsharma',
//     youtubeChannel: 'youtube.com/sharmarealty',

//   });

//   // ============ DOCUMENTS STATE ============
//   const [documents, setDocuments] = useState({
//     profilePhoto: null,
//     agencyLogo: null,
//     aadhaarCard: null,
//     panCard: null,
//     reraCertificate: null,
//     gstCertificate: null,
//     businessRegistrationCertificate: null,
//   });


// useEffect(()=>{
//   fetchAgentProfileData();
// },[]);


// // ============ FETCH AGENT PROFILE DATA ============
// const fetchAgentProfileData = async () => {
//   try {
//     // Call the API endpoint for agent profile
//     const response = await getMyProfile("agent");
//     console.log("Full response: ", response);
    
//     // ============ 1. EXTRACT DATA FROM RESPONSE ============
//     // Response structure: { data: { agentData: {...}, properties: [...], documents: [...] } }
//     const agentData = response?.data?.agentData || {};
//     const propertiesData = response?.data?.properties || [];
//     const documentsData = response?.data?.documents || [];
//     const profileFiles = response?.data?.profileFiles || [];
    
//     // ============ 2. SET EDIT FORM (Agent Profile Data) ============
//     setEditForm({
//       // ===== Personal Details =====
//       fullName: agentData.fullName || agentData.agentName || agentData.name || '',
//       mobileNumber: agentData.mobileNumber || agentData.mobile || agentData.phone || '',
//       emailAddress: agentData.emailAddress || agentData.emailId || agentData.email || '',
//       dateOfBirth: agentData.dateOfBirth || '',
//       gender: agentData.gender || '',
      
//       // ===== Business Information =====
//       agencyName: agentData.agencyName || agentData.companyName || '',
//       reraRegistrationNumber: agentData.reraRegistrationNumber || agentData.reraNumber || '',
//       gstNumber: agentData.gstNumber || '',
//       yearsOfExperience: agentData.yearsOfExperience || agentData.experience || '',
//       numberOfActiveListings: agentData.numberOfActiveListings || agentData.activeListings || '0',
//       serviceAreas: agentData.serviceAreas || agentData.serviceArea || '',
//       officeAddress: agentData.officeAddress || agentData.address || '',
      
//       // ===== Identity Verification =====
//       aadhaarNumber: agentData.aadhaarNumber || '',
//       panNumber: agentData.panNumber || '',
      
//       // ===== Contact Information =====
//       city: agentData.city || '',
//       district: agentData.district || '',
//       state: agentData.state || '',
//       pinCode: agentData.pinCode || agentData.pincode || '',
//       website: agentData.website || '',
//       whatsappNumber: agentData.whatsappNumber || agentData.whatsapp || '',
      
//       // ===== Bank Details =====
//       accountHolderName: agentData.accountHolderName || '',
//       bankName: agentData.bankName || '',
//       accountNumber: agentData.accountNumber || '',
//       ifscCode: agentData.ifscCode || '',
//       upiId: agentData.upiId || '',
      
//       // ===== Social Media =====
//       facebookPage: agentData.facebookPage || agentData.facebook || '',
//       instagram: agentData.instagram || '',
//       linkedIn: agentData.linkedIn || agentData.linkedin || '',
//       youtubeChannel: agentData.youtubeChannel || agentData.youtube || '',
//     });
    
//     // ============ 3. SET PROPERTIES ============
//     const formattedProperties = propertiesData.map((item) => {
//       // Handle both direct property and nested propertyData
//       const prop = item.propertyData || item;
//       const images = prop.images || [];
      
//       return {
//         id: prop.id || `PROP-${Math.random().toString(36).substr(2, 9)}`,
//         name: prop.propertyTitle || prop.name || 'Property Name',
//         type: prop.propertyType || 'Apartment',
//         status: prop.status || 'Active',
//         price: prop.expectedPrice ? `₹${Number(prop.expectedPrice).toLocaleString()}` : '₹0',
//         area: prop.builtUpArea ? `${prop.builtUpArea} sq ft` : 'N/A',
//         location: `${prop.city || ''}, ${prop.state || ''}`.trim() || 'Location not specified',
//         postedDate: prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('en-IN') : 'N/A',
//         description: prop.description || '',
//         images: images.map(img => img.fileUrl || img).filter(Boolean),
//         features: prop.features || prop.amenities || [],
//         views: prop.viewCount || 0,
//         inquiries: prop.inquiryCount || 0,
//         bedrooms: prop.bedrooms || 'N/A',
//         bathrooms: prop.bathrooms || 'N/A',
//         furnishing: prop.furnishingStatus || 'Unfurnished',
//         parking: prop.parking || 'N/A',
//         propertyCategory: prop.propertyCategory || 'residential',
//         listedBy: prop.postedAs?.toLowerCase() || 'agent',
//         listingPurpose: prop.listingPurpose || 'For Sale',
//         expectedPrice: prop.expectedPrice || '',
//         maintenance: prop.maintenance || '',
//         availableFrom: prop.availableFrom || '',
//         selectedAmenities: prop.amenities || [],
//         propertyAddress: prop.propertyAddress || prop.address || '',
//         propertyCity: prop.city || '',
//         builtUpArea: prop.builtUpArea || '',
//         carpetArea: prop.carpetArea || '',
//         propertyTitle: prop.propertyTitle || '',
//         propertyType: prop.propertyType || 'Apartment',
//         propertyAge: prop.propertyAge || '',
//         propertyCondition: prop.propertyCondition || '',
//         ownershipType: prop.ownershipType || '',
//         facingDirection: prop.facingDirection || '',
//         floorNumber: prop.floorNumber || '',
//         totalFloors: prop.totalFloors || '',
//         hasGarden: prop.hasGarden || prop.gardenSpace || '',
//         hasTerrace: prop.hasTerrace || prop.terrace || '',
//         hasBalcony: prop.hasBalcony || prop.balcony || '',
//         petFriendly: prop.petFriendly || '',
//         parkingSpaces: prop.parkingSpaces || prop.parkingCapacity || '',
//         securityDeposit: prop.securityDeposit || '',
//         priceNegotiable: prop.isNegotiable || prop.priceNegotiable || '',
//       };
//     });
    
//     setProperties(formattedProperties);
    
//     // ============ 4. SET DOCUMENTS (Agent Profile Files) ============
//     const documentMap = {
//       // Profile Documents
//       aadhaarCard: ['aadhaar', 'aadhar'],
//       panCard: ['pan'],
//       passportPhoto: ['passport', 'passport_photo'],
//       profilePhoto: ['profile', 'profile_photo', 'profilephoto'],
      
//       // Business Documents
//       agencyLogo: ['agency', 'agency_logo', 'agencylogo'],
//       reraCertificate: ['rera', 'rera_certificate'],
//       gstCertificate: ['gst', 'gst_certificate'],
//       businessRegistrationCertificate: ['business_registration', 'businessregistration', 'registration'],
      
//       // Property Documents
//       coverImage: ['cover', 'cover_image'],
//       floorPlan: ['floor', 'floor_plan'],
//       saleDeed: ['sale', 'sale_deed'],
//       pattaChitta: ['patta', 'patta_chitta'],
//       encumbranceCertificate: ['encumbrance', 'encumbrance_certificate'],
//       propertyTaxReceipt: ['tax', 'property_tax', 'property_tax_receipt'],
//       buildingApprovalPlan: ['building', 'building_approval', 'building_approval_plan'],
//       completionCertificate: ['completion', 'completion_certificate'],
//       occupancyCertificate: ['occupancy', 'occupancy_certificate'],
//       rentalAgreement: ['rental', 'rental_agreement'],
//     };

//     // Initialize documents object with all possible fields
//     const newDocuments = {
//       // Profile Images
//       profilePhoto: null,
//       agencyLogo: null,
//       passportPhoto: null,
      
//       // Identity Documents
//       aadhaarCard: null,
//       panCard: null,
      
//       // Business Documents
//       reraCertificate: null,
//       gstCertificate: null,
//       businessRegistrationCertificate: null,
      
//       // Property Images (for display)
//       coverImage: null,
//       propertyPhotos: [],
//       propertyVideo: null,
      
//       // Property Documents
//       floorPlan: null,
//       saleDeed: null,
//       pattaChitta: null,
//       encumbranceCertificate: null,
//       propertyTaxReceipt: null,
//       buildingApprovalPlan: null,
//       completionCertificate: null,
//       occupancyCertificate: null,
//       rentalAgreement: null,
      
//       // Other documents
//       otherDocuments: [],
//     };

//     const allPropertyImages = [];
//     let videoUrl = null;
//     const otherDocs = [];

//     // ===== Process Profile Files from Agent Profile =====
//     if (Array.isArray(profileFiles) && profileFiles.length > 0) {
//       profileFiles.forEach(file => {
//         const field = file.field || '';
//         const url = file.fileUrl || file.url || '';
//         const fileType = file.fileType || file.type || '';
//         const docType = file.documentType || '';
        
//         if (!url) return;
        
//         // Map profile files to document fields
//         const fieldLower = field.toLowerCase();
//         const docTypeLower = docType.toLowerCase();
        
//         // Check for profile photo
//         if (fieldLower.includes('profile') || docTypeLower.includes('profile') || 
//             fieldLower.includes('passport') || docTypeLower.includes('passport')) {
//           newDocuments.profilePhoto = url;
//           newDocuments.passportPhoto = url;
//         }
//         // Check for agency logo
//         else if (fieldLower.includes('agency') || docTypeLower.includes('agency') || 
//                  fieldLower.includes('logo')) {
//           newDocuments.agencyLogo = url;
//         }
//         // Check for aadhaar
//         else if (fieldLower.includes('aadhaar') || docTypeLower.includes('aadhaar')) {
//           newDocuments.aadhaarCard = url;
//         }
//         // Check for pan
//         else if (fieldLower.includes('pan') || docTypeLower.includes('pan')) {
//           newDocuments.panCard = url;
//         }
//         // Check for rera
//         else if (fieldLower.includes('rera') || docTypeLower.includes('rera')) {
//           newDocuments.reraCertificate = url;
//         }
//         // Check for gst
//         else if (fieldLower.includes('gst') || docTypeLower.includes('gst')) {
//           newDocuments.gstCertificate = url;
//         }
//         // Check for business registration
//         else if (fieldLower.includes('business') || docTypeLower.includes('business') || 
//                  fieldLower.includes('registration')) {
//           newDocuments.businessRegistrationCertificate = url;
//         }
//         // Check for video
//         else if (url.match(/\.(mp4|mov|webm|avi|mkv)$/i) || fileType === 'video') {
//           videoUrl = url;
//         }
//         // Check for image
//         else if (fileType === 'image' || url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//           allPropertyImages.push(url);
//         }
//         // Check for document
//         else if (fileType === 'document' || url.match(/\.(pdf|doc|docx|xls|xlsx)$/i)) {
//           otherDocs.push({
//             id: file.id || Date.now(),
//             name: file.fileName || file.name || 'Document',
//             url: url,
//             type: docType || field,
//             size: file.fileSizeKb || 0,
//           });
//         }
//       });
//     }

//     // ===== Process Properties for Images and Documents =====
//     if (Array.isArray(propertiesData) && propertiesData.length > 0) {
//       propertiesData.forEach((item) => {
//         const prop = item.propertyData || item;
//         const images = prop.images || [];
//         const documents = prop.documents || [];
        
//         // Process property images
//         images.forEach(img => {
//           const url = img.fileUrl || img;
//           if (!url) return;
          
//           if (url.match(/\.(mp4|mov|webm|avi|mkv)$/i)) {
//             if (!videoUrl) videoUrl = url;
//           } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//             allPropertyImages.push(url);
//           }
//         });
        
//         // Process property documents
//         documents.forEach(doc => {
//           const fileUrl = doc.fileUrl || doc.url;
//           if (!fileUrl) return;
          
//           const docType = (doc.documentType || doc.type || '').toLowerCase();
//           const fileName = (doc.fileName || doc.name || '').toLowerCase();
          
//           let matched = false;
          
//           // Check document against mapping
//           for (const [key, patterns] of Object.entries(documentMap)) {
//             if (Array.isArray(patterns)) {
//               for (const pattern of patterns) {
//                 if (docType.includes(pattern) || fileName.includes(pattern)) {
//                   if (newDocuments[key] === null) {
//                     newDocuments[key] = fileUrl;
//                   }
//                   matched = true;
//                   break;
//                 }
//               }
//             }
//             if (matched) break;
//           }
          
//           // If not matched and not already in otherDocs, add to other documents
//           if (!matched) {
//             const exists = otherDocs.some(d => d.url === fileUrl);
//             if (!exists) {
//               otherDocs.push({
//                 id: doc.id || Date.now(),
//                 name: doc.fileName || doc.name || 'Document',
//                 url: fileUrl,
//                 type: docType || 'other',
//                 size: doc.fileSizeKb || 0,
//               });
//             }
//           }
//         });
//       });
//     }

//     // ===== Process Documents Data from Profile =====
//     if (Array.isArray(documentsData) && documentsData.length > 0) {
//       documentsData.forEach(doc => {
//         const url = doc.fileUrl || doc.url;
//         if (!url) return;
        
//         const docType = (doc.documentType || doc.type || '').toLowerCase();
//         const field = (doc.field || '').toLowerCase();
        
//         let matched = false;
        
//         // Check against mapping
//         for (const [key, patterns] of Object.entries(documentMap)) {
//           if (Array.isArray(patterns)) {
//             for (const pattern of patterns) {
//               if (docType.includes(pattern) || field.includes(pattern)) {
//                 if (newDocuments[key] === null) {
//                   newDocuments[key] = url;
//                 }
//                 matched = true;
//                 break;
//               }
//             }
//           }
//           if (matched) break;
//         }
        
//         if (!matched) {
//           const exists = otherDocs.some(d => d.url === url);
//           if (!exists) {
//             otherDocs.push({
//               id: doc.id || Date.now(),
//               name: doc.fileName || doc.name || 'Document',
//               url: url,
//               type: docType || 'other',
//               size: doc.fileSizeKb || 0,
//             });
//           }
//         }
//       });
//     }

//     // ===== Set Profile Photo =====
//     // If no profile photo found, try to find one from property images
//     if (!newDocuments.profilePhoto && allPropertyImages.length > 0) {
//       // Try to find profile/primary image
//       const profileImage = allPropertyImages.find(img => 
//         img.includes('profile') || img.includes('primary') || img.includes('cover')
//       );
//       if (profileImage) {
//         newDocuments.profilePhoto = profileImage;
//       } else {
//         newDocuments.profilePhoto = allPropertyImages[0];
//       }
//     }

//     // ===== Set Cover Image =====
//     if (allPropertyImages.length > 0) {
//       // Try to find cover image
//       const coverImage = allPropertyImages.find(img => 
//         img.includes('cover') || img.includes('primary')
//       );
//       if (coverImage) {
//         newDocuments.coverImage = coverImage;
//       } else if (allPropertyImages.length > 1) {
//         newDocuments.coverImage = allPropertyImages[1];
//       } else {
//         newDocuments.coverImage = allPropertyImages[0];
//       }
//     }

//     // ===== Set Property Photos (exclude profile and cover) =====
//     const filteredImages = allPropertyImages.filter(img => 
//       img !== newDocuments.profilePhoto && 
//       img !== newDocuments.coverImage
//     );
//     newDocuments.propertyPhotos = filteredImages.slice(0, 5);

//     // ===== Set Property Video =====
//     newDocuments.propertyVideo = videoUrl || null;

//     // ===== Set Other Documents =====
//     newDocuments.otherDocuments = otherDocs;

//     // ===== Update Documents State =====
//     setDocuments(newDocuments);
    
//     console.log('✅ Agent profile data loaded successfully');
//     console.log('📊 Properties loaded:', formattedProperties.length);
//     console.log('📁 Documents loaded:', {
//       profilePhoto: !!newDocuments.profilePhoto,
//       agencyLogo: !!newDocuments.agencyLogo,
//       aadhaarCard: !!newDocuments.aadhaarCard,
//       panCard: !!newDocuments.panCard,
//       reraCertificate: !!newDocuments.reraCertificate,
//       gstCertificate: !!newDocuments.gstCertificate,
//       businessRegistrationCertificate: !!newDocuments.businessRegistrationCertificate,
//       propertyPhotos: newDocuments.propertyPhotos.length,
//       otherDocuments: newDocuments.otherDocuments.length,
//     });
    
//     // ============ 5. SHOW SUCCESS TOAST ============
//     showSuccessToast();
    
//   } catch (error) {
//     console.error('❌ Error fetching agent profile data:', error);
//   }
// };









//   // ============ TOAST HANDLER ============
//   const showSuccessToast = () => {
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   // ============ FILE UPLOAD HANDLERS ============
//   const handleFileUpload = (field, file) => {
//     if (file) {
//       setDocuments(prev => ({
//         ...prev,
//         [field]: file
//       }));
//       showSuccessToast();
//     }
//     console.log("field: ",field," file: ",file);
//   };

//   const handleProfilePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleFileUpload('profilePhoto', file);
//     }
//   };

//   const handleAgencyLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleFileUpload('agencyLogo', file);
//     }
//   };

//   const handlePdfUpload = (field, file) => {
//     if (file) {
//       if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
//         setDocuments(prev => ({
//           ...prev,
//           [field]: file
//         }));
//         showSuccessToast();
//       } else {
//         alert('Please upload a valid PDF file.');
//       }
//     }
//   };

//   const handlePdfView = (field) => {
//     const file = documents[field];
//     if (file) {
//       setPdfToView(file);
//       setShowPdfViewer(true);
//     }
//   };

//   const handlePdfDelete = (field) => {
//     setDeleteItem({ field });
//     setShowDeleteConfirm(true);
//   };

//   const removeFile = (field) => {
//     setDeleteItem({ field });
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = () => {
//     if (deleteItem) {
//       const { field } = deleteItem;
//       setDocuments(prev => ({
//         ...prev,
//         [field]: null
//       }));
//       if (fileInputRefs.current[field]) {
//         fileInputRefs.current[field].value = '';
//       }
//       setShowDeleteConfirm(false);
//       setDeleteItem(null);
//       showSuccessToast();
//     }
//   };

//   const handleProfilePhotoDelete = () => {
//     setShowProfilePhotoDeleteConfirm(true);
//   };

//   const confirmProfilePhotoDelete = () => {
//     setDocuments(prev => ({
//       ...prev,
//       profilePhoto: null
//     }));
//     if (profilePhotoInputRef.current) {
//       profilePhotoInputRef.current.value = '';
//     }
//     setShowProfilePhotoDeleteConfirm(false);
//     showSuccessToast();
//   };

//   // ============ FORM CHANGE HANDLER ============
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (e) => {
//     const value = e.target.value;
//     if (value) {
//       const [year, month, day] = value.split('-');
//       setEditForm(prev => ({ ...prev, dateOfBirth: `${day}-${month}-${year}` }));
//     } else {
//       setEditForm(prev => ({ ...prev, dateOfBirth: '' }));
//     }
//   };

//   // ============ NAVIGATION ============
//   const handleNavigateBack = () => {
//     if (window.history.length > 2) {
//       navigate(-1);
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   // ============ SAVE HANDLER ============
//   const handleSave = () => {
//     const requiredFields = ['fullName', 'mobileNumber', 'emailAddress', 'agencyName', 'aadhaarNumber', 'panNumber'];
//     const missingFields = requiredFields.filter(field => !editForm[field]);

//     if (missingFields.length > 0) {
//       alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
//       return;
//     }

//     setIsLoading(true);
//     setTimeout(() => {
//       setShowEditModal(false);
//       setIsLoading(false);
//       showSuccessToast();
//     }, 1500);
//   };

//   // ============ INVOICE PDF HANDLER ============
//   const handleDownloadInvoice = () => {
//     const doc = new jsPDF();
//     const teal = [0, 105, 92];

//     doc.setFillColor(...teal);
//     doc.rect(0, 0, 210, 28, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(18);
//     doc.setFont(undefined, 'bold');
//     doc.text('Agent Profile Invoice', 14, 17);
//     doc.setFontSize(10);
//     doc.setFont(undefined, 'normal');
//     doc.text(`Generated: ${new Date().toLocaleDateString()}`, 196, 17, { align: 'right' });

//     doc.setTextColor(30, 30, 30);
//     let y = 40;

//     const section = (title) => {
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'bold');
//       doc.setTextColor(...teal);
//       doc.text(title, 14, y);
//       doc.setDrawColor(...teal);
//       doc.line(14, y + 1.5, 196, y + 1.5);
//       y += 8;
//       doc.setFont(undefined, 'normal');
//       doc.setTextColor(30, 30, 30);
//       doc.setFontSize(10.5);
//     };

//     const row = (label, value) => {
//       doc.setFont(undefined, 'bold');
//       doc.text(`${label}:`, 14, y);
//       doc.setFont(undefined, 'normal');
//       doc.text(String(value || 'Not specified'), 65, y);
//       y += 7;
//     };

//     section('Personal Details');
//     row('Full Name', editForm.fullName);
//     row('Mobile Number', editForm.mobileNumber);
//     row('Email Address', editForm.emailAddress);
//     row('Date of Birth', editForm.dateOfBirth);
//     row('Gender', editForm.gender);
//     y += 4;

//     section('Business Information');
//     row('Agency Name', editForm.agencyName);
//     row('RERA Number', editForm.reraRegistrationNumber);
//     row('GST Number', editForm.gstNumber);
//     row('Years of Experience', editForm.yearsOfExperience);
//     row('Active Listings', editForm.numberOfActiveListings);
//     row('Service Areas', editForm.serviceAreas);
//     y += 4;

//     section('Identity & Contact');
//     row('Aadhaar Number', editForm.aadhaarNumber);
//     row('PAN Number', editForm.panNumber);
//     row('Office Address', editForm.officeAddress);
//     row('City', editForm.city);
//     row('State', editForm.state);
//     row('PIN Code', editForm.pinCode);
//     row('Website', editForm.website);
//     row('WhatsApp', editForm.whatsappNumber);
//     y += 4;

//     section('Bank Details');
//     row('Account Holder', editForm.accountHolderName);
//     row('Bank Name', editForm.bankName);
//     row('Account Number', editForm.accountNumber);
//     row('IFSC Code', editForm.ifscCode);
//     row('UPI ID', editForm.upiId);

//     // Property Summary
//     section('Properties Summary');
//     row('Total Properties', properties.length);
//     row('Active Listings', properties.filter(p => p.status === 'Active').length);

//     doc.setFontSize(8);
//     doc.setTextColor(150, 150, 150);
//     doc.text('This is a system-generated document.', 14, 287);

//     doc.save(`Invoice_${editForm.fullName.replace(/\s+/g, '_')}.pdf`);
//   };

//   // ============ SECTION DEFINITIONS ============
//   const sections = [
//     { id: 'personal', title: 'Personal Details', icon: User },
//     { id: 'business', title: 'Business Information', icon: Briefcase },
//     { id: 'identity', title: 'Identity Verification', icon: Shield },
//     { id: 'documents', title: 'Upload Documents', icon: FileText },
//     { id: 'bank', title: 'Bank Details', icon: Banknote },
//     { id: 'social', title: 'Social Media', icon: Share2 },
//     { id: 'contact', title: 'Contact Information', icon: MapPin },
//   ];

//   // ============ FORMAT HELPERS ============
//   const formatDateForDisplay = (dateStr) => {
//     if (!dateStr) return 'Not specified';
//     if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) return dateStr;
//     if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
//       const [year, month, day] = dateStr.split('-');
//       return `${day}-${month}-${year}`;
//     }
//     return dateStr;
//   };

//   const formatDateForInput = (dateStr) => {
//     if (!dateStr) return '';
//     if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
//       const [day, month, year] = dateStr.split('-');
//       return `${year}-${month}-${day}`;
//     }
//     return dateStr;
//   };

//   const getFileStatusLabel = (field) => {
//     const file = documents[field];
//     return file !== null && file !== undefined ? 'Uploaded' : null;
//   };

//   const getListingPurposeLabel = (purpose) => {
//     if (!purpose) return 'Not specified';
//     const normalized = purpose.toLowerCase();
//     if (normalized === 'sale' || normalized === 'for sale') return 'For Sale';
//     if (normalized === 'rent' || normalized === 'for rent') return 'For Rent';
//     if (normalized === 'lease' || normalized === 'for lease') return 'For Lease';
//     return purpose;
//   };

//   // ============ PROPERTY HANDLERS ============
//   const handleViewDetails = (property) => {
//     setSelectedProperty(property);
//     setShowPropertyDetails(true);
//   };

//   const handleEditProperty = (property) => {
//     setEditingProperty({ ...property });
//     setShowEditPropertyModal(true);
//   };

//   const handleToggleStatus = (property) => {
//     const newStatus = property.status === 'Active' ? 'Inactive' : 'Active';
//     setProperties(prev => 
//       prev.map(p => 
//         p.id === property.id 
//           ? { ...p, status: newStatus } 
//           : p
//       )
//     );
//     showSuccessToast();
//   };

//   const handleAddPropertyImages = (propertyId, files) => {
//     const fileArray = Array.from(files);
//     if (fileArray.length === 0) return;
//     const newUrls = fileArray.map((f) => URL.createObjectURL(f));

//     setProperties(prev =>
//       prev.map(p => p.id === propertyId ? { ...p, images: [...(p.images || []), ...newUrls] } : p)
//     );
//     setSelectedProperty(prev =>
//       prev && prev.id === propertyId ? { ...prev, images: [...(prev.images || []), ...newUrls] } : prev
//     );
//     showSuccessToast();
//   };

//   const handleRemovePropertyImage = (propertyId, imageIndex) => {
//     setProperties(prev =>
//       prev.map(p => p.id === propertyId ? { ...p, images: (p.images || []).filter((_, i) => i !== imageIndex) } : p)
//     );
//     setSelectedProperty(prev =>
//       prev && prev.id === propertyId ? { ...prev, images: (prev.images || []).filter((_, i) => i !== imageIndex) } : prev
//     );
//     showSuccessToast();
//   };

//   const handleSavePropertyEdit = (updatedProperty) => {
//     if (updatedProperty) {
//       setProperties(prev => 
//         prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
//       );
//     }
//     setShowEditPropertyModal(false);
//     setEditingProperty(null);
//     showSuccessToast();
//   };

//   const handleDeleteProperty = (property) => {
//     setPropertyToDelete(property);
//     setShowDeletePropertyConfirm(true);
//   };

//   const confirmDeleteProperty = () => {
//     setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
//     setShowDeletePropertyConfirm(false);
//     setPropertyToDelete(null);
//     showSuccessToast();
//   };

//   // ============ FILTER PROPERTIES ============
//   const getFilteredProperties = () => {
//     let filtered = [...properties];
    
//     if (searchTerm && searchTerm.trim() !== '') {
//       const searchLower = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(prop => {
//         return (
//           prop.name.toLowerCase().includes(searchLower) ||
//           prop.id.toLowerCase().includes(searchLower) ||
//           prop.location.toLowerCase().includes(searchLower) ||
//           prop.type.toLowerCase().includes(searchLower) ||
//           prop.price.toLowerCase().includes(searchLower) ||
//           prop.area.toLowerCase().includes(searchLower)
//         );
//       });
//     }
    
//     if (filterStatus && filterStatus !== 'all') {
//       const statusLower = filterStatus.toLowerCase();
//       filtered = filtered.filter(prop => 
//         prop.status.toLowerCase() === statusLower
//       );
//     }
    
//     return filtered;
//   };

//   const filteredProperties = getFilteredProperties();

//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   // ============ RENDER HELPERS ============
//   const RingBadge = ({ pct }) => {
//     const circumference = 2 * Math.PI * 15.5;
//     const dashOffset = circumference - (pct / 100) * circumference;
//     return (
//       <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 border border-[#00695C]/15 rounded-2xl pl-2 pr-4 py-1.5 shadow-sm">
//         <div className="relative w-9 h-9 flex-shrink-0">
//           <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
//             <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00695C1A" strokeWidth="3" />
//             <circle
//               cx="18" cy="18" r="15.5" fill="none"
//               stroke="url(#ringGradShared)"
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeDasharray={circumference}
//               strokeDashoffset={dashOffset}
//               style={{ transition: 'stroke-dashoffset 1s ease-out' }}
//             />
//             <defs>
//               <linearGradient id="ringGradShared" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#00695C" />
//                 <stop offset="100%" stopColor="#26A69A" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#00695C]">
//             {pct}%
//           </span>
//         </div>
//       </div>
//     );
//   };

//   const SectionHeader = ({ title, subtitle, filled, total }) => {
//     const pct = total ? Math.round((filled / total) * 100) : null;
//     return (
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2 sm:gap-3">
//         <div className="flex items-center">
//           <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-2 sm:mr-3 rounded-full animate-pulse-slow"></div>
//           <div>
//             <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
//               {title}
//             </h2>
//             <p className="text-[10px] sm:text-xs text-gray-500">{subtitle}</p>
//           </div>
//         </div>
//         {pct !== null && (
//           <div className="flex items-center gap-2">
//             <RingBadge pct={pct} />
//             <div className="leading-tight hidden sm:block">
//               <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Completion</p>
//               <p className="text-[10px] text-gray-400">{filled} of {total} complete</p>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const AnimatedCard = ({ label, value, icon, delay = 0, children }) => (
//     <div
//       className="group/acard relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] border border-[#00695C]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-up"
//       style={{ animationDelay: `${delay}s` }}
//     >
//       <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/40 to-[#00695C]/0 opacity-0 group-hover/acard:opacity-100 blur-sm transition-opacity duration-500 -z-10" />
//       <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/60 to-transparent group-hover/acard:left-full transition-all duration-[1100ms] ease-out" />
//       <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl opacity-0 group-hover/acard:opacity-100 group-hover/acard:scale-125 transition-all duration-500" />
//       <div className="relative p-2.5 sm:p-3.5 flex items-start gap-2 sm:gap-3">
//         <div className="relative flex-shrink-0">
//           <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] blur-md opacity-0 group-hover/acard:opacity-60 transition-opacity duration-500" />
//           <div className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover/acard:scale-110 group-hover/acard:rotate-6 transition-all duration-300">
//             <div className="text-white">{icon}</div>
//           </div>
//         </div>
//         <div className="flex-1 min-w-0">
//           <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-wider group-hover/acard:text-[#00695C] transition-colors duration-300">
//             {label}
//           </label>
//           {children ? (
//             children
//           ) : (
//             <div className="text-xs sm:text-[13px] text-gray-800 font-semibold break-words">
//               {value || <span className="text-gray-400 font-medium italic">Not specified</span>}
//             </div>
//           )}
//         </div>
//         {value && !children && (
//           <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C]/30 group-hover/acard:text-[#00695C] flex-shrink-0 transition-colors duration-300" />
//         )}
//       </div>
//       <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
//         <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover/acard:w-full transition-all duration-700 ease-out" />
//       </div>
//     </div>
//   );

//   // ============ SECTION CONTENT RENDER ============
//   const renderSectionContent = () => {
//     switch (activeSection) {
//       case 'personal': {
//         const personalFields = [
//           editForm.fullName,
//           editForm.mobileNumber,
//           editForm.emailAddress,
//           editForm.dateOfBirth,
//           editForm.gender,
//           documents.profilePhoto
//         ];
//         const filledCount = personalFields.filter(Boolean).length;

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Personal Details"
//               subtitle="Manage your personal information"
//               filled={filledCount}
//               total={personalFields.length}
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Full Name" value={editForm.fullName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="Mobile Number" value={editForm.mobileNumber} icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="Email Address" value={editForm.emailAddress} icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Date of Birth" value={formatDateForDisplay(editForm.dateOfBirth)} icon={<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//                 <AnimatedCard label="Gender" value={editForm.gender} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Profile Photo" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4}>
//                   <div className="flex items-center gap-2">
//                     {documents.profilePhoto ? (
//                       <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
//                         <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                         Uploaded
//                       </span>
//                     ) : (
//                       <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No photo uploaded</span>
//                     )}
//                   </div>
//                 </AnimatedCard>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'business': {
//         const businessFields = [
//           editForm.agencyName,
//           editForm.reraRegistrationNumber,
//           editForm.gstNumber,
//           editForm.yearsOfExperience,
//           editForm.numberOfActiveListings,
//           editForm.serviceAreas,
//           editForm.officeAddress,
//           documents.agencyLogo
//         ];
//         const filledCount = businessFields.filter(Boolean).length;

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Business Information"
//               subtitle="Manage your agency and business details"
//               filled={filledCount}
//               total={businessFields.length}
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Agency Name" value={editForm.agencyName} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="RERA Registration Number" value={editForm.reraRegistrationNumber} icon={<BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="GST Number" value={editForm.gstNumber || 'Not provided'} icon={<Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//                 <AnimatedCard label="Years of Experience" value={editForm.yearsOfExperience} icon={<Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Number of Active Listings" value={editForm.numberOfActiveListings} icon={<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Service Areas" value={editForm.serviceAreas} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
//                 <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47} />
//                 <AnimatedCard label="Agency Logo" icon={<Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.54}>
//                   <div className="flex items-center gap-2">
//                     {documents.agencyLogo ? (
//                       <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
//                         <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                         Uploaded
//                       </span>
//                     ) : (
//                       <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No logo uploaded</span>
//                     )}
//                   </div>
//                 </AnimatedCard>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'identity': {
//         const identityFields = [
//           editForm.aadhaarNumber,
//           editForm.panNumber,
//           documents.aadhaarCard,
//           documents.panCard,
//           documents.businessRegistrationCertificate,
//           documents.reraCertificate
//         ];
//         const filledCount = identityFields.filter(Boolean).length;

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Identity Verification"
//               subtitle="Your identity and verification documents"
//               filled={filledCount}
//               total={identityFields.length}
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Upload Aadhaar Card" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19}>
//                   {documents.aadhaarCard ? (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handlePdfView('aadhaarCard')}
//                         className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                         View Document
//                       </button>
//                       <button
//                         onClick={() => handlePdfDelete('aadhaarCard')}
//                         className="text-red-400 hover:text-red-600 transition-colors"
//                       >
//                         <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
//                   )}
//                 </AnimatedCard>
//                 <AnimatedCard label="Upload PAN Card" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26}>
//                   {documents.panCard ? (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handlePdfView('panCard')}
//                         className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                         View Document
//                       </button>
//                       <button
//                         onClick={() => handlePdfDelete('panCard')}
//                         className="text-red-400 hover:text-red-600 transition-colors"
//                       >
//                         <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
//                   )}
//                 </AnimatedCard>
//                 <AnimatedCard label="Business Registration Certificate" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33}>
//                   {documents.businessRegistrationCertificate ? (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handlePdfView('businessRegistrationCertificate')}
//                         className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                         View Document
//                       </button>
//                       <button
//                         onClick={() => handlePdfDelete('businessRegistrationCertificate')}
//                         className="text-red-400 hover:text-red-600 transition-colors"
//                       >
//                         <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
//                   )}
//                 </AnimatedCard>
//                 <AnimatedCard label="RERA Certificate" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4}>
//                   {documents.reraCertificate ? (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => handlePdfView('reraCertificate')}
//                         className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
//                       >
//                         <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                         View Document
//                       </button>
//                       <button
//                         onClick={() => handlePdfDelete('reraCertificate')}
//                         className="text-red-400 hover:text-red-600 transition-colors"
//                       >
//                         <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
//                   )}
//                 </AnimatedCard>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'documents': {
//         const docFields = [
//           'profilePhoto',
//           'agencyLogo',
//           'aadhaarCard',
//           'panCard',
//           'reraCertificate',
//           'gstCertificate',
//           'businessRegistrationCertificate'
//         ];
//         const filledCount = docFields.filter(f => {
//           const v = documents[f];
//           return v !== null && v !== undefined;
//         }).length;

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Upload Documents"
//               subtitle="All your important documents in one place"
//               filled={filledCount}
//               total={docFields.length}
//             />

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 w-full">
//               {[
//                 { field: 'profilePhoto', label: 'Profile Photo', icon: <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//                 { field: 'agencyLogo', label: 'Agency Logo', icon: <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//                 { field: 'aadhaarCard', label: 'Aadhaar Card', icon: <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//                 { field: 'panCard', label: 'PAN Card', icon: <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//                 { field: 'reraCertificate', label: 'RERA Certificate', icon: <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//                 { field: 'gstCertificate', label: 'GST Certificate', icon: <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//                 { field: 'businessRegistrationCertificate', label: 'Business Registration', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//               ].map((doc) => {
//                 const file = documents[doc.field];
//                 const hasFile = file !== null && file !== undefined;

//                 return (
//                   <div
//                     key={doc.field}
//                     className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10 hover:border-[#00695C]/30"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                     <div className="relative p-2.5 sm:p-3">
//                       <div className="flex items-center justify-between mb-1.5 sm:mb-2">
//                         <div className="flex items-center gap-1.5 sm:gap-2">
//                           <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300">
//                             <div className="text-white">
//                               {doc.icon}
//                             </div>
//                           </div>
//                           <span className="text-[10px] sm:text-xs font-bold text-gray-700">{doc.label}</span>
//                         </div>
//                         {hasFile && (
//                           <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">
//                             ✓
//                           </span>
//                         )}
//                       </div>

//                       {hasFile ? (
//                         <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg p-1 sm:p-1.5 border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
//                           {doc.field === 'profilePhoto' || doc.field === 'agencyLogo' ? (
//                             <button
//                               onClick={() => {
//                                 const items = [{
//                                   type: 'image',
//                                   url: URL.createObjectURL(file),
//                                   name: file.name || `${doc.label}`
//                                 }];
//                                 setLightboxItems(items);
//                                 setLightboxIndex(0);
//                                 setShowMediaLightbox(true);
//                               }}
//                               className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1"
//                             >
//                               <Image className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                               <span className="truncate">{file.name || 'Image'}</span>
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handlePdfView(doc.field)}
//                               className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1"
//                             >
//                               <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                               <span className="truncate">{file.name || 'Document'}</span>
//                             </button>
//                           )}
//                           <button
//                             onClick={() => removeFile(doc.field)}
//                             className="p-0.5 sm:p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300 flex-shrink-0"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="border-2 border-dashed border-gray-200 rounded-lg p-1.5 sm:p-2 text-center hover:border-[#00695C] hover:bg-[#00695C]/5 transition-all duration-300 group/upload">
//                           <label className="block cursor-pointer">
//                             <div className="flex items-center justify-center gap-1.5 sm:gap-2">
//                               <div className="p-0.5 sm:p-1 bg-gray-100 rounded-lg group-hover/upload:bg-[#00695C]/10 transition-colors duration-300">
//                                 <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover/upload:text-[#00695C] transition-colors duration-300" />
//                               </div>
//                               <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 group-hover/upload:text-[#00695C] transition-colors duration-300">
//                                 Upload
//                               </span>
//                             </div>
//                             <input
//                               type="file"
//                               className="hidden"
//                               accept={doc.field === 'profilePhoto' || doc.field === 'agencyLogo' ? 'image/*' : '.pdf'}
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 if (file) {
//                                   if (doc.field === 'profilePhoto' || doc.field === 'agencyLogo') {
//                                     handleFileUpload(doc.field, file);
//                                   } else {
//                                     handlePdfUpload(doc.field, file);
//                                   }
//                                 }
//                                 e.target.value = '';
//                               }}
//                             />
//                           </label>
//                         </div>
//                       )}
//                     </div>
//                     <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
//                       <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover:w-full transition-all duration-700 ease-out" />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       }

//       case 'bank': {
//         const bankFields = [
//           editForm.accountHolderName,
//           editForm.bankName,
//           editForm.accountNumber,
//           editForm.ifscCode,
//           editForm.upiId
//         ];
//         const filledCount = bankFields.filter(Boolean).length;

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Bank Details"
//               subtitle="Your banking and financial information"
//               filled={filledCount}
//               total={bankFields.length}
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Account Holder Name" value={editForm.accountHolderName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="Bank Name" value={editForm.bankName} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="Account Number" value={editForm.accountNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="IFSC Code" value={editForm.ifscCode} icon={<Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//                 <AnimatedCard label="UPI ID" value={editForm.upiId || 'Not provided'} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'social': {
//         const socialFields = [
//           editForm.website,
//           editForm.facebookPage,
//           editForm.instagram,
//           editForm.linkedIn,
//           editForm.youtubeChannel
//         ];
//         const filledCount = socialFields.filter(Boolean).length;

//         const getSocialUrl = (platform, value) => {
//           if (!value) return '#';
//           if (value.startsWith('http://') || value.startsWith('https://')) {
//             return value;
//           }
//           const cleanValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
//           switch(platform) {
//             case 'website': return `https://${cleanValue}`;
//             case 'facebook': return `https://www.facebook.com/${cleanValue}`;
//             case 'instagram': return `https://www.instagram.com/${cleanValue}`;
//             case 'linkedin': return `https://www.linkedin.com/${cleanValue}`;
//             case 'youtube': return `https://www.youtube.com/${cleanValue}`;
//             default: return `https://${cleanValue}`;
//           }
//         };

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Social Media & Website"
//               subtitle="Your online presence and social media links"
//               filled={filledCount}
//               total={socialFields.length}
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Website" icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05}>
//                   {editForm.website ? (
//                     <a 
//                       href={getSocialUrl('website', editForm.website)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
//                     >
//                       {editForm.website}
//                       <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
//                     </a>
//                   ) : (
//                     <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
//                   )}
//                 </AnimatedCard>

//                 <AnimatedCard label="Facebook Page" icon={<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12}>
//                   {editForm.facebookPage ? (
//                     <a 
//                       href={getSocialUrl('facebook', editForm.facebookPage)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
//                     >
//                       {editForm.facebookPage}
//                       <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
//                     </a>
//                   ) : (
//                     <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
//                   )}
//                 </AnimatedCard>

//                 <AnimatedCard label="Instagram" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19}>
//                   {editForm.instagram ? (
//                     <a 
//                       href={getSocialUrl('instagram', editForm.instagram)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
//                     >
//                       {editForm.instagram}
//                       <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
//                     </a>
//                   ) : (
//                     <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
//                   )}
//                 </AnimatedCard>
//               </div>

//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="LinkedIn" icon={<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26}>
//                   {editForm.linkedIn ? (
//                     <a 
//                       href={getSocialUrl('linkedin', editForm.linkedIn)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
//                     >
//                       {editForm.linkedIn}
//                       <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
//                     </a>
//                   ) : (
//                     <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
//                   )}
//                 </AnimatedCard>

//                 <AnimatedCard label="YouTube Channel" icon={<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33}>
//                   {editForm.youtubeChannel ? (
//                     <a 
//                       href={getSocialUrl('youtube', editForm.youtubeChannel)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
//                     >
//                       {editForm.youtubeChannel}
//                       <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
//                     </a>
//                   ) : (
//                     <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
//                   )}
//                 </AnimatedCard>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'contact': {
//         const contactFields = [
//           editForm.officeAddress,
//           editForm.city,
//           editForm.district,
//           editForm.state,
//           editForm.pinCode,
//           editForm.website,
//           editForm.whatsappNumber
//         ];
//         const filledCount = contactFields.filter(Boolean).length;

//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader
//               title="Contact Information"
//               subtitle="Your complete contact details"
//               filled={filledCount}
//               total={contactFields.length}
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="City" value={editForm.city} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="District" value={editForm.district} icon={<Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//                 <AnimatedCard label="State" value={editForm.state} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="PIN Code" value={editForm.pinCode} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Website" value={editForm.website || 'Not provided'} icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
//                 <AnimatedCard label="WhatsApp Number" value={editForm.whatsappNumber || 'Not provided'} icon={<Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47} />
//               </div>
//             </div>
//           </div>
//         );
//       }

//       default:
//         return null;
//     }
//   };

//   // ============ RENDER PROPERTIES SECTION ============
//   const renderPropertiesSection = () => {
//     return (
//       <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
//           <div className="flex items-center gap-2 sm:gap-2.5">
//             <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
//               <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//             </div>
//             <div>
//               <h2 className="text-sm sm:text-base font-bold text-gray-800">My Properties</h2>
//               <p className="text-[9px] sm:text-[11px] text-gray-500">Manage your property listings</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto flex-wrap">
//             <div className="relative flex-1 sm:flex-initial min-w-[100px] sm:min-w-[120px]">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-2 sm:px-3 py-1 sm:py-1.5 pl-6 sm:pl-8 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs"
//               />
//               <Search className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
//               {searchTerm && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                 </button>
//               )}
//             </div>
            
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs bg-white"
//             >
//               <option value="all">All</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-1 sm:p-1.5 transition-all duration-300 ${
//                   viewMode === 'grid' 
//                     ? 'bg-[#00695C] text-white' 
//                     : 'bg-white text-gray-600 hover:bg-gray-50'
//                 }`}
//                 aria-label="Grid view"
//               >
//                 <GridIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-1 sm:p-1.5 transition-all duration-300 ${
//                   viewMode === 'list' 
//                     ? 'bg-[#00695C] text-white' 
//                     : 'bg-white text-gray-600 hover:bg-gray-50'
//                 }`}
//                 aria-label="List view"
//               >
//                 <List className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {filteredProperties.length > 0 ? (
//           <div>
//             {viewMode === 'grid' ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//                 {filteredProperties.map((property, index) => (
//                   <div
//                     key={property.id}
//                     className="group relative bg-teal-100/30 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#00695C]/10 overflow-hidden hover:-translate-y-1"
//                     style={{ animationDelay: `${index * 0.08}s` }}
//                   >
//                     <div className="relative w-full h-40 sm:h-46 bg-gray-100 overflow-hidden">
//                       <img 
//                         src={property.images?.[0] || 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'} 
//                         alt={property.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         onError={(e) => {
//                           e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image';
//                         }}
//                       />
//                       <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
//                         <span className="bg-white/90 backdrop-blur-sm text-[#00695C] text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
//                           {getListingPurposeLabel(property.listingPurpose)}
//                         </span>
//                       </div>
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 sm:p-3">
//                         <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">
//                           {property.price}
//                         </p>
//                       </div>
//                       {property.images && property.images.length > 1 && (
//                         <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5">
//                           <Image className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                           {property.images.length}
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
//                       <div className="flex items-center justify-between gap-1 sm:gap-2">
//                         <h3 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#00695C] transition-colors duration-300 line-clamp-1 flex-1">
//                           {property.name}
//                         </h3>
//                         <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
//                           <span className={`text-[9px] sm:text-[10px] font-bold ${
//                             property.status === 'Active' ? 'text-green-600' : 'text-gray-400'
//                           }`}>
//                             {property.status === 'Active' ? 'Active' : 'Inactive'}
//                           </span>
//                           <ToggleSwitch 
//                             isOn={property.status === 'Active'} 
//                             onToggle={() => handleToggleStatus(property)}
//                             size="sm"
//                           />
//                         </div>
//                       </div>

//                       <p className="text-[9px] sm:text-xs text-gray-500 font-medium flex items-center gap-1 sm:gap-2">
//                         <span className="bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">{property.id}</span>
//                         <span className="w-1 h-1 rounded-full bg-gray-300" />
//                         <span>{property.postedDate}</span>
//                       </p>

//                       <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
//                         <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C] flex-shrink-0" />
//                         <span className="font-medium truncate">{property.location}</span>
//                       </div>

//                       <div className="flex flex-wrap gap-1 sm:gap-1.5">
//                         {[
//                           { icon: Building, label: property.type },
//                           { icon: Layers, label: property.area },
//                           { icon: Bed, label: property.bedrooms || 'N/A' }
//                         ].map((item, idx) => (
//                           <span 
//                             key={idx}
//                             className="flex items-center gap-0.5 sm:gap-1 bg-[#00695C]/5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-medium text-[#00695C] border border-[#00695C]/10"
//                           >
//                             <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//                             {item.label}
//                           </span>
//                         ))}
//                       </div>

//                       <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
//                         <button
//                           onClick={() => handleViewDetails(property)}
//                           className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                         >
//                           <ViewIcon className="w-3 h-3 sm:w-4 sm:h-4" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleEditProperty(property)}
//                           className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                         >
//                           <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteProperty(property)}
//                           className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                         >
//                           <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-100">
//                 <table className="w-full text-[10px] sm:text-sm table-fixed">
//                   <colgroup>
//                     <col className="w-[38%] lg:w-[24%]" />
//                     <col className="w-[18%] lg:w-[11%]" />
//                     <col className="hidden lg:table-column lg:w-[11%]" />
//                     <col className="w-[20%] lg:w-[14%]" />
//                     <col className="hidden lg:table-column lg:w-[9%]" />
//                     <col className="hidden lg:table-column lg:w-[13%]" />
//                     <col className="w-[24%] lg:w-[18%]" />
//                   </colgroup>
//                   <thead>
//                     <tr className="border-b-2 border-gray-200 bg-gray-50">
//                       <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
//                       <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
//                       <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Purpose</th>
//                       <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
//                       <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
//                       <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
//                       <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filteredProperties.map((property) => (
//                       <tr key={property.id} className="hover:bg-[#00695C]/3 transition-colors duration-200 group">
//                         <td className="py-2 sm:py-3 px-2 sm:px-4">
//                           <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//                             <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                               <img
//                                 src={property.images?.[0] || 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'}
//                                 alt={property.name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'; }}
//                               />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="font-bold text-[10px] sm:text-sm text-gray-800 group-hover:text-[#00695C] transition-colors truncate">
//                                 {property.name}
//                               </p>
//                               <p className="text-[9px] sm:text-xs text-gray-500 truncate">{property.id}</p>
//                               <p className="text-[9px] sm:text-xs text-gray-400 truncate lg:hidden">
//                                 {property.type} · {property.location}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="py-2 sm:py-3 px-2 sm:px-4">
//                           <div className="flex items-center gap-1">
//                             <ToggleSwitch
//                               isOn={property.status === 'Active'}
//                               onToggle={() => handleToggleStatus(property)}
//                               size="sm"
//                             />
//                             <span className={`hidden sm:inline text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${
//                               property.status === 'Active' ? 'text-green-600' : 'text-gray-400'
//                             }`}>
//                               {property.status}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4">
//                           <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold bg-[#00695C]/10 text-[#00695C] whitespace-nowrap">
//                             {getListingPurposeLabel(property.listingPurpose)}
//                           </span>
//                         </td>
//                         <td className="py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-bold text-gray-800 truncate">
//                           {property.price}
//                         </td>
//                         <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
//                           {property.area}
//                         </td>
//                         <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
//                           {property.location}
//                         </td>
//                         <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
//                           <div className="flex items-center justify-end gap-1 sm:gap-1.5 lg:gap-2">
//                             <button
//                               onClick={() => handleViewDetails(property)}
//                               className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                               title="View"
//                             >
//                               <ViewIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
//                               <span className="hidden lg:inline">View</span>
//                             </button>
//                             <button
//                               onClick={() => handleEditProperty(property)}
//                               className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                               title="Edit"
//                             >
//                               <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
//                               <span className="hidden lg:inline">Edit</span>
//                             </button>
//                             <button
//                               onClick={() => handleDeleteProperty(property)}
//                               className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
//                               title="Delete"
//                             >
//                               <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
//                               <span className="hidden lg:inline">Delete</span>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-6 sm:py-8">
//             <div className="bg-gray-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
//               <Home className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
//             </div>
//             <p className="text-gray-500 font-medium text-xs sm:text-sm">No properties found</p>
//             <p className="text-[10px] sm:text-xs text-gray-400">
//               {searchTerm || filterStatus !== 'all' 
//                 ? 'Try adjusting your search or filters' 
//                 : 'You haven\'t added any properties yet'}
//             </p>
//             {(searchTerm || filterStatus !== 'all') && (
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setFilterStatus('all');
//                 }}
//                 className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         )}

//         <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t-2 border-gray-100 flex justify-between text-[8px] sm:text-[10px] text-gray-500">
//           <span>Showing {filteredProperties.length} of {properties.length} properties</span>
//           <span>Total: {properties.length}</span>
//         </div>
//       </div>
//     );
//   };

//   // ============ MAIN RENDER ============
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-16 sm:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
//       </div>

//       {/* PDF Viewer Modal */}
//       {showPdfViewer && pdfToView && (
//         <PdfViewerModal
//           file={pdfToView}
//           onClose={() => {
//             setShowPdfViewer(false);
//             setPdfToView(null);
//           }}
//         />
//       )}

//       {/* Media Lightbox */}
//       {showMediaLightbox && lightboxItems.length > 0 && (
//         <MediaLightboxModal
//           items={lightboxItems}
//           index={lightboxIndex}
//           onNavigate={setLightboxIndex}
//           onDelete={() => {
//             const item = lightboxItems[lightboxIndex];
//             if (item) {
//               const field = item.field;
//               setDocuments(prev => ({ ...prev, [field]: null }));
//               setLightboxItems([]);
//               setShowMediaLightbox(false);
//               showSuccessToast();
//             }
//           }}
//           onClose={() => {
//             setShowMediaLightbox(false);
//             setLightboxItems([]);
//             setLightboxIndex(0);
//           }}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 p-5 sm:p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
//             <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
//               <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
//                 <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
//               </div>
//               <h3 className="text-lg sm:text-xl font-bold text-gray-800">Confirm Delete</h3>
//             </div>
//             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Are you sure you want to delete this file? This action cannot be undone.</p>
//             <div className="flex justify-end gap-2 sm:gap-3">
//               <button
//                 onClick={() => {
//                   setShowDeleteConfirm(false);
//                   setDeleteItem(null);
//                 }}
//                 className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Profile Photo Delete Confirmation */}
//       {showProfilePhotoDeleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 p-5 sm:p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
//             <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
//               <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
//                 <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
//               </div>
//               <h3 className="text-lg sm:text-xl font-bold text-gray-800">Delete Profile Photo</h3>
//             </div>
//             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Are you sure you want to delete your profile photo? This action cannot be undone.</p>
//             <div className="flex justify-end gap-2 sm:gap-3">
//               <button
//                 onClick={() => setShowProfilePhotoDeleteConfirm(false)}
//                 className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmProfilePhotoDelete}
//                 className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl  mx-auto overflow-hidden max-h-[80vh] flex flex-col animate-scaleIn">
//             <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
//               <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
//                 <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
//                   <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </div>
//                 Edit Agent Profile
//               </h2>
//               <button 
//                 onClick={() => setShowEditModal(false)} 
//                 className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
//               >
//                 <X className="w-5 h-5 sm:w-6 sm:h-6" />
//               </button>
//             </div>
//             <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 w-full bg-gray-50">
//               {/* Personal Details */}
//               <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Personal Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'fullName', label: 'Full Name *', emoji: '👤' },
//                     { name: 'mobileNumber', label: 'Mobile Number *', emoji: '📱' },
//                     { name: 'emailAddress', label: 'Email Address *', emoji: '✉️' },
//                     { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', emoji: '🎂' },
//                     { name: 'gender', label: 'Gender', emoji: '⚥' },
//                   ].map((field) => (
//                     <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       {field.name === 'dateOfBirth' ? (
//                         <input
//                           type="date"
//                           name={field.name}
//                           value={formatDateForInput(editForm.dateOfBirth)}
//                           onChange={handleDateChange}
//                           className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                         />
//                       ) : field.name === 'gender' ? (
//                         <select
//                           name={field.name}
//                           value={editForm.gender}
//                           onChange={handleEditChange}
//                           className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                         >
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       ) : (
//                         <input
//                           type={field.type || 'text'}
//                           name={field.name}
//                           value={editForm[field.name]}
//                           onChange={handleEditChange}
//                           className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                         />
//                       )}
//                     </div>
//                   ))}
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">📸</span> Profile Photo *
//                     </label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button
//                         onClick={() => profilePhotoInputRef.current?.click()}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//                       >
//                         Upload
//                       </button>
//                       {documents.profilePhoto && (
//                         <button
//                           onClick={handleProfilePhotoDelete}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
//                         >
//                           Delete
//                         </button>
//                       )}
//                       <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Business Information */}
//               <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Business Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'agencyName', label: 'Agency Name *', emoji: '🏢' },
//                     { name: 'reraRegistrationNumber', label: 'RERA Registration Number', emoji: '📋' },
//                     { name: 'gstNumber', label: 'GST Number', emoji: '#️⃣' },
//                     { name: 'yearsOfExperience', label: 'Years of Experience *', emoji: '⭐' },
//                     { name: 'numberOfActiveListings', label: 'Number of Active Listings', emoji: '📊' },
//                   ].map((field) => (
//                     <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       <input
//                         type={field.name === 'yearsOfExperience' || field.name === 'numberOfActiveListings' ? 'number' : 'text'}
//                         name={field.name}
//                         value={editForm[field.name]}
//                         onChange={handleEditChange}
//                         className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                       />
//                     </div>
//                   ))}
//                   <div className="space-y-1 sm:space-y-1.5 w-full sm:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">🌍</span> Service Areas (City/Locality)
//                     </label>
//                     <input
//                       type="text"
//                       name="serviceAreas"
//                       value={editForm.serviceAreas}
//                       onChange={handleEditChange}
//                       className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                       placeholder="e.g. Mumbai, Pune, Navi Mumbai"
//                     />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full sm:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">📍</span> Office Address *
//                     </label>
//                     <textarea
//                       name="officeAddress"
//                       value={editForm.officeAddress}
//                       onChange={handleEditChange}
//                       rows="2"
//                       className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
//                       placeholder="Enter complete office address"
//                     />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">🏢</span> Agency Logo
//                     </label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button
//                         onClick={() => agencyLogoInputRef.current?.click()}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//                       >
//                         Upload
//                       </button>
//                       {documents.agencyLogo && (
//                         <button
//                           onClick={() => removeFile('agencyLogo')}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
//                         >
//                           Delete
//                         </button>
//                       )}
//                       <input ref={agencyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleAgencyLogoUpload} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Identity Verification */}
//               <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Identity Verification
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'aadhaarNumber', label: 'Aadhaar Number *', emoji: '🆔' },
//                     { name: 'panNumber', label: 'PAN Number *', emoji: '📄' },
//                   ].map((field) => (
//                     <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       <input
//                         type="text"
//                         name={field.name}
//                         value={editForm[field.name]}
//                         onChange={handleEditChange}
//                         className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                       />
//                     </div>
//                   ))}
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">📎</span> Upload Aadhaar Card *
//                     </label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button
//                         onClick={() => fileInputRefs.current['aadhaarCard']?.click()}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//                       >
//                         Upload
//                       </button>
//                       {documents.aadhaarCard && (
//                         <button
//                           onClick={() => handlePdfDelete('aadhaarCard')}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
//                         >
//                           Delete
//                         </button>
//                       )}
//                       <input
//                         ref={el => fileInputRefs.current['aadhaarCard'] = el}
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) handlePdfUpload('aadhaarCard', file);
//                           e.target.value = '';
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">📎</span> Upload PAN Card *
//                     </label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button
//                         onClick={() => fileInputRefs.current['panCard']?.click()}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//                       >
//                         Upload
//                       </button>
//                       {documents.panCard && (
//                         <button
//                           onClick={() => handlePdfDelete('panCard')}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
//                         >
//                           Delete
//                         </button>
//                       )}
//                       <input
//                         ref={el => fileInputRefs.current['panCard'] = el}
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) handlePdfUpload('panCard', file);
//                           e.target.value = '';
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">📎</span> Upload Business Registration Certificate
//                     </label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button
//                         onClick={() => fileInputRefs.current['businessRegistrationCertificate']?.click()}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//                       >
//                         Upload
//                       </button>
//                       {documents.businessRegistrationCertificate && (
//                         <button
//                           onClick={() => handlePdfDelete('businessRegistrationCertificate')}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
//                         >
//                           Delete
//                         </button>
//                       )}
//                       <input
//                         ref={el => fileInputRefs.current['businessRegistrationCertificate'] = el}
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) handlePdfUpload('businessRegistrationCertificate', file);
//                           e.target.value = '';
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                       <span className="text-sm sm:text-base">📎</span> Upload RERA Certificate
//                     </label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button
//                         onClick={() => fileInputRefs.current['reraCertificate']?.click()}
//                         className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
//                       >
//                         Upload
//                       </button>
//                       {documents.reraCertificate && (
//                         <button
//                           onClick={() => handlePdfDelete('reraCertificate')}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
//                         >
//                           Delete
//                         </button>
//                       )}
//                       <input
//                         ref={el => fileInputRefs.current['reraCertificate'] = el}
//                         type="file"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) handlePdfUpload('reraCertificate', file);
//                           e.target.value = '';
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Bank Details
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'accountHolderName', label: 'Account Holder Name', emoji: '👤' },
//                     { name: 'bankName', label: 'Bank Name', emoji: '🏦' },
//                     { name: 'accountNumber', label: 'Account Number', emoji: '💳' },
//                     { name: 'ifscCode', label: 'IFSC Code', emoji: '🔢' },
//                     { name: 'upiId', label: 'UPI ID', emoji: '📱' },
//                   ].map((field) => (
//                     <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       <input
//                         type="text"
//                         name={field.name}
//                         value={editForm[field.name]}
//                         onChange={handleEditChange}
//                         className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Social Media */}
//               <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Social Media & Website
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'website', label: 'Website', emoji: '🌐' },
//                     { name: 'facebookPage', label: 'Facebook Page', emoji: '📘' },
//                     { name: 'instagram', label: 'Instagram', emoji: '📸' },
//                     { name: 'linkedIn', label: 'LinkedIn', emoji: '💼' },
//                     { name: 'youtubeChannel', label: 'YouTube Channel', emoji: '▶️' },
//                   ].map((field) => (
//                     <div key={field.name} className="space-y-1 sm:space-y-1.5 w-full">
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       <input
//                         type="text"
//                         name={field.name}
//                         value={editForm[field.name]}
//                         onChange={handleEditChange}
//                         className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                         placeholder={field.name === 'website' ? 'www.example.com' : `${field.name}.com/yourhandle`}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Contact Information
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'officeAddress', label: 'Office Address *', emoji: '📍', textarea: true },
//                     { name: 'city', label: 'City *', emoji: '🏙️' },
//                     { name: 'district', label: 'District *', emoji: '🗺️' },
//                     { name: 'state', label: 'State *', emoji: '🌍' },
//                     { name: 'pinCode', label: 'PIN Code *', emoji: '📍' },
//                     { name: 'whatsappNumber', label: 'WhatsApp Number', emoji: '📱' },
//                   ].map((field) => (
//                     <div key={field.name} className={`space-y-1 sm:space-y-1.5 w-full ${field.textarea ? 'sm:col-span-2' : ''}`}>
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       {field.textarea ? (
//                         <textarea
//                           name={field.name}
//                           value={editForm[field.name]}
//                           onChange={handleEditChange}
//                           rows="2"
//                           className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
//                           placeholder="Enter complete office address"
//                         />
//                       ) : (
//                         <input
//                           type="text"
//                           name={field.name}
//                           value={editForm[field.name]}
//                           onChange={handleEditChange}
//                           className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Login Credentials */}
//               {/* <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
//                 <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//                   <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
//                     <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//                   </div>
//                   Login Credentials
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { name: 'username', label: 'Username *', emoji: '👤' },
//                     { name: 'emailAddressLogin', label: 'Email Address *', emoji: '✉️' },
//                     { name: 'mobileNumberLogin', label: 'Mobile Number *', emoji: '📱' },
//                     { name: 'password', label: 'Password *', emoji: '🔒', type: 'password' },
//                     { name: 'confirmPassword', label: 'Confirm Password *', emoji: '🔒', type: 'password' },
//                   ].map((field) => (
//                     <div key={field.name} className={`space-y-1 sm:space-y-1.5 w-full ${field.name === 'confirmPassword' ? 'sm:col-span-2' : ''}`}>
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
//                         <span className="text-sm sm:text-base">{field.emoji}</span> {field.label}
//                       </label>
//                       <input
//                         type={field.type || 'text'}
//                         name={field.name}
//                         value={editForm[field.name]}
//                         onChange={handleEditChange}
//                         className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div> */}
//             </div>
//             <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
//               <button 
//                 onClick={() => setShowEditModal(false)} 
//                 className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSave} 
//                 disabled={isLoading}
//                 className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                 )}
//                 {isLoading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Toast */}
//       {showSuccess && (
//         <div className="fixed top-20 sm:top-24 md:top-28 right-2 sm:right-4 z-50 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-2 border-[#00695C]/30 rounded-2xl p-2 sm:p-3 flex items-center gap-3 sm:gap-4 shadow-xl animate-slideDown max-w-xs sm:max-w-md backdrop-blur-sm">
//           <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 sm:p-3 rounded-2xl animate-bounce-in">
//             <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//           </div>
//           <div>
//             <p className="text-[#00695C] font-bold text-base sm:text-lg">Success!</p>
//             <p className="text-[#00695C]/80 text-[10px] sm:text-sm">Operation completed successfully!</p>
//           </div>
//           <button onClick={() => setShowSuccess(false)} className="text-[#00695C] hover:text-[#004D40] ml-auto hover:rotate-90 transition-transform duration-300 hover:scale-110">
//             <X className="w-4 h-4 sm:w-5 sm:h-5" />
//           </button>
//         </div>
//       )}

//       {/* Property Details Modal */}
//       {showPropertyDetails && selectedProperty && (
//         <PropertyDetailsModal 
//           property={selectedProperty} 
//           onClose={() => {
//             setShowPropertyDetails(false);
//             setSelectedProperty(null);
//           }}
//           onAddImages={handleAddPropertyImages}
//           onRemoveImage={handleRemovePropertyImage}
//           onToggleStatus={handleToggleStatus}
//           onEdit={handleEditProperty}
//           onDelete={handleDeleteProperty}
//         />
//       )}

//       {/* Edit Property Modal */}
//       {showEditPropertyModal && editingProperty && (
//         <EditPropertyModal
//           property={editingProperty}
//           onSave={handleSavePropertyEdit}
//           onCancel={() => {
//             setShowEditPropertyModal(false);
//             setEditingProperty(null);
//           }}
//         />
//       )}

//       {/* Delete Property Confirmation Modal */}
//       {showDeletePropertyConfirm && propertyToDelete && (
//         <DeletePropertyConfirmModal
//           property={propertyToDelete}
//           onConfirm={confirmDeleteProperty}
//           onCancel={() => {
//             setShowDeletePropertyConfirm(false);
//             setPropertyToDelete(null);
//           }}
//         />
//       )}

//       {/* Main Content */}
//       <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-full w-full relative z-10 -mt-12 sm:-mt-15">
//         {/* Header */}
//         <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 w-full animate-fade-up">
//           <div className="absolute inset-0 bg-gradient-to-r from-[#00695C]/[0.04] via-[#26A69A]/[0.06] to-[#00695C]/[0.04] rounded-2xl sm:rounded-3xl" />
//           <div className="absolute -top-16 -left-10 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
//           <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.2s' }} />
//           <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/50 to-transparent animate-shimmer pointer-events-none" />

//           <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full p-3 sm:p-4 md:p-5">
//             <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
//               <button
//                 onClick={handleNavigateBack}
//                 className="relative p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group border border-[#00695C]/10 overflow-hidden"
//                 aria-label="Go back"
//               >
//                 <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00695C]/0 to-[#26A69A]/0 group-hover:from-[#00695C]/10 group-hover:to-[#26A69A]/10 transition-all duration-300" />
//                 <ArrowLeft className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#00695C] group-hover:-translate-x-0.5 transition-all duration-300" />
//               </button>
//               <div>
//                 <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-2 sm:gap-3 relative">
//                   <div className="relative flex-shrink-0">
//                     <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] blur-lg opacity-40 animate-pulse-slow" />
//                     <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl border-2 border-[#26A69A]/30 animate-spin-slow" />
//                     <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
//                       <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                   </div>
//                   <span className="relative text-base sm:text-xl md:text-2xl lg:text-3xl">
//                     Agent Profile
//                     <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
//                   </span>
//                 </h1>
//                 <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1.5 ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
//                   <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#26A69A] animate-pulse" />
//                   <span className="hidden lg:inline">Manage your agent profile and property listings</span>
//                   <span className="inline lg:hidden">Manage your profile</span>
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowEditModal(true)}
//               className="relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group text-xs sm:text-sm overflow-hidden"
//             >
//               <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:left-full transition-all duration-700 ease-out" />
//               <Edit2 className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
//               <span className="relative">Edit Profile</span>
//             </button>
//           </div>
//         </div>

//         {/* Profile Card */}
//         <div className="relative bg-[#00695C]/5 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 w-full hover:shadow-2xl transition-all duration-500 border border-[#00695C]/20 overflow-hidden group">
//           <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#26A69A] to-transparent group-hover:left-full transition-all duration-[900ms] ease-out" />

//           <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
//           <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

//           <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl sm:rounded-2xl">
//             {Array.from({ length: 10 }).map((_, i) => (
//               <span
//                 key={i}
//                 className="absolute bottom-[-40px] rounded-full border border-white/50 animate-bubble"
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   width: `${4 + Math.random() * 10}px`,
//                   height: `${4 + Math.random() * 10}px`,
//                   background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(38,166,154,0.35) 60%, rgba(0,105,92,0.15) 100%)',
//                   animationDuration: `${6 + Math.random() * 6}s`,
//                   animationDelay: `${Math.random() * 8}s`,
//                 }}
//               />
//             ))}
//           </div>

//           <button
//             onClick={handleDownloadInvoice}
//             title="Download Invoice PDF"
//             className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-md hover:shadow-lg hover:from-[#005A4F] hover:to-[#1B9E8E] hover:scale-105 transition-all duration-300"
//           >
//             <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//             <span className="hidden lg:inline">Download Invoice</span>
//           </button>

//           <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-6 w-full relative z-10">
//             <div className="relative flex-shrink-0">
//               <div className="absolute -inset-0.5 sm:-inset-1 rounded-[20px] sm:rounded-[24px] animate-spin-slow"
//                 style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }} />
//               <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-3 sm:ring-4 ring-white/60">
//                 {documents.profilePhoto ? (
//                   <img src={URL.createObjectURL(documents.profilePhoto)} alt={editForm.fullName} className="w-full h-full object-cover" />
//                 ) : (
//                   <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
//                     {editForm.fullName.charAt(0)}
//                   </span>
//                 )}
//               </div>

//               {documents.profilePhoto && (
//                 <button onClick={handleProfilePhotoDelete}
//                   className="absolute top-0 right-0 p-1 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
//                   aria-label="Delete profile photo" title="Delete Profile Photo">
//                   <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                 </button>
//               )}

//               <button onClick={() => profilePhotoInputRef.current?.click()}
//                 className="absolute bottom-0 right-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
//                 aria-label="Upload profile photo" title="Upload Profile Photo">
//                 <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               </button>
//               <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
//             </div>

//             <div className="flex-1 text-center md:text-left w-full">
//               <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editForm.fullName}</h2>
//                 <span className="text-[10px] sm:text-xs text-[#00695C] font-medium bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200">
//                   Agent ID: #AGT-{editForm.mobileNumber?.slice(-4) || '0000'}
//                 </span>
//                 <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold">
//                   Verified Agent
//                   <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
//                 </span>
//               </div>

//               <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
//                   <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.agencyName}
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
//                   <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.city}, {editForm.state}
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
//                   <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.mobileNumber}
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.35s' }}>
//                   <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.yearsOfExperience} Years Exp.
//                 </span>
//               </div>

//               <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.45s' }}>
//                   <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                   <span>{editForm.numberOfActiveListings} Active Listings</span>
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.55s' }}>
//                   <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                   <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">{editForm.serviceAreas}</span>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-1.5 sm:p-2 mb-4 sm:mb-6 border border-[#00695C]/20 w-full overflow-x-auto">
//           <div className="flex gap-1 sm:gap-1.5 min-w-max">
//             {sections.map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeSection === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveSection(tab.id)}
//                   className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs transition-all duration-500 whitespace-nowrap relative group ${
//                     isActive
//                       ? 'text-white shadow-lg transform scale-105'
//                       : 'text-gray-600 hover:text-[#00695C]'
//                   }`}
//                   style={{
//                     background: isActive
//                       ? `linear-gradient(135deg, #00695C, #26A69A)`
//                       : 'transparent'
//                   }}
//                 >
//                   {isActive && (
//                     <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg animate-pulse-slow" />
//                   )}
//                   <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
//                     <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
//                     <span className="hidden lg:inline">{tab.title}</span>
//                     <span className="inline lg:hidden">{tab.title.split(' ')[0]}</span>
//                     {isActive && (
//                       <span className="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-ping" />
//                     )}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-[#00695C]/20 w-full relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
//           <div className="relative z-10">
//             {renderSectionContent()}
//           </div>
//         </div>

//         {/* Properties Section */}
//         {renderPropertiesSection()}
//       </div>

//       {/* Styles */}
//       <style>{`
//         @keyframes slideDown {
//           from { opacity: 0; transform: translateY(-20px) scale(0.95); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px) scale(0.95); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: scale(0.9); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         @keyframes scaleIn {
//           from { opacity: 0; transform: scale(0.8); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes floatDelayed {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-15px) rotate(-5deg); }
//         }
//         @keyframes pulseSlow {
//           0%, 100% { transform: scale(1); opacity: 0.3; }
//           50% { transform: scale(1.1); opacity: 0.5; }
//         }
//         @keyframes bounceIn {
//           0% { opacity: 0; transform: scale(0.3); }
//           50% { opacity: 1; transform: scale(1.05); }
//           70% { transform: scale(0.9); }
//           100% { transform: scale(1); }
//         }
//         @keyframes bubbleRise {
//           0%   { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; }
//           8%   { opacity: .55; }
//           85%  { opacity: .35; }
//           100% { transform: translateY(-380px) translateX(var(--drift, 18px)) scale(1); opacity: 0; }
//         }
//         @keyframes spinSlow { to { transform: rotate(360deg); } }
//         @keyframes shimmerSweep { 0% { left: -60%; } 50%, 100% { left: 130%; } }
//         @keyframes underlineGrow { 0% { transform: scaleX(0); } 60% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
//         @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px) scale(0.95); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }

//         .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
//         .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
//         .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite; }
//         .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
//         .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
//         .animate-bubble { animation-name: bubbleRise; animation-timing-function: linear; animation-iteration-count: infinite; }
//         .animate-spin-slow { animation: spinSlow 6s linear infinite; }
//         .animate-shimmer { animation: shimmerSweep 3.2s ease-in-out infinite; }
//         .animate-underline-grow { animation: underlineGrow 1.2s ease-out 0.6s forwards; }
//         .animate-rise { opacity: 0; animation: riseIn 0.5s ease forwards; }
//         .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; opacity: 0; }

//         .border-3 {
//           border-width: 3px;
//         }
//         .focus\\:ring-3 {
//           --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
//           --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
//           box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
//         }

//         @media (min-width: 480px) {
//           .xs\\:inline { display: inline; }
//         }
//         @media (max-width: 479px) {
//           .xs\\:inline { display: none; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AgentProfile;