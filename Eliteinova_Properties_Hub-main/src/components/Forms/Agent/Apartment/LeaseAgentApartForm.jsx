import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, 
  Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, 
  Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, 
  Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, Dog, Wind, 
  Droplet, Layers, Layout, Smartphone, Mail, Phone, MessageCircle, Globe, 
  Compass, RefreshCw, User, Calendar as CalendarIcon, UserCheck, File, 
  MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, 
  CheckSquare, PenTool, Search, ChevronDown
} from "lucide-react";
import { createProperty } from "../../../../services/propertyService";
import { usePayment } from '../../../../hooks/usePayment.js';
import { loadRazorpayScript } from '../../../../utils/razorpayLoader.js';
import { storage } from "../../../../utils/storage.js";

const steps = [
  "Personal Details",
  "Business Information",
  "Property Details", 
  "Pricing & Amenities", 
  "Media Upload", 
  "Upload Documents", 
  "Bank Details",
  "Social Media",
  "Payment",
  "Declaration"
];

const subtitles = [
  "Enter your personal information",
  "Tell us about your agency",
  "Location, specifications & interior details",
  "Set lease pricing, tenant preferences & amenities",
  "Upload property photos, video & media",
  "Upload required documents",
  "Enter your bank details",
  "Social media & online presence",
  "Complete payment to list your property",
  "Confirm & submit"
];

const serviceAreaOptions = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
  "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
];

// Helper functions for validation
const isOnlyLettersAndSpaces = (value) => /^[A-Za-z\s]*$/.test(value);
const isOnlyDigits = (value) => /^\d*$/.test(value);
const isAlphanumericWithSpaces = (value) => /^[A-Za-z0-9\s]*$/.test(value);
const isValidIFSC = (code) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPincode = (code) => /^[0-9]{6}$/.test(code);

// Real-time filtering handlers
const handleAlphaFieldChange = (value) => {
  return value.replace(/[^A-Za-z\s]/g, '');
};

const handleNumericFieldChange = (value) => {
  return value.replace(/\D/g, '');
};

const handleAlphanumericFieldChange = (value) => {
  return value.replace(/[^A-Za-z0-9\s]/g, '');
};

const Field = ({ label, required, hint, error, children }) => (
  <div className="mb-2">
    <label className="block text-[12px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p className="text-[10px] text-red-500 mt-0.5 font-medium">{error}</p>
    ) : hint ? (
      <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>
    ) : null}
  </div>
);

const FieldDt = ({ label, required, hint, error, children }) => (
  <div className="mb-2.5">
    <label className="block text-[13px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? (
      <p className="text-[10px] text-red-500 mt-0.5 font-medium">{error}</p>
    ) : hint ? (
      <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>
    ) : null}
  </div>
);

const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";

const yesNoOptions = ["Yes", "No"];
const furnishingOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const tenantTypeOptions = ["Family", "Bachelor", "Working Professionals", "Students"];
const leaseDurationOptions = ["6 Months", "1 Year", "2+ Years"];
const contactTimeOptions = ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Anytime"];
const bedroomOptions = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK+"];
const bathroomOptions = ["1", "2", "3", "4+"];
const genderOptions = ["Male", "Female", "Other"];
const propertyTypeOptions = [
  "Serviced Apartment", 
  "Residential Apartment", 
  "Gated Community Studio", 
  "Luxury Apartment", 
  "Duplex Apartment", 
  "Condo Apartment", 
  "Penthouse Apartment"
];
const bankOptions = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"];

const apartmentLeaseAmenities = [
  { id: "coveredParking", label: "Covered Parking", icon: <ParkingCircle className="w-4 h-4" /> },
  { id: "lift", label: "Lift / Elevator", icon: <ArrowUpDown className="w-4 h-4" /> },
  { id: "security247", label: "24/7 Security", icon: <Shield className="w-4 h-4" /> },
  { id: "cctv", label: "CCTV Surveillance", icon: <Camera className="w-4 h-4" /> },
  { id: "powerBackup", label: "Power Backup", icon: <Lock className="w-4 h-4" /> },
  { id: "gym", label: "Gym / Fitness Center", icon: <Dumbbell className="w-4 h-4" /> },
  { id: "swimmingPool", label: "Swimming Pool", icon: <Waves className="w-4 h-4" /> },
  { id: "clubhouse", label: "Clubhouse", icon: <Hotel className="w-4 h-4" /> },
  { id: "playArea", label: "Children's Play Area", icon: <Users className="w-4 h-4" /> },
  { id: "garden", label: "Garden / Park", icon: <Trees className="w-4 h-4" /> },
  { id: "joggingTrack", label: "Jogging Track", icon: <Sprout className="w-4 h-4" /> },
  { id: "visitorParking", label: "Visitor Parking", icon: <ParkingCircle className="w-4 h-4" /> },
  { id: "wifi", label: "Wi-Fi / Broadband Ready", icon: <Wifi className="w-4 h-4" /> },
  { id: "smartHome", label: "Smart Home Features", icon: <Layout className="w-4 h-4" /> }
];

const interiorFeaturesList = ["Modular Kitchen", "Wardrobes", "Air Conditioning", "Utility Area", "Smart Home Features"];
const appliancesList = ["Refrigerator", "AC", "Washing Machine", "Microwave", "Dishwasher", "Water Purifier", "TV", "Oven"];
const nearbyPlacesList = ["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"];

// Searchable Multi-Select Component - Mobile Version
function SearchableMultiSelect({ options, value, onChange, placeholder = "Search and select...", error, className = "", disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== option));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div 
        className={`${inMob} cursor-pointer flex items-center justify-between min-h-[38px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${error ? 'border-red-500' : 'border-gray-200'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 max-h-24 overflow-y-auto py-0.5">
          {value.length > 0 ? (
            value.map(item => (
              <span key={item} className="bg-[#00695C]/10 text-[#00695C] text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 whitespace-nowrap">
                {item}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={(e) => removeOption(item, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-[11px]">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white p-1.5 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-7 pr-2 py-1 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:border-[#00695C]"
                placeholder="Search areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option}
                  className={`px-2 py-1.5 text-[11px] cursor-pointer hover:bg-teal-50 flex items-center gap-2 rounded-md ${
                    value.includes(option) ? 'bg-teal-50 text-[#00695C] font-medium' : 'text-gray-700'
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  <input
                    type="checkbox"
                    className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer"
                    checked={value.includes(option)}
                    onChange={() => {}}
                  />
                  {option}
                </div>
              ))
            ) : (
              <div className="px-2 py-2 text-[11px] text-gray-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Searchable Multi-Select Component - Desktop Version
function SearchableMultiSelectDt({ options, value, onChange, placeholder = "Search and select...", error, className = "", disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== option));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div 
        className={`${inDt} cursor-pointer flex items-center justify-between min-h-[42px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${error ? 'border-red-500' : 'border-gray-200'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 max-h-28 overflow-y-auto py-0.5">
          {value.length > 0 ? (
            value.map(item => (
              <span key={item} className="bg-[#00695C]/10 text-[#00695C] text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                {item}
                <X 
                  className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" 
                  onClick={(e) => removeOption(item, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-[12px]">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-gray-200 rounded-md focus:outline-none focus:border-[#00695C]"
                placeholder="Search areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option}
                  className={`px-3 py-1.5 text-[13px] cursor-pointer hover:bg-teal-50 flex items-center gap-2.5 rounded-md ${
                    value.includes(option) ? 'bg-teal-50 text-[#00695C] font-medium' : 'text-gray-700'
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  <input
                    type="checkbox"
                    className="accent-[#00695C] w-4 h-4 cursor-pointer"
                    checked={value.includes(option)}
                    onChange={() => {}}
                  />
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-[13px] text-gray-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeaseAgentApartForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    // Personal Details (Step 0)
    fullName: "", mobileNumber: "", emailId: "", gender: "", profilePhoto: null,

    // Business Information (Step 1)
    agencyName: "", reraNumber: "", gstNumber: "", yearsExperience: "", activeListings: "", serviceAreas: [],
    officeAddress: "",
    
    // Property Details (Step 2) - Location + Details & Interior combined
    city: "", area: "", landmark: "", pinCode: "", state: "", district: "", nearbyConnectivity: "",
    propertyType: "", bedrooms: "", bathrooms: "", floorNumber: "", totalFloors: "",
    facingDirection: "", balcony: "", propertyAge: "", cornerUnit: "",
    builtUpArea: "", carpetArea: "",
    furnishing: "", interiorFeatures: [], appliancesIncluded: [],

    postedBy:"agent", propertyCategory:"Apartment", listingPurpose:"lease",
    
    // Pricing & Amenities (Step 3)
    leaseAmount: "", budgetRange: { min: "", max: "" }, 
    securityDeposit: "",
    leaseDuration: "", maintenanceIncluded: "", leaseNegotiable: "Fixed",
    ownershipType: "",
    tenantType: [], petFriendly: "", dietaryPreference: "", smokingAllowed: "",
    selectedAmenities: [], otherAmenities: "",
    immediateOccupancy: "", availableFrom: "", leaseRenewalOption: "",
    nearbyPlaces: [],
    contactVia: "", preferredContactTime: "",
    
    // Media Upload (Step 4)
    propertyImages: [], propertyVideo: null, coverImage: null,
    
    // Upload Documents (Step 5) - Identity, Agency & Legal documents combined
    aadhaarCardDoc: null, panCardDoc: null, agencyLogo: null,
    reraCertificateDoc: null, gstCertificateDoc: null, businessRegistrationDoc: null,
    floorPlan: null, leaseAgreement: null, propertyTaxReceipt: null, saleDeed: null,

    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",

    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    paymentId: null,
    paymentOrderId: null,
    paymentSignature: null,
    paymentAmount: null,
    paymentStatus: 'idle',
    
    // Declaration & Signature (Step 8)
    declarationAccepted1: false,
    declarationAccepted2: false,
    declarationAccepted3: false,
    signature: null, signatureDate: "", signaturePlace: ""
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  const [allSignaturePoints, setAllSignaturePoints] = useState([]);
  const [activeCanvas, setActiveCanvas] = useState(null);

  const [errors, setErrors] = useState({});

  const user = storage.get("user");


  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript().then(loaded => {
        if (!loaded) {
          console.warn('Razorpay script failed to load');
        }
      });
    }
  }, [isOpen]);


  

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const limitedFiles = files.slice(0, 3 - formData.propertyImages.length);
    const newImages = [...formData.propertyImages, ...limitedFiles];
    updateForm("propertyImages", newImages);
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = formData.propertyImages.filter((_, i) => i !== index);
    updateForm("propertyImages", newImages);
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Cover image must be less than 2MB");
        return;
      }
      updateForm("coverImage", file);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCoverImage = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    updateForm("coverImage", null);
    setCoverPreview(null);
  };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Floor plan must be a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Floor plan must be less than 5MB");
        return;
      }
      updateForm("floorPlan", file);
      if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
      setFloorPlanPreview(URL.createObjectURL(file));
    }
  };

  const removeFloorPlan = () => {
    if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
    updateForm("floorPlan", null);
    setFloorPlanPreview(null);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Video must be less than 10MB");
        return;
      }
      updateForm("propertyVideo", file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    updateForm("propertyVideo", null);
    setVideoPreview(null);
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Profile photo must be less than 2MB");
        return;
      }
      updateForm("profilePhoto", file);
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const removeProfilePhoto = () => {
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    updateForm("profilePhoto", null);
    setProfilePhotoPreview(null);
  };

  const handleDocumentUpload = (docType, e, maxSize = 5) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert(`${docType} must be a PDF file`);
        return;
      }
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${docType} must be less than ${maxSize}MB`);
        return;
      }
      updateForm(docType, file);
      if (errors[docType]) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[docType];
          return next;
        });
      }
    }
  };

  const removeDocument = (docType) => {
    updateForm(docType, null);
  };

  const toggleAmenity = (amenity) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenity)) {
      updateForm("selectedAmenities", current.filter(a => a !== amenity));
    } else {
      updateForm("selectedAmenities", [...current, amenity]);
    }
  };

  const toggleApartmentAmenity = (amenityId) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenityId)) {
      updateForm("selectedAmenities", current.filter(id => id !== amenityId));
    } else {
      updateForm("selectedAmenities", [...current, amenityId]);
    }
  };

  const toggleArrayItem = (field, value) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      updateForm(field, current.filter(v => v !== value));
    } else {
      updateForm(field, [...current, value]);
    }
  };

  const addCustomAmenity = () => {
    const newAmenity = formData.otherAmenities.trim();
    if (newAmenity && !formData.selectedAmenities.includes(newAmenity) && !customAmenitiesList.includes(newAmenity)) {
      setCustomAmenitiesList([...customAmenitiesList, newAmenity]);
      updateForm("selectedAmenities", [...formData.selectedAmenities, newAmenity]);
      updateForm("otherAmenities", "");
    }
  };

  const removeCustomAmenity = (amenity) => {
    setCustomAmenitiesList(customAmenitiesList.filter(a => a !== amenity));
    updateForm("selectedAmenities", formData.selectedAmenities.filter(a => a !== amenity));
  };

  // Signature handling
  const startDrawing = (e, canvasId) => {
    const canvas = document.getElementById(canvasId);
    const rect = canvas.getBoundingClientRect();
    setIsDrawing(true);
    setActiveCanvas(canvasId);
    const point = {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top
    };
    setSignaturePoints([point]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = document.getElementById(activeCanvas);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top
    };
    setSignaturePoints([...signaturePoints, point]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (signaturePoints.length > 1 && activeCanvas) {
      setAllSignaturePoints([...allSignaturePoints, [...signaturePoints]]);
      const canvas = document.getElementById(activeCanvas);
      const ctx = canvas.getContext('2d');
      const dataUrl = canvas.toDataURL('image/png');
      updateForm('signature', dataUrl);
    }
    setActiveCanvas(null);
  };

  const clearSignature = () => {
    setSignaturePoints([]);
    setAllSignaturePoints([]);
    updateForm('signature', null);
    ['signatureCanvas', 'm-signatureCanvas', 'dt-signatureCanvas'].forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  };


  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!formData.fullName.trim()) e.fullName = "Full name is required";
      else if (!isOnlyLettersAndSpaces(formData.fullName)) e.fullName = "Only letters and spaces allowed";
      if (!formData.mobileNumber || formData.mobileNumber.length !== 10) e.mobileNumber = "Enter a valid 10-digit mobile number";
      else if (!isOnlyDigits(formData.mobileNumber)) e.mobileNumber = "Mobile number must contain only digits";
      if (!formData.emailId || !isValidEmail(formData.emailId)) e.emailId = "Enter a valid email address";
      if (!formData.gender) e.gender = "Please select your gender";
    }
    if (s === 1) {
      if (!formData.agencyName.trim()) e.agencyName = "Agency name is required";
      if (!formData.yearsExperience) e.yearsExperience = "Years of experience is required";
      else if (parseInt(formData.yearsExperience) < 0) e.yearsExperience = "Years of experience cannot be negative";
      else if (!isOnlyDigits(formData.yearsExperience)) e.yearsExperience = "Only digits allowed";
      if (!formData.serviceAreas || formData.serviceAreas.length === 0) e.serviceAreas = "Please select at least one service area";
      if (!formData.officeAddress.trim()) e.officeAddress = "Office address is required";
    }
    if (s === 2) {
      if (!formData.city.trim()) e.city = "City is required";
      else if (!isOnlyLettersAndSpaces(formData.city)) e.city = "Only letters and spaces allowed";
      if (!formData.area.trim()) e.area = "Area/Locality is required";
      else if (!isAlphanumericWithSpaces(formData.area)) e.area = "Only letters, numbers and spaces allowed";
      if (formData.pinCode && !isValidPincode(formData.pinCode)) e.pinCode = "Enter a valid 6-digit PIN code";
      if (formData.state && !isOnlyLettersAndSpaces(formData.state)) e.state = "Only letters and spaces allowed";
      if (formData.district && !isOnlyLettersAndSpaces(formData.district)) e.district = "Only letters and spaces allowed";
      if (!formData.propertyType) e.propertyType = "Please select a property type";
      if (!formData.bedrooms) e.bedrooms = "Please select number of bedrooms";
      if (!formData.bathrooms) e.bathrooms = "Please select number of bathrooms";
      if (formData.builtUpArea && !isOnlyDigits(formData.builtUpArea)) e.builtUpArea = "Only digits allowed";
      if (formData.carpetArea && !isOnlyDigits(formData.carpetArea)) e.carpetArea = "Only digits allowed";
      if (formData.floorNumber && !isOnlyDigits(formData.floorNumber)) e.floorNumber = "Only digits allowed";
      if (formData.totalFloors && !isOnlyDigits(formData.totalFloors)) e.totalFloors = "Only digits allowed";
      if (formData.propertyAge && !isOnlyDigits(formData.propertyAge)) e.propertyAge = "Only digits allowed";
    }
    if (s === 3) {
      if (!formData.leaseAmount) e.leaseAmount = "Lease amount is required";
      else if (parseFloat(formData.leaseAmount) < 0) e.leaseAmount = "Lease amount cannot be negative";
      else if (!isOnlyDigits(formData.leaseAmount)) e.leaseAmount = "Only digits allowed";
      if (formData.securityDeposit && !isOnlyDigits(formData.securityDeposit)) e.securityDeposit = "Only digits allowed";
    }
    if (s === 4) {
      if (!formData.coverImage) e.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) e.propertyImages = "At least one property photo is required";
    }
    if (s === 5) {
      if (!formData.aadhaarCardDoc) e.aadhaarCardDoc = "Aadhaar card is required";
      if (!formData.panCardDoc) e.panCardDoc = "PAN card is required";
      if (!formData.floorPlan) e.floorPlan = "Floor plan is required";
      if (!formData.leaseAgreement) e.leaseAgreement = "Lease agreement is required";
    }
    if (s === 6) {
      if (!formData.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
      else if (!isOnlyLettersAndSpaces(formData.accountHolderName)) e.accountHolderName = "Only letters and spaces allowed";
      if (!formData.accountNumber) e.accountNumber = "Account number is required";
      else if (!formData.accountNumber.match(/^[0-9]{9,18}$/)) e.accountNumber = "Account number must be between 9-18 digits";
      if (!formData.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      else if (!isValidIFSC(formData.ifscCode)) e.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
      if (!formData.bankName) e.bankName = "Bank name is required";
    }
    if (s === 7) {
      // No required fields in social media step
    }
    if (s === 8) { // Payment step
      if (paymentStatus !== 'success') {
        errors.payment = 'Please complete the payment first';
      }
    }
    if (s === 9) {

      if (formData.paymentStatus !== 'paid') {
        e.payment = "Please complete the payment first";
      }

      if (!formData.signature) e.signature = "Please draw your signature";
      if (!formData.signatureDate) e.signatureDate = "Date is required";
      if (!formData.signaturePlace.trim()) e.signaturePlace = "Place is required";
      else if (!isOnlyLettersAndSpaces(formData.signaturePlace)) e.signaturePlace = "Only letters and spaces allowed";
      if (!formData.declarationAccepted1) e.declarationAccepted1 = "You must confirm this to proceed";
      if (!formData.declarationAccepted2) e.declarationAccepted2 = "You must confirm this to proceed";
      if (!formData.declarationAccepted3) e.declarationAccepted3 = "You must agree to proceed";
    }
    return e;
  };

  const handleSubmit = async () => {
    if (step === 8) {
      initiatePayment();
      return;
    }
    if (step === 9) {
      const stepErrors = validateStep(9);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      if (formData.paymentStatus !== 'paid') {
        setErrors({ payment: 'Please complete the payment first' });
        setStep(8);
        return;
      }

      try {
        const submitData = {
          ...formData,
          payment_id: formData.paymentId,
          payment_order_id: formData.paymentOrderId,
          payment_signature: formData.paymentSignature,
          payment_amount: formData.paymentAmount,
          payment_status: 'paid'
        };

        const response = await createProperty(submitData);
        
        if (response.status === 'success' || response.id) {
          onClose();
          // Navigate to profile page
          window.location.href = `/profile/${formData.postedBy}`;
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert('Failed to submit property. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MOBILE */}
      <div className="fixed inset-0 z-50 flex flex-col sm:hidden">
        <div className="bg-black/50" style={{ height: "10vh" }} onClick={onClose} />
        <div className="flex-1 bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl mx-5 mb-5">
          <div className="relative flex flex-col items-center justify-center px-4 pt-3 pb-3 overflow-hidden shrink-0 rounded-t-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)", minHeight: 75 }}>
            <button onClick={onClose} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]">✕</button>
            <div className="text-xl mb-0.5 relative z-10">🏢</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Apartment - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List apartment for lease on behalf of client</p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1.5 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[40px]">
                <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[7px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 py-2.5 overflow-y-auto flex-1">
            <MobContentLeaseAgentApart
              step={step}
              inp={inMob}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              removeDocument={removeDocument}
              toggleAmenity={toggleAmenity}
              toggleApartmentAmenity={toggleApartmentAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              tenantTypeOptions={tenantTypeOptions}
              leaseDurationOptions={leaseDurationOptions}
              contactTimeOptions={contactTimeOptions}
              apartmentLeaseAmenities={apartmentLeaseAmenities}
              toggleArrayItem={toggleArrayItem}
              bankOptions={bankOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              profilePhotoPreview={profilePhotoPreview}
              removeProfilePhoto={removeProfilePhoto}
              errors={errors}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              bedroomOptions={bedroomOptions}
              bathroomOptions={bathroomOptions}
              genderOptions={genderOptions}
              propertyTypeOptions={propertyTypeOptions}
              interiorFeaturesList={interiorFeaturesList}
              appliancesList={appliancesList}
              nearbyPlacesList={nearbyPlacesList}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphanumericFieldChange={handleAlphanumericFieldChange}
              isOnlyLettersAndSpaces={isOnlyLettersAndSpaces}
              isOnlyDigits={isOnlyDigits}
              isValidIFSC={isValidIFSC}
              isValidEmail={isValidEmail}
              isValidPincode={isValidPincode}
              serviceAreaOptions={serviceAreaOptions}
              SearchableMultiSelect={SearchableMultiSelect}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white border-t border-teal-100">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < steps.length - 1 && (
              <div className="px-3 pt-1.5 pb-0.5">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />Form completion</span>
                  <span className="text-[8px] text-[#00695C] font-bold">{Math.round(((step + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1 pt-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? 'w-2.5 h-1 bg-green-400' : i === step ? 'w-4 h-1 bg-[#00695C]' : 'w-1 h-1 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2 px-3 py-2">
              {step > 0 && (
                <button className="px-3 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                className={`flex-1 py-2 text-[12px] font-semibold text-white rounded-xl flex items-center justify-center gap-1 shadow ${step === steps.length - 1 ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-[#00695C] to-[#00897B]'}`}
                onClick={() => {
                  const stepErrors = validateStep(step);
                  if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
                  setErrors({});
                  step === steps.length - 1 ? handleSubmit() : setStep(step + 1);
                }}
              >
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue →</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="fixed inset-0 bg-black/60 z-50 hidden sm:flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="relative flex flex-col items-center justify-center min-h-[65px] px-4 pt-2.5 pb-2.5 overflow-hidden shrink-0 rounded-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)" }}>
            <button onClick={onClose} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]">✕</button>
            <div className="text-xl mb-0.5 relative z-10">🏢</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Apartment - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List apartment for lease on behalf of client</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[44px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[7px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContentLeaseAgentApart
              step={step}
              inp={inDt}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              removeDocument={removeDocument}
              toggleAmenity={toggleAmenity}
              toggleApartmentAmenity={toggleApartmentAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              tenantTypeOptions={tenantTypeOptions}
              leaseDurationOptions={leaseDurationOptions}
              contactTimeOptions={contactTimeOptions}
              apartmentLeaseAmenities={apartmentLeaseAmenities}
              toggleArrayItem={toggleArrayItem}
              bankOptions={bankOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              profilePhotoPreview={profilePhotoPreview}
              removeProfilePhoto={removeProfilePhoto}
              errors={errors}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              bedroomOptions={bedroomOptions}
              bathroomOptions={bathroomOptions}
              genderOptions={genderOptions}
              propertyTypeOptions={propertyTypeOptions}
              interiorFeaturesList={interiorFeaturesList}
              appliancesList={appliancesList}
              nearbyPlacesList={nearbyPlacesList}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphanumericFieldChange={handleAlphanumericFieldChange}
              isOnlyLettersAndSpaces={isOnlyLettersAndSpaces}
              isOnlyDigits={isOnlyDigits}
              isValidIFSC={isValidIFSC}
              isValidEmail={isValidEmail}
              isValidPincode={isValidPincode}
              serviceAreaOptions={serviceAreaOptions}
              SearchableMultiSelectDt={SearchableMultiSelectDt}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white rounded-b-2xl border-t border-teal-100 overflow-hidden">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < steps.length - 1 && (
              <div className="px-4 pt-1.5 pb-0.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[8px] text-gray-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />Form completion</span>
                  <span className="text-[8px] text-[#00695C] font-bold">{Math.round(((step + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1.5 pt-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? 'w-3 h-1.5 bg-green-400' : i === step ? 'w-5 h-1.5 bg-[#00695C]' : 'w-1.5 h-1.5 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2 px-4 py-2">
              {step > 0 && (
                <button className="px-4 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1 border border-teal-200" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button className={`px-5 py-1.5 text-[12px] font-semibold text-white rounded-lg flex items-center gap-1.5 ml-auto shadow-md hover:-translate-y-0.5 ${step === steps.length - 1 ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-[#00695C] to-[#00897B]'}`}
                onClick={() => {
                  const stepErrors = validateStep(step);
                  if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
                  setErrors({});
                  step === steps.length - 1 ? handleSubmit() : setStep(step + 1);
                }}>
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue <span className="text-sm">→</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


const PaymentStep = () => (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">💳 Complete Payment</h3>
      </div>
      
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 mb-4 text-center">
        <p className="text-[13px] font-semibold text-[#00695C]">
          Listing Fee:
        </p>
        <p className="text-[10px] text-gray-500">
         
        </p>
      </div>

      {paymentStatus === 'idle' && (
        <button
          onClick={initiatePayment}
          disabled={paymentProcessing}
          className="w-full py-3 bg-gradient-to-r from-[#00695C] to-[#00897B] text-white rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 disabled:opacity-60 hover:shadow-lg transition-all"
        >
          💳 Pay Now
        </button>
      )}

      {paymentStatus === 'processing' && (
        <div className="text-center py-4">
          <div className="animate-spin text-3xl mb-2">⏳</div>
          <p className="text-[13px] text-gray-600">Processing payment...</p>
          <p className="text-[10px] text-gray-400 mt-1">Please don't close this window</p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-center py-4 bg-green-50 rounded-xl border border-green-200">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-[13px] font-semibold text-green-600">Payment Successful!</p>
          <p className="text-[11px] text-gray-500 mt-1">Submitting your property...</p>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="text-center py-4 bg-red-50 rounded-xl border border-red-200">
          <div className="text-3xl mb-2">❌</div>
          <p className="text-[13px] font-semibold text-red-600">Payment Failed</p>
          {paymentError && (
            <p className="text-[11px] text-red-500 mt-1">{paymentError}</p>
          )}
          <button
            onClick={initiatePayment}
            className="mt-3 px-6 py-2 bg-[#00695C] text-white rounded-lg text-[12px] hover:bg-[#004d42] transition-colors"
          >
            Retry Payment
          </button>
        </div>
      )}

      <p className="text-[9px] text-gray-400 text-center mt-3">
        🔒 Secure payment via Razorpay
      </p>
    </>
  );

// MOBILE CONTENT - Lease Agent Apartment
function MobContentLeaseAgentApart({ 
  step, inp, formData, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, removeDocument,
  toggleAmenity, toggleApartmentAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  tenantTypeOptions, leaseDurationOptions, contactTimeOptions,
  apartmentLeaseAmenities, toggleArrayItem,
  bankOptions,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  errors,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  bedroomOptions, bathroomOptions, genderOptions, propertyTypeOptions,
  interiorFeaturesList, appliancesList, nearbyPlacesList,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphanumericFieldChange,
  isOnlyLettersAndSpaces, isOnlyDigits, isValidIFSC, isValidEmail, isValidPincode,
  serviceAreaOptions, SearchableMultiSelect
}) {
  const ta = `${inp} resize-y`;
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      allSignaturePoints.forEach(stroke => {
        if (stroke.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#00695C';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          stroke.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
      });
      
      if (signaturePoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#00695C';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        signaturePoints.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  }, [signaturePoints, allSignaturePoints]);

  // STEP 0: Personal Details
  if (step === 0) return (
    <>
      <Field label="Full Name" required>
        <input className={inp} placeholder="Enter your full name" value={formData.fullName} onChange={(e) => updateForm("fullName", handleAlphaFieldChange(e.target.value))} />
        {errors.fullName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.fullName}</p>}
      </Field>
      <Field label="Mobile Number" required>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", handleNumericFieldChange(e.target.value).slice(0, 10))} />
        {errors.mobileNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.mobileNumber}</p>}
      </Field>
      <Field label="Email Address" required>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
        {errors.emailId && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.emailId}</p>}
      </Field>
      <Field label="Gender" required>
        <div className="flex gap-4">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-gender-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.gender}</p>}
      </Field>
      <Field label="Profile Photo" hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-profile-photo" onChange={handleProfilePhotoUpload} />
          <label htmlFor="m-profile-photo" className="cursor-pointer flex flex-col items-center">
            <User className="mb-1 w-7 h-7 text-[#00695C]" />
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Profile Photo</span>
            <span className="text-[10px] text-gray-400">JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {profilePhotoPreview && (
          <div className="mt-2 relative">
            <img src={profilePhotoPreview} alt="Profile" className="w-20 h-20 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeProfilePhoto} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
    </>
  );

  // STEP 1: Business Information (UPDATED with SearchableMultiSelect)
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Agency Information</h3>
      </div>
      <Field label="Agency Name" required>
        <input className={inp} placeholder="Enter your agency name" value={formData.agencyName} onChange={(e) => updateForm("agencyName", e.target.value)} />
        {errors.agencyName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.agencyName}</p>}
      </Field>
      <Field label="RERA Registration Number" hint="If applicable">
        <input className={inp} placeholder="Enter RERA registration number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </Field>
      <Field label="GST Number" hint="Optional">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </Field>
      <Field label="Years of Experience" required>
        <input className={inp} type="number" min="0" placeholder="Enter years of experience" value={formData.yearsExperience} onChange={(e) => updateForm("yearsExperience", handleNumericFieldChange(e.target.value))} />
        {errors.yearsExperience && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.yearsExperience}</p>}
      </Field>
      <Field label="Number of Active Listings">
        <input className={inp} type="number" min="0" placeholder="Enter number of active listings" value={formData.activeListings} onChange={(e) => updateForm("activeListings", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Service Areas" required>
        <SearchableMultiSelect
          options={serviceAreaOptions}
          value={formData.serviceAreas}
          onChange={(value) => updateForm("serviceAreas", value)}
          placeholder="Search and select service areas..."
          error={errors.serviceAreas}
        />
        {errors.serviceAreas && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.serviceAreas}</p>}
      </Field>
      <Field label="Office Address" required>
        <input className={inp} placeholder="Enter your office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
        {errors.officeAddress && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.officeAddress}</p>}
      </Field>
    </>
  );

  // STEP 2: Property Details (Location + Details & Interior combined)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <Field label="City" required>
        <input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e) => updateForm("city", handleAlphaFieldChange(e.target.value))} />
        {errors.city && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.city}</p>}
      </Field>
      <Field label="Area / Locality" required>
        <input className={inp} placeholder="Enter area or locality" value={formData.area} onChange={(e) => updateForm("area", handleAlphanumericFieldChange(e.target.value))} />
        {errors.area && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.area}</p>}
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </Field>
      <Field label="State">
        <input className={inp} placeholder="Enter state name" value={formData.state} onChange={(e) => updateForm("state", handleAlphaFieldChange(e.target.value))} />
        {errors.state && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.state}</p>}
      </Field>
      <Field label="District">
        <input className={inp} placeholder="Enter district name" value={formData.district} onChange={(e) => updateForm("district", handleAlphaFieldChange(e.target.value))} />
        {errors.district && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.district}</p>}
      </Field>
      <Field label="PIN Code" hint="Exactly 6 digits">
        <input className={inp} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", handleNumericFieldChange(e.target.value).slice(0, 6))} />
        {errors.pinCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.pinCode}</p>}
      </Field>
      <Field label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🏠 Property Specifications</h3>
      </div>
      <Field label="Property Type" required>
        <div className="grid grid-cols-2 gap-1">
          {propertyTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-property-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === type} onChange={() => updateForm("propertyType", type)} />
              {type}
            </label>
          ))}
        </div>
        {errors.propertyType && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyType}</p>}
      </Field>
      <Field label="Built-up Area" hint="In square feet">
        <input className={inp} type="number" min="0" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", handleNumericFieldChange(e.target.value))} />
        {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
      </Field>
      <Field label="Carpet Area" hint="In square feet">
        <input className={inp} type="number" min="0" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", handleNumericFieldChange(e.target.value))} />
        {errors.carpetArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.carpetArea}</p>}
      </Field>
      <Field label="Number of Bedrooms" required>
        {bedroomOptions.map(bhk => (
          <label key={bhk} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-bhk-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bedrooms === bhk} onChange={() => updateForm("bedrooms", bhk)} />
            {bhk}
          </label>
        ))}
        {errors.bedrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bedrooms}</p>}
      </Field>
      <Field label="Number of Bathrooms" required>
        {bathroomOptions.map(b => (
          <label key={b} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-bath-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === b} onChange={() => updateForm("bathrooms", b)} />
            {b}
          </label>
        ))}
        {errors.bathrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bathrooms}</p>}
      </Field>
      <Field label="Floor Number">
        <input className={inp} type="number" min="0" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => updateForm("floorNumber", handleNumericFieldChange(e.target.value))} />
        {errors.floorNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.floorNumber}</p>}
      </Field>
      <Field label="Total Floors">
        <input className={inp} type="number" min="0" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => updateForm("totalFloors", handleNumericFieldChange(e.target.value))} />
        {errors.totalFloors && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.totalFloors}</p>}
      </Field>
      <Field label="Facing Direction">
        <div className="grid grid-cols-2 gap-1">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-facing-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Balcony">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-balcony-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Property Age">
        <input className={inp} type="number" min="0" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => updateForm("propertyAge", handleNumericFieldChange(e.target.value))} />
        {errors.propertyAge && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyAge}</p>}
      </Field>
      <Field label="Corner Unit">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-corner-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.cornerUnit === opt} onChange={() => updateForm("cornerUnit", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🪑 Interior Details</h3>
      </div>
      <Field label="Furnishing Status">
        <div className="grid grid-cols-2 gap-1">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-furnish-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishing === f} onChange={() => updateForm("furnishing", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Interior Features">
        <div className="grid grid-cols-2 gap-1">
          {interiorFeaturesList.map(feature => (
            <label key={feature} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.interiorFeatures || []).includes(feature)} onChange={() => toggleArrayItem("interiorFeatures", feature)} />
              {feature}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Appliances Included">
        <div className="grid grid-cols-2 gap-1">
          {appliancesList.map(appliance => (
            <label key={appliance} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.appliancesIncluded || []).includes(appliance)} onChange={() => toggleArrayItem("appliancesIncluded", appliance)} />
              {appliance}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  // STEP 3: Pricing & Amenities
  if (step === 3) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📄 Lease Details</h3>
      </div>
      <Field label="Lease Amount (₹)" required>
        <input className={inp} type="number" min="0" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => updateForm("leaseAmount", handleNumericFieldChange(e.target.value))} />
        {errors.leaseAmount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.leaseAmount}</p>}
      </Field>
      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: handleNumericFieldChange(e.target.value) })} />
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: handleNumericFieldChange(e.target.value) })} />
        </div>
      </Field>
      <Field label="Security / Deposit Amount (₹)">
        <input className={inp} type="number" min="0" placeholder="Enter security/deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", handleNumericFieldChange(e.target.value))} />
        {errors.securityDeposit && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDeposit}</p>}
      </Field>
      <Field label="Lease Duration">
        <div className="grid grid-cols-2 gap-1">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-duration-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Maintenance Charges Included">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-maint-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Lease Negotiable">
        <div className="flex gap-4">
          {["Fixed", "Negotiable"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-negotiable-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseNegotiable === opt} onChange={() => updateForm("leaseNegotiable", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">👥 Tenant Preferences</h3>
      </div>
      <Field label="Tenant Type">
        <div className="grid grid-cols-2 gap-1">
          {tenantTypeOptions.map(t => (
            <label key={t} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.tenantType || []).includes(t)} onChange={() => toggleArrayItem("tenantType", t)} />
              {t}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Pet Friendly">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-pet-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Dietary Preference">
        <div className="flex gap-4">
          {["Veg Only", "No Restriction"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-diet-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.dietaryPreference === opt} onChange={() => updateForm("dietaryPreference", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Smoking Allowed">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-smoking-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === opt} onChange={() => updateForm("smokingAllowed", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">✨ Amenities</h3>
      </div>
      <Field label="Select Amenities">
        <div className="grid grid-cols-2 gap-1">
          {apartmentLeaseAmenities.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.selectedAmenities.includes(amenity.id)} onChange={() => toggleApartmentAmenity(amenity.id)} />
              {amenity.icon}
              {amenity.label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Other Amenities">
        <div className="flex gap-1">
          <input className={`${inp} flex-1`} placeholder="e.g., Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-2 py-1 text-[11px] bg-[#00695C] text-white rounded-lg">Add</button>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {customAmenitiesList.map(a => (
            <span key={a} className="px-1.5 py-0.5 text-[10px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {a}
              <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
            </span>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📅 Availability</h3>
      </div>
      <Field label="Immediate Occupancy">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-occupancy-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </Field>
      <Field label="Lease Renewal Option">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-renewal-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === opt} onChange={() => updateForm("leaseRenewalOption", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Nearby Access</h3>
      </div>
      <Field label="Nearby Places">
        <div className="grid grid-cols-2 gap-1">
          {nearbyPlacesList.map(place => (
            <label key={place} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.nearbyPlaces || []).includes(place)} onChange={() => toggleArrayItem("nearbyPlaces", place)} />
              {place}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  // STEP 4: Media Upload
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Media Upload</h3>
      </div>
      <p className="text-[10px] text-center text-gray-400 mb-2">📸 Upload property images and media</p>
      
      <Field label="Upload Cover Image" required hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-cover-apart" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-apart" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="mb-1 w-7 h-7 text-[#00695C]" />
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Cover Image</span>
            <span className="text-[10px] text-gray-400">JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {coverPreview && (
          <div className="mt-2 relative">
            <img src={coverPreview} alt="Cover" className="w-full h-20 object-cover rounded-lg" />
            <button onClick={removeCoverImage} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
        {errors.coverImage && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.coverImage}</p>}
      </Field>

      <Field label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-apart" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-apart" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="mb-1 w-7 h-7 text-[#00695C]" />
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Property Photos</span>
            <span className="text-[10px] text-gray-400">Max 3 photos</span>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-1">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-16 object-cover rounded-lg" />
                <button onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
        {errors.propertyImages && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyImages}</p>}
      </Field>

      <Field label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-apart" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-apart" className="cursor-pointer flex flex-col items-center">
            <Video className="mb-1 w-7 h-7 text-[#00695C]" />
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Video Tour</span>
            <span className="text-[10px] text-gray-400">MP4/MOV (Max 10MB)</span>
          </label>
        </div>
        {videoPreview && (
          <div className="mt-2 relative">
            <video src={videoPreview} controls className="w-full h-24 object-cover rounded-lg" />
            <button onClick={removeVideo} className="absolute top-1 right-1 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
    </>
  );

  // STEP 5: Upload Documents
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Upload Documents</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">All documents must be in PDF format</p>

      <Field label="Aadhaar Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-doc" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="m-aadhaar-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCardDoc.name}</p>}
        {errors.aadhaarCardDoc && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.aadhaarCardDoc}</p>}
      </Field>

      <Field label="PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-doc" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
        {errors.panCardDoc && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.panCardDoc}</p>}
      </Field>

      <Field label="Agency Logo" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-logo" onChange={(e) => handleDocumentUpload("agencyLogo", e, 2)} />
          <label htmlFor="m-logo" className="cursor-pointer flex flex-col items-center">
            <Building className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.agencyLogo && <p className="text-[10px] text-green-600 mt-1">✓ {formData.agencyLogo.name}</p>}
      </Field>

      <Field label="RERA Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-rera-doc" onChange={(e) => handleDocumentUpload("reraCertificateDoc", e)} />
          <label htmlFor="m-rera-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA Certificate</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertificateDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCertificateDoc.name}</p>}
      </Field>

      <Field label="GST Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gst-doc" onChange={(e) => handleDocumentUpload("gstCertificateDoc", e)} />
          <label htmlFor="m-gst-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST Certificate</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertificateDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCertificateDoc.name}</p>}
      </Field>

      <Field label="Business Registration Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-business-doc" onChange={(e) => handleDocumentUpload("businessRegistrationDoc", e)} />
          <label htmlFor="m-business-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.businessRegistrationDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.businessRegistrationDoc.name}</p>}
      </Field>

      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-apart" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-apart" className="cursor-pointer flex flex-col items-center">
            <Home className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Floor Plan</span>
            <span className="text-[9px] text-gray-400">PDF only</span>
          </label>
        </div>
        {floorPlanPreview && (
          <div className="mt-1 relative">
            <p className="text-[10px] text-green-600">✓ {formData.floorPlan?.name}</p>
            <button onClick={removeFloorPlan} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
        {errors.floorPlan && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.floorPlan}</p>}
      </Field>

      <Field label="Lease Agreement" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-leaseAgreement-apart" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="m-leaseAgreement-apart" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Lease Agreement</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[10px] text-green-600 mt-1">✓ {formData.leaseAgreement.name}</p>}
        {errors.leaseAgreement && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.leaseAgreement}</p>}
      </Field>

      <Field label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-tax-apart" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="m-tax-apart" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Tax Receipt</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[10px] text-green-600 mt-1">✓ {formData.propertyTaxReceipt.name}</p>}
      </Field>

      <Field label="Sale Deed (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-saleDeed-apart" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="m-saleDeed-apart" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Sale Deed</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[10px] text-green-600 mt-1">✓ {formData.saleDeed.name}</p>}
      </Field>
    </>
  );

  // STEP 6: Bank Details
  if (step === 6) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">Enter your bank details for payments</p>
      <Field label="Account Holder Name" required>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
        {errors.accountHolderName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountHolderName}</p>}
      </Field>
      <Field label="Bank Name" required>
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.bankName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bankName}</p>}
      </Field>
      <Field label="Account Number" required hint="9-18 digits">
        <input className={inp} type="tel" inputMode="numeric" maxLength={18} placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", handleNumericFieldChange(e.target.value).slice(0, 18))} />
        {errors.accountNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountNumber}</p>}
      </Field>
      <Field label="IFSC Code" required hint="e.g., SBIN0001234">
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
        {errors.ifscCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ifscCode}</p>}
      </Field>
      <Field label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </Field>
    </>
  );

  // STEP 7: Social Media
  if (step === 7) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Social Media & Online Presence</h3>
      </div>
      <Field label="Website">
        <input className={inp} placeholder="Enter website URL" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} />
      </Field>
      <Field label="Facebook Page">
        <input className={inp} placeholder="Enter Facebook URL" value={formData.facebook} onChange={(e) => updateForm("facebook", e.target.value)} />
      </Field>
      <Field label="Instagram">
        <input className={inp} placeholder="Enter Instagram URL" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} />
      </Field>
      <Field label="LinkedIn">
        <input className={inp} placeholder="Enter LinkedIn URL" value={formData.linkedin} onChange={(e) => updateForm("linkedin", e.target.value)} />
      </Field>
      <Field label="YouTube Channel">
        <input className={inp} placeholder="Enter YouTube URL" value={formData.youtube} onChange={(e) => updateForm("youtube", e.target.value)} />
      </Field>
    </>
  );
  if(step === 8 ) return <PaymentStep />;

  // STEP 8: Declaration & Signature
  if (step === 9) return (
    <>

      {/* Signature Section */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[11px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-3.5 h-3.5" /> Agent Signature <span className="text-red-500">*</span>
      </label>
      <p className="text-[10px] text-gray-500 mb-2">Draw your signature in the box below</p>
      <div className="relative">
        <canvas
          id="m-signatureCanvas"
          ref={signatureCanvasRef}
          width="400"
          height="100"
          className="signature-canvas w-full h-24 rounded-lg border-2 border-[#00695C] bg-white touch-none cursor-crosshair"
          onMouseDown={(e) => startDrawing(e, 'm-signatureCanvas')}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => startDrawing(e, 'm-signatureCanvas')}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button
          type="button"
          onClick={clearSignature}
          className="absolute top-1 right-1 bg-[#00695C] text-white px-2 py-0.5 rounded text-[10px] hover:bg-[#004d42] transition-colors"
        >
          Clear
        </button>
      </div>
      {errors.signature && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signature}</p>}
      <Field label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
        {errors.signatureDate && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signatureDate}</p>}
      </Field>
      <Field label="Place" required>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
        {errors.signaturePlace && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signaturePlace}</p>}
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted1} onChange={() => updateForm("declarationAccepted1", !formData.declarationAccepted1)} />
          <span>I confirm that I am a licensed real estate agent or an authorized representative of my agency.</span>
        </label>
        {errors.declarationAccepted1 && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccepted1}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted2} onChange={() => updateForm("declarationAccepted2", !formData.declarationAccepted2)} />
          <span>I certify that all information and documents submitted are true and accurate.</span>
        </label>
        {errors.declarationAccepted2 && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccepted2}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted3} onChange={() => updateForm("declarationAccepted3", !formData.declarationAccepted3)} />
          <span>I agree to the Terms & Conditions and Privacy Policy of the platform.</span>
        </label>
        {errors.declarationAccepted3 && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccepted3}</p>}
      </div>
    </>
  );

  return null;
}

// DESKTOP CONTENT - Lease Agent Apartment
function DtContentLeaseAgentApart({ 
  step, inp, formData, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, removeDocument,
  toggleAmenity, toggleApartmentAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  tenantTypeOptions, leaseDurationOptions, contactTimeOptions,
  apartmentLeaseAmenities, toggleArrayItem,
  bankOptions,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  errors,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  bedroomOptions, bathroomOptions, genderOptions, propertyTypeOptions,
  interiorFeaturesList, appliancesList, nearbyPlacesList,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphanumericFieldChange,
  isOnlyLettersAndSpaces, isOnlyDigits, isValidIFSC, isValidEmail, isValidPincode,
  serviceAreaOptions, SearchableMultiSelectDt
}) {
  const ta = `${inp} resize-y`;
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      allSignaturePoints.forEach(stroke => {
        if (stroke.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#00695C';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          stroke.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
      });
      
      if (signaturePoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#00695C';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        signaturePoints.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  }, [signaturePoints, allSignaturePoints]);

  // STEP 0: Personal Details
  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Personal Information</h3>
      </div>
      <FieldDt label="Full Name" required>
        <input className={inp} placeholder="Enter your full name" value={formData.fullName} onChange={(e) => updateForm("fullName", handleAlphaFieldChange(e.target.value))} />
        {errors.fullName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.fullName}</p>}
      </FieldDt>
      <FieldDt label="Mobile Number" required>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", handleNumericFieldChange(e.target.value).slice(0, 10))} />
        {errors.mobileNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.mobileNumber}</p>}
      </FieldDt>
      <FieldDt label="Email Address" required>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
        {errors.emailId && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.emailId}</p>}
      </FieldDt>
      <FieldDt label="Gender" required>
        <div className="flex gap-5">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.gender}</p>}
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-profile-photo" onChange={handleProfilePhotoUpload} />
          <label htmlFor="dt-profile-photo" className="cursor-pointer flex flex-col items-center">
            <User className="mb-1 w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C]">Upload Profile Photo</span>
            <span className="text-[11px] text-gray-400">JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {profilePhotoPreview && (
          <div className="mt-2 relative">
            <img src={profilePhotoPreview} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeProfilePhoto} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
    </>
  );

  // STEP 1: Business Information (UPDATED with SearchableMultiSelectDt)
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Agency Information</h3>
      </div>
      <FieldDt label="Agency Name" required>
        <input className={inp} placeholder="Enter your agency name" value={formData.agencyName} onChange={(e) => updateForm("agencyName", e.target.value)} />
        {errors.agencyName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.agencyName}</p>}
      </FieldDt>
      <FieldDt label="RERA Registration Number" hint="If applicable">
        <input className={inp} placeholder="Enter RERA registration number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="GST Number" hint="Optional">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Years of Experience" required>
        <input className={inp} type="number" min="0" placeholder="Enter years of experience" value={formData.yearsExperience} onChange={(e) => updateForm("yearsExperience", handleNumericFieldChange(e.target.value))} />
        {errors.yearsExperience && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.yearsExperience}</p>}
      </FieldDt>
      <FieldDt label="Number of Active Listings">
        <input className={inp} type="number" min="0" placeholder="Enter number of active listings" value={formData.activeListings} onChange={(e) => updateForm("activeListings", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Service Areas" required>
        <SearchableMultiSelectDt
          options={serviceAreaOptions}
          value={formData.serviceAreas}
          onChange={(value) => updateForm("serviceAreas", value)}
          placeholder="Search and select service areas..."
          error={errors.serviceAreas}
        />
        {errors.serviceAreas && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.serviceAreas}</p>}
      </FieldDt>
      <FieldDt label="Office Address" required>
        <input className={inp} placeholder="Enter your office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
        {errors.officeAddress && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.officeAddress}</p>}
      </FieldDt>
    </>
  );

  // STEP 2: Property Details (Location + Details & Interior combined)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <FieldDt label="City" required>
        <input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e) => updateForm("city", handleAlphaFieldChange(e.target.value))} />
        {errors.city && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.city}</p>}
      </FieldDt>
      <FieldDt label="Area / Locality" required>
        <input className={inp} placeholder="Enter area or locality" value={formData.area} onChange={(e) => updateForm("area", handleAlphanumericFieldChange(e.target.value))} />
        {errors.area && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.area}</p>}
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </FieldDt>
      <FieldDt label="State">
        <input className={inp} placeholder="Enter state name" value={formData.state} onChange={(e) => updateForm("state", handleAlphaFieldChange(e.target.value))} />
        {errors.state && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.state}</p>}
      </FieldDt>
      <FieldDt label="District">
        <input className={inp} placeholder="Enter district name" value={formData.district} onChange={(e) => updateForm("district", handleAlphaFieldChange(e.target.value))} />
        {errors.district && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.district}</p>}
      </FieldDt>
      <FieldDt label="PIN Code" hint="Exactly 6 digits">
        <input className={inp} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", handleNumericFieldChange(e.target.value).slice(0, 6))} />
        {errors.pinCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.pinCode}</p>}
      </FieldDt>
      <FieldDt label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🏠 Property Specifications</h3>
      </div>
      <FieldDt label="Property Type" required>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-property-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === type} onChange={() => updateForm("propertyType", type)} />
              {type}
            </label>
          ))}
        </div>
        {errors.propertyType && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyType}</p>}
      </FieldDt>
      <FieldDt label="Built-up Area" hint="In square feet">
        <input className={inp} type="number" min="0" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", handleNumericFieldChange(e.target.value))} />
        {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
      </FieldDt>
      <FieldDt label="Carpet Area" hint="In square feet">
        <input className={inp} type="number" min="0" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", handleNumericFieldChange(e.target.value))} />
        {errors.carpetArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.carpetArea}</p>}
      </FieldDt>
      <FieldDt label="Number of Bedrooms" required>
        <div className="flex flex-wrap gap-3">
          {bedroomOptions.map(bhk => (
            <label key={bhk} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bhk-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bedrooms === bhk} onChange={() => updateForm("bedrooms", bhk)} />
              {bhk}
            </label>
          ))}
        </div>
        {errors.bedrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bedrooms}</p>}
      </FieldDt>
      <FieldDt label="Number of Bathrooms" required>
        <div className="flex flex-wrap gap-3">
          {bathroomOptions.map(b => (
            <label key={b} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bath-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === b} onChange={() => updateForm("bathrooms", b)} />
              {b}
            </label>
          ))}
        </div>
        {errors.bathrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bathrooms}</p>}
      </FieldDt>
      <FieldDt label="Floor Number">
        <input className={inp} type="number" min="0" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => updateForm("floorNumber", handleNumericFieldChange(e.target.value))} />
        {errors.floorNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.floorNumber}</p>}
      </FieldDt>
      <FieldDt label="Total Floors">
        <input className={inp} type="number" min="0" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => updateForm("totalFloors", handleNumericFieldChange(e.target.value))} />
        {errors.totalFloors && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.totalFloors}</p>}
      </FieldDt>
      <FieldDt label="Facing Direction">
        <div className="grid grid-cols-4 gap-2">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-facing-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Balcony">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-balcony-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Property Age">
        <input className={inp} type="number" min="0" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => updateForm("propertyAge", handleNumericFieldChange(e.target.value))} />
        {errors.propertyAge && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyAge}</p>}
      </FieldDt>
      <FieldDt label="Corner Unit">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-corner-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.cornerUnit === opt} onChange={() => updateForm("cornerUnit", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🪑 Interior Details</h3>
      </div>
      <FieldDt label="Furnishing Status">
        <div className="flex flex-wrap gap-3">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-furnish-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishing === f} onChange={() => updateForm("furnishing", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Interior Features">
        <div className="grid grid-cols-2 gap-2">
          {interiorFeaturesList.map(feature => (
            <label key={feature} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.interiorFeatures || []).includes(feature)} onChange={() => toggleArrayItem("interiorFeatures", feature)} />
              {feature}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Appliances Included">
        <div className="grid grid-cols-2 gap-2">
          {appliancesList.map(appliance => (
            <label key={appliance} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.appliancesIncluded || []).includes(appliance)} onChange={() => toggleArrayItem("appliancesIncluded", appliance)} />
              {appliance}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 3: Pricing & Amenities
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📄 Lease Details</h3>
      </div>
      <FieldDt label="Lease Amount (₹)" required>
        <input className={inp} type="number" min="0" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => updateForm("leaseAmount", handleNumericFieldChange(e.target.value))} />
        {errors.leaseAmount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.leaseAmount}</p>}
      </FieldDt>
      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: handleNumericFieldChange(e.target.value) })} />
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: handleNumericFieldChange(e.target.value) })} />
        </div>
      </FieldDt>
      <FieldDt label="Security / Deposit Amount (₹)">
        <input className={inp} type="number" min="0" placeholder="Enter security/deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", handleNumericFieldChange(e.target.value))} />
        {errors.securityDeposit && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDeposit}</p>}
      </FieldDt>
      <FieldDt label="Lease Duration">
        <div className="flex flex-wrap gap-3">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-duration-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges Included">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-maint-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Lease Negotiable">
        <div className="flex gap-5">
          {["Fixed", "Negotiable"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-negotiable-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseNegotiable === opt} onChange={() => updateForm("leaseNegotiable", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">👥 Tenant Preferences</h3>
      </div>
      <FieldDt label="Tenant Type">
        <div className="flex flex-wrap gap-3">
          {tenantTypeOptions.map(t => (
            <label key={t} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.tenantType || []).includes(t)} onChange={() => toggleArrayItem("tenantType", t)} />
              {t}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Pet Friendly">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-pet-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Dietary Preference">
        <div className="flex gap-5">
          {["Veg Only", "No Restriction"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-diet-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.dietaryPreference === opt} onChange={() => updateForm("dietaryPreference", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Smoking Allowed">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-smoking-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === opt} onChange={() => updateForm("smokingAllowed", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">✨ Amenities</h3>
      </div>
      <FieldDt label="Select Amenities">
        <div className="grid grid-cols-2 gap-2">
          {apartmentLeaseAmenities.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.selectedAmenities.includes(amenity.id)} onChange={() => toggleApartmentAmenity(amenity.id)} />
              {amenity.label}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Other Amenities">
        <div className="flex gap-2">
          <input className={`${inp} flex-1`} placeholder="e.g., Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-3 py-1.5 text-[13px] bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {customAmenitiesList.map(a => (
            <span key={a} className="px-2.5 py-1.5 text-[13px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {a}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
            </span>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📅 Availability</h3>
      </div>
      <FieldDt label="Immediate Occupancy">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-occupancy-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </FieldDt>
      <FieldDt label="Lease Renewal Option">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-renewal-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === opt} onChange={() => updateForm("leaseRenewalOption", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Nearby Access</h3>
      </div>
      <FieldDt label="Nearby Places">
        <div className="grid grid-cols-2 gap-2">
          {nearbyPlacesList.map(place => (
            <label key={place} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.nearbyPlaces || []).includes(place)} onChange={() => toggleArrayItem("nearbyPlaces", place)} />
              {place}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 4: Media Upload
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Media Upload</h3>
      </div>
      <p className="text-[11px] text-center text-gray-400 mb-3">📸 Upload property images and media</p>
      
      <FieldDt label="Upload Cover Image" required hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-cover-apart" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-apart" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]" />
            <span className="text-[13px] font-semibold text-[#00695C]">Upload Cover Image</span>
            <span className="text-[11px] text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {coverPreview && (
          <div className="mt-3 relative">
            <img src={coverPreview} alt="Cover" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
            <button onClick={removeCoverImage} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600">✕</button>
          </div>
        )}
        {errors.coverImage && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.coverImage}</p>}
      </FieldDt>

      <FieldDt label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-apart" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-apart" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]" />
            <span className="text-[13px] font-semibold text-[#00695C]">Upload Property Photos</span>
            <span className="text-[11px] text-gray-400 mt-1">Max 3 photos</span>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            ))}
          </div>
        )}
        {errors.propertyImages && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyImages}</p>}
      </FieldDt>

      <FieldDt label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-apart" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-apart" className="cursor-pointer flex flex-col items-center">
            <Video className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]" />
            <span className="text-[13px] font-semibold text-[#00695C]">Upload Property Video Tour</span>
            <p className="text-[11px] text-gray-400 mt-1">MP4/MOV (Max 10MB)</p>
          </label>
        </div>
        {videoPreview && (
          <div className="mt-3 relative">
            <video src={videoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200" />
            <button onClick={removeVideo} className="absolute top-2 right-2 w-6.5 h-6.5 bg-red-500 text-white rounded-full text-[13px] flex items-center justify-center hover:bg-red-600">✕</button>
          </div>
        )}
      </FieldDt>
    </>
  );

  // STEP 5: Upload Documents
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Upload Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format</p>

      <FieldDt label="Aadhaar Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-doc" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="dt-aadhaar-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCardDoc.name}</p>}
        {errors.aadhaarCardDoc && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.aadhaarCardDoc}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-doc" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
        {errors.panCardDoc && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.panCardDoc}</p>}
      </FieldDt>

      <FieldDt label="Agency Logo" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-logo" onChange={(e) => handleDocumentUpload("agencyLogo", e, 2)} />
          <label htmlFor="dt-logo" className="cursor-pointer flex flex-col items-center">
            <Building className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.agencyLogo && <p className="text-[13px] text-green-600 mt-2">✓ {formData.agencyLogo.name}</p>}
      </FieldDt>

      <FieldDt label="RERA Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-rera-doc" onChange={(e) => handleDocumentUpload("reraCertificateDoc", e)} />
          <label htmlFor="dt-rera-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertificateDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCertificateDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gst-doc" onChange={(e) => handleDocumentUpload("gstCertificateDoc", e)} />
          <label htmlFor="dt-gst-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertificateDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCertificateDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Business Registration Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-business-doc" onChange={(e) => handleDocumentUpload("businessRegistrationDoc", e)} />
          <label htmlFor="dt-business-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.businessRegistrationDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.businessRegistrationDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-apart" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-apart" className="cursor-pointer flex flex-col items-center">
            <Home className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]" />
            <span className="text-[13px] font-semibold text-[#00695C]">Upload Floor Plan</span>
            <span className="text-[11px] text-gray-400 mt-1">PDF only</span>
          </label>
        </div>
        {floorPlanPreview && (
          <div className="mt-2 relative">
            <p className="text-[13px] text-green-600">✓ {formData.floorPlan?.name}</p>
            <button onClick={removeFloorPlan} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600">✕</button>
          </div>
        )}
        {errors.floorPlan && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.floorPlan}</p>}
      </FieldDt>

      <FieldDt label="Lease Agreement" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-leaseAgreement-apart" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="dt-leaseAgreement-apart" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Lease Agreement</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[13px] text-green-600 mt-2">✓ {formData.leaseAgreement.name}</p>}
        {errors.leaseAgreement && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.leaseAgreement}</p>}
      </FieldDt>

      <FieldDt label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-tax-apart" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="dt-tax-apart" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Tax Receipt</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[13px] text-green-600 mt-2">✓ {formData.propertyTaxReceipt.name}</p>}
      </FieldDt>

      <FieldDt label="Sale Deed (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-saleDeed-apart" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="dt-saleDeed-apart" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Sale Deed</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[13px] text-green-600 mt-2">✓ {formData.saleDeed.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 6: Bank Details
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">Enter your bank details for payments</p>
      <FieldDt label="Account Holder Name" required>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
        {errors.accountHolderName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountHolderName}</p>}
      </FieldDt>
      <FieldDt label="Bank Name" required>
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.bankName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bankName}</p>}
      </FieldDt>
      <FieldDt label="Account Number" required hint="9-18 digits">
        <input className={inp} type="tel" inputMode="numeric" maxLength={18} placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", handleNumericFieldChange(e.target.value).slice(0, 18))} />
        {errors.accountNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountNumber}</p>}
      </FieldDt>
      <FieldDt label="IFSC Code" required hint="e.g., SBIN0001234">
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
        {errors.ifscCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ifscCode}</p>}
      </FieldDt>
      <FieldDt label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 7: Social Media
  if (step === 7) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Social Media & Online Presence</h3>
      </div>
      <FieldDt label="Website">
        <input className={inp} placeholder="Enter website URL" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} />
      </FieldDt>
      <FieldDt label="Facebook Page">
        <input className={inp} placeholder="Enter Facebook URL" value={formData.facebook} onChange={(e) => updateForm("facebook", e.target.value)} />
      </FieldDt>
      <FieldDt label="Instagram">
        <input className={inp} placeholder="Enter Instagram URL" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} />
      </FieldDt>
      <FieldDt label="LinkedIn">
        <input className={inp} placeholder="Enter LinkedIn URL" value={formData.linkedin} onChange={(e) => updateForm("linkedin", e.target.value)} />
      </FieldDt>
      <FieldDt label="YouTube Channel">
        <input className={inp} placeholder="Enter YouTube URL" value={formData.youtube} onChange={(e) => updateForm("youtube", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 8: Declaration & Signature
  if (step === 8) return (
    <>

      {/* Signature Section */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-4 h-4" /> Agent Signature <span className="text-red-500">*</span>
      </label>
      <p className="text-[12px] text-gray-500 mb-2">Draw your signature in the box below</p>
      <div className="relative">
        <canvas
          id="dt-signatureCanvas"
          ref={signatureCanvasRef}
          width="400"
          height="100"
          className="signature-canvas w-full h-32 rounded-lg border-2 border-[#00695C] bg-white touch-none cursor-crosshair"
          onMouseDown={(e) => startDrawing(e, 'dt-signatureCanvas')}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => startDrawing(e, 'dt-signatureCanvas')}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button
          type="button"
          onClick={clearSignature}
          className="absolute top-2 right-3 bg-[#00695C] text-white px-3 py-0.5 rounded text-xs hover:bg-[#004d42] transition-colors"
        >
          Clear
        </button>
      </div>
      {errors.signature && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signature}</p>}
      <FieldDt label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
        {errors.signatureDate && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signatureDate}</p>}
      </FieldDt>
      <FieldDt label="Place" required>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
        {errors.signaturePlace && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signaturePlace}</p>}
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted1} onChange={() => updateForm("declarationAccepted1", !formData.declarationAccepted1)} />
          <span>I confirm that I am a licensed real estate agent or an authorized representative of my agency.</span>
        </label>
        {errors.declarationAccepted1 && <p className="text-[10px] text-red-500 font-medium ml-6">{errors.declarationAccepted1}</p>}
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted2} onChange={() => updateForm("declarationAccepted2", !formData.declarationAccepted2)} />
          <span>I certify that all information and documents submitted are true and accurate.</span>
        </label>
        {errors.declarationAccepted2 && <p className="text-[10px] text-red-500 font-medium ml-6">{errors.declarationAccepted2}</p>}
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted3} onChange={() => updateForm("declarationAccepted3", !formData.declarationAccepted3)} />
          <span>I agree to the Terms & Conditions and Privacy Policy of the platform.</span>
        </label>
        {errors.declarationAccepted3 && <p className="text-[10px] text-red-500 font-medium ml-6">{errors.declarationAccepted3}</p>}
      </div>
    </>
  );

  return null;
}