

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
  File, FolderOpen, FileImage, FileSpreadsheet, FileArchive, ImagePlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
// ============ IMPORT BACKEND SERVICES ============
import { 
  getMyProfile, 
  updateMyProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadDocument,
  deleteDocument,
  getVendorDocumentsByField,
  getVendorDocumentViewUrl,
  updateVendorProperty,
  deleteVendorProperty,
  updateVendorPropertyStatus,
  uploadPropertyImage,
  deletePropertyImage,
  uploadPropertyVideo,
  deletePropertyVideo,
  addPropertyDocuments,
  mapPropertyToFrontend,
  mapPropertyToBackend,
} from '../../services/profileService';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';

// Self-contained "No Image" fallback - via.placeholder.com is an external
// network call that can time out/be unreachable, leaving a blank box with
// nothing rendered at all when a property has no photos.
const NO_IMAGE_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#CCCCCC"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#666666" font-family="Arial, sans-serif" font-size="20">No Image</text></svg>')}`;

// Rent Options for Property Details & Pricing
const bedroomOptions = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];
const bathroomOptions = ["1", "2", "3", "4+"];
const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
const parkingOptions = ["1 Car", "2 Cars", "3+ Cars"];
const propertyTypeOptions = ["Apartment", "Independent House", "Independent Villa", "Duplex Residential Unit", "Commercial", "Land"];
const statusOptions = ["Active", "Inactive"];
const listingPurposeOptions = ["For Rent", "For Sale", "For Lease"];

const availableAmenities = [
  "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance", 
  "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center", 
  "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
  "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
];

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

// ============ TOGGLE SWITCH COMPONENT ============
const ToggleSwitch = ({ isOn, onToggle, size = 'sm' }) => {
  const sizes = {
    sm: {
      container: 'w-7 h-3.5 sm:w-8 sm:h-4',
      circle: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
      translate: 'translate-x-3.5 sm:translate-x-4',
    },
    md: {
      container: 'w-9 h-4.5 sm:w-10 sm:h-5',
      circle: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
      translate: 'translate-x-4.5 sm:translate-x-5',
    },
    lg: {
      container: 'w-11 h-5.5 sm:w-12 sm:h-6',
      circle: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
      translate: 'translate-x-5.5 sm:translate-x-6',
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

// ============ MEDIA LIGHTBOX MODAL ============
const MediaLightboxModal = ({ items, index, onClose, onNavigate, onDelete }) => {
  if (!items || items.length === 0) return null;
  useEffect(()=>{
    console.log("images or video",items);
  },[items,index,onClose])
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
          ) :  (
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
  const [localFloorPlanPreview, setLocalFloorPlanPreview] = useState(null);
  const [localCoverImage, setLocalCoverImage] = useState(null);
  const [localVideoFile, setLocalVideoFile] = useState(null);
  const [localFloorPlanFile, setLocalFloorPlanFile] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);

  useEffect(() => {
    setLocalProperty({ ...property });
    if (property.selectedAmenities) {
      const custom = property.selectedAmenities.filter(a => !availableAmenities.includes(a));
      setLocalCustomAmenities(custom);
    }
    // coverImage and images (gallery) are separate concepts from the
    // backend now - the cover is only ever whatever is actually flagged
    // primary, never inferred from images[0].
    setLocalCoverPreview(property.coverImage || null);
    setLocalImagePreviews(property.images || []);
  }, [property]);

  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // The 3-image cap covers property gallery photos only - the cover image
    // has its own dedicated slot and never counts against it.
    const remainingSlots = Math.max(0, 3 - localImagePreviews.length);
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum 3 property photos allowed.`);
    }
    const limitedFiles = files.slice(0, remainingSlots);
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setLocalImagePreviews([...localImagePreviews, ...newPreviews]);
    setNewImageFiles([...newImageFiles, ...limitedFiles]);
  };

  const removeLocalImage = (index) => {
    const preview = localImagePreviews[index];
    const newPreviews = localImagePreviews.filter((_, i) => i !== index);
    setLocalImagePreviews(newPreviews);
    // Existing (already-uploaded) photos are plain URLs; only newly-picked
    // files produce blob: previews and have a matching entry in
    // newImageFiles - map by blob position, not by raw index, since the
    // two arrays aren't 1:1 once an existing photo sits ahead of a new one.
    if (preview && preview.startsWith('blob:')) {
      const blobPosition = localImagePreviews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      setNewImageFiles(newImageFiles.filter((_, i) => i !== blobPosition));
      URL.revokeObjectURL(preview);
    }
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

  const handleLocalFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Floor plan must be a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Floor plan must be less than 5MB');
        return;
      }
      setLocalFloorPlanPreview(URL.createObjectURL(file));
      setLocalFloorPlanFile(file);
    }
  };

  const removeLocalFloorPlan = () => {
    if (localFloorPlanPreview) URL.revokeObjectURL(localFloorPlanPreview);
    setLocalFloorPlanPreview(null);
    setLocalFloorPlanFile(null);
  };

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

    // Hand the raw cover/photo/video pieces up so the actual save handler
    // can upload the real files via the multipart endpoints and use the
    // backend-returned URLs - not local blob: previews, which are never
    // persisted and vanish on reload.
    updatedProperty._media = {
      coverFile: localCoverImage,
      coverUrl: localCoverImage ? null : localCoverPreview,
      existingPhotoUrls: localImagePreviews.filter(p => !p.startsWith('blob:')),
      newPhotoFiles: newImageFiles,
      videoFile: localVideoFile,
      floorPlanFile: localFloorPlanFile,
    };

    onSave(updatedProperty);
  };

  const handleLocalCancel = () => {
    onCancel();
    setLocalStep(0);
    setLocalCustomAmenities([]);
    localImagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    });
    if (localCoverPreview) URL.revokeObjectURL(localCoverPreview);
    if (localVideoPreview) URL.revokeObjectURL(localVideoPreview);
    if (localFloorPlanPreview) URL.revokeObjectURL(localFloorPlanPreview);
  };

  const renderStepContent = () => {
    if (localStep === 0) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title</label>
              <input
                type="text"
                value={localProperty.propertyTitle || localProperty.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalProperty(prev => ({ ...prev, propertyTitle: val, name: val }));
                }}
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
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
              <select
                value={localProperty.propertyType || localProperty.type || 'Apartment'}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalProperty(prev => ({ ...prev, propertyType: val, type: val }));
                }}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {propertyTypeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
              <select
                value={localProperty.status}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
              <textarea
                value={localProperty.propertyAddress || localProperty.location || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalProperty(prev => ({ ...prev, propertyAddress: val, location: val }));
                }}
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
                onChange={(e) => setLocalProperty(prev => ({ ...prev, propertyCity: e.target.value }))}
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
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, builtUpArea: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="Built-up (sq ft)"
                />
                <input
                  type="number"
                  value={localProperty.carpetArea || ''}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, carpetArea: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="Carpet (sq ft)"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
              <select
                value={localProperty.bedrooms || '2 BHK'}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {bedroomOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
              <select
                value={localProperty.bathrooms || '2'}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, bathrooms: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {bathroomOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
              <select
                value={localProperty.furnishing || 'Fully Furnished'}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, furnishing: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {furnishingOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking</label>
              <select
                value={localProperty.parking || '2 Cars'}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, parking: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {parkingOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
              <select
                value={localProperty.listingPurpose || 'For Sale'}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, listingPurpose: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              >
                {listingPurposeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
            <textarea
              value={localProperty.description || ''}
              onChange={(e) => setLocalProperty(prev => ({ ...prev, description: e.target.value }))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Expected Price</label>
              <input
                type="text"
                value={localProperty.expectedPrice || localProperty.price?.replace(/[^0-9]/g, '') || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, expectedPrice: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. 4500000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance (₹/month)</label>
              <input
                type="text"
                value={localProperty.maintenance || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, maintenance: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. 2000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
              <input
                type="date"
                value={localProperty.availableFrom || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, availableFrom: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Display</label>
              <input
                type="text"
                value={localProperty.price || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, price: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. ₹45,00,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Display</label>
            <input
              type="text"
              value={localProperty.area || ''}
              onChange={(e) => setLocalProperty(prev => ({ ...prev, area: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="e.g. 1200 sq ft"
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

          <div className="flex gap-2">
            <input
              type="text"
              value={localProperty.otherAmenities || ''}
              onChange={(e) => setLocalProperty(prev => ({ ...prev, otherAmenities: e.target.value }))}
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

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
            <input
              type="text"
              value={localProperty.features?.join(', ') || ''}
              onChange={(e) => {
                const features = e.target.value.split(',').map(f => f.trim());
                setLocalProperty(prev => ({ ...prev, features }));
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
              <label htmlFor="edit-photos" className={`cursor-pointer flex flex-col items-center ${localImagePreviews.length >= 3 - ((localCoverPreview || localCoverImage) ? 1 : 0) ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Floor Plan (PDF)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept=".pdf" className="hidden" id="edit-floorplan" onChange={handleLocalFloorPlanUpload} />
              <label htmlFor="edit-floorplan" className="cursor-pointer flex flex-col items-center">
                <FileText className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Floor Plan</span>
                <span className="text-xs text-gray-400 mt-1">PDF (Max 5MB)</span>
              </label>
            </div>
            {localFloorPlanPreview && (
              <div className="mt-2 relative">
                <p className="text-sm text-green-600">✓ {localFloorPlanFile?.name}</p>
                <button onClick={removeLocalFloorPlan} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%]
       lg:max-w-3xl max-h-[80vh] flex flex-col animate-scaleIn">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <h2 className="text-white text-lg sm:text-xl font-bold">Edit Property</h2>
          </div>
          <button 
            onClick={handleLocalCancel}
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
              onClick={handleLocalCancel}
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

// ============ PROPERTY DETAILS MODAL ============
const PropertyDetailsModal = ({ property, onClose, onAddImages, onRemoveImage, onRemoveCover, onEdit, onDelete }) => {
  if (!property) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailImageInputRef = useRef(null);
  const rawImages = property.images || [];
  const hasImages = rawImages.length > 0;
  const images = hasImages ? rawImages : [NO_IMAGE_PLACEHOLDER];

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[90%]  sm:max-w-[95%]  lg:max-w-2xl h-[80vh] flex flex-col animate-scaleIn">
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
          {/* <div>
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cover Image</p>
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-32 sm:h-36">
              <img
                src={property.coverImage || NO_IMAGE_PLACEHOLDER}
                alt={`${property.name} cover`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = NO_IMAGE_PLACEHOLDER; }}
              />
              {property.coverImage && (
                <button
                  onClick={() => onRemoveCover(property.id)}
                  title="Delete cover image"
                  className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Delete
                </button>
              )}
            </div>
          </div> */}

          <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Property Photos</p>
          <div className="relative rounded-xl overflow-hidden bg-gray-100 h-48 sm:h-56 md:h-64">
            <img
              src={images[currentImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = NO_IMAGE_PLACEHOLDER;
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
                      e.target.src = NO_IMAGE_PLACEHOLDER;
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
                    <div><p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Company</p><p className="text-[10px] sm:text-xs font-bold text-gray-800">{property.contactPersonDetails.companyName}</p></div>
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

          {images.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-700 mb-1.5 sm:mb-2">All Property Images</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`group/thumb relative rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                      currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`Property Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = NO_IMAGE_PLACEHOLDER;
                      }}
                    />
                    {currentImageIndex === idx && (
                      <div className="absolute inset-0 bg-[#00695C]/20 flex items-center justify-center">
                        <div className="bg-[#00695C] text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded-full">
                          Active
                        </div>
                      </div>
                    )}
                    {hasImages && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(idx);
                        }}
                        title="Delete image"
                        className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 bg-red-500/90 hover:bg-red-600 text-white p-0.5 sm:p-1 rounded-md shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    )}
                  </div>
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

const OwnerProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeletePropertyConfirm, setShowDeletePropertyConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [editPropertyStep, setEditPropertyStep] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);
  const [showMediaLightbox, setShowMediaLightbox] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfToView, setPdfToView] = useState(null);
  
  const fileInputRefs = useRef({});
  const profilePhotoInputRef = useRef(null);

  const [properties, setProperties] = useState([]);

  const [editForm, setEditForm] = useState({
    fullName: '', userId:'', mobileNumber: '', emailAddress: '', dateOfBirth: '', gender: '',
    aadhaarNumber: '', panNumber: '', addressLine1: '', addressLine2: '',
    city: '', district: '', state: '', pinCode: '',
    accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '',
    preferredMethods: [], preferredTimes: [], additionalNotes: '', companyName: '',
  });

  const [documents, setDocuments] = useState({
    aadhaarCard: null, panCard: null, passportPhoto: null,
    coverImage: null, propertyPhotos: [], propertyVideo: null, floorPlan: null,
    saleDeed: null, floorPlanOptional: null, pattaChitta: null,
    encumbranceCertificate: null, propertyTaxReceipt: null,
    buildingApprovalPlan: null, completionCertificate: null,
    occupancyCertificate: null, rentalAgreement: null, otherDocuments: [],
  });


  // ============================================================
  // FETCH PROFILE DATA
  // ============================================================
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyProfile("owner");
      console.log("✅ Profile data loaded:", response);
      
      const profileData = response?.profile || {};
      const propertiesData = response?.properties?.data || [];
      
      setEditForm({
        fullName: profileData.fullName || profileData.ownerName || '',
        userId: profileData.userId,
        mobileNumber: profileData.phoneNumber || profileData.mobile || '',
        emailAddress: profileData.emailAddress || profileData.emailId || '',
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        aadhaarNumber: profileData.aadhaarNumber || '',
        panNumber: profileData.panNumber || '',
        addressLine1: profileData.address || profileData.addressLine1 || '',
        addressLine2: profileData.addressLine2 || '',
        city: profileData.city || profileData.ownerCity || '',
        district: profileData.district || profileData.ownerDistrict || '',
        state: profileData.state || profileData.ownerState || '',
        pinCode: profileData.pinCode || profileData.ownerPinCode || '',
        accountHolderName: profileData.accountHolderName || '',
        bankName: profileData.bankName || '',
        accountNumber: profileData.accountNumber || '',
        ifscCode: profileData.ifscCode || '',
        upiId: profileData.upiId || '',
        preferredMethods: profileData.preferredMethods || profileData.preferredContactMethod || [],
        preferredTimes: profileData.preferredTimes || profileData.preferredContactTime || [],
        additionalNotes: profileData.additionalNotes || profileData.additionalNote || '',
        companyName: profileData.companyName || '',
      });
      
      const formattedProperties = propertiesData.map(mapPropertyToFrontend);
      setProperties(formattedProperties);
      
      const profilePhotoUrl = profileData.profilePicture || profileData.profilePhotoUrl || null;
      let allImages = [];
      let allDocuments = [];
      let videoUrl = null;
      let floorPlanUrl = null;
      
      propertiesData.forEach((prop) => {
        const images = prop.images || [];
        images.forEach(img => {
          if (img.fileUrl) allImages.push(img.fileUrl);
        });
        if (prop.videoUrl) videoUrl = prop.videoUrl;
        if (prop.floorPlan) floorPlanUrl = prop.floorPlan;
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
      
      let vendorDocs = {};
      try {
        vendorDocs = await getVendorDocumentsByField('owner');
      } catch (docError) {
        console.error('⚠️ Failed to load vendor documents:', docError);
      }

      setDocuments({
        aadhaarCard: null, panCard: null, passportPhoto: profilePhotoUrl,
        coverImage: allImages.length > 0 ? allImages[0] : null,
        propertyPhotos: allImages.slice(0, 3),
        propertyVideo: videoUrl, floorPlan: floorPlanUrl,
        saleDeed: null, floorPlanOptional: null, pattaChitta: null,
        encumbranceCertificate: null, propertyTaxReceipt: null,
        buildingApprovalPlan: null, completionCertificate: null,
        occupancyCertificate: null, rentalAgreement: null, otherDocuments: allDocuments,
        ...vendorDocs,
      });

    } catch (error) {
      console.error('❌ Error fetching profile data:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // ============ PDF HANDLERS ============
  const handlePdfUpload = async (field, file) => {
    if (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setIsLoading(true);
        try {
          await uploadDocument({ role: 'owner', field, file, propertyId: null });
          setDocuments(prev => ({ ...prev, [field]: file }));
          showSuccessToast('Document uploaded successfully!');
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

  const handlePdfView = async (field) => {
    const file = documents[field];
    if (!file) return;

    if (file instanceof window.File || typeof file === 'string') {
      setPdfToView(file);
      setShowPdfViewer(true);
      return;
    }

    // Metadata-only entry loaded from the server (private document) -
    // mint a fresh signed URL only now, at view time.
    try {
      const viewUrl = await getVendorDocumentViewUrl('owner', field);
      setPdfToView(viewUrl);
      setShowPdfViewer(true);
    } catch (error) {
      alert('Failed to open document. Please try again.');
    }
  };

  const handlePdfDelete = (field) => {
    console.log(field);
    setDeleteItem({ field });
    setShowDeleteConfirm(true);
  };

  // ============ TOGGLE STATUS HANDLER ============
const handleToggleStatus = async (property) => {
 
  const currentStatus = property.propertyStatus || 'ACTIVE';
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  
  setIsLoading(true);
  try {
    console.log(`🔄 Toggling status for ${property.id}: ${currentStatus} → ${newStatus}`);
    
    const response = await updateVendorPropertyStatus('owner', property.id, newStatus);
    console.log('✅ API Response:', response);
    
    setProperties(prev => prev.map(p => {
      if (p.id === property.id) {
        return {
          ...p,
          propertyStatus: newStatus,
          status: newStatus === 'ACTIVE' ? 'Active' : 'Inactive'
        };
      }
      return p;
    }));
    
    if (selectedProperty && selectedProperty.id === property.id) {
      setSelectedProperty(prev => ({
        ...prev,
        propertyStatus: newStatus,
      }));
    }
    showSuccessToast('Property status updated successfully!');
  } catch (error) {
    console.error('❌ Error updating property status:', error);
    alert(error.response?.data?.detail || 'Failed to update property status. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // ============ NAVIGATION ============
  const handleNavigateBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

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

  const handleFileUpload = (field, file) => {
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file
      }));
      
      if (field === 'coverImage' || field === 'propertyPhotos') {
        const firstProperty = properties[0];
        if (firstProperty) {
          const updatedProperties = properties.map((prop, index) => {
            if (index === 0) {
              const updatedImages = [...prop.images];
              if (field === 'coverImage') {
                updatedImages[0] = URL.createObjectURL(file);
              }
              return { ...prop, images: updatedImages };
            }
            return prop;
          });
          setProperties(updatedProperties);
        }
      }

      showSuccessToast('File uploaded successfully!');
    }
  };

  const handleMultipleFileUpload = (field, files) => {
    let fileArray = Array.from(files);

    if (field === 'propertyPhotos') {
      const existingCount = documents.propertyPhotos.length;
      const remainingSlots = Math.max(0, 3 - existingCount);
      if (fileArray.length > remainingSlots) {
        alert('Property Photos allows a maximum of 3 images.');
      }
      fileArray = fileArray.slice(0, remainingSlots);
    }

    if (fileArray.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [field]: [...prev[field], ...fileArray]
      }));
      
      if (field === 'propertyPhotos') {
        const firstProperty = properties[0];
        if (firstProperty) {
          const updatedProperties = properties.map((prop, index) => {
            if (index === 0) {
              const newImageUrls = fileArray.map(f => URL.createObjectURL(f));
              return { ...prop, images: [...prop.images, ...newImageUrls] };
            }
            return prop;
          });
          setProperties(updatedProperties);
        }
      }

      showSuccessToast('Files uploaded successfully!');
    }
  };

  const removeFile = (field, index) => {
    setDeleteItem({ field, index });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteItem) {
      const { field, index } = deleteItem;
      setIsLoading(true);
      try {
        await deleteDocument({ role: 'owner', field, propertyId: null });
        if (index !== undefined && index !== null) {
          setDocuments(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
          }));
        } else {
          setDocuments(prev => ({ ...prev, [field]: null }));
          if (fileInputRefs.current[field]) fileInputRefs.current[field].value = '';
        }
        setShowDeleteConfirm(false);
        setDeleteItem(null);
        showSuccessToast('Document deleted successfully!');
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
      await deleteProfilePhoto('owner');
      setDocuments(prev => ({ ...prev, passportPhoto: null }));
      if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = '';
      setShowProfilePhotoDeleteConfirm(false);
      showSuccessToast('Profile photo deleted successfully!');
      await fetchProfileData();
    } catch (error) {
      console.error('❌ Error deleting profile photo:', error);
      alert('Failed to delete photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreference = (field, value) => {
    setEditForm(prev => {
      const currentValues = prev[field] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadProfilePhoto('owner', file);
        if (response.data?.fileUrl) {
          setDocuments(prev => ({ ...prev, passportPhoto: response.data.fileUrl }));
          showSuccessToast('Profile photo uploaded successfully!');
          await fetchProfileData();
        }
      } catch (error) {
        console.error('❌ Error uploading profile photo:', error);
        alert('Failed to upload photo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };


  const handleSave = async () => {
    const requiredFields = ['fullName', 'mobileNumber', 'emailAddress', 'aadhaarNumber'];
    const missingFields = requiredFields.filter(field => !editForm[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    setIsSubmitting(true);
    try {
      const profileData = {
        fullName: editForm.fullName,
        phoneNumber: editForm.mobileNumber,
        emailAddress: editForm.emailAddress,
        dateOfBirth: editForm.dateOfBirth,
        gender: editForm.gender,
        aadhaarNumber: editForm.aadhaarNumber,
        panNumber: editForm.panNumber,
        address: editForm.addressLine1,
        addressLine2: editForm.addressLine2,
        city: editForm.city,
        district: editForm.district,
        state: editForm.state,
        pinCode: editForm.pinCode,
        accountHolderName: editForm.accountHolderName,
        bankName: editForm.bankName,
        accountNumber: editForm.accountNumber,
        ifscCode: editForm.ifscCode,
        upiId: editForm.upiId,
        preferredMethods: editForm.preferredMethods,
        preferredTimes: editForm.preferredTimes,
        additionalNotes: editForm.additionalNotes,
        companyName: editForm.companyName,
      };
      await updateMyProfile('owner', profileData);
      setShowEditModal(false);
      showSuccessToast('Profile updated successfully!');
      await fetchProfileData();
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessToast = (message = 'Operation completed successfully!') => {
    showToast(message, 'success');
  };

  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return '🎬';
    } else if (['pdf'].includes(extension)) {
      return '📄';
    } else if (['doc', 'docx'].includes(extension)) {
      return '📝';
    } else {
      return '📎';
    }
  };

  const getFileStatusLabel = (field) => {
    const files = documents[field];
    const hasFiles = Array.isArray(files) ? files.length > 0 : files !== null;
    if (!hasFiles) return null;
    return Array.isArray(files) ? `${files.length} uploaded` : 'Uploaded';
  };

  const openMediaLightbox = (field, type) => {
    const val = documents[field];
    if (!val) return;
    const files = Array.isArray(val) ? val : [val];
    if (files.length === 0) return;
    const items = files.map((f, i) => ({
      type,
      url: typeof f === 'string' ? f : URL.createObjectURL(f),
      name: typeof f === 'string' ? decodeURIComponent(f.split('/').pop() || 'Media') : f.name,
      field,
      docIndex: Array.isArray(val) ? i : undefined,
    }));
    setLightboxItems(items);
    setLightboxIndex(0);
    setShowMediaLightbox(true);
  };

  const handleDeleteLightboxItem = () => {
    const item = lightboxItems[lightboxIndex];
    if (!item) return;

    setDocuments(prev => {
      if (item.docIndex === undefined) {
        return { ...prev, [item.field]: null };
      }
      return { ...prev, [item.field]: prev[item.field].filter((_, i) => i !== item.docIndex) };
    });

    setLightboxItems(prevItems => {
      const newItems = prevItems
        .filter((_, i) => i !== lightboxIndex)
        .map((it, i) => (it.docIndex !== undefined ? { ...it, docIndex: i } : it));
      if (newItems.length === 0) {
        setShowMediaLightbox(false);
      } else {
        setLightboxIndex(idx => Math.min(idx, newItems.length - 1));
      }
      return newItems;
    });

    showSuccessToast('Item deleted successfully!');
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
    doc.text('Owner Profile Invoice', 14, 17);
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

    section('Address Details');
    row('Address Line 1', editForm.addressLine1);
    row('Address Line 2', editForm.addressLine2);
    row('City', editForm.city);
    row('District', editForm.district);
    row('State', editForm.state);
    row('PIN Code', editForm.pinCode);
    y += 4;

    section('Identity & Bank Details');
    row('Aadhaar Number', editForm.aadhaarNumber);
    row('PAN Number', editForm.panNumber);
    row('Bank Name', editForm.bankName);
    row('Account Number', editForm.accountNumber);
    row('IFSC Code', editForm.ifscCode);
    row('UPI ID', editForm.upiId);
    y += 4;

    section('Properties Summary');
    row('Total Properties', properties.length);
    row('Active Listings', properties.filter(p => p.status === 'Active').length);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system-generated document.', 14, 287);

    doc.save(`Invoice_${editForm.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  // ============ PROPERTY HANDLERS ============
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty({ ...property });
    setEditPropertyStep(0);
    if (property.images && property.images.length > 0) {
      setImagePreviews(property.images.map(img => img));
      
    }
    if (property.coverImage) {
      setCoverPreview(property.coverImage);
    }
    if (property.selectedAmenities) {
      setCustomAmenitiesList(property.selectedAmenities.filter(a => !availableAmenities.includes(a)));
    }
    if (property.propertyVideo) {
      setVideoPreview(property.propertyVideo);
    }
    if (property.floorPlan) {
      setFloorPlanPreview(property.floorPlan);
    }
    setShowEditPropertyModal(true);
  };

  const handlePropertyEditChange = (field, value) => {
    setEditingProperty(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    const current = editingProperty?.selectedAmenities || [];
    if (current.includes(amenity)) {
      handlePropertyEditChange('selectedAmenities', current.filter(a => a !== amenity));
    } else {
      handlePropertyEditChange('selectedAmenities', [...current, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (editingProperty?.otherAmenities) {
      const newAmenity = editingProperty.otherAmenities.trim();
      if (newAmenity && !editingProperty.selectedAmenities.includes(newAmenity) && !customAmenitiesList.includes(newAmenity)) {
        setCustomAmenitiesList([...customAmenitiesList, newAmenity]);
        handlePropertyEditChange('selectedAmenities', [...editingProperty.selectedAmenities, newAmenity]);
        handlePropertyEditChange('otherAmenities', '');
      }
    }
  };

  const removeCustomAmenity = (amenity) => {
    setCustomAmenitiesList(customAmenitiesList.filter(a => a !== amenity));
    handlePropertyEditChange('selectedAmenities', editingProperty.selectedAmenities.filter(a => a !== amenity));
  };

  const handleSavePropertyEdit = async (updatedProperty) => {
    if (!updatedProperty) return;
    setIsLoading(true);
    try {
      const propertyId = updatedProperty.id;
      const media = updatedProperty._media || {};
      const backendData = mapPropertyToBackend(updatedProperty);
      await updateVendorProperty('owner', propertyId, backendData);

      // images/coverImage on updatedProperty are never touched by local edit
      // state (see EditPropertyModal) - they still reflect what the backend
      // had before this save (coverImage and images/gallery are already
      // separate concepts there), so they're a safe source for the original
      // order layout used to reconcile deletions below.
      const originalCover = updatedProperty.coverImage || null;
      const originalGalleryPhotos = updatedProperty.images || [];
      const hadCoverOriginally = !!originalCover;

      let finalImages = [...(media.existingPhotoUrls || [])];
      let finalCoverUrl = media.coverUrl || null;

      // Cover replaced with a new file, or explicitly removed with no
      // replacement: either way the old cover row must be deleted. Only
      // upload a new one if a file was actually picked - a removed cover
      // stays empty, it is never backfilled from the gallery.
      if (hadCoverOriginally && (media.coverFile || !media.coverUrl)) {
        await deletePropertyImage('owner', propertyId, 0);
      }
      if (media.coverFile) {
        const coverResult = await uploadPropertyImage('owner', propertyId, media.coverFile, 0, true);
        finalCoverUrl = coverResult?.data?.file_url || null;
      }

      // Reconcile the gallery: any original (non-cover) photo the vendor
      // removed in the edit form must actually be deleted server-side too -
      // otherwise it silently stays on the property and keeps counting
      // against the 3-photo cap even though the UI no longer shows it. This
      // makes editing replace the gallery rather than just append to it.
      // `order` matches array position, same convention "Remove Image" in
      // view mode already relies on.
      const coverOrderOffset = hadCoverOriginally ? 1 : 0;
      const keptSet = new Set(media.existingPhotoUrls || []);
      const freedOrders = [];
      for (let i = 0; i < originalGalleryPhotos.length; i++) {
        if (!keptSet.has(originalGalleryPhotos[i])) {
          const order = i + coverOrderOffset;
          await deletePropertyImage('owner', propertyId, order);
          freedOrders.push(order);
        }
      }

      if (media.newPhotoFiles && media.newPhotoFiles.length > 0) {
        let nextFallbackOrder = coverOrderOffset + originalGalleryPhotos.length;
        for (const file of media.newPhotoFiles) {
          const order = freedOrders.length > 0 ? freedOrders.shift() : nextFallbackOrder++;
          const result = await uploadPropertyImage('owner', propertyId, file, order);
          if (result?.data?.file_url) finalImages.push(result.data.file_url);
        }
      }

      if (media.videoFile) {
        await uploadPropertyVideo('owner', propertyId, media.videoFile);
      }

      // The floor plan picked in the edit form was only ever held in local
      // state - it never made it into the JSON save payload, so it silently
      // vanished on save. Upload it through the property-documents endpoint.
      if (media.floorPlanFile) {
        await addPropertyDocuments(propertyId, [media.floorPlanFile], ['floor_plan']);
      }

      const finalProperty = {
        ...updatedProperty,
        images: finalCoverUrl ? [finalCoverUrl, ...finalImages] : finalImages,
        coverImage: finalCoverUrl,
      };
      delete finalProperty._media;

      setProperties(prev => prev.map(p => p.id === propertyId ? finalProperty : p));
      setShowEditPropertyModal(false);
      setEditingProperty(null);
      setEditPropertyStep(0);
      setImagePreviews([]);
      setCoverPreview(null);
      setFloorPlanPreview(null);
      setVideoPreview(null);
      setCustomAmenitiesList([]);
      showSuccessToast('Property updated successfully!');
    } catch (error) {
      console.error('❌ Error updating property:', error);
      alert(error?.response?.data?.detail || 'Failed to update property. Please try again.');
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
      await deleteVendorProperty('owner', propertyToDelete.id);
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      setShowDeletePropertyConfirm(false);
      setPropertyToDelete(null);
      showSuccessToast('Property deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============ PROPERTY DETAILS IMAGE HANDLERS ============
  const handleAddPropertyDetailImages = async (propertyId, files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const existingProperty = properties.find(p => p.id === propertyId);
    // images is gallery-only (coverImage is separate) - the 3-image cap
    // covers gallery photos only, the cover has its own dedicated slot.
    const existingCount = existingProperty?.images?.length || 0;
    const coverOffset = existingProperty?.coverImage ? 1 : 0;
    const remainingSlots = Math.max(0, 3 - existingCount);
    if (fileArray.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum 3 property photos allowed.`);
    }
    const limitedFiles = fileArray.slice(0, remainingSlots);
    if (limitedFiles.length === 0) return;

    setIsLoading(true);
    try {
      const newImageUrls = [];
      for (let i = 0; i < limitedFiles.length; i++) {
        const result = await uploadPropertyImage('owner', propertyId, limitedFiles[i], coverOffset + existingCount + i);
        if (result?.data?.file_url) newImageUrls.push(result.data.file_url);
      }
      const updatedProperties = properties.map(p => {
        if (p.id === propertyId) {
          return { ...p, images: [...(p.images || []), ...newImageUrls] };
        }
        return p;
      });
      setProperties(updatedProperties);
      if (selectedProperty && selectedProperty.id === propertyId) {
        setSelectedProperty({
          ...selectedProperty,
          images: [...(selectedProperty.images || []), ...newImageUrls]
        });
      }
      showSuccessToast('Property image uploaded successfully!');
    } catch (error) {
      console.error('❌ Error uploading property images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePropertyDetailImage = async (propertyId, imageIndex) => {
    setIsLoading(true);
    try {
      // imageIndex is a position within the gallery-only images array - the
      // cover (if any) sits at backend order 0, ahead of every gallery slot.
      const existingProperty = properties.find(p => p.id === propertyId);
      const coverOffset = existingProperty?.coverImage ? 1 : 0;
      await deletePropertyImage('owner', propertyId, coverOffset + imageIndex);
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
      showSuccessToast('Property image deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting property image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Deletes the cover only - the cover slot is left empty afterwards, it is
  // never backfilled from the gallery. A new cover must be set explicitly
  // (edit form / dedicated set-cover action), matching how the backend
  // now tracks coverImage and gallery images as separate concepts.
  const handleRemovePropertyCover = async (propertyId) => {
    setIsLoading(true);
    try {
      await deletePropertyImage('owner', propertyId, 0);
      setProperties(prev =>
        prev.map(p => p.id === propertyId ? { ...p, coverImage: null } : p)
      );
      setSelectedProperty(prev =>
        prev && prev.id === propertyId ? { ...prev, coverImage: null } : prev
      );
      showSuccessToast('Cover image removed successfully!');
    } catch (error) {
      console.error('❌ Error deleting cover image:', error);
      alert('Failed to delete cover image. Please try again.');
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
        (prop.propertyStatus || 'ACTIVE').toLowerCase() === statusLower
      );
    }

    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  const clearSearch = () => {
    setSearchTerm('');
  };

  // ============ SECTION DEFINITIONS ============
  const sections = [
    { id: 'personal', title: 'Personal Details', icon: User },
    { id: 'address', title: 'Address Details', icon: MapPin },
    { id: 'legal', title: 'Legal Documents', icon: FileText },
    { id: 'bank', title: 'Bank & Verification', icon: Banknote },
    { id: 'communication', title: 'Communication', icon: MessageCircle },
  ];

  // ============ COMPONENTS ============
  const InfoCard = ({ label, value, icon, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative p-3">
          <div className="flex items-start space-x-2.5">
            <div className={`p-2 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <label className="block text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                {label}
              </label>
              {children ? (
                children
              ) : (
                <div className="p-2 text-xs text-gray-800 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg border border-[#00695C]/20 font-medium break-all group-hover:border-[#00695C]/40 transition-all duration-300">
                  {value || 'Not specified'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ============ RENDER FUNCTIONS ============
  const renderSectionContent = () => {
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

    switch (activeSection) {
      case 'personal': {
        const personalFields = [editForm.fullName, editForm.mobileNumber, editForm.emailAddress, editForm.dateOfBirth, editForm.gender, documents.passportPhoto];
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
                    {documents.passportPhoto ? (
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

      case 'address': {
        const addressFields = [editForm.addressLine1, editForm.addressLine2, editForm.city, editForm.district, editForm.state, editForm.pinCode];
        const filledCount = addressFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Address Details"
              subtitle="Your current residential address information"
              filled={filledCount}
              total={addressFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Address Line 1" value={editForm.addressLine1} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Address Line 2" value={editForm.addressLine2} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12} />
                <AnimatedCard label="City" value={editForm.city} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="District" value={editForm.district} icon={<Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.26} />
                <AnimatedCard label="State" value={editForm.state} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.33} />
                <AnimatedCard label="PIN Code" value={editForm.pinCode} icon={<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.4} />
              </div>
            </div>
          </div>
        );
      }

      case 'property': {
        const propertyDocFields = ['coverImage', 'propertyPhotos', 'propertyVideo'];
        const filledCount = propertyDocFields.filter(f => {
          const v = documents[f];
          return Array.isArray(v) ? v.length > 0 : v !== null;
        }).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Property Images"
              subtitle="Visual documentation of your property"
              filled={filledCount}
              total={propertyDocFields.length}
            />
            <div className="flex flex-wrap justify-start gap-3 w-full">
              <div className="w-full sm:w-56">
                <AnimatedCard label="Cover Image" icon={<Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05}>
                  {getFileStatusLabel('coverImage') ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMediaLightbox('coverImage', 'image')}
                        className="text-xs sm:text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                      >
                        View Image
                      </button>
                      <button
                        onClick={() => removeFile('coverImage')}
                        title="Remove Cover Image"
                        className="p-0.5 sm:p-1 rounded-md text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>
              </div>
              <div className="w-full sm:w-56">
                <AnimatedCard label="Property Photos" icon={<Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.12}>
                  {getFileStatusLabel('propertyPhotos') ? (
                    <button
                      onClick={() => openMediaLightbox('propertyPhotos', 'image')}
                      className="text-xs sm:text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                    >
                      View Photos ({documents.propertyPhotos.length})
                    </button>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                  {getFileStatusLabel('propertyPhotos') && (
                    <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 sm:mt-1">Open to view &amp; delete individual photos</p>
                  )}
                </AnimatedCard>
              </div>
              <div className="w-full sm:w-56">
                <AnimatedCard label="Property Video" icon={<Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.19}>
                  {getFileStatusLabel('propertyVideo') ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMediaLightbox('propertyVideo', 'video')}
                        className="text-xs sm:text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                      >
                        Watch Video
                      </button>
                      <button
                        onClick={() => removeFile('propertyVideo')}
                        title="Remove Property Video"
                        className="p-0.5 sm:p-1 rounded-md text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'legal': {
        const legalDocFields = ['saleDeed', 'floorPlanOptional', 'pattaChitta', 'encumbranceCertificate', 'propertyTaxReceipt', 'buildingApprovalPlan', 'completionCertificate', 'occupancyCertificate', 'rentalAgreement', 'otherDocuments'];
        const filledCount = legalDocFields.filter(f => {
          const v = documents[f];
          return Array.isArray(v) ? v.length > 0 : v !== null;
        }).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Legal Documents"
              subtitle="All legal documents for property verification"
              filled={filledCount}
              total={legalDocFields.length}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 w-full">
              {[
                { field: 'saleDeed', label: 'Sale Deed', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'floorPlanOptional', label: 'Floor Plan', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'pattaChitta', label: 'Patta / Chitta', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'encumbranceCertificate', label: 'Encumbrance Certificate', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'propertyTaxReceipt', label: 'Property Tax Receipt', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'buildingApprovalPlan', label: 'Building Approval Plan', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'completionCertificate', label: 'Completion Certificate', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'occupancyCertificate', label: 'Occupancy Certificate', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
                { field: 'rentalAgreement', label: 'Rental Agreement', icon: <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
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
                          <button
                            onClick={() => handlePdfView(doc.field)}
                            className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1"
                          >
                            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span className="truncate">{typeof file === 'string' ? file.split('/').pop() : (file.fileName || file.name)}</span>
                          </button>
                          <button
                            onClick={() => handlePdfDelete(doc.field)}
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
                                Upload PDF
                              </span>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handlePdfUpload(doc.field, file);
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

              <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10 hover:border-[#00695C]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-2.5 sm:p-3">
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300">
                        <div className="text-white">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-700">Other Documents</span>
                    </div>
                    {documents.otherDocuments.length > 0 && (
                      <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">
                        {documents.otherDocuments.length}
                      </span>
                    )}
                  </div>

                  {documents.otherDocuments.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {documents.otherDocuments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg p-1 sm:p-1.5 border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
                          <button
                            onClick={() => {
                              setPdfToView(file);
                              setShowPdfViewer(true);
                            }}
                            className="flex-1 text-[9px] sm:text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-0.5 sm:gap-1"
                          >
                            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </button>
                          <button
                            onClick={() => removeFile('otherDocuments', index)}
                            className="p-0.5 sm:p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300 flex-shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-1.5 sm:p-2 text-center hover:border-[#00695C] hover:bg-[#00695C]/5 transition-all duration-300 group/upload">
                      <label className="block cursor-pointer">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                          <div className="p-0.5 sm:p-1 bg-gray-100 rounded-lg group-hover/upload:bg-[#00695C]/10 transition-colors duration-300">
                            <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover/upload:text-[#00695C] transition-colors duration-300" />
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 group-hover/upload:text-[#00695C] transition-colors duration-300">
                            Upload Multiple
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const fileArray = Array.from(files);
                              setDocuments(prev => ({
                                ...prev,
                                otherDocuments: [...prev.otherDocuments, ...fileArray]
                              }));
                              showSuccessToast('Documents uploaded successfully!');
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
            </div>
          </div>
        );
      }

      case 'bank': {
        const bankFields = [editForm.accountHolderName, editForm.bankName, editForm.accountNumber, editForm.ifscCode, editForm.upiId, editForm.aadhaarNumber, editForm.panNumber, documents.aadhaarCard, documents.panCard];
        const filledCount = bankFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Bank & Verification Details"
              subtitle="Financial and identity verification information"
              filled={filledCount}
              total={bankFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Account Holder Name" value={editForm.accountHolderName} icon={<User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05} />
                <AnimatedCard label="Bank Name" value={editForm.bankName} icon={<Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.11} />
                <AnimatedCard label="Account Number" value={editForm.accountNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.17} />
                <AnimatedCard label="IFSC Code" value={editForm.ifscCode} icon={<Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.23} />
                <AnimatedCard label="UPI ID" value={editForm.upiId} icon={<Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.29} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.35} />
                <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.41} />
                <AnimatedCard label="Identity Verification" icon={<FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.47}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-1.5 sm:p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${documents.aadhaarCard ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.aadhaarCard ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Aadhaar Card: {documents.aadhaarCard ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-1.5 sm:p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${documents.panCard ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.panCard ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        PAN Card: {documents.panCard ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'communication': {
        const commFields = [editForm.preferredMethods.length > 0, editForm.preferredTimes.length > 0, editForm.additionalNotes];
        const filledCount = commFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Communication Preferences"
              subtitle="How and when to contact you"
              filled={filledCount}
              total={commFields.length}
            />
            <div className="grid grid-cols-1 gap-3 w-full">
              <AnimatedCard label="Preferred Contact Method" icon={<MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.05}>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {['Phone Call', 'WhatsApp', 'Email'].map((method) => {
                    const isSelected = editForm.preferredMethods.includes(method);
                    return (
                      <span
                        key={method}
                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {method === 'Phone Call' && '📞'}
                        {method === 'WhatsApp' && '💬'}
                        {method === 'Email' && '✉️'}
                        {' '}{method}
                        {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 sm:ml-1" />}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-gray-500 font-medium">
                  Selected: {editForm.preferredMethods.length > 0 ? editForm.preferredMethods.join(', ') : 'None selected'}
                </div>
              </AnimatedCard>

              <AnimatedCard label="Preferred Contact Time" icon={<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.15}>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => {
                    const isSelected = editForm.preferredTimes.includes(time);
                    return (
                      <span
                        key={time}
                        className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {time}
                        {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 sm:ml-1" />}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-gray-500 font-medium">
                  {/** editForm.preferredTimes.join(", ") */}
                  Selected: {editForm.preferredTimes.length > 0 ? editForm.preferredTimes : 'None selected'}
                </div>
              </AnimatedCard>

              <AnimatedCard label="Additional Notes" icon={<Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />} delay={0.25}>
                <div className="p-1.5 sm:p-2 text-[10px] sm:text-xs text-gray-800 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg border border-[#00695C]/20 font-medium">
                  {editForm.additionalNotes || 'No additional notes'}
                </div>
              </AnimatedCard>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

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

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-16 sm:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden">
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

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl mx-auto overflow-hidden max-h-[80vh] sm:max-h-[75vh] flex flex-col animate-scaleIn">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Edit Profile
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
                    { name: 'fullName', label: 'Full Name', emoji: '👤' },
                    { name: 'mobileNumber', label: 'Mobile Number', emoji: '📱' },
                    { name: 'emailAddress', label: 'Email Address', emoji: '✉️' },
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
                      <span className="text-sm sm:text-base">📸</span> Profile Photo
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => profilePhotoInputRef.current?.click()}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#00695C] text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                        >
                          Upload
                        </button>
                        {documents.passportPhoto && (
                          <button
                            onClick={handleProfilePhotoDelete}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-600 transition-all duration-300"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Address Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {[
                    { name: 'addressLine1', label: 'Address Line 1', emoji: '🏠' },
                    { name: 'addressLine2', label: 'Address Line 2', emoji: '🏠' },
                    { name: 'city', label: 'City', emoji: '🏙️' },
                    { name: 'district', label: 'District', emoji: '🗺️' },
                    { name: 'state', label: 'State', emoji: '🌍' },
                    { name: 'pinCode', label: 'PIN Code', emoji: '📍' },
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

              {/* Legal Documents - PDF Upload in Edit Profile */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Legal Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                  {[
                    { field: 'saleDeed', label: 'Sale Deed' },
                    { field: 'floorPlanOptional', label: 'Floor Plan' },
                    { field: 'pattaChitta', label: 'Patta / Chitta' },
                    { field: 'encumbranceCertificate', label: 'Encumbrance Certificate' },
                    { field: 'propertyTaxReceipt', label: 'Property Tax Receipt' },
                    { field: 'buildingApprovalPlan', label: 'Building Approval Plan' },
                    { field: 'completionCertificate', label: 'Completion Certificate' },
                    { field: 'occupancyCertificate', label: 'Occupancy Certificate' },
                    { field: 'rentalAgreement', label: 'Rental Agreement' },
                  ].map((doc) => {
                    const file = documents[doc.field];
                    const hasFile = file !== null && file !== undefined;

                    return (
                      <div key={doc.field} className="border-2 border-gray-200 rounded-xl p-2 sm:p-3 hover:border-[#00695C] transition-all duration-300 hover:shadow-md bg-white">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <label className="text-[10px] sm:text-xs font-bold text-gray-700">{doc.label}</label>
                          {hasFile && (
                            <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full">✓</span>
                          )}
                        </div>
                        {hasFile ? (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handlePdfView(doc.field)}
                              className="text-[10px] sm:text-xs text-[#00695C] font-medium hover:underline flex items-center gap-0.5 sm:gap-1"
                            >
                              <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {typeof file === 'string' ? file.split('/').pop() : file.name}
                            </button>
                            <button
                              onClick={() => handlePdfDelete(doc.field)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="block cursor-pointer">
                            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 hover:text-[#00695C] transition-colors">
                              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Upload PDF</span>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handlePdfUpload(doc.field, file);
                                }
                                e.target.value = '';
                              }} 
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-2 sm:p-3 hover:border-[#00695C] transition-all duration-300 hover:shadow-md bg-white">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-700">Other Documents</label>
                    {documents.otherDocuments.length > 0 && (
                      <span className="text-[9px] sm:text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                        {documents.otherDocuments.length}
                      </span>
                    )}
                  </div>
                  {documents.otherDocuments.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {documents.otherDocuments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5 sm:p-2">
                          <button
                            onClick={() => {
                              setPdfToView(file);
                              setShowPdfViewer(true);
                            }}
                            className="text-[10px] sm:text-xs text-[#00695C] font-medium hover:underline flex items-center gap-0.5 sm:gap-1 truncate max-w-[100px] sm:max-w-[150px]"
                          >
                            <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </button>
                          <button
                            onClick={() => removeFile('otherDocuments', index)}
                            className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 hover:text-[#00695C] transition-colors">
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Upload Multiple PDFs</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const fileArray = Array.from(files);
                            setDocuments(prev => ({
                              ...prev,
                              otherDocuments: [...prev.otherDocuments, ...fileArray]
                            }));
                            showSuccessToast('Documents uploaded successfully!');
                          }
                          e.target.value = '';
                        }} 
                      />
                    </label>
                  )}
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
                    { name: 'aadhaarNumber', label: 'Aadhaar Number', emoji: '🆔' },
                    { name: 'panNumber', label: 'PAN Number', emoji: '📄' },
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
                  <div className="col-span-1 sm:col-span-2 space-y-1.5 sm:space-y-2 w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">Upload Documents</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 sm:p-4 text-center hover:border-[#00695C] transition-all duration-300 hover:bg-[#00695C]/5 group">
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 cursor-pointer">
                          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold">Aadhaar Card</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setDocuments(prev => ({ ...prev, aadhaarCard: file }));
                                showSuccessToast('Aadhaar Card uploaded successfully!');
                              }
                            }} 
                          />
                        </label>
                        {documents.aadhaarCard && (
                          <span className="text-[9px] sm:text-xs text-[#00695C] block mt-1 sm:mt-2 font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">
                            ✓ Uploaded
                          </span>
                        )}
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 sm:p-4 text-center hover:border-[#00695C] transition-all duration-300 hover:bg-[#00695C]/5 group">
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 cursor-pointer">
                          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold">PAN Card</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setDocuments(prev => ({ ...prev, panCard: file }));
                                showSuccessToast('PAN Card uploaded successfully!');
                              }
                            }} 
                          />
                        </label>
                        {documents.panCard && (
                          <span className="text-[9px] sm:text-xs text-[#00695C] block mt-1 sm:mt-2 font-bold bg-[#00695C]/10 px-1.5 sm:px-2 py-0.5 rounded-full animate-fadeIn">
                            ✓ Uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="space-y-3 sm:space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-xs sm:text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-1.5 sm:p-2 rounded-xl">
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Communication Preferences
                </h3>
                <div className="space-y-3 sm:space-y-4 w-full">
                  <div className="w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1 sm:mb-2">Preferred Contact Method</label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                      {['Phone Call', 'WhatsApp', 'Email'].map((method) => {
                        const isSelected = editForm.preferredMethods.includes(method);
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => togglePreference('preferredMethods', method)}
                            className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-2xl text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-[#00695C] hover:bg-[#00695C]/5'
                            }`}
                          >
                            {method}
                            {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 inline" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-1 sm:mt-2 text-[9px] sm:text-xs text-gray-500 font-medium">
                      Selected: {editForm.preferredMethods.length > 0 ? editForm.preferredMethods.join(', ') : 'None selected'}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1 sm:mb-2">Preferred Contact Time</label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                      {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => {
                        const isSelected = editForm.preferredTimes.includes(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => togglePreference('preferredTimes', time)}
                            className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-2xl text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-[#00695C] hover:bg-[#00695C]/5'
                            }`}
                          >
                            {time}
                            {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 inline" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-1 sm:mt-2 text-[9px] sm:text-xs text-gray-500 font-medium">
                      Selected: {editForm.preferredTimes.length > 0 ? editForm.preferredTimes.join(', ') : 'None selected'}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 mb-1 sm:mb-2">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={editForm.additionalNotes}
                      onChange={handleEditChange}
                      rows="3 sm:rows-4"
                      className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
                      placeholder="Enter any additional notes or special requests..."
                    />
                  </div>
                </div>
              </div>
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

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => {
            setShowPropertyDetails(false);
            setSelectedProperty(null);
          }}
          onAddImages={handleAddPropertyDetailImages}
          onRemoveImage={handleRemovePropertyDetailImage}
          onRemoveCover={handleRemovePropertyCover}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Media Lightbox */}
      {showMediaLightbox && lightboxItems.length > 0 && (
        <MediaLightboxModal
          items={lightboxItems}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onDelete={handleDeleteLightboxItem}
          onClose={() => {
            setShowMediaLightbox(false);
            setLightboxItems([]);
            setLightboxIndex(0);
          }}
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
            setEditPropertyStep(0);
            setImagePreviews([]);
            setCoverPreview(null);
            setFloorPlanPreview(null);
            setVideoPreview(null);
            setCustomAmenitiesList([]);
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

      {/* Success Message */}
      <Toast toast={toast} onClose={hideToast} />

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-full w-full relative z-10 -mt-12 sm:-mt-15">
        
        {/* HEADER */}
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
                    Owner Profile
                    <span className="absolute -bottom-0.5 sm:-bottom-1 left-0 h-[2px] sm:h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1.5 ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#26A69A] animate-pulse" />
                  <span className="hidden lg:inline">Manage your owner profile and property information</span>
                  <span className=" inline lg:hidden">Manage your profile</span>
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

        {/* PROFILE CARD */}
        <div className="relative bg-[#00695C]/5 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 w-full hover:shadow-2xl transition-all duration-500 border border-[#00695C]/20 overflow-hidden group">
          <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#26A69A] to-transparent group-hover:left-full transition-all duration-[900ms] ease-out" />

          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl sm:rounded-2xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute bottom-[-40px] rounded-full border border-white/50 animate-bubble"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${3 + Math.random() * 8}px`,
                  height: `${3 + Math.random() * 8}px`,
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
                {documents.passportPhoto ? (
                  <img src={documents.passportPhoto} alt={editForm.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                    {editForm.fullName.charAt(0)}
                  </span>
                )}
              </div>

              {documents.passportPhoto && (
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
                  {editForm.userId}
                </span>
                <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-2 sm:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold">
                  Verified Owner
                  <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.city}, {editForm.state}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.mobileNumber}
                </span>
                <span className="flex items-center gap-1 sm:gap-1.5 bg-[#00695C]/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00695C]" /> {editForm.emailAddress}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center md:justify-start">
                <span className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.35s' }}>
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-[180px] md:max-w-[200px]">
                    {[editForm.addressLine1, editForm.addressLine2, editForm.city, editForm.district, editForm.state, editForm.pinCode].filter(Boolean).join(', ')}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
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

        {/* TAB CONTENT */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-[#00695C]/20 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* PROPERTIES SECTION */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
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
                          src={property.coverImage || NO_IMAGE_PLACEHOLDER}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = NO_IMAGE_PLACEHOLDER;
                          }}
                        />
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
                        {property.videoUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxItems([{ type: 'video', url: property.videoUrl, name: property.name }]);
                              setLightboxIndex(0);
                              setShowMediaLightbox(true);
                            }}
                            className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/70 hover:bg-black/90 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 transition-all hover:scale-105"
                          >
                            <span className="text-[10px] sm:text-xs">▶</span> Watch Video
                          </button>
                        )}
                      </div>

                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between gap-1 sm:gap-2">
                          <h3 className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#00695C] transition-colors duration-300 line-clamp-1 flex-1">
                            {property.name}
                          </h3>
                          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                            <span className={`text-[9px] sm:text-[10px] font-bold ${
                              property.propertyStatus === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
                            }`}>
                              {property.propertyStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
                            </span>
                            <ToggleSwitch 
                              isOn={property.propertyStatus === 'ACTIVE'} 
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
          {/* PROPERTY (name + id + type/location as meta on small screens) */}
          <td className="py-2 sm:py-3 px-2 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={property.coverImage || NO_IMAGE_PLACEHOLDER}
                  alt={property.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = NO_IMAGE_PLACEHOLDER; }}
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

          {/* STATUS */}
          <td className="py-2 sm:py-3 px-2 sm:px-4">
            <div className="flex items-center gap-1">
              <ToggleSwitch
                isOn={property.propertyStatus === 'ACTIVE'}
                onToggle={() => handleToggleStatus(property)}
                size="sm"
              />
              <span className={`hidden sm:inline text-[9px] sm:text-[11px] font-bold whitespace-nowrap ${
                property.propertyStatus === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
              }`}>
                {property.propertyStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </td>

          {/* TYPE - lg+ only */}
          <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
            {property.type}
          </td>

          {/* PRICE */}
          <td className="py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-bold text-gray-800 truncate">
            {property.price}
          </td>

          {/* AREA - lg+ only */}
          <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
            {property.area}
          </td>

          {/* LOCATION - lg+ only */}
          <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm text-gray-700 truncate">
            {property.location}
          </td>

          {/* ACTIONS */}
          {/* ACTIONS */}
<td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
  <div className="flex items-center justify-end gap-1 sm:gap-1.5 lg:gap-2">

    {/* VIEW */}
    <button
      onClick={() => handleViewDetails(property)}
      className="
        flex items-center justify-center
        gap-1.5
        p-1.5
        lg:px-3 lg:py-2
        bg-gradient-to-r from-[#00695C] to-[#26A69A]
        text-white
        rounded-lg
        text-xs lg:text-sm
        font-bold
        hover:shadow-lg
        transition-all duration-300
        hover:scale-105
      "
      title="View"
    >
      <ViewIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />

      {/* Desktop text only */}
      <span className="hidden lg:inline">
        View
      </span>
    </button>

    {/* EDIT */}
    <button
      onClick={() => handleEditProperty(property)}
      className="
        flex items-center justify-center
        gap-1.5
        p-1.5
        lg:px-3 lg:py-2
        bg-gradient-to-r from-blue-500 to-blue-600
        text-white
        rounded-lg
        text-xs lg:text-sm
        font-bold
        hover:shadow-lg
        transition-all duration-300
        hover:scale-105
      "
      title="Edit"
    >
      <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />

      {/* Desktop text only */}
      <span className="hidden lg:inline">
        Edit
      </span>
    </button>

    {/* DELETE */}
    <button
      onClick={() => handleDeleteProperty(property)}
      className="
        flex items-center justify-center
        gap-1.5
        p-1.5
        lg:px-3 lg:py-2
        bg-gradient-to-r from-red-500 to-red-600
        text-white
        rounded-lg
        text-xs lg:text-sm
        font-bold
        hover:shadow-lg
        transition-all duration-300
        hover:scale-105
      "
      title="Delete"
    >
      <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />

      {/* Desktop text only */}
      <span className="hidden lg:inline">
        Delete
      </span>
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
      </div>

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
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-150px) translateX(var(--drift, 20px)) scale(1.5); opacity: 0; }
        }
        @keyframes fadeInTag {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
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
        .animate-float-particle { animation: floatParticle linear infinite; }
        .animate-fade-in { animation: fadeInTag 0.3s ease-out forwards; opacity: 0; }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .border-3 {
          border-width: 3px;
        }
        .focus:ring-3 {
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

export default OwnerProfile;