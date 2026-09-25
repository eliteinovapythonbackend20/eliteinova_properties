import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, User, Mail, Phone, Calendar as CalendarIcon, UserCheck, File, MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, CheckSquare, PenTool, Dog, Wind, Droplet, Layers, Layout, Smartphone, MessageCircle, Globe, Compass, RefreshCw } from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

const steps = ["Owner Details", "Identity Verification", "Property Details", "Pricing & Amenities", "Media Upload", "Legal Documents", "Bank Details", "Communication & Declaration"];
const subtitles = [
  "Enter your personal information",
  "Verify your identity",
  "Tell us about your property",
  "Set pricing & select amenities",
  "Upload property photos & video",
  "Upload legal documents",
  "Enter bank details",
  "Set preferences & confirm"
];

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

const availableAmenities = ["Lift", "Power Backup", "Security", "Water Supply", "Garden", "Gym", "Pool", "Covered Parking", "CCTV Surveillance", "Clubhouse", "Children's Play Area", "Jogging Track", "Visitor Parking", "Smart Home Features", "Wi-Fi Ready"];

const yesNoOptions = ["Yes", "No"];
const furnishingOptions = ["Fully Furnished", "Semi-Furnished", "Unfurnished"];
const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
const tenantTypeOptions = ["Family", "Bachelor", "Working Professionals", "Students"];
const leaseDurationOptions = ["6 Months", "1 Year", "2+ Years"];
const contactTimeOptions = ["Morning (9 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)", "Anytime"];
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

export default function ApartLeaseForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    // Owner Details (Step 0)
    ownerName: "", contactNumber: "", emailId: "", gender: "",
    // Identity Verification (Step 1)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, passportPhoto: null,
    addressLine1: "", addressLine2: "", ownerCity: "", ownerDistrict: "", ownerState: "", ownerPinCode: "",
    // Property Details (Step 2)
    propertyType: "", purpose: "Lease",
    area: "", landmark: "", nearbyConnectivity: "",
    propertyCategory: "apartment",
    postedBy: "owner",
    builtUpArea: "", carpetArea: "",
    bedrooms: "", bathrooms: "", floorNumber: "", totalFloors: "",
    facingDirection: "", balcony: "", propertyAge: "", cornerUnit: "",
    // Interior Details
    furnishing: "", interiorFeatures: [], appliancesIncluded: [],
    // Pricing & Amenities (Step 3)
    leaseAmount: "", budgetRange: { min: "", max: "" }, securityDepositAmount: "",
    leaseDuration: "", maintenanceIncluded: "", leaseNegotiable: "Fixed",
    ownershipType: "",
    // Tenant Preferences
    tenantType: [], petFriendly: "", dietaryPreference: "", smokingAllowed: "",
    // Amenities
    selectedAmenities: [], otherAmenities: "",
    // Availability
    immediateOccupancy: "", availableFrom: "", leaseRenewalOption: "",
    // Nearby Access
    nearbyPlaces: [],
    // Media (Step 4)
    propertyImages: [], propertyVideo: null, coverImage: null,
    // Legal Documents (Step 5)
    saleDeed: null, pattaChitta: null, encumbranceCertificate: null, propertyTaxReceipt: null,
    buildingApprovalPlan: null, completionCertificate: null, occupancyCertificate: null,
    leaseAgreement: null, otherSupportingDocs: [], floorPlan: null,
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

  const [errors, setErrors] = useState({});

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
    updateForm('ownerPinCode', filtered);
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

  const toggleApartmentAmenity = (amenityId) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenityId)) {
      updateForm("selectedAmenities", current.filter(id => id !== amenityId));
    } else {
      updateForm("selectedAmenities", [...current, amenityId]);
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
      if (!formData.ownerCity.trim()) e.ownerCity = "City is required";
      else if (!isOnlyLetters(formData.ownerCity)) e.ownerCity = "City should contain only letters and spaces";
      if (!formData.ownerDistrict.trim()) e.ownerDistrict = "District is required";
      else if (!isOnlyLetters(formData.ownerDistrict)) e.ownerDistrict = "District should contain only letters and spaces";
      if (!formData.ownerState.trim()) e.ownerState = "State is required";
      else if (!isOnlyLetters(formData.ownerState)) e.ownerState = "State should contain only letters and spaces";
      if (!formData.ownerPinCode.trim()) e.ownerPinCode = "PIN code is required";
      else if (!isSixDigitPinCode(formData.ownerPinCode)) e.ownerPinCode = "PIN code must be exactly 6 digits";
    }
    if (s === 2) {
      if (!formData.area.trim()) e.area = "Property city is required";
      else if (!isOnlyLetters(formData.area)) e.area = "Property city should contain only letters and spaces";
      if (!formData.landmark.trim()) e.landmark = "Area/Locality is required";
      else if (!isOnlyLettersAndNumbers(formData.landmark)) e.landmark = "Area/Locality should contain only letters and numbers";
      if (!formData.propertyType) e.propertyType = "Please select a property type";
      if (!formData.builtUpArea) e.builtUpArea = "Built-up area is required";
      else if (!isOnlyNumbers(formData.builtUpArea)) e.builtUpArea = "Built-up area must be a number";
      if (!formData.bedrooms) e.bedrooms = "Please select number of bedrooms";
      if (!formData.bathrooms) e.bathrooms = "Please select number of bathrooms";
    }
    if (s === 3) {
      if (!formData.leaseAmount) e.leaseAmount = "Lease amount is required";
      else if (!isOnlyNumbers(formData.leaseAmount)) e.leaseAmount = "Lease amount must be a number";
      if (formData.securityDepositAmount && !isOnlyNumbers(formData.securityDepositAmount)) e.securityDepositAmount = "Security deposit must be a number";
    }
    if (s === 4) {
      if (!formData.coverImage) e.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) e.propertyImages = "At least one property photo is required";
    }
    if (s === 5) {
      if (!formData.floorPlan) e.floorPlan = "Floor plan is required";
    }
    if (s === 6) {
      if (!formData.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
      else if (!isOnlyLetters(formData.accountHolderName)) e.accountHolderName = "Account holder name should contain only letters and spaces";
      if (!formData.accountNumber) e.accountNumber = "Account number is required";
      else if (!formData.accountNumber.match(/^[0-9]{9,18}$/)) e.accountNumber = "Account number must be between 9-18 digits";
      if (!formData.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      if (!formData.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) e.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
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
            <div className="text-xl mb-0.5 relative z-10">🏢</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Apartment - For Lease</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List your apartment for lease</p>
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
            <MobContentApartLease
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
              toggleApartmentAmenity={toggleApartmentAmenity}
              availableAmenities={availableAmenities}
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
              toggleContactMethod={toggleContactMethod}
              isValidEmail={isValidEmail}
              errors={errors}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Apartment - For Lease</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List your apartment for lease</p>
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
            <DtContentApartLease
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
              toggleApartmentAmenity={toggleApartmentAmenity}
              availableAmenities={availableAmenities}
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
              toggleContactMethod={toggleContactMethod}
              isValidEmail={isValidEmail}
              errors={errors}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
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

// MOBILE CONTENT
function MobContentApartLease({ step, inp, formData, updateForm, handleAlphaFieldChange, handleNumericFieldChange, handlePinCodeChange, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, handlePassportUpload, toggleAmenity, toggleApartmentAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, yesNoOptions, furnishingOptions, facingOptions, tenantTypeOptions, leaseDurationOptions, contactTimeOptions, apartmentLeaseAmenities, toggleArrayItem, bankOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, toggleContactMethod, isValidEmail, errors, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints }) {
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
      <Field label="Full Name" required>
        <input className={inp} placeholder="Enter your full name" value={formData.ownerName} onChange={(e) => handleAlphaFieldChange("ownerName", e.target.value)} />
        {errors.ownerName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerName}</p>}
      </Field>
      <Field label="Mobile Number" required>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.contactNumber} onChange={(e) => updateForm("contactNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} />
        {errors.contactNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.contactNumber}</p>}
      </Field>
      <Field label="Email Address" required hint="We'll send listing updates to this email">
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
        {errors.emailId && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.emailId}</p>}
      </Field>
      <Field label="Gender" required>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-gender" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.gender}</p>}
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
      <Field label="Aadhaar Number" required>
        <input className={inp} inputMode="numeric" maxLength={12} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} />
        {errors.aadhaarNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.aadhaarNumber}</p>}
      </Field>
      <Field label="PAN Number">
        <input className={inp} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} />
      </Field>
      <Field label="Upload Aadhaar Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-aadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
        {errors.aadhaarCard && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.aadhaarCard}</p>}
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
      <Field label="Upload Passport-size Photo" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-passport-lease" onChange={(e) => handlePassportUpload("passportPhoto", e)} />
          <label htmlFor="m-passport-lease" className="cursor-pointer flex flex-col items-center">
            <User className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photo</span>
            <span className="text-[9px] text-gray-400">JPG, JPEG, PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.passportPhoto && <p className="text-[10px] text-green-600 mt-1">✓ {formData.passportPhoto.name}</p>}
        {errors.passportPhoto && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.passportPhoto}</p>}
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Address Details</h3>
      </div>
      <Field label="Address Line 1" required>
        <input className={inp} placeholder="House number, building, street" value={formData.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
        {errors.addressLine1 && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.addressLine1}</p>}
      </Field>
      <Field label="Address Line 2">
        <input className={inp} placeholder="Apartment, suite, unit" value={formData.addressLine2} onChange={(e) => updateForm("addressLine2", e.target.value)} />
      </Field>
      <Field label="Owner City" required>
        <input className={inp} placeholder="Enter owner's city" value={formData.ownerCity} onChange={(e) => handleAlphaFieldChange("ownerCity", e.target.value)} />
        {errors.ownerCity && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerCity}</p>}
      </Field>
      <Field label="District" required>
        <input className={inp} placeholder="Enter district" value={formData.ownerDistrict} onChange={(e) => handleAlphaFieldChange("ownerDistrict", e.target.value)} />
        {errors.ownerDistrict && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerDistrict}</p>}
      </Field>
      <Field label="State" required>
        <input className={inp} placeholder="Enter state" value={formData.ownerState} onChange={(e) => handleAlphaFieldChange("ownerState", e.target.value)} />
        {errors.ownerState && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerState}</p>}
      </Field>
      <Field label="Owner PIN Code" required>
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.ownerPinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
        {errors.ownerPinCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerPinCode}</p>}
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
      <Field label="Property City" required>
        <input className={inp} placeholder="Enter property city name" value={formData.area} onChange={(e) => handleAlphaFieldChange("area", e.target.value)} />
        {errors.area && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.area}</p>}
      </Field>
      <Field label="Area / Locality" required>
        <input className={inp} placeholder="Enter area or locality" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
        {errors.landmark && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.landmark}</p>}
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </Field>
      <Field label="Property PIN Code">
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter property PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">🏠 Property Details</h3>
      </div>
      
      <Field label="Property Category" required>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-category" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyCategory === "individual"} onChange={() => updateForm("propertyCategory", "individual")} />
            Individual
          </label>
        </div>
      </Field>

      <Field label="Posted By" required>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-postedby" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.postedBy === "owner"} onChange={() => updateForm("postedBy", "owner")} />
            Owner
          </label>
        </div>
      </Field>

      <Field label="Property Type" required>
        <div className="grid grid-cols-2 gap-1">
          {["Serviced Apartment", "Residential Apartment", "Gated Community Studio", "Luxury Apartment", "Duplex Apartment", "Condo Apartment", "Penthouse Apartment"].map(type => (
            <label key={type} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-property-type-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === type} onChange={() => updateForm("propertyType", type)} />
              {type}
            </label>
          ))}
        </div>
        {errors.propertyType && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyType}</p>}
      </Field>
      <Field label="Built-up Area" required hint="In square feet">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
        {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
      </Field>
      
      <Field label="Carpet Area" hint="In square feet">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
      </Field>
      
      <Field label="Number of Bedrooms" required>
        {["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK+"].map(bhk => (
          <label key={bhk} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-bhk-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bedrooms === bhk} onChange={() => updateForm("bedrooms", bhk)} />
            {bhk}
          </label>
        ))}
        {errors.bedrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bedrooms}</p>}
      </Field>
      <Field label="Number of Bathrooms" required>
        {["1", "2", "3", "4+"].map(b => (
          <label key={b} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-bath-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === b} onChange={() => updateForm("bathrooms", b)} />
            {b}
          </label>
        ))}
        {errors.bathrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bathrooms}</p>}
      </Field>
      <Field label="Floor Number">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => handleNumericFieldChange("floorNumber", e.target.value)} />
      </Field>
      <Field label="Total Floors">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => handleNumericFieldChange("totalFloors", e.target.value)} />
      </Field>
      <Field label="Facing Direction">
        <div className="grid grid-cols-2 gap-1">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-facing-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Balcony">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-balcony-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Property Age">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => handleNumericFieldChange("propertyAge", e.target.value)} />
      </Field>
      <Field label="Corner Unit">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-corner-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.cornerUnit === opt} onChange={() => updateForm("cornerUnit", opt)} />
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
              <input type="radio" name="mob-furnish-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishing === f} onChange={() => updateForm("furnishing", f)} />
              {f}
            </label>
          ))}
        </div>
      </Field>
      
      <Field label="Interior Features" hint="Select all that apply">
        <div className="grid grid-cols-2 gap-1">
          {["Modular Kitchen", "Wardrobes", "Air Conditioning", "Utility Area", "Smart Home Features"].map(feature => (
            <label key={feature} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.interiorFeatures || []).includes(feature)} onChange={() => toggleArrayItem("interiorFeatures", feature)} />
              {feature}
            </label>
          ))}
        </div>
      </Field>
      
      <Field label="Appliances Included" hint="Select all that apply">
        <div className="grid grid-cols-2 gap-1">
          {["Refrigerator", "AC", "Washing Machine", "Microwave", "Dishwasher", "Water Purifier", "TV", "Oven"].map(appliance => (
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
      <Field label="Lease Amount (₹/month)" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => handleNumericFieldChange("leaseAmount", e.target.value)} />
        {errors.leaseAmount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.leaseAmount}</p>}
      </Field>
      
      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={`${inp} w-1/2`} type="text" inputMode="numeric" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9]/g, '') })} />
          <input className={`${inp} w-1/2`} type="text" inputMode="numeric" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      </Field>

      <Field label="Security / Deposit Amount (₹)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter security/deposit amount" value={formData.securityDepositAmount} onChange={(e) => handleNumericFieldChange("securityDepositAmount", e.target.value)} />
        {errors.securityDepositAmount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDepositAmount}</p>}
      </Field>
      <Field label="Lease Duration">
        <div className="grid grid-cols-2 gap-1">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-duration-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Maintenance Charges Included">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-maint-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Lease Negotiable" required>
        <div className="flex gap-4">
          {["Fixed", "Negotiable"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-negotiable-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseNegotiable === opt} onChange={() => updateForm("leaseNegotiable", opt)} />
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
              <input type="radio" name="mob-pet-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Dietary Preference">
        <div className="flex gap-4">
          {["Veg Only", "No Restriction"].map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-diet-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.dietaryPreference === opt} onChange={() => updateForm("dietaryPreference", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Smoking Allowed">
        <div className="flex gap-4">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-smoking-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === opt} onChange={() => updateForm("smokingAllowed", opt)} />
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
              <input type="radio" name="mob-occupancy-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
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
              <input type="radio" name="mob-renewal-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === opt} onChange={() => updateForm("leaseRenewalOption", opt)} />
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
          {["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"].map(place => (
            <label key={place} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.nearbyPlaces || []).includes(place)} onChange={() => {
                const current = formData.nearbyPlaces || [];
                if (current.includes(place)) {
                  updateForm("nearbyPlaces", current.filter(p => p !== place));
                } else {
                  updateForm("nearbyPlaces", [...current, place]);
                }
              }} />
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
        {errors.coverImage && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.coverImage}</p>}
      </Field>
      <Field label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`}>
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
        {errors.propertyImages && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyImages}</p>}
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

  // STEP 5: Legal Documents
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Legal Documents</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">All documents must be in PDF format (Max 5MB each)</p>
      
      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)">
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
        {errors.floorPlan && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.floorPlan}</p>}
      </Field>

      <Field label="Sale Deed">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-saleDeed-lease" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="m-saleDeed-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.saleDeed.name}</p>}
      </Field>

      <Field label="Patta / Chitta">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-patta-lease" onChange={(e) => handleDocumentUpload("pattaChitta", e)} />
          <label htmlFor="m-patta-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.pattaChitta && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.pattaChitta.name}</p>}
      </Field>

      <Field label="Encumbrance Certificate (EC)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-ec-lease" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="m-ec-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.encumbranceCertificate.name}</p>}
      </Field>

      <Field label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-tax-lease" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="m-tax-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.propertyTaxReceipt.name}</p>}
      </Field>

      <Field label="Building Approval Plan">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-building-lease" onChange={(e) => handleDocumentUpload("buildingApprovalPlan", e)} />
          <label htmlFor="m-building-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.buildingApprovalPlan && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.buildingApprovalPlan.name}</p>}
      </Field>

      <Field label="Completion Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-completion-lease" onChange={(e) => handleDocumentUpload("completionCertificate", e)} />
          <label htmlFor="m-completion-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.completionCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.completionCertificate.name}</p>}
      </Field>

      <Field label="Occupancy Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-occupancy-lease" onChange={(e) => handleDocumentUpload("occupancyCertificate", e)} />
          <label htmlFor="m-occupancy-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.occupancyCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.occupancyCertificate.name}</p>}
      </Field>

      <Field label="Lease Agreement">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-leaseAgreement-lease" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="m-leaseAgreement-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.leaseAgreement.name}</p>}
      </Field>

      <Field label="Other Supporting Documents">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-otherDocs-lease" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("otherSupportingDocs", [...formData.otherSupportingDocs, ...validFiles]);
          }} />
          <label htmlFor="m-otherDocs-lease" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Account Holder Name" required>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => handleAlphaFieldChange("accountHolderName", e.target.value)} />
        {errors.accountHolderName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountHolderName}</p>}
      </Field>
      <Field label="Bank Name">
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank (optional)</option>
          {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Account Number" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value.replace(/[^0-9]/g, ''))} />
        {errors.accountNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountNumber}</p>}
      </Field>
      <Field label="IFSC Code" required>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
        {errors.ifscCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ifscCode}</p>}
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
        <div className="grid grid-cols-2 gap-1">
          {contactTimeOptions.map(time => (
            <label key={time} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-contactTime-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === time} onChange={() => updateForm("preferredContactTime", time)} />
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
      <Field label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
        {errors.signatureDate && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signatureDate}</p>}
      </Field>
      <Field label="Place" required>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange("signaturePlace", e.target.value)} />
        {errors.signaturePlace && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signaturePlace}</p>}
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
            <span>I confirm that I am the legal owner or an authorized representative of this property.</span>
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

// DESKTOP CONTENT
function DtContentApartLease({ step, inp, formData, updateForm, handleAlphaFieldChange, handleNumericFieldChange, handlePinCodeChange, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, handlePassportUpload, toggleAmenity, toggleApartmentAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, yesNoOptions, furnishingOptions, facingOptions, tenantTypeOptions, leaseDurationOptions, contactTimeOptions, apartmentLeaseAmenities, toggleArrayItem, bankOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, toggleContactMethod, isValidEmail, errors, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints }) {
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
      <FieldDt label="Full Name" required>
        <input className={inp} placeholder="Enter your full name" value={formData.ownerName} onChange={(e) => handleAlphaFieldChange("ownerName", e.target.value)} />
        {errors.ownerName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerName}</p>}
      </FieldDt>
      <FieldDt label="Mobile Number" required>
        <input className={inp} type="tel" inputMode="numeric" maxLength={10} placeholder="Enter your 10-digit mobile number" value={formData.contactNumber} onChange={(e) => updateForm("contactNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} />
        {errors.contactNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.contactNumber}</p>}
      </FieldDt>
      <FieldDt label="Email Address" required hint="We'll send listing updates to this email">
        <input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} />
        {errors.emailId && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.emailId}</p>}
      </FieldDt>
      <FieldDt label="Gender" required>
        <div className="flex gap-5">
          {["Male", "Female", "Other"].map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.gender}</p>}
      </FieldDt>
    </>
  );

  // STEP 1: Identity Verification
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Identity Verification</h3>
      </div>
      <FieldDt label="Aadhaar Number" required>
        <input className={inp} inputMode="numeric" maxLength={12} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", e.target.value.replace(/\D/g, "").slice(0, 12))} />
        {errors.aadhaarNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.aadhaarNumber}</p>}
      </FieldDt>
      <FieldDt label="PAN Number">
        <input className={inp} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} />
      </FieldDt>
      <FieldDt label="Upload Aadhaar Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-lease" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-aadhaar-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
        {errors.aadhaarCard && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.aadhaarCard}</p>}
      </FieldDt>
      <FieldDt label="Upload PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-lease" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-pan-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>
      <FieldDt label="Upload Passport-size Photo" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-passport-lease" onChange={(e) => handlePassportUpload("passportPhoto", e)} />
          <label htmlFor="dt-passport-lease" className="cursor-pointer flex flex-col items-center">
            <User className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Photo</span>
            <span className="text-[11px] text-gray-400">JPG, JPEG, PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.passportPhoto && <p className="text-[13px] text-green-600 mt-2">✓ {formData.passportPhoto.name}</p>}
        {errors.passportPhoto && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.passportPhoto}</p>}
      </FieldDt>
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Address Details</h3>
      </div>
      <FieldDt label="Address Line 1" required>
        <input className={inp} placeholder="House number, building, street" value={formData.addressLine1} onChange={(e) => updateForm("addressLine1", e.target.value)} />
        {errors.addressLine1 && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.addressLine1}</p>}
      </FieldDt>
      <FieldDt label="Address Line 2">
        <input className={inp} placeholder="Apartment, suite, unit" value={formData.addressLine2} onChange={(e) => updateForm("addressLine2", e.target.value)} />
      </FieldDt>
      <FieldDt label="Owner City" required>
        <input className={inp} placeholder="Enter owner's city" value={formData.ownerCity} onChange={(e) => handleAlphaFieldChange("ownerCity", e.target.value)} />
        {errors.ownerCity && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerCity}</p>}
      </FieldDt>
      <FieldDt label="District" required>
        <input className={inp} placeholder="Enter district" value={formData.ownerDistrict} onChange={(e) => handleAlphaFieldChange("ownerDistrict", e.target.value)} />
        {errors.ownerDistrict && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerDistrict}</p>}
      </FieldDt>
      <FieldDt label="State" required>
        <input className={inp} placeholder="Enter state" value={formData.ownerState} onChange={(e) => handleAlphaFieldChange("ownerState", e.target.value)} />
        {errors.ownerState && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerState}</p>}
      </FieldDt>
      <FieldDt label="Owner PIN Code" required>
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.ownerPinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
        {errors.ownerPinCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ownerPinCode}</p>}
      </FieldDt>
    </>
  );

  // STEP 2: Property Details
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📍 Location Details</h3>
      </div>
      <FieldDt label="Property City" required>
        <input className={inp} placeholder="Enter property city name" value={formData.area} onChange={(e) => handleAlphaFieldChange("area", e.target.value)} />
        {errors.area && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.area}</p>}
      </FieldDt>
      <FieldDt label="Area / Locality" required>
        <input className={inp} placeholder="Enter area or locality" value={formData.landmark} onChange={(e) => updateForm("landmark", e.target.value)} />
        {errors.landmark && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.landmark}</p>}
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Nearby landmark" value={formData.nearbyConnectivity} onChange={(e) => updateForm("nearbyConnectivity", e.target.value)} />
      </FieldDt>
      <FieldDt label="Property PIN Code">
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter property PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">🏠 Property Details</h3>
      </div>

      <FieldDt label="Property Type" required>
        <div className="grid grid-cols-2 gap-2">
          {["Serviced Apartment", "Residential Apartment", "Gated Community Studio", "Luxury Apartment", "Duplex Apartment", "Condo Apartment", "Penthouse Apartment"].map(type => (
            <label key={type} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-property-type-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === type} onChange={() => updateForm("propertyType", type)} />
              {type}
            </label>
          ))}
        </div>
        {errors.propertyType && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyType}</p>}
      </FieldDt>
      <FieldDt label="Built-up Area" required hint="In square feet">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter built-up area in sq.ft" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
        {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
      </FieldDt>
      <FieldDt label="Carpet Area" hint="In square feet">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter carpet area in sq.ft" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
      </FieldDt>
      <FieldDt label="Number of Bedrooms" required>
        <div className="flex flex-wrap gap-3">
          {["Studio", "1 BHK", "2 BHK", "3 BHK", "4 BHK+"].map(bhk => (
            <label key={bhk} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bhk-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bedrooms === bhk} onChange={() => updateForm("bedrooms", bhk)} />
              {bhk}
            </label>
          ))}
        </div>
        {errors.bedrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bedrooms}</p>}
      </FieldDt>
      <FieldDt label="Number of Bathrooms" required>
        <div className="flex flex-wrap gap-3">
          {["1", "2", "3", "4+"].map(b => (
            <label key={b} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bath-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.bathrooms === b} onChange={() => updateForm("bathrooms", b)} />
              {b}
            </label>
          ))}
        </div>
        {errors.bathrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bathrooms}</p>}
      </FieldDt>
      <FieldDt label="Floor Number">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter floor number" value={formData.floorNumber} onChange={(e) => handleNumericFieldChange("floorNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Total Floors">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter total floors" value={formData.totalFloors} onChange={(e) => handleNumericFieldChange("totalFloors", e.target.value)} />
      </FieldDt>
      <FieldDt label="Facing Direction">
        <div className="grid grid-cols-4 gap-2">
          {facingOptions.map(f => (
            <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-facing-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.facingDirection === f} onChange={() => updateForm("facingDirection", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Balcony">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-balcony-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.balcony === opt} onChange={() => updateForm("balcony", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Property Age">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter property age in years" value={formData.propertyAge} onChange={(e) => handleNumericFieldChange("propertyAge", e.target.value)} />
      </FieldDt>
      <FieldDt label="Corner Unit">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-corner-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.cornerUnit === opt} onChange={() => updateForm("cornerUnit", opt)} />
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
              <input type="radio" name="dt-furnish-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishing === f} onChange={() => updateForm("furnishing", f)} />
              {f}
            </label>
          ))}
        </div>
      </FieldDt>
      
      <FieldDt label="Interior Features" hint="Select all that apply">
        <div className="grid grid-cols-2 gap-2">
          {["Modular Kitchen", "Wardrobes", "Air Conditioning", "Utility Area", "Smart Home Features"].map(feature => (
            <label key={feature} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.interiorFeatures || []).includes(feature)} onChange={() => toggleArrayItem("interiorFeatures", feature)} />
              {feature}
            </label>
          ))}
        </div>
      </FieldDt>
      
      <FieldDt label="Appliances Included" hint="Select all that apply">
        <div className="grid grid-cols-2 gap-2">
          {["Refrigerator", "AC", "Washing Machine", "Microwave", "Dishwasher", "Water Purifier", "TV", "Oven"].map(appliance => (
            <label key={appliance} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.appliancesIncluded || []).includes(appliance)} onChange={() => toggleArrayItem("appliancesIncluded", appliance)} />
              {appliance}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 3: Pricing & Amenities (Desktop - same as mobile but with FieldDt)
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">📄 Lease Details</h3>
      </div>
      <FieldDt label="Lease Amount (₹/month)" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter lease amount" value={formData.leaseAmount} onChange={(e) => handleNumericFieldChange("leaseAmount", e.target.value)} />
        {errors.leaseAmount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.leaseAmount}</p>}
      </FieldDt>
      
      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={`${inp} w-1/2`} type="text" inputMode="numeric" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9]/g, '') })} />
          <input className={`${inp} w-1/2`} type="text" inputMode="numeric" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      </FieldDt>

      <FieldDt label="Security / Deposit Amount (₹)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter security/deposit amount" value={formData.securityDepositAmount} onChange={(e) => handleNumericFieldChange("securityDepositAmount", e.target.value)} />
        {errors.securityDepositAmount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDepositAmount}</p>}
      </FieldDt>
      <FieldDt label="Lease Duration">
        <div className="flex flex-wrap gap-3">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-duration-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges Included">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-maint-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.maintenanceIncluded === opt} onChange={() => updateForm("maintenanceIncluded", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Lease Negotiable" required>
        <div className="flex gap-5">
          {["Fixed", "Negotiable"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-negotiable-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseNegotiable === opt} onChange={() => updateForm("leaseNegotiable", opt)} />
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
              <input type="radio" name="dt-pet-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Dietary Preference">
        <div className="flex gap-5">
          {["Veg Only", "No Restriction"].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-diet-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.dietaryPreference === opt} onChange={() => updateForm("dietaryPreference", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Smoking Allowed">
        <div className="flex gap-5">
          {yesNoOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-smoking-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.smokingAllowed === opt} onChange={() => updateForm("smokingAllowed", opt)} />
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
              <input type="radio" name="dt-occupancy-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.immediateOccupancy === opt} onChange={() => updateForm("immediateOccupancy", opt)} />
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
              <input type="radio" name="dt-renewal-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseRenewalOption === opt} onChange={() => updateForm("leaseRenewalOption", opt)} />
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
          {["School", "Hospital", "Metro / Bus Stop", "Shopping Mall / Market", "IT Park / Business Hub", "Airport Access"].map(place => (
            <label key={place} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={(formData.nearbyPlaces || []).includes(place)} onChange={() => {
                const current = formData.nearbyPlaces || [];
                if (current.includes(place)) {
                  updateForm("nearbyPlaces", current.filter(p => p !== place));
                } else {
                  updateForm("nearbyPlaces", [...current, place]);
                }
              }} />
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
      
      <FieldDt label="Upload Cover Image" required hint="Max 2MB">
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
        {errors.coverImage && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.coverImage}</p>}
      </FieldDt>
      <FieldDt label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`}>
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
        {errors.propertyImages && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyImages}</p>}
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

  // STEP 5: Legal Documents (Desktop)
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Legal Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>
      
      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)">
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
        {errors.floorPlan && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.floorPlan}</p>}
      </FieldDt>

      <FieldDt label="Sale Deed">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-saleDeed-lease" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="dt-saleDeed-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.saleDeed.name}</p>}
      </FieldDt>

      <FieldDt label="Patta / Chitta">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-patta-lease" onChange={(e) => handleDocumentUpload("pattaChitta", e)} />
          <label htmlFor="dt-patta-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.pattaChitta && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.pattaChitta.name}</p>}
      </FieldDt>

      <FieldDt label="Encumbrance Certificate (EC)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-ec-lease" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="dt-ec-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.encumbranceCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-tax-lease" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="dt-tax-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.propertyTaxReceipt.name}</p>}
      </FieldDt>

      <FieldDt label="Building Approval Plan">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-building-lease" onChange={(e) => handleDocumentUpload("buildingApprovalPlan", e)} />
          <label htmlFor="dt-building-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.buildingApprovalPlan && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.buildingApprovalPlan.name}</p>}
      </FieldDt>

      <FieldDt label="Completion Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-completion-lease" onChange={(e) => handleDocumentUpload("completionCertificate", e)} />
          <label htmlFor="dt-completion-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.completionCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.completionCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Occupancy Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-occupancy-lease" onChange={(e) => handleDocumentUpload("occupancyCertificate", e)} />
          <label htmlFor="dt-occupancy-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.occupancyCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.occupancyCertificate.name}</p>}
      </FieldDt>

      <FieldDt label="Lease Agreement">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-leaseAgreement-lease" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="dt-leaseAgreement-lease" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.leaseAgreement.name}</p>}
      </FieldDt>

      <FieldDt label="Other Supporting Documents">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-otherDocs-lease" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("otherSupportingDocs", [...formData.otherSupportingDocs, ...validFiles]);
          }} />
          <label htmlFor="dt-otherDocs-lease" className="cursor-pointer flex flex-col items-center">
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
      <FieldDt label="Account Holder Name" required>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => handleAlphaFieldChange("accountHolderName", e.target.value)} />
        {errors.accountHolderName && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountHolderName}</p>}
      </FieldDt>
      <FieldDt label="Bank Name">
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank (optional)</option>
          {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Account Number" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value.replace(/[^0-9]/g, ''))} />
        {errors.accountNumber && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.accountNumber}</p>}
      </FieldDt>
      <FieldDt label="IFSC Code" required>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} />
        {errors.ifscCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.ifscCode}</p>}
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
        <div className="grid grid-cols-2 gap-2">
          {contactTimeOptions.map(time => (
            <label key={time} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-contactTime-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === time} onChange={() => updateForm("preferredContactTime", time)} />
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
      <FieldDt label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
        {errors.signatureDate && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signatureDate}</p>}
      </FieldDt>
      <FieldDt label="Place" required>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => handleAlphaFieldChange("signaturePlace", e.target.value)} />
        {errors.signaturePlace && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signaturePlace}</p>}
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
            <span>I confirm that I am the legal owner or an authorized representative of this property.</span>
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