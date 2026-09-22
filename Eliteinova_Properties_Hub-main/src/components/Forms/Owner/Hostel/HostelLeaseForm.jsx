import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, 
  Car, Trees, Building, Lock, Camera, Wifi, Shield, Sun, 
  Coffee, Users, Briefcase, Square, TrendingUp, Clock, 
  FileText, CheckCircle, Sprout, Leaf, Dumbbell, Waves, 
  Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, 
  User, Mail, Phone, Calendar as CalendarIcon, UserCheck, 
  File, MapPin as MapPinIcon, Building as BuildingIcon, 
  Home as HomeIcon, CheckSquare, PenTool, Shield as ShieldIcon,
  AlarmClock, Sparkles, BedDouble, Sofa, Wind, Droplet
} from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

const steps = ["Owner Details", "Identity Verification", "Property Details", "Pricing & Amenities", "Media Upload", "Legal Documents", "Bank Details", "Communication & Declaration"];
const subtitles = [
  "Enter your personal information",
  "Verify your identity",
  "Tell us about your hostel property",
  "Set pricing & select amenities",
  "Upload property photos & video",
  "Upload legal documents",
  "Enter bank details",
  "Set preferences & confirm"
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

// FieldDt Component for Desktop with error support
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

// Input styles
const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";

// Hostel-specific options
const hostelTypeOptions = ["Boys Hostel", "Girls Hostel", "Co-Living Space", "Working Professional Hostel"];
const roomTypeOptions = ["AC Room", "Non-AC Room", "Executive Room", "Dormitory", "Studio Room"];
const bathroomOptions = ["Attached", "Common", "Shared"];
const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
const sharingOptions = ["Single", "Double", "Triple", "4-Sharing", "Dormitory", "Bunk Bed"];
const yesNoOptions = ["Yes", "No"];

// Lease-specific options
const leaseDurationOptions = ["1 Year", "2 Years", "3 Years", "5+ Years"];
const occupancyTypeOptions = ["Student", "Working Professional", "Family", "Company Lease", "Vacation Stay"];
const paymentFrequencyOptions = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const bankOptions = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"];

// Hostel Amenities
const availableAmenities = [
  "WiFi", "AC", "Hot Water", "24/7 Security", "CCTV Surveillance", 
  "Power Backup", "Laundry Service", "Housekeeping", "Parking",
  "Gym", "Study Room", "Common TV Room", "Lift/Elevator",
  "Dining Hall", "Kitchen Access", "Recreation Room", "Garden/Outdoor Area",
  "Solar Power", "Rainwater Harvesting", "Water Purifier", "First Aid Kit",
  "Fire Extinguisher", "Emergency Services", "Intercom", "Biometric Access"
];

// Food & Mess Options
const foodTypeOptions = ["Veg", "Non-Veg", "Both", "Custom"];
const mealOptions = ["2 Meals/Day", "3 Meals/Day", "Custom/Optional"];

export default function HostelLeaseForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Owner Details (Step 0)
    ownerName: "", contactNumber: "", emailId: "", gender: "",
    // Identity Verification (Step 1)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, passportPhoto: null,
    addressLine1: "", addressLine2: "", city: "", district: "", state: "", pinCode: "",
    // Property Details (Step 2)
    propertyTitle: "", propertyType: "", propertyAddress: "",
    propertyCity: "", builtUpArea: "", carpetArea: "",
    numberOfRooms: "", numberOfBathrooms: "", roomType: [], bathroomType: "",
    furnishingStatus: "", sharingType: [], totalCapacity: "",
    // Hostel-specific (Step 2)
    hostelCategory: "", genderType: "", ageGroup: "", foodIncluded: "",
    foodType: "", mealsPerDay: "", kitchenAccess: "",
    // Property Category & Posted By
    propertyCategory: "hostel", postedBy: "owner",
    // Pricing & Amenities (Step 3)
    listingPurpose: "lease", expectedPrice: "", budgetRange: { min: "", max: "" },
    priceType: "", maintenance: "", securityDeposit: "",
    availableFrom: "", selectedAmenities: [], otherAmenities: "",
    paymentFrequency: "",
    // Lease Preferences (Step 3)
    leaseDuration: "", occupancyType: "", 
    leasePetFriendly: "", smokingAllowed: "", alcoholAllowed: "",
    // Media (Step 4)
    propertyImages: [], propertyVideo: null, coverImage: null,
    // Legal Documents (Step 5)
    saleDeed: null, pattaChitta: null, encumbranceCertificate: null, propertyTaxReceipt: null,
    buildingApprovalPlan: null, completionCertificate: null, occupancyCertificate: null,
    leaseAgreement: null, otherSupportingDocs: [], floorPlan: null,
    // Hostel-specific documents
    hostelLicense: null, fireSafetyCertificate: null, healthCertificate: null,
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    // Communication Preferences (Step 7)
    preferredContactMethod: [], preferredContactTime: "",
    declarationAccepted: false,
    declarationAccurate: false,
    declarationTerms: false,
    // Signature
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

  // Validation helper functions
  const isOnlyLetters = (value) => /^[A-Za-z\s]+$/.test(value);
  const isOnlyNumbers = (value) => /^[0-9]+$/.test(value);
  const isOnlyLettersAndNumbers = (value) => /^[A-Za-z0-9\s]+$/.test(value);
  const isSixDigitPinCode = (value) => /^[0-9]{6}$/.test(value);
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

  // Specialized handlers with validation
  const handleAlphaFieldChange = (field, value) => {
    // Only allow letters and spaces
    const filtered = value.replace(/[^A-Za-z\s]/g, '');
    updateForm(field, filtered);
  };

  const handleNumericFieldChange = (field, value) => {
    // Only allow digits
    const filtered = value.replace(/[^0-9]/g, '');
    updateForm(field, filtered);
  };

  const handlePinCodeChange = (value) => {
    // Only allow digits, max 6 characters
    const filtered = value.replace(/[^0-9]/g, '').slice(0, 6);
    updateForm('pinCode', filtered);
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

  const handlePassportUpload = (docType, e, maxSize = 2) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert(`${docType} must be a JPG, JPEG, or PNG file`);
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

  const toggleAmenity = (amenity) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenity)) {
      updateForm("selectedAmenities", current.filter(a => a !== amenity));
    } else {
      updateForm("selectedAmenities", [...current, amenity]);
    }
  };

  const toggleContactMethod = (method) => {
    const current = formData.preferredContactMethod;
    if (current.includes(method)) {
      updateForm("preferredContactMethod", current.filter(m => m !== method));
    } else {
      updateForm("preferredContactMethod", [...current, method]);
    }
  };

  const toggleRoomType = (rt) => {
    const current = formData.roomType;
    if (current.includes(rt)) {
      updateForm("roomType", current.filter(r => r !== rt));
    } else {
      updateForm("roomType", [...current, rt]);
    }
  };

  const toggleSharingType = (sh) => {
    const current = formData.sharingType;
    if (current.includes(sh)) {
      updateForm("sharingType", current.filter(s => s !== sh));
    } else {
      updateForm("sharingType", [...current, sh]);
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
      if (!formData.ownerName.trim()) e.ownerName = "Full name is required";
      else if (!isOnlyLetters(formData.ownerName)) e.ownerName = "Name should contain only letters and spaces";
      if (!formData.contactNumber || formData.contactNumber.length !== 10) e.contactNumber = "Enter a valid 10-digit mobile number";
      if (!formData.contactNumber.match(/^[0-9]{10}$/)) e.contactNumber = "Mobile number must contain only digits";
      if (!formData.emailId || !isValidEmail(formData.emailId)) e.emailId = "Enter a valid email address";
      if (!formData.gender) e.gender = "Please select your gender";
    }
    if (s === 1) {
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) e.aadhaarNumber = "Aadhaar number must be exactly 12 digits";
      if (!formData.aadhaarNumber.match(/^[0-9]{12}$/)) e.aadhaarNumber = "Aadhaar number must contain only numbers";
      if (!formData.aadhaarCard) e.aadhaarCard = "Aadhaar card upload is required";
      if (!formData.passportPhoto) e.passportPhoto = "Passport-size photo is required";
      if (!formData.addressLine1.trim()) e.addressLine1 = "Address Line 1 is required";
      if (!formData.city.trim()) e.city = "City is required";
      else if (!isOnlyLetters(formData.city)) e.city = "City should contain only letters and spaces";
      if (!formData.district.trim()) e.district = "District is required";
      else if (!isOnlyLetters(formData.district)) e.district = "District should contain only letters and spaces";
      if (!formData.state.trim()) e.state = "State is required";
      else if (!isOnlyLetters(formData.state)) e.state = "State should contain only letters and spaces";
      if (!formData.pinCode.trim()) e.pinCode = "PIN code is required";
      else if (!isSixDigitPinCode(formData.pinCode)) e.pinCode = "PIN code must be exactly 6 digits";
    }
    if (s === 2) {
      if (!formData.propertyTitle.trim()) e.propertyTitle = "Hostel title is required";
      if (!formData.propertyType) e.propertyType = "Please select a hostel type";
      if (!formData.hostelCategory) e.hostelCategory = "Please select a hostel category";
      if (!formData.genderType) e.genderType = "Please select gender type";
      if (!formData.propertyAddress.trim()) e.propertyAddress = "Property address is required";
      if (!formData.propertyCity.trim()) e.propertyCity = "Property city is required";
      else if (!isOnlyLetters(formData.propertyCity)) e.propertyCity = "Property city should contain only letters and spaces";
      if (!formData.builtUpArea) e.builtUpArea = "Build-up area is required";
      else if (!isOnlyNumbers(formData.builtUpArea)) e.builtUpArea = "Build-up area must be a number";
      if (!formData.carpetArea) e.carpetArea = "Carpet area is required";
      else if (!isOnlyNumbers(formData.carpetArea)) e.carpetArea = "Carpet area must be a number";
      if (!formData.numberOfRooms) e.numberOfRooms = "Number of rooms is required";
      else if (!isOnlyNumbers(formData.numberOfRooms)) e.numberOfRooms = "Number of rooms must be a number";
      if (!formData.totalCapacity) e.totalCapacity = "Total capacity is required";
      else if (!isOnlyNumbers(formData.totalCapacity)) e.totalCapacity = "Total capacity must be a number";
      if (!formData.roomType.length) e.roomType = "Please select at least one room type";
      if (!formData.sharingType.length) e.sharingType = "Please select at least one sharing type";
      if (!formData.bathroomType) e.bathroomType = "Please select a bathroom type";
      if (!formData.furnishingStatus) e.furnishingStatus = "Please select furnishing status";
      if (!formData.leaseDuration) e.leaseDuration = "Please select lease duration";
      if (!formData.occupancyType) e.occupancyType = "Please select occupancy type";
      if (!formData.paymentFrequency) e.paymentFrequency = "Please select payment frequency";
    }
    if (s === 3) {
      if (!formData.expectedPrice) e.expectedPrice = "Expected lease amount is required";
      else if (!isOnlyNumbers(formData.expectedPrice)) e.expectedPrice = "Expected lease amount must be a number";
      if (!formData.priceType) e.priceType = "Please select price type";
      if (formData.securityDeposit && !isOnlyNumbers(formData.securityDeposit)) e.securityDeposit = "Security deposit must be a number";
      if (formData.maintenance && !isOnlyNumbers(formData.maintenance)) e.maintenance = "Maintenance must be a number";
    }
    if (s === 4) {
      if (!formData.coverImage) e.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) e.propertyImages = "At least one property photo is required";
    }
    if (s === 5) {
      if (!formData.floorPlan) e.floorPlan = "Floor plan is required";
      if (!formData.hostelLicense) e.hostelLicense = "Hostel license is required";
      if (!formData.fireSafetyCertificate) e.fireSafetyCertificate = "Fire safety certificate is required";
    }
    if (s === 6) {
      if (!formData.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
      else if (!isOnlyLetters(formData.accountHolderName)) e.accountHolderName = "Account holder name should contain only letters and spaces";
      if (!formData.accountNumber) e.accountNumber = "Account number is required";
      else if (!formData.accountNumber.match(/^[0-9]{9,18}$/)) e.accountNumber = "Account number must be between 9-18 digits";
      if (!formData.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      if (!formData.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) e.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
      if (!formData.bankName) e.bankName = "Bank name is required";
    }
    if (s === 7) {
      if (!formData.signature) e.signature = "Please draw your signature";
      if (!formData.signatureDate) e.signatureDate = "Date is required";
      if (!formData.signaturePlace.trim()) e.signaturePlace = "Place is required";
      else if (!isOnlyLetters(formData.signaturePlace)) e.signaturePlace = "Place should contain only letters and spaces";
      
      // Check each declaration individually
      if (!formData.declarationAccepted) {
        e.declarationAccepted = "You must confirm that you are the legal owner or authorized representative";
      }
      if (!formData.declarationAccurate) {
        e.declarationAccurate = "You must certify that all information is accurate";
      }
      if (!formData.declarationTerms) {
        e.declarationTerms = "You must agree to the Terms & Conditions and Privacy Policy";
      }
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
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Hostel</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List your hostel for lease</p>
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
            <MobContentLease
              step={step}
              inp={inMob}
              formData={formData}
              updateForm={updateForm}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              handlePassportUpload={handlePassportUpload}
              toggleAmenity={toggleAmenity}
              availableAmenities={availableAmenities}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              hostelTypeOptions={hostelTypeOptions}
              roomTypeOptions={roomTypeOptions}
              bathroomOptions={bathroomOptions}
              furnishingOptions={furnishingOptions}
              sharingOptions={sharingOptions}
              yesNoOptions={yesNoOptions}
              leaseDurationOptions={leaseDurationOptions}
              occupancyTypeOptions={occupancyTypeOptions}
              paymentFrequencyOptions={paymentFrequencyOptions}
              foodTypeOptions={foodTypeOptions}
              mealOptions={mealOptions}
              bankOptions={bankOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              toggleContactMethod={toggleContactMethod}
              toggleRoomType={toggleRoomType}
              toggleSharingType={toggleSharingType}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              errors={errors}
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Hostel</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List your hostel for lease</p>
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
            <DtContentLease
              step={step}
              inp={inDt}
              formData={formData}
              updateForm={updateForm}
              handleAlphaFieldChange={handleAlphaFieldChange}
              handleNumericFieldChange={handleNumericFieldChange}
              handlePinCodeChange={handlePinCodeChange}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              handlePassportUpload={handlePassportUpload}
              toggleAmenity={toggleAmenity}
              availableAmenities={availableAmenities}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              hostelTypeOptions={hostelTypeOptions}
              roomTypeOptions={roomTypeOptions}
              bathroomOptions={bathroomOptions}
              furnishingOptions={furnishingOptions}
              sharingOptions={sharingOptions}
              yesNoOptions={yesNoOptions}
              leaseDurationOptions={leaseDurationOptions}
              occupancyTypeOptions={occupancyTypeOptions}
              paymentFrequencyOptions={paymentFrequencyOptions}
              foodTypeOptions={foodTypeOptions}
              mealOptions={mealOptions}
              bankOptions={bankOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              toggleContactMethod={toggleContactMethod}
              toggleRoomType={toggleRoomType}
              toggleSharingType={toggleSharingType}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              errors={errors}
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

// MOBILE CONTENT - HOSTEL LEASE
function MobContentLease({ step, inp, formData, updateForm, handleAlphaFieldChange, handleNumericFieldChange, handlePinCodeChange, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, handlePassportUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, hostelTypeOptions, roomTypeOptions, bathroomOptions, furnishingOptions, sharingOptions, yesNoOptions, leaseDurationOptions, occupancyTypeOptions, paymentFrequencyOptions, foodTypeOptions, mealOptions, bankOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, toggleContactMethod, toggleRoomType, toggleSharingType, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints, errors }) {
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

  // STEP 0: Owner Details
  if (step === 0) return (
    <>
      <Field label="Full Name" required error={errors.ownerName}>
        <input className={inp} placeholder="Enter your full name" value={formData.ownerName} onChange={(e) => handleAlphaFieldChange("ownerName", e.target.value)} />
      </Field>
      <Field label="Mobile Number" required error={errors.contactNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.contactNumber} onChange={(e) => updateForm("contactNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} />
      </Field>
      <Field label="Email Address" required hint="We'll send listing updates to this email" error={errors.emailId}>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
      </Field>
      <Field label="Gender" required error={errors.gender}>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-gender" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  // STEP 1: Identity Verification
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Identity Verification</h3>
      </div>
      <Field label="Aadhaar Number" required error={errors.aadhaarNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={12} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} />
      </Field>
      <Field label="PAN Number">
        <input className={inp} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} />
      </Field>
      <Field label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-aadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>
      <Field label="Upload PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-lease" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-pan-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>
      <Field label="Upload Passport-size Photo" required error={errors.passportPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-passport-lease" onChange={(e) => handlePassportUpload("passportPhoto", e)} />
          <label htmlFor="m-passport-lease" className="cursor-pointer flex flex-col items-center">
            <User className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photo</span>
            <span className="text-[9px] text-gray-400">JPG, JPEG, PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.passportPhoto && <p className="text-[10px] text-green-600 mt-1">✓ {formData.passportPhoto.name}</p>}
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Address Details</h3>
      </div>
      <Field label="Address Line 1" required error={errors.addressLine1}>
        <input className={inp} placeholder="House number, building, street" value={formData.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
      </Field>
      <Field label="Address Line 2">
        <input className={inp} placeholder="Apartment, suite, unit" value={formData.addressLine2} onChange={(e) => updateForm("addressLine2", e.target.value)} />
      </Field>
      <Field label="City" required error={errors.city}>
        <input className={inp} placeholder="Enter city" value={formData.city} onChange={(e) => handleAlphaFieldChange("city", e.target.value)} />
      </Field>
      <Field label="District" required error={errors.district}>
        <input className={inp} placeholder="Enter district" value={formData.district} onChange={(e) => handleAlphaFieldChange("district", e.target.value)} />
      </Field>
      <Field label="State" required error={errors.state}>
        <input className={inp} placeholder="Enter state" value={formData.state} onChange={(e) => handleAlphaFieldChange("state", e.target.value)} />
      </Field>
      <Field label="PIN Code" required error={errors.pinCode}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
      </Field>
    </>
  );

  // STEP 2: Property Details
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Hostel Property Details</h3>
      </div>
      <Field label="Hostel Title / Name" required error={errors.propertyTitle}>
        <input className={inp} placeholder="e.g. Green Valley Hostel" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value)} />
      </Field>

      <Field label="Hostel Type" required error={errors.propertyType}>
        {hostelTypeOptions.map(t => (
          <label key={t} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-hostel-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={() => updateForm("propertyType", t)} />
            {t}
          </label>
        ))}
      </Field>

      <Field label="Hostel Category" required error={errors.hostelCategory}>
        <div className="grid grid-cols-2 gap-1.5">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-category" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-3">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-gender-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Property Address" required error={errors.propertyAddress}>
        <textarea className={`${ta} min-h-[55px]`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={(e) => updateForm("propertyAddress", e.target.value)} />
      </Field>
      <Field label="Property City" required error={errors.propertyCity}>
        <input className={inp} placeholder="Enter property city name" value={formData.propertyCity} onChange={(e) => handleAlphaFieldChange("propertyCity", e.target.value)} />
      </Field>

      <Field label="Area Details" required hint="In square feet">
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <input className={inp} type="text" inputMode="numeric" placeholder="Build-up Area" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
            {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
          </div>
          <div>
            <input className={inp} type="text" inputMode="numeric" placeholder="Carpet Area" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
            {errors.carpetArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.carpetArea}</p>}
          </div>
        </div>
      </Field>

      <Field label="Number of Rooms" required error={errors.numberOfRooms}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Total rooms" value={formData.numberOfRooms} onChange={(e) => handleNumericFieldChange("numberOfRooms", e.target.value)} />
      </Field>

      <Field label="Total Capacity" required hint="Total number of beds/occupants" error={errors.totalCapacity}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Total capacity" value={formData.totalCapacity} onChange={(e) => handleNumericFieldChange("totalCapacity", e.target.value)} />
      </Field>

      <Field label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1.5">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType.includes(rt)} onChange={() => toggleRoomType(rt)} />
              {rt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1.5">
          {sharingOptions.map(sh => (
            <label key={sh} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType.includes(sh)} onChange={() => toggleSharingType(sh)} />
              {sh}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Bathroom Type" required error={errors.bathroomType}>
        <div className="flex gap-3">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-bathroom" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathroomType === bt} onChange={() => updateForm("bathroomType", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Furnishing Status" required error={errors.furnishingStatus}>
        {furnishingOptions.map(f => (
          <label key={f} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-furnish" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={() => updateForm("furnishingStatus", f)} />
            {f}
          </label>
        ))}
      </Field>

      {/* Food & Mess Section */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Food & Mess</h3>
      </div>

      <Field label="Food Included">
        <div className="flex gap-3">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-food" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === option} onChange={() => updateForm("foodIncluded", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>

      {formData.foodIncluded === "Yes" && (
        <>
          <Field label="Food Type">
            {foodTypeOptions.map(ft => (
              <label key={ft} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
                <input type="radio" name="mob-food-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                {ft}
              </label>
            ))}
          </Field>

          <Field label="Meals Provided">
            {mealOptions.map(m => (
              <label key={m} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
                <input type="radio" name="mob-meals" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
                {m}
              </label>
            ))}
          </Field>
        </>
      )}

      <Field label="Kitchen Access">
        <div className="flex gap-3">
          {["Yes", "No", "Limited"].map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-kitchen" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === option} onChange={() => updateForm("kitchenAccess", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>

      {/* Lease Preferences */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Lease Preferences</h3>
      </div>

      <Field label="Lease Duration" required error={errors.leaseDuration}>
        {leaseDurationOptions.map(d => (
          <label key={d} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-lease-duration" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
            {d}
          </label>
        ))}
      </Field>

      <Field label="Occupancy Type" required error={errors.occupancyType}>
        {occupancyTypeOptions.map(ot => (
          <label key={ot} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-occupancy" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyType === ot} onChange={() => updateForm("occupancyType", ot)} />
            {ot}
          </label>
        ))}
      </Field>

      <Field label="Payment Frequency" required error={errors.paymentFrequency}>
        {paymentFrequencyOptions.map(pf => (
          <label key={pf} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-payment" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.paymentFrequency === pf} onChange={() => updateForm("paymentFrequency", pf)} />
            {pf}
          </label>
        ))}
      </Field>

      <Field label="Pet Friendly">
        <div className="flex gap-3">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-pet" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leasePetFriendly === option} onChange={() => updateForm("leasePetFriendly", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Smoking Allowed">
        <div className="flex gap-3">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-smoking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === option} onChange={() => updateForm("smokingAllowed", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Alcohol Allowed">
        <div className="flex gap-3">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-alcohol" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.alcoholAllowed === option} onChange={() => updateForm("alcoholAllowed", option)} />
              {option}
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
        <h3 className="text-[11px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>

      <Field label="Expected Lease (₹/month)" required error={errors.expectedPrice}>
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 15,000" value={formData.expectedPrice} onChange={(e) => handleNumericFieldChange("expectedPrice", e.target.value)} />
      </Field>

      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={inp} type="text" inputMode="numeric" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9]/g, '') })} />
          <input className={inp} type="text" inputMode="numeric" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      </Field>

      <Field label="Security Deposit (₹)" hint="Enter the refundable deposit amount">
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 30,000" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange("securityDeposit", e.target.value)} />
        {errors.securityDeposit && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDeposit}</p>}
      </Field>

      <Field label="Price Type" required error={errors.priceType}>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>

      <Field label="Maintenance (₹/month)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter monthly maintenance" value={formData.maintenance} onChange={(e) => handleNumericFieldChange("maintenance", e.target.value)} />
        {errors.maintenance && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.maintenance}</p>}
      </Field>

      <Field label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </Field>

      <Field label="Amenities">
        <div className="flex flex-wrap gap-1 mt-0.5">
          {availableAmenities.map(a => (
            <span key={a} onClick={() => toggleAmenity(a)} className={`px-1.5 py-0.5 text-[10px] rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
              {a}
            </span>
          ))}
          {customAmenitiesList.map(a => (
            <span key={a} className="px-1.5 py-0.5 text-[10px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {a}
              <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
            </span>
          ))}
        </div>
      </Field>

      <Field label="Other Amenities">
        <div className="flex gap-1">
          <input className={`${inp} flex-1`} placeholder="e.g. Play Area, Study Room..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-2 py-1 text-[11px] bg-[#00695C] text-white rounded-lg">Add</button>
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
      <p className="text-[10px] text-center text-gray-400 mb-2">📸 Upload hostel photos and media</p>
      
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-cover" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid" onChange={handleVideoUpload} />
          <label htmlFor="m-vid" className="cursor-pointer flex flex-col items-center">
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

  // STEP 5: Legal Documents
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Legal Documents</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">All documents must be in PDF format (Max 5MB each)</p>
      
      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan" className="cursor-pointer flex flex-col items-center">
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

      <Field label="Sale Deed">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-saleDeed" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="m-saleDeed" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.saleDeed.name}</p>}
      </Field>

      <Field label="Patta / Chitta">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-patta" onChange={(e) => handleDocumentUpload("pattaChitta", e)} />
          <label htmlFor="m-patta" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.pattaChitta && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.pattaChitta.name}</p>}
      </Field>

      <Field label="Hostel License" required error={errors.hostelLicense}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-license" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="m-license" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload Hostel License</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.hostelLicense.name}</p>}
      </Field>

      <Field label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-fire" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="m-fire" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload Fire Safety</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.fireSafetyCertificate.name}</p>}
      </Field>

      <Field label="Health Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-health" onChange={(e) => handleDocumentUpload("healthCertificate", e)} />
          <label htmlFor="m-health" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload Health Certificate</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.healthCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.healthCertificate.name}</p>}
      </Field>

      <Field label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-tax" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="m-tax" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.propertyTaxReceipt.name}</p>}
      </Field>

      <Field label="Lease Agreement">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-leaseAgreement" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="m-leaseAgreement" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.leaseAgreement.name}</p>}
      </Field>

      <Field label="Other Supporting Documents">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-otherDocs" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("otherSupportingDocs", [...formData.otherSupportingDocs, ...validFiles]);
          }} />
          <label htmlFor="m-otherDocs" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Additional Documents</span>
            <span className="text-[9px] text-gray-400">PDF only, multiple allowed</span>
          </label>
        </div>
        {formData.otherSupportingDocs.length > 0 && (
          <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.otherSupportingDocs.length} file(s) uploaded</p>
        )}
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
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Account Number" required error={errors.accountNumber}>
        <input className={inp} type="text" inputMode="numeric" maxLength={18} placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value.replace(/[^0-9]/g, "").slice(0, 18))} />
      </Field>
      <Field label="IFSC Code" required error={errors.ifscCode}>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
      </Field>
      <Field label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </Field>
    </>
  );

  // STEP 7: Communication & Declaration
  if (step === 7) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Communication Preferences</h3>
      </div>
      <Field label="Preferred Contact Method">
        <div className="flex flex-wrap gap-2">
          {["Phone Call", "WhatsApp", "Email"].map(method => (
            <label key={method} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactMethod.includes(method)} onChange={() => toggleContactMethod(method)} />
              {method}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Preferred Contact Time">
        <div className="flex flex-wrap gap-2">
          {["Morning", "Afternoon", "Evening", "Anytime"].map(time => (
            <label key={time} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-contactTime" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === time} onChange={() => updateForm("preferredContactTime", time)} />
              {time}
            </label>
          ))}
        </div>
      </Field>

      {/* Signature Section */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[11px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-3.5 h-3.5" /> Owner Signature <span className="text-red-500">*</span>
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
      <Field label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange("signaturePlace", e.target.value)} />
      </Field>

      {/* Declaration - Independent Checkboxes */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-2">
        <div>
          <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
            <span>I confirm that I am the legal owner or an authorized representative of this hostel property.</span>
          </label>
          {errors.declarationAccepted && (
            <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccepted}</p>
          )}
        </div>
        
        <div>
          <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
            <span>I certify that all information and documents provided are accurate and authentic.</span>
          </label>
          {errors.declarationAccurate && (
            <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccurate}</p>
          )}
        </div>
        
        <div>
          <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
            <span>I agree to the Terms & Conditions and Privacy Policy.</span>
          </label>
          {errors.declarationTerms && (
            <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationTerms}</p>
          )}
        </div>
      </div>
    </>
  );

  return null;
}

// DESKTOP CONTENT - HOSTEL LEASE
function DtContentLease({ step, inp, formData, updateForm, handleAlphaFieldChange, handleNumericFieldChange, handlePinCodeChange, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, handlePassportUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, hostelTypeOptions, roomTypeOptions, bathroomOptions, furnishingOptions, sharingOptions, yesNoOptions, leaseDurationOptions, occupancyTypeOptions, paymentFrequencyOptions, foodTypeOptions, mealOptions, bankOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, toggleContactMethod, toggleRoomType, toggleSharingType, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints, errors }) {
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

  // STEP 0: Owner Details (Desktop)
  if (step === 0) return (
    <>
      <FieldDt label="Full Name" required error={errors.ownerName}>
        <input className={inp} placeholder="Enter your full name" value={formData.ownerName} onChange={(e) => handleAlphaFieldChange("ownerName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.contactNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.contactNumber} onChange={(e) => updateForm("contactNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} />
      </FieldDt>
      <FieldDt label="Email Address" required hint="We'll send listing updates to this email" error={errors.emailId}>
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
      </FieldDt>
      <FieldDt label="Gender" required error={errors.gender}>
        <div className="flex gap-5">
          {["Male", "Female", "Other"].map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 1: Identity Verification (Desktop)
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Identity Verification</h3>
      </div>
      <FieldDt label="Aadhaar Number" required error={errors.aadhaarNumber}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={12} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} />
      </FieldDt>
      <FieldDt label="PAN Number">
        <input className={inp} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} />
      </FieldDt>
      <FieldDt label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-aadhaar" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>
      <FieldDt label="Upload PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-pan" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>
      <FieldDt label="Upload Passport-size Photo" required error={errors.passportPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-passport" onChange={(e) => handlePassportUpload("passportPhoto", e)} />
          <label htmlFor="dt-passport" className="cursor-pointer flex flex-col items-center">
            <User className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Photo</span>
            <span className="text-[11px] text-gray-400">JPG, JPEG, PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.passportPhoto && <p className="text-[13px] text-green-600 mt-2">✓ {formData.passportPhoto.name}</p>}
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Address Details</h3>
      </div>
      <FieldDt label="Address Line 1" required error={errors.addressLine1}>
        <input className={inp} placeholder="House number, building, street" value={formData.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
      </FieldDt>
      <FieldDt label="Address Line 2">
        <input className={inp} placeholder="Apartment, suite, unit" value={formData.addressLine2} onChange={(e) => updateForm("addressLine2", e.target.value)} />
      </FieldDt>
      <FieldDt label="City" required error={errors.city}>
        <input className={inp} placeholder="Enter city" value={formData.city} onChange={(e) => handleAlphaFieldChange("city", e.target.value)} />
      </FieldDt>
      <FieldDt label="District" required error={errors.district}>
        <input className={inp} placeholder="Enter district" value={formData.district} onChange={(e) => handleAlphaFieldChange("district", e.target.value)} />
      </FieldDt>
      <FieldDt label="State" required error={errors.state}>
        <input className={inp} placeholder="Enter state" value={formData.state} onChange={(e) => handleAlphaFieldChange("state", e.target.value)} />
      </FieldDt>
      <FieldDt label="PIN Code" required error={errors.pinCode}>
        <input className={inp} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 2: Property Details (Desktop)
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Hostel Property Details</h3>
      </div>
      <FieldDt label="Hostel Title / Name" required error={errors.propertyTitle}>
        <input className={inp} placeholder="e.g. Green Valley Hostel" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value)} />
      </FieldDt>

      <FieldDt label="Hostel Type" required error={errors.propertyType}>
        <div className="grid grid-cols-2 gap-1">
          {hostelTypeOptions.map(t => (
            <label key={t} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-hostel-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={() => updateForm("propertyType", t)} />
              {t}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Hostel Category" required error={errors.hostelCategory}>
        <div className="flex gap-4">
          {["Premium", "Standard", "Budget", "Luxury"].map(cat => (
            <label key={cat} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-category" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.hostelCategory === cat} onChange={() => updateForm("hostelCategory", cat)} />
              {cat}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Gender Type" required error={errors.genderType}>
        <div className="flex gap-4">
          {["Boys Only", "Girls Only", "Co-Ed"].map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.genderType === g} onChange={() => updateForm("genderType", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Property Address" required error={errors.propertyAddress}>
        <textarea className={`${ta} min-h-[70px]`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={(e) => updateForm("propertyAddress", e.target.value)} />
      </FieldDt>
      <FieldDt label="Property City" required error={errors.propertyCity}>
        <input className={inp} placeholder="Enter property city name" value={formData.propertyCity} onChange={(e) => handleAlphaFieldChange("propertyCity", e.target.value)} />
      </FieldDt>

      <FieldDt label="Area Details" required hint="In square feet">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input className={inp} type="text" inputMode="numeric" placeholder="Build-up Area" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
            {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
          </div>
          <div>
            <input className={inp} type="text" inputMode="numeric" placeholder="Carpet Area" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
            {errors.carpetArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.carpetArea}</p>}
          </div>
        </div>
      </FieldDt>

      <FieldDt label="Number of Rooms" required error={errors.numberOfRooms}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Total rooms" value={formData.numberOfRooms} onChange={(e) => handleNumericFieldChange("numberOfRooms", e.target.value)} />
      </FieldDt>

      <FieldDt label="Total Capacity" required hint="Total number of beds/occupants" error={errors.totalCapacity}>
        <input className={inp} type="text" inputMode="numeric" placeholder="Total capacity" value={formData.totalCapacity} onChange={(e) => handleNumericFieldChange("totalCapacity", e.target.value)} />
      </FieldDt>

      <FieldDt label="Room Type" required error={errors.roomType}>
        <div className="grid grid-cols-2 gap-1">
          {roomTypeOptions.map(rt => (
            <label key={rt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.roomType.includes(rt)} onChange={() => toggleRoomType(rt)} />
              {rt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Sharing Type" required error={errors.sharingType}>
        <div className="grid grid-cols-2 gap-1">
          {sharingOptions.map(sh => (
            <label key={sh} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.sharingType.includes(sh)} onChange={() => toggleSharingType(sh)} />
              {sh}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Bathroom Type" required error={errors.bathroomType}>
        <div className="flex gap-4">
          {bathroomOptions.map(bt => (
            <label key={bt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bathroom" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathroomType === bt} onChange={() => updateForm("bathroomType", bt)} />
              {bt}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Furnishing Status" required error={errors.furnishingStatus}>
        {furnishingOptions.map(f => (
          <label key={f} className="flex items-center gap-2 text-[13px] mb-1.5 cursor-pointer">
            <input type="radio" name="dt-furnish" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={() => updateForm("furnishingStatus", f)} />
            {f}
          </label>
        ))}
      </FieldDt>

      {/* Food & Mess Section */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Food & Mess</h3>
      </div>

      <FieldDt label="Food Included">
        <div className="flex gap-4">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-food" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodIncluded === option} onChange={() => updateForm("foodIncluded", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>

      {formData.foodIncluded === "Yes" && (
        <>
          <FieldDt label="Food Type">
            {foodTypeOptions.map(ft => (
              <label key={ft} className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="radio" name="dt-food-type" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.foodType === ft} onChange={() => updateForm("foodType", ft)} />
                {ft}
              </label>
            ))}
          </FieldDt>

          <FieldDt label="Meals Provided">
            {mealOptions.map(m => (
              <label key={m} className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="radio" name="dt-meals" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.mealsPerDay === m} onChange={() => updateForm("mealsPerDay", m)} />
                {m}
              </label>
            ))}
          </FieldDt>
        </>
      )}

      <FieldDt label="Kitchen Access">
        <div className="flex gap-4">
          {["Yes", "No", "Limited"].map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-kitchen" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.kitchenAccess === option} onChange={() => updateForm("kitchenAccess", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>

      {/* Lease Preferences */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Lease Preferences</h3>
      </div>

      <FieldDt label="Lease Duration" required error={errors.leaseDuration}>
        {leaseDurationOptions.map(d => (
          <label key={d} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-lease-duration" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
            {d}
          </label>
        ))}
      </FieldDt>

      <FieldDt label="Occupancy Type" required error={errors.occupancyType}>
        {occupancyTypeOptions.map(ot => (
          <label key={ot} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-occupancy" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyType === ot} onChange={() => updateForm("occupancyType", ot)} />
            {ot}
          </label>
        ))}
      </FieldDt>

      <FieldDt label="Payment Frequency" required error={errors.paymentFrequency}>
        {paymentFrequencyOptions.map(pf => (
          <label key={pf} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-payment" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.paymentFrequency === pf} onChange={() => updateForm("paymentFrequency", pf)} />
            {pf}
          </label>
        ))}
      </FieldDt>

      <FieldDt label="Pet Friendly">
        <div className="flex gap-4">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-pet" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leasePetFriendly === option} onChange={() => updateForm("leasePetFriendly", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Smoking Allowed">
        <div className="flex gap-4">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-smoking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === option} onChange={() => updateForm("smokingAllowed", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Alcohol Allowed">
        <div className="flex gap-4">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-alcohol" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.alcoholAllowed === option} onChange={() => updateForm("alcoholAllowed", option)} />
              {option}
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
        <h3 className="text-[14px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>

      <FieldDt label="Expected Lease (₹/month)" required error={errors.expectedPrice}>
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 15,000" value={formData.expectedPrice} onChange={(e) => handleNumericFieldChange("expectedPrice", e.target.value)} />
      </FieldDt>

      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={inp} type="text" inputMode="numeric" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9]/g, '') })} />
          <input className={inp} type="text" inputMode="numeric" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      </FieldDt>

      <FieldDt label="Security Deposit (₹)" hint="Enter the refundable deposit amount">
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 30,000" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange("securityDeposit", e.target.value)} />
        {errors.securityDeposit && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDeposit}</p>}
      </FieldDt>

      <FieldDt label="Price Type" required error={errors.priceType}>
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>

      <FieldDt label="Maintenance (₹/month)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter monthly maintenance" value={formData.maintenance} onChange={(e) => handleNumericFieldChange("maintenance", e.target.value)} />
        {errors.maintenance && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.maintenance}</p>}
      </FieldDt>

      <FieldDt label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </FieldDt>

      <FieldDt label="Amenities">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {availableAmenities.map(a => (
            <span key={a} onClick={() => toggleAmenity(a)} className={`px-2.5 py-1.5 text-[13px] rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
              {a}
            </span>
          ))}
          {customAmenitiesList.map(a => (
            <span key={a} className="px-2.5 py-1.5 text-[13px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {a}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
            </span>
          ))}
        </div>
      </FieldDt>

      <FieldDt label="Other Amenities">
        <div className="flex gap-2">
          <input className={inp} placeholder="e.g. Play Area, Study Room..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-3 py-1.5 text-[13px] bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button>
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
      <p className="text-[11px] text-center text-gray-400 mb-3">📸 Upload hostel photos and media</p>
      
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-cover" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover" className="cursor-pointer flex flex-col items-center">
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
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid" className="cursor-pointer flex flex-col items-center">
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

  // STEP 5: Legal Documents (Desktop)
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Legal Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>
      
      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan" className="cursor-pointer flex flex-col items-center">
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

      <FieldDt label="Sale Deed">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-saleDeed" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="dt-saleDeed" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.saleDeed.name}</p>}
      </FieldDt>

      <FieldDt label="Patta / Chitta">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-patta" onChange={(e) => handleDocumentUpload("pattaChitta", e)} />
          <label htmlFor="dt-patta" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.pattaChitta && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.pattaChitta.name}</p>}
      </FieldDt>

      <FieldDt label="Hostel License" required error={errors.hostelLicense}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-license" onChange={(e) => handleDocumentUpload("hostelLicense", e)} />
          <label htmlFor="dt-license" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload Hostel License</span>
            <span className="text-[10px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.hostelLicense && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.hostelLicense.name}</p>}
      </FieldDt>

      <FieldDt label="Fire Safety Certificate" required error={errors.fireSafetyCertificate}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-fire" onChange={(e) => handleDocumentUpload("fireSafetyCertificate", e)} />
          <label htmlFor="dt-fire" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload Fire Safety</span>
            <span className="text-[10px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.fireSafetyCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.fireSafetyCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Health Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-health" onChange={(e) => handleDocumentUpload("healthCertificate", e)} />
          <label htmlFor="dt-health" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload Health Certificate</span>
            <span className="text-[10px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.healthCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.healthCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-tax" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="dt-tax" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.propertyTaxReceipt.name}</p>}
      </FieldDt>

      <FieldDt label="Lease Agreement">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-leaseAgreement" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="dt-leaseAgreement" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.leaseAgreement.name}</p>}
      </FieldDt>

      <FieldDt label="Other Supporting Documents">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-otherDocs" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("otherSupportingDocs", [...formData.otherSupportingDocs, ...validFiles]);
          }} />
          <label htmlFor="dt-otherDocs" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Additional Documents</span>
            <span className="text-[11px] text-gray-400">PDF only, multiple allowed</span>
          </label>
        </div>
        {formData.otherSupportingDocs.length > 0 && (
          <p className="text-[13px] text-green-600 mt-2">✓ {formData.otherSupportingDocs.length} file(s) uploaded</p>
        )}
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
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Account Number" required error={errors.accountNumber}>
        <input className={inp} type="text" inputMode="numeric" maxLength={18} placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value.replace(/[^0-9]/g, "").slice(0, 18))} />
      </FieldDt>
      <FieldDt label="IFSC Code" required error={errors.ifscCode}>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
      </FieldDt>
      <FieldDt label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 7: Communication & Declaration (Desktop)
  if (step === 7) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Communication Preferences</h3>
      </div>
      <FieldDt label="Preferred Contact Method">
        <div className="flex gap-5">
          {["Phone Call", "WhatsApp", "Email"].map(method => (
            <label key={method} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactMethod.includes(method)} onChange={() => toggleContactMethod(method)} />
              {method}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Preferred Contact Time">
        <div className="flex gap-5">
          {["Morning", "Afternoon", "Evening", "Anytime"].map(time => (
            <label key={time} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-contactTime" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === time} onChange={() => updateForm("preferredContactTime", time)} />
              {time}
            </label>
          ))}
        </div>
      </FieldDt>

      {/* Signature Section */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-4 h-4" /> Owner Signature <span className="text-red-500">*</span>
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
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange("signaturePlace", e.target.value)} />
      </FieldDt>

      {/* Declaration - Independent Checkboxes */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="flex items-start gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
            <span>I confirm that I am the legal owner or an authorized representative of this hostel property.</span>
          </label>
          {errors.declarationAccepted && (
            <p className="text-[11px] text-red-500 font-medium mt-0.5 ml-6">{errors.declarationAccepted}</p>
          )}
        </div>
        
        <div>
          <label className="flex items-start gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
            <span>I certify that all information and documents provided are accurate and authentic.</span>
          </label>
          {errors.declarationAccurate && (
            <p className="text-[11px] text-red-500 font-medium mt-0.5 ml-6">{errors.declarationAccurate}</p>
          )}
        </div>
        
        <div>
          <label className="flex items-start gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
            <span>I agree to the Terms & Conditions and Privacy Policy.</span>
          </label>
          {errors.declarationTerms && (
            <p className="text-[11px] text-red-500 font-medium mt-0.5 ml-6">{errors.declarationTerms}</p>
          )}
        </div>
      </div>
    </>
  );

  return null;
}