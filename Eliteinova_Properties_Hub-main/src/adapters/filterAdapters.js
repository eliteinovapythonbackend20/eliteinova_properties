// src/adapters/filterAdapters.js
//
// Each of the ~90 filter panel components (src/components/filters/**) has its own
// ad-hoc field names and shapes because they were built independently per property
// family. Rather than rewrite every panel's UI, each family gets one adapter here
// that maps whatever that family's "Apply" handler already produces onto the
// canonical field vocabulary (src/config/propertyFields.js), which is what the
// backend's PropertyFilter schema actually understands.
//
// usage: toCanonicalFilter('apartment', rawFiltersFromPanel, { activeTab })

import { coerceFilterTypes, toRange, TAB_TO_PURPOSE } from '../config/propertyFields';

const purposeFromTab = (tab) => TAB_TO_PURPOSE[tab] || undefined;

const pick = (obj, ...keys) => {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
  }
  return undefined;
};

// ---------------------------------------------------------------------------
// Apartment (RentalApartmentFilter, LeaseApartmentFilter, OfficeSpace-style
// once made controlled, etc.) - flat camelCase with *Min/*Max range pairs.
// ---------------------------------------------------------------------------
function fromApartment(raw = {}, ctx = {}) {
  const purpose = raw.listingPurpose || purposeFromTab(raw.activeTab || ctx.activeTab);
  return {
    propertyCategory: 'APARTMENT',
    listingPurpose: purpose,
    city: raw.city,
    preferredLocation: pick(raw, 'area', 'locality', 'landmark'),
    pincode: raw.pincode || raw.pinCode,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    furnishingStatus: raw.furnishing || raw.furnishingType,
    facingDirection: raw.facingDirection,
    parking: raw.parking,
    price: toRange(
      pick(raw, 'minRent', 'minPrice', 'minSellPrice', 'minLeaseAmount'),
      pick(raw, 'maxRent', 'maxPrice', 'maxSellPrice', 'maxLeaseAmount')
    ),
    securityDeposit: toRange(raw.securityDeposit, raw.securityDeposit),
    builtUpArea: toRange(raw.builtUpAreaMin, raw.builtUpAreaMax),
    carpetArea: toRange(raw.carpetAreaMin, raw.carpetAreaMax),
    amenities: raw.selectedAmenities || raw.amenities,
    tenantType: raw.tenantType,
    petFriendly: raw.petFriendly,
    smokingAllowed: raw.smokingAllowed,
    ownershipType: raw.ownershipType,
    propertyCondition: raw.propertyCondition,
    availableFrom: raw.availableFrom,
    minimumDuration: pick(raw, 'minimumRentalDuration', 'minRentalDuration', 'leaseDuration'),
  };
}

// ---------------------------------------------------------------------------
// Commercial (OfficeSpaceFilter and siblings) - controlled `filters` object,
// Apply sends { ...filters, purpose: currentTab }.
// ---------------------------------------------------------------------------
function fromCommercial(raw = {}, ctx = {}) {
  const purpose = purposeFromTab(raw.purpose || ctx.activeTab);
  return {
    propertyCategory: 'COMMERCIAL',
    listingPurpose: purpose,
    city: raw.city,
    preferredLocation: pick(raw, 'locality', 'landmark'),
    pincode: raw.pincode,
    facingDirection: raw.facingDirection,
    ownershipType: raw.ownershipType,
    furnishingStatus: raw.furnishingType,
    price: toRange(
      pick(raw, 'minRent', 'minPrice', 'minLeaseAmount'),
      pick(raw, 'maxRent', 'maxPrice', 'maxLeaseAmount')
    ),
    securityDeposit: toRange(raw.securityDeposit, raw.securityDeposit),
    maintenance: toRange(raw.maintenanceCharges, raw.maintenanceCharges),
    builtUpArea: toRange(raw.builtUpAreaMin, raw.builtUpAreaMax),
    carpetArea: toRange(raw.carpetAreaMin, raw.carpetAreaMax),
    propertyAge: pick(raw, 'propertyAge'),
    minimumDuration: pick(raw, 'minRentalDuration', 'leaseDuration'),
    availableFrom: raw.availableFrom,
    amenities: raw.selectedAmenities,
  };
}

// ---------------------------------------------------------------------------
// Land & Plots (ResidentialPlotFilter and siblings) - controlled `filters`
// object, Apply sends { ...filters, purpose, propertyType }.
// ---------------------------------------------------------------------------
function fromLand(raw = {}, ctx = {}) {
  const purpose = purposeFromTab(raw.purpose || ctx.activeTab);
  return {
    propertyCategory: 'LAND_PLOT',
    listingPurpose: purpose,
    propertyType: raw.propertyType,
    city: raw.city,
    preferredLocation: pick(raw, 'locality', 'landmark', 'layoutName'),
    pincode: raw.pincode,
    facingDirection: raw.facing,
    landShape: raw.plotShape || raw.plotShapePreference,
    waterSource: raw.waterConnection,
    landArea: toRange(raw.plotArea, raw.plotArea),
    areaUnit: raw.plotAreaUnit,
    price: toRange(
      pick(raw, 'minPrice', 'minSellPrice', 'minRent', 'minLeaseAmount'),
      pick(raw, 'maxPrice', 'maxSellPrice', 'maxRent', 'maxLeaseAmount')
    ),
    securityDeposit: toRange(raw.securityDeposit, raw.securityDeposit),
    minimumDuration: pick(raw, 'minRentalDuration', 'leaseDuration'),
    availableFrom: raw.availableFrom,
  };
}

// ---------------------------------------------------------------------------
// Hostel (BoysHostelFilter and siblings) - controlled `filters` object,
// Apply sends { ...filters, purpose, propertyType }.
// ---------------------------------------------------------------------------
function fromHostel(raw = {}, ctx = {}) {
  const purpose = purposeFromTab(raw.purpose || ctx.activeTab) || 'RENT';
  return {
    propertyCategory: 'HOSTEL',
    listingPurpose: purpose,
    hostelType: raw.propertyType,
    city: raw.city,
    preferredLocation: pick(raw, 'locality', 'landmark', 'distanceFrom'),
    sharingType: raw.sharingType,
    roomType: raw.roomType ? [raw.roomType] : undefined,
    bathroomType: raw.bathroomType,
    furnishingStatus: raw.furnishing,
    amenities: raw.amenities,
    foodIncluded: raw.foodIncluded,
    foodType: raw.foodType,
    kitchenAccess: raw.kitchenAccess,
    price: toRange(
      pick(raw, 'minRent', 'minPrice', 'minLeaseAmount'),
      pick(raw, 'maxRent', 'maxPrice', 'maxLeaseAmount')
    ),
    securityDeposit: toRange(raw.securityDeposit, raw.securityDeposit),
    minimumDuration: pick(raw, 'minStayDuration', 'leaseDuration'),
    availableFrom: raw.availableFrom,
  };
}

// ---------------------------------------------------------------------------
// Individual (IndependentHouseFilter and siblings) - many separate useStates,
// Apply builds listingPurpose already UPPERCASE + nested {min,max} ranges.
// ---------------------------------------------------------------------------
function fromIndividual(raw = {}, ctx = {}) {
  const purpose = raw.listingPurpose || purposeFromTab(ctx.activeTab);
  return {
    propertyCategory: 'INDIVIDUAL',
    listingPurpose: purpose,
    propertyType: raw.propertyType,
    preferredLocation: raw.preferredLocation,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    furnishingStatus: raw.furnishingType,
    parking: raw.parking,
    gardenSpace: raw.gardenSpace,
    terrace: raw.terrace,
    petFriendly: raw.petFriendly,
    ownershipType: raw.ownershipType,
    price: toRange(
      pick(raw.budgetRange, 'min') ?? pick(raw.monthlyRentBudget, 'min') ?? pick(raw.leaseBudget, 'min'),
      pick(raw.budgetRange, 'max') ?? pick(raw.monthlyRentBudget, 'max') ?? pick(raw.leaseBudget, 'max')
    ),
    securityDeposit: toRange(raw.securityDeposit?.min, raw.securityDeposit?.max),
    builtUpArea: toRange(raw.builtupArea?.min, raw.builtupArea?.max),
    landArea: toRange(raw.plotSize?.min, raw.plotSize?.max),
    availableFrom: raw.moveInDate,
    minimumDuration: raw.rentalDuration || raw.leaseDuration,
    amenities: raw.amenities,
  };
}

const ADAPTERS = {
  apartment: fromApartment,
  commercial: fromCommercial,
  land: fromLand,
  hostel: fromHostel,
  individual: fromIndividual,
};

/**
 * @param {'apartment'|'commercial'|'land'|'hostel'|'individual'} family
 * @param {object} rawFilters - whatever the family's filter panel Apply handler produced
 * @param {object} [ctx] - extra context the panel didn't include in raw (e.g. activeTab)
 */
export function toCanonicalFilter(family, rawFilters, ctx = {}) {
  const adapter = ADAPTERS[family];
  if (!adapter) {
    console.warn(`toCanonicalFilter: unknown family "${family}", passing filters through unmapped`);
    return coerceFilterTypes(rawFilters);
  }
  return coerceFilterTypes(adapter(rawFilters || {}, ctx));
}

export default toCanonicalFilter;
