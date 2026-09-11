
import React, { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, Calendar, MapPin, Building, Building2,
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
  Search, Filter, Grid as GridIcon, List,
  Eye as ViewIcon, Bed, Bath, Trees, Wifi,
  ChevronLeft, ChevronRight,
  File, FolderOpen, FileImage, FileSpreadsheet, ImagePlus,
  BriefcaseBusiness, Store, Globe2, Hash, IdCard, BadgeCheck,
  Share2, UsersRound, TrendingUp, PieChart,
  BarChart3, Activity, PenTool, Lock
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
    sm: { container: 'w-7 h-3.5 sm:w-8 sm:h-4', circle: 'w-2.5 h-2.5 sm:w-3 sm:h-3', translate: 'translate-x-3.5 sm:translate-x-4' },
    md: { container: 'w-9 h-4.5 sm:w-10 sm:h-5', circle: 'w-3.5 h-3.5 sm:w-4 sm:h-4', translate: 'translate-x-4.5 sm:translate-x-5' },
    lg: { container: 'w-11 h-5.5 sm:w-12 sm:h-6', circle: 'w-4.5 h-4.5 sm:w-5 sm:h-5', translate: 'translate-x-5.5 sm:translate-x-6' },
  };
  const s = sizes[size] || sizes.sm;
  return (
    <button
      type="button"
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 ${isOn ? 'bg-[#00695C]' : 'bg-gray-300'} ${s.container}`}
      onClick={onToggle}
      role="switch"
      aria-checked={isOn}
    >
      <span className={`pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${isOn ? s.translate : 'translate-x-0'} ${s.circle}`} />
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
          <button onClick={onClose} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-3 md:p-4 lg:p-6">
          <embed src={fileUrl} type="application/pdf" className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]" />
        </div>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 flex-shrink-0">
          <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-full">{fileName}</span>
          <button onClick={() => window.open(fileUrl, '_blank')} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 bg-[#00695C] text-white rounded-xl text-[10px] sm:text-xs md:text-sm lg:text-base font-bold hover:bg-[#005A4F] transition-all duration-300 w-full sm:w-auto justify-center">
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
        <button onClick={onClose} className="absolute -top-8 sm:-top-10 right-0 text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110">
          <X className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
        {items.length > 1 && (
          <button onClick={goPrev} className="absolute left-1 sm:-left-14 md:-left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10">
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
              <button onClick={onDelete} title="Delete this file" className="flex items-center gap-0.5 sm:gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] md:text-[11px] font-bold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                <Trash2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
        {items.length > 1 && (
          <button onClick={goNext} className="absolute right-1 sm:-right-14 md:-right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10">
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============ DELETE CONFIRM MODAL ============
const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4 md:p-6">
    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{message}</p>
      <div className="flex justify-end gap-2 sm:gap-3">
        <button onClick={onCancel} className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ============ PROPERTY DETAILS MODAL ============
const PropertyDetailsModal = ({ property, onClose, onAddImages, onRemoveImage, onToggleStatus, onEdit, onDelete }) => {
  if (!property) return null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailImageInputRef = useRef(null);
  const rawImages = property.images || [];
  const hasImages = rawImages.length > 0;
  const images = hasImages ? rawImages : ['https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'];

  useEffect(() => {
    if (currentImageIndex >= images.length) setCurrentImageIndex(Math.max(0, images.length - 1));
  }, [images.length]);

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

  const handleAddImagesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) onAddImages(property.id, files);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-2xl h-[80vh] flex flex-col animate-scaleIn">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <h2 className="text-white text-base sm:text-lg md:text-xl font-bold truncate">{property.name}</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64">
            <img src={images[currentImageIndex]} alt={property.name} className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'; }} />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-black/60 text-white text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
            {hasImages && (
              <button onClick={() => onRemoveImage(property.id, currentImageIndex)} title="Delete this image"
                className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Delete
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
              {hasImages ? `${images.length} image${images.length > 1 ? 's' : ''}` : 'No images uploaded yet'}
            </p>
            <button onClick={() => detailImageInputRef.current?.click()} className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Add Image
            </button>
            <input ref={detailImageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAddImagesChange} />
          </div>

          {images.length > 1 && (
            <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-1.5">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-12 sm:w-14 md:w-16 h-9 sm:h-10 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'}`}>
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'; }} />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
            {[
              { icon: Building2, label: 'Property ID', value: property.id },
              { icon: CreditCard, label: 'Price', value: property.price },
              { icon: Bed, label: 'Bedrooms', value: property.bedrooms || 'N/A' },
              { icon: Bath, label: 'Bathrooms', value: property.bathrooms || 'N/A' },
              { icon: MapPin, label: 'Location', value: property.location },
              { icon: Calendar, label: 'Posted', value: property.postedDate },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
                  <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate">{item.value}</p>
                </div>
              </div>
            ))}
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
                {property.features.map((f, i) => (
                  <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#00695C]/10 text-[#00695C] rounded-lg text-[9px] sm:text-[10px] font-bold">{f}</span>
                ))}
              </div>
            </div>
          )}

          {property.selectedAmenities && property.selectedAmenities.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Amenities</h3>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {property.selectedAmenities.map((a, i) => (
                  <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] sm:text-[10px] font-bold">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-wrap gap-2 sm:gap-2.5 flex-shrink-0">
          <button onClick={() => { onClose(); onEdit(property); }} className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2">
            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit Property
          </button>
          <button onClick={() => { onClose(); onDelete(property); }} className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2">
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ HELPERS ============
const availableAmenities = [
  "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance",
  "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center",
  "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
  "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
];
const yesNoOptions = ["Yes", "No"];
const listingPurposeOptions = [
  { value: 'rent', label: 'For Rent' },
  { value: 'sale', label: 'For Sale' },
  { value: 'lease', label: 'For Lease' }
];
const propertyTypeOptions = ["Independent House", "Independent Villa", "Duplex Residential Unit", "Apartment", "Commercial", "Land"];
const furnishingOptions = ["Full Furnish", "Semi Furnish", "Unfurnished"];
const rentalDurationOptions = ["Short Term", "Long Term", "Flexible"];
const occupancyOptions = ["Single", "Family", "Bachelors", "Company Lease"];

// ============ EDIT PROPERTY MODAL ============
const EditPropertyModal = ({ property, onSave, onCancel }) => {
  if (!property) return null;
  const editSteps = ['Property Details', 'Pricing & Amenities', 'Media Upload'];

  const [localStep, setLocalStep] = useState(0);
  const [p, setP] = useState({ ...property });
  const [localCustomAmenities, setLocalCustomAmenities] = useState(() => {
    const sel = property.selectedAmenities || [];
    return sel.filter(a => !availableAmenities.includes(a));
  });

  const [imagePreviews, setImagePreviews] = useState(property.images || []);
  const [coverPreview, setCoverPreview] = useState(property.coverImage || (property.images && property.images[0]) || null);
  const [videoPreview, setVideoPreview] = useState(property.propertyVideo || null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(property.floorPlan || null);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [floorPlanFile, setFloorPlanFile] = useState(null);

  const update = (field, value) => setP(prev => ({ ...prev, [field]: value }));

  const toggleAmenity = (amenity) => {
    const current = p.selectedAmenities || [];
    if (current.includes(amenity)) update('selectedAmenities', current.filter(a => a !== amenity));
    else update('selectedAmenities', [...current, amenity]);
  };

  const addCustomAmenity = () => {
    const val = (p.otherAmenities || '').trim();
    if (val && !(p.selectedAmenities || []).includes(val) && !localCustomAmenities.includes(val)) {
      setLocalCustomAmenities(prev => [...prev, val]);
      update('selectedAmenities', [...(p.selectedAmenities || []), val]);
      update('otherAmenities', '');
    }
  };

  const removeCustomAmenity = (amenity) => {
    setLocalCustomAmenities(prev => prev.filter(a => a !== amenity));
    update('selectedAmenities', (p.selectedAmenities || []).filter(a => a !== amenity));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remaining = Math.max(0, 3 - imagePreviews.length);
    if (files.length > remaining) alert(`You can only upload ${remaining} more image(s). Maximum 3 images allowed.`);
    const limited = files.slice(0, remaining);
    const previews = limited.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
    setNewImageFiles(prev => [...prev, ...limited]);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Cover image must be less than 2MB'); return; }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    e.target.value = '';
  };
  const removeCover = () => { setCoverFile(null); setCoverPreview(null); };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('Video must be less than 10MB'); return; }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };
  const removeVideo = () => { setVideoFile(null); setVideoPreview(null); };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Floor plan must be a PDF file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Floor plan must be less than 5MB'); return; }
    setFloorPlanFile(file);
    setFloorPlanPreview(file.name);
    e.target.value = '';
  };
  const removeFloorPlan = () => { setFloorPlanFile(null); setFloorPlanPreview(null); };

  const handleSave = () => {
    let finalImages = [...imagePreviews];
    if (newImageFiles.length > 0) finalImages = [...finalImages, ...newImageFiles.map(f => URL.createObjectURL(f))];
    const updated = { ...p, images: finalImages };
    if (coverFile) updated.coverImage = URL.createObjectURL(coverFile);
    if (videoFile) updated.propertyVideo = URL.createObjectURL(videoFile);
    if (floorPlanFile) updated.floorPlan = floorPlanFile;
    onSave(updated);
  };

  const renderStep = () => {
    if (localStep === 0) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title / Name</label>
              <input type="text" value={p.name || ''} onChange={(e) => update('name', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. Green Valley 3BHK Apartment" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property ID</label>
              <input type="text" value={p.id} disabled className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
            <div className="space-y-1.5">
              {propertyTypeOptions.map(type => (
                <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="edit-ptype" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.type === type} onChange={() => update('type', type)} />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
            <textarea value={p.location || ''} onChange={(e) => update('location', e.target.value)} rows="2"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
              placeholder="Enter complete property address" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">City</label>
            <input type="text" value={p.propertyCity || ''} onChange={(e) => update('propertyCity', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="Enter city name" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Details</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={p.builtUpArea || ''} onChange={(e) => update('builtUpArea', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Build-up Area (sq ft)" />
              <input type="number" value={p.carpetArea || ''} onChange={(e) => update('carpetArea', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Carpet Area (sq ft)" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
              <input type="number" value={p.bedrooms || ''} onChange={(e) => update('bedrooms', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Number of bedrooms" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
              <input type="number" value={p.bathrooms || ''} onChange={(e) => update('bathrooms', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Number of bathrooms" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
            <div className="space-y-1.5">
              {furnishingOptions.map(f => (
                <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="edit-furnish" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.furnishing === f} onChange={() => update('furnishing', f)} />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking Facility</label>
            <div className="flex gap-4">
              {yesNoOptions.map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="edit-parking" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={(p.parking || '').toLowerCase() === opt.toLowerCase()} onChange={() => update('parking', opt.toLowerCase())} />
                  {opt === 'Yes' ? 'Yes, available' : 'No parking'}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Rental Duration</label>
            <div className="space-y-1.5">
              {rentalDurationOptions.map(d => (
                <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="edit-duration" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.rentalDuration === d} onChange={() => update('rentalDuration', d)} />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Occupancy Details</label>
            <div className="space-y-1.5">
              {occupancyOptions.map(o => (
                <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="edit-occupancy" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.occupancyDetails === o} onChange={() => update('occupancyDetails', o)} />
                  {o}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'petFriendly', label: 'Pet Friendly' },
              { key: 'gardenSpace', label: 'Garden Space' },
              { key: 'terrace', label: 'Terrace / Balcony' },
            ].map(row => (
              <div key={row.key}>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">{row.label}</label>
                <div className="flex gap-3">
                  {yesNoOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input type="radio" name={`edit-${row.key}`} className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={p[row.key] === opt} onChange={() => update(row.key, opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
            <select value={p.status || 'Active'} onChange={(e) => update('status', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
            <textarea value={p.description || ''} onChange={(e) => update('description', e.target.value)} rows="3"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
              placeholder="Enter property description..." />
          </div>
        </div>
      );
    } else if (localStep === 1) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
            <div className="flex flex-wrap gap-4">
              {listingPurposeOptions.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="edit-purpose" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.listingPurpose === opt.value || p.listingPurpose === opt.label} onChange={() => update('listingPurpose', opt.value)} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Expected Rent (₹/month)</label>
            <input type="text" value={p.expectedPrice || ''} onChange={(e) => update('expectedPrice', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="e.g. 15,000" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Budget Range (₹/month)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Min" value={p.budgetRange?.min || ''} onChange={(e) => update('budgetRange', { ...p.budgetRange, min: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" />
              <input type="number" placeholder="Max" value={p.budgetRange?.max || ''} onChange={(e) => update('budgetRange', { ...p.budgetRange, max: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="edit-priceType" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.priceType === 'fixed'} onChange={() => update('priceType', 'fixed')} />
                Fixed Price
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="edit-priceType" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.priceType === 'negotiable'} onChange={() => update('priceType', 'negotiable')} />
                Negotiable
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance Charges (₹/month)</label>
            <input type="text" value={p.maintenance || ''} onChange={(e) => update('maintenance', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Enter monthly maintenance" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
            <input type="date" value={p.availableFrom || ''} onChange={(e) => update('availableFrom', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Select Amenities</label>
            <div className="flex flex-wrap gap-1.5">
              {availableAmenities.map(a => (
                <span key={a} onClick={() => toggleAmenity(a)}
                  className={`px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${(p.selectedAmenities || []).includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
                  {a}
                </span>
              ))}
              {localCustomAmenities.map(a => (
                <span key={a} className="px-2.5 py-1 text-xs bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
                  {a}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Other Amenities</label>
            <div className="flex gap-2">
              <input type="text" value={p.otherAmenities || ''} onChange={(e) => update('otherAmenities', e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. Clubhouse, CCTV, Solar Panel..." onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
              <button onClick={addCustomAmenity} className="px-4 py-2 text-sm bg-[#00695C] text-white rounded-xl hover:bg-[#005A4F] transition-colors">Add</button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
            <input type="text" value={(p.features || []).join(', ')}
              onChange={(e) => update('features', e.target.value.split(',').map(f => f.trim()))}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="2 BHK, Sea View, Parking, etc." />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-50">
            <div className="w-1 h-4 bg-[#00695C] rounded" />
            <h3 className="text-sm font-bold text-[#00695C]">Property Media</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">📸 Upload property images and media</p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Cover Image</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" className="hidden" id="edit-cover" onChange={handleCoverUpload} />
              <label htmlFor="edit-cover" className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Cover Image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
              </label>
            </div>
            {coverPreview && (
              <div className="mt-2 relative">
                <img src={coverPreview} alt="Cover" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                <button onClick={removeCover} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Photos (Max 3)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" id="edit-photos" onChange={handleImageUpload} disabled={imagePreviews.length >= 3} />
              <label htmlFor="edit-photos" className={`cursor-pointer flex flex-col items-center ${imagePreviews.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Property Photos</span>
                <span className="text-xs text-gray-400 mt-1">Max 3 photos</span>
              </label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                    <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">{imagePreviews.length}/3 images uploaded</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Video (Optional)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="video/mp4,video/mov" className="hidden" id="edit-video" onChange={handleVideoUpload} />
              <label htmlFor="edit-video" className="cursor-pointer flex flex-col items-center">
                <Video className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Property Video Tour</span>
                <span className="text-xs text-gray-400 mt-1">MP4/MOV (Max 10MB)</span>
              </label>
            </div>
            {videoPreview && (
              <div className="mt-2 relative">
                <video src={videoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                <button onClick={removeVideo} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Floor Plan</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept=".pdf" className="hidden" id="edit-floorplan" onChange={handleFloorPlanUpload} />
              <label htmlFor="edit-floorplan" className="cursor-pointer flex flex-col items-center">
                <Home className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Floor Plan</span>
                <span className="text-xs text-gray-400 mt-1">PDF only (Max 5MB)</span>
              </label>
            </div>
            {floorPlanPreview && (
              <div className="mt-2 relative flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                <FileText className="w-4 h-4 text-[#00695C] flex-shrink-0" />
                <span className="text-xs text-gray-700 font-medium truncate flex-1">{floorPlanPreview}</span>
                <button onClick={removeFloorPlan} className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 flex-shrink-0">✕</button>
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
          <button onClick={onCancel} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex border-b border-gray-100 flex-shrink-0 px-3 sm:px-4 pt-2 overflow-x-auto">
          {editSteps.map((stepName, idx) => (
            <button key={idx} onClick={() => setLocalStep(idx)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${localStep === idx ? 'border-[#00695C] text-[#00695C]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {stepName}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{renderStep()}</div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
          <div className="flex gap-2">
            {localStep > 0 && (
              <button onClick={() => setLocalStep(localStep - 1)} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#00695C] bg-teal-50 rounded-xl hover:bg-teal-100 transition-all">
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button onClick={onCancel} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300">
              Cancel
            </button>
            {localStep < editSteps.length - 1 ? (
              <button onClick={() => setLocalStep(localStep + 1)} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2">
                Next →
              </button>
            ) : (
              <button onClick={handleSave} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2">
                <Save className="w-3 h-3 sm:w-4 sm:h-4" /> Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ BUILDER PROFILE COMPONENT ============
const BuilderProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('company');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const companyLogoInputRef = useRef(null);
  const fileInputRefs = useRef({});

  // ============ PROPERTIES STATE ============
  const [properties, setProperties] = useState([
    {
      id: 'PROJ-001',
      name: 'Skyline Heights Tower A',
      type: 'Apartment',
      status: 'Active',
      price: '₹18,000/month',
      area: '1450 sq ft',
      location: 'Baner, Pune, Maharashtra',
      postedDate: '12-06-2025',
      description: 'Premium 3 BHK residences with clubhouse, landscaped gardens, and skyline views.',
       images: [
        '/villa1_1.png',
        '/villa1_2.png',
        '/villa1_3.png',
        '/villa1_4.png'
      ],
      features: ['3 BHK', 'Clubhouse', 'Landscaped Garden', 'Skyline View'],
      views: 412,
      inquiries: 26,
      bedrooms: '3',
      bathrooms: '3',
      furnishing: 'Semi Furnish',
      parking: 'yes',
      listingPurpose: 'rent',
      expectedPrice: '18000',
      priceType: 'negotiable',
      maintenance: '4000',
      availableFrom: '2025-08-01',
      selectedAmenities: ['Gated Community', '24/7 Security', 'Gym / Fitness Center', 'Swimming Pool'],
      propertyCity: 'Pune',
      builtUpArea: '1450',
      carpetArea: '1280',
      rentalDuration: 'Long Term',
      occupancyDetails: 'Family',
      petFriendly: 'Yes',
      gardenSpace: 'Yes',
      terrace: 'Yes',
    },
    {
      id: 'PROJ-002',
      name: 'Emerald Business Park',
      type: 'Commercial',
      status: 'Active',
      price: '₹85,000/month',
      area: '2200 sq ft',
      location: 'Whitefield, Bangalore, Karnataka',
      postedDate: '02-05-2025',
      description: 'Grade-A office space with modern infrastructure and ample parking.',
      images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Emerald+Business+Park'],
      features: ['Grade-A Office', '24/7 Power Backup', 'Ample Parking'],
      views: 268,
      inquiries: 14,
      bedrooms: '0',
      bathrooms: '4',
      furnishing: 'Unfurnished',
      parking: 'yes',
      listingPurpose: 'rent',
      expectedPrice: '85000',
      priceType: 'fixed',
      maintenance: '12000',
      availableFrom: '2025-07-01',
      selectedAmenities: ['24/7 Security', 'Power Backup', 'CCTV Surveillance', 'Lift / Elevator'],
      propertyCity: 'Bangalore',
      builtUpArea: '2200',
      carpetArea: '2000',
      rentalDuration: 'Long Term',
      occupancyDetails: 'Company Lease',
      petFriendly: 'No',
      gardenSpace: 'No',
      terrace: 'No',
    },
    {
      id: 'PROJ-003',
      name: 'Palm Meadows Villas',
      type: 'Independent Villa',
      status: 'Inactive',
      price: '₹65,000/month',
      area: '3200 sq ft',
      location: 'ECR, Chennai, Tamil Nadu',
      postedDate: '20-04-2025',
      description: 'Gated villa community with private gardens and clubhouse access.',
      images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Palm+Meadows'],
      features: ['4 BHK', 'Private Garden', 'Clubhouse Access'],
      views: 189,
      inquiries: 9,
      bedrooms: '4',
      bathrooms: '4',
      furnishing: 'Full Furnish',
      parking: 'yes',
      listingPurpose: 'rent',
      expectedPrice: '65000',
      priceType: 'negotiable',
      maintenance: '6000',
      availableFrom: '2025-09-01',
      selectedAmenities: ['Gated Community', 'Garden', 'Swimming Pool', 'Smart Home'],
      propertyCity: 'Chennai',
      builtUpArea: '3200',
      carpetArea: '2900',
      rentalDuration: 'Flexible',
      occupancyDetails: 'Family',
      petFriendly: 'Yes',
      gardenSpace: 'Yes',
      terrace: 'Yes',
    },
  ]);

  // ============ FORM STATE ============
  const [editForm, setEditForm] = useState({
    // Company Details
    companyName: 'Sharma Infra Developers Pvt. Ltd.',
    companyRegNumber: 'CIN/U45200MH2015PTC123456',
    reraNumber: 'RERA/2025/MH/98765',
    gstNumber: '22ABCDE1234F1Z5',
    yearsOfExperience: '14',
    companyWebsite: 'www.sharmainfra.com',
    companyProfile: 'Sharma Infra Developers is a Mumbai-based real estate builder delivering residential and commercial projects across Maharashtra since 2011, known for timely delivery and RERA-compliant construction.',

    // Authorized Person
    authFullName: 'Rohit Sharma',
    authDesignation: 'Director',
    authMobile: '+91 98765 43210',
    authEmail: 'rohit.sharma@sharmainfra.com',
    authWhatsapp: '+91 98765 43211',

    // Office Address
    officeAddress: 'Office No. 501, Crystal Tower, Andheri East, Mumbai - 400093',
    officeCity: 'Mumbai',
    officeDistrict: 'Mumbai City',
    officeState: 'Maharashtra',
    officePinCode: '400093',
    officeLandmark: 'Near Andheri Metro Station',

    // Identity & Business Verification
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',

    // Project Details
    ongoingProjects: '6',
    completedProjects: '22',
    upcomingProjects: '3',
    totalUnitsDelivered: '3800',
    citiesOfOperation: 'Mumbai, Pune, Nashik',
    serviceLocations: 'Andheri, Baner, Whitefield, ECR Chennai',

    // Bank Details
    accountHolderName: 'Sharma Infra Developers Pvt. Ltd.',
    bankName: 'HDFC Bank',
    accountNumber: '123456789012',
    ifscCode: 'HDFC0001234',
    upiId: 'sharmainfra@upi',

    // Social Media
    website: 'www.sharmainfra.com',
    facebookPage: 'facebook.com/sharmainfra',
    instagram: 'instagram.com/sharmainfra',
    linkedIn: 'linkedin.com/company/sharmainfra',
    youtubeChannel: 'youtube.com/sharmainfra',
  });

  // ============ DOCUMENTS STATE ============
  const [documents, setDocuments] = useState({
    profilePhoto: null,
    companyLogo: null,
    aadhaarCard: null,
    panCard: null,
    companyRegCert: null,
    gstCert: null,
    reraCert: null,
    companyPanCard: null,
    companyBrochure: null,
    projectBrochure: null,
    authIdProof: null,
    officeAddressProof: null,
  });

  const fetchBuilderProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyProfile("builder");
      console.log("✅ Profile data loaded:", response);

      // Extract data from response
      const profileData = response?.profile || {};
      const propertiesData = response?.properties || [];

      // ============ 1. SET EDIT FORM (Builder Profile Data) ============
      setEditForm({
        // Company Details
        companyName: profileData.companyName || profileData.builderName || '',
        companyRegNumber: profileData.companyRegNumber || profileData.companyRegistrationNumber || '',
        reraNumber: profileData.reraRegistrationNumber || profileData.reraNumber || '',
        gstNumber: profileData.gstNumber || '',
        yearsOfExperience: profileData.yearsOfExperience || profileData.experience || '',
        companyWebsite: profileData.companyWebsite || profileData.website || '',
        companyProfile: profileData.companyProfile || profileData.companyDescription || '',

        // Authorized Person
        authFullName: profileData.fullName || profileData.authFullName || profileData.contactPerson || '',
        authDesignation: profileData.authDesignation || profileData.designation || '',
        authMobile: profileData.authMobile || profileData.mobile || '',
        authEmail: profileData.authEmail || profileData.email || '',
        authWhatsapp: profileData.authWhatsapp || profileData.whatsappNumber || '',

        // Office Address
        officeAddress: profileData.officeAddress || profileData.address || '',
        officeCity: profileData.city || '',
        officeDistrict: profileData.district || '',
        officeState: profileData.state || '',
        officePinCode: profileData.pincode || '',
        officeLandmark: profileData.landmark || '',

        // Identity & Business Verification
        aadhaarNumber: profileData.aadhaarNumber || '',
        panNumber: profileData.panNumber || '',

        // Project Details
        ongoingProjects: profileData.ongoingProjects || '',
        completedProjects: profileData.completedProjects || '',
        upcomingProjects: profileData.upcomingProjects || '',
        totalUnitsDelivered: profileData.totalUnitsDelivered || '',
        citiesOfOperation: profileData.citiesOfOperation || '',
        serviceLocations: profileData.serviceLocations || '',

        // Bank Details
        accountHolderName: profileData.accountHolderName || '',
        bankName: profileData.bankName || '',
        accountNumber: profileData.accountNumber || '',
        ifscCode: profileData.ifscCode || '',
        upiId: profileData.upiId || '',

        // Social Media
        website: profileData.website || '',
        facebookPage: profileData.facebookPage || profileData.facebook || '',
        instagram: profileData.instagram || '',
        linkedIn: profileData.linkedIn || profileData.linkedin || '',
        youtubeChannel: profileData.youtubeChannel || profileData.youtube || '',
      });

      // ============ 2. SET PROPERTIES ============
      const formattedProperties = propertiesData.map(mapPropertyToFrontend);
      setProperties(formattedProperties);

      // ============ 3. SET DOCUMENTS ============
      // Get profile photo and company logo from profile data
      const profilePhotoUrl = profileData.profilePhoto || profileData.profilePhotoUrl || null;
      const companyLogoUrl = profileData.companyLogo || profileData.companyLogoUrl || null;

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

        // Extract documents
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
        companyLogo: companyLogoUrl,

        // Identity Documents
        aadhaarCard: null,
        panCard: null,

        // Business Documents
        companyRegCert: null,
        gstCert: null,
        reraCert: null,
        companyPanCard: null,
        companyBrochure: null,
        projectBrochure: null,

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

      console.log('✅ Builder profile data loaded successfully');

    } catch (error) {
      console.error('❌ Error fetching builder profile data:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ USE EFFECT ============
  useEffect(() => {
    fetchBuilderProfileData();
  }, []);

  // ============ NAVIGATION ============

  useEffect(() => {
    fetchBuilderProfileData();
  }, []);

  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ============ FILE UPLOAD HANDLERS ============
  const handleFileUpload = async (field, file) => {
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadDocument({
          role: 'builder',
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
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadProfilePhoto('builder', file);
        console.log('✅ Photo uploaded:', response);

        if (response.data?.fileUrl) {
          setDocuments(prev => ({
            ...prev,
            profilePhoto: response.data.fileUrl
          }));
          showSuccessToast();
          await fetchBuilderProfileData();
        }
      } catch (error) {
        console.error('❌ Error uploading profile photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCompanyLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadDocument({
          role: 'builder',
          field: 'companyLogo',
          file: file,
          propertyId: null
        });
        console.log('✅ Company logo uploaded:', response);
        showSuccessToast();
        await fetchBuilderProfileData();
      } catch (error) {
        console.error('❌ Error uploading company logo:', error);
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
            role: 'builder',
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
          role: 'builder',
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
      await deleteProfilePhoto('builder');
      setDocuments(prev => ({
        ...prev,
        profilePhoto: null
      }));
      if (profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = '';
      }
      setShowProfilePhotoDeleteConfirm(false);
      showSuccessToast();
      await fetchBuilderProfileData();
    } catch (error) {
      console.error('❌ Error deleting profile photo:', error);
      alert('Failed to delete photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ INVOICE PDF HANDLER ============
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // ============ NAVIGATION ============
  const handleNavigateBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/dashboard');
  };

  // ============ SAVE HANDLER ============
  const handleSave = async () => {
    const requiredFields = ['companyName', 'companyRegNumber', 'reraNumber', 'authFullName', 'authMobile', 'authEmail', 'aadhaarNumber', 'panNumber'];
    const missingFields = requiredFields.filter(field => !editForm[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const profileData = {
        companyName: editForm.companyName,
        companyRegNumber: editForm.companyRegNumber,
        reraNumber: editForm.reraNumber,
        gstNumber: editForm.gstNumber,
        yearsOfExperience: editForm.yearsOfExperience,
        companyWebsite: editForm.companyWebsite,
        companyProfile: editForm.companyProfile,
        authFullName: editForm.authFullName,
        authDesignation: editForm.authDesignation,
        authMobile: editForm.authMobile,
        authEmail: editForm.authEmail,
        authWhatsapp: editForm.authWhatsapp,
        officeAddress: editForm.officeAddress,
        officeCity: editForm.officeCity,
        officeDistrict: editForm.officeDistrict,
        officeState: editForm.officeState,
        officePinCode: editForm.officePinCode,
        officeLandmark: editForm.officeLandmark,
        aadhaarNumber: editForm.aadhaarNumber,
        panNumber: editForm.panNumber,
        ongoingProjects: editForm.ongoingProjects,
        completedProjects: editForm.completedProjects,
        upcomingProjects: editForm.upcomingProjects,
        totalUnitsDelivered: editForm.totalUnitsDelivered,
        citiesOfOperation: editForm.citiesOfOperation,
        serviceLocations: editForm.serviceLocations,
        accountHolderName: editForm.accountHolderName,
        bankName: editForm.bankName,
        accountNumber: editForm.accountNumber,
        ifscCode: editForm.ifscCode,
        upiId: editForm.upiId,
        website: editForm.website,
        facebookPage: editForm.facebookPage,
        instagram: editForm.instagram,
        linkedIn: editForm.linkedIn,
        youtubeChannel: editForm.youtubeChannel,
      };

      await updateMyProfile('builder', profileData);
      setShowEditModal(false);
      showSuccessToast();
      await fetchBuilderProfileData();
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ FILE UPLOAD HANDLERS ============
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const teal = [0, 105, 92];

    doc.setFillColor(...teal);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Builder Profile Invoice', 14, 17);
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

    section('Company Details');
    row('Company Name', editForm.companyName);
    row('Registration Number', editForm.companyRegNumber);
    row('RERA Number', editForm.reraNumber);
    row('GST Number', editForm.gstNumber);
    row('Years of Experience', editForm.yearsOfExperience);
    y += 4;

    section('Authorized Person');
    row('Full Name', editForm.authFullName);
    row('Designation', editForm.authDesignation);
    row('Mobile Number', editForm.authMobile);
    row('Email Address', editForm.authEmail);
    y += 4;

    section('Office Address');
    row('Address', editForm.officeAddress);
    row('City', editForm.officeCity);
    row('State', editForm.officeState);
    row('PIN Code', editForm.officePinCode);
    y += 4;

    section('Project Details');
    row('Ongoing Projects', editForm.ongoingProjects);
    row('Completed Projects', editForm.completedProjects);
    row('Upcoming Projects', editForm.upcomingProjects);
    row('Total Units Delivered', editForm.totalUnitsDelivered);
    row('Cities of Operation', editForm.citiesOfOperation);
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

    doc.save(`Invoice_${editForm.companyName.replace(/\s+/g, '_')}.pdf`);
  };

  // ============ SECTION DEFINITIONS ============
  const sections = [
    { id: 'company', title: 'Company Details', icon: Building2 },
    { id: 'authorized', title: 'Authorized Person', icon: User },
    { id: 'office', title: 'Office Address', icon: MapPin },
    { id: 'identity', title: 'Identity & Verification', icon: Shield },
    { id: 'project', title: 'Project Details', icon: BarChart3 },
    { id: 'documents', title: 'Upload Documents', icon: FileText },
    { id: 'bank', title: 'Bank Details', icon: Banknote },
    { id: 'social', title: 'Social Media', icon: Share2 },
  ];

  // ============ PROPERTY HANDLERS ============
  const handleViewDetails = (property) => { setSelectedProperty(property); setShowPropertyDetails(true); };
  const handleEditProperty = (property) => { setEditingProperty({ ...property }); setShowEditPropertyModal(true); };

  const handleToggleStatus = async (property) => {
    const newStatus = property.status === 'Active' ? 'Inactive' : 'Active';
    setIsLoading(true);
    try {
      await updateVendorPropertyStatus('builder', property.id, newStatus);
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
        await uploadPropertyImage('builder', propertyId, file);
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
      await deletePropertyImage('builder', propertyId, imageIndex);

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
      await updateVendorProperty('builder', updatedProperty.id, backendData);

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

  const handleDeleteProperty = (property) => { setPropertyToDelete(property); setShowDeletePropertyConfirm(true); };

  const confirmDeleteProperty = async () => {
    setIsLoading(true);
    try {
      await deleteVendorProperty('builder', propertyToDelete.id);
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
      const s = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(prop =>
        prop.name.toLowerCase().includes(s) ||
        prop.id.toLowerCase().includes(s) ||
        prop.location.toLowerCase().includes(s) ||
        prop.type.toLowerCase().includes(s) ||
        prop.price.toLowerCase().includes(s) ||
        prop.area.toLowerCase().includes(s)
      );
    }
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(prop => prop.status.toLowerCase() === filterStatus.toLowerCase());
    }
    return filtered;
  };

  const filteredProperties = getFilteredProperties();
  const clearSearch = () => setSearchTerm('');

  // ============ RENDER HELPERS ============
  const RingBadge = ({ pct }) => {
    const circumference = 2 * Math.PI * 15.5;
    const dashOffset = circumference - (pct / 100) * circumference;
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 border border-[#00695C]/15 rounded-2xl pl-2 pr-4 py-1.5 shadow-sm">
        <div className="relative w-9 h-9 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00695C1A" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#ringGradSharedB)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
            <defs>
              <linearGradient id="ringGradSharedB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00695C" />
                <stop offset="100%" stopColor="#26A69A" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#00695C]">{pct}%</span>
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
            <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">{title}</h2>
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
    <div className="group/acard relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] border border-[#00695C]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${delay}s` }}>
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
          <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-wider group-hover/acard:text-[#00695C] transition-colors duration-300">{label}</label>
          {children ? children : (
            <div className="text-xs sm:text-[13px] text-gray-800 font-semibold break-words">
              {value || <span className="text-gray-400 font-medium italic">Not specified</span>}
            </div>
          )}
        </div>
        {value && !children && <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C]/30 group-hover/acard:text-[#00695C] flex-shrink-0 transition-colors duration-300" />}
      </div>
      <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover/acard:w-full transition-all duration-700 ease-out" />
      </div>
    </div>
  );

  const DocCard = ({ label, icon, field, isImage }) => {
    const file = documents[field];
    const hasFile = file !== null && file !== undefined;
    return (
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10 hover:border-[#00695C]/30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-2.5 sm:p-3">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <div className="text-white">{icon}</div>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-700">{label}</span>
            </div>
            {hasFile && <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">✓</span>}
          </div>

          {hasFile ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg p-1 sm:p-1.5 border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
              {isImage ? (
                <button onClick={() => {
                  setLightboxItems([{ type: 'image', url: URL.createObjectURL(file), name: file.name || label, field }]);
                  setLightboxIndex(0);
                  setShowMediaLightbox(true);
                }} className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1">
                  <Image className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">{file.name || 'Image'}</span>
                </button>
              ) : (
                <button onClick={() => handlePdfView(field)} className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1">
                  <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">{file.name || 'Document'}</span>
                </button>
              )}
              <button onClick={() => removeFile(field)} className="p-0.5 sm:p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300 flex-shrink-0" title="Delete">
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
                  <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 group-hover/upload:text-[#00695C] transition-colors duration-300">Upload</span>
                </div>
                <input type="file" className="hidden" accept={isImage ? 'image/*' : '.pdf'} onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) { isImage ? handleFileUpload(field, f) : handlePdfUpload(field, f); }
                  e.target.value = '';
                }} />
              </label>
            </div>
          )}
        </div>
        <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover:w-full transition-all duration-700 ease-out" />
        </div>
      </div>
    );
  };

  // ============ SECTION CONTENT RENDER ============
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'company': {
        const fields = [editForm.companyName, editForm.companyRegNumber, editForm.reraNumber, editForm.gstNumber, editForm.yearsOfExperience, editForm.companyWebsite, editForm.companyProfile, documents.companyLogo];
        const filledCount = fields.filter(Boolean).length;
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Company Details" subtitle="Manage your company / builder information" filled={filledCount} total={fields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Builder / Company Name" value={editForm.companyName} icon={<Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Company Registration Number" value={editForm.companyRegNumber} icon={<Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="RERA Registration Number" value={editForm.reraNumber} icon={<BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
                <AnimatedCard label="GST Number" value={editForm.gstNumber || 'Not provided'} icon={<Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Years of Experience" value={editForm.yearsOfExperience} icon={<Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Company Website" value={editForm.companyWebsite || 'Not provided'} icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
                <AnimatedCard label="Company Profile / About Us" value={editForm.companyProfile} icon={<FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47} />
                <AnimatedCard label="Company Logo" icon={<Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.54}>
                  {documents.companyLogo ? (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No logo uploaded</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'authorized': {
        const fields = [editForm.authFullName, editForm.authDesignation, editForm.authMobile, editForm.authEmail, editForm.authWhatsapp, documents.profilePhoto];
        const filledCount = fields.filter(Boolean).length;
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Authorized Person Details" subtitle="Details of the representative authorized to act on behalf of the company" filled={filledCount} total={fields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Full Name" value={editForm.authFullName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Designation" value={editForm.authDesignation} icon={<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="Mobile Number" value={editForm.authMobile} icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Email Address" value={editForm.authEmail} icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
                <AnimatedCard label="WhatsApp Number" value={editForm.authWhatsapp || 'Not provided'} icon={<Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Profile Photo" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4}>
                  {documents.profilePhoto ? (
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Uploaded
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No photo uploaded</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'office': {
        const fields = [editForm.officeAddress, editForm.officeCity, editForm.officeDistrict, editForm.officeState, editForm.officePinCode, editForm.officeLandmark];
        const filledCount = fields.filter(Boolean).length;
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Office Address" subtitle="Your registered office address" filled={filledCount} total={fields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="City" value={editForm.officeCity} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="District" value={editForm.officeDistrict} icon={<Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="State" value={editForm.officeState} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
                <AnimatedCard label="PIN Code" value={editForm.officePinCode} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Landmark" value={editForm.officeLandmark || 'Not provided'} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
              </div>
            </div>
          </div>
        );
      }

      case 'identity': {
        const fields = [editForm.aadhaarNumber, editForm.panNumber, documents.aadhaarCard, documents.panCard, documents.companyRegCert, documents.gstCert, documents.reraCert, documents.companyPanCard];
        const filledCount = fields.filter(Boolean).length;
        const leftDocs = [
          { field: 'companyRegCert', label: 'Upload Company Registration Certificate' },
          { field: 'aadhaarCard', label: 'Upload Aadhaar Card' },
          { field: 'panCard', label: 'Upload PAN Card' },
        ];
        const rightDocs = [
          { field: 'gstCert', label: 'Upload GST Certificate (Optional)' },
          { field: 'reraCert', label: 'Upload RERA Certificate' },
          { field: 'companyPanCard', label: 'Upload Company PAN Card (Optional)' },
        ];
        const DocRow = (d, idx, baseDelay) => (
          <AnimatedCard key={d.field} label={d.label} icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={baseDelay + idx * 0.07}>
            {documents[d.field] ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button onClick={() => handlePdfView(d.field)} className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-0.5 sm:gap-1">
                  <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> View Document
                </button>
                <button onClick={() => handlePdfDelete(d.field)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              </div>
            ) : (
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
            )}
          </AnimatedCard>
        );
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Identity & Business Verification" subtitle="Verify identity and business documents" filled={filledCount} total={fields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                {leftDocs.map((d, idx) => DocRow(d, idx, 0.12))}
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                {rightDocs.map((d, idx) => DocRow(d, idx, 0.12))}
              </div>
            </div>
          </div>
        );
      }

      case 'project': {
        const fields = [editForm.ongoingProjects, editForm.completedProjects, editForm.upcomingProjects, editForm.totalUnitsDelivered, editForm.citiesOfOperation, editForm.serviceLocations];
        const filledCount = fields.filter(Boolean).length;
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Project Details" subtitle="Track record of your projects and delivery" filled={filledCount} total={fields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Number of Ongoing Projects" value={editForm.ongoingProjects} icon={<Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Number of Completed Projects" value={editForm.completedProjects} icon={<CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="Number of Upcoming Projects" value={editForm.upcomingProjects} icon={<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Total Units Delivered" value={editForm.totalUnitsDelivered} icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
                <AnimatedCard label="Cities of Operation" value={editForm.citiesOfOperation} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="Service Locations" value={editForm.serviceLocations} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
              </div>
            </div>
          </div>
        );
      }

      case 'bank': {
        const fields = [editForm.accountHolderName, editForm.bankName, editForm.accountNumber, editForm.ifscCode, editForm.upiId];
        const filledCount = fields.filter(Boolean).length;
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Bank Details" subtitle="Your company's banking and financial information" filled={filledCount} total={fields.length} />
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
        const fields = [editForm.website, editForm.facebookPage, editForm.instagram, editForm.linkedIn, editForm.youtubeChannel];
        const filledCount = fields.filter(Boolean).length;
        const getSocialUrl = (platform, value) => {
          if (!value) return '#';
          if (value.startsWith('http://') || value.startsWith('https://')) return value;
          const clean = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
          switch (platform) {
            case 'website': return `https://${clean}`;
            case 'facebook': return `https://www.facebook.com/${clean}`;
            case 'instagram': return `https://www.instagram.com/${clean}`;
            case 'linkedin': return `https://www.linkedin.com/${clean}`;
            case 'youtube': return `https://www.youtube.com/${clean}`;
            default: return `https://${clean}`;
          }
        };
        const SocialLink = ({ label, icon, value, platform, delay }) => (
          <AnimatedCard label={label} icon={icon} delay={delay}>
            {value ? (
              <a href={getSocialUrl(platform, value)} target="_blank" rel="noopener noreferrer"
                className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300">
                {value} <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
              </a>
            ) : (
              <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
            )}
          </AnimatedCard>
        );
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Social Media & Online Presence" subtitle="Your company's online presence and social media links" filled={filledCount} total={fields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <SocialLink label="Website" icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.website} platform="website" delay={0.05} />
                <SocialLink label="Facebook Page" icon={<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.facebookPage} platform="facebook" delay={0.12} />
                <SocialLink label="Instagram" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.instagram} platform="instagram" delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <SocialLink label="LinkedIn" icon={<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.linkedIn} platform="linkedin" delay={0.26} />
                <SocialLink label="YouTube Channel" icon={<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.youtubeChannel} platform="youtube" delay={0.33} />
              </div>
            </div>
          </div>
        );
      }

      case 'documents': {
        const docFields = ['companyLogo', 'companyBrochure', 'projectBrochure', 'companyRegCert', 'reraCert', 'gstCert', 'panCard', 'authIdProof', 'officeAddressProof'];
        const filledCount = docFields.filter(f => documents[f] !== null && documents[f] !== undefined).length;
        const docList = [
          { field: 'companyLogo', label: 'Company Logo', icon: <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, isImage: true },
          { field: 'companyBrochure', label: 'Company Profile Brochure (PDF)', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'projectBrochure', label: 'Project Brochure(s)', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'companyRegCert', label: 'Company Registration Certificate', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'reraCert', label: 'RERA Certificate', icon: <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'gstCert', label: 'GST Certificate (Optional)', icon: <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'panCard', label: 'PAN Card', icon: <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'authIdProof', label: 'Authorized Signatory ID Proof', icon: <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          { field: 'officeAddressProof', label: 'Office Address Proof', icon: <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
        ];
        return (
          <div className="w-full animate-slideUp">
            <SectionHeader title="Upload Company Documents" subtitle="All your important company documents in one place" filled={filledCount} total={docFields.length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 w-full">
              {docList.map((d) => <DocCard key={d.field} {...d} />)}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ============ RENDER PROPERTIES SECTION ============
  const renderPropertiesSection = () => (
    <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-800">My Properties</h2>
            <p className="text-[9px] sm:text-[11px] text-gray-500">Manage your project / property listings</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:flex-initial min-w-[100px] sm:min-w-[120px]">
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 sm:px-3 py-1 sm:py-1.5 pl-6 sm:pl-8 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs" />
            <Search className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
            {searchTerm && (
              <button onClick={clearSearch} className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs bg-white">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-1 sm:p-1.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#00695C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`} aria-label="Grid view">
              <GridIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1 sm:p-1.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-[#00695C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`} aria-label="List view">
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
                <div key={property.id} className="group relative bg-teal-100/30 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#00695C]/10 overflow-hidden hover:-translate-y-1" style={{ animationDelay: `${index * 0.08}s` }}>
                  <div className="relative w-full h-40 sm:h-46 bg-gray-100 overflow-hidden">
                    <img src={property.images?.[0] || 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'} alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'; }} />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 sm:p-3">
                      <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">{property.price}</p>
                    </div>
                    {property.images && property.images.length > 1 && (
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5">
                        <Image className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {property.images.length}
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#00695C] transition-colors duration-300 line-clamp-1 flex-1">{property.name}</h3>
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                        <span className={`text-[9px] sm:text-[10px] font-bold ${property.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                          {property.status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                        <ToggleSwitch isOn={property.status === 'Active'} onToggle={() => handleToggleStatus(property)} size="sm" />
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
                        { icon: Bed, label: property.bedrooms || 'N/A' },
                      ].map((item, idx) => (
                        <span key={idx} className="flex items-center gap-0.5 sm:gap-1 bg-[#00695C]/5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-medium text-[#00695C] border border-[#00695C]/10">
                          <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {item.label}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                      <button onClick={() => handleViewDetails(property)} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <ViewIcon className="w-3 h-3 sm:w-4 sm:h-4" /> View
                      </button>
                      <button onClick={() => handleEditProperty(property)} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit
                      </button>
                      <button onClick={() => handleDeleteProperty(property)} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
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
                    <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
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
                            <img src={property.images?.[0] || 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'} alt={property.name} className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'; }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[10px] sm:text-sm text-gray-800 group-hover:text-[#00695C] transition-colors truncate">{property.name}</p>
                            <p className="text-[9px] sm:text-xs text-gray-500 truncate">{property.id}</p>
                            <p className="text-[9px] sm:text-xs text-gray-400 truncate lg:hidden">{property.type} · {property.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-1">
                          <ToggleSwitch isOn={property.status === 'Active'} onToggle={() => handleToggleStatus(property)} size="sm" />
                          <span className={`hidden sm:inline text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${property.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                            {property.status}
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">{property.type}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-bold text-gray-800 truncate">{property.price}</td>
                      <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">{property.area}</td>
                      <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">{property.location}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-1.5 lg:gap-2">
                          <button onClick={() => handleViewDetails(property)} className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105" title="View">
                            <ViewIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                            <span className="hidden lg:inline">View</span>
                          </button>
                          <button onClick={() => handleEditProperty(property)} className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105" title="Edit">
                            <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                            <span className="hidden lg:inline">Edit</span>
                          </button>
                          <button onClick={() => handleDeleteProperty(property)} className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105" title="Delete">
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
            {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : "You haven't added any properties yet"}
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">
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

  // ============ EDIT PROFILE MODAL FIELD GROUPS ============
  const inputCls = "w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300";
  const cardCls = "space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10";
  const cardTitle = (icon, text) => (
    <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
      <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">{icon}</div>
      {text}
    </h3>
  );

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-16 sm:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {showPdfViewer && pdfToView && (
        <PdfViewerModal file={pdfToView} onClose={() => { setShowPdfViewer(false); setPdfToView(null); }} />
      )}

      {showMediaLightbox && lightboxItems.length > 0 && (
        <MediaLightboxModal items={lightboxItems} index={lightboxIndex} onNavigate={setLightboxIndex}
          onDelete={() => {
            const item = lightboxItems[lightboxIndex];
            if (item) {
              setDocuments(prev => ({ ...prev, [item.field]: null }));
              setLightboxItems([]);
              setShowMediaLightbox(false);
              showSuccessToast();
            }
          }}
          onClose={() => { setShowMediaLightbox(false); setLightboxItems([]); setLightboxIndex(0); }} />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal title="Confirm Delete" message="Are you sure you want to delete this file? This action cannot be undone."
          onConfirm={confirmDelete} onCancel={() => { setShowDeleteConfirm(false); setDeleteItem(null); }} />
      )}

      {showProfilePhotoDeleteConfirm && (
        <DeleteConfirmModal title="Delete Profile Photo" message="Are you sure you want to delete your profile photo? This action cannot be undone."
          onConfirm={confirmProfilePhotoDelete} onCancel={() => setShowProfilePhotoDeleteConfirm(false)} />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl mx-auto overflow-hidden max-h-[80vh] sm:max-h-[75vh] flex flex-col animate-scaleIn">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl"><Edit2 className="w-4 h-4 sm:w-5 sm:h-5" /></div>
                Edit Builder Profile
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 w-full bg-gray-50">

              {/* Company Details */}
              <div className={cardCls}>
                {cardTitle(<Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Company Details')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏢 Builder / Company Name *</label>
                    <input type="text" name="companyName" value={editForm.companyName} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📋 Company Registration Number *</label>
                    <input type="text" name="companyRegNumber" value={editForm.companyRegNumber} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📋 RERA Registration Number *</label>
                    <input type="text" name="reraNumber" value={editForm.reraNumber} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">#️⃣ GST Number</label>
                    <input type="text" name="gstNumber" value={editForm.gstNumber} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">⭐ Years of Experience *</label>
                    <input type="number" name="yearsOfExperience" value={editForm.yearsOfExperience} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌐 Company Website (Optional)</label>
                    <input type="text" name="companyWebsite" value={editForm.companyWebsite} onChange={handleEditChange} className={inputCls} placeholder="www.company.com" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🖼️ Company Logo *</label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button onClick={() => companyLogoInputRef.current?.click()} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">Upload</button>
                      {documents.companyLogo && (
                        <button onClick={() => removeFile('companyLogo')} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
                      )}
                      <input ref={companyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleCompanyLogoUpload} />
                    </div>
                    {documents.companyLogo && <p className="text-[10px] sm:text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1"><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {documents.companyLogo.name}</p>}
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📝 Company Profile / About Us *</label>
                    <textarea name="companyProfile" value={editForm.companyProfile} onChange={handleEditChange} rows="3" className={`${inputCls} resize-y`} placeholder="Describe your company background" />
                  </div>
                </div>
              </div>

              {/* Authorized Person */}
              <div className={cardCls}>
                {cardTitle(<User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Authorized Person Details')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">👤 Full Name *</label>
                    <input type="text" name="authFullName" value={editForm.authFullName} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">💼 Designation *</label>
                    <input type="text" name="authDesignation" value={editForm.authDesignation} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📱 Mobile Number *</label>
                    <input type="text" name="authMobile" value={editForm.authMobile} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">✉️ Email Address *</label>
                    <input type="email" name="authEmail" value={editForm.authEmail} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📱 WhatsApp Number</label>
                    <input type="text" name="authWhatsapp" value={editForm.authWhatsapp} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📸 Profile Photo *</label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button onClick={() => profilePhotoInputRef.current?.click()} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">Upload</button>
                      {documents.profilePhoto && (
                        <button onClick={handleProfilePhotoDelete} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
                      )}
                      <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Address */}
              <div className={cardCls}>
                {cardTitle(<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Office Address')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📍 Office Address *</label>
                    <textarea name="officeAddress" value={editForm.officeAddress} onChange={handleEditChange} rows="2" className={`${inputCls} resize-y`} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏙️ City *</label>
                    <input type="text" name="officeCity" value={editForm.officeCity} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🗺️ District *</label>
                    <input type="text" name="officeDistrict" value={editForm.officeDistrict} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌍 State *</label>
                    <input type="text" name="officeState" value={editForm.officeState} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📍 PIN Code *</label>
                    <input type="text" name="officePinCode" value={editForm.officePinCode} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📌 Landmark</label>
                    <input type="text" name="officeLandmark" value={editForm.officeLandmark} onChange={handleEditChange} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Identity & Business Verification */}
              <div className={cardCls}>
                {cardTitle(<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Identity & Business Verification')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🆔 Aadhaar Number *</label>
                    <input type="text" name="aadhaarNumber" value={editForm.aadhaarNumber} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📄 PAN Number *</label>
                    <input type="text" name="panNumber" value={editForm.panNumber} onChange={handleEditChange} className={inputCls} />
                  </div>
                  {[
                    { field: 'aadhaarCard', label: 'Upload Aadhaar Card *' },
                    { field: 'panCard', label: 'Upload PAN Card *' },
                    { field: 'companyRegCert', label: 'Upload Company Registration Certificate *' },
                    { field: 'gstCert', label: 'Upload GST Certificate (Optional)' },
                    { field: 'reraCert', label: 'Upload RERA Certificate *' },
                    { field: 'companyPanCard', label: 'Upload Company PAN Card (Optional)' },
                  ].map((d) => (
                    <div className="space-y-1 sm:space-y-1.5 w-full" key={d.field}>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📎 {d.label}</label>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={() => fileInputRefs.current[d.field]?.click()} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">Upload</button>
                        {documents[d.field] && (
                          <button onClick={() => handlePdfDelete(d.field)} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
                        )}
                        <input ref={el => fileInputRefs.current[d.field] = el} type="file" className="hidden" accept=".pdf"
                          onChange={(e) => { const f = e.target.files[0]; if (f) handlePdfUpload(d.field, f); e.target.value = ''; }} />
                      </div>
                      {documents[d.field] && <p className="text-[10px] sm:text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1"><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {documents[d.field].name}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className={cardCls}>
                {cardTitle(<BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Project Details')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏗️ Number of Ongoing Projects</label>
                    <input type="number" name="ongoingProjects" value={editForm.ongoingProjects} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">✅ Number of Completed Projects</label>
                    <input type="number" name="completedProjects" value={editForm.completedProjects} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📅 Number of Upcoming Projects</label>
                    <input type="number" name="upcomingProjects" value={editForm.upcomingProjects} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏠 Total Units Delivered</label>
                    <input type="number" name="totalUnitsDelivered" value={editForm.totalUnitsDelivered} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌍 Cities of Operation</label>
                    <input type="text" name="citiesOfOperation" value={editForm.citiesOfOperation} onChange={handleEditChange} className={inputCls} placeholder="e.g. Mumbai, Pune, Nashik" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📍 Service Locations</label>
                    <input type="text" name="serviceLocations" value={editForm.serviceLocations} onChange={handleEditChange} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Upload Company Documents */}
              <div className={cardCls}>
                {cardTitle(<FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Upload Company Documents')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { field: 'companyLogo', label: 'Company Logo *', isImage: true, ref: companyLogoInputRef },
                    { field: 'companyBrochure', label: 'Company Profile Brochure (PDF)' },
                    { field: 'projectBrochure', label: 'Project Brochure(s)' },
                    { field: 'companyRegCert', label: 'Company Registration Certificate *' },
                    { field: 'reraCert', label: 'RERA Certificate *' },
                    { field: 'gstCert', label: 'GST Certificate (Optional)' },
                    { field: 'panCard', label: 'PAN Card *' },
                    { field: 'authIdProof', label: 'Authorized Signatory ID Proof *' },
                    { field: 'officeAddressProof', label: 'Office Address Proof *' },
                  ].map((d) => (
                    <div className="space-y-1 sm:space-y-1.5 w-full" key={d.field}>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📎 {d.label}</label>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => d.isImage ? d.ref.current?.click() : fileInputRefs.current[d.field]?.click()}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">
                          Upload
                        </button>
                        {documents[d.field] && (
                          <button onClick={() => removeFile(d.field)} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
                        )}
                        {!d.isImage && (
                          <input ref={el => fileInputRefs.current[d.field] = el} type="file" className="hidden" accept=".pdf"
                            onChange={(e) => { const f = e.target.files[0]; if (f) handlePdfUpload(d.field, f); e.target.value = ''; }} />
                        )}
                      </div>
                      {documents[d.field] && <p className="text-[10px] sm:text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1"><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {documents[d.field].name}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Details */}
              <div className={cardCls}>
                {cardTitle(<Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Bank Details')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">👤 Account Holder Name</label>
                    <input type="text" name="accountHolderName" value={editForm.accountHolderName} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏦 Bank Name</label>
                    <input type="text" name="bankName" value={editForm.bankName} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">💳 Account Number</label>
                    <input type="text" name="accountNumber" value={editForm.accountNumber} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🔢 IFSC Code</label>
                    <input type="text" name="ifscCode" value={editForm.ifscCode} onChange={handleEditChange} className={inputCls} />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📱 UPI ID</label>
                    <input type="text" name="upiId" value={editForm.upiId} onChange={handleEditChange} className={inputCls} placeholder="example@upi" />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className={cardCls}>
                {cardTitle(<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Social Media & Online Presence')}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌐 Website</label>
                    <input type="text" name="website" value={editForm.website} onChange={handleEditChange} className={inputCls} placeholder="www.example.com" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📘 Facebook Page</label>
                    <input type="text" name="facebookPage" value={editForm.facebookPage} onChange={handleEditChange} className={inputCls} placeholder="facebook.com/yourpage" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📸 Instagram</label>
                    <input type="text" name="instagram" value={editForm.instagram} onChange={handleEditChange} className={inputCls} placeholder="instagram.com/yourpage" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">💼 LinkedIn</label>
                    <input type="text" name="linkedIn" value={editForm.linkedIn} onChange={handleEditChange} className={inputCls} placeholder="linkedin.com/company/yourcompany" />
                  </div>
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">▶️ YouTube Channel</label>
                    <input type="text" name="youtubeChannel" value={editForm.youtubeChannel} onChange={handleEditChange} className={inputCls} placeholder="youtube.com/yourchannel" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button onClick={() => setShowEditModal(false)} className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                Cancel
              </button>
              <button onClick={handleSave} disabled={isLoading}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
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

      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal property={selectedProperty} onClose={() => { setShowPropertyDetails(false); setSelectedProperty(null); }}
          onAddImages={handleAddPropertyImages} onRemoveImage={handleRemovePropertyImage} onToggleStatus={handleToggleStatus}
          onEdit={handleEditProperty} onDelete={handleDeleteProperty} />
      )}

      {showEditPropertyModal && editingProperty && (
        <EditPropertyModal property={editingProperty} onSave={handleSavePropertyEdit}
          onCancel={() => { setShowEditPropertyModal(false); setEditingProperty(null); }} />
      )}

      {showDeletePropertyConfirm && propertyToDelete && (
        <DeleteConfirmModal title="Delete Property" message={`Are you sure you want to delete "${propertyToDelete.name}"? This action cannot be undone.`}
          onConfirm={confirmDeleteProperty} onCancel={() => { setShowDeletePropertyConfirm(false); setPropertyToDelete(null); }} />
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
              <button onClick={handleNavigateBack} className="relative p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group border border-[#00695C]/10 overflow-hidden" aria-label="Go back">
                <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00695C]/0 to-[#26A69A]/0 group-hover:from-[#00695C]/10 group-hover:to-[#26A69A]/10 transition-all duration-300" />
                <ArrowLeft className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#00695C] group-hover:-translate-x-0.5 transition-all duration-300" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-2 sm:gap-3 relative">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] blur-lg opacity-40 animate-pulse-slow" />
                    <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl border-2 border-[#26A69A]/30 animate-spin-slow" />
                    <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <span className="relative text-base sm:text-xl md:text-2xl lg:text-3xl">
                    Builder Profile
                    <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1.5 ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#26A69A] animate-pulse" />
                  <span className="hidden lg:inline">Manage your builder/company profile and project listings</span>
                  <span className="inline lg:hidden">Manage your profile</span>
                </p>
              </div>
            </div>
            <button onClick={() => setShowEditModal(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group text-xs sm:text-sm overflow-hidden">
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

          <button onClick={handleDownloadInvoice} title="Download Invoice PDF"
            className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-md hover:shadow-lg hover:from-[#005A4F] hover:to-[#1B9E8E] hover:scale-105 transition-all duration-300">
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden lg:inline">Download Invoice</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-6 w-full relative z-10">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-0.5 sm:-inset-1 rounded-[20px] sm:rounded-[24px] animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }} />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-3 sm:ring-4 ring-white/60">
                {documents.companyLogo ? (
                  <img src={URL.createObjectURL(documents.companyLogo)} alt={editForm.companyName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                    {editForm.companyName.charAt(0)}
                  </span>
                )}
              </div>
              {documents.companyLogo && (
                <button onClick={() => removeFile('companyLogo')} className="absolute top-0 right-0 p-1 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20" aria-label="Delete company logo" title="Delete Company Logo">
                  <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              )}
              <button onClick={() => companyLogoInputRef.current?.click()} className="absolute bottom-0 right-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20" aria-label="Upload company logo" title="Upload Company Logo">
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <input ref={companyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleCompanyLogoUpload} />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editForm.companyName}</h2>
                <span className="text-[10px] sm:text-xs text-[#00695C] font-medium bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200">
                  Builder ID: #BLD-{editForm.authMobile?.slice(-4) || '0000'}
                </span>
                <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold">
                  RERA Verified
                  <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.authFullName} · {editForm.authDesignation}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.officeCity}, {editForm.officeState}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.authMobile}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.35s' }}>
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.yearsOfExperience} Years Exp.
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.45s' }}>
                  <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span>{editForm.ongoingProjects} Ongoing · {editForm.completedProjects} Completed</span>
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.55s' }}>
                  <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">{editForm.citiesOfOperation}</span>
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
                <button key={tab.id} onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs transition-all duration-500 whitespace-nowrap relative group ${isActive ? 'text-white shadow-lg transform scale-105' : 'text-gray-600 hover:text-[#00695C]'}`}
                  style={{ background: isActive ? `linear-gradient(135deg, #00695C, #26A69A)` : 'transparent' }}>
                  {isActive && <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg animate-pulse-slow" />}
                  <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
                    <span className="hidden lg:inline">{tab.title}</span>
                    <span className="inline lg:hidden">{tab.title.split(' ')[0]}</span>
                    {isActive && <span className="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-ping" />}
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
          <div className="relative z-10">{renderSectionContent()}</div>
        </div>

        {/* Properties Section */}
        {renderPropertiesSection()}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes floatDelayed { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-5deg); } }
        @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.5; } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes shimmerSweep { 0% { left: -60%; } 50%, 100% { left: 130%; } }
        @keyframes underlineGrow { 0% { transform: scaleX(0); } 60% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
        .animate-spin-slow { animation: spinSlow 6s linear infinite; }
        .animate-shimmer { animation: shimmerSweep 3.2s ease-in-out infinite; }
        .animate-underline-grow { animation: underlineGrow 1.2s ease-out 0.6s forwards; }
        .animate-rise { opacity: 0; animation: riseIn 0.5s ease forwards; }
        .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; opacity: 0; }

        .border-3 { border-width: 3px; }
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

export default BuilderProfile;






































// import React, { useState, useRef, useEffect } from 'react';
// import {
//   User, Mail, Phone, Calendar, MapPin, Building, Building2,
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
//   Search, Filter, Grid as GridIcon, List,
//   Eye as ViewIcon, Bed, Bath, Trees, Wifi,
//   ChevronLeft, ChevronRight,
//   File, FolderOpen, FileImage, FileSpreadsheet, ImagePlus,
//   BriefcaseBusiness, Store, Globe2, Hash, IdCard, BadgeCheck,
//   Share2, UsersRound, TrendingUp, PieChart,
//   BarChart3, Activity, PenTool, Lock
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";

// // ============ TOGGLE SWITCH COMPONENT ============
// const ToggleSwitch = ({ isOn, onToggle, size = 'sm' }) => {
//   const sizes = {
//     sm: { container: 'w-7 h-3.5 sm:w-8 sm:h-4', circle: 'w-2.5 h-2.5 sm:w-3 sm:h-3', translate: 'translate-x-3.5 sm:translate-x-4' },
//     md: { container: 'w-9 h-4.5 sm:w-10 sm:h-5', circle: 'w-3.5 h-3.5 sm:w-4 sm:h-4', translate: 'translate-x-4.5 sm:translate-x-5' },
//     lg: { container: 'w-11 h-5.5 sm:w-12 sm:h-6', circle: 'w-4.5 h-4.5 sm:w-5 sm:h-5', translate: 'translate-x-5.5 sm:translate-x-6' },
//   };
//   const s = sizes[size] || sizes.sm;
//   return (
//     <button
//       type="button"
//       className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 ${isOn ? 'bg-[#00695C]' : 'bg-gray-300'} ${s.container}`}
//       onClick={onToggle}
//       role="switch"
//       aria-checked={isOn}
//     >
//       <span className={`pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${isOn ? s.translate : 'translate-x-0'} ${s.circle}`} />
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
//           <button onClick={onClose} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0">
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>
//         <div className="flex-1 overflow-auto bg-gray-100 p-2 sm:p-3 md:p-4 lg:p-6">
//           <embed src={fileUrl} type="application/pdf" className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]" />
//         </div>
//         <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-2 flex-shrink-0">
//           <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-full">{fileName}</span>
//           <button onClick={() => window.open(fileUrl, '_blank')} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 bg-[#00695C] text-white rounded-xl text-[10px] sm:text-xs md:text-sm lg:text-base font-bold hover:bg-[#005A4F] transition-all duration-300 w-full sm:w-auto justify-center">
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
//         <button onClick={onClose} className="absolute -top-8 sm:-top-10 right-0 text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110">
//           <X className="w-5 h-5 sm:w-7 sm:h-7" />
//         </button>
//         {items.length > 1 && (
//           <button onClick={goPrev} className="absolute left-1 sm:-left-14 md:-left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10">
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
//               <button onClick={onDelete} title="Delete this file" className="flex items-center gap-0.5 sm:gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] md:text-[11px] font-bold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
//                 <Trash2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
//                 Delete
//               </button>
//             )}
//           </div>
//         </div>
//         {items.length > 1 && (
//           <button onClick={goNext} className="absolute right-1 sm:-right-14 md:-right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 sm:p-2.5 md:p-3 transition-all duration-300 z-10">
//             <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============ DELETE CONFIRM MODAL ============
// const DeleteConfirmModal = ({ title, message, onConfirm, onCancel }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-3 sm:p-4 md:p-6">
//     <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn p-4 sm:p-6 md:p-8">
//       <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
//         <div className="bg-red-100 p-2 sm:p-3 rounded-2xl">
//           <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
//         </div>
//         <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
//       </div>
//       <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{message}</p>
//       <div className="flex justify-end gap-2 sm:gap-3">
//         <button onClick={onCancel} className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
//           Cancel
//         </button>
//         <button onClick={onConfirm} className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base">
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ============ PROPERTY DETAILS MODAL ============
// const PropertyDetailsModal = ({ property, onClose, onAddImages, onRemoveImage, onToggleStatus, onEdit, onDelete }) => {
//   if (!property) return null;
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const detailImageInputRef = useRef(null);
//   const rawImages = property.images || [];
//   const hasImages = rawImages.length > 0;
//   const images = hasImages ? rawImages : ['https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'];

//   useEffect(() => {
//     if (currentImageIndex >= images.length) setCurrentImageIndex(Math.max(0, images.length - 1));
//   }, [images.length]);

//   const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
//   const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

//   const handleAddImagesChange = (e) => {
//     const files = e.target.files;
//     if (files && files.length > 0) onAddImages(property.id, files);
//     e.target.value = '';
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-2xl h-[80vh] flex flex-col animate-scaleIn">
//         <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-3 sm:px-4 md:px-5 py-2 sm:py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
//           <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
//             <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg">
//               <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//             </div>
//             <h2 className="text-white text-base sm:text-lg md:text-xl font-bold truncate">{property.name}</h2>
//           </div>
//           <button onClick={onClose} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0">
//             <X className="w-4 h-4 sm:w-5 sm:h-5" />
//           </button>
//         </div>

//         <div className="p-3 sm:p-4 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
//           <div className="relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64">
//             <img src={images[currentImageIndex]} alt={property.name} className="w-full h-full object-cover"
//               onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'; }} />
//             {images.length > 1 && (
//               <>
//                 <button onClick={prevImage} className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
//                   <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </button>
//                 <button onClick={nextImage} className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300">
//                   <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </button>
//                 <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-black/60 text-white text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full">
//                   {currentImageIndex + 1} / {images.length}
//                 </div>
//               </>
//             )}
//             {hasImages && (
//               <button onClick={() => onRemoveImage(property.id, currentImageIndex)} title="Delete this image"
//                 className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
//                 <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Delete
//               </button>
//             )}
//           </div>

//           <div className="flex items-center justify-between">
//             <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
//               {hasImages ? `${images.length} image${images.length > 1 ? 's' : ''}` : 'No images uploaded yet'}
//             </p>
//             <button onClick={() => detailImageInputRef.current?.click()} className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
//               <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Add Image
//             </button>
//             <input ref={detailImageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAddImagesChange} />
//           </div>

//           {images.length > 1 && (
//             <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-1.5">
//               {images.map((img, idx) => (
//                 <button key={idx} onClick={() => setCurrentImageIndex(idx)}
//                   className={`flex-shrink-0 w-12 sm:w-14 md:w-16 h-9 sm:h-10 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'}`}>
//                   <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover"
//                     onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'; }} />
//                 </button>
//               ))}
//             </div>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
//             {[
//               { icon: Building2, label: 'Property ID', value: property.id },
//               { icon: CreditCard, label: 'Price', value: property.price },
//               { icon: Bed, label: 'Bedrooms', value: property.bedrooms || 'N/A' },
//               { icon: Bath, label: 'Bathrooms', value: property.bathrooms || 'N/A' },
//               { icon: MapPin, label: 'Location', value: property.location },
//               { icon: Calendar, label: 'Posted', value: property.postedDate },
//             ].map((item, idx) => (
//               <div key={idx} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
//                 <div className="p-1 sm:p-1.5 bg-[#00695C]/10 rounded-lg">
//                   <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
//                   <p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate">{item.value}</p>
//                 </div>
//               </div>
//             ))}
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
//                 {property.features.map((f, i) => (
//                   <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#00695C]/10 text-[#00695C] rounded-lg text-[9px] sm:text-[10px] font-bold">{f}</span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {property.selectedAmenities && property.selectedAmenities.length > 0 && (
//             <div>
//               <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1 sm:mb-1.5">Amenities</h3>
//               <div className="flex flex-wrap gap-1 sm:gap-1.5">
//                 {property.selectedAmenities.map((a, i) => (
//                   <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] sm:text-[10px] font-bold">{a}</span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-wrap gap-2 sm:gap-2.5 flex-shrink-0">
//           <button onClick={() => { onClose(); onEdit(property); }} className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2">
//             <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit Property
//           </button>
//           <button onClick={() => { onClose(); onDelete(property); }} className="flex-1 min-w-[80px] sm:min-w-[100px] px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2">
//             <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ HELPERS ============
// const availableAmenities = [
//   "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance",
//   "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center",
//   "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
//   "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
// ];
// const yesNoOptions = ["Yes", "No"];
// const listingPurposeOptions = [
//   { value: 'rent', label: 'For Rent' },
//   { value: 'sale', label: 'For Sale' },
//   { value: 'lease', label: 'For Lease' }
// ];
// const propertyTypeOptions = ["Independent House", "Independent Villa", "Duplex Residential Unit", "Apartment", "Commercial", "Land"];
// const furnishingOptions = ["Full Furnish", "Semi Furnish", "Unfurnished"];
// const rentalDurationOptions = ["Short Term", "Long Term", "Flexible"];
// const occupancyOptions = ["Single", "Family", "Bachelors", "Company Lease"];

// // ============ EDIT PROPERTY MODAL ============
// const EditPropertyModal = ({ property, onSave, onCancel }) => {
//   if (!property) return null;
//   const editSteps = ['Property Details', 'Pricing & Amenities', 'Media Upload'];

//   const [localStep, setLocalStep] = useState(0);
//   const [p, setP] = useState({ ...property });
//   const [localCustomAmenities, setLocalCustomAmenities] = useState(() => {
//     const sel = property.selectedAmenities || [];
//     return sel.filter(a => !availableAmenities.includes(a));
//   });

//   const [imagePreviews, setImagePreviews] = useState(property.images || []);
//   const [coverPreview, setCoverPreview] = useState(property.coverImage || (property.images && property.images[0]) || null);
//   const [videoPreview, setVideoPreview] = useState(property.propertyVideo || null);
//   const [floorPlanPreview, setFloorPlanPreview] = useState(property.floorPlan || null);
//   const [newImageFiles, setNewImageFiles] = useState([]);
//   const [coverFile, setCoverFile] = useState(null);
//   const [videoFile, setVideoFile] = useState(null);
//   const [floorPlanFile, setFloorPlanFile] = useState(null);

//   const update = (field, value) => setP(prev => ({ ...prev, [field]: value }));

//   const toggleAmenity = (amenity) => {
//     const current = p.selectedAmenities || [];
//     if (current.includes(amenity)) update('selectedAmenities', current.filter(a => a !== amenity));
//     else update('selectedAmenities', [...current, amenity]);
//   };

//   const addCustomAmenity = () => {
//     const val = (p.otherAmenities || '').trim();
//     if (val && !(p.selectedAmenities || []).includes(val) && !localCustomAmenities.includes(val)) {
//       setLocalCustomAmenities(prev => [...prev, val]);
//       update('selectedAmenities', [...(p.selectedAmenities || []), val]);
//       update('otherAmenities', '');
//     }
//   };

//   const removeCustomAmenity = (amenity) => {
//     setLocalCustomAmenities(prev => prev.filter(a => a !== amenity));
//     update('selectedAmenities', (p.selectedAmenities || []).filter(a => a !== amenity));
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const remaining = Math.max(0, 3 - imagePreviews.length);
//     if (files.length > remaining) alert(`You can only upload ${remaining} more image(s). Maximum 3 images allowed.`);
//     const limited = files.slice(0, remaining);
//     const previews = limited.map(f => URL.createObjectURL(f));
//     setImagePreviews(prev => [...prev, ...previews]);
//     setNewImageFiles(prev => [...prev, ...limited]);
//     e.target.value = '';
//   };

//   const removeImage = (idx) => {
//     setImagePreviews(prev => prev.filter((_, i) => i !== idx));
//     setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
//   };

//   const handleCoverUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 2 * 1024 * 1024) { alert('Cover image must be less than 2MB'); return; }
//     setCoverFile(file);
//     setCoverPreview(URL.createObjectURL(file));
//     e.target.value = '';
//   };
//   const removeCover = () => { setCoverFile(null); setCoverPreview(null); };

//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 10 * 1024 * 1024) { alert('Video must be less than 10MB'); return; }
//     setVideoFile(file);
//     setVideoPreview(URL.createObjectURL(file));
//     e.target.value = '';
//   };
//   const removeVideo = () => { setVideoFile(null); setVideoPreview(null); };

//   const handleFloorPlanUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.type !== 'application/pdf') { alert('Floor plan must be a PDF file'); return; }
//     if (file.size > 5 * 1024 * 1024) { alert('Floor plan must be less than 5MB'); return; }
//     setFloorPlanFile(file);
//     setFloorPlanPreview(file.name);
//     e.target.value = '';
//   };
//   const removeFloorPlan = () => { setFloorPlanFile(null); setFloorPlanPreview(null); };

//   const handleSave = () => {
//     let finalImages = [...imagePreviews];
//     if (newImageFiles.length > 0) finalImages = [...finalImages, ...newImageFiles.map(f => URL.createObjectURL(f))];
//     const updated = { ...p, images: finalImages };
//     if (coverFile) updated.coverImage = URL.createObjectURL(coverFile);
//     if (videoFile) updated.propertyVideo = URL.createObjectURL(videoFile);
//     if (floorPlanFile) updated.floorPlan = floorPlanFile;
//     onSave(updated);
//   };

//   const renderStep = () => {
//     if (localStep === 0) {
//       return (
//         <div className="space-y-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title / Name</label>
//               <input type="text" value={p.name || ''} onChange={(e) => update('name', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="e.g. Green Valley 3BHK Apartment" />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Property ID</label>
//               <input type="text" value={p.id} disabled className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
//             <div className="space-y-1.5">
//               {propertyTypeOptions.map(type => (
//                 <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="radio" name="edit-ptype" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.type === type} onChange={() => update('type', type)} />
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
//             <textarea value={p.location || ''} onChange={(e) => update('location', e.target.value)} rows="2"
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
//               placeholder="Enter complete property address" />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">City</label>
//             <input type="text" value={p.propertyCity || ''} onChange={(e) => update('propertyCity', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               placeholder="Enter city name" />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Details</label>
//             <div className="grid grid-cols-2 gap-2">
//               <input type="number" value={p.builtUpArea || ''} onChange={(e) => update('builtUpArea', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Build-up Area (sq ft)" />
//               <input type="number" value={p.carpetArea || ''} onChange={(e) => update('carpetArea', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Carpet Area (sq ft)" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
//               <input type="number" value={p.bedrooms || ''} onChange={(e) => update('bedrooms', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Number of bedrooms" />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
//               <input type="number" value={p.bathrooms || ''} onChange={(e) => update('bathrooms', e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Number of bathrooms" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
//             <div className="space-y-1.5">
//               {furnishingOptions.map(f => (
//                 <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="radio" name="edit-furnish" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.furnishing === f} onChange={() => update('furnishing', f)} />
//                   {f}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking Facility</label>
//             <div className="flex gap-4">
//               {yesNoOptions.map(opt => (
//                 <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="radio" name="edit-parking" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={(p.parking || '').toLowerCase() === opt.toLowerCase()} onChange={() => update('parking', opt.toLowerCase())} />
//                   {opt === 'Yes' ? 'Yes, available' : 'No parking'}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Rental Duration</label>
//             <div className="space-y-1.5">
//               {rentalDurationOptions.map(d => (
//                 <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="radio" name="edit-duration" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.rentalDuration === d} onChange={() => update('rentalDuration', d)} />
//                   {d}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Occupancy Details</label>
//             <div className="space-y-1.5">
//               {occupancyOptions.map(o => (
//                 <label key={o} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="radio" name="edit-occupancy" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.occupancyDetails === o} onChange={() => update('occupancyDetails', o)} />
//                   {o}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             {[
//               { key: 'petFriendly', label: 'Pet Friendly' },
//               { key: 'gardenSpace', label: 'Garden Space' },
//               { key: 'terrace', label: 'Terrace / Balcony' },
//             ].map(row => (
//               <div key={row.key}>
//                 <label className="block text-xs font-bold text-gray-700 mb-0.5">{row.label}</label>
//                 <div className="flex gap-3">
//                   {yesNoOptions.map(opt => (
//                     <label key={opt} className="flex items-center gap-1.5 text-xs cursor-pointer">
//                       <input type="radio" name={`edit-${row.key}`} className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={p[row.key] === opt} onChange={() => update(row.key, opt)} />
//                       {opt}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
//             <select value={p.status || 'Active'} onChange={(e) => update('status', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all">
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
//             <textarea value={p.description || ''} onChange={(e) => update('description', e.target.value)} rows="3"
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
//               placeholder="Enter property description..." />
//           </div>
//         </div>
//       );
//     } else if (localStep === 1) {
//       return (
//         <div className="space-y-3">
//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
//             <div className="flex flex-wrap gap-4">
//               {listingPurposeOptions.map(opt => (
//                 <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
//                   <input type="radio" name="edit-purpose" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.listingPurpose === opt.value || p.listingPurpose === opt.label} onChange={() => update('listingPurpose', opt.value)} />
//                   {opt.label}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Expected Rent (₹/month)</label>
//             <input type="text" value={p.expectedPrice || ''} onChange={(e) => update('expectedPrice', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="e.g. 15,000" />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Budget Range (₹/month)</label>
//             <div className="grid grid-cols-2 gap-2">
//               <input type="number" placeholder="Min" value={p.budgetRange?.min || ''} onChange={(e) => update('budgetRange', { ...p.budgetRange, min: e.target.value })}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" />
//               <input type="number" placeholder="Max" value={p.budgetRange?.max || ''} onChange={(e) => update('budgetRange', { ...p.budgetRange, max: e.target.value })}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Type</label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input type="radio" name="edit-priceType" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.priceType === 'fixed'} onChange={() => update('priceType', 'fixed')} />
//                 Fixed Price
//               </label>
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input type="radio" name="edit-priceType" className="accent-[#00695C] w-4 h-4 cursor-pointer" checked={p.priceType === 'negotiable'} onChange={() => update('priceType', 'negotiable')} />
//                 Negotiable
//               </label>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance Charges (₹/month)</label>
//             <input type="text" value={p.maintenance || ''} onChange={(e) => update('maintenance', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" placeholder="Enter monthly maintenance" />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
//             <input type="date" value={p.availableFrom || ''} onChange={(e) => update('availableFrom', e.target.value)}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all" />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Select Amenities</label>
//             <div className="flex flex-wrap gap-1.5">
//               {availableAmenities.map(a => (
//                 <span key={a} onClick={() => toggleAmenity(a)}
//                   className={`px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${(p.selectedAmenities || []).includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
//                   {a}
//                 </span>
//               ))}
//               {localCustomAmenities.map(a => (
//                 <span key={a} className="px-2.5 py-1 text-xs bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
//                   {a}
//                   <X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Other Amenities</label>
//             <div className="flex gap-2">
//               <input type="text" value={p.otherAmenities || ''} onChange={(e) => update('otherAmenities', e.target.value)}
//                 className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//                 placeholder="e.g. Clubhouse, CCTV, Solar Panel..." onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
//               <button onClick={addCustomAmenity} className="px-4 py-2 text-sm bg-[#00695C] text-white rounded-xl hover:bg-[#005A4F] transition-colors">Add</button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
//             <input type="text" value={(p.features || []).join(', ')}
//               onChange={(e) => update('features', e.target.value.split(',').map(f => f.trim()))}
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
//               placeholder="2 BHK, Sea View, Parking, etc." />
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div className="space-y-4">
//           <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-50">
//             <div className="w-1 h-4 bg-[#00695C] rounded" />
//             <h3 className="text-sm font-bold text-[#00695C]">Property Media</h3>
//           </div>
//           <p className="text-xs text-gray-400 mb-3">📸 Upload property images and media</p>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Cover Image</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept="image/*" className="hidden" id="edit-cover" onChange={handleCoverUpload} />
//               <label htmlFor="edit-cover" className="cursor-pointer flex flex-col items-center">
//                 <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Cover Image</span>
//                 <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
//               </label>
//             </div>
//             {coverPreview && (
//               <div className="mt-2 relative">
//                 <img src={coverPreview} alt="Cover" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
//                 <button onClick={removeCover} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Photos (Max 3)</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept="image/*" multiple className="hidden" id="edit-photos" onChange={handleImageUpload} disabled={imagePreviews.length >= 3} />
//               <label htmlFor="edit-photos" className={`cursor-pointer flex flex-col items-center ${imagePreviews.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                 <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Property Photos</span>
//                 <span className="text-xs text-gray-400 mt-1">Max 3 photos</span>
//               </label>
//             </div>
//             {imagePreviews.length > 0 && (
//               <div className="mt-3 grid grid-cols-3 gap-2">
//                 {imagePreviews.map((preview, idx) => (
//                   <div key={idx} className="relative">
//                     <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
//                     <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <p className="text-xs text-gray-400 mt-2">{imagePreviews.length}/3 images uploaded</p>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Video (Optional)</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept="video/mp4,video/mov" className="hidden" id="edit-video" onChange={handleVideoUpload} />
//               <label htmlFor="edit-video" className="cursor-pointer flex flex-col items-center">
//                 <Video className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Property Video Tour</span>
//                 <span className="text-xs text-gray-400 mt-1">MP4/MOV (Max 10MB)</span>
//               </label>
//             </div>
//             {videoPreview && (
//               <div className="mt-2 relative">
//                 <video src={videoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200" />
//                 <button onClick={removeVideo} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">✕</button>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-700 mb-1">Upload Floor Plan</label>
//             <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
//               <input type="file" accept=".pdf" className="hidden" id="edit-floorplan" onChange={handleFloorPlanUpload} />
//               <label htmlFor="edit-floorplan" className="cursor-pointer flex flex-col items-center">
//                 <Home className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
//                 <span className="text-sm font-semibold text-[#00695C]">Upload Floor Plan</span>
//                 <span className="text-xs text-gray-400 mt-1">PDF only (Max 5MB)</span>
//               </label>
//             </div>
//             {floorPlanPreview && (
//               <div className="mt-2 relative flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
//                 <FileText className="w-4 h-4 text-[#00695C] flex-shrink-0" />
//                 <span className="text-xs text-gray-700 font-medium truncate flex-1">{floorPlanPreview}</span>
//                 <button onClick={removeFloorPlan} className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 flex-shrink-0">✕</button>
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
//           <button onClick={onCancel} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110">
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <div className="flex border-b border-gray-100 flex-shrink-0 px-3 sm:px-4 pt-2 overflow-x-auto">
//           {editSteps.map((stepName, idx) => (
//             <button key={idx} onClick={() => setLocalStep(idx)}
//               className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${localStep === idx ? 'border-[#00695C] text-[#00695C]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
//               {stepName}
//             </button>
//           ))}
//         </div>

//         <div className="p-4 sm:p-6 overflow-y-auto flex-1">{renderStep()}</div>

//         <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex flex-wrap justify-between items-center gap-3 flex-shrink-0">
//           <div className="flex gap-2">
//             {localStep > 0 && (
//               <button onClick={() => setLocalStep(localStep - 1)} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#00695C] bg-teal-50 rounded-xl hover:bg-teal-100 transition-all">
//                 ← Back
//               </button>
//             )}
//           </div>
//           <div className="flex gap-2 sm:gap-3">
//             <button onClick={onCancel} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300">
//               Cancel
//             </button>
//             {localStep < editSteps.length - 1 ? (
//               <button onClick={() => setLocalStep(localStep + 1)} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2">
//                 Next →
//               </button>
//             ) : (
//               <button onClick={handleSave} className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2">
//                 <Save className="w-3 h-3 sm:w-4 sm:h-4" /> Save Changes
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============ BUILDER PROFILE COMPONENT ============
// const BuilderProfile = () => {
//   const navigate = useNavigate();
//   const [activeSection, setActiveSection] = useState('company');
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
//   const companyLogoInputRef = useRef(null);
//   const fileInputRefs = useRef({});

//   // ============ PROPERTIES STATE ============
//   const [properties, setProperties] = useState([
//     {
//       id: 'PROJ-001',
//       name: 'Skyline Heights Tower A',
//       type: 'Apartment',
//       status: 'Active',
//       price: '₹18,000/month',
//       area: '1450 sq ft',
//       location: 'Baner, Pune, Maharashtra',
//       postedDate: '12-06-2025',
//       description: 'Premium 3 BHK residences with clubhouse, landscaped gardens, and skyline views.',
//        images: [
//         '/villa1_1.png',
//         '/villa1_2.png',
//         '/villa1_3.png',
//         '/villa1_4.png'
//       ],
//       features: ['3 BHK', 'Clubhouse', 'Landscaped Garden', 'Skyline View'],
//       views: 412,
//       inquiries: 26,
//       bedrooms: '3',
//       bathrooms: '3',
//       furnishing: 'Semi Furnish',
//       parking: 'yes',
//       listingPurpose: 'rent',
//       expectedPrice: '18000',
//       priceType: 'negotiable',
//       maintenance: '4000',
//       availableFrom: '2025-08-01',
//       selectedAmenities: ['Gated Community', '24/7 Security', 'Gym / Fitness Center', 'Swimming Pool'],
//       propertyCity: 'Pune',
//       builtUpArea: '1450',
//       carpetArea: '1280',
//       rentalDuration: 'Long Term',
//       occupancyDetails: 'Family',
//       petFriendly: 'Yes',
//       gardenSpace: 'Yes',
//       terrace: 'Yes',
//     },
//     {
//       id: 'PROJ-002',
//       name: 'Emerald Business Park',
//       type: 'Commercial',
//       status: 'Active',
//       price: '₹85,000/month',
//       area: '2200 sq ft',
//       location: 'Whitefield, Bangalore, Karnataka',
//       postedDate: '02-05-2025',
//       description: 'Grade-A office space with modern infrastructure and ample parking.',
//       images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Emerald+Business+Park'],
//       features: ['Grade-A Office', '24/7 Power Backup', 'Ample Parking'],
//       views: 268,
//       inquiries: 14,
//       bedrooms: '0',
//       bathrooms: '4',
//       furnishing: 'Unfurnished',
//       parking: 'yes',
//       listingPurpose: 'rent',
//       expectedPrice: '85000',
//       priceType: 'fixed',
//       maintenance: '12000',
//       availableFrom: '2025-07-01',
//       selectedAmenities: ['24/7 Security', 'Power Backup', 'CCTV Surveillance', 'Lift / Elevator'],
//       propertyCity: 'Bangalore',
//       builtUpArea: '2200',
//       carpetArea: '2000',
//       rentalDuration: 'Long Term',
//       occupancyDetails: 'Company Lease',
//       petFriendly: 'No',
//       gardenSpace: 'No',
//       terrace: 'No',
//     },
//     {
//       id: 'PROJ-003',
//       name: 'Palm Meadows Villas',
//       type: 'Independent Villa',
//       status: 'Inactive',
//       price: '₹65,000/month',
//       area: '3200 sq ft',
//       location: 'ECR, Chennai, Tamil Nadu',
//       postedDate: '20-04-2025',
//       description: 'Gated villa community with private gardens and clubhouse access.',
//       images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Palm+Meadows'],
//       features: ['4 BHK', 'Private Garden', 'Clubhouse Access'],
//       views: 189,
//       inquiries: 9,
//       bedrooms: '4',
//       bathrooms: '4',
//       furnishing: 'Full Furnish',
//       parking: 'yes',
//       listingPurpose: 'rent',
//       expectedPrice: '65000',
//       priceType: 'negotiable',
//       maintenance: '6000',
//       availableFrom: '2025-09-01',
//       selectedAmenities: ['Gated Community', 'Garden', 'Swimming Pool', 'Smart Home'],
//       propertyCity: 'Chennai',
//       builtUpArea: '3200',
//       carpetArea: '2900',
//       rentalDuration: 'Flexible',
//       occupancyDetails: 'Family',
//       petFriendly: 'Yes',
//       gardenSpace: 'Yes',
//       terrace: 'Yes',
//     },
//   ]);

//   // ============ FORM STATE ============
//   const [editForm, setEditForm] = useState({
//     // Company Details
//     companyName: 'Sharma Infra Developers Pvt. Ltd.',
//     companyRegNumber: 'CIN/U45200MH2015PTC123456',
//     reraNumber: 'RERA/2025/MH/98765',
//     gstNumber: '22ABCDE1234F1Z5',
//     yearsOfExperience: '14',
//     companyWebsite: 'www.sharmainfra.com',
//     companyProfile: 'Sharma Infra Developers is a Mumbai-based real estate builder delivering residential and commercial projects across Maharashtra since 2011, known for timely delivery and RERA-compliant construction.',

//     // Authorized Person
//     authFullName: 'Rohit Sharma',
//     authDesignation: 'Director',
//     authMobile: '+91 98765 43210',
//     authEmail: 'rohit.sharma@sharmainfra.com',
//     authWhatsapp: '+91 98765 43211',

//     // Office Address
//     officeAddress: 'Office No. 501, Crystal Tower, Andheri East, Mumbai - 400093',
//     officeCity: 'Mumbai',
//     officeDistrict: 'Mumbai City',
//     officeState: 'Maharashtra',
//     officePinCode: '400093',
//     officeLandmark: 'Near Andheri Metro Station',

//     // Identity & Business Verification
//     aadhaarNumber: '1234 5678 9012',
//     panNumber: 'ABCDE1234F',

//     // Project Details
//     ongoingProjects: '6',
//     completedProjects: '22',
//     upcomingProjects: '3',
//     totalUnitsDelivered: '3800',
//     citiesOfOperation: 'Mumbai, Pune, Nashik',
//     serviceLocations: 'Andheri, Baner, Whitefield, ECR Chennai',

//     // Bank Details
//     accountHolderName: 'Sharma Infra Developers Pvt. Ltd.',
//     bankName: 'HDFC Bank',
//     accountNumber: '123456789012',
//     ifscCode: 'HDFC0001234',
//     upiId: 'sharmainfra@upi',

//     // Social Media
//     website: 'www.sharmainfra.com',
//     facebookPage: 'facebook.com/sharmainfra',
//     instagram: 'instagram.com/sharmainfra',
//     linkedIn: 'linkedin.com/company/sharmainfra',
//     youtubeChannel: 'youtube.com/sharmainfra',
//   });

//   // ============ DOCUMENTS STATE ============
//   const [documents, setDocuments] = useState({
//     profilePhoto: null,
//     companyLogo: null,
//     aadhaarCard: null,
//     panCard: null,
//     companyRegCert: null,
//     gstCert: null,
//     reraCert: null,
//     companyPanCard: null,
//     companyBrochure: null,
//     projectBrochure: null,
//     authIdProof: null,
//     officeAddressProof: null,
//   });

//   const showSuccessToast = () => {
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   // ============ FILE UPLOAD HANDLERS ============
//   const handleFileUpload = (field, file) => {
//     if (file) {
//       setDocuments(prev => ({ ...prev, [field]: file }));
//       showSuccessToast();
//     }
//   };

//   const handleProfilePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) handleFileUpload('profilePhoto', file);
//   };

//   const handleCompanyLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) handleFileUpload('companyLogo', file);
//   };

//   const handlePdfUpload = (field, file) => {
//     if (file) {
//       if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
//         setDocuments(prev => ({ ...prev, [field]: file }));
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
//       setDocuments(prev => ({ ...prev, [field]: null }));
//       if (fileInputRefs.current[field]) fileInputRefs.current[field].value = '';
//       setShowDeleteConfirm(false);
//       setDeleteItem(null);
//       showSuccessToast();
//     }
//   };

//   const handleProfilePhotoDelete = () => setShowProfilePhotoDeleteConfirm(true);

//   const confirmProfilePhotoDelete = () => {
//     setDocuments(prev => ({ ...prev, profilePhoto: null }));
//     if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
//     setShowProfilePhotoDeleteConfirm(false);
//     showSuccessToast();
//   };

//   // ============ FORM CHANGE HANDLER ============
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({ ...prev, [name]: value }));
//   };

//   // ============ NAVIGATION ============
//   const handleNavigateBack = () => {
//     if (window.history.length > 2) navigate(-1);
//     else navigate('/dashboard');
//   };

//   // ============ SAVE HANDLER ============
//   const handleSave = () => {
//     const requiredFields = ['companyName', 'companyRegNumber', 'reraNumber', 'authFullName', 'authMobile', 'authEmail', 'aadhaarNumber', 'panNumber'];
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
//     doc.text('Builder Profile Invoice', 14, 17);
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

//     section('Company Details');
//     row('Company Name', editForm.companyName);
//     row('Registration Number', editForm.companyRegNumber);
//     row('RERA Number', editForm.reraNumber);
//     row('GST Number', editForm.gstNumber);
//     row('Years of Experience', editForm.yearsOfExperience);
//     y += 4;

//     section('Authorized Person');
//     row('Full Name', editForm.authFullName);
//     row('Designation', editForm.authDesignation);
//     row('Mobile Number', editForm.authMobile);
//     row('Email Address', editForm.authEmail);
//     y += 4;

//     section('Office Address');
//     row('Address', editForm.officeAddress);
//     row('City', editForm.officeCity);
//     row('State', editForm.officeState);
//     row('PIN Code', editForm.officePinCode);
//     y += 4;

//     section('Project Details');
//     row('Ongoing Projects', editForm.ongoingProjects);
//     row('Completed Projects', editForm.completedProjects);
//     row('Upcoming Projects', editForm.upcomingProjects);
//     row('Total Units Delivered', editForm.totalUnitsDelivered);
//     row('Cities of Operation', editForm.citiesOfOperation);
//     y += 4;

//     section('Bank Details');
//     row('Account Holder', editForm.accountHolderName);
//     row('Bank Name', editForm.bankName);
//     row('Account Number', editForm.accountNumber);
//     row('IFSC Code', editForm.ifscCode);
//     row('UPI ID', editForm.upiId);

//     section('Properties Summary');
//     row('Total Properties', properties.length);
//     row('Active Listings', properties.filter(p => p.status === 'Active').length);

//     doc.setFontSize(8);
//     doc.setTextColor(150, 150, 150);
//     doc.text('This is a system-generated document.', 14, 287);

//     doc.save(`Invoice_${editForm.companyName.replace(/\s+/g, '_')}.pdf`);
//   };

//   // ============ SECTION DEFINITIONS ============
//   const sections = [
//     { id: 'company', title: 'Company Details', icon: Building2 },
//     { id: 'authorized', title: 'Authorized Person', icon: User },
//     { id: 'office', title: 'Office Address', icon: MapPin },
//     { id: 'identity', title: 'Identity & Verification', icon: Shield },
//     { id: 'project', title: 'Project Details', icon: BarChart3 },
//     { id: 'documents', title: 'Upload Documents', icon: FileText },
//     { id: 'bank', title: 'Bank Details', icon: Banknote },
//     { id: 'social', title: 'Social Media', icon: Share2 },
//   ];

//   // ============ PROPERTY HANDLERS ============
//   const handleViewDetails = (property) => { setSelectedProperty(property); setShowPropertyDetails(true); };
//   const handleEditProperty = (property) => { setEditingProperty({ ...property }); setShowEditPropertyModal(true); };

//   const handleToggleStatus = (property) => {
//     const newStatus = property.status === 'Active' ? 'Inactive' : 'Active';
//     setProperties(prev => prev.map(p => p.id === property.id ? { ...p, status: newStatus } : p));
//     showSuccessToast();
//   };

//   const handleAddPropertyImages = (propertyId, files) => {
//     const fileArray = Array.from(files);
//     if (fileArray.length === 0) return;
//     const newUrls = fileArray.map((f) => URL.createObjectURL(f));
//     setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, images: [...(p.images || []), ...newUrls] } : p));
//     setSelectedProperty(prev => prev && prev.id === propertyId ? { ...prev, images: [...(prev.images || []), ...newUrls] } : prev);
//     showSuccessToast();
//   };

//   const handleRemovePropertyImage = (propertyId, imageIndex) => {
//     setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, images: (p.images || []).filter((_, i) => i !== imageIndex) } : p));
//     setSelectedProperty(prev => prev && prev.id === propertyId ? { ...prev, images: (prev.images || []).filter((_, i) => i !== imageIndex) } : prev);
//     showSuccessToast();
//   };

//   const handleSavePropertyEdit = (updatedProperty) => {
//     if (updatedProperty) setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
//     setShowEditPropertyModal(false);
//     setEditingProperty(null);
//     showSuccessToast();
//   };

//   const handleDeleteProperty = (property) => { setPropertyToDelete(property); setShowDeletePropertyConfirm(true); };

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
//       const s = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(prop =>
//         prop.name.toLowerCase().includes(s) ||
//         prop.id.toLowerCase().includes(s) ||
//         prop.location.toLowerCase().includes(s) ||
//         prop.type.toLowerCase().includes(s) ||
//         prop.price.toLowerCase().includes(s) ||
//         prop.area.toLowerCase().includes(s)
//       );
//     }
//     if (filterStatus && filterStatus !== 'all') {
//       filtered = filtered.filter(prop => prop.status.toLowerCase() === filterStatus.toLowerCase());
//     }
//     return filtered;
//   };

//   const filteredProperties = getFilteredProperties();
//   const clearSearch = () => setSearchTerm('');

//   // ============ RENDER HELPERS ============
//   const RingBadge = ({ pct }) => {
//     const circumference = 2 * Math.PI * 15.5;
//     const dashOffset = circumference - (pct / 100) * circumference;
//     return (
//       <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 border border-[#00695C]/15 rounded-2xl pl-2 pr-4 py-1.5 shadow-sm">
//         <div className="relative w-9 h-9 flex-shrink-0">
//           <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
//             <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00695C1A" strokeWidth="3" />
//             <circle cx="18" cy="18" r="15.5" fill="none" stroke="url(#ringGradSharedB)" strokeWidth="3" strokeLinecap="round"
//               strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
//             <defs>
//               <linearGradient id="ringGradSharedB" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#00695C" />
//                 <stop offset="100%" stopColor="#26A69A" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#00695C]">{pct}%</span>
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
//             <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">{title}</h2>
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
//     <div className="group/acard relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] border border-[#00695C]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${delay}s` }}>
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
//           <label className="block text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-wider group-hover/acard:text-[#00695C] transition-colors duration-300">{label}</label>
//           {children ? children : (
//             <div className="text-xs sm:text-[13px] text-gray-800 font-semibold break-words">
//               {value || <span className="text-gray-400 font-medium italic">Not specified</span>}
//             </div>
//           )}
//         </div>
//         {value && !children && <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C]/30 group-hover/acard:text-[#00695C] flex-shrink-0 transition-colors duration-300" />}
//       </div>
//       <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
//         <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover/acard:w-full transition-all duration-700 ease-out" />
//       </div>
//     </div>
//   );

//   const DocCard = ({ label, icon, field, isImage }) => {
//     const file = documents[field];
//     const hasFile = file !== null && file !== undefined;
//     return (
//       <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10 hover:border-[#00695C]/30">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         <div className="relative p-2.5 sm:p-3">
//           <div className="flex items-center justify-between mb-1.5 sm:mb-2">
//             <div className="flex items-center gap-1.5 sm:gap-2">
//               <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300">
//                 <div className="text-white">{icon}</div>
//               </div>
//               <span className="text-[10px] sm:text-xs font-bold text-gray-700">{label}</span>
//             </div>
//             {hasFile && <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">✓</span>}
//           </div>

//           {hasFile ? (
//             <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg p-1 sm:p-1.5 border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
//               {isImage ? (
//                 <button onClick={() => {
//                   setLightboxItems([{ type: 'image', url: URL.createObjectURL(file), name: file.name || label, field }]);
//                   setLightboxIndex(0);
//                   setShowMediaLightbox(true);
//                 }} className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1">
//                   <Image className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                   <span className="truncate">{file.name || 'Image'}</span>
//                 </button>
//               ) : (
//                 <button onClick={() => handlePdfView(field)} className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1">
//                   <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                   <span className="truncate">{file.name || 'Document'}</span>
//                 </button>
//               )}
//               <button onClick={() => removeFile(field)} className="p-0.5 sm:p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300 flex-shrink-0" title="Delete">
//                 <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//               </button>
//             </div>
//           ) : (
//             <div className="border-2 border-dashed border-gray-200 rounded-lg p-1.5 sm:p-2 text-center hover:border-[#00695C] hover:bg-[#00695C]/5 transition-all duration-300 group/upload">
//               <label className="block cursor-pointer">
//                 <div className="flex items-center justify-center gap-1.5 sm:gap-2">
//                   <div className="p-0.5 sm:p-1 bg-gray-100 rounded-lg group-hover/upload:bg-[#00695C]/10 transition-colors duration-300">
//                     <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover/upload:text-[#00695C] transition-colors duration-300" />
//                   </div>
//                   <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 group-hover/upload:text-[#00695C] transition-colors duration-300">Upload</span>
//                 </div>
//                 <input type="file" className="hidden" accept={isImage ? 'image/*' : '.pdf'} onChange={(e) => {
//                   const f = e.target.files[0];
//                   if (f) { isImage ? handleFileUpload(field, f) : handlePdfUpload(field, f); }
//                   e.target.value = '';
//                 }} />
//               </label>
//             </div>
//           )}
//         </div>
//         <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
//           <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover:w-full transition-all duration-700 ease-out" />
//         </div>
//       </div>
//     );
//   };

//   // ============ SECTION CONTENT RENDER ============
//   const renderSectionContent = () => {
//     switch (activeSection) {
//       case 'company': {
//         const fields = [editForm.companyName, editForm.companyRegNumber, editForm.reraNumber, editForm.gstNumber, editForm.yearsOfExperience, editForm.companyWebsite, editForm.companyProfile, documents.companyLogo];
//         const filledCount = fields.filter(Boolean).length;
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Company Details" subtitle="Manage your company / builder information" filled={filledCount} total={fields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Builder / Company Name" value={editForm.companyName} icon={<Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="Company Registration Number" value={editForm.companyRegNumber} icon={<Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="RERA Registration Number" value={editForm.reraNumber} icon={<BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//                 <AnimatedCard label="GST Number" value={editForm.gstNumber || 'Not provided'} icon={<Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Years of Experience" value={editForm.yearsOfExperience} icon={<Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Company Website" value={editForm.companyWebsite || 'Not provided'} icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
//                 <AnimatedCard label="Company Profile / About Us" value={editForm.companyProfile} icon={<FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47} />
//                 <AnimatedCard label="Company Logo" icon={<Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.54}>
//                   {documents.companyLogo ? (
//                     <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
//                       <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Uploaded
//                     </span>
//                   ) : (
//                     <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No logo uploaded</span>
//                   )}
//                 </AnimatedCard>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'authorized': {
//         const fields = [editForm.authFullName, editForm.authDesignation, editForm.authMobile, editForm.authEmail, editForm.authWhatsapp, documents.profilePhoto];
//         const filledCount = fields.filter(Boolean).length;
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Authorized Person Details" subtitle="Details of the representative authorized to act on behalf of the company" filled={filledCount} total={fields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Full Name" value={editForm.authFullName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="Designation" value={editForm.authDesignation} icon={<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="Mobile Number" value={editForm.authMobile} icon={<Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Email Address" value={editForm.authEmail} icon={<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//                 <AnimatedCard label="WhatsApp Number" value={editForm.authWhatsapp || 'Not provided'} icon={<Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Profile Photo" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4}>
//                   {documents.profilePhoto ? (
//                     <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
//                       <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Uploaded
//                     </span>
//                   ) : (
//                     <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">No photo uploaded</span>
//                   )}
//                 </AnimatedCard>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'office': {
//         const fields = [editForm.officeAddress, editForm.officeCity, editForm.officeDistrict, editForm.officeState, editForm.officePinCode, editForm.officeLandmark];
//         const filledCount = fields.filter(Boolean).length;
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Office Address" subtitle="Your registered office address" filled={filledCount} total={fields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="City" value={editForm.officeCity} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="District" value={editForm.officeDistrict} icon={<Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="State" value={editForm.officeState} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//                 <AnimatedCard label="PIN Code" value={editForm.officePinCode} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Landmark" value={editForm.officeLandmark || 'Not provided'} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'identity': {
//         const fields = [editForm.aadhaarNumber, editForm.panNumber, documents.aadhaarCard, documents.panCard, documents.companyRegCert, documents.gstCert, documents.reraCert, documents.companyPanCard];
//         const filledCount = fields.filter(Boolean).length;
//         const leftDocs = [
//           { field: 'companyRegCert', label: 'Upload Company Registration Certificate' },
//           { field: 'aadhaarCard', label: 'Upload Aadhaar Card' },
//           { field: 'panCard', label: 'Upload PAN Card' },
//         ];
//         const rightDocs = [
//           { field: 'gstCert', label: 'Upload GST Certificate (Optional)' },
//           { field: 'reraCert', label: 'Upload RERA Certificate' },
//           { field: 'companyPanCard', label: 'Upload Company PAN Card (Optional)' },
//         ];
//         const DocRow = (d, idx, baseDelay) => (
//           <AnimatedCard key={d.field} label={d.label} icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={baseDelay + idx * 0.07}>
//             {documents[d.field] ? (
//               <div className="flex items-center gap-1.5 sm:gap-2">
//                 <button onClick={() => handlePdfView(d.field)} className="text-[10px] sm:text-xs text-[#00695C] font-bold hover:underline flex items-center gap-0.5 sm:gap-1">
//                   <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> View Document
//                 </button>
//                 <button onClick={() => handlePdfDelete(d.field)} className="text-red-400 hover:text-red-600 transition-colors">
//                   <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                 </button>
//               </div>
//             ) : (
//               <span className="text-[10px] sm:text-xs text-gray-400 font-medium italic">Not uploaded</span>
//             )}
//           </AnimatedCard>
//         );
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Identity & Business Verification" subtitle="Verify identity and business documents" filled={filledCount} total={fields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 {leftDocs.map((d, idx) => DocRow(d, idx, 0.12))}
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 {rightDocs.map((d, idx) => DocRow(d, idx, 0.12))}
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'project': {
//         const fields = [editForm.ongoingProjects, editForm.completedProjects, editForm.upcomingProjects, editForm.totalUnitsDelivered, editForm.citiesOfOperation, editForm.serviceLocations];
//         const filledCount = fields.filter(Boolean).length;
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Project Details" subtitle="Track record of your projects and delivery" filled={filledCount} total={fields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Number of Ongoing Projects" value={editForm.ongoingProjects} icon={<Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
//                 <AnimatedCard label="Number of Completed Projects" value={editForm.completedProjects} icon={<CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
//                 <AnimatedCard label="Number of Upcoming Projects" value={editForm.upcomingProjects} icon={<TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <AnimatedCard label="Total Units Delivered" value={editForm.totalUnitsDelivered} icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
//                 <AnimatedCard label="Cities of Operation" value={editForm.citiesOfOperation} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
//                 <AnimatedCard label="Service Locations" value={editForm.serviceLocations} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'bank': {
//         const fields = [editForm.accountHolderName, editForm.bankName, editForm.accountNumber, editForm.ifscCode, editForm.upiId];
//         const filledCount = fields.filter(Boolean).length;
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Bank Details" subtitle="Your company's banking and financial information" filled={filledCount} total={fields.length} />
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
//         const fields = [editForm.website, editForm.facebookPage, editForm.instagram, editForm.linkedIn, editForm.youtubeChannel];
//         const filledCount = fields.filter(Boolean).length;
//         const getSocialUrl = (platform, value) => {
//           if (!value) return '#';
//           if (value.startsWith('http://') || value.startsWith('https://')) return value;
//           const clean = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
//           switch (platform) {
//             case 'website': return `https://${clean}`;
//             case 'facebook': return `https://www.facebook.com/${clean}`;
//             case 'instagram': return `https://www.instagram.com/${clean}`;
//             case 'linkedin': return `https://www.linkedin.com/${clean}`;
//             case 'youtube': return `https://www.youtube.com/${clean}`;
//             default: return `https://${clean}`;
//           }
//         };
//         const SocialLink = ({ label, icon, value, platform, delay }) => (
//           <AnimatedCard label={label} icon={icon} delay={delay}>
//             {value ? (
//               <a href={getSocialUrl(platform, value)} target="_blank" rel="noopener noreferrer"
//                 className="text-xs sm:text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-1.5 sm:gap-2 transition-all duration-300">
//                 {value} <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline" />
//               </a>
//             ) : (
//               <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not provided</span>
//             )}
//           </AnimatedCard>
//         );
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Social Media & Online Presence" subtitle="Your company's online presence and social media links" filled={filledCount} total={fields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
//               <div className="space-y-3 w-full">
//                 <SocialLink label="Website" icon={<Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.website} platform="website" delay={0.05} />
//                 <SocialLink label="Facebook Page" icon={<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.facebookPage} platform="facebook" delay={0.12} />
//                 <SocialLink label="Instagram" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.instagram} platform="instagram" delay={0.19} />
//               </div>
//               <div className="space-y-3 w-full">
//                 <SocialLink label="LinkedIn" icon={<Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.linkedIn} platform="linkedin" delay={0.26} />
//                 <SocialLink label="YouTube Channel" icon={<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} value={editForm.youtubeChannel} platform="youtube" delay={0.33} />
//               </div>
//             </div>
//           </div>
//         );
//       }

//       case 'documents': {
//         const docFields = ['companyLogo', 'companyBrochure', 'projectBrochure', 'companyRegCert', 'reraCert', 'gstCert', 'panCard', 'authIdProof', 'officeAddressProof'];
//         const filledCount = docFields.filter(f => documents[f] !== null && documents[f] !== undefined).length;
//         const docList = [
//           { field: 'companyLogo', label: 'Company Logo', icon: <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, isImage: true },
//           { field: 'companyBrochure', label: 'Company Profile Brochure (PDF)', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'projectBrochure', label: 'Project Brochure(s)', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'companyRegCert', label: 'Company Registration Certificate', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'reraCert', label: 'RERA Certificate', icon: <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'gstCert', label: 'GST Certificate (Optional)', icon: <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'panCard', label: 'PAN Card', icon: <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'authIdProof', label: 'Authorized Signatory ID Proof', icon: <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//           { field: 'officeAddressProof', label: 'Office Address Proof', icon: <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
//         ];
//         return (
//           <div className="w-full animate-slideUp">
//             <SectionHeader title="Upload Company Documents" subtitle="All your important company documents in one place" filled={filledCount} total={docFields.length} />
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 w-full">
//               {docList.map((d) => <DocCard key={d.field} {...d} />)}
//             </div>
//           </div>
//         );
//       }

//       default:
//         return null;
//     }
//   };

//   // ============ RENDER PROPERTIES SECTION ============
//   const renderPropertiesSection = () => (
//     <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
//         <div className="flex items-center gap-2 sm:gap-2.5">
//           <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
//             <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
//           </div>
//           <div>
//             <h2 className="text-sm sm:text-base font-bold text-gray-800">My Properties</h2>
//             <p className="text-[9px] sm:text-[11px] text-gray-500">Manage your project / property listings</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto flex-wrap">
//           <div className="relative flex-1 sm:flex-initial min-w-[100px] sm:min-w-[120px]">
//             <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-2 sm:px-3 py-1 sm:py-1.5 pl-6 sm:pl-8 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs" />
//             <Search className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
//             {searchTerm && (
//               <button onClick={clearSearch} className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
//                 <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               </button>
//             )}
//           </div>

//           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
//             className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-[10px] sm:text-xs bg-white">
//             <option value="all">All</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>

//           <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
//             <button onClick={() => setViewMode('grid')} className={`p-1 sm:p-1.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#00695C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`} aria-label="Grid view">
//               <GridIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
//             </button>
//             <button onClick={() => setViewMode('list')} className={`p-1 sm:p-1.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-[#00695C] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`} aria-label="List view">
//               <List className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredProperties.length > 0 ? (
//         <div>
//           {viewMode === 'grid' ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//               {filteredProperties.map((property, index) => (
//                 <div key={property.id} className="group relative bg-teal-100/30 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#00695C]/10 overflow-hidden hover:-translate-y-1" style={{ animationDelay: `${index * 0.08}s` }}>
//                   <div className="relative w-full h-40 sm:h-46 bg-gray-100 overflow-hidden">
//                     <img src={property.images?.[0] || 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'} alt={property.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'; }} />
//                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 sm:p-3">
//                       <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">{property.price}</p>
//                     </div>
//                     {property.images && property.images.length > 1 && (
//                       <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5">
//                         <Image className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {property.images.length}
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
//                     <div className="flex items-center justify-between gap-1 sm:gap-2">
//                       <h3 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#00695C] transition-colors duration-300 line-clamp-1 flex-1">{property.name}</h3>
//                       <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
//                         <span className={`text-[9px] sm:text-[10px] font-bold ${property.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
//                           {property.status === 'Active' ? 'Active' : 'Inactive'}
//                         </span>
//                         <ToggleSwitch isOn={property.status === 'Active'} onToggle={() => handleToggleStatus(property)} size="sm" />
//                       </div>
//                     </div>

//                     <p className="text-[9px] sm:text-xs text-gray-500 font-medium flex items-center gap-1 sm:gap-2">
//                       <span className="bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">{property.id}</span>
//                       <span className="w-1 h-1 rounded-full bg-gray-300" />
//                       <span>{property.postedDate}</span>
//                     </p>

//                     <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
//                       <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00695C] flex-shrink-0" />
//                       <span className="font-medium truncate">{property.location}</span>
//                     </div>

//                     <div className="flex flex-wrap gap-1 sm:gap-1.5">
//                       {[
//                         { icon: Building, label: property.type },
//                         { icon: Layers, label: property.area },
//                         { icon: Bed, label: property.bedrooms || 'N/A' },
//                       ].map((item, idx) => (
//                         <span key={idx} className="flex items-center gap-0.5 sm:gap-1 bg-[#00695C]/5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-medium text-[#00695C] border border-[#00695C]/10">
//                           <item.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {item.label}
//                         </span>
//                       ))}
//                     </div>

//                     <div className="flex items-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
//                       <button onClick={() => handleViewDetails(property)} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
//                         <ViewIcon className="w-3 h-3 sm:w-4 sm:h-4" /> View
//                       </button>
//                       <button onClick={() => handleEditProperty(property)} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
//                         <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit
//                       </button>
//                       <button onClick={() => handleDeleteProperty(property)} className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-[10px] sm:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
//                         <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-gray-100">
//               <table className="w-full text-[10px] sm:text-sm table-fixed">
//                 <colgroup>
//                   <col className="w-[38%] lg:w-[24%]" />
//                   <col className="w-[18%] lg:w-[11%]" />
//                   <col className="hidden lg:table-column lg:w-[11%]" />
//                   <col className="w-[20%] lg:w-[14%]" />
//                   <col className="hidden lg:table-column lg:w-[9%]" />
//                   <col className="hidden lg:table-column lg:w-[13%]" />
//                   <col className="w-[24%] lg:w-[18%]" />
//                 </colgroup>
//                 <thead>
//                   <tr className="border-b-2 border-gray-200 bg-gray-50">
//                     <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
//                     <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
//                     <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
//                     <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
//                     <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
//                     <th className="hidden lg:table-cell text-left py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
//                     <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[9px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredProperties.map((property) => (
//                     <tr key={property.id} className="hover:bg-[#00695C]/3 transition-colors duration-200 group">
//                       <td className="py-2 sm:py-3 px-2 sm:px-4">
//                         <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//                           <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                             <img src={property.images?.[0] || 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'} alt={property.name} className="w-full h-full object-cover"
//                               onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'; }} />
//                           </div>
//                           <div className="min-w-0">
//                             <p className="font-bold text-[10px] sm:text-sm text-gray-800 group-hover:text-[#00695C] transition-colors truncate">{property.name}</p>
//                             <p className="text-[9px] sm:text-xs text-gray-500 truncate">{property.id}</p>
//                             <p className="text-[9px] sm:text-xs text-gray-400 truncate lg:hidden">{property.type} · {property.location}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4">
//                         <div className="flex items-center gap-1">
//                           <ToggleSwitch isOn={property.status === 'Active'} onToggle={() => handleToggleStatus(property)} size="sm" />
//                           <span className={`hidden sm:inline text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${property.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
//                             {property.status}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">{property.type}</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-bold text-gray-800 truncate">{property.price}</td>
//                       <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">{property.area}</td>
//                       <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">{property.location}</td>
//                       <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
//                         <div className="flex items-center justify-end gap-1 sm:gap-1.5 lg:gap-2">
//                           <button onClick={() => handleViewDetails(property)} className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105" title="View">
//                             <ViewIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
//                             <span className="hidden lg:inline">View</span>
//                           </button>
//                           <button onClick={() => handleEditProperty(property)} className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105" title="Edit">
//                             <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
//                             <span className="hidden lg:inline">Edit</span>
//                           </button>
//                           <button onClick={() => handleDeleteProperty(property)} className="flex items-center justify-center gap-1.5 p-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105" title="Delete">
//                             <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
//                             <span className="hidden lg:inline">Delete</span>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="text-center py-6 sm:py-8">
//           <div className="bg-gray-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
//             <Home className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
//           </div>
//           <p className="text-gray-500 font-medium text-xs sm:text-sm">No properties found</p>
//           <p className="text-[10px] sm:text-xs text-gray-400">
//             {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : "You haven't added any properties yet"}
//           </p>
//           {(searchTerm || filterStatus !== 'all') && (
//             <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">
//               Clear Filters
//             </button>
//           )}
//         </div>
//       )}

//       <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t-2 border-gray-100 flex justify-between text-[8px] sm:text-[10px] text-gray-500">
//         <span>Showing {filteredProperties.length} of {properties.length} properties</span>
//         <span>Total: {properties.length}</span>
//       </div>
//     </div>
//   );

//   // ============ EDIT PROFILE MODAL FIELD GROUPS ============
//   const inputCls = "w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300";
//   const cardCls = "space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10";
//   const cardTitle = (icon, text) => (
//     <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
//       <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">{icon}</div>
//       {text}
//     </h3>
//   );

//   // ============ MAIN RENDER ============
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-16 sm:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
//       </div>

//       {showPdfViewer && pdfToView && (
//         <PdfViewerModal file={pdfToView} onClose={() => { setShowPdfViewer(false); setPdfToView(null); }} />
//       )}

//       {showMediaLightbox && lightboxItems.length > 0 && (
//         <MediaLightboxModal items={lightboxItems} index={lightboxIndex} onNavigate={setLightboxIndex}
//           onDelete={() => {
//             const item = lightboxItems[lightboxIndex];
//             if (item) {
//               setDocuments(prev => ({ ...prev, [item.field]: null }));
//               setLightboxItems([]);
//               setShowMediaLightbox(false);
//               showSuccessToast();
//             }
//           }}
//           onClose={() => { setShowMediaLightbox(false); setLightboxItems([]); setLightboxIndex(0); }} />
//       )}

//       {showDeleteConfirm && (
//         <DeleteConfirmModal title="Confirm Delete" message="Are you sure you want to delete this file? This action cannot be undone."
//           onConfirm={confirmDelete} onCancel={() => { setShowDeleteConfirm(false); setDeleteItem(null); }} />
//       )}

//       {showProfilePhotoDeleteConfirm && (
//         <DeleteConfirmModal title="Delete Profile Photo" message="Are you sure you want to delete your profile photo? This action cannot be undone."
//           onConfirm={confirmProfilePhotoDelete} onCancel={() => setShowProfilePhotoDeleteConfirm(false)} />
//       )}

//       {/* Edit Profile Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
//           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl mx-auto overflow-hidden max-h-[80vh] sm:max-h-[75vh] flex flex-col animate-scaleIn">
//             <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
//               <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
//                 <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl"><Edit2 className="w-4 h-4 sm:w-5 sm:h-5" /></div>
//                 Edit Builder Profile
//               </h2>
//               <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110">
//                 <X className="w-5 h-5 sm:w-6 sm:h-6" />
//               </button>
//             </div>
//             <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 w-full bg-gray-50">

//               {/* Company Details */}
//               <div className={cardCls}>
//                 {cardTitle(<Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Company Details')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏢 Builder / Company Name *</label>
//                     <input type="text" name="companyName" value={editForm.companyName} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📋 Company Registration Number *</label>
//                     <input type="text" name="companyRegNumber" value={editForm.companyRegNumber} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📋 RERA Registration Number *</label>
//                     <input type="text" name="reraNumber" value={editForm.reraNumber} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">#️⃣ GST Number</label>
//                     <input type="text" name="gstNumber" value={editForm.gstNumber} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">⭐ Years of Experience *</label>
//                     <input type="number" name="yearsOfExperience" value={editForm.yearsOfExperience} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌐 Company Website (Optional)</label>
//                     <input type="text" name="companyWebsite" value={editForm.companyWebsite} onChange={handleEditChange} className={inputCls} placeholder="www.company.com" />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🖼️ Company Logo *</label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button onClick={() => companyLogoInputRef.current?.click()} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">Upload</button>
//                       {documents.companyLogo && (
//                         <button onClick={() => removeFile('companyLogo')} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
//                       )}
//                       <input ref={companyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleCompanyLogoUpload} />
//                     </div>
//                     {documents.companyLogo && <p className="text-[10px] sm:text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1"><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {documents.companyLogo.name}</p>}
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📝 Company Profile / About Us *</label>
//                     <textarea name="companyProfile" value={editForm.companyProfile} onChange={handleEditChange} rows="3" className={`${inputCls} resize-y`} placeholder="Describe your company background" />
//                   </div>
//                 </div>
//               </div>

//               {/* Authorized Person */}
//               <div className={cardCls}>
//                 {cardTitle(<User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Authorized Person Details')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">👤 Full Name *</label>
//                     <input type="text" name="authFullName" value={editForm.authFullName} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">💼 Designation *</label>
//                     <input type="text" name="authDesignation" value={editForm.authDesignation} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📱 Mobile Number *</label>
//                     <input type="text" name="authMobile" value={editForm.authMobile} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">✉️ Email Address *</label>
//                     <input type="email" name="authEmail" value={editForm.authEmail} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📱 WhatsApp Number</label>
//                     <input type="text" name="authWhatsapp" value={editForm.authWhatsapp} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📸 Profile Photo *</label>
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <button onClick={() => profilePhotoInputRef.current?.click()} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">Upload</button>
//                       {documents.profilePhoto && (
//                         <button onClick={handleProfilePhotoDelete} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
//                       )}
//                       <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Office Address */}
//               <div className={cardCls}>
//                 {cardTitle(<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Office Address')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📍 Office Address *</label>
//                     <textarea name="officeAddress" value={editForm.officeAddress} onChange={handleEditChange} rows="2" className={`${inputCls} resize-y`} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏙️ City *</label>
//                     <input type="text" name="officeCity" value={editForm.officeCity} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🗺️ District *</label>
//                     <input type="text" name="officeDistrict" value={editForm.officeDistrict} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌍 State *</label>
//                     <input type="text" name="officeState" value={editForm.officeState} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📍 PIN Code *</label>
//                     <input type="text" name="officePinCode" value={editForm.officePinCode} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📌 Landmark</label>
//                     <input type="text" name="officeLandmark" value={editForm.officeLandmark} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                 </div>
//               </div>

//               {/* Identity & Business Verification */}
//               <div className={cardCls}>
//                 {cardTitle(<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Identity & Business Verification')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🆔 Aadhaar Number *</label>
//                     <input type="text" name="aadhaarNumber" value={editForm.aadhaarNumber} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📄 PAN Number *</label>
//                     <input type="text" name="panNumber" value={editForm.panNumber} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   {[
//                     { field: 'aadhaarCard', label: 'Upload Aadhaar Card *' },
//                     { field: 'panCard', label: 'Upload PAN Card *' },
//                     { field: 'companyRegCert', label: 'Upload Company Registration Certificate *' },
//                     { field: 'gstCert', label: 'Upload GST Certificate (Optional)' },
//                     { field: 'reraCert', label: 'Upload RERA Certificate *' },
//                     { field: 'companyPanCard', label: 'Upload Company PAN Card (Optional)' },
//                   ].map((d) => (
//                     <div className="space-y-1 sm:space-y-1.5 w-full" key={d.field}>
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📎 {d.label}</label>
//                       <div className="flex items-center gap-2 sm:gap-3">
//                         <button onClick={() => fileInputRefs.current[d.field]?.click()} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">Upload</button>
//                         {documents[d.field] && (
//                           <button onClick={() => handlePdfDelete(d.field)} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
//                         )}
//                         <input ref={el => fileInputRefs.current[d.field] = el} type="file" className="hidden" accept=".pdf"
//                           onChange={(e) => { const f = e.target.files[0]; if (f) handlePdfUpload(d.field, f); e.target.value = ''; }} />
//                       </div>
//                       {documents[d.field] && <p className="text-[10px] sm:text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1"><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {documents[d.field].name}</p>}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Project Details */}
//               <div className={cardCls}>
//                 {cardTitle(<BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Project Details')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏗️ Number of Ongoing Projects</label>
//                     <input type="number" name="ongoingProjects" value={editForm.ongoingProjects} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">✅ Number of Completed Projects</label>
//                     <input type="number" name="completedProjects" value={editForm.completedProjects} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📅 Number of Upcoming Projects</label>
//                     <input type="number" name="upcomingProjects" value={editForm.upcomingProjects} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏠 Total Units Delivered</label>
//                     <input type="number" name="totalUnitsDelivered" value={editForm.totalUnitsDelivered} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌍 Cities of Operation</label>
//                     <input type="text" name="citiesOfOperation" value={editForm.citiesOfOperation} onChange={handleEditChange} className={inputCls} placeholder="e.g. Mumbai, Pune, Nashik" />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full md:col-span-2">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📍 Service Locations</label>
//                     <input type="text" name="serviceLocations" value={editForm.serviceLocations} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                 </div>
//               </div>

//               {/* Upload Company Documents */}
//               <div className={cardCls}>
//                 {cardTitle(<FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Upload Company Documents')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   {[
//                     { field: 'companyLogo', label: 'Company Logo *', isImage: true, ref: companyLogoInputRef },
//                     { field: 'companyBrochure', label: 'Company Profile Brochure (PDF)' },
//                     { field: 'projectBrochure', label: 'Project Brochure(s)' },
//                     { field: 'companyRegCert', label: 'Company Registration Certificate *' },
//                     { field: 'reraCert', label: 'RERA Certificate *' },
//                     { field: 'gstCert', label: 'GST Certificate (Optional)' },
//                     { field: 'panCard', label: 'PAN Card *' },
//                     { field: 'authIdProof', label: 'Authorized Signatory ID Proof *' },
//                     { field: 'officeAddressProof', label: 'Office Address Proof *' },
//                   ].map((d) => (
//                     <div className="space-y-1 sm:space-y-1.5 w-full" key={d.field}>
//                       <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📎 {d.label}</label>
//                       <div className="flex items-center gap-2 sm:gap-3">
//                         <button
//                           onClick={() => d.isImage ? d.ref.current?.click() : fileInputRefs.current[d.field]?.click()}
//                           className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300">
//                           Upload
//                         </button>
//                         {documents[d.field] && (
//                           <button onClick={() => removeFile(d.field)} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300">Delete</button>
//                         )}
//                         {!d.isImage && (
//                           <input ref={el => fileInputRefs.current[d.field] = el} type="file" className="hidden" accept=".pdf"
//                             onChange={(e) => { const f = e.target.files[0]; if (f) handlePdfUpload(d.field, f); e.target.value = ''; }} />
//                         )}
//                       </div>
//                       {documents[d.field] && <p className="text-[10px] sm:text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1"><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {documents[d.field].name}</p>}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Bank Details */}
//               <div className={cardCls}>
//                 {cardTitle(<Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Bank Details')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">👤 Account Holder Name</label>
//                     <input type="text" name="accountHolderName" value={editForm.accountHolderName} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🏦 Bank Name</label>
//                     <input type="text" name="bankName" value={editForm.bankName} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">💳 Account Number</label>
//                     <input type="text" name="accountNumber" value={editForm.accountNumber} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🔢 IFSC Code</label>
//                     <input type="text" name="ifscCode" value={editForm.ifscCode} onChange={handleEditChange} className={inputCls} />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📱 UPI ID</label>
//                     <input type="text" name="upiId" value={editForm.upiId} onChange={handleEditChange} className={inputCls} placeholder="example@upi" />
//                   </div>
//                 </div>
//               </div>

//               {/* Social Media */}
//               <div className={cardCls}>
//                 {cardTitle(<Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />, 'Social Media & Online Presence')}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">🌐 Website</label>
//                     <input type="text" name="website" value={editForm.website} onChange={handleEditChange} className={inputCls} placeholder="www.example.com" />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📘 Facebook Page</label>
//                     <input type="text" name="facebookPage" value={editForm.facebookPage} onChange={handleEditChange} className={inputCls} placeholder="facebook.com/yourpage" />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">📸 Instagram</label>
//                     <input type="text" name="instagram" value={editForm.instagram} onChange={handleEditChange} className={inputCls} placeholder="instagram.com/yourpage" />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">💼 LinkedIn</label>
//                     <input type="text" name="linkedIn" value={editForm.linkedIn} onChange={handleEditChange} className={inputCls} placeholder="linkedin.com/company/yourcompany" />
//                   </div>
//                   <div className="space-y-1 sm:space-y-1.5 w-full">
//                     <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">▶️ YouTube Channel</label>
//                     <input type="text" name="youtubeChannel" value={editForm.youtubeChannel} onChange={handleEditChange} className={inputCls} placeholder="youtube.com/yourchannel" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0">
//               <button onClick={() => setShowEditModal(false)} className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
//                 Cancel
//               </button>
//               <button onClick={handleSave} disabled={isLoading}
//                 className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs sm:text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
//                 {isLoading ? <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
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

//       {showPropertyDetails && selectedProperty && (
//         <PropertyDetailsModal property={selectedProperty} onClose={() => { setShowPropertyDetails(false); setSelectedProperty(null); }}
//           onAddImages={handleAddPropertyImages} onRemoveImage={handleRemovePropertyImage} onToggleStatus={handleToggleStatus}
//           onEdit={handleEditProperty} onDelete={handleDeleteProperty} />
//       )}

//       {showEditPropertyModal && editingProperty && (
//         <EditPropertyModal property={editingProperty} onSave={handleSavePropertyEdit}
//           onCancel={() => { setShowEditPropertyModal(false); setEditingProperty(null); }} />
//       )}

//       {showDeletePropertyConfirm && propertyToDelete && (
//         <DeleteConfirmModal title="Delete Property" message={`Are you sure you want to delete "${propertyToDelete.name}"? This action cannot be undone.`}
//           onConfirm={confirmDeleteProperty} onCancel={() => { setShowDeletePropertyConfirm(false); setPropertyToDelete(null); }} />
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
//               <button onClick={handleNavigateBack} className="relative p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group border border-[#00695C]/10 overflow-hidden" aria-label="Go back">
//                 <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00695C]/0 to-[#26A69A]/0 group-hover:from-[#00695C]/10 group-hover:to-[#26A69A]/10 transition-all duration-300" />
//                 <ArrowLeft className="relative w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-[#00695C] group-hover:-translate-x-0.5 transition-all duration-300" />
//               </button>
//               <div>
//                 <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-2 sm:gap-3 relative">
//                   <div className="relative flex-shrink-0">
//                     <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] blur-lg opacity-40 animate-pulse-slow" />
//                     <div className="absolute -inset-0.5 sm:-inset-1 rounded-xl sm:rounded-2xl border-2 border-[#26A69A]/30 animate-spin-slow" />
//                     <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl shadow-lg">
//                       <Building2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
//                     </div>
//                   </div>
//                   <span className="relative text-base sm:text-xl md:text-2xl lg:text-3xl">
//                     Builder Profile
//                     <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
//                   </span>
//                 </h1>
//                 <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1.5 ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
//                   <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#26A69A] animate-pulse" />
//                   <span className="hidden lg:inline">Manage your builder/company profile and project listings</span>
//                   <span className="inline lg:hidden">Manage your profile</span>
//                 </p>
//               </div>
//             </div>
//             <button onClick={() => setShowEditModal(true)}
//               className="relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group text-xs sm:text-sm overflow-hidden">
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

//           <button onClick={handleDownloadInvoice} title="Download Invoice PDF"
//             className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-md hover:shadow-lg hover:from-[#005A4F] hover:to-[#1B9E8E] hover:scale-105 transition-all duration-300">
//             <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//             <span className="hidden lg:inline">Download Invoice</span>
//           </button>

//           <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-6 w-full relative z-10">
//             <div className="relative flex-shrink-0">
//               <div className="absolute -inset-0.5 sm:-inset-1 rounded-[20px] sm:rounded-[24px] animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }} />
//               <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-3 sm:ring-4 ring-white/60">
//                 {documents.companyLogo ? (
//                   <img src={URL.createObjectURL(documents.companyLogo)} alt={editForm.companyName} className="w-full h-full object-cover" />
//                 ) : (
//                   <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
//                     {editForm.companyName.charAt(0)}
//                   </span>
//                 )}
//               </div>
//               {documents.companyLogo && (
//                 <button onClick={() => removeFile('companyLogo')} className="absolute top-0 right-0 p-1 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20" aria-label="Delete company logo" title="Delete Company Logo">
//                   <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
//                 </button>
//               )}
//               <button onClick={() => companyLogoInputRef.current?.click()} className="absolute bottom-0 right-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20" aria-label="Upload company logo" title="Upload Company Logo">
//                 <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               </button>
//               <input ref={companyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleCompanyLogoUpload} />
//             </div>

//             <div className="flex-1 text-center md:text-left w-full">
//               <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editForm.companyName}</h2>
//                 <span className="text-[10px] sm:text-xs text-[#00695C] font-medium bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gray-200">
//                   Builder ID: #BLD-{editForm.authMobile?.slice(-4) || '0000'}
//                 </span>
//                 <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold">
//                   RERA Verified
//                   <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
//                 </span>
//               </div>

//               <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
//                   <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.authFullName} · {editForm.authDesignation}
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
//                   <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.officeCity}, {editForm.officeState}
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
//                   <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.authMobile}
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.35s' }}>
//                   <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.yearsOfExperience} Years Exp.
//                 </span>
//               </div>

//               <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.45s' }}>
//                   <BarChart3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                   <span>{editForm.ongoingProjects} Ongoing · {editForm.completedProjects} Completed</span>
//                 </span>
//                 <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.55s' }}>
//                   <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
//                   <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">{editForm.citiesOfOperation}</span>
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
//                 <button key={tab.id} onClick={() => setActiveSection(tab.id)}
//                   className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs transition-all duration-500 whitespace-nowrap relative group ${isActive ? 'text-white shadow-lg transform scale-105' : 'text-gray-600 hover:text-[#00695C]'}`}
//                   style={{ background: isActive ? `linear-gradient(135deg, #00695C, #26A69A)` : 'transparent' }}>
//                   {isActive && <span className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg animate-pulse-slow" />}
//                   <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
//                     <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
//                     <span className="hidden lg:inline">{tab.title}</span>
//                     <span className="inline lg:hidden">{tab.title.split(' ')[0]}</span>
//                     {isActive && <span className="absolute -top-0.5 -right-0.5 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-ping" />}
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
//           <div className="relative z-10">{renderSectionContent()}</div>
//         </div>

//         {/* Properties Section */}
//         {renderPropertiesSection()}
//       </div>

//       {/* Styles */}
//       <style>{`
//         @keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
//         @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
//         @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
//         @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
//         @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
//         @keyframes floatDelayed { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-5deg); } }
//         @keyframes pulseSlow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.5; } }
//         @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
//         @keyframes spinSlow { to { transform: rotate(360deg); } }
//         @keyframes shimmerSweep { 0% { left: -60%; } 50%, 100% { left: 130%; } }
//         @keyframes underlineGrow { 0% { transform: scaleX(0); } 60% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
//         @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes fadeUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

//         .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
//         .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
//         .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
//         .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite; }
//         .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
//         .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
//         .animate-spin-slow { animation: spinSlow 6s linear infinite; }
//         .animate-shimmer { animation: shimmerSweep 3.2s ease-in-out infinite; }
//         .animate-underline-grow { animation: underlineGrow 1.2s ease-out 0.6s forwards; }
//         .animate-rise { opacity: 0; animation: riseIn 0.5s ease forwards; }
//         .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; opacity: 0; }

//         .border-3 { border-width: 3px; }
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

// export default BuilderProfile;