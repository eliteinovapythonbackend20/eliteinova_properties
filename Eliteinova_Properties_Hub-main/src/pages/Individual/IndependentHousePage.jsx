import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, ChevronRight, Instagram, Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useNavigation from "../../hooks/useNavigation.js";
import { usePropertyFilter } from "../../hooks/usePropertyFilter";
import { searchPropertiesSimple } from "../../services/filterService";
import PropertyList from "../../components/propertycard/PropertyList";
import IndependentHouseFilter from "../../components/filters/Individual/IndependentHouseFilter";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";

// Import images for the banner
import mainPropertyImage from "../../assets/indmainbanner.jpg"; // Replace with your main image
import apartmentImg from "../../assets/banner1.jpg";
import villaImg from "../../assets/banner1.jpg";
import commercialImg from "../../assets/banner1.jpg";
import landImg from "../../assets/banner1.jpg";

// Import category images
import independentHouseImg from "../../assets/banner1.jpg";
import independentVillaImg from "../../assets/banner1.jpg";
import residentialApartmentImg from "../../assets/banner1.jpg";
import duplexResidentialImg from "../../assets/banner1.jpg";
import rowHouseImg from "../../assets/banner1.jpg";

const IndependentHousePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ USE CENTRALIZED HOOK
  const {
    activeHouseType,
    handleNavigation,
    data,
    loading
  } = useNavigation();

  // ✅ USE CENTRALIZED FILTER HOOK
  const {
    filteredData,
    filterLoading,
    appliedFilters,
    handleFilterChange
  } = usePropertyFilter('individual');

  // ─── Listing-purpose filter (Buy/Rent/Lease pill, combined with this
  // page's own property_type — stays on this page instead of navigating
  // away to a separate /buy, /rent, /lease route) ───────────────────────
  const [listingPurpose, setListingPurpose] = useState(null); // null = "All"
  const [purposeFilteredProperties, setPurposeFilteredProperties] = useState([]);
  const [purposeLoading, setPurposeLoading] = useState(false);

  useEffect(() => {
    if (!listingPurpose || !activeHouseType || activeHouseType === "All") {
      setPurposeFilteredProperties([]);
      return;
    }
    let cancelled = false;
    setPurposeLoading(true);
    searchPropertiesSimple({
      property_type: activeHouseType,
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
  }, [listingPurpose, activeHouseType]);

  // ─── Combine Data from All Sources ────────────────────────────────────
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

  // ─── Pagination — client-side over the current properties list ────────
  const resultsRef = useRef(null);
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProperties,
    goToPage
  } = usePagination({ items: properties, pageSize: 10, scrollRef: resultsRef });

  const [activeButton, setActiveButton] = useState("All");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);

  const propertyCategories = [
    { name: "Apartment", path: "/apartment", icon: <Building className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  // Property type categories with images for round display - includes "All"
  const propertyTypeCategories = [
    { 
      name: "All", 
      path: "/individual", 
      image: null,
      icon: <Home className="w-7 h-7" />,
      isAll: true
    },
    { 
      name: "Independent House", 
      path: "/individual/independent-house", 
      image: independentHouseImg,
      icon: <Home className="w-6 h-6" />
    },
    { 
      name: "Independent Villa", 
      path: "/individual/independent-villa", 
      image: independentVillaImg,
      icon: <Home className="w-6 h-6" />
    },
    // { 
    //   name: "Residential Apartment", 
    //   path: "/individual/residential-apartment", 
    //   image: residentialApartmentImg,
    //   icon: <Building className="w-6 h-6" />
    // },
    { 
      name: "Duplex Unit", 
      path: "/individual/duplex-residential-unit", 
      image: duplexResidentialImg,
      icon: <Building2 className="w-6 h-6" />
    },
    // { 
    //   name: "Row House", 
    //   path: "/individual/row-house", 
    //   image: rowHouseImg,
    //   icon: <Home className="w-6 h-6" />
    // }
  ];

  const houseTypes = [
    { name: "All", path: "/individual", component: "IndividualPage" },
    { name: "Independent House", path: "/individual/independent-house", component: "IndependentHousePage" },
    { name: "Independent Villa", path: "/individual/independent-villa", component: "IndependentVillaPage" },
    { name: "Residential Apartment", path: "/individual/residential-apartment", component: "ResidentialApartmentPage" },
    { name: "Duplex Residential Unit", path: "/individual/duplex-residential-unit", component: "DuplexResidentialUnitPage" },
    { name: "Row House", path: "/individual/row-house", component: "RowHousePage" }
  ];

  // Diamond data - matches the reference banner: a single horizontal row,
  // each diamond has a small icon badge and a label underneath.
  const bannerDiamonds = [
    {
      image: apartmentImg,
      label: "Apartments",
      icon: <Building className="w-3.5 h-3.5" style={{ color: "#00695C" }} />,
      path: "/apartment"
    },
    {
      image: villaImg,
      label: "Hostel",
      icon: <Building2 className="w-3.5 h-3.5" style={{ color: "#00695C" }} />,
      path: "/hostel"
    },
    {
      image: commercialImg,
      label: "Commercial",
      icon: <Landmark className="w-3.5 h-3.5" style={{ color: "#00695C" }} />,
      path: "/commercial"
    },
    {
      image: landImg,
      label: "Land & Plots",
      icon: <Warehouse className="w-3.5 h-3.5" style={{ color: "#00695C" }} />,
      path: "/land-plots"
    }
  ];

  // ❌ REMOVED: Local useEffect - Hook handles this automatically
  // useEffect(() => {
  //   const currentPath = location.pathname;
  //   const activeType = houseTypes.find(type => type.path === currentPath);
  //   if (activeType) {
  //     setActiveHouseType(activeType.name);
  //   } else if (currentPath === "/individual" || currentPath === "/individual/") {
  //     setActiveHouseType("All");
  //   }
  // }, [location.pathname]);

  // ❌ REMOVED: Local handleNavigation - Using hook's handleNavigation
  // const handleNavigation = (path, typeName = null) => {
  //   if (typeName) {
  //     setActiveHouseType(typeName);
  //   }
  //   navigate(path);
  // };

  const handlePropertyCategoryNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-teal-50 via-white to-teal-50">
      <div className="relative z-10">
        {/* ===================== BANNER - SAME AS HOSTEL PAGE ===================== */}
        <section className="relative overflow-hidden bg-[#E7EFEA]">
          {/* Decorative top shape */}
          <div className="absolute top-0 left-0 w-[130px] h-[45px] rounded-br-[35px] sm:w-[170px] sm:h-[58px] sm:rounded-br-[50px] md:w-[210px] md:h-[72px] md:rounded-br-[60px] lg:w-[250px] lg:h-[85px] lg:rounded-br-[70px] bg-[#D6E4DE]" />

          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-row min-h-[170px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[330px]">

              {/* LEFT CONTENT */}
              <div className="flex flex-col justify-center w-[38%] sm:w-[37%] md:w-[36%] lg:w-[35%] shrink-0 px-2.5 sm:px-5 md:px-6 lg:px-10 py-2.5 sm:py-4 md:py-6 lg:py-7 z-20">

                <h1 className="leading-none">
                  <span className="block text-[11px] sm:text-[15px] md:text-[20px] lg:text-[28px] font-light text-[#042F2A]">
                    MODERN
                  </span>

                  <span className="block text-[16px] sm:text-[24px] md:text-[36px] lg:text-[50px] font-black text-[#012D29] leading-tight">
                    INDIVIDUAL
                  </span>

                  <span className="block text-[12px] sm:text-[17px] md:text-[23px] lg:text-[30px] font-bold text-[#012D29] leading-tight">
                    HOUSES FOR SALE
                  </span>
                </h1>

                <p className="mt-1 sm:mt-2 md:mt-2.5 lg:mt-3 max-w-[120px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px] text-[#31544E] text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-snug lg:leading-relaxed">
                  Discover premium independent houses,
                  villas, duplex units and row houses in
                  prime locations.
                </p>

                <button
                  className="mt-1.5 sm:mt-2.5 md:mt-3 lg:mt-4 w-fit px-2.5 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-1.5 lg:px-6 lg:py-2 rounded-md lg:rounded-lg text-white font-bold shadow-md lg:shadow-xl text-[7px] sm:text-[9px] md:text-[11px] lg:text-sm"
                  style={{
                    background: "linear-gradient(135deg,#00695C,#26A69A)"
                  }}
                >
                  EXPLORE NOW
                </button>
              </div>

              {/* RIGHT COLLAGE */}
              <div className="relative overflow-hidden flex-1" style={{ aspectRatio: '16/8' }}>
                {/* Main Building Background */}
                <img
                  src={mainPropertyImage}
                  alt="Individual property"
                  className="absolute inset-0 w-full h-full object-cover object-top brightness-75"
                />

                {/* Soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#E7EFEA] via-transparent to-transparent" />

                {/* DIAMOND COLLAGE */}
                <div className="absolute inset-0 flex items-center justify-start pl-2 sm:pl-4 md:pl-6 lg:pl-7 z-20">
                  <div className="relative w-[260px] h-[260px] scale-[0.42] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-left transition-transform duration-300">

                    {/* TOP DIAMOND - Individual */}
                    <div
                      className="absolute cursor-pointer transition-all duration-500 hover:scale-110 hover:z-30 animate-diamond-float"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "0px",
                        left: "80px",
                        animationDelay: "0s",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[0].path)}
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
                          src={bannerDiamonds[0].image}
                          alt="Individual"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/diamond:scale-125"
                          style={{
                            transform: "rotate(-45deg) scale(1.3)",
                            transformOrigin: "center",
                          }}
                        />
                        
                        <div 
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            transform: "rotate(-45deg) scale(1.3)",
                            transformOrigin: "center",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/diamond:translate-x-full transition-transform duration-1000" />
                        </div>
                        
                        <div
                          className="absolute inset-0 transition-opacity duration-500 group-hover/diamond:opacity-80"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10 transition-all duration-300 group-hover/diamond:scale-110">
                          Individual
                        </span>
                      </div>
                      
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping" />
                    </div>

                    {/* LEFT DIAMOND - Apartment */}
                    <div
                      className="absolute cursor-pointer transition-all duration-500 hover:scale-110 hover:z-30 animate-diamond-float"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "80px",
                        left: "0px",
                        animationDelay: "0.5s",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[1].path)}
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
                          src={bannerDiamonds[1].image}
                          alt="Apartment"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/diamond:scale-125"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        />
                        
                        <div 
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/diamond:translate-x-full transition-transform duration-1000" />
                        </div>
                        
                        <div
                          className="absolute inset-0 transition-opacity duration-500 group-hover/diamond:opacity-80"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10 transition-all duration-300 group-hover/diamond:scale-110">
                          Apartment
                        </span>
                      </div>
                      
                      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping" />
                    </div>

                    {/* RIGHT DIAMOND - Commercial */}
                    <div
                      className="absolute cursor-pointer transition-all duration-500 hover:scale-110 hover:z-30 animate-diamond-float"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "80px",
                        left: "160px",
                        animationDelay: "1s",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[2].path)}
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
                          src={bannerDiamonds[2].image}
                          alt="Commercial"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/diamond:scale-125"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        />
                        
                        <div 
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/diamond:translate-x-full transition-transform duration-1000" />
                        </div>
                        
                        <div
                          className="absolute inset-0 transition-opacity duration-500 group-hover/diamond:opacity-80"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[10px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center leading-tight z-10 transition-all duration-300 group-hover/diamond:scale-110">
                          Commercial
                        </span>
                      </div>
                      
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping" />
                    </div>

                    {/* BOTTOM DIAMOND - Land & Plots */}
                    <div
                      className="absolute cursor-pointer transition-all duration-500 hover:scale-110 hover:z-30 animate-diamond-float"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "160px",
                        left: "80px",
                        animationDelay: "1.5s",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[3].path)}
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
                          src={bannerDiamonds[3].image}
                          alt="Land & Plots"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/diamond:scale-125"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        />
                        
                        <div 
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/diamond:translate-x-full transition-transform duration-1000" />
                        </div>
                        
                        <div
                          className="absolute inset-0 transition-opacity duration-500 group-hover/diamond:opacity-80"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10 transition-all duration-300 group-hover/diamond:scale-110">
                          Land & Plots
                        </span>
                      </div>
                      
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#C9A227] opacity-0 group-hover/diamond:opacity-100 group-hover/diamond:animate-ping" />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =================== END BANNER =================== */}

        {/* =================== MENU - SAME AS HOSTEL PAGE =================== */}
        <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500">
          <div className="max-w-none mx-auto px-6 py-3.5">
            <div className="hidden md:block space-y-3.5">
              <div className="flex gap-3.5 items-center">
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
                    className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #00695C, #26A69A)",
                      backgroundSize: "200% 200%"
                    }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow"></div>
                    <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10 text-sm">{activeButton}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </button>

                  {openDropdown === "toggle" && (
                    <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[170px] border border-teal-200/30 animate-slide-down-fast">
                      {["All", "Buy", "Rent", "Lease"].map((item, idx, arr) => (
                        <React.Fragment key={item}>
                          <button
                            onClick={() => { setListingPurpose(item === "All" ? null : item); setActiveButton(item); setOpenDropdown(null); }}
                            className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                            style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
                          >
                            <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                              {item}
                            </div>
                          </button>
                          {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    placeholder="Search by city, locality, or landmark"
                    className="w-full pl-9 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                  <MapPin className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
                </div>

                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                  <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10 text-sm">Advanced Filters</span>
                  {appliedFilters && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>

              {/* ====== PROPERTY TYPE CATEGORIES - SAME AS HOSTEL PAGE ====== */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 md:gap-5 pt-1.5">
                {propertyTypeCategories.map((category) => {
                  const isActive = activeHouseType === category.name || 
                    (category.name === "All" && activeHouseType === "All");
                  
                  return (
                    <div
                      key={category.name}
                      className="group cursor-pointer flex flex-col items-center transition-all duration-300 hover:scale-105"
                      onClick={() => handleNavigation(category.path, category.name)}
                    >
                      {/* Round Image - Same as HostelPage */}
                      <div 
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-17 md:h-17 rounded-full overflow-hidden border-[3px] transition-all duration-300 shadow-md hover:shadow-lg ${
                          isActive 
                            ? 'border-[#00695C] shadow-[0_0_18px_rgba(0,105,92,0.3)]' 
                            : 'border-gray-300 hover:border-[#00695C]'
                        }`}
                      >
                        {category.isAll ? (
                          <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                            isActive ? 'bg-[#00695C]' : 'bg-gray-100 group-hover:bg-[#D1E2DB]'
                          }`}>
                            <Home className={`w-5 h-5 md:w-5.5 md:h-5.5 transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-[#00695C]'
                            }`} />
                          </div>
                        ) : (
                          <>
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </>
                        )}
                      </div>
                      
                      {/* Label - Two lines */}
                      <div className="flex flex-col items-center mt-0.5">
                        <span className={`text-[8px] sm:text-[9px] md:text-[11px] font-semibold text-center leading-tight transition-colors duration-300 ${
                          isActive ? 'text-[#00695C]' : 'text-[#143B35] group-hover:text-[#00695C]'
                        }`}>
                          {category.displayName || category.name}
                        </span>
                        {category.subText && (
                          <span className={`text-[8px] sm:text-[9px] md:text-[11px] font-semibold text-center leading-tight transition-colors duration-300 ${
                            isActive ? 'text-[#00695C]' : 'text-[#143B35] group-hover:text-[#00695C]'
                          }`}>
                            {category.subText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =================== MOBILE MENU - SAME AS HOSTEL PAGE =================== */}
            <div className="md:hidden space-y-3">
              <div className="flex gap-2.5 items-center">
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
                    className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl"
                    style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                    <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10 text-sm">{activeButton}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
                  </button>

                  {openDropdown === "toggle" && (
                    <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[170px] border border-teal-200/30 animate-slide-down-fast">
                      {["All", "Buy", "Rent", "Lease"].map((item, idx, arr) => (
                        <React.Fragment key={item}>
                          <button
                            onClick={() => { setListingPurpose(item === "All" ? null : item); setActiveButton(item); setOpenDropdown(null); }}
                            className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                            style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
                          >
                            <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                              {item}
                            </div>
                          </button>
                          {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex-1 group">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    placeholder="Search individual..."
                    className="w-full pl-9 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                </div>

                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="group relative px-3.5 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                  <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10 hidden sm:inline text-sm">Filters</span>
                </button>
              </div>

              {/* ====== PROPERTY TYPE CATEGORIES - SAME AS HOSTEL PAGE ====== */}
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {propertyTypeCategories.map((category) => {
                  const isActive = activeHouseType === category.name ||
                    (category.name === "All" && activeHouseType === "All");

                  return (
                    <div
                      key={category.name}
                      className="flex flex-col items-center flex-shrink-0 transition-transform duration-200 active:scale-95"
                      onClick={() => handleNavigation(category.path, category.name)}
                    >
                      {/* Round Image - Same size as HostelPage */}
                      <div
                        className={`relative w-9 h-9 xs:w-10 xs:h-10 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                          isActive
                            ? 'border-[#00695C] shadow-[0_0_10px_rgba(0,105,92,0.3)]'
                            : 'border-gray-300'
                        }`}
                      >
                        {category.isAll ? (
                          <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                            isActive ? 'bg-[#00695C]' : 'bg-gray-100'
                          }`}>
                            <Home className={`w-3.5 h-3.5 transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-[#00695C]'
                            }`} />
                          </div>
                        ) : (
                          <>
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </>
                        )}
                      </div>

                      {/* Label - Same as HostelPage */}
                      <div className="flex flex-col items-center mt-0.5">
                        <span className={`text-[7px] font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
                          isActive ? 'text-[#00695C]' : 'text-[#143B35]'
                        }`}>
                          {category.displayName || category.name}
                        </span>
                        {category.subText && (
                          <span className={`text-[7px] font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
                            isActive ? 'text-[#00695C]' : 'text-[#143B35]'
                          }`}>
                            {category.subText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =================== FILTER MODAL - USING EXISTING FILTER =================== */}
        {/* =================== MOBILE FILTER MODAL =================== */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[140px] px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in md:hidden">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <IndependentHouseFilter
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}

        {/* =================== MAIN CONTENT =================== */}
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
                    <PropertyList
                      properties={paginatedProperties}
                      emptyMessage={
                        activeHouseType !== "All"
                          ? `We don't have any ${activeHouseType.toLowerCase()} properties available at the moment.`
                          : "We're currently adding exclusive individual properties to our database."
                      }
                      emptyIcon="🏠"
                      emptyTitle={`No ${activeHouseType !== "All" ? `${activeHouseType} ` : ""}Properties Found`}
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                  </>
                )}
              </section>
            </div>

            <div className="hidden lg:block lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
                <IndependentHouseFilter activeTab={activeButton} onFilterChange={handleFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 2s linear infinite;
        }
        .animate-gradient-shift-slow {
          background-size: 200% 200%;
          animation: gradient-shift 4s linear infinite;
        }
        @keyframes diamond-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes diamond-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-diamond-float {
          animation: diamond-float 4s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down-fast {
          animation: slide-down 0.2s ease-out forwards;
        }
        @keyframes slide-in-right {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-rotate-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 75%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-text-slow {
          background-size: 300% 300%;
          animation: gradient-text 5s ease infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default IndependentHousePage;
