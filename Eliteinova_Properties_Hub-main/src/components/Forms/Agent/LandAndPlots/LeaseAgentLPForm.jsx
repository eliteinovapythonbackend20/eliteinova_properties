import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ImagePlus, Video, X, FileText, User, Home, PenTool, Building, Search, ChevronDown } from "lucide-react";
import { createProperty } from "../../../../services/propertyService";

const steps = ["Agent Details", "Identity Verification", "Land Details", "Pricing & Amenities", "Media Upload", "Legal Documents", "Bank Details", "Social Media", "Communication & Declaration"];
const subtitles = [
  "Enter your agent information",
  "Verify your identity",
  "Tell us about your land",
  "Set pricing & select amenities",
  "Upload land photos & video",
  "Upload legal documents",
  "Enter bank details",
  "Social media & online presence",
  "Set preferences & confirm"
];

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

// Only allows digits and limits to 10 characters (for mobile number)
const handleMobileChange = (setter) => (e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
  setter(value);
};

// Only allows digits and limits to 12 characters (for Aadhaar)
const handleAadhaarChange = (setter) => (e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 12);
  setter(value);
};

// Only allows digits and limits to 6 characters (for PIN code)
const handlePinCodeChange = (setter) => (e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
  setter(value);
};

// Only allows digits (9-18 characters for account number)
const handleAccountNumberChange = (setter) => (e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 18);
  setter(value);
};

// IFSC code validation and formatting
const handleIfscChange = (setter) => (e) => {
  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
  setter(value);
};

// Only allows letters, numbers, and spaces (for area names like "Annanagar Phase 2")
const handleAreaFieldChange = (setter) => (e) => {
  const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
  setter(value);
};

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
const contactMethods = ["Phone Call", "WhatsApp", "Email"];
const contactTimes = ["Morning", "Afternoon", "Evening", "Anytime"];
const genderOptions = ["Male", "Female", "Other"];

const serviceAreasOptions = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", 
  "Pune", "Ahmedabad", "Kolkata", "Surat", "Jaipur", 
  "Lucknow", "Nagpur", "Indore", "Bhopal", "Chandigarh", "Other"
];

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

export default function LeaseAgentLPForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    // Agent Details (Step 0)
    agentName: "", contactNumber: "", emailId: "", gender: "",
    agencyName: "", reraNumber: "", gstNumber: "", yearsExperience: "", serviceAreas: [],
    officeAddress: "", profilePhoto: null,

    // Identity Verification (Step 1)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, passportPhoto: null,
    addressLine1: "", addressLine2: "", agentKycCity: "", agentKycDistrict: "", agentKycState: "", agentKycPinCode: "",

    // Property Category & Posted By
    propertyCategory: "land_plot", postedBy: "agent", listingPurpose: "lease",
    // Land Details (Step 2)
    landTitle: "", landType: "", landCategory: "", landAddress: "", landCity: "",
    landArea: "", landAreaMin: "", landAreaMax: "", areaUnit: "sqft",
    landFacing: "", landShape: "", roadWidth: "", waterSource: "", soilType: "",
    electricityAvailable: "", selectedFeatures: [], otherFeatures: "",

    // Pricing & Amenities (Step 3)
    expectedPrice: "", budgetRange: { min: "", max: "" }, priceType: "fixed",
    maintenance: "", availableFrom: "",
    securityDeposit: "", leaseDuration: "", occupancyDetails: [],
    petFriendly: "", gardenSpace: "", terrace: "",

    // Media Upload (Step 4)
    propertyImages: [], propertyVideo: null, coverImage: null,

    // Legal Documents (Step 5)
    saleDeed: null, pattaChitta: null, encumbranceCertificate: null,
    propertyTaxReceipt: null, buildingApprovalPlan: null,
    completionCertificate: null, occupancyCertificate: null,
    leaseAgreement: null, otherSupportingDocs: [], floorPlan: null,

    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",

    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",

    // Communication & Declaration (Step 8)
    preferredContactMethod: [], preferredContactTime: "",
    declarationAccepted: false, declarationAccurate: false, declarationTerms: false,
    signature: null, signatureDate: "", signaturePlace: ""
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [customFeaturesList, setCustomFeaturesList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  const [allSignaturePoints, setAllSignaturePoints] = useState([]);
  const [activeCanvas, setActiveCanvas] = useState(null);
  const [errors, setErrors] = useState({});

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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ==================== FILE / MEDIA / SIGNATURE HANDLERS ====================
  // (Previously missing — this is what was throwing "handleImageUpload is not defined")

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ---- Profile photo (Step 0) ----
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateForm("profilePhoto", file);
    setProfilePhotoPreview(await readFileAsDataURL(file));
  };
  const removeProfilePhoto = () => {
    updateForm("profilePhoto", null);
    setProfilePhotoPreview(null);
  };

  // ---- Cover image (Step 4) ----
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateForm("coverImage", file);
    setCoverPreview(await readFileAsDataURL(file));
  };
  const removeCoverImage = () => {
    updateForm("coverImage", null);
    setCoverPreview(null);
  };

  // ---- Property images, max 3 (Step 4) ----
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - formData.propertyImages.length;
    const filesToAdd = files.slice(0, remainingSlots);
    if (filesToAdd.length === 0) return;
    updateForm("propertyImages", [...formData.propertyImages, ...filesToAdd]);
    const previews = await Promise.all(filesToAdd.map(readFileAsDataURL));
    setImagePreviews((prev) => [...prev, ...previews]);
    e.target.value = ""; // allow re-selecting the same file later
  };
  const removeImage = (idx) => {
    updateForm(
      "propertyImages",
      formData.propertyImages.filter((_, i) => i !== idx)
    );
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---- Property video (Step 4) ----
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateForm("propertyVideo", file);
    setVideoPreview(await readFileAsDataURL(file));
  };
  const removeVideo = () => {
    updateForm("propertyVideo", null);
    setVideoPreview(null);
  };

  // ---- Floor plan (Step 5) ----
  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }
    updateForm("floorPlan", file);
    setFloorPlanPreview(file.name);
  };
  const removeFloorPlan = () => {
    updateForm("floorPlan", null);
    setFloorPlanPreview(null);
  };

  // ---- Generic single-file document upload (Aadhaar, PAN, legal docs, etc.) ----
  const handleDocumentUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateForm(field, file);
  };

  // ---- Passport-size photo (Step 1) ----
  const handlePassportUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateForm(field, file);
  };

  // ---- Land features chips (Step 3) ----
  const toggleFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(feature)
        ? prev.selectedFeatures.filter((f) => f !== feature)
        : [...prev.selectedFeatures, feature],
    }));
  };
  const addCustomFeature = () => {
    const value = formData.otherFeatures.trim();
    if (!value) return;
    setCustomFeaturesList((prev) => (prev.includes(value) ? prev : [...prev, value]));
    updateForm("otherFeatures", "");
  };
  const removeCustomFeature = (feature) => {
    setCustomFeaturesList((prev) => prev.filter((f) => f !== feature));
  };

  // ---- Contact method / occupancy checkboxes ----
  const toggleContactMethod = (method) => {
    setFormData((prev) => ({
      ...prev,
      preferredContactMethod: prev.preferredContactMethod.includes(method)
        ? prev.preferredContactMethod.filter((m) => m !== method)
        : [...prev.preferredContactMethod, method],
    }));
  };
  const toggleOccupancy = (occ) => {
    setFormData((prev) => ({
      ...prev,
      occupancyDetails: prev.occupancyDetails.includes(occ)
        ? prev.occupancyDetails.filter((o) => o !== occ)
        : [...prev.occupancyDetails, occ],
    }));
  };

  // ---- Signature canvas (Step 8) ----
  const getCanvasPoint = (e, canvasId) => {
    const canvas = document.getElementById(canvasId);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };
  const startDrawing = (e, canvasId) => {
    e.preventDefault();
    setIsDrawing(true);
    setActiveCanvas(canvasId);
    setSignaturePoints([getCanvasPoint(e, canvasId)]);
  };
  const draw = (e) => {
    if (!isDrawing || !activeCanvas) return;
    e.preventDefault();
    setSignaturePoints((prev) => [...prev, getCanvasPoint(e, activeCanvas)]);
  };
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (signaturePoints.length > 1) {
      setAllSignaturePoints((prev) => [...prev, signaturePoints]);
      // store the drawn signature as an image (the backend column is text), not the boolean `true`
      const canvas = activeCanvas ? document.getElementById(activeCanvas) : null;
      updateForm("signature", canvas ? canvas.toDataURL('image/png') : null);
    }
    setSignaturePoints([]);
  };
  const clearSignature = () => {
    setAllSignaturePoints([]);
    setSignaturePoints([]);
    updateForm("signature", null);
  };

  // ==================== VALIDATION FUNCTIONS ====================

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      // Agent Name - only letters and spaces
      if (!formData.agentName.trim()) {
        e.agentName = "Agent full name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.agentName)) {
        e.agentName = "Agent name can only contain letters and spaces";
      }
      
      // Contact Number - exactly 10 digits
      if (!formData.contactNumber || formData.contactNumber.length !== 10) {
        e.contactNumber = "Enter a valid 10-digit mobile number";
      } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
        e.contactNumber = "Mobile number must contain only digits";
      }
      
      // Email
      if (!formData.emailId || !isValidEmail(formData.emailId)) {
        e.emailId = "Enter a valid email address";
      }
      
      if (!formData.gender) e.gender = "Please select your gender";
      
      // Agency Name - only letters, numbers, and spaces
      if (!formData.agencyName.trim()) {
        e.agencyName = "Agency name is required";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.agencyName)) {
        e.agencyName = "Agency name can only contain letters, numbers, and spaces";
      }
      
      // Years Experience - numeric only
      if (!formData.yearsExperience) {
        e.yearsExperience = "Years of experience is required";
      } else if (parseFloat(formData.yearsExperience) < 0) {
        e.yearsExperience = "Years of experience cannot be negative";
      } else if (!/^\d+(\.\d+)?$/.test(formData.yearsExperience)) {
        e.yearsExperience = "Enter a valid number";
      }
      
      if (!formData.serviceAreas || formData.serviceAreas.length === 0) {
        e.serviceAreas = "Please select at least one service area";
      }
      if (!formData.officeAddress.trim()) e.officeAddress = "Office address is required";
    }
    if (s === 1) {
      // Aadhaar - exactly 12 digits
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        e.aadhaarNumber = "Aadhaar number must be exactly 12 digits";
      } else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
        e.aadhaarNumber = "Aadhaar number must contain only numbers";
      }
      if (!formData.aadhaarCard) e.aadhaarCard = "Aadhaar card upload is required";
      if (!formData.passportPhoto) e.passportPhoto = "Passport-size photo is required";
      
      // Address fields - only letters, numbers, and spaces
      if (!formData.addressLine1.trim()) {
        e.addressLine1 = "Address Line 1 is required";
      } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(formData.addressLine1)) {
        e.addressLine1 = "Address contains invalid characters";
      }
      
      if (!formData.agentKycCity.trim()) {
        e.agentKycCity = "City is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.agentKycCity)) {
        e.agentKycCity = "City can only contain letters and spaces";
      }

      if (!formData.agentKycDistrict.trim()) {
        e.agentKycDistrict = "District is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.agentKycDistrict)) {
        e.agentKycDistrict = "District can only contain letters and spaces";
      }

      if (!formData.agentKycState.trim()) {
        e.agentKycState = "State is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.agentKycState)) {
        e.agentKycState = "State can only contain letters and spaces";
      }

      // PIN Code - exactly 6 digits
      if (!formData.agentKycPinCode.trim()) {
        e.agentKycPinCode = "PIN code is required";
      } else if (!/^[0-9]{6}$/.test(formData.agentKycPinCode)) {
        e.agentKycPinCode = "PIN code must be exactly 6 digits";
      }
    }
    if (s === 2) {
      if (!formData.landTitle.trim()) {
        e.landTitle = "Land title is required";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.landTitle)) {
        e.landTitle = "Land title can only contain letters, numbers, and spaces";
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
    if (s === 3) {
      // Expected Price - numeric
      if (!formData.expectedPrice) {
        e.expectedPrice = "Expected lease amount is required";
      } else if (!/^\d+(\.\d+)?$/.test(formData.expectedPrice)) {
        e.expectedPrice = "Enter a valid number";
      }
      
      // Security Deposit - numeric
      if (!formData.securityDeposit) {
        e.securityDeposit = "Security deposit is required";
      } else if (!/^\d+(\.\d+)?$/.test(formData.securityDeposit)) {
        e.securityDeposit = "Enter a valid number";
      }
    }
    if (s === 4) {
      if (!formData.coverImage) e.coverImage = "Cover image is required";
      if (formData.propertyImages.length === 0) e.propertyImages = "At least one land photo is required";
    }
    if (s === 5) {
      if (!formData.floorPlan) e.floorPlan = "Floor plan is required";
      if (!formData.leaseAgreement) e.leaseAgreement = "Lease agreement is required";
    }
    if (s === 6) {
      // Account Holder Name - only letters and spaces
      if (!formData.accountHolderName.trim()) {
        e.accountHolderName = "Account holder name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.accountHolderName)) {
        e.accountHolderName = "Account holder name can only contain letters and spaces";
      }
      
      // Account Number - 9-18 digits
      if (!formData.accountNumber) {
        e.accountNumber = "Account number is required";
      } else if (!/^[0-9]{9,18}$/.test(formData.accountNumber)) {
        e.accountNumber = "Account number must be between 9-18 digits";
      }
      
      // IFSC Code
      if (!formData.ifscCode.trim()) {
        e.ifscCode = "IFSC code is required";
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
        e.ifscCode = "Enter a valid IFSC code (e.g., SBIN0001234)";
      }
    }
    if (s === 7) {
      // No required fields in social media step
    }
    if (s === 8) {
      if (!formData.signature) e.signature = "Please draw your signature";
      if (!formData.signatureDate) e.signatureDate = "Date is required";
      
      // Signature Place - only letters and spaces
      if (!formData.signaturePlace.trim()) {
        e.signaturePlace = "Place is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.signaturePlace)) {
        e.signaturePlace = "Place can only contain letters and spaces";
      }
      
      if (!formData.declarationAccepted) e.declarationAccepted = "You must confirm this to proceed";
      if (!formData.declarationAccurate) e.declarationAccurate = "You must confirm this to proceed";
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
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Lease Land - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List land for lease on behalf of client</p>
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
            <MobContentLeaseAgentLP
              step={step}
              inp={inMob}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              handlePassportUpload={handlePassportUpload}
              toggleFeature={toggleFeature}
              landFeatures={landFeatures}
              customFeaturesList={customFeaturesList}
              addCustomFeature={addCustomFeature}
              removeCustomFeature={removeCustomFeature}
              landTypes={landTypes}
              landCategories={landCategories}
              facingOptions={facingOptions}
              shapeOptions={shapeOptions}
              waterSourceOptions={waterSourceOptions}
              soilTypeOptions={soilTypeOptions}
              yesNoOptions={yesNoOptions}
              occupancyOptions={occupancyOptions}
              leaseDurationOptions={leaseDurationOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              toggleContactMethod={toggleContactMethod}
              toggleOccupancy={toggleOccupancy}
              isValidEmail={isValidEmail}
              errors={errors}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              profilePhotoPreview={profilePhotoPreview}
              removeProfilePhoto={removeProfilePhoto}
              genderOptions={genderOptions}
              serviceAreasOptions={serviceAreasOptions}
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
            <div className="text-xl mb-0.5 relative z-10">🏞️</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Lease Land - Agent</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List land for lease on behalf of client</p>
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
            <DtContentLeaseAgentLP
              step={step}
              inp={inDt}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              handlePassportUpload={handlePassportUpload}
              toggleFeature={toggleFeature}
              landFeatures={landFeatures}
              customFeaturesList={customFeaturesList}
              addCustomFeature={addCustomFeature}
              removeCustomFeature={removeCustomFeature}
              landTypes={landTypes}
              landCategories={landCategories}
              facingOptions={facingOptions}
              shapeOptions={shapeOptions}
              waterSourceOptions={waterSourceOptions}
              soilTypeOptions={soilTypeOptions}
              yesNoOptions={yesNoOptions}
              occupancyOptions={occupancyOptions}
              leaseDurationOptions={leaseDurationOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              toggleContactMethod={toggleContactMethod}
              toggleOccupancy={toggleOccupancy}
              isValidEmail={isValidEmail}
              errors={errors}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              profilePhotoPreview={profilePhotoPreview}
              removeProfilePhoto={removeProfilePhoto}
              genderOptions={genderOptions}
              serviceAreasOptions={serviceAreasOptions}
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

// ==================== MOBILE CONTENT ====================
function MobContentLeaseAgentLP({ 
  step, inp, formData, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, handlePassportUpload,
  toggleFeature, landFeatures, customFeaturesList, 
  addCustomFeature, removeCustomFeature,
  landTypes, landCategories, facingOptions, shapeOptions,
  waterSourceOptions, soilTypeOptions, yesNoOptions,
  occupancyOptions, leaseDurationOptions,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  toggleContactMethod, toggleOccupancy,
  isValidEmail, errors,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  genderOptions, serviceAreasOptions, SearchableMultiSelect
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

  const handleMobileChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateForm(field, value);
  };

  const handleAadhaarChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    updateForm(field, value);
  };

  const handlePinChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    updateForm(field, value);
  };

  const handleAccountChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 18);
    updateForm(field, value);
  };

  const handleIfscChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    updateForm(field, value);
  };

  const handleAreaChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
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
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
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
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    }
  }, [signaturePoints, allSignaturePoints]);

  // STEP 0: Agent Details
  if (step === 0) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Personal Information</h3>
      </div>
      <Field label="Agent Full Name" required error={errors.agentName}>
        <input 
          className={inp} 
          placeholder="Enter your full name" 
          value={formData.agentName} 
          onChange={handleAlphaChange("agentName")} 
        />
      </Field>
      <Field label="Mobile Number" required error={errors.contactNumber}>
        <input 
          className={inp} 
          type="tel" 
          inputMode="numeric" 
          maxLength={10} 
          placeholder="Enter your 10-digit mobile number" 
          value={formData.contactNumber} 
          onChange={handleMobileChange("contactNumber")} 
        />
      </Field>
      <Field label="Email Address" required error={errors.emailId}>
        <input 
          className={inp} 
          type="email" 
          placeholder="Enter your email address" 
          value={formData.emailId} 
          onChange={(e) => updateForm("emailId", e.target.value)} 
        />
      </Field>
      <Field label="Gender" required error={errors.gender}>
        <div className="flex gap-4">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-gender-agent-lp" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Profile Photo" hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-profile-photo-lp" onChange={handleProfilePhotoUpload} />
          <label htmlFor="m-profile-photo-lp" className="cursor-pointer flex flex-col items-center">
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

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Agency Information</h3>
      </div>
      <Field label="Agency Name" required error={errors.agencyName}>
        <input 
          className={inp} 
          placeholder="Enter your agency name" 
          value={formData.agencyName} 
          onChange={(e) => updateForm("agencyName", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} 
        />
      </Field>
      <Field label="RERA Registration Number" hint="If applicable">
        <input 
          className={inp} 
          placeholder="Enter RERA registration number" 
          value={formData.reraNumber} 
          onChange={(e) => updateForm("reraNumber", e.target.value)} 
        />
      </Field>
      <Field label="GST Number" hint="Optional">
        <input 
          className={inp} 
          placeholder="Enter GST number" 
          value={formData.gstNumber} 
          onChange={(e) => updateForm("gstNumber", e.target.value)} 
        />
      </Field>
      <Field label="Years of Experience" required error={errors.yearsExperience}>
        <input 
          className={inp} 
          type="text" 
          inputMode="numeric"
          placeholder="Enter years of experience" 
          value={formData.yearsExperience} 
          onChange={handleNumericChange("yearsExperience")} 
        />
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
        <input 
          className={inp} 
          placeholder="Enter your office address" 
          value={formData.officeAddress} 
          onChange={(e) => updateForm("officeAddress", e.target.value)} 
        />
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
        <input 
          className={inp} 
          inputMode="numeric" 
          maxLength={12} 
          placeholder="Enter 12-digit Aadhaar number" 
          value={formData.aadhaarNumber} 
          onChange={handleAadhaarChange("aadhaarNumber")} 
        />
      </Field>
      <Field label="PAN Number">
        <input 
          className={inp} 
          placeholder="Enter 10-character PAN number" 
          value={formData.panNumber} 
          onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} 
        />
      </Field>
      <Field label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-aadhaar-lp-agent" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-aadhaar-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>
      <Field label="Upload PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-lp-agent" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-pan-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>
      <Field label="Upload Passport-size Photo" required error={errors.passportPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-passport-lp-agent" onChange={(e) => handlePassportUpload("passportPhoto", e)} />
          <label htmlFor="m-passport-lp-agent" className="cursor-pointer flex flex-col items-center">
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
        <input 
          className={inp} 
          placeholder="House number, building, street" 
          value={formData.addressLine1} 
          onChange={(e) => updateForm("addressLine1", e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, ''))} 
        />
      </Field>
      <Field label="Address Line 2">
        <input 
          className={inp} 
          placeholder="Apartment, suite, unit" 
          value={formData.addressLine2} 
          onChange={(e) => updateForm("addressLine2", e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, ''))} 
        />
      </Field>
      <Field label="City" required error={errors.agentKycCity}>
        <input
          className={inp}
          placeholder="Enter city"
          value={formData.agentKycCity}
          onChange={handleAlphaChange("agentKycCity")}
        />
      </Field>
      <Field label="District" required error={errors.agentKycDistrict}>
        <input
          className={inp}
          placeholder="Enter district"
          value={formData.agentKycDistrict}
          onChange={handleAlphaChange("agentKycDistrict")}
        />
      </Field>
      <Field label="State" required error={errors.agentKycState}>
        <input
          className={inp}
          placeholder="Enter state"
          value={formData.agentKycState}
          onChange={handleAlphaChange("agentKycState")}
        />
      </Field>
      <Field label="PIN Code" required error={errors.agentKycPinCode}>
        <input
          className={inp}
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
          value={formData.agentKycPinCode}
          onChange={handlePinChange("agentKycPinCode")}
        />
      </Field>
    </>
  );

  // STEP 2: Land Details
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Land Details</h3>
      </div>
      <Field label="Land Title / Name" required error={errors.landTitle}>
        <input 
          className={inp} 
          placeholder="e.g. Green Valley Plot 123" 
          value={formData.landTitle} 
          onChange={(e) => updateForm("landTitle", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} 
        />
      </Field>
      <Field label="Land Category" required error={errors.landCategory}>
        <select className={inp} value={formData.landCategory} onChange={(e) => updateForm("landCategory", e.target.value)}>
          <option value="">Select Land Category</option>
          {landCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </Field>
      <Field label="Land Type" required error={errors.landType}>
        <select className={inp} value={formData.landType} onChange={(e) => updateForm("landType", e.target.value)}>
          <option value="">Select Land Type</option>
          {landTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </Field>
      <Field label="Land Address" required error={errors.landAddress}>
        <textarea 
          className={`${ta} min-h-[55px]`} 
          placeholder="Enter complete land address" 
          value={formData.landAddress} 
          onChange={(e) => updateForm("landAddress", e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, ''))} 
        />
      </Field>
      <Field label="Land City" required error={errors.landCity}>
        <input 
          className={inp} 
          placeholder="Enter land city name" 
          value={formData.landCity} 
          onChange={handleAlphaChange("landCity")} 
        />
      </Field>
      <Field label="Land Area" required hint="Enter area in sq ft or acres" error={errors.landArea}>
        <div className="grid grid-cols-2 gap-1.5">
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Area" 
            value={formData.landArea} 
            onChange={(e) => updateForm("landArea", e.target.value.replace(/[^0-9.]/g, ''))} 
          />
          <select className={inp} value={formData.areaUnit} onChange={(e) => updateForm("areaUnit", e.target.value)}>
            <option value="sqft">Sq. Ft.</option>
            <option value="acres">Acres</option>
          </select>
        </div>
      </Field>
      <Field label="Area Range (Min - Max)">
        <div className="grid grid-cols-2 gap-1.5">
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Min Area" 
            value={formData.landAreaMin} 
            onChange={(e) => updateForm("landAreaMin", e.target.value.replace(/[^0-9.]/g, ''))} 
          />
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Max Area" 
            value={formData.landAreaMax} 
            onChange={(e) => updateForm("landAreaMax", e.target.value.replace(/[^0-9.]/g, ''))} 
          />
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
        <input 
          className={inp} 
          type="text" 
          inputMode="numeric"
          placeholder="Enter road width in feet" 
          value={formData.roadWidth} 
          onChange={(e) => updateForm("roadWidth", e.target.value.replace(/\D/g, ''))} 
        />
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
              <input type="radio" name="mob-electricity-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.electricityAvailable === opt} onChange={() => updateForm("electricityAvailable", opt)} />
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
        <div className="flex flex-wrap gap-2">
          {leaseDurationOptions.map(d => (
            <label key={d} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-duration-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
              {d}
            </label>
          ))}
        </div>
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
              <input type="radio" name="mob-pet-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
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
        <h3 className="text-[11px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      <Field label="Expected Lease (₹/month)" required error={errors.expectedPrice}>
        <input 
          className={inp} 
          type="text" 
          inputMode="decimal"
          placeholder="e.g. 20,000" 
          value={formData.expectedPrice} 
          onChange={(e) => updateForm("expectedPrice", e.target.value.replace(/[^0-9.]/g, ''))} 
        />
      </Field>
      <Field label="Budget Range (₹/month)">
        <div className="flex gap-1">
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Min" 
            value={formData.budgetRange.min} 
            onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9.]/g, '') })} 
          />
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Max" 
            value={formData.budgetRange.max} 
            onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9.]/g, '') })} 
          />
        </div>
      </Field>
      <Field label="Security Deposit (₹)" required error={errors.securityDeposit}>
        <input 
          className={inp} 
          type="text" 
          inputMode="decimal"
          placeholder="e.g. 50,000" 
          value={formData.securityDeposit} 
          onChange={(e) => updateForm("securityDeposit", e.target.value.replace(/[^0-9.]/g, ''))} 
        />
      </Field>
      <Field label="Price Type">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-pt-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>
      <Field label="Maintenance (₹/month)">
        <input 
          className={inp} 
          type="text" 
          inputMode="decimal"
          placeholder="Enter monthly maintenance" 
          value={formData.maintenance} 
          onChange={(e) => updateForm("maintenance", e.target.value.replace(/[^0-9.]/g, ''))} 
        />
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

  // STEP 4: Media Upload
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Media Upload</h3>
      </div>
      <p className="text-[10px] text-center text-gray-400 mb-2">📸 Upload land images and media</p>
      <Field label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-cover-lp-agent" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover-lp-agent" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Upload Land Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs-lp-agent" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs-lp-agent" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="mb-1 w-7 h-7 text-[#00695C]" />
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Land Photos</span>
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
      <Field label="Upload Land Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid-lp-agent" onChange={handleVideoUpload} />
          <label htmlFor="m-vid-lp-agent" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Upload Floor Plan / Layout" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan-lp-agent" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan-lp-agent" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Sale Deed / Title Deed">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-saleDeed-lp-agent" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="m-saleDeed-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.saleDeed.name}</p>}
      </Field>
      <Field label="Patta / Chitta">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-patta-lp-agent" onChange={(e) => handleDocumentUpload("pattaChitta", e)} />
          <label htmlFor="m-patta-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.pattaChitta && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.pattaChitta.name}</p>}
      </Field>
      <Field label="Encumbrance Certificate (EC)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-ec-lp-agent" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="m-ec-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.encumbranceCertificate.name}</p>}
      </Field>
      <Field label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-tax-lp-agent" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="m-tax-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.propertyTaxReceipt.name}</p>}
      </Field>
      <Field label="Building Approval Plan">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-building-lp-agent" onChange={(e) => handleDocumentUpload("buildingApprovalPlan", e)} />
          <label htmlFor="m-building-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.buildingApprovalPlan && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.buildingApprovalPlan.name}</p>}
      </Field>
      <Field label="Completion Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-completion-lp-agent" onChange={(e) => handleDocumentUpload("completionCertificate", e)} />
          <label htmlFor="m-completion-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.completionCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.completionCertificate.name}</p>}
      </Field>
      <Field label="Occupancy Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-occupancy-lp-agent" onChange={(e) => handleDocumentUpload("occupancyCertificate", e)} />
          <label htmlFor="m-occupancy-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.occupancyCertificate && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.occupancyCertificate.name}</p>}
      </Field>
      <Field label="Lease Agreement" required error={errors.leaseAgreement}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-leaseAgreement-lp-agent" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="m-leaseAgreement-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[9px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[9px] text-green-600 mt-0.5">✓ {formData.leaseAgreement.name}</p>}
      </Field>
      <Field label="Other Supporting Documents">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-otherDocs-lp-agent" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) alert('Only PDF files are allowed');
            updateForm("otherSupportingDocs", [...formData.otherSupportingDocs, ...validFiles]);
          }} />
          <label htmlFor="m-otherDocs-lp-agent" className="cursor-pointer flex flex-col items-center">
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
        <input 
          className={inp} 
          placeholder="Enter account holder name" 
          value={formData.accountHolderName} 
          onChange={handleAlphaChange("accountHolderName")} 
        />
      </Field>
      <Field label="Bank Name">
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank (optional)</option>
          {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Account Number" required error={errors.accountNumber}>
        <input 
          className={inp} 
          type="text" 
          inputMode="numeric"
          placeholder="Enter account number" 
          value={formData.accountNumber} 
          onChange={handleAccountChange("accountNumber")} 
        />
      </Field>
      <Field label="IFSC Code" required error={errors.ifscCode}>
        <input 
          className={inp} 
          placeholder="Enter IFSC code" 
          value={formData.ifscCode} 
          onChange={handleIfscChange("ifscCode")} 
        />
      </Field>
      <Field label="UPI ID">
        <input 
          className={inp} 
          placeholder="Enter UPI ID (e.g. name@upi)" 
          value={formData.upiId} 
          onChange={(e) => updateForm("upiId", e.target.value)} 
        />
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

  // STEP 8: Communication & Declaration
  if (step === 8) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Communication Preferences</h3>
      </div>
      <Field label="Preferred Contact Method">
        <div className="flex flex-wrap gap-2">
          {contactMethods.map(m => (
            <label key={m} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactMethod.includes(m)} onChange={() => toggleContactMethod(m)} />
              {m}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Preferred Contact Time">
        <div className="flex flex-wrap gap-2">
          {contactTimes.map(t => (
            <label key={t} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-contactTime-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === t} onChange={() => updateForm("preferredContactTime", t)} />
              {t}
            </label>
          ))}
        </div>
      </Field>

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
        <button type="button" onClick={clearSignature} className="absolute top-1 right-1 bg-[#00695C] text-white px-2 py-0.5 rounded text-[10px] hover:bg-[#004d42] transition-colors">Clear</button>
      </div>
      {errors.signature && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signature}</p>}
      <Field label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required error={errors.signaturePlace}>
        <input 
          className={inp} 
          placeholder="Enter place" 
          value={formData.signaturePlace} 
          onChange={handleAlphaChange("signaturePlace")} 
        />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I confirm that I am a licensed real estate agent or authorized representative of this land owner.</span>
        </label>
        {errors.declarationAccepted && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccepted}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents provided are accurate and authentic.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationAccurate}</p>}
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declarationTerms && <p className="text-[10px] text-red-500 font-medium ml-5">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}

// ==================== DESKTOP CONTENT ====================
function DtContentLeaseAgentLP({ 
  step, inp, formData, updateForm, 
  imagePreviews, handleImageUpload, removeImage,
  handleVideoUpload, videoPreview, removeVideo,
  handleDocumentUpload, handlePassportUpload,
  toggleFeature, landFeatures, customFeaturesList, 
  addCustomFeature, removeCustomFeature,
  landTypes, landCategories, facingOptions, shapeOptions,
  waterSourceOptions, soilTypeOptions, yesNoOptions,
  occupancyOptions, leaseDurationOptions,
  handleCoverImageUpload, handleFloorPlanUpload,
  coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan,
  toggleContactMethod, toggleOccupancy,
  isValidEmail, errors,
  startDrawing, draw, stopDrawing, clearSignature,
  signaturePoints, allSignaturePoints, setAllSignaturePoints,
  handleProfilePhotoUpload, profilePhotoPreview, removeProfilePhoto,
  genderOptions, serviceAreasOptions, SearchableMultiSelectDt
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

  const handleMobileChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    updateForm(field, value);
  };

  const handleAadhaarChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 12);
    updateForm(field, value);
  };

  const handlePinChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    updateForm(field, value);
  };

  const handleAccountChange = (field) => (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 18);
    updateForm(field, value);
  };

  const handleIfscChange = (field) => (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    updateForm(field, value);
  };

  const handleAreaChange = (field) => (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
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
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
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
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    }
  }, [signaturePoints, allSignaturePoints]);

  // STEP 0: Agent Details - Desktop
  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Personal Information</h3>
      </div>
      <FieldDt label="Agent Full Name" required error={errors.agentName}>
        <input 
          className={inp} 
          placeholder="Enter your full name" 
          value={formData.agentName} 
          onChange={handleAlphaChange("agentName")} 
        />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.contactNumber}>
        <input 
          className={inp} 
          type="tel" 
          inputMode="numeric" 
          maxLength={10} 
          placeholder="Enter your 10-digit mobile number" 
          value={formData.contactNumber} 
          onChange={handleMobileChange("contactNumber")} 
        />
      </FieldDt>
      <FieldDt label="Email Address" required error={errors.emailId}>
        <input 
          className={inp} 
          type="email" 
          placeholder="Enter your email address" 
          value={formData.emailId} 
          onChange={(e) => updateForm("emailId", e.target.value)} 
        />
      </FieldDt>
      <FieldDt label="Gender" required error={errors.gender}>
        <div className="flex gap-5">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-gender-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-profile-photo-lp" onChange={handleProfilePhotoUpload} />
          <label htmlFor="dt-profile-photo-lp" className="cursor-pointer flex flex-col items-center">
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

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Agency Information</h3>
      </div>
      <FieldDt label="Agency Name" required error={errors.agencyName}>
        <input 
          className={inp} 
          placeholder="Enter your agency name" 
          value={formData.agencyName} 
          onChange={(e) => updateForm("agencyName", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="RERA Registration Number" hint="If applicable">
        <input 
          className={inp} 
          placeholder="Enter RERA registration number" 
          value={formData.reraNumber} 
          onChange={(e) => updateForm("reraNumber", e.target.value)} 
        />
      </FieldDt>
      <FieldDt label="GST Number" hint="Optional">
        <input 
          className={inp} 
          placeholder="Enter GST number" 
          value={formData.gstNumber} 
          onChange={(e) => updateForm("gstNumber", e.target.value)} 
        />
      </FieldDt>
      <FieldDt label="Years of Experience" required error={errors.yearsExperience}>
        <input 
          className={inp} 
          type="text" 
          inputMode="numeric"
          placeholder="Enter years of experience" 
          value={formData.yearsExperience} 
          onChange={handleNumericChange("yearsExperience")} 
        />
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
        <input 
          className={inp} 
          placeholder="Enter your office address" 
          value={formData.officeAddress} 
          onChange={(e) => updateForm("officeAddress", e.target.value)} 
        />
      </FieldDt>
    </>
  );

  // STEP 1: Identity Verification - Desktop
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Identity Verification</h3>
      </div>
      <FieldDt label="Aadhaar Number" required error={errors.aadhaarNumber}>
        <input 
          className={inp} 
          inputMode="numeric" 
          maxLength={12} 
          placeholder="Enter 12-digit Aadhaar number" 
          value={formData.aadhaarNumber} 
          onChange={handleAadhaarChange("aadhaarNumber")} 
        />
      </FieldDt>
      <FieldDt label="PAN Number">
        <input 
          className={inp} 
          placeholder="Enter 10-character PAN number" 
          value={formData.panNumber} 
          onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} 
        />
      </FieldDt>
      <FieldDt label="Upload Aadhaar Card" required error={errors.aadhaarCard}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-aadhaar-lp-agent" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-aadhaar-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>
      <FieldDt label="Upload PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-lp-agent" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-pan-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>
      <FieldDt label="Upload Passport-size Photo" required error={errors.passportPhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-passport-lp-agent" onChange={(e) => handlePassportUpload("passportPhoto", e)} />
          <label htmlFor="dt-passport-lp-agent" className="cursor-pointer flex flex-col items-center">
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
        <input 
          className={inp} 
          placeholder="House number, building, street" 
          value={formData.addressLine1} 
          onChange={(e) => updateForm("addressLine1", e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="Address Line 2">
        <input 
          className={inp} 
          placeholder="Apartment, suite, unit" 
          value={formData.addressLine2} 
          onChange={(e) => updateForm("addressLine2", e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="City" required error={errors.agentKycCity}>
        <input
          className={inp}
          placeholder="Enter city"
          value={formData.agentKycCity}
          onChange={handleAlphaChange("agentKycCity")}
        />
      </FieldDt>
      <FieldDt label="District" required error={errors.agentKycDistrict}>
        <input
          className={inp}
          placeholder="Enter district"
          value={formData.agentKycDistrict}
          onChange={handleAlphaChange("agentKycDistrict")}
        />
      </FieldDt>
      <FieldDt label="State" required error={errors.agentKycState}>
        <input
          className={inp}
          placeholder="Enter state"
          value={formData.agentKycState}
          onChange={handleAlphaChange("agentKycState")}
        />
      </FieldDt>
      <FieldDt label="PIN Code" required error={errors.agentKycPinCode}>
        <input
          className={inp}
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter 6-digit PIN code"
          value={formData.agentKycPinCode}
          onChange={handlePinChange("agentKycPinCode")}
        />
      </FieldDt>
    </>
  );

  // STEP 2: Land Details - Desktop
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Land Details</h3>
      </div>
      <FieldDt label="Land Title / Name" required error={errors.landTitle}>
        <input 
          className={inp} 
          placeholder="e.g. Green Valley Plot 123" 
          value={formData.landTitle} 
          onChange={(e) => updateForm("landTitle", e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="Land Category" required error={errors.landCategory}>
        <select className={inp} value={formData.landCategory} onChange={(e) => updateForm("landCategory", e.target.value)}>
          <option value="">Select Land Category</option>
          {landCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Type" required error={errors.landType}>
        <select className={inp} value={formData.landType} onChange={(e) => updateForm("landType", e.target.value)}>
          <option value="">Select Land Type</option>
          {landTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Land Address" required error={errors.landAddress}>
        <textarea 
          className={`${ta} min-h-[70px]`} 
          placeholder="Enter complete land address" 
          value={formData.landAddress} 
          onChange={(e) => updateForm("landAddress", e.target.value.replace(/[^a-zA-Z0-9\s,.-]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="Land City" required error={errors.landCity}>
        <input 
          className={inp} 
          placeholder="Enter land city name" 
          value={formData.landCity} 
          onChange={handleAlphaChange("landCity")} 
        />
      </FieldDt>
      <FieldDt label="Land Area" required hint="Enter area in sq ft or acres" error={errors.landArea}>
        <div className="grid grid-cols-2 gap-2">
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Area" 
            value={formData.landArea} 
            onChange={(e) => updateForm("landArea", e.target.value.replace(/[^0-9.]/g, ''))} 
          />
          <select className={inp} value={formData.areaUnit} onChange={(e) => updateForm("areaUnit", e.target.value)}>
            <option value="sqft">Sq. Ft.</option>
            <option value="acres">Acres</option>
          </select>
        </div>
      </FieldDt>
      <FieldDt label="Area Range (Min - Max)">
        <div className="grid grid-cols-2 gap-2">
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Min Area" 
            value={formData.landAreaMin} 
            onChange={(e) => updateForm("landAreaMin", e.target.value.replace(/[^0-9.]/g, ''))} 
          />
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Max Area" 
            value={formData.landAreaMax} 
            onChange={(e) => updateForm("landAreaMax", e.target.value.replace(/[^0-9.]/g, ''))} 
          />
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
        <input 
          className={inp} 
          type="text" 
          inputMode="numeric"
          placeholder="Enter road width in feet" 
          value={formData.roadWidth} 
          onChange={(e) => updateForm("roadWidth", e.target.value.replace(/\D/g, ''))} 
        />
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
              <input type="radio" name="dt-electricity-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.electricityAvailable === opt} onChange={() => updateForm("electricityAvailable", opt)} />
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
            <input type="radio" name="dt-duration-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.leaseDuration === d} onChange={() => updateForm("leaseDuration", d)} />
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
              <input type="radio" name="dt-pet-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === opt} onChange={() => updateForm("petFriendly", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 3: Pricing & Amenities - Desktop
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      <FieldDt label="Expected Lease (₹/month)" required error={errors.expectedPrice}>
        <input 
          className={inp} 
          type="text" 
          inputMode="decimal"
          placeholder="e.g. 20,000" 
          value={formData.expectedPrice} 
          onChange={(e) => updateForm("expectedPrice", e.target.value.replace(/[^0-9.]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="Budget Range (₹/month)">
        <div className="flex gap-2">
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Min" 
            value={formData.budgetRange.min} 
            onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value.replace(/[^0-9.]/g, '') })} 
          />
          <input 
            className={inp} 
            type="text" 
            inputMode="decimal"
            placeholder="Max" 
            value={formData.budgetRange.max} 
            onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value.replace(/[^0-9.]/g, '') })} 
          />
        </div>
      </FieldDt>
      <FieldDt label="Security Deposit (₹)" required error={errors.securityDeposit}>
        <input 
          className={inp} 
          type="text" 
          inputMode="decimal"
          placeholder="e.g. 50,000" 
          value={formData.securityDeposit} 
          onChange={(e) => updateForm("securityDeposit", e.target.value.replace(/[^0-9.]/g, ''))} 
        />
      </FieldDt>
      <FieldDt label="Price Type">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-pt-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges (₹/month)">
        <input 
          className={inp} 
          type="text" 
          inputMode="decimal"
          placeholder="Enter monthly maintenance amount" 
          value={formData.maintenance} 
          onChange={(e) => updateForm("maintenance", e.target.value.replace(/[^0-9.]/g, ''))} 
        />
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

  // STEP 4: Media Upload - Desktop
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Media Upload</h3>
      </div>
      <p className="text-[11px] text-center text-gray-400 mb-3">📸 Upload land images and media</p>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB" error={errors.coverImage}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-cover-lp-agent" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover-lp-agent" className="cursor-pointer flex flex-col items-center">
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
      <FieldDt label="Upload Land Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`} error={errors.propertyImages}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs-lp-agent" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs-lp-agent" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]" />
            <span className="text-[13px] font-semibold text-[#00695C]">Upload Land Photos</span>
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
      <FieldDt label="Upload Land Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid-lp-agent" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid-lp-agent" className="cursor-pointer flex flex-col items-center">
            <Video className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]" />
            <span className="text-[13px] font-semibold text-[#00695C]">Upload Video Tour</span>
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

  // STEP 5: Legal Documents - Desktop
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Legal Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>
      <FieldDt label="Upload Floor Plan / Layout" required hint="PDF only (Max 5MB)" error={errors.floorPlan}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan-lp-agent" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan-lp-agent" className="cursor-pointer flex flex-col items-center">
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
      <FieldDt label="Sale Deed / Title Deed">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-saleDeed-lp-agent" onChange={(e) => handleDocumentUpload("saleDeed", e)} />
          <label htmlFor="dt-saleDeed-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.saleDeed && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.saleDeed.name}</p>}
      </FieldDt>
      <FieldDt label="Patta / Chitta">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-patta-lp-agent" onChange={(e) => handleDocumentUpload("pattaChitta", e)} />
          <label htmlFor="dt-patta-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.pattaChitta && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.pattaChitta.name}</p>}
      </FieldDt>
      <FieldDt label="Encumbrance Certificate (EC)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-ec-lp-agent" onChange={(e) => handleDocumentUpload("encumbranceCertificate", e)} />
          <label htmlFor="dt-ec-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.encumbranceCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.encumbranceCertificate.name}</p>}
      </FieldDt>
      <FieldDt label="Property Tax Receipt">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-tax-lp-agent" onChange={(e) => handleDocumentUpload("propertyTaxReceipt", e)} />
          <label htmlFor="dt-tax-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.propertyTaxReceipt && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.propertyTaxReceipt.name}</p>}
      </FieldDt>
      <FieldDt label="Building Approval Plan">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-building-lp-agent" onChange={(e) => handleDocumentUpload("buildingApprovalPlan", e)} />
          <label htmlFor="dt-building-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.buildingApprovalPlan && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.buildingApprovalPlan.name}</p>}
      </FieldDt>
      <FieldDt label="Completion Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-completion-lp-agent" onChange={(e) => handleDocumentUpload("completionCertificate", e)} />
          <label htmlFor="dt-completion-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.completionCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.completionCertificate.name}</p>}
      </FieldDt>
      <FieldDt label="Occupancy Certificate">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-occupancy-lp-agent" onChange={(e) => handleDocumentUpload("occupancyCertificate", e)} />
          <label htmlFor="dt-occupancy-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.occupancyCertificate && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.occupancyCertificate.name}</p>}
      </FieldDt>
      <FieldDt label="Lease Agreement" required error={errors.leaseAgreement}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-leaseAgreement-lp-agent" onChange={(e) => handleDocumentUpload("leaseAgreement", e)} />
          <label htmlFor="dt-leaseAgreement-lp-agent" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] text-[#00695C] font-semibold mt-0.5">Upload</span>
          </label>
        </div>
        {formData.leaseAgreement && <p className="text-[10px] text-green-600 mt-0.5">✓ {formData.leaseAgreement.name}</p>}
      </FieldDt>
      <FieldDt label="Other Supporting Documents">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-otherDocs-lp-agent" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) alert('Only PDF files are allowed');
            updateForm("otherSupportingDocs", [...formData.otherSupportingDocs, ...validFiles]);
          }} />
          <label htmlFor="dt-otherDocs-lp-agent" className="cursor-pointer flex flex-col items-center">
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

  // STEP 6: Bank Details - Desktop
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">Enter your bank details for lease payments</p>
      <FieldDt label="Account Holder Name" required error={errors.accountHolderName}>
        <input 
          className={inp} 
          placeholder="Enter account holder name" 
          value={formData.accountHolderName} 
          onChange={handleAlphaChange("accountHolderName")} 
        />
      </FieldDt>
      <FieldDt label="Bank Name">
        <select className={inp} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)}>
          <option value="">Select Bank (optional)</option>
          {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Account Number" required error={errors.accountNumber}>
        <input 
          className={inp} 
          type="text" 
          inputMode="numeric"
          placeholder="Enter account number" 
          value={formData.accountNumber} 
          onChange={handleAccountChange("accountNumber")} 
        />
      </FieldDt>
      <FieldDt label="IFSC Code" required error={errors.ifscCode}>
        <input 
          className={inp} 
          placeholder="Enter IFSC code" 
          value={formData.ifscCode} 
          onChange={handleIfscChange("ifscCode")} 
        />
      </FieldDt>
      <FieldDt label="UPI ID">
        <input 
          className={inp} 
          placeholder="Enter UPI ID (e.g. name@upi)" 
          value={formData.upiId} 
          onChange={(e) => updateForm("upiId", e.target.value)} 
        />
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

  // STEP 8: Communication & Declaration - Desktop
  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Communication Preferences</h3>
      </div>
      <FieldDt label="Preferred Contact Method">
        <div className="flex gap-5">
          {contactMethods.map(m => (
            <label key={m} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactMethod.includes(m)} onChange={() => toggleContactMethod(m)} />
              {m}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Preferred Contact Time">
        <div className="flex gap-5">
          {contactTimes.map(t => (
            <label key={t} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-contactTime-lp-agent" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.preferredContactTime === t} onChange={() => updateForm("preferredContactTime", t)} />
              {t}
            </label>
          ))}
        </div>
      </FieldDt>

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
        <button type="button" onClick={clearSignature} className="absolute top-2 right-3 bg-[#00695C] text-white px-3 py-0.5 rounded text-xs hover:bg-[#004d42] transition-colors">Clear</button>
      </div>
      {errors.signature && <p className="text-[10px] text-red-500 font-medium mt-0.5">{errors.signature}</p>}
      <FieldDt label="Date" required error={errors.signatureDate}>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required error={errors.signaturePlace}>
        <input 
          className={inp} 
          placeholder="Enter place" 
          value={formData.signaturePlace} 
          onChange={handleAlphaChange("signaturePlace")} 
        />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>
      <div className="space-y-1.5">
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I confirm that I am a licensed real estate agent or authorized representative of this land owner.</span>
        </label>
        {errors.declarationAccepted && <p className="text-[10px] text-red-500 font-medium ml-6">{errors.declarationAccepted}</p>}
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccurate} onChange={() => updateForm("declarationAccurate", !formData.declarationAccurate)} />
          <span>I certify that all information and documents provided are accurate and authentic.</span>
        </label>
        {errors.declarationAccurate && <p className="text-[10px] text-red-500 font-medium ml-6">{errors.declarationAccurate}</p>}
        <label className="flex items-start gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationTerms} onChange={() => updateForm("declarationTerms", !formData.declarationTerms)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
        {errors.declarationTerms && <p className="text-[10px] text-red-500 font-medium ml-6">{errors.declarationTerms}</p>}
      </div>
    </>
  );

  return null;
}