import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Store, Factory, Hotel, Briefcase, Trees, Sprout, Heart, School, Layers, ChevronRight, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/landandplots/mainbg.png";
import useNavigation from "../../hooks/useNavigation";
import { usePropertyFilter } from "../../hooks/usePropertyFilter";
import { searchPropertiesSimple } from "../../services/filterService";
import PropertyList from "../../components/propertycard/PropertyList";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

// Diamond-collage banner photo + cross-category thumbnails (matches Commercial/Apartment banner design)
import bannerImg from "../../assets/Apartmentban.jpg";
import individualImage from "../../assets/individualcat.jpg";
import apartmentImage from "../../assets/Apartmentcat.jpg";
import commercialImage from "../../assets/commercialcat.jpg";
import hostelImage from "../../assets/hostelcat.jpg";

// Shared round-pill thumbnail for the scrollable property-type strip (no
// per-subtype photography exists yet, so every pill reuses this placeholder)
import categoryThumb from "../../assets/banner1.jpg";

const AgriculturalLandPlotsPage = () => {
  const navigate = useNavigate();

  const {
    data,
    loading,
    activeLandType,
    activeLandSubMenuType,
    handleNavigation,
    getSubMenusByProperty
  } = useNavigation();

  const {
    filteredData,
    filterLoading,
    appliedFilters,
    handleFilterChange
  } = usePropertyFilter('land');

  const [listingPurpose, setListingPurpose] = useState(null); // null = "All"
  const [purposeFilteredProperties, setPurposeFilteredProperties] = useState([]);
  const [purposeLoading, setPurposeLoading] = useState(false);

  useEffect(() => {
    if (!listingPurpose) {
      setPurposeFilteredProperties([]);
      return;
    }
    let cancelled = false;
    setPurposeLoading(true);
    searchPropertiesSimple({
      property_type: "Agricultural Land",
      listing_purpose: listingPurpose,
      page: 1,
      limit: 20,
    })
      .then((response) => {
        if (cancelled) return;
        setPurposeFilteredProperties(response?.data?.data || response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching purpose-filtered data:", error);
        if (!cancelled) setPurposeFilteredProperties([]);
      })
      .finally(() => {
        if (!cancelled) setPurposeLoading(false);
      });
    return () => { cancelled = true; };
  }, [listingPurpose]);

  const properties = useMemo(() => {
    if (appliedFilters && filteredData.length > 0) {
      return filteredData;
    }
    if (listingPurpose) {
      return purposeFilteredProperties;
    }
    return data;
  }, [data, filteredData, appliedFilters, listingPurpose, purposeFilteredProperties]);

  const isLoading = loading || filterLoading || purposeLoading;

  // Pagination -- client-side over the current properties list
  const resultsRef = useRef(null);
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProperties,
    goToPage
  } = usePagination({ items: properties, pageSize: 10, scrollRef: resultsRef });

  const [activeButton, setActiveButton] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // This page IS the "Agricultural Land" category overview
  const categoryPath = "/land-plots/agricultural-land-plots";

  // Diamond collage entries for the banner
  const bannerDiamonds = [
    { label: "Individual", path: "/individual", image: individualImage },
    { label: "Apartment", path: "/apartment", image: apartmentImage },
    { label: "Commercial", path: "/commercial", image: commercialImage },
    { label: "Hostel", path: "/hostel", image: hostelImage }
  ];

  const propertyCategories = [
    { name: "Individual", path: "/individual", icon: <Building className="w-4 h-4" /> },
    { name: "Apartment", path: "/apartment", icon: <Landmark className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  // Main categories — names/paths match useNavigation's landTypes exactly so
  // activeLandType comparisons below work with zero translation/mapping.
  // Submenus are sourced live from getSubMenusByProperty(), not hardcoded here.
  const landCategories = [
    {
      name: "All",
      icon: <Compass className="w-5 h-5 md:w-5.5 md:h-5.5" />,
      path: "/land-plots",
      isAllButton: true
    },
    {
      name: "Residential Land / Plots",
      icon: <Building className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/residential-land-plots"
    },
    {
      name: "Commercial Land / Plots",
      icon: <Building2 className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/commercial-land-plots"
    },
    {
      name: "Agricultural Land",
      icon: <Sprout className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/agricultural-land-plots"
    },
    {
      name: "Industrial Land",
      icon: <Factory className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/industrial-land-plots"
    },
    {
      name: "Mixed-Use Land",
      icon: <Layers className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/mixed-use-land-plots"
    },
    {
      name: "Institutional Land",
      icon: <School className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/institutional-land-plots"
    },
    {
      name: "Investment & Special Purpose Land",
      icon: <Heart className="w-3.5 h-3.5" />,
      image: categoryThumb,
      path: "/land-plots/investment-land-plots"
    }
  ];

  // Flatten all land types for navigation
  const landTypes = [
    { name: "All", path: "/land-plots", parent: null },
    { name: "Residential Land / Plots", path: "/land-plots/residential-land-plots", parent: null },
    { name: "Commercial Land / Plots", path: "/land-plots/commercial-land-plots", parent: null },
    { name: "Agricultural Land / Plots", path: "/land-plots/agricultural-land-plots", parent: null },
    { name: "Industrial Land", path: "/land-plots/industrial-land-plots", parent: null },
    { name: "Mixed-Use Land", path: "/land-plots/mixed-use-land-plots", parent: null },
    { name: "Institutional Land", path: "/land-plots/institutional-land-plots", parent: null },
    { name: "Investment & Special Purpose Land", path: "/land-plots/investment-land-plots", parent: null },
    // Residential submenus
    { name: "Residential Plot", path: "/land-plots/residential-land-plots/residential-plot", parent: "Residential Land / Plots" },
    { name: "DTCP & CMDA Approved Plot", path: "/land-plots/residential-land-plots/dtcp-cmda-approved-plot", parent: "Residential Land / Plots" },
    { name: "Gated Community Plot", path: "/land-plots/residential-land-plots/gated-community-plot", parent: "Residential Land / Plots" },
    { name: "Villa Plot", path: "/land-plots/residential-land-plots/villa-plot", parent: "Residential Land / Plots" },
    { name: "Farm House Plot", path: "/land-plots/residential-land-plots/farm-house-plot", parent: "Residential Land / Plots" },
    { name: "Common Plot", path: "/land-plots/residential-land-plots/common-plot", parent: "Residential Land / Plots" },
    { name: "Independent House Plot", path: "/land-plots/residential-land-plots/independent-house-plot", parent: "Residential Land / Plots" },
    { name: "Duplex House Plot", path: "/land-plots/residential-land-plots/duplex-house-plot", parent: "Residential Land / Plots" },
    { name: "Row House Plot", path: "/land-plots/residential-land-plots/row-house-plot", parent: "Residential Land / Plots" },
    // Commercial submenus
    { name: "Commercial Plot", path: "/land-plots/commercial-land-plots/commercial-plot", parent: "Commercial Land / Plots" },
    { name: "Office Space Land", path: "/land-plots/commercial-land-plots/office-space-land", parent: "Commercial Land / Plots" },
    { name: "Retail Shop Plot", path: "/land-plots/commercial-land-plots/retail-shop-plot", parent: "Commercial Land / Plots" },
    { name: "Showroom Plot", path: "/land-plots/commercial-land-plots/showroom-plot", parent: "Commercial Land / Plots" },
    { name: "Shopping Complex Land", path: "/land-plots/commercial-land-plots/shopping-complex-land", parent: "Commercial Land / Plots" },
    { name: "Hotel / Resort Land", path: "/land-plots/commercial-land-plots/hotel-resort-land", parent: "Commercial Land / Plots" },
    { name: "Petrol Bunk Plot", path: "/land-plots/commercial-land-plots/petrol-bunk-plot", parent: "Commercial Land / Plots" },
    { name: "IT Park Land", path: "/land-plots/commercial-land-plots/it-park-land", parent: "Commercial Land / Plots" },
    { name: "Warehouse Land", path: "/land-plots/commercial-land-plots/warehouse-land", parent: "Commercial Land / Plots" },
    { name: "Industrial Commercial Plot", path: "/land-plots/commercial-land-plots/industrial-commercial-plot", parent: "Commercial Land / Plots" },
    // Agricultural submenus
    { name: "Agricultural Land", path: "/land-plots/agricultural-land-plots/agricultural-land", parent: "Agricultural Land" },
    { name: "Farm Land", path: "/land-plots/agricultural-land-plots/farm-land", parent: "Agricultural Land" },
    { name: "Organic Farming Land", path: "/land-plots/agricultural-land-plots/organic-farming-land", parent: "Agricultural Land" },
    { name: "Coconut Farm Land", path: "/land-plots/agricultural-land-plots/coconut-farm-land", parent: "Agricultural Land" },
    { name: "Mango Grove Land", path: "/land-plots/agricultural-land-plots/mango-grove-land", parent: "Agricultural Land" },
    { name: "Tea / Coffee Estate", path: "/land-plots/agricultural-land-plots/tea-coffee-estate", parent: "Agricultural Land" },
    { name: "Poultry Farm Land", path: "/land-plots/agricultural-land-plots/poultry-farm-land", parent: "Agricultural Land" },
    { name: "Dairy Farm Land", path: "/land-plots/agricultural-land-plots/dairy-farm-land", parent: "Agricultural Land" },
    { name: "Fisheries / Aquaculture Land", path: "/land-plots/agricultural-land-plots/fisheries-aquaculture-land", parent: "Agricultural Land" },
    // Industrial submenus
    { name: "Industrial Plot", path: "/land-plots/industrial-land-plots/industrial-plot", parent: "Industrial Land" },
    { name: "Factory Land", path: "/land-plots/industrial-land-plots/factory-land", parent: "Industrial Land" },
    { name: "Manufacturing Unit Plot", path: "/land-plots/industrial-land-plots/manufacturing-unit-plot", parent: "Industrial Land" },
    { name: "Logistics Hub Land", path: "/land-plots/industrial-land-plots/logistics-hub-land", parent: "Industrial Land" },
    { name: "Warehouse Plot", path: "/land-plots/industrial-land-plots/warehouse-plot", parent: "Industrial Land" },
    { name: "Cold Storage Land", path: "/land-plots/industrial-land-plots/cold-storage-land", parent: "Industrial Land" },
    { name: "SEZ Land", path: "/land-plots/industrial-land-plots/sez-land", parent: "Industrial Land" },
    // Mixed-Use submenus
    { name: "Residential + Commercial Plot", path: "/land-plots/mixed-use-land-plots/residential-commercial-plot", parent: "Mixed-Use Land" },
    { name: "Commercial + Industrial Land", path: "/land-plots/mixed-use-land-plots/commercial-industrial-land", parent: "Mixed-Use Land" },
    { name: "Township Development Land", path: "/land-plots/mixed-use-land-plots/township-development-land", parent: "Mixed-Use Land" },
    { name: "Multi-purpose Development Land", path: "/land-plots/mixed-use-land-plots/multi-purpose-development-land", parent: "Mixed-Use Land" },
    // Institutional submenus
    { name: "School / College Land", path: "/land-plots/institutional-land-plots/school-college-land", parent: "Institutional Land" },
    { name: "Hospital / Clinic Land", path: "/land-plots/institutional-land-plots/hospital-clinic-land", parent: "Institutional Land" },
    { name: "Training Institute Plot", path: "/land-plots/institutional-land-plots/training-institute-plot", parent: "Institutional Land" },
    { name: "Religious Institution Land", path: "/land-plots/institutional-land-plots/religious-institution-land", parent: "Institutional Land" },
    // Investment submenus
    { name: "Highway Facing Plot", path: "/land-plots/investment-land-plots/highway-facing-plot", parent: "Investment & Special Purpose Land" },
    { name: "Lake View Plot", path: "/land-plots/investment-land-plots/lake-view-plot", parent: "Investment & Special Purpose Land" },
    { name: "Hill View Plot", path: "/land-plots/investment-land-plots/hill-view-plot", parent: "Investment & Special Purpose Land" },
    { name: "Beach Side Plot", path: "/land-plots/investment-land-plots/beach-side-plot", parent: "Investment & Special Purpose Land" },
    { name: "River Side Land", path: "/land-plots/investment-land-plots/river-side-land", parent: "Investment & Special Purpose Land" },
    { name: "Eco Tourism Land", path: "/land-plots/investment-land-plots/eco-tourism-land", parent: "Investment & Special Purpose Land" },
    { name: "Layout Development Land", path: "/land-plots/investment-land-plots/layout-development-land", parent: "Investment & Special Purpose Land" },
    { name: "Future Investment Plot", path: "/land-plots/investment-land-plots/future-investment-plot", parent: "Investment & Special Purpose Land" }
  ];

  const handlePropertyCategoryNavigation = (path) => navigate(path);
  const handleDiamondClick = (path) => navigate(path);

  const getParentCategory = (typeName) => {
    const landType = landTypes.find(t => t.name === typeName);
    return landType?.parent || null;
  };

  const RentBuyDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
        className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl w-full"
        style={{ background: "linear-gradient(135deg, #00695C, #26A69A) 200% 200%" }}
      >
        <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
        <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
        <span className="relative z-10">{activeButton}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10 ml-auto`} />
      </button>

      {openDropdown === "toggle" && (
        <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30 animate-slide-down-fast">
          {["All", "Buy", "Rent", "Lease"].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <button
                onClick={() => {
                  setListingPurpose(item === "All" ? null : item);
                  setActiveButton(item);
                  setOpenDropdown(null);
                }}
                className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
              >
                <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                  {item}
                </div>
              </button>
              {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );

  const SearchBar = () => (
    <div className="relative flex-1 group">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
      <input
        type="text"
        placeholder="Search agricultural land by city, locality, or project name"
        className="w-full pl-10 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
      />
      <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
    </div>
  );

  const AdvancedFilterBtn = ({ fullWidth = false }) => (
    <button
      onClick={() => setShowFilterModal(true)}
      className={`group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden ${fullWidth ? "w-full justify-center" : ""}`}
      style={{ background: "linear-gradient(135deg, #00897B, #26A69A) 200% 200%" }}
    >
      <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
      <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
      <span className="relative z-10">Advanced Filters</span>
      {appliedFilters && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );

  /* ─── Main-category pill with hover/tap submenu dropdown (desktop + mobile) ─── */
  const CategoryPill = ({ category, mobile = false, isActive = false, onClick }) => (
    <div
      className="group cursor-pointer flex flex-col items-center transition-all duration-300 hover:scale-105"
      onClick={onClick || (() => handleNavigation(category.path, category.name))}
    >
      <div
        className={`relative ${
          mobile ? "w-9 h-9 xs:w-10 xs:h-10 border-2" : "w-12 h-12 sm:w-14 sm:h-14 md:w-17 md:h-17 border-[3px]"
        } rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg ${
          isActive ? 'border-[#00695C] shadow-[0_0_18px_rgba(0,105,92,0.3)]' : 'border-gray-300 hover:border-[#00695C]'
        }`}
      >
        {category.isAllButton ? (
          <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
            isActive ? 'bg-[#00695C]' : 'bg-gray-100 group-hover:bg-[#D1E2DB]'
          }`}>
            {React.cloneElement(category.icon, {
              className: `${mobile ? 'w-3.5 h-3.5' : 'w-5 h-5 md:w-5.5 md:h-5.5'} transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-[#00695C]'
              }`
            })}
          </div>
        ) : (
          <>
            <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </>
        )}
      </div>
      <span className={`mt-0.5 ${
        mobile ? "text-[7px] max-w-[70px]" : "text-[8px] sm:text-[9px] md:text-[11px] max-w-[100px]"
      } font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
        isActive ? 'text-[#00695C]' : 'text-[#143B35] group-hover:text-[#00695C]'
      }`}>
        {category.name}
      </span>
    </div>
  );

  const SubmenuList = ({ category, mobile = false }) => {
    const submenus = getSubMenusByProperty(category.name);
    if (submenus.length === 0) return null;
    return submenus.map((submenu) => {
      const isSubmenuActive = activeLandSubMenuType === submenu.name;
      return (
        <button
          key={submenu.name}
          onClick={() => {
            handleNavigation(submenu.path, submenu.name);
            setHoveredCategory(null);
          }}
          className={`${mobile ? "" : "w-full"} px-4 py-2 text-left text-sm transition-all duration-300 group flex items-center gap-2 ${
            isSubmenuActive
              ? "bg-teal-600 text-white font-semibold"
              : "text-teal-900 hover:bg-teal-600 hover:text-white"
          }`}
        >
          <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${
            isSubmenuActive ? "text-white" : "text-teal-500 group-hover:text-white group-hover:translate-x-1"
          }`} />
          {submenu.name}
        </button>
      );
    });
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-emerald-900/20 to-teal-900/40 animate-gradient-flow"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `radial-gradient(circle, rgba(38, 166, 154, 0.4) 0%, rgba(0, 105, 92, 0.2) 70%, transparent 100%)`,
                borderRadius: '50%',
              }}
            ></div>
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`shape-${i}`}
              className="absolute animate-geometric-float"
              style={{
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, rgba(0, 105, 92, 0.1), rgba(38, 166, 154, 0.05))`,
                borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '20%' : '0%',
                border: '1px solid rgba(38, 166, 154, 0.15)',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 15}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* ══════════════════════════════════════════════
            BANNER — diamond collage
        ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#E7EFEA]">
          <div className="absolute top-0 left-0 w-[130px] h-[45px] rounded-br-[35px] sm:w-[170px] sm:h-[58px] sm:rounded-br-[50px] md:w-[210px] md:h-[72px] md:rounded-br-[60px] lg:w-[250px] lg:h-[85px] lg:rounded-br-[70px] bg-[#D6E4DE]" />

          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-row min-h-[170px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[330px]">

              {/* LEFT CONTENT */}
              <div className="flex flex-col justify-center w-[38%] sm:w-[37%] md:w-[36%] lg:w-[35%] shrink-0 px-2.5 sm:px-5 md:px-6 lg:px-10 py-2.5 sm:py-4 md:py-6 lg:py-7 z-20">
                <h1 className="leading-none">
                  <span className="block text-[11px] sm:text-[15px] md:text-[20px] lg:text-[28px] font-light text-[#042F2A]">PREMIUM</span>
                  <span className="block text-[16px] sm:text-[24px] md:text-[36px] lg:text-[50px] font-black text-[#012D29] leading-tight">AGRICULTURAL</span>
                  <span className="block text-[12px] sm:text-[17px] md:text-[23px] lg:text-[30px] font-bold text-[#012D29] leading-tight">LAND & PLOTS</span>
                </h1>
                <p className="mt-1 sm:mt-2 md:mt-2.5 lg:mt-3 max-w-[120px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px] text-[#31544E] text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-snug lg:leading-relaxed">
                  Discover premium agricultural land for farming, cultivation, and investment.
                </p>
                <button
                  onClick={() => handlePropertyCategoryNavigation(categoryPath)}
                  className="mt-1.5 sm:mt-2.5 md:mt-3 lg:mt-4 w-fit px-2.5 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-1.5 lg:px-6 lg:py-2 rounded-md lg:rounded-lg text-white font-bold shadow-md lg:shadow-xl text-[7px] sm:text-[9px] md:text-[11px] lg:text-sm"
                  style={{ background: "linear-gradient(135deg,#00695C,#26A69A)" }}
                >
                  EXPLORE NOW
                </button>
              </div>

              {/* RIGHT COLLAGE */}
              <div className="relative overflow-hidden flex-1" style={{ aspectRatio: '16/8' }}>
                <img src={bannerImg} alt="Agricultural Land & Plots" className="absolute inset-0 w-full h-full object-cover object-top brightness-75" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#E7EFEA] via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-center justify-start pl-2 sm:pl-4 md:pl-6 lg:pl-7 z-20">
                  <div className="relative w-[260px] h-[260px] scale-[0.42] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-left transition-transform duration-300">

                    {[0, 1, 2, 3].map((i) => {
                      const pos = [
                        { top: "0px", left: "80px" },
                        { top: "80px", left: "0px" },
                        { top: "80px", left: "160px" },
                        { top: "160px", left: "80px" }
                      ][i];
                      return (
                        <div
                          key={bannerDiamonds[i].label}
                          className="absolute cursor-pointer transition-all duration-500 hover:scale-110 hover:z-30 animate-diamond-float"
                          style={{ width: "100px", height: "100px", ...pos, animationDelay: `${i * 0.5}s` }}
                          onClick={() => handleDiamondClick(bannerDiamonds[i].path)}
                        >
                          <div className="absolute -inset-4 rounded-full bg-[#26A69A]/0 hover:bg-[#26A69A]/20 blur-xl transition-all duration-700 pointer-events-none" />
                          <div
                            className="relative w-full h-full overflow-hidden shadow-xl group/diamond"
                            style={{
                              transform: "rotate(45deg)",
                              borderRadius: "18px",
                              border: "3px solid rgba(255,255,255,0.85)",
                              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
                              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                          >
                            <div
                              className="absolute -inset-1 opacity-0 group-hover/diamond:opacity-100 transition-opacity duration-500"
                              style={{
                                background: "conic-gradient(from 0deg, #00695C, #26A69A, #4DB6AC, #26A69A, #00695C)",
                                animation: "diamond-spin 3s linear infinite",
                                borderRadius: "18px",
                              }}
                            />
                            <img
                              src={bannerDiamonds[i].image}
                              alt={bannerDiamonds[i].label}
                              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/diamond:scale-125"
                              style={{ transform: "rotate(-45deg) scale(1.3)", transformOrigin: "center" }}
                            />
                            <div
                              className="absolute inset-0 overflow-hidden"
                              style={{ transform: "rotate(-45deg) scale(1.3)", transformOrigin: "center" }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/diamond:translate-x-full transition-transform duration-1000" />
                            </div>
                            <div
                              className="absolute inset-0 transition-opacity duration-500 group-hover/diamond:opacity-80"
                              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))" }}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-white font-bold text-[11px] tracking-wide text-center leading-tight max-w-[90px] px-1 break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10 transition-all duration-300 group-hover/diamond:scale-110">
                              {bannerDiamonds[i].label}
                            </span>
                          </div>
                          <div className={`absolute ${["-top-1 -right-1", "-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -right-1"][i]} w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping`} />
                        </div>
                      );
                    })}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Header with Hover Dropdown Menus */}
        <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="max-w-none mx-auto px-6 py-4">
            <div className="hidden md:block space-y-4">
              <div className="flex gap-4 items-center">
                <RentBuyDropdown />
                <SearchBar />
                <AdvancedFilterBtn />
              </div>

              {/* ====== LAND CATEGORIES - hover for subtypes ====== */}
              <div className="flex flex-wrap items-start justify-center gap-3.5 md:gap-5 pt-1.5">
                {landCategories.map((category) => {
                  const isActive = activeLandType === category.name;
                  return (
                    <div
                      key={category.name}
                      className="relative"
                      onMouseEnter={() => !category.isAllButton && setHoveredCategory(category.name)}
                      onMouseLeave={() => !category.isAllButton && setHoveredCategory(null)}
                    >
                      <CategoryPill category={category} isActive={isActive} />

                      {!category.isAllButton && hoveredCategory === category.name && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 min-w-[240px] border border-teal-200/30 animate-slide-down-fast">
                          <div className="py-2 max-h-[400px] overflow-y-auto">
                            <SubmenuList category={category} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {landCategories.map((category) => {
                  const isActive = activeLandType === category.name;
                  return (
                    <div key={category.name} className="flex-shrink-0">
                      <CategoryPill
                        category={category}
                        mobile
                        isActive={isActive}
                        onClick={() => {
                          if (category.isAllButton) {
                            handleNavigation(category.path, category.name);
                          } else {
                            setHoveredCategory(hoveredCategory === category.name ? null : category.name);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {hoveredCategory && (
                <div className="bg-teal-50 rounded-xl p-2 border border-teal-200">
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                    <SubmenuList
                      category={landCategories.find((c) => c.name === hoveredCategory)}
                      mobile
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-none mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-2/3">
              <section ref={resultsRef} className="scroll-mt-40 lg:scroll-mt-48">
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 border border-teal-200">
                      <span className="text-sm font-medium text-teal-700">Active Filter:</span>
                      <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        {activeLandSubMenuType || activeLandType}
                      </span>
                      {getParentCategory(activeLandType) && (
                        <span className="text-xs text-teal-500">({getParentCategory(activeLandType)})</span>
                      )}
                    </div>
                    <PropertyList
                      properties={paginatedProperties}
                      emptyIcon="🌾"
                      emptyTitle={`No ${activeLandSubMenuType || (activeLandType !== "All" ? activeLandType : "")} Agricultural Land Found`}
                      emptyMessage={
                        activeLandType !== "All"
                          ? `We don't have any ${(activeLandSubMenuType || activeLandType).toLowerCase()} listings available at the moment.`
                          : "Hover over any category above and select a subcategory to find agricultural land."
                      }
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                  </>
                )}
              </section>
            </div>

            {/* Filters Sidebar */}
            <div className="hidden lg:block lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
                <div className="bg-gradient-to-b from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-teal-200/30 hover:shadow-[0_0_40px_rgba(0,105,92,0.2)] transition-all duration-500">
                  <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 animate-pulse-slow">
                      <Filter className="w-5 h-5 animate-rotate-slow" style={{ color: "#00695C" }} />
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                      Advanced Filters
                    </span>
                  </h3>

                  <div className="mb-6 animate-fade-in-up delay-100">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">💰</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Price Range
                      </span>
                    </label>
                    <div className="flex gap-3">
                      <input type="number" placeholder="Min" className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl" />
                      <input type="number" placeholder="Max" className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl" />
                    </div>
                    <div className="mt-3 h-2 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-progress"></div>
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-200">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">📐</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Area (sq. ft. / acres)
                      </span>
                    </label>
                    <div className="flex gap-3">
                      <input type="number" placeholder="Min Area" className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl" />
                      <input type="number" placeholder="Max Area" className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl" />
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-300">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">🏢</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Land Category
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {landCategories.filter(c => !c.isAllButton).map((category, index) => (
                        <label
                          key={category.name}
                          onMouseEnter={() => setHoveredFilter(`cat-${index}`)}
                          onMouseLeave={() => setHoveredFilter(null)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
                            hoveredFilter === `cat-${index}` ? 'scale-[1.02]' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <input type="checkbox" className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300" />
                          <span className="flex items-center gap-2 text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
                            {category.icon}
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-400">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">🌾</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Agricultural Features
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Water Source Available", "Fertile Soil", "Irrigation Facility", "Road Access", "Electricity Connection", "Fencing Available", "Near Market", "Organic Certified", "Flat Terrain", "Storage Shed", "Labor Quarters", "Government Approved"].map((feature) => (
                        <label key={feature} className="flex items-center gap-3 p-2 rounded-lg border border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-teal-50/50">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30" />
                          <span className="text-xs text-teal-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-teal-200/30 animate-fade-in-up delay-500">
                    <button className="flex-1 px-4 py-3 rounded-xl border-2 border-teal-200/50 text-sm font-medium text-teal-700 hover:bg-gradient-to-r from-teal-50 to-emerald-50 hover:border-teal-300 transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">Clear All</span>
                    </button>
                    <button className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl hover:shadow-[0_0_25px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #00695C, #26A69A) 200% 200%" }}>
                      <div className="absolute inset-0 animate-gradient-shift"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Apply Filters
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes diamond-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes diamond-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        .animate-diamond-float { animation: diamond-float 4s ease-in-out infinite; }
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow { background-size: 200% 200%; animation: gradient-flow 20s ease infinite; }
        .animate-gradient-slow { background-size: 300% 300%; animation: gradient-flow 15s ease infinite; }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-flow 2s linear infinite; }
        .animate-gradient-shift-slow { background-size: 200% 200%; animation: gradient-flow 4s linear infinite; }
        .animate-gradient-text { background-size: 300% 300%; animation: gradient-flow 3s ease infinite; }
        .animate-gradient-text-slow { background-size: 300% 300%; animation: gradient-flow 5s ease infinite; }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; }
        }
        .animate-particle-float { animation: particle-float 12s ease-in-out infinite; }
        @keyframes geometric-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
        }
        .animate-geometric-float { animation: geometric-float 20s ease-in-out infinite; }
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-25px) scale(1.2); opacity: 0.8; }
        }
        .animate-bubble-float { animation: bubble-float 6s ease-in-out infinite; }
        @keyframes float-glow {
          0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
          50% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(0,105,92,0.5); }
        }
        .animate-float-glow { animation: float-glow 3s ease-in-out infinite; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
        .animate-slide-down-fast { animation: slide-down 0.2s ease-out forwards; }
        @keyframes slide-in-right {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-rotate-slow { animation: spin-slow 10s linear infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 75%; }
        }
        .animate-progress { animation: progress 1.5s ease-out forwards; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(0, 105, 92, 0.1);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #00695C, #26A69A);
          border-radius: 10px;
        }
        .lg\\:custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .lg\\:custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, transparent, rgba(0, 105, 92, 0.1), transparent);
          border-radius: 10px;
        }
        .lg\\:custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        .lg\\:custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #004D40, #00796B);
          box-shadow: 0 0 10px rgba(0, 105, 92, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AgriculturalLandPlotsPage;
