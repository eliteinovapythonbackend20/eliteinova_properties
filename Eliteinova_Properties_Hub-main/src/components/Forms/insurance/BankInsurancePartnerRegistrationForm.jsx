import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const steps = [
  "Employee Details",
  "Bank Details",
  "Products",
  "Service Area",
  "Experience",
  "Verification",
  "Documents",
  "Login Details",
  "Declaration",
];

const subtitles = [
  "Your personal information",
  "Your bank & branch information",
  "Insurance products you offer",
  "Where you can serve",
  "Your insurance experience",
  "Verify your employment",
  "Upload supporting documents",
  "Secure login credentials",
  "Confirm and submit",
];

const designationOptions = [
  "Branch Manager",
  "Relationship Manager",
  "Insurance Officer",
  "Loan Officer",
  "Sales Officer",
  "Customer Relationship Executive",
  "Other",
];

const bankOptions = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Punjab National Bank", "Bank of Baroda", "Canara Bank",
  "Kotak Mahindra Bank", "IndusInd Bank", "Other",
];

const insuranceProductsList = [
  "Home Insurance",
  "Property Insurance",
  "Building Insurance",
];

const serviceAreaOptions = [
  "Local Branch",
  "District",
  "State",
  "Pan India",
];

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

const passwordChecks = (pwd) => ({
  length: pwd.length >= 8,
  upper: /[A-Z]/.test(pwd),
  lower: /[a-z]/.test(pwd),
  number: /\d/.test(pwd),
  special: /[!@#$%^&*(),.?":{}|<>_\-\\-]/.test(pwd),
});

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function BankInsurancePartnerRegistrationForm({ isOpen, onClose }) {
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
    fullName: "", employeeId: "", designation: "", customDesignation: "",
    officialMobile: "", officialEmail: "", alternateMobile: "",
    yearsOfExperience: "", profilePhoto: null,

    // Step 1: Bank Details
    bankName: "", branchName: "", branchCode: "", ifscCode: "",
    branchAddress: "", city: "", district: "", state: "", pinCode: "",
    bankContactNumber: "",

    // Step 2: Products
    insuranceProducts: [],

    // Step 3: Service Area
    serviceableState: "", serviceableDistrict: "", serviceableCity: "",
    serviceablePincodes: "", serviceArea: [],

    // Step 4: Experience
    insuranceExperience: "", propertyInsuranceExp: "", homeInsuranceExp: "",
    fireInsuranceExp: "", policiesHandled: "", claimAssistance: "",

    // Step 5: Verification
    employeeIdCardVerify: null, bankAuthLetter: null,
    officialEmailVerify: false, joiningDate: "",
    managerName: "", managerEmployeeId: "", branchManagerApproval: false,

    // Step 6: Documents
    employeeIdCard: null, bankAuthDoc: null,
    insuranceAuthDoc: null, otherDocs: null,

    // Step 7: Login
    loginEmail: "", username: "", password: "", confirmPassword: "",
    otpVerification: false, twoFA: false,

    // Step 8: Declaration
    accepted: false,
    agreeLeads: false,
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

    if (stepIndex === 0) {
      // Employee Details
      if (!data.fullName.trim()) e.fullName = "Full name is required";
      else if (data.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters";
      else if (!/^[a-zA-Z\s.'-]+$/.test(data.fullName.trim())) e.fullName = "Name can only contain letters, spaces, and . ' -";

      if (!data.employeeId.trim()) e.employeeId = "Employee ID is required";
      else if (data.employeeId.trim().length < 3) e.employeeId = "Employee ID must be at least 3 characters";

      if (!data.designation) e.designation = "Please select a designation";
      if (data.designation === "Other" && !data.customDesignation.trim())
        e.customDesignation = "Please specify your designation";

      if (!data.officialMobile.trim()) e.officialMobile = "Official mobile number is required";
      else if (!mobileRegex.test(data.officialMobile.trim()))
        e.officialMobile = "Enter a valid 10-digit mobile (starts with 6-9)";

      if (!data.officialEmail.trim()) e.officialEmail = "Official email is required";
      else if (!emailRegex.test(data.officialEmail.trim()))
        e.officialEmail = "Enter a valid email address";

      if (data.alternateMobile.trim()) {
        if (!mobileRegex.test(data.alternateMobile.trim()))
          e.alternateMobile = "Enter a valid 10-digit mobile (starts with 6-9)";
        else if (data.alternateMobile.trim() === data.officialMobile.trim())
          e.alternateMobile = "Alternate mobile must differ from official mobile";
      }

      if (data.yearsOfExperience !== "" && data.yearsOfExperience !== null) {
        const y = Number(data.yearsOfExperience);
        if (isNaN(y) || y < 0) e.yearsOfExperience = "Enter a valid number";
        else if (y > 60) e.yearsOfExperience = "Experience cannot exceed 60 years";
      }

      if (data.profilePhoto) {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowed.includes(data.profilePhoto.type))
          e.profilePhoto = "Only JPG, PNG, or WEBP allowed";
      }
    }

    if (stepIndex === 1) {
      // Bank Details
      if (!data.bankName) e.bankName = "Please select a bank";
      if (!data.branchName.trim()) e.branchName = "Branch name is required";
      else if (data.branchName.trim().length < 2) e.branchName = "Branch name is too short";

      if (data.branchCode && data.branchCode.trim().length < 2)
        e.branchCode = "Branch code is too short";

      if (!data.ifscCode.trim()) e.ifscCode = "IFSC code is required";
      else if (!ifscRegex.test(data.ifscCode.trim().toUpperCase()))
        e.ifscCode = "Enter a valid IFSC (e.g., SBIN0001234)";

      if (!data.branchAddress.trim()) e.branchAddress = "Branch address is required";
      else if (data.branchAddress.trim().length < 5) e.branchAddress = "Address is too short";

      if (!data.city.trim()) e.city = "City is required";
      else if (!/^[a-zA-Z\s.'-]+$/.test(data.city.trim())) e.city = "City contains invalid characters";

      if (data.district && !/^[a-zA-Z\s.'-]+$/.test(data.district.trim()))
        e.district = "District contains invalid characters";

      if (!data.state.trim()) e.state = "State is required";
      else if (!/^[a-zA-Z\s.'-]+$/.test(data.state.trim())) e.state = "State contains invalid characters";

      if (data.pinCode && !pinRegex.test(data.pinCode.trim()))
        e.pinCode = "Enter a valid 6-digit PIN code";

      if (data.bankContactNumber && !mobileRegex.test(data.bankContactNumber.trim()))
        e.bankContactNumber = "Enter a valid 10-digit number";
    }

    if (stepIndex === 2) {
      // Products
      if (!data.insuranceProducts || data.insuranceProducts.length === 0)
        e.insuranceProducts = "Please select at least one insurance product";
    }

    if (stepIndex === 3) {
      // Service Area
      if (!data.serviceableState.trim()) e.serviceableState = "Serviceable state is required";
      if (!data.serviceableDistrict.trim()) e.serviceableDistrict = "Serviceable district is required";
      if (!data.serviceableCity.trim()) e.serviceableCity = "Serviceable city is required";

      if (data.serviceablePincodes.trim()) {
        const pins = data.serviceablePincodes.split(",").map((p) => p.trim()).filter(Boolean);
        const invalid = pins.find((p) => !pinRegex.test(p));
        if (invalid) e.serviceablePincodes = `Invalid PIN: ${invalid}`;
      }

      if (!data.serviceArea || data.serviceArea.length === 0)
        e.serviceArea = "Please select at least one service area";
    }

    if (stepIndex === 4) {
      // Experience
      if (data.insuranceExperience === "" || data.insuranceExperience === null)
        e.insuranceExperience = "Insurance experience is required";
      else {
        const y = Number(data.insuranceExperience);
        if (isNaN(y) || y < 0) e.insuranceExperience = "Enter a valid number";
        else if (y > 60) e.insuranceExperience = "Experience cannot exceed 60 years";
      }

      const checkNum = (key, label) => {
        if (data[key] !== "" && data[key] !== null) {
          const n = Number(data[key]);
          if (isNaN(n) || n < 0) e[key] = `Enter a valid ${label}`;
          else if (n > 60) e[key] = `${label} cannot exceed 60`;
        }
      };

      checkNum("propertyInsuranceExp", "property experience");
      checkNum("homeInsuranceExp", "home experience");
      checkNum("fireInsuranceExp", "fire experience");

      if (data.policiesHandled !== "" && data.policiesHandled !== null) {
        const n = Number(data.policiesHandled);
        if (isNaN(n) || n < 0 || !Number.isInteger(n))
          e.policiesHandled = "Enter a valid whole number";
        else if (n > 100000) e.policiesHandled = "Value seems too high";
      }

      if (!data.claimAssistance) e.claimAssistance = "Please select an option";
    }

    if (stepIndex === 5) {
      // Verification
      if (!data.employeeIdCardVerify) e.employeeIdCardVerify = "Employee ID Card is required";

      if (data.joiningDate) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const jd = new Date(data.joiningDate);
        if (jd > today) e.joiningDate = "Joining date cannot be in the future";
      }

      if (data.managerName && data.managerName.trim().length < 3)
        e.managerName = "Manager name is too short";
    }

    if (stepIndex === 6) {
      // Documents
      if (!data.employeeIdCard) e.employeeIdCard = "Employee ID Card is required";
    }

    if (stepIndex === 7) {
      // Login
      if (!data.loginEmail.trim()) e.loginEmail = "Email is required";
      else if (!emailRegex.test(data.loginEmail.trim()))
        e.loginEmail = "Enter a valid email address";

      if (data.username && data.username.trim().length < 3)
        e.username = "Username must be at least 3 characters";
      else if (data.username && !/^[a-zA-Z0-9_.]+$/.test(data.username.trim()))
        e.username = "Only letters, numbers, _ and . allowed";

      if (!data.password) e.password = "Password is required";
      else {
        const c = passwordChecks(data.password);
        if (!c.length || !c.upper || !c.lower || !c.number || !c.special)
          e.password = "Password must be 8+ chars with upper, lower, number & special character";
      }

      if (!data.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (data.password !== data.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }

    if (stepIndex === 8) {
      // Declaration
      if (!data.accepted) e.accepted = "You must confirm the bank authorization";
      if (!data.agreeLeads) e.agreeLeads = "You must agree to receive customer requirements";
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
      const firstError = document.querySelector("[data-field-error='true']");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStep(step + 1);
  };

  const handleSubmit = () => {
    // Validate ALL steps
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
      console.log("Bank Insurance Partner Registration submitted:", formData);
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
            <button
              onClick={onClose}
              className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]"
            >
              ✕
            </button>
            <div className="text-xl mb-0.5 relative z-10">🏦</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">
              Bank Insurance Partner Registration
            </h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">
              Register to offer insurance products
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
              <div key={i} className="flex-1 flex flex-col items-center min-w-[36px]">
                <div
                  className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "bg-[#00695C] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <p
                  className={`text-[6.5px] mt-0.5 text-center px-0.5 leading-tight ${
                    i === step ? "text-[#00695C] font-bold" : "text-gray-400"
                  }`}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>

          <div ref={contentRef} className="px-3 py-2.5 overflow-y-auto flex-1">
            <BankPartnerContent
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
              designationOptions={designationOptions}
              bankOptions={bankOptions}
              insuranceProductsList={insuranceProductsList}
              serviceAreaOptions={serviceAreaOptions}
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
                  <div
                    className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1 pt-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i < step
                      ? "w-2 h-1 bg-green-400"
                      : i === step
                      ? "w-3.5 h-1 bg-[#00695C]"
                      : "w-1 h-1 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2 px-3 py-2">
              {step > 0 && (
                <button
                  className="px-3 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                className={`flex-1 py-2 text-[12px] font-semibold text-white rounded-xl flex items-center justify-center gap-1 shadow ${
                  step === steps.length - 1
                    ? "bg-gradient-to-r from-green-600 to-teal-600"
                    : "bg-gradient-to-r from-[#00695C] to-[#00897B]"
                }`}
                onClick={() => {
                  step === steps.length - 1 ? handleSubmit() : handleNext();
                }}
              >
                {step === steps.length - 1 ? (
                  <>
                    <span>✓</span> Submit Form
                  </>
                ) : (
                  <>Continue →</>
                )}
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
            style={{
              background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]"
            >
              ✕
            </button>
            <div className="text-xl mb-0.5 relative z-10">🏦</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">
              Bank Insurance Partner Registration
            </h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">
              Register to offer insurance products
            </p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">
              Step {step + 1} of {steps.length} — {subtitles[step]}
            </p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[36px]">
                <div
                  className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "bg-[#00695C] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <p
                  className={`text-[7px] mt-0.5 text-center px-0.5 leading-tight ${
                    i === step ? "text-[#00695C] font-bold" : "text-gray-400"
                  }`}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>

          <div ref={contentRefDt} className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <BankPartnerContent
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
              designationOptions={designationOptions}
              bankOptions={bankOptions}
              insuranceProductsList={insuranceProductsList}
              serviceAreaOptions={serviceAreaOptions}
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
                  <div
                    className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1.5 pt-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i < step
                      ? "w-2.5 h-1.5 bg-green-400"
                      : i === step
                      ? "w-4 h-1.5 bg-[#00695C]"
                      : "w-1.5 h-1.5 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2 px-4 py-2">
              {step > 0 && (
                <button
                  className="px-4 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1 border border-teal-200"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                className={`px-5 py-1.5 text-[12px] font-semibold text-white rounded-lg flex items-center gap-1.5 ml-auto shadow-md hover:-translate-y-0.5 ${
                  step === steps.length - 1
                    ? "bg-gradient-to-r from-green-600 to-teal-600"
                    : "bg-gradient-to-r from-[#00695C] to-[#00897B]"
                }`}
                onClick={() => {
                  step === steps.length - 1 ? handleSubmit() : handleNext();
                }}
              >
                {step === steps.length - 1 ? (
                  <>
                    <span>✓</span> Submit Form
                  </>
                ) : (
                  <>
                    Continue <span className="text-sm">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SHARED CONTENT (MOBILE + DESKTOP)
   ───────────────────────────────────────────── */

function BankPartnerContent({
  step, inp, inErr, errors, hasError, handleBlur,
  formData, updateForm, toggleArrayItem,
  profilePhotoPreview, handleProfilePhotoUpload, removeProfilePhoto,
  handleDocumentUpload, designationOptions, bankOptions,
  insuranceProductsList, serviceAreaOptions, yesNoOptions,
  showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
  isMobile,
}) {
  const F = isMobile ? Field : FieldDt;
  const headerClass = isMobile
    ? "flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"
    : "flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50";
  const h3Class = isMobile
    ? "text-[11px] font-bold text-[#00695C]"
    : "text-[14px] font-bold text-[#00695C]";
  const barClass = isMobile ? "w-1 h-3" : "w-1 h-4";

  const inputCls = (field) => `${inp} ${hasError(field) ? inErr : ""}`;
  const errAttr = (field) => (hasError(field) ? { "data-field-error": "true" } : {});

  // ── STEP 0: Employee Details ──
  if (step === 0) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Employee Details</h3>
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
      <F label="Employee ID" required error={errors.employeeId}>
        <input
          className={inputCls("employeeId")}
          placeholder="Enter employee ID"
          value={formData.employeeId}
          onChange={(e) => updateForm("employeeId", e.target.value)}
          onBlur={() => handleBlur("employeeId")}
          {...errAttr("employeeId")}
        />
      </F>
      <F label="Designation" required error={errors.designation}>
        <select
          className={inputCls("designation")}
          value={formData.designation}
          onChange={(e) => updateForm("designation", e.target.value)}
          onBlur={() => handleBlur("designation")}
          {...errAttr("designation")}
        >
          <option value="">Select Designation</option>
          {designationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </F>
      {formData.designation === "Other" && (
        <F label="Please Specify Designation" required error={errors.customDesignation}>
          <input
            className={inputCls("customDesignation")}
            placeholder="Enter designation"
            value={formData.customDesignation}
            onChange={(e) => updateForm("customDesignation", e.target.value)}
            onBlur={() => handleBlur("customDesignation")}
            {...errAttr("customDesignation")}
          />
        </F>
      )}
      <F label="Official Mobile Number" required error={errors.officialMobile}>
        <input
          className={inputCls("officialMobile")}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile"
          value={formData.officialMobile}
          onChange={(e) => updateForm("officialMobile", e.target.value.replace(/\D/g, ""))}
          onBlur={() => handleBlur("officialMobile")}
          {...errAttr("officialMobile")}
        />
      </F>
      <F label="Official Email ID" required error={errors.officialEmail}>
        <input
          className={inputCls("officialEmail")}
          type="email"
          placeholder="name@bank.com"
          value={formData.officialEmail}
          onChange={(e) => updateForm("officialEmail", e.target.value)}
          onBlur={() => handleBlur("officialEmail")}
          {...errAttr("officialEmail")}
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
          onChange={(e) => updateForm("alternateMobile", e.target.value.replace(/\D/g, ""))}
          onBlur={() => handleBlur("alternateMobile")}
          {...errAttr("alternateMobile")}
        />
      </F>
      <F label="Years of Experience" error={errors.yearsOfExperience}>
        <input
          className={inputCls("yearsOfExperience")}
          type="number"
          min="0"
          max="60"
          placeholder="e.g. 5"
          value={formData.yearsOfExperience}
          onChange={(e) => updateForm("yearsOfExperience", e.target.value)}
          onBlur={() => handleBlur("yearsOfExperience")}
          {...errAttr("yearsOfExperience")}
        />
      </F>
      <F label="Profile Photo" hint="Max 2MB" error={errors.profilePhoto}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id={`${isMobile ? "m" : "dt"}-bank-ins-photo`} onChange={handleProfilePhotoUpload} />
          <label htmlFor={`${isMobile ? "m" : "dt"}-bank-ins-photo`} className="cursor-pointer flex flex-col items-center">
            <span className={`mb-1 ${isMobile ? "text-lg" : "text-xl"}`}>📷</span>
            <span className={`${isMobile ? "text-[11px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload Profile Photo</span>
            <span className={`${isMobile ? "text-[10px]" : "text-[11px]"} text-gray-400`}>JPG, PNG (Max 2MB)</span>
          </label>
        </div>
        {profilePhotoPreview && (
          <div className="mt-2 relative inline-block">
            <img src={profilePhotoPreview} alt="Profile" className={`object-cover rounded-full border-2 border-[#00695C] ${isMobile ? "w-20 h-20" : "w-24 h-24"}`} />
            <button onClick={removeProfilePhoto} className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center ${isMobile ? "text-[10px]" : "text-[11px]"}`}>✕</button>
          </div>
        )}
      </F>
    </>
  );

  // ── STEP 1: Bank Details ──
  if (step === 1) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Bank Details</h3>
      </div>
      <F label="Bank Name" required error={errors.bankName}>
        <select
          className={inputCls("bankName")}
          value={formData.bankName}
          onChange={(e) => updateForm("bankName", e.target.value)}
          onBlur={() => handleBlur("bankName")}
          {...errAttr("bankName")}
        >
          <option value="">Select Bank</option>
          {bankOptions.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </F>
      <F label="Branch Name" required error={errors.branchName}>
        <input
          className={inputCls("branchName")}
          placeholder="Enter branch name"
          value={formData.branchName}
          onChange={(e) => updateForm("branchName", e.target.value)}
          onBlur={() => handleBlur("branchName")}
          {...errAttr("branchName")}
        />
      </F>
      <F label="Branch Code" error={errors.branchCode}>
        <input
          className={inputCls("branchCode")}
          placeholder="Enter branch code"
          value={formData.branchCode}
          onChange={(e) => updateForm("branchCode", e.target.value)}
          onBlur={() => handleBlur("branchCode")}
          {...errAttr("branchCode")}
        />
      </F>
      <F label="IFSC Code" required hint="e.g., SBIN0001234" error={errors.ifscCode}>
        <input
          className={inputCls("ifscCode")}
          placeholder="Enter IFSC code"
          maxLength={11}
          value={formData.ifscCode}
          onChange={(e) => updateForm("ifscCode", e.target.value.toUpperCase())}
          onBlur={() => handleBlur("ifscCode")}
          {...errAttr("ifscCode")}
        />
      </F>
      <F label="Branch Address" required error={errors.branchAddress}>
        <input
          className={inputCls("branchAddress")}
          placeholder="Enter branch address"
          value={formData.branchAddress}
          onChange={(e) => updateForm("branchAddress", e.target.value)}
          onBlur={() => handleBlur("branchAddress")}
          {...errAttr("branchAddress")}
        />
      </F>
      <F label="City" required error={errors.city}>
        <input
          className={inputCls("city")}
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => updateForm("city", e.target.value)}
          onBlur={() => handleBlur("city")}
          {...errAttr("city")}
        />
      </F>
      <F label="District" error={errors.district}>
        <input
          className={inputCls("district")}
          placeholder="Enter district"
          value={formData.district}
          onChange={(e) => updateForm("district", e.target.value)}
          onBlur={() => handleBlur("district")}
          {...errAttr("district")}
        />
      </F>
      <F label="State" required error={errors.state}>
        <input
          className={inputCls("state")}
          placeholder="Enter state"
          value={formData.state}
          onChange={(e) => updateForm("state", e.target.value)}
          onBlur={() => handleBlur("state")}
          {...errAttr("state")}
        />
      </F>
      <F label="PIN Code" hint="6 digits" error={errors.pinCode}>
        <input
          className={inputCls("pinCode")}
          type="tel"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter PIN code"
          value={formData.pinCode}
          onChange={(e) => updateForm("pinCode", e.target.value.replace(/\D/g, ""))}
          onBlur={() => handleBlur("pinCode")}
          {...errAttr("pinCode")}
        />
      </F>
      <F label="Bank Contact Number" error={errors.bankContactNumber}>
        <input
          className={inputCls("bankContactNumber")}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={formData.bankContactNumber}
          onChange={(e) => updateForm("bankContactNumber", e.target.value.replace(/\D/g, ""))}
          onBlur={() => handleBlur("bankContactNumber")}
          {...errAttr("bankContactNumber")}
        />
      </F>
    </>
  );

  // ── STEP 2: Products ──
  if (step === 2) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Insurance Products Offered</h3>
      </div>
      <p className={`${isMobile ? "text-[10px]" : "text-[12px]"} text-gray-400 mb-2`}>Select the products you handle</p>
      <div className="space-y-2" {...errAttr("insuranceProducts")}>
        {insuranceProductsList.map((p) => (
          <label key={p} className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer`}>
            <input type="checkbox" className={`accent-[#00695C] cursor-pointer ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.insuranceProducts.includes(p)} onChange={() => toggleArrayItem("insuranceProducts", p)} />
            {p}
          </label>
        ))}
      </div>
      {errors.insuranceProducts && (
        <p className="text-[10px] text-red-500 mt-1 font-medium" data-field-error="true">{errors.insuranceProducts}</p>
      )}
    </>
  );

  // ── STEP 3: Service Area ──
  if (step === 3) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Service Area</h3>
      </div>
      <F label="Serviceable State" required error={errors.serviceableState}>
        <input
          className={inputCls("serviceableState")}
          value={formData.serviceableState}
          onChange={(e) => updateForm("serviceableState", e.target.value)}
          onBlur={() => handleBlur("serviceableState")}
          {...errAttr("serviceableState")}
        />
      </F>
      <F label="Serviceable District" required error={errors.serviceableDistrict}>
        <input
          className={inputCls("serviceableDistrict")}
          value={formData.serviceableDistrict}
          onChange={(e) => updateForm("serviceableDistrict", e.target.value)}
          onBlur={() => handleBlur("serviceableDistrict")}
          {...errAttr("serviceableDistrict")}
        />
      </F>
      <F label="Serviceable City" required error={errors.serviceableCity}>
        <input
          className={inputCls("serviceableCity")}
          value={formData.serviceableCity}
          onChange={(e) => updateForm("serviceableCity", e.target.value)}
          onBlur={() => handleBlur("serviceableCity")}
          {...errAttr("serviceableCity")}
        />
      </F>
      <F label="Serviceable PIN Codes" error={errors.serviceablePincodes}>
        <input
          className={inputCls("serviceablePincodes")}
          placeholder="Comma separated"
          value={formData.serviceablePincodes}
          onChange={(e) => updateForm("serviceablePincodes", e.target.value)}
          onBlur={() => handleBlur("serviceablePincodes")}
          {...errAttr("serviceablePincodes")}
        />
      </F>
      <F label="Service Area" required error={errors.serviceArea}>
        <div className="space-y-2 mt-1" {...errAttr("serviceArea")}>
          {serviceAreaOptions.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer`}>
              <input type="checkbox" className={`accent-[#00695C] cursor-pointer ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.serviceArea.includes(opt)} onChange={() => toggleArrayItem("serviceArea", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </F>
    </>
  );

  // ── STEP 4: Experience ──
  if (step === 4) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Insurance Experience</h3>
      </div>
      <F label="Insurance Experience" required hint="In years" error={errors.insuranceExperience}>
        <input
          className={inputCls("insuranceExperience")}
          type="number"
          min="0"
          max="60"
          placeholder="e.g. 5"
          value={formData.insuranceExperience}
          onChange={(e) => updateForm("insuranceExperience", e.target.value)}
          onBlur={() => handleBlur("insuranceExperience")}
          {...errAttr("insuranceExperience")}
        />
      </F>
      <F label="Property Insurance Experience" hint="In years" error={errors.propertyInsuranceExp}>
        <input
          className={inputCls("propertyInsuranceExp")}
          type="number"
          min="0"
          max="60"
          value={formData.propertyInsuranceExp}
          onChange={(e) => updateForm("propertyInsuranceExp", e.target.value)}
          onBlur={() => handleBlur("propertyInsuranceExp")}
          {...errAttr("propertyInsuranceExp")}
        />
      </F>
      <F label="Home Insurance Experience" hint="In years" error={errors.homeInsuranceExp}>
        <input
          className={inputCls("homeInsuranceExp")}
          type="number"
          min="0"
          max="60"
          value={formData.homeInsuranceExp}
          onChange={(e) => updateForm("homeInsuranceExp", e.target.value)}
          onBlur={() => handleBlur("homeInsuranceExp")}
          {...errAttr("homeInsuranceExp")}
        />
      </F>
      <F label="Fire Insurance Experience" hint="In years" error={errors.fireInsuranceExp}>
        <input
          className={inputCls("fireInsuranceExp")}
          type="number"
          min="0"
          max="60"
          value={formData.fireInsuranceExp}
          onChange={(e) => updateForm("fireInsuranceExp", e.target.value)}
          onBlur={() => handleBlur("fireInsuranceExp")}
          {...errAttr("fireInsuranceExp")}
        />
      </F>
      <F label="Number of Policies Handled" error={errors.policiesHandled}>
        <input
          className={inputCls("policiesHandled")}
          type="number"
          min="0"
          value={formData.policiesHandled}
          onChange={(e) => updateForm("policiesHandled", e.target.value)}
          onBlur={() => handleBlur("policiesHandled")}
          {...errAttr("policiesHandled")}
        />
      </F>
      <F label="Claim Assistance Available" error={errors.claimAssistance}>
        <div className="flex gap-5 mt-1" {...errAttr("claimAssistance")}>
          {yesNoOptions.map((opt) => (
            <label key={opt} className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer`}>
              <input type="radio" name={`${isMobile ? "m" : "dt"}-claim`} className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.claimAssistance === opt} onChange={() => updateForm("claimAssistance", opt)} />
              {opt}
            </label>
          ))}
        </div>
      </F>
    </>
  );

  // ── STEP 5: Verification ──
  if (step === 5) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Bank Employee Verification</h3>
      </div>
      <F label="Employee ID Card" required hint="PDF only (Max 5MB)" error={errors.employeeIdCardVerify}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("employeeIdCardVerify") ? "border-red-400" : "border-teal-300"}`} {...errAttr("employeeIdCardVerify")}>
          <input type="file" accept=".pdf" className="hidden" id={`${isMobile ? "m" : "dt"}-bank-ins-idverify`} onChange={(e) => handleDocumentUpload("employeeIdCardVerify", e)} />
          <label htmlFor={`${isMobile ? "m" : "dt"}-bank-ins-idverify`} className="cursor-pointer flex flex-col items-center">
            <span className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>📄</span>
            <span className={`${isMobile ? "text-[10px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload Employee ID Card</span>
            <span className={`${isMobile ? "text-[9px]" : "text-[11px]"} text-gray-400`}>PDF only (Max 5MB)</span>
          </label>
        </div>
        {formData.employeeIdCardVerify && <p className={`${isMobile ? "text-[10px]" : "text-[13px]"} text-green-600 mt-1`}>✓ {formData.employeeIdCardVerify.name}</p>}
      </F>
      <F label="Bank Authorization Letter" hint="PDF only (Max 5MB)" error={errors.bankAuthLetter}>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError("bankAuthLetter") ? "border-red-400" : "border-teal-300"}`} {...errAttr("bankAuthLetter")}>
          <input type="file" accept=".pdf" className="hidden" id={`${isMobile ? "m" : "dt"}-bank-ins-authletter`} onChange={(e) => handleDocumentUpload("bankAuthLetter", e)} />
          <label htmlFor={`${isMobile ? "m" : "dt"}-bank-ins-authletter`} className="cursor-pointer flex flex-col items-center">
            <span className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>📄</span>
            <span className={`${isMobile ? "text-[10px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload Authorization Letter</span>
          </label>
        </div>
        {formData.bankAuthLetter && <p className={`${isMobile ? "text-[10px]" : "text-[13px]"} text-green-600 mt-1`}>✓ {formData.bankAuthLetter.name}</p>}
      </F>
      <label className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer mb-2 mt-2`}>
        <input type="checkbox" className={`accent-[#00695C] ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.officialEmailVerify} onChange={() => updateForm("officialEmailVerify", !formData.officialEmailVerify)} />
        Official Email Verification
      </label>
      <F label="Employee Joining Date" error={errors.joiningDate}>
        <input
          className={inputCls("joiningDate")}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={formData.joiningDate}
          onChange={(e) => updateForm("joiningDate", e.target.value)}
          onBlur={() => handleBlur("joiningDate")}
          {...errAttr("joiningDate")}
        />
      </F>
      <F label="Reporting Manager Name" error={errors.managerName}>
        <input
          className={inputCls("managerName")}
          value={formData.managerName}
          onChange={(e) => updateForm("managerName", e.target.value)}
          onBlur={() => handleBlur("managerName")}
          {...errAttr("managerName")}
        />
      </F>
      <F label="Reporting Manager Employee ID" error={errors.managerEmployeeId}>
        <input
          className={inputCls("managerEmployeeId")}
          value={formData.managerEmployeeId}
          onChange={(e) => updateForm("managerEmployeeId", e.target.value)}
          onBlur={() => handleBlur("managerEmployeeId")}
          {...errAttr("managerEmployeeId")}
        />
      </F>
      <label className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer mt-1`}>
        <input type="checkbox" className={`accent-[#00695C] ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.branchManagerApproval} onChange={() => updateForm("branchManagerApproval", !formData.branchManagerApproval)} />
        Branch Manager Approval
      </label>
    </>
  );

  // ── STEP 6: Documents ──
  if (step === 6) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Documents</h3>
      </div>
      <p className={`${isMobile ? "text-[10px]" : "text-[12px]"} text-gray-400 mb-2`}>PDF only (Max 5MB each)</p>
      {[
        { key: "employeeIdCard", label: "Employee ID Card", req: true },
        { key: "bankAuthDoc", label: "Bank Authorization / Appointment Proof", req: false },
        { key: "insuranceAuthDoc", label: "Insurance Authorization / Certification", req: false },
        { key: "otherDocs", label: "Other Supporting Documents", req: false },
      ].map(({ key, label, req }) => (
        <F key={key} label={label} required={req} error={errors[key]}>
          <div className={`border-2 border-dashed rounded-xl p-3 text-center hover:bg-green-50 ${hasError(key) ? "border-red-400" : "border-teal-300"}`} {...errAttr(key)}>
            <input type="file" accept=".pdf" className="hidden" id={`${isMobile ? "m" : "dt"}-bank-ins-${key}`} onChange={(e) => handleDocumentUpload(key, e)} />
            <label htmlFor={`${isMobile ? "m" : "dt"}-bank-ins-${key}`} className="cursor-pointer flex flex-col items-center">
              <span className={`${isMobile ? "text-xl" : "text-2xl"} mb-1`}>📄</span>
              <span className={`${isMobile ? "text-[10px]" : "text-[12px]"} font-semibold text-[#00695C]`}>Upload {label}</span>
            </label>
          </div>
          {formData[key] && <p className={`${isMobile ? "text-[10px]" : "text-[13px]"} text-green-600 mt-1`}>✓ {formData[key].name}</p>}
        </F>
      ))}
    </>
  );

  // ── STEP 7: Login Details ──
  if (step === 7) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Login Details</h3>
      </div>
      <F label="Official Email ID" required error={errors.loginEmail}>
        <input
          className={inputCls("loginEmail")}
          type="email"
          value={formData.loginEmail}
          onChange={(e) => updateForm("loginEmail", e.target.value)}
          onBlur={() => handleBlur("loginEmail")}
          {...errAttr("loginEmail")}
        />
      </F>
      <F label="Username" error={errors.username}>
        <input
          className={inputCls("username")}
          value={formData.username}
          onChange={(e) => updateForm("username", e.target.value)}
          onBlur={() => handleBlur("username")}
          {...errAttr("username")}
        />
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#00695C]"
          >
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
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#00695C]"
          >
            {showConfirmPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
      </F>
      <label className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer mb-2`}>
        <input type="checkbox" className={`accent-[#00695C] ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.otpVerification} onChange={() => updateForm("otpVerification", !formData.otpVerification)} />
        OTP Verification
      </label>
      <label className={`flex items-center gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer`}>
        <input type="checkbox" className={`accent-[#00695C] ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.twoFA} onChange={() => updateForm("twoFA", !formData.twoFA)} />
        Two-Factor Authentication
      </label>
    </>
  );

  // ── STEP 8: Declaration ──
  if (step === 8) return (
    <>
      <div className={headerClass}>
        <div className={`${barClass} bg-[#00695C] rounded`} />
        <h3 className={h3Class}>Declaration</h3>
      </div>
      <p className={`${isMobile ? "text-[11px]" : "text-[13px]"} text-gray-600 mb-3 leading-relaxed`}>
        Please read and confirm the following before submitting:
      </p>
      <label
        className={`flex items-start gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer mb-2`}
        {...errAttr("accepted")}
      >
        <input type="checkbox" className={`accent-[#00695C] mt-0.5 ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.accepted} onChange={() => updateForm("accepted", !formData.accepted)} />
        <span>I confirm that I am an authorized employee/representative of the bank.</span>
      </label>
      {errors.accepted && (
        <p className="text-[10px] text-red-500 mb-1 font-medium" data-field-error="true">{errors.accepted}</p>
      )}
      <label
        className={`flex items-start gap-2 ${isMobile ? "text-[11px]" : "text-[13px]"} cursor-pointer mb-2`}
        {...errAttr("agreeLeads")}
      >
        <input type="checkbox" className={`accent-[#00695C] mt-0.5 ${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} checked={formData.agreeLeads} onChange={() => updateForm("agreeLeads", !formData.agreeLeads)} />
        <span>The information provided is accurate and complete. I agree to receive customer insurance requirements through the platform.</span>
      </label>
      {errors.agreeLeads && (
        <p className="text-[10px] text-red-500 mb-1 font-medium" data-field-error="true">{errors.agreeLeads}</p>
      )}
      <p className={`${isMobile ? "text-[10px]" : "text-[12px]"} text-gray-500 leading-relaxed mt-3`}>
        I agree to the platform Terms &amp; Conditions and Privacy Policy.
      </p>
    </>
  );

  return null;
}