import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/ind1.jpg";
import RowHouseFilter from "../../components/filters/Individual/DuplexResidentialFilter";

const RowHousePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("Rent");
  const [activeHouseType, setActiveHouseType] = useState("Row House");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const propertyCategories = [
    { name: "Apartment", path: "/apartment", icon: <Building className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
  ];

  const houseTypes = [
    { name: "All", path: "/individual" },
    { name: "Independent House", path: "/individual/independent-house" },
    { name: "Independent Villa", path: "/individual/independent-villa" },
    { name: "Residential Apartment", path: "/individual/residential-apartment" },
    { name: "Duplex Residential Unit", path: "/individual/duplex-residential-unit" },
    { name: "Row House", path: "/individual/row-house" }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeType = houseTypes.find(type => type.path === currentPath);
    if (activeType) {
      setActiveHouseType(activeType.name);
    }
  }, [location.pathname]);

  const handleNavigation = (path, typeName = null) => {
    if (typeName) {
      setActiveHouseType(typeName);
    }
    navigate(path);
  };

  const handlePropertyCategoryNavigation = (path) => {
    navigate(path);
  };

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
    // Here you can make API call to fetch filtered properties
  };

  return (
    <div className="w-full min-h-screen relative">
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
        </div>
      </div>

      <div className="relative z-10">
        <section className="w-full h-[150px] md:h-[200px] relative flex items-center justify-center overflow-hidden group pb-6">
          <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
          
          <div className="max-w-none mx-auto px-6 relative z-10 text-center w-full flex flex-col items-center justify-center gap-1">
            <div className="mb-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-lg border border-teal-300/20 animate-float-glow shadow-[0_0_30px_rgba(0,105,92,0.3)]">
              <Star className="w-4 h-4 text-teal-300 animate-spin-slow" fill="currentColor" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-sm font-medium">
                Row House Properties
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.5)]">
              Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">Row House</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/90 mb-2 max-w-3xl mx-auto leading-relaxed">
              Discover charming row houses with community living, modern amenities, and prime locations
            </p>

            <div className="flex flex-wrap justify-center gap-2 px-4 animate-fade-in-up delay-200">
              {propertyCategories.map((category, index) => (
                <button
                  key={category.name}
                  onClick={() => handlePropertyCategoryNavigation(category.path)}
                  className="group relative px-4 py-2 rounded-xl text-white font-semibold text-sm shadow-2xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
                    backgroundSize: "200% 200%"
                  }}
                >
                  <div className="absolute inset-0 animate-gradient-shift"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </button>
              ))}
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
                    className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #00695C, #26A69A)",
                      backgroundSize: "200% 200%"
                    }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow"></div>
                    <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">{activeButton}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === "toggle" ? 'rotate-180' : ''} relative z-10`} />
                  </button>

                  {openDropdown === "toggle" && (
                    <div className="absolute top-full left-0 mt-2 bg-teal-50/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] border border-teal-200/30 animate-slide-down-fast">
                      <button onClick={() => { handleNavigation("/buy"); setActiveButton("Buy"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Buy
                        </div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button onClick={() => { handleNavigation("/rent"); setActiveButton("Rent"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base font-semibold transition-all duration-300 group" style={{ color: "#00695C", backgroundColor: "#e0f2f1" }}>
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Rent
                        </div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button onClick={() => { handleNavigation("/lease"); setActiveButton("Lease"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group">
                        <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                          Lease
                        </div>
                      </button>
                      <div className="h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent"></div>
                      <button onClick={() => { handleNavigation("/sell"); setActiveButton("Sell"); setOpenDropdown(null); }} className="w-full px-5 py-3.5 text-left text-base hover:bg-teal-100/50 transition-all duration-300 text-teal-900 font-medium group">
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
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-600 group-hover:scale-110 transition-all duration-300 z-10" />
                  <input
                    type="text"
                    placeholder="Search row houses by city, locality, or landmark"
                    className="w-full pl-10 pr-5 py-2 rounded-xl border-2 border-teal-200/50 bg-teal-50/90 text-sm"
                  />
                  <MapPin className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-300 group-hover:text-emerald-500 group-hover:rotate-12 transition-all duration-300 z-10" />
                </div>

                {/* Advanced Filter Button */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="group relative px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 transform hover:scale-105 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #00897B, #26A69A)",
                    backgroundSize: "200% 200%"
                  }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow"></div>
                  <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                  <span className="relative z-10">Advanced Filters</span>
                  {appliedFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {houseTypes.map((type, index) => {
                  const isActive = activeHouseType === type.name;
                  return (
                    <button
                      key={type.name}
                      onClick={() => handleNavigation(type.path, type.name)}
                      className={`group relative px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-500 whitespace-nowrap transform hover:-translate-y-1 hover:scale-105 overflow-hidden ${
                        isActive
                          ? "text-teal-700"
                          : "text-white/90 hover:text-white"
                      }`}
                      style={{
                        background: isActive
                          ? "#E8F5F2"
                          : "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
                        backgroundSize: "200% 200%",
                        border: isActive ? "3px solid #00695C" : "none",
                        boxShadow: isActive
                          ? "0 0 18px rgba(0,105,92,0.45)"
                          : "none",
                      }}
                    >
                      <div className={`absolute inset-0 animate-gradient-shift-slow ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-500'}`}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      {isActive && (
                        <div className="absolute inset-0 rounded-lg bg-white/10"></div>
                      )}
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <span className="relative z-10 flex items-center gap-3">
                        <Home className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'rotate-12' : 'group-hover:rotate-12'}`} />
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:hidden space-y-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {houseTypes.map((type, index) => {
                  const isActive = activeHouseType === type.name;
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
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Filter className="w-4 h-4" />
                Filter Properties
              </button>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        {showFilterModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-4 pb-4 px-4 bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
           <div className="relative w-full max-w-2xl mt-14">
              <RowHouseFilter 
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
              />
            </div>
          </div>
        )}

        <div className="max-w-none mx-auto px-6 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-2/3">
              <section>
                <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/90 to-teal-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 text-center border border-teal-200/30 hover:shadow-[0_0_60px_rgba(0,105,92,0.3)] transition-all duration-700 group animate-fade-in-up">
                  <div className="absolute inset-0 opacity-[0.03] rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent animate-shimmer"></div>
                  </div>
                  
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-emerald-100 border border-teal-200">
                    <span className="text-sm font-medium text-teal-700">Active Filter:</span>
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                      {activeHouseType}
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
                    <Home className="w-12 h-12 text-white group-hover:rotate-12 transition-transform duration-700 relative z-10" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">
                    {activeHouseType === "Row House" ? "Row Houses" : activeHouseType} 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 animate-gradient-text-slow"> Coming Soon</span>
                  </h2>
                  
                  <p className="text-teal-800 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-teal-100/30 rounded-2xl p-6 border border-teal-200/20">
                    Beautiful row houses with community living and modern amenities coming to your favorite neighborhoods.
                    <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-xl">
                      Launching with exclusive offers!
                    </span>
                  </p>
                  
                  {appliedFilters && (
                    <div className="mt-6 p-4 bg-teal-100/50 rounded-xl">
                      <p className="text-sm text-teal-700 font-semibold">Filters Applied:</p>
                      <p className="text-xs text-teal-600 mt-1">
                        {Object.keys(appliedFilters).filter(key => appliedFilters[key] && (typeof appliedFilters[key] !== 'object' || Object.keys(appliedFilters[key]).length > 0)).length} filters active
                      </p>
                    </div>
                  )}
                  
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
              </section>
            </div>

            <div className="lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
                {/* Desktop Sidebar Filter */}
                <div className="hidden lg:block">
                  <RowHouseFilter 
                    activeTab={activeButton}
                    onFilterChange={handleFilterChange}
                  />
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
        @keyframes float-glow {
          0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
          50% { transform: translateY(-5px); box-shadow: 0 0 40px rgba(0,105,92,0.5); }
        }
        .animate-float-glow {
          animation: float-glow 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
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
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
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

export default RowHousePage;