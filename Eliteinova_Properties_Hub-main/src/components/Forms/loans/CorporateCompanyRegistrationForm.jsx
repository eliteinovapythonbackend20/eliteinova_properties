// src/components/Forms/loans/CorporateCompanyRegistrationForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const steps = [
  "Company Details",
  "Representative",
  "Login & Security",
  "Company Verification",
  "Loan Requirements",
  "Service Area",
  "Applicant Segment",
  "Applicant Profile",
];

const subtitles = [
  "Your company information",
  "Authorized representative details",
  "Secure login credentials",
  "Upload company documents",
  "Select the loans your company needs",
  "Where you process loans",
  "Applicant categories you handle",
  "Applicant profiles you serve",
];

const companyTypeOptions = [
  "Private Limited", "Public Limited", "LLP", "Partnership",
  "Proprietorship", "MNC", "Startup", "Other",
];

const representativeDepartmentOptions = [
  "Finance", "HR", "Administration", "Accounts", "Management",
  "Operations", "Sales", "Other",
];

const propertyLoanRequirements = [
  "Commercial Property Purchase", "Office / Corporate Building Purchase",
  "Commercial Property Construction", "Land / Plot Purchase",
  "Industrial Property Purchase", "Warehouse Purchase",
  "Factory / Industrial Building", "Loan Against Property",
  "Property Mortgage Loan", "Commercial Property Balance Transfer",
  "Property Renovation / Expansion", "Top-Up Loan",
];

const applicantSegmentOptions = [
  "Private Limited Companies", "Public Limited Companies", "LLP Companies",
  "Partnership Firms", "Proprietorship Businesses", "Startups",
  "MNCs", "Manufacturers", "Traders", "Service Companies",
  "IT Companies", "Export / Import Companies", "Builders / Developers",
  "Property Investors", "Commercial Property Owners", "Professionals",
];

const applicantProfileOptions = [
  "New Business Applicant", "Existing Business Owner",
  "Business Expansion Customer", "Working Capital Customer",
  "Property Purchase Customer", "Commercial Property Buyer",
  "Loan Against Property Customer", "Existing Loan Transfer Customer",
  "Debt Consolidation Customer", "Project Finance Customer",
  "Machinery Purchase Customer", "Construction Customer",
  "Startup Funding Customer", "Corporate Expansion Customer",
];

// ─────────────────────────────────────────────
// FIELD COMPONENTS
// ─────────────────────────────────────────────

const Field = ({ label, required, hint, error, children }) => (
  <div className="mb-2">
    <label className="block text-[12px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && !error ? <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p> : null}
    {error ? <p className="text-[10px] text-red-500 mt-0.5 font-medium">{error}</p> : null}
  </div>
);

const FieldDt = ({ label, required, hint, error, children }) => (
  <div className="mb-2.5">
    <label className="block text-[13px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && !error ? <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p> : null}
    {error ? <p className="text-[10px] text-red-500 mt-0.5 font-medium">{error}</p> : null}
  </div>
);

// ─────────────────────────────────────────────
// INPUT STYLES
// ─────────────────────────────────────────────

const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inErr = "border-red-400 focus:border-red-500 focus:ring-red-200";

// ─────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[6-9]\d{9}$/;
const pinRegex = /^[1-9][0-9]{5}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const cinRegex = /^[LUu][0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}$/;
const llpinRegex = /^[A-Z]{3}-[0-9]{4}$/;
const nameRegex = /^[a-zA-Z\s.'&()-]+$/;
const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const passwordChecks = (pwd) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(pwd),
});

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function CorporateCompanyRegistrationForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const contentRef = useRef(null);
  const contentRefDt = useRef(null);

  const [formData, setFormData] = useState({
    // Step 0: Company Details
    companyName: "", registrationNumber: "", companyType: "",
    industry: "", yearOfEstablishment: "", companyLogo: null,
    website: "", officialEmail: "", officialMobile: "", alternateContact: "",
    registeredAddress: "", city: "", district: "", state: "", pinCode: "",
    numberOfEmployees: "", annualTurnover: "", gstNumber: "", panNumber: "", cinLlpin: "",

    // Step 1: Authorized Representative
    repFullName: "", repEmployeeId: "", repDesignation: "", repDepartment: "",
    repEmail: "", repMobile: "", repAlternateMobile: "", repDob: "", repPhoto: null,
    repManagerName: "", repManagerEmail: "", repManagerMobile: "",

    // Step 2: Login & Security
    username: "", password: "", confirmPassword: "",
    twoFA: false, securityQuestion: "", accepted: false,

    // Step 3: Company Verification
    companyRegCert: null, panCard: null, gstCert: null,
    cinLlpinDoc: null, addressProof: null, repIdProof: null,
    repEmployeeIdCard: null, authorizationLetter: null,
    bankStatement: null, auditedFinancials: null, itrDocs: null,
    registrationDate: "", businessVintage: "", employeesCount: "",
    annualTurnoverVerify: "", existingLoans: "", existingBanking: "",
    creditFacilities: "", reportingPerson: "",

    // Step 4: Loan Requirements
    propertyLoans: [],

    // Step 5: Service Area
    loanProcessingLocation: "", serviceCity: "", serviceState: "",
    servicePincodes: "", preferredBranch: "", preferredInstitution: "",
    preferredRm: "", registeredOffice: "", corporateOffice: "",
    branchLocations: "", factoryLocation: "", warehouseLocation: "",
    projectLocation: "", otherLocations: "",

    // Step 6: Applicant Segment
    applicantSegments: [],

    // Step 7: Applicant Profile
    applicantProfiles: [],
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [repPhotoPreview, setRepPhotoPreview] = useState(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (contentRefDt.current) contentRefDt.current.scrollTop = 0;
  }, [step]);

  // ─────────────────────────────────────────────
  // VALIDATION LOGIC PER STEP
  // ─────────────────────────────────────────────

  const validateStep = (stepIndex, data = formData) => {
    const e = {};
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const currentYear = today.getFullYear();

    const validateNum = (key, label, { min = 0, max = Infinity, integer = false, required = false } = {}) => {
      const raw = data[key];
      if (raw === "" || raw === null || raw === undefined) {
        if (required) e[key] = `${label} is required`;
        return;
      }
      const n = Number(raw);
      if (isNaN(n)) e[key] = `Enter a valid ${label}`;
      else if (n < min) e[key] = `${label} cannot be less than ${min}`;
      else if (n > max) e[key] = `${label} cannot exceed ${max}`;
      else if (integer && !Number.isInteger(n)) e[key] = `${label} must be a whole number`;
    };

    const validateName = (key, label, required = false, minLen = 2) => {
      const val = (data[key] || "").trim();
      if (!val) {
        if (required) e[key] = `${label} is required`;
        return;
      }
      if (val.length < minLen) e[key] = `${label} must be at least ${minLen} characters`;
      else if (!nameRegex.test(val)) e[key] = `${label} contains invalid characters`;
    };

    // ── STEP 0: Company Details ──
    if (stepIndex === 0) {
      if (!data.companyName.trim()) e.companyName = "Company name is required";
      else if (data.companyName.trim().length < 3) e.companyName = "Company name must be at least 3 characters";

      if (!data.registrationNumber.trim())
        e.registrationNumber = "Registration number is required";
      else if (data.registrationNumber.trim().length < 5)
        e.registrationNumber = "Registration number must be at least 5 characters";

      if (!data.companyType) e.companyType = "Please select a company type";

      if (!data.industry.trim()) e.industry = "Industry is required";
      else if (data.industry.trim().length < 2) e.industry = "Industry is too short";

      if (data.yearOfEstablishment !== "" && data.yearOfEstablishment !== null) {
        const y = Number(data.yearOfEstablishment);
        if (isNaN(y) || !Number.isInteger(y)) e.yearOfEstablishment = "Enter a valid year";
        else if (y < 1800 || y > currentYear)
          e.yearOfEstablishment = `Year must be between 1800 and ${currentYear}`;
      }

      if (data.companyLogo) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
        if (!allowed.includes(data.companyLogo.type))
          e.companyLogo = "Only JPG, PNG, WEBP, or SVG allowed";
      }

      if (data.website && data.website.trim()) {
        if (!websiteRegex.test(data.website.trim()))
          e.website = "Enter a valid website URL";
      }

      if (!data.officialEmail.trim()) e.officialEmail = "Official email is required";
      else if (!emailRegex.test(data.officialEmail.trim()))
        e.officialEmail = "Enter a valid email address";

      if (!data.officialMobile.trim()) e.officialMobile = "Official mobile is required";
      else if (!mobileRegex.test(data.officialMobile.trim()))
        e.officialMobile = "Enter a valid 10-digit mobile (starts with 6-9)";

      if (data.alternateContact && data.alternateContact.trim()) {
        if (!mobileRegex.test(data.alternateContact.trim()))
          e.alternateContact = "Enter a valid 10-digit mobile (starts with 6-9)";
        else if (data.alternateContact.trim() === data.officialMobile.trim())
          e.alternateContact = "Alternate contact must differ from official mobile";
      }

      if (!data.registeredAddress.trim())
        e.registeredAddress = "Registered address is required";
      else if (data.registeredAddress.trim().length < 5)
        e.registeredAddress = "Address is too short";

      validateName("city", "City", true, 2);
      validateName("district", "District", false, 2);
      validateName("state", "State", true, 2);

      if (!data.pinCode.trim()) e.pinCode = "PIN code is required";
      else if (!pinRegex.test(data.pinCode.trim()))
        e.pinCode = "Enter a valid 6-digit PIN code";

      validateNum("numberOfEmployees", "Employee count", { min: 0, max: 1000000, integer: true });

      if (data.annualTurnover && data.annualTurnover.trim()) {
        const cleaned = data.annualTurnover.replace(/[₹,\s]/g, "").toLowerCase();
        if (cleaned && !/^\d+(\.\d+)?(cr|crore|k|l|lakh|lakhs|m|bn)?$/.test(cleaned))
          e.annualTurnover = "Enter a valid amount (e.g., ₹5 Cr)";
      }

      if (data.gstNumber && data.gstNumber.trim()) {
        if (!gstRegex.test(data.gstNumber.trim().toUpperCase()))
          e.gstNumber = "Enter a valid 15-character GST number";
      }

      if (data.panNumber && data.panNumber.trim()) {
        if (!panRegex.test(data.panNumber.trim().toUpperCase()))
          e.panNumber = "Enter a valid PAN (e.g., ABCDE1234F)";
      }

      if (data.cinLlpin && data.cinLlpin.trim()) {
        const val = data.cinLlpin.trim().toUpperCase();
        if (!cinRegex.test(val) && !llpinRegex.test(val))
          e.cinLlpin = "Enter a valid CIN or LLPIN";
      }
    }

    // ── STEP 1: Authorized Representative ──
    if (stepIndex === 1) {
      validateName("repFullName", "Representative name", true, 3);

      if (data.repEmployeeId && data.repEmployeeId.trim().length < 2)
        e.repEmployeeId = "Employee ID is too short";

      if (!data.repDesignation.trim()) e.repDesignation = "Designation is required";
      else if (data.repDesignation.trim().length < 2) e.repDesignation = "Designation is too short";

      if (!data.repDepartment) e.repDepartment = "Please select a department";

      if (!data.repEmail.trim()) e.repEmail = "Email is required";
      else if (!emailRegex.test(data.repEmail.trim()))
        e.repEmail = "Enter a valid email address";

      if (!data.repMobile.trim()) e.repMobile = "Mobile number is required";
      else if (!mobileRegex.test(data.repMobile.trim()))
        e.repMobile = "Enter a valid 10-digit mobile (starts with 6-9)";

      if (data.repAlternateMobile && data.repAlternateMobile.trim()) {
        if (!mobileRegex.test(data.repAlternateMobile.trim()))
          e.repAlternateMobile = "Enter a valid 10-digit mobile (starts with 6-9)";
        else if (data.repAlternateMobile.trim() === data.repMobile.trim())
          e.repAlternateMobile = "Alternate mobile must differ from mobile number";
      }

      if (data.repDob) {
        const dob = new Date(data.repDob);
        const age = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);
        if (dob > today) e.repDob = "Date of birth cannot be in the future";
        else if (age < 18) e.repDob = "Representative must be at least 18 years old";
        else if (age > 80) e.repDob = "Please enter a valid date of birth";
      }

      if (data.repPhoto) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(data.repPhoto.type))
          e.repPhoto = "Only JPG, PNG, or WEBP allowed";
      }

      if (data.repManagerName && data.repManagerName.trim().length < 3)
        e.repManagerName = "Manager name is too short";

      if (data.repManagerEmail && data.repManagerEmail.trim()) {
        if (!emailRegex.test(data.repManagerEmail.trim()))
          e.repManagerEmail = "Enter a valid email address";
      }

      if (data.repManagerMobile && data.repManagerMobile.trim()) {
        if (!mobileRegex.test(data.repManagerMobile.trim()))
          e.repManagerMobile = "Enter a valid 10-digit mobile (starts with 6-9)";
      }
    }

    // ── STEP 2: Login & Security ──
    if (stepIndex === 2) {
      if (!data.username.trim()) e.username = "Username is required";
      else if (data.username.includes("@")) {
        if (!emailRegex.test(data.username.trim()))
          e.username = "Enter a valid email address";
      } else if (data.username.trim().length < 3) {
        e.username = "Username must be at least 3 characters";
      }

      if (!data.password) e.password = "Password is required";
      else {
        const c = passwordChecks(data.password);
        if (!c.length || !c.upper || !c.lower || !c.number || !c.special)
          e.password = "Password must be 8+ chars with upper, lower, number & special";
      }

      if (!data.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (data.password !== data.confirmPassword)
        e.confirmPassword = "Passwords do not match";

      if (!data.accepted) e.accepted = "You must accept the Terms & Conditions";
    }

    // ── STEP 3: Company Verification ──
    if (stepIndex === 3) {
      if (!data.companyRegCert) e.companyRegCert = "Company Registration Certificate is required";
      if (!data.panCard) e.panCard = "PAN Card is required";
      if (!data.addressProof) e.addressProof = "Company Address Proof is required";
      if (!data.repIdProof) e.repIdProof = "Representative ID Proof is required";
      if (!data.authorizationLetter) e.authorizationLetter = "Authorization Letter / Board Resolution is required";

      if (data.registrationDate) {
        const rd = new Date(data.registrationDate);
        if (rd > today) e.registrationDate = "Registration date cannot be in the future";
        if (data.yearOfEstablishment) {
          const y = Number(data.yearOfEstablishment);
          if (rd.getFullYear() !== y)
            e.registrationDate = `Date should be in ${y}`;
        }
      }

      if (data.businessVintage && data.businessVintage.trim()) {
        const cleaned = data.businessVintage.replace(/[^\d.]/g, "");
        const n = parseFloat(cleaned);
        if (isNaN(n) || n < 0) e.businessVintage = "Enter a valid vintage (e.g., 5 years)";
        else if (n > 200) e.businessVintage = "Vintage seems too large";
      }

      validateNum("employeesCount", "Employee count", { min: 0, max: 1000000, integer: true });

      if (data.annualTurnoverVerify && data.annualTurnoverVerify.trim()) {
        const cleaned = data.annualTurnoverVerify.replace(/[₹,\s]/g, "").toLowerCase();
        if (cleaned && !/^\d+(\.\d+)?(cr|crore|k|l|lakh|lakhs|m|bn)?$/.test(cleaned))
          e.annualTurnoverVerify = "Enter a valid amount (e.g., ₹5 Cr)";
      }

      if (data.reportingPerson && data.reportingPerson.trim().length < 3)
        e.reportingPerson = "Name is too short";
    }

    // ── STEP 4: Loan Requirements ──
    if (stepIndex === 4) {
      if (!data.propertyLoans || data.propertyLoans.length === 0)
        e.propertyLoans = "Please select at least one loan type";
    }

    // ── STEP 5: Service Area ──
    if (stepIndex === 5) {
      if (!data.loanProcessingLocation.trim())
        e.loanProcessingLocation = "Loan processing location is required";
      else if (data.loanProcessingLocation.trim().length < 2)
        e.loanProcessingLocation = "Location is too short";

      validateName("serviceCity", "City/District", true, 2);
      validateName("serviceState", "State", true, 2);

      if (data.servicePincodes && data.servicePincodes.trim()) {
        const pins = data.servicePincodes.split(",").map((p) => p.trim()).filter(Boolean);
        const invalid = pins.find((p) => !pinRegex.test(p));
        if (invalid) e.servicePincodes = `Invalid PIN: ${invalid}`;
      }
    }

    // ── STEP 6: Applicant Segment ──
    if (stepIndex === 6) {
      if (!data.applicantSegments || data.applicantSegments.length === 0)
        e.applicantSegments = "Please select at least one applicant segment";
    }

    // ── STEP 7: Applicant Profile ──
    if (stepIndex === 7) {
      if (!data.applicantProfiles || data.applicantProfiles.length === 0)
        e.applicantProfiles = "Please select at least one applicant profile";
    }

    return e;
  };

  const stepIsValid = (stepIndex, data = formData) =>
    Object.keys(validateStep(stepIndex, data)).length === 0;

  // ─────────────────────────────────────────────
  // FORM HANDLERS
  // ─────────────────────────────────────────────

  const updateForm = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (touched[field] || submitAttempted) {
        const stepErrors = validateStep(step, next);
        setErrors(stepErrors);
      }
      return next;
    });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
  };

  const toggleArrayItem = (field, value) => {
    const current = formData[field] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateForm(field, next);
  };

  const handleImageUpload = (field, e, setPreview, maxSize = 2) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setErrors((p) => ({ ...p, [field]: "Only JPG, PNG, WEBP, or SVG allowed" }));
      e.target.value = "";
      return;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setErrors((p) => ({ ...p, [field]: `File must be less than ${maxSize}MB` }));
      e.target.value = "";
      return;
    }

    setErrors((p) => {
      const { [field]: _, ...rest } = p;
      return rest;
    });
    updateForm(field, file);
    if (setPreview) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (field, preview, setPreview) => {
    if (preview) URL.revokeObjectURL(preview);
    updateForm(field, null);
    if (setPreview) setPreview(null);
  };

  const handleDocumentUpload = (docType, e, maxSize = 5) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((p) => ({ ...p, [docType]: "Only PDF files are allowed" }));
      e.target.value = "";
      return;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setErrors((p) => ({ ...p, [docType]: `File must be less than ${maxSize}MB` }));
      e.target.value = "";
      return;
    }

    setErrors((p) => {
      const { [docType]: _, ...rest } = p;
      return rest;
    });
    updateForm(docType, file);
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    setTouched((prev) => {
      const next = { ...prev };
      Object.keys(stepErrors).forEach((k) => (next[k] = true));
      return next;
    });

    if (Object.keys(stepErrors).length > 0) {
      setTimeout(() => {
        const firstError = document.querySelector("[data-field-error='true']");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    const allErrors = {};
    for (let i = 0; i < steps.length; i++) {
      const stepErrors = validateStep(i);
      if (Object.keys(stepErrors).length > 0) {
        Object.assign(allErrors, stepErrors);
        setStep(i);
        setErrors(stepErrors);
        setSubmitAttempted(true);
        setTimeout(() => {
          const firstError = document.querySelector("[data-field-error='true']");
          if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }
    }

    try {
      console.log("Corporate Company Registration submitted:", formData);
      setSubmitAttempted(false);
      setErrors({});
      setTouched({});
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  const hasError = (field) => !!errors[field];

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
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Corporate Company Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">Register your company for loan products</p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[36px]">
                <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[6.5px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRef} className="px-3 py-2.5 overflow-y-auto flex-1">
            <MobContentCorporate
              step={step}
              inp={inMob}
              inErr={inErr}
              errors={errors}
              hasError={hasError}
              handleBlur={handleBlur}
              formData={formData}
              updateForm={updateForm}
              toggleArrayItem={toggleArrayItem}
              logoPreview={logoPreview}
              repPhotoPreview={repPhotoPreview}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleDocumentUpload={handleDocumentUpload}
              setLogoPreview={setLogoPreview}
              setRepPhotoPreview={setRepPhotoPreview}
              companyTypeOptions={companyTypeOptions}
              representativeDepartmentOptions={representativeDepartmentOptions}
              propertyLoanRequirements={propertyLoanRequirements}
              applicantSegmentOptions={applicantSegmentOptions}
              applicantProfileOptions={applicantProfileOptions}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
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
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? 'w-2 h-1 bg-green-400' : i === step ? 'w-3.5 h-1 bg-[#00695C]' : 'w-1 h-1 bg-gray-200'}`} />
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
                  step === steps.length - 1 ? handleSubmit() : handleNext();
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Corporate Company Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">Register your company for loan products</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[40px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[7px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRefDt} className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContentCorporate
              step={step}
              inp={inDt}
              inErr={inErr}
              errors={errors}
              hasError={hasError}
              handleBlur={handleBlur}
              formData={formData}
              updateForm={updateForm}
              toggleArrayItem={toggleArrayItem}
              logoPreview={logoPreview}
              repPhotoPreview={repPhotoPreview}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleDocumentUpload={handleDocumentUpload}
              setLogoPreview={setLogoPreview}
              setRepPhotoPreview={setRepPhotoPreview}
              companyTypeOptions={companyTypeOptions}
              representativeDepartmentOptions={representativeDepartmentOptions}
              propertyLoanRequirements={propertyLoanRequirements}
              applicantSegmentOptions={applicantSegmentOptions}
              applicantProfileOptions={applicantProfileOptions}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
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
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? 'w-2.5 h-1.5 bg-green-400' : i === step ? 'w-4 h-1.5 bg-[#00695C]' : 'w-1.5 h-1.5 bg-gray-200'}`} />
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
                  step === steps.length - 1 ? handleSubmit() : handleNext();
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

// ═══════════════════════════════════════════════════════════════
// MOBILE CONTENT — Corporate Company
// ═══════════════════════════════════════════════════════════════

function MobContentCorporate({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  logoPreview, repPhotoPreview, handleImageUpload, removeImage,
  handleDocumentUpload, setLogoPreview, setRepPhotoPreview,
  companyTypeOptions, representativeDepartmentOptions,
  propertyLoanRequirements, applicantSegmentOptions, applicantProfileOptions,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
}) {
  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  // STEP 0: Company Details
  if (step === 0) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Company Details</h3>
      </div>
      <Field label="Company Name" required error={errors.companyName}>
        <input className={inputCls("companyName")} value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} onBlur={() => handleBlur("companyName")} {...errAttr("companyName")} />
      </Field>
      <Field label="Company Registration Number" required error={errors.registrationNumber}>
        <input className={inputCls("registrationNumber")} value={formData.registrationNumber} onChange={(e) => updateForm("registrationNumber", e.target.value)} onBlur={() => handleBlur("registrationNumber")} {...errAttr("registrationNumber")} />
      </Field>
      <Field label="Company Type" required error={errors.companyType}>
        <select className={inputCls("companyType")} value={formData.companyType} onChange={(e) => updateForm("companyType", e.target.value)} onBlur={() => handleBlur("companyType")} {...errAttr("companyType")}>
          <option value="">Select Company Type</option>
          {companyTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Industry / Business Sector" required error={errors.industry}>
        <input className={inputCls("industry")} value={formData.industry} onChange={(e) => updateForm("industry", e.target.value)} onBlur={() => handleBlur("industry")} {...errAttr("industry")} />
      </Field>
      <Field label="Year of Establishment" error={errors.yearOfEstablishment}>
        <input className={inputCls("yearOfEstablishment")} type="number" min="1800" max={new Date().getFullYear()} value={formData.yearOfEstablishment} onChange={(e) => updateForm("yearOfEstablishment", e.target.value)} onBlur={() => handleBlur("yearOfEstablishment")} {...errAttr("yearOfEstablishment")} />
      </Field>
      <Field label="Company Logo" hint="Max 2MB" error={errors.companyLogo}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("companyLogo") ? "border-red-400" : "border-teal-300"}`} {...errAttr("companyLogo")}>
          <input type="file" accept="image/*" className="hidden" id="m-corp-logo" onChange={(e) => handleImageUpload("companyLogo", e, setLogoPreview)} />
          <label htmlFor="m-corp-logo" className="cursor-pointer flex flex-col items-center">
            <span className="text-lg mb-1">🏢</span>
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Company Logo</span>
          </label>
        </div>
        {logoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={logoPreview} alt="Logo" className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white p-1" />
            <button onClick={() => removeImage("companyLogo", logoPreview, setLogoPreview)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
      <Field label="Company Website" error={errors.website}>
        <input className={inputCls("website")} placeholder="https://" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} onBlur={() => handleBlur("website")} {...errAttr("website")} />
      </Field>
      <Field label="Official Email" required error={errors.officialEmail}>
        <input className={inputCls("officialEmail")} type="email" value={formData.officialEmail} onChange={(e) => updateForm("officialEmail", e.target.value)} onBlur={() => handleBlur("officialEmail")} {...errAttr("officialEmail")} />
      </Field>
      <Field label="Official Mobile Number" required error={errors.officialMobile}>
        <input className={inputCls("officialMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.officialMobile} onChange={(e) => updateForm("officialMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("officialMobile")} {...errAttr("officialMobile")} />
      </Field>
      <Field label="Alternate Contact Number" error={errors.alternateContact}>
        <input className={inputCls("alternateContact")} type="tel" inputMode="numeric" maxLength={10} value={formData.alternateContact} onChange={(e) => updateForm("alternateContact", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("alternateContact")} {...errAttr("alternateContact")} />
      </Field>
      <Field label="Registered Office Address" required error={errors.registeredAddress}>
        <input className={inputCls("registeredAddress")} value={formData.registeredAddress} onChange={(e) => updateForm("registeredAddress", e.target.value)} onBlur={() => handleBlur("registeredAddress")} {...errAttr("registeredAddress")} />
      </Field>
      <Field label="City" required error={errors.city}>
        <input className={inputCls("city")} value={formData.city} onChange={(e) => updateForm("city", e.target.value)} onBlur={() => handleBlur("city")} {...errAttr("city")} />
      </Field>
      <Field label="District" error={errors.district}>
        <input className={inputCls("district")} value={formData.district} onChange={(e) => updateForm("district", e.target.value)} onBlur={() => handleBlur("district")} {...errAttr("district")} />
      </Field>
      <Field label="State" required error={errors.state}>
        <input className={inputCls("state")} value={formData.state} onChange={(e) => updateForm("state", e.target.value)} onBlur={() => handleBlur("state")} {...errAttr("state")} />
      </Field>
      <Field label="PIN Code" required hint="6 digits" error={errors.pinCode}>
        <input className={inputCls("pinCode")} type="tel" inputMode="numeric" maxLength={6} value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} onBlur={() => handleBlur("pinCode")} {...errAttr("pinCode")} />
      </Field>
      <Field label="Number of Employees" error={errors.numberOfEmployees}>
        <input className={inputCls("numberOfEmployees")} type="number" min="0" value={formData.numberOfEmployees} onChange={(e) => updateForm("numberOfEmployees", e.target.value)} onBlur={() => handleBlur("numberOfEmployees")} {...errAttr("numberOfEmployees")} />
      </Field>
      <Field label="Annual Turnover" error={errors.annualTurnover}>
        <input className={inputCls("annualTurnover")} value={formData.annualTurnover} onChange={(e) => updateForm("annualTurnover", e.target.value)} onBlur={() => handleBlur("annualTurnover")} placeholder="e.g. ₹5 Cr" {...errAttr("annualTurnover")} />
      </Field>
      <Field label="GST Number" error={errors.gstNumber}>
        <input className={inputCls("gstNumber")} maxLength={15} value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value.toUpperCase())} onBlur={() => handleBlur("gstNumber")} {...errAttr("gstNumber")} />
      </Field>
      <Field label="PAN Number" error={errors.panNumber}>
        <input className={inputCls("panNumber")} maxLength={10} value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} onBlur={() => handleBlur("panNumber")} {...errAttr("panNumber")} />
      </Field>
      <Field label="CIN / LLPIN" error={errors.cinLlpin}>
        <input className={inputCls("cinLlpin")} maxLength={21} value={formData.cinLlpin} onChange={(e) => updateForm("cinLlpin", e.target.value.toUpperCase())} onBlur={() => handleBlur("cinLlpin")} {...errAttr("cinLlpin")} />
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
      <Field label="Representative Full Name" required error={errors.repFullName}>
        <input className={inputCls("repFullName")} value={formData.repFullName} onChange={(e) => updateForm("repFullName", e.target.value)} onBlur={() => handleBlur("repFullName")} {...errAttr("repFullName")} />
      </Field>
      <Field label="Employee ID" error={errors.repEmployeeId}>
        <input className={inputCls("repEmployeeId")} value={formData.repEmployeeId} onChange={(e) => updateForm("repEmployeeId", e.target.value)} onBlur={() => handleBlur("repEmployeeId")} {...errAttr("repEmployeeId")} />
      </Field>
      <Field label="Designation" required error={errors.repDesignation}>
        <input className={inputCls("repDesignation")} value={formData.repDesignation} onChange={(e) => updateForm("repDesignation", e.target.value)} onBlur={() => handleBlur("repDesignation")} {...errAttr("repDesignation")} />
      </Field>
      <Field label="Department" required error={errors.repDepartment}>
        <select className={inputCls("repDepartment")} value={formData.repDepartment} onChange={(e) => updateForm("repDepartment", e.target.value)} onBlur={() => handleBlur("repDepartment")} {...errAttr("repDepartment")}>
          <option value="">Select Department</option>
          {representativeDepartmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Official Email" required error={errors.repEmail}>
        <input className={inputCls("repEmail")} type="email" value={formData.repEmail} onChange={(e) => updateForm("repEmail", e.target.value)} onBlur={() => handleBlur("repEmail")} {...errAttr("repEmail")} />
      </Field>
      <Field label="Mobile Number" required error={errors.repMobile}>
        <input className={inputCls("repMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.repMobile} onChange={(e) => updateForm("repMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("repMobile")} {...errAttr("repMobile")} />
      </Field>
      <Field label="Alternate Mobile Number" error={errors.repAlternateMobile}>
        <input className={inputCls("repAlternateMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.repAlternateMobile} onChange={(e) => updateForm("repAlternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("repAlternateMobile")} {...errAttr("repAlternateMobile")} />
      </Field>
      <Field label="Date of Birth" error={errors.repDob}>
        <input className={inputCls("repDob")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.repDob} onChange={(e) => updateForm("repDob", e.target.value)} onBlur={() => handleBlur("repDob")} {...errAttr("repDob")} />
      </Field>
      <Field label="Profile Photo" hint="Max 2MB" error={errors.repPhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("repPhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("repPhoto")}>
          <input type="file" accept="image/*" className="hidden" id="m-corp-rep-photo" onChange={(e) => handleImageUpload("repPhoto", e, setRepPhotoPreview)} />
          <label htmlFor="m-corp-rep-photo" className="cursor-pointer flex flex-col items-center">
            <span className="text-lg mb-1">📷</span>
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Photo</span>
          </label>
        </div>
        {repPhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={repPhotoPreview} alt="Rep" className="w-20 h-20 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={() => removeImage("repPhoto", repPhotoPreview, setRepPhotoPreview)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
      <Field label="Reporting Manager Name" error={errors.repManagerName}>
        <input className={inputCls("repManagerName")} value={formData.repManagerName} onChange={(e) => updateForm("repManagerName", e.target.value)} onBlur={() => handleBlur("repManagerName")} {...errAttr("repManagerName")} />
      </Field>
      <Field label="Reporting Manager Email" error={errors.repManagerEmail}>
        <input className={inputCls("repManagerEmail")} type="email" value={formData.repManagerEmail} onChange={(e) => updateForm("repManagerEmail", e.target.value)} onBlur={() => handleBlur("repManagerEmail")} {...errAttr("repManagerEmail")} />
      </Field>
      <Field label="Reporting Manager Mobile" error={errors.repManagerMobile}>
        <input className={inputCls("repManagerMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.repManagerMobile} onChange={(e) => updateForm("repManagerMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("repManagerMobile")} {...errAttr("repManagerMobile")} />
      </Field>
    </>
  );

  // STEP 2: Login & Security
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Login & Security</h3>
      </div>
      <Field label="Username / Official Email" required error={errors.username}>
        <input className={inputCls("username")} value={formData.username} onChange={(e) => updateForm("username", e.target.value)} onBlur={() => handleBlur("username")} {...errAttr("username")} />
      </Field>
      <Field label="Password" required error={errors.password}>
        <div className="relative">
          <input className={`${inputCls("password")} pr-12`} type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => updateForm("password", e.target.value)} onBlur={() => handleBlur("password")} {...errAttr("password")} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#00695C]">
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
        {formData.password && (
          <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
            {[
              { key: "length", label: "8+ characters" },
              { key: "upper", label: "Uppercase" },
              { key: "lower", label: "Lowercase" },
              { key: "number", label: "Number" },
              { key: "special", label: "Special char" },
            ].map(({ key, label }) => {
              const ok = passwordChecks(formData.password)[key];
              return (
                <span key={key} className={`text-[9px] flex items-center gap-1 ${ok ? "text-green-600" : "text-gray-400"}`}>
                  {ok ? "✓" : "○"} {label}
                </span>
              );
            })}
          </div>
        )}
      </Field>
      <Field label="Confirm Password" required error={errors.confirmPassword}>
        <div className="relative">
          <input className={`${inputCls("confirmPassword")} pr-12`} type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} onBlur={() => handleBlur("confirmPassword")} {...errAttr("confirmPassword")} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#00695C]">
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </Field>
      <label className="flex items-center gap-2 text-[11px] cursor-pointer mb-2">
        <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Two-Factor Authentication
      </label>
      <Field label="Security Question / Recovery Option">
        <input className={inp} value={formData.securityQuestion} onChange={(e) => updateForm("securityQuestion", e.target.value)} />
      </Field>
      <div {...errAttr("accepted")}>
        <label className={`flex items-center gap-2 text-[11px] cursor-pointer ${hasError("accepted") ? "text-red-500" : ""}`}>
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.accepted} onChange={() => updateForm("accepted", !formData.accepted)} />
          I accept the Terms & Conditions <span className="text-red-500">*</span>
        </label>
        {errors.accepted && <p className="text-[10px] text-red-500 mt-0.5 ml-5 font-medium" data-field-error="true">{errors.accepted}</p>}
      </div>
    </>
  );

  // STEP 3: Company Verification
  if (step === 3) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Company Verification</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">PDF only (Max 5MB each)</p>

      {[
        { key: "companyRegCert", label: "Company Registration Certificate", req: true },
        { key: "panCard", label: "PAN Card", req: true },
        { key: "gstCert", label: "GST Certificate", req: false },
        { key: "cinLlpinDoc", label: "CIN / LLP Registration Document", req: false },
        { key: "addressProof", label: "Company Address Proof", req: true },
        { key: "repIdProof", label: "Authorized Representative ID Proof", req: true },
        { key: "repEmployeeIdCard", label: "Employee ID Card", req: false },
        { key: "authorizationLetter", label: "Authorization Letter / Board Resolution", req: true },
        { key: "bankStatement", label: "Bank Statement", req: false },
        { key: "auditedFinancials", label: "Audited Financial Statements", req: false },
        { key: "itrDocs", label: "ITR / Financial Documents", req: false },
      ].map(({ key, label, req }) => (
        <Field key={key} label={label} required={req} error={errors[key]}>
          <div className={`border-2 border-dashed rounded-xl p-2.5 text-center hover:bg-green-50 ${hasError(key) ? "border-red-400" : "border-teal-300"}`} {...errAttr(key)}>
            <input type="file" accept=".pdf" className="hidden" id={`m-corp-${key}`} onChange={(e) => handleDocumentUpload(key, e)} />
            <label htmlFor={`m-corp-${key}`} className="cursor-pointer flex flex-col items-center">
              <span className="text-lg mb-0.5">📄</span>
              <span className="text-[10px] font-semibold text-[#00695C]">Upload {label}</span>
            </label>
          </div>
          {formData[key] && <p className="text-[10px] text-green-600 mt-1">✓ {formData[key].name}</p>}
        </Field>
      ))}

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Company Information</h3>
      </div>
      <Field label="Registration Date" error={errors.registrationDate}>
        <input className={inputCls("registrationDate")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.registrationDate} onChange={(e) => updateForm("registrationDate", e.target.value)} onBlur={() => handleBlur("registrationDate")} {...errAttr("registrationDate")} />
      </Field>
      <Field label="Business Vintage" error={errors.businessVintage}>
        <input className={inputCls("businessVintage")} placeholder="e.g. 5 years" value={formData.businessVintage} onChange={(e) => updateForm("businessVintage", e.target.value)} onBlur={() => handleBlur("businessVintage")} {...errAttr("businessVintage")} />
      </Field>
      <Field label="Number of Employees" error={errors.employeesCount}>
        <input className={inputCls("employeesCount")} type="number" min="0" value={formData.employeesCount} onChange={(e) => updateForm("employeesCount", e.target.value)} onBlur={() => handleBlur("employeesCount")} {...errAttr("employeesCount")} />
      </Field>
      <Field label="Annual Turnover" error={errors.annualTurnoverVerify}>
        <input className={inputCls("annualTurnoverVerify")} placeholder="e.g. ₹5 Cr" value={formData.annualTurnoverVerify} onChange={(e) => updateForm("annualTurnoverVerify", e.target.value)} onBlur={() => handleBlur("annualTurnoverVerify")} {...errAttr("annualTurnoverVerify")} />
      </Field>
      <Field label="Existing Loans">
        <input className={inp} value={formData.existingLoans} onChange={(e) => updateForm("existingLoans", e.target.value)} />
      </Field>
      <Field label="Existing Banking Relationship">
        <input className={inp} value={formData.existingBanking} onChange={(e) => updateForm("existingBanking", e.target.value)} />
      </Field>
      <Field label="Credit Facilities Available">
        <input className={inp} value={formData.creditFacilities} onChange={(e) => updateForm("creditFacilities", e.target.value)} />
      </Field>
      <Field label="Reporting / Authorized Person" error={errors.reportingPerson}>
        <input className={inputCls("reportingPerson")} value={formData.reportingPerson} onChange={(e) => updateForm("reportingPerson", e.target.value)} onBlur={() => handleBlur("reportingPerson")} {...errAttr("reportingPerson")} />
      </Field>
    </>
  );

  // STEP 4: Loan Requirements
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property-Related Loans</h3>
      </div>
      <p className="text-[10px] text-gray-400 mb-2">Select the loans your company needs</p>
      <div className="grid grid-cols-2 gap-1" {...errAttr("propertyLoans")}>
        {propertyLoanRequirements.map(p => (
          <label key={p} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.propertyLoans.includes(p)} onChange={() => toggleArrayItem("propertyLoans", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.propertyLoans && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.propertyLoans}</p>}
    </>
  );

  // STEP 5: Service Area
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Service Area</h3>
      </div>
      <Field label="Loan Processing Location" required error={errors.loanProcessingLocation}>
        <input className={inputCls("loanProcessingLocation")} value={formData.loanProcessingLocation} onChange={(e) => updateForm("loanProcessingLocation", e.target.value)} onBlur={() => handleBlur("loanProcessingLocation")} {...errAttr("loanProcessingLocation")} />
      </Field>
      <Field label="City / District" required error={errors.serviceCity}>
        <input className={inputCls("serviceCity")} value={formData.serviceCity} onChange={(e) => updateForm("serviceCity", e.target.value)} onBlur={() => handleBlur("serviceCity")} {...errAttr("serviceCity")} />
      </Field>
      <Field label="State" required error={errors.serviceState}>
        <input className={inputCls("serviceState")} value={formData.serviceState} onChange={(e) => updateForm("serviceState", e.target.value)} onBlur={() => handleBlur("serviceState")} {...errAttr("serviceState")} />
      </Field>
      <Field label="Serviceable PIN Codes" error={errors.servicePincodes}>
        <input className={inputCls("servicePincodes")} value={formData.servicePincodes} onChange={(e) => updateForm("servicePincodes", e.target.value)} onBlur={() => handleBlur("servicePincodes")} placeholder="Comma separated" {...errAttr("servicePincodes")} />
      </Field>
      <Field label="Preferred Loan Processing Branch">
        <input className={inp} value={formData.preferredBranch} onChange={(e) => updateForm("preferredBranch", e.target.value)} />
      </Field>
      <Field label="Preferred Financial Institution">
        <input className={inp} value={formData.preferredInstitution} onChange={(e) => updateForm("preferredInstitution", e.target.value)} />
      </Field>
      <Field label="Preferred Relationship Manager">
        <input className={inp} value={formData.preferredRm} onChange={(e) => updateForm("preferredRm", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Business Operating Locations</h3>
      </div>
      <Field label="Registered Office">
        <input className={inp} value={formData.registeredOffice} onChange={(e) => updateForm("registeredOffice", e.target.value)} />
      </Field>
      <Field label="Corporate Office">
        <input className={inp} value={formData.corporateOffice} onChange={(e) => updateForm("corporateOffice", e.target.value)} />
      </Field>
      <Field label="Branch Locations">
        <input className={inp} value={formData.branchLocations} onChange={(e) => updateForm("branchLocations", e.target.value)} />
      </Field>
      <Field label="Factory Location">
        <input className={inp} value={formData.factoryLocation} onChange={(e) => updateForm("factoryLocation", e.target.value)} />
      </Field>
      <Field label="Warehouse Location">
        <input className={inp} value={formData.warehouseLocation} onChange={(e) => updateForm("warehouseLocation", e.target.value)} />
      </Field>
      <Field label="Project Location">
        <input className={inp} value={formData.projectLocation} onChange={(e) => updateForm("projectLocation", e.target.value)} />
      </Field>
      <Field label="Other Business Locations">
        <input className={inp} value={formData.otherLocations} onChange={(e) => updateForm("otherLocations", e.target.value)} />
      </Field>
    </>
  );

  // STEP 6: Applicant Segment
  if (step === 6) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Preferred Applicant Segment</h3>
      </div>
      <p className="text-[10px] text-gray-400 mb-2">Select all categories your company handles</p>
      <div className="grid grid-cols-2 gap-1" {...errAttr("applicantSegments")}>
        {applicantSegmentOptions.map(s => (
          <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.applicantSegments.includes(s)} onChange={() => toggleArrayItem("applicantSegments", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.applicantSegments && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.applicantSegments}</p>}
    </>
  );

  // STEP 7: Applicant Profile
  if (step === 7) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Applicant Profile Handled</h3>
      </div>
      <div className="grid grid-cols-2 gap-1" {...errAttr("applicantProfiles")}>
        {applicantProfileOptions.map(s => (
          <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.applicantProfiles.includes(s)} onChange={() => toggleArrayItem("applicantProfiles", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.applicantProfiles && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.applicantProfiles}</p>}
    </>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP CONTENT — Corporate Company
// ═══════════════════════════════════════════════════════════════

function DtContentCorporate({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  logoPreview, repPhotoPreview, handleImageUpload, removeImage,
  handleDocumentUpload, setLogoPreview, setRepPhotoPreview,
  companyTypeOptions, representativeDepartmentOptions,
  propertyLoanRequirements, applicantSegmentOptions, applicantProfileOptions,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
}) {
  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  // STEP 0: Company Details
  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Company Details</h3>
      </div>
      <FieldDt label="Company Name" required error={errors.companyName}>
        <input className={inputCls("companyName")} value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} onBlur={() => handleBlur("companyName")} {...errAttr("companyName")} />
      </FieldDt>
      <FieldDt label="Company Registration Number" required error={errors.registrationNumber}>
        <input className={inputCls("registrationNumber")} value={formData.registrationNumber} onChange={(e) => updateForm("registrationNumber", e.target.value)} onBlur={() => handleBlur("registrationNumber")} {...errAttr("registrationNumber")} />
      </FieldDt>
      <FieldDt label="Company Type" required error={errors.companyType}>
        <select className={inputCls("companyType")} value={formData.companyType} onChange={(e) => updateForm("companyType", e.target.value)} onBlur={() => handleBlur("companyType")} {...errAttr("companyType")}>
          <option value="">Select Company Type</option>
          {companyTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Industry / Business Sector" required error={errors.industry}>
        <input className={inputCls("industry")} value={formData.industry} onChange={(e) => updateForm("industry", e.target.value)} onBlur={() => handleBlur("industry")} {...errAttr("industry")} />
      </FieldDt>
      <FieldDt label="Year of Establishment" error={errors.yearOfEstablishment}>
        <input className={inputCls("yearOfEstablishment")} type="number" min="1800" max={new Date().getFullYear()} value={formData.yearOfEstablishment} onChange={(e) => updateForm("yearOfEstablishment", e.target.value)} onBlur={() => handleBlur("yearOfEstablishment")} {...errAttr("yearOfEstablishment")} />
      </FieldDt>
      <FieldDt label="Company Logo" hint="Max 2MB" error={errors.companyLogo}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("companyLogo") ? "border-red-400" : "border-teal-300"}`} {...errAttr("companyLogo")}>
          <input type="file" accept="image/*" className="hidden" id="dt-corp-logo" onChange={(e) => handleImageUpload("companyLogo", e, setLogoPreview)} />
          <label htmlFor="dt-corp-logo" className="cursor-pointer flex flex-col items-center">
            <span className="text-xl mb-1">🏢</span>
            <span className="text-[12px] font-semibold text-[#00695C]">Upload Company Logo</span>
          </label>
        </div>
        {logoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={logoPreview} alt="Logo" className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-white p-1" />
            <button onClick={() => removeImage("companyLogo", logoPreview, setLogoPreview)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
      <FieldDt label="Company Website" error={errors.website}>
        <input className={inputCls("website")} placeholder="https://" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} onBlur={() => handleBlur("website")} {...errAttr("website")} />
      </FieldDt>
      <FieldDt label="Official Email" required error={errors.officialEmail}>
        <input className={inputCls("officialEmail")} type="email" value={formData.officialEmail} onChange={(e) => updateForm("officialEmail", e.target.value)} onBlur={() => handleBlur("officialEmail")} {...errAttr("officialEmail")} />
      </FieldDt>
      <FieldDt label="Official Mobile Number" required error={errors.officialMobile}>
        <input className={inputCls("officialMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.officialMobile} onChange={(e) => updateForm("officialMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("officialMobile")} {...errAttr("officialMobile")} />
      </FieldDt>
      <FieldDt label="Alternate Contact Number" error={errors.alternateContact}>
        <input className={inputCls("alternateContact")} type="tel" inputMode="numeric" maxLength={10} value={formData.alternateContact} onChange={(e) => updateForm("alternateContact", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("alternateContact")} {...errAttr("alternateContact")} />
      </FieldDt>
      <FieldDt label="Registered Office Address" required error={errors.registeredAddress}>
        <input className={inputCls("registeredAddress")} value={formData.registeredAddress} onChange={(e) => updateForm("registeredAddress", e.target.value)} onBlur={() => handleBlur("registeredAddress")} {...errAttr("registeredAddress")} />
      </FieldDt>
      <FieldDt label="City" required error={errors.city}>
        <input className={inputCls("city")} value={formData.city} onChange={(e) => updateForm("city", e.target.value)} onBlur={() => handleBlur("city")} {...errAttr("city")} />
      </FieldDt>
      <FieldDt label="District" error={errors.district}>
        <input className={inputCls("district")} value={formData.district} onChange={(e) => updateForm("district", e.target.value)} onBlur={() => handleBlur("district")} {...errAttr("district")} />
      </FieldDt>
      <FieldDt label="State" required error={errors.state}>
        <input className={inputCls("state")} value={formData.state} onChange={(e) => updateForm("state", e.target.value)} onBlur={() => handleBlur("state")} {...errAttr("state")} />
      </FieldDt>
      <FieldDt label="PIN Code" required hint="6 digits" error={errors.pinCode}>
        <input className={inputCls("pinCode")} type="tel" inputMode="numeric" maxLength={6} value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} onBlur={() => handleBlur("pinCode")} {...errAttr("pinCode")} />
      </FieldDt>
      <FieldDt label="Number of Employees" error={errors.numberOfEmployees}>
        <input className={inputCls("numberOfEmployees")} type="number" min="0" value={formData.numberOfEmployees} onChange={(e) => updateForm("numberOfEmployees", e.target.value)} onBlur={() => handleBlur("numberOfEmployees")} {...errAttr("numberOfEmployees")} />
      </FieldDt>
      <FieldDt label="Annual Turnover" error={errors.annualTurnover}>
        <input className={inputCls("annualTurnover")} value={formData.annualTurnover} onChange={(e) => updateForm("annualTurnover", e.target.value)} onBlur={() => handleBlur("annualTurnover")} placeholder="e.g. ₹5 Cr" {...errAttr("annualTurnover")} />
      </FieldDt>
      <FieldDt label="GST Number" error={errors.gstNumber}>
        <input className={inputCls("gstNumber")} maxLength={15} value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value.toUpperCase())} onBlur={() => handleBlur("gstNumber")} {...errAttr("gstNumber")} />
      </FieldDt>
      <FieldDt label="PAN Number" error={errors.panNumber}>
        <input className={inputCls("panNumber")} maxLength={10} value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase())} onBlur={() => handleBlur("panNumber")} {...errAttr("panNumber")} />
      </FieldDt>
      <FieldDt label="CIN / LLPIN" error={errors.cinLlpin}>
        <input className={inputCls("cinLlpin")} maxLength={21} value={formData.cinLlpin} onChange={(e) => updateForm("cinLlpin", e.target.value.toUpperCase())} onBlur={() => handleBlur("cinLlpin")} {...errAttr("cinLlpin")} />
      </FieldDt>
    </>
  );

  // STEP 1: Representative
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Representative</h3>
      </div>
      <FieldDt label="Representative Full Name" required error={errors.repFullName}>
        <input className={inputCls("repFullName")} value={formData.repFullName} onChange={(e) => updateForm("repFullName", e.target.value)} onBlur={() => handleBlur("repFullName")} {...errAttr("repFullName")} />
      </FieldDt>
      <FieldDt label="Employee ID" error={errors.repEmployeeId}>
        <input className={inputCls("repEmployeeId")} value={formData.repEmployeeId} onChange={(e) => updateForm("repEmployeeId", e.target.value)} onBlur={() => handleBlur("repEmployeeId")} {...errAttr("repEmployeeId")} />
      </FieldDt>
      <FieldDt label="Designation" required error={errors.repDesignation}>
        <input className={inputCls("repDesignation")} value={formData.repDesignation} onChange={(e) => updateForm("repDesignation", e.target.value)} onBlur={() => handleBlur("repDesignation")} {...errAttr("repDesignation")} />
      </FieldDt>
      <FieldDt label="Department" required error={errors.repDepartment}>
        <select className={inputCls("repDepartment")} value={formData.repDepartment} onChange={(e) => updateForm("repDepartment", e.target.value)} onBlur={() => handleBlur("repDepartment")} {...errAttr("repDepartment")}>
          <option value="">Select Department</option>
          {representativeDepartmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Official Email" required error={errors.repEmail}>
        <input className={inputCls("repEmail")} type="email" value={formData.repEmail} onChange={(e) => updateForm("repEmail", e.target.value)} onBlur={() => handleBlur("repEmail")} {...errAttr("repEmail")} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.repMobile}>
        <input className={inputCls("repMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.repMobile} onChange={(e) => updateForm("repMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("repMobile")} {...errAttr("repMobile")} />
      </FieldDt>
      <FieldDt label="Alternate Mobile Number" error={errors.repAlternateMobile}>
        <input className={inputCls("repAlternateMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.repAlternateMobile} onChange={(e) => updateForm("repAlternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("repAlternateMobile")} {...errAttr("repAlternateMobile")} />
      </FieldDt>
      <FieldDt label="Date of Birth" error={errors.repDob}>
        <input className={inputCls("repDob")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.repDob} onChange={(e) => updateForm("repDob", e.target.value)} onBlur={() => handleBlur("repDob")} {...errAttr("repDob")} />
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB" error={errors.repPhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("repPhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("repPhoto")}>
          <input type="file" accept="image/*" className="hidden" id="dt-corp-rep-photo" onChange={(e) => handleImageUpload("repPhoto", e, setRepPhotoPreview)} />
          <label htmlFor="dt-corp-rep-photo" className="cursor-pointer flex flex-col items-center">
            <span className="text-xl mb-1">📷</span>
            <span className="text-[12px] font-semibold text-[#00695C]">Upload Photo</span>
          </label>
        </div>
        {repPhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={repPhotoPreview} alt="Rep" className="w-24 h-24 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={() => removeImage("repPhoto", repPhotoPreview, setRepPhotoPreview)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
      <FieldDt label="Reporting Manager Name" error={errors.repManagerName}>
        <input className={inputCls("repManagerName")} value={formData.repManagerName} onChange={(e) => updateForm("repManagerName", e.target.value)} onBlur={() => handleBlur("repManagerName")} {...errAttr("repManagerName")} />
      </FieldDt>
      <FieldDt label="Reporting Manager Email" error={errors.repManagerEmail}>
        <input className={inputCls("repManagerEmail")} type="email" value={formData.repManagerEmail} onChange={(e) => updateForm("repManagerEmail", e.target.value)} onBlur={() => handleBlur("repManagerEmail")} {...errAttr("repManagerEmail")} />
      </FieldDt>
      <FieldDt label="Reporting Manager Mobile" error={errors.repManagerMobile}>
        <input className={inputCls("repManagerMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.repManagerMobile} onChange={(e) => updateForm("repManagerMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("repManagerMobile")} {...errAttr("repManagerMobile")} />
      </FieldDt>
    </>
  );

  // STEP 2: Login & Security
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Login & Security</h3>
      </div>
      <FieldDt label="Username / Official Email" required error={errors.username}>
        <input className={inputCls("username")} value={formData.username} onChange={(e) => updateForm("username", e.target.value)} onBlur={() => handleBlur("username")} {...errAttr("username")} />
      </FieldDt>
      <FieldDt label="Password" required error={errors.password}>
        <div className="relative">
          <input className={`${inputCls("password")} pr-14`} type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => updateForm("password", e.target.value)} onBlur={() => handleBlur("password")} {...errAttr("password")} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#00695C]">
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
        {formData.password && (
          <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5">
            {[
              { key: "length", label: "8+ characters" },
              { key: "upper", label: "Uppercase" },
              { key: "lower", label: "Lowercase" },
              { key: "number", label: "Number" },
              { key: "special", label: "Special char" },
            ].map(({ key, label }) => {
              const ok = passwordChecks(formData.password)[key];
              return (
                <span key={key} className={`text-[10px] flex items-center gap-1 ${ok ? "text-green-600" : "text-gray-400"}`}>
                  {ok ? "✓" : "○"} {label}
                </span>
              );
            })}
          </div>
        )}
      </FieldDt>
      <FieldDt label="Confirm Password" required error={errors.confirmPassword}>
        <div className="relative">
          <input className={`${inputCls("confirmPassword")} pr-14`} type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} onBlur={() => handleBlur("confirmPassword")} {...errAttr("confirmPassword")} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#00695C]">
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </FieldDt>
      <label className="flex items-center gap-2 text-[13px] cursor-pointer mb-2">
        <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Two-Factor Authentication
      </label>
      <FieldDt label="Security Question / Recovery Option">
        <input className={inp} value={formData.securityQuestion} onChange={(e) => updateForm("securityQuestion", e.target.value)} />
      </FieldDt>
      <div {...errAttr("accepted")}>
        <label className={`flex items-center gap-2 text-[13px] cursor-pointer ${hasError("accepted") ? "text-red-500" : ""}`}>
          <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.accepted} onChange={() => updateForm("accepted", !formData.accepted)} />
          I accept the Terms & Conditions <span className="text-red-500">*</span>
        </label>
        {errors.accepted && <p className="text-[10px] text-red-500 mt-0.5 ml-6 font-medium" data-field-error="true">{errors.accepted}</p>}
      </div>
    </>
  );

  // STEP 3: Company Verification
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Company Verification</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">PDF only (Max 5MB each)</p>

      {[
        { key: "companyRegCert", label: "Company Registration Certificate", req: true },
        { key: "panCard", label: "PAN Card", req: true },
        { key: "gstCert", label: "GST Certificate", req: false },
        { key: "cinLlpinDoc", label: "CIN / LLP Registration Document", req: false },
        { key: "addressProof", label: "Company Address Proof", req: true },
        { key: "repIdProof", label: "Authorized Representative ID Proof", req: true },
        { key: "repEmployeeIdCard", label: "Employee ID Card", req: false },
        { key: "authorizationLetter", label: "Authorization Letter / Board Resolution", req: true },
        { key: "bankStatement", label: "Bank Statement", req: false },
        { key: "auditedFinancials", label: "Audited Financial Statements", req: false },
        { key: "itrDocs", label: "ITR / Financial Documents", req: false },
      ].map(({ key, label, req }) => (
        <FieldDt key={key} label={label} required={req} error={errors[key]}>
          <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError(key) ? "border-red-400" : "border-teal-300"}`} {...errAttr(key)}>
            <input type="file" accept=".pdf" className="hidden" id={`dt-corp-${key}`} onChange={(e) => handleDocumentUpload(key, e)} />
            <label htmlFor={`dt-corp-${key}`} className="cursor-pointer flex flex-col items-center">
              <span className="text-xl mb-0.5">📄</span>
              <span className="text-[12px] font-semibold text-[#00695C]">Upload {label}</span>
            </label>
          </div>
          {formData[key] && <p className="text-[13px] text-green-600 mt-2">✓ {formData[key].name}</p>}
        </FieldDt>
      ))}

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Company Information</h3>
      </div>
      <FieldDt label="Registration Date" error={errors.registrationDate}>
        <input className={inputCls("registrationDate")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.registrationDate} onChange={(e) => updateForm("registrationDate", e.target.value)} onBlur={() => handleBlur("registrationDate")} {...errAttr("registrationDate")} />
      </FieldDt>
      <FieldDt label="Business Vintage" error={errors.businessVintage}>
        <input className={inputCls("businessVintage")} placeholder="e.g. 5 years" value={formData.businessVintage} onChange={(e) => updateForm("businessVintage", e.target.value)} onBlur={() => handleBlur("businessVintage")} {...errAttr("businessVintage")} />
      </FieldDt>
      <FieldDt label="Number of Employees" error={errors.employeesCount}>
        <input className={inputCls("employeesCount")} type="number" min="0" value={formData.employeesCount} onChange={(e) => updateForm("employeesCount", e.target.value)} onBlur={() => handleBlur("employeesCount")} {...errAttr("employeesCount")} />
      </FieldDt>
      <FieldDt label="Annual Turnover" error={errors.annualTurnoverVerify}>
        <input className={inputCls("annualTurnoverVerify")} placeholder="e.g. ₹5 Cr" value={formData.annualTurnoverVerify} onChange={(e) => updateForm("annualTurnoverVerify", e.target.value)} onBlur={() => handleBlur("annualTurnoverVerify")} {...errAttr("annualTurnoverVerify")} />
      </FieldDt>
      <FieldDt label="Existing Loans">
        <input className={inp} value={formData.existingLoans} onChange={(e) => updateForm("existingLoans", e.target.value)} />
      </FieldDt>
      <FieldDt label="Existing Banking Relationship">
        <input className={inp} value={formData.existingBanking} onChange={(e) => updateForm("existingBanking", e.target.value)} />
      </FieldDt>
      <FieldDt label="Credit Facilities Available">
        <input className={inp} value={formData.creditFacilities} onChange={(e) => updateForm("creditFacilities", e.target.value)} />
      </FieldDt>
      <FieldDt label="Reporting / Authorized Person" error={errors.reportingPerson}>
        <input className={inputCls("reportingPerson")} value={formData.reportingPerson} onChange={(e) => updateForm("reportingPerson", e.target.value)} onBlur={() => handleBlur("reportingPerson")} {...errAttr("reportingPerson")} />
      </FieldDt>
    </>
  );

  // STEP 4: Loan Requirements
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property-Related Loans</h3>
      </div>
      <p className="text-[12px] text-gray-400 mb-3">Select the loans your company needs</p>
      <div className="grid grid-cols-2 gap-2" {...errAttr("propertyLoans")}>
        {propertyLoanRequirements.map(p => (
          <label key={p} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.propertyLoans.includes(p)} onChange={() => toggleArrayItem("propertyLoans", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.propertyLoans && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.propertyLoans}</p>}
    </>
  );

  // STEP 5: Service Area
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Service Area</h3>
      </div>
      <FieldDt label="Loan Processing Location" required error={errors.loanProcessingLocation}>
        <input className={inputCls("loanProcessingLocation")} value={formData.loanProcessingLocation} onChange={(e) => updateForm("loanProcessingLocation", e.target.value)} onBlur={() => handleBlur("loanProcessingLocation")} {...errAttr("loanProcessingLocation")} />
      </FieldDt>
      <FieldDt label="City / District" required error={errors.serviceCity}>
        <input className={inputCls("serviceCity")} value={formData.serviceCity} onChange={(e) => updateForm("serviceCity", e.target.value)} onBlur={() => handleBlur("serviceCity")} {...errAttr("serviceCity")} />
      </FieldDt>
      <FieldDt label="State" required error={errors.serviceState}>
        <input className={inputCls("serviceState")} value={formData.serviceState} onChange={(e) => updateForm("serviceState", e.target.value)} onBlur={() => handleBlur("serviceState")} {...errAttr("serviceState")} />
      </FieldDt>
      <FieldDt label="Serviceable PIN Codes" error={errors.servicePincodes}>
        <input className={inputCls("servicePincodes")} value={formData.servicePincodes} onChange={(e) => updateForm("servicePincodes", e.target.value)} onBlur={() => handleBlur("servicePincodes")} placeholder="Comma separated" {...errAttr("servicePincodes")} />
      </FieldDt>
      <FieldDt label="Preferred Loan Processing Branch">
        <input className={inp} value={formData.preferredBranch} onChange={(e) => updateForm("preferredBranch", e.target.value)} />
      </FieldDt>
      <FieldDt label="Preferred Financial Institution">
        <input className={inp} value={formData.preferredInstitution} onChange={(e) => updateForm("preferredInstitution", e.target.value)} />
      </FieldDt>
      <FieldDt label="Preferred Relationship Manager">
        <input className={inp} value={formData.preferredRm} onChange={(e) => updateForm("preferredRm", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Business Operating Locations</h3>
      </div>
      <FieldDt label="Registered Office">
        <input className={inp} value={formData.registeredOffice} onChange={(e) => updateForm("registeredOffice", e.target.value)} />
      </FieldDt>
      <FieldDt label="Corporate Office">
        <input className={inp} value={formData.corporateOffice} onChange={(e) => updateForm("corporateOffice", e.target.value)} />
      </FieldDt>
      <FieldDt label="Branch Locations">
        <input className={inp} value={formData.branchLocations} onChange={(e) => updateForm("branchLocations", e.target.value)} />
      </FieldDt>
      <FieldDt label="Factory Location">
        <input className={inp} value={formData.factoryLocation} onChange={(e) => updateForm("factoryLocation", e.target.value)} />
      </FieldDt>
      <FieldDt label="Warehouse Location">
        <input className={inp} value={formData.warehouseLocation} onChange={(e) => updateForm("warehouseLocation", e.target.value)} />
      </FieldDt>
      <FieldDt label="Project Location">
        <input className={inp} value={formData.projectLocation} onChange={(e) => updateForm("projectLocation", e.target.value)} />
      </FieldDt>
      <FieldDt label="Other Business Locations">
        <input className={inp} value={formData.otherLocations} onChange={(e) => updateForm("otherLocations", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 6: Applicant Segment
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Preferred Applicant Segment</h3>
      </div>
      <p className="text-[12px] text-gray-400 mb-3">Select all categories your company handles</p>
      <div className="grid grid-cols-2 gap-2" {...errAttr("applicantSegments")}>
        {applicantSegmentOptions.map(s => (
          <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.applicantSegments.includes(s)} onChange={() => toggleArrayItem("applicantSegments", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.applicantSegments && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.applicantSegments}</p>}
    </>
  );

  // STEP 7: Applicant Profile
  if (step === 7) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Applicant Profile Handled</h3>
      </div>
      <div className="grid grid-cols-2 gap-2" {...errAttr("applicantProfiles")}>
        {applicantProfileOptions.map(s => (
          <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.applicantProfiles.includes(s)} onChange={() => toggleArrayItem("applicantProfiles", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.applicantProfiles && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.applicantProfiles}</p>}
    </>
  );

  return null;
}