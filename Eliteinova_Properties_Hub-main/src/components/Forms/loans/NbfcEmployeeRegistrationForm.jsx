// src/components/Forms/loans/NbfcEmployeeRegistrationForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const steps = [
  "Employee Details",
  "NBFC Company",
  "Verification",
  "Products",
  "Processing",
  "Service Area",
  "Customer",
  "Eligibility",
];

const subtitles = [
  "Enter your personal information",
  "Your NBFC and branch details",
  "Upload ID and reporting details",
  "Select the products you can offer",
  "Stages you are authorized to handle",
  "Where you can process loans",
  "The customers you serve",
  "Preferred customer criteria",
];

const genderOptions = ["Male", "Female", "Other"];
const yesNoOptions = ["Yes", "No"];
const employmentTypeOptions = ["Permanent", "Contract", "Consultant"];
const departmentOptions = [
  "Sales", "Loan Processing", "Credit", "Underwriting", "Operations",
  "Collections", "Customer Service", "Relationship Management",
  "Branch Management", "Legal", "Other",
];
const serviceAreaTypeOptions = [
  "Branch Level", "City Level", "District Level", "State Level",
  "Multiple States", "Pan India",
];

const loanProductsList = [
  "Home Purchase Loan", "Land / Plot Purchase Loan", "House Construction Loan",
  "Plot + Construction Loan", "Home Renovation Loan", "Commercial Property Loan",
  "Commercial Property Purchase Loan", "Loan Against Property", "Mortgage Loan",
  "Property Purchase Loan", "Property Loan Balance Transfer", "Home Loan Balance Transfer",
  "Top-Up Loan", "Builder / Project Finance",
];

const loanProcessingStages = [
  "Lead Generation", "Customer Contact", "Initial Eligibility Check",
  "KYC Verification", "Document Collection", "Document Verification",
  "Income Verification", "Credit Assessment", "Underwriting",
  "Property Verification", "Legal Verification", "Technical Verification",
  "Loan Sanction Processing", "Agreement / Documentation",
  "Disbursement Processing", "Post-Disbursement Support", "Customer Follow-up",
];

const customerSegmentList = [
  "Salaried Employees", "Self-Employed", "Business Owners", "Professionals",
  "Corporate Employees", "MSME Owners", "Startup Founders", "Traders",
  "Manufacturers", "NRIs", "Property Investors", "Builders / Developers",
  "Commercial Property Owners", "Land / Plot Buyers", "First-Time Home Buyers",
  "Existing Property Owners",
];

const customerProfileList = [
  "First-Time Home Buyer", "Existing Property Owner", "Property Investor",
  "Home Loan Transfer Customer", "Construction Customer", "Commercial Property Buyer",
  "Loan Against Property Customer", "Business Loan Customer", "MSME Customer",
  "Startup Customer", "Self-Employed Customer", "Salaried Customer",
  "Property Developer", "Builder / Project Customer", "Vehicle Finance Customer",
  "Personal Loan Customer",
];

const eligibilityEmploymentTypes = [
  "Salaried", "Self-Employed", "Business", "Professional",
  "Corporate Employee", "NRI",
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
const nameRegex = /^[a-zA-Z\s.'&()-]+$/;
const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
const alphanumericRegex = /^[a-zA-Z0-9\-_/]+$/;

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

export default function NbfcEmployeeRegistrationForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const contentRef = useRef(null);
  const contentRefDt = useRef(null);

  const [formData, setFormData] = useState({
    // Step 0: Employee Details
    fullName: "", employeeId: "", gender: "", dob: "", profilePhoto: null,
    mobileNumber: "", emailId: "", alternateMobile: "",
    designation: "", department: "", username: "", password: "", confirmPassword: "",
    twoFA: false, mobileOTP: false, emailVerify: false,
    securityQuestion: "", accepted: false,

    // Step 1: NBFC Company
    companyName: "", registrationNumber: "", branchName: "", branchCode: "",
    officeAddress: "", city: "", district: "", state: "", pinCode: "",
    officePhone: "", companyEmail: "", website: "", regionalOffice: "",
    areaManagerName: "",

    // Step 2: Verification
    idCardDoc: null, joiningDate: "", yearsExperience: "",
    employmentType: "", managerName: "", managerId: "", managerEmail: "",
    employeeDepartment: "", employeeDesignation: "", employeeStatus: "",
    companyAuthLetter: null, addressProofDoc: null,
    officialEmailVerified: false, otherSupportDocs: null,

    // Step 3: Products
    loanProducts: [],

    // Step 4: Processing Capability
    processingStages: [],

    // Step 5: Service Area
    loanLocation: "", branchLocation: "", serviceCity: "", serviceState: "",
    servicePincodes: "", serviceCities: "", serviceDistricts: "", serviceStates: "",
    serviceAreaType: "",

    // Step 6: Customer Segment
    customerSegments: [],

    // Step 7: Customer Profile
    customerProfiles: [],

    // Step 8: Eligibility
    eligibilityEmploymentTypes: [],
    monthlyIncomeRange: "", annualIncomeRange: "", businessTurnoverRange: "",
    cibilRange: "", existingLoanStatus: "", existingEmiRange: "",
    foirRange: "", ltvRange: "",
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

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

    const validateNum = (key, label, { min = 0, max = 60, integer = false, required = false } = {}) => {
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

    const validateRange = (key, label) => {
      if (data[key] && data[key].trim()) {
        const cleaned = data[key].replace(/[₹,\s]/g, "");
        if (!/^\d+(\.\d+)?([-–]\d+(\.\d+)?)?(lakh|lakhs|l|k|cr|crore|m)?$/i.test(cleaned)
          && !/^\d+(\.\d+)?[-–]\d+(\.\d+)?$/i.test(cleaned)) {
          e[key] = `Enter a valid ${label}`;
        }
      }
    };

    // ── STEP 0: Employee Details ──
    if (stepIndex === 0) {
      validateName("fullName", "Full name", true, 3);

      if (!data.employeeId.trim()) e.employeeId = "Employee ID is required";
      else if (data.employeeId.trim().length < 3)
        e.employeeId = "Employee ID must be at least 3 characters";
      else if (!alphanumericRegex.test(data.employeeId.trim()))
        e.employeeId = "Only letters, numbers, - _ / allowed";

      if (data.dob) {
        const dob = new Date(data.dob);
        const age = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);
        if (dob > today) e.dob = "Date of birth cannot be in the future";
        else if (age < 18) e.dob = "Employee must be at least 18 years old";
        else if (age > 80) e.dob = "Please enter a valid date of birth";
      }

      if (!data.mobileNumber.trim()) e.mobileNumber = "Mobile number is required";
      else if (!mobileRegex.test(data.mobileNumber.trim()))
        e.mobileNumber = "Enter a valid 10-digit mobile (starts with 6-9)";

      if (!data.emailId.trim()) e.emailId = "Official email is required";
      else if (!emailRegex.test(data.emailId.trim()))
        e.emailId = "Enter a valid email address";

      if (data.alternateMobile && data.alternateMobile.trim()) {
        if (!mobileRegex.test(data.alternateMobile.trim()))
          e.alternateMobile = "Enter a valid 10-digit mobile (starts with 6-9)";
        else if (data.alternateMobile.trim() === data.mobileNumber.trim())
          e.alternateMobile = "Alternate mobile must differ from mobile number";
      }

      if (!data.designation.trim()) e.designation = "Designation is required";
      else if (data.designation.trim().length < 2) e.designation = "Designation is too short";

      if (!data.department) e.department = "Please select a department";

      if (data.profilePhoto) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(data.profilePhoto.type))
          e.profilePhoto = "Only JPG, PNG, or WEBP allowed";
      }

      // Login
      if (!data.username.trim()) e.username = "Username/Email is required";
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

    // ── STEP 1: NBFC Company ──
    if (stepIndex === 1) {
      if (!data.companyName.trim()) e.companyName = "NBFC company name is required";
      else if (data.companyName.trim().length < 2) e.companyName = "Company name is too short";

      if (!data.registrationNumber.trim())
        e.registrationNumber = "Registration / License number is required";
      else if (data.registrationNumber.trim().length < 5)
        e.registrationNumber = "License number must be at least 5 characters";

      if (!data.branchName.trim()) e.branchName = "Branch/Office name is required";
      else if (data.branchName.trim().length < 2) e.branchName = "Branch name is too short";

      if (!data.branchCode.trim()) e.branchCode = "Branch/Office code is required";
      else if (data.branchCode.trim().length < 2)
        e.branchCode = "Code must be at least 2 characters";

      if (!data.officeAddress.trim()) e.officeAddress = "Office address is required";
      else if (data.officeAddress.trim().length < 5) e.officeAddress = "Address is too short";

      validateName("city", "City", true, 2);
      validateName("district", "District", false, 2);
      validateName("state", "State", true, 2);

      if (!data.pinCode.trim()) e.pinCode = "PIN code is required";
      else if (!pinRegex.test(data.pinCode.trim()))
        e.pinCode = "Enter a valid 6-digit PIN code";

      if (data.officePhone && data.officePhone.trim()) {
        if (!/^\d{10,11}$/.test(data.officePhone.trim()))
          e.officePhone = "Enter a valid 10-11 digit phone number";
      }

      if (!data.companyEmail.trim()) e.companyEmail = "Company email is required";
      else if (!emailRegex.test(data.companyEmail.trim()))
        e.companyEmail = "Enter a valid email address";

      if (data.website && data.website.trim()) {
        if (!websiteRegex.test(data.website.trim()))
          e.website = "Enter a valid website URL";
      }

      if (data.areaManagerName && data.areaManagerName.trim().length < 3)
        e.areaManagerName = "Manager name is too short";
    }

    // ── STEP 2: Verification ──
    if (stepIndex === 2) {
      if (!data.idCardDoc) e.idCardDoc = "Employee ID Card is required";

      if (!data.joiningDate) e.joiningDate = "Joining date is required";
      else {
        const jd = new Date(data.joiningDate);
        if (jd > today) e.joiningDate = "Joining date cannot be in the future";
        if (data.dob) {
          const dob = new Date(data.dob);
          if (jd < dob) e.joiningDate = "Joining date cannot be before date of birth";
        }
      }

      validateNum("yearsExperience", "Years of experience", { min: 0, max: 60 });

      if (!data.employmentType) e.employmentType = "Please select an employment type";

      if (data.managerName && data.managerName.trim().length < 3)
        e.managerName = "Manager name is too short";
      if (data.managerId && data.managerId.trim().length < 2)
        e.managerId = "Manager ID is too short";
      if (data.managerEmail && data.managerEmail.trim()) {
        if (!emailRegex.test(data.managerEmail.trim()))
          e.managerEmail = "Enter a valid email address";
      }
    }

    // ── STEP 3: Products ──
    if (stepIndex === 3) {
      if (!data.loanProducts || data.loanProducts.length === 0)
        e.loanProducts = "Please select at least one loan product";
    }

    // ── STEP 4: Processing ──
    if (stepIndex === 4) {
      if (!data.processingStages || data.processingStages.length === 0)
        e.processingStages = "Please select at least one processing stage";
    }

    // ── STEP 5: Service Area ──
    if (stepIndex === 5) {
      if (!data.loanLocation.trim()) e.loanLocation = "Loan processing location is required";
      else if (data.loanLocation.trim().length < 2) e.loanLocation = "Location is too short";

      validateName("serviceCity", "City/District", true, 2);
      validateName("serviceState", "State", true, 2);

      if (data.servicePincodes && data.servicePincodes.trim()) {
        const pins = data.servicePincodes.split(",").map((p) => p.trim()).filter(Boolean);
        const invalid = pins.find((p) => !pinRegex.test(p));
        if (invalid) e.servicePincodes = `Invalid PIN: ${invalid}`;
      }

      if (!data.serviceAreaType) e.serviceAreaType = "Please select a service area type";
    }

    // ── STEP 6: Customer Segment ──
    if (stepIndex === 6) {
      if (!data.customerSegments || data.customerSegments.length === 0)
        e.customerSegments = "Please select at least one customer segment";
    }

    // ── STEP 7: Customer Profile ──
    if (stepIndex === 7) {
      if (!data.customerProfiles || data.customerProfiles.length === 0)
        e.customerProfiles = "Please select at least one customer profile";
    }

    // ── STEP 8: Eligibility ──
    if (stepIndex === 8) {
      validateRange("monthlyIncomeRange", "monthly income range");
      validateRange("annualIncomeRange", "annual income range");
      validateRange("businessTurnoverRange", "business turnover range");

      if (data.cibilRange && data.cibilRange.trim()) {
        const cleaned = data.cibilRange.replace(/\s/g, "");
        const match = cleaned.match(/^(\d{3})[-–to]*(\d{3})?$/);
        if (!match) e.cibilRange = "Enter a valid CIBIL range (e.g. 700-850)";
        else {
          const low = Number(match[1]);
          const high = match[2] ? Number(match[2]) : low;
          if (low < 300 || high > 900) e.cibilRange = "CIBIL must be between 300 and 900";
          else if (low > high) e.cibilRange = "Low value cannot exceed high value";
        }
      }

      validateRange("existingEmiRange", "EMI range");

      if (data.foirRange && data.foirRange.trim()) {
        const cleaned = data.foirRange.replace(/[%\s]/g, "");
        const match = cleaned.match(/^(\d+(\.\d+)?)[-–to]*(\d+(\.\d+)?)?$/);
        if (!match) e.foirRange = "Enter a valid FOIR range (e.g. 40-60%)";
        else {
          const low = Number(match[1]);
          const high = match[3] ? Number(match[3]) : low;
          if (low < 0 || high > 100) e.foirRange = "FOIR must be between 0 and 100%";
          else if (low > high) e.foirRange = "Low value cannot exceed high value";
        }
      }

      if (data.ltvRange && data.ltvRange.trim()) {
        const cleaned = data.ltvRange.replace(/[%\s]/g, "");
        const match = cleaned.match(/^(\d+(\.\d+)?)[-–to]*(\d+(\.\d+)?)?$/);
        if (!match) e.ltvRange = "Enter a valid LTV range (e.g. 70-90%)";
        else {
          const low = Number(match[1]);
          const high = match[3] ? Number(match[3]) : low;
          if (low < 0 || high > 100) e.ltvRange = "LTV must be between 0 and 100%";
          else if (low > high) e.ltvRange = "Low value cannot exceed high value";
        }
      }
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

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrors((p) => ({ ...p, profilePhoto: "Only JPG, PNG, or WEBP allowed" }));
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, profilePhoto: "Profile photo must be less than 2MB" }));
      e.target.value = "";
      return;
    }

    setErrors((p) => {
      const { profilePhoto, ...rest } = p;
      return rest;
    });
    updateForm("profilePhoto", file);
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const removeProfilePhoto = () => {
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
    updateForm("profilePhoto", null);
    setProfilePhotoPreview(null);
  };

  const handleDocumentUpload = (docType, e, maxSize = 2) => {
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
      console.log("NBFC Employee Registration submitted:", formData);
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
            <div className="text-xl mb-0.5 relative z-10">🏦</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">NBFC Employee Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">Register as an NBFC employee or agent</p>
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
            <MobContentNbfcEmp
              step={step}
              inp={inMob}
              inErr={inErr}
              errors={errors}
              hasError={hasError}
              handleBlur={handleBlur}
              formData={formData}
              updateForm={updateForm}
              toggleArrayItem={toggleArrayItem}
              profilePhotoPreview={profilePhotoPreview}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              removeProfilePhoto={removeProfilePhoto}
              handleDocumentUpload={handleDocumentUpload}
              genderOptions={genderOptions}
              departmentOptions={departmentOptions}
              employmentTypeOptions={employmentTypeOptions}
              serviceAreaTypeOptions={serviceAreaTypeOptions}
              loanProductsList={loanProductsList}
              loanProcessingStages={loanProcessingStages}
              customerSegmentList={customerSegmentList}
              customerProfileList={customerProfileList}
              eligibilityEmploymentTypes={eligibilityEmploymentTypes}
              yesNoOptions={yesNoOptions}
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
            <div className="text-xl mb-0.5 relative z-10">🏦</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">NBFC Employee Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">Register as an NBFC employee or agent</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1.5 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[40px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[6.5px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRefDt} className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContentNbfcEmp
              step={step}
              inp={inDt}
              inErr={inErr}
              errors={errors}
              hasError={hasError}
              handleBlur={handleBlur}
              formData={formData}
              updateForm={updateForm}
              toggleArrayItem={toggleArrayItem}
              profilePhotoPreview={profilePhotoPreview}
              handleProfilePhotoUpload={handleProfilePhotoUpload}
              removeProfilePhoto={removeProfilePhoto}
              handleDocumentUpload={handleDocumentUpload}
              genderOptions={genderOptions}
              departmentOptions={departmentOptions}
              employmentTypeOptions={employmentTypeOptions}
              serviceAreaTypeOptions={serviceAreaTypeOptions}
              loanProductsList={loanProductsList}
              loanProcessingStages={loanProcessingStages}
              customerSegmentList={customerSegmentList}
              customerProfileList={customerProfileList}
              eligibilityEmploymentTypes={eligibilityEmploymentTypes}
              yesNoOptions={yesNoOptions}
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

// ─────────────────────────────────────────────
// MOBILE CONTENT — NBFC Employee
// ─────────────────────────────────────────────

function MobContentNbfcEmp({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  profilePhotoPreview, handleProfilePhotoUpload, removeProfilePhoto,
  handleDocumentUpload, genderOptions, departmentOptions,
  employmentTypeOptions, serviceAreaTypeOptions, loanProductsList,
  loanProcessingStages, customerSegmentList, customerProfileList,
  eligibilityEmploymentTypes, yesNoOptions,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
}) {
  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  if (step === 0) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Employee Details</h3>
      </div>
      <Field label="Full Name" required error={errors.fullName}>
        <input className={inputCls("fullName")} placeholder="Enter full name" value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} onBlur={() => handleBlur("fullName")} {...errAttr("fullName")} />
      </Field>
      <Field label="Employee ID" required error={errors.employeeId}>
        <input className={inputCls("employeeId")} placeholder="Enter employee ID" value={formData.employeeId} onChange={(e) => updateForm("employeeId", e.target.value)} onBlur={() => handleBlur("employeeId")} {...errAttr("employeeId")} />
      </Field>
      <Field label="Gender">
        <div className="flex gap-4">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-nbfc-gender" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Date of Birth" error={errors.dob}>
        <input className={inputCls("dob")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.dob} onChange={(e) => updateForm("dob", e.target.value)} onBlur={() => handleBlur("dob")} {...errAttr("dob")} />
      </Field>
      <Field label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inputCls("mobileNumber")} type="tel" inputMode="numeric" maxLength={10} value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("mobileNumber")} {...errAttr("mobileNumber")} />
      </Field>
      <Field label="Official Email" required error={errors.emailId}>
        <input className={inputCls("emailId")} type="email" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} onBlur={() => handleBlur("emailId")} {...errAttr("emailId")} />
      </Field>
      <Field label="Alternate Mobile" error={errors.alternateMobile}>
        <input className={inputCls("alternateMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.alternateMobile} onChange={(e) => updateForm("alternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("alternateMobile")} {...errAttr("alternateMobile")} />
      </Field>
      <Field label="Designation" required error={errors.designation}>
        <input className={inputCls("designation")} value={formData.designation} onChange={(e) => updateForm("designation", e.target.value)} onBlur={() => handleBlur("designation")} {...errAttr("designation")} />
      </Field>
      <Field label="Department" required error={errors.department}>
        <select className={inputCls("department")} value={formData.department} onChange={(e) => updateForm("department", e.target.value)} onBlur={() => handleBlur("department")} {...errAttr("department")}>
          <option value="">Select Department</option>
          {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Profile Photo" hint="Max 2MB" error={errors.profilePhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("profilePhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("profilePhoto")}>
          <input type="file" accept="image/*" className="hidden" id="m-nbfc-photo" onChange={handleProfilePhotoUpload} />
          <label htmlFor="m-nbfc-photo" className="cursor-pointer flex flex-col items-center">
            <span className="mb-1 text-lg">📷</span>
            <span className="text-[11px] font-semibold text-[#00695C]">Upload Profile Photo</span>
            <span className="text-[10px] text-gray-400">JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {profilePhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={profilePhotoPreview} alt="Profile" className="w-20 h-20 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeProfilePhoto} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Login & Security</h3>
      </div>
      <Field label="Username / Email" required error={errors.username}>
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
      <label className="flex items-center gap-2 text-[11px] cursor-pointer mb-1">
        <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Two-Factor Authentication
      </label>
      <label className="flex items-center gap-2 text-[11px] cursor-pointer mb-1">
        <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.mobileOTP} onChange={() => updateForm("mobileOTP", !formData.mobileOTP)} />
        Mobile OTP Verification
      </label>
      <label className="flex items-center gap-2 text-[11px] cursor-pointer mb-1">
        <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.emailVerify} onChange={() => updateForm("emailVerify", !formData.emailVerify)} />
        Email Verification
      </label>
      <div {...errAttr("accepted")}>
        <label className={`flex items-center gap-2 text-[11px] cursor-pointer ${hasError("accepted") ? "text-red-500" : ""}`}>
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.accepted} onChange={() => updateForm("accepted", !formData.accepted)} />
          I accept the Terms & Conditions <span className="text-red-500">*</span>
        </label>
        {errors.accepted && <p className="text-[10px] text-red-500 mt-0.5 ml-5 font-medium" data-field-error="true">{errors.accepted}</p>}
      </div>
    </>
  );

  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">NBFC Company Details</h3>
      </div>
      <Field label="NBFC Company Name" required error={errors.companyName}>
        <input className={inputCls("companyName")} value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} onBlur={() => handleBlur("companyName")} {...errAttr("companyName")} />
      </Field>
      <Field label="NBFC Registration / License No." required error={errors.registrationNumber}>
        <input className={inputCls("registrationNumber")} value={formData.registrationNumber} onChange={(e) => updateForm("registrationNumber", e.target.value)} onBlur={() => handleBlur("registrationNumber")} {...errAttr("registrationNumber")} />
      </Field>
      <Field label="Branch / Processing Office Name" required error={errors.branchName}>
        <input className={inputCls("branchName")} value={formData.branchName} onChange={(e) => updateForm("branchName", e.target.value)} onBlur={() => handleBlur("branchName")} {...errAttr("branchName")} />
      </Field>
      <Field label="Branch / Office Code" required error={errors.branchCode}>
        <input className={inputCls("branchCode")} value={formData.branchCode} onChange={(e) => updateForm("branchCode", e.target.value)} onBlur={() => handleBlur("branchCode")} {...errAttr("branchCode")} />
      </Field>
      <Field label="NBFC Office Address" required error={errors.officeAddress}>
        <input className={inputCls("officeAddress")} value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} onBlur={() => handleBlur("officeAddress")} {...errAttr("officeAddress")} />
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
      <Field label="Office Phone" error={errors.officePhone}>
        <input className={inputCls("officePhone")} type="tel" inputMode="numeric" maxLength={11} value={formData.officePhone} onChange={(e) => updateForm("officePhone", e.target.value.replace(/\D/g, "").slice(0, 11))} onBlur={() => handleBlur("officePhone")} {...errAttr("officePhone")} />
      </Field>
      <Field label="Official Company Email" required error={errors.companyEmail}>
        <input className={inputCls("companyEmail")} type="email" value={formData.companyEmail} onChange={(e) => updateForm("companyEmail", e.target.value)} onBlur={() => handleBlur("companyEmail")} {...errAttr("companyEmail")} />
      </Field>
      <Field label="Company Website" error={errors.website}>
        <input className={inputCls("website")} placeholder="https://" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} onBlur={() => handleBlur("website")} {...errAttr("website")} />
      </Field>
      <Field label="Regional Office">
        <input className={inp} value={formData.regionalOffice} onChange={(e) => updateForm("regionalOffice", e.target.value)} />
      </Field>
      <Field label="Area / Regional Manager Name" error={errors.areaManagerName}>
        <input className={inputCls("areaManagerName")} value={formData.areaManagerName} onChange={(e) => updateForm("areaManagerName", e.target.value)} onBlur={() => handleBlur("areaManagerName")} {...errAttr("areaManagerName")} />
      </Field>
    </>
  );

  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Employee Information</h3>
      </div>
      <Field label="Employee ID Card Upload" required hint="PDF only (Max 2MB)" error={errors.idCardDoc}>
        <div className={`border-2 border-dashed rounded-xl p-2.5 text-center hover:bg-green-50 ${hasError("idCardDoc") ? "border-red-400" : "border-teal-300"}`} {...errAttr("idCardDoc")}>
          <input type="file" accept=".pdf" className="hidden" id="m-nbfc-idcard" onChange={(e) => handleDocumentUpload("idCardDoc", e)} />
          <label htmlFor="m-nbfc-idcard" className="cursor-pointer flex flex-col items-center">
            <span className="text-lg mb-0.5">📄</span>
            <span className="text-[10px] font-semibold text-[#00695C]">Upload ID Card</span>
          </label>
        </div>
        {formData.idCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.idCardDoc.name}</p>}
      </Field>
      <Field label="Joining Date" required error={errors.joiningDate}>
        <input className={inputCls("joiningDate")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.joiningDate} onChange={(e) => updateForm("joiningDate", e.target.value)} onBlur={() => handleBlur("joiningDate")} {...errAttr("joiningDate")} />
      </Field>
      <Field label="Years of Experience" error={errors.yearsExperience}>
        <input className={inputCls("yearsExperience")} type="number" min="0" max="60" value={formData.yearsExperience} onChange={(e) => updateForm("yearsExperience", e.target.value)} onBlur={() => handleBlur("yearsExperience")} {...errAttr("yearsExperience")} />
      </Field>
      <Field label="Employment Type" required error={errors.employmentType}>
        <div className="flex gap-3 flex-wrap" {...errAttr("employmentType")}>
          {employmentTypeOptions.map(t => (
            <label key={t} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="radio" name="mob-nbfc-emptype" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.employmentType === t} onChange={() => updateForm("employmentType", t)} />
              {t}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Reporting Manager Name" error={errors.managerName}>
        <input className={inputCls("managerName")} value={formData.managerName} onChange={(e) => updateForm("managerName", e.target.value)} onBlur={() => handleBlur("managerName")} {...errAttr("managerName")} />
      </Field>
      <Field label="Reporting Manager Employee ID" error={errors.managerId}>
        <input className={inputCls("managerId")} value={formData.managerId} onChange={(e) => updateForm("managerId", e.target.value)} onBlur={() => handleBlur("managerId")} {...errAttr("managerId")} />
      </Field>
      <Field label="Reporting Manager Email" error={errors.managerEmail}>
        <input className={inputCls("managerEmail")} type="email" value={formData.managerEmail} onChange={(e) => updateForm("managerEmail", e.target.value)} onBlur={() => handleBlur("managerEmail")} {...errAttr("managerEmail")} />
      </Field>
      <Field label="Employee Department">
        <input className={inp} value={formData.employeeDepartment} onChange={(e) => updateForm("employeeDepartment", e.target.value)} />
      </Field>
      <Field label="Employee Designation">
        <input className={inp} value={formData.employeeDesignation} onChange={(e) => updateForm("employeeDesignation", e.target.value)} />
      </Field>
      <Field label="Employee Status">
        <input className={inp} value={formData.employeeStatus} onChange={(e) => updateForm("employeeStatus", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Verification Documents</h3>
      </div>
      <Field label="Company Authorization Letter" hint="PDF (Max 2MB)" error={errors.companyAuthLetter}>
        <input type="file" accept=".pdf" className={`${inputCls("companyAuthLetter")} p-1.5`} onChange={(e) => handleDocumentUpload("companyAuthLetter", e)} />
        {formData.companyAuthLetter && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyAuthLetter.name}</p>}
      </Field>
      <Field label="Address Proof" hint="PDF (Max 2MB)" error={errors.addressProofDoc}>
        <input type="file" accept=".pdf" className={`${inputCls("addressProofDoc")} p-1.5`} onChange={(e) => handleDocumentUpload("addressProofDoc", e)} />
        {formData.addressProofDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.addressProofDoc.name}</p>}
      </Field>
      <Field label="Official Email Verification">
        <label className="flex items-center gap-2 text-[11px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.officialEmailVerified} onChange={() => updateForm("officialEmailVerified", !formData.officialEmailVerified)} />
          Confirm official email verified
        </label>
      </Field>
      <Field label="Other Supporting Documents" hint="Optional, PDF (Max 2MB)" error={errors.otherSupportDocs}>
        <input type="file" accept=".pdf" className={`${inputCls("otherSupportDocs")} p-1.5`} onChange={(e) => handleDocumentUpload("otherSupportDocs", e)} />
        {formData.otherSupportDocs && <p className="text-[10px] text-green-600 mt-1">✓ {formData.otherSupportDocs.name}</p>}
      </Field>
    </>
  );

  if (step === 3) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Loan Products Handled</h3>
      </div>
      <p className="text-[10px] text-gray-400 mb-2">Select all loan products you can offer</p>
      <div className="grid grid-cols-2 gap-1" {...errAttr("loanProducts")}>
        {loanProductsList.map(p => (
          <label key={p} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.loanProducts.includes(p)} onChange={() => toggleArrayItem("loanProducts", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.loanProducts && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.loanProducts}</p>}
    </>
  );

  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Loan Processing Capability</h3>
      </div>
      <p className="text-[10px] text-gray-400 mb-2">Select the stages you are authorized to handle</p>
      <div className="grid grid-cols-2 gap-1" {...errAttr("processingStages")}>
        {loanProcessingStages.map(s => (
          <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.processingStages.includes(s)} onChange={() => toggleArrayItem("processingStages", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.processingStages && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.processingStages}</p>}
    </>
  );

  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Service Area</h3>
      </div>
      <Field label="Loan Processing Location" required error={errors.loanLocation}>
        <input className={inputCls("loanLocation")} value={formData.loanLocation} onChange={(e) => updateForm("loanLocation", e.target.value)} onBlur={() => handleBlur("loanLocation")} {...errAttr("loanLocation")} />
      </Field>
      <Field label="Branch / Office Location">
        <input className={inp} value={formData.branchLocation} onChange={(e) => updateForm("branchLocation", e.target.value)} />
      </Field>
      <Field label="City / District" required error={errors.serviceCity}>
        <input className={inputCls("serviceCity")} value={formData.serviceCity} onChange={(e) => updateForm("serviceCity", e.target.value)} onBlur={() => handleBlur("serviceCity")} {...errAttr("serviceCity")} />
      </Field>
      <Field label="State" required error={errors.serviceState}>
        <input className={inputCls("serviceState")} value={formData.serviceState} onChange={(e) => updateForm("serviceState", e.target.value)} onBlur={() => handleBlur("serviceState")} {...errAttr("serviceState")} />
      </Field>
      <Field label="Serviceable PIN Codes" error={errors.servicePincodes}>
        <input className={inputCls("servicePincodes")} placeholder="Comma separated" value={formData.servicePincodes} onChange={(e) => updateForm("servicePincodes", e.target.value)} onBlur={() => handleBlur("servicePincodes")} {...errAttr("servicePincodes")} />
      </Field>
      <Field label="Serviceable Cities">
        <input className={inp} value={formData.serviceCities} onChange={(e) => updateForm("serviceCities", e.target.value)} />
      </Field>
      <Field label="Serviceable Districts">
        <input className={inp} value={formData.serviceDistricts} onChange={(e) => updateForm("serviceDistricts", e.target.value)} />
      </Field>
      <Field label="Serviceable States">
        <input className={inp} value={formData.serviceStates} onChange={(e) => updateForm("serviceStates", e.target.value)} />
      </Field>
      <Field label="Service Area Type" required error={errors.serviceAreaType}>
        <div className="grid grid-cols-2 gap-1" {...errAttr("serviceAreaType")}>
          {serviceAreaTypeOptions.map(s => (
            <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="radio" name="mob-nbfc-servicearea" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.serviceAreaType === s} onChange={() => updateForm("serviceAreaType", s)} />
              {s}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  if (step === 6) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Preferred Customer Segment</h3>
      </div>
      <div className="grid grid-cols-2 gap-1" {...errAttr("customerSegments")}>
        {customerSegmentList.map(s => (
          <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.customerSegments.includes(s)} onChange={() => toggleArrayItem("customerSegments", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.customerSegments && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.customerSegments}</p>}
    </>
  );

  if (step === 7) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Customer Profile Handled</h3>
      </div>
      <div className="grid grid-cols-2 gap-1" {...errAttr("customerProfiles")}>
        {customerProfileList.map(s => (
          <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.customerProfiles.includes(s)} onChange={() => toggleArrayItem("customerProfiles", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.customerProfiles && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.customerProfiles}</p>}
    </>
  );

  if (step === 8) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Loan Eligibility / Customer Criteria</h3>
      </div>
      <p className="text-[10px] text-gray-400 mb-2">Helps your CRM route suitable leads</p>

      <Field label="Employment Type">
        <div className="grid grid-cols-2 gap-1">
          {eligibilityEmploymentTypes.map(s => (
            <label key={s} className="flex items-center gap-1 text-[10px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.eligibilityEmploymentTypes.includes(s)} onChange={() => toggleArrayItem("eligibilityEmploymentTypes", s)} />
              {s}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Monthly Income Range" error={errors.monthlyIncomeRange}>
        <input className={inputCls("monthlyIncomeRange")} value={formData.monthlyIncomeRange} onChange={(e) => updateForm("monthlyIncomeRange", e.target.value)} onBlur={() => handleBlur("monthlyIncomeRange")} placeholder="e.g. ₹25,000 – ₹75,000" {...errAttr("monthlyIncomeRange")} />
      </Field>
      <Field label="Annual Income Range" error={errors.annualIncomeRange}>
        <input className={inputCls("annualIncomeRange")} value={formData.annualIncomeRange} onChange={(e) => updateForm("annualIncomeRange", e.target.value)} onBlur={() => handleBlur("annualIncomeRange")} {...errAttr("annualIncomeRange")} />
      </Field>
      <Field label="Business Turnover Range" error={errors.businessTurnoverRange}>
        <input className={inputCls("businessTurnoverRange")} value={formData.businessTurnoverRange} onChange={(e) => updateForm("businessTurnoverRange", e.target.value)} onBlur={() => handleBlur("businessTurnoverRange")} {...errAttr("businessTurnoverRange")} />
      </Field>
      <Field label="Preferred CIBIL / Credit Score Range" error={errors.cibilRange}>
        <input className={inputCls("cibilRange")} value={formData.cibilRange} onChange={(e) => updateForm("cibilRange", e.target.value)} onBlur={() => handleBlur("cibilRange")} placeholder="e.g. 700 – 850" {...errAttr("cibilRange")} />
      </Field>
      <Field label="Existing Loan Status">
        <input className={inp} value={formData.existingLoanStatus} onChange={(e) => updateForm("existingLoanStatus", e.target.value)} />
      </Field>
      <Field label="Existing EMI Range" error={errors.existingEmiRange}>
        <input className={inputCls("existingEmiRange")} value={formData.existingEmiRange} onChange={(e) => updateForm("existingEmiRange", e.target.value)} onBlur={() => handleBlur("existingEmiRange")} {...errAttr("existingEmiRange")} />
      </Field>
      <Field label="FOIR Range" error={errors.foirRange}>
        <input className={inputCls("foirRange")} value={formData.foirRange} onChange={(e) => updateForm("foirRange", e.target.value)} onBlur={() => handleBlur("foirRange")} {...errAttr("foirRange")} />
      </Field>
      <Field label="LTV Range" error={errors.ltvRange}>
        <input className={inputCls("ltvRange")} value={formData.ltvRange} onChange={(e) => updateForm("ltvRange", e.target.value)} onBlur={() => handleBlur("ltvRange")} {...errAttr("ltvRange")} />
      </Field>
    </>
  );

  return null;
}

// ─────────────────────────────────────────────
// DESKTOP CONTENT — NBFC Employee
// ─────────────────────────────────────────────

function DtContentNbfcEmp({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  profilePhotoPreview, handleProfilePhotoUpload, removeProfilePhoto,
  handleDocumentUpload, genderOptions, departmentOptions,
  employmentTypeOptions, serviceAreaTypeOptions, loanProductsList,
  loanProcessingStages, customerSegmentList, customerProfileList,
  eligibilityEmploymentTypes, yesNoOptions,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
}) {
  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Employee Details</h3>
      </div>
      <FieldDt label="Full Name" required error={errors.fullName}>
        <input className={inputCls("fullName")} value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} onBlur={() => handleBlur("fullName")} {...errAttr("fullName")} />
      </FieldDt>
      <FieldDt label="Employee ID" required error={errors.employeeId}>
        <input className={inputCls("employeeId")} value={formData.employeeId} onChange={(e) => updateForm("employeeId", e.target.value)} onBlur={() => handleBlur("employeeId")} {...errAttr("employeeId")} />
      </FieldDt>
      <FieldDt label="Gender">
        <div className="flex gap-5">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-nbfc-gender" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Date of Birth" error={errors.dob}>
        <input className={inputCls("dob")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.dob} onChange={(e) => updateForm("dob", e.target.value)} onBlur={() => handleBlur("dob")} {...errAttr("dob")} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inputCls("mobileNumber")} type="tel" inputMode="numeric" maxLength={10} value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("mobileNumber")} {...errAttr("mobileNumber")} />
      </FieldDt>
      <FieldDt label="Official Email" required error={errors.emailId}>
        <input className={inputCls("emailId")} type="email" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} onBlur={() => handleBlur("emailId")} {...errAttr("emailId")} />
      </FieldDt>
      <FieldDt label="Alternate Mobile" error={errors.alternateMobile}>
        <input className={inputCls("alternateMobile")} type="tel" inputMode="numeric" maxLength={10} value={formData.alternateMobile} onChange={(e) => updateForm("alternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("alternateMobile")} {...errAttr("alternateMobile")} />
      </FieldDt>
      <FieldDt label="Designation" required error={errors.designation}>
        <input className={inputCls("designation")} value={formData.designation} onChange={(e) => updateForm("designation", e.target.value)} onBlur={() => handleBlur("designation")} {...errAttr("designation")} />
      </FieldDt>
      <FieldDt label="Department" required error={errors.department}>
        <select className={inputCls("department")} value={formData.department} onChange={(e) => updateForm("department", e.target.value)} onBlur={() => handleBlur("department")} {...errAttr("department")}>
          <option value="">Select Department</option>
          {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB" error={errors.profilePhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("profilePhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("profilePhoto")}>
          <input type="file" accept="image/*" className="hidden" id="dt-nbfc-photo" onChange={handleProfilePhotoUpload} />
          <label htmlFor="dt-nbfc-photo" className="cursor-pointer flex flex-col items-center">
            <span className="mb-1 text-xl">📷</span>
            <span className="text-[12px] font-semibold text-[#00695C]">Upload Profile Photo</span>
            <span className="text-[11px] text-gray-400">JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {profilePhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={profilePhotoPreview} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-[#00695C]" />
            <button onClick={removeProfilePhoto} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Login & Security</h3>
      </div>
      <FieldDt label="Username / Email" required error={errors.username}>
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
      <label className="flex items-center gap-2 text-[13px] cursor-pointer mb-2">
        <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.mobileOTP} onChange={() => updateForm("mobileOTP", !formData.mobileOTP)} />
        Mobile OTP Verification
      </label>
      <label className="flex items-center gap-2 text-[13px] cursor-pointer mb-2">
        <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.emailVerify} onChange={() => updateForm("emailVerify", !formData.emailVerify)} />
        Email Verification
      </label>
      <div {...errAttr("accepted")}>
        <label className={`flex items-center gap-2 text-[13px] cursor-pointer ${hasError("accepted") ? "text-red-500" : ""}`}>
          <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.accepted} onChange={() => updateForm("accepted", !formData.accepted)} />
          I accept the Terms & Conditions <span className="text-red-500">*</span>
        </label>
        {errors.accepted && <p className="text-[10px] text-red-500 mt-0.5 ml-6 font-medium" data-field-error="true">{errors.accepted}</p>}
      </div>
    </>
  );

  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">NBFC Company Details</h3>
      </div>
      <FieldDt label="NBFC Company Name" required error={errors.companyName}>
        <input className={inputCls("companyName")} value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} onBlur={() => handleBlur("companyName")} {...errAttr("companyName")} />
      </FieldDt>
      <FieldDt label="NBFC Registration / License No." required error={errors.registrationNumber}>
        <input className={inputCls("registrationNumber")} value={formData.registrationNumber} onChange={(e) => updateForm("registrationNumber", e.target.value)} onBlur={() => handleBlur("registrationNumber")} {...errAttr("registrationNumber")} />
      </FieldDt>
      <FieldDt label="Branch / Processing Office Name" required error={errors.branchName}>
        <input className={inputCls("branchName")} value={formData.branchName} onChange={(e) => updateForm("branchName", e.target.value)} onBlur={() => handleBlur("branchName")} {...errAttr("branchName")} />
      </FieldDt>
      <FieldDt label="Branch / Office Code" required error={errors.branchCode}>
        <input className={inputCls("branchCode")} value={formData.branchCode} onChange={(e) => updateForm("branchCode", e.target.value)} onBlur={() => handleBlur("branchCode")} {...errAttr("branchCode")} />
      </FieldDt>
      <FieldDt label="NBFC Office Address" required error={errors.officeAddress}>
        <input className={inputCls("officeAddress")} value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} onBlur={() => handleBlur("officeAddress")} {...errAttr("officeAddress")} />
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
      <FieldDt label="Office Phone" error={errors.officePhone}>
        <input className={inputCls("officePhone")} type="tel" inputMode="numeric" maxLength={11} value={formData.officePhone} onChange={(e) => updateForm("officePhone", e.target.value.replace(/\D/g, "").slice(0, 11))} onBlur={() => handleBlur("officePhone")} {...errAttr("officePhone")} />
      </FieldDt>
      <FieldDt label="Official Company Email" required error={errors.companyEmail}>
        <input className={inputCls("companyEmail")} type="email" value={formData.companyEmail} onChange={(e) => updateForm("companyEmail", e.target.value)} onBlur={() => handleBlur("companyEmail")} {...errAttr("companyEmail")} />
      </FieldDt>
      <FieldDt label="Company Website" error={errors.website}>
        <input className={inputCls("website")} placeholder="https://" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} onBlur={() => handleBlur("website")} {...errAttr("website")} />
      </FieldDt>
      <FieldDt label="Regional Office">
        <input className={inp} value={formData.regionalOffice} onChange={(e) => updateForm("regionalOffice", e.target.value)} />
      </FieldDt>
      <FieldDt label="Area / Regional Manager Name" error={errors.areaManagerName}>
        <input className={inputCls("areaManagerName")} value={formData.areaManagerName} onChange={(e) => updateForm("areaManagerName", e.target.value)} onBlur={() => handleBlur("areaManagerName")} {...errAttr("areaManagerName")} />
      </FieldDt>
    </>
  );

  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Employee Information</h3>
      </div>
      <FieldDt label="Employee ID Card Upload" required hint="PDF only (Max 2MB)" error={errors.idCardDoc}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("idCardDoc") ? "border-red-400" : "border-teal-300"}`} {...errAttr("idCardDoc")}>
          <input type="file" accept=".pdf" className="hidden" id="dt-nbfc-idcard" onChange={(e) => handleDocumentUpload("idCardDoc", e)} />
          <label htmlFor="dt-nbfc-idcard" className="cursor-pointer flex flex-col items-center">
            <span className="text-2xl mb-1">📄</span>
            <span className="text-[12px] font-semibold text-[#00695C]">Upload ID Card</span>
          </label>
        </div>
        {formData.idCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.idCardDoc.name}</p>}
      </FieldDt>
      <FieldDt label="Joining Date" required error={errors.joiningDate}>
        <input className={inputCls("joiningDate")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.joiningDate} onChange={(e) => updateForm("joiningDate", e.target.value)} onBlur={() => handleBlur("joiningDate")} {...errAttr("joiningDate")} />
      </FieldDt>
      <FieldDt label="Years of Experience" error={errors.yearsExperience}>
        <input className={inputCls("yearsExperience")} type="number" min="0" max="60" value={formData.yearsExperience} onChange={(e) => updateForm("yearsExperience", e.target.value)} onBlur={() => handleBlur("yearsExperience")} {...errAttr("yearsExperience")} />
      </FieldDt>
      <FieldDt label="Employment Type" required error={errors.employmentType}>
        <div className="flex gap-4 flex-wrap" {...errAttr("employmentType")}>
          {employmentTypeOptions.map(t => (
            <label key={t} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-nbfc-emptype" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.employmentType === t} onChange={() => updateForm("employmentType", t)} />
              {t}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Reporting Manager Name" error={errors.managerName}>
        <input className={inputCls("managerName")} value={formData.managerName} onChange={(e) => updateForm("managerName", e.target.value)} onBlur={() => handleBlur("managerName")} {...errAttr("managerName")} />
      </FieldDt>
      <FieldDt label="Reporting Manager Employee ID" error={errors.managerId}>
        <input className={inputCls("managerId")} value={formData.managerId} onChange={(e) => updateForm("managerId", e.target.value)} onBlur={() => handleBlur("managerId")} {...errAttr("managerId")} />
      </FieldDt>
      <FieldDt label="Reporting Manager Email" error={errors.managerEmail}>
        <input className={inputCls("managerEmail")} type="email" value={formData.managerEmail} onChange={(e) => updateForm("managerEmail", e.target.value)} onBlur={() => handleBlur("managerEmail")} {...errAttr("managerEmail")} />
      </FieldDt>
      <FieldDt label="Employee Department">
        <input className={inp} value={formData.employeeDepartment} onChange={(e) => updateForm("employeeDepartment", e.target.value)} />
      </FieldDt>
      <FieldDt label="Employee Designation">
        <input className={inp} value={formData.employeeDesignation} onChange={(e) => updateForm("employeeDesignation", e.target.value)} />
      </FieldDt>
      <FieldDt label="Employee Status">
        <input className={inp} value={formData.employeeStatus} onChange={(e) => updateForm("employeeStatus", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Verification Documents</h3>
      </div>
      <FieldDt label="Company Authorization Letter" hint="PDF (Max 2MB)" error={errors.companyAuthLetter}>
        <input type="file" accept=".pdf" className={`${inputCls("companyAuthLetter")} p-1.5`} onChange={(e) => handleDocumentUpload("companyAuthLetter", e)} />
        {formData.companyAuthLetter && <p className="text-[13px] text-green-600 mt-1">✓ {formData.companyAuthLetter.name}</p>}
      </FieldDt>
      <FieldDt label="Address Proof" hint="PDF (Max 2MB)" error={errors.addressProofDoc}>
        <input type="file" accept=".pdf" className={`${inputCls("addressProofDoc")} p-1.5`} onChange={(e) => handleDocumentUpload("addressProofDoc", e)} />
        {formData.addressProofDoc && <p className="text-[13px] text-green-600 mt-1">✓ {formData.addressProofDoc.name}</p>}
      </FieldDt>
      <FieldDt label="Official Email Verification">
        <label className="flex items-center gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.officialEmailVerified} onChange={() => updateForm("officialEmailVerified", !formData.officialEmailVerified)} />
          Confirm official email verified
        </label>
      </FieldDt>
      <FieldDt label="Other Supporting Documents" hint="Optional, PDF (Max 2MB)" error={errors.otherSupportDocs}>
        <input type="file" accept=".pdf" className={`${inputCls("otherSupportDocs")} p-1.5`} onChange={(e) => handleDocumentUpload("otherSupportDocs", e)} />
        {formData.otherSupportDocs && <p className="text-[13px] text-green-600 mt-1">✓ {formData.otherSupportDocs.name}</p>}
      </FieldDt>
    </>
  );

  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Loan Products Handled</h3>
      </div>
      <p className="text-[12px] text-gray-400 mb-3">Select all loan products you can offer</p>
      <div className="grid grid-cols-2 gap-2" {...errAttr("loanProducts")}>
        {loanProductsList.map(p => (
          <label key={p} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.loanProducts.includes(p)} onChange={() => toggleArrayItem("loanProducts", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.loanProducts && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.loanProducts}</p>}
    </>
  );

  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Loan Processing Capability</h3>
      </div>
      <p className="text-[12px] text-gray-400 mb-3">Select the stages you are authorized to handle</p>
      <div className="grid grid-cols-2 gap-2" {...errAttr("processingStages")}>
        {loanProcessingStages.map(s => (
          <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.processingStages.includes(s)} onChange={() => toggleArrayItem("processingStages", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.processingStages && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.processingStages}</p>}
    </>
  );

  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Service Area</h3>
      </div>
      <FieldDt label="Loan Processing Location" required error={errors.loanLocation}>
        <input className={inputCls("loanLocation")} value={formData.loanLocation} onChange={(e) => updateForm("loanLocation", e.target.value)} onBlur={() => handleBlur("loanLocation")} {...errAttr("loanLocation")} />
      </FieldDt>
      <FieldDt label="Branch / Office Location">
        <input className={inp} value={formData.branchLocation} onChange={(e) => updateForm("branchLocation", e.target.value)} />
      </FieldDt>
      <FieldDt label="City / District" required error={errors.serviceCity}>
        <input className={inputCls("serviceCity")} value={formData.serviceCity} onChange={(e) => updateForm("serviceCity", e.target.value)} onBlur={() => handleBlur("serviceCity")} {...errAttr("serviceCity")} />
      </FieldDt>
      <FieldDt label="State" required error={errors.serviceState}>
        <input className={inputCls("serviceState")} value={formData.serviceState} onChange={(e) => updateForm("serviceState", e.target.value)} onBlur={() => handleBlur("serviceState")} {...errAttr("serviceState")} />
      </FieldDt>
      <FieldDt label="Serviceable PIN Codes" error={errors.servicePincodes}>
        <input className={inputCls("servicePincodes")} placeholder="Comma separated" value={formData.servicePincodes} onChange={(e) => updateForm("servicePincodes", e.target.value)} onBlur={() => handleBlur("servicePincodes")} {...errAttr("servicePincodes")} />
      </FieldDt>
      <FieldDt label="Serviceable Cities">
        <input className={inp} value={formData.serviceCities} onChange={(e) => updateForm("serviceCities", e.target.value)} />
      </FieldDt>
      <FieldDt label="Serviceable Districts">
        <input className={inp} value={formData.serviceDistricts} onChange={(e) => updateForm("serviceDistricts", e.target.value)} />
      </FieldDt>
      <FieldDt label="Serviceable States">
        <input className={inp} value={formData.serviceStates} onChange={(e) => updateForm("serviceStates", e.target.value)} />
      </FieldDt>
      <FieldDt label="Service Area Type" required error={errors.serviceAreaType}>
        <div className="grid grid-cols-2 gap-2" {...errAttr("serviceAreaType")}>
          {serviceAreaTypeOptions.map(s => (
            <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-nbfc-servicearea" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.serviceAreaType === s} onChange={() => updateForm("serviceAreaType", s)} />
              {s}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Preferred Customer Segment</h3>
      </div>
      <div className="grid grid-cols-2 gap-2" {...errAttr("customerSegments")}>
        {customerSegmentList.map(s => (
          <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.customerSegments.includes(s)} onChange={() => toggleArrayItem("customerSegments", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.customerSegments && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.customerSegments}</p>}
    </>
  );

  if (step === 7) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Customer Profile Handled</h3>
      </div>
      <div className="grid grid-cols-2 gap-2" {...errAttr("customerProfiles")}>
        {customerProfileList.map(s => (
          <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.customerProfiles.includes(s)} onChange={() => toggleArrayItem("customerProfiles", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.customerProfiles && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.customerProfiles}</p>}
    </>
  );

  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Loan Eligibility / Customer Criteria</h3>
      </div>
      <p className="text-[12px] text-gray-400 mb-3">Helps your CRM route suitable leads</p>

      <FieldDt label="Employment Type">
        <div className="grid grid-cols-2 gap-2">
          {eligibilityEmploymentTypes.map(s => (
            <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.eligibilityEmploymentTypes.includes(s)} onChange={() => toggleArrayItem("eligibilityEmploymentTypes", s)} />
              {s}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Monthly Income Range" error={errors.monthlyIncomeRange}>
        <input className={inputCls("monthlyIncomeRange")} value={formData.monthlyIncomeRange} onChange={(e) => updateForm("monthlyIncomeRange", e.target.value)} onBlur={() => handleBlur("monthlyIncomeRange")} placeholder="e.g. ₹25,000 – ₹75,000" {...errAttr("monthlyIncomeRange")} />
      </FieldDt>
      <FieldDt label="Annual Income Range" error={errors.annualIncomeRange}>
        <input className={inputCls("annualIncomeRange")} value={formData.annualIncomeRange} onChange={(e) => updateForm("annualIncomeRange", e.target.value)} onBlur={() => handleBlur("annualIncomeRange")} {...errAttr("annualIncomeRange")} />
      </FieldDt>
      <FieldDt label="Business Turnover Range" error={errors.businessTurnoverRange}>
        <input className={inputCls("businessTurnoverRange")} value={formData.businessTurnoverRange} onChange={(e) => updateForm("businessTurnoverRange", e.target.value)} onBlur={() => handleBlur("businessTurnoverRange")} {...errAttr("businessTurnoverRange")} />
      </FieldDt>
      <FieldDt label="Preferred CIBIL / Credit Score Range" error={errors.cibilRange}>
        <input className={inputCls("cibilRange")} value={formData.cibilRange} onChange={(e) => updateForm("cibilRange", e.target.value)} onBlur={() => handleBlur("cibilRange")} placeholder="e.g. 700 – 850" {...errAttr("cibilRange")} />
      </FieldDt>
      <FieldDt label="Existing Loan Status">
        <input className={inp} value={formData.existingLoanStatus} onChange={(e) => updateForm("existingLoanStatus", e.target.value)} />
      </FieldDt>
      <FieldDt label="Existing EMI Range" error={errors.existingEmiRange}>
        <input className={inputCls("existingEmiRange")} value={formData.existingEmiRange} onChange={(e) => updateForm("existingEmiRange", e.target.value)} onBlur={() => handleBlur("existingEmiRange")} {...errAttr("existingEmiRange")} />
      </FieldDt>
      <FieldDt label="FOIR Range" error={errors.foirRange}>
        <input className={inputCls("foirRange")} value={formData.foirRange} onChange={(e) => updateForm("foirRange", e.target.value)} onBlur={() => handleBlur("foirRange")} {...errAttr("foirRange")} />
      </FieldDt>
      <FieldDt label="LTV Range" error={errors.ltvRange}>
        <input className={inputCls("ltvRange")} value={formData.ltvRange} onChange={(e) => updateForm("ltvRange", e.target.value)} onBlur={() => handleBlur("ltvRange")} {...errAttr("ltvRange")} />
      </FieldDt>
    </>
  );

  return null;
}