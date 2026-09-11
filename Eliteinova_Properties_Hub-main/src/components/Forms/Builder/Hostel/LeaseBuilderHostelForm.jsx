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
  Award, Building2, Construction, Hammer, HardHat, Ruler, PaintBucket
} from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

// Helper functions for validation
const handleAlphaFieldChange = (e, updateForm, field) => {
  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
  updateForm(field, value);
};

const handleNumericFieldChange = (e, updateForm, field, maxLength = null) => {
  let value = e.target.value.replace(/\D/g, '');
  if (maxLength) {
    value = value.slice(0, maxLength);
  }
  updateForm(field, value);
};

const handleAlphaNumericFieldChange = (e, updateForm, field) => {
  const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
  updateForm(field, value);
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
  "Location, specifications & interior details",
  "Set lease pricing, preferences & amenities",
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

const validateIFSC = (ifsc) => {
  const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return re.test(ifsc);
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
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "AC" },
  { id: "hotWater", label: "Hot Water" },
  { id: "security24x7", label: "24/7 Security" },
  { id: "cctv", label: "CCTV Surveillance" },
  { id: "powerBackup", label: "Power Backup" },
  { id: "laundry", label: "Laundry Service" },
  { id: "housekeeping", label: "Housekeeping" },
  { id: "parking", label: "Parking" },
  { id: "gym", label: "Gym" },
  { id: "studyRoom", label: "Study Room" },
  { id: "commonTV", label: "Common TV Room" },
  { id: "lift", label: "Lift / Elevator" },
  { id: "diningHall", label: "Dining Hall" },
  { id: "kitchenAccess", label: "Kitchen Access" },
  { id: "recreation", label: "Recreation Room" },
  { id: "garden", label: "Garden/Outdoor Area" },
  { id: "solarPower", label: "Solar Power" },
  { id: "waterPurifier", label: "Water Purifier" },
  { id: "firstAid", label: "First Aid Kit" },
  { id: "fireExtinguisher", label: "Fire Extinguisher" },
  { id: "intercom", label: "Intercom" },
  { id: "biometricAccess", label: "Biometric Access" }
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

const ownershipTypeOptions = ["Freehold", "Leasehold", "Co-operative Society", "Individual Ownership"];

export default function LeaseBuilderHostelForm({ isOpen, onClose }) {
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
    city: "", area: "", landmark: "", pinCode: "", nearbyConnectivity: "",
    hostelType: "", roomType: "", sharingType: "", totalCapacity: "",
    bathrooms: "", furnishedStatus: "", totalFloors: "", floorNumber: "",
    facingDirection: "", balcony: "",
    builtUpArea: "", carpetArea: "",
    hostelCategory: "", genderType: "",
    propertyAge: "", ownershipType: "",
    
    // Pricing & Amenities (Step 5)
    leaseAmount: "", budgetRange: { min: "", max: "" }, 
    securityDeposit: "",
    leaseDuration: "", maintenanceIncluded: "",
    paymentFrequency: "", leaseRenewalOption: "",
    tenantType: [], petFriendly: "", dietaryPreference: "", smokingAllowed: "",
    selectedAmenities: [], otherAmenities: "",
    immediateOccupancy: "", availableFrom: "",
    foodIncluded: "", foodType: "", mealsPerDay: "", kitchenAccess: "",
    
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    
    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Documents (Step 8)
    companyLogoDoc: null, companyBrochure: null, projectBrochures: [], companyRegCertDoc: null, reraCertDoc: null, gstCertDoc: null, panCardDoc: null, authIdProof: null, officeAddressProof: null,
    hostelLicense: null, fireSafetyCertificate: null, healthCertificate: null,
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

  const validateStep = (stepNumber) => {
    const newErrors = {};
    let isValid = true;

    switch(stepNumber) {
      case 0: // Company Details
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
          isValid = false;
        }
        if (!formData.companyRegNumber.trim()) {
          newErrors.companyRegNumber = "Registration number is required";
          isValid = false;
        }
        if (!formData.reraNumber.trim()) {
          newErrors.reraNumber = "RERA number is required";
          isValid = false;
        }
        if (!formData.yearsOfExperience || parseInt(formData.yearsOfExperience) <= 0) {
          newErrors.yearsOfExperience = "Years of experience is required";
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
        if (!formData.officePinCode || formData.officePinCode.length !== 6) {
          newErrors.officePinCode = "Please enter a valid 6-digit PIN code";
          isValid = false;
        }
        break;

      case 3: // Identity & Business Verification
        if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
          newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";
          isValid = false;
        }
        if (!formData.panNumber || formData.panNumber.length !== 10) {
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
        if (!formData.city.trim()) {
          newErrors.city = "City is required";
          isValid = false;
        }
        if (!formData.area.trim()) {
          newErrors.area = "Area/Locality is required";
          isValid = false;
        }
        if (!formData.hostelType) {
          newErrors.hostelType = "Please select a hostel type";
          isValid = false;
        }
        if (!formData.hostelCategory) {
          newErrors.hostelCategory = "Please select a hostel category";
          isValid = false;
        }
        if (!formData.genderType) {
          newErrors.genderType = "Please select a gender type";
          isValid = false;
        }
        if (!formData.totalCapacity || parseInt(formData.totalCapacity) <= 0) {
          newErrors.totalCapacity = "Total capacity is required";
          isValid = false;
        }
        if (!formData.roomType) {
          newErrors.roomType = "Please select a room type";
          isValid = false;
        }
        if (!formData.sharingType) {
          newErrors.sharingType = "Please select a sharing type";
          isValid = false;
        }
        if (!formData.bathrooms) {
          newErrors.bathrooms = "Please select a bathroom type";
          isValid = false;
        }
        if (!formData.ownershipType) {
          newErrors.ownershipType = "Please select an ownership type";
          isValid = false;
        }
        break;

      case 5: // Pricing & Amenities
        if (!formData.leaseAmount || parseFloat(formData.leaseAmount) <= 0) {
          newErrors.leaseAmount = "Lease amount is required";
          isValid = false;
        }
        if (!formData.leaseDuration) {
          newErrors.leaseDuration = "Please select a lease duration";
          isValid = false;
        }
        if (!formData.paymentFrequency) {
          newErrors.paymentFrequency = "Please select a payment frequency";
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
        if (!formData.accountNumber || formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
          newErrors.accountNumber = "Please enter a valid account number (9-18 digits)";
          isValid = false;
        }
        if (!formData.ifscCode || !validateIFSC(formData.ifscCode)) {
          newErrors.ifscCode = "Please enter a valid IFSC code (e.g., HDFC0001234)";
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
        if (!formData.companyRegCertDoc) {
          newErrors.companyRegCertDoc = "Company registration certificate is required";
          isValid = false;
        }
        if (!formData.reraCertDoc) {
          newErrors.reraCertDoc = "RERA certificate is required";
          isValid = false;
        }
        if (!formData.panCardDoc) {
          newErrors.panCardDoc = "PAN card is required";
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
          newErrors.declaration1 = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.declaration2) {
          newErrors.declaration2 = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.declaration3) {
          newErrors.declaration3 = "You must accept this declaration";
          isValid = false;
        }
        if (!formData.declaration4) {
          newErrors.declaration4 = "You must accept this declaration";
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
    }
  };

  const removeCompanyLogo = () => {
    if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
    updateForm("companyLogoDoc", null);
    setCompanyLogoPreview(null);
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
    }
  };

  const removeDocument = (docType) => {
    updateForm(docType, null);
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
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Hostel - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List hostel for lease as builder/company</p>
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
            <MobContentLeaseBuilderHostel
              step={step}
              inp={inMob}
              errorBorder={errorBorder}
              formData={formData}
              errors={errors}
              updateForm={updateForm}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              removeDocument={removeDocument}
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
              paymentFrequencyOptions={paymentFrequencyOptions}
              leaseRenewalOptions={leaseRenewalOptions}
              ownershipTypeOptions={ownershipTypeOptions}
              bankOptions={bankOptions}
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Hostel - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List hostel for lease as builder/company</p>
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
            <DtContentLeaseBuilderHostel
              step={step}
              inp={inDt}
              errorBorder={errorBorder}
              formData={formData}
              errors={errors}
              updateForm={updateForm}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handleAlphaNumericFieldChange={handleAlphaNumericFieldChange}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              removeDocument={removeDocument}
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
              paymentFrequencyOptions={paymentFrequencyOptions}
              leaseRenewalOptions={leaseRenewalOptions}
              ownershipTypeOptions={ownershipTypeOptions}
              bankOptions={bankOptions}
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

// ==================== MOBILE CONTENT - Lease Builder Hostel ====================
function MobContentLeaseBuilderHostel({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange,
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, removeDocument,
  toggleAmenity, customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  tenantTypeOptions, leaseDurationOptions, contactTimeOptions,
  hostelLeaseAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  roomTypeOptions, bathroomOptions, genderOptions, hostelTypeOptions,
  paymentFrequencyOptions, leaseRenewalOptions, ownershipTypeOptions,
  bankOptions
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

  // STEP 0: Company Details
  if (step === 0) return (
    <>
      <Field label="Builder / Company Name" required error={errors.companyName}>
        <input className={`${inp} ${errors.companyName ? errorBorder : ''}`} placeholder="Enter company name" value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} />
      </Field>
      <Field label="Company Registration Number" required error={errors.companyRegNumber}>
        <input className={`${inp} ${errors.companyRegNumber ? errorBorder : ''}`} placeholder="Enter registration number" value={formData.companyRegNumber} onChange={(e) => handleAlphaNumericFieldChange(e, updateForm, "companyRegNumber")} />
      </Field>
      <Field label="RERA Registration Number" required error={errors.reraNumber}>
        <input className={`${inp} ${errors.reraNumber ? errorBorder : ''}`} placeholder="Enter RERA number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </Field>
      <Field label="GST Number">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </Field>
      <Field label="Years of Experience" required error={errors.yearsOfExperience}>
        <input className={`${inp} ${errors.yearsOfExperience ? errorBorder : ''}`} type="number" min="0" placeholder="Enter years of experience" value={formData.yearsOfExperience} onChange={(e) => handleNumericFieldChange(e, updateForm, "yearsOfExperience")} />
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
        <input className={`${inp} ${errors.authFullName ? errorBorder : ''}`} placeholder="Enter authorized person's full name" value={formData.authFullName} onChange={(e) => handleAlphaFieldChange(e, updateForm, "authFullName")} />
      </Field>
      <Field label="Designation" required error={errors.authDesignation}>
        <input className={`${inp} ${errors.authDesignation ? errorBorder : ''}`} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={(e) => handleAlphaFieldChange(e, updateForm, "authDesignation")} />
      </Field>
      <Field label="Mobile Number" required error={errors.authMobile}>
        <input className={`${inp} ${errors.authMobile ? errorBorder : ''}`} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={(e) => handleNumericFieldChange(e, updateForm, "authMobile", 10)} />
      </Field>
      <Field label="Email Address" required error={errors.authEmail}>
        <input className={`${inp} ${errors.authEmail ? errorBorder : ''}`} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </Field>
      <Field label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={(e) => handleNumericFieldChange(e, updateForm, "authWhatsapp", 10)} />
      </Field>
      <Field label="Profile Photo" required hint="JPG, PNG max 2MB" error={errors.authPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-authphoto-lease" onChange={handleAuthPhotoUpload} />
          <label htmlFor="m-authphoto-lease" className="cursor-pointer flex flex-col items-center">
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
        <textarea className={`${ta} min-h-[55px] ${errors.officeAddress ? errorBorder : ''}`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </Field>
      <Field label="City" required error={errors.officeCity}>
        <input className={`${inp} ${errors.officeCity ? errorBorder : ''}`} placeholder="Enter city" value={formData.officeCity} onChange={(e) => handleAlphaFieldChange(e, updateForm, "officeCity")} />
      </Field>
      <Field label="District" required error={errors.officeDistrict}>
        <input className={`${inp} ${errors.officeDistrict ? errorBorder : ''}`} placeholder="Enter district" value={formData.officeDistrict} onChange={(e) => handleAlphaFieldChange(e, updateForm, "officeDistrict")} />
      </Field>
      <Field label="State" required error={errors.officeState}>
        <input className={`${inp} ${errors.officeState ? errorBorder : ''}`} placeholder="Enter state" value={formData.officeState} onChange={(e) => handleAlphaFieldChange(e, updateForm, "officeState")} />
      </Field>
      <Field label="PIN Code" required error={errors.officePinCode}>
        <input className={`${inp} ${errors.officePinCode ? errorBorder : ''}`} type="text" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={(e) => handleNumericFieldChange(e, updateForm, "officePinCode", 6)} />
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
        <input className={`${inp} ${errors.aadhaarNumber ? errorBorder : ''}`} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => handleNumericFieldChange(e, updateForm, "aadhaarNumber", 12)} />
      </Field>
      <Field label="PAN Number" required error={errors.panNumber}>
        <input className={`${inp} ${errors.panNumber ? errorBorder : ''}`} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} maxLength="10" />
      </Field>

      <Field label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className={`border-2 border-dashed ${errors.aadhaarCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-authaadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-authaadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>

      <Field label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-authpan-lease" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-authpan-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>

      <Field label="Upload Company Registration Certificate" required error={errors.companyRegCert}>
        <div className={`border-2 border-dashed ${errors.companyRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-companyreg-lease" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="m-companyreg-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCert.name}</p>}
      </Field>

      <Field label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gstcert-lease" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="m-gstcert-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCert.name}</p>}
      </Field>

      <Field label="Upload RERA Certificate" required error={errors.reraCert}>
        <div className={`border-2 border-dashed ${errors.reraCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-reracert-lease" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="m-reracert-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCert.name}</p>}
      </Field>

      <Field label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-companypan-lease" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="m-companypan-lease" className="cursor-pointer flex flex-col items-center">
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
        <h3 className="text-[11px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <Field label="City" required error={errors.city}>
        <input className={`${inp} ${errors.city ? errorBorder : ''}`} placeholder="Enter city name" value={formData.city} onChange={(e) => handleAlphaFieldChange(e, updateForm, "city")} />
      </Field>
      <Field label="Area / Locality" required error={errors.area}>
        <input className={`${inp} ${errors.area ? errorBorder : ''}`} placeholder="Enter area or locality" value={formData.area} onChange={(e) => handleAlphaNumericFieldChange(e, updateForm, "area")} />
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </Field>
      <Field label="PIN Code">
        <input className={inp} type="text" placeholder="Enter PIN code" value={formData.pinCode} onChange={(e) => handleNumericFieldChange(e, updateForm, "pinCode", 6)} />
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
              <input type="radio" name="mob-hostel-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelType === type} onChange={() => updateForm("hostelType", type)} />
              {type}
            </label>
          ))}
        </div>
      </Field>
      
      <Field label="Hostel Category" required error={errors.hostelCategory}>
        <div className="grid grid-cols-2 gap-1">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-category-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-3">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-gender-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Built-up Area (sq.ft)" hint="Enter total built-up area">
        <input className={inp} type="number" min="0" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange(e, updateForm, "builtUpArea")} />
      </Field>
      <Field label="Carpet Area (sq.ft)" hint="Enter carpet area">
        <input className={inp} type="number" min="0" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange(e, updateForm, "carpetArea")} />
      </Field>
      
      <Field label="Total Capacity" required error={errors.totalCapacity}>
        <input className={`${inp} ${errors.totalCapacity ? errorBorder : ''}`} type="number" min="0" placeholder="Total number of beds/occupants" value={formData.totalCapacity} onChange={(e) => handleNumericFieldChange(e, updateForm, "totalCapacity")} />
      </Field>

      <Field label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-room-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType === rt} onChange={() => updateForm("roomType", rt)} />
              {rt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"].map(sh => (
            <label key={sh} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-sharing-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType === sh} onChange={() => updateForm("sharingType", sh)} />
              {sh}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Bathroom Type" required error={errors.bathrooms}>
        <div className="flex gap-3">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-bathroom-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === bt} onChange={() => updateForm("bathrooms", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Furnishing Status">
        <div className="grid grid-cols-2 gap-1">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-furnish-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishedStatus === f} onChange={() => updateForm("furnishedStatus", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Total Floors">
        <input className={inp} type="number" min="0" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => handleNumericFieldChange(e, updateForm, "totalFloors")} />
      </Field>
      <Field label="Floor Number">
        <input className={inp} type="number" min="0" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => handleNumericFieldChange(e, updateForm, "floorNumber")} />
      </Field>
      <Field label="Facing Direction">
        <div className="grid grid-cols-2 gap-1">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-facing-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Balcony">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-balcony-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">📋 Lease Details</h3>
      </div>

      <Field label="Property Age (years)">
        <input className={inp} type="number" min="0" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => handleNumericFieldChange(e, updateForm, "propertyAge")} />
      </Field>

      <Field label="Ownership Type" required error={errors.ownershipType}>
        <div className="flex flex-wrap gap-1">
          {ownershipTypeOptions.map(ot => (
            <label key={ot} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-ownership-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.ownershipType === ot} onChange={() => updateForm("ownershipType", ot)} />
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
              <input type="radio" name="mob-food-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === opt} onChange={() => updateForm("foodIncluded", opt)} />
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
                  <input type="radio" name="mob-food-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                  {ft}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Meals Provided">
            <div className="flex gap-3">
              {["2 Meals/Day", "3 Meals/Day", "Custom/Optional"].map(m => (
                <label key={m} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                  <input type="radio" name="mob-meals-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
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
              <input type="radio" name="mob-kitchen-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === opt} onChange={() => updateForm("kitchenAccess", opt)} />
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
        <input className={`${inp} ${errors.leaseAmount ? errorBorder : ''}`} type="number" min="0" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => handleNumericFieldChange(e, updateForm, "leaseAmount")} />
      </Field>
      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value })} />
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value })} />
        </div>
      </Field>
      <Field label="Security / Deposit Amount (₹)">
        <input className={inp} type="number" min="0" placeholder="Enter security/deposit amount" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange(e, updateForm, "securityDeposit")} />
      </Field>
      <Field label="Lease Duration" required error={errors.leaseDuration}>
        <div className="grid grid-cols-2 gap-1">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-duration-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Payment Frequency" required error={errors.paymentFrequency}>
        <div className="grid grid-cols-2 gap-1">
          {paymentFrequencyOptions.map(pf => (
            <label key={pf} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-payment-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.paymentFrequency === pf} onChange={() => updateForm("paymentFrequency", pf)} />
              {pf}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Maintenance Charges Included">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-maint-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Lease Renewal Option">
        <div className="flex gap-3">
          {leaseRenewalOptions.map(lr => (
            <label key={lr} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-renewal-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === lr} onChange={() => updateForm("leaseRenewalOption", lr)} />
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
              <input type="radio" name="mob-pet-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Dietary Preference">
        <div className="flex gap-4">
          {["Veg Only", "No Restriction"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-diet-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.dietaryPreference === opt} onChange={() => updateForm("dietaryPreference", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Smoking Allowed">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-smoking-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === opt} onChange={() => updateForm("smokingAllowed", opt)} />
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
      <Field label="Immediate Occupancy">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-occupancy-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
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
        <input className={`${inp} ${errors.accountHolderName ? errorBorder : ''}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => handleAlphaFieldChange(e, updateForm, "accountHolderName")} />
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
        <input className={`${inp} ${errors.accountNumber ? errorBorder : ''}`} type="text" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => handleNumericFieldChange(e, updateForm, "accountNumber", 18)} />
      </Field>
      <Field label="IFSC Code" required error={errors.ifscCode}>
        <input className={`${inp} ${errors.ifscCode ? errorBorder : ''}`} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
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
          <input type="file" accept="image/*" className="hidden" id="m-comp-logo-lease" onChange={handleCompanyLogoUpload} />
          <label htmlFor="m-comp-logo-lease" className="cursor-pointer flex flex-col items-center">
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

      <Field label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-comp-brochure-lease" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="m-comp-brochure-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochure</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyBrochure.name}</p>}
      </Field>

      <Field label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-project-brochures-lease" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="m-project-brochures-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochures</span>
            <span className="text-[9px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[10px] text-green-600 mt-1">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </Field>

      <Field label="Company Registration Certificate" required error={errors.companyRegCertDoc}>
        <div className={`border-2 border-dashed ${errors.companyRegCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-comp-reg-doc-lease" onChange={(e) => handleDocumentUpload("companyRegCertDoc", e)} />
          <label htmlFor="m-comp-reg-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCertDoc.name}</p>}
      </Field>

      <Field label="RERA Certificate" required error={errors.reraCertDoc}>
        <div className={`border-2 border-dashed ${errors.reraCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-rera-doc-lease" onChange={(e) => handleDocumentUpload("reraCertDoc", e)} />
          <label htmlFor="m-rera-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCertDoc.name}</p>}
      </Field>

      <Field label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gst-doc-lease" onChange={(e) => handleDocumentUpload("gstCertDoc", e)} />
          <label htmlFor="m-gst-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCertDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required error={errors.panCardDoc}>
        <div className={`border-2 border-dashed ${errors.panCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-pan-doc-lease" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="Authorized Signatory ID Proof" required error={errors.authIdProof}>
        <div className={`border-2 border-dashed ${errors.authIdProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-auth-id-lease" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="m-auth-id-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload ID Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.authIdProof.name}</p>}
      </Field>

      <Field label="Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof-lease" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="m-office-proof-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProof.name}</p>}
      </Field>

      {/* Hostel-specific Documents */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Hostel Documents</h3>
      </div>

      <Field label="Hostel License" required error={errors.hostelLicense}>
        <div className={`border-2 border-dashed ${errors.hostelLicense ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-license-lease-build" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="m-license-lease-build" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Hostel License</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[10px] text-green-600 mt-1">✓ {formData.hostelLicense.name}</p>}
      </Field>

      <Field label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className={`border-2 border-dashed ${errors.fireSafetyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="m-fire-lease-build" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="m-fire-lease-build" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Fire Safety</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.fireSafetyCertificate.name}</p>}
      </Field>

      <Field label="Health Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-health-lease-build" onChange={(e) => handleDocumentUpload("healthCertificate", e)} />
          <label htmlFor="m-health-lease-build" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Health Certificate</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.healthCertificate && <p className="text-[10px] text-green-600 mt-1">✓ {formData.healthCertificate.name}</p>}
      </Field>

      {/* Property Media */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-2.5 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="m-cover-lease-build" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-lease-build" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-lease-build" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-lease-build" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-lease-build" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-lease-build" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-lease-build" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-lease-build" className="cursor-pointer flex flex-col items-center">
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
      {errors.signature && <p className="text-[10px] text-red-500 mt-0.5">{errors.signature}</p>}
      <Field label="Date" required error={errors.signatureDate}>
        <input className={`${inp} ${errors.signatureDate ? errorBorder : ''}`} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${errors.signaturePlace ? errorBorder : ''}`} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange(e, updateForm, "signaturePlace")} />
      </Field>

      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration1 || false} onChange={() => updateForm("declaration1", !formData.declaration1)} />
          <span>I confirm that I am the authorized representative of the builder/company.</span>
        </label>
        {errors.declaration1 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration1}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration2 || false} onChange={() => updateForm("declaration2", !formData.declaration2)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declaration2 && <p className="text-[10px] text-red-500 ml-5">{errors.declaration2}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declaration3 || false} onChange={() => updateForm("declaration3", !formData.declaration3)} />
          <span>I agree to comply with all applicable real estate laws and regulations.</span>
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

// ==================== DESKTOP CONTENT - Lease Builder Hostel ====================
function DtContentLeaseBuilderHostel({ 
  step, inp, errorBorder, formData, errors, updateForm, 
  handleAlphaFieldChange, handleNumericFieldChange, handleAlphaNumericFieldChange,
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, removeDocument,
  toggleAmenity, customAmenitiesList, addCustomAmenity, removeCustomAmenity,
  yesNoOptions, furnishingOptions, facingOptions,
  tenantTypeOptions, leaseDurationOptions, contactTimeOptions,
  hostelLeaseAmenities, toggleArrayItem,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  handleAuthPhotoUpload, authPhotoPreview, removeAuthPhoto,
  handleCompanyLogoUpload, companyLogoPreview, removeCompanyLogo,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  roomTypeOptions, bathroomOptions, genderOptions, hostelTypeOptions,
  paymentFrequencyOptions, leaseRenewalOptions, ownershipTypeOptions,
  bankOptions
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

  // STEP 0: Company Details (Desktop)
  if (step === 0) return (
    <>
      <FieldDt label="Builder / Company Name" required error={errors.companyName}>
        <input className={`${inp} ${errors.companyName ? errorBorder : ''}`} placeholder="Enter company name" value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Registration Number" required error={errors.companyRegNumber}>
        <input className={`${inp} ${errors.companyRegNumber ? errorBorder : ''}`} placeholder="Enter registration number" value={formData.companyRegNumber} onChange={(e) => handleAlphaNumericFieldChange(e, updateForm, "companyRegNumber")} />
      </FieldDt>
      <FieldDt label="RERA Registration Number" required error={errors.reraNumber}>
        <input className={`${inp} ${errors.reraNumber ? errorBorder : ''}`} placeholder="Enter RERA number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="GST Number">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Years of Experience" required error={errors.yearsOfExperience}>
        <input className={`${inp} ${errors.yearsOfExperience ? errorBorder : ''}`} type="number" min="0" placeholder="Enter years of experience" value={formData.yearsOfExperience} onChange={(e) => handleNumericFieldChange(e, updateForm, "yearsOfExperience")} />
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
        <input className={`${inp} ${errors.authFullName ? errorBorder : ''}`} placeholder="Enter authorized person's full name" value={formData.authFullName} onChange={(e) => handleAlphaFieldChange(e, updateForm, "authFullName")} />
      </FieldDt>
      <FieldDt label="Designation" required error={errors.authDesignation}>
        <input className={`${inp} ${errors.authDesignation ? errorBorder : ''}`} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={(e) => handleAlphaFieldChange(e, updateForm, "authDesignation")} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.authMobile}>
        <input className={`${inp} ${errors.authMobile ? errorBorder : ''}`} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={(e) => handleNumericFieldChange(e, updateForm, "authMobile", 10)} />
      </FieldDt>
      <FieldDt label="Email Address" required error={errors.authEmail}>
        <input className={`${inp} ${errors.authEmail ? errorBorder : ''}`} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </FieldDt>
      <FieldDt label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={(e) => handleNumericFieldChange(e, updateForm, "authWhatsapp", 10)} />
      </FieldDt>
      <FieldDt label="Profile Photo" required hint="JPG, PNG max 2MB" error={errors.authPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-authphoto-lease" onChange={handleAuthPhotoUpload} />
          <label htmlFor="dt-authphoto-lease" className="cursor-pointer flex flex-col items-center">
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
        <textarea className={`${ta} min-h-[70px] ${errors.officeAddress ? errorBorder : ''}`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </FieldDt>
      <FieldDt label="City" required error={errors.officeCity}>
        <input className={`${inp} ${errors.officeCity ? errorBorder : ''}`} placeholder="Enter city" value={formData.officeCity} onChange={(e) => handleAlphaFieldChange(e, updateForm, "officeCity")} />
      </FieldDt>
      <FieldDt label="District" required error={errors.officeDistrict}>
        <input className={`${inp} ${errors.officeDistrict ? errorBorder : ''}`} placeholder="Enter district" value={formData.officeDistrict} onChange={(e) => handleAlphaFieldChange(e, updateForm, "officeDistrict")} />
      </FieldDt>
      <FieldDt label="State" required error={errors.officeState}>
        <input className={`${inp} ${errors.officeState ? errorBorder : ''}`} placeholder="Enter state" value={formData.officeState} onChange={(e) => handleAlphaFieldChange(e, updateForm, "officeState")} />
      </FieldDt>
      <FieldDt label="PIN Code" required error={errors.officePinCode}>
        <input className={`${inp} ${errors.officePinCode ? errorBorder : ''}`} type="text" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={(e) => handleNumericFieldChange(e, updateForm, "officePinCode", 6)} />
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
        <input className={`${inp} ${errors.aadhaarNumber ? errorBorder : ''}`} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => handleNumericFieldChange(e, updateForm, "aadhaarNumber", 12)} />
      </FieldDt>
      <FieldDt label="PAN Number" required error={errors.panNumber}>
        <input className={`${inp} ${errors.panNumber ? errorBorder : ''}`} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} maxLength="10" />
      </FieldDt>

      <FieldDt label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className={`border-2 border-dashed ${errors.aadhaarCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-authaadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-authaadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload PAN Card" required error={errors.panCard}>
        <div className={`border-2 border-dashed ${errors.panCard ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-authpan-lease" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-authpan-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company Registration Certificate" required error={errors.companyRegCert}>
        <div className={`border-2 border-dashed ${errors.companyRegCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-companyreg-lease" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="dt-companyreg-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gstcert-lease" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="dt-gstcert-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload RERA Certificate" required error={errors.reraCert}>
        <div className={`border-2 border-dashed ${errors.reraCert ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-reracert-lease" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="dt-reracert-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-companypan-lease" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="dt-companypan-lease" className="cursor-pointer flex flex-col items-center">
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
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <FieldDt label="City" required error={errors.city}>
        <input className={`${inp} ${errors.city ? errorBorder : ''}`} placeholder="Enter city name" value={formData.city} onChange={(e) => handleAlphaFieldChange(e, updateForm, "city")} />
      </FieldDt>
      <FieldDt label="Area / Locality" required error={errors.area}>
        <input className={`${inp} ${errors.area ? errorBorder : ''}`} placeholder="Enter area or locality" value={formData.area} onChange={(e) => handleAlphaNumericFieldChange(e, updateForm, "area")} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
      </FieldDt>
      <FieldDt label="PIN Code">
        <input className={inp} type="text" placeholder="Enter PIN code" value={formData.pinCode} onChange={(e) => handleNumericFieldChange(e, updateForm, "pinCode", 6)} />
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
              <input type="radio" name="dt-hostel-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelType === type} onChange={() => updateForm("hostelType", type)} />
              {type}
            </label>
          ))}
        </div>
      </FieldDt>
      
      <FieldDt label="Hostel Category" required error={errors.hostelCategory}>
        <div className="flex gap-4">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-category-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-4">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Built-up Area (sq.ft)" hint="Enter total built-up area">
        <input className={inp} type="number" min="0" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange(e, updateForm, "builtUpArea")} />
      </FieldDt>
      <FieldDt label="Carpet Area (sq.ft)" hint="Enter carpet area">
        <input className={inp} type="number" min="0" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange(e, updateForm, "carpetArea")} />
      </FieldDt>
      
      <FieldDt label="Total Capacity" required error={errors.totalCapacity}>
        <input className={`${inp} ${errors.totalCapacity ? errorBorder : ''}`} type="number" min="0" placeholder="Total number of beds/occupants" value={formData.totalCapacity} onChange={(e) => handleNumericFieldChange(e, updateForm, "totalCapacity")} />
      </FieldDt>

      <FieldDt label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-room-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType === rt} onChange={() => updateForm("roomType", rt)} />
              {rt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"].map(sh => (
            <label key={sh} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-sharing-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType === sh} onChange={() => updateForm("sharingType", sh)} />
              {sh}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Bathroom Type" required error={errors.bathrooms}>
        <div className="flex gap-4">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bathroom-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === bt} onChange={() => updateForm("bathrooms", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Furnishing Status">
        <div className="flex flex-wrap gap-3">
          {furnishingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-furnish-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishedStatus === f} onChange={() => updateForm("furnishedStatus", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Total Floors">
        <input className={inp} type="number" min="0" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => handleNumericFieldChange(e, updateForm, "totalFloors")} />
      </FieldDt>
      <FieldDt label="Floor Number">
        <input className={inp} type="number" min="0" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => handleNumericFieldChange(e, updateForm, "floorNumber")} />
      </FieldDt>
      <FieldDt label="Facing Direction">
        <div className="grid grid-cols-4 gap-2">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-facing-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Balcony">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-balcony-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📋 Lease Details</h3>
      </div>

      <FieldDt label="Property Age (years)">
        <input className={inp} type="number" min="0" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => handleNumericFieldChange(e, updateForm, "propertyAge")} />
      </FieldDt>

      <FieldDt label="Ownership Type" required error={errors.ownershipType}>
        <div className="flex flex-wrap gap-3">
          {ownershipTypeOptions.map(ot => (
            <label key={ot} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-ownership-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.ownershipType === ot} onChange={() => updateForm("ownershipType", ot)} />
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
              <input type="radio" name="dt-food-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === opt} onChange={() => updateForm("foodIncluded", opt)} />
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
                  <input type="radio" name="dt-food-type-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                  {ft}
                </label>
              ))}
            </div>
          </FieldDt>
          <FieldDt label="Meals Provided">
            <div className="flex gap-4">
              {["2 Meals/Day", "3 Meals/Day", "Custom/Optional"].map(m => (
                <label key={m} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="dt-meals-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
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
              <input type="radio" name="dt-kitchen-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === opt} onChange={() => updateForm("kitchenAccess", opt)} />
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
        <input className={`${inp} ${errors.leaseAmount ? errorBorder : ''}`} type="number" min="0" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => handleNumericFieldChange(e, updateForm, "leaseAmount")} />
      </FieldDt>
      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value })} />
          <input className={`${inp} w-1/2`} type="number" min="0" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value })} />
        </div>
      </FieldDt>
      <FieldDt label="Security / Deposit Amount (₹)">
        <input className={inp} type="number" min="0" placeholder="Enter security/deposit amount" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange(e, updateForm, "securityDeposit")} />
      </FieldDt>
      <FieldDt label="Lease Duration" required error={errors.leaseDuration}>
        <div className="flex flex-wrap gap-3">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-duration-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Payment Frequency" required error={errors.paymentFrequency}>
        <div className="flex flex-wrap gap-3">
          {paymentFrequencyOptions.map(pf => (
            <label key={pf} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-payment-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.paymentFrequency === pf} onChange={() => updateForm("paymentFrequency", pf)} />
              {pf}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges Included">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-maint-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Lease Renewal Option">
        <div className="flex flex-wrap gap-3">
          {leaseRenewalOptions.map(lr => (
            <label key={lr} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-renewal-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === lr} onChange={() => updateForm("leaseRenewalOption", lr)} />
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
              <input type="radio" name="dt-pet-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Dietary Preference">
        <div className="flex gap-5">
          {["Veg Only", "No Restriction"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-diet-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.dietaryPreference === opt} onChange={() => updateForm("dietaryPreference", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Smoking Allowed">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-smoking-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === opt} onChange={() => updateForm("smokingAllowed", opt)} />
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
      <FieldDt label="Immediate Occupancy">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-occupancy-builder" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
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
        <input className={`${inp} ${errors.accountHolderName ? errorBorder : ''}`} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => handleAlphaFieldChange(e, updateForm, "accountHolderName")} />
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
        <input className={`${inp} ${errors.accountNumber ? errorBorder : ''}`} type="text" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => handleNumericFieldChange(e, updateForm, "accountNumber", 18)} />
      </FieldDt>
      <FieldDt label="IFSC Code" required error={errors.ifscCode}>
        <input className={`${inp} ${errors.ifscCode ? errorBorder : ''}`} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
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
          <input type="file" accept="image/*" className="hidden" id="dt-comp-logo-lease" onChange={handleCompanyLogoUpload} />
          <label htmlFor="dt-comp-logo-lease" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company Logo</span>
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

      <FieldDt label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-brochure-lease" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="dt-comp-brochure-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Profile Brochure</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyBrochure.name}</p>}
      </FieldDt>

      <FieldDt label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-project-brochures-lease" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="dt-project-brochures-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Project Brochures</span>
            <span className="text-[11px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[13px] text-green-600 mt-2">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </FieldDt>

      <FieldDt label="Company Registration Certificate" required error={errors.companyRegCertDoc}>
        <div className={`border-2 border-dashed ${errors.companyRegCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-reg-doc-lease" onChange={(e) => handleDocumentUpload("companyRegCertDoc", e)} />
          <label htmlFor="dt-comp-reg-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="RERA Certificate" required error={errors.reraCertDoc}>
        <div className={`border-2 border-dashed ${errors.reraCertDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-rera-doc-lease" onChange={(e) => handleDocumentUpload("reraCertDoc", e)} />
          <label htmlFor="dt-rera-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gst-doc-lease" onChange={(e) => handleDocumentUpload("gstCertDoc", e)} />
          <label htmlFor="dt-gst-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required error={errors.panCardDoc}>
        <div className={`border-2 border-dashed ${errors.panCardDoc ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-doc-lease" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-doc-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Authorized Signatory ID Proof" required error={errors.authIdProof}>
        <div className={`border-2 border-dashed ${errors.authIdProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-auth-id-lease" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="dt-auth-id-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload ID Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.authIdProof.name}</p>}
      </FieldDt>

      <FieldDt label="Office Address Proof" required error={errors.officeAddressProof}>
        <div className={`border-2 border-dashed ${errors.officeAddressProof ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof-lease" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="dt-office-proof-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProof.name}</p>}
      </FieldDt>

      {/* Hostel-specific Documents */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Hostel Documents</h3>
      </div>

      <FieldDt label="Hostel License" required error={errors.hostelLicense}>
        <div className={`border-2 border-dashed ${errors.hostelLicense ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-license-lease-build" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="dt-license-lease-build" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Hostel License</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[13px] text-green-600 mt-2">✓ {formData.hostelLicense.name}</p>}
      </FieldDt>

      <FieldDt label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className={`border-2 border-dashed ${errors.fireSafetyCertificate ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept=".pdf" className="hidden" id="dt-fire-lease-build" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="dt-fire-lease-build" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Fire Safety</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.fireSafetyCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Health Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-health-lease-build" onChange={(e) => handleDocumentUpload("healthCertificate", e)} />
          <label htmlFor="dt-health-lease-build" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Health Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.healthCertificate && <p className="text-[13px] text-green-600 mt-2">✓ {formData.healthCertificate.name}</p>}
      </FieldDt>

      {/* Property Media */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className={`border-2 border-dashed ${errors.coverImage ? 'border-red-500' : 'border-teal-300'} rounded-xl p-3 text-center hover:bg-green-50`}>
          <input type="file" accept="image/*" className="hidden" id="dt-cover-lease-build" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-lease-build" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-lease-build" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-lease-build" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-lease-build" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-lease-build" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-lease-build" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-lease-build" className="cursor-pointer flex flex-col items-center">
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
      {errors.signature && <p className="text-[10px] text-red-500 mt-1">{errors.signature}</p>}
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={`${inp} ${errors.signatureDate ? errorBorder : ''}`} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={`${inp} ${errors.signaturePlace ? errorBorder : ''}`} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange(e, updateForm, "signaturePlace")} />
      </FieldDt>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration1 || false} onChange={() => updateForm("declaration1", !formData.declaration1)} />
          <span>I confirm that I am the authorized representative of the builder/company.</span>
        </label>
        {errors.declaration1 && <p className="text-[10px] text-red-500 ml-6">{errors.declaration1}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration2 || false} onChange={() => updateForm("declaration2", !formData.declaration2)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        {errors.declaration2 && <p className="text-[10px] text-red-500 ml-6">{errors.declaration2}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration3 || false} onChange={() => updateForm("declaration3", !formData.declaration3)} />
          <span>I agree to comply with all applicable real estate laws and regulations.</span>
        </label>
        {errors.declaration3 && <p className="text-[10px] text-red-500 ml-6">{errors.declaration3}</p>}
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declaration4 || false} onChange={() => updateForm("declaration4", !formData.declaration4)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declaration4 && <p className="text-[10px] text-red-500 ml-6">{errors.declaration4}</p>}
      </div>
    </>
  );

  return null;
}