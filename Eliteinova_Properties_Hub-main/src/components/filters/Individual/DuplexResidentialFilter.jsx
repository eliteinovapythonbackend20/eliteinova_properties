import React, { useState } from "react";
import {
  Home, DollarSign, Calendar, Bed, Bath,
  Car, Trees, Building, Lock, Camera, Wifi,
  Shield, Sun, Coffee, Users, Briefcase,
  MapPin, Square, TrendingUp, Clock, FileText,
  CheckCircle, XCircle, Sprout, Leaf,
  Filter, X, Dumbbell, Waves, Hotel, Landmark, ParkingCircle
} from "lucide-react";

const DuplexResidentialFilter = ({ activeTab = "Buy", onFilterChange, onClose }) => {
  const [activePropertyType, setActivePropertyType] = useState("Buy");

  // Common states for all tabs
  const [bedrooms, setBedrooms] = useState([]);
  const [bathrooms, setBathrooms] = useState([]);
  const [furnishingType, setFurnishingType] = useState("");
  const [balconyTerrace, setBalconyTerrace] = useState("");
  const [privateParking, setPrivateParking] = useState("");
  const [gardenSpace, setGardenSpace] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [preferredLocation, setPreferredLocation] = useState("");

  // Buy specific states
  const [budgetRange, setBudgetRange] = useState({ min: "", max: "" });
  const [plotSize, setPlotSize] = useState({ min: "", max: "" });
  const [builtupArea, setBuiltupArea] = useState({ min: "", max: "" });
  const [purchaseTime, setPurchaseTime] = useState("");
  const [buyingPurpose, setBuyingPurpose] = useState("");
  const [homeLoanRequired, setHomeLoanRequired] = useState("");
  const [facingPreference, setFacingPreference] = useState("");

  // Rent specific states
  const [monthlyRentBudget, setMonthlyRentBudget] = useState({ min: "", max: "" });
  const [securityDeposit, setSecurityDeposit] = useState({ min: "", max: "" });
  const [moveInDate, setMoveInDate] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [occupancyDetails, setOccupancyDetails] = useState("");
  const [petFriendly, setPetFriendly] = useState("");

  // Sell specific states (commented out but kept for reference)
  // const [expectedPrice, setExpectedPrice] = useState({ min: "", max: "" });
  // const [negotiable, setNegotiable] = useState("");
  // const [propertyAge, setPropertyAge] = useState("");
  // const [propertyCondition, setPropertyCondition] = useState("");
  // const [ownershipType, setOwnershipType] = useState("");
  // const [loanOutstanding, setLoanOutstanding] = useState("");

  // Lease specific states
  const [leaseBudget, setLeaseBudget] = useState({ min: "", max: "" });
  const [advanceDeposit, setAdvanceDeposit] = useState({ min: "", max: "" });
  const [leaseDuration, setLeaseDuration] = useState("");
  const [occupancyType, setOccupancyType] = useState("");
  const [leasePetFriendly, setLeasePetFriendly] = useState("");

  const propertyTypes = ["Buy", "Rent", /* "Sell", */ "Lease"];

  const bedroomOptions = ["2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
  const bathroomOptions = ["1", "2", "3", "4+"];
  const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
  const yesNoOptions = ["Yes", "No"];
  const facingOptions = ["East", "West", "North", "South", "No Preference"];

  const commonAmenities = [
    { id: "waterSupply247", label: "24/7 Water Supply", icon: <Coffee className="w-4 h-4" /> },
    { id: "powerBackup", label: "Power Backup", icon: <Lock className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "cctv", label: "CCTV Surveillance", icon: <Camera className="w-4 h-4" /> },
    { id: "modularKitchen", label: "Modular Kitchen", icon: <Coffee className="w-4 h-4" /> },
    { id: "gatedCommunity", label: "Gated Community", icon: <Building className="w-4 h-4" /> },
    { id: "gym", label: "Gym / Fitness Center", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "swimmingPool", label: "Swimming Pool", icon: <Waves className="w-4 h-4" /> },
    { id: "playArea", label: "Children's Play Area", icon: <Users className="w-4 h-4" /> },
    { id: "clubhouse", label: "Clubhouse", icon: <Hotel className="w-4 h-4" /> },
    { id: "nearbySchool", label: "Nearby School / Hospital", icon: <Landmark className="w-4 h-4" /> }
  ];

  const rentAmenities = [
    { id: "wifiReady", label: "Wi-Fi Ready", icon: <Wifi className="w-4 h-4" /> },
    ...commonAmenities
  ];

  const handleAmenityToggle = (amenityId) => {
    setAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleApplyFilters = () => {
    const filters = {
      propertyType: activePropertyType,
      bedrooms,
      bathrooms,
      furnishingType,
      balconyTerrace,
      privateParking,
      gardenSpace,
      amenities,
      preferredLocation,
      ...(activePropertyType === "Buy" && {
        budgetRange,
        plotSize,
        builtupArea,
        purchaseTime,
        buyingPurpose,
        homeLoanRequired,
        facingPreference
      }),
      ...(activePropertyType === "Rent" && {
        monthlyRentBudget,
        securityDeposit,
        moveInDate,
        rentalDuration,
        occupancyDetails,
        petFriendly
      }),
      ...(activePropertyType === "Sell" && {
        expectedPrice,
        negotiable,
        propertyAge,
        propertyCondition,
        ownershipType,
        loanOutstanding
      }),
      ...(activePropertyType === "Lease" && {
        leaseBudget,
        advanceDeposit,
        leaseDuration,
        occupancyType,
        leasePetFriendly
      })
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    setBedrooms([]);
    setBathrooms([]);
    setFurnishingType("");
    setBalconyTerrace("");
    setPrivateParking("");
    setGardenSpace("");
    setAmenities([]);
    setPreferredLocation("");
    setBudgetRange({ min: "", max: "" });
    setPlotSize({ min: "", max: "" });
    setBuiltupArea({ min: "", max: "" });
    setPurchaseTime("");
    setBuyingPurpose("");
    setHomeLoanRequired("");
    setFacingPreference("");
    setMonthlyRentBudget({ min: "", max: "" });
    setSecurityDeposit({ min: "", max: "" });
    setMoveInDate("");
    setRentalDuration("");
    setOccupancyDetails("");
    setPetFriendly("");
    // Commented out sell state resets
    // setExpectedPrice({ min: "", max: "" });
    // setNegotiable("");
    // setPropertyAge("");
    // setPropertyCondition("");
    // setOwnershipType("");
    // setLoanOutstanding("");
    setLeaseBudget({ min: "", max: "" });
    setAdvanceDeposit({ min: "", max: "" });
    setLeaseDuration("");
    setOccupancyType("");
    setLeasePetFriendly("");
  };

  const renderCommonFilters = () => (
    <>
      {/* Location */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-600" />
          Preferred Location
        </label>
        <input
          type="text"
          value={preferredLocation}
          onChange={(e) => setPreferredLocation(e.target.value)}
          placeholder="Enter city, locality, or landmark"
          className="w-full px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400 transition-all duration-300"
        />
      </div>

      {/* Bedrooms */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Bed className="w-4 h-4 text-teal-600" />
          Bedrooms Required
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bedroomOptions.map((bhk) => (
            <label key={bhk} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 hover:bg-teal-50">
              <input
                type="checkbox"
                checked={bedrooms.includes(bhk)}
                onChange={() => {
                  setBedrooms(prev =>
                    prev.includes(bhk)
                      ? prev.filter(b => b !== bhk)
                      : [...prev, bhk]
                  );
                }}
                className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{bhk}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Bath className="w-4 h-4 text-teal-600" />
          Bathrooms Required
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bathroomOptions.map((bath) => (
            <label key={bath} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 hover:bg-teal-50">
              <input
                type="checkbox"
                checked={bathrooms.includes(bath)}
                onChange={() => {
                  setBathrooms(prev =>
                    prev.includes(bath)
                      ? prev.filter(b => b !== bath)
                      : [...prev, bath]
                  );
                }}
                className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{bath}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnishing Type */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Home className="w-4 h-4 text-teal-600" />
          Furnishing Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {furnishingOptions.map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 hover:bg-teal-50">
              <input
                type="radio"
                name="furnishingType"
                checked={furnishingType === type}
                onChange={() => setFurnishingType(type)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Balcony / Terrace */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Sun className="w-4 h-4 text-teal-600" />
          Balcony / Terrace
        </label>
        <div className="flex gap-2">
          {yesNoOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="balconyTerrace"
                checked={balconyTerrace === option}
                onChange={() => setBalconyTerrace(option)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Private Parking */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Car className="w-4 h-4 text-teal-600" />
          Private Parking
        </label>
        <div className="flex gap-2">
          {yesNoOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="privateParking"
                checked={privateParking === option}
                onChange={() => setPrivateParking(option)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Garden / Open Space */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Sprout className="w-4 h-4 text-teal-600" />
          Garden / Open Space
        </label>
        <div className="flex gap-2">
          {yesNoOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="gardenSpace"
                checked={gardenSpace === option}
                onChange={() => setGardenSpace(option)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          Amenities Required
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(activePropertyType === "Rent" || activePropertyType === "Lease" ? rentAmenities : commonAmenities).map((amenity) => (
            <label key={amenity.id} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 text-xs font-semibold text-teal-900">
              <input
                type="checkbox"
                checked={amenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="flex items-center gap-1">
                {amenity.icon}
                {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderBuyFilters = () => (
    <>
      {renderCommonFilters()}

      {/* Budget Range */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-teal-600" />
          Budget Range (₹)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={budgetRange.min}
            onChange={(e) => setBudgetRange({ ...budgetRange, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={budgetRange.max}
            onChange={(e) => setBudgetRange({ ...budgetRange, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Plot Size */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Square className="w-4 h-4 text-teal-600" />
          Plot Size (sq. ft.)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={plotSize.min}
            onChange={(e) => setPlotSize({ ...plotSize, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={plotSize.max}
            onChange={(e) => setPlotSize({ ...plotSize, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Built-up Area */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Building className="w-4 h-4 text-teal-600" />
          Built-up Area (sq. ft.)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={builtupArea.min}
            onChange={(e) => setBuiltupArea({ ...builtupArea, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={builtupArea.max}
            onChange={(e) => setBuiltupArea({ ...builtupArea, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Purchase Time */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Expected Purchase Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["Immediately", "Within 3 Months", "Within 6 Months", "Just Exploring"].map((time) => (
            <label key={time} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="purchaseTime"
                checked={purchaseTime === time}
                onChange={() => setPurchaseTime(time)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{time}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buying Purpose */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-teal-600" />
          Buying Purpose
        </label>
        <div className="flex gap-2">
          {["Self Use", "Investment", "Rental Income"].map((purpose) => (
            <label key={purpose} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="buyingPurpose"
                checked={buyingPurpose === purpose}
                onChange={() => setBuyingPurpose(purpose)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{purpose}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Home Loan Required */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-teal-600" />
          Home Loan Required
        </label>
        <div className="flex gap-2">
          {yesNoOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="homeLoanRequired"
                checked={homeLoanRequired === option}
                onChange={() => setHomeLoanRequired(option)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Facing Preference */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Sun className="w-4 h-4 text-teal-600" />
          Facing Preference
        </label>
        <div className="flex flex-wrap gap-2">
          {facingOptions.map((facing) => (
            <label key={facing} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="facingPreference"
                checked={facingPreference === facing}
                onChange={() => setFacingPreference(facing)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{facing}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderRentFilters = () => (
    <>
      {renderCommonFilters()}

      {/* Monthly Rent Budget */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-teal-600" />
          Monthly Rent Budget (₹)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={monthlyRentBudget.min}
            onChange={(e) => setMonthlyRentBudget({ ...monthlyRentBudget, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={monthlyRentBudget.max}
            onChange={(e) => setMonthlyRentBudget({ ...monthlyRentBudget, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Security Deposit */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" />
          Security Deposit Budget (₹)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={securityDeposit.min}
            onChange={(e) => setSecurityDeposit({ ...securityDeposit, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={securityDeposit.max}
            onChange={(e) => setSecurityDeposit({ ...securityDeposit, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Move-in Date */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          Move-in Date
        </label>
        <input
          type="date"
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900"
        />
      </div>

      {/* Rental Duration */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Rental Duration
        </label>
        <div className="flex gap-2">
          {["Short Term", "Long Term", "Flexible"].map((duration) => (
            <label key={duration} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="rentalDuration"
                checked={rentalDuration === duration}
                onChange={() => setRentalDuration(duration)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Occupancy Details */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          Occupancy Details
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["Single", "Family", "Bachelors", "Company Lease"].map((occupancy) => (
            <label key={occupancy} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="occupancyDetails"
                checked={occupancyDetails === occupancy}
                onChange={() => setOccupancyDetails(occupancy)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{occupancy}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet Friendly */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Sprout className="w-4 h-4 text-teal-600" />
          Pet Friendly
        </label>
        <div className="flex gap-2">
          {yesNoOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="petFriendly"
                checked={petFriendly === option}
                onChange={() => setPetFriendly(option)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  // Sell filters section commented out
  // const renderSellFilters = () => (
  //   <>
  //     {renderCommonFilters()}
  //     {/* Sell specific filters */}
  //   </>
  // );

  const renderLeaseFilters = () => (
    <>
      {renderCommonFilters()}

      {/* Lease Budget */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-teal-600" />
          Lease Budget Range (₹/month)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={leaseBudget.min}
            onChange={(e) => setLeaseBudget({ ...leaseBudget, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={leaseBudget.max}
            onChange={(e) => setLeaseBudget({ ...leaseBudget, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Advance Deposit */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" />
          Advance / Security Deposit (₹)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={advanceDeposit.min}
            onChange={(e) => setAdvanceDeposit({ ...advanceDeposit, min: e.target.value })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
          <input
            type="number"
            value={advanceDeposit.max}
            onChange={(e) => setAdvanceDeposit({ ...advanceDeposit, max: e.target.value })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 rounded-lg border-2 border-teal-200 bg-white text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-teal-900 placeholder-teal-400"
          />
        </div>
      </div>

      {/* Preferred Lease Duration */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          Preferred Lease Duration
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["1 Year", "2 Years", "3 Years", "5+ Years"].map((duration) => (
            <label key={duration} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="leaseDuration"
                checked={leaseDuration === duration}
                onChange={() => setLeaseDuration(duration)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Occupancy Type */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" />
          Occupancy Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["Family", "Company Lease", "Vacation Stay"].map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300">
              <input
                type="radio"
                name="occupancyType"
                checked={occupancyType === type}
                onChange={() => setOccupancyType(type)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pet Friendly */}
      <div className="mb-4">
        <label className="text-sm font-bold text-teal-900 mb-2 block flex items-center gap-2">
          <Sprout className="w-4 h-4 text-teal-600" />
          Pet Friendly
        </label>
        <div className="flex gap-2">
          {yesNoOptions.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg border-2 border-teal-200 bg-white hover:border-teal-500 cursor-pointer transition-all duration-300 flex-1 text-center justify-center">
              <input
                type="radio"
                name="leasePetFriendly"
                checked={leasePetFriendly === option}
                onChange={() => setLeasePetFriendly(option)}
                className="w-3.5 h-3.5 text-teal-600 focus:ring-teal-500/30"
              />
              <span className="text-sm font-semibold text-teal-900">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-[#daeeed] backdrop-blur-xl rounded-2xl shadow-2xl border border-teal-200/30 flex flex-col overflow-hidden">
      {/* Frozen Header + Tabs */}
      <div className="sticky top-0 z-20 rounded-t-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Duplex Residential Units
          </h3>
          {onClose && (
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-all">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-teal-200/30 bg-[#daeeed] sticky top-0 z-10">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActivePropertyType(type)}
              className={`flex-1 py-2.5 px-4 text-center font-semibold transition-all duration-300 relative ${
                activePropertyType === type
                  ? "text-teal-700 bg-white/50"
                  : "text-teal-500 hover:text-teal-700 hover:bg-white/30"
              }`}
            >
              {type}
              {activePropertyType === type && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Content - Adjusted max height to match IndependentHouseFilter */}
      <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
        {activePropertyType === "Buy" && renderBuyFilters()}
        {activePropertyType === "Rent" && renderRentFilters()}
        {/* {activePropertyType === "Sell" && renderSellFilters()} */}
        {activePropertyType === "Lease" && renderLeaseFilters()}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-teal-200/30 bg-[#daeeed] flex gap-3">
        <button
          onClick={handleClearFilters}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-teal-200/50 text-sm font-medium text-teal-700 hover:bg-gradient-to-r from-teal-50 to-emerald-50 hover:border-teal-300 transition-all duration-500"
        >
          Clear All
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xl hover:shadow-[0_0_25px_rgba(0,105,92,0.4)] transition-all duration-500 bg-gradient-to-r from-teal-600 to-emerald-600"
        >
          Apply Filters
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, transparent, rgba(0, 105, 92, 0.1), transparent);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #004D40, #00796B);
          box-shadow: 0 0 10px rgba(0, 105, 92, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DuplexResidentialFilter;