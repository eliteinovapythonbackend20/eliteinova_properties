import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, 
  Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, 
  Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, 
  Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, Dog, Wind, 
  Droplet, Layers, Layout, Smartphone, Mail, Phone, MessageCircle, Globe, 
  Compass, RefreshCw, User, Calendar as CalendarIcon, UserCheck, File, 
  MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, 
  CheckSquare, PenTool, IndianRupee, DollarSign, BookOpen, Tv,
  Award, Building2, Construction, Hammer, HardHat, Ruler, PaintBucket,
  Search, ChevronDown
} from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

const steps = [
  "Personal Details",
  "Business Information",
  "Property Details", 
  "Pricing & Amenities", 
  "Media Upload", 
  "Upload Documents", 
  "Bank Details",
  "Social Media",
  "Declaration"
];

const subtitles = [
  "Enter your personal information",
  "Tell us about your agency",
  "Location, specifications & interior details",
  "Set lease pricing, preferences & amenities",
  "Upload property photos, video & media",
  "Upload required documents",
  "Enter your bank details",
  "Social media & online presence",
  "Confirm & submit"
];

// Bank options for dropdown
const bankOptions = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Yes Bank",
  "Bank of Baroda",
  "Punjab National Bank",
  "Canara Bank",
  "Union Bank of India",
  "Other"
];

// Service Areas options
const serviceAreaOptions = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
  "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur", 
  "Lucknow", "Nagpur", "Indore", "Bhopal", "Chandigarh", "Other"
];

// SearchableMultiSelect Component - Mobile Version
const SearchableMultiSelect = ({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Search and select...",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div 
        className={`${inMob} cursor-pointer flex items-center justify-between min-h-[38px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 max-h-24 overflow-y-auto py-0.5">
          {selected.length > 0 ? (
            selected.map((item) => (
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
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1">
            {filteredOptions.length === 0 ? (
              <div className="text-center text-gray-400 text-[11px] py-2">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-teal-50 rounded-md cursor-pointer text-[11px]"
                >
                  <input
                    type="checkbox"
                    className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                  {option}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// SearchableMultiSelect Component - Desktop Version
const SearchableMultiSelectDt = ({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Search and select...",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div 
        className={`${inDt} cursor-pointer flex items-center justify-between min-h-[42px] ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 max-h-28 overflow-y-auto py-0.5">
          {selected.length > 0 ? (
            selected.map((item) => (
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
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1.5">
            {filteredOptions.length === 0 ? (
              <div className="text-center text-gray-400 text-[12px] py-3">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-teal-50 rounded-md cursor-pointer text-[13px]"
                >
                  <input
                    type="checkbox"
                    className="accent-[#00695C] w-4 h-4 cursor-pointer"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                  />
                  {option}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, required, hint, children, error }) => (
  <div className="mb-2">
    <label className="block text-[12px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
    {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
  </div>
);

const FieldDt = ({ label, required, hint, children, error }) => (
  <div className="mb-2.5">
    <label className="block text-[13px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
    {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
  </div>
);

const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";

const yesNoOptions = ["Yes", "No"];
const furnishingOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const tenantTypeOptions = ["Students", "Working Professionals"];
const leaseDurationOptions = ["6 Months", "1 Year", "2 Years", "3 Years", "5+ Years"];
const contactTimeOptions = ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Anytime"];
const roomTypeOptions = ["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Studio"];
const bathroomOptions = ["Attached", "Common", "Shared"];
const genderOptions = ["Male", "Female", "Other"];
const hostelTypeOptions = ["Boys Hostel", "Girls Hostel", "Co-Living Space", "Working Professional Hostel"];
const paymentFrequencyOptions = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const leaseRenewalOptions = ["Automatic", "Negotiable", "Fixed Term"];

const hostelLeaseAmenities = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
  { id: "ac", label: "AC", icon: <Wind className="w-4 h-4" /> },
  { id: "hotWater", label: "Hot Water", icon: <Droplet className="w-4 h-4" /> },
  { id: "security24x7", label: "24/7 Security", icon: <Shield className="w-4 h-4" /> },
  { id: "cctv", label: "CCTV Surveillance", icon: <Camera className="w-4 h-4" /> },
  { id: "powerBackup", label: "Power Backup", icon: <Lock className="w-4 h-4" /> },
  { id: "laundry", label: "Laundry Service", icon: <Waves className="w-4 h-4" /> },
  { id: "housekeeping", label: "Housekeeping", icon: <CheckCircle className="w-4 h-4" /> },
  { id: "parking", label: "Parking", icon: <ParkingCircle className="w-4 h-4" /> },
  { id: "gym", label: "Gym", icon: <Dumbbell className="w-4 h-4" /> },
  { id: "studyRoom", label: "Study Room", icon: <BookOpen className="w-4 h-4" /> },
  { id: "commonTV", label: "Common TV Room", icon: <Tv className="w-4 h-4" /> },
  { id: "lift", label: "Lift / Elevator", icon: <ArrowUpDown className="w-4 h-4" /> },
  { id: "diningHall", label: "Dining Hall", icon: <Coffee className="w-4 h-4" /> },
  { id: "kitchenAccess", label: "Kitchen Access", icon: <Home className="w-4 h-4" /> },
  { id: "recreation", label: "Recreation Room", icon: <Users className="w-4 h-4" /> },
  { id: "garden", label: "Garden/Outdoor Area", icon: <Trees className="w-4 h-4" /> },
  { id: "solarPower", label: "Solar Power", icon: <Sun className="w-4 h-4" /> },
  { id: "waterPurifier", label: "Water Purifier", icon: <Droplet className="w-4 h-4" /> },
  { id: "firstAid", label: "First Aid Kit", icon: <CheckCircle className="w-4 h-4" /> },
  { id: "fireExtinguisher", label: "Fire Extinguisher", icon: <Shield className="w-4 h-4" /> },
  { id: "intercom", label: "Intercom", icon: <Phone className="w-4 h-4" /> },
  { id: "biometricAccess", label: "Biometric Access", icon: <Lock className="w-4 h-4" /> }
];

// Validation helper functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isOnlyLettersAndSpaces = (value) => /^[A-Za-z\s]*$/.test(value);
const isOnlyNumbers = (value) => /^\d*$/.test(value);
const isAlphaNumericWithSpaces = (value) => /^[A-Za-z0-9\s]*$/.test(value);
const isValidIFSC = (value) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);
const isValidMobile = (value) => /^\d{10}$/.test(value);

export default function LeaseAgentHostelForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Personal Details (Step 0) - Removed dateOfBirth
    fullName: "", mobileNumber: "", emailId: "", gender: "", profilePhoto: null,

    // Business Information (Step 1)
    agencyName: "", reraNumber: "", gstNumber: "", yearsExperience: "", activeListings: "", 
    serviceAreas: [], officeAddress: "",
    
    // Property Details (Step 2)
    city: "", area: "", landmark: "", pinCode: "", nearbyConnectivity: "",
    hostelType: "", roomType: "", sharingType: "", totalCapacity: "",
    bathrooms: "", furnishedStatus: "", totalFloors: "", floorNumber: "",
    facingDirection: "", balcony: "",
    builtUpArea: "", carpetArea: "",
    hostelCategory: "", genderType: "",
    propertyAge: "", ownershipType: "",
    
    // Pricing & Amenities (Step 3)
    leaseAmount: "",
    securityDeposit: "",
    leaseDuration: "", maintenanceIncluded: "", priceNegotiable: "",
    paymentFrequency: "", leaseRenewalOption: "",
    tenantType: [], petFriendly: "", dietaryPreference: "", smokingAllowed: "",
    selectedAmenities: [], otherAmenities: "",
    immediateOccupancy: "", availableFrom: "",
    foodIncluded: "", foodType: "", mealsPerDay: "", kitchenAccess: "",
    nearbyPlaces: [],
    contactVia: "", preferredContactTime: "",
    
    // Media Upload (Step 4)
    propertyImages: [], propertyVideo: null, coverImage: null,
    
    // Upload Documents (Step 5)
    aadhaarCardDoc: null, panCardDoc: null, agencyLogo: null,
    reraCertificateDoc: null, gstCertificateDoc: null, businessRegistrationDoc: null,
    floorPlan: null, leaseAgreement: null, propertyTaxReceipt: null, saleDeed: null,
    hostelLicense: null, fireSafetyCertificate: null, healthCertificate: null,
    encumbranceCertificate: null,

    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",

    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Declaration & Signature (Step 8) - Fixed with individual checkboxes
    declarationAccepted: false,
    declarationAccurate: false,
    declarationTerms: false,
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

  // Real-time filtering handlers
  const handleAlphaFieldChange = (field, value) => {
    if (isOnlyLettersAndSpaces(value) || value === '') {
      updateForm(field, value);
    }
  };

  const handleNumericFieldChange = (field, value) => {
    if (isOnlyNumbers(value) || value === '') {
      updateForm(field, value);
    }
  };

  const handleAlphaNumericFieldChange = (field, value) => {
    if (isAlphaNumericWithSpaces(value) || value === '') {
      updateForm(field, value);
    }
  };

  const handlePinCodeChange = (field, value) => {
    if (isOnlyNumbers(value) && value.length <= 6) {
      updateForm(field, value);
    }
  };

  const handleMobileChange = (field, value) => {
    if (isOnlyNumbers(value) && value.length <= 10) {
      updateForm(field, value);
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

  const toggleAmenity = (amenityId) => {
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

  const toggleNearbyPlace = (place) => {
    const current = formData.nearbyPlaces || [];
    if (current.includes(place)) {
      updateForm("nearbyPlaces", current.filter(p => p !== place));
    } else {
      updateForm("nearbyPlaces", [...current, place]);
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
      if (!formData.mobileNumber) e.mobileNumber = "Mobile number is required";
      else if (!isValidMobile(formData.mobileNumber)) e.mobileNumber = "Enter a valid 10-digit mobile number";
      if (!formData.emailId || !isValidEmail(formData.emailId)) e.emailId = "Enter a valid email address";
      if (!formData.gender) e.gender = "Please select your gender";
      if (!formData.profilePhoto) e.profilePhoto = "Profile photo is required";
    }
    if (s === 1) {
      if (!formData.agencyName.trim()) e.agencyName = "Agency name is required";
      if (!formData.yearsExperience) e.yearsExperience = "Years of experience is required";
      else if (!isOnlyNumbers(formData.yearsExperience)) e.yearsExperience = "Only numbers allowed";
      if (!formData.serviceAreas || formData.serviceAreas.length === 0) e.serviceAreas = "Please select at least one service area";
      if (!formData.officeAddress.trim()) e.officeAddress = "Office address is required";
    }
    if (s === 2) {
      if (!formData.city.trim()) e.city = "City is required";
      else if (!isOnlyLettersAndSpaces(formData.city)) e.city = "Only letters and spaces allowed";
      if (!formData.area.trim()) e.area = "Area/Locality is required";
      if (formData.pinCode && formData.pinCode.length > 0 && !/^\d{6}$/.test(formData.pinCode)) e.pinCode = "Enter a valid 6-digit PIN code";
      if (!formData.hostelType) e.hostelType = "Hostel type is required";
      if (!formData.hostelCategory) e.hostelCategory = "Hostel category is required";
      if (!formData.genderType) e.genderType = "Gender type is required";
      if (!formData.totalCapacity) e.totalCapacity = "Total capacity is required";
      else if (!isOnlyNumbers(formData.totalCapacity)) e.totalCapacity = "Only numbers allowed";
      if (!formData.roomType) e.roomType = "Room type is required";
      if (!formData.sharingType) e.sharingType = "Sharing type is required";
      if (!formData.bathrooms) e.bathrooms = "Bathroom type is required";
      if (!formData.ownershipType) e.ownershipType = "Ownership type is required";
      if (!formData.builtUpArea) e.builtUpArea = "Built-up area is required";
      else if (!isOnlyNumbers(formData.builtUpArea)) e.builtUpArea = "Only numbers allowed";
      if (formData.carpetArea && !isOnlyNumbers(formData.carpetArea)) e.carpetArea = "Only numbers allowed";
      if (formData.totalFloors && !isOnlyNumbers(formData.totalFloors)) e.totalFloors = "Only numbers allowed";
      if (formData.floorNumber && !isOnlyNumbers(formData.floorNumber)) e.floorNumber = "Only numbers allowed";
      if (formData.propertyAge && !isOnlyNumbers(formData.propertyAge)) e.propertyAge = "Only numbers allowed";
    }
    if (s === 3) {
      if (!formData.leaseAmount) e.leaseAmount = "Lease amount is required";
      else if (!isOnlyNumbers(formData.leaseAmount)) e.leaseAmount = "Only numbers allowed";
      if (formData.securityDeposit && !isOnlyNumbers(formData.securityDeposit)) e.securityDeposit = "Only numbers allowed";
      if (!formData.leaseDuration) e.leaseDuration = "Lease duration is required";
      if (!formData.paymentFrequency) e.paymentFrequency = "Payment frequency is required";
      if (!formData.immediateOccupancy) e.immediateOccupancy = "Please specify occupancy availability";
      if (!formData.preferredContactTime) e.preferredContactTime = "Preferred contact time is required";
    }
    if (s === 4) {
      if (!formData.coverImage) e.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) e.propertyImages = "At least one property photo is required";
    }
    if (s === 5) {
      if (!formData.aadhaarCardDoc) e.aadhaarCardDoc = "Aadhaar card is required";
      if (!formData.panCardDoc) e.panCardDoc = "PAN card is required";
      if (!formData.hostelLicense) e.hostelLicense = "Hostel license is required";
      if (!formData.fireSafetyCertificate) e.fireSafetyCertificate = "Fire safety certificate is required";
      if (!formData.floorPlan) e.floorPlan = "Floor plan is required";
      if (!formData.leaseAgreement) e.leaseAgreement = "Lease agreement is required";
    }
    if (s === 6) {
      if (!formData.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
      else if (!isOnlyLettersAndSpaces(formData.accountHolderName)) e.accountHolderName = "Only letters and spaces allowed";
      if (!formData.bankName) e.bankName = "Bank name is required";
      if (!formData.accountNumber) e.accountNumber = "Account number is required";
      else if (!isOnlyNumbers(formData.accountNumber)) e.accountNumber = "Only numbers allowed";
      else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) e.accountNumber = "Account number must be between 9-18 digits";
      if (!formData.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      else if (!isValidIFSC(formData.ifscCode)) e.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
    }
    if (s === 7) {
      // No required fields in social media step
    }
    if (s === 8) {
      if (!formData.signature) e.signature = "Please draw your signature";
      if (!formData.signatureDate) e.signatureDate = "Date is required";
      if (!formData.signaturePlace.trim()) e.signaturePlace = "Place is required";
      else if (!isOnlyLettersAndSpaces(formData.signaturePlace)) e.signaturePlace = "Only letters and spaces allowed";
      if (!formData.declarationAccepted) e.declarationAccepted = "You must confirm legal agency representation to proceed";
      if (!formData.declarationAccurate) e.declarationAccurate = "You must certify accuracy to proceed";
      if (!formData.declarationTerms) e.declarationTerms = "You must agree to terms to proceed";
    }
    return e;
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      updateForm('signatureDate', new Date().toLocaleDateString());
      console.log("Rent Agent Hostel Form submitted:", formData);
    }
    try{
      const response = await createProperty(formData);
      onClose();
    }
    catch(error){
      console.error("Error While Submitting the Form: ",error);
    }
    finally{
      onClose();
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
            <div className="text-xl mb-0.5 relative z-10">🏨</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Hostel - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List hostel for lease on behalf of client</p>
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
            <MobContentLeaseAgentHostel
              step={step}
              inp={inMob}
              formData={formData}
              updateForm={updateForm}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              handleMobileChange={handleMobileChange}
              errors={errors}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleAmenity={toggleAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              tenantTypeOptions={tenantTypeOptions}
              leaseDurationOptions={leaseDurationOptions}
              contactTimeOptions={contactTimeOptions}
              hostelLeaseAmenities={hostelLeaseAmenities}
              toggleArrayItem={toggleArrayItem}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              profilePhotoPreview={profilePhotoPreview}
              removeProfilePhoto={removeProfilePhoto}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              roomTypeOptions={roomTypeOptions}
              bathroomOptions={bathroomOptions}
              genderOptions={genderOptions}
              hostelTypeOptions={hostelTypeOptions}
              paymentFrequencyOptions={paymentFrequencyOptions}
              leaseRenewalOptions={leaseRenewalOptions}
              toggleNearbyPlace={toggleNearbyPlace}
              serviceAreaOptions={serviceAreaOptions}
              bankOptions={bankOptions}
              ownershipTypeOptions={["Freehold", "Leasehold", "Co-operative Society", "Individual Ownership"]}
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
            <div className="text-xl mb-0.5 relative z-10">🏨</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Hostel - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List hostel for lease on behalf of client</p>
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
            <DtContentLeaseAgentHostel
              step={step}
              inp={inDt}
              formData={formData}
              updateForm={updateForm}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              handleMobileChange={handleMobileChange}
              errors={errors}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleAmenity={toggleAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              tenantTypeOptions={tenantTypeOptions}
              leaseDurationOptions={leaseDurationOptions}
              contactTimeOptions={contactTimeOptions}
              hostelLeaseAmenities={hostelLeaseAmenities}
              toggleArrayItem={toggleArrayItem}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              profilePhotoPreview={profilePhotoPreview}
              removeProfilePhoto={removeProfilePhoto}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              roomTypeOptions={roomTypeOptions}
              bathroomOptions={bathroomOptions}
              genderOptions={genderOptions}
              hostelTypeOptions={hostelTypeOptions}
              paymentFrequencyOptions={paymentFrequencyOptions}
              leaseRenewalOptions={leaseRenewalOptions}
              toggleNearbyPlace={toggleNearbyPlace}
              serviceAreaOptions={serviceAreaOptions}
              bankOptions={bankOptions}
              ownershipTypeOptions={["Freehold", "Leasehold", "Co-operative Society", "Individual Ownership"]}
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

// ==================== MOBILE CONTENT - Lease Agent Hostel ====================
function MobContentLeaseAgentHostel({ 
  step, inp, formData, updateForm, 
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange, handlePinCodeChange, handleMobileChange,
  errors,
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload,
  toggleAmenity, customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  tenantTypeOptions, leaseDurationOptions, contactTimeOptions,
  hostelLeaseAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  roomTypeOptions, bathroomOptions, genderOptions, hostelTypeOptions,
  paymentFrequencyOptions, leaseRenewalOptions,
  toggleNearbyPlace, serviceAreaOptions, bankOptions, ownershipTypeOptions,
  SearchableMultiSelect
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

  // STEP 0: Personal Details (Removed Date of Birth)
  if (step === 0) return (
    <>
      <Field label="Full Name" required error={errors.fullName}>
        <input className={inp} placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleAlphaFieldChange("fullName", e.target.value)} />
      </Field>
      <Field label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.mobileNumber} onChange={(e) => handleMobileChange("mobileNumber", e.target.value)} />
      </Field>
      <Field label="Email Address" required error={errors.emailId}>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
      </Field>
      <Field label="Gender" required error={errors.gender}>
        <div className="flex gap-4">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-gender-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Profile Photo" hint="Max 2MB" required error={errors.profilePhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-profile-photo-lease" onChange={handleProfilePhotoUpload} />
          <label htmlFor="m-profile-photo-lease" className="cursor-pointer flex flex-col items-center">
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

  // STEP 1: Business Information (with SearchableMultiSelect)
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Agency Information</h3>
      </div>
      <Field label="Agency Name" required error={errors.agencyName}>
        <input className={inp} placeholder="Enter your agency name" value={formData.agencyName} onChange={(e) => handleAlphaNumericFieldChange("agencyName", e.target.value)} />
      </Field>
      <Field label="RERA Registration Number" hint="If applicable">
        <input className={inp} placeholder="Enter RERA registration number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </Field>
      <Field label="GST Number" hint="Optional">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </Field>
      <Field label="Years of Experience" required error={errors.yearsExperience}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter years of experience" value={formData.yearsExperience} onChange={(e) => handleNumericFieldChange("yearsExperience", e.target.value)} />
      </Field>
      <Field label="Number of Active Listings">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter number of active listings" value={formData.activeListings} onChange={(e) => handleNumericFieldChange("activeListings", e.target.value)} />
      </Field>
      <Field label="Service Areas" required error={errors.serviceAreas}>
        <SearchableMultiSelect
          options={serviceAreaOptions}
          selected={formData.serviceAreas || []}
          onChange={(value) => updateForm("serviceAreas", value)}
          placeholder="Search and select service areas..."
        />
      </Field>
      <Field label="Office Address" required error={errors.officeAddress}>
        <input className={inp} placeholder="Enter your office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </Field>
    </>
  );

  // STEP 2: Property Details
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <Field label="City" required error={errors.city}>
        <input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e) => handleAlphaFieldChange("city", e.target.value)} />
      </Field>
      <Field label="Area / Locality" required error={errors.area}>
        <input className={inp} placeholder="Enter area or locality" value={formData.area} onChange={(e) => handleAlphaNumericFieldChange("area", e.target.value)} />
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => handleAlphaNumericFieldChange("landmark", e.target.value)} />
      </Field>
      <Field label="PIN Code" hint="Exactly 6 digits" error={errors.pinCode}>
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => handlePinCodeChange("pinCode", e.target.value)} />
      </Field>
      <Field label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => handleAlphaNumericFieldChange("nearbyConnectivity", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🏨 Hostel Specifications</h3>
      </div>
      <Field label="Hostel Type" required error={errors.hostelType}>
        <div className="grid grid-cols-2 gap-1">
          {hostelTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-hostel-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelType === type} onChange={() => updateForm("hostelType", type)} />
              {type}
            </label>
          ))}
        </div>
      </Field>
      
      <Field label="Hostel Category" required error={errors.hostelCategory}>
        <div className="grid grid-cols-2 gap-1">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-category-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-3">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-gender-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Built-up Area (sq.ft)" required hint="In square feet" error={errors.builtUpArea}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
      </Field>
      <Field label="Carpet Area (sq.ft)" hint="In square feet" error={errors.carpetArea}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
      </Field>
      
      <Field label="Total Capacity" required error={errors.totalCapacity}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Total number of beds/occupants" value={formData.totalCapacity} onChange={(e) => handleNumericFieldChange("totalCapacity", e.target.value)} />
      </Field>

      <Field label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-room-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType === rt} onChange={() => updateForm("roomType", rt)} />
              {rt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"].map(sh => (
            <label key={sh} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-sharing-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType === sh} onChange={() => updateForm("sharingType", sh)} />
              {sh}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Bathroom Type" required error={errors.bathrooms}>
        <div className="flex gap-3">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-bathroom-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === bt} onChange={() => updateForm("bathrooms", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Furnishing Status">
        <div className="grid grid-cols-2 gap-1">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-furnish-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishedStatus === f} onChange={() => updateForm("furnishedStatus", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Total Floors" error={errors.totalFloors}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => handleNumericFieldChange("totalFloors", e.target.value)} />
      </Field>
      <Field label="Floor Number" error={errors.floorNumber}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => handleNumericFieldChange("floorNumber", e.target.value)} />
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

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📋 Lease Details</h3>
      </div>

      <Field label="Property Age" error={errors.propertyAge}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => handleNumericFieldChange("propertyAge", e.target.value)} />
      </Field>

      <Field label="Ownership Type" required error={errors.ownershipType}>
        <div className="space-y-0.5">
          {ownershipTypeOptions.map(ot => (
            <label key={ot} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-ownership-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.ownershipType === ot} onChange={() => updateForm("ownershipType", ot)} />
              {ot}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🍽️ Food & Mess</h3>
      </div>
      <Field label="Food Included">
        <div className="flex gap-3">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-food-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === opt} onChange={() => updateForm("foodIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      {formData.foodIncluded === "Yes" && (
        <>
          <Field label="Food Type">
            <div className="flex gap-3">
              {["Veg", "Non-Veg", "Both", "Custom"].map(ft => (
                <label key={ft} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input type="radio" name="mob-food-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                  {ft}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Meals Provided">
            <div className="flex gap-3">
              {["2 Meals/Day", "3 Meals/Day", "Custom/Optional"].map(m => (
                <label key={m} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input type="radio" name="mob-meals-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
                  {m}
                </label>
              ))}
            </div>
          </Field>
        </>
      )}
      <Field label="Kitchen Access">
        <div className="flex gap-3">
          {["Yes", "No", "Limited"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-kitchen-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === opt} onChange={() => updateForm("kitchenAccess", opt)} />
              {opt}
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
      <Field label="Lease Amount (₹/month)" required error={errors.leaseAmount}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => handleNumericFieldChange("leaseAmount", e.target.value)} />
      </Field>
      <Field label="Security / Deposit Amount (₹)" hint="If applicable" error={errors.securityDeposit}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter security/deposit amount" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange("securityDeposit", e.target.value)} />
      </Field>
      <Field label="Lease Duration" required error={errors.leaseDuration}>
        <div className="grid grid-cols-2 gap-1">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-duration-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Payment Frequency" required error={errors.paymentFrequency}>
        <div className="grid grid-cols-2 gap-1">
          {paymentFrequencyOptions.map(pf => (
            <label key={pf} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-payment-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.paymentFrequency === pf} onChange={() => updateForm("paymentFrequency", pf)} />
              {pf}
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
      <Field label="Price Negotiable">
        <div className="flex gap-4">
          {["Fixed", "Negotiable"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-negotiable-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceNegotiable === opt} onChange={() => updateForm("priceNegotiable", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Lease Renewal Option">
        <div className="flex gap-3">
          {leaseRenewalOptions.map(lr => (
            <label key={lr} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-renewal-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === lr} onChange={() => updateForm("leaseRenewalOption", lr)} />
              {lr}
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
          {hostelLeaseAmenities.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.selectedAmenities.includes(amenity.id)} onChange={() => toggleAmenity(amenity.id)} />
              {amenity.icon}
              {amenity.label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Other Amenities">
        <div className="flex gap-1">
          <input className={`${inp} flex-1`} placeholder="e.g., Clubhouse, Security..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
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
      <Field label="Immediate Occupancy" required error={errors.immediateOccupancy}>
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

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Nearby Places</h3>
      </div>
      <Field label="Nearby Places">
        <div className="grid grid-cols-2 gap-1">
          {["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"].map(place => (
            <label key={place} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.nearbyPlaces || []).includes(place)} onChange={() => toggleNearbyPlace(place)} />
              {place}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Preferred Contact Time" required error={errors.preferredContactTime}>
        <div className="grid grid-cols-2 gap-1">
          {contactTimeOptions.map(time => (
            <label key={time} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-contact-time" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === time} onChange={() => updateForm("preferredContactTime", time)} />
              {time}
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
      <p className="text-[10px] text-center text-gray-400 mb-2">📸 Upload hostel images and media</p>
      
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-cover-lease" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-lease" className="cursor-pointer flex flex-col items-center">
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
      </Field>

      <Field label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-lease" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-lease" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
      </Field>

      <Field label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-lease" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-lease" className="cursor-pointer flex flex-col items-center">
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

      <Field label="Aadhaar Card" required error={errors.aadhaarCardDoc}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="m-aadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCardDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required error={errors.panCardDoc}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-lease" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="Hostel License" required error={errors.hostelLicense}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-license-lease" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="m-license-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Hostel License</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[10px] text-green-600 mt-1">✓ {formData.hostelLicense.name}</p>}
      </Field>

      <Field label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-fire-lease" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="m-fire-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Fire Safety</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.fireSafetyCertificate.name}</p>}
      </Field>

      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-lease" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-lease" className="cursor-pointer flex flex-col items-center">
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
      </Field>

      <Field label="Lease Agreement" required error={errors.leaseAgreement}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-leaseAgreement-lease" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="m-leaseAgreement-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Lease Agreement</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[10px] text-green-600 mt-1">✓ {formData.leaseAgreement.name}</p>}
      </Field>

      <Field label="Encumbrance Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-ec-lease" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="m-ec-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload EC</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.encumbranceCertificate.name}</p>}
      </Field>

      <Field label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-tax-lease" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="m-tax-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Tax Receipt</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[10px] text-green-600 mt-1">✓ {formData.propertyTaxReceipt.name}</p>}
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
      <p className="text-[9px] text-gray-400 mb-2">Enter your bank details for lease payments</p>
      <Field label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => handleAlphaFieldChange("accountHolderName", e.target.value)} />
      </Field>
      <Field label="Bank Name" required error={errors.bankName}>
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </Field>
      <Field label="Account Number" required error={errors.accountNumber}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => handleNumericFieldChange("accountNumber", e.target.value)} />
      </Field>
      <Field label="IFSC Code" required error={errors.ifscCode}>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
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

  // STEP 8: Declaration & Signature (Fixed with individual checkboxes)
  if (step === 8) return (
    <>
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
      {errors.signature && <p className="text-[10px] text-red-500 mt-1">{errors.signature}</p>}
      
      <Field label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange("signaturePlace", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I confirm that I am a licensed real estate agent or an authorized representative of my agency.</span>
        </label>
        {errors.declarationAccepted && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccepted}</p>}
        
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents submitted are true and accurate.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccurate}</p>}
        
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy of the platform.</span>
        </label>
        {errors.declarationTerms && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}

// ==================== DESKTOP CONTENT - Lease Agent Hostel ====================
function DtContentLeaseAgentHostel({ 
  step, inp, formData, updateForm, 
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange, handlePinCodeChange, handleMobileChange,
  errors,
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload,
  toggleAmenity, customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  tenantTypeOptions, leaseDurationOptions, contactTimeOptions,
  hostelLeaseAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  roomTypeOptions, bathroomOptions, genderOptions, hostelTypeOptions,
  paymentFrequencyOptions, leaseRenewalOptions,
  toggleNearbyPlace, serviceAreaOptions, bankOptions, ownershipTypeOptions,
  SearchableMultiSelectDt
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

  // STEP 0: Personal Details (Desktop) - Removed Date of Birth
  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Personal Information</h3>
      </div>
      <FieldDt label="Full Name" required error={errors.fullName}>
        <input className={inp} placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleAlphaFieldChange("fullName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.mobileNumber} onChange={(e) => handleMobileChange("mobileNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Email Address" required error={errors.emailId}>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
      </FieldDt>
      <FieldDt label="Gender" required error={errors.gender}>
        <div className="flex gap-5">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB" required error={errors.profilePhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-profile-photo-lease" onChange={handleProfilePhotoUpload} />
          <label htmlFor="dt-profile-photo-lease" className="cursor-pointer flex flex-col items-center">
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

  // STEP 1: Business Information (Desktop) - with SearchableMultiSelectDt
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Agency Information</h3>
      </div>
      <FieldDt label="Agency Name" required error={errors.agencyName}>
        <input className={inp} placeholder="Enter your agency name" value={formData.agencyName} onChange={(e) => handleAlphaNumericFieldChange("agencyName", e.target.value)} />
      </FieldDt>
      <FieldDt label="RERA Registration Number" hint="If applicable">
        <input className={inp} placeholder="Enter RERA registration number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="GST Number" hint="Optional">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Years of Experience" required error={errors.yearsExperience}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter years of experience" value={formData.yearsExperience} onChange={(e) => handleNumericFieldChange("yearsExperience", e.target.value)} />
      </FieldDt>
      <FieldDt label="Number of Active Listings">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter number of active listings" value={formData.activeListings} onChange={(e) => handleNumericFieldChange("activeListings", e.target.value)} />
      </FieldDt>
      <FieldDt label="Service Areas" required error={errors.serviceAreas}>
        <SearchableMultiSelectDt
          options={serviceAreaOptions}
          selected={formData.serviceAreas || []}
          onChange={(value) => updateForm("serviceAreas", value)}
          placeholder="Search and select service areas..."
        />
      </FieldDt>
      <FieldDt label="Office Address" required error={errors.officeAddress}>
        <input className={inp} placeholder="Enter your office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 2: Property Details (Desktop)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <FieldDt label="City" required error={errors.city}>
        <input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e) => handleAlphaFieldChange("city", e.target.value)} />
      </FieldDt>
      <FieldDt label="Area / Locality" required error={errors.area}>
        <input className={inp} placeholder="Enter area or locality" value={formData.area} onChange={(e) => handleAlphaNumericFieldChange("area", e.target.value)} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => handleAlphaNumericFieldChange("landmark", e.target.value)} />
      </FieldDt>
      <FieldDt label="PIN Code" hint="Exactly 6 digits" error={errors.pinCode}>
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => handlePinCodeChange("pinCode", e.target.value)} />
      </FieldDt>
      <FieldDt label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => handleAlphaNumericFieldChange("nearbyConnectivity", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🏨 Hostel Specifications</h3>
      </div>
      <FieldDt label="Hostel Type" required error={errors.hostelType}>
        <div className="grid grid-cols-2 gap-1">
          {hostelTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-hostel-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelType === type} onChange={() => updateForm("hostelType", type)} />
              {type}
            </label>
          ))}
        </div>
      </FieldDt>
      
      <FieldDt label="Hostel Category" required error={errors.hostelCategory}>
        <div className="flex flex-wrap gap-4">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-category-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-4">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Built-up Area (sq.ft)" required hint="In square feet" error={errors.builtUpArea}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
      </FieldDt>
      <FieldDt label="Carpet Area (sq.ft)" hint="In square feet" error={errors.carpetArea}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
      </FieldDt>
      
      <FieldDt label="Total Capacity" required error={errors.totalCapacity}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Total number of beds/occupants" value={formData.totalCapacity} onChange={(e) => handleNumericFieldChange("totalCapacity", e.target.value)} />
      </FieldDt>

      <FieldDt label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-room-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType === rt} onChange={() => updateForm("roomType", rt)} />
              {rt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"].map(sh => (
            <label key={sh} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-sharing-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType === sh} onChange={() => updateForm("sharingType", sh)} />
              {sh}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Bathroom Type" required error={errors.bathrooms}>
        <div className="flex gap-4">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bathroom-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === bt} onChange={() => updateForm("bathrooms", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Furnishing Status">
        <div className="flex flex-wrap gap-3">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-furnish-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishedStatus === f} onChange={() => updateForm("furnishedStatus", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Total Floors" error={errors.totalFloors}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => handleNumericFieldChange("totalFloors", e.target.value)} />
      </FieldDt>
      <FieldDt label="Floor Number" error={errors.floorNumber}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => handleNumericFieldChange("floorNumber", e.target.value)} />
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

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📋 Lease Details</h3>
      </div>

      <FieldDt label="Property Age" error={errors.propertyAge}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => handleNumericFieldChange("propertyAge", e.target.value)} />
      </FieldDt>

      <FieldDt label="Ownership Type" required error={errors.ownershipType}>
        <div className="flex flex-wrap gap-3">
          {ownershipTypeOptions.map(ot => (
            <label key={ot} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-ownership-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.ownershipType === ot} onChange={() => updateForm("ownershipType", ot)} />
              {ot}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🍽️ Food & Mess</h3>
      </div>
      <FieldDt label="Food Included">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-food-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === opt} onChange={() => updateForm("foodIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      {formData.foodIncluded === "Yes" && (
        <>
          <FieldDt label="Food Type">
            <div className="flex gap-4">
              {["Veg", "Non-Veg", "Both", "Custom"].map(ft => (
                <label key={ft} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="dt-food-type-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                  {ft}
                </label>
              ))}
            </div>
          </FieldDt>
          <FieldDt label="Meals Provided">
            <div className="flex gap-4">
              {["2 Meals/Day", "3 Meals/Day", "Custom/Optional"].map(m => (
                <label key={m} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="dt-meals-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
                  {m}
                </label>
              ))}
            </div>
          </FieldDt>
        </>
      )}
      <FieldDt label="Kitchen Access">
        <div className="flex gap-4">
          {["Yes", "No", "Limited"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-kitchen-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === opt} onChange={() => updateForm("kitchenAccess", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 3: Pricing & Amenities (Desktop)
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📄 Lease Details</h3>
      </div>
      <FieldDt label="Lease Amount (₹/month)" required error={errors.leaseAmount}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => handleNumericFieldChange("leaseAmount", e.target.value)} />
      </FieldDt>
      <FieldDt label="Security / Deposit Amount (₹)" hint="If applicable" error={errors.securityDeposit}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter security/deposit amount" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange("securityDeposit", e.target.value)} />
      </FieldDt>
      <FieldDt label="Lease Duration" required error={errors.leaseDuration}>
        <div className="flex flex-wrap gap-3">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-duration-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Payment Frequency" required error={errors.paymentFrequency}>
        <div className="flex flex-wrap gap-3">
          {paymentFrequencyOptions.map(pf => (
            <label key={pf} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-payment-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.paymentFrequency === pf} onChange={() => updateForm("paymentFrequency", pf)} />
              {pf}
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
      <FieldDt label="Price Negotiable">
        <div className="flex gap-5">
          {["Fixed", "Negotiable"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-negotiable-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceNegotiable === opt} onChange={() => updateForm("priceNegotiable", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Lease Renewal Option">
        <div className="flex flex-wrap gap-3">
          {leaseRenewalOptions.map(lr => (
            <label key={lr} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-renewal-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === lr} onChange={() => updateForm("leaseRenewalOption", lr)} />
              {lr}
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
          {hostelLeaseAmenities.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.selectedAmenities.includes(amenity.id)} onChange={() => toggleAmenity(amenity.id)} />
              {amenity.label}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Other Amenities">
        <div className="flex gap-2">
          <input className={`${inp} flex-1`} placeholder="e.g., Clubhouse, Security..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
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
      <FieldDt label="Immediate Occupancy" required error={errors.immediateOccupancy}>
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

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Nearby Places</h3>
      </div>
      <FieldDt label="Nearby Places">
        <div className="grid grid-cols-2 gap-2">
          {["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"].map(place => (
            <label key={place} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.nearbyPlaces || []).includes(place)} onChange={() => toggleNearbyPlace(place)} />
              {place}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Preferred Contact Time" required error={errors.preferredContactTime}>
        <div className="grid grid-cols-2 gap-2">
          {contactTimeOptions.map(time => (
            <label key={time} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-contact-time" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === time} onChange={() => updateForm("preferredContactTime", time)} />
              {time}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 4: Media Upload (Desktop)
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Media Upload</h3>
      </div>
      <p className="text-[11px] text-center text-gray-400 mb-3">📸 Upload hostel images and media</p>
      
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-cover-lease" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-lease" className="cursor-pointer flex flex-col items-center">
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
      </FieldDt>

      <FieldDt label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-lease" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-lease" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
      </FieldDt>

      <FieldDt label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-lease" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-lease" className="cursor-pointer flex flex-col items-center">
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

  // STEP 5: Upload Documents (Desktop)
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Upload Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format</p>

      <FieldDt label="Aadhaar Card" required error={errors.aadhaarCardDoc}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="dt-aadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required error={errors.panCardDoc}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-lease" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Hostel License" required error={errors.hostelLicense}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-license-lease" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="dt-license-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Hostel License</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[13px] text-green-600 mt-2">✓ {formData.hostelLicense.name}</p>}
      </FieldDt>

      <FieldDt label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-fire-lease" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="dt-fire-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Fire Safety</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.fireSafetyCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-lease" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-lease" className="cursor-pointer flex flex-col items-center">
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
      </FieldDt>

      <FieldDt label="Lease Agreement" required error={errors.leaseAgreement}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-leaseAgreement-lease" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="dt-leaseAgreement-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Lease Agreement</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[13px] text-green-600 mt-2">✓ {formData.leaseAgreement.name}</p>}
      </FieldDt>

      <FieldDt label="Encumbrance Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-ec-lease" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="dt-ec-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload EC</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.encumbranceCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-tax-lease" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="dt-tax-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Tax Receipt</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[13px] text-green-600 mt-2">✓ {formData.propertyTaxReceipt.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 6: Bank Details (Desktop)
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">Enter your bank details for lease payments</p>
      <FieldDt label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => handleAlphaFieldChange("accountHolderName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Bank Name" required error={errors.bankName}>
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </FieldDt>
      <FieldDt label="Account Number" required error={errors.accountNumber}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => handleNumericFieldChange("accountNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="IFSC Code" required error={errors.ifscCode}>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
      </FieldDt>
      <FieldDt label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 7: Social Media (Desktop)
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

  // STEP 8: Declaration & Signature (Desktop) - Fixed with individual checkboxes
  if (step === 8) return (
    <>
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
      {errors.signature && <p className="text-[12px] text-red-500 mt-1">{errors.signature}</p>}
      
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange("signaturePlace", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I confirm that I am a licensed real estate agent or an authorized representative of my agency.</span>
        </label>
        {errors.declarationAccepted && <p className="text-[12px] text-red-500 ml-6">{errors.declarationAccepted}</p>}
        
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents submitted are true and accurate.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[12px] text-red-500 ml-6">{errors.declarationAccurate}</p>}
        
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy of the platform.</span>
        </label>
        {errors.declarationTerms && <p className="text-[12px] text-red-500 ml-6">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}