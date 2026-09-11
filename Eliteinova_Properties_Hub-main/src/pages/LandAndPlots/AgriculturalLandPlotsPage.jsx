import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Store, Factory, Hotel, Briefcase, Trees, Sprout, Heart, School, Layers, ChevronRight, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/landandplots/mainbg.png";
import useNavigation from "../../hooks/useNavigation";
import { usePropertyFilter } from "../../hooks/usePropertyFilter";

const AgriculturalLandPlotsPage = () => {
  const navigate = useNavigate();
  
  // ✅ USE CENTRALIZED NAVIGATION HOOK
  const { 
    data, 
    loading, 
    activeLandType,
    activeLandSubMenuType,
    handleNavigation,
    getLandSubMenuDetails,
    getSubMenusByProperty
  } = useNavigation();
  
  // ✅ USE CENTRALIZED FILTER HOOK
  const { 
    filteredData, 
    filterLoading, 
    appliedFilters, 
    handleFilterChange 
  } = usePropertyFilter();

  // ─── Combine Data from Both Hooks ────────────────────────────────────
  const properties = useMemo(() => {
    if (appliedFilters && filteredData.length > 0) {
      return filteredData;
    }
    return data;
  }, [data, filteredData, appliedFilters]);

  const isLoading = loading || filterLoading;

  const [activeButton, setActiveButton] = useState("Buy");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);

  const propertyCategories = [
    { name: "Individual", path: "/individual", icon: <Building className="w-4 h-4" /> },
    { name: "Apartment", path: "/apartment", icon: <Landmark className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  // Main categories with submenus
  const landCategories = [
    {
      name: "All",
      icon: <Compass className="w-3.5 h-3.5" />,
      path: "/land-plots",
      isAllButton: true,
      submenus: []
    },
    {
      name: "Residential Land / Plots",
      icon: <Building className="w-3.5 h-3.5" />,
      path: "/land-plots/residential-land-plots",
      submenus: [
        "Residential Plot",
        "DTCP & CMDA Approved Plot",
        "Gated Community Plot",
        "Villa Plot",
        "Farm House Plot",
        "Common Plot",
        "Independent House Plot",
        "Duplex House Plot",
        "Row House Plot"
      ]
    },
    {
      name: "Commercial Land / Plots",
      icon: <Building2 className="w-3.5 h-3.5" />,
      path: "/land-plots/commercial-land-plots",
      submenus: [
        "Commercial Plot",
        "Office Space Land",
        "Retail Shop Plot",
        "Showroom Plot",
        "Shopping Complex Land",
        "Hotel / Resort Land",
        "Petrol Bunk Plot",
        "IT Park Land",
        "Warehouse Land",
        "Industrial Commercial Plot"
      ]
    },
    {
      name: "Agricultural Land",
      icon: <Sprout className="w-3.5 h-3.5" />,
      path: "/land-plots/agricultural-land-plots",
      submenus: [
        "Agricultural Land",
        "Farm Land",
        "Organic Farming Land",
        "Coconut Farm Land",
        "Mango Grove Land",
        "Tea / Coffee Estate",
        "Poultry Farm Land",
        "Dairy Farm Land",
        "Fisheries / Aquaculture Land"
      ]
    },
    {
      name: "Industrial Land",
      icon: <Factory className="w-3.5 h-3.5" />,
      path: "/land-plots/industrial-land-plots",
      submenus: [
        "Industrial Plot",
        "Factory Land",
        "Manufacturing Unit Plot",
        "Logistics Hub Land",
        "Warehouse Plot",
        "Cold Storage Land",
        "SEZ Land (Special Economic Zone)"
      ]
    },
    {
      name: "Mixed-Use Land",
      icon: <Layers className="w-3.5 h-3.5" />,
      path: "/land-plots/mixed-use-land-plots",
      submenus: [
        "Residential + Commercial Plot",
        "Commercial + Industrial Land",
        "Township Development Land",
        "Multi-purpose Development Land"
      ]
    },
    {
      name: "Institutional Land",
      icon: <School className="w-3.5 h-3.5" />,
      path: "/land-plots/institutional-land-plots",
      submenus: [
        "School / College Land",
        "Hospital / Clinic Land",
        "Training Institute Plot",
        "Religious Institution Land"
      ]
    },
    {
      name: "Investment & Special Purpose Land",
      icon: <Heart className="w-3.5 h-3.5" />,
      path: "/land-plots/investment-land-plots",
      submenus: [
        "Highway Facing Plot",
        "Lake View Plot",
        "Hill View Plot",
        "Beach Side Plot",
        "River Side Land",
        "Eco Tourism Land",
        "Layout Development Land",
        "Future Investment Plot"
      ]
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

  // ❌ REMOVED: Local useEffect - Hook handles this automatically
  // useEffect(() => {
  //   const currentPath = location.pathname;
  //   // ... all path detection logic
  // }, [location.pathname]);

  // ❌ REMOVED: Local handleNavigation - Using hook's handleNavigation
  // const handleNavigation = (path, typeName = null) => {
  //   if (typeName) {
  //     setActiveLandType(typeName);
  //   }
  //   navigate(path);
  // };

  const handlePropertyCategoryNavigation = (path) => {
    navigate(path);
  };

  // ❌ REMOVED: Local handleFilterChange - Using hook's handleFilterChange
  // const handleFilterChange = (filters) => {
  //   setAppliedFilters(filters);
  //   console.log("Applied Filters:", filters);
  // };

  const getParentCategory = (typeName) => {
    const landType = landTypes.find(t => t.name === typeName);
    return landType?.parent || null;
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
        {/* Hero Section */}
        <section className="w-full h-[300px] md:h-[400px] relative flex items-center overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={`dot-${i}`}
                className="absolute w-2 h-2 bg-teal-400/30 rounded-full animate-bubble-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>
          <div className="max-w-none mx-auto px-6 relative z-10 text-center w-full">
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-lg border border-teal-300/20 animate-float-glow shadow-[0_0_30px_rgba(0,105,92,0.3)]">
              <Star className="w-4 h-4 text-teal-300 animate-spin-slow" fill="currentColor" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-sm font-medium">
                Agricultural Land & Plots
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.5)]">
              Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">Agricultural Land</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed ">
              Discover premium agricultural lands and farm plots for your agricultural needs
            </p>
            <div className="flex flex-wrap justify-center gap-4 px-4 animate-fade-in-up delay-200">
              {propertyCategories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => handlePropertyCategoryNavigation(category.path)}
                  className={`group relative px-7 py-3.5 rounded-xl text-white font-semibold text-base shadow-2xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up ${
                    category.name === "Land & Plots" ? "ring-2 ring-teal-300 ring-offset-2 ring-offset-teal-900/30" : ""
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    background: category.name === "Land & Plots" 
                      ? "linear-gradient(135deg, #004D40, #00695C, #00897B) 200% 200%"
                      : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC) 200% 200%"
                  }}
                >
                  <div className="absolute inset-0 animate-gradient-shift"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky Header with Hover Dropdown Menus */}
        <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="max-w-none mx-auto px-6 py-4">
            <div className="hidden md:block space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
                    className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #00695C, #26A69A) 200% 200%"
                    }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow"></div>
                    <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">{activeButton}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  </button>

                  {openDropdown === "toggle" && (
                    <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30 animate-slide-down-fast">
                      {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
                        <React.Fragment key={item}>
                          <button
                            onClick={() => { 
                              handleNavigation(`/${item.toLowerCase()}`); 
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

                <div className="relative flex-1 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    placeholder="Search by city, locality, or landmark"
                    className="w-full pl-10 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
                </div>
              </div>

              {/* Main Categories with Hover Dropdown */}
              <div className="flex flex-wrap gap-2">
                {landCategories.map((category) => {
                  const mainCategoryActiveMap = {
                    "Residential Land / Plots": "Residential Land / Plots",
                    "Commercial Land / Plots": "Commercial Land / Plots",
                    "Agricultural Land": "Agricultural Land / Plots",
                    "Industrial Land": "Industrial Land / Plots",
                    "Mixed-Use Land": "Mixed-Use Land / Plots",
                    "Institutional Land": "Institutional Land / Plots",
                    "Investment & Special Purpose Land": "Investment & Special Purpose Land / Plots",
                  };
                  const isActive = activeLandType === (mainCategoryActiveMap[category.name] || category.name);
                  
                  return (
                    <div
                      key={category.name}
                      className="relative"
                      onMouseEnter={() => !category.isAllButton && setHoveredCategory(category.name)}
                      onMouseLeave={() => !category.isAllButton && setHoveredCategory(null)}
                    >
                      <button
                        onClick={() => {
                          if (category.isAllButton) {
                            handleNavigation(category.path, "All");
                          } else if (category.path) {
                            handleNavigation(category.path, category.name);
                          }
                        }}
                        className={`group relative px-4 py-2 rounded-lg font-semibold text-sm shadow-xl transition-all duration-500 whitespace-nowrap transform hover:-translate-y-1 hover:scale-105 overflow-hidden flex items-center gap-2 ${
                          isActive
                            ? "text-teal-800 bg-white shadow-none ring-2 ring-teal-600" 
                            : "text-white/90 hover:text-white"
                        }`}
                        style={{
                          background: isActive
                            ? "#E8F5F2" 
                            : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC) 200% 200%",
                          border: "none"
                        }}
                      >
                        <div className={`absolute inset-0 animate-gradient-shift-slow ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'}`}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          {category.icon}
                          {category.name}
                        </span>
                        {!category.isAllButton && (
                          <ChevronDown className={`w-3 h-3 transition-transform duration-300 relative z-10 ${hoveredCategory === category.name ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Submenu Dropdown */}
                      {!category.isAllButton && hoveredCategory === category.name && category.submenus.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 bg-teal-50/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 min-w-[240px] border border-teal-200/30 animate-slide-down-fast">
                          <div className="py-2 max-h-[400px] overflow-y-auto">
                            {category.submenus.map((submenu) => {
                              const isSubmenuActive = activeLandType === submenu;
                              return (
                                <button
                                  key={submenu}
                                  onClick={() => {
                                    const landType = landTypes.find(t => t.name === submenu);
                                    if (landType) {
                                      handleNavigation(landType.path, submenu);
                                    }
                                    setHoveredCategory(null);
                                  }}
                                  className={`w-full px-4 py-2 text-left text-sm transition-all duration-300 group flex items-center gap-2 ${
                                    isSubmenuActive
                                      ? "bg-teal-600 text-white font-semibold"
                                      : "text-teal-900 hover:bg-teal-600 hover:text-white"
                                  }`}
                                >
                                  <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${
                                    isSubmenuActive ? "text-white" : "text-teal-500 group-hover:text-white group-hover:translate-x-1"
                                  }`} />
                                  {submenu}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {landCategories.map((category) => {
                  const mainCategoryActiveMap = {
                    "Residential Land / Plots": "Residential Land / Plots",
                    "Commercial Land / Plots": "Commercial Land / Plots",
                    "Agricultural Land": "Agricultural Land / Plots",
                    "Industrial Land": "Industrial Land / Plots",
                    "Mixed-Use Land": "Mixed-Use Land / Plots",
                    "Institutional Land": "Institutional Land / Plots",
                    "Investment & Special Purpose Land": "Investment & Special Purpose Land / Plots",
                  };
                  const isActive = activeLandType === (mainCategoryActiveMap[category.name] || category.name);
                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        if (category.isAllButton) {
                          handleNavigation(category.path, "All");
                        } else {
                          setHoveredCategory(hoveredCategory === category.name ? null : category.name);
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? "bg-white text-teal-800 ring-2 ring-teal-600 shadow-md"
                          : "bg-gradient-to-r from-teal-600 to-teal-500 text-white/90 hover:text-white"
                      }`}
                    >
                      {category.icon}
                      {category.name}
                      {!category.isAllButton && (
                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${hoveredCategory === category.name ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Mobile Submenu */}
              {hoveredCategory && (
                <div className="bg-teal-50 rounded-xl p-2 border border-teal-200">
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                    {landCategories.find(c => c.name === hoveredCategory)?.submenus.map((submenu) => {
                      const isSubmenuActive = activeLandType === submenu;
                      return (
                        <button
                          key={submenu}
                          onClick={() => {
                            const landType = landTypes.find(t => t.name === submenu);
                            if (landType) {
                              handleNavigation(landType.path, submenu);
                            }
                            setHoveredCategory(null);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            isSubmenuActive
                              ? "bg-teal-600 text-white"
                              : "bg-white text-teal-700 hover:bg-teal-600 hover:text-white"
                          }`}
                        >
                          {submenu}
                        </button>
                      );
                    })}
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
              <section>
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 text-center border border-teal-200/30 hover:shadow-[0_0_60px_rgba(0,105,92,0.3)] transition-all duration-700 group animate-fade-in-up">
                    <div className="absolute inset-0 opacity-[0.03] rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent animate-shimmer"></div>
                    </div>
                    
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 border border-teal-200">
                      <span className="text-sm font-medium text-teal-700">Active Filter:</span>
                      <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        {activeLandType}
                      </span>
                      {getParentCategory(activeLandType) && (
                        <span className="text-xs text-teal-500">({getParentCategory(activeLandType)})</span>
                      )}
                    </div>
                    
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_50px_rgba(0,105,92,0.5)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 relative"
                      style={{
                        background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC) 200% 200%"
                      }}
                    >
                      <div className="absolute inset-0 animate-gradient-shift-slow rounded-3xl"></div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                      <Sprout className="w-12 h-12 text-white group-hover:rotate-12 transition-transform duration-700 relative z-10" />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4 group-hover:text-teal-950 transition-colors duration-300">
                      {activeLandType === "All" ? "Premium Agricultural Land & Plots" : `${activeLandType} Properties`}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 animate-gradient-text-slow"> Coming Soon</span>
                    </h2>
                    
                    <p className="text-teal-800 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed group-hover:text-teal-900 transition-colors duration-300 backdrop-blur-sm bg-teal-100/30 rounded-2xl p-6 border border-teal-200/20">
                      {activeLandType === "All" 
                        ? "We're currently adding verified agricultural land and farm plot listings across all categories."
                        : `We're currently adding exclusive ${activeLandType.toLowerCase()} listings to our database.`}
                      <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-xl">
                        Check back soon for amazing deals!
                      </span>
                    </p>
                    
                    <div className="mt-8 flex justify-center gap-4">
                      <button className="group relative px-6 py-3 rounded-xl border-2 border-teal-500 text-teal-600 font-semibold hover:bg-gradient-to-r from-teal-50 to-emerald-50 transition-all duration-500 transform hover:scale-105 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10">Get Notified</span>
                      </button>
                      <button 
                        className="group relative px-6 py-3 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, #00695C, #26A69A) 200% 200%"
                        }}
                      >
                        <div className="absolute inset-0 animate-gradient-shift"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <span className="relative z-10">Browse Similar</span>
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <div className="mt-8 bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 text-center border border-teal-200/30 animate-fade-in-up delay-300">
                <div className="max-w-2xl mx-auto">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 mx-auto mb-6 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl animate-pulse-slow"></div>
                    <Sprout className="w-10 h-10 text-teal-600 animate-bounce-slow relative z-10" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-teal-900 mb-4">
                    No {activeLandType !== "All" ? `${activeLandType} ` : ""}Agricultural Land & Plots Found
                  </h3>
                  
                  <p className="text-teal-800 mb-6 backdrop-blur-sm bg-teal-100/30 rounded-xl p-4 border border-teal-200/20">
                    {activeLandType !== "All"
                      ? `We don't have any ${activeLandType.toLowerCase()} listings available at the moment.`
                      : "Hover over any category above and select a subcategory to find agricultural land and plots."}
                  </p>
                  
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 animate-pulse"
                        style={{ animationDelay: `${delay}ms` }}
                      ></div>
                    ))}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-medium">
                      {activeLandType !== "All" 
                        ? `Check back later for ${activeLandType.toLowerCase()} listings` 
                        : "Hover over a category above to explore available agricultural land types"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Sidebar */}
            <div className="lg:w-1/3 lg:relative">
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
                        Area (acres / sq. ft.)
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
                      {["Irrigation Facility", "Soil Testing Report", "Water Source", "Electricity Available", "Road Access", "Farm Equipment", "Storage Shed", "Organic Certified", "Greenhouse Facility", "Drip Irrigation", "Well Water", "River Access"].map((feature) => (
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
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 20s ease infinite;
        }
        .animate-gradient-slow {
          background-size: 300% 300%;
          animation: gradient-flow 15s ease infinite;
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-flow 2s linear infinite;
        }
        .animate-gradient-shift-slow {
          background-size: 200% 200%;
          animation: gradient-flow 4s linear infinite;
        }
        .animate-gradient-text {
          background-size: 300% 300%;
          animation: gradient-flow 3s ease infinite;
        }
        .animate-gradient-text-slow {
          background-size: 300% 300%;
          animation: gradient-flow 5s ease infinite;
        }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; }
        }
        .animate-particle-float {
          animation: particle-float 12s ease-in-out infinite;
        }
        @keyframes geometric-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
        }
        .animate-geometric-float {
          animation: geometric-float 20s ease-in-out infinite;
        }
        @keyframes bubble-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-25px) scale(1.2); opacity: 0.8; }
        }
        .animate-bubble-float {
          animation: bubble-float 6s ease-in-out infinite;
        }
        @keyframes float-glow {
          0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
          50% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(0,105,92,0.5); }
        }
        .animate-float-glow {
          animation: float-glow 3s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out forwards;
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-rotate-slow {
          animation: spin-slow 10s linear infinite;
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
        .lg\:custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .lg\:custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, transparent, rgba(0, 105, 92, 0.1), transparent);
          border-radius: 10px;
        }
        .lg\:custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        .lg\:custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #004D40, #00796B);
          box-shadow: 0 0 10px rgba(0, 105, 92, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AgriculturalLandPlotsPage;