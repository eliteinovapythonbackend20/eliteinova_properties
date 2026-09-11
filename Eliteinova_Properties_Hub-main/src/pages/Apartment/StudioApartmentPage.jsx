import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Grid3X3, LayoutGrid, Hotel, HomeIcon, Building as BuildingIcon, Castle, Crown, Instagram, Globe, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import StudioApartmentFilter from "../../components/filters/Apartment/StudioApartmentFilter";

// Import images from assets
import individualImg from "../../assets/individualcat.jpg";
import commercialImg from "../../assets/commercialcat.jpg";
import landPlotsImg from "../../assets/landcat.jpg";
import hostelImg from "../../assets/hostelcat.jpg";
import bannerImg from "../../assets/Apartmentban.jpg";

// Import category images for apartment types
import rentalApartmentImg from "../../assets/rentalapart.jpg";
import servicedApartmentImg from "../../assets/servicedapart.jpg";
import leaseApartmentImg from "../../assets/leaseapart.jpg";
import residentialApartmentImg from "../../assets/residentialapart.jpg";
import gatedCommunityImg from "../../assets/gatedapart.jpg";
import studioApartmentImg from "../../assets/studioapar.jpg";
import duplexApartmentImg from "../../assets/duplexapar.jpg";
import luxuryApartmentImg from "../../assets/luxuryapar.jpg";
import condominiumImg from "../../assets/condoapar.jpg";
import penthouseApartmentImg from "../../assets/penthouseapar.jpg";

const StudioApartmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("Rent");
  const [activeApartmentType, setActiveApartmentType] = useState("Studio Apartment");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const propertyCategories = [
    { name: "Individual", path: "/individual", icon: <Building className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  // Property type categories with images for round display
  const propertyTypeCategories = [
    { 
      name: "All", 
      path: "/apartment", 
      image: null,
      icon: <Home className="w-5 h-5" />,
      isAll: true,
      displayName: "All",
      subText: ""
    },
    { 
      name: "Rental Apartment", 
      path: "/apartment/rental-apartment", 
      image: rentalApartmentImg,
      icon: <Building className="w-4 h-4" />,
      displayName: "Rental",
      subText: "Apartment"
    },
    { 
      name: "Serviced Apartment", 
      path: "/apartment/serviced-apartment", 
      image: servicedApartmentImg,
      icon: <Hotel className="w-4 h-4" />,
      displayName: "Serviced",
      subText: "Apartment"
    },
    { 
      name: "Lease Apartment", 
      path: "/apartment/lease-apartment", 
      image: leaseApartmentImg,
      icon: <Building2 className="w-4 h-4" />,
      displayName: "Lease",
      subText: "Apartment"
    },
    { 
      name: "Residential Apartment", 
      path: "/apartment/residential-apartments", 
      image: residentialApartmentImg,
      icon: <Building className="w-4 h-4" />,
      displayName: "Residential",
      subText: "Apartment"
    },
    { 
      name: "Gated Community Apartment", 
      path: "/apartment/gated-community-apartment", 
      image: gatedCommunityImg,
      icon: <Hotel className="w-4 h-4" />,
      displayName: "Gated",
      subText: "Community"
    },
    { 
      name: "Studio Apartment", 
      path: "/apartment/studio-apartment", 
      image: studioApartmentImg,
      icon: <LayoutGrid className="w-4 h-4" />,
      displayName: "Studio",
      subText: "Apartment"
    },
    { 
      name: "Duplex Apartment", 
      path: "/apartment/duplex-apartment", 
      image: duplexApartmentImg,
      icon: <Grid3X3 className="w-4 h-4" />,
      displayName: "Duplex",
      subText: "Apartment"
    },
    { 
      name: "Luxury Apartment", 
      path: "/apartment/luxury-apartment", 
      image: luxuryApartmentImg,
      icon: <Crown className="w-4 h-4" />,
      displayName: "Luxury",
      subText: "Apartment"
    },
    { 
      name: "Condominium (Condo)", 
      path: "/apartment/condominium", 
      image: condominiumImg,
      icon: <BuildingIcon className="w-4 h-4" />,
      displayName: "Condo",
      subText: "Apartment"
    },
    { 
      name: "Penthouse Apartment", 
      path: "/apartment/penthouse-apartment", 
      image: penthouseApartmentImg,
      icon: <Castle className="w-4 h-4" />,
      displayName: "Penthouse",
      subText: "Apartment"
    }
  ];

  const apartmentTypes = [
    { name: "All", path: "/apartment" },
    { name: "Rental Apartment", path: "/apartment/rental-apartment" },
    { name: "Serviced Apartment", path: "/apartment/serviced-apartment" },
    { name: "Lease Apartment", path: "/apartment/lease-apartment" },
    { name: "Residential Apartment", path: "/apartment/residential-apartments" },
    { name: "Gated Community Apartment", path: "/apartment/gated-community-apartment" },
    { name: "Studio Apartment", path: "/apartment/studio-apartment" },
    { name: "Duplex Apartment", path: "/apartment/duplex-apartment" },
    { name: "Luxury Apartment", path: "/apartment/luxury-apartment" },
    { name: "Condominium (Condo)", path: "/apartment/condominium" },
    { name: "Penthouse Apartment", path: "/apartment/penthouse-apartment" }
  ];

  // Diamond collage entries with imported images
  const bannerDiamonds = [
    {
      label: "Individual",
      path: "/individual",
      image: individualImg,
      position: "top"
    },
    {
      label: "Commercial",
      path: "/commercial",
      image: commercialImg,
      position: "left"
    },
    {
      label: "Land & Plots",
      path: "/land-plots",
      image: landPlotsImg,
      position: "right"
    },
    {
      label: "Hostels",
      path: "/hostel",
      image: hostelImg,
      position: "bottom"
    }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeType = apartmentTypes.find(type => type.path === currentPath);
    if (activeType) {
      setActiveApartmentType(activeType.name);
    }
  }, [location.pathname]);

  const handleNavigation = (path, typeName = null) => {
    if (typeName) setActiveApartmentType(typeName);
    navigate(path);
  };

  const handlePropertyCategoryNavigation = (path) => navigate(path);

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  // Diamond click handler
  const handleDiamondClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-teal-50 via-white to-teal-50">
      <div className="relative z-10">
        {/* ===================== BANNER - MODERATE SIZE ===================== */}
        <section className="relative overflow-hidden bg-[#E7EFEA]">
          {/* Decorative top shape */}
          <div className="absolute top-0 left-0 w-[250px] h-[85px] bg-[#D6E4DE] rounded-br-[70px]" />

          <div className="max-w-[1600px] mx-auto">
            <div className="grid lg:grid-cols-[35%_65%] min-h-[330px]">

              {/* LEFT CONTENT - MODERATE */}
              <div className="flex flex-col justify-center px-7 lg:px-10 py-7 z-20">

                <h1 className="leading-none">
                  <span className="block text-[28px] font-light text-[#042F2A]">
                    STUDIO
                  </span>

                  <span className="block text-[50px] font-black text-[#012D29] leading-tight">
                    APARTMENTS
                  </span>

                  <span className="block text-[30px] font-bold text-[#012D29] leading-tight">
                    FOR RENT
                  </span>
                </h1>

                <p className="mt-3 max-w-[340px] text-[#31544E] text-sm leading-relaxed">
                  Discover premium studio apartments,
                  cozy spaces and modern living in prime
                  locations.
                </p>

                <button
                  className="mt-4 w-fit px-6 py-2 rounded-lg text-white font-bold shadow-xl text-sm"
                  style={{
                    background: "linear-gradient(135deg,#00695C,#26A69A)"
                  }}
                >
                  EXPLORE NOW
                </button>
              </div>

              {/* RIGHT COLLAGE - MODERATE */}
              <div className="relative overflow-hidden">
                {/* Main Building Background */}
                <img
                  src={bannerImg}
                  alt="Building"
                  className="absolute inset-0 w-full h-full object-cover brightness-75"
                />

                {/* Soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#E7EFEA] via-transparent to-transparent" />

                {/* DIAMOND COLLAGE - MODERATE */}
                <div className="absolute inset-0 flex items-center justify-start pl-7 z-20">
                  <div className="relative w-[260px] h-[260px]">

                    {/* TOP DIAMOND - Individual */}
                    <div
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "0px",
                        left: "80px",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[0].path)}
                    >
                      <div
                        className="relative w-full h-full overflow-hidden shadow-xl"
                        style={{
                          transform: "rotate(45deg)",
                          borderRadius: "18px",
                          border: "3px solid rgba(255,255,255,0.85)",
                          boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={bannerDiamonds[0].image}
                          alt="Individual"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            transform: "rotate(-45deg) scale(1.3)",
                            transformOrigin: "center",
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10">
                          Individual
                        </span>
                      </div>
                    </div>

                    {/* LEFT DIAMOND - Commercial */}
                    <div
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "80px",
                        left: "0px",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[1].path)}
                    >
                      <div
                        className="relative w-full h-full overflow-hidden shadow-xl"
                        style={{
                          transform: "rotate(45deg)",
                          borderRadius: "18px",
                          border: "3px solid rgba(255,255,255,0.85)",
                          boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={bannerDiamonds[1].image}
                          alt="Commercial"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10">
                          Commercial
                        </span>
                      </div>
                    </div>

                    {/* RIGHT DIAMOND - Land & Plots */}
                    <div
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "80px",
                        left: "160px",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[2].path)}
                    >
                      <div
                        className="relative w-full h-full overflow-hidden shadow-xl"
                        style={{
                          transform: "rotate(45deg)",
                          borderRadius: "18px",
                          border: "3px solid rgba(255,255,255,0.85)",
                          boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={bannerDiamonds[2].image}
                          alt="Land & Plots"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[10px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-center leading-tight z-10">
                          Land & Plots
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM DIAMOND - Hostels */}
                    <div
                      className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30"
                      style={{
                        width: "100px",
                        height: "100px",
                        top: "160px",
                        left: "80px",
                      }}
                      onClick={() => handleDiamondClick(bannerDiamonds[3].path)}
                    >
                      <div
                        className="relative w-full h-full overflow-hidden shadow-xl"
                        style={{
                          transform: "rotate(45deg)",
                          borderRadius: "18px",
                          border: "3px solid rgba(255,255,255,0.85)",
                          boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={bannerDiamonds[3].image}
                          alt="Hostels"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            transform: "rotate(-45deg) scale(1.5)",
                            transformOrigin: "center",
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.05))",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-[11px] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] z-10">
                          Hostels
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =================== END BANNER =================== */}

        {/* =================== MENU - MODERATE SIZE =================== */}
        <div className="bg-gradient-to-r from-teal-50/95 via-emerald-50/95 to-teal-50/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500">
          <div className="max-w-none mx-auto px-6 py-3.5">
            {/* DESKTOP MENU - UNCHANGED */}
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
                      <button
                        onClick={() => {
                          handleNavigation("/buy");
                          setActiveButton("Buy");
                          setOpenDropdown(null);
                        }}
                        className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
                        className="w-full px-5 py-3 text-left text-sm font-semibold transition-all duration-300 group"
                        style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
                        className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
                        className="w-full px-5 py-3 text-left text-sm hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                      >
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
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
                    placeholder="Search studio apartments by city, locality, or landmark"
                    className="w-full pl-9 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                  <MapPin className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
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

              {/* ====== PROPERTY TYPE CATEGORIES - MODERATE SIZE (DESKTOP - UNCHANGED) ====== */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 md:gap-5 pt-1.5">
                {propertyTypeCategories.map((category) => {
                  const isActive = activeApartmentType === category.name || 
                    (category.name === "All" && activeApartmentType === "All");
                  
                  return (
                    <div
                      key={category.name}
                      className="group cursor-pointer flex flex-col items-center transition-all duration-300 hover:scale-105"
                      onClick={() => handlePropertyCategoryNavigation(category.path)}
                    >
                      {/* Round Image - Moderate Size */}
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
                      
                      {/* Label - Two lines: first line displayName, second line subText */}
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

            {/* =================== MOBILE MENU - MATCHES RENTALAPARTMENT PAGE =================== */}
            <div className="md:hidden space-y-3">
              <div className="flex gap-2 items-center">
                {/* Rent Button - Smaller */}
                <div className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
                    className="group relative px-2.5 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center gap-1.5 shadow-xl"
                    style={{ background: "linear-gradient(135deg, #00695C, #26A69A)", backgroundSize: "200% 200%" }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                    <Home className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10 text-xs">{activeButton}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
                  </button>

                  {openDropdown === "toggle" && (
                    <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[150px] border border-teal-200/30 animate-slide-down-fast">
                      {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
                        <React.Fragment key={item}>
                          <button
                            onClick={() => { handleNavigation(`/${item.toLowerCase()}`); setActiveButton(item); setOpenDropdown(null); }}
                            className="w-full px-4 py-2.5 text-left text-xs hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group"
                            style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
                          >
                            <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                              {item}
                            </div>
                          </button>
                          {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Bar - Smaller */}
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    placeholder="Search studio apartments..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border-2 border-teal-200/50 bg-teal-50/90 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 shadow-xl text-teal-900 placeholder-teal-400 transition-all duration-500 relative z-10 hover:shadow-2xl"
                  />
                </div>

                {/* Filter Button - Smaller */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="group relative px-2.5 py-1.5 rounded-lg text-white font-semibold text-xs flex items-center gap-1.5 shadow-xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                  <Filter className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10 hidden sm:inline text-xs">Filters</span>
                </button>
              </div>

              {/* ====== PROPERTY TYPE CATEGORIES - LARGER ON MOBILE (MATCHES RENTALAPARTMENT) ====== */}
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                {propertyTypeCategories.map((category) => {
                  const isActive = activeApartmentType === category.name ||
                    (category.name === "All" && activeApartmentType === "All");

                  return (
                    <div
                      key={category.name}
                      className="flex flex-col items-center flex-shrink-0 transition-transform duration-200 active:scale-95"
                      onClick={() => handlePropertyCategoryNavigation(category.path)}
                    >
                      {/* Round Image - Increased size for mobile */}
                      <div
                        className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                          isActive
                            ? 'border-[#00695C] shadow-[0_0_10px_rgba(0,105,92,0.3)]'
                            : 'border-gray-300'
                        }`}
                      >
                        {category.isAll ? (
                          <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                            isActive ? 'bg-[#00695C]' : 'bg-gray-100'
                          }`}>
                            <Home className={`w-5 h-5 transition-colors duration-300 ${
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

                      {/* Label - two short lines, same pattern as desktop */}
                      <div className="flex flex-col items-center mt-0.5">
                        <span className={`text-[8px] font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
                          isActive ? 'text-[#00695C]' : 'text-[#143B35]'
                        }`}>
                          {category.displayName || category.name}
                        </span>
                        {category.subText && (
                          <span className={`text-[8px] font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
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

        {/* =================== FILTER MODAL =================== */}
        {showFilterModal && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[120px] px-4 pb-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <StudioApartmentFilter
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
              />
            </div>
          </div>
        )}

        {/* =================== MAIN CONTENT =================== */}
        <div className="max-w-none mx-auto px-6 py-7 lg:py-11">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-2/3">
              <section>
                <StudioApartment />
              </section>
            </div>

            <div className="lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[110px] lg:max-h-[calc(100vh-130px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
                <StudioApartmentFilter
                  activeTab={activeButton}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
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

        @media (max-width: 1024px) {
          section .relative[style*="260px"] {
            transform: scale(0.85);
          }
        }
      `}</style>
    </div>
  );
};

export default StudioApartmentPage;