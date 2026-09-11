import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ImagePlus, Video, X, FileText, User, Home, PenTool, Building } from "lucide-react";
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

const steps = ["Company Details", "Authorized Person", "Office Address", "Identity & Business Verification", "Land Details", "Pricing & Amenities", "Bank Details", "Social Media", "Documents", "Declaration"];
const subtitles = [
  "Enter company/builder information",
  "Authorized representative details",
  "Office address information",
  "Verify business identity",
  "Tell us about your land",
  "Set pricing & select amenities",
  "Bank account details",
  "Social media & online presence",
  "Upload company documents",
  "Confirm & submit"
];

// Field Component with error support
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
const errorBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

const landTypes = [
  "Residential Plot", "DTCP & CMDA Approved Plot", "Gated Community Plot", "Villa Plot",
  "Farm House Plot", "Common Plot", "Independent House Plot", "Duplex House Plot", "Row House Plot",
  "Commercial Plot", "Office Space Land", "Retail Shop Plot", "Showroom Plot",
  "Shopping Complex Land", "Hotel / Resort Land", "Petrol Bunk Plot", "IT Park Land", "Warehouse Land",
  "Industrial Commercial Plot", "Agricultural Land", "Farm Land", "Organic Farming Land",
  "Coconut Farm Land", "Mango Grove Land", "Tea / Coffee Estate", "Poultry Farm Land",
  "Dairy Farm Land", "Fisheries / Aquaculture Land", "Industrial Plot", "Factory Land",
  "Manufacturing Unit Plot", "Logistics Hub Land", "Warehouse Plot", "Cold Storage Land", "SEZ Land",
  "Residential + Commercial Plot", "Commercial + Industrial Land", "Township Development Land",
  "Multi-purpose Development Land", "School / College Land", "Hospital / Clinic Land",
  "Training Institute Plot", "Religious Institution Land", "Highway Facing Plot",
  "Lake View Plot", "Hill View Plot", "Beach Side Plot", "River Side Land",
  "Eco Tourism Land", "Layout Development Land", "Future Investment Plot"
];

const landCategories = [
  "Residential Land / Plots", "Commercial Land / Plots", "Agricultural Land / Plots",
  "Industrial Land", "Mixed-Use Land", "Institutional Land", "Investment & Special Purpose Land"
];

const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const shapeOptions = ["Rectangular", "Square", "Triangular", "Irregular"];
const waterSourceOptions = ["Borewell", "Municipal Water", "River", "Lake", "Pond", "Canal", "Rainwater Harvesting", "Other"];
const soilTypeOptions = ["Red Soil", "Black Soil", "Alluvial Soil", "Sandy Soil", "Clay Soil", "Loamy Soil", "Laterite Soil", "Other"];
const landFeatures = [
  "Irrigation Facility", "Soil Testing Report", "Water Source Available", "Electricity Available",
  "Road Access", "Farm Equipment Included", "Storage Shed Available", "Organic Certified",
  "Greenhouse Facility", "Drip Irrigation System", "Well Water Available", "River Access",
  "Boundary Wall", "Approved Layout", "Clear Title Deed", "No Encumbrance"
];
const yesNoOptions = ["Yes", "No"];
const occupancyOptions = ["Single", "Family", "Bachelors", "Company Lease"];
const leaseDurationOptions = ["1 Year", "2 Years", "3 Years", "4+ Years"];
const bankOptions = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"];

export default function LeaseBuilderLPForm({ isOpen, onClose }) {
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
    
    // Land Details (Step 4)
    landTitle: "", landType: "", landCategory: "", landAddress: "", landCity: "",
    landArea: "", landAreaMin: "", landAreaMax: "", areaUnit: "sqft",
    landFacing: "", landShape: "", roadWidth: "", waterSource: "", soilType: "",
    electricityAvailable: "", selectedFeatures: [], otherFeatures: "",
    
    // Pricing & Amenities (Step 5)
    expectedPrice: "", budgetRange: { min: "", max: "" }, priceType: "fixed",
    maintenance: "", availableFrom: "",
    securityDeposit: "", leaseDuration: "", occupancyDetails: [],
    petFriendly: "", gardenSpace: "", terrace: "",
    
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    
    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Documents (Step 8)
    companyLogoDoc: null, companyBrochure: null, projectBrochures: [], companyRegCertDoc: null, reraCertDoc: null, gstCertDoc: null, panCardDoc: null, authIdProof: null, officeAddressProof: null,
    propertyImages: [], propertyVideo: null, coverImage: null, floorPlan: null,
    
    // Declaration (Step 9)
    declarationAuthorized: false,
    declarationAccurate: false,
    declarationCompliance: false,
    declarationTerms: false,
    signature: null, signatureDate: "", signaturePlace: ""
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [authPhotoPreview, setAuthPhotoPreview] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [customFeaturesList, setCustomFeaturesList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  const [allSignaturePoints, setAllSignaturePoints] = useState([]);
  const [activeCanvas, setActiveCanvas] = useState(null);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
        setErrors(prev => {
          const next = { ...prev };
          delete next.authPhoto;
          return next;
        });
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
      updateForm("companyLogoDoc", file);
      if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
      setCompanyLogoPreview(URL.createObjectURL(file));
      if (errors.companyLogoDoc) {
        setErrors(prev => {
          const next = { ...prev };
          delete next.companyLogoDoc;
          return next;
        });
      }
    }
  };

  const removeCompanyLogo = () => {
    if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
    updateForm("companyLogoDoc", null);
    setCompanyLogoPreview(null);
  };

  const toggleFeature = (feature) => {
    const current = formData.selectedFeatures;
    if (current.includes(feature)) {
      updateForm("selectedFeatures", current.filter(f => f !== feature));
    } else {
      updateForm("selectedFeatures", [...current, feature]);
    }
  };

  const toggleOccupancy = (occupancy) => {
    const current = formData.occupancyDetails;
    if (current.includes(occupancy)) {
      updateForm("occupancyDetails", current.filter(o => o !== occupancy));
    } else {
      updateForm("occupancyDetails", [...current, occupancy]);
    }
  };

  const addCustomFeature = () => {
    const newFeature = formData.otherFeatures.trim();
    if (newFeature && !formData.selectedFeatures.includes(newFeature) && !customFeaturesList.includes(newFeature)) {
      setCustomFeaturesList([...customFeaturesList, newFeature]);
      updateForm("selectedFeatures", [...formData.selectedFeatures, newFeature]);
      updateForm("otherFeatures", "");
    }
  };

  const removeCustomFeature = (feature) => {
    setCustomFeaturesList(customFeaturesList.filter(f => f !== feature));
    updateForm("selectedFeatures", formData.selectedFeatures.filter(f => f !== feature));
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

  // ==================== VALIDATION FUNCTIONS ====================

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      // Company Name
      if (!formData.companyName.trim()) {
        e.companyName = "Company name is required";
      } else if (!/^[a-zA-Z0-9\s&.,-]+$/.test(formData.companyName)) {
        e.companyName = "Company name contains invalid characters";
      }
      
      if (!formData.companyRegNumber.trim()) {
        e.companyRegNumber = "Company registration number is required";
      } else if (!/^[a-zA-Z0-9\s-]+$/.test(formData.companyRegNumber)) {
        e.companyRegNumber = "Registration number contains invalid characters";
      }
      
      if (!formData.reraNumber.trim()) {
        e.reraNumber = "RERA registration number is required";
      } else if (!/^[A-Z0-9-]+$/.test(formData.reraNumber)) {
        e.reraNumber = "RERA number contains invalid characters";
      }
      
      if (!formData.yearsOfExperience) {
        e.yearsOfExperience = "Years of experience is required";
      } else if (parseFloat(formData.yearsOfExperience) < 0) {
        e.yearsOfExperience = "Years of experience cannot be negative";
      } else if (!/^\d+(\.\d+)?$/.test(formData.yearsOfExperience)) {
        e.yearsOfExperience = "Enter a valid number";
      }
      
      if (!formData.companyProfile.trim()) e.companyProfile = "Company profile is required";
    }
    if (s === 1) {
      if (!formData.authFullName.trim()) {
        e.authFullName = "Authorized person's full name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.authFullName)) {
        e.authFullName = "Name can only contain letters and spaces";
      }
      
      if (!formData.authDesignation.trim()) {
        e.authDesignation = "Designation is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.authDesignation)) {
        e.authDesignation = "Designation can only contain letters and spaces";
      }
      
      if (!formData.authMobile || formData.authMobile.length !== 10) {
        e.authMobile = "Enter a valid 10-digit mobile number";
      } else if (!/^[0-9]{10}$/.test(formData.authMobile)) {
        e.authMobile = "Mobile number must contain only digits";
      }
      
      if (!formData.authEmail || !isValidEmail(formData.authEmail)) {
        e.authEmail = "Enter a valid email address";
      }
      if (!formData.authPhoto) e.authPhoto = "Profile photo is required";
    }
    if (s === 2) {
      if (!formData.officeAddress.trim()) {
        e.officeAddress = "Office address is required";
      } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.officeAddress)) {
        e.officeAddress = "Address contains invalid characters";
      }
      
      if (!formData.officeCity.trim()) {
        e.officeCity = "City is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.officeCity)) {
        e.officeCity = "City can only contain letters and spaces";
      }
      
      if (!formData.officeDistrict.trim()) {
        e.officeDistrict = "District is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.officeDistrict)) {
        e.officeDistrict = "District can only contain letters and spaces";
      }
      
      if (!formData.officeState.trim()) {
        e.officeState = "State is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.officeState)) {
        e.officeState = "State can only contain letters and spaces";
      }
      
      if (!formData.officePinCode || formData.officePinCode.length !== 6) {
        e.officePinCode = "Enter a valid 6-digit PIN code";
      } else if (!/^[0-9]{6}$/.test(formData.officePinCode)) {
        e.officePinCode = "PIN code must contain only digits";
      }
    }
    if (s === 3) {
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        e.aadhaarNumber = "Enter a valid 12-digit Aadhaar number";
      } else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
        e.aadhaarNumber = "Aadhaar number must contain only digits";
      }
      if (!formData.panNumber || formData.panNumber.length !== 10) {
        e.panNumber = "Enter a valid 10-character PAN number";
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        e.panNumber = "Enter a valid PAN number format";
      }
      if (!formData.aadhaarCard) e.aadhaarCard = "Aadhaar card is required";
      if (!formData.panCard) e.panCard = "PAN card is required";
      if (!formData.companyRegCert) e.companyRegCert = "Company registration certificate is required";
      if (!formData.reraCert) e.reraCert = "RERA certificate is required";
    }
    if (s === 4) {
      if (!formData.landTitle.trim()) {
        e.landTitle = "Land title is required";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.landTitle)) {
        e.landTitle = "Land title contains invalid characters";
      }
      
      if (!formData.landType) e.landType = "Please select a land type";
      if (!formData.landCategory) e.landCategory = "Please select a land category";
      
      if (!formData.landAddress.trim()) {
        e.landAddress = "Land address is required";
      } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.landAddress)) {
        e.landAddress = "Address contains invalid characters";
      }
      
      if (!formData.landCity.trim()) {
        e.landCity = "Land city is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.landCity)) {
        e.landCity = "City can only contain letters and spaces";
      }
      
      if (!formData.landArea) {
        e.landArea = "Land area is required";
      } else if (!/^\d+(\.\d+)?$/.test(formData.landArea)) {
        e.landArea = "Enter a valid number";
      }
    }
    if (s === 5) {
      if (!formData.expectedPrice) {
        e.expectedPrice = "Expected lease amount is required";
      } else if (!/^\d+(\.\d+)?$/.test(formData.expectedPrice)) {
        e.expectedPrice = "Enter a valid number";
      }
      
      if (!formData.securityDeposit) {
        e.securityDeposit = "Security deposit is required";
      } else if (!/^\d+(\.\d+)?$/.test(formData.securityDeposit)) {
        e.securityDeposit = "Enter a valid number";
      }
    }
    if (s === 6) {
      if (!formData.accountHolderName.trim()) {
        e.accountHolderName = "Account holder name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.accountHolderName)) {
        e.accountHolderName = "Account holder name can only contain letters and spaces";
      }
      
      if (!formData.accountNumber) {
        e.accountNumber = "Account number is required";
      } else if (!/^[0-9]{9,18}$/.test(formData.accountNumber)) {
        e.accountNumber = "Account number must be between 9-18 digits";
      }
      
      if (!formData.ifscCode.trim()) {
        e.ifscCode = "IFSC code is required";
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        e.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
      }
      if (!formData.bankName) e.bankName = "Bank name is required";
    }
    if (s === 7) {
      // No required fields in social media step
    }
    if (s === 8) {
      if (!formData.companyLogoDoc) e.companyLogoDoc = "Company logo is required";
      if (!formData.authIdProof) e.authIdProof = "Authorized signatory ID proof is required";
      if (!formData.officeAddressProof) e.officeAddressProof = "Office address proof is required";
      if (!formData.coverImage) e.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) e.propertyImages = "At least one land photo is required";
      if (!formData.floorPlan) e.floorPlan = "Floor plan is required";
    }
    if (s === 9) {
      if (!formData.signature) e.signature = "Please draw your signature";
      if (!formData.signatureDate) e.signatureDate = "Date is required";
      
      if (!formData.signaturePlace.trim()) {
        e.signaturePlace = "Place is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.signaturePlace)) {
        e.signaturePlace = "Place can only contain letters and spaces";
      }
      
      if (!formData.declarationAuthorized) e.declarationAuthorized = "You must confirm this to proceed";
      if (!formData.declarationAccurate) e.declarationAccurate = "You must confirm this to proceed";
      if (!formData.declarationCompliance) e.declarationCompliance = "You must confirm this to proceed";
      if (!formData.declarationTerms) e.declarationTerms = "You must agree to proceed";
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
            <div className="text-xl mb-0.5 relative z-10">🏞️</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Land - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List your land for lease</p>
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
            <MobContentLeaseBuilderLP
              step={step}
              inp={inMob}
              errorBorder={errorBorder}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleFeature={toggleFeature}
              toggleOccupancy={toggleOccupancy}
              addCustomFeature={addCustomFeature}
              removeCustomFeature={removeCustomFeature}
              landTypes={landTypes}
              landCategories={landCategories}
              facingOptions={facingOptions}
              shapeOptions={shapeOptions}
              waterSourceOptions={waterSourceOptions}
              soilTypeOptions={soilTypeOptions}
              landFeatures={landFeatures}
              yesNoOptions={yesNoOptions}
              occupancyOptions={occupancyOptions}
              leaseDurationOptions={leaseDurationOptions}
              bankOptions={bankOptions}
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
              errors={errors}
              customFeaturesList={customFeaturesList}
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
            <div className="text-xl mb-0.5 relative z-10">🏞️</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Land - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List your land for lease</p>
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
            <DtContentLeaseBuilderLP
              step={step}
              inp={inDt}
              errorBorder={errorBorder}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleFeature={toggleFeature}
              toggleOccupancy={toggleOccupancy}
              addCustomFeature={addCustomFeature}
              removeCustomFeature={removeCustomFeature}
              landTypes={landTypes}
              landCategories={landCategories}
              facingOptions={facingOptions}
              shapeOptions={shapeOptions}
              waterSourceOptions={waterSourceOptions}
              soilTypeOptions={soilTypeOptions}
              landFeatures={landFeatures}
              yesNoOptions={yesNoOptions}
              occupancyOptions={occupancyOptions}
              leaseDurationOptions={leaseDurationOptions}
              bankOptions={bankOptions}
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
              errors={errors}
              customFeaturesList={customFeaturesList}
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

// ==================== MOBILE CONTENT ====================
function MobContentLeaseBuilderLP({ 
  step, inp, errorBorder, formData, updateForm, 
  imagePreviews, handleImageUpload, removeImage, 
  handleVideoUpload, videoPreview, removeVideo, 
  handleDocumentUpload, toggleFeature, toggleOccupancy,
  addCustomFeature, removeCustomFeature,
  landTypes, landCategories, facingOptions, shapeOptions,
  waterSourceOptions, soilTypeOptions, landFeatures,
  yesNoOptions, occupancyOptions, leaseDurationOptions,
  bankOptions, handleCoverImageUpload, handleFloorPlanUpload, 
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, 
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature, 
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  errors, customFeaturesList
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
      <Field label="Profile Photo" required error={errors.authPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-authphoto-llp" onChange={handleAuthPhotoUpload} />
          <label htmlFor="m-authphoto-llp" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="m-authaadhaar-llp" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-authaadhaar-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>

      <Field label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-authpan-llp" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-authpan-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>

      <Field label="Upload Company Registration Certificate" required error={errors.companyRegCert}>
        <div className={`border-2 border-dashed ${errors.companyRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-companyreg-llp" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="m-companyreg-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCert.name}</p>}
      </Field>

      <Field label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gstcert-llp" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="m-gstcert-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCert.name}</p>}
      </Field>

      <Field label="Upload RERA Certificate" required error={errors.reraCert}>
        <div className={`border-2 border-dashed ${errors.reraCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-reracert-llp" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="m-reracert-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCert.name}</p>}
      </Field>

      <Field label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-companypan-llp" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="m-companypan-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Company PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyPanCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyPanCard.name}</p>}
      </Field>
    </>
  );

  // STEP 4: Land Details
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Land Details</h3>
      </div>
      <Field label="Land Title / Name" required error={errors.landTitle}>
        <input className={`${inp} ${errors.landTitle ? errorBorder : ''}`} placeholder="e.g. Green Valley Plot 123" value={formData.landTitle} onChange={(e) => updateForm("landTitle", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} />
      </Field>
      <Field label="Land Category" required error={errors.landCategory}>
        <select className={`${inp} ${errors.landCategory ? errorBorder : ''}`} value={formData.landCategory} onChange={(e) => updateForm("landCategory", e.target.value)}>
          <option value="">Select Land Category</option>
          {landCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </Field>
      <Field label="Land Type" required error={errors.landType}>
        <select className={`${inp} ${errors.landType ? errorBorder : ''}`} value={formData.landType} onChange={(e) => updateForm("landType", e.target.value)}>
          <option value="">Select Land Type</option>
          {landTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </Field>
      <Field label="Land Address" required error={errors.landAddress}>
        <textarea className={`${ta} min-h-[55px] ${errors.landAddress ? errorBorder : ''}`} placeholder="Enter complete land address" value={formData.landAddress} onChange={handleAddressChange("landAddress")} />
      </Field>
      <Field label="Land City" required error={errors.landCity}>
        <input className={`${inp} ${errors.landCity ? errorBorder : ''}`} placeholder="Enter land city name" value={formData.landCity} onChange={handleAlphaChange("landCity")} />
      </Field>
      <Field label="Land Area" required hint="Enter area in sq ft or acres" error={errors.landArea}>
        <div className="grid grid-cols-2 gap-1.5">
          <input className={`${inp} ${errors.landArea ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="Area" value={formData.landArea} onChange={(e) => updateForm("landArea", e.target.value.replace(/[^0-9.]/g, ''))} />
          <select className={inp} value={formData.areaUnit} onChange={(e) => updateForm("areaUnit", e.target.value)}>
            <option value="sqft">Sq. Ft.</option>
            <option value="acres">Acres</option>
          </select>
        </div>
      </Field>
      <Field label="Area Range (Min - Max)">
        <div className="grid grid-cols-2 gap-1.5">
          <input className={inp} type="text" inputMode="decimal" placeholder="Min Area" value={formData.landAreaMin} onChange={(e) => updateForm("landAreaMin", e.target.value.replace(/[^0-9.]/g, ''))} />
          <input className={inp} type="text" inputMode="decimal" placeholder="Max Area" value={formData.landAreaMax} onChange={(e) => updateForm("landAreaMax", e.target.value.replace(/[^0-9.]/g, ''))} />
        </div>
      </Field>
      <Field label="Land Facing">
        <select className={inp} value={formData.landFacing} onChange={(e) => updateForm("landFacing", e.target.value)}>
          <option value="">Select Facing</option>
          {facingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </Field>
      <Field label="Land Shape">
        <select className={inp} value={formData.landShape} onChange={(e) => updateForm("landShape", e.target.value)}>
          <option value="">Select Shape</option>
          {shapeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </Field>
      <Field label="Road Width (ft)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter road width in feet" value={formData.roadWidth} onChange={handleNumericChange("roadWidth")} />
      </Field>
      <Field label="Water Source">
        <select className={inp} value={formData.waterSource} onChange={(e) => updateForm("waterSource", e.target.value)}>
          <option value="">Select Water Source</option>
          {waterSourceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </Field>
      <Field label="Soil Type">
        <select className={inp} value={formData.soilType} onChange={(e) => updateForm("soilType", e.target.value)}>
          <option value="">Select Soil Type</option>
          {soilTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </Field>
      <Field label="Electricity Available">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-electricity-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.electricityAvailable === opt} onChange={() => updateForm("electricityAvailable", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Lease Preferences</h3>
      </div>
      <Field label="Lease Duration">
        {leaseDurationOptions.map(d => (
          <label key={d} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-duration-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
            {d}
          </label>
        ))}
      </Field>
      <Field label="Occupancy Details">
        <div className="flex flex-wrap gap-3">
          {occupancyOptions.map(occ => (
            <label key={occ} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyDetails.includes(occ)} onChange={() => toggleOccupancy(occ)} />
              {occ}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Pet Friendly">
        <div className="flex gap-2">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-pet-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  // STEP 5: Pricing & Amenities
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      <Field label="Expected Lease (₹/month)" required error={errors.expectedPrice}>
        <input className={`${inp} ${errors.expectedPrice ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="e.g. 20,000" value={formData.expectedPrice} onChange={(e) => updateForm("expectedPrice", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Budget Range (₹/month)">
        <div className="flex gap-1">
          <input className={inp} type="text" inputMode="decimal" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9.]/g, '') })} />
          <input className={inp} type="text" inputMode="decimal" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9.]/g, '') })} />
        </div>
      </Field>
      <Field label="Security Deposit (₹)" required error={errors.securityDeposit}>
        <input className={`${inp} ${errors.securityDeposit ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="e.g. 50,000" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", e.target.value.replace(/[^0-9.]/g, ''))} />
      </Field>
      <Field label="Price Type">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
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
      <Field label="Land Features">
        <div className="flex flex-wrap gap-1 mt-0.5">
          {landFeatures.map(f => (
            <span key={f} onClick={() => toggleFeature(f)} className={`px-1.5 py-0.5 text-[10px] rounded-full border cursor-pointer transition-all ${formData.selectedFeatures.includes(f) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
              {f}
            </span>
          ))}
          {customFeaturesList.map(f => (
            <span key={f} className="px-1.5 py-0.5 text-[10px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {f}
              <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomFeature(f)} />
            </span>
          ))}
        </div>
      </Field>
      <Field label="Other Features">
        <div className="flex gap-1">
          <input className={`${inp} flex-1`} placeholder="e.g. Clubhouse, CCTV..." value={formData.otherFeatures} onChange={(e) => updateForm("otherFeatures", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()} />
          <button onClick={addCustomFeature} className="px-2 py-1 text-[11px] bg-[#00695C] text-white rounded-lg">Add</button>
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
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
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

      <Field label="Company Logo" required error={errors.companyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.companyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-comp-logo-llp" onChange={handleCompanyLogoUpload} />
          <label htmlFor="m-comp-logo-llp" className="cursor-pointer flex flex-col items-center">
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

      <Field label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-comp-brochure-llp" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="m-comp-brochure-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochure</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyBrochure.name}</p>}
      </Field>

      <Field label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-project-brochures-llp" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="m-project-brochures-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochures</span>
            <span className="text-[9px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[10px] text-green-600 mt-1">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </Field>

      <Field label="Company Registration Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-comp-reg-doc-llp" onChange={(e) => handleDocumentUpload("companyRegCertDoc", e)} />
          <label htmlFor="m-comp-reg-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCertDoc.name}</p>}
      </Field>

      <Field label="RERA Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-rera-doc-llp" onChange={(e) => handleDocumentUpload("reraCertDoc", e)} />
          <label htmlFor="m-rera-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCertDoc.name}</p>}
      </Field>

      <Field label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gst-doc-llp" onChange={(e) => handleDocumentUpload("gstCertDoc", e)} />
          <label htmlFor="m-gst-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCertDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-doc-llp" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="Authorized Signatory ID Proof" required error={errors.authIdProof}>
        <div className={`border-2 border-dashed ${errors.authIdProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-auth-id-llp" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="m-auth-id-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload ID Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.authIdProof.name}</p>}
      </Field>

      <Field label="Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-llp" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="m-office-proof-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProof.name}</p>}
      </Field>

      {/* Media Upload for Land */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Land Media</h3>
      </div>
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-cover-llp-build" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-llp-build" className="cursor-pointer flex flex-col items-center">
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

      <Field label="Upload Land Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className={`border-2 border-dashed ${errors.propertyImages ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-llp-build" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-llp-build" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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

      <Field label="Upload Land Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-llp-build" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-llp-build" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-llp-build" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-llp-build" className="cursor-pointer flex flex-col items-center">
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
      {errors.signature && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signature}</p>}
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

// ==================== DESKTOP CONTENT ====================
function DtContentLeaseBuilderLP({ 
  step, inp, errorBorder, formData, updateForm, 
  imagePreviews, handleImageUpload, removeImage, 
  handleVideoUpload, videoPreview, removeVideo, 
  handleDocumentUpload, toggleFeature, toggleOccupancy,
  addCustomFeature, removeCustomFeature,
  landTypes, landCategories, facingOptions, shapeOptions,
  waterSourceOptions, soilTypeOptions, landFeatures,
  yesNoOptions, occupancyOptions, leaseDurationOptions,
  bankOptions, handleCoverImageUpload, handleFloorPlanUpload, 
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, 
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature, 
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  errors, customFeaturesList
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
      <FieldDt label="Profile Photo" required error={errors.authPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-authphoto-llp" onChange={handleAuthPhotoUpload} />
          <label htmlFor="dt-authphoto-llp" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="dt-authaadhaar-llp" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-authaadhaar-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-authpan-llp" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-authpan-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company Registration Certificate" required error={errors.companyRegCert}>
        <div className={`border-2 border-dashed ${errors.companyRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-companyreg-llp" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="dt-companyreg-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gstcert-llp" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="dt-gstcert-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload RERA Certificate" required error={errors.reraCert}>
        <div className={`border-2 border-dashed ${errors.reraCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-reracert-llp" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="dt-reracert-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-companypan-llp" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="dt-companypan-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company PAN</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyPanCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyPanCard.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 4: Land Details (Desktop)
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Land Details</h3>
      </div>
      <FieldDt label="Land Title / Name" required error={errors.landTitle}>
        <input className={`${inp} ${errors.landTitle ? errorBorder : ''}`} placeholder="e.g. Green Valley Plot 123" value={formData.landTitle} onChange={(e) => updateForm("landTitle", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} />
      </FieldDt>
      <FieldDt label="Land Category" required error={errors.landCategory}>
        <select className={`${inp} ${errors.landCategory ? errorBorder : ''}`} value={formData.landCategory} onChange={(e) => updateForm("landCategory", e.target.value)}>
          <option value="">Select Land Category</option>
          {landCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Type" required error={errors.landType}>
        <select className={`${inp} ${errors.landType ? errorBorder : ''}`} value={formData.landType} onChange={(e) => updateForm("landType", e.target.value)}>
          <option value="">Select Land Type</option>
          {landTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Address" required error={errors.landAddress}>
        <textarea className={`${ta} min-h-[70px] ${errors.landAddress ? errorBorder : ''}`} placeholder="Enter complete land address" value={formData.landAddress} onChange={handleAddressChange("landAddress")} />
      </FieldDt>
      <FieldDt label="Land City" required error={errors.landCity}>
        <input className={`${inp} ${errors.landCity ? errorBorder : ''}`} placeholder="Enter land city name" value={formData.landCity} onChange={handleAlphaChange("landCity")} />
      </FieldDt>
      <FieldDt label="Land Area" required hint="Enter area in sq ft or acres" error={errors.landArea}>
        <div className="grid grid-cols-2 gap-2">
          <input className={`${inp} ${errors.landArea ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="Area" value={formData.landArea} onChange={(e) => updateForm("landArea", e.target.value.replace(/[^0-9.]/g, ''))} />
          <select className={inp} value={formData.areaUnit} onChange={(e) => updateForm("areaUnit", e.target.value)}>
            <option value="sqft">Sq. Ft.</option>
            <option value="acres">Acres</option>
          </select>
        </div>
      </FieldDt>
      <FieldDt label="Area Range (Min - Max)">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} type="text" inputMode="decimal" placeholder="Min Area" value={formData.landAreaMin} onChange={(e) => updateForm("landAreaMin", e.target.value.replace(/[^0-9.]/g, ''))} />
          <input className={inp} type="text" inputMode="decimal" placeholder="Max Area" value={formData.landAreaMax} onChange={(e) => updateForm("landAreaMax", e.target.value.replace(/[^0-9.]/g, ''))} />
        </div>
      </FieldDt>
      <FieldDt label="Land Facing">
        <select className={inp} value={formData.landFacing} onChange={(e) => updateForm("landFacing", e.target.value)}>
          <option value="">Select Facing</option>
          {facingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Shape">
        <select className={inp} value={formData.landShape} onChange={(e) => updateForm("landShape", e.target.value)}>
          <option value="">Select Shape</option>
          {shapeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Road Width (ft)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter road width in feet" value={formData.roadWidth} onChange={handleNumericChange("roadWidth")} />
      </FieldDt>
      <FieldDt label="Water Source">
        <select className={inp} value={formData.waterSource} onChange={(e) => updateForm("waterSource", e.target.value)}>
          <option value="">Select Water Source</option>
          {waterSourceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Soil Type">
        <select className={inp} value={formData.soilType} onChange={(e) => updateForm("soilType", e.target.value)}>
          <option value="">Select Soil Type</option>
          {soilTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Electricity Available">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-electricity-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.electricityAvailable === opt} onChange={() => updateForm("electricityAvailable", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Lease Preferences</h3>
      </div>
      <FieldDt label="Lease Duration">
        {leaseDurationOptions.map(d => (
          <label key={d} className="flex items-center gap-2 text-[13px] mb-1.5 cursor-pointer">
            <input type="radio" name="dt-duration-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
            {d}
          </label>
        ))}
      </FieldDt>
      <FieldDt label="Occupancy Details">
        <div className="flex flex-wrap gap-4">
          {occupancyOptions.map(occ => (
            <label key={occ} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyDetails.includes(occ)} onChange={() => toggleOccupancy(occ)} />
              {occ}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Pet Friendly">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-pet-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 5: Pricing & Amenities (Desktop)
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      <FieldDt label="Expected Lease (₹/month)" required error={errors.expectedPrice}>
        <input className={`${inp} ${errors.expectedPrice ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="e.g. 20,000" value={formData.expectedPrice} onChange={(e) => updateForm("expectedPrice", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Budget Range (₹/month)">
        <div className="flex gap-2">
          <input className={inp} type="text" inputMode="decimal" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9.]/g, '') })} />
          <input className={inp} type="text" inputMode="decimal" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9.]/g, '') })} />
        </div>
      </FieldDt>
      <FieldDt label="Security Deposit (₹)" required error={errors.securityDeposit}>
        <input className={`${inp} ${errors.securityDeposit ? errorBorder : ''}`} type="text" inputMode="decimal" placeholder="e.g. 50,000" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", e.target.value.replace(/[^0-9.]/g, ''))} />
      </FieldDt>
      <FieldDt label="Price Type">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt-llp-build" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
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
      <FieldDt label="Land Features">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {landFeatures.map(f => (
            <span key={f} onClick={() => toggleFeature(f)} className={`px-2.5 py-1.5 text-[13px] rounded-full border cursor-pointer transition-all ${formData.selectedFeatures.includes(f) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
              {f}
            </span>
          ))}
          {customFeaturesList.map(f => (
            <span key={f} className="px-2.5 py-1.5 text-[13px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {f}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomFeature(f)} />
            </span>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Other Features">
        <div className="flex gap-2">
          <input className={inp} placeholder="e.g. Clubhouse, CCTV, Solar Panel..." value={formData.otherFeatures} onChange={(e) => updateForm("otherFeatures", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()} />
          <button onClick={addCustomFeature} className="px-3 py-1.5 text-[13px] bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button>
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
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
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

      <FieldDt label="Company Logo" required error={errors.companyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.companyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-comp-logo-llp" onChange={handleCompanyLogoUpload} />
          <label htmlFor="dt-comp-logo-llp" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company Logo</span>
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

      <FieldDt label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-brochure-llp" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="dt-comp-brochure-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Profile Brochure</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyBrochure.name}</p>}
      </FieldDt>

      <FieldDt label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-project-brochures-llp" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="dt-project-brochures-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Project Brochures</span>
            <span className="text-[11px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[13px] text-green-600 mt-2">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </FieldDt>

      <FieldDt label="Company Registration Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-reg-doc-llp" onChange={(e) => handleDocumentUpload("companyRegCertDoc", e)} />
          <label htmlFor="dt-comp-reg-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="RERA Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-rera-doc-llp" onChange={(e) => handleDocumentUpload("reraCertDoc", e)} />
          <label htmlFor="dt-rera-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gst-doc-llp" onChange={(e) => handleDocumentUpload("gstCertDoc", e)} />
          <label htmlFor="dt-gst-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-doc-llp" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-doc-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Authorized Signatory ID Proof" required error={errors.authIdProof}>
        <div className={`border-2 border-dashed ${errors.authIdProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-auth-id-llp" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="dt-auth-id-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload ID Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.authIdProof.name}</p>}
      </FieldDt>

      <FieldDt label="Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-llp" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="dt-office-proof-llp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProof.name}</p>}
      </FieldDt>

      {/* Media Upload for Land */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Land Media</h3>
      </div>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-cover-llp-build" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-llp-build" className="cursor-pointer flex flex-col items-center">
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

      <FieldDt label="Upload Land Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className={`border-2 border-dashed ${errors.propertyImages ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-llp-build" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-llp-build" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Land Photos</span>
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

      <FieldDt label="Upload Land Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-llp-build" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-llp-build" className="cursor-pointer flex flex-col items-center">
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
        <div className={`border-2 border-dashed ${errors.floorPlan ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-llp-build" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-llp-build" className="cursor-pointer flex flex-col items-center">
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