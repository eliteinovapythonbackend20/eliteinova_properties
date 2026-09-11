import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, 
  Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, 
  Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, 
  Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, Dog, Wind, 
  Droplet, Layers, Layout, Smartphone, Mail, Phone, MessageCircle, Globe, 
  Compass, RefreshCw, User, Calendar as CalendarIcon, UserCheck, File, 
  MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, 
  CheckSquare, PenTool, Store, Warehouse, Factory, Search, ChevronDown
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
  "Location, specifications & commercial details",
  "Set rental pricing, tenant preferences & amenities",
  "Upload property photos, video & media",
  "Upload required documents",
  "Enter your bank details",
  "Social media & online presence",
  "Confirm & submit"
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

// Service Areas options
const serviceAreasOptions = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
  "Pune", "Ahmedabad", "Kolkata", "Surat", "Jaipur", 
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

const yesNoOptions = ["Yes", "No"];
const furnishingOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const leaseDurationOptions = ["6 Months", "1 Year", "2+ Years"];
const contactTimeOptions = ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Anytime"];
const genderOptions = ["Male", "Female", "Other"];
const commercialTypeOptions = [
  "Retail Shop", "Office Space", "Showroom", "Warehouse", "Commercial Complex", 
  "Shopping Mall", "Restaurant", "Hotel", "Co-working Space", "Educational Institution", 
  "Clinic", "Petrol Bunk"
];
const businessTypeOptions = ["Retail", "Office", "Food & Beverage", "Warehouse", "Service", "Manufacturing"];
const bankNameOptions = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank",
  "Yes Bank", "IndusInd Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank",
  "Union Bank of India", "IDFC First Bank", "Federal Bank", "RBL Bank", "Bandhan Bank"
];

const commercialRentAmenities = [
  { id: "powerBackup", label: "Power Backup", icon: <Lock className="w-4 h-4" /> },
  { id: "security247", label: "24/7 Security", icon: <Shield className="w-4 h-4" /> },
  { id: "cctv", label: "CCTV Surveillance", icon: <Camera className="w-4 h-4" /> },
  { id: "visitorParking", label: "Visitor Parking", icon: <ParkingCircle className="w-4 h-4" /> },
  { id: "wifi", label: "High-Speed Internet", icon: <Wifi className="w-4 h-4" /> },
  { id: "lift", label: "Lift / Elevator", icon: <ArrowUpDown className="w-4 h-4" /> },
  { id: "fireSafety", label: "Fire Safety System", icon: <Shield className="w-4 h-4" /> },
  { id: "ac", label: "Air Conditioning", icon: <Wind className="w-4 h-4" /> },
  { id: "pantry", label: "Pantry / Cafeteria", icon: <Coffee className="w-4 h-4" /> },
  { id: "loadingDock", label: "Loading Dock", icon: <Warehouse className="w-4 h-4" /> },
  { id: "signage", label: "Signage Space", icon: <Layout className="w-4 h-4" /> },
  { id: "conference", label: "Conference Room", icon: <Users className="w-4 h-4" /> }
];

const nearbyPlacesOptions = [
  "Highway Access", "Industrial Zone", "Metro / Bus Stop", 
  "Residential Area", "IT Park / Business Hub", "Airport Access"
];

export default function RentAgentComForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Personal Details (Step 0)
    fullName: "", mobileNumber: "", emailId: "", gender: "", profilePhoto: null,

    // Business Information (Step 1)
    agencyName: "", reraNumber: "", gstNumber: "", yearsExperience: "", activeListings: "", 
    serviceAreas: [], officeAddress: "",
    
    // Property Details (Step 2) - Location + Details & Interior combined
    city: "", area: "", landmark: "", pinCode: "", state: "", district: "", nearbyConnectivity: "",
    commercialType: "", builtUpArea: "", carpetArea: "",
    floorNumber: "", totalFloors: "", facingDirection: "", propertyAge: "",
    frontageWidth: "", ceilingHeight: "", furnishing: "", powerLoad: "",
    parkingCapacity: "", businessType: "", 
    rentalTerm: "",
    
    // Pricing & Amenities (Step 3)
    monthlyRent: "", budgetRange: "", securityDeposit: "",
    leaseDuration: "", maintenanceIncluded: "", rentNegotiable: "",
    selectedAmenities: [], otherAmenities: "",
    immediateOccupancy: "", availableFrom: "", leaseRenewalOption: "",
    nearbyAccess: [],
    
    // Media Upload (Step 4)
    propertyImages: [], propertyVideo: null, coverImage: null,
    
    // Upload Documents (Step 5)
    aadhaarCardDoc: null, panCardDoc: null, agencyLogo: null,
    reraCertificateDoc: null, gstCertificateDoc: null, businessRegistrationDoc: null,
    floorPlan: null, rentalAgreement: null, propertyTaxReceipt: null, saleDeed: null,
    tradeLicense: null, fireSafetyCertificate: null,

    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",

    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Declaration & Signature (Step 8)
    declaration1: false,
    declaration2: false,
    declaration3: false,
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
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      else if (!isOnlyLettersAndSpaces(formData.fullName)) newErrors.fullName = "Only letters and spaces allowed";
      if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
      else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Enter a valid 10-digit number";
      else if (!isOnlyDigits(formData.mobileNumber)) newErrors.mobileNumber = "Mobile number must contain only digits";
      if (!formData.emailId.trim()) newErrors.emailId = "Email is required";
      else if (!isValidEmail(formData.emailId)) newErrors.emailId = "Enter a valid email";
    }
    
    if (stepNum === 1) {
      if (!formData.agencyName.trim()) newErrors.agencyName = "Agency name is required";
      if (!formData.yearsExperience) newErrors.yearsExperience = "Years of experience is required";
      else if (parseInt(formData.yearsExperience) < 0) newErrors.yearsExperience = "Cannot be negative";
      else if (!isOnlyDigits(formData.yearsExperience)) newErrors.yearsExperience = "Only digits allowed";
      if (formData.serviceAreas.length === 0) newErrors.serviceAreas = "At least one service area is required";
      if (!formData.officeAddress.trim()) newErrors.officeAddress = "Office address is required";
    }
    
    if (stepNum === 2) {
      if (!formData.city.trim()) newErrors.city = "City is required";
      else if (!isOnlyLettersAndSpaces(formData.city)) newErrors.city = "Only letters and spaces allowed";
      if (!formData.area.trim()) newErrors.area = "Area is required";
      else if (!isAlphanumericWithSpaces(formData.area)) newErrors.area = "Only letters, numbers and spaces allowed";
      if (formData.pinCode && !isValidPincode(formData.pinCode)) newErrors.pinCode = "Enter a valid 6-digit PIN code";
      if (formData.state && !isOnlyLettersAndSpaces(formData.state)) newErrors.state = "Only letters and spaces allowed";
      if (formData.district && !isOnlyLettersAndSpaces(formData.district)) newErrors.district = "Only letters and spaces allowed";
      if (!formData.commercialType) newErrors.commercialType = "Commercial type is required";
      if (!formData.builtUpArea) newErrors.builtUpArea = "Built-up area is required";
      else if (parseFloat(formData.builtUpArea) < 0) newErrors.builtUpArea = "Cannot be negative";
      else if (!isOnlyDigits(formData.builtUpArea)) newErrors.builtUpArea = "Only digits allowed";
      if (formData.carpetArea && !isOnlyDigits(formData.carpetArea)) newErrors.carpetArea = "Only digits allowed";
      if (formData.floorNumber && !isOnlyDigits(formData.floorNumber)) newErrors.floorNumber = "Only digits allowed";
      if (formData.totalFloors && !isOnlyDigits(formData.totalFloors)) newErrors.totalFloors = "Only digits allowed";
      if (formData.propertyAge && !isOnlyDigits(formData.propertyAge)) newErrors.propertyAge = "Only digits allowed";
      if (formData.frontageWidth && !isOnlyDigits(formData.frontageWidth)) newErrors.frontageWidth = "Only digits allowed";
      if (formData.ceilingHeight && !isOnlyDigits(formData.ceilingHeight)) newErrors.ceilingHeight = "Only digits allowed";
      if (formData.parkingCapacity && !isOnlyDigits(formData.parkingCapacity)) newErrors.parkingCapacity = "Only digits allowed";
      if (!formData.businessType) newErrors.businessType = "Business type is required";
    }
    
    if (stepNum === 3) {
      if (!formData.monthlyRent) newErrors.monthlyRent = "Monthly rent is required";
      else if (parseFloat(formData.monthlyRent) < 0) newErrors.monthlyRent = "Cannot be negative";
      else if (!isOnlyDigits(formData.monthlyRent)) newErrors.monthlyRent = "Only digits allowed";
      if (formData.securityDeposit && !isOnlyDigits(formData.securityDeposit)) newErrors.securityDeposit = "Only digits allowed";
      if (!formData.leaseDuration) newErrors.leaseDuration = "Lease duration is required";
    }
    
    if (stepNum === 4) {
      if (!formData.coverImage) newErrors.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) newErrors.propertyImages = "At least one property photo is required";
    }
    
    if (stepNum === 5) {
      if (!formData.aadhaarCardDoc) newErrors.aadhaarCardDoc = "Aadhaar card is required";
      if (!formData.panCardDoc) newErrors.panCardDoc = "PAN card is required";
      if (!formData.floorPlan) newErrors.floorPlan = "Floor plan is required";
      if (!formData.rentalAgreement) newErrors.rentalAgreement = "Rental agreement is required";
      if (!formData.tradeLicense) newErrors.tradeLicense = "Trade license is required";
      if (!formData.fireSafetyCertificate) newErrors.fireSafetyCertificate = "Fire safety certificate is required";
    }
    
    if (stepNum === 6) {
      if (!formData.accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required";
      else if (!isOnlyLettersAndSpaces(formData.accountHolderName)) newErrors.accountHolderName = "Only letters and spaces allowed";
      if (!formData.bankName) newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber.trim()) newErrors.accountNumber = "Account number is required";
      else if (!formData.accountNumber.match(/^[0-9]{9,18}$/)) newErrors.accountNumber = "Account number must be between 9-18 digits";
      if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";
      else if (!isValidIFSC(formData.ifscCode)) newErrors.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
    }
    
    if (stepNum === 7) {
      // No required fields in social media step
    }
    
    if (stepNum === 8) {
      if (!formData.signature) newErrors.signature = "Signature is required";
      if (!formData.signatureDate) newErrors.signatureDate = "Date is required";
      if (!formData.signaturePlace.trim()) newErrors.signaturePlace = "Place is required";
      else if (!isOnlyLettersAndSpaces(formData.signaturePlace)) newErrors.signaturePlace = "Only letters and spaces allowed";
      if (!formData.declaration1) newErrors.declaration1 = "You must accept this declaration";
      if (!formData.declaration2) newErrors.declaration2 = "You must accept this declaration";
      if (!formData.declaration3) newErrors.declaration3 = "You must accept this declaration";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
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
        setErrors(prev => ({ ...prev, [docType]: "" }));
      }
    }
  };

  const toggleAmenity = (amenity) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenity)) {
      updateForm("selectedAmenities", current.filter(a => a !== amenity));
    } else {
      updateForm("selectedAmenities", [...current, amenity]);
    }
  };

  const toggleCommercialAmenity = (amenityId) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenityId)) {
      updateForm("selectedAmenities", current.filter(id => id !== amenityId));
    } else {
      updateForm("selectedAmenities", [...current, amenityId]);
    }
  };

  const toggleNearbyPlace = (place) => {
    const current = formData.nearbyAccess || [];
    if (current.includes(place)) {
      updateForm("nearbyAccess", current.filter(p => p !== place));
    } else {
      updateForm("nearbyAccess", [...current, place]);
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
      const dataUrl = canvas.toDataURL('image/png');
      updateForm('signature', dataUrl);
      setErrors(prev => ({ ...prev, signature: "" }));
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
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Rent Commercial - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List commercial property for rent</p>
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
            <MobContentRentAgentCom
              step={step}
              inp={inMob}
              formData={formData}
              updateForm={updateForm}
              errors={errors}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleAmenity={toggleAmenity}
              toggleCommercialAmenity={toggleCommercialAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              leaseDurationOptions={leaseDurationOptions}
              contactTimeOptions={contactTimeOptions}
              commercialRentAmenities={commercialRentAmenities}
              toggleNearbyPlace={toggleNearbyPlace}
              nearbyPlacesOptions={nearbyPlacesOptions}
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
              genderOptions={genderOptions}
              commercialTypeOptions={commercialTypeOptions}
              businessTypeOptions={businessTypeOptions}
              bankNameOptions={bankNameOptions}
              serviceAreasOptions={serviceAreasOptions}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphanumericFieldChange={handleAlphanumericFieldChange}
              isOnlyLettersAndSpaces={isOnlyLettersAndSpaces}
              isOnlyDigits={isOnlyDigits}
              isValidIFSC={isValidIFSC}
              isValidEmail={isValidEmail}
              isValidPincode={isValidPincode}
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
                onClick={() => step === steps.length - 1 ? handleSubmit() : handleNextStep()}
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Rent Commercial - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List commercial property for rent</p>
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
            <DtContentRentAgentCom
              step={step}
              inp={inDt}
              formData={formData}
              updateForm={updateForm}
              errors={errors}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleAmenity={toggleAmenity}
              toggleCommercialAmenity={toggleCommercialAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              leaseDurationOptions={leaseDurationOptions}
              contactTimeOptions={contactTimeOptions}
              commercialRentAmenities={commercialRentAmenities}
              toggleNearbyPlace={toggleNearbyPlace}
              nearbyPlacesOptions={nearbyPlacesOptions}
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
              genderOptions={genderOptions}
              commercialTypeOptions={commercialTypeOptions}
              businessTypeOptions={businessTypeOptions}
              bankNameOptions={bankNameOptions}
              serviceAreasOptions={serviceAreasOptions}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphanumericFieldChange={handleAlphanumericFieldChange}
              isOnlyLettersAndSpaces={isOnlyLettersAndSpaces}
              isOnlyDigits={isOnlyDigits}
              isValidIFSC={isValidIFSC}
              isValidEmail={isValidEmail}
              isValidPincode={isValidPincode}
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
                onClick={() => step === steps.length - 1 ? handleSubmit() : handleNextStep()}>
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue <span className="text-sm">→</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// MOBILE CONTENT - Rent Agent Commercial
function MobContentRentAgentCom({ 
  step, inp, formData, updateForm, errors,
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload,
  toggleAmenity, toggleCommercialAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  leaseDurationOptions, contactTimeOptions,
  commercialRentAmenities, toggleNearbyPlace, nearbyPlacesOptions,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  genderOptions, commercialTypeOptions, businessTypeOptions,
  bankNameOptions, serviceAreasOptions,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphanumericFieldChange,
  isOnlyLettersAndSpaces, isOnlyDigits, isValidIFSC, isValidEmail, isValidPincode
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
      <Field label="Full Name" required error={errors.fullName}>
        <input className={inp} placeholder="Enter your full name" value={formData.fullName} onChange={(e) => updateForm("fullName", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inp} type="tel" placeholder="Enter your 10-digit mobile number" value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", handleNumericFieldChange(e.target.value).slice(0, 10))} maxLength={10} />
      </Field>
      <Field label="Email Address" required error={errors.emailId}>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
      </Field>
      <Field label="Gender">
        <div className="flex gap-4">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-gender-agent-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Profile Photo" hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-profile-com" onChange={handleProfilePhotoUpload} />
          <label htmlFor="m-profile-com" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Agency Name" required error={errors.agencyName}>
        <input className={inp} placeholder="Enter your agency name" value={formData.agencyName} onChange={(e) => updateForm("agencyName", e.target.value)} />
      </Field>
      <Field label="RERA Registration Number" hint="If applicable">
        <input className={inp} placeholder="Enter RERA registration number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </Field>
      <Field label="GST Number" hint="Optional">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </Field>
      <Field label="Years of Experience" required error={errors.yearsExperience}>
        <input className={inp} type="number" min="0" placeholder="Enter years of experience" value={formData.yearsExperience} onChange={(e) => updateForm("yearsExperience", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Number of Active Listings">
        <input className={inp} type="number" min="0" placeholder="Enter number of active listings" value={formData.activeListings} onChange={(e) => updateForm("activeListings", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Service Areas" required error={errors.serviceAreas}>
        <SearchableMultiSelect
          options={serviceAreasOptions}
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

  // STEP 2: Property Details (Location + Commercial Details)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <Field label="City" required error={errors.city}>
        <input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e) => updateForm("city", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Area / Locality" required error={errors.area}>
        <input className={inp} placeholder="Enter area or locality" value={formData.area} onChange={(e) => updateForm("area", handleAlphanumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </Field>
      <Field label="State" error={errors.state}>
        <input className={inp} placeholder="Enter state name" value={formData.state} onChange={(e) => updateForm("state", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="District" error={errors.district}>
        <input className={inp} placeholder="Enter district name" value={formData.district} onChange={(e) => updateForm("district", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="PIN Code" hint="Exactly 6 digits" error={errors.pinCode}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", handleNumericFieldChange(e.target.value).slice(0, 6))} />
      </Field>
      <Field label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🏢 Commercial Property Specifications</h3>
      </div>
      <Field label="Commercial Type" required error={errors.commercialType}>
        <div className="grid grid-cols-2 gap-1">
          {commercialTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-com-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.commercialType === type} onChange={() => updateForm("commercialType", type)} />
              {type}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Built-up Area (sq.ft)" required hint="In square feet" error={errors.builtUpArea}>
        <input className={inp} type="number" min="0" placeholder="Enter built-up area" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Carpet Area (sq.ft)" hint="In square feet" error={errors.carpetArea}>
        <input className={inp} type="number" min="0" placeholder="Enter carpet area" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Floor Number" error={errors.floorNumber}>
        <input className={inp} type="number" min="0" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => updateForm("floorNumber", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Total Floors" error={errors.totalFloors}>
        <input className={inp} type="number" min="0" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => updateForm("totalFloors", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Facing Direction">
        <div className="grid grid-cols-2 gap-1">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-facing-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Property Age" error={errors.propertyAge}>
        <input className={inp} type="number" min="0" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => updateForm("propertyAge", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Frontage Width (ft)" error={errors.frontageWidth}>
        <input className={inp} type="number" min="0" placeholder="Enter frontage width" value={formData.frontageWidth} onChange={(e) => updateForm("frontageWidth", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Ceiling Height (ft)" error={errors.ceilingHeight}>
        <input className={inp} type="number" min="0" placeholder="Enter ceiling height" value={formData.ceilingHeight} onChange={(e) => updateForm("ceilingHeight", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Furnishing Status">
        <div className="grid grid-cols-2 gap-1">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-furnish-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishing === f} onChange={() => updateForm("furnishing", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Power Load Capacity (KVA/HP)">
        <input className={inp} placeholder="Enter power load capacity" value={formData.powerLoad} onChange={(e) => updateForm("powerLoad", e.target.value)} />
      </Field>
      <Field label="Parking Capacity" error={errors.parkingCapacity}>
        <input className={inp} type="number" min="0" placeholder="Number of parking slots" value={formData.parkingCapacity} onChange={(e) => updateForm("parkingCapacity", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Business Type Suitable" required error={errors.businessType}>
        <div className="grid grid-cols-2 gap-1">
          {businessTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-biz-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.businessType === type} onChange={() => updateForm("businessType", type)} />
              {type}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Rental Term">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-term-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentalTerm === "Short"} onChange={() => updateForm("rentalTerm", "Short")} />
            Short Term
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-term-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentalTerm === "Long"} onChange={() => updateForm("rentalTerm", "Long")} />
            Long Term
          </label>
        </div>
      </Field>
    </>
  );

  // STEP 3: Pricing & Amenities
  if (step === 3) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📄 Rental Details</h3>
      </div>
      <Field label="Monthly Rent (₹)" required error={errors.monthlyRent}>
        <input className={inp} type="number" min="0" placeholder="Enter monthly rent amount" value={formData.monthlyRent} onChange={(e) => updateForm("monthlyRent", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Budget Range (₹/month)" hint="Set a budget range for negotiation">
        <input className={inp} placeholder="e.g., 50000-80000" value={formData.budgetRange} onChange={(e) => updateForm("budgetRange", e.target.value)} />
      </Field>
      <Field label="Security Deposit (₹)" error={errors.securityDeposit}>
        <input className={inp} type="number" min="0" placeholder="Enter security deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Lease Duration" required error={errors.leaseDuration}>
        <div className="grid grid-cols-2 gap-1">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-duration-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Maintenance Charges Included">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-maint-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Rent Negotiable">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-negotiable-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentNegotiable === "Fixed"} onChange={() => updateForm("rentNegotiable", "Fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-negotiable-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentNegotiable === "Negotiable"} onChange={() => updateForm("rentNegotiable", "Negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">✨ Amenities</h3>
      </div>
      <Field label="Select Amenities">
        <div className="grid grid-cols-2 gap-1">
          {commercialRentAmenities.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.selectedAmenities.includes(amenity.id)} onChange={() => toggleCommercialAmenity(amenity.id)} />
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
              <input type="radio" name="mob-occupancy-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
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
              <input type="radio" name="mob-renewal-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === opt} onChange={() => updateForm("leaseRenewalOption", opt)} />
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
          {nearbyPlacesOptions.map(place => (
            <label key={place} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.nearbyAccess.includes(place)} onChange={() => toggleNearbyPlace(place)} />
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
      
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-cover-com" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-com" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-com" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-com" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-com" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-com" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-com" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="m-aadhaar-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCardDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required error={errors.panCardDoc}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-com" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="Agency Logo" hint="Optional (JPG, PNG max 2MB)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-logo-com" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert("Logo must be less than 2MB");
                return;
              }
              updateForm("agencyLogo", file);
            }
          }} />
          <label htmlFor="m-logo-com" className="cursor-pointer flex flex-col items-center">
            <Building className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.agencyLogo && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.agencyLogo)} 
              alt="Agency Logo" 
              className="w-16 h-16 object-cover rounded-lg border-2 border-[#00695C]"
            />
            <button 
              onClick={() => updateForm("agencyLogo", null)} 
              className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </Field>

      <Field label="RERA Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-rera-com" onChange={(e) => handleDocumentUpload("reraCertificateDoc", e)} />
          <label htmlFor="m-rera-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA Certificate</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertificateDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCertificateDoc.name}</p>}
      </Field>

      <Field label="GST Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gst-com" onChange={(e) => handleDocumentUpload("gstCertificateDoc", e)} />
          <label htmlFor="m-gst-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST Certificate</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertificateDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCertificateDoc.name}</p>}
      </Field>

      <Field label="Business Registration Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-business-com" onChange={(e) => handleDocumentUpload("businessRegistrationDoc", e)} />
          <label htmlFor="m-business-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.businessRegistrationDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.businessRegistrationDoc.name}</p>}
      </Field>

      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-com" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-com" className="cursor-pointer flex flex-col items-center">
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

      <Field label="Rental Agreement" required error={errors.rentalAgreement}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-rentalAgreement-com" onChange={(e) => handleDocumentUpload("rentalAgreement", e)} />
          <label htmlFor="m-rentalAgreement-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Rental Agreement</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.rentalAgreement && <p className="text-[10px] text-green-600 mt-1">✓ {formData.rentalAgreement.name}</p>}
      </Field>

      <Field label="Trade License" required error={errors.tradeLicense}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-trade-com" onChange={(e) => handleDocumentUpload("tradeLicense", e)} />
          <label htmlFor="m-trade-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Trade License</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.tradeLicense && <p className="text-[10px] text-green-600 mt-1">✓ {formData.tradeLicense.name}</p>}
      </Field>

      <Field label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-fire-com" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="m-fire-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Fire Safety Certificate</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.fireSafetyCertificate.name}</p>}
      </Field>

      <Field label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-tax-com" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="m-tax-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Tax Receipt</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[10px] text-green-600 mt-1">✓ {formData.propertyTaxReceipt.name}</p>}
      </Field>

      <Field label="Sale Deed (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-saleDeed-com" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="m-saleDeed-com" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Bank Name" required error={errors.bankName}>
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankNameOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </Field>
      <Field label="Account Number" required hint="9-18 digits" error={errors.accountNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={18} placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", handleNumericFieldChange(e.target.value).slice(0, 18))} />
      </Field>
      <Field label="IFSC Code" required hint="e.g., SBIN0001234" error={errors.ifscCode}>
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

  // STEP 8: Declaration & Signature
  if (step === 8) return (
    <>
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[11px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-3.5 h-3.5" /> Agent Signature <span className="text-red-500">*</span>
      </label>
      {errors.signature && <p className="text-[10px] text-red-500 mb-1">{errors.signature}</p>}
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
      <Field label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" 
            checked={formData.declaration1 || false} 
            onChange={() => updateForm("declaration1", !formData.declaration1)} 
          />
          <span>I confirm that I am a licensed real estate agent or an authorized representative of my agency.</span>
        </label>
        {errors.declaration1 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration1}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" 
            checked={formData.declaration2 || false} 
            onChange={() => updateForm("declaration2", !formData.declaration2)} 
          />
          <span>I certify that all information and documents submitted are true and accurate.</span>
        </label>
        {errors.declaration2 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration2}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" 
            checked={formData.declaration3 || false} 
            onChange={() => updateForm("declaration3", !formData.declaration3)} 
          />
          <span>I agree to the Terms & Conditions and Privacy Policy of the platform.</span>
        </label>
        {errors.declaration3 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration3}</p>}
      </div>
    </>
  );

  return null;
}

// DESKTOP CONTENT - Rent Agent Commercial
function DtContentRentAgentCom({ 
  step, inp, formData, updateForm, errors,
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload,
  toggleAmenity, toggleCommercialAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  leaseDurationOptions, contactTimeOptions,
  commercialRentAmenities, toggleNearbyPlace, nearbyPlacesOptions,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  genderOptions, commercialTypeOptions, businessTypeOptions,
  bankNameOptions, serviceAreasOptions,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphanumericFieldChange,
  isOnlyLettersAndSpaces, isOnlyDigits, isValidIFSC, isValidEmail, isValidPincode
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
      <FieldDt label="Full Name" required error={errors.fullName}>
        <input className={inp} placeholder="Enter your full name" value={formData.fullName} onChange={(e) => updateForm("fullName", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inp} type="tel" placeholder="Enter your 10-digit mobile number" value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", handleNumericFieldChange(e.target.value).slice(0, 10))} maxLength={10} />
      </FieldDt>
      <FieldDt label="Email Address" required error={errors.emailId}>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
      </FieldDt>
      <FieldDt label="Gender">
        <div className="flex gap-5">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-profile-com" onChange={handleProfilePhotoUpload} />
          <label htmlFor="dt-profile-com" className="cursor-pointer flex flex-col items-center">
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
      <FieldDt label="Agency Name" required error={errors.agencyName}>
        <input className={inp} placeholder="Enter your agency name" value={formData.agencyName} onChange={(e) => updateForm("agencyName", e.target.value)} />
      </FieldDt>
      <FieldDt label="RERA Registration Number" hint="If applicable">
        <input className={inp} placeholder="Enter RERA registration number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="GST Number" hint="Optional">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Years of Experience" required error={errors.yearsExperience}>
        <input className={inp} type="number" min="0" placeholder="Enter years of experience" value={formData.yearsExperience} onChange={(e) => updateForm("yearsExperience", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Number of Active Listings">
        <input className={inp} type="number" min="0" placeholder="Enter number of active listings" value={formData.activeListings} onChange={(e) => updateForm("activeListings", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Service Areas" required error={errors.serviceAreas}>
        <SearchableMultiSelectDt
          options={serviceAreasOptions}
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

  // STEP 2: Property Details (Location + Commercial Details)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <FieldDt label="City" required error={errors.city}>
        <input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e) => updateForm("city", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Area / Locality" required error={errors.area}>
        <input className={inp} placeholder="Enter area or locality" value={formData.area} onChange={(e) => updateForm("area", handleAlphanumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </FieldDt>
      <FieldDt label="State" error={errors.state}>
        <input className={inp} placeholder="Enter state name" value={formData.state} onChange={(e) => updateForm("state", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="District" error={errors.district}>
        <input className={inp} placeholder="Enter district name" value={formData.district} onChange={(e) => updateForm("district", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="PIN Code" hint="Exactly 6 digits" error={errors.pinCode}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", handleNumericFieldChange(e.target.value).slice(0, 6))} />
      </FieldDt>
      <FieldDt label="Nearby Connectivity">
        <input className={inp} placeholder="Metro, Bus, Highway" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🏢 Commercial Property Specifications</h3>
      </div>
      <FieldDt label="Commercial Type" required error={errors.commercialType}>
        <div className="grid grid-cols-2 gap-2">
          {commercialTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-com-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.commercialType === type} onChange={() => updateForm("commercialType", type)} />
              {type}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Built-up Area (sq.ft)" required hint="In square feet" error={errors.builtUpArea}>
        <input className={inp} type="number" min="0" placeholder="Enter built-up area" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Carpet Area (sq.ft)" hint="In square feet" error={errors.carpetArea}>
        <input className={inp} type="number" min="0" placeholder="Enter carpet area" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Floor Number" error={errors.floorNumber}>
        <input className={inp} type="number" min="0" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => updateForm("floorNumber", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Total Floors" error={errors.totalFloors}>
        <input className={inp} type="number" min="0" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => updateForm("totalFloors", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Facing Direction">
        <div className="grid grid-cols-4 gap-2">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-facing-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Property Age" error={errors.propertyAge}>
        <input className={inp} type="number" min="0" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => updateForm("propertyAge", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Frontage Width (ft)" error={errors.frontageWidth}>
        <input className={inp} type="number" min="0" placeholder="Enter frontage width" value={formData.frontageWidth} onChange={(e) => updateForm("frontageWidth", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Ceiling Height (ft)" error={errors.ceilingHeight}>
        <input className={inp} type="number" min="0" placeholder="Enter ceiling height" value={formData.ceilingHeight} onChange={(e) => updateForm("ceilingHeight", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Furnishing Status">
        <div className="flex flex-wrap gap-3">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-furnish-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishing === f} onChange={() => updateForm("furnishing", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Power Load Capacity (KVA/HP)">
        <input className={inp} placeholder="Enter power load capacity" value={formData.powerLoad} onChange={(e) => updateForm("powerLoad", e.target.value)} />
      </FieldDt>
      <FieldDt label="Parking Capacity" error={errors.parkingCapacity}>
        <input className={inp} type="number" min="0" placeholder="Number of parking slots" value={formData.parkingCapacity} onChange={(e) => updateForm("parkingCapacity", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Business Type Suitable" required error={errors.businessType}>
        <div className="flex flex-wrap gap-3">
          {businessTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-biz-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.businessType === type} onChange={() => updateForm("businessType", type)} />
              {type}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Rental Term">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-term-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentalTerm === "Short"} onChange={() => updateForm("rentalTerm", "Short")} />
            Short Term
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-term-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentalTerm === "Long"} onChange={() => updateForm("rentalTerm", "Long")} />
            Long Term
          </label>
        </div>
      </FieldDt>
    </>
  );

  // STEP 3: Pricing & Amenities (Desktop)
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📄 Rental Details</h3>
      </div>
      <FieldDt label="Monthly Rent (₹)" required error={errors.monthlyRent}>
        <input className={inp} type="number" min="0" placeholder="Enter monthly rent amount" value={formData.monthlyRent} onChange={(e) => updateForm("monthlyRent", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Budget Range (₹/month)" hint="Set a budget range for negotiation">
        <input className={inp} placeholder="e.g., 50000-80000" value={formData.budgetRange} onChange={(e) => updateForm("budgetRange", e.target.value)} />
      </FieldDt>
      <FieldDt label="Security Deposit (₹)" error={errors.securityDeposit}>
        <input className={inp} type="number" min="0" placeholder="Enter security deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Lease Duration" required error={errors.leaseDuration}>
        <div className="flex flex-wrap gap-3">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-duration-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges Included">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-maint-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Rent Negotiable">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-negotiable-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentNegotiable === "Fixed"} onChange={() => updateForm("rentNegotiable", "Fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-negotiable-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentNegotiable === "Negotiable"} onChange={() => updateForm("rentNegotiable", "Negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">✨ Amenities</h3>
      </div>
      <FieldDt label="Select Amenities">
        <div className="grid grid-cols-2 gap-2">
          {commercialRentAmenities.map(amenity => (
            <label key={amenity.id} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.selectedAmenities.includes(amenity.id)} onChange={() => toggleCommercialAmenity(amenity.id)} />
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
              <input type="radio" name="dt-occupancy-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
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
              <input type="radio" name="dt-renewal-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === opt} onChange={() => updateForm("leaseRenewalOption", opt)} />
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
          {nearbyPlacesOptions.map(place => (
            <label key={place} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.nearbyAccess.includes(place)} onChange={() => toggleNearbyPlace(place)} />
              {place}
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
      <p className="text-[11px] text-center text-gray-400 mb-3">📸 Upload property images and media</p>
      
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-cover-com" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-com" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-com" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-com" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-com" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-com" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-com" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="dt-aadhaar-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required error={errors.panCardDoc}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-com" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Agency Logo" hint="Optional (JPG, PNG max 2MB)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-logo-com" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert("Logo must be less than 2MB");
                return;
              }
              updateForm("agencyLogo", file);
            }
          }} />
          <label htmlFor="dt-logo-com" className="cursor-pointer flex flex-col items-center">
            <Building className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.agencyLogo && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.agencyLogo)} 
              alt="Agency Logo" 
              className="w-20 h-20 object-cover rounded-lg border-2 border-[#00695C]"
            />
            <button 
              onClick={() => updateForm("agencyLogo", null)} 
              className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="RERA Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-rera-com" onChange={(e) => handleDocumentUpload("reraCertificateDoc", e)} />
          <label htmlFor="dt-rera-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertificateDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCertificateDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gst-com" onChange={(e) => handleDocumentUpload("gstCertificateDoc", e)} />
          <label htmlFor="dt-gst-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertificateDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCertificateDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Business Registration Certificate" hint="Optional">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-business-com" onChange={(e) => handleDocumentUpload("businessRegistrationDoc", e)} />
          <label htmlFor="dt-business-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.businessRegistrationDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.businessRegistrationDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-com" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-com" className="cursor-pointer flex flex-col items-center">
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

      <FieldDt label="Rental Agreement" required error={errors.rentalAgreement}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-rentalAgreement-com" onChange={(e) => handleDocumentUpload("rentalAgreement", e)} />
          <label htmlFor="dt-rentalAgreement-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Rental Agreement</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.rentalAgreement && <p className="text-[13px] text-green-600 mt-2">✓ {formData.rentalAgreement.name}</p>}
      </FieldDt>

      <FieldDt label="Trade License" required error={errors.tradeLicense}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-trade-com" onChange={(e) => handleDocumentUpload("tradeLicense", e)} />
          <label htmlFor="dt-trade-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Trade License</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.tradeLicense && <p className="text-[13px] text-green-600 mt-2">✓ {formData.tradeLicense.name}</p>}
      </FieldDt>

      <FieldDt label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-fire-com" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="dt-fire-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Fire Safety Certificate</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.fireSafetyCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-tax-com" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="dt-tax-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Tax Receipt</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[13px] text-green-600 mt-2">✓ {formData.propertyTaxReceipt.name}</p>}
      </FieldDt>

      <FieldDt label="Sale Deed (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-saleDeed-com" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="dt-saleDeed-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Sale Deed</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[13px] text-green-600 mt-2">✓ {formData.saleDeed.name}</p>}
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
      <p className="text-[11px] text-gray-400 mb-3">Enter your bank details for payments</p>
      <FieldDt label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Bank Name" required error={errors.bankName}>
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankNameOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </FieldDt>
      <FieldDt label="Account Number" required hint="9-18 digits" error={errors.accountNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={18} placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", handleNumericFieldChange(e.target.value).slice(0, 18))} />
      </FieldDt>
      <FieldDt label="IFSC Code" required hint="e.g., SBIN0001234" error={errors.ifscCode}>
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

  // STEP 8: Declaration & Signature (Desktop)
  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-4 h-4" /> Agent Signature <span className="text-red-500">*</span>
      </label>
      {errors.signature && <p className="text-[12px] text-red-500 mb-1">{errors.signature}</p>}
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
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-2">
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" 
            checked={formData.declaration1 || false} 
            onChange={() => updateForm("declaration1", !formData.declaration1)} 
          />
          <span>I confirm that I am a licensed real estate agent or an authorized representative of my agency.</span>
        </label>
        {errors.declaration1 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration1}</p>}
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" 
            checked={formData.declaration2 || false} 
            onChange={() => updateForm("declaration2", !formData.declaration2)} 
          />
          <span>I certify that all information and documents submitted are true and accurate.</span>
        </label>
        {errors.declaration2 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration2}</p>}
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" 
            checked={formData.declaration3 || false} 
            onChange={() => updateForm("declaration3", !formData.declaration3)} 
          />
          <span>I agree to the Terms & Conditions and Privacy Policy of the platform.</span>
        </label>
        {errors.declaration3 && <p className="text-[12px] text-red-500 ml-6">{errors.declaration3}</p>}
      </div>
    </>
  );

  return null;
}