// src/components/Forms/loans/BankEmployeeRegistrationForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const steps = [
  "Employee Details",
  "Bank Details",
  "Verification",
  "Products",
  "Service Area",
];

const subtitles = [
  "Enter your personal information",
  "Your branch and bank information",
  "Upload your ID and reporting details",
  "Pick the products you can offer",
  "Where you can process loans",
];

const genderOptions = ["Male", "Female", "Other"];
const yesNoOptions = ["Yes", "No"];
const bankOptions = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Kotak Mahindra Bank", "IndusInd Bank", "Other"];

const loanProductsList = [
  "Home Purchase", "Land / Plot Purchase", "House Construction",
  "Commercial Property Purchase", "Loan Against Property",
  "Home Loan Balance Transfer", "Home Renovation",
  "Plot + Construction Loan", "Builder / Project Home Loan",
  "Commercial Property Loan", "Mortgage Loan",
  "Property Purchase Loan", "Top-Up Loan",
];

const customerSegmentList = [
  "Salaried", "Self-Employed", "Business Owners", "Professionals",
  "Corporate Employees", "NRIs", "Property Investors",
  "Builders / Developers", "Commercial Property Owners",
  "Land / Plot Buyers",
];

const customerProfileList = [
  "First-Time Home Buyer", "Existing Property Owner",
  "Property Investor", "Home Loan Transfer Customer",
  "Construction Customer", "Commercial Property Buyer",
  "Loan Against Property Customer",
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
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const pinRegex = /^[1-9][0-9]{5}$/;
const nameRegex = /^[a-zA-Z\s.'-]+$/;

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

export default function BankEmployeeRegistrationForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const contentRef = useRef(null);
  const contentRefDt = useRef(null);

  const [formData, setFormData] = useState({
    // Employee Details (Step 0)
    fullName: "", employeeId: "", gender: "", dob: "", profilePhoto: null,
    mobileNumber: "", emailId: "", alternateMobile: "", designation: "", department: "",
    username: "", password: "", confirmPassword: "",
    twoFA: false, securityQuestion: "", accepted: false,

    // Bank Details (Step 1)
    bankName: "", branchName: "", branchCode: "", ifscCode: "",
    bankAddress: "", city: "", district: "", state: "", pinCode: "",
    branchPhone: "",

    // Verification (Step 2)
    idCardDoc: null, joiningDate: "", yearsOfExperience: "",
    managerName: "", managerId: "",

    // Products (Step 3)
    loanProducts: [],

    // Service Area (Step 4)
    loanLocation: "", serviceCity: "", serviceState: "", servicePincodes: "",
    customerSegments: [], customerProfiles: [],
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

    // ── STEP 0: Employee Details ──
    if (stepIndex === 0) {
      validateName("fullName", "Full name", true, 3);

      if (!data.employeeId.trim()) e.employeeId = "Employee ID is required";
      else if (data.employeeId.trim().length < 3) e.employeeId = "Employee ID must be at least 3 characters";

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

      if (!data.department.trim()) e.department = "Department is required";
      else if (data.department.trim().length < 2) e.department = "Department is too short";

      if (data.profilePhoto) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(data.profilePhoto.type))
          e.profilePhoto = "Only JPG, PNG, or WEBP allowed";
      }

      // Login & Security
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

    // ── STEP 1: Bank Details ──
    if (stepIndex === 1) {
      if (!data.bankName) e.bankName = "Please select a bank";

      if (!data.branchName.trim()) e.branchName = "Branch name is required";
      else if (data.branchName.trim().length < 2) e.branchName = "Branch name is too short";

      if (data.branchCode && data.branchCode.trim().length < 2)
        e.branchCode = "Branch code is too short";

      if (!data.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      else if (!ifscRegex.test(data.ifscCode.trim().toUpperCase()))
        e.ifscCode = "Enter a valid IFSC (e.g., SBIN0001234)";

      if (data.bankAddress && data.bankAddress.trim().length < 5)
        e.bankAddress = "Bank address is too short";

      validateName("city", "City", true, 2);
      validateName("district", "District", false, 2);
      validateName("state", "State", true, 2);

      if (data.pinCode && !pinRegex.test(data.pinCode.trim()))
        e.pinCode = "Enter a valid 6-digit PIN code";

      if (data.branchPhone && data.branchPhone.trim()) {
        if (!/^\d{10,11}$/.test(data.branchPhone.trim()))
          e.branchPhone = "Enter a valid 10-11 digit phone number";
      }
    }

    // ── STEP 2: Verification ──
    if (stepIndex === 2) {
      if (!data.idCardDoc) e.idCardDoc = "Employee ID Card is required";

      if (data.joiningDate) {
        const jd = new Date(data.joiningDate);
        if (jd > today) e.joiningDate = "Joining date cannot be in the future";
        if (data.dob) {
          const dob = new Date(data.dob);
          if (jd < dob) e.joiningDate = "Joining date cannot be before date of birth";
        }
      }

      validateNum("yearsOfExperience", "Years of experience", { min: 0, max: 60 });

      if (data.managerName && data.managerName.trim().length < 3)
        e.managerName = "Manager name is too short";

      if (data.managerId && data.managerId.trim().length < 3)
        e.managerId = "Manager ID is too short";
    }

    // ── STEP 3: Products ──
    if (stepIndex === 3) {
      if (!data.loanProducts || data.loanProducts.length === 0)
        e.loanProducts = "Please select at least one loan product";
    }

    // ── STEP 4: Service Area ──
    if (stepIndex === 4) {
      if (!data.loanLocation.trim()) e.loanLocation = "Loan processing location is required";
      else if (data.loanLocation.trim().length < 2) e.loanLocation = "Location is too short";

      validateName("serviceCity", "City/District", true, 2);
      validateName("serviceState", "State", true, 2);

      if (data.servicePincodes && data.servicePincodes.trim()) {
        const pins = data.servicePincodes.split(",").map((p) => p.trim()).filter(Boolean);
        const invalid = pins.find((p) => !pinRegex.test(p));
        if (invalid) e.servicePincodes = `Invalid PIN: ${invalid}`;
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
      console.log("Bank Employee Registration submitted:", formData);
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
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Bank Employee Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">Register to offer loan products</p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1.5 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[40px]">
                <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[7px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRef} className="px-3 py-2.5 overflow-y-auto flex-1">
            <MobContentBankEmp
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
              bankOptions={bankOptions}
              loanProductsList={loanProductsList}
              customerSegmentList={customerSegmentList}
              customerProfileList={customerProfileList}
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
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Bank Employee Registration</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">Register to offer loan products</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[44px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[7px] mt-0.5 text-center px-0.5 leading-tight ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div ref={contentRefDt} className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContentBankEmp
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
              bankOptions={bankOptions}
              loanProductsList={loanProductsList}
              customerSegmentList={customerSegmentList}
              customerProfileList={customerProfileList}
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
// MOBILE CONTENT - Bank Employee
// ─────────────────────────────────────────────

function MobContentBankEmp({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  profilePhotoPreview, handleProfilePhotoUpload, removeProfilePhoto,
  handleDocumentUpload, genderOptions, bankOptions,
  loanProductsList, customerSegmentList, customerProfileList,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
}) {
  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  // STEP 0: Employee Details
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
              <input type="radio" name="mob-bank-gender" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Date of Birth" error={errors.dob}>
        <input className={inputCls("dob")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.dob} onChange={(e) => updateForm("dob", e.target.value)} onBlur={() => handleBlur("dob")} {...errAttr("dob")} />
      </Field>
      <Field label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inputCls("mobileNumber")} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("mobileNumber")} {...errAttr("mobileNumber")} />
      </Field>
      <Field label="Official Email" required error={errors.emailId}>
        <input className={inputCls("emailId")} type="email" placeholder="name@bank.com" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} onBlur={() => handleBlur("emailId")} {...errAttr("emailId")} />
      </Field>
      <Field label="Alternate Mobile" error={errors.alternateMobile}>
        <input className={inputCls("alternateMobile")} type="tel" inputMode="numeric" maxLength={10} placeholder="Optional" value={formData.alternateMobile} onChange={(e) => updateForm("alternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("alternateMobile")} {...errAttr("alternateMobile")} />
      </Field>
      <Field label="Designation" required error={errors.designation}>
        <input className={inputCls("designation")} placeholder="e.g. Loan Officer" value={formData.designation} onChange={(e) => updateForm("designation", e.target.value)} onBlur={() => handleBlur("designation")} {...errAttr("designation")} />
      </Field>
      <Field label="Department" required error={errors.department}>
        <input className={inputCls("department")} placeholder="e.g. Retail Banking" value={formData.department} onChange={(e) => updateForm("department", e.target.value)} onBlur={() => handleBlur("department")} {...errAttr("department")} />
      </Field>
      <Field label="Profile Photo" hint="Max 2MB" error={errors.profilePhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("profilePhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("profilePhoto")}>
          <input type="file" accept="image/*" className="hidden" id="m-bank-photo" onChange={handleProfilePhotoUpload} />
          <label htmlFor="m-bank-photo" className="cursor-pointer flex flex-col items-center">
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
      <Field label="Security Question / Recovery">
        <input className={inp} placeholder="e.g. Mother's maiden name" value={formData.securityQuestion} onChange={(e) => updateForm("securityQuestion", e.target.value)} />
      </Field>
      <label className="flex items-center gap-2 text-[11px] cursor-pointer mb-1">
        <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Enable Two-Factor Authentication
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

  // STEP 1: Bank Details
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <Field label="Bank Name" required error={errors.bankName}>
        <select className={inputCls("bankName")} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} onBlur={() => handleBlur("bankName")} {...errAttr("bankName")}>
          <option value="">Select Bank</option>
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Branch Name" required error={errors.branchName}>
        <input className={inputCls("branchName")} placeholder="Enter branch name" value={formData.branchName} onChange={(e) => updateForm("branchName", e.target.value)} onBlur={() => handleBlur("branchName")} {...errAttr("branchName")} />
      </Field>
      <Field label="Branch Code" error={errors.branchCode}>
        <input className={inputCls("branchCode")} value={formData.branchCode} onChange={(e) => updateForm("branchCode", e.target.value)} onBlur={() => handleBlur("branchCode")} {...errAttr("branchCode")} />
      </Field>
      <Field label="IFSC Code" required hint="e.g., SBIN0001234" error={errors.ifscCode}>
        <input className={inputCls("ifscCode")} placeholder="Enter IFSC code" maxLength={11} value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} onBlur={() => handleBlur("ifscCode")} {...errAttr("ifscCode")} />
      </Field>
      <Field label="Bank Address" error={errors.bankAddress}>
        <input className={inputCls("bankAddress")} placeholder="Enter bank address" value={formData.bankAddress} onChange={(e) => updateForm("bankAddress", e.target.value)} onBlur={() => handleBlur("bankAddress")} {...errAttr("bankAddress")} />
      </Field>
      <Field label="City" required error={errors.city}>
        <input className={inputCls("city")} placeholder="Enter city" value={formData.city} onChange={(e) => updateForm("city", e.target.value)} onBlur={() => handleBlur("city")} {...errAttr("city")} />
      </Field>
      <Field label="District" error={errors.district}>
        <input className={inputCls("district")} placeholder="Enter district" value={formData.district} onChange={(e) => updateForm("district", e.target.value)} onBlur={() => handleBlur("district")} {...errAttr("district")} />
      </Field>
      <Field label="State" required error={errors.state}>
        <input className={inputCls("state")} placeholder="Enter state" value={formData.state} onChange={(e) => updateForm("state", e.target.value)} onBlur={() => handleBlur("state")} {...errAttr("state")} />
      </Field>
      <Field label="PIN Code" hint="6 digits" error={errors.pinCode}>
        <input className={inputCls("pinCode")} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} onBlur={() => handleBlur("pinCode")} {...errAttr("pinCode")} />
      </Field>
      <Field label="Branch Phone" error={errors.branchPhone}>
        <input className={inputCls("branchPhone")} type="tel" inputMode="numeric" maxLength={11} value={formData.branchPhone} onChange={(e) => updateForm("branchPhone", e.target.value.replace(/\D/g, "").slice(0, 11))} onBlur={() => handleBlur("branchPhone")} {...errAttr("branchPhone")} />
      </Field>
    </>
  );

  // STEP 2: Verification
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Employee Verification</h3>
      </div>
      <Field label="Employee ID Card Upload" required hint="PDF only (Max 2MB)" error={errors.idCardDoc}>
        <div className={`border-2 border-dashed rounded-xl p-2.5 text-center hover:bg-green-50 ${hasError("idCardDoc") ? "border-red-400" : "border-teal-300"}`} {...errAttr("idCardDoc")}>
          <input type="file" accept=".pdf" className="hidden" id="m-bank-idcard" onChange={(e) => handleDocumentUpload("idCardDoc", e)} />
          <label htmlFor="m-bank-idcard" className="cursor-pointer flex flex-col items-center">
            <span className="text-xl mb-1">📄</span>
            <span className="text-[10px] font-semibold text-[#00695C]">Upload ID Card</span>
            <span className="text-[9px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.idCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.idCardDoc.name}</p>}
      </Field>
      <Field label="Joining Date" error={errors.joiningDate}>
        <input className={inputCls("joiningDate")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.joiningDate} onChange={(e) => updateForm("joiningDate", e.target.value)} onBlur={() => handleBlur("joiningDate")} {...errAttr("joiningDate")} />
      </Field>
      <Field label="Years of Experience" error={errors.yearsOfExperience}>
        <input className={inputCls("yearsOfExperience")} type="number" min="0" max="60" placeholder="e.g. 5" value={formData.yearsOfExperience} onChange={(e) => updateForm("yearsOfExperience", e.target.value)} onBlur={() => handleBlur("yearsOfExperience")} {...errAttr("yearsOfExperience")} />
      </Field>
      <Field label="Reporting Manager Name" error={errors.managerName}>
        <input className={inputCls("managerName")} value={formData.managerName} onChange={(e) => updateForm("managerName", e.target.value)} onBlur={() => handleBlur("managerName")} {...errAttr("managerName")} />
      </Field>
      <Field label="Manager Employee ID" error={errors.managerId}>
        <input className={inputCls("managerId")} value={formData.managerId} onChange={(e) => updateForm("managerId", e.target.value)} onBlur={() => handleBlur("managerId")} {...errAttr("managerId")} />
      </Field>
    </>
  );

  // STEP 3: Products
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
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.loanProducts.includes(p)} onChange={() => toggleArrayItem("loanProducts", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.loanProducts && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.loanProducts}</p>}
    </>
  );

  // STEP 4: Service Area
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Service Area</h3>
      </div>
      <Field label="Loan Processing Location" required error={errors.loanLocation}>
        <input className={inputCls("loanLocation")} value={formData.loanLocation} onChange={(e) => updateForm("loanLocation", e.target.value)} onBlur={() => handleBlur("loanLocation")} {...errAttr("loanLocation")} />
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

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Customer Segment</h3>
      </div>
      <Field label="Preferred Customer Segment">
        <div className="grid grid-cols-2 gap-1">
          {customerSegmentList.map(s => (
            <label key={s} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.customerSegments.includes(s)} onChange={() => toggleArrayItem("customerSegments", s)} />
              {s}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Customer Profile Handled">
        <div className="grid grid-cols-2 gap-1">
          {customerProfileList.map(s => (
            <label key={s} className="flex items-center gap-1 text-[9px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.customerProfiles.includes(s)} onChange={() => toggleArrayItem("customerProfiles", s)} />
              {s}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  return null;
}

// ─────────────────────────────────────────────
// DESKTOP CONTENT - Bank Employee
// ─────────────────────────────────────────────

function DtContentBankEmp({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  profilePhotoPreview, handleProfilePhotoUpload, removeProfilePhoto,
  handleDocumentUpload, genderOptions, bankOptions,
  loanProductsList, customerSegmentList, customerProfileList,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
}) {
  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  // STEP 0: Employee Details
  if (step === 0) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Employee Details</h3>
      </div>
      <FieldDt label="Full Name" required error={errors.fullName}>
        <input className={inputCls("fullName")} placeholder="Enter full name" value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} onBlur={() => handleBlur("fullName")} {...errAttr("fullName")} />
      </FieldDt>
      <FieldDt label="Employee ID" required error={errors.employeeId}>
        <input className={inputCls("employeeId")} placeholder="Enter employee ID" value={formData.employeeId} onChange={(e) => updateForm("employeeId", e.target.value)} onBlur={() => handleBlur("employeeId")} {...errAttr("employeeId")} />
      </FieldDt>
      <FieldDt label="Gender">
        <div className="flex gap-5">
          {genderOptions.map(g => (
            <label key={g} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-bank-gender" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gender === g} onChange={() => updateForm("gender", g)} />
              {g}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Date of Birth" error={errors.dob}>
        <input className={inputCls("dob")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.dob} onChange={(e) => updateForm("dob", e.target.value)} onBlur={() => handleBlur("dob")} {...errAttr("dob")} />
      </FieldDt>
      <FieldDt label="Mobile Number" required error={errors.mobileNumber}>
        <input className={inputCls("mobileNumber")} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={formData.mobileNumber} onChange={(e) => updateForm("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("mobileNumber")} {...errAttr("mobileNumber")} />
      </FieldDt>
      <FieldDt label="Official Email" required error={errors.emailId}>
        <input className={inputCls("emailId")} type="email" placeholder="name@bank.com" value={formData.emailId} onChange={(e) => updateForm("emailId", e.target.value)} onBlur={() => handleBlur("emailId")} {...errAttr("emailId")} />
      </FieldDt>
      <FieldDt label="Alternate Mobile" error={errors.alternateMobile}>
        <input className={inputCls("alternateMobile")} type="tel" inputMode="numeric" maxLength={10} placeholder="Optional" value={formData.alternateMobile} onChange={(e) => updateForm("alternateMobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => handleBlur("alternateMobile")} {...errAttr("alternateMobile")} />
      </FieldDt>
      <FieldDt label="Designation" required error={errors.designation}>
        <input className={inputCls("designation")} placeholder="e.g. Loan Officer" value={formData.designation} onChange={(e) => updateForm("designation", e.target.value)} onBlur={() => handleBlur("designation")} {...errAttr("designation")} />
      </FieldDt>
      <FieldDt label="Department" required error={errors.department}>
        <input className={inputCls("department")} placeholder="e.g. Retail Banking" value={formData.department} onChange={(e) => updateForm("department", e.target.value)} onBlur={() => handleBlur("department")} {...errAttr("department")} />
      </FieldDt>
      <FieldDt label="Profile Photo" hint="Max 2MB" error={errors.profilePhoto}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("profilePhoto") ? "border-red-400" : "border-teal-300"}`} {...errAttr("profilePhoto")}>
          <input type="file" accept="image/*" className="hidden" id="dt-bank-photo" onChange={handleProfilePhotoUpload} />
          <label htmlFor="dt-bank-photo" className="cursor-pointer flex flex-col items-center">
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
      <FieldDt label="Security Question / Recovery">
        <input className={inp} placeholder="e.g. Mother's maiden name" value={formData.securityQuestion} onChange={(e) => updateForm("securityQuestion", e.target.value)} />
      </FieldDt>
      <label className="flex items-center gap-2 text-[13px] cursor-pointer mb-2">
        <input type="checkbox" className="accent-[#00695C] w-4 h-4" checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Enable Two-Factor Authentication
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

  // STEP 1: Bank Details
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <FieldDt label="Bank Name" required error={errors.bankName}>
        <select className={inputCls("bankName")} value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} onBlur={() => handleBlur("bankName")} {...errAttr("bankName")}>
          <option value="">Select Bank</option>
          {bankOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </FieldDt>
      <FieldDt label="Branch Name" required error={errors.branchName}>
        <input className={inputCls("branchName")} placeholder="Enter branch name" value={formData.branchName} onChange={(e) => updateForm("branchName", e.target.value)} onBlur={() => handleBlur("branchName")} {...errAttr("branchName")} />
      </FieldDt>
      <FieldDt label="Branch Code" error={errors.branchCode}>
        <input className={inputCls("branchCode")} value={formData.branchCode} onChange={(e) => updateForm("branchCode", e.target.value)} onBlur={() => handleBlur("branchCode")} {...errAttr("branchCode")} />
      </FieldDt>
      <FieldDt label="IFSC Code" required hint="e.g., SBIN0001234" error={errors.ifscCode}>
        <input className={inputCls("ifscCode")} placeholder="Enter IFSC code" maxLength={11} value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())} onBlur={() => handleBlur("ifscCode")} {...errAttr("ifscCode")} />
      </FieldDt>
      <FieldDt label="Bank Address" error={errors.bankAddress}>
        <input className={inputCls("bankAddress")} placeholder="Enter bank address" value={formData.bankAddress} onChange={(e) => updateForm("bankAddress", e.target.value)} onBlur={() => handleBlur("bankAddress")} {...errAttr("bankAddress")} />
      </FieldDt>
      <FieldDt label="City" required error={errors.city}>
        <input className={inputCls("city")} placeholder="Enter city" value={formData.city} onChange={(e) => updateForm("city", e.target.value)} onBlur={() => handleBlur("city")} {...errAttr("city")} />
      </FieldDt>
      <FieldDt label="District" error={errors.district}>
        <input className={inputCls("district")} placeholder="Enter district" value={formData.district} onChange={(e) => updateForm("district", e.target.value)} onBlur={() => handleBlur("district")} {...errAttr("district")} />
      </FieldDt>
      <FieldDt label="State" required error={errors.state}>
        <input className={inputCls("state")} placeholder="Enter state" value={formData.state} onChange={(e) => updateForm("state", e.target.value)} onBlur={() => handleBlur("state")} {...errAttr("state")} />
      </FieldDt>
      <FieldDt label="PIN Code" hint="6 digits" error={errors.pinCode}>
        <input className={inputCls("pinCode")} type="tel" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={formData.pinCode} onChange={(e) => updateForm("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} onBlur={() => handleBlur("pinCode")} {...errAttr("pinCode")} />
      </FieldDt>
      <FieldDt label="Branch Phone" error={errors.branchPhone}>
        <input className={inputCls("branchPhone")} type="tel" inputMode="numeric" maxLength={11} value={formData.branchPhone} onChange={(e) => updateForm("branchPhone", e.target.value.replace(/\D/g, "").slice(0, 11))} onBlur={() => handleBlur("branchPhone")} {...errAttr("branchPhone")} />
      </FieldDt>
    </>
  );

  // STEP 2: Verification
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Employee Verification</h3>
      </div>
      <FieldDt label="Employee ID Card Upload" required hint="PDF only (Max 2MB)" error={errors.idCardDoc}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("idCardDoc") ? "border-red-400" : "border-teal-300"}`} {...errAttr("idCardDoc")}>
          <input type="file" accept=".pdf" className="hidden" id="dt-bank-idcard" onChange={(e) => handleDocumentUpload("idCardDoc", e)} />
          <label htmlFor="dt-bank-idcard" className="cursor-pointer flex flex-col items-center">
            <span className="text-2xl mb-1">📄</span>
            <span className="text-[12px] font-semibold text-[#00695C]">Upload ID Card</span>
            <span className="text-[11px] text-gray-400">PDF only (Max 2MB)</span>
          </label>
        </div>
        {formData.idCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.idCardDoc.name}</p>}
      </FieldDt>
      <FieldDt label="Joining Date" error={errors.joiningDate}>
        <input className={inputCls("joiningDate")} type="date" max={new Date().toISOString().split("T")[0]} value={formData.joiningDate} onChange={(e) => updateForm("joiningDate", e.target.value)} onBlur={() => handleBlur("joiningDate")} {...errAttr("joiningDate")} />
      </FieldDt>
      <FieldDt label="Years of Experience" error={errors.yearsOfExperience}>
        <input className={inputCls("yearsOfExperience")} type="number" min="0" max="60" placeholder="e.g. 5" value={formData.yearsOfExperience} onChange={(e) => updateForm("yearsOfExperience", e.target.value)} onBlur={() => handleBlur("yearsOfExperience")} {...errAttr("yearsOfExperience")} />
      </FieldDt>
      <FieldDt label="Reporting Manager Name" error={errors.managerName}>
        <input className={inputCls("managerName")} value={formData.managerName} onChange={(e) => updateForm("managerName", e.target.value)} onBlur={() => handleBlur("managerName")} {...errAttr("managerName")} />
      </FieldDt>
      <FieldDt label="Manager Employee ID" error={errors.managerId}>
        <input className={inputCls("managerId")} value={formData.managerId} onChange={(e) => updateForm("managerId", e.target.value)} onBlur={() => handleBlur("managerId")} {...errAttr("managerId")} />
      </FieldDt>
    </>
  );

  // STEP 3: Products
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
            <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.loanProducts.includes(p)} onChange={() => toggleArrayItem("loanProducts", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.loanProducts && <p className="text-[10px] text-red-500 mt-2 font-medium" data-field-error="true">{errors.loanProducts}</p>}
    </>
  );

  // STEP 4: Service Area
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Service Area</h3>
      </div>
      <FieldDt label="Loan Processing Location" required error={errors.loanLocation}>
        <input className={inputCls("loanLocation")} value={formData.loanLocation} onChange={(e) => updateForm("loanLocation", e.target.value)} onBlur={() => handleBlur("loanLocation")} {...errAttr("loanLocation")} />
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

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Customer Segment</h3>
      </div>
      <FieldDt label="Preferred Customer Segment">
        <div className="grid grid-cols-2 gap-2">
          {customerSegmentList.map(s => (
            <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.customerSegments.includes(s)} onChange={() => toggleArrayItem("customerSegments", s)} />
              {s}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Customer Profile Handled">
        <div className="grid grid-cols-2 gap-2">
          {customerProfileList.map(s => (
            <label key={s} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.customerProfiles.includes(s)} onChange={() => toggleArrayItem("customerProfiles", s)} />
              {s}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  return null;
}