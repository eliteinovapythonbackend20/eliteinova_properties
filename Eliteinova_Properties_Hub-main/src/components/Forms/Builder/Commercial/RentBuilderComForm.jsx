import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, 
  Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, 
  Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, 
  Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, User, 
  Mail, Phone, Calendar as CalendarIcon, UserCheck, File, 
  MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, 
  CheckSquare, PenTool, Globe, Facebook, Instagram, Linkedin, Youtube, 
  BriefcaseBusiness, Building2, Factory, Store, ShieldCheck, Warehouse
} from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

// ==================== VALIDATION HELPER FUNCTIONS ====================

// Only allows alphabetic characters and spaces
const handleAlphaFieldChange = (setter) => (e) => {
  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
  setter(value);
};

// Only allows numeric digits
const handleNumericFieldChange = (setter) => (e) => {
  const value = e.target.value.replace(/\D/g, '');
  setter(value);
};

// Only allows digits and limits to specified length
const handleLimitedNumericChange = (setter, maxLength) => (e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
  setter(value);
};

// Only allows letters, numbers, and spaces
const handleAlphaNumericFieldChange = (setter) => (e) => {
  const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
  setter(value);
};

// PAN number formatting (uppercase, alphanumeric)
const handlePanChange = (setter) => (e) => {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  setter(value);
};

// IFSC code validation and formatting
const handleIfscChange = (setter) => (e) => {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
  setter(value);
};

// Only allows letters, numbers, spaces, and common punctuation
const handleAddressChange = (setter) => (e) => {
  const value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, '');
  setter(value);
};

// Only allows letters, numbers, spaces, and common symbols for company name
const handleCompanyNameChange = (setter) => (e) => {
  const value = e.target.value.replace(/[^a-zA-Z0-9\s&.,-]/g, '');
  setter(value);
};

// Only allows uppercase letters, numbers, and hyphens for RERA
const handleReraChange = (setter) => (e) => {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  setter(value);
};

const steps = [
  "Company Details",
  "Authorized Person",
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
  "Enter company/builder information",
  "Authorized representative details",
  "Office address information",
  "Verify business identity",
  "Commercial property details",
  "Set rent pricing & amenities",
  "Bank account details",
  "Social media & online presence",
  "Upload company & property documents",
  "Confirm & submit"
];

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
const commercialTypeOptions = [
  "Retail Shop", "Office Space", "Showroom", "Warehouse", "Commercial Complex", 
  "Shopping Mall", "Restaurant", "Hotel", "Co-working Space", "Educational Institution", 
  "Clinic", "Petrol Bunk"
];
const businessTypeOptions = ["Retail", "Office", "Food & Beverage", "Warehouse", "Service", "Manufacturing"];

const commercialRentAmenities = [
  { id: "powerBackup", label: "Power Backup" },
  { id: "security247", label: "24/7 Security" },
  { id: "cctv", label: "CCTV Surveillance" },
  { id: "visitorParking", label: "Visitor Parking" },
  { id: "wifi", label: "High-Speed Internet" },
  { id: "lift", label: "Lift / Elevator" },
  { id: "fireSafety", label: "Fire Safety System" },
  { id: "ac", label: "Air Conditioning" },
  { id: "pantry", label: "Pantry / Cafeteria" },
  { id: "loadingDock", label: "Loading Dock" },
  { id: "signage", label: "Signage Space" },
  { id: "conference", label: "Conference Room" }
];

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
  "IDBI Bank",
  "Federal Bank",
  "IndusInd Bank",
  "Other"
];

const serviceAreaOptions = [
  "Local",
  "Regional",
  "Statewide",
  "National",
  "International"
];

const nearbyPlaceOptions = [
  "Railway Station",
  "Metro Station",
  "Bus Stop",
  "Airport",
  "Shopping Mall",
  "Hospital",
  "School/College",
  "Bank",
  "Restaurant",
  "Park",
  "Temple",
  "Market"
];

export default function RentBuilderComForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Company Details (Step 0)
    companyName: "", companyRegNumber: "", reraNumber: "", gstNumber: "", yearsOfExperience: "", companyWebsite: "", companyLogo: null, companyProfile: "",
    
    // Authorized Person (Step 1)
    authFullName: "", authDesignation: "", authMobile: "", authEmail: "", authWhatsapp: "", authPhoto: null,
    
    // Office Address (Step 2)
    officeAddress: "", officeCity: "", officeDistrict: "", officeState: "", officePinCode: "", officeLandmark: "",
    
    // Identity & Business Verification (Step 3)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, companyRegCert: null, gstCert: null, reraCert: null, companyPanCard: null,
    
    // Property Details (Step 4)
    propertyTitle: "", commercialType: "", propertyAddress: "", propertyCity: "", 
    builtUpArea: "", carpetArea: "",
    floorNumber: "", totalFloors: "", facingDirection: "", propertyAge: "",
    frontageWidth: "", ceilingHeight: "", furnishing: "", powerLoad: "",
    parkingCapacity: "", businessType: "", rentalTerm: "",
    serviceArea: [],
    nearbyPlaces: [],
    nearbyConnectivity: "",
    
    // Pricing & Amenities (Step 5)
    listingPurpose: "rent", rentAmount: "", securityDeposit: "", priceType: "", maintenance: "", 
    availableFrom: "", selectedAmenities: [], otherAmenities: "",
    immediateOccupancy: "",
    
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    
    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Documents (Step 8)
    companyLogoDoc: null, companyBrochure: null, projectBrochures: [], companyRegCertDoc: null, reraCertDoc: null, gstCertDoc: null, panCardDoc: null, authIdProof: null, officeAddressProof: null,
    propertyImages: [], propertyVideo: null, coverImage: null, floorPlan: null,
    rentalAgreement: null, tradeLicense: null, fireSafetyCertificate: null,
    
    // Declaration (Step 9)
    declarationAuthorized: false, declarationAccurate: false, declarationCompliance: false, declarationTerms: false,
    signature: null, signatureDate: "", signaturePlace: ""
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
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

  // ==================== VALIDATION FUNCTIONS ====================

  const validateStep = (stepNumber) => {
    const newErrors = {};
    let isValid = true;

    switch(stepNumber) {
      case 0: // Company Details
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
          isValid = false;
        } else if (!/^[a-zA-Z0-9\s&.,-]+$/.test(formData.companyName)) {
          newErrors.companyName = "Company name contains invalid characters";
          isValid = false;
        }
        
        if (!formData.companyRegNumber.trim()) {
          newErrors.companyRegNumber = "Registration number is required";
          isValid = false;
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(formData.companyRegNumber)) {
          newErrors.companyRegNumber = "Registration number contains invalid characters";
          isValid = false;
        }
        
        if (!formData.reraNumber.trim()) {
          newErrors.reraNumber = "RERA number is required";
          isValid = false;
        } else if (!/^[A-Z0-9-]+$/.test(formData.reraNumber)) {
          newErrors.reraNumber = "RERA number contains invalid characters";
          isValid = false;
        }
        
        if (!formData.yearsOfExperience || parseFloat(formData.yearsOfExperience) <= 0) {
          newErrors.yearsOfExperience = "Years of experience is required";
          isValid = false;
        } else if (!/^\d+(\.\d+)?$/.test(formData.yearsOfExperience)) {
          newErrors.yearsOfExperience = "Enter a valid number";
          isValid = false;
        }
        
        if (!formData.companyProfile.trim()) {
          newErrors.companyProfile = "Company profile is required";
          isValid = false;
        }
        break;

      case 1: // Authorized Person
        if (!formData.authFullName.trim()) {
          newErrors.authFullName = "Full name is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.authFullName)) {
          newErrors.authFullName = "Name can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.authDesignation.trim()) {
          newErrors.authDesignation = "Designation is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.authDesignation)) {
          newErrors.authDesignation = "Designation can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.authMobile || !/^[0-9]{10}$/.test(formData.authMobile)) {
          newErrors.authMobile = "Please enter a valid 10-digit mobile number";
          isValid = false;
        }
        
        if (!formData.authEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authEmail)) {
          newErrors.authEmail = "Please enter a valid email address";
          isValid = false;
        }
        if (!formData.authPhoto) {
          newErrors.authPhoto = "Profile photo is required";
          isValid = false;
        }
        break;

      case 2: // Office Address
        if (!formData.officeAddress.trim()) {
          newErrors.officeAddress = "Office address is required";
          isValid = false;
        } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.officeAddress)) {
          newErrors.officeAddress = "Address contains invalid characters";
          isValid = false;
        }
        
        if (!formData.officeCity.trim()) {
          newErrors.officeCity = "City is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.officeCity)) {
          newErrors.officeCity = "City can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.officeDistrict.trim()) {
          newErrors.officeDistrict = "District is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.officeDistrict)) {
          newErrors.officeDistrict = "District can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.officeState.trim()) {
          newErrors.officeState = "State is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.officeState)) {
          newErrors.officeState = "State can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.officePinCode || !/^[0-9]{6}$/.test(formData.officePinCode)) {
          newErrors.officePinCode = "Please enter a valid 6-digit PIN code";
          isValid = false;
        }
        break;

      case 3: // Identity & Business Verification
        if (!formData.aadhaarNumber || !/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
          newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";
          isValid = false;
        }
        if (!formData.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
          newErrors.panNumber = "Please enter a valid 10-character PAN number";
          isValid = false;
        }
        if (!formData.aadhaarCard) {
          newErrors.aadhaarCard = "Aadhaar card upload is required";
          isValid = false;
        }
        if (!formData.panCard) {
          newErrors.panCard = "PAN card upload is required";
          isValid = false;
        }
        if (!formData.companyRegCert) {
          newErrors.companyRegCert = "Company registration certificate is required";
          isValid = false;
        }
        if (!formData.reraCert) {
          newErrors.reraCert = "RERA certificate is required";
          isValid = false;
        }
        break;

      case 4: // Property Details
        if (!formData.propertyTitle.trim()) {
          newErrors.propertyTitle = "Property title is required";
          isValid = false;
        } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.propertyTitle)) {
          newErrors.propertyTitle = "Property title contains invalid characters";
          isValid = false;
        }
        
        if (!formData.commercialType) {
          newErrors.commercialType = "Please select a commercial type";
          isValid = false;
        }
        
        if (!formData.propertyAddress.trim()) {
          newErrors.propertyAddress = "Property address is required";
          isValid = false;
        } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.propertyAddress)) {
          newErrors.propertyAddress = "Address contains invalid characters";
          isValid = false;
        }
        
        if (!formData.propertyCity.trim()) {
          newErrors.propertyCity = "Property city is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.propertyCity)) {
          newErrors.propertyCity = "City can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.businessType) {
          newErrors.businessType = "Please select a business type";
          isValid = false;
        }
        break;

      case 5: // Pricing & Amenities
        if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
          newErrors.rentAmount = "Monthly rent is required";
          isValid = false;
        } else if (!/^\d+(\.\d+)?$/.test(formData.rentAmount)) {
          newErrors.rentAmount = "Enter a valid number";
          isValid = false;
        }
        
        if (!formData.priceType) {
          newErrors.priceType = "Please select price type";
          isValid = false;
        }
        break;

      case 6: // Bank Details
        if (!formData.accountHolderName.trim()) {
          newErrors.accountHolderName = "Account holder name is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.accountHolderName)) {
          newErrors.accountHolderName = "Account holder name can only contain letters and spaces";
          isValid = false;
        }
        
        if (!formData.bankName) {
          newErrors.bankName = "Please select a bank";
          isValid = false;
        }
        
        if (!formData.accountNumber || !/^[0-9]{9,18}$/.test(formData.accountNumber)) {
          newErrors.accountNumber = "Please enter a valid account number (9-18 digits)";
          isValid = false;
        }
        
        if (!formData.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
          newErrors.ifscCode = "Please enter a valid IFSC code";
          isValid = false;
        }
        break;

      case 8: // Documents
        if (!formData.companyLogoDoc) {
          newErrors.companyLogoDoc = "Company logo is required";
          isValid = false;
        }
        if (!formData.authIdProof) {
          newErrors.authIdProof = "Authorized signatory ID proof is required";
          isValid = false;
        }
        if (!formData.officeAddressProof) {
          newErrors.officeAddressProof = "Office address proof is required";
          isValid = false;
        }
        if (!formData.floorPlan) {
          newErrors.floorPlan = "Floor plan is required";
          isValid = false;
        }
        if (!formData.rentalAgreement) {
          newErrors.rentalAgreement = "Rental agreement is required";
          isValid = false;
        }
        if (!formData.tradeLicense) {
          newErrors.tradeLicense = "Trade license is required";
          isValid = false;
        }
        if (!formData.fireSafetyCertificate) {
          newErrors.fireSafetyCertificate = "Fire safety certificate is required";
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
        break;

      case 9: // Declaration
        if (!formData.declarationAuthorized) {
          newErrors.declarationAuthorized = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.declarationAccurate) {
          newErrors.declarationAccurate = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.declarationCompliance) {
          newErrors.declarationCompliance = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.declarationTerms) {
          newErrors.declarationTerms = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.signature) {
          newErrors.signature = "Signature is required";
          isValid = false;
        }
        if (!formData.signatureDate) {
          newErrors.signatureDate = "Date is required";
          isValid = false;
        }
        if (!formData.signaturePlace.trim()) {
          newErrors.signaturePlace = "Place is required";
          isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(formData.signaturePlace)) {
          newErrors.signaturePlace = "Place can only contain letters and spaces";
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
        setErrors(prev => ({ ...prev, [docType]: null }));
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

  const toggleArrayItem = (field, value) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      updateForm(field, current.filter(v => v !== value));
    } else {
      updateForm(field, [...current, value]);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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
    if (errors.signature) {
      setErrors(prev => ({ ...prev, signature: null }));
    }
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

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
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
            <div className="text-xl mb-0.5 relative z-10">🏗️</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Rent Commercial - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List commercial property for rent</p>
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
            <MobContentRentBuilderCom
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
              toggleCommercialAmenity={toggleCommercialAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              commercialTypeOptions={commercialTypeOptions}
              businessTypeOptions={businessTypeOptions}
              commercialRentAmenities={commercialRentAmenities}
              toggleArrayItem={toggleArrayItem}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              bankOptions={bankOptions}
              serviceAreaOptions={serviceAreaOptions}
              nearbyPlaceOptions={nearbyPlaceOptions}
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
                onClick={() => step === steps.length - 1 ? handleSubmit() : handleNext()}
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
            <div className="text-xl mb-0.5 relative z-10">🏗️</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Rent Commercial - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List commercial property for rent</p>
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
            <DtContentRentBuilderCom
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
              toggleCommercialAmenity={toggleCommercialAmenity}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              commercialTypeOptions={commercialTypeOptions}
              businessTypeOptions={businessTypeOptions}
              commercialRentAmenities={commercialRentAmenities}
              toggleArrayItem={toggleArrayItem}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              bankOptions={bankOptions}
              serviceAreaOptions={serviceAreaOptions}
              nearbyPlaceOptions={nearbyPlaceOptions}
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
                onClick={() => step === steps.length - 1 ? handleSubmit() : handleNext()}>
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue <span className="text-sm">→</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// MOBILE CONTENT - Rent Builder Commercial
function MobContentRentBuilderCom({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload,
  toggleAmenity, toggleCommercialAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  commercialTypeOptions, businessTypeOptions,
  commercialRentAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  bankOptions, serviceAreaOptions, nearbyPlaceOptions
}) {
  const ta = `${inp} resize-y`;
  const signatureCanvasRef = useRef(null);

  // ==================== HANDLER FUNCTIONS ====================
  
  const handleAlphaChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    updateForm(field, value);
  };

  const handleNumericChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '');
    updateForm(field, value);
  };

  const handleLimitedNumericChange = (field, maxLength) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    updateForm(field, value);
  };

  const handleAlphaNumericChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    updateForm(field, value);
  };

  const handlePanChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    updateForm(field, value);
  };

  const handleIfscChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    updateForm(field, value);
  };

  const handleAddressChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, '');
    updateForm(field, value);
  };

  const handleCompanyNameChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s&.,-]/g, '');
    updateForm(field, value);
  };

  const handleReraChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    updateForm(field, value);
  };

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

  // STEP 0: Company Details
  if (step === 0) return (
    <>
      <Field label="Builder / Company Name" required error={errors.companyName}>
        <input className={`${inp} ${errors.companyName ? errorBorder : ''}`} placeholder="Enter company name" value={formData.companyName} onChange={handleCompanyNameChange("companyName")} />
      </Field>
      <Field label="Company Registration Number" required error={errors.companyRegNumber}>
        <input className={`${inp} ${errors.companyRegNumber ? errorBorder : ''}`} placeholder="Enter registration number" value={formData.companyRegNumber} onChange={handleAlphaNumericChange("companyRegNumber")} />
      </Field>
      <Field label="RERA Registration Number" required error={errors.reraNumber}>
        <input className={`${inp} ${errors.reraNumber ? errorBorder : ''}`} placeholder="Enter RERA number" value={formData.reraNumber} onChange={handleReraChange("reraNumber")} />
      </Field>
      <Field label="GST Number">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </Field>
      <Field label="Years of Experience" required error={errors.yearsOfExperience}>
        <input className={`${inp} ${errors.yearsOfExperience ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter years of experience" value={formData.yearsOfExperience} onChange={handleNumericChange("yearsOfExperience")} />
      </Field>
      <Field label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.companyWebsite} onChange={(e) => updateForm("companyWebsite", e.target.value)} />
      </Field>
      <Field label="Company Profile / About Us" required error={errors.companyProfile}>
        <textarea className={`${ta} min-h-[60px] ${errors.companyProfile ? errorBorder : ''}`} placeholder="Describe your company background" value={formData.companyProfile} onChange={(e) => updateForm("companyProfile", e.target.value)} />
      </Field>
    </>
  );

  // STEP 1: Authorized Person
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Authorized Person Details</h3>
      </div>
      <Field label="Full Name" required error={errors.authFullName}>
        <input className={`${inp} ${errors.authFullName ? errorBorder : ''}`} placeholder="Enter authorized person's full name" value={formData.authFullName} onChange={handleAlphaChange("authFullName")} />
      </Field>
      <Field label="Designation" required error={errors.authDesignation}>
        <input className={`${inp} ${errors.authDesignation ? errorBorder : ''}`} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={handleAlphaChange("authDesignation")} />
      </Field>
      <Field label="Mobile Number" required error={errors.authMobile}>
        <input className={`${inp} ${errors.authMobile ? errorBorder : ''}`} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={handleLimitedNumericChange("authMobile", 10)} />
      </Field>
      <Field label="Email Address" required error={errors.authEmail}>
        <input className={`${inp} ${errors.authEmail ? errorBorder : ''}`} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </Field>
      <Field label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={handleLimitedNumericChange("authWhatsapp", 10)} />
      </Field>
      <Field label="Profile Photo" required hint="JPG, PNG max 2MB" error={errors.authPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-authphoto-com" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert("Profile photo must be less than 2MB");
                return;
              }
              updateForm("authPhoto", file);
              if (errors.authPhoto) {
                setErrors(prev => ({ ...prev, authPhoto: null }));
              }
            }
          }} />
          <label htmlFor="m-authphoto-com" className="cursor-pointer flex flex-col items-center">
            <User className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.authPhoto && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.authPhoto)} 
              alt="Profile" 
              className="w-16 h-16 object-cover rounded-full border-2 border-[#00695C]"
            />
            <button 
              onClick={() => {
                updateForm("authPhoto", null);
              }} 
              className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
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
        <textarea className={`${ta} min-h-[55px] ${errors.officeAddress ? errorBorder : ''}`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={handleAddressChange("officeAddress")} />
      </Field>
      <Field label="City" required error={errors.officeCity}>
        <input className={`${inp} ${errors.officeCity ? errorBorder : ''}`} placeholder="Enter city" value={formData.officeCity} onChange={handleAlphaChange("officeCity")} />
      </Field>
      <Field label="District" required error={errors.officeDistrict}>
        <input className={`${inp} ${errors.officeDistrict ? errorBorder : ''}`} placeholder="Enter district" value={formData.officeDistrict} onChange={handleAlphaChange("officeDistrict")} />
      </Field>
      <Field label="State" required error={errors.officeState}>
        <input className={`${inp} ${errors.officeState ? errorBorder : ''}`} placeholder="Enter state" value={formData.officeState} onChange={handleAlphaChange("officeState")} />
      </Field>
      <Field label="PIN Code" required error={errors.officePinCode}>
        <input className={`${inp} ${errors.officePinCode ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={handleLimitedNumericChange("officePinCode", 6)} />
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
        <input className={`${inp} ${errors.aadhaarNumber ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={handleLimitedNumericChange("aadhaarNumber", 12)} />
      </Field>
      <Field label="PAN Number" required error={errors.panNumber}>
        <input className={`${inp} ${errors.panNumber ? errorBorder : ''}`} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={handlePanChange("panNumber")} />
      </Field>

      <Field label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className={`border-2 border-dashed ${errors.aadhaarCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-authaadhaar-com" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-authaadhaar-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>

      <Field label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-authpan-com" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-authpan-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>

      <Field label="Upload Company Registration Certificate" required error={errors.companyRegCert}>
        <div className={`border-2 border-dashed ${errors.companyRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-companyreg-com" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="m-companyreg-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCert.name}</p>}
      </Field>

      <Field label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gstcert-com" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="m-gstcert-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCert.name}</p>}
      </Field>

      <Field label="Upload RERA Certificate" required error={errors.reraCert}>
        <div className={`border-2 border-dashed ${errors.reraCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-reracert-com" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="m-reracert-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCert.name}</p>}
      </Field>

      <Field label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-companypan-com" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="m-companypan-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Company PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyPanCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyPanCard.name}</p>}
      </Field>
    </>
  );

  // STEP 4: Property Details
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Commercial Property Details</h3>
      </div>
      <Field label="Property Title / Name" required error={errors.propertyTitle}>
        <input className={`${inp} ${errors.propertyTitle ? errorBorder : ''}`} placeholder="e.g. Prime Retail Space, Office Complex" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} />
      </Field>
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
      <Field label="Property Address" required error={errors.propertyAddress}>
        <textarea className={`${ta} min-h-[55px] ${errors.propertyAddress ? errorBorder : ''}`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={handleAddressChange("propertyAddress")} />
      </Field>
      <Field label="Property City" required error={errors.propertyCity}>
        <input className={`${inp} ${errors.propertyCity ? errorBorder : ''}`} placeholder="Enter property city name" value={formData.propertyCity} onChange={handleAlphaChange("propertyCity")} />
      </Field>
      <Field label="Built-up Area (sq.ft)" hint="Enter total built-up area">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Carpet Area (sq.ft)" hint="Enter carpet area">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Floor Number">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter floor number" value={formData.floorNumber} onChange={handleNumericChange("floorNumber")} />
      </Field>
      <Field label="Total Floors">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter total floors" value={formData.totalFloors} onChange={handleNumericChange("totalFloors")} />
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
      <Field label="Property Age (years)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter property age in years" value={formData.propertyAge} onChange={handleNumericChange("propertyAge")} />
      </Field>
      <Field label="Frontage Width (ft)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter frontage width" value={formData.frontageWidth} onChange={handleNumericChange("frontageWidth")} />
      </Field>
      <Field label="Ceiling Height (ft)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter ceiling height" value={formData.ceilingHeight} onChange={handleNumericChange("ceilingHeight")} />
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
      <Field label="Parking Capacity">
        <input className={inp} type="text" inputMode="numeric" placeholder="Number of parking slots" value={formData.parkingCapacity} onChange={handleNumericChange("parkingCapacity")} />
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
      <Field label="Service Area">
        <div className="flex flex-wrap gap-1">
          {serviceAreaOptions.map(option => (
            <label key={option} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.serviceArea.includes(option)} onChange={() => toggleArrayItem("serviceArea", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Nearby Places">
        <div className="flex flex-wrap gap-1">
          {nearbyPlaceOptions.map(option => (
            <label key={option} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.nearbyPlaces.includes(option)} onChange={() => toggleArrayItem("nearbyPlaces", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Nearby Connectivity">
        <input className={inp} placeholder="Enter nearby connectivity details" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
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

  // STEP 5: Pricing & Amenities
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📄 Rental Details</h3>
      </div>
      <Field label="Monthly Rent (₹)" required error={errors.rentAmount}>
        <input className={`${inp} ${errors.rentAmount ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="Enter monthly rent amount" value={formData.rentAmount} onChange={(e) => updateForm("rentAmount", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Security Deposit (₹)" hint="Leave empty if not applicable">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter security deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Price Type" required error={errors.priceType}>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-priceType-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-priceType-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>
      <Field label="Maintenance (₹/month)">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter monthly maintenance" value={formData.maintenance} onChange={(e) => updateForm("maintenance", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
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
        <input className={`${inp} ${errors.accountHolderName ? errorBorder : ''}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={handleAlphaChange("accountHolderName")} />
      </Field>
      <Field label="Bank Name" required error={errors.bankName}>
        <select className={`${inp} ${errors.bankName ? errorBorder : ''}`} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </Field>
      <Field label="Account Number" required error={errors.accountNumber}>
        <input className={`${inp} ${errors.accountNumber ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter account number" value={formData.accountNumber} onChange={handleLimitedNumericChange("accountNumber", 18)} />
      </Field>
      <Field label="IFSC Code" required error={errors.ifscCode}>
        <input className={`${inp} ${errors.ifscCode ? errorBorder : ''}`} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={handleIfscChange("ifscCode")} />
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
        <h3 className="text-[11px] font-bold text-[#00695C]">Company Documents</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">All documents must be in PDF format (Max 5MB each)</p>

      <Field label="Company Logo" required hint="JPG, PNG max 2MB" error={errors.companyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.companyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-comp-logo-com" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert("Company logo must be less than 2MB");
                return;
              }
              updateForm("companyLogoDoc", file);
              if (errors.companyLogoDoc) {
                setErrors(prev => ({ ...prev, companyLogoDoc: null }));
              }
            }
          }} />
          <label htmlFor="m-comp-logo-com" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.companyLogoDoc && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.companyLogoDoc)} 
              alt="Company Logo" 
              className="w-16 h-16 object-cover rounded-lg border-2 border-[#00695C]"
            />
            <button 
              onClick={() => {
                updateForm("companyLogoDoc", null);
              }} 
              className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </Field>

      <Field label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-comp-brochure-com" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="m-comp-brochure-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochure</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyBrochure.name}</p>}
      </Field>

      <Field label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-project-brochures-com" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="m-project-brochures-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochures</span>
            <span className="text-[9px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[10px] text-green-600 mt-1">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </Field>

      <Field label="Authorized Signatory ID Proof" required error={errors.authIdProof}>
        <div className={`border-2 border-dashed ${errors.authIdProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-auth-id-com" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="m-auth-id-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload ID Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.authIdProof.name}</p>}
      </Field>

      <Field label="Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-com" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="m-office-proof-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProof.name}</p>}
      </Field>

      {/* Property Documents */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Documents</h3>
      </div>

      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className={`border-2 border-dashed ${errors.floorPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
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
        <div className={`border-2 border-dashed ${errors.rentalAgreement ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-rentalAgreement-com" onChange={(e) => handleDocumentUpload("rentalAgreement", e)} />
          <label htmlFor="m-rentalAgreement-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Rental Agreement</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.rentalAgreement && <p className="text-[10px] text-green-600 mt-1">✓ {formData.rentalAgreement.name}</p>}
      </Field>

      <Field label="Trade License" required error={errors.tradeLicense}>
        <div className={`border-2 border-dashed ${errors.tradeLicense ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-trade-com" onChange={(e) => handleDocumentUpload("tradeLicense", e)} />
          <label htmlFor="m-trade-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Trade License</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.tradeLicense && <p className="text-[10px] text-green-600 mt-1">✓ {formData.tradeLicense.name}</p>}
      </Field>

      <Field label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className={`border-2 border-dashed ${errors.fireSafetyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-fire-com" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="m-fire-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Fire Safety</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.fireSafetyCertificate.name}</p>}
      </Field>

      {/* Property Media */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-cover-com" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-com" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-com" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-com" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-com" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-com" className="cursor-pointer flex flex-col items-center">
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
      {errors.signature && <p className="text-[10px] text-red-500 mt-0.5">{errors.signature}</p>}
      <Field label="Date" required error={errors.signatureDate}>
        <input className={`${inp} ${errors.signatureDate ? errorBorder : ''}`} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${errors.signaturePlace ? errorBorder : ''}`} placeholder="Enter place" value={formData.signaturePlace} onChange={handleAlphaChange("signaturePlace")} />
      </Field>

      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAuthorized} onChange={() => updateForm("declarationAuthorized", !formData.declarationAuthorized)} />
          <span>I confirm that I am the authorized representative of the builder/company.</span>
        </label>
        {errors.declarationAuthorized && <p className="text-[10px] text-red-500 ml-5">{errors.declarationAuthorized}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[10px] text-red-500 ml-5">{errors.declarationAccurate}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationCompliance} onChange={() => updateForm("declarationCompliance", !formData.declarationCompliance)} />
          <span>I agree to comply with all applicable real estate laws and regulations.</span>
        </label>
        {errors.declarationCompliance && <p className="text-[10px] text-red-500 ml-5">{errors.declarationCompliance}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declarationTerms && <p className="text-[10px] text-red-500 ml-5">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}

// DESKTOP CONTENT - Rent Builder Commercial
function DtContentRentBuilderCom({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload,
  toggleAmenity, toggleCommercialAmenity,
  customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  commercialTypeOptions, businessTypeOptions,
  commercialRentAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  bankOptions, serviceAreaOptions, nearbyPlaceOptions
}) {
  const ta = `${inp} resize-y`;
  const signatureCanvasRef = useRef(null);

  // ==================== HANDLER FUNCTIONS ====================
  
  const handleAlphaChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    updateForm(field, value);
  };

  const handleNumericChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '');
    updateForm(field, value);
  };

  const handleLimitedNumericChange = (field, maxLength) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    updateForm(field, value);
  };

  const handleAlphaNumericChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    updateForm(field, value);
  };

  const handlePanChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    updateForm(field, value);
  };

  const handleIfscChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    updateForm(field, value);
  };

  const handleAddressChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, '');
    updateForm(field, value);
  };

  const handleCompanyNameChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s&.,-]/g, '');
    updateForm(field, value);
  };

  const handleReraChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    updateForm(field, value);
  };

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

  // STEP 0: Company Details (Desktop)
  if (step === 0) return (
    <>
      <FieldDt label="Builder / Company Name" required error={errors.companyName}>
        <input className={`${inp} ${errors.companyName ? errorBorder : ''}`} placeholder="Enter company name" value={formData.companyName} onChange={handleCompanyNameChange("companyName")} />
      </FieldDt>
      <FieldDt label="Company Registration Number" required error={errors.companyRegNumber}>
        <input className={`${inp} ${errors.companyRegNumber ? errorBorder : ''}`} placeholder="Enter registration number" value={formData.companyRegNumber} onChange={handleAlphaNumericChange("companyRegNumber")} />
      </FieldDt>
      <FieldDt label="RERA Registration Number" required error={errors.reraNumber}>
        <input className={`${inp} ${errors.reraNumber ? errorBorder : ''}`} placeholder="Enter RERA number" value={formData.reraNumber} onChange={handleReraChange("reraNumber")} />
      </FieldDt>
      <FieldDt label="GST Number">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Years of Experience" required error={errors.yearsOfExperience}>
        <input className={`${inp} ${errors.yearsOfExperience ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter years of experience" value={formData.yearsOfExperience} onChange={handleNumericChange("yearsOfExperience")} />
      </FieldDt>
      <FieldDt label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.companyWebsite} onChange={(e) => updateForm("companyWebsite", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Profile / About Us" required error={errors.companyProfile}>
        <textarea className={`${ta} min-h-[70px] ${errors.companyProfile ? errorBorder : ''}`} placeholder="Describe your company background" value={formData.companyProfile} onChange={(e) => updateForm("companyProfile", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 1: Authorized Person (Desktop)
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Person Details</h3>
      </div>
      <FieldDt label="Full Name" required error={errors.authFullName}>
        <input className={`${inp} ${errors.authFullName ? errorBorder : ''}`} placeholder="Enter authorized person's full name" value={formData.authFullName} onChange={handleAlphaChange("authFullName")} />
      </FieldDt>
      <FieldDt label="Designation" required error={errors.authDesignation}>
        <input className={`${inp} ${errors.authDesignation ? errorBorder : ''}`} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={handleAlphaChange("authDesignation")} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.authMobile}>
        <input className={`${inp} ${errors.authMobile ? errorBorder : ''}`} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={handleLimitedNumericChange("authMobile", 10)} />
      </FieldDt>
      <FieldDt label="Email Address" required error={errors.authEmail}>
        <input className={`${inp} ${errors.authEmail ? errorBorder : ''}`} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </FieldDt>
      <FieldDt label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={handleLimitedNumericChange("authWhatsapp", 10)} />
      </FieldDt>
      <FieldDt label="Profile Photo" required hint="JPG, PNG max 2MB" error={errors.authPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-authphoto-com" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert("Profile photo must be less than 2MB");
                return;
              }
              updateForm("authPhoto", file);
              if (errors.authPhoto) {
                setErrors(prev => ({ ...prev, authPhoto: null }));
              }
            }
          }} />
          <label htmlFor="dt-authphoto-com" className="cursor-pointer flex flex-col items-center">
            <User className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Photo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.authPhoto && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.authPhoto)} 
              alt="Profile" 
              className="w-20 h-20 object-cover rounded-full border-2 border-[#00695C]"
            />
            <button 
              onClick={() => {
                updateForm("authPhoto", null);
              }} 
              className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </FieldDt>
    </>
  );

  // STEP 2: Office Address (Desktop)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Office Address</h3>
      </div>
      <FieldDt label="Office Address" required error={errors.officeAddress}>
        <textarea className={`${ta} min-h-[70px] ${errors.officeAddress ? errorBorder : ''}`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={handleAddressChange("officeAddress")} />
      </FieldDt>
      <FieldDt label="City" required error={errors.officeCity}>
        <input className={`${inp} ${errors.officeCity ? errorBorder : ''}`} placeholder="Enter city" value={formData.officeCity} onChange={handleAlphaChange("officeCity")} />
      </FieldDt>
      <FieldDt label="District" required error={errors.officeDistrict}>
        <input className={`${inp} ${errors.officeDistrict ? errorBorder : ''}`} placeholder="Enter district" value={formData.officeDistrict} onChange={handleAlphaChange("officeDistrict")} />
      </FieldDt>
      <FieldDt label="State" required error={errors.officeState}>
        <input className={`${inp} ${errors.officeState ? errorBorder : ''}`} placeholder="Enter state" value={formData.officeState} onChange={handleAlphaChange("officeState")} />
      </FieldDt>
      <FieldDt label="PIN Code" required error={errors.officePinCode}>
        <input className={`${inp} ${errors.officePinCode ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={handleLimitedNumericChange("officePinCode", 6)} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Enter nearby landmark" value={formData.officeLandmark} onChange={(e) => updateForm("officeLandmark", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 3: Identity & Business Verification (Desktop)
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Identity & Business Verification</h3>
      </div>
      <FieldDt label="Aadhaar Number" required error={errors.aadhaarNumber}>
        <input className={`${inp} ${errors.aadhaarNumber ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={handleLimitedNumericChange("aadhaarNumber", 12)} />
      </FieldDt>
      <FieldDt label="PAN Number" required error={errors.panNumber}>
        <input className={`${inp} ${errors.panNumber ? errorBorder : ''}`} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={handlePanChange("panNumber")} />
      </FieldDt>

      <FieldDt label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className={`border-2 border-dashed ${errors.aadhaarCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-authaadhaar-com" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-authaadhaar-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-authpan-com" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-authpan-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company Registration Certificate" required error={errors.companyRegCert}>
        <div className={`border-2 border-dashed ${errors.companyRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-companyreg-com" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="dt-companyreg-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gstcert-com" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="dt-gstcert-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload RERA Certificate" required error={errors.reraCert}>
        <div className={`border-2 border-dashed ${errors.reraCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-reracert-com" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="dt-reracert-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-companypan-com" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="dt-companypan-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company PAN</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyPanCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyPanCard.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 4: Property Details (Desktop)
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Commercial Property Details</h3>
      </div>
      <FieldDt label="Property Title / Name" required error={errors.propertyTitle}>
        <input className={`${inp} ${errors.propertyTitle ? errorBorder : ''}`} placeholder="e.g. Prime Retail Space, Office Complex" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} />
      </FieldDt>
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
      <FieldDt label="Property Address" required error={errors.propertyAddress}>
        <textarea className={`${ta} min-h-[70px] ${errors.propertyAddress ? errorBorder : ''}`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={handleAddressChange("propertyAddress")} />
      </FieldDt>
      <FieldDt label="Property City" required error={errors.propertyCity}>
        <input className={`${inp} ${errors.propertyCity ? errorBorder : ''}`} placeholder="Enter property city name" value={formData.propertyCity} onChange={handleAlphaChange("propertyCity")} />
      </FieldDt>
      <FieldDt label="Built-up Area (sq.ft)" hint="Enter total built-up area">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Carpet Area (sq.ft)" hint="Enter carpet area">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Floor Number">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter floor number" value={formData.floorNumber} onChange={handleNumericChange("floorNumber")} />
      </FieldDt>
      <FieldDt label="Total Floors">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter total floors" value={formData.totalFloors} onChange={handleNumericChange("totalFloors")} />
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
      <FieldDt label="Property Age (years)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter property age in years" value={formData.propertyAge} onChange={handleNumericChange("propertyAge")} />
      </FieldDt>
      <FieldDt label="Frontage Width (ft)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter frontage width" value={formData.frontageWidth} onChange={handleNumericChange("frontageWidth")} />
      </FieldDt>
      <FieldDt label="Ceiling Height (ft)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter ceiling height" value={formData.ceilingHeight} onChange={handleNumericChange("ceilingHeight")} />
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
      <FieldDt label="Parking Capacity">
        <input className={inp} type="text" inputMode="numeric" placeholder="Number of parking slots" value={formData.parkingCapacity} onChange={handleNumericChange("parkingCapacity")} />
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
      <FieldDt label="Service Area">
        <div className="flex flex-wrap gap-2">
          {serviceAreaOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.serviceArea.includes(option)} onChange={() => toggleArrayItem("serviceArea", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Nearby Places">
        <div className="flex flex-wrap gap-2">
          {nearbyPlaceOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.nearbyPlaces.includes(option)} onChange={() => toggleArrayItem("nearbyPlaces", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Nearby Connectivity">
        <input className={inp} placeholder="Enter nearby connectivity details" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
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

  // STEP 5: Pricing & Amenities (Desktop)
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📄 Rental Details</h3>
      </div>
      <FieldDt label="Monthly Rent (₹)" required error={errors.rentAmount}>
        <input className={`${inp} ${errors.rentAmount ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="Enter monthly rent amount" value={formData.rentAmount} onChange={(e) => updateForm("rentAmount", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Security Deposit (₹)" hint="Leave empty if not applicable">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter security deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Price Type" required error={errors.priceType}>
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType-com" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges (₹/month)">
        <input className={inp} type="text" inputMode="decimal" placeholder="Enter monthly maintenance amount" value={formData.maintenance} onChange={(e) => updateForm("maintenance", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
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
          <input className={inp} placeholder="e.g., Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
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
    </>
  );

  // STEP 6: Bank Details (Desktop)
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <FieldDt label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={`${inp} ${errors.accountHolderName ? errorBorder : ''}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={handleAlphaChange("accountHolderName")} />
      </FieldDt>
      <FieldDt label="Bank Name" required error={errors.bankName}>
        <select className={`${inp} ${errors.bankName ? errorBorder : ''}`} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </FieldDt>
      <FieldDt label="Account Number" required error={errors.accountNumber}>
        <input className={`${inp} ${errors.accountNumber ? errorBorder : ''}`} type="text" inputMode="numeric" placeholder="Enter account number" value={formData.accountNumber} onChange={handleLimitedNumericChange("accountNumber", 18)} />
      </FieldDt>
      <FieldDt label="IFSC Code" required error={errors.ifscCode}>
        <input className={`${inp} ${errors.ifscCode ? errorBorder : ''}`} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={handleIfscChange("ifscCode")} />
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

  // STEP 8: Documents (Desktop)
  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Company Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>

      <FieldDt label="Company Logo" required hint="JPG, PNG max 2MB" error={errors.companyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.companyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-comp-logo-com" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 2 * 1024 * 1024) {
                alert("Company logo must be less than 2MB");
                return;
              }
              updateForm("companyLogoDoc", file);
              if (errors.companyLogoDoc) {
                setErrors(prev => ({ ...prev, companyLogoDoc: null }));
              }
            }
          }} />
          <label htmlFor="dt-comp-logo-com" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.companyLogoDoc && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.companyLogoDoc)} 
              alt="Company Logo" 
              className="w-20 h-20 object-cover rounded-lg border-2 border-[#00695C]"
            />
            <button 
              onClick={() => {
                updateForm("companyLogoDoc", null);
              }} 
              className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-brochure-com" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="dt-comp-brochure-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Profile Brochure</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyBrochure.name}</p>}
      </FieldDt>

      <FieldDt label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-project-brochures-com" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="dt-project-brochures-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Project Brochures</span>
            <span className="text-[11px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[13px] text-green-600 mt-2">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </FieldDt>

      <FieldDt label="Authorized Signatory ID Proof" required error={errors.authIdProof}>
        <div className={`border-2 border-dashed ${errors.authIdProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-auth-id-com" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="dt-auth-id-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload ID Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.authIdProof.name}</p>}
      </FieldDt>

      <FieldDt label="Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-com" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="dt-office-proof-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProof.name}</p>}
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Documents</h3>
      </div>

      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className={`border-2 border-dashed ${errors.floorPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-com" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-com" className="cursor-pointer flex flex-col items-center">
            <Home className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Floor Plan</span>
            <span className="text-[11px] text-gray-400">PDF only</span>
          </label>
        </div>
        {floorPlanPreview && (
          <div className="mt-2 relative">
            <p className="text-[13px] text-green-600">✓ {formData.floorPlan?.name}</p>
            <button onClick={removeFloorPlan} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Rental Agreement" required error={errors.rentalAgreement}>
        <div className={`border-2 border-dashed ${errors.rentalAgreement ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-rentalAgreement-com" onChange={(e) => handleDocumentUpload("rentalAgreement", e)} />
          <label htmlFor="dt-rentalAgreement-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Rental Agreement</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.rentalAgreement && <p className="text-[13px] text-green-600 mt-2">✓ {formData.rentalAgreement.name}</p>}
      </FieldDt>

      <FieldDt label="Trade License" required error={errors.tradeLicense}>
        <div className={`border-2 border-dashed ${errors.tradeLicense ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-trade-com" onChange={(e) => handleDocumentUpload("tradeLicense", e)} />
          <label htmlFor="dt-trade-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Trade License</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.tradeLicense && <p className="text-[13px] text-green-600 mt-2">✓ {formData.tradeLicense.name}</p>}
      </FieldDt>

      <FieldDt label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className={`border-2 border-dashed ${errors.fireSafetyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-fire-com" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="dt-fire-com" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Fire Safety</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.fireSafetyCertificate.name}</p>}
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-cover-com" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-com" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-com" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-com" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-com" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-com" className="cursor-pointer flex flex-col items-center">
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
    </>
  );

  // STEP 9: Declaration (Desktop)
  if (step === 9) return (
    <>
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-4 h-4" /> Authorized Signatory <span className="text-red-500">*</span>
      </label>
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
      {errors.signature && <p className="text-[12px] text-red-500 mt-1">{errors.signature}</p>}
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={`${inp} ${errors.signatureDate ? errorBorder : ''}`} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${errors.signaturePlace ? errorBorder : ''}`} placeholder="Enter place" value={formData.signaturePlace} onChange={handleAlphaChange("signaturePlace")} />
      </FieldDt>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAuthorized} onChange={() => updateForm("declarationAuthorized", !formData.declarationAuthorized)} />
          <span>I confirm that I am the authorized representative of the builder/company.</span>
        </label>
        {errors.declarationAuthorized && <p className="text-[12px] text-red-500 ml-6">{errors.declarationAuthorized}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[12px] text-red-500 ml-6">{errors.declarationAccurate}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationCompliance} onChange={() => updateForm("declarationCompliance", !formData.declarationCompliance)} />
          <span>I agree to comply with all applicable real estate laws and regulations.</span>
        </label>
        {errors.declarationCompliance && <p className="text-[12px] text-red-500 ml-6">{errors.declarationCompliance}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declarationTerms && <p className="text-[12px] text-red-500 ml-6">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}