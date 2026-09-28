import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const steps = [
  "Personal Details",
  "Professional Details",
  "Company Details",
  "Products",
  "Services",
  "Service Area",
  "Experience",
  "Documents",
  "Bank Details",
  "Login Details",
  "Declaration",
];

const subtitles = [
  "Your personal information",
  "Your professional background",
  "Your insurance company",
  "Products you offer",
  "Services you provide",
  "Where you operate",
  "Your experience & business",
  "Upload verification documents",
  "Payment information",
  "Secure login credentials",
  "Confirm and submit",
];

const agentTypeOptions = [
  "Individual Insurance Agent",
  "Corporate Agent",
  "Insurance Broker",
  "POSP / Authorized Agent",
  "Agency Representative",
];

const insuranceProductsList = [
  "Home Insurance",
  "Property Insurance",
  "Accidental Insurance",
  "Building Insurance",
  "Contents Insurance",
  "Landlord Insurance",
  "Commercial Property Insurance",
  "Industrial Property Insurance",
  "Burglary Insurance",
  "Property Liability Insurance",
];

const servicesOfferedList = [
  "Insurance Consultation",
  "Insurance Quote",
  "Policy Issuance",
  "Policy Renewal",
  "Policy Modification",
  "Claim Assistance",
  "Property Risk Assessment",
  "Document Assistance",
  "Customer Support",
];

const serviceAreaOptions = [
  "Local",
  "District",
  "State",
  "Multiple States",
  "Pan India",
];

const contactMethodOptions = ["Phone", "Email", "WhatsApp", "In-Person"];
const accountTypeOptions = ["Savings", "Current", "Other"];
const yesNoOptions = ["Yes", "No"];

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
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const pinRegex = /^[1-9][0-9]{5}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
const upiRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;
const nameRegex = /^[a-zA-Z\s.'-]+$/;
const alphanumericRegex = /^[a-zA-Z0-9_-]+$/;

const passwordChecks = (pwd) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*(),.?":{}|<>_\-\\-]/.test(pwd),
});

const isPdfOrImage = (file) =>
  file && (file.type === "application/pdf" || file.type.startsWith("image/"));

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function InsuranceAgentRegistrationForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const contentRef = useRef(null);
  const contentRefDt = useRef(null);

  const [formData, setFormData] = useState({
    // Step 0: Personal
    fullName: "", profilePhoto: null, mobileNumber: "", alternateMobile: "",
    emailId: "", dob: "", gender: "", residentialAddress: "",
    city: "", district: "", state: "", pinCode: "",

    // Step 1: Professional
    agentType: "", agentCode: "", agencyName: "", yearsOfExperience: "",
    previousExperience: "", languagesKnown: "", preferredContactMethod: "",

    // Step 2: Company
    insuranceCompanyName: "", companyCode: "",
    agentLicenseNumber: "", licenseIssueDate: "", licenseExpiryDate: "",
    irdaiDetails: "", agentIdCard: null,

    // Step 3: Products
    insuranceProducts: [],

    // Step 4: Services
    servicesOffered: [],

    // Step 5: Service Area
    stateSA: "", districtSA: "", citySA: "", serviceablePincodes: "",
    serviceRadius: "", serviceArea: [],

    // Step 6: Experience
    totalExperience: "", homeInsuranceExp: "", propertyInsuranceExp: "",
    fireInsuranceExp: "", policiesHandled: "", activeCustomers: "",
    claimsHandled: "", customerSupport: "",

    // Step 7: Documents
    agentIdCardDoc: null, agentLicenseDoc: null, panCard: null,
    aadhaarIdProof: null, addressProof: null,
    agencyAuthorization: null, companyAppointmentLetter: null, otherDocuments: null,

    // Step 8: Bank
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "",
    accountType: "", cancelledCheque: null, upiId: "", gstNumber: "",

    // Step 9: Login
    loginEmail: "", password: "", confirmPassword: "",
    mobileOtpVerify: false, emailVerify: false, twoFA: false,

    // Step 10: Declaration
    confirmAccuracy: false, confirmLicense: false,
    authorizeLeads: false, agreeContact: false, agreeTerms: false,
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

    // Helper: numeric range validation
    const validateNum = (key, label, { min = 0, max = 60, integer = false } = {}) => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) return;
      const n = Number(data[key]);
      if (isNaN(n)) e[key] = `Enter a valid ${label}`;
      else if (n < min) e[key] = `${label} cannot be less than ${min}`;
      else if (n > max) e[key] = `${label} cannot exceed ${max}`;
      else if (integer && !Number.isInteger(n)) e[key] = `${label} must be a whole number`;
    };

    const validateName = (key, label, required = false, minLen = 3) => {
      const val = (data[key] || "").trim();
      if (!val) {
        if (required) e[key] = `${label} is required`;
        return;
      }
      if (val.length < minLen) e[key] = `${label} must be at least ${minLen} characters`;
      else if (!nameRegex.test(val)) e[key] = `${label} contains invalid characters`;
    };

    // ── STEP 0: Personal ──
    if (stepIndex === 0) {
      validateName("fullName", "Full name", true, 3);

      if (!data.mobileNumber.trim()) e.mobileNumber = "Mobile number is required";
      else if (!mobileRegex.test(data.mobileNumber.trim()))
        e.mobileNumber = "Enter a valid 10-digit mobile (starts with 6-9)";

      if (data.alternateMobile && data.alternateMobile.trim()) {
        if (!mobileRegex.test(data.alternateMobile.trim()))
          e.alternateMobile = "Enter a valid 10-digit mobile (starts with 6-9)";
        else if (data.alternateMobile.trim() === data.mobileNumber.trim())
          e.alternateMobile = "Alternate mobile must differ from mobile number";
      }

      if (!data.emailId.trim()) e.emailId = "Email is required";
      else if (!emailRegex.test(data.emailId.trim()))
        e.emailId = "Enter a valid email address";

      if (data.dob) {
        const dob = new Date(data.dob);
        const age = (today - dob) / (365.25 * 24 * 60 * 60 * 1000);
        if (dob > today) e.dob = "Date of birth cannot be in the future";
        else if (age < 18) e.dob = "Agent must be at least 18 years old";
        else if (age > 100) e.dob = "Please enter a valid date of birth";
      }

      if (!data.residentialAddress.trim())
        e.residentialAddress = "Residential address is required";
      else if (data.residentialAddress.trim().length < 5)
        e.residentialAddress = "Address is too short";

      validateName("city", "City", true, 2);
      validateName("district", "District", false, 2);
      validateName("state", "State", true, 2);

      if (!data.pinCode.trim()) e.pinCode = "PIN code is required";
      else if (!pinRegex.test(data.pinCode.trim()))
        e.pinCode = "Enter a valid 6-digit PIN code";

      if (data.profilePhoto) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(data.profilePhoto.type))
          e.profilePhoto = "Only JPG, PNG, or WEBP allowed";
      }
    }

    // ── STEP 1: Professional ──
    if (stepIndex === 1) {
      if (!data.agentType) e.agentType = "Please select an agent type";

      if (!data.agentCode.trim()) e.agentCode = "Agent/Advisor code is required";
      else if (data.agentCode.trim().length < 3)
        e.agentCode = "Agent code must be at least 3 characters";
      else if (!alphanumericRegex.test(data.agentCode.trim()))
        e.agentCode = "Only letters, numbers, _ and - allowed";

      if (data.agencyName && data.agencyName.trim().length < 2)
        e.agencyName = "Agency name is too short";

      if (data.yearsOfExperience === "" || data.yearsOfExperience === null)
        e.yearsOfExperience = "Years of experience is required";
      else validateNum("yearsOfExperience", "Experience", { min: 0, max: 60 });

      if (data.previousExperience && data.previousExperience.trim().length < 3)
        e.previousExperience = "Please provide more details";
    }

    // ── STEP 2: Company ──
    if (stepIndex === 2) {
      if (!data.insuranceCompanyName.trim())
        e.insuranceCompanyName = "Insurance company name is required";
      else if (data.insuranceCompanyName.trim().length < 2)
        e.insuranceCompanyName = "Company name is too short";

      if (data.companyCode && data.companyCode.trim().length < 2)
        e.companyCode = "Company code is too short";

      if (!data.agentLicenseNumber.trim())
        e.agentLicenseNumber = "License/Registration number is required";
      else if (data.agentLicenseNumber.trim().length < 5)
        e.agentLicenseNumber = "License number must be at least 5 characters";

      if (data.licenseIssueDate) {
        const issue = new Date(data.licenseIssueDate);
        if (issue > today) e.licenseIssueDate = "Issue date cannot be in the future";
      }

      if (data.licenseExpiryDate) {
        const exp = new Date(data.licenseExpiryDate);
        if (data.licenseIssueDate && exp < new Date(data.licenseIssueDate))
          e.licenseExpiryDate = "Expiry date must be after issue date";
        else if (exp < new Date())
          e.licenseExpiryDate = "License has already expired";
      }

      if (!data.agentIdCard) e.agentIdCard = "Agent ID Card is required";
    }

    // ── STEP 3: Products ──
    if (stepIndex === 3) {
      if (!data.insuranceProducts || data.insuranceProducts.length === 0)
        e.insuranceProducts = "Please select at least one product";
    }

    // ── STEP 4: Services ──
    if (stepIndex === 4) {
      if (!data.servicesOffered || data.servicesOffered.length === 0)
        e.servicesOffered = "Please select at least one service";
    }

    // ── STEP 5: Service Area ──
    if (stepIndex === 5) {
      validateName("stateSA", "State", true, 2);
      validateName("districtSA", "District", true, 2);
      validateName("citySA", "City", true, 2);

      if (data.serviceablePincodes && data.serviceablePincodes.trim()) {
        const pins = data.serviceablePincodes.split(",").map((p) => p.trim()).filter(Boolean);
        const invalid = pins.find((p) => !pinRegex.test(p));
        if (invalid) e.serviceablePincodes = `Invalid PIN: ${invalid}`;
      }

      if (data.serviceRadius && data.serviceRadius.trim()) {
        const radius = data.serviceRadius.replace(/[^0-9.]/g, "");
        const n = parseFloat(radius);
        if (isNaN(n) || n <= 0) e.serviceRadius = "Enter a valid radius";
        else if (n > 5000) e.serviceRadius = "Radius seems too large";
      }

      if (!data.serviceArea || data.serviceArea.length === 0)
        e.serviceArea = "Please select at least one service area";
    }

    // ── STEP 6: Experience ──
    if (stepIndex === 6) {
      if (data.totalExperience === "" || data.totalExperience === null)
        e.totalExperience = "Total experience is required";
      else validateNum("totalExperience", "Experience", { min: 0, max: 60 });

      validateNum("homeInsuranceExp", "Home insurance experience", { min: 0, max: 60 });
      validateNum("propertyInsuranceExp", "Property insurance experience", { min: 0, max: 60 });
      validateNum("fireInsuranceExp", "Fire insurance experience", { min: 0, max: 60 });
      validateNum("policiesHandled", "Policies handled", { min: 0, max: 1000000, integer: true });
      validateNum("activeCustomers", "Active customers", { min: 0, max: 1000000, integer: true });
      validateNum("claimsHandled", "Claims handled", { min: 0, max: 1000000, integer: true });

      if (!data.customerSupport) e.customerSupport = "Please select an option";
    }

    // ── STEP 7: Documents ──
    if (stepIndex === 7) {
      if (!data.agentIdCardDoc) e.agentIdCardDoc = "Agent ID Card is required";
      if (!data.agentLicenseDoc) e.agentLicenseDoc = "Agent License is required";
      if (!data.panCard) e.panCard = "PAN Card is required";
      if (!data.aadhaarIdProof) e.aadhaarIdProof = "Aadhaar / ID Proof is required";
    }

    // ── STEP 8: Bank ──
    if (stepIndex === 8) {
      validateName("accountHolderName", "Account holder name", true, 3);

      if (!data.bankName.trim()) e.bankName = "Bank name is required";
      else if (data.bankName.trim().length < 3) e.bankName = "Bank name is too short";

      if (!data.accountNumber.trim()) e.accountNumber = "Account number is required";
      else if (!/^\d{9,18}$/.test(data.accountNumber.trim()))
        e.accountNumber = "Account number must be 9-18 digits";

      if (!data.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      else if (!ifscRegex.test(data.ifscCode.trim().toUpperCase()))
        e.ifscCode = "Enter a valid IFSC (e.g., SBIN0001234)";

      if (data.upiId && data.upiId.trim()) {
        if (!upiRegex.test(data.upiId.trim()))
          e.upiId = "Enter a valid UPI ID (e.g., name@upi)";
      }

      if (data.gstNumber && data.gstNumber.trim()) {
        if (!gstRegex.test(data.gstNumber.trim().toUpperCase()))
          e.gstNumber = "Enter a valid 15-character GST number";
      }
    }

    // ── STEP 9: Login ──
    if (stepIndex === 9) {
      if (!data.loginEmail.trim()) e.loginEmail = "Email is required";
      else if (!emailRegex.test(data.loginEmail.trim()))
        e.loginEmail = "Enter a valid email address";

      if (!data.password) e.password = "Password is required";
      else {
        const c = passwordChecks(data.password);
        if (!c.length || !c.upper || !c.lower || !c.number || !c.special)
          e.password = "Password must be 8+ chars with upper, lower, number & special";
      }

      if (!data.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (data.password !== data.confirmPassword)
        e.confirmPassword = "Passwords do not match";

      if (!data.mobileOtpVerify) e.mobileOtpVerify = "Mobile OTP verification is required";
      if (!data.emailVerify) e.emailVerify = "Email verification is required";
    }

    // ── STEP 10: Declaration ──
    if (stepIndex === 10) {
      if (!data.confirmAccuracy) e.confirmAccuracy = "You must confirm information accuracy";
      if (!data.confirmLicense) e.confirmLicense = "You must confirm your license validity";
      if (!data.authorizeLeads) e.authorizeLeads = "You must authorize lead distribution";
      if (!data.agreeContact) e.agreeContact = "You must agree to contact customers";
      if (!data.agreeTerms) e.agreeTerms = "You must agree to the Terms & Conditions";
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

  const handleDocumentUpload = (docType, e, maxSize = 5, allowImages = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const validType = allowImages ? isPdfOrImage(file) : file.type === "application/pdf";
    if (!validType) {
      setErrors((p) => ({
        ...p,
        [docType]: allowImages ? "Only PDF or image files are allowed" : "Only PDF files are allowed",
      }));
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
      console.log("Insurance Agent Registration submitted:", formData);
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
          <div
            className="relative flex flex-col items-center justify-center px-4 pt-3 pb-3 overflow-hidden shrink-0 rounded-t-3xl"
            style={{
              background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)",
              minHeight: 75,
            }}
          >
            <button onClick={onClose} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]">✕</button>
            <div className="text-xl mb-0.5 relative z-10">🧑‍💼</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">
              Insurance Agent Registration
            </h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">
              Register as an insurance agent
            </p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">
              Step {step + 1} of {steps.length} — {subtitles[step]}
            </p>
          </div>

          <div className="flex items-start justify-between px-1.5 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[32px]">
                <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[6px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRef} className="px-3 py-2.5 overflow-y-auto flex-1">
            <AgentContent
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
              agentTypeOptions={agentTypeOptions}
              insuranceProductsList={insuranceProductsList}
              servicesOfferedList={servicesOfferedList}
              serviceAreaOptions={serviceAreaOptions}
              contactMethodOptions={contactMethodOptions}
              accountTypeOptions={accountTypeOptions}
              yesNoOptions={yesNoOptions}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              isMobile
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white border-t border-teal-100">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < steps.length - 1 && (
              <div className="px-3 pt-1.5 pb-0.5">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[8px] text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />
                    Form completion
                  </span>
                  <span className="text-[8px] text-[#00695C] font-bold">
                    {Math.round(((step + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1 pt-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? "w-1.5 h-1 bg-green-400" : i === step ? "w-3 h-1 bg-[#00695C]" : "w-1 h-1 bg-gray-200"}`} />
              ))}
            </div>
            <div className="flex gap-2 px-3 py-2">
              {step > 0 && (
                <button className="px-3 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                className={`flex-1 py-2 text-[12px] font-semibold text-white rounded-xl flex items-center justify-center gap-1 shadow ${step === steps.length - 1 ? "bg-gradient-to-r from-green-600 to-teal-600" : "bg-gradient-to-r from-[#00695C] to-[#00897B]"}`}
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
          <div
            className="relative flex flex-col items-center justify-center min-h-[65px] px-4 pt-2.5 pb-2.5 overflow-hidden shrink-0 rounded-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)" }}
          >
            <button onClick={onClose} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]">✕</button>
            <div className="text-xl mb-0.5 relative z-10">🧑‍💼</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Insurance Agent Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">Register as an insurance agent</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">
              Step {step + 1} of {steps.length} — {subtitles[step]}
            </p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[32px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[6.5px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRefDt} className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <AgentContent
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
              agentTypeOptions={agentTypeOptions}
              insuranceProductsList={insuranceProductsList}
              servicesOfferedList={servicesOfferedList}
              serviceAreaOptions={serviceAreaOptions}
              contactMethodOptions={contactMethodOptions}
              accountTypeOptions={accountTypeOptions}
              yesNoOptions={yesNoOptions}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              isMobile={false}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white rounded-b-2xl border-t border-teal-100 overflow-hidden">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < steps.length - 1 && (
              <div className="px-4 pt-1.5 pb-0.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[8px] text-gray-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />
                    Form completion
                  </span>
                  <span className="text-[8px] text-[#00695C] font-bold">
                    {Math.round(((step + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1.5 pt-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? "w-2 h-1.5 bg-green-400" : i === step ? "w-3.5 h-1.5 bg-[#00695C]" : "w-1.5 h-1.5 bg-gray-200"}`} />
              ))}
            </div>
            <div className="flex gap-2 px-4 py-2">
              {step > 0 && (
                <button className="px-4 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1 border border-teal-200" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                className={`px-5 py-1.5 text-[12px] font-semibold text-white rounded-lg flex items-center gap-1.5 ml-auto shadow-md hover:-translate-y-0.5 ${step === steps.length - 1 ? "bg-gradient-to-r from-green-600 to-teal-600" : "bg-gradient-to-r from-[#00695C] to-[#00897B]"}`}
                onClick={() => {
                  step === steps.length - 1 ? handleSubmit() : handleNext();
                }}
              >
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue <span className="text-sm">→</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   AGENT FORM CONTENT (SHARED mobile+desktop)
   ───────────────────────────────────────────── */

function AgentContent({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  profilePhotoPreview, handleProfilePhotoUpload, removeProfilePhoto,
  handleDocumentUpload, agentTypeOptions, insuranceProductsList,
  servicesOfferedList, serviceAreaOptions, contactMethodOptions,
  accountTypeOptions, yesNoOptions,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
  isMobile,
}) {
  const F = isMobile ? Field : FieldDt;
  const headerClass = isMobile ? "flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50" : "flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50";
  const h3Class = isMobile ? "text-[11px] font-bold text-[#00695C]" : "text-[14px] font-bold text-[#00695C]";
  const barClass = isMobile ? "w-1 h-3" : "w-1 h-4";
  const textSm = isMobile ? "text-[11px]" : "text-[13px]";
  const checkClass = isMobile ? "w-3.5 h-3.5" : "w-4 h-4";

  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  // ── STEP 0: Personal ──
  if (step === 0) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Agent Personal Details</h3>
      </div>
      <F label="Full Name" required error={errors.fullName}>
        <input
          className={inputCls("fullName")}
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={(e) => updateForm("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          {...errAttr("fullName")}
        />
      </F>
      <F label="Profile Photo" hint="Max 2MB" error={errors.profilePhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("profilePhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("profilePhoto")}>
          <input type="file" accept="image/*" className="hidden" id={`${isMobile ? "m" : "dt"}-agent-photo`} onChange={handleProfilePhotoUpload} />
          <label htmlFor={`${isMobile ? "m" : "dt"}-agent-photo`} className="cursor-pointer flex flex-col items-center">
            <span className={`mb-1 ${isMobile ? "text-lg" : "text-xl"}`}>📷</span>
            <span className={`${isMobile ? "text-[11px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload Profile Photo</span>
            <span className={`${isMobile ? "text-[10px]" : "text-[11px]"} text-gray-400`}>JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {profilePhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={profilePhotoPreview} alt="Profile" className={`object-cover rounded-full border-2 border-[#00695C] ${isMobile ? "w-20 h-20" : "w-24 h-24"}`} />
            <button onClick={removeProfilePhoto} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">✕</button>
          </div>
        )}
      </F>
      <F label="Mobile Number" required error={errors.mobileNumber}>
        <input
          className={inputCls("mobileNumber")}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile"
          value={formData.mobileNumber}
          onChange={(e) => updateForm("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
          onBlur={() => handleBlur("mobileNumber")}
          {...errAttr("mobileNumber")}
        />
      </F>
      <F label="Alternate Mobile Number" error={errors.alternateMobile}>
        <input
          className={inputCls("alternateMobile")}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="Optional"
          value={formData.alternateMobile}
          onChange={(e) => updateForm("alternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
          onBlur={() => handleBlur("alternateMobile")}
          {...errAttr("alternateMobile")}
        />
      </F>
      <F label="Email ID" required error={errors.emailId}>
        <input
          className={inputCls("emailId")}
          type="email"
          placeholder="name@example.com"
          value={formData.emailId}
          onChange={(e) => updateForm("emailId", e.target.value)}
          onBlur={() => handleBlur("emailId")}
          {...errAttr("emailId")}
        />
      </F>
      <F label="Date of Birth" error={errors.dob}>
        <input
          className={inputCls("dob")}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={formData.dob}
          onChange={(e) => updateForm("dob", e.target.value)}
          onBlur={() => handleBlur("dob")}
          {...errAttr("dob")}
        />
      </F>
      <F label="Gender">
        <div className={`flex gap-${isMobile ? "4" : "5"}`}>
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className={`flex items-center gap-2 ${textSm} cursor-pointer`}>
              <input type="radio" name={`${isMobile ? "m" : "dt"}-agent-gender`} className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </F>
      <F label="Residential Address" required error={errors.residentialAddress}>
        <input
          className={inputCls("residentialAddress")}
          placeholder="Enter full address"
          value={formData.residentialAddress}
          onChange={(e) => updateForm("residentialAddress", e.target.value)}
          onBlur={() => handleBlur("residentialAddress")}
          {...errAttr("residentialAddress")}
        />
      </F>
      <F label="City" required error={errors.city}>
        <input
          className={inputCls("city")}
          value={formData.city}
          onChange={(e) => updateForm("city", e.target.value)}
          onBlur={() => handleBlur("city")}
          {...errAttr("city")}
        />
      </F>
      <F label="District" error={errors.district}>
        <input
          className={inputCls("district")}
          value={formData.district}
          onChange={(e) => updateForm("district", e.target.value)}
          onBlur={() => handleBlur("district")}
          {...errAttr("district")}
        />
      </F>
      <F label="State" required error={errors.state}>
        <input
          className={inputCls("state")}
          value={formData.state}
          onChange={(e) => updateForm("state", e.target.value)}
          onBlur={() => handleBlur("state")}
          {...errAttr("state")}
        />
      </F>
      <F label="PIN Code" required hint="6 digits" error={errors.pinCode}>
        <input
          className={inputCls("pinCode")}
          type="tel"
          inputMode="numeric"
          maxLength={6}
          value={formData.pinCode}
          onChange={(e) => updateForm("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
          onBlur={() => handleBlur("pinCode")}
          {...errAttr("pinCode")}
        />
      </F>
    </>
  );

  // ── STEP 1: Professional ──
  if (step === 1) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Agent Professional Details</h3>
      </div>
      <F label="Agent Type" required error={errors.agentType}>
        <select
          className={inputCls("agentType")}
          value={formData.agentType}
          onChange={(e) => updateForm("agentType", e.target.value)}
          onBlur={() => handleBlur("agentType")}
          {...errAttr("agentType")}
        >
          <option value="">Select Agent Type</option>
          {agentTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </F>
      <F label="Agent / Advisor Code" required error={errors.agentCode}>
        <input
          className={inputCls("agentCode")}
          value={formData.agentCode}
          onChange={(e) => updateForm("agentCode", e.target.value)}
          onBlur={() => handleBlur("agentCode")}
          {...errAttr("agentCode")}
        />
      </F>
      <F label="Agency Name" error={errors.agencyName}>
        <input
          className={inputCls("agencyName")}
          value={formData.agencyName}
          onChange={(e) => updateForm("agencyName", e.target.value)}
          onBlur={() => handleBlur("agencyName")}
          {...errAttr("agencyName")}
        />
      </F>
      <F label="Years of Experience" required error={errors.yearsOfExperience}>
        <input
          className={inputCls("yearsOfExperience")}
          type="number"
          min="0"
          max="60"
          value={formData.yearsOfExperience}
          onChange={(e) => updateForm("yearsOfExperience", e.target.value)}
          onBlur={() => handleBlur("yearsOfExperience")}
          {...errAttr("yearsOfExperience")}
        />
      </F>
      <F label="Previous Experience" error={errors.previousExperience}>
        <input
          className={inputCls("previousExperience")}
          placeholder="e.g. Worked at XYZ Insurance"
          value={formData.previousExperience}
          onChange={(e) => updateForm("previousExperience", e.target.value)}
          onBlur={() => handleBlur("previousExperience")}
          {...errAttr("previousExperience")}
        />
      </F>
      <F label="Languages Known">
        <input className={inp} placeholder="e.g. English, Hindi" value={formData.languagesKnown} onChange={(e) => updateForm("languagesKnown", e.target.value)} />
      </F>
      <F label="Preferred Contact Method">
        <select className={inp} value={formData.preferredContactMethod} onChange={(e) => updateForm("preferredContactMethod", e.target.value)}>
          <option value="">Select method</option>
          {contactMethodOptions.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </F>
    </>
  );

  // ── STEP 2: Company ──
  if (step === 2) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Insurance Company Details</h3>
      </div>
      <F label="Insurance Company Name" required error={errors.insuranceCompanyName}>
        <input
          className={inputCls("insuranceCompanyName")}
          value={formData.insuranceCompanyName}
          onChange={(e) => updateForm("insuranceCompanyName", e.target.value)}
          onBlur={() => handleBlur("insuranceCompanyName")}
          {...errAttr("insuranceCompanyName")}
        />
      </F>
      <F label="Insurance Company / Agency Code" error={errors.companyCode}>
        <input
          className={inputCls("companyCode")}
          value={formData.companyCode}
          onChange={(e) => updateForm("companyCode", e.target.value)}
          onBlur={() => handleBlur("companyCode")}
          {...errAttr("companyCode")}
        />
      </F>
      <F label="Agent License / Registration Number" required error={errors.agentLicenseNumber}>
        <input
          className={inputCls("agentLicenseNumber")}
          value={formData.agentLicenseNumber}
          onChange={(e) => updateForm("agentLicenseNumber", e.target.value)}
          onBlur={() => handleBlur("agentLicenseNumber")}
          {...errAttr("agentLicenseNumber")}
        />
      </F>
      <F label="License Issue Date" error={errors.licenseIssueDate}>
        <input
          className={inputCls("licenseIssueDate")}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={formData.licenseIssueDate}
          onChange={(e) => updateForm("licenseIssueDate", e.target.value)}
          onBlur={() => handleBlur("licenseIssueDate")}
          {...errAttr("licenseIssueDate")}
        />
      </F>
      <F label="License Expiry Date" error={errors.licenseExpiryDate}>
        <input
          className={inputCls("licenseExpiryDate")}
          type="date"
          min={formData.licenseIssueDate || undefined}
          value={formData.licenseExpiryDate}
          onChange={(e) => updateForm("licenseExpiryDate", e.target.value)}
          onBlur={() => handleBlur("licenseExpiryDate")}
          {...errAttr("licenseExpiryDate")}
        />
      </F>
      <F label="IRDAI Registration / Authorization Details">
        <input className={inp} value={formData.irdaiDetails} onChange={(e) => updateForm("irdaiDetails", e.target.value)} />
      </F>
      <F label="Agent ID Card Upload" required hint="PDF only (Max 5MB)" error={errors.agentIdCard}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("agentIdCard") ? "border-red-400" : "border-teal-300"}`} {...errAttr("agentIdCard")}>
          <input type="file" accept=".pdf" className="hidden" id={`${isMobile ? "m" : "dt"}-agent-idcard-step2`} onChange={(e) => handleDocumentUpload("agentIdCard", e)} />
          <label htmlFor={`${isMobile ? "m" : "dt"}-agent-idcard-step2`} className="cursor-pointer flex flex-col items-center">
            <span className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>📄</span>
            <span className={`${isMobile ? "text-[10px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload Agent ID Card</span>
          </label>
        </div>
        {formData.agentIdCard && <p className={`${isMobile ? "text-[10px]" : "text-[13px]"} text-green-600 mt-1`}>✓ {formData.agentIdCard.name}</p>}
      </F>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-3">
        <p className={`${isMobile ? "text-[10px]" : "text-[11px]"} text-amber-800 leading-snug`}>
          ⚠️ Admin verification will be required before the agent account becomes active.
        </p>
      </div>
    </>
  );

  // ── STEP 3: Products ──
  if (step === 3) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Insurance Products</h3>
      </div>
      <p className={`${isMobile ? "text-[10px]" : "text-[12px]"} text-gray-400 mb-2`}>Select the insurance products you offer</p>
      <div className="grid grid-cols-2 gap-1.5" {...errAttr("insuranceProducts")}>
        {insuranceProductsList.map((p) => (
          <label key={p} className={`flex items-center gap-1.5 ${isMobile ? "text-[10px]" : "text-[12px]"} cursor-pointer`}>
            <input type="checkbox" className={`accent-[#00695C] cursor-pointer ${checkClass}`} checked={formData.insuranceProducts.includes(p)} onChange={() => toggleArrayItem("insuranceProducts", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.insuranceProducts && (
        <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.insuranceProducts}</p>
      )}
    </>
  );

  // ── STEP 4: Services ──
  if (step === 4) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Services Offered</h3>
      </div>
      <div className="grid grid-cols-2 gap-1.5" {...errAttr("servicesOffered")}>
        {servicesOfferedList.map((s) => (
          <label key={s} className={`flex items-center gap-1.5 ${isMobile ? "text-[10px]" : "text-[12px]"} cursor-pointer`}>
            <input type="checkbox" className={`accent-[#00695C] cursor-pointer ${checkClass}`} checked={formData.servicesOffered.includes(s)} onChange={() => toggleArrayItem("servicesOffered", s)} />
            {s}
          </label>
        ))}
      </div>
      {errors.servicesOffered && (
        <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.servicesOffered}</p>
      )}
    </>
  );

  // ── STEP 5: Service Area ──
  if (step === 5) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Service Area</h3>
      </div>
      <F label="State" required error={errors.stateSA}>
        <input className={inputCls("stateSA")} value={formData.stateSA} onChange={(e) => updateForm("stateSA", e.target.value)} onBlur={() => handleBlur("stateSA")} {...errAttr("stateSA")} />
      </F>
      <F label="District" required error={errors.districtSA}>
        <input className={inputCls("districtSA")} value={formData.districtSA} onChange={(e) => updateForm("districtSA", e.target.value)} onBlur={() => handleBlur("districtSA")} {...errAttr("districtSA")} />
      </F>
      <F label="City" required error={errors.citySA}>
        <input className={inputCls("citySA")} value={formData.citySA} onChange={(e) => updateForm("citySA", e.target.value)} onBlur={() => handleBlur("citySA")} {...errAttr("citySA")} />
      </F>
      <F label="Serviceable PIN Codes" error={errors.serviceablePincodes}>
        <input className={inputCls("serviceablePincodes")} placeholder="Comma separated" value={formData.serviceablePincodes} onChange={(e) => updateForm("serviceablePincodes", e.target.value)} onBlur={() => handleBlur("serviceablePincodes")} {...errAttr("serviceablePincodes")} />
      </F>
      <F label="Preferred Service Radius" error={errors.serviceRadius}>
        <input className={inputCls("serviceRadius")} placeholder="e.g. 50 km" value={formData.serviceRadius} onChange={(e) => updateForm("serviceRadius", e.target.value)} onBlur={() => handleBlur("serviceRadius")} {...errAttr("serviceRadius")} />
      </F>
      <F label="Service Area" required error={errors.serviceArea}>
        <div className="space-y-2 mt-1" {...errAttr("serviceArea")}>
          {serviceAreaOptions.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 ${textSm} cursor-pointer`}>
              <input type="checkbox" className={`accent-[#00695C] cursor-pointer ${checkClass}`} checked={formData.serviceArea.includes(opt)} onChange={() => toggleArrayItem("serviceArea", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </F>
    </>
  );

  // ── STEP 6: Experience ──
  if (step === 6) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Experience & Business Details</h3>
      </div>
      <F label="Total Insurance Experience" required hint="In years" error={errors.totalExperience}>
        <input className={inputCls("totalExperience")} type="number" min="0" max="60" value={formData.totalExperience} onChange={(e) => updateForm("totalExperience", e.target.value)} onBlur={() => handleBlur("totalExperience")} {...errAttr("totalExperience")} />
      </F>
      <F label="Home Insurance Experience" hint="In years" error={errors.homeInsuranceExp}>
        <input className={inputCls("homeInsuranceExp")} type="number" min="0" max="60" value={formData.homeInsuranceExp} onChange={(e) => updateForm("homeInsuranceExp", e.target.value)} onBlur={() => handleBlur("homeInsuranceExp")} {...errAttr("homeInsuranceExp")} />
      </F>
      <F label="Property Insurance Experience" hint="In years" error={errors.propertyInsuranceExp}>
        <input className={inputCls("propertyInsuranceExp")} type="number" min="0" max="60" value={formData.propertyInsuranceExp} onChange={(e) => updateForm("propertyInsuranceExp", e.target.value)} onBlur={() => handleBlur("propertyInsuranceExp")} {...errAttr("propertyInsuranceExp")} />
      </F>
      <F label="Fire Insurance Experience" hint="In years" error={errors.fireInsuranceExp}>
        <input className={inputCls("fireInsuranceExp")} type="number" min="0" max="60" value={formData.fireInsuranceExp} onChange={(e) => updateForm("fireInsuranceExp", e.target.value)} onBlur={() => handleBlur("fireInsuranceExp")} {...errAttr("fireInsuranceExp")} />
      </F>
      <F label="Number of Policies Handled" error={errors.policiesHandled}>
        <input className={inputCls("policiesHandled")} type="number" min="0" value={formData.policiesHandled} onChange={(e) => updateForm("policiesHandled", e.target.value)} onBlur={() => handleBlur("policiesHandled")} {...errAttr("policiesHandled")} />
      </F>
      <F label="Number of Active Customers" error={errors.activeCustomers}>
        <input className={inputCls("activeCustomers")} type="number" min="0" value={formData.activeCustomers} onChange={(e) => updateForm("activeCustomers", e.target.value)} onBlur={() => handleBlur("activeCustomers")} {...errAttr("activeCustomers")} />
      </F>
      <F label="Approximate Claims Handled" error={errors.claimsHandled}>
        <input className={inputCls("claimsHandled")} type="number" min="0" value={formData.claimsHandled} onChange={(e) => updateForm("claimsHandled", e.target.value)} onBlur={() => handleBlur("claimsHandled")} {...errAttr("claimsHandled")} />
      </F>
      <F label="Customer Support Available" error={errors.customerSupport}>
        <div className="flex gap-5 mt-1" {...errAttr("customerSupport")}>
          {yesNoOptions.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 ${textSm} cursor-pointer`}>
              <input type="radio" name={`${isMobile ? "m" : "dt"}-agent-support`} className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.customerSupport === opt} onChange={() => updateForm("customerSupport", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </F>
    </>
  );

  // ── STEP 7: Documents ──
  if (step === 7) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Document Verification</h3>
      </div>
      <p className={`${isMobile ? "text-[10px]" : "text-[12px]"} text-gray-400 mb-2`}>PDF only (Max 5MB each)</p>
      {[
        { key: "agentIdCardDoc", label: "Agent ID Card", req: true },
        { key: "agentLicenseDoc", label: "Agent License / Certificate", req: true },
        { key: "panCard", label: "PAN Card", req: true },
        { key: "aadhaarIdProof", label: "Aadhaar / ID Proof", req: true },
        { key: "addressProof", label: "Address Proof", req: false },
        { key: "agencyAuthorization", label: "Agency Authorization Letter", req: false },
        { key: "companyAppointmentLetter", label: "Insurance Company Appointment Letter", req: false },
        { key: "otherDocuments", label: "Other Supporting Documents", req: false },
      ].map(({ key, label, req }) => (
        <F key={key} label={label} required={req} error={errors[key]}>
          <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError(key) ? "border-red-400" : "border-teal-300"}`} {...errAttr(key)}>
            <input type="file" accept=".pdf" className="hidden" id={`${isMobile ? "m" : "dt"}-agent-${key}`} onChange={(e) => handleDocumentUpload(key, e)} />
            <label htmlFor={`${isMobile ? "m" : "dt"}-agent-${key}`} className="cursor-pointer flex flex-col items-center">
              <span className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>📄</span>
              <span className={`${isMobile ? "text-[10px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload {label}</span>
            </label>
          </div>
          {formData[key] && <p className={`${isMobile ? "text-[10px]" : "text-[13px]"} text-green-600 mt-1`}>✓ {formData[key].name}</p>}
        </F>
      ))}
    </>
  );

  // ── STEP 8: Bank ──
  if (step === 8) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Bank / Payment Details</h3>
      </div>
      <F label="Account Holder Name" required error={errors.accountHolderName}>
        <input className={inputCls("accountHolderName")} value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} onBlur={() => handleBlur("accountHolderName")} {...errAttr("accountHolderName")} />
      </F>
      <F label="Bank Name" required error={errors.bankName}>
        <input className={inputCls("bankName")} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} onBlur={() => handleBlur("bankName")} {...errAttr("bankName")} />
      </F>
      <F label="Account Number" required error={errors.accountNumber}>
        <input className={inputCls("accountNumber")} inputMode="numeric" maxLength={18} value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value.replace(/\D/g, ""))} onBlur={() => handleBlur("accountNumber")} {...errAttr("accountNumber")} />
      </F>
      <F label="IFSC Code" required error={errors.ifscCode}>
        <input className={inputCls("ifscCode")} maxLength={11} value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} onBlur={() => handleBlur("ifscCode")} {...errAttr("ifscCode")} />
      </F>
      <F label="Account Type">
        <select className={inp} value={formData.accountType} onChange={(e) => updateForm("accountType", e.target.value)}>
          <option value="">Select type</option>
          {accountTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </F>
      <F label="Cancelled Cheque / Bank Proof" hint="PDF or image (Max 5MB)" error={errors.cancelledCheque}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("cancelledCheque") ? "border-red-400" : "border-teal-300"}`} {...errAttr("cancelledCheque")}>
          <input type="file" accept=".pdf,image/*" className="hidden" id={`${isMobile ? "m" : "dt"}-agent-cheque`} onChange={(e) => handleDocumentUpload("cancelledCheque", e, 5, true)} />
          <label htmlFor={`${isMobile ? "m" : "dt"}-agent-cheque`} className="cursor-pointer flex flex-col items-center">
            <span className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>🏦</span>
            <span className={`${isMobile ? "text-[10px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload Cancelled Cheque</span>
          </label>
        </div>
        {formData.cancelledCheque && <p className={`${isMobile ? "text-[10px]" : "text-[13px]"} text-green-600 mt-1`}>✓ {formData.cancelledCheque.name}</p>}
      </F>
      <F label="UPI ID" error={errors.upiId}>
        <input className={inputCls("upiId")} placeholder="e.g. name@upi" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} onBlur={() => handleBlur("upiId")} {...errAttr("upiId")} />
      </F>
      <F label="GST Number (if applicable)" error={errors.gstNumber}>
        <input className={inputCls("gstNumber")} maxLength={15} value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value.toUpperCase())} onBlur={() => handleBlur("gstNumber")} {...errAttr("gstNumber")} />
      </F>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mt-3">
        <p className={`${isMobile ? "text-[10px]" : "text-[11px]"} text-blue-800 leading-snug`}>
          🔒 These details are kept private and visible only to authorized payment users.
        </p>
      </div>
    </>
  );

  // ── STEP 9: Login ──
  if (step === 9) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Login Details</h3>
      </div>
      <F label="Email / Username" required error={errors.loginEmail}>
        <input className={inputCls("loginEmail")} type="email" value={formData.loginEmail} onChange={(e) => updateForm("loginEmail", e.target.value)} onBlur={() => handleBlur("loginEmail")} {...errAttr("loginEmail")} />
      </F>
      <F label="Password" required error={errors.password}>
        <div className="relative">
          <input
            className={`${inputCls("password")} pr-12`}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateForm("password", e.target.value)}
            onBlur={() => handleBlur("password")}
            {...errAttr("password")}
          />
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
      </F>
      <F label="Confirm Password" required error={errors.confirmPassword}>
        <div className="relative">
          <input
            className={`${inputCls("confirmPassword")} pr-12`}
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateForm("confirmPassword", e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            {...errAttr("confirmPassword")}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#00695C]">
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </F>
      <label
        className={`flex items-center gap-2 ${textSm} cursor-pointer mb-2 mt-2 ${hasError("mobileOtpVerify") ? "text-red-500" : ""}`}
        {...errAttr("mobileOtpVerify")}
      >
        <input type="checkbox" className={`accent-[#00695C] ${checkClass}`} checked={formData.mobileOtpVerify} onChange={() => updateForm("mobileOtpVerify", !formData.mobileOtpVerify)} />
        Mobile OTP Verification <span className="text-red-500">*</span>
      </label>
      {errors.mobileOtpVerify && <p className="text-[10px] text-red-500 mb-1 font-medium" data-field-error="true">{errors.mobileOtpVerify}</p>}
      <label
        className={`flex items-center gap-2 ${textSm} cursor-pointer mb-2 ${hasError("emailVerify") ? "text-red-500" : ""}`}
        {...errAttr("emailVerify")}
      >
        <input type="checkbox" className={`accent-[#00695C] ${checkClass}`} checked={formData.emailVerify} onChange={() => updateForm("emailVerify", !formData.emailVerify)} />
        Email Verification <span className="text-red-500">*</span>
      </label>
      {errors.emailVerify && <p className="text-[10px] text-red-500 mb-1 font-medium" data-field-error="true">{errors.emailVerify}</p>}
      <label className={`flex items-center gap-2 ${textSm} cursor-pointer`}>
        <input type="checkbox" className={`accent-[#00695C] ${checkClass}`} checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Two-Factor Authentication
      </label>
    </>
  );

  // ── STEP 10: Declaration ──
  if (step === 10) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Declaration</h3>
      </div>
      <p className={`${isMobile ? "text-[11px]" : "text-[13px]"} text-gray-600 mb-3 leading-relaxed`}>
        Please read and confirm each point:
      </p>
      {[
        { key: "confirmAccuracy", label: "I confirm that the information provided is accurate." },
        { key: "confirmLicense", label: "I confirm that my insurance license/authorization is valid." },
        { key: "authorizeLeads", label: "I authorize the platform to send relevant customer insurance leads to me." },
        { key: "agreeContact", label: "I agree to contact customers regarding their insurance requirements." },
        { key: "agreeTerms", label: "I agree to the Terms & Conditions and Privacy Policy." },
      ].map(({ key, label }) => (
        <div key={key} className="mb-2" {...errAttr(key)}>
          <label className={`flex items-start gap-2 ${textSm} cursor-pointer`}>
            <input type="checkbox" className={`accent-[#00695C] mt-0.5 ${checkClass}`} checked={formData[key]} onChange={() => updateForm(key, !formData[key])} />
            <span className={hasError(key) ? "text-red-500" : ""}>{label} <span className="text-red-500">*</span></span>
          </label>
          {errors[key] && <p className="text-[10px] text-red-500 mt-0.5 ml-5 font-medium">{errors[key]}</p>}
        </div>
      ))}
    </>
  );

  return null;
}