import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ImagePlus, Video, X, FileText, User, Home, PenTool, Building } from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

const steps = ["Business Details", "Authorized Representative", "Office Address", "Identity & Business Verification", "Land Details", "Pricing & Amenities", "Bank Details", "Social Media", "Documents", "Declaration"];
const subtitles = [
  "Enter property management company information",
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
const bankOptions = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Yes Bank", "Bank of Baroda", "Punjab National Bank",
  "Canara Bank", "Union Bank of India", "IDBI Bank", "Federal Bank",
  "IndusInd Bank", "Other"
];

export default function LeasePMLPForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Business Details (Step 0)
    pmCompanyName: "", pmBusinessRegNumber: "", pmReraNumber: "", pmGstNumber: "", pmYearsOfExperience: "", pmCompanyWebsite: "", pmCompanyLogo: null, pmCompanyDescription: "",
    
    // Authorized Representative (Step 1)
    authFullName: "", authDesignation: "", authMobile: "", authEmail: "", authWhatsapp: "", authPhoto: null,
    
    // Office Address (Step 2)
    officeAddress: "", officeCity: "", officeDistrict: "", officeState: "", officePinCode: "", officeLandmark: "",
    
    // Identity & Business Verification (Step 3)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, pmBusinessRegCert: null, pmGstCert: null, pmReraCert: null, officeAddressProof: null,
    
    // Land Details (Step 4)
    landTitle: "", landType: "", landCategory: "", landAddress: "", landCity: "",
    landArea: "", landAreaMin: "", landAreaMax: "", areaUnit: "sqft",
    landFacing: "", landShape: "", roadWidth: "", waterSource: "", soilType: "",
    electricityAvailable: "", selectedFeatures: [], otherFeatures: "",
    
    // Pricing & Amenities (Step 5)
    leaseAmount: "", budgetRange: { min: "", max: "" }, securityDeposit: "",
    leaseDuration: "", priceType: "",
    tenantType: [], petFriendly: "", occupancyDetails: [],
    selectedAmenities: [], otherAmenities: "",
    immediateOccupancy: "", availableFrom: "",
    
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    
    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Documents (Step 8)
    pmCompanyLogoDoc: null, pmCompanyBrochure: null, pmBusinessRegCertDoc: null, pmReraCertDoc: null, pmGstCertDoc: null, aadhaarCardDoc: null, panCardDoc: null, officeAddressProofDoc: null,
    propertyImages: [], propertyVideo: null, coverImage: null, floorPlan: null,
    
    // Declaration (Step 9)
    declarationAuthorized: false,
    declarationAccurate: false,
    declarationAuthorization: false,
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

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    let isValid = true;

    switch(stepNumber) {
      case 0: // Business Details
        if (!formData.pmCompanyName.trim()) {
          newErrors.pmCompanyName = "Company name is required";
          isValid = false;
        }
        if (!formData.pmBusinessRegNumber.trim()) {
          newErrors.pmBusinessRegNumber = "Business registration number is required";
          isValid = false;
        }
        if (!formData.pmYearsOfExperience || parseInt(formData.pmYearsOfExperience) <= 0) {
          newErrors.pmYearsOfExperience = "Years of experience is required";
          isValid = false;
        }
        if (!formData.pmCompanyLogo) {
          newErrors.pmCompanyLogo = "Company logo is required";
          isValid = false;
        }
        if (!formData.pmCompanyDescription.trim()) {
          newErrors.pmCompanyDescription = "Company description is required";
          isValid = false;
        }
        break;

      case 1: // Authorized Representative
        if (!formData.authFullName.trim()) {
          newErrors.authFullName = "Full name is required";
          isValid = false;
        }
        if (!formData.authDesignation.trim()) {
          newErrors.authDesignation = "Designation is required";
          isValid = false;
        }
        if (!formData.authMobile || !validateMobile(formData.authMobile)) {
          newErrors.authMobile = "Please enter a valid 10-digit mobile number";
          isValid = false;
        }
        if (!formData.authEmail || !validateEmail(formData.authEmail)) {
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
        }
        if (!formData.officeCity.trim()) {
          newErrors.officeCity = "City is required";
          isValid = false;
        }
        if (!formData.officeDistrict.trim()) {
          newErrors.officeDistrict = "District is required";
          isValid = false;
        }
        if (!formData.officeState.trim()) {
          newErrors.officeState = "State is required";
          isValid = false;
        }
        if (!formData.officePinCode || !validatePinCode(formData.officePinCode)) {
          newErrors.officePinCode = "Please enter a valid 6-digit PIN code";
          isValid = false;
        }
        break;

      case 3: // Identity & Business Verification
        if (!formData.aadhaarNumber || !validateAadhaar(formData.aadhaarNumber)) {
          newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";
          isValid = false;
        }
        if (!formData.panNumber || !validatePAN(formData.panNumber)) {
          newErrors.panNumber = "Please enter a valid 10-character PAN number (e.g., ABCDE1234F)";
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
        if (!formData.pmBusinessRegCert) {
          newErrors.pmBusinessRegCert = "Business registration certificate is required";
          isValid = false;
        }
        if (!formData.officeAddressProof) {
          newErrors.officeAddressProof = "Office address proof is required";
          isValid = false;
        }
        break;

      case 4: // Land Details
        if (!formData.landTitle.trim()) {
          newErrors.landTitle = "Land title is required";
          isValid = false;
        }
        if (!formData.landType) {
          newErrors.landType = "Please select a land type";
          isValid = false;
        }
        if (!formData.landCategory) {
          newErrors.landCategory = "Please select a land category";
          isValid = false;
        }
        if (!formData.landAddress.trim()) {
          newErrors.landAddress = "Land address is required";
          isValid = false;
        }
        if (!formData.landCity.trim()) {
          newErrors.landCity = "Land city is required";
          isValid = false;
        }
        if (!formData.landArea || parseFloat(formData.landArea) <= 0) {
          newErrors.landArea = "Land area is required";
          isValid = false;
        }
        break;

      case 5: // Pricing & Amenities
        if (!formData.leaseAmount || parseFloat(formData.leaseAmount) <= 0) {
          newErrors.leaseAmount = "Lease amount is required";
          isValid = false;
        }
        if (!formData.priceType) {
          newErrors.priceType = "Please select price type";
          isValid = false;
        }
        if (!formData.securityDeposit || parseFloat(formData.securityDeposit) <= 0) {
          newErrors.securityDeposit = "Security deposit is required";
          isValid = false;
        }
        break;

      case 6: // Bank Details
        if (!formData.accountHolderName.trim()) {
          newErrors.accountHolderName = "Account holder name is required";
          isValid = false;
        }
        if (!formData.bankName) {
          newErrors.bankName = "Please select a bank";
          isValid = false;
        }
        if (!formData.accountNumber || !validateAccountNumber(formData.accountNumber)) {
          newErrors.accountNumber = "Please enter a valid account number (9-18 digits)";
          isValid = false;
        }
        if (!formData.ifscCode || !validateIFSC(formData.ifscCode)) {
          newErrors.ifscCode = "Please enter a valid IFSC code (e.g., SBIN0001234)";
          isValid = false;
        }
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
        if (!formData.coverImage) {
          newErrors.coverImage = "Cover image is required";
          isValid = false;
        }
        if (formData.propertyImages.length === 0) {
          newErrors.propertyImages = "At least one land photo is required";
          isValid = false;
        }
        if (!formData.floorPlan) {
          newErrors.floorPlan = "Floor plan is required";
          isValid = false;
        }
        break;

      case 9: // Declaration
        if (!formData.declarationAuthorized) {
          newErrors.declarationAuthorized = "You must confirm that you are the authorized representative";
          isValid = false;
        }
        if (!formData.declarationAccurate) {
          newErrors.declarationAccurate = "You must certify that all information is accurate";
          isValid = false;
        }
        if (!formData.declarationAuthorization) {
          newErrors.declarationAuthorization = "You must confirm authorization from property owners";
          isValid = false;
        }
        if (!formData.declarationTerms) {
          newErrors.declarationTerms = "You must agree to the Terms & Conditions";
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

  const toggleArrayItem = (field, value) => {
    const current = formData[field] || [];
    if (current.includes(value)) {
      updateForm(field, current.filter(v => v !== value));
    } else {
      updateForm(field, [...current, value]);
    }
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
            <div className="text-xl mb-0.5 relative z-10">🏞️</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Land Lease - Property Management</h1>
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
            <MobContentLeasePMLP
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
              toggleArrayItem={toggleArrayItem}
              bankOptions={bankOptions}
              customFeaturesList={customFeaturesList}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              handleMobileChange={handleMobileChange}
              handleAadhaarChange={handleAadhaarChange}
              handlePANChange={handlePANChange}
              handleIFSCChange={handleIFSCChange}
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
            <div className="text-xl mb-0.5 relative z-10">🏞️</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Land Lease - Property Management</h1>
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
            <DtContentLeasePMLP
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
              toggleArrayItem={toggleArrayItem}
              bankOptions={bankOptions}
              customFeaturesList={customFeaturesList}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              handleMobileChange={handleMobileChange}
              handleAadhaarChange={handleAadhaarChange}
              handlePANChange={handlePANChange}
              handleIFSCChange={handleIFSCChange}
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

// ==================== MOBILE CONTENT - LEASE PM LAND/PLOT ====================
function MobContentLeasePMLP({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  imagePreviews, handleImageUpload, removeImage, 
  handleVideoUpload, videoPreview, removeVideo, 
  handleDocumentUpload, toggleFeature, toggleOccupancy,
  addCustomFeature, removeCustomFeature,
  landTypes, landCategories, facingOptions, shapeOptions,
  waterSourceOptions, soilTypeOptions, landFeatures,
  yesNoOptions, occupancyOptions, leaseDurationOptions,
  handleCoverImageUpload, handleFloorPlanUpload, 
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, 
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature, 
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  toggleArrayItem, bankOptions, customFeaturesList,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange,
  handlePinCodeChange, handleMobileChange, handleAadhaarChange,
  handlePANChange, handleIFSCChange
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

  // STEP 0: Business Details
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
      <Field label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.pmCompanyWebsite} onChange={(e) => updateForm("pmCompanyWebsite", e.target.value)} />
      </Field>
      <Field label="Company Logo" required hint="JPG, PNG max 2MB" error={errors.pmCompanyLogo}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogo ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-pm-logo-lp" onChange={handleCompanyLogoUpload} />
          <label htmlFor="m-pm-logo-lp" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {companyLogoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={companyLogoPreview} alt="Company Logo" className="w-16 h-16 object-cover rounded-lg border-2 border-[#00695C]" />
            <button onClick={removeCompanyLogo} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
      <Field label="Company Description" required error={errors.pmCompanyDescription}>
        <textarea className={`${ta} min-h-[60px] ${getErrorClass('pmCompanyDescription')}`} placeholder="Describe your property management company" value={formData.pmCompanyDescription} onChange={(e) => updateForm("pmCompanyDescription", e.target.value)} />
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
      <Field label="Profile Photo" required hint="JPG, PNG max 2MB" error={errors.authPhoto}>
        <div className={`border-2 border-dashed ${errors.authPhoto ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-authphoto-lp" onChange={handleAuthPhotoUpload} />
          <label htmlFor="m-authphoto-lp" className="cursor-pointer flex flex-col items-center">
            <User className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {authPhotoPreview && (
          <div className="mt-2 relative inline-block">
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
        <textarea className={`${ta} min-h-[55px] ${getErrorClass('officeAddress')}`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
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
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-lp" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-aadhaar-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>

      <Field label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pan-lp" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-pan-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>

      <Field label="Upload Business Registration Certificate" required error={errors.pmBusinessRegCert}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pm-reg-lp" onChange={(e) => handleDocumentUpload("pmBusinessRegCert", e)} />
          <label htmlFor="m-pm-reg-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmBusinessRegCert.name}</p>}
      </Field>

      <Field label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-gst-lp" onChange={(e) => handleDocumentUpload("pmGstCert", e)} />
          <label htmlFor="m-pm-gst-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmGstCert.name}</p>}
      </Field>

      <Field label="Upload RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-rera-lp" onChange={(e) => handleDocumentUpload("pmReraCert", e)} />
          <label htmlFor="m-pm-rera-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmReraCert.name}</p>}
      </Field>

      <Field label="Upload Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-lp" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="m-office-proof-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProof.name}</p>}
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
        <input className={`${inp} ${getErrorClass('landTitle')}`} placeholder="e.g. Green Valley Plot 123" value={formData.landTitle} onChange={(e) => updateForm("landTitle", handleAlphaNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Land Category" required error={errors.landCategory}>
        <select className={`${inp} ${getErrorClass('landCategory')}`} value={formData.landCategory} onChange={(e) => updateForm("landCategory", e.target.value)}>
          <option value="">Select Land Category</option>
          {landCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </Field>
      <Field label="Land Type" required error={errors.landType}>
        <select className={`${inp} ${getErrorClass('landType')}`} value={formData.landType} onChange={(e) => updateForm("landType", e.target.value)}>
          <option value="">Select Land Type</option>
          {landTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </Field>
      <Field label="Land Address" required error={errors.landAddress}>
        <textarea className={`${ta} min-h-[55px] ${getErrorClass('landAddress')}`} placeholder="Enter complete land address" value={formData.landAddress} onChange={(e) => updateForm("landAddress", e.target.value)} />
      </Field>
      <Field label="Land City" required error={errors.landCity}>
        <input className={`${inp} ${getErrorClass('landCity')}`} placeholder="Enter land city name" value={formData.landCity} onChange={(e) => updateForm("landCity", handleAlphaFieldChange(e.target.value))} />
      </Field>
      <Field label="Land Area" required hint="Enter area in sq ft or acres" error={errors.landArea}>
        <div className="grid grid-cols-2 gap-1.5">
          <input className={`${inp} ${getErrorClass('landArea')}`} type="text" placeholder="Area" value={formData.landArea} onChange={(e) => updateForm("landArea", handleNumericFieldChange(e.target.value))} />
          <select className={inp} value={formData.areaUnit} onChange={(e) => updateForm("areaUnit", e.target.value)}>
            <option value="sqft">Sq. Ft.</option>
            <option value="acres">Acres</option>
          </select>
        </div>
      </Field>
      <Field label="Area Range (Min - Max)">
        <div className="grid grid-cols-2 gap-1.5">
          <input className={inp} type="text" placeholder="Min Area" value={formData.landAreaMin} onChange={(e) => updateForm("landAreaMin", handleNumericFieldChange(e.target.value))} />
          <input className={inp} type="text" placeholder="Max Area" value={formData.landAreaMax} onChange={(e) => updateForm("landAreaMax", handleNumericFieldChange(e.target.value))} />
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
        <input className={inp} type="text" placeholder="Enter road width in feet" value={formData.roadWidth} onChange={(e) => updateForm("roadWidth", handleNumericFieldChange(e.target.value))} />
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
              <input type="radio" name="mob-electricity-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.electricityAvailable === opt} onChange={() => updateForm("electricityAvailable", opt)} />
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
            <input type="radio" name="mob-duration-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
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
              <input type="radio" name="mob-pet-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
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
        <h3 className="text-[11px] font-bold text-[#00695C]">📄 Lease Details</h3>
      </div>
      <Field label="Lease Amount (₹/month)" required error={errors.leaseAmount}>
        <input className={`${inp} ${getErrorClass('leaseAmount')}`} type="text" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => updateForm("leaseAmount", handleNumericFieldChange(e.target.value))} />
      </Field>
      
      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={`${inp} w-1/2`} type="text" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: handleNumericFieldChange(e.target.value) })} />
          <input className={`${inp} w-1/2`} type="text" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: handleNumericFieldChange(e.target.value) })} />
        </div>
      </Field>

      <Field label="Security Deposit (₹)" required error={errors.securityDeposit}>
        <input className={`${inp} ${getErrorClass('securityDeposit')}`} type="text" placeholder="Enter security deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", handleNumericFieldChange(e.target.value))} />
      </Field>
      <Field label="Price Type" required error={errors.priceType}>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-priceType-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-priceType-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">👥 Tenant Preferences</h3>
      </div>
      <Field label="Tenant Type">
        <div className="flex flex-wrap gap-2">
          {["Family", "Bachelor", "Working Professionals", "Students"].map(t => (
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
              <input type="radio" name="mob-pet2-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">✨ Amenities</h3>
      </div>
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

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📅 Availability</h3>
      </div>
      <Field label="Immediate Occupancy">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-occupancy-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
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
        <select className={`${inp} ${getErrorClass('bankName')}`} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
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
      <Field label="Facebook">
        <input className={inp} placeholder="Enter Facebook URL" value={formData.facebook} onChange={(e) => updateForm("facebook", e.target.value)} />
      </Field>
      <Field label="Instagram">
        <input className={inp} placeholder="Enter Instagram URL" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} />
      </Field>
      <Field label="LinkedIn">
        <input className={inp} placeholder="Enter LinkedIn URL" value={formData.linkedin} onChange={(e) => updateForm("linkedin", e.target.value)} />
      </Field>
      <Field label="YouTube">
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

      <Field label="Company Logo" required hint="JPG, PNG max 2MB" error={errors.pmCompanyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-pm-logo-doc-lp" onChange={(e) => handleDocumentUpload("pmCompanyLogoDoc", e, 2)} />
          <label htmlFor="m-pm-logo-doc-lp" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.pmCompanyLogoDoc && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.pmCompanyLogoDoc)} 
              alt="Company Logo" 
              className="w-16 h-16 object-cover rounded-lg border-2 border-[#00695C]"
            />
            <button 
              onClick={() => { updateForm("pmCompanyLogoDoc", null); }} 
              className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </Field>

      <Field label="Business Registration Certificate" required error={errors.pmBusinessRegCertDoc}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pm-reg-doc-lp" onChange={(e) => handleDocumentUpload("pmBusinessRegCertDoc", e)} />
          <label htmlFor="m-pm-reg-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmBusinessRegCertDoc.name}</p>}
      </Field>

      <Field label="Aadhaar Card" required error={errors.aadhaarCardDoc}>
        <div className={`border-2 border-dashed ${errors.aadhaarCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-doc-lp" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="m-aadhaar-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCardDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required error={errors.panCardDoc}>
        <div className={`border-2 border-dashed ${errors.panCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pan-doc-lp" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-gst-doc-lp" onChange={(e) => handleDocumentUpload("pmGstCertDoc", e)} />
          <label htmlFor="m-pm-gst-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmGstCertDoc.name}</p>}
      </Field>

      <Field label="RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-rera-doc-lp" onChange={(e) => handleDocumentUpload("pmReraCertDoc", e)} />
          <label htmlFor="m-pm-rera-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmReraCertDoc.name}</p>}
      </Field>

      <Field label="Office Address Proof" required error={errors.officeAddressProofDoc}>
        <div className={`border-2 border-dashed ${errors.officeAddressProofDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-doc-lp" onChange={(e) => handleDocumentUpload("officeAddressProofDoc", e)} />
          <label htmlFor="m-office-proof-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProofDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProofDoc.name}</p>}
      </Field>

      <Field label="Company Profile/Brochure (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pm-brochure-lp" onChange={(e) => handleDocumentUpload("pmCompanyBrochure", e)} />
          <label htmlFor="m-pm-brochure-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochure</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmCompanyBrochure && <p className="text-[10px] text-green-600 mt-1">✓ {formData.pmCompanyBrochure.name}</p>}
      </Field>

      {/* Media Upload for Land */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Land Media</h3>
      </div>
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-cover-lp-pm" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-lp-pm" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-lp-pm" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-lp-pm" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-lp-pm" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-lp-pm" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-lp-pm" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-lp-pm" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Date" required error={errors.signatureDate}>
        <input className={`${inp} ${getErrorClass('signatureDate')}`} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${getErrorClass('signaturePlace')}`} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
      </Field>

      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAuthorized} onChange={() => updateForm("declarationAuthorized", !formData.declarationAuthorized)} />
          <span>I confirm that I am the authorized representative of this property management company.</span>
        </label>
        {errors.declarationAuthorized && <p className="text-[10px] text-red-500 ml-5">{errors.declarationAuthorized}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[10px] text-red-500 ml-5">{errors.declarationAccurate}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAuthorization} onChange={() => updateForm("declarationAuthorization", !formData.declarationAuthorization)} />
          <span>I have the necessary authorization from property owners to list and manage their properties on this platform.</span>
        </label>
        {errors.declarationAuthorization && <p className="text-[10px] text-red-500 ml-5">{errors.declarationAuthorization}</p>}
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

// ==================== DESKTOP CONTENT - LEASE PM LAND/PLOT ====================
function DtContentLeasePMLP({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  imagePreviews, handleImageUpload, removeImage, 
  handleVideoUpload, videoPreview, removeVideo, 
  handleDocumentUpload, toggleFeature, toggleOccupancy,
  addCustomFeature, removeCustomFeature,
  landTypes, landCategories, facingOptions, shapeOptions,
  waterSourceOptions, soilTypeOptions, landFeatures,
  yesNoOptions, occupancyOptions, leaseDurationOptions,
  handleCoverImageUpload, handleFloorPlanUpload, 
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, 
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature, 
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  toggleArrayItem, bankOptions, customFeaturesList,
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange,
  handlePinCodeChange, handleMobileChange, handleAadhaarChange,
  handlePANChange, handleIFSCChange
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

  // STEP 0: Business Details (Desktop)
  if (step === 0) return (
    <>
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
      <FieldDt label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.pmCompanyWebsite} onChange={(e) => updateForm("pmCompanyWebsite", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Logo" required hint="JPG, PNG max 2MB" error={errors.pmCompanyLogo}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogo ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-pm-logo-lp" onChange={handleCompanyLogoUpload} />
          <label htmlFor="dt-pm-logo-lp" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {companyLogoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={companyLogoPreview} alt="Company Logo" className="w-20 h-20 object-cover rounded-lg border-2 border-[#00695C]" />
            <button onClick={removeCompanyLogo} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
      <FieldDt label="Company Description" required error={errors.pmCompanyDescription}>
        <textarea className={`${ta} min-h-[70px] ${getErrorClass('pmCompanyDescription')}`} placeholder="Describe your property management company" value={formData.pmCompanyDescription} onChange={(e) => updateForm("pmCompanyDescription", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 1: Authorized Representative (Desktop)
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
      <FieldDt label="Profile Photo" required hint="JPG, PNG max 2MB" error={errors.authPhoto}>
        <div className={`border-2 border-dashed ${errors.authPhoto ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-authphoto-lp" onChange={handleAuthPhotoUpload} />
          <label htmlFor="dt-authphoto-lp" className="cursor-pointer flex flex-col items-center">
            <User className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Photo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {authPhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={authPhotoPreview} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeAuthPhoto} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
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
        <textarea className={`${ta} min-h-[70px] ${getErrorClass('officeAddress')}`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
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

  // STEP 3: Identity & Business Verification (Desktop)
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
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-lp" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-aadhaar-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-lp" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-pan-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Business Registration Certificate" required error={errors.pmBusinessRegCert}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-reg-lp" onChange={(e) => handleDocumentUpload("pmBusinessRegCert", e)} />
          <label htmlFor="dt-pm-reg-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmBusinessRegCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-gst-lp" onChange={(e) => handleDocumentUpload("pmGstCert", e)} />
          <label htmlFor="dt-pm-gst-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmGstCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-rera-lp" onChange={(e) => handleDocumentUpload("pmReraCert", e)} />
          <label htmlFor="dt-pm-rera-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmReraCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-lp" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="dt-office-proof-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProof.name}</p>}
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
        <input className={`${inp} ${getErrorClass('landTitle')}`} placeholder="e.g. Green Valley Plot 123" value={formData.landTitle} onChange={(e) => updateForm("landTitle", handleAlphaNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Land Category" required error={errors.landCategory}>
        <select className={`${inp} ${getErrorClass('landCategory')}`} value={formData.landCategory} onChange={(e) => updateForm("landCategory", e.target.value)}>
          <option value="">Select Land Category</option>
          {landCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Type" required error={errors.landType}>
        <select className={`${inp} ${getErrorClass('landType')}`} value={formData.landType} onChange={(e) => updateForm("landType", e.target.value)}>
          <option value="">Select Land Type</option>
          {landTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Address" required error={errors.landAddress}>
        <textarea className={`${ta} min-h-[70px] ${getErrorClass('landAddress')}`} placeholder="Enter complete land address" value={formData.landAddress} onChange={(e) => updateForm("landAddress", e.target.value)} />
      </FieldDt>
      <FieldDt label="Land City" required error={errors.landCity}>
        <input className={`${inp} ${getErrorClass('landCity')}`} placeholder="Enter land city name" value={formData.landCity} onChange={(e) => updateForm("landCity", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Land Area" required hint="Enter area in sq ft or acres" error={errors.landArea}>
        <div className="grid grid-cols-2 gap-2">
          <input className={`${inp} ${getErrorClass('landArea')}`} type="text" placeholder="Area" value={formData.landArea} onChange={(e) => updateForm("landArea", handleNumericFieldChange(e.target.value))} />
          <select className={inp} value={formData.areaUnit} onChange={(e) => updateForm("areaUnit", e.target.value)}>
            <option value="sqft">Sq. Ft.</option>
            <option value="acres">Acres</option>
          </select>
        </div>
      </FieldDt>
      <FieldDt label="Area Range (Min - Max)">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} type="text" placeholder="Min Area" value={formData.landAreaMin} onChange={(e) => updateForm("landAreaMin", handleNumericFieldChange(e.target.value))} />
          <input className={inp} type="text" placeholder="Max Area" value={formData.landAreaMax} onChange={(e) => updateForm("landAreaMax", handleNumericFieldChange(e.target.value))} />
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
        <input className={inp} type="text" placeholder="Enter road width in feet" value={formData.roadWidth} onChange={(e) => updateForm("roadWidth", handleNumericFieldChange(e.target.value))} />
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
              <input type="radio" name="dt-electricity-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.electricityAvailable === opt} onChange={() => updateForm("electricityAvailable", opt)} />
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
            <input type="radio" name="dt-duration-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
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
              <input type="radio" name="dt-pet-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
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
        <h3 className="text-[14px] font-bold text-[#00695C]">📄 Lease Details</h3>
      </div>
      <FieldDt label="Lease Amount (₹/month)" required error={errors.leaseAmount}>
        <input className={`${inp} ${getErrorClass('leaseAmount')}`} type="text" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => updateForm("leaseAmount", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      
      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={`${inp} w-1/2`} type="text" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: handleNumericFieldChange(e.target.value) })} />
          <input className={`${inp} w-1/2`} type="text" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: handleNumericFieldChange(e.target.value) })} />
        </div>
      </FieldDt>

      <FieldDt label="Security Deposit (₹)" required error={errors.securityDeposit}>
        <input className={`${inp} ${getErrorClass('securityDeposit')}`} type="text" placeholder="Enter security deposit amount" value={formData.securityDeposit} onChange={(e) => updateForm("securityDeposit", handleNumericFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Price Type" required error={errors.priceType}>
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">👥 Tenant Preferences</h3>
      </div>
      <FieldDt label="Tenant Type">
        <div className="flex flex-wrap gap-3">
          {["Family", "Bachelor", "Working Professionals", "Students"].map(t => (
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
              <input type="radio" name="dt-pet2-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">✨ Amenities</h3>
      </div>
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

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📅 Availability</h3>
      </div>
      <FieldDt label="Immediate Occupancy">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-occupancy-lp-pm" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
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
        <input className={`${inp} ${getErrorClass('accountHolderName')}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>
      <FieldDt label="Bank Name" required error={errors.bankName}>
        <select className={`${inp} ${getErrorClass('bankName')}`} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank</option>
          {bankOptions.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
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
      <FieldDt label="Facebook">
        <input className={inp} placeholder="Enter Facebook URL" value={formData.facebook} onChange={(e) => updateForm("facebook", e.target.value)} />
      </FieldDt>
      <FieldDt label="Instagram">
        <input className={inp} placeholder="Enter Instagram URL" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} />
      </FieldDt>
      <FieldDt label="LinkedIn">
        <input className={inp} placeholder="Enter LinkedIn URL" value={formData.linkedin} onChange={(e) => updateForm("linkedin", e.target.value)} />
      </FieldDt>
      <FieldDt label="YouTube">
        <input className={inp} placeholder="Enter YouTube URL" value={formData.youtube} onChange={(e) => updateForm("youtube", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 8: Documents (Desktop)
  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Upload Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>

      <FieldDt label="Company Logo" required hint="JPG, PNG max 2MB" error={errors.pmCompanyLogoDoc}>
        <div className={`border-2 border-dashed ${errors.pmCompanyLogoDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-pm-logo-doc-lp" onChange={(e) => handleDocumentUpload("pmCompanyLogoDoc", e, 2)} />
          <label htmlFor="dt-pm-logo-doc-lp" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.pmCompanyLogoDoc && (
          <div className="mt-2 relative inline-block">
            <img 
              src={URL.createObjectURL(formData.pmCompanyLogoDoc)} 
              alt="Company Logo" 
              className="w-20 h-20 object-cover rounded-lg border-2 border-[#00695C]"
            />
            <button 
              onClick={() => { updateForm("pmCompanyLogoDoc", null); }} 
              className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Business Registration Certificate" required error={errors.pmBusinessRegCertDoc}>
        <div className={`border-2 border-dashed ${errors.pmBusinessRegCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-reg-doc-lp" onChange={(e) => handleDocumentUpload("pmBusinessRegCertDoc", e)} />
          <label htmlFor="dt-pm-reg-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmBusinessRegCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmBusinessRegCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Aadhaar Card" required error={errors.aadhaarCardDoc}>
        <div className={`border-2 border-dashed ${errors.aadhaarCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-doc-lp" onChange={(e) => handleDocumentUpload("aadhaarCardDoc", e)} />
          <label htmlFor="dt-aadhaar-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required error={errors.panCardDoc}>
        <div className={`border-2 border-dashed ${errors.panCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-doc-lp" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-gst-doc-lp" onChange={(e) => handleDocumentUpload("pmGstCertDoc", e)} />
          <label htmlFor="dt-pm-gst-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmGstCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmGstCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="RERA Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-rera-doc-lp" onChange={(e) => handleDocumentUpload("pmReraCertDoc", e)} />
          <label htmlFor="dt-pm-rera-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmReraCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmReraCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Office Address Proof" required error={errors.officeAddressProofDoc}>
        <div className={`border-2 border-dashed ${errors.officeAddressProofDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-doc-lp" onChange={(e) => handleDocumentUpload("officeAddressProofDoc", e)} />
          <label htmlFor="dt-office-proof-doc-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProofDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProofDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Company Profile/Brochure (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pm-brochure-lp" onChange={(e) => handleDocumentUpload("pmCompanyBrochure", e)} />
          <label htmlFor="dt-pm-brochure-lp" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Profile/Brochure</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.pmCompanyBrochure && <p className="text-[13px] text-green-600 mt-2">✓ {formData.pmCompanyBrochure.name}</p>}
      </FieldDt>

      {/* Media Upload for Land */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Land Media</h3>
      </div>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-cover-lp-pm" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-lp-pm" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-lp-pm" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-lp-pm" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-lp-pm" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-lp-pm" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-lp-pm" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-lp-pm" className="cursor-pointer flex flex-col items-center">
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
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={`${inp} ${getErrorClass('signatureDate')}`} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${getErrorClass('signaturePlace')}`} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", handleAlphaFieldChange(e.target.value))} />
      </FieldDt>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAuthorized} onChange={() => updateForm("declarationAuthorized", !formData.declarationAuthorized)} />
          <span>I confirm that I am the authorized representative of this property management company.</span>
        </label>
        {errors.declarationAuthorized && <p className="text-[10px] text-red-500 ml-6">{errors.declarationAuthorized}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[10px] text-red-500 ml-6">{errors.declarationAccurate}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAuthorization} onChange={() => updateForm("declarationAuthorization", !formData.declarationAuthorization)} />
          <span>I have the necessary authorization from property owners to list and manage their properties on this platform.</span>
        </label>
        {errors.declarationAuthorization && <p className="text-[10px] text-red-500 ml-6">{errors.declarationAuthorization}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declarationTerms && <p className="text-[10px] text-red-500 ml-6">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}