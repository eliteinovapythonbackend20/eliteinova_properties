// src/config/contactPrefillMap.js
//
// Maps each posting role's own formData field names onto the wire field the
// vendor's VendorProfile response (GET /profile/{vendor_type}, see
// profileService.js's getMyProfile) actually returns that value under -
// confirmed directly against app/schemas/vendor_profile_details.py and
// ProfileService._to_profile_response, not assumed. Field names are NOT the
// same across roles (e.g. Agent's RERA field is reraRegistrationNumber,
// Builder/PM's is reraNumber; Owner has no company/RERA/GST/experience
// concept at all), so each role gets its own map rather than one shared one.
//
// Keyed by the role string each form already knows about itself (not the
// VendorType route param - that's handled by useReusableResources itself).

export const CONTACT_PREFILL_MAP = {
  agent: {
    fullName: 'fullName',
    mobileNumber: 'phoneNumber',
    emailId: 'emailAddress',
    gender: 'gender',
    agencyName: 'companyName',
    reraNumber: 'reraRegistrationNumber',
    gstNumber: 'gstNumber',
    yearsExperience: 'yearsOfExperience',
    officeAddress: 'officeAddress',
    // Profile stores this as one comma-separated string (see AgentProfile.jsx's
    // own free-text "Service Areas" input); the posting forms' multi-select
    // needs an array instead - FIELD_TRANSFORMS.serviceAreas splits it.
    serviceAreas: 'serviceAreas',
    // Identity verification - only the LandAndPlots agent forms render these
    // two as typed fields (every other agent category handles Aadhaar/PAN
    // purely through document upload/reuse) - harmless no-op elsewhere since
    // those forms simply never read formData.aadhaarNumber/panNumber back out.
    aadhaarNumber: 'aadhaarNumber',
    panNumber: 'panNumber',
    // Bank details
    accountHolderName: 'accountHolderName',
    bankName: 'bankName',
    accountNumber: 'accountNumber',
    ifscCode: 'ifscCode',
    upiId: 'upiId',
    // Social media - ProfileService._to_profile_response sends this one back
    // as 'linkedIn' (capital I), not the form's own 'linkedin' field name.
    website: 'website',
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedIn',
    youtube: 'youtube',
  },
  builder: {
    authFullName: 'fullName',
    authMobile: 'phoneNumber',
    authWhatsapp: 'whatsappNumber',
    authEmail: 'emailAddress',
    authDesignation: 'authDesignation',
    companyName: 'companyName',
    companyRegNumber: 'companyRegNumber',
    // Company's own site - distinct from the social 'website' field below
    // (see app.schemas.vendor_profile_details.BuilderProfileExtra.company_website).
    companyWebsite: 'companyWebsite',
    companyProfile: 'companyProfile',
    reraNumber: 'reraNumber',
    gstNumber: 'gstNumber',
    yearsOfExperience: 'yearsOfExperience',
    officeAddress: 'officeAddress',
    officeCity: 'officeCity',
    officeDistrict: 'officeDistrict',
    officeState: 'officeState',
    officePinCode: 'officePinCode',
    officeLandmark: 'officeLandmark',
    // Identity verification
    aadhaarNumber: 'aadhaarNumber',
    panNumber: 'panNumber',
    // Bank details
    accountHolderName: 'accountHolderName',
    bankName: 'bankName',
    accountNumber: 'accountNumber',
    ifscCode: 'ifscCode',
    upiId: 'upiId',
    // Social media - ProfileService._to_profile_response sends this one back
    // as 'linkedIn' (capital I), not the form's own 'linkedin' field name.
    website: 'website',
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedIn',
    youtube: 'youtube',
  },
  owner: {
    // Owner has no designation/company/RERA/GST/experience concept at all -
    // deliberately not in this map, there is nothing on either side to match.
    ownerName: 'fullName',
    contactNumber: 'phoneNumber',
    emailId: 'emailAddress',
    addressLine1: 'address',
    ownerCity: 'city',
    ownerDistrict: 'district',
    ownerState: 'state',
    ownerPinCode: 'pinCode',
    gender: 'gender',
    // ProfileService._to_profile_response sends the same aadhar_number column
    // under BOTH 'aadharNumber' (legacy spelling) and 'aadhaarNumber' - every
    // other reader in this app (OwnerProfile.jsx's own edit form included)
    // uses the two-a 'aadhaarNumber' spelling, so that's the one read here too.
    aadhaarNumber: 'aadhaarNumber',
    panNumber: 'panNumber',
    accountHolderName: 'accountHolderName',
    bankName: 'bankName',
    accountNumber: 'accountNumber',
    ifscCode: 'ifscCode',
    upiId: 'upiId',
  },
  propertyManagement: {
    authFullName: 'fullName',
    authMobile: 'phoneNumber',
    authWhatsapp: 'whatsappNumber',
    authEmail: 'emailAddress',
    authDesignation: 'authDesignation',
    pmCompanyName: 'companyName',
    pmBusinessRegNumber: 'businessRegNumber',
    // Company's own site - distinct from the social 'website' field below
    // (see app.schemas.vendor_profile_details.PropertyManagementProfileExtra.company_website).
    pmCompanyWebsite: 'companyWebsite',
    pmCompanyDescription: 'companyDescription',
    pmReraNumber: 'reraNumber',
    pmGstNumber: 'gstNumber',
    pmYearsOfExperience: 'yearsOfExperience',
    officeAddress: 'officeAddress',
    officeCity: 'officeCity',
    officeDistrict: 'officeDistrict',
    officeState: 'officeState',
    officePinCode: 'officePinCode',
    officeLandmark: 'officeLandmark',
    // Identity verification
    aadhaarNumber: 'aadhaarNumber',
    panNumber: 'panNumber',
    // Bank details
    accountHolderName: 'accountHolderName',
    bankName: 'bankName',
    accountNumber: 'accountNumber',
    ifscCode: 'ifscCode',
    upiId: 'upiId',
    // Social media - ProfileService._to_profile_response sends this one back
    // as 'linkedIn' (capital I), not the form's own 'linkedin' field name.
    website: 'website',
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedIn',
    youtube: 'youtube',
  },
};

// An empty array counts as blank too - the posting forms' multi-selects
// (e.g. serviceAreas) initialise formData to [], and that must still be
// treated as "nothing picked yet" or buildPrefillValues below would think
// the field is already filled and never prefill it.
const isBlank = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

// A handful of mapped fields aren't plain text: the posting form renders
// them as a fixed set of options (gender radios, the bank-name <select>),
// but the Profile page stores the matching value as free text - so a saved
// "male"/"MALE"/"Male" or "sbi"/"State Bank Of India" has to be canonicalised
// to the exact option string the form checks against, or the field silently
// looks "not prefilled" even though formData does hold a value (nothing in
// the option list matches it, so no radio/option ever shows selected).
// Keyed by the FORM field name, not the profile field name, so it applies
// automatically wherever a role's map reuses one of these names.
const GENDER_CANON = { male: 'Male', m: 'Male', female: 'Female', f: 'Female', other: 'Other', others: 'Other', o: 'Other' };
const normalizeGender = (raw) => GENDER_CANON[String(raw).trim().toLowerCase()];

// Must match the bankOptions list the posting forms render exactly.
const BANK_OPTIONS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Kotak Mahindra Bank', 'IndusInd Bank', 'Other'];
const BANK_LOOKUP = new Map(BANK_OPTIONS.map((b) => [b.toLowerCase(), b]));
const normalizeBankName = (raw) => BANK_LOOKUP.get(String(raw).trim().toLowerCase());

// The profile stores/displays Aadhaar with spaces between the 4-digit groups
// (e.g. "1234 5678 9012"), but every posting form's own input strips to
// digits-only on every keystroke (.replace(/\D/g, "")) and then validates
// against /^[0-9]{12}$/ - prefilling the spaced form silently fails that
// check. Strip to digits the same way; if that doesn't leave exactly 12,
// the value is malformed and not worth prefilling.
const normalizeAadhaarNumber = (raw) => {
  const digits = String(raw).replace(/\D/g, '');
  return digits.length === 12 ? digits : undefined;
};

// Capitalizes each word, matching how the posting forms' own "add a new
// service area" option capitalizes whatever the vendor types (see
// toTitleCase in the Agent forms' SearchableMultiSelect) - a prefilled area
// should look the same as one picked/typed directly in the form.
const toTitleCase = (text) =>
  text.trim().replace(/\s+/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

// The profile stores this as one free-text, comma-separated string (see
// AgentProfile.jsx's "Service Areas" input - placeholder "e.g. Mumbai, Pune,
// Navi Mumbai"), but the posting forms' service-area field is a multi-select
// backed by an array. Split on commas, drop empties, title-case each one so
// it reads the same as a freshly-typed/picked entry.
const normalizeServiceAreas = (raw) => {
  const areas = String(raw).split(',').map((a) => a.trim()).filter(Boolean).map(toTitleCase);
  return areas.length ? areas : undefined;
};

// A transform returning undefined means "couldn't confidently map it" - the
// field is then left blank (same as if the profile never had it), rather
// than forcing a radio/option selection that doesn't match what the vendor
// actually saved.
const FIELD_TRANSFORMS = {
  gender: normalizeGender,
  bankName: normalizeBankName,
  aadhaarNumber: normalizeAadhaarNumber,
  serviceAreas: normalizeServiceAreas,
};

/**
 * Builds the subset of prefill values to merge into formData when the vendor
 * picks "self" - only for mapped fields that are both (a) still empty in the
 * current form (never clobbers something the user already typed, including
 * a value this same prefill already set and the user then edited) and
 * (b) actually present on the profile (partial/missing profile data simply
 * means fewer fields come back, never a crash or a blank-string overwrite).
 *
 * @param {object|null|undefined} profile - the flat profile object from
 *   getMyProfile(role).profile (or null while loading/absent)
 * @param {'agent'|'builder'|'owner'|'propertyManagement'} role
 * @param {object} formData - the form's current state, checked so an
 *   already-filled or already-edited field is never overwritten
 * @returns {object} a plain object of only the fields that should be merged
 *   into formData right now; empty object if there's nothing to prefill
 */
export function buildPrefillValues(profile, role, formData) {
  const map = CONTACT_PREFILL_MAP[role];
  if (!profile || !map) return {};
  const result = {};
  for (const [formField, profileField] of Object.entries(map)) {
    if (!isBlank(formData?.[formField])) continue; // never overwrite a filled/edited field
    let value = profile[profileField];
    if (isBlank(value)) continue; // nothing on the profile to prefill from
    const transform = FIELD_TRANSFORMS[formField];
    if (transform) {
      value = transform(value);
      if (isBlank(value)) continue; // couldn't confidently map it - leave the field blank
    }
    result[formField] = value;
  }
  return result;
}
