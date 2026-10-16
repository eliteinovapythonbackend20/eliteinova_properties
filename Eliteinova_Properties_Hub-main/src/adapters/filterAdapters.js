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

// price_negotiable is stored as "Negotiable"/"Fixed Price" (see
// field_mapping_service.py's _convert_negotiable), but every "Negotiable?"
// field on the Apartment panels (Rent/Buy/Lease each have their own raw key)
// asks it as a plain Yes/No radio - translate rather than send the radio's
// own word through unchanged, since the backend never sees "Yes"/"No" here.
const toNegotiable = (v) => (v === 'Yes' ? 'Negotiable' : v === 'No' ? 'Fixed' : v);

// Some Commercial filter panels ask a Yes/No concept with a radio ('Yes'/'No'
// strings, e.g. BusinessCenterFilter); others ask the exact same concept with a
// plain checkbox (true/false booleans, e.g. OfficeSpaceFilter/RetailShopFilter).
// Sending the checkbox's literal `false` straight through 422'd every one of
// these fields - the backend's Optional[str] fields reject a raw JSON boolean.
// An unchecked box means "not set" here, the same as an empty radio.
const yn = (v) => (v === true ? 'Yes' : v === false ? undefined : v);

// The Commercial posting forms (Agent/Builder/PropertyManagement - see
// RentAgentComForm.jsx's commercialRentAmenities, identical across Rent/Lease/
// Sell) store amenities as this fixed 12-id vocabulary. Every Commercial filter
// panel instead asks each of these as its own differently-spelled boolean
// checkbox (OfficeSpaceFilter's "cctv"/"centralAC"/"security24x7" vs
// BusinessCenterFilter's "cctvSurveillance"/"airConditioning"/
// "twentyFourSevenSecurity" for the exact same concepts) - checking the box
// never produced anything resembling what the posting form actually stored, so
// it could never have matched a single real property. This maps every spelling
// found across the family onto the one id the posting forms use.
//
// Known limitation, not something this mapping can fix: the Owner role's
// Commercial posting forms (ComRentForm.jsx etc.) store amenities as a third,
// completely different vocabulary - human-readable labels like "24/7 Security"
// rather than an id like "security247". The backend's amenities filter requires
// an exact match per selected item (Postgres JSONB "contains", one AND per
// item - see filter_service.py's "JSONB contains all selected"), so a checkbox
// here can only ever match Agent/Builder/PropertyManagement-posted listings,
// never Owner-posted ones. Fixing that needs either a backend alias-aware
// match or a data migration normalizing stored amenities to one vocabulary -
// both out of scope for an adapter fix.
const COMMERCIAL_AMENITY_ALIASES = {
  powerBackup: 'powerBackup', generatorBackup: 'powerBackup',
  security24x7: 'security247', twentyFourSevenSecurity: 'security247', security247: 'security247',
  cctv: 'cctv', cctvSurveillance: 'cctv',
  visitorParking: 'visitorParking',
  wifi: 'wifi', internetBroadband: 'wifi', highSpeedInternet: 'wifi', fiberInternet: 'wifi',
  lift: 'lift', liftEscalator: 'lift',
  fireSafety: 'fireSafety', fireSafetySystem: 'fireSafety', fireSafetyApproved: 'fireSafety',
  ac: 'ac', centralAC: 'ac', airConditioning: 'ac', centralizedAc: 'ac',
  pantry: 'pantry', pantryCafeteria: 'pantry', cafeteria: 'pantry', cafeteriaFoodCourt: 'pantry',
  loadingDock: 'loadingDock', loadingUnloading: 'loadingDock', loadingUnloadingAccess: 'loadingDock',
  signage: 'signage', signageSpace: 'signage',
  conference: 'conference', conferenceHall: 'conference', meetingRooms: 'conference', cabinMeetingRooms: 'conference',
};

function collectCommercialAmenities(raw) {
  const found = [];
  for (const [rawKey, canonicalId] of Object.entries(COMMERCIAL_AMENITY_ALIASES)) {
    if ((raw[rawKey] === true || raw[rawKey] === 'Yes') && !found.includes(canonicalId)) {
      found.push(canonicalId);
    }
  }
  return found.length ? found : undefined;
}

// ---------------------------------------------------------------------------
// Apartment (RentalApartmentFilter, LeaseApartmentFilter, OfficeSpace-style
// once made controlled, etc.) - flat camelCase with *Min/*Max range pairs.
// ---------------------------------------------------------------------------
function fromApartment(raw = {}, ctx = {}) {
  const purpose = raw.listingPurpose || purposeFromTab(raw.activeTab || ctx.activeTab);
  return {
    propertyCategory: 'APARTMENT',
    listingPurpose: purpose,
    propertyType: raw.propertyType,
    // filter_service.py compares this against an upper-cased posted_by column
    // (func.upper(Property.posted_by).in_(filters.posted_by)), so the panel's
    // title-case "Owner"/"Agent"/"Builder" option has to be upper-cased here -
    // the backend does not do it for us. "Listing Type" and "Contact via" are
    // the same Owner/Agent/Builder taxonomy on two different sections of the
    // panel, so either one can supply it.
    postedBy: pick(raw, 'listingType', 'contactVia')?.toUpperCase(),
    city: raw.city,
    preferredLocation: pick(raw, 'area', 'locality'),
    landmark: raw.landmark,
    nearbyConnectivity: raw.nearbyConnectivity,
    pincode: raw.pincode || raw.pinCode,
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    furnishingStatus: raw.furnishing || raw.furnishingType,
    facingDirection: raw.facingDirection,
    parking: raw.parking,
    floorNumber: raw.floorNumber,
    totalFloors: raw.totalFloors,
    balcony: yn(raw.balcony),
    propertyAge: raw.propertyAge,
    price: toRange(
      pick(raw, 'minRent', 'minPrice', 'minSellPrice', 'minLeaseAmount'),
      pick(raw, 'maxRent', 'maxPrice', 'maxSellPrice', 'maxLeaseAmount')
    ),
    // The range inputs' onMinChange also writes raw.securityDeposit (kept for
    // other, non-range callers of this adapter) but that field only ever
    // holds the min value - the real max lives in securityDepositMax, so
    // reading raw.securityDeposit for both ends silently collapsed every
    // security-deposit range filter to {min: X, max: X}.
    securityDeposit: toRange(raw.securityDepositMin ?? raw.securityDeposit, raw.securityDepositMax ?? raw.securityDeposit),
    // maintenanceIncluded (Yes/No) is a separate column from the maintenance
    // amount range - "Maintenance / Service Charges Included" on the panel.
    // Every Apartment panel currently asks this (and the other yn()-wrapped
    // fields below) through a Yes/No RadioGroup, never a checkbox - confirmed
    // across all 9 files - but wrapping costs nothing for an already-correct
    // string and closes off the exact failure mode found on Commercial/Land
    // (a checkbox's raw `false` reaching the payload unstripped, since
    // coerceFilterTypes' isEmpty() doesn't treat false as empty) if a future
    // panel ever switches control type.
    maintenanceIncluded: yn(raw.maintenanceIncluded),
    // "Maintenance / Service Charges" on the Buy tab is a plain amount, not a
    // range, but maintenance_amount is filtered as a range on the backend -
    // same single-value-as-range treatment as securityDeposit above.
    maintenance: toRange(raw.maintenanceCharges, raw.maintenanceCharges),
    // Rent/Buy/Lease tabs each ask "negotiable" under a different raw key.
    priceNegotiable: toNegotiable(yn(pick(raw, 'rentNegotiable', 'priceNegotiable', 'leaseNegotiable'))),
    builtUpArea: toRange(raw.builtUpAreaMin, raw.builtUpAreaMax),
    carpetArea: toRange(raw.carpetAreaMin, raw.carpetAreaMax),
    // selectedAmenities now carries the posting forms' own amenity ids (e.g.
    // "gym", not "Gym") - see APARTMENT_AMENITIES in ServicedApartmentFilter.jsx.
    amenities: raw.selectedAmenities || raw.amenities,
    interiorFeatures: raw.interiorFeatures,
    applianceIncluded: raw.appliancesIncluded,
    tenantType: raw.tenantType,
    petFriendly: yn(raw.petFriendly),
    smokingAllowed: yn(raw.smokingAllowed),
    dietaryPreference: raw.dietaryPreference,
    immediateMoveIn: yn(raw.immediateMoveIn),
    nearbyPlaces: raw.nearbyAccess,
    ownershipType: raw.ownershipType,
    propertyCondition: raw.propertyCondition,
    readyToMove: yn(raw.readyToMove),
    underConstruction: yn(raw.underConstruction),
    // Buy tab calls it "Immediate Possession", Lease tab calls the same
    // concept "Immediate Occupancy" - both store to immediate_possession
    // (see field_mapping_service.py's 'immediateOccupancy' entry).
    immediatePossession: yn(pick(raw, 'immediatePossession', 'immediateOccupancy')),
    titleDeedVerified: yn(raw.titleDeedVerified),
    loanEligible: yn(raw.loanEligible),
    reraApproved: yn(raw.reraApproved),
    leaseRenewalOption: yn(raw.leaseRenewalOption),
    availableFrom: raw.availableFrom,
    minimumDuration: pick(raw, 'minimumRentalDuration', 'minRentalDuration', 'leaseDuration'),
  };
}

// ---------------------------------------------------------------------------
// Commercial (OfficeSpaceFilter and 20 siblings - BusinessCenterFilter is the
// verified reference) - every one of the 21 filter panels builds the exact
// same controlled `filters` object (same field names, same per-tab Buy/Rent/
// Lease naming split as Apartment/Individual), Apply sends
// { ...filters, purpose: currentTab, propertyType: '<fixed label>' }.
// ---------------------------------------------------------------------------
function fromCommercial(raw = {}, ctx = {}) {
  const purpose = purposeFromTab(raw.purpose || ctx.activeTab);
  return {
    propertyCategory: 'COMMERCIAL',
    listingPurpose: purpose,
    propertyType: raw.propertyType,
    // "Listing Type" is Owner/Operator/Agent/Builder checkboxes (already an
    // array) - the backend's own posted_by values are normalized/upper-cased
    // by the schema's validator, no translation needed here.
    postedBy: raw.listingType,
    city: raw.city,
    preferredLocation: raw.locality,
    landmark: raw.landmark,
    nearbyConnectivity: raw.nearbyConnectivity,
    pincode: raw.pincode,
    ownershipType: raw.ownershipType,
    furnishingStatus: raw.furnishingType,
    floorNumber: raw.floorNumber,
    totalFloors: raw.totalFloors,
    propertyAge: pick(raw, 'propertyAge'),
    price: toRange(
      pick(raw, 'minRent', 'minPrice', 'minLeaseAmount', 'minSellPrice'),
      pick(raw, 'maxRent', 'maxPrice', 'maxLeaseAmount', 'maxSellPrice')
    ),
    // Rent's "Security Deposit" and Lease's "Refundable Deposit" are each a
    // single amount, not a min/max pair - same-value-range trick as
    // Apartment/Individual's single-value deposit fields.
    securityDeposit: toRange(
      pick(raw, 'securityDeposit', 'refundableDeposit'),
      pick(raw, 'securityDeposit', 'refundableDeposit')
    ),
    maintenance: toRange(raw.maintenanceCharges, raw.maintenanceCharges),
    maintenanceIncluded: yn(raw.maintenanceIncluded),
    // Buy/Rent/Lease tabs each ask "negotiable" under their own raw key.
    priceNegotiable: toNegotiable(yn(pick(raw, 'priceNegotiable', 'rentNegotiable', 'leaseNegotiable', 'sellPriceNegotiable'))),
    propertyTax: raw.propertyTax,
    builtUpArea: toRange(raw.builtUpAreaMin, raw.builtUpAreaMax),
    carpetArea: toRange(raw.carpetAreaMin, raw.carpetAreaMax),
    // "Ready to Occupy"/"Ready to Sell"/"Ready to Operate" are the same per-tab
    // concept as Apartment's readyToMove/readyToOccupy.
    readyToMove: yn(pick(raw, 'readyToMove', 'readyToOccupy', 'readyToSell', 'readyToOperate')),
    underConstruction: yn(raw.underConstruction),
    immediatePossession: yn(pick(raw, 'immediatePossession', 'immediateOccupancy')),
    leaseRenewalOption: yn(raw.leaseRenewalOption),
    titleDeedVerified: yn(raw.titleDeedVerified),
    // loanEligible ("can this property be loan-financed?") is a property
    // attribute with a real column. loanRequired ("do you personally need a
    // loan?") is a buyer-intent question like Individual's homeLoanRequired -
    // nothing on the property to filter against, deliberately not mapped.
    loanEligible: yn(raw.loanEligible),
    reraApproved: yn(raw.reraApproved),
    minimumDuration: pick(raw, 'minRentalDuration', 'leaseDuration'),
    availableFrom: raw.availableFrom,
    // selectedAmenities is a free-text tag input (type-your-own), not one of the
    // fixed checkboxes - kept as-is alongside the checkboxes translated through
    // COMMERCIAL_AMENITY_ALIASES above (see its comment for what this can and
    // can't match).
    amenities: [...(raw.selectedAmenities || []), ...(collectCommercialAmenities(raw) || [])].length
      ? [...(raw.selectedAmenities || []), ...(collectCommercialAmenities(raw) || [])]
      : undefined,
    // Still deliberately NOT mapped - no posting-form amenity id for any of these,
    // under any role's vocabulary: receptionArea, washrooms, storageSpace/storageRoom,
    // serverRoom, smartOffice, housekeeping/housekeepingServices, twentyFourSevenAccess,
    // biometricAccess, parkingCapacity/occupancyCapacity (capacity numbers, not amenities).
  };
}

// ---------------------------------------------------------------------------
// Land & Plots (ResidentialPlotFilter and 49 siblings, same shared-template
// family as Commercial - 50 of the 51 files use the identical controlled
// `filters` object; HillViewPlotFilter.jsx is an unfinished stub with no
// fields or Apply button at all, out of scope). Apply sends
// { ...filters, purpose, propertyType }.
// ---------------------------------------------------------------------------
function fromLand(raw = {}, ctx = {}) {
  const purpose = purposeFromTab(raw.purpose || ctx.activeTab);
  return {
    propertyCategory: 'LAND_PLOT',
    listingPurpose: purpose,
    propertyType: raw.propertyType,
    // "Listing Type" is Owner/Agent/Builder checkboxes (array), same as Commercial.
    postedBy: raw.listingType,
    city: raw.city,
    preferredLocation: pick(raw, 'locality', 'layoutName'),
    landmark: raw.landmark,
    nearbyConnectivity: raw.nearbyConnectivity,
    pincode: raw.pincode,
    facingDirection: raw.facing,
    landShape: pick(raw, 'plotShape', 'plotShapePreference'),
    soilType: raw.soilType,
    // Only the farmland-type panels (Agricultural/CoconutFarm/DairyFarm/...) ask
    // this as the real "Borewell/Canal/River/Open Well" dropdown the posting
    // forms also store. Most other panels instead have a plain `waterConnection`
    // Yes/No checkbox for a different concept ("is there a connection at all") -
    // sending that straight through here as "Yes"/"No" would've been semantically
    // wrong even once the type (true/false vs string) was fixed, since the column
    // holds a water *type*, not a flag, so it's deliberately left unmapped.
    waterSource: raw.waterSource,
    roadWidth: raw.roadWidth,
    ownershipType: raw.ownershipType,
    landArea: toRange(
      pick(raw, 'landAreaMin', 'plotArea', 'totalArea', 'area'),
      pick(raw, 'landAreaMax', 'plotArea', 'totalArea', 'area')
    ),
    areaUnit: pick(raw, 'areaUnit', 'plotAreaUnit', 'landAreaUnit'),
    price: toRange(
      pick(raw, 'minPrice', 'minSellPrice', 'minRent', 'minLeaseAmount', 'minBudget'),
      pick(raw, 'maxPrice', 'maxSellPrice', 'maxRent', 'maxLeaseAmount', 'maxBudget')
    ),
    // Rent's "Security Deposit" and Lease's "Refundable Deposit" are each a
    // single amount, same as Commercial's equivalent fields.
    securityDeposit: toRange(
      pick(raw, 'securityDeposit', 'refundableDeposit'),
      pick(raw, 'securityDeposit', 'refundableDeposit')
    ),
    maintenance: toRange(raw.maintenanceCharges, raw.maintenanceCharges),
    maintenanceIncluded: yn(raw.maintenanceIncluded),
    priceNegotiable: toNegotiable(yn(pick(raw, 'priceNegotiable', 'rentNegotiable', 'leaseNegotiable', 'sellPriceNegotiable'))),
    propertyTax: raw.propertyTax,
    titleDeedVerified: yn(raw.titleDeedVerified),
    loanEligible: yn(raw.loanEligible),
    reraApproved: yn(raw.reraApproved),
    immediatePossession: yn(raw.immediatePossession),
    // "Under-Development Layout" is the same concept as Apartment/Commercial's
    // underConstruction - the layout itself isn't finished yet.
    underConstruction: yn(raw.underDevelopmentLayout),
    // electricity_available is a real, generic column; this panel's checkbox
    // (true/false) needed the same boolean normalization as Commercial's.
    electricityAvailable: yn(raw.electricityConnection),
    leaseRenewalOption: yn(raw.leaseRenewalOption),
    // "Nearby Access" (temple/school/market/...) is the same concept as
    // Apartment's nearbyPlaces.
    nearbyPlaces: raw.nearbyAccess,
    minimumDuration: pick(raw, 'minRentalDuration', 'leaseDuration'),
    availableFrom: raw.availableFrom,
    amenities: raw.selectedAmenities,
    // Deliberately NOT mapped - no corresponding Property column on either the
    // filter or posting-form side: dtcpApproved/cmdaApproved/panchayatApproved/
    // pattaAvailable/encumbranceFree/readyToRegister (and their "...Only"/
    // "...Preferred"/"...Required" buyer-preference variants) - the posting forms
    // only ever collect these as document uploads (Patta/Chitta, Encumbrance
    // Certificate PDFs), never as a queryable status; boundaryWall, plotLength,
    // plotWidth, commercialPlot, gatedCommunity, pricePerSqft - no column;
    // loanRequired, minRoadWidthRequired, suitableForTypes - buyer intent/
    // preference, not a listing attribute; contactOwner/contactAgent/
    // contactBuilder/preferredContactTime - contact preferences, not filterable.
  };
}

// ---------------------------------------------------------------------------
// Hostel (BoysHostelFilter, GirlsHostelFilter, CoLivingSpaceFilter,
// WorkingProfessionalHostelFilter) - the smallest, most consistent family:
// all 4 share the exact same controlled `filters` object field-for-field.
// Apply sends { ...filters, purpose, propertyType }.
// ---------------------------------------------------------------------------
// All 4 Hostel filter panels ask "Room Type" as a short code ('AC'/'NonAC'/
// 'Executive') instead of the full string every posting form actually stores
// in room_type ("AC Room"/"Non-AC Room"/"Executive Room"/"Dormitory"/"Studio
// Room" - see roomTypeOptions in HostelRentForm.jsx and its Agent/Builder/
// PropertyManagement siblings, all now identical). Sent as-is, the short code
// would never match the stored string - same shape as the amenities bug, just
// one field instead of a whole checkbox group.
const HOSTEL_ROOM_TYPE_LABELS = {
  AC: 'AC Room',
  NonAC: 'Non-AC Room',
  Executive: 'Executive Room',
};

function fromHostel(raw = {}, ctx = {}) {
  const purpose = purposeFromTab(raw.purpose || ctx.activeTab) || 'RENT';
  return {
    propertyCategory: 'HOSTEL',
    listingPurpose: purpose,
    hostelType: raw.propertyType,
    postedBy: raw.listingType,
    city: raw.city,
    preferredLocation: pick(raw, 'locality', 'distanceFrom'),
    landmark: raw.landmark,
    sharingType: raw.sharingType,
    roomType: raw.roomType ? [HOSTEL_ROOM_TYPE_LABELS[raw.roomType] || raw.roomType] : undefined,
    bathroomType: raw.bathroomType,
    furnishingStatus: raw.furnishing,
    amenities: raw.amenities,
    foodIncluded: yn(raw.foodIncluded),
    foodType: raw.foodType,
    kitchenAccess: yn(raw.kitchenAccess),
    // CoLivingSpaceFilter only - petFriendly/parking are the same generic
    // columns every other family's panels already use.
    petFriendly: yn(raw.petFriendly),
    parking: raw.parkingAvailable,
    price: toRange(
      pick(raw, 'minRent', 'minPrice', 'minLeaseAmount'),
      pick(raw, 'maxRent', 'maxPrice', 'maxLeaseAmount')
    ),
    // Rent's "Security Deposit" and Lease's "Refundable Deposit" are each a
    // single amount - same same-value-range treatment as every other family.
    securityDeposit: toRange(
      pick(raw, 'securityDeposit', 'refundableDeposit'),
      pick(raw, 'securityDeposit', 'refundableDeposit')
    ),
    maintenanceIncluded: yn(raw.maintenanceIncluded),
    priceNegotiable: toNegotiable(yn(pick(raw, 'priceNegotiable', 'rentNegotiable', 'leaseNegotiable'))),
    immediatePossession: yn(pick(raw, 'immediatePossession', 'immediateOccupancy')),
    readyToMove: yn(raw.readyToBuy),
    underConstruction: yn(raw.underConstruction),
    minimumDuration: pick(raw, 'minStayDuration', 'leaseDuration'),
    availableFrom: raw.availableFrom,
    // Deliberately NOT mapped - no corresponding Property column: mealsPerDay,
    // curfewTime, visitorPolicy, idProofRequired, wardenOnPremises, quietHours,
    // proximityToOffice, transportAccess, workFromHomeFriendly (real hostel-specific
    // attributes the schema simply has no column for yet); security24x7, cctv,
    // communityAmenities, professionalAmenities, eventsAndActivities (amenity-like
    // checkboxes/arrays - same id-vocabulary-mismatch risk as Commercial/Land's
    // per-type amenities, not folded into `amenities` without checking each
    // posting form's own ids first); contactOwner/contactAgent/contactWarden/
    // contactManager/preferredContactTime - contact preferences, not filterable.
  };
}

// ---------------------------------------------------------------------------
// Individual (IndependentHouseFilter, IndependentVillaFilter,
// DuplexResidentialFilter - ResidentialApartmentFilter is a different family,
// out of scope here) - many separate useStates, Buy/Rent/Lease tabs each
// spread their own subset into `filters`. Each of the three filter
// components sends its own fixed propertyType value (e.g. "Duplex
// Residential Unit") plus a listingPurpose derived from its own Buy/Rent/
// Lease tab state - never the other way around.
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
    gardenSpace: yn(raw.gardenSpace),
    terrace: yn(raw.terrace),
    // Rent's "Pet Friendly" and Lease's "Pet Friendly" are two different raw
    // keys (petFriendly / leasePetFriendly) for the same concept - reading
    // only the Rent one silently dropped every Lease-tab pet filter.
    petFriendly: yn(pick(raw, 'petFriendly', 'leasePetFriendly')),
    ownershipType: raw.ownershipType,
    // Rent's "Occupancy Details" and Lease's "Occupancy Type" both describe who
    // the property suits (family/bachelor/company...) - same column as the
    // posting forms' own tenantType, no separate column of their own.
    tenantType: pick(raw, 'occupancyDetails', 'occupancyType'),
    price: toRange(
      pick(raw.budgetRange, 'min') ?? pick(raw.monthlyRentBudget, 'min') ?? pick(raw.leaseBudget, 'min'),
      pick(raw.budgetRange, 'max') ?? pick(raw.monthlyRentBudget, 'max') ?? pick(raw.leaseBudget, 'max')
    ),
    // Rent calls it securityDeposit, Lease calls the same concept advanceDeposit -
    // reading only raw.securityDeposit silently dropped every Lease-tab deposit filter.
    securityDeposit: toRange(
      pick(raw.securityDeposit, 'min') ?? pick(raw.advanceDeposit, 'min'),
      pick(raw.securityDeposit, 'max') ?? pick(raw.advanceDeposit, 'max')
    ),
    builtUpArea: toRange(raw.builtupArea?.min, raw.builtupArea?.max),
    landArea: toRange(raw.plotSize?.min, raw.plotSize?.max),
    availableFrom: raw.moveInDate,
    minimumDuration: raw.rentalDuration || raw.leaseDuration,
    amenities: raw.amenities,
    // Deliberately NOT mapped - no corresponding Property column, on either the
    // filter or the posting-form side, so there is nothing for these to filter
    // against: purchaseTime, buyingPurpose, homeLoanRequired, floorsPreferred
    // (buyer-intent questions, not stored listing attributes), waterSupply and
    // swimmingPool (never collected as a column or an amenity id at posting time).
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
