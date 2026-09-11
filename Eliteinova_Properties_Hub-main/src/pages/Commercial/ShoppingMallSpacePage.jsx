import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/commercial/mainbg.png";
import ShoppingMallSpaceFilter from "../../components/filters/Commercial/ShoppingMallSpaceFilter";
import useNavigation from "../../hooks/useNavigation";
import { usePropertyFilter } from "../../hooks/usePropertyFilter";
import PropertyList from "../../components/propertycard/PropertyList";

const ShoppingMallSpacePage = () => {
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
  const [showFilterModal, setShowFilterModal] = useState(false);

  const propertyCategories = [
    { name: "Individual", path: "/individual", icon: <Landmark className="w-4 h-4" /> },
    { name: "Apartment", path: "/apartment", icon: <Building className="w-4 h-4" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  const shoppingTypes = [
    { name: "All", path: "/commercial" },
    { name: "Office Space", path: "/commercial/office-space"},
    { name: "Retail Shop", path: "/commercial/retail-shop" },
    { name: "Showroom", path: "/commercial/showroom"},
    { name: "Commercial Land / Plot", path: "/commercial/commercial-land-plot" },
    { name: "Warehouse / Godown", path: "/commercial/warehouse-godown" },
    { name: "Industrial Property / Factory", path: "/commercial/industrial-property-factory" },
    { name: "Co-working Space", path: "/commercial/coworking-space" },
    { name: "Business Center", path: "/commercial/business-center" },
    { name: "Shopping Mall Space", path: "/commercial/shopping-mall-space" },
    { name: "Commercial Complex", path: "/commercial/commercial-complex" },
    { name: "Restaurant / Café Space", path: "/commercial/restaurant-cafe-space" },
    { name: "Hotel / Lodge / Resort Property", path: "/commercial/hotel-lodge-resort-property" },
    { name: "Clinic / Hospital Space", path: "/commercial/clinic-hospital-space" },
    { name: "Educational Institution Property", path: "/commercial/educational-institution-property" },
    { name: "IT Park / Tech Park Space", path: "/commercial/it-park-tech-park-space" },
    { name: "Multiplex / Entertainment Space", path: "/commercial/multiplex-entertainment-space" },
    { name: "Petrol Bunk / Fuel Station", path: "/commercial/petrol-bunk-fuel-station" },
    { name: "Cold Storage / Logistics Hub", path: "/commercial/cold-storage-logistics-hub" },
    { name: "Mixed-use Commercial Property", path: "/commercial/mixed-use-commercial-property" },
    { name: "Agricultural Commercial Property", path: "/commercial/agricultural-commercial-property" }
  ];

  // ❌ REMOVED: Local useEffect - Hook handles this automatically
  // useEffect(() => {
  //   const currentPath = location.pathname;
  //   const activeType = shoppingTypes.find(type => type.path === currentPath);
  //   if (activeType) {
  //     setActiveShoppingMallType(activeType.name);
  //   }
  // }, [location.pathname]);

  // ❌ REMOVED: Local handleNavigation - Using hook's handleNavigation
  // const handleNavigation = (path, typeName = null) => {
  //   if (typeName) setActiveShoppingMallType(typeName);
  //   navigate(path);
  // };

  const handlePropertyCategoryNavigation = (path) => navigate(path);

  // ❌ REMOVED: Local handleFilterChange - Using hook's handleFilterChange
  // const handleFilterChange = (filters) => {
  //   setAppliedFilters(filters);
  //   console.log("Applied Filters:", filters);
  // };

  /* ─── Shared sub-components ─────────────────────────────────────────── */

  const RentBuyDropdown = ({ isMobile = false }) => (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
        className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl w-full"
        style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
      >
        <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
        <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
        <span className="relative z-10">{activeButton}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10 ml-auto`} />
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
  );

  const SearchBar = () => (
    <div className="relative flex-1 group">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
      <input
        type="text"
        placeholder="Search shopping mall spaces by city, locality, or landmark"
        className="w-full pl-11 pr-11 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300"
      />
      <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
    </div>
  );

  const AdvancedFilterBtn = ({ fullWidth = false }) => (
    <button
      onClick={() => setShowFilterModal(true)}
      className={`group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden ${fullWidth ? "w-full justify-center" : ""}`}
      style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
    >
      <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
      <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
      <span className="relative z-10">Advanced Filters</span>
      {appliedFilters && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );

  const HouseTypeButtons = ({ scrollable = false }) => (
    <div className={`flex gap-2 ${scrollable ? "overflow-x-auto scrollbar-hide pb-1 flex-nowrap" : "flex-wrap"}`}>
      {shoppingTypes.map((type) => {
        const isActive = activeCommercialType === type.name;
        return (
          <button
            key={type.name}
            onClick={() => handleNavigation(type.path, type.name)}
            className={`group relative px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-500 whitespace-nowrap transform hover:-translate-y-1 hover:scale-105 overflow-hidden flex-shrink-0 ${
              isActive ? "text-teal-700" : "text-white/90 hover:text-white"
            }`}
            style={{
              background: isActive
                ? "#E8F5F2"
                : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
              backgroundSize: "200% 200%",
              border: isActive ? "3px solid #00695C" : "none",
              boxShadow: isActive ? "0 0 18px rgba(0,105,92,0.45)" : "none",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center gap-2">
              <Briefcase className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "rotate-12" : "group-hover:rotate-12"}`} />
              {type.name}
            </span>
          </button>
        );
      })}
    </div>
  );

  const PropertyCategoryButtons = () => (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 px-2 sm:px-4 w-full animate-fade-in-up delay-200">
      {propertyCategories.map((category, index) => (
        <button
          key={category.name}
          onClick={() => handlePropertyCategoryNavigation(category.path)}
          className="group relative px-3 sm:px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-2xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up w-full sm:w-auto"
          style={{
            animationDelay: `${index * 100}ms`,
            background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
            backgroundSize: "200% 200%"
          }}
        >
          <div className="absolute inset-0 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
            <span>{category.name}</span>
          </div>
        </button>
      ))}
    </div>
  );

  /* ─── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="w-full min-h-screen relative">

      {/* ── Background ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
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
                background: `radial-gradient(circle, rgba(38,166,154,0.4) 0%, rgba(0,105,92,0.2) 70%, transparent 100%)`,
                borderRadius: "50%",
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10">

        {/* HERO SECTION */}
        <section className="w-full relative flex items-center justify-center group py-2 md:py-4">
          <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
          <div className="max-w-none mx-auto px-4 sm:px-6 relative z-10 text-center w-full flex flex-col items-center justify-center gap-2">
            <div className="hidden sm:inline-flex mb-1 items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-lg border border-teal-300/20 animate-float-glow shadow-[0_0_30px_rgba(0,105,92,0.3)]">
              <Star className="w-4 h-4 text-teal-300 animate-spin-slow" fill="currentColor" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-sm font-medium">
                Shopping Mall Space Properties
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.5)]">
              Find Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">
                Shopping Mall Space
              </span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
              Discover premium retail spaces in prime shopping mall locations with high footfall and world-class amenities
            </p>
            <PropertyCategoryButtons />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STICKY NAVBAR  —  DESKTOP
        ══════════════════════════════════════════════ */}
        <div className="hidden md:block bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="max-w-none mx-auto px-6 py-4 space-y-4">
            <div className="flex gap-4 items-center">
              <RentBuyDropdown />
              <SearchBar />
              <AdvancedFilterBtn />
            </div>
            <HouseTypeButtons />
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            STICKY NAVBAR  —  MOBILE
        ══════════════════════════════════════════════ */}
        <div className="md:hidden bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 animate-slide-down">
          <div className="px-4 py-3 space-y-3">
            <div className="flex gap-2 items-center">
              <div className="w-[130px] flex-shrink-0">
                <RentBuyDropdown isMobile />
              </div>
              <div className="flex-1">
                <AdvancedFilterBtn fullWidth />
              </div>
            </div>
            <SearchBar />
            <HouseTypeButtons scrollable />
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            FILTER MODAL
        ══════════════════════════════════════════════ */}
        {showFilterModal && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[140px] px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <ShoppingMallSpaceFilter
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════ */}
        <div className="max-w-none mx-auto px-4 sm:px-6 py-6 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* ── Property Cards ── */}
            <div className="w-full lg:w-2/3">
              <section>
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : (
                  <PropertyList 
                    properties={properties}
                    emptyMessage="No shopping mall spaces available at the moment."
                    emptyIcon="🛒"
                    emptyTitle="No Shopping Mall Spaces Found"
                  />
                )}
              </section>
            </div>

            {/* ── Sidebar Filter ── */}
            <div className="hidden lg:block lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
                <ShoppingMallSpaceFilter
                  activeTab={activeButton}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════ */}
      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow { background-size: 200% 200%; animation: gradient-flow 20s ease infinite; }
        .animate-gradient-slow { background-size: 300% 300%; animation: gradient-flow 15s ease infinite; }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-flow 2s linear infinite; }
        .animate-gradient-shift-slow { background-size: 200% 200%; animation: gradient-flow 4s linear infinite; }
        .animate-gradient-text { background-size: 300% 300%; animation: gradient-flow 3s ease infinite; }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; }
        }
        .animate-particle-float { animation: particle-float 12s ease-in-out infinite; }

        @keyframes float-glow {
          0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
          50% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(0,105,92,0.5); }
        }
        .animate-float-glow { animation: float-glow 3s ease-in-out infinite; }

        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

        @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

        @keyframes slide-down { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
        .animate-slide-down-fast { animation: slide-down 0.2s ease-out forwards; }

        @keyframes slide-in-right { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }

        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .lg\:custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .lg\:custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, transparent, rgba(0,105,92,0.1), transparent);
          border-radius: 10px;
        }
        .lg\:custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        .lg\:custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #004D40, #00796B);
          box-shadow: 0 0 10px rgba(0,105,92,0.5);
        }
      `}</style>
    </div>
  );
};

export default ShoppingMallSpacePage;






























// import React, { useState, useEffect } from "react";
// import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Briefcase } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import backgroundImage from "../../assets/commercial/mainbg.png";
// import ShoppingMallSpaceFilter from "../../components/filters/Commercial/ShoppingMallSpaceFilter";
// import ShoppingMallSpace from "../../components/propertycard/Commercial/ShoppingMallSpace";

// const ShoppingMallSpacePage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeButton, setActiveButton] = useState("Rent");
//   const [activeShoppingMallType, setActiveShoppingMallType] = useState("Shopping Mall Space");
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState(null);

//   const propertyCategories = [
//     { name: "Individual", path: "/individual", icon: <Landmark className="w-4 h-4" /> },
//     { name: "Apartment", path: "/apartment", icon: <Building className="w-4 h-4" /> },
//     { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
//     { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
//   ];

//   const shoppingTypes = [
//     { name: "All", path: "/commercial" },
//     { name: "Office Space", path: "/commercial/office-space"},
//     { name: "Retail Shop", path: "/commercial/retail-shop" },
//     { name: "Showroom", path: "/commercial/showroom"},
//     { name: "Commercial Land / Plot", path: "/commercial/commercial-land-plot" },
//     { name: "Warehouse / Godown", path: "/commercial/warehouse-godown" },
//     { name: "Industrial Property / Factory", path: "/commercial/industrial-property-factory" },
//     { name: "Co-working Space", path: "/commercial/coworking-space" },
//     { name: "Business Center", path: "/commercial/business-center" },
//     { name: "Shopping Mall Space", path: "/commercial/shopping-mall-space" },
//     { name: "Commercial Complex", path: "/commercial/commercial-complex" },
//     { name: "Restaurant / Café Space", path: "/commercial/restaurant-cafe-space" },
//     { name: "Hotel / Lodge / Resort Property", path: "/commercial/hotel-lodge-resort-property" },
//     { name: "Clinic / Hospital Space", path: "/commercial/clinic-hospital-space" },
//     { name: "Educational Institution Property", path: "/commercial/educational-institution-property" },
//     { name: "IT Park / Tech Park Space", path: "/commercial/it-park-tech-park-space" },
//     { name: "Multiplex / Entertainment Space", path: "/commercial/multiplex-entertainment-space" },
//     { name: "Petrol Bunk / Fuel Station", path: "/commercial/petrol-bunk-fuel-station" },
//     { name: "Cold Storage / Logistics Hub", path: "/commercial/cold-storage-logistics-hub" },
//     { name: "Mixed-use Commercial Property", path: "/commercial/mixed-use-commercial-property" },
//     { name: "Agricultural Commercial Property", path: "/commercial/agricultural-commercial-property" }
//   ];

//   useEffect(() => {
//     const currentPath = location.pathname;
//     const activeType = shoppingTypes.find(type => type.path === currentPath);
//     if (activeType) {
//       setActiveShoppingMallType(activeType.name);
//     }
//   }, [location.pathname]);

//   const handleNavigation = (path, typeName = null) => {
//     if (typeName) setActiveShoppingMallType(typeName);
//     navigate(path);
//   };

//   const handlePropertyCategoryNavigation = (path) => navigate(path);

//   const handleFilterChange = (filters) => {
//     setAppliedFilters(filters);
//     console.log("Applied Filters:", filters);
//   };

//   /* ─── Shared sub-components ─────────────────────────────────────────── */

//   const RentBuyDropdown = ({ isMobile = false }) => (
//     <div className="relative">
//       <button
//         onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
//         className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl w-full"
//         style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
//       >
//         <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
//         <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//         <span className="relative z-10">{activeButton}</span>
//         <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10 ml-auto`} />
//       </button>

//       {openDropdown === "toggle" && (
//         <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30 animate-slide-down-fast">
//           {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
//             <React.Fragment key={item}>
//               <button
//                 onClick={() => { handleNavigation(`/${item.toLowerCase()}`); setActiveButton(item); setOpenDropdown(null); }}
//                 className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
//                 style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
//               >
//                 <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
//                   <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
//                   {item}
//                 </div>
//               </button>
//               {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
//             </React.Fragment>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const SearchBar = () => (
//     <div className="relative flex-1 group">
//       <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
//       <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
//       <input
//         type="text"
//         placeholder="Search shopping mall spaces by city, locality, or landmark"
//         className="w-full pl-11 pr-11 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300"
//       />
//       <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
//     </div>
//   );

//   const AdvancedFilterBtn = ({ fullWidth = false }) => (
//     <button
//       onClick={() => setShowFilterModal(true)}
//       className={`group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden ${fullWidth ? "w-full justify-center" : ""}`}
//       style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
//     >
//       <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
//       <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
//       <span className="relative z-10">Advanced Filters</span>
//       {appliedFilters && (
//         <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
//       )}
//     </button>
//   );

//   const HouseTypeButtons = ({ scrollable = false }) => (
//     <div className={`flex gap-2 ${scrollable ? "overflow-x-auto scrollbar-hide pb-1 flex-nowrap" : "flex-wrap"}`}>
//       {shoppingTypes.map((type) => {
//         const isActive = activeShoppingMallType === type.name;
//         return (
//           <button
//             key={type.name}
//             onClick={() => handleNavigation(type.path, type.name)}
//             className={`group relative px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-500 whitespace-nowrap transform hover:-translate-y-1 hover:scale-105 overflow-hidden flex-shrink-0 ${
//               isActive ? "text-teal-700" : "text-white/90 hover:text-white"
//             }`}
//             style={{
//               background: isActive
//                 ? "#E8F5F2"
//                 : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
//               backgroundSize: "200% 200%",
//               border: isActive ? "3px solid #00695C" : "none",
//               boxShadow: isActive ? "0 0 18px rgba(0,105,92,0.45)" : "none",
//             }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//             <span className="relative z-10 flex items-center gap-2">
//               <Briefcase className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "rotate-12" : "group-hover:rotate-12"}`} />
//               {type.name}
//             </span>
//           </button>
//         );
//       })}
//     </div>
//   );

//   const PropertyCategoryButtons = () => (
//     <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 px-2 sm:px-4 w-full animate-fade-in-up delay-200">
//       {propertyCategories.map((category, index) => (
//         <button
//           key={category.name}
//           onClick={() => handlePropertyCategoryNavigation(category.path)}
//           className="group relative px-3 sm:px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-2xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up w-full sm:w-auto"
//           style={{
//             animationDelay: `${index * 100}ms`,
//             background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
//             backgroundSize: "200% 200%"
//           }}
//         >
//           <div className="absolute inset-0 animate-gradient-shift"></div>
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
//           <div className="relative z-10 flex items-center justify-center gap-2">
//             <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
//             <span>{category.name}</span>
//           </div>
//         </button>
//       ))}
//     </div>
//   );

//   /* ─── Render ─────────────────────────────────────────────────────────── */

//   return (
//     <div className="w-full min-h-screen relative">

//       {/* ── Background ── */}
//       <div
//         className="fixed inset-0 z-0"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundAttachment: "fixed",
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
//                 background: `radial-gradient(circle, rgba(38,166,154,0.4) 0%, rgba(0,105,92,0.2) 70%, transparent 100%)`,
//                 borderRadius: "50%",
//               }}
//             ></div>
//           ))}
//         </div>
//       </div>

//       <div className="relative z-10">

//         {/* HERO SECTION */}
//         <section className="w-full relative flex items-center justify-center group py-2 md:py-4">
//           <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
//           <div className="max-w-none mx-auto px-4 sm:px-6 relative z-10 text-center w-full flex flex-col items-center justify-center gap-2">
//             <div className="hidden sm:inline-flex mb-1 items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-lg border border-teal-300/20 animate-float-glow shadow-[0_0_30px_rgba(0,105,92,0.3)]">
//               <Star className="w-4 h-4 text-teal-300 animate-spin-slow" fill="currentColor" />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-sm font-medium">
//                 Shopping Mall Space Properties
//               </span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.5)]">
//               Find Your Perfect{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">
//                 Shopping Mall Space
//               </span>
//             </h1>
//             <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
//               Discover premium retail spaces in prime shopping mall locations with high footfall and world-class amenities
//             </p>
//             <PropertyCategoryButtons />
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════════
//             STICKY NAVBAR  —  DESKTOP
//         ══════════════════════════════════════════════ */}
//         <div className="hidden md:block bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
//           <div className="max-w-none mx-auto px-6 py-4 space-y-4">
//             {/* Row 1: Dropdown + Search + Filter */}
//             <div className="flex gap-4 items-center">
//               <RentBuyDropdown />
//               <SearchBar />
//               <AdvancedFilterBtn />
//             </div>
//             {/* Row 2: House-type tabs */}
//             <HouseTypeButtons />
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════
//             STICKY NAVBAR  —  MOBILE (mirrors desktop)
//         ══════════════════════════════════════════════ */}
//         <div className="md:hidden bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 animate-slide-down">
//           <div className="px-4 py-3 space-y-3">

//             {/* Row 1: Rent/Buy dropdown + Advanced Filters */}
//             <div className="flex gap-2 items-center">
//               <div className="w-[130px] flex-shrink-0">
//                 <RentBuyDropdown isMobile />
//               </div>
//               <div className="flex-1">
//                 <AdvancedFilterBtn fullWidth />
//               </div>
//             </div>

//             {/* Row 2: Search bar (full width) */}
//             <SearchBar />

//             {/* Row 3: House type tabs (horizontal scroll) */}
//             <HouseTypeButtons scrollable />

//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════
//             FILTER MODAL  (mobile Advanced Filters tap)
//         ══════════════════════════════════════════════ */}
//         {showFilterModal && (
//           <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[140px] px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in">
//             <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
//               <ShoppingMallSpaceFilter
//                 activeTab={activeButton}
//                 onFilterChange={handleFilterChange}
//                 onClose={() => setShowFilterModal(false)}
//               />
//             </div>
//           </div>
//         )}

//         {/* ══════════════════════════════════════════════
//             MAIN CONTENT
//         ══════════════════════════════════════════════ */}
//         <div className="max-w-none mx-auto px-4 sm:px-6 py-6 lg:py-12">
//           <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

//             {/* ── Property Cards ── */}
//             <div className="w-full lg:w-2/3">
//               <section>
//                 <ShoppingMallSpace />
//               </section>
//             </div>

//             {/* ── Sidebar Filter (desktop only — on mobile the modal is used) ── */}
//             <div className="hidden lg:block lg:w-1/3 lg:relative">
//               <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
//                 <ShoppingMallSpaceFilter
//                   activeTab={activeButton}
//                   onFilterChange={handleFilterChange}
//                 />
//               </div>
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* ══════════════════════════════════════════════
//           STYLES
//       ══════════════════════════════════════════════ */}
//       <style jsx>{`
//         @keyframes gradient-flow {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-flow { background-size: 200% 200%; animation: gradient-flow 20s ease infinite; }
//         .animate-gradient-slow { background-size: 300% 300%; animation: gradient-flow 15s ease infinite; }
//         .animate-gradient-shift { background-size: 200% 200%; animation: gradient-flow 2s linear infinite; }
//         .animate-gradient-shift-slow { background-size: 200% 200%; animation: gradient-flow 4s linear infinite; }
//         .animate-gradient-text { background-size: 300% 300%; animation: gradient-flow 3s ease infinite; }

//         @keyframes particle-float {
//           0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
//           50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; }
//         }
//         .animate-particle-float { animation: particle-float 12s ease-in-out infinite; }

//         @keyframes float-glow {
//           0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
//           50% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(0,105,92,0.5); }
//         }
//         .animate-float-glow { animation: float-glow 3s ease-in-out infinite; }

//         @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
//         .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

//         @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

//         @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//         .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

//         @keyframes slide-down { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//         .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
//         .animate-slide-down-fast { animation: slide-down 0.2s ease-out forwards; }

//         @keyframes slide-in-right { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
//         .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }

//         .animate-spin-slow { animation: spin-slow 20s linear infinite; }

//         .delay-100 { animation-delay: 0.1s; }
//         .delay-200 { animation-delay: 0.2s; }
//         .delay-300 { animation-delay: 0.3s; }
//         .delay-400 { animation-delay: 0.4s; }
//         .delay-500 { animation-delay: 0.5s; }

//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }

//         .lg\:custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .lg\:custom-scrollbar::-webkit-scrollbar-track {
//           background: linear-gradient(to bottom, transparent, rgba(0,105,92,0.1), transparent);
//           border-radius: 10px;
//         }
//         .lg\:custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #00695C, #26A69A);
//           border-radius: 10px;
//         }
//         .lg\:custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #004D40, #00796B);
//           box-shadow: 0 0 10px rgba(0,105,92,0.5);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ShoppingMallSpacePage;