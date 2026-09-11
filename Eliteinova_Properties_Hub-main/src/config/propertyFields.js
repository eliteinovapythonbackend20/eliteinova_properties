// src/config/propertyFields.js
//
// Canonical camelCase field vocabulary shared by every filter component adapter
// (src/adapters/filterAdapters.js) and the property card. It mirrors the backend's
// PropertyFilter schema (realestate/app/schemas/property_filter.py) - every name
// here maps to a real column on BaseProperty. Keeping this list in one place is
// what lets ~90 differently-shaped filter panels all "speak the same language"
// without needing to rewrite each panel's UI.

export const PROPERTY_CATEGORY = {
  INDIVIDUAL: 'INDIVIDUAL',
  APARTMENT: 'APARTMENT',
  COMMERCIAL: 'COMMERCIAL',
  LAND_PLOT: 'LAND_PLOT',
  HOSTEL: 'HOSTEL',
};

export const LISTING_PURPOSE = {
  RENT: 'RENT',
  SELL: 'SELL',
  LEASE: 'LEASE',
};

export const POSTED_BY = {
  OWNER: 'OWNER',
  AGENT: 'AGENT',
  BUILDER: 'BUILDER',
  PROPERTY_MANAGEMENT: 'PROPERTY_MANAGEMENT',
};

// Tab label -> canonical listingPurpose. Every filter panel's "Buy/Rent/Lease/Sell"
// tab strip should resolve through this instead of hand-rolling its own mapping.
export const TAB_TO_PURPOSE = {
  Buy: LISTING_PURPOSE.SELL,
  Sell: LISTING_PURPOSE.SELL,
  Rent: LISTING_PURPOSE.RENT,
  Lease: LISTING_PURPOSE.LEASE,
};

// Every field the backend PropertyFilter understands, and its shape. Adapters
// use this only as documentation/typing today; coerceFilterTypes() below is what
// actually normalizes values before a request is sent.
export const CANONICAL_FILTER_FIELDS = {
  propertyCategory: 'enum',
  listingPurpose: 'enum',
  postedBy: 'array',
  propertyType: 'string',
  subCategory: 'string',
  preferredLocation: 'string',
  city: 'string',
  state: 'string',
  pincode: 'string',
  bedrooms: 'array',
  bathrooms: 'array',
  furnishingStatus: 'enum',
  facingDirection: 'enum',
  parking: 'string',
  price: 'range',
  securityDeposit: 'range',
  maintenance: 'range',
  builtUpArea: 'range',
  carpetArea: 'range',
  landArea: 'range',
  areaUnit: 'enum',
  amenities: 'array',
  interiorFeatures: 'array',
  applianceIncluded: 'array',
  selectedFeature: 'array',
  roomType: 'array',
  sharingType: 'array',
  tenantType: 'array',
  petFriendly: 'yesno',
  gardenSpace: 'yesno',
  terrace: 'yesno',
  balcony: 'yesno',
  smokingAllowed: 'yesno',
  foodIncluded: 'yesno',
  kitchenAccess: 'yesno',
  utilitiesIncluded: 'yesno',
  electricityAvailable: 'yesno',
  ownershipType: 'enum',
  propertyAge: 'int',
  propertyCondition: 'enum',
  loanOutstanding: 'yesno',
  availableFrom: 'date',
  minimumDuration: 'string',
  commercialType: 'enum',
  businessType: 'enum',
  zoningType: 'enum',
  estimatedFootfall: 'enum',
  hostelType: 'enum',
  hostelCategory: 'enum',
  genderType: 'enum',
  bathroomType: 'enum',
  foodType: 'enum',
  landShape: 'enum',
  soilType: 'enum',
  waterSource: 'enum',
  page: 'int',
  limit: 'int',
  sortBy: 'string',
  sortOrder: 'string',
};

const isEmpty = (v) =>
  v === null ||
  v === undefined ||
  v === '' ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

const toNumber = (v) => {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return Number.isNaN(n) ? undefined : n;
};

// Normalizes a range-shaped value ({min,max} or two separate scalars already
// merged by an adapter) into {min, max} with real numbers, dropping the key
// entirely if both ends are empty.
export const toRange = (min, max) => {
  const range = {};
  const nMin = toNumber(min);
  const nMax = toNumber(max);
  if (nMin !== undefined) range.min = nMin;
  if (nMax !== undefined) range.max = nMax;
  return Object.keys(range).length ? range : undefined;
};

// Final pass every adapter should run on its output before handing it to
// usePropertyFilter. Coerces types per CANONICAL_FILTER_FIELDS and strips
// anything empty (cleanFilters does a second, more generic pass afterwards).
export function coerceFilterTypes(payload) {
  const out = {};
  Object.entries(payload || {}).forEach(([key, value]) => {
    if (isEmpty(value)) return;
    const type = CANONICAL_FILTER_FIELDS[key];

    if (type === 'array') {
      out[key] = Array.isArray(value) ? value : [value];
      return;
    }
    if (type === 'int') {
      const n = toNumber(value);
      if (n !== undefined) out[key] = Math.trunc(n);
      return;
    }
    if (type === 'range') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const r = toRange(value.min, value.max);
        if (r) out[key] = r;
      }
      return;
    }
    out[key] = value;
  });
  return out;
}
