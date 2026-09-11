import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Store, Factory, Hotel, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/house1.png";
import useNavigation from "../../hooks/useNavigation";
import { usePropertyFilter } from "../../hooks/usePropertyFilter";

// Import images for each property category
import individualImage from "../../assets/individualcat.jpg";
import apartmentImage from "../../assets/Apartmentcat.jpg";
import landPlotsImage from "../../assets/landcat.jpg";
import hostelImage from "../../assets/hostelcat.jpg";

const CommercialPage = () => {
  const navigate = useNavigate();
  
  // ✅ USE CENTRALIZED NAVIGATION HOOK
  const { 
    data, 
    loading, 
    activeCommercialType, 
    handleNavigation 
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

  const [activeButton, setActiveButton] = useState("Rent");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);

  const propertyCategories = [
    { 
      name: "Individual", 
      path: "/individual", 
      icon: <Building className="w-full h-full" />,
      image: individualImage 
    },
    { 
      name: "Apartment", 
      path: "/apartment", 
      icon: <Landmark className="w-full h-full" />,
      image: apartmentImage 
    },
    { 
      name: "Land & Plots", 
      path: "/land-plots", 
      icon: <Warehouse className="w-full h-full" />,
      image: landPlotsImage 
    },
    { 
      name: "Hostel", 
      path: "/hostel", 
      icon: <Building2 className="w-full h-full" />,
      image: hostelImage 
    }
  ];

  const commercialTypes = [
    { name: "All", path: "/commercial", component: "CommercialPage" },
    { name: "Office Space", path: "/commercial/office-space", component: "OfficeSpacePage" },
    { name: "Retail Shop", path: "/commercial/retail-shop", component: "RetailShopPage" },
    { name: "Showroom", path: "/commercial/showroom", component: "ShowroomPage" },
    { name: "Commercial Land / Plot", path: "/commercial/commercial-land-plot", component: "CommercialLandPlotPage" },
    { name: "Warehouse / Godown", path: "/commercial/warehouse-godown", component: "WarehouseGodownPage" },
    { name: "Industrial Property / Factory", path: "/commercial/industrial-property-factory", component: "IndustrialPropertyFactoryPage" },
    { name: "Co-working Space", path: "/commercial/coworking-space", component: "CoworkingSpacePage" },
    { name: "Business Center", path: "/commercial/business-center", component: "BusinessCenterPage" },
    { name: "Shopping Mall Space", path: "/commercial/shopping-mall-space", component: "ShoppingMallSpacePage" },
    { name: "Commercial Complex", path: "/commercial/commercial-complex", component: "CommercialComplexPage" },
    { name: "Restaurant / Café Space", path: "/commercial/restaurant-cafe-space", component: "RestaurantCafeSpacePage" },
    { name: "Hotel / Lodge / Resort Property", path: "/commercial/hotel-lodge-resort-property", component: "HotelLodgeResortPropertyPage" },
    { name: "Clinic / Hospital Space", path: "/commercial/clinic-hospital-space", component: "ClinicHospitalSpacePage" },
    { name: "Educational Institution Property", path: "/commercial/educational-institution-property", component: "EducationalInstitutionPropertyPage" },
    { name: "IT Park / Tech Park Space", path: "/commercial/it-park-tech-park-space", component: "ITParkTechParkSpacePage" },
    { name: "Multiplex / Entertainment Space", path: "/commercial/multiplex-entertainment-space", component: "MultiplexEntertainmentSpacePage" },
    { name: "Petrol Bunk / Fuel Station", path: "/commercial/petrol-bunk-fuel-station", component: "PetrolBunkFuelStationPage" },
    { name: "Cold Storage / Logistics Hub", path: "/commercial/cold-storage-logistics-hub", component: "ColdStorageLogisticsHubPage" },
    { name: "Mixed-use Commercial Property", path: "/commercial/mixed-use-commercial-property", component: "MixedUseCommercialPropertyPage" },
    { name: "Agricultural Commercial Property", path: "/commercial/agricultural-commercial-property", component: "AgriculturalCommercialPropertyPage" }
  ];

  // ❌ REMOVED: Local useEffect - Hook handles this automatically
  // useEffect(() => {
  //   const currentPath = location.pathname;
  //   const activeType = commercialTypes.find(type => type.path === currentPath);
  //   if (activeType) {
  //     setActiveCommercialType(activeType.name);
  //   } else if (currentPath === "/commercial" || currentPath === "/commercial/") {
  //     setActiveCommercialType("All");
  //   }
  // }, [location.pathname]);

  // ❌ REMOVED: Local handleNavigation - Using hook's handleNavigation
  // const handleNavigation = (path, typeName = null) => {
  //   if (typeName) {
  //     setActiveCommercialType(typeName);
  //   }
  //   navigate(path);
  // };

  const handlePropertyCategoryNavigation = (path) => {
    navigate(path);
  };

  // Get icon for commercial type
  const getCommercialIcon = (typeName) => {
    const iconMap = {
      "Office Space": <Briefcase className="w-3.5 h-3.5" />,
      "Retail Shop": <Store className="w-3.5 h-3.5" />,
      "Showroom": <Store className="w-3.5 h-3.5" />,
      "Commercial Land / Plot": <Landmark className="w-3.5 h-3.5" />,
      "Warehouse / Godown": <Warehouse className="w-3.5 h-3.5" />,
      "Industrial Property / Factory": <Factory className="w-3.5 h-3.5" />,
      "Co-working Space": <Briefcase className="w-3.5 h-3.5" />,
      "Business Center": <Building className="w-3.5 h-3.5" />,
      "Shopping Mall Space": <Building2 className="w-3.5 h-3.5" />,
      "Commercial Complex": <Building2 className="w-3.5 h-3.5" />,
      "Restaurant / Café Space": <Store className="w-3.5 h-3.5" />,
      "Hotel / Lodge / Resort Property": <Hotel className="w-3.5 h-3.5" />,
      "Clinic / Hospital Space": <Building className="w-3.5 h-3.5" />,
      "Educational Institution Property": <Building className="w-3.5 h-3.5" />,
      "IT Park / Tech Park Space": <Building className="w-3.5 h-3.5" />,
      "Multiplex / Entertainment Space": <Building2 className="w-3.5 h-3.5" />,
      "Petrol Bunk / Fuel Station": <Landmark className="w-3.5 h-3.5" />,
      "Cold Storage / Logistics Hub": <Warehouse className="w-3.5 h-3.5" />,
      "Mixed-use Commercial Property": <Building2 className="w-3.5 h-3.5" />,
      "Agricultural Commercial Property": <Landmark className="w-3.5 h-3.5" />,
      "All": <Building className="w-3.5 h-3.5" />
    };
    return iconMap[typeName] || <Building className="w-3.5 h-3.5" />;
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Background and other content same as before */}
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
            BANNER — clean mobile stack + diagonal split on desktop
            teal / emerald theme
        ══════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-teal-50 to-emerald-50">

          {/* ---------- MOBILE / TABLET (< md): simple stacked layout, no diagonal clip ---------- */}
          <div className="md:hidden">
            <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-b-[2rem] shadow-lg">
              <img
                src={backgroundImage}
                alt="Commercial property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-teal-900/10 to-transparent"></div>

              {/* brand tag, small, overlaid bottom-left of image */}
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}>
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold tracking-[0.15em] text-white">YOUR BRAND</p>
                  <p className="text-[8px] tracking-wide text-teal-100">COMMERCIAL REAL ESTATE</p>
                </div>
              </div>
            </div>

            <div className="px-6 pt-8 pb-8 text-center">
              <p className="text-xs font-bold tracking-[0.25em] mb-2" style={{ color: "#00897B" }}>
                NEW LISTINGS
              </p>

              <h1 className="font-bold leading-[0.95] text-4xl sm:text-5xl">
                <span className="block text-teal-950">COMMERCIAL</span>
                <span
                  className="block text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)" }}
                >
                  PROPERTIES
                </span>
              </h1>

              <p className="mt-4 text-sm text-teal-800/90 max-w-md mx-auto leading-relaxed">
                Discover verified office spaces, retail units, and industrial properties across every major business district near you.
              </p>

              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={() => handlePropertyCategoryNavigation("/commercial")}
                  className="group relative px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift"></div>
                  <span className="relative z-10">Explore Now</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-start justify-center gap-x-5 gap-y-4">
                {propertyCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handlePropertyCategoryNavigation(category.path)}
                    className="group flex flex-col items-center gap-3 w-20"
                  >
                    <div
                      className="relative w-16 h-16 rotate-45 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,105,92,0.45)]"
                      style={{
                        border: "2px solid rgba(255,255,255,0.6)"
                      }}
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover -rotate-45 scale-150"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-emerald-900/20 -rotate-45 group-hover:opacity-0 transition-opacity duration-500"></div>
                    </div>
                    <span className="mt-1 text-[11px] font-semibold text-teal-900 text-center leading-tight group-hover:text-teal-700 transition-colors">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- DESKTOP (md+): diagonal split-photo layout ---------- */}
          <div className="hidden md:block relative h-[440px] lg:h-[480px]">

            {/* Diagonal photo panel */}
            <div
              className="absolute inset-y-0 left-0 w-[54%] lg:w-[52%]"
              style={{ clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)" }}
            >
              <img
                src={backgroundImage}
                alt="Commercial property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 via-transparent to-transparent"></div>
              <div className="absolute top-5 left-5 w-14 h-14 border-t-[3px] border-l-[3px] border-white/80"></div>
              <div className="absolute inset-0 opacity-20" style={{
                background: "linear-gradient(135deg, rgba(0,105,92,0.35) 0%, transparent 45%)"
              }}></div>
            </div>

            {/* Brand tag, top-right */}
            <div className="absolute top-6 right-8 z-20 flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-xs font-bold tracking-[0.2em] text-teal-800">YOUR BRAND</p>
                <p className="text-[10px] tracking-wide text-teal-600">COMMERCIAL REAL ESTATE</p>
              </div>
              <div className="w-9 h-9 rounded-md flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}>
                <Building className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Content column */}
            <div className="relative z-10 h-full flex items-center px-10 lg:px-14">
              <div className="w-[44%] lg:w-[42%] ml-auto text-left">

                <p className="text-sm font-bold tracking-[0.25em] mb-2" style={{ color: "#00897B" }}>
                  NEW LISTINGS
                </p>

                <h1 className="font-bold leading-[0.95] text-5xl lg:text-6xl">
                  <span className="block text-teal-950">COMMERCIAL</span>
                  <span
                    className="block text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)" }}
                  >
                    PROPERTIES
                  </span>
                </h1>

                <p className="mt-4 text-base text-teal-800/90 max-w-md leading-relaxed">
                  Discover verified office spaces, retail units, and industrial
                  <br />
                  properties across every major business district near you.
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={() => handlePropertyCategoryNavigation("/commercial")}
                    className="group relative px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift"></div>
                    <span className="relative z-10">Explore Now</span>
                  </button>
                </div>

                {/* DESKTOP DIAMOND ROW - UPDATED WITH CHANGES */}
                <div className="mt-8 flex items-start gap-6 lg:gap-8 -ml-6 lg:-ml-10">
                  {propertyCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handlePropertyCategoryNavigation(category.path)}
                      className="group flex flex-col items-center gap-3 w-24"
                    >
                      <div
                        className="relative w-20 h-20 rotate-45 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,105,92,0.5)]"
                        style={{
                          border: "2.5px solid rgba(255,255,255,0.7)"
                        }}
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover -rotate-45 scale-150"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-emerald-900/20 -rotate-45 group-hover:opacity-0 transition-opacity duration-500"></div>
                      </div>
                      <span className="mt-1 text-xs font-semibold text-teal-900 text-center leading-tight group-hover:text-teal-700 transition-colors">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="max-w-none mx-auto px-6 py-4">
            <div className="hidden md:block space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
                    className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #00695C, #26A69A)",
                      backgroundSize: "200% 200%"
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
                      <button
                        onClick={() => {
                          handleNavigation("/buy");
                          setActiveButton("Buy");
                          setOpenDropdown(null);
                        }}
                        className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Buy
                        </div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button
                        onClick={() => {
                          handleNavigation("/rent");
                          setActiveButton("Rent");
                          setOpenDropdown(null);
                        }}
                        className="w-full px-5 py-3.5 text-left text-base font-semibold transition-all duration-300 group"
                        style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Rent
                        </div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button
                        onClick={() => {
                          handleNavigation("/lease");
                          setActiveButton("Lease");
                          setOpenDropdown(null);
                        }}
                        className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Lease
                        </div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button
                        onClick={() => {
                          handleNavigation("/sell");
                          setActiveButton("Sell");
                          setOpenDropdown(null);
                        }}
                        className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Sell
                        </div>
                      </button>
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

              <div className="flex flex-wrap gap-1.5 max-h-auto overflow-y-auto scrollbar-thin">
                {commercialTypes.map((type, index) => {
                  const isActive = activeCommercialType === type.name;
                  return (
                    <button
                      key={type.name}
                      onClick={() => handleNavigation(type.path, type.name)}
                      className={`group relative px-1.5 py-2 rounded-md font-medium text-xs shadow-md transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0.5 hover:scale-102 overflow-hidden ${
                        isActive 
                          ? "text-teal-800 shadow-none" 
                          : "text-white/90 hover:text-white"
                      }`}
                      style={{
                        background: isActive 
                          ? "#ebfff7" 
                          : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
                        backgroundSize: "200% 200%",
                        outline: isActive ? "3px solid #00695C" : "none",
                        outlineOffset: "-3px",
                        border: "none",
                        boxShadow: isActive ? "0 0 18px 4px rgba(0, 105, 92, 0.45)" : "none"
                      }}
                    >
                      <div className={`absolute inset-0 animate-gradient-shift-slow ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'}`}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      {isActive && (
                        <div className="absolute -inset-1 rounded-xl"></div>
                      )}
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {getCommercialIcon(type.name)}
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:hidden space-y-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {commercialTypes.map((type, index) => {
                  const isActive = activeCommercialType === type.name;
                  return (
                    <button
                      key={type.name}
                      onClick={() => handleNavigation(type.path, type.name)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-lg"
                          : "bg-gradient-to-r from-teal-600 to-teal-500 text-white/90 hover:text-white"
                      }`}
                    >
                      {type.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

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
                        {activeCommercialType}
                      </span>
                    </div>
                    
                    <div
                      className="w-24 h-24 md:w-28 md:h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_50px_rgba(0,105,92,0.5)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 relative"
                      style={{
                        background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
                        backgroundSize: "200% 200%"
                      }}
                    >
                      <div className="absolute inset-0 animate-gradient-shift-slow rounded-3xl"></div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                      <Landmark className="w-12 h-12 text-white group-hover:rotate-12 transition-transform duration-700 relative z-10" />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4 group-hover:text-teal-950 transition-colors duration-300">
                      {activeCommercialType === "All" ? "Premium Commercial Properties" : `${activeCommercialType} Properties`}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 animate-gradient-text-slow"> Coming Soon</span>
                    </h2>
                    
                    <p className="text-teal-800 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed group-hover:text-teal-900 transition-colors duration-300 backdrop-blur-sm bg-teal-100/30 rounded-2xl p-6 border border-teal-200/20">
                      {activeCommercialType === "All" 
                        ? "We're currently adding exclusive commercial properties to our database."
                        : `We're currently adding exclusive ${activeCommercialType.toLowerCase()} properties to our database.`}
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
                          background: "linear-gradient(135deg, #00695C, #26A69A)",
                          backgroundSize: "200% 200%"
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
                    <Landmark className="w-10 h-10 text-teal-600 animate-bounce-slow relative z-10" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-teal-900 mb-4">
                    No {activeCommercialType !== "All" ? `${activeCommercialType} ` : ""}Commercial Properties Found
                  </h3>
                  
                  <p className="text-teal-800 mb-6 backdrop-blur-sm bg-teal-100/30 rounded-xl p-4 border border-teal-200/20">
                    {activeCommercialType !== "All"
                      ? `We don't have any ${activeCommercialType.toLowerCase()} properties available at the moment.`
                      : "Use the filters on the right to find commercial properties that match your criteria."}
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
                      {activeCommercialType !== "All" 
                        ? `Check back later for ${activeCommercialType.toLowerCase()} listings` 
                        : "Adjust your filters to see matching properties"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                        Price / Rent Range
                      </span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
                      />
                    </div>
                    <div className="mt-3 h-2 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-progress"></div>
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-200">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">📐</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Area (sq. ft.)
                      </span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Min Area"
                        className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
                      />
                      <input
                        type="number"
                        placeholder="Max Area"
                        className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
                      />
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-300">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">🏢</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Property Type
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Office", "Retail", "Industrial", "Warehouse", "Land", "Mixed-use"].map((type, index) => (
                        <label 
                          key={type} 
                          onMouseEnter={() => setHoveredFilter(`type-${index}`)}
                          onMouseLeave={() => setHoveredFilter(null)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
                            hoveredFilter === `type-${index}` ? 'scale-[1.02]' : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300" 
                          />
                          <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 animate-fade-in-up delay-400">
                    <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
                      <span className="text-xl animate-bounce-slow">📍</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                        Amenities
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Parking", "24/7 Security", "Power Backup", "Elevator", "Wifi", "CCTV"].map((amenity, index) => (
                        <label 
                          key={amenity} 
                          className="flex items-center gap-3 p-2 rounded-lg border border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-teal-50/50"
                        >
                          <input 
                            type="checkbox" 
                            className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30" 
                          />
                          <span className="text-xs text-teal-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-teal-200/30 animate-fade-in-up delay-500">
                    <button
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-teal-200/50 text-sm font-medium text-teal-700 hover:bg-gradient-to-r from-teal-50 to-emerald-50 hover:border-teal-300 transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">Clear All</span>
                    </button>
                    <button
                      className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl hover:shadow-[0_0_25px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #00695C, #26A69A)",
                        backgroundSize: "200% 200%"
                      }}
                    >
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
        /* Keep all existing styles */
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
        .lg\\:custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
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

export default CommercialPage;




























// import React, { useState, useEffect } from "react";
// import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Store, Factory, Hotel, Briefcase } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import backgroundImage from "../../assets/house1.png";

// // Import images for each property category
// import individualImage from "../../assets/individualcat.jpg";
// import apartmentImage from "../../assets/Apartmentcat.jpg";
// import landPlotsImage from "../../assets/landcat.jpg";
// import hostelImage from "../../assets/hostelcat.jpg";

// const CommercialPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeButton, setActiveButton] = useState("Rent");
//   const [activeCommercialType, setActiveCommercialType] = useState("All");
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [hoveredFilter, setHoveredFilter] = useState(null);

//   const propertyCategories = [
//     { 
//       name: "Individual", 
//       path: "/individual", 
//       icon: <Building className="w-full h-full" />,
//       image: individualImage 
//     },
//     { 
//       name: "Apartment", 
//       path: "/apartment", 
//       icon: <Landmark className="w-full h-full" />,
//       image: apartmentImage 
//     },
//     { 
//       name: "Land & Plots", 
//       path: "/land-plots", 
//       icon: <Warehouse className="w-full h-full" />,
//       image: landPlotsImage 
//     },
//     { 
//       name: "Hostel", 
//       path: "/hostel", 
//       icon: <Building2 className="w-full h-full" />,
//       image: hostelImage 
//     }
//   ];

//   const commercialTypes = [
//     { name: "All", path: "/commercial", component: "CommercialPage" },
//     { name: "Office Space", path: "/commercial/office-space", component: "OfficeSpacePage" },
//     { name: "Retail Shop", path: "/commercial/retail-shop", component: "RetailShopPage" },
//     { name: "Showroom", path: "/commercial/showroom", component: "ShowroomPage" },
//     { name: "Commercial Land / Plot", path: "/commercial/commercial-land-plot", component: "CommercialLandPlotPage" },
//     { name: "Warehouse / Godown", path: "/commercial/warehouse-godown", component: "WarehouseGodownPage" },
//     { name: "Industrial Property / Factory", path: "/commercial/industrial-property-factory", component: "IndustrialPropertyFactoryPage" },
//     { name: "Co-working Space", path: "/commercial/coworking-space", component: "CoworkingSpacePage" },
//     { name: "Business Center", path: "/commercial/business-center", component: "BusinessCenterPage" },
//     { name: "Shopping Mall Space", path: "/commercial/shopping-mall-space", component: "ShoppingMallSpacePage" },
//     { name: "Commercial Complex", path: "/commercial/commercial-complex", component: "CommercialComplexPage" },
//     { name: "Restaurant / Café Space", path: "/commercial/restaurant-cafe-space", component: "RestaurantCafeSpacePage" },
//     { name: "Hotel / Lodge / Resort Property", path: "/commercial/hotel-lodge-resort-property", component: "HotelLodgeResortPropertyPage" },
//     { name: "Clinic / Hospital Space", path: "/commercial/clinic-hospital-space", component: "ClinicHospitalSpacePage" },
//     { name: "Educational Institution Property", path: "/commercial/educational-institution-property", component: "EducationalInstitutionPropertyPage" },
//     { name: "IT Park / Tech Park Space", path: "/commercial/it-park-tech-park-space", component: "ITParkTechParkSpacePage" },
//     { name: "Multiplex / Entertainment Space", path: "/commercial/multiplex-entertainment-space", component: "MultiplexEntertainmentSpacePage" },
//     { name: "Petrol Bunk / Fuel Station", path: "/commercial/petrol-bunk-fuel-station", component: "PetrolBunkFuelStationPage" },
//     { name: "Cold Storage / Logistics Hub", path: "/commercial/cold-storage-logistics-hub", component: "ColdStorageLogisticsHubPage" },
//     { name: "Mixed-use Commercial Property", path: "/commercial/mixed-use-commercial-property", component: "MixedUseCommercialPropertyPage" },
//     { name: "Agricultural Commercial Property", path: "/commercial/agricultural-commercial-property", component: "AgriculturalCommercialPropertyPage" }
//   ];

//   useEffect(() => {
//     const currentPath = location.pathname;
//     const activeType = commercialTypes.find(type => type.path === currentPath);
//     if (activeType) {
//       setActiveCommercialType(activeType.name);
//     } else if (currentPath === "/commercial" || currentPath === "/commercial/") {
//       setActiveCommercialType("All");
//     }
//   }, [location.pathname]);

//   const handleNavigation = (path, typeName = null) => {
//     if (typeName) {
//       setActiveCommercialType(typeName);
//     }
//     navigate(path);
//   };

//   const handlePropertyCategoryNavigation = (path) => {
//     navigate(path);
//   };

//   // Get icon for commercial type
//   const getCommercialIcon = (typeName) => {
//     const iconMap = {
//       "Office Space": <Briefcase className="w-3.5 h-3.5" />,
//       "Retail Shop": <Store className="w-3.5 h-3.5" />,
//       "Showroom": <Store className="w-3.5 h-3.5" />,
//       "Commercial Land / Plot": <Landmark className="w-3.5 h-3.5" />,
//       "Warehouse / Godown": <Warehouse className="w-3.5 h-3.5" />,
//       "Industrial Property / Factory": <Factory className="w-3.5 h-3.5" />,
//       "Co-working Space": <Briefcase className="w-3.5 h-3.5" />,
//       "Business Center": <Building className="w-3.5 h-3.5" />,
//       "Shopping Mall Space": <Building2 className="w-3.5 h-3.5" />,
//       "Commercial Complex": <Building2 className="w-3.5 h-3.5" />,
//       "Restaurant / Café Space": <Store className="w-3.5 h-3.5" />,
//       "Hotel / Lodge / Resort Property": <Hotel className="w-3.5 h-3.5" />,
//       "Clinic / Hospital Space": <Building className="w-3.5 h-3.5" />,
//       "Educational Institution Property": <Building className="w-3.5 h-3.5" />,
//       "IT Park / Tech Park Space": <Building className="w-3.5 h-3.5" />,
//       "Multiplex / Entertainment Space": <Building2 className="w-3.5 h-3.5" />,
//       "Petrol Bunk / Fuel Station": <Landmark className="w-3.5 h-3.5" />,
//       "Cold Storage / Logistics Hub": <Warehouse className="w-3.5 h-3.5" />,
//       "Mixed-use Commercial Property": <Building2 className="w-3.5 h-3.5" />,
//       "Agricultural Commercial Property": <Landmark className="w-3.5 h-3.5" />,
//       "All": <Building className="w-3.5 h-3.5" />
//     };
//     return iconMap[typeName] || <Building className="w-3.5 h-3.5" />;
//   };

//   return (
//     <div className="w-full min-h-screen relative">
//       {/* Background and other content same as before */}
//       <div 
//         className="fixed inset-0 z-0"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundAttachment: 'fixed',
//         }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-emerald-900/20 to-teal-900/40 animate-gradient-flow"></div>
        
//         <div className="absolute inset-0 overflow-hidden">
//           {[...Array(25)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute animate-particle-float"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${8 + Math.random() * 8}s`,
//                 width: `${2 + Math.random() * 4}px`,
//                 height: `${2 + Math.random() * 4}px`,
//                 background: `radial-gradient(circle, rgba(38, 166, 154, 0.4) 0%, rgba(0, 105, 92, 0.2) 70%, transparent 100%)`,
//                 borderRadius: '50%',
//               }}
//             ></div>
//           ))}
          
//           {[...Array(12)].map((_, i) => (
//             <div
//               key={`shape-${i}`}
//               className="absolute animate-geometric-float"
//               style={{
//                 width: `${20 + Math.random() * 40}px`,
//                 height: `${20 + Math.random() * 40}px`,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 background: `linear-gradient(135deg, rgba(0, 105, 92, 0.1), rgba(38, 166, 154, 0.05))`,
//                 borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '20%' : '0%',
//                 border: '1px solid rgba(38, 166, 154, 0.15)',
//                 animationDelay: `${Math.random() * 5}s`,
//                 animationDuration: `${15 + Math.random() * 15}s`,
//               }}
//             ></div>
//           ))}
//         </div>
//       </div>

//       <div className="relative z-10">

//         {/* ══════════════════════════════════════════════
//             BANNER — clean mobile stack + diagonal split on desktop
//             teal / emerald theme
//         ══════════════════════════════════════════════ */}
//         <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-teal-50 to-emerald-50">

//           {/* ---------- MOBILE / TABLET (< md): simple stacked layout, no diagonal clip ---------- */}
//           <div className="md:hidden">
//             <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-b-[2rem] shadow-lg">
//               <img
//                 src={backgroundImage}
//                 alt="Commercial property"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-teal-900/10 to-transparent"></div>

//               {/* brand tag, small, overlaid bottom-left of image */}
//               <div className="absolute bottom-3 left-4 flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}>
//                   <Building className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="leading-tight">
//                   <p className="text-[10px] font-bold tracking-[0.15em] text-white">YOUR BRAND</p>
//                   <p className="text-[8px] tracking-wide text-teal-100">COMMERCIAL REAL ESTATE</p>
//                 </div>
//               </div>
//             </div>

//             <div className="px-6 pt-8 pb-8 text-center">
//               <p className="text-xs font-bold tracking-[0.25em] mb-2" style={{ color: "#00897B" }}>
//                 NEW LISTINGS
//               </p>

//               <h1 className="font-bold leading-[0.95] text-4xl sm:text-5xl">
//                 <span className="block text-teal-950">COMMERCIAL</span>
//                 <span
//                   className="block text-transparent bg-clip-text"
//                   style={{ backgroundImage: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)" }}
//                 >
//                   PROPERTIES
//                 </span>
//               </h1>

//               <p className="mt-4 text-sm text-teal-800/90 max-w-md mx-auto leading-relaxed">
//                 Discover verified office spaces, retail units, and industrial properties across every major business district near you.
//               </p>

//               <div className="mt-6 flex items-center justify-center">
//                 <button
//                   onClick={() => handlePropertyCategoryNavigation("/commercial")}
//                   className="group relative px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
//                   style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
//                 >
//                   <div className="absolute inset-0 animate-gradient-shift"></div>
//                   <span className="relative z-10">Explore Now</span>
//                 </button>
//               </div>

//               <div className="mt-8 flex flex-wrap items-start justify-center gap-x-5 gap-y-4">
//                 {propertyCategories.map((category) => (
//                   <button
//                     key={category.name}
//                     onClick={() => handlePropertyCategoryNavigation(category.path)}
//                     className="group flex flex-col items-center gap-3 w-20"
//                   >
//                     <div
//                       className="relative w-16 h-16 rotate-45 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,105,92,0.45)]"
//                       style={{
//                         border: "2px solid rgba(255,255,255,0.6)"
//                       }}
//                     >
//                       <img
//                         src={category.image}
//                         alt={category.name}
//                         className="absolute inset-0 w-full h-full object-cover -rotate-45 scale-150"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-emerald-900/20 -rotate-45 group-hover:opacity-0 transition-opacity duration-500"></div>
//                     </div>
//                     <span className="mt-1 text-[11px] font-semibold text-teal-900 text-center leading-tight group-hover:text-teal-700 transition-colors">
//                       {category.name}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ---------- DESKTOP (md+): diagonal split-photo layout ---------- */}
//           <div className="hidden md:block relative h-[440px] lg:h-[480px]">

//             {/* Diagonal photo panel */}
//             <div
//               className="absolute inset-y-0 left-0 w-[54%] lg:w-[52%]"
//               style={{ clipPath: "polygon(0 0, 100% 0, 78% 100%, 0% 100%)" }}
//             >
//               <img
//                 src={backgroundImage}
//                 alt="Commercial property"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 via-transparent to-transparent"></div>
//               <div className="absolute top-5 left-5 w-14 h-14 border-t-[3px] border-l-[3px] border-white/80"></div>
//               <div className="absolute inset-0 opacity-20" style={{
//                 background: "linear-gradient(135deg, rgba(0,105,92,0.35) 0%, transparent 45%)"
//               }}></div>
//             </div>

//             {/* Brand tag, top-right */}
//             <div className="absolute top-6 right-8 z-20 flex items-center gap-3">
//               <div className="text-right leading-tight">
//                 <p className="text-xs font-bold tracking-[0.2em] text-teal-800">YOUR BRAND</p>
//                 <p className="text-[10px] tracking-wide text-teal-600">COMMERCIAL REAL ESTATE</p>
//               </div>
//               <div className="w-9 h-9 rounded-md flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}>
//                 <Building className="w-5 h-5 text-white" />
//               </div>
//             </div>

//             {/* Content column */}
//             <div className="relative z-10 h-full flex items-center px-10 lg:px-14">
//               <div className="w-[44%] lg:w-[42%] ml-auto text-left">

//                 <p className="text-sm font-bold tracking-[0.25em] mb-2" style={{ color: "#00897B" }}>
//                   NEW LISTINGS
//                 </p>

//                 <h1 className="font-bold leading-[0.95] text-5xl lg:text-6xl">
//                   <span className="block text-teal-950">COMMERCIAL</span>
//                   <span
//                     className="block text-transparent bg-clip-text"
//                     style={{ backgroundImage: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)" }}
//                   >
//                     PROPERTIES
//                   </span>
//                 </h1>

//                 <p className="mt-4 text-base text-teal-800/90 max-w-md leading-relaxed">
//                   Discover verified office spaces, retail units, and industrial
//                   <br />
//                   properties across every major business district near you.
//                 </p>

//                 <div className="mt-6 flex items-center gap-4">
//                   <button
//                     onClick={() => handlePropertyCategoryNavigation("/commercial")}
//                     className="group relative px-6 py-2.5 rounded-lg text-white text-sm font-semibold shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105"
//                     style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
//                   >
//                     <div className="absolute inset-0 animate-gradient-shift"></div>
//                     <span className="relative z-10">Explore Now</span>
//                   </button>
//                 </div>

//                 {/* DESKTOP DIAMOND ROW - UPDATED WITH CHANGES */}
//                 <div className="mt-8 flex items-start gap-6 lg:gap-8 -ml-6 lg:-ml-10">
//                   {propertyCategories.map((category) => (
//                     <button
//                       key={category.name}
//                       onClick={() => handlePropertyCategoryNavigation(category.path)}
//                       className="group flex flex-col items-center gap-3 w-24"
//                     >
//                       <div
//                         className="relative w-20 h-20 rotate-45 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,105,92,0.5)]"
//                         style={{
//                           border: "2.5px solid rgba(255,255,255,0.7)"
//                         }}
//                       >
//                         <img
//                           src={category.image}
//                           alt={category.name}
//                           className="absolute inset-0 w-full h-full object-cover -rotate-45 scale-150"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-emerald-900/20 -rotate-45 group-hover:opacity-0 transition-opacity duration-500"></div>
//                       </div>
//                       <span className="mt-1 text-xs font-semibold text-teal-900 text-center leading-tight group-hover:text-teal-700 transition-colors">
//                         {category.name}
//                       </span>
//                     </button>
//                   ))}
//                 </div>

//               </div>
//             </div>
//           </div>
//         </section>

//         <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
//           <div className="max-w-none mx-auto px-6 py-4">
//             <div className="hidden md:block space-y-4">
//               <div className="flex gap-4 items-center">
//                 <div className="relative">
//                   <button
//                     onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
//                     className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
//                     style={{
//                       background: "linear-gradient(135deg, #00695C, #26A69A)",
//                       backgroundSize: "200% 200%"
//                     }}
//                   >
//                     <div className="absolute inset-0 animate-gradient-shift-slow"></div>
//                     <Home className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//                     <span className="relative z-10">{activeButton}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
//                     <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//                   </button>

//                   {openDropdown === "toggle" && (
//                     <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30 animate-slide-down-fast">
//                       <button
//                         onClick={() => {
//                           handleNavigation("/buy");
//                           setActiveButton("Buy");
//                           setOpenDropdown(null);
//                         }}
//                         className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                           Buy
//                         </div>
//                       </button>
//                       <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
//                       <button
//                         onClick={() => {
//                           handleNavigation("/rent");
//                           setActiveButton("Rent");
//                           setOpenDropdown(null);
//                         }}
//                         className="w-full px-5 py-3.5 text-left text-base font-semibold transition-all duration-300 group"
//                         style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                           Rent
//                         </div>
//                       </button>
//                       <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
//                       <button
//                         onClick={() => {
//                           handleNavigation("/lease");
//                           setActiveButton("Lease");
//                           setOpenDropdown(null);
//                         }}
//                         className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                           Lease
//                         </div>
//                       </button>
//                       <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
//                       <button
//                         onClick={() => {
//                           handleNavigation("/sell");
//                           setActiveButton("Sell");
//                           setOpenDropdown(null);
//                         }}
//                         className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                       >
//                         <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                           <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                           Sell
//                         </div>
//                       </button>
//                     </div>   
//                   )}
//                 </div>

//                 <div className="relative flex-1 group">
//                   <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
//                   <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
//                   <input
//                     type="text"
//                     placeholder="Search by city, locality, or landmark"
//                     className="w-full pl-10 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
//                   />
//                   <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-1.5 max-h-auto overflow-y-auto scrollbar-thin">
//                 {commercialTypes.map((type, index) => {
//                   const isActive = activeCommercialType === type.name;
//                   return (
//                     <button
//                       key={type.name}
//                       onClick={() => handleNavigation(type.path, type.name)}
//                       className={`group relative px-1.5 py-2 rounded-md font-medium text-xs shadow-md transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0.5 hover:scale-102 overflow-hidden ${
//                         isActive 
//                           ? "text-teal-800 shadow-none" 
//                           : "text-white/90 hover:text-white"
//                       }`}
//                       style={{
//                         background: isActive 
//                           ? "#ebfff7" 
//                           : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
//                         backgroundSize: "200% 200%",
//                         outline: isActive ? "3px solid #00695C" : "none",
//                         outlineOffset: "-3px",
//                         border: "none",
//                         boxShadow: isActive ? "0 0 18px 4px rgba(0, 105, 92, 0.45)" : "none"
//                       }}
//                     >
//                       <div className={`absolute inset-0 animate-gradient-shift-slow ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'}`}></div>
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//                       {isActive && (
//                         <div className="absolute -inset-1 rounded-xl"></div>
//                       )}
//                       <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//                       <span className="relative z-10 flex items-center gap-2">
//                         {getCommercialIcon(type.name)}
//                         {type.name}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="md:hidden space-y-4">
//               <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
//                 {commercialTypes.map((type, index) => {
//                   const isActive = activeCommercialType === type.name;
//                   return (
//                     <button
//                       key={type.name}
//                       onClick={() => handleNavigation(type.path, type.name)}
//                       className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
//                         isActive
//                           ? "bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-lg"
//                           : "bg-gradient-to-r from-teal-600 to-teal-500 text-white/90 hover:text-white"
//                       }`}
//                     >
//                       {type.name}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-none mx-auto px-6 py-8 lg:py-12">
//           <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
//             <div className="lg:w-2/3">
//               <section>
//                 <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 text-center border border-teal-200/30 hover:shadow-[0_0_60px_rgba(0,105,92,0.3)] transition-all duration-700 group animate-fade-in-up">
//                   <div className="absolute inset-0 opacity-[0.03] rounded-3xl overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent animate-shimmer"></div>
//                   </div>
                  
//                   <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 border border-teal-200">
//                     <span className="text-sm font-medium text-teal-700">Active Filter:</span>
//                     <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                       {activeCommercialType}
//                     </span>
//                   </div>
                  
//                   <div
//                     className="w-24 h-24 md:w-28 md:h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_50px_rgba(0,105,92,0.5)] transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3 relative"
//                     style={{
//                       background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
//                       backgroundSize: "200% 200%"
//                     }}
//                   >
//                     <div className="absolute inset-0 animate-gradient-shift-slow rounded-3xl"></div>
//                     <div className="absolute -inset-4 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
//                     <Landmark className="w-12 h-12 text-white group-hover:rotate-12 transition-transform duration-700 relative z-10" />
//                   </div>
                  
//                   <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4 group-hover:text-teal-950 transition-colors duration-300">
//                     {activeCommercialType === "All" ? "Premium Commercial Properties" : `${activeCommercialType} Properties`}
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 animate-gradient-text-slow"> Coming Soon</span>
//                   </h2>
                  
//                   <p className="text-teal-800 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed group-hover:text-teal-900 transition-colors duration-300 backdrop-blur-sm bg-teal-100/30 rounded-2xl p-6 border border-teal-200/20">
//                     {activeCommercialType === "All" 
//                       ? "We're currently adding exclusive commercial properties to our database."
//                       : `We're currently adding exclusive ${activeCommercialType.toLowerCase()} properties to our database.`}
//                     <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-xl">
//                       Check back soon for amazing deals!
//                     </span>
//                   </p>
                  
//                   <div className="mt-8 flex justify-center gap-4">
//                     <button className="group relative px-6 py-3 rounded-xl border-2 border-teal-500 text-teal-600 font-semibold hover:bg-gradient-to-r from-teal-50 to-emerald-50 transition-all duration-500 transform hover:scale-105 overflow-hidden">
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//                       <span className="relative z-10">Get Notified</span>
//                     </button>
//                     <button 
//                       className="group relative px-6 py-3 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
//                       style={{
//                         background: "linear-gradient(135deg, #00695C, #26A69A)",
//                         backgroundSize: "200% 200%"
//                       }}
//                     >
//                       <div className="absolute inset-0 animate-gradient-shift"></div>
//                       <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//                       <span className="relative z-10">Browse Similar</span>
//                     </button>
//                   </div>
//                 </div>
//               </section>

//               <div className="mt-8 bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 text-center border border-teal-200/30 animate-fade-in-up delay-300">
//                 <div className="max-w-2xl mx-auto">
//                   <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 mx-auto mb-6 flex items-center justify-center relative">
//                     <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-3xl animate-pulse-slow"></div>
//                     <Landmark className="w-10 h-10 text-teal-600 animate-bounce-slow relative z-10" />
//                   </div>
                  
//                   <h3 className="text-2xl font-bold text-teal-900 mb-4">
//                     No {activeCommercialType !== "All" ? `${activeCommercialType} ` : ""}Commercial Properties Found
//                   </h3>
                  
//                   <p className="text-teal-800 mb-6 backdrop-blur-sm bg-teal-100/30 rounded-xl p-4 border border-teal-200/20">
//                     {activeCommercialType !== "All"
//                       ? `We don't have any ${activeCommercialType.toLowerCase()} properties available at the moment.`
//                       : "Use the filters on the right to find commercial properties that match your criteria."}
//                   </p>
                  
//                   <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100">
//                     {[0, 150, 300].map((delay) => (
//                       <div
//                         key={delay}
//                         className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 animate-pulse"
//                         style={{ animationDelay: `${delay}ms` }}
//                       ></div>
//                     ))}
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-medium">
//                       {activeCommercialType !== "All" 
//                         ? `Check back later for ${activeCommercialType.toLowerCase()} listings` 
//                         : "Adjust your filters to see matching properties"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:w-1/3 lg:relative">
//               <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
//                 <div className="bg-gradient-to-b from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-teal-200/30 hover:shadow-[0_0_40px_rgba(0,105,92,0.2)] transition-all duration-500">
//                   <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-3">
//                     <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 animate-pulse-slow">
//                       <Filter className="w-5 h-5 animate-rotate-slow" style={{ color: "#00695C" }} />
//                     </div>
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                       Advanced Filters
//                     </span>
//                   </h3>

//                   <div className="mb-6 animate-fade-in-up delay-100">
//                     <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//                       <span className="text-xl animate-bounce-slow">💰</span> 
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         Price / Rent Range
//                       </span>
//                     </label>
//                     <div className="flex gap-3">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
//                       />
//                     </div>
//                     <div className="mt-3 h-2 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full overflow-hidden">
//                       <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-progress"></div>
//                     </div>
//                   </div>

//                   <div className="mb-6 animate-fade-in-up delay-200">
//                     <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//                       <span className="text-xl animate-bounce-slow">📐</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         Area (sq. ft.)
//                       </span>
//                     </label>
//                     <div className="flex gap-3">
//                       <input
//                         type="number"
//                         placeholder="Min Area"
//                         className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max Area"
//                         className="w-1/2 px-4 py-3 rounded-xl border-2 border-teal-200/50 bg-teal-50/80 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-lg text-teal-900 placeholder-teal-400 transition-all duration-300 hover:shadow-xl"
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-6 animate-fade-in-up delay-300">
//                     <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//                       <span className="text-xl animate-bounce-slow">🏢</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         Property Type
//                       </span>
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       {["Office", "Retail", "Industrial", "Warehouse", "Land", "Mixed-use"].map((type, index) => (
//                         <label 
//                           key={type} 
//                           onMouseEnter={() => setHoveredFilter(`type-${index}`)}
//                           onMouseLeave={() => setHoveredFilter(null)}
//                           className={`flex items-center gap-3 p-3 rounded-xl border-2 border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r from-teal-50/50 to-emerald-50/50 group animate-fade-in-up ${
//                             hoveredFilter === `type-${index}` ? 'scale-[1.02]' : ''
//                           }`}
//                           style={{ animationDelay: `${index * 50}ms` }}
//                         >
//                           <input 
//                             type="checkbox" 
//                             className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30 transition-all duration-300" 
//                           />
//                           <span className="text-sm text-teal-800 group-hover:text-teal-900 group-hover:font-medium transition-all duration-300">
//                             {type}
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="mb-6 animate-fade-in-up delay-400">
//                     <label className="text-sm font-semibold text-teal-800 mb-3 block flex items-center gap-2">
//                       <span className="text-xl animate-bounce-slow">📍</span>
//                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
//                         Amenities
//                       </span>
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       {["Parking", "24/7 Security", "Power Backup", "Elevator", "Wifi", "CCTV"].map((amenity, index) => (
//                         <label 
//                           key={amenity} 
//                           className="flex items-center gap-3 p-2 rounded-lg border border-teal-200/50 hover:border-teal-300 cursor-pointer transition-all duration-300 hover:bg-teal-50/50"
//                         >
//                           <input 
//                             type="checkbox" 
//                             className="w-3.5 h-3.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30" 
//                           />
//                           <span className="text-xs text-teal-700">{amenity}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex gap-3 pt-6 border-t border-teal-200/30 animate-fade-in-up delay-500">
//                     <button
//                       className="flex-1 px-4 py-3 rounded-xl border-2 border-teal-200/50 text-sm font-medium text-teal-700 hover:bg-gradient-to-r from-teal-50 to-emerald-50 hover:border-teal-300 transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden group"
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//                       <span className="relative z-10">Clear All</span>
//                     </button>
//                     <button
//                       className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl hover:shadow-[0_0_25px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-[1.02] group relative overflow-hidden"
//                       style={{
//                         background: "linear-gradient(135deg, #00695C, #26A69A)",
//                         backgroundSize: "200% 200%"
//                       }}
//                     >
//                       <div className="absolute inset-0 animate-gradient-shift"></div>
//                       <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
//                       <span className="relative z-10 flex items-center justify-center gap-2">
//                         Apply Filters
//                         <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         /* Keep all existing styles */
//         @keyframes gradient-flow {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-flow {
//           background-size: 200% 200%;
//           animation: gradient-flow 20s ease infinite;
//         }
//         .animate-gradient-slow {
//           background-size: 300% 300%;
//           animation: gradient-flow 15s ease infinite;
//         }
//         .animate-gradient-shift {
//           background-size: 200% 200%;
//           animation: gradient-flow 2s linear infinite;
//         }
//         .animate-gradient-shift-slow {
//           background-size: 200% 200%;
//           animation: gradient-flow 4s linear infinite;
//         }
//         .animate-gradient-text {
//           background-size: 300% 300%;
//           animation: gradient-flow 3s ease infinite;
//         }
//         .animate-gradient-text-slow {
//           background-size: 300% 300%;
//           animation: gradient-flow 5s ease infinite;
//         }
//         @keyframes particle-float {
//           0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
//           50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; }
//         }
//         .animate-particle-float {
//           animation: particle-float 12s ease-in-out infinite;
//         }
//         @keyframes geometric-float {
//           0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
//           50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
//         }
//         .animate-geometric-float {
//           animation: geometric-float 20s ease-in-out infinite;
//         }
//         @keyframes bubble-float {
//           0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
//           50% { transform: translateY(-25px) scale(1.2); opacity: 0.8; }
//         }
//         .animate-bubble-float {
//           animation: bubble-float 6s ease-in-out infinite;
//         }
//         @keyframes float-glow {
//           0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
//           50% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(0,105,92,0.5); }
//         }
//         .animate-float-glow {
//           animation: float-glow 3s ease-in-out infinite;
//         }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 0.6s ease-out forwards;
//         }
//         @keyframes slide-up {
//           from { transform: translateY(30px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slide-up {
//           animation: slide-up 0.5s ease-out forwards;
//         }
//         @keyframes slide-down {
//           from { transform: translateY(-20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.4s ease-out forwards;
//         }
//         .animate-slide-down-fast {
//           animation: slide-down 0.2s ease-out forwards;
//         }
//         @keyframes slide-in-right {
//           from { transform: translateX(30px); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         .animate-slide-in-right {
//           animation: slide-in-right 0.5s ease-out forwards;
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-spin-slow {
//           animation: spin-slow 20s linear infinite;
//         }
//         .animate-rotate-slow {
//           animation: spin-slow 10s linear infinite;
//         }
//         @keyframes bounce-slow {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-5px); }
//         }
//         .animate-bounce-slow {
//           animation: bounce-slow 3s ease-in-out infinite;
//         }
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         .animate-shimmer {
//           animation: shimmer 3s linear infinite;
//         }
//         @keyframes progress {
//           0% { width: 0%; }
//           100% { width: 75%; }
//         }
//         .animate-progress {
//           animation: progress 1.5s ease-out forwards;
//         }
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.8; transform: scale(1.05); }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out infinite;
//         }
//         .delay-100 { animation-delay: 0.1s; }
//         .delay-200 { animation-delay: 0.2s; }
//         .delay-300 { animation-delay: 0.3s; }
//         .delay-400 { animation-delay: 0.4s; }
//         .delay-500 { animation-delay: 0.5s; }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-thin::-webkit-scrollbar {
//           height: 4px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: rgba(0, 105, 92, 0.1);
//           border-radius: 10px;
//         }
//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: linear-gradient(to right, #00695C, #26A69A);
//           border-radius: 10px;
//         }
//         .lg\\:custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .lg\\:custom-scrollbar::-webkit-scrollbar-track {
//           background: linear-gradient(to bottom, transparent, rgba(0, 105, 92, 0.1), transparent);
//           border-radius: 10px;
//         }
//         .lg\\:custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #00695C, #26A69A);
//           border-radius: 10px;
//         }
//         .lg\\:custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #004D40, #00796B);
//           box-shadow: 0 0 10px rgba(0, 105, 92, 0.5);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CommercialPage;