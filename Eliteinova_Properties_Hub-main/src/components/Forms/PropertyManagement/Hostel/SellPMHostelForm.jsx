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
  BriefcaseBusiness, Building2 as BuildingIcon2, Factory, Store, ShieldCheck,
  Search, ChevronDown
} from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

const steps = [
  "Company Details",
  "Authorized Representative",
  "Office Address",
  "Identity & Business Verification",
  "Property Details", 
  "Pricing & Amenities", 
  "Bank Details",
  "Social Media",
  "Documents",
  "Declaration"
];

const subtitles = [
  "Enter property management company information",
  "Authorized representative details",
  "Office address information",
  "Verify business identity",
  "Location, specifications & interior details",
  "Set sale pricing, preferences & amenities",
  "Bank account details",
  "Social media & online presence",
  "Upload company documents",
  "Confirm & submit"
];

// Validation helper functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateMobile = (mobile) => {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
};

const validatePinCode = (pincode) => {
  const re = /^[0-9]{6}$/;
  return re.test(pincode);
};

const validateAadhaar = (aadhaar) => {
  const re = /^[0-9]{12}$/;
  return re.test(aadhaar);
};

const validatePAN = (pan) => {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan);
};

const validateIFSC = (ifsc) => {
  const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return re.test(ifsc);
};

const validateAccountNumber = (acc) => {
  const re = /^[0-9]{9,18}$/;
  return re.test(acc);
};

// Real-time filtering helpers
const handleAlphaFieldChange = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, '');
};

const handleNumericFieldChange = (value) => {
  return value.replace(/\D/g, '');
};

const handleAlphaNumericFieldChange = (value) => {
  return value.replace(/[^a-zA-Z0-9\s]/g, '');
};

const handlePinCodeChange = (value) => {
  return value.replace(/\D/g, '').slice(0, 6);
};

const handleMobileChange = (value) => {
  return value.replace(/\D/g, '').slice(0, 10);
};

const handleAadhaarChange = (value) => {
  return value.replace(/\D/g, '').slice(0, 12);
};

const handlePANChange = (value) => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
};

const handleIFSCChange = (value) => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
};

// Service area options
const serviceAreaOptions = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
  "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
];

const validateField = (value, rules) => {
  if (rules.required && (!value || value.toString().trim() === '')) {
    return { valid: false, message: 'This field is required' };
  }
  if (rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }
  }
  if (rules.mobile && value) {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(value)) {
      return { valid: false, message: 'Please enter a valid 10-digit mobile number' };
    }
  }
  if (rules.min && value && Number(value) < rules.min) {
    return { valid: false, message: `Value must be at least ${rules.min}` };
  }
  if (rules.max && value && Number(value) > rules.max) {
    return { valid: false, message: `Value must be at most ${rules.max}` };
  }
  if (rules.pattern && value) {
    const regex = new RegExp(rules.pattern);
    if (!regex.test(value)) {
      return { valid: false, message: rules.patternMessage || 'Invalid format' };
    }
  }
  return { valid: true, message: '' };
};

// ==================== SEARCHABLE MULTI-SELECT COMPONENTS ====================

// SearchableMultiSelect Component - Mobile Version
const SearchableMultiSelect = ({ 
  options, selected, onChange, placeholder = "Search and select...", className = "", disabled = false
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
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={(e) => removeOption(item, e)} />
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
                <label key={option} className="flex items-center gap-2 px-2 py-1 hover:bg-teal-50 rounded-md cursor-pointer text-[11px]">
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
  options, selected, onChange, placeholder = "Search and select...", className = "", disabled = false
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
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={(e) => removeOption(item, e)} />
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
                <label key={option} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-teal-50 rounded-md cursor-pointer text-[13px]">
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
    {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
    {hint && !error && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const FieldDt = ({ label, required, hint, children, error }) => (
  <div className="mb-2.5">
    <label className="block text-[13px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
    {hint && !error && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const errorBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

const yesNoOptions = ["Yes", "No"];
const furnishingOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const roomTypeOptions = ["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Studio"];
const bathroomOptions = ["Attached", "Common", "Shared"];
const genderOptions = ["Male", "Female", "Other"];
const hostelTypeOptions = ["Boys Hostel", "Girls Hostel", "Co-Living Space", "Working Professional Hostel"];

// Sell-specific options
const propertyAgeOptions = ["New Construction", "1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"];
const constructionStatusOptions = ["Ready to Move", "Under Construction", "New Launch", "Recently Renovated"];
const possessionOptions = ["Immediate", "Within 1 Month", "Within 3 Months", "Within 6 Months", "Within 1 Year"];
const ownershipTypeOptions = ["Freehold", "Leasehold", "Co-operative Society", "Individual Ownership"];

const hostelSellAmenities = [
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

export default function SellPMHostelForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Company Details (Step 0) - Property Management focus
    pmCompanyName: "", pmBusinessRegNumber: "", pmReraNumber: "", pmGstNumber: "", pmYearsOfExperience: "", pmCompanyWebsite: "", pmCompanyLogo: null, pmCompanyDescription: "",
    serviceArea: [],
    
    // Authorized Representative (Step 1)
    authFullName: "", authDesignation: "", authMobile: "", authEmail: "", authWhatsapp: "", authPhoto: null,
    
    // Office Address (Step 2)
    officeAddress: "", officeCity: "", officeDistrict: "", officeState: "", officePinCode: "", officeLandmark: "",
    
    // Identity & Business Verification (Step 3)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, pmBusinessRegCert: null, pmGstCert: null, pmReraCert: null, officeAddressProof: null,
    
    // Property Category & Posted By
    propertyCategory: "hostel", postedBy: "property_management", listingPurpose: "sell",
    // Property Details (Step 4) - Hostel Sell specific
    city: "", area: "", landmark: "", pinCode: "", nearbyConnectivity: "",
    hostelType: "", roomType: [], sharingType: [], totalCapacity: "",
    bathrooms: "", furnishedStatus: "", totalFloors: "", floorNumber: "",
    facingDirection: "", balcony: "",
    builtUpArea: "", carpetArea: "",
    hostelCategory: "", genderType: "",
    modularKitchen: "", wardrobes: "", airConditioning: "",
    utilityArea: "", smartHomeFeatures: "", appliancesIncluded: "",
    
    // Sell-specific fields
    propertyAge: "", constructionStatus: "", possessionTimeline: "",
    ownershipType: "", readyToBuy: "", underConstruction: "",
    immediatePossession: "",
    
    // Pricing & Amenities (Step 5) - Sell focused
    saleAmountMin: "", saleAmountMax: "", budgetRange: { min: "", max: "" }, 
    priceType: "", saleNegotiable: "",
    selectedAmenities: [], otherAmenities: "",
    foodIncluded: "", foodType: "", mealsPerDay: "", kitchenAccess: "",
    nearbySchool: false, nearbyHospital: false, nearbyMetro: false,
    nearbyMall: false, nearbyITPark: false, nearbyAirport: false,
    
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    
    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Documents (Step 8)
    pmCompanyLogoDoc: null, pmCompanyBrochure: null, pmBusinessRegCertDoc: null, pmReraCertDoc: null, pmGstCertDoc: null, aadhaarCardDoc: null, panCardDoc: null, officeAddressProofDoc: null,
    hostelLicense: null, fireSafetyCertificate: null, healthCertificate: null,
    encumbranceCertificate: null, buildingApprovalPlan: null, 
    completionCertificate: null, occupancyCertificate: null,
    propertyImages: [], propertyVideo: null, coverImage: null, floorPlan: null,
    
    // Declaration (Step 9)
    declaration1: false,
    declaration2: false,
    declaration3: false,
    declaration4: false,
    signature: null, signatureDate: "", signaturePlace: ""
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [authPhotoPreview, setAuthPhotoPreview] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  const [allSignaturePoints, setAllSignaturePoints] = useState([]);
  const [activeCanvas, setActiveCanvas] = useState(null);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    let isValid = true;

    switch(stepIndex) {
      case 0: // Company Details
        const nameValidation = validateField(formData.pmCompanyName, { required: true });
        if (!nameValidation.valid) { newErrors.pmCompanyName = nameValidation.message; isValid = false; }
        
        const regValidation = validateField(formData.pmBusinessRegNumber, { required: true });
        if (!regValidation.valid) { newErrors.pmBusinessRegNumber = regValidation.message; isValid = false; }
        
        const expValidation = validateField(formData.pmYearsOfExperience, { required: true, min: 0 });
        if (!expValidation.valid) { newErrors.pmYearsOfExperience = expValidation.message; isValid = false; }
        
        if (!formData.pmCompanyLogo) {
          newErrors.pmCompanyLogo = "Company logo is required";
          isValid = false;
        }
        
        const descValidation = validateField(formData.pmCompanyDescription, { required: true });
        if (!descValidation.valid) { newErrors.pmCompanyDescription = descValidation.message; isValid = false; }
        
        if (!formData.serviceArea || formData.serviceArea.length === 0) {
          newErrors.serviceArea = "Please select at least one service area";
          isValid = false;
        }
        break;

      case 1: // Authorized Representative
        const nameValidation1 = validateField(formData.authFullName, { required: true });
        if (!nameValidation1.valid) { newErrors.authFullName = nameValidation1.message; isValid = false; }
        
        const desigValidation = validateField(formData.authDesignation, { required: true });
        if (!desigValidation.valid) { newErrors.authDesignation = desigValidation.message; isValid = false; }
        
        const mobileValidation = validateField(formData.authMobile, { required: true, mobile: true });
        if (!mobileValidation.valid) { newErrors.authMobile = mobileValidation.message; isValid = false; }
        
        const emailValidation = validateField(formData.authEmail, { required: true, email: true });
        if (!emailValidation.valid) { newErrors.authEmail = emailValidation.message; isValid = false; }
        
        if (!formData.authPhoto) {
          newErrors.authPhoto = "Profile photo is required";
          isValid = false;
        }
        break;

      case 2: // Office Address
        const addrValidation = validateField(formData.officeAddress, { required: true });
        if (!addrValidation.valid) { newErrors.officeAddress = addrValidation.message; isValid = false; }
        
        const cityValidation = validateField(formData.officeCity, { required: true });
        if (!cityValidation.valid) { newErrors.officeCity = cityValidation.message; isValid = false; }
        
        const distValidation = validateField(formData.officeDistrict, { required: true });
        if (!distValidation.valid) { newErrors.officeDistrict = distValidation.message; isValid = false; }
        
        const stateValidation = validateField(formData.officeState, { required: true });
        if (!stateValidation.valid) { newErrors.officeState = stateValidation.message; isValid = false; }
        
        const pinValidation = validateField(formData.officePinCode, {
          required: true,
          pattern: '^[0-9]{6}$',
          patternMessage: 'Please enter a valid 6-digit PIN code'
        });
        if (!pinValidation.valid) { newErrors.officePinCode = pinValidation.message; isValid = false; }
        break;

      case 3: // Identity & Business Verification
        const aadhaarValidation = validateField(formData.aadhaarNumber, {
          required: true,
          pattern: '^[0-9]{12}$',
          patternMessage: 'Please enter a valid 12-digit Aadhaar number'
        });
        if (!aadhaarValidation.valid) { newErrors.aadhaarNumber = aadhaarValidation.message; isValid = false; }
        
        const panValidation = validateField(formData.panNumber, {
          required: true,
          pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
          patternMessage: 'Please enter a valid PAN number (e.g., ABCDE1234F)'
        });
        if (!panValidation.valid) { newErrors.panNumber = panValidation.message; isValid = false; }
        
        if (!formData.aadhaarCard) {
          newErrors.aadhaarCard = "Aadhaar card is required";
          isValid = false;
        }
        if (!formData.panCard) {
          newErrors.panCard = "PAN card is required";
          isValid = false;
        }
        if (!formData.pmBusinessRegCert) {
          newErrors.pmBusinessRegCert = "Business registration certificate is required";
          isValid = false;
        }
        if (!formData.officeAddressProof) {
          newErrors.officeAddressProof = "Office address proof is required";
          isValid = false;
        }
        break;

      case 4: // Property Details
        const cityValidation4 = validateField(formData.city, { required: true });
        if (!cityValidation4.valid) { newErrors.city = cityValidation4.message; isValid = false; }
        
        const areaValidation = validateField(formData.area, { required: true });
        if (!areaValidation.valid) { newErrors.area = areaValidation.message; isValid = false; }
        
        const hostelTypeValidation = validateField(formData.hostelType, { required: true });
        if (!hostelTypeValidation.valid) { newErrors.hostelType = hostelTypeValidation.message; isValid = false; }
        
        const categoryValidation = validateField(formData.hostelCategory, { required: true });
        if (!categoryValidation.valid) { newErrors.hostelCategory = categoryValidation.message; isValid = false; }
        
        const genderTypeValidation = validateField(formData.genderType, { required: true });
        if (!genderTypeValidation.valid) { newErrors.genderType = genderTypeValidation.message; isValid = false; }
        
        const capacityValidation = validateField(formData.totalCapacity, { required: true, min: 0 });
        if (!capacityValidation.valid) { newErrors.totalCapacity = capacityValidation.message; isValid = false; }
        
        const roomTypeValidation = validateField(formData.roomType, { required: true });
        if (!roomTypeValidation.valid) { newErrors.roomType = roomTypeValidation.message; isValid = false; }
        
        const sharingValidation = validateField(formData.sharingType, { required: true });
        if (!sharingValidation.valid) { newErrors.sharingType = sharingValidation.message; isValid = false; }
        
        const bathroomValidation = validateField(formData.bathrooms, { required: true });
        if (!bathroomValidation.valid) { newErrors.bathrooms = bathroomValidation.message; isValid = false; }
        
        const propertyAgeValidation = validateField(formData.propertyAge, { required: true });
        if (!propertyAgeValidation.valid) { newErrors.propertyAge = propertyAgeValidation.message; isValid = false; }
        
        const constructionValidation = validateField(formData.constructionStatus, { required: true });
        if (!constructionValidation.valid) { newErrors.constructionStatus = constructionValidation.message; isValid = false; }
        
        const ownershipValidation = validateField(formData.ownershipType, { required: true });
        if (!ownershipValidation.valid) { newErrors.ownershipType = ownershipValidation.message; isValid = false; }
        break;

      case 5: // Pricing & Amenities
        const saleMinValidation = validateField(formData.saleAmountMin, { required: true, min: 0 });
        if (!saleMinValidation.valid) { newErrors.saleAmountMin = saleMinValidation.message; isValid = false; }
        break;

      case 6: // Bank Details
        const holderValidation = validateField(formData.accountHolderName, { required: true });
        if (!holderValidation.valid) { newErrors.accountHolderName = holderValidation.message; isValid = false; }
        
        const bankValidation = validateField(formData.bankName, { required: true });
        if (!bankValidation.valid) { newErrors.bankName = bankValidation.message; isValid = false; }
        
        const accValidation = validateField(formData.accountNumber, {
          required: true,
          pattern: '^[0-9]{9,18}$',
          patternMessage: 'Please enter a valid account number (9-18 digits)'
        });
        if (!accValidation.valid) { newErrors.accountNumber = accValidation.message; isValid = false; }
        
        const ifscValidation = validateField(formData.ifscCode, {
          required: true,
          pattern: '^[A-Z]{4}0[A-Z0-9]{6}$',
          patternMessage: 'Please enter a valid IFSC code'
        });
        if (!ifscValidation.valid) { newErrors.ifscCode = ifscValidation.message; isValid = false; }
        break;

      case 8: // Documents
        if (!formData.pmCompanyLogoDoc) {
          newErrors.pmCompanyLogoDoc = "Company logo is required";
          isValid = false;
        }
        if (!formData.pmBusinessRegCertDoc) {
          newErrors.pmBusinessRegCertDoc = "Business registration certificate is required";
          isValid = false;
        }
        if (!formData.aadhaarCardDoc) {
          newErrors.aadhaarCardDoc = "Aadhaar card is required";
          isValid = false;
        }
        if (!formData.panCardDoc) {
          newErrors.panCardDoc = "PAN card is required";
          isValid = false;
        }
        if (!formData.officeAddressProofDoc) {
          newErrors.officeAddressProofDoc = "Office address proof is required";
          isValid = false;
        }
        if (!formData.hostelLicense) {
          newErrors.hostelLicense = "Hostel license is required";
          isValid = false;
        }
        if (!formData.fireSafetyCertificate) {
          newErrors.fireSafetyCertificate = "Fire safety certificate is required";
          isValid = false;
        }
        if (!formData.encumbranceCertificate) {
          newErrors.encumbranceCertificate = "Encumbrance certificate is required";
          isValid = false;
        }
        if (!formData.buildingApprovalPlan) {
          newErrors.buildingApprovalPlan = "Building approval plan is required";
          isValid = false;
        }
        if (!formData.completionCertificate) {
          newErrors.completionCertificate = "Completion certificate is required";
          isValid = false;
        }
        if (!formData.occupancyCertificate) {
          newErrors.occupancyCertificate = "Occupancy certificate is required";
          isValid = false;
        }
        if (!formData.coverImage) {
          newErrors.coverImage = "Cover image is required";
          isValid = false;
        }
        if (formData.propertyImages.length === 0) {
          newErrors.propertyImages = "At least one property photo is required";
          isValid = false;
        }
        if (!formData.floorPlan) {
          newErrors.floorPlan = "Floor plan is required";
          isValid = false;
        }
        break;

      case 9: // Declaration
        if (!formData.declaration1) {
          newErrors.declaration1 = "You must confirm authorized representation";
          isValid = false;
        }
        if (!formData.declaration2) {
          newErrors.declaration2 = "You must certify accuracy of information";
          isValid = false;
        }
        if (!formData.declaration3) {
          newErrors.declaration3 = "You must confirm authorization from property owners";
          isValid = false;
        }
        if (!formData.declaration4) {
          newErrors.declaration4 = "You must agree to terms & conditions";
          isValid = false;
        }
        if (!formData.signature) {
          newErrors.signature = "Signature is required";
          isValid = false;
        }
        if (!formData.signaturePlace) {
          newErrors.signaturePlace = "Place is required";
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const limitedFiles = files.slice(0, 3 - formData.propertyImages.length);
    const newImages = [...formData.propertyImages, ...limitedFiles];
    updateForm("propertyImages", newImages);
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    if (errors.propertyImages) {
      setErrors(prev => ({ ...prev, propertyImages: null }));
    }
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
      if (errors.coverImage) {
        setErrors(prev => ({ ...prev, coverImage: null }));
      }
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
      if (errors.floorPlan) {
        setErrors(prev => ({ ...prev, floorPlan: null }));
      }
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

  const handleAuthPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert("Profile photo must be a JPG, JPEG, or PNG file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Profile photo must be less than 2MB");
        return;
      }
      updateForm("authPhoto", file);
      if (authPhotoPreview) URL.revokeObjectURL(authPhotoPreview);
      setAuthPhotoPreview(URL.createObjectURL(file));
      if (errors.authPhoto) {
        setErrors(prev => ({ ...prev, authPhoto: null }));
      }
    }
  };

  const removeAuthPhoto = () => {
    if (authPhotoPreview) URL.revokeObjectURL(authPhotoPreview);
    updateForm("authPhoto", null);
    setAuthPhotoPreview(null);
  };

  const handleCompanyLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert("Company logo must be a JPG, JPEG, or PNG file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Company logo must be less than 2MB");
        return;
      }
      updateForm("pmCompanyLogo", file);
      if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
      setCompanyLogoPreview(URL.createObjectURL(file));
      if (errors.pmCompanyLogo) {
        setErrors(prev => ({ ...prev, pmCompanyLogo: null }));
      }
    }
  };

  const removeCompanyLogo = () => {
    if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
    updateForm("pmCompanyLogo", null);
    setCompanyLogoPreview(null);
  };

  const handleDocumentUpload = (docType, e, maxSize = 5) => {
    const file = e.target.files[0];
    if (file) {
      // logo / photo uploads are images (the input says JPG/PNG); everything else is a PDF document
      const isImageUpload = /logo|photo/i.test(docType);
      const validTypes = isImageUpload ? ['image/jpeg', 'image/jpg', 'image/png'] : ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert(isImageUpload ? `${docType} must be a JPG or PNG image` : `${docType} must be a PDF file`);
        return;
      }
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${docType} must be less than ${maxSize}MB`);
        return;
      }
      updateForm(docType, file);
      if (errors[docType]) {
        setErrors(prev => ({ ...prev, [docType]: null }));
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
      if (errors.signature) {
        setErrors(prev => ({ ...prev, signature: null }));
      }
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
            <div className="text-xl mb-0.5 relative z-10">🏢</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Sell Hostel - Property Management</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List hostel for sale as property management</p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1.5 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[50px]">
                <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[8px] mt-0.5 text-center px-0.5 ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 py-2.5 overflow-y-auto flex-1">
            <MobContentSellPMHostel
              step={step}
              inp={inMob}
              errorBorder={errorBorder}
              formData={formData}
              errors={errors}
              updateForm={updateForm}
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
              hostelSellAmenities={hostelSellAmenities}
              toggleArrayItem={toggleArrayItem}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              handleAuthPhotoUpload={handleAuthPhotoUpload}
              authPhotoPreview={authPhotoPreview}
              removeAuthPhoto={removeAuthPhoto}
              handleCompanyLogoUpload={handleCompanyLogoUpload}
              companyLogoPreview={companyLogoPreview}
              removeCompanyLogo={removeCompanyLogo}
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
              propertyAgeOptions={propertyAgeOptions}
              constructionStatusOptions={constructionStatusOptions}
              possessionOptions={possessionOptions}
              ownershipTypeOptions={ownershipTypeOptions}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              handleMobileChange={handleMobileChange}
              handleAadhaarChange={handleAadhaarChange}
              handlePANChange={handlePANChange}
              handleIFSCChange={handleIFSCChange}
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
                  if (step === steps.length - 1) {
                    handleSubmit();
                  } else {
                    if (validateStep(step)) {
                      setStep(step + 1);
                    }
                  }
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Sell Hostel - Property Management</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List hostel for sale as property management</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[54px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[8px] mt-0.5 text-center px-0.5 ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContentSellPMHostel
              step={step}
              inp={inDt}
              errorBorder={errorBorder}
              formData={formData}
              errors={errors}
              updateForm={updateForm}
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
              hostelSellAmenities={hostelSellAmenities}
              toggleArrayItem={toggleArrayItem}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              handleAuthPhotoUpload={handleAuthPhotoUpload}
              authPhotoPreview={authPhotoPreview}
              removeAuthPhoto={removeAuthPhoto}
              handleCompanyLogoUpload={handleCompanyLogoUpload}
              companyLogoPreview={companyLogoPreview}
              removeCompanyLogo={removeCompanyLogo}
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
              propertyAgeOptions={propertyAgeOptions}
              constructionStatusOptions={constructionStatusOptions}
              possessionOptions={possessionOptions}
              ownershipTypeOptions={ownershipTypeOptions}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              handleMobileChange={handleMobileChange}
              handleAadhaarChange={handleAadhaarChange}
              handlePANChange={handlePANChange}
              handleIFSCChange={handleIFSCChange}
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
                  if (step === steps.length - 1) {
                    handleSubmit();
                  } else {
                    if (validateStep(step)) {
                      setStep(step + 1);
                    }
                  }
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

// ==================== MOBILE CONTENT - Sell PM Hostel ====================
function MobContentSellPMHostel({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, toggleAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  hostelSellAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  roomTypeOptions, bathroomOptions, genderOptions, hostelTypeOptions,
  propertyAgeOptions, constructionStatusOptions, possessionOptions, ownershipTypeOptions,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange,
  handlePinCodeChange, handleMobileChange, handleAadhaarChange,
  handlePANChange, handleIFSCChange,
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

  const getErrorClass = (field) => {
    return errors[field] ? errorBorder : "";
  };

  // STEP 0: Company Details (Property Management)
  if (step === 0) return (
    <>
      <Field label="Property Management Company Name" required error={errors.pmCompanyName}>
        <input className={`${inp} ${getErrorClass('pmCompanyName')}`} placeholder="Enter company name" value={formData.pmCompanyName} onChange={(e) => updateForm("pmCompanyName", handleAlphaNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Business Registration Number" required error={errors.pmBusinessRegNumber}>
        <input className={`${inp} ${getErrorClass('pmBusinessRegNumber')}`} placeholder="Enter registration number" value={formData.pmBusinessRegNumber} onChange={(e) => updateForm("pmBusinessRegNumber", handleAlphaNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="RERA Registration Number (If Applicable)">
        <input className={inp} placeholder="Enter RERA number" value={formData.pmReraNumber} onChange={(e) => updateForm("pmReraNumber", handleAlphaNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="GST Number (Optional)">
        <input className={inp} placeholder="Enter GST number" value={formData.pmGstNumber} onChange={(e) => updateForm("pmGstNumber", handleAlphaNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Years of Experience" required error={errors.pmYearsOfExperience}>
        <input className={`${inp} ${getErrorClass('pmYearsOfExperience')}`} type="text" placeholder="Enter years of experience" value={formData.pmYearsOfExperience} onChange={(e) => updateForm("pmYearsOfExperience", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Service Areas" required error={errors.serviceArea} hint="Select all areas where you provide services">
        <SearchableMultiSelect
          options={serviceAreaOptions}
          selected={formData.serviceArea || []}
          onChange={(value) => updateForm("serviceArea", value)}
          placeholder="Search and select service areas..."
        />
      </Field>
      <Field label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.pmCompanyWebsite} onChange={(e) => updateForm("pmCompanyWebsite", e.target.value)} />
      </Field>
      <Field label="Company Logo" required error={errors.pmCompanyLogo}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogo ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-pm-logo-sell" onChange={handleCompanyLogoUpload} />
          <label htmlFor="m-pm-logo-sell" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {companyLogoPreview && (
          <div className="mt-1 relative">
            <img src={companyLogoPreview} alt="Company Logo" className="w-16 h-16 object-cover rounded-lg border-2 border-[#00695C] mx-auto" />
            <button onClick={removeCompanyLogo} className="absolute -top-1 right-[calc(50%-2rem)] w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
      <Field label="Company Description" required error={errors.pmCompanyDescription}>
        <textarea className={`${ta} ${getErrorClass('pmCompanyDescription')} min-h-[60px]`} placeholder="Describe your property management company" value={formData.pmCompanyDescription} onChange={(e) => updateForm("pmCompanyDescription", e.target.value)} />
      </Field>
    </>
  );

  // STEP 1: Authorized Representative
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Authorized Representative</h3>
      </div>
      <Field label="Full Name" required error={errors.authFullName}>
        <input className={`${inp} ${getErrorClass('authFullName')}`} placeholder="Enter authorized representative's full name" value={formData.authFullName} onChange={(e) => updateForm("authFullName", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Designation" required error={errors.authDesignation}>
        <input className={`${inp} ${getErrorClass('authDesignation')}`} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={(e) => updateForm("authDesignation", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Mobile Number" required error={errors.authMobile}>
        <input className={`${inp} ${getErrorClass('authMobile')}`} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={(e) => updateForm("authMobile", handleMobileChange(e.target.value))} />
      </Field>
      <Field label="Email Address" required error={errors.authEmail}>
        <input className={`${inp} ${getErrorClass('authEmail')}`} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </Field>
      <Field label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={(e) => updateForm("authWhatsapp", handleMobileChange(e.target.value))} />
      </Field>
      <Field label="Profile Photo" required error={errors.authPhoto}>
        <div className={`border-2 border-dashed ${errors.authPhoto ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-authphoto-sell-pm" onChange={handleAuthPhotoUpload} />
          <label htmlFor="m-authphoto-sell-pm" className="cursor-pointer flex flex-col items-center">
            <User className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {authPhotoPreview && (
          <div className="mt-2 relative">
            <img src={authPhotoPreview} alt="Profile" className="w-20 h-20 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeAuthPhoto} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
    </>
  );

  // STEP 2: Office Address
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Office Address</h3>
      </div>
      <Field label="Office Address" required error={errors.officeAddress}>
        <textarea className={`${ta} ${getErrorClass('officeAddress')} min-h-[55px]`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </Field>
      <Field label="City" required error={errors.officeCity}>
        <input className={`${inp} ${getErrorClass('officeCity')}`} placeholder="Enter city" value={formData.officeCity} onChange={(e) => updateForm("officeCity", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="District" required error={errors.officeDistrict}>
        <input className={`${inp} ${getErrorClass('officeDistrict')}`} placeholder="Enter district" value={formData.officeDistrict} onChange={(e) => updateForm("officeDistrict", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="State" required error={errors.officeState}>
        <input className={`${inp} ${getErrorClass('officeState')}`} placeholder="Enter state" value={formData.officeState} onChange={(e) => updateForm("officeState", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="PIN Code" required error={errors.officePinCode}>
        <input className={`${inp} ${getErrorClass('officePinCode')}`} type="text" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={(e) => updateForm("officePinCode", handlePinCodeChange(e.target.value))} />
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Enter nearby landmark" value={formData.officeLandmark} onChange={(e) => updateForm("officeLandmark", e.target.value)} />
      </Field>
    </>
  );

  // STEP 3: Identity & Business Verification
  if (step === 3) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Identity & Business Verification</h3>
      </div>
      <Field label="Aadhaar Number" required error={errors.aadhaarNumber}>
        <input className={`${inp} ${getErrorClass('aadhaarNumber')}`} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", handleAadhaarChange(e.target.value))} />
      </Field>
      <Field label="PAN Number" required error={errors.panNumber}>
        <input className={`${inp} ${getErrorClass('panNumber')}`} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", handlePANChange(e.target.value))} />
      </Field>

      <Field label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className={`border-2 border-dashed ${errors.aadhaarCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-sell-pm" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-aadhaar-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>

      <Field label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pan-sell-pm" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-pan-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>

      <Field label="Upload Business Registration Certificate" required error={errors.pmBusinessRegCert}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pm-reg-sell-pm" onChange={(e) => handleDocumentUpload("pmBusinessRegCert", e)} />
          <label htmlFor="m-pm-reg-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmBusinessRegCert.name}</p>}
      </Field>

      <Field label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-gst-sell-pm" onChange={(e) => handleDocumentUpload("pmGstCert", e)} />
          <label htmlFor="m-pm-gst-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmGstCert.name}</p>}
      </Field>

      <Field label="Upload RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-rera-sell-pm" onChange={(e) => handleDocumentUpload("pmReraCert", e)} />
          <label htmlFor="m-pm-rera-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmReraCert.name}</p>}
      </Field>

      <Field label="Upload Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-sell-pm" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="m-office-proof-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProof.name}</p>}
      </Field>
    </>
  );

  // STEP 4: Property Details with Sell-specific fields
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <Field label="City" required error={errors.city}>
        <input className={`${inp} ${getErrorClass('city')}`} placeholder="Enter city name" value={formData.city} onChange={(e) => updateForm("city", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Area / Locality" required error={errors.area}>
        <input className={`${inp} ${getErrorClass('area')}`} placeholder="Enter area or locality" value={formData.area} onChange={(e) => updateForm("area", handleAlphaNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </Field>
      <Field label="PIN Code">
        <input className={inp} type="text" placeholder="Enter PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", handlePinCodeChange(e.target.value))} />
      </Field>
      <Field label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🏨 Hostel Specifications</h3>
      </div>
      <Field label="Hostel Type" required error={errors.hostelType}>
        <div className="grid grid-cols-2 gap-1">
          {hostelTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-hostel-type-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelType === type} onChange={() => updateForm("hostelType", type)} />
              {type}
            </label>
          ))}
        </div>
      </Field>
      
      <Field label="Hostel Category" required error={errors.hostelCategory}>
        <div className="grid grid-cols-2 gap-1">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-category-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-3">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-gender-type-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Built-up Area" hint="In square feet">
        <input className={inp} type="text" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Carpet Area" hint="In square feet">
        <input className={inp} type="text" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", handleNumericFieldChange(e.target.value))} />
      </Field>
      
      <Field label="Total Capacity" required error={errors.totalCapacity}>
        <input className={`${inp} ${getErrorClass('totalCapacity')}`} type="text" placeholder="Total number of beds/occupants" value={formData.totalCapacity} onChange={(e) => updateForm("totalCapacity", handleNumericFieldChange(e.target.value))} />
      </Field>

      <Field label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType.includes(rt)} onChange={() => toggleArrayItem("roomType", rt)} />
              {rt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"].map(sh => (
            <label key={sh} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType.includes(sh)} onChange={() => toggleArrayItem("sharingType", sh)} />
              {sh}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Bathroom Type" required error={errors.bathrooms}>
        <div className="flex gap-3">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-bathroom-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === bt} onChange={() => updateForm("bathrooms", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Furnishing Status">
        <div className="grid grid-cols-2 gap-1">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-furnish-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishedStatus === f} onChange={() => updateForm("furnishedStatus", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Total Floors">
        <input className={inp} type="text" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => updateForm("totalFloors", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Floor Number">
        <input className={inp} type="text" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => updateForm("floorNumber", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Facing Direction">
        <div className="grid grid-cols-2 gap-1">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-facing-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Balcony">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-balcony-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      {/* Sell-specific Property Details */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">💰 Sale Details</h3>
      </div>

      <Field label="Property Age" required error={errors.propertyAge}>
        <div className="grid grid-cols-2 gap-1">
          {propertyAgeOptions.map(pa => (
            <label key={pa} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-property-age-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyAge === pa} onChange={() => updateForm("propertyAge", pa)} />
              {pa}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Construction Status" required error={errors.constructionStatus}>
        <div className="grid grid-cols-2 gap-1">
          {constructionStatusOptions.map(cs => (
            <label key={cs} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-construction-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.constructionStatus === cs} onChange={() => updateForm("constructionStatus", cs)} />
              {cs}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Possession Timeline">
        <div className="grid grid-cols-2 gap-1">
          {possessionOptions.map(po => (
            <label key={po} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-possession-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.possessionTimeline === po} onChange={() => updateForm("possessionTimeline", po)} />
              {po}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Ownership Type" required error={errors.ownershipType}>
        <div className="grid grid-cols-2 gap-1">
          {ownershipTypeOptions.map(ot => (
            <label key={ot} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-ownership-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.ownershipType === ot} onChange={() => updateForm("ownershipType", ot)} />
              {ot}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Ready to Buy">
        <div className="flex gap-3">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-ready-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.readyToBuy === opt} onChange={() => updateForm("readyToBuy", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Under Construction">
        <div className="flex gap-3">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-under-construction-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.underConstruction === opt} onChange={() => updateForm("underConstruction", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Immediate Possession">
        <div className="flex gap-3">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-immediate-possession-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediatePossession === opt} onChange={() => updateForm("immediatePossession", opt)} />
              {opt}
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
              <input type="radio" name="mob-food-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === opt} onChange={() => updateForm("foodIncluded", opt)} />
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
                  <input type="radio" name="mob-food-type-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                  {ft}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Meals Provided">
            <div className="flex gap-3">
              {["2 Meals/Day", "3 Meals/Day", "Custom/Optional"].map(m => (
                <label key={m} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input type="radio" name="mob-meals-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
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
              <input type="radio" name="mob-kitchen-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === opt} onChange={() => updateForm("kitchenAccess", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  // STEP 5: Pricing & Amenities (Sell)
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">💰 Pricing & Amenities</h3>
      </div>
      <Field label="Sale Amount (₹)" required error={errors.saleAmountMin}>
        <div className="flex gap-1">
          <input className={`${inp} w-1/2 ${getErrorClass('saleAmountMin')}`} type="text" placeholder="Min ₹" value={formData.saleAmountMin} onChange={(e) => updateForm("saleAmountMin", handleNumericFieldChange(e.target.value))} />
          <input className={`${inp} w-1/2`} type="text" placeholder="Max ₹" value={formData.saleAmountMax} onChange={(e) => updateForm("saleAmountMax", handleNumericFieldChange(e.target.value))} />
        </div>
      </Field>
      <Field label="Budget Range (₹)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={`${inp} w-1/2`} type="text" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: handleNumericFieldChange(e.target.value) })} />
          <input className={`${inp} w-1/2`} type="text" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: handleNumericFieldChange(e.target.value) })} />
        </div>
      </Field>
      <Field label="Price Type">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>
      <Field label="Price Negotiable">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-negotiable-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.saleNegotiable === opt} onChange={() => updateForm("saleNegotiable", opt)} />
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
          {hostelSellAmenities.map(amenity => (
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
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Nearby Access</h3>
      </div>
      <Field label="Nearby Places">
        <div className="grid grid-cols-2 gap-1">
          {["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"].map(place => {
            const key = `nearby${place.replace(/[\/\s]/g, '')}`;
            return (
              <label key={place} className="flex items-center gap-1 text-[9px] cursor-pointer">
                <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData[key] || false} onChange={() => updateForm(key, !formData[key])} />
                {place}
              </label>
            );
          })}
        </div>
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
      <Field label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={`${inp} ${getErrorClass('accountHolderName')}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Bank Name" required error={errors.bankName}>
        <input className={`${inp} ${getErrorClass('bankName')}`} placeholder="Enter bank name" value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
      </Field>
      <Field label="Account Number" required error={errors.accountNumber}>
        <input className={`${inp} ${getErrorClass('accountNumber')}`} type="text" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="IFSC Code" required error={errors.ifscCode}>
        <input className={`${inp} ${getErrorClass('ifscCode')}`} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", handleIFSCChange(e.target.value))} />
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

  // STEP 8: Documents
  if (step === 8) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Upload Documents</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">All documents must be in PDF format (Max 5MB each)</p>

      <Field label="Company Logo" required error={errors.pmCompanyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-pm-logo-doc-sell" onChange={(e) => handleDocumentUpload("pmCompanyLogoDoc", e, 2)} />
          <label htmlFor="m-pm-logo-doc-sell" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.pmCompanyLogoDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmCompanyLogoDoc.name}</p>}
      </Field>

      <Field label="Business Registration Certificate" required error={errors.pmBusinessRegCertDoc}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pm-reg-doc-sell" onChange={(e) => handleDocumentUpload("pmBusinessRegCertDoc", e)} />
          <label htmlFor="m-pm-reg-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmBusinessRegCertDoc.name}</p>}
      </Field>

      <Field label="Aadhaar Card" required error={errors.aadhaarCardDoc}>
        <div className={`border-2 border-dashed ${errors.aadhaarCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-doc-sell" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="m-aadhaar-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCardDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required error={errors.panCardDoc}>
        <div className={`border-2 border-dashed ${errors.panCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pan-doc-sell" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-gst-doc-sell" onChange={(e) => handleDocumentUpload("pmGstCertDoc", e)} />
          <label htmlFor="m-pm-gst-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmGstCertDoc.name}</p>}
      </Field>

      <Field label="RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-rera-doc-sell" onChange={(e) => handleDocumentUpload("pmReraCertDoc", e)} />
          <label htmlFor="m-pm-rera-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmReraCertDoc.name}</p>}
      </Field>

      <Field label="Office Address Proof" required error={errors.officeAddressProofDoc}>
        <div className={`border-2 border-dashed ${errors.officeAddressProofDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-doc-sell" onChange={(e) => handleDocumentUpload("officeAddressProofDoc", e)} />
          <label htmlFor="m-office-proof-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProofDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProofDoc.name}</p>}
      </Field>

      <Field label="Company Profile/Brochure (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-brochure-sell" onChange={(e) => handleDocumentUpload("pmCompanyBrochure", e)} />
          <label htmlFor="m-pm-brochure-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochure</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmCompanyBrochure && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmCompanyBrochure.name}</p>}
      </Field>

      {/* Hostel-specific Documents */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Hostel Documents</h3>
      </div>

      <Field label="Hostel License" required error={errors.hostelLicense}>
        <div className={`border-2 border-dashed ${errors.hostelLicense ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-license-sell-pm" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="m-license-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Hostel License</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[10px] text-green-600 mt-1">✓ {formData.hostelLicense.name}</p>}
      </Field>

      <Field label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className={`border-2 border-dashed ${errors.fireSafetyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-fire-sell-pm" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="m-fire-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Fire Safety</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.fireSafetyCertificate.name}</p>}
      </Field>

      <Field label="Health Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-health-sell-pm" onChange={(e) => handleDocumentUpload("healthCertificate", e)} />
          <label htmlFor="m-health-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Health Certificate</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.healthCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.healthCertificate.name}</p>}
      </Field>

      {/* Sell-specific Documents */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Sale Documents</h3>
      </div>

      <Field label="Encumbrance Certificate" required error={errors.encumbranceCertificate}>
        <div className={`border-2 border-dashed ${errors.encumbranceCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-ec-sell-pm" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="m-ec-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload EC</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.encumbranceCertificate.name}</p>}
      </Field>

      <Field label="Building Approval Plan" required error={errors.buildingApprovalPlan}>
        <div className={`border-2 border-dashed ${errors.buildingApprovalPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-building-sell-pm" onChange={(e) => handleDocumentUpload("buildingApprovalPlan", e)} />
          <label htmlFor="m-building-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Building Approval</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.buildingApprovalPlan && <p className="text-[10px] text-green-600 mt-1">✓ {formData.buildingApprovalPlan.name}</p>}
      </Field>

      <Field label="Completion Certificate" required error={errors.completionCertificate}>
        <div className={`border-2 border-dashed ${errors.completionCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-completion-sell-pm" onChange={(e) => handleDocumentUpload("completionCertificate", e)} />
          <label htmlFor="m-completion-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Completion</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.completionCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.completionCertificate.name}</p>}
      </Field>

      <Field label="Occupancy Certificate" required error={errors.occupancyCertificate}>
        <div className={`border-2 border-dashed ${errors.occupancyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-occupancy-sell-pm" onChange={(e) => handleDocumentUpload("occupancyCertificate", e)} />
          <label htmlFor="m-occupancy-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Occupancy</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.occupancyCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.occupancyCertificate.name}</p>}
      </Field>

      {/* Property Media */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-cover-sell-pm" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-sell-pm" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Cover</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {coverPreview && (
          <div className="mt-1 relative">
            <img src={coverPreview} alt="Cover" className="w-full h-16 object-cover rounded-lg" />
            <button onClick={removeCoverImage} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>

      <Field label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className={`border-2 border-dashed ${errors.propertyImages ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-sell-pm" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-sell-pm" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photos</span>
            <span className="text-[9px] text-gray-400">Max 3 photos</span>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-1 grid grid-cols-3 gap-1">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-14 object-cover rounded-lg" />
                <button onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <Field label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-sell-pm" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-sell-pm" className="cursor-pointer flex flex-col items-center">
            <Video className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Video</span>
            <span className="text-[9px] text-gray-400">MP4/MOV (Max 10MB)</span>
          </label>
        </div>
        {videoPreview && (
          <div className="mt-1 relative">
            <video src={videoPreview} controls className="w-full h-20 object-cover rounded-lg" />
            <button onClick={removeVideo} className="absolute top-0 right-0 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>

      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className={`border-2 border-dashed ${errors.floorPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-sell-pm" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-sell-pm" className="cursor-pointer flex flex-col items-center">
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
    </>
  );

  // STEP 9: Declaration
  if (step === 9) return (
    <>
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Authorized Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[10px] font-semibold text-[#00695C] mb-1">
        <PenTool className="w-3.5 h-3.5" /> Authorized Signatory <span className="text-red-500">*</span>
      </label>
      {errors.signature && <p className="text-[10px] text-red-500 mb-1">{errors.signature}</p>}
      <p className="text-[10px] text-gray-500 mb-1.5">Draw your signature in the box below</p>
      <div className="relative">
        <canvas
          id="m-signatureCanvas"
          ref={signatureCanvasRef}
          width="400"
          height="100"
          className={`signature-canvas w-full h-24 rounded-lg border-2 ${errors.signature ? 'border-red-500' : 'border-[#00695C]'} bg-white touch-none cursor-crosshair`}
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
      <Field label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${errors.signaturePlace ? errorBorder : ''}`} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration1 || false} onChange={() => updateForm("declaration1", !formData.declaration1)} />
          <span>I confirm that I am the authorized representative of this property management company.</span>
        </label>
        {errors.declaration1 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration1}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration2 || false} onChange={() => updateForm("declaration2", !formData.declaration2)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declaration2 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration2}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration3 || false} onChange={() => updateForm("declaration3", !formData.declaration3)} />
          <span>I have the necessary authorization from property owners to list and manage their properties on this platform.</span>
        </label>
        {errors.declaration3 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration3}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration4 || false} onChange={() => updateForm("declaration4", !formData.declaration4)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declaration4 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration4}</p>}
      </div>
    </>
  );

  return null;
}

// ==================== DESKTOP CONTENT - Sell PM Hostel ====================
function DtContentSellPMHostel({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, toggleAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  hostelSellAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  roomTypeOptions, bathroomOptions, genderOptions, hostelTypeOptions,
  propertyAgeOptions, constructionStatusOptions, possessionOptions, ownershipTypeOptions,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange,
  handlePinCodeChange, handleMobileChange, handleAadhaarChange,
  handlePANChange, handleIFSCChange,
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

  const getErrorClass = (field) => {
    return errors[field] ? errorBorder : "";
  };

  // STEP 0: Company Details (Property Management) - Desktop
  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Business Details</h3>
      </div>
      <FieldDt label="Property Management Company Name" required error={errors.pmCompanyName}>
        <input className={`${inp} ${getErrorClass('pmCompanyName')}`} placeholder="Enter company name" value={formData.pmCompanyName} onChange={(e) => updateForm("pmCompanyName", handleAlphaNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Business Registration Number" required error={errors.pmBusinessRegNumber}>
        <input className={`${inp} ${getErrorClass('pmBusinessRegNumber')}`} placeholder="Enter registration number" value={formData.pmBusinessRegNumber} onChange={(e) => updateForm("pmBusinessRegNumber", handleAlphaNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="RERA Registration Number (If Applicable)">
        <input className={inp} placeholder="Enter RERA number" value={formData.pmReraNumber} onChange={(e) => updateForm("pmReraNumber", handleAlphaNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="GST Number (Optional)">
        <input className={inp} placeholder="Enter GST number" value={formData.pmGstNumber} onChange={(e) => updateForm("pmGstNumber", handleAlphaNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Years of Experience" required error={errors.pmYearsOfExperience}>
        <input className={`${inp} ${getErrorClass('pmYearsOfExperience')}`} type="text" placeholder="Enter years of experience" value={formData.pmYearsOfExperience} onChange={(e) => updateForm("pmYearsOfExperience", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Service Areas" required error={errors.serviceArea} hint="Select all areas where you provide services">
        <SearchableMultiSelectDt
          options={serviceAreaOptions}
          selected={formData.serviceArea || []}
          onChange={(value) => updateForm("serviceArea", value)}
          placeholder="Search and select service areas..."
        />
      </FieldDt>
      <FieldDt label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.pmCompanyWebsite} onChange={(e) => updateForm("pmCompanyWebsite", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Logo" required error={errors.pmCompanyLogo}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogo ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-pm-logo-sell" onChange={handleCompanyLogoUpload} />
          <label htmlFor="dt-pm-logo-sell" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {companyLogoPreview && (
          <div className="mt-2 relative w-20 mx-auto">
            <img src={companyLogoPreview} alt="Company Logo" className="w-20 h-20 object-cover rounded-lg border-2 border-[#00695C]" />
            <button onClick={removeCompanyLogo} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
      <FieldDt label="Company Description" required error={errors.pmCompanyDescription}>
        <textarea className={`${ta} ${getErrorClass('pmCompanyDescription')} min-h-[70px]`} placeholder="Describe your property management company" value={formData.pmCompanyDescription} onChange={(e) => updateForm("pmCompanyDescription", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 1: Authorized Representative - Desktop
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Representative</h3>
      </div>
      <FieldDt label="Full Name" required error={errors.authFullName}>
        <input className={`${inp} ${getErrorClass('authFullName')}`} placeholder="Enter authorized representative's full name" value={formData.authFullName} onChange={(e) => updateForm("authFullName", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Designation" required error={errors.authDesignation}>
        <input className={`${inp} ${getErrorClass('authDesignation')}`} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={(e) => updateForm("authDesignation", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.authMobile}>
        <input className={`${inp} ${getErrorClass('authMobile')}`} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={(e) => updateForm("authMobile", handleMobileChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Email Address" required error={errors.authEmail}>
        <input className={`${inp} ${getErrorClass('authEmail')}`} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </FieldDt>
      <FieldDt label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={(e) => updateForm("authWhatsapp", handleMobileChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Profile Photo" required error={errors.authPhoto}>
        <div className={`border-2 border-dashed ${errors.authPhoto ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-authphoto-sell-pm" onChange={handleAuthPhotoUpload} />
          <label htmlFor="dt-authphoto-sell-pm" className="cursor-pointer flex flex-col items-center">
            <User className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Photo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {authPhotoPreview && (
          <div className="mt-2 relative">
            <img src={authPhotoPreview} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeAuthPhoto} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
    </>
  );

  // STEP 2: Office Address - Desktop
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Office Address</h3>
      </div>
      <FieldDt label="Office Address" required error={errors.officeAddress}>
        <textarea className={`${ta} ${getErrorClass('officeAddress')} min-h-[70px]`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </FieldDt>
      <FieldDt label="City" required error={errors.officeCity}>
        <input className={`${inp} ${getErrorClass('officeCity')}`} placeholder="Enter city" value={formData.officeCity} onChange={(e) => updateForm("officeCity", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="District" required error={errors.officeDistrict}>
        <input className={`${inp} ${getErrorClass('officeDistrict')}`} placeholder="Enter district" value={formData.officeDistrict} onChange={(e) => updateForm("officeDistrict", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="State" required error={errors.officeState}>
        <input className={`${inp} ${getErrorClass('officeState')}`} placeholder="Enter state" value={formData.officeState} onChange={(e) => updateForm("officeState", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="PIN Code" required error={errors.officePinCode}>
        <input className={`${inp} ${getErrorClass('officePinCode')}`} type="text" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={(e) => updateForm("officePinCode", handlePinCodeChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Enter nearby landmark" value={formData.officeLandmark} onChange={(e) => updateForm("officeLandmark", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 3: Identity & Business Verification - Desktop
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Identity & Business Verification</h3>
      </div>
      <FieldDt label="Aadhaar Number" required error={errors.aadhaarNumber}>
        <input className={`${inp} ${getErrorClass('aadhaarNumber')}`} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", handleAadhaarChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="PAN Number" required error={errors.panNumber}>
        <input className={`${inp} ${getErrorClass('panNumber')}`} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", handlePANChange(e.target.value))} />
      </FieldDt>

      <FieldDt label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className={`border-2 border-dashed ${errors.aadhaarCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-sell-pm" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-aadhaar-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-sell-pm" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-pan-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Business Registration Certificate" required error={errors.pmBusinessRegCert}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-reg-sell-pm" onChange={(e) => handleDocumentUpload("pmBusinessRegCert", e)} />
          <label htmlFor="dt-pm-reg-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmBusinessRegCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-gst-sell-pm" onChange={(e) => handleDocumentUpload("pmGstCert", e)} />
          <label htmlFor="dt-pm-gst-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmGstCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-rera-sell-pm" onChange={(e) => handleDocumentUpload("pmReraCert", e)} />
          <label htmlFor="dt-pm-rera-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmReraCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-sell-pm" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="dt-office-proof-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProof.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 4: Property Details - Desktop (Sell-specific)
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <FieldDt label="City" required error={errors.city}>
        <input className={`${inp} ${getErrorClass('city')}`} placeholder="Enter city name" value={formData.city} onChange={(e) => updateForm("city", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Area / Locality" required error={errors.area}>
        <input className={`${inp} ${getErrorClass('area')}`} placeholder="Enter area or locality" value={formData.area} onChange={(e) => updateForm("area", handleAlphaNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </FieldDt>
      <FieldDt label="PIN Code">
        <input className={inp} type="text" placeholder="Enter PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", handlePinCodeChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🏨 Hostel Specifications</h3>
      </div>
      <FieldDt label="Hostel Type" required error={errors.hostelType}>
        <div className="grid grid-cols-2 gap-1">
          {hostelTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-hostel-type-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelType === type} onChange={() => updateForm("hostelType", type)} />
              {type}
            </label>
          ))}
        </div>
      </FieldDt>
      
      <FieldDt label="Hostel Category" required error={errors.hostelCategory}>
        <div className="flex gap-4">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-category-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-4">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-type-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Built-up Area" hint="In square feet">
        <input className={inp} type="text" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Carpet Area" hint="In square feet">
        <input className={inp} type="text" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      
      <FieldDt label="Total Capacity" required error={errors.totalCapacity}>
        <input className={`${inp} ${getErrorClass('totalCapacity')}`} type="text" placeholder="Total number of beds/occupants" value={formData.totalCapacity} onChange={(e) => updateForm("totalCapacity", handleNumericFieldChange(e.target.value))} />
      </FieldDt>

      <FieldDt label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType.includes(rt)} onChange={() => toggleArrayItem("roomType", rt)} />
              {rt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"].map(sh => (
            <label key={sh} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType.includes(sh)} onChange={() => toggleArrayItem("sharingType", sh)} />
              {sh}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Bathroom Type" required error={errors.bathrooms}>
        <div className="flex gap-4">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bathroom-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === bt} onChange={() => updateForm("bathrooms", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Furnishing Status">
        <div className="flex flex-wrap gap-3">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-furnish-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishedStatus === f} onChange={() => updateForm("furnishedStatus", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Total Floors">
        <input className={inp} type="text" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => updateForm("totalFloors", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Floor Number">
        <input className={inp} type="text" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => updateForm("floorNumber", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Facing Direction">
        <div className="grid grid-cols-4 gap-2">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-facing-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Balcony">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-balcony-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      {/* Sell-specific Property Details */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">💰 Sale Details</h3>
      </div>

      <FieldDt label="Property Age" required error={errors.propertyAge}>
        <div className="flex flex-wrap gap-3">
          {propertyAgeOptions.map(pa => (
            <label key={pa} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-property-age-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyAge === pa} onChange={() => updateForm("propertyAge", pa)} />
              {pa}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Construction Status" required error={errors.constructionStatus}>
        <div className="flex flex-wrap gap-3">
          {constructionStatusOptions.map(cs => (
            <label key={cs} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-construction-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.constructionStatus === cs} onChange={() => updateForm("constructionStatus", cs)} />
              {cs}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Possession Timeline">
        <div className="flex flex-wrap gap-3">
          {possessionOptions.map(po => (
            <label key={po} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-possession-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.possessionTimeline === po} onChange={() => updateForm("possessionTimeline", po)} />
              {po}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Ownership Type" required error={errors.ownershipType}>
        <div className="flex flex-wrap gap-3">
          {ownershipTypeOptions.map(ot => (
            <label key={ot} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-ownership-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.ownershipType === ot} onChange={() => updateForm("ownershipType", ot)} />
              {ot}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Ready to Buy">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-ready-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.readyToBuy === opt} onChange={() => updateForm("readyToBuy", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Under Construction">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-under-construction-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.underConstruction === opt} onChange={() => updateForm("underConstruction", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Immediate Possession">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-immediate-possession-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediatePossession === opt} onChange={() => updateForm("immediatePossession", opt)} />
              {opt}
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
              <input type="radio" name="dt-food-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === opt} onChange={() => updateForm("foodIncluded", opt)} />
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
                  <input type="radio" name="dt-food-type-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                  {ft}
                </label>
              ))}
            </div>
          </FieldDt>
          <FieldDt label="Meals Provided">
            <div className="flex gap-4">
              {["2 Meals/Day", "3 Meals/Day", "Custom/Optional"].map(m => (
                <label key={m} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="dt-meals-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
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
              <input type="radio" name="dt-kitchen-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === opt} onChange={() => updateForm("kitchenAccess", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 5: Pricing & Amenities - Desktop
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">💰 Pricing & Amenities</h3>
      </div>
      <FieldDt label="Sale Amount (₹)" required error={errors.saleAmountMin}>
        <div className="flex gap-2">
          <input className={`${inp} w-1/2 ${getErrorClass('saleAmountMin')}`} type="text" placeholder="Min ₹" value={formData.saleAmountMin} onChange={(e) => updateForm("saleAmountMin", handleNumericFieldChange(e.target.value))} />
          <input className={`${inp} w-1/2`} type="text" placeholder="Max ₹" value={formData.saleAmountMax} onChange={(e) => updateForm("saleAmountMax", handleNumericFieldChange(e.target.value))} />
        </div>
      </FieldDt>
      <FieldDt label="Budget Range (₹)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={`${inp} w-1/2`} type="text" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: handleNumericFieldChange(e.target.value) })} />
          <input className={`${inp} w-1/2`} type="text" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: handleNumericFieldChange(e.target.value) })} />
        </div>
      </FieldDt>
      <FieldDt label="Price Type">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Price Negotiable">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-negotiable-sell-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.saleNegotiable === opt} onChange={() => updateForm("saleNegotiable", opt)} />
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
          {hostelSellAmenities.map(amenity => (
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
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Nearby Access</h3>
      </div>
      <FieldDt label="Nearby Places">
        <div className="grid grid-cols-2 gap-2">
          {["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"].map(place => {
            const key = `nearby${place.replace(/[\/\s]/g, '')}`;
            return (
              <label key={place} className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData[key] || false} onChange={() => updateForm(key, !formData[key])} />
                {place}
              </label>
            );
          })}
        </div>
      </FieldDt>
    </>
  );

  // STEP 6: Bank Details - Desktop
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <FieldDt label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={`${inp} ${getErrorClass('accountHolderName')}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Bank Name" required error={errors.bankName}>
        <input className={`${inp} ${getErrorClass('bankName')}`} placeholder="Enter bank name" value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Account Number" required error={errors.accountNumber}>
        <input className={`${inp} ${getErrorClass('accountNumber')}`} type="text" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="IFSC Code" required error={errors.ifscCode}>
        <input className={`${inp} ${getErrorClass('ifscCode')}`} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", handleIFSCChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 7: Social Media - Desktop
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

  // STEP 8: Documents - Desktop
  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Upload Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>

      <FieldDt label="Company Logo" required error={errors.pmCompanyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-pm-logo-doc-sell" onChange={(e) => handleDocumentUpload("pmCompanyLogoDoc", e, 2)} />
          <label htmlFor="dt-pm-logo-doc-sell" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.pmCompanyLogoDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmCompanyLogoDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Business Registration Certificate" required error={errors.pmBusinessRegCertDoc}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-reg-doc-sell" onChange={(e) => handleDocumentUpload("pmBusinessRegCertDoc", e)} />
          <label htmlFor="dt-pm-reg-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmBusinessRegCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Aadhaar Card" required error={errors.aadhaarCardDoc}>
        <div className={`border-2 border-dashed ${errors.aadhaarCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-doc-sell" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="dt-aadhaar-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required error={errors.panCardDoc}>
        <div className={`border-2 border-dashed ${errors.panCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-doc-sell" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-gst-doc-sell" onChange={(e) => handleDocumentUpload("pmGstCertDoc", e)} />
          <label htmlFor="dt-pm-gst-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmGstCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-rera-doc-sell" onChange={(e) => handleDocumentUpload("pmReraCertDoc", e)} />
          <label htmlFor="dt-pm-rera-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmReraCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Office Address Proof" required error={errors.officeAddressProofDoc}>
        <div className={`border-2 border-dashed ${errors.officeAddressProofDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-doc-sell" onChange={(e) => handleDocumentUpload("officeAddressProofDoc", e)} />
          <label htmlFor="dt-office-proof-doc-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProofDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProofDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Company Profile/Brochure (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-brochure-sell" onChange={(e) => handleDocumentUpload("pmCompanyBrochure", e)} />
          <label htmlFor="dt-pm-brochure-sell" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Profile/Brochure</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmCompanyBrochure && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmCompanyBrochure.name}</p>}
      </FieldDt>

      {/* Hostel-specific Documents */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Hostel Documents</h3>
      </div>

      <FieldDt label="Hostel License" required error={errors.hostelLicense}>
        <div className={`border-2 border-dashed ${errors.hostelLicense ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-license-sell-pm" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="dt-license-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Hostel License</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[13px] text-green-600 mt-2">✓ {formData.hostelLicense.name}</p>}
      </FieldDt>

      <FieldDt label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className={`border-2 border-dashed ${errors.fireSafetyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-fire-sell-pm" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="dt-fire-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Fire Safety</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.fireSafetyCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Health Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-health-sell-pm" onChange={(e) => handleDocumentUpload("healthCertificate", e)} />
          <label htmlFor="dt-health-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Health Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.healthCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.healthCertificate.name}</p>}
      </FieldDt>

      {/* Sell-specific Documents */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Sale Documents</h3>
      </div>

      <FieldDt label="Encumbrance Certificate" required error={errors.encumbranceCertificate}>
        <div className={`border-2 border-dashed ${errors.encumbranceCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-ec-sell-pm" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="dt-ec-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload EC</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.encumbranceCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Building Approval Plan" required error={errors.buildingApprovalPlan}>
        <div className={`border-2 border-dashed ${errors.buildingApprovalPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-building-sell-pm" onChange={(e) => handleDocumentUpload("buildingApprovalPlan", e)} />
          <label htmlFor="dt-building-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Building Approval</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.buildingApprovalPlan && <p className="text-[13px] text-green-600 mt-2">✓ {formData.buildingApprovalPlan.name}</p>}
      </FieldDt>

      <FieldDt label="Completion Certificate" required error={errors.completionCertificate}>
        <div className={`border-2 border-dashed ${errors.completionCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-completion-sell-pm" onChange={(e) => handleDocumentUpload("completionCertificate", e)} />
          <label htmlFor="dt-completion-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Completion</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.completionCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.completionCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Occupancy Certificate" required error={errors.occupancyCertificate}>
        <div className={`border-2 border-dashed ${errors.occupancyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-occupancy-sell-pm" onChange={(e) => handleDocumentUpload("occupancyCertificate", e)} />
          <label htmlFor="dt-occupancy-sell-pm" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Occupancy</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.occupancyCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.occupancyCertificate.name}</p>}
      </FieldDt>

      {/* Property Media */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-cover-sell-pm" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-sell-pm" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Cover Image</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {coverPreview && (
          <div className="mt-2 relative">
            <img src={coverPreview} alt="Cover" className="w-full h-20 object-cover rounded-lg" />
            <button onClick={removeCoverImage} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className={`border-2 border-dashed ${errors.propertyImages ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-sell-pm" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-sell-pm" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Property Photos</span>
            <span className="text-[11px] text-gray-400">Max 3 photos</span>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-16 object-cover rounded-lg" />
                <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
      </FieldDt>

      <FieldDt label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-sell-pm" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-sell-pm" className="cursor-pointer flex flex-col items-center">
            <Video className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Video Tour</span>
            <span className="text-[11px] text-gray-400">MP4/MOV (Max 10MB)</span>
          </label>
        </div>
        {videoPreview && (
          <div className="mt-2 relative">
            <video src={videoPreview} controls className="w-full h-24 object-cover rounded-lg" />
            <button onClick={removeVideo} className="absolute top-2 right-2 w-6.5 h-6.5 bg-red-500 text-white rounded-full text-[13px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className={`border-2 border-dashed ${errors.floorPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-4 text-center cursor-pointer hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-sell-pm" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-sell-pm" className="cursor-pointer flex flex-col items-center">
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
    </>
  );

  // STEP 9: Declaration - Desktop
  if (step === 9) return (
    <>
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-4 h-4" /> Authorized Signatory <span className="text-red-500">*</span>
      </label>
      {errors.signature && <p className="text-[12px] text-red-500 mb-2">{errors.signature}</p>}
      <p className="text-[12px] text-gray-500 mb-2">Draw your signature in the box below</p>
      <div className="relative">
        <canvas
          id="dt-signatureCanvas"
          ref={signatureCanvasRef}
          width="400"
          height="100"
          className={`signature-canvas w-full h-32 rounded-lg border-2 ${errors.signature ? 'border-red-500' : 'border-[#00695C]'} bg-white touch-none cursor-crosshair`}
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
      <FieldDt label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${errors.signaturePlace ? errorBorder : ''}`} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration1 || false} onChange={() => updateForm("declaration1", !formData.declaration1)} />
          <span>I confirm that I am the authorized representative of this property management company.</span>
        </label>
        {errors.declaration1 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration1}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration2 || false} onChange={() => updateForm("declaration2", !formData.declaration2)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declaration2 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration2}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration3 || false} onChange={() => updateForm("declaration3", !formData.declaration3)} />
          <span>I have the necessary authorization from property owners to list and manage their properties on this platform.</span>
        </label>
        {errors.declaration3 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration3}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration4 || false} onChange={() => updateForm("declaration4", !formData.declaration4)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declaration4 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration4}</p>}
      </div>
    </>
  );

  return null;
}