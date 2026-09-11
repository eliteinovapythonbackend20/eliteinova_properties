import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, User, Mail, Phone, Calendar as CalendarIcon, UserCheck, File, MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, CheckSquare, PenTool } from "lucide-react";
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

// Updated Field to match Buy form styling
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

// Updated input styles to match Buy form
const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";

const availableAmenities = ["Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance", "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center", "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital"];

// Lease options - integrated as form fields
const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
const yesNoOptions = ["Yes", "No"];
const bankOptions = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"];

export default function IndLeaseForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    // Owner Details (Step 0)
    ownerName: "", contactNumber: "", emailId: "", gender: "",
    // Identity Verification (Step 1)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, passportPhoto: null,
    addressLine1: "", addressLine2: "", city: "", district: "", state: "", pinCode: "",
    // Property Details (Step 2)
    propertyTitle: "", propertyType: "", 
    propertyArea: "", // Changed from propertyAddress
    propertyLandmark: "", // New field
    propertyCity: "", builtUpArea: "", carpetArea: "", 
    bedrooms: "", // Will be number input
    bathrooms: "", // Will be number input
    furnishingStatus: "", 
    parking: "", // "yes" or "no"
    parkingCount: "", // New field for number of parking spaces
    // Property Category & Posted By (Step 2)
    propertyCategory: "individual",
    postedBy: "owner",
    // Pricing & Amenities (Step 3)
    listingPurpose: "lease", expectedPrice: "", budgetRange: { min: "", max: "" }, priceType: "", maintenance: "",
    availableFrom: "", selectedAmenities: [], otherAmenities: "",
    // Lease Preferences (integrated in step 2)
    leaseBedrooms: [],
    leaseBathrooms: [],
    leaseFurnishing: "",
    leaseParking: "",
    gardenSpace: "",
    terrace: "",
    securityDeposit: "",
    leaseDuration: "",
    occupancyType: "",
    occupancyDetails: [],
    leasePetFriendly: "",
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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 3 images
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
      // Check file type (JPG, JPEG, PNG only)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert(`${docType} must be a JPG, JPEG, or PNG file`);
        return;
      }
      // Check file size (default 2MB)
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
    if (!formData.ownerName.trim()) e.ownerName = "Contact Person Name is required";
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
    if (!formData.propertyTitle.trim()) e.propertyTitle = "Property title is required";
    if (!formData.propertyType) e.propertyType = "Please select a property type";
    if (!formData.propertyArea.trim()) e.propertyArea = "Property area is required";
    else if (!isOnlyLettersAndNumbers(formData.propertyArea)) e.propertyArea = "Property area should contain only letters and numbers";
    if (!formData.propertyCity.trim()) e.propertyCity = "Property city is required";
    else if (!isOnlyLetters(formData.propertyCity)) e.propertyCity = "Property city should contain only letters and spaces";
    if (!formData.builtUpArea) e.builtUpArea = "Built-up area is required";
    else if (!isOnlyNumbers(formData.builtUpArea)) e.builtUpArea = "Built-up area must be a number";
    if (!formData.carpetArea) e.carpetArea = "Carpet area is required";
    else if (!isOnlyNumbers(formData.carpetArea)) e.carpetArea = "Carpet area must be a number";
    if (!formData.bedrooms) e.bedrooms = "Number of bedrooms is required";
    else if (!isOnlyNumbers(formData.bedrooms)) e.bedrooms = "Bedrooms must be a number";
    if (!formData.bathrooms) e.bathrooms = "Number of bathrooms is required";
    else if (!isOnlyNumbers(formData.bathrooms)) e.bathrooms = "Bathrooms must be a number";
    if (!formData.furnishingStatus) e.furnishingStatus = "Please select furnishing status";
    if (!formData.occupancyDetails || formData.occupancyDetails.length === 0) e.occupancyDetails = "Please select at least one occupancy type";
    if (formData.parking === "yes" && !formData.parkingCount) e.parkingCount = "Please enter number of parking spaces";
    if (formData.parking === "yes" && formData.parkingCount && !isOnlyNumbers(formData.parkingCount)) e.parkingCount = "Parking spaces must be a number";
  }
  if (s === 3) {
    if (!formData.expectedPrice) e.expectedPrice = "Expected lease amount is required";
    else if (!isOnlyNumbers(formData.expectedPrice)) e.expectedPrice = "Expected lease amount must be a number";
    if (!formData.securityDeposit) e.securityDeposit = "Security deposit is required";
    else if (!isOnlyNumbers(formData.securityDeposit)) e.securityDeposit = "Security deposit must be a number";
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
            <div className="text-xl mb-0.5 relative z-10">🏠</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Property - Individual Owner</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List your property for lease</p>
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
              furnishingOptions={furnishingOptions}
              yesNoOptions={yesNoOptions}
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
            <div className="text-xl mb-0.5 relative z-10">🏠</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Property - Individual Owner</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List your property for lease</p>
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
              furnishingOptions={furnishingOptions}
              yesNoOptions={yesNoOptions}
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

// MOBILE CONTENT - LEASE
function MobContentLease({ step, inp, formData, updateForm, handleAlphaFieldChange, handleNumericFieldChange, handlePinCodeChange, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, handlePassportUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, furnishingOptions, yesNoOptions, bankOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, toggleContactMethod, isValidEmail, errors, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints }) {
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
      <Field label="City" required>
        <input className={inp} placeholder="Enter city" value={formData.city} onChange={(e) => handleAlphaFieldChange("city", e.target.value)} />
        {errors.city && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.city}</p>}
      </Field>
      <Field label="District" required>
        <input className={inp} placeholder="Enter district" value={formData.district} onChange={(e) => handleAlphaFieldChange("district", e.target.value)} />
        {errors.district && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.district}</p>}
      </Field>
      <Field label="State" required>
        <input className={inp} placeholder="Enter state" value={formData.state} onChange={(e) => handleAlphaFieldChange("state", e.target.value)} />
        {errors.state && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.state}</p>}
      </Field>
      <Field label="PIN Code" required>
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
        {errors.pinCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.pinCode}</p>}
      </Field>
    </>
  );

  // STEP 2: Property Details + Lease Preferences
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Details</h3>
      </div>
      <Field label="Property Title / Name" required>
        <input className={inp} placeholder="e.g. Green Valley 3BHK Apartment" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value)} />
        {errors.propertyTitle && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyTitle}</p>}
      </Field>

      <Field label="Property Type" required>
        {["Independent House", "Independent Villa", "Duplex Residential Unit"].map(t => (
          <label key={t} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-ptype-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={() => updateForm("propertyType", t)} readOnly={false} />
            {t}
          </label>
        ))}
        {errors.propertyType && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyType}</p>}
      </Field>
      
      <Field label="Property Area" required>
        <input className={inp} placeholder="e.g. Annanagar, Velachery" value={formData.propertyArea} onChange={(e) => updateForm("propertyArea", e.target.value)} />
        {errors.propertyArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyArea}</p>}
      </Field>
      
      <Field label="Landmark / Nearby Location">
        <input className={inp} placeholder="e.g. Near Apollo Hospital, Opposite to Metro Station" value={formData.propertyLandmark} onChange={(e) => updateForm("propertyLandmark", e.target.value)} />
      </Field>
      
      <Field label="Property City" required>
        <input className={inp} placeholder="Enter property city name" value={formData.propertyCity} onChange={(e) => handleAlphaFieldChange("propertyCity", e.target.value)} />
        {errors.propertyCity && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyCity}</p>}
      </Field>
      
      <Field label="Area Details" required hint="In square feet">
        <div className="grid grid-cols-2 gap-1.5">
          <input className={inp} type="text" inputMode="numeric" placeholder="Build-up Area" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
          <input className={inp} type="text" inputMode="numeric" placeholder="Carpet Area" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
        </div>
        {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
        {errors.carpetArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.carpetArea}</p>}
      </Field>
      
      <Field label="Number of Bedrooms" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter number of bedrooms" value={formData.bedrooms} onChange={(e) => handleNumericFieldChange("bedrooms", e.target.value)} />
        {errors.bedrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bedrooms}</p>}
      </Field>

      <Field label="Number of Bathrooms" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter number of bathrooms" value={formData.bathrooms} onChange={(e) => handleNumericFieldChange("bathrooms", e.target.value)} />
        {errors.bathrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bathrooms}</p>}
      </Field>

      <Field label="Furnishing Status" required>
        {furnishingOptions.map(f => (
          <label key={f} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-furnish-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={() => updateForm("furnishingStatus", f)} readOnly={false} />
            {f}
          </label>
        ))}
        {errors.furnishingStatus && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.furnishingStatus}</p>}
      </Field>
      
      <Field label="Parking Facility">
        <div className="space-y-2">
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-parking-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "yes"} onChange={() => updateForm("parking", "yes")} readOnly={false} />
              Yes
            </label>
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-parking-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "no"} onChange={() => updateForm("parking", "no")} readOnly={false} />
              No
            </label>
          </div>
          {formData.parking === "yes" && (
            <input className={inp} type="text" inputMode="numeric" placeholder="Number of parking spaces" value={formData.parkingCount} onChange={(e) => handleNumericFieldChange("parkingCount", e.target.value)} />
          )}
          {errors.parkingCount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.parkingCount}</p>}
        </div>
      </Field>

      {/* Integrated Lease Preferences */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Lease Preferences</h3>
      </div>
      <Field label="Preferred Lease Duration">
        {["1 Year", "2 Years", "3 Years", "4+ Years"].map(duration => (
          <label key={duration} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-lease-duration" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === duration} onChange={() => updateForm("leaseDuration", duration)} />
            {duration}
          </label>
        ))}
      </Field>
      <Field label="Occupancy Details" required>
        <div className="flex flex-wrap gap-3">
          {["Single", "Family", "Bachelors", "Company Lease"].map(occupancy => (
            <label key={occupancy} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyDetails?.includes(occupancy)} onChange={() => {
                const current = formData.occupancyDetails || [];
                if (current.includes(occupancy)) {
                  updateForm("occupancyDetails", current.filter(o => o !== occupancy));
                } else {
                  updateForm("occupancyDetails", [...current, occupancy]);
                }
              }} />
              {occupancy}
            </label>
          ))}
        </div>
        {errors.occupancyDetails && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.occupancyDetails}</p>}
      </Field>
      <Field label="Pet Friendly">
        <div className="flex gap-2">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-pet-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leasePetFriendly === option} onChange={() => updateForm("leasePetFriendly", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Garden Space">
        <div className="flex gap-2">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-garden-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gardenSpace === option} onChange={() => updateForm("gardenSpace", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Terrace / Balcony">
        <div className="flex gap-2">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-terrace-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.terrace === option} onChange={() => updateForm("terrace", option)} />
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
      
      <Field label="Expected Lease (₹/month)" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 20,000" value={formData.expectedPrice} onChange={(e) => handleNumericFieldChange("expectedPrice", e.target.value)} />
        {errors.expectedPrice && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.expectedPrice}</p>}
      </Field>
      
      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={inp} type="text" inputMode="numeric" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9]/g, '') })} />
          <input className={inp} type="text" inputMode="numeric" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      </Field>
      
      <Field label="Security Deposit (₹)" required hint="Enter the refundable deposit amount">
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 50,000" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange("securityDeposit", e.target.value)} />
        {errors.securityDeposit && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDeposit}</p>}
      </Field>

      <Field label="Price Type">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} readOnly={false} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} readOnly={false} />
            Negotiable
          </label>
        </div>
      </Field>
      <Field label="Maintenance (₹/month)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter monthly maintenance" value={formData.maintenance} onChange={(e) => handleNumericFieldChange("maintenance", e.target.value)} />
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
          <input className={`${inp} flex-1`} placeholder="e.g. Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
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

// DESKTOP CONTENT - LEASE
function DtContentLease({ step, inp, formData, updateForm, handleAlphaFieldChange, handleNumericFieldChange, handlePinCodeChange, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, handlePassportUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, furnishingOptions, yesNoOptions, bankOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, toggleContactMethod, isValidEmail, errors, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints }) {
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
      <FieldDt label="City" required>
        <input className={inp} placeholder="Enter city" value={formData.city} onChange={(e) => handleAlphaFieldChange("city", e.target.value)} />
        {errors.city && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.city}</p>}
      </FieldDt>
      <FieldDt label="District" required>
        <input className={inp} placeholder="Enter district" value={formData.district} onChange={(e) => handleAlphaFieldChange("district", e.target.value)} />
        {errors.district && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.district}</p>}
      </FieldDt>
      <FieldDt label="State" required>
        <input className={inp} placeholder="Enter state" value={formData.state} onChange={(e) => handleAlphaFieldChange("state", e.target.value)} />
        {errors.state && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.state}</p>}
      </FieldDt>
      <FieldDt label="PIN Code" required>
        <input className={inp} type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit PIN code" value={formData.pinCode} onChange={(e) => handlePinCodeChange(e.target.value)} />
        {errors.pinCode && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.pinCode}</p>}
      </FieldDt>
    </>
  );

  // STEP 2: Property Details + Lease Preferences
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Details</h3>
      </div>
      <FieldDt label="Property Title / Name" required>
        <input className={inp} placeholder="e.g. Green Valley 3BHK Apartment" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value)} />
        {errors.propertyTitle && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyTitle}</p>}
      </FieldDt>

      <FieldDt label="Property Type" required>
        {["Independent House", "Independent Villa", "Duplex Residential Unit"].map(t => (
          <label key={t} className="flex items-center gap-2 text-[13px] mb-2 cursor-pointer">
            <input type="radio" name="dt-ptype-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={() => updateForm("propertyType", t)} readOnly={false} />
            {t}
          </label>
        ))}
        {errors.propertyType && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyType}</p>}
      </FieldDt>
      
      <FieldDt label="Property Area" required>
        <input className={inp} placeholder="e.g. Annanagar, Velachery" value={formData.propertyArea} onChange={(e) => updateForm("propertyArea", e.target.value)} />
        {errors.propertyArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyArea}</p>}
      </FieldDt>
      
      <FieldDt label="Landmark / Nearby Location">
        <input className={inp} placeholder="e.g. Near Apollo Hospital, Opposite to Metro Station" value={formData.propertyLandmark} onChange={(e) => updateForm("propertyLandmark", e.target.value)} />
      </FieldDt>
      
      <FieldDt label="Property City" required>
        <input className={inp} placeholder="Enter property city name" value={formData.propertyCity} onChange={(e) => handleAlphaFieldChange("propertyCity", e.target.value)} />
        {errors.propertyCity && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.propertyCity}</p>}
      </FieldDt>
      
      <FieldDt label="Area Details" required hint="Enter values in square feet">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} type="text" inputMode="numeric" placeholder="Build-up Area (sq ft)" value={formData.builtUpArea} onChange={(e) => handleNumericFieldChange("builtUpArea", e.target.value)} />
          <input className={inp} type="text" inputMode="numeric" placeholder="Carpet Area (sq ft)" value={formData.carpetArea} onChange={(e) => handleNumericFieldChange("carpetArea", e.target.value)} />
        </div>
        {errors.builtUpArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.builtUpArea}</p>}
        {errors.carpetArea && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.carpetArea}</p>}
      </FieldDt>
      
      <FieldDt label="Number of Bedrooms" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter number of bedrooms" value={formData.bedrooms} onChange={(e) => handleNumericFieldChange("bedrooms", e.target.value)} />
        {errors.bedrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bedrooms}</p>}
      </FieldDt>

      <FieldDt label="Number of Bathrooms" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter number of bathrooms" value={formData.bathrooms} onChange={(e) => handleNumericFieldChange("bathrooms", e.target.value)} />
        {errors.bathrooms && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.bathrooms}</p>}
      </FieldDt>

      <FieldDt label="Furnishing Status" required>
        {furnishingOptions.map(f => (
          <label key={f} className="flex items-center gap-2 text-[13px] mb-2 cursor-pointer">
            <input type="radio" name="dt-furnish-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={() => updateForm("furnishingStatus", f)} readOnly={false} />
            {f}
          </label>
        ))}
        {errors.furnishingStatus && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.furnishingStatus}</p>}
      </FieldDt>
      
      <FieldDt label="Parking Facility">
        <div className="space-y-2">
          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-parking-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "yes"} onChange={() => updateForm("parking", "yes")} readOnly={false} />
              Yes
            </label>
            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-parking-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "no"} onChange={() => updateForm("parking", "no")} readOnly={false} />
              No
            </label>
          </div>
          {formData.parking === "yes" && (
            <input className={inp} type="text" inputMode="numeric" placeholder="Number of parking spaces" value={formData.parkingCount} onChange={(e) => handleNumericFieldChange("parkingCount", e.target.value)} />
          )}
          {errors.parkingCount && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.parkingCount}</p>}
        </div>
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Lease Preferences</h3>
      </div>
      <FieldDt label="Preferred Lease Duration">
        {["1 Year", "2 Years", "3 Years", "4+ Years"].map(duration => (
          <label key={duration} className="flex items-center gap-2 text-[13px] mb-1.5 cursor-pointer">
            <input type="radio" name="dt-lease-duration" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === duration} onChange={() => updateForm("leaseDuration", duration)} />
            {duration}
          </label>
        ))}
      </FieldDt>
      <FieldDt label="Occupancy Details" required>
        <div className="flex flex-wrap gap-4">
          {["Single", "Family", "Bachelors", "Company Lease"].map(occupancy => (
            <label key={occupancy} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyDetails?.includes(occupancy)} onChange={() => {
                const current = formData.occupancyDetails || [];
                if (current.includes(occupancy)) {
                  updateForm("occupancyDetails", current.filter(o => o !== occupancy));
                } else {
                  updateForm("occupancyDetails", [...current, occupancy]);
                }
              }} />
              {occupancy}
            </label>
          ))}
        </div>
        {errors.occupancyDetails && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.occupancyDetails}</p>}
      </FieldDt>
      <FieldDt label="Pet Friendly">
        <div className="flex gap-5">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-pet-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leasePetFriendly === option} onChange={() => updateForm("leasePetFriendly", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Garden Space">
        <div className="flex gap-5">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-garden-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gardenSpace === option} onChange={() => updateForm("gardenSpace", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Terrace / Balcony">
        <div className="flex gap-5">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-terrace-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.terrace === option} onChange={() => updateForm("terrace", option)} />
              {option}
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
        <h3 className="text-[14px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      
      <FieldDt label="Expected Lease (₹/month)" required>
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 20,000" value={formData.expectedPrice} onChange={(e) => handleNumericFieldChange("expectedPrice", e.target.value)} />
        {errors.expectedPrice && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.expectedPrice}</p>}
      </FieldDt>
      
      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={inp} type="text" inputMode="numeric" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9]/g, '') })} />
          <input className={inp} type="text" inputMode="numeric" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9]/g, '') })} />
        </div>
      </FieldDt>
      
      <FieldDt label="Security Deposit (₹)" required hint="Enter the refundable deposit amount">
        <input className={inp} type="text" inputMode="numeric" placeholder="e.g. 50,000" value={formData.securityDeposit} onChange={(e) => handleNumericFieldChange("securityDeposit", e.target.value)} />
        {errors.securityDeposit && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.securityDeposit}</p>}
      </FieldDt>

      <FieldDt label="Price Type">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} readOnly={false} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType-lease" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} readOnly={false} />
            Negotiable
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges (₹/month)">
        <input className={inp} type="text" inputMode="numeric" placeholder="Enter monthly maintenance amount" value={formData.maintenance} onChange={(e) => handleNumericFieldChange("maintenance", e.target.value)} />
      </FieldDt>
      <FieldDt label="Available From" hint="Date from which the property is available">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </FieldDt>
      <FieldDt label="Select Amenities">
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
          <input className={inp} placeholder="e.g. Clubhouse, CCTV, Solar Panel..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-3 py-1.5 text-[13px] bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button>
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

  // STEP 5: Legal Documents
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

  // STEP 6: Bank Details
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

  // STEP 7: Communication & Declaration
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